import { AnyanovCoordinates, PerfumeItem } from '../types';
import { PERFUME_DATABASE } from '../data/fragrances';

export function matchAnyanovPerfume(coords: AnyanovCoordinates): {
  perfume: PerfumeItem;
  synergyVerdict: string;
  compatibilityScore: number;
} {
  const { socialX, thermoY } = coords;

  let bestPerfume = PERFUME_DATABASE[0];
  let minDistance = Infinity;

  for (const item of PERFUME_DATABASE) {
    const dx = item.xCoord - socialX;
    const dy = item.yCoord - thermoY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < minDistance) {
      minDistance = distance;
      bestPerfume = item;
    }
  }

  const compatibilityScore = Math.max(92, Math.min(99, Math.round(100 - minDistance * 10)));

  let synergyVerdict = '';
  if (socialX <= 0 && thermoY >= 0) {
    synergyVerdict = bestPerfume.name + " от " + bestPerfume.brand + " выстраивает идеальный ольфакторный щит. Прохладные верхние ноты (" + bestPerfume.pyramid.top.join(', ') + ") поддерживают строгую архитектуру пиджака и сорочки, кристаллизуя деловой фокус.";
  } else if (socialX > 0 && thermoY >= 0) {
    synergyVerdict = bestPerfume.name + " от " + bestPerfume.brand + " наполняет образ солнечным воздухом. Акватика и цитрусы сливаются со свободным дыханием натурального льна, создавая ощущение чистоты, непринужденности и летней свободы.";
  } else if (socialX <= 0 && thermoY < 0) {
    synergyVerdict = bestPerfume.name + " от " + bestPerfume.brand + " придает пальто и костюмной шерсти монументальный вес. Базовые ноты (" + bestPerfume.pyramid.base.join(', ') + ") создают глубокий, авторитетный шлейф непререкаемой уверенности.";
  } else {
    synergyVerdict = bestPerfume.name + " от " + bestPerfume.brand + " вступает в резонанс с тактильным кашемиром и трикотажем. Теплые ноты (" + bestPerfume.pyramid.heart.join(', ') + ") сокращают дистанцию, формируя ауру манящего вечернего уюта и соблазна.";
  }

  return {
    perfume: bestPerfume,
    synergyVerdict,
    compatibilityScore
  };
}
