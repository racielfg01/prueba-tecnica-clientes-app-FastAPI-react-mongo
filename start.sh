#!/bin/bash

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}=== Innovasoft Docker Deployment ===${NC}"

# Verificar Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker no está instalado${NC}"
    exit 1
fi

# Verificar Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Docker Compose no está instalado${NC}"
    exit 1
fi

# Cargar variables de entorno
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Función para mostrar ayuda
show_help() {
    echo "Uso: ./start.sh [comando]"
    echo ""
    echo "Comandos:"
    echo "  up        - Iniciar servicios"
    echo "  down      - Detener servicios"
    echo "  restart   - Reiniciar servicios"
    echo "  logs      - Ver logs"
    echo "  build     - Reconstruir imágenes"
    echo "  clean     - Limpiar todo (incluyendo volúmenes)"
    echo "  status    - Ver estado de servicios"
    echo "  prod      - Iniciar en modo producción"
}

case "$1" in
    up)
        echo -e "${YELLOW}Iniciando servicios...${NC}"
        docker-compose up -d
        echo -e "${GREEN}Servicios iniciados!${NC}"
        echo -e "Frontend: ${GREEN}http://localhost${NC}"
        echo -e "Backend API: ${GREEN}http://localhost:8000${NC}"
        ;;
    down)
        echo -e "${YELLOW}Deteniendo servicios...${NC}"
        docker-compose down
        echo -e "${GREEN}Servicios detenidos!${NC}"
        ;;
    restart)
        echo -e "${YELLOW}Reiniciando servicios...${NC}"
        docker-compose restart
        echo -e "${GREEN}Servicios reiniciados!${NC}"
        ;;
    logs)
        docker-compose logs -f --tail=100
        ;;
    build)
        echo -e "${YELLOW}Construyendo imágenes...${NC}"
        docker-compose build --no-cache
        echo -e "${GREEN}Imágenes construidas!${NC}"
        ;;
    clean)
        echo -e "${RED}Limpiando todo...${NC}"
        docker-compose down -v
        docker system prune -f
        echo -e "${GREEN}Limpieza completada!${NC}"
        ;;
    status)
        docker-compose ps
        ;;
    prod)
        echo -e "${YELLOW}Iniciando en modo producción...${NC}"
        docker-compose -f docker-compose.prod.yml up -d --build
        echo -e "${GREEN}Producción iniciada!${NC}"
        ;;
    *)
        show_help
        ;;
esac