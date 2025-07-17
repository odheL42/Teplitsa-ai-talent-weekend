from loguru import logger
from pydantic import BaseModel, ValidationError

from src.chat.prompts.validator import (
    build_system_validator_prompt,
    build_validator_prompt,
)
from src.connectors.openai import CompletionsFullResponse


class ValidatorResponse(BaseModel):
    verdict: bool  # True - OK, False - Violates
    reason: str | None = None


class ValidatorService:
    def __init__(self):
        self.completions = CompletionsFullResponse()

    def _parse_response(self, response: str) -> ValidatorResponse | None:
        try:
            return ValidatorResponse.model_validate_json(response)
        except ValidationError:
            logger.warning(f"Invalid validator response: {response}")
            return None

    async def validate(self, query) -> ValidatorResponse | None:
        response = await self.completions.create(
            query=build_validator_prompt(query),
            history=[],
            system_prompt=build_system_validator_prompt(),
        )
        return self._parse_response(response)
