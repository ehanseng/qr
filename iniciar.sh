#!/bin/bash

# Script para iniciar fácilmente el servidor en Mac/Linux

echo ""
echo "======================================"
echo "Sistema de Asistencia por QR"
echo "======================================"
echo ""

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js no está instalado"
    echo "Por favor descarga Node.js desde: https://nodejs.org/"
    exit 1
fi

# Navegar a la carpeta backend
cd "$(dirname "$0")/backend"

# Verificar si node_modules existe
if [ ! -d "node_modules" ]; then
    echo ""
    echo "Instalando dependencias... Esto puede tomar unos minutos..."
    echo ""
    npm install
    if [ $? -ne 0 ]; then
        echo "ERROR: No se pudieron instalar las dependencias"
        exit 1
    fi
fi

# Iniciar el servidor
echo ""
echo "✓ Iniciando servidor..."
echo ""
echo "El servidor estará disponible en: http://localhost:3000"
echo ""
echo "Presiona CTRL+C para detener el servidor"
echo ""

npm start
