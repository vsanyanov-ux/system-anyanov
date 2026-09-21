import { AnyanovCoordinates, FormalIndex } from '../types';

export interface SemanticParseResult {
  query: string;
  coords: AnyanovCoordinates;
  summary: string;
  detectedFactors: {
    category: 'Повод' | 'Отношения' | 'Локация' | 'Погода' | 'Время';
    label: string;
    impact: string;
  }[];
  confidence: number;
}

/**
 * Интеллектуальный семантический парсер Системы Аньянова.
 * Переводит произвольный пользовательский запрос на естественном языке
 * в калиброванные координаты (socialX, thermoY, formalIndex, temperatureC).
 */
export function parseNaturalLanguageQuery(rawQuery: string): SemanticParseResult {
  const query = rawQuery.trim();
  const q = query.toLowerCase();

  // Базовые координаты (Smart Casual по умолчанию)
  let socialX = 0.0;
  let thermoY = 0.2;
  let formalIndex: FormalIndex = 2;
  let temperatureC = 22;

  const detectedFactors: SemanticParseResult['detectedFactors'] = [];
  let summary = 'Сбалансированный образ Smart Casual';

  // 1. Извлечение явной температуры (например: "+25", "18 градусов", "-10", "30°C")
  const tempMatch = q.match(/([+-]?\d{1,2})\s*(?:°|град|c\b)/);
  if (tempMatch) {
    const parsedTemp = parseInt(tempMatch[1], 10);
    if (!isNaN(parsedTemp) && parsedTemp >= -25 && parsedTemp <= 50) {
      temperatureC = Math.max(-20, Math.min(45, parsedTemp));
      detectedFactors.push({
        category: 'Погода',
        label: `${temperatureC > 0 ? '+' : ''}${temperatureC}°C`,
        impact: `Калибровка слоев L1–L4 под температуру ${temperatureC}°C`,
      });
    }
  }

  // 2. Распознавание поводов и контекста
  if (
    q.includes('королев') ||
    q.includes('монарх') ||
    q.includes('прием у') ||
    q.includes('светск') ||
    q.includes('дипломат') ||
    q.includes('посольств') ||
    q.includes('аудиенци') ||
    q.includes('бал') ||
    q.includes('гала') ||
    q.includes('раут') ||
    q.includes('black tie') ||
    q.includes('white tie') ||
    q.includes('смокинг') ||
    q.includes('фрак')
  ) {
    formalIndex = 3;
    socialX = -0.85;
    thermoY = -0.70;
    if (!tempMatch) temperatureC = 20;

    detectedFactors.push({
      category: 'Повод',
      label: 'Светский прием / Королевский протокол',
      impact: 'Высшая субординация (Night Formal / Статус), монументальный статус, строгая дистанция',
    });
    summary = 'Светский вечер и закрытое культурное событие (Night Formal)';
  } else if (q.includes('свадьб') || q.includes('венчан') || q.includes('торжеств')) {
    formalIndex = 2;
    socialX += 0.35;
    thermoY += 0.25;
    if (!tempMatch) temperatureC = 23;

    detectedFactors.push({
      category: 'Повод',
      label: 'Свадьба / Торжество',
      impact: 'Праздничный стиль: нарядный блейзер, чистые светлые тона',
    });
    summary = 'Торжественный праздничный стиль (Smart Formal / Festive)';
  } else if (q.includes('переговор') || q.includes('инвестор') || q.includes('совет директор') || q.includes('сделк') || q.includes('суд')) {
    formalIndex = 3;
    socialX = -0.75;
    thermoY = 0.55;
    if (!tempMatch) temperatureC = 21;

    detectedFactors.push({
      category: 'Повод',
      label: 'Деловые переговоры / Инвестор',
      impact: 'Высокая субординация, структурированный костюм, авторитет',
    });
    summary = 'Статус и твёрдая субординация (Business Formal)';
  } else if (q.includes('свидан') || q.includes('ресторан') || q.includes('романтик') || q.includes('девушк') || q.includes('ужин вдвоем')) {
    formalIndex = 2;
    socialX = 0.65;
    thermoY = -0.55;
    if (!tempMatch) temperatureC = 19;

    detectedFactors.push({
      category: 'Повод',
      label: 'Романтическое свидание',
      impact: 'Мягкая сила, тактильный кашемир, интимный теплый шлейф',
    });
    summary = 'Магнетизм и притяжение (Вечерний Soft Power)';
  } else if (q.includes('собеседован') || q.includes('интервью')) {
    formalIndex = q.includes('банк') || q.includes('гос') ? 3 : 2;
    socialX = -0.4;
    thermoY = 0.45;
    detectedFactors.push({
      category: 'Повод',
      label: 'Собеседование',
      impact: 'Собранность, аналитический фокус, надежность и аккуратность',
    });
    summary = 'Профессиональный фокус и дисциплина';
  } else if (q.includes('клуб') || q.includes('вечерин') || q.includes('тусовк') || q.includes('пати') || /(?:^|\s)бар(?:\s|$|[.,!])/i.test(q) || q.includes('коктейль')) {
    formalIndex = 1;
    socialX = 0.55;
    thermoY = -0.4;
    detectedFactors.push({
      category: 'Повод',
      label: 'Клуб / Вечеринка',
      impact: 'Свободный непринужденный крой, шлейфовый комплиментарный аромат',
    });
    summary = 'Вечерняя непринужденность и динамика';
  } else if (q.includes('театр') || q.includes('опер') || q.includes('филармон') || q.includes('выставк') || (q.includes('галере') && !q.includes('торгов') && !q.includes('шопинг'))) {
    formalIndex = 3;
    socialX = -0.3;
    thermoY = -0.35;
    detectedFactors.push({
      category: 'Повод',
      label: 'Культурное событие / Театр',
      impact: 'Элегантная строгость, сдержанность, деликатный шлейф',
    });
    summary = 'Интеллектуальная элегантность';
  } else if (q.includes('офис') || q.includes('работ') || q.includes('будн')) {
    formalIndex = 2;
    socialX = -0.3;
    thermoY = 0.35;
    detectedFactors.push({
      category: 'Повод',
      label: 'Офис / Работа',
      impact: 'Smart Casual: блейзер, рубашка оксфорд, чинос',
    });
    summary = 'Универсальный офисный Smart Casual';
  } else if (
    q.includes('природ') ||
    q.includes('пикник') ||
    q.includes('шашлык') ||
    q.includes('барбекю') ||
    q.includes('гриль') ||
    q.includes('дач') ||
    q.includes('поход') ||
    q.includes('кемпинг') ||
    q.includes('палатк') ||
    q.includes('лес') ||
    q.includes('озер') ||
    q.includes('речк') ||
    q.includes('рыбалк') ||
    q.includes('хайкинг') ||
    q.includes('треккинг') ||
    q.includes('костер') ||
    (q.includes('за город') && !q.includes('свадьб') && !q.includes('переговор') && !q.includes('отел') && !q.includes('ресторан'))
  ) {
    formalIndex = 1;
    socialX = 0.70;
    thermoY = 0.60;
    if (!tempMatch) temperatureC = 22;

    detectedFactors.push({
      category: 'Повод',
      label: 'Природа / Загородный отдых / Пикник',
      impact: 'Свободный крой Casual (кеды, футболка, деним/чинос или куртка-рубашка), свежий природный шлейф',
    });
    summary = 'Расслабленный отдых на природе (Casual, комфорт и свобода)';
  } else if (q.includes('пляж') || q.includes('прогулк') || q.includes('набережн') || q.includes('парк') || q.includes('бранч') || q.includes('выходн') || q.includes('кино') || q.includes('шопинг') || q.includes('кафе') || q.includes('кофейн')) {
    formalIndex = 1;
    socialX = 0.65;
    thermoY = 0.8;
    if (!tempMatch) temperatureC = 26;
    detectedFactors.push({
      category: 'Повод',
      label: 'Отдых / Прогулка / Casual',
      impact: 'Максимальный комфорт, льняные ткани, светлая палитра, свежесть',
    });
    summary = 'Дневная легкость и непринужденность (Casual)';
  }

  // 3. Анализ отношений (социальная дистанция)
  if (
    q.includes('друг') ||
    q.includes('друз') ||
    q.includes('подруг') ||
    q.includes('подруж') ||
    q.includes('брат') ||
    q.includes('брать') ||
    q.includes('семь') ||
    q.includes('свои') ||
    q.includes('пацан') ||
    q.includes('ребят')
  ) {
    socialX = Math.min(1.0, socialX + 0.25);
    detectedFactors.push({
      category: 'Отношения',
      label: 'Близкий круг / Друзья',
      impact: 'Смещение в сторону эмпатии, открытости и тепла (+X)',
    });
  } else if (q.includes('босс') || q.includes('руковод') || q.includes('клиент') || q.includes('министр') || q.includes('королев') || q.includes('монарх') || q.includes('посол') || q.includes('президент') || q.includes('чужи')) {
    socialX = Math.max(-1.0, socialX - 0.35);
    detectedFactors.push({
      category: 'Отношения',
      label: 'Иерархия / Субординация',
      impact: 'Смещение в сторону обособленности и жесткого контроля (-X)',
    });
  }

  // 4. Локация и среда
  if (q.includes('за город') || q.includes('на природ') || q.includes('шатер') || q.includes('веранд') || q.includes('воздух') || q.includes('террас')) {
    socialX = Math.min(1.0, socialX + 0.15);
    thermoY = Math.min(1.0, thermoY + 0.15);
    // Для загородных условий формальность не должна быть строже 2
    if (formalIndex === 3 && !q.includes('совет')) {
      formalIndex = 2;
    }
    const hasNatureOccasion = detectedFactors.some(f => f.category === 'Повод' && f.label.includes('Природа'));
    if (!hasNatureOccasion) {
      detectedFactors.push({
        category: 'Локация',
        label: 'За городом / Открытый воздух',
        impact: formalIndex === 1
          ? 'Практичные дышащие материалы, комфортная обувь (кеды), защита от ветра'
          : 'Замшевая обувь вместо жестких оксфордов, дышащие фактуры',
      });
    }
  } else if (q.includes('отел') || q.includes('лобби') || q.includes('лаунж')) {
    detectedFactors.push({
      category: 'Локация',
      label: 'Премиальное лобби / Лаунж',
      impact: 'Дорогие тактильные ткани, сдержанный благородный шлейф',
    });
  }

  // 5. Сезон и Погода (если не была задана цифрой)
  if (q.includes('зим') || q.includes('мороз') || q.includes('снег') || q.includes('холод')) {
    if (!tempMatch) temperatureC = -5;
    thermoY = Math.max(-1.0, thermoY - 0.45);
    detectedFactors.push({
      category: 'Погода',
      label: 'Зима / Холод',
      impact: 'Плотная костюмная шерсть, теплое пальто L4, согревающие смолы',
    });
  } else if (q.includes('лет') || q.includes('жар') || q.includes('зной') || q.includes('солнц')) {
    if (!tempMatch) temperatureC = 27;
    thermoY = Math.min(1.0, thermoY + 0.35);
    detectedFactors.push({
      category: 'Погода',
      label: 'Лето / Тепло',
      impact: 'Легкие хлопковые и льняные фактуры, цитрусовая летучесть',
    });
  } else if (q.includes('осен') || q.includes('дожд') || q.includes('ветер')) {
    if (!tempMatch) temperatureC = 12;
    thermoY = Math.max(-1.0, thermoY - 0.2);
    detectedFactors.push({
      category: 'Погода',
      label: 'Осень / Прохлада',
      impact: 'Тренч или пальто L4, шерстяные слои, влажный ветивер',
    });
  }

  // 6. Время суток
  if (q.includes('вечер') || q.includes('ноч') || q.includes('закат')) {
    thermoY = Math.max(-1.0, thermoY - 0.35);
    detectedFactors.push({
      category: 'Время',
      label: 'Вечер / Сумерки',
      impact: 'Глубокая палитра, согревающие базовые ноты парфюма',
    });
  } else if (q.includes('утр') || q.includes('день') || q.includes('полден')) {
    thermoY = Math.min(1.0, thermoY + 0.25);
    detectedFactors.push({
      category: 'Время',
      label: 'День / Утро',
      impact: 'Свежесть, высокая диффузия верхних нот, светлые тона',
    });
  }

  // Нормализация координат в диапазон [-1.0, +1.0]
  const clampedX = Number(Math.max(-1.0, Math.min(1.0, socialX)).toFixed(2));
  const clampedY = Number(Math.max(-1.0, Math.min(1.0, thermoY)).toFixed(2));

  // Оценка уверенности распознавания
  const confidence = Math.min(1.0, Math.max(0.5, 0.4 + detectedFactors.length * 0.15));

  return {
    query,
    coords: {
      socialX: clampedX,
      thermoY: clampedY,
      formalIndex,
      temperatureC,
    },
    summary,
    detectedFactors,
    confidence,
  };
}

/**
 * Быстрые готовые запросы для демонстрации и подсказок
 */
export const CONCIERGE_SUGGESTIONS = [
  'На природу с друзьями, пикник, +22°C',
  'Свадьба лучшего друга за городом',
  'Стратегические переговоры с инвестором в лобби отеля',
  'Романтическое свидание вечером в ресторане на Патриарших',
  'Собеседование в технологическую компанию, +22°C',
  'Летний бранч на открытой веранде с друзьями, +26°C',
  'Закрытый зимний вечерний клуб, мороз -10°C',
];
