// js/auth.js
// Responsabilidad: Firebase Auth Google. Sesión y estado de usuario.
// Depende de: config.js (auth)

const provider = new firebase.auth.GoogleAuthProvider();

auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

function initLogin() {
  auth.onAuthStateChanged(function(firebaseUser) {
    if (firebaseUser) {
      onLoginSuccess(firebaseUser);
    } else {
      showLoginScreen();
    }
  });
}

function loginWithGoogle() {
  auth.signInWithPopup(provider)
    .catch(function(err) {
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
