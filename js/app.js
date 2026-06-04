// js/app.js
// Responsabilidad: punto de entrada. Solo orquesta.
// Depende de: config.js, auth.js, hogar.js, ui.js, finanzas.js, daily.js
 
document.addEventListener('DOMContentLoaded', function() {
  checkPWA();
  initLogin();
});
 
// Callback que auth.js llama cuando el usuario está autenticado.
async function onUserReady(firebaseUser) {
  window.UID = firebaseUser.uid;
  try {
    const codigo = await getCodigoHogar(window.UID);
    if (!codigo) { mostrarOnboarding(); return; }
    await loadHogar(codigo);
    onHogarReady();
  } catch(e) {
    console.error('Error al verificar hogar:', e);
    alert('Error de conexión. Recarga la página.');
  }
}
 
// Se llama cuando el hogar está cargado en window.HOGAR.
function onHogarReady() {
  console.log('Hogar listo:', window.HOGAR.codigoHogar, window.HOGAR.meta.nombre);
  if (typeof arrancarFinanzas === 'function') arrancarFinanzas();
}
 
// Llamado por finanzas.js cuando todo está listo para mostrar la app.
function appLista() {
  updateOfflineUI();
  if (navigator.onLine) { setSS('ok'); syncOfflineQueue(); }
  go('d');
}

// Después de cargar el hogar, verificar si tiene presupuesto base
async function verificarPresupuestoBase() {
  const cH = window.HOGAR && window.HOGAR.codigoHogar;
  if (!cH) return;
  const snap = await db.ref(`hogares/${cH}/meta/presupuestoBase`).once('value');
  if (!snap.val()) {
    // Primer uso — lanzar onboarding después de un delay
    setTimeout(() => iniciarOnboarding(), 1200);
  }
}

// Verificar si es miembro 2 en primera visita
async function verificarBannerMiembro2() {
  const cH  = window.HOGAR && window.HOGAR.codigoHogar;
  const uid = firebase.auth(firebase.app('fp')).currentUser?.uid;
  if (!cH || !uid) return;

  const snapMeta    = await db.ref(`hogares/${cH}/meta`).once('value');
  const meta        = snapMeta.val() || {};
  const snapMiembro = await db.ref(`hogares/${cH}/miembros/${uid}`).once('value');
  const miembro     = snapMiembro.val() || {};

  // Es miembro 2 si no es el creador Y no ha dado acuerdo Y hay presupuesto base
  if (meta.presupuestoBase && meta.creadoPor !== uid && !miembro.acuerdoPresupuesto) {
    const nombreCreador = meta.nombreCreador || 'Tu pareja';
    renderBannerMiembro2(nombreCreador);
  }
}