// js/finanzas.js
// Responsabilidad: presupuesto mensual — subMonth, save, recalc, renderAll.
// Depende de: config.js (db), utils.js, offline.js, firebase-paths.js, ui.js
// v2.0 — defD 10 categorías, buildIncomeFromPerfil, calcPresupuestoBase

// ── ESTADO ────────────────────────────────────────────────────────────────────

let curY = new Date().getFullYear();
let curM = new Date().getMonth();
let D    = {};
let unsub    = null;
let wTimer   = null;
let dailyTotals = {};
let _migrating  = false;
let user = '';

// ── ARRANQUE ──────────────────────────────────────────────────────────────────

function arrancarFinanzas() {
  const fu = firebase.auth(firebase.app('fp')).currentUser;
  if (fu) user = (fu.displayName || fu.email || '').split(' ')[0].split('@')[0];
  updateWhoChip();
  subMonth();
  appLista();
}

function updateWhoChip() {
  const c = document.getElementById('uChip');
  if (!c) return;
  c.textContent = user;
  c.style.display = user ? 'inline-flex' : 'none';
  const dw = document.getElementById('dWhoChip');
  if (dw) dw.textContent = user;
}

// ── INGRESOS DINÁMICOS — DA-11 ────────────────────────────────────────────────
// Labels NUNCA hardcodeados. Siempre desde el perfil del hogar.

function buildIncomeFromPerfil(perfil) {
  const miembros = Object.values((perfil && perfil.miembros) || {})
    .filter(m => m.rol === 'adulto' && m.nombre);
  const income = miembros.map(m => ({ label: 'Ingreso ' + m.nombre, value: 0, fixed: true }));
  if (!income.length) income.push({ label: 'Ingreso principal', value: 0, fixed: true });
  income.push({ label: 'Otros ingresos', value: 0, fixed: false });
  return income;
}

// ── DEFAULT DATA v2.0 — 10 categorías oficiales ───────────────────────────────

function defD() {
  return {
    _v2: true,
    income: buildIncomeFromPerfil(window.PERFIL || (window.HOGAR && window.HOGAR.perfil) || {}),
    categories: [
      { name: '🏠 Vivienda', items: [
        { label: 'Arriendo / Hipoteca', value:0, budget:0, fixed:true  },
        { label: 'Administración',      value:0, budget:0, fixed:true  },
        { label: 'Agua y Energía',      value:0, budget:0, fixed:true  },
        { label: 'Gas',                 value:0, budget:0, fixed:true  },
        { label: 'Internet',            value:0, budget:0, fixed:true  },
        { label: 'Telefonía',           value:0, budget:0, fixed:true  },
        { label: 'Servicio doméstico',  value:0, budget:0, fixed:true  },
        { label: 'Mantenimiento hogar', value:0, budget:0, fixed:false },
        { label: 'Otros',               value:0, budget:0, fixed:false },
      ]},
      { name: '🍽️ Alimentación', items: [
        { label: 'Mercado',   value:0, budget:0, fixed:false },
        { label: 'Loncheras', value:0, budget:0, fixed:false },
        { label: 'Otros',     value:0, budget:0, fixed:false },
      ]},
      { name: '🚗 Transporte', items: [
        { label: 'Cuota crédito / leasing', value:0, budget:0, fixed:true  },
        { label: 'Combustible',             value:0, budget:0, fixed:false },
        { label: 'Transporte público',      value:0, budget:0, fixed:false },
        { label: 'Peajes',                  value:0, budget:0, fixed:false },
        { label: 'Parqueadero',             value:0, budget:0, fixed:false },
        { label: 'Mantenimiento vehículo',  value:0, budget:0, fixed:false },
        { label: 'Otros',                   value:0, budget:0, fixed:false },
      ]},
      { name: '🎬 Entretenimiento', items: [
        { label: 'Streaming',    value:0, budget:0, fixed:true  },
        { label: 'Restaurantes', value:0, budget:0, fixed:false },
        { label: 'Cine',         value:0, budget:0, fixed:false },
        { label: 'Salidas',      value:0, budget:0, fixed:false },
        { label: 'Viajes',       value:0, budget:0, fixed:false },
        { label: 'Vacaciones',   value:0, budget:0, fixed:false },
        { label: 'Otros',        value:0, budget:0, fixed:false },
      ]},
      { name: '👕 Vestuario', items: [
        { label: 'Ropa',     value:0, budget:0, fixed:false },
        { label: 'Zapatos',  value:0, budget:0, fixed:false },
        { label: 'Uniforme', value:0, budget:0, fixed:false },
        { label: 'Otros',    value:0, budget:0, fixed:false },
      ]},
      { name: '❤️ Salud y Belleza', items: [
        { label: 'Medicina prepagada', value:0, budget:0, fixed:true  },
        { label: 'Gimnasio',           value:0, budget:0, fixed:true  },
        { label: 'Salud',              value:0, budget:0, fixed:false },
        { label: 'Belleza',            value:0, budget:0, fixed:false },
        { label: 'Otros',              value:0, budget:0, fixed:false },
      ]},
      { name: '📚 Educación', items: [
        { label: 'Universidad',                   value:0, budget:0, fixed:true  },
        { label: 'Colegio',                       value:0, budget:0, fixed:true  },
        { label: 'Jardín',                        value:0, budget:0, fixed:true  },
        { label: 'Matrícula',                     value:0, budget:0, fixed:false },
        { label: 'Actividades extracurriculares', value:0, budget:0, fixed:false },
        { label: 'Otros',                         value:0, budget:0, fixed:false },
      ]},
      { name: '🛡️ Seguros e Impuestos', items: [
        { label: 'Seguro de vida',     value:0, budget:0, fixed:true, frecuencia:'anual'             },
        { label: 'Seguro de hogar',    value:0, budget:0, fixed:true, frecuencia:'anual'             },
        { label: 'Seguro vehículo',    value:0, budget:0, fixed:true, frecuencia:'anual'             },
        { label: 'SOAT',               value:0, budget:0, fixed:true, frecuencia:'anual', months:[7] },
        { label: 'Impuestos vehículo', value:0, budget:0, fixed:true, frecuencia:'anual', months:[3] },
        { label: 'Impuesto predial',   value:0, budget:0, fixed:true, frecuencia:'anual', months:[2] },
        { label: 'Otros',              value:0, budget:0, fixed:false                               },
      ]},
      { name: '🎁 Regalos y Celebraciones', items: [
        { label: 'Regalos',       value:0, budget:0, fixed:false },
        { label: 'Celebraciones', value:0, budget:0, fixed:false },
        { label: 'Otros',         value:0, budget:0, fixed:false },
      ]},
      { name: '💰 Ahorro', items: [
        { label: 'Ahorro programado', value:0, budget:0, fixed:true  },
        { label: 'Fondo emergencia',  value:0, budget:0, fixed:true  },
        { label: 'Otros',             value:0, budget:0, fixed:false },
      ]},
    ],
    nomina:    null,
    empleadas: null
  };
}

// ── PRESUPUESTO BASE — DA-8 ───────────────────────────────────────────────────
// ÚNICA función que calcula provisión mensual. Nunca calcular inline.

function calcPresupuestoBase(item, mesActual) {
  const b = item.budget || 0;
  if (!b) return 0;
  const frec = item.frecuencia || 'mensual';
  if (frec === 'mensual') return b;
  if (item.months && item.months.length) {
    return item.months.includes(mesActual) ? b : 0;
  }
  const divisores = { bimestral:2, trimestral:3, semestral:6, anual:12 };
  return Math.round(b / (divisores[frec] || 1));
}

// ── SUBSCRIBE MES ─────────────────────────────────────────────────────────────

function subMonth() {
  if (unsub) { db.ref(dKey(curY, curM)).off('value', unsub); unsub = null; }
  renderMLabel();
  unsub = db.ref(dKey(curY, curM)).on('value', snap => {
    if (_migrating) return;
    const v = snap.val();
    if (v) {
      _migrating = true;
      if (v.categories) v.categories = v.categories.map(cat => ({
        ...cat,
        name:  canonicalLabel(cat.name  || ''),
        items: (cat.items || []).map(it => ({ ...it, label: canonicalLabel(it.label || '') }))
      }));
      const result = migrateCategories(v);
      D = stripAutoItems(result.data || result);
      if (result.changed) db.ref(dKey(curY, curM)).set(stripAutoItems(JSON.parse(JSON.stringify(D))));
      _migrating = false;
      if (D.categories) D.categories.forEach(cat => cat.items.forEach(item => {
        if (item.months && !item.months.includes(curM)) item.value = 0;
      }));
    } else {
      loadFixed(); return;
    }
    renderAll();
    if (typeof syncDailyMonth === 'function') syncDailyMonth();
    if (curTab === 'x' && typeof renderAnalisis === 'function') renderAnalisis();
    setSS('ok');
  });
}

async function loadFixed() {
  let py = curY, pm = curM - 1;
  if (pm < 0) { pm = 11; py--; }
  try {
    const snap = await db.ref(dKey(py, pm)).once('value');
    const prev = snap.val();
    const nd = defD();
    if (prev) {
      if (prev.income) nd.income = prev.income.map(r => ({ ...r, value: r.fixed ? r.value : 0 }));
      if (prev.categories) nd.categories = prev.categories.map(c => ({
        ...c,
        items: planItems(c).map(r => {
          const ok = !r.months || r.months.includes(curM);
          return { ...r, label: canonicalLabel(r.label || ''), value: (r.fixed && ok) ? r.value : 0 };
        })
      }));
    }
    D = nd;
  } catch(e) { D = defD(); }
  renderAll();
  if (typeof syncDailyMonth === 'function') syncDailyMonth();
  setSS('ok');
}

// ── SAVE ──────────────────────────────────────────────────────────────────────

function save() {
  setSS('wait');
  clearTimeout(wTimer);
  wTimer = setTimeout(() => {
    const data = stripAutoItems(JSON.parse(JSON.stringify(D)));
    if (!navigator.onLine) {
      oqAdd({ type:'set', path:dKey(curY, curM), data });
      updateOfflineUI(); return;
    }
    db.ref(dKey(curY, curM)).set(data)
      .then(() => setSS('ok'))
      .catch(() => { oqAdd({ type:'set', path:dKey(curY, curM), data }); updateOfflineUI(); });
  }, 800);
}

function logH(type, desc, amt, cat) {
  db.ref(hKey()).push({ user: user || '?', type, description: desc, amount: amt || 0, category: cat || '', ts: new Date().toISOString() });
}

// ── NAVEGACIÓN MES ────────────────────────────────────────────────────────────

window.chM = function(d) {
  curM += d;
  if (curM > 11) { curM = 0; curY++; }
  if (curM < 0)  { curM = 11; curY--; }
  dailyTotals = {};
  subMonth();
};

// ── INGRESOS ──────────────────────────────────────────────────────────────────

window.addInc    = function() {
  const l = document.getElementById('niLbl').value.trim();
  if (!l) return;
  D.income.push({ label:l, value:0, fixed:false, by:user });
  document.getElementById('niLbl').value = '';
  renderAll(); save();
};
window.delInc    = function(i) { D.income.splice(i, 1); renderAll(); save(); };
window.updInc    = function(i, v) { D.income[i].value = parseFloat(v) || 0; D.income[i].by = user; recalc(); save(); };
window.togFxInc  = function(i) { D.income[i].fixed = !D.income[i].fixed; renderAll(); save(); toast(D.income[i].fixed ? '🔒 Fijo' : '🔓 Desmarcado'); };

// ── CATEGORÍAS Y GASTOS ───────────────────────────────────────────────────────

window.addCat  = function() {
  const l = document.getElementById('ncLbl').value.trim();
  if (!l) return;
  D.categories.push({ name:l, items:[{ label:l, value:0, budget:0, fixed:false }] });
  document.getElementById('ncLbl').value = '';
  renderAll(); save();
};
window.addItem = function(ci) {
  const l = document.getElementById('ni' + ci).value.trim();
  if (!l) return;
  D.categories[ci].items.push({ label:l, value:0, budget:0, fixed:false, by:user });
  document.getElementById('ni' + ci).value = '';
  renderAll(); save();
};
window.delItem = function(ci, ri) { D.categories[ci].items.splice(ri, 1); renderAll(); save(); };
window.delCat  = function(ci) { D.categories.splice(ci, 1); renderAll(); save(); };

window.updExp = function(ci, ri, v) {
  const item = D.categories[ci].items[ri];
  if (item.months && !item.months.includes(curM)) {
    toast('⚠️ Solo aplica en: ' + item.months.map(x => MSHORT[x]).join(', ')); return;
  }
  const val = parseFloat(v) || 0;
  item.value = val; item.by = user;
  recalc(); save();
  if (val > 0) logH('expense', 'Registró: ' + item.label, val, D.categories[ci].name);
};

window.togFx = function(ci, ri) {
  D.categories[ci].items[ri].fixed = !D.categories[ci].items[ri].fixed;
  renderAll(); save();
  toast(D.categories[ci].items[ri].fixed ? '🔒 Gasto fijo' : '🔓 Desmarcado');
};

window.applyFixedYear = async function() {
  if (!confirm('¿Copiar ítems fijos 🔒 a todos los meses de ' + curY + ' que aún no tienen datos?')) return;
  let applied = 0, skipped = 0;
  for (let m = 0; m < 12; m++) {
    if (m === curM) { skipped++; continue; }
    try {
      const snap = await db.ref(dKey(curY, m)).once('value');
      if (snap.val()) { skipped++; continue; }
      const nd = defD();
      nd.income     = D.income.map(r => ({ ...r, value: r.fixed ? r.value : 0 }));
      nd.categories = D.categories.map(cat => ({ ...cat, items: planItems(cat).map(item => {
        const ok = !item.months || item.months.includes(m);
        return { ...item, value: (item.fixed && ok) ? item.value : 0 };
      })}));
      await db.ref(dKey(curY, m)).set(nd); applied++;
    } catch(e) { console.error(e); }
  }
  toast('✅ Aplicado a ' + applied + ' meses · ' + skipped + ' omitidos');
};

window.cleanDuplicates = async function() {
  if (!D.categories) return;
  D.categories = D.categories.map(cat => ({ ...cat, name: canonicalLabel(cat.name || ''), items: normalizeCategoryItems(cat) }));
  renderAll(); save(); toast('🧹 Duplicados limpiados');
};

// ── RECALC — usa calcPresupuestoBase (DA-8) ───────────────────────────────────

function recalc() {
  if (!D.income) return;
  const tInc = D.income.reduce((s, r) => s + (r.value || 0), 0);
  const tExp = D.categories.reduce((s, c) => {
    return s + planItems(c).reduce((ss, r) => ss + (r.value || 0), 0) + (dailyTotals[c.name] || 0);
  }, 0);
  const tBud = D.categories.reduce((s, c) =>
    s + planItems(c).reduce((ss, r) => ss + calcPresupuestoBase(r, curM), 0), 0
  );
  const tFix = D.categories.reduce((s, c) =>
    s + planItems(c).filter(r => r.fixed).reduce((ss, r) => ss + (r.value || 0), 0), 0
  );
  const base  = tBud > 0 ? tBud : tInc;
  const avail = base - tExp;
  const pct   = base > 0 ? Math.round((tExp / base) * 100) : 0;

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  const cls = (id, c)   => { const el = document.getElementById(id); if (el) el.className = 'cv ' + c; };

  set('cInc',   fmt(tInc));
  set('cExp',   fmt(tExp));
  set('cBud',   tBud > 0 ? fmt(tBud) : 'Sin definir'); cls('cBud', tBud > 0 ? '' : 'cv gr');
  set('cAvail', fmt(avail)); cls('cAvail', avail >= 0 ? 'cv g' : 'cv r');
  set('cFix',   fmt(tFix));
  set('cPct',   pct + '%'); cls('cPct', pct > 100 ? 'cv r' : pct > 85 ? 'cv am' : 'cv g');
  set('incTot', fmt(tInc));

  const pf = document.getElementById('pFill');
  if (pf) { pf.style.width = Math.min(pct, 100) + '%'; pf.style.background = pct > 100 ? '#D85A30' : pct > 85 ? '#BA7517' : '#1D9E75'; }
  set('pPct', pct + '%');

  const ab = document.getElementById('alertBox');
  if (ab) {
    if (tFix > tInc && tInc > 0) {
      ab.classList.add('on');
      set('alertMsg', 'Tus gastos fijos (' + fmt(tFix) + ') superan los ingresos (' + fmt(tInc) + ') en ' + fmt(tFix - tInc) + '.');
    } else ab.classList.remove('on');
  }

  const chart = document.getElementById('barChart');
  if (!chart) return;
  const cats = D.categories.map(c => ({
    name: c.name,
    act:  planItems(c).reduce((s, r) => s + (r.value || 0), 0) + (dailyTotals[c.name] || 0),
    bud:  planItems(c).reduce((s, r) => s + calcPresupuestoBase(r, curM), 0)
  })).filter(c => c.act > 0 || c.bud > 0).sort((a, b) => b.act - a.act);

  if (!cats.length) { chart.innerHTML = '<div style="font-size:.85rem;color:#9b9b97;padding:.5rem 0;">Ingresa gastos para ver la distribución</div>'; return; }
  const mx = Math.max(...cats.map(c => Math.max(c.act, c.bud)));
  chart.innerHTML = cats.map((c, i) => {
    const wA = Math.round((c.act / mx) * 100);
    const wB = c.bud > 0 ? Math.round((c.bud / mx) * 100) : 0;
    const col = c.bud > 0 && c.act > c.bud ? '#D85A30' : COLORS[i % COLORS.length];
    return `<div class="br">
      <div class="bc">${c.name}</div>
      <div class="bt">
        <div class="bf" style="width:${wA}%;background:${col};"></div>
        ${wB > 0 ? `<div style="position:absolute;top:0;bottom:0;left:${wB}%;width:2px;background:rgba(0,0,0,.15);"></div>` : ''}
      </div>
      <div class="bv">${fmt(c.act)}</div>
    </div>`;
  }).join('');
}

// ── RENDER ALL ────────────────────────────────────────────────────────────────

function renderAll() {
  if (!D.income) return;
  if (D.categories) D.categories = D.categories.map(cat => ({ ...cat, items: normalizeCategoryItems(cat) }));
  renderMLabel();

  document.getElementById('incRows').innerHTML = D.income.map((r, i) => `
    <div class="row">
      <span class="rl">${r.label}</span>
      <span class="lock ${r.fixed ? 'on' : ''}" onclick="togFxInc(${i})">🔒</span>
      <input class="inp ${r.fixed ? 'fx' : ''}" type="text" inputmode="decimal" value="${r.value || ''}" placeholder="0" oninput="updInc(${i},this.value)"/>
      <button class="del" onclick="delInc(${i})">&#215;</button>
    </div>`).join('');

  document.getElementById('expSecs').innerHTML = D.categories.map((cat, ci) => {
    const items    = planItems(cat);
    const cHormiga = dailyTotals[cat.name] || 0;
    const cAct     = items.reduce((s, r) => s + (r.value || 0), 0) + cHormiga;
    const cBud     = items.reduce((s, r) => s + calcPresupuestoBase(r, curM), 0);
    const fc       = items.filter(r => r.fixed).length;
    const cpct     = cBud > 0 ? Math.round((cAct / cBud) * 100) : 0;
    const bcol     = cBud > 0 && cAct > cBud ? '#D85A30' : cpct > 85 ? '#BA7517' : '#1D9E75';
    return `<div class="sec">
      <div class="sec-hdr">
        <span class="sec-title">${cat.name}${fc > 0 ? `<span class="fbadge">${fc}🔒</span>` : ''}</span>
        <span style="display:flex;align-items:center;gap:.4rem;">
          ${cBud > 0 ? `<span style="font-size:.75rem;color:#9b9b97;font-family:'DM Mono',monospace;">/${fmt(cBud)}</span>` : ''}
          <span class="sec-val">${fmt(cAct)}</span>
          <button class="cdel" onclick="delCat(${ci})">✕</button>
        </span>
      </div>
      ${cBud > 0 ? `<div class="cp"><div class="cpm"><span>${cpct}% del presupuesto</span><span>${fmt(cBud - cAct)} disponible</span></div><div class="cpb"><div class="cpf" style="width:${Math.min(cpct, 100)}%;background:${bcol};"></div></div></div>` : ''}
      ${items.map((r, ri) => {
        const ms       = r.months ? r.months.map(x => MSHORT[x]).join('/') : null;
        const inactive = r.months && !r.months.includes(curM);
        const budItem  = calcPresupuestoBase(r, curM);
        return `<div class="row" style="${inactive ? 'opacity:.35;' : ''}">
          <span class="rl">${r.label}${ms ? `<span class="mbadge">${ms}</span>` : ''}${r.frecuencia && r.frecuencia !== 'mensual' ? `<span class="mbadge">${r.frecuencia}</span>` : ''}</span>
          <span class="lock ${r.fixed ? 'on' : ''}" onclick="togFx(${ci},${ri})">🔒</span>
          <span style="font-size:.7rem;color:#9b9b97;font-family:'DM Mono',monospace;min-width:52px;text-align:right;flex-shrink:0;">${budItem > 0 ? fmt(budItem) : ''}</span>
          <input class="inp ${r.fixed ? 'fx' : ''} ${budItem > 0 && (r.value || 0) > budItem ? 'ov' : ''}" type="text" inputmode="decimal" value="${r.value || ''}" placeholder="0" ${inactive ? 'disabled' : ''} oninput="updExp(${ci},${ri},this.value)"/>
          <button class="del" onclick="delItem(${ci},${ri})">&#215;</button>
        </div>`;
      }).join('')}
      ${cHormiga > 0 ? `<div class="row" style="opacity:.7;">
        <span class="rl">🐜 Gastos del día</span>
        <span class="lock"></span>
        <span style="font-size:.7rem;color:#9b9b97;font-family:'DM Mono',monospace;min-width:52px;text-align:right;flex-shrink:0;"></span>
        <span class="inp" style="background:#FEF9E7;line-height:1.8;text-align:right;">${fmt(cHormiga)}</span>
        <span style="width:26px;"></span>
      </div>` : ''}
      <div class="add-row">
        <input type="text" id="ni${ci}" placeholder="Nuevo ítem..."/>
        <button class="btn-add" onclick="addItem(${ci})">+ Ítem</button>
      </div>
    </div>`;
  }).join('');

  if (curTab === 'd' && typeof populateCatSel === 'function') populateCatSel();
  recalc();
}
