# 🔍 Organiza2 — Auditoría Técnica v2.3
> Auditoría completa: código + documentación + arquitectura
> Junio 2026 — Pre-piloto
> **Audiencia:** cualquier IA o desarrollador que trabaje en las correcciones

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
**Estado:** 🔲 Pendiente · **Archivos:** `analisis.js`
`renderSemaforo()` pasa `{}` como totals cuando `curMx ≠ curM`. El gasto histórico se subestima — inconsistente con Tendencia, que sí suma daily. **Fix:** en la rama del mes distinto, cargar también `daily/{y}/{mm}`, normalizar la categoría con `.replace(/^\S+\s/, '')` + `CAT_RENAMES` (igual que `syncDailyMonth`) y pasar esos totals.
**Criterio:** el total de un mes pasado coincide entre Semáforo y Tendencia.

### B2 — `save()` hace `set` completo del nodo mensual (last-write-wins)
**Estado:** 🔲 Documentar · **Archivos:** `finanzas.js` · `arquitectura_v2_3.md`
Con dos miembros editando Config a la vez, el debounce de 800ms + `set` completo puede pisar cambios del otro. Tolerable para el piloto. **Acción mínima:** documentarlo como limitación conocida en arquitectura. **Acción futura:** migrar a `update()` por ítem o por categoría.

### B3 — PWA sin service worker
**Estado:** 🔲 Post-piloto · **Archivos:** nuevo `sw.js` + registro en `index.html`
Hay manifest pero no SW: la app instalada no abre sin conexión; la cola offline solo funciona si la página ya estaba cargada. **Acción:** SW con cache-first del shell (HTML/CSS/JS/logo) y network para Firebase.

### B4 — `finanzas.css` y `REGLAS_IA.md` ausentes de Fuentes
**Estado:** ✅ Resuelto — Junio 2026
Ambos archivos confirmados en proyecto Claude (Fuentes).

### B5 — Nodo `hist` crece sin límite y nadie lo lee
**Estado:** 🔲 Decisión requerida · **Archivos:** `finanzas.js` (`logH`), `firebase-paths.js` (`hKey`)
`logH()` escribe en cada gasto; no existe ningún lector en el código. **Decidir:** (a) eliminar `logH`/`hKey` y el nodo, o (b) declararlo log de auditoría en arquitectura y definir política de retención.

---

## 🟢 LIMPIEZA — código huérfano confirmado (Fase de limpieza sugerida)

> Regla aplicable: tras eliminar, barrer CSS, JS, variables globales y referencias cruzadas.

### C1 — ~150 líneas muertas en `finanzas.js`
`renderExpSecs` y su familia (`addInc`, `delInc`, `updInc`, `togFxInc`, `addCat`, `addItem`, `delItem`, `delCat`, `updExp`, `togFx`) referencian IDs que ya no existen en `index.html` (`expSecs`, `incRows`, `niLbl`, `ncLbl` — verificado por grep). Además `recalc()` y `renderAll()` las llaman cuando `curTab === 'c'`. Riesgo latente: `updExp` ejecuta `logH` por keystroke si alguien reactiva ese HTML.
**Acción:** eliminar funciones + llamadas en `recalc()`/`renderAll()`. Verificar que Config sigue funcionando vía `renderConfigPresupuesto`/`renderIngresosConfig`. Actualizar la referencia a `renderExpSecs` en `arquitectura_v2_3.md` §5.

### C2 — Huérfanos puntuales
- `vKey()` en `firebase-paths.js` (nodo `viaje` v1) — sin usos.
- `raw()` en `utils.js` — sin usos.
- `_soloHogar` en `_tpl15` (`presupuesto.js:169`) — Fase 29 lo reemplazó por `_soloTipo`; ya nada lo setea.
**Acción:** eliminar los tres (y la mención a `vKey` en el header de `firebase-paths.js`).

### C3 — `cleanDuplicates` y `applyFixedYear` sin punto de entrada en UI
Son `window.*` sin botón. **Decidir:** si son herramientas de consola intencionales → documentarlas en arquitectura; si no → eliminar.

### C4 — `defD()` Servicio Doméstico incluye ítem `'Otros'`
Rompe la regla DA-10 ("`DAILY_ITEMS` tiene Otros en cada categoría; `defD()` no"). **Acción:** quitar `{ label:'Otros', ... }` de Servicio Doméstico en `defD()` (`finanzas.js`). No requiere cambio en `migrateCategories` (no lo "ensure").

### C5 — Textos
**Estado:** ✅ Resuelto — Junio 2026
- "Regístren" → "Registren" corregido en `presupuesto.js` `_tplResumen`.
- "desglosás" → "desglosas" corregido en `presupuesto.js` `_tpl4`.

### C6 — Manifest y viewport
- `manifest.json`: declara `sizes: "1254x1254"` para `icono-181.png`; mismo archivo para `any` y `maskable` (maskable requiere margen de seguridad ~20%). Corregir sizes reales y generar variante maskable.
- `index.html`: `maximum-scale=1.0` bloquea zoom (accesibilidad). Evaluar quitarlo.

---

## 📄 DOCUMENTACIÓN — consistencia

### D1 — `arquitectura_v2_3.md` desactualizada
- DA-7 figura "Pendiente" pero está implementada como `getPerfilFlags()` + `filtrarCategoriasPorPerfil()` (`getCapabilidades` no existe en el código). **Decidir:** renombrar la función a `getCapabilidades` o actualizar la DA con el nombre real.
- Tabla de DAs llega a DA-18; faltan DA-19, DA-20 y DA-21 (existen en Contexto Maestro y bitácora).
- §4 dice tab "Resumen"; hoy es "Cómo vamos".
- §8 reglas de seguridad → ver A1.

### D2 — `decisiones_junio2026.md` parcialmente superado
Dice 10 categorías (hoy 11: Servicio Doméstico es categoría propia, no ítem de Vivienda) y onboarding de "5 pantallas" (hoy 6 con P1.5). **Acción:** agregar encabezado: *"⚠️ Documento parcialmente histórico — para el estado vigente ver CONTEXTO_MAESTRO y bitácora Fases 15+"*.

### D3 — Higiene de `bitacora_v2_3.md`
Las Fases 28–30 quedaron después de la sección "9. Próxima Sesión". Los archivos se llaman `v2_3` pero los headers internos dicen "v2.5". **Acción:** reordenar fases antes de "Próxima Sesión" y unificar la convención de versión (decidir: nombre de archivo o header).

### D4 — Convención de claves no documentada
`pl/` usa mes `0–11` (índice JS) y `daily/` usa `mm` `01–12` (string padded). Funciona, pero es trampa para bugs futuros. **Acción:** nota explícita en `arquitectura_v2_3.md` §3.

### D5 — Pendientes pre-piloto sin marcar
La restauración de ingresos de SNBDPA y la verificación E2E de C3 figuran como "antes de lanzar" sin estado. **Acción:** marcar hecho/pendiente en bitácora.

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
| 6 | D5 — Cerrar pendientes en bitácora | 🔲 Pendiente | Operativo |
| 7 | C1–C4, C6 — Fase de limpieza | 🔲 Post-piloto | Limpieza |
| 8 | D1–D4 — Actualización de docs | 🔲 Post-piloto | Docs |
| 9 | B1, B2, B3, B5 | 🔲 Post-piloto | Mejora |

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
