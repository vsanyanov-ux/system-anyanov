import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Briefcase,
  Heart,
  Coffee,
  Crown,
  Layers,
  ShieldCheck,
  Compass,
  Trophy,
  Shuffle,
  CheckCircle2,
  SlidersHorizontal,
  ArrowRight,
  Sun,
  Snowflake,
  Search,
  Shirt,
  AlertTriangle,
  RotateCcw,
  LayoutGrid,
  Check,
  Filter,
  X,
} from 'lucide-react';
import { AnyanovCoordinates, OutfitStack, PerfumeItem } from '../types';
import { FragranceMatchResult, RankedPerfumeCandidate } from '../engine/fragranceMatcher';
import { parseNaturalLanguageQuery } from '../engine/semanticParser';
import { getPerfumeBottleImage } from '../data/fragrances';
import { logUserSituation } from '../services/supabaseService';
import { getQuadrantInfo } from '../engine/anyanovMatrix';

interface PublicMinimalViewProps {
  coords: AnyanovCoordinates;
  onChangeCoords: (coords: AnyanovCoordinates) => void;
  outfit: OutfitStack;
  matchResult: FragranceMatchResult;
  userShelfIds: string[];
  isCatalogMode: boolean;
  onToggleCatalogMode: () => void;
  onOpenShelfModal: () => void;
  onSwitchToPro: () => void;
  initialViewMode?: 'concierge' | 'category';
  onViewModeChange?: (mode: 'concierge' | 'category') => void;
}

interface QuickOccasion {
  id: string;
  label: string;
  icon: React.ReactNode;
  coords: {
    socialX: number;
    thermoY: number;
    formalIndex: 1 | 2 | 3;
    temperatureC?: number;
  };
}

const QUICK_OCCASIONS: QuickOccasion[] = [
  {
    id: 'business',
    label: 'Деловые переговоры',
    icon: <Briefcase className="w-4 h-4 text-sky-400" />,
    coords: { socialX: -0.75, thermoY: 0.55, formalIndex: 3, temperatureC: 21 },
  },
  {
    id: 'date',
    label: 'Свидание в ресторане',
    icon: <Heart className="w-4 h-4 text-rose-400" />,
    coords: { socialX: 0.65, thermoY: -0.55, formalIndex: 2, temperatureC: 20 },
  },
  {
    id: 'office',
    label: 'Рабочий день (Офис)',
    icon: <CheckCircle2 className="w-4 h-4 text-indigo-400" />,
    coords: { socialX: -0.40, thermoY: 0.45, formalIndex: 2, temperatureC: 22 },
  },
  {
    id: 'casual',
    label: 'Выходной / Кафе с друзьями',
    icon: <Coffee className="w-4 h-4 text-amber-400" />,
    coords: { socialX: 0.45, thermoY: 0.55, formalIndex: 1, temperatureC: 23 },
  },
  {
    id: 'party',
    label: 'Вечеринка / Клуб',
    icon: <Sparkles className="w-4 h-4 text-purple-400" />,
    coords: { socialX: 0.55, thermoY: -0.40, formalIndex: 1, temperatureC: 21 },
  },
  {
    id: 'celebration',
    label: 'Торжество / Свадьба',
    icon: <Crown className="w-4 h-4 text-amber-300" />,
    coords: { socialX: 0.35, thermoY: 0.25, formalIndex: 2, temperatureC: 22 },
  },
];

export const PublicMinimalView: React.FC<PublicMinimalViewProps> = ({
  coords,
  onChangeCoords,
  outfit,
  matchResult,
  userShelfIds,
  isCatalogMode,
  onToggleCatalogMode,
  onOpenShelfModal,
  onSwitchToPro,
  initialViewMode = 'concierge',
  onViewModeChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'concierge' | 'category'>(initialViewMode);
  const [selectedPerfumeId, setSelectedPerfumeId] = useState<string | null>(null);
  const [showAlternative, setShowAlternative] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Синхронизация режима при внешнем переключении через сайдбар
  React.useEffect(() => {
    if (initialViewMode && initialViewMode !== viewMode) {
      setViewMode(initialViewMode);
    }
  }, [initialViewMode]);

  // Фильтры витрины категории (для искушенного покупателя)
  const [categorySearch, setCategorySearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [scopeFilter, setScopeFilter] = useState<'quadrant' | 'all'>('quadrant');
  const [shelfOnlyFilter, setShelfOnlyFilter] = useState(false);

  // Квадрант текущей ситуации
  const currentQuadrant = useMemo(() => {
    return getQuadrantInfo(coords.socialX, coords.thermoY);
  }, [coords.socialX, coords.thermoY]);

  // Список всех уникальных брендов в доступных кандидатах
  const availableBrands = useMemo(() => {
    const brands = new Set<string>();
    (matchResult.allCatalogCandidates || []).forEach((c) => {
      if (c.item.brand) brands.add(c.item.brand);
    });
    return Array.from(brands).sort();
  }, [matchResult.allCatalogCandidates]);

  // Фильтрованные кандидаты витрины категории
  const categoryCandidates = useMemo(() => {
    let list = matchResult.allCatalogCandidates || [];

    // 1. Фильтр по квадранту
    if (scopeFilter === 'quadrant') {
      const inQuad = list.filter((c) => {
        const q = getQuadrantInfo(c.item.xCoord, c.item.yCoord);
        return q.code === currentQuadrant.code;
      });
      if (inQuad.length > 0) {
        list = inQuad;
      }
    }

    // 2. Фильтр "С моей полки"
    if (shelfOnlyFilter) {
      list = list.filter((c) => c.isOwned);
    }

    // 3. Фильтр по бренду
    if (selectedBrand !== 'ALL') {
      list = list.filter((c) => c.item.brand.toLowerCase() === selectedBrand.toLowerCase());
    }

    // 4. Поиск по строке (название, ноты, вайб)
    if (categorySearch.trim()) {
      const q = categorySearch.toLowerCase().trim();
      list = list.filter((c) => {
        const nameMatch = c.item.name.toLowerCase().includes(q);
        const brandMatch = c.item.brand.toLowerCase().includes(q);
        const vibeMatch = c.item.dominantVibe.toLowerCase().includes(q);
        const notesMatch = [
          ...c.item.pyramid.top,
          ...c.item.pyramid.heart,
          ...c.item.pyramid.base,
        ].some((n) => n.toLowerCase().includes(q));
        return nameMatch || brandMatch || vibeMatch || notesMatch;
      });
    }

    return list;
  }, [
    matchResult.allCatalogCandidates,
    scopeFilter,
    currentQuadrant.code,
    shelfOnlyFilter,
    selectedBrand,
    categorySearch,
  ]);

  // Количество флаконов строго в текущем квадранте
  const quadrantCount = useMemo(() => {
    return (matchResult.allCatalogCandidates || []).filter((c) => {
      const q = getQuadrantInfo(c.item.xCoord, c.item.yCoord);
      return q.code === currentQuadrant.code;
    }).length;
  }, [matchResult.allCatalogCandidates, currentQuadrant.code]);

  // Кандидат, выбранный вручную из витрины
  const selectedCandidate = useMemo(() => {
    if (!selectedPerfumeId) return null;
    return (matchResult.allCatalogCandidates || []).find((c) => c.item.id === selectedPerfumeId) || null;
  }, [selectedPerfumeId, matchResult.allCatalogCandidates]);

  // Активный парфюм для отображения и резонанса
  const activePerfume: PerfumeItem = selectedCandidate
    ? selectedCandidate.item
    : (showAlternative && matchResult.alternative)
    ? matchResult.alternative
    : (matchResult.champion || matchResult.perfume);

  const activeScore: number = selectedCandidate
    ? selectedCandidate.score
    : (showAlternative && matchResult.alternativeScore !== undefined)
    ? matchResult.alternativeScore
    : matchResult.championScore;

  const activeReasons: string[] = selectedCandidate
    ? selectedCandidate.reasons
    : (!showAlternative ? matchResult.championReasons : []);

  const bottleImage = getPerfumeBottleImage(activePerfume);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    const parsed = parseNaturalLanguageQuery(query);
    onChangeCoords(parsed.coords);
    setShowAlternative(false);
    setSelectedPerfumeId(null);
    setImgError(false);

    // Фоновое логирование в Supabase
    logUserSituation(query, parsed.coords, activePerfume.id).catch(() => {});
  };

  const handleSelectOccasion = (occ: QuickOccasion) => {
    setSearchQuery(occ.label);
    onChangeCoords({
      ...coords,
      socialX: occ.coords.socialX,
      thermoY: occ.coords.thermoY,
      formalIndex: occ.coords.formalIndex,
      temperatureC: occ.coords.temperatureC ?? coords.temperatureC,
    });
    setShowAlternative(false);
    setSelectedPerfumeId(null);
    setImgError(false);

    logUserSituation(occ.label, {
      ...coords,
      socialX: occ.coords.socialX,
      thermoY: occ.coords.thermoY,
      formalIndex: occ.coords.formalIndex,
    }).catch(() => {});
  };

  const handleSetTemperature = (temp: number) => {
    onChangeCoords({
      ...coords,
      temperatureC: temp,
    });
    setSelectedPerfumeId(null);
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-300">
      {/* 1. Интро / Hero */}
      <div className="text-center max-w-2xl mx-auto space-y-2 pt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Персональный стилист &amp; Парфюмерный консьерж</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Что надеть и чем подушиться сегодня?
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Введите любую жизненную ситуацию — система подберет идеальный комплект одежды и флакон из вашей личной полки без ошибок.
        </p>
      </div>

      {/* 2. Поисковая строка и быстрые поводы */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col gap-4 shadow-xl">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Например: Романтический ужин в ресторане, переговоры с инвестором, прогулка в парке..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <span>Подобрать образ</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Быстрые готовые кнопки */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-slate-800/80">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-mono text-slate-500 mr-1">Популярные поводы:</span>
            {QUICK_OCCASIONS.map((occ) => (
              <button
                key={occ.id}
                type="button"
                onClick={() => handleSelectOccasion(occ)}
                className="px-3 py-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-750 border border-slate-700 hover:border-amber-500/50 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {occ.icon}
                <span>{occ.label}</span>
              </button>
            ))}
          </div>

          {/* Быстрая температура */}
          <div className="flex items-center gap-1 shrink-0 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
            <span className="text-[10px] font-mono text-slate-500 px-2">Погода:</span>
            <button
              type="button"
              onClick={() => handleSetTemperature(5)}
              className={`px-2 py-1 rounded-lg text-xs font-mono flex items-center gap-1 transition-all ${
                coords.temperatureC < 12
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Snowflake className="w-3 h-3" />
              <span>+5°C</span>
            </button>
            <button
              type="button"
              onClick={() => handleSetTemperature(19)}
              className={`px-2 py-1 rounded-lg text-xs font-mono flex items-center gap-1 transition-all ${
                coords.temperatureC >= 12 && coords.temperatureC <= 23
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>+19°C</span>
            </button>
            <button
              type="button"
              onClick={() => handleSetTemperature(28)}
              className={`px-2 py-1 rounded-lg text-xs font-mono flex items-center gap-1 transition-all ${
                coords.temperatureC > 23
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sun className="w-3 h-3 text-rose-400" />
              <span>+28°C</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Двухколоночный синтез: Гардероб + Парфюм */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ЛЕВАЯ КОЛОНКА: Комплект одежды (5 колонок) */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Shirt className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Гардеробная броня (L1–L4)
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {coords.formalIndex === 3 ? 'Business Formal' : coords.formalIndex === 2 ? 'Smart Casual' : 'Casual'}
            </span>
          </div>

          <div className="space-y-2.5">
            {/* L4 Верхняя одежда / Пиджак */}
            {outfit.l4 ? (
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">
                    L4 • Верхний слой
                  </span>
                  <p className="text-sm font-bold text-white mt-0.5">{outfit.l4.name}</p>
                  <p className="text-xs text-slate-400">
                    {outfit.l4.colorName} • Ткань: <strong className="text-slate-200">{outfit.l4.fabric}</strong>
                  </p>
                </div>
                <div
                  className="w-5 h-5 rounded-md border border-slate-700 shrink-0 mt-1 shadow-sm"
                  style={{ backgroundColor: outfit.l4.color }}
                  title={outfit.l4.colorName}
                />
              </div>
            ) : outfit.overwear ? (
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">
                    L4 • Верхняя защита
                  </span>
                  <p className="text-sm font-bold text-white mt-0.5">{outfit.overwear.name}</p>
                  <p className="text-xs text-slate-400">
                    {outfit.overwear.colorName} • Ткань: <strong className="text-slate-200">{outfit.overwear.fabric}</strong>
                  </p>
                </div>
                <div
                  className="w-5 h-5 rounded-md border border-slate-700 shrink-0 mt-1"
                  style={{ backgroundColor: outfit.overwear.color }}
                />
              </div>
            ) : null}

            {/* L3 Торс */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono font-bold text-sky-400 uppercase">
                  L3 • Торс
                </span>
                <p className="text-sm font-bold text-white mt-0.5">{outfit.l3.name}</p>
                <p className="text-xs text-slate-400">
                  {outfit.l3.colorName} • Ткань: <strong className="text-slate-200">{outfit.l3.fabric}</strong>
                </p>
              </div>
              <div
                className="w-5 h-5 rounded-md border border-slate-700 shrink-0 mt-1 shadow-sm"
                style={{ backgroundColor: outfit.l3.color }}
                title={outfit.l3.colorName}
              />
            </div>

            {/* L2 Брюки */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase">
                  L2 • Ноги
                </span>
                <p className="text-sm font-bold text-white mt-0.5">{outfit.l2.name}</p>
                <p className="text-xs text-slate-400">
                  {outfit.l2.colorName} • Ткань: <strong className="text-slate-200">{outfit.l2.fabric}</strong>
                </p>
              </div>
              <div
                className="w-5 h-5 rounded-md border border-slate-700 shrink-0 mt-1 shadow-sm"
                style={{ backgroundColor: outfit.l2.color }}
                title={outfit.l2.colorName}
              />
            </div>

            {/* L1 Обувь */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                  L1 • Обувь
                </span>
                <p className="text-sm font-bold text-white mt-0.5">{outfit.l1.name}</p>
                <p className="text-xs text-slate-400">
                  {outfit.l1.colorName} • Ткань: <strong className="text-slate-200">{outfit.l1.fabric}</strong>
                </p>
              </div>
              <div
                className="w-5 h-5 rounded-md border border-slate-700 shrink-0 mt-1 shadow-sm"
                style={{ backgroundColor: outfit.l1.color }}
                title={outfit.l1.colorName}
              />
            </div>
          </div>
        </div>

        {/* ПРАВАЯ КОЛОНКА: Идеальный парфюм (7 колонок) */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 shadow-xl">
          {/* Верхняя панель: Переключатели Полка / Каталог */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              {viewMode === 'concierge' ? (
                <Sparkles className="w-4 h-4 text-amber-400" />
              ) : (
                <LayoutGrid className="w-4 h-4 text-sky-400" />
              )}
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                {viewMode === 'concierge' ? 'Парфюм дня (Fragrance Mirror)' : 'Витрина Категории (Retail & Collector)'}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-950 p-0.5 rounded-xl border border-slate-800 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => {
                    if (isCatalogMode) onToggleCatalogMode();
                  }}
                  className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                    !isCatalogMode
                      ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-3 h-3" />
                  <span>Моя полка ({userShelfIds.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!isCatalogMode) onToggleCatalogMode();
                  }}
                  className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                    isCatalogMode
                      ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Compass className="w-3 h-3" />
                  <span>Весь каталог</span>
                </button>
              </div>

              <button
                type="button"
                onClick={onOpenShelfModal}
                className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-mono transition-colors cursor-pointer"
              >
                Настроить
              </button>
            </div>
          </div>

          {/* Главный переключатель: Режим консьержа (Топ-2) vs Витрина категории (Все подходящие) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-1.5 bg-slate-950 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setViewMode('concierge')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'concierge'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>🏆 Консьерж (Топ-2)</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('category')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'category'
                    ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>🏛️ Витрина категории ({categoryCandidates.length})</span>
              </button>
            </div>
            <span className="text-[10px] font-mono text-slate-400 pr-2">
              {viewMode === 'concierge' ? 'Экспресс-решение без сомнений' : 'Выбор по бренду, нотам и каталогу'}
            </span>
          </div>

          {/* Плашка активного выбора из витрины (если пользователь надел кастомный аромат) */}
          {selectedCandidate && (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-slate-950 to-slate-900 border border-amber-500/40 text-amber-200 text-xs shadow-md animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  Надет из витрины: <strong className="text-white font-bold">{activePerfume.brand} {activePerfume.name}</strong> ({activeScore}% совпадение с образом)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPerfumeId(null)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-[11px] font-mono flex items-center gap-1 cursor-pointer transition-colors shrink-0"
                title="Сбросить к рекомендации консьержа"
              >
                <RotateCcw className="w-3 h-3" />
                <span>К чемпиону</span>
              </button>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 1. РЕЖИМ КОНСЬЕРЖА: ЧЕМПИОН + КОНТРАСТНЫЙ ДУБЛЁР (МИНИМАЛИЗМ)           */}
          {/* ========================================================================= */}
          {viewMode === 'concierge' && (
            <div className="flex flex-col gap-4 animate-in fade-in duration-200">
              {/* Тумблер 1 Чемпион / 1 Альтернатива (если нет кастомного выбора) */}
              {!selectedCandidate && matchResult.alternative && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-1.5 bg-slate-950/70 rounded-xl border border-slate-800/80">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setShowAlternative(false)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        !showAlternative
                          ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Trophy className="w-3.5 h-3.5" />
                      <span>🏆 Главный выбор ({matchResult.championScore}%)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAlternative(true)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        showAlternative
                          ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Shuffle className="w-3.5 h-3.5" />
                      <span>🔄 Альтернативный вайб ({matchResult.alternativeScore}%)</span>
                    </button>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 pr-2">
                    {!showAlternative ? 'Бескомпромиссный чемпион' : 'Контрастный дублёр'}
                  </span>
                </div>
              )}

              {/* Карточка флакона */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                {/* Флакон (4 колонки) */}
                <div className="sm:col-span-4 flex flex-col items-center justify-center bg-slate-950/80 rounded-xl border border-slate-800 p-4 min-h-[200px] relative overflow-hidden group">
                  <div className="absolute top-2 left-2 z-10">
                    {matchResult.isFromShelf ? (
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        С вашей полки
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 flex items-center gap-1">
                        <Compass className="w-3 h-3 text-sky-400" />
                        Эталон
                      </span>
                    )}
                  </div>

                  {bottleImage && !imgError ? (
                    <img
                      src={bottleImage}
                      alt={`${activePerfume.brand} ${activePerfume.name}`}
                      onError={() => setImgError(true)}
                      className="h-36 max-h-[140px] w-auto max-w-[120px] object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)] filter transition-all duration-300 group-hover:scale-105 z-10"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-36 flex flex-col items-center justify-center text-center p-2">
                      <span className="text-xs font-serif font-bold text-amber-300">{activePerfume.brand}</span>
                      <span className="text-sm font-black text-white">{activePerfume.name}</span>
                    </div>
                  )}

                  <div className="mt-2 text-[10px] font-mono text-slate-400">
                    Диффузия: <strong className="text-slate-200">{activePerfume.diffusion}</strong>
                  </div>
                </div>

                {/* Описание и почему именно он (8 колонок) */}
                <div className="sm:col-span-8 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs text-amber-400 font-bold uppercase tracking-wider block">
                        {activePerfume.brand}
                      </span>
                      <h4 className="text-lg font-black text-white leading-tight">
                        {activePerfume.name}
                      </h4>
                      <p className="text-xs text-slate-300 italic mt-0.5">
                        «{activePerfume.dominantVibe}»
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                      {activeScore}% Совместимость
                    </span>
                  </div>

                  {/* 3 фактора победы (если Чемпион или кастомный выбор) */}
                  {activeReasons && activeReasons.length > 0 && (
                    <div className="bg-gradient-to-r from-amber-950/30 via-slate-950/80 to-slate-900/60 border border-amber-500/30 rounded-xl p-3 flex flex-col gap-1.5 shadow-sm">
                      <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-amber-300 uppercase tracking-wider">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>Почему выбран этот аромат:</span>
                      </div>
                      <ul className="text-xs text-slate-200 space-y-1">
                        {activeReasons.map((reason, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-[11px] leading-tight">
                            <span className="text-amber-400 font-bold">•</span>
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Характер альтернативы (если выбран дублёр) */}
                  {showAlternative && !selectedCandidate && matchResult.alternativeDifference && (
                    <div className="bg-gradient-to-r from-sky-950/30 via-slate-950/80 to-slate-900/60 border border-sky-500/30 rounded-xl p-3 flex flex-col gap-1 shadow-sm">
                      <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-sky-300 uppercase tracking-wider">
                        <Shuffle className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        <span>Альтернативный характер (Второй вайб):</span>
                      </div>
                      <p className="text-xs text-slate-100 font-medium leading-relaxed">
                        {matchResult.alternativeDifference}
                      </p>
                    </div>
                  )}

                  {/* Предупреждение о бреши на полке */}
                  {matchResult.hasWardrobeGap && matchResult.gapAdvice && (
                    <div className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-500/30 text-xs text-rose-200 flex flex-col gap-1">
                      <div className="flex items-center gap-1 font-bold text-rose-300 text-[11px] font-mono uppercase">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span>Ольфакторная брешь на полке</span>
                      </div>
                      <p className="text-[11px] text-rose-100/90 leading-snug">
                        {matchResult.gapAdvice}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Кнопка-приглашение в витрину категории */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-slate-950 via-slate-900 to-sky-950/40 border border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/25 flex items-center justify-center shrink-0">
                    <LayoutGrid className="w-4 h-4 text-sky-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Хотите больше выбора под эту ситуацию?</p>
                    <p className="text-[11px] text-slate-400">
                      В категории «{currentQuadrant.name}» доступно {categoryCandidates.length} ароматов мировых брендов.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setViewMode('category')}
                  className="px-3.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-sky-500/20 shrink-0 cursor-pointer"
                >
                  <span>Открыть витрину категории</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. РЕЖИМ ВИТРИНЫ КАТЕГОРИИ: ДЛЯ ИСКУШЕННОГО ПОКУПАТЕЛЯ И РИТЕЙЛА        */}
          {/* ========================================================================= */}
          {viewMode === 'category' && (
            <div className="flex flex-col gap-3.5 animate-in fade-in duration-200">
              {/* Категорийный баннер квадранта */}
              <div className={`p-3.5 rounded-xl border ${currentQuadrant.borderColor} ${currentQuadrant.bgColor} flex flex-col gap-1.5`}>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-950/80 border border-slate-700 text-white uppercase tracking-wider">
                      {currentQuadrant.name}
                    </span>
                    <span className="text-xs text-slate-300 font-mono">
                      {currentQuadrant.subtitle}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    Найдено: <strong className="text-white">{categoryCandidates.length}</strong> ароматов
                  </span>
                </div>
                <p className="text-xs text-slate-200 font-medium">
                  🎯 <strong>Цель образа:</strong> {currentQuadrant.primaryEnergy}
                </p>
                <p className="text-[11px] text-slate-300">
                  💨 <strong>Характер нот:</strong> {currentQuadrant.perfumeDirection}
                </p>
              </div>

              {/* Панель фильтров: поиск + охват квадранта + полка */}
              <div className="flex flex-col gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                      placeholder="Поиск по названию или ноте (ветивер, ирис, уд, кожа, бергамот...)"
                      className="w-full pl-8 pr-8 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
                    />
                    {categorySearch && (
                      <button
                        type="button"
                        onClick={() => setCategorySearch('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setScopeFilter(scopeFilter === 'quadrant' ? 'all' : 'quadrant')}
                      className={`px-2.5 py-2 rounded-lg text-[11px] font-mono transition-colors cursor-pointer border ${
                        scopeFilter === 'quadrant'
                          ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 font-bold'
                          : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                      }`}
                    >
                      {scopeFilter === 'quadrant' ? `Только квадрант (${quadrantCount})` : 'Все квадранты'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setShelfOnlyFilter(!shelfOnlyFilter)}
                      className={`px-2.5 py-2 rounded-lg text-[11px] font-mono transition-colors cursor-pointer border ${
                        shelfOnlyFilter
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                          : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                      }`}
                    >
                      Только с полки
                    </button>
                  </div>
                </div>

                {/* Чипсы брендов */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-700">
                  <span className="text-[10px] font-mono text-slate-500 shrink-0 mr-1 flex items-center gap-1">
                    <Filter className="w-3 h-3" />
                    Бренд:
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedBrand('ALL')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-mono shrink-0 transition-colors cursor-pointer ${
                      selectedBrand === 'ALL'
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                    }`}
                  >
                    Все ({categoryCandidates.length})
                  </button>
                  {availableBrands.map((brand) => (
                    <button
                      key={brand}
                      type="button"
                      onClick={() => setSelectedBrand(selectedBrand === brand ? 'ALL' : brand)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-mono shrink-0 transition-colors cursor-pointer ${
                        selectedBrand === brand
                          ? 'bg-sky-500 text-slate-950 font-bold'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              {/* Сетка карточек ароматов */}
              {categoryCandidates.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-slate-950 border border-slate-800 text-slate-400 space-y-2">
                  <p className="text-sm font-bold text-white">В этой выборке нет ароматов</p>
                  <p className="text-xs">
                    Попробуйте сбросить поисковый запрос или выбрать «Все квадранты».
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setCategorySearch('');
                      setSelectedBrand('ALL');
                      setScopeFilter('all');
                      setShelfOnlyFilter(false);
                    }}
                    className="mt-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-white font-mono transition-colors cursor-pointer"
                  >
                    Сбросить фильтры
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[560px] overflow-y-auto pr-1">
                  {categoryCandidates.map((cand) => {
                    const isEquipped = activePerfume.id === cand.item.id;
                    const isChampion = matchResult.champion.id === cand.item.id;
                    const isAlt = matchResult.alternative?.id === cand.item.id;
                    const candBottleImage = getPerfumeBottleImage(cand.item);

                    return (
                      <div
                        key={cand.item.id}
                        className={`p-3.5 rounded-xl border flex flex-col justify-between gap-3 transition-all ${
                          isEquipped
                            ? 'bg-slate-950 border-amber-500/70 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/50'
                            : 'bg-slate-950/70 hover:bg-slate-950 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex flex-col gap-2">
                          {/* Верх: Бренд и скор */}
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                                {cand.item.brand}
                              </span>
                              <h4 className="text-sm font-bold text-white leading-tight">
                                {cand.item.name}
                              </h4>
                            </div>
                            <span
                              className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md border shrink-0 ${
                                cand.score >= 90
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                  : cand.score >= 80
                                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                  : 'bg-slate-800 text-slate-300 border-slate-700'
                              }`}
                            >
                              {cand.score}%
                            </span>
                          </div>

                          {/* Центр: Картинка и вайб */}
                          <div className="flex items-center gap-3">
                            <div className="w-14 h-16 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 p-1 overflow-hidden">
                              {candBottleImage ? (
                                <img
                                  src={candBottleImage}
                                  alt={cand.item.name}
                                  className="h-full w-auto object-contain"
                                  loading="lazy"
                                />
                              ) : (
                                <span className="text-[10px] font-bold text-amber-400 text-center">
                                  {cand.item.brand.slice(0, 3)}
                                </span>
                              )}
                            </div>

                            <div className="flex flex-col gap-1 min-w-0">
                              <p className="text-[11px] text-slate-300 italic truncate">
                                «{cand.item.dominantVibe}»
                              </p>
                              <div className="flex items-center gap-1 flex-wrap">
                                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                                  {cand.item.diffusion}
                                </span>
                                {cand.isOwned && (
                                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                    На полке
                                  </span>
                                )}
                                {isChampion && (
                                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                    Чемпион
                                  </span>
                                )}
                                {isAlt && (
                                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40">
                                    Дублёр
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Ноты */}
                          <div className="text-[10px] text-slate-400 flex items-center gap-1 flex-wrap pt-1 border-t border-slate-900">
                            <span className="text-slate-500">Ноты:</span>
                            <span>{cand.item.pyramid.top.slice(0, 2).join(', ')}, {cand.item.pyramid.base[0] || cand.item.pyramid.heart[0]}</span>
                          </div>
                        </div>

                        {/* Кнопка выбора / статус */}
                        <div className="pt-2">
                          {isEquipped ? (
                            <div className="w-full py-1.5 px-3 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5">
                              <Check className="w-3.5 h-3.5" />
                              <span>Выбран для образа</span>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setSelectedPerfumeId(cand.item.id)}
                              className="w-full py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-gradient-to-r hover:from-amber-500 hover:to-amber-600 hover:text-slate-950 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                            >
                              <span>Надеть этот аромат</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 4. Нижний футер-переходник в PRO */}
      <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-sky-400 shrink-0" />
          <span>
            Хотите вручную подвигать 2D-координаты, настроить 4 гардеробных слоя или открыть Периодическую таблицу нот?
          </span>
        </div>
        <button
          type="button"
          onClick={onSwitchToPro}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center gap-1.5 transition-colors shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <span>Открыть Лабораторию Pro</span>
          <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
        </button>
      </div>
    </div>
  );
};
