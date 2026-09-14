import { AestheticValues, AxisClash, HarmonyState, OutfitStack, PerfumeItem, SolfeggioAnalysis, WardrobeItem } from '../types';

export const AXES: (keyof AestheticValues)[] = [
  'mass_density',       // -1 (невесомый, лен/озон) <-> +1 (монументальный, драп/уд/смолы)
  'architectonics',     // -1 (текучий, оверсайз/мускус) <-> +1 (жесткий тейлоринг/шипр)
  'thermal_balance',    // -1 (арктический лед, цитрон/серебро) <-> +1 (согревающий, кашемир/амбра/корица)
  'surface_moisture',   // -1 (сухой, мел/пудра/твид) <-> +1 (влажный, глянец/акватика)
  'tempo_volatility',   // -1 (статичный, бальзамический шлейф) <-> +1 (взрывной, цитрусы/спорт)
  'biomorphism',        // -1 (техногенный винил/амброксан) <-> +1 (органический лен/лаванда/петрикор)
];

export const AXIS_LABELS: Record<keyof AestheticValues, { name: string; left: string; right: string }> = {
  mass_density: { name: 'Плотность массы', left: 'Невесомый / Шелк', right: 'Монументальный / Драп' },
  architectonics: { name: 'Архитектоника', left: 'Текучий / Драп', right: 'Жесткий крой / Четкость' },
  thermal_balance: { name: 'Термо-баланс', left: 'Лед / Прохлада', right: 'Тепло / Кашемир' },
  surface_moisture: { name: 'Фактура', left: 'Сухая / Матовая', right: 'Глянец / Влажность' },
  tempo_volatility: { name: 'Темп раскрытия', left: 'Статичный шлейф', right: 'Взрывной импульс' },
  biomorphism: { name: 'Биоморфизм', left: 'Техно / Молекулярный', right: 'Природный / Органика' },
};

export const DEFAULT_WEIGHTS: Record<keyof AestheticValues, number> = {
  mass_density: 1.3,
  architectonics: 1.2,
  thermal_balance: 1.0,
  surface_moisture: 0.9,
  tempo_volatility: 0.8,
  biomorphism: 0.8,
};

/**
 * Вычисляет средневзвешенный 6D вектор всего гардеробного лука из слоев L1..L4
 */
export function calculateOutfitAestheticVector(stack: OutfitStack): AestheticValues {
  const items: { item: WardrobeItem; weight: number }[] = [];
  if (stack.l4) items.push({ item: stack.l4, weight: 0.40 });
  if (stack.l3) items.push({ item: stack.l3, weight: stack.l4 ? 0.30 : 0.50 });
  if (stack.l2) items.push({ item: stack.l2, weight: 0.20 });
  if (stack.l1) items.push({ item: stack.l1, weight: 0.10 });

  const result: AestheticValues = {
    mass_density: 0,
    architectonics: 0,
    thermal_balance: 0,
    surface_moisture: 0,
    tempo_volatility: 0,
    biomorphism: 0,
  };

  let totalW = 0;
  for (const { item, weight } of items) {
    const v = getItemAestheticVector(item);
    for (const axis of AXES) {
      result[axis] += v[axis] * weight;
    }
    totalW += weight;
  }

  if (totalW > 0) {
    for (const axis of AXES) {
      result[axis] = Number((result[axis] / totalW).toFixed(2));
    }
  }

  return result;
}

/**
 * Эвристика определения 6D вектора для отдельного предмета одежды
 */
export function getItemAestheticVector(item: WardrobeItem): AestheticValues {
  if (item.aestheticValues) {
    return {
      mass_density: item.aestheticValues.mass_density ?? 0,
      architectonics: item.aestheticValues.architectonics ?? 0,
      thermal_balance: item.aestheticValues.thermal_balance ?? 0,
      surface_moisture: item.aestheticValues.surface_moisture ?? 0,
      tempo_volatility: item.aestheticValues.tempo_volatility ?? 0,
      biomorphism: item.aestheticValues.biomorphism ?? 0,
    };
  }

  const name = (item.name + ' ' + item.fabric + ' ' + item.description).toLowerCase();

  // 1. mass_density
  let mass = 0.0;
  if (name.includes('пальто') || name.includes('550 г') || name.includes('тяжел')) mass = 0.85;
  else if (name.includes('шерсть') || name.includes('костюм') || name.includes('деним')) mass = 0.50;
  else if (name.includes('кашемир') || name.includes('твил') || name.includes('чинос')) mass = 0.20;
  else if (name.includes('лен') || name.includes('шелк') || name.includes('тонкий')) mass = -0.75;
  else if (name.includes('футболка') || name.includes('поло')) mass = -0.30;

  // 2. architectonics
  let arch = item.silhouette === 'structured' ? 0.8 : item.silhouette === 'relaxed' ? -0.6 : -0.2;
  if (name.includes('галстук') || name.includes('стрелк') || name.includes('оксфорд')) arch = Math.min(1.0, arch + 0.25);
  if (name.includes('кулиск') || name.includes('выстиран')) arch = Math.max(-1.0, arch - 0.3);

  // 3. thermal_balance
  let therm = 0.0;
  if (item.maxTemp <= 10) therm = 0.85; // зимняя, согревающая
  else if (item.maxTemp <= 20) therm = 0.40;
  else if (item.minTemp >= 20) therm = -0.80; // летняя прохлада
  else therm = -0.10;

  // 4. surface_moisture (матовый/сухой vs шелковистый/глянцевый)
  let moist = -0.2;
  if (name.includes('глянец') || name.includes('шелк') || name.includes('лоферы')) moist = 0.60;
  if (name.includes('твид') || name.includes('фланель') || name.includes('сух')) moist = -0.80;
  if (name.includes('замш')) moist = -0.60;

  // 5. tempo_volatility
  let tempo = -0.3;
  if (item.formalIndex === 1) tempo = 0.5; // кэжуал более динамичен
  if (item.formalIndex === 3) tempo = -0.7; // формал статичен

  // 6. biomorphism
  let bio = 0.5;
  if (name.includes('лен') || name.includes('шерсть') || name.includes('кожа') || name.includes('хлопок')) bio = 0.75;
  if (name.includes('эластан') || name.includes('полиэстер') || name.includes('нейлон')) bio = -0.40;

  return {
    mass_density: mass,
    architectonics: arch,
    thermal_balance: therm,
    surface_moisture: moist,
    tempo_volatility: tempo,
    biomorphism: bio,
  };
}

/**
 * Проекция 6D вектора гардероба на 2D плоскость Аньянова:
 * X (Власть vs Соблазн): расчет из архитектоники, формальности и плотности.
 * Y (Холод/Диффузия vs Тепло/Стойкость): расчет из термобаланса и массы.
 */
export function projectOutfitTo2D(stack: OutfitStack, vector: AestheticValues): { x: number; y: number } {
  // Архитектоника (+1 строгий -> X < 0; -1 мягкий -> X > 0)
  // Формальный индекс усиливает сдвиг влево (к власти)
  const avgFormal = (
    (stack.l4?.formalIndex ?? stack.l3.formalIndex) +
    stack.l3.formalIndex +
    stack.l2.formalIndex +
    stack.l1.formalIndex
  ) / (stack.l4 ? 4 : 3);

  // Формальность 3 -> сдвиг к -0.7; формальность 1 -> сдвиг к +0.5
  const formalShift = (2 - avgFormal) * 0.45;
  const archShift = -vector.architectonics * 0.45;
  const rawX = formalShift + archShift;

  // Y: thermal_balance (+1 тепло/зима -> Y < 0; -1 холод/лето -> Y > 0)
  // Плотность массы (mass_density > 0 -> вниз, к весу/власти)
  const rawY = -vector.thermal_balance * 0.65 - vector.mass_density * 0.25;

  return {
    x: Number(Math.max(-0.95, Math.min(0.95, rawX)).toFixed(2)),
    y: Number(Math.max(-0.95, Math.min(0.95, rawY)).toFixed(2)),
  };
}

/**
 * Извлечение 6D вектора аромата
 */
export function getPerfumeAestheticVector(perfume: PerfumeItem): AestheticValues {
  if (perfume.aestheticValues) {
    return {
      mass_density: perfume.aestheticValues.mass_density ?? 0,
      architectonics: perfume.aestheticValues.architectonics ?? 0,
      thermal_balance: perfume.aestheticValues.thermal_balance ?? 0,
      surface_moisture: perfume.aestheticValues.surface_moisture ?? 0,
      tempo_volatility: perfume.aestheticValues.tempo_volatility ?? 0,
      biomorphism: perfume.aestheticValues.biomorphism ?? 0,
    };
  }

  // Декодируем вектор аромата из его ольфакторных координат (xCoord, yCoord) и нот
  const x = perfume.xCoord; // -1 (Власть) .. +1 (Соблазн)
  const y = perfume.yCoord; // -1 (Зима/Тепло) .. +1 (Лето/Холод)

  const text = (perfume.name + ' ' + perfume.dominantVibe + ' ' + perfume.pyramid.base.join(' ')).toLowerCase();

  const mass = Number((-y * 0.65 + (x < 0 ? 0.3 : 0.1)).toFixed(2));
  const arch = Number((-x * 0.75).toFixed(2));
  const therm = Number((-y * 0.85).toFixed(2));
  let moist = 0.0;
  if (text.includes('цитрон') || text.includes('морск') || text.includes('акватик')) moist = 0.75;
  if (text.includes('мох') || text.includes('ирис') || text.includes('пудр') || text.includes('кожа')) moist = -0.70;

  const tempo = Number((y * 0.6).toFixed(2));
  let bio = 0.5;
  if (text.includes('молекуляр') || text.includes('амброксан') || text.includes('iso e')) bio = -0.7;

  return {
    mass_density: Math.max(-1, Math.min(1, mass)),
    architectonics: Math.max(-1, Math.min(1, arch)),
    thermal_balance: Math.max(-1, Math.min(1, therm)),
    surface_moisture: Math.max(-1, Math.min(1, moist)),
    tempo_volatility: Math.max(-1, Math.min(1, tempo)),
    biomorphism: Math.max(-1, Math.min(1, bio)),
  };
}

/**
 * Расчет взвешенного евклидова расстояния
 */
export function calculateWeightedDistance(v1: AestheticValues, v2: AestheticValues): number {
  let totalSq = 0;
  let totalW = 0;

  for (const axis of AXES) {
    const diff = v1[axis] - v2[axis];
    const w = DEFAULT_WEIGHTS[axis];
    totalSq += w * diff * diff;
    totalW += w;
  }

  return Math.sqrt(totalSq / totalW);
}

/**
 * Расчет косинусного сходства
 */
export function calculateCosineSimilarity(v1: AestheticValues, v2: AestheticValues): number {
  let dot = 0;
  let norm1 = 0;
  let norm2 = 0;

  for (const axis of AXES) {
    const a = v1[axis];
    const b = v2[axis];
    dot += a * b;
    norm1 += a * a;
    norm2 += b * b;
  }

  if (norm1 === 0 || norm2 === 0) return 0;
  return Number((dot / (Math.sqrt(norm1) * Math.sqrt(norm2))).toFixed(3));
}

/**
 * Анализ расхождений по осям
 */
export function diagnoseClashes(outfitVec: AestheticValues, perfumeVec: AestheticValues): AxisClash[] {
  const clashes: AxisClash[] = [];

  for (const axis of AXES) {
    const valO = outfitVec[axis];
    const valP = perfumeVec[axis];
    const diff = Math.abs(valO - valP);

    if (diff >= 1.0) {
      clashes.push({
        axis,
        diff: Number(diff.toFixed(2)),
        diagnosis: `Критический разрыв: лук ${valO > 0 ? '+' : ''}${valO.toFixed(2)} vs аромат ${valP > 0 ? '+' : ''}${valP.toFixed(2)}`,
      });
    } else if (diff >= 0.65) {
      clashes.push({
        axis,
        diff: Number(diff.toFixed(2)),
        diagnosis: `Стильный контрапункт: лук ${valO > 0 ? '+' : ''}${valO.toFixed(2)} vs аромат ${valP > 0 ? '+' : ''}${valP.toFixed(2)}`,
      });
    }
  }

  return clashes.sort((a, b) => b.diff - a.diff);
}

/**
 * Главный метод Мультимодального Сольфеджио Стиля
 */
export function analyzeStyleSolfeggio(
  stack: OutfitStack,
  perfume: PerfumeItem
): SolfeggioAnalysis {
  const outfitVector = calculateOutfitAestheticVector(stack);
  const perfumeVector = getPerfumeAestheticVector(perfume);
  const outfitCoords = projectOutfitTo2D(stack, outfitVector);

  const distance = Number(calculateWeightedDistance(outfitVector, perfumeVector).toFixed(3));
  const cosineSimilarity = calculateCosineSimilarity(outfitVector, perfumeVector);
  const clashes = diagnoseClashes(outfitVector, perfumeVector);

  let harmonyState: HarmonyState;
  let stateLabel: string;
  let badgeColor: string;
  let verdict: string;

  if (distance <= 0.48) {
    harmonyState = 'UNISON';
    stateLabel = 'Унисон (Тотальный Консонанс)';
    badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    verdict = 'Идеальное созвучие: аромат и одежда резонируют в едином семантическом регистре.';
  } else if (distance <= 0.95) {
    const majorClashes = clashes.filter((c) => c.diff >= 1.0);
    if (majorClashes.length <= 1) {
      harmonyState = 'CONTRAPUNCT';
      stateLabel = 'Благородный Контрапункт (Полифония)';
      badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      verdict = 'Высокий стиль: выверенное эстетическое напряжение и контролируемый акцент по ключевой оси.';
    } else {
      harmonyState = 'DIVERGENCE';
      stateLabel = 'Умеренная Дивергенция';
      badgeColor = 'bg-sky-500/20 text-sky-300 border-sky-500/40';
      verdict = 'Звучание эклектичное, слегка размытое по нескольким параметрам ткани и шлейфа.';
    }
  } else if (distance <= 1.40) {
    harmonyState = 'DISSONANCE';
    stateLabel = 'Семантический Диссонанс';
    badgeColor = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    verdict = 'Ощутимый конфликт кодов: зрительный образ одежды противоречит ольфакторному сигналу аромата.';
  } else {
    harmonyState = 'CACOPHONY';
    stateLabel = 'Какофония (Слом восприятия)';
    badgeColor = 'bg-red-950/70 text-red-400 border-red-600/60';
    verdict = 'Критический слом восприятия. Мозг окружающих считывает взаимоисключающие контексты.';
  }

  return {
    distance,
    cosineSimilarity,
    harmonyState,
    stateLabel,
    badgeColor,
    verdict,
    clashes,
    outfitVector,
    perfumeVector,
    outfitCoords,
  };
}
