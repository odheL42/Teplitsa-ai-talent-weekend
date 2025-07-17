import json
from pathlib import Path

from src.config import config
from src.models.completions import ChatMessage
from src.models.storage import DBChatMessage


class HistoryStore:
    def __init__(self):
        self.path = Path(config.history_json)
        self._ensure_file()

    def _ensure_file(self):
        if not self.path.exists():
            self.path.write_text("[]", encoding="utf-8")

    def _load(self) -> list[DBChatMessage]:
        with self.path.open("r", encoding="utf-8") as f:
            return [DBChatMessage.model_validate(item) for item in json.load(f)]

    def _save(self, completions: list[DBChatMessage]):
        with self.path.open("w", encoding="utf-8") as f:
            json.dump(
                [c.model_dump(mode="json") for c in completions],
                f,
                indent=4,
                ensure_ascii=False,
            )

    def add(self, chat_message: ChatMessage) -> DBChatMessage:
        completions = self._load()
        db_chat_message = DBChatMessage(message=chat_message)
        completions.append(db_chat_message)
        self._save(completions)
        return db_chat_message

    def last(self) -> DBChatMessage | None:
        history = self._load()
        if history:
            return history[-1]
        return None

    def list(self) -> list[DBChatMessage]:
        return self._load()

    def pop(self) -> DBChatMessage | None:
        completions = self._load()
        if completions:
            db_chat_message = completions.pop()
            self._save(completions)
            return db_chat_message
        return None

    def update(self, chat_message: ChatMessage) -> DBChatMessage | None:
        completions = self._load()
        if completions:
            completions[-1] = DBChatMessage(message=chat_message)
            self._save(completions)
            return completions[-1]
        return None

    def erase(self):
        self._save([])
