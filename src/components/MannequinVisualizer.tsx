import React from 'react';
import { OutfitStack, SolfeggioAnalysis, WardrobeItem } from '../types';
import { Layers, CheckCircle2, Compass } from 'lucide-react';

interface MannequinVisualizerProps {
  outfit: OutfitStack;
  rulesApplied: string[];
  solfeggio?: SolfeggioAnalysis;
}

export const MannequinVisualizer: React.FC<MannequinVisualizerProps> = ({
  outfit,
  rulesApplied,
  solfeggio,
}) => {
  const l4 = outfit.l4;
  const l3 = outfit.l3;
  const l2 = outfit.l2;
  const l1 = outfit.l1;

  const l4Color = l4?.color || '#334155';
  const l3Color = l3.color || '#f8fafc';
  const l2Color = l2.color || '#1e293b';
  const l1Color = l1.color || '#09090b';

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col gap-4 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Гардеробная проекция (Wardrobe OS)
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {solfeggio && (
            <span className="text-[11px] font-mono text-indigo-300 bg-indigo-950/70 px-2 py-0.5 rounded border border-indigo-500/30 flex items-center gap-1 font-bold">
              <Compass className="w-3 h-3 text-indigo-400" />
              Координата лука: ({solfeggio.outfitCoords.x > 0 ? '+' : ''}{solfeggio.outfitCoords.x}, {solfeggio.outfitCoords.y > 0 ? '+' : ''}{solfeggio.outfitCoords.y})
            </span>
          )}
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            L1–L4 синхрон
          </span>
        </div>
      </div>

      {/* Center Layout: Mannequin SVG + Layer Stack breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Left: Vector Mannequin Diagram (5 cols) */}
        <div className="md:col-span-5 flex flex-col items-center justify-center bg-slate-950/60 rounded-xl border border-slate-800/80 p-3 min-h-[320px] relative overflow-hidden">
          {/* Subtle Grid */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
              backgroundSize: '12px 12px',
            }}
          />

          <svg
            viewBox="0 0 200 380"
            className="w-full max-w-[190px] h-[300px] drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] z-10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Ground shadow */}
            <ellipse cx="100" cy="365" rx="46" ry="8" fill="#000000" opacity="0.5" />

            {/* MALE MANNEQUIN SILHOUETTE */}
            {/* Neck */}
            <path d="M92 65 H108 V85 H92 Z" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
            {/* Head */}
            <path
              d="M100 20 C85 20 78 32 78 48 C78 64 88 74 100 74 C112 74 122 64 122 48 C122 32 115 20 100 20 Z"
              fill="#090d16"
              stroke="#64748b"
              strokeWidth="1.5"
            />

            {/* L2: TROUSERS / PANTS */}
            {/* Left leg */}
            <path
              d="M75 195 L68 318 C68 322 72 324 82 324 L94 324 C97 324 98 320 97 318 L97 210 Z"
              fill={l2Color}
              stroke="#0f172a"
              strokeWidth="1.5"
            />
            {/* Right leg */}
            <path
              d="M125 195 L132 318 C132 322 128 324 118 324 L106 324 C103 324 102 320 103 318 L103 210 Z"
              fill={l2Color}
              stroke="#0f172a"
              strokeWidth="1.5"
            />
            {/* Crotch & waistband */}
            <path d="M74 185 H126 V202 C126 206 120 210 100 210 C80 210 74 206 74 202 Z" fill={l2Color} />

            {/* L1: SHOES */}
            {/* Left Shoe */}
            <path
              d="M66 322 L62 342 C61 346 64 348 70 348 L94 348 C98 348 99 344 97 338 L95 322 Z"
              fill={l1Color}
              stroke="#000000"
              strokeWidth="1.5"
            />
            {/* Right Shoe */}
            <path
              d="M134 322 L138 342 C139 346 136 348 130 348 L106 348 C102 348 101 344 103 338 L105 322 Z"
              fill={l1Color}
              stroke="#000000"
              strokeWidth="1.5"
            />

            {/* L3: TORSO / SHIRT / SWEATER */}
            <path
              d="M66 84 L48 150 C46 156 50 162 56 160 L68 152 L68 190 C68 194 72 196 78 196 H122 C128 196 132 194 132 190 L132 152 L144 160 C150 162 154 156 152 150 L134 84 Z"
              fill={l3Color}
              stroke="#475569"
              strokeWidth="1.5"
            />
            {/* Collar V-detail */}
            <path d="M88 84 L100 104 L112 84 Z" fill="#e2e8f0" stroke="#475569" strokeWidth="1.2" />

            {/* L4: JACKET / BLAZER / COAT (If present) */}
            {l4 && (
              <>
                {/* Left side L4 */}
                <path
                  d="M62 82 L38 156 C36 162 40 168 47 166 L62 156 L62 205 C62 210 68 212 74 212 H96 L94 118 L70 82 Z"
                  fill={l4Color}
                  stroke="#0f172a"
                  strokeWidth="1.5"
                />
                {/* Right side L4 */}
                <path
                  d="M138 82 L162 156 C164 162 160 168 153 166 L138 156 L138 205 C138 210 132 212 126 212 H104 L106 118 L130 82 Z"
                  fill={l4Color}
                  stroke="#0f172a"
                  strokeWidth="1.5"
                />
                {/* Lapel left */}
                <path d="M74 82 L90 128 L82 132 L68 94 Z" fill="#1e293b" stroke="#000000" strokeWidth="1" />
                {/* Lapel right */}
                <path d="M126 82 L110 128 L118 132 L132 94 Z" fill="#1e293b" stroke="#000000" strokeWidth="1" />
              </>
            )}
          </svg>
        </div>

        {/* Right: Detailed Layer breakdown (7 cols) */}
        <div className="md:col-span-7 flex flex-col gap-2">
          {/* Overwear (Транзит до мероприятия) */}
          {outfit.overwear && (
            <div className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="w-4 h-4 rounded-md shrink-0 border border-white/20"
                  style={{ backgroundColor: outfit.overwear.color }}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-500/30">
                      ТРАНЗИТ
                    </span>
                    <span className="text-xs font-bold text-white truncate">
                      {outfit.overwear.name} (Улица • Сдается в гардероб)
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-200/70 truncate">
                    {outfit.overwear.fabric} • Защитный барьер по дороге
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* L4: Жакет / Пиджак на мероприятии */}
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-4 h-4 rounded-md shrink-0 border border-white/20"
                style={{ backgroundColor: l4Color }}
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold text-amber-400 bg-slate-900 px-1.5 py-0.2 rounded">
                    L4
                  </span>
                  <span className="text-xs font-bold text-white truncate">
                    {l4 ? l4.name : 'Без пиджака (Летний режим: Торс + Брюки + Обувь)'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">
                  {l4 ? `${l4.fabric} • ${l4.description}` : '3 легких слоя для дневного зноя'}
                </p>
              </div>
            </div>
          </div>

          {/* L3 */}
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-4 h-4 rounded-md shrink-0 border border-white/20"
                style={{ backgroundColor: l3Color }}
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-900 px-1.5 py-0.2 rounded">
                    L3
                  </span>
                  <span className="text-xs font-bold text-white truncate">{l3.name}</span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">
                  {l3.fabric} • {l3.description}
                </p>
              </div>
            </div>
          </div>

          {/* L2 */}
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-4 h-4 rounded-md shrink-0 border border-white/20"
                style={{ backgroundColor: l2Color }}
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-900 px-1.5 py-0.2 rounded">
                    L2
                  </span>
                  <span className="text-xs font-bold text-white truncate">{l2.name}</span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">
                  {l2.fabric} • {l2.description}
                </p>
              </div>
            </div>
          </div>

          {/* L1 */}
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-4 h-4 rounded-md shrink-0 border border-white/20"
                style={{ backgroundColor: l1Color }}
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-900 px-1.5 py-0.2 rounded">
                    L1
                  </span>
                  <span className="text-xs font-bold text-white truncate">{l1.name}</span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">
                  {l1.fabric} • {l1.description}
                </p>
              </div>
            </div>
          </div>

          {/* Applied Rules / Harmony summary */}
          <div className="mt-1 p-2 bg-slate-950/40 rounded-xl border border-slate-800/60 text-[11px] text-slate-400 space-y-1">
            <span className="font-bold text-slate-300 block font-mono text-[10px] uppercase">
              Примененные алгоритмы безошибочности:
            </span>
            <ul className="list-disc list-inside space-y-0.5 text-[10px] text-slate-400">
              {rulesApplied.map((rule, idx) => (
                <li key={idx} className="line-clamp-1">
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
