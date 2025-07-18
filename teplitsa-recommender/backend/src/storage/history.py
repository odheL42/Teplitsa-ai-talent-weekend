import json
from pathlib import Path

from src.config import config
from src.context.session import SessionContext
from src.models.completions import ChatMessage
from src.models.storage import DBChatMessage


class HistoryStore:
    @classmethod
    def _ensure_path(cls) -> Path:
        user_context = SessionContext.get_user_context()
        config.history_dir.mkdir(exist_ok=True, parents=True)
        path = Path(config.history_dir / f"{str(user_context.user_id)}.json")

        if not path.exists():
            path.write_text("[]", encoding="utf-8")

        return path

    @classmethod
    def _load(cls) -> list[DBChatMessage]:
        path = cls._ensure_path()
        with path.open("r", encoding="utf-8") as f:
            return [DBChatMessage.model_validate(item) for item in json.load(f)]

    @classmethod
    def _save(cls, completions: list[DBChatMessage]):
        path = cls._ensure_path()
        with path.open("w", encoding="utf-8") as f:
            json.dump(
                [c.model_dump(mode="json") for c in completions],
                f,
                indent=4,
                ensure_ascii=False,
            )

    @classmethod
    def add(cls, chat_message: ChatMessage) -> DBChatMessage:
        completions = cls._load()
        db_chat_message = DBChatMessage(message=chat_message)
        completions.append(db_chat_message)
        cls._save(completions)
        return db_chat_message

    @classmethod
    def last(cls) -> DBChatMessage | None:
        history = cls._load()
        if history:
            return history[-1]
        return None

    @classmethod
    def list(cls) -> list[DBChatMessage]:
        return cls._load()

    @classmethod
    def pop(cls) -> DBChatMessage | None:
        completions = cls._load()
        if completions:
            db_chat_message = completions.pop()
            cls._save(completions)
            return db_chat_message
        return None

    @classmethod
    def update(cls, chat_message: ChatMessage) -> DBChatMessage | None:
        completions = cls._load()
        if completions:
            completions[-1] = DBChatMessage(message=chat_message)
            cls._save(completions)
            return completions[-1]
        return None

    @classmethod
    def erase(cls):
        cls._save([])
