import React from 'react';
import { PerfumeItem, SolfeggioAnalysis, NoteEngineAnalysis } from '../types';
import { 
  Sparkles, 
  Sliders, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  ArrowRight, 
  ShieldCheck, 
  Compass,
  Atom
} from 'lucide-react';
import { AXIS_LABELS } from '../engine/styleSolfeggio';

interface FragranceMatchCardProps {
  perfume: PerfumeItem;
  solfeggio: SolfeggioAnalysis;
  isFromShelf: boolean;
  totalShelfCount: number;
  hasWardrobeGap: boolean;
  gapAdvice?: string;
  idealCatalogMatch?: PerfumeItem;
  isCatalogMode: boolean;
  onToggleCatalogMode: () => void;
  onOpenShelfModal: () => void;
  onSelectPerfume?: (perfume: PerfumeItem) => void;
  notesEngine?: NoteEngineAnalysis;
  onOpenPeriodicTable?: () => void;
}

export const FragranceMatchCard: React.FC<FragranceMatchCardProps> = ({
  perfume,
  solfeggio,
  isFromShelf,
  totalShelfCount,
  hasWardrobeGap,
  gapAdvice,
  idealCatalogMatch,
  isCatalogMode,
  onToggleCatalogMode,
  onOpenShelfModal,
  onSelectPerfume,
  notesEngine,
  onOpenPeriodicTable,
}) => {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col gap-4 shadow-xl relative overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-800 pb-3 z-10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Ольфакторный дуэт (Fragrance Mirror)
          </h2>
        </div>

        {/* Shelf Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Mode Switcher: Shelf vs Global Catalog */}
          <div className="flex items-center bg-slate-950 p-0.5 rounded-xl border border-slate-800 text-[11px] font-mono">
            <button
              onClick={() => {
                if (isCatalogMode) onToggleCatalogMode();
              }}
              className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                !isCatalogMode
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Искать лучший парфюм из моей личной коллекции"
            >
              <Layers className="w-3 h-3" />
              <span>Моя полка ({totalShelfCount})</span>
            </button>
            <button
              onClick={() => {
                if (!isCatalogMode) onToggleCatalogMode();
              }}
              className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                isCatalogMode
                  ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Показать идеальный эталон из всей мировой базы"
            >
              <Compass className="w-3 h-3" />
              <span>Каталог</span>
            </button>
          </div>

          {/* Edit Shelf Button */}
          <button
            onClick={onOpenShelfModal}
            className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] font-mono transition-colors flex items-center gap-1 cursor-pointer"
            title="Настроить состав флаконов на полке"
          >
            <span>Настроить</span>
          </button>

          {/* Solfeggio state badges */}
          <span className={`text-[11px] font-mono px-2 py-1 rounded-lg border flex items-center gap-1 font-bold ${solfeggio.badgeColor}`}>
            {solfeggio.stateLabel}
          </span>
        </div>
      </div>

      {/* Main Perfume Presentation */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center z-10">
        {/* Left: Bottle Vector Illustration (4 cols) */}
        <div className="sm:col-span-4 flex flex-col items-center justify-center bg-slate-950/70 rounded-xl border border-slate-800/80 p-4 min-h-[220px] relative">
          {/* Badge: Shelf vs Catalog */}
          <div className="absolute top-2.5 left-2.5">
            {isFromShelf ? (
              <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 shadow-sm">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                С вашей полки
              </span>
            ) : (
              <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 flex items-center gap-1">
                <Compass className="w-3 h-3 text-sky-400" />
                Эталон каталога
              </span>
            )}
          </div>

          <svg
            viewBox="0 0 100 160"
            className="w-24 h-36 drop-shadow-[0_8px_16px_rgba(245,158,11,0.2)] mt-2"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Cap */}
            <rect x="36" y="12" width="28" height="22" rx="2" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.5" />
            {/* Spray nozzle */}
            <rect x="44" y="34" width="12" height="8" fill="#cbd5e1" />
            {/* Bottle body */}
            <rect
              x="18"
              y="42"
              width="64"
              height="106"
              rx="8"
              fill="#090d16"
              stroke="#64748b"
              strokeWidth="2"
            />
            {/* Liquid level */}
            <rect
              x="22"
              y="62"
              width="56"
              height="80"
              rx="4"
              fill="#d97706"
              opacity={0.75}
            />
            {/* Label plate */}
            <rect x="26" y="78" width="48" height="40" rx="2" fill="#020617" stroke="#f59e0b" strokeWidth="1" />
            <text x="50" y="93" fill="#ffffff" fontSize="5.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              {perfume.brand.toUpperCase()}
            </text>
            <text x="50" y="105" fill="#f59e0b" fontSize="6.5" fontWeight="900" textAnchor="middle" fontFamily="serif">
              {perfume.name.length > 14 ? perfume.name.slice(0, 13) + '..' : perfume.name}
            </text>
          </svg>
          <div className="flex items-center gap-2 mt-2 font-mono text-[10px] text-slate-400">
            <span>Диффузия: <strong className="text-slate-200">{perfume.diffusion}</strong></span>
            <span>•</span>
            <span>Коорд: <strong className="text-amber-400">{perfume.xCoord > 0 ? `+${perfume.xCoord}` : perfume.xCoord}, {perfume.yCoord > 0 ? `+${perfume.yCoord}` : perfume.yCoord}</strong></span>
          </div>
        </div>

        {/* Right: Perfume Details & Why fits (8 cols) */}
        <div className="sm:col-span-8 flex flex-col gap-2.5">
          <div>
            <span className="text-xs text-amber-400 font-bold uppercase tracking-wider block">
              {perfume.brand}
            </span>
            <h3 className="text-lg font-black text-white leading-tight">
              {perfume.name}
            </h3>
            <p className="text-xs text-slate-300 italic mt-0.5">
              «{perfume.dominantVibe}»
            </p>
          </div>

          {/* Pyramid Notes */}
          <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800 text-[11px] space-y-1.5">
            <div className="flex items-center gap-1.5">
              <span className="text-sky-400 font-bold font-mono text-[10px] shrink-0">ВЕРХ:</span>
              <span className="text-slate-300 truncate">{perfume.pyramid.top.join(' • ')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-amber-400 font-bold font-mono text-[10px] shrink-0">СЕРДЦЕ:</span>
              <span className="text-slate-300 truncate">{perfume.pyramid.heart.join(' • ')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-indigo-400 font-bold font-mono text-[10px] shrink-0">БАЗА:</span>
              <span className="text-slate-300 truncate">{perfume.pyramid.base.join(' • ')}</span>
            </div>
          </div>

          {/* Synergy with Outfit */}
          <div className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200/90 leading-relaxed">
            <strong className="text-amber-300 block mb-0.5 text-[11px] uppercase tracking-wider font-mono flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              Вердикт Мультимодального Сольфеджио:
            </strong>
            {solfeggio.verdict}
          </div>

          {/* Wardrobe Gap Alert (if perfume from shelf is far from ideal) */}
          {hasWardrobeGap && gapAdvice && idealCatalogMatch && (
            <div className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-500/40 text-xs text-rose-200/90 flex flex-col gap-1.5 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-300 text-[11px] uppercase font-mono flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  Ольфакторный пробел в гардеробе
                </span>
                <span className="text-[10px] font-mono text-rose-400 bg-rose-950/80 px-1.5 py-0.5 rounded border border-rose-800">
                  Совет стилиста
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-rose-100/90">
                {gapAdvice}
              </p>
              {onSelectPerfume && (
                <button
                  onClick={() => onSelectPerfume(idealCatalogMatch)}
                  className="self-start mt-0.5 text-[10px] font-mono text-amber-300 hover:text-amber-200 underline flex items-center gap-1 cursor-pointer"
                >
                  Посмотреть эталон: {idealCatalogMatch.brand} {idealCatalogMatch.name}
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* НОВЫЙ БЛОК: Двигатель нот (Периодическая система нот) */}
      {notesEngine && (
        <div className="border-t border-slate-800/80 pt-3 flex flex-col gap-2.5 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Atom className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Двигатель нот (Периодическая система)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Резонанс: {notesEngine.resonanceScore}%
              </span>
            </div>

            {onOpenPeriodicTable && (
              <button
                onClick={onOpenPeriodicTable}
                className="text-[11px] font-mono text-indigo-400 hover:text-indigo-300 underline flex items-center gap-1 cursor-pointer"
              >
                <span>Таблица элементов</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Layer-to-Note Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/90 space-y-1">
              <span className="text-[10px] font-mono font-bold text-indigo-400 block uppercase">
                Базовый якорь (L4/L1)
              </span>
              <p className="text-[11px] text-slate-300 leading-snug">
                {notesEngine.baseAnchorVerdict}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/90 space-y-1">
              <span className="text-[10px] font-mono font-bold text-amber-400 block uppercase">
                Социальное сердце (L3)
              </span>
              <p className="text-[11px] text-slate-300 leading-snug">
                {notesEngine.heartSocialVerdict}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/90 space-y-1">
              <span className="text-[10px] font-mono font-bold text-sky-400 block uppercase">
                Атмосферная аура
              </span>
              <p className="text-[11px] text-slate-300 leading-snug">
                {notesEngine.topAuraVerdict}
              </p>
            </div>
          </div>

          {/* Resonant Pairs Badges */}
          {notesEngine.resonantPairs.length > 0 ? (
            <div className="p-2 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
              <span className="text-emerald-400 font-bold flex items-center gap-1 mr-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Связки нота ⟷ ткань:
              </span>
              {notesEngine.resonantPairs.map((pair, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-emerald-950/70 text-emerald-200 border border-emerald-700/60"
                  title={pair.reason}
                >
                  {pair.note.name} ({pair.note.symbol}) ⟷ {pair.layer} {pair.fabric}
                </span>
              ))}
            </div>
          ) : (
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-[10px] text-slate-400 font-mono">
              Нейтральный баланс: ноты аромата не создают конфликта с фактурами слоев.
            </div>
          )}

          {/* Clashes Warning (if any) */}
          {notesEngine.clashes.length > 0 && (
            <div className="p-2 rounded-xl bg-rose-950/30 border border-rose-500/40 text-[11px] text-rose-200 space-y-1">
              <strong className="text-rose-400 text-[10px] font-mono uppercase block flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                Предупреждение нотного двигателя:
              </strong>
              {notesEngine.clashes.map((c, i) => (
                <div key={i} className="text-[10px] text-rose-100">
                  • {c.warning}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 8D Solfeggio Radar Breakdown & Clashes */}
      <div className="border-t border-slate-800/80 pt-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            Канонический 8D-радар Аньянова (Гардероб vs Аромат)
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            cos(θ) = {solfeggio.cosineSimilarity}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
          {(Object.keys(AXIS_LABELS) as (keyof typeof AXIS_LABELS)[]).map((axis) => {
            const meta = AXIS_LABELS[axis];
            const oVal = solfeggio.outfitVector[axis];
            const pVal = solfeggio.perfumeVector[axis];
            const diff = Math.abs(oVal - pVal);

            return (
              <div
                key={axis}
                className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 flex flex-col gap-1"
              >
                <div className="flex justify-between items-center text-slate-300 font-medium">
                  <span>{meta.name}</span>
                  <span className={`font-mono font-bold ${
                    diff >= 1.0 ? 'text-rose-400' : diff >= 0.65 ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    Δ {diff.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[9px] text-slate-500 font-mono">
                  <span className="text-indigo-300">Лук: {oVal > 0 ? '+' : ''}{oVal.toFixed(2)}</span>
                  <span className="text-amber-300">Парфюм: {pVal > 0 ? '+' : ''}{pVal.toFixed(2)}</span>
                </div>
              </div>
            );
          })}
        </div>

        {solfeggio.clashes.length > 0 && (
          <div className="mt-1 flex flex-col gap-1 bg-slate-950/80 p-2 rounded-lg border border-slate-800 text-[11px]">
            {solfeggio.clashes.slice(0, 2).map((clash, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-amber-300/90 text-[10px]">
                <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                <span>
                  <strong>[{AXIS_LABELS[clash.axis].name}]:</strong> {clash.diagnosis}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
