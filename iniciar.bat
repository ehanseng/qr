@echo off
REM Script para iniciar fácilmente el servidor en Windows

echo.
echo ======================================
echo Sistema de Asistencia por QR
echo ======================================
echo.

REM Verificar si Node.js está instalado
where node >nul 2>nul
if errorlevel 1 (
    echo ERROR: Node.js no está instalado
    echo Por favor descarga Node.js desde: https://nodejs.org/
    pause
    exit /b 1
)

REM Navegar a la carpeta backend
cd /d "%~dp0backend"

REM Verificar si node_modules existe
if not exist "node_modules" (
    echo.
    echo Instalando dependencias... Esto puede tomar unos minutos...
    echo.
    call npm install
    if errorlevel 1 (
        echo ERROR: No se pudieron instalar las dependencias
        pause
        exit /b 1
    )
)

REM Iniciar el servidor
echo.
echo ✓ Iniciando servidor...
echo.
echo El servidor estará disponible en: http://localhost:3000
echo.
echo Presiona CTRL+C para detener el servidor
echo.

call npm start

pause
