"""
Google ADK & AEBOP™ Standard: Python Tool Contracts & Declarations
Provides Pydantic v2 validation models and tool registry for Sistema Anyanova 8D Engine.
"""

from typing import Dict, Any, List, Optional
try:
    from pydantic import BaseModel, Field
except ImportError:
    # Fallback to dataclasses if pydantic is not installed
    from dataclasses import dataclass, field
    class BaseModel:
        def model_dump(self):
            return self.__dict__
    def Field(default=..., description=""):
        return default

from style_solfeggio import AestheticVector, HarmonyClassifier, AXES, DEFAULT_WEIGHTS


class CalibrateCoordinatesInput(BaseModel):
    social_x: float = Field(..., description="Социальная ось: от -1.0 (Статус/Власть) до +1.0 (Соблазн/Интим)")
    thermo_y: float = Field(..., description="Термодинамическая ось: от -1.0 (Тепло/Зима) до +1.0 (Холод/Лето)")
    formal_index: int = Field(..., description="Индекс формальности: 1 (Casual), 2 (Smart Casual), 3 (Business Formal)")
    temperature_c: float = Field(..., description="Температура окружающей среды в °C")
    occasion: Optional[str] = Field(None, description="Повод или ситуация")


class EvaluateHarmonyInput(BaseModel):
    outfit_vector: Dict[str, float] = Field(..., description="10D-вектор слоев одежды L1..L4 (5 осей намерения x 5 осей среды)")
    fragrance_vector: Dict[str, float] = Field(..., description="10D-вектор аромата")
    outfit_name: str = Field("Outfit", description="Название аутфита")
    fragrance_name: str = Field("Fragrance", description="Название аромата")


ADK_TOOL_DECLARATIONS = [
    {
        "name": "calibrate_anyanov_coordinates",
        "description": "Калибрует ортогональные координаты Системы Аньянова (10D базис: 5 осей намерения x 5 осей среды) под повод, социальный статус и температуру.",
        "parameters": {
            "type": "object",
            "properties": {
                "social_x": {"type": "number", "minimum": -1.0, "maximum": 1.0},
                "thermo_y": {"type": "number", "minimum": -1.0, "maximum": 1.0},
                "formal_index": {"type": "integer", "enum": [1, 2, 3]},
                "temperature_c": {"type": "number", "minimum": -15, "maximum": 35},
                "occasion": {"type": "string"},
            },
            "required": ["social_x", "thermo_y", "formal_index", "temperature_c"],
        },
    },
    {
        "name": "evaluate_fragrance_harmony",
        "description": "Рассчитывает 10D-сольфеджио гармонии (дистанция, контрапункт, диссонанс) между аутфитом и ароматом с синтезом Тетрады.",
        "parameters": {
            "type": "object",
            "properties": {
                "outfit_vector": {"type": "object"},
                "fragrance_vector": {"type": "object"},
                "outfit_name": {"type": "string"},
                "fragrance_name": {"type": "string"},
            },
            "required": ["outfit_vector", "fragrance_vector"],
        },
    },
]


def tool_calibrate_coordinates(params: Dict[str, Any]) -> Dict[str, Any]:
    sx = max(-1.0, min(1.0, float(params.get("social_x", 0.0))))
    ty = max(-1.0, min(1.0, float(params.get("thermo_y", 0.0))))
    fi = int(params.get("formal_index", 2))
    tc = max(-15.0, min(35.0, float(params.get("temperature_c", 20.0))))
    return {
        "social_x": sx,
        "thermo_y": ty,
        "formal_index": fi,
        "temperature_c": tc,
        "occasion": params.get("occasion", "Smart Casual"),
    }


def tool_evaluate_harmony(params: Dict[str, Any]) -> Dict[str, Any]:
    o_vec = params.get("outfit_vector", {})
    f_vec = params.get("fragrance_vector", {})
    o_name = params.get("outfit_name", "Outfit")
    f_name = params.get("fragrance_name", "Fragrance")

    outfit = AestheticVector(name=o_name, category="Одежда", values=o_vec, description=o_name)
    fragrance = AestheticVector(name=f_name, category="Парфюм", values=f_vec, description=f_name)

    classifier = HarmonyClassifier()
    return classifier.analyze(outfit, fragrance)


TOOLS_REGISTRY = {
    "calibrate_anyanov_coordinates": tool_calibrate_coordinates,
    "evaluate_fragrance_harmony": tool_evaluate_harmony,
}


def execute_tool_call(tool_name: str, args: Dict[str, Any]) -> Dict[str, Any]:
    if tool_name not in TOOLS_REGISTRY:
        return {"success": False, "error": f"Tool '{tool_name}' not registered in ADK TOOLS_REGISTRY"}
    try:
        data = TOOLS_REGISTRY[tool_name](args)
        return {"success": True, "tool_name": tool_name, "data": data}
    except Exception as e:
        return {"success": False, "tool_name": tool_name, "error": str(e)}
