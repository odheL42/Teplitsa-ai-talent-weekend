from contextlib import aclosing

from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from src.chat.service import ChatService, CompletionSaver

router = APIRouter()
saver = CompletionSaver()
chat = ChatService()


@router.post("/completions", tags=["Completions"])
async def create_completions(query: str):
    saver.save_request(query)

    async def streaming_wrapper():
        generator = saver.wrap(chat.stream(query))
        async with aclosing(generator) as _generator:
            async for chunk in _generator:
                yield chunk

    return StreamingResponse(
        content=streaming_wrapper(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
