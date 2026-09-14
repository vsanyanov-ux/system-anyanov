export type FormalIndex = 1 | 2 | 3; // 1 = Casual, 2 = Smart Casual, 3 = Business Formal

export type LayerType = 'L4' | 'L3' | 'L2' | 'L1';
// L4: Верхний слой (пиджак, блейзер, куртка, пальто)
// L3: Торс (сорочка, поло, джемпер, футболка)
// L2: Ноги (брюки со стрелками, чинос, джинсы, шорты)
// L1: Обувь (оксфорды, лоферы, дерби, кеды, кроссовки)

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

export interface CompiledLook {
  coordinates: AnyanovCoordinates;
  quadrant: QuadrantInfo;
  outfit: OutfitStack;
  perfume: PerfumeItem;
  synergyVerdict: string;
  compatibilityScore: number; // 90 - 100%
  rulesApplied: string[];
}
