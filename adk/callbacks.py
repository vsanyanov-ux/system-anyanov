"""
Google ADK & AEBOP™ Standard: Callbacks & Guardrails for Python
"""

from typing import Dict, Any, Tuple


def before_tool_callback(tool_name: str, args: Dict[str, Any], session_id: str, confirmed: bool = False) -> Tuple[bool, Dict[str, Any], str]:
    sanitized = dict(args)
    reason = ""

    if "social_x" in sanitized:
        sanitized["social_x"] = max(-1.0, min(1.0, float(sanitized["social_x"])))
    if "thermo_y" in sanitized:
        sanitized["thermo_y"] = max(-1.0, min(1.0, float(sanitized["thermo_y"])))
    if "formal_index" in sanitized:
        sanitized["formal_index"] = max(1, min(3, int(sanitized["formal_index"])))
    if "temperature_c" in sanitized:
        temp = float(sanitized["temperature_c"])
        sanitized["temperature_c"] = max(-20.0, min(42.0, temp))
        if (temp < -5 or temp > 35) and not confirmed:
            return False, sanitized, f"Экстремальная температура ({temp}°C). Требуется подтверждение Approval Gate."

    return True, sanitized, reason


def after_tool_callback(tool_name: str, args: Dict[str, Any], result: Dict[str, Any], session_id: str) -> Dict[str, Any]:
    return {
        "tool": tool_name,
        "session_id": session_id,
        "parameters": args,
        "result_status": "success" if result.get("success", False) else "error",
        "output": result.get("data"),
    }
