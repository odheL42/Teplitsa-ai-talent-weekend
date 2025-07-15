import re

import requests
from bs4 import BeautifulSoup

from src.models.menu import Dish


def parse_menu() -> dict[str, dict[str, list[Dish]]]:
    url = "https://teplitsamenu.ru"

    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")

    global_categories = soup.find_all("h2", class_="t030__title")[:-1]

    menu = {}

    for category in global_categories:
        category_title = category.get_text(strip=True)

        sections = category.find_next("div", class_="t030__descr")

        category_sections = {}

        while sections:
            section_title = sections.get_text(strip=True).strip("— ")

            next_section = sections.find_next("div", class_="t1025")
            if not next_section:
                break

            section_dishes = []

            dishes = next_section.find_all("div", class_="t1025__item")

            for dish in dishes:
                name = dish.find("div", class_="t1025__title").get_text(strip=True)

                description_full = dish.find("div", class_="t1025__descr").get_text(
                    strip=True
                )

                weight_match = re.search(
                    r"(\d+(?:\/\d+)?\s*(?:гр|г)\.?)", description_full
                )
                weight_info = weight_match.group(0) if weight_match else ""

                composition = (
                    re.sub(r"\d+(?:\/\d+)?\s*(?:гр|г)\.?", "", description_full)
                    .strip()
                    .rstrip(",")
                )

                if not weight_info:
                    name_weight_match = re.search(
                        r"(\d+(?:\/\d+)?\s*(?:гр|г)\.?)", name
                    )
                    if name_weight_match:
                        weight_info = name_weight_match.group(0)
                        name = re.sub(r"\d+(?:\/\d+)?\s*(?:гр|г)\.?", "", name).strip()

                price = dish.find("div", class_="t1025__price-value").get_text(
                    strip=True
                )

                section_dishes.append(
                    Dish(
                        title=name,
                        composition=composition,
                        weight=weight_info,
                        price=price,
                        category=category_title,
                    )
                )

            category_sections[section_title] = section_dishes

            sections = sections.find_next("div", class_="t030__descr")

        menu[category_title] = category_sections

    return menu
