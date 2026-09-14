import React, { useRef } from 'react';
import { AnyanovCoordinates, PerfumeItem, QuadrantInfo, SolfeggioAnalysis } from '../types';

interface AnyanovMatrixCanvasProps {
  coords: AnyanovCoordinates;
  quadrant: QuadrantInfo;
  perfume: PerfumeItem;
  solfeggio: SolfeggioAnalysis;
  onChangeCoords: (partial: Partial<AnyanovCoordinates>) => void;
}

export const AnyanovMatrixCanvas: React.FC<AnyanovMatrixCanvasProps> = ({
  coords,
  quadrant,
  perfume,
  solfeggio,
  onChangeCoords,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointer = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const rawX = (clientX - rect.left) / rect.width; // 0 to 1
    const rawY = (clientY - rect.top) / rect.height; // 0 to 1

    const newSocialX = Math.max(-1, Math.min(1, (rawX - 0.5) * 2));
    const newThermoY = Math.max(-1, Math.min(1, -(rawY - 0.5) * 2));

    onChangeCoords({
      socialX: Number(newSocialX.toFixed(2)),
      thermoY: Number(newThermoY.toFixed(2)),
    });
  };

  // 1. Точка Желаемого Состояния (Фокус пользователя)
  const targetLeft = ((coords.socialX + 1) / 2) * 100;
  const targetTop = (1 - (coords.thermoY + 1) / 2) * 100;

  // 2. Точка Гардероба (вычисленная из слоев L1..L4)
  const outfitLeft = ((solfeggio.outfitCoords.x + 1) / 2) * 100;
  const outfitTop = (1 - (solfeggio.outfitCoords.y + 1) / 2) * 100;

  // 3. Точка Парфюма (координаты аромата)
  const perfumeLeft = ((perfume.xCoord + 1) / 2) * 100;
  const perfumeTop = (1 - (perfume.yCoord + 1) / 2) * 100;

  // Средняя точка для бейджа расстояния между одеждой и ароматом
  const midX = (outfitLeft + perfumeLeft) / 2;
  const midY = (outfitTop + perfumeTop) / 2;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col gap-3 relative shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
            Координатная доска Аньянова
          </span>
          <p className="text-[11px] text-slate-400">
            Двухточечный радар: Одежда vs Аромат • Мультимодальное сольфеджио
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
          <span className="text-slate-400">D:</span>
          <span className="font-bold text-amber-300">{solfeggio.distance}</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">cos:</span>
          <span className="font-bold text-emerald-400">{solfeggio.cosineSimilarity}</span>
        </div>
      </div>

      {/* 2D Interactive Board */}
      <div
        ref={containerRef}
        onClick={handlePointer}
        onMouseMove={(e) => {
          if (e.buttons === 1) handlePointer(e);
        }}
        className="relative w-full aspect-[4/3] sm:aspect-square max-h-[380px] bg-slate-950 rounded-xl border border-slate-700/60 overflow-hidden cursor-crosshair select-none touch-none shadow-inner"
      >
        {/* Сетка блокнота */}
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)',
            backgroundSize: '16px 16px',
          }}
        />

        {/* ЯРУС 1 (ВЕРХНИЙ): ЗОНА НАСТРОЕНИЯ (Отношение к себе: Y > 0) */}
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-sky-500/[0.05] via-emerald-500/[0.02] to-transparent pointer-events-none border-b border-sky-500/10">
          <div className="absolute top-1.5 right-2 px-2 py-0.5 rounded bg-sky-950/70 border border-sky-500/20 text-[9px] font-mono text-sky-300 font-bold tracking-wider uppercase">
            ✨ Верх: Настроение (Отношение к себе)
          </div>
        </div>

        {/* ЯРУС 2 (НИЖНИЙ): ЗОНА ВЛАСТИ (Отношение к обществу: Y < 0) */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-amber-500/[0.05] via-indigo-500/[0.02] to-transparent pointer-events-none border-t border-amber-500/10">
          <div className="absolute bottom-1.5 right-2 px-2 py-0.5 rounded bg-amber-950/70 border border-amber-500/20 text-[9px] font-mono text-amber-300 font-bold tracking-wider uppercase">
            👑 Низ: Власть (Отношение к обществу)
          </div>
        </div>

        {/* Оси X и Y */}
        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-slate-600/70 -translate-y-1/2 pointer-events-none" />
        <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-slate-600/70 -translate-x-1/2 pointer-events-none" />

        {/* Подписи полюсов */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none text-center">
          <span className="text-[10px] font-black uppercase tracking-wider text-sky-400 bg-slate-950/90 px-2 py-0.5 rounded border border-sky-500/30 shadow-md">
            ▲ ДИФФУЗИЯ • ХОЛОД • ДЕНЬ • ЛЕТО
          </span>
        </div>

        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none text-center">
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-slate-950/90 px-2 py-0.5 rounded border border-amber-500/30 shadow-md">
            ▼ ДОЛГОЕ ДЕЙСТВИЕ • ТЕПЛО • ВЕЧЕР • ЗИМА
          </span>
        </div>

        <div className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col items-start pointer-events-none text-left max-w-[130px]">
          <span className="text-[10px] font-black uppercase tracking-wider text-indigo-300 bg-slate-950/90 px-2 py-0.5 rounded border border-indigo-500/30 shadow-md">
            ◄ ВЛАСТЬ • СТАТУС
          </span>
          <span className="text-[9px] text-slate-400 font-mono mt-0.5">
            Дистанция • Formal
          </span>
        </div>

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col items-end pointer-events-none text-right max-w-[130px]">
          <span className="text-[10px] font-black uppercase tracking-wider text-pink-400 bg-slate-950/90 px-2 py-0.5 rounded border border-pink-500/30 shadow-md">
            СОБЛАЗН • ИНТИМ ►
          </span>
          <span className="text-[9px] text-slate-400 font-mono mt-0.5">
            Сближение • Casual
          </span>
        </div>

        {/* Фоновые маркеры квадрантов */}
        <div className="absolute top-9 left-4 text-[10px] font-bold text-sky-400/50 uppercase pointer-events-none">
          Фокус &amp; Дисциплина
        </div>
        <div className="absolute top-9 right-4 text-[10px] font-bold text-emerald-400/50 uppercase pointer-events-none text-right">
          Легкость &amp; Бриз
        </div>
        <div className="absolute bottom-9 left-4 text-[10px] font-bold text-indigo-400/50 uppercase pointer-events-none">
          Твёрдая Власть
        </div>
        <div className="absolute bottom-9 right-4 text-[10px] font-bold text-amber-400/50 uppercase pointer-events-none text-right">
          Мягкая Власть (Соблазн)
        </div>

        {/* SVG Векторная линия-связка между Гардеробом и Парфюмом */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          <line
            x1={`${outfitLeft}%`}
            y1={`${outfitTop}%`}
            x2={`${perfumeLeft}%`}
            y2={`${perfumeTop}%`}
            stroke={
              solfeggio.harmonyState === 'UNISON'
                ? '#10b981'
                : solfeggio.harmonyState === 'CONTRAPUNCT'
                ? '#f59e0b'
                : '#f43f5e'
            }
            strokeWidth="2"
            strokeDasharray="4 4"
            className="animate-pulse"
          />
        </svg>

        {/* Бейдж расстояния посередине линии связи */}
        <div
          className="absolute z-20 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-100"
          style={{ left: `${midX}%`, top: `${midY}%` }}
        >
          <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded-full border shadow-md font-bold ${
            solfeggio.harmonyState === 'UNISON'
              ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50'
              : solfeggio.harmonyState === 'CONTRAPUNCT'
              ? 'bg-amber-950/90 text-amber-300 border-amber-500/50'
              : 'bg-rose-950/90 text-rose-300 border-rose-500/50'
          }`}>
            D: {solfeggio.distance}
          </span>
        </div>

        {/* 1. Точка Желаемого состояния (Target / Focus) */}
        <div
          className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-75 flex items-center justify-center z-10"
          style={{ left: targetLeft + '%', top: targetTop + '%' }}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-white/40 border border-white/80" />
        </div>

        {/* 2. Точка Гардероба (Одежда) - 🟣 Indigo/Violet */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-150 flex flex-col items-center z-30"
          style={{ left: outfitLeft + '%', top: outfitTop + '%' }}
        >
          <div className="relative flex items-center justify-center">
            <span className="absolute w-5 h-5 rounded-full bg-indigo-500/40 animate-ping" />
            <span className="w-3.5 h-3.5 rounded-full bg-indigo-500 border-2 border-white shadow-[0_0_10px_#6366f1]" />
          </div>
          <span className="mt-1 text-[8px] font-mono font-black uppercase px-1 py-0.2 rounded bg-indigo-950/90 text-indigo-200 border border-indigo-500/50 whitespace-nowrap shadow">
            Гардероб
          </span>
        </div>

        {/* 3. Точка Парфюма (Аромат) - 🟡 Amber */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-150 flex flex-col items-center z-30"
          style={{ left: perfumeLeft + '%', top: perfumeTop + '%' }}
        >
          <div className="relative flex items-center justify-center">
            <span className="absolute w-5 h-5 rounded-full bg-amber-400/40 animate-ping" />
            <span className="w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-white shadow-[0_0_12px_#f59e0b]" />
          </div>
          <span className="mt-1 text-[8px] font-mono font-black uppercase px-1 py-0.2 rounded bg-amber-950/90 text-amber-200 border border-amber-500/50 whitespace-nowrap shadow">
            Парфюм
          </span>
        </div>
      </div>

      {/* Сольфеджио статус-панель */}
      <div className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-all ${solfeggio.badgeColor}`}>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider">
              {solfeggio.stateLabel}
            </span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/40 border border-white/10">
              D = {solfeggio.distance}
            </span>
          </div>
          <span className="text-[11px] opacity-90 mt-0.5">
            {solfeggio.verdict}
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/50 text-amber-300 border border-amber-500/30">
            {coords.thermoY >= 0 ? '✨ НАСТРОЕНИЕ' : '👑 ВЛАСТЬ'}
          </span>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/40 text-slate-200 border border-white/10">
            {coords.socialX < 0 ? 'ДИСТАНЦИЯ' : 'СБЛИЖЕНИЕ'}
          </span>
        </div>
      </div>
    </div>
  );
};

