import json

from src.models.current_menu import CPFCModel, CurrentMenu, CurrentMenuCategory


def get_current_menu(path: str) -> list[CurrentMenu]:
    with open(path, encoding="utf-8") as f:
        raw_data = json.load(f)

    menu_items: list[CurrentMenu] = []

    for item in raw_data:
        menu_item = CurrentMenu(
            title=item["title"],
            category=CurrentMenuCategory(item["category"]),
            subcategory=item["subcategory"],
            quantity=item["quantity"],
            price=item["price"],
            stock=item.get("stock", True),
            notes=item.get("notes"),
            cpfc=CPFCModel(**item["cpfc"]) if item.get("cpfc") else None,
        )
        menu_items.append(menu_item)

    return menu_items
