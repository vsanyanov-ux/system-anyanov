import React, { lazy, Suspense } from 'react';
import { Header } from './components/Header';
import { PresetSelector } from './components/PresetSelector';
import { AnyanovSliders } from './components/AnyanovSliders';
import { AnyanovMatrixCanvas } from './components/AnyanovMatrixCanvas';
import { MannequinVisualizer } from './components/MannequinVisualizer';
import { FragranceMatchCard } from './components/FragranceMatchCard';
import { CorePrincipleView } from './components/CorePrincipleView';
import { SmartConciergeBar } from './components/SmartConciergeBar';
import { useAnyanovState } from './hooks/useAnyanovState';

// Ленивая загрузка тяжелых диалоговых окон и эталонной таблицы 21
const BenchmarkTableView = lazy(() =>
  import('./components/BenchmarkTableView').then((m) => ({ default: m.BenchmarkTableView }))
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

  return (
    <div className="min-h-screen flex flex-col bg-[#05070D] text-slate-100 font-sans selection:bg-amber-500 selection:text-black">
      {/* 1. Header with brand, shelf button, manifesto, season & tabs */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenManifesto={() => setIsManifestoOpen(true)}
        onOpenShelf={() => setIsShelfModalOpen(true)}
        onOpenPeriodicTable={() => setIsPeriodicTableOpen(true)}
        onOpenHumanFinder={() => setIsHumanFinderOpen(true)}
        shelfCount={userShelfIds.length}
        is21Mode={is21Mode}
        onToggle21Mode={toggle21Mode}
        season={season}
        onToggleSeason={toggleSeason}
      />

      {/* 2. Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        {/* Умный AI-Консьерж: свободный текстовый ввод на естественном языке */}
        <SmartConciergeBar
          currentCoords={coords}
          onApplyCoords={(newCoords) => {
            setCoords(newCoords);
          }}
        />

        {activeTab === 'benchmarks' ? (
          /* РЕЖИМ ЭТАЛОНОВ 21: Интерактивная таблица эталонов, зеркало духов и 21 элемент гардероба */
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
        ) : activeTab === 'simple' ? (
          /* ЭКСПРЕСС-РЕЖИМ: Минимум настроек, 0 перегруза, чистая демонстрация принципа */
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
        ) : (
          /* РЕЖИМ PRO: Полный пульт управления, 2D Canvas, 4 слайдера, слои L1-L4 */
          <>
            {/* Presets in 1 click */}
            <PresetSelector
              currentCoords={coords}
              onSelectPreset={(newCoords) => setCoords(newCoords)}
            />

            {/* Two-Column Grid: Controls & Outputs */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* LEFT COLUMN: Controls (Sliders + 2D Interactive Board) (5 cols on lg) */}
              <div className="lg:col-span-5 flex flex-col gap-5">
                {/* 2D Matrix Canvas */}
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

                {/* Sliders for precision tuning (Dual-Mode: Outfit vs Perfume with Knobs) */}
                <AnyanovSliders
                  coords={coords}
                  onChangeCoords={updateCoords}
                  controlMode={controlMode}
                  onControlModeChange={setControlMode}
                  season={season}
                  onSeasonChange={setSeason}
                />
              </div>

              {/* RIGHT COLUMN: Realtime Results (Mannequin Outfit + Fragrance Duo) (7 cols on lg) */}
              <div className="lg:col-span-7 flex flex-col gap-5">
                {/* Mannequin Wardrobe OS */}
                <MannequinVisualizer
                  outfit={stack}
                  rulesApplied={rulesApplied}
                  solfeggio={solfeggio}
                />

                {/* Fragrance Mirror with Shelf integration & Notes Engine Analysis */}
                <FragranceMatchCard
                  perfume={matchResult.perfume}
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

      {/* 3. Footer */}
      <footer className="w-full border-t border-slate-900 bg-slate-950/60 py-4 text-center text-xs text-slate-500 font-mono">
        <span>Система Аньянова © 2026 • Стильно, легко и безошибочно</span>
      </footer>

      {/* 4. Modals (Lazy Loaded on demand) */}
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
