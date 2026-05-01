from fastapi import APIRouter, HTTPException, Header
from typing import Optional
from ..models.cliente import ClienteCreate, ClienteUpdate
from ..services.cliente_service import cliente_service
from ..services.mongo_service import mongo_service

router = APIRouter(prefix="/api/clientes", tags=["Clientes"])

def get_user_from_token(authorization: str = Header(None)) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token no proporcionado")
    return {"token": authorization.replace("Bearer ", "")}

@router.post("/listar")
async def listar_clientes(
    identification: Optional[str] = "",
    nombre: Optional[str] = "",
    usuarioId: str = "",
    authorization: str = Header(None)
):
    get_user_from_token(authorization)
    clientes = await cliente_service.listar(identification, nombre, usuarioId)
    return clientes

@router.get("/obtener/{cliente_id}")
async def obtener_cliente(cliente_id: str, authorization: str = Header(None)):
    get_user_from_token(authorization)
    cliente = await cliente_service.obtener(cliente_id)
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return cliente

@router.post("/crear")
async def crear_cliente(cliente: ClienteCreate, authorization: str = Header(None)):
    try:
        get_user_from_token(authorization)
        result = await cliente_service.crear(cliente)
        cliente_id = result.get("id") if result else None
        await mongo_service.save_operation(
            "CREAR",
            cliente.usuarioId,
            cliente_id,
            200
        )
        return {"success": True, "message": "Cliente creado correctamente", "data": result}
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        print(f"Error in crear_cliente: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Error al crear cliente: {str(e)}")

@router.post("/actualizar")
async def actualizar_cliente(cliente: ClienteUpdate, authorization: str = Header(None)):
    get_user_from_token(authorization)
    success = await cliente_service.actualizar(cliente)
    await mongo_service.save_operation(
        "ACTUALIZAR",
        cliente.usuarioId,
        cliente.id,
        200 if success else 404
    )
    if success:
        return {"success": True, "message": "Cliente actualizado correctamente"}
    raise HTTPException(status_code=404, detail="Cliente no encontrado")

@router.delete("/eliminar/{cliente_id}")
async def eliminar_cliente(cliente_id: str, usuarioId: str, authorization: str = Header(None)):
    get_user_from_token(authorization)
    success = await cliente_service.eliminar(cliente_id)
    await mongo_service.save_operation(
        "ELIMINAR",
        usuarioId,
        cliente_id,
        200 if success else 404
    )
    if success:
        return {"success": True, "message": "Cliente eliminado correctamente"}
    raise HTTPException(status_code=404, detail="Cliente no encontrado")
