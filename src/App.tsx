import React, { useState, useMemo, useEffect } from 'react';
import { AnyanovCoordinates } from './types';
import { Header } from './components/Header';
import { PresetSelector } from './components/PresetSelector';
import { AnyanovSliders } from './components/AnyanovSliders';
import { AnyanovMatrixCanvas } from './components/AnyanovMatrixCanvas';
import { MannequinVisualizer } from './components/MannequinVisualizer';
import { FragranceMatchCard } from './components/FragranceMatchCard';
import { ManifestoModal } from './components/ManifestoModal';
import { FragranceShelfModal } from './components/FragranceShelfModal';
import { getQuadrantInfo } from './engine/anyanovMatrix';
import { compileAnyanovOutfit } from './engine/outfitCompiler';
import { matchAnyanovPerfume } from './engine/fragranceMatcher';
import { analyzeStyleSolfeggio } from './engine/styleSolfeggio';
import { SHELF_PRESETS } from './data/fragrances';

const STORAGE_KEY_SHELF = 'anyanov_user_fragrance_shelf_v1';
const STORAGE_KEY_MODE = 'anyanov_fragrance_catalog_mode_v1';

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
  const [isShelfModalOpen, setIsShelfModalOpen] = useState(false);

  // Личная полка пользователя (с сохранением в LocalStorage)
  const [userShelfIds, setUserShelfIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SHELF);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Игнорируем ошибки чтения LocalStorage
    }
    // По умолчанию: Базовый джентльменский набор из 5 флаконов
    return SHELF_PRESETS[0].perfumeIds;
  });

  // Режим подбора: false = из личной полки, true = идеальный эталон из всего каталога
  const [isCatalogMode, setIsCatalogMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_MODE) === 'true';
    } catch {
      return false;
    }
  });

  // Сохранение изменений полки в LocalStorage
  const handleUpdateShelfIds = (newIds: string[]) => {
    setUserShelfIds(newIds);
    try {
      localStorage.setItem(STORAGE_KEY_SHELF, JSON.stringify(newIds));
    } catch (e) {
      console.warn('Не удалось сохранить полку в LocalStorage:', e);
    }
  };

  const handleToggleCatalogMode = () => {
    setIsCatalogMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY_MODE, String(next));
      } catch (e) {
        console.warn('Не удалось сохранить режим в LocalStorage:', e);
      }
      return next;
    });
  };

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

  // Подбор аромата: сканирование личной полки или мирового каталога
  const matchResult = useMemo(
    () => matchAnyanovPerfume(coords, userShelfIds, isCatalogMode),
    [coords, userShelfIds, isCatalogMode]
  );

  // Мультимодальное Сольфеджио Стиля: гармония между собранным аутфитом и ароматом
  const solfeggio = useMemo(
    () => analyzeStyleSolfeggio(stack, matchResult.perfume),
    [stack, matchResult.perfume]
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#05070D] text-slate-100 font-sans selection:bg-amber-500 selection:text-black">
      {/* 1. Header with brand, shelf button & manifesto */}
      <Header
        onOpenManifesto={() => setIsManifestoOpen(true)}
        onOpenShelf={() => setIsShelfModalOpen(true)}
        shelfCount={userShelfIds.length}
      />

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
            {/* 2D Matrix Canvas */}
            <AnyanovMatrixCanvas
              coords={coords}
              quadrant={quadrant}
              perfume={matchResult.perfume}
              solfeggio={solfeggio}
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
              solfeggio={solfeggio}
            />

            {/* Fragrance Mirror with Shelf integration & Solfeggio Analysis */}
            <FragranceMatchCard
              perfume={matchResult.perfume}
              solfeggio={solfeggio}
              isFromShelf={matchResult.isFromShelf}
              totalShelfCount={userShelfIds.length}
              hasWardrobeGap={matchResult.hasWardrobeGap}
              gapAdvice={matchResult.gapAdvice}
              idealCatalogMatch={matchResult.idealCatalogMatch}
              isCatalogMode={isCatalogMode}
              onToggleCatalogMode={handleToggleCatalogMode}
              onOpenShelfModal={() => setIsShelfModalOpen(true)}
            />
          </div>
        </div>
      </main>

      {/* 3. Footer */}
      <footer className="w-full border-t border-slate-900 bg-slate-950/60 py-4 text-center text-xs text-slate-500 font-mono">
        <span>Система Аньянова © 2026 • Стильно, легко и безошибочно</span>
      </footer>

      {/* 4. Modals */}
      <ManifestoModal
        isOpen={isManifestoOpen}
        onClose={() => setIsManifestoOpen(false)}
      />

      <FragranceShelfModal
        isOpen={isShelfModalOpen}
        onClose={() => setIsShelfModalOpen(false)}
        ownedIds={userShelfIds}
        onUpdateOwnedIds={handleUpdateShelfIds}
      />
    </div>
  );
}

export default App;
