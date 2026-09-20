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

  // 5. Расчет пространственно-психологической динамики нот (Летучесть / Дистанция Сердца / Фиксация)
  const olfactoryDynamics = computeOlfactoryDynamics(pyramid);

  return {
    resonantPairs,
    clashes,
    resonanceScore,
    derivedCoords,
    baseAnchorVerdict,
    heartSocialVerdict,
    topAuraVerdict,
    olfactoryDynamics,
  };
}

/**
 * РАСЧЕТ ОЛЬФАКТОРНОЙ ДИНАМИКИ НОТ АНЬЯНОВА:
 * - Верх (+Y): Летучесть, диффузия и подъем (цитрусы, озон, альдегиды)
 * - Сердце (X): Психологическая дистанция (Ирис/лаванда = -X, Сахар/пряности = +X)
 * - База (-Y): Фиксация, тяжесть и след во времени (смолы, кожа, уд, мох)
 */
export function computeOlfactoryDynamics(pyramid?: Partial<PerfumeNotePyramid> | null): import('../types').OlfactoryDynamics {
  const top = Array.isArray(pyramid?.top) ? pyramid.top.map((n) => (n || '').toLowerCase()) : [];
  const heart = Array.isArray(pyramid?.heart) ? pyramid.heart.map((n) => (n || '').toLowerCase()) : [];
  const base = Array.isArray(pyramid?.base) ? pyramid.base.map((n) => (n || '').toLowerCase()) : [];

  // 1. Вектор Сердца (X): Дистанция (-X) vs Сближение (+X)
  const distanceMarkers = [
    'ирис', 'iris', 'лаванда', 'lavender', 'фиалка', 'violet', 'герань', 'geranium',
    'шалфей', 'sage', 'ветивер', 'vetiver', 'чай', 'tea', 'нероли', 'neroli',
    'гальбанум', 'можжевельник', 'juniper', 'мускус', 'musk', 'iso e', 'минерал'
  ];
  const attractionMarkers = [
    'сахар', 'sugar', 'карамель', 'caramel', 'корица', 'cinnamon', 'ваниль', 'vanilla',
    'бобы тонка', 'tonka', 'этилмальтол', 'табак', 'tobacco', 'ром', 'rum', 'мед', 'honey',
    'шоколад', 'жасмин', 'jasmine', 'тубероза', 'tuberose', 'персик', 'слива', 'фрукты',
    'инжир', 'fig', 'гвоздика', 'кардамон', 'кокос', 'роза'
  ];

  let heartDistScore = 0;
  let heartCount = 0;

  heart.forEach((note) => {
    const isDist = distanceMarkers.some((m) => note.includes(m));
    const isAttr = attractionMarkers.some((m) => note.includes(m));
    if (isDist && !isAttr) {
      heartDistScore -= 0.65;
      heartCount++;
    } else if (isAttr && !isDist) {
      heartDistScore += 0.65;
      heartCount++;
    } else if (isDist && isAttr) {
      heartCount++;
    }
  });

  const finalHeartScore = heartCount > 0 
    ? Math.max(-1, Math.min(1, Number((heartDistScore / Math.max(1, heartCount * 0.65)).toFixed(2))))
    : 0;

  let heartDistanceLabel = 'Сбалансированная нейтральность';
  let heartInterpretation = 'Сердце аромата держит органичный баланс между открытостью и сдержанностью.';

  if (finalHeartScore <= -0.35) {
    heartDistanceLabel = 'Строгая дистанция (Личные границы)';
    heartInterpretation = 'Сердечные ноты (ирис, лаванда, строгие цветы) выстраивают интеллектуальный щит и задают субординацию.';
  } else if (finalHeartScore < -0.08) {
    heartDistanceLabel = 'Элегантная сдержанность';
    heartInterpretation = 'Сердце аромата сохраняет тактичную дистанцию и подчеркивает чистоту мысли.';
  } else if (finalHeartScore >= 0.35) {
    heartDistanceLabel = 'Магнетическое сближение (Интим)';
    heartInterpretation = 'Теплые пряные и гурманские молекулы сердца сокращают дистанцию, пробуждая доверие и соблазн.';
  } else if (finalHeartScore > 0.08) {
    heartDistanceLabel = 'Теплый располагающий контакт';
    heartInterpretation = 'Сердечные ноты звучат открыто и гостеприимно, мягко увлекая собеседника в разговор.';
  }

  // 2. Верх (+Y): Летучесть и импульс
  const volatileMarkers = [
    'цитрус', 'бергамот', 'лимон', 'мандарин', 'грейпфрут', 'лайм', 'юзу', 'апельсин',
    'калон', 'calone', 'озон', 'альдегид', 'морск', 'мята', 'розовый перец', 'нероли'
  ];
  const topMatches = top.filter((n) => volatileMarkers.some((m) => n.includes(m))).length;
  const topVolatilesScore = Math.min(1, Math.max(0.35, Number(((topMatches / Math.max(1, top.length)) * 0.6 + 0.4).toFixed(2))));
  const topInterpretation = topVolatilesScore > 0.65
    ? 'Высокая диффузность (+Y): легкие летучие молекулы моментально отрываются от кожи, создавая воздушный подъем и ясность.'
    : 'Мягкий фоновый старт (+Y): аккуратное вхождение в пространство без резкого ольфакторного всплеска.';

  // 3. База (-Y): Плотность и фиксация
  const fixatorMarkers = [
    'уд', 'oud', 'кожа', 'leather', 'мох', 'oakmoss', 'смол', 'смола', 'амбра', 'amber',
    'лабданум', 'бензоин', 'пачули', 'patchouli', 'кумарин', 'ваниль', 'мускус', 'кедр', 'сандал', 'ветивер'
  ];
  const baseMatches = base.filter((n) => fixatorMarkers.some((m) => n.includes(m))).length;
  const baseFixationScore = Math.min(1, Math.max(0.4, Number(((baseMatches / Math.max(1, base.length)) * 0.5 + 0.5).toFixed(2))));
  const baseInterpretation = baseFixationScore > 0.75
    ? 'Мощный якорь (-Y): тяжелые смолисто-древесные фиксаторы надежно держат фундамент шлейфа на протяжении всего дня.'
    : 'Легкий прозрачный фиксатор (-Y): ненавязчивая база, позволяющая аромату сохранять чистоту и динамику.';

  return {
    heartDistanceScore: finalHeartScore,
    heartDistanceLabel,
    heartInterpretation,
    topVolatilesScore,
    topInterpretation,
    baseFixationScore,
    baseInterpretation,
  };
}

