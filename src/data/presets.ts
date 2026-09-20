import { AnyanovCoordinates } from '../types';

export interface PresetScenario {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  coords: AnyanovCoordinates;
  description: string;
}

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'vacation_relax',
    title: 'Отдых / Отпуск / Пляж',
    subtitle: 'Casual • Дневная легкость и бриз',
    icon: '🏖️',
    coords: {
      socialX: 0.65,
      thermoY: 0.80,
      formalIndex: 1,
      temperatureC: 28
    },
    description: 'Дышащий лен, расстегнутый ворот, светлые чинос и белые кеды. Аромат: Man Eau Fraîche (лето) / The Dreamer (зима).'
  },
  {
    id: 'work_focus',
    title: 'Работа / Фокус',
    subtitle: 'Business Formal • Статус и Дисциплина',
    icon: '💼',
    coords: {
      socialX: -0.55,
      thermoY: 0.60,
      formalIndex: 3,
      temperatureC: 21
    },
    description: 'Структурированный пиджак, белая сорочка, деловой фокус без эмоционального шума. Аромат: Versace Pour Homme.'
  },
  {
    id: 'univer_balance',
    title: 'Универ / Универсал',
    subtitle: 'Business / Smart Casual • Ровный баланс',
    icon: '🎓',
    coords: {
      socialX: 0.00,
      thermoY: 0.00,
      formalIndex: 2,
      temperatureC: 20
    },
    description: 'Абсолютный центр гармонии. Оксфордская сорочка, темный деним, лоферы. Аромат: Dylan Blue EDT (лето) / EDP (зима).'
  },
  {
    id: 'theater_power',
    title: 'Театр / Вечер',
    subtitle: 'Black Tie • Монументальная Власть',
    icon: '🎭',
    coords: {
      socialX: -0.50,
      thermoY: -0.50,
      formalIndex: 3,
      temperatureC: 18
    },
    description: 'Каноническая точка из блокнота (X: -0.5, Y: -0.5). Вечерний протокол, тяжелые благородные ткани. Аромат: Versace Oud Noir.'
  },
  {
    id: 'date_seduction',
    title: 'Свидание / Соблазн',
    subtitle: 'Smart Casual • Магнетизм и Влечение',
    icon: '🍷',
    coords: {
      socialX: 0.65,
      thermoY: -0.60,
      formalIndex: 2,
      temperatureC: 20
    },
    description: 'Мягкий кашемировый трикотаж, тактильная замша, интимный полумрак. Аромат: Eros EDT (лето) / Eros EDP (зима).'
  }
];
