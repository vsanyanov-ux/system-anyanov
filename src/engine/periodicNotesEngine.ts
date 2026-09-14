import { 
  OutfitStack, 
  PerfumeNotePyramid, 
  NoteEngineAnalysis, 
  NoteFabricResonancePair, 
  NoteClashWarning, 
  PeriodicNoteElement,
  LayerType
} from '../types';
import { findPeriodicNote, PERIODIC_NOTE_ELEMENTS } from '../data/periodicNotes';

/**
 * Проверка совпадения ткани (нечеткое сравнение)
 */
function fabricMatches(targetFabric: string, candidateList: string[]): boolean {
  if (!targetFabric || !candidateList) return false;
  const lowerTarget = targetFabric.toLowerCase();
  return candidateList.some((c) => {
    const lowerC = c.toLowerCase();
    return lowerTarget.includes(lowerC) || lowerC.includes(lowerTarget);
  });
}

/**
 * ДВИГАТЕЛЬ ПЕРИОДИЧЕСКОЙ СИСТЕМЫ НОТ
 * Анализирует химико-ольфакторный резонанс между пирамидой аромата и тканями слоев L1–L4
 */
export function analyzePeriodicNotesSynergy(
  pyramid: PerfumeNotePyramid,
  stack: OutfitStack
): NoteEngineAnalysis {
  const resonantPairs: NoteFabricResonancePair[] = [];
  const clashes: NoteClashWarning[] = [];

  // Собираем слои одежды в унифицированный список
  const garmentLayers: { layer: LayerType; category: string; fabric: string; name: string }[] = [];

  if (stack.l4) {
    garmentLayers.push({
      layer: 'L4',
      category: stack.l4.category,
      fabric: stack.l4.fabric,
      name: stack.l4.name,
    });
  }
  if (stack.l3) {
    garmentLayers.push({
      layer: 'L3',
      category: stack.l3.category,
      fabric: stack.l3.fabric,
      name: stack.l3.name,
    });
  }
  if (stack.l2) {
    garmentLayers.push({
      layer: 'L2',
      category: stack.l2.category,
      fabric: stack.l2.fabric,
      name: stack.l2.name,
    });
  }
  if (stack.l1) {
    garmentLayers.push({
      layer: 'L1',
      category: stack.l1.category,
      fabric: stack.l1.fabric,
      name: stack.l1.name,
    });
  }

  // Извлекаем все распознанные ноты пирамиды
  const topNotes: { raw: string; el?: PeriodicNoteElement }[] = (pyramid.top || []).map((n) => ({
    raw: n,
    el: findPeriodicNote(n),
  }));
  const heartNotes: { raw: string; el?: PeriodicNoteElement }[] = (pyramid.heart || []).map((n) => ({
    raw: n,
    el: findPeriodicNote(n),
  }));
  const baseNotes: { raw: string; el?: PeriodicNoteElement }[] = (pyramid.base || []).map((n) => ({
    raw: n,
    el: findPeriodicNote(n),
  }));

  const allNotes = [...topNotes, ...heartNotes, ...baseNotes];

  // 1. Поиск тканевых резонансов
  // База аромата соединяется с L4 (Верхний слой/Пальто) и L1 (Обувь/Фундамент)
  baseNotes.forEach(({ raw, el }) => {
    if (!el) return;
    garmentLayers.forEach((garment) => {
      if (fabricMatches(garment.fabric, el.resonantFabrics)) {
        resonantPairs.push({
          note: el,
          layer: garment.layer,
          itemCategory: garment.category,
          fabric: garment.fabric,
          synergyLevel: garment.layer === 'L4' || garment.layer === 'L1' ? 'EXCELLENT' : 'GOOD',
          reason: `Базовая нота ${el.name} (${el.symbol}) укрепляет физический фундамент ${garment.name} (${garment.fabric}).`,
        });
      }
      if (el.clashFabrics && fabricMatches(garment.fabric, el.clashFabrics)) {
        clashes.push({
          noteName: el.name,
          layer: garment.layer,
          fabric: garment.fabric,
          warning: `Тяжелая базовая нота ${el.name} диссонирует с легкой фактурой ${garment.fabric} (${garment.name}).`,
        });
      }
    });
  });

  // Сердечные ноты соединяются со слоем L3 (Торс: сорочка, пиджак, джемпер)
  heartNotes.forEach(({ raw, el }) => {
    if (!el) return;
    garmentLayers.forEach((garment) => {
      if (fabricMatches(garment.fabric, el.resonantFabrics)) {
        resonantPairs.push({
          note: el,
          layer: garment.layer,
          itemCategory: garment.category,
          fabric: garment.fabric,
          synergyLevel: garment.layer === 'L3' ? 'EXCELLENT' : 'GOOD',
          reason: `Нота сердца ${el.name} (${el.symbol}) идеально резонирует с ${garment.name} (${garment.fabric}), формируя точный социальный посыл.`,
        });
      }
      if (el.clashFabrics && fabricMatches(garment.fabric, el.clashFabrics)) {
        clashes.push({
          noteName: el.name,
          layer: garment.layer,
          fabric: garment.fabric,
          warning: `Сердечная нота ${el.name} спорит с характером ${garment.fabric}.`,
        });
      }
    });
  });

  // Верхние ноты создают атмосферный купол (AURA / воротник L3)
  topNotes.forEach(({ raw, el }) => {
    if (!el) return;
    garmentLayers.forEach((garment) => {
      if (garment.layer === 'L3' && fabricMatches(garment.fabric, el.resonantFabrics)) {
        resonantPairs.push({
          note: el,
          layer: 'AURA',
          itemCategory: garment.category,
          fabric: garment.fabric,
          synergyLevel: 'GOOD',
          reason: `Верхняя нота ${el.name} (${el.symbol}) освежает линию воротника ${garment.name}, создавая чистый стартовый ореол.`,
        });
      }
    });
  });

  // 2. Расчет динамических координат на основе Периодической системы нот
  let totalX = 0;
  let totalY = 0;
  let weightSum = 0;

  allNotes.forEach(({ el }, idx) => {
    if (!el) return;
    // Вес: базовые ноты имеют больший вес для шлейфа (1.4), сердце (1.2), верх (0.9)
    const tierWeight = el.tier === 'base' ? 1.4 : el.tier === 'heart' ? 1.2 : 0.9;
    totalX += el.distanceX * tierWeight;
    totalY += el.thermoY * tierWeight;
    weightSum += tierWeight;
  });

  const derivedCoords = weightSum > 0
    ? {
        x: Number((totalX / weightSum).toFixed(2)),
        y: Number((totalY / weightSum).toFixed(2)),
      }
    : { x: 0, y: 0 };

  // 3. Вычисление балла тканевого резонанса (65 .. 99)
  const baseResonance = 78;
  const positiveBonus = Math.min(20, resonantPairs.length * 4);
  const clashPenalty = clashes.length * 12;
  const resonanceScore = Math.max(55, Math.min(99, baseResonance + positiveBonus - clashPenalty));

  // 4. Формирование экспертных вердиктов по ярусам пирамиды
  const recognizedBase = baseNotes.filter((n) => n.el).map((n) => n.el!.name);
  const recognizedHeart = heartNotes.filter((n) => n.el).map((n) => n.el!.name);
  const recognizedTop = topNotes.filter((n) => n.el).map((n) => n.el!.name);

  const l4Item = stack.l4;
  const l3Item = stack.l3;

  const baseAnchorVerdict = recognizedBase.length > 0
    ? `Базовый аккорд (${recognizedBase.join(', ')}) надежно удерживает плотность ${l4Item ? l4Item.name : stack.l3.name} и задает статус шлейфа.`
    : `База аромата выстроена на нейтральных стабилизирующих компонентах.`;

  const heartSocialVerdict = recognizedHeart.length > 0
    ? `Сердце композиции (${recognizedHeart.join(', ')}) вступает в тактильный резонанс с тканью торса (${l3Item.fabric}), точно транслируя социальную дистанцию.`
    : `Ноты сердца создают ровное бесшовное звучание без резких перепадов.`;

  const topAuraVerdict = recognizedTop.length > 0
    ? `Верхний ярус (${recognizedTop.join(', ')}) открывает композицию выверенной термодинамической свежестью под погоду.`
    : `Стартовый аккорд гармонично вводит аромат в окружающее пространство.`;

  return {
    resonantPairs,
    clashes,
    resonanceScore,
    derivedCoords,
    baseAnchorVerdict,
    heartSocialVerdict,
    topAuraVerdict,
  };
}
