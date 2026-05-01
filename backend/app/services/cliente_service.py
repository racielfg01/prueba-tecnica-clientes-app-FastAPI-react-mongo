from datetime import datetime
from bson import ObjectId
from ..database import mongodb
from ..models.cliente import ClienteCreate, ClienteUpdate

class ClienteService:
    async def listar(self, identification: str, nombre: str, usuario_id: str):
        query: dict = {}
        if identification:
            query["identificacion"] = {"$regex": identification, "$options": "i"}
        if nombre:
            query["$or"] = [
                {"nombre": {"$regex": nombre, "$options": "i"}},
                {"apellidos": {"$regex": nombre, "$options": "i"}}
            ]
        if usuario_id:
            query["usuarioId"] = usuario_id

        clientes = await mongodb.database.clientes.find(query).to_list(None)
        result = []
        for doc in clientes:
            doc["id"] = str(doc["_id"])
            doc.pop("_id", None)
            result.append(doc)
        return result

    async def obtener(self, cliente_id: str):
        doc = await mongodb.database.clientes.find_one({"_id": ObjectId(cliente_id)})
        if doc:
            doc["id"] = str(doc["_id"])
            doc.pop("_id", None)
            return doc
        return None

    async def crear(self, cliente: ClienteCreate):
        if mongodb.database is None:
            raise Exception("Database not connected")
        try:
            doc = cliente.model_dump()
            doc["created_at"] = datetime.utcnow()
            result = await mongodb.database.clientes.insert_one(doc)
            doc["id"] = str(result.inserted_id)
            doc.pop("_id", None)
            return doc
        except Exception as e:
            raise Exception(f"Error creating client: {str(e)}")

    async def actualizar(self, cliente: ClienteUpdate):
        update_data = cliente.model_dump()
        cliente_id = update_data.pop("id")
        update_data["updated_at"] = datetime.utcnow()
        result = await mongodb.database.clientes.update_one(
            {"_id": ObjectId(cliente_id)},
            {"$set": update_data}
        )
        return result.modified_count > 0

    async def eliminar(self, cliente_id: str):
        result = await mongodb.database.clientes.delete_one({"_id": ObjectId(cliente_id)})
        return result.deleted_count > 0

cliente_service = ClienteService()
