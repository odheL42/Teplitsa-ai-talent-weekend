from enum import Enum

from fastapi import HTTPException


class FileErrorMessages(Enum):
    GENERATION_ERROR = "Generation Failed."


class FileUploadException(HTTPException):
    """Base exception for file upload errors."""

    def __init__(self, error_message: FileErrorMessages, status_code: int, **kwargs):
        self.message = error_message.value.format(**kwargs)
        super().__init__(status_code=status_code, detail=self.message)


class APIGenerationException(FileUploadException):
    def __init__(self):
        super().__init__(FileErrorMessages.GENERATION_ERROR, 500)
