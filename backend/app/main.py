from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

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
    allow_origins=["http://localhost", "http://localhost:80", "http://localhost:5173"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Innovasoft API Local", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

app.include_router(auth.router)
app.include_router(clientes.router)
app.include_router(intereses.router)
