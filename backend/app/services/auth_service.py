import jwt
import os
import bcrypt
from datetime import datetime, timedelta
from ..database import mongodb
from ..models.user import UserCreate

JWT_SECRET = os.environ.get("JWT_SECRET", "supersecretkey-change-in-production")
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_MINUTES = 60

class AuthService:
    def hash_password(self, password: str) -> str:
        return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))

    def create_token(self, user_id: str, username: str) -> str:
        payload = {
            "sub": user_id,
            "username": username,
            "exp": datetime.utcnow() + timedelta(minutes=JWT_EXPIRE_MINUTES)
        }
        return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

    async def get_user_by_username(self, username: str):
        return await mongodb.database.usuarios.find_one({"username": username})

    async def register(self, user_data: UserCreate) -> dict:
        existing = await self.get_user_by_username(user_data.username)
        if existing:
            return {"success": False, "error": "El usuario ya existe"}

        existing_email = await mongodb.database.usuarios.find_one({"email": user_data.email})
        if existing_email:
            return {"success": False, "error": "El correo ya esta registrado"}

        user_doc = {
            "username": user_data.username,
            "email": user_data.email,
            "hashed_password": self.hash_password(user_data.password),
            "created_at": datetime.utcnow(),
            "is_active": True
        }
        result = await mongodb.database.usuarios.insert_one(user_doc)
        user_doc["_id"] = str(result.inserted_id)
        return {"success": True, "user": user_doc}

    async def login(self, username: str, password: str) -> dict:
        user = await self.get_user_by_username(username)
        if not user:
            return {"success": False, "error": "Credenciales invalidas"}

        if not self.verify_password(password, user["hashed_password"]):
            return {"success": False, "error": "Credenciales invalidas"}

        token = self.create_token(str(user["_id"]), user["username"])
        return {
            "success": True,
            "token": token,
            "userid": str(user["_id"]),
            "username": user["username"],
            "expiration": (datetime.utcnow() + timedelta(minutes=JWT_EXPIRE_MINUTES)).isoformat()
        }

auth_service = AuthService()
