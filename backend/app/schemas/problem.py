from pydantic import BaseModel


class ProblemBase(BaseModel):
    title: str
    description: str
    difficulty: str
    topics: str


class ProblemResponse(ProblemBase):
    id: int

    class Config:
        from_attributes = True