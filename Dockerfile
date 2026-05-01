# Etapa 1: Construir el frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend
# Copiar archivos de dependencias
COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps
# Copiar código del frontend y construir
COPY frontend/ ./

RUN npm run build


# Etapa 2: Configurar el backend con Python
FROM python:3.11-slim
WORKDIR /app
# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*
# Copiar archivos del backend
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
# Copiar código del backend
COPY backend/ ./backend/
# Copiar el frontend construido al directorio público del backend
RUN mkdir -p /app/backend/static
COPY --from=frontend-builder /app/frontend/dist /app/backend/static
# Establecer variable de entorno
ENV PYTHONUNBUFFERED=1
ENV PORT=10000
# Exponer puerto (Render usa PORT)
EXPOSE 10000
# Comando para iniciar (ajusta según tu estructura)
WORKDIR /app/backend
CMD ["sh", "-c", "python -m uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-10000}"]