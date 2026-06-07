# 📓 Organiza2 — Bitácora Técnica v2.5

> Historial completo de desarrollo, decisiones y aprendizajes
> Abril — Junio 2026

---

## 1. Resumen Ejecutivo

| ✅ Logros | 🔲 Pendientes |
|-----------|--------------|
| App PWA en producción | Ingresos adicionales / bonos — próxima sesión |
| Login Google + Firebase Auth (Etapa A) | Onboarding: activar/desactivar categorías por tipoHogar (C3) |
| Modelo de Hogar + código invitación (Etapa B) | Piloto 5-10 familias |
| Migración datos a hogares/ (Etapa C) | Exportar mes a PDF |
| Finanzas v2 arquitectura modular (Etapa D) | Exportar año a Excel |
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
| fix: Vestuario y Regalos en defD() y migrateCategories() ✅ | |
| fix: onboarding P4 — servicios/transporte va a ítem principal ✅ | |
| fix: Config modal — selector de mes para ítems de fecha fija ✅ | |
| feat: Tendencia rediseñada — daily incluido, barras dobles, promedio ✅ | |
| fix: iOS decimal — todos los inputs ya correctos ✅ | |
| fix: Servicio Doméstico en Tab Hoy (DAILY_ITEMS) ✅ | |
| feat: Ahorro fijo arriba en Resumen — después de Ingresan/Gastado ✅ | |
| feat: ¿Quién ha pagado? — sección nueva al final del Resumen ✅ | |
| fix: dailyTotals normaliza catKey sin emoji — Resumen correcto ✅ | |
| feat: Ingresos adicionales por miembro en Config ✅ | |

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

### 📅 Fase 18 — Revisión técnica pre-piloto y fixes onboarding/Config (Junio 2026)

**Problemas identificados y resueltos:**

| # | Problema | Fix |
|---|----------|-----|
| C1 | Servicios del hogar se dividía en 3 partes iguales | Valor completo a `Agua y Energía`, Gas e Internet en $0 |
| C2 | Modal Config no permitía cambiar mes en ítems de fecha fija | Selector de mes (Ene–Dic) cuando ítem tiene `months[]` |
| C4 | Labels de servicios/transporte en P4 no aclaraban que era estimado | Badge "total estimado — lo desglosás en Config" |

**Aprendizaje clave:** El onboarding recoge estimados agrupados. Config recoge el detalle real.

### 📅 Fase 19 — Tendencia rediseñada + confirmación fix iOS (Junio 2026)

**Fix iOS decimal:** Todos los inputs ya tenían `type="text" inputmode="decimal"` — sin cambios.

**`renderTendencia()` reescrita en `analisis.js`:**
- Incluye gastos `daily/` — carga en paralelo con nodo mensual
- Tarjetas resumen: promedio 5 meses anteriores vs mes actual + delta %
- Barras dobles: sólida = gastos · con borde = ingresos
- Color semáforo, leyenda, insight dinámico al final

### 📅 Fase 20 — Revisión pre-piloto producción + parche budgets SNBDPA (Junio 2026)

Sesión de validación en producción y resolución de problemas específicos del hogar SNBDPA.

### 📅 Fase 21 — Fix definitivo Config budget anual (Junio 2026)

**Fix definitivo — `renderConfigPresupuesto()` convertida a `async`:**
- Carga los 12 meses del año en paralelo con `Promise.all`
- Construye `budgetAnual = { 'CatName|ItemLabel': maxBudget }` con el valor máximo de cualquier mes
- `getBudget(catName, itemLabel, fallback)` reemplaza el acceso directo a `r.budget`

**Archivo:** `js/presupuesto.js`
**Commit:** `fix: Config carga budget anual — ítems fecha fija muestran valor real (DA-18)`

### 📅 Fase 22 — Pre-piloto: Resumen mejorado + Servicio Doméstico en Tab Hoy (Junio 2026)

**Contexto:** Sesión de revisión pre-piloto a partir de nota de voz con hallazgos del usuario. Se identificaron bugs reales y se aprobaron mejoras de UX mediante mockups antes de implementar.

**Hallazgos identificados:**

| # | Hallazgo | Tipo | Decisión |
|---|----------|------|----------|
| H1 | Servicio Doméstico no aparece en Tab Hoy | Bug | Fix inmediato |
| H2 | dailyTotals acumulaba con clave con emoji — no coincidía con c.name | Bug | Fix inmediato |
| H3 | Ahorro enterrado en semáforo, sin prominencia | UX | Fix inmediato — sube a posición fija |
| H4 | Sin visibilidad de quién está pagando | Feature | Implementado — sección nueva al final del Resumen |
| H5 | Ingresos adicionales / bonos no existen en v2.2 | Feature | Pendiente — próxima sesión |
| H6 | Onboarding no activa/desactiva categorías por tipoHogar | Feature | Pendiente — pre-piloto |

**Mockups aprobados antes de implementar:**
- Tab Resumen completo: disponible → Ingresan/Gastado → Ahorro fijo → semáforo → ¿Quién ha pagado?
- Tres iteraciones hasta aprobación final

**Cambios implementados:**

`js/utils.js`:
- Agregada clave `'🤝 Servicio Doméstico'` a `DAILY_ITEMS` con ítems: Salario empleada, Salario niñera, Prestaciones, Otros

`js/daily.js` — `syncDailyMonth()`:
- `catKey` ahora normaliza quitando emoji inicial con `.replace(/^\S+\s/, '')` antes de acumular en `dailyTotals`
- Garantiza que `dailyTotals['Servicio Doméstico']` coincida con `c.name` en `renderResumen()`

`js/finanzas.js`:
- `renderResumen()` refactorizada: Ahorro sale del orden de categorías, se renderiza en bloque fijo `#rAhorro` entre mini cards y semáforo
- Semáforo ahora excluye Ahorro — orden: rojo → amarillo → verde → sin presupuesto
- Nueva función `renderQuienPago()` — lee `daily/[año]/[mm]` completo, acumula por `v.who`, renderiza en `#rQuienPago` con barra proporcional, monto y % por miembro. Se oculta si no hay registros.

`index.html`:
- Agregado `<div id="rAhorro">` entre mini cards y `#resumenCats`
- Agregado `<div id="rQuienPago">` después de `#resumenCats`

**Archivos modificados:** `js/utils.js`, `js/daily.js`, `js/finanzas.js`, `index.html`
**Commit sugerido:** `feat: Resumen mejorado — ahorro arriba, quién pagó, fix Servicio Doméstico Tab Hoy`

### 📅 Fase 23 — Ingresos adicionales por miembro en Config (Junio 2026)

**Contexto:** Identificado en auditoría de nota de voz. En v1 existían ingresos adicionales (bonos, primas). En v2.2 se perdieron al reconstruir `buildIncomeFromPerfil()`. Las familias piloto necesitan poder registrar bonos e ingresos variables mes a mes.

**Decisiones de diseño:**
- Ingreso adicional vive en Config → Ingresos, no en Tab Hoy (DA-16: Config es configuración del mes)
- Agrupado por miembro — cada persona tiene su bloque independiente
- Es variable: solo vive en el mes activo (`curM`), no se proyecta
- Campo libre de nombre (Bono junio, Freelance, Arriendo…) + monto
- Editable y eliminable después de creado
- Identificado en `D.income` con flags `extra: true` y `quien: nombre`

**Cambios implementados:**

`js/ui.js` — `renderIngresosConfig()` refactorizada:
- Agrupa ingresos por miembro leyendo `perfil.miembros`
- Separa fijos (`!r.extra`) de adicionales (`r.extra`)
- Muestra badges "fijo" / "+ extra" por fila
- Botón ✏️ en fijos, botón ✏️ + × en extras
- Botón "＋ Agregar ingreso — [Nombre]" por miembro
- Ingresos sin miembro asignado (v1 legacy) aparecen al final sin badge

`js/presupuesto.js` — nuevas funciones:
- `abrirModalIngresoExtra(quien)` — abre modal con campos nombre + monto
- `cerrarModalIngresoExtra()` — cierra modal
- `guardarModalIngresoExtra()` — agrega `{ label, value, extra:true, quien, fixed:false }` a `D.income`, llama `recalc()` y `save()`
- `eliminarIngresoExtra(i)` — hace `splice` en `D.income`, llama `recalc()` y `save()`

`index.html`:
- Nuevo modal `#cfgIngExtraModal` con campos: nombre libre + monto + hint "Solo aplica para este mes"

`css/presupuesto.css`:
- Nuevas clases: `.cfg-member-section`, `.cfg-member-lbl`, `.cfg-member-divider`, `.cfg-income-badge`, `.cfg-income-extra`, `.cfg-del-btn`, `.cfg-agregar-btn`

**Archivos modificados:** `js/ui.js`, `js/presupuesto.js`, `index.html`, `css/presupuesto.css`
**Commit:** `feat: ingresos adicionales por miembro en Config — modal agregar/editar/eliminar`

---

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
- **Causa:** `crearHogar()` y `unirseHogar()` nunca persistían `nombre` ni `email`
- **Fix:** `app.js` guarda `{ nombre, email }` en `window.CURRENT_USER`; `hogar.js` escribe al crear/unirse; parche en `onHogarReady()` para hogares existentes

**Bug #20 — Vestuario y Regalos y Celebraciones ausentes en hogares migrados de v1**
- **Fix:** bloque `newCats` en `migrateCategories()` + ambas categorías en `defD()`

**Bug #21 — Servicio Doméstico ausente en Tab Hoy**
- **Causa:** `DAILY_ITEMS` en `utils.js` no incluía la clave `'🤝 Servicio Doméstico'`
- **Fix:** Agregada la clave con ítems: Salario empleada, Salario niñera, Prestaciones, Otros

**Bug #22 — dailyTotals no coincidía con c.name en Resumen**
- **Causa:** `syncDailyMonth()` acumulaba usando `v.category` con emoji (ej. `'🤝 Servicio Doméstico'`) pero `renderResumen()` busca por `c.name` sin emoji (ej. `'Servicio Doméstico'`)
- **Fix:** Normalizar `catKey` con `.replace(/^\S+\s/, '')` antes de acumular

---

## 4. Decisiones Arquitecturales

*(DA-0 al DA-13 — ver arquitectura_v2_3.md)*

**DA-14:** Tab Resumen es solo lectura — sin inputs.
**DA-15:** Login con logo oficial `logo.png`.
**DA-16:** Config solo muestra configuración — no gastos reales del mes.
**DA-17:** Siempre pedir el archivo actual antes de modificarlo — ver `REGLAS_IA.md`.
**DA-18:** Config es una vista de configuración anual — nunca filtrar ítems de fecha fija por el mes actual.
**DA-19:** Ahorro es un indicador de primer nivel en el Resumen — siempre visible en posición fija, no mezclado con el semáforo de categorías.

---

## 5. Deuda Técnica

### 🔴 Prioridad Alta — Antes del piloto
- **Onboarding tipoHogar:** Activar/desactivar categorías según tipo de hogar (C3). Hogares sin empleada no deben ver Servicio Doméstico con $0 sin contexto.

### 🟡 Prioridad Media — Post-piloto
- Exportar mes a PDF
- Exportar año completo a Excel
- Presupuesto Base se aplica automáticamente al crear mes nuevo
- Feedback in-app conectado a canal Discord (post-piloto, WhatsApp resuelve durante el piloto)
- Onboarding dinámico completo por tipo de hogar (hijos, empleados, vehículo)

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

> **Documentar los textos aprobados en la bitácora.**

> **Config es configuración anual, no vista mensual.** Los ítems de fecha fija deben mostrar siempre su budget real — DA-18.

> **Los scripts one-shot de parche son la herramienta correcta para migrar datos puntuales.**

> **El ahorro no es una categoría más — es el primer indicador de disciplina financiera.** Siempre en posición prominente, antes del semáforo de gastos — DA-19.

> **Las notas de voz del usuario son auditorías de producto.** Procesarlas sistemáticamente antes de cada piloto para convertirlas en bugs y features priorizados.

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
| [confirmar] | fix: onboarding P4 servicios/transporte — total a ítem principal |
| [confirmar] | feat: Tendencia rediseñada — daily incluido, barras dobles, promedio, insight dinámico |
| [confirmar] | fix: Config carga budget anual — ítems fecha fija muestran valor real (DA-18) |
| [confirmar] | fix: onboarding P1 — subtítulo neutro, sin plural prematuro |
| [pendiente] | feat: Resumen mejorado — ahorro arriba, quién pagó, fix Servicio Doméstico Tab Hoy |
| [pendiente] | feat: ingresos adicionales por miembro en Config — modal agregar/editar/eliminar |

---

## 8. Roadmap

| Versión | Hitos | Estado |
|---------|-------|--------|
| v2.0 | Auditoría · Visión · Documentación | ✅ |
| v2.1 | Login + Hogar + Finanzas modular (Etapas A-D) | ✅ |
| v2.2 | Etapa E: Presupuesto Base · Onboarding · Resumen rediseñado · Login nuevo | ✅ |
| v2.3 | Piloto 5-10 familias — validar con uso real | 🔲 Próximo |
| v3.0 | Planeador MVP | 🔲 |
| v4.0 | Alimentación | 🔲 |
| v5.0 | Monetización | 🔲 |

---

## 9. Próxima Sesión

**Pendiente antes del piloto:**
1. **Onboarding tipoHogar** — activar/desactivar categorías según tipo de hogar (C3). Único bloqueante restante.

**Con ese cambio el piloto v2.3 está listo para lanzar.**

---

*Organiza2 — Bitácora v2.5 | Junio 2026*
