// js/hogar.js
// Responsabilidad: crear hogar, unirse, leer hogar, UI de onboarding.
// Depende de: config.js (db), auth.js (window.UID)
// Expone: getCodigoHogar(), crearHogar(), unirseHogar(), loadHogar(),
//         mostrarOnboarding(), ocultarOnboarding(), mostrarPaso()

// Variable global del hogar activo — la usan todos los módulos posteriores
window.HOGAR = null; // { codigoHogar, meta, perfil, miembros }

// ── GENERADOR DE CÓDIGO ───────────────────────────────────────────────────────
// Excluye O, 0, I, 1 para evitar confusiones visuales al compartir por WhatsApp
function generarCodigo() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

// ── FIREBASE READS / WRITES ───────────────────────────────────────────────────

async function getCodigoHogar(uid) {
  const snap = await db.ref(`usuarios/${uid}/codigoHogar`).once('value');
  return snap.val(); // string o null
}

async function crearHogar(uid, nombre, tipo) {
  const codigoHogar = generarCodigo();
  const updates = {};
  updates[`hogares/${codigoHogar}/meta`]            = { nombre: nombre.trim(), tipo, creadoPor: uid, creadoEn: Date.now() };
  updates[`hogares/${codigoHogar}/miembros/${uid}`] = { rol: 'propietario' };
  updates[`hogares/${codigoHogar}/perfil`]          = { _init: true };
  updates[`usuarios/${uid}/codigoHogar`]            = codigoHogar;
  await db.ref().update(updates);
  return codigoHogar;
}

async function unirseHogar(uid, codigoHogar) {
  const codigo = codigoHogar.trim().toUpperCase();
  const snap = await db.ref(`hogares/${codigo}/meta`).once('value');
  if (!snap.exists()) throw new Error('Código incorrecto. Verifica con quien te lo compartió.');
  const miembroSnap = await db.ref(`hogares/${codigo}/miembros/${uid}`).once('value');
  if (miembroSnap.exists()) {
    await db.ref(`usuarios/${uid}/codigoHogar`).set(codigo);
    return { ok: true, meta: snap.val(), yaEraMiembro: true };
  }
  const updates = {};
  updates[`hogares/${codigo}/miembros/${uid}`] = { rol: 'miembro' };
  updates[`usuarios/${uid}/codigoHogar`]       = codigo;
  await db.ref().update(updates);
  return { ok: true, meta: snap.val() };
}

async function loadHogar(codigoHogar) {
  const snap = await db.ref(`hogares/${codigoHogar}`).once('value');
  if (!snap.exists()) throw new Error('Hogar no encontrado: ' + codigoHogar);
  const data = snap.val();
  window.HOGAR = {
    codigoHogar,
    meta:     data.meta     || {},
    perfil:   data.perfil   || {},
    miembros: data.miembros || {}
  };
  return window.HOGAR;
}

// ── UI DE ONBOARDING ──────────────────────────────────────────────────────────

function mostrarOnboarding() {
  document.getElementById('hogarScreen').style.display = 'flex';
  mostrarPaso('paso-decision');
}

function ocultarOnboarding() {
  document.getElementById('hogarScreen').style.display = 'none';
}

function mostrarPaso(id) {
  ['paso-decision', 'paso-crear', 'paso-unirse', 'paso-confirmacion'].forEach(p => {
    const el = document.getElementById(p);
    if (el) el.style.display = (p === id) ? 'block' : 'none';
  });
}

function hogarError(id, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.style.display = msg ? 'block' : 'none';
}

// ── HANDLERS (llamados desde onclick en el HTML) ──────────────────────────────

window.onbCrear    = function() { mostrarPaso('paso-crear');  document.getElementById('ob-nombre').focus(); };
window.onbUnirse   = function() { mostrarPaso('paso-unirse'); document.getElementById('ob-codigo').focus(); };
window.mostrarPaso = mostrarPaso;

window.onbSubmitCrear = async function() {
  const nombre = document.getElementById('ob-nombre').value.trim();
  const tipo   = document.querySelector('input[name="ob-tipo"]:checked')?.value;
  const btn    = document.getElementById('btn-crear-hogar');
  if (!nombre) { hogarError('ob-error-crear', 'Ingresa un nombre para tu hogar.'); return; }
  if (!tipo)   { hogarError('ob-error-crear', 'Selecciona el tipo de hogar.'); return; }
  hogarError('ob-error-crear', '');
  btn.disabled = true; btn.textContent = 'Creando...';
  try {
    const codigo = await crearHogar(window.UID, nombre, tipo);
    document.getElementById('conf-nombre').textContent = nombre;
    document.getElementById('conf-codigo').textContent = codigo;
    mostrarPaso('paso-confirmacion');
  } catch(e) {
    hogarError('ob-error-crear', 'Error al crear el hogar. Intenta de nuevo.');
    console.error(e);
  } finally {
    btn.disabled = false; btn.textContent = 'Crear hogar';
  }
};

window.onbSubmitUnirse = async function() {
  const codigo = document.getElementById('ob-codigo').value.trim().toUpperCase();
  const btn    = document.getElementById('btn-unirse-hogar');
  if (!codigo)             { hogarError('ob-error-unirse', 'Ingresa el código del hogar.'); return; }
  if (codigo.length !== 6) { hogarError('ob-error-unirse', 'El código debe tener 6 caracteres.'); return; }
  hogarError('ob-error-unirse', '');
  btn.disabled = true; btn.textContent = 'Verificando...';
  try {
    await unirseHogar(window.UID, codigo);
    await loadHogar(codigo);
    ocultarOnboarding();
    if (typeof onHogarReady === 'function') onHogarReady();
  } catch(e) {
    hogarError('ob-error-unirse', e.message || 'Error al unirse. Intenta de nuevo.');
    console.error(e);
  } finally {
    btn.disabled = false; btn.textContent = 'Unirme';
  }
};

window.onbConfirmado = async function() {
  const codigo = document.getElementById('conf-codigo').textContent;
  try {
    await loadHogar(codigo);
    ocultarOnboarding();
    if (typeof onHogarReady === 'function') onHogarReady();
  } catch(e) {
    console.error(e);
    alert('Error al cargar el hogar. Recarga la página.');
  }
};

window.onbCopiarCodigo = function() {
  const codigo = document.getElementById('conf-codigo').textContent;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(codigo)
      .then(() => alert('Código copiado: ' + codigo))
      .catch(() => alert('Tu código: ' + codigo));
  } else {
    alert('Tu código: ' + codigo);
  }
};
