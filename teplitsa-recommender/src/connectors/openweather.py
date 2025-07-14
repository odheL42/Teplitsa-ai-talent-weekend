import httpx

from src.config import config, secrets
from src.models.weather import WeatherResponse


def get_weather(
    city: str = "Новосибирск", units: str = "metric", lang: str = "ru"
) -> WeatherResponse:
    client = httpx.Client()
    params = {
        "q": city,
        "appid": secrets.openweather_key.get_secret_value(),
        "units": units,
        "lang": lang,
    }
    response = client.get(config.openweather_base_url, params=params)
    response.raise_for_status()
    return WeatherResponse(**response.json())
