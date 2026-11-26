# -*- coding: utf-8 -*-
import os
import shutil
import zipfile
import filecmp

src_dir = r"c:\Users\Computecno\Documents\DProductos"
dst_dir = r"C:\Users\Computecno\Documents\Trabajos_Ciclo6\DProductos"

# 1. Archivos raíz esenciales del proyecto de software
root_files = [
    "index.html",
    "simulador_backend.js",
    "onpe_vision.db",
    "schema_onpe_vision.sql",
    "crear_base_datos.js",
    "ABRIR_INTERFAZ_WEB.bat",
    "EJECUTAR_ONPE_VISION.bat",
    "EJECUTAR_ONPE_VISION.ps1",
    "LEEME_EJECUCION.txt",
    "README.md",
    "three.min.js",
    "OrbitControls.js",
    "leaflet.js",
    "leaflet.css",
    "earth_blue_marble.jpg",
    "earth_clouds.png",
    "earth_dark.jpg",
    "earth_night.jpg",
    "logo_onpe.jpg",
    "Diagrama_1_Arquitectura_Multicapa.svg",
    "Diagrama_2_Flujo_Telemetria_XAI.svg",
    "onpe_vision_datos_completos_2026.json",
    "onpe_vision_flota_vehiculos_2026.csv",
    "onpe_vision_incidencias_auditadas_2026.csv",
    "onpe_vision_telemetria_analista_2026.csv",
    "package.json",
    "manifest.json",
    "sw.js"
]

# Documentos académicos sincronizados (para el apartado separado del informe)
documentos_informe = [
    "articulo de diseño_Avance 03.docx",
    "articulo de diseño_Avance 03.pdf",
    "ONPE_Vision_Presentacion_final.pptx",
    "LEEME_INTEGRACION_DISENO_PRODUCTOS.md",
    "Geocercas_Telemetria_Buenas_Practicas.md",
    "PROMPTS_DISENO_PRODUCTOS.md"
]

folders = ["css", "js", "modulos", "img", "images", "tests"]

# Limpieza de archivos obsoletos en destino si existen
obsoletos_dst = [
    os.path.join(dst_dir, "js", "benchmarking.js"),
    os.path.join(dst_dir, "InformeNN.pdf"),
    os.path.join(dst_dir, "zhaomoyun_pindown.io_1794941608.mp4")
]
for ob in obsoletos_dst:
    if os.path.exists(ob):
        os.remove(ob)

print("=== 1. Sincronización completa de archivos hacia Trabajos_Ciclo6 ===")
for rf in root_files + documentos_informe:
    s = os.path.join(src_dir, rf)
    d = os.path.join(dst_dir, rf)
    if os.path.exists(s):
        shutil.copy2(s, d)
        print(f"  ✓ Sincronizado: {rf}")

for fld in folders:
    s_fld = os.path.join(src_dir, fld)
    d_fld = os.path.join(dst_dir, fld)
    if os.path.exists(s_fld):
        os.makedirs(d_fld, exist_ok=True)
        for root, dirs, files in os.walk(s_fld):
            rel_dir = os.path.relpath(root, s_fld)
            target_sub = os.path.join(d_fld, rel_dir) if rel_dir != "." else d_fld
            os.makedirs(target_sub, exist_ok=True)
            for file in files:
                if not file.endswith(('.pyc', '.tmp')):
                    sf = os.path.join(root, file)
                    df = os.path.join(target_sub, file)
                    shutil.copy2(sf, df)
        print(f"  ✓ Carpeta sincronizada: {fld}/")

# 2. Reconstrucción del ZIP oficial de entrega
print("\n=== 2. Reconstruyendo archivo ZIP de Entrega Oficial ===")
zip_path = os.path.join(src_dir, "ONPE_Vision_Avance_03_Entrega_Oficial.zip")

with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for f in root_files:
        p = os.path.join(src_dir, f)
        if os.path.exists(p):
            zipf.write(p, arcname=f)

    for folder in folders:
        f_dir = os.path.join(src_dir, folder)
        if os.path.exists(f_dir):
            for root, dirs, files in os.walk(f_dir):
                for file in files:
                    if not file.endswith(('.pyc', '.tmp')):
                        full_p = os.path.join(root, file)
                        rel_p = os.path.relpath(full_p, src_dir)
                        zipf.write(full_p, arcname=rel_p)

zip_size = os.path.getsize(zip_path)
print(f"✓ ZIP generado en DProductos: {zip_path} ({zip_size:,} bytes)")

dst_zip = os.path.join(dst_dir, "ONPE_Vision_Avance_03_Entrega_Oficial.zip")
shutil.copy2(zip_path, dst_zip)
print(f"✓ ZIP sincronizado en Trabajos_Ciclo6: {dst_zip} ({os.path.getsize(dst_zip):,} bytes)")

# 3. Verificación de integridad entre ambos repositorios
print("\n=== 3. Verificando consistencia de archivos clave ===")
criticos = [
    "index.html",
    "simulador_backend.js",
    "css/base.css",
    "css/views.css",
    "css/responsive.css",
    "css/chatbot.css",
    "js/globo3d.js",
    "js/chatbot.js",
    "js/notificaciones.js"
]

todos_identicos = True
for c in criticos:
    p1 = os.path.join(src_dir, c.replace('/', os.sep))
    p2 = os.path.join(dst_dir, c.replace('/', os.sep))
    igual = filecmp.cmp(p1, p2, shallow=False)
    if not igual:
        todos_identicos = False
    print(f"  {'✓' if igual else '✗'} {c}: {'IDENTICO' if igual else 'DIFIERE'}")

print(f"\nESTADO FINAL: {'100% SINCRONIZADO' if todos_identicos else 'HAY DIFERENCIAS'}")
