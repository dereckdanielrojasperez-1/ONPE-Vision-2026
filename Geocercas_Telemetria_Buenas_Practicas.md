# Guía de Buenas Prácticas: Geocercas, Telemetría GPS y Streaming Electoral (ONPE Visión)

Esta guía condensa los estándares de ingeniería geoespacial y telecomunicaciones implementados en el proyecto ONPE Visión.

---

## 1. Definición de Geocercas Viales y Corredores Seguros
- **Geometría de Rutas:** Las troncales nacionales deben representarse como `LineString` con proyección WGS84 (`SRID 4326`).
- **Buffer de Seguridad (Corredor):**
  - Rutas urbanas (Lima Metropolitana): Radio de tolerancia de **300 metros**.
  - Rutas interprovinciales / sierra / selva: Radio de tolerancia de **1,000 metros** debido a la imprecisión topográfica de la señal satelital.
- **Función de Verificación en PostGIS:**
  ```sql
  -- Verifica si un punto GPS actual está dentro del corredor autorizado de la ruta
  SELECT ST_DWithin(
      t.posicion_actual::geography,
      r.trazado_vial::geography,
      500 -- metros de tolerancia
  ) AS dentro_de_corredor
  FROM telemetria_gps t
  JOIN rutas_electorales r ON r.id_vehiculo = t.id_vehiculo
  WHERE t.id_vehiculo = 'DEZ-782'
  ORDER BY t.timestamp_registro DESC LIMIT 1;
  ```

---

## 2. Lógica del Semáforo de Riesgo Logístico
| Estado | Condición Telemétrica | Protocolo de Acción Inmediata |
| :---: | :--- | :--- |
| [NORMAL] **VERDE** | Desvío $\le 300$ m, velocidad constante según vía, reporte cada 30 segundos. | Tránsito normal sin intervención humana. |
| [PREVENTIVA] **AMARILLO** | Desvío entre 300 m y 1,000 m, parada imprevista $\le 10$ minutos, o retraso por caudal fluvial. | Alerta visual en dashboard ODPE y llamada preventiva de verificación telemétrica. |
| [CRITICA] **ROJO** | Desvío $> 1,000$ m, parada imprevista $> 10$ minutos en zona no autorizada, pérdida de señal $> 3$ minutos, o botón de pánico del conductor. | Alarma sonora en Centro de Comando ONPE, activación de patrullaje PNP y despacho de unidad de reserva logística. |

---

## 3. Optimización de Ancho de Banda en Red MPLS
- **Frecuencia de Muestreo:** Envío telemétrico cada 30 segundos en movimiento y cada 3 minutos en reposo para optimizar el enlace MPLS y satelital.
- **Payload Compacto JSON:** Enviar solo identificador, coordenadas (latitud/longitud truncadas a 5 decimales $\approx 1$ metro de precisión), velocidad y timestamp epoch:
  ```json
  {"id":"DEZ-782","lat":-12.78651,"lng":-74.97542,"v":0,"bat":94,"ts":1763378400}
  ```
- **Almacenamiento Local (Store and Forward):** Si el módem pierde cobertura, la terminal PWA o GPS debe almacenar hasta 500 registros en búfer local y transmitirlos en lote al recuperar conexión.
