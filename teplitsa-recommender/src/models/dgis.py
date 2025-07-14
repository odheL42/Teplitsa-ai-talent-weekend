from typing import Any

from pydantic import BaseModel

# === Places ===


class Meta(BaseModel):
    code: int
    api_version: str | None = None
    issue_date: str | None = None


class Item(BaseModel):
    id: str
    name: str | None = None
    type: str | None = None
    region_id: str | None = None
    full_address_name: str | None = None
    address_name: str | None = None
    point: str | None = None
    description: str | None = None


class SearchResult(BaseModel):
    context_rubrics: list[dict[str, Any]] | None = None
    items: list[Item]
    search_attributes: dict[str, Any] | None = None


class SearchResponse(BaseModel):
    meta: Meta
    result: SearchResult
