// js/auth.js
// Responsabilidad: Firebase Auth Google. Sesión y estado de usuario.
// Depende de: config.js (auth)
// Fase 41 — Bug #45: restauración auth offline iOS PWA

const provider = new firebase.auth.GoogleAuthProvider();

auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

// Clave que Firebase SDK compat v9 usa para persistir la sesión en localStorage.
var _FB_LS_KEY = 'firebase:authUser:AIzaSyCHWDJfmr2ok_xw-w1FE1tvNV5j5j5VEzc:[fp]';

// Detecta si la app corre como PWA instalada en iOS.
function _isIOSPWA() {
  return !!navigator.standalone;
}

// Oculta la pantalla de verificación inicial.
function _hideChecking() {
  var el = document.getElementById('checkingScreen');
  if (el) el.style.display = 'none';
}

// Oculta la pantalla offline.
function _hideOffline() {
  var el = document.getElementById('offlineScreen');
  if (el) el.style.display = 'none';
}

// Indica si existía sesión previa en localStorage (solo para decidir el mensaje offline).
function _hadPreviousSession() {
  try {
    var raw = localStorage.getItem(_FB_LS_KEY);
    if (!raw) return false;
    var obj = JSON.parse(raw);
    return !!(obj && obj.uid);
  } catch(e) {
    return false;
  }
}

function initLogin() {
  // En iOS PWA offline, onAuthStateChanged no dispara sin red.
  // Timeout de 4s: si Firebase no resuelve → pantalla offline o login.
  // IMPORTANTE: initialResolved solo cancela el timeout.
  // onAuthStateChanged siempre ejecuta para capturar login y logout.
  var initialResolved = false;

  var offlineTimer = setTimeout(function() {
    if (initialResolved) return;
    initialResolved = true;
    _hideChecking();
    if (_hadPreviousSession()) {
      _showOfflineScreen();
    } else {
      showLoginScreen();
    }
  }, 4000);

  auth.onAuthStateChanged(function(firebaseUser) {
    if (!initialResolved) {
      initialResolved = true;
      clearTimeout(offlineTimer);
      _hideChecking();
    }
    if (firebaseUser) {
      _hideOffline();
      onLoginSuccess(firebaseUser);
    } else {
      showLoginScreen();
    }
  });

  // En iOS PWA, signInWithRedirect regresa a la app y getRedirectResult
  // captura el resultado. Esto evita el problema de popup doble en standalone.
  if (_isIOSPWA()) {
    auth.getRedirectResult().catch(function(err) {
      if (err.code && err.code !== 'auth/no-auth-event') {
        console.error('Error redirect result:', err.message);
        showLoginError(err.message);
      }
    });
  }
}

// Pantalla offline — sesión previa sin red.
function _showOfflineScreen() {
  var el = document.getElementById('offlineScreen');
  if (el) el.style.display = 'flex';
}

function loginWithGoogle() {
  if (!navigator.onLine) {
    showLoginError('Sin conexión a internet. Conéctate e intenta de nuevo.');
    return;
  }
  // iOS PWA: usar redirect para evitar problemas de popup en standalone.
  // Safari normal y Android: popup funciona correctamente.
  if (_isIOSPWA()) {
    auth.signInWithRedirect(provider);
  } else {
    auth.signInWithPopup(provider)
      .catch(function(err) {
        if (err.code === 'auth/cancelled-popup-request') return;
        console.error('Error login Google:', err.message);
        showLoginError(err.message);
      });
  }
}

function signOutUser() {
  auth.signOut()
    .catch(function(err) {
      console.error('Error logout:', err.message);
    });
  // onAuthStateChanged captura el null y llama showLoginScreen()
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
