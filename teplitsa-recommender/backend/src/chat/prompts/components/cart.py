from loguru import logger

from src.connectors.menu import get_dish_by_id
from src.context.request_context import RequestContext
from src.models.cart import Cart


class CartPrompt:
    _cart_prompt = """
---

**Пользователь уже положил в корзину (количество, название)**:

"""

    @classmethod
    def _format_cart(cls, cart: Cart) -> str:
        lines = ""
        for dish_id, amount in cart.items.items():
            dish = get_dish_by_id(dish_id)
            lines += f"{amount} {dish.title}\n"

        return cls._cart_prompt + lines

    @classmethod
    def get(cls) -> dict:
        cart = RequestContext.get_user_cart()
        if not cart:
            return {"cart": ""}

        prompt = cls._format_cart(cart)
        logger.debug(f"CartPrompt:\n{prompt}")
        return {"cart": prompt}
