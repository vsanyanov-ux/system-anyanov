import React, { useState, useMemo } from 'react';
import {
  Gift,
  Heart,
  Briefcase,
  UserCheck,
  Sparkles,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  Send,
  Crown,
  Shirt,
  Flame,
} from 'lucide-react';
import { PERFUME_DATABASE, getPerfumeBottleImage } from '../data/fragrances';
import { PerfumeItem } from '../types';

interface GiftingConciergeViewProps {
  onToggleShelfId: (id: string) => void;
  userShelfIds: string[];
  onOpenShelfModal: () => void;
}

interface RecipientOption {
  id: string;
  label: string;
  sub: string;
  icon: React.ReactNode;
  defaultPower: number; // -1 to +1
}

interface WardrobeStyleOption {
  id: string;
  label: string;
  sub: string;
  defaultDistance: number;
}

interface VibeGoalOption {
  id: string;
  label: string;
  sub: string;
  targetCoords: { x: number; y: number };
}

const RECIPIENTS: RecipientOption[] = [
  {
    id: 'boss',
    label: 'Руководитель / Шеф',
    sub: 'Уважение, статус, субординация',
    icon: <Briefcase className="w-4 h-4 text-sky-400" />,
    defaultPower: -0.7,
  },
  {
    id: 'partner_man',
    label: 'Любимый мужчина / Муж',
    sub: 'Близость, влечение, уютное тепло',
    icon: <Heart className="w-4 h-4 text-rose-400" />,
    defaultPower: 0.6,
  },
  {
    id: 'business_partner',
    label: 'Деловой партнер',
    sub: 'Дипломатия, надежность, тонкий вкус',
    icon: <UserCheck className="w-4 h-4 text-indigo-400" />,
    defaultPower: -0.4,
  },
  {
    id: 'friend',
    label: 'Близкий друг / Брат',
    sub: 'Драйв, бодрость, харизма',
    icon: <Sparkles className="w-4 h-4 text-amber-400" />,
    defaultPower: 0.3,
  },
];

const WARDROBE_STYLES: WardrobeStyleOption[] = [
  {
    id: 'formal',
    label: 'Строгий костюм & сорочка',
    sub: 'Выглаженный хлопок, шерстяные брюки, оксфорды',
    defaultDistance: -0.7,
  },
  {
    id: 'smart_casual',
    label: 'Smart Casual & трикотаж',
    sub: 'Мягкий кашемир, темный деним, лоферы',
    defaultDistance: 0.1,
  },
  {
    id: 'relaxed',
    label: 'Свободный / Уличный кэжуал',
    sub: 'Худи, оверсайз, кроссовки, лен',
    defaultDistance: 0.6,
  },
];

const VIBE_GOALS: VibeGoalOption[] = [
  {
    id: 'hard_power',
    label: 'Непререкаемый авторитет и вес',
    sub: 'Уд, темная кожа, дымные смолы',
    targetCoords: { x: -0.7, y: -0.6 },
  },
  {
    id: 'seduction',
    label: 'Магнетизм, шарм и комплименты',
    sub: 'Ваниль, табак, кардамон, амбра',
    targetCoords: { x: 0.65, y: -0.55 },
  },
  {
    id: 'focus',
    label: 'Ясность ума, чистота и дисциплина',
    sub: 'Сухой ирис, ледяной цитрус, ветивер',
    targetCoords: { x: -0.6, y: 0.6 },
  },
  {
    id: 'energy',
    label: 'Солнечная энергия и легкость',
    sub: 'Морской бриз, бергамот, акватика',
    targetCoords: { x: 0.6, y: 0.6 },
  },
];

export const GiftingConciergeView: React.FC<GiftingConciergeViewProps> = ({
  onToggleShelfId,
  userShelfIds,
  onOpenShelfModal,
}) => {
  const [recipient, setRecipient] = useState<string>('boss');
  const [wardrobeStyle, setWardrobeStyle] = useState<string>('formal');
  const [vibeGoal, setVibeGoal] = useState<string>('hard_power');
  const [copiedPostcard, setCopiedPostcard] = useState(false);
  const [giftWrap, setGiftWrap] = useState(true);

  // Вычисление идеального подарка
  const selectedGoal = VIBE_GOALS.find((g) => g.id === vibeGoal) || VIBE_GOALS[0];
  const targetX = selectedGoal.targetCoords.x;
  const targetY = selectedGoal.targetCoords.y;

  const rankedGifts = useMemo(() => {
    return [...PERFUME_DATABASE]
      .map((perfume) => {
        const dx = perfume.xCoord - targetX;
        const dy = perfume.yCoord - targetY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const matchScore = Math.max(70, Math.round(100 - dist * 25));
        return { perfume, matchScore };
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [targetX, targetY]);

  const champion = rankedGifts[0]?.perfume;
  const championScore = rankedGifts[0]?.matchScore || 95;
  const alternative = rankedGifts[1]?.perfume;

  const recipientObj = RECIPIENTS.find((r) => r.id === recipient);

  // Текст открытки
  const postcardText = useMemo(() => {
    if (!champion) return '';
    if (recipient === 'boss') {
      return `Глубокоуважаемый партнер! В знак признания вашего безупречного авторитета и стратегического масштаба. Пусть благородное звучание ${champion.name} от ${champion.brand} подчеркивает непререкаемую силу каждого принятого вами решения.`;
    }
    if (recipient === 'partner_man') {
      return `Моему любимому. Аромат ${champion.name} — это то, как звучит твоя мужская сила, тепло и уверенность. Хочу вдыхать этот шлейф рядом с тобой каждый день.`;
    }
    if (recipient === 'business_partner') {
      return `В знак высокой оценки нашего сотрудничества и общих побед. ${champion.brand} ${champion.name} — эталон сдержанного вкуса и надежности, проверенной временем.`;
    }
    return `Бро, этот флакон — абсолютный огонь! ${champion.brand} ${champion.name} добавит тебе еще больше стиля, уверенности и харизмы. Носи с удовольствием!`;
  }, [champion, recipient]);

  const handleCopyPostcard = () => {
    navigator.clipboard.writeText(postcardText);
    setCopiedPostcard(true);
    setTimeout(() => setCopiedPostcard(false), 2500);
  };

  const championImg = getPerfumeBottleImage(champion);
  const altImg = getPerfumeBottleImage(alternative);

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950/30 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold tracking-wide uppercase">
            <Gift className="w-3.5 h-3.5" />
            Социальный калибровщик подарка
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Подарок без риска: парфюм со смыслом
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Парфюм — самый интимный и статусный подарок. Ответьте на 3 простых вопроса о человеке,
            и система подберет идеальный флакон с готовым текстом поздравительной открытки.
          </p>
        </div>
      </div>

      {/* 3 Steps Wizard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Step 1: Who is the recipient? */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-amber-400">
            <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-[11px] text-amber-300">
              1
            </span>
            Кому предназначается подарок?
          </div>
          <div className="space-y-2 pt-1">
            {RECIPIENTS.map((rec) => (
              <div
                key={rec.id}
                onClick={() => setRecipient(rec.id)}
                className={`p-3 rounded-xl border transition cursor-pointer flex items-center gap-3 ${
                  recipient === rec.id
                    ? 'bg-amber-500/15 border-amber-500/50 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="p-2 rounded-lg bg-slate-800/80 shrink-0">{rec.icon}</div>
                <div>
                  <div className="text-xs font-bold text-white">{rec.label}</div>
                  <div className="text-[11px] text-slate-400">{rec.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step 2: Wardrobe & Lifestyle */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-amber-400">
            <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-[11px] text-amber-300">
              2
            </span>
            Стиль одежды и привычная среда:
          </div>
          <div className="space-y-2 pt-1">
            {WARDROBE_STYLES.map((w) => (
              <div
                key={w.id}
                onClick={() => setWardrobeStyle(w.id)}
                className={`p-3 rounded-xl border transition cursor-pointer flex items-center gap-3 ${
                  wardrobeStyle === w.id
                    ? 'bg-indigo-500/15 border-indigo-500/50 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="p-2 rounded-lg bg-slate-800/80 shrink-0">
                  <Shirt className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{w.label}</div>
                  <div className="text-[11px] text-slate-400">{w.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step 3: Desired Impression */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-amber-400">
            <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-[11px] text-amber-300">
              3
            </span>
            Какое впечатление подарок должен усилить?
          </div>
          <div className="space-y-2 pt-1">
            {VIBE_GOALS.map((v) => (
              <div
                key={v.id}
                onClick={() => setVibeGoal(v.id)}
                className={`p-3 rounded-xl border transition cursor-pointer flex items-center gap-3 ${
                  vibeGoal === v.id
                    ? 'bg-rose-500/15 border-rose-500/50 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="p-2 rounded-lg bg-slate-800/80 shrink-0">
                  <Flame className="w-4 h-4 text-rose-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{v.label}</div>
                  <div className="text-[11px] text-slate-400">{v.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Calibration Result: The Perfect Match & Postcard */}
      {champion && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Champion Gift Card (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-amber-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black uppercase">
                <Crown className="w-3.5 h-3.5 fill-amber-300" />
                Главная рекомендация
              </span>
              <div className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                Точность {championScore}%
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 my-4">
              <div className="w-32 h-32 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center p-3 shrink-0 shadow-inner">
                {championImg ? (
                  <img
                    src={championImg}
                    alt={champion.name}
                    className="max-h-full object-contain filter drop-shadow-lg"
                  />
                ) : (
                  <Gift className="w-12 h-12 text-slate-600" />
                )}
              </div>

              <div className="space-y-2 text-center sm:text-left">
                <div className="text-xs font-bold text-amber-400 tracking-wider uppercase">
                  {champion.brand}
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">{champion.name}</h3>
                <p className="text-xs text-slate-300 italic">«{champion.dominantVibe}»</p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                  <span className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300">
                    Верх: {champion.pyramid.top.slice(0, 2).join(', ')}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300">
                    База: {champion.pyramid.base.slice(0, 2).join(', ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Why this is a flawless gift */}
            <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 text-xs space-y-1 mt-4">
              <div className="font-bold text-amber-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Обоснование калибровки:
              </div>
              <p className="text-slate-300 leading-relaxed">
                Идеально резонирует с ролью «{recipientObj?.label}» и стилем гардероба. Аромат создает
                дистанцию уважения без снобизма и транслирует невербальную уверенность.
              </p>
            </div>

            {/* Retail Actions */}
            <div className="mt-6 pt-5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={giftWrap}
                  onChange={(e) => setGiftWrap(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-0"
                />
                <span>Фирменная подарочная упаковка (+590 ₽)</span>
              </label>

              <button
                onClick={() => onToggleShelfId(champion.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition cursor-pointer"
              >
                {userShelfIds.includes(champion.id) ? '✓ На вашей полке' : '+ Добавить на полку'}
              </button>
            </div>
          </div>

          {/* Postcard Generator (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-amber-300">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Готовый текст для открытки
                </div>
                <button
                  onClick={handleCopyPostcard}
                  className="flex items-center gap-1 text-[11px] font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg transition cursor-pointer"
                >
                  {copiedPostcard ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      Скопировано!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Копировать
                    </>
                  )}
                </button>
              </div>

              {/* Handcrafted Postcard Preview */}
              <div className="bg-[#0e1320] border border-amber-500/20 p-5 rounded-2xl font-serif text-sm leading-relaxed text-amber-100/90 shadow-inner italic relative my-3">
                <span className="text-3xl text-amber-400/30 absolute top-2 left-2 select-none">“</span>
                <p className="relative z-10 pl-3">{postcardText}</p>
                <span className="text-3xl text-amber-400/30 absolute bottom-0 right-2 select-none">”</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Вложите эту открытку внутрь пакета — это придаст подарку глубокий смысл и покажет ваше внимание к деталям.
              </p>
            </div>

            {/* Alternative Backup Option */}
            {alternative && (
              <div className="mt-6 pt-5 border-t border-slate-800">
                <div className="text-[11px] font-bold uppercase text-slate-400 mb-2">
                  Запасной контрастный вариант:
                </div>
                <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-3">
                    {altImg && (
                      <img
                        src={altImg}
                        alt={alternative.name}
                        className="w-9 h-9 rounded-lg object-contain bg-slate-900 border border-slate-800"
                      />
                    )}
                    <div>
                      <div className="text-[10px] font-bold text-amber-400">{alternative.brand}</div>
                      <div className="text-xs font-semibold text-white">{alternative.name}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => onToggleShelfId(alternative.id)}
                    className="text-[11px] font-bold text-slate-300 hover:text-white px-2 py-1 bg-slate-800 rounded-lg cursor-pointer"
                  >
                    + Полка
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
