import React, { useRef } from 'react';
import { AnyanovCoordinates, PerfumeItem, QuadrantInfo, SolfeggioAnalysis, AnyanovSeason, ControlMode } from '../types';
import { Sun, Snowflake, Lock, Volume1, AlertTriangle } from 'lucide-react';

interface AnyanovMatrixCanvasProps {
  coords: AnyanovCoordinates;
  quadrant: QuadrantInfo;
  perfume: PerfumeItem;
  solfeggio: SolfeggioAnalysis;
  onChangeCoords: (partial: Partial<AnyanovCoordinates>) => void;
  season?: AnyanovSeason;
  onSeasonChange?: (season: AnyanovSeason) => void;
  controlMode?: ControlMode;
}

export const AnyanovMatrixCanvas: React.FC<AnyanovMatrixCanvasProps> = ({
  coords,
  quadrant,
  perfume,
  solfeggio,
  onChangeCoords,
  season = 'summer',
  onSeasonChange,
  controlMode = 'outfit',
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

  // Сезонные эталоны Аньянова (Фото 2 и 5)
  const nePerfumeName = season === 'summer' ? 'Man Eau Fraîche' : 'The Dreamer';
  const sePerfumeName = season === 'summer' ? 'Eros EDT' : 'Eros EDP';
  const centerPerfumeName = season === 'summer' ? 'Dylan Blue EDT' : 'Dylan Blue EDP';

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col gap-3 relative shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
            2D-Матрица Аньянова
          </span>
          <p className="text-[11px] text-slate-400">
            {controlMode === 'outfit'
              ? 'Оси: Y (Сутки: День ◄► Ночь) • X (Дресс-код: Formal ◄► Casual)'
              : 'Оси: Y (Диффузия: Быстро ◄► Долго) • X (Дистанция: Далеко ◄► Близко)'}
          </p>
        </div>

        {/* Сезонный тумблер Лето ☀️ / Зима ❄️ */}
        {onSeasonChange && (
          <div className="flex items-center p-0.5 bg-slate-950 rounded-xl border border-slate-800">
            <button
              onClick={() => onSeasonChange('summer')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                season === 'summer'
                  ? 'bg-amber-500 text-black shadow font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sun className="w-3 h-3" />
              <span>Лето</span>
            </button>
            <button
              onClick={() => onSeasonChange('winter')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                season === 'winter'
                  ? 'bg-sky-400 text-black shadow font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Snowflake className="w-3 h-3" />
              <span>Зима</span>
            </button>
          </div>
        )}
      </div>

      {/* Индикатор сезонного аудита Тетрады */}
      {solfeggio.tetrad.seasonalAudit?.activeNotice && (
        <div className={`px-3 py-1.5 rounded-xl border text-[11px] font-mono flex items-center gap-2 ${
          solfeggio.tetrad.seasonalAudit.isWinterLock
            ? 'bg-sky-950/60 border-sky-500/40 text-sky-200'
            : 'bg-amber-950/60 border-amber-500/40 text-amber-200'
        }`}>
          {solfeggio.tetrad.seasonalAudit.isWinterLock ? (
            <Lock className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          ) : (
            <Volume1 className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
          )}
          <span>{solfeggio.tetrad.seasonalAudit.activeNotice}</span>
        </div>
      )}

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

        {/* ЯРУС 1 (ВЕРХНИЙ): ЗОНА НАСТРОЕНИЯ / ДЕНЬ (Y > 0) */}
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-sky-500/[0.05] via-emerald-500/[0.02] to-transparent pointer-events-none border-b border-sky-500/10">
          <div className="absolute top-1.5 right-2 px-2 py-0.5 rounded bg-sky-950/70 border border-sky-500/20 text-[9px] font-mono text-sky-300 font-bold tracking-wider uppercase">
            {controlMode === 'outfit' ? '☀️ ДЕНЬ • ВОЗДУХ' : '✨ БЫСТРАЯ ДИФФУЗИЯ'}
          </div>
        </div>

        {/* ЯРУС 2 (НИЖНИЙ): ЗОНА ВЛАСТИ / НОЧЬ / ОБЩЕСТВО (Y < 0) */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-amber-500/[0.05] via-indigo-500/[0.02] to-transparent pointer-events-none border-t border-amber-500/10">
          <div className="absolute bottom-1.5 right-2 px-2 py-0.5 rounded bg-amber-950/70 border border-amber-500/20 text-[9px] font-mono text-amber-300 font-bold tracking-wider uppercase">
            {controlMode === 'outfit' ? '🌙 НОЧЬ • ОБЩЕСТВО' : '👑 СМОЛЫ • ДОЛГАЯ ДИФФУЗИЯ'}
          </div>
        </div>

        {/* Оси X и Y */}
        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-slate-600/70 -translate-y-1/2 pointer-events-none" />
        <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-slate-600/70 -translate-x-1/2 pointer-events-none" />

        {/* Центральный универсальный якорь: Dylan Blue */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 flex flex-col items-center">
          <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-400/50 flex items-center justify-center shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          </div>
          <span className="text-[7px] font-mono font-bold text-blue-300 bg-slate-950/90 px-1 rounded mt-0.5 border border-blue-500/30 whitespace-nowrap">
            {centerPerfumeName}
          </span>
        </div>

        {/* Подписи полюсов: динамические под режим */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none text-center">
          <span className="text-[9px] font-black uppercase tracking-wider text-sky-400 bg-slate-950/90 px-2 py-0.5 rounded border border-sky-500/30 shadow-md">
            {controlMode === 'outfit' ? '▲ ДЕНЬ (НАСТРОЕНИЕ)' : '▲ БЫСТРО • ВОЗДУШНОСТЬ'}
          </span>
        </div>

        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none text-center">
          <span className="text-[9px] font-black uppercase tracking-wider text-amber-400 bg-slate-950/90 px-2 py-0.5 rounded border border-amber-500/30 shadow-md">
            {controlMode === 'outfit' ? '▼ НОЧЬ • ОБЩЕСТВО' : '▼ ДОЛГО • ТЯЖЕСТЬ • УД'}
          </span>
        </div>

        <div className="absolute left-2 top-1/2 -translate-y-1/2 flex flex-col items-start pointer-events-none text-left max-w-[130px]">
          <span className="text-[9px] font-black uppercase tracking-wider text-indigo-300 bg-slate-950/90 px-1.5 py-0.5 rounded border border-indigo-500/30 shadow-md">
            {controlMode === 'outfit' ? '◄ FORMAL / BLACK TIE' : '◄ ДИСТАНЦИЯ (СТАТУС)'}
          </span>
        </div>

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col items-end pointer-events-none text-right max-w-[130px]">
          <span className="text-[9px] font-black uppercase tracking-wider text-pink-400 bg-slate-950/90 px-1.5 py-0.5 rounded border border-pink-500/30 shadow-md">
            {controlMode === 'outfit' ? 'CASUAL / РЕЛАКС ►' : 'МАГНЕТИЗМ (ИНТИМ) ►'}
          </span>
        </div>

        {/* СЕЗОННАЯ АСИММЕТРИЯ: Оверлей Зимнего Замка на Квадрант I (Северо-Восток: лён, нероли) */}
        {season === 'winter' && (
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-slate-950/75 backdrop-blur-[1px] border-l border-b border-sky-500/30 flex flex-col items-center justify-center pointer-events-none z-10 p-2 text-center transition-all duration-300">
            <div className="w-7 h-7 rounded-full bg-sky-950/90 border border-sky-400/60 flex items-center justify-center text-sky-300 shadow-[0_0_12px_rgba(56,189,248,0.3)] mb-1">
              <Lock className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-wider text-sky-300 font-mono">
              Q1: HARDWARE LOCK
            </span>
            <span className="text-[7.5px] text-sky-400/80 leading-tight mt-0.5 max-w-[130px]">
              Зимой лён и нероли выключены. Возврат в Камертон (0,0)
            </span>
          </div>
        )}

        {/* СЕЗОННАЯ АСИММЕТРИЯ: Оверлей Летнего Pianissimo на Квадранты III и IV (Южная полусфера) */}
        {season === 'summer' && (
          <div className="absolute bottom-1 left-2 pointer-events-none z-10 flex items-center gap-1.5 bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 rounded shadow-lg backdrop-blur-[2px]">
            <Volume1 className="w-3 h-3 text-amber-400 animate-pulse" />
            <span className="text-[8px] font-mono font-bold text-amber-300 uppercase tracking-wider">
              Лето: Q3/Q4 Pianissimo Only (1 спрей)
            </span>
          </div>
        )}

        {/* Фоновые маркеры эталонов квадрантов из блокнота */}
        <div className="absolute top-8 left-3 text-[9px] font-mono text-sky-400/80 pointer-events-none bg-slate-950/70 px-1.5 py-0.5 rounded border border-sky-500/20">
          💼 Pour Homme
        </div>
        <div className={`absolute top-8 right-3 text-[9px] font-mono pointer-events-none text-right px-1.5 py-0.5 rounded border ${
          season === 'winter'
            ? 'text-slate-500 bg-slate-950/90 border-slate-700/40 line-through'
            : 'text-emerald-400/80 bg-slate-950/70 border-emerald-500/20'
        }`}>
          🌿 {nePerfumeName}
        </div>
        <div className="absolute bottom-8 left-3 text-[9px] font-mono text-indigo-400/80 pointer-events-none bg-slate-950/70 px-1.5 py-0.5 rounded border border-indigo-500/20">
          🎭 Oud Noir
        </div>
        <div className="absolute bottom-8 right-3 text-[9px] font-mono text-amber-400/80 pointer-events-none text-right bg-slate-950/70 px-1.5 py-0.5 rounded border border-amber-500/20">
          🍷 {sePerfumeName}
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

      {/* Нижний вектор Аньянова из рукописи: СТАТУС <--- ВЛАСТЬ ---> МАГНЕТИЗМ */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-xl px-3 py-1.5 flex items-center justify-between text-[11px] font-mono shadow-inner">
        <span className="text-purple-400 font-bold flex items-center gap-1">
          <span>◄ СТАТУС</span>
          <span className="text-[9px] text-slate-500 hidden sm:inline">(Дистанция)</span>
        </span>
        <div className="flex items-center gap-1.5 text-amber-400 font-extrabold uppercase tracking-widest text-[10px]">
          <span>←</span>
          <span className="bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 text-amber-300">ВЛАСТЬ</span>
          <span>→</span>
        </div>
        <span className="text-pink-400 font-bold flex items-center gap-1">
          <span className="text-[9px] text-slate-500 hidden sm:inline">(Сближение)</span>
          <span>МАГНЕТИЗМ ►</span>
        </span>
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

