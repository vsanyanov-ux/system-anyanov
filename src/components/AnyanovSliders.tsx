import React from 'react';
import { AnyanovCoordinates, FormalIndex } from '../types';
import { Compass, Flame, Shield, Thermometer } from 'lucide-react';

interface AnyanovSlidersProps {
  coords: AnyanovCoordinates;
  onChangeCoords: (partial: Partial<AnyanovCoordinates>) => void;
}

export const AnyanovSliders: React.FC<AnyanovSlidersProps> = ({
  coords,
  onChangeCoords,
}) => {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col gap-4 shadow-xl">
      <div className="border-b border-slate-800 pb-2 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Compass className="w-4 h-4 text-amber-400" />
          Слайдеры управления Системой
        </span>
        <span className="text-[11px] font-mono text-slate-500">
          Плавная регулировка
        </span>
      </div>

      {/* Слайдер 1: Дистанция и Впечатление (Ось X) */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-slate-200 flex items-center gap-1">
            1. Вектор социальной дистанции (Ось X)
          </span>
          <span className="font-mono font-bold text-amber-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            {coords.socialX > 0 ? '+' + coords.socialX.toFixed(2) : coords.socialX.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-[11px] text-slate-400 font-medium">
          <span className="text-indigo-300">◄ Власть / Статус / Formal</span>
          <span className="text-pink-300">Соблазн / Интим / Casual ►</span>
        </div>
        <input
          type="range"
          min="-1"
          max="1"
          step="0.05"
          value={coords.socialX}
          onChange={(e) => onChangeCoords({ socialX: parseFloat(e.target.value) })}
          className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-amber-500 border border-slate-800"
        />
      </div>

      {/* Слайдер 2: Термодинамика, Диффузия и Время (Ось Y) */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-slate-200 flex items-center gap-1">
            2. Диффузия &amp; Время суток (Ось Y: Настроение ◄► Власть)
          </span>
          <span className="font-mono font-bold text-sky-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            {coords.thermoY > 0 ? '+' + coords.thermoY.toFixed(2) : coords.thermoY.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-[11px] text-slate-400 font-medium">
          <span className="text-amber-300">▼ Низ: Власть (Вечер • Зима • Тепло)</span>
          <span className="text-sky-300">Верх: Настроение (День • Лето • Диффузия) ▲</span>
        </div>
        <input
          type="range"
          min="-1"
          max="1"
          step="0.05"
          value={coords.thermoY}
          onChange={(e) => onChangeCoords({ thermoY: parseFloat(e.target.value) })}
          className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-sky-400 border border-slate-800"
        />
      </div>

      {/* Слайдер 3: Индекс формальности (FI 1..3) */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-slate-200 flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
            3. Индекс формальности (FI)
          </span>
          <span className="font-mono text-xs font-bold text-indigo-300">
            {coords.formalIndex === 1 && 'FI 1: Pure Casual'}
            {coords.formalIndex === 2 && 'FI 2: Smart Casual'}
            {coords.formalIndex === 3 && 'FI 3: Business Formal'}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { level: 1 as FormalIndex, label: '1. Casual', desc: 'Свободный крой' },
            { level: 2 as FormalIndex, label: '2. Smart Casual', desc: 'Блейзер / Оксфорд' },
            { level: 3 as FormalIndex, label: '3. Formal', desc: 'Костюм / Галстук' },
          ].map((item) => (
            <button
              key={item.level}
              onClick={() => onChangeCoords({ formalIndex: item.level })}
              className={"p-2 rounded-xl border text-center transition-all cursor-pointer " + (
                coords.formalIndex === item.level
                  ? "bg-indigo-600/20 border-indigo-500 text-indigo-200 font-bold shadow-sm"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
              )}
            >
              <div className="text-xs">{item.label}</div>
              <div className="text-[10px] text-slate-500 line-clamp-1">{item.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Слайдер 4: Температура воздуха за окном */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-slate-200 flex items-center gap-1">
            <Thermometer className="w-3.5 h-3.5 text-emerald-400" />
            4. Температура окружающей среды
          </span>
          <span className="font-mono font-bold text-emerald-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            {coords.temperatureC > 0 ? '+' + coords.temperatureC + '°C' : coords.temperatureC + '°C'}
          </span>
        </div>
        <div className="flex justify-between text-[11px] text-slate-500 font-mono">
          <span>-15°C (Мороз)</span>
          <span>+15°C (Демисезон)</span>
          <span>+35°C (Жара)</span>
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
      </div>
    </div>
  );
};
