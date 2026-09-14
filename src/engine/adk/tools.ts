/**
 * Google ADK & AEBOP™ Standard: Tool Contracts & Declarations
 * Обеспечивает строго типизированные схемы вызовов инструментов (Function Declarations),
 * диспетчеризацию вызовов и интеграцию с математическими движками Системы Аньянова.
 */

import { AnyanovCoordinates, FormalIndex, OutfitStack, PerfumeItem, SolfeggioAnalysis } from '../../types';
import { compileAnyanovOutfit } from '../outfitCompiler';
import { matchAnyanovPerfume, FragranceMatchResult } from '../fragranceMatcher';
import { analyzeStyleSolfeggio } from '../styleSolfeggio';

export interface ADKToolParameterSchema {
  type: 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object';
  description: string;
  enum?: (string | number)[];
  minimum?: number;
  maximum?: number;
  properties?: Record<string, ADKToolParameterSchema>;
  required?: string[];
  items?: ADKToolParameterSchema;
}

export interface ADKFunctionDeclaration {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, ADKToolParameterSchema>;
    required: string[];
  };
}

// 1. Спецификации инструментов в стандарте Google ADK / Gemini Function Calling
export const ADK_TOOL_DECLARATIONS: ADKFunctionDeclaration[] = [
  {
    name: 'calibrate_anyanov_coordinates',
    description: 'Калибрует 8D эстетические и физические координаты Системы Аньянова под повод, социальный статус и температуру.',
    parameters: {
      type: 'object',
      properties: {
        social_x: {
          type: 'number',
          minimum: -1.0,
          maximum: 1.0,
          description: 'Социальная ось: от -1.0 (Статус / Субординация / Власть) до +1.0 (Соблазн / Интим / Casual / Сближение)',
        },
        thermo_y: {
          type: 'number',
          minimum: -1.0,
          maximum: 1.0,
          description: 'Термодинамическая ось: от -1.0 (Долгое действие / Тепло / Вечер / Зима) до +1.0 (Быстрое действие / Холод / День / Лето)',
        },
        formal_index: {
          type: 'integer',
          enum: [1, 2, 3],
          description: 'Индекс формальности дресс-кода: 1 = Casual, 2 = Smart Casual, 3 = Business Formal',
        },
        temperature_c: {
          type: 'number',
          minimum: -15,
          maximum: 35,
          description: 'Реальная или ожидаемая температура окружающей среды в градусах Цельсия (°C)',
        },
        occasion: {
          type: 'string',
          description: 'Словесное описание повода или социальной ситуации (например: "Переговоры с инвестором", "Свадьба друга")',
        },
        reasoning: {
          type: 'string',
          description: 'Краткое обоснование выбора квадранта и коэффициентов координат',
        },
      },
      required: ['social_x', 'thermo_y', 'formal_index', 'temperature_c'],
    },
  },
  {
    name: 'compile_harmonic_outfit',
    description: 'Компилирует ансамбль слоев одежды (L1 Обувь, L2 Брюки, L3 Торс, L4 Верхний слой) под калиброванные координаты.',
    parameters: {
      type: 'object',
      properties: {
        social_x: { type: 'number', minimum: -1.0, maximum: 1.0, description: 'Координата SocialX' },
        thermo_y: { type: 'number', minimum: -1.0, maximum: 1.0, description: 'Координата ThermoY' },
        formal_index: { type: 'integer', enum: [1, 2, 3], description: 'Индекс формальности' },
        temperature_c: { type: 'number', minimum: -15, maximum: 35, description: 'Температура °C' },
        is_golden_21: { type: 'boolean', description: 'Использовать только эталонный гардероб Золотого Канона 21' },
      },
      required: ['social_x', 'thermo_y', 'formal_index', 'temperature_c'],
    },
  },
  {
    name: 'evaluate_fragrance_harmony',
    description: 'Подбирает идеальный парфюм и рассчитывает 8D-сольфеджио гармонии (дистанция, контрапункт, диссонанс) между аутфитом и ароматом.',
    parameters: {
      type: 'object',
      properties: {
        social_x: { type: 'number', description: 'SocialX аутфита' },
        thermo_y: { type: 'number', description: 'ThermoY аутфита' },
        formal_index: { type: 'integer', enum: [1, 2, 3], description: 'Индекс формальности' },
        temperature_c: { type: 'number', description: 'Температура °C' },
        user_shelf_ids: {
          type: 'array',
          items: { type: 'string', description: 'ID аромата' },
          description: 'Список ID ароматов из персональной парфюмерной полки пользователя',
        },
        force_catalog: { type: 'boolean', description: 'Принудительно искать по полному каталогу, а не только по полке' },
      },
      required: ['social_x', 'thermo_y', 'formal_index', 'temperature_c'],
    },
  },
  {
    name: 'diagnose_style_clashes',
    description: 'Выявляет скрытые стилистические диссонансы и разрывы по 8 каноническим осям Системы Аньянова.',
    parameters: {
      type: 'object',
      properties: {
        outfit_stack: { type: 'object', description: 'Слои одежды L1..L4' },
        perfume_id: { type: 'string', description: 'ID сопоставляемого аромата' },
      },
      required: ['outfit_stack'],
    },
  },
];

// 2. Исполнители инструментов (Tool Handlers)
export interface CalibrateCoordinatesInput {
  social_x: number;
  thermo_y: number;
  formal_index: FormalIndex;
  temperature_c: number;
  occasion?: string;
  reasoning?: string;
}

export interface CompileOutfitInput {
  social_x: number;
  thermo_y: number;
  formal_index: FormalIndex;
  temperature_c: number;
  is_golden_21?: boolean;
}

export interface EvaluateFragranceHarmonyInput {
  social_x: number;
  thermo_y: number;
  formal_index: FormalIndex;
  temperature_c: number;
  user_shelf_ids?: string[];
  force_catalog?: boolean;
  stack?: OutfitStack;
}

export interface ToolExecutionResult<T = unknown> {
  success: boolean;
  toolName: string;
  data: T;
  timestamp: string;
  error?: string;
}

export const TOOLS_REGISTRY = {
  calibrate_anyanov_coordinates: async (
    input: CalibrateCoordinatesInput
  ): Promise<AnyanovCoordinates & { occasion?: string; reasoning?: string }> => {
    return {
      socialX: Math.max(-1.0, Math.min(1.0, input.social_x)),
      thermoY: Math.max(-1.0, Math.min(1.0, input.thermo_y)),
      formalIndex: input.formal_index,
      temperatureC: Math.max(-15, Math.min(35, input.temperature_c)),
      occasion: input.occasion,
      reasoning: input.reasoning,
    };
  },

  compile_harmonic_outfit: async (
    input: CompileOutfitInput
  ): Promise<{ stack: OutfitStack; rulesApplied: string[] }> => {
    const coords: AnyanovCoordinates = {
      socialX: input.social_x,
      thermoY: input.thermo_y,
      formalIndex: input.formal_index,
      temperatureC: input.temperature_c,
    };
    return compileAnyanovOutfit(coords, input.is_golden_21 ?? false);
  },

  evaluate_fragrance_harmony: async (
    input: EvaluateFragranceHarmonyInput
  ): Promise<{ match: FragranceMatchResult; solfeggio: SolfeggioAnalysis }> => {
    const coords: AnyanovCoordinates = {
      socialX: input.social_x,
      thermoY: input.thermo_y,
      formalIndex: input.formal_index,
      temperatureC: input.temperature_c,
    };

    const outfitRes = compileAnyanovOutfit(coords, false);
    const stack = input.stack || outfitRes.stack;
    const match = matchAnyanovPerfume(coords, input.user_shelf_ids, input.force_catalog ?? false, false, stack);
    const solfeggio = analyzeStyleSolfeggio(stack, match.perfume);

    return { match, solfeggio };
  },

  diagnose_style_clashes: async (
    input: { outfit_stack: OutfitStack; perfume_item?: PerfumeItem }
  ): Promise<SolfeggioAnalysis | null> => {
    if (!input.perfume_item) return null;
    return analyzeStyleSolfeggio(input.outfit_stack, input.perfume_item);
  },
};

/**
 * Единый диспетчер выполнения инструментов по стандарту Google ADK
 */
export async function executeToolCall<T = unknown>(
  toolName: keyof typeof TOOLS_REGISTRY,
  args: any
): Promise<ToolExecutionResult<T>> {
  const handler = TOOLS_REGISTRY[toolName];
  if (!handler) {
    return {
      success: false,
      toolName,
      data: null as unknown as T,
      timestamp: new Date().toISOString(),
      error: `Инструмент '${toolName}' не зарегистрирован в TOOLS_REGISTRY стандарта ADK`,
    };
  }

  try {
    const data = (await handler(args)) as T;
    return {
      success: true,
      toolName,
      data,
      timestamp: new Date().toISOString(),
    };
  } catch (err: any) {
    return {
      success: false,
      toolName,
      data: null as unknown as T,
      timestamp: new Date().toISOString(),
      error: err?.message || String(err),
    };
  }
}
