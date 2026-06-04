// js/finanzas.js
// Responsabilidad: presupuesto mensual — subMonth, save, recalc, renderResumen, renderExpSecs.
// Depende de: config.js (db), utils.js, offline.js, firebase-paths.js, ui.js

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

// ── DEFAULT DATA ──────────────────────────────────────────────────────────────

function defD() {
  return {
    income: [
      { label:'Salario',       value:0, fixed:true  },
      { label:'Otros ingresos',value:0, fixed:false }
    ],
    categories: [
      { name:'Vivienda', items:[
        { label:'Hipoteca / Arriendo', value:0, budget:0, fixed:true  },
        { label:'Agua y Energía',      value:0, budget:0, fixed:true  },
        { label:'Gas',                 value:0, budget:0, fixed:true  },
        { label:'Internet',            value:0, budget:0, fixed:true  },
        { label:'Administración',      value:0, budget:0, fixed:true  }
      ]},
      { name:'Alimentación', items:[
        { label:'Mercado',      value:0, budget:0, fixed:false },
        { label:'Restaurantes', value:0, budget:0, fixed:false }
      ]},
      { name:'Transporte', items:[
        { label:'Gasolina',           value:0, budget:0, fixed:false },
        { label:'Transporte público', value:0, budget:0, fixed:false }
      ]},
      { name:'Salud y Belleza', items:[
        { label:'Droguería',    value:0, budget:0, fixed:false },
        { label:'Citas médicas',value:0, budget:0, fixed:false }
      ]},
      { name:'Entretenimiento', items:[
        { label:'Streaming', value:0, budget:0, fixed:true  },
        { label:'Salidas',   value:0, budget:0, fixed:false }
      ]},
      { name:'Seguros e Impuestos', items:[
        { label:'Seguro de vida / hogar', value:0, budget:0, fixed:true },
        { label:'Seguro vehículo',        value:0, budget:0, fixed:true },
        { label:'Impuesto predial',       value:0, budget:0, fixed:true, months:[3] },
        { label:'Impuestos vehículo',     value:0, budget:0, fixed:true, months:[4] },
        { label:'SOAT vehículo',          value:0, budget:0, fixed:true, months:[8] }
      ]},
      { name:'Ahorro', items:[
        { label:'Ahorro mensual', value:0, budget:0, fixed:true }
      ]}
    ]
  };
}


// ── INGRESOS DINÁMICOS — DA-11 ────────────────────────────────────────────────

function buildIncomeFromPerfil(perfil) {
  const miembros = Object.values((perfil && perfil.miembros) || {})
    .filter(m => m.rol === 'adulto' && m.nombre);
  const income = miembros.map(m => ({ label: 'Ingreso ' + m.nombre, value: 0, fixed: true }));
  if (!income.length) income.push({ label: 'Ingreso principal', value: 0, fixed: true });
  income.push({ label: 'Otros ingresos', value: 0, fixed: false });
  return income;
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

window.addInc   = function() {
  const l = document.getElementById('niLbl').value.trim();
  if (!l) return;
  D.income.push({ label:l, value:0, fixed:false, by:user });
  document.getElementById('niLbl').value = '';
  renderAll(); save();
};
window.delInc   = function(i) { D.income.splice(i, 1); renderAll(); save(); };
window.updInc   = function(i, v) { D.income[i].value = parseFloat(v) || 0; D.income[i].by = user; recalc(); save(); };
window.togFxInc = function(i) { D.income[i].fixed = !D.income[i].fixed; renderAll(); save(); toast(D.income[i].fixed ? '🔒 Fijo' : '🔓 Desmarcado'); };

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

// ── RECALC ────────────────────────────────────────────────────────────────────

function recalc() {
  if (!D.income) return;
  const tInc = D.income.reduce((s, r) => s + (r.value || 0), 0);
  const tExp = D.categories.reduce((s, c) => {
    return s + planItems(c).reduce((ss, r) => ss + (r.value || 0), 0) + (dailyTotals[c.name] || 0);
  }, 0);
  const tBud = D.categories.reduce((s, c) => s + planItems(c).reduce((ss, r) => ss + (r.budget || 0), 0), 0);
  const tFix = D.categories.reduce((s, c) => s + planItems(c).filter(r => r.fixed).reduce((ss, r) => ss + (r.value || 0), 0), 0);
  const base  = tBud > 0 ? tBud : tInc;
  const avail = base - tExp;
  const pct   = base > 0 ? Math.round((tExp / base) * 100) : 0;

  // Actualizar cards del tab Resumen
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  const cls = (id, c)   => { const el = document.getElementById(id); if (el) el.className = c; };

  set('rDisp',  fmt(avail));
  cls('rDisp',  'r-disp-val ' + (avail >= 0 ? 'g' : 'r'));
  set('rEstado', avail >= 0 ? 'Van bien 🟢' : 'Ojo con el gasto 🔴');

  set('rInc',  fmt(tInc));
  set('rExp',  fmt(tExp));

  if (curTab === 'm') renderResumen();
  if (curTab === 'c') renderExpSecs();
}

// ── RENDER ALL ────────────────────────────────────────────────────────────────
// Llamado por subMonth. Renderiza según tab activo.

function renderAll() {
  if (!D.income) return;
  if (D.categories) D.categories = D.categories.map(cat => ({ ...cat, items: normalizeCategoryItems(cat) }));
  renderMLabel();
  recalc();
  if (curTab === 'd' && typeof populateCatSel === 'function') populateCatSel();
  if (curTab === 'm' && typeof renderResumen   === 'function') renderResumen();
  if (curTab === 'c' && typeof renderExpSecs   === 'function') renderExpSecs();
}

// ── RENDER RESUMEN — tab 📊 ───────────────────────────────────────────────────
// Solo lectura. Semáforo por categoría. Ahorro siempre expandido.

function renderResumen() {
  if (!D.income) return;

  const tInc = D.income.reduce((s, r) => s + (r.value || 0), 0);
  const tExp = D.categories.reduce((s, c) => {
    return s + planItems(c).reduce((ss, r) => ss + (r.value || 0), 0) + (dailyTotals[c.name] || 0);
  }, 0);
  const tBud = D.categories.reduce((s, c) => s + planItems(c).reduce((ss, r) => ss + (r.budget || 0), 0), 0);
  const base  = tBud > 0 ? tBud : tInc;
  const avail = base - tExp;

  // Cabecera
  const estado = avail >= 0 ? 'Van bien 🟢' : 'Ojo con el gasto 🔴';
  const dispColor = avail >= 0 ? '#0F6E56' : '#993C1D';

  // Categorías con datos
  const cats = D.categories.map(c => {
    const items = planItems(c);
    const act   = items.reduce((s, r) => s + (r.value || 0), 0) + (dailyTotals[c.name] || 0);
    const bud   = items.reduce((s, r) => s + (r.budget || 0), 0);
    const pct   = bud > 0 ? Math.round((act / bud) * 100) : -1;
    return { name: c.name, act, bud, pct };
  }).filter(c => c.act > 0 || c.bud > 0);

  // Icono de categoría — extrae nombre sin emoji
  const icon = name => {
    const clean = name.replace(/^\S+\s/, '');
    return ICONS[clean] || ICONS[name] || '💸';
  };

  // Render de una tarjeta de categoría
  const tarjeta = (c, expandida) => {
    const esAhorro  = c.name.includes('Ahorro');
    const rojo      = c.pct > 100;
    const amarillo  = c.pct > 85 && c.pct <= 100;
    const verde     = c.pct >= 0 && c.pct <= 85;

    let bg, textColor, barColor, barBg, badge, detailText;

    if (rojo) {
      bg = '#FAECE7'; textColor = '#993C1D'; barColor = '#D85A30'; barBg = '#F0997B';
      badge = fmt(c.act - c.bud) + ' de más';
      detailText = `<p style="font-size:12px;color:${textColor};margin:0;">Gastado ${fmt(c.act)} de ${fmt(c.bud)}</p>`;
    } else if (amarillo) {
      bg = '#FAEEDA'; textColor = '#854F0B'; barColor = '#BA7517'; barBg = '#FAC775';
      badge = 'quedan ' + fmt(c.bud - c.act);
      detailText = `<p style="font-size:12px;color:${textColor};margin:0;">Gastado ${fmt(c.act)} de ${fmt(c.bud)}</p>`;
    } else if (esAhorro && c.bud > 0 && c.act >= c.bud) {
      bg = '#E1F5EE'; textColor = '#085041'; barColor = '#1D9E75'; barBg = '#9FE1CB';
      badge = '✓ cumplido';
      detailText = `<p style="font-size:12px;color:${textColor};margin:0;">Guardado ${fmt(c.act)} de ${fmt(c.bud)}</p>`;
    } else if (verde && c.bud > 0) {
      bg = 'var(--color-bg)'; textColor = 'var(--color-text)'; barColor = '#1D9E75'; barBg = 'var(--color-border)';
      badge = '';
      detailText = `<p style="font-size:12px;color:var(--color-muted);margin:0;">Gastado ${fmt(c.act)} de ${fmt(c.bud)} · quedan ${fmt(c.bud - c.act)}</p>`;
    } else {
      // Sin presupuesto definido
      bg = 'var(--color-bg)'; textColor = 'var(--color-text)'; barColor = '#1D9E75'; barBg = 'var(--color-border)';
      badge = '';
      detailText = `<p style="font-size:12px;color:var(--color-muted);margin:0;">Gastado ${fmt(c.act)}</p>`;
    }

    const pctBar  = c.bud > 0 ? Math.min(c.pct, 100) : 0;
    const abierto = expandida || rojo || amarillo || (esAhorro && c.bud > 0 && c.act >= c.bud);
    const chevron = abierto ? '▲' : '▼';

    // Mini barra para colapsado
    const miniBar = !abierto ? `
      <div style="width:60px;height:4px;background:${barBg};border-radius:99px;overflow:hidden;">
        <div style="width:${pctBar}%;height:100%;background:${barColor};border-radius:99px;"></div>
      </div>` : '';

    return `
    <div class="res-cat" style="background:${bg};border-radius:12px;padding:12px 14px;cursor:pointer;"
      onclick="toggleResCat(this)">
      <div style="display:flex;align-items:center;justify-content:space-between;">
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-size:18px;">${icon(c.name)}</span>
          <span style="font-size:14px;font-weight:600;color:${textColor};">${c.name.replace(/^\S+\s/, '')}</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          ${badge ? `<span style="font-size:12px;color:${textColor};font-weight:600;">${badge}</span>` : miniBar}
          <span style="font-size:11px;color:${textColor};opacity:.6;">${chevron}</span>
        </div>
      </div>
      <div class="res-detail" style="display:${abierto ? 'block' : 'none'};margin-top:8px;">
        ${c.bud > 0 ? `
        <div style="height:4px;background:${barBg};border-radius:99px;margin-bottom:6px;overflow:hidden;">
          <div style="width:${pctBar}%;height:100%;background:${barColor};border-radius:99px;"></div>
        </div>` : ''}
        ${detailText}
      </div>
    </div>`;
  };

  const el = document.getElementById('resumenCats');
  if (el) el.innerHTML = cats.map(c => tarjeta(c, false)).join('');

  // Actualizar cabecera
  const dEl = document.getElementById('rDisp');
  if (dEl) { dEl.textContent = fmt(avail); dEl.style.color = dispColor; }
  const eEl = document.getElementById('rEstado');
  if (eEl) eEl.textContent = estado;
  const iEl = document.getElementById('rInc');
  if (iEl) iEl.textContent = fmt(tInc);
  const xEl = document.getElementById('rExp');
  if (xEl) xEl.textContent = fmt(tExp);
}

// Toggle expand/colapsar tarjeta de categoría en Resumen
window.toggleResCat = function(el) {
  const detail  = el.querySelector('.res-detail');
  const chevron = el.querySelector('span[style*="opacity"]');
  const open    = detail.style.display !== 'none';
  detail.style.display = open ? 'none' : 'block';
  if (chevron) chevron.textContent = open ? '▼' : '▲';
};

// ── RENDER EXP SECS — edición en tab Config ───────────────────────────────────

function renderExpSecs() {
  const incEl = document.getElementById('incRows');
  if (incEl) incEl.innerHTML = D.income.map((r, i) => `
    <div class="row">
      <span class="rl">${r.label}</span>
      <span class="lock ${r.fixed ? 'on' : ''}" onclick="togFxInc(${i})">🔒</span>
      <input class="inp ${r.fixed ? 'fx' : ''}" type="text" inputmode="decimal" value="${r.value || ''}" placeholder="0" oninput="updInc(${i},this.value)"/>
      <button class="del" onclick="delInc(${i})">&#215;</button>
    </div>`).join('');

  const expEl = document.getElementById('expSecs');
  if (expEl) expEl.innerHTML = D.categories.map((cat, ci) => {
    const items    = planItems(cat);
    const cHormiga = dailyTotals[cat.name] || 0;
    const cAct     = items.reduce((s, r) => s + (r.value || 0), 0) + cHormiga;
    const cBud     = items.reduce((s, r) => s + (r.budget || 0), 0);
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
        return `<div class="row" style="${inactive ? 'opacity:.35;' : ''}">
          <span class="rl">${r.label}${ms ? `<span class="mbadge">${ms}</span>` : ''}</span>
          <span class="lock ${r.fixed ? 'on' : ''}" onclick="togFx(${ci},${ri})">🔒</span>
          <span style="font-size:.7rem;color:#9b9b97;font-family:'DM Mono',monospace;min-width:52px;text-align:right;flex-shrink:0;">${r.budget > 0 ? fmt(r.budget) : ''}</span>
          <input class="inp ${r.fixed ? 'fx' : ''} ${r.budget > 0 && (r.value || 0) > r.budget ? 'ov' : ''}" type="text" inputmode="decimal" value="${r.value || ''}" placeholder="0" ${inactive ? 'disabled' : ''} oninput="updExp(${ci},${ri},this.value)"/>
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
}
