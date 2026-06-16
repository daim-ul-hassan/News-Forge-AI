from typing import Generic, TypeVar

from pydantic import BaseModel, Field


DataT = TypeVar("DataT")


class ErrorResponse(BaseModel):
    code: str
    message: str
    details: dict = Field(default_factory=dict)


class ResponseMeta(BaseModel):
    request_id: str | None = None
    pagination: dict | None = None


class ApiResponse(BaseModel, Generic[DataT]):
    data: DataT | None = None
    error: ErrorResponse | None = None
    meta: ResponseMeta = Field(default_factory=ResponseMeta)
