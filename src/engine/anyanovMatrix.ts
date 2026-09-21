import { AnyanovCoordinates, QuadrantInfo, QuadrantType } from '../types';

export function getQuadrantInfo(x: number, y: number): QuadrantInfo {
  // x <= 0: Власть / Статус / Фокус
  // x > 0: Соблазн / Интим / Casual / Сближение
  // y >= 0: Холод / День / Лето / Быстрое действие
  // y < 0: Тепло / Вечер / Зима / Долгое действие
  // Центр: нулевая точка абсолютного равновесия
  if (Math.abs(x) <= 0.20 && Math.abs(y) <= 0.25) {
    return {
      code: 'CENTER_BALANCE',
      name: 'Равновесие',
      subtitle: 'Центр (0,0): Универсал 365 • Равновесие • Любой дресс-код',
      primaryEnergy: 'Абсолютный нейтралитет, адаптивность, точка покоя и баланса.',
      outfitDirection: 'Универсальный блейзер Hopsack, сорочка, чинос или темный деним, лоферы/дерби.',
      perfumeDirection: 'Калабрийский бергамот, инжир, чистый амброксан, светлый ладан, благородный кедр.',
      color: '#f59e0b',
      bgColor: 'bg-amber-950/40',
      borderColor: 'border-amber-500/40'
    };
  } else if (x <= 0 && y >= 0) {
    return {
      code: 'NW_FOCUS',
      name: 'Собранность',
      subtitle: 'Квадрант II (Северо-Запад): Business Formal • Холод • Дистанция',
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
      name: 'Легкость',
      subtitle: 'Квадрант I (Северо-Восток): Casual • Лето • Сближение',
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
      name: 'Власть',
      subtitle: 'Квадрант III (Юго-Запад): Night Formal (Театр / Концерт) • Вечер • Вес',
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
      name: 'Притяжение',
      subtitle: 'Квадрант IV (Юго-Восток): Smart Casual / Night • Тепло • Близость',
      primaryEnergy: 'Тактильное влечение, сокращение дистанции, уютная чувственность, близость.',
      outfitDirection: 'Мягкий кашемир, фактурная замша, темный глубокий деним, расслабленный шик.',
      perfumeDirection: 'Табачный лист, стручковая ваниль, согревающий кардамон, корица, амбра.',
      color: '#fb923c',
      bgColor: 'bg-amber-950/40',
      borderColor: 'border-amber-500/40'
    };
  }
}
