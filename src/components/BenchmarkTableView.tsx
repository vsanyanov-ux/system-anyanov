import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Crown, 
  Droplets, 
  Layers, 
  ArrowRight, 
  Check, 
  SlidersHorizontal,
  Flame,
  ShieldCheck,
  Compass,
  Shirt,
  Info,
  Calendar,
  Grid,
  MapPin,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { AnyanovCoordinates } from '../types';
import { 
  GOLDEN_PERFUMES_21, 
  GOLDEN_WARDROBE_21, 
  GOLDEN_MIRROR_PAIRS_21,
  GoldenMirrorPair
} from '../data/golden21';
import { WARDROBE_ITEMS } from '../data/wardrobeItems';
import { getPerfumeBottleImage } from '../data/fragrances';

interface BenchmarkTableViewProps {
  currentCoords: AnyanovCoordinates;
  onApplyCoords: (coords: AnyanovCoordinates) => void;
  onSwitchTab: (tab: 'simple' | 'pro') => void;
  onLoadGoldenShelf: () => void;
  is21Mode: boolean;
  onToggle21Mode: () => void;
}

type ViewMode = 'matrix' | 'mirror' | 'perfumes' | 'wardrobe';
type QuadrantFilter = 'ALL' | 'NW_FOCUS' | 'NE_EASE' | 'SW_POWER' | 'SE_SEDUCTION' | 'CENTER';

export const BenchmarkTableView: React.FC<BenchmarkTableViewProps> = ({
  onApplyCoords,
  onSwitchTab,
  onLoadGoldenShelf,
  is21Mode,
  onToggle21Mode,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('matrix');
  const [quadrantFilter, setQuadrantFilter] = useState<QuadrantFilter>('ALL');
  const [selectedPerfumeId, setSelectedPerfumeId] = useState<string>('bleu-de-chanel-edp');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Переключение фильтра (повторный клик сбрасывает на 'ALL')
  const handleQuadrantToggle = (q: QuadrantFilter) => {
    setQuadrantFilter((prev) => (prev === q ? 'ALL' : q));
  };

  // Фильтрация пар зеркал (View A)
  const filteredPairs = useMemo(() => {
    return GOLDEN_MIRROR_PAIRS_21.filter((pair) => {
      if (quadrantFilter === 'ALL') return true;
      return pair.quadrantCode === quadrantFilter;
    });
  }, [quadrantFilter]);

  // Фильтрация духов (View B: Таблица 21 Аромата)
  const filteredPerfumes = useMemo(() => {
    return GOLDEN_PERFUMES_21.filter((p) => {
      if (quadrantFilter === 'ALL') return true;
      const pair = GOLDEN_MIRROR_PAIRS_21.find((pair) => pair.perfumeId === p.id);
      return pair?.quadrantCode === quadrantFilter;
    });
  }, [quadrantFilter]);

  // Предметы гардероба, задействованные в выбранном квадранте (View C)
  const activeWardrobeIds = useMemo(() => {
    if (quadrantFilter === 'ALL') return null;
    const pairsInQuadrant = GOLDEN_MIRROR_PAIRS_21.filter((p) => p.quadrantCode === quadrantFilter);
    const ids = new Set<string>();
    pairsInQuadrant.forEach((p) => {
      if (p.suggestedOutfit.l4Id) ids.add(p.suggestedOutfit.l4Id);
      if (p.suggestedOutfit.l3Id) ids.add(p.suggestedOutfit.l3Id);
      if (p.suggestedOutfit.l2Id) ids.add(p.suggestedOutfit.l2Id);
      if (p.suggestedOutfit.l1Id) ids.add(p.suggestedOutfit.l1Id);
    });
    return ids;
  }, [quadrantFilter]);

  const handleTryPair = (pair: GoldenMirrorPair) => {
    onApplyCoords(pair.idealCoords);
    setCopiedId(pair.perfumeId);
    setTimeout(() => {
      onSwitchTab('simple');
    }, 400);
  };

  // Поиск предметов одежды для карточки
  const getWardrobeItem = (id?: string) => {
    if (!id) return null;
    return WARDROBE_ITEMS.find((w) => w.id === id);
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto pb-16 animate-in fade-in duration-300">
      
      {/* 1. HERO BANNER: Зеркало Духов (Периодическая Таблица 21 Якорь) */}
      <section className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-950 border border-amber-500/30 shadow-2xl overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>ANYANOV 21 • ПЕРИОДИЧЕСКАЯ ТАБЛИЦА МУЖСКИХ АРОМАТОВ</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Зеркало Духов: 21 Канонический Якорь
            </h2>
            
            <p className="text-sm text-slate-300 leading-relaxed">
              Математически совершенная система стиля: <strong className="text-amber-400">21 эталонный аромат</strong> (1 центральный камертон баланса + 4 осевых полюса + 16 квадрантных эталонов) и <strong className="text-sky-400">21 предмет капсульного гардероба</strong> ($5 + 7 + 5 + 4 = 21$). Каждая связка выверена на абсолютный унисон тканей и ольфакторных молекул.
            </p>
          </div>

          {/* Quick Actions / Controls */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto">
            {/* Тумблер Режим 21 */}
            <button
              onClick={onToggle21Mode}
              className={`flex items-center justify-between sm:justify-start gap-3 px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all shadow-md cursor-pointer ${
                is21Mode
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black border-amber-400 shadow-amber-500/20'
                  : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:border-amber-500/50'
              }`}
              title="Ограничить подбор гардероба и парфюма только этой эталонной 21-кой"
            >
              <div className="flex items-center gap-2">
                <Crown className={`w-4 h-4 ${is21Mode ? 'text-black' : 'text-amber-400'}`} />
                <span>Режим 21: {is21Mode ? 'АКТИВЕН' : 'ВЫКЛ'}</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-md font-mono ${is21Mode ? 'bg-black/20 text-black font-extrabold' : 'bg-slate-800 text-slate-400'}`}>
                {is21Mode ? 'Строгий канон' : 'Весь каталог'}
              </span>
            </button>

            {/* Загрузить 21 аромат на полку */}
            <button
              onClick={onLoadGoldenShelf}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-100 border border-slate-700 hover:border-amber-500/50 text-xs font-bold transition-all shadow-sm cursor-pointer"
              title="Загрузить все 21 эталонных флакона в вашу личную парфюмерную полку"
            >
              <Droplets className="w-4 h-4 text-amber-400" />
              <span>Загрузить 21 на полку</span>
            </button>
          </div>
        </div>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm">
              21
            </div>
            <div>
              <div className="text-xs font-bold text-white">Эталонных Аромата</div>
              <div className="text-[11px] text-slate-400 font-mono">1 Камертон + 4 Полюса + 16 Сетки</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold text-sm">
              21
            </div>
            <div>
              <div className="text-xs font-bold text-white">Предмет Гардероба</div>
              <div className="text-[11px] text-slate-400 font-mono">Формула: 5 L4 + 7 L3 + 5 L2 + 4 L1</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm">
              441
            </div>
            <div>
              <div className="text-xs font-bold text-white">Гармонических Связей</div>
              <div className="text-[11px] text-slate-400 font-mono">21 × 21 матрица резонанса</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. NAVIGATION & QUADRANT FILTERS */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Mode Tabs */}
        <div className="flex items-center flex-wrap sm:flex-nowrap bg-slate-900/90 p-1 rounded-2xl border border-slate-800 shadow-inner">
          <button
            onClick={() => setViewMode('matrix')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'matrix'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Периодическая Таблица (Сетка 21)</span>
          </button>

          <button
            onClick={() => setViewMode('mirror')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'mirror'
                ? 'bg-amber-500 text-black shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Зеркало Духов и Луков (21)</span>
          </button>

          <button
            onClick={() => setViewMode('perfumes')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'perfumes'
                ? 'bg-slate-800 text-white shadow border border-slate-700 font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Droplets className="w-3.5 h-3.5 text-amber-400" />
            <span>21 Аромат (Таблица)</span>
          </button>

          <button
            onClick={() => setViewMode('wardrobe')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'wardrobe'
                ? 'bg-slate-800 text-white shadow border border-slate-700 font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shirt className="w-3.5 h-3.5 text-sky-400" />
            <span>21 Предмет Капсулы</span>
          </button>
        </div>

        {/* Quadrant Quick Filter */}
        <div className="flex items-center flex-wrap gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => handleQuadrantToggle('ALL')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              quadrantFilter === 'ALL'
                ? 'bg-slate-800 text-white font-bold border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Все (21)
          </button>
          <button
            onClick={() => handleQuadrantToggle('NW_FOCUS')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              quadrantFilter === 'NW_FOCUS'
                ? 'bg-sky-950 text-sky-300 font-bold border border-sky-600/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ❄️ II. Холод (4)
          </button>
          <button
            onClick={() => handleQuadrantToggle('NE_EASE')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              quadrantFilter === 'NE_EASE'
                ? 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-600/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🌊 I. Свежесть (4)
          </button>
          <button
            onClick={() => handleQuadrantToggle('SW_POWER')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              quadrantFilter === 'SW_POWER'
                ? 'bg-amber-950 text-amber-300 font-bold border border-amber-600/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🏛️ III. Статус (4)
          </button>
          <button
            onClick={() => handleQuadrantToggle('SE_SEDUCTION')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              quadrantFilter === 'SE_SEDUCTION'
                ? 'bg-rose-950 text-rose-300 font-bold border border-rose-600/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🔥 IV. Тепло (4)
          </button>
          <button
            onClick={() => handleQuadrantToggle('CENTER')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              quadrantFilter === 'CENTER'
                ? 'bg-indigo-950 text-indigo-300 font-bold border border-indigo-600/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🧭 Оси и Центр (5)
          </button>
        </div>
      </div>

      {/* 3. CONTENT AREA BASED ON VIEW MODE */}

      {/* VIEW 0: ИНТЕРАКТИВНАЯ ПЕРИОДИЧЕСКАЯ ТАБЛИЦА (СЕТКА 21 ЯКОРЬ) */}
      {viewMode === 'matrix' && (
        <div className="space-y-6">
          {/* Main Board Container */}
          <div className="relative rounded-3xl p-4 sm:p-8 bg-slate-950/90 border border-slate-800 shadow-2xl overflow-hidden">
            {/* Ambient Quadrant Glows */}
            <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-sky-600/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-zinc-600/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* TOP AXIS: +Y ЛЕТУЧЕСТЬ / ДЕНЬ / ЛЕТО */}
            <div className="text-center pb-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-950/70 border border-sky-600/40 text-sky-300 font-mono text-xs font-black tracking-wider uppercase shadow-sm">
                <span>↑ +Y: ЛЕТУЧЕСТЬ / ДЕНЬ / ЛЕТО</span>
              </div>
            </div>

            {/* THE 2D COORDINATE GRID */}
            <div className="relative max-w-5xl mx-auto">
              {/* Vertical & Horizontal Crosshair Guide Lines */}
              <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-slate-800/80 pointer-events-none" />
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-slate-800/80 pointer-events-none" />

              {/* NORTH POLE (+Y) */}
              <div className="flex justify-center mb-6">
                <div className="w-full max-w-xs">
                  {(() => {
                    const p = GOLDEN_PERFUMES_21.find(item => item.id === '4711-eau-de-cologne');
                    const pair = GOLDEN_MIRROR_PAIRS_21.find(item => item.perfumeId === '4711-eau-de-cologne');
                    if (!p) return null;
                    const isSelected = selectedPerfumeId === p.id;
                    return (
                      <div
                        onClick={() => setSelectedPerfumeId(p.id)}
                        className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/50 shadow-lg scale-105'
                            : 'bg-slate-900/90 border-sky-600/40 hover:border-sky-400'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono text-sky-400 font-bold mb-1">
                          <span>СЕВЕР (+Y: 0.90)</span>
                          <span className="bg-slate-800 px-1.5 py-0.2 rounded text-slate-300">1792</span>
                        </div>
                        <div className="text-sm font-black text-white truncate">{p.name}</div>
                        <div className="text-[11px] text-slate-400 truncate">{p.dominantVibe}</div>
                        <div className="mt-2 text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950/60 border border-sky-800/40 text-sky-300 inline-block font-semibold">
                          {pair?.outfitName ? `${pair.outfitName} • ${pair.badge}` : (pair?.badge || 'Зенит Летучести')}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* QUADRANTS CONTAINER (UPPER & LOWER ROWS) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 relative z-10">
                
                {/* QUADRANT II (TOP-LEFT): ХОЛОДНЫЙ КОНТРОЛЬ (-X, +Y) */}
                <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800/80 shadow-md">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/60 text-xs font-bold text-sky-300">
                    <span className="font-mono">II. ХОЛОДНЫЙ КОНТРОЛЬ (-X, +Y)</span>
                    <span className="text-[10px] font-mono text-slate-400">Фокус и Дистанция</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {['dior-eau-sauvage', 'prada-lhomme', 'paco-rabanne-pour-homme', 'ysl-lhomme'].map((id) => {
                      const p = GOLDEN_PERFUMES_21.find(item => item.id === id);
                      const pair = GOLDEN_MIRROR_PAIRS_21.find(item => item.perfumeId === id);
                      if (!p) return null;
                      const isSelected = selectedPerfumeId === id;
                      return (
                        <div
                          key={id}
                          onClick={() => setSelectedPerfumeId(id)}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                            isSelected
                              ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/50 shadow-md scale-[1.02]'
                              : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-600'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] font-mono">
                            <span className="text-amber-400/90 uppercase truncate">{p.brand}</span>
                            <span className="text-slate-400 font-bold bg-slate-900 px-1 rounded">{pair?.releaseYear}</span>
                          </div>
                          <div className="text-xs font-bold text-white truncate">{p.name}</div>
                          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                            <span className="text-sky-400/90 truncate font-semibold">{pair?.outfitName || pair?.badge}</span>
                            <span>[{p.xCoord}, {p.yCoord > 0 ? `+${p.yCoord}` : p.yCoord}]</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* QUADRANT I (TOP-RIGHT): ОТКРЫТАЯ СВЕЖЕСТЬ (+X, +Y) */}
                <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-cyan-950/40 to-slate-950/90 border border-cyan-900/40 shadow-md">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/60 text-xs font-bold text-cyan-300">
                    <span className="font-mono">I. ОТКРЫТАЯ СВЕЖЕСТЬ (+X, +Y)</span>
                    <span className="text-[10px] font-mono text-slate-400">Морской Бриз и Энергия</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {['versace-man-eau-fraiche', 'acqua-di-gio', 'dior-sauvage', 'dior-homme-cologne'].map((id) => {
                      const p = GOLDEN_PERFUMES_21.find(item => item.id === id);
                      const pair = GOLDEN_MIRROR_PAIRS_21.find(item => item.perfumeId === id);
                      if (!p) return null;
                      const isSelected = selectedPerfumeId === id;
                      return (
                        <div
                          key={id}
                          onClick={() => setSelectedPerfumeId(id)}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                            isSelected
                              ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/50 shadow-md scale-[1.02]'
                              : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-600'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] font-mono">
                            <span className="text-amber-400/90 uppercase truncate">{p.brand}</span>
                            <span className="text-slate-400 font-bold bg-slate-900 px-1 rounded">{pair?.releaseYear}</span>
                          </div>
                          <div className="text-xs font-bold text-white truncate">{p.name}</div>
                          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                            <span className="text-cyan-400/90 truncate font-semibold">{pair?.outfitName || pair?.badge}</span>
                            <span>[+{p.xCoord}, +{p.yCoord}]</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* EQUATOR ROW: WEST (-X), CENTER (0,0), EAST (+X) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6 relative z-20 items-center">
                
                {/* WEST POLE (-X) */}
                <div>
                  {(() => {
                    const p = GOLDEN_PERFUMES_21.find(item => item.id === 'chanel-platinum-egoiste');
                    const pair = GOLDEN_MIRROR_PAIRS_21.find(item => item.perfumeId === 'chanel-platinum-egoiste');
                    if (!p) return null;
                    const isSelected = selectedPerfumeId === p.id;
                    return (
                      <div
                        onClick={() => setSelectedPerfumeId(p.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/50 shadow-lg scale-105'
                            : 'bg-slate-900/90 border-slate-700 hover:border-slate-500'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-300 font-bold mb-1">
                          <span>ЗАПАД (-X: -0.95)</span>
                          <span className="bg-slate-800 px-1.5 py-0.2 rounded">1993</span>
                        </div>
                        <div className="text-xs sm:text-sm font-black text-white truncate">{p.name}</div>
                        <div className="text-[10px] text-amber-400/90 uppercase font-mono">{p.brand}</div>
                        <div className="mt-1.5 text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 inline-block font-semibold">
                          {pair?.outfitName ? `${pair.outfitName} • ${pair.badge}` : (pair?.badge || 'Абсолютный Барьер')}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* CENTER (0,0): BLEU DE CHANEL */}
                <div className="transform md:scale-105">
                  {(() => {
                    const p = GOLDEN_PERFUMES_21.find(item => item.id === 'bleu-de-chanel-edp');
                    const pair = GOLDEN_MIRROR_PAIRS_21.find(item => item.perfumeId === 'bleu-de-chanel-edp');
                    if (!p) return null;
                    const isSelected = selectedPerfumeId === p.id;
                    return (
                      <div
                        onClick={() => setSelectedPerfumeId(p.id)}
                        className={`p-4 rounded-3xl border text-center transition-all cursor-pointer shadow-xl ${
                          isSelected
                            ? 'bg-amber-500/25 border-amber-400 ring-4 ring-amber-400/40 scale-110 shadow-amber-500/20'
                            : 'bg-gradient-to-b from-slate-900 to-indigo-950/80 border-amber-500/50 hover:border-amber-400'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-amber-400 font-bold mb-1">
                          <Crown className="w-3 h-3" />
                          <span>ЦЕНТР • КАМЕРТОН (0.0, 0.0)</span>
                        </div>
                        <div className="text-base font-black text-white tracking-tight">{p.name}</div>
                        <div className="text-xs text-amber-400/90 font-mono uppercase">{p.brand} (2010)</div>
                        <div className="mt-2 text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 inline-block font-bold">
                          {pair?.outfitName ? `${pair.outfitName} • ${pair.badge}` : (pair?.badge || 'Точка Баланса')}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* EAST POLE (+X) */}
                <div>
                  {(() => {
                    const p = GOLDEN_PERFUMES_21.find(item => item.id === 'jpg-ultra-male');
                    const pair = GOLDEN_MIRROR_PAIRS_21.find(item => item.perfumeId === 'jpg-ultra-male');
                    if (!p) return null;
                    const isSelected = selectedPerfumeId === p.id;
                    return (
                      <div
                        onClick={() => setSelectedPerfumeId(p.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/50 shadow-lg scale-105'
                            : 'bg-slate-900/90 border-blue-600/40 hover:border-blue-400'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono text-blue-300 font-bold mb-1">
                          <span>ВОСТОК (+X: +0.95)</span>
                          <span className="bg-slate-800 px-1.5 py-0.2 rounded text-slate-300">2015</span>
                        </div>
                        <div className="text-xs sm:text-sm font-black text-white truncate">{p.name}</div>
                        <div className="text-[10px] text-amber-400/90 uppercase font-mono">{p.brand}</div>
                        <div className="mt-1.5 text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/60 border border-blue-800/40 text-blue-300 inline-block font-semibold">
                          {pair?.outfitName ? `${pair.outfitName} • ${pair.badge}` : (pair?.badge || 'Максимальный Контакт')}
                        </div>
                      </div>
                    );
                  })()}
                </div>

              </div>

              {/* LOWER ROW: QUADRANT III & QUADRANT IV */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 relative z-10">
                
                {/* QUADRANT III (BOTTOM-LEFT): ТЕМНЫЙ СТАТУС (-X, -Y) */}
                <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-zinc-950/90 to-slate-950/90 border border-zinc-800/80 shadow-md">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/60 text-xs font-bold text-amber-200">
                    <span className="font-mono">III. ТЕМНЫЙ СТАТУС (-X, -Y)</span>
                    <span className="text-[10px] font-mono text-slate-400">Монументальная Власть</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {['terre-dhermes', 'guy-laroche-drakkar-noir', 'dior-homme-intense', 'versace-oud-noir'].map((id) => {
                      const p = GOLDEN_PERFUMES_21.find(item => item.id === id);
                      const pair = GOLDEN_MIRROR_PAIRS_21.find(item => item.perfumeId === id);
                      if (!p) return null;
                      const isSelected = selectedPerfumeId === id;
                      return (
                        <div
                          key={id}
                          onClick={() => setSelectedPerfumeId(id)}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                            isSelected
                              ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/50 shadow-md scale-[1.02]'
                              : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-600'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] font-mono">
                            <span className="text-amber-400/90 uppercase truncate">{p.brand}</span>
                            <span className="text-slate-400 font-bold bg-slate-900 px-1 rounded">{pair?.releaseYear}</span>
                          </div>
                          <div className="text-xs font-bold text-white truncate">{p.name}</div>
                          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                            <span className="text-amber-400/90 truncate font-semibold">{pair?.outfitName || pair?.badge}</span>
                            <span>[{p.xCoord}, {p.yCoord}]</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* QUADRANT IV (BOTTOM-RIGHT): ТАКТИЛЬНОЕ ТЕПЛО (+X, -Y) */}
                <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-amber-950/30 to-slate-950/90 border border-amber-900/40 shadow-md">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/60 text-xs font-bold text-rose-300">
                    <span className="font-mono">IV. ТАКТИЛЬНОЕ ТЕПЛО (+X, -Y)</span>
                    <span className="text-[10px] font-mono text-slate-400">Соблазн и Уют</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {['creed-aventus', 'versace-eros', 'jpg-le-male', 'lattafa-khamrah'].map((id) => {
                      const p = GOLDEN_PERFUMES_21.find(item => item.id === id);
                      const pair = GOLDEN_MIRROR_PAIRS_21.find(item => item.perfumeId === id);
                      if (!p) return null;
                      const isSelected = selectedPerfumeId === id;
                      return (
                        <div
                          key={id}
                          onClick={() => setSelectedPerfumeId(id)}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                            isSelected
                              ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/50 shadow-md scale-[1.02]'
                              : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-600'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] font-mono">
                            <span className="text-amber-400/90 uppercase truncate">{p.brand}</span>
                            <span className="text-slate-400 font-bold bg-slate-900 px-1 rounded">{pair?.releaseYear}</span>
                          </div>
                          <div className="text-xs font-bold text-white truncate">{p.name}</div>
                          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                            <span className="text-rose-400/90 truncate font-semibold">{pair?.outfitName || pair?.badge}</span>
                            <span>[+{p.xCoord}, {p.yCoord}]</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* SOUTH POLE (-Y) */}
              <div className="flex justify-center mt-6">
                <div className="w-full max-w-xs">
                  {(() => {
                    const p = GOLDEN_PERFUMES_21.find(item => item.id === 'tom-ford-tuscan-leather');
                    const pair = GOLDEN_MIRROR_PAIRS_21.find(item => item.perfumeId === 'tom-ford-tuscan-leather');
                    if (!p) return null;
                    const isSelected = selectedPerfumeId === p.id;
                    return (
                      <div
                        onClick={() => setSelectedPerfumeId(p.id)}
                        className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/50 shadow-lg scale-105'
                            : 'bg-slate-900/90 border-amber-800/40 hover:border-amber-500'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono text-amber-400 font-bold mb-1">
                          <span>ЮГ (-Y: -0.85)</span>
                          <span className="bg-slate-800 px-1.5 py-0.2 rounded text-slate-300">2007</span>
                        </div>
                        <div className="text-sm font-black text-white truncate">{p.name}</div>
                        <div className="text-[11px] text-slate-400 truncate">{p.dominantVibe}</div>
                        <div className="mt-2 text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800/40 text-amber-300 inline-block font-semibold">
                          {pair?.outfitName ? `${pair.outfitName} • ${pair.badge}` : (pair?.badge || 'Надир Плотности')}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

            </div>

            {/* BOTTOM AXIS: -Y ПЛОТНОСТЬ / ВЕЧЕР / ЗИМА */}
            <div className="text-center pt-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/70 border border-amber-600/40 text-amber-300 font-mono text-xs font-black tracking-wider uppercase shadow-sm">
                <span>↓ -Y: ПЛОТНОСТЬ / ВЕЧЕР / ЗИМА</span>
              </div>
              <div className="text-[11px] font-mono text-slate-400 mt-2 uppercase tracking-widest">
                ОСЬ X: СОЦИАЛЬНАЯ ПРОКСЕМИКА (БАРЬЕР ↔ СБЛИЖЕНИЕ)
              </div>
            </div>

          </div>

          {/* BENCHMARK INSPECTOR: ПОДРОБНЫЙ АНАЛИЗ ВЫБРАННОГО ЭТАЛОНА */}
          {(() => {
            const currentPerfume = GOLDEN_PERFUMES_21.find(p => p.id === selectedPerfumeId) || GOLDEN_PERFUMES_21[0];
            const currentPair = GOLDEN_MIRROR_PAIRS_21.find(pair => pair.perfumeId === currentPerfume.id);
            if (!currentPair) return null;

            const l4 = getWardrobeItem(currentPair.suggestedOutfit.l4Id);
            const l3 = getWardrobeItem(currentPair.suggestedOutfit.l3Id);
            const l2 = getWardrobeItem(currentPair.suggestedOutfit.l2Id);
            const l1 = getWardrobeItem(currentPair.suggestedOutfit.l1Id);
            const isCopied = copiedId === currentPair.perfumeId;

            return (
              <div className="rounded-3xl p-6 sm:p-8 bg-slate-900/90 border border-amber-500/40 shadow-2xl space-y-6 animate-in fade-in duration-200">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/30">
                        {currentPair.badge}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        {currentPair.quadrantName}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                      <span>{currentPerfume.name}</span>
                      <span className="text-base text-amber-400/90 font-mono font-normal uppercase">
                        {currentPerfume.brand} ({currentPair.releaseYear})
                      </span>
                    </h3>
                  </div>

                  <button
                    onClick={() => handleTryPair(currentPair)}
                    className={`px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                      isCopied
                        ? 'bg-emerald-500 text-black shadow-emerald-500/20'
                        : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold shadow-amber-500/20'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Применено в калькуляторе!</span>
                      </>
                    ) : (
                      <>
                        <span>Примерить этот эталон</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                {/* Details 3-column split */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Col 1: Fragrance Specs & Pyramid */}
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-[11px] font-mono text-amber-400 font-bold uppercase flex items-center gap-2">
                        <Droplets className="w-3.5 h-3.5" />
                        <span>Ольфакторный профиль</span>
                      </div>
                      {getPerfumeBottleImage(currentPerfume) && (
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                          <span>Флакон эталона</span>
                        </span>
                      )}
                    </div>

                    {getPerfumeBottleImage(currentPerfume) && (
                      <div className="relative w-full h-36 bg-slate-900/60 rounded-xl border border-slate-800/80 p-2 flex items-center justify-center overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 to-transparent blur-md pointer-events-none" />
                        <img
                          src={getPerfumeBottleImage(currentPerfume)!}
                          alt={currentPerfume.name}
                          className="h-full w-auto max-w-[120px] object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)] filter group-hover:scale-105 transition-transform select-none z-10"
                          loading="lazy"
                        />
                      </div>
                    )}

                    <div className="text-xs text-slate-300 leading-relaxed italic">
                      «{currentPerfume.dominantVibe}»
                    </div>
                    <div className="pt-2 border-t border-slate-800/80 space-y-2 text-xs">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 block uppercase">Верхние ноты:</span>
                        <span className="text-slate-300 font-medium">{currentPerfume.pyramid?.top?.join(', ') || '—'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-amber-400/80 block uppercase">Сердце:</span>
                        <span className="text-amber-200 font-medium">{currentPerfume.pyramid?.heart?.join(', ') || '—'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-indigo-400/80 block uppercase">База:</span>
                        <span className="text-indigo-200 font-medium">{currentPerfume.pyramid?.base?.join(', ') || '—'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Col 2: Resonance Rationale */}
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="text-[11px] font-mono text-sky-400 font-bold uppercase flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Сарториальный резонанс</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed italic">
                        «{currentPair.mirrorExplanation}»
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400">
                      <div>
                        <span className="block text-[10px] uppercase">Диффузия:</span>
                        <span className="text-slate-200 font-bold">{currentPerfume.diffusion}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase">Координаты:</span>
                        <span className="text-slate-200 font-bold">[{currentPair.idealCoords.socialX}, {currentPair.idealCoords.thermoY}]</span>
                      </div>
                    </div>
                  </div>

                  {/* Col 3: Paired Wardrobe Look */}
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-[11px] font-mono text-emerald-400 font-bold uppercase flex items-center gap-2">
                        <Shirt className="w-3.5 h-3.5" />
                        <span>Наряд-зеркало</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                        {currentPair.outfitName}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      {l4 && (
                        <div className="p-2 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-between gap-2">
                          <div className="truncate">
                            <span className="text-[10px] font-mono text-amber-400 font-bold mr-1.5">L4:</span>
                            <span className="text-white font-medium">{l4.name}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono shrink-0">{l4.fabric.split(' ')[0]}</span>
                        </div>
                      )}
                      {l3 && (
                        <div className="p-2 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-between gap-2">
                          <div className="truncate">
                            <span className="text-[10px] font-mono text-sky-400 font-bold mr-1.5">L3:</span>
                            <span className="text-white font-medium">{l3.name}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono shrink-0">{l3.fabric.split(' ')[0]}</span>
                        </div>
                      )}
                      {l2 && (
                        <div className="p-2 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-between gap-2">
                          <div className="truncate">
                            <span className="text-[10px] font-mono text-emerald-400 font-bold mr-1.5">L2:</span>
                            <span className="text-white font-medium">{l2.name}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono shrink-0">{l2.fabric.split(' ')[0]}</span>
                        </div>
                      )}
                      {l1 && (
                        <div className="p-2 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-between gap-2">
                          <div className="truncate">
                            <span className="text-[10px] font-mono text-indigo-400 font-bold mr-1.5">L1:</span>
                            <span className="text-white font-medium">{l1.name}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono shrink-0">{l1.category}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* VIEW A: ЗЕРКАЛО ДУХОВ И ПАРНЫХ ЛУКОВ */}
      {viewMode === 'mirror' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPairs.map((pair) => {
            const perfume = GOLDEN_PERFUMES_21.find((p) => p.id === pair.perfumeId);
            if (!perfume) return null;

            const l4 = getWardrobeItem(pair.suggestedOutfit.l4Id);
            const l3 = getWardrobeItem(pair.suggestedOutfit.l3Id);
            const l2 = getWardrobeItem(pair.suggestedOutfit.l2Id);
            const l1 = getWardrobeItem(pair.suggestedOutfit.l1Id);

            const isCopied = copiedId === pair.perfumeId;
            const canonicalIndex = GOLDEN_MIRROR_PAIRS_21.findIndex((p) => p.perfumeId === pair.perfumeId) + 1;

            return (
              <div
                key={pair.perfumeId}
                className="rounded-3xl p-5 bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between gap-4 shadow-xl hover:shadow-2xl group relative overflow-hidden"
              >
                {/* Top: Quadrant badge & number */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                      #{canonicalIndex}
                    </span>
                    <span className="text-xs font-bold text-amber-400">
                      {pair.badge}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">
                    {pair.quadrantCode.replace('_', ' ')}
                  </span>
                </div>

                {/* Fragrance Section */}
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    {(() => {
                      const bottleImg = getPerfumeBottleImage(perfume);
                      if (!bottleImg) return null;
                      return (
                        <div className="w-12 h-16 shrink-0 bg-slate-950/80 rounded-xl border border-slate-800 p-1 flex items-center justify-center overflow-hidden shadow-inner">
                          <img
                            src={bottleImg}
                            alt={perfume.name}
                            className="max-h-full max-w-full object-contain drop-shadow"
                            loading="lazy"
                          />
                        </div>
                      );
                    })()}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <div className="min-w-0">
                          <div className="text-[11px] font-mono text-amber-400/90 uppercase tracking-wider truncate">
                            {perfume.brand}
                          </div>
                          <div className="text-base font-black text-white tracking-tight group-hover:text-amber-300 transition-colors truncate">
                            {perfume.name}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[10px] font-mono text-slate-400 block">
                            [{perfume.xCoord > 0 ? `+${perfume.xCoord}` : perfume.xCoord},{' '}
                            {perfume.yCoord > 0 ? `+${perfume.yCoord}` : perfume.yCoord}]
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                            {perfume.diffusion}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pyramid snippet */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {(perfume.pyramid?.top || []).slice(0, 2).map((note, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                        {note}
                      </span>
                    ))}
                    {(perfume.pyramid?.heart || []).slice(0, 1).map((note, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950 text-amber-400/90 border border-slate-800">
                        {note}
                      </span>
                    ))}
                    {(perfume.pyramid?.base || []).slice(0, 1).map((note, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950 text-indigo-400/90 border border-slate-800">
                        {note}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Mirror Outfit Capsule */}
                <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1.5">
                      <Shirt className="w-3 h-3 text-sky-400" />
                      <span>Наряд:</span>
                    </div>
                    <span className="text-xs font-bold text-amber-300 font-mono">
                      {pair.outfitName}
                    </span>
                  </div>

                  <div className="text-xs space-y-1 text-slate-300">
                    {l4 && (
                      <div className="truncate flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-amber-400/80 font-bold">L4:</span>
                        <span className="truncate">{l4.name}</span>
                      </div>
                    )}
                    {l3 && (
                      <div className="truncate flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-sky-400/80 font-bold">L3:</span>
                        <span className="truncate">{l3.name}</span>
                      </div>
                    )}
                    {l2 && (
                      <div className="truncate flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-emerald-400/80 font-bold">L2:</span>
                        <span className="truncate">{l2.name}</span>
                      </div>
                    )}
                    {l1 && (
                      <div className="truncate flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-indigo-400/80 font-bold">L1:</span>
                        <span className="truncate">{l1.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Mirror Resonance Explanation */}
                <p className="text-xs text-slate-400 italic leading-relaxed">
                  «{pair.mirrorExplanation}»
                </p>

                {/* Try Button */}
                <button
                  onClick={() => handleTryPair(pair)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isCopied
                      ? 'bg-emerald-500 text-black'
                      : 'bg-slate-800 hover:bg-amber-500 hover:text-black text-slate-200 border border-slate-700 hover:border-amber-400'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Применено в системе!</span>
                    </>
                  ) : (
                    <>
                      <span>Примерить этот эталон</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW B: ТАБЛИЦА 21 АРОМАТА */}
      {viewMode === 'perfumes' && (
        <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900/60 shadow-2xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-mono uppercase text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">#</th>
                <th className="py-3.5 px-4">Аромат и Бренд</th>
                <th className="py-3.5 px-4">Квадрант</th>
                <th className="py-3.5 px-4">Наряд-зеркало</th>
                <th className="py-3.5 px-4">Координаты</th>
                <th className="py-3.5 px-4">Пирамида нот</th>
                <th className="py-3.5 px-4">Диффузия</th>
                <th className="py-3.5 px-4">Вайб образа</th>
                <th className="py-3.5 px-4 text-right">Действие</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredPerfumes.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500 font-mono">
                    Ароматы для выбранного квадранта не найдены
                  </td>
                </tr>
              ) : (
                filteredPerfumes.map((p) => {
                  const canonicalIndex = GOLDEN_PERFUMES_21.findIndex((item) => item.id === p.id) + 1;
                  const pair = GOLDEN_MIRROR_PAIRS_21.find((pair) => pair.perfumeId === p.id);
                  return (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition-colors group">
                      <td className="py-3 px-4 font-mono text-slate-500 font-bold">#{canonicalIndex}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {(() => {
                            const bottleImg = getPerfumeBottleImage(p);
                            if (!bottleImg) return null;
                            return (
                              <div className="w-8 h-10 shrink-0 bg-slate-950/80 rounded border border-slate-800 p-0.5 flex items-center justify-center overflow-hidden shadow-inner">
                                <img
                                  src={bottleImg}
                                  alt={p.name}
                                  className="max-h-full max-w-full object-contain drop-shadow"
                                  loading="lazy"
                                />
                              </div>
                            );
                          })()}
                          <div className="min-w-0">
                            <div className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors truncate">
                              {p.name}
                            </div>
                            <div className="text-[11px] text-amber-400/80 font-mono uppercase truncate">{p.brand}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono">
                        <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 text-[10px]">
                          {pair?.quadrantName.split('•')[0] || 'Центр'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono">
                        <span className="font-mono text-amber-300 font-bold text-xs bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-lg whitespace-nowrap">
                          {pair?.outfitName || '—'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-400">
                        [{p.xCoord > 0 ? `+${p.xCoord}` : p.xCoord}, {p.yCoord > 0 ? `+${p.yCoord}` : p.yCoord}]
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        <div className="text-slate-300 truncate">
                          {p.pyramid.top.slice(0, 2).join(', ')} • {p.pyramid.heart.slice(0, 1).join(', ')} • {p.pyramid.base.slice(0, 1).join(', ')}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                          {p.diffusion}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400 italic max-w-xs truncate">
                        {p.dominantVibe}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {pair && (
                          <button
                            onClick={() => handleTryPair(pair)}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-black text-slate-200 text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5"
                          >
                            <span>Примерить</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* VIEW C: 21 ПРЕДМЕТ КАПСУЛЫ ГАРДЕРОБА */}
      {viewMode === 'wardrobe' && (
        <div className="space-y-8">
          {/* Formula summary */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-sky-400 shrink-0" />
              <p className="text-xs text-slate-300 leading-relaxed">
                Капсула 21 вещи раскладывается по анатомическим слоям: <strong className="text-amber-400">5 единиц L4</strong> (верхняя одежда/пиджаки), <strong className="text-sky-400">7 единиц L3</strong> (торс: сорочки/поло/трикотаж), <strong className="text-emerald-400">5 единиц L2</strong> (брюки/деним), <strong className="text-indigo-400">4 пары L1</strong> (обувь).
                {quadrantFilter !== 'ALL' && (
                  <span className="block mt-1 text-amber-400/90 font-mono text-[11px]">
                    ★ Включен квадрантный фильтр: отображаются предметы капсулы, входящие в готовые луки этого квадранта.
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Layer groups */}
          {(['L4', 'L3', 'L2', 'L1'] as const).map((layer) => {
            const allLayerItems = GOLDEN_WARDROBE_21.filter((i) => i.layer === layer);
            const layerItems = activeWardrobeIds
              ? allLayerItems.filter((i) => activeWardrobeIds.has(i.id))
              : allLayerItems;

            const layerTitles = {
              L4: 'СЛОЙ L4 • ВЕРХНИЙ СЛОЙ (ПИДЖАКИ, БЛЕЙЗЕРЫ, ПАЛЬТО, ЗАМША)',
              L3: 'СЛОЙ L3 • ТОРС (СОРОЧКИ, ПОЛО, ВОДОЛАЗКА, ДЖЕМПЕР, ФУТБОЛКА)',
              L2: 'СЛОЙ L2 • НОГИ (КОСТЮМНЫЕ БРЮКИ, ФЛАНЕЛЬ, ЧИНОС, ДЕНИМ, ЛЕН)',
              L1: 'СЛОЙ L1 • ОБУВЬ (ОКСФОРДЫ, ЛОФЕРЫ, ДЕРБИ, КЕДЫ)'
            };

            return (
              <div key={layer} className="space-y-3">
                <div className="text-xs font-mono font-bold text-amber-400/90 uppercase tracking-wider flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>{layerTitles[layer]}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {layerItems.length} из {allLayerItems.length}
                  </span>
                </div>

                {layerItems.length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-900/40 border border-dashed border-slate-800 text-center text-xs text-slate-500 font-mono">
                    В выбранном квадранте не задействован слой {layer} (облегченный формат)
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {layerItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between gap-3 shadow-sm"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                            <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 font-bold text-amber-400">
                              {item.category}
                            </span>
                            <span>{item.minTemp}°C ... {item.maxTemp}°C</span>
                          </div>

                          <div className="font-bold text-white text-sm">
                            {item.name}
                          </div>

                          <div className="text-xs text-slate-400 font-mono">
                            {item.fabric}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3.5 h-3.5 rounded-full border border-white/20"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="text-slate-300 text-xs">{item.colorName}</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">
                            {item.formalIndex === 3 ? 'Formal' : item.formalIndex === 2 ? 'Smart Casual' : 'Casual'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
