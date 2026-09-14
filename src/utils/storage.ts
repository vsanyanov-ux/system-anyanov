/**
 * Утилиты для безопасной работы с LocalStorage
 * Обрабатывают исключения квоты, режим инкогнито и ошибки парсинга JSON.
 */

export function safeGetItem(key: string, defaultValue: string): string {
  try {
    const val = localStorage.getItem(key);
    return val !== null ? val : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function safeSetItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.warn(`[LocalStorage] Не удалось сохранить значение для ключа "${key}":`, e);
  }
}

export function safeGetJson<T>(
  key: string,
  defaultValue: T,
  validator?: (data: unknown) => data is T
): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    const parsed = JSON.parse(raw);
    if (validator) {
      return validator(parsed) ? parsed : defaultValue;
    }
    return parsed as T;
  } catch {
    return defaultValue;
  }
}

export function safeSetJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`[LocalStorage] Не удалось сохранить JSON для ключа "${key}":`, e);
  }
}
