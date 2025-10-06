#!/bin/bash
# ==============================================================
# Script: stop.sh
# Descripción:
#   - Detiene todos los servicios levantados con docker-compose.
#   - Elimina únicamente las imágenes de frontend y backend.
#   - Mantiene OpenSearch (contenedor + imagen).
# ==============================================================

clear
echo "🛑 Deteniendo todos los servicios del proyecto..."

# Detectar sistema operativo
OS_TYPE="$(uname -s)"

case "$OS_TYPE" in
    Linux*)   OS="Linux";;
    Darwin*)  OS="macOS";;
    MINGW*|MSYS*|CYGWIN*) OS="Windows";;
    *)        OS="Desconocido";;
esac

echo "💻 Sistema detectado: $OS"

# Verificar si docker-compose está instalado
if ! command -v docker-compose &> /dev/null
then
    echo "❌ docker-compose no está instalado."
    echo "ℹ️  Asegúrate de que Docker Desktop esté abierto (en Windows/macOS) o instala docker-compose (Linux)."
    exit 1
fi

# Detener todos los servicios definidos en docker-compose
docker-compose down

# Eliminar imágenes de backend y frontend, si existen
docker rmi -f "$(docker images -q "${PWD##*/}-backend")" 2>/dev/null || true
docker rmi -f "$(docker images -q "${PWD##*/}-frontend")" 2>/dev/null || true

echo "✅ Servicios detenidos."
