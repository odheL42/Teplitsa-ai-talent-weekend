
from pydantic import BaseModel


class Dish(BaseModel):
    title: str
    price: str
    category: str
    weight: str | None
    composition: str | None