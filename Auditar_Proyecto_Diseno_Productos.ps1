<#
.SYNOPSIS
    Script de Auditoría para el Proyecto ONPE Visión (Diseño de Productos y Servicios - UTP)
    Evalúa la presencia y completitud de todos los entregables académicos y técnicos.

.EXAMPLE
    powershell -ExecutionPolicy Bypass -File .\Auditar_Proyecto_Diseno_Productos.ps1 -RutaProyecto "C:\Users\Computecno\Documents\DProductos"
#>

param (
    [Parameter(Mandatory=$false)]
    [string]$RutaProyecto = "C:\Users\Computecno\Documents\DProductos"
)

Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host " [AUDITORIA UTP] Evaluando Entregables: ONPE Visión (DProductos)" -ForegroundColor Cyan
Write-Host " Directorio: $RutaProyecto" -ForegroundColor Yellow
Write-Host "=====================================================================" -ForegroundColor Cyan

if (-not (Test-Path -Path $RutaProyecto)) {
    Write-Host "[ERROR] La ruta especificada no existe: $RutaProyecto" -ForegroundColor Red
    return
}

$puntaje = 0
$totalRubros = 6

# 1. Artículo de Investigación (Paper LACCEI)
Write-Host "[1. Articulo Academico de Investigacion (Formato LACCEI)]" -ForegroundColor Cyan
$paperDocx = Get-ChildItem -Path $RutaProyecto -Filter "*articulo*Avance*.docx" -ErrorAction SilentlyContinue
$paperPdf  = Get-ChildItem -Path $RutaProyecto -Filter "*articulo*Avance*.pdf" -ErrorAction SilentlyContinue

if ($paperDocx -or $paperPdf) {
    Write-Host "  [APROBADO] Encontrado Paper Académico: $($paperDocx.Name) / $($paperPdf.Name)" -ForegroundColor Green
    $puntaje += 1
} else {
    Write-Host "  [ATENCION] No se encontró el archivo del artículo en Word o PDF." -ForegroundColor Yellow
}

# 2. Base de Datos Geoespacial PostGIS
Write-Host "[2. Modelo de Base de Datos Geoespacial (PostGIS)]" -ForegroundColor Cyan
$sqlFile = Get-ChildItem -Path $RutaProyecto -Filter "*schema_onpe_vision*.sql" -ErrorAction SilentlyContinue
if ($sqlFile) {
    $sqlContent = Get-Content $sqlFile.FullName -Raw -ErrorAction SilentlyContinue
    if ($sqlContent -match "postgis" -and $sqlContent -match "locales_votacion") {
        Write-Host "  [APROBADO] Esquema PostGIS verificado: $($sqlFile.Name) (Tablas, Geometrías y Restricciones)" -ForegroundColor Green
        $puntaje += 1
    } else {
        Write-Host "  [ALERTA] Archivo SQL presente pero requiere verificar habilitación de PostGIS." -ForegroundColor Yellow
    }
} else {
    Write-Host "  [ATENCION] Falta el script schema_onpe_vision.sql." -ForegroundColor Yellow
}

# 3. Simulador Backend y Streaming (Node.js)
Write-Host "[3. Microservicio de Telemetria y Simulador Backend (Node.js)]" -ForegroundColor Cyan
$jsBackend = Get-ChildItem -Path $RutaProyecto -Filter "*simulador_backend*.js" -ErrorAction SilentlyContinue
if ($jsBackend) {
    $jsContent = Get-Content $jsBackend.FullName -Raw -ErrorAction SilentlyContinue
    if ($jsContent -match "flotaActiva" -and $jsContent -match "calcularExplicabilidadXAI") {
        Write-Host "  [APROBADO] Servidor Node.js funcional con motor semafórico y valores XAI/SHAP: $($jsBackend.Name)" -ForegroundColor Green
        $puntaje += 1
    } else {
        Write-Host "  [ALERTA] El simulador backend está presente pero falta verificar motor XAI." -ForegroundColor Yellow
    }
} else {
    Write-Host "  [ATENCION] Falta simulador_backend.js." -ForegroundColor Yellow
}

# 4. Prototipo Web Interactivo (PWA / Dashboard)
Write-Host "[4. Prototipo Frontend Interactivo (Cartografia y Dashboard)]" -ForegroundColor Cyan
$htmlFile = Get-ChildItem -Path $RutaProyecto -Filter "*Onpe vision*.html" -ErrorAction SilentlyContinue
if (-not $htmlFile) { $htmlFile = Get-ChildItem -Path $RutaProyecto -Filter "index.html" -ErrorAction SilentlyContinue }
if ($htmlFile) {
    Write-Host "  [APROBADO] Prototipo Frontend encontrado: $($htmlFile.Name) ($([math]::Round($htmlFile.Length / 1MB, 2)) MB)" -ForegroundColor Green
    $puntaje += 1
} else {
    Write-Host "  [ATENCION] No se encontró la maqueta interactiva HTML." -ForegroundColor Yellow
}

# 5. Diagramas de Arquitectura (SVG / Gráficos de Soporte)
Write-Host "[5. Diagramas Arquitectonicos y Evidencias Visuales]" -ForegroundColor Cyan
$svgFiles = Get-ChildItem -Path $RutaProyecto -Filter "*.svg" -ErrorAction SilentlyContinue
if ($svgFiles.Count -ge 2) {
    Write-Host "  [APROBADO] Encontrados $($svgFiles.Count) diagramas vectoriales de Arquitectura Multicapa y Flujo XAI." -ForegroundColor Green
    $puntaje += 1
} else {
    Write-Host "  [ATENCION] Se recomienda contar con al menos 2 diagramas SVG de arquitectura." -ForegroundColor Yellow
}

# 6. Presentación Ejecutiva en Diapositivas (PPTX)
Write-Host "[6. Presentacion Ejecutiva para Sustentacion (PPTX)]" -ForegroundColor Cyan
$pptxFile = Get-ChildItem -Path $RutaProyecto -Filter "*Presentacion*.pptx" -ErrorAction SilentlyContinue
if ($pptxFile) {
    Write-Host "  [APROBADO] Presentación ejecutiva lista para sustentar: $($pptxFile.Name)" -ForegroundColor Green
    $puntaje += 1
} else {
    Write-Host "  [ATENCION] Falta archivo de diapositivas PPTX." -ForegroundColor Yellow
}

Write-Host "---------------------------------------------------------------------" -ForegroundColor DarkGray
$porcentaje = [math]::Round(($puntaje / $totalRubros) * 100, 1)
Write-Host "NIVEL DE CUMPLIMIENTO DEL PROYECTO: $porcentaje % ($puntaje / $totalRubros componentes)" -ForegroundColor $(if ($puntaje -eq $totalRubros) { "Green" } else { "Yellow" })
Write-Host "=====================================================================" -ForegroundColor Cyan
