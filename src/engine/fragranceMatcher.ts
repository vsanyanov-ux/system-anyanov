import { AnyanovCoordinates, PerfumeItem } from '../types';
import { PERFUME_DATABASE } from '../data/fragrances';

export interface FragranceMatchResult {
  perfume: PerfumeItem;
  synergyVerdict: string;
  compatibilityScore: number;
  isFromShelf: boolean;
  idealCatalogMatch: PerfumeItem;
  hasWardrobeGap: boolean;
  gapAdvice?: string;
  totalShelfCount: number;
}

export function matchAnyanovPerfume(
  coords: AnyanovCoordinates,
  userShelfIds?: string[],
  forceCatalogMode: boolean = false
): FragranceMatchResult {
  const { socialX, thermoY } = coords;

  // 1. Находим абсолютный идеал из всей библиотеки
  let idealCatalogMatch = PERFUME_DATABASE[0];
  let minIdealDist = Infinity;

  for (const item of PERFUME_DATABASE) {
    const dx = item.xCoord - socialX;
    const dy = item.yCoord - thermoY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < minIdealDist) {
      minIdealDist = dist;
      idealCatalogMatch = item;
    }
  }

  // 2. Формируем доступную полку пользователя
  const ownedItems = (userShelfIds && userShelfIds.length > 0)
    ? PERFUME_DATABASE.filter((p) => userShelfIds.includes(p.id))
    : [];

  const useShelf = !forceCatalogMode && ownedItems.length > 0;
  const targetPool = useShelf ? ownedItems : PERFUME_DATABASE;

  // 3. Находим лучший флакон из доступного пула
  let bestPerfume = targetPool[0];
  let minDistance = Infinity;

  for (const item of targetPool) {
    const dx = item.xCoord - socialX;
    const dy = item.yCoord - thermoY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < minDistance) {
      minDistance = distance;
      bestPerfume = item;
    }
  }

  // 4. Оценка совместимости (от 65% до 99%)
  const compatibilityScore = Math.max(
    65,
    Math.min(99, Math.round(100 - minDistance * 26))
  );

  // 5. Анализ гардеробной бреши (Wardrobe Gap)
  let hasWardrobeGap = false;
  let gapAdvice: string | undefined = undefined;

  if (useShelf && bestPerfume.id !== idealCatalogMatch.id) {
    const distDelta = minDistance - minIdealDist;
    // Если разница расстояний существенная (> 0.35) или совместимость полки упала ниже 84%
    if (distDelta > 0.35 || compatibilityScore < 84) {
      hasWardrobeGap = true;
      gapAdvice = `В вашем личном гардеробе ароматов ольфакторный пробел: текущий образ требует ${
        socialX <= 0 ? 'строгой дистанции и статуса' : 'открытого магнетизма и тепла'
      }. Лучший из имеющихся у вас — ${bestPerfume.name} от ${bestPerfume.brand} (совместимость ${compatibilityScore}%), но эталонным решением был бы ${idealCatalogMatch.name} (${idealCatalogMatch.brand}).`;
    }
  }

  // 6. Формирование экспертного вердикта синергии
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

  return {
    perfume: bestPerfume,
    synergyVerdict,
    compatibilityScore,
    isFromShelf: useShelf,
    idealCatalogMatch,
    hasWardrobeGap,
    gapAdvice,
    totalShelfCount: ownedItems.length,
  };
}
