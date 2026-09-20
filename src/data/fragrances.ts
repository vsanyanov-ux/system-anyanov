import { PerfumeItem } from '../types';
import { STORAGE_KEYS } from '../constants/storage';
import { safeGetJson, safeSetJson } from '../utils/storage';

export interface ShelfPreset {
  id: string;
  name: string;
  description: string;
  perfumeIds: string[];
}

export const BOTTLE_IMAGES: Record<string, string> = {
  'bleu-de-chanel-edp': '/bottles/bleu-de-chanel-edp.jpg',
  'bleu-de-chanel': '/bottles/bleu-de-chanel-edp.jpg',
  '4711-eau-de-cologne': '/bottles/4711-eau-de-cologne.jpg',
  'tom-ford-tuscan-leather': '/bottles/tom-ford-tuscan-leather.jpg',
  'chanel-platinum-egoiste': '/bottles/chanel-platinum-egoiste.jpg',
  'jpg-ultra-male': '/bottles/jpg-ultra-male.jpg',
  'versace-man-eau-fraiche': '/bottles/versace-man-eau-fraiche.jpg',
  'acqua-di-gio': '/bottles/acqua-di-gio.jpg',
  'dior-sauvage': '/bottles/dior-sauvage.jpg',
  'dior-homme-cologne': '/bottles/dior-homme-cologne.jpg',
  'dior-eau-sauvage': '/bottles/dior-eau-sauvage.jpg',
  'prada-lhomme': '/bottles/prada-lhomme.jpg',
  'paco-rabanne-pour-homme': '/bottles/paco-rabanne-pour-homme.jpg',
  'ysl-lhomme': '/bottles/ysl-lhomme.jpg',
  'terre-dhermes': '/bottles/terre-dhermes.jpg',
  'guy-laroche-drakkar-noir': '/bottles/guy-laroche-drakkar-noir.jpg',
  'dior-homme-intense': '/bottles/dior-homme-intense.jpg',
  'versace-oud-noir': '/bottles/versace-oud-noir.jpg',
  'creed-aventus': '/bottles/creed-aventus.jpg',
  'versace-eros': '/bottles/versace-eros.jpg',
  'jpg-le-male': '/bottles/jpg-le-male.jpg',
  'lattafa-khamrah': '/bottles/lattafa-khamrah.jpg',
  'versace-pour-homme': '/bottles/versace-oud-noir.jpg',
  'versace-dylan-blue': '/bottles/versace-oud-noir.jpg',
  'versace-dylan-blue-edt': '/bottles/versace-oud-noir.jpg',
  'versace-dylan-blue-edp': '/bottles/versace-oud-noir.jpg',
  'versace-the-dreamer': '/bottles/versace-oud-noir.jpg',
  'versace-eros-edp': '/bottles/versace-eros.jpg',
};

export const getPerfumeBottleImage = (perfumeOrId?: PerfumeItem | string | null): string | null => {
  if (!perfumeOrId) return null;
  if (typeof perfumeOrId === 'string') {
    return BOTTLE_IMAGES[perfumeOrId] || null;
  }
  return perfumeOrId.imageUrl || BOTTLE_IMAGES[perfumeOrId.id] || null;
};

export const PERFUME_DATABASE: PerfumeItem[] = [
  // =========================================================================
  // ЭТАЛОННЫЙ КВИНТЕТ АНЬЯНОВА: VERSACE BENCHMARK ARCHITECTURE
  // =========================================================================
  {
    id: 'versace-pour-homme',
    name: 'Pour Homme (2008)',
    brand: 'Versace',
    xCoord: -0.55,
    yCoord: 0.60,
    diffusion: 'Умеренная',
    dominantVibe: 'Нероли, калабрийский бергамот, кедр, мускатный шалфей, дисциплина',
    bestOccasion: 'Работа, переговоры, университет, дневной протокол',
    whyFitsOutfit: 'Идеальный рабочий спутник: структурированный пиджак, белая сорочка, ясный фокус без лишних эмоций.',
    colorTheme: 'from-sky-500 to-blue-700',
    pyramid: {
      top: ['Лимон', 'Нероли', 'Бергамот', 'Майская роза'],
      heart: ['Гиацинт', 'Мускатный шалфей', 'Кедр', 'Герань'],
      base: ['Бобы тонка', 'Мускус', 'Амбра']
    }
  },
  {
    id: 'versace-dylan-blue-edt',
    name: 'Dylan Blue EDT (2016)',
    brand: 'Versace',
    xCoord: 0.00,
    yCoord: 0.05,
    diffusion: 'Шлейфовая',
    dominantVibe: 'Бергамот, грейпфрут, лист инжира, амброксан, ладан, пачули',
    bestOccasion: 'Универсал (Лето): университет, офис, город, встречи с друзьями',
    whyFitsOutfit: 'Абсолютный хамелеон: звучит одинаково органично и с Business Casual, и со Smart Casual.',
    colorTheme: 'from-blue-600 to-indigo-900',
    pyramid: {
      top: ['Калабрийский бергамот', 'Грейпфрут', 'Водные ноты', 'Лист инжира'],
      heart: ['Амброксан', 'Пачули', 'Черный перец', 'Лист фиалки', 'Папирус'],
      base: ['Ладан', 'Мускус', 'Бобы тонка', 'Шафран']
    }
  },
  {
    id: 'versace-dylan-blue-edp',
    name: 'Dylan Blue EDP / Parfum',
    brand: 'Versace',
    xCoord: 0.00,
    yCoord: -0.15,
    diffusion: 'Шлейфовая',
    dominantVibe: 'Глубокий ладан, амброксан, темный бергамот, смолистое тепло',
    bestOccasion: 'Универсал (Зима): университет, офис в холодный сезон, вечерний баланс',
    whyFitsOutfit: 'Более густая, теплая и смолистая версия Dylan Blue для прохладной погоды и уютного трикотажа.',
    colorTheme: 'from-blue-800 to-slate-950',
    pyramid: {
      top: ['Темный бергамот', 'Грейпфрут', 'Инжир'],
      heart: ['Черный перец', 'Амброксан', 'Смолы', 'Пачули'],
      base: ['Дымный ладан', 'Минеральная амбра', 'Бобы тонка']
    }
  },
  {
    id: 'versace-man-eau-fraiche',
    name: 'Man Eau Fraîche (2006)',
    brand: 'Versace',
    xCoord: 0.50,
    yCoord: 0.75,
    diffusion: 'Шлейфовая',
    dominantVibe: 'Карамбола, белый лимон, тархун, белый кедр, пляжный бриз',
    bestOccasion: 'Отпуск, пляж, летняя терраса, прогулка с друзьями',
    whyFitsOutfit: 'Идеален со льном, шортами, поло и белыми кедами. Дает ощущение абсолютной чистоты и свободы.',
    colorTheme: 'from-cyan-400 to-sky-600',
    pyramid: {
      top: ['Белый лимон', 'Карамбола', 'Розовое дерево', 'Кардамон'],
      heart: ['Тархун', 'Шалфей', 'Кедр'],
      base: ['Мускус', 'Амбра', 'Древесные ноты', 'Шафран']
    }
  },
  {
    id: 'versace-the-dreamer',
    name: 'The Dreamer (1996)',
    brand: 'Versace',
    xCoord: 0.55,
    yCoord: 0.45,
    diffusion: 'Умеренная',
    dominantVibe: 'Цветок табака, можжевельник, ирис, льняная пудра, амбра',
    bestOccasion: 'Зимний выходной, утренний кофе, неспешные встречи, релакс',
    whyFitsOutfit: 'Мягкий шерстяной джемпер, фланелевые брюки или вельвет: создает обволакивающий уют в прохладную погоду.',
    colorTheme: 'from-amber-400 to-emerald-800',
    pyramid: {
      top: ['Можжевельник', 'Полынь', 'Тархун'],
      heart: ['Цветок табака', 'Ирис', 'Лен', 'Амбра'],
      base: ['Амбра', 'Эстрагон', 'Бобы тонка']
    }
  },
  {
    id: 'versace-eros-edp',
    name: 'Eros Eau de Parfum (2020)',
    brand: 'Versace',
    xCoord: 0.70,
    yCoord: -0.65,
    diffusion: 'Ударная',
    dominantVibe: 'Засахаренное яблоко, мадагаскарская ваниль, кожа, кедр, согревающий эрос',
    bestOccasion: 'Зимнее свидание, романтический вечер на морозе, бар, клуб',
    whyFitsOutfit: 'Плотная ванильно-кожаная основа не замерзает на зимнем воздухе, формируя непреодолимое тактильное притяжение.',
    colorTheme: 'from-teal-700 to-cyan-950',
    pyramid: {
      top: ['Мята', 'Засахаренное яблоко', 'Лимон', 'Мандарин'],
      heart: ['Амброксан', 'Мускатный шалфей', 'Герань'],
      base: ['Ваниль', 'Кожа', 'Сандал', 'Пачули', 'Кедр']
    }
  },

  // =========================================================================
  // КВАДРАНТ I: СЕВЕРО-ЗАПАД (ХОЛОД / ДЕНЬ + ВЛАСТЬ / ФОКУС / СТАТУС / ДИСТАНЦИЯ)
  // X: [-1.00 ... 0.00], Y: [0.00 ... +1.00]
  // =========================================================================
  {
    id: 'prada-lhomme',
    name: "L'Homme",
    brand: 'Prada',
    xCoord: -0.35,
    yCoord: 0.75,
    diffusion: 'Умеренная',
    dominantVibe: 'Выглаженная сорочка, стерильная чистота, ледяная дистанция',
    bestOccasion: 'Офис, переговоры, деловые встречи, дипломатия',
    whyFitsOutfit: 'Ирис и нероли безупречно ложатся на хрустящий хлопок сорочки, создавая ауру абсолютной надежности и контроля.',
    colorTheme: 'from-cyan-500 to-blue-600',
    pyramid: {
      top: ['Нероли', 'Черный перец', 'Семена моркови'],
      heart: ['Ирис', 'Фиалка', 'Герань', 'Мате'],
      base: ['Серая амбра', 'Кедр', 'Пачули']
    }
  },
  {
    id: 'terre-dhermes-eau-givree',
    name: "Terre d'Hermès Eau Givrée",
    brand: 'Hermès',
    xCoord: -0.80,
    yCoord: 0.70,
    diffusion: 'Шлейфовая',
    dominantVibe: 'Ледяной цитрон, морозная минеральность, бескомпромиссная ясность',
    bestOccasion: 'Стратегические сессии, принятие жестких решений, дневной зной',
    whyFitsOutfit: 'Морозная свежесть цитрона дисциплинирует, сочетаясь со структурированными лацканами блейзера.',
    colorTheme: 'from-sky-400 to-teal-600',
    pyramid: {
      top: ['Цитрон', 'Можжевеловые ягоды'],
      heart: ['Сычуаньский перец'],
      base: ['Минеральные ноты', 'Древесные аккорды']
    }
  },
  {
    id: 'dior-eau-sauvage',
    name: 'Eau Sauvage (1966)',
    brand: 'Dior',
    xCoord: -0.70,
    yCoord: 0.75,
    diffusion: 'Шлейфовая',
    dominantVibe: 'Исторический гедион, розмарин, ледяной лимон, аристократичный шипр',
    bestOccasion: 'Летний протокол, деловой бранч, академическая среда, открытые веранды',
    whyFitsOutfit: 'Шедевр Эдмона Рудницка: прозрачный цитрусово-гедионовый холод великолепно звучит с блейзером Hopsack и белой сорочкой.',
    colorTheme: 'from-lime-500 to-emerald-700',
    pyramid: {
      top: ['Лимон', 'Бергамот', 'Базилик', 'Розмарин', 'Тмин'],
      heart: ['Жасмин', 'Кориандр', 'Пачули', 'Гвоздика', 'Корень ириса'],
      base: ['Дубовый мох', 'Ветивер', 'Мускус', 'Амбра']
    }
  },
  {
    id: 'paco-rabanne-pour-homme',
    name: 'Pour Homme (1973)',
    brand: 'Paco Rabanne',
    xCoord: -0.70,
    yCoord: 0.35,
    diffusion: 'Шлейфовая',
    dominantVibe: 'Зеленый мыльный барбершоп 70-х, шалфей, лаванда, строгий мох',
    bestOccasion: 'Офис, переговоры, классический деловой дресс-код, ретро-стиль',
    whyFitsOutfit: 'Архетип винтажного фужера: задает бескомпромиссную субординацию под оксфордскую рубашку и фактурные фланелевые брюки.',
    colorTheme: 'from-emerald-700 to-green-900',
    pyramid: {
      top: ['Розмарин', 'Мускатный шалфей', 'Розовое дерево'],
      heart: ['Лаванда', 'Герань', 'Бобы тонка'],
      base: ['Дубовый мох', 'Мед', 'Мускус', 'Амбра']
    }
  },
  {
    id: 'ysl-lhomme',
    name: "L'Homme (2006)",
    brand: 'Yves Saint Laurent',
    xCoord: -0.35,
    yCoord: 0.35,
    diffusion: 'Умеренная',
    dominantVibe: 'Свежий имбирь, белый перец, озоновый кедр, деликатная дипломатия',
    bestOccasion: 'Офис, переговоры тет-а-тет, собеседование, весенний день',
    whyFitsOutfit: 'Эталон безопасного политкорректного стиля: имбирь и кедр гармонируют с голубой рубашкой Oxford и бежевыми чинос.',
    colorTheme: 'from-amber-400 to-stone-600',
    pyramid: {
      top: ['Имбирь', 'Бергамот', 'Лимон'],
      heart: ['Специи', 'Белый перец', 'Лист фиалки', 'Базилик'],
      base: ['Бобы тонка', 'Кедр', 'Таитянский ветивер']
    }
  },
  {
    id: 'terre-dhermes',
    name: "Terre d'Hermès (EDT)",
    brand: 'Hermès',
    xCoord: -0.70,
    yCoord: -0.35,
    diffusion: 'Шлейфовая',
    dominantVibe: 'Горький апельсин, кремень, строгий ветивер, зрелый авторитет',
    bestOccasion: 'Совет директоров, ключевые переговоры, деловая среда',
    whyFitsOutfit: 'Эталон делового стиля. Древесно-кремневый сухой профиль идеально поддерживает фактуру шерстяного костюма.',
    colorTheme: 'from-amber-600 to-orange-700',
    pyramid: {
      top: ['Апельсин', 'Грейпфрут'],
      heart: ['Кремень', 'Черный перец', 'Пеларгония'],
      base: ['Ветивер', 'Кедр', 'Пачули', 'Бензоин']
    }
  },
  {
    id: 'chanel-platinum-egoiste',
    name: 'Platinum Égoïste',
    brand: 'Chanel',
    xCoord: -0.95,
    yCoord: 0.00,
    diffusion: 'Шлейфовая',
    dominantVibe: 'Холодный металл, розмарин, прохладная лаванда, протокольный замок',
    bestOccasion: 'Протокольные мероприятия, руководство, субординация',
    whyFitsOutfit: 'Ледяной барбершоп-аккорд ставит бескомпромиссный барьер, подчеркивая безупречную посадку пиджака.',
    colorTheme: 'from-slate-400 to-slate-700',
    pyramid: {
      top: ['Розмарин', 'Лаванда', 'Нероли', 'Петитгрейн'],
      heart: ['Гальбанум', 'Мускатный шалфей', 'Жасмин', 'Герань'],
      base: ['Дубовый мох', 'Ветивер', 'Кедр', 'Сандал', 'Амбра']
    }
  },
  {
    id: 'creed-green-irish-tweed',
    name: 'Green Irish Tweed',
    brand: 'Creed',
    xCoord: -0.75,
    yCoord: 0.45,
    diffusion: 'Шлейфовая',
    dominantVibe: 'Аристократичная свежескошенная трава, сдержанное благородство',
    bestOccasion: 'Бизнес-ланч, клубные встречи, совет директоров',
    whyFitsOutfit: 'Классика британского кроя. Гармонирует с шерстяными брюками и структурированным темно-синим пиджаком.',
    colorTheme: 'from-emerald-500 to-teal-700',
    pyramid: {
      top: ['Вербена лимонная', 'Ирис'],
      heart: ['Листья фиалки'],
      base: ['Серая амбра', 'Сандал']
    }
  },
  {
    id: 'guy-laroche-drakkar-noir',
    name: 'Drakkar Noir',
    brand: 'Guy Laroche',
    xCoord: -0.35,
    yCoord: -0.35,
    diffusion: 'Ударная',
    dominantVibe: 'Горький мох, еловая смола, кожа, олдскульная дисциплина',
    bestOccasion: 'Традиционный бизнес, строгие правила, ретро-стиль',
    whyFitsOutfit: 'Классический маскулинный фужер, задающий дистанцию и бескомпромиссность.',
    colorTheme: 'from-emerald-900 to-slate-900',
    pyramid: {
      top: ['Лаванда', 'Лимон', 'Бергамот', 'Розмарин', 'Мята'],
      heart: ['Можжевельник', 'Кориандр', 'Корица', 'Гвоздика'],
      base: ['Дубовый мох', 'Кожа', 'Ель', 'Ветивер', 'Пачули']
    }
  },
  {
    id: 'tom-ford-grey-vetiver',
    name: 'Grey Vetiver',
    brand: 'Tom Ford',
    xCoord: -0.60,
    yCoord: 0.50,
    diffusion: 'Умеренная',
    dominantVibe: 'Чистый серебристый ветивер, грейпфрут, интеллигентная собранность',
    bestOccasion: 'Офис, аналитика, консалтинг, юридическая практика',
    whyFitsOutfit: 'Тонкий, выверенный, строгий спутник серого костюма и белоснежной сорочки.',
    colorTheme: 'from-slate-400 to-emerald-700',
    pyramid: {
      top: ['Грейпфрут', 'Цветок апельсина', 'Шалфей'],
      heart: ['Мускатный орех', 'Корень ириса', 'Красный перец'],
      base: ['Ветивер', 'Древесные ноты', 'Дубовый мох', 'Амбра']
    }
  },
  {
    id: 'bvlgari-pour-homme',
    name: 'Pour Homme',
    brand: 'Bvlgari',
    xCoord: -0.40,
    yCoord: 0.65,
    diffusion: 'Интимная',
    dominantVibe: 'Чай Дарджилинг, кувшинка, тонкий мускус, тихая роскошь',
    bestOccasion: 'Интеллектуальная работа, приватные переговоры, галереи',
    whyFitsOutfit: 'Шедевр минимализма. Не вторгается в чужое пространство, идеально сочетается с кашемировым джемпером.',
    colorTheme: 'from-teal-300 to-slate-500',
    pyramid: {
      top: ['Чай Дарджилинг', 'Альдегиды', 'Бергамот', 'Лаванда'],
      heart: ['Перец', 'Гваяк', 'Ирис', 'Кардамон'],
      base: ['Мускус', 'Кедр', 'Ветивер', 'Амбра']
    }
  },
  {
    id: 'lattafa-emeer',
    name: 'Emeer',
    brand: 'Lattafa',
    xCoord: -0.45,
    yCoord: 0.40,
    diffusion: 'Шлейфовая',
    dominantVibe: 'Холодные цитрусы, кардамон, белый чай, благородный ладан',
    bestOccasion: 'Деловой день, городские встречи, статус без тяжести',
    whyFitsOutfit: 'Арабская свежесть высочайшего уровня: хрустящий бергамот и смолы под блейзер.',
    colorTheme: 'from-yellow-600 to-slate-800',
    pyramid: {
      top: ['Бергамот', 'Лимон', 'Мускатный шалфей'],
      heart: ['Кардамон', 'Белый чай', 'Сандал'],
      base: ['Кедр', 'Пачули', 'Ладан', 'Амбра']
    }
  },
  {
    id: 'armaf-club-de-nuit-intense',
    name: 'Club de Nuit Intense Man',
    brand: 'Armaf',
    xCoord: -0.55,
    yCoord: 0.35,
    diffusion: 'Ударная',
    dominantVibe: 'Копченая береза, лимон, черная смородина, напористый авторитет',
    bestOccasion: 'Активный бизнес, динамичный день, мужское лидерство',
    whyFitsOutfit: 'Яркий дымно-цитрусовый вектор, придающий дерзость костюму и кожаной куртке.',
    colorTheme: 'from-slate-800 to-black',
    pyramid: {
      top: ['Лимон', 'Ананас', 'Бергамот', 'Черная смородина'],
      heart: ['Березовый деготь', 'Жасмин', 'Роза'],
      base: ['Серая амбра', 'Мускус', 'Пачули', 'Ваниль']
    }
  },
  {
    id: 'grey-flannel',
    name: 'Grey Flannel',
    brand: 'Geoffrey Beene',
    xCoord: -0.90,
    yCoord: 0.35,
    diffusion: 'Умеренная',
    dominantVibe: 'Сухой мох, горький гальбанум, несгибаемый авторитет',
    bestOccasion: 'Официальные протокольные мероприятия, суровый деловой стиль',
    whyFitsOutfit: 'Сливается с серой фланелью и шерстью костюма, отсекает фамильярность.',
    colorTheme: 'from-slate-500 to-emerald-900',
    pyramid: {
      top: ['Гальбанум', 'Нероли', 'Петитгрейн'],
      heart: ['Фиалка', 'Ирис', 'Мимоза', 'Шалфей'],
      base: ['Дубовый мох', 'Ветивер', 'Кедр']
    }
  },

  // =========================================================================
  // КВАДРАНТ II: СЕВЕРО-ВОСТОК (ХОЛОД / ДЕНЬ / ЛЕТО + ЛЕГКОСТЬ / СБЛИЖЕНИЕ / CASUAL)
  // X: [0.00 ... +1.00], Y: [0.00 ... +1.00]
  // =========================================================================
  {
    id: '4711-eau-de-cologne',
    name: 'Original Eau de Cologne (1792)',
    brand: '4711',
    xCoord: 0.00,
    yCoord: 0.90,
    diffusion: 'Интимная',
    dominantVibe: 'Абсолютный зенит летучести: искрящийся бергамот, нероли, петитгрейн, утренняя чистота',
    bestOccasion: 'Летний полдень, после душа, курорт, максимальная жара +30°C',
    whyFitsOutfit: 'Исторический родоначальник одеколонов. Воздушный лен и расстегнутый ворот рубашки пропускают летящие цитрусовые молекулы.',
    colorTheme: 'from-emerald-400 to-teal-600',
    pyramid: {
      top: ['Лимон', 'Бергамот', 'Апельсин'],
      heart: ['Лаванда', 'Розмарин'],
      base: ['Нероли', 'Петитгрейн']
    }
  },
  {
    id: 'bleu-de-chanel-edp',
    name: 'Bleu de Chanel',
    brand: 'Chanel',
    xCoord: 0.00,
    yCoord: 0.00,
    diffusion: 'Шлейфовая',
    dominantVibe: 'Абсолютная точка равновесия, нулевая координата баланса (0,0)',
    bestOccasion: 'Офис, переговоры, свидание, город — универсал 24/7',
    whyFitsOutfit: 'Абсолютный камертон системы под темно-синий блейзер Hopsack, бежевые чинос и оксфордскую рубашку.',
    colorTheme: 'from-blue-700 to-indigo-950',
    pyramid: {
      top: ['Грейпфрут', 'Лимон', 'Мята', 'Розовый перец'],
      heart: ['Имбирь', 'Мускатный орех', 'Жасмин', 'Iso E Super'],
      base: ['Ладан', 'Ветивер', 'Кедр', 'Сандал', 'Пачули']
    }
  },
  {
    id: 'versace-man-eau-fraiche',
    name: 'Man Eau Fraîche (2006)',
    brand: 'Versace',
    xCoord: 0.35,
    yCoord: 0.75,
    diffusion: 'Умеренная',
    dominantVibe: 'Искристая карамбола, белый лимон, лазурная вода, беззаботный курорт',
    bestOccasion: 'Жара +25°C..+35°C, открытая веранда, пляж, выходной день',
    whyFitsOutfit: 'Ультралегкая свежесть, идеально гармонирующая с темно-синим поло пике и светлыми чинос.',
    colorTheme: 'from-cyan-300 to-blue-400',
    pyramid: {
      top: ['Карамбола', 'Белый лимон', 'Бергамот', 'Кардамон'],
      heart: ['Кедр', 'Эстрагон', 'Шалфей', 'Черный перец'],
      base: ['Белый мускус', 'Серая амбра', 'Древесные ноты', 'Шафран']
    }
  },
  {
    id: 'acqua-di-gio',
    name: 'Acqua di Giò (1996)',
    brand: 'Giorgio Armani',
    xCoord: 0.70,
    yCoord: 0.75,
    diffusion: 'Шлейфовая',
    dominantVibe: 'Эталон морской акватики, калон, жасмин, морской бриз, открытость миру',
    bestOccasion: 'Летний отдых, морская набережная, летнее кафе, легкий офис',
    whyFitsOutfit: 'Бессмертная акватика Альберто Морильяса: безупречна с белоснежной льняной рубашкой и лоферами.',
    colorTheme: 'from-sky-400 to-cyan-600',
    pyramid: {
      top: ['Лайм', 'Лимон', 'Бергамот', 'Жасмин', 'Апельсин', 'Мандарин'],
      heart: ['Морские ноты', 'Жасмин', 'Калон', 'Персик', 'Фрезия', 'Розмарин'],
      base: ['Белый мускус', 'Кедр', 'Дубовый мох', 'Пачули', 'Амбра']
    }
  },
  {
    id: 'dior-sauvage',
    name: 'Sauvage (2015)',
    brand: 'Dior',
    xCoord: 0.35,
    yCoord: 0.35,
    diffusion: 'Ударная',
    dominantVibe: 'Взрывной амброксан, калабрийский бергамот, сычуаньский перец, мега-проекция',
    bestOccasion: 'Повседневный город, свидание, вечерняя встреча, клуб',
    whyFitsOutfit: 'Амброксановая революция: подчеркивает фактуру плотной белой футболки и темного японского селвиджа.',
    colorTheme: 'from-blue-600 to-indigo-900',
    pyramid: {
      top: ['Калабрийский бергамот', 'Перец'],
      heart: ['Сычуаньский перец', 'Лаванда', 'Розовый перец', 'Ветивер', 'Пачули'],
      base: ['Амброксан', 'Кедр', 'Лабданум']
    }
  },
  {
    id: 'dior-homme-cologne',
    name: 'Dior Homme Cologne (2013)',
    brand: 'Dior',
    xCoord: 0.70,
    yCoord: 0.35,
    diffusion: 'Умеренная',
    dominantVibe: 'Ледяной бергамотовый сорбет, цветы грейпфрута, безупречный белый хлопок',
    bestOccasion: 'Летний день, зной, офис, спорт, поездка на уикенд',
    whyFitsOutfit: 'Запах чистейшей белой футболки из плотного хлопка, сохнущей под полуденным солнцем.',
    colorTheme: 'from-sky-200 to-blue-300',
    pyramid: {
      top: ['Калабрийский бергамот'],
      heart: ['Цветок грейпфрута'],
      base: ['Белый мускус']
    }
  },
  {
    id: 'acqua-di-gio-parfum',
    name: 'Acqua di Giò Parfum',
    brand: 'Giorgio Armani',
    xCoord: 0.45,
    yCoord: 0.80,
    diffusion: 'Шлейфовая',
    dominantVibe: 'Морской бриз, розмарин, открытость, солнечная энергия',
    bestOccasion: 'Летний отдых, прогулка по набережной, кафе на террасе, летний офис',
    whyFitsOutfit: 'Идеален к льняной расстегнутой рубашке и светлым чинос. Свежий, легкий, располагающий.',
    colorTheme: 'from-cyan-400 to-blue-500',
    pyramid: {
      top: ['Морские ноты', 'Бергамот'],
      heart: ['Розмарин', 'Мускатный шалфей', 'Герань'],
      base: ['Ладан', 'Пачули']
    }
  },
  {
    id: 'creed-aventus',
    name: 'Aventus (2010)',
    brand: 'Creed',
    xCoord: 0.35,
    yCoord: -0.35,
    diffusion: 'Шлейфовая',
    dominantVibe: 'Копченый ананас, березовый деготь, черная смородина, харизма триумфатора',
    bestOccasion: 'Статусный день, важные встречи, вечерний выход',
    whyFitsOutfit: 'Король нео-шипров. Придает уверенность блейзеру Hopsack с сорочкой и темно-синим денимом.',
    colorTheme: 'from-neutral-700 to-amber-700',
    pyramid: {
      top: ['Ананас', 'Бергамот', 'Черная смородина', 'Яблоко'],
      heart: ['Береза', 'Пачули', 'Марокканский жасмин', 'Роза'],
      base: ['Мускус', 'Дубовый мох', 'Серая амбра', 'Ваниль']
    }
  },

  {
    id: 'lattafa-musamam',
    name: 'Musamam',
    brand: 'Lattafa',
    xCoord: -0.35,
    yCoord: -0.20,
    diffusion: 'Шлейфовая',
    dominantVibe: 'Пряный шафран, смолистый акигалавуд, благородный ладан и лаванда',
    bestOccasion: 'Вечер, деловой статус, прохладный сезон, уверенный доминант',
    whyFitsOutfit: 'Минерально-смолистые грани ладана и акигалавуда подчеркивают строгую архитектуру пиджаков, пальто и кашемира.',
    colorTheme: 'from-amber-600 via-stone-800 to-black',
    pyramid: {
      top: ['Шафран', 'Итальянский мандарин', 'Лаванда'],
      heart: ['Amberwood', 'Кедр из Вирджинии', 'Египетская герань'],
      base: ['Акигалавуд', 'Сомалийский ладан', 'Лабданум']
    }
  },
  {
    id: 'lattafa-musamam-white-intense',
    name: 'Musamam White Intense',
    brand: 'Lattafa',
    xCoord: 0.62,
    yCoord: 0.25,
    diffusion: 'Шлейфовая',
    dominantVibe: 'Сливочный кокос, солнечный сандал, амброксан, курортный гедонизм',
    bestOccasion: 'Летний вечер, терраса ресторана, свидание, курортный отдых, Smart Casual',
    whyFitsOutfit: 'Тропическая сливочность сандала и кокоса безупречно раскрывается на натуральном льне и шелке, подчеркивая атмосферу непринужденной роскоши.',
    colorTheme: 'from-amber-300 via-yellow-500 to-amber-700',
    pyramid: {
      top: ['Бергамот', 'Апельсин', 'Специи'],
      heart: ['Кокос', 'Иланг-иланг', 'Амброксан'],
      base: ['Сандал', 'Бензоин', 'Мускус']
    }
  },
  {
    id: 'chanel-allure-homme-sport',
    name: 'Allure Homme Sport',
    brand: 'Chanel',
    xCoord: 0.50,
    yCoord: 0.65,
    diffusion: 'Шлейфовая',
    dominantVibe: 'Морские альдегиды, сочный мандарин, бобы тонка, спортивный шик',
    bestOccasion: 'Спорт-шик, активный день, путешествия, уикенд',
    whyFitsOutfit: 'Идеален к поло, качественным кедам и хлопковому бомберу. Свежо, стильно, притягательно.',
    colorTheme: 'from-amber-400 to-slate-500',
    pyramid: {
      top: ['Апельсин', 'Морские ноты', 'Альдегиды', 'Красный мандарин'],
      heart: ['Перец', 'Нероли', 'Кедр'],
      base: ['Бобы тонка', 'Ваниль', 'Белый мускус', 'Амбра', 'Ветивер']
    }
  },
  {
    id: 'davidoff-cool-water',
    name: 'Cool Water',
    brand: 'Davidoff',
    xCoord: 0.30,
    yCoord: 0.80,
    diffusion: 'Умеренная',
    dominantVibe: 'Морская вода, мята, лаванда, калон, кристальная свежесть 90-х',
    bestOccasion: 'Спорт, жаркий день, офис в зной, повседневность',
    whyFitsOutfit: 'Абсолютная чистота. Прекрасно с белой футболкой и классическими синими джинсами.',
    colorTheme: 'from-blue-400 to-cyan-700',
    pyramid: {
      top: ['Морская вода', 'Мята', 'Лаванда', 'Кориандр', 'Розмарин'],
      heart: ['Сандал', 'Жасмин', 'Нероли', 'Герань'],
      base: ['Мускус', 'Кедр', 'Дубовый мох', 'Амбра']
    }
  },
  {
    id: 'mab-ganymede',
    name: 'Ganymede',
    brand: 'Marc-Antoine Barrois',
    xCoord: 0.25,
    yCoord: 0.60,
    diffusion: 'Ударная',
    dominantVibe: 'Минеральная замша, бессмертник, космос, футуристическая элегантность',
    bestOccasion: 'Модные события, архитектура, дизайн, вечерний авангард',
    whyFitsOutfit: 'Ультрамодный интеллектуальный акцент под лаконичный минималистичный крой.',
    colorTheme: 'from-amber-200 to-teal-800',
    pyramid: {
      top: ['Мандарин', 'Шафран'],
      heart: ['Фиалка', 'Османтус', 'Бессмертник'],
      base: ['Akigalawood', 'Минеральные ноты', 'Кожа']
    }
  },
  {
    id: 'mfk-baccarat-rouge-540',
    name: 'Baccarat Rouge 540',
    brand: 'Maison Francis Kurkdjian',
    xCoord: 0.70,
    yCoord: 0.20,
    diffusion: 'Ударная',
    dominantVibe: 'Жженый сахар, серая амбра, шафран, кедровая смола, гипнотический шлейф',
    bestOccasion: 'Светские рауты, вечер, рестораны, роскошный casual',
    whyFitsOutfit: 'Кристальная диффузия, мгновенно притягивающая внимание к стильному образу.',
    colorTheme: 'from-red-600 to-amber-700',
    pyramid: {
      top: ['Шафран', 'Жасмин'],
      heart: ['Amberwood', 'Серая амбра'],
      base: ['Еловая смола', 'Кедр']
    }
  },
  {
    id: 'rasasi-hawas',
    name: 'Hawas for Men',
    brand: 'Rasasi',
    xCoord: 0.75,
    yCoord: 0.65,
    diffusion: 'Ударная',
    dominantVibe: 'Слива, морские ноты, яблоко, корица, взрывная энергия комплиментов',
    bestOccasion: 'Летний вечер, вечеринка, отдых, встречи с друзьями',
    whyFitsOutfit: 'Яркий молодежный взрыв фруктов и акватики под легкий открытый образ.',
    colorTheme: 'from-purple-500 to-blue-600',
    pyramid: {
      top: ['Яблоко', 'Бергамот', 'Лимон', 'Корица'],
      heart: ['Водные ноты', 'Слива', 'Цветок апельсина', 'Кардамон'],
      base: ['Серая амбра', 'Мускус', 'Влажная древесина', 'Пачули']
    }
  },
  {
    id: 'afnan-turathi-blue',
    name: 'Turathi Blue',
    brand: 'Afnan',
    xCoord: 0.40,
    yCoord: 0.70,
    diffusion: 'Шлейфовая',
    dominantVibe: 'Сочный грейпфрут, амбра, мускус, древесная прохлада',
    bestOccasion: 'Жаркий день, офис, спорт, городские дела',
    whyFitsOutfit: 'Великолепная альтернатива Bvlgari Tygar: заряжает цитрусовой бодростью.',
    colorTheme: 'from-blue-500 to-indigo-800',
    pyramid: {
      top: ['Цитрусы', 'Бергамот'],
      heart: ['Амбра', 'Древесные ноты'],
      base: ['Мускус', 'Пачули', 'Специи']
    }
  },

  // =========================================================================
  // КВАДРАНТ III: ЮГО-ЗАПАД (ТЕПЛО / ВЕЧЕР / ЗИМА + СТАТУС / ВЛАСТЬ / СУХОСТЬ)
  // X: [-1.00 ... 0.00], Y: [-1.00 ... 0.00]
  // =========================================================================
  {
    id: 'tom-ford-tuscan-leather',
    name: 'Tuscan Leather (2007)',
    brand: 'Tom Ford',
    xCoord: 0.00,
    yCoord: -0.85,
    diffusion: 'Ударная',
    dominantVibe: 'Абсолютный надир плотности: тяжелая дубленая кожа, дикая малина, дымный олибанум',
    bestOccasion: 'Зимняя ночь, закрытый сигарный клуб, монументальный вечерний выход',
    whyFitsOutfit: 'Молекулярный якорь максимальной массы. Требует предельного веса шерстяного пальто 550 г/м² и кашемировой водолазки.',
    colorTheme: 'from-neutral-800 to-amber-950',
    pyramid: {
      top: ['Малина', 'Шафран', 'Тимьян'],
      heart: ['Олибанум', 'Жасмин'],
      base: ['Кожа', 'Замша', 'Древесные ноты', 'Амбра']
    }
  },
  {
    id: 'tom-ford-oud-wood',
    name: 'Oud Wood',
    brand: 'Tom Ford',
    xCoord: -0.65,
    yCoord: -0.55,
    diffusion: 'Умеренная',
    dominantVibe: 'Драгоценный уд, палисандр, кардамон, утонченная сдержанность',
    bestOccasion: 'Вечерний деловой ужин, театр, закрытые переговоры',
    whyFitsOutfit: 'Шедевр европейского уда. Подчеркивает респектабельность темного костюма-тройки.',
    colorTheme: 'from-stone-700 to-amber-900',
    pyramid: {
      top: ['Розовое дерево', 'Кардамон', 'Сычуаньский перец'],
      heart: ['Уд', 'Сандал', 'Ветивер'],
      base: ['Бобы тонка', 'Ваниль', 'Амбра']
    }
  },
  {
    id: 'dior-fahrenheit',
    name: 'Fahrenheit',
    brand: 'Dior',
    xCoord: -0.75,
    yCoord: -0.35,
    diffusion: 'Шлейфовая',
    dominantVibe: 'Листья фиалки, кожа, бензиново-замшевый аккорд, бунтарский авторитет',
    bestOccasion: 'Неформальные лидерские встречи, рок-концерт, вечер за рулем',
    whyFitsOutfit: 'Легендарный характер. Идеально под винтажную кожаную косуху или брутальное темное пальто.',
    colorTheme: 'from-red-700 to-amber-900',
    pyramid: {
      top: ['Мускатный орех', 'Лаванда', 'Кедр', 'Ромашка', 'Бергамот'],
      heart: ['Листья фиалки', 'Мускатный орех', 'Гвоздика', 'Сандал', 'Жасмин'],
      base: ['Кожа', 'Ветивер', 'Мускус', 'Амбра', 'Пачули']
    }
  },
  {
    id: 'dior-homme-intense',
    name: 'Dior Homme Intense (2007)',
    brand: 'Dior',
    xCoord: -0.70,
    yCoord: -0.75,
    diffusion: 'Шлейфовая',
    dominantVibe: 'Пудровый тосканский ирис, семена амбретты, ликерное какао, закрытый смокинг',
    bestOccasion: 'Театр, вечерний прием, опера, приватный зимний ужин',
    whyFitsOutfit: 'Кинематографичный бархатный ирис: идеален под пальто цвета кэмел с черной кашемировой водолазкой.',
    colorTheme: 'from-amber-800 to-slate-950',
    pyramid: {
      top: ['Лаванда'],
      heart: ['Ирис', 'Амбретта', 'Груша'],
      base: ['Вирджинский кедр', 'Ветивер']
    }
  },
  {
    id: 'versace-oud-noir',
    name: 'Versace Pour Homme Oud Noir (2013)',
    brand: 'Versace',
    xCoord: -0.35,
    yCoord: -0.75,
    diffusion: 'Шлейфовая',
    dominantVibe: 'Горький апельсин, черный перец, смолистый уд, кожаная мантия',
    bestOccasion: 'Вечерние деловые переговоры, осенний статус, приватный клуб',
    whyFitsOutfit: 'Пряно-древесный нуар: подчеркивает геометрию графитового пальто и шерстяных костюмных брюк.',
    colorTheme: 'from-stone-800 to-neutral-950',
    pyramid: {
      top: ['Горький апельсин', 'Нероли', 'Черный перец'],
      heart: ['Кардамон', 'Шафран', 'Олибанум'],
      base: ['Уд', 'Пачули', 'Leatherwood']
    }
  },
  {
    id: 'amouage-interlude-man',
    name: 'Interlude Man',
    brand: 'Amouage',
    xCoord: -0.90,
    yCoord: -0.85,
    diffusion: 'Ударная',
    dominantVibe: 'Голубой дым ладана, орегано, кожа, монументальное величие',
    bestOccasion: 'Морозный вечер, театр, представительские приемы',
    whyFitsOutfit: 'Заполняет пространство авторитетом, поддерживая четкую геометрию строгого зимнего пальто.',
    colorTheme: 'from-blue-900 to-amber-900',
    pyramid: {
      top: ['Орегано', 'Перец', 'Бергамот'],
      heart: ['Ладан', 'Опопонакс', 'Амбра', 'Лабданум'],
      base: ['Кожа', 'Уд', 'Сандал', 'Пачули']
    }
  },
  {
    id: 'lalique-encre-noire',
    name: 'Encre Noire',
    brand: 'Lalique',
    xCoord: -0.85,
    yCoord: -0.40,
    diffusion: 'Умеренная',
    dominantVibe: 'Сырой кипарис, чернильный ветивер, осенний лес, мистический аскетизм',
    bestOccasion: 'Дождливый день, закрытые размышления, концептуальные встречи',
    whyFitsOutfit: 'Монохромная эстетика: идеально к черному пальто, водолазке и тяжелым дерби.',
    colorTheme: 'from-black to-slate-900',
    pyramid: {
      top: ['Кипарис'],
      heart: ['Ветивер', 'Бурбонский ветивер'],
      base: ['Кашемировое дерево', 'Мускус']
    }
  },
  {
    id: 'lattafa-asad',
    name: 'Asad',
    brand: 'Lattafa',
    xCoord: -0.65,
    yCoord: -0.60,
    diffusion: 'Ударная',
    dominantVibe: 'Черный перец, гвоздика, кофе, сухой табак, доминирующая сила',
    bestOccasion: 'Вечерние деловые встречи, холодное время года, клуб',
    whyFitsOutfit: 'Пряно-смолистый шлейф высокой плотности, усиливающий статус темного пальто.',
    colorTheme: 'from-amber-900 to-black',
    pyramid: {
      top: ['Черный перец', 'Ананас', 'Табак'],
      heart: ['Кофе', 'Пачули', 'Ирис'],
      base: ['Амбра', 'Ваниль', 'Древесные ноты', 'Бензоин', 'Лабданум']
    }
  },
  {
    id: 'lattafa-badee-al-oud',
    name: "Bade'e Al Oud (Oud for Glory)",
    brand: 'Lattafa',
    xCoord: -0.80,
    yCoord: -0.75,
    diffusion: 'Ударная',
    dominantVibe: 'Шафран, дымный уд, мускатный орех, восточная роскошь',
    bestOccasion: 'Зимний вечер, светские мероприятия, представительский выход',
    whyFitsOutfit: 'Ольфакторный бронежилет: смолы и шафран гармонируют с тяжелым драпом.',
    colorTheme: 'from-yellow-700 to-black',
    pyramid: {
      top: ['Шафран', 'Мускатный орех', 'Лаванда'],
      heart: ['Уд', 'Пачули'],
      base: ['Уд', 'Пачули', 'Мускус']
    }
  },
  {
    id: 'chanel-egoiste',
    name: 'Égoïste',
    brand: 'Chanel',
    xCoord: -0.55,
    yCoord: -0.50,
    diffusion: 'Шлейфовая',
    dominantVibe: 'Кориандр, сухое красное дерево, благородный сандал',
    bestOccasion: 'Интеллектуальные вечера, галереи, деловой ужин у камина',
    whyFitsOutfit: 'Теплый, интеллигентный, статусный спутник фактурного твидового или шерстяного пиджака.',
    colorTheme: 'from-amber-700 to-yellow-900',
    pyramid: {
      top: ['Палисандр', 'Кориандр', 'Мандарин'],
      heart: ['Дамасская роза', 'Гвоздика (пряность)', 'Корица'],
      base: ['Сандал', 'Табак', 'Ваниль', 'Амбра']
    }
  },

  // =========================================================================
  // КВАДРАНТ IV: ЮГО-ВОСТОК (ТЕПЛО / ВЕЧЕР / ЗИМА + СОБЛАЗН / ИНТИМ / ТАКТИЛЬНОСТЬ)
  // X: [0.00 ... +1.00], Y: [-1.00 ... 0.00]
  // =========================================================================
  {
    id: 'tom-ford-tobacco-vanille',
    name: 'Tobacco Vanille',
    brand: 'Tom Ford',
    xCoord: 0.65,
    yCoord: -0.75,
    diffusion: 'Шлейфовая',
    dominantVibe: 'Табачный лист, сливочная ваниль, какао, непреодолимый магнетизм',
    bestOccasion: 'Свидание тет-а-тет, вечерний ресторан, романтический зимний вечер',
    whyFitsOutfit: 'Идеален с мягким кашемировым джемпером или водолазкой. Провоцирует физическое сближение.',
    colorTheme: 'from-amber-600 to-stone-900',
    pyramid: {
      top: ['Лист табака', 'Пряные ноты'],
      heart: ['Ваниль', 'Какао', 'Бобы тонка', 'Цветок табака'],
      base: ['Сухофрукты', 'Древесные ноты']
    }
  },
  {
    id: 'ysl-la-nuit-de-lhomme',
    name: "La Nuit de L'Homme",
    brand: 'Yves Saint Laurent',
    xCoord: 0.70,
    yCoord: -0.40,
    diffusion: 'Интимная',
    dominantVibe: 'Кардамоновый гипноз, темная лаванда, интимный шепот',
    bestOccasion: 'Свидание, бар с приглушенным светом, ночные прогулки',
    whyFitsOutfit: 'Не кричит о себе, раскрываясь только на дистанции объятий. Великолепен с темной сорочкой или стильным бомбером.',
    colorTheme: 'from-purple-800 to-slate-950',
    pyramid: {
      top: ['Кардамон'],
      heart: ['Лаванда', 'Вирджинский кедр', 'Бергамот'],
      base: ['Ветивер', 'Тмин']
    }
  },
  {
    id: 'versace-eros',
    name: 'Eros (2012)',
    brand: 'Versace',
    xCoord: 0.70,
    yCoord: -0.35,
    diffusion: 'Ударная',
    dominantVibe: 'Зеленое яблоко, мята, бобы тонка, амброксан, клубный магнетизм',
    bestOccasion: 'Ночной клуб, вечеринка, свидание, вечерний выход в город',
    whyFitsOutfit: 'Яркий, соблазняющий и экспрессивный: играет на контрасте с шоколадной замшевой курткой и светлыми чинос.',
    colorTheme: 'from-teal-600 to-cyan-800',
    pyramid: {
      top: ['Мята', 'Зеленое яблоко', 'Лимон'],
      heart: ['Бобы тонка', 'Амброксан', 'Герань'],
      base: ['Мадагаскарская ваниль', 'Вирджинский кедр', 'Атласский кедр', 'Ветивер', 'Дубовый мох']
    }
  },
  {
    id: 'jpg-le-male',
    name: 'Le Male (1995)',
    brand: 'Jean Paul Gaultier',
    xCoord: 0.35,
    yCoord: -0.75,
    diffusion: 'Шлейфовая',
    dominantVibe: 'Культовая чувственность Франсиса Кюркджана: лаванда, мята, корица, пудровая теплая ваниль',
    bestOccasion: 'Осенне-зимний вечер, свидание тет-а-тет, камерная встреча, бар',
    whyFitsOutfit: 'Тактильное тепло и эмпатия: шелковистая ваниль и лаванда вибрируют в унисон с тонким серым мериносом и фланелью.',
    colorTheme: 'from-teal-500 to-indigo-700',
    pyramid: {
      top: ['Лаванда', 'Мята', 'Кардамон', 'Бергамот', 'Артемизия'],
      heart: ['Корица', 'Цветок апельсина', 'Тмин'],
      base: ['Ваниль', 'Бобы тонка', 'Амбра', 'Сандал', 'Кедр']
    }
  },
  {
    id: 'lattafa-khamrah',
    name: 'Khamrah (2022)',
    brand: 'Lattafa',
    xCoord: 0.70,
    yCoord: -0.75,
    diffusion: 'Ударная',
    dominantVibe: 'Финики, пралине, корица, ваниль, абсолютный десертный соблазн',
    bestOccasion: 'Зимний вечер, свидание у камина, ресторан, декабрьские праздники',
    whyFitsOutfit: 'Гурманская теплая буря. Прекрасно сочетается с пальто цвета кэмел, кашемиром и согревающими оттенками.',
    colorTheme: 'from-amber-600 to-yellow-900',
    pyramid: {
      top: ['Корица', 'Мускатный орех', 'Бергамот'],
      heart: ['Финики', 'Пралине', 'Тубероза', 'Магония'],
      base: ['Ваниль', 'Бобы тонка', 'Amberwood', 'Бензоин', 'Мирра']
    }
  },
  {
    id: 'kilian-angels-share',
    name: "Angels' Share",
    brand: 'Kilian',
    xCoord: 0.80,
    yCoord: -0.85,
    diffusion: 'Шлейфовая',
    dominantVibe: 'Коньячный ликер, дубовая бочка, корица, пралине, роскошь гедонизма',
    bestOccasion: 'Коктейльный вечер, бар премиум-класса, романтическое рандеву',
    whyFitsOutfit: 'Аромат-коньяк. Идеален с кашемировым пиджаком цвета camel и замшевыми лоферами.',
    colorTheme: 'from-amber-500 to-orange-950',
    pyramid: {
      top: ['Коньяк'],
      heart: ['Корица', 'Бобы тонка', 'Дуб'],
      base: ['Пралине', 'Ваниль', 'Сандал']
    }
  },
  {
    id: 'azzaro-the-most-wanted',
    name: 'The Most Wanted (Parfum)',
    brand: 'Azzaro',
    xCoord: 0.60,
    yCoord: -0.70,
    diffusion: 'Ударная',
    dominantVibe: 'Красный имбирь, карамель, древесные смолы, мужской афродизиак',
    bestOccasion: 'Свидание тет-а-тет, вечерний бар, прохладный вечер',
    whyFitsOutfit: 'Сладко-пряная уверенность: подчеркивает темный блейзер и качественные джинсы.',
    colorTheme: 'from-yellow-700 to-neutral-900',
    pyramid: {
      top: ['Красный имбирь'],
      heart: ['Древесные аккорды'],
      base: ['Бурбонская ваниль']
    }
  },
  {
    id: 'jpg-ultra-male',
    name: 'Ultra Male (2015)',
    brand: 'Jean Paul Gaultier',
    xCoord: 0.95,
    yCoord: 0.00,
    diffusion: 'Ударная',
    dominantVibe: 'Восточный полюс максимального контакта: черная ваниль, сочная груша, корица, афродизиак',
    bestOccasion: 'Клубная ночь, вечеринка, свидание, флирт',
    whyFitsOutfit: 'Сокращает дистанцию до физического касания. Идеально под шоколадную замшевую куртку и белую футболку.',
    colorTheme: 'from-blue-700 to-indigo-900',
    pyramid: {
      top: ['Груша', 'Лаванда', 'Мята', 'Бергамот', 'Лимон'],
      heart: ['Корица', 'Тмин', 'Мускатный шалфей'],
      base: ['Черная ваниль', 'Амбра', 'Пачули', 'Кедр']
    }
  },
  {
    id: 'maison-margiela-jazz-club',
    name: 'Jazz Club',
    brand: 'Maison Margiela',
    xCoord: 0.65,
    yCoord: -0.60,
    diffusion: 'Шлейфовая',
    dominantVibe: 'Кубинский ром, табачные листья, розовый перец, ваниль, камерный джаз',
    bestOccasion: 'Джаз-клуб, свидание, виниловый вечер, уютный бар',
    whyFitsOutfit: 'Богемная эстетика: сочетается с шерстяным кардиганом или стильной кожаной курткой.',
    colorTheme: 'from-amber-700 to-yellow-950',
    pyramid: {
      top: ['Розовый перец', 'Нероли', 'Лимон'],
      heart: ['Ром', 'Мускатный шалфей', 'Яванский ветивер'],
      base: ['Лист табака', 'Ваниль', 'Стиракс']
    }
  },
  {
    id: 'afnan-9-pm',
    name: '9 PM',
    brand: 'Afnan',
    xCoord: 0.85,
    yCoord: -0.40,
    diffusion: 'Ударная',
    dominantVibe: 'Яблоко, корица, лаванда, теплая ваниль, вечерний драйв',
    bestOccasion: 'Вечеринка, вечерний город, молодежная встреча',
    whyFitsOutfit: 'Сладкий вечерний акцент: звучит ярко, громко и крайне комплиментарно.',
    colorTheme: 'from-indigo-800 to-black',
    pyramid: {
      top: ['Яблоко', 'Корица', 'Дикая лаванда', 'Бергамот'],
      heart: ['Цветок апельсина', 'Ландыш'],
      base: ['Ваниль', 'Бобы тонка', 'Амбра', 'Пачули']
    }
  },
  {
    id: 'parfums-de-marly-herod',
    name: 'Herod',
    brand: 'Parfums de Marly',
    xCoord: 0.85,
    yCoord: -0.80,
    diffusion: 'Шлейфовая',
    dominantVibe: 'Корица, дымная вишня, османтус, гурманская роскошь',
    bestOccasion: 'Зимний вечер, загородный шале, приватная атмосфера',
    whyFitsOutfit: 'Теплая шерсть и мягкая замшевая обувь словно созданы для этой корично-табачной глубины.',
    colorTheme: 'from-red-900 to-amber-950',
    pyramid: {
      top: ['Корица', 'Перец'],
      heart: ['Лист табака', 'Ладан', 'Османтус', 'Лабданум'],
      base: ['Ваниль', 'Исо Е Супер', 'Кедр', 'Мускус', 'Нагармота']
    }
  },
  {
    id: 'dior-sauvage-elixir',
    name: 'Sauvage Elixir',
    brand: 'Dior',
    xCoord: 0.40,
    yCoord: -0.55,
    diffusion: 'Ударная',
    dominantVibe: 'Густая лаванда, лакричник, мускатный орех, уверенная мужская харизма',
    bestOccasion: 'Клуб, вечеринка, прохладный вечер, яркое появление',
    whyFitsOutfit: 'Мощный энергетический шлейф отлично балансирует качественный темный деним и кожаную куртку.',
    colorTheme: 'from-indigo-900 to-blue-950',
    pyramid: {
      top: ['Мускатный орех', 'Корица', 'Кардамон', 'Грейпфрут'],
      heart: ['Лаванда'],
      base: ['Лакричник', 'Сандал', 'Амбра', 'Пачули', 'Гаитянский ветивер']
    }
  }
];

// Готовые капсульные пресеты для быстрого старта пользователя
export const SHELF_PRESETS: ShelfPreset[] = [
  {
    id: 'golden-21',
    name: 'Золотой Канон 21 (Периодическая таблица)',
    description: 'Полная периодическая матрица Аньянова: 1 камертон в центре (0,0) + 4 осевых полюса + 16 квадрантных эталонов.',
    perfumeIds: [
      // Центр (0, 0)
      'bleu-de-chanel-edp',
      // Осевые полюса (Север, Юг, Запад, Восток)
      '4711-eau-de-cologne',
      'tom-ford-tuscan-leather',
      'chanel-platinum-egoiste',
      'jpg-ultra-male',
      // Квадрант I: Открытая свежесть (+X, +Y)
      'versace-man-eau-fraiche',
      'acqua-di-gio',
      'dior-sauvage',
      'dior-homme-cologne',
      // Квадрант II: Холодный контроль (-X, +Y)
      'dior-eau-sauvage',
      'prada-lhomme',
      'paco-rabanne-pour-homme',
      'ysl-lhomme',
      // Квадрант III: Темный статус (-X, -Y)
      'terre-dhermes',
      'guy-laroche-drakkar-noir',
      'dior-homme-intense',
      'versace-oud-noir',
      // Квадрант IV: Тактильное тепло (+X, -Y)
      'creed-aventus',
      'versace-eros',
      'jpg-le-male',
      'lattafa-khamrah',
    ],
  },
  {
    id: 'gentleman-top-5',
    name: 'Базовый джентльмен (Топ-5)',
    description: 'Универсальная капсула: офис, жара, свидание, вечерний статус и баланс на каждый день.',
    perfumeIds: [
      'bleu-de-chanel-edp',
      'terre-dhermes',
      'prada-lhomme',
      'acqua-di-gio-parfum',
      'tom-ford-tobacco-vanille',
    ],
  },
  {
    id: 'modern-luxury-8',
    name: 'Современный люкс (8 флаконов)',
    description: 'Полный гардероб на все 4 сезона и любые протоколы встреч.',
    perfumeIds: [
      'bleu-de-chanel-edp',
      'terre-dhermes',
      'prada-lhomme',
      'chanel-platinum-egoiste',
      'dior-sauvage',
      'creed-aventus',
      'ysl-la-nuit-de-lhomme',
      'tom-ford-tuscan-leather',
    ],
  },
  {
    id: 'arabic-bestsellers',
    name: 'Арабский хит-парад (Lattafa & Afnan)',
    description: 'Сверхстойкие комплиментарные фавориты с восточным характером.',
    perfumeIds: [
      'lattafa-musamam-white-intense',
      'lattafa-khamrah',
      'lattafa-asad',
      'afnan-turathi-blue',
      'afnan-9-pm',
      'armaf-club-de-nuit-intense',
      'lattafa-emeer',
    ],
  },
  {
    id: 'niche-connoisseur',
    name: 'Нишевый ценитель',
    description: 'Сложные архитектурные ароматы: Ganymede, Baccarat, Interlude, Angels\' Share.',
    perfumeIds: [
      'mab-ganymede',
      'mfk-baccarat-rouge-540',
      'amouage-interlude-man',
      'kilian-angels-share',
      'tom-ford-oud-wood',
      'lalique-encre-noire',
    ],
  },
];

/**
 * Получить список кастомных ароматов пользователя из LocalStorage
 */
export function getCustomPerfumes(): PerfumeItem[] {
  return safeGetJson<PerfumeItem[]>(
    STORAGE_KEYS.CUSTOM_PERFUMES,
    [],
    (data): data is PerfumeItem[] => Array.isArray(data)
  );
}

/**
 * Сохранить пользовательский аромат в LocalStorage и синхронизировать с PERFUME_DATABASE
 */
export function saveCustomPerfume(perfume: PerfumeItem): void {
  const current = getCustomPerfumes();
  const filtered = current.filter((p) => p.id !== perfume.id);
  const updated = [perfume, ...filtered];
  safeSetJson(STORAGE_KEYS.CUSTOM_PERFUMES, updated);

  const idx = PERFUME_DATABASE.findIndex((p) => p.id === perfume.id);
  if (idx >= 0) {
    PERFUME_DATABASE[idx] = perfume;
  } else {
    PERFUME_DATABASE.push(perfume);
  }
}

/**
 * Удалить пользовательский аромат
 */
export function deleteCustomPerfume(id: string): void {
  const current = getCustomPerfumes();
  const updated = current.filter((p) => p.id !== id);
  safeSetJson(STORAGE_KEYS.CUSTOM_PERFUMES, updated);

  const idx = PERFUME_DATABASE.findIndex((p) => p.id === id);
  if (idx >= 0) {
    PERFUME_DATABASE.splice(idx, 1);
  }
}

// Загрузка сохраненных пользовательских флаконов в общую базу при запуске приложения
if (typeof window !== 'undefined') {
  try {
    const savedCustom = getCustomPerfumes();
    savedCustom.forEach((p) => {
      if (!PERFUME_DATABASE.some((item) => item.id === p.id)) {
        PERFUME_DATABASE.push(p);
      }
    });
  } catch {
    // Безопасный фоллбек для SSR / среды тестирования
  }
}

