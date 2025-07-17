from contextvars import ContextVar

from src.models.cart import Cart
from src.models.preferences import Preferences


class RequestContext:
    _user_preferences: ContextVar[Preferences] = ContextVar(
        "user_preferences", default=None
    )
    _user_cart: ContextVar[Cart] = ContextVar("user_cart", default=None)

    @classmethod
    def set_user_preferences(cls, prefs: Preferences):
        cls._user_preferences.set(prefs)

    @classmethod
    def get_user_preferences(cls) -> Preferences | None:
        return cls._user_preferences.get()

    @classmethod
    def set_user_cart(cls, cart: Cart):
        cls._user_cart.set(cart)

    @classmethod
    def get_user_cart(cls) -> Cart | None:
        return cls._user_cart.get()
