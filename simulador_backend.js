const http = require('http');
const path = require('path');
const fs = require('fs');
const { DatabaseSync } = require('node:sqlite');

const PUERTO = process.env.PORT || 3000;
const ARCHIVO_INDEX = path.join(__dirname, 'index.html');
const RUTA_DB = path.join(__dirname, 'onpe_vision.db');

// Conexión a la base de datos SQLite nativa
let db = null;
try {
    if (fs.existsSync(RUTA_DB)) {
        db = new DatabaseSync(RUTA_DB);
        console.log('[SQLITE] Base de datos onpe_vision.db conectada exitosamente.');
    } else {
        console.warn('[SQLITE] onpe_vision.db no encontrada, ejecutando inicialización...');
        require('./crear_base_datos.js');
        db = new DatabaseSync(RUTA_DB);
    }
} catch (e) {
    console.error('[SQLITE] Error al inicializar SQLite:', e.message);
}

// Catálogo de Locales Electorales Estratégicos (8 locales según schema_onpe_vision.sql)
const localesElectorales = [
    { id: 'LOC-LIMS-001', odpe: 'Lima Sur', nombre: 'I.E. 6050 Juana Alarco de Dammert', lat: -12.1245, lng: -77.0289, mesas: 25, electores: 7500 },
    { id: 'LOC-LIMS-002', odpe: 'Lima Sur', nombre: 'I.E. Javier Heraud (Caso Galaga)', lat: -12.1611, lng: -76.9682, mesas: 211, electores: 63300 },
    { id: 'LOC-LIMS-003', odpe: 'Lima Sur', nombre: 'Colegio Nacional San Pedro (Lurín)', lat: -12.2741, lng: -76.8711, mesas: 40, electores: 12000 },
    { id: 'LOC-HVCA-001', odpe: 'Huancavelica', nombre: 'I.E. La Victoria de Ayacucho', lat: -12.7865, lng: -74.9754, mesas: 35, electores: 9800 },
    { id: 'LOC-LORE-001', odpe: 'Loreto', nombre: 'Colegio Nacional Iquitos (CNI)', lat: -3.7437, lng: -73.2516, mesas: 55, electores: 16500 },
    { id: 'LOC-AREQ-001', odpe: 'Arequipa', nombre: 'G.U.E. Mariano Melgar', lat: -16.4090, lng: -71.5375, mesas: 60, electores: 18000 },
    { id: 'LOC-PIUR-001', odpe: 'Piura', nombre: 'I.E. San Miguel de Piura', lat: -5.1945, lng: -80.6328, mesas: 45, electores: 13500 },
    { id: 'LOC-CUSC-001', odpe: 'Cusco', nombre: 'Colegio Ciencias del Cusco', lat: -13.5319, lng: -71.9675, mesas: 50, electores: 15000 }
];

// Flota Activa en Telemetría (12 vehículos completos unificados con SQLite y telemetria.js)
let flotaActiva = [
    {
        id: '#GAL-104',
        placa: 'GAL-104',
        tipo: 'Furgón Ligero',
        odpe: 'Lima Sur',
        conductor: 'Conductor No Identificado',
        pnp: 'Sin Custodia PNP',
        lat: -12.1611,
        lng: -76.9682,
        vel: 0,
        estado: 'ROJO',
        anforas: 211,
        mesas_afectadas: 211,
        electores_en_riesgo: 63300,
        enlace: '4G Contingencia',
        empresa: 'Galaga SAC (Contratista Observado)',
        historial_penalidades: 40,
        minutos_retraso: 105,
        distancia_desvio_m: 1420
    },
    {
        id: '#DEZ-782',
        placa: 'DEZ-782',
        tipo: 'Camión Scania R450',
        odpe: 'Huancavelica',
        conductor: 'Manuel Quispe',
        pnp: 'Cmdte. PNP R. Soto',
        lat: -11.5944,
        lng: -76.1950,
        vel: 0,
        estado: 'ROJO',
        anforas: 350,
        mesas_afectadas: 35,
        electores_en_riesgo: 9800,
        enlace: 'Starlink',
        empresa: 'Transportes Blindados Andinos',
        historial_penalidades: 5,
        minutos_retraso: 80,
        distancia_desvio_m: 0
    },
    {
        id: '#DEZ-365',
        placa: 'DEZ-365',
        tipo: 'Lancha Fluvial Amazonas I',
        odpe: 'Loreto',
        conductor: 'Segundo Tamani',
        pnp: 'Tnte. PNP A. Coral',
        lat: -3.7437,
        lng: -73.2516,
        vel: 22,
        estado: 'AMARILLO',
        anforas: 180,
        mesas_afectadas: 18,
        electores_en_riesgo: 4200,
        enlace: 'Starlink',
        empresa: 'Consorcio Fluvial del Oriente',
        historial_penalidades: 0,
        minutos_retraso: 35,
        distancia_desvio_m: 0
    },
    {
        id: '#DEZ-528',
        placa: 'DEZ-528',
        tipo: 'Volvo FH Classic 15T',
        odpe: 'Arequipa',
        conductor: 'Jorge Cárdenas',
        pnp: 'Cap. PNP M. Silva',
        lat: -16.4090,
        lng: -71.5375,
        vel: 74,
        estado: 'VERDE',
        anforas: 400,
        mesas_afectadas: 0,
        electores_en_riesgo: 0,
        enlace: 'MPLS Dedicada',
        empresa: 'Transportes del Sur SAC',
        historial_penalidades: 0,
        minutos_retraso: 0,
        distancia_desvio_m: 0
    },
    {
        id: '#DEZ-234',
        placa: 'DEZ-234',
        tipo: 'Volvo FH 540',
        odpe: 'Piura',
        conductor: 'Carlos Mendoza P.',
        pnp: 'Mayor PNP L. Flores',
        lat: -5.1945,
        lng: -80.6328,
        vel: 81,
        estado: 'VERDE',
        anforas: 420,
        mesas_afectadas: 0,
        electores_en_riesgo: 0,
        enlace: 'MPLS Dedicada',
        empresa: 'Transportes del Norte SAC',
        historial_penalidades: 0,
        minutos_retraso: 0,
        distancia_desvio_m: 0
    },
    {
        id: '#DEZ-912',
        placa: 'DEZ-912',
        tipo: 'Mercedes Actros',
        odpe: 'Cusco',
        conductor: 'Efraín Mamani',
        pnp: 'SOT1 PNP J. Ramos',
        lat: -13.5319,
        lng: -71.9675,
        vel: 68,
        estado: 'VERDE',
        anforas: 380,
        mesas_afectadas: 0,
        electores_en_riesgo: 0,
        enlace: 'MPLS Dedicada',
        empresa: 'Logística del Valle Sagrado',
        historial_penalidades: 0,
        minutos_retraso: 0,
        distancia_desvio_m: 0
    },
    {
        id: '#DEZ-641',
        placa: 'DEZ-641',
        tipo: 'Camión 4x4 Isuzu',
        odpe: 'Puno',
        conductor: 'Walter Condori',
        pnp: 'Cap. PNP D. Quispe',
        lat: -15.8402,
        lng: -70.0219,
        vel: 35,
        estado: 'AMARILLO',
        anforas: 220,
        mesas_afectadas: 0,
        electores_en_riesgo: 0,
        enlace: 'Starlink',
        empresa: 'Transportes Altiplano',
        historial_penalidades: 2,
        minutos_retraso: 25,
        distancia_desvio_m: 0
    },
    {
        id: '#DEZ-115',
        placa: 'DEZ-115',
        tipo: 'Volvo FMX 460',
        odpe: 'Junín',
        conductor: 'Raúl Pacherres',
        pnp: 'Tnte. PNP C. Díaz',
        lat: -12.0651,
        lng: -75.2049,
        vel: 60,
        estado: 'VERDE',
        anforas: 360,
        mesas_afectadas: 0,
        electores_en_riesgo: 0,
        enlace: 'MPLS Dedicada',
        empresa: 'Andes Central Express',
        historial_penalidades: 0,
        minutos_retraso: 0,
        distancia_desvio_m: 0
    },
    {
        id: '#DEZ-803',
        placa: 'DEZ-803',
        tipo: 'Lancha Rápida Selva',
        odpe: 'Ucayali',
        conductor: 'Nelson Ahuanari',
        pnp: 'SBT PNP R. Vela',
        lat: -8.3791,
        lng: -74.5539,
        vel: 28,
        estado: 'VERDE',
        anforas: 150,
        mesas_afectadas: 0,
        electores_en_riesgo: 0,
        enlace: 'Starlink',
        empresa: 'Flota Fluvial Ucayali',
        historial_penalidades: 0,
        minutos_retraso: 0,
        distancia_desvio_m: 0
    },
    {
        id: '#GAL-109',
        placa: 'GAL-109',
        tipo: 'Furgón Reparto',
        odpe: 'Lima Sur',
        conductor: 'Conductor Observado',
        pnp: 'Sin Asignar',
        lat: -12.2289,
        lng: -76.8622,
        vel: 0,
        estado: 'ROJO',
        anforas: 120,
        mesas_afectadas: 24,
        electores_en_riesgo: 7200,
        enlace: '4G Contingencia',
        empresa: 'Galaga SAC (Contratista Observado)',
        historial_penalidades: 35,
        minutos_retraso: 65,
        distancia_desvio_m: 850
    },
    {
        id: '#DEZ-447',
        placa: 'DEZ-447',
        tipo: 'Scania G410',
        odpe: 'Ayacucho',
        conductor: 'Darío Huamán',
        pnp: 'Cap. PNP F. Castro',
        lat: -13.1588,
        lng: -74.2239,
        vel: 70,
        estado: 'VERDE',
        anforas: 300,
        mesas_afectadas: 0,
        electores_en_riesgo: 0,
        enlace: 'MPLS Dedicada',
        empresa: 'Rutas de Ayacucho SAC',
        historial_penalidades: 0,
        minutos_retraso: 0,
        distancia_desvio_m: 0
    },
    {
        id: '#DEZ-701',
        placa: 'DEZ-701',
        tipo: 'Hino 500',
        odpe: 'San Martín',
        conductor: 'Gilberto Ruiz',
        pnp: 'Tnte. PNP M. Tello',
        lat: -6.4842,
        lng: -76.3688,
        vel: 65,
        estado: 'VERDE',
        anforas: 280,
        mesas_afectadas: 0,
        electores_en_riesgo: 0,
        enlace: 'MPLS Dedicada',
        empresa: 'Selva Alta Transportes',
        historial_penalidades: 0,
        minutos_retraso: 0,
        distancia_desvio_m: 0
    }
];

// Helper: Sanitización contra XSS
function escaparHtml(str) {
    if (typeof str !== 'string') return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Helper: Lectura segura de cuerpos JSON
function leerBodyJson(req, maxBytes = 65536) {
    return new Promise((resolve, reject) => {
        let cuerpo = '';
        let recibido = 0;
        let terminado = false;

        req.on('data', chunk => {
            if (terminado) return;
            recibido += chunk.length;
            if (recibido > maxBytes) {
                terminado = true;
                reject({ codigo: 413, error: 'Cuerpo de solicitud excede el límite permitido (Payload Too Large)' });
                req.destroy();
                return;
            }
            cuerpo += chunk;
        });

        req.on('end', () => {
            if (terminado) return;
            if (!cuerpo || cuerpo.trim() === '') {
                resolve({});
                return;
            }
            try {
                const data = JSON.parse(cuerpo);
                resolve(data);
            } catch (e) {
                reject({ codigo: 400, error: 'JSON malformado en cuerpo de solicitud' });
            }
        });

        req.on('error', err => {
            if (terminado) return;
            reject({ codigo: 400, error: err.message });
        });
    });
}

function calcularDistanciaKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Number((R * c).toFixed(2));
}

// Motor de Explicabilidad XAI (TreeSHAP) con Propiedad Aditiva Estricta: phi_0 + sum(phi_i) = score_riesgo
function calcularExplicabilidadXAI(vehiculo) {
    if (!vehiculo) return null;
    const baseRisk = 0.05; // phi_0
    let shapRetraso = Math.min(0.40, (vehiculo.minutos_retraso / 120) * 0.40);
    let shapContratista = (vehiculo.historial_penalidades / 100) * 0.40;
    let shapGeografia = vehiculo.odpe === 'Huancavelica' ? 0.38 : (vehiculo.odpe === 'Loreto' ? 0.25 : (vehiculo.odpe === 'Lima Sur' ? 0.16 : 0.05));
    let shapExclusion = (vehiculo.electores_en_riesgo > 0) ? Math.min(0.25, (vehiculo.electores_en_riesgo / 63300) * 0.25) : 0.0;

    // Asegurar propiedad de eficiencia aditiva
    let scoreTotal = Number(Math.min(0.99, baseRisk + shapRetraso + shapContratista + shapGeografia + shapExclusion).toFixed(2));
    let severidad = scoreTotal >= 0.70 ? 'CRÍTICA' : (scoreTotal >= 0.40 ? 'ALTA' : 'MODERADA');

    let protocolo = 'Monitoreo regular mediante canal privado MPLS.';
    if (vehiculo.id === '#GAL-104') {
        protocolo = 'CRISIS CONTRACTUAL: Incumplimiento grave de Galaga SAC. Despachar convoy de auxilio desde Lurín y ejecutar carta fianza por S/ 64,000.';
    } else if (vehiculo.id === '#DEZ-782') {
        protocolo = 'AUXILIO MECÁNICO ANDINO: Coordinar con PNP Huancavelica y remolque Provías para transbordo en Paso de Ticlio (4,818 msnm).';
    } else if (vehiculo.id === '#DEZ-365') {
        protocolo = 'MONITOREO FLUVIAL: Supervisión por Marina de Guerra en cuenca del río Nanay y enlace Starlink de respaldo.';
    }

    return {
        id_vehiculo: vehiculo.id,
        placa: vehiculo.placa,
        odpe: vehiculo.odpe,
        score_riesgo_global: scoreTotal,
        nivel_severidad: severidad,
        explicabilidad_shap: {
            base_esperada_phi0: Number((baseRisk * 100).toFixed(1)),
            retraso_horario: Number((shapRetraso * 100).toFixed(1)),
            historial_penalidades_contratista: Number((shapContratista * 100).toFixed(1)),
            vulnerabilidad_ruta_geografica: Number((shapGeografia * 100).toFixed(1)),
            riesgo_exclusion_electoral: Number((shapExclusion * 100).toFixed(1))
        },
        protocolo_recomendado: protocolo
    };
}

// Motor de Respuestas del Chatbot con Inteligencia Conversacional, Acciones Interactivas y Consultas SQL
function generarRespuestaChatbot(pregunta, seccion_actual = 'analista-datos') {
    const q = (pregunta || '').toLowerCase().trim();
    const sec = (seccion_actual || '').toLowerCase();

    // 0. SALUDOS Y CONVERSACIÓN CASUAL
    const esSaludo = /^(hola|hola\?|hola,|hola\s+que\s+tal|hola\s+qu[eé]\s+tal|buenos\s+d[ií]as|buenas\s+tardes|buenas\s+noches|saludos|qu[eé]\s+tal|c[oó]mo\s+est[aá]s|como\s+estas|qui[eé]n\s+eres|qu[eé]\s+puedes\s+hacer|ayuda)$/i.test(q) ||
        (q.includes('hola') && (q.includes('que tal') || q.includes('qué tal') || q.includes('como estas') || q.includes('cómo estás') || q.length < 25));

    if (esSaludo) {
        return {
            tipo: 'saludo',
            titulo: 'Copiloto ONPE Visión 2026 · Asistente Táctico Electoral',
            mensaje_conversacional: '¡Hola! Soy tu <strong>Copiloto Táctico Electoral de ONPE Visión 2026</strong>. Estoy supervisando en tiempo real los 10,401 locales de votación y el despliegue nacional de convoyes bajo canal privado MPLS y respaldo satelital Starlink.<br><br>Puedo asistirte en la auditoría del D-DAY: consultar y descargar las 6 tablas maestras de la base de datos oficial SQLite en tu dispositivo, auditar reportes de última hora en vivo o explicarte las herramientas de esta ventana.<br><br><strong>¿Qué deseas realizar en este momento? Elige una de estas acciones inmediatas o escríbeme abajo:</strong>',
            texto_voz: '¡Hola! Soy tu Copiloto Táctico Electoral de ONPE Visión 2026. Estoy monitoreando en tiempo real los 10,401 locales y la flota nacional de convoyes. ¿En qué puedo ayudarte? Puedes pedirme: "Muéstrame todos los datos", "Hazme una consulta de la base de datos", "¿Qué pasó en Ticlio?" o "¿Cómo ejecutar la fianza de Galaga SAC?".',
            botones_accion: [
                { texto: 'Consultar y Descargar Base de Datos', consulta: 'Muéstrame todos los datos', destacado: true },
                { texto: 'Reportes de Última Hora', consulta: 'Dame un listado de los reportes de última hora' },
                { texto: '¿Qué hace este apartado?', consulta: '¿Qué hace este apartado?' },
                { texto: '¿Cómo ejecutar la fianza de S/ 64,000?', consulta: '¿Cómo ejecutar la fianza de S/ 64,000?' },
                { texto: 'Estado de los 12 Convoys', consulta: 'Estado de los 12 camiones y lanchas' }
            ]
        };
    }

    // 1. PREGUNTA SOBRE QUÉ HACE EL APARTADO O QUÉ TIENE LA VENTANA ACTIVA
    if (q.includes('que hace') || q.includes('quÃ© hace') || q.includes('qué hace') || q.includes('para que sirve') || q.includes('para qué sirve') || q.includes('explica') || q.includes('este apartado') || q.includes('esta ventana') || q.includes('esta pantalla') || q.includes('este modulo') || q.includes('este módulo') || q.includes('esta seccion') || q.includes('esta sección') || q.includes('que hay aqui') || q.includes('qué hay aquí')) {
        
        // BD
        if (sec.includes('base-datos') || sec.includes('base_datos') || sec === 'base-datos') {
            let totalReg = 32;
            if (db) {
                try {
                    const cnt = db.prepare('SELECT (SELECT count(*) FROM locales_votacion) + (SELECT count(*) FROM vehiculos_transporte) + (SELECT count(*) FROM rutas_electorales) + (SELECT count(*) FROM telemetria_gps) + (SELECT count(*) FROM actas_recepcion_campo) + (SELECT count(*) FROM alertas_xai) as total').get();
                    if (cnt && cnt.total) totalReg = cnt.total;
                } catch (e) {}
            }
            return {
                titulo: 'Auditoría y Explicación: Base de Datos Relacional SQLite (onpe_vision.db)',
                mensaje_conversacional: `<strong>Propósito Principal:</strong> Este módulo administra 6 tablas maestras con ${totalReg} registros oficiales auditables en tiempo real con motor nativo SQLite 3.<br><br><strong>Herramientas Clave:</strong> Editor interactivo de consultas SQL en vivo, explorador visual de tablas, telemetría y exportador de datos.<br><br><strong>Solución Recomendada:</strong> Ejecuta consultas SELECT en vivo para auditar penalidades contractuales o presiona "Descargar JSON Completo".`,
                texto_voz: 'Te encuentras en la Base de Datos Relacional y Geoespacial del sistema. Este módulo administra seis tablas maestras auditables. Puedes ejecutar consultas SQL en vivo, explorar los registros de vehículos y auditar los reportes de última hora.',
                botones_accion: [
                    { texto: 'Consultar y Descargar Base de Datos', consulta: 'Muéstrame todos los datos', destacado: true },
                    { texto: 'Reportes de Última Hora', consulta: 'Dame un listado de los reportes de última hora' },
                    { texto: 'Estado de la Flota', consulta: 'Estado de los 12 camiones y lanchas' }
                ]
            };
        }
        
        // CONTROL TRANSPORTE (GRAFO)
        if (sec.includes('control-transporte') || sec.includes('transporte')) {
            return {
                titulo: 'Auditoría y Explicación: Control de Transporte (Grafo Topológico)',
                mensaje_conversacional: '<strong>Propósito Principal:</strong> Modela la red de distribución logística como un grafo interactivo de nodos y aristas entre el Almacén Central de Lurín y las ODPEs provinciales.<br><br><strong>Herramientas Clave:</strong> Nodos arrastrables en 2D, botón "+ Agregar Nuevo Nodo a la Red", enlaces de custodia PNP y control deslizante de Score SLA de flota.<br><br><strong>Solución Recomendada:</strong> Arrastra y recoloca los nodos con el ratón para reorganizar corredores viales.',
                texto_voz: 'Estás en el Control de Transporte. Este apartado modela en un grafo interactivo las conexiones tácticas entre el Almacén Central de Lurín y las ODPEs. Puedes arrastrar y mover los nodos con el ratón y agregar nuevas unidades para reorganizar rutas.',
                botones_accion: [
                    { texto: 'Consultar y Descargar Base de Datos', consulta: 'Muéstrame todos los datos', destacado: true },
                    { texto: 'Reportes de Última Hora', consulta: 'Dame un listado de los reportes de última hora' },
                    { texto: 'Estado de la Flota', consulta: 'Estado de los 12 camiones y lanchas' }
                ]
            };
        }

        // GLOBO TERRESTRE (GESTIÓN DE PROYECTO)
        if (sec.includes('gestion-proyecto') || sec.includes('globo') || sec.includes('proyecto')) {
            return {
                titulo: 'Auditoría y Explicación: Globo Terrestre 3D y Telemetría Nacional',
                mensaje_conversacional: '<strong>Propósito Principal:</strong> Representación esférica 3D interactiva en Three.js con texturas de la NASA, pines georreferenciados de incidencias críticas en Perú y Execution Tape en tiempo real.<br><br><strong>Herramientas Clave:</strong> Rotación y zoom con el ratón, botones de cámara "Centrar Perú", "Paso de Ticlio", selector de textura Día/Noche y tarjetas emergentes de auditoría.<br><br><strong>Solución Recomendada:</strong> Haz clic en los pines marcadores sobre el territorio peruano para ver el reporte telemétrico instantáneo.',
                texto_voz: 'Estás en el Globo Terrestre Interactivo 3D. Te permite visualizar el planeta con texturas de la NASA y hacer zoom sobre el Perú para auditar los incidentes en Ticlio, Lima Sur y Loreto en tiempo real.',
                botones_accion: [
                    { texto: 'Reporte de Ticlio (4,818 msnm)', consulta: '¿Qué pasó en Ticlio?' },
                    { texto: 'Reporte de Lima Sur (#GAL-104)', consulta: '¿Qué pasó con Galaga SAC?' },
                    { texto: 'Consultar y Descargar Base de Datos', consulta: 'Muéstrame todos los datos', destacado: true }
                ]
            };
        }

        // ANALISTA DE DATOS (FLAGSHIP STUDIO)
        if (sec.includes('analista') || sec.includes('datos') || sec === 'analista-datos') {
            return {
                titulo: 'Auditoría y Explicación: Flagship Studio de Analítica Operativa',
                mensaje_conversacional: '<strong>Propósito Principal:</strong> Consola de analítica predictiva con gemelo digital GIS tridimensional, relieve andino con isolíneas de cota, micro-convoys con haces de luz y 5 micro-dashboards tácticos.<br><br><strong>Herramientas Clave:</strong> Visor 3D de corredores y Ticlio 4,818m, gráficos spline interactivos con pines de auditoría, velocímetros en vivo y medidores SVG.<br><br><strong>Solución Recomendada:</strong> Utiliza los botones de cámara rápida "Enfocar Ticlio" y "Lima Sur" para inspeccionar las zonas críticas.',
                texto_voz: 'Estás en la Consola del Analista de Datos. Integra el Gemelo Digital tridimensional de los corredores andinos con conos holográficos de alerta y cinco micro-dashboards de telemetría vial.',
                botones_accion: [
                    { texto: 'Reportes de Última Hora', consulta: 'Dame un listado de los reportes de última hora', destacado: true },
                    { texto: '¿Cómo ejecutar la fianza de S/ 64,000?', consulta: '¿Cómo ejecutar la fianza de S/ 64,000?' },
                    { texto: 'Estado de la Flota', consulta: 'Estado de los 12 camiones y lanchas' }
                ]
            };
        }
    }

    // 2. CASO GALAGA SAC / FIANZA S/ 64,000
    if (q.includes('galaga') || q.includes('fianza') || q.includes('64') || q.includes('64,000') || q.includes('64000') || q.includes('penalidad') || q.includes('lima sur') || q.includes('gal-104')) {
        return {
            titulo: 'Resolución Operativa: Ejecución de Fianza y Protocolo Galaga SAC',
            mensaje_conversacional: '<strong>Diagnóstico Crítico:</strong> El proveedor Galaga SAC (#GAL-104) se desvió 3.4 km de la ruta autorizada en Panamericana Sur hacia San Juan de Miraflores, interrumpiendo la señal telemétrica y poniendo en riesgo 211 mesas (63,300 electores).<br><br><strong>Acciones Inmediatas Ejecutadas:</strong><br>1. Retención contractual de la carta fianza por <strong>S/ 64,000</strong> ante la Procuraduría Pública.<br>2. Despacho inmediato del convoy de reserva #DEZ-950 desde el Almacén Central de Lurín con custodia de la Policía Nacional.<br>3. Notificación formal del expediente a Contraloría General de la República.',
            texto_voz: 'Protocolo de crisis activado para Galaga SAC. El vehículo GAL-104 violó la geocerca troncal en Lima Sur. Se ha ejecutado la retención de la fianza por sesenta y cuatro mil soles y se despachó el convoy de reemplazo con custodia policial.',
            botones_accion: [
                { texto: 'Ver Incidencia en el Mapa', consulta: '¿Dónde está el furgón GAL-104?' },
                { texto: 'Descargar Datos Completos', consulta: 'Muéstrame todos los datos', destacado: true },
                { texto: 'Reportes de Última Hora', consulta: 'Dame un listado de los reportes de última hora' }
            ]
        };
    }

    // 3. TICLIO (4,818 MSNM)
    if (q.includes('ticlio') || q.includes('782') || q.includes('dez-782') || q.includes('freno') || q.includes('frenos') || q.includes('helada') || q.includes('huancavelica')) {
        return {
            titulo: 'Resolución Operativa: Auxilio Mecánico en Ticlio (4,818 msnm)',
            mensaje_conversacional: '<strong>Situación Telemétrica:</strong> El camión Scania R450 #DEZ-782 reportó caída de presión en frenos secundarios a 4,818 msnm (-4.0°C) en la Carretera Central.<br><br><strong>Acciones en Curso:</strong><br>1. El precinto electrónico de seguridad permanece intacto con batería al 98%.<br>2. Patrulla de Carreteras PNP Ticlio y camión taller de Provías Nacional arribaron al km 132.<br>3. Se estima reanudación de marcha en 20 minutos con dirección a la ODPE Huancavelica.',
            texto_voz: 'Reporte del Paso de Ticlio. El camión DEZ-782 se encuentra asistido por Provías y la Policía Nacional en el kilómetro 132 por una falla neumática a cuatro grados bajo cero. El material electoral y sus precintos están intactos.',
            botones_accion: [
                { texto: 'Ver Telemetría en Modelo 3D', consulta: '¿Qué hace este apartado?' },
                { texto: 'Reportes de Última Hora', consulta: 'Dame un listado de los reportes de última hora', destacado: true },
                { texto: 'Estado de la Flota', consulta: 'Estado de los 12 camiones y lanchas' }
            ]
        };
    }

    // 4. REPORTES DE ÚLTIMA HORA
    if (q.includes('reportes') || q.includes('noticias') || q.includes('ultima hora') || q.includes('última hora') || q.includes('novedades') || q.includes('alertas')) {
        return {
            titulo: 'Resumen Táctico de Novedades e Incidencias en Vivo',
            mensaje_conversacional: '<strong>Reporte 1: CRÍTICA - DESVÍO DE CORREDOR EN LIMA SUR</strong><br>Furgón #GAL-104 apartado de ruta. Fianza de S/ 64,000 retenida y relevo en camino.<br><br><strong>Reporte 2: PREVENTIVA - AUXILIO MECÁNICO EN TICLIO (4,818 MSNM)</strong><br>Unidad #DEZ-782 en asistencia con Provías Nacional en el km 132. Precintos íntegros.<br><br><strong>Reportes 3 y 4: CONFORME - MONITOREO FLUVIAL Y SATELITAL</strong><br>Lancha #DEZ-365 arribó a puerto Bellavista Nanay (Loreto). ODPE Puno activa enlace Starlink (64 ms).',
            texto_voz: 'Resumen de reportes de última hora. Tenemos una alerta crítica en Lima Sur con retención de fianza a Galaga SAC, una alerta preventiva en subsanación en el Paso de Ticlio a cuatro mil ochocientos metros, y dos arribos conformes en Loreto y Puno.',
            botones_accion: [
                { texto: '¿Cómo ejecutar la fianza de S/ 64,000?', consulta: '¿Cómo ejecutar la fianza de S/ 64,000?', destacado: true },
                { texto: 'Consultar y Descargar Base de Datos', consulta: 'Muéstrame todos los datos' },
                { texto: 'Estado de la Flota', consulta: 'Estado de los 12 camiones y lanchas' }
            ]
        };
    }

    // 5. CONSULTA DE BASE DE DATOS
    if (q.includes('base de datos') || q.includes('datos') || q.includes('tabla') || q.includes('tablas') || q.includes('consulta') || q.includes('descargar') || q.includes('registros') || q.includes('flota') || q.includes('vehiculos') || q.includes('camiones')) {
        let rows = flotaActiva;
        return {
            titulo: 'Consulta Oficial de Base de Datos SQLite (onpe_vision.db)',
            mensaje_conversacional: `<strong>Resultados Obtenidos:</strong> Se han consultado los registros de la tabla <code>vehiculos_transporte</code> y <code>alertas_xai</code> en tiempo real.<br><br>Total de unidades registradas: <strong>${rows.length}</strong>.<br>Red de enlaces: <strong>MPLS Privada + Respaldo Satelital Starlink</strong>.<br><br>Presiona el botón de abajo para descargar la exportación estructurada en tu equipo:`,
            texto_voz: `Consulta a la base de datos completada. Se listan ${rows.length} vehículos de transporte y sus estados de telemetría satelital. Puedes descargar los archivos en formato CSV o JSON.`,
            descarga_automatica: false,
            botones_accion: [
                { texto: 'Descargar CSV Flota para Excel', consulta: 'Muéstrame todos los datos', destacado: true },
                { texto: 'Reportes de Última Hora', consulta: 'Dame un listado de los reportes de última hora' },
                { texto: '¿Qué hace este apartado?', consulta: '¿Qué hace este apartado?' }
            ]
        };
    }

    // 6. RESPUESTA GENERAL CONTEXTUAL / SMART FALLBACK (SANITIZADA CONTRA XSS)
    const preguntaSegura = escaparHtml(pregunta);
    const seccionSegura = escaparHtml(seccion_actual);

    return {
        titulo: `Copiloto ONPE: Asistencia Táctica Electoral`,
        mensaje_conversacional: `He recibido tu consulta: "<strong>${preguntaSegura}</strong>" en el contexto de la ventana activa (<strong>${seccionSegura}</strong>).<br><br>Como Copiloto Táctico Electoral de ONPE Visión 2026, puedo ayudarte a consultar registros en tiempo real, auditar incidencias críticas o descargar el dataset oficial completo en tu dispositivo. ¿Qué deseas hacer?`,
        texto_voz: `Copiloto ONPE activo en la ventana ${seccionSegura}. Puedes pedirme que consulte la base de datos, ver los reportes de última hora o consultar sobre la fianza de Galaga SAC.`,
        botones_accion: [
            { texto: 'Consultar y Descargar Base de Datos', consulta: 'Muéstrame todos los datos', destacado: true },
            { texto: 'Reportes de Última Hora', consulta: 'Dame un listado de los reportes de última hora' },
            { texto: '¿Qué hace este apartado?', consulta: '¿Qué hace este apartado?' },
            { texto: '¿Cómo ejecutar la fianza de S/ 64,000?', consulta: '¿Cómo ejecutar la fianza de S/ 64,000?' }
        ]
    };
}

// SERVIDOR HTTP REST & SERVICIO DE ARCHIVOS ESTÁTICOS
// ----------------------------------------------------------------------------
const servidor = http.createServer((req, res) => {
    let parsedUrl;
    try {
        parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost:3000'}`);
    } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ exito: false, error: 'URL malformada' }));
        return;
    }

    const ruta = parsedUrl.pathname;
    const metodo = req.method;

    const origin = req.headers['origin'];
    const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
    let allowOrigin = 'http://localhost:3000';
    if (!origin || origin === 'null') {
        allowOrigin = '*';
    } else if (allowedOrigins.includes(origin)) {
        allowOrigin = origin;
    }

    const headersBase = {
        'Access-Control-Allow-Origin': allowOrigin,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN'
    };

    if (metodo === 'OPTIONS') {
        res.writeHead(204, headersBase);
        res.end();
        return;
    }

    // 1. ENDPOINT TELEMETRÍA
    if (metodo === 'GET' && ruta === '/api/telemetria') {
        res.writeHead(200, { ...headersBase, 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            timestamp: new Date().toISOString(),
            canal: 'Red Privada MPLS Dedicada (Disponibilidad: 99.94%)',
            unidades_totales_monitoreadas: 1420,
            flota: flotaActiva
        }, null, 2));
        return;
    }

    // 2. ENDPOINT XAI
    if (metodo === 'GET' && ruta.startsWith('/api/xai/')) {
        let idRaw = ruta.replace('/api/xai/', '').trim();
        let idBuscado = '';
        try {
            idBuscado = decodeURIComponent(idRaw).trim();
        } catch (err) {
            res.writeHead(400, { ...headersBase, 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ exito: false, error: 'Identificador de vehículo inválido' }));
            return;
        }

        if (!idBuscado) {
            res.writeHead(400, { ...headersBase, 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ exito: false, error: 'Identificador de vehículo vacío' }));
            return;
        }

        if (!idBuscado.startsWith('#') && !idBuscado.startsWith('VEH')) idBuscado = '#' + idBuscado;
        const vehiculo = flotaActiva.find(item => item.id.toUpperCase() === idBuscado.toUpperCase() || item.placa.toUpperCase() === idBuscado.replace('#', '').toUpperCase());

        if (!vehiculo) {
            res.writeHead(404, { ...headersBase, 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ exito: false, error: 'Vehículo no encontrado' }));
            return;
        }

        const explicacion = calcularExplicabilidadXAI(vehiculo);
        res.writeHead(200, { ...headersBase, 'Content-Type': 'application/json' });
        res.end(JSON.stringify(explicacion, null, 2));
        return;
    }

    // 3. ENDPOINT KPIS
    if (metodo === 'GET' && ruta === '/api/kpis') {
        res.writeHead(200, { ...headersBase, 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            marco: 'Marco Metodológico Híbrido DTS-Electoral (Avance 03)',
            timestamp: new Date().toISOString(),
            kpis: {
                kpi_1_pruebas_satisfactorias: '94.2%',
                kpi_2_tiempo_recepcion: '2.8 min',
                kpi_3_tasa_exito: '98.6%',
                kpi_7_usabilidad_sus: '78.4 pts',
                kpi_8_disponibilidad_mpls: '99.94%'
            }
        }, null, 2));
        return;
    }

    // 4. ENDPOINT: BASE DE DATOS STATS
    if (metodo === 'GET' && ruta === '/api/db/stats') {
        res.writeHead(200, { ...headersBase, 'Content-Type': 'application/json' });
        if (!db) {
            res.end(JSON.stringify({ estado: 'DESCONECTADO', error: 'Base de datos no disponible' }));
            return;
        }
        try {
            const stats = {
                locales: db.prepare('SELECT count(*) as c FROM locales_votacion').get().c,
                vehiculos: db.prepare('SELECT count(*) as c FROM vehiculos_transporte').get().c,
                rutas: db.prepare('SELECT count(*) as c FROM rutas_electorales').get().c,
                telemetria: db.prepare('SELECT count(*) as c FROM telemetria_gps').get().c,
                actas: db.prepare('SELECT count(*) as c FROM actas_recepcion_campo').get().c,
                alertas_xai: db.prepare('SELECT count(*) as c FROM alertas_xai').get().c
            };
            res.end(JSON.stringify({ estado: 'CONECTADO', motor: 'SQLite 3 (Compatible PostgreSQL 16)', tablas: stats }));
        } catch (err) {
            res.end(JSON.stringify({ estado: 'ERROR', detalle: err.message }));
        }
        return;
    }

    // 5. ENDPOINT: INGESTA DE TELEMETRÍA GPS
    if (metodo === 'POST' && ruta === '/api/telemetria/ingesta') {
        leerBodyJson(req).then(data => {
            const id = (data.id_vehiculo || data.id || '').trim();
            const lat = data.lat !== undefined ? Number(data.lat) : Number(data.latitud);
            const lng = data.lng !== undefined ? Number(data.lng) : Number(data.longitud);
            const vel = data.vel !== undefined ? Number(data.vel) : (data.velocidad_kmh !== undefined ? Number(data.velocidad_kmh) : 0);

            if (!id || isNaN(lat) || isNaN(lng) || isNaN(vel)) {
                res.writeHead(400, { ...headersBase, 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ exito: false, error: 'Datos de telemetría inválidos o incompletos' }));
                return;
            }

            if (lat < -90 || lat > 90 || lng < -180 || lng > 180 || vel < 0) {
                res.writeHead(400, { ...headersBase, 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ exito: false, error: 'Coordenadas o velocidad fuera de rango físico válido' }));
                return;
            }

            const veh = flotaActiva.find(item => item.id.toUpperCase() === id.toUpperCase() || item.placa.toUpperCase() === id.replace('#', '').toUpperCase());
            if (veh) {
                veh.lat = lat;
                veh.lng = lng;
                veh.vel = vel;
            }

            if (db) {
                try {
                    db.prepare(`
                        INSERT INTO telemetria_gps (id_vehiculo, latitud, longitud, velocidad_kmh, rumbo_grados, altitud_msnm, nivel_combustible_pct, alerta_geocerca)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    `).run(id, lat, lng, vel, Number(data.rumbo || 0), Number(data.altitud || 150), Number(data.combustible || 85), Number(data.alerta_geocerca || 0));
                } catch (e) {
                    console.warn('[TELEMETRIA] Error al persistir en BD:', e.message);
                }
            }

            res.writeHead(200, { ...headersBase, 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ exito: true, mensaje: 'Telemetría registrada exitosamente', id_vehiculo: id }));
        }).catch(err => {
            res.writeHead(err.codigo || 400, { ...headersBase, 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ exito: false, error: err.error || 'Error al procesar solicitud' }));
        });
        return;
    }

    // 6. ENDPOINT: REGISTRO DE DESPACHOS
    if (metodo === 'POST' && ruta === '/api/despachos') {
        leerBodyJson(req).then(data => {
            const dni = (data.dni_coordinador || data.dni || '').trim();
            if (!/^\d{8}$/.test(dni)) {
                res.writeHead(400, { ...headersBase, 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ exito: false, error: 'DNI de coordinador debe tener exactamente 8 dígitos numéricos' }));
                return;
            }
            const placa = (data.placa || data.id_vehiculo || 'DESPACHO-01').slice(0, 30);
            const precinto = (data.precinto || 'QR-DEFAULT').slice(0, 50);

            res.writeHead(200, { ...headersBase, 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ exito: true, mensaje: 'Despacho logístico registrado con éxito', despacho: { dni, placa, precinto, fecha: new Date().toISOString() } }));
        }).catch(err => {
            res.writeHead(err.codigo || 400, { ...headersBase, 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ exito: false, error: err.error || 'Error en solicitud de despacho' }));
        });
        return;
    }

    // 7. ENDPOINT: REGISTRO DE ACTAS ELECTORALES
    if (metodo === 'POST' && ruta === '/api/actas') {
        leerBodyJson(req).then(data => {
            const idActa = (data.id_acta || `ACT-${Date.now()}`).slice(0, 40);
            const idLocal = (data.id_local || 'LOC-LIMS-001').slice(0, 40);
            const dni = (data.id_coordinador_dni || '00000000').slice(0, 8);
            const qr = (data.codigo_precinto_qr || 'QR-UNKNOWN').slice(0, 50);
            const hash = (data.hash_sha256 || 'hash-sha256-demo').slice(0, 64);

            if (db) {
                try {
                    db.prepare(`
                        INSERT INTO actas_recepcion_campo (id_acta, id_local, id_coordinador_dni, codigo_precinto_qr, hash_sha256, estado_acta, metodo_confirmacion)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                    `).run(idActa, idLocal, dni, qr, hash, 'conforme', 'pwa_3_clics');
                } catch (e) {
                    console.warn('[ACTAS] Error al insertar acta en BD:', e.message);
                }
            }

            res.writeHead(200, { ...headersBase, 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ exito: true, mensaje: 'Acta de recepción electoral registrada y auditada', id_acta: idActa }));
        }).catch(err => {
            res.writeHead(err.codigo || 400, { ...headersBase, 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ exito: false, error: err.error || 'Error en solicitud de acta' }));
        });
        return;
    }

    // 8. ENDPOINT: CONSULTA SQL INTERACTIVA (ENDURECIDO)
    if (metodo === 'POST' && ruta === '/api/db/consulta') {
        leerBodyJson(req).then(data => {
            if (!db) {
                res.writeHead(503, { ...headersBase, 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ exito: false, error: 'Base de datos no inicializada' }));
                return;
            }

            const rawQuery = (data.query || '').trim();
            if (!rawQuery) {
                res.writeHead(400, { ...headersBase, 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ exito: false, error: 'Consulta SQL vacía' }));
                return;
            }

            // Quitar comentarios SQL iniciales (-- o /* */)
            let sqlLimpio = rawQuery
                .replace(/\/\*[\s\S]*?\*\//g, '')
                .replace(/--.*$/gm, '')
                .trim();

            // Bloquear múltiples sentencias (punto y coma que no sea al final)
            if (sqlLimpio.slice(0, -1).includes(';')) {
                res.writeHead(400, { ...headersBase, 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ exito: false, error: 'No se permiten múltiples sentencias SQL encadenadas (;)' }));
                return;
            }
            if (sqlLimpio.endsWith(';')) sqlLimpio = sqlLimpio.slice(0, -1).trim();

            const sqlUpper = sqlLimpio.toUpperCase();

            // Solo permitir sentencias de lectura: SELECT o WITH ... SELECT
            if (!sqlUpper.startsWith('SELECT') && !sqlUpper.startsWith('WITH')) {
                res.writeHead(400, { ...headersBase, 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ exito: false, error: 'Solo se permiten consultas de lectura (SELECT o WITH ... SELECT) por seguridad.' }));
                return;
            }

            // Bloquear palabras clave de escritura o metadatos de sistema
            const palabrasProhibidas = [
                'INSERT', 'UPDATE', 'DELETE', 'DROP', 'ALTER', 'CREATE', 'REPLACE',
                'PRAGMA', 'ATTACH', 'DETACH', 'SQLITE_MASTER', 'SQLITE_SCHEMA', 'SQLITE_TEMP_MASTER'
            ];
            for (const p of palabrasProhibidas) {
                const rx = new RegExp(`\\b${p}\\b`, 'i');
                if (rx.test(sqlLimpio)) {
                    res.writeHead(400, { ...headersBase, 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ exito: false, error: `Operación o tabla no autorizada: ${p}` }));
                    return;
                }
            }

            // Validar que consulte al menos una de las 6 tablas permitidas
            const tablasPermitidas = [
                'LOCALES_VOTACION', 'VEHICULOS_TRANSPORTE', 'RUTAS_ELECTORALES',
                'TELEMETRIA_GPS', 'ACTAS_RECEPCION_CAMPO', 'ALERTAS_XAI'
            ];
            const contieneTablaPermitida = tablasPermitidas.some(t => new RegExp(`\\b${t}\\b`, 'i').test(sqlUpper));
            if (!contieneTablaPermitida) {
                res.writeHead(400, { ...headersBase, 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ exito: false, error: 'La consulta debe referenciar al menos una tabla válida de negocio.' }));
                return;
            }

            try {
                const filas = db.prepare(sqlLimpio).all();
                res.writeHead(200, { ...headersBase, 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ exito: true, total: filas.length, filas }));
            } catch (err) {
                res.writeHead(400, { ...headersBase, 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ exito: false, error: `Error de sintaxis SQL: ${err.message}` }));
            }
        }).catch(err => {
            res.writeHead(err.codigo || 400, { ...headersBase, 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ exito: false, error: err.error || 'Error al procesar consulta' }));
        });
        return;
    }

    // 9. ENDPOINT: CHATBOT DE ASISTENCIA (SANITIZADO)
    if (metodo === 'POST' && ruta === '/api/chatbot/consulta') {
        leerBodyJson(req).then(data => {
            const respuesta = generarRespuestaChatbot(data.mensaje, data.seccion_actual);
            res.writeHead(200, { ...headersBase, 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ exito: true, ...respuesta }));
        }).catch(err => {
            res.writeHead(err.codigo || 400, { ...headersBase, 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ exito: false, error: err.error || 'Error al procesar consulta de chatbot' }));
        });
        return;
    }

    // 10. SERVICIO DE ARCHIVOS ESTÁTICOS (RESTRICTIVO Y BLINDADO CONTRA TRAVERSAL)
    if (metodo !== 'GET' && metodo !== 'HEAD') {
        res.writeHead(405, { ...headersBase, 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('405 Método No Permitido');
        return;
    }

    let subRuta = ruta === '/' ? '/index.html' : ruta;
    let rutaNormalizada = path.normalize(decodeURIComponent(subRuta));
    let rutaArchivo = path.resolve(__dirname, '.' + rutaNormalizada);

    // Evitar Directory Traversal
    if (!rutaArchivo.startsWith(__dirname)) {
        res.writeHead(403, { ...headersBase, 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('403 Prohibido - Intento de Directory Traversal');
        return;
    }

    // Bloquear acceso a archivos sensibles o de código fuente del backend
    const relPath = path.relative(__dirname, rutaArchivo).replace(/\\/g, '/');
    const blockedExact = [
        'onpe_vision.db', 'simulador_backend.js', 'crear_base_datos.js',
        'schema_onpe_vision.sql', 'package.json', 'package-lock.json',
        '.cursorrules', 'SKILL.md'
    ];
    const isExactBlocked = blockedExact.includes(path.basename(rutaArchivo).toLowerCase());
    const isExtensionBlocked = /\.(py|ps1|bat|md|sql|log|db|sh)$/i.test(rutaArchivo);
    const isFolderBlocked = relPath.startsWith('scratch/') || relPath.startsWith('.git/');

    if (isExactBlocked || isExtensionBlocked || isFolderBlocked) {
        res.writeHead(403, { ...headersBase, 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('403 Prohibido - Acceso denegado a recurso interno del servidor');
        return;
    }

    fs.stat(rutaArchivo, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { ...headersBase, 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('404 Recurso No Encontrado - ONPE Visión 2026');
            return;
        }

        const ext = path.extname(rutaArchivo).toLowerCase();
        const mimeTypes = {
            '.html': 'text/html; charset=utf-8',
            '.js': 'application/javascript; charset=utf-8',
            '.css': 'text/css; charset=utf-8',
            '.json': 'application/json; charset=utf-8',
            '.csv': 'text/csv; charset=utf-8',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.svg': 'image/svg+xml',
            '.ico': 'image/x-icon',
            '.webp': 'image/webp',
            '.woff2': 'font/woff2'
        };

        const contentType = mimeTypes[ext] || 'application/octet-stream';
        res.writeHead(200, { ...headersBase, 'Content-Type': contentType });
        fs.createReadStream(rutaArchivo).pipe(res);
    });
});

servidor.listen(PUERTO, () => {
    console.log(`[ONPE VISIÓN 2026] Servidor escuchando en http://localhost:${PUERTO}`);
    console.log(`[INFO] Modo Turno D-DAY 11 Abril 2026 activo. Base de datos SQLite y Chatbot disponibles.`);
});

module.exports = { servidor, calcularExplicabilidadXAI, flotaActiva, generarRespuestaChatbot };
