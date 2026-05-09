from langgraph.graph import StateGraph
from app.models import DisputeState
from app.llm import mistral_call
import json
import re


# =========================
# SAFE JSON PARSER
# =========================
def safe_parse_llm_output(text: str) -> dict:
    """
    Extract JSON even if LLM returns extra text.
    """

    if isinstance(text, dict):
        return text

    try:
        return json.loads(text)
    except Exception:
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if match:
            return json.loads(match.group())

    raise ValueError("LLM did not return valid JSON")


# =========================
# DECISION NODE
# =========================
def decision_node(state: DisputeState):

    case_data = state.case

    prompt = f"""
You are a financial dispute resolution engine.

Analyze the case below and return STRICT JSON only:

Case:
{json.dumps(case_data, indent=2)}

Return format:
{{
  "decision": {{
    "status": "APPROVE | REJECT | DISPUTE",
    "reason": "short explanation"
  }},
  "confidence": 0.0-1.0,
  "reasoning": ["bullet 1", "bullet 2"],
  "recommended_action": {{
    "investigation": "next step"
  }}
}}
"""

    raw = mistral_call(prompt)

    parsed = safe_parse_llm_output(raw)

    # Update state safely (Pydantic-compatible)
    state.decision = parsed["decision"]["status"]
    state.confidence = parsed.get("confidence", 0.0)
    state.reasoning = parsed.get("reasoning", [])
    state.recommended_action = parsed["recommended_action"]["investigation"]

    # optional debug trace
    state.raw_llm_output = raw

    return state


# =========================
# GRAPH BUILDING
# =========================

workflow = StateGraph(DisputeState)

workflow.add_node("decision", decision_node)

workflow.set_entry_point("decision")
workflow.set_finish_point("decision")

graph = workflow.compile()


# =========================
# PUBLIC RUN FUNCTION
# =========================
def run_dispute_graph(data: dict):

    # wrap input into state schema
    state = DisputeState(case=data)

    # execute graph
    result = graph.invoke(state)

    return result.model_dump() if hasattr(result, "model_dump") else result