import { PerfumeItem, WardrobeItem, AnyanovCoordinates } from '../types';
import { PERFUME_DATABASE } from './fragrances';
import { WARDROBE_ITEMS } from './wardrobeItems';

// ============================================================================
// ЗЕРКАЛО ДУХОВ: ПЕРИОДИЧЕСКАЯ ТАБЛИЦА МУЖСКИХ АРОМАТОВ (21 ЯКОРЬ)
// Архитектура: 1 Камертон Баланса (0,0) + 4 Осевых Полюса + 16 Квадрантных Якорей
// ============================================================================
export const GOLDEN_PERFUME_IDS_21: string[] = [
  // 1. ЦЕНТР (0, 0): Точка абсолютного баланса
  'bleu-de-chanel-edp',

  // 2. ОСЕВЫЕ ПОЛЮСА (Кардинальные реперы координатной сетки)
  '4711-eau-de-cologne',      // Север (+Y: Зенит летучести, день, лето)
  'tom-ford-tuscan-leather',  // Юг (-Y: Надир плотности, вечер, зима)
  'chanel-platinum-egoiste',  // Запад (-X: Барьер, дистанция, субординация)
  'jpg-ultra-male',           // Восток (+X: Сближение, контакт, призыв)

  // 3. КВАДРАНТ I: (+X, +Y) ЛЕГКОСТЬ (4 аромата)
  'versace-man-eau-fraiche',  // (+0.35, +0.75)
  'acqua-di-gio',             // (+0.70, +0.75)
  'dior-sauvage',             // (+0.35, +0.35)
  'dior-homme-cologne',       // (+0.70, +0.35)

  // 4. КВАДРАНТ II: (-X, +Y) СОБРАННОСТЬ (4 аромата)
  'dior-eau-sauvage',         // (-0.70, +0.75)
  'prada-lhomme',             // (-0.35, +0.75)
  'paco-rabanne-pour-homme',   // (-0.70, +0.35)
  'ysl-lhomme',               // (-0.35, +0.35)

  // 5. КВАДРАНТ III: (-X, -Y) ВЛАСТЬ (4 аромата)
  'terre-dhermes',            // (-0.70, -0.35)
  'guy-laroche-drakkar-noir', // (-0.35, -0.35)
  'dior-homme-intense',       // (-0.70, -0.75)
  'versace-oud-noir',         // (-0.35, -0.75)

  // 6. КВАДРАНТ IV: (+X, -Y) ПРИТЯЖЕНИЕ (4 аромата)
  'creed-aventus',            // (+0.35, -0.35)
  'versace-eros',             // (+0.70, -0.35)
  'jpg-le-male',              // (+0.35, -0.75)
  'lattafa-khamrah',          // (+0.70, -0.75)
];

export const GOLDEN_PERFUMES_21: PerfumeItem[] = GOLDEN_PERFUME_IDS_21
  .map(id => PERFUME_DATABASE.find(p => p.id === id))
  .filter((p): p is PerfumeItem => Boolean(p));

// 21 ЭТАЛОННЫЙ ПРЕДМЕТ ГАРДЕРОБА:
// Формула капсулы: 5 (L4 Верх) + 7 (L3 Торс) + 5 (L2 Ноги) + 4 (L1 Обувь) = 21 предмет
export const GOLDEN_WARDROBE_IDS_21: string[] = [
  // L4: Верхний слой (5 единиц)
  'l4-navy-suit-jacket',
  'l4-charcoal-overcoat',
  'l4-hopsack-blazer',
  'l4-camel-coat',
  'l4-suede-overshirt',

  // L3: Торс (7 единиц)
  'l3-white-formal-shirt',
  'l3-blue-oxford-shirt',
  'l3-cashmere-turtleneck',
  'l3-merino-crewneck',
  'l3-white-linen-shirt',
  'l3-navy-polo',
  'l3-heavy-white-tee',

  // L2: Ноги (5 единиц)
  'l2-wool-suit-trousers',
  'l2-flannel-trousers',
  'l2-beige-chinos',
  'l2-linen-trousers',
  'l2-dark-selvedge-denim',

  // L1: Обувь (4 единицы)
  'l1-oxford-shoes',
  'l1-suede-loafers',
  'l1-leather-derby',
  'l1-clean-white-sneakers'
];

export const GOLDEN_WARDROBE_21: WardrobeItem[] = GOLDEN_WARDROBE_IDS_21
  .map(id => WARDROBE_ITEMS.find(w => w.id === id))
  .filter((w): w is WardrobeItem => Boolean(w));

// ============================================================================
// ПЕРИОДИЧЕСКАЯ ТАБЛИЦА ОДЕЖДЫ АНЬЯНОВА: 21 ЭЛЕМЕНТ (СИМВОЛЫ МЕНДЕЛЕЕВА)
// 4 Периода (Слои L1-L4) x 5 Групп (Степени формальности от Casual до Formal)
// ============================================================================
export interface PeriodicWardrobeElement {
  number: number;
  symbol: string;
  name: string;
  layer: 'L1' | 'L2' | 'L3' | 'L4';
  group: 'I' | 'II' | 'III' | 'IV' | 'V';
  groupLabel: string;
  formalIndex: number;
  color: string;
  colorName: string;
  fabric: string;
  vibe: string;
  isCore?: boolean;
}

export const PERIODIC_WARDROBE_ELEMENTS_21: PeriodicWardrobeElement[] = [
  // Период I: L1 Обувь
  { number: 1, symbol: 'Sn', name: 'Белые кеды', layer: 'L1', group: 'I', groupLabel: 'Casual', formalIndex: 1.0, color: '#ffffff', colorName: 'Белый', fabric: 'Кожа', vibe: 'Легкость, комфорт' },
  { number: 2, symbol: 'Lf', name: 'Лоферы', layer: 'L1', group: 'III', groupLabel: 'Smart/Business Casual', formalIndex: 2.0, color: '#78350f', colorName: 'Шоколадный', fabric: 'Замша/Кожа', vibe: 'Баланс, стиль', isCore: true },
  { number: 3, symbol: 'Ox', name: 'Оксфорды', layer: 'L1', group: 'IV', groupLabel: 'Business Formal / Протокол', formalIndex: 3.0, color: '#0f172a', colorName: 'Черный', fabric: 'Глянцевая кожа', vibe: 'Протокол, статус' },

  // Период II: L2 Брюки
  { number: 4, symbol: 'Sl', name: 'Слаксы', layer: 'L2', group: 'I', groupLabel: 'Casual Light', formalIndex: 1.0, color: '#e2e8f0', colorName: 'Светло-серый', fabric: 'Хлопок', vibe: 'Свобода' },
  { number: 5, symbol: 'Jn', name: 'Джинсы', layer: 'L2', group: 'II', groupLabel: 'Casual City', formalIndex: 1.4, color: '#1d4ed8', colorName: 'Индиго', fabric: 'Селвидж деним', vibe: 'Динамика' },
  { number: 6, symbol: 'Ch', name: 'Чиносы беж', layer: 'L2', group: 'III', groupLabel: 'Smart Casual', formalIndex: 2.0, color: '#d97706', colorName: 'Бежевый', fabric: 'Хлопковый твил', vibe: 'Ядро баланса', isCore: true },
  { number: 7, symbol: 'Np', name: 'Непарные брюки', layer: 'L2', group: 'III', groupLabel: 'Office Smart', formalIndex: 2.3, color: '#475569', colorName: 'Серо-стальной', fabric: 'Хлопок-шерсть', vibe: 'Деловой силуэт' },
  { number: 8, symbol: 'Wp', name: 'Шерстяные брюки Navy', layer: 'L2', group: 'IV', groupLabel: 'Business Formal', formalIndex: 2.8, color: '#1e293b', colorName: 'Темно-синий', fabric: 'Шерсть со стрелкой', vibe: 'Дисциплина' },
  { number: 9, symbol: 'Wc', name: 'Костюмные брюки серые', layer: 'L2', group: 'V', groupLabel: 'Night Formal (Вечерний вес)', formalIndex: 3.0, color: '#334155', colorName: 'Графитовый', fabric: 'Костюмная шерсть', vibe: 'Вечерний вес' },

  // Период III: L3 Торс
  { number: 10, symbol: 'Ts', name: 'Белая футболка', layer: 'L3', group: 'I', groupLabel: 'Casual Light', formalIndex: 1.0, color: '#ffffff', colorName: 'Белый', fabric: 'Хлопок 240г', vibe: 'Базовая чистота' },
  { number: 11, symbol: 'Pl', name: 'Вязаное поло', layer: 'L3', group: 'II', groupLabel: 'Smart Casual', formalIndex: 1.6, color: '#0f766e', colorName: 'Морской/кедр', fabric: 'Мерсеризованный хлопок', vibe: 'Тактильность' },
  { number: 12, symbol: 'Of', name: 'Рубашка Оксфорд', layer: 'L3', group: 'III', groupLabel: 'Business Casual', formalIndex: 2.0, color: '#60a5fa', colorName: 'Голубой', fabric: 'Оксфорд хлопок', vibe: 'Универсал', isCore: true },
  { number: 13, symbol: 'St', name: 'Рубашка в полоску', layer: 'L3', group: 'III', groupLabel: 'Smart/Office', formalIndex: 2.4, color: '#3b82f6', colorName: 'Синяя полоса', fabric: 'Поплин', vibe: 'Ритм и уверенность' },
  { number: 14, symbol: 'Sh', name: 'Белая сорочка + галстук', layer: 'L3', group: 'IV', groupLabel: 'Business Formal', formalIndex: 3.0, color: '#ffffff', colorName: 'Белый + бордо', fabric: 'Поплин Super 140s', vibe: 'Протокол' },
  { number: 15, symbol: 'Sg', name: 'Голубая сорочка + галстук', layer: 'L3', group: 'IV', groupLabel: 'Formal', formalIndex: 2.9, color: '#93c5fd', colorName: 'Голубой + изумруд', fabric: 'Твил', vibe: 'Аристократизм' },

  // Период IV: L4 Верх
  { number: 16, symbol: 'Jk', name: 'Джинсовая куртка', layer: 'L4', group: 'I', groupLabel: 'Casual Light', formalIndex: 1.0, color: '#2563eb', colorName: 'Индиго', fabric: 'Деним', vibe: 'Свобода' },
  { number: 17, symbol: 'Bm', name: 'Бомбер', layer: 'L4', group: 'II', groupLabel: 'Casual City', formalIndex: 1.3, color: '#1e293b', colorName: 'Черный/Navy', fabric: 'Нейлон', vibe: 'Динамика' },
  { number: 18, symbol: 'Bz', name: 'Блейзер Navy', layer: 'L4', group: 'III', groupLabel: 'Smart/Business Casual', formalIndex: 2.0, color: '#1e3a8a', colorName: 'Navy', fabric: 'Hopsack шерсть', vibe: 'Ядро гардероба', isCore: true },
  { number: 19, symbol: 'Nj', name: 'Непарный серый пиджак', layer: 'L4', group: 'III', groupLabel: 'Smart/Office', formalIndex: 2.4, color: '#475569', colorName: 'Серый меланж', fabric: 'Фланель', vibe: 'Интеллект' },
  { number: 20, symbol: 'Sj', name: 'Костюмный пиджак Navy', layer: 'L4', group: 'IV', groupLabel: 'Business Formal', formalIndex: 2.8, color: '#0f172a', colorName: 'Глубокий Navy', fabric: 'Шерсть Super 130s', vibe: 'Власть' },
  { number: 21, symbol: 'Sc', name: 'Костюмный пиджак серый', layer: 'L4', group: 'V', groupLabel: 'Night Formal', formalIndex: 3.0, color: '#18181b', colorName: 'Графит / Вечерний', fabric: 'Шерсть/Шелк', vibe: 'Монумент' },
];

export interface GoldenMirrorPair {
  perfumeId: string;
  outfitName: string;
  quadrantCode: 'NW_FOCUS' | 'NE_EASE' | 'SW_POWER' | 'SE_SEDUCTION' | 'CENTER';
  periodicRole: 'center' | 'north' | 'south' | 'west' | 'east' | 'q1' | 'q2' | 'q3' | 'q4';
  quadrantName: string;
  badge: string;
  releaseYear?: number;
  suggestedOutfit: {
    l4Id?: string;
    l3Id: string;
    l2Id: string;
    l1Id: string;
  };
  mirrorExplanation: string;
  idealCoords: AnyanovCoordinates;
}

export const GOLDEN_MIRROR_PAIRS_21: GoldenMirrorPair[] = [
  // =========================================================================
  // 1. ЦЕНТР (0, 0): ТОЧКА АБСОЛЮТНОГО БАЛАНСА
  // =========================================================================
  {
    perfumeId: 'bleu-de-chanel-edp',
    outfitName: '«Синий Камертон»',
    quadrantCode: 'CENTER',
    periodicRole: 'center',
    quadrantName: 'Центр • Равновесие',
    badge: 'Камертон (0, 0)',
    releaseYear: 2010,
    suggestedOutfit: {
      l4Id: 'l4-hopsack-blazer',
      l3Id: 'l3-blue-oxford-shirt',
      l2Id: 'l2-beige-chinos',
      l1Id: 'l1-leather-derby'
    },
    mirrorExplanation: 'Абсолютный камертон Системы Аньянова. Цитрус, кедр и ладан адаптируются под любой дресс-код, удерживая нейтральную дистанцию.',
    idealCoords: { socialX: 0.0, thermoY: 0.0, formalIndex: 2, temperatureC: 20 }
  },

  // =========================================================================
  // 2. СЕВЕР (+Y): ЗЕНИТ ЛЕТУЧЕСТИ
  // =========================================================================
  {
    perfumeId: '4711-eau-de-cologne',
    outfitName: '«Белый Зенит»',
    quadrantCode: 'CENTER',
    periodicRole: 'north',
    quadrantName: 'Северный Полюс • Зенит Летучести',
    badge: 'Зенит Летучести',
    releaseYear: 1792,
    suggestedOutfit: {
      l3Id: 'l3-white-linen-shirt',
      l2Id: 'l2-linen-trousers',
      l1Id: 'l1-suede-loafers'
    },
    mirrorExplanation: 'Абсолютный цитрусово-неролиевый зенит 1792 года. Воздушный итальянский лен и открытые щиколотки дают максимальную вентиляцию в зной.',
    idealCoords: { socialX: 0.00, thermoY: 0.90, formalIndex: 1, temperatureC: 30 }
  },

  // =========================================================================
  // 3. ЮГ (-Y): НАДИР ПЛОТНОСТИ
  // =========================================================================
  {
    perfumeId: 'tom-ford-tuscan-leather',
    outfitName: '«Тёмный Надир»',
    quadrantCode: 'CENTER',
    periodicRole: 'south',
    quadrantName: 'Южный Полюс • Надир Плотности',
    badge: 'Надир Плотности',
    releaseYear: 2007,
    suggestedOutfit: {
      l4Id: 'l4-charcoal-overcoat',
      l3Id: 'l3-cashmere-turtleneck',
      l2Id: 'l2-flannel-trousers',
      l1Id: 'l1-oxford-shoes'
    },
    mirrorExplanation: 'Точка максимальной молекулярной массы надир. Тяжелая дубленая кожа, малина и олибанум требуют максимального веса тяжелого сукна и кашемира.',
    idealCoords: { socialX: 0.00, thermoY: -0.85, formalIndex: 3, temperatureC: 0 }
  },

  // =========================================================================
  // 4. ЗАПАД (-X): АБСОЛЮТНЫЙ БАРЬЕР
  // =========================================================================
  {
    perfumeId: 'chanel-platinum-egoiste',
    outfitName: '«Холодный Барьер»',
    quadrantCode: 'CENTER',
    periodicRole: 'west',
    quadrantName: 'Западный Полюс • Металлический Барьер',
    badge: 'Абсолютный Барьер',
    releaseYear: 1993,
    suggestedOutfit: {
      l4Id: 'l4-navy-suit-jacket',
      l3Id: 'l3-white-formal-shirt',
      l2Id: 'l2-wool-suit-trousers',
      l1Id: 'l1-oxford-shoes'
    },
    mirrorExplanation: 'Холодная металлическая лаванда и розмарин служат непроницаемым протокольным замком, подчеркивая архитектуру строгих плеч костюма.',
    idealCoords: { socialX: -0.95, thermoY: 0.00, formalIndex: 3, temperatureC: 18 }
  },

  // =========================================================================
  // 5. ВОСТОК (+X): АБСОЛЮТНЫЙ КОНТАКТ
  // =========================================================================
  {
    perfumeId: 'jpg-ultra-male',
    outfitName: '«Неоновый Магнит»',
    quadrantCode: 'CENTER',
    periodicRole: 'east',
    quadrantName: 'Восточный Полюс • Магнит Контакта',
    badge: 'Максимальный Контакт',
    releaseYear: 2015,
    suggestedOutfit: {
      l4Id: 'l4-suede-overshirt',
      l3Id: 'l3-heavy-white-tee',
      l2Id: 'l2-dark-selvedge-denim',
      l1Id: 'l1-suede-loafers'
    },
    mirrorExplanation: 'Сочная черная груша, корица и ваниль — максимальный магнит притяжения, требующий мягкой замши и непринужденного денима.',
    idealCoords: { socialX: 0.95, thermoY: 0.00, formalIndex: 1, temperatureC: 19 }
  },

  // =========================================================================
  // 6. КВАДРАНТ I: (+X, +Y) ОТКРЫТАЯ СВЕЖЕСТЬ
  // =========================================================================
  {
    perfumeId: 'versace-man-eau-fraiche',
    outfitName: '«Ривьера»',
    quadrantCode: 'NE_EASE',
    periodicRole: 'q1',
    quadrantName: 'Квадрант I • Легкость',
    badge: 'Курортный Бриз',
    releaseYear: 2006,
    suggestedOutfit: {
      l3Id: 'l3-navy-polo',
      l2Id: 'l2-beige-chinos',
      l1Id: 'l1-clean-white-sneakers'
    },
    mirrorExplanation: 'Искристая карамбола и белый лимон создают легкий средиземноморский позитив в дуэте с темно-синим поло и хлопковым твилом чинос.',
    idealCoords: { socialX: 0.35, thermoY: 0.75, formalIndex: 1, temperatureC: 27 }
  },
  {
    perfumeId: 'acqua-di-gio',
    outfitName: '«Океанский Бриз»',
    quadrantCode: 'NE_EASE',
    periodicRole: 'q1',
    quadrantName: 'Квадрант I • Легкость',
    badge: 'Эталон Акватики',
    releaseYear: 1996,
    suggestedOutfit: {
      l3Id: 'l3-white-linen-shirt',
      l2Id: 'l2-linen-trousers',
      l1Id: 'l1-suede-loafers'
    },
    mirrorExplanation: 'Великая морская акватика Альберто Морильяса: калон, жасмин и морской бриз в совершенной гармонии с летящим итальянским льном.',
    idealCoords: { socialX: 0.70, thermoY: 0.75, formalIndex: 1, temperatureC: 28 }
  },
  {
    perfumeId: 'dior-sauvage',
    outfitName: '«Городской Драйв»',
    quadrantCode: 'NE_EASE',
    periodicRole: 'q1',
    quadrantName: 'Квадрант I • Легкость',
    badge: 'Мега-Проекция',
    releaseYear: 2015,
    suggestedOutfit: {
      l3Id: 'l3-heavy-white-tee',
      l2Id: 'l2-dark-selvedge-denim',
      l1Id: 'l1-clean-white-sneakers'
    },
    mirrorExplanation: 'Бергамот и мощный диффузный амброксан образуют современный городской дуэт с плотной футболкой 240 г/м² и фактурным японским денимом.',
    idealCoords: { socialX: 0.35, thermoY: 0.35, formalIndex: 1, temperatureC: 22 }
  },
  {
    perfumeId: 'dior-homme-cologne',
    outfitName: '«Белый Хлопок»',
    quadrantCode: 'NE_EASE',
    periodicRole: 'q1',
    quadrantName: 'Квадрант I • Легкость',
    badge: 'Ледяной Хлопок',
    releaseYear: 2013,
    suggestedOutfit: {
      l3Id: 'l3-heavy-white-tee',
      l2Id: 'l2-linen-trousers',
      l1Id: 'l1-clean-white-sneakers'
    },
    mirrorExplanation: 'Бергамотовый сорбет и белый мускус пахнут хрустящей выстиранной белой футболкой, высушенной на альпийском ветру.',
    idealCoords: { socialX: 0.70, thermoY: 0.35, formalIndex: 1, temperatureC: 26 }
  },

  // =========================================================================
  // 7. КВАДРАНТ II: (-X, +Y) ХОЛОДНЫЙ КОНТРОЛЬ
  // =========================================================================
  {
    perfumeId: 'dior-eau-sauvage',
    outfitName: '«Протокол»',
    quadrantCode: 'NW_FOCUS',
    periodicRole: 'q2',
    quadrantName: 'Квадрант II • Собранность',
    badge: 'Аристократичный Шипр',
    releaseYear: 1966,
    suggestedOutfit: {
      l4Id: 'l4-hopsack-blazer',
      l3Id: 'l3-white-formal-shirt',
      l2Id: 'l2-beige-chinos',
      l1Id: 'l1-leather-derby'
    },
    mirrorExplanation: 'Исторический гедионовый цитрус и розмарин Эдмона Рудницка — аристократичный летний протокол под фактурный блейзер Hopsack.',
    idealCoords: { socialX: -0.70, thermoY: 0.75, formalIndex: 2, temperatureC: 24 }
  },
  {
    perfumeId: 'prada-lhomme',
    outfitName: '«Белый Воротник»',
    quadrantCode: 'NW_FOCUS',
    periodicRole: 'q2',
    quadrantName: 'Квадрант II • Собранность',
    badge: 'Офисная Дипломатия',
    releaseYear: 2016,
    suggestedOutfit: {
      l4Id: 'l4-navy-suit-jacket',
      l3Id: 'l3-white-formal-shirt',
      l2Id: 'l2-wool-suit-trousers',
      l1Id: 'l1-oxford-shoes'
    },
    mirrorExplanation: 'Ирис и нероли резонируют со стерильным поплином сорочки, создавая безупречную ауру надежности, чистоты и самоконтроля.',
    idealCoords: { socialX: -0.35, thermoY: 0.75, formalIndex: 3, temperatureC: 22 }
  },
  {
    perfumeId: 'paco-rabanne-pour-homme',
    outfitName: '«Стальной Дипломат»',
    quadrantCode: 'NW_FOCUS',
    periodicRole: 'q2',
    quadrantName: 'Квадрант II • Собранность',
    badge: 'Барбершоп 70-х',
    releaseYear: 1973,
    suggestedOutfit: {
      l4Id: 'l4-hopsack-blazer',
      l3Id: 'l3-blue-oxford-shirt',
      l2Id: 'l2-flannel-trousers',
      l1Id: 'l1-leather-derby'
    },
    mirrorExplanation: 'Зеленый лавандово-мшистый фужер ставит четкую границу субординации, идеально дополняя оксфордский хлопок и плотную фланель.',
    idealCoords: { socialX: -0.70, thermoY: 0.35, formalIndex: 2, temperatureC: 18 }
  },
  {
    perfumeId: 'ysl-lhomme',
    outfitName: '«Аналитик»',
    quadrantCode: 'NW_FOCUS',
    periodicRole: 'q2',
    quadrantName: 'Квадрант II • Собранность',
    badge: 'Деловой Этикет',
    releaseYear: 2006,
    suggestedOutfit: {
      l3Id: 'l3-blue-oxford-shirt',
      l2Id: 'l2-beige-chinos',
      l1Id: 'l1-leather-derby'
    },
    mirrorExplanation: 'Свежий имбирь, белый перец и кедр создают тактичный, безопасный и ультра-профессиональный деловой шлейф без лишней дистанции.',
    idealCoords: { socialX: -0.35, thermoY: 0.35, formalIndex: 2, temperatureC: 20 }
  },

  // =========================================================================
  // 8. КВАДРАНТ III: (-X, -Y) ТЕМНЫЙ СТАТУС
  // =========================================================================
  {
    perfumeId: 'terre-dhermes',
    outfitName: '«Минеральный Титан»',
    quadrantCode: 'SW_POWER',
    periodicRole: 'q3',
    quadrantName: 'Квадрант III • Власть',
    badge: 'Минеральный Кремень',
    releaseYear: 2006,
    suggestedOutfit: {
      l4Id: 'l4-hopsack-blazer',
      l3Id: 'l3-merino-crewneck',
      l2Id: 'l2-flannel-trousers',
      l1Id: 'l1-leather-derby'
    },
    mirrorExplanation: 'Кремень, горький апельсин и ветивер образуют монументальный интеллектуальный стержень с фактурной шерстью и мериносом.',
    idealCoords: { socialX: -0.70, thermoY: -0.35, formalIndex: 2, temperatureC: 14 }
  },
  {
    perfumeId: 'guy-laroche-drakkar-noir',
    outfitName: '«Тень Нуара»',
    quadrantCode: 'SW_POWER',
    periodicRole: 'q3',
    quadrantName: 'Квадрант III • Власть',
    badge: 'Пауэрхаус 80-х',
    releaseYear: 1982,
    suggestedOutfit: {
      l4Id: 'l4-charcoal-overcoat',
      l3Id: 'l3-blue-oxford-shirt',
      l2Id: 'l2-dark-selvedge-denim',
      l1Id: 'l1-leather-derby'
    },
    mirrorExplanation: 'Полынь, хвоя, лаванда и кожаный аккорд возрождают классическую маскулинную силу 80-х в плотных слоях осенней одежды.',
    idealCoords: { socialX: -0.35, thermoY: -0.35, formalIndex: 2, temperatureC: 12 }
  },
  {
    perfumeId: 'dior-homme-intense',
    outfitName: '«Гранд-Опера»',
    quadrantCode: 'SW_POWER',
    periodicRole: 'q3',
    quadrantName: 'Квадрант III • Власть',
    badge: 'Вечерний Смокинг',
    releaseYear: 2007,
    suggestedOutfit: {
      l4Id: 'l4-camel-coat',
      l3Id: 'l3-cashmere-turtleneck',
      l2Id: 'l2-flannel-trousers',
      l1Id: 'l1-oxford-shoes'
    },
    mirrorExplanation: 'Пудровый тосканский ирис, амбретта и виргинский кедр создают кинематографичный вечерний образ с мягким кашемиром и верблюжьей шерстью.',
    idealCoords: { socialX: -0.70, thermoY: -0.75, formalIndex: 3, temperatureC: 8 }
  },
  {
    perfumeId: 'versace-oud-noir',
    outfitName: '«Чёрный Кардинал»',
    quadrantCode: 'SW_POWER',
    periodicRole: 'q3',
    quadrantName: 'Квадрант III • Власть',
    badge: 'Пряный Нуар',
    releaseYear: 2013,
    suggestedOutfit: {
      l4Id: 'l4-charcoal-overcoat',
      l3Id: 'l3-cashmere-turtleneck',
      l2Id: 'l2-wool-suit-trousers',
      l1Id: 'l1-leather-derby'
    },
    mirrorExplanation: 'Горький апельсин, черный перец и смолистый уд под плотным шерстяным пальто подчеркивают закрытый статус и неприкосновенность личных границ.',
    idealCoords: { socialX: -0.35, thermoY: -0.75, formalIndex: 3, temperatureC: 6 }
  },

  // =========================================================================
  // 9. КВАДРАНТ IV: (+X, -Y) ТАКТИЛЬНОЕ ТЕПЛО
  // =========================================================================
  {
    perfumeId: 'creed-aventus',
    outfitName: '«Триумфатор»',
    quadrantCode: 'SE_SEDUCTION',
    periodicRole: 'q4',
    quadrantName: 'Квадрант IV • Притяжение',
    badge: 'Нео-Шипр Победы',
    releaseYear: 2010,
    suggestedOutfit: {
      l4Id: 'l4-hopsack-blazer',
      l3Id: 'l3-white-formal-shirt',
      l2Id: 'l2-dark-selvedge-denim',
      l1Id: 'l1-suede-loafers'
    },
    mirrorExplanation: 'Дымный ананас, березовый деготь и амброксан — идеальный мост между уверенным статусом и притягательным сексуальным шлейфом.',
    idealCoords: { socialX: 0.35, thermoY: -0.35, formalIndex: 2, temperatureC: 16 }
  },
  {
    perfumeId: 'versace-eros',
    outfitName: '«Кашемировый Магнит»',
    quadrantCode: 'SE_SEDUCTION',
    periodicRole: 'q4',
    quadrantName: 'Квадрант IV • Притяжение',
    badge: 'Клубный Магнетизм',
    releaseYear: 2012,
    suggestedOutfit: {
      l4Id: 'l4-suede-overshirt',
      l3Id: 'l3-heavy-white-tee',
      l2Id: 'l2-beige-chinos',
      l1Id: 'l1-clean-white-sneakers'
    },
    mirrorExplanation: 'Мята, засахаренное зеленое яблоко и ваниль играют на контрасте с фактурной замшей и светлыми чинос для активного вечернего общения.',
    idealCoords: { socialX: 0.70, thermoY: -0.35, formalIndex: 1, temperatureC: 18 }
  },
  {
    perfumeId: 'jpg-le-male',
    outfitName: '«Ночной Барвелюр»',
    quadrantCode: 'SE_SEDUCTION',
    periodicRole: 'q4',
    quadrantName: 'Квадрант IV • Притяжение',
    badge: 'Культовая Нежность',
    releaseYear: 1995,
    suggestedOutfit: {
      l3Id: 'l3-merino-crewneck',
      l2Id: 'l2-flannel-trousers',
      l1Id: 'l1-suede-loafers'
    },
    mirrorExplanation: 'Лаванда, корица, ваниль и мята — шедевр Кюркджана, излучающий теплоту и интимный уют в сочетании с тонким серым мериносом.',
    idealCoords: { socialX: 0.35, thermoY: -0.75, formalIndex: 2, temperatureC: 10 }
  },
  {
    perfumeId: 'lattafa-khamrah',
    outfitName: '«Пряный Гедонизм»',
    quadrantCode: 'SE_SEDUCTION',
    periodicRole: 'q4',
    quadrantName: 'Квадрант IV • Притяжение',
    badge: 'Восточная Нега',
    releaseYear: 2022,
    suggestedOutfit: {
      l4Id: 'l4-camel-coat',
      l3Id: 'l3-cashmere-turtleneck',
      l2Id: 'l2-beige-chinos',
      l1Id: 'l1-leather-derby'
    },
    mirrorExplanation: 'Корица, финики, пралине и бензоин согревают в зимний вечер, создавая сладкую негу в унисон с верблюжьей шерстью пальто.',
    idealCoords: { socialX: 0.70, thermoY: -0.75, formalIndex: 2, temperatureC: 4 }
  }
];
