<#
.SYNOPSIS
    Lanzador automatizado de ONPE Visión 2026 para PowerShell.
.DESCRIPTION
    Verifica Node.js >= 22.5.0 (node:sqlite), inicia el servidor de telemetría
    si el puerto 3000 no está ocupado por otro servicio y abre la interfaz.
#>

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

Write-Host "===============================================================================" -ForegroundColor Cyan
Write-Host "    ONPE VISIÓN 2026 - CENTRO DE MANDO Y CUSTODIA ELECTORAL                    " -ForegroundColor White
Write-Host "    Universidad Tecnológica del Perú (UTP) - Diseño de Productos y Servicios   " -ForegroundColor Gray
Write-Host "===============================================================================" -ForegroundColor Cyan

# 1. Comprobar si Node.js existe y soporta node:sqlite
$NodeCmd = Get-Command node -ErrorAction SilentlyContinue
if (-not $NodeCmd) {
    Write-Host "[AVISO] Node.js no encontrado. Abriendo index.html en modo autónomo..." -ForegroundColor Yellow
    Start-Process "index.html"
    return
}

& node -e "require('node:sqlite')" 2>$null
if ($LASTEXITCODE -ne 0) {
    $nodeVer = & node -v
    Write-Host "[AVISO] Se requiere Node.js >= 22.5.0 con soporte node:sqlite (detectado: $nodeVer)." -ForegroundColor Yellow
    Write-Host "[INFO] Abriendo index.html en modo autónomo..." -ForegroundColor Cyan
    Start-Process "index.html"
    return
}

# 2. Comprobar si el puerto 3000 ya responde específicamente a ONPE Visión (/api/kpis)
$OnpeActivo = $false
try {
    $resp = Invoke-RestMethod -Uri "http://localhost:3000/api/kpis" -TimeoutSec 2 -ErrorAction Stop
    if ($resp -and $resp.exito -eq $true) {
        $OnpeActivo = $true
    }
} catch {
    $OnpeActivo = $false
}

if ($OnpeActivo) {
    Write-Host "[OK] El servidor backend de ONPE Visión ya está activo en http://localhost:3000" -ForegroundColor Green
} else {
    $PortInUse = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
    if ($PortInUse) {
        Write-Host "[AVISO] El puerto 3000 está ocupado por otro proceso. Abriendo index.html en modo autónomo..." -ForegroundColor Yellow
        Start-Process "index.html"
        return
    }
    Write-Host "[INFO] Iniciando servidor backend Node.js..." -ForegroundColor Yellow
    Start-Process -FilePath "node" -ArgumentList "simulador_backend.js" -WindowStyle Hidden
    Start-Sleep -Seconds 2
}

# 3. Abrir en el navegador predeterminado
Write-Host "[INFO] Abriendo interfaz en el navegador web..." -ForegroundColor Cyan
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "SISTEMA OPERATIVO Y DISPONIBLE:" -ForegroundColor Green
Write-Host " - URL: http://localhost:3000" -ForegroundColor White
Write-Host " - Turno Simulado: 11 de Abril de 2026 (D-DAY)" -ForegroundColor White
Write-Host "Presione cualquier tecla para salir..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
