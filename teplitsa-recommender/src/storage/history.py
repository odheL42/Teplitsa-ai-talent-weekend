import json
from pathlib import Path

from src.config import config
from src.models.completions import Completion


# === Store class ===
class CompletionStore:
    def __init__(self):
        self.path = Path(config.history_json)
        self._ensure_file()

    def _ensure_file(self):
        if not self.path.exists():
            self.path.write_text("[]", encoding="utf-8")

    def _load(self) -> list[Completion]:
        with self.path.open("r", encoding="utf-8") as f:
            return [Completion(**item) for item in json.load(f)]

    def _save(self, completions: list[Completion]):
        with self.path.open("w", encoding="utf-8") as f:
            json.dump(
                [c.model_dump() for c in completions], f, indent=2, ensure_ascii=False
            )

    def add(self, completion: Completion):
        completions = self._load()
        completions.append(completion)
        self._save(completions)

    def get(self, completion_id: str) -> Completion | None:
        for c in self._load():
            if c.id == completion_id:
                return c
        return None

    def list(self) -> list[Completion]:
        return self._load()

    def delete(self, completion_id: str):
        completions = self._load()
        completions = [c for c in completions if c.id != completion_id]
        self._save(completions)

    def update(self, completion_id: str, new_data: dict):
        completions = self._load()
        for i, c in enumerate(completions):
            if c.id == completion_id:
                completions[i] = c.model_copy(update=new_data)
                self._save(completions)
                return
        raise ValueError(f"Completion with id '{completion_id}' not found")


completion_store = CompletionStore()
