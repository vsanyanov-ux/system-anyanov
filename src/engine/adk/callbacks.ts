/**
 * Google ADK & AEBOP™ Standard: Callbacks & Guardrails
 * Обеспечивает pre-flight инспекцию, санацию аргументов, Approval Gates
 * и post-execution валидацию результатов работы инструментов.
 */

import { ToolExecutionResult } from './tools';

export interface BeforeToolContext {
  sessionId: string;
  toolName: string;
  args: Record<string, any>;
  confirmed?: boolean;
}

export interface BeforeToolResult {
  proceed: boolean;
  sanitizedArgs: Record<string, any>;
  requiresApproval?: boolean;
  approvalReason?: string;
  violations?: string[];
}

export interface AfterToolContext {
  sessionId: string;
  toolName: string;
  args: Record<string, any>;
  rawResult: ToolExecutionResult;
  durationMs: number;
}

export interface AfterToolResult {
  validatedResult: ToolExecutionResult;
  telemetrySpan: {
    name: string;
    attributes: Record<string, any>;
    status: 'ok' | 'error';
    durationMs: number;
  };
}

/**
 * Pre-flight Guardrail Hook:
 * 1. Проверяет и санитизирует границы диапазонов 8D координат.
 * 2. Проверяет температурную адекватность.
 * 3. Активирует Approval Gate для экстремальных или конфликтных ситуаций.
 */
export function beforeToolCallback(context: BeforeToolContext): BeforeToolResult {
  const { toolName, args, confirmed } = context;
  const sanitized = { ...args };
  const violations: string[] = [];
  let requiresApproval = false;
  let approvalReason = '';

  if (toolName === 'calibrate_anyanov_coordinates' || toolName === 'compile_harmonic_outfit' || toolName === 'evaluate_fragrance_harmony') {
    // 1. Санация SocialX & ThermoY
    if (typeof sanitized.social_x === 'number') {
      const orig = sanitized.social_x;
      sanitized.social_x = Math.max(-1.0, Math.min(1.0, Number(orig.toFixed(2))));
      if (sanitized.social_x !== orig) {
        violations.push(`SocialX скорректирован с ${orig} до допустимого диапазона [${sanitized.social_x}]`);
      }
    }

    if (typeof sanitized.thermo_y === 'number') {
      const orig = sanitized.thermo_y;
      sanitized.thermo_y = Math.max(-1.0, Math.min(1.0, Number(orig.toFixed(2))));
      if (sanitized.thermo_y !== orig) {
        violations.push(`ThermoY скорректирован с ${orig} до допустимого диапазона [${sanitized.thermo_y}]`);
      }
    }

    // 2. Валидация FormalIndex
    if (sanitized.formal_index !== undefined) {
      const fi = Math.round(Number(sanitized.formal_index));
      sanitized.formal_index = Math.max(1, Math.min(3, fi));
    }

    // 3. Физический контроль температуры
    if (typeof sanitized.temperature_c === 'number') {
      const origTemp = sanitized.temperature_c;
      sanitized.temperature_c = Math.max(-20, Math.min(42, Math.round(origTemp)));

      if (sanitized.temperature_c <= -5 || sanitized.temperature_c >= 35) {
        requiresApproval = true;
        approvalReason = `Экстремальная температура окружающей среды (${sanitized.temperature_c}°C). Требуется подтверждение применения специализированных термо-слоев.`;
      }
    }

    // 4. Детекция экстремальной дистанции / крайнего квадранта
    if (Math.abs(sanitized.social_x || 0) > 0.90 && Math.abs(sanitized.thermo_y || 0) > 0.90) {
      requiresApproval = true;
      approvalReason = `Выбрана критическая периферия матрицы стиля (SocialX: ${sanitized.social_x}, ThermoY: ${sanitized.thermo_y}). Требуется подтверждение радикального образа.`;
    }
  }

  // Если требуется подтверждение, но пользователь уже подтвердил действие
  if (requiresApproval && confirmed) {
    requiresApproval = false;
  }

  return {
    proceed: !requiresApproval,
    sanitizedArgs: sanitized,
    requiresApproval,
    approvalReason,
    violations,
  };
}

/**
 * Post-execution Hook:
 * Проверяет результат работы инструмента и формирует стандартный спан OpenInference / OpenTelemetry.
 */
export function afterToolCallback(context: AfterToolContext): AfterToolResult {
  const { sessionId, toolName, args, rawResult, durationMs } = context;

  const telemetrySpan = {
    name: `tool.${toolName}`,
    attributes: {
      'session.id': sessionId,
      'tool.name': toolName,
      'tool.parameters': args,
      'tool.success': rawResult.success,
      'tool.duration_ms': durationMs,
      'gen_ai.system': 'google-adk',
      'framework': 'sistema-anyanova-8d',
    },
    status: (rawResult.success ? 'ok' : 'error') as 'ok' | 'error',
    durationMs,
  };

  return {
    validatedResult: rawResult,
    telemetrySpan,
  };
}
