from fastapi import APIRouter, HTTPException

from src.connectors.menu import get_dish_by_id, get_menu
from src.models.current_menu import CurrentMenuDish

router = APIRouter()


@router.get("/menu/byid", tags=["Menu"])
async def get_dish(index: str) -> CurrentMenuDish:
    dish = await get_dish_by_id(index)
    if dish is None:
        raise HTTPException(status_code=404, detail=f"Dish with id '{index}' not found")
    return dish


@router.get("/menu", tags=["Menu"])
async def get_full_menu() -> list[CurrentMenuDish]:
    return await get_menu()
