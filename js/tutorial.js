// ==========================================================================
// MÓDULO: TUTORIAL Y SPOTLIGHT GUIADO INTELIGENTE
// ==========================================================================

// 10. SPOTLIGHT GUIDED TOUR (MODO SIMULACIÓN CON INSTRUCCIONES)
let spotlightPasoActual = 0;
const pasosSpotlight = [
  {
    target: '.card-analista-hero',
    vista: 'analista-datos',
    titulo: 'Módulo 1 de 8: Tablero Táctico de Brecha y Telemetría',
    desc: 'Supervisa en tiempo real el total de locales desplegados (10,401 a nivel nacional), el porcentaje de avance frente a 2021 y la tasa de cumplimiento del turno D-DAY.'
  },
  {
    target: '.card-mycards-perspective',
    vista: 'analista-datos',
    titulo: 'Módulo 2 de 8: Garantías, Precintos y Contratistas',
    desc: 'Inspecciona en perspectiva 3D las cartas de fianza y penalidades de Galaga SAC (S/ 64,000 ejecutables), Provías Nacional y enlaces satelitales.'
  },
  {
    target: '.contenedor-canvas-grafo',
    vista: 'control-transporte',
    titulo: 'Módulo 3 de 8: Grafo Topológico de Nodos de Transporte',
    desc: 'Visualiza la red logística conectada. Puedes arrastrar los nodos con el ratón, inspeccionar su telemetría e inyectar nuevos convoyes mediante el botón "+ Agregar Nuevo Nodo a la Red".'
  },
  {
    target: '.contenedor-globo-3d-interactivo',
    vista: 'gestion-proyecto',
    titulo: 'Módulo 4 de 8: Globo Terrestre Interactivo 3D con Alertas D-DAY',
    desc: 'Esfera tridimensional fotorrealista con texturas NASA y atmósfera activa. Muestra los puntos críticos nacionales (Lima Sur, Ticlio 4,818 msnm, Loreto, Arequipa, Puno) y los referentes de Estonia, Colombia y Brasil.'
  },
  {
    target: '#vista-rutas-flota .tabla-contenedor-ioc',
    vista: 'rutas-flota',
    titulo: 'Módulo 5 de 8: Monitoreo de Convoys y Tooltips de Telemetría',
    desc: 'Detalle de los 12 convoyes nacionales en tabla 100% responsive. Al pasar el cursor sobre cualquier vehículo, se despliega una ficha técnica con combustible, batería de precinto IoT, presión de neumáticos y custodia PNP.'
  },
  {
    target: '#card-simulador-xai-completo',
    vista: 'alertas-xai',
    titulo: 'Módulo 6 de 8: Motor Algorítmico XAI TreeSHAP',
    desc: 'Calcula las causas matemáticas exactas de cada alerta logística. Puedes mover los controles deslizantes de retraso y penalidades para simular escenarios y auditar la justificación ante Contraloría.'
  },
  {
    target: '.phone-mockup-frame',
    vista: 'terminal-campo',
    titulo: 'Módulo 7 de 8: Terminal Táctico de Campo PWA',
    desc: 'Simulador móvil en 3 clics para miembros de mesa: escaneo láser de precinto QR, lista de verificación de integridad, firma digital táctil y generación del Acta Oficial de Recepción.'
  },
  {
    target: '#btn-toggle-chatbot',
    vista: 'analista-datos',
    titulo: 'Módulo 8 de 8: Asistente Copiloto Inteligente y Consultor',
    desc: 'Chatbot contextual conectado a la base de datos. Pregúntale qué hace cada apartado, pídele los reportes de última hora o ejecuta consultas operativas en cualquier momento.'
  }
];

function iniciarSesionModoSimulacion(e) {
  if (e && e.preventDefault) e.preventDefault();
  sessionStorage.setItem('onpe_sesion_activa', 'true');
  if (typeof estadoApp !== 'undefined') estadoApp.modoAcceso = 'simulacion';
  const loginOverlay = document.getElementById('pantalla-login');
  if (loginOverlay) loginOverlay.classList.add('oculto');
  const badge = document.getElementById('badge-usuario-sesion');
  if (badge) badge.style.display = 'flex';
  const nombreEl = document.getElementById('nombre-usuario-sesion');
  if (nombreEl) nombreEl.textContent = 'Modo Simulación (Tour Guiado)';
  const rolEl = badge?.querySelector('.user-role');
  if (rolEl) rolEl.textContent = '@simulacion_solo_lectura';
  if (typeof iniciarRelojSimulado === 'function') iniciarRelojSimulado();

  mostrarToast('Modo Simulación Guiada (Solo Lectura): Tutorial Táctico Activado', 'info');
  spotlightPasoActual = 0;
  setTimeout(ejecutarPasoSpotlight, 400);
}

// Algoritmo Inteligente de Ubicación Lateral (Al costado para NUNCA cubrir el elemento destacado)
function calcularPosicionAlCostado(rect, cardW, cardH, vw, vh) {
  const gap = 24;
  const paddingScreen = 24;

  const spaceRight = vw - (rect.right + gap);
  const spaceLeft = rect.left - gap;
  const spaceBelow = vh - (rect.bottom + gap);
  const spaceAbove = rect.top - gap;

  // 1. PRIORIDAD MÁXIMA: AL COSTADO DERECHO (Sin solapar el elemento)
  if (spaceRight >= cardW + paddingScreen) {
    const left = rect.right + gap;
    // Alinear verticalmente con rect.top, acotado dentro de la ventana
    const top = Math.max(paddingScreen, Math.min(vh - cardH - paddingScreen, rect.top));
    return { left, top, ubicacion: 'costado-derecho' };
  }

  // 2. PRIORIDAD 2: AL COSTADO IZQUIERDO (Sin solapar el elemento)
  if (spaceLeft >= cardW + paddingScreen) {
    const left = rect.left - gap - cardW;
    const top = Math.max(paddingScreen, Math.min(vh - cardH - paddingScreen, rect.top));
    return { left, top, ubicacion: 'costado-izquierdo' };
  }

  // 3. PRIORIDAD 3: ABAJO DEL ELEMENTO (Si el elemento es de ancho completo)
  if (spaceBelow >= cardH + paddingScreen) {
    const top = rect.bottom + gap;
    let left = rect.left;
    if (left + cardW > vw - paddingScreen) {
      left = vw - cardW - paddingScreen;
    }
    left = Math.max(paddingScreen, left);
    return { left, top, ubicacion: 'abajo' };
  }

  // 4. PRIORIDAD 4: ARRIBA DEL ELEMENTO
  if (spaceAbove >= cardH + paddingScreen) {
    const top = rect.top - gap - cardH;
    let left = rect.left;
    if (left + cardW > vw - paddingScreen) {
      left = vw - cardW - paddingScreen;
    }
    left = Math.max(paddingScreen, left);
    return { left, top, ubicacion: 'arriba' };
  }

  // 5. CASO ELEMENTO GIGANTE (ocupa casi todo el viewport):
  // Colocar en la esquina con menor interferencia
  return {
    left: Math.max(paddingScreen, vw - cardW - paddingScreen),
    top: Math.max(paddingScreen, vh - cardH - paddingScreen),
    ubicacion: 'esquina'
  };
}

// Soporte de Arrastre Manual (Draggable) para el Diálogo del Tutorial
let isDraggingDialog = false;
let dragStartX = 0;
let dragStartY = 0;
let dialogInitX = 0;
let dialogInitY = 0;

function setupDraggableSpotlight() {
  const dialog = document.getElementById('spotlight-dialog-card');
  if (!dialog || dialog.dataset.dragReady) return;
  dialog.dataset.dragReady = 'true';

  dialog.addEventListener('mousedown', function(e) {
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
    isDraggingDialog = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    dialogInitX = dialog.offsetLeft;
    dialogInitY = dialog.offsetTop;
    dialog.style.cursor = 'grabbing';
    e.preventDefault();
  });

  window.addEventListener('mousemove', function(e) {
    if (!isDraggingDialog) return;
    const dialog = document.getElementById('spotlight-dialog-card');
    if (!dialog) return;
    const dx = e.clientX - dragStartX;
    const dy = e.clientY - dragStartY;
    const newX = Math.max(8, Math.min(window.innerWidth - dialog.offsetWidth - 8, dialogInitX + dx));
    const newY = Math.max(8, Math.min(window.innerHeight - dialog.offsetHeight - 8, dialogInitY + dy));
    dialog.style.left = newX + 'px';
    dialog.style.top = newY + 'px';
    dialog.style.bottom = 'auto';
    dialog.style.right = 'auto';
  });

  window.addEventListener('mouseup', function() {
    if (isDraggingDialog) {
      isDraggingDialog = false;
      const dialog = document.getElementById('spotlight-dialog-card');
      if (dialog) dialog.style.cursor = 'default';
    }
  });
}

function ejecutarPasoSpotlight() {
  if (spotlightPasoActual >= pasosSpotlight.length) {
    detenerInstruccionesTour();
    mostrarToast('Has completado el Tutorial Guiado de ONPE Visión 2026', 'exito');
    return;
  }

  const paso = pasosSpotlight[spotlightPasoActual];
  const overlay = document.getElementById('spotlight-tour-overlay');
  if (overlay) overlay.style.display = 'block';

  // Cambiar a la vista adecuada
  if (paso.vista) cambiarVistaWeb(paso.vista);

  setTimeout(() => {
    const el = document.querySelector(paso.target);
    const focusBox = document.getElementById('spotlight-focus-box');
    const dialog = document.getElementById('spotlight-dialog-card');

    document.getElementById('spotlight-step-tag').textContent = `TUTORIAL PASO ${spotlightPasoActual + 1} DE ${pasosSpotlight.length}`;
    document.getElementById('spotlight-step-title').textContent = paso.titulo;
    document.getElementById('spotlight-step-desc').textContent = paso.desc;

    // Inicializar capacidad de arrastre si no estuviese lista
    setupDraggableSpotlight();

    if (el && focusBox && dialog) {
      // 1. Alinear el elemento en el viewport primero sin tapar cabecera
      el.scrollIntoView({ behavior: 'auto', block: 'center' });

      // 2. Medir después de que el scroll se haya completado en el siguiente frame
      requestAnimationFrame(() => {
        setTimeout(() => {
          const rect = el.getBoundingClientRect();

          // Medidas del viewport
          const vw = window.innerWidth;
          const vh = window.innerHeight;
          const isMobile = vw < 768;

          // Posicionar y acotar la caja de foco cian
          const boxPad = 8;
          const boxLeft = Math.max(2, rect.left - boxPad);
          const boxTop = Math.max(2, rect.top - boxPad);
          const boxWidth = Math.min(vw - boxLeft - 4, rect.width + (boxPad * 2));
          const boxHeight = Math.min(vh - boxTop - 4, rect.height + (boxPad * 2));

          focusBox.style.position = 'fixed';
          focusBox.style.left = boxLeft + 'px';
          focusBox.style.top = boxTop + 'px';
          focusBox.style.width = boxWidth + 'px';
          focusBox.style.height = boxHeight + 'px';

          // POSICIONAMIENTO DEL CUADRO DE DIÁLOGO
          if (isMobile) {
            // En modo teléfono: acoplado en la parte inferior fijo con margen seguro
            dialog.style.position = 'fixed';
            dialog.style.top = 'auto';
            dialog.style.bottom = '16px';
            dialog.style.left = '12px';
            dialog.style.right = '12px';
            dialog.style.width = 'auto';
            dialog.style.maxWidth = 'calc(100vw - 24px)';
            dialog.style.transform = 'none';
          } else {
            // En modo PC: Ubicación al costado inteligente (CERO solapamiento)
            const cardW = Math.min(440, vw - 32);
            dialog.style.position = 'fixed';
            dialog.style.width = cardW + 'px';
            dialog.style.maxWidth = 'calc(100vw - 32px)';
            dialog.style.bottom = 'auto';
            dialog.style.right = 'auto';
            dialog.style.transform = 'none';

            const cardH = dialog.offsetHeight || 260;
            const posCalc = calcularPosicionAlCostado(rect, cardW, cardH, vw, vh);

            dialog.style.left = posCalc.left + 'px';
            dialog.style.top = posCalc.top + 'px';
          }
        }, 70);
      });
    } else if (dialog) {
      dialog.style.position = 'fixed';
      dialog.style.top = '50%';
      dialog.style.left = '50%';
      dialog.style.transform = 'translate(-50%, -50%)';
    }
  }, 260);
}

function avanzarSpotlightTour() {
  spotlightPasoActual++;
  ejecutarPasoSpotlight();
}

function detenerInstruccionesTour() {
  const overlay = document.getElementById('spotlight-tour-overlay');
  if (overlay) overlay.style.display = 'none';
  mostrarToast('Instrucciones detenidas. Interfaz en modo operativo libre.', 'info');
}

// Reposicionamiento dinámico en caso de redimensión de pantalla durante el tour
window.addEventListener('resize', function() {
  const overlay = document.getElementById('spotlight-tour-overlay');
  if (overlay && overlay.style.display !== 'none' && spotlightPasoActual < pasosSpotlight.length) {
    const paso = pasosSpotlight[spotlightPasoActual];
    const el = document.querySelector(paso.target);
    const focusBox = document.getElementById('spotlight-focus-box');
    const dialog = document.getElementById('spotlight-dialog-card');
    if (el && focusBox && dialog && !isDraggingDialog) {
      const rect = el.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const isMobile = vw < 768;

      const boxPad = 8;
      const boxLeft = Math.max(2, rect.left - boxPad);
      const boxTop = Math.max(2, rect.top - boxPad);
      focusBox.style.left = boxLeft + 'px';
      focusBox.style.top = boxTop + 'px';
      focusBox.style.width = Math.min(vw - boxLeft - 4, rect.width + (boxPad * 2)) + 'px';
      focusBox.style.height = Math.min(vh - boxTop - 4, rect.height + (boxPad * 2)) + 'px';

      if (isMobile) {
        dialog.style.top = 'auto';
        dialog.style.bottom = '16px';
        dialog.style.left = '12px';
        dialog.style.right = '12px';
        dialog.style.width = 'auto';
        dialog.style.maxWidth = 'calc(100vw - 24px)';
      } else {
        const cardW = Math.min(440, vw - 32);
        dialog.style.width = cardW + 'px';
        dialog.style.maxWidth = 'calc(100vw - 32px)';
        const cardH = dialog.offsetHeight || 260;
        const posCalc = calcularPosicionAlCostado(rect, cardW, cardH, vw, vh);
        dialog.style.left = posCalc.left + 'px';
        dialog.style.top = posCalc.top + 'px';
      }
    }
  }
});
