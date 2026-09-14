import { AnyanovCoordinates, QuadrantInfo, QuadrantType } from '../types';

export function getQuadrantInfo(x: number, y: number): QuadrantInfo {
  // x <= 0: Власть / Статус / Фокус
  // x > 0: Соблазн / Интим / Casual / Сближение
  // y >= 0: Холод / День / Лето / Быстрое действие
  // y < 0: Тепло / Вечер / Зима / Долгое действие

  if (x <= 0 && y >= 0) {
    return {
      code: 'NW_FOCUS',
      name: 'Собранность и Фокус',
      subtitle: 'Северо-Запад: Business Formal • Холод • Дистанция',
      primaryEnergy: 'Контроль, точность, эмоциональная нейтральность, дисциплина.',
      outfitDirection: 'Структурированные силуэты, четкие воротники, гладкие ткани, оксфорды.',
      perfumeDirection: 'Ледяной цитрон, альдегиды, сухой ирис, горький ветивер, мыльно-пудровая чистота.',
      color: '#38bdf8',
      bgColor: 'bg-sky-950/40',
      borderColor: 'border-sky-500/40'
    };
  } else if (x > 0 && y >= 0) {
    return {
      code: 'NE_EASE',
      name: 'Дневная Легкость',
      subtitle: 'Северо-Восток: Casual • Лето • Сближение',
      primaryEnergy: 'Диффузная открытость, непринужденность, солнце, свободное дыхание.',
      outfitDirection: 'Дышащий лен, расстегнутый ворот, мягкие чинос, белые кеды, светлая палитра.',
      perfumeDirection: 'Морская соль, бергамот, мята, легкий мускус, акватический бриз.',
      color: '#34d399',
      bgColor: 'bg-emerald-950/40',
      borderColor: 'border-emerald-500/40'
    };
  } else if (x <= 0 && y < 0) {
    return {
      code: 'SW_POWER',
      name: 'Монументальный Статус',
      subtitle: 'Юго-Запад: Black Tie / Winter Formal • Вечер • Вес',
      primaryEnergy: 'Непререкаемый авторитет, вес, фундаментальность, дистанцированная сила.',
      outfitDirection: 'Тяжелая шерсть, прямое пальто, костюмные ткани высокой плотности, дерби, глянец.',
      perfumeDirection: 'Тяжелая кожа, дымный ладан, темный уд, смолы, березовый деготь.',
      color: '#a78bfa',
      bgColor: 'bg-indigo-950/40',
      borderColor: 'border-indigo-500/40'
    };
  } else {
    return {
      code: 'SE_SEDUCTION',
      name: 'Соблазн и Интим',
      subtitle: 'Юго-Восток: Smart Casual / Night • Тепло • Магнетизм',
      primaryEnergy: 'Тактильное влечение, сокращение дистанции, уютная чувственность, флирт.',
      outfitDirection: 'Мягкий кашемир, фактурная замша, темный глубокий деним, расслабленный шик.',
      perfumeDirection: 'Табачный лист, стручковая ваниль, согревающий кардамон, корица, амбра.',
      color: '#fb923c',
      bgColor: 'bg-amber-950/40',
      borderColor: 'border-amber-500/40'
    };
  }
}
