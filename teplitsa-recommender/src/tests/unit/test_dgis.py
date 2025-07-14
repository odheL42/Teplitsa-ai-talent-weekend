import pytest
import respx
from httpx import Response

from src.connectors.dgis.places import get_teplitsa
from src.models.dgis import SearchResponse


@respx.mock
@pytest.mark.unit
def test_search_items_basic(monkeypatch):
    # Mock secret and config
    monkeypatch.setattr(
        "src.connectors.dgis.places.secrets.dgis_key.get_secret_value",
        lambda: "test-api-key",
    )
    monkeypatch.setattr(
        "src.connectors.dgis.places.config.dgis_base_url", "https://mock.dgis.api"
    )

    # Expected mock data
    mock_response_data = {
        "meta": {"code": 200, "api_version": "3.0.18918"},
        "result": {
            "total": 1,
            "items": [
                {
                    "id": "123",
                    "name": "Кафе Теплица",
                    "type": "branch",
                    "address_name": "Площадь Карла Маркса, 7",
                    "address_comment": "15 этаж",
                }
            ],
        },
    }

    # Define the mocked route
    respx.get("https://mock.dgis.api/3.0/items/byid").mock(
        return_value=Response(200, json=mock_response_data)
    )

    # Call the function
    result = get_teplitsa()

    # Assertions
    assert isinstance(result, SearchResponse)
    assert result.meta.code == 200
    assert len(result.result.items) == 1
    assert result.result.items[0].name == "Кафе Теплица"
