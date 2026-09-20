import React from 'react';
import { X, Sparkles, Check, ShieldCheck, Compass, Sliders } from 'lucide-react';

interface ManifestoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManifestoModal: React.FC<ManifestoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col gap-6 text-slate-200">
        {/* Glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center p-0.5 shadow-lg">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                МАНИФЕСТ СИСТЕМЫ АНЬЯНОВА
              </h2>
              <p className="text-xs text-amber-400 font-mono">
                Философия элегантности без ошибок и лишних усилий
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Manifesto Core Quote */}
        <div className="p-5 bg-gradient-to-br from-amber-500/10 via-slate-950 to-indigo-500/10 rounded-2xl border border-amber-500/30 text-slate-100 font-medium leading-relaxed italic text-sm sm:text-base">
          «Каждый хочет выглядеть стильно, не тратя на это часы и не сомневаясь в выборе. Система Аньянова берет эту задачу на себя: она делает подбор образа легким, интуитивным и на 100% безошибочным.»
        </div>

        {/* Social Engineering Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-sky-950/50 via-slate-950 to-indigo-950/50 border border-sky-500/30 flex flex-col gap-2.5 shadow-lg">
          <div className="flex items-center gap-2 text-sky-400 font-mono font-bold text-xs uppercase tracking-wider">
            <Compass className="w-4 h-4 text-amber-400" />
            Прикладная социальная инженерия стиля
          </div>
          <p className="text-amber-100 text-sm sm:text-base font-semibold leading-relaxed">
            «Система Аньянова — прикладная социальная инженерия стиля: точная калибровка внутреннего состояния человека (Настроения) и его проекции в социуме (Власти).»
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1 pt-2.5 border-t border-slate-800 text-xs text-slate-400">
            <div className="space-y-1">
              <span className="text-sky-300 font-bold font-mono text-[11px] block uppercase">
                ▲ Верх: Отношение к себе (Настроение)
              </span>
              <p className="leading-relaxed text-[11px]">
                Внутренний контур. Калибровка ясности, тонуса и эмоционального состояния через контакт тканей с телом и быстродействующие летучие молекулы.
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-indigo-300 font-bold font-mono text-[11px] block uppercase">
                ▼ Низ: Отношение к обществу (Власть)
              </span>
              <p className="leading-relaxed text-[11px]">
                Внешний контур. Невербальное управление социальным полем: монументальный статус лидера либо магнетическая мягкая власть соблазна.
              </p>
            </div>
          </div>
        </div>

        {/* The Mystery of Heart Notes & Olfactory Coordinates */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-950 to-pink-500/10 border border-amber-500/40 flex flex-col gap-2.5 shadow-lg">
          <div className="flex items-center gap-2 text-amber-400 font-mono font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Тайна нот сердца: Почему они так называются?
          </div>
          <p className="text-slate-100 text-sm font-semibold leading-relaxed">
            «Верх привлекает внимание. База оставляет память во времени. А Сердце решает, кто подойдёт ближе.»
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1 pt-2.5 border-t border-slate-800 text-xs text-slate-300">
            <div className="space-y-1">
              <span className="text-sky-300 font-bold font-mono text-[11px] block uppercase">
                ▲/▼ Вертикаль Y: Физика испарения
              </span>
              <p className="leading-relaxed text-[11px] text-slate-400">
                Верхние ноты (+Y) дают импульс и полет (летучесть, озон, цитрус), а База (–Y) служит монументальным якорем (смолы, уд, кожа, мох).
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-pink-300 font-bold font-mono text-[11px] block uppercase">
                ◄/► Горизонталь X: Дистанция сердца
              </span>
              <p className="leading-relaxed text-[11px] text-slate-400">
                Ноты сердца — это не просто «середина хронометража». Это эмоциональное ядро: суверенный щит личных границ (ирис, лаванда, ветивер: –X) либо теплое сокращение дистанции (пряности, сахар, табак: +X).
              </p>
            </div>
          </div>
        </div>

        {/* Principles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
            <div className="flex items-center gap-2 text-sky-400 font-bold font-mono uppercase text-[11px]">
              <Sliders className="w-4 h-4" />
              1. Простота управления
            </div>
            <p className="text-slate-400 leading-relaxed">
              Никаких долгих раздумий перед гардеробом. Пара движений слайдерами — и образ готов.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono uppercase text-[11px]">
              <ShieldCheck className="w-4 h-4" />
              2. Гарантия отсутствия ошибок
            </div>
            <p className="text-slate-400 leading-relaxed">
              Компилятор строго выверяет соответствие слоев L1-L4, формальности и температуры.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
            <div className="flex items-center gap-2 text-indigo-400 font-bold font-mono uppercase text-[11px]">
              <Sparkles className="w-4 h-4" />
              3. Полный синергетический дуэт
            </div>
            <p className="text-slate-400 leading-relaxed">
              Одежда без запаха нема, а запах без одежды случаен. Система синхронизирует ткань и шлейф.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400 font-bold font-mono uppercase text-[11px]">
              <Compass className="w-4 h-4" />
              4. Физика матрицы координат
            </div>
            <p className="text-slate-400 leading-relaxed">
              Ортогональные оси Власти, Соблазна, Времени и Термодинамики калибруют человека в пространстве.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 pt-4 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>Система Аньянова • 2026</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition cursor-pointer shadow-lg shadow-amber-500/20"
          >
            Понятно, к системе
          </button>
        </div>
      </div>
    </div>
  );
};
