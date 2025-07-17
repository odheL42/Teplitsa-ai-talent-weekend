from collections.abc import AsyncGenerator

from loguru import logger

from src.chat.prompts.system import build_system_prompt
from src.chat.prompts.validator import wrap_user_prompt
from src.chat.validator import ValidatorService
from src.connectors.openai import CompletionsGenerator
from src.models.completions import ChatMessage
from src.models.validator import ValidatorResponse
from src.storage.history import get_history_store


class PromptBuilder:
    def __init__(self):
        self.validator = ValidatorService()
        self.system_prompt = self.system()

    def system(self) -> ChatMessage:
        prompt = build_system_prompt()
        return ChatMessage(role="system", content=prompt)

    async def user(self, query: str) -> ChatMessage:
        response: ValidatorResponse | None = await self.validator.validate(query)

        if not response or response.verdict:
            content = query
        else:
            content = wrap_user_prompt(query, response=response)

        logger.debug(
            {
                "verdict": response,
                "query": query,
                "rewritten": content if content != query else "unchanged",
            },
        )
        return ChatMessage(role="user", content=content)


class HistoryService:
    def __init__(self):
        self.buffer = ""
        self.history_store = get_history_store()

    def update(self, chunk: str):
        if not self.buffer:
            self.history_store.add(ChatMessage(role="assistant", content=""))
        self.buffer += chunk
        msg = ChatMessage(role="assistant", content=self.buffer)
        self.history_store.update(msg)

    def save_request(self, query: str):
        chat_message = ChatMessage(role="user", content=query)
        self.history_store.add(chat_message)

    def list(self) -> list[ChatMessage]:
        return [c.message for c in self.history_store.list()]

    def flush(self):
        self.buffer = ""


class ChatService:
    def __init__(self):
        self.completions = CompletionsGenerator()
        self.prompt_builder = PromptBuilder()
        self.history = HistoryService()

    async def stream(self, query: str) -> AsyncGenerator[str]:
        self.history.save_request(query)

        params: dict[str, ChatMessage | list[ChatMessage]] = {
            "query": await self.prompt_builder.user(query),
            "history": self.history.list(),
            "system_prompt": self.prompt_builder.system(),
        }

        async for chunk in self.completions(**params):
            self.history.update(chunk)
            yield chunk

        self.history.flush()
