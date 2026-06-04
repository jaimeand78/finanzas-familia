// js/ui.js
// Responsabilidad: navegación entre tabs, toast, setSS, renderMLabel, go().
// Depende de: utils.js (MONTHS), offline.js (oqSize, updateOfflineUI)

let curTab = 'd';

// ── NAVEGACIÓN TABS ───────────────────────────────────────────────────────────

function go(tab) {
  const cur = document.getElementById('p' + curTab);
  if (cur) cur.classList.remove('on');
  const curBtn = document.getElementById('tab-' + curTab);
  if (curBtn) curBtn.classList.remove('on');

  curTab = tab;
  const next = document.getElementById('p' + tab);
  if (next) next.classList.add('on');
  const nextBtn = document.getElementById('tab-' + tab);
  if (nextBtn) nextBtn.classList.add('on');

  if (tab === 'd') {
    updateDayLabel();
    if (typeof populateCatSel === 'function') populateCatSel();
    if (typeof subDaily       === 'function') subDaily();
  }
  if (tab === 'm') {
    if (typeof renderAll === 'function') renderAll();
  }
  if (tab === 'x') {
    if (typeof curYx !== 'undefined') { curYx = curY; curMx = curM; }
    if (typeof renderAnalisis === 'function') renderAnalisis();
  }
  if (tab === 'c') {
    renderConfigHogar();
    if (typeof renderConfigPresupuesto === 'function') renderConfigPresupuesto();
  }
}

function goAn(sub) {
  ['sem','ten','hor'].forEach(s => {
    document.getElementById('an-' + s)?.classList.remove('on');
    document.getElementById('ant-' + s)?.classList.remove('on');
  });
  document.getElementById('an-'  + sub)?.classList.add('on');
  document.getElementById('ant-' + sub)?.classList.add('on');
  if (sub === 'sem' && typeof renderSemaforo  === 'function') renderSemaforo();
  if (sub === 'ten' && typeof renderTendencia === 'function') renderTendencia();
  if (sub === 'hor' && typeof renderHormiga   === 'function') renderHormiga();
}

// ── LABEL DEL MES ─────────────────────────────────────────────────────────────

function renderMLabel() {
  const el = document.getElementById('mLbl');
  if (el) el.textContent = MONTHS[curM] + ' ' + curY;
}

// ── SYNC STATUS ───────────────────────────────────────────────────────────────

function setSS(s) {
  if (!navigator.onLine) { updateOfflineUI(); return; }
  const d = document.getElementById('sdot');
  const l = document.getElementById('slbl');
  if (!d || !l) return;
  const pending = oqSize();
  if (pending > 0 && s === 'ok') {
    d.className = 'sdot pending'; l.textContent = 'Pendientes: ' + pending; return;
  }
  d.className = 'sdot' + (s === 'ok' ? ' ok' : s === 'wait' ? ' wait' : '');
  l.textContent = s === 'ok' ? 'Sincronizado' : s === 'wait' ? 'Guardando...' : 'Sin conexión';
}

// ── TOAST ─────────────────────────────────────────────────────────────────────

function toast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('on');
  setTimeout(() => t.classList.remove('on'), 2500);
}

// ── LABEL DÍA ─────────────────────────────────────────────────────────────────

function updateDayLabel() {
  const el = document.getElementById('dayLbl');
  if (!el) return;
  const hoy  = new Date();
  const esHoy  = dailyDate.toDateString() === hoy.toDateString();
  const ayer   = new Date(hoy); ayer.setDate(hoy.getDate() - 1);
  const esAyer = dailyDate.toDateString() === ayer.toDateString();
  const dias   = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
  el.textContent = esHoy  ? 'Hoy' : esAyer ? 'Ayer' :
    dias[dailyDate.getDay()] + ' ' + dailyDate.getDate() + ' ' + MSHORT[dailyDate.getMonth()];
}

// ── CONFIG TAB ────────────────────────────────────────────────────────────────

function renderConfigHogar() {
  const el = document.getElementById('hogarInfo');
  if (!el || !window.HOGAR) return;
  const { nombre, tipo } = window.HOGAR.meta;
  const miembros = Object.keys(window.HOGAR.miembros || {}).length;
  el.innerHTML = `
    <strong>${nombre}</strong><br>
    Tipo: ${tipo || '—'} · ${miembros} miembro${miembros !== 1 ? 's' : ''}<br>
    Código: <span style="font-family:monospace;font-weight:700;letter-spacing:.1em;color:var(--color-primary);">${window.HOGAR.codigoHogar}</span>
  `;
}

// ── PWA iOS ───────────────────────────────────────────────────────────────────

function checkPWA() {
  if (navigator.userAgent.match(/iPhone|iPad/) && !navigator.standalone) {
    const el = document.getElementById('pwab');
    if (el) el.style.display = 'block';
  }
}
