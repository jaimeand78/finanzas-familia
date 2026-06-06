// js/analisis.js
// Responsabilidad: tab Análisis — Semáforo, Tendencia, Hormiga.
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
    _renderSemaforoConData(sem, D, dailyTotals);
  } else {
    db.ref(dKey(curYx, curMx)).once('value').then(snap => {
      const d = snap.val() || { income:[], categories:[] };
      _renderSemaforoConData(sem, d, {});
    });
  }
}

function _renderSemaforoConData(sem, data, totals) {
  if (!data.categories) { sem.innerHTML = '<div style="font-size:.85rem;color:#9b9b97;padding:1rem 0;">Sin datos este mes</div>'; return; }
  const tInc = data.income ? data.income.reduce((s, r) => s + (r.value || 0), 0) : 0;
  const tExp = data.categories.reduce((s, c) =>
    s + planItems(c).reduce((ss, r) => ss + (r.value || 0), 0) + (totals[c.name] || 0), 0);
  const tBud = data.categories.reduce((s, c) =>
    s + planItems(c).reduce((ss, r) => ss + (r.budget || 0), 0), 0);
  const avail = (tBud > 0 ? tBud : tInc) - tExp;

  const cats = data.categories.map(c => {
    const act = planItems(c).reduce((s, r) => s + (r.value || 0), 0) + (totals[c.name] || 0);
    const bud = planItems(c).reduce((s, r) => s + (r.budget || 0), 0);
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

  const meses = [];
  for (let i = 5; i >= 0; i--) {
    let m = curMx - i, y = curYx;
    if (m < 0) { m += 12; y--; }
    meses.push({ m, y, lbl: MSHORT[m] });
  }

  const datos = await Promise.all(meses.map(async ({ m, y, lbl }) => {
    try {
      const snap = await db.ref(dKey(y, m)).once('value');
      const d = snap.val();
      if (!d) return { lbl, exp: 0, inc: 0 };
      const exp = d.categories ? d.categories.reduce((s, c) =>
        s + (c.items || []).filter(it => !it.auto).reduce((ss, r) => ss + (r.value || 0), 0), 0) : 0;
      const inc = d.income ? d.income.reduce((s, r) => s + (r.value || 0), 0) : 0;
      return { lbl, exp, inc };
    } catch(e) { return { lbl, exp: 0, inc: 0 }; }
  }));

  const maxVal = Math.max(...datos.map(d => Math.max(d.exp, d.inc)), 1);

  el.innerHTML = `
    <div class="sec">
      <div class="sec-hdr"><span class="sec-title">Gastos últimos 6 meses</span></div>
      ${datos.map((d, i) => {
        const wExp = Math.round((d.exp / maxVal) * 100);
        const wInc = Math.round((d.inc / maxVal) * 100);
        const isNow = i === datos.length - 1;
        return `<div class="ten-row">
          <div class="ten-mes">${d.lbl}</div>
          <div style="flex:1;">
            <div class="ten-bar-wrap"><div class="ten-bar" style="width:${wExp}%;background:${isNow ? '#1D9E75' : '#534AB7'};"></div></div>
            ${d.inc > 0 ? `<div class="ten-bar-wrap" style="margin-top:2px;"><div class="ten-bar" style="width:${wInc}%;background:#E1F5EE;border:1px solid #1D9E75;"></div></div>` : ''}
          </div>
          <div class="ten-val">${fmt(d.exp)}</div>
        </div>`;
      }).join('')}
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
          const cat = v.category || 'Otros';
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
