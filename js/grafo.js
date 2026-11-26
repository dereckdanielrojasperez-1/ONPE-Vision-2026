// ==========================================================================
// MÓDULO: CONTROL DE TRANSPORTE Y GRAFO TOPOLÓGICO INTERACTIVO
// ==========================================================================

 let grafoNodes = [];
 let grafoEdges = [];
 let grafoAnimId = null;
 let grafoOffset = { x: 0, y: 0 };
 let grafoZoom = 1;
 let nodoSeleccionado = null;
 let modoGrafoActual = 'red'; // 'red' o 'calor'

 function inicializarGrafoTransporte(forceReset = false) {
 const canvas = document.getElementById('canvas-grafo-red');
 if (!canvas) return;
 const rect = canvas.parentElement.getBoundingClientRect();
 if (rect.width > 0 && rect.height > 0) {
   canvas.width = rect.width;
   canvas.height = rect.height;
 }

 if (!forceReset && grafoNodes.length > 0) {
   iniciarBucleGrafo();
   return;
 }

 const cx = (canvas.width || 800) / 2;
 const cy = (canvas.height || 520) / 2;

 grafoNodes = [
 // Hub Central
 { id: 'HUB_LURIN', label: 'Almacén Central Lurín', tipo: 'HUB', x: cx, y: cy, r: 24, color: '#2F8CFF', border: '#22D3EE', score: 99, conexiones: 24 },
 
 // ODPEs Regionales
 { id: 'ODPE_LIMS', label: 'ODPE Lima Sur', tipo: 'ODPE', x: cx - 140, y: cy + 90, r: 18, color: '#F0435A', border: '#FFFFFF', score: 94, conexiones: 18 },
 { id: 'ODPE_HVCA', label: 'ODPE Huancavelica', tipo: 'ODPE', x: cx + 160, y: cy - 70, r: 17, color: '#F5A524', border: '#FFFFFF', score: 72, conexiones: 14 },
 { id: 'ODPE_LORE', label: 'ODPE Maynas (Loreto)', tipo: 'ODPE', x: cx + 220, y: cy - 180, r: 17, color: '#F5A524', border: '#FFFFFF', score: 48, conexiones: 12 },
 { id: 'ODPE_AREQ', label: 'ODPE Arequipa', tipo: 'ODPE', x: cx - 180, y: cy + 180, r: 16, color: '#10B981', border: '#FFFFFF', score: 12, conexiones: 16 },
 { id: 'ODPE_PIUR', label: 'ODPE Piura', tipo: 'ODPE', x: cx - 220, y: cy - 140, r: 16, color: '#10B981', border: '#FFFFFF', score: 8, conexiones: 15 },
 { id: 'ODPE_CUSC', label: 'ODPE Cusco', tipo: 'ODPE', x: cx + 140, y: cy + 120, r: 16, color: '#10B981', border: '#FFFFFF', score: 10, conexiones: 14 },

 // Convoys Críticos
 { id: 'V_GAL104', label: '#GAL-104 (Galaga SAC)', tipo: 'Furgón', x: cx - 210, y: cy + 120, r: 13, color: '#F0435A', border: '#FFFFFF', score: 94, varSla: '+14.2%', driver: 'No Identificado' },
 { id: 'V_GAL109', label: '#GAL-109 (Galaga SAC)', tipo: 'Furgón', x: cx - 120, y: cy + 190, r: 12, color: '#F0435A', border: '#FFFFFF', score: 88, varSla: '+11.5%', driver: 'Conductor Observado' },
 { id: 'V_DEZ782', label: '#DEZ-782 (Ticlio)', tipo: 'Camión', x: cx + 240, y: cy - 50, r: 13, color: '#F5A524', border: '#FFFFFF', score: 72, varSla: '+8.4%', driver: 'Manuel Quispe' },
 { id: 'V_DEZ365', label: '#DEZ-365 (Lancha)', tipo: 'Lancha', x: cx + 280, y: cy - 150, r: 12, color: '#F5A524', border: '#FFFFFF', score: 48, varSla: '+2.7%', driver: 'Segundo Tamani' },
 { id: 'V_DEZ641', label: '#DEZ-641 (Puno)', tipo: 'Camión', x: cx + 210, y: cy + 160, r: 12, color: '#F5A524', border: '#FFFFFF', score: 35, varSla: '-0.5%', driver: 'Walter Condori' },
 { id: 'V_DEZ528', label: '#DEZ-528 (Arequipa)', tipo: 'Camión', x: cx - 250, y: cy + 220, r: 12, color: '#10B981', border: '#FFFFFF', score: 12, varSla: '-1.2%', driver: 'Jorge Cárdenas' },
 { id: 'V_DEZ234', label: '#DEZ-234 (Piura)', tipo: 'Camión', x: cx - 290, y: cy - 120, r: 12, color: '#10B981', border: '#FFFFFF', score: 8, varSla: '-2.5%', driver: 'Carlos Mendoza P.' },
 { id: 'V_DEZ912', label: '#DEZ-912 (Cusco)', tipo: 'Camión', x: cx + 90, y: cy + 190, r: 12, color: '#10B981', border: '#FFFFFF', score: 10, varSla: '-1.8%', driver: 'Efraín Mamani' },

 // Locales de Votación
 { id: 'LOC_HERAUD', label: 'I.E. Javier Heraud (211 Mesas)', tipo: 'LOCAL', x: cx - 270, y: cy + 140, r: 10, color: '#F0435A', border: '#FFD700', score: 94 },
 { id: 'LOC_PEDRO', label: 'Colegio San Pedro (Lurín)', tipo: 'LOCAL', x: cx - 160, y: cy + 40, r: 9, color: '#22D3EE', border: '#FFFFFF', score: 15 },
 { id: 'LOC_AYACU', label: 'I.E. Victoria de Ayacucho', tipo: 'LOCAL', x: cx + 220, y: cy - 10, r: 9, color: '#F5A524', border: '#FFFFFF', score: 72 }
 ];
 grafoNodes.forEach(n => { n.baseR = n.r; });

 grafoEdges = [
 { from: 'HUB_LURIN', to: 'ODPE_LIMS', color: 'rgba(240, 67, 90, 0.6)' },
 { from: 'HUB_LURIN', to: 'ODPE_HVCA', color: 'rgba(245, 165, 36, 0.6)' },
 { from: 'HUB_LURIN', to: 'ODPE_LORE', color: 'rgba(34, 211, 238, 0.4)' },
 { from: 'HUB_LURIN', to: 'ODPE_AREQ', color: 'rgba(16, 185, 129, 0.5)' },
 { from: 'HUB_LURIN', to: 'ODPE_PIUR', color: 'rgba(16, 185, 129, 0.5)' },
 { from: 'HUB_LURIN', to: 'ODPE_CUSC', color: 'rgba(16, 185, 129, 0.5)' },

 { from: 'ODPE_LIMS', to: 'V_GAL104', color: 'rgba(240, 67, 90, 0.8)' },
 { from: 'ODPE_LIMS', to: 'V_GAL109', color: 'rgba(240, 67, 90, 0.7)' },
 { from: 'V_GAL104', to: 'LOC_HERAUD', color: 'rgba(240, 67, 90, 0.9)' },
 { from: 'HUB_LURIN', to: 'LOC_PEDRO', color: 'rgba(34, 211, 238, 0.5)' },

 { from: 'ODPE_HVCA', to: 'V_DEZ782', color: 'rgba(245, 165, 36, 0.8)' },
 { from: 'V_DEZ782', to: 'LOC_AYACU', color: 'rgba(245, 165, 36, 0.8)' },

 { from: 'ODPE_LORE', to: 'V_DEZ365', color: 'rgba(34, 211, 238, 0.7)' },
 { from: 'ODPE_AREQ', to: 'V_DEZ528', color: 'rgba(16, 185, 129, 0.7)' },
 { from: 'ODPE_PIUR', to: 'V_DEZ234', color: 'rgba(16, 185, 129, 0.7)' },
 { from: 'ODPE_CUSC', to: 'V_DEZ912', color: 'rgba(16, 185, 129, 0.7)' }
 ];

 renderizarRankingTransporte();
 iniciarBucleGrafo();
 }

 function renderizarRankingTransporte() {
 const cont = document.getElementById('lista-ranking-cards');
 if (!cont) return;

 const unidades = [
 { id: '#GAL-104', nombre: 'Galaga SAC · No ID', odpe: 'Lima Sur', score: 94, var: '+14.2%', color: 'var(--rojo-critico)' },
 { id: '#GAL-109', nombre: 'Galaga SAC · Obs', odpe: 'Lima Sur', score: 88, var: '+11.5%', color: 'var(--rojo-critico)' },
 { id: '#DEZ-782', nombre: 'Scania R450 · M. Quispe', odpe: 'Huancavelica', score: 72, var: '+8.4%', color: 'var(--ambar-alerta)' },
 { id: '#DEZ-365', nombre: 'Amazonas I · S. Tamani', odpe: 'Loreto', score: 48, var: '+2.7%', color: 'var(--ambar-alerta)' },
 { id: '#DEZ-641', nombre: 'Isuzu 4x4 · W. Condori', odpe: 'Puno', score: 35, var: '-0.5%', color: 'var(--ambar-alerta)' },
 { id: '#DEZ-528', nombre: 'Volvo FH · J. Cárdenas', odpe: 'Arequipa', score: 12, var: '-1.2%', color: 'var(--verde-exito)' },
 { id: '#DEZ-912', nombre: 'Actros · E. Mamani', odpe: 'Cusco', score: 10, var: '-1.8%', color: 'var(--verde-exito)' },
 { id: '#DEZ-234', nombre: 'Volvo FH · C. Mendoza', odpe: 'Piura', score: 8, var: '-2.5%', color: 'var(--verde-exito)' },
 { id: '#DEZ-115', nombre: 'Volvo FMX · R. Pacherres', odpe: 'Junín', score: 7, var: '-2.8%', color: 'var(--verde-exito)' },
 { id: '#DEZ-447', nombre: 'Scania G410 · D. Huamán', odpe: 'Ayacucho', score: 6, var: '-3.1%', color: 'var(--verde-exito)' },
 { id: '#DEZ-701', nombre: 'Hino 500 · G. Ruiz', odpe: 'San Martín', score: 5, var: '-3.4%', color: 'var(--verde-exito)' },
 { id: '#DEZ-803', nombre: 'Lancha Selva · N. Ahuanari', odpe: 'Ucayali', score: 4, var: '-3.9%', color: 'var(--verde-exito)' }
 ];

 let html = '';
 unidades.forEach((u, i) => {
 const isPos = u.var.startsWith('+');
 html += `
 <div class="ranking-item-card" onclick="enfocarNodoGrafo('${u.id}')">
 <span class="ranking-num">${i + 1}</span>
 <div style="flex:1; margin:0 8px;">
 <strong style="font-size:12px; color:#FFFFFF;">${u.id}</strong><br>
 <span style="font-size:11px; color:var(--texto-secundario);">${u.nombre} (${u.odpe})</span>
 </div>
 <div style="text-align:right;">
 <span class="ranking-score-pill" style="color:${u.color}; background:rgba(255,255,255,0.06);">${u.score}</span><br>
 <span class="texto-mono" style="font-size:10px; color:${isPos ? 'var(--rojo-critico)' : 'var(--verde-exito)'};">${isPos ? '+' : '-'} ${u.var}</span>
 </div>
 </div>
 `;
 });
 cont.innerHTML = html;
 }

 function iniciarBucleGrafo() {
 if (grafoAnimId) cancelAnimationFrame(grafoAnimId);
 const canvas = document.getElementById('canvas-grafo-red');
 if (!canvas) return;
 const ctx = canvas.getContext('2d');

 let tick = 0;
 function dibujar() {
 const vista = document.getElementById('vista-control-transporte');
 if (!vista || vista.classList.contains('activa')) {
 tick += 0.02;
 ctx.clearRect(0, 0, canvas.width, canvas.height);

 // Fondo sutil con retícula técnica
 ctx.save();
 ctx.translate(grafoOffset.x, grafoOffset.y);
 ctx.scale(grafoZoom, grafoZoom);

 if (modoGrafoActual === 'calor') {
 // Modo Mapa de Calor
 grafoNodes.forEach(n => {
 const rad = n.r * (n.score > 60 ? 4 : 2.5);
 const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, rad);
 grad.addColorStop(0, n.color + '99');
 grad.addColorStop(1, 'transparent');
 ctx.fillStyle = grad;
 ctx.beginPath();
 ctx.arc(n.x, n.y, rad, 0, Math.PI * 2);
 ctx.fill();
 });
 }

 // Dibujar Enlaces (Edges)
 grafoEdges.forEach(e => {
 const n1 = grafoNodes.find(n => n.id === e.from);
 const n2 = grafoNodes.find(n => n.id === e.to);
 if (!n1 || !n2) return;

 ctx.strokeStyle = e.color;
 ctx.lineWidth = 1.5;
 ctx.beginPath();
 ctx.moveTo(n1.x, n1.y);
 ctx.lineTo(n2.x, n2.y);
 ctx.stroke();

 // Partícula de telemetría viajando en el enlace
 const t = (tick + (n1.score * 0.1)) % 1;
 const px = n1.x + (n2.x - n1.x) * t;
 const py = n1.y + (n2.y - n1.y) * t;
 ctx.fillStyle = '#FFFFFF';
 ctx.beginPath();
 ctx.arc(px, py, 2.5, 0, Math.PI * 2);
 ctx.fill();
 });

 // Dibujar Nodos
 grafoNodes.forEach(n => {
 ctx.save();
 ctx.globalAlpha = n.alpha !== undefined ? n.alpha : 1.0;

 // Halo pulsante para nodos destacados por búsqueda
 if (n.highlight) {
   const pulse = Math.sin(tick * 6) * 5 + 9;
   ctx.strokeStyle = '#22D3EE';
   ctx.lineWidth = 3;
   ctx.beginPath();
   ctx.arc(n.x, n.y, n.r + pulse, 0, Math.PI * 2);
   ctx.stroke();

   ctx.fillStyle = 'rgba(34, 211, 238, 0.28)';
   ctx.fill();
 }

 // Brillo radial de nodo
 const radGlow = n.r + (Math.sin(tick * 3 + n.x) * 2);
 ctx.fillStyle = n.color + '33';
 ctx.beginPath();
 ctx.arc(n.x, n.y, radGlow + 4, 0, Math.PI * 2);
 ctx.fill();

 // Círculo del Nodo
 ctx.fillStyle = n.color;
 ctx.strokeStyle = n.highlight ? '#22D3EE' : n.border;
 ctx.lineWidth = n.highlight ? 3.5 : 2;
 ctx.beginPath();
 ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
 ctx.fill();
 ctx.stroke();

 // Etiqueta del Nodo
 ctx.font = n.highlight ? 'bold 13px "Inter", sans-serif' : '11px "Inter", sans-serif';
 ctx.fillStyle = n.highlight ? '#22D3EE' : '#EAF1FB';
 ctx.textAlign = 'center';
 ctx.fillText(n.label, n.x, n.y + n.r + 14);
 ctx.restore();
 });

 ctx.restore();
 }
 grafoAnimId = requestAnimationFrame(dibujar);
 }
 dibujar();
 }

 function enfocarNodoGrafo(id) {
 const nodo = grafoNodes.find(n => n.label.includes(id) || n.id.includes(id.replace('#', '')));
 if (!nodo) return;
 nodoSeleccionado = nodo;
 const ov = document.getElementById('overlay-clusters-info');
 const tit = document.getElementById('cluster-nodo-titulo');
 const badge = document.getElementById('cluster-nodo-badge');
 if (tit) tit.textContent = nodo.label;
 if (badge) {
 badge.textContent = `Score: ${nodo.score}/100`;
 badge.className = nodo.score > 60 ? 'badge-estado badge-incumplimiento' : (nodo.score > 30 ? 'badge-estado badge-alerta-amarilla' : 'badge-estado badge-conforme');
 }
 mostrarToast(`Nodo enfocado: ${nodo.label}`, 'info');
 }

 function alternarModoGrafo(modo) {
 modoGrafoActual = modo;
 document.getElementById('btn-modo-red').classList.toggle('activo', modo === 'red');
 document.getElementById('btn-modo-calor').classList.toggle('activo', modo === 'calor');
 mostrarToast(`Vista cambiada a: ${modo === 'red' ? 'Red Topológica' : 'Mapa de Calor y Densidad'}`, 'info');
 }

 function resetGrafoCamara() {
 grafoOffset = { x: 0, y: 0 };
 grafoZoom = 1;
 mostrarToast('Cámara de grafo restablecida', 'info');
 }

 function filtrarGrafoRed() {
 const val = (document.getElementById('filtro-grafo-busqueda')?.value || '').trim().toLowerCase();
 const scoreMin = parseInt(document.getElementById('slider-grafo-score')?.value || '0', 10);
 const actor = (document.getElementById('filtro-grafo-actor')?.value || 'TODOS').toLowerCase();
 const region = (document.getElementById('filtro-grafo-region')?.value || 'TODAS').toLowerCase();
 const sliderVal = document.getElementById('valor-slider-score');
 if (sliderVal) sliderVal.textContent = `${scoreMin} - 100`;

 grafoNodes.forEach(n => {
   const textoNodo = `${n.id} ${n.label || ''} ${n.tipo || ''} ${n.driver || ''}`.toLowerCase();
   const matchTexto = !val || textoNodo.includes(val);
   const matchScore = (n.score || 0) >= scoreMin;
   const matchActor = actor === 'todos' || (n.tipo || '').toLowerCase().includes(actor) || textoNodo.includes(actor);
   const matchRegion = region === 'todas' || textoNodo.includes(region);

   if (matchTexto && matchScore && matchActor && matchRegion) {
     n.highlight = !!(val || actor !== 'todos' || region !== 'todas');
     n.r = n.highlight ? Math.max(16, n.baseR || n.r) : (n.baseR || (n.tipo === 'HUB' ? 24 : (n.tipo === 'ODPE' ? 17 : 13)));
     n.alpha = 1.0;
   } else {
     n.highlight = false;
     n.r = 6;
     n.alpha = (val || actor !== 'todos' || region !== 'todas' || scoreMin > 0) ? 0.22 : 0.85;
   }
 });

 // Filtrar ranking lateral en tiempo real
 const contRanking = document.getElementById('lista-ranking-cards');
 if (contRanking) {
   const cards = contRanking.querySelectorAll('.ranking-item-card');
   cards.forEach(card => {
     const cardText = card.textContent.toLowerCase();
     const okTxt = !val || cardText.includes(val);
     const okReg = region === 'todas' || cardText.includes(region);
     card.style.display = (okTxt && okReg) ? 'flex' : 'none';
   });
 }
 }

 // =========================================================================
 // FOTOGRAMA 2: NEURAL SHELL 3D & EXECUTION TAPE (videoframe_8678.png)

// 5. CONTROL DE TRANSPORTE: GRAFO INTERACTIVO CON DRAG & DROP Y MODAL AGREGAR NODO
let nodoArrastrado = null;
let offsetArrastre = { x: 0, y: 0 };

function habilitarDragAndDropGrafo() {
  const canvas = document.getElementById('canvas-grafo-red');
  if (!canvas || canvas.dataset.dragReady === 'true') return;
  canvas.dataset.dragReady = 'true';

  canvas.addEventListener('mousedown', function(e) {
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left - grafoOffset.x) / grafoZoom;
    const my = (e.clientY - rect.top - grafoOffset.y) / grafoZoom;

    // Buscar si el clic fue sobre algún nodo
    for (let i = grafoNodes.length - 1; i >= 0; i--) {
      const n = grafoNodes[i];
      const dist = Math.hypot(n.x - mx, n.y - my);
      if (dist < n.r + 6) {
        nodoArrastrado = n;
        offsetArrastre = { x: mx - n.x, y: my - n.y };
        canvas.style.cursor = 'grabbing';
        seleccionarNodoGrafo(n);
        return;
      }
    }
  });

  window.addEventListener('mousemove', function(e) {
    if (nodoArrastrado && canvas) {
      const rect = canvas.getBoundingClientRect();
      const mx = (e.clientX - rect.left - grafoOffset.x) / grafoZoom;
      const my = (e.clientY - rect.top - grafoOffset.y) / grafoZoom;
      nodoArrastrado.x = mx - offsetArrastre.x;
      nodoArrastrado.y = my - offsetArrastre.y;
    }
  });

  window.addEventListener('mouseup', function() {
    if (nodoArrastrado && canvas) {
      nodoArrastrado = null;
      canvas.style.cursor = 'grab';
    }
  });
}

function seleccionarNodoGrafo(n) {
  const tit = document.getElementById('cluster-nodo-titulo');
  const badge = document.getElementById('cluster-nodo-badge');
  const score = document.getElementById('cluster-nodo-score');
  if (tit) tit.textContent = n.label || n.id;
  if (badge) {
    badge.textContent = `Score: ${n.score || 85}/100`;
    badge.className = n.score > 60 ? 'badge-estado badge-incumplimiento' : (n.score > 30 ? 'badge-estado badge-alerta-amarilla' : 'badge-estado badge-conforme');
  }
  if (score) score.textContent = `SCORE: ${n.score || 85}/100`;

  const overlay = document.getElementById('overlay-clusters-info');
  if (overlay) {
    overlay.style.borderColor = n.border || 'var(--cian)';
  }
}

function abrirModalNuevoNodo() {
  const m = document.getElementById('modal-nuevo-nodo');
  if (m) m.style.display = 'flex';
}

function cerrarModalNuevoNodo() {
  const m = document.getElementById('modal-nuevo-nodo');
  if (m) m.style.display = 'none';
}

function cerrarModalNodoSiFondo(e) {
  if (e.target.id === 'modal-nuevo-nodo') cerrarModalNuevoNodo();
}

function guardarNuevoNodoGrafo(e) {
  e.preventDefault();
  if (typeof esModoSoloLectura === 'function' && esModoSoloLectura('inyectar nuevos nodos a la red')) return;
  const id = document.getElementById('nodo-nuevo-id').value.trim();
  const nombre = document.getElementById('nodo-nuevo-nombre').value.trim();
  const tipo = document.getElementById('nodo-nuevo-tipo').value;
  const padre = document.getElementById('nodo-nuevo-padre').value;
  const score = parseInt(document.getElementById('nodo-nuevo-score').value, 10);
  const custodia = document.getElementById('nodo-nuevo-custodia').value.trim() || 'Patrulla Asignada PNP';

  if (!id || !nombre) return;

  const canvas = document.getElementById('canvas-grafo-red');
  const cx = canvas ? canvas.width / 2 : 400;
  const cy = canvas ? canvas.height / 2 : 300;

  // Color y estilo según tipo
  let color = '#22D3EE';
  let border = '#06B6D4';
  if (tipo.includes('Camión') || tipo.includes('Volvo')) {
    color = '#F5A524'; border = '#D97706';
  } else if (tipo.includes('Furgón')) {
    color = '#F0435A'; border = '#DC2626';
  } else if (tipo.includes('Lancha')) {
    color = '#10B981'; border = '#059669';
  }

  // Posición con desplazamiento aleatorio cerca del padre
  const nodoPadre = grafoNodes.find(n => n.id === padre) || grafoNodes[0];
  const px = nodoPadre ? nodoPadre.x + (Math.random() * 160 - 80) : cx + 100;
  const py = nodoPadre ? nodoPadre.y + (Math.random() * 160 - 80) : cy + 100;

  const nuevoNodo = {
    id: id,
    label: nombre,
    tipo: tipo,
    x: px,
    y: py,
    r: 14,
    color: color,
    border: border,
    score: score,
    pnp: custodia,
    conexiones: [padre]
  };

  grafoNodes.push(nuevoNodo);
  grafoEdges.push({ from: padre, to: id, peso: 1.5, active: true });

  // Recalcular ranking y lista lateral
  actualizarRankingGrafo();
  seleccionarNodoGrafo(nuevoNodo);

  cerrarModalNuevoNodo();
  mostrarToast(`Nodo ${id} agregado e interconectado a la red de telemetría`, 'exito');
}

function restablecerPosicionesGrafo() {
  inicializarGrafoTransporte(true);
  mostrarToast('Posiciones topológicas del grafo restablecidas', 'info');
}

function actualizarRankingGrafo() {
  const lista = document.getElementById('lista-ranking-cards') || document.getElementById('lista-ranking-flota');
  if (!lista) return;

  const esc = (typeof escaparHtml === 'function') ? escaparHtml : (t => String(t ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])));
  const ordenados = [...grafoNodes].sort((a, b) => (b.score || 0) - (a.score || 0));
  let html = '';
  ordenados.forEach((n, idx) => {
    let colorScore = 'var(--verde-exito)';
    if (n.score >= 70) colorScore = 'var(--rojo-critico)';
    else if (n.score >= 30) colorScore = 'var(--ambar-alerta)';

    html += `
      <div class="ranking-item-card" onclick="enfocarNodoEnGrafo('${esc(n.id)}')">
        <span class="ranking-num">${idx + 1}</span>
        <div style="flex:1; margin:0 8px;">
          <strong style="font-size:12px; color:#FFFFFF;">${esc(n.id)}</strong><br>
          <span style="font-size:11px; color:var(--texto-secundario);">${esc(n.label)}</span>
        </div>
        <div style="text-align:right;">
          <span class="ranking-score-pill" style="color:${colorScore}; background:rgba(255,255,255,0.06);">${n.score}</span>
        </div>
      </div>
    `;
  });
  lista.innerHTML = html;
}

function enfocarNodoEnGrafo(id) {
  const n = grafoNodes.find(item => item.id === id);
  if (n) {
    seleccionarNodoGrafo(n);
    mostrarToast(`Enfocando telemetría de ${n.id} (${n.label})`, 'info');
  }
}


// 6. TERMINAL PWA DE CAMPO: ESCÁNER QR, CHECKLIST, FIRMA Y ACTA
let pwaEstado = {
  qrEscaneado: false,
  checksListos: false,
  firmaDibujada: false
};

function simularEscaneoQR() {
  const qrBox = document.getElementById('pwa-qr-box');
  const status = document.getElementById('pwa-qr-status');
  const sub = document.getElementById('pwa-qr-subtext');
  const btn = document.getElementById('btn-escanear-qr');

  if (status) status.textContent = 'Procesando lectura de precinto...';
  if (qrBox) qrBox.style.borderColor = 'var(--ambar-alerta)';

  setTimeout(() => {
    pwaEstado.qrEscaneado = true;
    if (status) status.innerHTML = '<span style="color:var(--verde-exito); font-weight:700;">QR-ELECC-2026-LIMS-045120</span>';
    if (sub) sub.textContent = 'Precinto Criptográfico VÁLIDO · Hash SHA-256 Verificado';
    if (qrBox) qrBox.style.borderColor = 'var(--verde-exito)';
    if (btn) {
      btn.textContent = 'Precinto Validado Correctamente';
      btn.classList.add('badge-conforme');
    }
    actualizarProgresoPWA();
    mostrarToast('Precinto de convoy validado criptográficamente', 'exito');
  }, 900);
}

function inicializarCanvasFirmaPWA() {
  const canvas = document.getElementById('canvas-firma-pwa');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.strokeStyle = '#22D3EE';
  ctx.lineWidth = 2.2;
  ctx.lineCap = 'round';

  let dibujando = false;

  function pos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  }

  canvas.addEventListener('mousedown', e => {
    dibujando = true;
    const p = pos(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  });

  canvas.addEventListener('mousemove', e => {
    if (!dibujando) return;
    const p = pos(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    pwaEstado.firmaDibujada = true;
    actualizarProgresoPWA();
  });

  window.addEventListener('mouseup', () => { dibujando = false; });

  // Touch para móviles
  canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    dibujando = true;
    const p = pos(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  }, { passive: false });

  canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    if (!dibujando) return;
    const p = pos(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    pwaEstado.firmaDibujada = true;
    actualizarProgresoPWA();
  }, { passive: false });

  canvas.addEventListener('touchend', () => { dibujando = false; });
}

function limpiarFirmaDigital() {
  const canvas = document.getElementById('canvas-firma-pwa');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  pwaEstado.firmaDibujada = false;
  actualizarProgresoPWA();
}

function actualizarProgresoPWA() {
  const chks = [
    document.getElementById('chk-pwa-1')?.checked,
    document.getElementById('chk-pwa-2')?.checked,
    document.getElementById('chk-pwa-3')?.checked,
    document.getElementById('chk-pwa-4')?.checked
  ];
  const countChecks = chks.filter(Boolean).length;
  pwaEstado.checksListos = (countChecks === 4);

  let pasosCompletos = 0;
  if (pwaEstado.qrEscaneado) pasosCompletos++;
  if (pwaEstado.checksListos) pasosCompletos++;
  if (pwaEstado.firmaDibujada) pasosCompletos++;

  const pct = Math.round((pasosCompletos / 3) * 100);
  const barra = document.getElementById('barra-progreso-pwa');
  const txt = document.getElementById('txt-progreso-pwa');

  if (barra) barra.style.width = pct + '%';
  if (txt) txt.textContent = `Paso ${Math.min(3, pasosCompletos + 1)} de 3 (${pct}%)`;

  const btnEmitir = document.getElementById('btn-emitir-acta-pwa');
  if (btnEmitir) {
    const listo = (pasosCompletos === 3);
    btnEmitir.disabled = !listo;
    btnEmitir.style.opacity = listo ? '1' : '0.5';
  }
}

function emitirActaOficialPWA() {
  if (typeof esModoSoloLectura === 'function' && esModoSoloLectura('emitir actas oficiales')) return;
  if (!pwaEstado.qrEscaneado || !pwaEstado.checksListos || !pwaEstado.firmaDibujada) {
    mostrarToast('Complete los 3 pasos (Escaneo QR, Verificación y Firma) antes de emitir el acta', 'warning');
    return;
  }

  const qrText = document.getElementById('pwa-qr-status')?.textContent?.trim() || 'QR-ELECC-2026-LIMS-045120';
  const fechaEl = document.getElementById('acta-fecha-hora');
  const qrEl = document.getElementById('acta-precinto-qr');
  const firmaPrev = document.getElementById('acta-preview-firma');
  const canvasFirma = document.getElementById('canvas-firma-pwa');

  const ahoraStr = new Date().toLocaleString('es-PE', { hour12: false }) + ' UTC-5';
  if (fechaEl) fechaEl.textContent = ahoraStr;
  if (qrEl) qrEl.textContent = qrText;
  if (firmaPrev && canvasFirma) {
    const dataUrl = canvasFirma.toDataURL('image/png');
    firmaPrev.innerHTML = `<img src="${dataUrl}" alt="Firma digital del coordinador" style="max-height:54px; max-width:100%; object-fit:contain;">`;
  }

  const apiBase = (typeof obtenerApiBase === 'function') ? obtenerApiBase() : (window.location.protocol === 'file:' ? 'http://localhost:3000' : '');
  fetch(`${apiBase}/api/actas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id_local: 'LOC-LIMS-002',
      id_coordinador_dni: '48201948',
      codigo_precinto_qr: qrText,
      estado_acta: 'conforme'
    })
  }).catch(() => null);

  const modal = document.getElementById('modal-acta-oficial');
  if (modal) modal.style.display = 'flex';
  mostrarToast('Acta Oficial de Recepción y Conformidad emitida exitosamente', 'exito');
}

function cerrarModalActaOficial() {
  const modal = document.getElementById('modal-acta-oficial');
  if (modal) modal.style.display = 'none';
}

function cerrarModalActaSiFondo(e) {
  if (e.target.id === 'modal-acta-oficial') cerrarModalActaOficial();
}

function imprimirActaOficial() {
  window.print();
}
