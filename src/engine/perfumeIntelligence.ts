import { PerfumeItem, PerfumeNotePyramid } from '../types';
import { findPeriodicNote, PERIODIC_NOTE_ELEMENTS } from '../data/periodicNotes';

export interface KnownFragranceRecord {
  brand: string;
  name: string;
  aliases?: string[];
  pyramid: PerfumeNotePyramid;
  diffusion?: 'Интимная' | 'Умеренная' | 'Шлейфовая' | 'Ударная';
  dominantVibe?: string;
  bestOccasion?: string;
  colorTheme?: string;
}

/**
 * БАЗА ЗНАНИЙ ПОПУЛЯРНЫХ АРОМАТОВ (Ниша, Люкс, Арабский Восток)
 * Позволяет мгновенно распознать пирамиду нот по бренду и названию
 */
export const KNOWN_FRAGRANCES_CATALOG: KnownFragranceRecord[] = [
  // --- LATTAFA & ARABIC NICHE ---
  {
    brand: 'Lattafa',
    name: 'Musamam',
    aliases: ['мусамам', 'lattafa musamam', 'musamam black', 'черный мусамам'],
    pyramid: {
      top: ['Шафран', 'Итальянский мандарин', 'Лаванда'],
      heart: ['Amberwood', 'Кедр из Вирджинии', 'Египетская герань'],
      base: ['Акигалавуд', 'Сомалийский ладан', 'Лабданум'],
    },
    diffusion: 'Шлейфовая',
    dominantVibe: 'Пряный шафран, смолистый акигалавуд, благородный ладан и лаванда',
    bestOccasion: 'Вечер, деловой статус, прохладный сезон, уверенный доминант',
    colorTheme: 'from-amber-600 via-stone-800 to-black',
  },
  {
    brand: 'Lattafa',
    name: 'Musamam White Intense',
    aliases: ['musamam white', 'мусамам уайт', 'мусамам вайт', 'белый мусамам'],
    pyramid: {
      top: ['Бергамот', 'Апельсин', 'Специи'],
      heart: ['Кокос', 'Иланг-иланг', 'Амброксан'],
      base: ['Сандал', 'Бензоин', 'Мускус'],
    },
    diffusion: 'Шлейфовая',
    dominantVibe: 'Сливочный кокос, солнечный сандал, искрящийся амброксан, курортный шик',
    bestOccasion: 'Летний вечер, открытая терраса, курортный отдых, свидание, Smart Casual',
    colorTheme: 'from-amber-300 via-yellow-500 to-amber-700',
  },
  {
    brand: 'Lattafa',
    name: 'Khamrah',
    aliases: ['камрах', 'хамра', 'хамрах'],
    pyramid: {
      top: ['Корица', 'Мускатный орех', 'Бергамот'],
      heart: ['Финики', 'Пралине', 'Тубероза'],
      base: ['Ваниль', 'Бобы тонка', 'Бензоин', 'Мирра'],
    },
    diffusion: 'Ударная',
    dominantVibe: 'Финики, пралине, корица, ваниль, абсолютный десертный соблазн',
    bestOccasion: 'Зимний вечер, ресторан, свидание у камина, декабрьские праздники',
    colorTheme: 'from-amber-600 to-yellow-900',
  },
  {
    brand: 'Lattafa',
    name: 'Asad',
    aliases: ['асад'],
    pyramid: {
      top: ['Черный перец', 'Ананас', 'Табак'],
      heart: ['Кофе', 'Пачули', 'Ирис'],
      base: ['Амбра', 'Ваниль', 'Древесные ноты', 'Бензоин'],
    },
    diffusion: 'Шлейфовая',
    dominantVibe: 'Пряный черный перец, кофе, густая ваниль, напористый восточный авторитет',
    bestOccasion: 'Прохладная осень, вечерние мероприятия, стильный кэжуал',
    colorTheme: 'from-amber-700 to-slate-900',
  },
  {
    brand: 'Lattafa',
    name: 'Emeer',
    aliases: ['эмир', 'эмеер'],
    pyramid: {
      top: ['Бергамот', 'Лимон', 'Мускатный шалфей'],
      heart: ['Кардамон', 'Белый чай', 'Сандал'],
      base: ['Кедр', 'Пачули', 'Ладан', 'Амбра'],
    },
    diffusion: 'Шлейфовая',
    dominantVibe: 'Холодные цитрусы, кардамон, белый чай, благородный ладан',
    bestOccasion: 'Деловой день, городские встречи, статус без тяжести',
    colorTheme: 'from-yellow-600 to-slate-800',
  },
  {
    brand: 'Lattafa',
    name: "Bade'e Al Oud Honor & Glory",
    aliases: ['honor and glory', 'хонор энд глори', 'белый бади аль уд'],
    pyramid: {
      top: ['Ананас', 'Корица'],
      heart: ['Бензоин', 'Черный перец', 'Куркума'],
      base: ['Ваниль', 'Кашмеран', 'Сандал', 'Мох'],
    },
    diffusion: 'Ударная',
    dominantVibe: 'Ананасовый крем-брюле, ванильная нега, теплое праздничное солнце',
    bestOccasion: 'Праздничный вечер, свидание, клуб, уютная вечеринка',
    colorTheme: 'from-yellow-400 to-amber-600',
  },
  {
    brand: 'Lattafa',
    name: 'Nebras',
    aliases: ['небрас'],
    pyramid: {
      top: ['Красные ягоды', 'Мандарин'],
      heart: ['Ваниль', 'Какао', 'Роза'],
      base: ['Сахар', 'Бобы тонка', 'Амбра', 'Мускус'],
    },
    diffusion: 'Шлейфовая',
    dominantVibe: 'Горячее шоколадное какао, мадагаскарская ваниль, сладкие ягоды',
    bestOccasion: 'Осень-зима, романтическое свидание, вечер за чашкой кофе',
    colorTheme: 'from-amber-700 to-rose-900',
  },

  // --- TOM FORD ---
  {
    brand: 'Tom Ford',
    name: 'Soleil Blanc',
    aliases: ['солей бланк', 'солейл бланк'],
    pyramid: {
      top: ['Бергамот', 'Кардамон', 'Розовый перец', 'Фисташки'],
      heart: ['Иланг-иланг', 'Тубероза', 'Жасмин'],
      base: ['Кокос', 'Амбра', 'Бобы тонка', 'Бензоин'],
    },
    diffusion: 'Шлейфовая',
    dominantVibe: 'Солнечный пляжный кокос, фисташковое пралине, роскошь Лазурного берега',
    bestOccasion: 'Летний отпуск, бассейн, белая льняная рубашка, дневные прогулки',
    colorTheme: 'from-amber-200 via-yellow-400 to-amber-500',
  },
  {
    brand: 'Tom Ford',
    name: 'Tobacco Vanille',
    aliases: ['тобакко ваниль', 'табако ваниль'],
    pyramid: {
      top: ['Лист табака', 'Специи'],
      heart: ['Ваниль', 'Какао', 'Бобы тонка'],
      base: ['Сухофрукты', 'Древесные аккорды'],
    },
    diffusion: 'Ударная',
    dominantVibe: 'Дорогой трубочный табак, пряная стручковая ваниль, закрытый английский клуб',
    bestOccasion: 'Зимний вечер, кашемировое пальто, закрытый клуб, статусное свидание',
    colorTheme: 'from-amber-800 to-yellow-950',
  },
  {
    brand: 'Tom Ford',
    name: 'Oud Wood',
    aliases: ['уд вуд'],
    pyramid: {
      top: ['Кардамон', 'Розовое дерево', 'Сычуаньский перец'],
      heart: ['Уд', 'Сандал', 'Ветивер'],
      base: ['Бобы тонка', 'Ваниль', 'Амбра'],
    },
    diffusion: 'Умеренная',
    dominantVibe: 'Копченый аристократический уд, сандал, статусная тихая роскошь',
    bestOccasion: 'Деловые переговоры, вечерний костюм, театр, совет директоров',
    colorTheme: 'from-stone-700 to-slate-900',
  },
  {
    brand: 'Tom Ford',
    name: 'Lost Cherry',
    aliases: ['лост черри', 'черри'],
    pyramid: {
      top: ['Горький миндаль', 'Ликер', 'Черная вишня'],
      heart: ['Вишня', 'Слива', 'Турецкая роза', 'Жасмин'],
      base: ['Бобы тонка', 'Ваниль', 'Перуанский бальзам', 'Корица', 'Сандал'],
    },
    diffusion: 'Шлейфовая',
    dominantVibe: 'Пьяная ликерная вишня, амаретто, бархатный томный эротизм',
    bestOccasion: 'Вечерний выход, свидание тет-а-тет, бар, темный шелк',
    colorTheme: 'from-rose-600 via-red-800 to-slate-950',
  },

  // --- BDK PARFUMS ---
  {
    brand: 'BDK Parfums',
    name: 'Gris Charnel',
    aliases: ['гри шарнель'],
    pyramid: {
      top: ['Кардамон', 'Черный инжир', 'Черный чай'],
      heart: ['Ирис', 'Бурбонский ветивер'],
      base: ['Сандал', 'Бобы тонка'],
    },
    diffusion: 'Шлейфовая',
    dominantVibe: 'Сливочный инжир, пряный чайный кардамон, шелковый сандал и парижская меланхолия',
    bestOccasion: 'Осенний день, уютный оверсайз свитер, прогулка по Парижу, галерея',
    colorTheme: 'from-slate-500 via-stone-400 to-amber-700',
  },

  // --- CREED ---
  {
    brand: 'Creed',
    name: 'Aventus',
    aliases: ['авентус'],
    pyramid: {
      top: ['Ананас', 'Бергамот', 'Черная смородина', 'Яблоко'],
      heart: ['Береза', 'Пачули', 'Марокканский жасмин', 'Роза'],
      base: ['Мускус', 'Дубовый мох', 'Серая амбра', 'Ваниль'],
    },
    diffusion: 'Ударная',
    dominantVibe: 'Копченый березовый деготь, спелый ананас, триумфальное лидерство',
    bestOccasion: 'Бизнес-триумф, совет директоров, светский раут, дорогой костюм',
    colorTheme: 'from-slate-800 via-cyan-900 to-amber-500',
  },
  {
    brand: 'Creed',
    name: 'Green Irish Tweed',
    aliases: ['грин айриш твид', 'гит'],
    pyramid: {
      top: ['Лимонная вербена', 'Ирис'],
      heart: ['Листья фиалки'],
      base: ['Серая амбра', 'Сандал'],
    },
    diffusion: 'Шлейфовая',
    dominantVibe: 'Изумрудная роса, свежескошенные ирландские луга, аристократический твид',
    bestOccasion: 'Весна, прогулка за городом, твидовый пиджак, элитный спортивный клуб',
    colorTheme: 'from-emerald-600 to-green-900',
  },
  {
    brand: 'Creed',
    name: 'Silver Mountain Water',
    aliases: ['сильвер маунтин вотер', 'смв'],
    pyramid: {
      top: ['Бергамот', 'Мандарин'],
      heart: ['Зеленый чай', 'Черная смородина'],
      base: ['Мускус', 'Петитгрейн', 'Сандал'],
    },
    diffusion: 'Умеренная',
    dominantVibe: 'Ледяной горный ручей, альпийский снег, освежающий зеленый чай',
    bestOccasion: 'Жаркий летний день, белая рубашка, открытый воздух, спорт-шик',
    colorTheme: 'from-cyan-400 to-slate-200',
  },

  // --- XERJOFF ---
  {
    brand: 'Xerjoff',
    name: 'Naxos',
    aliases: ['наксос'],
    pyramid: {
      top: ['Лаванда', 'Бергамот', 'Лимон'],
      heart: ['Мед', 'Корица', 'Кашмеран', 'Жасмин'],
      base: ['Лист табака', 'Бобы тонка', 'Ваниль'],
    },
    diffusion: 'Ударная',
    dominantVibe: 'Сицилийский золотой мед, благородный лист табака, лавандовый ветер',
    bestOccasion: 'Вечерний выход, прохладный вечер, итальянский шик, шелковая рубашка',
    colorTheme: 'from-amber-400 via-amber-600 to-yellow-800',
  },

  // --- MAISON FRANCIS KURKDJIAN ---
  {
    brand: 'Maison Francis Kurkdjian',
    name: 'Baccarat Rouge 540',
    aliases: ['бакара', 'бакарат', 'бакара руж', 'брк 540', 'baccarat'],
    pyramid: {
      top: ['Шафран', 'Жасмин'],
      heart: ['Amberwood', 'Серая амбра'],
      base: ['Еловая смола', 'Кедр'],
    },
    diffusion: 'Ударная',
    dominantVibe: 'Карамелизованный сахар, минеральный кристаллический шафран, смолистый кедр',
    bestOccasion: 'Премьеры, красная дорожка, ночной мегаполис, светский выход',
    colorTheme: 'from-red-600 via-amber-500 to-yellow-600',
  },

  // --- MARC-ANTOINE BARROIS ---
  {
    brand: 'Marc-Antoine Barrois',
    name: 'Ganymede',
    aliases: ['ганимед'],
    pyramid: {
      top: ['Мандарин', 'Шафран'],
      heart: ['Фиалка', 'Османтус'],
      base: ['Бессмертник', 'Минеральные ноты', 'Замша', 'Акигалавуд'],
    },
    diffusion: 'Ударная',
    dominantVibe: 'Космическая минеральность, стерильная новая замша, глянец будущего',
    bestOccasion: 'Архитектурные встречи, современное искусство, монохромный образ',
    colorTheme: 'from-teal-400 via-slate-600 to-amber-300',
  },

  // --- LE LABO ---
  {
    brand: 'Le Labo',
    name: 'Santal 33',
    aliases: ['сантал 33'],
    pyramid: {
      top: ['Кардамон', 'Фиалка', 'Папирус'],
      heart: ['Ирис', 'Кожа', 'Амбра'],
      base: ['Сандал', 'Кедр'],
    },
    diffusion: 'Шлейфовая',
    dominantVibe: 'Сухой копченый сандал, ковбойская кожа, древесный костер в прерии',
    bestOccasion: 'Стильный городской смарт-кэжуал, кожаная куртка, деним, кофейни',
    colorTheme: 'from-amber-600 via-stone-600 to-stone-900',
  },

  // --- BYREDO ---
  {
    brand: 'Byredo',
    name: "Bal d'Afrique",
    aliases: ['бал дафрик', 'африканский бал'],
    pyramid: {
      top: ['Бергамот', 'Лимон', 'Бархатцы', 'Апельсиновый цвет'],
      heart: ['Фиалка', 'Цикламен', 'Жасмин'],
      base: ['Черный янтарь', 'Мускус', 'Ветивер', 'Кедр'],
    },
    diffusion: 'Умеренная',
    dominantVibe: 'Бархатистые фрукты, солнечный ветивер, теплая парижско-африканская эйфория',
    bestOccasion: 'Весна-лето, повседневный стильный шик, встречи с друзьями',
    colorTheme: 'from-amber-400 to-sky-600',
  },

  // --- KILIAN ---
  {
    brand: 'Kilian',
    name: "Angels' Share",
    aliases: ['энджелс шер', 'доля ангелов', 'ангел шер'],
    pyramid: {
      top: ['Коньяк'],
      heart: ['Корица', 'Бобы тонка', 'Дуб'],
      base: ['Пралине', 'Ваниль', 'Сандал'],
    },
    diffusion: 'Ударная',
    dominantVibe: 'Выдержанный дубовый коньяк, теплая корица, гурманское пралине',
    bestOccasion: 'Холодные вечера, бар, свидание у камина, кашемир',
    colorTheme: 'from-amber-600 via-amber-800 to-amber-950',
  },

  // --- CHANEL ---
  {
    brand: 'Chanel',
    name: 'Bleu de Chanel',
    aliases: ['блю де шанель', 'бдш'],
    pyramid: {
      top: ['Грейпфрут', 'Лимон', 'Мята', 'Розовый перец'],
      heart: ['Имбирь', 'Мускатный орех', 'Жасмин'],
      base: ['Ладан', 'Ветивер', 'Кедр', 'Сандал', 'Пачули'],
    },
    diffusion: 'Шлейфовая',
    dominantVibe: 'Искрящийся грейпфрут, благородный ладан, синий костюмный стандарт',
    bestOccasion: 'Универсальный эталон: от утреннего офиса до вечернего ресторана',
    colorTheme: 'from-blue-700 to-slate-900',
  },

  // --- DIOR ---
  {
    brand: 'Dior',
    name: 'Sauvage',
    aliases: ['саваж', 'диор саваж'],
    pyramid: {
      top: ['Бергамот', 'Перец'],
      heart: ['Сычуаньский перец', 'Лаванда', 'Розовый перец', 'Ветивер'],
      base: ['Амброксан', 'Кедр', 'Лабданум'],
    },
    diffusion: 'Ударная',
    dominantVibe: 'Острый перечный взрыв, калабрийский бергамот, радиаторный амброксан',
    bestOccasion: 'Энергичный день, городская динамика, клуб, открытый воздух',
    colorTheme: 'from-sky-700 via-blue-900 to-slate-950',
  },

  // --- HERMES ---
  {
    brand: 'Hermes',
    name: "Terre d'Hermes",
    aliases: ['терра', 'терр дэрмес', 'терре'],
    pyramid: {
      top: ['Апельсин', 'Грейпфрут'],
      heart: ['Кремень', 'Черный перец', 'Пеларгония'],
      base: ['Ветивер', 'Кедр', 'Пачули', 'Бензоин'],
    },
    diffusion: 'Шлейфовая',
    dominantVibe: 'Горький апельсин, минеральный кремень, сухой кедр, зрелый авторитет',
    bestOccasion: 'Совет директоров, ключевые переговоры, классический деловой костюм',
    colorTheme: 'from-amber-600 to-orange-700',
  },
];

/**
 * Поиск пирамиды нот по бренду и названию аромата
 */
export function findKnownFragrance(brand: string, name: string): KnownFragranceRecord | undefined {
  if (!name) return undefined;
  const cleanBrand = (brand || '').trim().toLowerCase();
  const cleanName = name.trim().toLowerCase();

  // 1. Точное совпадение имени (при совпадении бренда)
  const exactNameMatch = KNOWN_FRAGRANCES_CATALOG.find((item) => {
    const itemBrand = item.brand.toLowerCase();
    const itemName = item.name.toLowerCase();
    const brandMatches = !cleanBrand || itemBrand.includes(cleanBrand) || cleanBrand.includes(itemBrand);
    return brandMatches && itemName === cleanName;
  });
  if (exactNameMatch) return exactNameMatch;

  // 2. Точное совпадение алиаса
  const aliasExact = KNOWN_FRAGRANCES_CATALOG.find((item) =>
    item.aliases?.some((a) => a.toLowerCase() === cleanName)
  );
  if (aliasExact) return aliasExact;

  // 3. Нестрогое вхождение подстроки
  return KNOWN_FRAGRANCES_CATALOG.find((item) => {
    const itemBrand = item.brand.toLowerCase();
    const itemName = item.name.toLowerCase();

    const brandMatches = !cleanBrand || itemBrand.includes(cleanBrand) || cleanBrand.includes(itemBrand);
    const nameMatches = itemName.includes(cleanName) || cleanName.includes(itemName);
    const aliasMatches = item.aliases?.some((a) => cleanName.includes(a) || a.includes(cleanName));

    return (brandMatches && nameMatches) || aliasMatches;
  });
}

/**
 * Эвристический анализатор аккордов по названию для редких ароматов
 */
export function predictNotesFromFragranceName(brand: string, name: string): PerfumeNotePyramid {
  const text = `${brand} ${name}`.toLowerCase();

  const top: string[] = [];
  const heart: string[] = [];
  const base: string[] = [];

  // Анализ верхов
  if (text.includes('citrus') || text.includes('cologne') || text.includes('fraiche') || text.includes('lemon') || text.includes('lime') || text.includes('orange') || text.includes('summer')) {
    top.push('Бергамот', 'Апельсин');
  } else if (text.includes('aqua') || text.includes('marine') || text.includes('bleu') || text.includes('ocean')) {
    top.push('Морские ноты', 'Грейпфрут');
  } else {
    top.push('Бергамот', 'Розовый перец');
  }

  // Анализ сердца
  if (text.includes('white') || text.includes('soleil') || text.includes('coconut') || text.includes('кокос')) {
    heart.push('Кокос', 'Иланг-иланг', 'Амброксан');
  } else if (text.includes('iris') || text.includes('homme') || text.includes('clean')) {
    heart.push('Ирис', 'Фиалка');
  } else if (text.includes('rose') || text.includes('floral')) {
    heart.push('Роза', 'Жасмин');
  } else if (text.includes('spice') || text.includes('cardamom') || text.includes('intense')) {
    heart.push('Кардамон', 'Корица', 'Лаванда');
  } else {
    heart.push('Ирис', 'Лаванда', 'Кардамон');
  }

  // Анализ базы
  if (text.includes('oud') || text.includes('уд')) {
    base.push('Уд', 'Ладан', 'Кожа');
  } else if (text.includes('leather') || text.includes('cuir') || text.includes('noir') || text.includes('black')) {
    base.push('Кожа', 'Березовый деготь', 'Пачули');
  } else if (text.includes('vanilla') || text.includes('vanille') || text.includes('sweet') || text.includes('sugar') || text.includes('gourmand')) {
    base.push('Ваниль', 'Бобы тонка', 'Бензоин');
  } else if (text.includes('santal') || text.includes('sandalwood') || text.includes('white') || text.includes('wood')) {
    base.push('Сандал', 'Кедр', 'Белый мускус');
  } else if (text.includes('vetiver')) {
    base.push('Ветивер', 'Кедр', 'Дубовый мох');
  } else {
    base.push('Сандал', 'Мускус', 'Амбра');
  }

  return {
    top: Array.from(new Set(top)),
    heart: Array.from(new Set(heart)),
    base: Array.from(new Set(base)),
  };
}

export interface CalculatedPerfumeMetadata {
  xCoord: number;
  yCoord: number;
  quadrant: 'NW' | 'NE' | 'SW' | 'SE';
  quadrantName: string;
  diffusion: 'Интимная' | 'Умеренная' | 'Шлейфовая' | 'Ударная';
  dominantVibe: string;
  bestOccasion: string;
  whyFitsOutfit: string;
  colorTheme: string;
  resonantFabrics: string[];
}

/**
 * ФОРМУЛА РАСЧЕТА КООРДИНАТ ИЗ ПИРАМИДЫ НОТ
 * Взвешивает ноты по слоям:
 *  - Top: 0.8x (быстрая летучая вспышка)
 *  - Heart: 1.2x (ядро звучания)
 *  - Base: 1.6x (фундамент и долгий шлейф)
 */
export function calculatePerfumeCoordinatesFromNotes(
  pyramid: PerfumeNotePyramid,
  customVibe?: string
): CalculatedPerfumeMetadata {
  let totalWeightX = 0;
  let totalWeightY = 0;
  let sumWeightedX = 0;
  let sumWeightedY = 0;
  const resonantFabricsSet = new Set<string>();

  const processTier = (notes: string[], tierFactor: number) => {
    for (const rawNote of notes) {
      const noteEl = findPeriodicNote(rawNote);
      if (noteEl) {
        const weight = (noteEl.massWeight || 0.5) * tierFactor;
        sumWeightedX += noteEl.distanceX * weight;
        sumWeightedY += noteEl.thermoY * weight;
        totalWeightX += weight;
        totalWeightY += weight;
        if (noteEl.resonantFabrics) {
          noteEl.resonantFabrics.forEach((f) => resonantFabricsSet.add(f));
        }
      } else {
        // Fallback для неизвестных нот через ключевые слова
        const clean = rawNote.toLowerCase();
        let fallbackX = 0;
        let fallbackY = 0;
        if (clean.includes('кокос')) { fallbackX = 0.65; fallbackY = 0.20; resonantFabricsSet.add('Лен'); resonantFabricsSet.add('Шелк'); }
        else if (clean.includes('иланг')) { fallbackX = 0.55; fallbackY = 0.10; resonantFabricsSet.add('Шелк'); }
        else if (clean.includes('цитрус') || clean.includes('апельсин') || clean.includes('лимон')) { fallbackX = 0.10; fallbackY = 0.85; resonantFabricsSet.add('Хлопок'); }
        else if (clean.includes('уд')) { fallbackX = -0.75; fallbackY = -0.85; resonantFabricsSet.add('Тяжелая костюмная шерсть'); }
        else if (clean.includes('кожа')) { fallbackX = -0.80; fallbackY = -0.70; resonantFabricsSet.add('Кожа'); }
        else if (clean.includes('ваниль')) { fallbackX = 0.85; fallbackY = -0.70; resonantFabricsSet.add('Кашемир'); }

        const fallbackWeight = 0.5 * tierFactor;
        sumWeightedX += fallbackX * fallbackWeight;
        sumWeightedY += fallbackY * fallbackWeight;
        totalWeightX += fallbackWeight;
        totalWeightY += fallbackWeight;
      }
    }
  };

  processTier(pyramid.top, 0.8);
  processTier(pyramid.heart, 1.2);
  processTier(pyramid.base, 1.6);

  // Итоговые координаты с ограничением от -1.00 до +1.00
  let rawX = totalWeightX > 0 ? sumWeightedX / totalWeightX : 0;
  let rawY = totalWeightY > 0 ? sumWeightedY / totalWeightY : 0;

  // Округляем до двух знаков
  const xCoord = Number(Math.max(-1.0, Math.min(1.0, rawX)).toFixed(2));
  const yCoord = Number(Math.max(-1.0, Math.min(1.0, rawY)).toFixed(2));

  // Определение квадранта
  let quadrant: 'NW' | 'NE' | 'SW' | 'SE';
  let quadrantName = '';
  let colorTheme = '';

  if (xCoord <= 0 && yCoord >= 0) {
    quadrant = 'NW';
    quadrantName = 'Квадрант I (Северо-Запад): Фокус, Интеллект, Дисциплина';
    colorTheme = 'from-cyan-500 to-blue-700';
  } else if (xCoord > 0 && yCoord >= 0) {
    quadrant = 'NE';
    quadrantName = 'Квадрант II (Северо-Восток): Свежий соблазн, Легкость, Солнце';
    colorTheme = 'from-amber-400 via-yellow-500 to-sky-600';
  } else if (xCoord <= 0 && yCoord < 0) {
    quadrant = 'SW';
    quadrantName = 'Квадрант III (Юго-Запад): Темная власть, Статус, Вечер';
    colorTheme = 'from-stone-700 to-slate-950';
  } else {
    quadrant = 'SE';
    quadrantName = 'Квадрант IV (Юго-Восток): Теплый соблазн, Интим, Уют';
    colorTheme = 'from-amber-600 via-rose-700 to-yellow-950';
  }

  // Расчет диффузии
  const allNotesStr = [...pyramid.top, ...pyramid.heart, ...pyramid.base].join(' ').toLowerCase();
  let diffusion: 'Интимная' | 'Умеренная' | 'Шлейфовая' | 'Ударная' = 'Шлейфовая';
  if (allNotesStr.includes('уд') || allNotesStr.includes('амброксан') || allNotesStr.includes('деготь') || allNotesStr.includes('шафран')) {
    diffusion = 'Ударная';
  } else if (yCoord > 0.6 && !allNotesStr.includes('амброксан')) {
    diffusion = 'Умеренная';
  }

  // Формирование вайба и повода
  const dominantNotes = [...pyramid.heart, ...pyramid.base].slice(0, 3).join(', ');
  const dominantVibe = customVibe || `${dominantNotes}, гармоничный баланс нот`;

  let bestOccasion = 'Smart Casual, городские встречи, вечерний выход';
  let whyFitsOutfit = 'Гармонично дополняет фактуру одежды.';

  if (quadrant === 'NW') {
    bestOccasion = 'Деловые встречи, переговоры, строгий протокол, офис';
    whyFitsOutfit = 'Прохладная строгость нот поддерживает четкую геометрию пиджака и сорочки.';
  } else if (quadrant === 'NE') {
    bestOccasion = 'Летний день, курортный отдых, открытая терраса, Smart Casual';
    whyFitsOutfit = 'Легкие солнечные ноты сливаются со свободным дыханием натурального льна и хлопка.';
  } else if (quadrant === 'SW') {
    bestOccasion = 'Совет директоров, статусное мероприятие, темный костюм, закрытый клуб';
    whyFitsOutfit = 'Монументальная глубина базы придает плотной костюмной шерсти непререкаемый авторитет.';
  } else {
    bestOccasion = 'Романтический вечер, ресторан, свидание у камина, клуб';
    whyFitsOutfit = 'Теплые тактильные аккорды входят в резонанс с мягким трикотажем и кашемиром.';
  }

  const resonantFabrics = Array.from(resonantFabricsSet);
  if (resonantFabrics.length === 0) {
    resonantFabrics.push('Хлопок', 'Шерсть', 'Лен');
  }

  return {
    xCoord,
    yCoord,
    quadrant,
    quadrantName,
    diffusion,
    dominantVibe,
    bestOccasion,
    whyFitsOutfit,
    colorTheme,
    resonantFabrics,
  };
}

/**
 * Создать полноценный объект PerfumeItem по введенным бренду и названию
 */
export function buildPerfumeFromInput(
  brand: string,
  name: string,
  customPyramid?: PerfumeNotePyramid
): PerfumeItem {
  const known = findKnownFragrance(brand, name);
  const pyramid = customPyramid || (known ? known.pyramid : predictNotesFromFragranceName(brand, name));
  const meta = calculatePerfumeCoordinatesFromNotes(pyramid, known?.dominantVibe);

  const cleanSlug = `${brand}-${name}`
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]+/gi, '-')
    .replace(/^-|-$/g, '');

  const id = `custom-${cleanSlug || 'perfume'}-${Date.now()}`;

  return {
    id,
    name: name.trim(),
    brand: brand.trim(),
    xCoord: meta.xCoord,
    yCoord: meta.yCoord,
    diffusion: known?.diffusion || meta.diffusion,
    dominantVibe: known?.dominantVibe || meta.dominantVibe,
    bestOccasion: known?.bestOccasion || meta.bestOccasion,
    whyFitsOutfit: meta.whyFitsOutfit,
    colorTheme: known?.colorTheme || meta.colorTheme,
    pyramid,
  };
}
