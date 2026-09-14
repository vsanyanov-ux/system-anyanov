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
    id: 'business_negotiations',
    title: 'Стратегические переговоры',
    subtitle: 'Business Formal • Власть и Дистанция',
    icon: '💼',
    coords: {
      socialX: -0.75,
      thermoY: 0.65,
      formalIndex: 3,
      temperatureC: 21
    },
    description: 'Четкие линии костюма, холодный авторитетный аромат с ирисом и цитроном, не допускающий лишних эмоций.'
  },
  {
    id: 'summer_terrace',
    title: 'Летняя терраса / Набережная',
    subtitle: 'Casual • Дневная легкость и бриз',
    icon: '☀️',
    coords: {
      socialX: 0.65,
      thermoY: 0.85,
      formalIndex: 1,
      temperatureC: 28
    },
    description: 'Дышащий лен, расстегнутый ворот, акватика и цитрусы. Максимальная свежесть и легкое дружеское сближение.'
  },
  {
    id: 'intimate_date',
    title: 'Романтическое свидание вечером',
    subtitle: 'Smart Casual • Магнетизм и Соблазн',
    icon: '🍷',
    coords: {
      socialX: 0.70,
      thermoY: -0.55,
      formalIndex: 2,
      temperatureC: 18
    },
    description: 'Тактильный кашемир, приглушенные тона, согревающий кардамон и табачно-ванильный шлейф для дистанции объятий.'
  },
  {
    id: 'smart_office',
    title: 'Офисный Smart Casual',
    subtitle: 'Smart Casual • Баланс и Контроль',
    icon: '💻',
    coords: {
      socialX: -0.30,
      thermoY: 0.35,
      formalIndex: 2,
      temperatureC: 22
    },
    description: 'Темно-синий блейзер, голубой оксфорд, чинос и универсальный благородный древесно-пряный аромат.'
  },
  {
    id: 'winter_monumental',
    title: 'Зимний вечер / Закрытый клуб',
    subtitle: 'Formal • Монументальный статус',
    icon: '❄️',
    coords: {
      socialX: -0.85,
      thermoY: -0.80,
      formalIndex: 3,
      temperatureC: -8
    },
    description: 'Тяжелое шерстяное пальто, фланель, кожаные ботинки, глубокий дымный уд и кожаный шлейф несокрушимого статуса.'
  }
];
