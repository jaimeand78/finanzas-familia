// js/finanzas.js
// Responsabilidad: presupuesto mensual — subMonth, save, recalc, renderResumen, defD.
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
        { label:'Salario',             value:0, budget:0, fixed:true             },
        { label:'Prestaciones',        value:0, budget:0, fixed:true             },
        { label:'Intereses Cesantías', value:0, budget:0, fixed:true, months:[0] },
        { label:'Cesantías',           value:0, budget:0, fixed:true, months:[1] },
        { label:'Prima Junio',         value:0, budget:0, fixed:true, months:[5] },
        { label:'Prima Diciembre',     value:0, budget:0, fixed:true, months:[11]}
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
  // months tiene prioridad — si existe, es un ítem de fecha fija independiente de frecuencia
  if (item.months && item.months.length) {
    return item.months.includes(mesActual) ? b : 0;
  }
  const frec = item.frecuencia || 'mensual';
  if (frec === 'mensual') return b;
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

// ── NAVEGACIÓN MES ────────────────────────────────────────────────────────────

window.chM = function(d) {
  curM += d;
  if (curM > 11) { curM = 0; curY++; }
  if (curM < 0)  { curM = 11; curY--; }
  dailyTotals = {};
  subMonth();
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

  if (curTab === 'm') renderResumen();
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
  const conProblema  = [...rojos, ...amarillos];

  const el = document.getElementById('resumenCats');
  if (el) el.innerHTML = conProblema.map(c => tarjeta(c)).join('');

  // ── BARRA DE PROGRESO ─────────────────────────────────────────────────────────
  const progEl = document.getElementById('rProgreso');
  if (progEl && base > 0) {
    const pctProg  = Math.min(Math.round((tExp / base) * 100), 100);
    const barColor = pctProg > 100 ? '#D85A30' : pctProg > 85 ? '#BA7517' : '#1D9E75';
    progEl.innerHTML = `
      <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--color-muted);margin-bottom:5px;">
        <span>Gastado ${fmt(tExp)}</span>
        <span>de ${fmt(base)}</span>
      </div>
      <div style="height:7px;background:var(--color-border);border-radius:99px;overflow:hidden;">
        <div style="width:${pctProg}%;height:100%;background:${barColor};border-radius:99px;"></div>
      </div>`;
  } else if (progEl) {
    progEl.innerHTML = '';
  }

  // ── TODO BIEN ─────────────────────────────────────────────────────────────────
  const todoBienEl = document.getElementById('rTodoBien');
  if (todoBienEl) {
    if (conProblema.length === 0 && catsData.length > 0) {
      todoBienEl.style.display = 'flex';
      todoBienEl.innerHTML = `
        <div style="display:flex;align-items:center;gap:8px;padding:10px 14px;border-radius:10px;background:var(--color-surface);border:0.5px solid var(--color-border);">
          <span style="font-size:16px;">✅</span>
          <span style="font-size:13px;color:var(--color-muted);">El resto de categorías van bien</span>
        </div>`;
    } else {
      todoBienEl.style.display = 'none';
    }
  }

  // ── CABECERA ──────────────────────────────────────────────────────────────────
  const dEl = document.getElementById('rDisp');
  if (dEl) { dEl.textContent = fmt(avail); dEl.style.color = dispColor; }
}

// Toggle expand/colapsar tarjeta de categoría en Resumen
window.toggleResCat = function(el) {
  const detail  = el.querySelector('.res-detail');
  const chevron = el.querySelector('span[style*="opacity"]');
  const open    = detail.style.display !== 'none';
  detail.style.display = open ? 'none' : 'block';
  if (chevron) chevron.textContent = open ? '▼' : '▲';
};

// ── FIN finanzas.js ───────────────────────────────────────────────────────────
