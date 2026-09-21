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
    bestOccasion: 'Универсал (Лето): универсальный баланс, офис, город, встречи с друзьями',
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
    bestOccasion: 'Универсал (Зима): универсальный баланс, офис в холодный сезон, вечерний баланс',
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
    id: 'pdm-carlisle',
    name: 'Carlisle',
    brand: 'Parfums de Marly',
    xCoord: 0.34,
    yCoord: -0.51,
    diffusion: 'Шлейфовая',
    dominantVibe: 'Темное хрустящее яблоко, мускатный орех, сливочные бобы тонка, смолистый опопонакс, благородная бурбонская ваниль',
    bestOccasion: 'Зимний/осенний вечер, статусное мероприятие, свидание тет-а-тет, театр, клубный вечер',
    whyFitsOutfit: 'Плотный пряно-бальзамический аккорд идеально гармонирует с кашемировым пальто, шерстяным пиджаком, водолазкой и замшей.',
    colorTheme: 'from-amber-700 via-yellow-900 to-black',
    pyramid: {
      top: ['Зеленое яблоко', 'Мускатный орех', 'Бергамот', 'Мандарин'],
      heart: ['Бобы тонка', 'Османтус', 'Роза', 'Давана'],
      base: ['Пачули', 'Бурбонская ваниль', 'Опопонакс', 'Смолы']
    }
  },
  {
    id: 'maison-alhambra-cassius',
    name: 'Cassius',
    brand: 'Maison Alhambra',
    xCoord: 0.22,
    yCoord: -0.64,
    diffusion: 'Ударная',
    dominantVibe: 'Пряный шафран, хрустящее яблоко, сладкие бобы тонка, густые пачули, напористый восточный шлейф',
    bestOccasion: 'Прохладная осень/зима, открытые террасы, клубная вечеринка, вечерний Casual',
    whyFitsOutfit: 'Напористый пряно-шафрановый профиль требует плотных фактур: кожаная куртка, тяжелый деним, шерстяной оверсайз свитер.',
    colorTheme: 'from-amber-600 via-stone-800 to-black',
    pyramid: {
      top: ['Зеленое яблоко', 'Мускатный орех', 'Шафран'],
      heart: ['Бобы тонка', 'Роза', 'Османтус'],
      base: ['Пачули', 'Ваниль', 'Опопонакс']
    }
  },
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
  },

  // =========================================================================
  // КОЛЛЕКЦИЯ ПОЛЬЗОВАТЕЛЯ (45 ФЛАКОНОВ): РАСШИРЕННЫЙ КАТАЛОГ
  // =========================================================================
  {
    id: 'abercrombie-first-instinct',
    name: 'First Instinct (2016)',
    brand: 'Abercrombie & Fitch',
    xCoord: 0.60,
    yCoord: 0.50,
    diffusion: 'Шлейфовая',
    dominantVibe: 'Дыня кивано, джин-тоник, замша, фиалка, соблазнительный летний задор',
    bestOccasion: 'Летняя тусовка, свидание на открытом воздухе, пляжный бар',
    whyFitsOutfit: 'Непринужденный Smart/Casual: открытая льняная рубашка, светлые брюки или шорты.',
    colorTheme: 'from-amber-400 to-yellow-600',
    pyramid: {
      top: ['Дыня Кивано', 'Джин-тоник', 'Лист фиалки'],
      heart: ['Сычуаньский перец', 'Лист цитруса', 'Замша'],
      base: ['Амбра', 'Мускус', 'Свежий кедр']
    }
  },
  {
    id: 'al-haramain-detour-noir',
    name: 'Detour Noir',
    brand: 'Al Haramain',
    xCoord: 0.40,
    yCoord: -0.55,
    diffusion: 'Ударная',
    dominantVibe: 'Хрустящее зеленое яблоко, лаванда, миндальная ваниль, сандал (профиль PDM Layton)',
    bestOccasion: 'Осенне-зимний вечер, свидание, клуб, стильное пальто',
    whyFitsOutfit: 'Один из самых комплиментарных вечерних профилей. Прекрасен с темным монохромом и кашемиром.',
    colorTheme: 'from-violet-900 to-indigo-950',
    pyramid: {
      top: ['Миндаль', 'Зеленое яблоко', 'Лаванда', 'Бергамот'],
      heart: ['Жасмин', 'Фиалка', 'Герань'],
      base: ['Ваниль', 'Кардамон', 'Сандал', 'Гваяк', 'Пачули']
    }
  },
  {
    id: 'antonio-banderas-blue-seduction',
    name: 'Blue Seduction (2007)',
    brand: 'Antonio Banderas',
    xCoord: 0.30,
    yCoord: 0.65,
    diffusion: 'Умеренная',
    dominantVibe: 'Сочная дыня, мята, бергамот, капучино, морская волна',
    bestOccasion: 'Жаркое лето, отдых у воды, повседневный летний спорт-кэжуал',
    whyFitsOutfit: 'Легкое поло, хлопковые чиносы, светлые кеды: непринужденная акватическая свежесть с десертным нюансом.',
    colorTheme: 'from-cyan-400 to-blue-600',
    pyramid: {
      top: ['Дыня', 'Бергамот', 'Мята', 'Черная смородина'],
      heart: ['Морская вода', 'Зеленое яблоко', 'Капучино', 'Кардамон', 'Мускатный орех'],
      base: ['Древесные ноты', 'Амбра']
    }
  },
  {
    id: 'guess-1981-los-angeles',
    name: '1981 Los Angeles Men (2019)',
    brand: 'Guess',
    xCoord: 0.45,
    yCoord: -0.40,
    diffusion: 'Шлейфовая',
    dominantVibe: 'Сливовая сладость, черный перец, имбирь, амбра, табачная дымка',
    bestOccasion: 'Вечерний город, бар, свидание, прохладный демисезон',
    whyFitsOutfit: 'Кожаная куртка или замшевый бомбер, темные джинсы: теплый амброво-фруктовый акцент.',
    colorTheme: 'from-amber-700 to-rose-950',
    pyramid: {
      top: ['Слива', 'Черный перец', 'Бергамот'],
      heart: ['Имбирь', 'Герань', 'Мята'],
      base: ['Амбра', 'Табак', 'Сандал', 'Ветивер']
    }
  },
  {
    id: 'hugo-boss-boss-bottled',
    name: 'Boss Bottled (1998)',
    brand: 'Hugo Boss',
    xCoord: -0.15,
    yCoord: 0.05,
    diffusion: 'Умеренная',
    dominantVibe: 'Печеное яблоко, корица, ваниль, слива, благородный кедр',
    bestOccasion: 'Офис, деловые встречи, демисезонный Business Casual',
    whyFitsOutfit: 'Золотой стандарт европейского кэжуала: джемпер поверх сорочки, структурированный блейзер, теплота и надежность.',
    colorTheme: 'from-amber-600 to-stone-800',
    pyramid: {
      top: ['Яблоко', 'Слива', 'Лимон', 'Бергамот', 'Дубовый мох'],
      heart: ['Корица', 'Красное дерево', 'Гвоздика'],
      base: ['Ваниль', 'Сандал', 'Кедр', 'Ветивер', 'Оливковое дерево']
    }
  },
  {
    id: 'lattafa-al-nashama-caprice',
    name: 'Al Nashama Caprice',
    brand: 'Lattafa',
    xCoord: 0.35,
    yCoord: -0.20,
    diffusion: 'Шлейфовая',
    dominantVibe: 'Кардамон, свежий имбирь, лаванда, кедр (профиль Bleu Électrique)',
    bestOccasion: 'Романтический вечер, ужин в ресторане, ночные прогулки',
    whyFitsOutfit: 'Черная рубашка, минималистичный темный костюм или приталенный пиджак: магнетический пряно-лавандовый шлейф.',
    colorTheme: 'from-blue-700 to-purple-950',
    pyramid: {
      top: ['Кардамон', 'Имбирь', 'Бергамот', 'Лимон'],
      heart: ['Лаванда', 'Герань', 'Мята'],
      base: ['Кедр', 'Ветивер', 'Пачули', 'Амбра']
    }
  },
  {
    id: 'lattafa-ansaam-silver',
    name: 'Ansaam Silver',
    brand: 'Lattafa',
    xCoord: 0.60,
    yCoord: -0.70,
    diffusion: 'Ударная',
    dominantVibe: 'Пряный кардамон, давана, сливочный тоффи, амбра, ваниль (профиль Azzaro The Most Wanted)',
    bestOccasion: 'Морозная зима, ночной клуб, яркое свидание',
    whyFitsOutfit: 'Теплый шерстяной свитер крупной вязки или стильная дубленка: густая манящая сладость.',
    colorTheme: 'from-amber-600 to-slate-950',
    pyramid: {
      top: ['Кардамон', 'Бергамот'],
      heart: ['Давана', 'Лаванда'],
      base: ['Ваниль', 'Бобы тонка', 'Амбра', 'Пачули']
    }
  },
  {
    id: 'lattafa-badee-al-oud-honor-glory',
    name: 'Bade\'e Al Oud Honor & Glory',
    brand: 'Lattafa',
    xCoord: 0.50,
    yCoord: -0.50,
    diffusion: 'Ударная',
    dominantVibe: 'Карамелизованный ананас, крем-брюле, куркума, корица, ванильный бензоин',
    bestOccasion: 'Праздники, вечеринки, прохладный сезон, эффектный выход',
    whyFitsOutfit: 'Элегантный контрастный образ: бежевое пальто, водолазка, стильные акценты.',
    colorTheme: 'from-amber-400 to-yellow-800',
    pyramid: {
      top: ['Ананас', 'Крем-брюле'],
      heart: ['Бензоин', 'Куркума', 'Корица', 'Черный перец'],
      base: ['Ваниль', 'Кашмеран', 'Сандал', 'Мох']
    }
  },
  {
    id: 'lattafa-qaed-al-fursan',
    name: 'Qaed Al Fursan',
    brand: 'Lattafa',
    xCoord: 0.40,
    yCoord: 0.10,
    diffusion: 'Шлейфовая',
    dominantVibe: 'Сочнейший спелый ананас на гриле, шафран, пихтовый бальзам, кедр, смолы',
    bestOccasion: 'Универсал: вечерний отдых, встречи с друзьями, теплая осень и весна',
    whyFitsOutfit: 'Ультра-комплиментарный ананасовый штрих. Идеален со Smart Casual и черной кожаной курткой.',
    colorTheme: 'from-yellow-500 to-neutral-900',
    pyramid: {
      top: ['Ананас', 'Шафран'],
      heart: ['Жасмин', 'Пихтовый бальзам'],
      base: ['Амбра', 'Кедр', 'Уд']
    }
  },
  {
    id: 'lattafa-ramz-silver',
    name: 'Ramz Lattafa (Silver)',
    brand: 'Lattafa',
    xCoord: 0.70,
    yCoord: -0.60,
    diffusion: 'Ударная',
    dominantVibe: 'Сладкая сочная груша, мята, лаванда, черная ваниль (профиль JPG Ultra Male)',
    bestOccasion: 'Клуб, бар, ночная тусовка, зимний уикенд',
    whyFitsOutfit: 'Яркий молодежный кэжуал, темный деним, худи или оверсайз куртка.',
    colorTheme: 'from-sky-500 to-indigo-950',
    pyramid: {
      top: ['Груша', 'Лаванда', 'Бергамот', 'Мята'],
      heart: ['Кардамон', 'Шалфей'],
      base: ['Ваниль', 'Амбра', 'Мускус', 'Пачули']
    }
  },
  {
    id: 'lattafa-fakhr-black',
    name: 'Fakhr Black',
    brand: 'Lattafa',
    xCoord: 0.10,
    yCoord: 0.25,
    diffusion: 'Шлейфовая',
    dominantVibe: 'Хрустящее яблоко, имбирь, шалфей, ягоды можжевельника, бобы тонка (профиль YSL Y EDP)',
    bestOccasion: 'Универсальный солдат: офис, спортзал, прогулка, свидание',
    whyFitsOutfit: 'Чистый, собранный, свежий с легкой сладостью. Подходит под 95% повседневного гардероба.',
    colorTheme: 'from-slate-700 to-black',
    pyramid: {
      top: ['Яблоко', 'Бергамот', 'Имбирь'],
      heart: ['Лаванда', 'Шалфей', 'Ягоды можжевельника', 'Герань'],
      base: ['Бобы тонка', 'Амбровое дерево', 'Кедр', 'Ветивер']
    }
  },
  {
    id: 'lattafa-najdia',
    name: 'Najdia',
    brand: 'Lattafa',
    xCoord: 0.25,
    yCoord: 0.45,
    diffusion: 'Шлейфовая',
    dominantVibe: 'Водный аккорд, цитрусы, корица, яблоко, серая амбра (свеже-энергетичный профиль)',
    bestOccasion: 'Летние прогулки, спортзал, активный отдых на открытом воздухе',
    whyFitsOutfit: 'Спортивный кэжуал: поло, шорты, легкая ветровка, белые кроссовки.',
    colorTheme: 'from-teal-500 to-emerald-900',
    pyramid: {
      top: ['Лимон', 'Корица', 'Яблоко', 'Бергамот', 'Лемонграсс'],
      heart: ['Водные ноты', 'Лаванда', 'Розмарин', 'Кардамон'],
      base: ['Серая амбра', 'Мускус', 'Сандал', 'Кедр', 'Табак']
    }
  },
  {
    id: 'lattafa-al-qiam-silver',
    name: 'Al Qiam Silver',
    brand: 'Lattafa',
    xCoord: -0.10,
    yCoord: 0.55,
    diffusion: 'Шлейфовая',
    dominantVibe: 'Искрящийся грейпфрут, имбирь, сухой минеральный амброксан, ветивер (профиль Tygar)',
    bestOccasion: 'Летний офис, деловые переговоры в жару, премиальный дневной статус',
    whyFitsOutfit: 'Безупречная белая рубашка или льняной пиджак: дорогой цитрусово-минеральный шлейф без лишней сладости.',
    colorTheme: 'from-slate-400 to-amber-600',
    pyramid: {
      top: ['Грейпфрут', 'Имбирь'],
      heart: ['Амброксан', 'Сандал'],
      base: ['Ветивер', 'Мускус']
    }
  },
  {
    id: 'loewe-solo-cedro',
    name: 'Solo Cedro (2015)',
    brand: 'Loewe',
    xCoord: -0.45,
    yCoord: 0.20,
    diffusion: 'Умеренная',
    dominantVibe: 'Кедр, мускатный орех, мандарин, лаванда, сдержанная испанская аристократичность',
    bestOccasion: 'Архитектурный офис, кабинет, переговоры, осенний день',
    whyFitsOutfit: 'Серый твидовый пиджак, качественный кашемировый лонгслив, оксфорды: интеллигентная древесная дистанция.',
    colorTheme: 'from-amber-700 to-stone-900',
    pyramid: {
      top: ['Мандарин', 'Розовый перец'],
      heart: ['Лаванда', 'Мускатный орех'],
      base: ['Кедр', 'Бензоин']
    }
  },
  {
    id: 'maison-alhambra-alpine-homme-sport',
    name: 'Alpine Homme Sport',
    brand: 'Maison Alhambra',
    xCoord: 0.20,
    yCoord: 0.65,
    diffusion: 'Шлейфовая',
    dominantVibe: 'Мандарин, перечная мята, морской бриз, кедр, белый мускус (профиль Allure Homme Sport)',
    bestOccasion: 'Спорт, летний утренний выезд, офис без галстуков',
    whyFitsOutfit: 'Свежее хлопковое поло, светлый деним, премиальные минималистичные кеды.',
    colorTheme: 'from-slate-300 to-orange-500',
    pyramid: {
      top: ['Мандарин', 'Мята', 'Морские ноты', 'Апельсин'],
      heart: ['Черный перец', 'Нероли', 'Кедр'],
      base: ['Бобы тонка', 'Белый мускус', 'Амбра', 'Ветивер']
    }
  },
  {
    id: 'moschino-toy-boy',
    name: 'Toy Boy (2019)',
    brand: 'Moschino',
    xCoord: 0.50,
    yCoord: -0.15,
    diffusion: 'Ударная',
    dominantVibe: 'Темная роза, розовый перец, пряная груша, гвоздика, шелковистый кашмеран',
    bestOccasion: 'Арт-вечеринка, выставка, модное свидание, дерзкий вечерний выход',
    whyFitsOutfit: 'Авангардный лук, total black, кожаный плащ или пиджак свободного кроя. Аромат для уверенных в себе мужчин.',
    colorTheme: 'from-neutral-900 to-rose-950',
    pyramid: {
      top: ['Розовый перец', 'Груша', 'Индонезийский мускатный орех', 'Элеми', 'Бергамот'],
      heart: ['Роза', 'Гвоздика (пряность)', 'Магнолия', 'Лен'],
      base: ['Кашмеран', 'Гаитянский ветивер', 'Sylkolide', 'Сандал', 'Амбра']
    }
  },
  {
    id: 'pendora-scents-the-dream-catcher',
    name: 'The Dream Catcher',
    brand: 'Pendora Scents',
    xCoord: 0.55,
    yCoord: -0.45,
    diffusion: 'Шлейфовая',
    dominantVibe: 'Грейпфрут, теплый кориандр, пряный табак, амбра, кедр (профиль D&G The One)',
    bestOccasion: 'Интимное свидание, кино, вечерний бар, уютная кофейня',
    whyFitsOutfit: 'Один из величайших ароматов для сближения. Фланелевая рубашка или мягкий трикотаж, создающий желание подойти ближе.',
    colorTheme: 'from-amber-600 to-stone-900',
    pyramid: {
      top: ['Грейпфрут', 'Кориандр', 'Базилик'],
      heart: ['Имбирь', 'Кардамон', 'Цветок апельсина'],
      base: ['Табак', 'Амбра', 'Кедр']
    }
  },
  {
    id: 'versace-blue-jeans',
    name: 'Blue Jeans (1994)',
    brand: 'Versace',
    xCoord: 0.35,
    yCoord: 0.20,
    diffusion: 'Шлейфовая',
    dominantVibe: 'Цитрусы, можжевельник, лаванда, ваниль, сандал, ностальгическая винтажная свобода 90-х',
    bestOccasion: 'Выходной день, прогулка по городу, музыкальный фестиваль, встреча выпускников',
    whyFitsOutfit: 'Винтажная джинсовка, базовые Levi\'s, белая футболка: дерзкая классика эпохи Джанни Версаче.',
    colorTheme: 'from-blue-500 to-indigo-700',
    pyramid: {
      top: ['Цитрусы', 'Бергамот', 'Можжевельник', 'Анис', 'Палисандр', 'Базилик'],
      heart: ['Лаванда', 'Роза', 'Гвоздика', 'Герань', 'Жасмин', 'Шалфей'],
      base: ['Ваниль', 'Бобы тонка', 'Сандал', 'Ирис', 'Мускус', 'Амбра', 'Кедр', 'Пачули']
    }
  },
  {
    id: 'versace-l-homme-1984',
    name: 'L\'Homme (1984)',
    brand: 'Versace',
    xCoord: -0.65,
    yCoord: 0.10,
    diffusion: 'Шлейфовая',
    dominantVibe: 'Итальянский лимон, базилик, корица, благородная кожа, дубовый мох, золотой век маскулинности',
    bestOccasion: 'Деловой протокол, совет директоров, осенний статус, сигарный клуб',
    whyFitsOutfit: 'Классический двубортный костюм, шерстяное пальто, кожаные дерби: авторитет и бескомпромиссная порода.',
    colorTheme: 'from-yellow-700 to-amber-950',
    pyramid: {
      top: ['Лимон', 'Базилик', 'Бергамот', 'Петитгрейн', 'Зеленые ноты'],
      heart: ['Корица', 'Гвоздика', 'Пачули', 'Сандал', 'Роза', 'Кедр', 'Жасмин'],
      base: ['Кожа', 'Дубовый мох', 'Лабданум', 'Амбра', 'Мускус', 'Ваниль']
    }
  },
  {
    id: 'nautica-voyage',
    name: 'Voyage (2006)',
    brand: 'Nautica',
    xCoord: 0.10,
    yCoord: 0.80,
    diffusion: 'Шлейфовая',
    dominantVibe: 'Хрустящее зеленое яблоко, зеленые листья, водяной лотос, мимоза, кедр, морской бриз',
    bestOccasion: 'Жара +30°C, пляж, спортзал, повседневный летний зной',
    whyFitsOutfit: 'Белая льняная рубашка с закатанными рукавами, шорты чинос, топсайдеры: абсолютное ощущение прохладного душа.',
    colorTheme: 'from-cyan-400 to-blue-500',
    pyramid: {
      top: ['Зеленые листья', 'Зеленое яблоко'],
      heart: ['Лотос', 'Мимоза'],
      base: ['Мускус', 'Кедр', 'Дубовый мох', 'Амбра']
    }
  },
  {
    id: 'bentley-for-men-intense',
    name: 'Bentley for Men Intense (2013)',
    brand: 'Bentley',
    xCoord: -0.30,
    yCoord: -0.85,
    diffusion: 'Ударная',
    dominantVibe: 'Выдержанный ром, грубая кожа, церковный ладан, корица, бензоин, древесный дым',
    bestOccasion: 'Глубокая зима, метель, вечерний статус, бар с камином, строго 1-2 пшика',
    whyFitsOutfit: 'Тяжелое шерстяное пальто, кожаные перчатки, фактурный кашемир: образ респектабельного мужчины.',
    colorTheme: 'from-amber-800 to-stone-950',
    pyramid: {
      top: ['Черный перец', 'Лавр', 'Бергамот'],
      heart: ['Ром', 'Древесные ноты', 'Корица', 'Мускатный шалфей', 'Герань'],
      base: ['Ладан', 'Кожа', 'Бензоин', 'Пачули', 'Кедр']
    }
  },
  {
    id: 'salvatore-ferragamo-f-by-ferragamo',
    name: 'F by Ferragamo Black (2009)',
    brand: 'Salvatore Ferragamo',
    xCoord: -0.10,
    yCoord: -0.15,
    diffusion: 'Шлейфовая',
    dominantVibe: 'Лаванда, острый черный перец, кориандр, бобы тонка, вечерний итальянский баланс',
    bestOccasion: 'Деловой вечер, ужин в ресторане, осенне-весенний офис',
    whyFitsOutfit: 'Темно-синий костюм без галстука или черный блейзер: строгая привлекательность без избыточной сладости.',
    colorTheme: 'from-slate-700 to-purple-950',
    pyramid: {
      top: ['Лаванда', 'Яблоко'],
      heart: ['Черный перец', 'Кориандр'],
      base: ['Бобы тонка', 'Лабданум']
    }
  },
  {
    id: 'armani-code',
    name: 'Armani Code (2004)',
    brand: 'Giorgio Armani',
    xCoord: 0.20,
    yCoord: -0.40,
    diffusion: 'Умеренная',
    dominantVibe: 'Бергамот, звездчатый анис, цветок оливы, кожа, светлый табак, бобы тонка',
    bestOccasion: 'Свидание, театр, вечерний смокинг или костюм, элегантный ресторан',
    whyFitsOutfit: 'Один из самых утонченных вечерних кодов: черный атлас, шелковый платок, выглаженная сорочка.',
    colorTheme: 'from-slate-900 to-indigo-950',
    pyramid: {
      top: ['Бергамот', 'Лимон'],
      heart: ['Звездчатый анис', 'Цветок оливы', 'Гваяк'],
      base: ['Кожа', 'Табак', 'Бобы тонка']
    }
  },
  {
    id: 'viktor-rolf-spicebomb',
    name: 'Spicebomb (2012)',
    brand: 'Viktor&Rolf',
    xCoord: 0.50,
    yCoord: -0.65,
    diffusion: 'Ударная',
    dominantVibe: 'Взрыв розового перца, корицы, шафрана, чили, табака и кожи',
    bestOccasion: 'Холодная осень, зима, новогодние праздники, вечерний бар',
    whyFitsOutfit: 'Кожаная куртка, объемный шарф, тяжелые ботинки: согревающий и взрывной пряный ореол.',
    colorTheme: 'from-orange-700 to-stone-900',
    pyramid: {
      top: ['Розовый перец', 'Элеми', 'Бергамот', 'Грейпфрут'],
      heart: ['Корица', 'Шафран', 'Паприка (чили)'],
      base: ['Табак', 'Кожа', 'Ветивер']
    }
  },
  {
    id: 'mancera-cedrat-boise',
    name: 'Cedrat Boise',
    brand: 'Mancera',
    xCoord: -0.10,
    yCoord: 0.30,
    diffusion: 'Шлейфовая',
    dominantVibe: 'Сицилийский лимон, черная смородина, пряности, белая кожа, кедр, сандал',
    bestOccasion: 'Универсал круглый год: от деловых встреч до вечерних посиделок',
    whyFitsOutfit: 'Идеальный баланс нишевой цитрусовой свежести и благородной кожи. Гармонирует со Smart Casual любого уровня.',
    colorTheme: 'from-amber-500 to-yellow-700',
    pyramid: {
      top: ['Сицилийский лимон', 'Черная смородина', 'Бергамот', 'Пряности'],
      heart: ['Фруктовые ноты', 'Лист пачули', 'Водяной жасмин'],
      base: ['Кедр', 'Кожа', 'Сандал', 'Ваниль', 'Белый мускус', 'Мох']
    }
  },
  {
    id: 'maison-alhambra-opulence-leather',
    name: 'Opulence Leather',
    brand: 'Maison Alhambra',
    xCoord: -0.40,
    yCoord: -0.70,
    diffusion: 'Ударная',
    dominantVibe: 'Спелая малина, шафран, тимьян, тяжелая сырая кожа, черная замша, амбра (профиль Tuscan Leather)',
    bestOccasion: 'Статусные переговоры, вечер в костюме, холодная осень и зима',
    whyFitsOutfit: 'Кожаный пиджак, фактурное пальто, брендовые аксессуары: бескомпромиссное выражение доминирования.',
    colorTheme: 'from-amber-900 to-rose-950',
    pyramid: {
      top: ['Малина', 'Шафран', 'Тимьян'],
      heart: ['Олибанум', 'Жасмин'],
      base: ['Кожа', 'Замша', 'Древесные ноты', 'Амбра']
    }
  },
  {
    id: 'fragrance-world-woody-oud',
    name: 'Woody Oud',
    brand: 'Fragrance World',
    xCoord: -0.35,
    yCoord: -0.50,
    diffusion: 'Шлейфовая',
    dominantVibe: 'Удовое дерево, палисандр, сычуаньский перец, кардамон, сандал, ветивер (профиль TF Oud Wood)',
    bestOccasion: 'Деловой протокол, осенний офис, интеллектуальные встречи, вечерний релакс',
    whyFitsOutfit: 'Минималистичный темно-серый или темно-синий костюм, шелковый трикотаж: полированная статусная интеллигентность.',
    colorTheme: 'from-stone-700 to-neutral-900',
    pyramid: {
      top: ['Кардамон', 'Розовое дерево (палисандр)', 'Сычуаньский перец'],
      heart: ['Уд', 'Сандал', 'Ветивер'],
      base: ['Бобы тонка', 'Ваниль', 'Амбра']
    }
  },
  // =========================================================================
  // РУССКАЯ ПАРФЮМЕРНАЯ КОЛЛЕКЦИЯ: SERGIO NERO («АДМИРАЛЪ») & PRIME MINISTER
  // =========================================================================
  {
    id: 'prime-minister-action-decisive',
    name: 'Action Décisive',
    brand: 'Prime Minister',
    xCoord: 0.20,
    yCoord: 0.35,
    diffusion: 'Шлейфовая',
    dominantVibe: 'Ананас, бергамот, хрустящий ревень, роза, сандал, амбра, белое дерево',
    bestOccasion: 'Весна, лето, деловой casual, городские встречи, открытые пространства',
    whyFitsOutfit: 'Сочный ананасово-ревеневый фужер авторства Эрика Фракапана: отлично садится под светлую рубашку, чиносы и замшевые лоферы.',
    colorTheme: 'from-amber-500 to-emerald-700',
    pyramid: {
      top: ['Ананас', 'Бергамот'],
      heart: ['Ревень', 'Роза'],
      base: ['Сандал', 'Амбра', 'Белое дерево']
    }
  },
  {
    id: 'sergio-nero-admiral-classic',
    name: 'Адмиралъ (Классический)',
    brand: 'Sergio Nero',
    xCoord: 0.00,
    yCoord: 0.10,
    diffusion: 'Шлейфовая',
    dominantVibe: 'Морской аккорд, апельсин, мандарин, альдегиды, кедр, нероли, черный перец, ветивер, бобы тонка',
    bestOccasion: 'Круглый год (Камертон): офис, спорт, прогулка, универсальный дневной протокол',
    whyFitsOutfit: 'Внесезонный морской универсал (Allure Homme Sport vibe): безупречен с синим блейзером, поло или белой футболкой.',
    colorTheme: 'from-blue-600 to-sky-800',
    pyramid: {
      top: ['Морской аккорд', 'Апельсин', 'Мандарин', 'Альдегиды'],
      heart: ['Кедр', 'Нероли', 'Черный перец', 'Ветивер'],
      base: ['Бобы тонка', 'Белая амбра', 'Ваниль', 'Мускус']
    }
  },
  {
    id: 'sergio-nero-admiral-andreevsky-flag',
    name: 'Адмиралъ: Андреевский флаг',
    brand: 'Sergio Nero',
    xCoord: -0.45,
    yCoord: 0.50,
    diffusion: 'Умеренная',
    dominantVibe: 'Грейпфрут, мандарин, бергамот, черный перец, кардамон, лаванда, кедр, ветивер',
    bestOccasion: 'Офис, деловые встречи, утренние совещания, жесткий рацио-фокус',
    whyFitsOutfit: 'Сухой цитрусово-пряный фужер с офицерской дисциплиной: идеально сидит под накрахмаленную сорочку и строгий костюм.',
    colorTheme: 'from-sky-700 to-indigo-950',
    pyramid: {
      top: ['Грейпфрут', 'Мандарин', 'Бергамот'],
      heart: ['Черный перец', 'Кардамон', 'Лаванда'],
      base: ['Кедр', 'Ветивер', 'Пряные древесные аккорды']
    }
  },
  {
    id: 'sergio-nero-admiral-arktika',
    name: 'Адмиралъ: Арктика',
    brand: 'Sergio Nero',
    xCoord: 0.40,
    yCoord: 0.80,
    diffusion: 'Шлейфовая',
    dominantVibe: 'Ледяной лайм, бергамот, зеленые ноты, эвкалипт, кардамон, сосновая хвоя, белый кедр',
    bestOccasion: 'Летний зной +30°C, спорт, активный отдых, ледяная свежесть',
    whyFitsOutfit: 'Морозный хвойно-эвкалиптовый бриз: лучший выбор под льняную светлую одежду, шорты и белые кеды в раскаленном городе.',
    colorTheme: 'from-cyan-400 to-teal-700',
    pyramid: {
      top: ['Лайм', 'Бергамот', 'Зеленые ноты'],
      heart: ['Эвкалипт', 'Кардамон'],
      base: ['Хвоя сосны', 'Белый кедр']
    }
  },
  {
    id: 'sergio-nero-admiral-zheleznaya-volya',
    name: 'Адмиралъ: Железная воля',
    brand: 'Sergio Nero',
    xCoord: 0.65,
    yCoord: -0.70,
    diffusion: 'Ударная',
    dominantVibe: 'Листья табака, пряности, ваниль, какао, бобы тонка, цветок табака, сухофрукты',
    bestOccasion: 'Зимний вечер, свидание, ресторан, уютный бар, морозная ночь',
    whyFitsOutfit: 'Согревающий табачно-ванильный восток (Tobacco Vanille vibe): великолепен с кашемировым свитером, пальто и кожаной курткой.',
    colorTheme: 'from-amber-700 to-stone-900',
    pyramid: {
      top: ['Листья табака', 'Пряные ноты'],
      heart: ['Ваниль', 'Какао', 'Бобы тонка', 'Цветок табака'],
      base: ['Сухофрукты', 'Древесные ноты']
    }
  },
  {
    id: 'sergio-nero-admiral-patriot',
    name: 'Адмиралъ: Патриот',
    brand: 'Sergio Nero',
    xCoord: -0.65,
    yCoord: -0.60,
    diffusion: 'Шлейфовая',
    dominantVibe: 'Красное дерево, лаванда, шалфей, бергамот, герань, роза, пачули, кедр, сандал, янтарь',
    bestOccasion: 'Вечерний протокол, торжественные приемы, темный костюм, статусная дистанция',
    whyFitsOutfit: 'Плотный ориентально-древесный силуэт: требует темного шерстяного пальто, классического пиджака и статусных аксессуаров.',
    colorTheme: 'from-red-950 via-slate-900 to-black',
    pyramid: {
      top: ['Лаванда', 'Шалфей', 'Бергамот', 'Красное дерево'],
      heart: ['Герань', 'Роза', 'Ландыш', 'Жасмин'],
      base: ['Пачули', 'Кедр', 'Ваниль', 'Сандал', 'Янтарь']
    }
  },
  {
    id: 'sergio-nero-admiral-posledniy-geroy',
    name: 'Адмиралъ: Последний герой',
    brand: 'Sergio Nero',
    xCoord: 0.35,
    yCoord: -0.20,
    diffusion: 'Шлейфовая',
    dominantVibe: 'Спелое яблоко, слива, корица, гвоздика, красное дерево, ваниль, сандал, кедр',
    bestOccasion: 'Осень, дождливый октябрь, кофейня, встречи с друзьями, мягкий трикотаж',
    whyFitsOutfit: 'Уютный яблочно-коричный древесный шлейф (Boss Bottled vibe): идеален с замшевой курткой, фланелевой рубашкой и джинсами.',
    colorTheme: 'from-amber-600 to-orange-950',
    pyramid: {
      top: ['Яблоко', 'Слива', 'Бергамот', 'Лимон'],
      heart: ['Корица', 'Гвоздика', 'Красное дерево'],
      base: ['Ваниль', 'Сандал', 'Ветивер', 'Кедр']
    }
  },
  {
    id: 'sergio-nero-admiral-rossiyskiy-flot',
    name: 'Адмиралъ: Российский флот',
    brand: 'Sergio Nero',
    xCoord: -0.40,
    yCoord: -0.10,
    diffusion: 'Шлейфовая',
    dominantVibe: 'Грейпфрут, лимон, розовый перец, имбирь, мята, мускатный орех, темный ладан, кедр',
    bestOccasion: 'Прохладная погода, межсезонье, офис, деловой блейзер, морской характер',
    whyFitsOutfit: 'Глубокий древесно-цитрусовый смолистый аккорд (Bleu de Chanel vibe): солиден, дисциплинирован и устойчив к ветру.',
    colorTheme: 'from-blue-900 via-slate-900 to-indigo-950',
    pyramid: {
      top: ['Грейпфрут', 'Лимон', 'Розовый перец'],
      heart: ['Имбирь', 'Мускатный орех', 'Мята'],
      base: ['Кедр', 'Жасмин', 'Ладан']
    }
  },
  {
    id: 'sergio-nero-admiral-russkiy-harakter',
    name: 'Адмиралъ: Русский Характер',
    brand: 'Sergio Nero',
    xCoord: -0.05,
    yCoord: 0.45,
    diffusion: 'Умеренная',
    dominantVibe: 'Зеленый чай, грейпфрут, лаванда, шалфей, розмарин, ветивер, кедр, дубовый мох',
    bestOccasion: 'Весеннее пробуждение, утренний город, прогулки на свежем воздухе',
    whyFitsOutfit: 'Интеллектуальный травяной фужер с зеленым чаем: прекрасно сочетается со светлым трикотажем, поло и хлопковыми брюками.',
    colorTheme: 'from-emerald-600 to-teal-900',
    pyramid: {
      top: ['Грейпфрут', 'Зеленый чай', 'Лаванда'],
      heart: ['Шалфей', 'Герань', 'Розмарин', 'Ветивер', 'Кедр', 'Бергамот'],
      base: ['Дубовый мох', 'Мускус', 'Ваниль']
    }
  },
  {
    id: 'sergio-nero-admiral-triumf',
    name: 'Адмиралъ: Триумф',
    brand: 'Sergio Nero',
    xCoord: 0.45,
    yCoord: 0.15,
    diffusion: 'Шлейфовая',
    dominantVibe: 'Калабрийский бергамот, сычуаньский перец, лаванда, амброксан, кедр, элеми',
    bestOccasion: 'Динамичный день, город, открытые террасы, вечерний драйв',
    whyFitsOutfit: 'Сверхдиффузный минерально-бергамотовый фужер (Dior Sauvage vibe): создает притягательную ауру уверенности в любой неформальной обстановке.',
    colorTheme: 'from-indigo-600 via-blue-800 to-slate-950',
    pyramid: {
      top: ['Калабрийский бергамот', 'Сычуаньский перец'],
      heart: ['Лаванда', 'Розовый перец', 'Ветивер', 'Пачули', 'Герань', 'Элеми'],
      base: ['Амброксан', 'Белый кедр', 'Лабданум']
    }
  },
  {
    id: 'sergio-nero-scan-your-life-silver',
    name: 'Scan Your Life Silver',
    brand: 'Sergio Nero',
    xCoord: 0.45,
    yCoord: 0.55,
    diffusion: 'Шлейфовая',
    dominantVibe: 'Морские ноты, грейпфрут, мандарин, лавровый лист, жасмин, серая амбра, гуаяк, пачули',
    bestOccasion: 'Лето, спортзал, активные встречи, драйвовый молодежный стиль',
    whyFitsOutfit: 'Победоносный акватически-амбровый шлейф (Invictus vibe): отлично сидит со спортивным худи, белыми кроссовками и бомбером.',
    colorTheme: 'from-slate-400 via-cyan-600 to-slate-900',
    pyramid: {
      top: ['Грейпфрут', 'Мандарин', 'Морские ноты'],
      heart: ['Лавровый лист', 'Жасмин'],
      base: ['Серая амбра', 'Дерево гуаяк', 'Дубовый мох', 'Пачули']
    }
  },
];

// Готовые капсульные пресеты для быстрого старта пользователя
export const SHELF_PRESETS: ShelfPreset[] = [
  {
    id: 'my-personal-collection',
    name: 'Моя коллекция (57)',
    description: 'Персональная коллекция владельца: 57 флаконов, включая полную серию «Адмиралъ», Scan Your Life Silver и Prime Minister Action Décisive.',
    perfumeIds: [
      '4711-eau-de-cologne',
      'abercrombie-first-instinct',
      'al-haramain-detour-noir',
      'antonio-banderas-blue-seduction',
      'armaf-club-de-nuit-intense',
      'bleu-de-chanel-edp',
      'dior-fahrenheit',
      'dior-sauvage',
      'guess-1981-los-angeles',
      'hugo-boss-boss-bottled',
      'lattafa-al-nashama-caprice',
      'lattafa-ansaam-silver',
      'lattafa-asad',
      'lattafa-badee-al-oud-honor-glory',
      'lattafa-emeer',
      'lattafa-khamrah',
      'lattafa-qaed-al-fursan',
      'lattafa-ramz-silver',
      'lattafa-fakhr-black',
      'lattafa-najdia',
      'lattafa-al-qiam-silver',
      'loewe-solo-cedro',
      'maison-alhambra-alpine-homme-sport',
      'moschino-toy-boy',
      'pendora-scents-the-dream-catcher',
      'versace-blue-jeans',
      'versace-dylan-blue-edt',
      'versace-eros',
      'versace-l-homme-1984',
      'versace-man-eau-fraiche',
      'versace-pour-homme',
      'versace-the-dreamer',
      'dior-eau-sauvage',
      'guy-laroche-drakkar-noir',
      'acqua-di-gio',
      'jpg-le-male',
      'terre-dhermes',
      'davidoff-cool-water',
      'nautica-voyage',
      'bentley-for-men-intense',
      'salvatore-ferragamo-f-by-ferragamo',
      'armani-code',
      'viktor-rolf-spicebomb',
      'mancera-cedrat-boise',
      'maison-alhambra-opulence-leather',
      'fragrance-world-woody-oud',
      'prime-minister-action-decisive',
      'sergio-nero-admiral-classic',
      'sergio-nero-admiral-andreevsky-flag',
      'sergio-nero-admiral-arktika',
      'sergio-nero-admiral-zheleznaya-volya',
      'sergio-nero-admiral-patriot',
      'sergio-nero-admiral-posledniy-geroy',
      'sergio-nero-admiral-rossiyskiy-flot',
      'sergio-nero-admiral-russkiy-harakter',
      'sergio-nero-admiral-triumf',
      'sergio-nero-scan-your-life-silver',
    ],
  },
  {
    id: 'russian-admiral-collection',
    name: 'Русская коллекция: Sergio Nero & Prime Minister',
    description: 'Полная серия «Адмиралъ» (9 флаконов) + Scan Your Life Silver + Prime Minister Action Décisive.',
    perfumeIds: [
      'prime-minister-action-decisive',
      'sergio-nero-admiral-classic',
      'sergio-nero-admiral-andreevsky-flag',
      'sergio-nero-admiral-arktika',
      'sergio-nero-admiral-zheleznaya-volya',
      'sergio-nero-admiral-patriot',
      'sergio-nero-admiral-posledniy-geroy',
      'sergio-nero-admiral-rossiyskiy-flot',
      'sergio-nero-admiral-russkiy-harakter',
      'sergio-nero-admiral-triumf',
      'sergio-nero-scan-your-life-silver',
    ],
  },
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

