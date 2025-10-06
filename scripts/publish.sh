#!/bin/bash

# Configuración
PROVIDER="aws" # Por defecto es aws, pero puede ser gcp o azure (asi en minúsculas)
USER="your.username"
SERVER="your.server.ip"
APP_DIR="/home/ubuntu/app"


# Selecciona la ruta de clave según el proveedor
KEY_PATH="../security/${PROVIDER}.pem"

if [ ! -f "$KEY_PATH" ]; then
  echo "❌ No existe la clave privada: $KEY_PATH"
  exit 1
fi

echo "🔑 Usando clave en $KEY_PATH"
echo "🚀 Publicando proyecto en $SERVER"

# 1. Detener contenedores y limpiar imágenes de backend/frontend
ssh -i "$KEY_PATH" $USER@$SERVER "
    echo '🛑 Deteniendo servicios en $SERVER...';
    cd $APP_DIR || true;
    docker compose down || true;
    docker rmi -f \$(docker images -q \"\${PWD##*/}-backend\") 2>/dev/null || true;
    docker rmi -f \$(docker images -q \"\${PWD##*/}-frontend\") 2>/dev/null || true;
    echo '✅ Servicios detenidos y limpiados.'
"

# 2. Limpiar servidor
ssh -i "$KEY_PATH" $USER@$SERVER "rm -rf $APP_DIR && mkdir -p $APP_DIR"

# 3. Subir archivos
scp -i "$KEY_PATH" -r ./* $USER@$SERVER:$APP_DIR

# 4. Reconstruir y levantar servicios
ssh -i "$KEY_PATH" $USER@$SERVER "
    echo '🚀 Levantando servicios con Docker Compose...';
    cd $APP_DIR && docker compose up -d --build
"

echo "✅ Publicación completada"
