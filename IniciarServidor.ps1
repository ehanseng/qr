# Script para iniciar el servidor QR-Asistencia en background
# No requiere permisos de administrador

# Ubicacion del proyecto
$projectPath = "C:\Users\usuario1\Documents\Tecnologías\QR-Asistencia\backend"

# Cambiar a la carpeta
Set-Location $projectPath

Write-Host "Iniciando Servidor QR-Asistencia..." -ForegroundColor Green
Write-Host "Ubicacion: $projectPath" -ForegroundColor Cyan

# Detener procesos Node anteriores
$existingNode = Get-Process -Name node -ErrorAction SilentlyContinue
if ($existingNode) {
    Write-Host "Deteniendo servidor anterior..." -ForegroundColor Yellow
    Stop-Process -Name node -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
}

# Iniciar el servidor en background
$job = Start-Job -ScriptBlock {
    Set-Location "C:\Users\usuario1\Documents\Tecnologías\QR-Asistencia\backend"
    npm start 2>&1
} -Name "QR-Server"

Write-Host "Servidor iniciado en background" -ForegroundColor Green
Write-Host "URL: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Para detener el servidor, ejecuta: Stop-Process -Name node -Force" -ForegroundColor Yellow
