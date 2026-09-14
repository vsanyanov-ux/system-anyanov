import { AnyanovCoordinates, PerfumeItem, OutfitStack, NoteEngineAnalysis } from '../types';
import { PERFUME_DATABASE } from '../data/fragrances';
import { GOLDEN_PERFUMES_21 } from '../data/golden21';
import { analyzePeriodicNotesSynergy } from './periodicNotesEngine';

export interface FragranceMatchResult {
  perfume: PerfumeItem;
  synergyVerdict: string;
  compatibilityScore: number;
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
  const { socialX, thermoY } = coords;
  const catalogPool = is21Mode ? GOLDEN_PERFUMES_21 : PERFUME_DATABASE;

  // Оценка кандидата: Координаты (X, Y) как ЦЕЛЬ, Периодическая система нот как ДВИГАТЕЛЬ
  const scoreCandidate = (item: PerfumeItem): { score: number; distance: number; notesAnalysis: NoteEngineAnalysis } => {
    const dx = item.xCoord - socialX;
    const dy = item.yCoord - thermoY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Анализ нот против слоев аутфита
    const dummyStack: OutfitStack = stack || {
      l4: null,
      l3: { id: 'def_l3', layer: 'L3', name: 'Сорочка', category: 'Сорочка', formalIndex: 2, minTemp: 10, maxTemp: 25, color: '#fff', colorName: 'Белый', fabric: 'Хлопок', description: '', silhouette: 'structured' },
      l2: { id: 'def_l2', layer: 'L2', name: 'Брюки', category: 'Брюки', formalIndex: 2, minTemp: 10, maxTemp: 25, color: '#333', colorName: 'Серый', fabric: 'Шерсть', description: '', silhouette: 'structured' },
      l1: { id: 'def_l1', layer: 'L1', name: 'Обувь', category: 'Обувь', formalIndex: 2, minTemp: 10, maxTemp: 25, color: '#111', colorName: 'Черный', fabric: 'Кожа', description: '', silhouette: 'structured' },
    };

    const notesAnalysis = analyzePeriodicNotesSynergy(item.pyramid, dummyStack);

    // Базовый балл по пространственной цели (X, Y)
    const targetScore = Math.max(0, 100 - distance * 32);

    // Вклад нотного двигателя (резонанс нот с тканями L1-L4 и штрафы за диссонансы)
    const resonanceBonus = (notesAnalysis.resonanceScore - 75) * 0.35;
    const positivePairsBonus = Math.min(8, notesAnalysis.resonantPairs.length * 2);
    const clashPenalty = notesAnalysis.clashes.length * 15;

    const totalScore = Math.max(
      50,
      Math.min(99, Math.round(targetScore * 0.70 + notesAnalysis.resonanceScore * 0.30 + positivePairsBonus - clashPenalty))
    );

    return {
      score: totalScore,
      distance,
      notesAnalysis,
    };
  };

  // 1. Находим абсолютный идеал из всей библиотеки
  let idealCatalogMatch = catalogPool[0];
  let bestIdealScore = -Infinity;

  for (const item of catalogPool) {
    const scored = scoreCandidate(item);
    if (scored.score > bestIdealScore) {
      bestIdealScore = scored.score;
      idealCatalogMatch = item;
    }
  }

  // 2. Формируем доступную полку пользователя
  const ownedItems = (userShelfIds && userShelfIds.length > 0)
    ? catalogPool.filter((p) => userShelfIds.includes(p.id))
    : [];

  const useShelf = !forceCatalogMode && ownedItems.length > 0;
  const targetPool = useShelf ? ownedItems : catalogPool;

  // 3. Находим лучший флакон из доступного пула с использованием нотного двигателя
  let bestPerfume = targetPool[0];
  let bestPerfumeScore = -Infinity;
  let bestPerfumeDistance = Infinity;
  let bestNotesEngine: NoteEngineAnalysis = scoreCandidate(targetPool[0]).notesAnalysis;

  for (const item of targetPool) {
    const scored = scoreCandidate(item);
    if (scored.score > bestPerfumeScore) {
      bestPerfumeScore = scored.score;
      bestPerfumeDistance = scored.distance;
      bestPerfume = item;
      bestNotesEngine = scored.notesAnalysis;
    }
  }

  const compatibilityScore = bestPerfumeScore;

  // 4. Анализ гардеробной бреши (Wardrobe Gap)
  let hasWardrobeGap = false;
  let gapAdvice: string | undefined = undefined;

  if (useShelf && bestPerfume.id !== idealCatalogMatch.id) {
    const scoreDelta = bestIdealScore - bestPerfumeScore;
    if (scoreDelta >= 10 || compatibilityScore < 82) {
      hasWardrobeGap = true;
      gapAdvice = `В вашем личном гардеробе ольфакторный пробел: текущий образ требует ${
        socialX <= 0 ? 'строгой дистанции и статуса' : 'открытого магнетизма и тепла'
      }. Лучший из имеющихся у вас — ${bestPerfume.name} от ${bestPerfume.brand} (совместимость ${compatibilityScore}%), но эталонным решением был бы ${idealCatalogMatch.name} (${idealCatalogMatch.brand}) с идеальным нотным резонансом (${bestIdealScore}%).`;
    }
  }

  // 5. Экспертный вердикт синергии
  let synergyVerdict = '';
  const prefix = useShelf ? 'С вашей полки: ' : '';

  // Основная канва
  if (socialX <= 0 && thermoY >= 0) {
    synergyVerdict = `${prefix}${bestPerfume.name} (${bestPerfume.brand}) выстраивает идеальный ольфакторный щит. Прохладные верхние ноты (${bestPerfume.pyramid.top.slice(0, 3).join(', ')}) поддерживают строгую архитектуру пиджака и сорочки, кристаллизуя деловой фокус.`;
  } else if (socialX > 0 && thermoY >= 0) {
    synergyVerdict = `${prefix}${bestPerfume.name} (${bestPerfume.brand}) наполняет образ солнечным воздухом. Акватика и цитрусы сливаются со свободным дыханием натурального льна, создавая ощущение чистоты, непринужденности и летней свободы.`;
  } else if (socialX <= 0 && thermoY < 0) {
    synergyVerdict = `${prefix}${bestPerfume.name} (${bestPerfume.brand}) придает пальто и костюмной шерсти монументальный вес. Базовые ноты (${bestPerfume.pyramid.base.slice(0, 3).join(', ')}) создают глубокий, авторитетный шлейф непререкаемой уверенности.`;
  } else {
    synergyVerdict = `${prefix}${bestPerfume.name} (${bestPerfume.brand}) вступает в резонанс с тактильным кашемиром и трикотажем. Теплые ноты (${bestPerfume.pyramid.heart.slice(0, 3).join(', ')}) сокращают дистанцию, формируя ауру манящего вечернего уюта и соблазна.`;
  }

  // Дополняем фактом резонанса из нотного двигателя
  if (bestNotesEngine.resonantPairs.length > 0) {
    const topPair = bestNotesEngine.resonantPairs[0];
    synergyVerdict += ` Двигатель нот: ${topPair.note.name} (${topPair.note.symbol}) входит в консонанс со слоем ${topPair.layer} (${topPair.fabric}).`;
  }

  return {
    perfume: bestPerfume,
    synergyVerdict,
    compatibilityScore,
    isFromShelf: useShelf,
    idealCatalogMatch,
    hasWardrobeGap,
    gapAdvice,
    totalShelfCount: ownedItems.length,
    notesEngine: bestNotesEngine,
  };
}
