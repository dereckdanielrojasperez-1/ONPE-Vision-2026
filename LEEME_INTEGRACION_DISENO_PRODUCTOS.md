# Guía de Integración Completa para ONPE Visión (Diseño de Productos y Servicios)

Este paquete reúne la arquitectura completa, directrices académicas en formato LACCEI, reglas para asistentes de Inteligencia Artificial (`.cursorrules` y `SKILL.md`), hojas de seguridad OWASP y scripts de auditoría para el proyecto **ONPE Visión** en la asignatura **Diseño de Productos y Servicios (100000SI67) - UTP**.

---

## Contenido del Repositorio

1. **`.cursorrules`**: Reglas de IA de nivel senior especializadas para el proyecto:
   - Formato formal de paper científico LACCEI/IEEE en español.
   - Modelado geoespacial en PostgreSQL 16 + PostGIS (Point, LineString, índices GIST).
   - Microservicios de telemetría y reglas semafóricas en Node.js.
   - Ponderación matemática de factores de riesgo con Inteligencia Artificial Explicable (XAI / valores SHAP).
   - Usabilidad en campo: diseño centrado en el usuario asistido en 3 clics para coordinadores de mesa.
2. **`SKILL.md`**: Documento de habilidad con frontmatter YAML (`diseno-productos-servicios-onpe-vision`) que carga el caso de estudio de las Elecciones 2026, problemática de Galaga SAC, integrantes del equipo, arquitectura de 3 capas y directrices de respuesta.
3. **`PROMPTS_DISENO_PRODUCTOS.md`**: Banco de 4 prompts avanzados estructurados con etiquetas XML para:
   - Redactar y expandir secciones del artículo de investigación LACCEI.
   - Diseñar consultas espaciales complejas en PostGIS (`ST_DWithin`, alertas de desvío).
   - Implementar y sustentar la lógica de explicabilidad XAI con valores SHAP.
   - Armar el guion de defensa y pitch para los 5 integrantes ante el jurado.
4. **`Geocercas_Telemetria_Buenas_Practicas.md`**: Manual técnico sobre tolerancia de geocercas urbanas vs interprovinciales, lógica de semáforos (Verde, Amarillo, Rojo) y optimización de paquetes JSON sobre enlaces MPLS.
5. **Hojas de Seguridad OWASP Aplicadas**:
   - `REST_Security_Cheat_Sheet.md`: Seguridad para los endpoints de telemetría y actas.
   - `Database_Security_Cheat_Sheet.md`: Seguridad y permisos en PostgreSQL/PostGIS.
   - `Input_Validation_Cheat_Sheet.md`: Sanitización y validación de coordenadas GPS y firmas de actas.
6. **`Auditar_Proyecto_Diseno_Productos.ps1`**: Script en PowerShell que evalúa la carpeta de entregables (Paper, PostGIS, Simulador, Prototipo HTML, Diagramas SVG y Diapositivas PPTX) calculando el porcentaje de cumplimiento *(evaluado: 100% de componentes presentes)*.

---

## Cómo Integrar y Usar en tu Proyecto

### Paso 1: Ubicación
Copia los archivos de este paquete directamente en la raíz de tu carpeta de trabajo:  
`C:\Users\Computecno\Documents\DProductos`  
*(o `Trabajos_Ciclo6\DProductos`)*.

### Paso 2: Activar la Asistencia en tu otro Chat de IA
Pega este mensaje en tu otro chat:
> *"He colocado el archivo `SKILL.md` y `.cursorrules` en la raíz de mi proyecto ONPE Visión (Diseño de Productos y Servicios UTP). Escanéalos atentamente. Adopta el rol de Diseñador de Productos Digitales, Científico Geoespacial y Revisor de Artículos LACCEI. Ayúdame con la siguiente tarea: [aquí indicas qué sección del paper deseas redactar, consulta espacial o preparación de la sustentación]"*

### Paso 3: Ejecutar la Auditoría
En cualquier momento puedes verificar el estado de tus entregables en PowerShell:
```powershell
powershell -ExecutionPolicy Bypass -File .\Auditar_Proyecto_Diseno_Productos.ps1
```
