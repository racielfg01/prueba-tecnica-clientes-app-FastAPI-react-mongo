from pydantic import BaseModel
from typing import Optional

class Interes(BaseModel):
    id: Optional[str] = None
    nombre: str
