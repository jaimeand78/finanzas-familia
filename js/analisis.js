// js/analisis.js
// Responsabilidad: tab Análisis — Semáforo, Tendencia, Hormiga.
// Depende de: utils.js, firebase-paths.js, finanzas.js (D, curY, curM, dailyTotals)

async function renderAnalisis() {
  renderSemaforo();
  await renderTendencia();
  await renderHormiga();
  // Activar primer sub-tab si ninguno está activo
  if (!document.querySelector('.an-tab.on')) goAn('sem');
}

// ── SEMÁFORO ──────────────────────────────────────────────────────────────────

function renderSemaforo() {
  if (!D.categories) return;
  const sem = document.getElementById('an-sem');
  if (!sem) return;

  const tInc = D.income ? D.income.reduce((s, r) => s + (r.value || 0), 0) : 0;
  const tExp = D.categories.reduce((s, c) =>
    s + planItems(c).reduce((ss, r) => ss + (r.value || 0), 0) + (dailyTotals[c.name] || 0), 0);
  const tBud = D.categories.reduce((s, c) =>
    s + planItems(c).reduce((ss, r) => ss + (r.budget || 0), 0), 0);
  const avail = (tBud > 0 ? tBud : tInc) - tExp;

  const cats = D.categories.map(c => {
    const act = planItems(c).reduce((s, r) => s + (r.value || 0), 0) + (dailyTotals[c.name] || 0);
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
    let m = curM - i, y = curY;
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

async function renderHormiga() {
  const el = document.getElementById('an-hor');
  if (!el) return;

  try {
    const mm   = String(curM + 1).padStart(2, '0');
    const snap = await db.ref(`hogares/${window.HOGAR.codigoHogar}/daily/${curY}/${mm}`).once('value');
    const catTotals = {};
    const diaTotals = { 0:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0 };
    let total = 0, count = 0;
    const DIAS = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];

    snap.forEach(daySnap => {
      daySnap.forEach(item => {
        const v   = item.val();
        const amt = v.amount || 0;
        total += amt; count++;
        if (!catTotals[v.category]) catTotals[v.category] = 0;
        catTotals[v.category] += amt;
        const d = new Date(curY, curM, parseInt(daySnap.key));
        diaTotals[d.getDay()] += amt;
      });
    });

    const sortedCats = Object.entries(catTotals).sort((a, b) => b[1] - a[1]).slice(0, 8);
    const maxDia = Math.max(...Object.values(diaTotals), 1);

    el.innerHTML = `
      <div class="sec">
        <div class="sec-hdr">
          <span class="sec-title">Gastos del mes</span>
          <span class="sec-val">${fmt(total)}</span>
        </div>
        <div style="font-size:.8rem;color:#9b9b97;margin-bottom:.75rem;">${count} gasto${count !== 1 ? 's' : ''} registrado${count !== 1 ? 's' : ''}</div>
        ${sortedCats.map(([cat, val]) => `
          <div class="hor-item">
            <span>${ICONS[cat] || '💸'} ${cat}</span>
            <span class="hor-val">${fmt(val)}</span>
          </div>`).join('') || '<div style="font-size:.85rem;color:#9b9b97;">Sin gastos este mes</div>'}
      </div>
      <div class="sec">
        <div class="sec-hdr"><span class="sec-title">Por día de la semana</span></div>
        ${DIAS.map((dia, i) => {
          const w     = Math.round((diaTotals[i] / maxDia) * 100);
          const color = (i === 5 || i === 6) ? '#D85A30' : '#534AB7';
          return `<div class="ten-row">
            <div class="ten-mes">${dia}</div>
            <div class="ten-bar-wrap"><div class="ten-bar" style="width:${w || 2}%;background:${color};"></div></div>
            <div class="ten-val">${fmt(diaTotals[i])}</div>
          </div>`;
        }).join('')}
      </div>`;
  } catch(e) {
    console.error('renderHormiga:', e);
    el.innerHTML = '<div class="sec" style="font-size:.85rem;color:#9b9b97;">Sin datos disponibles</div>';
  }
}
