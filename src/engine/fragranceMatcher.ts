import { AnyanovCoordinates, PerfumeItem, OutfitStack, NoteEngineAnalysis } from '../types';
import { PERFUME_DATABASE } from '../data/fragrances';
import { GOLDEN_PERFUMES_21 } from '../data/golden21';
import { analyzePeriodicNotesSynergy } from './periodicNotesEngine';

export interface RankedPerfumeCandidate {
  item: PerfumeItem;
  score: number;
  distance: number;
  reasons: string[];
  isOwned: boolean;
  notesAnalysis: NoteEngineAnalysis;
}

export interface FragranceMatchResult {
  // Главный чемпион (№1)
  champion: PerfumeItem;
  championScore: number;
  championReasons: string[];

  // Альтернативный выбор (№2 - контрастный дублёр)
  alternative?: PerfumeItem;
  alternativeScore?: number;
  alternativeDifference?: string;

  // Все ранжированные кандидаты каталога под текущую ситуацию (для искушенного покупателя / витрины категории)
  allCatalogCandidates: RankedPerfumeCandidate[];

  // Поля обратной совместимости (для существующих компонентов)
  perfume: PerfumeItem;
  compatibilityScore: number;
  synergyVerdict: string;
  isFromShelf: boolean;
  idealCatalogMatch: PerfumeItem;
  hasWardrobeGap: boolean;
  gapAdvice?: string;
  totalShelfCount: number;
  notesEngine: NoteEngineAnalysis;
}

export function matchAnyanovPerfume(
  coords: AnyanovCoordinates,
  userShelfIds?: string[],
  forceCatalogMode: boolean = false,
  is21Mode: boolean = false,
  stack?: OutfitStack
): FragranceMatchResult {
  const { socialX, thermoY, temperatureC = 22 } = coords;
  const catalogPool = is21Mode ? GOLDEN_PERFUMES_21 : PERFUME_DATABASE;

  const dummyStack: OutfitStack = stack || {
    l4: null,
    l3: { id: 'def_l3', layer: 'L3', name: 'Сорочка', category: 'Сорочка', formalIndex: 2, minTemp: 10, maxTemp: 25, color: '#fff', colorName: 'Белый', fabric: 'Хлопок', description: '', silhouette: 'structured' },
    l2: { id: 'def_l2', layer: 'L2', name: 'Брюки', category: 'Брюки', formalIndex: 2, minTemp: 10, maxTemp: 25, color: '#333', colorName: 'Серый', fabric: 'Шерсть', description: '', silhouette: 'structured' },
    l1: { id: 'def_l1', layer: 'L1', name: 'Обувь', category: 'Обувь', formalIndex: 2, minTemp: 10, maxTemp: 25, color: '#111', colorName: 'Черный', fabric: 'Кожа', description: '', silhouette: 'structured' },
  };

  // Оценка кандидата: Координаты (X, Y) как ЦЕЛЬ, Периодическая система нот как ДВИГАТЕЛЬ, Контекст среды
  const scoreCandidate = (item: PerfumeItem): { score: number; distance: number; notesAnalysis: NoteEngineAnalysis; reasons: string[] } => {
    const dx = item.xCoord - socialX;
    const dy = item.yCoord - thermoY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const notesAnalysis = analyzePeriodicNotesSynergy(item.pyramid, dummyStack);

    // Базовый балл по пространственной цели (X, Y)
    const targetScore = Math.max(0, 100 - distance * 36);

    // Вклад нотного двигателя (резонанс нот с тканями L1-L4 и штрафы за диссонансы)
    const positivePairsBonus = Math.min(10, notesAnalysis.resonantPairs.length * 2.5);
    const clashPenalty = notesAnalysis.clashes.length * 15;

    // Штраф за диаметрально противоположный квадрант
    const isOppositeQuadrant = (item.xCoord * socialX < -0.05) && (item.yCoord * thermoY < -0.05);
    const quadrantPenalty = isOppositeQuadrant ? 30 : (distance > 1.2 ? 15 : 0);

    // Соответствие диффузии температуре среды
    let envBonus = 0;
    if (temperatureC > 24 && (item.diffusion === 'Ударная' || item.yCoord < -0.5)) {
      envBonus -= 15; // тяжелые шлейфы душат в жару
    } else if (temperatureC < 10 && (item.diffusion === 'Шлейфовая' || item.diffusion === 'Ударная')) {
      envBonus += 6; // стойкий шлейф согревает в холод
    } else if (item.diffusion === 'Интимная' && Math.abs(socialX) < 0.3) {
      envBonus += 4;
    }

    const totalScore = Math.max(
      20,
      Math.min(99, Math.round(targetScore * 0.65 + notesAnalysis.resonanceScore * 0.35 + positivePairsBonus + envBonus - clashPenalty - quadrantPenalty))
    );

    // 3 ключевые причины победы
    const reasons: string[] = [];

    // Причина 1: Социально-психологическая цель
    if (socialX <= 0 && thermoY >= 0) {
      reasons.push('Держит безупречную деловую дистанцию и стимулирует аналитический фокус');
    } else if (socialX > 0 && thermoY >= 0) {
      reasons.push('Создает ауру солнечной свободы, свежести и легкого непринужденного общения');
    } else if (socialX <= 0 && thermoY < 0) {
      reasons.push('Проецирует несокрушимый авторитет, статус и твердый иерархический вес');
    } else {
      reasons.push('Формирует притягательный вечерний уют, бархатный магнетизм и соблазн');
    }

    // Причина 2: Ткани и слои
    if (notesAnalysis.resonantPairs.length > 0) {
      const p = notesAnalysis.resonantPairs[0];
      reasons.push(`Нота «${p.note.name}» гармонично резонирует с тканью «${p.fabric}» (${p.layer})`);
    } else {
      reasons.push('Пирамида нот плавно ложится на фактуру собранного аутфита без диссонансов');
    }

    // Причина 3: Диффузия и физика среды
    if (item.diffusion === 'Умеренная' || item.diffusion === 'Интимная') {
      reasons.push(`Диффузия «${item.diffusion}» безопасна для кабинетов и залов: звучит интеллигентно`);
    } else {
      reasons.push(`Диффузия «${item.diffusion}» создает уверенный шлейф для открытых пространств`);
    }

    return {
      score: totalScore,
      distance,
      notesAnalysis,
      reasons,
    };
  };

  const scoreCache = new Map<string, ReturnType<typeof scoreCandidate>>();
  const getScore = (item: PerfumeItem) => {
    let res = scoreCache.get(item.id);
    if (!res) {
      res = scoreCandidate(item);
      scoreCache.set(item.id, res);
    }
    return res;
  };

  // 1. Абсолютный эталон из каталога
  let idealCatalogMatch = catalogPool[0];
  let bestIdealScore = -Infinity;

  for (const item of catalogPool) {
    const scored = getScore(item);
    if (scored.score > bestIdealScore) {
      bestIdealScore = scored.score;
      idealCatalogMatch = item;
    }
  }

  // 2. Доступная полка пользователя
  const ownedItems = (userShelfIds && userShelfIds.length > 0)
    ? PERFUME_DATABASE.filter((p) => userShelfIds.includes(p.id))
    : [];

  const useShelf = !forceCatalogMode && ownedItems.length > 0;
  const targetPool = useShelf ? ownedItems : catalogPool;

  // 3. Ранжируем всех кандидатов целевого пула и всего каталога
  const rankedCandidates = targetPool
    .map((item) => ({ item, ...getScore(item) }))
    .sort((a, b) => b.score - a.score);

  // Полный ранжированный каталог для витрины категории / искушенного покупателя
  const allCatalogCandidates: RankedPerfumeCandidate[] = catalogPool
    .map((item) => {
      const scored = getScore(item);
      return {
        item,
        score: scored.score,
        distance: scored.distance,
        reasons: scored.reasons,
        isOwned: (userShelfIds || []).includes(item.id),
        notesAnalysis: scored.notesAnalysis,
      };
    })
    .sort((a, b) => b.score - a.score);

  const championCandidate = rankedCandidates[0] || {
    item: catalogPool[0],
    score: 85,
    distance: 0.5,
    notesAnalysis: getScore(catalogPool[0]).notesAnalysis,
    reasons: ['Сбалансированное попадание в образ'],
  };

  const bestPerfume = championCandidate.item;
  const compatibilityScore = championCandidate.score;
  const bestNotesEngine = championCandidate.notesAnalysis;

  // 4. Поиск контрастной Альтернативы (№2 с другим характером)
  let alternativeItem: PerfumeItem | undefined = undefined;
  let alternativeScore: number | undefined = undefined;
  let alternativeDifference: string | undefined = undefined;

  if (rankedCandidates.length > 1) {
    // Ищем кандидата с максимальным балом, но отличающимся звучанием (xCoord или yCoord отличаются хотя бы на 0.2)
    const runnerUp = rankedCandidates.slice(1).find((c) => {
      const dxDiff = Math.abs(c.item.xCoord - bestPerfume.xCoord);
      const dyDiff = Math.abs(c.item.yCoord - bestPerfume.yCoord);
      return (dxDiff >= 0.15 || dyDiff >= 0.15);
    }) || rankedCandidates[1];

    if (runnerUp && runnerUp.item.id !== bestPerfume.id) {
      alternativeItem = runnerUp.item;
      alternativeScore = runnerUp.score;

      if (runnerUp.item.xCoord > bestPerfume.xCoord) {
        alternativeDifference = 'Более открытый, тактильный и притягательный вечерний характер';
      } else if (runnerUp.item.xCoord < bestPerfume.xCoord) {
        alternativeDifference = 'Более строгий, монолитный и дистанцирующий акцент';
      } else if (runnerUp.item.yCoord > bestPerfume.yCoord) {
        alternativeDifference = 'Более прохладный, легкий и искрящийся цитрусовый тон';
      } else {
        alternativeDifference = 'Более глубокий, согревающий и смолистый шлейф';
      }
    }
  }

  // 5. Анализ гардеробной бреши (Wardrobe Gap)
  let hasWardrobeGap = false;
  let gapAdvice: string | undefined = undefined;

  if (useShelf && bestPerfume.id !== idealCatalogMatch.id) {
    const scoreDelta = bestIdealScore - compatibilityScore;
    if (scoreDelta >= 10 || compatibilityScore < 82) {
      hasWardrobeGap = true;
      gapAdvice = `В вашем личном гардеробе ольфакторный пробел: текущий образ требует ${
        socialX <= 0 ? 'строгой дистанции и статуса' : 'открытого магнетизма и тепла'
      }. Лучший из имеющихся у вас — ${bestPerfume.name} от ${bestPerfume.brand} (совместимость ${compatibilityScore}%), но эталонным решением был бы ${idealCatalogMatch.name} (${idealCatalogMatch.brand}) с идеальным нотным резонансом (${bestIdealScore}%).`;
    }
  }

  // 6. Экспертный вердикт синергии
  let synergyVerdict = '';
  const prefix = useShelf ? 'С вашей полки: ' : '';

  if (socialX <= 0 && thermoY >= 0) {
    synergyVerdict = `${prefix}${bestPerfume.name} (${bestPerfume.brand}) выстраивает идеальный ольфакторный щит. Прохладные верхние ноты (${bestPerfume.pyramid.top.slice(0, 3).join(', ')}) поддерживают строгую архитектуру пиджака и сорочки, кристаллизуя деловой фокус.`;
  } else if (socialX > 0 && thermoY >= 0) {
    synergyVerdict = `${prefix}${bestPerfume.name} (${bestPerfume.brand}) наполняет образ солнечным воздухом. Акватика и цитрусы сливаются со свободным дыханием натурального льна, создавая ощущение чистоты, непринужденности и летней свободы.`;
  } else if (socialX <= 0 && thermoY < 0) {
    synergyVerdict = `${prefix}${bestPerfume.name} (${bestPerfume.brand}) придает пальто и костюмной шерсти монументальный вес. Базовые ноты (${bestPerfume.pyramid.base.slice(0, 3).join(', ')}) создают глубокий, авторитетный шлейф непререкаемой уверенности.`;
  } else {
    synergyVerdict = `${prefix}${bestPerfume.name} (${bestPerfume.brand}) вступает в резонанс с тактильным кашемиром и трикотажем. Теплые ноты (${bestPerfume.pyramid.heart.slice(0, 3).join(', ')}) сокращают дистанцию, формируя ауру манящего вечернего уюта и соблазна.`;
  }

  if (bestNotesEngine.resonantPairs.length > 0) {
    const topPair = bestNotesEngine.resonantPairs[0];
    synergyVerdict += ` Двигатель нот: ${topPair.note.name} (${topPair.note.symbol}) входит в консонанс со слоем ${topPair.layer} (${topPair.fabric}).`;
  }

  return {
    champion: bestPerfume,
    championScore: compatibilityScore,
    championReasons: championCandidate.reasons,

    alternative: alternativeItem,
    alternativeScore,
    alternativeDifference,

    allCatalogCandidates,

    perfume: bestPerfume,
    compatibilityScore,
    synergyVerdict,
    isFromShelf: useShelf,
    idealCatalogMatch,
    hasWardrobeGap,
    gapAdvice,
    totalShelfCount: ownedItems.length,
    notesEngine: bestNotesEngine,
  };
}
