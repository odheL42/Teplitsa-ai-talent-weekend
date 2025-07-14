from pydantic import BaseModel


class ChatMessage(BaseModel):
    role: str
    content: str


class Choice(BaseModel):
    index: int
    message: ChatMessage
    finish_reason: str | None


class Usage(BaseModel):
    prompt_tokens: int
    completion_tokens: int
    total_tokens: int


class Completion(BaseModel):
    id: str
    object: str
    created: int
    model: str
    choices: list[Choice]
    usage: Usage
