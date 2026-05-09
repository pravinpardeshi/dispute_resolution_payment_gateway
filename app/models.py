from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional


# =========================
# LLM DECISION STRUCTURE
# =========================

class Decision(BaseModel):
    status: str = Field(
        ...,
        description="APPROVE | REJECT | DISPUTE"
    )
    reason: str


# =========================
# MAIN STATE MODEL (LANGGRAPH)
# =========================

class DisputeState(BaseModel):
    """
    Central LangGraph state object.
    This flows through all nodes.
    """

    # Input case data
    case: Dict[str, Any]

    # Core outputs
    decision: str = "DISPUTE"
    confidence: float = 0.0
    reasoning: List[str] = Field(default_factory=list)
    recommended_action: str = ""

    # Optional structured decision (if you want richer output)
    decision_obj: Optional[Decision] = None

    # Debug / traceability
    raw_llm_output: Optional[str] = None


# =========================
# OPTIONAL: API RESPONSE MODEL
# =========================

class DisputeResponse(BaseModel):
    """
    What your FastAPI endpoint returns to frontend.
    Keep it FLAT for UI simplicity.
    """

    decision: str
    confidence: float
    reasoning: List[str]
    recommended_action: str


# =========================
# INPUT MODEL (API REQUEST)
# =========================

class DisputeRequest(BaseModel):
    """
    Input from UI / curl / frontend.
    """

    case: Dict[str, Any]