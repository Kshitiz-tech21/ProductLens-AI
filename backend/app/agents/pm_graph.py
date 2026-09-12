from typing import TypedDict, List, Dict, Any
from langgraph.graph import StateGraph, END
from .core.ai_provider import get_ai_provider

class AgentState(TypedDict):
    question: str
    analytics_data: Dict[str, Any]
    customer_data: Dict[str, Any]
    market_data: Dict[str, Any]
    strategy_recommendation: str
    final_prd_outline: str
    confidence: float

def analytics_agent(state: AgentState):
    # Simulate data gathering
    return {"analytics_data": {"conversion_drop": "18%", "segment": "Mobile"}}

def customer_agent(state: AgentState):
    return {"customer_data": {"complaints": "Payment freeze", "sentiment": "Negative"}}

def market_agent(state: AgentState):
    return {"market_data": {"competitor_bench": "Average 2% failure"}}

def strategy_agent(state: AgentState):
    # Combine data into strategy
    data = f"Analytics: {state['analytics_data']}, VOC: {state['customer_data']}"
    provider = get_ai_provider()
    rec = provider.generate(f"Given {data}, what is the strategy?")
    return {"strategy_recommendation": rec, "confidence": 0.85}

def prd_agent(state: AgentState):
    provider = get_ai_provider()
    prd = provider.generate(f"Create PRD outline for {state['strategy_recommendation']}")
    return {"final_prd_outline": prd}

def create_product_manager_graph():
    workflow = StateGraph(AgentState)
    
    workflow.add_node("analytics", analytics_agent)
    workflow.add_node("customer", customer_agent)
    workflow.add_node("market", market_agent)
    workflow.add_node("strategy", strategy_agent)
    workflow.add_node("prd", prd_agent)
    
    workflow.set_entry_point("analytics")
    workflow.add_edge("analytics", "customer")
    workflow.add_edge("customer", "market")
    workflow.add_edge("market", "strategy")
    workflow.add_edge("strategy", "prd")
    workflow.add_edge("prd", END)
    
    return workflow.compile()

product_manager_agent = create_product_manager_graph()
