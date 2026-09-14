import React from 'react';
import { PRESET_SCENARIOS } from '../data/presets';
import { AnyanovCoordinates } from '../types';

interface PresetSelectorProps {
  currentCoords: AnyanovCoordinates;
  onSelectPreset: (coords: AnyanovCoordinates) => void;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({
  currentCoords,
  onSelectPreset,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Быстрые сценарии (В 1 клик)
        </span>
        <span className="text-[11px] text-slate-500 font-mono">
          Минимум усилий
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {PRESET_SCENARIOS.map((scenario) => {
          const isSelected =
            Math.abs(currentCoords.socialX - scenario.coords.socialX) < 0.15 &&
            Math.abs(currentCoords.thermoY - scenario.coords.thermoY) < 0.15 &&
            currentCoords.formalIndex === scenario.coords.formalIndex;

          const buttonClass = isSelected
            ? 'bg-amber-500/15 border-amber-500/80 shadow-lg shadow-amber-500/10'
            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60';

          const titleClass = isSelected
            ? 'text-amber-300'
            : 'text-slate-200 group-hover:text-white';

          return (
            <button
              key={scenario.id}
              onClick={() => onSelectPreset(scenario.coords)}
              className={"text-left p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-1.5 relative overflow-hidden group " + buttonClass}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-lg">{scenario.icon}</span>
                <span className={"text-xs font-bold leading-snug line-clamp-1 " + titleClass}>
                  {scenario.title}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 line-clamp-1">
                {scenario.subtitle}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
