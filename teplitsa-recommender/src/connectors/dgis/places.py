import httpx

from models import SearchResponse
from src.config import config, secrets


def search_items(
    q: str | None = None,
    locale: str = "ru_RU",
    type: str | list[str] | None = None,
    fields: str | list[str] | None = None,
    region_id: int | None = None,
    page: int = 1,
    page_size: int = 20,
    **kwargs,
) -> SearchResponse:
    client = httpx.Client(timeout=10.0)
    url = f"{config.dgis_base_url}/items"
    params = {
        "key": secrets.dgis_key.get_secret_value(),
        "q": q,
        "locale": locale,
        "region_id": region_id,
        "page": page,
        "page_size": page_size,
    }

    if type:
        params["type"] = ",".join(type) if isinstance(type, list) else type
    if fields:
        params["fields"] = ",".join(fields) if isinstance(fields, list) else fields

    for key, value in kwargs.items():
        if value is not None:
            params[key] = value

    response = client.get(url, params=params)
    response.raise_for_status()
    return SearchResponse.model_validate(response.json())
