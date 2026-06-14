// js/offline.js
// Responsabilidad: cola offline con localStorage. Sincronización automática.
// Depende de: utils.js (toast), ui.js (setSS, curTab)
// Validado en uso real — viaje Europa mayo 2026. No modificar la lógica core.

const OQ_KEY = 'fp_offline_queue';

// ── COLA ──────────────────────────────────────────────────────────────────────

function oqLoad() {
  try { return JSON.parse(localStorage.getItem(OQ_KEY) || '[]'); } catch(e) { return []; }
}

function oqSave(q) {
  try { localStorage.setItem(OQ_KEY, JSON.stringify(q)); } catch(e) { console.error('oqSave', e); }
}

function oqAdd(item) {
  const q = oqLoad();
  q.push({ ...item, _ts: Date.now() });
  oqSave(q);
  updateOfflineUI();
}

function oqSize() {
  return oqLoad().length;
}

// ── UI ────────────────────────────────────────────────────────────────────────

function updateOfflineUI() {
  const online  = navigator.onLine;
  const pending = oqSize();
  const banner  = document.getElementById('offlineBanner');
  const d       = document.getElementById('sdot');
  const l       = document.getElementById('slbl');

  if (banner) {
    if (!online) {
      banner.classList.add('on');
      banner.innerHTML = '📵 Sin conexión — los gastos se guardan localmente' +
        (pending > 0 ? ` <span class="pending-badge">${pending} pendiente${pending > 1 ? 's' : ''}</span>` : '');
    } else if (pending > 0) {
      banner.classList.add('on');
      banner.innerHTML = `☁️ Sincronizando ${pending} gasto${pending > 1 ? 's' : ''}...`;
    } else {
      banner.classList.remove('on');
    }
  }

  if (d && l) {
    if (!online)       { d.className = 'sdot offline'; l.textContent = 'Sin conexión'; }
    else if (pending > 0) { d.className = 'sdot pending'; l.textContent = 'Pendientes: ' + pending; }
  }
}

// ── SINCRONIZACIÓN ────────────────────────────────────────────────────────────

async function syncOfflineQueue() {
  if (!navigator.onLine) return;
  const q = oqLoad();
  if (!q.length) return;
  updateOfflineUI();

  const failed = [];
  for (const item of q) {
    try {
      if      (item.type === 'push')   await db.ref(item.path).push(item.data);
      else if (item.type === 'set')    await db.ref(item.path).set(item.data);
      else if (item.type === 'update') await db.ref(item.path).update(item.data);
    } catch(e) {
      console.error('syncOfflineQueue item failed:', e);
      failed.push(item);
    }
  }

  oqSave(failed);
  updateOfflineUI();

  if (failed.length === 0 && q.length > 0) {
    toast(`✅ ${q.length} gasto${q.length > 1 ? 's' : ''} sincronizado${q.length > 1 ? 's' : ''}`);
    setSS('ok');
    if (typeof refreshDaily  === 'function') refreshDaily();
    if (typeof syncDailyMonth === 'function') syncDailyMonth();
  } else if (failed.length > 0) {
    toast(`⚠️ ${failed.length} gasto${failed.length > 1 ? 's' : ''} pendiente${failed.length > 1 ? 's' : ''}`);
  }
}

// ── EVENTOS DE CONECTIVIDAD ───────────────────────────────────────────────────

window.addEventListener('online',  () => { updateOfflineUI(); syncOfflineQueue(); });
window.addEventListener('offline', () => { updateOfflineUI(); });
