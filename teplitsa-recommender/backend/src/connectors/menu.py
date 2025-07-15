import re
from enum import Enum
from functools import lru_cache
from typing import TypeVar

from bs4 import BeautifulSoup, Tag

from src.models.menu import Dish, DishCategory, DishContext

E = TypeVar("E", bound=Enum)


def parse_enum(value: str, enum_cls: type[E]) -> E:
    normalized = normalize(value)
    for member in enum_cls:
        if member.value == normalized:
            return member
    raise ValueError(f"{value!r} is not a valid {enum_cls.__name__}")


def get_html_from_file(file_path: str) -> str:
    with open(file_path, encoding="utf-8") as f:
        html = f.read()

    return html


def normalize(raw: str | None) -> str | None:
    if raw:
        return " ".join(raw.strip("— \n\t").lower().split())
    return None


def split_description(description: str) -> tuple[str | None, str | None]:
    quantity_re = re.compile(
        r"\b\d+(?:\/\d+)?(?:[–/-]\d+)?\s*(?:шт/уп|гр|г|мл|шт|уп|л)\b", re.IGNORECASE
    )

    # Ищем все количественные выражения
    quantities = quantity_re.findall(description)

    # Удаляем все такие выражения из описания
    composition = quantity_re.sub("", description).strip(" .,") if description else None

    quantity = ", ".join(quantities) if quantities else None

    return normalize(quantity), normalize(composition)


def parse_card(card: Tag) -> dict:
    title_tag = card.find("div", class_="t1025__title")
    title = title_tag.get_text(strip=True) if title_tag else ""
    title = normalize(title)

    descr_tag = card.find("div", class_="t1025__descr")
    description = descr_tag.get_text(strip=True) if descr_tag else ""

    quantity, composition = split_description(description)

    price_tag = card.find_next("div", class_="t1025__price-value")
    price = price_tag.get_text(strip=True) if price_tag else ""

    return {
        "title": title,
        "composition": composition,
        "quantity": quantity,
        "price": price,
    }


@lru_cache
def get_menu() -> list[Dish]:
    html = get_html_from_file("./src/connectors/teplitsamenu.ru.html")

    soup = BeautifulSoup(markup=html, features="html.parser")

    dish = {"context": None, "category": None, "title": None}

    result = []
    for tag in soup.find_all(True):
        tag_classes = tag.get("class", [])

        if "t030__title" in tag_classes:
            context = tag.get_text(strip=True)
            if "ДОСТАВКА" in context:
                break
            dish["context"] = parse_enum(context, DishContext)
        elif "t030__descr" in tag_classes:
            category = tag.get_text(strip=True)
            dish["category"] = parse_enum(category, DishCategory)
        elif "t1025__item" in tag_classes:
            card = parse_card(tag)
            dish.update(card)
            result.append(Dish(**dish))

    return result


def get_dish_by_id(id: str) -> Dish | None:
    menu = get_menu()

    for dish in menu:
        if dish.id == id:
            return dish
    return None
