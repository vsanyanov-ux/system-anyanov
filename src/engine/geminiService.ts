import { PerfumeNotePyramid } from '../types';

export interface GeminiPerfumeAnalysis {
  normalizedBrand?: string;
  normalizedName?: string;
  top: string[];
  heart: string[];
  base: string[];
  diffusion: 'Интимная' | 'Умеренная' | 'Шлейфовая' | 'Ударная';
  dominantVibe: string;
  bestOccasion: string;
  whyFitsOutfit?: string;
  confidenceNotes?: string;
}

const STORAGE_KEY_GEMINI = 'anyanov_gemini_api_key_v1';

export function getStoredGeminiApiKey(): string {
  try {
    const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
    if (envKey && typeof envKey === 'string' && envKey.trim().length > 0) {
      return envKey.trim();
    }
  } catch {
    // env not available
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY_GEMINI);
    return saved ? saved.trim() : '';
  } catch {
    return '';
  }
}

export function saveStoredGeminiApiKey(key: string): void {
  try {
    if (key.trim()) {
      localStorage.setItem(STORAGE_KEY_GEMINI, key.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY_GEMINI);
    }
  } catch (e) {
    console.warn('Не удалось сохранить Gemini API ключ в LocalStorage:', e);
  }
}

/**
 * Нормализация типичных опечаток и голосового ввода перед запросом
 */
export function preNormalizeFragranceInput(brand: string, name: string): { brand: string; name: string } {
  let b = brand.trim();
  let n = name.trim();

  const lowerB = b.toLowerCase();
  const lowerN = n.toLowerCase();

  // Распознавание голосового ввода для Lattafa Musamam и фланкеров
  if (lowerB.includes('лотаф') || lowerB.includes('латтаф')) {
    b = 'Lattafa';
  }

  if (
    lowerN.includes('вайтингаем') ||
    lowerN.includes('вайт интенс') ||
    lowerN.includes('white intense') ||
    lowerN.includes('белый мусамам') ||
    lowerN.includes('мусамам вайт')
  ) {
    n = 'Musamam White Intense';
    if (!b || b.toLowerCase() === 'custom') b = 'Lattafa';
  } else if (
    lowerN.includes('мы самам') ||
    lowerN.includes('мусамам') ||
    lowerN === 'musamam'
  ) {
    n = 'Musamam';
    if (!b || b.toLowerCase() === 'custom') b = 'Lattafa';
  } else if (lowerN.includes('хамра') || lowerN.includes('камрах')) {
    n = 'Khamrah';
    if (!b) b = 'Lattafa';
  } else if (lowerN.includes('асад') || lowerN.includes('asad')) {
    n = 'Asad';
    if (!b) b = 'Lattafa';
  }

  return { brand: b, name: n };
}

/**
 * Парсер скопированного текста нот напрямую со страниц Fragrantica (RU или EN)
 */
export function parseFragranticaNotesText(raw: string): { top: string[]; heart: string[]; base: string[] } | null {
  if (!raw || raw.trim().length < 4) return null;

  const cleanNote = (str: string) =>
    str
      .replace(/^[\s\-–—•\*\d\.]+/g, '')
      .replace(/\s*(?:and|и|&)\s*$/gi, '')
      .trim();

  const splitNotes = (str: string) =>
    str
      .split(/[,;\n\r•]+|\s+(?:and|и)\s+/i)
      .map(cleanNote)
      .filter((n) => n.length > 1 && !/^(ноты|notes|top|heart|middle|base|базовые|верхние|средние)$/i.test(n));

  const text = raw.replace(/\r\n/g, '\n');

  const topMatch = text.match(
    /(?:верхние\s+ноты|top\s+notes?|верх|top)[\s:—–-]+([\s\S]*?)(?=(?:средние\s+ноты|ноты\s+сердца|middle\s+notes?|heart\s+notes?|сердце|базовые\s+ноты|base\s+notes?|база|$))/i
  );
  const heartMatch = text.match(
    /(?:средние\s+ноты|ноты\s+сердца|middle\s+notes?|heart\s+notes?|сердце|heart)[\s:—–-]+([\s\S]*?)(?=(?:базовые\s+ноты|base\s+notes?|база|$))/i
  );
  const baseMatch = text.match(
    /(?:базовые\s+ноты|base\s+notes?|база|base)[\s:—–-]+([\s\S]*?)(?=$)/i
  );

  if (topMatch || heartMatch || baseMatch) {
    return {
      top: topMatch ? splitNotes(topMatch[1]) : [],
      heart: heartMatch ? splitNotes(heartMatch[1]) : [],
      base: baseMatch ? splitNotes(baseMatch[1]) : [],
    };
  }

  return null;
}

/**
 * Запрос к Google Gemini API с использованием Google Search Grounding для поиска по Fragrantica
 */
export async function fetchPerfumeNotesWithGemini(
  rawBrand: string,
  rawName: string,
  customApiKey?: string
): Promise<GeminiPerfumeAnalysis> {
  const apiKey = (customApiKey || getStoredGeminiApiKey()).trim();

  if (!apiKey) {
    throw new Error('API ключ Google Gemini не указан. Пожалуйста, введите ключ Google Gemini в настройках.');
  }

  const { brand, name } = preNormalizeFragranceInput(rawBrand, rawName);

  const prompt = `Ты — ведущий мировой ольфакторный архивариус и эксперт по базе Fragrantica (fragrantica.com и fragrantica.ru).
Твоя ГЛАВНАЯ задача — через веб-поиск Google найти карточку данного аромата на FRAGRANTICA и вернуть СТРОГО ОФИЦИАЛЬНУЮ пирамиду нот, указанную на Fragrantica.

Запрос для поиска:
Бренд: "${brand}"
Название аромата: "${name}"

ИНСТРУКЦИЯ ПОИСКА:
1. Выполни поиск по сайту Fragrantica:
   "${brand}" "${name}" site:fragrantica.com OR site:fragrantica.ru
2. Найди точную карточку аромата:
   - Если указан фланкер (напр. Intense, Elixir, Parfum, White, Black), найди именно этот фланкер.
   - Если указан базовый релиз (напр. "Musamam", "Aventus", "Sauvage"), найди именно оригинальный флакон, не путая его с фланкерами.
3. Извлеки официальную пирамиду нот строго по карточке Fragrantica:
   - top: Верхние ноты (Top Notes) на русском языке
   - heart: Ноты сердца / средние ноты (Middle / Heart Notes) на русском языке
   - base: Базовые ноты (Base Notes) на русском языке
   Переводи ингредиенты точно (например: Akigalawood -> Акигалавуд, Amberwood -> Амбервуд, Geranium -> Герань, Saffron -> Шафран, Italian Mandarin -> Итальянский мандарин, Somali Incense -> Сомалийский ладан, Labdanum -> Лабданум, Benzoin -> Бензоин).
   КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО выдумывать ноты или добавлять стандартные "уд" или "кожу", если их нет в пирамиде на Fragrantica!
4. Определи характеристики:
   - diffusion: "Интимная" | "Умеренная" | "Шлейфовая" | "Ударная"
   - dominantVibe: краткий емкий вайб звучания (5-8 слов)
   - bestOccasion: повод для ношения
   - whyFitsOutfit: с какими тканями и стилем одежды лучше резонирует

ФОРМАТ ВЫВОДА:
Верни ТОЛЬКО валидный JSON (без лишнего текста перед или после):
{
  "normalizedBrand": "${brand}",
  "normalizedName": "${name}",
  "top": ["Нота 1", "Нота 2"],
  "heart": ["Нота 1", "Нота 2"],
  "base": ["Нота 1", "Нота 2"],
  "diffusion": "Шлейфовая",
  "dominantVibe": "...",
  "bestOccasion": "...",
  "whyFitsOutfit": "..."
}`;

  // Функция вызова API с возможностью использования Google Search Grounding
  const callModel = async (model: string, useGoogleSearch: boolean) => {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const body: any = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.1,
      },
    };

    if (useGoogleSearch) {
      body.tools = [{ googleSearch: {} }];
    } else {
      body.generationConfig.responseMimeType = 'application/json';
    }

    return fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  };

  // 1. Попытка: Gemini 2.5 Flash с Google Search Grounding (живой поиск по Fragrantica)
  let response = await callModel('gemini-2.5-flash', true);

  // 2. Если 2.5 с поиском недоступен или ошибка, пробуем 1.5-flash с поиском
  if (!response.ok && (response.status === 404 || response.status === 400)) {
    console.warn('Gemini 2.5 Flash с Google Search вернул статус', response.status, 'пробуем Gemini 1.5 Flash с поиском...');
    response = await callModel('gemini-1.5-flash', true);
  }

  // 3. Если инструмент Google Search не поддерживается ключом или квотой, фоллбек на прямой режим
  if (!response.ok && response.status === 400) {
    console.warn('Google Search Grounding отклонен API, выполняем запрос в прямом режиме...');
    response = await callModel('gemini-2.5-flash', false);
    if (!response.ok && response.status === 404) {
      response = await callModel('gemini-1.5-flash', false);
    }
  }

  if (!response.ok) {
    const errorDetails = await response.text();
    throw new Error(`Ошибка Gemini API (${response.status}): ${errorDetails}`);
  }

  const data = await response.json();
  return parseGeminiResponse(data, brand, name);
}

function parseGeminiResponse(data: any, fallbackBrand: string, fallbackName: string): GeminiPerfumeAnalysis {
  const candidate = data.candidates?.[0];
  let textContent = candidate?.content?.parts?.[0]?.text;

  if (!textContent && Array.isArray(candidate?.content?.parts)) {
    textContent = candidate.content.parts.map((p: any) => p.text || '').join('\n');
  }

  if (!textContent) {
    throw new Error('Gemini не вернул текстового ответа.');
  }

  // Очищаем от Markdown блоков ```json ... ```
  let cleanJson = textContent.trim();
  const jsonBlockMatch = cleanJson.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (jsonBlockMatch) {
    cleanJson = jsonBlockMatch[1].trim();
  } else {
    const firstBrace = cleanJson.indexOf('{');
    const lastBrace = cleanJson.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleanJson = cleanJson.substring(firstBrace, lastBrace + 1);
    }
  }

  try {
    const parsed = JSON.parse(cleanJson);
    return {
      normalizedBrand: parsed.normalizedBrand || fallbackBrand,
      normalizedName: parsed.normalizedName || fallbackName,
      top: Array.isArray(parsed.top) && parsed.top.length > 0 ? parsed.top : ['Бергамот'],
      heart: Array.isArray(parsed.heart) && parsed.heart.length > 0 ? parsed.heart : ['Ирис'],
      base: Array.isArray(parsed.base) && parsed.base.length > 0 ? parsed.base : ['Сандал', 'Бензоин', 'Мускус'],
      diffusion: ['Интимная', 'Умеренная', 'Шлейфовая', 'Ударная'].includes(parsed.diffusion)
        ? parsed.diffusion
        : 'Шлейфовая',
      dominantVibe: parsed.dominantVibe || 'Благородное звучание нот',
      bestOccasion: parsed.bestOccasion || 'Smart Casual, городские встречи',
      whyFitsOutfit: parsed.whyFitsOutfit || 'Поддерживает гармонию силуэта и натуральных тканей.',
    };
  } catch (err) {
    console.error('Ошибка парсинга ответа Gemini:', textContent);
    throw new Error(`Не удалось распарсить ответ Gemini как JSON: ${err}`);
  }
}
