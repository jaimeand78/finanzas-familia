// js/auth.js
// Responsabilidad: Firebase Auth Google. Sesión y estado de usuario.
// Depende de: config.js (auth)
// Fase 41 — Bug #45: restauración auth offline iOS PWA

const provider = new firebase.auth.GoogleAuthProvider();

auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

// Clave que Firebase SDK compat v9 usa para persistir la sesión en localStorage.
// Patrón: firebase:authUser:[apiKey]:[appName]
var _FB_LS_KEY = 'firebase:authUser:AIzaSyCHWDJfmr2ok_xw-w1FE1tvNV5j5j5VEzc:[fp]';

// Oculta la pantalla de verificación inicial una vez que Firebase resolvió el estado.
function _hideChecking() {
  var el = document.getElementById('checkingScreen');
  if (el) el.style.display = 'none';
}

// Lee la sesión persistida de localStorage (fallback offline iOS).
// Firebase SDK escribe el usuario serializado en _FB_LS_KEY tras cada login exitoso.
function _getPersistedUser() {
  try {
    var raw = localStorage.getItem(_FB_LS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch(e) {
    return null;
  }
}

function initLogin() {
  // Firebase Auth con LOCAL persistence guarda la sesión en IndexedDB.
  // En iOS PWA offline (Safari standalone), onAuthStateChanged NO dispara
  // porque el SDK no puede validar el token sin red — incluso con sesión persistida.
  // Solución: timeout de 4s. Si Firebase no resuelve, leer localStorage como fallback.
  // Si existe sesión previa → arrancar offline. Si no → mostrar login.
  var resolved = false;

  var offlineTimer = setTimeout(function() {
    if (resolved) return;
    resolved = true;
    _hideChecking();
    var persisted = _getPersistedUser();
    if (persisted && persisted.uid) {
      // Hay sesión previa — arrancar en modo offline con datos del localStorage
      console.warn('[auth] Firebase timeout offline — usando sesión persistida');
      onLoginSuccess(persisted);
    } else {
      showLoginScreen();
    }
  }, 4000);

  auth.onAuthStateChanged(function(firebaseUser) {
    if (resolved) return;
    resolved = true;
    clearTimeout(offlineTimer);
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
