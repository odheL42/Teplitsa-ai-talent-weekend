from typing import Literal

from pydantic import BaseModel

from src.models.cart import Cart
from src.models.preferences import Preferences


class ChatMessage(BaseModel):
    role: Literal["system", "user", "assistant", "function"]
    content: str
    name: str | None = None


class APICompletionsRequest(BaseModel):
    query: str
    cart: Cart
    preferences: Preferences


class Choice(BaseModel):
    index: int
    message: ChatMessage
    finish_reason: str | None


class Usage(BaseModel):
    prompt_tokens: int
    completion_tokens: int
    total_tokens: int


class ChatCompletionResponse(BaseModel):
    index: str
    object: str
    created: int
    model: str
    choices: list[Choice]
    usage: Usage | None


class ChunkResponse(BaseModel):
    type: Literal["error", "default"] = "default"
    text: str
