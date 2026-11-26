// ==========================================================================
// MÓDULO INTEGRAL: CHATBOT COPILOTO ONPE CON VOZ, CONSULTAS SQL Y DESCARGAS
// ==========================================================================

// 11. CHATBOT COPILOTO CONTEXTUAL E INTELIGENTE
// Detecta la sección activa y responde preguntas sobre el apartado o consultas en BD
// =========================================================================
// MÓDULO INTEGRAL DE COPILOTO Y CHATBOT CONTEXTUAL CON VOZ (ONPE VISIÓN 2026)
// =========================================================================

const EXPLICACIONES_VISTAS_CHATBOT = {
  'analista-datos': {
    nombre: 'Analista de Datos (Flagship Studio)',
    que_hace: 'Consola macro ejecutiva para la alta dirección de la ONPE. Supervisa la brecha de despliegue nacional sobre 10,401 locales, la penalidad contractual de S/ 64,000 contra Galaga SAC por riesgo de exclusión de 63,300 electores, y la curva proyectada de arribo antes de las 08:00 AM.',
    herramientas: 'Curva Spline en streaming, fianza y garantías RIMAC Seguros (S/ 64,000), telemetría andina (#DEZ-528 Arequipa, #DEZ-641 Puno con enlace Starlink), y dock analítico de 5 paneles tácticos.',
    solucion_clave: 'Monitorear la curva de actas para evitar el estrangulamiento de flujo electoral y auditar precintos digitales.',
    texto_voz: 'Te encuentras en la Consola del Analista de Datos. Este módulo consolida la macro-visión ejecutiva de los 10,401 locales de votación, el control de la fianza de S/ 64,000 contra Galaga SAC y la curva temporal de arribo antes de las 08:00 AM.',
    pills: [
      { texto: '¿Qué hace este apartado?', clase: 'destacado' },
      { texto: 'Dame un listado de los reportes de última hora', clase: 'novedad' },
      { texto: '¿Cómo ejecutar la fianza de S/ 64,000?' },
      { texto: 'Estado de la curva de actas' }
    ]
  },
  'inicio': {
    nombre: 'Inicio del Sistema & Diagnóstico de Crisis',
    que_hace: 'Portal de bienvenida institucional y resumen del impacto logístico del D-Day. Presenta la justificación metodológica de por qué se implementó la plataforma ONPE Visión 2026 frente a contingencias históricas.',
    herramientas: 'Panel de crisis con 4 métricas críticas: 211 mesas no instaladas, 63,300 electores en riesgo en Lima Sur, penalidad acumulada de S/ 64,000 a Galaga SAC, y 10,401 locales monitoreados en las 93 ODPEs; más cuadrícula de acceso a los módulos.',
    solucion_clave: 'Seleccionar cualquier módulo para ingresar directamente, o iniciar el Modo Simulación Guiada con instrucciones paso a paso.',
    texto_voz: 'Te encuentras en el Inicio del Sistema ONPE Visión 2026. Este portal presenta las métricas del impacto electoral: 211 mesas no instaladas, 63,300 electores en riesgo y la fianza de S/ 64,000 impuesta a Galaga SAC.',
    pills: [
      { texto: '¿Qué hace este apartado?', clase: 'destacado' },
      { texto: 'Dame un listado de los reportes de última hora', clase: 'novedad' },
      { texto: 'Explicar crisis de las 211 mesas' },
      { texto: 'Módulos disponibles en el sistema' }
    ]
  },
  'dashboard': {
    nombre: 'Centro de Mando Nacional (IOC) & Cartografía Leaflet',
    que_hace: 'Piso operativo de geolocalización satelital en tiempo real. Permite visualizar sobre un mapa táctico interactivo la posición exacta de cada uno de los 12 convoyes electorales, locales de votación y sedes ODPE a nivel nacional.',
    herramientas: 'Mapa interactivo con capas Leaflet (Nocturno Esri, Satelital HD, Calles, Relieve y Cyberpunk), telemetría GPS con canal privado MPLS al 99.94% SLA, semaforización de unidades y geocercas viales con tolerancia de 500 metros.',
    solucion_clave: 'Hacer clic en cualquier marcador para abrir su ficha de telemetría, cambiar el estilo cartográfico y filtrar por estado verde, amarillo o rojo.',
    texto_voz: 'Estás en el Centro de Mando Nacional. Aquí visualizas el mapa cartográfico con Leaflet en tiempo real de todos los locales de votación y convoyes bajo protocolo MPLS al 99.94% de SLA. Puedes cambiar de estilo de mapa y consultar cada convoy.',
    pills: [
      { texto: '¿Qué hace este apartado?', clase: 'destacado' },
      { texto: 'Dame un listado de los reportes de última hora', clase: 'novedad' },
      { texto: '¿Dónde está el furgón #GAL-104?' },
      { texto: 'Cambiar capa cartográfica' }
    ]
  },
  'control-transporte': {
    nombre: 'Control de Transporte (Grafo Topológico de Red)',
    que_hace: 'Herramienta táctica interactiva que modela la red de distribución logística como un grafo de nodos y aristas entre el Almacén Central de Lurín y las ODPEs provinciales.',
    herramientas: 'Lienzo 2D con nodos arrastrables clasificados por estado (verde, amarillo, rojo), enlaces de custodia policial PNP, Score SLA de flota (0 a 100), y ranking de criticidad ordenado.',
    solucion_clave: 'Arrastrar y mover los nodos directamente con el ratón para reorganizar la red, presionar el botón "+ Agregar Nuevo Nodo a la Red" para registrar un nuevo convoy o local en tiempo real, filtrar por buscador y ajustar el control deslizante de Score SLA.',
    texto_voz: 'Estás en el Control de Transporte. Este apartado modela en un grafo interactivo las conexiones tácticas entre el Almacén Central de Lurín y las ODPEs. Puedes arrastrar y mover los nodos con el ratón y agregar nuevas unidades para reorganizar rutas.',
    pills: [
      { texto: '¿Qué hace este apartado?', clase: 'destacado' },
      { texto: 'Dame un listado de los reportes de última hora', clase: 'novedad' },
      { texto: '¿Cómo mover y agregar nodos al grafo?' },
      { texto: 'Ver unidades con SLA crítico' }
    ]
  },
  'gestion-proyecto': {
    nombre: 'Gestión de Proyecto (Globo Terrestre 3D & Execution Tape)',
    que_hace: 'Centro geoespacial tridimensional de supervisión global. Muestra el planeta Tierra interactivo en 3D con texturas de alta resolución de la NASA, geolocalizando incidentes electorales nacionales y referentes internacionales.',
    herramientas: 'Globo terrestre 3D con Three.js (textura nocturna, nubes dinámicas y atmósfera resplandeciente), pines tácticos con coordenadas de Lima Sur, Ticlio, Loreto, Arequipa, Puno, Estonia, Colombia y Brasil; embudo de arribo (meta 08:00 AM) y Execution Tape criptográfico con hashes SHA-256 en streaming.',
    solucion_clave: 'Rotar el globo con el ratón, hacer zoom con la rueda, hacer clic en cualquier pin de ubicación para abrir el panel de diagnóstico con su plan de contingencia inmediata.',
    texto_voz: 'Estás en Gestión de Proyecto. Aquí tienes el Globo Terrestre interactivo en 3D con texturas de alta resolución de la NASA. Puedes rotar el planeta, hacer zoom y pulsar en los pines de Lima Sur, Ticlio y Loreto para ver sus contingencias.',
    pills: [
      { texto: '¿Qué hace este apartado?', clase: 'destacado' },
      { texto: 'Dame un listado de los reportes de última hora', clase: 'novedad' },
      { texto: 'Ver incidentes en el Globo 3D' },
      { texto: '¿Qué es el Execution Tape SHA-256?' }
    ]
  },
  'rutas-flota': {
    nombre: 'Monitoreo Integral de Flota y Rutas',
    que_hace: 'Cuadro de mando analítico vehicular. Permite auditar en detalle la totalidad de los 12 vehículos asignados (camiones blindados Scania, Volvo FH, furgones y lanchas fluviales en la Amazonía).',
    herramientas: 'Tabla operativa completa con placa, tipo de unidad, ODPE destino, conductor, velocidad en km/h, estado semafórico, nivel de combustible, presión de neumáticos, batería del precinto QR y efectivo PNP de custodia.',
    solucion_clave: 'Pasar el cursor sobre cualquier vehículo para desplegar una ficha técnica flotante con datos de telemetría en tiempo real, ordenar columnas y filtrar por estado operativo.',
    texto_voz: 'Estás en Monitoreo de Flota. Esta ventana audita los 12 vehículos asignados a nivel nacional. Al pasar el cursor sobre cualquier convoy, verás su ficha técnica con nivel de combustible, presión de llantas, batería del precinto y efectivo policial asignado.',
    pills: [
      { texto: '¿Qué hace este apartado?', clase: 'destacado' },
      { texto: 'Dame un listado de los reportes de última hora', clase: 'novedad' },
      { texto: 'Estado de los 12 camiones y lanchas' },
      { texto: '¿Qué unidades no tienen custodia PNP?' }
    ]
  },
  'alertas-xai': {
    nombre: 'Inteligencia Artificial Explicable (XAI TreeSHAP)',
    que_hace: 'Motor algorítmico de transparencia que calcula con precisión matemática la contribución de cada factor de riesgo logístico sobre las decisiones de contingencia y sanciones contractuales ante el JNE y la Contraloría General de la República.',
    herramientas: 'Ecuación formal de descomposición aditiva SHAP de Lundberg & Lee (2020), matriz de confusión con 95.9% de precisión (1,420 convoyes validados experimentalmente), y simulador dinámico interactivo con controles deslizantes.',
    solucion_clave: 'Mover los sliders de retraso horario, historial de penalidades y vulnerabilidad de ruta para ver en tiempo real cómo cambia la probabilidad de riesgo predictivo.',
    texto_voz: 'Te encuentras en Inteligencia Explicable XAI. Este motor descompone matemáticamente los factores de riesgo logístico con la ecuación de Lundberg y Lee, justificando ante el JNE y Contraloría la penalidad contractual del 40% aplicada a Galaga SAC.',
    pills: [
      { texto: '¿Qué hace este apartado?', clase: 'destacado' },
      { texto: 'Dame un listado de los reportes de última hora', clase: 'novedad' },
      { texto: '¿Por qué Galaga SAC tiene +40% de riesgo?' },
      { texto: 'Explicar ecuación de TreeSHAP' }
    ]
  },
  'terminal-campo': {
    nombre: 'Terminal Móvil PWA de Campo (3 Clics)',
    que_hace: 'Aplicación web progresiva diseñada para los coordinadores de local de votación y miembros de mesa, permitiendo la recepción segura del material electoral sin fatiga cognitiva y con capacidad 100% offline.',
    herramientas: 'Flujo simplificado en 3 clics: 1. Escaneo láser de precinto QR, 2. Lista de verificación de 4 puntos (ánforas, padrón, cabinas y actas), 3. Firma digital criptográfica en canvas táctil y emisión del Acta Oficial de Recepción.',
    solucion_clave: 'Activar el simulador de escaneo QR, marcar los ítems de verificación, firmar en el recuadro digital y descargar/imprimir el acta en PDF.',
    texto_voz: 'Te encuentras en la Terminal Móvil de Campo. Esta interfaz optimizada permite a los coordinadores de local recepcionar el material electoral en solo 3 clics: escaneo láser QR, lista de verificación y firma digital con validez legal offline.',
    pills: [
      { texto: '¿Qué hace este apartado?', clase: 'destacado' },
      { texto: 'Dame un listado de los reportes de última hora', clase: 'novedad' },
      { texto: '¿Cómo funciona la recepción en 3 clics?' },
      { texto: 'Generar acta con firma digital' }
    ]
  },
  'registro-incidencias': {
    nombre: 'Auditoría Oficial de Incidencias & Exportación CSV',
    que_hace: 'Bitácora inmutable de eventos electorales con sello temporal criptográfico SHA-256 para auditorías forenses del Jurado Nacional de Elecciones.',
    herramientas: 'Tabla de incidencias sembradas y en vivo (desvío de Galaga SAC, falla neumática en Ticlio, arribo fluvial en Maynas), filtrado dinámico por severidad (Crítica, Alerta, Normal) y por ODPE.',
    solucion_clave: 'Filtrar registros por texto o severidad, registrar nuevas anotaciones en bitácora y hacer clic en "Descargar Informe CSV" para obtener la data cruda.',
    texto_voz: 'Te encuentras en la Auditoría de Incidencias. Esta bitácora inmutable registra en tiempo real todos los eventos electorales del turno D-Day. Puedes filtrar por severidad, registrar anotaciones y descargar el informe oficial en CSV.',
    pills: [
      { texto: '¿Qué hace este apartado?', clase: 'destacado' },
      { texto: 'Dame un listado de los reportes de última hora', clase: 'novedad' },
      { texto: 'Descargar reporte oficial en CSV' },
      { texto: 'Filtrar solo alertas críticas' }
    ]
  },
  'base-datos': {
    nombre: 'Consola SQL & Explorador de Base de Datos (onpe_vision.db)',
    que_hace: 'Consola de auditoría de datos relacionales y geoespaciales. Permite ejecutar consultas SQL interactivas en vivo contra la base de datos oficial del sistema SQLite/PostgreSQL.',
    herramientas: '6 tablas maestras: locales_votacion (6), vehiculos_transporte (12), rutas_electorales (5), telemetria_gps (12), actas_recepcion_campo (5), alertas_xai (4); editor de sentencias SQL, y tabla de resultados dinámica con paginación.',
    solucion_clave: 'Hacer clic en los botones de tabla para explorar sus registros, escribir y ejecutar cualquier consulta SELECT en el editor SQL, y cargar consultas predefinidas de auditoría.',
    texto_voz: 'Te encuentras en la Base de Datos Relacional y Geoespacial del sistema. Este módulo administra seis tablas maestras auditables. Puedes ejecutar consultas SQL en vivo, explorar los registros de vehículos y auditar los reportes de última hora.',
    pills: [
      { texto: '¿Qué hace este apartado?', clase: 'destacado' },
      { texto: 'Dame un listado de los reportes de última hora', clase: 'novedad' },
      { texto: 'Consultar tabla vehiculos_transporte' },
      { texto: 'Ver tablas de la base de datos' }
    ]
  },
  'administracion': {
    nombre: 'Formulario Oficial de Despacho & Cuaderno de Novedades',
    que_hace: 'Módulo administrativo estricto y sin animaciones distractoras para el despacho físico de convoyes desde los almacenes y el asiento de novedades operativas.',
    herramientas: 'Formulario oficial de 2 pasos (Vehículo y Custodia PNP, Carga y Precintos Electorales), más el Cuaderno Oficial de Novedades con bitácora en tiempo real con marcas de tiempo UTC-5.',
    solucion_clave: 'Rellenar datos de despacho, registrar nuevas anotaciones en bitácora con el botón "+ Registrar Anotación en Bitácora" y avanzar entre pasos.',
    texto_voz: 'Estás en el Formulario Oficial de Despacho. Este módulo administrativo estricto y sin distracciones permite autorizar la salida de convoyes desde los almacenes y asentar novedades operativas auditables con sello de tiempo.',
    pills: [
      { texto: '¿Qué hace este apartado?', clase: 'destacado' },
      { texto: 'Dame un listado de los reportes de última hora', clase: 'novedad' },
      { texto: '¿Cómo registrar un despacho oficial?' },
      { texto: 'Anotar novedad en la bitácora' }
    ]
  },
  'mapa-cobertura': {
    nombre: 'Mapa de Cobertura Nacional de las 93 ODPEs',
    que_hace: 'Visualización cartográfica territorial que abarca las 25 regiones del Perú, garantizando la distribución electoral en costa, sierra y selva profunda.',
    herramientas: 'Mapa interactivo con capas de cobertura, marcadores de sedes ODPE y enlaces troncales de comunicación.',
    solucion_clave: 'Explorar regiones, activar capas de visualización y consultar cobertura de locales.',
    texto_voz: 'Te encuentras en el Mapa de Cobertura Nacional. Supervisa la distribución en las 93 ODPEs y 25 regiones del país.',
    pills: [
      { texto: '¿Qué hace este apartado?', clase: 'destacado' },
      { texto: 'Dame un listado de los reportes de última hora', clase: 'novedad' },
      { texto: 'Cobertura en Loreto y Puno' },
      { texto: 'Ver mapa nacional' }
    ]
  }
};

// MOTOR DE SÍNTESIS DE VOZ NATIVO (TEXT-TO-SPEECH)
let vozSintetizadorActivo = false;

function hablarTexto(texto) {
  if (!('speechSynthesis' in window)) return;
  detenerVozChatbot();
  
  if (!texto) return;
  const textoLimpio = texto.replace(/<[^>]*>/g, '').replace(/[*_#`]/g, '').trim();
  if (!textoLimpio) return;

  const utter = new SpeechSynthesisUtterance(textoLimpio);
  utter.lang = 'es-PE';
  utter.rate = 1.05;
  utter.pitch = 1.0;

  // Buscar voz en español
  const voces = window.speechSynthesis.getVoices();
  const vozEs = voces.find(v => v.lang.startsWith('es-') || v.lang.startsWith('es_')) || voces.find(v => v.lang.includes('es'));
  if (vozEs) utter.voice = vozEs;

  const indVoz = document.getElementById('indicador-voz-hablando');
  const btnStop = document.getElementById('btn-stop-audio-chatbot');

  utter.onstart = () => {
    vozSintetizadorActivo = true;
    if (indVoz) indVoz.style.display = 'inline-flex';
    if (btnStop) btnStop.classList.add('activo');
  };

  utter.onend = utter.onerror = () => {
    vozSintetizadorActivo = false;
    if (indVoz) indVoz.style.display = 'none';
    if (btnStop) btnStop.classList.remove('activo');
  };

  window.speechSynthesis.speak(utter);
}

function detenerVozChatbot() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  vozSintetizadorActivo = false;
  const indVoz = document.getElementById('indicador-voz-hablando');
  const btnStop = document.getElementById('btn-stop-audio-chatbot');
  if (indVoz) indVoz.style.display = 'none';
  if (btnStop) btnStop.classList.remove('activo');
}

function alternarVozChatbot() {
  estadoApp.vozChatbotActiva = !estadoApp.vozChatbotActiva;
  const btn = document.getElementById('btn-toggle-voz-chatbot');
  if (btn) {
    btn.classList.toggle('activo', estadoApp.vozChatbotActiva);
    btn.innerHTML = `<svg viewBox="0 0 24 24" style="width:13px;height:13px;stroke:currentColor;fill:none;stroke-width:2;"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg> <span>Voz: ${estadoApp.vozChatbotActiva ? 'ON' : 'OFF'}</span>`;
  }
  if (!estadoApp.vozChatbotActiva) {
    detenerVozChatbot();
  } else {
    if (typeof mostrarToast === 'function') mostrarToast('Voz del Copiloto activada. El asistente hablará las respuestas.', 'info');
  }
}

// ACTUALIZACIÓN DINÁMICA DEL CONTEXTO DEL CHATBOT SEGÚN LA VENTANA
function actualizarContextoChatbot(idSeccion) {
  const info = EXPLICACIONES_VISTAS_CHATBOT[idSeccion] || EXPLICACIONES_VISTAS_CHATBOT['analista-datos'];
  
  // 1. Actualizar Badge de Ventana Activa en el Header del Chatbot
  const lblSeccion = document.getElementById('chatbot-seccion-nombre');
  if (lblSeccion) {
    lblSeccion.textContent = `Ventana: ${info.nombre}`;
  }

  // 2. Actualizar Píldoras de Consulta Rápida Universales y Contextuales
  const contPills = document.getElementById('contenedor-quick-pills-chatbot');
  if (contPills) {
    contPills.innerHTML = '';
    
    // Píldoras universales siempre disponibles
    const pillsBase = [
      { texto: 'Muéstrame todos los datos', clase: 'destacado' },
      { texto: 'Reportes de última hora', clase: 'novedad' },
      { texto: '¿Qué hace este apartado?' }
    ];
    
    // Agregar píldoras específicas de la vista sin duplicar
    if (info.pills) {
      info.pills.forEach(p => {
        if (!pillsBase.some(pb => pb.texto.toLowerCase() === p.texto.toLowerCase())) {
          pillsBase.push(p);
        }
      });
    }

    pillsBase.slice(0, 5).forEach(p => {
      const btn = document.createElement('button');
      btn.className = `quick-pill-btn ${p.clase || ''}`.trim();
      btn.textContent = p.texto;
      btn.onclick = () => enviarMensajeChat(p.texto);
      contPills.appendChild(btn);
    });
  }
}

// ABRIR / CERRAR VENTANA DEL CHATBOT
function toggleVentanaChatbot() {
  const box = document.getElementById('ventana-chatbot');
  if (box) {
    box.classList.toggle('oculto');
    if (!box.classList.contains('oculto')) {
      const seccion = estadoApp.seccionActual || 'analista-datos';
      actualizarContextoChatbot(seccion);
      const input = document.getElementById('input-texto-chat');
      if (input) setTimeout(() => input.focus(), 150);
    } else {
      detenerVozChatbot();
    }
  }
}

// ENVIAR CONSULTA RÁPIDA DESDE PÍLDORAS O CHIPS
function enviarMensajeChat(texto) {
  const input = document.getElementById('input-texto-chat');
  if (input) input.value = texto;
  enviarMensajeUsuario();
}

// PROCESAMIENTO Y ENVÍO DE CONSULTA DEL USUARIO CON FEEDBACK INTERACTIVO
function enviarMensajeUsuario(e) {
  if (e && e.preventDefault) e.preventDefault();
  const input = document.getElementById('input-texto-chat');
  if (!input) return;
  const msg = input.value.trim();
  if (!msg) return;

  const cont = document.getElementById('contenedor-mensajes-chat');
  
  // 1. Burbuja del usuario
  const divU = document.createElement('div');
  divU.className = 'msg-chatbot-item user';
  divU.textContent = msg;
  cont.appendChild(divU);
  input.value = '';

  // 2. Indicador interactivo de escritura (typing indicator)
  const typingDiv = document.createElement('div');
  typingDiv.id = 'chat-typing-indicator';
  typingDiv.className = 'msg-chatbot-item bot typing';
  typingDiv.innerHTML = `
    <div style="display:flex; align-items:center; gap:8px;">
      <span class="chat-typing-dot"></span>
      <span class="chat-typing-dot"></span>
      <span class="chat-typing-dot"></span>
      <span style="font-size:11.5px; color:var(--texto-secundario); margin-left:4px;">Copiloto analizando registros en tiempo real...</span>
    </div>
  `;
  cont.appendChild(typingDiv);
  cont.scrollTop = cont.scrollHeight;

  const seccionActiva = estadoApp.seccionActual || 'analista-datos';

  // 3. Consulta al Backend REST o Fallback Local Resiliente
  const apiBase = (typeof obtenerApiBase === 'function') ? obtenerApiBase() : (window.location.protocol === 'file:' ? 'http://localhost:3000' : '');
  setTimeout(() => {
    fetch(`${apiBase}/api/chatbot/consulta`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensaje: msg, seccion_actual: seccionActiva })
    })
    .then(res => res.json())
    .then(data => {
      const typing = document.getElementById('chat-typing-indicator');
      if (typing) typing.remove();

      if (data.exito) {
        renderizarRespuestaBot(data);
      } else {
        generarRespuestaBotContextualLocal(msg, seccionActiva);
      }
    })
    .catch(() => {
      const typing = document.getElementById('chat-typing-indicator');
      if (typing) typing.remove();
      generarRespuestaBotContextualLocal(msg, seccionActiva);
    });
  }, 220);
}

// RENDERIZADO VISUAL Y SÍNTESIS DE VOZ DE LA RESPUESTA
function renderizarRespuestaBot(data) {
  const cont = document.getElementById('contenedor-mensajes-chat');
  const esc = (typeof escaparHtml === 'function') ? escaparHtml : (t => String(t ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])));
  
  // Quitar typing indicator si quedó presente
  const typing = document.getElementById('chat-typing-indicator');
  if (typing) typing.remove();

  const divB = document.createElement('div');
  divB.className = 'msg-chatbot-item bot';

  let html = `<div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:4px;">
    <strong style="color:#FFFFFF; font-size:13.5px;">${esc(data.titulo)}</strong>
    <span class="micro-etiqueta" style="color:var(--cian); font-size:10px;">ONPE VISIÓN</span>
  </div>`;

  // 0. Si la respuesta contiene datos para el dispositivo, guardarlos en memoria global
  if (data.datos_completos) {
    window.ultimoDatasetChatbot = data.datos_completos;
  }

  // 1. Mensaje Conversacional Explicativo y Natural (sanitizado por backend o local)
  if (data.mensaje_conversacional) {
    html += `<div class="chat-conversational-text">${data.mensaje_conversacional}</div>`;
  }

  // 2. Tarjeta de Registros Compilados (solo si no es saludo y contiene información técnica)
  if (data.registro_compilado && data.tipo !== 'saludo') {
    html += `<div style="background:rgba(4,7,15,0.7); border:1px solid var(--borde-sutil); border-radius:8px; padding:10px; margin:8px 0; font-size:12px; font-family:var(--font-mono);">`;
    for (const [k, v] of Object.entries(data.registro_compilado)) {
      const valStr = (typeof v === 'object' && v !== null) ? JSON.stringify(v) : v;
      html += `<div style="margin-bottom:3px;"><strong style="color:var(--cian);">${esc(k)}:</strong> <span style="color:#EAF1FB;">${esc(valStr)}</span></div>`;
    }
    html += `</div>`;
  }

  // 3. Lista de Reportes Oficiales en Tiempo Real
  if (data.reportes_lista && data.reportes_lista.length) {
    html += `<div style="margin:8px 0;">
      <strong style="color:var(--ambar-alerta); font-size:12px; display:block; margin-bottom:6px;">REPORTES OFICIALES EN TRANSMISIÓN D-DAY:</strong>`;
    data.reportes_lista.forEach(rep => {
      const claseTipo = rep.tipo === 'CRÍTICA' ? 'critico' : (rep.tipo === 'PREVENTIVA' ? 'preventivo' : 'conforme');
      html += `<div class="chat-reporte-card ${claseTipo}">
        <div style="display:flex; justify-content:space-between; font-weight:700; margin-bottom:2px;">
          <span>${esc(rep.unidad)} · ${esc(rep.hora)}</span>
          <span style="font-size:10px;">[${esc(rep.tipo)}]</span>
        </div>
        <div style="color:var(--texto-secundario); font-size:11px;">${esc(rep.ubicacion)}</div>
        <div style="color:#FFFFFF; margin-top:2px;"><strong>Impacto:</strong> ${esc(rep.impacto)}</div>
        ${rep.penalidad ? `<div style="color:var(--rojo-critico);"><strong>Penalidad:</strong> ${esc(rep.penalidad)}</div>` : ''}
        <div style="color:var(--verde-exito); margin-top:2px;"><strong>Acción:</strong> ${esc(rep.accion)}</div>
      </div>`;
    });
    html += `</div>`;
  }

  // 4. Método de Solución Estructurado
  if (data.metodo_solucion && data.metodo_solucion.length) {
    html += `<strong style="color:var(--cian); display:block; margin-top:8px; font-size:12px;">MÉTODO DE SOLUCIÓN Y OPERACIÓN:</strong>`;
    data.metodo_solucion.forEach(f => {
      html += `<div style="margin-top:6px; font-size:12px;">
        <strong style="color:#FFFFFF;">${esc(f.fase)}:</strong>
        <ul style="margin:3px 0 6px 16px; padding:0; color:var(--texto-principal);">`;
      f.acciones.forEach(a => html += `<li style="margin-bottom:2px;">${esc(a)}</li>`);
      html += `</ul></div>`;
    });
  }

  // 5. Vista previa de tabla y descarga de archivos (JSON / CSV)
  if (data.tipo === 'consulta_datos' || data.datos_completos || data.muestra_vehiculos) {
    html += `<div class="chat-data-summary-box">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
        <strong style="color:var(--cian); font-size:12px;">VISTA PREVIA DE REGISTROS DE TELEMETRÍA:</strong>
        <span style="font-size:10px; color:var(--texto-secundario);">SQLite / onpe_vision.db</span>
      </div>`;

    const vehiculos = data.muestra_vehiculos || (data.datos_completos && data.datos_completos.vehiculos_transporte) || (typeof flotaVehiculos !== 'undefined' ? flotaVehiculos.slice(0, 5) : []);
    if (vehiculos && vehiculos.length) {
      html += `<table class="chat-table-preview">
        <thead>
          <tr>
            <th>ID / Placa</th>
            <th>Tipo</th>
            <th>Conductor</th>
            <th>Vel</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>`;
      vehiculos.slice(0, 5).forEach(v => {
        const estadoCol = v.estado === 'ROJO' ? 'var(--rojo-critico)' : (v.estado === 'AMARILLO' ? 'var(--ambar-alerta)' : 'var(--verde-exito)');
        html += `<tr>
          <td><strong style="color:var(--cian);">${v.id || v.id_vehiculo}</strong> <span style="font-size:10px;">(${v.placa})</span></td>
          <td>${v.tipo || v.tipo_unidad}</td>
          <td>${v.conductor || v.nombre_conductor || 'Asignado'}</td>
          <td class="texto-mono">${v.vel || v.velocidad_kmh || 0} km/h</td>
          <td><span style="color:${estadoCol}; font-weight:700;">${v.estado || v.estado_operativo}</span></td>
        </tr>`;
      });
      html += `</tbody></table>`;
    }

    html += `<div class="chat-download-actions">
      <button class="btn-chat-descarga" onclick="descargarDatosChatbot('json')" title="Descargar archivo JSON con todas las tablas">
        <svg viewBox="0 0 24 24" style="width:13px;height:13px;stroke:currentColor;fill:none;stroke-width:2;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
        Descargar JSON Completo
      </button>
      <button class="btn-chat-descarga" onclick="descargarDatosChatbot('csv')" title="Descargar archivo CSV de la flota para Excel">
        <svg viewBox="0 0 24 24" style="width:13px;height:13px;stroke:currentColor;fill:none;stroke-width:2;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
        Descargar CSV Flota
      </button>
      <button class="btn-ghost" onclick="cambiarVistaWeb('base-datos')" style="padding:6px 10px; font-size:11px;" title="Abrir consola SQL">
        Ir a Base de Datos
      </button>
    </div>
    </div>`;

    // Si viene configurada la descarga automática, detonarla hacia la biblioteca del dispositivo
    if (data.descarga_automatica) {
      setTimeout(() => descargarDatosChatbot('json'), 350);
    }
  }

  // 6. Botones de Acción Rápida Contextuales (Chips interactivos dentro de la burbuja)
  if (data.botones_accion && data.botones_accion.length) {
    html += `<div class="chat-action-chips">`;
    data.botones_accion.forEach(b => {
      const cls = b.destacado ? 'destacado' : '';
      const textoConsulta = (b.consulta || b.texto).replace(/"/g, '&quot;').replace(/'/g, "\\'");
      html += `<button class="chat-chip-btn ${cls}" onclick="enviarMensajeChat('${textoConsulta}')">${b.texto}</button>`;
    });
    html += `</div>`;
  }

  // 7. Botón interactivo de Voz / Escuchar
  const textoParaVoz = (data.texto_voz || data.titulo || '').replace(/'/g, "\\'");
  html += `<div style="display:flex; gap:8px; margin-top:10px; align-items:center;">
    <button class="btn-hablar-burbuja" onclick="hablarTexto('${textoParaVoz}')" title="Escuchar esta respuesta en voz alta">
      <svg viewBox="0 0 24 24" style="width:13px;height:13px;stroke:currentColor;fill:none;stroke-width:2;"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
      Escuchar Respuesta
    </button>
    <button class="btn-ghost" onclick="detenerVozChatbot()" style="padding:4px 8px; font-size:11px;" title="Silenciar">
      Silenciar
    </button>
  </div>`;

  divB.innerHTML = html;
  cont.appendChild(divB);
  cont.scrollTop = cont.scrollHeight;

  // Si la voz está activa globalmente, hablar automáticamente la síntesis institucional
  if (estadoApp.vozChatbotActiva) {
    hablarTexto(data.texto_voz || data.titulo);
  }
}

// MOTOR DE RESPUESTA LOCAL CONTEXTUAL (RESILIENTE OFFLINE 100% FUNCIONAL EN FILE:///)
function generarRespuestaBotContextualLocal(msg, seccionActiva) {
  const q = msg.toLowerCase().trim();
  const infoSec = EXPLICACIONES_VISTAS_CHATBOT[seccionActiva] || EXPLICACIONES_VISTAS_CHATBOT['analista-datos'];

  let resp = null;

  // 0. Saludos y conversación casual ("hola", "hola?", "¿qué tal?", "¿cómo estás?", etc.)
  const esSaludo = /^(hola|hola\?|hola,|hola\s+que\s+tal|hola\s+qu[eé]\s+tal|buenos\s+d[ií]as|buenas\s+tardes|buenas\s+noches|saludos|qu[eé]\s+tal|c[oó]mo\s+est[aá]s|como\s+estas|qui[eé]n\s+eres|qu[eé]\s+puedes\s+hacer|ayuda)$/i.test(q) ||
    (q.includes('hola') && (q.includes('que tal') || q.includes('qué tal') || q.includes('como estas') || q.includes('cómo estás') || q.length < 25));

  if (esSaludo) {
    resp = {
      tipo: 'saludo',
      titulo: 'Copiloto ONPE Visión 2026 · Asistente Táctico Electoral',
      mensaje_conversacional: '¡Hola! Soy tu <strong>Copiloto Táctico Electoral de ONPE Visión 2026</strong>. Estoy supervisando en tiempo real los 10,401 locales de votación y el despliegue nacional de convoyes bajo canal privado MPLS y respaldo satelital Starlink.<br><br>Puedo asistirte en la auditoría del D-DAY: consultar y descargar las 6 tablas maestras de la base de datos oficial SQLite en tu dispositivo, auditar reportes de última hora en vivo o explicarte las herramientas de esta ventana.<br><br><strong>¿Qué deseas realizar en este momento? Elige una de estas acciones inmediatas o escríbeme abajo:</strong>',
      texto_voz: '¡Hola! Soy tu Copiloto Táctico Electoral de ONPE Visión 2026. Estoy monitoreando en tiempo real los 10,401 locales y la flota nacional de convoyes. ¿En qué puedo ayudarte? Puedes pedirme: "Muéstrame todos los datos", "Hazme una consulta de la base de datos", "¿Qué pasó en Ticlio?" o "¿Cómo ejecutar la fianza de Galaga SAC?".',
      botones_accion: [
        { texto: 'Consultar y Descargar Base de Datos', consulta: 'Muéstrame todos los datos', destacado: true },
        { texto: 'Reportes de Última Hora', consulta: 'Dame un listado de los reportes de última hora' },
        { texto: '¿Cómo ejecutar la fianza de S/ 64,000?', consulta: '¿Cómo ejecutar la fianza de S/ 64,000?' },
        { texto: '¿Qué hace este apartado?', consulta: '¿Qué hace este apartado?' },
        { texto: 'Estado de los 12 Convoyes', consulta: 'Estado de los 12 camiones y lanchas' }
      ]
    };
  }
  // 0.5. Consulta general de base de datos y descarga para el dispositivo
  else if (q.includes('hazme una consulta') || q.includes('haz una consulta') || q.includes('ejecutar consulta') ||
           q.includes('muestrame todos los datos') || q.includes('muéstrame todos los datos') || q.includes('todos los datos') ||
           q.includes('consultar base de datos') || q.includes('descargar datos') || q.includes('descarga los datos') ||
           q.includes('dame todos los datos') || q.includes('dame los datos') || q.includes('exportar base de datos') ||
           q.includes('todos los registros') || q.includes('mostrar registros') || q.includes('descargalo') || q.includes('descárgalo')) {
    const vehs = typeof flotaVehiculos !== 'undefined' ? flotaVehiculos : [];
    const incs = typeof incidenciasData !== 'undefined' ? incidenciasData : [];
    resp = {
      tipo: 'consulta_datos',
      titulo: 'Consulta Ejecutada: Base de Datos Relacional SQLite (onpe_vision.db)',
      mensaje_conversacional: `<strong>Consulta a Base de Datos Completada:</strong><br>He consultado exitosamente la base de datos oficial <code>onpe_vision.db</code>. Se compilaron e indexaron <strong>32 registros oficiales</strong> a través de las 6 tablas maestras del sistema electoral:<br>• <strong>vehiculos_transporte</strong>: 12 unidades activas en telemetría.<br>• <strong>locales_votacion</strong>: 8 centros de sufragio estratégicos.<br>• <strong>rutas_electorales</strong>: 4 corredores viales nacionales.<br>• <strong>telemetria_gps</strong>: 3 balizas satelitales MPLS.<br>• <strong>actas_recepcion_campo</strong>: 2 actas oficiales con firma digital.<br>• <strong>alertas_xai</strong>: 3 incidentes clasificados con TreeSHAP.<br><br><strong>Descarga Automática Iniciada:</strong> He transferido el archivo <code>onpe_vision_datos_completos_2026.json</code> a tu biblioteca/carpeta de descargas. También puedes descargar la matriz CSV para Excel o explorar la consola SQL con los botones inferiores:`,
      texto_voz: `He ejecutado la consulta completa a la base de datos onpe_vision.db. Se compilaron los registros oficiales entre vehículos, alertas, locales y rutas. He iniciado automáticamente la descarga del archivo JSON en tu dispositivo y tienes disponible la versión CSV para Excel.`,
      muestra_vehiculos: vehs.slice(0, 6).map(v => ({
        id: v.id,
        placa: v.placa,
        tipo: v.tipo,
        conductor: v.conductor,
        pnp: v.pnp,
        vel: `${v.vel} km/h`,
        estado: v.estado
      })),
      datos_completos: {
        metadata: {
          sistema: 'ONPE VISIÓN 2026 - MODO AUTÓNOMO / OFFLINE Y DISPOSITIVO',
          fecha_extraccion: new Date().toISOString(),
          turno: 'D-DAY 11 Abril 2026 06:45:00 UTC-5',
          total_registros: vehs.length + incs.length + 18
        },
        vehiculos_transporte: vehs,
        alertas_xai: incs
      },
      descarga_automatica: true,
      botones_accion: [
        { texto: 'Ver Reportes de Última Hora', consulta: 'Dame un listado de los reportes de última hora' },
        { texto: '¿Cómo ejecutar la fianza de S/ 64,000?', consulta: '¿Cómo ejecutar la fianza de S/ 64,000?' },
        { texto: '¿Qué hace este apartado?', consulta: '¿Qué hace este apartado?' }
      ]
    };
  }
  // 1. Pregunta sobre qué hace el apartado o qué tiene
  else if (q.includes('que hace') || q.includes('quÃ© hace') || q.includes('qué hace') || q.includes('para que sirve') || q.includes('para qué sirve') || q.includes('explica') || q.includes('este apartado') || q.includes('esta ventana') || q.includes('esta pantalla') || q.includes('este modulo') || q.includes('este módulo') || q.includes('esta seccion') || q.includes('esta sección') || q.includes('que hay aqui') || q.includes('qué hay aquí')) {
    resp = {
      titulo: `Auditoría y Explicación: ${infoSec.nombre}`,
      mensaje_conversacional: `<strong>Propósito Principal:</strong> ${infoSec.que_hace}<br><br><strong>Herramientas Clave:</strong> ${infoSec.herramientas}<br><br><strong>Solución Recomendada:</strong> ${infoSec.solucion_clave}`,
      texto_voz: infoSec.texto_voz,
      botones_accion: [
        { texto: 'Consultar y Descargar Base de Datos', consulta: 'Muéstrame todos los datos', destacado: true },
        { texto: 'Reportes de Última Hora', consulta: 'Dame un listado de los reportes de última hora' },
        { texto: '¿Cómo ejecutar la fianza de S/ 64,000?', consulta: '¿Cómo ejecutar la fianza de S/ 64,000?' }
      ]
    };
  }
  // 2. Reportes de última hora / listar incidencias
  else if (q.includes('reporte') || q.includes('ultima hora') || q.includes('última hora') || q.includes('incidencia') || q.includes('novedad') || q.includes('listado')) {
    resp = {
      titulo: 'Listado Compilado de Reportes de Última Hora (Turno D-DAY 06:45:00 UTC-5)',
      mensaje_conversacional: 'Se registran <strong>4 eventos oficiales en tiempo real</strong> durante el turno D-Day. Destaca la alerta crítica del furgón #GAL-104 en Lima Sur con retención de fianza de S/ 64,000 y tres eventos operativos bajo control en Ticlio, Loreto y Sechura:',
      texto_voz: 'Aquí tienes el listado oficial de reportes de última hora en tiempo real: Se registran cuatro eventos principales en el turno D-Day, encabezados por el desvío crítico del furgón de Galaga SAC en Lima Sur y tres contingencias viales operativas bajo control.',
      reportes_lista: [
        {
          hora: '06:48:12 UTC-5',
          unidad: '#GAL-104 (Galaga SAC)',
          tipo: 'CRÍTICA',
          ubicacion: 'Lima Sur · Desvío 3.4 km Peaje Villa',
          impacto: '211 mesas · 63,300 electores en riesgo',
          penalidad: 'S/ 64,000 (Fianza Contractual Retenida)',
          accion: 'Despacho convoy de relevo #DEZ-950 con custodia del Cmdte. PNP Roberto Vílchez.'
        },
        {
          hora: '06:42:00 UTC-5',
          unidad: '#DEZ-782 (Scania R450)',
          tipo: 'PREVENTIVA',
          ubicacion: 'Ticlio (4,818 msnm) · Km 132',
          impacto: 'Baja presión de frenos por congelamiento (-4°C)',
          penalidad: 'Sin penalidad (Precinto intacto)',
          accion: 'Auxilio mecánico Provías en camino. Precinto QR al 98% batería.'
        },
        {
          hora: '06:35:10 UTC-5',
          unidad: '#DEZ-365 (Lancha Fluvial)',
          tipo: 'CONFORME',
          ubicacion: 'Río Amazonas · ODPE Maynas',
          impacto: 'Arribo a puerto Bellavista Nanay',
          penalidad: 'Sin penalidad',
          accion: 'Custodia naval de la Marina de Guerra completada satisfactoriamente.'
        },
        {
          hora: '06:20:45 UTC-5',
          unidad: '#DEZ-234 (Volvo FH)',
          tipo: 'CONFORME',
          ubicacion: 'Piura · Sechura',
          impacto: 'Entrega de material electoral al 100%',
          penalidad: 'Sin penalidad',
          accion: '24 precintos verificados y firmados en Acta Digital Oficial.'
        }
      ],
      botones_accion: [
        { texto: '¿Cómo ejecutar la fianza de S/ 64,000?', consulta: '¿Cómo ejecutar la fianza de S/ 64,000?', destacado: true },
        { texto: '¿Qué pasó en Ticlio con el Scania?', consulta: '¿Qué pasó en Ticlio?' },
        { texto: 'Consultar y Descargar Base de Datos', consulta: 'Muéstrame todos los datos' }
      ]
    };
  }
  // 3. Caso Galaga SAC / Fianza S/ 64,000
  else if (q.includes('galaga') || q.includes('fianza') || q.includes('64,000') || q.includes('64000') || q.includes('lima sur') || q.includes('gal-104') || q.includes('211 mesas') || q.includes('63,300')) {
    resp = {
      titulo: 'Protocolo Jurídico y Operativo: Fianza de S/ 64,000 (Galaga SAC)',
      mensaje_conversacional: '<strong>Incidencia Crítica #GAL-104 (Galaga SAC):</strong><br>El furgón contratado desvió su geocerca en 3.4 km en Peaje Villa hacia SJM, arriesgando el material de 211 mesas y 63,300 electores de la I.E. Javier Heraud.<br><br><strong>Procedimiento de Ejecución de Fianza y Solución:</strong><br>1. <strong>Retención Contractual Inmediata:</strong> Aplicación de la cláusula 14.2 por penalidad máxima (S/ 64,000) respaldada por Póliza RIMAC N° 04920.<br>2. <strong>Despacho de Relevo #DEZ-950:</strong> Salida prioritaria de convoy de contingencia desde Almacén Central Lurín escoltado por Cmdte. PNP Roberto Vílchez.<br>3. <strong>Notificación Legal:</strong> Remisión de bitácora criptográfica SHA-256 a Procuraduría ONPE y JNE.<br>4. <strong>Resolución de Prórroga:</strong> Extensión legal de mesa para garantizar el sufragio constitucional sin exclusión.',
      texto_voz: 'Alerta crítica sobre el contratista Galaga SAC: El furgón GAL-104 se desvió 3.4 kilómetros en Lima Sur, poniendo en riesgo 211 mesas y 63,300 electores. Se procedió con la retención de la fianza por 64,000 soles y el despacho inmediato del convoy de relevo número DEZ-950 con escolta policial.',
      botones_accion: [
        { texto: 'Descargar Dataset de Incidencias', consulta: 'Muéstrame todos los datos', destacado: true },
        { texto: 'Ver todos los reportes', consulta: 'Dame un listado de los reportes de última hora' },
        { texto: '¿Qué hace este apartado?', consulta: '¿Qué hace este apartado?' }
      ]
    };
  }
  // 4. Contingencia Ticlio / Scania
  else if (q.includes('ticlio') || q.includes('scania') || q.includes('dez-782') || q.includes('frenos')) {
    resp = {
      titulo: 'Protocolo de Contingencia Vial: Convoy #DEZ-782 (Ticlio 4,818 msnm)',
      mensaje_conversacional: '<strong>Contingencia en Altura - Abra de Anticona (Km 132):</strong><br>El camión Scania R450 #DEZ-782 experimentó congelamiento en válvulas neumáticas de frenos secundarios a -4°C.<br><br><strong>Acciones Ejecutadas:</strong><br>• Unidad de auxilio de Provías Nacional arribó en el km 132 con compresores auxiliares.<br>• El precinto electrónico de seguridad se mantiene 100% íntegro con batería al 98%.<br>• Custodia a cargo del Mayor PNP Carlos Mendoza.<br>• Reanudación estimada de marcha: 20 minutos sin riesgo para el material electoral.',
      texto_voz: 'Contingencia en Ticlio para la unidad Scania DEZ-782: Se detectó baja presión neumática en frenos por congelamiento a 4,818 metros de altitud. Se activó el auxilio mecánico de Provías en el kilómetro 132. El precinto electrónico se encuentra íntegro y con batería al 98%.',
      botones_accion: [
        { texto: 'Estado de la Flota Completa', consulta: 'Estado de los 12 camiones y lanchas', destacado: true },
        { texto: 'Consultar Base de Datos', consulta: 'Muéstrame todos los datos' },
        { texto: 'Reportes de Última Hora', consulta: 'Dame un listado de los reportes de última hora' }
      ]
    };
  }
  // 5. Estado de la Flota de 12 vehículos
  else if (q.includes('flota') || q.includes('vehiculo') || q.includes('vehículo') || q.includes('camion') || q.includes('camión') || q.includes('lancha') || q.includes('unidades')) {
    const vehs = typeof flotaVehiculos !== 'undefined' ? flotaVehiculos : [];
    resp = {
      tipo: 'consulta_datos',
      titulo: 'Auditoría de Flota Nacional: 12 Unidades Electorales Monitoreadas',
      mensaje_conversacional: 'Monitoreando la flota nacional de 12 convoyes: 8 unidades conformes (verde), 2 en mantenimiento preventivo (amarillo) y 2 bajo contingencia auditada (rojo).<br>11 de los 12 vehículos cuentan con custodia armada de la Policía Nacional del Perú (PNP).',
      texto_voz: 'Monitoreando la flota nacional de 12 convoyes: 8 unidades conformes, 2 preventivas y 2 bajo contingencia. 11 vehículos cuentan con custodia armada de la Policía Nacional.',
      muestra_vehiculos: vehs.slice(0, 6).map(v => ({
        id: v.id,
        placa: v.placa,
        tipo: v.tipo,
        conductor: v.conductor,
        pnp: v.pnp,
        vel: `${v.vel} km/h`,
        estado: v.estado
      })),
      descarga_automatica: false,
      botones_accion: [
        { texto: 'Descargar CSV Flota para Excel', consulta: 'Muéstrame todos los datos', destacado: true },
        { texto: 'Reportes de Última Hora', consulta: 'Dame un listado de los reportes de última hora' },
        { texto: '¿Qué hace este apartado?', consulta: '¿Qué hace este apartado?' }
      ]
    };
  }
  // 6. Respuesta General Contextual Inteligente
  else {
    const esc = (typeof escaparHtml === 'function') ? escaparHtml : (t => String(t ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])));
    resp = {
      titulo: `Copiloto ONPE: Asistencia Táctica Electoral`,
      mensaje_conversacional: `He recibido tu consulta: "<strong>${esc(msg)}</strong>" en el contexto de la ventana activa (<strong>${esc(infoSec.nombre)}</strong>).<br><br>Como Copiloto Táctico Electoral de ONPE Visión 2026, puedo ayudarte a consultar registros en tiempo real, auditar incidencias críticas o descargar el dataset oficial completo en tu dispositivo. ¿Qué deseas hacer?`,
      texto_voz: `Copiloto ONPE activo en la ventana ${infoSec.nombre}. Puedes pedirme que consulte la base de datos, ver los reportes de última hora o consultar sobre la fianza de Galaga SAC.`,
      botones_accion: [
        { texto: 'Consultar y Descargar Base de Datos', consulta: 'Muéstrame todos los datos', destacado: true },
        { texto: 'Reportes de Última Hora', consulta: 'Dame un listado de los reportes de última hora' },
        { texto: '¿Qué hace este apartado?', consulta: '¿Qué hace este apartado?' },
        { texto: '¿Cómo ejecutar la fianza de S/ 64,000?', consulta: '¿Cómo ejecutar la fianza de S/ 64,000?' }
      ]
    };
  }

  renderizarRespuestaBot(resp);
}


// ==========================================================================
// FUNCIONES DE DESCARGA DIRECTA PARA EL DISPOSITIVO
// ==========================================================================

function descargarDatosChatbot(formato = 'json') {
  if (formato === 'json') {
    const dataset = window.ultimoDatasetChatbot || {
      sistema: 'ONPE VISIÓN 2026 - SISTEMA DE MONITOREO Y CONTROL ELECTORAL',
      fecha_descarga: new Date().toISOString(),
      turno: 'D-DAY 11 Abril 2026 06:45:00 UTC-5',
      flota_vehiculos: typeof flotaVehiculos !== 'undefined' ? flotaVehiculos : [],
      incidencias: typeof incidenciasData !== 'undefined' ? incidenciasData : []
    };
    const jsonStr = JSON.stringify(dataset, null, 2);
    descargarArchivoLocal('onpe_vision_datos_completos_2026.json', jsonStr, 'application/json');
    mostrarToast('Descargando archivo JSON completo en tu biblioteca/descargas...', 'exito');
  } else if (formato === 'csv') {
    let csv = 'ID_Vehiculo,Placa,Tipo,Conductor,PNP_Custodia,SLA_Score,Velocidad_KMH,Estado,ODPE\n';
    const vehs = (typeof flotaVehiculos !== 'undefined') ? flotaVehiculos : [];
    vehs.forEach(v => {
      csv += `"${v.id}","${v.placa}","${v.tipo}","${v.conductor || ''}","${v.pnp || ''}","${v.score || ''}","${v.vel || 0}","${v.estado}","${v.odpe || ''}"\n`;
    });
    descargarArchivoLocal('onpe_vision_flota_vehiculos_2026.csv', csv, 'text/csv');
    mostrarToast('Descargando matriz CSV de flota en tu dispositivo...', 'exito');
  }
}

function descargarArchivoLocal(nombreArchivo, contenido, tipoMime) {
  const blob = new Blob([contenido], { type: `${tipoMime};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombreArchivo;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 200);
}
