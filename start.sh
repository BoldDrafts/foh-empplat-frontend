#!/bin/bash

echo "🚀 Portal del Empleador - Financiera Oh"
echo "========================================"
echo ""

# Verificar que node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
fi

# Verificar que el build existe
if [ ! -d "dist" ]; then
    echo "🔨 Construyendo aplicación por primera vez..."
    npm run build
fi

# Limpiar caché viejo si existe
if [ -d ".angular" ]; then
    echo "🧹 Limpiando caché de Angular..."
    rm -rf .angular
fi

# Construir para generar caché limpio
echo "🔨 Generando caché de compilación..."
npm run build > /dev/null 2>&1

echo ""
echo "✅ Aplicación lista!"
echo "📍 URL: http://localhost:4200"
echo ""
echo "👤 Credenciales de prueba:"
echo "   DNI: 12345678"
echo "   Password: demo123"
echo "   OTP: 123456"
echo ""
echo "🔄 Iniciando servidor de desarrollo..."
echo ""

npm start
