import { useState, useMemo, useCallback } from 'react';
import { AnyanovCoordinates } from '../types';
import { STORAGE_KEYS, DEFAULT_COORDINATES } from '../constants/storage';
import { safeGetItem, safeSetItem, safeGetJson, safeSetJson } from '../utils/storage';
import { SHELF_PRESETS } from '../data/fragrances';
import { GOLDEN_PERFUME_IDS_21 } from '../data/golden21';
import { getQuadrantInfo } from '../engine/anyanovMatrix';
import { compileAnyanovOutfit } from '../engine/outfitCompiler';
import { matchAnyanovPerfume } from '../engine/fragranceMatcher';
import { analyzeStyleSolfeggio } from '../engine/styleSolfeggio';

export type AnyanovTab = 'simple' | 'pro' | 'benchmarks';

export function useAnyanovState() {
  // 1. Активная вкладка
  const [activeTab, setActiveTabState] = useState<AnyanovTab>(() => {
    const saved = safeGetItem(STORAGE_KEYS.TAB, 'simple');
    if (saved === 'pro' || saved === 'simple' || saved === 'benchmarks') {
      return saved as AnyanovTab;
    }
    return 'simple';
  });

  const setActiveTab = useCallback((tab: AnyanovTab) => {
    setActiveTabState(tab);
    safeSetItem(STORAGE_KEYS.TAB, tab);
  }, []);

  // 2. Режим 21 (Золотой Канон)
  const [is21Mode, setIs21ModeState] = useState<boolean>(() => {
    return safeGetItem(STORAGE_KEYS.MODE_21, 'false') === 'true';
  });

  const toggle21Mode = useCallback(() => {
    setIs21ModeState((prev) => {
      const next = !prev;
      safeSetItem(STORAGE_KEYS.MODE_21, String(next));
      return next;
    });
  }, []);

  // 3. Координаты Системы Аньянова
  const [coords, setCoords] = useState<AnyanovCoordinates>(DEFAULT_COORDINATES);

  const updateCoords = useCallback((partial: Partial<AnyanovCoordinates>) => {
    setCoords((prev) => ({ ...prev, ...partial }));
  }, []);

  // 4. Личная полка ароматов пользователя
  const [userShelfIds, setUserShelfIdsState] = useState<string[]>(() => {
    return safeGetJson<string[]>(
      STORAGE_KEYS.SHELF,
      SHELF_PRESETS[1].perfumeIds,
      (data): data is string[] => Array.isArray(data) && data.length > 0
    );
  });

  const updateShelfIds = useCallback((newIds: string[]) => {
    setUserShelfIdsState(newIds);
    safeSetJson(STORAGE_KEYS.SHELF, newIds);
  }, []);

  const toggleShelfId = useCallback((perfumeId: string) => {
    setUserShelfIdsState((prev) => {
      const next = prev.includes(perfumeId)
        ? prev.filter((id) => id !== perfumeId)
        : [...prev, perfumeId];
      safeSetJson(STORAGE_KEYS.SHELF, next);
      return next;
    });
  }, []);

  // 5. Режим подбора (false = полка, true = весь каталог)
  const [isCatalogMode, setIsCatalogModeState] = useState<boolean>(() => {
    return safeGetItem(STORAGE_KEYS.MODE, 'false') === 'true';
  });

  const toggleCatalogMode = useCallback(() => {
    setIsCatalogModeState((prev) => {
      const next = !prev;
      safeSetItem(STORAGE_KEYS.MODE, String(next));
      return next;
    });
  }, []);

  const loadGoldenShelf = useCallback(() => {
    updateShelfIds(GOLDEN_PERFUME_IDS_21);
    setIsCatalogModeState(false);
    safeSetItem(STORAGE_KEYS.MODE, 'false');
  }, [updateShelfIds]);

  // 6. Состояние открытия диалоговых модальных окон
  const [isManifestoOpen, setIsManifestoOpen] = useState(false);
  const [isShelfModalOpen, setIsShelfModalOpen] = useState(false);
  const [isPeriodicTableOpen, setIsPeriodicTableOpen] = useState(false);
  const [isHumanFinderOpen, setIsHumanFinderOpen] = useState(false);

  // 7. Мемоизированные вычисления движка
  const quadrant = useMemo(
    () => getQuadrantInfo(coords.socialX, coords.thermoY),
    [coords.socialX, coords.thermoY]
  );

  const { stack, rulesApplied } = useMemo(
    () => compileAnyanovOutfit(coords, is21Mode),
    [coords, is21Mode]
  );

  const matchResult = useMemo(
    () => matchAnyanovPerfume(coords, userShelfIds, isCatalogMode, is21Mode, stack),
    [coords, userShelfIds, isCatalogMode, is21Mode, stack]
  );

  const solfeggio = useMemo(
    () => analyzeStyleSolfeggio(stack, matchResult.perfume),
    [stack, matchResult.perfume]
  );

  return {
    // Вкладки и режимы
    activeTab,
    setActiveTab,
    is21Mode,
    toggle21Mode,

    // Координаты
    coords,
    setCoords,
    updateCoords,

    // Полка ароматов
    userShelfIds,
    updateShelfIds,
    toggleShelfId,
    loadGoldenShelf,
    isCatalogMode,
    toggleCatalogMode,

    // Модальные окна
    isManifestoOpen,
    setIsManifestoOpen,
    isShelfModalOpen,
    setIsShelfModalOpen,
    isPeriodicTableOpen,
    setIsPeriodicTableOpen,
    isHumanFinderOpen,
    setIsHumanFinderOpen,

    // Вычисляемые сущности
    quadrant,
    stack,
    rulesApplied,
    matchResult,
    solfeggio,
  };
}
