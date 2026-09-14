import React from 'react';
import { Sparkles, BookOpen, ShieldCheck, Layers, Zap, SlidersHorizontal, Crown, Atom } from 'lucide-react';

interface HeaderProps {
  activeTab: 'simple' | 'pro' | 'benchmarks';
  onTabChange: (tab: 'simple' | 'pro' | 'benchmarks') => void;
  onOpenManifesto: () => void;
  onOpenShelf?: () => void;
  onOpenPeriodicTable?: () => void;
  shelfCount?: number;
  is21Mode?: boolean;
  onToggle21Mode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenManifesto,
  onOpenShelf,
  onOpenPeriodicTable,
  shelfCount = 0,
  is21Mode = false,
  onToggle21Mode,
}) => {
  return (
    <header className="w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 p-0.5 shadow-lg shadow-amber-500/10 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <span className="font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-indigo-300 text-lg">
                A
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold tracking-tight text-white text-sm sm:text-base lg:text-lg flex items-center gap-1.5">
                СИСТЕМА АНЬЯНОВА
              </h1>
              <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 hidden xs:inline-block">
                v2.1
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden lg:block">
              Wardrobe OS + Fragrance Mirror • Синтез гардероба и личной парфюмерной полки
            </p>
          </div>
        </div>

        {/* Center: Tabs Switcher (Simple Core vs Pro Lab vs Benchmarks 21) */}
        <div className="flex items-center bg-slate-900/90 p-1 rounded-2xl border border-slate-800 shadow-inner">
          <button
            onClick={() => onTabChange('simple')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'simple'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${activeTab === 'simple' ? 'fill-black' : 'text-amber-400'}`} />
            <span className="hidden sm:inline">Суть системы</span>
            <span className="sm:hidden">Суть</span>
          </button>
          
          <button
            onClick={() => onTabChange('pro')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'pro'
                ? 'bg-slate-800 text-white shadow border border-slate-700 font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Лаборатория Pro</span>
            <span className="sm:hidden">Pro</span>
          </button>

          <button
            onClick={() => onTabChange('benchmarks')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'benchmarks'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Crown className={`w-3.5 h-3.5 ${activeTab === 'benchmarks' ? 'text-black fill-black' : 'text-amber-400'}`} />
            <span className="hidden sm:inline">Эталоны 21</span>
            <span className="sm:hidden">21</span>
          </button>
        </div>

        {/* Right Action: Mode 21, Shelf, Manifesto & Guarantee */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {onToggle21Mode && (
            <button
              onClick={onToggle21Mode}
              className={`hidden md:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                is21Mode
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
              title="Переключить Режим 21 (Золотой Канон)"
            >
              <Crown className={`w-3.5 h-3.5 ${is21Mode ? 'text-amber-400' : 'text-slate-500'}`} />
              <span>Канон 21</span>
              <span className={`w-1.5 h-1.5 rounded-full ${is21Mode ? 'bg-amber-400 animate-pulse' : 'bg-slate-600'}`} />
            </button>
          )}
          <div className="hidden xl:flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>0 ошибок</span>
          </div>

          {onOpenPeriodicTable && (
            <button
              onClick={onOpenPeriodicTable}
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-all hover:border-indigo-500/50 shadow-sm cursor-pointer"
              title="Открыть Периодическую систему нот"
            >
              <Atom className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Таблица нот</span>
            </button>
          )}

          {onOpenShelf && (
            <button
              onClick={onOpenShelf}
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-all hover:border-amber-500/50 shadow-sm cursor-pointer"
              title="Открыть мою парфюмерную полку"
            >
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Полка</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                {shelfCount}
              </span>
            </button>
          )}

          <button
            onClick={onOpenManifesto}
            className="flex items-center gap-1.5 text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-all hover:border-amber-500/50 shadow-sm cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Манифест</span>
          </button>
        </div>
      </div>
    </header>
  );
};
