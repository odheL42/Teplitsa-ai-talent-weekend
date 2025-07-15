from collections.abc import AsyncGenerator

from src.chat.prompts.system import build_system_prompt
from src.connectors.openai import CompletionsGenerator
from src.models.completions import ChatMessage
from src.storage.history import completion_store


class ChatService:
    def __init__(self):
        self.completions = CompletionsGenerator()
        self.system_prompt = self._build_system_prompt()

    def _build_system_prompt(self) -> ChatMessage:
        prompt = build_system_prompt()
        return ChatMessage(role="system", content=prompt)

    async def stream(self, query: str) -> AsyncGenerator[str]:
        params = {
            "query": ChatMessage(role="user", content=query),
            "history": [c.message for c in completion_store.list()],
            "system_prompt": self.system_prompt,
        }

        async for chunk in self.completions(**params):
            yield chunk

    async def gradio_stream(
        self, query: str, history: list[ChatMessage]
    ) -> AsyncGenerator[str]:
        params = {
            "query": ChatMessage(role="user", content=query),
            "history": history,
            "system_prompt": self.system_prompt,
        }

        async for chunk in self.completions(**params):
            yield chunk


class CompletionSaver:
    def __init__(self):
        self.buffer = ""

    async def wrap(
        self, generator: AsyncGenerator[str, None]
    ) -> AsyncGenerator[str, None]:
        async for chunk in generator:
            self._update(chunk)
            yield chunk
        self.buffer = ""

    def _update(self, chunk: str):
        if not self.buffer:
            completion_store.add(ChatMessage(role="assistant", content=""))
        self.buffer += chunk
        msg = ChatMessage(role="assistant", content=self.buffer)
        completion_store.update(msg)

    def save_request(self, query: str):
        chat_message = ChatMessage(role="user", content=query)
        completion_store.add(chat_message)
        
        

