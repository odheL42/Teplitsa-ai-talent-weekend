import pytest

from src.connectors.dgis.places import get_teplitsa
from src.models.dgis import SearchResponse


@pytest.mark.integration
def test_search_items_default_query():
    response: SearchResponse = get_teplitsa()

    assert isinstance(response, SearchResponse)
    assert response.meta.code == 200
    assert len(response.result.items) > 0

    for item in response.result.items:
        assert "Теплица" in item.name or "Теплица" in (
            item.description or ""
        )  # хотя бы упоминание
