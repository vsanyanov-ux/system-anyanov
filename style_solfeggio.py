"""
Style Solfeggio 10D: Mathematical Harmony Engine between Fashion & Fragrance.
Implements the 10 canonical orthogonal invariant axes of Sistema Anyanova:
5 Intent Axes (X) × 5 Environment Axes (Y).
"""

from dataclasses import dataclass
from typing import Dict, List, Tuple
import math
import sys

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# 5 осей намерения (X)
INTENT_AXES = [
    "distance",       # -1 (Обособленность) <-> +1 (Интим / Сближение)
    "formality",      # -1 (Business Formal) <-> +1 (Casual)
    "power",          # -1 (Статус / Власть) <-> +1 (Соблазн / Шарм)
    "mood",           # -1 (Собранность / Фокус) <-> +1 (Легкость / Свобода)
    "expression",     # -1 (Statement / Fortissimo) <-> +1 (Quiet Luxury / Pianissimo)
]

# 5 осей среды (Y)
ENVIRONMENT_AXES = [
    "season",         # -1 (Зима / Плотность) <-> +1 (Лето / Воздух)
    "temperature",    # -1 (Тепло / Согревающий) <-> +1 (Холод / Освежающий)
    "time_of_day",    # -1 (Вечер / Глубина) <-> +1 (День / Свет)
    "space",          # -1 (Indoor / Помещение) <-> +1 (Outdoor / Стихия)
    "chronometry",    # -1 (Марафон / 12+ ч) <-> +1 (Спринт / Экспресс)
]

AXES = INTENT_AXES + ENVIRONMENT_AXES

DEFAULT_WEIGHTS = {
    # Намерение
    "distance": 1.2,
    "formality": 1.2,
    "power": 1.1,
    "mood": 1.0,
    "expression": 1.0,
    # Среда
    "season": 0.9,
    "temperature": 1.0,
    "time_of_day": 0.9,
    "space": 0.8,
    "chronometry": 0.8,
}

@dataclass
class AestheticVector:
    name: str
    category: str
    values: Dict[str, float]
    description: str

    def get_vector(self) -> List[float]:
        return [self.values.get(axis, 0.0) for axis in AXES]


class HarmonyClassifier:
    UNISON_THRESHOLD = 0.45
    CONTRAPUNCT_THRESHOLD = 0.95
    DISSONANCE_THRESHOLD = 1.40

    def __init__(self, weights: Dict[str, float] = None):
        self.weights = weights or DEFAULT_WEIGHTS

    def calculate_distance(self, v1: AestheticVector, v2: AestheticVector) -> float:
        total_sq = 0.0
        total_w = sum(self.weights.values())
        
        for axis in AXES:
            diff = v1.values.get(axis, 0.0) - v2.values.get(axis, 0.0)
            w = self.weights.get(axis, 1.0)
            total_sq += w * (diff ** 2)
            
        return math.sqrt(total_sq / total_w)

    def calculate_cosine_similarity(self, v1: AestheticVector, v2: AestheticVector) -> float:
        vec1 = v1.get_vector()
        vec2 = v2.get_vector()
        
        dot = sum(a * b for a, b in zip(vec1, vec2))
        norm1 = math.sqrt(sum(a ** 2 for a in vec1))
        norm2 = math.sqrt(sum(b ** 2 for b in vec2))
        
        if norm1 == 0 or norm2 == 0:
            return 0.0
        return dot / (norm1 * norm2)

    def diagnose_clashes(self, outfit: AestheticVector, fragrance: AestheticVector) -> List[Tuple[str, float, str]]:
        clashes = []
        for axis in AXES:
            val_o = outfit.values.get(axis, 0.0)
            val_f = fragrance.values.get(axis, 0.0)
            diff = abs(val_o - val_f)
            
            if diff >= 1.0:
                diagnosis = f"Критический разрыв: лук {val_o:+.2f} vs аромат {val_f:+.2f}"
                clashes.append((axis, diff, diagnosis))
            elif diff >= 0.7:
                diagnosis = f"Заметный контрапункт: лук {val_o:+.2f} vs аромат {val_f:+.2f}"
                clashes.append((axis, diff, diagnosis))
                
        return sorted(clashes, key=lambda x: x[1], reverse=True)

    def analyze(self, outfit: AestheticVector, fragrance: AestheticVector) -> Dict:
        dist = self.calculate_distance(outfit, fragrance)
        cosine = self.calculate_cosine_similarity(outfit, fragrance)
        clashes = self.diagnose_clashes(outfit, fragrance)

        if dist <= self.UNISON_THRESHOLD:
            state = "Унисон (Тотальный Консонанс)"
            verdict = "Идеальное созвучие: аромат и одежда резонируют в едином семантическом регистре."
            color = "[OK-CONCORDANCE]"
        elif dist <= self.CONTRAPUNCT_THRESHOLD:
            major_clashes = [c for c in clashes if c[1] >= 1.0]
            if len(major_clashes) <= 1:
                state = "Благородный Контрапункт (Полифония)"
                verdict = "Высокий стиль: выверенное эстетическое напряжение по одной акцентной оси."
                color = "[ACCENT-POLYPHONY]"
            else:
                state = "Умеренная Дивергенция"
                verdict = "Звучание эклектичное, размытое по нескольким параметрам."
                color = "[MILD-DIVERGENCE]"
        elif dist <= self.DISSONANCE_THRESHOLD:
            state = "Семантический Диссонанс"
            verdict = "Ощутимый конфликт кодов: зрительный и ольфакторный сигналы противоречат друг другу."
            color = "[DISSONANCE]"
        else:
            state = "Какофония (Абсурдный слом)"
            verdict = "Критический слом восприятия. Мозг считывает взаимоисключающие контексты."
            color = "[CACOPHONY]"

        return {
            "outfit": outfit.name,
            "fragrance": fragrance.name,
            "distance": round(dist, 3),
            "cosine_similarity": round(cosine, 3),
            "harmony_state": state,
            "color_badge": color,
            "verdict": verdict,
            "key_clashes": clashes,
        }

OUTFITS = {
    "savile_row_tweed": AestheticVector(
        name="Твидовый костюм-тройка Savile Row",
        category="outfit",
        values={
            "distance": -0.85,
            "formality": -0.90,
            "power": -0.85,
            "mood": -0.80,
            "expression": 0.70,
            "season": -0.80,
            "temperature": -0.60,
            "time_of_day": -0.50,
            "space": -0.50,
            "chronometry": -0.80,
        },
        description="Плотная шерсть, строгая плечевая линия, сухая текстура."
    ),
    "hawaiian_vacation": AestheticVector(
        name="Гавайская рубашка и льняные шорты",
        category="outfit",
        values={
            "distance": 0.85,
            "formality": 0.90,
            "power": 0.60,
            "mood": 0.85,
            "expression": -0.70,
            "season": 0.90,
            "temperature": 0.80,
            "time_of_day": 0.75,
            "space": 0.85,
            "chronometry": -0.70,
        },
        description="Невесомая вискоза, расстегнутый ворот, полная деконструкция формы."
    ),
    "minimalist_silk_slip": AestheticVector(
        name="Черное шелковое платье-комбинация 90-х",
        category="outfit",
        values={
            "distance": 0.75,
            "formality": 0.20,
            "power": 0.80,
            "mood": 0.20,
            "expression": 0.60,
            "season": 0.30,
            "temperature": 0.20,
            "time_of_day": -0.70,
            "space": -0.70,
            "chronometry": 0.20,
        },
        description="Лаконичный шелк, тонкие бретели, струящаяся геометрия."
    ),
    "cyberpunk_techwear": AestheticVector(
        name="Techwear (Gore-Tex мембрана, карго, кроссовки)",
        category="outfit",
        values={
            "distance": -0.60,
            "formality": 0.30,
            "power": -0.40,
            "mood": -0.70,
            "expression": -0.60,
            "season": -0.30,
            "temperature": 0.70,
            "time_of_day": -0.60,
            "space": 0.85,
            "chronometry": -0.70,
        },
        description="Функциональный технологичный минимализм мегаполиса."
    )
}

FRAGRANCES = {
    "classic_moss_chypre": AestheticVector(
        name="Винтажный дубовый шипр (Мох, пачули, ветивер)",
        category="fragrance",
        values={
            "distance": -0.80,
            "formality": -0.85,
            "power": -0.80,
            "mood": -0.75,
            "expression": 0.60,
            "season": -0.60,
            "temperature": -0.20,
            "time_of_day": -0.60,
            "space": -0.40,
            "chronometry": -0.80,
        },
        description="Строгий аристократичный шипр старой школы."
    ),
    "tropical_coconut_citrus": AestheticVector(
        name="Тропический колонь (Лайм, кокос, акватика)",
        category="fragrance",
        values={
            "distance": 0.85,
            "formality": 0.80,
            "power": 0.50,
            "mood": 0.85,
            "expression": -0.70,
            "season": 0.90,
            "temperature": 0.85,
            "time_of_day": 0.80,
            "space": 0.80,
            "chronometry": 0.60,
        },
        description="Яркий коктейльный цитрусово-акватический шлейф."
    ),
    "molecular_pepper_iris": AestheticVector(
        name="Молекулярный розовый перец и ирис (Iso E Super)",
        category="fragrance",
        values={
            "distance": -0.30,
            "formality": -0.20,
            "power": -0.20,
            "mood": -0.50,
            "expression": 0.80,
            "season": 0.30,
            "temperature": 0.50,
            "time_of_day": 0.20,
            "space": -0.60,
            "chronometry": -0.60,
        },
        description="Холодная интеллектуальная урбанистическая вуаль."
    )
}

def run_benchmark():
    classifier = HarmonyClassifier()
    pairs = [
        ("savile_row_tweed", "classic_moss_chypre"),
        ("hawaiian_vacation", "classic_moss_chypre"),
        ("hawaiian_vacation", "tropical_coconut_citrus"),
        ("minimalist_silk_slip", "molecular_pepper_iris"),
        ("minimalist_silk_slip", "classic_moss_chypre"),
        ("cyberpunk_techwear", "molecular_pepper_iris"),
    ]

    print("=" * 75)
    print("  МУЛЬТИМОДАЛЬНОЕ СОЛЬФЕДЖИО СТИЛЯ (10D): РАСЧЕТ ДИСТАНЦИЙ И РЕЗОНАНСА")
    print("=" * 75)

    for o_key, f_key in pairs:
        o = OUTFITS[o_key]
        f = FRAGRANCES[f_key]
        res = classifier.analyze(o, f)

        print(f"\n{res['color_badge']} {res['outfit']}")
        print(f"      + {res['fragrance']}")
        print(f"   Дистанция (D): {res['distance']:<5} | cos(theta): {res['cosine_similarity']:<5} | Статус: {res['harmony_state']}")
        print(f"   Вердикт: {res['verdict']}")
        if res['key_clashes']:
            print("   Ключевые точки напряжения:")
            for axis, diff, diag in res['key_clashes'][:2]:
                print(f"     * [{axis}] delta = {diff:.2f}: {diag}")
        print("-" * 75)

if __name__ == "__main__":
    run_benchmark()

