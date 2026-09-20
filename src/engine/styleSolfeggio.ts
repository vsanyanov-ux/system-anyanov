import {
  Anyanov10DVector,
  AxisClash,
  CanonicalTetrad,
  HarmonyState,
  OutfitStack,
  PerfumeItem,
  SignalAmplitude,
  SolfeggioAnalysis,
  TetradChannelEvaluation,
  WardrobeItem,
} from '../types';

/**
 * 10 Канонических Ортогональных Измерений Системы Аньянова:
 *
 * 5 осей намерения / семиотики (Социальный контур / Вектор X):
 * 1. distance: -1.0 (Обособленность / Субординация) <-> +1.0 (Интим / Сближение)
 * 2. formality: -1.0 (Business Formal) <-> +1.0 (Casual)
 * 3. power: -1.0 (Статус / Твердая власть) <-> +1.0 (Соблазн / Шарм / Эрос)
 * 4. mood: -1.0 (Собранность / Фокус) <-> +1.0 (Легкость / Свобода / Релакс)
 * 5. expression: -1.0 (Statement / Драма / Fortissimo) <-> +1.0 (Quiet Luxury / Сдержанность / Pianissimo)
 *
 * 5 осей среды / хронотопа (Физический контекст / Вектор Y):
 * 6. season: -1.0 (Зима / Плотность) <-> +1.0 (Лето / Воздух)
 * 7. temperature: -1.0 (Тепло / Согревающий) <-> +1.0 (Холод / Освежающий)
 * 8. time_of_day: -1.0 (Вечер / Глубина) <-> +1.0 (День / Свет)
 * 9. space: -1.0 (Indoor / Помещение / Замкнутость) <-> +1.0 (Outdoor / Стихия / Открытый воздух)
 * 10. chronometry: -1.0 (Марафон / Долгий день 12+ ч) <-> +1.0 (Спринт / Экспресс 30–60 мин)
 *
 * Примечание: диффузия (скорость испарения/шлейф) исключена из координатных осей
 * для устранения мультиколлинеарности и перенесена в выходной канал Тетрады (Запах).
 */
export const INTENT_AXES: (keyof Anyanov10DVector)[] = [
  'distance',
  'formality',
  'power',
  'mood',
  'expression',
];

export const ENVIRONMENT_AXES: (keyof Anyanov10DVector)[] = [
  'season',
  'temperature',
  'time_of_day',
  'space',
  'chronometry',
];

export const AXES: (keyof Anyanov10DVector)[] = [
  ...INTENT_AXES,
  ...ENVIRONMENT_AXES,
];

export const AXIS_LABELS: Record<
  keyof Anyanov10DVector,
  { name: string; left: string; right: string; group: 'intent' | 'environment' }
> = {
  // 5 осей намерения (X)
  distance: { name: 'Дистанция', left: 'Обособленность', right: 'Интим / Сближение', group: 'intent' },
  formality: { name: 'Формальность', left: 'Business Formal', right: 'Casual', group: 'intent' },
  power: { name: 'Власть', left: 'Статус / Твердость', right: 'Соблазн / Шарм', group: 'intent' },
  mood: { name: 'Настроение', left: 'Фокус / Дисциплина', right: 'Легкость / Свобода', group: 'intent' },
  expression: { name: 'Экспрессия', left: 'Statement / Драма', right: 'Quiet Luxury', group: 'intent' },

  // 5 осей среды (Y)
  season: { name: 'Сезон', left: 'Зима / Плотность', right: 'Лето / Воздух', group: 'environment' },
  temperature: { name: 'Температура', left: 'Тепло / Кашемир', right: 'Холод / Освежающий', group: 'environment' },
  time_of_day: { name: 'Время суток', left: 'Вечер / Глубина', right: 'День / Прозрачность', group: 'environment' },
  space: { name: 'Локация', left: 'Indoor / Помещение', right: 'Outdoor / Стихия', group: 'environment' },
  chronometry: { name: 'Хронометраж', left: 'Марафон / 12+ ч', right: 'Спринт / Экспресс', group: 'environment' },
};

export const DEFAULT_WEIGHTS: Record<keyof Anyanov10DVector, number> = {
  // Намерение
  distance: 1.2,
  formality: 1.2,
  power: 1.1,
  mood: 1.0,
  expression: 1.0,

  // Среда
  season: 0.9,
  temperature: 1.0,
  time_of_day: 0.9,
  space: 0.8,
  chronometry: 0.8,
};

/**
 * Вычисляет средневзвешенный 10D-вектор всего гардеробного лука из слоев L1..L4
 */
export function calculateOutfitAestheticVector(stack: OutfitStack): Anyanov10DVector {
  const items: { item: WardrobeItem; weight: number }[] = [];
  if (stack.l4) items.push({ item: stack.l4, weight: 0.40 });
  if (stack.l3) items.push({ item: stack.l3, weight: stack.l4 ? 0.30 : 0.50 });
  if (stack.l2) items.push({ item: stack.l2, weight: 0.20 });
  if (stack.l1) items.push({ item: stack.l1, weight: 0.10 });

  const result: Anyanov10DVector = {
    distance: 0,
    formality: 0,
    power: 0,
    mood: 0,
    expression: 0,
    season: 0,
    temperature: 0,
    time_of_day: 0,
    space: 0,
    chronometry: 0,
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
 * Определение 10D вектора Системы Аньянова для отдельного предмета одежды
 */
export function getItemAestheticVector(item: WardrobeItem): Anyanov10DVector {
  if (item.aestheticValues) {
    return {
      distance: item.aestheticValues.distance ?? 0,
      formality: item.aestheticValues.formality ?? 0,
      power: item.aestheticValues.power ?? 0,
      mood: item.aestheticValues.mood ?? 0,
      expression: item.aestheticValues.expression ?? 0,
      season: item.aestheticValues.season ?? 0,
      temperature: item.aestheticValues.temperature ?? 0,
      time_of_day: item.aestheticValues.time_of_day ?? 0,
      space: item.aestheticValues.space ?? 0,
      chronometry: item.aestheticValues.chronometry ?? 0,
    };
  }

  const name = (item.name + ' ' + item.fabric + ' ' + item.description).toLowerCase();
  const col = (item.colorName + ' ' + item.color).toLowerCase();

  // --- 5 ОСЕЙ НАМЕРЕНИЯ (Ось X) ---

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

  // 5. expression: -1 (Statement / Драма / Fortissimo) .. +1 (Quiet Luxury / Сдержанность / Pianissimo)
  let expr = 0.20;
  if (name.includes('пайетк') || name.includes('лак') || name.includes('кожан') || name.includes('массивн') || name.includes('контраст')) {
    expr = -0.75; // Statement / Драма
  } else if (name.includes('кашемир') || name.includes('baby') || name.includes('super') || name.includes('шерсть') || name.includes('экрю') || name.includes('пастел')) {
    expr = 0.80; // Quiet Luxury / Сдержанный шик
  } else if (item.formalIndex === 3) {
    expr = 0.30;
  }

  // --- 5 ОСЕЙ СРЕДЫ (Ось Y) ---

  // 6. season: -1 (Зима) .. +1 (Лето)
  let ssn = 0.0;
  if (item.maxTemp <= 10) ssn = -0.90;
  else if (item.minTemp >= 18) ssn = 0.85;
  else ssn = 0.0;

  // 7. temperature: -1 (Тепло / Согревающий) .. +1 (Холод / Освежающий)
  let temp = 0.0;
  if (item.maxTemp <= 10) temp = -0.85; // зимняя, согревающая
  else if (item.maxTemp <= 20) temp = -0.35;
  else if (item.minTemp >= 20) temp = 0.80; // летняя, освежающая
  else temp = 0.10;

  // 8. time_of_day: -1 (Вечер / Темный / Глубокий) .. +1 (День / Светлый / Яркий)
  let tod = 0.0;
  if (col.includes('черн') || col.includes('темн') || col.includes('графит') || col.includes('navy')) {
    tod = -0.75;
  } else if (col.includes('бел') || col.includes('светл') || col.includes('беж') || col.includes('голуб')) {
    tod = 0.75;
  } else {
    tod = 0.10;
  }

  // 9. space: -1 (Indoor / Помещение / Замкнутость) .. +1 (Outdoor / Стихия / Открытый воздух)
  let spc = 0.0;
  if (item.isOverwear || name.includes('пальто') || name.includes('пуховик') || name.includes('куртка') || name.includes('плащ')) {
    spc = 0.85; // Outdoor-защита
  } else if (item.layer === 'L3') {
    spc = -0.70; // Нательный комнатный слой
  } else if (item.layer === 'L4' && !item.isOverwear) {
    spc = -0.45; // Интерьерный блейзер / пиджак
  } else {
    spc = -0.10;
  }

  // 10. chronometry: -1 (Марафон / 12+ часов) .. +1 (Спринт / Экспресс 30–60 мин)
  let chr = 0.0;
  if (name.includes('кеды') || name.includes('чинос') || name.includes('трикотаж') || name.includes('футболка')) {
    chr = -0.75; // Марафонский комфорт
  } else if (item.formalIndex === 3 || name.includes('смокинг') || name.includes('лаков') || name.includes('галстук-бабочка')) {
    chr = 0.80; // Торжественный спринт
  } else {
    chr = -0.15;
  }

  return {
    distance: Math.max(-1, Math.min(1, dist)),
    formality: Math.max(-1, Math.min(1, form)),
    power: Math.max(-1, Math.min(1, pwr)),
    mood: Math.max(-1, Math.min(1, md)),
    expression: Math.max(-1, Math.min(1, expr)),
    season: Math.max(-1, Math.min(1, ssn)),
    temperature: Math.max(-1, Math.min(1, temp)),
    time_of_day: Math.max(-1, Math.min(1, tod)),
    space: Math.max(-1, Math.min(1, spc)),
    chronometry: Math.max(-1, Math.min(1, chr)),
  };
}

/**
 * Проекция ортогонального 10D-вектора на 2D-плоскость Аньянова:
 * X (Социальный контур намерения): 5 осей семиотики и воли
 * Y (Физико-временной контур среды): 5 осей хронотопа и термодинамики
 */
export function projectOutfitTo2D(stack: OutfitStack, vector: Anyanov10DVector): { x: number; y: number } {
  // Социальная ось X: среднее от 5 осей намерения (distance, formality, power, mood, expression)
  const rawX = (vector.distance + vector.formality + vector.power + vector.mood + vector.expression) / 5;

  // Физико-временная ось Y: среднее от 5 осей среды (season, temperature, time_of_day, space, chronometry)
  const rawY = (vector.season + vector.temperature + vector.time_of_day + vector.space + vector.chronometry) / 5;

  return {
    x: Number(Math.max(-0.95, Math.min(0.95, rawX)).toFixed(2)),
    y: Number(Math.max(-0.95, Math.min(0.95, rawY)).toFixed(2)),
  };
}

/**
 * Извлечение канонического 10D-вектора аромата
 */
export function getPerfumeAestheticVector(perfume: PerfumeItem): Anyanov10DVector {
  if (perfume.aestheticValues) {
    return {
      distance: perfume.aestheticValues.distance ?? 0,
      formality: perfume.aestheticValues.formality ?? 0,
      power: perfume.aestheticValues.power ?? 0,
      mood: perfume.aestheticValues.mood ?? 0,
      expression: perfume.aestheticValues.expression ?? 0,
      season: perfume.aestheticValues.season ?? 0,
      temperature: perfume.aestheticValues.temperature ?? 0,
      time_of_day: perfume.aestheticValues.time_of_day ?? 0,
      space: perfume.aestheticValues.space ?? 0,
      chronometry: perfume.aestheticValues.chronometry ?? 0,
    };
  }

  // Декодируем вектор аромата из координат (xCoord, yCoord), нот и диффузии
  const x = perfume.xCoord; // -1 (Власть / Фокус) .. +1 (Соблазн / Интим)
  const y = perfume.yCoord; // -1 (Зима / Вечер / Тепло) .. +1 (Лето / День / Холод)
  const text = (perfume.name + ' ' + perfume.dominantVibe + ' ' + perfume.pyramid.base.join(' ') + ' ' + perfume.pyramid.heart.join(' ')).toLowerCase();

  // --- 5 ОСЕЙ НАМЕРЕНИЯ (Ось X) ---
  // 1. distance: x (-1 Обособленность .. +1 Интим)
  const dist = Number((x * 0.85).toFixed(2));

  // 2. formality: -x (строгий статус vs расслабленный флирт)
  const form = Number((-x * 0.75).toFixed(2));

  // 3. power: x (-1 Статус / Твердость .. +1 Соблазн / Шарм)
  const pwr = Number((x * 0.90).toFixed(2));

  // 4. mood: y (-1 Собранность / Фокус .. +1 Легкость / Релакс)
  const md = Number((y * 0.80).toFixed(2));

  // 5. expression: диффузия и контраст (Statement vs Quiet Luxury)
  let expr = 0.0;
  if (perfume.diffusion === 'Ударная') expr = -0.85; // Fortissimo / Statement
  else if (perfume.diffusion === 'Шлейфовая') expr = -0.40;
  else if (perfume.diffusion === 'Умеренная') expr = 0.35;
  else expr = 0.85; // Интимная = Pianissimo / Quiet Luxury

  // --- 5 ОСЕЙ СРЕДЫ (Ось Y) ---
  // 6. season: y (-1 Зима .. +1 Лето)
  const ssn = Number((y * 0.90).toFixed(2));

  // 7. temperature: y (-1 Тепло .. +1 Холод)
  let temp = Number((y * 0.85).toFixed(2));
  if (text.includes('амбра') || text.includes('ваниль') || text.includes('кардамон') || text.includes('кориц') || text.includes('уд')) {
    temp = Math.min(temp, -0.45);
  }
  if (text.includes('цитрон') || text.includes('мята') || text.includes('морск') || text.includes('озон') || text.includes('грейпфрут')) {
    temp = Math.max(temp, 0.45);
  }

  // 8. time_of_day: y (-1 Вечер .. +1 День)
  const tod = Number((y * 0.80).toFixed(2));

  // 9. space: Indoor (-1) vs Outdoor (+1)
  let spc = 0.0;
  if (perfume.diffusion === 'Ударная') spc = 0.80; // Требует открытого воздуха / ветра
  else if (perfume.diffusion === 'Шлейфовая') spc = 0.25;
  else if (perfume.diffusion === 'Интимная') spc = -0.85; // Идеален для камерного интерьера
  else spc = -0.30;

  // 10. chronometry: Марафон (-1) vs Спринт (+1)
  let chr = 0.0;
  const baseNotesCount = perfume.pyramid.base.length;
  if (text.includes('уд') || text.includes('амброксан') || text.includes('кожа') || text.includes('пачули') || baseNotesCount >= 4) {
    chr = -0.75; // Марафонская фиксация 12+ ч
  } else if (perfume.pyramid.top.some((n) => n.toLowerCase().includes('цитрус') || n.toLowerCase().includes('бергамот')) && baseNotesCount <= 2) {
    chr = 0.65; // Быстрый летучий одеколонный спринт
  } else {
    chr = -0.20;
  }

  return {
    distance: Math.max(-1, Math.min(1, dist)),
    formality: Math.max(-1, Math.min(1, form)),
    power: Math.max(-1, Math.min(1, pwr)),
    mood: Math.max(-1, Math.min(1, md)),
    expression: Math.max(-1, Math.min(1, expr)),
    season: Math.max(-1, Math.min(1, ssn)),
    temperature: Math.max(-1, Math.min(1, temp)),
    time_of_day: Math.max(-1, Math.min(1, tod)),
    space: Math.max(-1, Math.min(1, spc)),
    chronometry: Math.max(-1, Math.min(1, chr)),
  };
}

/**
 * Расчет взвешенного евклидова расстояния в 10D-пространстве
 */
export function calculateWeightedDistance(v1: Anyanov10DVector, v2: Anyanov10DVector): number {
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
 * Расчет косинусного сходства в 10D-пространстве
 */
export function calculateCosineSimilarity(v1: Anyanov10DVector, v2: Anyanov10DVector): number {
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
 * Анализ расхождений по 10 каноническим осям Системы Аньянова
 */
export function diagnoseClashes(outfitVec: Anyanov10DVector, perfumeVec: Anyanov10DVector): AxisClash[] {
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
      } else if (axis === 'expression') {
        diagnosis = `Конфликт экспрессии: сдержанный шик Quiet Luxury (${valO.toFixed(2)}) заглушается ударным Statement-сигналом (${valP.toFixed(2)})`;
      } else if (axis === 'temperature') {
        diagnosis = `Термо-диссонанс: согревающий регистр (${valO.toFixed(2)}) против ледяного бриза (${valP.toFixed(2)})`;
      } else if (axis === 'time_of_day') {
        diagnosis = `Сбой времени: вечерний образ (${valO.toFixed(2)}) диссонирует с ярким дневным шлейфом (${valP.toFixed(2)})`;
      } else if (axis === 'season') {
        diagnosis = `Сезонный конфликт: зимняя плотность (${valO.toFixed(2)}) против летнего регистра (${valP.toFixed(2)})`;
      } else if (axis === 'space') {
        diagnosis = `Конфликт локации: камерный интерьер (${valO.toFixed(2)}) перегружен открытым уличным диффузом (${valP.toFixed(2)})`;
      } else if (axis === 'chronometry') {
        diagnosis = `Конфликт тайминга: марафонская посадка лука (${valO.toFixed(2)}) спорит с быстротечным спринтом аромата (${valP.toFixed(2)})`;
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
 * Синтез Канонической Тетрады Воплощения (4 Выходных Канала: Форма — Фактура — Цвет — Запах)
 * Реализует Закон I Невербального Резонанса и Закон Нулевой Границы.
 */
export function synthesizeCanonicalTetrad(
  stack: OutfitStack,
  perfume: PerfumeItem,
  outfitVec: Anyanov10DVector,
  perfumeVec: Anyanov10DVector
): CanonicalTetrad {
  // 1. КАНАЛ ФОРМЫ (Геометрия силуэта)
  const topLayer = stack.l4 || stack.l3;
  const isStructured = topLayer.silhouette === 'structured' || topLayer.formalIndex === 3;
  const isDraped = topLayer.silhouette === 'draped';
  const formValue = isStructured
    ? 'Структурированный каркас (Structured Arch)'
    : isDraped
    ? 'Мягкая драпировка (Draped Line)'
    : 'Свободный анатомический крой (Relaxed Contour)';

  const formClash = Math.abs(outfitVec.formality - perfumeVec.formality) >= 1.0;
  const formScore = formClash ? 45 : Math.abs(outfitVec.formality - perfumeVec.formality) >= 0.65 ? 75 : 95;
  const formEvaluation: TetradChannelEvaluation = {
    name: 'Форма',
    value: formValue,
    detail: `Плечевой контур и окат: ${topLayer.name}. Задает семиотическую рамку власти (${outfitVec.power > 0 ? '+' : ''}${outfitVec.power.toFixed(2)}) и формальности (${outfitVec.formality > 0 ? '+' : ''}${outfitVec.formality.toFixed(2)}).`,
    targetIntent: 'Геометрия и субординация (Вектор Власти X3)',
    status: formClash ? 'CLASH' : formScore >= 85 ? 'CONSONANT' : 'CONTRAPUNCT',
    resonanceScore: formScore,
  };

  // 2. КАНАЛ ФАКТУРЫ (Материя и плотность)
  const fabrics = [stack.l4?.fabric, stack.l3.fabric, stack.l2.fabric].filter(Boolean).join(' / ');
  const tempClash = Math.abs(outfitVec.temperature - perfumeVec.temperature) >= 1.0;
  const textureScore = tempClash ? 40 : Math.abs(outfitVec.temperature - perfumeVec.temperature) >= 0.65 ? 70 : 92;
  const textureEvaluation: TetradChannelEvaluation = {
    name: 'Фактура',
    value: fabrics || 'Натуральные волокна гардероба',
    detail: `Тактильный теплообмен: ${stack.l3.fabric} (L3)${stack.l4 ? `, ${stack.l4.fabric} (L4)` : ''}. Регулирует термодинамику (${outfitVec.temperature > 0 ? '+' : ''}${outfitVec.temperature.toFixed(2)}) и дистанцию сближения.`,
    targetIntent: 'Материя и теплоемкость (Термодинамика Y2)',
    status: tempClash ? 'CLASH' : textureScore >= 85 ? 'CONSONANT' : 'CONTRAPUNCT',
    resonanceScore: textureScore,
  };

  // 3. КАНАЛ ЦВЕТА (Оптика и светопоглощение)
  const colors = [stack.l4?.colorName, stack.l3.colorName, stack.l2.colorName].filter(Boolean).join(' • ');
  const todClash = Math.abs(outfitVec.time_of_day - perfumeVec.time_of_day) >= 1.0;
  const colorScore = todClash ? 50 : Math.abs(outfitVec.time_of_day - perfumeVec.time_of_day) >= 0.65 ? 78 : 94;
  const colorEvaluation: TetradChannelEvaluation = {
    name: 'Цвет',
    value: colors || 'Монохромный ансамбль',
    detail: `Световой баланс: согласован со световым протоколом (${outfitVec.time_of_day > 0 ? '+' : ''}${outfitVec.time_of_day.toFixed(2)}) и контрастом темы «${perfume.colorTheme}».`,
    targetIntent: 'Оптический захват (Световой протокол Y3 & Экспрессия X5)',
    status: todClash ? 'CLASH' : colorScore >= 85 ? 'CONSONANT' : 'CONTRAPUNCT',
    resonanceScore: colorScore,
  };

  // 4. КАНАЛ ЗАПАХА (Аура и молекулярный вес)
  const distClash = Math.abs(outfitVec.distance - perfumeVec.distance) >= 1.0;
  const scentScore = distClash ? 42 : Math.abs(outfitVec.distance - perfumeVec.distance) >= 0.65 ? 72 : 96;
  const scentEvaluation: TetradChannelEvaluation = {
    name: 'Запах',
    value: `${perfume.name} [Диффузия: ${perfume.diffusion}]`,
    detail: `Ольфакторный замок: ${perfume.dominantVibe}. База (${perfume.pyramid.base.slice(0, 3).join(', ')}) фиксирует шлейф и закрывает проксемику (${perfumeVec.distance > 0 ? '+' : ''}${perfumeVec.distance.toFixed(2)}).`,
    targetIntent: 'Лимбический якорь (Проксемика X1 & Пространство Y4)',
    status: distClash ? 'CLASH' : scentScore >= 85 ? 'CONSONANT' : 'CONTRAPUNCT',
    resonanceScore: scentScore,
  };

  // Определение амплитуды сигнала (Signal Amplitude / Gain: Fortissimo vs Pianissimo)
  const combinedExpression = (outfitVec.expression + perfumeVec.expression) / 2;
  let amplitude: SignalAmplitude = 'MEZZO';
  if (combinedExpression <= -0.40 || perfume.diffusion === 'Ударная') {
    amplitude = 'FORTISSIMO';
  } else if (combinedExpression >= 0.40 || perfume.diffusion === 'Интимная') {
    amplitude = 'PIANISSIMO';
  }

  // Закон Нулевой Границы (Zero-Crossing Rule):
  // Блокирует переход через нейтраль (0.0), если ключевые векторы диаметрально противоположны
  const zeroCrossingViolation =
    (outfitVec.formality * perfumeVec.formality < -0.25 && Math.abs(outfitVec.formality - perfumeVec.formality) >= 1.1) ||
    (outfitVec.power * perfumeVec.power < -0.25 && Math.abs(outfitVec.power - perfumeVec.power) >= 1.1) ||
    (outfitVec.temperature * perfumeVec.temperature < -0.25 && Math.abs(outfitVec.temperature - perfumeVec.temperature) >= 1.1);

  // Закон Сезонной Асимметрии (Seasonal Asymmetry & Hardware Lock):
  // 1. Зимний замок (Winter Lock): морозный контекст (season <= -0.40) несовместим с ароматами Квадранта I (NE: лён, нероли)
  const isWinterLock = outfitVec.season <= -0.40 && perfumeVec.season >= 0.45 && perfumeVec.distance >= 0.20;
  
  // 2. Летний режим Pianissimo: жаркий контекст (season >= 0.40, time_of_day > 0) требует Pianissimo для тяжелых смол/кожи/гурманности
  const isSummerHeavyClash = outfitVec.season >= 0.40 && (perfumeVec.season <= -0.50 || perfume.diffusion === 'Ударная');
  const isSummerPianissimoRequired = isSummerHeavyClash && amplitude === 'FORTISSIMO';

  let activeNotice: string | undefined;
  if (isWinterLock) {
    activeNotice = 'Зимний аппаратный замок: легколетучие молекулы Квадранта I замерзают на морозе. Необходим переход к Центральному Камертону (Grey Vetiver) или хвойному можжевельнику.';
  } else if (isSummerPianissimoRequired) {
    activeNotice = 'Летнее демпфирование: тяжелые смолы и кожа на дневной жаре вызывают ольфакторный шок. Необходим режим Pianissimo (1 микроспрей) под шелк или тонкую замшу.';
  }

  // Проверка монолитности: все 4 канала свободны от CLASH, нет Zero-Crossing и нет жесткого WinterLock
  const channels = [formEvaluation, textureEvaluation, colorEvaluation, scentEvaluation];
  const isMonolithic = channels.every((ch) => ch.status !== 'CLASH') && !zeroCrossingViolation && !isWinterLock && !isSummerPianissimoRequired;

  let summaryVerdict = '';
  if (isWinterLock) {
    summaryVerdict = 'Аппаратная блокировка Квадранта I: морозный климат разрушает летучие терпены. Используйте Центральный Камертон.';
  } else if (isSummerPianissimoRequired) {
    summaryVerdict = 'Требуется демпфирование Pianissimo: тяжелая молекулярная масса парфюма перегревается на летнем солнце.';
  } else if (zeroCrossingViolation) {
    summaryVerdict = 'Нарушение Закона Нулевой Границы: один из каналов Тетрады пытается одновременно транслировать противоположные полюса смысла.';
  } else if (isMonolithic) {
    summaryVerdict = `Монолитная Тетрада (${amplitude}): Форма, Фактура, Цвет и Запах действуют синфазно, создавая безупречный невербальный резонанс.`;
  } else {
    summaryVerdict = 'Полифоническая Тетрада: присутствуют смысловые натяжения между материальными и ольфакторными каналами.';
  }

  return {
    form: formEvaluation,
    texture: textureEvaluation,
    color: colorEvaluation,
    scent: scentEvaluation,
    isMonolithic,
    zeroCrossingViolation,
    amplitude,
    summaryVerdict,
    seasonalAudit: {
      isWinterLock,
      isSummerPianissimoRequired,
      activeNotice,
    },
  };
}

/**
 * Главный метод Мультимодального Сольфеджио Стиля (Канонический 10D-базис)
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
  const tetrad = synthesizeCanonicalTetrad(stack, perfume, outfitVector, perfumeVector);

  let harmonyState: HarmonyState;
  let stateLabel: string;
  let badgeColor: string;
  let verdict: string;

  if (distance <= 0.48 && !tetrad.zeroCrossingViolation && !tetrad.seasonalAudit?.isWinterLock && !tetrad.seasonalAudit?.isSummerPianissimoRequired) {
    harmonyState = 'UNISON';
    stateLabel = 'Унисон (Тотальный Консонанс)';
    badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    verdict = 'Идеальное созвучие: аромат и гардероб резонируют в едином 10-мерном ортогональном регистре Тетрады.';
  } else if (distance <= 0.95 && !tetrad.zeroCrossingViolation && !tetrad.seasonalAudit?.isWinterLock && !tetrad.seasonalAudit?.isSummerPianissimoRequired) {
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
  } else if (distance <= 1.40 || tetrad.zeroCrossingViolation || tetrad.seasonalAudit?.isWinterLock || tetrad.seasonalAudit?.isSummerPianissimoRequired) {
    harmonyState = 'DISSONANCE';
    stateLabel = 'Семантический Диссонанс';
    badgeColor = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    if (tetrad.seasonalAudit?.isWinterLock) {
      verdict = 'Зимний аппаратный замок: летние терпены Квадранта I разрушаются на морозе. Перейдите к Центральному Камертону (Grey Vetiver).';
    } else if (tetrad.seasonalAudit?.isSummerPianissimoRequired) {
      verdict = 'Летний тепловой сбой: тяжелые смолы на дневной жаре вызывают удушье. Требуется переход в режим Pianissimo (1 спрей).';
    } else if (tetrad.zeroCrossingViolation) {
      verdict = 'Срыв Нулевой Границы: несовместимые полярности кода между внешним обликом и ольфакторным сигналом.';
    } else {
      verdict = 'Ощутимый конфликт кодов: зрительный образ одежды противоречит ольфакторному сигналу аромата.';
    }
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
    tetrad,
  };
}
