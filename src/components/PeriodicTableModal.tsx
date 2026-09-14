import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  Atom, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  Filter, 
  Info,
  Wind,
  ShieldAlert,
  Flame,
  Heart
} from 'lucide-react';
import { PERIODIC_NOTE_ELEMENTS } from '../data/periodicNotes';
import { PeriodicNoteElement } from '../types';

interface PeriodicTableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type PeriodFilter = 'ALL' | 'I' | 'II' | 'III' | 'IV';
type FabricFilter = 'ALL' | 'Шерсть' | 'Кашемир' | 'Хлопок' | 'Лен' | 'Кожа' | 'Твид' | 'Деним';

export const PeriodicTableModal: React.FC<PeriodicTableModalProps> = ({ isOpen, onClose }) => {
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('ALL');
  const [fabricFilter, setFabricFilter] = useState<FabricFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNote, setSelectedNote] = useState<PeriodicNoteElement | null>(null);

  // Фильтрация элементов периодической таблицы
  const filteredNotes = useMemo(() => {
    return PERIODIC_NOTE_ELEMENTS.filter((note) => {
      // Фильтр по периоду (квадранту)
      if (periodFilter !== 'ALL' && note.period !== periodFilter) return false;

      // Фильтр по ткани
      if (fabricFilter !== 'ALL') {
        const matchesFabric = note.resonantFabrics.some((f) => 
          f.toLowerCase().includes(fabricFilter.toLowerCase())
        );
        if (!matchesFabric) return false;
      }

      // Текстовый поиск
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inName = note.name.toLowerCase().includes(q);
        const inSymbol = note.symbol.toLowerCase().includes(q);
        const inCategory = note.category.toLowerCase().includes(q);
        const inVibe = note.vibeDescription.toLowerCase().includes(q);
        const inFabrics = note.resonantFabrics.some((f) => f.toLowerCase().includes(q));
        if (!inName && !inSymbol && !inCategory && !inVibe && !inFabrics) return false;
      }

      return true;
    });
  }, [periodFilter, fabricFilter, searchQuery]);

  if (!isOpen) return null;

  const getPeriodColor = (period: 'I' | 'II' | 'III' | 'IV') => {
    switch (period) {
      case 'I':
        return {
          border: 'border-cyan-500/40 hover:border-cyan-400',
          bg: 'bg-cyan-950/20 hover:bg-cyan-950/40',
          badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
          text: 'text-cyan-400',
        };
      case 'II':
        return {
          border: 'border-sky-500/40 hover:border-sky-400',
          bg: 'bg-sky-950/20 hover:bg-sky-950/40',
          badge: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
          text: 'text-sky-400',
        };
      case 'III':
        return {
          border: 'border-amber-500/40 hover:border-amber-400',
          bg: 'bg-amber-950/20 hover:bg-amber-950/40',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          text: 'text-amber-400',
        };
      case 'IV':
        return {
          border: 'border-rose-500/40 hover:border-rose-400',
          bg: 'bg-rose-950/20 hover:bg-rose-950/40',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
          text: 'text-rose-400',
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800/80 bg-slate-900/60 flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                <Atom className="w-5 h-5" />
              </span>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold">
                  Двигатель гармонии стиля
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  Периодическая система нот
                </h2>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
              <strong className="text-slate-200">Координаты (X, Y) — это ЦЕЛЬ</strong> (социальный контекст и силуэт образа).{' '}
              <strong className="text-indigo-300">Периодическая таблица нот — это ДВИГАТЕЛЬ</strong> (подбор конкретных ольфакторных молекул под ткани L1–L4 без фальшивых диссонансов).
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800/60 bg-slate-950 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск ноты (ветивер, уд, ирис, кашемир, лен)..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Period (Quadrant) Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none text-xs">
            <span className="text-slate-500 font-semibold text-[11px] mr-1 hidden sm:inline">Период:</span>
            {(['ALL', 'I', 'II', 'III', 'IV'] as PeriodFilter[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriodFilter(p)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                  periodFilter === p
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {p === 'ALL' ? 'Все периоды' : `Период ${p}`}
              </button>
            ))}
          </div>

          {/* Fabric Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none text-xs">
            <span className="text-slate-500 font-semibold text-[11px] mr-1 hidden sm:inline">Ткань:</span>
            {(['ALL', 'Шерсть', 'Кашемир', 'Хлопок', 'Лен', 'Кожа', 'Твид', 'Деним'] as FabricFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFabricFilter(f)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  fabricFilter === f
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {f === 'ALL' ? 'Все ткани' : f}
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid: Chemistry Element Cards */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
            {filteredNotes.map((note) => {
              const colors = getPeriodColor(note.period);
              const isSelected = selectedNote?.id === note.id;

              return (
                <div
                  key={note.id}
                  onClick={() => setSelectedNote(note)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative group flex flex-col justify-between ${
                    colors.border
                  } ${colors.bg} ${
                    isSelected ? 'ring-2 ring-indigo-400 bg-slate-900 shadow-lg scale-[1.02]' : ''
                  }`}
                >
                  {/* Top Bar: Symbol & Layer Affinity */}
                  <div className="flex items-start justify-between gap-1 mb-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        {note.period}-{note.subSector || 'E'}
                      </span>
                      <div className={`text-2xl font-black font-mono tracking-tight ${colors.text}`}>
                        {note.symbol}
                      </div>
                    </div>

                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-950/80 text-slate-300 border border-slate-800">
                      {note.layerAffinity}
                    </span>
                  </div>

                  {/* Name & Category */}
                  <div className="space-y-0.5 mb-2.5">
                    <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                      {note.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 line-clamp-1">
                      {note.category}
                    </p>
                  </div>

                  {/* Coordinates & Resonant Fabric preview */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>X: {note.distanceX > 0 ? `+${note.distanceX}` : note.distanceX}</span>
                    <span>Y: {note.thermoY > 0 ? `+${note.thermoY}` : note.thermoY}</span>
                  </div>

                  {/* Resonant Fabrics Badges */}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {note.resonantFabrics.slice(0, 2).map((fabric, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] px-1.5 py-0.2 rounded bg-slate-900 text-slate-300 border border-slate-800"
                      >
                        {fabric}
                      </span>
                    ))}
                    {note.resonantFabrics.length > 2 && (
                      <span className="text-[9px] text-slate-500 font-mono">
                        +{note.resonantFabrics.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredNotes.length === 0 && (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <p className="text-sm font-semibold text-slate-400">
                По заданным критериям ноты не найдены.
              </p>
              <button
                onClick={() => {
                  setPeriodFilter('ALL');
                  setFabricFilter('ALL');
                  setSearchQuery('');
                }}
                className="text-xs text-indigo-400 hover:underline cursor-pointer"
              >
                Сбросить фильтры
              </button>
            </div>
          )}

          {/* Selected Note Inspector Detail Card */}
          {selectedNote && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-indigo-500/40 shadow-xl space-y-3 animate-in fade-in duration-200">
              <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-950 border border-indigo-500/50 flex items-center justify-center font-mono font-black text-xl text-indigo-300">
                    {selectedNote.symbol}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{selectedNote.name}</h3>
                      <span className="text-xs px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-mono">
                        Период {selectedNote.period} ({selectedNote.subSector})
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                        Слой {selectedNote.layerAffinity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{selectedNote.category}</p>
                  </div>
                </div>

                <div className="text-right text-xs font-mono text-slate-400">
                  <div>Ось X (Дистанция): <span className="text-white font-bold">{selectedNote.distanceX}</span></div>
                  <div>Ось Y (Термодинамика): <span className="text-white font-bold">{selectedNote.thermoY}</span></div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                "{selectedNote.vibeDescription}"
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                  <strong className="text-emerald-400 block mb-1">Резонирующие ткани:</strong>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNote.resonantFabrics.map((f, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-200 border border-emerald-800/60 text-[11px]">
                        ✓ {f}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedNote.clashFabrics && selectedNote.clashFabrics.length > 0 && (
                  <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30">
                    <strong className="text-rose-400 block mb-1">Семантический диссонанс (Clashes):</strong>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedNote.clashFabrics.map((f, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-rose-950/60 text-rose-200 border border-rose-800/60 text-[11px]">
                          ✕ {f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Scalability Notice Box */}
          <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 flex items-start gap-3 text-xs text-slate-300 leading-relaxed">
            <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5 font-semibold">
                Принцип бесконечного расширения базы
              </strong>
              Периодическая таблица нот не ограничена текущим списком. Любой новый парфюмерный ингредиент, синтетический каптив или редкое эфирное масло регистрируется через функцию <code className="font-mono text-indigo-300 bg-slate-900 px-1.5 py-0.5 rounded border border-indigo-900">registerPeriodicNote()</code>, автоматически встраиваясь в расчеты гармонии с гардеробом.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
