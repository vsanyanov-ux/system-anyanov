import React, { useState, useMemo } from 'react';
import {
  Store,
  QrCode,
  Search,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Shirt,
  Volume2,
  Clock,
  Flame,
  Layers,
  ArrowRight,
  UserCheck,
} from 'lucide-react';
import { PERFUME_DATABASE, getPerfumeBottleImage } from '../data/fragrances';
import { PerfumeItem, AnyanovCoordinates } from '../types';
import { getQuadrantInfo } from '../engine/anyanovMatrix';

interface InStoreCopilotViewProps {
  onToggleShelfId: (id: string) => void;
  userShelfIds: string[];
  onApplyCoords: (coords: AnyanovCoordinates) => void;
  onSwitchTab: (tab: any) => void;
  onOpenShelfModal: () => void;
}

export const InStoreCopilotView: React.FC<InStoreCopilotViewProps> = ({
  onToggleShelfId,
  userShelfIds,
  onApplyCoords,
  onSwitchTab,
  onOpenShelfModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPerfumeId, setSelectedPerfumeId] = useState<string>('bleu-de-chanel-edp');
  const [roleMode, setRoleMode] = useState<'buyer' | 'consultant'>('buyer');

  // Найденный или выбранный флакон
  const activePerfume: PerfumeItem = useMemo(() => {
    return (
      PERFUME_DATABASE.find((p) => p.id === selectedPerfumeId) ||
      PERFUME_DATABASE[0]
    );
  }, [selectedPerfumeId]);

  // Фильтрация поиска по тестерам в зале
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return PERFUME_DATABASE.slice(0, 12);
    const q = searchQuery.toLowerCase().trim();
    return PERFUME_DATABASE.filter((p) => {
      return (
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.dominantVibe.toLowerCase().includes(q)
      );
    });
  }, [searchQuery]);

  const quadrant = getQuadrantInfo(activePerfume.xCoord, activePerfume.yCoord);
  const bottleImg = getPerfumeBottleImage(activePerfume);
  const isOwned = userShelfIds.includes(activePerfume.id);

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950/30 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold tracking-wide uppercase">
              <Store className="w-3.5 h-3.5" />
              In-Store Retail Co-Pilot
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Сканер тестера у полки в магазине
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Вы стоите перед полкой в бутике (Золотое Яблоко, ЦУМ, Molecule). Выберите тестер и получите
              мгновенный ольфакторный паспорт: с какими тканями носить, какой реальный шлейф и скрипт презентации.
            </p>
          </div>

          {/* Role Mode Switcher (Buyer vs Consultant) */}
          <div className="bg-slate-950 p-1.5 rounded-2xl border border-slate-800 flex items-center gap-1 self-start md:self-auto shrink-0">
            <button
              onClick={() => setRoleMode('buyer')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                roleMode === 'buyer'
                  ? 'bg-sky-500 text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              Я покупатель
            </button>
            <button
              onClick={() => setRoleMode('consultant')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                roleMode === 'consultant'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Планшет консультанта
            </button>
          </div>
        </div>

        {/* Quick Search / Scan Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Введите название тестера или бренд (Versace, Tom Ford, Chanel, Dior)..."
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-sky-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition"
            />
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-mono">
            <QrCode className="w-4 h-4 text-sky-400" />
            QR Ready
          </div>
        </div>
      </div>

      {/* Main 2-Column: Shelf Testers vs Active Scent Deep Passport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Quick Testers List (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-2 max-h-[700px] overflow-y-auto">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1 mb-2 flex items-center justify-between">
            <span>Тестеры на полке ({searchResults.length})</span>
            <span className="text-[10px] text-slate-500 font-normal">Клик для анализа</span>
          </div>

          {searchResults.map((perfume) => {
            const isCurrent = perfume.id === activePerfume.id;
            const pImg = getPerfumeBottleImage(perfume);
            const isPerfumeOwned = userShelfIds.includes(perfume.id);

            return (
              <div
                key={perfume.id}
                onClick={() => setSelectedPerfumeId(perfume.id)}
                className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center gap-3 ${
                  isCurrent
                    ? 'bg-sky-500/15 border-sky-500/50 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {pImg && (
                  <img
                    src={pImg}
                    alt={perfume.name}
                    className="w-9 h-9 rounded-lg object-contain bg-slate-900 border border-slate-800 p-0.5 shrink-0"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-bold text-sky-400 truncate">{perfume.brand}</div>
                  <div className="text-xs font-semibold text-white truncate">{perfume.name}</div>
                  <div className="text-[10px] text-slate-400 truncate">{perfume.dominantVibe}</div>
                </div>
                {isPerfumeOwned && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" title="На вашей полке" />
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column: 15-Second Olfactive Passport (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6">
          {/* Header Card */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-slate-800/80 pb-6">
            <div className="w-28 h-28 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center p-3 shrink-0 shadow-inner">
              {bottleImg ? (
                <img
                  src={bottleImg}
                  alt={activePerfume.name}
                  className="max-h-full object-contain filter drop-shadow-md"
                />
              ) : (
                <Store className="w-10 h-10 text-slate-600" />
              )}
            </div>

            <div className="space-y-2 text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                  {activePerfume.brand}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {quadrant.subtitle}
                </span>
              </div>
              <h3 className="text-2xl font-black text-white">{activePerfume.name}</h3>
              <p className="text-xs text-slate-300 italic">«{activePerfume.dominantVibe}»</p>

              <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <button
                  onClick={() => onToggleShelfId(activePerfume.id)}
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  {isOwned ? '✓ Уже на вашей полке' : '+ Добавить на полку'}
                </button>
                <button
                  onClick={() => {
                    onApplyCoords({
                      socialX: activePerfume.xCoord,
                      thermoY: activePerfume.yCoord,
                      formalIndex: 2,
                      temperatureC: 22,
                    });
                    onSwitchTab('concierge');
                  }}
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 transition cursor-pointer"
                >
                  Примерить комплект одежды
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* 3 Core Technical Dimension Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* 1. Fabric Pairing */}
            <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase">
                <Shirt className="w-4 h-4" />
                С чем носить (L1-L4)
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {quadrant.outfitDirection}
              </p>
            </div>

            {/* 2. Diffusion & Sillage */}
            <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase">
                <Volume2 className="w-4 h-4" />
                Диффузия и Шлейф
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Радиус шлейфа: {activePerfume.yCoord > 0 ? '1.5–2.0 м (воздушный, шлейфовый)' : '0.5–1.0 м (плотный кокон, интимный)'}. Стойкость 8–10 часов.
              </p>
            </div>

            {/* 3. Season & Chronotope */}
            <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase">
                <Clock className="w-4 h-4" />
                Сезон & Повод
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activePerfume.yCoord >= 0 ? 'Дневной свет, весна/лето, открытые пространства' : 'Вечер, осень/зима, теплые залы, деловой ужин'}.
              </p>
            </div>
          </div>

          {/* Role-Specific Block */}
          {roleMode === 'consultant' ? (
            /* Consultant Script / Cheat Sheet */
            <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Шпаргалка консультанта: Как презентовать гостю за 15 секунд
              </div>

              <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
                <div className="p-3 bg-slate-950/80 rounded-xl border border-amber-500/20">
                  <span className="text-amber-400 font-bold block mb-1">Фраза открытия (без штампов):</span>
                  «Обратите внимание: это не просто парфюм, это элемент жесткого/мягкого статуса. Он ложится на ткань как вторая строчка пиджака и звучит безупречно сдержанно».
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                    <span className="text-emerald-400 font-bold block mb-0.5">Кому идеально:</span>
                    Человеку, которому важно транслировать уверенность и профессиональный вес в переговорах.
                  </div>
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                    <span className="text-rose-400 font-bold block mb-0.5">Стоп-сигнал:</span>
                    Не наносить на пляжный лук или в спортзал — плотность молекул вызовет удушливый диссонанс.
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Buyer Truth Verification */
            <div className="bg-sky-950/20 border border-sky-500/30 rounded-2xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Честный вердикт системы (Без маркетинга)
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Этот флакон — {quadrant.primaryEnergy} Пирамида нот: верх ({activePerfume.pyramid.top.join(', ')}),
                сердце ({activePerfume.pyramid.heart.join(', ')}), база ({activePerfume.pyramid.base.join(', ')}).
                Если у вас на полке уже есть базовый цитрус, {activePerfume.name} расширит диапазон вашего стиля на 35%.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
