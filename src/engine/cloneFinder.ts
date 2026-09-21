import { PerfumeItem, PerfumeNotePyramid } from '../types';
import { PERFUME_DATABASE } from '../data/fragrances';
import {
  KNOWN_FRAGRANCES_CATALOG,
  findKnownFragrance,
  predictNotesFromFragranceName,
  calculatePerfumeCoordinatesFromNotes,
} from './perfumeIntelligence';
import {
  getPerfumeAestheticVector,
  calculateWeightedDistance,
  calculateCosineSimilarity,
} from './styleSolfeggio';
import { calculateCoordDistance } from '../data/brandMatrixData';

export interface FuzzyPerfumeSuggestion {
  name: string;
  brand: string;
  fullName: string;
  matchedTokensCount: number;
}

export interface TargetPerfumeProfile {
  name: string;
  brand: string;
  xCoord: number;
  yCoord: number;
  pyramid: PerfumeNotePyramid;
  dominantVibe: string;
  source: 'database' | 'known_catalog' | 'predicted';
  matchedDatabaseItem?: PerfumeItem;
  isRecognized: boolean; // Подтвержденный официальный аромат
}

export interface AnyanovCalculationDetails {
  dx: number; // Разница по оси намерения (X)
  dy: number; // Разница по оси термодинамики среды (Y)
  delta2D: number; // 2D дельта по формуле Аньянова: sqrt(dx^2 + dy^2)
  delta10D: number; // Взвешенная дистанция 10D Сольфеджио
  cosineSimilarity: number; // Косинусное сходство 10D векторов
  spatialScore: number; // Балл близости дельты (0..100)
  solfeggioScore: number; // Балл 10D Сольфеджио (0..100)
  noteScore: number; // Балл совпадения ольфакторной пирамиды (0..100)
  harmonyState: 'UNISON' | 'CONTRAPUNCT' | 'DIVERGENCE';
  harmonyStateLabel: string;
}

export interface CloneMatchItem {
  perfume: PerfumeItem;
  similarityPercentage: number;
  isExactDirectClone: boolean;
  sharedNotes: string[];
  contrastNotes: string[];
  distance: number;
  calculation: AnyanovCalculationDetails;
  whySimilar: string;
  nuanceDifference: string;
  styleAdvice: string;
  isOwned: boolean;
}

export interface CloneFinderResult {
  query: string;
  isFound: boolean;
  suggestion: FuzzyPerfumeSuggestion | null;
  target: TargetPerfumeProfile;
  bestClone: CloneMatchItem | null;
  alternativeClones: CloneMatchItem[];
  allRanked: CloneMatchItem[];
}

/**
 * Нормализация строк для сравнения
 */
export function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .replace(/[«»""''`]/g, '')
    .replace(/[^a-z0-9а-яё]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Извлечение значимых токенов (слов)
 */
function extractTokens(str: string): string[] {
  return normalizeString(str)
    .split(' ')
    .map((w) => w.trim())
    .filter((w) => w.length >= 3);
}

/**
 * Вычисление расстояния Левенштейна
 */
function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }

  return dp[m][n];
}

/**
 * Поиск подсказки-опечатки среди реальных ароматов базы и каталога
 */
export function findFuzzySuggestion(rawQuery: string): FuzzyPerfumeSuggestion | null {
  const qTokens = extractTokens(rawQuery);
  if (qTokens.length === 0) return null;

  const normQuery = normalizeString(rawQuery);

  const allKnownCandidates: Array<{ name: string; brand: string; fullName: string; aliases?: string[] }> = [
    ...PERFUME_DATABASE.map((p) => ({
      name: p.name,
      brand: p.brand,
      fullName: `${p.brand} ${p.name}`,
    })),
    ...KNOWN_FRAGRANCES_CATALOG.map((k) => ({
      name: k.name,
      brand: k.brand,
      fullName: `${k.brand} ${k.name}`,
      aliases: k.aliases,
    })),
  ];

  let bestSuggestion: FuzzyPerfumeSuggestion | null = null;
  let maxScore = 0;

  for (const item of allKnownCandidates) {
    const itemTokens = extractTokens(`${item.fullName} ${(item.aliases || []).join(' ')}`);
    const normItemName = normalizeString(item.fullName);

    let matchedTokens = 0;
    for (const qTok of qTokens) {
      const match = itemTokens.some((iTok) => {
        if (iTok === qTok) return true;
        if (iTok.startsWith(qTok) || qTok.startsWith(iTok)) return true;
        if (qTok.length >= 4 && iTok.length >= 4 && levenshteinDistance(qTok, iTok) <= 1) return true;
        return false;
      });
      if (match) matchedTokens++;
    }

    const tokenOverlapRatio = matchedTokens / qTokens.length;
    let score = matchedTokens * 25 + tokenOverlapRatio * 50;

    const normBrand = normalizeString(item.brand);
    if (qTokens.some((t) => normBrand.includes(t))) {
      score += 30;
    }

    const hasDistinctToken = qTokens.some(
      (t) => t.length >= 5 && itemTokens.some((it) => it.includes(t) || t.includes(it))
    );
    if (hasDistinctToken) {
      score += 25;
    }

    if (normQuery.length >= 5 && normItemName.length >= 5) {
      const lev = levenshteinDistance(normQuery, normItemName);
      if (lev <= 3) {
        score += 80;
      }
    }

    if (matchedTokens >= 2 || (qTokens.length <= 2 && matchedTokens >= 1 && score >= 60)) {
      if (score > maxScore) {
        maxScore = score;
        bestSuggestion = {
          name: item.name,
          brand: item.brand,
          fullName: item.fullName,
          matchedTokensCount: matchedTokens,
        };
      }
    }
  }

  return bestSuggestion;
}

/**
 * Проверка, является ли запрос реальным признанным парфюмом
 */
export function resolveTargetPerfume(rawQuery: string): {
  target: TargetPerfumeProfile;
  isFound: boolean;
  suggestion: FuzzyPerfumeSuggestion | null;
} {
  const cleanQuery = rawQuery.trim();
  const normalizedQuery = normalizeString(cleanQuery);
  const qTokens = extractTokens(cleanQuery);

  // 1. Точный поиск в локальной базе PERFUME_DATABASE
  const dbMatch = PERFUME_DATABASE.find((item) => {
    const nName = normalizeString(item.name);
    const nBrand = normalizeString(item.brand);
    const nFullName = `${nBrand} ${nName}`;

    if (nFullName === normalizedQuery || nName === normalizedQuery) return true;

    if (normalizedQuery.length >= 6) {
      const itemTokens = extractTokens(nFullName);
      const allQueryTokensInItem =
        qTokens.length >= 2 &&
        qTokens.every((t) => itemTokens.some((it) => it.includes(t) || t.includes(it)));
      if (allQueryTokensInItem) return true;
    }

    return false;
  });

  if (dbMatch) {
    return {
      target: {
        name: dbMatch.name,
        brand: dbMatch.brand,
        xCoord: dbMatch.xCoord,
        yCoord: dbMatch.yCoord,
        pyramid: dbMatch.pyramid,
        dominantVibe: dbMatch.dominantVibe,
        source: 'database',
        matchedDatabaseItem: dbMatch,
        isRecognized: true,
      },
      isFound: true,
      suggestion: null,
    };
  }

  // 2. Поиск в каталоге известных ароматов KNOWN_FRAGRANCES_CATALOG
  const knownMatch = findKnownFragrance('', cleanQuery);
  if (knownMatch) {
    const coordsMeta = calculatePerfumeCoordinatesFromNotes(
      knownMatch.pyramid,
      knownMatch.dominantVibe
    );
    return {
      target: {
        name: knownMatch.name,
        brand: knownMatch.brand,
        xCoord: coordsMeta.xCoord,
        yCoord: coordsMeta.yCoord,
        pyramid: knownMatch.pyramid,
        dominantVibe: knownMatch.dominantVibe || `${knownMatch.brand} ${knownMatch.name}`,
        source: 'known_catalog',
        isRecognized: true,
      },
      isFound: true,
      suggestion: null,
    };
  }

  // 3. Если прямого совпадения нет — ищем опечатку
  const suggestion = findFuzzySuggestion(cleanQuery);

  // 4. Запрос НЕ НАЙДЕН в базах
  const guessedBrand = cleanQuery.split(' ')[0] || 'Unknown';
  const guessedName = cleanQuery.slice(guessedBrand.length).trim() || cleanQuery;
  const predictedPyramid = predictNotesFromFragranceName(guessedBrand, guessedName);
  const calculatedMeta = calculatePerfumeCoordinatesFromNotes(predictedPyramid);

  return {
    target: {
      name: guessedName,
      brand: guessedBrand,
      xCoord: calculatedMeta.xCoord,
      yCoord: calculatedMeta.yCoord,
      pyramid: predictedPyramid,
      dominantVibe: calculatedMeta.dominantVibe,
      source: 'predicted',
      isRecognized: false,
    },
    isFound: false,
    suggestion,
  };
}

/**
 * Семантические кластеры аккордов нот
 */
const NOTE_CHORD_CLUSTERS: string[][] = [
  ['морские ноты', 'водные ноты', 'морская вода', 'акватика', 'акватические ноты', 'океанические ноты', 'морской бриз', 'морская соль', 'водный аккорд'],
  ['бергамот', 'грейпфрут', 'лимон', 'мандарин', 'лайм', 'юзу', 'апельсин', 'лемонграсс', 'калабрийский бергамот'],
  ['серая амбра', 'амбра', 'амброксан', 'amberwood', 'амбервуд'],
  ['белый кедр', 'кедр', 'вирджинский кедр'],
  ['пачули', 'индонезийские пачули'],
  ['лаванда', 'французская лаванда'],
  ['жасмин', 'самбак', 'марокканский жасмин'],
  ['сандал', 'белый сандал'],
  ['мускус', 'белый мускус'],
  ['розовый перец', 'сычуаньский перец', 'черный перец', 'перец'],
  ['корица', 'кардамон', 'мускатный орех', 'гвоздика'],
  ['гуаяк', 'дерево гуаяк', 'древесные ноты'],
];

function areNotesSynonymous(n1: string, n2: string): boolean {
  if (n1 === n2 || n1.includes(n2) || n2.includes(n1)) return true;
  if (n1.length >= 4 && n2.startsWith(n1.slice(0, 4))) return true;
  for (const cluster of NOTE_CHORD_CLUSTERS) {
    const has1 = cluster.some((c) => n1.includes(c) || c.includes(n1));
    const has2 = cluster.some((c) => n2.includes(c) || c.includes(n2));
    if (has1 && has2) return true;
  }
  return false;
}

/**
 * Подсчет пересекающихся и контрастных нот
 */
function comparePyramids(
  targetPyramid: PerfumeNotePyramid,
  candPyramid: PerfumeNotePyramid
): {
  sharedNotes: string[];
  contrastNotes: string[];
  noteMatchScore: number;
} {
  const targetAll = [
    ...targetPyramid.base.map((n) => ({ note: n.toLowerCase(), weight: 1.6 })),
    ...targetPyramid.heart.map((n) => ({ note: n.toLowerCase(), weight: 1.2 })),
    ...targetPyramid.top.map((n) => ({ note: n.toLowerCase(), weight: 0.8 })),
  ];

  const candBaseLower = candPyramid.base.map((n) => n.toLowerCase());
  const candHeartLower = candPyramid.heart.map((n) => n.toLowerCase());
  const candTopLower = candPyramid.top.map((n) => n.toLowerCase());
  const candAllLower = [...candBaseLower, ...candHeartLower, ...candTopLower];

  const sharedSet = new Set<string>();
  let totalTargetWeight = 0;
  let matchedWeight = 0;

  targetAll.forEach(({ note, weight }) => {
    totalTargetWeight += weight;
    const hasMatch = candAllLower.some((candNote) => areNotesSynonymous(note, candNote));

    if (hasMatch) {
      matchedWeight += weight;
      sharedSet.add(note.charAt(0).toUpperCase() + note.slice(1));
    }
  });

  const sharedNotes = Array.from(sharedSet);

  const candRawAll = [...candPyramid.heart, ...candPyramid.base];
  const contrastNotes = candRawAll
    .filter((n) => !sharedNotes.some((s) => s.toLowerCase() === n.toLowerCase()))
    .slice(0, 3);

  const noteMatchScore = totalTargetWeight > 0 ? (matchedWeight / totalTargetWeight) * 100 : 40;

  return {
    sharedNotes,
    contrastNotes,
    noteMatchScore,
  };
}

/**
 * Основная функция поиска клонов и аналогов строго по методике расчетов Системы Аньянова
 */
export function findPerfumeClones(
  rawQuery: string,
  options?: {
    pool?: PerfumeItem[];
    userShelfIds?: string[];
  }
): CloneFinderResult {
  const query = rawQuery.trim();
  const { target, isFound, suggestion } = resolveTargetPerfume(query);
  const databasePool = options?.pool || PERFUME_DATABASE;
  const userShelfSet = new Set(options?.userShelfIds || []);

  if (!isFound) {
    return {
      query,
      isFound: false,
      suggestion,
      target,
      bestClone: null,
      alternativeClones: [],
      allRanked: [],
    };
  }

  // Создаем 10D вектор Системы Аньянова для целевого аромата
  const dummyTargetItem: PerfumeItem = {
    id: target.matchedDatabaseItem?.id || 'target',
    name: target.name,
    brand: target.brand,
    xCoord: target.xCoord,
    yCoord: target.yCoord,
    diffusion: target.matchedDatabaseItem?.diffusion || 'Шлейфовая',
    pyramid: target.pyramid,
    dominantVibe: target.dominantVibe,
    bestOccasion: '',
    whyFitsOutfit: '',
    colorTheme: '',
  };
  const vTarget = getPerfumeAestheticVector(dummyTargetItem);

  const rankedCandidates: CloneMatchItem[] = databasePool
    .filter((item) => {
      // Исключаем тот же самый объект
      if (target.matchedDatabaseItem && target.matchedDatabaseItem.id === item.id) {
        return true;
      }
      return true;
    })
    .map((candidate) => {
      const isSelf = target.matchedDatabaseItem?.id === candidate.id;

      // =========================================================================
      // ТОЧНЫЙ МАТЕМАТИЧЕСКИЙ РАСЧЕТ СИСТЕМЫ АНЬЯНОВА:
      // =========================================================================

      // 1. Дельта 2D координат в матрице Аньянова
      const dx = Number(Math.abs(target.xCoord - candidate.xCoord).toFixed(2));
      const dy = Number(Math.abs(target.yCoord - candidate.yCoord).toFixed(2));
      const delta2D = Number(Math.sqrt(dx * dx + dy * dy).toFixed(2));

      // 2. 10D Сольфеджио векторы Системы Аньянова
      const vCand = getPerfumeAestheticVector(candidate);
      const delta10D = Number(calculateWeightedDistance(vTarget, vCand).toFixed(3));
      const cosineSimilarity = Number(calculateCosineSimilarity(vTarget, vCand).toFixed(3));

      // 3. Пирамида нот и аккордов
      const { sharedNotes, contrastNotes, noteMatchScore } = comparePyramids(
        target.pyramid,
        candidate.pyramid
      );

      // 4. Определение статуса гармонии по шкале дельты Аньянова
      let harmonyState: 'UNISON' | 'CONTRAPUNCT' | 'DIVERGENCE' = 'DIVERGENCE';
      let harmonyStateLabel = '';

      if (isSelf || delta2D <= 0.25) {
        harmonyState = 'UNISON';
        harmonyStateLabel = `Канонический Унисон (Δ = ${delta2D}) • Прямой клон`;
      } else if (delta2D <= 0.45) {
        harmonyState = 'CONTRAPUNCT';
        harmonyStateLabel = `Благородный Контрапункт (Δ = ${delta2D}) • Ольфакторный аналог`;
      } else {
        harmonyState = 'DIVERGENCE';
        harmonyStateLabel = `Дивергенция (Δ = ${delta2D}) • Далекий регистр`;
      }

      // 5. Расчет процентов подобия:
      // Базовый пространственный балл по дельте:
      // При Delta = 0.00 -> 100%
      // При Delta = 0.22 -> 88%
      // При Delta = 0.35 -> 79%
      // При Delta = 0.70 -> 58%
      const spatialScore = isSelf
        ? 100
        : Math.max(10, Math.min(100, Math.round(100 - delta2D * 55)));

      const solfeggioScore = isSelf
        ? 100
        : Math.max(10, Math.min(100, Math.round(cosineSimilarity * 100)));

      const noteScore = isSelf ? 100 : Math.round(noteMatchScore);

      // Комплексная формула подобия Аньянова:
      // 55% Пространственная дельта координат + 25% 10D Сольфеджио + 20% Ноты
      let similarityPercentage = isSelf
        ? 100
        : Math.round(spatialScore * 0.55 + solfeggioScore * 0.25 + noteScore * 0.20);

      // Штраф за диаметрально противоположные квадранты
      if (target.xCoord * candidate.xCoord < -0.15 || target.yCoord * candidate.yCoord < -0.15) {
        similarityPercentage = Math.max(15, similarityPercentage - 20);
      }

      const isExactDirectClone = delta2D <= 0.25 && similarityPercentage >= 70;

      // 6. Формирование экспертного комментария по расчетам
      let whySimilar = '';
      let nuanceDifference = '';

      if (isSelf) {
        whySimilar = 'Это оригинальный эталон из нашей базы: 100% соответствие формуле и координатам.';
        nuanceDifference = 'Полная аутентичность канонической версии.';
      } else {
        whySimilar = `По расчету Системы Аньянова дельта расстояния составляет всего Δ = ${delta2D} (ΔX: ${dx}, ΔY: ${dy}). Векторы сходятся в одном квадранте с косинусным подобием ${cosineSimilarity}. Общие ноты: ${sharedNotes.slice(0, 4).join(', ') || 'ольфакторный каркас'}.`;
        if (contrastNotes.length > 0) {
          nuanceDifference = `При совпадении пространственного следа в звучании выделяются нюансы: ${contrastNotes.join(', ')}.`;
        } else {
          nuanceDifference = 'Очень плотная ольфакторная сборка, идеальное совпадение раскрытия.';
        }
      }

      let styleAdvice = 'Гармонично дополнит ваш повседневный гардероб.';
      if (candidate.yCoord < -0.3) {
        styleAdvice = 'Идеален под плотные фактуры: кашемировое пальто, шерстяной трикотаж или темный пиджак.';
      } else if (candidate.yCoord > 0.4) {
        styleAdvice = 'Превосходно звучит с хрустящим хлопком сорочки, льняными вещами и легким блейзером.';
      } else if (candidate.xCoord < -0.4) {
        styleAdvice = 'Держит четкую статусную дистанцию: надевайте под деловой костюм или вощеную куртку.';
      } else {
        styleAdvice = 'Создает расслабленную и соблазнительную атмосферу для вечера и встреч с друзьями.';
      }

      const calculation: AnyanovCalculationDetails = {
        dx,
        dy,
        delta2D,
        delta10D,
        cosineSimilarity,
        spatialScore,
        solfeggioScore,
        noteScore,
        harmonyState,
        harmonyStateLabel,
      };

      return {
        perfume: candidate,
        similarityPercentage,
        isExactDirectClone,
        sharedNotes,
        contrastNotes,
        distance: delta2D,
        calculation,
        whySimilar,
        nuanceDifference,
        styleAdvice,
        isOwned: userShelfSet.has(candidate.id),
      };
    });

  // Сортировка строго по методике Аньянова:
  // 1. По наименьшей дельте delta2D
  // 2. При близкой дельте — по similarityPercentage
  rankedCandidates.sort((a, b) => {
    const diffD = a.calculation.delta2D - b.calculation.delta2D;
    if (Math.abs(diffD) > 0.05) {
      return diffD; // Меньшая дельта всегда побеждает!
    }
    return b.similarityPercentage - a.similarityPercentage;
  });

  let bestClone: CloneMatchItem | null = null;
  let alternativeClones: CloneMatchItem[] = [];

  if (rankedCandidates.length > 0) {
    if (rankedCandidates[0].similarityPercentage === 100 && rankedCandidates.length > 1) {
      bestClone = rankedCandidates[1];
      alternativeClones = [rankedCandidates[0], ...rankedCandidates.slice(2, 6)];
    } else {
      bestClone = rankedCandidates[0];
      alternativeClones = rankedCandidates.slice(1, 6);
    }
  }

  return {
    query,
    isFound: true,
    suggestion: null,
    target,
    bestClone,
    alternativeClones,
    allRanked: rankedCandidates,
  };
}
