# 📓 Organiza2 — Bitácora Técnica v2.5

> Historial completo de desarrollo, decisiones y aprendizajes
> Abril — Junio 2026

---

## 1. Resumen Ejecutivo

| ✅ Logros | 🔲 Pendientes |
|-----------|--------------|
| App PWA en producción | Tab Análisis — Semáforo y Tendencia pendientes de afinar |
| Login Google + Firebase Auth (Etapa A) | Fix iOS decimal `type="text"` |
| Modelo de Hogar + código invitación (Etapa B) | Exportar mes a PDF |
| Migración datos a hogares/ (Etapa C) | Exportar año a Excel |
| Finanzas v2 arquitectura modular (Etapa D) | Piloto 5-10 familias |
| Migración Anny1130 → hogares/SNBDPA/ ✅ | |
| Etapa E completa ✅ | |
| Tab Resumen rediseñado — solo lectura ✅ | |
| Semáforo por categoría ✅ | |
| Pantalla login con logo ✅ | |
| Config limpio — sin residuos v1 ✅ | |
| REGLAS_IA.md creado ✅ | |
| Proyecto Claude con todos los archivos ✅ | |
| Bloque 1: íconos globales utils.js + index.html ✅ | |
| Bloque 4: renderHormiga() real ✅ | |
| Bloque 2: onboarding presupuesto.js ✅ | |
| Bloque 3: rediseño tab Config ✅ | |
| fix: Vestuario y Regalos en defD() y migrateCategories() ✅ | Ítems faltantes en Vivienda, Salud, Entretenimiento, Ahorro — revisar antes del piloto |
| fix: onboarding P4 — servicios/transporte va a ítem principal, no dividido ✅ | |
| fix: Config modal — selector de mes para ítems de fecha fija (SOAT, predial, cesantías) ✅ | |
| feat: Tendencia rediseñada — daily incluido, barras dobles, promedio, insight ✅ | |
| fix: iOS decimal — todos los inputs ya correctos, sin cambios necesarios ✅ | |

---

## 2. Cronología de Desarrollo

### 📅 Fases 1-6 — v1.x (Abril — Mayo 2026)
*(ver versiones anteriores de la bitácora)*

### 📅 Fase 7 — Auditoría estratégica y redefinición v2.0 (Junio 2026)

**Decisión:** Organiza2 no es una app financiera. Es una plataforma de decisiones familiares.
Lema redefinido: *"Organizamos tu vida en pareja."*

- El Hogar pasa a ser la entidad principal (DA-0)
- Módulos redefinidos: Finanzas · Planeador · Alimentación
- Regla de validación: no construir Planeador ni Alimentación hasta validar Finanzas v2 con familias reales

**Documentos generados:** `producto_v2_3.md`, `arquitectura_v2_3.md`, `README_v2_3.md`, `bitacora_v2_3.md`

### 📅 Fase 8 — v2.1 / Etapas A-D (Junio 2026)

- **Etapa A:** Login Google con Firebase Auth
- **Etapa B:** Modelo de Hogar — crear/unirse por código de invitación
- **Etapa C:** Migración de datos a `hogares/[codigoHogar]/`
- **Etapa D:** Finanzas v2 reconstruida con arquitectura modular (14 archivos JS)

**Estado:** App en producción en `organiza2.github.io/finanzas-familia`
**Hogar activo:** SNBDPA ("Ibarra Masso") — 2 miembros (Jaime + Anny)

### 📅 Fase 9 — Diseño del Presupuesto Base y Onboarding (Junio 2026)

Sesión de diseño antes de implementar Etapa E. Decisiones principales:
- DA-10: dos niveles de detalle (presupuesto agrupado vs registro diario detallado)
- 10 categorías oficiales v2.0
- Catálogo DAILY_ITEMS: 56 ítems
- Onboarding conversacional: *"¿Cómo es su hogar?"* antes de cualquier número
- Nota obligatoria en "Otros"
- DA-11: ingresos dinámicos desde perfil

### 📅 Fase 10 — Etapa E implementada (Junio 2026)

**Lo que se construyó:**
- `defD()` v2.0 — 10 categorías oficiales
- `DAILY_ITEMS` — 56 ítems para registro diario, separado de `defD()`
- `calcPresupuestoBase(item, mes)` — función canónica de frecuencias (DA-8)
- `buildIncomeFromPerfil(perfil)` — ingresos dinámicos desde perfil (DA-11)
- Onboarding 5 pantallas + resumen conversacional
- Sección Presupuesto Base en tab Config
- Banner miembro 2 "¿Estás de acuerdo?"
- Nota obligatoria al elegir "Otros" en registro diario
- Selector de 2 niveles en tab Hoy (categoría → ítem)

### 📅 Fase 11 — Tab Resumen rediseñado (Junio 2026)

**Solución:**
- Solo lectura — sin inputs
- Número grande de disponible como protagonista (verde/rojo)
- Semáforo por categoría: rojo / amarillo (>85%) / verde
- Ahorro siempre expandido con "✓ cumplido"
- Orden: rojo → amarillo → ahorro cumplido → verde → sin presupuesto

**Archivos modificados:** `js/finanzas.js`, `js/ui.js`, `index.html`

### 📅 Fase 12 — Pantalla de login rediseñada (Junio 2026)

- Logo oficial `logo.png`
- Beneficios: ✅ Saben en qué se va el dinero / ✅ Deciden juntos, sin sorpresas / ✅ Paz mental a fin de mes

**Archivos modificados:** `css/login.css`, `index.html`

### 📅 Fase 13 — Bugs post-integración y limpieza Config (Junio 2026)

Ver sección 3 — Registro de Bugs.

**Decisión de Config (DA-16):** El tab Config solo muestra configuración del hogar y presupuesto base.

### 📅 Fase 14 — Regla de Oro y proyecto Claude (Junio 2026)

- Creado `REGLAS_IA.md` en la raíz del repo
- Todos los archivos del proyecto subidos al proyecto Claude
- Regla de Oro establecida: siempre preguntar si el archivo está actualizado antes de modificarlo

### 📅 Fase 15 — Sesión de diseño y refactoring íconos (Junio 2026)

**Sesión de diseño completa antes de implementar:**
- Mockup tab Config aprobado — secciones colapsables, modal por categoría, Reconfigurar 🧹
- Mockup Hormiga real aprobado — filtro por umbral, insight dinámico, categorías con conteo
- Revisión completa de íconos — 7 cambios globales aprobados + 10 cambios onboarding
- Revisión completa de textos onboarding — corrección singular/plural, función `_tx()`
- Eliminación opción Mixto P1, opción P2 dinámica según tipoHogar

**Implementado (Bloque 1 y 4):**
- `utils.js` — 5 íconos ICONS + 5 claves DAILY_ITEMS
- `index.html` — tab Hoy 💰→✏️, sub-tab Tendencia 📈→📉
- `analisis.js` — `renderHormiga()` reescrita con lógica real (umbral $20.000)

### 📅 Fase 16 — Bloque 2: onboarding presupuesto.js (Junio 2026)

**Cambios implementados en `presupuesto.js`:**

| # | Cambio |
|---|--------|
| 1 | `_tx(singular, plural)` — función nueva, devuelve singular si `tipoHogar === 'soltero'` |
| 2 | P1: eliminado botón Mixto |
| 3 | P1: textos fijos en singular ("tu hogar", "para ti") — P1 aún no conoce tipoHogar |
| 4 | P2: emoji `💭→🤔` |
| 5 | P2: ícono opción `invisible` `🌫️→💸` |
| 6 | P2: opción `acuerdo` dinámica — soltero ve `😰 Gasto más de lo que gano` |
| 7 | P2: opciones `justo` y `ahorro` con `_tx()` |
| 8 | P2: título y subtítulo con `_tx()` |
| 9 | P3: título y subtítulo con `_tx()` |
| 10 | P4: emoji `🏠→📌` |
| 11 | P4: cuota vehículo `🚗 Cuota crédito del vehículo` → `💳 Cuota del vehículo` |
| 12 | P5: emoji `🛒→🎢` |
| 13 | P5: subtítulo con `_tx()` |
| 14 | P5: `🍽️→🧺` mercado, `🎬→🍿` entretenimiento, `💰→🐷` ahorro |
| 15 | P5: `¿Cuánto quieres/quieren guardar?` con `_tx()` |
| 16 | Resumen: `Ingresa/Ingresan`, `Te queda/Les queda`, insights con `_tx()` |

### 📅 Fase 17 — Bloque 3: rediseño tab Config (Junio 2026)

**Diseño:** mockup aprobado antes de implementar — secciones colapsables, acordeón por categoría, modales de edición.

**Cambios en `index.html`:**
- Tab Config reemplazado — 4 secciones colapsables (`cfg-sec`): Mi hogar, Ingresos, Presupuesto base, Cerrar sesión
- Nuevos contenedores: `#hogarInfo`, `#ingresosConfig`, `#budgetConfig`
- Modal editar categoría (`#cfgCatModal`) con título dinámico y body generado por JS
- Modal editar ingreso (`#cfgIngModal`) con input de monto
- Eliminado: `danger-sec`, `btn-danger`, `cleanDuplicates` del HTML

**Cambios en `ui.js`:**
- `renderConfigHogar()` reescrita — chips de miembros con avatar de iniciales
- `cfgToggle(id)` nueva — colapsa/expande secciones Config
- `renderIngresosConfig()` nueva — lista de ingresos con ✏️ por fila
- `go('c')` actualizado — llama `renderIngresosConfig()` además de las existentes

**Cambios en `presupuesto.js`:**
- `renderConfigPresupuesto()` reescrita — acordeón por categoría, categorías sin definir atenuadas, footer con total + Reconfigurar
- `cfgCatToggle(ci)` nueva — abre/cierra acordeón de categoría
- `abrirModalCategoria(ci)` nueva — modal con inputs de budget + selector de frecuencia por ítem
- `cerrarModalCategoria()` nueva — cierra modal y refresca Config
- `updFrecuencia(ci, ri, val)` nueva — actualiza frecuencia de ítem y guarda
- `abrirModalIngreso(i)` nueva — modal para editar monto de ingreso
- `cerrarModalIngreso()` / `guardarModalIngreso()` nuevas

**Cambios en `presupuesto.css`:**
- Estilos viejos de Config reemplazados completamente
- Nuevas clases: `cfg-sec`, `cfg-sec-hdr`, `cfg-sec-body`, `cfg-collapsed`, `cfg-chev`
- Estilos Mi hogar: `cfg-info-row`, `cfg-code`, `cfg-member-chip`, `cfg-avatar`
- Estilos Ingresos: `cfg-income-row`, `cfg-income-val`, `cfg-edit-btn`
- Estilos Presupuesto: `cfg-cat-item`, `cfg-cat-hdr`, `cfg-cat-body`, `cfg-freq-badge`, `cfg-prov-hint`, `cfg-bud-footer`, `cfg-reconf-btn`
- Estilos modales: `cfg-modal-inner`, `cfg-modal-hdr`, `cfg-modal-body`, `cfg-modal-row`, `cfg-freq-sel`, `cfg-modal-foot`
- Estilos Cerrar sesión: `cfg-signout-btn`

### 📅 Fase 18 — Revisión técnica pre-piloto y fixes onboarding/Config (Junio 2026)

**Contexto:** Sesión de análisis antes del piloto v2.3. Se identificaron 4 problemas en onboarding y Config, se hizo mockup y se implementaron 3 fixes en `presupuesto.js`.

**Problemas identificados:**

| # | Problema | Impacto | Decisión |
|---|----------|---------|----------|
| C1 | Servicios del hogar se dividía en 3 partes iguales entre Agua/Gas/Internet | Alto — valores incorrectos en Firebase | Fix inmediato |
| C2 | Modal Config mostraba select "anual/mensual" para ítems de fecha fija (SOAT, predial, cesantías) — no permitía cambiar el mes | Alto — hogares con vehículo o empleada | Fix inmediato |
| C3 | Onboarding P1 no usa tipoHogar para activar/desactivar categorías | Bajo | Post-piloto |
| C4 | Labels de servicios y transporte en P4 no aclaraban que era un estimado total | Bajo | Fix inmediato |

**Fixes implementados en `presupuesto.js`:**

**C1 — `_aplicarOnbDataAD()`:** El valor de servicios va completo a `Agua y Energía`. Gas e Internet arrancan en $0. El usuario desglosa en Config.

**C2 — `abrirModalCategoria()`:** Detecta si el ítem tiene `months[]`. Si sí → muestra selector de mes (Ene–Dic) con estilo verde, el usuario puede cambiar el mes. Si no → select de frecuencia normal sin cambios. Nueva función `updMes(ci, ri, val)` guarda `item.months = [mes]` y llama `recalc()` + `save()`. `calcPresupuestoBase()` no se toca — ya funciona correctamente con `months[]`.

**C4 — `_tpl4()`:** Badges de servicios y transporte cambian de lista de ítems a *"total estimado — lo desglosás en Config"*.

**Aprendizaje clave de esta sesión:**
> El onboarding recoge estimados agrupados. Config recoge el detalle real. No forzar mapeo 1:1 entre ellos.

### 📅 Fase 19 — Tendencia rediseñada + confirmación fix iOS (Junio 2026)

**Fix iOS decimal:** Revisión de todos los inputs de monto en la app — todos ya tenían `type="text" inputmode="decimal"` correctamente aplicado. No requirió cambios.

**`renderTendencia()` reescrita en `analisis.js`:**

| Cambio | Detalle |
|--------|---------|
| Incluye gastos `daily/` | Carga `daily/[y]/[mm]` en paralelo con el nodo mensual — suma ambos para el total real |
| Tarjetas resumen | Promedio 5 meses anteriores vs mes actual + delta % (verde si bajó, rojo si subió) |
| Barras dobles | Barra sólida = gastos · Barra con borde = ingresos |
| Color semáforo | Mes actual verde · Meses donde gastos > ingresos en rojo coral · Resto morado |
| Leyenda | Gastos / Mes actual / Ingresos |
| Insight dinámico | Una frase al final: bien si ▼10%+, ojo si ▲10%+, neutral si dentro del rango |
| Estado de carga | Muestra "Cargando..." mientras resuelven las promesas de Firebase |

**Archivo modificado:** `js/analisis.js`

---

## 3. Registro de Bugs y Soluciones

*(bugs #1 al #13 — ver versiones anteriores)*

**Bug #14 — Tarjetas verdes del Resumen sin contraste**
- **Fix:** `var(--color-bg)` → `var(--color-surface)` en `renderResumen()`

**Bug #15 — `calcPresupuestoBase` not defined**
- **Fix:** Reconstruir `finanzas.js` combinando ambas versiones
- **Aprendizaje:** Siempre pedir el archivo actual antes de modificarlo → DA-17

**Bug #16 — Config con contenido duplicado (v1 + v2)**
- **Fix:** Eliminar bloques v1 del `index.html` + quitar `renderExpSecs()` de `go('c')`

**Bug #17 — Nombres de categorías cortados en Resumen**
- **Fix:** Función `displayName(name)` con regex Unicode en `finanzas.js`

**Bug #18 — Orden del semáforo incorrecto**
- **Fix:** Ordenar antes de renderizar: `[...rojos, ...amarillos, ...ahorroCumplido, ...verdes, ...sinBud]`

**Bug #19 — Nombres de miembros no aparecen en tab Config**
- **Síntoma:** Los chips de miembros en "Mi hogar" mostraban `?` en lugar de los nombres
- **Causa:** `crearHogar()` y `unirseHogar()` en `hogar.js` solo guardaban `{ rol }` en el nodo miembro — nunca persistían `nombre` ni `email`. El `displayName` de Google solo vive en el objeto `firebaseUser` en memoria.
- **Fix:**
  - `app.js`: guarda `{ nombre, email }` en `window.CURRENT_USER` al autenticarse
  - `hogar.js`: escribe `nombre` y `email` al crear hogar y al unirse
  - `ui.js`: fallback en `renderConfigHogar()` — si `m.nombre` vacío, usa `window.CURRENT_USER.nombre` para el usuario actual
  - `app.js`: parche en `onHogarReady()` — si el miembro no tiene `nombre` en Firebase, lo escribe automáticamente la próxima vez que entre (resuelve hogares existentes sin necesidad de migración)
- **Archivos:** `js/app.js`, `js/hogar.js`, `js/ui.js`

**Bug #20 — Vestuario y Regalos y Celebraciones ausentes en hogares migrados de v1**
- **Síntoma:** Config, Resumen y Tendencia no mostraban `Vestuario` ni `Regalos y Celebraciones` en el hogar SNBDPA (migrado de v1)
- **Causa:** `migrateCategories()` solo migra categorías que ya existen en Firebase — nunca agrega categorías nuevas. `defD()` tampoco las incluía. Ambas categorías son nuevas en v2.0 y nunca existieron en v1.
- **Fix:**
  - `utils.js`: bloque `newCats` en `migrateCategories()` — agrega categorías ausentes con ítems base, idempotente (guarda solo si `changed = true`)
  - `finanzas.js`: `Vestuario` y `Regalos y Celebraciones` agregadas en `defD()` para meses nuevos y hogares nuevos del piloto
- **Archivos:** `js/utils.js`, `js/finanzas.js`
- **Pendiente:** `migrateCategories()` no tiene `ensure` para ítems de Vivienda, Salud y Belleza, Entretenimiento y Ahorro — esos ítems pueden estar desactualizados en hogares v1. Revisar en sesión de UX antes del piloto.

---

## 4. Decisiones Arquitecturales

*(DA-0 al DA-13 — ver arquitectura_v2_3.md)*

**DA-14:** Tab Resumen es solo lectura — sin inputs.
**DA-15:** Login con logo oficial `logo.png`.
**DA-16:** Config solo muestra configuración — no gastos reales del mes.
**DA-17:** Siempre pedir el archivo actual antes de modificarlo — ver `REGLAS_IA.md`.

---

## 5. Deuda Técnica

### 🔴 Prioridad Alta — Antes del piloto
- Ítems faltantes en hogares v1: `migrateCategories()` sin `ensure` para Vivienda, Salud y Belleza, Entretenimiento, Ahorro — revisar impacto UX antes del piloto
- Probar en producción con hogar SNBDPA — validar Tendencia, fixes C1/C2/C4

### 🟡 Prioridad Media — Post-piloto
- Onboarding P1: usar `tipoHogar` para activar/desactivar categorías vía `getCapabilidades(perfil)` — Familia activa Educación y Servicio Doméstico, Solo las oculta
- Exportar mes a PDF
- Exportar año completo a Excel
- Presupuesto Base se aplica automáticamente al crear mes nuevo
- Sugerencias contextuales DA-9

### 🟢 Prioridad Baja
- Modo oscuro
- Comparar mes actual vs mismo mes año anterior
- Historial de cambios en presupuesto por ítem

---

## 6. Aprendizajes Clave

> **Siempre pedir el archivo actual antes de modificarlo.**

> **No rehacer lo que funciona.** Cambios quirúrgicos, no rewrites completos.

> **Mockupear antes de implementar.** Iteraciones en minutos vs horas de commits.

> **Config es configuración, no edición de gastos.**

> **Una mamá mira colores, no números.**

> **El logo en el login comunica identidad. Un emoji no.**

> **Documentar los textos aprobados en la bitácora.** En la sesión anterior se aprobaron los textos singular/plural del onboarding pero no quedaron registrados en la documentación, lo que obligó a reconstruirlos desde el código en la sesión siguiente.

---

## 7. Historial de Commits

| Hash | Descripción |
|------|-------------|
| *(ver commits anteriores)* | Etapas A-D |
| 0bf4024 | feat: Etapa E — Presupuesto Base, onboarding 5 pantallas, DAILY_ITEMS |
| [confirmar] | fix: onboarding — textos y botón cancelar en resumen |
| [confirmar] | feat: tab Resumen rediseñado — semáforo por categoría, solo lectura |
| [confirmar] | feat: pantalla de login rediseñada con logo y beneficios |
| [confirmar] | fix: fondo blanco en tarjetas verdes del Resumen |
| [confirmar] | fix: calcPresupuestoBase, buildIncomeFromPerfil y renderAll completo |
| [confirmar] | fix: Config limpio — sin bloques v1, solo hogar y presupuesto base |
| [confirmar] | fix: nombres categorías, orden semáforo y fondo tarjetas en Resumen |
| [confirmar] | docs: REGLAS_IA.md — reglas de trabajo para asistentes IA |
| [confirmar] | docs: bitacora v2.5, arquitectura v2.3, producto v2.3, README actualizados |
| [confirmar] | refactor: íconos globales — utils.js (ICONS + DAILY_ITEMS) + index.html |
| [confirmar] | feat: renderHormiga() reescrita — lógica real gastos hormiga, umbral $20k |
| [confirmar] | refactor: onboarding — _tx(), íconos, textos singular/plural, sin Mixto |
| 60182e9 | feat: rediseño tab Config — secciones colapsables, acordeón presupuesto, modales edición |
| [confirmar] | fix: nombres miembros en Config — guardar displayName en Firebase |
| [confirmar] | fix: onboarding P4 servicios/transporte — total a ítem principal; Config modal mes fijo vs frecuencia |
| [confirmar] | feat: Tendencia rediseñada — daily incluido, barras dobles, promedio, insight dinámico |

---

## 8. Roadmap

| Versión | Hitos | Estado |
|---------|-------|--------|
| v2.0 | Auditoría · Visión · Documentación | ✅ |
| v2.1 | Login + Hogar + Finanzas modular (Etapas A-D) | ✅ |
| v2.2 | Etapa E: Presupuesto Base · Onboarding · Resumen rediseñado · Login nuevo | ✅ |
| v2.3 | Piloto 5-10 familias — validar con uso real | 🔲 Siguiente |
| v3.0 | Planeador MVP | 🔲 |
| v4.0 | Alimentación | 🔲 |
| v5.0 | Monetización | 🔲 |

---

## 9. Próxima Sesión

**Antes del piloto hay que resolver:**
1. Probar en producción con hogar SNBDPA — Tendencia, onboarding P4, modal mes fijo
2. Revisar `migrateCategories()` — ítems faltantes en hogares v1 (Vivienda, Salud, Entretenimiento, Ahorro)

**Cuando esos estén listos → Piloto v2.3 con 5-10 familias**

---

*Organiza2 — Bitácora v2.5 | Junio 2026*
