import React, { lazy, Suspense, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { PresetSelector } from './components/PresetSelector';
import { AnyanovSliders } from './components/AnyanovSliders';
import { AnyanovMatrixCanvas } from './components/AnyanovMatrixCanvas';
import { MannequinVisualizer } from './components/MannequinVisualizer';
import { FragranceMatchCard } from './components/FragranceMatchCard';
import { CorePrincipleView } from './components/CorePrincipleView';
import { SmartConciergeBar } from './components/SmartConciergeBar';
import { PublicMinimalView } from './components/PublicMinimalView';
import { WardrobeGapAuditView } from './components/WardrobeGapAuditView';
import { DiscoverySetBuilderView } from './components/DiscoverySetBuilderView';
import { GiftingConciergeView } from './components/GiftingConciergeView';
import { InStoreCopilotView } from './components/InStoreCopilotView';
import { useAnyanovState } from './hooks/useAnyanovState';
import { Menu, Layers } from 'lucide-react';

// Ленивая загрузка тяжелых диалоговых окон и эталонной таблицы 21
const BenchmarkTableView = lazy(() =>
  import('./components/BenchmarkTableView').then((m) => ({ default: m.BenchmarkTableView }))
);
const BrandMatrixView = lazy(() =>
  import('./components/BrandMatrixView').then((m) => ({ default: m.BrandMatrixView }))
);
const ManifestoModal = lazy(() =>
  import('./components/ManifestoModal').then((m) => ({ default: m.ManifestoModal }))
);
const FragranceShelfModal = lazy(() =>
  import('./components/FragranceShelfModal').then((m) => ({ default: m.FragranceShelfModal }))
);
const PeriodicTableModal = lazy(() =>
  import('./components/PeriodicTableModal').then((m) => ({ default: m.PeriodicTableModal }))
);
const HumanScentFinderModal = lazy(() =>
  import('./components/HumanScentFinderModal').then((m) => ({ default: m.HumanScentFinderModal }))
);

const LazyFallback: React.FC = () => (
  <div className="flex items-center justify-center p-12 text-slate-400 font-mono text-xs">
    <div className="w-5 h-5 border-2 border-amber-400/40 border-t-amber-400 rounded-full animate-spin mr-3" />
    Загрузка модуля...
  </div>
);

export function App() {
  const {
    activeTab,
    setActiveTab,
    is21Mode,
    toggle21Mode,
    coords,
    setCoords,
    updateCoords,
    userShelfIds,
    updateShelfIds,
    toggleShelfId,
    loadGoldenShelf,
    isCatalogMode,
    toggleCatalogMode,
    isManifestoOpen,
    setIsManifestoOpen,
    isShelfModalOpen,
    setIsShelfModalOpen,
    isPeriodicTableOpen,
    setIsPeriodicTableOpen,
    isHumanFinderOpen,
    setIsHumanFinderOpen,
    // Сезон и Режим управления из эскизов Аньянова
    season,
    setSeason,
    toggleSeason,
    controlMode,
    setControlMode,
    quadrant,
    stack,
    rulesApplied,
    matchResult,
    solfeggio,
  } = useAnyanovState();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#05070D] text-slate-100 font-sans selection:bg-amber-500 selection:text-black">
      {/* 1. Left Vertical Sidebar (Fixed on Desktop, Drawer on Mobile) */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        shelfCount={userShelfIds.length}
        onOpenShelf={() => setIsShelfModalOpen(true)}
        onOpenPeriodicTable={() => setIsPeriodicTableOpen(true)}
        onOpenHumanFinder={() => setIsHumanFinderOpen(true)}
        onOpenManifesto={() => setIsManifestoOpen(true)}
        season={season}
        onToggleSeason={toggleSeason}
        is21Mode={is21Mode}
        onToggle21Mode={toggle21Mode}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* 2. Main Page Layout (Offset for Left Sidebar on md+) */}
      <div className="flex-1 md:pl-72 flex flex-col min-h-screen w-full">
        {/* Mobile Header Bar */}
        <header className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 h-14 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1.5 -ml-1 text-slate-300 hover:text-white rounded-lg hover:bg-slate-900 border border-slate-800 cursor-pointer"
              aria-label="Открыть меню"
            >
              <Menu className="w-5 h-5 text-amber-400" />
            </button>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm text-white tracking-tight">СИСТЕМА АНЬЯНОВА</span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                v2.9
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsShelfModalOpen(true)}
              className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-900 text-slate-200 border border-slate-800 cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono text-[10px] text-amber-300 font-bold">{userShelfIds.length}</span>
            </button>
          </div>
        </header>

        {/* Workspace Content Router */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
          {/* Режим 1: Консьерж Топ-2 (по умолчанию) */}
          {(activeTab === 'concierge' || activeTab === 'public') && (
            <PublicMinimalView
              coords={coords}
              onChangeCoords={setCoords}
              outfit={stack}
              matchResult={matchResult}
              userShelfIds={userShelfIds}
              isCatalogMode={isCatalogMode}
              onToggleCatalogMode={toggleCatalogMode}
              onOpenShelfModal={() => setIsShelfModalOpen(true)}
              onSwitchToPro={() => setActiveTab('pro')}
              initialViewMode="concierge"
              onViewModeChange={(m) => setActiveTab(m === 'category' ? 'category' : 'concierge')}
            />
          )}

          {/* Режим 2: Витрина категории */}
          {activeTab === 'category' && (
            <PublicMinimalView
              coords={coords}
              onChangeCoords={setCoords}
              outfit={stack}
              matchResult={matchResult}
              userShelfIds={userShelfIds}
              isCatalogMode={isCatalogMode}
              onToggleCatalogMode={toggleCatalogMode}
              onOpenShelfModal={() => setIsShelfModalOpen(true)}
              onSwitchToPro={() => setActiveTab('pro')}
              initialViewMode="category"
              onViewModeChange={(m) => setActiveTab(m === 'category' ? 'category' : 'concierge')}
            />
          )}

          {/* Режим 3: Аудит гардероба (Wardrobe Gap) */}
          {activeTab === 'gap-audit' && (
            <WardrobeGapAuditView
              userShelfIds={userShelfIds}
              onToggleShelfId={toggleShelfId}
              onApplyCoords={setCoords}
              onSwitchTab={setActiveTab}
              onOpenShelfModal={() => setIsShelfModalOpen(true)}
            />
          )}

          {/* Режим 4: Discovery Set */}
          {activeTab === 'discovery-set' && (
            <DiscoverySetBuilderView
              userShelfIds={userShelfIds}
              onAddAllToShelf={(ids) => {
                const newIds = Array.from(new Set([...userShelfIds, ...ids]));
                updateShelfIds(newIds);
              }}
              onOpenShelfModal={() => setIsShelfModalOpen(true)}
            />
          )}

          {/* Режим 5: Подарочный калибровщик (Gifting) */}
          {activeTab === 'gifting' && (
            <GiftingConciergeView
              userShelfIds={userShelfIds}
              onToggleShelfId={toggleShelfId}
              onOpenShelfModal={() => setIsShelfModalOpen(true)}
            />
          )}

          {/* Режим 6: In-Store Ко-пилот */}
          {activeTab === 'in-store' && (
            <InStoreCopilotView
              userShelfIds={userShelfIds}
              onToggleShelfId={toggleShelfId}
              onApplyCoords={setCoords}
              onSwitchTab={setActiveTab}
              onOpenShelfModal={() => setIsShelfModalOpen(true)}
            />
          )}

          {/* Режим 7: Суть 4 архетипов */}
          {activeTab === 'simple' && (
            <>
              <SmartConciergeBar
                currentCoords={coords}
                onApplyCoords={(newCoords) => setCoords(newCoords)}
              />
              <CorePrincipleView
                coords={coords}
                onChangeCoords={setCoords}
                outfit={stack}
                perfume={matchResult.perfume}
                idealPerfume={matchResult.idealCatalogMatch}
                solfeggio={solfeggio}
                notesEngine={matchResult.notesEngine}
                isCatalogMode={isCatalogMode}
                onToggleCatalogMode={toggleCatalogMode}
                hasWardrobeGap={matchResult.hasWardrobeGap}
                gapAdvice={matchResult.gapAdvice}
                totalShelfCount={userShelfIds.length}
                onOpenShelf={() => setIsShelfModalOpen(true)}
                onOpenPeriodicTable={() => setIsPeriodicTableOpen(true)}
                onOpenHumanFinder={() => setIsHumanFinderOpen(true)}
                onSwitchToPro={() => setActiveTab('pro')}
              />
            </>
          )}

          {/* Режим 7.1: Матрица Брендов 1-2-5-9 */}
          {activeTab === 'brand-matrix' && (
            <>
              <SmartConciergeBar
                currentCoords={coords}
                onApplyCoords={(newCoords) => setCoords(newCoords)}
              />
              <Suspense fallback={<LazyFallback />}>
                <BrandMatrixView
                  onApplyCoords={setCoords}
                  onSwitchTab={setActiveTab}
                  userShelfIds={userShelfIds}
                  onToggleShelfId={toggleShelfId}
                  onOpenShelfModal={() => setIsShelfModalOpen(true)}
                />
              </Suspense>
            </>
          )}

          {/* Режим 8: Эталоны 21 */}
          {activeTab === 'benchmarks' && (
            <>
              <SmartConciergeBar
                currentCoords={coords}
                onApplyCoords={(newCoords) => setCoords(newCoords)}
              />
              <Suspense fallback={<LazyFallback />}>
                <BenchmarkTableView
                  currentCoords={coords}
                  onApplyCoords={setCoords}
                  onSwitchTab={setActiveTab}
                  onLoadGoldenShelf={loadGoldenShelf}
                  is21Mode={is21Mode}
                  onToggle21Mode={toggle21Mode}
                />
              </Suspense>
            </>
          )}

          {/* Режим 9: Лаборатория Pro */}
          {activeTab === 'pro' && (
            <>
              <SmartConciergeBar
                currentCoords={coords}
                onApplyCoords={(newCoords) => setCoords(newCoords)}
              />
              <PresetSelector
                currentCoords={coords}
                onSelectPreset={(newCoords) => setCoords(newCoords)}
              />
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-5 flex flex-col gap-5">
                  <AnyanovMatrixCanvas
                    coords={coords}
                    quadrant={quadrant}
                    perfume={matchResult.perfume}
                    solfeggio={solfeggio}
                    onChangeCoords={updateCoords}
                    season={season}
                    onSeasonChange={setSeason}
                    controlMode={controlMode}
                  />
                  <AnyanovSliders
                    coords={coords}
                    onChangeCoords={updateCoords}
                    controlMode={controlMode}
                    onControlModeChange={setControlMode}
                    season={season}
                    onSeasonChange={setSeason}
                  />
                </div>

                <div className="lg:col-span-7 flex flex-col gap-5">
                  <MannequinVisualizer
                    outfit={stack}
                    rulesApplied={rulesApplied}
                    solfeggio={solfeggio}
                  />
                  <FragranceMatchCard
                    perfume={matchResult.perfume}
                    champion={matchResult.champion}
                    championScore={matchResult.championScore}
                    championReasons={matchResult.championReasons}
                    alternative={matchResult.alternative}
                    alternativeScore={matchResult.alternativeScore}
                    alternativeDifference={matchResult.alternativeDifference}
                    solfeggio={solfeggio}
                    isFromShelf={matchResult.isFromShelf}
                    totalShelfCount={userShelfIds.length}
                    hasWardrobeGap={matchResult.hasWardrobeGap}
                    gapAdvice={matchResult.gapAdvice}
                    idealCatalogMatch={matchResult.idealCatalogMatch}
                    isCatalogMode={isCatalogMode}
                    onToggleCatalogMode={toggleCatalogMode}
                    onOpenShelfModal={() => setIsShelfModalOpen(true)}
                    notesEngine={matchResult.notesEngine}
                    onOpenPeriodicTable={() => setIsPeriodicTableOpen(true)}
                    onOpenHumanFinder={() => setIsHumanFinderOpen(true)}
                  />
                </div>
              </div>
            </>
          )}
        </main>

        {/* Footer */}
        <footer className="w-full border-t border-slate-900 bg-slate-950/60 py-4 text-center text-xs text-slate-500 font-mono mt-auto">
          <span>Система Аньянова © 2026 • Социальная инженерия стиля</span>
        </footer>
      </div>

      {/* Modals (Lazy Loaded) */}
      <Suspense fallback={null}>
        {isManifestoOpen && (
          <ManifestoModal
            isOpen={isManifestoOpen}
            onClose={() => setIsManifestoOpen(false)}
          />
        )}

        {isShelfModalOpen && (
          <FragranceShelfModal
            isOpen={isShelfModalOpen}
            onClose={() => setIsShelfModalOpen(false)}
            ownedIds={userShelfIds}
            onUpdateOwnedIds={updateShelfIds}
            onOpenHumanFinder={() => setIsHumanFinderOpen(true)}
          />
        )}

        {isPeriodicTableOpen && (
          <PeriodicTableModal
            isOpen={isPeriodicTableOpen}
            onClose={() => setIsPeriodicTableOpen(false)}
            onApplyCoords={(newCoords) => setCoords(newCoords)}
          />
        )}

        {isHumanFinderOpen && (
          <HumanScentFinderModal
            isOpen={isHumanFinderOpen}
            onClose={() => setIsHumanFinderOpen(false)}
            onApplyCoords={(newCoords) => setCoords(newCoords)}
            ownedShelfIds={userShelfIds}
            onToggleShelfId={toggleShelfId}
          />
        )}
      </Suspense>
    </div>
  );
}

export default App;
