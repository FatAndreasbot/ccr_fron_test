from pydantic import BaseModel


class Position(BaseModel):
    name: str
    latitude: float
    longitude: float


class NewsArticle(BaseModel):
    id: int
    title: str
    content: str


class Token(BaseModel):
    access_token: str
    token_type: str


class User(BaseModel):
    username: str
    password: str
