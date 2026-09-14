import React from 'react';
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
  Atom
} from 'lucide-react';
import { AnyanovCoordinates, OutfitStack, PerfumeItem, SolfeggioAnalysis, NoteEngineAnalysis } from '../types';

interface CorePrincipleViewProps {
  coords: AnyanovCoordinates;
  onChangeCoords: (coords: AnyanovCoordinates) => void;
  outfit: OutfitStack;
  perfume: PerfumeItem;
  solfeggio: SolfeggioAnalysis;
  onSwitchToPro: () => void;
  notesEngine?: NoteEngineAnalysis;
  onOpenPeriodicTable?: () => void;
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
  whyItWorks: string;
}

const ARCHETYPES: CoreArchetype[] = [
  {
    id: 'status_power',
    title: 'Монументальный Статус',
    badge: 'Власть и Дистанция',
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
    whyItWorks: 'Плотные монументальные ткани формируют жесткий силуэт авторитета, а глубокий кожано-дымный шлейф удерживает дистанцию.'
  },
  {
    id: 'focus_balance',
    title: 'Собранность и Контроль',
    badge: 'Фокус и Дисциплина',
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
    whyItWorks: 'Элегантный блейзер и сорочка дают собранность без скованности, а холодный ирисово-ветиверовый шлейф повышает концентрацию.'
  },
  {
    id: 'seduction_warmth',
    title: 'Магнетизм и Соблазн',
    badge: 'Тепло и Сближение',
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
    whyItWorks: 'Тактильный кашемир и замша располагают к прикосновениям, а согревающий табачно-ванильный шлейф работает на дистанции объятий.'
  },
  {
    id: 'ease_breeze',
    title: 'Дневная Легкость',
    badge: 'Свежесть и Открытость',
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
    whyItWorks: 'Натуральный дышащий лен и светлая палитра транслируют свободу, а цитрусово-акватический бриз дарит ощущение свежести.'
  }
];

export const CorePrincipleView: React.FC<CorePrincipleViewProps> = ({
  coords,
  onChangeCoords,
  outfit,
  perfume,
  solfeggio,
  onSwitchToPro,
  notesEngine,
  onOpenPeriodicTable
}) => {
  // Определяем, какой архетип сейчас ближе всего
  const currentArchetype = ARCHETYPES.reduce((prev, curr) => {
    const prevDist = Math.hypot(coords.socialX - prev.coords.socialX, coords.thermoY - prev.coords.thermoY);
    const currDist = Math.hypot(coords.socialX - curr.coords.socialX, coords.thermoY - curr.coords.thermoY);
    return currDist < prevDist ? curr : prev;
  });

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
                {outfit.l4 && (
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                    <div 
                      className="w-4 h-4 rounded-full border border-white/20 shrink-0" 
                      style={{ backgroundColor: outfit.l4.color }}
                      title={outfit.l4.colorName}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-amber-400 font-mono uppercase text-[10px]">Верхняя одежда</div>
                      <div className="text-sm font-semibold text-white truncate">{outfit.l4.name}</div>
                      <div className="text-xs text-slate-400">{outfit.l4.fabric}</div>
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
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">Парфюмерное зеркало</h4>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Диффузия: {perfume.diffusion}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-lg">
                  {perfume.dominantVibe}
                </span>
              </div>

              {/* Главный флакон */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 border border-slate-800 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs font-mono text-amber-400 uppercase tracking-wider">{perfume.brand}</div>
                    <div className="text-lg font-black text-white tracking-tight">{perfume.name}</div>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  «{perfume.whyFitsOutfit}»
                </p>
              </div>

              {/* Ключевые ноты */}
              <div className="space-y-2">
                <div className="text-[11px] font-mono text-slate-400 uppercase">Ключевой ольфакторный аккорд:</div>
                <div className="flex flex-wrap gap-1.5">
                  {perfume.pyramid.top.map((note, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-medium">
                      {note}
                    </span>
                  ))}
                  {perfume.pyramid.heart.map((note, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-amber-300/90 font-medium">
                      {note}
                    </span>
                  ))}
                  {perfume.pyramid.base.map((note, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-indigo-300/90 font-medium">
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Почему они звучат вместе: Двигатель нот */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900/60 to-indigo-500/10 border border-amber-500/30 text-xs text-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Atom className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="font-medium">
                  {notesEngine && notesEngine.resonantPairs.length > 0
                    ? `Двигатель нот: ${notesEngine.resonantPairs[0].note.name} (${notesEngine.resonantPairs[0].note.symbol}) резонирует со слоем ${notesEngine.resonantPairs[0].layer} (${notesEngine.resonantPairs[0].fabric}).`
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
