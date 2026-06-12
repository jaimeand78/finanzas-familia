// js/telemetria.js
// Responsabilidad: telemetría mínima del piloto v2.3 (Fase 34).
// Depende de: config.js (db), window.UID, window.HOGAR
// Expone: trackEvent(tipo), window.metricasPiloto()
//
// Privacidad: NUNCA registrar montos, categorías, ítems, notas, ingresos,
// presupuestos, emails ni nombres. Solo { tipo, timestamp, hogar, uid }.
// Si Firebase falla, la app debe seguir funcionando con normalidad.

function trackEvent(tipo) {
  try {
    const uid = window.UID || null;
    const hogar = (window.HOGAR && window.HOGAR.codigoHogar) || null;
    db.ref('metricas/eventos').push({
      tipo,
      timestamp: Date.now(),
      hogar,
      uid
    }).catch(e => console.warn('trackEvent:', tipo, e));
  } catch(e) {
    console.warn('trackEvent:', tipo, e);
  }
}
window.trackEvent = trackEvent;

// ── FUNCIÓN ADMINISTRATIVA (solo consola) ─────────────────────────────────────
// Lee metricas/eventos y devuelve un resumen del piloto.
window.metricasPiloto = async function() {
  const snap = await db.ref('metricas/eventos').once('value');
  const eventos = [];
  snap.forEach(ch => eventos.push(ch.val()));

  const hace7d = Date.now() - 7 * 24 * 60 * 60 * 1000;

  const porTipo = tipo => eventos.filter(e => e.tipo === tipo);

  const hogaresCreados        = porTipo('hogar_creado').length;
  const miembrosUnidos         = porTipo('hogar_unido').length;
  const onboardingCompletado   = porTipo('onboarding_completado').length;
  const gastosRegistrados      = porTipo('gasto_registrado').length;

  // Usuarios activos en los últimos 7 días (uids únicos)
  const activos7d = porTipo('usuario_activo').filter(e => e.timestamp >= hace7d);
  const usuariosActivos7d = new Set(activos7d.map(e => e.uid)).size;

  // Hogares con 2+ miembros activos (cualquier momento, no solo 7d)
  const activos = porTipo('usuario_activo');
  const porHogar = {};
  activos.forEach(e => {
    if (!e.hogar || !e.uid) return;
    if (!porHogar[e.hogar]) porHogar[e.hogar] = new Set();
    porHogar[e.hogar].add(e.uid);
  });
  const hogaresCon2MiembrosActivos = Object.values(porHogar).filter(s => s.size >= 2).length;

  return {
    hogaresCreados,
    miembrosUnidos,
    onboardingCompletado,
    gastosRegistrados,
    usuariosActivos7d,
    hogaresCon2MiembrosActivos
  };
};
