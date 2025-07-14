from collections.abc import AsyncGenerator
from contextlib import aclosing

import gradio as gr
from loguru import logger

from src.chat.service import ChatService
from src.models.completions import ChatMessage

chat = ChatService()


def get_history() -> list[dict]:
    return [{"role": c.role, "content": c.content} for c in chat.history()]


def to_chat_messsages(gradio_history: list[dict]) -> list[ChatMessage]:
    return [ChatMessage(**c) for c in gradio_history]


async def stream_chat(
    message: str,
    history: list[dict],
) -> AsyncGenerator[dict]:
    reply = ""
    logger.debug(history)
    generator = chat.gradio_stream(message, to_chat_messsages(history))
    async with aclosing(generator) as _generator:
        async for chunk in _generator:
            reply += chunk
            if not reply.strip():
                yield "⌛ Модель думает..."
            else:
                yield reply


gr.ChatInterface(fn=stream_chat, type="messages", additional_inputs=[]).launch(
    server_port=8000, debug=True
)
