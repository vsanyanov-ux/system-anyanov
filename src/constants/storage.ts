import { AnyanovCoordinates } from '../types';

export const STORAGE_KEYS = {
  SHELF: 'anyanov_user_fragrance_shelf_v1',
  MODE: 'anyanov_fragrance_catalog_mode_v1',
  TAB: 'anyanov_active_tab_v1',
  MODE_21: 'anyanov_mode_21_v1',
  CUSTOM_PERFUMES: 'anyanov_custom_perfumes_v1',
  CUSTOM_PERIODIC_NOTES: 'anyanov_custom_periodic_notes_v1',
} as const;

export const DEFAULT_COORDINATES: AnyanovCoordinates = {
  socialX: -0.35,
  thermoY: 0.45,
  formalIndex: 2,
  temperatureC: 22,
};
