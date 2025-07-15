from enum import Enum
from typing import Generator

from pydantic import BaseModel, Field


class DishIDGenerator:
    def __init__(self):
        self.generator = self._generator()

    def _generator(self) -> Generator[str]:
        for i in range(1000):
            yield f"dish_{i}"

    def get_next(self) -> str:
        return next(self.generator)


id_generator = DishIDGenerator()


class DishCategory(Enum):
    pass


class Dish(BaseModel):
    id: str = Field(default_factory=id_generator.get_next)
    title: str
    price: str
    category: DishCategory
    weight: str | None
    composition: str | None
