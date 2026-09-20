import React, { useMemo } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Plus,
  ArrowRight,
  Sparkles,
  Layers,
  AlertTriangle,
} from 'lucide-react';
import { AnyanovCoordinates, PerfumeItem } from '../types';
import { PERFUME_DATABASE, getPerfumeBottleImage } from '../data/fragrances';
import { getQuadrantInfo } from '../engine/anyanovMatrix';

interface WardrobeGapAuditViewProps {
  userShelfIds: string[];
  onToggleShelfId: (id: string) => void;
  onApplyCoords: (coords: AnyanovCoordinates) => void;
  onSwitchTab: (tab: any) => void;
  onOpenShelfModal: () => void;
}

export const WardrobeGapAuditView: React.FC<WardrobeGapAuditViewProps> = ({
  userShelfIds,
  onToggleShelfId,
  onApplyCoords,
  onSwitchTab,
  onOpenShelfModal,
}) => {
  // Полные данные по флаконам пользователя
  const ownedPerfumes = useMemo(() => {
    return PERFUME_DATABASE.filter((p) => userShelfIds.includes(p.id));
  }, [userShelfIds]);

  // Распределение по 4 квадрантам
  const quadrantStats = useMemo(() => {
    const nw: PerfumeItem[] = [];
    const ne: PerfumeItem[] = [];
    const sw: PerfumeItem[] = [];
    const se: PerfumeItem[] = [];

    ownedPerfumes.forEach((p) => {
      const q = getQuadrantInfo(p.xCoord, p.yCoord);
      if (q.code === 'NW_FOCUS') nw.push(p);
      else if (q.code === 'NE_EASE') ne.push(p);
      else if (q.code === 'SW_POWER') sw.push(p);
      else if (q.code === 'SE_SEDUCTION') se.push(p);
    });

    const quadrants = [
      {
        code: 'NW_FOCUS',
        title: 'Фокус & Дисциплина (NW)',
        subtitle: 'Business Formal • Офис • Переговоры',
        coords: { socialX: -0.65, thermoY: 0.6, formalIndex: 3 as const, temperatureC: 21 },
        items: nw,
        targetRole: 'Ледяной цитрон, мыльно-пудровая чистота, сухой ирис, горький ветивер',
        recommendedCatalog: PERFUME_DATABASE.filter(
          (p) => !userShelfIds.includes(p.id) && getQuadrantInfo(p.xCoord, p.yCoord).code === 'NW_FOCUS'
        ).slice(0, 3),
        accentColor: 'border-sky-500/40 text-sky-400 bg-sky-950/20',
        badgeColor: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
      },
      {
        code: 'NE_EASE',
        title: 'Дневная Лёгкость (NE)',
        subtitle: 'Casual • Солнце • Выходной • Свобода',
        coords: { socialX: 0.65, thermoY: 0.6, formalIndex: 1 as const, temperatureC: 24 },
        items: ne,
        targetRole: 'Морская соль, свежий бергамот, мята, белый мускус',
        recommendedCatalog: PERFUME_DATABASE.filter(
          (p) => !userShelfIds.includes(p.id) && getQuadrantInfo(p.xCoord, p.yCoord).code === 'NE_EASE'
        ).slice(0, 3),
        accentColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20',
        badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
      },
      {
        code: 'SW_POWER',
        title: 'Твёрдая Власть (SW)',
        subtitle: 'Black Tie • Статус • Вечер • Вес',
        coords: { socialX: -0.65, thermoY: -0.6, formalIndex: 3 as const, temperatureC: 18 },
        items: sw,
        targetRole: 'Темный уд, березовая кожа, дымный ладан, смолы',
        recommendedCatalog: PERFUME_DATABASE.filter(
          (p) => !userShelfIds.includes(p.id) && getQuadrantInfo(p.xCoord, p.yCoord).code === 'SW_POWER'
        ).slice(0, 3),
        accentColor: 'border-indigo-500/40 text-indigo-400 bg-indigo-950/20',
        badgeColor: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
      },
      {
        code: 'SE_SEDUCTION',
        title: 'Соблазн & Магнетизм (SE)',
        subtitle: 'Smart Casual / Night • Свидание • Интим',
        coords: { socialX: 0.65, thermoY: -0.6, formalIndex: 2 as const, temperatureC: 20 },
        items: se,
        targetRole: 'Табачный лист, стручковая ваниль, кардамон, амбра',
        recommendedCatalog: PERFUME_DATABASE.filter(
          (p) => !userShelfIds.includes(p.id) && getQuadrantInfo(p.xCoord, p.yCoord).code === 'SE_SEDUCTION'
        ).slice(0, 3),
        accentColor: 'border-amber-500/40 text-amber-400 bg-amber-950/20',
        badgeColor: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
      },
    ];

    const coveredQuadrants = quadrants.filter((q) => q.items.length > 0).length;
    const balanceScore = Math.round((coveredQuadrants / 4) * 100);

    return { quadrants, coveredQuadrants, balanceScore };
  }, [ownedPerfumes, userShelfIds]);

  const criticalGaps = quadrantStats.quadrants.filter((q) => q.items.length === 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold tracking-wide uppercase">
              <ShieldAlert className="w-3.5 h-3.5" />
              Инвестиционный аудит гардероба
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Детектор ольфакторных брешей (Wardrobe Gap)
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Анализ вашей парфюмерной полки по 4 квадрантам матрицы Аньянова. Узнайте, в каких
              жизненных ситуациях у вас психологическая броня, а где гардероб оставляет вас уязвимым.
            </p>
          </div>

          {/* Quick Metrics Card */}
          <div className="flex items-center gap-4 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 backdrop-blur-md self-start md:self-auto shrink-0">
            <div className="text-center px-2">
              <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-indigo-300">
                {quadrantStats.balanceScore}%
              </div>
              <div className="text-[11px] text-slate-400 font-medium">Баланс гардероба</div>
            </div>
            <div className="w-px h-10 bg-slate-800" />
            <div className="text-center px-2">
              <div className="text-2xl sm:text-3xl font-black text-white">
                {userShelfIds.length}
              </div>
              <div className="text-[11px] text-slate-400 font-medium">Флаконов на полке</div>
            </div>
          </div>
        </div>

        {/* Diagnosis Status Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            {criticalGaps.length === 0 ? (
              <span className="flex items-center gap-2 text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" /> Все 4 квадранта закрыты — безупречный баланс!
              </span>
            ) : (
              <span className="flex items-center gap-2 text-amber-400 font-semibold">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Обнаружено {criticalGaps.length} критических брешей гардероба
              </span>
            )}
          </div>
          <button
            onClick={onOpenShelfModal}
            className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            Редактировать полку ({userShelfIds.length})
          </button>
        </div>
      </div>

      {/* 4 Quadrants Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {quadrantStats.quadrants.map((quad) => {
          const isCovered = quad.items.length > 0;
          return (
            <div
              key={quad.code}
              className={`rounded-2xl border p-5 sm:p-6 transition-all flex flex-col justify-between ${
                isCovered
                  ? 'bg-slate-900/60 border-slate-800/90 hover:border-slate-700'
                  : 'bg-rose-950/10 border-rose-500/30'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-white">{quad.title}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${quad.badgeColor}`}>
                        {isCovered ? `${quad.items.length} флакон(ов)` : 'ПУСТО • БРЕШЬ'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{quad.subtitle}</p>
                  </div>
                  {isCovered ? (
                    <div className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shrink-0 animate-pulse">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                    </div>
                  )}
                </div>

                <div className="text-xs text-slate-400 mb-4 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
                  <span className="text-slate-300 font-medium">Ольфакторный вектор:</span> {quad.targetRole}
                </div>

                {/* What user owns */}
                {isCovered ? (
                  <div className="space-y-2 mb-4">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Флаконы в вашем арсенале:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {quad.items.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center gap-2 bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-700/80 text-xs"
                        >
                          <span className="font-semibold text-slate-200">{p.brand}</span>
                          <span className="text-slate-400 truncate max-w-[120px]">{p.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/20 text-xs text-rose-300 mb-4 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                      Психологическая уязвимость образа:
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      В этой ситуации вам нечем закрепить невербальный статус. Использование аромата
                      из другого сектора создаст диссонанс с контекстом и одеждой.
                    </p>
                  </div>
                )}
              </div>

              {/* Recommendations to close the gap */}
              <div className="pt-4 border-t border-slate-800/80 mt-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400/90 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  {isCovered ? 'Для усиления сектора:' : 'Рекомендуемые эталоны для закрытия бреши:'}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {quad.recommendedCatalog.map((rec) => {
                    const bottleImg = getPerfumeBottleImage(rec);
                    return (
                      <div
                        key={rec.id}
                        className="bg-slate-950/70 border border-slate-800 hover:border-amber-500/40 p-2.5 rounded-xl transition flex flex-col justify-between group"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {bottleImg && (
                            <img
                              src={bottleImg}
                              alt={rec.name}
                              className="w-8 h-8 rounded-lg object-cover bg-slate-900 border border-slate-800 shrink-0"
                            />
                          )}
                          <div className="min-w-0">
                            <div className="text-[10px] font-bold text-amber-300 truncate">{rec.brand}</div>
                            <div className="text-xs text-slate-200 font-semibold truncate">{rec.name}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 mt-1">
                          <button
                            onClick={() => onToggleShelfId(rec.id)}
                            className="flex-1 flex items-center justify-center gap-1 text-[10px] font-bold py-1 px-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition cursor-pointer"
                            title="Добавить на мою полку"
                          >
                            <Plus className="w-3 h-3" />
                            На полку
                          </button>
                          <button
                            onClick={() => {
                              onApplyCoords(quad.coords);
                              onSwitchTab('concierge');
                            }}
                            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
                            title="Примерить лук под этот сектор"
                          >
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
