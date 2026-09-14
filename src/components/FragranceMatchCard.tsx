import React from 'react';
import { PerfumeItem } from '../types';
import { Sparkles } from 'lucide-react';

interface FragranceMatchCardProps {
  perfume: PerfumeItem;
  synergyVerdict: string;
  compatibilityScore: number;
}

export const FragranceMatchCard: React.FC<FragranceMatchCardProps> = ({
  perfume,
  synergyVerdict,
  compatibilityScore,
}) => {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col gap-4 shadow-xl relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 z-10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Ольфакторный дуэт (Fragrance Mirror)
          </h2>
        </div>
        <span className="text-[11px] font-mono text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30 flex items-center gap-1 font-bold">
          Синергия: {compatibilityScore}%
        </span>
      </div>

      {/* Main Perfume Presentation */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center z-10">
        {/* Left: Bottle Vector Illustration (4 cols) */}
        <div className="sm:col-span-4 flex flex-col items-center justify-center bg-slate-950/70 rounded-xl border border-slate-800/80 p-4 min-h-[220px]">
          <svg
            viewBox="0 0 100 160"
            className="w-24 h-36 drop-shadow-[0_8px_16px_rgba(245,158,11,0.2)]"
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
            <rect x="28" y="78" width="44" height="40" rx="2" fill="#020617" stroke="#f59e0b" strokeWidth="1" />
            <text x="50" y="94" fill="#ffffff" fontSize="6" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              {perfume.brand.toUpperCase()}
            </text>
            <text x="50" y="105" fill="#f59e0b" fontSize="7" fontWeight="900" textAnchor="middle" fontFamily="serif">
              {perfume.name.length > 12 ? perfume.name.slice(0, 11) + '..' : perfume.name}
            </text>
          </svg>
          <span className="text-[10px] font-mono text-slate-400 mt-2">
            Диффузия: {perfume.diffusion}
          </span>
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
            <strong className="text-amber-300 block mb-0.5 text-[11px] uppercase tracking-wider font-mono">
              Почему идеально подходит к образу:
            </strong>
            {synergyVerdict}
          </div>
        </div>
      </div>
    </div>
  );
};
