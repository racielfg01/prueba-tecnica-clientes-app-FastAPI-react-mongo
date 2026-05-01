from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class Session(BaseModel):
    token: str
    userid: str
    username: str
    login_timestamp: datetime = datetime.utcnow()

class SessionCreate(BaseModel):
    token: str
    userid: str
    username: str