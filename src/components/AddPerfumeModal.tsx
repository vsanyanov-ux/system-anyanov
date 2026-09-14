import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  X,
  Sparkles,
  Plus,
  Check,
  Compass,
  Wind,
  Shirt,
  ShieldCheck,
  Flame,
  Key,
  Loader2,
  ExternalLink,
  Bot,
  AlertCircle,
  Settings,
  Globe,
  ClipboardList,
} from 'lucide-react';
import { PerfumeItem, PerfumeNotePyramid } from '../types';
import {
  findKnownFragrance,
  calculatePerfumeCoordinatesFromNotes,
  buildPerfumeFromInput,
  KNOWN_FRAGRANCES_CATALOG,
} from '../engine/perfumeIntelligence';
import {
  fetchPerfumeNotesWithGemini,
  parseFragranticaNotesText,
  getStoredGeminiApiKey,
  saveStoredGeminiApiKey,
} from '../engine/geminiService';

interface AddPerfumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPerfume: (perfume: PerfumeItem) => void;
}

const POPULAR_BRANDS = [
  'Lattafa',
  'Tom Ford',
  'Creed',
  'BDK Parfums',
  'Xerjoff',
  'Maison Francis Kurkdjian',
  'Marc-Antoine Barrois',
  'Byredo',
  'Le Labo',
  'Kilian',
  'Chanel',
  'Dior',
  'Hermes',
];

export const AddPerfumeModal: React.FC<AddPerfumeModalProps> = ({
  isOpen,
  onClose,
  onAddPerfume,
}) => {
  const [brand, setBrand] = useState('Lattafa');
  const [name, setName] = useState('Musamam White Intense');
  const [customTop, setCustomTop] = useState<string[]>([]);
  const [customHeart, setCustomHeart] = useState<string[]>([]);
  const [customBase, setCustomBase] = useState<string[]>([]);
  const [dominantVibe, setDominantVibe] = useState('');
  const [bestOccasion, setBestOccasion] = useState('');
  const [diffusion, setDiffusion] = useState<'Интимная' | 'Умеренная' | 'Шлейфовая' | 'Ударная'>('Шлейфовая');
  const [isManualNotesEdited, setIsManualNotesEdited] = useState(false);

  // Gemini API состояние
  const [geminiApiKey, setGeminiApiKey] = useState(() => getStoredGeminiApiKey());
  const [showKeyInput, setShowKeyInput] = useState(() => !getStoredGeminiApiKey());
  const [isGeminiLoading, setIsGeminiLoading] = useState(false);
  const [geminiError, setGeminiError] = useState<string | null>(null);
  const [isVerifiedByGemini, setIsVerifiedByGemini] = useState(false);

  const [newNoteInput, setNewNoteInput] = useState('');
  const [activeTierToAdd, setActiveTierToAdd] = useState<'top' | 'heart' | 'base'>('heart');

  // Быстрая вставка текста нот со страницы Fragrantica
  const [showFragranticaPaste, setShowFragranticaPaste] = useState(false);
  const [fragranticaPasteText, setFragranticaPasteText] = useState('');
  const [pasteError, setPasteError] = useState<string | null>(null);

  const handleApplyFragranticaPaste = () => {
    if (!fragranticaPasteText.trim()) return;
    const parsed = parseFragranticaNotesText(fragranticaPasteText);
    if (!parsed || (parsed.top.length === 0 && parsed.heart.length === 0 && parsed.base.length === 0)) {
      setPasteError(
        'Не удалось распознать ноты. Скопируйте блок нот со страницы Fragrantica (напр. "Верхние ноты: ... Средние ноты: ... Базовые ноты: ...")'
      );
      return;
    }
    if (parsed.top.length > 0) setCustomTop(parsed.top);
    if (parsed.heart.length > 0) setCustomHeart(parsed.heart);
    if (parsed.base.length > 0) setCustomBase(parsed.base);
    setIsManualNotesEdited(true);
    setIsVerifiedByGemini(true);
    setPasteError(null);
    setShowFragranticaPaste(false);
    setFragranticaPasteText('');
  };

  // Поиск совпадений в предзагруженном каталоге
  const knownMatch = useMemo(() => {
    return findKnownFragrance(brand, name);
  }, [brand, name]);

  // Заполнение нот из каталога по умолчанию
  useEffect(() => {
    if (!name.trim()) return;

    if (knownMatch && !isManualNotesEdited && !isVerifiedByGemini) {
      setCustomTop(knownMatch.pyramid.top);
      setCustomHeart(knownMatch.pyramid.heart);
      setCustomBase(knownMatch.pyramid.base);
      setDominantVibe(knownMatch.dominantVibe || '');
      setBestOccasion(knownMatch.bestOccasion || '');
      if (knownMatch.diffusion) setDiffusion(knownMatch.diffusion);
    }
  }, [brand, name, knownMatch, isManualNotesEdited, isVerifiedByGemini]);

  // Текущая пирамида
  const currentPyramid: PerfumeNotePyramid = useMemo(() => ({
    top: customTop,
    heart: customHeart,
    base: customBase,
  }), [customTop, customHeart, customBase]);

  // Расчет координат в реальном времени
  const calculatedMeta = useMemo(() => {
    return calculatePerfumeCoordinatesFromNotes(currentPyramid, dominantVibe);
  }, [currentPyramid, dominantVibe]);

  // Запрос нот через Google Gemini API
  const handleFetchWithGemini = async () => {
    if (!name.trim()) return;

    if (!geminiApiKey.trim()) {
      setShowKeyInput(true);
      setGeminiError('Пожалуйста, введите ваш Google Gemini API ключ для выполнения запроса.');
      return;
    }

    setIsGeminiLoading(true);
    setGeminiError(null);

    try {
      const result = await fetchPerfumeNotesWithGemini(brand, name, geminiApiKey);

      if (result.normalizedBrand) setBrand(result.normalizedBrand);
      if (result.normalizedName) setName(result.normalizedName);

      setCustomTop(result.top);
      setCustomHeart(result.heart);
      setCustomBase(result.base);
      setDominantVibe(result.dominantVibe);
      setBestOccasion(result.bestOccasion);
      setDiffusion(result.diffusion);
      setIsVerifiedByGemini(true);
      setIsManualNotesEdited(false);
    } catch (err: any) {
      console.error('Ошибка Gemini:', err);
      setGeminiError(err?.message || 'Не удалось получить данные от Gemini.');
    } finally {
      setIsGeminiLoading(false);
    }
  };

  const handleSaveApiKey = () => {
    saveStoredGeminiApiKey(geminiApiKey);
    setShowKeyInput(false);
    setGeminiError(null);
  };

  if (!isOpen) return null;

  const handleAddNote = () => {
    const trimmed = newNoteInput.trim();
    if (!trimmed) return;
    setIsManualNotesEdited(true);

    if (activeTierToAdd === 'top' && !customTop.includes(trimmed)) {
      setCustomTop([...customTop, trimmed]);
    } else if (activeTierToAdd === 'heart' && !customHeart.includes(trimmed)) {
      setCustomHeart([...customHeart, trimmed]);
    } else if (activeTierToAdd === 'base' && !customBase.includes(trimmed)) {
      setCustomBase([...customBase, trimmed]);
    }
    setNewNoteInput('');
  };

  const handleRemoveNote = (tier: 'top' | 'heart' | 'base', noteToRemove: string) => {
    setIsManualNotesEdited(true);
    if (tier === 'top') {
      setCustomTop(customTop.filter((n) => n !== noteToRemove));
    } else if (tier === 'heart') {
      setCustomHeart(customHeart.filter((n) => n !== noteToRemove));
    } else {
      setCustomBase(customBase.filter((n) => n !== noteToRemove));
    }
  };

  const handleSave = () => {
    if (!name.trim()) return;

    const cleanSlug = `${brand}-${name}`
      .toLowerCase()
      .replace(/[^a-z0-9а-яё]+/gi, '-')
      .replace(/^-|-$/g, '');

    const finalPerfume: PerfumeItem = {
      id: `custom-${cleanSlug || 'perfume'}-${Date.now()}`,
      name: name.trim(),
      brand: brand.trim(),
      xCoord: calculatedMeta.xCoord,
      yCoord: calculatedMeta.yCoord,
      diffusion: diffusion || calculatedMeta.diffusion,
      dominantVibe: dominantVibe || calculatedMeta.dominantVibe,
      bestOccasion: bestOccasion || calculatedMeta.bestOccasion,
      whyFitsOutfit: calculatedMeta.whyFitsOutfit,
      colorTheme: calculatedMeta.colorTheme,
      pyramid: currentPyramid,
    };

    onAddPerfume(finalPerfume);
    onClose();
  };

  // Быстрые подсказки для выбранного бренда
  const brandFragranceSuggestions = KNOWN_FRAGRANCES_CATALOG.filter(
    (k) => !brand || k.brand.toLowerCase().includes(brand.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Top Glow Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-indigo-500 to-sky-400" />

        {/* 1. Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-amber-500/20 border border-indigo-500/40 flex items-center justify-center text-amber-400 shadow-inner">
              <Bot className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">
                  Подтянуть ноты через Gemini
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  AI Fragrance Engine
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Google Gemini находит аутентичную пирамиду нот, а Система Аньянова вычисляет координаты.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowKeyInput(!showKeyInput)}
              className="p-2 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
              title="Настройки Gemini API Key"
            >
              <Key className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. Form Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 custom-scrollbar">
          {/* Gemini API Key Panel (Collapsible) */}
          {showKeyInput && (
            <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/40 space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
                  <Key className="w-3.5 h-3.5" />
                  <span>Google Gemini API Key</span>
                </div>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 underline underline-offset-2"
                >
                  <span>Получить бесплатный ключ в AI Studio</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  placeholder="Вставьте AIzaSy..."
                  className="flex-1 bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500 font-mono"
                />
                <button
                  type="button"
                  onClick={handleSaveApiKey}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-colors"
                >
                  Сохранить
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Ключ сохраняется локально в вашем браузере (`localStorage`) и используется для точного парсинга нот.
              </p>
            </div>
          )}

          {/* Error Banner */}
          {geminiError && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 flex items-start gap-2 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">
                <strong>Ошибка запроса к Gemini:</strong> {geminiError}
              </div>
            </div>
          )}

          {/* Brand & Name Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
                Бренд
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => {
                  setBrand(e.target.value);
                  setIsVerifiedByGemini(false);
                }}
                placeholder="Lattafa, Tom Ford, Creed..."
                className="w-full bg-slate-800/80 border border-slate-700 focus:border-amber-500 text-white rounded-xl px-3.5 py-2 text-sm focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
                Название флакона
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setIsVerifiedByGemini(false);
                }}
                placeholder="Musamam White Intense..."
                className="w-full bg-slate-800/80 border border-slate-700 focus:border-amber-500 text-white rounded-xl px-3.5 py-2 text-sm focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Action: Fetch with Gemini / Live Fragrantica Search & Fast Paste */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleFetchWithGemini}
                disabled={isGeminiLoading || !name.trim()}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-amber-500 hover:from-indigo-500 hover:to-amber-400 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isGeminiLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Поиск карточки Fragrantica в реальном времени...</span>
                  </>
                ) : (
                  <>
                    <Globe className="w-4 h-4 text-sky-300" />
                    <span>Найти ноты на Fragrantica (Gemini Live Search)</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowFragranticaPaste(!showFragranticaPaste)}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  showFragranticaPaste
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
                title="Вставить скопированный текст со страницы Fragrantica"
              >
                <ClipboardList className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Вставить текст</span>
              </button>
            </div>

            {/* Быстрая вставка текста из Fragrantica */}
            {showFragranticaPaste && (
              <div className="p-3 bg-slate-950/90 border border-amber-500/40 rounded-xl space-y-2 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <ClipboardList className="w-3.5 h-3.5" />
                    Мгновенный импорт нот из Fragrantica
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowFragranticaPaste(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Скопируйте текст пирамиды со страницы аромата на Fragrantica (RU или EN) и вставьте сюда:
                </p>
                <textarea
                  value={fragranticaPasteText}
                  onChange={(e) => {
                    setFragranticaPasteText(e.target.value);
                    setPasteError(null);
                  }}
                  placeholder="Верхние ноты: Шафран, Итальянский мандарин, Лаванда; Средние ноты: Кедр, Герань, Amberwood; Базовые ноты: Акигалавуд, Ладан, Лабданум"
                  rows={2}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 text-white text-xs rounded-lg p-2 focus:outline-none resize-none font-mono"
                />
                {pasteError && (
                  <p className="text-[11px] text-rose-400">{pasteError}</p>
                )}
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleApplyFragranticaPaste}
                    disabled={!fragranticaPasteText.trim()}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    Применить ноты
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Brand Badges */}
          <div>
            <div className="text-[11px] font-mono text-slate-400 mb-1.5 flex items-center gap-1">
              <span>Быстрый выбор бренда:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_BRANDS.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => {
                    setBrand(b);
                    setIsVerifiedByGemini(false);
                  }}
                  className={`text-xs px-2.5 py-0.5 rounded-lg border transition-all ${
                    brand.toLowerCase() === b.toLowerCase()
                      ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 font-bold'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Brand Catalog Suggestions */}
          {brandFragranceSuggestions.length > 0 && brand.length >= 2 && (
            <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/80">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                Популярные релизы дома:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {brandFragranceSuggestions.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => {
                      setBrand(item.brand);
                      setName(item.name);
                      setIsVerifiedByGemini(false);
                    }}
                    className="text-xs px-2 py-0.5 rounded bg-slate-800 hover:bg-amber-500/20 text-slate-200 hover:text-amber-300 border border-slate-700 hover:border-amber-500/40 transition-colors"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Status Indicator */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isVerifiedByGemini ? (
                <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              ) : knownMatch ? (
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              )}
              <div>
                <div className="text-xs font-bold text-white">
                  {isVerifiedByGemini
                    ? '✨ Пирамида верифицирована Google Gemini'
                    : knownMatch
                    ? 'Каталожная формула верифицирована'
                    : 'Нажмите «Запросить у Gemini» для точной пирамиды'}
                </div>
                <div className="text-[11px] text-slate-400">
                  {isVerifiedByGemini
                    ? 'Ноты и аккорды извлечены из глобальной ольфакторной базы Gemini'
                    : 'Пирамида готова к расчету координат Аньянова'}
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                {calculatedMeta.quadrant}
              </span>
            </div>
          </div>

          {/* Realtime Calculated Coordinates Card */}
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-900 border border-slate-700/80 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/50 pb-2">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-slate-200">
                  {calculatedMeta.quadrantName}
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="px-2 py-0.5 rounded bg-slate-950/70 border border-slate-700 text-amber-300">
                  X: {calculatedMeta.xCoord > 0 ? `+${calculatedMeta.xCoord}` : calculatedMeta.xCoord}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-950/70 border border-slate-700 text-sky-300">
                  Y: {calculatedMeta.yCoord > 0 ? `+${calculatedMeta.yCoord}` : calculatedMeta.yCoord}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-start gap-1.5 text-slate-300">
                <Wind className="w-3.5 h-3.5 text-sky-400 mt-0.5 shrink-0" />
                <span>
                  <strong>Диффузия:</strong> {diffusion || calculatedMeta.diffusion}
                </span>
              </div>
              <div className="flex items-start gap-1.5 text-slate-300">
                <Shirt className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                <span>
                  <strong>Ткани:</strong> {calculatedMeta.resonantFabrics.slice(0, 3).join(', ')}
                </span>
              </div>
            </div>

            {dominantVibe && (
              <div className="text-xs text-slate-400 bg-slate-950/40 p-2 rounded-lg border border-slate-800/80">
                <strong className="text-slate-300">Вайб:</strong> {dominantVibe}
              </div>
            )}
          </div>

          {/* Interactive Note Pyramid Display */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                Пирамида нот ({customTop.length + customHeart.length + customBase.length} нот):
              </label>
              {isManualNotesEdited && (
                <span className="text-[10px] text-amber-400 font-mono">
                  (изменено вручную)
                </span>
              )}
            </div>

            {/* Top Notes */}
            <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80">
              <span className="text-[11px] font-mono text-amber-400/80 block mb-1">
                ВЕРХНИЕ НОТЫ (TOP):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {customTop.length === 0 && (
                  <span className="text-xs text-slate-500 italic">Нажмите «Запросить у Gemini»</span>
                )}
                {customTop.map((note) => (
                  <span
                    key={note}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300"
                  >
                    {note}
                    <button
                      type="button"
                      onClick={() => handleRemoveNote('top', note)}
                      className="hover:text-rose-400 transition-colors ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Heart Notes */}
            <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80">
              <span className="text-[11px] font-mono text-rose-400/80 block mb-1">
                НОТЫ СЕРДЦА (HEART):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {customHeart.length === 0 && (
                  <span className="text-xs text-slate-500 italic">Нажмите «Запросить у Gemini»</span>
                )}
                {customHeart.map((note) => (
                  <span
                    key={note}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300"
                  >
                    {note}
                    <button
                      type="button"
                      onClick={() => handleRemoveNote('heart', note)}
                      className="hover:text-rose-400 transition-colors ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Base Notes */}
            <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80">
              <span className="text-[11px] font-mono text-sky-400/80 block mb-1">
                БАЗОВЫЕ НОТЫ (BASE):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {customBase.length === 0 && (
                  <span className="text-xs text-slate-500 italic">Нажмите «Запросить у Gemini»</span>
                )}
                {customBase.map((note) => (
                  <span
                    key={note}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-300"
                  >
                    {note}
                    <button
                      type="button"
                      onClick={() => handleRemoveNote('base', note)}
                      className="hover:text-rose-400 transition-colors ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Add Custom Note Input */}
            <div className="flex items-center gap-2 pt-1">
              <select
                value={activeTierToAdd}
                onChange={(e) => setActiveTierToAdd(e.target.value as any)}
                className="bg-slate-800 border border-slate-700 text-xs text-slate-300 rounded-lg px-2 py-1.5 focus:outline-none"
              >
                <option value="top">Верх</option>
                <option value="heart">Сердце</option>
                <option value="base">База</option>
              </select>
              <input
                type="text"
                value={newNoteInput}
                onChange={(e) => setNewNoteInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddNote();
                  }
                }}
                placeholder="Добавить ноту (напр. Сандал)..."
                className="flex-1 bg-slate-800/80 border border-slate-700 text-xs text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={handleAddNote}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-amber-400" />
                Добавить
              </button>
            </div>
          </div>
        </div>

        {/* 3. Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white rounded-xl transition-colors"
          >
            Отмена
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!name.trim()}
            className="px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            Добавить на полку гардероба
          </button>
        </div>
      </div>
    </div>
  );
};
