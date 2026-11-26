// ==========================================================================
// MÓDULO: TELEMETRÍA GPS, MONITOREO DE FLOTA E INCIDENCIAS
// ==========================================================================

 const flotaVehiculos = [
 { id: "#GAL-104", placa: "GAL-104", tipo: "Furgón Ligero", odpe: "Lima Sur", conductor: "Conductor No Identificado", pnp: "Sin Asignar", vel: 0, estado: "ROJO", rutaNombre: "Lurín - SJM", coords: [-12.1611, -76.9682], lat: -12.1611, lng: -76.9682, enlace: "4G Contingencia", fuel: "52% (260 km)", psi: "34 PSI (OK)", bat: "91%", temp: "19.5°C" },
 { id: "#DEZ-782", placa: "DEZ-782", tipo: "Camión Scania R450", odpe: "Huancavelica", conductor: "Manuel Quispe", pnp: "Cmdte. PNP R. Soto", vel: 0, estado: "ROJO", rutaNombre: "Ticlio - Huancavelica", coords: [-11.5944, -76.1950], lat: -11.5944, lng: -76.1950, enlace: "Starlink", fuel: "76% (380 km)", psi: "4.8 bar (Frenos Crít.)", bat: "98%", temp: "-4.0°C" },
 { id: "#DEZ-365", placa: "DEZ-365", tipo: "Lancha Amazonas I", odpe: "Loreto", conductor: "Segundo Tamani", pnp: "Tnte. PNP A. Coral", vel: 22, estado: "AMARILLO", rutaNombre: "Río Nanay - Maynas", coords: [-3.7437, -73.2516], lat: -3.7437, lng: -73.2516, enlace: "Starlink", fuel: "68% (190 km)", psi: "Fluvial (N/A)", bat: "95%", temp: "29.2°C" },
 { id: "#DEZ-528", placa: "DEZ-528", tipo: "Volvo FH Classic", odpe: "Arequipa", conductor: "Jorge Cárdenas", pnp: "Cap. PNP M. Silva", vel: 74, estado: "VERDE", rutaNombre: "Panamericana Sur", coords: [-16.4090, -71.5375], lat: -16.4090, lng: -71.5375, enlace: "MPLS Dedicada", fuel: "88% (440 km)", psi: "108 PSI (OK)", bat: "99%", temp: "17.8°C" },
 { id: "#DEZ-234", placa: "DEZ-234", tipo: "Volvo FH 540", odpe: "Piura", conductor: "Carlos Mendoza P.", pnp: "Mayor PNP L. Flores", vel: 81, estado: "VERDE", rutaNombre: "Troncal Panamericana Norte", coords: [-5.1945, -80.6328], lat: -5.1945, lng: -80.6328, enlace: "MPLS Dedicada", fuel: "91% (460 km)", psi: "110 PSI (OK)", bat: "100%", temp: "27.4°C" },
 { id: "#DEZ-912", placa: "DEZ-912", tipo: "Mercedes Actros", odpe: "Cusco", conductor: "Efraín Mamani", pnp: "SOT1 PNP J. Ramos", vel: 68, estado: "VERDE", rutaNombre: "Valle Sagrado - Cusco", coords: [-13.5319, -71.9675], lat: -13.5319, lng: -71.9675, enlace: "MPLS Dedicada", fuel: "84% (410 km)", psi: "106 PSI (OK)", bat: "97%", temp: "11.2°C" },
 { id: "#DEZ-641", placa: "DEZ-641", tipo: "Camión 4x4 Isuzu", odpe: "Puno", conductor: "Walter Condori", pnp: "Cap. PNP D. Quispe", vel: 35, estado: "AMARILLO", rutaNombre: "Juliaca - Puno Altiplano", coords: [-15.8402, -70.0219], lat: -15.8402, lng: -70.0219, enlace: "Starlink", fuel: "79% (350 km)", psi: "98 PSI (OK)", bat: "94%", temp: "2.1°C" },
 { id: "#DEZ-115", placa: "DEZ-115", tipo: "Volvo FMX 460", odpe: "Junín", conductor: "Raúl Pacherres", pnp: "Tnte. PNP C. Díaz", vel: 60, estado: "VERDE", rutaNombre: "La Oroya - Huancayo", coords: [-12.0651, -75.2049], lat: -12.0651, lng: -75.2049, enlace: "MPLS Dedicada", fuel: "86% (430 km)", psi: "105 PSI (OK)", bat: "98%", temp: "8.6°C" },
 { id: "#DEZ-803", placa: "DEZ-803", tipo: "Lancha Rápida", odpe: "Ucayali", conductor: "Nelson Ahuanari", pnp: "SBT PNP R. Vela", vel: 28, estado: "VERDE", rutaNombre: "Río Ucayali - Pucallpa", coords: [-8.3791, -74.5539], lat: -8.3791, lng: -74.5539, enlace: "Starlink", fuel: "82% (240 km)", psi: "Fluvial (N/A)", bat: "96%", temp: "30.1°C" },
 { id: "#GAL-109", placa: "GAL-109", tipo: "Furgón Reparto", odpe: "Lima Sur", conductor: "Conductor Observado", pnp: "Sin Asignar", vel: 0, estado: "ROJO", rutaNombre: "Pachacámac Despacho", coords: [-12.2289, -76.8622], lat: -12.2289, lng: -76.8622, enlace: "4G Contingencia", fuel: "47% (220 km)", psi: "32 PSI (Rev.)", bat: "64%", temp: "20.1°C" },
 { id: "#DEZ-447", placa: "DEZ-447", tipo: "Scania G410", odpe: "Ayacucho", conductor: "Darío Huamán", pnp: "Cap. PNP F. Castro", vel: 70, estado: "VERDE", rutaNombre: "Huanta - Huamanga", coords: [-13.1588, -74.2239], lat: -13.1588, lng: -74.2239, enlace: "MPLS Dedicada", fuel: "89% (445 km)", psi: "107 PSI (OK)", bat: "99%", temp: "14.5°C" },
 { id: "#DEZ-701", placa: "DEZ-701", tipo: "Hino 500", odpe: "San Martín", conductor: "Gilberto Ruiz", pnp: "Tnte. PNP M. Tello", vel: 65, estado: "VERDE", rutaNombre: "Moyobamba - Tarapoto", coords: [-6.4842, -76.3688], lat: -6.4842, lng: -76.3688, enlace: "MPLS Dedicada", fuel: "85% (420 km)", psi: "102 PSI (OK)", bat: "97%", temp: "26.8°C" }
 ];

 // 14 Incidencias de Auditoría
 const incidenciasData = [
 { id: "INC-001", odpe: "Lima Sur", desc: "Incumplimiento contractual despacho Galaga SAC en 15 colegios", grav: "CRÍTICA", hora: "05:15", est: "En Auxilio PNP" },
 { id: "INC-002", odpe: "Huancavelica", desc: "Avería mecánica en sistema de frenos en Ticlio (#DEZ-782)", grav: "CRÍTICA", hora: "05:42", est: "Transbordo en Curso" },
 { id: "INC-003", odpe: "Loreto", desc: "Retraso de 1.8h por fuerte correntada en cuenca del Nanay", grav: "MEDIA", hora: "06:05", est: "Monitoreo Radial" },
 { id: "INC-004", odpe: "Lima Sur", desc: "Retraso en entrega de ánforas en I.E. Javier Heraud SJM", grav: "CRÍTICA", hora: "06:12", est: "Reserva Despachada" },
 { id: "INC-005", odpe: "Puno", desc: "Helada y neblina severa reducen visibilidad a 15 km/h", grav: "MEDIA", hora: "06:18", est: "Tránsito Seguro" },
 { id: "INC-006", odpe: "Arequipa", desc: "Precinto QR escaneado con éxito en Colegio Independencia", grav: "BAJA", hora: "06:22", est: "Conforme" },
 { id: "INC-007", odpe: "Lima Sur", desc: "Furgón #GAL-109 detenido sin señal GPS por 20 minutos", grav: "CRÍTICA", hora: "06:25", est: "Patrulla Asignada" },
 { id: "INC-008", odpe: "Ucayali", desc: "Embarcación arribó a puerto fluvial con custodia completa", grav: "BAJA", hora: "06:30", est: "Conforme" },
 { id: "INC-009", odpe: "Piura", desc: "Entrega conforme de ánforas en Centro de Acopio Central", grav: "BAJA", hora: "06:33", est: "Conforme" },
 { id: "INC-010", odpe: "Cusco", desc: "Tránsito normal en corredor vial de Valle Sagrado", grav: "BAJA", hora: "06:35", est: "Conforme" },
 { id: "INC-011", odpe: "Junín", desc: "Paso habilitado en La Oroya sin manifestaciones", grav: "BAJA", hora: "06:38", est: "Conforme" },
 { id: "INC-012", odpe: "Ayacucho", desc: "Convoy #DEZ-447 ingresa a ODPE Huamanga conforme", grav: "BAJA", hora: "06:40", est: "Conforme" },
 { id: "INC-013", odpe: "San Martín", desc: "Descarga de material electoral con firma digital de actas", grav: "BAJA", hora: "06:42", est: "Conforme" },
 { id: "INC-014", odpe: "Lima Sur", desc: "Notificación oficial cursada a Contraloría por penalidades", grav: "ALTA", hora: "06:44", est: "Expediente Abierto" }
 ];

 // 3. NAVEGACIÓN ENTRE VISTAS

 function inicializarMapas() {
 // Mapa 1: Centro de Mando
 if (document.getElementById('mapa-operativo')) {
 estadoApp.mapaOperativo = L.map('mapa-operativo', {
 center: [-12.0464, -77.0428],
 zoom: 7,
 zoomControl: true
 });

// Capas asignadas dinámicamente vía cambiarEstiloMapa()

 // Marcadores de Vehículos en Mapa Operativo
 flotaVehiculos.forEach(v => {
 const color = v.estado === 'ROJO' ? '#F0435A' : (v.estado === 'AMARILLO' ? '#F5A524' : '#10B981');
 const marker = L.circleMarker(v.coords, {
 radius: 7,
 fillColor: color,
 color: '#FFFFFF',
 weight: 1.5,
 opacity: 1,
 fillOpacity: 0.9
 }).addTo(estadoApp.mapaOperativo);

 marker.bindPopup(`
 <div style="font-family:sans-serif; font-size:12px; color:#04070F;">
 <strong>${v.id} (${v.placa})</strong><br>
 ${v.tipo} · ${v.odpe}<br>
 <span style="color:${color}; font-weight:700;">Estado: ${v.estado}</span><br>
 Velocidad: ${v.vel} km/h
 </div>
 `);
 v.marcador = marker;
 });
 }

 // Mapa 2: Mapa Nacional Cobertura
 if (document.getElementById('mapa-cobertura-completo')) {
 estadoApp.mapaNacional = L.map('mapa-cobertura-completo', {
 center: [-9.19, -75.01], // Centro de Perú
 zoom: 5,
 zoomControl: true
 });

// Capas asignadas dinámicamente vía cambiarEstiloMapa()

 flotaVehiculos.forEach(v => {
 const color = v.estado === 'ROJO' ? '#F0435A' : (v.estado === 'AMARILLO' ? '#F5A524' : '#10B981');
 const markerNac = L.circleMarker(v.coords, {
 radius: 6,
 fillColor: color,
 color: '#fff',
 weight: 1,
 fillOpacity: 0.9
 }).addTo(estadoApp.mapaNacional).bindPopup(`<strong>${v.id}</strong> - ODPE ${v.odpe}`);
 v.marcadorNacional = markerNac;
 });
 }

 // Aplicar estilo de mapa táctico por defecto (sin marcas de agua)
 cambiarEstiloMapa('nocturno');

 renderizarFlotaLateral();
 renderizarTablaFlotaCompleta();
 renderizarTablaIncidencias();
 }

 function enfocarRegionMapa(coords, zoom) {
 if (estadoApp.mapaNacional) {
 estadoApp.mapaNacional.flyTo(coords, zoom, { duration: 1.2 });
 }
 }

 function renderizarFlotaLateral() {
 const cont = document.getElementById('lista-vehiculos-mando');
 if (!cont) return;
 cont.innerHTML = '';

 flotaVehiculos.slice(0, 5).forEach(v => {
 const badgeClass = v.estado === 'ROJO' ? 'badge-alerta-roja' : (v.estado === 'AMARILLO' ? 'badge-alerta-amarilla' : 'badge-conforme');
 const div = document.createElement('div');
 div.style.cssText = 'background:var(--bg-base); padding:10px 14px; border-radius:var(--radio-sm); border:1px solid var(--borde-sutil); cursor:pointer; display:flex; justify-content:space-between; align-items:center;';
 div.onclick = () => inspeccionarVehiculo(v.id);
 div.innerHTML = `
 <div>
 <strong class="texto-mono" style="color:#FFFFFF; font-size:13px;">${v.id}</strong>
 <div style="font-size:11px; color:var(--texto-secundario);">${v.odpe} · ${v.tipo.split(' ')[0]}</div>
 </div>
 <div style="text-align:right;">
 <span class="badge-estado ${badgeClass}">${v.estado}</span>
 <div class="texto-mono" style="font-size:11px; color:var(--texto-secundario); margin-top:2px;">${v.vel} km/h</div>
 </div>
 `;
 cont.appendChild(div);
 });
 }

 function inspeccionarVehiculo(id) {
 const v = flotaVehiculos.find(item => item.id === id);
 if (!v) return;

 const hud = document.getElementById('hud-telemetria');
 if (hud) hud.style.display = 'block';

 document.getElementById('hud-unidad').textContent = `${v.id} (${v.placa})`;
 document.getElementById('hud-ruta').textContent = v.rutaNombre;
 document.getElementById('hud-coords').textContent = `${v.lat.toFixed(4)}, ${v.lng.toFixed(4)}`;
 document.getElementById('hud-velocidad').textContent = v.vel === 0 ? '0 km/h (Detenido)' : `${v.vel} km/h`;
 document.getElementById('hud-velocidad').style.color = v.vel === 0 ? 'var(--rojo-critico)' : 'var(--verde-exito)';

 if (estadoApp.mapaOperativo) {
 estadoApp.mapaOperativo.flyTo([v.lat, v.lng], 9, { duration: 1 });
 if (v.marcador) v.marcador.openPopup();
 }
 }

 function cerrarHudTelemetria() {
 const hud = document.getElementById('hud-telemetria');
 if (hud) hud.style.display = 'none';
 }

 // 9. RENDERIZADO DE TABLA DE FLOTA COMPLETA (12 CONVOYES)
 function renderizarTablaFlotaCompleta(datos = flotaVehiculos) {
 const tbody = document.getElementById('tbody-flota-12');
 if (!tbody) return;
 tbody.innerHTML = '';

 datos.forEach(v => {
 const badgeClass = v.estado === 'ROJO' ? 'badge-alerta-roja' : (v.estado === 'AMARILLO' ? 'badge-alerta-amarilla' : 'badge-conforme');
 const tr = document.createElement('tr');
 tr.innerHTML = `
 <td><strong class="texto-mono" style="color:var(--cian);">${v.id}</strong> <span style="font-size:11px; color:var(--texto-secundario);">(${v.placa})</span></td>
 <td>${v.tipo}</td>
 <td><strong>${v.odpe}</strong><br><span style="font-size:11px; color:var(--texto-secundario);">${v.rutaNombre}</span></td>
 <td>${v.conductor}<br><span style="font-size:11px; color:var(--verde-exito);">${v.pnp}</span></td>
 <td class="col-num"><strong>${v.vel}</strong> km/h</td>
 <td><span class="badge-estado ${badgeClass}">${v.estado}</span></td>
 <td><span class="texto-mono" style="font-size:11px; color:var(--texto-secundario);">${v.enlace}</span></td>
 <td>
 <button class="btn-ghost" onclick="cambiarVistaWeb('dashboard'); setTimeout(() => inspeccionarVehiculo('${v.id}'), 300);">
 Ver en Mapa
 </button>
 </td>
 `;
 tbody.appendChild(tr);
 });
 }

 function actualizarVistaFlota() {
 const txt = (document.getElementById('filtro-flota-texto')?.value || '').toLowerCase();
 const est = document.getElementById('filtro-flota-estado')?.value || 'TODOS';
 const criterio = document.getElementById('ordenar-flota')?.value || 'id';

 const filtrados = flotaVehiculos.filter(v => {
 const coincideTexto = v.id.toLowerCase().includes(txt) || v.odpe.toLowerCase().includes(txt) || v.conductor.toLowerCase().includes(txt) || v.placa.toLowerCase().includes(txt);
 const coincideEstado = est === 'TODOS' || v.estado === est;
 return coincideTexto && coincideEstado;
 });

 if (criterio === 'odpe') {
 filtrados.sort((a, b) => a.odpe.localeCompare(b.odpe));
 } else if (criterio === 'vel') {
 filtrados.sort((a, b) => b.vel - a.vel);
 } else {
 filtrados.sort((a, b) => a.id.localeCompare(b.id));
 }

 renderizarTablaFlotaCompleta(filtrados);
 vincularTooltipsFlota();
 }

 function filtrarTablaFlota() {
 actualizarVistaFlota();
 }

 function ordenarTablaFlota() {
 actualizarVistaFlota();
 }

 // 10. RENDERIZADO DE AUDITORÍA CON FILTROS Y PAGINACIÓN
 let incidenciasFiltradas = [...incidenciasData];

 function renderizarTablaIncidencias() {
 const tbody = document.getElementById('tbody-incidencias');
 if (!tbody) return;
 tbody.innerHTML = '';

 const inicio = (estadoApp.paginaIncidencias - 1) * estadoApp.incidenciasPorPagina;
 const fin = inicio + estadoApp.incidenciasPorPagina;
 const pagina = incidenciasFiltradas.slice(inicio, fin);

 pagina.forEach(inc => {
 let badgeGrav = 'badge-conforme';
 if (inc.grav === 'CRÍTICA') badgeGrav = 'badge-alerta-roja';
 else if (inc.grav === 'ALTA') badgeGrav = 'badge-alerta-amarilla';
 else if (inc.grav === 'MEDIA') badgeGrav = 'badge-sla';

 const tr = document.createElement('tr');
 tr.innerHTML = `
 <td class="texto-mono" style="color:var(--cian);">${inc.id}</td>
 <td><strong>${inc.odpe}</strong></td>
 <td>${inc.desc}</td>
 <td><span class="badge-estado ${badgeGrav}">${inc.grav}</span></td>
 <td class="texto-mono">${inc.hora}</td>
 <td><span class="micro-etiqueta" style="color:#FFFFFF; background:rgba(255,255,255,0.08); padding:3px 8px; border-radius:4px;" title="Estado oficial del incidente">${inc.est}</span></td>
 `;
 tbody.appendChild(tr);
 });

 // Actualizar botón de exportación CSV
 const btnCsv = document.getElementById('contador-csv-btn');
 if (btnCsv) btnCsv.textContent = incidenciasFiltradas.length;
 }

 function filtrarIncidencias() {
 const grav = document.getElementById('filtro-inc-gravedad')?.value || 'TODAS';
 const odpe = document.getElementById('filtro-inc-odpe')?.value || 'TODAS';

 incidenciasFiltradas = incidenciasData.filter(item => {
 const coincideGrav = grav === 'TODAS' || item.grav === grav;
 const coincideOdpe = odpe === 'TODAS' || item.odpe.includes(odpe);
 return coincideGrav && coincideOdpe;
 });

 estadoApp.paginaIncidencias = 1;
 renderizarTablaIncidencias();
 }

 function exportarIncidenciasCSV() {
 let csv = "Codigo,ODPE,Descripcion,Gravedad,Hora,Estado\n";
 incidenciasFiltradas.forEach(i => {
 csv += `"${i.id}","${i.odpe}","${i.desc}","${i.grav}","${i.hora}","${i.est}"\n`;
 });

 const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
 const link = document.createElement('a');
 link.href = URL.createObjectURL(blob);
 link.download = `ONPE_Vision_Auditoria_${new Date().toISOString().substring(0,10)}.csv`;
 link.click();
 mostrarToast(`Exportados ${incidenciasFiltradas.length} registros a CSV exitosamente`, 'exito');
 }

 // 11. INICIALIZADOR AL CARGAR LA PÁGINA
 window.addEventListener('load', () => {
 if (document.getElementById('mapa-operativo') || document.getElementById('mapa-cobertura-completo') || document.getElementById('tbody-flota-12') || document.getElementById('tbody-incidencias')) {
   if (typeof L !== 'undefined' && (document.getElementById('mapa-operativo') || document.getElementById('mapa-cobertura-completo'))) {
     inicializarMapas();
   } else {
     renderizarFlotaLateral();
     renderizarTablaFlotaCompleta();
     renderizarTablaIncidencias();
   }
 }
 if (typeof inicializarAnalistaDatos === 'function' && document.getElementById('canvas-spline-hero')) inicializarAnalistaDatos();
 if (typeof inicializarModelosVideo === 'function' && document.getElementById('canvas-video-modelos-3d')) inicializarModelosVideo();
 if (typeof inicializarCommandPalette === 'function' && document.getElementById('modal-command-palette')) inicializarCommandPalette();

 // Botón simulación GPS
 const btnSim = document.getElementById('btn-iniciar-simulacion');
 if (btnSim) {
 btnSim.addEventListener('click', () => {
 estadoApp.simulando = !estadoApp.simulando;
 const txt = document.getElementById('texto-simulacion');
 if (estadoApp.simulando) {
 btnSim.style.background = 'var(--gradiente-peligro)';
 if (txt) txt.textContent = 'Pausar Simulación GPS';
 mostrarToast('Simulación de telemetría en tiempo real iniciada', 'info');
 
 estadoApp.intervaloSimulacion = setInterval(() => {
 const hud = document.getElementById('hud-telemetria');
 const hudUnit = document.getElementById('hud-unidad')?.textContent || '';
 flotaVehiculos.forEach(v => {
 if (v.vel > 0) {
 v.lat = Number((v.lat + (Math.random() - 0.48) * 0.002).toFixed(4));
 v.lng = Number((v.lng + (Math.random() - 0.48) * 0.002).toFixed(4));
 v.coords = [v.lat, v.lng];
 if (v.marcador) v.marcador.setLatLng([v.lat, v.lng]);
 if (v.marcadorNacional) v.marcadorNacional.setLatLng([v.lat, v.lng]);
 if (hud && hud.style.display === 'block' && hudUnit.includes(v.id)) {
   const hudCoords = document.getElementById('hud-coords');
   if (hudCoords) hudCoords.textContent = `${v.lat.toFixed(4)}, ${v.lng.toFixed(4)}`;
 }
 }
 });
 }, 2500);
 } else {
 btnSim.style.background = 'var(--gradiente-hero)';
 if (txt) txt.textContent = 'Iniciar Simulación GPS';
 clearInterval(estadoApp.intervaloSimulacion);
 mostrarToast('Simulación en pausa', 'info');
 }
 });
 }
 });


// ==========================================================================

// REGISTRO CRIPTOGRÁFICO EN TIEMPO REAL (EXECUTION TAPE)
// ==========================================================================

 function iniciarExecutionTape() {
 const tbody = document.getElementById('tbody-execution-tape');
 if (!tbody) return;

 const eventosBase = [
 { id: '#GAL-104', desc: 'Desvío de Corredor Vial SJM', hash: '0x8a9fe...b012', delta: '+14.2%', col: 'var(--rojo-critico)' },
 { id: '#DEZ-782', desc: 'Falla Neumática Frenos Ticlio', hash: '0x7c214...a981', delta: '+8.4%', col: 'var(--ambar-alerta)' },
 { id: '#DEZ-365', desc: 'Arribo Puerto Fluvial Bellavista', hash: '0x3d441...c722', delta: '+2.7%', col: 'var(--ambar-alerta)' },
 { id: '#DEZ-528', desc: 'Peaje Uchumayo Arequipa OK', hash: '0x9b128...d883', delta: '-1.2%', col: 'var(--verde-exito)' },
 { id: '#DEZ-234', desc: 'Troncal Panamericana Norte OK', hash: '0x5e012...f114', delta: '-2.5%', col: 'var(--verde-exito)' }
 ];

 let html = '';
 eventosBase.forEach(ev => {
 const now = new Date();
 const timeStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}.${String(Math.floor(Math.random()*900+100))}`;
 html += `
 <tr>
 <td class="texto-mono">${timeStr}</td>
 <td><strong>${ev.id}</strong></td>
 <td>${ev.desc}</td>
 <td class="texto-mono" style="color:var(--cian); font-size:10px;">${ev.hash}</td>
 <td class="texto-mono" style="color:${ev.col}; font-weight:700;">${ev.delta}</td>
 </tr>
 `;
 });
 tbody.innerHTML = html;
 }

 // =========================================================================
 // BASE DE DATOS SQL: EXPLORADOR Y CONSOLA INTERACTIVA

// TOOLTIP FLOTANTE DE TELEMETRÍA EN TABLA DE FLOTA (DELEGACIÓN SIN DUPLICADOS)
function vincularTooltipsFlota() {
  const tbody = document.getElementById('tbody-flota-12');
  const tooltip = document.getElementById('tooltip-vehiculo-flotante');
  if (!tbody || !tooltip || tbody.dataset.tooltipReady === 'true') return;
  tbody.dataset.tooltipReady = 'true';

  tbody.addEventListener('mouseover', function(e) {
    const tr = e.target.closest('tr');
    if (!tr || !tbody.contains(tr)) return;
    const placa = tr.querySelector('strong')?.textContent || '#GAL-104';
    const veh = flotaVehiculos.find(v => v.id === placa || v.placa === placa) || flotaVehiculos[0];

    const elId = document.getElementById('tt-veh-id');
    const elPlaca = document.getElementById('tt-veh-placa');
    const elTipo = document.getElementById('tt-veh-tipo');
    const elRuta = document.getElementById('tt-veh-ruta');
    const elFuel = document.getElementById('tt-veh-fuel');
    const elVel = document.getElementById('tt-veh-vel');
    const elPnp = document.getElementById('tt-veh-pnp');
    const elGps = document.getElementById('tt-veh-gps');

    if (elId) elId.textContent = veh.id;
    if (elPlaca) elPlaca.textContent = '(' + veh.placa + ')';
    if (elTipo) elTipo.textContent = veh.tipo;
    if (elRuta) elRuta.textContent = 'Ruta: ' + (veh.rutaNombre || veh.odpe);
    if (elFuel) elFuel.textContent = veh.fuel || '84% (420 km)';
    if (elVel) elVel.textContent = veh.vel + ' km/h';
    if (elPnp) elPnp.textContent = veh.pnp;
    if (elGps) elGps.textContent = `GPS: Lat ${veh.lat}, Lng ${veh.lng} · Temp: ${veh.temp || '18°C'} · PSI: ${veh.psi || 'OK'} · Bat: ${veh.bat || '98%'} · ${veh.enlace}`;

    const badge = document.getElementById('tt-veh-badge');
    if (badge) {
      if (veh.estado === 'ROJO') {
        badge.className = 'badge-estado badge-incumplimiento';
        badge.textContent = 'ROJO CRÍTICO';
      } else if (veh.estado === 'AMARILLO') {
        badge.className = 'badge-estado badge-alerta-amarilla';
        badge.textContent = 'ALERTA AMARILLA';
      } else {
        badge.className = 'badge-estado badge-conforme';
        badge.textContent = 'CONFORME';
      }
    }

    tooltip.style.display = 'block';
    tooltip.style.opacity = '1';
  });

  tbody.addEventListener('mousemove', function(e) {
    if (tooltip.style.display === 'block') {
      tooltip.style.left = (e.clientX + 16) + 'px';
      tooltip.style.top = (e.clientY + 16) + 'px';
    }
  });

  tbody.addEventListener('mouseleave', function() {
    tooltip.style.display = 'none';
    tooltip.style.opacity = '0';
  });
}
