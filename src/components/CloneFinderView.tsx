import React, { useState, useMemo } from 'react';
import {
  Repeat,
  Search,
  Sparkles,
  Layers,
  ArrowRight,
  CheckCircle2,
  Sliders,
  Check,
  Plus,
  Compass,
  Flame,
  Info,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';
import { PerfumeItem, AnyanovCoordinates } from '../types';
import { findPerfumeClones, CloneFinderResult, CloneMatchItem } from '../engine/cloneFinder';
import { getPerfumeBottleImage } from '../data/fragrances';
import { AnyanovTab } from '../hooks/useAnyanovState';

interface CloneFinderViewProps {
  userShelfIds: string[];
  onToggleShelfId: (id: string) => void;
  onApplyCoords?: (coords: AnyanovCoordinates) => void;
  onSwitchTab: (tab: AnyanovTab) => void;
  onOpenShelfModal?: () => void;
}

const POPULAR_PRESET_SCENTS = [
  { label: 'Creed Aventus', query: 'Creed Aventus', icon: '👑' },
  { label: 'Angels’ Share', query: "Kilian Angels' Share", icon: '🥃' },
  { label: 'Tobacco Vanille', query: 'Tom Ford Tobacco Vanille', icon: '🍂' },
  { label: 'Baccarat Rouge 540', query: 'Baccarat Rouge 540', icon: '💎' },
  { label: 'Ganymede', query: 'Marc-Antoine Barrois Ganymede', icon: '🪐' },
  { label: 'Lost Cherry', query: 'Tom Ford Lost Cherry', icon: '🍒' },
  { label: 'Dior Sauvage', query: 'Dior Sauvage', icon: '⚡' },
  { label: 'Tuscan Leather', query: 'Tom Ford Tuscan Leather', icon: '🧥' },
  { label: 'Bleu de Chanel', query: 'Bleu de Chanel', icon: '🌊' },
  { label: 'Fahrenheit', query: 'Dior Fahrenheit', icon: '🔥' },
  { label: 'Encre Noire', query: 'Lalique Encre Noire', icon: '🌲' },
  { label: 'Soleil Blanc', query: 'Tom Ford Soleil Blanc', icon: '☀️' },
];

export const CloneFinderView: React.FC<CloneFinderViewProps> = ({
  userShelfIds,
  onToggleShelfId,
  onApplyCoords,
  onSwitchTab,
  onOpenShelfModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('Creed Aventus');
  const [submittedQuery, setSubmittedQuery] = useState('Creed Aventus');
  const [selectedCloneId, setSelectedCloneId] = useState<string | null>(null);

  // Вызов движка поиска клонов
  const result: CloneFinderResult = useMemo(() => {
    return findPerfumeClones(submittedQuery, { userShelfIds });
  }, [submittedQuery, userShelfIds]);

  // Выбранный для детального просмотра клон (по умолчанию лучший чемпион)
  const activeClone: CloneMatchItem | null = useMemo(() => {
    if (!result.bestClone) return null;
    if (!selectedCloneId) return result.bestClone;
    const found = result.allRanked.find((c) => c.perfume.id === selectedCloneId);
    return found || result.bestClone;
  }, [result, selectedCloneId]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      setSubmittedQuery(searchQuery.trim());
      setSelectedCloneId(null);
    }
  };

  const handleSelectPreset = (presetQuery: string) => {
    setSearchQuery(presetQuery);
    setSubmittedQuery(presetQuery);
    setSelectedCloneId(null);
  };

  const handleApplyCoordsToSystem = (perfume: PerfumeItem) => {
    if (onApplyCoords) {
      onApplyCoords({
        socialX: perfume.xCoord,
        thermoY: perfume.yCoord,
        formalIndex: 2,
        temperatureC: 22,
      });
      onSwitchTab('concierge');
    }
  };

  const targetBottleImage = getPerfumeBottleImage(result.target.matchedDatabaseItem || null);
  const activeBottleImage = activeClone ? getPerfumeBottleImage(activeClone.perfume) : null;

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#0B101E] to-slate-950 border border-slate-800/80 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-72 h-72 bg-gradient-to-br from-emerald-500/10 via-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-semibold">
              <Repeat className="w-3.5 h-3.5" />
              <span>ОЛЬФАКТОРНЫЙ ДЕТЕКТОР АНАЛОГОВ</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white font-serif">
              Поиск клона & Цифровой двойник
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Введите название любого мирового аромата. Алгоритм Системы Аньянова рассчитает вектор намерения,
              разложит пирамиду нот и мгновенно найдет ближайший аналог из нашей эталонной базы с математической точностью.
            </p>
          </div>

          {onOpenShelfModal && (
            <button
              onClick={onOpenShelfModal}
              className="self-start md:self-center flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 hover:text-white text-xs font-medium transition-all shadow-sm cursor-pointer"
            >
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Моя полка:</span>
              <span className="font-mono font-bold text-amber-300">{userShelfIds.length}</span>
            </button>
          )}
        </div>

        {/* 2. Interactive Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative mt-6 z-10">
          <div className="relative flex items-center">
            <div className="absolute left-4 pointer-events-none text-slate-400">
              <Search className="w-5 h-5 text-amber-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Введите название парфюма (напр. Creed Aventus, Angels' Share, Ganymede, Lost Cherry)..."
              className="w-full pl-12 pr-32 py-3.5 bg-slate-950/90 text-white placeholder-slate-500 text-sm md:text-base rounded-2xl border border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/80 transition-all shadow-inner"
            />
            <button
              type="submit"
              className="absolute right-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs md:text-sm transition-all shadow-md hover:shadow-amber-500/20 cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Найти клон</span>
            </button>
          </div>
        </form>

        {/* 3. Quick Chips */}
        <div className="mt-4 flex flex-wrap items-center gap-2 z-10 relative">
          <span className="text-xs text-slate-400 font-medium mr-1">Популярные запросы:</span>
          {POPULAR_PRESET_SCENTS.map((preset) => {
            const isCurrent = submittedQuery.toLowerCase() === preset.query.toLowerCase();
            return (
              <button
                key={preset.query}
                onClick={() => handleSelectPreset(preset.query)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  isCurrent
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm'
                    : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60'
                }`}
              >
                <span>{preset.icon}</span>
                <span>{preset.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. State: Fragrance Not Found (Честное сообщение + Детектор опечатки) */}
      {!result.isFound && (
        <div className="bg-slate-900/80 rounded-3xl border border-rose-500/30 p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 shrink-0 border border-rose-500/30">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-300 text-xs font-mono font-semibold">
                <span>АРОМАТ НЕ НАЙДЕН В БАЗЕ</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                «{result.query}» не существует в каталогах парфюмерии
              </h3>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-2xl">
                Официального аромата с таким названием нет в мировых парфюмерных регистрах.
                Возможно, в запросе допущена опечатка, либо это вымышленное наименование.
              </p>
            </div>
          </div>

          {/* Карточка найденной опечатки / предложения */}
          {result.suggestion && (
            <div className="bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-950 p-5 rounded-2xl border border-amber-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Возможно, вы имели в виду настоящий аромат:</span>
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Совпадение по бренду и серии
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block">
                    {result.suggestion.brand}
                  </span>
                  <h4 className="text-base font-bold text-white">
                    {result.suggestion.name}
                  </h4>
                </div>

                <button
                  onClick={() => handleSelectPreset(result.suggestion!.fullName)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Искать этот аромат</span>
                </button>
              </div>
            </div>
          )}

          {/* Быстрый выбор проверенных эталонов */}
          <div className="pt-2 space-y-2">
            <span className="text-xs text-slate-400 font-medium block">
              Или выберите один из проверенных мировых шедевров:
            </span>
            <div className="flex flex-wrap gap-2">
              {POPULAR_PRESET_SCENTS.slice(0, 8).map((p) => (
                <button
                  key={p.query}
                  onClick={() => handleSelectPreset(p.query)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{p.icon}</span>
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. Comparison Main Arena */}
      {result.isFound && activeClone && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Target Reference Card (4 cols) */}
          <div className="lg:col-span-4 bg-[#0A0E1A] rounded-2xl border border-slate-800 p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                  Исходный аромат (Запрос)
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20">
                {result.target.source === 'database'
                  ? 'База данных'
                  : result.target.source === 'known_catalog'
                  ? 'Каталог шедевров'
                  : 'Синтез формулы'}
              </span>
            </div>

            <div className="flex items-start gap-4">
              {targetBottleImage ? (
                <img
                  src={targetBottleImage}
                  alt={result.target.name}
                  className="w-16 h-20 object-contain rounded-xl bg-slate-900/80 p-1 border border-slate-800 shrink-0"
                />
              ) : (
                <div className="w-16 h-20 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 text-2xl">
                  🧴
                </div>
              )}
              <div className="space-y-1">
                <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">
                  {result.target.brand}
                </span>
                <h4 className="text-lg font-bold text-white leading-tight">
                  {result.target.name}
                </h4>
                <div className="flex items-center gap-2 pt-1 font-mono text-[11px] text-slate-400">
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    X: {result.target.xCoord > 0 ? `+${result.target.xCoord}` : result.target.xCoord}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    Y: {result.target.yCoord > 0 ? `+${result.target.yCoord}` : result.target.yCoord}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 leading-relaxed italic">
              «{result.target.dominantVibe}»
            </p>

            {/* Target Pyramid */}
            <div className="space-y-2 pt-1 text-xs">
              <div className="text-[11px] font-mono text-slate-400 uppercase font-semibold">
                Пирамида нот оригинала:
              </div>
              <div className="space-y-1.5">
                <div className="flex items-start gap-2 bg-slate-900/40 p-2 rounded-lg border border-slate-800/50">
                  <span className="font-mono text-[10px] text-slate-400 w-12 shrink-0">Верх:</span>
                  <span className="text-slate-200">{result.target.pyramid.top.join(', ') || 'Цитрусы, специи'}</span>
                </div>
                <div className="flex items-start gap-2 bg-slate-900/40 p-2 rounded-lg border border-slate-800/50">
                  <span className="font-mono text-[10px] text-slate-400 w-12 shrink-0">Сердце:</span>
                  <span className="text-slate-200">{result.target.pyramid.heart.join(', ') || 'Цветы, древесина'}</span>
                </div>
                <div className="flex items-start gap-2 bg-slate-900/40 p-2 rounded-lg border border-slate-800/50">
                  <span className="font-mono text-[10px] text-slate-400 w-12 shrink-0">База:</span>
                  <span className="text-slate-200">{result.target.pyramid.base.join(', ') || 'Мускус, амбра'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Matched Clone Hero Card (8 cols) */}
          <div className="lg:col-span-8 bg-gradient-to-b from-[#0E1526] to-[#080C16] rounded-2xl border border-amber-500/30 p-6 space-y-6 shadow-2xl relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top Match Badge Row */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-amber-500/20 text-amber-400">
                  <Repeat className="w-4 h-4" />
                </span>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
                  {activeClone.isExactDirectClone ? '🎯 ПРЯМОЙ ГЕНЕТИЧЕСКИЙ КЛОН' : 'БЛИЖАЙШИЙ АНАЛОГ ИЗ БАЗЫ'}
                </span>
              </div>

              {/* Match Score Badge */}
              <div className="flex items-center gap-2">
                <div className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-amber-500/40 text-amber-300 text-sm font-bold font-mono shadow-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{activeClone.similarityPercentage}% схожести</span>
                </div>
              </div>
            </div>

            {/* Perfume Identity */}
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                {activeBottleImage ? (
                  <img
                    src={activeBottleImage}
                    alt={activeClone.perfume.name}
                    className="w-20 h-24 object-contain rounded-2xl bg-slate-950/80 p-2 border border-slate-700 shadow-md shrink-0"
                  />
                ) : (
                  <div className="w-20 h-24 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0 text-3xl">
                    ✨
                  </div>
                )}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                      {activeClone.perfume.brand}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      Диффузия: {activeClone.perfume.diffusion}
                    </span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-white tracking-tight">
                    {activeClone.perfume.name}
                  </h3>
                  <div className="flex items-center gap-2 pt-1 font-mono text-xs text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-slate-800/90 text-amber-300 font-semibold border border-slate-700/50">
                      Координаты: X {activeClone.perfume.xCoord > 0 ? `+${activeClone.perfume.xCoord}` : activeClone.perfume.xCoord}, Y {activeClone.perfume.yCoord > 0 ? `+${activeClone.perfume.yCoord}` : activeClone.perfume.yCoord}
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      Δ дистанции: {activeClone.distance}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex sm:flex-col items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => onToggleShelfId(activeClone.perfume.id)}
                  className={`w-full sm:w-44 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm ${
                    activeClone.isOwned
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/40'
                      : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md'
                  }`}
                >
                  {activeClone.isOwned ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>На вашей полке</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Добавить на полку</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleApplyCoordsToSystem(activeClone.perfume)}
                  className="w-full sm:w-44 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5 text-sky-400" />
                  <span>Собрать лук с ним</span>
                </button>
              </div>
            </div>

            {/* Anyanov Math Engine Breakdown */}
            <div className="relative z-10 bg-slate-950/80 p-4 rounded-xl border border-amber-500/30 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  <span>МЕТОДИКА РАСЧЕТОВ СИСТЕМЫ АНЬЯНОВА</span>
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  {activeClone.calculation.harmonyStateLabel}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase">Дельта 2D (Δ)</div>
                  <div className="text-base font-bold text-amber-300">
                    Δ = {activeClone.calculation.delta2D}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    ΔX: {activeClone.calculation.dx}, ΔY: {activeClone.calculation.dy}
                  </div>
                </div>

                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase">10D Сольфеджио</div>
                  <div className="text-base font-bold text-sky-300">
                    {activeClone.calculation.cosineSimilarity}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    дист. 10D: {activeClone.calculation.delta10D}
                  </div>
                </div>

                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase">Пространство</div>
                  <div className="text-base font-bold text-emerald-300">
                    {activeClone.calculation.spatialScore}%
                  </div>
                  <div className="text-[10px] text-slate-500">
                    вес: 55%
                  </div>
                </div>

                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase">Ольфакторный ДНК</div>
                  <div className="text-base font-bold text-purple-300">
                    {activeClone.calculation.noteScore}%
                  </div>
                  <div className="text-[10px] text-slate-500">
                    вес: 20%
                  </div>
                </div>
              </div>
            </div>

            {/* Shared Notes Highlight */}
            <div className="relative z-10 space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Совпадающие ноты и общий ДНК:</span>
                </span>
                <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                  {activeClone.sharedNotes.length} общих ключевых нот
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {activeClone.sharedNotes.length > 0 ? (
                  activeClone.sharedNotes.map((note) => (
                    <span
                      key={note}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-medium flex items-center gap-1"
                    >
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>{note}</span>
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">
                    Пересечение по ольфакторному профилю настроения и плотности молекул
                  </span>
                )}
              </div>

              {activeClone.contrastNotes.length > 0 && (
                <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-slate-800/80 text-xs">
                  <span className="text-slate-400 font-mono text-[11px]">Индивидуальные акценты клона:</span>
                  {activeClone.contrastNotes.map((note) => (
                    <span
                      key={note}
                      className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[11px]"
                    >
                      +{note}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Expert Why & Nuance Breakdown */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800/80 space-y-2">
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-mono font-bold uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Почему звучит идентично</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeClone.whySimilar}
                </p>
              </div>

              <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800/80 space-y-2">
                <div className="flex items-center gap-1.5 text-sky-400 text-xs font-mono font-bold uppercase">
                  <Info className="w-3.5 h-3.5" />
                  <span>Тонкий нюанс отличия</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeClone.nuanceDifference}
                </p>
              </div>
            </div>

            {/* Wardrobe Synergy Advice */}
            <div className="relative z-10 bg-gradient-to-r from-amber-500/10 via-slate-900/60 to-transparent p-4 rounded-xl border border-amber-500/20 flex items-start gap-3">
              <Compass className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h5 className="text-xs font-bold text-amber-300 uppercase tracking-wider font-mono">
                  Стилистический совет Системы Аньянова:
                </h5>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {activeClone.styleAdvice}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Alternative Clones Carousel / Grid */}
      {result.isFound && result.alternativeClones.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-400" />
              <h3 className="text-base font-extrabold text-white tracking-tight">
                Другие похожие альтернативы из базы
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Найдено {result.alternativeClones.length} близких вариантов
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {result.alternativeClones.map((alt) => {
              const isSelected = activeClone?.perfume.id === alt.perfume.id;
              const altImage = getPerfumeBottleImage(alt.perfume);

              return (
                <div
                  key={alt.perfume.id}
                  onClick={() => setSelectedCloneId(alt.perfume.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 group ${
                    isSelected
                      ? 'bg-slate-900/90 border-amber-500/60 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/40'
                      : 'bg-[#090D18] hover:bg-slate-900/70 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {altImage ? (
                          <img
                            src={altImage}
                            alt={alt.perfume.name}
                            className="w-10 h-12 object-contain rounded-lg bg-slate-950 p-1 border border-slate-800"
                          />
                        ) : (
                          <div className="w-10 h-12 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-lg">
                            🧴
                          </div>
                        )}
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            {alt.perfume.brand}
                          </span>
                          <h4 className="text-xs font-bold text-white leading-tight group-hover:text-amber-300 transition-colors">
                            {alt.perfume.name}
                          </h4>
                          <div className="flex items-center gap-1.5 pt-0.5 font-mono text-[10px]">
                            <span className="px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30">
                              Δ = {alt.calculation.delta2D}
                            </span>
                            <span className="text-slate-500">
                              (ΔX: {alt.calculation.dx})
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="px-2 py-0.5 rounded-full bg-slate-800/80 border border-slate-700 text-amber-300 text-[11px] font-mono font-bold shrink-0">
                        {alt.similarityPercentage}%
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {alt.perfume.dominantVibe}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                    <span className="font-mono text-slate-400">
                      Диффузия: {alt.perfume.diffusion}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleShelfId(alt.perfume.id);
                      }}
                      className="p-1 rounded-md text-slate-400 hover:text-amber-400 cursor-pointer"
                      title={alt.isOwned ? 'Убрать с полки' : 'Добавить на полку'}
                    >
                      {alt.isOwned ? <Check className="w-4 h-4 text-emerald-400" /> : <Plus className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
