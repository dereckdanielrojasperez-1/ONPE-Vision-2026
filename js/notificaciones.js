// ==========================================================================
// MÓDULO: CENTRO TÁCTICO DE NOTIFICACIONES E INFORMES D-DAY
// ==========================================================================

function mostrarNotificacionesOverlay() {
  const modal = document.getElementById('modal-notificaciones-overlay');
  if (modal) {
    modal.style.display = 'flex';
  } else {
    mostrarToast('3 Notificaciones: Ticlio (#DEZ-782), Lima Sur (#GAL-104), Batería Starlink Puno (94%)', 'info');
  }
}

function alternarModoContraste() {
  mostrarToast('Modo Nocturno de Alta Visibilidad calibrado para Sala de Operaciones', 'info');
}

function abrirPerfilUsuario() {
  mostrarToast('Sesión Activa: Ing. Carlos Mendoza · DNI 72491038 · Nivel: Administrador IOC', 'info');
}

function abrirConfiguracionSistema() {
  mostrarToast('Configuración: Red MPLS Primaria + Contingencia Starlink Satelital Habilitada', 'info');
}




// Este apartado sirve para los efectos visuales de interacción al hacer clic y desplazarse
(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(pointer:fine)').matches;
  var body = document.body;

  /* 1. Barra de progreso superior en scroll */
  var bar = document.getElementById('fx-progress');
  function actualizarBarraProgreso(){
    if (bar) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(window.scrollY / h, 1) : 0) + ')';
    }
  }
  window.addEventListener('scroll', actualizarBarraProgreso, {passive:true});
  actualizarBarraProgreso();

  /* 2. Chispas de combate al hacer clic (fx-spark & fx-ring) */
  var layer = document.getElementById('fx-layer');
  var colores = ['#FF0033', '#FF7A45', '#FFC53D', '#FFFFFF', '#1E7BFF', '#3FE38C'];

  function burst(x, y, n, fuerza){
    if (reduce || !layer) return;
    n = n || 14; fuerza = fuerza || 1;
    for (var i = 0; i < n; i++) {
      var s = document.createElement('span');
      s.className = 'fx-spark';
      var ang = Math.random() * Math.PI * 2, dist = (35 + Math.random() * 65) * fuerza;
      s.style.left = x + 'px';
      s.style.top = y + 'px';
      s.style.setProperty('--dx', (Math.cos(ang) * dist).toFixed(1) + 'px');
      s.style.setProperty('--dy', (Math.sin(ang) * dist + 16 * fuerza).toFixed(1) + 'px');
      s.style.setProperty('--c', colores[(Math.random() * colores.length) | 0]);
      s.style.setProperty('--t', (0.4 + Math.random() * 0.4).toFixed(2) + 's');
      s.addEventListener('animationend', function(){ this.remove(); });
      layer.appendChild(s);
    }
    var r = document.createElement('span');
    r.className = 'fx-ring';
    r.style.left = x + 'px';
    r.style.top = y + 'px';
    r.addEventListener('animationend', function(){ this.remove(); });
    layer.appendChild(r);
  }
  window.wvBurst = burst;

  document.addEventListener('pointerdown', function(e){
    if (e.button === 0) burst(e.clientX, e.clientY, 14, 1.0);
  }, {passive:true});

  /* 3. Onda dentro de los botones al hacer clic (.fx-ripple) */
  document.addEventListener('click', function(e){
    var b = e.target.closest && e.target.closest('.btn, .btn-primario, .btn-secundario, .sidebar-pill-btn, button');
    if (!b || reduce) return;
    var rc = b.getBoundingClientRect(), d = Math.max(rc.width, rc.height) * 2.2;
    var w = document.createElement('span');
    w.className = 'fx-ripple';
    w.style.width = w.style.height = d + 'px';
    w.style.left = (e.clientX - rc.left - d / 2) + 'px';
    w.style.top = (e.clientY - rc.top - d / 2) + 'px';
    w.addEventListener('animationend', function(){ this.remove(); });
    b.appendChild(w);
  });

  /* 4. Tarjetas que se inclinan hacia el cursor en 3D (Tilt & Glare) */
  if (fine && !reduce) {
    document.querySelectorAll('.card-analista-hero, .tarjeta-ioc, .card-mycards-perspective, .card-investments-bar, .tarjeta-login-institucional').forEach(function(el){
      // Excluir tarjetas que contengan formularios o inputs para no distraer al escribir
      if (el.querySelector('form, input, select, textarea') || el.closest('form')) {
        return;
      }
      el.classList.add('tilt');
      if (!el.querySelector('.glare')) {
        var g = document.createElement('span');
        g.className = 'glare';
        el.appendChild(g);
      }
      el.addEventListener('pointermove', function(e){
        var r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        el.style.transform = 'perspective(900px) rotateX(' + ((.5 - py) * 6).toFixed(2) + 'deg) rotateY(' + ((px - .5) * 8).toFixed(2) + 'deg) translateY(-3px)';
        el.style.setProperty('--gx', (px * 100).toFixed(0) + '%');
        el.style.setProperty('--gy', (py * 100).toFixed(0) + '%');
      });
      el.addEventListener('pointerleave', function(){
        el.style.transform = '';
      });
    });
  }
})();



/* =========================================================================
   MOTOR DE INTERACTIVIDAD AVANZADA (FASE 2)
   ========================================================================= */

function cerrarNotificacionesOverlay() {
  const modal = document.getElementById('modal-notificaciones-overlay');
  if (modal) modal.style.display = 'none';
}

function cerrarNotificacionesSiFondo(e) {
  if (e.target.id === 'modal-notificaciones-overlay') {
    cerrarNotificacionesOverlay();
  }
}

function filtrarNotificacionesTipo(tipo) {
  document.querySelectorAll('.btn-notif-tab').forEach(b => b.classList.remove('activo'));
  const btn = document.getElementById('tab-notif-' + tipo.toLowerCase());
  if (btn) btn.classList.add('activo');

  const items = document.querySelectorAll('.tarjeta-reporte-item');
  items.forEach(it => {
    if (tipo === 'TODAS' || it.getAttribute('data-tipo') === tipo) {
      it.style.display = 'grid';
    } else {
      it.style.display = 'none';
    }
  });
}

function marcarNotificacionesLeidas() {
  const dot = document.querySelector('.badge-dot-notif');
  if (dot) dot.style.display = 'none';
  mostrarToast('Todas las notificaciones e informes marcados como auditados', 'exito');
  cerrarNotificacionesOverlay();
}


// 2. EXCLUIR FORMULARIOS DE CHISPAS PARA ESTABILIDAD
// Modificamos el listener de chispas en el documento
document.addEventListener('click', function(e) {
  // Si el clic es sobre un input, textarea, select o dentro del formulario de administracion, abortar chispas
  if (e.target.closest('input, select, textarea, button[type="submit"], form, label, .campo-formulario, #vista-administracion')) {
    return;
  }
}, true);


// 3. BARRA DE BÚSQUEDA GLOBAL FUNCIONAL
const catalogoBusquedaSistema = [
  { tipo: 'VISTA', titulo: 'Centro de Mando Nacional (IOC)', desc: 'Cartografía interactiva en Leaflet, monitoreo de convoys y geocercas.', id: 'dashboard' },
  { tipo: 'VISTA', titulo: 'Analista de Datos (Flagship Studio)', desc: 'KPIs clave, curvas temporales de arribo y balance de custodia.', id: 'analista-datos' },
  { tipo: 'VISTA', titulo: 'Control de Transporte (Grafo de Red)', desc: 'Grafo topológico interactivo, ranking SLA y telemetría de unidades.', id: 'control-transporte' },
  { tipo: 'VISTA', titulo: 'Gestión de Proyecto (Globo 3D)', desc: 'Globo terrestre 3D con incidencias en tiempo real y execution tape.', id: 'gestion-proyecto' },
  { tipo: 'VISTA', titulo: 'Monitoreo de Flota y Rutas', desc: 'Tabla interactiva de 12 convoys con tooltips de telemetría completa.', id: 'rutas-flota' },
  { tipo: 'VISTA', titulo: 'Modelo XAI (TreeSHAP)', desc: 'Auditoría algorítmica aditiva, formulación matemática y matriz de confusión.', id: 'alertas-xai' },
  { tipo: 'VISTA', titulo: 'Terminal Móvil PWA de Campo', desc: 'Recepción en 3 clics, escáner láser QR, checklist y acta oficial firmada.', id: 'terminal-campo' },
  { tipo: 'VISTA', titulo: 'Registro Oficial de Incidencias', desc: 'Bitácora inmutable y exportación CSV de alertas electorales.', id: 'registro-incidencias' },
  { tipo: 'VISTA', titulo: 'Base de Datos Relacional y SQL', desc: 'Consola interactiva SQLite / PostgreSQL con 6 tablas del sistema.', id: 'base-datos' },
  { tipo: 'VISTA', titulo: 'Despacho y Cuaderno de Novedades', desc: 'Formulario oficial de despacho de unidades y bitácora de novedades.', id: 'administracion' },
  
  // Vehículos
  { tipo: 'VEHICULO', titulo: '#GAL-104 (Galaga SAC)', desc: 'Furgón Ligero detenido en Lima Sur (SJM). Penalidad S/ 64,000.', id: '#GAL-104', vista: 'dashboard' },
  { tipo: 'VEHICULO', titulo: '#DEZ-782 (Scania R450)', desc: 'Camión Blindado en Ticlio (4,818 msnm). Auxilio mecánico Provías.', id: '#DEZ-782', vista: 'dashboard' },
  { tipo: 'VEHICULO', titulo: '#DEZ-365 (Lancha Fluvial)', desc: 'Lancha Amazonas I en Loreto (Iquitos / Maynas). Conforme con MGP.', id: '#DEZ-365', vista: 'dashboard' },
  { tipo: 'VEHICULO', titulo: '#DEZ-528 (Volvo FH)', desc: 'Camión Blindado rumbo a ODPE Arequipa. 100% precintos OK.', id: '#DEZ-528', vista: 'dashboard' },
  { tipo: 'VEHICULO', titulo: '#DEZ-950 (Scania R450)', desc: 'Convoy de contingencia despachado desde Lurín con custodia PNP.', id: '#DEZ-950', vista: 'rutas-flota' },

  // Regiones
  { tipo: 'REGION', titulo: 'ODPE Lima Sur (San Juan de Miraflores)', desc: '211 mesas afectadas. Local I.E. Javier Heraud.', id: 'LOC-LIMS-002', vista: 'dashboard' },
  { tipo: 'REGION', titulo: 'ODPE Huancavelica (Paso de Ticlio)', desc: 'Paso cordillerano crítico a 4,818 msnm. Alerta de temperatura.', id: 'LOC-HVCA-001', vista: 'dashboard' },
  { tipo: 'REGION', titulo: 'ODPE Maynas (Loreto / Río Amazonas)', desc: 'Ruta fluvial sensible. Desembarque en puerto Bellavista Nanay.', id: 'LOC-LORE-001', vista: 'dashboard' },

  // Incidencias
  { tipo: 'INCIDENCIA', titulo: 'INC-001: Desvío en Panamericana Sur', desc: 'Furgón #GAL-104 desvió geocerca en peaje Villa El Salvador.', id: 'INC-001', vista: 'registro-incidencias' },
  { tipo: 'INCIDENCIA', titulo: 'INC-002: Falla Neumática en Ticlio', desc: 'Pérdida de presión en frenos por congelamiento a -4°C.', id: 'INC-002', vista: 'registro-incidencias' }
];

function buscarEnTodoElSistema(val) {
  const drop = document.getElementById('dropdown-busqueda-global');
  if (!drop) return;
  const q = (val || '').trim().toLowerCase();
  if (!q) {
    drop.style.display = 'none';
    drop.innerHTML = '';
    return;
  }

  const resultados = catalogoBusquedaSistema.filter(item => 
    item.titulo.toLowerCase().includes(q) || 
    item.desc.toLowerCase().includes(q) || 
    item.tipo.toLowerCase().includes(q)
  );

  const esc = (typeof escaparHtml === 'function') ? escaparHtml : (t => String(t ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])));

  if (resultados.length === 0) {
    drop.innerHTML = `<div style="padding:12px 16px; font-size:12px; color:var(--texto-secundario);">No se encontraron coincidencias para "${esc(val)}"</div>`;
    drop.style.display = 'block';
    return;
  }

  let html = '';
  resultados.slice(0, 7).forEach((r, idx) => {
    let colorTag = 'var(--cian)';
    if (r.tipo === 'VEHICULO') colorTag = 'var(--ambar-alerta)';
    if (r.tipo === 'INCIDENCIA') colorTag = 'var(--rojo-critico)';
    if (r.tipo === 'REGION') colorTag = 'var(--verde-exito)';

    html += `
      <div class="dropdown-item-busqueda ${idx === 0 ? 'activo' : ''}" onclick="seleccionarResultadoBusqueda('${esc(r.tipo)}', '${esc(r.id)}', '${esc(r.vista || r.id)}')">
        <div>
          <div style="display:flex; align-items:center; gap:8px;">
            <span class="micro-etiqueta" style="color:${colorTag}; font-size:9px;">${esc(r.tipo)}</span>
            <strong style="font-size:13px; color:#FFFFFF;">${esc(r.titulo)}</strong>
          </div>
          <div style="font-size:11px; color:var(--texto-secundario); margin-top:2px;">${esc(r.desc)}</div>
        </div>
        <svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:var(--cian);fill:none;stroke-width:2;"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </div>
    `;
  });

  drop.innerHTML = html;
  drop.style.display = 'block';
}

function manejarTeclasBusqueda(e) {
  const drop = document.getElementById('dropdown-busqueda-global');
  if (!drop || drop.style.display === 'none') return;

  const items = drop.querySelectorAll('.dropdown-item-busqueda');
  let activoIdx = Array.from(items).findIndex(it => it.classList.contains('activo'));

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (items.length > 0) {
      if (activoIdx >= 0) items[activoIdx].classList.remove('activo');
      activoIdx = (activoIdx + 1) % items.length;
      items[activoIdx].classList.add('activo');
      items[activoIdx].scrollIntoView({ block: 'nearest' });
    }
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (items.length > 0) {
      if (activoIdx >= 0) items[activoIdx].classList.remove('activo');
      activoIdx = (activoIdx - 1 + items.length) % items.length;
      items[activoIdx].classList.add('activo');
      items[activoIdx].scrollIntoView({ block: 'nearest' });
    }
  } else if (e.key === 'Enter') {
    e.preventDefault();
    if (activoIdx >= 0 && items[activoIdx]) {
      items[activoIdx].click();
    }
  } else if (e.key === 'Escape') {
    drop.style.display = 'none';
  }
}

function seleccionarResultadoBusqueda(tipo, id, vistaDestino) {
  const drop = document.getElementById('dropdown-busqueda-global');
  if (drop) drop.style.display = 'none';
  const inp = document.getElementById('input-busqueda-global');
  if (inp) inp.value = '';

  cambiarVistaWeb(vistaDestino);

  if (tipo === 'VEHICULO' && vistaDestino === 'dashboard') {
    setTimeout(() => {
      inspeccionarVehiculo(id);
    }, 350);
  }
}

// Cerrar dropdown de búsqueda al hacer clic fuera
document.addEventListener('click', function(e) {
  const searchPill = document.querySelector('.search-bar-pill');
  if (searchPill && !searchPill.contains(e.target)) {
    const drop = document.getElementById('dropdown-busqueda-global');
    if (drop) drop.style.display = 'none';
  }
});

function cambiarPaginaInc(delta) {
  mostrarToast('Mostrando todos los 14 registros de incidencias en página única', 'info');
}


