import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, RotateCcw, Compass, Tag } from 'lucide-react';
import { AnyanovCoordinates } from '../types';
import { parseNaturalLanguageQuery, CONCIERGE_SUGGESTIONS, SemanticParseResult } from '../engine/semanticParser';

interface SmartConciergeBarProps {
  onApplyCoords: (coords: AnyanovCoordinates) => void;
  currentCoords: AnyanovCoordinates;
}

export const SmartConciergeBar: React.FC<SmartConciergeBarProps> = ({
  onApplyCoords,
}) => {
  const [inputText, setInputText] = useState('');
  const [lastResult, setLastResult] = useState<SemanticParseResult | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCalibrate = (textToParse?: string) => {
    const text = (textToParse ?? inputText).trim();
    if (!text) return;

    const result = parseNaturalLanguageQuery(text);
    setLastResult(result);
    onApplyCoords(result.coords);
    setInputText(text);
    setIsExpanded(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCalibrate();
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setInputText(suggestion);
    handleCalibrate(suggestion);
  };

  const handleReset = () => {
    setLastResult(null);
    setInputText('');
    setIsExpanded(false);
  };

  return (
    <div className="w-full bg-slate-900/80 backdrop-blur-md border border-amber-500/30 rounded-2xl p-4 shadow-xl shadow-black/40 space-y-3 relative overflow-hidden group">
      {/* Фоновый мягкий неоновый свет */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Верхний заголовок строки */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-bold shadow-md shadow-amber-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              Умный AI-Консьерж Системы Аньянова
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Natural Language 8D
              </span>
            </h3>
          </div>
        </div>

        {lastResult && (
          <button
            onClick={handleReset}
            className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Сбросить
          </button>
        )}
      </div>

      {/* Поле ввода текста */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Куда вы идете? Например: «Свадьба лучшего друга за городом» или «Переговоры с инвестором, +21°C»"
            className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-amber-500/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all shadow-inner"
          />
        </div>
        <button
          onClick={() => handleCalibrate()}
          disabled={!inputText.trim()}
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold text-xs px-5 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
        >
          <span>Окалибровать</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Быстрые подсказки в 1 клик */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-[11px] text-slate-400 flex items-center gap-1 mr-1">
          <Tag className="w-3 h-3 text-amber-400/80" />
          Примеры:
        </span>
        {CONCIERGE_SUGGESTIONS.map((sugg, idx) => (
          <button
            key={idx}
            onClick={() => handleSelectSuggestion(sugg)}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-700/70 border border-slate-700/60 hover:border-amber-500/40 text-slate-300 hover:text-amber-200 transition-all cursor-pointer whitespace-nowrap"
          >
            {sugg}
          </button>
        ))}
      </div>

      {/* Результат распознавания (если выполнена калибровка) */}
      {lastResult && isExpanded && (
        <div className="mt-3 p-3.5 rounded-xl bg-slate-950/70 border border-emerald-500/30 space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold text-emerald-300">
                {lastResult.summary}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>X: {lastResult.coords.socialX > 0 ? `+${lastResult.coords.socialX}` : lastResult.coords.socialX}</span>
              <span>•</span>
              <span>Y: {lastResult.coords.thermoY > 0 ? `+${lastResult.coords.thermoY}` : lastResult.coords.thermoY}</span>
              <span>•</span>
              <span>FI: {lastResult.coords.formalIndex}</span>
              <span>•</span>
              <span>{lastResult.coords.temperatureC > 0 ? `+${lastResult.coords.temperatureC}` : lastResult.coords.temperatureC}°C</span>
            </div>
          </div>

          {/* Распознанные смысловые факторы */}
          {lastResult.detectedFactors.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5 pt-1">
              {lastResult.detectedFactors.map((factor, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-col gap-0.5"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-amber-400 font-medium uppercase tracking-wider">
                      {factor.category}
                    </span>
                    <span className="text-slate-300 font-semibold truncate max-w-[120px]">
                      {factor.label}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 line-clamp-1">
                    {factor.impact}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
