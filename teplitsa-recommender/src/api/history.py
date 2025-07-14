from fastapi import APIRouter

from src.models.completions import Completion
from src.storage import completion_store

router = APIRouter()


@router.get("/history", tags=["History"])
async def history() -> list[Completion]:
    return completion_store.list()
