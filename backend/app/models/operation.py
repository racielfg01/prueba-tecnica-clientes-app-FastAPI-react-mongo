from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class Operation(BaseModel):
    accion: str  # CREAR, ACTUALIZAR, ELIMINAR
    usuario: str
    cliente_id: Optional[str] = None
    timestamp: datetime = datetime.utcnow()
    resultado: int  # Código HTTP

class OperationCreate(BaseModel):
    accion: str
    usuario: str
    cliente_id: Optional[str] = None
    resultado: int