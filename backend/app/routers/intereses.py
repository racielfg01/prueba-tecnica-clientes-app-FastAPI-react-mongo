from fastapi import APIRouter
from ..services.intereses_service import intereses_service

router = APIRouter(prefix="/api/intereses", tags=["Intereses"])

@router.get("/listado")
async def listar_intereses():
    return await intereses_service.listar()
