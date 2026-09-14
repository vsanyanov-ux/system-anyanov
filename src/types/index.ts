export type FormalIndex = 1 | 2 | 3; // 1 = Casual, 2 = Smart Casual, 3 = Business Formal

export type LayerType = 'L4' | 'L3' | 'L2' | 'L1';
// L4: Верхний слой (пиджак, блейзер, куртка, пальто)
// L3: Торс (сорочка, поло, джемпер, футболка)
// L2: Ноги (брюки со стрелками, чинос, джинсы, шорты)
// L1: Обувь (оксфорды, лоферы, дерби, кеды, кроссовки)

export interface Anyanov8DVector {
  distance: number;     // -1.0 (Обособленность / Субординация) <-> +1.0 (Интим / Сближение)
  formality: number;    // -1.0 (Business Formal) <-> +1.0 (Casual)
  power: number;        // -1.0 (Статус / Твердая власть) <-> +1.0 (Соблазн / Мягкая сила)
  mood: number;         // -1.0 (Собранность / Фокус) <-> +1.0 (Легкость / Свобода)
  diffusion: number;    // -1.0 (Долгое действие / Шлейф) <-> +1.0 (Быстрое действие / Вспышка)
  temperature: number;  // -1.0 (Тепло / Согревающий) <-> +1.0 (Холод / Освежающий)
  time_of_day: number;  // -1.0 (Вечер / Глубина) <-> +1.0 (День / Свет)
  season: number;       // -1.0 (Зима / Плотность) <-> +1.0 (Лето / Воздух)
}

export type AestheticValues = Anyanov8DVector;

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
  aestheticValues?: Partial<AestheticValues>;
}

export interface OutfitStack {
  l4: WardrobeItem | null;
  l3: WardrobeItem;
  l2: WardrobeItem;
  l1: WardrobeItem;
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

export interface NoteEngineAnalysis {
  resonantPairs: NoteFabricResonancePair[];
  clashes: NoteClashWarning[];
  resonanceScore: number; // 0..100
  derivedCoords: { x: number; y: number };
  baseAnchorVerdict: string;
  heartSocialVerdict: string;
  topAuraVerdict: string;
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
