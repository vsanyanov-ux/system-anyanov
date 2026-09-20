import React from 'react';
import {
  Sparkles,
  LayoutGrid,
  ShieldAlert,
  Boxes,
  Gift,
  Store,
  Zap,
  SlidersHorizontal,
  Crown,
  Layers,
  Atom,
  HeartHandshake,
  Sun,
  Snowflake,
  BookOpen,
  ShieldCheck,
  X,
  Menu,
  Compass,
} from 'lucide-react';
import { AnyanovTab } from '../hooks/useAnyanovState';
import { AnyanovSeason } from '../types';

interface SidebarProps {
  activeTab: AnyanovTab;
  onTabChange: (tab: AnyanovTab) => void;
  shelfCount: number;
  onOpenShelf: () => void;
  onOpenPeriodicTable: () => void;
  onOpenHumanFinder: () => void;
  onOpenManifesto: () => void;
  season: AnyanovSeason;
  onToggleSeason: () => void;
  is21Mode: boolean;
  onToggle21Mode: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: AnyanovTab;
  label: string;
  sub: string;
  icon: React.ReactNode;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  shelfCount,
  onOpenShelf,
  onOpenPeriodicTable,
  onOpenHumanFinder,
  onOpenManifesto,
  season,
  onToggleSeason,
  is21Mode,
  onToggle21Mode,
  isOpenMobile,
  onCloseMobile,
}) => {
  const normalizedActiveTab = activeTab === 'public' ? 'concierge' : activeTab;

  const retailNavItems: NavItem[] = [
    {
      id: 'concierge',
      label: 'Консьерж Топ-2',
      sub: 'Лук + парфюм без паралича выбора',
      icon: <Sparkles className="w-4 h-4 text-amber-400" />,
      badge: 'Популярно',
    },
    {
      id: 'category',
      label: 'Витрина категории',
      sub: 'Каталог, бренды и примерка',
      icon: <LayoutGrid className="w-4 h-4 text-sky-400" />,
    },
    {
      id: 'gap-audit',
      label: 'Аудит гардероба (Gap)',
      sub: 'Детектор ольфакторных брешей',
      icon: <ShieldAlert className="w-4 h-4 text-rose-400" />,
      badge: 'Up-Sell',
    },
    {
      id: 'discovery-set',
      label: 'Discovery Set',
      sub: 'Сэмпл-бокс 4×2.5 мл + кэшбэк',
      icon: <Boxes className="w-4 h-4 text-indigo-400" />,
    },
    {
      id: 'gifting',
      label: 'Подарочный гид',
      sub: 'Социальный сканер + открытка',
      icon: <Gift className="w-4 h-4 text-rose-300" />,
    },
    {
      id: 'in-store',
      label: 'In-Store Ко-пилот',
      sub: 'Сканер тестера у полки в бутике',
      icon: <Store className="w-4 h-4 text-cyan-400" />,
      badge: 'B2B/B2C',
    },
  ];

  const engineeringNavItems: NavItem[] = [
    {
      id: 'simple',
      label: 'Суть 4 архетипов',
      sub: 'Каноническая импрессионика',
      icon: <Zap className="w-4 h-4 text-amber-300" />,
    },
    {
      id: 'brand-matrix',
      label: 'Матрица 1–2–5–9',
      sub: 'Бренды & Кросс-радар аналогов',
      icon: <Compass className="w-4 h-4 text-emerald-400" />,
      badge: 'Новинка',
    },
    {
      id: 'pro',
      label: 'Лаборатория Pro',
      sub: '2D координатная доска & слайдеры',
      icon: <SlidersHorizontal className="w-4 h-4 text-sky-300" />,
    },
    {
      id: 'benchmarks',
      label: 'Эталоны 21',
      sub: 'Золотой канон 21×21',
      icon: <Crown className="w-4 h-4 text-amber-400" />,
    },
  ];

  const handleSelectTab = (tab: AnyanovTab) => {
    onTabChange(tab);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#070B14] border-r border-slate-800/80 select-none">
      {/* 1. Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 p-0.5 shadow-lg shadow-amber-500/10 flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <span className="font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-indigo-300 text-lg">
                A
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold tracking-tight text-white text-sm">
                СИСТЕМА АНЬЯНОВА
              </h1>
              <span className="text-[9px] uppercase font-mono font-bold px-1.5 py-0.2 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                v2.9
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">
              Wardrobe OS + Fragrance Mirror
            </p>
          </div>
        </div>

        {/* Mobile Close button */}
        <button
          onClick={onCloseMobile}
          className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Scrollable Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
        {/* Section 1: Retail & Style Modes */}
        <div className="space-y-1">
          <div className="px-3 pb-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Режимы Ритейла & Стиля</span>
          </div>

          {retailNavItems.map((item) => {
            const isActive = normalizedActiveTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer group ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/10 border border-amber-500/40 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-900/80 hover:text-white border border-transparent'
                }`}
              >
                <div
                  className={`mt-0.5 p-1.5 rounded-lg shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'bg-amber-500/20' : 'bg-slate-900'
                  }`}
                >
                  {item.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-xs font-bold ${isActive ? 'text-amber-300' : 'text-slate-200'}`}>
                      {item.label}
                    </span>
                    {item.badge && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{item.sub}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Section 2: Style Engineering */}
        <div className="space-y-1">
          <div className="px-3 pb-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
            Инженерия & Лаборатория
          </div>

          {engineeringNavItems.map((item) => {
            const isActive = normalizedActiveTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer group ${
                  isActive
                    ? 'bg-slate-800/90 border border-slate-700 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-900/80 hover:text-white border border-transparent'
                }`}
              >
                <div
                  className={`mt-0.5 p-1.5 rounded-lg shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'bg-slate-700' : 'bg-slate-900'
                  }`}
                >
                  {item.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-200">{item.label}</div>
                  <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{item.sub}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Section 3: Modals & Fast Tools */}
        <div className="space-y-1">
          <div className="px-3 pb-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
            Инструменты & Сервисы
          </div>

          {/* Shelf Modal Button */}
          <button
            onClick={onOpenShelf}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-850 border border-slate-800 transition cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Моя полка</span>
            </div>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
              {shelfCount}
            </span>
          </button>

          {/* Periodic Table */}
          <button
            onClick={onOpenPeriodicTable}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-850 border border-slate-800 transition cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Atom className="w-3.5 h-3.5 text-indigo-400" />
              <span>Таблица нот</span>
            </div>
            <span className="text-[9px] text-slate-400 font-mono">Периоды</span>
          </button>

          {/* Human Scent Finder */}
          <button
            onClick={onOpenHumanFinder}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-cyan-300 hover:text-cyan-200 bg-cyan-950/20 hover:bg-cyan-950/40 border border-cyan-500/30 transition cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-3.5 h-3.5 text-cyan-400" />
              <span>«Как пахнет?»</span>
            </div>
            <span className="text-[9px] text-cyan-400 font-mono">Вайб</span>
          </button>
        </div>
      </div>

      {/* 3. Bottom Controls & Status Bar */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/80 space-y-2">
        {/* Season & Mode 21 Toggles */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onToggleSeason}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-[11px] font-semibold border transition cursor-pointer ${
              season === 'summer'
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/40'
                : 'bg-sky-500/10 text-sky-300 border-sky-500/40'
            }`}
            title="Сменить сезон матрицы (Лето / Зима)"
          >
            {season === 'summer' ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Snowflake className="w-3.5 h-3.5 text-sky-400" />
            )}
            <span>{season === 'summer' ? 'Лето ☀️' : 'Зима ❄️'}</span>
          </button>

          <button
            onClick={onToggle21Mode}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-[11px] font-semibold border transition cursor-pointer ${
              is21Mode
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
            title="Канон 21 (Эталоны)"
          >
            <Crown className={`w-3.5 h-3.5 ${is21Mode ? 'text-amber-400' : 'text-slate-500'}`} />
            <span>Канон 21</span>
          </button>
        </div>

        {/* Manifesto & Guarantee badge */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={onOpenManifesto}
            className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 hover:text-white transition cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Манифест</span>
          </button>

          <div className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/30">
            <ShieldCheck className="w-3 h-3" />
            <span>0 ошибок</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-72 z-40">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          {/* Drawer Panel */}
          <div className="relative w-80 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
