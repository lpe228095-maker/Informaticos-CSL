#!/bin/bash
# ==============================================================
# Script: start.sh
# Descripción:
#   - Detecta el sistema operativo (Linux, macOS o Windows).
#   - Verifica que Docker esté instalado.
#   - Si no está instalado, muestra un aviso para instalar Docker Desktop.
#   - Levanta los servicios definidos en docker-compose.yml.
# ==============================================================

clear
echo "🚀 Iniciando proyecto NASA SpaceApp Challenge..."

# Detectar sistema operativo
OS_TYPE="$(uname -s)"

case "$OS_TYPE" in
    Linux*)   OS="Linux";;
    Darwin*)  OS="macOS";;
    MINGW*|MSYS*|CYGWIN*) OS="Windows";;
    *)        OS="Desconocido";;
esac

echo "💻 Sistema detectado: $OS"

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null
then
    echo "❌ Docker no está instalado."
    if [ "$OS" = "Linux" ]; then
        echo "ℹ️  Instálalo con:"
        echo "👉 https://docs.docker.com/engine/install/"
    elif [ "$OS" = "macOS" ]; then
        echo "ℹ️  Descarga Docker Desktop para macOS:"
        echo "👉 https://www.docker.com/products/docker-desktop/"
    elif [ "$OS" = "Windows" ]; then
        echo "ℹ️  Descarga Docker Desktop para Windows:"
        echo "👉 https://www.docker.com/products/docker-desktop/"
    else
        echo "⚠️  No se pudo determinar el sistema operativo. Instala Docker manualmente."
    fi
    exit 1
fi

# Verificar si docker-compose está instalado
if ! command -v docker-compose &> /dev/null
then
    echo "❌ docker-compose no está instalado."
    echo "ℹ️  Docker Desktop incluye docker-compose automáticamente."
    echo "👉 Asegúrate de abrir Docker Desktop antes de continuar."
    exit 1
fi

# Levantar los servicios
echo "🐳 Levantando los servicios con docker-compose..."
docker-compose up -d
echo "✅ Todos los servicios están corriendo."
