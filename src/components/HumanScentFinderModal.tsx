import React, { useState, useMemo } from 'react';
import {
  X,
  Sparkles,
  Shirt,
  Car,
  Coffee,
  Trees,
  Waves,
  Flame,
  BookOpen,
  Wine,
  Rocket,
  ArrowRight,
  Plus,
  Check,
  Search,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  HeartHandshake,
  Layers,
  Crown
} from 'lucide-react';
import { AnyanovCoordinates, HumanVibeArchetype, HumanReferenceScent } from '../types';
import { HUMAN_VIBE_ARCHETYPES, HUMAN_REFERENCE_SCENTS, HUMAN_QUICK_TAGS } from '../data/humanScents';
import { PERFUME_DATABASE } from '../data/fragrances';

interface HumanScentFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCoords: (coords: AnyanovCoordinates) => void;
  ownedShelfIds: string[];
  onToggleShelfId: (perfumeId: string) => void;
}

type TabMode = 'vibes' | 'references' | 'impression';

export const HumanScentFinderModal: React.FC<HumanScentFinderModalProps> = ({
  isOpen,
  onClose,
  onApplyCoords,
  ownedShelfIds,
  onToggleShelfId,
}) => {
  const [activeTab, setActiveTab] = useState<TabMode>('vibes');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedArchetypeId, setSelectedArchetypeId] = useState<string>('clean-shirt');
  const [selectedRefId, setSelectedRefId] = useState<string>('ref-sauvage');

  // Фильтрация архетипов по тегу и поиску
  const filteredArchetypes = useMemo(() => {
    let list = HUMAN_VIBE_ARCHETYPES;
    if (selectedTag !== 'all') {
      list = list.filter((item) => item.id === selectedTag);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q) ||
          item.shortTag.toLowerCase().includes(q) ||
          item.metaphors.some((m) => m.toLowerCase().includes(q)) ||
          item.humanExplanation.toLowerCase().includes(q)
      );
    }
    return list;
  }, [selectedTag, searchQuery]);

  // Выбранный архетип
  const activeArchetype = useMemo(() => {
    return (
      HUMAN_VIBE_ARCHETYPES.find((a) => a.id === selectedArchetypeId) ||
      HUMAN_VIBE_ARCHETYPES[0]
    );
  }, [selectedArchetypeId]);

  // Флакон из базы под выбранный архетип
  const matchedPerfume = useMemo(() => {
    return PERFUME_DATABASE.find((p) => p.id === activeArchetype.targetPerfumeId);
  }, [activeArchetype]);

  // Выбранный референс
  const activeRef = useMemo(() => {
    return (
      HUMAN_REFERENCE_SCENTS.find((r) => r.id === selectedRefId) ||
      HUMAN_REFERENCE_SCENTS[0]
    );
  }, [selectedRefId]);

  const matchedRefPerfume = useMemo(() => {
    return PERFUME_DATABASE.find((p) => p.id === activeRef.targetPerfumeId);
  }, [activeRef]);

  if (!isOpen) return null;

  const isPerfumeOwned = (id: string) => ownedShelfIds.includes(id);

  const handleApplyArchetype = (archetype: HumanVibeArchetype) => {
    onApplyCoords(archetype.recommendedCoords);
    onClose();
  };

  const handleApplyReference = (ref: HumanReferenceScent) => {
    const perfume = PERFUME_DATABASE.find((p) => p.id === ref.targetPerfumeId);
    if (perfume) {
      onApplyCoords({
        socialX: perfume.xCoord,
        thermoY: perfume.yCoord,
        formalIndex: 2,
        temperatureC: 20,
      });
      onClose();
    }
  };

  // Рендер иконки по ключу
  const renderIcon = (key: string, className = 'w-5 h-5') => {
    switch (key) {
      case 'shirt':
        return <Shirt className={className} />;
      case 'car':
        return <Car className={className} />;
      case 'coffee':
        return <Coffee className={className} />;
      case 'forest':
        return <Trees className={className} />;
      case 'sea':
        return <Waves className={className} />;
      case 'flame':
        return <Flame className={className} />;
      case 'book':
        return <Wine className={className} />;
      case 'drink':
        return <ShieldCheck className={className} />;
      case 'future':
        return <Rocket className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-5xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Top Glow Decor */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-amber-500 to-rose-500" />

        {/* 1. Header */}
        <div className="flex items-start justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80 shrink-0">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-amber-500 p-0.5 shadow-lg shadow-cyan-500/20 shrink-0 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-amber-400">
                <HeartHandshake className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                  Человеческий подбор аромата
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    Human Vibe & Scent Finder
                  </span>
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Забудьте про заумную химию и ноты вроде «пышной гвоздики» или «гальбанума». 
                Выбирайте аромат так, как его чувствуют в реальной жизни: по бытовым ассоциациям, уютным воспоминаниям и атмосфере.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer shrink-0"
            title="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Navigation Mode Tabs */}
        <div className="flex items-center gap-2 px-4 sm:px-6 py-2.5 bg-slate-950/50 border-b border-slate-800 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('vibes')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'vibes'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>1. Атмосфера и ассоциации</span>
          </button>

          <button
            onClick={() => setActiveTab('references')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'references'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-black shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>2. Мой знакомый парфюм</span>
          </button>

          <button
            onClick={() => setActiveTab('impression')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'impression'
                ? 'bg-gradient-to-r from-rose-500 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>3. Какое впечатление произвести?</span>
          </button>
        </div>

        {/* 3. Main Content Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: VIBES & METAPHORS */}
          {activeTab === 'vibes' && (
            <div className="space-y-5">
              {/* Quick Tags & Search Bar */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Поиск по запаху: сорочка, кофе, кожа, мох, цитрус..."
                    className="w-full bg-slate-950/70 border border-slate-700/80 focus:border-cyan-500 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Tags */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {HUMAN_QUICK_TAGS.slice(0, 5).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTag(t.id)}
                      className={`text-[11px] font-medium px-2.5 py-1 rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                        selectedTag === t.id
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                          : 'bg-slate-950/50 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid: Left Cards of Vibes, Right Detail Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* Archetype Selector Cards */}
                <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredArchetypes.map((archetype) => {
                    const isSelected = selectedArchetypeId === archetype.id;
                    const perfume = PERFUME_DATABASE.find((p) => p.id === archetype.targetPerfumeId);
                    const isOwned = perfume ? isPerfumeOwned(perfume.id) : false;

                    return (
                      <div
                        key={archetype.id}
                        onClick={() => setSelectedArchetypeId(archetype.id)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between gap-2.5 text-left group ${
                          isSelected
                            ? 'bg-slate-800/90 border-cyan-500/80 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/40'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center bg-gradient-to-br ${archetype.colorTheme} text-white shadow-md`}
                          >
                            {renderIcon(archetype.iconKey, 'w-4 h-4')}
                          </div>
                          {isOwned && (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                              <Check className="w-2.5 h-2.5" /> На полке
                            </span>
                          )}
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                            {archetype.title}
                          </h4>
                          <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                            {archetype.subtitle}
                          </p>
                        </div>

                        {/* Metaphor pills */}
                        <div className="flex flex-wrap gap-1">
                          {archetype.metaphors.slice(0, 2).map((m, idx) => (
                            <span
                              key={idx}
                              className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60"
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Right: Detailed Breakdown & Match Card */}
                <div className="lg:col-span-6 bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4 sticky top-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${activeArchetype.badgeColor}`}>
                        {activeArchetype.shortTag}
                      </span>
                      <span className="text-[11px] text-slate-500">Синергия Системы Аньянова</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      {activeArchetype.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {activeArchetype.subtitle}
                    </p>
                  </div>

                  {/* Metaphors full list */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                      Что вы и окружающие будете чувствовать:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeArchetype.metaphors.map((m, idx) => (
                        <span
                          key={idx}
                          className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-900 text-slate-200 border border-slate-700/80 flex items-center gap-1.5"
                        >
                          <Sparkles className="w-3 h-3 text-cyan-400" />
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Human Explanation Box */}
                  <div className="bg-gradient-to-br from-slate-900 to-slate-900/60 border border-cyan-500/30 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Перевод с парфюмерного на человеческий:</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {activeArchetype.humanExplanation}
                    </p>
                  </div>

                  {/* Matched Perfume Box */}
                  {matchedPerfume && (
                    <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-3.5 flex items-center justify-between gap-3">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">
                          Канонический эталон системы:
                        </span>
                        <div className="font-bold text-sm text-white flex items-center gap-1.5">
                          {matchedPerfume.name}
                          <span className="text-xs text-slate-400 font-normal">({matchedPerfume.brand})</span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-1">
                          {matchedPerfume.dominantVibe}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <button
                          onClick={() => onToggleShelfId(matchedPerfume.id)}
                          className={`text-xs px-2.5 py-1 rounded-lg border font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                            isPerfumeOwned(matchedPerfume.id)
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/40'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-600'
                          }`}
                        >
                          {isPerfumeOwned(matchedPerfume.id) ? (
                            <>
                              <Check className="w-3 h-3" /> На полке
                            </>
                          ) : (
                            <>
                              <Plus className="w-3 h-3" /> В полку
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Wardrobe Synergy */}
                  <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-3">
                    <span className="font-semibold text-slate-300">Сочетание с гардеробом: </span>
                    {activeArchetype.fabricSynergy}
                  </div>

                  {/* Action Button: Apply to system */}
                  <button
                    onClick={() => handleApplyArchetype(activeArchetype)}
                    className="w-full bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
                  >
                    <span>Применить в систему и примерить на манекене</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: POPULAR REFERENCES */}
          {activeTab === 'references' && (
            <div className="space-y-5">
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
                <Crown className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-amber-300">
                    «Я знаю, что мне когда-то нравилось, но не знаю, как это называется по нотам»
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Если у вас был Sauvage, Bleu de Chanel, Aventus или Baccarat Rouge — выберите его ниже. 
                    Система Аньянова мгновенно разложит его на гардеробную синергию и подберет идеальное продолжение стиля.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {HUMAN_REFERENCE_SCENTS.map((ref) => {
                  const isSelected = selectedRefId === ref.id;
                  const perfume = PERFUME_DATABASE.find((p) => p.id === ref.targetPerfumeId);
                  const isOwned = perfume ? isPerfumeOwned(perfume.id) : false;

                  return (
                    <div
                      key={ref.id}
                      onClick={() => setSelectedRefId(ref.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-3 text-left ${
                        isSelected
                          ? 'bg-slate-800/90 border-amber-500 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/40'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-mono text-slate-400">{ref.popularBrand}</span>
                          {isOwned && (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                              <Check className="w-2.5 h-2.5" /> Есть на полке
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-white">{ref.popularName}</h4>
                        <p className="text-xs text-slate-300 leading-relaxed">{ref.userVibeSummary}</p>
                      </div>

                      <div className="bg-slate-900/80 rounded-lg p-2.5 text-[11px] text-slate-400 border border-slate-800">
                        {ref.explanation}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApplyReference(ref);
                        }}
                        className="w-full bg-slate-900 hover:bg-amber-500 hover:text-black text-slate-200 font-semibold text-xs py-2 px-3 rounded-lg border border-slate-700 hover:border-amber-400 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Примерить дуэт</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: DESIRED IMPRESSION / CONTEXT */}
          {activeTab === 'impression' && (
            <div className="space-y-5">
              <div className="max-w-xl mx-auto text-center space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Какое главное впечатление вы хотите произвести сегодня?
                </h3>
                <p className="text-xs text-slate-400">
                  Парфюм работает как невербальный сигнал дистанции и авторитета
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
                {/* 1. Статус и дистанция */}
                <div
                  onClick={() => {
                    const item = HUMAN_VIBE_ARCHETYPES.find((a) => a.id === 'barbershop-razor')!;
                    handleApplyArchetype(item);
                  }}
                  className="p-5 rounded-2xl border border-slate-800 hover:border-slate-600 bg-slate-950/70 hover:bg-slate-800/50 transition-all cursor-pointer space-y-3 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-200 border border-slate-700">
                    <ShieldCheck className="w-5 h-5 text-slate-300" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                      «Держите дистанцию, здесь командую я»
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Для жестких переговоров, руководства и формального протокола. Холодный металл, мох, строгая сорочка.
                    </p>
                  </div>
                  <span className="text-xs text-cyan-400 font-semibold flex items-center gap-1">
                    Выбрать Platinum Égoïste <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>

                {/* 2. Соблазн и тепло */}
                <div
                  onClick={() => {
                    const item = HUMAN_VIBE_ARCHETYPES.find((a) => a.id === 'fireplace-cigar')!;
                    handleApplyArchetype(item);
                  }}
                  className="p-5 rounded-2xl border border-slate-800 hover:border-rose-500/50 bg-slate-950/70 hover:bg-slate-800/50 transition-all cursor-pointer space-y-3 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-rose-950/40 flex items-center justify-center text-rose-400 border border-rose-500/30">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors">
                      «Хочу согревать, притягивать и нравиться»
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Для вечерних свиданий, ресторанов и камерных встреч. Пряный табак, ваниль, мягкий кашемир.
                    </p>
                  </div>
                  <span className="text-xs text-rose-400 font-semibold flex items-center gap-1">
                    Выбрать Tobacco Vanille <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>

                {/* 3. Свежесть и бодрость */}
                <div
                  onClick={() => {
                    const item = HUMAN_VIBE_ARCHETYPES.find((a) => a.id === 'sea-breeze')!;
                    handleApplyArchetype(item);
                  }}
                  className="p-5 rounded-2xl border border-slate-800 hover:border-sky-500/50 bg-slate-950/70 hover:bg-slate-800/50 transition-all cursor-pointer space-y-3 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-sky-950/40 flex items-center justify-center text-sky-400 border border-sky-500/30">
                    <Waves className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-sky-400 transition-colors">
                      «Легкость, бодрость и свежесть на весь день»
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Для летней жары, спорта, прогулок и встреч с друзьями. Морской бриз, ледяной цитрус, белый лен.
                    </p>
                  </div>
                  <span className="text-xs text-sky-400 font-semibold flex items-center gap-1">
                    Выбрать Acqua di Giò <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>

                {/* 4. Чистота и порядок */}
                <div
                  onClick={() => {
                    const item = HUMAN_VIBE_ARCHETYPES.find((a) => a.id === 'clean-shirt')!;
                    handleApplyArchetype(item);
                  }}
                  className="p-5 rounded-2xl border border-slate-800 hover:border-cyan-500/50 bg-slate-950/70 hover:bg-slate-800/50 transition-all cursor-pointer space-y-3 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-cyan-950/40 flex items-center justify-center text-cyan-400 border border-cyan-500/30">
                    <Shirt className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                      «Стерильная чистота, фокус и порядок»
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Для офиса на каждый день, собеседований и аналитики. Выглаженная сорочка, дорогое мыло.
                    </p>
                  </div>
                  <span className="text-xs text-cyan-400 font-semibold flex items-center gap-1">
                    Выбрать Prada L\'Homme <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4. Footer */}
        <div className="p-4 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">
              Система Аньянова: автоматический перевод бытовых ассоциаций в 8D-сольфеджио стиля
            </span>
            <span className="sm:hidden">8D-сольфеджио стиля</span>
          </div>

          <button
            onClick={onClose}
            className="text-xs px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
