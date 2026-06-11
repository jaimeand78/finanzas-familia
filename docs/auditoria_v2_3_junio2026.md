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
**Estado:** 🔲 Pendiente
**Archivos:** `arquitectura_v2_3.md` §8 · Consola Firebase (`organiza2-a09ef`) · `hogar.js`
**Severidad:** Crítica (seguridad)

**Evidencia:** Las reglas documentadas solo permiten leer/escribir `hogares/$codigo` si `usuarios/$uid/codigoHogar === $codigo`. Pero `unirseHogar()` en `hogar.js`:
1. Lee `hogares/{codigo}/meta` **antes** de que el puntero del usuario exista.
2. Escribe `hogares/{codigo}/miembros/{uid}` **antes** de escribir `usuarios/{uid}/codigoHogar`.

Con las reglas documentadas, unirse fallaría siempre. Como Anny se unió en producción, las reglas reales son más permisivas que las documentadas — posiblemente demasiado (cualquier usuario autenticado podría leer/escribir hogares ajenos adivinando un código de 6 caracteres).

**Acción:**
1. Exportar las reglas reales desde la consola Firebase.
2. Diseñar reglas que soporten el flujo de unirse sin abrir todo. Ejemplo de partida:
   - `hogares/$codigo/meta` → `.read: auth != null` (necesario para validar código al unirse).
   - `hogares/$codigo/miembros/$uid` → `.write: auth != null && auth.uid === $uid` (cada quien escribe su propio nodo de miembro) **o** ya es miembro del hogar.
   - Resto de `hogares/$codigo` → read/write solo si `usuarios/$uid/codigoHogar === $codigo` **o** existe `hogares/$codigo/miembros/$uid`.
3. Probar el flujo completo: crear hogar → unirse con segundo usuario → intentar leer un hogar ajeno (debe fallar).
4. Actualizar `arquitectura_v2_3.md` §8 con las reglas finales desplegadas.

**Criterio de aceptación:** unirse funciona; un tercer usuario autenticado NO puede leer `hogares/SNBDPA/pl/` sin ser miembro; doc y consola coinciden.

---

### A2 — Bug: hogares Pareja y Soltero ven Educación y no pueden desactivarla
**Estado:** 🔲 Pendiente
**Archivos:** `presupuesto.js` (función `guardarPresupuestoBase`, ~línea 517)
**Severidad:** Crítica (afecta a cualquier pareja del piloto)

**Evidencia:** En P1.5 (`_tpl15`) el toggle de Educación solo se renderiza si `tipoHogar === 'familia'`:
```javascript
${esFamilia ? tog('tieneEducacion', '📚', 'Educación', ...) : ''}
```
Pero al guardar:
```javascript
updates['perfil/tieneEducacion'] = _onbData.tieneEducacion !== false;
```
Con el toggle ausente, `_onbData.tieneEducacion` es `undefined`, y `undefined !== false` → se guarda `true`. Resultado: hogares Pareja/Soltero ven la categoría Educación en Tab Hoy y Cómo vamos sin forma de quitarla. Contradice `decisiones_junio2026.md` §3 ("Educación: si hay hijos").

**Fix sugerido (una línea, aplicar en los dos lugares donde se guarda — `updates` y `window.HOGAR.perfil`):**
```javascript
const eduFlag = (_onbData.tipoHogar === 'familia')
  ? (_onbData.tieneEducacion !== false)
  : false;
updates['perfil/tieneEducacion'] = eduFlag;
```
**Nota:** si el hogar ya guardado tiene `tieneEducacion: true` siendo pareja (caso SNBDPA no aplica — es familia), corregir manualmente en consola o vía "Actualizar mi hogar".

**Criterio de aceptación:** onboarding completo como Pareja → la categoría Educación NO aparece en Tab Hoy ni en Cómo vamos. Como Familia con toggle activo → sí aparece.

---

### A3 — Filtro C3 no se aplica en Config ni en Análisis (código contradice docs)
**Estado:** 🔲 Pendiente — requiere decisión de producto previa
**Archivos:** `presupuesto.js` (`renderConfigPresupuesto`, `abrirModalCategoria`) · `analisis.js` (`renderSemaforo`/`_renderSemaforoConData`) · `bitacora_v2_3.md` · `README_v2_3.md`
**Severidad:** Alta (inconsistencia UX visible)

**Evidencia:** `window._catsFiltradas` (creada en `renderAll()`, `finanzas.js:388`) solo la consume `renderResumen` (`finanzas.js:402`). Config y el Semáforo de Análisis iteran `D.categories` sin filtrar: un hogar sin vehículo ve "Cuota Crédito / Leasing", SOAT, "Seguro Vehículo", etc. La bitácora y el README afirman que C3 filtra "Tab Hoy, Resumen y Config".

**Decisión requerida (elegir UNA):**
- **Opción A:** aplicar `filtrarCategoriasPorPerfil()` / `filtrarItemsPorPerfil()` también en `renderConfigPresupuesto`, `abrirModalCategoria` y el Semáforo.
- **Opción B (compatible con DA-18 "Config es vista anual"):** declarar que Config y Análisis muestran el catálogo completo intencionalmente, y corregir bitácora + README.

**Criterio de aceptación:** código y documentación afirman lo mismo, y la UX es consistente entre tabs.

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
**Estado:** 🔲 Pendiente (acción del usuario)
`index.html` referencia `css/finanzas.css` y el Contexto Maestro exige validar contra `REGLAS_IA.md`, pero ninguno está en el proyecto Claude. Riesgo clase Bugs #15–17 (generar código contra versiones invisibles). **Acción:** subir ambos archivos a Fuentes.

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
- `presupuesto.js` `_tplResumen`: "**Regístren**" → "Registren" (sobra la tilde).
- `presupuesto.js` `_tpl4`: "lo **desglosás** en Config" → voseo; la app usa tuteo. Cambiar a "lo desglosas en Config".

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

| # | Hallazgo | Esfuerzo | Tipo |
|---|----------|----------|------|
| 1 | A2 — Flag Educación | 1 línea ×2 | Fix |
| 2 | A1 — Reglas Firebase | 1–2 h + pruebas | Seguridad |
| 3 | A3 — Decisión filtro Config/Análisis | Decisión + fix o doc | Producto |
| 4 | D5 — Cerrar pendientes pre-piloto | Verificación | Operativo |
| 5 | B4 — Subir finanzas.css y REGLAS_IA.md a Fuentes | 5 min | Operativo |
| — | **🚀 Lanzar piloto** | | |
| 6 | C1–C6 — Fase de limpieza | 1 sesión | Limpieza |
| 7 | D1–D4 — Actualización de docs | 1 sesión | Docs |
| 8 | B1, B2, B3, B5 | Post-piloto | Mejora |

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
