from contextlib import aclosing

from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from loguru import logger

from src.chat.service import ChatService, CompletionSaver
from src.models.completions import APICompletionsRequest

router = APIRouter()
saver = CompletionSaver()
chat = ChatService()


@router.post("/completions", tags=["Completions"])
async def create_completions(request: APICompletionsRequest):
    saver.save_request(request.query)

    async def streaming_wrapper():
        try:
            generator = saver.wrap(chat.stream(request.query))
            async with aclosing(generator) as _generator:
                async for chunk in _generator:
                    yield chunk
        except Exception as err:
            logger.exception(err)
            return

    return StreamingResponse(
        content=streaming_wrapper(),
        media_type="text/plain",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
