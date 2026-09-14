/**
 * Google ADK & AEBOP™ Standard: Agent Runtime & Cognition Loop
 * Обеспечивает управляемый цикл ReAct (Reason + Act), изоляцию State и Session,
 * интеграцию Guardrails, Approval Gate и OpenInference трассировку.
 */

import { AnyanovCoordinates, FormalIndex, OutfitStack, PerfumeItem, SolfeggioAnalysis } from '../../types';
import { executeToolCall, ToolExecutionResult } from './tools';
import { beforeToolCallback, afterToolCallback } from './callbacks';
import { adkTelemetry, ADKTelemetrySpan } from './telemetry';
import { parseNaturalLanguageQuery } from '../semanticParser';

export interface AgentTurn {
  turnIndex: number;
  timestamp: string;
  role: 'user' | 'assistant' | 'tool';
  content: string;
  toolCall?: {
    name: string;
    args: Record<string, any>;
  };
  toolResult?: ToolExecutionResult;
}

export interface AgentSession {
  sessionId: string;
  createdAt: string;
  turns: AgentTurn[];
  reasoningTrace: string[];
}

export interface AgentState {
  currentCoords: AnyanovCoordinates;
  currentStack: OutfitStack | null;
  matchedFragrance: PerfumeItem | null;
  solfeggio: SolfeggioAnalysis | null;
  is21Mode: boolean;
  userShelfIds: string[];
}

export interface AgentRunOptions {
  confirmed?: boolean;
  maxTurns?: number;
}

export interface AgentRunResult {
  sessionId: string;
  success: boolean;
  state: AgentState;
  reasoningSteps: string[];
  pendingApproval?: {
    required: boolean;
    reason: string;
    pendingTool: string;
    pendingArgs: Record<string, any>;
  };
  telemetrySpan?: ADKTelemetrySpan;
  finalMessage: string;
}

export class ADKAgentRunner {
  private session: AgentSession;
  private state: AgentState;

  constructor(initialState?: Partial<AgentState>, sessionId?: string) {
    this.session = {
      sessionId: sessionId || 'sess_' + Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      turns: [],
      reasoningTrace: [],
    };

    this.state = {
      currentCoords: initialState?.currentCoords || {
        socialX: 0.0,
        thermoY: 0.2,
        formalIndex: 2,
        temperatureC: 22,
      },
      currentStack: initialState?.currentStack || null,
      matchedFragrance: initialState?.matchedFragrance || null,
      solfeggio: initialState?.solfeggio || null,
      is21Mode: initialState?.is21Mode ?? false,
      userShelfIds: initialState?.userShelfIds || [],
    };
  }

  public getSession(): AgentSession {
    return this.session;
  }

  public getState(): AgentState {
    return this.state;
  }

  /**
   * Запуск когнитивного цикла агента (ADK Cognition Loop)
   */
  public async run(
    userPrompt: string,
    options: AgentRunOptions = {}
  ): Promise<AgentRunResult> {
    const maxTurns = options.maxTurns || 5;
    const reasoning: string[] = [];
    const span = adkTelemetry.startSpan('agent.run', this.session.sessionId, {
      'user.prompt': userPrompt,
      'state.initial_coords': this.state.currentCoords,
    });

    // 1. Фиксация входа пользователя в Session
    this.session.turns.push({
      turnIndex: this.session.turns.length + 1,
      timestamp: new Date().toISOString(),
      role: 'user',
      content: userPrompt,
    });

    reasoning.push(`[Cognition] Получен запрос пользователя: «${userPrompt}»`);

    // 2. Когнитивная декомпозиция (Cognitive Decomposition)
    // Извлечение семантики через калибровку факторов
    const parsedSemantic = parseNaturalLanguageQuery(userPrompt);
    reasoning.push(`[Cognition] Определены факторы ситуации: ${parsedSemantic.summary}`);
    if (parsedSemantic.detectedFactors.length > 0) {
      parsedSemantic.detectedFactors.forEach((f) => {
        reasoning.push(` - ${f.category} (${f.label}): ${f.impact}`);
      });
    }

    // Подготовка аргументов для Tool Contract
    const toolArgs = {
      social_x: parsedSemantic.coords.socialX,
      thermo_y: parsedSemantic.coords.thermoY,
      formal_index: parsedSemantic.coords.formalIndex,
      temperature_c: parsedSemantic.coords.temperatureC,
      occasion: parsedSemantic.summary,
      reasoning: parsedSemantic.summary,
    };

    // 3. Pre-flight Guardrail Hook (before_tool_callback)
    reasoning.push(`[Guardrail] Вызов before_tool_callback для calibrate_anyanov_coordinates...`);
    const guardrailCheck = beforeToolCallback({
      sessionId: this.session.sessionId,
      toolName: 'calibrate_anyanov_coordinates',
      args: toolArgs,
      confirmed: options.confirmed,
    });

    if (guardrailCheck.violations && guardrailCheck.violations.length > 0) {
      guardrailCheck.violations.forEach((v) => reasoning.push(`[Sanitizer] ${v}`));
    }

    // Проверка Approval Gate
    if (guardrailCheck.requiresApproval) {
      reasoning.push(`[Approval Gate] ⚠️ Остановлен: ${guardrailCheck.approvalReason}`);
      adkTelemetry.endSpan(span, 'approval_required', {
        'approval.reason': guardrailCheck.approvalReason,
        'guardrail.status': 'blocked_by_approval_gate',
      });

      return {
        sessionId: this.session.sessionId,
        success: false,
        state: this.state,
        reasoningSteps: reasoning,
        pendingApproval: {
          required: true,
          reason: guardrailCheck.approvalReason || 'Требуется подтверждение параметров',
          pendingTool: 'calibrate_anyanov_coordinates',
          pendingArgs: guardrailCheck.sanitizedArgs,
        },
        telemetrySpan: span,
        finalMessage: `Требуется подтверждение: ${guardrailCheck.approvalReason}`,
      };
    }

    // 4. Вызов инструмента калибровки (executeToolCall)
    const startTime = Date.now();
    reasoning.push(`[Tool Execution] Вызов calibrate_anyanov_coordinates с санитизированными аргументами`);
    const coordResult = await executeToolCall<AnyanovCoordinates>(
      'calibrate_anyanov_coordinates',
      guardrailCheck.sanitizedArgs
    );
    const durationMs = Date.now() - startTime;

    // 5. Post-flight Hook (after_tool_callback)
    afterToolCallback({
      sessionId: this.session.sessionId,
      toolName: 'calibrate_anyanov_coordinates',
      args: guardrailCheck.sanitizedArgs,
      rawResult: coordResult,
      durationMs,
    });

    if (!coordResult.success) {
      reasoning.push(`[Error] Ошибка калибровки: ${coordResult.error}`);
      adkTelemetry.endSpan(span, 'error', { 'tool.error': coordResult.error });
      return {
        sessionId: this.session.sessionId,
        success: false,
        state: this.state,
        reasoningSteps: reasoning,
        finalMessage: `Ошибка выполнения: ${coordResult.error}`,
      };
    }

    // Обновление координат в State
    this.state.currentCoords = {
      socialX: coordResult.data.socialX,
      thermoY: coordResult.data.thermoY,
      formalIndex: coordResult.data.formalIndex,
      temperatureC: coordResult.data.temperatureC,
    };
    reasoning.push(
      `[State Update] Координаты обновлены: SocialX=${this.state.currentCoords.socialX.toFixed(2)}, ` +
      `ThermoY=${this.state.currentCoords.thermoY.toFixed(2)}, FormalIndex=${this.state.currentCoords.formalIndex}, ` +
      `T=${this.state.currentCoords.temperatureC}°C`
    );

    // 6. Второй шаг ReAct: автоматическая гармонизация парфюма и аутфита
    reasoning.push(`[ReAct Step 2] Автоматический расчет гармонии аромата (evaluate_fragrance_harmony)...`);
    const harmonyResult = await executeToolCall<{
      match: any;
      solfeggio: SolfeggioAnalysis;
    }>('evaluate_fragrance_harmony', {
      social_x: this.state.currentCoords.socialX,
      thermo_y: this.state.currentCoords.thermoY,
      formal_index: this.state.currentCoords.formalIndex,
      temperature_c: this.state.currentCoords.temperatureC,
      user_shelf_ids: this.state.userShelfIds,
      force_catalog: false,
    });

    if (harmonyResult.success && harmonyResult.data) {
      this.state.matchedFragrance = harmonyResult.data.match.perfume;
      this.state.solfeggio = harmonyResult.data.solfeggio;
      reasoning.push(
        `[Harmony] Подобран аромат: «${this.state.matchedFragrance?.name}» (${this.state.matchedFragrance?.brand}). Состояние: ${this.state.solfeggio?.harmonyState}`
      );
    }

    // Завершение спана телеметрии
    adkTelemetry.endSpan(span, 'ok', {
      'state.final_coords': this.state.currentCoords,
      'state.matched_fragrance': this.state.matchedFragrance?.name,
      'state.solfeggio_state': this.state.solfeggio?.harmonyState,
      'reasoning.steps_count': reasoning.length,
    });

    this.session.reasoningTrace.push(...reasoning);

    return {
      sessionId: this.session.sessionId,
      success: true,
      state: this.state,
      reasoningSteps: reasoning,
      telemetrySpan: span,
      finalMessage: parsedSemantic.summary,
    };
  }
}
