// ==========================================================================
// MÓDULO: BASE DE DATOS SQL Y EXPLORADOR RELACIONAL (6 TABLAS = 32 REGISTROS)
// ==========================================================================

const DATASETS_LOCALES_SQL = {
  vehiculos_transporte: [
    { id_vehiculo: '#GAL-104', placa: 'GAL-104', tipo_unidad: 'Furgón Ligero', empresa_contratista: 'Galaga SAC', estado_operativo: 'alerta_critica', velocidad_kmh: 0 },
    { id_vehiculo: '#DEZ-782', placa: 'DEZ-782', tipo_unidad: 'Camión Scania R450', empresa_contratista: 'Transportes Blindados Andinos', estado_operativo: 'averiado', velocidad_kmh: 0 },
    { id_vehiculo: '#DEZ-365', placa: 'DEZ-365', tipo_unidad: 'Lancha Fluvial Amazonas I', empresa_contratista: 'Consorcio Fluvial del Oriente', estado_operativo: 'retraso', velocidad_kmh: 22 },
    { id_vehiculo: '#DEZ-528', placa: 'DEZ-528', tipo_unidad: 'Volvo FH Classic 15T', empresa_contratista: 'Transportes del Sur SAC', estado_operativo: 'llegada_conforme', velocidad_kmh: 74 },
    { id_vehiculo: '#DEZ-234', placa: 'DEZ-234', tipo_unidad: 'Volvo FH 540', empresa_contratista: 'Transportes del Norte SAC', estado_operativo: 'llegada_conforme', velocidad_kmh: 81 },
    { id_vehiculo: '#DEZ-912', placa: 'DEZ-912', tipo_unidad: 'Mercedes Actros', empresa_contratista: 'Logística del Valle Sagrado', estado_operativo: 'llegada_conforme', velocidad_kmh: 68 },
    { id_vehiculo: '#DEZ-641', placa: 'DEZ-641', tipo_unidad: 'Camión 4x4 Isuzu', empresa_contratista: 'Transportes Altiplano', estado_operativo: 'retraso', velocidad_kmh: 35 },
    { id_vehiculo: '#DEZ-115', placa: 'DEZ-115', tipo_unidad: 'Volvo FMX 460', empresa_contratista: 'Andes Central Express', estado_operativo: 'llegada_conforme', velocidad_kmh: 60 },
    { id_vehiculo: '#DEZ-803', placa: 'DEZ-803', tipo_unidad: 'Lancha Rápida Selva', empresa_contratista: 'Flota Fluvial Ucayali', estado_operativo: 'llegada_conforme', velocidad_kmh: 28 },
    { id_vehiculo: '#GAL-109', placa: 'GAL-109', tipo_unidad: 'Furgón Reparto', empresa_contratista: 'Galaga SAC', estado_operativo: 'alerta_critica', velocidad_kmh: 0 },
    { id_vehiculo: '#DEZ-447', placa: 'DEZ-447', tipo_unidad: 'Scania G410', empresa_contratista: 'Rutas de Ayacucho SAC', estado_operativo: 'llegada_conforme', velocidad_kmh: 70 },
    { id_vehiculo: '#DEZ-701', placa: 'DEZ-701', tipo_unidad: 'Hino 500', empresa_contratista: 'Selva Alta Transportes', estado_operativo: 'llegada_conforme', velocidad_kmh: 65 }
  ],
  locales_votacion: [
    { id_local: 'LOC-LIMS-001', codigo_odpe: 'ODPE-LS', nombre_local: 'I.E. 6050 Juana Alarco de Dammert', distrito: 'Miraflores', mesas: 25, electores: 7500, estado_recepcion: 'entregado' },
    { id_local: 'LOC-LIMS-002', codigo_odpe: 'ODPE-LS', nombre_local: 'I.E. Javier Heraud (Caso Galaga)', distrito: 'San Juan de Miraflores', mesas: 211, electores: 63300, estado_recepcion: 'critico' },
    { id_local: 'LOC-LIMS-003', codigo_odpe: 'ODPE-LS', nombre_local: 'Colegio Nacional San Pedro', distrito: 'Lurín', mesas: 40, electores: 12000, estado_recepcion: 'en_ruta' },
    { id_local: 'LOC-HVCA-001', codigo_odpe: 'ODPE-HV', nombre_local: 'I.E. La Victoria de Ayacucho', distrito: 'Ascensión', mesas: 35, electores: 9800, estado_recepcion: 'critico' },
    { id_local: 'LOC-LORE-001', codigo_odpe: 'ODPE-LO', nombre_local: 'Colegio Nacional Iquitos (CNI)', distrito: 'Iquitos', mesas: 55, electores: 16500, estado_recepcion: 'en_ruta' },
    { id_local: 'LOC-AREQ-001', codigo_odpe: 'ODPE-AQ', nombre_local: 'G.U.E. Mariano Melgar', distrito: 'Arequipa', mesas: 60, electores: 18000, estado_recepcion: 'entregado' },
    { id_local: 'LOC-PIUR-001', codigo_odpe: 'ODPE-PI', nombre_local: 'I.E. San Miguel de Piura', distrito: 'Piura', mesas: 45, electores: 13500, estado_recepcion: 'entregado' },
    { id_local: 'LOC-CUSC-001', codigo_odpe: 'ODPE-CU', nombre_local: 'Colegio Ciencias del Cusco', distrito: 'Cusco', mesas: 50, electores: 15000, estado_recepcion: 'entregado' }
  ],
  rutas_electorales: [
    { id_ruta: 1, id_vehiculo: '#GAL-104', nombre_ruta: 'Lurín - SJM Troncal Sur', tipo_via: 'urbana', odpe_destino: 'ODPE Lima Sur', distancia_total_km: 24.5, tiempo_estimado_min: 45 },
    { id_ruta: 2, id_vehiculo: '#DEZ-782', nombre_ruta: 'Carretera Central - Ticlio - Huancavelica', tipo_via: 'andina', odpe_destino: 'ODPE Huancavelica', distancia_total_km: 445.0, tiempo_estimado_min: 540 },
    { id_ruta: 3, id_vehiculo: '#DEZ-365', nombre_ruta: 'Corredor Fluvial Río Nanay - Maynas', tipo_via: 'fluvial', odpe_destino: 'ODPE Maynas', distancia_total_km: 180.0, tiempo_estimado_min: 360 },
    { id_ruta: 4, id_vehiculo: '#DEZ-528', nombre_ruta: 'Panamericana Sur - Variante Uchumayo', tipo_via: 'interprovincial', odpe_destino: 'ODPE Arequipa', distancia_total_km: 1010.0, tiempo_estimado_min: 840 }
  ],
  telemetria_gps: [
    { id_telemetria: 1, id_vehiculo: '#GAL-104', latitud: -12.1611, longitud: -76.9682, velocidad_kmh: 0.0, altitud_msnm: 140.0, nivel_combustible_pct: 42.0, alerta_geocerca: 1 },
    { id_telemetria: 2, id_vehiculo: '#DEZ-782', latitud: -11.5944, longitud: -76.1950, velocidad_kmh: 0.0, altitud_msnm: 4818.0, nivel_combustible_pct: 78.0, alerta_geocerca: 1 },
    { id_telemetria: 3, id_vehiculo: '#DEZ-365', latitud: -3.7437, longitud: -73.2516, velocidad_kmh: 22.0, altitud_msnm: 106.0, nivel_combustible_pct: 65.0, alerta_geocerca: 0 }
  ],
  actas_recepcion_campo: [
    { id_acta: 'ACT-2026-0001', id_local: 'LOC-LIMS-001', id_coordinador_dni: '48201948', codigo_precinto_qr: 'QR-ONPE-2026-994821', estado_acta: 'conforme', metodo_confirmacion: 'pwa_3_clics' },
    { id_acta: 'ACT-2026-0002', id_local: 'LOC-AREQ-001', id_coordinador_dni: '71029384', codigo_precinto_qr: 'QR-ONPE-2026-773192', estado_acta: 'conforme', metodo_confirmacion: 'pwa_3_clics' }
  ],
  alertas_xai: [
    { id_alerta: 1, id_vehiculo: '#GAL-104', score_riesgo: 0.94, nivel_severidad: 'CRITICA', shap_retraso: 0.24, shap_geografia: 0.16, shap_contratista: 0.40, shap_exclusion: 0.09, recomendacion_operativa: 'Despachar convoy contingencia desde Lurín y ejecutar fianza S/ 64,000.' },
    { id_alerta: 2, id_vehiculo: '#DEZ-782', score_riesgo: 0.72, nivel_severidad: 'ALTA', shap_retraso: 0.20, shap_geografia: 0.35, shap_contratista: 0.07, shap_exclusion: 0.05, recomendacion_operativa: 'Coordinar con Provías Nacional envío de remolque autorizado en Ticlio.' },
    { id_alerta: 3, id_vehiculo: '#DEZ-365', score_riesgo: 0.48, nivel_severidad: 'MEDIA', shap_retraso: 0.18, shap_geografia: 0.14, shap_contratista: 0.05, shap_exclusion: 0.06, recomendacion_operativa: 'Monitorear telemetría Starlink cada 15 min en río Nanay.' }
  ]
};

function _obtenerApiBaseLocal() {
  if (typeof obtenerApiBase === 'function') return obtenerApiBase();
  return (window.location && window.location.protocol === 'file:') ? 'http://localhost:3000' : '';
}

function _escaparCeldaSQL(val) {
  if (typeof escaparHtml === 'function') return escaparHtml(val);
  return String(val ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function mostrarTablaDB(nombreTabla, btn) {
  if (btn) {
    document.querySelectorAll('#vista-base-datos .btn-secundario, .db-tab-btn').forEach(b => b.classList.remove('activo'));
    btn.classList.add('activo');
  }

  const thead = document.getElementById('thead-datos-sql');
  const tbody = document.getElementById('tbody-datos-sql');
  if (!thead || !tbody) return;

  fetch(`${_obtenerApiBaseLocal()}/api/db/consulta`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: `SELECT * FROM ${nombreTabla} LIMIT 25;` })
  })
    .then(res => res.json())
    .then(data => {
      if (data.exito && data.filas && data.filas.length) {
        renderizarFilasSQL(data.filas);
      } else {
        renderizarDatasetLocal(nombreTabla);
      }
    })
    .catch(() => renderizarDatasetLocal(nombreTabla));
}

function renderizarDatasetLocal(nombreTabla) {
  const filas = DATASETS_LOCALES_SQL[nombreTabla] || DATASETS_LOCALES_SQL.vehiculos_transporte;
  renderizarFilasSQL(filas);
}

function renderizarFilasSQL(filas) {
  const thead = document.getElementById('thead-datos-sql');
  const tbody = document.getElementById('tbody-datos-sql');
  if (!thead || !tbody) return;
  if (!filas || !filas.length) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No hay registros encontrados en la tabla.</td></tr>';
    return;
  }

  const cols = Object.keys(filas[0]);
  let hHtml = '<tr>';
  cols.forEach(c => hHtml += `<th>${_escaparCeldaSQL(c)}</th>`);
  hHtml += '</tr>';
  thead.innerHTML = hHtml;

  let bHtml = '';
  filas.forEach(f => {
    bHtml += '<tr>';
    cols.forEach(c => {
      const val = f[c];
      bHtml += `<td class="texto-mono">${val !== null && val !== undefined ? _escaparCeldaSQL(val) : 'NULL'}</td>`;
    });
    bHtml += '</tr>';
  });
  tbody.innerHTML = bHtml;
}

function ejecutarConsultaSQLConsola() {
  const input = document.getElementById('input-sql-consola');
  const sql = (input?.value || '').trim();
  if (!sql) return;

  fetch(`${_obtenerApiBaseLocal()}/api/db/consulta`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: sql })
  })
    .then(res => res.json())
    .then(data => {
      if (data.exito && data.filas) {
        renderizarFilasSQL(data.filas);
        if (typeof mostrarToast === 'function') mostrarToast(`Consulta SQL ejecutada: ${data.total} filas devueltas`, 'exito');
      } else {
        if (typeof mostrarToast === 'function') mostrarToast(`Error SQL: ${data.error || 'Consulta rechazada'}`, 'error');
      }
    })
    .catch(() => {
      const match = sql.match(/\bFROM\s+([a-zA-Z_][a-zA-Z0-9_]*)/i);
      const tabla = (match && DATASETS_LOCALES_SQL[match[1]]) ? match[1] : 'vehiculos_transporte';
      if (typeof mostrarToast === 'function') {
        mostrarToast(`Modo local offline: mostrando tabla ${tabla}`, 'warning');
      }
      renderizarDatasetLocal(tabla);
    });
}
