import { PeriodicNoteElement } from '../types';
import { STORAGE_KEYS } from '../constants/storage';

/**
 * ПЕРИОДИЧЕСКАЯ СИСТЕМА НОТ (Ольфакторная таблица элементов Аньянова)
 * 
 * 4 Периода (Квадранта):
 *  - Период I:  «Свежий соблазн & Энергия» (Y > 0, X > 0)
 *  - Период II: «Интеллект & Дисциплина»   (Y > 0, X < 0)
 *  - Период III: «Тёмная власть & Статус»   (Y < 0, X < 0)
 *  - Период IV: «Тёплый соблазн & Уют»     (Y < 0, X > 0)
 */

export const PERIODIC_NOTE_ELEMENTS: PeriodicNoteElement[] = [
  // ==========================================
  // ПЕРИОД II: ИНТЕЛЛЕКТ, ДИСЦИПЛИНА & БАРЬЕР (+Y, -X)
  // ==========================================
  {
    id: 'iris',
    name: 'Ирис',
    symbol: 'Ir',
    period: 'II',
    subSector: 'II-D',
    tier: 'heart',
    layerAffinity: 'L3',
    category: 'Пудровые / Цветочные',
    thermoY: 0.65,
    distanceX: -0.45,
    massWeight: 0.45,
    resonantFabrics: ['Хлопок', 'Поплин', 'Шерсть', 'Тонкая шерсть', 'Шелк'],
    clashFabrics: ['Кожаная куртка', 'Ворсистый флис'],
    vibeDescription: 'Сухая благородная пудра, стерильная белая рубашка, интеллектуальный фокус.',
  },
  {
    id: 'vetiver',
    name: 'Ветивер',
    symbol: 'Vt',
    period: 'II',
    subSector: 'II-C',
    tier: 'base',
    layerAffinity: 'L3',
    category: 'Древесные / Корни',
    thermoY: 0.40,
    distanceX: -0.65,
    massWeight: 0.70,
    resonantFabrics: ['Твид', 'Шерсть', 'Сухая фланель', 'Хлопок', 'Габардин'],
    clashFabrics: ['Атлас', 'Шелк'],
    vibeDescription: 'Землисто-древесный сухой корень, выдержка, офисная субординация.',
  },
  {
    id: 'oakmoss',
    name: 'Дубовый мох',
    symbol: 'Om',
    period: 'II',
    subSector: 'II-A',
    tier: 'base',
    layerAffinity: 'L4',
    category: 'Шипровые / Зеленые',
    thermoY: 0.50,
    distanceX: -0.90,
    massWeight: 0.80,
    resonantFabrics: ['Твид', 'Тяжелая костюмная шерсть', 'Драп', 'Фланель'],
    clashFabrics: ['Лен', 'Вискоза', 'Шорты'],
    vibeDescription: 'Горький лесной мох, классический аристократический шипр, дистанция авторитета.',
  },
  {
    id: 'rosemary',
    name: 'Розмарин',
    symbol: 'Rsm',
    period: 'II',
    subSector: 'II-A',
    tier: 'top',
    layerAffinity: 'AURA',
    category: 'Ароматические травы',
    thermoY: 0.85,
    distanceX: -0.85,
    massWeight: 0.30,
    resonantFabrics: ['Хлопок', 'Шерсть', 'Поплин', 'Твидовый жилет'],
    clashFabrics: ['Бархат'],
    vibeDescription: 'Металлический холод, лезвие скальпеля, абсолютная собранность ума.',
  },
  {
    id: 'darjeeling_tea',
    name: 'Чай Дарджилинг',
    symbol: 'Dch',
    period: 'II',
    subSector: 'II-B',
    tier: 'heart',
    layerAffinity: 'L3',
    category: 'Чайные / Зеленые',
    thermoY: 0.60,
    distanceX: -0.35,
    massWeight: 0.35,
    resonantFabrics: ['Хлопок', 'Тонкий трикотаж', 'Шерсть', 'Оксфорд'],
    clashFabrics: ['Грубая кожа'],
    vibeDescription: 'Деликатный прозрачный чай, ненавязчивый кабинетный этикет, тихая роскошь.',
  },
  {
    id: 'flint_mineral',
    name: 'Кремень / Минеральные ноты',
    symbol: 'Mnr',
    period: 'II',
    subSector: 'II-C',
    tier: 'heart',
    layerAffinity: 'L3',
    category: 'Минеральные',
    thermoY: 0.45,
    distanceX: -0.75,
    massWeight: 0.65,
    resonantFabrics: ['Твид', 'Фланель', 'Плотный хлопок', 'Шерсть'],
    clashFabrics: ['Шелк'],
    vibeDescription: 'Запах высеченной искры на холодном камне, строгая монолитность.',
  },
  {
    id: 'geranium',
    name: 'Герань',
    symbol: 'Grn',
    period: 'II',
    subSector: 'II-A',
    tier: 'heart',
    layerAffinity: 'L3',
    category: 'Цветочные / Травяные',
    thermoY: 0.70,
    distanceX: -0.60,
    massWeight: 0.40,
    resonantFabrics: ['Костюмная шерсть', 'Хлопок'],
    vibeDescription: 'Прохладная перечная зелень, классический фужерный каркас.',
  },
  {
    id: 'cedar_dry',
    name: 'Кедр',
    symbol: 'Cdr',
    period: 'II',
    subSector: 'II-D',
    tier: 'base',
    layerAffinity: 'L4',
    category: 'Древесные',
    thermoY: 0.30,
    distanceX: -0.40,
    massWeight: 0.65,
    resonantFabrics: ['Шерсть', 'Пальто', 'Кашемир', 'Хлопок'],
    vibeDescription: 'Сухая карандашная стружка, благородная древесная основа.',
  },
  {
    id: 'aldehydes',
    name: 'Альдегиды',
    symbol: 'Ald',
    period: 'II',
    subSector: 'II-A',
    tier: 'top',
    layerAffinity: 'AURA',
    category: 'Альдегидные',
    thermoY: 0.90,
    distanceX: -0.50,
    massWeight: 0.20,
    resonantFabrics: ['Белая сорочка', 'Хлопок', 'Шелк'],
    vibeDescription: 'Сверкающий морозный воздух, эффект накрахмаленного воротника.',
  },
  {
    id: 'white_musk',
    name: 'Белый мускус',
    symbol: 'Wms',
    period: 'II',
    subSector: 'II-D',
    tier: 'base',
    layerAffinity: 'L3',
    category: 'Мускусные',
    thermoY: 0.55,
    distanceX: -0.10,
    massWeight: 0.50,
    resonantFabrics: ['Хлопок', 'Лен', 'Тонкий трикотаж'],
    vibeDescription: 'Запах идеальной чистоты вымытого тела и свежевыглаженной одежды.',
  },

  // ==========================================
  // ПЕРИОД I: СВЕЖИЙ СОБЛАЗН, ВОЗДУХ & ДРАЙВ (+Y, +X)
  // ==========================================
  {
    id: 'bergamot',
    name: 'Бергамот',
    symbol: 'Bg',
    period: 'I',
    subSector: 'I-D',
    tier: 'top',
    layerAffinity: 'AURA',
    category: 'Цитрусовые',
    thermoY: 0.80,
    distanceX: 0.30,
    massWeight: 0.25,
    resonantFabrics: ['Лен', 'Хлопок', 'Поло', 'Тонкая шерсть'],
    vibeDescription: 'Искристый горьковато-свежий цитрус, бодрость утреннего солнца.',
  },
  {
    id: 'marine_ozone',
    name: 'Морские ноты / Озон',
    symbol: 'Ozo',
    period: 'I',
    subSector: 'I-B',
    tier: 'top',
    layerAffinity: 'AURA',
    category: 'Акватические',
    thermoY: 0.85,
    distanceX: 0.45,
    massWeight: 0.20,
    resonantFabrics: ['Лен', 'Хлопок', 'Шорты', 'Светлые чиносы'],
    clashFabrics: ['Тяжелый драп', 'Твид', 'Шерстяное пальто'],
    vibeDescription: 'Морской соленый бриз, открытый горизонт, непринужденность.',
  },
  {
    id: 'calone',
    name: 'Калон',
    symbol: 'Cal',
    period: 'I',
    subSector: 'I-B',
    tier: 'heart',
    layerAffinity: 'L3',
    category: 'Акватические',
    thermoY: 0.75,
    distanceX: 0.40,
    massWeight: 0.30,
    resonantFabrics: ['Лен', 'Легкий хлопок', 'Поло'],
    clashFabrics: ['Твидовый костюм'],
    vibeDescription: 'Влажная арбузно-океаническая свежесть 90-х.',
  },
  {
    id: 'ambroxan',
    name: 'Амброксан',
    symbol: 'Amb',
    period: 'I',
    subSector: 'I-C',
    tier: 'base',
    layerAffinity: 'L3',
    category: 'Синтетические / Амбровые',
    thermoY: 0.35,
    distanceX: 0.80,
    massWeight: 0.60,
    resonantFabrics: ['Кожаная куртка', 'Деним', 'Джинсы', 'Хлопок', 'Сникеры'],
    vibeDescription: 'Сверхдиффузная сияющая амбровая волна, мощный шлейф комплиментов.',
  },
  {
    id: 'mint',
    name: 'Мята',
    symbol: 'Mt',
    period: 'I',
    subSector: 'I-A',
    tier: 'top',
    layerAffinity: 'AURA',
    category: 'Ароматические',
    thermoY: 0.85,
    distanceX: 0.80,
    massWeight: 0.25,
    resonantFabrics: ['Деним', 'Клубная рубашка', 'Хлопок'],
    vibeDescription: 'Ледяной мятный взрыв, адреналин, клубный флирт.',
  },
  {
    id: 'green_apple',
    name: 'Зеленое яблоко',
    symbol: 'Ap',
    period: 'I',
    subSector: 'I-A',
    tier: 'top',
    layerAffinity: 'AURA',
    category: 'Фруктовые',
    thermoY: 0.70,
    distanceX: 0.85,
    massWeight: 0.30,
    resonantFabrics: ['Деним', 'Джинсы', 'Футболка'],
    vibeDescription: 'Сочное хрустящее яблоко, юношеская энергия и притяжение.',
  },
  {
    id: 'neroli',
    name: 'Нероли',
    symbol: 'Nr',
    period: 'I',
    subSector: 'I-D',
    tier: 'top',
    layerAffinity: 'AURA',
    category: 'Цветочные / Цитрусовые',
    thermoY: 0.85,
    distanceX: 0.20,
    massWeight: 0.25,
    resonantFabrics: ['Белый лен', 'Светлый хлопок', 'Шелк'],
    vibeDescription: 'Цветок горького апельсина, средиземноморский отдых на яхте.',
  },
  {
    id: 'grapefruit',
    name: 'Грейпфрут',
    symbol: 'Gf',
    period: 'I',
    subSector: 'I-D',
    tier: 'top',
    layerAffinity: 'AURA',
    category: 'Цитрусовые',
    thermoY: 0.75,
    distanceX: 0.25,
    massWeight: 0.25,
    resonantFabrics: ['Хлопок', 'Поло', 'Smart Casual'],
    vibeDescription: 'Бодрящая цитрусовая горчинка с элегантным оттенком.',
  },

  // ==========================================
  // ПЕРИОД III: ТЁМНАЯ ВЛАСТЬ & АВТОРИТЕТ (-Y, -X)
  // ==========================================
  {
    id: 'oud',
    name: 'Уд (Агаровое дерево)',
    symbol: 'Ud',
    period: 'III',
    subSector: 'III-A',
    tier: 'base',
    layerAffinity: 'L4',
    category: 'Древесные / Смолы',
    thermoY: -0.85,
    distanceX: -0.85,
    massWeight: 0.95,
    resonantFabrics: ['Тяжелое шерстяное пальто', 'Драп', 'Смокинг', 'Кожа'],
    clashFabrics: ['Льняные шорты', 'Футболка', 'Кеды'],
    vibeDescription: 'Дымная смолистая драгоценная древесина, монументальная власть.',
  },
  {
    id: 'leather',
    name: 'Кожа',
    symbol: 'Lth',
    period: 'III',
    subSector: 'III-C',
    tier: 'base',
    layerAffinity: 'L1',
    category: 'Кожаные',
    thermoY: -0.60,
    distanceX: -0.75,
    massWeight: 0.85,
    resonantFabrics: ['Кожаные оксфорды', 'Челси', 'Кожаная куртка', 'Тяжелая шерсть'],
    clashFabrics: ['Лен', 'Хлопковые шорты'],
    vibeDescription: 'Выделанная благородная кожа, бескомпромиссная маскулинность.',
  },
  {
    id: 'birch_tar',
    name: 'Березовый деготь',
    symbol: 'Tar',
    period: 'III',
    subSector: 'III-C',
    tier: 'base',
    layerAffinity: 'L4',
    category: 'Кожаные / Дымные',
    thermoY: -0.50,
    distanceX: -0.95,
    massWeight: 0.90,
    resonantFabrics: ['Кожаная куртка', 'Тяжелые ботинки', 'Твид'],
    clashFabrics: ['Шелк', 'Лен'],
    vibeDescription: 'Дымный мазутно-кожаный аккорд Fahrenheit, стена несгибаемого характера.',
  },
  {
    id: 'saffron',
    name: 'Шафран',
    symbol: 'Sfr',
    period: 'III',
    subSector: 'III-A',
    tier: 'heart',
    layerAffinity: 'L3',
    category: 'Пряные восточные',
    thermoY: -0.70,
    distanceX: -0.60,
    massWeight: 0.80,
    resonantFabrics: ['Шерстяной блейзер', 'Кашемир', 'Темный трикотаж'],
    vibeDescription: 'Золотая восточная пряность с кожано-металлическим благородным подтоном.',
  },
  {
    id: 'black_pepper',
    name: 'Черный перец',
    symbol: 'Bp',
    period: 'III',
    subSector: 'III-A',
    tier: 'top',
    layerAffinity: 'L3',
    category: 'Пряные',
    thermoY: -0.40,
    distanceX: -0.50,
    massWeight: 0.50,
    resonantFabrics: ['Шерсть', 'Хлопковая сорочка', 'Пиджак'],
    vibeDescription: 'Сухая острая пряность, придающая силуэту решительность.',
  },
  {
    id: 'incense',
    name: 'Ладан / Олибанум',
    symbol: 'Inc',
    period: 'III',
    subSector: 'III-B',
    tier: 'base',
    layerAffinity: 'L4',
    category: 'Бальзамы / Смолы',
    thermoY: -0.65,
    distanceX: -0.55,
    massWeight: 0.75,
    resonantFabrics: ['Пальто', 'Темная шерсть', 'Кашемир'],
    vibeDescription: 'Медитативный дымный фимиам, таинственная глубина и статус.',
  },
  {
    id: 'patchouli',
    name: 'Пачули',
    symbol: 'Pch',
    period: 'III',
    subSector: 'III-C',
    tier: 'base',
    layerAffinity: 'L4',
    category: 'Древесные / Землистые',
    thermoY: -0.60,
    distanceX: -0.65,
    massWeight: 0.80,
    resonantFabrics: ['Твид', 'Шерсть', 'Пальто', 'Фланель'],
    vibeDescription: 'Землисто-шоколадный темный подтон, богатство винтажной классики.',
  },
  {
    id: 'dark_cocoa',
    name: 'Темное какао',
    symbol: 'Cca',
    period: 'III',
    subSector: 'III-B',
    tier: 'heart',
    layerAffinity: 'L3',
    category: 'Гурманские / Бархатные',
    thermoY: -0.75,
    distanceX: -0.40,
    massWeight: 0.70,
    resonantFabrics: ['Шерстяной фланелевый костюм', 'Замша', 'Кашемир'],
    vibeDescription: 'Горький бархатный шоколад, пудрово-замшевый статус Dior Homme Intense.',
  },

  // ==========================================
  // ПЕРИОД IV: ТЁПЛЫЙ СОБЛАЗН, КАШЕМИР & МАГНЕТИЗМ (-Y, +X)
  // ==========================================
  {
    id: 'vanilla',
    name: 'Бурбонская ваниль',
    symbol: 'Vn',
    period: 'IV',
    subSector: 'IV-A',
    tier: 'base',
    layerAffinity: 'L3',
    category: 'Гурманские',
    thermoY: -0.85,
    distanceX: 0.85,
    massWeight: 0.85,
    resonantFabrics: ['Кашемир', 'Мягкий трикотаж', 'Замша', 'Фланель'],
    clashFabrics: ['Строгий деловой тейлоринг', 'Твидовый костюм тройка'],
    vibeDescription: 'Стручковая глубокая ваниль, согревающая нежность на дистанции объятий.',
  },
  {
    id: 'tonka_bean',
    name: 'Бобы тонка',
    symbol: 'Tb',
    period: 'IV',
    subSector: 'IV-B',
    tier: 'base',
    layerAffinity: 'L3',
    category: 'Бальзамические / Сладкие',
    thermoY: -0.75,
    distanceX: 0.75,
    massWeight: 0.75,
    resonantFabrics: ['Кашемировый джемпер', 'Замшевая куртка', 'Шерстяной шарф'],
    vibeDescription: 'Миндально-кумариновый уют, гипнотическое притяжение вечера.',
  },
  {
    id: 'cinnamon',
    name: 'Корица',
    symbol: 'Cnn',
    period: 'IV',
    subSector: 'IV-A',
    tier: 'heart',
    layerAffinity: 'L3',
    category: 'Пряные согревающие',
    thermoY: -0.80,
    distanceX: 0.70,
    massWeight: 0.70,
    resonantFabrics: ['Вязаный свитер', 'Кашемир', 'Фланель', 'Пальто'],
    vibeDescription: 'Пряное печеное яблоко с корицей, ощущение домашнего очага и роскоши.',
  },
  {
    id: 'cardamom',
    name: 'Кардамон',
    symbol: 'Crd',
    period: 'IV',
    subSector: 'IV-D',
    tier: 'heart',
    layerAffinity: 'L3',
    category: 'Пряные благородные',
    thermoY: -0.50,
    distanceX: 0.55,
    massWeight: 0.60,
    resonantFabrics: ['Кашемир', 'Сорочка с расстегнутым воротом', 'Замша', 'Шерсть'],
    vibeDescription: 'Холодно-пряный магнетический кардамон La Nuit de L\'Homme, оружие свиданий.',
  },
  {
    id: 'dates_praline',
    name: 'Финики / Пралине',
    symbol: 'Dte',
    period: 'IV',
    subSector: 'IV-A',
    tier: 'heart',
    layerAffinity: 'L3',
    category: 'Гурманские',
    thermoY: -0.95,
    distanceX: 0.90,
    massWeight: 0.90,
    resonantFabrics: ['Кашемир', 'Мягкая фланель', 'Вечерний трикотаж'],
    clashFabrics: ['Офисная сорочка', 'Лен'],
    vibeDescription: 'Абсолютный десерт Khamrah, карамельные финики, ликерный антистресс.',
  },
  {
    id: 'sandalwood',
    name: 'Сливочный сандал',
    symbol: 'Snd',
    period: 'IV',
    subSector: 'IV-D',
    tier: 'base',
    layerAffinity: 'L3',
    category: 'Древесные благородные',
    thermoY: -0.65,
    distanceX: 0.45,
    massWeight: 0.75,
    resonantFabrics: ['Кашемир', 'Шелк', 'Шерстяной трикотаж', 'Замша'],
    vibeDescription: 'Шелковистое сливочное дерево, умиротворение и тактильная нежность.',
  },
  {
    id: 'amber_warm',
    name: 'Теплая амбра',
    symbol: 'Ambw',
    period: 'IV',
    subSector: 'IV-B',
    tier: 'base',
    layerAffinity: 'L4',
    category: 'Смолы / Амбровые',
    thermoY: -0.80,
    distanceX: 0.60,
    massWeight: 0.85,
    resonantFabrics: ['Пальто', 'Кашемир', 'Шерсть', 'Замша'],
    vibeDescription: 'Золотое согревающее свечение, шлейф интимного уюта.',
  },
  {
    id: 'tobacco_leaf',
    name: 'Табачный лист',
    symbol: 'Tbc',
    period: 'IV',
    subSector: 'IV-C',
    tier: 'heart',
    layerAffinity: 'L3',
    category: 'Табачные',
    thermoY: -0.75,
    distanceX: 0.60,
    massWeight: 0.80,
    resonantFabrics: ['Твидовый пиджак', 'Кашемир', 'Кожаная куртка', 'Фланель'],
    vibeDescription: 'Сухой медовый табак с ванилью, джентльменский клубный шик.',
  },
  {
    id: 'plum',
    name: 'Слива',
    symbol: 'Plm',
    period: 'IV',
    subSector: 'IV-B',
    tier: 'heart',
    layerAffinity: 'L3',
    category: 'Фруктовые глубокие',
    thermoY: -0.55,
    distanceX: 0.70,
    massWeight: 0.55,
    resonantFabrics: ['Шерсть', 'Замша', 'Темная рубашка'],
    vibeDescription: 'Пьяная бархатная слива, сладкий вечерний флер.',
  },

  // ==========================================
  // ТОЧКА БАЛАНСА (0, 0)
  // ==========================================
  {
    id: 'pink_pepper',
    name: 'Розовый перец',
    symbol: 'Pp',
    period: 'I',
    subSector: 'I-D',
    tier: 'top',
    layerAffinity: 'AURA',
    category: 'Пряные искристые',
    thermoY: 0.15,
    distanceX: 0.10,
    massWeight: 0.35,
    resonantFabrics: ['Костюмная шерсть', 'Хлопок', 'Smart Casual'],
    vibeDescription: 'Свеже-пряный мостик между бодростью цитрусов и строгостью древесины.',
  }
];

/**
 * Словарь синонимов для гибкого поиска нот
 */
const NOTE_ALIASES: Record<string, string> = {
  'мята': 'mint',
  'бергамот': 'bergamot',
  'калабрийский бергамот': 'bergamot',
  'озон': 'marine_ozone',
  'морские ноты': 'marine_ozone',
  'морской бриз': 'marine_ozone',
  'водные ноты': 'marine_ozone',
  'калон': 'calone',
  'амброксан': 'ambroxan',
  'зеленое яблоко': 'green_apple',
  'яблоко': 'green_apple',
  'нероли': 'neroli',
  'грейпфрут': 'grapefruit',
  'ирис': 'iris',
  'ветивер': 'vetiver',
  'серый ветивер': 'vetiver',
  'дубовый мох': 'oakmoss',
  'мох': 'oakmoss',
  'розмарин': 'rosemary',
  'чай': 'darjeeling_tea',
  'зеленый чай': 'darjeeling_tea',
  'чай дарджилинг': 'darjeeling_tea',
  'кремень': 'flint_mineral',
  'минеральные ноты': 'flint_mineral',
  'герань': 'geranium',
  'кедр': 'cedar_dry',
  'альдегиды': 'aldehydes',
  'белый мускус': 'white_musk',
  'мускус': 'white_musk',
  'уд': 'oud',
  'агаровое дерево': 'oud',
  'кожа': 'leather',
  'замша': 'leather',
  'деготь': 'birch_tar',
  'березовый деготь': 'birch_tar',
  'шафран': 'saffron',
  'черный перец': 'black_pepper',
  'перец': 'black_pepper',
  'мандарин': 'bergamot',
  'итальянский мандарин': 'bergamot',
  'лаванда': 'rosemary',
  'египетская герань': 'geranium',
  'кедр из вирджинии': 'cedar_dry',
  'амбервуд': 'amber_warm',
  'amberwood': 'amber_warm',
  'акигалавуд': 'patchouli',
  'akigalawood': 'patchouli',
  'лабданум': 'incense',
  'сомалийский ладан': 'incense',
  'ладан': 'incense',
  'олибанум': 'incense',
  'пачули': 'patchouli',
  'какао': 'dark_cocoa',
  'ваниль': 'vanilla',
  'бурбонская ваниль': 'vanilla',
  'бобы тонка': 'tonka_bean',
  'кумарин': 'tonka_bean',
  'корица': 'cinnamon',
  'кардамон': 'cardamom',
  'финики': 'dates_praline',
  'пралине': 'dates_praline',
  'карамель': 'dates_praline',
  'сандал': 'sandalwood',
  'сливочный сандал': 'sandalwood',
  'амбра': 'amber_warm',
  'серая амбра': 'amber_warm',
  'табак': 'tobacco_leaf',
  'лист табака': 'tobacco_leaf',
  'слива': 'plum',
  'розовый перец': 'pink_pepper',
};

/**
 * Поиск ноты в периодической системе по названию или синониму
 */
export function findPeriodicNote(rawName: string): PeriodicNoteElement | undefined {
  if (!rawName) return undefined;
  const clean = rawName.trim().toLowerCase();

  // Прямой поиск по id
  const byId = PERIODIC_NOTE_ELEMENTS.find((n) => n.id.toLowerCase() === clean);
  if (byId) return byId;

  // Прямой поиск по русскому имени
  const byName = PERIODIC_NOTE_ELEMENTS.find((n) => n.name.toLowerCase() === clean);
  if (byName) return byName;

  // Поиск через словарь синонимов
  const aliasId = NOTE_ALIASES[clean];
  if (aliasId) {
    const byAlias = PERIODIC_NOTE_ELEMENTS.find((n) => n.id === aliasId);
    if (byAlias) return byAlias;
  }

  // Нечеткий поиск (вхождение подстроки)
  return PERIODIC_NOTE_ELEMENTS.find((n) => 
    clean.includes(n.name.toLowerCase()) || n.name.toLowerCase().includes(clean)
  );
}

/**
 * Загрузка пользовательских / AI-откалиброванных нот из LocalStorage
 */
export function loadCustomNotesFromStorage(): PeriodicNoteElement[] {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return [];
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_PERIODIC_NOTES);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Не удалось загрузить кастомные ноты из LocalStorage:', e);
    return [];
  }
}

/**
 * Сохранение списка пользовательских нот в LocalStorage
 */
export function saveCustomNotesToStorage(notes: PeriodicNoteElement[]): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    localStorage.setItem(STORAGE_KEYS.CUSTOM_PERIODIC_NOTES, JSON.stringify(notes));
  } catch (e) {
    console.warn('Не удалось сохранить кастомные ноты в LocalStorage:', e);
  }
}

/**
 * Динамическая регистрация новой ноты в Периодической системе
 * Добавляет ноту в активный реестр и сохраняет в LocalStorage.
 */
export function registerPeriodicNote(newElement: PeriodicNoteElement): void {
  const cleanId = newElement.id.trim().toLowerCase();
  const cleanName = newElement.name.trim().toLowerCase();

  const existingIdx = PERIODIC_NOTE_ELEMENTS.findIndex(
    (n) => n.id.toLowerCase() === cleanId || n.name.toLowerCase() === cleanName
  );

  if (existingIdx >= 0) {
    PERIODIC_NOTE_ELEMENTS[existingIdx] = newElement;
  } else {
    PERIODIC_NOTE_ELEMENTS.push(newElement);
  }

  // Обновляем алиас
  NOTE_ALIASES[cleanName] = newElement.id;

  // Синхронизируем с LocalStorage
  const stored = loadCustomNotesFromStorage().filter(
    (n) => n.id.toLowerCase() !== cleanId && n.name.toLowerCase() !== cleanName
  );
  stored.push(newElement);
  saveCustomNotesToStorage(stored);
}

// Первоначальная инициализация сохраненных пользовательских нот
try {
  const initialCustomNotes = loadCustomNotesFromStorage();
  if (initialCustomNotes && initialCustomNotes.length > 0) {
    initialCustomNotes.forEach((note) => {
      const idx = PERIODIC_NOTE_ELEMENTS.findIndex(
        (n) => n.id.toLowerCase() === note.id.toLowerCase() || n.name.toLowerCase() === note.name.toLowerCase()
      );
      if (idx >= 0) {
        PERIODIC_NOTE_ELEMENTS[idx] = note;
      } else {
        PERIODIC_NOTE_ELEMENTS.push(note);
      }
      NOTE_ALIASES[note.name.toLowerCase()] = note.id;
    });
  }
} catch (e) {
  console.warn('Ошибка инициализации кастомных нот из хранилища:', e);
}
