import { createClient, SupabaseClient } from '@supabase/supabase-js';

const STORAGE_KEY_SUPABASE_URL = 'anyanov_supabase_url_v1';
const STORAGE_KEY_SUPABASE_ANON_KEY = 'anyanov_supabase_anon_key_v1';
const STORAGE_KEY_CLIENT_ID = 'anyanov_client_uuid_v1';

export function getSupabaseCredentials(): { url: string; anonKey: string } {
  let url = '';
  let anonKey = '';

  try {
    const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
    const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;
    if (envUrl && typeof envUrl === 'string') url = envUrl.trim();
    if (envKey && typeof envKey === 'string') anonKey = envKey.trim();
  } catch {
    // env not available
  }

  // Fallback к пользовательским настройкам из localStorage
  if (!url || !anonKey) {
    try {
      const savedUrl = localStorage.getItem(STORAGE_KEY_SUPABASE_URL);
      const savedKey = localStorage.getItem(STORAGE_KEY_SUPABASE_ANON_KEY);
      if (savedUrl && !url) url = savedUrl.trim();
      if (savedKey && !anonKey) anonKey = savedKey.trim();
    } catch {
      // LocalStorage access restricted
    }
  }

  // Авто-нормализация URL (удаление /rest/v1 и концевых слэшей, если скопировано из консоли API)
  if (url) {
    url = url.replace(/\/rest\/v1\/?$/i, '').replace(/\/+$/, '');
  }

  return { url, anonKey };
}

export function saveSupabaseCredentials(url: string, anonKey: string): void {
  try {
    if (url.trim()) {
      localStorage.setItem(STORAGE_KEY_SUPABASE_URL, url.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY_SUPABASE_URL);
    }

    if (anonKey.trim()) {
      localStorage.setItem(STORAGE_KEY_SUPABASE_ANON_KEY, anonKey.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY_SUPABASE_ANON_KEY);
    }
  } catch (e) {
    console.warn('Не удалось сохранить ключи Supabase в LocalStorage:', e);
  }
}

/**
 * Получить стабильный уникальный идентификатор клиента для синхронизации полки
 */
export function getOrCreateClientId(): string {
  try {
    let clientId = localStorage.getItem(STORAGE_KEY_CLIENT_ID);
    if (!clientId) {
      clientId = 'client_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
      localStorage.setItem(STORAGE_KEY_CLIENT_ID, clientId);
    }
    return clientId;
  } catch {
    return 'client_anonymous_' + Date.now();
  }
}

let supabaseInstance: SupabaseClient | null = null;
let lastInitUrl = '';
let lastInitKey = '';

export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey } = getSupabaseCredentials();

  if (!url || !anonKey) {
    return null;
  }

  if (supabaseInstance && lastInitUrl === url && lastInitKey === anonKey) {
    return supabaseInstance;
  }

  try {
    supabaseInstance = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    lastInitUrl = url;
    lastInitKey = anonKey;
    return supabaseInstance;
  } catch (err) {
    console.error('Ошибка инициализации клиента Supabase:', err);
    return null;
  }
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getSupabaseCredentials();
  return Boolean(url && anonKey && url.startsWith('http'));
}
