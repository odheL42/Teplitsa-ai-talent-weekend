import tempfile
from pathlib import Path

import pytest

from src.models.completions import ChatMessage
from src.models.storage import DBChatMessage
from src.storage.history import HistoryStore

# === Fixtures ===


@pytest.fixture
def sample_chat_message() -> ChatMessage:
    return ChatMessage(role="user", content="Привет!")


@pytest.fixture
def store_with_temp_file(monkeypatch) -> HistoryStore:
    with tempfile.NamedTemporaryFile(delete=False, mode="w+", encoding="utf-8") as f:
        f.write("[]")
        temp_path = Path(f.name)

    # Подменяем config.history_json
    monkeypatch.setattr("src.config.config.history_json", str(temp_path))

    store = HistoryStore()
    yield store

    temp_path.unlink()  # Удаляем временный файл после теста


@pytest.mark.unit
def test_add_and_list(store_with_temp_file, sample_chat_message):
    store = store_with_temp_file
    added = store.add(sample_chat_message)

    # Проверяем структуру
    assert added.message == sample_chat_message
    history = store.list()
    assert len(history) == 1
    assert history[0].message == sample_chat_message


@pytest.mark.unit
def test_last(store_with_temp_file, sample_chat_message):
    store = store_with_temp_file
    assert store.last() is None  # Пустое хранилище

    store.add(sample_chat_message)
    last_msg = store.last()

    assert last_msg is not None
    assert last_msg.message.content == "Привет!"


@pytest.mark.unit
def test_pop(store_with_temp_file, sample_chat_message):
    store = store_with_temp_file
    assert store.pop() is None  # Ничего не должно быть

    store.add(sample_chat_message)
    popped = store.pop()

    assert isinstance(popped, DBChatMessage)
    assert popped.message == sample_chat_message
    assert store.list() == []


@pytest.mark.unit
def test_update(store_with_temp_file, sample_chat_message):
    store = store_with_temp_file

    assert store.update(sample_chat_message) is None  # Нечего обновлять

    store.add(sample_chat_message)
    updated_msg = ChatMessage(role="user", content="Обновлённое сообщение")

    updated = store.update(updated_msg)
    assert updated.message.content == "Обновлённое сообщение"
    assert store.last().message.content == "Обновлённое сообщение"
