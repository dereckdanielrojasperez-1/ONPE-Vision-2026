const { DatabaseSync } = require('node:sqlite');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'onpe_vision.db');

// Create or open SQLite database
const db = new DatabaseSync(dbPath);

console.log('Initializing onpe_vision.db with full schema...');

db.exec(`
    DROP TABLE IF EXISTS alertas_xai;
    DROP TABLE IF EXISTS actas_recepcion_campo;
    DROP TABLE IF EXISTS telemetria_gps;
    DROP TABLE IF EXISTS rutas_electorales;
    DROP TABLE IF EXISTS vehiculos_transporte;
    DROP TABLE IF EXISTS locales_votacion;

    CREATE TABLE locales_votacion (
        id_local TEXT PRIMARY KEY,
        codigo_odpe TEXT NOT NULL,
        nombre_local TEXT NOT NULL,
        departamento TEXT NOT NULL,
        provincia TEXT NOT NULL,
        distrito TEXT NOT NULL,
        mesas_asignadas INTEGER NOT NULL,
        electores_habiles INTEGER NOT NULL,
        latitud REAL NOT NULL,
        longitud REAL NOT NULL,
        estado_recepcion TEXT DEFAULT 'pendiente',
        fecha_creacion TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE vehiculos_transporte (
        id_vehiculo TEXT PRIMARY KEY,
        placa TEXT UNIQUE NOT NULL,
        tipo_unidad TEXT NOT NULL,
        empresa_contratista TEXT NOT NULL,
        nombre_conductor TEXT NOT NULL,
        efectivo_policial_pnp TEXT NOT NULL,
        capacidad_anforas INTEGER NOT NULL,
        estado_operativo TEXT DEFAULT 'en_ruta',
        enlace_satelital TEXT DEFAULT 'MPLS Dedicada',
        velocidad_kmh REAL DEFAULT 0,
        latitud REAL NOT NULL,
        longitud REAL NOT NULL,
        ultima_actualizacion TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE rutas_electorales (
        id_ruta INTEGER PRIMARY KEY AUTOINCREMENT,
        id_vehiculo TEXT REFERENCES vehiculos_transporte(id_vehiculo),
        nombre_ruta TEXT NOT NULL,
        tipo_via TEXT DEFAULT 'urbana',
        odpe_origen TEXT NOT NULL,
        odpe_destino TEXT NOT NULL,
        distancia_total_km REAL NOT NULL,
        tiempo_estimado_min INTEGER NOT NULL,
        tolerancia_buffer_m REAL DEFAULT 300.0
    );

    CREATE TABLE telemetria_gps (
        id_telemetria INTEGER PRIMARY KEY AUTOINCREMENT,
        id_vehiculo TEXT REFERENCES vehiculos_transporte(id_vehiculo),
        latitud REAL NOT NULL,
        longitud REAL NOT NULL,
        velocidad_kmh REAL NOT NULL,
        rumbo_grados REAL DEFAULT 0.0,
        altitud_msnm REAL DEFAULT 150.0,
        nivel_combustible_pct REAL DEFAULT 90.0,
        alerta_geocerca INTEGER DEFAULT 0,
        timestamp_envio TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE actas_recepcion_campo (
        id_acta TEXT PRIMARY KEY,
        id_local TEXT REFERENCES locales_votacion(id_local),
        id_coordinador_dni TEXT NOT NULL,
        codigo_precinto_qr TEXT NOT NULL,
        hash_sha256 TEXT NOT NULL,
        estado_acta TEXT DEFAULT 'conforme',
        metodo_confirmacion TEXT DEFAULT 'pwa_3_clics',
        timestamp_recepcion TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE alertas_xai (
        id_alerta INTEGER PRIMARY KEY AUTOINCREMENT,
        id_vehiculo TEXT REFERENCES vehiculos_transporte(id_vehiculo),
        score_riesgo REAL NOT NULL,
        nivel_severidad TEXT NOT NULL,
        shap_retraso REAL NOT NULL,
        shap_geografia REAL NOT NULL,
        shap_contratista REAL NOT NULL,
        shap_exclusion REAL NOT NULL,
        recomendacion_operativa TEXT NOT NULL,
        timestamp_alerta TEXT DEFAULT (datetime('now'))
    );
`);

console.log('Tables created. Inserting seeds...');

// 1. Locales
const stmtLocal = db.prepare(`
    INSERT INTO locales_votacion (id_local, codigo_odpe, nombre_local, departamento, provincia, distrito, mesas_asignadas, electores_habiles, latitud, longitud, estado_recepcion)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const locales = [
    ['LOC-LIMS-001', 'ODPE-LS', 'I.E. 6050 Juana Alarco de Dammert', 'Lima', 'Lima', 'Miraflores', 25, 7500, -12.1245, -77.0289, 'entregado'],
    ['LOC-LIMS-002', 'ODPE-LS', 'I.E. Javier Heraud (Caso Galaga)', 'Lima', 'Lima', 'San Juan de Miraflores', 211, 63300, -12.1611, -76.9682, 'critico'],
    ['LOC-LIMS-003', 'ODPE-LS', 'Colegio Nacional San Pedro', 'Lima', 'Lima', 'Lurín', 40, 12000, -12.2741, -76.8711, 'en_ruta'],
    ['LOC-HVCA-001', 'ODPE-HV', 'I.E. La Victoria de Ayacucho', 'Huancavelica', 'Huancavelica', 'Ascensión', 35, 9800, -12.7865, -74.9754, 'critico'],
    ['LOC-LORE-001', 'ODPE-LO', 'Colegio Nacional Iquitos (CNI)', 'Loreto', 'Maynas', 'Iquitos', 55, 16500, -3.7437, -73.2516, 'en_ruta'],
    ['LOC-AREQ-001', 'ODPE-AQ', 'G.U.E. Mariano Melgar', 'Arequipa', 'Arequipa', 'Arequipa', 60, 18000, -16.4090, -71.5375, 'entregado'],
    ['LOC-PIUR-001', 'ODPE-PI', 'I.E. San Miguel de Piura', 'Piura', 'Piura', 'Piura', 45, 13500, -5.1945, -80.6328, 'entregado'],
    ['LOC-CUSC-001', 'ODPE-CU', 'Colegio Ciencias del Cusco', 'Cusco', 'Cusco', 'Cusco', 50, 15000, -13.5319, -71.9675, 'entregado']
];

for (const l of locales) stmtLocal.run(...l);

// 2. Vehículos
const stmtVeh = db.prepare(`
    INSERT INTO vehiculos_transporte (id_vehiculo, placa, tipo_unidad, empresa_contratista, nombre_conductor, efectivo_policial_pnp, capacidad_anforas, estado_operativo, enlace_satelital, velocidad_kmh, latitud, longitud)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const vehiculos = [
    ['#GAL-104', 'GAL-104', 'Furgón Ligero', 'Galaga SAC (Contratista Observado)', 'Conductor No Identificado', 'Sin Custodia PNP', 211, 'alerta_critica', '4G Contingencia', 0, -12.1611, -76.9682],
    ['#DEZ-782', 'DEZ-782', 'Camión Scania R450', 'Transportes Blindados Andinos', 'Manuel Quispe', 'Cmdte. PNP R. Soto', 350, 'averiado', 'Starlink', 0, -11.5944, -76.1950],
    ['#DEZ-365', 'DEZ-365', 'Lancha Fluvial Amazonas I', 'Consorcio Fluvial del Oriente', 'Segundo Tamani', 'Tnte. PNP A. Coral', 180, 'retraso', 'Starlink', 22, -3.7437, -73.2516],
    ['#DEZ-528', 'DEZ-528', 'Volvo FH Classic 15T', 'Transportes del Sur SAC', 'Jorge Cárdenas', 'Cap. PNP M. Silva', 400, 'llegada_conforme', 'MPLS Dedicada', 74, -16.4090, -71.5375],
    ['#DEZ-234', 'DEZ-234', 'Volvo FH 540', 'Transportes del Norte SAC', 'Carlos Mendoza P.', 'Mayor PNP L. Flores', 420, 'llegada_conforme', 'MPLS Dedicada', 81, -5.1945, -80.6328],
    ['#DEZ-912', 'DEZ-912', 'Mercedes Actros', 'Logística del Valle Sagrado', 'Efraín Mamani', 'SOT1 PNP J. Ramos', 380, 'llegada_conforme', 'MPLS Dedicada', 68, -13.5319, -71.9675],
    ['#DEZ-641', 'DEZ-641', 'Camión 4x4 Isuzu', 'Transportes Altiplano', 'Walter Condori', 'Cap. PNP D. Quispe', 220, 'retraso', 'Starlink', 35, -15.8402, -70.0219],
    ['#DEZ-115', 'DEZ-115', 'Volvo FMX 460', 'Andes Central Express', 'Raúl Pacherres', 'Tnte. PNP C. Díaz', 360, 'llegada_conforme', 'MPLS Dedicada', 60, -12.0651, -75.2049],
    ['#DEZ-803', 'DEZ-803', 'Lancha Rápida Selva', 'Flota Fluvial Ucayali', 'Nelson Ahuanari', 'SBT PNP R. Vela', 150, 'llegada_conforme', 'Starlink', 28, -8.3791, -74.5539],
    ['#GAL-109', 'GAL-109', 'Furgón Reparto', 'Galaga SAC (Contratista Observado)', 'Conductor Observado', 'Sin Asignar', 120, 'alerta_critica', '4G Contingencia', 0, -12.2289, -76.8622],
    ['#DEZ-447', 'DEZ-447', 'Scania G410', 'Rutas de Ayacucho SAC', 'Darío Huamán', 'Cap. PNP F. Castro', 300, 'llegada_conforme', 'MPLS Dedicada', 70, -13.1588, -74.2239],
    ['#DEZ-701', 'DEZ-701', 'Hino 500', 'Selva Alta Transportes', 'Gilberto Ruiz', 'Tnte. PNP M. Tello', 280, 'llegada_conforme', 'MPLS Dedicada', 65, -6.4842, -76.3688]
];

for (const v of vehiculos) stmtVeh.run(...v);

// 3. Rutas
const stmtRuta = db.prepare(`
    INSERT INTO rutas_electorales (id_vehiculo, nombre_ruta, tipo_via, odpe_origen, odpe_destino, distancia_total_km, tiempo_estimado_min, tolerancia_buffer_m)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

stmtRuta.run('#GAL-104', 'Lurín - SJM Troncal Sur', 'urbana', 'Almacén Central Lurín', 'ODPE Lima Sur', 24.5, 45, 300.0);
stmtRuta.run('#DEZ-782', 'Carretera Central - Ticlio - Huancavelica', 'andina', 'Almacén Central Lima', 'ODPE Huancavelica', 445.0, 540, 1000.0);
stmtRuta.run('#DEZ-365', 'Corredor Fluvial Río Nanay - Maynas', 'fluvial', 'Puerto Bellavista Nanay', 'ODPE Maynas', 180.0, 360, 1500.0);
stmtRuta.run('#DEZ-528', 'Panamericana Sur - Variante Uchumayo', 'interprovincial', 'Lima Central', 'ODPE Arequipa', 1010.0, 840, 500.0);

// 4. Telemetría GPS
const stmtTele = db.prepare(`
    INSERT INTO telemetria_gps (id_vehiculo, latitud, longitud, velocidad_kmh, rumbo_grados, altitud_msnm, nivel_combustible_pct, alerta_geocerca)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

stmtTele.run('#GAL-104', -12.1611, -76.9682, 0.0, 180.0, 140.0, 42.0, 1);
stmtTele.run('#DEZ-782', -11.5944, -76.1950, 0.0, 90.0, 4818.0, 78.0, 1);
stmtTele.run('#DEZ-365', -3.7437, -73.2516, 22.0, 45.0, 106.0, 65.0, 0);

// 5. Actas de Recepción
const stmtActa = db.prepare(`
    INSERT INTO actas_recepcion_campo (id_acta, id_local, id_coordinador_dni, codigo_precinto_qr, hash_sha256, estado_acta, metodo_confirmacion)
    VALUES (?, ?, ?, ?, ?, ?, ?)
`);

stmtActa.run('ACT-2026-0001', 'LOC-LIMS-001', '48201948', 'QR-ONPE-2026-994821', 'a89f3c91e028b8d4f93821038dae921d883ef0129bc817293a', 'conforme', 'pwa_3_clics');
stmtActa.run('ACT-2026-0002', 'LOC-AREQ-001', '71029384', 'QR-ONPE-2026-773192', 'b47e29a8f1049281726a8d7162bca98172e01928471bcca718', 'conforme', 'pwa_3_clics');

// 6. Alertas XAI
const stmtXAI = db.prepare(`
    INSERT INTO alertas_xai (id_vehiculo, score_riesgo, nivel_severidad, shap_retraso, shap_geografia, shap_contratista, shap_exclusion, recomendacion_operativa)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

stmtXAI.run('#GAL-104', 0.94, 'CRITICA', 0.24, 0.16, 0.40, 0.09, 'Despachar convoy contingencia desde Almacén Central Lurín con escolta PNP y remitir a Procuraduría para fianza por S/ 64,000.');
stmtXAI.run('#DEZ-782', 0.72, 'ALTA', 0.20, 0.35, 0.07, 0.05, 'Coordinar con Región Policial Huancavelica y Provías Nacional para envío de remolque autorizado y transbordo seguro.');
stmtXAI.run('#DEZ-365', 0.48, 'MEDIA', 0.18, 0.14, 0.05, 0.06, 'Verificar nivel de combustible en estación fluvial Nanay y monitorear telemetría satelital Starlink cada 15 min.');

console.log('Successfully created and populated onpe_vision.db with 6 relational tables!');
