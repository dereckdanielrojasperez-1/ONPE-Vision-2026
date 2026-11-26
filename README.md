# ONPE Visión: Sistema de Monitoreo en Tiempo Real para la Distribución de Material Electoral en Perú

> **Proyecto Académico Integrador**  
> **Asignatura:** Diseño de Productos y Servicios (`100000SI67`)  
> **Institución:** Universidad Tecnológica del Perú (UTP)  
> **Docente:** Santillan Aching, Nilton Omar  
> **Ciclo:** 2026 - Ciclo 2 Agosto  
> **Entregable:** Avance de Proyecto Final II (S08.s1)  

---

## Integrantes del Equipo (Autores)
1. **Farfán Espinoza, Sebastian Alejandro** (`sfarfan@utp.edu.pe`)
2. **Rojas Perez, Dereck Daniel** (`drojas@utp.edu.pe`)
3. **Janampa Jaulis, Diego Alexander** (`djanampa@utp.edu.pe`)
4. **Rojas Taco, Victor Manuel** (`vrojas@utp.edu.pe`)
5. **Navarro Caysahuana, Keyden Andrew** (`knavarro@utp.edu.pe`)

---

## 1. Resumen y Problemática

El proyecto responde a la crisis logística ocurrida en las **Elecciones Generales del 12 de abril de 2026**, donde el incumplimiento del contratista de transporte **Galaga SAC** ocasionó que **211 mesas de sufragio no se instalaran**, dejando a **63,300 ciudadanos sin votar** en 15 locales de Lima Sur (San Juan de Miraflores, Lurín y Pachacámac). El proveedor acumulaba previamente más de **S/ 64,000 en penalidades**.

La causa raíz identificada fue la **carencia de visibilidad en tiempo real** por parte de la ONPE, operando mediante llamadas telefónicas y hojas de cálculo para supervisar más de **10,400 locales de votación** a nivel nacional.

---

## 2. Solución Propuesta: ONPE Visión

**ONPE Visión** es una plataforma centralizada de monitoreo predictivo basada en la convergencia de tres capas tecnológicas:
* **Capa de Infraestructura Privada Dedicada (MPLS):** Enlace directo y de alta disponibilidad (>99.9% uptime) entre las ODPE y el Data Center Central de la ONPE para asegurar la transmisión de datos durante picos electorales.
* **Capa de Confianza Digital con Inteligencia Artificial Explicable (XAI):** Algoritmos transparentes basados en valores SHAP/LIME que ponderan y justifican matemáticamente cada alerta de riesgo logístico (falla mecánica, condiciones meteorológicas, desvíos de ruta).
* **Capa de Interacción Centrada en el Usuario (UX Operativo Asistido):** Terminal móvil PWA para coordinadores de local y miembros de mesa, diseñada para confirmar la recepción y custodia del material electoral en **exactamente 3 clics**, mitigando la fatiga cognitiva y el error humano.

---

## 3. Arquitectura del Sistema (3 Capas + Integración)

```
┌────────────────────────────────────────────────────────────────────────┐
│                        1. CAPA DE PRESENTACIÓN                         │
│  - PWA desarrollada en React + TypeScript                              │
│  - Cartografía interactiva georreferenciada (Leaflet.js / OSM)         │
│  - Dashboard centralizado de telemetría para Carlos Mendoza            │
│  - Terminal móvil de campo asistida en 3 clics                         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ WebSockets (Socket.io)
┌───────────────────────────────────▼────────────────────────────────────┐
│                        2. CAPA DE APLICACIÓN                           │
│  - Backend Node.js con Express API REST                                │
│  - Motor de reglas configurables (Semáforos: Verde, Amarillo, Rojo)    │
│  - Motor de Inteligencia Artificial Explicable (Modelos XAI / SHAP)    │
│  - Gestor de eventos de telemetría y geocercas                         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ TLS 1.3 / Encriptación
┌───────────────────────────────────▼────────────────────────────────────┐
│                  3. CAPA DE DATOS E INFRAESTRUCTURA                    │
│  - Base de datos relacional y geoespacial PostgreSQL + PostGIS         │
│  - Red Privada de Telecomunicaciones MPLS con QoS prioritario          │
│  - Respaldo satelital para zonas rurales e insulares                   │
│  - Integración externa: Twilio (SMS), SendGrid (Email), Firebase (Push)│
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Stack Tecnológico: Arquitectura de Referencia vs. Prototipo Ejecutable

### a) Arquitectura de Referencia en Producción
* **Base de Datos Geoespacial:** PostgreSQL 16 + PostGIS (`schema_onpe_vision.sql`) con índices GiST, `ST_DWithin` y `JOIN LATERAL`.
* **Comunicaciones:** Red Privada MPLS con QoS prioritario y respaldo satelital Starlink.

### b) Implementación del Prototipo Funcional Ejecutable (Entregable)
| Componente | Tecnología / Herramienta | Función en el Sistema |
| :--- | :--- | :--- |
| **Frontend** | HTML5, CSS3 modular, JavaScript ES6+, Leaflet.js y Three.js locales | Dashboard interactivo, globo 3D WebGL, grafo topológico y Terminal PWA offline (`sw.js`) |
| **Backend** | Node.js nativo (>= 22.5.0, módulo `http` y `node:sqlite`) | Servidor HTTP, API REST (`/api/telemetria`, `/api/xai/:id`, `/api/db/consulta`, `/api/chatbot/consulta`) |
| **Base de Datos Local** | SQLite nativo (`onpe_vision.db` con 6 tablas y 32 registros semilla) | Almacén relacional auditado sin dependencias externas (`npm install` cero) |
| **Inteligencia Artificial** | Motor heurístico-aditivo TreeSHAP (`calcularExplicabilidadXAI`) | Descomposición matemática aditiva ($\phi_0 + \sum \phi_i$) de factores de riesgo |

---

## 5. Instrucciones para Ejecutar el Prototipo

1. **Ejecución Integral con Backend Node.js (Recomendado, requiere Node.js >= 22.5.0):**
   * Hacer doble clic en `EJECUTAR_ONPE_VISION.bat` (o ejecutar `node simulador_backend.js` y abrir `http://localhost:3000`).
2. **Ejecución Standalone (Sin Servidor):**
   * Abrir `index.html` directamente en Chrome/Edge; los módulos operan con datasets locales embebidos y fallback resiliente.
3. **Navegación e Interacción:**
   * **Centro de Mando / Analista:** Visualizar KPIs, mapa Leaflet y modelo 3D.
   * **Módulo XAI:** Ajustar sliders en el simulador TreeSHAP.
   * **Terminal de Campo (3 Clics):** Escaneo QR, checklist de 4 puntos, firma digital y emisión de Acta Oficial.
   * **Auditoría:** Exportar reporte CSV o consultar la consola SQL de las 6 tablas.

---

## 6. Guion para la Sustentación Oral (3 Minutos Cronometrados)

* **0:00 – 0:20 (Integrante 1):** *Contexto.* Importancia de la logística electoral y despliegue a más de 10,400 locales.
* **0:20 – 0:40 (Integrante 2):** *Problema.* Crisis del 12 de abril de 2026: contratista Galaga SAC, 211 mesas sin instalar, 63,300 ciudadanos sin votar.
* **0:40 – 1:00 (Integrante 3):** *Propuesta.* ONPE Visión: plataforma modular (Dashboard, GPS, Semáforos, Alertas).
* **1:00 – 1:20 (Integrante 4):** *Justificación.* Análisis costo-beneficio ($5,000 piloto vs $50,000 comercial) y benchmarks de Honduras y Bolivia.
* **1:20 – 2:00 (Representante — Nuevo):** ***Metodología.*** Explicación del marco híbrido Design Thinking + Scrum en sus 5 fases, arquitectura de 3 capas y demostración del prototipo en 3 clics.
* **2:00 – 2:20 (Integrante 5):** *Limitaciones.* Pruebas en entorno simulado acotado a 3 regiones y cumplimiento de la Ley N° 29733 de Datos Personales.
* **2:20 – 3:00 (Todos):** *Cierre.* Llamado a la acción institucional: *"Cada voto cuenta, y cada voto merece llegar"*.

---

##  7. Referencias Bibliográficas

* `[1]` La República, "Elecciones 2026: Incumplimiento en distribución de material electoral deja mesas sin instalar en Lima Sur," 13 de abril de 2026.
* `[2]` RPP Noticias, "63,300 ciudadanos no pudieron votar en Lima Sur por retrasos en entrega de cédulas," 13 de abril de 2026.
* `[3]` El Comercio, "Contratista electoral acumula penalidades por más de S/ 64,000 en contratos con el Estado," 14 de abril de 2026.
* `[4]` Infobae, "Contraloría advierte deficiencias en el monitoreo logístico del material electoral para comicios generales," 15 de abril de 2026.
* `[5]` El Heraldo Honduras, "CNE consolida sistema de rastreo satelital GPS para transporte de maletas electorales," 28 de noviembre de 2025.
* `[6]` Opinión Bolivia, "Órgano Electoral Plurinacional implementa plataforma pública de monitoreo logístico en línea," 19 de octubre de 2025.
* `[7]` D. E. Apiri y S. Lim, "Integrated logistics and election performance: a systematic literature review," *Int. J. of Logistics Research and Applications*, vol. 28, no. 3, pp. 210–229, 2025.
* `[8]` J. A. Velasquez-Jimenez et al., "Real-time tracking and decision-support architectures for critical supply chains in public sector events," *Procedia Computer Science*, vol. 260, pp. 415–424, 2025.
* `[9]` M. Wance et al., "Technological integration and transparency in electoral logistics: A framework for emerging democracies," *J. of Governance and Public Policy*, vol. 12, no. 1, pp. 88–104, 2025.
* `[10]` A. O. Adedokun y D. Ekwunife, "Development of IoT and GPS-Enabled Election Logistic Tracking Architecture under Heterogeneous Networks," *Int. J. of Electrical and Computer Engineering*, vol. 14, no. 5, pp. 5120–5131, 2024.
* `[11]` O. E. Llantos et al., "Resilient telemetry and anomaly detection for critical municipal distribution nodes," *IEEE Access*, vol. 12, pp. 34210–34222, 2024.
* `[12]` ONPE Visión Team, "Prototipo interactivo del sistema de monitoreo logístico electoral ONPE Visión (Figma / Web PWA)," UTP, 2026.
* `[13]` ONPE Visión Team, "Repositorio oficial de arquitectura y código fuente del sistema ONPE Visión," GitHub, 2026. Disponible en: https://github.com/dereckdanielrojasperez-1/ONPE-Vision-2026
