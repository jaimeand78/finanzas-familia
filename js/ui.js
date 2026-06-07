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
    if (typeof renderResumen === 'function') renderResumen();
  }
  if (tab === 'x') {
    if (typeof curYx !== 'undefined') { curYx = curY; curMx = curM; }
    if (typeof renderAnalisis === 'function') renderAnalisis();
  }
  if (tab === 'c') {
    renderConfigHogar();
    if (typeof renderIngresosConfig  === 'function') renderIngresosConfig();
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
  el.textContent = esHoy ? 'Hoy' : esAyer ? 'Ayer' :
    dias[dailyDate.getDay()] + ' ' + dailyDate.getDate() + ' ' + MSHORT[dailyDate.getMonth()];
}

// ── CONFIG TAB ────────────────────────────────────────────────────────────────

function cfgToggle(id) {
  const body = document.getElementById('cfg-body-' + id);
  const chev = document.getElementById('cfg-chev-' + id);
  if (!body) return;
  const open = !body.classList.contains('cfg-collapsed');
  body.classList.toggle('cfg-collapsed', open);
  if (chev) chev.classList.toggle('cfg-chev-closed', open);
}

function renderConfigHogar() {
  const el = document.getElementById('hogarInfo');
  if (!el || !window.HOGAR) return;
  const { nombre, tipo } = window.HOGAR.meta;
  const codigo   = window.HOGAR.codigoHogar;
  const miembros = Object.entries(window.HOGAR.miembros || {});
  const chips = miembros.map(([uid, m]) => {
    const esCurrent = uid === window.UID;
    const nombre = m.nombre || (esCurrent && window.CURRENT_USER && window.CURRENT_USER.nombre) || '?';
    const initials = nombre.split(' ').map(p => p[0]).join('').slice(0,2).toUpperCase();
    return `<div class="cfg-member-chip">
      <div class="cfg-avatar">${initials}</div>
      <span>${nombre}</span>
    </div>`;
  }).join('');
  el.innerHTML = `
    <div class="cfg-info-row">
      <span class="cfg-info-lbl">Nombre</span>
      <span class="cfg-info-val">${nombre || '—'}</span>
    </div>
    <div class="cfg-info-row">
      <span class="cfg-info-lbl">Código</span>
      <span class="cfg-info-val cfg-code">${codigo}</span>
    </div>
    ${miembros.length ? `
    <div class="cfg-info-row" style="align-items:flex-start;">
      <span class="cfg-info-lbl">Miembros</span>
      <div class="cfg-members-row">${chips}</div>
    </div>` : ''}`;
}

function renderIngresosConfig() {
  const el = document.getElementById('ingresosConfig');
  if (!el) return;
  if (!D || !D.income || !D.income.length) {
    el.innerHTML = `<p class="cfg-empty">Sin ingresos configurados.</p>`;
    return;
  }

  // Separar ingresos fijos (buildIncomeFromPerfil) de adicionales (extra:true)
  const fijos    = D.income.filter(r => !r.extra);
  const extras   = D.income.filter(r => r.extra);

  // Obtener nombres de miembros del perfil
  const perfil   = (window.HOGAR && window.HOGAR.perfil) || {};
  // Intentar desde perfil.miembros, con fallback a HOGAR.miembros
  const perfilMbrs = Object.values(perfil.miembros || {}).filter(m => m.nombre);
  const hogarMbrs  = Object.values((window.HOGAR && window.HOGAR.miembros) || {}).filter(m => m.nombre);
  const miembros   = perfilMbrs.length ? perfilMbrs : hogarMbrs;

  let html = '';

  // Agrupar fijos por miembro
  miembros.forEach((mbr, mi) => {
    const primerNombre = mbr.nombre.split(' ')[0].toLowerCase();
    const fijosMbr  = fijos.filter(r => r.label && r.label.toLowerCase().includes(primerNombre));
    const extrasMbr = extras.filter(r => r.quien === mbr.nombre);

    const nombreDisplay = mbr.nombre.charAt(0).toUpperCase() + mbr.nombre.slice(1).toLowerCase();
    if (mi > 0) html += `<div class="cfg-member-divider"></div>`;
    html += `<div class="cfg-member-section"><p class="cfg-member-lbl">${nombreDisplay}</p>`;

    // Ingresos fijos del miembro
    fijosMbr.forEach(r => {
      const i = D.income.indexOf(r);
      html += `
      <div class="cfg-income-row">
        <span class="cfg-income-lbl">${r.label}</span>
        <span class="cfg-income-right">
          <span class="cfg-income-badge fijo">fijo</span>
          <span class="cfg-income-val">${fmt(r.value || 0)}</span>
          <button class="cfg-edit-btn" onclick="abrirModalIngreso(${i})">✏️</button>
        </span>
      </div>`;
    });

    // Ingresos adicionales del miembro
    extrasMbr.forEach(r => {
      const i = D.income.indexOf(r);
      html += `
      <div class="cfg-income-row">
        <span class="cfg-income-lbl cfg-income-extra">${r.label}</span>
        <span class="cfg-income-right">
          <span class="cfg-income-badge extra">+ extra</span>
          <span class="cfg-income-val">${fmt(r.value || 0)}</span>
          <button class="cfg-edit-btn" onclick="abrirModalIngreso(${i})">✏️</button>
          <button class="cfg-del-btn"  onclick="eliminarIngresoExtra(${i})">×</button>
        </span>
      </div>`;
    });

    html += `<button class="cfg-agregar-btn" onclick="abrirModalIngresoExtra('${mbr.nombre}')">＋ Agregar ingreso — ${nombreDisplay}</button>`;
    html += `</div>`;
  });

  // Ingresos sin miembro asignado (Otros ingresos u otros de v1)
  const sinMbr = fijos.filter(r => !miembros.some(m => r.label && r.label.toLowerCase().includes(m.nombre.split(' ')[0].toLowerCase())));
  if (sinMbr.length) {
    html += `<div class="cfg-member-divider"></div>`;
    sinMbr.forEach(r => {
      const i = D.income.indexOf(r);
      html += `
      <div class="cfg-income-row">
        <span class="cfg-income-lbl">${r.label}</span>
        <span class="cfg-income-right">
          <span class="cfg-income-val">${fmt(r.value || 0)}</span>
          <button class="cfg-edit-btn" onclick="abrirModalIngreso(${i})">✏️</button>
        </span>
      </div>`;
    });
  }

  const total = D.income.reduce((s, r) => s + (r.value || 0), 0);
  html += `<div class="cfg-income-total">Total: <span class="cfg-mono">${fmt(total)}</span></div>`;
  el.innerHTML = html;
}

// ── PWA iOS ───────────────────────────────────────────────────────────────────

function checkPWA() {
  if (navigator.userAgent.match(/iPhone|iPad/) && !navigator.standalone) {
    const el = document.getElementById('pwab');
    if (el) el.style.display = 'block';
  }
}
