// js/auth.js
// Responsabilidad: Firebase Auth Google. Sesión y estado de usuario.
// Depende de: config.js (auth)
// Fase 41 — Bug #45: restauración auth offline iOS PWA

const provider = new firebase.auth.GoogleAuthProvider();

auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

// Oculta la pantalla de verificación inicial una vez que Firebase resolvió el estado.
function _hideChecking() {
  var el = document.getElementById('checkingScreen');
  if (el) el.style.display = 'none';
}

function initLogin() {
  // Firebase Auth con LOCAL persistence guarda la sesión en IndexedDB.
  // En iOS PWA (Safari standalone), la restauración de IndexedDB puede tomar
  // 300–800ms. Durante ese tiempo, onAuthStateChanged aún no ha disparado.
  // El loginScreen estaba visible por defecto → causaba parpadeo aunque hubiera sesión.
  // Solución: mostrar #checkingScreen (neutro) hasta que Firebase resuelva.
  // Solo entonces decidir: onLoginSuccess (hay sesión) o showLoginScreen (no hay).
  auth.onAuthStateChanged(function(firebaseUser) {
    _hideChecking();
    if (firebaseUser) {
      onLoginSuccess(firebaseUser);
    } else {
      showLoginScreen();
    }
  });
}

function loginWithGoogle() {
  // En iOS PWA offline, signInWithPopup falla silenciosamente.
  // Al reintentar, Firebase lanza auth/cancelled-popup-request porque el popup
  // anterior sigue "pendiente". Solución: bloquear el intento si no hay conexión.
  if (!navigator.onLine) {
    showLoginError('Sin conexión a internet. Conéctate e intenta de nuevo.');
    return;
  }
  auth.signInWithPopup(provider)
    .catch(function(err) {
      if (err.code === 'auth/cancelled-popup-request') return; // ignorar doble tap iOS
      console.error('Error login Google:', err.message);
      showLoginError(err.message);
    });
}

function signOutUser() {
  auth.signOut().catch(function(err) {
    console.error('Error logout:', err.message);
  });
}

function onLoginSuccess(firebaseUser) {
  hideLoginScreen();
  updateUserChip(firebaseUser);
  if (typeof onUserReady === 'function') onUserReady(firebaseUser);
}

function updateUserChip(firebaseUser) {
  const chip = document.getElementById('uChip');
  if (!chip) return;
  const firstName = (firebaseUser.displayName || 'Usuario').split(' ')[0];
  chip.textContent = firstName;
  chip.style.display = 'inline-flex';
}

function showLoginScreen() {
  const screen = document.getElementById('loginScreen');
  if (screen) screen.style.display = 'flex';
  const app = document.getElementById('appShell');
  if (app) app.style.display = 'none';
}

function hideLoginScreen() {
  const screen = document.getElementById('loginScreen');
  if (screen) screen.style.display = 'none';
  const app = document.getElementById('appShell');
  if (app) app.style.display = 'block';
}

function showLoginError(msg) {
  const el = document.getElementById('loginError');
  if (el) { el.textContent = msg; el.style.display = 'block'; }
}

window.loginWithGoogle = loginWithGoogle;
window.signOutUser = signOutUser;
