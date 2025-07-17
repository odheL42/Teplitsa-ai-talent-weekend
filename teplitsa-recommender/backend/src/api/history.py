from fastapi import APIRouter, Depends

from src.models.storage import DBChatMessage
from src.storage.history import HistoryStore, get_history_store

router = APIRouter()


@router.get("/history", tags=["History"])
async def history(
    store: HistoryStore = Depends(get_history_store),
) -> list[DBChatMessage]:
    return store.list()


@router.post("/erase_history", tags=["History"])
async def erase_history(store: HistoryStore = Depends(get_history_store)):
    return store.erase()
