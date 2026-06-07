// js/app.js
// Responsabilidad: punto de entrada. Solo orquesta.
// Depende de: config.js, auth.js, hogar.js, ui.js, finanzas.js, daily.js, presupuesto.js

document.addEventListener('DOMContentLoaded', function() {
  checkPWA();
  initLogin();
});

// Callback que auth.js llama cuando el usuario está autenticado.
async function onUserReady(firebaseUser) {
  window.UID          = firebaseUser.uid;
  window.CURRENT_USER = { nombre: (firebaseUser.displayName || '').split(' ')[0], email: firebaseUser.email };
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
async function onHogarReady() {
  console.log('Hogar listo:', window.HOGAR.codigoHogar, window.HOGAR.meta.nombre);
  // Parche: escribir nombre en el nodo miembro si no existe todavía
  const uid = window.UID;
  const cH  = window.HOGAR.codigoHogar;
  const mbr = window.HOGAR.miembros && window.HOGAR.miembros[uid];
  if (mbr && !mbr.nombre && window.CURRENT_USER && window.CURRENT_USER.nombre) {
    try {
      await db.ref(`hogares/${cH}/miembros/${uid}/nombre`).set(window.CURRENT_USER.nombre);
      await db.ref(`hogares/${cH}/miembros/${uid}/email`).set(window.CURRENT_USER.email || '');
      window.HOGAR.miembros[uid].nombre = window.CURRENT_USER.nombre;
    } catch(e) { console.warn('parche nombre miembro:', e); }
  }
  if (typeof arrancarFinanzas === 'function') arrancarFinanzas();
  // Verificar banner para miembro 2 (no bloquea el arranque)
  if (typeof verificarBannerMiembro2 === 'function') {
    verificarBannerMiembro2().catch(e => console.warn('banner check:', e));
  }
  // Verificar si el propietario necesita completar el perfil del hogar
  _verificarPerfilCompleto();
}

// Llamado por finanzas.js cuando todo está listo para mostrar la app.
function appLista() {
  updateOfflineUI();
  if (navigator.onLine) { setSS('ok'); syncOfflineQueue(); }
  go('d');
}

// Muestra "Completa tu perfil" si el propietario no ha configurado los flags
function _verificarPerfilCompleto() {
  const hogar   = window.HOGAR;
  const uid     = window.UID;
  if (!hogar || !uid) return;
  const esPropi = hogar.miembros && hogar.miembros[uid] && hogar.miembros[uid].rol === 'propietario';
  if (!esPropi) return;
  const perfilCompleto = hogar.perfil && hogar.perfil.perfilCompleto;
  if (perfilCompleto) return;
  // Mostrar banner de completar perfil
  const banner = document.getElementById('bannerPerfilCompleto');
  if (banner) banner.style.display = 'block';
}
