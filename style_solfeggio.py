"""
Style Solfeggio: Mathematical Harmony Engine between Fashion & Fragrance.
Implements the 6 invariant axes, distance metrics, and concordance/dissonance rules.
"""

from dataclasses import dataclass
from typing import Dict, List, Tuple
import math

AXES = [
    "mass_density",       # -1 (невесомый, шифон/озон) <-> +1 (монументальный, драп/уд/смолы)
    "architectonics",     # -1 (текучий, крой по косой/мускус) <-> +1 (жесткий тейлоринг/шипр)
    "thermal_balance",    # -1 (арктический лед, ментол/серебро) <-> +1 (согревающий, кашемир/амбра/корица)
    "surface_moisture",   # -1 (сухой, мел/пудра/твид) <-> +1 (влажный, глянец/роса/акватика)
    "tempo_volatility",   # -1 (статичный, бальзамический шлейф) <-> +1 (взрывной, цитрусы/спорт)
    "biomorphism",        # -1 (синтетический, винил/амброксан) <-> +1 (органический, лен/петрикор)
]

DEFAULT_WEIGHTS = {
    "mass_density": 1.3,      # Вес и плотность
    "architectonics": 1.2,    # Строгость кроя vs расслабленность
    "thermal_balance": 1.0,   # Температурный баланс
    "surface_moisture": 0.9,  # Пудра vs влажность/глянец
    "tempo_volatility": 0.8,  # Динамика раскрытия
    "biomorphism": 0.8,       # Натуральное vs техногенное
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
            "mass_density": 0.85,
            "architectonics": 0.90,
            "thermal_balance": 0.60,
            "surface_moisture": -0.80,
            "tempo_volatility": -0.70,
            "biomorphism": 0.70,
        },
        description="Плотная шерсть, строгая плечевая линия, сухая текстура."
    ),
    "hawaiian_vacation": AestheticVector(
        name="Гавайская рубашка и льняные шорты",
        category="outfit",
        values={
            "mass_density": -0.85,
            "architectonics": -0.85,
            "thermal_balance": 0.75,
            "surface_moisture": 0.50,
            "tempo_volatility": 0.60,
            "biomorphism": 0.50,
        },
        description="Невесомая вискоза, расстегнутый ворот, полная деконструкция формы."
    ),
    "minimalist_silk_slip": AestheticVector(
        name="Черное шелковое платье-комбинация 90-х",
        category="outfit",
        values={
            "mass_density": -0.70,
            "architectonics": -0.50,
            "thermal_balance": -0.30,
            "surface_moisture": 0.60,
            "tempo_volatility": 0.20,
            "biomorphism": -0.20,
        },
        description="Лаконичный шелк, тонкие бретели, струящаяся геометрия."
    ),
    "cyberpunk_techwear": AestheticVector(
        name="Techwear (Gore-Tex мембрана, карго, кроссовки)",
        category="outfit",
        values={
            "mass_density": 0.40,
            "architectonics": 0.70,
            "thermal_balance": -0.70,
            "surface_moisture": -0.40,
            "tempo_volatility": 0.80,
            "biomorphism": -0.90,
        },
        description="Функциональный технологичный минимализм мегаполиса."
    )
}

FRAGRANCES = {
    "classic_moss_chypre": AestheticVector(
        name="Винтажный дубовый шипр (Мох, пачули, ветивер)",
        category="fragrance",
        values={
            "mass_density": 0.80,
            "architectonics": 0.85,
            "thermal_balance": 0.20,
            "surface_moisture": -0.75,
            "tempo_volatility": -0.70,
            "biomorphism": 0.80,
        },
        description="Строгий аристократичный шипр старой школы."
    ),
    "tropical_coconut_citrus": AestheticVector(
        name="Тропический колонь (Лайм, кокос, акватика)",
        category="fragrance",
        values={
            "mass_density": -0.80,
            "architectonics": -0.70,
            "thermal_balance": 0.80,
            "surface_moisture": 0.80,
            "tempo_volatility": 0.85,
            "biomorphism": 0.60,
        },
        description="Яркий коктейльный цитрусово-акватический шлейф."
    ),
    "molecular_pepper_iris": AestheticVector(
        name="Молекулярный розовый перец и ирис (Iso E Super)",
        category="fragrance",
        values={
            "mass_density": -0.50,
            "architectonics": 0.30,
            "thermal_balance": -0.60,
            "surface_moisture": -0.40,
            "tempo_volatility": 0.30,
            "biomorphism": -0.60,
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
    print("  МУЛЬТИМОДАЛЬНОЕ СОЛЬФЕДЖИО СТИЛЯ: РАСЧЕТ ДИСТАНЦИЙ И РЕЗОНАНСА")
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
