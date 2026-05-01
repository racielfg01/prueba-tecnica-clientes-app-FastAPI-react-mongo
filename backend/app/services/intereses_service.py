from datetime import datetime
from bson import ObjectId
from ..database import mongodb

DEFAULT_INTERESES = [
    {"nombre": "Tecnologia"},
    {"nombre": "Deportes"},
    {"nombre": "Musica"},
    {"nombre": "Cine"},
    {"nombre": "Lectura"},
    {"nombre": "Viajes"},
    {"nombre": "Cocina"},
    {"nombre": "Arte"},
]

class InteresesService:
    async def init_default(self):
        count = await mongodb.database.intereses.count_documents({})
        if count == 0:
            await mongodb.database.intereses.insert_many(DEFAULT_INTERESES)

    async def listar(self):
        intereses = await mongodb.database.intereses.find().to_list(None)
        return [{"id": str(doc["_id"]), "nombre": doc["nombre"]} for doc in intereses]

    async def obtener(self, interes_id: str):
        doc = await mongodb.database.intereses.find_one({"_id": ObjectId(interes_id)})
        if doc:
            return {"id": str(doc["_id"]), "nombre": doc["nombre"]}
        return None

intereses_service = InteresesService()
