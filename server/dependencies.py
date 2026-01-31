import sqlite3
from typing import Annotated, Any, Optional, cast

import jwt
from annotated_doc import Doc
from fastapi import Depends
from fastapi.exceptions import HTTPException
from fastapi.openapi.models import OAuthFlows as OAuthFlowsModel

# from fastapi.security import OAuth2PasswordBearer
from fastapi.security import OAuth2
from fastapi.security.utils import get_authorization_scheme_param
from jwt.exceptions import InvalidTokenError
from starlette.requests import Request
from starlette.status import HTTP_401_UNAUTHORIZED

from definitions import User

SECRET_KEY = (
    "OemqqLjOQigFi9Kg7dJgx6zTcNTLn9iluOlh7W4sBWirpuyeclrxBTAmdoh8BOQ2TLkvTfWHfGO"
)
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


# Litteraly the copt of # from fastapi.security import OAuth2PasswordBearer
# using it because the spec requires the use of the word "token" instead of bearer
class OAuth2PasswordBearer(OAuth2):
    """
    OAuth2 flow for authentication using a bearer token obtained with a password.
    An instance of it would be used as a dependency.

    Read more about it in the
    [FastAPI docs for Simple OAuth2 with Password and Bearer](https://fastapi.tiangolo.com/tutorial/security/simple-oauth2/).
    """

    def __init__(
        self,
        tokenUrl: Annotated[
            str,
            Doc(
                """
                The URL to obtain the OAuth2 token. This would be the *path operation*
                that has `OAuth2PasswordRequestForm` as a dependency.
                """
            ),
        ],
        scheme_name: Annotated[
            Optional[str],
            Doc(
                """
                Security scheme name.

                It will be included in the generated OpenAPI (e.g. visible at `/docs`).
                """
            ),
        ] = None,
        scopes: Annotated[
            Optional[dict[str, str]],
            Doc(
                """
                The OAuth2 scopes that would be required by the *path operations* that
                use this dependency.
                """
            ),
        ] = None,
        description: Annotated[
            Optional[str],
            Doc(
                """
                Security scheme description.

                It will be included in the generated OpenAPI (e.g. visible at `/docs`).
                """
            ),
        ] = None,
        auto_error: Annotated[
            bool,
            Doc(
                """
                By default, if no HTTP Authorization header is provided, required for
                OAuth2 authentication, it will automatically cancel the request and
                send the client an error.

                If `auto_error` is set to `False`, when the HTTP Authorization header
                is not available, instead of erroring out, the dependency result will
                be `None`.

                This is useful when you want to have optional authentication.

                It is also useful when you want to have authentication that can be
                provided in one of multiple optional ways (for example, with OAuth2
                or in a cookie).
                """
            ),
        ] = True,
        refreshUrl: Annotated[
            Optional[str],
            Doc(
                """
                The URL to refresh the token and obtain a new one.
                """
            ),
        ] = None,
    ):
        if not scopes:
            scopes = {}
        flows = OAuthFlowsModel(
            password=cast(
                Any,
                {
                    "tokenUrl": tokenUrl,
                    "refreshUrl": refreshUrl,
                    "scopes": scopes,
                },
            )
        )
        super().__init__(
            flows=flows,
            scheme_name=scheme_name,
            description=description,
            auto_error=auto_error,
        )

    async def __call__(self, request: Request) -> Optional[str]:
        authorization = request.headers.get("Authorization")
        scheme, param = get_authorization_scheme_param(authorization)
        if not authorization or scheme.lower() != "token":
            if self.auto_error:
                raise self.make_not_authenticated_error()
            else:
                return None
        return param


auth_bearer = OAuth2PasswordBearer(tokenUrl="/auth/")


def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d


def get_current_user(token: Annotated[str, Depends(auth_bearer)]) -> User:
    credential_exception = HTTPException(
        status_code=HTTP_401_UNAUTHORIZED, headers={"Authorization": "Token"}
    )

    try:
        payload: dict[str, Any] = jwt.decode(
            jwt=token, key=SECRET_KEY, algorithms=ALGORITHM
        )
        user_id = payload.get("user_id")
        if user_id is None:
            raise credential_exception
    except InvalidTokenError as e:
        print(e)
        raise credential_exception

    with sqlite3.connect("tasks.db") as con:
        sql = f"""
        select
            id,
            username,
            password
        from users u where u.id={user_id}
        """
        con.row_factory = dict_factory

        cur = con.cursor()
        res = cur.execute(sql)

    userdata = res.fetchone()
    if userdata is None:
        raise credential_exception

    user = User(**userdata)
    return user
