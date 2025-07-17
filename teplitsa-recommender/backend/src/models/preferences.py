from pydantic import BaseModel


class Preferences(BaseModel):
    gluten_free: bool = False
    lactose_free: bool = False
    vegan: bool = False
    vegetarian: bool = False
    spicy: bool = False
    nuts_free: bool = False
    sugar_free: bool = False
    halal: bool = False
    kosher: bool = False
    soy_free: bool = False
