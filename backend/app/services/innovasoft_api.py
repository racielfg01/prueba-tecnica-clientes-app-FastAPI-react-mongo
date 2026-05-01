import httpx
from typing import Dict, Any, Optional
import os

API_BASE_URL = os.environ.get('INNOVASOFT_API_URL', 'https://pruebareactis.test-class.com/Api')

class InnovasoftAPIService:
    def __init__(self):
        self.client = httpx.AsyncClient(timeout=30.0)
    
    async def close(self):
        await self.client.aclose()
    
    async def _request(self, method: str, endpoint: str, data: Any = None, token: str = None) -> Dict:
        url = f"{API_BASE_URL}/{endpoint.lstrip('/')}"
        headers = {"Content-Type": "application/json"}
        
        if token:
            headers["Authorization"] = f"Bearer {token}"
        
        try:
            if method == "GET":
                response = await self.client.get(url, headers=headers)
            elif method == "POST":
                response = await self.client.post(url, json=data, headers=headers)
            elif method == "PUT":
                response = await self.client.put(url, json=data, headers=headers)
            elif method == "DELETE":
                response = await self.client.delete(url, headers=headers)
            else:
                raise ValueError(f"Unsupported method: {method}")
            
            if response.status_code == 200:
                return {"success": True, "data": response.json(), "status_code": response.status_code}
            else:
                return {"success": False, "data": None, "status_code": response.status_code, "error": response.text}
        except Exception as e:
            return {"success": False, "data": None, "status_code": 500, "error": str(e)}
    
    async def login(self, username: str, password: str) -> Dict:
        return await self._request("POST", "api/Authenticate/login", {"username": username, "password": password})
    
    async def register(self, username: str, email: str, password: str) -> Dict:
        return await self._request("POST", "api/Authenticate/register", {"username": username, "email": email, "password": password})
    
    async def listar_intereses(self, token: str) -> Dict:
        return await self._request("GET", "api/Intereses/Listado", token=token)
    
    async def listar_clientes(self, identification: str, nombre: str, usuarioId: str, token: str) -> Dict:
        data = {
            "identification": identification or "",
            "nombre": nombre or "",
            "usuarioId": usuarioId
        }
        return await self._request("POST", "api/Cliente/Listado", data, token)
    
    async def obtener_cliente(self, cliente_id: str, token: str) -> Dict:
        return await self._request("GET", f"api/Cliente/Obtener/{cliente_id}", token=token)
    
    async def crear_cliente(self, cliente_data: Dict, token: str) -> Dict:
        return await self._request("POST", "api/Cliente/Crear", cliente_data, token)
    
    async def actualizar_cliente(self, cliente_data: Dict, token: str) -> Dict:
        return await self._request("POST", "api/Cliente/Actualizar", cliente_data, token)
    
    async def eliminar_cliente(self, cliente_id: str, token: str) -> Dict:
        return await self._request("DELETE", f"api/Cliente/Eliminar/{cliente_id}", token=token)

innovasoft_api = InnovasoftAPIService()