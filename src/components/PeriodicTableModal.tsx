import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  Atom, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  Filter, 
  Info,
  Wind,
  ShieldAlert,
  Flame,
  Heart,
  Shirt,
  Crown,
  ArrowRight,
  RotateCcw,
  Check,
  CheckCheck
} from 'lucide-react';
import { PERIODIC_NOTE_ELEMENTS } from '../data/periodicNotes';
import { PeriodicNoteElement, AnyanovCoordinates } from '../types';
import { 
  PERIODIC_WARDROBE_ELEMENTS_21, 
  PeriodicWardrobeElement, 
  GOLDEN_MIRROR_PAIRS_21, 
  GOLDEN_PERFUMES_21 
} from '../data/golden21';
import { getPerfumeBottleImage } from '../data/fragrances';

interface PeriodicTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCoords?: (coords: AnyanovCoordinates) => void;
}

type PeriodFilter = 'ALL' | 'I' | 'II' | 'III' | 'IV';
type FabricFilter = 'ALL' | 'Шерсть' | 'Кашемир' | 'Хлопок' | 'Лен' | 'Кожа' | 'Твид' | 'Деним';

export const PeriodicTableModal: React.FC<PeriodicTableModalProps> = ({ isOpen, onClose, onApplyCoords }) => {
  const [modalTab, setModalTab] = useState<'clothing' | 'perfume'>('clothing');

  // --- Состояние для Периодической Таблицы Ноты (Ольфакторный двигатель) ---
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('ALL');
  const [fabricFilter, setFabricFilter] = useState<FabricFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNote, setSelectedNote] = useState<PeriodicNoteElement | null>(null);

  // --- Состояние для Периодической Таблицы Одежды (21 Элемент) ---
  const [selectedClothingLayer, setSelectedClothingLayer] = useState<'ALL' | 'L1' | 'L2' | 'L3' | 'L4'>('ALL');
  const [selectedClothingGroup, setSelectedClothingGroup] = useState<'ALL' | 'I' | 'II' | 'III' | 'IV' | 'V'>('ALL');
  const [clothingSearch, setClothingSearch] = useState('');
  const [inspectedElement, setInspectedElement] = useState<PeriodicWardrobeElement | null>(
    PERIODIC_WARDROBE_ELEMENTS_21.find((e) => e.symbol === 'Bz') || PERIODIC_WARDROBE_ELEMENTS_21[0]
  );

  // Синтезатор гармонического лука (Слоты L1 - L4)
  const [synthesizerSlots, setSynthesizerSlots] = useState<{
    L1: PeriodicWardrobeElement | null;
    L2: PeriodicWardrobeElement | null;
    L3: PeriodicWardrobeElement | null;
    L4: PeriodicWardrobeElement | null;
  }>({
    L1: PERIODIC_WARDROBE_ELEMENTS_21.find((e) => e.symbol === 'Lf') || null,
    L2: PERIODIC_WARDROBE_ELEMENTS_21.find((e) => e.symbol === 'Ch') || null,
    L3: PERIODIC_WARDROBE_ELEMENTS_21.find((e) => e.symbol === 'Of') || null,
    L4: PERIODIC_WARDROBE_ELEMENTS_21.find((e) => e.symbol === 'Bz') || null,
  });
  const [isCopiedFormula, setIsCopiedFormula] = useState(false);

  // Выбранные элементы синтезатора в виде массива
  const activeSynthesizerList = useMemo(() => {
    return [
      synthesizerSlots.L4,
      synthesizerSlots.L3,
      synthesizerSlots.L2,
      synthesizerSlots.L1,
    ].filter(Boolean) as PeriodicWardrobeElement[];
  }, [synthesizerSlots]);

  // Расчет метрик формулы (Средняя формальность, валентность, консенсус)
  const formulaMetrics = useMemo(() => {
    if (activeSynthesizerList.length === 0) {
      return {
        avgFormal: 0,
        deltaFormal: 0,
        consensusStatus: 'Пустой набор',
        statusColor: 'text-slate-400 border-slate-700 bg-slate-900',
        formulaString: '—',
      };
    }
    const sum = activeSynthesizerList.reduce((acc, el) => acc + el.formalIndex, 0);
    const avg = Number((sum / activeSynthesizerList.length).toFixed(2));
    const indices = activeSynthesizerList.map((el) => el.formalIndex);
    const delta = Number((Math.max(...indices) - Math.min(...indices)).toFixed(1));
    const formulaStr = activeSynthesizerList.map((el) => el.symbol).join(' + ');

    let status = '✨ Идеальный сарториальный консенсус (высокая синергия)';
    let statusColor = 'text-emerald-300 border-emerald-500/40 bg-emerald-950/40';
    if (delta > 1.4) {
      status = '⚡ Экстремальный контраст (высокий риск диссонанса)';
      statusColor = 'text-rose-300 border-rose-500/40 bg-rose-950/40';
    } else if (delta > 0.8) {
      status = '⚖️ Сбалансированная эклектика (стильный акцент)';
      statusColor = 'text-amber-300 border-amber-500/40 bg-amber-950/40';
    }

    return {
      avgFormal: avg,
      deltaFormal: delta,
      consensusStatus: status,
      statusColor,
      formulaString: formulaStr,
    };
  }, [activeSynthesizerList]);

  // Поиск ближайшего эталонного парного наряда из 21 канонических пар
  const matchedCanonicalPair = useMemo(() => {
    let bestPair = GOLDEN_MIRROR_PAIRS_21[0]; // «Синий Камертон» default
    let bestDistance = 999;
    const currentAvg = formulaMetrics.avgFormal;

    GOLDEN_MIRROR_PAIRS_21.forEach((pair) => {
      let pairFormality = 2.0;
      if (pair.quadrantCode === 'NE_EASE') pairFormality = 1.2;
      if (pair.quadrantCode === 'NW_FOCUS') pairFormality = 2.2;
      if (pair.quadrantCode === 'SW_POWER') pairFormality = 2.8;
      if (pair.quadrantCode === 'SE_SEDUCTION') pairFormality = 1.9;
      if (pair.periodicRole === 'south') pairFormality = 2.9;
      if (pair.periodicRole === 'north') pairFormality = 1.0;
      if (pair.periodicRole === 'center') pairFormality = 2.0;

      const diff = Math.abs(currentAvg - pairFormality);
      if (diff < bestDistance) {
        bestDistance = diff;
        bestPair = pair;
      }
    });

    return bestPair;
  }, [formulaMetrics.avgFormal]);

  const matchedPerfume = useMemo(() => {
    return GOLDEN_PERFUMES_21.find((p) => p.id === matchedCanonicalPair.perfumeId);
  }, [matchedCanonicalPair]);

  const handleApplySynthesizedFormula = () => {
    if (onApplyCoords) {
      onApplyCoords(matchedCanonicalPair.idealCoords);
      setIsCopiedFormula(true);
      setTimeout(() => {
        setIsCopiedFormula(false);
        onClose();
      }, 700);
    }
  };

  const handlePresetOutfit = (l4Sym?: string, l3Sym?: string, l2Sym?: string, l1Sym?: string) => {
    setSynthesizerSlots({
      L4: l4Sym ? PERIODIC_WARDROBE_ELEMENTS_21.find((e) => e.symbol === l4Sym) || null : null,
      L3: l3Sym ? PERIODIC_WARDROBE_ELEMENTS_21.find((e) => e.symbol === l3Sym) || null : null,
      L2: l2Sym ? PERIODIC_WARDROBE_ELEMENTS_21.find((e) => e.symbol === l2Sym) || null : null,
      L1: l1Sym ? PERIODIC_WARDROBE_ELEMENTS_21.find((e) => e.symbol === l1Sym) || null : null,
    });
  };

  const handleToggleSynthesizerSlot = (element: PeriodicWardrobeElement) => {
    setSynthesizerSlots((prev) => {
      const current = prev[element.layer];
      if (current?.symbol === element.symbol) {
        // Убираем из слота
        return { ...prev, [element.layer]: null };
      }
      // Устанавливаем в соответствующий слой
      return { ...prev, [element.layer]: element };
    });
  };

  // Фильтрация элементов периодической таблицы одежды
  const filteredClothingElements = useMemo(() => {
    return PERIODIC_WARDROBE_ELEMENTS_21.filter((el) => {
      if (selectedClothingLayer !== 'ALL' && el.layer !== selectedClothingLayer) return false;
      if (selectedClothingGroup !== 'ALL' && el.group !== selectedClothingGroup) return false;
      if (clothingSearch.trim()) {
        const q = clothingSearch.toLowerCase();
        const inName = el.name.toLowerCase().includes(q);
        const inSym = el.symbol.toLowerCase().includes(q);
        const inFabric = el.fabric.toLowerCase().includes(q);
        const inVibe = el.vibe.toLowerCase().includes(q);
        const inGroup = el.groupLabel.toLowerCase().includes(q);
        if (!inName && !inSym && !inFabric && !inVibe && !inGroup) return false;
      }
      return true;
    });
  }, [selectedClothingLayer, selectedClothingGroup, clothingSearch]);

  // Фильтрация элементов периодической таблицы нот
  const filteredNotes = useMemo(() => {
    return PERIODIC_NOTE_ELEMENTS.filter((note) => {
      if (periodFilter !== 'ALL' && note.period !== periodFilter) return false;
      if (fabricFilter !== 'ALL') {
        const matchesFabric = note.resonantFabrics.some((f) => 
          f.toLowerCase().includes(fabricFilter.toLowerCase())
        );
        if (!matchesFabric) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inName = note.name.toLowerCase().includes(q);
        const inSymbol = note.symbol.toLowerCase().includes(q);
        const inCategory = note.category.toLowerCase().includes(q);
        const inVibe = note.vibeDescription.toLowerCase().includes(q);
        const inFabrics = note.resonantFabrics.some((f) => f.toLowerCase().includes(q));
        if (!inName && !inSymbol && !inCategory && !inVibe && !inFabrics) return false;
      }
      return true;
    });
  }, [periodFilter, fabricFilter, searchQuery]);

  if (!isOpen) return null;

  const getPeriodColor = (period: 'I' | 'II' | 'III' | 'IV') => {
    switch (period) {
      case 'I':
        return {
          border: 'border-cyan-500/40 hover:border-cyan-400',
          bg: 'bg-cyan-950/20 hover:bg-cyan-950/40',
          badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
          text: 'text-cyan-400',
        };
      case 'II':
        return {
          border: 'border-sky-500/40 hover:border-sky-400',
          bg: 'bg-sky-950/20 hover:bg-sky-950/40',
          badge: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
          text: 'text-sky-400',
        };
      case 'III':
        return {
          border: 'border-amber-500/40 hover:border-amber-400',
          bg: 'bg-amber-950/20 hover:bg-amber-950/40',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          text: 'text-amber-400',
        };
      case 'IV':
        return {
          border: 'border-rose-500/40 hover:border-rose-400',
          bg: 'bg-rose-950/20 hover:bg-rose-950/40',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
          text: 'text-rose-400',
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-7xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800/80 bg-slate-900/60 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            {/* Tabs Switcher */}
            <div className="inline-flex items-center p-1 bg-slate-950 rounded-2xl border border-slate-800 shadow-inner">
              <button
                onClick={() => setModalTab('clothing')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  modalTab === 'clothing'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-md font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Shirt className="w-3.5 h-3.5" />
                <span>Периодическая таблица одежды (21 элемент)</span>
              </button>

              <button
                onClick={() => setModalTab('perfume')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  modalTab === 'perfume'
                    ? 'bg-indigo-600 text-white shadow-md font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Atom className="w-3.5 h-3.5 text-indigo-300" />
                <span>Ольфакторная система нот</span>
              </button>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
                {modalTab === 'clothing' ? (
                  <>
                    <span>Таблица Элементов Гардероба: 4 Периода × 5 Групп</span>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold">
                      21 Канонический Элемент
                    </span>
                  </>
                ) : (
                  <>
                    <span>Периодическая система ольфакторных нот</span>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-mono font-bold">
                      Двигатель нот
                    </span>
                  </>
                )}
              </h2>
              <p className="text-xs text-slate-400 max-w-3xl leading-relaxed mt-1">
                {modalTab === 'clothing' ? (
                  <span>
                    21 элемент капсулы разложен по <strong className="text-slate-200">4 периодам (слои L1–L4)</strong> и <strong className="text-slate-200">5 группам формальности (I–V)</strong>. Выбирайте элементы для синтеза молекулы лука: система вычисляет средний индекс формальности <strong className="text-amber-400">FI_avg</strong>, сарториальную валентность <strong className="text-sky-400">ΔFI</strong> и находит канонический резонансный наряд и аромат!
                  </span>
                ) : (
                  <span>
                    <strong className="text-slate-200">Координаты (X, Y) — это ЦЕЛЬ</strong> (социальный контекст и силуэт образа).{' '}
                    <strong className="text-indigo-300">Периодическая таблица нот — это ДВИГАТЕЛЬ</strong> (подбор конкретных ольфакторных молекул под ткани L1–L4 без фальшивых диссонансов).
                  </span>
                )}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors cursor-pointer shrink-0 self-start"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: ПЕРИОДИЧЕСКАЯ ТАБЛИЦА ОДЕЖДЫ (21 ЭЛЕМЕНТ) */}
        {/* ========================================================================= */}
        {modalTab === 'clothing' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            
            {/* 1. FILTERS & SEARCH BAR */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={clothingSearch}
                  onChange={(e) => setClothingSearch(e.target.value)}
                  placeholder="Поиск элемента одежды (блейзер, оксфорд, деним, чинос)..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
                {clothingSearch && (
                  <button
                    onClick={() => setClothingSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Layer Filters (Periods) */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0 scrollbar-none text-xs">
                <span className="text-slate-500 font-semibold text-[11px] mr-1 hidden sm:inline">Слой:</span>
                {(['ALL', 'L4', 'L3', 'L2', 'L1'] as const).map((layer) => (
                  <button
                    key={layer}
                    onClick={() => setSelectedClothingLayer(layer)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                      selectedClothingLayer === layer
                        ? 'bg-amber-500 text-black shadow-sm'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {layer === 'ALL' ? 'Все слои (21)' : layer}
                  </button>
                ))}
              </div>

              {/* Formality Group Filters */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0 scrollbar-none text-xs">
                <span className="text-slate-500 font-semibold text-[11px] mr-1 hidden sm:inline">Группа:</span>
                {(['ALL', 'I', 'II', 'III', 'IV', 'V'] as const).map((grp) => (
                  <button
                    key={grp}
                    onClick={() => setSelectedClothingGroup(grp)}
                    className={`px-2 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                      selectedClothingGroup === grp
                        ? 'bg-sky-500 text-black shadow-sm'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {grp === 'ALL' ? 'Все группы' : `Гр. ${grp}`}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. THE PERIODIC TABLE GRID (4 PERIODS x 5 GROUPS) */}
            <div className="space-y-4">
              {(['L4', 'L3', 'L2', 'L1'] as const).map((periodLayer) => {
                const layerElements = filteredClothingElements.filter((el) => el.layer === periodLayer);
                if (selectedClothingLayer !== 'ALL' && selectedClothingLayer !== periodLayer) return null;

                const periodTitles = {
                  L4: { title: 'ПЕРИОД 4: СЛОЙ L4 • ВЕРХНИЙ СЛОЙ (ПИДЖАКИ, БЛЕЙЗЕРЫ, КУРТКИ, СМОКИНГ)', color: 'text-amber-400' },
                  L3: { title: 'ПЕРИОД 3: СЛОЙ L3 • ТОРС (СОРОЧКИ, ПОЛО, ВЯЗАНЫЙ ТРИКОТАЖ, ФУТБОЛКА)', color: 'text-sky-400' },
                  L2: { title: 'ПЕРИОД 2: СЛОЙ L2 • НОГИ (КОСТЮМНЫЕ БРЮКИ, ЧИНОСЫ, ДЕНИМ, СЛАКСЫ)', color: 'text-emerald-400' },
                  L1: { title: 'ПЕРИОД 1: СЛОЙ L1 • ОБУВЬ (ОКСФОРДЫ, ЛОФЕРЫ, КЕДЫ)', color: 'text-indigo-400' },
                };

                return (
                  <div key={periodLayer} className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono font-bold">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${periodTitles[periodLayer].color.replace('text', 'bg')}`} />
                        <span className={periodTitles[periodLayer].color}>{periodTitles[periodLayer].title}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {layerElements.length} элементов
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {layerElements.map((el) => {
                        const isInspected = inspectedElement?.number === el.number;
                        const isInSynthesizer = synthesizerSlots[el.layer]?.number === el.number;

                        return (
                          <div
                            key={el.number}
                            onClick={() => setInspectedElement(el)}
                            className={`p-3 rounded-2xl border transition-all cursor-pointer relative group flex flex-col justify-between gap-2 select-none ${
                              isInSynthesizer
                                ? 'bg-amber-500/15 border-amber-400 ring-2 ring-amber-400/40 shadow-lg'
                                : isInspected
                                ? 'bg-slate-900 border-sky-400 ring-1 ring-sky-400/50 shadow'
                                : 'bg-slate-950/80 border-slate-800 hover:border-slate-600'
                            }`}
                          >
                            {/* Top info */}
                            <div className="flex items-start justify-between">
                              <span className="text-[10px] font-mono font-bold text-slate-500">
                                #{el.number}
                              </span>
                              <div className="flex items-center gap-1">
                                {el.isCore && (
                                  <span className="text-[9px] px-1 rounded bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30" title="Ядро гардероба (Центральный баланс)">
                                    ⭐ ЯДРО
                                  </span>
                                )}
                                <span className="text-[9px] font-mono px-1 rounded bg-slate-900 text-slate-400 border border-slate-800">
                                  Гр.{el.group}
                                </span>
                              </div>
                            </div>

                            {/* Symbol & Name */}
                            <div className="my-1">
                              <div className="text-2xl font-black font-mono tracking-tight text-white group-hover:text-amber-300 transition-colors">
                                {el.symbol}
                              </div>
                              <div className="text-xs font-bold text-slate-200 truncate mt-0.5" title={el.name}>
                                {el.name}
                              </div>
                              <div className="text-[10px] text-slate-400 truncate font-mono">
                                {el.fabric}
                              </div>
                            </div>

                            {/* Bottom row: FI & Color swatch */}
                            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <div
                                  className="w-2.5 h-2.5 rounded-full border border-white/20"
                                  style={{ backgroundColor: el.color }}
                                  title={el.colorName}
                                />
                                <span className="text-[9px] font-mono text-slate-400">{el.colorName}</span>
                              </div>
                              <span className="text-[10px] font-mono font-bold text-amber-400">
                                FI {el.formalIndex}
                              </span>
                            </div>

                            {/* Add/Remove to Synthesizer button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleSynthesizerSlot(el);
                              }}
                              className={`w-full py-1 rounded-lg text-[10px] font-bold font-mono transition-all cursor-pointer flex items-center justify-center gap-1 ${
                                isInSynthesizer
                                  ? 'bg-amber-500 text-black shadow-sm font-black'
                                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                              }`}
                            >
                              {isInSynthesizer ? (
                                <>
                                  <Check className="w-3 h-3" />
                                  <span>В наряде</span>
                                </>
                              ) : (
                                <span>+ В формулу</span>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 3. OUTFIT SYNTHESIZER PANEL (МОЛЕКУЛЯРНЫЙ СИНТЕЗАТОР НАРЯДА) */}
            <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-slate-950 via-amber-950/20 to-slate-950 border border-amber-500/40 shadow-2xl space-y-5">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/30 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>ЛАБОРАТОРИЯ СИНТЕЗА МОЛЕКУЛЫ ЛУКА</span>
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      Формула: {formulaMetrics.formulaString}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Сарториальная Валентность и Резонанс
                  </h3>
                </div>

                {/* Preset quick buttons */}
                <div className="flex items-center flex-wrap gap-1.5">
                  <span className="text-[10px] font-mono text-slate-400 mr-1">Эталоны:</span>
                  <button
                    onClick={() => handlePresetOutfit('Bz', 'Of', 'Ch', 'Lf')}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-slate-900 text-amber-300 border border-amber-500/30 hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    «Камертон»
                  </button>
                  <button
                    onClick={() => handlePresetOutfit('Jk', 'Ts', 'Sl', 'Sn')}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-slate-900 text-cyan-300 border border-cyan-500/30 hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    «Белый Хлопок»
                  </button>
                  <button
                    onClick={() => handlePresetOutfit('Sj', 'Sh', 'Wp', 'Ox')}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-slate-900 text-slate-200 border border-slate-700 hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    «Протокол»
                  </button>
                  <button
                    onClick={() => handlePresetOutfit('Sc', 'Sh', 'Wc', 'Ox')}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-slate-900 text-rose-300 border border-rose-500/30 hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    «Гранд-Опера»
                  </button>
                </div>
              </div>

              {/* Slots Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {(['L4', 'L3', 'L2', 'L1'] as const).map((layer) => {
                  const slotItem = synthesizerSlots[layer];
                  const layerLabels = {
                    L4: 'L4 Верхний слой',
                    L3: 'L3 Торс / Рубашка',
                    L2: 'L2 Ноги / Брюки',
                    L1: 'L1 Обувь / База'
                  };

                  return (
                    <div
                      key={layer}
                      className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-2 ${
                        slotItem
                          ? 'bg-slate-900 border-amber-500/50 shadow-sm'
                          : 'bg-slate-950/60 border-dashed border-slate-800 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-slate-400 font-bold">{layerLabels[layer]}</span>
                        {slotItem && (
                          <button
                            onClick={() => setSynthesizerSlots((p) => ({ ...p, [layer]: null }))}
                            className="text-slate-500 hover:text-rose-400 cursor-pointer text-xs"
                            title="Очистить слот"
                          >
                            ✕
                          </button>
                        )}
                      </div>

                      {slotItem ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-black font-mono text-amber-400">
                              {slotItem.symbol}
                            </span>
                            <span className="text-xs font-bold text-white truncate">
                              {slotItem.name}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                            <span>{slotItem.fabric}</span>
                            <span className="text-amber-300 font-bold">FI {slotItem.formalIndex}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="py-2 text-center text-xs italic text-slate-500">
                          (Кликните элемент {layer} в таблице выше)
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Metrics & Resonant Output Match */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {/* Metric 1: Avg Formality & Delta */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">
                    Математика формулы лука:
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">FI_avg (Формальность):</span>
                      <span className="text-base font-black text-amber-400">{formulaMetrics.avgFormal}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">ΔFI (Валентность):</span>
                      <span className="text-base font-black text-sky-400">{formulaMetrics.deltaFormal}</span>
                    </div>
                  </div>
                  <div className={`p-2 rounded-xl border text-[11px] font-mono font-bold ${formulaMetrics.statusColor}`}>
                    {formulaMetrics.consensusStatus}
                  </div>
                </div>

                {/* Metric 2: Resonant Canonical Outfit */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">
                    Резонансный канонический наряд (1 из 21):
                  </div>
                  <div className="text-lg font-black text-white flex items-center gap-2">
                    <span className="text-amber-400">{matchedCanonicalPair.outfitName}</span>
                  </div>
                  <div className="text-xs text-slate-300 italic">
                    «{matchedCanonicalPair.badge}» • {matchedCanonicalPair.quadrantName}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    Координаты: [{matchedCanonicalPair.idealCoords.socialX}, {matchedCanonicalPair.idealCoords.thermoY}]
                  </div>
                </div>

                {/* Metric 3: Resonant Perfume Anchor & Apply Button */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">
                      Парный аромат-камертон:
                    </div>
                    {matchedPerfume && (
                      <div className="flex items-center gap-3">
                        {(() => {
                          const img = getPerfumeBottleImage(matchedPerfume);
                          if (!img) return null;
                          return (
                            <div className="w-9 h-12 shrink-0 bg-slate-900 rounded border border-slate-800 p-0.5 flex items-center justify-center">
                              <img src={img} alt={matchedPerfume.name} className="max-h-full max-w-full object-contain" />
                            </div>
                          );
                        })()}
                        <div className="min-w-0">
                          <div className="text-xs font-black text-white truncate">{matchedPerfume.name}</div>
                          <div className="text-[10px] font-mono text-amber-400/90 uppercase truncate">{matchedPerfume.brand}</div>
                          <div className="text-[10px] text-slate-400 truncate italic">«{matchedPerfume.dominantVibe}»</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {onApplyCoords && (
                    <button
                      onClick={handleApplySynthesizedFormula}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md ${
                        isCopiedFormula
                          ? 'bg-emerald-500 text-black shadow-emerald-500/20'
                          : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold shadow-amber-500/20'
                      }`}
                    >
                      {isCopiedFormula ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Применено в калькуляторе!</span>
                        </>
                      ) : (
                        <>
                          <span>Применить координаты и примерить</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

            </div>

            {/* 4. ELEMENT INSPECTOR CARD */}
            {inspectedElement && (
              <div className="p-5 rounded-3xl bg-slate-900/90 border border-sky-500/40 shadow-xl space-y-4 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-sky-500/50 flex flex-col items-center justify-center font-mono">
                      <span className="text-[10px] text-slate-500 font-bold">#{inspectedElement.number}</span>
                      <span className="text-2xl font-black text-sky-400">{inspectedElement.symbol}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-lg font-black text-white">{inspectedElement.name}</h4>
                        <span className="text-xs px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800 font-mono font-bold">
                          Слой {inspectedElement.layer}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700 font-mono font-bold">
                          Группа {inspectedElement.group} ({inspectedElement.groupLabel})
                        </span>
                        {inspectedElement.isCore && (
                          <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono font-bold">
                            ⭐ Ядро Баланса
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1 font-mono">
                        Ткань: <strong className="text-slate-200">{inspectedElement.fabric}</strong> • Цвет: <strong className="text-slate-200">{inspectedElement.colorName}</strong> • Индекс формальности: <strong className="text-amber-400">FI {inspectedElement.formalIndex}</strong>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleSynthesizerSlot(inspectedElement)}
                    className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-amber-500 hover:bg-amber-400 text-black transition-all cursor-pointer shadow-md self-start sm:self-center"
                  >
                    {synthesizerSlots[inspectedElement.layer]?.number === inspectedElement.number
                      ? '✓ Добавлен в формулу'
                      : '+ Добавить в формулу наряда'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                    <strong className="text-sky-400 font-mono block">Стилевой характер и вайб:</strong>
                    <p className="text-slate-300 leading-relaxed italic">
                      «{inspectedElement.vibe}»
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                    <strong className="text-amber-400 font-mono block">Канонические наряды с этим элементом:</strong>
                    <div className="flex flex-wrap gap-1.5">
                      {GOLDEN_MIRROR_PAIRS_21.filter((pair) => {
                        const s = pair.suggestedOutfit;
                        return s.l4Id?.includes(inspectedElement.symbol.toLowerCase()) ||
                               s.l3Id?.includes(inspectedElement.symbol.toLowerCase()) ||
                               s.l2Id?.includes(inspectedElement.symbol.toLowerCase()) ||
                               s.l1Id?.includes(inspectedElement.symbol.toLowerCase()) ||
                               // Matching by layer & name
                               (inspectedElement.layer === 'L4' && pair.outfitName.includes('Камертон') && inspectedElement.symbol === 'Bz') ||
                               (inspectedElement.layer === 'L3' && pair.outfitName.includes('Камертон') && inspectedElement.symbol === 'Of') ||
                               (inspectedElement.layer === 'L2' && pair.outfitName.includes('Камертон') && inspectedElement.symbol === 'Ch') ||
                               (inspectedElement.layer === 'L1' && pair.outfitName.includes('Камертон') && inspectedElement.symbol === 'Lf');
                      }).slice(0, 3).map((p, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 text-amber-300 border border-amber-500/30 text-[11px] font-mono">
                          {p.outfitName}
                        </span>
                      ))}
                      <span className="text-[11px] text-slate-400 font-mono self-center">и другие резонансные формулы</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: ПЕРИОДИЧЕСКАЯ СИСТЕМА НОТ (ОЛЬФАКТОРНЫЙ ДВИГАТЕЛЬ) */}
        {/* ========================================================================= */}
        {modalTab === 'perfume' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Filters Bar */}
            <div className="p-4 sm:p-5 border-b border-slate-800/60 bg-slate-950 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
              {/* Search Box */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск ноты (ветивер, уд, ирис, кашемир, лен)..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Period (Quadrant) Filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none text-xs">
                <span className="text-slate-500 font-semibold text-[11px] mr-1 hidden sm:inline">Период:</span>
                {(['ALL', 'I', 'II', 'III', 'IV'] as PeriodFilter[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriodFilter(p)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                      periodFilter === p
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {p === 'ALL' ? 'Все периоды' : `Период ${p}`}
                  </button>
                ))}
              </div>

              {/* Fabric Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none text-xs">
                <span className="text-slate-500 font-semibold text-[11px] mr-1 hidden sm:inline">Ткань:</span>
                {(['ALL', 'Шерсть', 'Кашемир', 'Хлопок', 'Лен', 'Кожа', 'Твид', 'Деним'] as FabricFilter[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFabricFilter(f)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      fabricFilter === f
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {f === 'ALL' ? 'Все ткани' : f}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Grid: Chemistry Element Cards */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                {filteredNotes.map((note) => {
                  const colors = getPeriodColor(note.period);
                  const isSelected = selectedNote?.id === note.id;

                  return (
                    <div
                      key={note.id}
                      onClick={() => setSelectedNote(note)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative group flex flex-col justify-between ${
                        colors.border
                      } ${colors.bg} ${
                        isSelected ? 'ring-2 ring-indigo-400 bg-slate-900 shadow-lg scale-[1.02]' : ''
                      }`}
                    >
                      {/* Top Bar: Symbol & Layer Affinity */}
                      <div className="flex items-start justify-between gap-1 mb-2">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-slate-400">
                            {note.period}-{note.subSector || 'E'}
                          </span>
                          <div className={`text-2xl font-black font-mono tracking-tight ${colors.text}`}>
                            {note.symbol}
                          </div>
                        </div>

                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-950/80 text-slate-300 border border-slate-800">
                          {note.layerAffinity}
                        </span>
                      </div>

                      {/* Name & Category */}
                      <div className="space-y-0.5 mb-2.5">
                        <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                          {note.name}
                        </h4>
                        <p className="text-[10px] text-slate-400 line-clamp-1">
                          {note.category}
                        </p>
                      </div>

                      {/* Coordinates & Resonant Fabric preview */}
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span>X: {note.distanceX > 0 ? `+${note.distanceX}` : note.distanceX}</span>
                        <span>Y: {note.thermoY > 0 ? `+${note.thermoY}` : note.thermoY}</span>
                      </div>

                      {/* Resonant Fabrics Badges */}
                      <div className="mt-2 flex flex-wrap gap-1">
                        {note.resonantFabrics.slice(0, 2).map((fabric, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] px-1.5 py-0.2 rounded bg-slate-900 text-slate-300 border border-slate-800"
                          >
                            {fabric}
                          </span>
                        ))}
                        {note.resonantFabrics.length > 2 && (
                          <span className="text-[9px] text-slate-500 font-mono">
                            +{note.resonantFabrics.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredNotes.length === 0 && (
                <div className="py-12 text-center text-slate-500 space-y-2">
                  <p className="text-sm font-semibold text-slate-400">
                    По заданным критериям ноты не найдены.
                  </p>
                  <button
                    onClick={() => {
                      setPeriodFilter('ALL');
                      setFabricFilter('ALL');
                      setSearchQuery('');
                    }}
                    className="text-xs text-indigo-400 hover:underline cursor-pointer"
                  >
                    Сбросить фильтры
                  </button>
                </div>
              )}

              {/* Selected Note Inspector Detail Card */}
              {selectedNote && (
                <div className="p-5 rounded-2xl bg-slate-900 border border-indigo-500/40 shadow-xl space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-950 border border-indigo-500/50 flex items-center justify-center font-mono font-black text-xl text-indigo-300">
                        {selectedNote.symbol}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-white">{selectedNote.name}</h3>
                          <span className="text-xs px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-mono">
                            Период {selectedNote.period} ({selectedNote.subSector})
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                            Слой {selectedNote.layerAffinity}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{selectedNote.category}</p>
                      </div>
                    </div>

                    <div className="text-right text-xs font-mono text-slate-400">
                      <div>Ось X (Дистанция): <span className="text-white font-bold">{selectedNote.distanceX}</span></div>
                      <div>Ось Y (Термодинамика): <span className="text-white font-bold">{selectedNote.thermoY}</span></div>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                    "{selectedNote.vibeDescription}"
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                      <strong className="text-emerald-400 block mb-1">Резонирующие ткани:</strong>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedNote.resonantFabrics.map((f, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-200 border border-emerald-800/60 text-[11px]">
                            ✓ {f}
                          </span>
                        ))}
                      </div>
                    </div>

                    {selectedNote.clashFabrics && selectedNote.clashFabrics.length > 0 && (
                      <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30">
                        <strong className="text-rose-400 block mb-1">Семантический диссонанс (Clashes):</strong>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedNote.clashFabrics.map((f, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-rose-950/60 text-rose-200 border border-rose-800/60 text-[11px]">
                              ✕ {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Scalability Notice Box */}
              <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 flex items-start gap-3 text-xs text-slate-300 leading-relaxed">
                <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-0.5 font-semibold">
                    Принцип бесконечного расширения базы
                  </strong>
                  Периодическая таблица нот не ограничена текущим списком. Любой новый парфюмерный ингредиент, синтетический каптив или редкое эфирное масло регистрируется через функцию <code className="font-mono text-indigo-300 bg-slate-900 px-1.5 py-0.5 rounded border border-indigo-900">registerPeriodicNote()</code>, автоматически встраиваясь в расчеты гармонии с гардеробом.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
