import React, { useState, useMemo } from 'react';
import {
  GraduationLevel,
  BrandMatrixProfile,
  BrandPerfume,
  VERSACE_PROFILE,
  TOM_FORD_PROFILE,
  LATTAFA_PROFILE,
  ALL_BRAND_PROFILES,
  CROSS_BRAND_SLOTS,
  CrossBrandSlot,
  calculateCoordDistance,
} from '../data/brandMatrixData';
import {
  Sparkles,
  Swords,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Plus,
  Layers,
  ChevronRight,
  ExternalLink,
  Flame,
  Snowflake,
  Sun,
  Wind,
  Shield,
  Heart,
  TrendingDown,
  Info,
} from 'lucide-react';
import { AnyanovCoordinates } from '../types';

interface BrandMatrixViewProps {
  onApplyCoords: (coords: AnyanovCoordinates) => void;
  onSwitchTab?: (tab: any) => void;
  userShelfIds?: string[];
  onToggleShelfId?: (id: string) => void;
  onOpenShelfModal?: () => void;
}

type ViewMode = 'battle' | 'solo';

export const BrandMatrixView: React.FC<BrandMatrixViewProps> = ({
  onApplyCoords,
  onSwitchTab,
  userShelfIds = [],
  onToggleShelfId,
  onOpenShelfModal,
}) => {
  const [level, setLevel] = useState<GraduationLevel>(5);
  const [viewMode, setViewMode] = useState<ViewMode>('battle');
  const [selectedBrandId, setSelectedBrandId] = useState<string>('tom-ford');
  const [activeHoverId, setActiveHoverId] = useState<string | null>(null);

  const selectedBrand = useMemo(() => {
    return (
      ALL_BRAND_PROFILES.find((b) => b.id === selectedBrandId) ||
      TOM_FORD_PROFILE
    );
  }, [selectedBrandId]);

  const levelDescriptions: Record<
    GraduationLevel,
    { title: string; subtitle: string; formula: string; quote: string }
  > = {
    1: {
      title: 'Уровень 1: Равновесие (Центр 0, 0)',
      subtitle: '1 внесезонный флакон-хамелеон на круглый год',
      formula: '1 Флакон = 80% задач (Офис, Street, Спорт, Переговоры)',
      quote:
        '«Один флакон, чтобы никогда не ошибиться. Точка покоя в центре координат, не вызывающая отторжения ни в зной +30°C, ни в мороз -20°C.»',
    },
    3: {
      title: 'Уровень 3: Триада Жизни (Равновесие ⚖️ / Собранность 💼 / Притяжение 🔥)',
      subtitle: 'Демаркационная линия между социумом, работой и личной жизнью',
      formula: '3 Флакона = Равновесие (0, 0) + Собранность (NW) + Притяжение (SE)',
      quote:
        '«Днем — собранность и чистая сорочка (-X), вечером — тепло и сокращение дистанции (+X), а в центре — точка равновесия (0, 0) для любых задач.»',
    },
    5: {
      title: 'Уровень 5: Квинтет Стихий (Равновесие + 4 Квадранта)',
      subtitle: 'Тотальный контроль над 4 временами года и 4 социальными ролями',
      formula: '5 Флаконов = Равновесие (0,0) + Легкость (NE) + Собранность (NW) + Власть (SW) + Притяжение (SE)',
      quote:
        '«Золотое сечение гардероба. У вас больше нет брешей в календаре: каждый сезон и каждый психологический контекст закрыты эталоном.»',
    },
    9: {
      title: 'Уровень 9: Палитра Полутонов и Климатических Мостов',
      subtitle: 'Включение межсезонных переходов и тонких эмоциональных состояний',
      formula: '9 Флаконов = Квинтет 5 + Весенний озон + Пляжный зной + Бархатная осень + Зимние смолы',
      quote:
        '«Уровень парфюмерного сомелье. Вы управляете полутонами погоды и настроения с хирургической точностью.»',
    },
  };

  const currentLevelInfo = levelDescriptions[level];

  // Точки для SVG-радара в зависимости от текущего режима
  const radarPoints = useMemo(() => {
    const list: {
      id: string;
      name: string;
      brand: string;
      brandColor: string;
      x: number;
      y: number;
      tier: string;
      isBridge?: boolean;
      isCenter?: boolean;
      bridgeSeason?: 'spring' | 'summer' | 'autumn' | 'winter';
      roleTag?: string;
    }[] = [];

    const getBrandColor = (brandName: string) => {
      const lower = brandName.toLowerCase();
      if (lower.includes('versace')) return '#38bdf8'; // sky-400
      if (lower.includes('tom ford')) return '#fbbf24'; // amber-400
      if (lower.includes('lattafa')) return '#34d399'; // emerald-400
      if (lower.includes('admiral') || lower.includes('адмирал') || lower.includes('sergio nero')) return '#60a5fa'; // blue-400
      return '#a855f7'; // purple-400
    };

    if (viewMode === 'battle') {
      // Собираем точки из спарринга
      CROSS_BRAND_SLOTS.forEach((slot) => {
        // Уровень 1 показывает только центр
        if (level === 1 && slot.slotKey !== 'center_calibrator') return;
        // Уровень 3 показывает центр, NW (офис) и SE (соблазн)
        if (
          level === 3 &&
          slot.slotKey !== 'center_calibrator' &&
          slot.slotKey !== 'nw_boardroom_focus' &&
          slot.slotKey !== 'se_seduction_gourmand'
        )
          return;
        // Уровень 5 показывает 5 базовых слотов матрицы (без климатических мостов)
        if (level === 5 && slot.slotKey.startsWith('bridge_')) return;

        const isCenter = slot.slotKey === 'center_calibrator';
        const isBridge = slot.slotKey.startsWith('bridge_');
        const bridgeSeason = slot.slotKey === 'bridge_spring'
          ? 'spring'
          : slot.slotKey === 'bridge_summer'
          ? 'summer'
          : slot.slotKey === 'bridge_autumn'
          ? 'autumn'
          : slot.slotKey === 'bridge_winter'
          ? 'winter'
          : undefined;

        const roleTag = isCenter
          ? '⚖️ Камертон 365 (Центр 0,0)'
          : slot.slotKey === 'bridge_spring'
          ? '🌸 Мост: Весна & Пробуждение (NW ⟷ NE)'
          : slot.slotKey === 'bridge_summer'
          ? '☀️ Мост: Зной & Драйв (NE ⟷ SE)'
          : slot.slotKey === 'bridge_autumn'
          ? '🍂 Мост: Бархатная Осень (SE ⟷ SW)'
          : slot.slotKey === 'bridge_winter'
          ? '❄️ Мост: Морозная Зима (SW ⟷ NW)'
          : slot.slotTitle;

        list.push({
          id: slot.versaceItem.id,
          name: slot.versaceItem.name,
          brand: 'Versace',
          brandColor: '#38bdf8',
          x: slot.versaceItem.x,
          y: slot.versaceItem.y,
          tier: 'Люкс',
          isCenter,
          isBridge,
          bridgeSeason,
          roleTag,
        });
        list.push({
          id: slot.tomFordItem.id,
          name: slot.tomFordItem.name,
          brand: 'Tom Ford',
          brandColor: '#fbbf24',
          x: slot.tomFordItem.x,
          y: slot.tomFordItem.y,
          tier: 'Ниша',
          isCenter,
          isBridge,
          bridgeSeason,
          roleTag,
        });
        list.push({
          id: slot.lattafaItem.id,
          name: slot.lattafaItem.name,
          brand: 'Lattafa',
          brandColor: '#34d399',
          x: slot.lattafaItem.x,
          y: slot.lattafaItem.y,
          tier: 'Smart Dupe',
          isCenter,
          isBridge,
          bridgeSeason,
          roleTag,
        });
        list.push({
          id: slot.admiralItem.id,
          name: slot.admiralItem.name,
          brand: 'Sergio Nero',
          brandColor: '#60a5fa',
          x: slot.admiralItem.x,
          y: slot.admiralItem.y,
          tier: 'Смарт-Классика',
          isCenter,
          isBridge,
          bridgeSeason,
          roleTag,
        });
      });
    } else {
      // Соло-режим выбранного бренда
      const b = selectedBrand;
      const color = getBrandColor(b.name);

      if (level === 1) {
        const item = b.levels[1].center;
        list.push({
          id: item.id,
          name: item.name,
          brand: b.name,
          brandColor: '#fbbf24',
          x: item.x,
          y: item.y,
          tier: b.categoryTitle,
          isCenter: true,
          roleTag: '⚖️ Камертон 365 (Центр 0,0)',
        });
      } else if (level === 3) {
        const c = b.levels[3].center;
        const d = b.levels[3].day;
        const e = b.levels[3].evening;
        list.push({
          id: c.id,
          name: c.name,
          brand: b.name,
          brandColor: '#fbbf24',
          x: c.x,
          y: c.y,
          tier: 'Камертон (Центр)',
          isCenter: true,
          roleTag: '⚖️ Камертон (Центр 0,0)',
        });
        list.push({
          id: d.id,
          name: d.name,
          brand: b.name,
          brandColor: color,
          x: d.x,
          y: d.y,
          tier: 'День (Офис)',
          roleTag: '☀️ День: Собранность (NW)',
        });
        list.push({
          id: e.id,
          name: e.name,
          brand: b.name,
          brandColor: color,
          x: e.x,
          y: e.y,
          tier: 'Вечер (Соблазн)',
          roleTag: '🌙 Вечер: Притяжение (SE)',
        });
      } else if (level === 5) {
        const l5 = b.levels[5];
        list.push({
          id: l5.center.id,
          name: l5.center.name,
          brand: b.name,
          brandColor: '#fbbf24',
          x: l5.center.x,
          y: l5.center.y,
          tier: 'Камертон (0, 0)',
          isCenter: true,
          roleTag: '⚖️ Камертон 365 (Центр 0,0)',
        });
        list.push({
          id: l5.ne.id,
          name: l5.ne.name,
          brand: b.name,
          brandColor: color,
          x: l5.ne.x,
          y: l5.ne.y,
          tier: 'NE: Легкость',
          roleTag: 'Полюс NE: Легкость (+X, +Y)',
        });
        list.push({
          id: l5.nw.id,
          name: l5.nw.name,
          brand: b.name,
          brandColor: color,
          x: l5.nw.x,
          y: l5.nw.y,
          tier: 'NW: Собранность',
          roleTag: 'Полюс NW: Собранность (-X, +Y)',
        });
        list.push({
          id: l5.sw.id,
          name: l5.sw.name,
          brand: b.name,
          brandColor: color,
          x: l5.sw.x,
          y: l5.sw.y,
          tier: 'SW: Власть',
          roleTag: 'Полюс SW: Власть (-X, -Y)',
        });
        list.push({
          id: l5.se.id,
          name: l5.se.name,
          brand: b.name,
          brandColor: color,
          x: l5.se.x,
          y: l5.se.y,
          tier: 'SE: Притяжение',
          roleTag: 'Полюс SE: Притяжение (+X, -Y)',
        });
      } else if (level === 9) {
        const l9 = b.levels[9];
        // 1 Центр
        list.push({
          id: l9.center.id,
          name: l9.center.name,
          brand: b.name,
          brandColor: '#fbbf24',
          x: l9.center.x,
          y: l9.center.y,
          tier: 'Камертон (0, 0)',
          isCenter: true,
          roleTag: '⚖️ Камертон 365 (Центр 0,0)',
        });
        // 4 Полярных квадранта (Опорные столпы)
        list.push({
          id: l9.ne.id,
          name: l9.ne.name,
          brand: b.name,
          brandColor: color,
          x: l9.ne.x,
          y: l9.ne.y,
          tier: 'Полюс NE: Легкость',
          roleTag: 'Полюс NE: Легкость (+X, +Y)',
        });
        list.push({
          id: l9.nw.id,
          name: l9.nw.name,
          brand: b.name,
          brandColor: color,
          x: l9.nw.x,
          y: l9.nw.y,
          tier: 'Полюс NW: Собранность',
          roleTag: 'Полюс NW: Собранность (-X, +Y)',
        });
        list.push({
          id: l9.sw.id,
          name: l9.sw.name,
          brand: b.name,
          brandColor: color,
          x: l9.sw.x,
          y: l9.sw.y,
          tier: 'Полюс SW: Власть',
          roleTag: 'Полюс SW: Власть (-X, -Y)',
        });
        list.push({
          id: l9.se.id,
          name: l9.se.name,
          brand: b.name,
          brandColor: color,
          x: l9.se.x,
          y: l9.se.y,
          tier: 'Полюс SE: Притяжение',
          roleTag: 'Полюс SE: Притяжение (+X, -Y)',
        });
        // 4 Климатических моста (Переходы между квадрантами)
        list.push({
          id: l9.bridges.spring.id,
          name: l9.bridges.spring.name,
          brand: b.name,
          brandColor: '#10b981',
          x: l9.bridges.spring.x,
          y: l9.bridges.spring.y,
          tier: 'Мост Весна (NW ⟷ NE)',
          isBridge: true,
          bridgeSeason: 'spring',
          roleTag: '🌸 Мост: Весна & Пробуждение (NW ⟷ NE)',
        });
        list.push({
          id: l9.bridges.summerHeat.id,
          name: l9.bridges.summerHeat.name,
          brand: b.name,
          brandColor: '#f59e0b',
          x: l9.bridges.summerHeat.x,
          y: l9.bridges.summerHeat.y,
          tier: 'Мост Зной (NE ⟷ SE)',
          isBridge: true,
          bridgeSeason: 'summer',
          roleTag: '☀️ Мост: Зной & Драйв (NE ⟷ SE)',
        });
        list.push({
          id: l9.bridges.autumn.id,
          name: l9.bridges.autumn.name,
          brand: b.name,
          brandColor: '#f97316',
          x: l9.bridges.autumn.x,
          y: l9.bridges.autumn.y,
          tier: 'Мост Осень (SE ⟷ SW)',
          isBridge: true,
          bridgeSeason: 'autumn',
          roleTag: '🍂 Мост: Бархатная Осень (SE ⟷ SW)',
        });
        list.push({
          id: l9.bridges.winterFrost.id,
          name: l9.bridges.winterFrost.name,
          brand: b.name,
          brandColor: '#38bdf8',
          x: l9.bridges.winterFrost.x,
          y: l9.bridges.winterFrost.y,
          tier: 'Мост Зима (SW ⟷ NW)',
          isBridge: true,
          bridgeSeason: 'winter',
          roleTag: '❄️ Мост: Морозная Зима (SW ⟷ NW)',
        });
      }
    }
    return list;
  }, [viewMode, selectedBrand, level]);

  const handleApply = (item: BrandPerfume) => {
    const tempC = Math.round(18 + item.y * 12);
    onApplyCoords({
      socialX: item.x,
      thermoY: item.y,
      formalIndex: item.x < -0.3 ? 3 : item.x > 0.3 ? 1 : 2,
      temperatureC: Math.max(-10, Math.min(35, tempC)),
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fadeIn pb-12">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-[#0A0E1A] to-slate-950 border border-slate-800 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none -mb-20" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-3xl space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Compass className="w-3.5 h-3.5" />
                Глава 5.2 • Архитектура 1–3–5–9
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Cross-Brand Radar
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Матрица Брендов & Кросс-Радар Аналогов
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Раскладывание культовых домов (
              <span className="text-sky-400 font-semibold">Versace</span>,{' '}
              <span className="text-amber-400 font-semibold">Tom Ford</span>,{' '}
              <span className="text-emerald-400 font-semibold">Lattafa</span>,{' '}
              <span className="text-blue-400 font-semibold">Sergio Nero «Адмиралъ»</span>) по математической
              формуле 1–3–5–9. Сравнивайте одни и те же ольфакторные роли разных домов слот-в-слот!
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 self-start md:self-center shrink-0">
            <button
              onClick={() => setViewMode('battle')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'battle'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Swords className="w-4 h-4" />
              Кросс-Спарринг 4 Домов
            </button>
            <button
              onClick={() => setViewMode('solo')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'solo'
                  ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              ДНК Одного Дома
            </button>
          </div>
        </div>

        {/* Brand Solo Tabs (if Solo Mode active) */}
        {viewMode === 'solo' && (
          <div className="relative z-10 mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center gap-3">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Исследуемый дом:
            </span>
            {ALL_BRAND_PROFILES.map((b) => {
              const isSelected = b.id === selectedBrandId;
              return (
                <button
                  key={b.id}
                  onClick={() => setSelectedBrandId(b.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    isSelected
                      ? `${b.badgeColor} shadow-sm ring-1 ring-white/20 bg-slate-900`
                      : 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <span>{b.name}</span>
                  <span className="text-[10px] font-normal opacity-70">({b.categoryTitle})</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Interactive Level Selector 1 – 3 – 5 – 9 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {([1, 3, 5, 9] as GraduationLevel[]).map((lvl) => {
          const isCurrent = level === lvl;
          return (
            <button
              key={lvl}
              onClick={() => setLevel(lvl)}
              className={`flex flex-col p-4 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                isCurrent
                  ? 'bg-slate-900/90 border-amber-500/60 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/40'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span
                  className={`text-xs font-mono font-extrabold px-2 py-0.5 rounded ${
                    isCurrent
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  Уровень {lvl}
                </span>
                {lvl === 5 && (
                  <span className="text-[10px] font-bold text-amber-400 font-mono">Канон</span>
                )}
                {lvl === 9 && (
                  <span className="text-[10px] font-bold text-amber-400 font-mono">Сомелье</span>
                )}
              </div>
              <span
                className={`text-sm font-bold tracking-tight mt-1 ${
                  isCurrent ? 'text-white' : 'text-slate-300'
                }`}
              >
                {lvl === 1 && 'Камертон 365'}
                {lvl === 3 && 'Триада Жизни'}
                {lvl === 5 && 'Квинтет Стихий'}
                {lvl === 9 && 'Палитра 9 Мостов'}
              </span>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                {lvl === 1 && '1 флакон на 80% задач'}
                {lvl === 3 && 'Баланс + Офис + Соблазн'}
                {lvl === 5 && 'Все 4 квадранта матрицы'}
                {lvl === 9 && 'Полутона и межсезонья'}
              </p>
            </button>
          );
        })}
      </div>

      {/* 3. Level Context & Philosophy Bar + 2D Interactive Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Philosophy & Summary */}
        <div className="lg:col-span-7 flex flex-col justify-between p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <h2 className="text-base font-extrabold text-white tracking-tight">
                {currentLevelInfo.title}
              </h2>
            </div>
            <p className="text-xs font-mono text-amber-400/90 font-medium">
              Формула: {currentLevelInfo.formula}
            </p>
            <blockquote className="text-xs italic text-slate-300 border-l-2 border-amber-500/50 pl-3 py-0.5 leading-relaxed bg-slate-950/40 rounded-r-lg p-2">
              {currentLevelInfo.quote}
            </blockquote>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
              <span>Versace (Люкс)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>Tom Ford (Ниша)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>Lattafa (Smart Dupe)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
              <span>Адмиралъ (РФ)</span>
            </div>
          </div>
        </div>

        {/* Right: Interactive 2D Coordinate Radar SVG */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-[#060912] border border-slate-800 flex flex-col items-center justify-center relative">
          <div className="flex items-center justify-between w-full mb-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-amber-400" /> 2D Фазовый Радар
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {radarPoints.length} флаконов в срезе
            </span>
          </div>

          <div className="relative w-full max-w-[280px] aspect-square flex items-center justify-center">
            <svg
              viewBox="-1.2 -1.2 2.4 2.4"
              className="w-full h-full overflow-visible select-none"
            >
              {/* Фоновая сетка квадрантов */}
              <rect x="-1" y="-1" width="2" height="2" fill="#0c111e" rx="0.1" />

              {/* Квадрантные разграничители */}
              <line x1="-1" y1="0" x2="1" y2="0" stroke="#1e293b" strokeWidth="0.02" />
              <line x1="0" y1="-1" x2="0" y2="1" stroke="#1e293b" strokeWidth="0.02" />

              {/* Концентрические кольца */}
              <circle cx="0" cy="0" r="0.4" fill="none" stroke="#1e293b" strokeWidth="0.01" strokeDasharray="0.04 0.04" />
              <circle cx="0" cy="0" r="0.8" fill="none" stroke="#1e293b" strokeWidth="0.01" strokeDasharray="0.04 0.04" />

              {/* Подписи осей */}
              <text x="0" y="-1.05" fill="#64748b" fontSize="0.075" textAnchor="middle" fontFamily="monospace">
                +Y Лето / Свежесть
              </text>
              <text x="0" y="1.12" fill="#64748b" fontSize="0.075" textAnchor="middle" fontFamily="monospace">
                -Y Зима / Плотность
              </text>
              <text x="-1.05" y="0.025" fill="#64748b" fontSize="0.075" textAnchor="end" fontFamily="monospace">
                -X Власть
              </text>
              <text x="1.05" y="0.025" fill="#64748b" fontSize="0.075" textAnchor="start" fontFamily="monospace">
                +X Эрос
              </text>

              {/* Уровень 9: Подписи климатических переходных ворот (Мостов) */}
              {level === 9 && (
                <g opacity="0.85">
                  <text x="0" y="-0.88" fill="#10b981" fontSize="0.055" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    🌸 ВЕСНА (NW ↔ NE)
                  </text>
                  <text x="0.82" y="0.02" fill="#f59e0b" fontSize="0.05" fontWeight="bold" textAnchor="middle" fontFamily="monospace" transform="rotate(90, 0.82, 0.02)">
                    ☀️ ЗНОЙ (NE ↔ SE)
                  </text>
                  <text x="0" y="0.94" fill="#f97316" fontSize="0.055" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    🍂 ОСЕНЬ (SE ↔ SW)
                  </text>
                  <text x="-0.82" y="0.02" fill="#38bdf8" fontSize="0.05" fontWeight="bold" textAnchor="middle" fontFamily="monospace" transform="rotate(-90, -0.82, 0.02)">
                    ❄️ ЗИМА (SW ↔ NW)
                  </text>
                </g>
              )}

              {/* Уровень 9: Орбиты климатических переходов (Ромб сезонной трансформации) */}
              {level === 9 && (
                <g className="transition-all duration-300">
                  {Array.from(new Set(radarPoints.map((p) => p.brand))).map((brandName) => {
                    const bPoints = radarPoints.filter((p) => p.brand === brandName);
                    const bSpring = bPoints.find((p) => p.bridgeSeason === 'spring');
                    const bSummer = bPoints.find((p) => p.bridgeSeason === 'summer');
                    const bAutumn = bPoints.find((p) => p.bridgeSeason === 'autumn');
                    const bWinter = bPoints.find((p) => p.bridgeSeason === 'winter');
                    if (!bSpring || !bSummer || !bAutumn || !bWinter) return null;

                    const activePt = radarPoints.find((p) => p.id === activeHoverId);
                    const isThisBrandHovered = activePt?.brand === brandName;
                    const isAnyHovered = Boolean(activePt);
                    const strokeColor = bSpring.brandColor || '#f59e0b';

                    return (
                      <polygon
                        key={brandName}
                        points={`${bSpring.x},${-bSpring.y} ${bSummer.x},${-bSummer.y} ${bAutumn.x},${-bAutumn.y} ${bWinter.x},${-bWinter.y}`}
                        fill={isThisBrandHovered ? strokeColor : 'none'}
                        fillOpacity={isThisBrandHovered ? 0.08 : 0}
                        stroke={strokeColor}
                        strokeWidth={isThisBrandHovered ? 0.022 : isAnyHovered ? 0.008 : 0.014}
                        strokeDasharray={isThisBrandHovered ? 'none' : '0.04 0.025'}
                        opacity={isThisBrandHovered ? 1 : isAnyHovered ? 0.2 : 0.6}
                        className="transition-all duration-300"
                      />
                    );
                  })}
                </g>
              )}

              {/* Отрисовка точек флаконов */}
              {[...radarPoints]
                .sort((a, b) => (a.id === activeHoverId ? 1 : b.id === activeHoverId ? -1 : 0))
                .map((pt) => {
                  // В SVG ось Y направлена вниз, а у нас +Y это лето (вверх), поэтому инвертируем Y: cy = -pt.y
                  const cx = pt.x;
                  const cy = -pt.y;
                  const isHovered = activeHoverId === pt.id;

                  return (
                    <g
                      key={pt.id}
                      className="cursor-pointer transition-transform duration-200"
                      onMouseEnter={() => setActiveHoverId(pt.id)}
                      onMouseLeave={() => setActiveHoverId(null)}
                      onClick={() => {
                        const tempC = Math.round(18 + pt.y * 12);
                        onApplyCoords({
                          socialX: pt.x,
                          thermoY: pt.y,
                          formalIndex: pt.x < -0.3 ? 3 : pt.x > 0.3 ? 1 : 2,
                          temperatureC: Math.max(-10, Math.min(35, tempC)),
                        });
                      }}
                    >
                      <title>
                        {pt.brand}: {pt.name} ({pt.x > 0 ? `+${pt.x.toFixed(2)}` : pt.x.toFixed(2)}, {pt.y > 0 ? `+${pt.y.toFixed(2)}` : pt.y.toFixed(2)})
                      </title>

                      {/* Подсветка при наведении */}
                      {isHovered && (
                        <circle cx={cx} cy={cy} r="0.12" fill={pt.brandColor} opacity="0.25" />
                      )}

                      {/* Центр / Камертон (0,0): Двойное золотое кольцо */}
                      {pt.isCenter && (
                        <>
                          <circle
                            cx={cx}
                            cy={cy}
                            r="0.08"
                            fill="none"
                            stroke="#fbbf24"
                            strokeWidth="0.012"
                            strokeDasharray="0.02 0.02"
                            opacity="0.8"
                          />
                          <circle
                            cx={cx}
                            cy={cy}
                            r={isHovered ? 0.065 : 0.05}
                            fill="#fbbf24"
                            stroke="#05070d"
                            strokeWidth="0.015"
                          />
                          <circle cx={cx} cy={cy} r="0.018" fill="#05070d" />
                        </>
                      )}

                      {/* Климатический мост: Ореол сезонного перехода */}
                      {pt.isBridge && (
                        <>
                          <circle
                            cx={cx}
                            cy={cy}
                            r={isHovered ? 0.085 : 0.068}
                            fill="none"
                            stroke={pt.brandColor}
                            strokeWidth="0.012"
                            strokeDasharray="0.02 0.015"
                            opacity={isHovered ? 1 : 0.75}
                          />
                          <circle
                            cx={cx}
                            cy={cy}
                            r={isHovered ? 0.06 : 0.045}
                            fill={pt.brandColor}
                            stroke="#05070d"
                            strokeWidth="0.015"
                          />
                          <circle cx={cx} cy={cy} r="0.015" fill="#ffffff" opacity={isHovered ? 1 : 0.85} />
                        </>
                      )}

                      {/* Обычная полярная точка */}
                      {!pt.isCenter && !pt.isBridge && (
                        <circle
                          cx={cx}
                          cy={cy}
                          r={isHovered ? 0.065 : 0.045}
                          fill={pt.brandColor}
                          stroke="#05070d"
                          strokeWidth="0.015"
                        />
                      )}
                    </g>
                  );
                })}
            </svg>
          </div>

          {/* Интерактивная плашка под радаром */}
          {activeHoverId ? (
            (() => {
              const hovered = radarPoints.find((p) => p.id === activeHoverId);
              if (!hovered) return null;
              return (
                <div
                  onClick={() => {
                    const tempC = Math.round(18 + hovered.y * 12);
                    onApplyCoords({
                      socialX: hovered.x,
                      thermoY: hovered.y,
                      formalIndex: hovered.x < -0.3 ? 3 : hovered.x > 0.3 ? 1 : 2,
                      temperatureC: Math.max(-10, Math.min(35, tempC)),
                    });
                  }}
                  className="mt-3 w-full text-center px-3.5 py-2.5 rounded-xl bg-slate-900/95 border border-amber-500/40 shadow-xl cursor-pointer hover:border-amber-400 transition-all"
                >
                  <div className="text-xs font-bold text-white flex items-center justify-center gap-1.5 flex-wrap">
                    <span
                      className="w-2 h-2 rounded-full inline-block"
                      style={{ backgroundColor: hovered.brandColor }}
                    />
                    <span>{hovered.brand}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-amber-300 font-extrabold">{hovered.name}</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-300 mt-1">
                    {hovered.roleTag}
                  </div>
                  <div className="text-[10px] font-mono text-emerald-400 mt-1 flex items-center justify-center gap-2">
                    <span>
                      ({hovered.x > 0 ? `+${hovered.x.toFixed(2)}` : hovered.x.toFixed(2)},{' '}
                      {hovered.y > 0 ? `+${hovered.y.toFixed(2)}` : hovered.y.toFixed(2)})
                    </span>
                    <span className="text-slate-600">|</span>
                    <span className="text-amber-400/90 underline">Клик — применить в Систему</span>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="mt-3 text-center text-[11px] font-mono text-slate-500 px-2 leading-relaxed">
              {level === 9
                ? '🔄 Уровень 9: Пунктирный ромб объединяет 4 моста-перехода между временами года'
                : 'Наведите на точку аромата для просмотра координат и роли'}
            </div>
          )}
        </div>
      </div>

      {/* 4. MAIN CONTENT AREA */}
      {viewMode === 'battle' ? (
        /* =========================================================================
           РЕЖИМ 1: КРОСС-БРЕНДОВЫЙ СПАРРИНГ (VERSACE VS TOM FORD VS LATTAFA)
           ========================================================================= */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                <Swords className="w-5 h-5 text-amber-400" />
                Сравнение Слот-в-Слот (Кросс-брендовая биекция)
              </h3>
              <p className="text-xs text-slate-400">
                Прямое соответствие: дизайнерский люкс (Versace), селективная ниша (Tom Ford) и умная восточная альтернатива (Lattafa).
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {CROSS_BRAND_SLOTS.filter((slot) => {
              if (level === 1) return slot.slotKey === 'center_calibrator';
              if (level === 3)
                return (
                  slot.slotKey === 'center_calibrator' ||
                  slot.slotKey === 'nw_boardroom_focus' ||
                  slot.slotKey === 'se_seduction_gourmand'
                );
              if (level === 5) return !slot.slotKey.startsWith('bridge_');
              return true; // level === 9 shows all 9 slots (5 core + 4 climate bridges)
            }).map((slot) => {
              const distTfLattafa = calculateCoordDistance(
                slot.tomFordItem,
                slot.lattafaItem
              );
              const distVersaceTf = calculateCoordDistance(
                slot.versaceItem,
                slot.tomFordItem
              );

              return (
                <div
                  key={slot.slotKey}
                  className="rounded-2xl bg-[#090D18] border border-slate-800/90 overflow-hidden shadow-xl"
                >
                  {/* Slot Header Banner */}
                  <div className="p-4 md:px-6 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {slot.badge}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-white tracking-tight">
                          {slot.slotTitle}
                        </h4>
                        <span className="text-[11px] text-slate-400">
                          {slot.quadrantName} • Идеальная точка ({slot.idealCoords.x.toFixed(2)}, {slot.idealCoords.y.toFixed(2)})
                        </span>
                      </div>
                    </div>
                    <div className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                      Близость TF ⟷ Lattafa: Δ = {distTfLattafa}
                    </div>
                  </div>

                  {/* 4 Fragrances Grid (Side by Side: Люкс, Ниша, Смарт-Дуп, Отечественная классика) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
                    {/* Brand 1: Versace */}
                    <div
                      onMouseEnter={() => setActiveHoverId(slot.versaceItem.id)}
                      onMouseLeave={() => setActiveHoverId(null)}
                      className={`p-5 flex flex-col justify-between space-y-4 transition-colors ${
                        activeHoverId === slot.versaceItem.id
                          ? 'bg-sky-500/5'
                          : 'bg-transparent'
                      }`}
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-sky-400 uppercase tracking-wider">
                            Versace (Люкс)
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            {slot.versaceItem.priceCategory}
                          </span>
                        </div>
                        <div>
                          <h5 className="text-base font-extrabold text-white">
                            {slot.versaceItem.name}
                          </h5>
                          <p className="text-[11px] font-mono text-sky-300/80 mt-0.5">
                            X: {slot.versaceItem.x.toFixed(2)} | Y: {slot.versaceItem.y.toFixed(2)} • {slot.versaceItem.diffusion}
                          </p>
                        </div>
                        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                          {slot.versaceItem.dominantVibe}
                        </p>
                        <div className="text-[11px] text-slate-400 flex flex-wrap gap-1">
                          {slot.versaceItem.topNotes.slice(0, 3).map((n) => (
                            <span
                              key={n}
                              className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px]"
                            >
                              {n}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
                        <button
                          onClick={() => handleApply(slot.versaceItem)}
                          className="flex-1 py-1.5 px-3 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 text-xs font-bold transition-all cursor-pointer text-center"
                        >
                          Примерить в Системе
                        </button>
                        {onToggleShelfId && (
                          <button
                            onClick={() =>
                              onToggleShelfId(
                                slot.versaceItem.databaseId || slot.versaceItem.id
                              )
                            }
                            className={`p-2 rounded-lg border text-xs cursor-pointer ${
                              userShelfIds.includes(
                                slot.versaceItem.databaseId || slot.versaceItem.id
                              )
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border-slate-800'
                            }`}
                            title="Добавить на полку"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Brand 2: Tom Ford */}
                    <div
                      onMouseEnter={() => setActiveHoverId(slot.tomFordItem.id)}
                      onMouseLeave={() => setActiveHoverId(null)}
                      className={`p-5 flex flex-col justify-between space-y-4 transition-colors ${
                        activeHoverId === slot.tomFordItem.id
                          ? 'bg-amber-500/5'
                          : 'bg-transparent'
                      }`}
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">
                            Tom Ford (Ниша)
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            {slot.tomFordItem.priceCategory}
                          </span>
                        </div>
                        <div>
                          <h5 className="text-base font-extrabold text-white">
                            {slot.tomFordItem.name}
                          </h5>
                          <p className="text-[11px] font-mono text-amber-300/80 mt-0.5">
                            X: {slot.tomFordItem.x.toFixed(2)} | Y: {slot.tomFordItem.y.toFixed(2)} • {slot.tomFordItem.diffusion}
                          </p>
                        </div>
                        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                          {slot.tomFordItem.dominantVibe}
                        </p>
                        <div className="text-[11px] text-slate-400 flex flex-wrap gap-1">
                          {slot.tomFordItem.topNotes.slice(0, 3).map((n) => (
                            <span
                              key={n}
                              className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px]"
                            >
                              {n}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
                        <button
                          onClick={() => handleApply(slot.tomFordItem)}
                          className="flex-1 py-1.5 px-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all cursor-pointer text-center"
                        >
                          Примерить в Системе
                        </button>
                        {onToggleShelfId && (
                          <button
                            onClick={() =>
                              onToggleShelfId(
                                slot.tomFordItem.databaseId || slot.tomFordItem.id
                              )
                            }
                            className={`p-2 rounded-lg border text-xs cursor-pointer ${
                              userShelfIds.includes(
                                slot.tomFordItem.databaseId || slot.tomFordItem.id
                              )
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border-slate-800'
                            }`}
                            title="Добавить на полку"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Brand 3: Lattafa */}
                    <div
                      onMouseEnter={() => setActiveHoverId(slot.lattafaItem.id)}
                      onMouseLeave={() => setActiveHoverId(null)}
                      className={`p-5 flex flex-col justify-between space-y-4 transition-colors ${
                        activeHoverId === slot.lattafaItem.id
                          ? 'bg-emerald-500/5'
                          : 'bg-transparent'
                      }`}
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">
                            Lattafa (Smart Dupe)
                          </span>
                          <span className="text-[11px] font-mono text-emerald-400 font-bold">
                            {slot.lattafaItem.priceCategory}
                          </span>
                        </div>
                        <div>
                          <h5 className="text-base font-extrabold text-white">
                            {slot.lattafaItem.name}
                          </h5>
                          <p className="text-[11px] font-mono text-emerald-300/80 mt-0.5">
                            X: {slot.lattafaItem.x.toFixed(2)} | Y: {slot.lattafaItem.y.toFixed(2)} • {slot.lattafaItem.diffusion}
                          </p>
                        </div>
                        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                          {slot.lattafaItem.dominantVibe}
                        </p>
                        <div className="text-[11px] text-slate-400 flex flex-wrap gap-1">
                          {slot.lattafaItem.topNotes.slice(0, 3).map((n) => (
                            <span
                              key={n}
                              className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px]"
                            >
                              {n}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
                        <button
                          onClick={() => handleApply(slot.lattafaItem)}
                          className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all cursor-pointer text-center"
                        >
                          Примерить в Системе
                        </button>
                        {onToggleShelfId && (
                          <button
                            onClick={() =>
                              onToggleShelfId(
                                slot.lattafaItem.databaseId || slot.lattafaItem.id
                              )
                            }
                            className={`p-2 rounded-lg border text-xs cursor-pointer ${
                              userShelfIds.includes(
                                slot.lattafaItem.databaseId || slot.lattafaItem.id
                              )
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border-slate-800'
                            }`}
                            title="Добавить на полку"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Brand 4: Sergio Nero Адмиралъ */}
                    <div
                      onMouseEnter={() => setActiveHoverId(slot.admiralItem.id)}
                      onMouseLeave={() => setActiveHoverId(null)}
                      className={`p-5 flex flex-col justify-between space-y-4 transition-colors ${
                        activeHoverId === slot.admiralItem.id
                          ? 'bg-blue-500/5'
                          : 'bg-transparent'
                      }`}
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-blue-400 uppercase tracking-wider">
                            Адмиралъ (РФ)
                          </span>
                          <span className="text-[11px] font-mono text-blue-300 font-bold">
                            {slot.admiralItem.priceCategory}
                          </span>
                        </div>
                        <div>
                          <h5 className="text-base font-extrabold text-white">
                            {slot.admiralItem.name}
                          </h5>
                          <p className="text-[11px] font-mono text-blue-300/80 mt-0.5">
                            X: {slot.admiralItem.x > 0 ? `+${slot.admiralItem.x.toFixed(2)}` : slot.admiralItem.x.toFixed(2)} | Y: {slot.admiralItem.y > 0 ? `+${slot.admiralItem.y.toFixed(2)}` : slot.admiralItem.y.toFixed(2)} • {slot.admiralItem.diffusion}
                          </p>
                        </div>
                        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                          {slot.admiralItem.dominantVibe}
                        </p>
                        <div className="text-[11px] text-slate-400 flex flex-wrap gap-1">
                          {slot.admiralItem.topNotes.slice(0, 3).map((n) => (
                            <span
                              key={n}
                              className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px]"
                            >
                              {n}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
                        <button
                          onClick={() => handleApply(slot.admiralItem)}
                          className="flex-1 py-1.5 px-3 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 text-xs font-bold transition-all cursor-pointer text-center"
                        >
                          Примерить в Системе
                        </button>
                        {onToggleShelfId && (
                          <button
                            onClick={() =>
                              onToggleShelfId(
                                slot.admiralItem.databaseId || slot.admiralItem.id
                              )
                            }
                            className={`p-2 rounded-lg border text-xs cursor-pointer ${
                              userShelfIds.includes(
                                slot.admiralItem.databaseId || slot.admiralItem.id
                              )
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border-slate-800'
                            }`}
                            title="Добавить на полку"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Battle Bottom Insight */}
                  <div className="p-4 md:p-5 bg-slate-950/80 border-t border-slate-800/80 space-y-3">
                    <div className="text-xs text-slate-300 leading-relaxed">
                      <span className="font-bold text-amber-400 mr-1.5 inline-flex items-center gap-1.5">
                        <Swords className="w-3.5 h-3.5 text-amber-400 inline" />
                        Анализ спарринга:
                      </span>
                      {slot.battleAnalysis}
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 p-3 rounded-xl leading-relaxed">
                      <span className="text-sm shrink-0 select-none">💡</span>
                      <div className="leading-relaxed">
                        <span className="font-bold text-emerald-400 mr-1.5">Вердикт спарринга:</span>
                        <span className="text-emerald-200/95">{slot.dupeVerdict}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* =========================================================================
           РЕЖИМ 2: МОНО-ИССЛЕДОВАНИЕ ВЫБРАННОГО ДОМА (ДНК БРЕНДА)
           ========================================================================= */
        <div className="space-y-6">
          {/* Brand Info Banner */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full ${selectedBrand.badgeColor}`}>
                  {selectedBrand.country} • {selectedBrand.categoryTitle}
                </span>
                <h3 className="text-2xl font-extrabold text-white mt-1">
                  Парфюмерный Дом {selectedBrand.name}
                </h3>
              </div>
              <blockquote className="text-xs italic text-slate-400 max-w-md bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                {selectedBrand.summaryQuote}
              </blockquote>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {selectedBrand.philosophy}
            </p>
          </div>

          {/* Perfumes by Level */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Level 1: Center */}
            {level === 1 && (
              <div className="col-span-full max-w-xl mx-auto w-full">
                {renderBrandCard(selectedBrand.levels[1].center, 'Равновесие (Центр 0,0)')}
              </div>
            )}

            {/* Level 3: Triad (Center, Day Office NW, Evening Seduction SE) */}
            {level === 3 && (
              <>
                {renderBrandCard(selectedBrand.levels[3].center, 'Равновесие (Центр 0,0)')}
                {renderBrandCard(selectedBrand.levels[3].day, '☀️ День: Собранность (NW)')}
                {renderBrandCard(selectedBrand.levels[3].evening, '🌙 Вечер: Притяжение (SE)')}
              </>
            )}

            {/* Level 5: 5 Quadrants */}
            {level === 5 && (
              <>
                {renderBrandCard(selectedBrand.levels[5].center, 'Равновесие (Центр 0, 0)')}
                {renderBrandCard(selectedBrand.levels[5].ne, 'NE: Легкость (+X, +Y)')}
                {renderBrandCard(selectedBrand.levels[5].nw, 'NW: Собранность (-X, +Y)')}
                {renderBrandCard(selectedBrand.levels[5].sw, 'SW: Власть (-X, -Y)')}
                {renderBrandCard(selectedBrand.levels[5].se, 'SE: Притяжение (+X, -Y)')}
              </>
            )}

            {/* Level 9: All 9 Fragrances */}
            {level === 9 && (
              <>
                {renderBrandCard(selectedBrand.levels[9].center, 'Камертон (0, 0)')}
                {renderBrandCard(selectedBrand.levels[9].ne, 'Полюс NE (Лето)')}
                {renderBrandCard(selectedBrand.levels[9].nw, 'Полюс NW (Офис)')}
                {renderBrandCard(selectedBrand.levels[9].sw, 'Полюс SW (Власть)')}
                {renderBrandCard(selectedBrand.levels[9].se, 'Полюс SE (Эрос)')}
                {renderBrandCard(selectedBrand.levels[9].bridges.spring, '🌸 Мост: Весна')}
                {renderBrandCard(selectedBrand.levels[9].bridges.summerHeat, '☀️ Мост: Зной')}
                {renderBrandCard(selectedBrand.levels[9].bridges.autumn, '🍂 Мост: Осень')}
                {renderBrandCard(selectedBrand.levels[9].bridges.winterFrost, '❄️ Мост: Мороз')}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );

  function renderBrandCard(item: BrandPerfume, roleTag: string) {
    const isShelfItem = userShelfIds.includes(item.databaseId || item.id);

    return (
      <div
        key={item.id}
        onMouseEnter={() => setActiveHoverId(item.id)}
        onMouseLeave={() => setActiveHoverId(null)}
        className="rounded-2xl bg-[#090E1A] border border-slate-800 p-5 flex flex-col justify-between space-y-4 hover:border-amber-500/50 transition-all shadow-lg"
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">
              {roleTag}
            </span>
            <span className="text-xs font-mono text-slate-400">
              {item.priceCategory}
            </span>
          </div>

          <div>
            <h4 className="text-base font-extrabold text-white tracking-tight">
              {item.name}
            </h4>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5 font-mono">
              <span className="text-amber-400">
                ({item.x > 0 ? `+${item.x.toFixed(2)}` : item.x.toFixed(2)},{' '}
                {item.y > 0 ? `+${item.y.toFixed(2)}` : item.y.toFixed(2)})
              </span>
              <span>•</span>
              <span>{item.diffusion}</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
            {item.dominantVibe}
          </p>

          <p className="text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
            <span className="font-semibold text-slate-200">Повод:</span> {item.bestOccasion}
          </p>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono text-slate-400">Ноты пирамиды:</span>
            <div className="flex flex-wrap gap-1">
              {[...item.topNotes, ...item.heartNotes.slice(0, 2)].map((n) => (
                <span
                  key={n}
                  className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300"
                >
                  {n}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800/80 flex items-center gap-2">
          <button
            onClick={() => handleApply(item)}
            className="flex-1 py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all cursor-pointer text-center"
          >
            Примерить в Системе
          </button>
          {onToggleShelfId && (
            <button
              onClick={() => onToggleShelfId(item.databaseId || item.id)}
              className={`p-2 rounded-xl border text-xs cursor-pointer ${
                isShelfItem
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border-slate-800'
              }`}
              title="Добавить на полку"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }
};
