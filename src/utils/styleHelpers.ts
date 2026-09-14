import { HarmonyState } from '../types';

/**
 * Цветовые схемы и стили бейджей для элементов UI Системы Аньянова
 */

export function getDiffusionBadgeStyle(diffusion: string): string {
  switch (diffusion) {
    case 'Интимная':
      return 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30';
    case 'Умеренная':
      return 'text-sky-400 bg-sky-950/40 border-sky-500/30';
    case 'Шлейфовая':
      return 'text-amber-400 bg-amber-950/40 border-amber-500/30';
    case 'Ударная':
      return 'text-rose-400 bg-rose-950/40 border-rose-500/30';
    default:
      return 'text-slate-400 bg-slate-900 border-slate-700';
  }
}

export function getScoreBadgeStyle(score: number): string {
  if (score >= 90) return 'text-emerald-400 bg-emerald-950/50 border-emerald-500/40';
  if (score >= 75) return 'text-sky-400 bg-sky-950/50 border-sky-500/40';
  if (score >= 60) return 'text-amber-400 bg-amber-950/50 border-amber-500/40';
  return 'text-rose-400 bg-rose-950/50 border-rose-500/40';
}

export function getHarmonyBadgeStyle(state: HarmonyState): {
  label: string;
  color: string;
  bg: string;
  border: string;
} {
  switch (state) {
    case 'UNISON':
      return {
        label: 'Тотальный унисон',
        color: 'text-emerald-400',
        bg: 'bg-emerald-950/60',
        border: 'border-emerald-500/40',
      };
    case 'CONTRAPUNCT':
      return {
        label: 'Благородный контрапункт',
        color: 'text-sky-400',
        bg: 'bg-sky-950/60',
        border: 'border-sky-500/40',
      };
    case 'DIVERGENCE':
      return {
        label: 'Умеренная дивергенция',
        color: 'text-amber-400',
        bg: 'bg-amber-950/60',
        border: 'border-amber-500/40',
      };
    case 'DISSONANCE':
      return {
        label: 'Семантический диссонанс',
        color: 'text-rose-400',
        bg: 'bg-rose-950/60',
        border: 'border-rose-500/40',
      };
    case 'CACOPHONY':
    default:
      return {
        label: 'Какофония',
        color: 'text-red-500',
        bg: 'bg-red-950/60',
        border: 'border-red-600/40',
      };
  }
}
