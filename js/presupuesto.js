// js/presupuesto.js
// Responsabilidad: onboarding Presupuesto Base (5 pantallas + resumen)
//                  y sección Presupuesto en tab Config.
// Depende de: config.js (db), utils.js, firebase-paths.js, finanzas.js (D, curM, defD, save, recalc)
// NUEVO en Etapa E (v2.2)

// ── ESTADO ────────────────────────────────────────────────────────────────────

let _onbStep = 1;
let _onbData = {};

// ── HELPER SINGULAR / PLURAL ──────────────────────────────────────────────────
// Devuelve singular si tipoHogar === 'soltero', plural en cualquier otro caso.

function _tx(singular, plural) {
  return _onbData.tipoHogar === 'soltero' ? singular : plural;
}

// ── PUNTOS DE ENTRADA ─────────────────────────────────────────────────────────

// Abre el onboarding directo en P1.5 para hogares existentes sin perfilCompleto
window.abrirCompletarPerfil = function() {
  document.getElementById('bannerPerfilCompleto').style.display = 'none';
  // Precargar tipoHogar desde meta del hogar
  _onbData = {
    tipoHogar:      (window.HOGAR && window.HOGAR.meta && window.HOGAR.meta.tipoHogar) || 'pareja',
    tieneVehiculo:  true,
    tieneEmpleada:  false,
    tieneEducacion: false,
    tieneSeguros:   true
  };
  _onbStep = 15;
  _renderStep();
  document.getElementById('presupuestoModal').style.display = 'flex';
};

function iniciarOnboarding() {
  _onbStep = 1;
  _onbData = {};
  _renderStep();
  document.getElementById('presupuestoModal').style.display = 'flex';
}

window.cerrarOnboarding = function() {
  document.getElementById('presupuestoModal').style.display = 'none';
};

// Para abrir desde Config con los valores actuales precargados
function abrirConfigPresupuesto() {
  _onbData   = _leerDActual();
  _onbStep   = 1;
  _renderStep();
  document.getElementById('presupuestoModal').style.display = 'flex';
}

// ── RENDER PASO ───────────────────────────────────────────────────────────────

function _renderStep() {
  const inner = document.getElementById('onbInner');
  if (!inner) return;
  switch (_onbStep) {
    case 1:  inner.innerHTML = _tpl1(); break;
    case 15: inner.innerHTML = _tpl15(); break; // P1.5 — ¿Qué quieren presupuestar?
    case 2:  inner.innerHTML = _tpl2(); break;
    case 3:  inner.innerHTML = _tpl3(); break;
    case 4:  inner.innerHTML = _tpl4(); break;
    case 5:  inner.innerHTML = _tpl5(); break;
    default: inner.innerHTML = _tplResumen(); break;
  }
}

// ── BARRA DE PROGRESO ─────────────────────────────────────────────────────────

function _prog(step) {
  const dots = [1,2,3,4,5].map(i =>
    `<div class="onb-dot${i <= step ? ' act' : ''}"></div>`
  ).join('');
  return `<div class="onb-prog">${dots}<span class="onb-step-n">${step} de 5</span></div>`;
}

// ── PANTALLA 1 — ¿Cómo es su hogar? ──────────────────────────────────────────

function _tpl1() {
  const sel = t => _onbData.tipoHogar === t ? ' sel' : '';
  return `
<div class="onb-page">
  ${_prog(1)}
  <div class="onb-body">
    <div class="onb-emoji">🏠</div>
    <h2 class="onb-title">¿Cómo es tu hogar?</h2>
    <p class="onb-sub">Cuéntanos cómo está organizado tu hogar para mostrarte lo que tiene sentido para ti.</p>
    <div class="onb-opts">
      <button class="onb-opt${sel('soltero')}" onclick="onbTipo('soltero')">
        <span class="oi">🧍</span><span class="ol">Solo</span><span class="os">Manejo mis finanzas</span>
      </button>
      <button class="onb-opt${sel('pareja')}" onclick="onbTipo('pareja')">
        <span class="oi">👫</span><span class="ol">En pareja</span><span class="os">Sin hijos por ahora</span>
      </button>
      <button class="onb-opt${sel('familia')}" onclick="onbTipo('familia')">
        <span class="oi">👨‍👩‍👧</span><span class="ol">Familia</span><span class="os">Con hijos</span>
      </button>
    </div>
  </div>
  <div class="onb-foot">
    <button class="onb-pri" onclick="onbNext()" ${!_onbData.tipoHogar ? 'disabled' : ''}>Continuar →</button>
  </div>
</div>`;
}

window.onbTipo = function(t) { _onbData.tipoHogar = t; _renderStep(); };

// ── PANTALLA 1.5 — ¿Qué quieren presupuestar? ────────────────────────────────

function _tpl15() {
  const d = _onbData;
  const tog = (key, icon, name, desc) => {
    const on = d[key] !== false; // default true
    return `
    <div class="onb-toggle-row">
      <div class="onb-toggle-left">
        <span class="onb-toggle-icon">${icon}</span>
        <div>
          <div class="onb-toggle-name">${name}</div>
          <div class="onb-toggle-desc">${desc}</div>
        </div>
      </div>
      <button class="onb-toggle-sw${on ? ' on' : ''}" onclick="onbToggle('${key}', this)"></button>
    </div>`;
  };
  const esFamilia = d.tipoHogar === 'familia';
  return `
<div class="onb-page">
  ${_prog(1)}
  <div class="onb-body">
    <div class="onb-emoji">🏡</div>
    <h2 class="onb-title">¿Qué ${_tx('quieres','quieren')} presupuestar?</h2>
    <p class="onb-sub">Activa solo lo que aplica a ${_tx('tu hogar','su hogar')}. ${_tx('Puedes','Pueden')} cambiarlo después.</p>
    <div class="onb-toggle-group">
      ${tog('tieneVehiculo',  '🚗', 'Vehículo',             'Gasolina, seguro, impuestos')}
      ${tog('tieneEmpleada',  '🤝', 'Servicio Doméstico',   'Empleada, niñera')}
      ${esFamilia ? tog('tieneEducacion', '📚', 'Educación', 'Colegio, universidad, útiles') : ''}
      ${tog('tieneSeguros',   '🛡️', 'Seguros e Impuestos',  'SOAT, predial, pólizas')}
    </div>
    <p class="onb-toggle-hint">Vivienda, Alimentación y Ahorro siempre activos</p>
  </div>
  <div class="onb-foot">
    <button class="onb-pri" onclick="onbNext()">Continuar →</button>
  </div>
</div>`;
}

window.onbToggle = function(key, btn) {
  _onbData[key] = !(_onbData[key] !== false);
  btn.classList.toggle('on', _onbData[key] !== false);
};

function _tpl2() {
  const esSolo = _onbData.tipoHogar === 'soltero';
  const opts = [
    { id:'invisible', icon:'💸', label:'No sé en qué se va el dinero', sub:'El mes acaba y no queda nada' },
    ...(!esSolo ? [{ id:'acuerdo', icon:'🤝', label:'No nos ponemos de acuerdo', sub:'Cada uno ve el dinero diferente' }] : []),
    ...(esSolo  ? [{ id:'acuerdo', icon:'😰', label:'Gasto más de lo que gano', sub:'Siempre falta antes de que acabe el mes' }] : []),
    { id:'justo',     icon:'😓', label:_tx('Siempre llego muy justo','Siempre llegamos muy justos'), sub:'Siempre falta un poco' },
    { id:'ahorro',    icon:'🏦', label:_tx('Quiero ahorrar pero no logro','Queremos ahorrar pero no logramos'), sub:'La plata siempre se gasta primero' },
  ];
  return `
<div class="onb-page">
  ${_prog(2)}
  <div class="onb-body">
    <div class="onb-emoji">🤔</div>
    <h2 class="onb-title">${_tx('¿Cuál es tu mayor reto?','¿Cuál es su mayor reto?')}</h2>
    <p class="onb-sub">${_tx('Así podemos mostrarte lo que más importa para ti.','Así podemos mostrarte lo que más importa para ustedes.')}</p>
    <div class="onb-opts">
      ${opts.map(o => `
      <button class="onb-opt${_onbData.reto === o.id ? ' sel' : ''}" onclick="onbReto('${o.id}')">
        <span class="oi">${o.icon}</span><span class="ol">${o.label}</span><span class="os">${o.sub}</span>
      </button>`).join('')}
    </div>
  </div>
  <div class="onb-foot">
    <button class="onb-skip" onclick="onbSkip()">Prefiero no decir</button>
    <button class="onb-pri" onclick="onbNext()" ${!_onbData.reto ? 'disabled' : ''}>Continuar →</button>
  </div>
</div>`;
}

window.onbReto = function(r) { _onbData.reto = r; _renderStep(); };

// ── PANTALLA 3 — ¿Con cuánto cuentan? ────────────────────────────────────────

function _tpl3() {
  const perfil     = (window.HOGAR && window.HOGAR.perfil) || {};
  const miembros   = Object.values(perfil.miembros || {}).filter(m => m.rol === 'adulto' && m.nombre);
  const tipoHogar  = _onbData.tipoHogar || (window.HOGAR && window.HOGAR.meta && window.HOGAR.meta.tipoHogar) || '';
  const esSoltero  = tipoHogar === 'soltero';
  const lbl1 = miembros[0] ? 'Ingreso de ' + miembros[0].nombre : 'Ingreso principal';
  const lbl2 = miembros[1] ? 'Ingreso de ' + miembros[1].nombre : 'Segundo ingreso';
  return `
<div class="onb-page">
  ${_prog(3)}
  <div class="onb-body">
    <div class="onb-emoji">💵</div>
    <h2 class="onb-title">${_tx('¿Con cuánto cuentas este mes?','¿Con cuánto cuentan este mes?')}</h2>
    <p class="onb-sub">${_tx('Solo el total que recibes. Los detalles los ajustas después.','Solo el total que llega al hogar. Los detalles los ajustan después.')}</p>
    <div class="onb-fields">
      <div class="onb-field">
        <label>${lbl1}</label>
        <div class="onb-iw"><span class="onb-pre">$</span>
          <input type="text" inputmode="decimal" id="oInc1"
            value="${_onbData.inc1 || ''}" placeholder="0"
            oninput="_onbData.inc1=parseFloat(this.value.replace(/[^0-9.]/g,''))||0"/>
        </div>
      </div>
      ${!esSoltero ? `
      <div class="onb-field">
        <label>${lbl2} <span class="onb-badge">opcional</span></label>
        <div class="onb-iw"><span class="onb-pre">$</span>
          <input type="text" inputmode="decimal" id="oInc2"
            value="${_onbData.inc2 || ''}" placeholder="0"
            oninput="_onbData.inc2=parseFloat(this.value.replace(/[^0-9.]/g,''))||0"/>
        </div>
      </div>` : ''}
    </div>
  </div>
  <div class="onb-foot">
    <button class="onb-skip" onclick="onbSkip()">Saltar por ahora</button>
    <button class="onb-pri" onclick="onbNext()">Continuar →</button>
  </div>
</div>`;
}

// ── PANTALLA 4 — Lo que sí o sí hay que pagar ─────────────────────────────────

function _tpl4() {
  const tieneVeh = _onbData.tieneVehiculo !== false;
  return `
<div class="onb-page">
  ${_prog(4)}
  <div class="onb-body">
    <div class="onb-emoji">📌</div>
    <h2 class="onb-title">Lo que sí o sí hay que pagar</h2>
    <p class="onb-sub">Estos gastos son fijos — aparecen todos los meses sin falta.</p>
    <div class="onb-fields">
      <div class="onb-field">
        <label>🏠 Arriendo o cuota del apartamento</label>
        <div class="onb-iw"><span class="onb-pre">$</span>
          <input type="text" inputmode="decimal" id="oArr"
            value="${_onbData.arriendo || ''}" placeholder="0"
            oninput="_onbData.arriendo=parseFloat(this.value.replace(/[^0-9.]/g,''))||0"/>
        </div>
      </div>
      <div class="onb-field">
        <label>💡 Servicios <span class="onb-badge">total estimado — lo desglosás en Config</span></label>
        <div class="onb-iw"><span class="onb-pre">$</span>
          <input type="text" inputmode="decimal" id="oSvc"
            value="${_onbData.servicios || ''}" placeholder="0"
            oninput="_onbData.servicios=parseFloat(this.value.replace(/[^0-9.]/g,''))||0"/>
        </div>
      </div>
      <div class="onb-field">
        <label>${tieneVeh ? '🚗 Gasolina mensual' : '🚌 Transporte público'} <span class="onb-badge">estimado</span></label>
        <div class="onb-iw"><span class="onb-pre">$</span>
          <input type="text" inputmode="decimal" id="oTrn"
            value="${_onbData.transporte || ''}" placeholder="0"
            oninput="_onbData.transporte=parseFloat(this.value.replace(/[^0-9.]/g,''))||0"/>
        </div>
      </div>
      ${tieneVeh ? `
      <div class="onb-field">
        <label>💳 Cuota del vehículo</label>
        <div class="onb-iw"><span class="onb-pre">$</span>
          <input type="text" inputmode="decimal" id="oVeh"
            value="${_onbData.cuotaVeh || ''}" placeholder="0"
            oninput="_onbData.cuotaVeh=parseFloat(this.value.replace(/[^0-9.]/g,''))||0"/>
        </div>
      </div>` : ''}
    </div>
  </div>
  <div class="onb-foot">
    <button class="onb-skip" onclick="onbSkip()">Saltar por ahora</button>
    <button class="onb-pri" onclick="onbNext()">Continuar →</button>
  </div>
</div>`;
}

// ── PANTALLA 5 — Lo que varía ─────────────────────────────────────────────────

function _tpl5() {
  return `
<div class="onb-page">
  ${_prog(5)}
  <div class="onb-body">
    <div class="onb-emoji">🎢</div>
    <h2 class="onb-title">Lo que varía según el mes</h2>
    <p class="onb-sub">${_tx('Un estimado está bien. Lo ajustas con el tiempo.','Un estimado está bien. Lo ajustan con el tiempo.')}</p>
    <div class="onb-fields">
      <div class="onb-field">
        <label>🧺 Mercado y loncheras</label>
        <div class="onb-iw"><span class="onb-pre">$</span>
          <input type="text" inputmode="decimal" id="oMrc"
            value="${_onbData.mercado || ''}" placeholder="0"
            oninput="_onbData.mercado=parseFloat(this.value.replace(/[^0-9.]/g,''))||0"/>
        </div>
      </div>
      <div class="onb-field">
        <label>🍿 Entretenimiento y salidas</label>
        <div class="onb-iw"><span class="onb-pre">$</span>
          <input type="text" inputmode="decimal" id="oEnt"
            value="${_onbData.entrete || ''}" placeholder="0"
            oninput="_onbData.entrete=parseFloat(this.value.replace(/[^0-9.]/g,''))||0"/>
        </div>
      </div>
      <div class="onb-field">
        <label>🐷 ¿Cuánto ${_tx('quieres','quieren')} guardar?</label>
        <div class="onb-iw"><span class="onb-pre">$</span>
          <input type="text" inputmode="decimal" id="oAho"
            value="${_onbData.ahorro || ''}" placeholder="0"
            oninput="_onbData.ahorro=parseFloat(this.value.replace(/[^0-9.]/g,''))||0"/>
        </div>
      </div>
    </div>
  </div>
  <div class="onb-foot">
    <button class="onb-skip" onclick="onbSkip()">Saltar por ahora</button>
    <button class="onb-pri" onclick="onbNext()">Ver resumen →</button>
  </div>
</div>`;
}

// ── RESUMEN ───────────────────────────────────────────────────────────────────

function _tplResumen() {
  const inc    = (_onbData.inc1 || 0) + (_onbData.inc2 || 0);
  const gastos = (_onbData.arriendo  || 0) + (_onbData.servicios || 0) +
                 (_onbData.transporte|| 0) + (_onbData.cuotaVeh  || 0) +
                 (_onbData.mercado   || 0) + (_onbData.entrete   || 0) +
                 (_onbData.ahorro    || 0);
  const libre  = inc - gastos;
  const pct    = inc > 0 ? Math.round((gastos / inc) * 100) : 0;

  let insight = '';
  if (inc > 0) {
    if (pct > 100) insight = `⚠️ Los gastos planeados superan los ingresos. ${_tx('Ajusta algún valor antes de guardar.','Ajusten algún valor antes de guardar.')}`;
    else if (pct > 90) insight = `📊 ${_tx('Estás muy ajustado.','Están muy ajustados.')} Cualquier gasto extra puede desequilibrar el mes.`;
    else if (_onbData.reto === 'ahorro' && !_onbData.ahorro) insight = `💡 ${_tx('Pusiste ahorro en cero — configúralo aunque sea con poco para crear el hábito.','Pusieron ahorro en cero — configúrenlo aunque sea con poco para crear el hábito.')}`;
    else if (libre > inc * 0.2) insight = `🎉 Buen margen disponible. ${_tx('Registra los gastos diarios para ver la foto completa.','Regístren los gastos diarios para ver la foto completa.')}`;
    else insight = `📋 Presupuesto base listo. ${_tx('Registra los gastos diarios para entender en qué se va el dinero.','Registren los gastos diarios para entender en qué se va el dinero.')}`;
  }

  // Mostrar invitación solo si hay un miembro
  const miembros = Object.keys((window.HOGAR && window.HOGAR.miembros) || {}).length;
  const invHtml  = miembros < 2 ? `
  <div class="onb-inv">
    <p>¿Quieres invitar a tu pareja para que revise esto juntos?</p>
    <div style="display:flex;gap:.5rem;flex-wrap:wrap;">
      <button class="onb-sec" onclick="mostrarCodigoInv()">Compartir código</button>
      <button class="onb-ghost" onclick="this.closest('.onb-inv').style.display='none'">Lo hago después</button>
    </div>
  </div>` : '';

  return `
<div class="onb-page">
  <div class="onb-body" style="padding-top:1.5rem;">
    <div class="onb-emoji">✅</div>
    <h2 class="onb-title">Así queda el mes</h2>
    ${inc > 0 ? `
    <div class="onb-res-row">
      <div class="onb-res-card"><span class="onb-rl">${_tx('Ingresa','Ingresan')}</span><span class="onb-rv g">${fmt(inc)}</span></div>
      <div class="onb-res-card"><span class="onb-rl">Se van</span><span class="onb-rv">${fmt(gastos)}</span></div>
      <div class="onb-res-card"><span class="onb-rl">${_tx('Te queda','Les queda')}</span><span class="onb-rv ${libre >= 0 ? 'g' : 'r'}">${fmt(libre)}</span></div>
    </div>
    ${pct > 0 ? `<div class="onb-bar-wrap">
      <div class="onb-bar-fill" style="width:${Math.min(pct,100)}%;background:${pct>100?'#D85A30':pct>85?'#BA7517':'#1D9E75'};"></div>
    </div>
    <span style="font-size:.72rem;color:#9b9b97;display:block;text-align:right;margin-top:.2rem;">${pct}% comprometido</span>` : ''}
    ${insight ? `<p class="onb-insight">${insight}</p>` : ''}
    ` : `<p class="onb-sub">Saltaron los números — pueden configurarlos desde ⚙️ Config en cualquier momento.</p>`}
    ${invHtml}
  </div>
  <div class="onb-foot" style="border-top:1px solid var(--color-border);margin-top:1rem;">
    <button class="onb-skip" onclick="cerrarOnboarding()">Cancelar</button>
    <button class="onb-pri" onclick="guardarPresupuestoBase()">Guardar y empezar →</button>
  </div>
</div>`;
}

window.mostrarCodigoInv = function() {
  const codigo = window.HOGAR && window.HOGAR.codigoHogar;
  if (!codigo) return;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(codigo)
      .then(() => toast('📋 Código copiado: ' + codigo))
      .catch(() => toast('Código del hogar: ' + codigo));
  } else {
    toast('Código del hogar: ' + codigo);
  }
};

// ── NAVEGACIÓN ────────────────────────────────────────────────────────────────

window.onbNext = function() {
  _leerCampos(_onbStep);
  if (_onbStep === 1)  { _onbStep = 15; _renderStep(); return; } // P1 → P1.5
  if (_onbStep === 15) { _onbStep = 2;  _renderStep(); return; } // P1.5 → P2
  _onbStep++;
  if (_onbStep > 5) _onbStep = 99; // resumen
  _renderStep();
};

window.onbSkip = function() {
  if (_onbStep === 15) { _onbStep = 2; _renderStep(); return; }
  _onbStep++;
  if (_onbStep > 5) _onbStep = 99;
  _renderStep();
};

function _leerCampos(step) {
  const g = id => {
    const el = document.getElementById(id);
    return el ? (parseFloat(el.value.replace(/[^0-9.]/g, '')) || 0) : 0;
  };
  if (step === 3) { _onbData.inc1 = g('oInc1'); _onbData.inc2 = g('oInc2'); }
  if (step === 4) {
    _onbData.arriendo   = g('oArr');
    _onbData.servicios  = g('oSvc');
    _onbData.transporte = g('oTrn');
    _onbData.cuotaVeh   = g('oVeh');
  }
  if (step === 5) {
    _onbData.mercado = g('oMrc');
    _onbData.entrete = g('oEnt');
    _onbData.ahorro  = g('oAho');
  }
}

// ── GUARDAR ───────────────────────────────────────────────────────────────────

window.guardarPresupuestoBase = async function() {
  _aplicarOnbDataAD();
  const cH = window.HOGAR && window.HOGAR.codigoHogar;
  if (cH) {
    try {
      const updates = { 'meta/presupuestoBase': true };
      if (_onbData.tipoHogar) updates['meta/tipoHogar'] = _onbData.tipoHogar;
      if (_onbData.reto)      updates['meta/reto']      = _onbData.reto;
      // Guardar flags de perfil
      updates['perfil/tieneVehiculo']  = _onbData.tieneVehiculo  !== false;
      updates['perfil/tieneEmpleada']  = _onbData.tieneEmpleada  !== false;
      updates['perfil/tieneEducacion'] = _onbData.tieneEducacion !== false;
      updates['perfil/tieneSeguros']   = _onbData.tieneSeguros   !== false;
      updates['perfil/perfilCompleto'] = true;
      await db.ref(`hogares/${cH}`).update(updates);
      // Actualizar window.HOGAR.perfil localmente
      window.HOGAR.perfil = Object.assign(window.HOGAR.perfil || {}, {
        tieneVehiculo:  _onbData.tieneVehiculo  !== false,
        tieneEmpleada:  _onbData.tieneEmpleada  !== false,
        tieneEducacion: _onbData.tieneEducacion !== false,
        tieneSeguros:   _onbData.tieneSeguros   !== false,
        perfilCompleto: true
      });
    } catch(e) { console.error('guardarPresupuestoBase meta:', e); }
  }
  save();
  cerrarOnboarding();
  toast('✅ Presupuesto base guardado');
  if (typeof renderAll === 'function') renderAll();
  renderConfigPresupuesto();
};

function _aplicarOnbDataAD() {
  if (!D || !D.categories) D = defD();

  const perfil   = (window.HOGAR && window.HOGAR.perfil) || {};
  const miembros = Object.values(perfil.miembros || {}).filter(m => m.rol === 'adulto' && m.nombre);

  // Ingresos
  D.income = [];
  if (_onbData.inc1) {
    D.income.push({ label: miembros[0] ? 'Ingreso ' + miembros[0].nombre : 'Ingreso principal', value: _onbData.inc1, fixed: true });
  }
  if (_onbData.inc2) {
    D.income.push({ label: miembros[1] ? 'Ingreso ' + miembros[1].nombre : 'Segundo ingreso', value: _onbData.inc2, fixed: true });
  }
  if (!D.income.length) D.income = buildIncomeFromPerfil(perfil);
  if (!D.income.find(r => r.label === 'Otros ingresos'))
    D.income.push({ label: 'Otros ingresos', value: 0, fixed: false });

  // Helper para poner budget en un ítem de una categoría
  const setBudget = (catName, itemLabel, val) => {
    if (!val) return;
    const cat = D.categories.find(c => c.name.includes(catName));
    if (!cat) return;
    const item = cat.items.find(it => it.label === itemLabel);
    if (item) item.budget = val;
  };

  if (_onbData.arriendo)   setBudget('Vivienda',       'Arriendo / Hipoteca', _onbData.arriendo);
  if (_onbData.servicios) setBudget('Vivienda', 'Agua y Energía', _onbData.servicios);
  if (_onbData.transporte) setBudget('Transporte',     'Combustible',              _onbData.transporte);
  if (_onbData.cuotaVeh)   setBudget('Transporte',     'Cuota crédito / leasing',  _onbData.cuotaVeh);
  if (_onbData.mercado)    setBudget('Alimentación',   'Mercado',                  _onbData.mercado);
  if (_onbData.entrete)    setBudget('Entretenimiento','Salidas',                   _onbData.entrete);
  if (_onbData.ahorro)     setBudget('Ahorro',         'Ahorro programado',         _onbData.ahorro);
}

// ── BANNER MIEMBRO 2 ──────────────────────────────────────────────────────────

function renderBannerMiembro2(nombreCreador) {
  const banner = document.getElementById('bannerMiembro2');
  if (!banner) return;
  banner.innerHTML = `
  <div class="banner-m2">
    <div class="banner-m2-txt">
      <strong>${nombreCreador}</strong> configuró el presupuesto base. ¿Estás de acuerdo con estos números?
    </div>
    <div class="banner-m2-btns">
      <button class="onb-pri sm" onclick="bannerAcuerdo()">Se ve bien 👍</button>
      <button class="onb-sec sm" onclick="bannerAjuste()">Tengo un ajuste</button>
    </div>
  </div>`;
  banner.style.display = 'block';
}

window.bannerAcuerdo = async function() {
  const uid = firebase.auth(firebase.app('fp')).currentUser?.uid;
  const cH  = window.HOGAR && window.HOGAR.codigoHogar;
  if (uid && cH) {
    try { await db.ref(`hogares/${cH}/miembros/${uid}/acuerdoPresupuesto`).set(true); }
    catch(e) { console.error(e); }
  }
  document.getElementById('bannerMiembro2').style.display = 'none';
  toast('✅ ¡Están sincronizados!');
};

window.bannerAjuste = function() {
  document.getElementById('bannerMiembro2').style.display = 'none';
  if (typeof go === 'function') go('c');
  toast('💬 Ajusta los valores en Config > Presupuesto');
};

// ── CONFIG — SECCIÓN PRESUPUESTO BASE ─────────────────────────────────────────

async function renderConfigPresupuesto() {
  const el = document.getElementById('budgetConfig');
  if (!el) return;
  if (!D || !D.categories || !D.categories.length) {
    el.innerHTML = `
    <p class="cfg-empty">No hay presupuesto configurado todavía.</p>
    <button class="btn-primary" style="margin-top:.5rem;" onclick="iniciarOnboarding()">
      Configurar presupuesto base
    </button>`;
    return;
  }

  // DA-18: Config es vista anual — cargar budget máximo de todos los meses
  // para mostrar el valor real de ítems de fecha fija (SOAT, predial, cesantías, primas)
  const MESES_CORTO = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  const budgetAnual = {}; // { 'CatName|ItemLabel': maxBudget }

  try {
    const snapsMeses = await Promise.all(
      Array.from({ length: 12 }, (_, m) =>
        db.ref(dKey(curY, m)).once('value')
      )
    );
    snapsMeses.forEach(snap => {
      const d = snap.val();
      if (!d || !d.categories) return;
      d.categories.forEach(cat => {
        (cat.items || []).forEach(item => {
          const key = `${cat.name}|${item.label}`;
          const prev = budgetAnual[key] || 0;
          if ((item.budget || 0) > prev) budgetAnual[key] = item.budget;
        });
      });
    });
  } catch(e) {
    console.warn('renderConfigPresupuesto: no se pudieron cargar todos los meses', e);
  }

  const getBudget = (catName, itemLabel, fallback) => {
    const key = `${catName}|${itemLabel}`;
    return budgetAnual[key] || fallback || 0;
  };

  const totalGlobal = D.categories.reduce((s, cat) => {
    return s + planItems(cat).reduce((cs, r) => {
      return cs + getBudget(cat.name, r.label, r.budget);
    }, 0);
  }, 0);

  const cats = D.categories.map((cat, ci) => {
    const items = planItems(cat);
    const total = items.reduce((s, r) => s + getBudget(cat.name, r.label, r.budget), 0);
    const sinDef = total === 0;
    const itemRows = items.map((r, ri) => {
      const tieneMes = r.months && r.months.length;
      const mesBadge = tieneMes
        ? `<span class="cfg-freq-badge" style="border-color:var(--color-primary);color:var(--color-primary);">${MESES_CORTO[r.months[0]]}</span>`
        : '';
      const freqBadge = !tieneMes && r.frecuencia && r.frecuencia !== 'mensual'
        ? `<span class="cfg-freq-badge">${r.frecuencia}</span>` : '';
      const badge = mesBadge || freqBadge;
      const budget = getBudget(cat.name, r.label, r.budget);
      return `
      <div class="cfg-item-row">
        <span class="cfg-item-lbl">${r.label}${badge}</span>
        <span class="cfg-item-right"><span class="cfg-item-val">${budget ? fmt(budget) : '—'}</span></span>
      </div>`;
    }).join('');

    return `
    <div class="cfg-cat-item${sinDef ? ' cfg-cat-undef' : ''}">
      <div class="cfg-cat-hdr" onclick="cfgCatToggle(${ci})">
        <span class="cfg-cat-name">${cat.name}</span>
        <span class="cfg-cat-right">
          <span class="cfg-cat-tot">${sinDef ? 'Sin definir' : fmt(total)}</span>
          <span class="cfg-cat-chev" id="cfg-cat-chev-${ci}">▾</span>
        </span>
      </div>
      <div class="cfg-cat-body cfg-collapsed" id="cfg-cat-body-${ci}">
        ${itemRows}
        <div style="display:flex;justify-content:flex-end;padding-top:6px;">
          <button class="cfg-edit-cat-btn" onclick="abrirModalCategoria(${ci})">✏️ Editar categoría</button>
        </div>
      </div>
    </div>`;
  }).join('');

  el.innerHTML = cats + `
  <div class="cfg-bud-footer">
    <span class="cfg-bud-total">Total: <span class="cfg-mono">${fmt(totalGlobal)}</span></span>
    <button class="cfg-reconf-btn" onclick="abrirConfigPresupuesto()">Reconfigurar 🧹</button>
  </div>`;
}

window.cfgCatToggle = function(ci) {
  const body = document.getElementById('cfg-cat-body-' + ci);
  const chev = document.getElementById('cfg-cat-chev-' + ci);
  if (!body) return;
  body.classList.toggle('cfg-collapsed');
  if (chev) chev.classList.toggle('cfg-chev-closed');
};

// ── MODAL EDITAR CATEGORÍA ────────────────────────────────────────────────────

window.abrirModalCategoria = function(ci) {
  const cat = D && D.categories && D.categories[ci];
  if (!cat) return;
  const items = planItems(cat);
  const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  const freqs = ['mensual','bimestral','trimestral','semestral','anual'];

  const rows = items.map((r, ri) => {
    const tieneMes = r.months && r.months.length;
    const mesActual = tieneMes ? r.months[0] : null;
    const control = tieneMes
      ? `<select class="cfg-freq-sel" style="border-color:var(--color-primary);background:rgba(29,158,117,.07);color:var(--color-primary);"
           onchange="updMes(${ci},${ri},this.value)">
           ${MESES.map((m, idx) => `<option value="${idx}"${idx === mesActual ? ' selected' : ''}>${m}</option>`).join('')}
         </select>`
      : `<select class="cfg-freq-sel" onchange="updFrecuencia(${ci},${ri},this.value)">
           ${freqs.map(f => `<option value="${f}"${(r.frecuencia||'mensual')===f?' selected':''}>${f}</option>`).join('')}
         </select>`;
    return `
    <div class="cfg-modal-row">
      <label class="cfg-modal-lbl">${r.label}</label>
      <div style="display:flex;gap:6px;align-items:center;">
        <div class="onb-iw" style="flex:1;"><span class="onb-pre">$</span>
          <input type="text" inputmode="decimal"
            value="${r.budget || ''}" placeholder="0"
            oninput="updBudget(${ci},${ri},this.value)" />
        </div>
        ${control}
      </div>
    </div>`;
  }).join('');

  const modal = document.getElementById('cfgCatModal');
  if (!modal) return;
  document.getElementById('cfgCatModalTitle').textContent = cat.name;
  document.getElementById('cfgCatModalBody').innerHTML = rows;
  modal.style.display = 'flex';
};

window.cerrarModalCategoria = function() {
  const modal = document.getElementById('cfgCatModal');
  if (modal) modal.style.display = 'none';
  renderConfigPresupuesto();
  if (typeof renderIngresosConfig === 'function') renderIngresosConfig();
};

window.updFrecuencia = function(ci, ri, val) {
  if (D.categories && D.categories[ci] && D.categories[ci].items[ri]) {
    D.categories[ci].items[ri].frecuencia = val;
    recalc(); save();
  }
};

window.updMes = function(ci, ri, val) {
  if (D.categories && D.categories[ci] && D.categories[ci].items[ri]) {
    D.categories[ci].items[ri].months = [parseInt(val)];
    recalc(); save();
  }
};

// ── MODAL INGRESO ADICIONAL (EXTRA) ──────────────────────────────────────────

window.abrirModalIngresoExtra = function(quien) {
  const modal = document.getElementById('cfgIngExtraModal');
  if (!modal) return;
  document.getElementById('cfgIngExtraQuien').value  = quien;
  document.getElementById('cfgIngExtraLabel').value  = '';
  document.getElementById('cfgIngExtraMonto').value  = '';
  document.getElementById('cfgIngExtraMes').value    = String(curM);
  document.getElementById('cfgIngExtraTitulo').textContent = `Ingreso adicional — ${quien.charAt(0).toUpperCase() + quien.slice(1).toLowerCase()}`;
  modal.style.display = 'flex';
};

window.cerrarModalIngresoExtra = function() {
  const modal = document.getElementById('cfgIngExtraModal');
  if (modal) modal.style.display = 'none';
};

window.guardarModalIngresoExtra = async function() {
  const quien = document.getElementById('cfgIngExtraQuien').value;
  const label = (document.getElementById('cfgIngExtraLabel').value || '').trim();
  const val   = parseFloat((document.getElementById('cfgIngExtraMonto').value || '').replace(/[^0-9.]/g,'')) || 0;
  const mes   = parseInt(document.getElementById('cfgIngExtraMes').value);

  if (!label) { toast('⚠️ Escribe un nombre para este ingreso'); return; }
  if (!val)   { toast('⚠️ Ingresa un monto'); return; }

  // Si el mes seleccionado es el mes actual, agregar a D.income directamente
  if (mes === curM) {
    if (!D.income) D.income = [];
    D.income.push({ label, value: val, extra: true, quien, fixed: false });
    recalc(); save();
  } else {
    // Guardar en el nodo del mes seleccionado
    try {
      const snap = await db.ref(dKey(curY, mes)).once('value');
      const data = snap.val() || defD();
      if (!data.income) data.income = [];
      data.income.push({ label, value: val, extra: true, quien, fixed: false });
      await db.ref(dKey(curY, mes)).set(data);
    } catch(e) {
      toast('❌ Error al guardar. Intenta de nuevo.');
      console.error(e); return;
    }
  }

  toast('✅ Ingreso adicional guardado');
  cerrarModalIngresoExtra();
  if (typeof renderIngresosConfig === 'function') renderIngresosConfig();
};

window.eliminarIngresoExtra = function(i) {
  if (!D.income || !D.income[i]) return;
  D.income.splice(i, 1);
  recalc(); save();
  toast('🗑️ Ingreso eliminado');
  if (typeof renderIngresosConfig === 'function') renderIngresosConfig();
};

// ── MODAL EDITAR INGRESO ──────────────────────────────────────────────────────

window.abrirModalIngreso = function(i) {
  if (!D || !D.income || !D.income[i]) return;
  const inc  = D.income[i];
  const modal = document.getElementById('cfgIngModal');
  if (!modal) return;
  document.getElementById('cfgIngModalTitle').textContent = inc.label;
  document.getElementById('cfgIngInput').value = inc.value || '';
  document.getElementById('cfgIngIndex').value = i;
  modal.style.display = 'flex';
};

window.cerrarModalIngreso = function() {
  const modal = document.getElementById('cfgIngModal');
  if (modal) modal.style.display = 'none';
};

window.guardarModalIngreso = function() {
  const i   = parseInt(document.getElementById('cfgIngIndex').value);
  const val = parseFloat((document.getElementById('cfgIngInput').value || '').replace(/[^0-9.]/g,'')) || 0;
  if (D.income && D.income[i] !== undefined) {
    D.income[i].value = val;
    recalc(); save();
    toast('✅ Ingreso actualizado');
  }
  cerrarModalIngreso();
  if (typeof renderIngresosConfig === 'function') renderIngresosConfig();
};

window.updBudget = function(ci, ri, v) {
  const val = parseFloat((v || '').replace(/[^0-9.]/g, '')) || 0;
  if (D.categories && D.categories[ci] && D.categories[ci].items[ri]) {
    D.categories[ci].items[ri].budget = val;
    recalc();
    save();
  }
};

// ── VERIFICAR BANNER AL ARRANCAR ──────────────────────────────────────────────
// Llamado desde app.js en onHogarReady()

async function verificarBannerMiembro2() {
  const cH  = window.HOGAR && window.HOGAR.codigoHogar;
  const uid = firebase.auth(firebase.app('fp')).currentUser?.uid;
  if (!cH || !uid) return;
  try {
    const snapMeta = await db.ref(`hogares/${cH}/meta`).once('value');
    const meta     = snapMeta.val() || {};
    if (!meta.presupuestoBase) return;
    if (meta.creadoPor === uid) return;
    const snapMbr = await db.ref(`hogares/${cH}/miembros/${uid}`).once('value');
    const mbr     = snapMbr.val() || {};
    if (mbr.acuerdoPresupuesto) return;
    const nombreCreador = meta.nombreCreador || 'Tu pareja';
    renderBannerMiembro2(nombreCreador);
  } catch(e) { console.error('verificarBannerMiembro2:', e); }
}

// ── LEER D ACTUAL (para reconfigurar) ─────────────────────────────────────────

function _leerDActual() {
  const g = (catName, itemLabel) => {
    if (!D || !D.categories) return 0;
    const cat  = D.categories.find(c => c.name.includes(catName));
    const item = cat && cat.items.find(it => it.label === itemLabel);
    return (item && item.budget) || 0;
  };
  return {
    inc1:       (D.income && D.income[0] && D.income[0].value) || 0,
    inc2:       (D.income && D.income[1] && D.income[1].value) || 0,
    arriendo:   g('Vivienda',       'Arriendo / Hipoteca'),
    servicios:  g('Vivienda','Agua y Energía') + g('Vivienda','Gas') + g('Vivienda','Internet'),
    transporte: g('Transporte',     'Combustible'),
    cuotaVeh:   g('Transporte',     'Cuota crédito / leasing'),
    mercado:    g('Alimentación',   'Mercado'),
    entrete:    g('Entretenimiento','Salidas'),
    ahorro:     g('Ahorro',         'Ahorro programado'),
    tipoHogar:  (window.HOGAR && window.HOGAR.meta && window.HOGAR.meta.tipoHogar) || '',
    reto:       (window.HOGAR && window.HOGAR.meta && window.HOGAR.meta.reto) || ''
  };
}
