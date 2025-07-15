from urllib.parse import urljoin

import httpx

from src.config import config, secrets
from src.models.dgis import SearchResponse


def get_place_by_id(
    idx: int,
) -> SearchResponse:
    client = httpx.Client(timeout=10.0)
    url = urljoin(config.dgis_base_url, "3.0/items/byid")
    params = {
        "key": secrets.dgis_key.get_secret_value(),
        "id": idx,
    }

    response = client.get(url, params=params)
    response.raise_for_status()
    return SearchResponse.model_validate(response.json())


def get_teplitsa() -> SearchResponse:
    return get_place_by_id(idx=70000001020753581)
