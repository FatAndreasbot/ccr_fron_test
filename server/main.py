import sqlite3
from datetime import datetime, timedelta
from typing import Annotated, Any

import jwt
from fastapi import Depends, FastAPI
from fastapi.exceptions import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from starlette.status import HTTP_401_UNAUTHORIZED

from definitions import NewsArticle, Position, User
from dependencies import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    ALGORITHM,
    SECRET_KEY,
    get_current_user,
)

app = FastAPI()

origins = ["http://localhost:4200"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d


@app.post("/api/auth/login/")
def login_user(form_data: User):
    username = form_data.username
    password = form_data.password

    exp = datetime.now() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    with sqlite3.connect("tasks.db") as con:
        sql = f"""
        select
            id as user_id
        from
            users u
        where
            u.username='{username}'
            and u.password='{password}'
        """
        con.row_factory = dict_factory

        cur = con.cursor()
        res = cur.execute(sql)

    tokendata: dict[str, Any] | None = res.fetchone()
    if tokendata is None:
        raise HTTPException(HTTP_401_UNAUTHORIZED)
    tokendata["exp"] = exp
    token = jwt.encode(payload=tokendata, key=SECRET_KEY, algorithm=ALGORITHM)

    return {"key": token}


@app.get("/api/news/")
def post_task():
    with sqlite3.connect("tasks.db") as con:
        sql = "select id, title, content from news"
        con.row_factory = dict_factory

        cur = con.cursor()

        res = cur.execute(sql).fetchall()

    return [NewsArticle(**r) for r in res]


@app.get("/api/position/")
def put_task(user: Annotated[User, Depends(get_current_user)]):
    with sqlite3.connect("tasks.db") as con:
        sql = "select name, latitude, longitude from positions"
        con.row_factory = dict_factory

        cur = con.cursor()

        res = cur.execute(sql).fetchall()

    return [Position(**r) for r in res]


# @app.delete("/")
# def delete_task(user: Annotated[User, Depends(get_current_user)], task_id: int):
#     with sqlite3.connect("tasks.db") as con:
#         sql = f"""
#             delete from tasks where id={task_id}
#         """
#         cur = con.cursor()
#         cur.execute(sql)
#         con.commit()

#     return {"msg": "task deleted"}
