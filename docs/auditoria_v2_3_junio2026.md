# 🔍 Organiza2 — Auditoría Técnica v2.3
> Auditoría completa: código + documentación + arquitectura
> Junio 2026 — Pre-piloto
> **Audiencia:** cualquier IA o desarrollador que trabaje en las correcciones

> ⚠️ **Documento histórico.** Refleja la auditoría hecha en Junio 2026, antes del piloto. Sus hallazgos ya fueron trabajados y sus instrucciones fueron reemplazadas — incluida su "Regla de Oro", que en el vocabulario vigente se llama Regla de Archivos. Para el criterio de trabajo vigente consultar `REGLAS_IA.md`; para el estado del producto, `docs/producto.md` y `docs/bitacora.md`. Las rutas citadas en el cuerpo son las de junio de 2026 y no se actualizaron.

---

## Instrucciones para la IA que trabaje este documento

1. Leer primero `REGLAS_IA.md`, `CONTEXTO_MAESTRO_ORGANIZA2.md` y `arquitectura_v2_3.md`.
2. **Regla de Oro:** confirmar con el usuario que el archivo a modificar está actualizado en Fuentes antes de tocarlo. Nunca reescribir desde cero.
3. Cambios quirúrgicos, mínimos y dirigidos. Un hallazgo = un fix verificable.
4. Cambios de UX/UI importantes requieren mockup aprobado antes de implementar.
5. Cualquier cambio en categorías/ítems debe aplicarse en los tres artefactos a la vez: `defD()` + `DAILY_ITEMS` + `migrateCategories()`.
6. Al cerrar cada fix: actualizar `bitacora_v2_3.md` en el mismo commit y marcar el hallazgo como ✅ en este documento.
7. Entorno del usuario: VS Code + PowerShell en Windows — comandos git en sentencias separadas, sin `&&`.

---

## Veredicto general

La base es sólida y el piloto puede arrancar. La arquitectura modular se respeta, las funciones canónicas (`planItems` DA-2, `canonicalLabel` DA-3, `calcPresupuestoBase` DA-8) están intactas, no hay cálculos de provisión inline ni escrituras de daily en el nodo mensual (DA-1 ✅), el guard `_migrating` es correcto e idempotente, y la cola offline es robusta.

Se identifican **3 hallazgos críticos pre-piloto**, **5 medios**, **6 de limpieza** y **5 de documentación**.

---

## 🔴 CRÍTICOS — resolver antes de invitar familias

### A1 — Reglas de seguridad Firebase: las documentadas no pueden ser las desplegadas
**Estado:** ✅ Resuelto — Junio 2026
**Archivos:** `firebase-rules.json`

**Solución implementada:** Reglas rediseñadas y desplegadas en `firebase-rules.json`. Estructura final:
- `hogares/$codigo` → `.read` solo si el uid existe en `miembros/`
- `hogares/$codigo/meta` → `.read: auth != null` (validar código al unirse); `.write` solo si el hogar no existe aún o el uid ya es miembro
- `hogares/$codigo/miembros/$uid` → `.read`/`.write` solo para el propio uid
- `hogares/$codigo/perfil`, `pl`, `daily`, `hist` → write solo para miembros
- Nodos raíz `pl`, `daily`, `viaje`, `hist` (v1) → bloqueados completamente
- `metricas/eventos` → cualquier usuario autenticado, con validación de estructura (`tipo` string + `timestamp` number)

**Criterio de aceptación cumplido:** unirse funciona; un tercer usuario autenticado NO puede leer `hogares/SNBDPA/pl/` sin ser miembro.

---

### A2 — Bug: hogares Pareja y Soltero ven Educación y no pueden desactivarla
**Estado:** ✅ Resuelto — Junio 2026
**Archivos:** `presupuesto.js`

**Solución implementada:** `eduFlag` calculado condicionalmente — si `tipoHogar !== 'familia'` se fuerza `false`. Aplicado en los dos lugares de guardado (`updates` y `window.HOGAR.perfil`).

**Criterio de aceptación cumplido:** hogares Pareja/Soltero no ven la categoría Educación en Tab Hoy ni en Cómo vamos.

---

### A3 — Filtro C3 no se aplica en Config ni en Análisis (código contradice docs)
**Estado:** ✅ Resuelto — Junio 2026 (Opción A)
**Archivos:** `presupuesto.js` · `analisis.js`

**Solución implementada:** Se aplicó la Opción A — `filtrarCategoriasPorPerfil()` / `filtrarItemsPorPerfil()` aplicados también en `renderConfigPresupuesto`, `abrirModalCategoria` y el Semáforo de Análisis.

**Criterio de aceptación cumplido:** código y documentación coinciden; la UX es consistente entre tabs.

---

## 🟡 MEDIOS — decidir o programar post-piloto temprano

### B1 — Semáforo de meses pasados ignora los gastos diarios
**Estado:** ✅ Resuelto — Junio 2026 (Fase 38)
Bloque `else` de `renderSemaforo()` reemplazado: ahora carga `pl/` y `daily/` en paralelo con `Promise.all`, acumula los gastos daily por categoría (normalizando sin emoji con `.replace(/^\S+\s/, '')` + `CAT_RENAMES`) y los pasa como `totals` a `_renderSemaforoConData`. Consistente con `renderTendencia`.

### B2 — `save()` hace `set` completo del nodo mensual (last-write-wins)
**Estado:** ✅ Documentado — Junio 2026
Limitación registrada en `arquitectura_v2_3.md` §10. Tolerable para el piloto. Solución futura: migrar a `update()` por ítem.

### B3 — PWA sin service worker
**Estado:** ✅ Resuelto — Junio 2026 (Fase 39)
Creado `sw.js` en raíz del repo. Estrategia: cache-first para el shell (index.html, CSS, JS propios, logo, manifest); network-only para Firebase CDN y Realtime Database. Registrado en `index.html` al evento `load`. La cola offline de `offline.js` sigue manejando gastos sin conexión — el SW complementa abriendo la app aunque no haya red.

### B4 — `finanzas.css` y `REGLAS_IA.md` ausentes de Fuentes
**Estado:** ✅ Resuelto — Junio 2026
Ambos archivos confirmados en proyecto Claude (Fuentes).

### B5 — Nodo `hist` crece sin límite y nadie lo lee
**Estado:** ✅ Resuelto — Junio 2026 (Fase 37)
Eliminados `logH()` en `finanzas.js`, llamada a `logH` en `daily.js` y función `hKey()` en `firebase-paths.js`. El nodo `hist/` en Firebase puede purgarse manualmente desde la consola.

---

## 🟢 LIMPIEZA — código huérfano confirmado (Fase de limpieza sugerida)

> Regla aplicable: tras eliminar, barrer CSS, JS, variables globales y referencias cruzadas.

### C1 — ~150 líneas muertas en `finanzas.js`
**Estado:** ✅ Resuelto — Junio 2026 (Fase 40)
Eliminadas funciones `addInc`, `delInc`, `updInc`, `togFxInc`, `addCat`, `addItem`, `delItem`, `delCat`, `updExp`, `togFx` y `renderExpSecs`. Eliminadas sus llamadas en `recalc()` y `renderAll()`. Actualizado comentario de encabezado.

### C2 — Huérfanos puntuales
**Estado:** ✅ Resuelto — Junio 2026 (Fase 40)
Eliminados `vKey()` en `firebase-paths.js` y `raw()` en `utils.js`. `_soloHogar` ya había sido eliminado en sesión anterior.

### C3 — `cleanDuplicates` y `applyFixedYear` sin punto de entrada en UI
**Estado:** ✅ Resuelto — Junio 2026 (Fase 40)
Eliminadas ambas funciones de `finanzas.js`. Eran herramientas de migración v1→v2 ya innecesarias.

### C4 — `defD()` Servicio Doméstico incluye ítem `'Otros'`
**Estado:** ✅ Resuelto — sesión anterior
Verificado en código: `Otros` no existe en Servicio Doméstico de `defD()`. Ya fue eliminado.

### C5 — Textos
**Estado:** ✅ Resuelto — Junio 2026
- "Regístren" → "Registren" corregido en `presupuesto.js` `_tplResumen`.
- "desglosás" → "desglosas" corregido en `presupuesto.js` `_tpl4`.

### C6 — Manifest y viewport
**Estado:** ✅ Resuelto — Junio 2026 (Fase 40)
- `manifest.json`: `sizes` corregido a `181x181` (valor real del archivo).
- `index.html`: eliminado `maximum-scale=1.0` del viewport — zoom habilitado.

---

## 📄 DOCUMENTACIÓN — consistencia

### D1 — `arquitectura_v2_3.md` desactualizada
**Estado:** ✅ Resuelto — Junio 2026
- DA-7 actualizada con nombre real `filtrarCategoriasPorPerfil()` + `filtrarItemsPorPerfil()`.
- DA-19, DA-20 y DA-21 agregadas a la tabla de DAs.
- §4 corregido: "Resumen" → "Cómo vamos".
- §3 nota de convención de claves `pl/` (mes 0–11) vs `daily/` (mes 01–12) agregada (D4).

### D2 — `decisiones_junio2026.md` parcialmente superado
**Estado:** ✅ Resuelto — Junio 2026
Agregado encabezado de advertencia: *"⚠️ Documento parcialmente histórico — para el estado vigente ver CONTEXTO_MAESTRO y bitácora Fases 15+"*.

### D3 — Higiene de `bitacora_v2_3.md`
**Estado:** ✅ Resuelto — Junio 2026
Headers unificados a v2.3. Sección "9. Próxima Sesión" renombrada a histórica. Resumen Ejecutivo actualizado con piloto activo. Marcadores de pie de página duplicados eliminados.

### D4 — Convención de claves no documentada
**Estado:** ✅ Resuelto — Junio 2026 (junto con D1)
Nota agregada en `arquitectura_v2_3.md` §3: `pl/` usa mes `0–11` (índice JS); `daily/` usa mes `01–12` (string con cero a la izquierda).

### D5 — Pendientes pre-piloto sin marcar
**Estado:** ✅ Resuelto — Junio 2026

- **Restauración de ingresos SNBDPA** → no aplica. Decisión tomada: borrar presupuesto base, conservar solo `daily/`. SNBDPA reconfigurado desde la app antes del piloto.
- **Verificación E2E de C3** → hecha. Filtro de perfil verificado de punta a punta en producción. Piloto activo.

---

## Orden de ejecución recomendado

| # | Hallazgo | Estado | Tipo |
|---|----------|--------|------|
| 1 | A2 — Flag Educación | ✅ Resuelto | Fix |
| 2 | A1 — Reglas Firebase | ✅ Resuelto | Seguridad |
| 3 | A3 — Filtro C3 Config/Análisis | ✅ Resuelto (Opción A) | Producto |
| 4 | B4 — finanzas.css y REGLAS_IA.md en Fuentes | ✅ Resuelto | Operativo |
| 5 | C5 — Textos Registren / desglosas | ✅ Resuelto | Limpieza |
| — | **🚀 Piloto activo** | | |
| 6 | D5 — Pendientes pre-piloto | ✅ Resuelto | Operativo |
| 7 | C1–C4, C6 — Fase de limpieza | ✅ Resuelto | Limpieza |
| 8 | D1–D4 — Actualización de docs | ✅ Resuelto — Junio 2026 | Docs |
| 9 | B5 — Nodo hist eliminado | ✅ Resuelto | Limpieza |
| 10 | B2 — Documentar limitación save() | ✅ Documentado | Docs |
| 11 | B1 — Semáforo histórico incluye daily | ✅ Resuelto | Mejora |
| 12 | B3 — Service worker PWA | ✅ Resuelto | Mejora |

---

## Lo que está bien (no tocar)

- Arquitectura modular de 14 archivos respetada; orden de carga de scripts correcto.
- DA-1 ✅ (daily nunca escribe en `pl/`), DA-2 ✅ (`planItems` usado consistentemente), DA-3 ✅ (`canonicalLabel` intacta y aplicada al leer), DA-8 ✅ (sin provisión inline).
- Guard `_migrating` en `subMonth` correcto; `migrateCategories` idempotente (no genera loops de escritura).
- Cola offline (`offline.js`) sólida — validada en uso real, no modificar.
- Filtro C3 correctamente aplicado en Tab Hoy (`populateCatSel`/`populateItemSel`) y Cómo vamos (`renderResumen`).
- Normalización de `dailyTotals` sin emoji consistente entre `syncDailyMonth`, `renderResumen` y `renderHormiga`.

---

*Organiza2 — Auditoría v2.3 | Junio 2026*
*Actualizar el campo **Estado** de cada hallazgo al cerrarlo, y registrar la fase correspondiente en `bitacora_v2_3.md`.*
