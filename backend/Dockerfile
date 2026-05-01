# # Stage 1: Builder
# FROM python:3.11-slim-bookworm AS builder

# WORKDIR /app

# # Instalar dependencias de compilación
# RUN apt-get update && apt-get install -y --no-install-recommends \
#     gcc \
#     python3-dev \
#     && rm -rf /var/lib/apt/lists/*

# # Copiar requirements y instalar dependencias
# COPY requirements.txt .
# RUN pip install --no-cache-dir --user -r requirements.txt

# # Stage 2: Runtime
# FROM python:3.11-slim-bookworm

# # Instalar dependencias runtime mínimas
# RUN apt-get update && apt-get install -y --no-install-recommends \
#     curl \
#     && rm -rf /var/lib/apt/lists/* \
#     && addgroup --system --gid 1001 appgroup \
#     && adduser --system --uid 1001 --gid 1001 appuser

# WORKDIR /app

# # Copiar dependencias del builder
# COPY --from=builder --chown=appuser:appgroup /root/.local /home/appuser/.local

# # Copiar código fuente
# COPY --chown=appuser:appgroup . .

# # Configurar PATH
# ENV PATH=/home/appuser/.local/bin:$PATH

# # Usar usuario no root
# USER appuser

# # Exponer puerto
# EXPOSE 8000

# # Health check
# HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
#     CMD curl -f http://localhost:8000/health || exit 1

# # Ejecutar con Uvicorn
# CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2", "--loop", "uvloop", "--http", "httptools"]

# Etapa 1: Builder
FROM python:3.11-slim-bookworm AS builder

WORKDIR /app

# Instalar dependencias de compilación
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements y instalar dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Etapa 2: Runtime
FROM python:3.11-slim-bookworm

# Instalar dependencias runtime
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Crear directorio de trabajo
WORKDIR /app

# Copiar dependencias del builder
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copiar código fuente
COPY . .

# Crear usuario no root
RUN addgroup --system --gid 1001 appgroup && \
    adduser --system --uid 1001 --gid 1001 appuser && \
    chown -R appuser:appgroup /app

# Usar usuario no root
USER appuser

# Exponer puerto
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Ejecutar con Uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]