// ==========================================================================
// MÓDULO PRINCIPAL: ESTADO GLOBAL, NAVEGACIÓN, LOGIN Y ACCESOS RÁPIDOS
// ==========================================================================

 const estadoApp = {
  seccionActual: 'analista-datos',
  modoAcceso: 'admin',
  vozChatbotActiva: true,
 simulando: false,
 intervaloSimulacion: null,
 intervaloReloj: null,
 horaSimulada: new Date(2026, 3, 11, 6, 45, 0), // 11 Abril 2026 06:45:00 D-DAY
 mapaOperativo: null,
 mapaNacional: null,
 capasActivasOperativo: [],
 capasActivasNacional: [],
 estiloMapaActual: 'nocturno',
 paginaIncidencias: 1,
 incidenciasPorPagina: 14
 };

 // PROVEEDORES DE CAPAS CARTOGRÁFICAS (SIN REQUIERIMIENTO DE API KEY)
 const PROVEEDORES_MAPAS = {
 nocturno: {
 nombre: 'Nocturno Táctico',
 icono: '<svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2;"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>',
 capas: [
 {
 url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
 opciones: { attribution: '&copy; Esri, DeLorme, NAVTEQ | ONPE Visión 2026', maxZoom: 16 }
 },
 {
 url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
 opciones: { attribution: '', maxZoom: 16 }
 }
 ]
 },
 satelital: {
 nombre: 'Satelital HD',
 icono: '<svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2;"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>',
 capas: [
 {
 url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
 opciones: { attribution: '&copy; Esri, Maxar, Earthstar Geographics | ONPE Visión 2026', maxZoom: 18 }
 }
 ]
 },
 calles: {
 nombre: 'Rutas Viales y Calles',
 icono: '<svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2;"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>',
 capas: [
 {
 url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
 opciones: { attribution: '&copy; Esri, HERE, Garmin, USGS | ONPE Visión 2026', maxZoom: 18 }
 }
 ]
 },
 topografico: {
 nombre: 'Relieve Topográfico',
 icono: '<svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2;"><polygon points="3 20 9 12 13 16 21 6 21 20 3 20"></polygon></svg>',
 capas: [
 {
 url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
 opciones: { attribution: '&copy; Esri, HERE, Garmin | ONPE Visión 2026', maxZoom: 18 }
 }
 ]
 },
 cyberpunk: {
 nombre: 'Alto Contraste Táctico',
 icono: '<svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2;"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>',
 capas: [
 {
 url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
 opciones: { attribution: '&copy; Esri | Modo Táctico Alto Contraste', maxZoom: 18, className: 'map-tiles-cyberpunk' }
 }
 ]
 }
 };

 function cambiarEstiloMapa(nuevoEstilo) {
 if (!PROVEEDORES_MAPAS[nuevoEstilo]) return;
 estadoApp.estiloMapaActual = nuevoEstilo;
 const config = PROVEEDORES_MAPAS[nuevoEstilo];

 // 1. Actualizar capas en Mapa Operativo
 if (estadoApp.mapaOperativo) {
 if (estadoApp.capasActivasOperativo && estadoApp.capasActivasOperativo.length) {
 estadoApp.capasActivasOperativo.forEach(c => estadoApp.mapaOperativo.removeLayer(c));
 }
 estadoApp.capasActivasOperativo = [];
 config.capas.forEach(c => {
 const capa = L.tileLayer(c.url, c.opciones).addTo(estadoApp.mapaOperativo);
 capa.bringToBack();
 estadoApp.capasActivasOperativo.push(capa);
 });
 }

 // 2. Actualizar capas en Mapa Nacional
 if (estadoApp.mapaNacional) {
 if (estadoApp.capasActivasNacional && estadoApp.capasActivasNacional.length) {
 estadoApp.capasActivasNacional.forEach(c => estadoApp.mapaNacional.removeLayer(c));
 }
 estadoApp.capasActivasNacional = [];
 config.capas.forEach(c => {
 const capa = L.tileLayer(c.url, c.opciones).addTo(estadoApp.mapaNacional);
 capa.bringToBack();
 estadoApp.capasActivasNacional.push(capa);
 });
 }

 // 3. Reflejar estado activo en todos los botones de estilos
 document.querySelectorAll('.btn-estilo-mapa, .btn-estilo-mini').forEach(btn => {
 if (btn.getAttribute('data-estilo') === nuevoEstilo) {
 btn.classList.add('activo');
 } else {
 btn.classList.remove('activo');
 }
 });

 mostrarToast(`Estilo de mapa: ${config.nombre}`, 'info');
 }

 // 2. DATASETS SEMBRADOS
 // 12 Convoys Nacionales

 function cambiarVistaWeb(idSeccion) {
   estadoApp.seccionActual = idSeccion;
   if (typeof actualizarContextoChatbot === 'function') {
     actualizarContextoChatbot(idSeccion);
   }
    if (idSeccion === 'analista-datos') {
      if (typeof inicializarAnalistaDatos === 'function') setTimeout(inicializarAnalistaDatos, 80);
      if (typeof inicializarModelosVideo === 'function') setTimeout(inicializarModelosVideo, 120);
    }
   if (idSeccion === 'control-transporte') {
     setTimeout(() => {
       if (typeof inicializarGrafoTransporte === 'function') inicializarGrafoTransporte();
       if (typeof habilitarDragAndDropGrafo === 'function') habilitarDragAndDropGrafo();
     }, 100);
   } else if (idSeccion === 'gestion-proyecto') {
     setTimeout(() => {
       if (typeof inicializarGlobo3D === 'function') inicializarGlobo3D();
       if (typeof onResizeGlobo3D === 'function') onResizeGlobo3D();
     }, 100);
   } else if (idSeccion === 'monitoreo-flota' || idSeccion === 'rutas-flota') {
     setTimeout(() => {
       if (typeof vincularTooltipsFlota === 'function') vincularTooltipsFlota();
     }, 100);
   } else if (idSeccion === 'base-datos') {
     if (typeof mostrarTablaDB === 'function') setTimeout(() => mostrarTablaDB('vehiculos_transporte'), 100);
   }
  document.querySelectorAll('.sidebar-pill-btn').forEach(b => {
    b.classList.toggle('activo', b.getAttribute('data-seccion') === idSeccion);
  });
  document.querySelectorAll('.nav-tab-btn').forEach(b => {
 b.classList.toggle('activo', b.getAttribute('data-seccion') === idSeccion);
 });

 document.querySelectorAll('.seccion-vista').forEach(v => {
   const esActiva = (v.id === 'vista-' + idSeccion);
   v.classList.toggle('activa', esActiva);
   v.style.setProperty('display', esActiva ? 'block' : 'none', 'important');
 });

 window.scrollTo({ top: 0, behavior: 'smooth' });

 // Redimensionar mapas si se activan
 if (idSeccion === 'dashboard' && estadoApp.mapaOperativo) {
 setTimeout(() => estadoApp.mapaOperativo.invalidateSize(), 200);
 } else if (idSeccion === 'mapa-cobertura' && estadoApp.mapaNacional) {
 setTimeout(() => estadoApp.mapaNacional.invalidateSize(), 200);
 }
 }

 // Utilidades globales de seguridad y API
 function escaparHtml(texto) {
 if (texto === null || texto === undefined) return '';
 return String(texto)
   .replace(/&/g, '&amp;')
   .replace(/</g, '&lt;')
   .replace(/>/g, '&gt;')
   .replace(/"/g, '&quot;')
   .replace(/'/g, '&#39;');
 }

 function obtenerApiBase() {
 return (window.location && window.location.protocol === 'file:') ? 'http://localhost:3000' : '';
 }

 function iniciarRelojSimulado() {
 const relojEl = document.getElementById('reloj-simulado-dday');
 if (!relojEl) return;
 if (estadoApp.intervaloReloj) clearInterval(estadoApp.intervaloReloj);
 estadoApp.intervaloReloj = setInterval(() => {
   estadoApp.horaSimulada = new Date(estadoApp.horaSimulada.getTime() + 1000);
   const hh = String(estadoApp.horaSimulada.getHours()).padStart(2, '0');
   const mm = String(estadoApp.horaSimulada.getMinutes()).padStart(2, '0');
   const ss = String(estadoApp.horaSimulada.getSeconds()).padStart(2, '0');
   relojEl.textContent = `11 ABR 2026 · ${hh}:${mm}:${ss}`;
 }, 1000);
 }

 // Control de permisos según modo de acceso ('admin' = control total, 'simulacion' = solo lectura)
 function esModoSoloLectura(accion = 'modificar o agregar datos') {
 if (estadoApp.modoAcceso === 'simulacion') {
   mostrarToast(`Modo Simulación (Solo Lectura): use Acceso Directo para ${accion}.`, 'warning');
   return true;
 }
 return false;
 }

 // 4. LOGIN Y SESIÓN
 function activarModoPrueba(e) {
 if (e && e.preventDefault) e.preventDefault();
 estadoApp.modoAcceso = 'simulacion';
 const overlay = document.getElementById('pantalla-login');
 if (overlay) overlay.classList.add('oculto');
 const badge = document.getElementById('badge-usuario-sesion');
 if (badge) badge.style.display = 'flex';
 const nombreEl = document.getElementById('nombre-usuario-sesion');
 if (nombreEl) nombreEl.textContent = 'Modo Simulación (Solo Lectura)';
 const rolEl = badge?.querySelector('.user-role');
 if (rolEl) rolEl.textContent = '@simulacion_solo_lectura';
 iniciarRelojSimulado();
 mostrarToast('Modo Simulación activado (Solo Lectura · Datos de demostración)', 'info');

 // Iniciar simulación automática
 if (!estadoApp.simulando) {
 document.getElementById('btn-iniciar-simulacion')?.click();
 }
 }

 function procesarIngresoAdmin(e) {
 e.preventDefault();
 const tipoDoc = document.getElementById('login-tipo-doc')?.value || 'DNI';
 const numDoc = (document.getElementById('login-num-doc')?.value || '').trim();
 const clave = document.getElementById('login-clave')?.value || '';
 const rol = document.getElementById('login-rol-operador')?.value || 'Operador IOC';
 const otp = (document.getElementById('login-token-otp')?.value || '').trim();

 if (tipoDoc === 'DNI' && !/^\d{8}$/.test(numDoc)) {
 mostrarToast('El DNI debe contener exactamente 8 dígitos numéricos', 'error');
 return;
 }
 if (tipoDoc === 'CE' && !/^[A-Za-z0-9]{9,12}$/.test(numDoc)) {
 mostrarToast('El Carné de Extranjería debe tener entre 9 y 12 caracteres alfanuméricos', 'error');
 return;
 }
 if (clave.length < 8 || !/[A-Za-z0-9]/.test(clave) || !/[^A-Za-z0-9]/.test(clave)) {
 mostrarToast('La clave operativa requiere mínimo 8 caracteres (alfanumérico + especial)', 'error');
 return;
 }
 if (!/^\d{6}$/.test(otp)) {
 mostrarToast('El Token OTP debe contener exactamente 6 dígitos', 'error');
 return;
 }

 estadoApp.modoAcceso = 'admin';
 const overlay = document.getElementById('pantalla-login');
 if (overlay) overlay.classList.add('oculto');
 const badge = document.getElementById('badge-usuario-sesion');
 if (badge) badge.style.display = 'flex';
 const nombreEl = document.getElementById('nombre-usuario-sesion');
 if (nombreEl) nombreEl.textContent = `${rol} (${numDoc})`;
 const rolEl = badge?.querySelector('.user-role');
 if (rolEl) rolEl.textContent = '@admin_control_total';

 iniciarRelojSimulado();
 mostrarToast(`Acceso Directo autorizado (Control Total): ${rol}`, 'exito');
 if (!estadoApp.simulando) {
 document.getElementById('btn-iniciar-simulacion')?.click();
 }
 }

 function cerrarSesionUsuario() {
 const overlay = document.getElementById('pantalla-login');
 if (overlay) overlay.classList.remove('oculto');
 const badge = document.getElementById('badge-usuario-sesion');
 if (badge) badge.style.display = 'none';
 if (estadoApp.intervaloReloj) {
 clearInterval(estadoApp.intervaloReloj);
 estadoApp.intervaloReloj = null;
 }
 mostrarToast('Sesión cerrada correctamente', 'info');
 }

 // 5. TOAST NOTIFICACIONES
 function mostrarToast(mensaje, tipo = "exito") {
 const cont = document.getElementById('contenedor-toasts');
 if (!cont) return;

 const toast = document.createElement('div');
 toast.className = 'toast-msg';
 
 let dotColor = 'var(--verde-exito)';
 if (tipo === 'peligro' || tipo === 'error') {
   toast.style.borderColor = 'var(--rojo-critico)';
   dotColor = 'var(--rojo-critico)';
 } else if (tipo === 'warning' || tipo === 'alerta') {
   toast.style.borderColor = 'var(--ambar-alerta)';
   dotColor = 'var(--ambar-alerta)';
 } else if (tipo === 'info') {
   toast.style.borderColor = 'var(--cian)';
   dotColor = 'var(--cian)';
 }

 toast.innerHTML = `<span class="punto-dot" style="background:${dotColor}; box-shadow:0 0 8px ${dotColor};"></span> <span style="font-size:12px; font-weight:600; color:#FFFFFF;">${escaparHtml(mensaje)}</span>`;
 cont.appendChild(toast);

 setTimeout(() => {
   toast.style.opacity = '0';
   toast.style.transform = 'translateX(20px)';
   setTimeout(() => toast.remove(), 300);
 }, 3500);
}

 // 6. GENERADORES OTP Y PRECINTO QR
 function generarTokenOTP(e) {
 if (e && e.preventDefault) e.preventDefault();
 const num = Math.floor(100000 + Math.random() * 900000);
 document.getElementById('login-token-otp').value = num;
 mostrarToast(`Nuevo token OTP generado: ${num}`, 'info');
 }

 function generarPrecintoAleatorio(e) {
 if (e && e.preventDefault) e.preventDefault();
 const rand = Math.floor(100000 + Math.random() * 900000);
 const code = `QR-ONPE-2026-${rand}`;
 document.getElementById('despacho-precinto').value = code;
 mostrarToast(`Nuevo precinto QR generado: ${code}`, 'info');
 }

 // 7. STEPPER Y VALIDACIONES EN GESTIÓN DE DATOS
 function irAPasoDespacho(paso) {
 const b1 = document.getElementById('bloque-paso-1');
 const b2 = document.getElementById('bloque-paso-2');
 const s1 = document.getElementById('stepper-paso-1');
 const s2 = document.getElementById('stepper-paso-2');
 const linea = document.getElementById('stepper-linea-1');

 if (paso === 1) {
 b1.style.display = 'block';
 b2.style.display = 'none';
 s1.classList.add('activo');
 s2.classList.remove('activo');
 linea.classList.remove('completada');
 } else {
 b1.style.display = 'none';
 b2.style.display = 'block';
 s1.classList.remove('activo');
 s2.classList.add('activo');
 linea.classList.add('completada');
 }
 }

 function validarRangoCedulas() {
 const ini = parseInt(document.getElementById('despacho-rango-inicio').value) || 0;
 const fin = parseInt(document.getElementById('despacho-rango-fin').value) || 0;
 const msg = document.getElementById('msg-rango-cedulas');

 if (fin > ini && ini > 0) {
 const cant = fin - ini + 1;
 msg.className = 'msg-validacion msg-val-ok';
 msg.textContent = `OK Lote válido: ${cant.toLocaleString()} cédulas foliadas.`;
 } else {
 msg.className = 'msg-validacion msg-val-err';
 msg.textContent = ' El número final debe ser mayor al inicial.';
 }
 }

 function validarDniCoordinador() {
 const dni = document.getElementById('despacho-dni-coord').value;
 const msg = document.getElementById('msg-dni-coord');

 if (/^\d{8}$/.test(dni)) {
 msg.className = 'msg-validacion msg-val-ok';
 msg.textContent = 'OK DNI de 8 dígitos válido y verificado en padrón.';
 } else {
 msg.className = 'msg-validacion msg-val-err';
 msg.textContent = ' El DNI debe contener exactamente 8 números.';
 }
 }

 function registrarNuevoDespacho(e) {
 e.preventDefault();
 if (esModoSoloLectura('registrar nuevos despachos')) return;
 const placa = (document.getElementById('despacho-placa')?.value || '').trim();
 const odpe = (document.getElementById('despacho-odpe')?.value || '').trim();
 const ini = parseInt(document.getElementById('despacho-rango-inicio')?.value, 10) || 0;
 const fin = parseInt(document.getElementById('despacho-rango-fin')?.value, 10) || 0;
 const dni = (document.getElementById('despacho-dni-coord')?.value || '').trim();
 const precinto = (document.getElementById('despacho-precinto')?.value || '').trim();

 if (!placa || !odpe) {
   mostrarToast('Debe completar placa y ODPE de destino', 'error');
   return;
 }
 if (ini <= 0 || fin <= ini) {
   mostrarToast('El rango de cédulas es inválido: el final debe ser mayor al inicial', 'error');
   return;
 }
 if (!/^\d{8}$/.test(dni)) {
   mostrarToast('El DNI del coordinador debe contener exactamente 8 dígitos', 'error');
   return;
 }

 const idVeh = placa.startsWith('#') ? placa : `#${placa}`;
 fetch(`${obtenerApiBase()}/api/despachos`, {
   method: 'POST',
   headers: { 'Content-Type': 'application/json' },
   body: JSON.stringify({
     id_vehiculo: idVeh,
     placa: placa.replace(/^#/, ''),
     odpe,
     rango_inicio: ini,
     rango_fin: fin,
     dni_coordinador: dni,
     precinto_qr: precinto
   })
 }).catch(() => null);

 const bitacora = document.getElementById('lista-anotaciones-bitacora');
 if (bitacora) {
   const div = document.createElement('div');
   div.style.cssText = 'background:var(--bg-base); padding:10px 14px; border-radius:var(--radio-sm); border:1px solid var(--borde-sutil); font-size:12px;';
   const horaStr = new Date().toTimeString().split(' ')[0].substring(0, 5);
   div.innerHTML = `<span class="texto-mono" style="color:var(--verde-exito); font-size:11px;">${horaStr} UTC-5 · DESPACHO</span><br>Unidad ${escaparHtml(idVeh)} despachada a ${escaparHtml(odpe)} (Lote ${ini}-${fin})`;
   bitacora.prepend(div);
 }

 mostrarToast(`Despacho registrado para la unidad ${idVeh} hacia ${odpe}`, 'exito');
 irAPasoDespacho(1);
 }

 function agregarNotaTurno() {
 if (esModoSoloLectura('agregar notas en la bitácora')) return;
 const txt = document.getElementById('texto-nueva-nota');
 if (!txt || !txt.value.trim()) return;

 const cont = document.getElementById('lista-anotaciones-bitacora');
 if (!cont) return;
 const div = document.createElement('div');
 div.style.cssText = 'background:var(--bg-base); padding:10px 14px; border-radius:var(--radio-sm); border:1px solid var(--borde-sutil); font-size:12px;';
 
 const ahora = new Date();
 const horaStr = ahora.toTimeString().split(' ')[0].substring(0, 5);
 div.innerHTML = `<span class="texto-mono" style="color:var(--cian); font-size:11px;">${horaStr} UTC-5</span><br>"${escaparHtml(txt.value.trim())}"`;
 cont.prepend(div);
 txt.value = '';
 mostrarToast('Novedad añadida a la bitácora oficial', 'exito');
 }

 // 8. MAPAS LEAFLET Y SIMULACIÓN

// Inicialización de componentes al cargar el documento
// Inicialización de aislamiento estricto de vistas
function inicializarVistaPrincipalSiExiste() {
  if (document.querySelector('.seccion-vista')) {
    cambiarVistaWeb(estadoApp.seccionActual || 'analista-datos');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializarVistaPrincipalSiExiste);
} else {
  inicializarVistaPrincipalSiExiste();
}

window.addEventListener('DOMContentLoaded', function() {
  if ('serviceWorker' in navigator && (window.location.protocol === 'http:' || window.location.protocol === 'https:')) {
    navigator.serviceWorker.register('sw.js').catch(() => null);
  }
  setTimeout(() => {
    if (typeof inicializarGlobo3D === 'function' && document.getElementById('canvas-globo-3d')) inicializarGlobo3D();
    if (typeof habilitarDragAndDropGrafo === 'function' && document.getElementById('canvas-grafo-red')) habilitarDragAndDropGrafo();
    if (typeof inicializarCanvasFirmaPWA === 'function' && document.getElementById('canvas-firma-pwa')) inicializarCanvasFirmaPWA();
    if (typeof vincularTooltipsFlota === 'function' && document.getElementById('tbody-flota-12')) vincularTooltipsFlota();
    if (typeof iniciarExecutionTape === 'function' && document.getElementById('tbody-execution-tape')) iniciarExecutionTape();
  }, 400);
});
