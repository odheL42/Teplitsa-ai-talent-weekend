from loguru import logger

from src.connectors.current_menu import get_current_menu
from src.models.current_menu import CurrentMenuDish


class CurrentMenuPrompt:
    _current_menu_template = """
---

**Меню, доступное пользователю сейчас**:

{menu_items}
"""

    @classmethod
    def _format_dish(cls, dish: CurrentMenuDish, idx: int) -> str:
        parts = [f"{idx}. {dish.title}"]

        parts.append(f"Категория: {dish.category.value}")
        parts.append(f"Подкатегория: {dish.subcategory}")
        parts.append(f"Порция: {dish.quantity}")
        parts.append(f"Цена: {dish.price}")

        if dish.stock is False:
            parts.append("Нет в наличии")

        if dish.cpfc:
            cpfc = dish.cpfc
            parts.append(
                f"Пищевая ценность (на 100г): {cpfc.calories} ккал, Б: {cpfc.proteins}г, Ж: {cpfc.fats}г, У: {cpfc.carbs}г"
            )

        if dish.notes:
            parts.append(f"Примечание: {dish.notes}")

        return "\n".join(parts)

    @classmethod
    async def get(cls) -> dict:
        menu: list[CurrentMenuDish] = await get_current_menu(
            "backend/src/connectors/menu_21_july.json"
        )
        if not menu:
            return {"current_menu": ""}

        formatted_items = [
            cls._format_dish(dish, idx + 1) for idx, dish in enumerate(menu)
        ]
        menu_text = "\n\n".join(formatted_items)
        prompt = cls._current_menu_template.format(menu_items=menu_text)

        logger.debug(f"CurrentMenuPrompt:\n{prompt}")
        return {"current_menu": prompt}
