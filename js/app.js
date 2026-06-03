// js/app.js
// Responsabilidad: punto de entrada. Solo orquesta.
// Depende de: config.js, auth.js

document.addEventListener('DOMContentLoaded', function() {
  initLogin();
});

// Callback que auth.js llama cuando el usuario está autenticado.
async function onUserReady(firebaseUser) {
  window.UID = firebaseUser.uid;

  try {
    const codigo = await getCodigoHogar(window.UID);

    if (!codigo) {
      // Usuario sin hogar → onboarding
      mostrarOnboarding();
      return;
    }

    // Hogar existente → cargar y arrancar
    await loadHogar(codigo);
    onHogarReady();

  } catch(e) {
    console.error('Error al verificar hogar:', e);
    alert('Error de conexión. Recarga la página.');
  }
}

// Se llama cuando el hogar está cargado en window.HOGAR.
// Etapa C: migración datos. Etapa D: subMonth(), renderAll(), etc.
function onHogarReady() {
  console.log('Hogar listo:', window.HOGAR.codigoHogar, window.HOGAR.meta.nombre);
  document.getElementById('mainContent').innerHTML =
    `<p style="color:#1D9E75;font-weight:600;">✅ Hogar: ${window.HOGAR.meta.nombre}</p>
     <p style="color:#666;font-size:.9rem;margin-top:.5rem;">Código: ${window.HOGAR.codigoHogar}</p>`;
}
