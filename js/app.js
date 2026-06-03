// js/app.js
// Responsabilidad: punto de entrada. Solo orquesta.
// Depende de: config.js, auth.js

document.addEventListener('DOMContentLoaded', function() {
  initLogin();
});

// Callback que auth.js llama cuando el usuario está autenticado.
// Se amplía en cada etapa posterior.
function onUserReady(firebaseUser) {
  console.log('Usuario autenticado:', firebaseUser.uid, firebaseUser.displayName);
  // Etapa B: loadPerfil(firebaseUser.uid)
  // Etapa D: subMonth(), renderAll(), etc.
}
