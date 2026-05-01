# # Stage 1: Build
# FROM node:18-alpine AS builder

# WORKDIR /app

# # Copiar package.json primero para cache
# COPY package*.json ./

# # Instalar dependencias
# RUN npm install && npm cache clean --force

# # Copiar código fuente
# COPY . .

# # Construir aplicación
# RUN npm run build

# # Stage 2: Production (Nginx Alpine)
# FROM nginx:stable-alpine3.17-slim

# # Instalar herramientas útiles (opcional, remover para más ligereza)
# RUN apk add --no-cache curl

# # Copiar configuración personalizada de Nginx
# COPY nginx.conf /etc/nginx/nginx.conf

# # Copiar archivos estáticos del builder
# COPY --from=builder /app/build /usr/share/nginx/html

# # Crear usuario no root para Nginx
# RUN adduser -D -H -u 1001 -s /sbin/nologin www-data && \
#     chown -R www-data:www-data /usr/share/nginx/html

# # Exponer puerto
# EXPOSE 80

# # Health check
# HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
#     CMD curl -f http://localhost/ || exit 1

# # Ejecutar Nginx
# CMD ["nginx", "-g", "daemon off;"]

# Etapa 1: Builder
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps

# Copiar el resto del código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Verificar que la carpeta build se creó
RUN ls -la /app/dist || (echo "Build folder not found" && exit 1)

# Etapa 2: Producción con Nginx
FROM nginx:stable-alpine3.17-slim

# Copiar la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar los archivos construidos desde el builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Verificar que los archivos se copiaron
RUN ls -la /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]