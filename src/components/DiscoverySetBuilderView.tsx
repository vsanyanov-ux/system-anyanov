import React, { useState } from 'react';
import {
  Package,
  Boxes,
  Sparkles,
  CheckCircle2,
  Plus,
  RefreshCw,
  ShoppingBag,
  Gift,
  ArrowRight,
  ShieldCheck,
  Zap,
  Truck,
  MapPin,
  Phone,
  User,
  X,
  CreditCard,
  Check,
} from 'lucide-react';
import { PERFUME_DATABASE, getPerfumeBottleImage } from '../data/fragrances';
import { PerfumeItem } from '../types';

interface DiscoverySetBuilderViewProps {
  onAddAllToShelf: (ids: string[]) => void;
  onOpenShelfModal: () => void;
  userShelfIds: string[];
}

interface PresetSet {
  id: string;
  name: string;
  tag: string;
  description: string;
  perfumeIds: string[];
}

const PRESET_SETS: PresetSet[] = [
  {
    id: 'trio-1259',
    name: 'Канон 1–2–5–9 (Триада Брендов)',
    tag: 'Флагман 1-2-5-9',
    description: 'Математический баланс 3 миров: Dylan Blue (Центр), Grey Vetiver (Офис), Tuscan Leather (Власть) и Khamrah (Соблазн)',
    perfumeIds: [
      'versace-dylan-blue-edt',
      'tom-ford-grey-vetiver',
      'tom-ford-tuscan-leather',
      'lattafa-khamrah',
    ],
  },
  {
    id: 'four-powers',
    name: 'Канон Четырех Властей',
    tag: 'Бестселлер',
    description: 'Полный баланс гардероба: 1 флакон на каждый квадрант матрицы Аньянова',
    perfumeIds: [
      'bleu-de-chanel-edp',
      'tom-ford-tuscan-leather',
      'versace-man-eau-fraiche',
      'dior-homme-intense',
    ],
  },
  {
    id: 'italian-weekend',
    name: 'Итальянский Уикенд',
    tag: 'Свежесть & Солнце',
    description: 'Легкие средиземноморские акватические и цитрусовые композиции для отдыха',
    perfumeIds: [
      'versace-man-eau-fraiche',
      'acqua-di-gio',
      'terre-dhermes',
      'dior-homme-cologne',
    ],
  },
  {
    id: 'dark-seduction',
    name: 'Тёмный Магнетизм & Ночь',
    tag: 'Вечер & Эрос',
    description: 'Глубокие смолы, алкогольные оттенки, ваниль и кожа для незабываемого впечатления',
    perfumeIds: [
      'lattafa-khamrah',
      'jpg-ultra-male',
      'versace-oud-noir',
      'tom-ford-tuscan-leather',
    ],
  },
  {
    id: 'boardroom-focus',
    name: 'Переговоры & Железный Фокус',
    tag: 'Business Formal',
    description: 'Сухие ирисовые и лавандовые аккорды для переговоров с предельным контролем',
    perfumeIds: [
      'prada-lhomme',
      'chanel-platinum-egoiste',
      'dior-eau-sauvage',
      'bleu-de-chanel-edp',
    ],
  },
];

export const DiscoverySetBuilderView: React.FC<DiscoverySetBuilderViewProps> = ({
  onAddAllToShelf,
  onOpenShelfModal,
  userShelfIds,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('trio-1259');
  const [slotIds, setSlotIds] = useState<string[]>([
    'versace-dylan-blue-edt',
    'tom-ford-grey-vetiver',
    'tom-ford-tuscan-leather',
    'lattafa-khamrah',
  ]);
  const [vialSize, setVialSize] = useState<'2.5ml' | '5ml'>('2.5ml');
  const [activeSlotModal, setActiveSlotModal] = useState<number | null>(null);

  // Состояние модального окна оформления заказа
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [generatedOrderNumber, setGeneratedOrderNumber] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    deliveryMethod: 'cdek_pvz',
    city: 'Москва',
    address: 'ул. Тверская, д. 7 (ПВЗ СДЭК)',
  });

  const activePerfumes: PerfumeItem[] = slotIds
    .map((id) => PERFUME_DATABASE.find((p) => p.id === id))
    .filter(Boolean) as PerfumeItem[];

  const handleApplyPreset = (preset: PresetSet) => {
    setSelectedPresetId(preset.id);
    setSlotIds(preset.perfumeIds);
  };

  const handleReplaceSlot = (index: number, newId: string) => {
    const updated = [...slotIds];
    updated[index] = newId;
    setSlotIds(updated);
    setSelectedPresetId('custom');
    setActiveSlotModal(null);
  };

  const price = vialSize === '2.5ml' ? 3490 : 5990;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const orderNum = `ANYANOV-BOX-${Math.floor(100000 + Math.random() * 900000)}`;
    setGeneratedOrderNumber(orderNum);
    setOrderPlaced(true);
  };

  const resetOrder = () => {
    setIsCheckoutOpen(false);
    setOrderPlaced(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold tracking-wide uppercase">
              <Boxes className="w-3.5 h-3.5" />
              Персональный Discovery Box
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Сэмпл-конструктор: 4 аромата в дорогу
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Не покупайте флакон вслепую за 25 000 ₽. Соберите сет миниатюр с распылителем, разносите
              на разной одежде и в разную погоду. Стоимость бокса вернется кэшбэком на флакон!
            </p>
          </div>

          {/* Cashback Guarantee Badge */}
          <div className="bg-gradient-to-br from-amber-500/20 to-indigo-500/20 p-4 rounded-2xl border border-amber-500/30 backdrop-blur-md self-start md:self-auto shrink-0 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase text-amber-300">
              <Gift className="w-4 h-4 text-amber-400" />
              100% Кэшбэк на флакон
            </div>
            <div className="text-xs text-slate-300 max-w-[220px]">
              Вся сумма <span className="font-bold text-white">{price.toLocaleString()} ₽</span> зачисляется
              депозитом на покупку любого полного флакона в течение 30 дней.
            </div>
          </div>
        </div>

        {/* Vial Size Selector & Presets Pills */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 mr-1">Готовые сеты:</span>
            {PRESET_SETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleApplyPreset(preset)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                  selectedPresetId === preset.id
                    ? 'bg-amber-500 text-black border-amber-400 font-extrabold shadow-md'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>

          {/* Vial Volume Switch */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setVialSize('2.5ml')}
              className={`text-xs font-bold px-3 py-1 rounded-lg transition cursor-pointer ${
                vialSize === '2.5ml'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              4 × 2.5 мл (Спрей)
            </button>
            <button
              onClick={() => setVialSize('5ml')}
              className={`text-xs font-bold px-3 py-1 rounded-lg transition cursor-pointer ${
                vialSize === '5ml'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              4 × 5.0 мл (Тревел)
            </button>
          </div>
        </div>
      </div>

      {/* 4 Sample Vials Interactive Showcase */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {slotIds.map((id, index) => {
          const p = PERFUME_DATABASE.find((item) => item.id === id);
          if (!p) return null;
          const bottleImg = getPerfumeBottleImage(p);
          const isOwned = userShelfIds.includes(p.id);

          return (
            <div
              key={index}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-amber-500/40 transition-all shadow-lg group relative overflow-hidden"
            >
              {/* Slot Number Badge */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  Слот 0{index + 1} • {vialSize}
                </span>
                {isOwned && (
                  <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    Есть на полке
                  </span>
                )}
              </div>

              {/* Perfume Info & Image */}
              <div className="flex flex-col items-center text-center my-3">
                <div className="w-20 h-20 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center p-2 mb-3 shadow-inner group-hover:scale-105 transition-transform">
                  {bottleImg ? (
                    <img
                      src={bottleImg}
                      alt={p.name}
                      className="max-h-full object-contain filter drop-shadow-md"
                    />
                  ) : (
                    <Package className="w-8 h-8 text-slate-600" />
                  )}
                </div>
                <div className="text-xs font-bold text-amber-400 tracking-wide uppercase">
                  {p.brand}
                </div>
                <h3 className="text-sm font-bold text-white mt-0.5 line-clamp-1">{p.name}</h3>
                <p className="text-[11px] text-slate-400 mt-1 italic line-clamp-2">
                  «{p.dominantVibe}»
                </p>
              </div>

              {/* Pyramid Notes preview */}
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 my-3 text-[11px] space-y-1">
                <div className="text-slate-400 flex items-center justify-between">
                  <span>Шлейф:</span>
                  <span className="text-slate-200 font-medium truncate max-w-[120px]">
                    {p.pyramid.base.slice(0, 2).join(', ')}
                  </span>
                </div>
                <div className="text-slate-400 flex items-center justify-between">
                  <span>Сердце:</span>
                  <span className="text-slate-200 font-medium truncate max-w-[120px]">
                    {p.pyramid.heart.slice(0, 2).join(', ')}
                  </span>
                </div>
              </div>

              {/* Replace Button */}
              <button
                onClick={() => setActiveSlotModal(index)}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition cursor-pointer"
              >
                <RefreshCw className="w-3 h-3 text-slate-400" />
                Заменить флакон
              </button>
            </div>
          );
        })}
      </div>

      {/* Checkout Bar & Actions */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-white">{price.toLocaleString()} ₽</span>
              <span className="text-xs text-slate-400 font-normal line-through">
                {(price * 1.5).toLocaleString()} ₽
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Кэшбэк 100%
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Премиальная подарочная коробка с ложементом + 4 атомайзера + сертификат на скидку
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => onAddAllToShelf(slotIds)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition cursor-pointer"
            title="Добавить все 4 флакона на мою полку"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Добавить на полку
          </button>

          <button
            onClick={() => setIsCheckoutOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-black shadow-lg shadow-amber-500/20 transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4 fill-black text-black" />
            Оформить заказ Discovery Box
          </button>
        </div>
      </div>

      {/* MODAL 1: Checkout & Delivery Flow */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B0F1C] border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={resetOrder}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!orderPlaced ? (
              <form onSubmit={handleSubmitOrder} className="space-y-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold uppercase">
                    <Truck className="w-3 h-3" /> Экспресс-доставка СДЭК
                  </div>
                  <h3 className="text-xl font-extrabold text-white">
                    Оформление Discovery Box
                  </h3>
                  <p className="text-xs text-slate-400">
                    Сет из 4 ароматов ({vialSize}) в крафтовой премиальной коробке с кэшбэк-сертификатом на {price.toLocaleString()} ₽.
                  </p>
                </div>

                {/* Fragrance List Preview */}
                <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800/80 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-slate-400">Состав вашего бокса:</span>
                  <div className="grid grid-cols-2 gap-2">
                    {activePerfumes.map((p, i) => (
                      <div key={p.id} className="text-xs text-slate-200 flex items-center gap-1.5 truncate">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                        <span className="font-semibold text-white truncate">{p.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Form Inputs */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Имя получателя
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                      <input
                        type="text"
                        required
                        placeholder="Владимир"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Телефон / Telegram для трек-номера
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                      <input
                        type="tel"
                        required
                        placeholder="+7 (999) 000-00-00"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Способ доставки
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, deliveryMethod: 'cdek_pvz' })}
                        className={`p-2.5 rounded-xl border text-xs font-bold text-left transition cursor-pointer flex flex-col justify-between ${
                          formData.deliveryMethod === 'cdek_pvz'
                            ? 'bg-amber-500/10 border-amber-500 text-amber-300'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span>Пункт выдачи СДЭК</span>
                        <span className="text-[10px] font-normal text-slate-500 mt-0.5">Бесплатно • 2-3 дня</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, deliveryMethod: 'courier' })}
                        className={`p-2.5 rounded-xl border text-xs font-bold text-left transition cursor-pointer flex flex-col justify-between ${
                          formData.deliveryMethod === 'courier'
                            ? 'bg-amber-500/10 border-amber-500 text-amber-300'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span>Курьер до двери</span>
                        <span className="text-[10px] font-normal text-slate-500 mt-0.5">+350 ₽ • Завтра</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Город и адрес доставки
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                      <input
                        type="text"
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400">Итого к оплате:</span>
                    <div className="text-lg font-black text-white">{price.toLocaleString()} ₽</div>
                  </div>

                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-black text-xs font-black shadow-lg shadow-amber-500/20 cursor-pointer transition"
                  >
                    <CreditCard className="w-4 h-4" />
                    Подтвердить и заказать
                  </button>
                </div>
              </form>
            ) : (
              /* Success Screen */
              <div className="py-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-500/10">
                  <Check className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                    Заказ успешно оформлен!
                  </span>
                  <h3 className="text-xl font-extrabold text-white">
                    Номер заказа: {generatedOrderNumber}
                  </h3>
                  <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                    Мы уже собираем ваш Discovery Box ({vialSize}). Уведомление с трек-номером СДЭК отправлено на номер{' '}
                    <span className="text-amber-400 font-bold">{formData.phone || '+7 (999) 000-00-00'}</span>.
                  </p>
                </div>

                {/* Cashback certificate card */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-900 to-indigo-950/30 border border-amber-500/40 text-left space-y-1.5 max-w-sm mx-auto">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-amber-300 flex items-center gap-1.5">
                      <Gift className="w-3.5 h-3.5" /> Сертификат кэшбэка 100%
                    </span>
                    <span className="text-xs font-black text-white">{price.toLocaleString()} ₽</span>
                  </div>
                  <div className="font-mono text-xs bg-black/40 px-2.5 py-1 rounded-lg border border-slate-800 text-amber-400 text-center tracking-wider">
                    PROMO-ANYANOV-{Math.floor(1000 + Math.random() * 9000)}
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    Промокод активен 30 дней. Примените его при покупке любого полного флакона у партнеров.
                  </p>
                </div>

                <button
                  onClick={resetOrder}
                  className="px-6 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition cursor-pointer"
                >
                  Вернуться в конструктор
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: Replace a Slot */}
      {activeSlotModal !== null && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">
                Выберите замену для Слота 0{activeSlotModal + 1}
              </h3>
              <button
                onClick={() => setActiveSlotModal(null)}
                className="text-slate-400 hover:text-white text-sm cursor-pointer"
              >
                ✕ Закрыть
              </button>
            </div>

            <div className="overflow-y-auto space-y-2 pr-1 flex-1">
              {PERFUME_DATABASE.map((perfume) => {
                const bottleImg = getPerfumeBottleImage(perfume);
                const isCurrent = slotIds[activeSlotModal] === perfume.id;

                return (
                  <div
                    key={perfume.id}
                    onClick={() => handleReplaceSlot(activeSlotModal, perfume.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border transition cursor-pointer ${
                      isCurrent
                        ? 'bg-amber-500/10 border-amber-500/40'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {bottleImg && (
                        <img
                          src={bottleImg}
                          alt={perfume.name}
                          className="w-10 h-10 rounded-lg object-contain bg-slate-900 border border-slate-800 p-1"
                        />
                      )}
                      <div>
                        <div className="text-xs font-bold text-amber-400">{perfume.brand}</div>
                        <div className="text-sm font-semibold text-white">{perfume.name}</div>
                        <div className="text-[11px] text-slate-400 line-clamp-1">
                          {perfume.dominantVibe}
                        </div>
                      </div>
                    </div>
                    {isCurrent ? (
                      <span className="text-xs font-bold text-amber-400">Выбран</span>
                    ) : (
                      <span className="text-xs text-slate-400 hover:text-white">Выбрать</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
