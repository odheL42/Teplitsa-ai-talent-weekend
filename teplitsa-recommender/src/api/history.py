from fastapi import APIRouter

from src.models.storage import DBChatMessage
from src.storage import completion_store

router = APIRouter()


@router.get("/history", tags=["History"])
async def history() -> list[DBChatMessage]:
    return completion_store.list()


@router.post("/erase_history", tags=["History"])
async def erase_history():
    return completion_store.erase()
