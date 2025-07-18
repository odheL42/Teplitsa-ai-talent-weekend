from pydantic import BaseModel


class Preferences(BaseModel):
    gluten_free: bool
    lactose_free: bool
    vegan: bool
    vegetarian: bool
    spicy: bool
    nuts_free: bool
    sugar_free: bool
    halal: bool
    kosher: bool
    soy_free: bool
