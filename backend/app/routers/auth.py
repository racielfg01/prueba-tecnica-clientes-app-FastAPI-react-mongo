from fastapi import APIRouter, HTTPException, status
from ..models.cliente import LoginRequest, RegisterRequest
from ..services.auth_service import auth_service
from ..services.mongo_service import mongo_service

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/login")
async def login(request: LoginRequest):
    if not request.username or not request.password:
        raise HTTPException(status_code=400, detail="Usuario y contrasena son requeridos")

    result = await auth_service.login(request.username, request.password)

    if result["success"]:
        await mongo_service.save_session(result["token"], result["userid"], result["username"])
        return result
    else:
        raise HTTPException(status_code=401, detail=result.get("error", "Credenciales invalidas"))

@router.post("/logout")
async def logout(username: str):
    await mongo_service.delete_session(username)
    return {"success": True, "message": "Sesion cerrada correctamente"}

@router.post("/register")
async def register(request: RegisterRequest):
    if not request.username or not request.email or not request.password:
        raise HTTPException(status_code=400, detail="Todos los campos son obligatorios")

    if "@" not in request.email or "." not in request.email:
        raise HTTPException(status_code=400, detail="Correo electronico invalido")

    if len(request.password) < 8 or len(request.password) > 20:
        raise HTTPException(status_code=400, detail="La contrasena debe tener entre 8 y 20 caracteres")

    if not any(c.isupper() for c in request.password):
        raise HTTPException(status_code=400, detail="La contrasena debe tener al menos una mayuscula")

    if not any(c.islower() for c in request.password):
        raise HTTPException(status_code=400, detail="La contrasena debe tener al menos una minuscula")

    if not any(c.isdigit() for c in request.password):
        raise HTTPException(status_code=400, detail="La contrasena debe tener al menos un numero")

    from ..models.user import UserCreate
    result = await auth_service.register(UserCreate(
        username=request.username,
        email=request.email,
        password=request.password
    ))

    if result["success"]:
        return {"success": True, "message": "Usuario creado correctamente"}
    else:
        raise HTTPException(status_code=400, detail=result.get("error", "Error al registrar usuario"))
