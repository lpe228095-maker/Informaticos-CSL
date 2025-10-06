#!/bin/bash
# ==============================================================
# Script: config.sh
# Descripción:
#   - Detecta el sistema operativo (Linux, macOS o Windows).
#   - Instala Docker automáticamente en Linux y macOS si es posible.
#   - En Windows muestra instrucciones para instalar Docker Desktop.
#   - Recuerda al usuario que revise los tutoriales incluidos en .md.
# ==============================================================

clear
echo "🔧 Configuración del entorno..."

# Detectar sistema operativo
OS_TYPE="$(uname -s)"
case "$OS_TYPE" in
    Linux*)   OS="Linux";;
    Darwin*)  OS="macOS";;
    MINGW*|MSYS*|CYGWIN*) OS="Windows";;
    *)        OS="Desconocido";;
esac

echo "💻 Sistema detectado: $OS"
echo ""

if [ "$OS" = "Windows" ]; then
    echo "❌ No es posible instalar Docker automáticamente en Windows."
    echo "👉 Debes descargar e instalar Docker Desktop manualmente:"
    echo "   https://www.docker.com/products/docker-desktop/"
    echo ""
    echo "ℹ️ Una vez instalado, asegúrate de que Docker Desktop esté abierto"
    echo "   antes de ejecutar 'npm run start'."

elif [ "$OS" = "macOS" ]; then
    echo "🍏 Instalando Docker en macOS..."
    if command -v brew &> /dev/null; then
        brew install --cask docker
        echo "✅ Docker Desktop instalado."
        echo "ℹ️ Abre Docker Desktop manualmente desde Aplicaciones."
    else
        echo "❌ Homebrew no está instalado."
        echo "👉 Instala Homebrew primero: https://brew.sh/"
    fi

elif [ "$OS" = "Linux" ]; then
    echo "🐧 Instalando Docker en Linux..."
    sudo apt-get update -y
    sudo apt-get install -y ca-certificates curl gnupg lsb-release
    sudo mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update -y
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    echo "✅ Docker instalado correctamente en Linux."
    echo "ℹ️ Recuerda agregar tu usuario al grupo docker:"
    echo "   sudo usermod -aG docker \$USER"
    echo "   y reinicia sesión para aplicar los cambios."
else
    echo "⚠️ Sistema operativo no soportado automáticamente."
    echo "👉 Instala Docker manualmente desde: https://docs.docker.com/get-docker/"
fi

echo ""
echo "📖 Para más detalles revisa los tutoriales incluidos en el repositorio:"
echo "   - docker-install.md   (cómo instalar Docker Desktop)"
echo "   - gitbash-install.md  (cómo instalar y configurar Git Bash)"
