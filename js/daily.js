// js/daily.js
// Responsabilidad: registro de gastos diarios — tab Hoy.
// Depende de: config.js (db), utils.js, offline.js, firebase-paths.js,
//             finanzas.js (D, curY, curM, user, dailyTotals, logH)

let dailyDate    = new Date();
let dailyUnsub   = null;
let dailyRefPath = '';

// ── SUBSCRIBE DÍA ─────────────────────────────────────────────────────────────

function subDaily() {
  if (dailyUnsub && dailyRefPath) {
    db.ref(dailyRefPath).off('value', dailyUnsub);
    dailyUnsub = null;
  }
  updateDayLabel();
  if (D.categories && D.categories.length > 0) populateCatSel();
  const path = dayKey(dailyDate);
  dailyRefPath = path;
  loadDailyPath(path);
  dailyUnsub = db.ref(path).on('value', snap => {
    if (path !== dailyRefPath) return;
    renderDailyData(path, snap.val());
    syncDailyMonth();
  }, e => {
    console.error('subDaily:', e);
    loadDailyPath(path);
    toast('No se pudieron cargar los gastos del día');
  });
}

function renderDailyData(path, data) {
  if (path !== dailyRefPath) return;
  const items = Object.keys(data || {}).map(id => ({ id, ...data[id] }));
  items.sort((a, b) => new Date(b.ts || 0) - new Date(a.ts || 0));
  renderDailyList(items);
}

async function loadDailyPath(path) {
  try {
    const snap = await db.ref(path).once('value');
    renderDailyData(path, snap.val());
  } catch(e) {
    console.error('loadDailyPath:', e);
    if (path === dailyRefPath) renderDailyList([]);
  }
}

window.refreshDaily = function() {
  if (dailyRefPath) loadDailyPath(dailyRefPath);
};

// ── NAVEGACIÓN DÍA ────────────────────────────────────────────────────────────

window.chDay = function(d) {
  dailyDate = new Date(dailyDate);
  dailyDate.setDate(dailyDate.getDate() + d);
  subDaily();
};

// ── SELECTOR DE CATEGORÍAS ────────────────────────────────────────────────────

function populateCatSel() {
  const sel  = document.getElementById('dCat');
  if (!sel) return;
  const prev = sel.value;
  const cats = D.categories ? D.categories.map(c => c.name) : [];
  sel.innerHTML = cats.map(c => `<option value="${c}">${c}</option>`).join('');
  if (prev && cats.includes(prev)) sel.value = prev;
}

// ── SUBMIT GASTO ──────────────────────────────────────────────────────────────

window.submitDaily = async function() {
  const amt  = parseFloat(document.getElementById('dAmt').value) || 0;
  const cat  = document.getElementById('dCat').value;
  const note = document.getElementById('dNote').value.trim();
  if (!amt)  { toast('Ingresa un monto'); return; }
  if (!cat)  { toast('Selecciona una categoría'); return; }

  const entry = { amount:amt, category:cat, note:note || '', who:user, ts:new Date().toISOString() };
  document.getElementById('dAmt').value  = '';
  document.getElementById('dNote').value = '';

  // UI optimista — mostrar inmediatamente
  const list = document.getElementById('dList');
  if (list) {
    const icon = ICONS[cat] || '💸';
    const time = new Date().toLocaleTimeString('es-CO', { hour:'2-digit', minute:'2-digit' });
    const div  = document.createElement('div');
    div.className = 'ditem pending';
    div.innerHTML = `
      <div class="ditem-icon">${icon}</div>
      <div class="ditem-info">
        <div class="ditem-note">${note || cat}</div>
        <div class="ditem-cat">${cat} · ${user} · ${time}</div>
      </div>
      <div class="ditem-amt">${fmt(amt)}</div>`;
    list.insertBefore(div, list.firstChild);
    // Actualizar total visual
    const tot = document.getElementById('dDayTotal');
    if (tot) {
      const cur = parseFloat((tot.textContent || '0').replace(/[^0-9]/g, '')) || 0;
      tot.textContent = fmt(cur + amt);
    }
  }

  if (!navigator.onLine) {
    oqAdd({ type:'push', path:dayKey(dailyDate), data:entry });
    updateOfflineUI();
    toast('💾 Guardado offline');
    return;
  }

  setSS('wait');
  try {
    await db.ref(dayKey(dailyDate)).push(entry);
    setSS('ok');
    toast('✅ Gasto registrado');
    if (typeof logH === 'function') logH('expense', note || cat, amt, cat);
    refreshDaily();
  } catch(e) {
    console.error('submitDaily:', e);
    oqAdd({ type:'push', path:dayKey(dailyDate), data:entry });
    updateOfflineUI();
    toast('💾 Guardado offline');
  }
};

window.delDaily = function(id) {
  db.ref(dayKey(dailyDate) + '/' + id).remove()
    .then(() => { toast('🗑️ Gasto eliminado'); refreshDaily(); syncDailyMonth(); })
    .catch(e => { console.error(e); toast('Error al eliminar'); });
};

// ── RENDER LISTA ──────────────────────────────────────────────────────────────

function renderDailyList(items) {
  const total = items.reduce((s, i) => s + (i.amount || 0), 0);
  const tot   = document.getElementById('dDayTotal');
  if (tot) tot.textContent = fmt(total);

  const list = document.getElementById('dList');
  if (!list) return;
  if (!items.length) {
    list.innerHTML = '<div style="text-align:center;color:#9b9b97;font-size:.85rem;padding:1.5rem 0;">Sin gastos registrados hoy 🎉</div>';
    return;
  }
  list.innerHTML = items.map(item => {
    const time = new Date(item.ts).toLocaleTimeString('es-CO', { hour:'2-digit', minute:'2-digit' });
    const icon = ICONS[item.category] || '💸';
    return `<div class="ditem">
      <div class="ditem-icon">${icon}</div>
      <div class="ditem-info">
        <div class="ditem-note">${item.note || item.category}</div>
        <div class="ditem-cat">${item.category} · ${item.who || '?'} · ${time}</div>
      </div>
      <div class="ditem-amt">${fmt(item.amount)}</div>
      <button class="ditem-del" onclick="delDaily('${item.id}')">&#215;</button>
    </div>`;
  }).join('');
}

// ── SYNC TOTALES CON MES ──────────────────────────────────────────────────────
// DA-1: los gastos diarios NUNCA se escriben en el nodo mensual.
// Se suman en memoria (dailyTotals) y recalc() los incluye al mostrar.

async function syncDailyMonth() {
  if (!D.categories) return;
  const y = curY, m = curM;
  try {
    const mm   = String(m + 1).padStart(2, '0');
    const snap = await db.ref(`hogares/${window.HOGAR.codigoHogar}/daily/${y}/${mm}`).once('value');
    dailyTotals = {};
    snap.forEach(daySnap => daySnap.forEach(item => {
      const v = item.val();
      if (!dailyTotals[v.category]) dailyTotals[v.category] = 0;
      dailyTotals[v.category] += v.amount || 0;
    }));
    if (curTab === 'm') renderAll();
    else recalc();
  } catch(e) { console.error('syncDailyMonth:', e); }
}
