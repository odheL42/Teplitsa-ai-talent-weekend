from datetime import datetime
from uuid import UUID, uuid4

from pydantic import BaseModel, Field
from src.config import timezone

from .completions import ChatMessage
from .menu import Dish


class DBChatMeta(BaseModel):
    time: datetime = Field(default_factory=lambda: datetime.now(timezone))


class DBChatMessage(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    message: ChatMessage
    meta: DBChatMeta = Field(default_factory=DBChatMeta)
    dishes: list[Dish] | None = None
