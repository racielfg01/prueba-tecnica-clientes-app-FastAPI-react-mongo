from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from contextlib import asynccontextmanager
import os

from .database import connect_to_mongo, close_mongo_connection
from .services.intereses_service import intereses_service

from .routers import auth, clientes, intereses

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    await intereses_service.init_default()
    yield
    await close_mongo_connection()

app = FastAPI(title="Innovasoft API Local", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(clientes.router)
app.include_router(intereses.router)

@app.get("/")
async def root():
    return {"message": "Innovasoft API Local", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Servir archivos estáticos del frontend
static_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "static")
if os.path.exists(static_dir):
    app.mount("/assets", StaticFiles(directory=os.path.join(static_dir, "assets")), name="static_assets")
    
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        # Si es una ruta de API, no interceptar
        if full_path.startswith("api/"):
            return {"error": "Not found"}
        # Buscar archivo específico
        file_path = os.path.join(static_dir, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        # Para SPA: devolver index.html
        index_path = os.path.join(static_dir, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
        return {"error": "index.html not found"}
