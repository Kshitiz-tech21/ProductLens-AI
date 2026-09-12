import os
from abc import ABC, abstractmethod
from typing import List, Dict, Any

class AIProvider(ABC):
    @abstractmethod
    def generate(self, prompt: str, system_prompt: str = "") -> str:
        pass

    @abstractmethod
    def analyze_data(self, data: Any, question: str) -> Dict[str, Any]:
        pass

class DemoProvider(AIProvider):
    def generate(self, prompt: str, system_prompt: str = "") -> str:
        # Deterministic demo responses based on prompt keywords
        prompt_l = prompt.lower()
        if "checkout conversion" in prompt_l:
            return "Investigation reveals that checkout conversion dropped by 18% primarily due to a 24% increase in payment failures on mobile devices. Customer feedback mentions the payment page freezing."
        if "retention" in prompt_l:
            return "Retention is falling among SMB users who joined in Q3. The primary reason is a lack of advanced reporting features."
        return "This is a demo response. In production, a real LLM would analyze the data and provide an insight."

    def analyze_data(self, data: Any, question: str) -> Dict[str, Any]:
        # Synthetic analysis results
        return {
            "issue": "Checkout Conversion ↓ 18%",
            "affected_group": "Mobile users",
            "contribution": "72%",
            "correlated_signal": "Payment failures ↑ 24%",
            "feedback": "Payment page freezing complaints ↑ 37%",
            "root_cause": "Mobile payment-flow instability",
            "confidence": 0.87,
            "affected_users": 2340,
            "priority": "High"
        }

class OpenAIProvider(AIProvider):
    def __init__(self, api_key: str):
        from langchain_openai import ChatOpenAI
        self.llm = ChatOpenAI(api_key=api_key, model="gpt-4o")

    def generate(self, prompt: str, system_prompt: str = "") -> str:
        # Integration logic here
        return "OpenAI response"

    def analyze_data(self, data: Any, question: str) -> Dict[str, Any]:
        return {"result": "OpenAI analysis"}

def get_ai_provider() -> AIProvider:
    provider_type = os.getenv("AI_PROVIDER", "demo")
    if provider_type == "openai":
        return OpenAIProvider(os.getenv("OPENAI_API_KEY", ""))
    return DemoProvider()
