"""
Google ADK & AEBOP™ Standard: Agent Runtime for Python
"""

from typing import Dict, Any, List
from adk.tools import execute_tool_call
from adk.callbacks import before_tool_callback, after_tool_callback


class ADKAgentRunner:
    def __init__(self, session_id: str = "sess_default"):
        self.session_id = session_id
        self.turns: List[Dict[str, Any]] = []

    def run(self, user_prompt: str, tool_args: Dict[str, Any], confirmed: bool = False) -> Dict[str, Any]:
        self.turns.append({"role": "user", "content": user_prompt})

        # 1. Guardrail Hook
        proceed, sanitized, reason = before_tool_callback(
            "calibrate_anyanov_coordinates", tool_args, self.session_id, confirmed
        )
        if not proceed:
            return {
                "success": False,
                "status": "blocked_by_approval_gate",
                "approval_reason": reason,
                "sanitized_args": sanitized,
            }

        # 2. Tool Execution
        raw_res = execute_tool_call("calibrate_anyanov_coordinates", sanitized)

        # 3. Post-execution Hook
        telemetry = after_tool_callback("calibrate_anyanov_coordinates", sanitized, raw_res, self.session_id)

        return {
            "success": raw_res.get("success", False),
            "data": raw_res.get("data"),
            "telemetry": telemetry,
        }
