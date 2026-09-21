import React, { useMemo } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Crown, 
  Briefcase, 
  Heart, 
  SunMedium, 
  ThermometerSnowflake, 
  ThermometerSun,
  CloudSun,
  CheckCircle2,
  Layers,
  Flame,
  Droplets,
  Atom,
  AlertTriangle,
  HeartHandshake,
  Compass
} from 'lucide-react';
import { AnyanovCoordinates, OutfitStack, PerfumeItem, SolfeggioAnalysis, NoteEngineAnalysis } from '../types';
import { PERFUME_DATABASE } from '../data/fragrances';
import { HUMAN_VIBE_ARCHETYPES } from '../data/humanScents';
import { analyzePeriodicNotesSynergy } from '../engine/periodicNotesEngine';

interface CorePrincipleViewProps {
  coords: AnyanovCoordinates;
  onChangeCoords: (coords: AnyanovCoordinates) => void;
  outfit: OutfitStack;
  perfume: PerfumeItem;
  idealPerfume?: PerfumeItem;
  solfeggio: SolfeggioAnalysis;
  onSwitchToPro: () => void;
  notesEngine?: NoteEngineAnalysis;
  onOpenPeriodicTable?: () => void;
  isCatalogMode?: boolean;
  onToggleCatalogMode?: () => void;
  hasWardrobeGap?: boolean;
  gapAdvice?: string;
  totalShelfCount?: number;
  onOpenShelf?: () => void;
  onOpenHumanFinder?: () => void;
}

interface CoreArchetype {
  id: string;
  title: string;
  badge: string;
  subtitle: string;
  icon: React.ReactNode;
  accentColor: string;
  borderColor: string;
  bgGradient: string;
  coords: {
    socialX: number;
    thermoY: number;
    formalIndex: 1 | 2 | 3;
  };
  idealPerfumeId: string;
  whyItWorks: string;
}

const ARCHETYPES: CoreArchetype[] = [
  {
    id: 'status_power',
    title: 'Власть',
    badge: 'Квадрант III • Вес',
    subtitle: 'Важные переговоры, совет директоров, закрытый клуб',
    icon: <Crown className="w-5 h-5 text-amber-400" />,
    accentColor: 'text-amber-400',
    borderColor: 'border-amber-500/50',
    bgGradient: 'from-amber-950/40 via-slate-900/80 to-slate-950',
    coords: {
      socialX: -0.85,
      thermoY: -0.75,
      formalIndex: 3,
    },
    idealPerfumeId: 'tom-ford-tuscan-leather',
    whyItWorks: 'Плотные монументальные ткани формируют жесткий силуэт авторитета, а глубокий кожано-дымный шлейф удерживает дистанцию.'
  },
  {
    id: 'focus_balance',
    title: 'Собранность',
    badge: 'Квадрант II • Фокус',
    subtitle: 'Офис, аналитика, деловой Smart Casual',
    icon: <Briefcase className="w-5 h-5 text-sky-400" />,
    accentColor: 'text-sky-400',
    borderColor: 'border-sky-500/50',
    bgGradient: 'from-sky-950/40 via-slate-900/80 to-slate-950',
    coords: {
      socialX: -0.40,
      thermoY: 0.45,
      formalIndex: 2,
    },
    idealPerfumeId: 'prada-lhomme',
    whyItWorks: 'Элегантный блейзер и сорочка дают собранность без скованности, а холодный ирисово-ветиверовый шлейф повышает концентрацию.'
  },
  {
    id: 'seduction_warmth',
    title: 'Притяжение',
    badge: 'Квадрант IV • Тепло',
    subtitle: 'Романтическое свидание, вечерний коктейль, театр',
    icon: <Heart className="w-5 h-5 text-rose-400" />,
    accentColor: 'text-rose-400',
    borderColor: 'border-rose-500/50',
    bgGradient: 'from-rose-950/40 via-slate-900/80 to-slate-950',
    coords: {
      socialX: 0.70,
      thermoY: -0.60,
      formalIndex: 2,
    },
    idealPerfumeId: 'tom-ford-tobacco-vanille',
    whyItWorks: 'Тактильный кашемир и замша располагают к прикосновениям, а согревающий табачно-ванильный шлейф работает на дистанции объятий.'
  },
  {
    id: 'ease_breeze',
    title: 'Легкость',
    badge: 'Квадрант I • Воздух',
    subtitle: 'Летняя терраса, прогулка, уикенд с друзьями',
    icon: <SunMedium className="w-5 h-5 text-emerald-400" />,
    accentColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/50',
    bgGradient: 'from-emerald-950/40 via-slate-900/80 to-slate-950',
    coords: {
      socialX: 0.65,
      thermoY: 0.80,
      formalIndex: 1,
    },
    idealPerfumeId: 'acqua-di-gio',
    whyItWorks: 'Натуральный дышащий лен и светлая палитра транслируют свободу, а цитрусово-акватический бриз дарит ощущение свежести.'
  }
];

export const CorePrincipleView: React.FC<CorePrincipleViewProps> = ({
  coords,
  onChangeCoords,
  outfit,
  perfume,
  idealPerfume,
  solfeggio,
  onSwitchToPro,
  notesEngine,
  onOpenPeriodicTable,
  isCatalogMode = false,
  onToggleCatalogMode,
  hasWardrobeGap = false,
  gapAdvice,
  totalShelfCount = 0,
  onOpenShelf,
  onOpenHumanFinder
}) => {
  // Определяем, какой архетип сейчас ближе всего
  const currentArchetype = ARCHETYPES.reduce((prev, curr) => {
    const prevDist = Math.hypot(coords.socialX - prev.coords.socialX, coords.thermoY - prev.coords.thermoY);
    const currDist = Math.hypot(coords.socialX - curr.coords.socialX, coords.thermoY - curr.coords.thermoY);
    return currDist < prevDist ? curr : prev;
  });

  // Канонический эталон для выбранного архетипа
  const canonicalPerfume = useMemo(() => {
    return PERFUME_DATABASE.find(p => p.id === currentArchetype.idealPerfumeId) || idealPerfume || perfume;
  }, [currentArchetype.idealPerfumeId, idealPerfume, perfume]);

  // Выбранный для показа парфюм (в режиме каталога показываем гарантированный эталон ситуации)
  const displayPerfume = isCatalogMode ? canonicalPerfume : perfume;

  // Человеческая бытовая ассоциация
  const humanArchetype = useMemo(() => {
    return HUMAN_VIBE_ARCHETYPES.find((a) => a.targetPerfumeId === displayPerfume.id);
  }, [displayPerfume.id]);

  // Динамический пересчет синергии нот для отображаемого парфюма
  const effectiveNotesEngine = useMemo(() => {
    if (displayPerfume.id === perfume.id && notesEngine) {
      return notesEngine;
    }
    return analyzePeriodicNotesSynergy(displayPerfume?.pyramid || { top: [], heart: [], base: [] }, outfit);
  }, [displayPerfume, perfume, notesEngine, outfit]);

  const displayTopNotes = Array.isArray(displayPerfume?.pyramid?.top) ? displayPerfume.pyramid.top : [];
  const displayHeartNotes = Array.isArray(displayPerfume?.pyramid?.heart) ? displayPerfume.pyramid.heart : [];
  const displayBaseNotes = Array.isArray(displayPerfume?.pyramid?.base) ? displayPerfume.pyramid.base : [];

  const handleSelectArchetype = (arch: CoreArchetype) => {
    onChangeCoords({
      socialX: arch.coords.socialX,
      thermoY: arch.coords.thermoY,
      formalIndex: arch.coords.formalIndex,
      temperatureC: coords.temperatureC
    });
  };

  const handleSetWeather = (temp: number) => {
    onChangeCoords({
      ...coords,
      temperatureC: temp
    });
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto pb-12 animate-in fade-in duration-300">
      
      {/* 1. Манифест-баннер: В чём суть системы */}
      <section className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Принцип Системы Аньянова
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              «Стильно, легко и безошибочно»
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Вам не нужно тратить часы перед зеркалом. Система берет на себя строгий расчет физики тканей, 
              погоды и психологии шлейфа. Вы выбираете только <strong className="text-amber-400 font-semibold">социальную цель</strong> — 
              система выдает гарантированно выверенный дуэт <strong className="text-white font-semibold">Одежды</strong> и <strong className="text-white font-semibold">Аромата</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-emerald-400 uppercase">0 ошибок</div>
              <div className="text-xs text-slate-400">100% синергия одежды и парфюма</div>
            </div>
          </div>
        </div>

        {/* 3 шага формулы */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/50">
            <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-mono font-bold text-xs">
              1
            </span>
            <span className="text-xs text-slate-300 font-medium">1. Выберите вашу цель (контекст)</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/50">
            <span className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-mono font-bold text-xs">
              2
            </span>
            <span className="text-xs text-slate-300 font-medium">2. Матрица устраняет риск диссонанса</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/50">
            <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold text-xs">
              3
            </span>
            <span className="text-xs text-slate-300 font-medium">3. Готовый безупречный образ</span>
          </div>
        </div>
      </section>

      {/* 2. ШАГ 1: Выбор жизненной цели (4 архетипа) */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-mono text-amber-400 uppercase font-bold tracking-wider">Шаг 1 из 2</span>
            <h3 className="text-lg font-bold text-white">Какое впечатление вам нужно произвести?</h3>
          </div>
          
          {/* Мини-контроль погоды (без перегруза) */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium px-2 hidden sm:inline">Погода:</span>
            <button
              onClick={() => handleSetWeather(0)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                coords.temperatureC <= 10 ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' : 'text-slate-400 hover:text-white'
              }`}
              title="Холодно (пальто/куртка)"
            >
              <ThermometerSnowflake className="w-3.5 h-3.5" />
              <span>Холод (0°C)</span>
            </button>
            <button
              onClick={() => handleSetWeather(20)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                coords.temperatureC > 10 && coords.temperatureC < 25 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-white'
              }`}
              title="Комфортно (пиджак/джемпер)"
            >
              <CloudSun className="w-3.5 h-3.5" />
              <span>Комфорт (20°C)</span>
            </button>
            <button
              onClick={() => handleSetWeather(28)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                coords.temperatureC >= 25 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-white'
              }`}
              title="Тепло/Жарко (рубашка/лен)"
            >
              <ThermometerSun className="w-3.5 h-3.5" />
              <span>Тепло (28°C)</span>
            </button>
          </div>
        </div>

        {/* 4 карточки целей */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ARCHETYPES.map((arch) => {
            const isSelected = currentArchetype.id === arch.id;
            return (
              <button
                key={arch.id}
                onClick={() => handleSelectArchetype(arch)}
                className={`relative p-5 rounded-2xl text-left transition-all duration-200 border cursor-pointer flex flex-col justify-between gap-4 bg-gradient-to-b ${arch.bgGradient} ${
                  isSelected
                    ? `${arch.borderColor} ring-2 ring-amber-500/50 shadow-xl shadow-amber-500/5 scale-[1.02]`
                    : 'border-slate-800/80 hover:border-slate-700 opacity-80 hover:opacity-100'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 text-amber-400">
                    <CheckCircle2 className="w-5 h-5 fill-amber-400/20" />
                  </div>
                )}

                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-center">
                    {arch.icon}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                      {arch.badge}
                    </span>
                    <h4 className="text-base font-bold text-white mt-0.5">
                      {arch.title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {arch.subtitle}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/60 text-[11px] text-slate-300 italic leading-snug">
                  {arch.whyItWorks}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. ШАГ 2: Безошибочный результат (Дуэт Гардероба и Парфюма) */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-emerald-400 uppercase font-bold tracking-wider">Шаг 2 из 2</span>
            <h3 className="text-lg font-bold text-white">Ваш готовый выверенный дуэт</h3>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Сольфеджио: <strong className="text-emerald-400">{solfeggio.stateLabel}</strong></span>
          </div>
        </div>

        {/* 2 Карточки бок о бок */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* КАРТОЧКА 1: ГОТОВЫЙ ГАРДЕРОБ */}
          <div className="rounded-3xl p-6 bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between gap-5 relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">Капсула гардероба</h4>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Формальность: {coords.formalIndex === 3 ? 'Business Formal' : coords.formalIndex === 2 ? 'Smart Casual' : 'Casual'}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                  {coords.temperatureC}°C
                </span>
              </div>

              {/* Список вещей простым человеческим языком */}
              <div className="space-y-3">
                {/* Транзитная уличная верхняя одежда (если холодно на улице) */}
                {outfit.overwear && (
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-amber-950/20 border border-amber-500/30">
                    <div 
                      className="w-4 h-4 rounded-full border border-white/20 shrink-0" 
                      style={{ backgroundColor: outfit.overwear.color }}
                      title={outfit.overwear.colorName}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-amber-400 font-mono uppercase font-bold">Транзит (Улица • Сдается в гардероб)</span>
                        <span className="text-[10px] text-amber-300/70 font-mono">до мероприятия</span>
                      </div>
                      <div className="text-sm font-semibold text-white truncate">{outfit.overwear.name}</div>
                      <div className="text-xs text-slate-400">{outfit.overwear.fabric}</div>
                    </div>
                  </div>
                )}

                {outfit.l4 ? (
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                    <div 
                      className="w-4 h-4 rounded-full border border-white/20 shrink-0" 
                      style={{ backgroundColor: outfit.l4.color }}
                      title={outfit.l4.colorName}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-amber-400 font-mono uppercase text-[10px]">L4 • Жакет / Пиджак (На мероприятии)</div>
                      <div className="text-sm font-semibold text-white truncate">{outfit.l4.name}</div>
                      <div className="text-xs text-slate-400">{outfit.l4.fabric}</div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-950/30 border border-dashed border-slate-800 text-slate-500">
                    <div className="w-4 h-4 rounded-full border border-dashed border-slate-700 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-mono uppercase text-slate-500">L4 • Пиджак снят (Летний режим)</div>
                      <div className="text-xs text-slate-400">Только торс, брюки и обувь — максимальная легкость в зной</div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                  <div 
                    className="w-4 h-4 rounded-full border border-white/20 shrink-0" 
                    style={{ backgroundColor: outfit.l3.color }}
                    title={outfit.l3.colorName}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-sky-400 font-mono uppercase text-[10px]">Торс</div>
                    <div className="text-sm font-semibold text-white truncate">{outfit.l3.name}</div>
                    <div className="text-xs text-slate-400">{outfit.l3.fabric}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                  <div 
                    className="w-4 h-4 rounded-full border border-white/20 shrink-0" 
                    style={{ backgroundColor: outfit.l2.color }}
                    title={outfit.l2.colorName}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-indigo-400 font-mono uppercase text-[10px]">Брюки / Низ</div>
                    <div className="text-sm font-semibold text-white truncate">{outfit.l2.name}</div>
                    <div className="text-xs text-slate-400">{outfit.l2.fabric}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                  <div 
                    className="w-4 h-4 rounded-full border border-white/20 shrink-0" 
                    style={{ backgroundColor: outfit.l1.color }}
                    title={outfit.l1.colorName}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-emerald-400 font-mono uppercase text-[10px]">Обувь</div>
                    <div className="text-sm font-semibold text-white truncate">{outfit.l1.name}</div>
                    <div className="text-xs text-slate-400">{outfit.l1.fabric}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 text-xs text-slate-300 flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Ткани и плотность слоев проверены компилятором под погоду {coords.temperatureC}°C.</span>
            </div>
          </div>

          {/* КАРТОЧКА 2: ГОТОВЫЙ АРОМАТ-ЗЕРКАЛО */}
          <div className="rounded-3xl p-6 bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between gap-5 relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">Парфюмерное зеркало</h4>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Диффузия: {displayPerfume.diffusion}
                    </span>
                  </div>
                </div>

                {/* Switcher: Shelf vs Canonical Benchmark */}
                <div className="flex items-center gap-2 flex-wrap">
                  {onToggleCatalogMode && (
                    <div className="flex items-center bg-slate-950 p-0.5 rounded-xl border border-slate-800 text-[11px] font-mono">
                      <button
                        onClick={() => {
                          if (isCatalogMode) onToggleCatalogMode();
                        }}
                        className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                          !isCatalogMode
                            ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                        title="Использовать лучший парфюм из моей личной полки"
                      >
                        <Layers className="w-3 h-3" />
                        <span>Полка ({totalShelfCount})</span>
                      </button>
                      <button
                        onClick={() => {
                          if (!isCatalogMode) onToggleCatalogMode();
                        }}
                        className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                          isCatalogMode
                            ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                        title="Показать эталонный канонический аромат ситуации"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Эталон</span>
                      </button>
                    </div>
                  )}

                  <span className="text-xs font-mono text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-lg">
                    {displayPerfume.dominantVibe}
                  </span>
                </div>
              </div>

              {/* Ольфакторный пробел (Wardrobe Gap) если на полке нет подходящего аромата */}
              {!isCatalogMode && hasWardrobeGap && (
                <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-2.5 animate-in fade-in">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-amber-300 flex items-center gap-1.5">
                      <span>Ольфакторный компромисс полки</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 border border-amber-500/30 text-amber-300">
                        Wardrobe Gap
                      </span>
                    </div>
                    <div className="text-[11px] text-amber-200/90 mt-1 leading-snug">
                      {gapAdvice || `Текущий образ требует аромата другого направления. В эталоне рекомендован ${canonicalPerfume.name} (${canonicalPerfume.brand}).`}
                    </div>
                    {onToggleCatalogMode && (
                      <button
                        onClick={onToggleCatalogMode}
                        className="mt-2 text-[11px] font-bold text-amber-300 hover:text-amber-200 underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>Показать эталонный аромат ({canonicalPerfume.name})</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Главный флакон */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 border border-slate-800 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs font-mono text-amber-400 uppercase tracking-wider">{displayPerfume.brand}</div>
                    <div className="text-lg font-black text-white tracking-tight">{displayPerfume.name}</div>
                  </div>
                  {isCatalogMode && (
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Эталон ситуации
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  «{displayPerfume.whyFitsOutfit}»
                </p>
              </div>

              {/* Человеческий вайб аромата без заумных нот */}
              {humanArchetype ? (
                <div className="p-3 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900/80 to-blue-950/40 border border-cyan-500/30 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-start gap-2.5">
                    <HeartHandshake className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-cyan-300 text-[10px] font-mono uppercase tracking-wider">
                          Вайб на человеческом языке:
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 font-medium">
                          {humanArchetype.shortTag}
                        </span>
                      </div>
                      <p className="text-slate-100 text-xs font-semibold mt-0.5">
                        {humanArchetype.title}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                        {humanArchetype.metaphors.join(' • ')}
                      </p>
                    </div>
                  </div>
                  {onOpenHumanFinder && (
                    <button
                      onClick={onOpenHumanFinder}
                      className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 px-2.5 py-1 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 transition-colors shrink-0 cursor-pointer"
                    >
                      Все вайбы →
                    </button>
                  )}
                </div>
              ) : onOpenHumanFinder && (
                <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span className="text-[11px]">Не знаете химию пирамиды?</span>
                  <button
                    onClick={onOpenHumanFinder}
                    className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                  >
                    <HeartHandshake className="w-3 h-3" />
                    Подобрать по ассоциациям
                  </button>
                </div>
              )}

              {/* Анатомия раскрытия (Крылья • Сердце • Якорь) */}
              {effectiveNotesEngine?.olfactoryDynamics && (
                <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800 text-[11px] flex flex-col gap-2.5 shadow-inner">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-amber-400" />
                      Анатомия раскрытия (Физика &amp; Дистанция)
                    </span>
                    <span className="text-[9px] font-mono text-amber-300/90 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30">
                      Координаты нот
                    </span>
                  </div>

                  {/* 1. Верх (+Y): Крылья и летучесть */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="font-bold text-sky-400 flex items-center gap-1">
                        <span>▲ ВЕРХ (+Y):</span>
                        <span className="text-slate-400 font-normal">Летучесть &amp; Импульс</span>
                      </span>
                      <span className="text-sky-300/90">
                        {Math.round(effectiveNotesEngine.olfactoryDynamics.topVolatilesScore * 100)}% диффузия
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {displayTopNotes.map((note, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
                          {note}
                        </span>
                      ))}
                      {displayTopNotes.length === 0 && <span className="text-slate-500 text-xs">—</span>}
                    </div>
                  </div>

                  {/* 2. СЕРДЦЕ (X): Психологическая дистанция */}
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-amber-500/30 space-y-1.5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-black text-amber-300 flex items-center gap-1">
                        <span>● СЕРДЦЕ (X):</span>
                        <span className="text-amber-100 font-semibold">{effectiveNotesEngine.olfactoryDynamics.heartDistanceLabel}</span>
                      </span>
                      <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-950/80 px-1.5 py-0.2 rounded border border-amber-500/30">
                        {effectiveNotesEngine.olfactoryDynamics.heartDistanceScore > 0 ? `+${effectiveNotesEngine.olfactoryDynamics.heartDistanceScore}` : effectiveNotesEngine.olfactoryDynamics.heartDistanceScore}
                      </span>
                    </div>
                    
                    {/* Визуальная шкала дистанции сердца */}
                    <div className="space-y-1">
                      <div className="relative h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-700/80">
                        <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-slate-500/70 z-10" />
                        <div 
                          className="absolute top-0 bottom-0 w-3 rounded-full -translate-x-1/2 bg-gradient-to-r from-amber-400 to-amber-200 shadow-[0_0_10px_#f59e0b] transition-all duration-300"
                          style={{ left: `${((effectiveNotesEngine.olfactoryDynamics.heartDistanceScore + 1) / 2) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[8px] font-mono text-slate-400">
                        <span>◄ Границы / Дистанция (–X)</span>
                        <span>Баланс</span>
                        <span>Сближение / Интим (+X) ►</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {displayHeartNotes.map((note, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded-md bg-amber-950/40 border border-amber-500/30 text-amber-200 font-medium">
                          {note}
                        </span>
                      ))}
                      {displayHeartNotes.length === 0 && <span className="text-slate-500 text-xs">—</span>}
                    </div>
                    <p className="text-[10px] text-slate-400 leading-snug">
                      {effectiveNotesEngine.olfactoryDynamics.heartInterpretation}
                    </p>
                  </div>

                  {/* 3. База (-Y): Якорь и фиксаторы */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="font-bold text-indigo-400 flex items-center gap-1">
                        <span>▼ БАЗА (–Y):</span>
                        <span className="text-slate-400 font-normal">Якорь &amp; Фиксация</span>
                      </span>
                      <span className="text-indigo-300/90">
                        {Math.round(effectiveNotesEngine.olfactoryDynamics.baseFixationScore * 100)}% стойкость
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {displayBaseNotes.map((note, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded-md bg-indigo-950/40 border border-indigo-500/30 text-indigo-200">
                          {note}
                        </span>
                      ))}
                      {displayBaseNotes.length === 0 && <span className="text-slate-500 text-xs">—</span>}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Почему они звучат вместе: Двигатель нот */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900/60 to-indigo-500/10 border border-amber-500/30 text-xs text-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Atom className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="font-medium">
                  {effectiveNotesEngine && effectiveNotesEngine.resonantPairs.length > 0
                    ? `Двигатель нот: ${effectiveNotesEngine.resonantPairs[0].note.name} (${effectiveNotesEngine.resonantPairs[0].note.symbol}) резонирует со слоем ${effectiveNotesEngine.resonantPairs[0].layer} (${effectiveNotesEngine.resonantPairs[0].fabric}).`
                    : 'Шлейф и фактура тканей настроены в единую тональность без диссонансов.'}
                </span>
              </div>
              {onOpenPeriodicTable && (
                <button
                  onClick={onOpenPeriodicTable}
                  className="text-[11px] font-mono text-indigo-400 hover:text-indigo-300 underline flex items-center gap-1 cursor-pointer shrink-0"
                >
                  Таблица нот
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Переход в Студию Pro */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-3xl bg-slate-950 border border-slate-800/80 text-center sm:text-left">
        <div>
          <h4 className="text-sm font-bold text-white">Нужна тонкая калибровка или управление личной полкой?</h4>
          <p className="text-xs text-slate-400 mt-0.5">
            В Лаборатории Pro доступны интерактивный 2D-координатный канвас, 4 слайдера, послойный манекен и радар Сольфеджио.
          </p>
        </div>
        <button
          onClick={onSwitchToPro}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-amber-500/40 text-amber-400 hover:text-amber-300 text-xs font-bold font-mono transition-all shadow-lg hover:shadow-amber-500/10 cursor-pointer shrink-0"
        >
          <span>Открыть Лабораторию Pro</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
