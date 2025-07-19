from pydantic import BaseModel


class DBHistorySummary(BaseModel):
    summary: str = ""


class DBNotes(BaseModel):
    notes: str = ""


class RequestNotes(BaseModel):
    notes: str


class SummaryResponse(BaseModel):
    """
    Используется для валидации ответа модели
    """

    summary: str
    new_notes: str  # Новые предпочтения пользователя, выявленные по истории сообшений и старому саммари
