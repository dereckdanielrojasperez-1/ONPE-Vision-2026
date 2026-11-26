@echo off
setlocal
cd /d "%~dp0"
title ONPE Vision 2026 - Centro de Mando Electoral

echo ===============================================================================
echo     ONPE VISION 2026 - CENTRO DE MANDO Y CUSTODIA ELECTORAL
echo     Universidad Tecnologica del Peru - Diseno de Productos y Servicios
echo ===============================================================================
echo.

:: 1. Verificar si Node.js esta instalado en el sistema
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [AVISO] Node.js no se detecto en el PATH del sistema.
    echo [INFO] Abriendo la interfaz web directamente en modo autonomo...
    start "" "index.html"
    goto FIN
)

:: 1b. Verificar soporte nativo de node:sqlite (Node.js >= 22.5.0)
node -e "require('node:sqlite')" >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [AVISO] Se requiere Node.js >= 22.5.0 para habilitar node:sqlite en el backend.
    for /f "tokens=*" %%v in ('node -v') do echo [INFO] Version detectada: %%v
    echo [INFO] Abriendo index.html en modo autonomo sin servidor local...
    start "" "index.html"
    goto FIN
)

:: 2. Verificar si el puerto 3000 ya responde a ONPE Vision (/api/kpis)
node -e "fetch('http://localhost:3000/api/kpis').then(r=>r.ok?r.json():Promise.reject()).then(d=>process.exit(d&&d.exito?0:1)).catch(()=>process.exit(1))" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] El servidor backend de ONPE Vision ya esta activo en el puerto 3000.
) else (
    netstat -ano | findstr /R /C:":3000 .*LISTENING" >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo [AVISO] El puerto 3000 esta ocupado por otro servicio que no es ONPE Vision.
        echo [INFO] Abriendo index.html en modo autonomo...
        start "" "index.html"
        goto FIN
    )
    echo [INFO] Iniciando servidor backend Node.js en segundo plano...
    start "ONPE Vision Backend" /MIN node simulador_backend.js
    ping -n 3 127.0.0.1 >nul 2>&1
)

:: 3. Abrir la aplicacion en el navegador web predeterminado
echo [INFO] Abriendo el Centro de Mando en su navegador web...
start "" "http://localhost:3000"

echo.
echo ===============================================================================
echo  SISTEMA OPERATIVO Y DISPONIBLE:
echo   - URL del Centro de Mando: http://localhost:3000
echo   - Archivo Local Directo:   index.html
echo   - Turno Simulado:          11 de Abril de 2026 - D-DAY 06:45:00 UTC-5
echo   - Enlace Seguro:           Red Privada MPLS Activa - SLA 99.94%%
echo.
echo  Credenciales de acceso rapido disponibles en pantalla para evaluadores.
echo ===============================================================================
echo.
pause

:FIN
endlocal
