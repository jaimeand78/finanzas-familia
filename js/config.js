// js/config.js
// Responsabilidad: Firebase init. Solo esto.
// Debe cargarse PRIMERO en index.html.

firebase.initializeApp({
  apiKey: "AIzaSyCHWDJfmr2ok_xw-w1FE1tvNV5j5j5VEzc",
  authDomain: "organiza2-a09ef.firebaseapp.com",
  databaseURL: "https://organiza2-a09ef-default-rtdb.firebaseio.com",
  projectId: "organiza2-a09ef",
  storageBucket: "organiza2-a09ef.firebasestorage.app",
  messagingSenderId: "188270762396",
  appId: "1:188270762396:web:be236988bf4f91f2141059"
}, 'fp');

// Variables globales accesibles por todos los módulos
const db   = firebase.database(firebase.app('fp'));
const auth = firebase.auth(firebase.app('fp'));
