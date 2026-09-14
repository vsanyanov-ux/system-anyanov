import React from 'react';
import { Sparkles, BookOpen, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onOpenManifesto: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenManifesto }) => {
  return (
    <header className="w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
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
              <h1 className="font-bold tracking-tight text-white text-base sm:text-lg flex items-center gap-1.5">
                СИСТЕМА АНЬЯНОВА
              </h1>
              <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                v1.0 Core
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Wardrobe OS + Fragrance Mirror • Синтез гардероба и аромата
            </p>
          </div>
        </div>

        {/* Right Action: Manifesto button & Guarantee */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>0 ошибок • 100% синергия</span>
          </div>

          <button
            onClick={onOpenManifesto}
            className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-all hover:border-amber-500/50 shadow-sm cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Манифест</span>
          </button>
        </div>
      </div>
    </header>
  );
};
