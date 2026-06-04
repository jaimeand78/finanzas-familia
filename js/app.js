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

  if (navigator.onLine) {
    setSS('ok');
    syncOfflineQueue();
  }

  go('d');

  // Etapa E
  if (typeof verificarPresupuestoBase === 'function') {
    verificarPresupuestoBase();
  }

  if (typeof verificarBannerMiembro2 === 'function') {
    verificarBannerMiembro2();
  }
}
