import React, { useState, useRef } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, RotateCcw, Compass, Tag, ShieldAlert, Cpu, Activity, ChevronDown, ChevronUp } from 'lucide-react';
import { AnyanovCoordinates } from '../types';
import { CONCIERGE_SUGGESTIONS } from '../engine/semanticParser';
import { ADKAgentRunner, AgentRunResult } from '../engine/adk/runtime';

interface SmartConciergeBarProps {
  onApplyCoords: (coords: AnyanovCoordinates) => void;
  currentCoords: AnyanovCoordinates;
}

export const SmartConciergeBar: React.FC<SmartConciergeBarProps> = ({
  onApplyCoords,
  currentCoords,
}) => {
  const [inputText, setInputText] = useState('');
  const [agentResult, setAgentResult] = useState<AgentRunResult | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReasoning, setShowReasoning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Сохраняем инстанс раннера в ref для сохранения Session истории диалога
  const runnerRef = useRef<ADKAgentRunner>(new ADKAgentRunner({ currentCoords }));

  const handleCalibrate = async (textToParse?: string, confirmed: boolean = false) => {
    const text = (textToParse ?? inputText).trim();
    if (!text) return;

    setIsLoading(true);
    try {
      const result = await runnerRef.current.run(text, { confirmed });
      setAgentResult(result);
      setInputText(text);
      setIsExpanded(true);

      if (result.success) {
        onApplyCoords(result.state.currentCoords);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmApproval = () => {
    if (inputText) {
      handleCalibrate(inputText, true);
    }
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
    setAgentResult(null);
    setInputText('');
    setIsExpanded(false);
    setShowReasoning(false);
    runnerRef.current = new ADKAgentRunner({ currentCoords });
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
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Cpu className="w-3 h-3" />
                Google ADK 2.5
              </span>
            </h3>
          </div>
        </div>

        {agentResult && (
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
          disabled={!inputText.trim() || isLoading}
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold text-xs px-5 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
        >
          {isLoading ? (
            <span className="animate-pulse">Обработка...</span>
          ) : (
            <>
              <span>Окалибровать</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
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

      {/* ⚠️ ADK Approval Gate Banner (если сработал Guardrail) */}
      {agentResult?.pendingApproval?.required && (
        <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/50 space-y-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <span>Google ADK Guardrail: Требуется подтверждение (Approval Gate)</span>
              </div>
              <p className="text-xs text-amber-200/90 leading-relaxed">
                {agentResult.pendingApproval.reason}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleConfirmApproval}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs rounded-lg transition-colors cursor-pointer shadow-md shadow-amber-500/20"
            >
              Подтвердить и применить образ
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition-colors cursor-pointer"
            >
              Отмена
            </button>
          </div>
        </div>
      )}

      {/* Результат распознавания (успешная калибровка) */}
      {agentResult?.success && isExpanded && (
        <div className="mt-3 p-3.5 rounded-xl bg-slate-950/70 border border-emerald-500/30 space-y-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-xs font-semibold text-emerald-300">
                {agentResult.finalMessage}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>X: {agentResult.state.currentCoords.socialX > 0 ? `+${agentResult.state.currentCoords.socialX.toFixed(2)}` : agentResult.state.currentCoords.socialX.toFixed(2)}</span>
              <span>•</span>
              <span>Y: {agentResult.state.currentCoords.thermoY > 0 ? `+${agentResult.state.currentCoords.thermoY.toFixed(2)}` : agentResult.state.currentCoords.thermoY.toFixed(2)}</span>
              <span>•</span>
              <span>FI: {agentResult.state.currentCoords.formalIndex} ({agentResult.state.currentCoords.formalIndex === 1 ? 'Casual' : agentResult.state.currentCoords.formalIndex === 2 ? 'Smart Casual' : 'Formal'})</span>
              <span>•</span>
              <span>{agentResult.state.currentCoords.temperatureC > 0 ? `+${agentResult.state.currentCoords.temperatureC}` : agentResult.state.currentCoords.temperatureC}°C</span>
            </div>
          </div>

          {/* Парфюмерная гармония (ReAct Step 2) */}
          {agentResult.state.matchedFragrance && (
            <div className="p-2.5 rounded-lg bg-slate-900/90 border border-amber-500/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Сольфеджио 10D
                </span>
                <span className="text-slate-300">
                  Резонансный парфюм: <strong className="text-white">{agentResult.state.matchedFragrance.name}</strong> ({agentResult.state.matchedFragrance.brand})
                </span>
              </div>
              {agentResult.state.solfeggio && (
                <span className="text-[11px] font-medium text-amber-400">
                  {agentResult.state.solfeggio.stateLabel}
                </span>
              )}
            </div>
          )}

          {/* Инспекция ADK Reasoning & OpenInference Telemetry */}
          <div className="pt-1 border-t border-slate-800/80 flex items-center justify-between">
            <button
              onClick={() => setShowReasoning(!showReasoning)}
              className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Activity className="w-3 h-3 text-cyan-400" />
              <span>Цепочка рассуждений агента ({agentResult.reasoningSteps.length} шагов)</span>
              {showReasoning ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {agentResult.telemetrySpan && (
              <span className="text-[10px] font-mono text-slate-500">
                Trace: {agentResult.telemetrySpan.traceId} • {agentResult.telemetrySpan.durationMs || 12}ms
              </span>
            )}
          </div>

          {showReasoning && (
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1 max-h-48 overflow-y-auto">
              {agentResult.reasoningSteps.map((step, idx) => (
                <div key={idx} className="leading-relaxed">
                  <span className="text-cyan-400 mr-1.5">[{idx + 1}]</span>
                  <span className={step.includes('Guardrail') || step.includes('Approval') ? 'text-amber-300' : step.includes('Harmony') ? 'text-emerald-300' : 'text-slate-300'}>
                    {step}
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
