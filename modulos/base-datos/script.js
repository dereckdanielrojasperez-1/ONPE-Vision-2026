window.addEventListener('load', () => {
  if (typeof mostrarTablaDB === 'function') {
    mostrarTablaDB('vehiculos_transporte');
  }
});

function _extraerTablaActualDOM() {
  const thead = document.getElementById('thead-datos-sql');
  const tbody = document.getElementById('tbody-datos-sql');
  if (!thead || !tbody) return { cols: [], rows: [] };
  const cols = Array.from(thead.querySelectorAll('th')).map(th => th.textContent.trim());
  const rows = Array.from(tbody.querySelectorAll('tr')).map(tr => {
    const obj = {};
    const tds = tr.querySelectorAll('td');
    cols.forEach((c, idx) => {
      obj[c] = tds[idx] ? tds[idx].textContent.trim() : '';
    });
    return obj;
  });
  return { cols, rows };
}

function exportarTablaSQLCSV() {
  const { cols, rows } = _extraerTablaActualDOM();
  if (!cols.length || !rows.length) {
    if (typeof mostrarToast === 'function') mostrarToast('No hay filas visibles para exportar', 'warning');
    return;
  }
  const lines = [cols.map(c => `"${c.replace(/"/g, '""')}"`).join(',')];
  rows.forEach(r => {
    lines.push(cols.map(c => `"${String(r[c] ?? '').replace(/"/g, '""')}"`).join(','));
  });
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `onpe_vision_sql_export_${new Date().toISOString().substring(0, 10)}.csv`;
  a.click();
  if (typeof mostrarToast === 'function') mostrarToast(`Exportadas ${rows.length} filas a CSV`, 'exito');
}

function exportarTablaSQLJSON() {
  const { rows } = _extraerTablaActualDOM();
  if (!rows.length) {
    if (typeof mostrarToast === 'function') mostrarToast('No hay filas visibles para exportar', 'warning');
    return;
  }
  const blob = new Blob([JSON.stringify(rows, null, 2)], { type: 'application/json;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `onpe_vision_sql_export_${new Date().toISOString().substring(0, 10)}.json`;
  a.click();
  if (typeof mostrarToast === 'function') mostrarToast(`Exportadas ${rows.length} filas a JSON`, 'exito');
}
