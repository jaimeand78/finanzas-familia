// js/daily.js
// Responsabilidad: registro de gastos diarios — tab Hoy.
// Depende de: config.js (db), utils.js (DAILY_ITEMS, ICONS, fmt),
//             offline.js, firebase-paths.js,
//             finanzas.js (D, curY, curM, user, dailyTotals, logH)
// v2.0 — selector usa DAILY_ITEMS (categoría + ítem detallado)
//        nota obligatoria cuando ítem = "Otros"

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
  populateCatSel();
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

// ── SELECTOR DE CATEGORÍAS + ÍTEMS — DA-10 ───────────────────────────────────
// El selector usa DAILY_ITEMS (catálogo detallado), no defD().categories.
// Estructura: selector categoría → selector ítem → nota (obligatoria si "Otros")

function populateCatSel() {
  const catSel  = document.getElementById('dCat');
  const itemSel = document.getElementById('dItem');
  if (!catSel) return;

  const prevCat = catSel.value;
  const cats    = Object.keys(DAILY_ITEMS);

  catSel.innerHTML = cats.map(c =>
    `<option value="${c}">${c}</option>`
  ).join('');

  if (prevCat && cats.includes(prevCat)) catSel.value = prevCat;

  // Llenar ítems según categoría seleccionada
  populateItemSel();
}

function populateItemSel() {
  const catSel  = document.getElementById('dCat');
  const itemSel = document.getElementById('dItem');
  if (!catSel || !itemSel) return;

  const cat   = catSel.value;
  const items = DAILY_ITEMS[cat] || [];

  itemSel.innerHTML = items.map(it =>
    `<option value="${it}">${it}</option>`
  ).join('');

  // Actualizar visibilidad de nota según ítem actual
  updateNoteRequired();
}

// Cuando cambia la categoría, actualizar ítems y limpiar ítem seleccionado
window.onDailyCatChange = function() {
  populateItemSel();
  const itemSel = document.getElementById('dItem');
  if (itemSel) itemSel.selectedIndex = 0;
  updateNoteRequired();
};

// Cuando cambia el ítem, verificar si nota es obligatoria
window.onDailyItemChange = function() {
  updateNoteRequired();
};

// Nota obligatoria cuando ítem = "Otros" — DA-10 regla
function updateNoteRequired() {
  const itemSel  = document.getElementById('dItem');
  const noteEl   = document.getElementById('dNote');
  const noteHint = document.getElementById('dNoteHint');
  if (!itemSel || !noteEl) return;

  const isOtros = itemSel.value === 'Otros';
  noteEl.required = isOtros;
  noteEl.placeholder = isOtros ? '¿Qué fue este gasto? (obligatorio)' : 'Nota (opcional)';

  if (noteHint) {
    noteHint.style.display = isOtros ? 'block' : 'none';
    noteHint.textContent   = isOtros ? '⚠️ Describe el gasto para poder analizarlo después' : '';
  }
}

// ── SUBMIT GASTO ──────────────────────────────────────────────────────────────

window.submitDaily = async function() {
  const amt     = parseFloat(document.getElementById('dAmt').value) || 0;
  const catSel  = document.getElementById('dCat');
  const itemSel = document.getElementById('dItem');
  const note    = document.getElementById('dNote').value.trim();

  if (!amt) { toast('Ingresa un monto'); return; }
  if (!catSel || !catSel.value) { toast('Selecciona una categoría'); return; }

  const cat      = catSel.value;           // categoría con emoji: '🍽️ Alimentación'
  const itemName = itemSel ? itemSel.value : cat;

  // Nota obligatoria si ítem = "Otros"
  if (itemName === 'Otros' && !note) {
    toast('⚠️ Describe el gasto para continuar');
    document.getElementById('dNote').focus();
    return;
  }

  // Guardar categoría limpia (sin emoji) para cruzar con dailyTotals
  // dailyTotals usa cat.name de D.categories — mantener compatibilidad
  const catClean = cat.replace(/^[\u{1F300}-\u{1FFFF}🏠🍽️🚗🎬👕❤️📚🛡️🎁💰🏡💸\s]+/u, '').trim();

  const entry = {
    amount:   amt,
    category: cat,        // categoría con emoji (DAILY_ITEMS key)
    catClean: catClean,   // categoría sin emoji (para compatibilidad con dailyTotals)
    item:     itemName,   // ítem detallado
    note:     note || '',
    who:      user,
    ts:       new Date().toISOString()
  };

  // Limpiar formulario
  document.getElementById('dAmt').value  = '';
  document.getElementById('dNote').value = '';
  updateNoteRequired();

  // UI optimista
  const list = document.getElementById('dList');
  if (list) {
    const icon = ICONS[catClean] || ICONS[cat] || '💸';
    const time = new Date().toLocaleTimeString('es-CO', { hour:'2-digit', minute:'2-digit' });
    const div  = document.createElement('div');
    div.className = 'ditem pending';
    div.innerHTML = `
      <div class="ditem-icon">${icon}</div>
      <div class="ditem-info">
        <div class="ditem-note">${note || itemName}</div>
        <div class="ditem-cat">${cat} · ${itemName} · ${user} · ${time}</div>
      </div>
      <div class="ditem-amt">${fmt(amt)}</div>`;
    list.insertBefore(div, list.firstChild);
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
    if (typeof logH === 'function') logH('expense', note || itemName, amt, cat);
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
    const time     = new Date(item.ts).toLocaleTimeString('es-CO', { hour:'2-digit', minute:'2-digit' });
    const catClean = (item.catClean || item.category || '').replace(/^[\u{1F300}-\u{1FFFF}🏠🍽️🚗🎬👕❤️📚🛡️🎁💰🏡💸\s]+/u, '').trim();
    const icon     = ICONS[catClean] || ICONS[item.category] || '💸';
    // Mostrar ítem detallado si existe, sino nota, sino categoría
    const label    = item.item && item.item !== item.category
      ? item.item + (item.note ? ' — ' + item.note : '')
      : (item.note || item.category);
    const subLabel = item.category + ' · ' + (item.who || '?') + ' · ' + time;
    return `<div class="ditem">
      <div class="ditem-icon">${icon}</div>
      <div class="ditem-info">
        <div class="ditem-note">${label}</div>
        <div class="ditem-cat">${subLabel}</div>
      </div>
      <div class="ditem-amt">${fmt(item.amount)}</div>
      <button class="ditem-del" onclick="delDaily('${item.id}')">&#215;</button>
    </div>`;
  }).join('');
}

// ── SYNC TOTALES CON MES ──────────────────────────────────────────────────────
// DA-1: los gastos diarios NUNCA se escriben en el nodo mensual.
// Se suman en memoria (dailyTotals) y recalc() los incluye al mostrar.
// Agrupa por categoría de DAILY_ITEMS para cruzar con D.categories.

async function syncDailyMonth() {
  if (!D.categories) return;
  const y = curY, m = curM;
  try {
    const mm   = String(m + 1).padStart(2, '0');
    const snap = await db.ref(`hogares/${window.HOGAR.codigoHogar}/daily/${y}/${mm}`).once('value');
    dailyTotals = {};
    snap.forEach(daySnap => daySnap.forEach(itemSnap => {
      const v = itemSnap.val();
      // Usar catClean si existe (v2), sino usar category directamente (v1)
      const catKey = v.catClean || v.category || '';
      if (!catKey) return;
      if (!dailyTotals[catKey]) dailyTotals[catKey] = 0;
      dailyTotals[catKey] += v.amount || 0;
    }));
    if (curTab === 'm') renderAll();
    else recalc();
  } catch(e) { console.error('syncDailyMonth:', e); }
}
