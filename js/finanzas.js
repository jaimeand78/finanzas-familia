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
  if (fu) {
    const mbr = window.HOGAR && window.HOGAR.miembros && window.HOGAR.miembros[fu.uid];
    user = mbr ? mbr.nombre : (fu.displayName || fu.email || '').split(' ')[0].split('@')[0];
  }
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
        { label:'Arriendo / Hipoteca', value:0, budget:0, fixed:true  },
        { label:'Administración',      value:0, budget:0, fixed:true  },
        { label:'Agua y Energía',      value:0, budget:0, fixed:true  },
        { label:'Gas',                 value:0, budget:0, fixed:true  },
        { label:'Internet',            value:0, budget:0, fixed:true  },
        { label:'Telefonía',           value:0, budget:0, fixed:false },
        { label:'Mantenimiento Hogar', value:0, budget:0, fixed:false }
      ]},
      { name:'Alimentación', items:[
        { label:'Frutas y Verduras', value:0, budget:0, fixed:false },
        { label:'Aseo y Víveres',    value:0, budget:0, fixed:false },
        { label:'Loncheras',         value:0, budget:0, fixed:false }
      ]},
      { name:'Transporte', items:[
        { label:'Combustible',            value:0, budget:0, fixed:false },
        { label:'Transporte Público',     value:0, budget:0, fixed:false },
        { label:'Peajes',                 value:0, budget:0, fixed:false },
        { label:'Parqueaderos',           value:0, budget:0, fixed:false },
        { label:'Mantenimiento Vehículo', value:0, budget:0, fixed:false },
        { label:'Cuota Crédito / Leasing',value:0, budget:0, fixed:true  }
      ]},
      { name:'Entretenimiento y Salidas', items:[
        { label:'Streaming',    value:0, budget:0, fixed:true  },
        { label:'Restaurantes', value:0, budget:0, fixed:false },
        { label:'Cine',         value:0, budget:0, fixed:false },
        { label:'Salidas',      value:0, budget:0, fixed:false },
        { label:'Viajes',       value:0, budget:0, fixed:false },
        { label:'Vacaciones',   value:0, budget:0, fixed:false }
      ]},
      { name:'Vestuario', items:[
        { label:'Ropa',      value:0, budget:0, fixed:false },
        { label:'Zapatos',   value:0, budget:0, fixed:false },
        { label:'Uniformes', value:0, budget:0, fixed:false }
      ]},
      { name:'Salud y Belleza', items:[
        { label:'Medicina Prepagada',   value:0, budget:0, fixed:true  },
        { label:'Gimnasio',             value:0, budget:0, fixed:true  },
        { label:'Droguería',            value:0, budget:0, fixed:false },
        { label:'Cita Médica',          value:0, budget:0, fixed:false },
        { label:'Cita Pediátrica',      value:0, budget:0, fixed:false },
        { label:'Peluquería',           value:0, budget:0, fixed:false },
        { label:'Servicios Estéticos',  value:0, budget:0, fixed:false }
      ]},
      { name:'Educación', items:[
        { label:'Universidad',                value:0, budget:0, fixed:true  },
        { label:'Colegio',                    value:0, budget:0, fixed:true  },
        { label:'Jardín',                     value:0, budget:0, fixed:true  },
        { label:'Matrícula',                  value:0, budget:0, fixed:false },
        { label:'Actividades Extracurriculares', value:0, budget:0, fixed:false }
      ]},
      { name:'Seguros e Impuestos', items:[
        { label:'Seguro de Vida',     value:0, budget:0, fixed:true  },
        { label:'Seguro de Hogar',    value:0, budget:0, fixed:true  },
        { label:'Seguro Vehículo',    value:0, budget:0, fixed:true  },
        { label:'SOAT',               value:0, budget:0, fixed:true, months:[8] },
        { label:'Impuestos Vehículo', value:0, budget:0, fixed:true, months:[4] },
        { label:'Impuesto Predial',   value:0, budget:0, fixed:true, months:[3] }
      ]},
      { name:'Regalos y Celebraciones', items:[
        { label:'Regalos',       value:0, budget:0, fixed:false },
        { label:'Celebraciones', value:0, budget:0, fixed:false }
      ]},
      { name:'Ahorro', items:[
        { label:'Ahorro Programado', value:0, budget:0, fixed:true  },
        { label:'Fondo Emergencia',  value:0, budget:0, fixed:false }
      ]},
      { name:'Servicio Doméstico', items:[
        { label:'Salario',      value:0, budget:0, fixed:true  },
        { label:'Prestaciones', value:0, budget:0, fixed:false },
        { label:'Otros',        value:0, budget:0, fixed:false }
      ]}
    ]
  };
}


// ── FLAGS DE PERFIL — DA-C3 ───────────────────────────────────────────────────
// Lee los flags del perfil del hogar para filtrar categorías e ítems.
// Default true para todos — hogar sin perfil completo ve todo.

function getPerfilFlags() {
  const p = (window.HOGAR && window.HOGAR.perfil) || {};
  return {
    tieneVehiculo:  p.tieneVehiculo  !== false,
    tieneEmpleada:  p.tieneEmpleada  !== false,
    tieneEducacion: p.tieneEducacion !== false,
    tieneSeguros:   p.tieneSeguros   !== false
  };
}

// Filtra ítems de una categoría según los flags del perfil
function filtrarItemsPorPerfil(catName, items) {
  const f = getPerfilFlags();
  return items.filter(item => {
    const l = item.label || '';
    // Ítems de vehículo — solo si tieneVehiculo
    if (!f.tieneVehiculo && (
      l.includes('Combustible') || l.includes('SOAT') ||
      l.includes('Vehículo') || l.includes('vehículo') ||
      l.includes('Leasing') || l.includes('leasing')
    )) return false;
    return true;
  });
}

// Filtra las categorías completas según los flags del perfil
function filtrarCategoriasPorPerfil(categories) {
  const f = getPerfilFlags();
  return categories.filter(c => {
    const n = c.name || '';
    if (!f.tieneEmpleada  && n.includes('Servicio Doméstico')) return false;
    if (!f.tieneEducacion && n.includes('Educación'))          return false;
    if (!f.tieneSeguros   && n.includes('Seguros'))            return false;
    return true;
  }).map(c => ({
    ...c,
    items: filtrarItemsPorPerfil(c.name, c.items || [])
  }));
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
  // Aplicar filtro de perfil — oculta categorías/ítems según flags del hogar
  window._catsFiltradas = filtrarCategoriasPorPerfil(D.categories || []);
  renderMLabel();
  recalc();
  if (curTab === 'd' && typeof populateCatSel === 'function') populateCatSel();
  if (curTab === 'm' && typeof renderResumen   === 'function') renderResumen();
  if (curTab === 'c' && typeof renderExpSecs   === 'function') renderExpSecs();
}

// ── RENDER RESUMEN — tab 📊 ───────────────────────────────────────────────────
// Solo lectura. Ahorro fijo arriba. Semáforo por categoría. Quién pagó abajo.

function renderResumen() {
  if (!D.income) return;

  const cats = window._catsFiltradas || D.categories || [];

  const tInc = D.income.reduce((s, r) => s + (r.value || 0), 0);
  const tExp = cats.reduce((s, c) => {
    return s + planItems(c).reduce((ss, r) => ss + (r.value || 0), 0) + (dailyTotals[c.name] || 0);
  }, 0);
  const tBud = cats.reduce((s, c) => s + planItems(c).reduce((ss, r) => ss + (r.budget || 0), 0), 0);
  const base  = tBud > 0 ? tBud : tInc;
  const avail = base - tExp;

  const estado    = avail >= 0 ? 'Van bien 🟢' : 'Ojo con el gasto 🔴';
  const dispColor = avail >= 0 ? '#0F6E56' : '#993C1D';

  // Categorías con datos — usando cats filtradas
  const catsData = cats.map(c => {
    const items = planItems(c);
    const act   = items.reduce((s, r) => s + (r.value || 0), 0) + (dailyTotals[c.name] || 0);
    const bud   = items.reduce((s, r) => s + (r.budget || 0), 0);
    const pct   = bud > 0 ? Math.round((act / bud) * 100) : -1;
    return { name: c.name, act, bud, pct };
  }).filter(c => c.act > 0 || c.bud > 0);

  // Icono de categoría
  const icon = name => {
    const clean = name.replace(/^\S+\s/, '');
    return ICONS[clean] || ICONS[name] || '💸';
  };

  const displayName = name => name.replace(/^[\u{1F000}-\u{1FFFF}\u{2600}-\u{27FF}\uFE0F\u20E3\u200D🏠🍽️🚗🎬👕❤️📚🛡️🎁💰🏡💸]+\s*/u, '').trim() || name;

  // ── BLOQUE AHORRO FIJO ────────────────────────────────────────────────────────
  const ahorroData = catsData.find(c => c.name.includes('Ahorro'));
  const ahorroEl   = document.getElementById('rAhorro');
  if (ahorroEl) {
    if (ahorroData && ahorroData.bud > 0) {
      const cumplido = ahorroData.act >= ahorroData.bud;
      const pctBar   = Math.min(Math.round((ahorroData.act / ahorroData.bud) * 100), 100);
      const badge    = cumplido
        ? `<span style="font-size:11px;background:#1D9E75;color:#E1F5EE;padding:2px 8px;border-radius:20px;">✓ cumplido</span>`
        : `<span style="font-size:11px;background:#F0997B;color:#4A1B0C;padding:2px 8px;border-radius:20px;">faltan ${fmt(ahorroData.bud - ahorroData.act)}</span>`;
      ahorroEl.style.display = 'block';
      ahorroEl.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;padding:12px 14px;">
          <span style="font-size:18px;">🐷</span>
          <span style="font-size:14px;font-weight:600;color:#085041;flex:1;">Ahorro del mes</span>
          ${badge}
          <div style="text-align:right;margin-left:4px;">
            <div style="font-size:14px;font-weight:600;color:#0F6E56;">${fmt(ahorroData.act)}</div>
            <div style="font-size:11px;color:#085041;">de ${fmt(ahorroData.bud)}</div>
          </div>
        </div>
        <div style="height:4px;background:#9FE1CB;margin:0 14px 12px;border-radius:99px;overflow:hidden;">
          <div style="width:${pctBar}%;height:100%;background:#1D9E75;border-radius:99px;"></div>
        </div>`;
    } else {
      ahorroEl.style.display = 'none';
    }
  }

  // ── SEMÁFORO CATEGORÍAS (sin Ahorro) ─────────────────────────────────────────
  const tarjeta = (c) => {
    const rojo     = c.pct > 100;
    const amarillo = c.pct > 85 && c.pct <= 100;
    const verde    = c.pct >= 0 && c.pct <= 85;

    let bg, textColor, barColor, barBg, badge, detailText;

    if (rojo) {
      bg = '#FAECE7'; textColor = '#993C1D'; barColor = '#D85A30'; barBg = '#F0997B';
      badge = fmt(c.act - c.bud) + ' de más';
      detailText = `<p style="font-size:12px;color:${textColor};margin:0;">Gastado ${fmt(c.act)} de ${fmt(c.bud)}</p>`;
    } else if (amarillo) {
      bg = '#FAEEDA'; textColor = '#854F0B'; barColor = '#BA7517'; barBg = '#FAC775';
      badge = 'quedan ' + fmt(c.bud - c.act);
      detailText = `<p style="font-size:12px;color:${textColor};margin:0;">Gastado ${fmt(c.act)} de ${fmt(c.bud)}</p>`;
    } else if (verde && c.bud > 0) {
      bg = 'var(--color-surface)'; textColor = 'var(--color-text)'; barColor = '#1D9E75'; barBg = 'var(--color-border)';
      badge = '';
      detailText = `<p style="font-size:12px;color:var(--color-muted);margin:0;">Gastado ${fmt(c.act)} de ${fmt(c.bud)} · quedan ${fmt(c.bud - c.act)}</p>`;
    } else {
      bg = 'var(--color-surface)'; textColor = 'var(--color-text)'; barColor = '#1D9E75'; barBg = 'var(--color-border)';
      badge = '';
      detailText = `<p style="font-size:12px;color:var(--color-muted);margin:0;">Gastado ${fmt(c.act)}</p>`;
    }

    const pctBar  = c.bud > 0 ? Math.min(c.pct, 100) : 0;
    const abierto = rojo || amarillo;
    const chevron = abierto ? '▲' : '▼';
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
          <span style="font-size:14px;font-weight:600;color:${textColor};">${displayName(c.name)}</span>
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

  const catsNoAhorro = catsData.filter(c => !c.name.includes('Ahorro'));
  const rojos        = catsNoAhorro.filter(c => c.pct > 100);
  const amarillos    = catsNoAhorro.filter(c => c.pct > 85 && c.pct <= 100);
  const verdes       = catsNoAhorro.filter(c => c.pct >= 0 && c.pct <= 85);
  const sinBud       = catsNoAhorro.filter(c => c.pct === -1);
  const ordenadas    = [...rojos, ...amarillos, ...verdes, ...sinBud];

  const el = document.getElementById('resumenCats');
  if (el) el.innerHTML = ordenadas.map(c => tarjeta(c)).join('');

  // ── QUIÉN HA PAGADO ───────────────────────────────────────────────────────────
  renderQuienPago();

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

// ── QUIÉN HA PAGADO — carga desde daily/ del mes actual ──────────────────────

async function renderQuienPago() {
  const el = document.getElementById('rQuienPago');
  if (!el) return;

  try {
    const mm   = String(curM + 1).padStart(2, '0');
    const snap = await db.ref(`hogares/${window.HOGAR.codigoHogar}/daily/${curY}/${mm}`).once('value');

    // Acumular por miembro
    const totales = {};
    snap.forEach(daySnap => daySnap.forEach(itemSnap => {
      const v = itemSnap.val();
      if (!v.who || !v.amount) return;
      totales[v.who] = (totales[v.who] || 0) + v.amount;
    }));

    const miembros = Object.entries(totales).sort((a, b) => b[1] - a[1]);
    const total    = miembros.reduce((s, [, v]) => s + v, 0);

    if (!miembros.length || !total) {
      el.style.display = 'none';
      return;
    }

    // Colores por posición
    const colores = [
      { bg: '#E6F1FB', text: '#185FA5', bar: '#378ADD' },
      { bg: '#FBEAF0', text: '#993556', bar: '#D4537E' },
      { bg: '#E1F5EE', text: '#085041', bar: '#1D9E75' },
      { bg: '#FAEEDA', text: '#854F0B', bar: '#BA7517' }
    ];

    const filas = miembros.map(([nombre, monto], i) => {
      const pct = Math.round((monto / total) * 100);
      const col = colores[i % colores.length];
      const ini = nombre.substring(0, 2).toUpperCase();
      return `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
        <div style="width:32px;height:32px;border-radius:50%;background:${col.bg};display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:500;color:${col.text};flex-shrink:0;">${ini}</div>
        <div style="flex:1;">
          <div style="font-size:13px;font-weight:500;color:var(--color-text);margin-bottom:4px;">${nombre}</div>
          <div style="height:6px;background:var(--color-border);border-radius:3px;overflow:hidden;">
            <div style="width:${pct}%;height:100%;background:${col.bar};border-radius:3px;"></div>
          </div>
        </div>
        <div style="text-align:right;min-width:72px;">
          <div style="font-size:14px;font-weight:500;color:var(--color-text);">${fmt(monto)}</div>
          <div style="font-size:11px;color:var(--color-muted);">${pct}%</div>
        </div>
      </div>`;
    }).join('');

    el.style.display = 'block';
    el.innerHTML = `
      <p style="font-size:12px;font-weight:500;color:var(--color-muted);text-transform:uppercase;letter-spacing:.06em;margin:0 0 .75rem;">¿Quién ha pagado?</p>
      ${filas}
      <div style="display:flex;justify-content:space-between;padding-top:.5rem;border-top:0.5px solid var(--color-border);margin-top:.25rem;">
        <span style="font-size:12px;color:var(--color-muted);">Total registrado</span>
        <span style="font-size:13px;font-weight:500;color:var(--color-text);">${fmt(total)}</span>
      </div>`;
  } catch(e) {
    console.error('renderQuienPago:', e);
    el.style.display = 'none';
  }
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
