import json

import requests
from bs4 import BeautifulSoup

url = "https://www.teplitsamenu.ru/"
response = requests.get(url)
soup = BeautifulSoup(response.text, "html.parser")

menu_items = []

for card in soup.select(".t-store__card"):
    title = card.select_one(".t-store__card__title")
    price = card.select_one(".t-store__card__price")
    img = card.select_one("img")

    if not (title and price):
        continue

    menu_items.append(
        {
            "name": title.get_text(strip=True),
            "price": price.get_text(strip=True),
            "image": img["src"] if img else None,
        }
    )

# save to json or use directly

with open("teplitsa_menu.json", "w", encoding="utf-8") as f:
    json.dump(menu_items, f, ensure_ascii=False, indent=2)
