import { AnyanovCoordinates, OutfitStack, WardrobeItem } from '../types';
import { WARDROBE_ITEMS } from '../data/wardrobeItems';

export function compileAnyanovOutfit(coords: AnyanovCoordinates): {
  stack: OutfitStack;
  rulesApplied: string[];
} {
  const { socialX, thermoY, formalIndex, temperatureC } = coords;
  const rulesApplied: string[] = [];

  // Фильтруем предметы по температуре и индексу формальности
  const suitableItems = (layer: 'L4' | 'L3' | 'L2' | 'L1') => {
    return WARDROBE_ITEMS.filter((item) => {
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

  const pickBest = (layer: 'L4' | 'L3' | 'L2' | 'L1'): WardrobeItem => {
    const list = suitableItems(layer);
    const pool = list.length > 0 ? list : WARDROBE_ITEMS.filter(i => i.layer === layer);
    const sorted = [...pool].sort((a, b) => scoreItem(b) - scoreItem(a));
    return sorted[0];
  };

  // L1: Обувь
  const l1 = pickBest('L1');

  // L2: Брюки
  const l2 = pickBest('L2');

  // L3: Торс
  const l3 = pickBest('L3');

  // L4: Верхний слой (при жаре > 25°C и casual стиле L4 можно опустить, если это не строгий костюм)
  let l4: WardrobeItem | null = null;
  if (temperatureC <= 24 || formalIndex >= 2) {
    l4 = pickBest('L4');
  }

  // Аудит правил гармонии Аньянова:
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
    stack: { l4, l3, l2, l1 },
    rulesApplied
  };
}
