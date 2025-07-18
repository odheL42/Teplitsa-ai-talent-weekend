from fastapi import APIRouter, HTTPException

from src.connectors.menu import get_dish_by_id, get_menu
from src.models.menu import Dish

router = APIRouter()


@router.get("/menu/byid", tags=["Menu"])
async def get_dish(id: str) -> Dish:
    dish = await get_dish_by_id(id)
    if dish is None:
        raise HTTPException(status_code=404, detail=f"Dish with id '{id}' not found")
    return dish


@router.get("/menu", tags=["Menu"])
async def get_full_menu() -> list[Dish]:
    return await get_menu()
