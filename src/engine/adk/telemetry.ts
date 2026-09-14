/**
 * Google ADK & AEBOP™ Standard: Observability & Telemetry
 * Реализует стандарты OpenInference и OpenTelemetry для аудита и мониторинга вызовов агента.
 */

export interface ADKTelemetrySpan {
  id: string;
  traceId: string;
  name: string;
  startTime: number;
  endTime?: number;
  durationMs?: number;
  status: 'ok' | 'error' | 'approval_required';
  attributes: {
    'session.id': string;
    'gen_ai.system'?: string;
    'gen_ai.model'?: string;
    'tool.name'?: string;
    'tool.parameters'?: any;
    'tool.output'?: any;
    'tool.error'?: string;
    'agent.turn'?: number;
    'guardrail.status'?: string;
    'approval.reason'?: string;
    [key: string]: any;
  };
}

class TelemetryCollector {
  private spans: ADKTelemetrySpan[] = [];
  private listeners: ((span: ADKTelemetrySpan) => void)[] = [];
  private readonly MAX_SPANS = 100;

  constructor() {
    // Попытка восстановить из sessionStorage
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        const stored = sessionStorage.getItem('anyanov_adk_telemetry');
        if (stored) {
          this.spans = JSON.parse(stored).slice(-this.MAX_SPANS);
        }
      }
    } catch {
      // Игнорируем в headless среде
    }
  }

  public startSpan(name: string, sessionId: string, initialAttributes: Record<string, any> = {}): ADKTelemetrySpan {
    const span: ADKTelemetrySpan = {
      id: 'span_' + Math.random().toString(36).substring(2, 9),
      traceId: 'trace_' + Math.random().toString(36).substring(2, 11),
      name,
      startTime: Date.now(),
      status: 'ok',
      attributes: {
        'session.id': sessionId,
        'gen_ai.system': 'google-adk',
        ...initialAttributes,
      },
    };
    return span;
  }

  public endSpan(span: ADKTelemetrySpan, status: 'ok' | 'error' | 'approval_required' = 'ok', extraAttributes: Record<string, any> = {}): ADKTelemetrySpan {
    span.endTime = Date.now();
    span.durationMs = span.endTime - span.startTime;
    span.status = status;
    span.attributes = { ...span.attributes, ...extraAttributes };

    this.spans.push(span);
    if (this.spans.length > this.MAX_SPANS) {
      this.spans.shift();
    }

    this.persist();
    this.notify(span);
    return span;
  }

  public getRecentSpans(limit: number = 20): ADKTelemetrySpan[] {
    return [...this.spans].slice(-limit).reverse();
  }

  public clear(): void {
    this.spans = [];
    this.persist();
  }

  public subscribe(cb: (span: ADKTelemetrySpan) => void): () => void {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  private notify(span: ADKTelemetrySpan): void {
    this.listeners.forEach((l) => {
      try {
        l(span);
      } catch {
        // Защита от ошибок в слушателях
      }
    });
  }

  private persist(): void {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        sessionStorage.setItem('anyanov_adk_telemetry', JSON.stringify(this.spans));
      }
    } catch {
      // no-op
    }
  }
}

export const adkTelemetry = new TelemetryCollector();
