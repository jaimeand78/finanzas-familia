// js/daily.js
// Responsabilidad: registro de gastos diarios — tab Hoy.
// Depende de: config.js (db), utils.js (DAILY_ITEMS, ICONS, fmt),
//             offline.js, firebase-paths.js,
//             finanzas.js (D, curY, curM, user, dailyTotals)
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

let dailyItemsCache = [];

function renderDailyData(path, data) {
  if (path !== dailyRefPath) return;
  const items = Object.keys(data || {}).map(id => ({ id, ...data[id] }));
  items.sort((a, b) => new Date(b.ts || 0) - new Date(a.ts || 0));
  dailyItemsCache = items;
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

// ── SELECTOR CATEGORÍA + ÍTEM — DA-10 ────────────────────────────────────────
// Usa DAILY_ITEMS, NUNCA defD().categories

function populateCatSel() {
  const catSel = document.getElementById('dCat');
  if (!catSel) return;
  const prevCat = catSel.value;

  // Filtrar categorías según flags del perfil del hogar
  const flags = (typeof getPerfilFlags === 'function') ? getPerfilFlags() : {};
  const cats = Object.keys(DAILY_ITEMS).filter(c => {
    if (!flags.tieneEmpleada  && c.includes('Servicio Doméstico')) return false;
    if (!flags.tieneEducacion && c.includes('Educación'))          return false;
    if (!flags.tieneSeguros   && c.includes('Seguros'))            return false;
    return true;
  });

  catSel.innerHTML = cats.map(c => `<option value="${c}">${c}</option>`).join('');
  if (prevCat && cats.includes(prevCat)) catSel.value = prevCat;
  populateItemSel();
}

function populateItemSel() {
  const catSel  = document.getElementById('dCat');
  const itemSel = document.getElementById('dItem');
  if (!catSel || !itemSel) return;

  const flags = (typeof getPerfilFlags === 'function') ? getPerfilFlags() : {};
  const ITEMS_VEHICULO = ['Cuota Crédito / Leasing','Combustible','Peajes','Parqueaderos','Mantenimiento Vehículo','SOAT','Seguro Vehículo','Impuestos Vehículo'];

  let items = DAILY_ITEMS[catSel.value] || [];

  // Si no tiene vehículo, filtrar ítems de vehículo en Transporte
  if (!flags.tieneVehiculo && catSel.value.includes('Transporte')) {
    items = items.filter(it => !ITEMS_VEHICULO.includes(it));
  }

  itemSel.innerHTML = items.map(it => `<option value="${it}">${it}</option>`).join('');
  updateNoteRequired();
}

window.onDailyCatChange = function() {
  populateItemSel();
  updateNoteRequired();
};

window.onDailyItemChange = function() {
  updateNoteRequired();
};

// Nota obligatoria si ítem = "Otros"
function updateNoteRequired() {
  const itemSel  = document.getElementById('dItem');
  const noteEl   = document.getElementById('dNote');
  const hintEl   = document.getElementById('dNoteHint');
  if (!itemSel || !noteEl) return;
  const isOtros = itemSel.value === 'Otros';
  noteEl.placeholder = isOtros ? '¿Qué fue? (obligatorio)' : 'Nota (opcional)';
  if (hintEl) {
    hintEl.style.display = isOtros ? 'block' : 'none';
    hintEl.textContent   = isOtros ? '⚠️ Agrega una nota para poder analizarlo después' : '';
  }
}

// ── SUBMIT GASTO ──────────────────────────────────────────────────────────────

window.submitDaily = async function() {
  const amt     = parseFloat(document.getElementById('dAmt').value) || 0;
  const catSel  = document.getElementById('dCat');
  const itemSel = document.getElementById('dItem');
  const noteEl  = document.getElementById('dNote');
  const note    = noteEl ? noteEl.value.trim() : '';

  if (!amt) { toast('Ingresa un monto'); return; }
  if (!catSel || !catSel.value) { toast('Selecciona una categoría'); return; }

  const cat      = catSel.value;
  const itemName = itemSel ? itemSel.value : cat;

  if (itemName === 'Otros' && !note) {
    toast('⚠️ Escribe una nota para continuar');
    if (noteEl) noteEl.focus();
    return;
  }

  const entry = {
    amount:   amt,
    category: cat,
    item:     itemName,
    note:     note || '',
    who:      user,
    ts:       new Date().toISOString()
  };

  // Limpiar formulario
  document.getElementById('dAmt').value = '';
  if (noteEl) noteEl.value = '';
  updateNoteRequired();

  // UI optimista
  const list = document.getElementById('dList');
  if (list) {
    // Extraer nombre sin emoji para buscar en ICONS
    const catName = cat.replace(/^\S+\s/, '');
    const icon    = ICONS[catName] || '💸';
    const time    = new Date().toLocaleTimeString('es-CO', { hour:'2-digit', minute:'2-digit' });
    const div     = document.createElement('div');
    div.className = 'ditem pending';
    div.innerHTML = `
      <div class="ditem-icon">${icon}</div>
      <div class="ditem-info">
        <div class="ditem-note">${note || itemName}</div>
        <div class="ditem-cat">${cat} · ${user} · ${time}</div>
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
    if (typeof trackEvent === 'function') trackEvent('gasto_registrado');
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
    const time    = new Date(item.ts).toLocaleTimeString('es-CO', { hour:'2-digit', minute:'2-digit' });
    const catName = (item.category || '').replace(/^\S+\s/, '');
    const icon    = ICONS[catName] || ICONS[item.category] || '💸';
    const label   = item.item && item.item !== item.category
      ? item.item + (item.note ? ' — ' + item.note : '')
      : (item.note || item.category);
    return `<div class="ditem" onclick="editDaily('${item.id}')">
      <div class="ditem-icon">${icon}</div>
      <div class="ditem-info">
        <div class="ditem-note">${label}</div>
        <div class="ditem-cat">${item.category} · ${item.who || '?'} · ${time}</div>
      </div>
      <div class="ditem-amt">${fmt(item.amount)}</div>
      <button class="ditem-del" onclick="event.stopPropagation();delDaily('${item.id}')">&#215;</button>
    </div>`;
  }).join('');
}

// ── EDITAR GASTO ──────────────────────────────────────────────────────────────
// Modal: valor, categoría, ítem, nota. Fecha/hora y "quién" no son editables.

let editingDailyId = null;

window.editDaily = function(id) {
  const item = dailyItemsCache.find(i => i.id === id);
  if (!item) return;
  editingDailyId = id;

  document.getElementById('deAmt').value = item.amount || '';
  populateEditCatSel(item.category);
  populateEditItemSel(item.category, item.item);
  document.getElementById('deNote').value = item.note || '';

  document.getElementById('dailyEditModal').style.display = 'flex';
};

function populateEditCatSel(selectedCat) {
  const catSel = document.getElementById('deCat');
  if (!catSel) return;

  const flags = (typeof getPerfilFlags === 'function') ? getPerfilFlags() : {};
  const cats = Object.keys(DAILY_ITEMS).filter(c => {
    if (!flags.tieneEmpleada  && c.includes('Servicio Doméstico')) return false;
    if (!flags.tieneEducacion && c.includes('Educación'))          return false;
    if (!flags.tieneSeguros   && c.includes('Seguros'))            return false;
    return true;
  });

  // Si la categoría guardada ya no está en el catálogo activo, igual se muestra
  // para no perder el dato (caso de registros antiguos o flags cambiados)
  if (selectedCat && !cats.includes(selectedCat)) cats.unshift(selectedCat);

  catSel.innerHTML = cats.map(c => `<option value="${c}">${c}</option>`).join('');
  catSel.value = selectedCat || cats[0];
}

function populateEditItemSel(cat, selectedItem) {
  const itemSel = document.getElementById('deItem');
  if (!itemSel) return;

  const flags = (typeof getPerfilFlags === 'function') ? getPerfilFlags() : {};
  const ITEMS_VEHICULO = ['Cuota Crédito / Leasing','Combustible','Peajes','Parqueaderos','Mantenimiento Vehículo','SOAT','Seguro Vehículo','Impuestos Vehículo'];

  let items = DAILY_ITEMS[cat] || [];
  if (!flags.tieneVehiculo && cat.includes('Transporte')) {
    items = items.filter(it => !ITEMS_VEHICULO.includes(it));
  }

  // Si el ítem guardado no está en el catálogo activo, igual se muestra
  if (selectedItem && !items.includes(selectedItem)) items = [selectedItem, ...items];

  itemSel.innerHTML = items.map(it => `<option value="${it}">${it}</option>`).join('');
  itemSel.value = selectedItem || items[0];
  updateEditNoteRequired();
}

window.onEditCatChange = function() {
  const cat = document.getElementById('deCat').value;
  populateEditItemSel(cat, null);
};

window.onEditItemChange = function() {
  updateEditNoteRequired();
};

function updateEditNoteRequired() {
  const itemSel = document.getElementById('deItem');
  const noteEl  = document.getElementById('deNote');
  const hintEl  = document.getElementById('deNoteHint');
  if (!itemSel || !noteEl) return;
  const isOtros = itemSel.value === 'Otros';
  noteEl.placeholder = isOtros ? '¿Qué fue? (obligatorio)' : 'Nota (opcional)';
  if (hintEl) {
    hintEl.style.display = isOtros ? 'block' : 'none';
    hintEl.textContent   = isOtros ? '⚠️ Agrega una nota para poder analizarlo después' : '';
  }
}

window.cerrarModalEditDaily = function() {
  document.getElementById('dailyEditModal').style.display = 'none';
  editingDailyId = null;
};

window.guardarModalEditDaily = async function() {
  if (!editingDailyId) return;

  const amt     = parseFloat(document.getElementById('deAmt').value) || 0;
  const cat     = document.getElementById('deCat').value;
  const itemVal = document.getElementById('deItem').value;
  const note    = document.getElementById('deNote').value.trim();

  if (!amt) { toast('Ingresa un monto'); return; }
  if (itemVal === 'Otros' && !note) {
    toast('⚠️ Escribe una nota para continuar');
    document.getElementById('deNote').focus();
    return;
  }

  const updates = { amount: amt, category: cat, item: itemVal, note: note || '' };
  const path = dayKey(dailyDate) + '/' + editingDailyId;

  cerrarModalEditDaily();

  if (!navigator.onLine) {
    oqAdd({ type:'update', path, data:updates });
    updateOfflineUI();
    toast('💾 Guardado offline');
    return;
  }

  setSS('wait');
  try {
    await db.ref(path).update(updates);
    setSS('ok');
    toast('✅ Gasto actualizado');
    refreshDaily();
    syncDailyMonth();
  } catch(e) {
    console.error('guardarModalEditDaily:', e);
    oqAdd({ type:'update', path, data:updates });
    updateOfflineUI();
    toast('💾 Guardado offline');
  }
};

// ── SYNC TOTALES CON MES — DA-1 ───────────────────────────────────────────────
// Los gastos diarios NUNCA se escriben en el nodo mensual.
// Se suman en memoria (dailyTotals) por categoría para que recalc() los use.

async function syncDailyMonth() {
  if (!D.categories) return;
  const y = curY, m = curM;
  try {
    const mm   = String(m + 1).padStart(2, '0');
    const snap = await db.ref(`hogares/${window.HOGAR.codigoHogar}/daily/${y}/${mm}`).once('value');
    dailyTotals = {};
    snap.forEach(daySnap => daySnap.forEach(itemSnap => {
      const v = itemSnap.val();
      // Compatibilidad v1 (solo category) y v2 (category con emoji)
      // Normalizar: quitar emoji inicial para que coincida con c.name en renderResumen
      const rawCat = v.category || '';
      if (!rawCat) return;
      const catKey = rawCat.replace(/^\S+\s/, '') || rawCat;
      if (!dailyTotals[catKey]) dailyTotals[catKey] = 0;
      dailyTotals[catKey] += v.amount || 0;
    }));
    if (curTab === 'm') renderAll();
    else recalc();
  } catch(e) { console.error('syncDailyMonth:', e); }
}
