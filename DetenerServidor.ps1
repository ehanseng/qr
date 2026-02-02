# Script para detener el servidor QR-Asistencia

Write-Host "🛑 Deteniendo Servidor QR-Asistencia..." -ForegroundColor Red

# Detener el job si existe
$job = Get-Job -Name "QR-Server" -ErrorAction SilentlyContinue
if ($job) {
    Stop-Job -Name "QR-Server" -ErrorAction SilentlyContinue
    Remove-Job -Name "QR-Server" -ErrorAction SilentlyContinue
    Write-Host "✅ Job de PowerShell detenido" -ForegroundColor Green
}

# Detener procesos Node.js
$nodeProcesses = Get-Process -Name node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Stop-Process -Name node -Force -ErrorAction SilentlyContinue
    Write-Host "✅ Procesos Node.js detenidos" -ForegroundColor Green
} else {
    Write-Host "ℹ️  No hay procesos Node.js activos" -ForegroundColor Cyan
}

Write-Host "🏁 Servidor detenido correctamente" -ForegroundColor Green
