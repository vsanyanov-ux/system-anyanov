import { Anyanov8DVector, AxisClash, HarmonyState, OutfitStack, PerfumeItem, SolfeggioAnalysis, WardrobeItem } from '../types';

/**
 * 8 Канонических Измерений Системы Аньянова:
 * 1. distance: -1.0 (Обособленность) <-> +1.0 (Интим / Сближение)
 * 2. formality: -1.0 (Business Formal) <-> +1.0 (Casual)
 * 3. power: -1.0 (Статус / Твердая власть) <-> +1.0 (Соблазн / Шарм)
 * 4. mood: -1.0 (Собранность / Фокус) <-> +1.0 (Легкость / Свобода)
 * 5. diffusion: -1.0 (Долгое действие / Шлейф) <-> +1.0 (Быстрое действие / Вспышка)
 * 6. temperature: -1.0 (Тепло / Согревающий) <-> +1.0 (Холод / Освежающий)
 * 7. time_of_day: -1.0 (Вечер / Глубина) <-> +1.0 (День / Свет)
 * 8. season: -1.0 (Зима / Плотность) <-> +1.0 (Лето / Воздух)
 */
export const AXES: (keyof Anyanov8DVector)[] = [
  'distance',
  'formality',
  'power',
  'mood',
  'diffusion',
  'temperature',
  'time_of_day',
  'season',
];

export const AXIS_LABELS: Record<keyof Anyanov8DVector, { name: string; left: string; right: string }> = {
  distance: { name: 'Дистанция', left: 'Обособленность', right: 'Интим / Сближение' },
  formality: { name: 'Формальность', left: 'Business Formal', right: 'Casual' },
  power: { name: 'Власть', left: 'Статус / Твердость', right: 'Соблазн / Шарм' },
  mood: { name: 'Настроение', left: 'Фокус / Дисциплина', right: 'Легкость / Свобода' },
  diffusion: { name: 'Диффузия', left: 'Стойкая база / Шлейф', right: 'Летучая вспышка / Топ' },
  temperature: { name: 'Температура', left: 'Тепло / Кашемир', right: 'Холод / Освежающий' },
  time_of_day: { name: 'Время суток', left: 'Вечер / Глубина', right: 'День / Прозрачность' },
  season: { name: 'Сезон', left: 'Зима / Плотность', right: 'Лето / Воздух' },
};

export const DEFAULT_WEIGHTS: Record<keyof Anyanov8DVector, number> = {
  distance: 1.2,
  formality: 1.2,
  power: 1.1,
  mood: 1.0,
  diffusion: 0.9,
  temperature: 1.0,
  time_of_day: 0.8,
  season: 0.8,
};

/**
 * Вычисляет средневзвешенный 8D-вектор всего гардеробного лука из слоев L1..L4
 */
export function calculateOutfitAestheticVector(stack: OutfitStack): Anyanov8DVector {
  const items: { item: WardrobeItem; weight: number }[] = [];
  if (stack.l4) items.push({ item: stack.l4, weight: 0.40 });
  if (stack.l3) items.push({ item: stack.l3, weight: stack.l4 ? 0.30 : 0.50 });
  if (stack.l2) items.push({ item: stack.l2, weight: 0.20 });
  if (stack.l1) items.push({ item: stack.l1, weight: 0.10 });

  const result: Anyanov8DVector = {
    distance: 0,
    formality: 0,
    power: 0,
    mood: 0,
    diffusion: 0,
    temperature: 0,
    time_of_day: 0,
    season: 0,
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
 * Определение 8D вектора Системы Аньянова для отдельного предмета одежды
 */
export function getItemAestheticVector(item: WardrobeItem): Anyanov8DVector {
  if (item.aestheticValues) {
    return {
      distance: item.aestheticValues.distance ?? 0,
      formality: item.aestheticValues.formality ?? 0,
      power: item.aestheticValues.power ?? 0,
      mood: item.aestheticValues.mood ?? 0,
      diffusion: item.aestheticValues.diffusion ?? 0,
      temperature: item.aestheticValues.temperature ?? 0,
      time_of_day: item.aestheticValues.time_of_day ?? 0,
      season: item.aestheticValues.season ?? 0,
    };
  }

  const name = (item.name + ' ' + item.fabric + ' ' + item.description).toLowerCase();

  // 1. distance: -1 (Обособленность) .. +1 (Интим / Сближение)
  let dist = 0.0;
  if (item.silhouette === 'structured' || name.includes('оксфорд') || name.includes('пальто') || name.includes('галстук')) {
    dist = -0.75;
  } else if (item.silhouette === 'relaxed' || name.includes('оверсайз') || name.includes('трикотаж') || name.includes('кашемир')) {
    dist = 0.65;
  } else {
    dist = 0.10;
  }

  // 2. formality: -1 (Business Formal) .. +1 (Casual)
  let form = 0.0;
  if (item.formalIndex === 3) form = -0.90;
  else if (item.formalIndex === 2) form = 0.0;
  else form = 0.85;

  // 3. power: -1 (Статус / Власть) .. +1 (Соблазн / Шарм)
  let pwr = 0.0;
  if (name.includes('пальто') || name.includes('костюм') || name.includes('дерби') || name.includes('пиджак')) {
    pwr = -0.80;
  } else if (name.includes('кашемир') || name.includes('шелк') || name.includes('замш') || name.includes('поло')) {
    pwr = 0.70;
  } else if (name.includes('кеды') || name.includes('худи') || name.includes('футболка')) {
    pwr = 0.40;
  } else {
    pwr = -0.20;
  }

  // 4. mood: -1 (Собранность / Фокус) .. +1 (Легкость / Свобода)
  let md = 0.0;
  if (item.formalIndex === 3 || name.includes('стрелк') || name.includes('воротник')) {
    md = -0.80;
  } else if (name.includes('лен') || name.includes('шорты') || name.includes('белый') || name.includes('кеды')) {
    md = 0.75;
  } else {
    md = 0.10;
  }

  // 5. diffusion: -1 (Долгое действие / Шлейф / Плотная ткань) .. +1 (Быстрое действие / Легкость)
  let diff = 0.0;
  if (name.includes('тяжел') || name.includes('драп') || name.includes('шерсть') || name.includes('деним')) {
    diff = -0.75;
  } else if (name.includes('лен') || name.includes('шелк') || name.includes('поплин')) {
    diff = 0.70;
  } else {
    diff = -0.10;
  }

  // 6. temperature: -1 (Тепло / Согревающий) .. +1 (Холод / Освежающий)
  let temp = 0.0;
  if (item.maxTemp <= 10) temp = -0.85; // зимняя, согревающая
  else if (item.maxTemp <= 20) temp = -0.35;
  else if (item.minTemp >= 20) temp = 0.80; // летняя, освежающая
  else temp = 0.10;

  // 7. time_of_day: -1 (Вечер / Темный / Глубокий) .. +1 (День / Светлый / Яркий)
  let tod = 0.0;
  const col = (item.colorName + ' ' + item.color).toLowerCase();
  if (col.includes('черн') || col.includes('темн') || col.includes('графит') || col.includes('navy')) {
    tod = -0.75;
  } else if (col.includes('бел') || col.includes('светл') || col.includes('беж') || col.includes('голуб')) {
    tod = 0.75;
  } else {
    tod = 0.10;
  }

  // 8. season: -1 (Зима) .. +1 (Лето)
  let ssn = 0.0;
  if (item.maxTemp <= 10) ssn = -0.90;
  else if (item.minTemp >= 18) ssn = 0.85;
  else ssn = 0.0;

  return {
    distance: Math.max(-1, Math.min(1, dist)),
    formality: Math.max(-1, Math.min(1, form)),
    power: Math.max(-1, Math.min(1, pwr)),
    mood: Math.max(-1, Math.min(1, md)),
    diffusion: Math.max(-1, Math.min(1, diff)),
    temperature: Math.max(-1, Math.min(1, temp)),
    time_of_day: Math.max(-1, Math.min(1, tod)),
    season: Math.max(-1, Math.min(1, ssn)),
  };
}

/**
 * Проекция 8D-вектора гардероба на 2D-плоскость Аньянова:
 * X (Социальный контур): Власть / Статус / Formal (-X) <---> Соблазн / Интим / Casual (+X)
 * Y (Физико-временной контур): Зима / Вечер / Тепло / Долго (-Y) <---> Лето / День / Холод / Быстро (+Y)
 */
export function projectOutfitTo2D(stack: OutfitStack, vector: Anyanov8DVector): { x: number; y: number } {
  // Социальная ось X: среднее от (distance, formality, power)
  const rawX = (vector.distance + vector.formality + vector.power) / 3;

  // Физико-временная ось Y: среднее от (season, time_of_day, temperature, diffusion, mood)
  const rawY = (vector.season + vector.time_of_day + vector.temperature + vector.diffusion + vector.mood) / 5;

  return {
    x: Number(Math.max(-0.95, Math.min(0.95, rawX)).toFixed(2)),
    y: Number(Math.max(-0.95, Math.min(0.95, rawY)).toFixed(2)),
  };
}

/**
 * Извлечение канонического 8D-вектора аромата
 */
export function getPerfumeAestheticVector(perfume: PerfumeItem): Anyanov8DVector {
  if (perfume.aestheticValues) {
    return {
      distance: perfume.aestheticValues.distance ?? 0,
      formality: perfume.aestheticValues.formality ?? 0,
      power: perfume.aestheticValues.power ?? 0,
      mood: perfume.aestheticValues.mood ?? 0,
      diffusion: perfume.aestheticValues.diffusion ?? 0,
      temperature: perfume.aestheticValues.temperature ?? 0,
      time_of_day: perfume.aestheticValues.time_of_day ?? 0,
      season: perfume.aestheticValues.season ?? 0,
    };
  }

  // Декодируем вектор аромата из координат (xCoord, yCoord), нот и диффузии
  const x = perfume.xCoord; // -1 (Власть / Статус) .. +1 (Соблазн / Интим)
  const y = perfume.yCoord; // -1 (Зима / Вечер / Тепло) .. +1 (Лето / День / Холод)
  const text = (perfume.name + ' ' + perfume.dominantVibe + ' ' + perfume.pyramid.base.join(' ')).toLowerCase();

  // 1. distance: x (-1 Обособленность .. +1 Интим)
  const dist = Number((x * 0.85).toFixed(2));

  // 2. formality: -x (строгий статус vs расслабленный флирт)
  const form = Number((-x * 0.75).toFixed(2));

  // 3. power: x (-1 Статус / Твердость .. +1 Соблазн / Шарм)
  const pwr = Number((x * 0.90).toFixed(2));

  // 4. mood: y (-1 Собранность / Фокус .. +1 Легкость / Релакс)
  const md = Number((y * 0.80).toFixed(2));

  // 5. diffusion: по типу шлейфа и нотам
  let diff = 0.0;
  if (perfume.diffusion === 'Ударная') diff = 0.90;
  else if (perfume.diffusion === 'Шлейфовая') diff = 0.45;
  else if (perfume.diffusion === 'Умеренная') diff = -0.15;
  else diff = -0.75; // Интимная

  // 6. temperature: y (-1 Тепло .. +1 Холод)
  let temp = Number((y * 0.85).toFixed(2));
  if (text.includes('амбра') || text.includes('ваниль') || text.includes('кардамон')) temp = Math.min(temp, -0.4);
  if (text.includes('цитрон') || text.includes('мята') || text.includes('морск')) temp = Math.max(temp, 0.4);

  // 7. time_of_day: y (-1 Вечер .. +1 День)
  const tod = Number((y * 0.80).toFixed(2));

  // 8. season: y (-1 Зима .. +1 Лето)
  const ssn = Number((y * 0.90).toFixed(2));

  return {
    distance: Math.max(-1, Math.min(1, dist)),
    formality: Math.max(-1, Math.min(1, form)),
    power: Math.max(-1, Math.min(1, pwr)),
    mood: Math.max(-1, Math.min(1, md)),
    diffusion: Math.max(-1, Math.min(1, diff)),
    temperature: Math.max(-1, Math.min(1, temp)),
    time_of_day: Math.max(-1, Math.min(1, tod)),
    season: Math.max(-1, Math.min(1, ssn)),
  };
}

/**
 * Расчет взвешенного евклидова расстояния в 8D-пространстве
 */
export function calculateWeightedDistance(v1: Anyanov8DVector, v2: Anyanov8DVector): number {
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
 * Расчет косинусного сходства в 8D-пространстве
 */
export function calculateCosineSimilarity(v1: Anyanov8DVector, v2: Anyanov8DVector): number {
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
 * Анализ расхождений по 8 каноническим осям Системы Аньянова
 */
export function diagnoseClashes(outfitVec: Anyanov8DVector, perfumeVec: Anyanov8DVector): AxisClash[] {
  const clashes: AxisClash[] = [];

  for (const axis of AXES) {
    const valO = outfitVec[axis];
    const valP = perfumeVec[axis];
    const diff = Math.abs(valO - valP);

    if (diff >= 1.0) {
      let diagnosis = `Критический разрыв: лук (${valO > 0 ? '+' : ''}${valO.toFixed(2)}) vs аромат (${valP > 0 ? '+' : ''}${valP.toFixed(2)})`;
      if (axis === 'distance') {
        diagnosis = `Конфликт дистанции: лук держит субординацию (${valO.toFixed(2)}), а аромат зовет к интиму (${valP.toFixed(2)})`;
      } else if (axis === 'formality') {
        diagnosis = `Конфликт дресс-кода: строгий силуэт (${valO.toFixed(2)}) vs неформальный парфюм (${valP.toFixed(2)})`;
      } else if (axis === 'power') {
        diagnosis = `Диссонанс власти: статусное доминирование (${valO.toFixed(2)}) спорит с кодом соблазна (${valP.toFixed(2)})`;
      } else if (axis === 'mood') {
        diagnosis = `Конфликт фокуса: рабочий фокус лука (${valO.toFixed(2)}) гасится расслабленным тоном аромата (${valP.toFixed(2)})`;
      } else if (axis === 'temperature') {
        diagnosis = `Термо-диссонанс: согревающий регистр (${valO.toFixed(2)}) против ледяного бриза (${valP.toFixed(2)})`;
      } else if (axis === 'diffusion') {
        diagnosis = `Диссонанс динамики: стойкая глубина (${valO.toFixed(2)}) vs летучий импульс (${valP.toFixed(2)})`;
      } else if (axis === 'time_of_day') {
        diagnosis = `Сбой времени: вечерний образ (${valO.toFixed(2)}) диссонирует с ярким дневным шлейфом (${valP.toFixed(2)})`;
      } else if (axis === 'season') {
        diagnosis = `Сезонный конфликт: зимняя плотность (${valO.toFixed(2)}) против летнего регистра (${valP.toFixed(2)})`;
      }

      clashes.push({
        axis,
        diff: Number(diff.toFixed(2)),
        diagnosis,
      });
    } else if (diff >= 0.65) {
      clashes.push({
        axis,
        diff: Number(diff.toFixed(2)),
        diagnosis: `Стильный контрапункт [${AXIS_LABELS[axis].name}]: лук ${valO > 0 ? '+' : ''}${valO.toFixed(2)} vs аромат ${valP > 0 ? '+' : ''}${valP.toFixed(2)}`,
      });
    }
  }

  return clashes.sort((a, b) => b.diff - a.diff);
}

/**
 * Главный метод Мультимодального Сольфеджио Стиля (8D)
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
    verdict = 'Идеальное созвучие: аромат и одежда резонируют в едином 8-мерном семантическом регистре.';
  } else if (distance <= 0.95) {
    const majorClashes = clashes.filter((c) => c.diff >= 1.0);
    if (majorClashes.length <= 1) {
      harmonyState = 'CONTRAPUNCT';
      stateLabel = 'Благородный Контрапункт (Полифония)';
      badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      verdict = 'Высокий стиль: выверенное эстетическое напряжение по ключевой оси Системы Аньянова.';
    } else {
      harmonyState = 'DIVERGENCE';
      stateLabel = 'Умеренная Дивергенция';
      badgeColor = 'bg-sky-500/20 text-sky-300 border-sky-500/40';
      verdict = 'Звучание эклектичное, слегка расфокусированное по нескольким измерениям контекста.';
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
