import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { X, Search, Check, Sparkles, SlidersHorizontal, RotateCcw, CheckSquare, Layers, HeartHandshake, Plus, Trash2, Filter } from 'lucide-react';
import { PERFUME_DATABASE, SHELF_PRESETS, ShelfPreset, getPerfumeBottleImage, saveCustomPerfume, deleteCustomPerfume } from '../data/fragrances';
import { HUMAN_VIBE_ARCHETYPES } from '../data/humanScents';
import { getQuadrantInfo } from '../engine/anyanovMatrix';
import { AddPerfumeModal } from './AddPerfumeModal';
import { PerfumeItem } from '../types';

interface FragranceShelfModalProps {
  isOpen: boolean;
  onClose: () => void;
  ownedIds: string[];
  onUpdateOwnedIds: (newIds: string[]) => void;
  onOpenHumanFinder?: () => void;
}

type QuadrantFilter = 'ALL' | 'CENTER' | 'NW' | 'NE' | 'SW' | 'SE';

export const FragranceShelfModal: React.FC<FragranceShelfModalProps> = ({
  isOpen,
  onClose,
  ownedIds,
  onUpdateOwnedIds,
  onOpenHumanFinder,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [quadrantFilter, setQuadrantFilter] = useState<QuadrantFilter>('ALL');
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [onlyOwnedFilter, setOnlyOwnedFilter] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [perfumesVersion, setPerfumesVersion] = useState(0);

  // Сброс фильтров при закрытии модального окна
  useEffect(() => {
    if (!isOpen) {
      setActivePresetId(null);
      setOnlyOwnedFilter(false);
      setQuadrantFilter('ALL');
      setSearchQuery('');
    }
  }, [isOpen]);

  const handleAddCustomPerfume = useCallback((newPerfume: PerfumeItem) => {
    saveCustomPerfume(newPerfume);
    onUpdateOwnedIds([...ownedIds, newPerfume.id]);
    setPerfumesVersion((v) => v + 1);
  }, [ownedIds, onUpdateOwnedIds]);

  const handleDeleteCustomPerfume = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteCustomPerfume(id);
    onUpdateOwnedIds(ownedIds.filter((item) => item !== id));
    setPerfumesVersion((v) => v + 1);
  }, [ownedIds, onUpdateOwnedIds]);

  // Фильтрация списка ароматов: пресеты, только на полке, поиск и квадранты
  const filteredPerfumes = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const activePreset = SHELF_PRESETS.find((p) => p.id === activePresetId);

    return PERFUME_DATABASE.filter((item) => {
      // 1. Фильтр по пресету: при выборе пресета отображаются ТОЛЬКО его карточки
      if (activePreset && !activePreset.perfumeIds.includes(item.id)) {
        return false;
      }

      // 2. Фильтр "Только на полке": скрывать флаконы, которых нет на полке
      if (onlyOwnedFilter && !ownedIds.includes(item.id)) {
        return false;
      }

      // 3. Поиск по названию, бренду, нотам или человеческим ассоциациям/метафорам
      const archetype = HUMAN_VIBE_ARCHETYPES.find((a) => a.targetPerfumeId === item.id);
      const matchesVibe = archetype
        ? archetype.title.toLowerCase().includes(q) ||
          archetype.shortTag.toLowerCase().includes(q) ||
          archetype.metaphors.some((m) => m.toLowerCase().includes(q)) ||
          archetype.humanExplanation.toLowerCase().includes(q)
        : false;

      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.brand.toLowerCase().includes(q) ||
        item.dominantVibe.toLowerCase().includes(q) ||
        item.pyramid.top.some((n) => n.toLowerCase().includes(q)) ||
        item.pyramid.heart.some((n) => n.toLowerCase().includes(q)) ||
        item.pyramid.base.some((n) => n.toLowerCase().includes(q)) ||
        matchesVibe;

      if (!matchesSearch) return false;

      // 4. Фильтр по квадрантам и центру
      if (quadrantFilter === 'ALL') return true;
      const qCode = getQuadrantInfo(item.xCoord, item.yCoord).code;
      if (quadrantFilter === 'CENTER') return qCode === 'CENTER_BALANCE';
      if (quadrantFilter === 'NW') return qCode === 'NW_FOCUS';
      if (quadrantFilter === 'NE') return qCode === 'NE_EASE';
      if (quadrantFilter === 'SW') return qCode === 'SW_POWER';
      if (quadrantFilter === 'SE') return qCode === 'SE_SEDUCTION';

      return true;
    });
  }, [searchQuery, quadrantFilter, perfumesVersion, activePresetId, onlyOwnedFilter, ownedIds]);

  if (!isOpen) return null;

  const toggleItem = (id: string) => {
    if (ownedIds.includes(id)) {
      onUpdateOwnedIds(ownedIds.filter((item) => item !== id));
    } else {
      onUpdateOwnedIds([...ownedIds, id]);
    }
  };

  const handleSelectAll = () => {
    onUpdateOwnedIds(PERFUME_DATABASE.map((p) => p.id));
    setActivePresetId(null);
    setOnlyOwnedFilter(false);
  };

  const handleClearAll = () => {
    onUpdateOwnedIds([]);
    setActivePresetId(null);
    setOnlyOwnedFilter(false);
  };

  const handleApplyPreset = (preset: ShelfPreset) => {
    if (activePresetId === preset.id) {
      // Повторный клик по активному пресету снимает фильтрацию (показывает все карточки)
      setActivePresetId(null);
    } else {
      setActivePresetId(preset.id);
      onUpdateOwnedIds(preset.perfumeIds);
    }
  };

  const handleResetAllFilters = () => {
    setActivePresetId(null);
    setOnlyOwnedFilter(false);
    setQuadrantFilter('ALL');
    setSearchQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Top Glow Decor */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-sky-500 to-indigo-500" />

        {/* 1. Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">
                  Моя парфюмерная полка
                </h2>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {ownedIds.length} / {PERFUME_DATABASE.length}
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  title="Добавить новый флакон с авторасчетом нот и координат"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>+ Свой флакон</span>
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Отметьте свои реальные флаконы — система будет подбирать завершающий штрих к образу из них.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Quick Presets Row */}
        <div className="px-4 sm:px-5 py-2.5 bg-slate-950/40 border-b border-slate-800/80 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Пресеты в 1 клик:
          </span>
          {SHELF_PRESETS.map((preset) => {
            const isPresetActive = activePresetId === preset.id;
            const isFullyActive =
              preset.perfumeIds.length === ownedIds.length &&
              preset.perfumeIds.every((id) => ownedIds.includes(id));
            return (
              <button
                key={preset.id}
                onClick={() => handleApplyPreset(preset)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                  isPresetActive
                    ? 'bg-amber-500/25 border-amber-400 text-amber-200 font-bold ring-2 ring-amber-500/30 shadow-md shadow-amber-500/20'
                    : isFullyActive
                    ? 'bg-amber-500/15 border-amber-500/50 text-amber-300'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
                title={isPresetActive ? 'Активный пресет (кликните, чтобы показать все карточки)' : preset.description}
              >
                <span>{preset.name}</span>
                <span className="text-[10px] font-mono opacity-70">({preset.perfumeIds.length})</span>
                {isPresetActive && <span className="text-[10px] text-amber-400 ml-0.5 font-bold">✕</span>}
              </button>
            );
          })}
          <div className="ml-auto flex items-center gap-1.5">
            <button
              onClick={handleSelectAll}
              className="text-[11px] font-mono px-2 py-1 rounded bg-slate-800 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 transition-colors flex items-center gap-1 cursor-pointer"
              title="Выбрать все флаконы в базе"
            >
              <CheckSquare className="w-3 h-3 text-sky-400" />
              Все
            </button>
            <button
              onClick={handleClearAll}
              className="text-[11px] font-mono px-2 py-1 rounded bg-slate-800 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-900 transition-colors flex items-center gap-1 cursor-pointer"
              title="Сбросить выбор флаконов"
            >
              <RotateCcw className="w-3 h-3 text-rose-400" />
              Сброс
            </button>
          </div>
        </div>

        {/* 3. Search & Filter Bar */}
        <div className="p-4 sm:px-5 pb-3 flex flex-col sm:flex-row gap-3 border-b border-slate-800 bg-slate-900/50">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по названию (Chanel, Sauvage, Aventus, ветивер...)"
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/70"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300 cursor-pointer"
                title="Очистить"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quadrant & Shelf Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 text-xs">
            <button
              onClick={() => setQuadrantFilter('ALL')}
              className={`px-2.5 py-1.5 rounded-lg border font-mono transition-colors whitespace-nowrap cursor-pointer ${
                quadrantFilter === 'ALL'
                  ? 'bg-slate-700 text-white border-slate-500'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              Все квадранты
            </button>
            <button
              onClick={() => setQuadrantFilter(quadrantFilter === 'CENTER' ? 'ALL' : 'CENTER')}
              className={`px-2 py-1.5 rounded-lg border font-mono transition-colors whitespace-nowrap cursor-pointer ${
                quadrantFilter === 'CENTER'
                  ? 'bg-amber-950 text-amber-200 border-amber-500/70 font-bold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
              title="Центр: Точка Равновесия (365 дней)"
            >
              ⚖️ Центр: Равновесие
            </button>
            <button
              onClick={() => setQuadrantFilter(quadrantFilter === 'NW' ? 'ALL' : 'NW')}
              className={`px-2 py-1.5 rounded-lg border font-mono transition-colors whitespace-nowrap cursor-pointer ${
                quadrantFilter === 'NW'
                  ? 'bg-sky-950 text-sky-200 border-sky-500/70 font-bold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
              title="Квадрант II (Северо-Запад): Собранность / Офис / Дистанция"
            >
              💼 СЗ: Собранность
            </button>
            <button
              onClick={() => setQuadrantFilter(quadrantFilter === 'NE' ? 'ALL' : 'NE')}
              className={`px-2 py-1.5 rounded-lg border font-mono transition-colors whitespace-nowrap cursor-pointer ${
                quadrantFilter === 'NE'
                  ? 'bg-emerald-950 text-emerald-200 border-emerald-500/70 font-bold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
              title="Квадрант I (Северо-Восток): Легкость / Лето / Воздух"
            >
              ☀️ СВ: Легкость
            </button>
            <button
              onClick={() => setQuadrantFilter(quadrantFilter === 'SW' ? 'ALL' : 'SW')}
              className={`px-2 py-1.5 rounded-lg border font-mono transition-colors whitespace-nowrap cursor-pointer ${
                quadrantFilter === 'SW'
                  ? 'bg-purple-950 text-purple-200 border-purple-500/70 font-bold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
              title="Квадрант III (Юго-Запад): Власть / Вес / Монументальность"
            >
              👑 ЮЗ: Власть
            </button>
            <button
              onClick={() => setQuadrantFilter(quadrantFilter === 'SE' ? 'ALL' : 'SE')}
              className={`px-2 py-1.5 rounded-lg border font-mono transition-colors whitespace-nowrap cursor-pointer ${
                quadrantFilter === 'SE'
                  ? 'bg-amber-950 text-amber-200 border-amber-500/70 font-bold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
              title="Квадрант IV (Юго-Восток): Притяжение / Тепло / Близость"
            >
              🔥 ЮВ: Притяжение
            </button>

            {/* Разделитель */}
            <div className="h-5 w-px bg-slate-800 mx-1 hidden sm:block" />

            {/* Фильтр: Только на полке */}
            <button
              onClick={() => setOnlyOwnedFilter((prev) => !prev)}
              className={`px-2.5 py-1.5 rounded-lg border font-mono transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                onlyOwnedFilter
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-amber-300 hover:border-slate-700'
              }`}
              title={onlyOwnedFilter ? 'Показаны только ваши флаконы (кликните, чтобы показать всю базу)' : 'Показать только флаконы с вашей полки'}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Только на полке ({ownedIds.length})</span>
            </button>
          </div>
        </div>

        {/* 3.1 Quick Vibe / Human Associations Suggestion Bar */}
        <div className="px-4 sm:px-5 py-2 bg-slate-950/70 border-b border-slate-800/80 flex items-center justify-between gap-2 flex-wrap text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1 mr-1">
              <HeartHandshake className="w-3 h-3 text-cyan-400" />
              Понятные вайбы:
            </span>
            {['Чистота', 'Кожа', 'Кофе', 'Лес', 'Море', 'Табак', 'Барбершоп', 'Глянец'].map((tag) => {
              const isActive = searchQuery.toLowerCase() === tag.toLowerCase();
              return (
                <button
                  key={tag}
                  onClick={() => setSearchQuery(isActive ? '' : tag)}
                  className={`text-[11px] px-2 py-0.5 rounded-md border transition-colors cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 font-bold'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border-slate-800'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>

          {onOpenHumanFinder && (
            <button
              onClick={() => {
                onClose();
                onOpenHumanFinder();
              }}
              className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 ml-auto cursor-pointer"
            >
              <span>Не знаете ноты? Подбор по ощущениям →</span>
            </button>
          )}
        </div>

        {/* 3.2 Active Filters Banner */}
        {(activePresetId || onlyOwnedFilter || quadrantFilter !== 'ALL' || searchQuery) && (
          <div className="px-4 sm:px-5 py-2 bg-amber-500/[0.07] border-b border-amber-500/20 flex items-center justify-between gap-2 flex-wrap text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-mono text-amber-400 flex items-center gap-1 font-bold">
                <Filter className="w-3.5 h-3.5" />
                Показано: {filteredPerfumes.length} из {PERFUME_DATABASE.length}
              </span>

              {activePresetId && (
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-200 border border-amber-500/40 text-[11px] flex items-center gap-1.5">
                  <span>Пресет: {SHELF_PRESETS.find((p) => p.id === activePresetId)?.name}</span>
                  <button
                    onClick={() => setActivePresetId(null)}
                    className="hover:text-white font-bold cursor-pointer"
                    title="Снять фильтр пресета"
                  >
                    ✕
                  </button>
                </span>
              )}

              {onlyOwnedFilter && (
                <span className="px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-200 border border-sky-500/40 text-[11px] flex items-center gap-1.5">
                  <span>Только на полке ({ownedIds.length})</span>
                  <button
                    onClick={() => setOnlyOwnedFilter(false)}
                    className="hover:text-white font-bold cursor-pointer"
                    title="Показать все флаконы базы"
                  >
                    ✕
                  </button>
                </span>
              )}

              {quadrantFilter !== 'ALL' && (
                <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-200 border border-purple-500/40 text-[11px] flex items-center gap-1.5">
                  <span>
                    {quadrantFilter === 'CENTER' && '⚖️ Центр'}
                    {quadrantFilter === 'NW' && '💼 СЗ: Фокус'}
                    {quadrantFilter === 'NE' && '☀️ СВ: Лёгкость'}
                    {quadrantFilter === 'SW' && '👑 ЮЗ: Власть'}
                    {quadrantFilter === 'SE' && '🔥 ЮВ: Соблазн'}
                  </span>
                  <button
                    onClick={() => setQuadrantFilter('ALL')}
                    className="hover:text-white font-bold cursor-pointer"
                    title="Сбросить фильтр квадранта"
                  >
                    ✕
                  </button>
                </span>
              )}

              {searchQuery && (
                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 border border-slate-700 text-[11px] flex items-center gap-1.5">
                  <span>Поиск: «{searchQuery}»</span>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="hover:text-white font-bold cursor-pointer"
                    title="Очистить поиск"
                  >
                    ✕
                  </button>
                </span>
              )}
            </div>

            <button
              onClick={handleResetAllFilters}
              className="text-[11px] font-semibold text-slate-400 hover:text-white underline cursor-pointer ml-auto"
            >
              Сбросить фильтры (показать все)
            </button>
          </div>
        )}

        {/* 4. Fragrance Catalog Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredPerfumes.map((perfume) => {
            const isOwned = ownedIds.includes(perfume.id);
            return (
              <div
                key={perfume.id}
                onClick={() => toggleItem(perfume.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer select-none flex flex-col justify-between gap-2 relative ${
                  isOwned
                    ? 'bg-amber-500/[0.08] border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/30'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-950'
                }`}
              >
                {/* Top Row: Brand & Selection Checkbox */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5 min-w-0">
                    {(() => {
                      const bottleImg = getPerfumeBottleImage(perfume);
                      if (!bottleImg) return null;
                      return (
                        <div className="w-8 h-11 shrink-0 bg-slate-900 rounded border border-slate-800 p-0.5 flex items-center justify-center overflow-hidden shadow-inner">
                          <img
                            src={bottleImg}
                            alt={perfume.name}
                            className="max-h-full max-w-full object-contain drop-shadow"
                            loading="lazy"
                          />
                        </div>
                      );
                    })()}
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block truncate">
                        {perfume.brand}
                      </span>
                      <h4 className="text-sm font-bold text-white leading-snug truncate">
                        {perfume.name}
                      </h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {perfume.id.startsWith('custom-') && (
                      <button
                        type="button"
                        onClick={(e) => handleDeleteCustomPerfume(e, perfume.id)}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Удалить свой флакон"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                        isOwned
                          ? 'bg-amber-500 border-amber-400 text-black font-black'
                          : 'border-slate-700 bg-slate-900'
                      }`}
                    >
                      {isOwned && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                </div>

                {/* Dominant Vibe & Occasion */}
                <p className="text-[11px] text-slate-300 line-clamp-2 italic leading-relaxed">
                  «{perfume.dominantVibe}»
                </p>

                {/* Bottom Row: Coords & Notes preview */}
                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                    X: {perfume.xCoord >= 0 ? `+${perfume.xCoord}` : perfume.xCoord} | Y:{' '}
                    {perfume.yCoord >= 0 ? `+${perfume.yCoord}` : perfume.yCoord}
                  </span>
                  <span className="text-slate-400 truncate max-w-[140px]">
                    {perfume.pyramid.top[0]}, {perfume.pyramid.base[0]}
                  </span>
                </div>
              </div>
            );
          })}

          {filteredPerfumes.length === 0 && (
            <div className="col-span-full py-12 flex flex-col items-center justify-center text-center gap-2 text-xs text-slate-400">
              <p>Нет флаконов, соответствующих выбранным критериям.</p>
              <button
                onClick={handleResetAllFilters}
                className="mt-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-semibold cursor-pointer transition-colors"
              >
                Сбросить все фильтры и показать все флаконы ({PERFUME_DATABASE.length})
              </button>
            </div>
          )}
        </div>

        {/* 5. Footer */}
        <div className="p-4 sm:px-5 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Выбрано для подбора:{' '}
            <strong className="text-amber-400 font-mono text-sm">{ownedIds.length}</strong>{' '}
            флакон(ов)
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98]"
          >
            Сохранить и применить
          </button>
        </div>
      </div>

      {/* Модальное окно умного добавления аромата */}
      <AddPerfumeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddPerfume={handleAddCustomPerfume}
      />
    </div>
  );
};
