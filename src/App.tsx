import React, { useState, useMemo } from 'react';
import { AnyanovCoordinates } from './types';
import { Header } from './components/Header';
import { PresetSelector } from './components/PresetSelector';
import { AnyanovSliders } from './components/AnyanovSliders';
import { AnyanovMatrixCanvas } from './components/AnyanovMatrixCanvas';
import { MannequinVisualizer } from './components/MannequinVisualizer';
import { FragranceMatchCard } from './components/FragranceMatchCard';
import { ManifestoModal } from './components/ManifestoModal';
import { getQuadrantInfo } from './engine/anyanovMatrix';
import { compileAnyanovOutfit } from './engine/outfitCompiler';
import { matchAnyanovPerfume } from './engine/fragranceMatcher';

export function App() {
  // Исходное состояние координат системы Аньянова:
  // По умолчанию: Smart Casual в офисе (слегка в сторону фокуса/дистанции, умеренная прохлада/день)
  const [coords, setCoords] = useState<AnyanovCoordinates>({
    socialX: -0.35,
    thermoY: 0.45,
    formalIndex: 2,
    temperatureC: 22,
  });

  const [isManifestoOpen, setIsManifestoOpen] = useState(false);

  // Частичное обновление координат
  const handleUpdateCoords = (partial: Partial<AnyanovCoordinates>) => {
    setCoords((prev) => ({ ...prev, ...partial }));
  };

  // Реактивный расчет квадранта, образа и аромата в реальном времени
  const quadrant = useMemo(
    () => getQuadrantInfo(coords.socialX, coords.thermoY),
    [coords.socialX, coords.thermoY]
  );

  const { stack, rulesApplied } = useMemo(
    () => compileAnyanovOutfit(coords),
    [coords]
  );

  const { perfume, synergyVerdict, compatibilityScore } = useMemo(
    () => matchAnyanovPerfume(coords),
    [coords]
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#05070D] text-slate-100 font-sans selection:bg-amber-500 selection:text-black">
      {/* 1. Header with brand & manifesto button */}
      <Header onOpenManifesto={() => setIsManifestoOpen(true)} />

      {/* 2. Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        {/* Presets in 1 click */}
        <PresetSelector
          currentCoords={coords}
          onSelectPreset={(newCoords) => setCoords(newCoords)}
        />

        {/* Two-Column Grid: Controls & Outputs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Controls (Sliders + 2D Interactive Board) (5 cols on lg) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* 2D Matrix from notebook */}
            <AnyanovMatrixCanvas
              coords={coords}
              quadrant={quadrant}
              onChangeCoords={handleUpdateCoords}
            />

            {/* Sliders for precision tuning */}
            <AnyanovSliders
              coords={coords}
              onChangeCoords={handleUpdateCoords}
            />
          </div>

          {/* RIGHT COLUMN: Realtime Results (Mannequin Outfit + Fragrance Duo) (7 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            {/* Mannequin Wardrobe OS */}
            <MannequinVisualizer
              outfit={stack}
              rulesApplied={rulesApplied}
            />

            {/* Fragrance Mirror */}
            <FragranceMatchCard
              perfume={perfume}
              synergyVerdict={synergyVerdict}
              compatibilityScore={compatibilityScore}
            />
          </div>
        </div>
      </main>

      {/* 3. Footer */}
      <footer className="w-full border-t border-slate-900 bg-slate-950/60 py-4 text-center text-xs text-slate-500 font-mono">
        <span>Система Аньянова © 2026 • Стильно, легко и безошибочно</span>
      </footer>

      {/* 4. Manifesto Modal */}
      <ManifestoModal
        isOpen={isManifestoOpen}
        onClose={() => setIsManifestoOpen(false)}
      />
    </div>
  );
}

export default App;
