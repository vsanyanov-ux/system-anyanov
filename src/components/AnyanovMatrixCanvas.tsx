import React, { useRef } from 'react';
import { AnyanovCoordinates, QuadrantInfo } from '../types';

interface AnyanovMatrixCanvasProps {
  coords: AnyanovCoordinates;
  quadrant: QuadrantInfo;
  onChangeCoords: (partial: Partial<AnyanovCoordinates>) => void;
}

export const AnyanovMatrixCanvas: React.FC<AnyanovMatrixCanvasProps> = ({
  coords,
  quadrant,
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

    // Маппинг:
    // rawX: 0 -> -1.00 (Власть), 1 -> +1.00 (Соблазн)
    // rawY: 0 -> +1.00 (Холод/День/Лето), 1 -> -1.00 (Тепло/Вечер/Зима)
    const newSocialX = Math.max(-1, Math.min(1, (rawX - 0.5) * 2));
    const newThermoY = Math.max(-1, Math.min(1, -(rawY - 0.5) * 2));

    onChangeCoords({
      socialX: Number(newSocialX.toFixed(2)),
      thermoY: Number(newThermoY.toFixed(2)),
    });
  };

  // Вычисление позиции точки на канвасе в процентах
  // socialX (-1..1) -> (socialX + 1) / 2 * 100%
  // thermoY (-1..1) -> (1 - (thermoY + 1) / 2) * 100%
  const dotLeft = ((coords.socialX + 1) / 2) * 100;
  const dotTop = (1 - (coords.thermoY + 1) / 2) * 100;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col gap-3 relative shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
            Координатная доска Аньянова
          </span>
          <p className="text-[11px] text-slate-400">
            Нажмите в любую точку матрицы для мгновенного выбора
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
          <span className="text-slate-400">X:</span>
          <span className="font-bold text-white">{coords.socialX.toFixed(2)}</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Y:</span>
          <span className="font-bold text-white">{coords.thermoY.toFixed(2)}</span>
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
        {/* Сетка блокнота (клетка как на оригинальном рисунке ТОПАЗ) */}
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
        {/* Горизонтальная ось X (Y = 0) — Экватор между Настроением и Властью */}
        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-slate-600/70 -translate-y-1/2 pointer-events-none" />
        {/* Вертикальная ось Y (X = 0) — Разделитель Дистанция vs Сближение */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-slate-600/70 -translate-x-1/2 pointer-events-none" />

        {/* Подписи главных полюсов по осям (по наброскам из блокнота) */}
        {/* СЕВЕР (Верх: Диффузия, Холод, День, Лето) */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none text-center">
          <span className="text-[10px] font-black uppercase tracking-wider text-sky-400 bg-slate-950/90 px-2 py-0.5 rounded border border-sky-500/30 shadow-md">
            ▲ ДИФФУЗИЯ • ХОЛОД • ДЕНЬ • ЛЕТО
          </span>
        </div>

        {/* ЮГ (Низ: Стойкость, Тепло, Вечер, Зима) */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none text-center">
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-slate-950/90 px-2 py-0.5 rounded border border-amber-500/30 shadow-md">
            ▼ ДОЛГОЕ ДЕЙСТВИЕ • ТЕПЛО • ВЕЧЕР • ЗИМА
          </span>
        </div>

        {/* ЗАПАД (Лево: Власть, Статус, Дистанция) */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col items-start pointer-events-none text-left max-w-[130px]">
          <span className="text-[10px] font-black uppercase tracking-wider text-indigo-300 bg-slate-950/90 px-2 py-0.5 rounded border border-indigo-500/30 shadow-md">
            ◄ ВЛАСТЬ • СТАТУС
          </span>
          <span className="text-[9px] text-slate-400 font-mono mt-0.5">
            Дистанция • Formal
          </span>
        </div>

        {/* ВОСТОК (Право: Соблазн, Сближение, Casual) */}
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

        {/* Активная точка (Позиция пользователя) */}
        <div
          className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-75 flex items-center justify-center"
          style={{
            left: dotLeft + '%',
            top: dotTop + '%',
          }}
        >
          {/* Пульсирующий ореол */}
          <span className="absolute w-full h-full rounded-full bg-amber-400/30 animate-ping" />
          {/* Точка */}
          <span className="relative w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-white shadow-[0_0_12px_#f59e0b]" />
        </div>
      </div>

      {/* Текущий квадрант бейдж */}
      <div
        className={"p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 " + quadrant.bgColor + " " + quadrant.borderColor}
      >
        <div>
          <span className="text-xs font-bold text-white block">
            {quadrant.name}
          </span>
          <span className="text-[11px] text-slate-300">
            {quadrant.subtitle}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/50 text-amber-300 border border-amber-500/30">
            {coords.thermoY >= 0 ? '✨ ЯРУС НАСТРОЕНИЯ' : '👑 ЯРУС ВЛАСТИ'}
          </span>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/40 text-slate-200 border border-white/10">
            {coords.socialX < 0 ? 'ДИСТАНЦИЯ' : 'СБЛИЖЕНИЕ'}
          </span>
        </div>
      </div>
    </div>
  );
};
