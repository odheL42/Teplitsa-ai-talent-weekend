from enum import Enum

from pydantic import BaseModel


class CurrentMenuCategory(Enum, str):
    complex: "complex"
    base: "base"

class CPFCModel(BaseModel): # per 100g
    calories: int
    proteins: int
    fats: int
    carbs: int

class CurrentMenu(BaseModel):
    index: str # (аналогично текущей реализации меню)
    category: CurrentMenuCategory
    quantity: str # (выход, гр)
    price: int
    stock: bool | None = None
    notes: str | None = None # уточнения
    cpfc: CPFCModel | None = None

            

