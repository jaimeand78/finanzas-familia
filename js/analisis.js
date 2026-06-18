// js/analisis.js
// Responsabilidad: tab Análisis — Semáforo, Tendencia, Hormiga, ¿Quién pagó?
// Depende de: utils.js, firebase-paths.js, finanzas.js (D, curY, curM, dailyTotals)

// Mes propio del tab Análisis — independiente del tab Resumen
let curYx = new Date().getFullYear();
let curMx = new Date().getMonth();

function updateXLabel() {
  const el = document.getElementById('xLbl');
  if (el) el.textContent = MONTHS[curMx] + ' ' + curYx;
}

window.chMx = function(d) {
  curMx += d;
  if (curMx > 11) { curMx = 0; curYx++; }
  if (curMx < 0)  { curMx = 11; curYx--; }
  renderAnalisis();
};

async function renderAnalisis() {
  updateXLabel();
  renderSemaforo();
  await renderTendencia();
  await renderHormiga();
  if (!document.querySelector('.an-tab.on')) goAn('sem');
}

// ── SEMÁFORO ──────────────────────────────────────────────────────────────────

function renderSemaforo() {
  const sem = document.getElementById('an-sem');
  if (!sem) return;

  // Si el mes del análisis es el mismo que el resumen, usar D en memoria
  // Si es diferente, cargar de Firebase
  const mismomes = (curYx === curY && curMx === curM);

  if (mismomes) {
    _renderSemaforoConData(sem, D, dailyTotals, curM);
  } else {
    const mm = String(curMx + 1).padStart(2, '0');
    Promise.all([
      db.ref(dKey(curYx, curMx)).once('value'),
      db.ref(`hogares/${window.HOGAR.codigoHogar}/daily/${curYx}/${mm}`).once('value')
    ]).then(([snapMes, snapDaily]) => {
      // Si el mes no tiene datos en Firebase, usar D como fuente de budgets con valores en 0
      const raw = snapMes.val();
      const d = raw || {
        income: (D && D.income) ? D.income.map(r => ({ ...r, value: 0 })) : [],
        categories: (D && D.categories) ? D.categories.map(c => ({
          ...c, items: (c.items || []).map(r => ({ ...r, value: 0 }))
        })) : []
      };
      // Acumular gastos daily por categoría (sin emoji, igual que syncDailyMonth)
      const totals = {};
      snapDaily.forEach(daySnap => {
        daySnap.forEach(item => {
          const v = item.val();
          if (!v.amount) return;
          const rawCat = (v.category || '').replace(/^\S+\s/, '');
          const cat = CAT_RENAMES[rawCat] || rawCat;
          totals[cat] = (totals[cat] || 0) + v.amount;
        });
      });
      _renderSemaforoConData(sem, d, totals, curMx);
    });
  }
}

function _renderSemaforoConData(sem, data, totals, mes) {
  if (!data.categories) { sem.innerHTML = '<div style="font-size:.85rem;color:#9b9b97;padding:1rem 0;">Sin datos este mes</div>'; return; }
  const tInc = data.income ? data.income.reduce((s, r) => s + (r.value || 0), 0) : 0;
  // A3: aplicar filtro de perfil — mismo comportamiento que renderResumen
  const _catsF = filtrarCategoriasPorPerfil(data.categories);
  const tExp = _catsF.reduce((s, c) =>
    s + planItems(c).reduce((ss, r) => ss + (r.value || 0), 0) + (totals[c.name] || 0), 0);
  const tBud = _catsF.reduce((s, c) =>
    s + planItems(c).reduce((ss, r) => ss + calcPresupuestoBase(r, mes != null ? mes : curM), 0), 0);
  const avail = (tBud > 0 ? tBud : tInc) - tExp;

  const cats = _catsF.map(c => {
    const act = planItems(c).reduce((s, r) => s + (r.value || 0), 0) + (totals[c.name] || 0);
    const bud = planItems(c).reduce((s, r) => s + calcPresupuestoBase(r, mes != null ? mes : curM), 0);
    return { name: c.name, act, bud };
  }).filter(c => c.act > 0 || c.bud > 0);

  sem.innerHTML = `
    <div class="cards" style="margin-bottom:1rem;">
      <div class="card"><div class="cl">Ingresos</div><div class="cv g">${fmt(tInc)}</div></div>
      <div class="card"><div class="cl">Gasto real</div><div class="cv r">${fmt(tExp)}</div></div>
      <div class="card card-blue"><div class="cl">Presupuesto</div><div class="cv">${tBud > 0 ? fmt(tBud) : 'Sin definir'}</div></div>
      <div class="card"><div class="cl">Disponible</div><div class="cv ${avail >= 0 ? 'g' : 'r'}">${fmt(avail)}</div></div>
    </div>
    <div class="sec">
      <div class="sec-hdr"><span class="sec-title">Por categoría</span></div>
      ${cats.map(c => {
        const pct = c.bud > 0 ? Math.round((c.act / c.bud) * 100) : 0;
        const dot = c.bud > 0 ? (pct > 100 ? '#D85A30' : pct > 85 ? '#BA7517' : '#1D9E75') : '#ccc';
        const badge = c.bud > 0
          ? `<span style="font-size:.7rem;background:${pct>100?'#FAECE7':pct>85?'#FEF3C7':'#E1F5EE'};
              color:${pct>100?'#993C1D':pct>85?'#92400E':'#085041'};border-radius:99px;padding:1px 6px;">${pct}%</span>`
          : '';
        return `<div class="sem-row">
          <div class="sem-dot" style="background:${dot};"></div>
          <div class="sem-cat">${ICONS[c.name] || '📁'} ${c.name}<br>
            <span style="font-size:.75rem;color:#9b9b97;">${c.bud > 0 ? fmt(c.bud - c.act) + ' disponible' : 'Sin presupuesto'}</span>
          </div>
          <div style="text-align:right;">
            <div class="sem-val">${fmt(c.act)}</div>
            <div style="margin-top:2px;">${badge}</div>
          </div>
        </div>`;
      }).join('') || '<div style="font-size:.85rem;color:#9b9b97;padding:.5rem 0;">Sin datos este mes</div>'}
    </div>`;
}

// ── TENDENCIA ─────────────────────────────────────────────────────────────────

async function renderTendencia() {
  const el = document.getElementById('an-ten');
  if (!el) return;

  el.innerHTML = `<div style="padding:1rem 0;text-align:center;font-size:.85rem;color:var(--color-muted);">Cargando...</div>`;

  // Construir lista de 6 meses hacia atrás desde curMx
  const meses = [];
  for (let i = 5; i >= 0; i--) {
    let m = curMx - i, y = curYx;
    if (m < 0) { m += 12; y--; }
    meses.push({ m, y, lbl: MSHORT[m] });
  }

  // Cargar datos mensuales + daily para cada mes
  const datos = await Promise.all(meses.map(async ({ m, y, lbl }) => {
    try {
      const mm = String(m + 1).padStart(2, '0');
      const [snapMes, snapDaily] = await Promise.all([
        db.ref(dKey(y, m)).once('value'),
        db.ref(`hogares/${window.HOGAR.codigoHogar}/daily/${y}/${mm}`).once('value')
      ]);

      const d = snapMes.val();
      const expMes = d && d.categories
        ? d.categories.reduce((s, c) =>
            s + (c.items || []).filter(it => !it.auto).reduce((ss, r) => ss + (r.value || 0), 0), 0)
        : 0;
      const inc = d && d.income
        ? d.income.reduce((s, r) => s + (r.value || 0), 0)
        : 0;

      // Sumar gastos daily del mes
      let expDaily = 0;
      snapDaily.forEach(daySnap => {
        daySnap.forEach(item => { expDaily += (item.val().amount || 0); });
      });

      return { lbl, exp: expMes + expDaily, inc };
    } catch(e) { return { lbl, exp: 0, inc: 0 }; }
  }));

  // Calcular promedio de los 5 meses anteriores (excluye el actual)
  const anteriores = datos.slice(0, 5).filter(d => d.exp > 0);
  const promedio   = anteriores.length
    ? Math.round(anteriores.reduce((s, d) => s + d.exp, 0) / anteriores.length)
    : 0;
  const actual     = datos[datos.length - 1];
  const delta      = promedio > 0 ? Math.round(((actual.exp - promedio) / promedio) * 100) : 0;

  const maxVal = Math.max(...datos.map(d => Math.max(d.exp, d.inc)), 1);

  // Tarjetas resumen
  const deltaHtml = promedio > 0
    ? `<div style="font-size:11px;margin-top:2px;color:${delta <= 0 ? '#0F6E56' : '#993C1D'};">
        ${delta <= 0 ? '▼' : '▲'} ${Math.abs(delta)}% vs promedio
       </div>`
    : '';

  const tarjetas = `
  <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-bottom:.75rem;">
    <div style="background:var(--color-bg);border-radius:10px;padding:.6rem .75rem;border:0.5px solid var(--color-border);">
      <div style="font-size:11px;color:var(--color-muted);margin-bottom:2px;">Promedio 5 meses</div>
      <div style="font-size:14px;font-weight:600;font-family:'DM Mono',monospace;color:var(--color-text);">${promedio > 0 ? fmt(promedio) : '—'}</div>
    </div>
    <div style="background:var(--color-bg);border-radius:10px;padding:.6rem .75rem;border:0.5px solid var(--color-border);">
      <div style="font-size:11px;color:var(--color-muted);margin-bottom:2px;">Este mes</div>
      <div style="font-size:14px;font-weight:600;font-family:'DM Mono',monospace;color:${delta <= 0 ? '#0F6E56' : '#993C1D'};">${actual.exp > 0 ? fmt(actual.exp) : '—'}</div>
      ${deltaHtml}
    </div>
  </div>`;

  // Leyenda
  const leyenda = `
  <div style="display:flex;gap:12px;margin-bottom:.65rem;">
    <div style="display:flex;align-items:center;gap:5px;font-size:11px;color:var(--color-muted);">
      <div style="width:10px;height:10px;border-radius:2px;background:#534AB7;flex-shrink:0;"></div>Gastos
    </div>
    <div style="display:flex;align-items:center;gap:5px;font-size:11px;color:var(--color-muted);">
      <div style="width:10px;height:10px;border-radius:2px;background:#1D9E75;flex-shrink:0;"></div>Mes actual
    </div>
    <div style="display:flex;align-items:center;gap:5px;font-size:11px;color:var(--color-muted);">
      <div style="width:10px;height:10px;border-radius:2px;border:1.5px solid #1D9E75;background:transparent;flex-shrink:0;"></div>Ingresos
    </div>
  </div>`;

  // Barras
  const barras = datos.map((d, i) => {
    const isNow  = i === datos.length - 1;
    const wExp   = Math.round((d.exp / maxVal) * 100);
    const wInc   = Math.round((d.inc / maxVal) * 100);
    const sobreIngresos = d.inc > 0 && d.exp > d.inc;
    const barColor = isNow ? '#1D9E75' : sobreIngresos ? '#D85A30' : '#534AB7';
    const valColor = sobreIngresos ? '#993C1D' : isNow ? '#0F6E56' : 'var(--color-text)';
    return `
    <div class="ten-row" style="${isNow ? 'font-weight:600;' : ''}">
      <div class="ten-mes" style="${isNow ? 'color:var(--color-text);' : ''}">${d.lbl}</div>
      <div style="flex:1;display:flex;flex-direction:column;gap:3px;">
        <div class="ten-bar-wrap"><div class="ten-bar" style="width:${wExp || 1}%;background:${barColor};"></div></div>
        ${d.inc > 0 ? `<div class="ten-bar-wrap" style="background:transparent;border:0.5px solid #1D9E75;"><div style="width:${wInc}%;height:100%;"></div></div>` : ''}
      </div>
      <div class="ten-val" style="color:${valColor};">${d.exp > 0 ? fmt(d.exp) : '—'}</div>
    </div>`;
  }).join('');

  // Insight
  let insightTxt = '';
  if (promedio > 0 && actual.exp > 0) {
    const diff = Math.abs(actual.exp - promedio);
    if (delta <= -10) insightTxt = `Están <strong>${fmt(diff)} por debajo</strong> del promedio. Buen mes 👍`;
    else if (delta >= 10) insightTxt = `Están <strong>${fmt(diff)} por encima</strong> del promedio. Ojo con el gasto ⚠️`;
    else insightTxt = `Gasto similar al promedio histórico.`;
  } else if (actual.exp === 0) {
    insightTxt = `Sin gastos registrados este mes todavía.`;
  }

  const insightHtml = insightTxt ? `
  <div style="background:#E1F5EE;border-radius:10px;padding:.55rem .75rem;display:flex;gap:.5rem;align-items:flex-start;margin-top:.75rem;">
    <span style="font-size:1rem;flex-shrink:0;">📉</span>
    <span style="font-size:.82rem;color:#085041;line-height:1.5;">${insightTxt}</span>
  </div>` : '';

  el.innerHTML = `
  <div class="sec">
    <div class="sec-hdr"><span class="sec-title">Gastos vs ingresos — últimos 6 meses</span></div>
    ${tarjetas}
    ${leyenda}
    ${barras}
    ${insightHtml}
  </div>`;
}

// ── HORMIGA ───────────────────────────────────────────────────────────────────
// Gastos pequeños y frecuentes — umbral: menos de $20.000
// Lógica: filtra daily items por monto, agrupa por categoría, muestra por día

const HORMIGA_UMBRAL = 20000;

async function renderHormiga() {
  const el = document.getElementById('an-hor');
  if (!el) return;

  try {
    const mm   = String(curMx + 1).padStart(2, '0');
    const snap = await db.ref(`hogares/${window.HOGAR.codigoHogar}/daily/${curYx}/${mm}`).once('value');

    // Acumuladores — solo gastos hormiga (monto < umbral)
    const catTotals  = {}; // { categoria: { total, count } }
    const diaTotals  = { 0:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0 };
    let totalHormiga = 0;
    let countHormiga = 0;

    // Acumulador total de gastos del mes (para el insight)
    let totalMes = 0;

    snap.forEach(daySnap => {
      daySnap.forEach(item => {
        const v   = item.val();
        const amt = v.amount || 0;
        totalMes += amt;

        if (amt > 0 && amt < HORMIGA_UMBRAL) {
          totalHormiga += amt;
          countHormiga++;
          const rawCat = (v.category || 'Otros').replace(/^\S+\s/, '');
          const cat = CAT_RENAMES[rawCat] || rawCat;
          if (!catTotals[cat]) catTotals[cat] = { total: 0, count: 0 };
          catTotals[cat].total += amt;
          catTotals[cat].count++;
          const d = new Date(curYx, curMx, parseInt(daySnap.key));
          diaTotals[d.getDay()] += amt;
        }
      });
    });

    if (countHormiga === 0) {
      el.innerHTML = `<div class="sec" style="padding:1.5rem;text-align:center;">
        <div style="font-size:2rem;margin-bottom:.5rem;">🐜</div>
        <div style="font-size:.9rem;font-weight:500;color:var(--color-text-primary);">Sin gastos hormiga este mes</div>
        <div style="font-size:.8rem;color:var(--color-muted);margin-top:.25rem;">Son gastos menores a ${fmt(HORMIGA_UMBRAL)}</div>
      </div>`;
      return;
    }

    // Insight dinámico — compara con otros gastos cotidianos del mes
    const promedio   = Math.round(totalHormiga / countHormiga);
    const pctDelMes  = totalMes > 0 ? Math.round((totalHormiga / totalMes) * 100) : 0;
    let insightTexto = '';
    if (pctDelMes >= 10) {
      insightTexto = `Representan el <strong>${pctDelMes}%</strong> de tus gastos del mes — más de lo que parece.`;
    } else if (pctDelMes > 0) {
      insightTexto = `Representan el <strong>${pctDelMes}%</strong> de tus gastos del mes.`;
    } else {
      insightTexto = `Gastos pequeños que suman sin que uno se dé cuenta.`;
    }

    // Categorías ordenadas por total descendente
    const sortedCats = Object.entries(catTotals)
      .sort((a, b) => b[1].total - a[1].total);
    const maxCat = sortedCats[0][1].total;

    // Días de la semana
    const DIAS  = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
    const maxDia = Math.max(...Object.values(diaTotals), 1);

    el.innerHTML = `
      <div class="sec">
        <div style="background:#E1F5EE;padding:.75rem 1rem;border-bottom:.5px solid var(--color-border-tertiary);">
          <div style="display:flex;align-items:flex-start;gap:.6rem;">
            <span style="font-size:1.4rem;flex-shrink:0;">🐜</span>
            <span style="font-size:.85rem;color:#085041;line-height:1.5;">${insightTexto}</span>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;border-bottom:.5px solid var(--color-border-tertiary);">
          <div style="padding:.6rem 0;display:flex;flex-direction:column;align-items:center;gap:2px;border-right:.5px solid var(--color-border-tertiary);">
            <span style="font-size:.95rem;font-weight:500;font-family:'DM Mono',monospace;color:var(--color-text-primary);">${fmt(totalHormiga)}</span>
            <span style="font-size:.7rem;color:var(--color-muted);">Total hormiga</span>
          </div>
          <div style="padding:.6rem 0;display:flex;flex-direction:column;align-items:center;gap:2px;border-right:.5px solid var(--color-border-tertiary);">
            <span style="font-size:.95rem;font-weight:500;font-family:'DM Mono',monospace;color:var(--color-text-primary);">${countHormiga}</span>
            <span style="font-size:.7rem;color:var(--color-muted);">Gastos pequeños</span>
          </div>
          <div style="padding:.6rem 0;display:flex;flex-direction:column;align-items:center;gap:2px;">
            <span style="font-size:.95rem;font-weight:500;font-family:'DM Mono',monospace;color:var(--color-text-primary);">${fmt(promedio)}</span>
            <span style="font-size:.7rem;color:var(--color-muted);">Promedio c/u</span>
          </div>
        </div>
        <div style="padding:.4rem .75rem .25rem;display:flex;justify-content:flex-end;">
          <span style="font-size:.7rem;color:var(--color-muted);">Umbral: menos de ${fmt(HORMIGA_UMBRAL)}</span>
        </div>
      </div>

      <div class="sec">
        <div class="sec-hdr"><span class="sec-title">Dónde se van</span></div>
        ${sortedCats.map(([cat, data]) => {
          const w = Math.round((data.total / maxCat) * 100);
          return `<div class="hor-item">
            <div style="flex:1;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px;">
                <span style="font-size:.88rem;color:var(--color-text-primary);">${ICONS[cat] || '💸'} ${cat}</span>
                <span style="font-size:.75rem;color:var(--color-muted);">${data.count} vez${data.count !== 1 ? 'es' : ''}</span>
              </div>
              <div style="height:5px;background:var(--color-border-tertiary);border-radius:3px;overflow:hidden;">
                <div style="height:100%;width:${w}%;background:#D85A30;border-radius:3px;"></div>
              </div>
            </div>
            <span class="hor-val" style="margin-left:.75rem;">${fmt(data.total)}</span>
          </div>`;
        }).join('')}
      </div>

      <div class="sec">
        <div class="sec-hdr"><span class="sec-title">Cuándo más gastas</span></div>
        ${DIAS.map((dia, i) => {
          const w     = Math.round((diaTotals[i] / maxDia) * 100);
          const esFin = (i === 0 || i === 6);
          const color = esFin ? '#D85A30' : '#534AB7';
          return `<div class="ten-row">
            <div class="ten-mes" style="${esFin ? 'color:#D85A30;font-weight:500;' : ''}">${dia}</div>
            <div class="ten-bar-wrap"><div class="ten-bar" style="width:${w || 2}%;background:${color};"></div></div>
            <div class="ten-val">${fmt(diaTotals[i])}</div>
          </div>`;
        }).join('')}
      </div>`;

  } catch(e) {
    console.error('renderHormiga:', e);
    el.innerHTML = '<div class="sec" style="font-size:.85rem;color:var(--color-muted);padding:1rem;">Sin datos disponibles</div>';
  }
}

// ── ¿QUIÉN PAGÓ? ──────────────────────────────────────────────────────────────
// Balance por miembro vs proporción esperada según ingresos del perfil

async function renderQuienPago() {
  const el = document.getElementById('an-who');
  if (!el) return;

  el.innerHTML = `<div style="padding:1rem 0;text-align:center;font-size:.85rem;color:var(--color-muted);">Cargando...</div>`;

  try {
    const mm   = String(curMx + 1).padStart(2, '0');
    const snap = await db.ref(`hogares/${window.HOGAR.codigoHogar}/daily/${curYx}/${mm}`).once('value');

    // Acumular totales y por categoría por miembro
    const totales = {};
    const porCat  = {};

    snap.forEach(daySnap => daySnap.forEach(itemSnap => {
      const v   = itemSnap.val();
      if (!v.who || !v.amount) return;
      totales[v.who] = (totales[v.who] || 0) + v.amount;
      const rawCat = (v.category || 'Otros').replace(/^\S+\s/, '');
      const cat    = CAT_RENAMES[rawCat] || rawCat;
      if (!porCat[cat]) porCat[cat] = {};
      porCat[cat][v.who] = (porCat[cat][v.who] || 0) + v.amount;
    }));

    const miembros = Object.keys(totales);
    const total    = Object.values(totales).reduce((s, v) => s + v, 0);

    if (!miembros.length || !total) {
      el.innerHTML = `<div class="sec" style="padding:1.5rem;text-align:center;">
        <div style="font-size:2rem;margin-bottom:.5rem;">👥</div>
        <div style="font-size:.9rem;font-weight:500;color:var(--color-text-primary);">Sin gastos registrados este mes</div>
        <div style="font-size:.8rem;color:var(--color-muted);margin-top:.25rem;">Los gastos del Tab Hoy aparecerán aquí</div>
      </div>`;
      return;
    }

    // Colores por miembro (posición)
    const COLORES = [
      { bar: '#378ADD', bg: '#E6F1FB', text: '#0C447C' },
      { bar: '#D4537E', bg: '#FBEAF0', text: '#72243E' },
      { bar: '#1D9E75', bg: '#E1F5EE', text: '#085041' },
      { bar: '#BA7517', bg: '#FAEEDA', text: '#633806' }
    ];
    const colMap = {};
    miembros.forEach((m, i) => { colMap[m] = COLORES[i % COLORES.length]; });

    // Proporción esperada desde ingresos del perfil
    let ingTotPerfil = 0;
    const ingPerfil = {};
    if (window.HOGAR && window.HOGAR.miembros) {
      Object.values(window.HOGAR.miembros).forEach(mbr => {
        if (mbr.nombre && mbr.ingreso) {
          ingPerfil[mbr.nombre] = mbr.ingreso;
          ingTotPerfil += mbr.ingreso;
        }
      });
    }

    // ── BALANCE GLOBAL ────────────────────────────────────────────────────────
    const filasBalance = miembros.map(nombre => {
      const monto  = totales[nombre] || 0;
      const pctReal = Math.round((monto / total) * 100);
      const col    = colMap[nombre];
      const ini    = nombre.substring(0, 2).toUpperCase();
      return `
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
          <div style="width:30px;height:30px;border-radius:50%;background:${col.bg};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:500;color:${col.text};flex-shrink:0;">${ini}</div>
          <div style="flex:1;">
            <div style="display:flex;justify-content:space-between;font-size:13px;font-weight:500;color:var(--color-text);margin-bottom:4px;">
              <span>${nombre}</span>
              <span>${fmt(monto)} · ${pctReal}%</span>
            </div>
            <div style="height:6px;background:var(--color-border);border-radius:99px;overflow:hidden;">
              <div style="width:${pctReal}%;height:100%;background:${col.bar};border-radius:99px;"></div>
            </div>
          </div>
        </div>`;
    }).join('');

    // Proporción esperada según ingresos
    let esperadoHtml = '';
    if (ingTotPerfil > 0 && miembros.length > 1) {
      const partes = miembros.map(n => {
        const pct = ingPerfil[n] ? Math.round((ingPerfil[n] / ingTotPerfil) * 100) : 0;
        return `${n} ${pct}%`;
      }).join(' · ');
      esperadoHtml = `
        <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--color-muted);padding-top:8px;border-top:0.5px solid var(--color-border);margin-top:4px;">
          <span>Esperado según ingresos</span>
          <span>${partes}</span>
        </div>`;
    }

    // ── VEREDICTO ─────────────────────────────────────────────────────────────
    let veredictoHtml = '';
    if (ingTotPerfil > 0 && miembros.length > 1) {
      const diffs = miembros.map(nombre => {
        const pctReal = (totales[nombre] || 0) / total;
        const pctEsp  = ingPerfil[nombre] ? ingPerfil[nombre] / ingTotPerfil : 0;
        return { nombre, diff: Math.round((pctReal - pctEsp) * total) };
      });
      const maxDiff = diffs.reduce((a, b) => Math.abs(a.diff) > Math.abs(b.diff) ? a : b);
      const umbral  = total * 0.05;
      if (Math.abs(maxDiff.diff) <= umbral) {
        veredictoHtml = `
          <div style="background:#E1F5EE;border-radius:10px;padding:10px 14px;margin-bottom:.75rem;font-size:13px;color:#085041;line-height:1.5;">
            ✅ Están nivelados. La proporción de pagos va acorde a sus ingresos.
          </div>`;
      } else if (maxDiff.diff > 0) {
        veredictoHtml = `
          <div style="background:#FAEEDA;border-radius:10px;padding:10px 14px;margin-bottom:.75rem;font-size:13px;color:#854F0B;line-height:1.5;">
            ⚖️ <strong>${maxDiff.nombre}</strong> ha pagado ${fmt(Math.abs(maxDiff.diff))} más de lo esperado este mes.
          </div>`;
      }
    }

    // ── POR CATEGORÍA ─────────────────────────────────────────────────────────
    const catsOrdenadas = Object.entries(porCat)
      .filter(([, vals]) => Object.values(vals).reduce((s, v) => s + v, 0) > 0)
      .sort((a, b) => {
        const ta = Object.values(a[1]).reduce((s, v) => s + v, 0);
        const tb = Object.values(b[1]).reduce((s, v) => s + v, 0);
        return tb - ta;
      });

    const filasCat = catsOrdenadas.map(([cat, vals]) => {
      const catTotal = Object.values(vals).reduce((s, v) => s + v, 0);
      const barras   = miembros.map(nombre => {
        const monto = vals[nombre] || 0;
        const w     = catTotal > 0 ? Math.round((monto / catTotal) * 100) : 0;
        const col   = colMap[nombre];
        return `
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:3px;">
            <div style="flex:1;height:5px;background:var(--color-border);border-radius:99px;overflow:hidden;">
              <div style="width:${w}%;height:100%;background:${col.bar};border-radius:99px;"></div>
            </div>
            <span style="font-size:11px;color:var(--color-muted);min-width:52px;text-align:right;">${fmt(monto)}</span>
          </div>`;
      }).join('');
      return `
        <div style="margin-bottom:12px;">
          <div style="font-size:13px;color:var(--color-text);margin-bottom:5px;">${ICONS[cat] || '💸'} ${cat}</div>
          ${barras}
        </div>`;
    }).join('');

    // Leyenda
    const leyenda = miembros.map(nombre => {
      const col = colMap[nombre];
      return `<div style="display:flex;align-items:center;gap:5px;font-size:11px;color:var(--color-muted);">
        <div style="width:8px;height:8px;border-radius:2px;background:${col.bar};"></div>${nombre}
      </div>`;
    }).join('');

    el.innerHTML = `
      <div class="sec">
        <div class="sec-hdr"><span class="sec-title">Balance del mes</span></div>
        ${filasBalance}
        ${esperadoHtml}
      </div>
      ${veredictoHtml}
      <div class="sec">
        <div class="sec-hdr"><span class="sec-title">Por categoría</span></div>
        <div style="display:flex;gap:12px;margin-bottom:12px;">${leyenda}</div>
        ${filasCat || '<div style="font-size:.85rem;color:var(--color-muted);">Sin datos</div>'}
      </div>`;

  } catch(e) {
    console.error('renderQuienPago:', e);
    el.innerHTML = '<div class="sec" style="font-size:.85rem;color:var(--color-muted);padding:1rem;">Sin datos disponibles</div>';
  }
}
