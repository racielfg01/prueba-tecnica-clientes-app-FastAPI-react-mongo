from pydantic import BaseModel
from typing import Optional

class ClienteCreate(BaseModel):
    nombre: str
    apellidos: str
    identificacion: str
    telefonoCelular: str
    otroTelefono: Optional[str] = ""
    direccion: str
    fnacimiento: str  # YYYY-MM-DD
    fAfliacion: str   # YYYY-MM-DD
    sexo: str  # M o F
    resenaPersonal: Optional[str] = ""
    imagen: Optional[str] = ""
    interesesFK: str
    usuarioId: str

class ClienteUpdate(BaseModel):
    id: str
    nombre: str
    apellidos: str
    identificacion: str
    celular: str
    otroTelefono: Optional[str] = ""
    direccion: str
    fnacimiento: str
    fAfliacion: str
    sexo: str
    resenaPersonal: Optional[str] = ""
    imagen: Optional[str] = ""
    interesesFK: str
    usuarioId: str

class LoginRequest(BaseModel):
    username: str
    password: str

class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str