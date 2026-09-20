import { getSupabaseClient, getOrCreateClientId, isSupabaseConfigured } from '../lib/supabase';
import { PerfumeItem, AnyanovCoordinates } from '../types';

export interface SupabaseFragranceRow {
  id: string;
  brand: string;
  name: string;
  x_coord: number;
  y_coord: number;
  diffusion: 'Интимная' | 'Умеренная' | 'Шлейфовая' | 'Ударная';
  pyramid: {
    top: string[];
    heart: string[];
    base: string[];
  };
  dominant_vibe: string;
  best_occasion: string;
  why_fits_outfit: string;
  color_theme?: string;
  image_url?: string;
  is_verified?: boolean;
}

/**
 * Преобразовать строку из Supabase в формат PerfumeItem Системы Аньянова
 */
function rowToPerfumeItem(row: SupabaseFragranceRow): PerfumeItem {
  return {
    id: row.id,
    brand: row.brand,
    name: row.name,
    xCoord: Number(row.x_coord),
    yCoord: Number(row.y_coord),
    diffusion: row.diffusion,
    pyramid: row.pyramid || { top: [], heart: [], base: [] },
    dominantVibe: row.dominant_vibe,
    bestOccasion: row.best_occasion,
    whyFitsOutfit: row.why_fits_outfit,
    colorTheme: row.color_theme || 'from-amber-600 via-stone-800 to-black',
    imageUrl: row.image_url,
  };
}

/**
 * Преобразовать PerfumeItem в строку для таблицы fragrances
 */
function perfumeItemToRow(perfume: PerfumeItem): SupabaseFragranceRow {
  return {
    id: perfume.id,
    brand: perfume.brand,
    name: perfume.name,
    x_coord: perfume.xCoord,
    y_coord: perfume.yCoord,
    diffusion: perfume.diffusion,
    pyramid: perfume.pyramid,
    dominant_vibe: perfume.dominantVibe,
    best_occasion: perfume.bestOccasion,
    why_fits_outfit: perfume.whyFitsOutfit,
    color_theme: perfume.colorTheme,
    image_url: perfume.imageUrl,
    is_verified: false,
  };
}

/**
 * Загрузить глобальную базу ароматов из Supabase
 */
export async function fetchGlobalFragrances(): Promise<PerfumeItem[]> {
  const client = getSupabaseClient();
  if (!client) return [];

  try {
    const { data, error } = await client
      .from('fragrances')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase: ошибка при чтении каталога ароматов:', error.message);
      return [];
    }

    return (data as SupabaseFragranceRow[]).map(rowToPerfumeItem);
  } catch (err) {
    console.error('Supabase: исключение при запросе каталога:', err);
    return [];
  }
}

/**
 * Сохранить новый откалиброванный аромат в глобальную базу знаний
 */
export async function saveFragranceToCloud(perfume: PerfumeItem): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const row = perfumeItemToRow(perfume);
    const { error } = await client
      .from('fragrances')
      .upsert(row, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase: не удалось сохранить аромат в облако:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Supabase: исключение при сохранении аромата:', err);
    return false;
  }
}

/**
 * Синхронизировать полку пользователя с Supabase
 */
export async function syncUserShelfToCloud(shelfIds: string[]): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  const clientId = getOrCreateClientId();

  try {
    // 1. Очищаем старую полку этого клиента
    await client
      .from('user_shelves')
      .delete()
      .eq('user_id', clientId);

    if (shelfIds.length === 0) return true;

    // 2. Записываем текущие флаконы
    const rows = shelfIds.map((fragranceId) => ({
      user_id: clientId,
      fragrance_id: fragranceId,
    }));

    const { error } = await client.from('user_shelves').insert(rows);
    if (error) {
      console.warn('Supabase: не удалось синхронизировать полку:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Supabase: исключение при синхронизации полки:', err);
    return false;
  }
}

/**
 * Загрузить полку пользователя из Supabase
 */
export async function fetchUserShelfFromCloud(): Promise<string[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  const clientId = getOrCreateClientId();

  try {
    const { data, error } = await client
      .from('user_shelves')
      .select('fragrance_id')
      .eq('user_id', clientId);

    if (error) {
      console.warn('Supabase: ошибка получения полки:', error.message);
      return null;
    }

    return data ? data.map((d: any) => d.fragrance_id) : [];
  } catch (err) {
    console.error('Supabase: исключение при загрузке полки:', err);
    return null;
  }
}

/**
 * Логирование ситуации пользователя для аналитики
 */
export async function logUserSituation(
  query: string,
  coords: AnyanovCoordinates,
  recommendedId?: string
): Promise<void> {
  const client = getSupabaseClient();
  if (!client || !query.trim()) return;

  try {
    await client.from('situation_logs').insert({
      query: query.trim(),
      resolved_social_x: coords.socialX,
      resolved_thermo_y: coords.thermoY,
      temperature_c: coords.temperatureC,
      formal_index: coords.formalIndex,
      recommended_fragrance_id: recommendedId,
    });
  } catch (err) {
    // Тихо игнорируем ошибки логирования аналитики
  }
}

export { isSupabaseConfigured };
