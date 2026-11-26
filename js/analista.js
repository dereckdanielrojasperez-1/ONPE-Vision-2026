// ==========================================================================
// MÓDULO: ANALISTA DE DATOS, SPLINE CHART Y TELEMETRÍA RECIENTE
// ==========================================================================

// CONTROLADOR OFICIAL: ANALISTA DE DATOS Y MODELOS DEL VIDEO
// ==========================================================================

const DATASETS_ANALISTA = {
  '1year': {
    locales: '10,401 Locales',
    tasa: '98.7%',
    sub: 'Tasa de Despliegue Anual Acumulada: 98.7% · 93 ODPEs Auditadas',
    fisico: '99.1%',
    pnp: '98.8%',
    puntos: [15, 28, 42, 60, 78, 92, 85, 96, 74, 88, 95, 98],
    etiquetas: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic']
  },
  '6month': {
    locales: '10,401 Locales',
    tasa: '98.4%',
    sub: 'Semestre Pre-Electoral: Pruebas Técnicas y Trazabilidad de Cédulas',
    fisico: '94.6%',
    pnp: '96.2%',
    puntos: [35, 45, 62, 78, 89, 98],
    etiquetas: ['Nov', 'Dic', 'Ene', 'Feb', 'Mar', 'Abr']
  },
  '3month': {
    locales: '10,401 Locales',
    tasa: '97.9%',
    sub: 'Despliegue de Material Crítico y Pólizas RIMAC en 93 Jurisdicciones',
    fisico: '91.2%',
    pnp: '95.0%',
    puntos: [48, 65, 82, 94, 88, 98],
    etiquetas: ['Feb', 'Feb+', 'Mar', 'Mar+', 'Abr', 'D-DAY']
  },
  '1month': {
    locales: '10,401 Locales',
    tasa: '98.7%',
    sub: 'Tasa de Despliegue Promedio: 98.7% · SLA Conforme en 91 de 93 ODPEs',
    fisico: '88.5%',
    pnp: '94.2%',
    puntos: [30, 48, 42, 68, 55, 82, 74, 98, 86, 92, 96, 98],
    etiquetas: ['01 Abr', '03 Abr', '05 Abr', '07 Abr', '08 Abr', '09 Abr', '10 Abr', 'D-DAY', '12 Abr', '14 Abr', '16 Abr', '18 Abr']
  },
  'dday': {
    locales: '10,401 Locales',
    tasa: '88.5%',
    sub: 'Turno Operativo D-DAY (11 Abr 2026): 82 de 93 ODPEs Recepcionadas',
    fisico: '88.5%',
    pnp: '94.2%',
    puntos: [20, 38, 55, 72, 88, 95],
    etiquetas: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00']
  }
};

let estadoAnalista = {
  horizonteActual: '1month',
  modeloVideoActual: 'corredores_gis',
  rotacionY: 0.35,
  rotacionX: 0.45,
  arrastrando: false,
  ultimoMouseX: 0,
  ultimoMouseY: 0,
  animacionId: null
};

// 1. INICIALIZADOR DEL SPLINE CHART GLOWING
function inicializarAnalistaDatos() {
  const canvas = document.getElementById('canvas-spline-hero');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const data = DATASETS_ANALISTA[estadoAnalista.horizonteActual] || DATASETS_ANALISTA['1month'];
  renderizarSplineHero(ctx, rect.width, rect.height, data);

  // Escuchar redimensionamiento
  window.removeEventListener('resize', redimensionarSplineHero);
  window.addEventListener('resize', redimensionarSplineHero);
}

function redimensionarSplineHero() {
  const canvas = document.getElementById('canvas-spline-hero');
  if (!canvas || !canvas.offsetParent) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);
  const data = DATASETS_ANALISTA[estadoAnalista.horizonteActual] || DATASETS_ANALISTA['1month'];
  renderizarSplineHero(ctx, rect.width, rect.height, data);
}

function renderizarSplineHero(ctx, w, h, data) {
  ctx.clearRect(0, 0, w, h);

  const pts = data.puntos;
  const padL = 20;
  const padR = 50;
  const padT = 20;
  const padB = 30;

  const chartW = w - padL - padR;
  const chartH = h - padT - padB;

  // Cuadrícula y ejes
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;

  const nivelesY = [
    { v: 100, label: '100%' },
    { v: 75, label: '75%' },
    { v: 50, label: '50%' },
    { v: 25, label: '25%' },
    { v: 0, label: '0%' }
  ];

  ctx.fillStyle = '#8E8E9E';
  ctx.font = '10px "JetBrains Mono", monospace';
  ctx.textAlign = 'right';

  nivelesY.forEach(n => {
    const y = padT + chartH * (1 - n.v / 100);
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(padL + chartW, y);
    ctx.stroke();
    ctx.fillText(n.label, w - 10, y + 3);
  });

  // Coordenadas de los puntos
  const stepX = chartW / (pts.length - 1);
  const coords = pts.map((p, i) => {
    return {
      x: padL + i * stepX,
      y: padT + chartH * (1 - p / 100)
    };
  });

  // Trazar Curva Bézier Catmull-Rom Suave
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(coords[0].x, coords[0].y);

  for (let i = 0; i < coords.length - 1; i++) {
    const p0 = coords[i === 0 ? 0 : i - 1];
    const p1 = coords[i];
    const p2 = coords[i + 1];
    const p3 = coords[i + 2 < coords.length ? i + 2 : i + 1];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
  }

  // Cerrar camino para el degradado inferior
  ctx.lineTo(coords[coords.length - 1].x, padT + chartH);
  ctx.lineTo(coords[0].x, padT + chartH);
  ctx.closePath();

  const grad = ctx.createLinearGradient(0, padT, 0, padT + chartH);
  grad.addColorStop(0, 'rgba(255, 122, 0, 0.40)');
  grad.addColorStop(0.6, 'rgba(255, 122, 0, 0.12)');
  grad.addColorStop(1, 'rgba(255, 122, 0, 0.00)');
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.restore();

  // Trazar Línea Glowing Naranja
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(coords[0].x, coords[0].y);

  for (let i = 0; i < coords.length - 1; i++) {
    const p0 = coords[i === 0 ? 0 : i - 1];
    const p1 = coords[i];
    const p2 = coords[i + 1];
    const p3 = coords[i + 2 < coords.length ? i + 2 : i + 1];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
  }

  ctx.strokeStyle = '#FF7A00';
  ctx.lineWidth = 2.8;
  ctx.shadowColor = '#FF7A00';
  ctx.shadowBlur = 12;
  ctx.stroke();
  ctx.restore();

  // Etiquetas del Eje X
  ctx.fillStyle = '#8E8E9E';
  ctx.font = '11px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  coords.forEach((c, idx) => {
    if (data.etiquetas && data.etiquetas[idx]) {
      ctx.fillText(data.etiquetas[idx], c.x, h - 8);
    }
  });

  // Ajustar posición del tooltip pin en el punto de pico (índice 7 u 8)
  const pinIdx = Math.min(7, coords.length - 2);
  const pinTarget = coords[pinIdx];
  const pinEl = document.getElementById('tooltip-pin-spline');
  if (pinEl && pinTarget) {
    pinEl.style.left = `${(pinTarget.x / w) * 100}%`;
    pinEl.style.top = `${(pinTarget.y / h) * 100}%`;
    const lblEtiqueta = (data.etiquetas && data.etiquetas[pinIdx]) ? data.etiquetas[pinIdx] : 'D-DAY';
    pinEl.innerHTML = `<span class="texto-mono">${lblEtiqueta}</span> · <strong>${data.tasa}</strong> (${data.locales})`;
  }
}

function cambiarHorizonteAnalista(periodo, btn) {
  estadoAnalista.horizonteActual = periodo;
  document.querySelectorAll('.time-pill-btn').forEach(b => b.classList.remove('activo'));
  if (btn) btn.classList.add('activo');

  const d = DATASETS_ANALISTA[periodo] || DATASETS_ANALISTA['1month'];
  const elLocales = document.getElementById('hero-kpi-locales');
  const elSub = document.getElementById('hero-subtitulo-tasa');
  const elFis = document.getElementById('val-despacho-fisico');
  const elPnp = document.getElementById('val-custodia-pnp');

  if (elLocales) elLocales.textContent = d.locales;
  if (elSub) elSub.innerHTML = d.sub;
  if (elFis) elFis.textContent = d.fisico;
  if (elPnp) elPnp.textContent = d.pnp;

  redimensionarSplineHero();
  mostrarToast(`Horizonte de análisis: ${periodo.toUpperCase()}`, 'info');
}

// Este apartado sirve para inicializar los modelos 3D interactivos de telemetría y gemelo digital GIS
const PARTICULAS_NIEVE_TICLIO = [];
for (let i = 0; i < 75; i++) {
  PARTICULAS_NIEVE_TICLIO.push({
    x: (Math.random() - 0.5) * 360,
    y: (Math.random() - 0.5) * 220 - 40,
    z: (Math.random() - 0.5) * 260,
    vx: -0.7 - Math.random() * 0.9,
    vy: 0.4 + Math.random() * 0.7,
    size: 1.0 + Math.random() * 2.2,
    alpha: 0.25 + Math.random() * 0.75
  });
}

function inicializarModelosVideo() {
  const canvas = document.getElementById('canvas-video-modelos-3d');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  let startX = 0, startY = 0, startTime = 0;

  // Manejadores de arrastre y toque para rotar en 3D
  const onPointerDown = (clientX, clientY) => {
    estadoAnalista.arrastrando = true;
    estadoAnalista.ultimoMouseX = clientX;
    estadoAnalista.ultimoMouseY = clientY;
    startX = clientX;
    startY = clientY;
    startTime = Date.now();
  };

  const onPointerMove = (clientX, clientY) => {
    if (!estadoAnalista.arrastrando) return;
    const dx = clientX - estadoAnalista.ultimoMouseX;
    const dy = clientY - estadoAnalista.ultimoMouseY;
    estadoAnalista.rotacionY += dx * 0.007;
    estadoAnalista.rotacionX = Math.max(-0.25, Math.min(1.25, estadoAnalista.rotacionX + dy * 0.007));
    estadoAnalista.ultimoMouseX = clientX;
    estadoAnalista.ultimoMouseY = clientY;
  };

  const onPointerUp = (clientX, clientY) => {
    if (!estadoAnalista.arrastrando) return;
    estadoAnalista.arrastrando = false;

    // Detección de tap/click sin desplazamiento
    const dist = Math.hypot(clientX - startX, clientY - startY);
    const dt = Date.now() - startTime;
    if (dist < 10 && dt < 450) {
      procesarClickEscenario3D(clientX, clientY, canvas);
    }
  };

  if (canvas.dataset.dragInitialized !== 'true') {
    canvas.dataset.dragInitialized = 'true';
    canvas.addEventListener('mousedown', (e) => onPointerDown(e.clientX, e.clientY));
    window.addEventListener('mousemove', (e) => onPointerMove(e.clientX, e.clientY));
    window.addEventListener('mouseup', (e) => onPointerUp(e.clientX, e.clientY));

    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    window.addEventListener('touchend', (e) => {
      if (e.changedTouches.length === 1) onPointerUp(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    });
  }

  if (estadoAnalista.animacionId) {
    cancelAnimationFrame(estadoAnalista.animacionId);
  }

  function loop() {
    const vista = document.getElementById('vista-analista-datos');
    if (!vista || vista.classList.contains('activa')) {
      if (!estadoAnalista.arrastrando && estadoAnalista.autoRotar !== false) {
        estadoAnalista.rotacionY += 0.0022;
      }
      const currentRect = canvas.getBoundingClientRect();
      if (currentRect.width > 0 && currentRect.height > 0) {
        dibujarModeloVideo3D(ctx, currentRect.width, currentRect.height);
      }
    }
    estadoAnalista.animacionId = requestAnimationFrame(loop);
  }

  loop();
}

function procesarClickEscenario3D(clientX, clientY, canvas) {
  const r = canvas.getBoundingClientRect();
  const mx = clientX - r.left;
  const my = clientY - r.top;
  const cx = r.width / 2;
  const cy = r.height / 2 + 10;

  // Si hace clic en la zona central o en los conos de alerta
  const modal = document.getElementById('modal-popup-incidencia-video');
  if (modal) {
    modal.classList.toggle('visible');
  }
}

// Botones de Cámara Rápida para el Escenario 3D
function centrarTerritorioGIS() {
  estadoAnalista.rotacionY = 0.35;
  estadoAnalista.rotacionX = 0.45;
  if (typeof mostrarToast === 'function') mostrarToast('Cámara centrada en Territorio Nacional GIS', 'info');
}

function enfocarTiclio3D() {
  estadoAnalista.rotacionY = 0.75;
  estadoAnalista.rotacionX = 0.55;
  const modal = document.getElementById('modal-popup-incidencia-video');
  if (modal) modal.classList.add('visible');
  if (typeof mostrarToast === 'function') mostrarToast('Foco 3D: Paso de Ticlio 4,818 msnm (#DEZ-782)', 'warning');
}

function enfocarLimaSur3D() {
  estadoAnalista.rotacionY = -0.25;
  estadoAnalista.rotacionX = 0.35;
  if (typeof mostrarToast === 'function') mostrarToast('Foco 3D: Desvío Panamericana Sur (#GAL-104)', 'error');
}

function toggleRotacionGIS() {
  estadoAnalista.autoRotar = !(estadoAnalista.autoRotar !== false);
  const btn = document.getElementById('btn-pausar-gis');
  if (btn) btn.textContent = estadoAnalista.autoRotar ? 'Pausar' : 'Reanudar';
  if (typeof mostrarToast === 'function') {
    mostrarToast(estadoAnalista.autoRotar ? 'Rotación automática reanudada' : 'Rotación pausada para inspección', 'info');
  }
}

function cambiarModeloVideo(tipo, btn) {
  estadoAnalista.modeloVideoActual = tipo;
  document.querySelectorAll('.video-tab-btn').forEach(b => b.classList.remove('activo'));
  if (btn) btn.classList.add('activo');

  const hud = document.getElementById('hud-telemetria-video');
  if (tipo === 'corredores_gis') {
    if (hud) hud.innerHTML = '<strong style="color:var(--accent-cyan-laser); font-family:JetBrains Mono,monospace;">MODELO: CORREDORES VIALES Y CONOS HOLOGRÁFICOS (GEMELO DIGITAL GIS)</strong><br><span style="font-size:10px; color:#8E8E9E;">4 Arterias: Panamericana Sur, Carretera Central, Fluvial Loreto y Enlace Puno · Relieve Andino 3D</span>';
  } else if (tipo === 'paso_ticlio') {
    if (hud) hud.innerHTML = '<strong style="color:#FFA043; font-family:JetBrains Mono,monospace;">MODELO: GEMELO DIGITAL PASO DE TICLIO 4,818 MSNM (VIDEO 210S)</strong><br><span style="font-size:10px; color:#8E8E9E;">Túnel Anticona · Ventisca de Nieve · Camión Scania R450 #DEZ-782 con Alerta de Frenos (-4.0°C)</span>';
  }

  if (typeof mostrarToast === 'function') mostrarToast(`Modelo 3D activo: ${tipo}`, 'info');
}

function cerrarPopupIncidenciaVideo() {
  const modal = document.getElementById('modal-popup-incidencia-video');
  if (modal) modal.classList.remove('visible');
}

function dibujarModeloVideo3D(ctx, w, h) {
  ctx.clearRect(0, 0, w, h);

  const cx = w / 2;
  const cy = h / 2 + 10;
  const rotY = estadoAnalista.rotacionY;
  const rotX = estadoAnalista.rotacionX;

  // Función de proyección 3D con perspectiva cónica y profundidad
  function project3D(x, y, z) {
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);
    const x1 = x * cosY - z * sinY;
    const z1 = x * sinY + z * cosY;

    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);
    const y2 = y * cosX - z1 * sinX;
    const z2 = y * sinX + z1 * cosX;

    const fov = 420 / (420 + z2);
    return {
      px: cx + x1 * fov,
      py: cy + y2 * fov,
      scale: fov,
      z: z2
    };
  }

  // Fondo sutil con cuadrícula de coordenadas aeroespaciales
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.lineWidth = 1;
  const gridStep = 40;
  for (let gx = 0; gx < w; gx += gridStep) {
    ctx.beginPath();
    ctx.moveTo(gx, 0);
    ctx.lineTo(gx, h);
    ctx.stroke();
  }
  for (let gy = 0; gy < h; gy += gridStep) {
    ctx.beginPath();
    ctx.moveTo(0, gy);
    ctx.lineTo(w, gy);
    ctx.stroke();
  }
  ctx.restore();

  // =========================================================================
  // MODELO 1: CORREDORES VIALES GIS Y GEMELO DIGITAL ANDINO (Video 15s)
  // =========================================================================
  if (estadoAnalista.modeloVideoActual === 'corredores_gis') {
    const t = Date.now() * 0.002;

    // 1. MALLA TOPOGRÁFICA DE RELIEVE (Cordillera de los Andes)
    const pasosX = 14;
    const pasosZ = 12;
    const rangoX = 320;
    const rangoZ = 240;
    const inicioX = -rangoX / 2;
    const inicioZ = -rangoZ / 2;
    const dx = rangoX / pasosX;
    const dz = rangoZ / pasosZ;

    // Función de elevación del relieve peruano
    function getElevacion(x, z) {
      if (x < -70) return 0; // Costa y océano Pacífico
      // Cordillera Central (-50 a 50): picos y cañón de Ticlio
      let cordillera = Math.exp(-Math.pow((x - 10) / 45, 2)) * 85;
      if (Math.abs(x - 20) < 18 && Math.abs(z + 30) < 25) {
        cordillera *= 0.65; // Cañón montañoso de Ticlio
      }
      let selva = Math.sin(x * 0.05) * Math.cos(z * 0.04) * 12;
      if (x > 70) cordillera = 8; // Llanura amazónica

      return -(cordillera + selva);
    }

    // 1.1 Base Volumétrica Inferior (Plataforma Holográfica)
    const basePtsBorde = [
      { x: inicioX, z: inicioZ },
      { x: inicioX + rangoX, z: inicioZ },
      { x: inicioX + rangoX, z: inicioZ + rangoZ },
      { x: inicioX, z: inicioZ + rangoZ }
    ];

    ctx.save();
    for (let i = 0; i < 4; i++) {
      const next = (i + 1) % 4;
      const p1Top = project3D(basePtsBorde[i].x, 0, basePtsBorde[i].z);
      const p2Top = project3D(basePtsBorde[next].x, 0, basePtsBorde[next].z);
      const p1Bot = project3D(basePtsBorde[i].x, 32, basePtsBorde[i].z);
      const p2Bot = project3D(basePtsBorde[next].x, 32, basePtsBorde[next].z);

      ctx.beginPath();
      ctx.moveTo(p1Top.px, p1Top.py);
      ctx.lineTo(p2Top.px, p2Top.py);
      ctx.lineTo(p2Bot.px, p2Bot.py);
      ctx.lineTo(p1Bot.px, p1Bot.py);
      ctx.closePath();
      ctx.fillStyle = i % 2 === 0 ? 'rgba(8, 16, 28, 0.92)' : 'rgba(12, 22, 38, 0.92)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.25)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.restore();

    // 1.2 Malla Wireframe Topográfica con Relieve
    ctx.save();
    for (let i = 0; i <= pasosX; i++) {
      const x = inicioX + i * dx;
      ctx.beginPath();
      for (let j = 0; j <= pasosZ; j++) {
        const z = inicioZ + j * dz;
        const y = getElevacion(x, z);
        const p = project3D(x, y, z);
        if (j === 0) ctx.moveTo(p.px, p.py);
        else ctx.lineTo(p.px, p.py);
      }
      ctx.strokeStyle = (i % 3 === 0) ? 'rgba(34, 211, 238, 0.35)' : 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = (i % 3 === 0) ? 1.2 : 0.8;
      ctx.stroke();
    }

    for (let j = 0; j <= pasosZ; j++) {
      const z = inicioZ + j * dz;
      ctx.beginPath();
      for (let i = 0; i <= pasosX; i++) {
        const x = inicioX + i * dx;
        const y = getElevacion(x, z);
        const p = project3D(x, y, z);
        if (i === 0) ctx.moveTo(p.px, p.py);
        else ctx.lineTo(p.px, p.py);
      }
      ctx.strokeStyle = (j % 3 === 0) ? 'rgba(16, 185, 129, 0.35)' : 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = (j % 3 === 0) ? 1.2 : 0.8;
      ctx.stroke();
    }
    ctx.restore();

    // 1.3 Curvas de Nivel Holográficas (Isolíneas de Altitud)
    const isolineas = [-20, -45, -70, -85];
    const coloresIso = ['rgba(16, 185, 129, 0.6)', 'rgba(34, 211, 238, 0.6)', 'rgba(255, 160, 67, 0.7)', 'rgba(240, 67, 90, 0.8)'];

    ctx.save();
    isolineas.forEach((isoY, idx) => {
      ctx.beginPath();
      for (let i = 0; i <= pasosX; i++) {
        const x = inicioX + i * dx;
        for (let j = 0; j <= pasosZ; j++) {
          const z = inicioZ + j * dz;
          const y = getElevacion(x, z);
          if (Math.abs(y - isoY) < 14) {
            const p = project3D(x, isoY, z);
            ctx.lineTo(p.px, p.py);
            break;
          }
        }
      }
      ctx.strokeStyle = coloresIso[idx];
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
    });
    ctx.setLineDash([]);
    ctx.restore();

    // 1.4 Radar Holográfico Giratorio en Lima IOC
    const pLima = project3D(-65, 0, 30);
    const radioRadar = 55 + Math.sin(t * 1.5) * 8;
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(pLima.px, pLima.py, radioRadar * pLima.scale, radioRadar * 0.45 * pLima.scale, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(pLima.px, pLima.py, (radioRadar * 0.6) * pLima.scale, (radioRadar * 0.27) * pLima.scale, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.45)';
    ctx.stroke();

    // Rayo escáner giratorio
    const anguloScan = t * 1.8;
    const scanX = pLima.px + Math.cos(anguloScan) * radioRadar * pLima.scale;
    const scanY = pLima.py + Math.sin(anguloScan) * (radioRadar * 0.45) * pLima.scale;
    ctx.beginPath();
    ctx.moveTo(pLima.px, pLima.py);
    ctx.lineTo(scanX, scanY);
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.7)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    // 2. CORREDORES VIALES CON ILUMINACIÓN NEÓN Y CINTAS
    // Corredor 1: Panamericana Sur (Costa)
    const rutaPanamSur = [
      { x: -140, y: 0, z: 90 },
      { x: -100, y: 0, z: 65 },
      { x: -65, y: 0, z: 30 },  // Lima
      { x: -30, y: 0, z: 15 },
      { x: 20, y: -8, z: 25 },
      { x: 80, y: -15, z: 50 },
      { x: 130, y: -22, z: 80 } // Arequipa
    ];

    ctx.save();
    ctx.beginPath();
    rutaPanamSur.forEach((pt, i) => {
      const p = project3D(pt.x, pt.y - 3, pt.z);
      if (i === 0) ctx.moveTo(p.px, p.py);
      else ctx.lineTo(p.px, p.py);
    });
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.25)';
    ctx.lineWidth = 9;
    ctx.stroke();

    ctx.beginPath();
    rutaPanamSur.forEach((pt, i) => {
      const p = project3D(pt.x, pt.y - 3, pt.z);
      if (i === 0) ctx.moveTo(p.px, p.py);
      else ctx.lineTo(p.px, p.py);
    });
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 3.5;
    ctx.shadowColor = '#10B981';
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Chevrons direccionales animados (Pulso de flujo de despacho)
    const pulsoOffset = (Date.now() * 0.05) % 24;
    ctx.setLineDash([8, 16]);
    ctx.lineDashOffset = -pulsoOffset;
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // Corredor 2: Carretera Central hacia Ticlio (Eje Crítico Andino)
    const rutaCarreteraCentral = [
      { x: -65, y: 0, z: 30 },   // Lima IOC
      { x: -35, y: -18, z: 10 }, // Chosica
      { x: -5, y: -45, z: -10 }, // Matucana
      { x: 20, y: -80, z: -35 }, // San Mateo
      { x: 35, y: -92, z: -45 }, // Ticlio 4,818m (Alerta)
      { x: 65, y: -72, z: -60 }, // La Oroya
      { x: 105, y: -48, z: -70 } // Huancayo
    ];

    ctx.save();
    ctx.beginPath();
    rutaCarreteraCentral.forEach((pt, i) => {
      const p = project3D(pt.x, pt.y - 3, pt.z);
      if (i === 0) ctx.moveTo(p.px, p.py);
      else ctx.lineTo(p.px, p.py);
    });
    ctx.strokeStyle = 'rgba(240, 67, 90, 0.3)';
    ctx.lineWidth = 10;
    ctx.stroke();

    ctx.beginPath();
    rutaCarreteraCentral.forEach((pt, i) => {
      const p = project3D(pt.x, pt.y - 3, pt.z);
      if (i === 0) ctx.moveTo(p.px, p.py);
      else ctx.lineTo(p.px, p.py);
    });
    ctx.strokeStyle = '#F0435A';
    ctx.lineWidth = 4;
    ctx.shadowColor = '#F0435A';
    ctx.shadowBlur = 12;
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.restore();

    // Corredor 3: Eje Fluvial Loreto / Ucayali (Amazonía)
    const rutaFluvialLoreto = [
      { x: 45, y: -10, z: -85 },
      { x: 80, y: -8, z: -65 },
      { x: 110, y: -6, z: -40 },
      { x: 145, y: -5, z: -20 }
    ];

    ctx.save();
    ctx.beginPath();
    rutaFluvialLoreto.forEach((pt, i) => {
      const p = project3D(pt.x, pt.y - 2, pt.z);
      if (i === 0) ctx.moveTo(p.px, p.py);
      else ctx.lineTo(p.px, p.py);
    });
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.7)';
    ctx.lineWidth = 3.5;
    ctx.setLineDash([12, 6]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // Corredor 4: Desvío Vial Ilegal Lima Sur (Galaga SAC #GAL-104)
    const rutaDesvio = [
      { x: -65, y: 0, z: 30 },
      { x: -75, y: 0, z: 48 },
      { x: -92, y: 0, z: 58 } // Desvío 3.4 km
    ];
    ctx.save();
    ctx.beginPath();
    rutaDesvio.forEach((pt, i) => {
      const p = project3D(pt.x, pt.y - 3, pt.z);
      if (i === 0) ctx.moveTo(p.px, p.py);
      else ctx.lineTo(p.px, p.py);
    });
    ctx.strokeStyle = '#FF0033';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // 3. CONOS HOLOGRÁFICOS DE ALERTA VOLUMÉTRICA CON LÁSER
    // Nodo 1: Ticlio 4,818 msnm (Scania R450 Detenido)
    const pTiclioBase = project3D(35, -92, -45);
    const pTiclioApex = project3D(35, -195, -45);

    ctx.save();
    // Ondas concéntricas expansivas en el suelo
    const pulsoTiclio = (t * 2) % 1;
    for (let r = 1; r <= 3; r++) {
      const radioOnda = (r * 12 + pulsoTiclio * 14) * pTiclioBase.scale;
      const alphaOnda = Math.max(0, 1 - (radioOnda / 50));
      ctx.beginPath();
      ctx.ellipse(pTiclioBase.px, pTiclioBase.py, radioOnda, radioOnda * 0.45, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(240, 67, 90, ${alphaOnda * 0.8})`;
      ctx.lineWidth = 1.8;
      ctx.stroke();
    }

    // Cuerpo translúcido volumétrico del cono
    const gradConoTiclio = ctx.createLinearGradient(pTiclioApex.px, pTiclioApex.py, pTiclioBase.px, pTiclioBase.py);
    gradConoTiclio.addColorStop(0, 'rgba(240, 67, 90, 0.95)');
    gradConoTiclio.addColorStop(0.4, 'rgba(240, 67, 90, 0.45)');
    gradConoTiclio.addColorStop(1, 'rgba(240, 67, 90, 0.08)');

    ctx.beginPath();
    ctx.moveTo(pTiclioApex.px, pTiclioApex.py);
    ctx.lineTo(pTiclioBase.px - 22 * pTiclioBase.scale, pTiclioBase.py);
    ctx.lineTo(pTiclioBase.px + 22 * pTiclioBase.scale, pTiclioBase.py);
    ctx.closePath();
    ctx.fillStyle = gradConoTiclio;
    ctx.fill();
    ctx.strokeStyle = 'rgba(240, 67, 90, 0.6)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Haz láser vertical central
    ctx.beginPath();
    ctx.moveTo(pTiclioApex.px, pTiclioApex.py);
    ctx.lineTo(pTiclioBase.px, pTiclioBase.py);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#F0435A';
    ctx.shadowBlur = 14;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Vértice superior con baliza parpadeante
    ctx.beginPath();
    ctx.arc(pTiclioApex.px, pTiclioApex.py, 6 * pTiclioApex.scale, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = '#F0435A';
    ctx.shadowBlur = 18;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Cartel flotante de telemetría de Ticlio (Estilo Video 15s)
    const cardX = pTiclioApex.px + 14;
    const cardY = pTiclioApex.py - 18;
    ctx.fillStyle = 'rgba(8, 14, 24, 0.92)';
    ctx.strokeStyle = '#F0435A';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, 175, 48, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#F0435A';
    ctx.font = 'bold 10px "JetBrains Mono", monospace';
    ctx.fillText('TICLIO 4,818m · ALERTA MECÁNICA', cardX + 8, cardY + 14);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillText('Scania #DEZ-782 · Temp: -4.0°C', cardX + 8, cardY + 28);
    ctx.fillStyle = '#22D3EE';
    ctx.fillText('Auxilio Provías arribando en 12m', cardX + 8, cardY + 41);
    ctx.restore();

    // Nodo 2: Lima Sur Lurín (#GAL-104 - Desvío de Geocerca)
    const pSJMBase = project3D(-92, 0, 58);
    const pSJMApex = project3D(-92, -130, 58);

    ctx.save();
    // Geocerca perimetral quebrada (Círculo rojo punteado)
    ctx.beginPath();
    ctx.ellipse(pSJMBase.px, pSJMBase.py, 28 * pSJMBase.scale, 14 * pSJMBase.scale, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 0, 51, 0.85)';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Cono de Alerta
    ctx.beginPath();
    ctx.moveTo(pSJMApex.px, pSJMApex.py);
    ctx.lineTo(pSJMBase.px - 14 * pSJMBase.scale, pSJMBase.py);
    ctx.lineTo(pSJMBase.px + 14 * pSJMBase.scale, pSJMBase.py);
    ctx.closePath();
    const gradSJM = ctx.createLinearGradient(pSJMApex.px, pSJMApex.py, pSJMBase.px, pSJMBase.py);
    gradSJM.addColorStop(0, 'rgba(255, 0, 51, 0.9)');
    gradSJM.addColorStop(1, 'rgba(255, 0, 51, 0.1)');
    ctx.fillStyle = gradSJM;
    ctx.fill();

    // Vértice
    ctx.beginPath();
    ctx.arc(pSJMApex.px, pSJMApex.py, 5 * pSJMApex.scale, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = '#FF0033';
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Etiqueta flotante
    const sjmCardX = pSJMApex.px - 165;
    const sjmCardY = pSJMApex.py - 12;
    ctx.fillStyle = 'rgba(12, 10, 16, 0.92)';
    ctx.strokeStyle = '#FF0033';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(sjmCardX, sjmCardY, 155, 42, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#FF0033';
    ctx.font = 'bold 9.5px "JetBrains Mono", monospace';
    ctx.fillText('DESVÍO VIAL #GAL-104', sjmCardX + 8, sjmCardY + 14);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '8.5px "JetBrains Mono", monospace';
    ctx.fillText('Desvío 3.4 km · Fianza S/ 64k', sjmCardX + 8, sjmCardY + 26);
    ctx.fillStyle = '#10B981';
    ctx.fillText('Patrulla PNP interceptando', sjmCardX + 8, sjmCardY + 37);
    ctx.restore();

    // Nodo 3: ODPE Maynas / Loreto (Conforme Fluvial)
    const pLoretoBase = project3D(145, -5, -20);
    const pLoretoApex = project3D(145, -95, -20);

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(pLoretoApex.px, pLoretoApex.py);
    ctx.lineTo(pLoretoBase.px - 10 * pLoretoBase.scale, pLoretoBase.py);
    ctx.lineTo(pLoretoBase.px + 10 * pLoretoBase.scale, pLoretoBase.py);
    ctx.closePath();
    ctx.fillStyle = 'rgba(34, 211, 238, 0.4)';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(pLoretoApex.px, pLoretoApex.py, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#22D3EE';
    ctx.fill();

    ctx.fillStyle = '#22D3EE';
    ctx.font = 'bold 9px "JetBrains Mono", monospace';
    ctx.fillText('LORETO #DEZ-365 (OK)', pLoretoApex.px - 45, pLoretoApex.py - 8);
    ctx.restore();

    // 4. MICRO-MODELOS 3D DE VEHÍCULOS / CONVOYS EN MOVIMIENTO
    ctx.save();
    // Convoy en Panamericana Sur (#DEZ-528 - En movimiento fluido)
    const convProg = (Date.now() * 0.00035) % 1;
    const idxRuta = Math.floor(convProg * (rutaPanamSur.length - 1));
    const subProg = (convProg * (rutaPanamSur.length - 1)) - idxRuta;
    const ptA = rutaPanamSur[idxRuta];
    const ptB = rutaPanamSur[idxRuta + 1] || ptA;
    const vX = ptA.x + (ptB.x - ptA.x) * subProg;
    const vY = ptA.y + (ptB.y - ptA.y) * subProg;
    const vZ = ptA.z + (ptB.z - ptA.z) * subProg;

    const pCamion = project3D(vX, vY - 4, vZ);
    // Dibujo del furgón 3D miniatura
    ctx.fillStyle = '#10B981';
    ctx.beginPath();
    ctx.roundRect(pCamion.px - 8 * pCamion.scale, pCamion.py - 5 * pCamion.scale, 16 * pCamion.scale, 10 * pCamion.scale, 2);
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Luces delanteras proyectadas en el suelo
    ctx.beginPath();
    ctx.moveTo(pCamion.px + 6 * pCamion.scale, pCamion.py);
    ctx.lineTo(pCamion.px + 24 * pCamion.scale, pCamion.py - 6 * pCamion.scale);
    ctx.lineTo(pCamion.px + 24 * pCamion.scale, pCamion.py + 6 * pCamion.scale);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.fill();

    // Etiqueta del convoy
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 8.5px "JetBrains Mono", monospace';
    ctx.fillText('#DEZ-528 (74 km/h)', pCamion.px - 32, pCamion.py - 8 * pCamion.scale);
    ctx.restore();

    // 5. GIROSCOPIO Y BRÚJULA TÁCTICA HOLOGRÁFICA (Esquina Superior Derecha)
    ctx.save();
    const gyroX = w - 55;
    const gyroY = 50;
    const gyroR = 26;

    ctx.beginPath();
    ctx.arc(gyroX, gyroY, gyroR, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Aguja norte giratoria
    const anguloNorte = -rotY;
    const nx = gyroX + Math.sin(anguloNorte) * (gyroR - 4);
    const ny = gyroY - Math.cos(anguloNorte) * (gyroR - 4);
    const sx = gyroX - Math.sin(anguloNorte) * (gyroR - 4);
    const sy = gyroY + Math.cos(anguloNorte) * (gyroR - 4);

    ctx.beginPath();
    ctx.moveTo(nx, ny);
    ctx.lineTo(gyroX + Math.cos(anguloNorte) * 4, gyroY + Math.sin(anguloNorte) * 4);
    ctx.lineTo(sx, sy);
    ctx.strokeStyle = '#F0435A';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.fillStyle = '#F0435A';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('N', nx, ny - 3);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '7.5px monospace';
    ctx.fillText(`${Math.round((rotY * 180 / Math.PI) % 360)}°`, gyroX, gyroY + gyroR + 10);
    ctx.textAlign = 'left';
    ctx.restore();

    // Barra de telemetría inferior en el canvas
    ctx.save();
    ctx.fillStyle = 'rgba(6, 12, 20, 0.85)';
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(14, h - 34, w - 28, 24, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#22D3EE';
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillText('TEL: LAT -12.0464 · LON -77.0428 | CORREDORES: 4 ACTIVOS | CONVOYS AUDITADOS: 12/12 | MPLS SHA-256: CONFORME', 24, h - 18);
    ctx.restore();

  // =========================================================================
  // MODELO 2: GEMELO DIGITAL PASO DE TICLIO 4,818 MSNM (Video 210s)
  // =========================================================================
  } else if (estadoAnalista.modeloVideoActual === 'paso_ticlio') {
    const t = Date.now() * 0.002;

    // 1. MONTAÑA ANDINA WIREFRAME (Sección Transversal de Alta Precisión)
    ctx.save();
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.22)';
    ctx.lineWidth = 1;

    for (let x = -200; x <= 200; x += 25) {
      ctx.beginPath();
      for (let z = -140; z <= 140; z += 18) {
        const distPico = Math.sqrt(x * x + z * z);
        const alt = -Math.max(0, 140 - distPico * 0.7) + Math.sin(x * 0.05) * 15;
        const p = project3D(x, alt, z);
        if (z === -140) ctx.moveTo(p.px, p.py);
        else ctx.lineTo(p.px, p.py);
      }
      ctx.stroke();
    }
    ctx.restore();

    // 2. PORTAL DOBLE DEL TÚNEL / PASO DE TICLIO (4,818 msnm)
    ctx.save();
    ctx.fillStyle = '#141824';
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.7)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(cx - 110, cy - 40, 220, 95, [14, 14, 0, 0]);
    ctx.fill();
    ctx.stroke();

    for (let offset of [-50, 50]) {
      ctx.fillStyle = '#06080E';
      ctx.beginPath();
      ctx.arc(cx + offset, cy + 20, 32, Math.PI, 0);
      ctx.lineTo(cx + offset + 32, cy + 55);
      ctx.lineTo(cx + offset - 32, cy + 55);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx + offset, cy + 20, 30, Math.PI, 0);
      ctx.strokeStyle = offset === -50 ? 'rgba(255, 160, 67, 0.8)' : 'rgba(16, 185, 129, 0.8)';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 12px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('PASO DE TICLIO · ABRA DE ANTICONA (4,818 msnm)', cx, cy - 20);

    ctx.fillStyle = '#F0435A';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillText('TÚNEL OESTE: AUXILIO VIAL ACTIVO', cx - 50, cy - 50);

    ctx.fillStyle = '#10B981';
    ctx.fillText('TÚNEL ESTE: TRÁNSITO CONFORME', cx + 50, cy - 50);
    ctx.textAlign = 'left';

    // 3. CAMIÓN SCANIA R450 DETENIDO EN BAHÍA DE AUXILIO
    const camionX = cx - 50;
    const camionY = cy + 38;
    ctx.fillStyle = '#E11D48';
    ctx.beginPath();
    ctx.roundRect(camionX - 22, camionY - 12, 44, 20, 4);
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    if (Math.floor(Date.now() / 300) % 2 === 0) {
      ctx.beginPath();
      ctx.arc(camionX - 22, camionY - 6, 4, 0, Math.PI * 2);
      ctx.arc(camionX + 22, camionY - 6, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#FFB800';
      ctx.shadowColor = '#FFB800';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
    ctx.restore();

    // 4. PARTÍCULAS DE NIEVE / VENTISCA ANDINA
    ctx.save();
    PARTICULAS_NIEVE_TICLIO.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -180) p.x = 180;
      if (p.y > 100) p.y = -100;

      ctx.beginPath();
      ctx.arc(cx + p.x, cy + p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
      ctx.fill();
    });
    ctx.restore();

    // 5. GAUGES TÉRMICOS Y DE PRESIÓN EN PANTALLA
    ctx.save();
    ctx.fillStyle = 'rgba(10, 16, 26, 0.9)';
    ctx.strokeStyle = 'rgba(240, 67, 90, 0.5)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(16, 16, 210, 75, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#F0435A';
    ctx.font = 'bold 11px "JetBrains Mono", monospace';
    ctx.fillText('SENSOR TÉRMICO KM 132', 26, 34);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillText('Temperatura: -4.0°C (Helada Severa)', 26, 50);
    ctx.fillText('Presión de Frenos: 4.8 bar (Crítica)', 26, 64);
    ctx.fillText('Precinto Electrónico: 98% Batería (OK)', 26, 78);
    ctx.restore();
  }
}


// 3. INTERACCIONES DE TARJETAS FÍSICAS Y AUDITORÍA
function rotarTarjetaFisica(tier) {
  const cards = document.querySelectorAll('.physical-card-item');
  cards.forEach(c => {
    c.className = c.className.replace(/card-tier-[123]/, (m) => {
      if (m === 'card-tier-1') return 'card-tier-3';
      if (m === 'card-tier-2') return 'card-tier-1';
      return 'card-tier-2';
    });
  });
  mostrarToast(`Rotación de credencial física nivel ${tier || 1} en vista 3D`, 'info');
}

function abrirModalAuditoriaPrecinto() {
  mostrarToast('Iniciando auditoría de precinto criptográfico SHA-256...', 'info');
  setTimeout(() => {
    mostrarToast('Precinto Conforme: Hash verificado en Blockchain Electoral ONPE', 'exito');
  }, 900);
}

function activarProtocoloAuxilioPNP() {
  mostrarToast('Protocolo Activado: Auxilio PNP y Remolque Provías despachado a Ticlio', 'alerta');
  // Agregar novedad en bitácora si existe
  const lista = document.getElementById('lista-novedades-bitacora');
  if (lista) {
    const item = document.createElement('div');
    item.className = 'bitacora-item-historial';
    item.innerHTML = `<span class="badge-estado badge-critica" style="font-size:10px;">PNP AUXILIO</span> <span class="texto-mono" style="color:var(--cian); font-size:11px;">06:48 UTC-5</span><p style="margin:4px 0 0 0; font-size:12px; color:#FFFFFF;">Despacho de auxilio mecánico y resguardo PNP al Paso de Ticlio (#DEZ-782).</p>`;
    lista.prepend(item);
  }
}

function activarComiteCrisis() {
  mostrarToast('Comité de Crisis Conjunto (ONPE-PNP-JNE) convocado en Turno D-DAY', 'alerta');
}

function centrarVehiculoEnMapa(idVehiculo) {
  cambiarVistaWeb('dashboard');
  setTimeout(() => {
    if (typeof inspeccionarVehiculo === 'function') {
      inspeccionarVehiculo(idVehiculo);
    }
  }, 250);
}

function filtrarBarrasDespacho(eje) {
  const cont = document.getElementById('contenedor-barras-despacho');
  if (!cont) return;
  const presets = {
    todos: [
      { label: '200 u.', h: '38%', hora: '02:00', pico: false },
      { label: '300 u.', h: '58%', hora: '04:00', pico: false },
      { label: '400 u.', h: '75%', hora: '06:00', pico: false },
      { label: '500 Pico', h: '95%', hora: '08:00', pico: true },
      { label: '400 u.', h: '72%', hora: '10:00', pico: false },
      { label: '350 u.', h: '52%', hora: '12:00', pico: false }
    ],
    sur: [
      { label: '90 u.', h: '42%', hora: '02:00', pico: false },
      { label: '140 u.', h: '64%', hora: '04:00', pico: false },
      { label: '195 u.', h: '88%', hora: '06:00', pico: true },
      { label: '160 u.', h: '72%', hora: '08:00', pico: false },
      { label: '120 u.', h: '54%', hora: '10:00', pico: false },
      { label: '85 u.', h: '38%', hora: '12:00', pico: false }
    ],
    centro: [
      { label: '65 u.', h: '35%', hora: '02:00', pico: false },
      { label: '110 u.', h: '56%', hora: '04:00', pico: false },
      { label: '150 u.', h: '76%', hora: '06:00', pico: false },
      { label: '185 Pico', h: '92%', hora: '08:00', pico: true },
      { label: '130 u.', h: '65%', hora: '10:00', pico: false },
      { label: '95 u.', h: '48%', hora: '12:00', pico: false }
    ],
    fluvial: [
      { label: '30 u.', h: '32%', hora: '02:00', pico: false },
      { label: '55 u.', h: '50%', hora: '04:00', pico: false },
      { label: '95 Pico', h: '86%', hora: '06:00', pico: true },
      { label: '80 u.', h: '74%', hora: '08:00', pico: false },
      { label: '60 u.', h: '55%', hora: '10:00', pico: false },
      { label: '45 u.', h: '40%', hora: '12:00', pico: false }
    ]
  };
  const datos = presets[eje] || presets.todos;
  cont.innerHTML = datos.map(d => `
    <div class="bar-column-item">
      ${d.pico ? '' : `<span style="font-size:10px; color:#8E8E9E; font-family:'JetBrains Mono',monospace;">${d.label}</span>`}
      <div class="bar-tube-track">
        ${d.pico ? `<span class="floating-bar-badge">${d.label}</span>` : ''}
        <div class="bar-tube-fill ${d.pico ? 'highlight-peak' : ''}" style="height: ${d.h};"></div>
      </div>
      <span class="bar-label-month" ${d.pico ? 'style="color:var(--accent-green-neon); font-weight:700;"' : ''}>${d.hora}</span>
    </div>
  `).join('');
  mostrarToast(`Filtro de barras aplicado: ${eje.toUpperCase()}`, 'info');
}

// SIMULADOR XAI INTERACTIVO (TREESHAP ADITIVO COHERENTE CON BACKEND)
function cambiarVehiculoXAI(vehId) {
  const sliderRetraso = document.getElementById('sim-slider-retraso');
  const sliderPenal = document.getElementById('sim-slider-penalidades');
  const sliderRuta = document.getElementById('sim-slider-ruta');

  if (vehId === '#GAL-104') {
    if (sliderRetraso) sliderRetraso.value = 105;
    if (sliderPenal) sliderPenal.value = 40;
    if (sliderRuta) sliderRuta.value = 16;
  } else if (vehId === '#DEZ-782') {
    if (sliderRetraso) sliderRetraso.value = 80;
    if (sliderPenal) sliderPenal.value = 8;
    if (sliderRuta) sliderRuta.value = 25;
  } else if (vehId === '#DEZ-365') {
    if (sliderRetraso) sliderRetraso.value = 35;
    if (sliderPenal) sliderPenal.value = 5;
    if (sliderRuta) sliderRuta.value = 18;
  } else {
    if (sliderRetraso) sliderRetraso.value = 5;
    if (sliderPenal) sliderPenal.value = 0;
    if (sliderRuta) sliderRuta.value = 4;
  }

  simularRiesgoXAI();
}

function simularRiesgoXAI() {
  const ret = parseInt(document.getElementById('sim-slider-retraso')?.value || 105, 10);
  const pen = parseInt(document.getElementById('sim-slider-penalidades')?.value || 40, 10);
  const rut = parseInt(document.getElementById('sim-slider-ruta')?.value || 16, 10);

  const txtRet = document.getElementById('sim-txt-retraso');
  const txtPen = document.getElementById('sim-txt-penalidades');
  const txtRut = document.getElementById('sim-txt-ruta');

  if (txtRet) txtRet.textContent = ret + ' min';
  if (txtPen) txtPen.textContent = pen + '%';
  if (txtRut) txtRut.textContent = rut + '%';

  // Fórmula TreeSHAP Aditiva Normalizada (idéntica a simulador_backend.js)
  const phi0 = 0.05;
  const phiPen = (pen / 50) * 0.40;
  const phiRet = (ret / 180) * 0.35;
  const phiRut = (rut / 30) * 0.19;
  const probTotal = Math.min(0.999, Math.max(0.012, phi0 + phiPen + phiRet + phiRut)).toFixed(3);

  const txtScore = document.getElementById('sim-score-total');
  const txtBadge = document.getElementById('sim-estado-badge');

  if (txtScore) txtScore.textContent = probTotal;

  if (txtBadge) {
    if (probTotal >= 0.70) {
      txtBadge.textContent = 'RIESGO EXTREMO / INCUMPLIMIENTO';
      txtBadge.style.color = 'var(--rojo-critico)';
      if (txtScore) txtScore.style.color = 'var(--rojo-critico)';
    } else if (probTotal >= 0.40) {
      txtBadge.textContent = 'ALERTA PREVENTIVA / MONITOREO';
      txtBadge.style.color = 'var(--ambar-alerta)';
      if (txtScore) txtScore.style.color = 'var(--ambar-alerta)';
    } else {
      txtBadge.textContent = 'OPERACIÓN CONFORME / SEGURO';
      txtBadge.style.color = 'var(--verde-exito)';
      if (txtScore) txtScore.style.color = 'var(--verde-exito)';
    }
  }

  // Actualizar contribuciones visuales de barras en el simulador si existen
  const barRet = document.getElementById('sim-bar-retraso');
  const barPen = document.getElementById('sim-bar-penalidades');
  const barRut = document.getElementById('sim-bar-ruta');
  const lblPhiRet = document.getElementById('sim-phi-retraso');
  const lblPhiPen = document.getElementById('sim-phi-penalidades');
  const lblPhiRut = document.getElementById('sim-phi-ruta');
  if (barRet) barRet.style.width = `${Math.min(100, Math.round(phiRet * 100 / 0.40))}%`;
  if (barPen) barPen.style.width = `${Math.min(100, Math.round(phiPen * 100 / 0.40))}%`;
  if (barRut) barRut.style.width = `${Math.min(100, Math.round(phiRut * 100 / 0.40))}%`;
  if (lblPhiRet) lblPhiRet.textContent = `+${phiRet.toFixed(3)}`;
  if (lblPhiPen) lblPhiPen.textContent = `+${phiPen.toFixed(3)}`;
  if (lblPhiRut) lblPhiRut.textContent = `+${phiRut.toFixed(3)}`;
}

function exportarReporteAnalistaCompleto() {
  const lineas = [
    'Codigo_ODPE,Nombre_ODPE,Locales,Tasa_Despliegue,SLA_Logistico,Estado_Custodia',
    'ODPE-01,Lima Centro,420,99.4%,Conforme,Custodia PNP Verificada',
    'ODPE-02,Lima Sur (SJM),211,72.1%,Alerta Roja,Galaga SAC - Retraso 1.5h',
    'ODPE-03,Huancavelica,185,84.2%,Alerta Amarilla,Paso de Ticlio - Falla Scania',
    'ODPE-04,Arequipa,390,98.8%,Conforme,Custodia PNP Verificada',
    'ODPE-05,Loreto (Maynas),240,96.5%,Conforme,Transporte Fluvial Starlink',
    'ODPE-06,Puno,310,95.1%,Conforme,Red Privada MPLS Dedicada'
  ];
  const blob = new Blob([lineas.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `ONPE_Vision_Analitica_DDay_${new Date().toISOString().substring(0,10)}.csv`;
  link.click();
  mostrarToast('Reporte analítico CSV descargado exitosamente', 'exito');
}

// 4. COMMAND PALETTE (⌘ + Space / Ctrl + K)
function inicializarCommandPalette() {
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && (e.code === 'Space' || e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      abrirCommandPalette();
    } else if (e.key === 'Escape') {
      cerrarCommandPalette();
    }
  });
}

function abrirCommandPalette() {
  const modal = document.getElementById('modal-command-palette');
  const input = document.getElementById('input-command-palette');
  if (modal) {
    modal.classList.add('abierto');
    if (input) {
      input.value = '';
      setTimeout(() => input.focus(), 50);
    }
  }
}

function cerrarCommandPalette(e) {
  const modal = document.getElementById('modal-command-palette');
  if (modal) modal.classList.remove('abierto');
}

function filtrarCommandPalette(q) {
  const query = q.toLowerCase().trim();
  const items = document.querySelectorAll('.command-result-item');
  items.forEach(it => {
    const texto = it.textContent.toLowerCase();
    it.style.display = texto.includes(query) ? 'flex' : 'none';
  });
}

function ejecutarAccionPalette(tipo, valor) {
  cerrarCommandPalette();
  if (tipo === 'vista') {
    cambiarVistaWeb(valor);
  } else if (tipo === 'vehiculo') {
    centrarVehiculoEnMapa(valor);
  } else if (tipo === 'protocolo') {
    activarProtocoloAuxilioPNP();
  }
}

// 5. ACCIONES DE BARRA SUPERIOR
function sincronizarTelemetriaManual(btn) {
  if (btn) {
    btn.style.transform = 'rotate(360deg)';
    btn.style.transition = 'transform 0.6s ease';
    setTimeout(() => {
      btn.style.transform = 'none';
      btn.style.transition = 'none';
    }, 600);
  }
  mostrarToast('Telemetría satelital y enlaces MPLS sincronizados (0.04s)', 'exito');
}
