# Banco de Prompts Especializados para ONPE Visión (Diseño de Productos y Servicios)
# Estructurados con delimitadores XML para máxima precisión técnica y académica

Copia y pega cualquiera de estos prompts en tu otro chat de IA para avanzar con la redacción del paper, los scripts técnicos o la sustentación.

---

### Prompt 1: Redacción / Expansión de Secciones del Artículo Científico LACCEI
```xml
<context>
Estamos elaborando el artículo de investigación académica para la asignatura Diseño de Productos y Servicios (UTP).
Título: "ONPE Visión: Sistema de Monitoreo en Tiempo Real para la Distribución de Material Electoral en Perú".
Formato: Plantilla LACCEI / IEEE.
Caso de estudio: Elecciones 2026, falla de transporte en Lima Sur (211 mesas afectadas, 63,300 electores excluidos).
</context>

<instructions>
Redacta de manera rigurosa, científica y detallada la sección [NOMBRE DE LA SECCIÓN, ej: Arquitectura del Sistema / Metodología / Discusión de Resultados]:
1. Usa lenguaje formal académico en tercera persona.
2. Incorpora los datos cuantitativos del caso real (10,401 locales, 1,420 vehículos, telemetría cada 30 segundos, SLA 99.9%).
3. Explica la sinergia entre las 3 capas: Presentación (PWA en 3 clics), Aplicación (Node.js + XAI con valores SHAP) e Infraestructura (PostGIS + Red MPLS/Satelital).
4. Incluye referencias formales en formato APA 7ma / IEEE.
</instructions>
```

---

### Prompt 2: Consultas Geoespaciales Avanzadas en PostGIS
```xml
<context>
Tengo el esquema de base de datos schema_onpe_vision.sql con PostgreSQL 16 y extensión PostGIS (SRID 4326).
Tablas disponibles: locales_votacion (Point), vehiculos_transporte, rutas_electorales (LineString), telemetria_gps (Point).
</context>

<instructions>
Escribe funciones y consultas SQL espaciales optimizadas para:
1. Detectar automáticamente si un vehículo se encuentra fuera de su corredor vial autorizado (desvío de geocerca mayor a 500 metros usando ST_Distance o ST_DWithin).
2. Calcular el tiempo estimado de arribo (ETA) al local de votación más cercano en base a su velocidad promedio actual.
3. Generar una vista espacial vista_monitoreo_critico_lima_sur que filtre las unidades en estado 'ROJO' con el conteo de mesas en riesgo.
4. Asegurar el uso de índices espaciales GIST para que la consulta responda en milisegundos.
</instructions>
```

---

### Prompt 3: Algoritmo de Inteligencia Artificial Explicable (XAI / SHAP)
```xml
<context>
En el simulador simulador_backend.js implementamos un microservicio telemétrico con un motor de reglas y explicabilidad XAI para el sistema electoral.
</context>

<instructions>
Ayúdame a profundizar la lógica del motor de Inteligencia Artificial Explicable:
1. Explica matemáticamente cómo se ponderan los valores SHAP para justificar una alerta logística (ej. peso de la vulnerabilidad de la zona, historial de averías del transportista, condiciones meteorológicas y retraso acumulado).
2. Escribe una función en JavaScript/Node.js que reciba los datos telemétricos en vivo y retorne el desglose de impacto porcentual de cada variable junto con el protocolo de contingencia que debe activar la ONPE.
3. Proporciona una explicación clara que podamos incluir en las diapositivas de sustentación ante el jurado.
</instructions>
```

---

### Prompt 4: Guion de Defensa Ejecutiva y Pitch para el Jurado
```xml
<context>
Debemos sustentar el proyecto final de Diseño de Productos y Servicios ante el jurado universitario.
El proyecto es ONPE Visión y tenemos la presentación ONPE_Vision_Presentacion_final.pptx.
</context>

<instructions>
Prepara un guion de sustentación de 10 minutos distribuido de forma equilibrada para los 5 integrantes del equipo:
1. Integrante 1: Planteamiento del problema, dolor del usuario y caso real de las Elecciones 2026.
2. Integrante 2: Propuesta de valor, metodología Design Thinking y UX asistida en 3 clics.
3. Integrante 3: Arquitectura tecnológica multicapa (PWA, Node.js, WebSockets, PostGIS y MPLS).
4. Integrante 4: Demostración técnica del simulador telemétrico y motor de alertas XAI.
5. Integrante 5: Análisis de viabilidad financiera, impacto social, gobernanza y conclusiones.
6. Incluye posibles preguntas difíciles que el jurado podría hacer y cómo responderlas con solidez técnica.
</instructions>
```
