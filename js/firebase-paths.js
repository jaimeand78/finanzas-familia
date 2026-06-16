// js/firebase-paths.js
// Responsabilidad: paths centralizados de Firebase.
// Depende de: window.HOGAR (cargado por hogar.js antes de arrancar)
// Expone: dKey(), dayKey()
//
// ⚠️  Este módulo reemplaza las funciones dKey/dayKey/hKey/vKey
//     del monolito v1 que usaban FBK='Anny1130'.
//     Ahora usan window.HOGAR.codigoHogar como raíz.
//     hKey() eliminado en Fase 37 — nodo hist huérfano, nadie lo leía.
//     vKey() eliminado en Fase 40 — módulo viaje v1 nunca implementado en v2.

function dKey(y, m) {
  return `hogares/${window.HOGAR.codigoHogar}/pl/${y}/${m}`;
}

function dayKey(d) {
  const y  = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `hogares/${window.HOGAR.codigoHogar}/daily/${y}/${mm}/${dd}`;
}
