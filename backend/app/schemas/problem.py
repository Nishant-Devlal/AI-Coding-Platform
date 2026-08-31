from typing import Any

from pydantic import BaseModel


class ProblemBase(BaseModel):
    title: str
    description: str
    difficulty: str
    topics: str | None = None
    constraints: str | None = None
    input_format: str | None = None
    output_format: str | None = None
    examples: list[dict[str, Any]] | None = None
    starter_code: str | None = None

class ProblemResponse(ProblemBase):
    id: int

    class Config:
        from_attributes = True