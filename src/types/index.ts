export type FormalIndex = 1 | 2 | 3; // 1 = Casual, 2 = Smart Casual, 3 = Business Formal

export type LayerType = 'L4' | 'L3' | 'L2' | 'L1';
// L4: Верхний слой (пиджак, блейзер, куртка, пальто)
// L3: Торс (сорочка, поло, джемпер, футболка)
// L2: Ноги (брюки со стрелками, чинос, джинсы, шорты)
// L1: Обувь (оксфорды, лоферы, дерби, кеды, кроссовки)

/**
 * 10 Канонических Ортогональных Измерений Системы Аньянова (5 осей намерения X × 5 осей среды Y):
 * 
 * Базис Социального Воздействия (Ось X: Семиотика и Воля):
 * 1. distance: -1.0 (Обособленность / Субординация) <-> +1.0 (Интим / Сближение)
 * 2. formality: -1.0 (Business Formal) <-> +1.0 (Casual)
 * 3. power: -1.0 (Статус / Твердая власть) <-> +1.0 (Соблазн / Шарм / Эрос)
 * 4. mood: -1.0 (Собранность / Фокус) <-> +1.0 (Легкость / Свобода / Релакс)
 * 5. expression: -1.0 (Statement / Драма / Fortissimo) <-> +1.0 (Quiet Luxury / Сдержанность / Pianissimo)
 * 
 * Базис Физического Контекста (Ось Y: Хронотоп и Термодинамика):
 * 6. season: -1.0 (Зима / Плотность) <-> +1.0 (Лето / Воздух)
 * 7. temperature: -1.0 (Тепло / Согревающий) <-> +1.0 (Холод / Освежающий)
 * 8. time_of_day: -1.0 (Вечер / Глубина) <-> +1.0 (День / Свет)
 * 9. space: -1.0 (Indoor / Помещение / Замкнутость) <-> +1.0 (Outdoor / Стихия / Открытый воздух)
 * 10. chronometry: -1.0 (Марафон / Долгий день 12+ ч) <-> +1.0 (Спринт / Экспресс 30–60 мин)
 */
export interface Anyanov10DVector {
  // 5 осей намерения (Социальный контур / Ось X)
  distance: number;
  formality: number;
  power: number;
  mood: number;
  expression: number;

  // 5 осей среды (Физико-временной контур / Ось Y)
  season: number;
  temperature: number;
  time_of_day: number;
  space: number;
  chronometry: number;
}

// Канонический 10D-базис
export type AestheticValues = Anyanov10DVector;

// Алиас для обратной совместимости
export type Anyanov8DVector = Anyanov10DVector;

export interface WardrobeItem {
  id: string;
  layer: LayerType;
  name: string;
  category: string;
  formalIndex: FormalIndex;
  minTemp: number; // e.g. -15
  maxTemp: number; // e.g. +35
  color: string; // hex
  colorName: string;
  fabric: string;
  description: string;
  silhouette: 'structured' | 'relaxed' | 'draped';
  isOverwear?: boolean; // Транзитная уличная верхняя одежда (пальто/куртка, сдается в помещении)
  aestheticValues?: Partial<AestheticValues>;
}

export interface OutfitStack {
  overwear?: WardrobeItem | null; // Транзитная уличная защита (пальто / куртка)
  l4: WardrobeItem | null;        // Жакет / Пиджак / Блейзер (для помещения)
  l3: WardrobeItem;               // Торс (сорочка, поло, трикотаж)
  l2: WardrobeItem;               // Брюки (шерсть, чинос, джинсы, лен)
  l1: WardrobeItem;               // Обувь (оксфорды, лоферы, кеды)
}

export interface PerfumeNotePyramid {
  top: string[];
  heart: string[];
  base: string[];
}

export interface PerfumeItem {
  id: string;
  name: string;
  brand: string;
  xCoord: number; // -1.00 (Власть / Фокус) to +1.00 (Соблазн / Интим)
  yCoord: number; // -1.00 (Зима / Вечер / Тепло) to +1.00 (Лето / День / Холод)
  diffusion: 'Интимная' | 'Умеренная' | 'Шлейфовая' | 'Ударная';
  pyramid: PerfumeNotePyramid;
  dominantVibe: string;
  bestOccasion: string;
  whyFitsOutfit: string;
  colorTheme: string;
  imageUrl?: string;
  aestheticValues?: Partial<AestheticValues>;
}

export interface AnyanovCoordinates {
  // -1.00 (Статус / Власть / Фокус / Обособленность) <---> +1.00 (Соблазн / Интим / Casual / Сближение)
  socialX: number;
  // -1.00 (Долгое действие / Тепло / Вечер / Зима) <---> +1.00 (Быстрое действие / Холод / День / Лето)
  thermoY: number;
  // Индекс формальности 1, 2, 3
  formalIndex: FormalIndex;
  // Температура окружающей среды (-15 ... +35 °C)
  temperatureC: number;
}

export type AnyanovSeason = 'summer' | 'winter';
export type ControlMode = 'outfit' | 'perfume';

export type QuadrantType = 'NW_FOCUS' | 'NE_EASE' | 'SW_POWER' | 'SE_SEDUCTION';

export interface QuadrantInfo {
  code: QuadrantType;
  name: string;
  subtitle: string;
  primaryEnergy: string;
  outfitDirection: string;
  perfumeDirection: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export type HarmonyState =
  | 'UNISON'           // Унисон (Тотальный Консонанс)
  | 'CONTRAPUNCT'      // Благородный Контрапункт (Полифония)
  | 'DIVERGENCE'       // Умеренная Дивергенция
  | 'DISSONANCE'       // Семантический Диссонанс
  | 'CACOPHONY';       // Какофония

export interface AxisClash {
  axis: keyof AestheticValues;
  diff: number;
  diagnosis: string;
}

export type TetradChannelName = 'Форма' | 'Фактура' | 'Цвет' | 'Запах';

export interface TetradChannelEvaluation {
  name: TetradChannelName;
  value: string;
  detail: string;
  targetIntent: string;
  status: 'CONSONANT' | 'CONTRAPUNCT' | 'CLASH';
  resonanceScore: number; // 0..100
}

export type SignalAmplitude = 'PIANISSIMO' | 'MEZZO' | 'FORTISSIMO';

export type QuadrantSeasonalStatus = 'ACTIVE' | 'LOCKED' | 'PIANISSIMO_ONLY';

export interface SeasonalAsymmetryAudit {
  isWinterLock: boolean; // Зимний аппаратный замок на Q1 (NE)
  isSummerPianissimoRequired: boolean; // Требование режима Pianissimo для Q3/Q4 летом
  activeNotice?: string;
}

export interface CanonicalTetrad {
  form: TetradChannelEvaluation;
  texture: TetradChannelEvaluation;
  color: TetradChannelEvaluation;
  scent: TetradChannelEvaluation;
  isMonolithic: boolean; // Все 4 канала созвучны без критических противоречий
  zeroCrossingViolation: boolean; // Нарушение Закона Нулевой Границы
  amplitude: SignalAmplitude; // Fortissimo (Statement) vs Pianissimo (Quiet Luxury)
  summaryVerdict: string;
  seasonalAudit?: SeasonalAsymmetryAudit;
}

export interface SolfeggioAnalysis {
  distance: number;
  cosineSimilarity: number;
  harmonyState: HarmonyState;
  stateLabel: string;
  badgeColor: string;
  verdict: string;
  clashes: AxisClash[];
  outfitVector: AestheticValues;
  perfumeVector: AestheticValues;
  outfitCoords: { x: number; y: number };
  tetrad: CanonicalTetrad;
}

export interface CompiledLook {
  coordinates: AnyanovCoordinates;
  quadrant: QuadrantInfo;
  outfit: OutfitStack;
  perfume: PerfumeItem;
  solfeggio: SolfeggioAnalysis;
  rulesApplied: string[];
}

export interface PeriodicNoteElement {
  id: string;
  name: string;
  symbol: string; // Хим-символ (Ir, Vt, Ud, Vn, Amb, Ozo и т.д.)
  period: 'I' | 'II' | 'III' | 'IV';
  subSector?: string; // e.g. "I-A", "II-C"
  tier: 'top' | 'heart' | 'base';
  layerAffinity: 'L1' | 'L2' | 'L3' | 'L4' | 'AURA';
  category: string;
  thermoY: number; // -1.0 .. +1.0 (Лето/Холод <-> Зима/Тепло)
  distanceX: number; // -1.0 .. +1.0 (Барьер <-> Сближение)
  massWeight: number; // 0.1 .. 1.0 (Плотность)
  resonantFabrics: string[];
  clashFabrics?: string[];
  vibeDescription: string;
}

export interface NoteFabricResonancePair {
  note: PeriodicNoteElement;
  layer: LayerType | 'AURA';
  itemCategory: string;
  fabric: string;
  synergyLevel: 'EXCELLENT' | 'GOOD' | 'NEUTRAL';
  reason: string;
}

export interface NoteClashWarning {
  noteName: string;
  layer: LayerType;
  fabric: string;
  warning: string;
}

export interface OlfactoryDynamics {
  heartDistanceScore: number; // -1.0 (Обособленность / Дистанция) .. +1.0 (Сближение / Интим)
  heartDistanceLabel: string;
  heartInterpretation: string;
  topVolatilesScore: number; // 0..1.0 (Летучесть и рассеивание)
  topInterpretation: string;
  baseFixationScore: number; // 0..1.0 (Плотность и фиксация)
  baseInterpretation: string;
}

export interface NoteEngineAnalysis {
  resonantPairs: NoteFabricResonancePair[];
  clashes: NoteClashWarning[];
  resonanceScore: number; // 0..100
  derivedCoords: { x: number; y: number };
  baseAnchorVerdict: string;
  heartSocialVerdict: string;
  topAuraVerdict: string;
  olfactoryDynamics?: OlfactoryDynamics;
}

export interface HumanVibeArchetype {
  id: string;
  title: string;
  shortTag: string;
  subtitle: string;
  metaphors: string[];
  iconKey: 'shirt' | 'car' | 'coffee' | 'forest' | 'sea' | 'flame' | 'book' | 'drink' | 'future';
  colorTheme: string;
  badgeColor: string;
  targetPerfumeId: string;
  recommendedCoords: AnyanovCoordinates;
  humanExplanation: string;
  fabricSynergy: string;
}

export interface HumanReferenceScent {
  id: string;
  popularName: string;
  popularBrand: string;
  userVibeSummary: string;
  targetPerfumeId: string;
  explanation: string;
}
