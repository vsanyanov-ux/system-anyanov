import { AnyanovCoordinates, OutfitStack, WardrobeItem } from '../types';
import { WARDROBE_ITEMS } from '../data/wardrobeItems';
import { GOLDEN_WARDROBE_21 } from '../data/golden21';

export function compileAnyanovOutfit(
  coords: AnyanovCoordinates,
  is21Mode: boolean = false
): {
  stack: OutfitStack;
  rulesApplied: string[];
} {
  const { socialX, thermoY, formalIndex, temperatureC } = coords;
  const rulesApplied: string[] = [];
  const basePool = is21Mode ? GOLDEN_WARDROBE_21 : WARDROBE_ITEMS;

  // Фильтруем предметы по температуре и индексу формальности
  const suitableItems = (layer: 'L4' | 'L3' | 'L2' | 'L1') => {
    return basePool.filter((item) => {
      if (item.layer !== layer) return false;
      // Допуск по температуре
      const tempFit = temperatureC >= item.minTemp - 3 && temperatureC <= item.maxTemp + 3;
      return tempFit;
    });
  };

  // Скорринг предмета
  const scoreItem = (item: WardrobeItem) => {
    let score = 100;
    // Близость формальности
    const formalDiff = Math.abs(item.formalIndex - formalIndex);
    score -= formalDiff * 35;

    // Влияние socialX (-1 = структурированный, +1 = свободный)
    if (socialX < -0.3) {
      if (item.silhouette === 'structured') score += 25;
      if (item.silhouette === 'relaxed') score -= 25;
    } else if (socialX > 0.3) {
      if (item.silhouette === 'relaxed' || item.silhouette === 'draped') score += 25;
      if (item.silhouette === 'structured') score -= 15;
    }

    // Влияние thermoY / температуры
    if (thermoY > 0.3 || temperatureC > 23) {
      if (item.fabric.toLowerCase().includes('лен') || item.fabric.toLowerCase().includes('хлопок') || item.fabric.toLowerCase().includes('hopsack')) {
        score += 20;
      }
      if (item.fabric.toLowerCase().includes('шерсть') || item.fabric.toLowerCase().includes('пальто') || item.fabric.toLowerCase().includes('кашемир')) {
        score -= 40;
      }
    } else if (thermoY < -0.3 || temperatureC < 14) {
      if (item.fabric.toLowerCase().includes('шерсть') || item.fabric.toLowerCase().includes('кашемир') || item.fabric.toLowerCase().includes('фланель')) {
        score += 25;
      }
      if (item.fabric.toLowerCase().includes('лен')) {
        score -= 50;
      }
    }

    return score;
  };

  const pickBest = (layer: 'L4' | 'L3' | 'L2' | 'L1', excludeOverwear: boolean = false): WardrobeItem => {
    const list = suitableItems(layer).filter(i => excludeOverwear ? !i.isOverwear : true);
    const fallback = basePool.filter(i => i.layer === layer && (excludeOverwear ? !i.isOverwear : true));
    const pool = list.length > 0 ? list : (fallback.length > 0 ? fallback : basePool.filter(i => i.layer === layer));
    let bestItem = pool[0];
    let bestScore = -Infinity;
    for (const item of pool) {
      const score = scoreItem(item);
      if (score > bestScore) {
        bestScore = score;
        bestItem = item;
      }
    }
    return bestItem;
  };

  // L1: Обувь
  const l1 = pickBest('L1');

  // L2: Брюки
  const l2 = pickBest('L2');

  // L3: Торс
  const l3 = pickBest('L3');

  // Overwear: Транзитная верхняя одежда для улицы при прохладной/холодной погоде (до 12°C)
  let overwear: WardrobeItem | null = null;
  if (temperatureC <= 12) {
    const overwearPool = basePool.filter(i => i.isOverwear);
    if (overwearPool.length > 0) {
      let bestO = overwearPool[0];
      let bestScore = -Infinity;
      for (const item of overwearPool) {
        const s = scoreItem(item);
        if (s > bestScore) {
          bestScore = s;
          bestO = item;
        }
      }
      overwear = bestO;
    }
  }

  // L4: Жакет / Пиджак / Блейзер (для помещения)
  // При жаре > 24°C и неформальном стиле (formalIndex = 1) пиджак опускается — 3 слоя (рубашка, брюки, обувь)
  let l4: WardrobeItem | null = null;
  if (temperatureC <= 24 || formalIndex >= 2) {
    // Выбираем строго пиджак/блейзер для помещения (не пальто)
    l4 = pickBest('L4', true);
  }

  // Аудит правил гармонии Аньянова:
  if (is21Mode) {
    rulesApplied.push('Канон 21: образ скомпилирован строго из 21 эталонного предмета капсулы.');
  }
  if (overwear) {
    rulesApplied.push(`Транзитный протокол: ${overwear.name} защищает в пути (на улице) и сдается в гардероб мероприятия.`);
  }
  if (!l4 && temperatureC > 24) {
    rulesApplied.push('Летний триумвират (3 слоя): в жару пиджак снят — основа образа: торс, брюки и обувь.');
  }
  if (formalIndex === 3) {
    rulesApplied.push('Правило строгого этикета: синхронизация линии плеча пиджака и жесткого воротника.');
  }
  if (temperatureC >= 25) {
    rulesApplied.push('Термодинамический баланс: выбор дышащих открытых переплетений (лен / тонкий хлопок).');
  } else if (temperatureC <= 5) {
    rulesApplied.push('Защитный тепловой барьер: плотная мериносовая шерсть и кашемир для морозного воздуха.');
  }
  if (socialX < -0.4) {
    rulesApplied.push('Вектор дистанции: четкие лаконичные цвета без пестроты для трансляции контроля.');
  } else if (socialX > 0.4) {
    rulesApplied.push('Вектор сближения: мягкие драпировки и тактильно приятные ткани, располагающие к контакту.');
  }

  return {
    stack: { overwear, l4, l3, l2, l1 },
    rulesApplied
  };
}
