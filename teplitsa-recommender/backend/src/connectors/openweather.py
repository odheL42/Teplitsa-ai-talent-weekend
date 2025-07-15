import httpx

from src.config import config, secrets
from src.models.weather import WeatherResponse


def get_weather() -> WeatherResponse:
    client = httpx.Client()
    novosibirsk_coord = {"lat": 55.0415, "lon": 82.9346}
    params = {
        "appid": secrets.openweather_key.get_secret_value(),
        "units": "metric",
        "lang": "ru",
    }
    params.update(novosibirsk_coord)
    response = client.get(config.openweather_base_url, params=params)
    response.raise_for_status()
    return WeatherResponse(**response.json())
