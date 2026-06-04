// js/presupuesto.js
// Responsabilidad: onboarding Presupuesto Base (5 pantallas + resumen)
//                  y sección Config — Presupuesto Base.
// Depende de: config.js (db), utils.js, firebase-paths.js, finanzas.js (D, curM, defD)
// v2.2 — Etapa E

// ── ESTADO ONBOARDING ─────────────────────────────────────────────────────────

let _onbStep   = 1;  // pantalla actual: 1-5, 6 = resumen
let _onbData   = {}; // datos recopilados durante el onboarding

// ── PUNTO DE ENTRADA ─────────────────────────────────────────────────────────
// Llamar desde hogar.js o app.js cuando el hogar no tiene presupuesto base aún.
// También llamar desde el botón "Configurar Presupuesto Base" en Config.

function iniciarOnboarding() {
  _onbStep = 1;
  _onbData = {};
  renderOnbStep();
  document.getElementById('presupuestoModal').style.display = 'flex';
}

function cerrarOnboarding() {
  document.getElementById('presupuestoModal').style.display = 'none';
}

// Llamar desde Config para editar presupuesto existente
function abrirConfigPresupuesto() {
  // Cargar valores actuales de D en _onbData para edición
  _onbData = _leerDParaOnb();
  renderConfigPresupuesto();
  document.getElementById('presupuestoModal').style.display = 'flex';
}

// ── RENDER ONBOARDING ─────────────────────────────────────────────────────────

function renderOnbStep() {
  const modal = document.getElementById('presupuestoModal');
  if (!modal) return;
  const inner = modal.querySelector('.onb-inner') || modal;

  switch (_onbStep) {
    case 1: inner.innerHTML = _tplPantalla1(); break;
    case 2: inner.innerHTML = _tplPantalla2(); break;
    case 3: inner.innerHTML = _tplPantalla3(); break;
    case 4: inner.innerHTML = _tplPantalla4(); break;
    case 5: inner.innerHTML = _tplPantalla5(); break;
    case 6: inner.innerHTML = _tplResumen();   break;
    default: cerrarOnboarding();
  }
}

// ── PANTALLA 1 — ¿Cómo es su hogar? ─────────────────────────────────────────
// No saltable. Personaliza toda la experiencia.

function _tplPantalla1() {
  return `
  <div class="onb-page" id="onbP1">
    <div class="onb-progress">${_progressBar(1)}</div>
    <div class="onb-body">
      <div class="onb-emoji">🏠</div>
      <h2 class="onb-title">¿Cómo es su hogar?</h2>
      <p class="onb-sub">Queremos entender cómo están organizados para mostrarte lo que tiene sentido para ustedes.</p>
      <div class="onb-options">
        <button class="onb-opt ${_onbData.tipoHogar === 'soltero' ? 'sel' : ''}"
          onclick="onbSelTipoHogar('soltero')">
          <span class="onb-opt-icon">🧍</span>
          <span class="onb-opt-label">Solo</span>
          <span class="onb-opt-sub">Manejo mis finanzas</span>
        </button>
        <button class="onb-opt ${_onbData.tipoHogar === 'pareja' ? 'sel' : ''}"
          onclick="onbSelTipoHogar('pareja')">
          <span class="onb-opt-icon">👫</span>
          <span class="onb-opt-label">En pareja</span>
          <span class="onb-opt-sub">Sin hijos por ahora</span>
        </button>
        <button class="onb-opt ${_onbData.tipoHogar === 'familia' ? 'sel' : ''}"
          onclick="onbSelTipoHogar('familia')">
          <span class="onb-opt-icon">👨‍👩‍👧</span>
          <span class="onb-opt-label">Familia</span>
          <span class="onb-opt-sub">Con hijos</span>
        </button>
        <button class="onb-opt ${_onbData.tipoHogar === 'mixto' ? 'sel' : ''}"
          onclick="onbSelTipoHogar('mixto')">
          <span class="onb-opt-icon">🏡</span>
          <span class="onb-opt-label">Mixto</span>
          <span class="onb-opt-sub">Comparto gastos</span>
        </button>
      </div>
    </div>
    <div class="onb-footer">
      <button class="onb-btn-primary" onclick="onbNext()" ${!_onbData.tipoHogar ? 'disabled' : ''}>
        Continuar →
      </button>
    </div>
  </div>`;
}

window.onbSelTipoHogar = function(tipo) {
  _onbData.tipoHogar = tipo;
  renderOnbStep();
};

// ── PANTALLA 2 — ¿Cuál es su mayor reto? ─────────────────────────────────────
// Saltable. Personaliza tono e insights.

function _tplPantalla2() {
  const opts = [
    { id:'invisible', icon:'🌫️', label:'No sé en qué se va el dinero', sub:'El mes acaba y no queda nada' },
    { id:'acuerdo',   icon:'🤝', label:'No nos ponemos de acuerdo', sub:'Cada uno ve el dinero diferente' },
    { id:'justo',     icon:'😓', label:'Siempre llego muy justo', sub:'Siempre falta un poco' },
    { id:'ahorro',    icon:'🏦', label:'Quiero ahorrar pero no logro', sub:'La plata siempre se gasta primero' },
  ];
  return `
  <div class="onb-page" id="onbP2">
    <div class="onb-progress">${_progressBar(2)}</div>
    <div class="onb-body">
      <div class="onb-emoji">💭</div>
      <h2 class="onb-title">¿Cuál es su mayor reto?</h2>
      <p class="onb-sub">Esto nos ayuda a mostrarte lo que más importa para su situación.</p>
      <div class="onb-options">
        ${opts.map(o => `
        <button class="onb-opt ${_onbData.reto === o.id ? 'sel' : ''}"
          onclick="onbSelReto('${o.id}')">
          <span class="onb-opt-icon">${o.icon}</span>
          <span class="onb-opt-label">${o.label}</span>
          <span class="onb-opt-sub">${o.sub}</span>
        </button>`).join('')}
      </div>
    </div>
    <div class="onb-footer">
      <button class="onb-btn-skip" onclick="onbSkip()">Prefiero no decir</button>
      <button class="onb-btn-primary" onclick="onbNext()" ${!_onbData.reto ? 'disabled' : ''}>
        Continuar →
      </button>
    </div>
  </div>`;
}

window.onbSelReto = function(reto) {
  _onbData.reto = reto;
  renderOnbStep();
};

// ── PANTALLA 3 — ¿Con cuánto cuentan? ────────────────────────────────────────
// Saltable. Ingreso fijo + ingreso adicional opcional.

function _tplPantalla3() {
  const perfil  = window.PERFIL || {};
  const miembros = Object.values(perfil.miembros || {}).filter(m => m.rol === 'adulto' && m.nombre);
  // Mostrar hasta 2 campos de ingreso, uno por miembro
  const ingrLabel1 = miembros[0] ? 'Ingreso de ' + miembros[0].nombre : 'Ingreso principal';
  const ingrLabel2 = miembros[1] ? 'Ingreso de ' + miembros[1].nombre : 'Segundo ingreso';

  return `
  <div class="onb-page" id="onbP3">
    <div class="onb-progress">${_progressBar(3)}</div>
    <div class="onb-body">
      <div class="onb-emoji">💵</div>
      <h2 class="onb-title">¿Con cuánto cuentan este mes?</h2>
      <p class="onb-sub">Solo el total que llega al hogar. Los detalles los ajustan después.</p>
      <div class="onb-fields">
        <div class="onb-field">
          <label>${ingrLabel1}</label>
          <div class="onb-input-wrap">
            <span class="onb-prefix">$</span>
            <input type="text" inputmode="decimal" id="onbInc1"
              value="${_onbData.inc1 || ''}"
              placeholder="0"
              oninput="_onbData.inc1 = parseFloat(this.value.replace(/[^0-9.]/g,''))||0"/>
          </div>
        </div>
        <div class="onb-field">
          <label>${ingrLabel2} <span class="onb-opt-badge">opcional</span></label>
          <div class="onb-input-wrap">
            <span class="onb-prefix">$</span>
            <input type="text" inputmode="decimal" id="onbInc2"
              value="${_onbData.inc2 || ''}"
              placeholder="0"
              oninput="_onbData.inc2 = parseFloat(this.value.replace(/[^0-9.]/g,''))||0"/>
          </div>
        </div>
      </div>
    </div>
    <div class="onb-footer">
      <button class="onb-btn-skip" onclick="onbSkip()">Saltar por ahora</button>
      <button class="onb-btn-primary" onclick="onbNext()">Continuar →</button>
    </div>
  </div>`;
}

// ── PANTALLA 4 — Lo que sí o sí hay que pagar ─────────────────────────────────
// Saltable. Gastos fijos: arriendo, servicios, transporte.

function _tplPantalla4() {
  const perfil   = window.PERFIL || {};
  const hasVehFin = (perfil.vehiculos || []).some(v => v.financiado);

  return `
  <div class="onb-page" id="onbP4">
    <div class="onb-progress">${_progressBar(4)}</div>
    <div class="onb-body">
      <div class="onb-emoji">🏠</div>
      <h2 class="onb-title">Lo que sí o sí hay que pagar</h2>
      <p class="onb-sub">Estos gastos son fijos — aparecen todos los meses sin falta.</p>
      <div class="onb-fields">
        <div class="onb-field">
          <label>🏠 Arriendo o cuota del apartamento</label>
          <div class="onb-input-wrap">
            <span class="onb-prefix">$</span>
            <input type="text" inputmode="decimal" id="onbArriendo"
              value="${_onbData.arriendo || ''}"
              placeholder="0"
              oninput="_onbData.arriendo = parseFloat(this.value.replace(/[^0-9.]/g,''))||0"/>
          </div>
        </div>
        <div class="onb-field">
          <label>💡 Servicios del hogar <span class="onb-opt-badge">agua, gas, internet</span></label>
          <div class="onb-input-wrap">
            <span class="onb-prefix">$</span>
            <input type="text" inputmode="decimal" id="onbServicios"
              value="${_onbData.servicios || ''}"
              placeholder="0"
              oninput="_onbData.servicios = parseFloat(this.value.replace(/[^0-9.]/g,''))||0"/>
          </div>
        </div>
        <div class="onb-field">
          <label>🚗 Transporte del mes</label>
          <div class="onb-input-wrap">
            <span class="onb-prefix">$</span>
            <input type="text" inputmode="decimal" id="onbTransporte"
              value="${_onbData.transporte || ''}"
              placeholder="0"
              oninput="_onbData.transporte = parseFloat(this.value.replace(/[^0-9.]/g,''))||0"/>
          </div>
        </div>
        ${hasVehFin ? `
        <div class="onb-field">
          <label>🚗 Cuota crédito del vehículo</label>
          <div class="onb-input-wrap">
            <span class="onb-prefix">$</span>
            <input type="text" inputmode="decimal" id="onbCuotaVeh"
              value="${_onbData.cuotaVeh || ''}"
              placeholder="0"
              oninput="_onbData.cuotaVeh = parseFloat(this.value.replace(/[^0-9.]/g,''))||0"/>
          </div>
        </div>` : ''}
      </div>
    </div>
    <div class="onb-footer">
      <button class="onb-btn-skip" onclick="onbSkip()">Saltar por ahora</button>
      <button class="onb-btn-primary" onclick="onbNext()">Continuar →</button>
    </div>
  </div>`;
}

// ── PANTALLA 5 — Lo que varía ─────────────────────────────────────────────────
// Saltable. Mercado, entretenimiento, ahorro.

function _tplPantalla5() {
  return `
  <div class="onb-page" id="onbP5">
    <div class="onb-progress">${_progressBar(5)}</div>
    <div class="onb-body">
      <div class="onb-emoji">🛒</div>
      <h2 class="onb-title">Lo que varía según el mes</h2>
      <p class="onb-sub">Un estimado está bien. Lo ajustan con el tiempo.</p>
      <div class="onb-fields">
        <div class="onb-field">
          <label>🍽️ Mercado y comida del hogar</label>
          <div class="onb-input-wrap">
            <span class="onb-prefix">$</span>
            <input type="text" inputmode="decimal" id="onbMercado"
              value="${_onbData.mercado || ''}"
              placeholder="0"
              oninput="_onbData.mercado = parseFloat(this.value.replace(/[^0-9.]/g,''))||0"/>
          </div>
        </div>
        <div class="onb-field">
          <label>🎬 Entretenimiento y salidas</label>
          <div class="onb-input-wrap">
            <span class="onb-prefix">$</span>
            <input type="text" inputmode="decimal" id="onbEntrete"
              value="${_onbData.entrete || ''}"
              placeholder="0"
              oninput="_onbData.entrete = parseFloat(this.value.replace(/[^0-9.]/g,''))||0"/>
          </div>
        </div>
        <div class="onb-field">
          <label>💰 ¿Cuánto quieren guardar?</label>
          <div class="onb-input-wrap">
            <span class="onb-prefix">$</span>
            <input type="text" inputmode="decimal" id="onbAhorro"
              value="${_onbData.ahorro || ''}"
              placeholder="0"
              oninput="_onbData.ahorro = parseFloat(this.value.replace(/[^0-9.]/g,''))||0"/>
          </div>
        </div>
      </div>
    </div>
    <div class="onb-footer">
      <button class="onb-btn-skip" onclick="onbSkip()">Saltar por ahora</button>
      <button class="onb-btn-primary" onclick="onbNext()">Ver resumen →</button>
    </div>
  </div>`;
}

// ── PANTALLA 6 — RESUMEN ──────────────────────────────────────────────────────

function _tplResumen() {
  const inc   = (_onbData.inc1 || 0) + (_onbData.inc2 || 0);
  const gastos = (_onbData.arriendo || 0)
               + (_onbData.servicios || 0)
               + (_onbData.transporte || 0)
               + (_onbData.cuotaVeh || 0)
               + (_onbData.mercado || 0)
               + (_onbData.entrete || 0)
               + (_onbData.ahorro || 0);
  const libre = inc - gastos;
  const pct   = inc > 0 ? Math.round((gastos / inc) * 100) : 0;

  const insight = _getInsight(inc, gastos, libre, pct);
  const invMsg  = _tplInvitacion();

  return `
  <div class="onb-page" id="onbResumen">
    <div class="onb-body onb-resumen">
      <div class="onb-emoji">✅</div>
      <h2 class="onb-title">Así queda el mes</h2>
      ${inc > 0 ? `
      <div class="onb-res-cards">
        <div class="onb-res-card">
          <span class="onb-res-label">Ingresan</span>
          <span class="onb-res-val g">${fmt(inc)}</span>
        </div>
        <div class="onb-res-card">
          <span class="onb-res-label">Se van</span>
          <span class="onb-res-val">${fmt(gastos)}</span>
        </div>
        <div class="onb-res-card">
          <span class="onb-res-label">Les queda libre</span>
          <span class="onb-res-val ${libre >= 0 ? 'g' : 'r'}">${fmt(libre)}</span>
        </div>
      </div>
      ${pct > 0 ? `<div class="onb-barra-wrap">
        <div class="onb-barra-fill" style="width:${Math.min(pct,100)}%;background:${pct>100?'#D85A30':pct>85?'#BA7517':'#1D9E75'};"></div>
        <span class="onb-barra-pct">${pct}% comprometido</span>
      </div>` : ''}
      <p class="onb-insight">${insight}</p>` :
      `<p class="onb-sub">Saltaron los números — pueden configurarlos en cualquier momento desde Ajustes.</p>`}
      ${invMsg}
    </div>
    <div class="onb-footer">
      <button class="onb-btn-primary" onclick="guardarPresupuestoBase()">
        Guardar y empezar →
      </button>
    </div>
  </div>`;
}

function _getInsight(inc, gastos, libre, pct) {
  if (inc === 0) return '';
  const reto = _onbData.reto || '';
  if (pct > 100) return '⚠️ Los gastos planeados superan los ingresos. Ajusten alguna categoría antes de guardar.';
  if (pct > 90)  return '📊 Están muy ajustados. Cualquier gasto extra puede desequilibrar el mes.';
  if (reto === 'ahorro' && (_onbData.ahorro || 0) === 0) return '💡 Pusieron ahorro en cero — ¡esse es el primer paso para cambiarlo! Configúrenlo aunque sea con poco.';
  if (reto === 'invisible') return '👁️ Ahora verán exactamente en qué se va el dinero cada día.';
  if (libre > inc * 0.2) return '🎉 Tienen ' + pct + '% comprometido. Buen margen para imprevistos.';
  return '📋 Presupuesto base listo. Regístren los gastos diarios para ver la foto completa.';
}

function _tplInvitacion() {
  // Solo mostrar si hay un solo miembro en el hogar
  const miembros = Object.values((window.PERFIL || {}).miembros || {});
  if (miembros.length > 1) return '';
  return `
  <div class="onb-invitacion">
    <p>¿Quieres invitar a tu pareja para que revise esto juntos?</p>
    <div class="onb-inv-btns">
      <button class="onb-btn-sec" onclick="_verCodigoInvitacion()">Enviar invitación</button>
      <button class="onb-btn-ghost" onclick="_cerrarInvitacion()">Lo hago después</button>
    </div>
  </div>`;
}

window._verCodigoInvitacion = function() {
  const codigo = window.HOGAR && window.HOGAR.codigoHogar;
  if (codigo) toast('📋 Código del hogar: ' + codigo + ' · Compártelo con tu pareja');
};
window._cerrarInvitacion = function() {
  const inv = document.querySelector('.onb-invitacion');
  if (inv) inv.style.display = 'none';
};

// ── NAVEGACIÓN ONBOARDING ─────────────────────────────────────────────────────

window.onbNext = function() {
  // Leer campos del step actual antes de avanzar
  _leerCamposStep(_onbStep);
  _onbStep++;
  if (_onbStep > 5) _onbStep = 6; // resumen
  renderOnbStep();
};

window.onbSkip = function() {
  _onbStep++;
  if (_onbStep > 5) _onbStep = 6;
  renderOnbStep();
};

window.onbBack = function() {
  if (_onbStep > 1) { _onbStep--; renderOnbStep(); }
};

// Leer inputs del DOM antes de cambiar de pantalla
function _leerCamposStep(step) {
  const g = id => parseFloat((document.getElementById(id)?.value || '').replace(/[^0-9.]/g, '')) || 0;
  if (step === 3) { _onbData.inc1 = g('onbInc1'); _onbData.inc2 = g('onbInc2'); }
  if (step === 4) {
    _onbData.arriendo   = g('onbArriendo');
    _onbData.servicios  = g('onbServicios');
    _onbData.transporte = g('onbTransporte');
    _onbData.cuotaVeh   = g('onbCuotaVeh');
  }
  if (step === 5) {
    _onbData.mercado = g('onbMercado');
    _onbData.entrete = g('onbEntrete');
    _onbData.ahorro  = g('onbAhorro');
  }
}

// ── GUARDAR PRESUPUESTO BASE ──────────────────────────────────────────────────
// Toma _onbData, lo aplica a D (el estado de finanzas.js) y guarda en Firebase.

window.guardarPresupuestoBase = async function() {
  _aplicarOnbDataAD();

  // Marcar hogar con flag presupuestoBase = true
  const cH = window.HOGAR && window.HOGAR.codigoHogar;
  if (cH) {
    try {
      await db.ref(`hogares/${cH}/meta/presupuestoBase`).set(true);
      if (_onbData.tipoHogar) await db.ref(`hogares/${cH}/meta/tipoHogar`).set(_onbData.tipoHogar);
      if (_onbData.reto) await db.ref(`hogares/${cH}/meta/reto`).set(_onbData.reto);
    } catch(e) { console.error('guardarPresupuestoBase meta:', e); }
  }

  save(); // finanzas.js guarda D completo en Firebase
  cerrarOnboarding();
  toast('✅ Presupuesto base guardado');

  // Actualizar pantalla principal
  if (typeof renderAll === 'function') renderAll();
};

// Aplica los valores de _onbData a D.income y D.categories
function _aplicarOnbDataAD() {
  if (!D.categories) D = defD();

  // Ingresos
  const perfil   = window.PERFIL || {};
  const miembros = Object.values(perfil.miembros || {}).filter(m => m.rol === 'adulto' && m.nombre);

  D.income = [];
  if (_onbData.inc1) {
    const lbl = miembros[0] ? 'Ingreso ' + miembros[0].nombre : 'Ingreso principal';
    D.income.push({ label: lbl, value: _onbData.inc1, fixed: true });
  }
  if (_onbData.inc2) {
    const lbl = miembros[1] ? 'Ingreso ' + miembros[1].nombre : 'Segundo ingreso';
    D.income.push({ label: lbl, value: _onbData.inc2, fixed: true });
  }
  if (!D.income.length) D.income = buildIncomeFromPerfil(perfil);
  D.income.push({ label: 'Otros ingresos', value: 0, fixed: false });

  // Helper para actualizar budget de un ítem en una categoría
  const setBudget = (catName, itemLabel, val) => {
    if (!val) return;
    const cat = D.categories.find(c => c.name === catName || c.name.includes(catName));
    if (!cat) return;
    const item = cat.items.find(it => it.label === itemLabel);
    if (item) { item.budget = val; item.value = item.fixed ? val : item.value; }
  };

  // Aplicar valores del onboarding a los ítems del presupuesto
  if (_onbData.arriendo)   setBudget('Vivienda',        'Arriendo / Hipoteca',  _onbData.arriendo);
  if (_onbData.servicios) {
    // Distribuir entre agua, gas e internet (estimado equitativo)
    const s3 = Math.round(_onbData.servicios / 3);
    setBudget('Vivienda', 'Agua y Energía', s3);
    setBudget('Vivienda', 'Gas',            s3);
    setBudget('Vivienda', 'Internet',       _onbData.servicios - s3 * 2);
  }
  if (_onbData.transporte) setBudget('Transporte',      'Combustible',          _onbData.transporte);
  if (_onbData.cuotaVeh)   setBudget('Transporte',      'Cuota crédito / leasing', _onbData.cuotaVeh);
  if (_onbData.mercado)    setBudget('Alimentación',    'Mercado',              _onbData.mercado);
  if (_onbData.entrete)    setBudget('Entretenimiento', 'Salidas',              _onbData.entrete);
  if (_onbData.ahorro)     setBudget('Ahorro',          'Ahorro programado',    _onbData.ahorro);
}

// ── BANNER MIEMBRO 2 — "¿Estás de acuerdo?" ──────────────────────────────────
// Mostrar cuando un miembro entra por primera vez y el presupuesto ya fue configurado.

function renderBannerMiembro2(nombreCreador) {
  const banner = document.getElementById('bannerMiembro2');
  if (!banner) return;
  banner.style.display = 'block';
  banner.innerHTML = `
  <div class="banner-m2">
    <div class="banner-m2-txt">
      <strong>${nombreCreador}</strong> configuró el presupuesto base.
      ¿Estás de acuerdo con estos números?
    </div>
    <div class="banner-m2-btns">
      <button class="onb-btn-primary sm" onclick="bannerAcuerdo()">Se ve bien 👍</button>
      <button class="onb-btn-sec sm" onclick="bannerAjuste()">Tengo un ajuste</button>
    </div>
  </div>`;
}

window.bannerAcuerdo = async function() {
  const cH = window.HOGAR && window.HOGAR.codigoHogar;
  if (cH && firebase.auth(firebase.app('fp')).currentUser) {
    const uid = firebase.auth(firebase.app('fp')).currentUser.uid;
    await db.ref(`hogares/${cH}/miembros/${uid}/acuerdoPresupuesto`).set(true);
  }
  const banner = document.getElementById('bannerMiembro2');
  if (banner) banner.style.display = 'none';
  toast('✅ Perfecto, ¡están sincronizados!');
};

window.bannerAjuste = function() {
  // Redirigir a Config para editar presupuesto
  const banner = document.getElementById('bannerMiembro2');
  if (banner) banner.style.display = 'none';
  if (typeof go === 'function') go('c'); // Tab Config
  toast('💬 Ajusta los valores en Ajustes > Presupuesto Base');
};

// ── CONFIG — PRESUPUESTO BASE ─────────────────────────────────────────────────
// Renderiza la sección de edición del presupuesto base dentro del tab Config.

function renderConfigPresupuesto() {
  const cont = document.getElementById('configPresupuesto');
  if (!cont) return;

  cont.innerHTML = `
  <div class="config-section">
    <div class="config-sec-hdr">
      <span>🧱 Presupuesto Base</span>
      <button class="btn-sm" onclick="iniciarOnboarding()">✏️ Reconfigurar</button>
    </div>
    <p class="config-sec-desc">Cuánto planean gastar en cada categoría. Pueden ajustar ítem por ítem.</p>
    ${_renderConfigCats()}
  </div>`;
}

function _renderConfigCats() {
  if (!D.categories) return '<p class="empty">Sin presupuesto configurado aún.</p>';
  return D.categories.map((cat, ci) => {
    const items = planItems(cat);
    const total = items.reduce((s, r) => s + (r.budget || 0), 0);
    return `
    <div class="config-cat">
      <div class="config-cat-hdr">
        <span>${cat.name}</span>
        <span class="config-cat-total">${total > 0 ? fmt(total) : 'Sin definir'}</span>
      </div>
      ${items.map((r, ri) => {
        const provMes = calcPresupuestoBase(r, curM);
        return `
        <div class="config-item-row">
          <span class="config-item-lbl">${r.label}${r.frecuencia && r.frecuencia !== 'mensual' ? `<span class="mbadge">${r.frecuencia}</span>` : ''}</span>
          <div class="config-item-inp-wrap">
            <span class="onb-prefix">$</span>
            <input type="text" inputmode="decimal"
              value="${r.budget || ''}"
              placeholder="0"
              oninput="updBudget(${ci},${ri},this.value)"/>
          </div>
          ${provMes > 0 && r.frecuencia !== 'mensual' ? `<span class="config-item-prov">≈${fmt(provMes)}/mes</span>` : ''}
        </div>`;
      }).join('')}
    </div>`;
  }).join('');
}

// Actualizar budget de un ítem desde Config
window.updBudget = function(ci, ri, v) {
  const val = parseFloat(v.replace ? v.replace(/[^0-9.]/g, '') : v) || 0;
  if (D.categories && D.categories[ci] && D.categories[ci].items[ri]) {
    D.categories[ci].items[ri].budget = val;
    // Recalcular total de la categoría en el header sin re-renderizar todo
    recalc();
    save();
  }
};

// ── HELPER — LEER D PARA ONBOARDING (modo edición) ───────────────────────────

function _leerDParaOnb() {
  const get = (catName, itemLabel) => {
    if (!D.categories) return 0;
    const cat  = D.categories.find(c => c.name === catName || c.name.includes(catName));
    const item = cat && cat.items.find(it => it.label === itemLabel);
    return (item && item.budget) || 0;
  };
  return {
    inc1:       (D.income && D.income[0] && D.income[0].value) || 0,
    inc2:       (D.income && D.income[1] && D.income[1].value) || 0,
    arriendo:   get('Vivienda', 'Arriendo / Hipoteca'),
    servicios:  (get('Vivienda','Agua y Energía') + get('Vivienda','Gas') + get('Vivienda','Internet')),
    transporte: get('Transporte', 'Combustible'),
    cuotaVeh:   get('Transporte', 'Cuota crédito / leasing'),
    mercado:    get('Alimentación', 'Mercado'),
    entrete:    get('Entretenimiento', 'Salidas'),
    ahorro:     get('Ahorro', 'Ahorro programado'),
    tipoHogar:  (window.HOGAR && window.HOGAR.tipoHogar) || '',
    reto:       (window.HOGAR && window.HOGAR.reto) || ''
  };
}

// ── BARRA DE PROGRESO ─────────────────────────────────────────────────────────

function _progressBar(step) {
  const total = 5;
  const dots  = Array.from({ length: total }, (_, i) =>
    `<div class="onb-dot ${i + 1 <= step ? 'act' : ''}"></div>`
  ).join('');
  return `<div class="onb-prog">${dots}<span class="onb-step-lbl">${step} de ${total}</span></div>`;
}
