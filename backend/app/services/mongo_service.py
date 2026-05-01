from datetime import datetime
from ..database import mongodb
from ..models.session import Session
from ..models.operation import Operation

class MongoService:
    @staticmethod
    async def save_session(token: str, userid: str, username: str):
        session_data = {
            "token": token,
            "userid": userid,
            "username": username,
            "login_timestamp": datetime.utcnow()
        }
        await mongodb.database.sesiones.insert_one(session_data)
        return session_data
    
    @staticmethod
    async def get_session_by_username(username: str):
        return await mongodb.database.sesiones.find_one({"username": username})
    
    @staticmethod
    async def delete_session(username: str):
        result = await mongodb.database.sesiones.delete_one({"username": username})
        return result.deleted_count > 0
    
    @staticmethod
    async def save_operation(accion: str, usuario: str, cliente_id: str, resultado: int):
        try:
            if mongodb.database is None:
                print("Warning: Database not connected, skipping operation log")
                return None
            operation_data = {
                "accion": accion,
                "usuario": usuario,
                "cliente_id": cliente_id,
                "timestamp": datetime.utcnow(),
                "resultado": resultado
            }
            await mongodb.database.operaciones.insert_one(operation_data)
            return operation_data
        except Exception as e:
            print(f"Error saving operation: {e}")
            return None

mongo_service = MongoService()