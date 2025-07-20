from src.connectors.openweather import get_weather
from src.models.validator import ValidatorResponse
from src.storage.notes import NotesStore
from src.storage.summary import HistorySummaryStore

from .components.cart import CartPrompt
from .components.current_menu import CurrentMenuPrompt
from .components.preferences import PreferencesPrompt
from .components.time_context import get_time_context
from .templates.initial import initial_template
from .templates.summary import system_summary_prompt
from .templates.validator import (
    system_validator_prompt,
    user_query_wrapper,
    validator_prompt,
)


def build_validator_prompt(query: str) -> str:
    return validator_prompt.format(query=query)


def build_system_validator_prompt() -> str:
    return system_validator_prompt


def wrap_user_prompt(query: str, response: ValidatorResponse) -> str:
    return user_query_wrapper.format(query=query, reason=response.reason)


async def build_initial_prompt() -> str:
    fields = dict()

    weather = await get_weather()
    fields["weather_temperature"] = weather.main.temp
    fields["weather_description"] = weather.weather[0].description

    fields.update(await CurrentMenuPrompt.get())
    fields.update(get_time_context())

    fields.update(PreferencesPrompt.get())
    fields.update(await CartPrompt.get())

    return initial_template.substitute(**fields)


async def build_summary_system_prompt() -> str:
    old_summary = await HistorySummaryStore.get()
    notes = await NotesStore.get()
    return system_summary_prompt.substitute(
        old_summary=old_summary.summary, notes=notes.notes
    )
