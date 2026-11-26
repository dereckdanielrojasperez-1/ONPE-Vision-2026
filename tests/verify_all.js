const assert = require('node:assert');
const { spawn } = require('node:child_process');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const PORT = 3099;
const BASE = `http://127.0.0.1:${PORT}`;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function waitForServer() {
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`${BASE}/api/kpis`);
      if (res.ok) return;
    } catch (_) {}
    await sleep(150);
  }
  throw new Error('Backend server did not start in time');
}

async function runTests() {
  const rootDir = path.resolve(__dirname, '..');

  // 1. Verificar integridad SQLite y propiedad aditiva TreeSHAP
  const db = new DatabaseSync(path.join(rootDir, 'onpe_vision.db'));
  const alertas = db.prepare('SELECT * FROM alertas_xai').all();
  assert.strictEqual(alertas.length, 3, 'Debe haber exactamente 3 alertas XAI');
  for (const a of alertas) {
    const suma = 0.05 + a.shap_retraso + a.shap_geografia + a.shap_contratista + a.shap_exclusion;
    assert(Math.abs(suma - a.score_riesgo) < 0.001, `SHAP aditivo no cuadra para ${a.id_vehiculo}: ${suma} vs ${a.score_riesgo}`);
  }
  const ticlio = db.prepare("SELECT latitud, longitud FROM vehiculos_transporte WHERE id_vehiculo = '#DEZ-782'").get();
  assert(Math.abs(ticlio.latitud - (-11.5944)) < 0.01, 'Coordenada Ticlio #DEZ-782 debe ser -11.5944');
  db.close();
  console.log('[OK] SQLite schema, 3 alertas XAI aditivas y coordenadas Ticlio verificadas.');

  // 2. Iniciar backend en puerto aislado
  const proc = spawn('node', ['simulador_backend.js'], {
    cwd: rootDir,
    env: { ...process.env, PORT: String(PORT) },
    stdio: 'ignore'
  });

  try {
    await waitForServer();

    // Endpoints 200
    for (const ep of ['/', '/api/telemetria', '/api/kpis', '/api/db/stats', '/api/xai/%23GAL-104']) {
      const r = await fetch(`${BASE}${ep}`);
      assert.strictEqual(r.status, 200, `GET ${ep} esperado 200, obtuvo ${r.status}`);
    }
    const stats = await (await fetch(`${BASE}/api/db/stats`)).json();
    const totalRegs = Object.values(stats.tablas || {}).reduce((a, b) => a + b, 0);
    assert.strictEqual(totalRegs, 32, `Total de registros esperado 32, obtuvo ${totalRegs}`);

    const tele = await (await fetch(`${BASE}/api/telemetria`)).json();
    const listaVeh = tele.vehiculos || tele.unidades || tele.flota || [];
    assert.strictEqual(listaVeh.length, 12, `flotaActiva debe devolver 12 unidades, obtuvo ${listaVeh.length}`);

    // Endpoints 400 / 404
    const badUri = await fetch(`${BASE}/api/xai/%ZZ`);
    assert.strictEqual(badUri.status, 400, 'GET /api/xai/%ZZ debe devolver 400');

    const notFound = await fetch(`${BASE}/api/xai/INEXISTENTE`);
    assert.strictEqual(notFound.status, 404, 'GET /api/xai/INEXISTENTE debe devolver 404');

    // Ingesta inválida vs válida
    const badIngesta = await fetch(`${BASE}/api/telemetria/ingesta`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_vehiculo: '#GAL-104', lat: 1540.99, lng: -76.96, vel: 10 })
    });
    assert.strictEqual(badIngesta.status, 400, 'Latitud 1540.99 debe devolver 400');

    // JSON malformado
    const badJson = await fetch(`${BASE}/api/db/consulta`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{invalid_json'
    });
    assert.strictEqual(badJson.status, 400, 'JSON malformado debe devolver 400');

    // SQL peligroso
    for (const sql of ['DROP TABLE vehiculos_transporte;', 'SELECT * FROM sqlite_master;', 'PRAGMA table_info(vehiculos_transporte);']) {
      const r = await fetch(`${BASE}/api/db/consulta`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: sql })
      });
      assert(r.status === 400 || r.status === 403, `SQL peligroso (${sql}) debe ser bloqueado, obtuvo ${r.status}`);
    }

    // SQL válido
    const okSql = await fetch(`${BASE}/api/db/consulta`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'SELECT * FROM vehiculos_transporte' })
    });
    assert.strictEqual(okSql.status, 200);
    const okSqlJson = await okSql.json();
    assert.strictEqual(okSqlJson.filas.length, 12);

    // XSS Chatbot
    const xssRes = await fetch(`${BASE}/api/chatbot/consulta`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensaje: '<img src=x onerror=alert(1)>', seccion_actual: 'analista-datos' })
    });
    assert.strictEqual(xssRes.status, 200);
    const xssBody = await xssRes.text();
    assert(!xssBody.includes('<img src=x'), 'El backend no debe reflejar HTML sin escapar en el chatbot');

    // Archivos sensibles bloqueados (403/404)
    for (const sens of ['/onpe_vision.db', '/simulador_backend.js', '/.cursorrules', '/../../Windows/win.ini']) {
      const r = await fetch(`${BASE}${sens}`);
      assert(r.status === 403 || r.status === 404, `Acceso a ${sens} debe ser 403/404, obtuvo ${r.status}`);
    }

    console.log('[OK] Todas las pruebas de API, seguridad, SQLite y XSS pasaron correctamente.');
  } finally {
    proc.kill();
  }
}

runTests().catch((err) => {
  console.error('[FAIL]', err);
  process.exit(1);
});
