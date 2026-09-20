import React, { useState } from 'react';
import { AnyanovCoordinates, FormalIndex, ControlMode, AnyanovSeason } from '../types';
import { Compass, Flame, Shield, Thermometer, Sparkles, Sun, Snowflake } from 'lucide-react';

interface AnyanovSlidersProps {
  coords: AnyanovCoordinates;
  onChangeCoords: (partial: Partial<AnyanovCoordinates>) => void;
  controlMode?: ControlMode;
  onControlModeChange?: (mode: ControlMode) => void;
  season?: AnyanovSeason;
  onSeasonChange?: (season: AnyanovSeason) => void;
}

export const AnyanovSliders: React.FC<AnyanovSlidersProps> = ({
  coords,
  onChangeCoords,
  controlMode = 'outfit',
  onControlModeChange,
  season = 'summer',
  onSeasonChange,
}) => {
  const [internalMode, setInternalMode] = useState<ControlMode>(controlMode);
  const activeMode = onControlModeChange ? controlMode : internalMode;

  const handleModeToggle = (mode: ControlMode) => {
    if (onControlModeChange) {
      onControlModeChange(mode);
    } else {
      setInternalMode(mode);
    }
  };

  // Поворот ручек-крутилок (-1 = -90deg, 0 = 0deg, +1 = +90deg)
  const degX = Math.round(coords.socialX * 90);
  const degY = Math.round(coords.thermoY * 90);

  // Живая формула квадранта / сценария по зарисовкам
  const getScenarioLabel = () => {
    const { socialX: x, thermoY: y } = coords;
    if (Math.abs(x) < 0.25 && Math.abs(y) < 0.25) {
      return { title: 'УНИВЕРСАЛ', formula: `X: ${x.toFixed(2)}, Y: ${y.toFixed(2)} → Dylan Blue` };
    }
    if (x <= 0 && y >= 0) {
      return { title: 'РАБОТА (СЗ)', formula: `X: ${x.toFixed(2)}, Y: ${y.toFixed(2)} → Pour Homme` };
    }
    if (x > 0 && y >= 0) {
      const p = season === 'summer' ? 'Man Eau Fraîche' : 'The Dreamer';
      return { title: 'ОТДЫХ / ПЛЯЖ (СВ)', formula: `X: ${x.toFixed(2)}, Y: ${y.toFixed(2)} → ${p}` };
    }
    if (x <= 0 && y < 0) {
      return { title: 'ТЕАТР / ВЕЧЕР (ЮЗ)', formula: `X: ${x.toFixed(2)}, Y: ${y.toFixed(2)} → Oud Noir` };
    }
    const p = season === 'summer' ? 'Eros EDT' : 'Eros EDP';
    return { title: 'СВИДАНИЕ / СОБЛАЗН (ЮВ)', formula: `X: ${x.toFixed(2)}, Y: ${y.toFixed(2)} → ${p}` };
  };

  const scenarioInfo = getScenarioLabel();

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col gap-5 shadow-2xl">
      {/* 1. Верхняя панель: Заголовок + Тумблер режимов (Наряд vs Парфюм) */}
      <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Compass className="w-4 h-4" />
          </span>
          <div>
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
              Пульт управления Аньянова
            </span>
            <span className="text-[10px] text-slate-400">
              {activeMode === 'outfit' ? 'Режим «Наряд» (Новичок)' : 'Режим «Парфюм» (Профи)'}
            </span>
          </div>
        </div>

        {/* Тумблер режимов (Новичок: Наряд vs Профи: Парфюм) */}
        <div className="inline-flex rounded-xl p-0.5 bg-slate-950 border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => handleModeToggle('outfit')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeMode === 'outfit'
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            👔 Наряд (Новичок)
          </button>
          <button
            onClick={() => handleModeToggle('perfume')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeMode === 'perfume'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🧪 Парфюм (Профи)
          </button>
        </div>
      </div>

      {/* Информационный бейдж живой формулы из блокнота */}
      <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between text-xs font-mono">
        <span className="text-slate-400 font-bold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          {scenarioInfo.title}
        </span>
        <span className="text-amber-300 font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
          {scenarioInfo.formula}
        </span>
      </div>

      {/* 2. Аутентичные круговые регуляторы (Dials / Knobs) со стрелками из зарисовок */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800/70">
        
        {/* Ручка 1 (Ось X: Дресс-код / Дистанция) */}
        <div className="flex flex-col items-center text-center space-y-2.5">
          <div className="w-full flex items-center justify-between px-2">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wide">
              {activeMode === 'outfit' ? '1. ДРЕСС-КОД' : '1. ДИСТАНЦИЯ'}
            </span>
            <span className="font-mono text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/30">
              {coords.socialX > 0 ? '+' + coords.socialX.toFixed(2) : coords.socialX.toFixed(2)}
            </span>
          </div>

          {/* SVG Ручка 1 */}
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#1e293b" stroke-width="6" />
              {/* Метки шкалы */}
              <text x="14" y="54" font-size="7" fill="#a855f7" font-weight="bold">-1</text>
              <text x="24" y="28" font-size="7" fill="#c084fc">-0.5</text>
              <text x="50" y="18" font-size="7" fill="#94a3b8" text-anchor="middle">0</text>
              <text x="76" y="28" font-size="7" fill="#34d399">+0.5</text>
              <text x="86" y="54" font-size="7" fill="#10b981" font-weight="bold">+1</text>
            </svg>
            {/* Вращающаяся сердцевина ручки */}
            <div
              className="absolute w-20 h-20 rounded-full bg-slate-900 border-2 border-slate-700 shadow-xl flex items-center justify-center transition-transform duration-150"
              style={{ transform: `rotate(${degX}deg)` }}
            >
              <div className="absolute top-1.5 w-1.5 h-4 bg-purple-400 rounded-full shadow-[0_0_8px_#c084fc]" />
              <div className="w-8 h-8 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              </div>
            </div>
          </div>

          {/* Слайдер-дублер */}
          <input
            type="range"
            min="-1"
            max="1"
            step="0.05"
            value={coords.socialX}
            onChange={(e) => onChangeCoords({ socialX: parseFloat(e.target.value) })}
            className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-purple-500 border border-slate-800"
          />
          <div className="flex justify-between w-full text-[10px] font-mono text-slate-400 px-1">
            <span>{activeMode === 'outfit' ? '◄ Black Tie' : '◄ Далеко (Шлейф)'}</span>
            <span>{activeMode === 'outfit' ? 'Casual ►' : 'Близко (Интим) ►'}</span>
          </div>
        </div>

        {/* Ручка 2 (Ось Y: Время суток / Диффузия) */}
        <div className="flex flex-col items-center text-center space-y-2.5">
          <div className="w-full flex items-center justify-between px-2">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wide">
              {activeMode === 'outfit' ? '2. ВРЕМЯ СУТОК' : '2. ДИФФУЗИЯ'}
            </span>
            <span className="font-mono text-xs font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/30">
              {coords.thermoY > 0 ? '+' + coords.thermoY.toFixed(2) : coords.thermoY.toFixed(2)}
            </span>
          </div>

          {/* SVG Ручка 2 */}
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#1e293b" stroke-width="6" />
              <text x="14" y="54" font-size="7" fill="#818cf8" font-weight="bold">-1(В)</text>
              <text x="24" y="28" font-size="7" fill="#93c5fd">-0.5</text>
              <text x="50" y="18" font-size="7" fill="#94a3b8" text-anchor="middle">0</text>
              <text x="76" y="28" font-size="7" fill="#67e8f9">+0.5</text>
              <text x="86" y="54" font-size="7" fill="#38bdf8" font-weight="bold">+1(Д)</text>
            </svg>
            <div
              className="absolute w-20 h-20 rounded-full bg-slate-900 border-2 border-slate-700 shadow-xl flex items-center justify-center transition-transform duration-150"
              style={{ transform: `rotate(${degY}deg)` }}
            >
              <div className="absolute top-1.5 w-1.5 h-4 bg-sky-400 rounded-full shadow-[0_0_8px_#38bdf8]" />
              <div className="w-8 h-8 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-sky-500" />
              </div>
            </div>
          </div>

          {/* Слайдер-дублер */}
          <input
            type="range"
            min="-1"
            max="1"
            step="0.05"
            value={coords.thermoY}
            onChange={(e) => onChangeCoords({ thermoY: parseFloat(e.target.value) })}
            className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-sky-400 border border-slate-800"
          />
          <div className="flex justify-between w-full text-[10px] font-mono text-slate-400 px-1">
            <span>{activeMode === 'outfit' ? '◄ Ночь / Вечер' : '◄ Долго (Смолы/Уд)'}</span>
            <span>{activeMode === 'outfit' ? 'День / Утро ►' : 'Быстро (Цитрус) ►'}</span>
          </div>
        </div>

      </div>

      {/* 3. Дополнительные параметры: Индекс формальности (FI) & Температура */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        {/* Индекс формальности */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-300 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              Индекс формальности (FI)
            </span>
            <span className="font-mono text-[11px] font-bold text-indigo-300">
              {coords.formalIndex === 1 && 'FI 1: Casual'}
              {coords.formalIndex === 2 && 'FI 2: Smart Casual'}
              {coords.formalIndex === 3 && 'FI 3: Formal'}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { level: 1 as FormalIndex, label: 'Casual' },
              { level: 2 as FormalIndex, label: 'Smart Cas' },
              { level: 3 as FormalIndex, label: 'Formal' },
            ].map((item) => (
              <button
                key={item.level}
                onClick={() => onChangeCoords({ formalIndex: item.level })}
                className={`py-1.5 rounded-lg border text-center transition-all cursor-pointer text-xs ${
                  coords.formalIndex === item.level
                    ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Температура окружающей среды */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-300 flex items-center gap-1">
              <Thermometer className="w-3.5 h-3.5 text-emerald-400" />
              Температура воздуха
            </span>
            <span className="font-mono text-[11px] font-bold text-emerald-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              {coords.temperatureC > 0 ? '+' + coords.temperatureC + '°C' : coords.temperatureC + '°C'}
            </span>
          </div>
          <input
            type="range"
            min="-15"
            max="35"
            step="1"
            value={coords.temperatureC}
            onChange={(e) => onChangeCoords({ temperatureC: parseInt(e.target.value, 10) })}
            className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-500 border border-slate-800"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>-15°C (Мороз)</span>
            <span>+15°C</span>
            <span>+35°C (Зной)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

