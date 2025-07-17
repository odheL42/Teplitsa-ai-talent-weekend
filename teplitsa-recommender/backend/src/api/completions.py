from contextlib import aclosing

from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from loguru import logger

from src.chat.service import ChatService
from src.context.request_context import RequestContext
from src.models.completions import APICompletionsRequest

router = APIRouter()
chat = ChatService()


@router.post("/completions", tags=["Completions"])
async def create_completions(request: APICompletionsRequest):
    RequestContext.set_user_cart(request.cart)
    RequestContext.set_user_preferences(request.preferences)

    async def streaming_wrapper():
        try:
            generator = chat.stream(request.query)
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
