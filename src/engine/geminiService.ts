export interface CalibratedNoteItem {
  name: string;
  symbol: string;
  tier: 'top' | 'heart' | 'base';
  distanceX: number;
  thermoY: number;
  massWeight: number;
  category: string;
  resonantFabrics: string[];
  vibeDescription: string;
}

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
  calibratedNotes?: CalibratedNoteItem[];
  predictedCoords?: { x: number; y: number };
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

  const prompt = `Ты — ведущий мировой ольфакторный архивариус, химик-парфюмер и эксперт по базе Fragrantica (fragrantica.com и fragrantica.ru), а также эксперт по Системе координат нот Аньянова.

Твоя ГЛАВНАЯ задача:
1. Через веб-поиск Google найти официальную карточку данного аромата на FRAGRANTICA и вернуть СТРОГО ОФИЦИАЛЬНУЮ пирамиду нот (Top, Heart, Base).
2. Выступить в роли эксперта-ольфактора: для КАЖДОЙ найденной ноты пирамиды определить физико-математические координаты в Периодической системе элементов Аньянова.

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
   Переводи ингредиенты точно (например: Akigalawood -> Акигалавуд, Amberwood -> Амбервуд, Geranium -> Герань, Saffron -> Шафран, Italian Mandarin -> Итальянский мандарин, Somali Incense -> Сомалийский ладан, Labdanum -> Лабданум, Benzoin -> Бензоин, Immortelle -> Бессмертник, Tonka Bean -> Бобы тонка).
   КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО выдумывать ноты, которых нет в пирамиде на Fragrantica!

ПРАВИЛА ОЛЬФАКТОРНОЙ КАЛИБРОВКИ НОТ (СИСТЕМА АНЬЯНОВА):
Для каждой ноты из top, heart, base рассчитай параметры:
- distanceX (число от -1.00 до +1.00, Социальная дистанция / Барьер vs Соблазн):
  * -1.00 .. -0.20 (Холодный авторитет, дистанция, дисциплина): кожа, деготь, уд, дубовый мох, ладан, ветивер, минералы, розмарин.
  * -0.20 .. +0.20 (Нейтральный баланс, цитрусы, чистые альдегиды, чай, ирис).
  * +0.20 .. +1.00 (Сближение, соблазн, интим, тепло): ваниль, пралине, финики, кокос, бобы тонка, карамель, корица, амбра, мускус, сладкие фрукты.
- thermoY (число от -1.00 до +1.00, Температура / Термодинамика):
  * +0.20 .. +1.00 (Холод, свежесть, лето, день, озон): цитрусы, акватика, мята, бергамот, зеленый чай, эвкалипт.
  * -0.20 .. +0.20 (Умеренный демисезон): ирис, лаванда, розовый перец, кедр, шафран.
  * -1.00 .. -0.20 (Тепло, согревающий огонь, вечер, зима, плотность): густые смолы, табак, кофе, корица, ваниль, бензоин, лабданум, кашеран.
- massWeight (число от 0.20 до 0.95, Молекулярная масса и стойкость ноты):
  * Летучий верх (цитрусы, травы, мята): 0.25 - 0.40
  * Сердечные аккорды (цветы, пряности, чай, кофе): 0.45 - 0.65
  * Тяжелая база и фиксаторы (уд, смолы, кожа, амбра, мох): 0.70 - 0.95
- symbol: химический символ ноты из 2-3 латинских букв (напр. 'Akg', 'Saf', 'Lbd', 'Bnz', 'Vn', 'Ir', 'Om')
- category: категория ('Древесные', 'Пряные', 'Гурманские', 'Шипровые', 'Цитрусовые', 'Смолы / Бальзамы', 'Кожаные', 'Цветочные', 'Минеральные')
- resonantFabrics: массив резонирующих тканей из ('Шерсть', 'Кашемир', 'Твид', 'Хлопок', 'Лен', 'Шелк', 'Кожа', 'Фланель', 'Драп', 'Поплин')
- vibeDescription: емкая характеристика ноты на русском языке (5-10 слов)

Также определи:
- diffusion: "Интимная" | "Умеренная" | "Шлейфовая" | "Ударная"
- dominantVibe: краткий емкий вайб звучания всего флакона (5-8 слов)
- bestOccasion: лучший повод для ношения
- whyFitsOutfit: с какими фактурами одежды лучше всего сочетается
- predictedCoords: { "x": число от -1.00 до +1.00, "y": число от -1.00 до +1.00 } - общее взвешенное положение флакона на матрице

ФОРМАТ ВЫВОДА:
Верни ТОЛЬКО валидный JSON (без лишнего текста):
{
  "normalizedBrand": "${brand}",
  "normalizedName": "${name}",
  "top": ["Нота 1", "Нота 2"],
  "heart": ["Нота 1", "Нота 2"],
  "base": ["Нота 1", "Нота 2"],
  "calibratedNotes": [
    {
      "name": "Нота 1",
      "symbol": "Nt",
      "tier": "top",
      "distanceX": 0.10,
      "thermoY": 0.85,
      "massWeight": 0.30,
      "category": "Цитрусовые",
      "resonantFabrics": ["Хлопок", "Лен"],
      "vibeDescription": "Искрящаяся цитрусовая свежесть"
    }
  ],
  "predictedCoords": { "x": 0.05, "y": 0.35 },
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

    // Нормализация калиброванных нот
    let calibratedNotes: CalibratedNoteItem[] | undefined = undefined;
    if (Array.isArray(parsed.calibratedNotes)) {
      calibratedNotes = parsed.calibratedNotes.map((cn: any) => ({
        name: String(cn.name || '').trim(),
        symbol: String(cn.symbol || 'Nt').trim().slice(0, 4),
        tier: ['top', 'heart', 'base'].includes(cn.tier) ? cn.tier : 'heart',
        distanceX: Number(Math.max(-1.0, Math.min(1.0, Number(cn.distanceX) || 0)).toFixed(2)),
        thermoY: Number(Math.max(-1.0, Math.min(1.0, Number(cn.thermoY) || 0)).toFixed(2)),
        massWeight: Number(Math.max(0.1, Math.min(1.0, Number(cn.massWeight) || 0.5)).toFixed(2)),
        category: String(cn.category || 'Восточные / Древесные').trim(),
        resonantFabrics: Array.isArray(cn.resonantFabrics) && cn.resonantFabrics.length > 0
          ? cn.resonantFabrics.map((f: any) => String(f).trim())
          : ['Шерсть', 'Хлопок'],
        vibeDescription: String(cn.vibeDescription || '').trim() || 'Ольфакторный аккорд',
      })).filter((cn: CalibratedNoteItem) => cn.name.length > 0);
    }

    // Нормализация общих предсказанных координат
    let predictedCoords: { x: number; y: number } | undefined = undefined;
    if (parsed.predictedCoords && typeof parsed.predictedCoords === 'object') {
      const px = Number(parsed.predictedCoords.x);
      const py = Number(parsed.predictedCoords.y);
      if (!isNaN(px) && !isNaN(py)) {
        predictedCoords = {
          x: Number(Math.max(-1.0, Math.min(1.0, px)).toFixed(2)),
          y: Number(Math.max(-1.0, Math.min(1.0, py)).toFixed(2)),
        };
      }
    }

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
      calibratedNotes,
      predictedCoords,
    };
  } catch (err) {
    console.error('Ошибка парсинга ответа Gemini:', textContent);
    throw new Error(`Не удалось распарсить ответ Gemini как JSON: ${err}`);
  }
}
