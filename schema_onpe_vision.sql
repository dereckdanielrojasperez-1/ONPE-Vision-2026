-- ============================================================================
-- ONPE VISIÓN: SISTEMA DE MONITOREO Y TRAZABILIDAD EN TIEMPO REAL (PERÚ 2026)
-- Script de Base de Datos Geoespacial: PostgreSQL 16 + PostGIS
-- Asignatura: Diseño de Productos y Servicios (100000SI67) - UTP
-- Docente: Dr. Nilton Omar Santillán Aching
-- Autores: Farfán Espinoza, Rojas Perez, Janampa Jaulis, Rojas Taco, Navarro Caysahuana
-- ============================================================================

-- 1. HABILITACIÓN DE EXTENSIÓN POSTGIS (WGS84 - SRID 4326)
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. CATÁLOGO DE LOCALES DE VOTACIÓN A NIVEL NACIONAL (10,401 LOCALES)
CREATE TABLE IF NOT EXISTS locales_votacion (
    id_local VARCHAR(12) PRIMARY KEY,
    codigo_odpe VARCHAR(8) NOT NULL,
    nombre_local VARCHAR(150) NOT NULL,
    departamento VARCHAR(50) NOT NULL,
    provincia VARCHAR(50) NOT NULL,
    distrito VARCHAR(50) NOT NULL,
    mesas_asignadas INT NOT NULL CHECK (mesas_asignadas > 0),
    electores_habiles INT NOT NULL CHECK (electores_habiles > 0),
    coordenadas GEOMETRY(Point, 4326) NOT NULL,
    estado_recepcion VARCHAR(20) DEFAULT 'pendiente' CHECK (estado_recepcion IN ('pendiente', 'en_ruta', 'entregado', 'critico')),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. FLOTA DE TRANSPORTE ELECTORAL (1,420 VEHÍCULOS BLINDADOS Y FLUVIALES)
CREATE TABLE IF NOT EXISTS vehiculos_transporte (
    id_vehiculo VARCHAR(10) PRIMARY KEY,
    placa VARCHAR(10) UNIQUE NOT NULL,
    tipo_unidad VARCHAR(60) NOT NULL,
    empresa_contratista VARCHAR(100) NOT NULL,
    nombre_conductor VARCHAR(120) NOT NULL,
    efectivo_policial_pnp VARCHAR(120) NOT NULL,
    capacidad_anforas INT NOT NULL,
    estado_operativo VARCHAR(20) DEFAULT 'en_ruta' CHECK (estado_operativo IN ('en_ruta', 'averiado', 'retraso', 'llegada_conforme', 'alerta_critica')),
    ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. TRAZABILIDAD DE RUTAS VIALES TRONCALES Y GEOCERCAS ELECTORALES
CREATE TABLE IF NOT EXISTS rutas_electorales (
    id_ruta SERIAL PRIMARY KEY,
    id_vehiculo VARCHAR(10) REFERENCES vehiculos_transporte(id_vehiculo),
    nombre_ruta VARCHAR(100) NOT NULL,
    tipo_via VARCHAR(30) DEFAULT 'urbana' CHECK (tipo_via IN ('urbana', 'interprovincial', 'fluvial', 'andina')),
    odpe_origen VARCHAR(80) NOT NULL,
    odpe_destino VARCHAR(80) NOT NULL,
    trazado_vial GEOMETRY(LineString, 4326) NOT NULL,
    tolerancia_buffer_m NUMERIC(6,2) DEFAULT 300.00,
    distancia_total_km NUMERIC(8,2) NOT NULL,
    tiempo_estimado_min INT NOT NULL,
    UNIQUE (id_vehiculo, nombre_ruta)
);

-- 5. REGISTRO CONTINUO DE TELEMETRÍA GPS (STREAMING CADA 30 SEGUNDOS)
CREATE TABLE IF NOT EXISTS telemetria_gps (
    id_telemetria BIGSERIAL PRIMARY KEY,
    id_vehiculo VARCHAR(10) REFERENCES vehiculos_transporte(id_vehiculo),
    posicion_actual GEOMETRY(Point, 4326) NOT NULL,
    velocidad_kmh NUMERIC(5,2) NOT NULL,
    rumbo_grados NUMERIC(5,2) DEFAULT 0.0,
    nivel_bateria INT CHECK (nivel_bateria BETWEEN 0 AND 100),
    tipo_enlace VARCHAR(20) DEFAULT 'MPLS_DEDICADA' CHECK (tipo_enlace IN ('MPLS_DEDICADA', 'SATELITAL_STARLINK', '4G_5G_CONTINGENCIA')),
    timestamp_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. ACTAS DIGITALES DE RECEPCIÓN EN CAMPO (PWA MÓVIL 3 CLICS)
CREATE TABLE IF NOT EXISTS actas_recepcion_campo (
    id_acta VARCHAR(20) PRIMARY KEY,
    id_local VARCHAR(12) REFERENCES locales_votacion(id_local),
    codigo_precinto_qr VARCHAR(50) NOT NULL,
    sellos_integros BOOLEAN DEFAULT TRUE,
    hash_firma_sha256 CHAR(64) NOT NULL,
    coordinador_dni CHAR(8) NOT NULL,
    modo_offline BOOLEAN DEFAULT FALSE,
    tiempo_registro_segundos INT DEFAULT 180,
    timestamp_sincronizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. ALERTAS TEMPRANAS CON INFERENCIA DE INTELIGENCIA ARTIFICIAL (XAI / SHAP)
CREATE TABLE IF NOT EXISTS alertas_xai (
    id_alerta SERIAL PRIMARY KEY,
    id_vehiculo VARCHAR(10) REFERENCES vehiculos_transporte(id_vehiculo),
    id_local VARCHAR(12) REFERENCES locales_votacion(id_local),
    nivel_semaforo VARCHAR(10) CHECK (nivel_semaforo IN ('verde', 'amarillo', 'rojo')),
    shap_vulnerabilidad_ruta NUMERIC(4,2),
    shap_falla_mecanica NUMERIC(4,2),
    shap_impacto_electores NUMERIC(4,2),
    shap_clima_fluvial NUMERIC(4,2) DEFAULT 0.0,
    shap_retraso_horario NUMERIC(4,2) DEFAULT 0.0,
    protocolo_activado TEXT NOT NULL,
    notificacion_enviada_contraloria BOOLEAN DEFAULT FALSE,
    notificacion_enviada_jne BOOLEAN DEFAULT FALSE,
    fecha_emision TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. ÍNDICES ESPACIALES GIST PARA EVALUACIÓN SUB-12 MILISEGUNDOS
CREATE INDEX IF NOT EXISTS idx_locales_geom ON locales_votacion USING GIST (coordenadas);
CREATE INDEX IF NOT EXISTS idx_telemetria_geom ON telemetria_gps USING GIST (posicion_actual);
CREATE INDEX IF NOT EXISTS idx_rutas_geom ON rutas_electorales USING GIST (trazado_vial);
CREATE INDEX IF NOT EXISTS idx_telemetria_veh_time ON telemetria_gps (id_vehiculo, timestamp_registro DESC);

-- ============================================================================
-- 9. FUNCIONES GEOESPACIALES AVANZADAS (PROMPT 2 - POSTGIS OPTIMIZADO)
-- ============================================================================

-- 9.1 Función de Detección Automática de Desvío de Corredor Vial (ST_DWithin)
-- Evalúa si el último punto telemétrico supera el margen de tolerancia de la ruta
CREATE OR REPLACE FUNCTION fn_detectar_desvio_corredor_vial(
    p_id_vehiculo VARCHAR,
    p_tolerancia_m NUMERIC DEFAULT NULL
) 
RETURNS TABLE (
    vehiculo_id VARCHAR,
    desviado BOOLEAN,
    distancia_desvio_metros NUMERIC,
    nivel_alerta VARCHAR,
    accion_recomendada TEXT
) AS $$
DECLARE
    v_pos_actual GEOMETRY;
    v_ruta_geom GEOMETRY;
    v_tolerancia NUMERIC;
    v_distancia NUMERIC;
    v_tipo_via VARCHAR;
BEGIN
    -- Obtener la última posición GPS del vehículo
    SELECT posicion_actual INTO v_pos_actual
    FROM telemetria_gps
    WHERE id_vehiculo = p_id_vehiculo
    ORDER BY timestamp_registro DESC
    LIMIT 1;

    -- Obtener el trazado oficial autorizado y la tolerancia configurada
    SELECT trazado_vial, tolerancia_buffer_m, tipo_via 
    INTO v_ruta_geom, v_tolerancia, v_tipo_via
    FROM rutas_electorales
    WHERE id_vehiculo = p_id_vehiculo
    LIMIT 1;

    IF v_pos_actual IS NULL OR v_ruta_geom IS NULL THEN
        RETURN QUERY SELECT p_id_vehiculo, FALSE, 0.0::NUMERIC, 'DESCONOCIDO'::VARCHAR, 'Sin datos telemétricos o ruta no asignada'::TEXT;
        RETURN;
    END IF;

    -- Si no se suministra tolerancia explícita, usar la configurada en la ruta
    IF p_tolerancia_m IS NOT NULL THEN
        v_tolerancia := p_tolerancia_m;
    END IF;

    -- Cálculo geodésico exacto en metros sobre el esferoide WGS84
    v_distancia := ROUND(ST_Distance(v_pos_actual::geography, v_ruta_geom::geography)::NUMERIC, 2);

    IF v_distancia > v_tolerancia THEN
        IF v_distancia > 1000 THEN
            RETURN QUERY SELECT p_id_vehiculo, TRUE, v_distancia, 'ROJO'::VARCHAR, 
                'Desvío crítico fuera de corredor (>1km). Activar patrulla PNP y alertar fiscalizador JNE'::TEXT;
        ELSE
            RETURN QUERY SELECT p_id_vehiculo, TRUE, v_distancia, 'AMARILLO'::VARCHAR, 
                'Desvío moderado de corredor seguro. Realizar llamada de verificación al conductor'::TEXT;
        END IF;
    ELSE
        RETURN QUERY SELECT p_id_vehiculo, FALSE, v_distancia, 'VERDE'::VARCHAR, 
            'Tránsito en corredor vial autorizado'::TEXT;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- 9.2 Función de Cálculo de ETA (Tiempo Estimado de Arribo) al Local más Cercano
CREATE OR REPLACE FUNCTION fn_calcular_eta_local_mas_cercano(
    p_id_vehiculo VARCHAR
)
RETURNS TABLE (
    id_local VARCHAR,
    nombre_local VARCHAR,
    distrito VARCHAR,
    mesas_en_riesgo INT,
    distancia_km NUMERIC,
    velocidad_actual_kmh NUMERIC,
    eta_minutos NUMERIC
) AS $$
DECLARE
    v_pos_actual GEOMETRY;
    v_velocidad NUMERIC;
BEGIN
    SELECT posicion_actual, velocidad_kmh 
    INTO v_pos_actual, v_velocidad
    FROM telemetria_gps
    WHERE id_vehiculo = p_id_vehiculo
    ORDER BY timestamp_registro DESC
    LIMIT 1;

    IF v_pos_actual IS NULL THEN
        RETURN;
    END IF;

    RETURN QUERY
    SELECT 
        l.id_local,
        l.nombre_local,
        l.distrito,
        l.mesas_asignadas,
        ROUND((ST_Distance(v_pos_actual::geography, l.coordenadas::geography) / 1000.0)::NUMERIC, 2) AS dist_km,
        v_velocidad,
        CASE 
            WHEN v_velocidad > 5 THEN 
                ROUND(((ST_Distance(v_pos_actual::geography, l.coordenadas::geography) / 1000.0) / (v_velocidad / 60.0))::NUMERIC, 1)
            ELSE 
                999.0::NUMERIC -- Vehículo detenido o averiado
        END AS eta_min
    FROM locales_votacion l
    ORDER BY v_pos_actual <-> l.coordenadas -- Operador k-NN GiST ultra rápido
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 10. VISTA ESPACIAL DE MONITOREO CRÍTICO: CASO LIMA SUR (PROMPT 2)
-- Consolida unidades en alerta roja y cuantifica mesas/electores en riesgo
-- ============================================================================
CREATE OR REPLACE VIEW vista_monitoreo_critico_lima_sur AS
SELECT 
    v.id_vehiculo,
    v.placa,
    v.tipo_unidad,
    v.empresa_contratista,
    v.estado_operativo,
    t.velocidad_kmh,
    t.tipo_enlace,
    t.timestamp_registro AS ultima_senal,
    l.id_local AS local_proximo_id,
    l.nombre_local AS local_proximo_nombre,
    l.distrito,
    l.mesas_asignadas AS mesas_en_riesgo,
    l.electores_habiles AS electores_en_riesgo,
    ROUND((ST_Distance(t.posicion_actual::geography, l.coordenadas::geography) / 1000.0)::NUMERIC, 2) AS distancia_km_al_local,
    CASE 
        WHEN v.estado_operativo IN ('alerta_critica', 'averiado') THEN 'ROJO'
        WHEN v.estado_operativo = 'retraso' THEN 'AMARILLO'
        ELSE 'VERDE'
    END AS semaforo_riesgo,
    'Intervención Inmediata: Despachar convoy de auxilio desde Almacén Central ONPE con resguardo policial' AS protocolo_sugerido
FROM vehiculos_transporte v
JOIN (
    SELECT DISTINCT ON (id_vehiculo) id_vehiculo, posicion_actual, velocidad_kmh, tipo_enlace, timestamp_registro
    FROM telemetria_gps
    ORDER BY id_vehiculo, timestamp_registro DESC
) t ON v.id_vehiculo = t.id_vehiculo
CROSS JOIN LATERAL (
    SELECT id_local, nombre_local, distrito, mesas_asignadas, electores_habiles, coordenadas
    FROM locales_votacion
    ORDER BY t.posicion_actual <-> coordenadas
    LIMIT 1
) l
WHERE v.empresa_contratista LIKE '%Galaga%' OR v.estado_operativo IN ('alerta_critica', 'averiado');

-- ============================================================================
-- 11. DATOS SEMILLA DE PRUEBA (DATASET DE VALIDACIÓN REAL 2026)
-- ============================================================================

-- Locales de Votación Estratégicos (Lima Sur, Huancavelica, Loreto, Arequipa)
INSERT INTO locales_votacion (id_local, codigo_odpe, nombre_local, departamento, provincia, distrito, mesas_asignadas, electores_habiles, coordenadas, estado_recepcion)
VALUES 
('LOC-SJM-01', 'ODPE-LS', 'I.E. Javier Heraud', 'Lima', 'Lima', 'San Juan de Miraflores', 211, 63300, ST_SetSRID(ST_MakePoint(-76.9682, -12.1611), 4326), 'critico'),
('LOC-LUR-02', 'ODPE-LS', 'I.E. 6030 Víctor A. Belaúnde', 'Lima', 'Lima', 'Lurín', 45, 13500, ST_SetSRID(ST_MakePoint(-76.8711, -12.2747), 4326), 'critico'),
('LOC-PAC-03', 'ODPE-LS', 'I.E. Pachacámac 6005', 'Lima', 'Lima', 'Pachacámac', 38, 11400, ST_SetSRID(ST_MakePoint(-76.8622, -12.2289), 4326), 'critico'),
('LOC-HVC-04', 'ODPE-HV', 'I.E. La Victoria de Ayacucho', 'Huancavelica', 'Huancavelica', 'Huancavelica', 32, 9600, ST_SetSRID(ST_MakePoint(-74.9754, -12.7865), 4326), 'en_ruta'),
('LOC-LOR-05', 'ODPE-LO', 'I.E. Mariscal Óscar R. Benavides', 'Loreto', 'Maynas', 'Iquitos', 54, 16200, ST_SetSRID(ST_MakePoint(-73.2516, -3.7437), 4326), 'en_ruta'),
('LOC-AQP-06', 'ODPE-AQ', 'Colegio Independencia Americana', 'Arequipa', 'Arequipa', 'Arequipa', 120, 36000, ST_SetSRID(ST_MakePoint(-71.5375, -16.4090), 4326), 'entregado')
ON CONFLICT (id_local) DO NOTHING;

-- Flota Representativa de Vehículos
INSERT INTO vehiculos_transporte (id_vehiculo, placa, tipo_unidad, empresa_contratista, nombre_conductor, efectivo_policial_pnp, capacidad_anforas, estado_operativo)
VALUES
('VEH-104', 'GAL-104', 'Furgón Reparto Ligero', 'Galaga SAC (Contratista Observado)', 'Conductor No Identificado', 'Sin resguardo asignado', 60, 'alerta_critica'),
('VEH-782', 'DEZ-782', 'Camión Blindado Scania R450', 'Transportes Blindados del Centro SAC', 'Manuel Quispe Yupanqui', 'Cmdte. PNP R. Soto', 120, 'averiado'),
('VEH-528', 'DEZ-528', 'Volvo FH Classic 15T', 'Consorcio Vial Sur SAC', 'Jorge Cárdenas Beltrán', 'Cap. PNP M. Silva', 250, 'en_ruta'),
('VEH-365', 'DEZ-365', 'Embarcación Fluvial Amazonas I', 'Líneas Fluviales de Loreto EIRL', 'Segundo Tamani', 'Tnte. PNP A. Coral', 90, 'retraso'),
('VEH-234', 'DEZ-234', 'Volvo FH 540 Gran Carga', 'Transportes del Norte SAC', 'Carlos Mendoza Paredes', 'Mayor PNP L. Flores', 200, 'llegada_conforme')
ON CONFLICT (id_vehiculo) DO NOTHING;

-- Rutas Viales Troncales Georreferenciadas
INSERT INTO rutas_electorales (id_vehiculo, nombre_ruta, tipo_via, odpe_origen, odpe_destino, trazado_vial, tolerancia_buffer_m, distancia_total_km, tiempo_estimado_min)
VALUES
('VEH-104', 'Troncal Lima Sur - Despacho SJM', 'urbana', 'Almacén Central Lurín', 'ODPE Lima Sur',
 ST_SetSRID(ST_GeomFromText('LINESTRING(-76.9200 -12.2800, -76.9350 -12.2400, -76.9500 -12.2000, -76.9682 -12.1611)'), 4326),
 300.0, 24.5, 45),
('VEH-782', 'Troncal Andina Central - Huancavelica', 'andina', 'Almacén Central Lima', 'ODPE Huancavelica',
 ST_SetSRID(ST_GeomFromText('LINESTRING(-77.0282 -12.0432, -76.2000 -11.9000, -75.5000 -12.2000, -74.9754 -12.7865)'), 4326),
 1000.0, 420.0, 540),
('VEH-528', 'Corredor Sur Panamericana - Arequipa', 'interprovincial', 'Almacén Central Lima', 'ODPE Arequipa',
 ST_SetSRID(ST_GeomFromText('LINESTRING(-77.0282 -12.0432, -76.5000 -13.0000, -74.0000 -15.5000, -71.5375 -16.4090)'), 4326),
 800.0, 1010.0, 840),
('VEH-365', 'Corredor Fluvial Río Amazonas - Iquitos', 'fluvial', 'Puerto Fluvial Nanay', 'ODPE Maynas',
 ST_SetSRID(ST_GeomFromText('LINESTRING(-73.3000 -3.8000, -73.2800 -3.7700, -73.2600 -3.7500, -73.2516 -3.7437)'), 4326),
 1200.0, 75.0, 180)
ON CONFLICT DO NOTHING;

-- Registros Iniciales de Telemetría GPS
INSERT INTO telemetria_gps (id_vehiculo, posicion_actual, velocidad_kmh, rumbo_grados, nivel_bateria, tipo_enlace)
VALUES
('VEH-104', ST_SetSRID(ST_MakePoint(-76.9682, -12.1611), 4326), 0.00, 0.0, 15, '4G_5G_CONTINGENCIA'),
('VEH-782', ST_SetSRID(ST_MakePoint(-74.9754, -12.7865), 4326), 0.00, 185.0, 88, 'SATELITAL_STARLINK'),
('VEH-528', ST_SetSRID(ST_MakePoint(-71.5375, -16.4090), 4326), 74.50, 142.0, 96, 'MPLS_DEDICADA'),
('VEH-365', ST_SetSRID(ST_MakePoint(-73.2516, -3.7437), 4326), 24.00, 45.0, 91, 'SATELITAL_STARLINK'),
('VEH-234', ST_SetSRID(ST_MakePoint(-80.6328, -5.1945), 4326), 82.00, 310.0, 99, 'MPLS_DEDICADA');

-- Alertas Históricas XAI de Referencia
INSERT INTO alertas_xai (id_vehiculo, id_local, nivel_semaforo, shap_vulnerabilidad_ruta, shap_falla_mecanica, shap_impacto_electores, shap_retraso_horario, protocolo_activado, notificacion_enviada_contraloria, notificacion_enviada_jne)
VALUES
('VEH-104', 'LOC-SJM-01', 'rojo', 0.48, 0.32, 0.20, 0.85, 'Despacho de reserva logística con custodia PNP y apertura de expediente sancionador ante Contraloría', TRUE, TRUE),
('VEH-782', 'LOC-HVC-04', 'rojo', 0.55, 0.35, 0.10, 0.40, 'Coordinación con Región Policial Huancavelica para auxilio mecánico y resguardo armado de ánforas', TRUE, FALSE),
('VEH-365', 'LOC-LOR-05', 'amarillo', 0.25, 0.10, 0.15, 0.50, 'Monitoreo preventivo de hidrovía con Capitanía de Puerto de Iquitos', FALSE, FALSE);
