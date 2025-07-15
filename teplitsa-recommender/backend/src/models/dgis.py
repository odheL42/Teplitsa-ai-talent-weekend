from pydantic import BaseModel

# === Places ===


class Meta(BaseModel):
    code: int
    api_version: str
    issue_date: str | None = None


class Item(BaseModel):  # only necessary
    id: str
    type: str
    name: str
    address_name: str
    address_comment: str


class SearchResult(BaseModel):
    total: int
    items: list[Item]


class SearchResponse(BaseModel):
    meta: Meta
    result: SearchResult
