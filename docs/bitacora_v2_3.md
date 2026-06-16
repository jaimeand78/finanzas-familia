# 📓 Organiza2 — Bitácora Técnica v2.5

> Historial completo de desarrollo, decisiones y aprendizajes
> Abril — Junio 2026

---

## 1. Resumen Ejecutivo

| ✅ Logros | 🔲 Pendientes |
|-----------|--------------|
| App PWA en producción | Piloto 5-10 familias |
| Login Google + Firebase Auth (Etapa A) | Piloto 5-10 familias |
| Modelo de Hogar + código invitación (Etapa B) | Exportar mes a PDF |
| Migración datos a hogares/ (Etapa C) | Exportar año a Excel |
| Finanzas v2 arquitectura modular (Etapa D) | |
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
| feat: C3 — P1.5 flags de perfil, filtro categorías/ítems por hogar ✅ | |
| fix: Bug #23 — onboarding soltero muestra un solo campo de ingreso ✅ | |
| feat: Mi hogar con tipo + botones "Actualizar categorías" / "Cambiar tipo" ✅ | |
| fix: Tab Hoy filtra ítems de vehículo según tieneVehiculo ✅ | |
| fix: Tab Resumen usa categorías filtradas por perfil ✅ | |
| fix: abrirCompletarPerfil no sobreescribe ingresos (_soloFlags) ✅ | |
| fix: Bug #40 — renderHormiga categorías sin emoji duplicado ni nombre v1 ✅ | |
| fix: Bug #41 — P1.5 header simple y "Guardar cambios" en flujos _solo ✅ | |
| fix: Bug #42 — "Actualizar mi hogar" (P1+P1.5) y "Reconfigurar presupuesto 🧹" ✅ | |
| fix: Bug #43 — barra progreso 1-4, sin barra P1/P1.5, 3 flujos Config ✅ | |
| fix: `who` usa nombre canónico del hogar en lugar de displayName Google ✅ | |
| feat: tab "Resumen" renombrado a "Cómo vamos" — diseño simplificado ✅ | |
| feat: barra de progreso gastado/presupuesto reemplaza mini cards ✅ | |
| feat: semáforo muestra solo rojos/amarillos + "El resto van bien" ✅ | |
| feat: sub-tab "¿Quién pagó?" en Análisis — balance proporcional por ingresos ✅ | |
| fix: A2 eduFlag — Pareja/Soltero no guardan tieneEducacion:true ✅ | |
| fix: A3 — filtro C3 aplicado en Config y Semáforo ✅ | |
| fix: C2 _soloHogar huérfano eliminado de _tpl15 ✅ | |
| fix: C5 textos — Registren y desglosas ✅ | |
| feat: Servicio Doméstico — Intereses Cesantías, Cesantías, Prima Junio/Dic + DA-10 ✅ | |
| refactor: inline styles → CSS — index.html de 51 a 19 atributos style ✅ | |

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

**Estado:** App en producción en `organiza2.github.io/hogar`
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
- **Causa:** `syncDailyMonth()` acumulaba usando `v.category` con emoji pero `renderResumen()` busca por `c.name` sin emoji
- **Fix:** Normalizar `catKey` con `.replace(/^\S+\s/, '')` antes de acumular

**Bug #23 — Onboarding P3 mostraba dos campos de ingreso para hogar Soltero**
- **Causa:** `_tpl3()` siempre renderizaba dos campos sin verificar `tipoHogar`
- **Fix:** Condicionar segundo campo con `!esSoltero`

**Bug #24 — `guardarPresupuestoBase` sobreescribía ingresos al completar perfil**
- **Causa:** `_aplicarOnbDataAD()` se ejecutaba con `inc1/inc2` vacíos al venir de `abrirCompletarPerfil`
- **Fix:** Flag `_soloFlags: true` omite `_aplicarOnbDataAD()` y `save()` — DA-20

**Bug #25 — Ingresos SNBDPA borrados por `save()` prematuro**
- **Fix:** Restaurados manualmente vía consola del navegador con `db.ref(...).set([...])`

**Bug #26 — `onbNext` navegaba a P2 aunque `_soloFlags: true`**
- **Fix:** Detectar `_soloFlags` en `onbNext` y llamar `guardarPresupuestoBase()` directo

**Bug #27 — Toggle switch apagado invisible**
- **Causa:** `background: var(--color-border-secondary)` era casi transparente
- **Fix:** Color explícito `#B4B2A9`

**Bug #28 — `onclick="onbToggle(key, this)"` no funcionaba en móvil**
- **Fix:** `id="sw-${key}"` en cada switch + `getElementById('sw-' + key)` en handler

**Bug #29 — `renderResumen` usaba `D.categories` sin filtrar**
- **Fix:** Usar `window._catsFiltradas` calculado en `renderAll()`

**Bug #30 — `populateItemSel` no filtraba ítems de vehículo**
- **Fix:** Lista `ITEMS_VEHICULO` y filtro por `tieneVehiculo` en `populateItemSel()`

**Bug #31 — Campo `tipo` en Firebase vs `tipoHogar` en código**
- **Fix:** Fallback `meta.tipo || meta.tipoHogar` en todas las lecturas

**Bug #32 — Nombres de miembros en mayúsculas (ANNY)**
- **Fix:** Comparación `.toLowerCase()` + capitalizar primer letra en display

---

### 📅 Fase 24 — C3 completo: filtro de categorías por perfil del hogar (Junio 2026)

**Decisiones clave:**
- P1.5 nueva pantalla entre P1 y P2 con 4 toggles: Vehículo, Servicio Doméstico, Educación (solo Familia), Seguros
- Flags en `hogares/[codigo]/perfil/`: `tieneVehiculo`, `tieneEmpleada`, `tieneEducacion`, `tieneSeguros`, `perfilCompleto`
- Transporte siempre visible — sin vehículo muestra solo "Transporte público" y "Otros"
- Hogares existentes: banner azul "Completa tu perfil" una sola vez al propietario
- Config → Mi hogar: "Actualizar categorías" (P1.5) y "Cambiar tipo de hogar" (onboarding completo)
- Botón "Reconfigurar 🧹" eliminado del footer de Presupuesto base

**Archivos modificados:** `js/presupuesto.js`, `js/app.js`, `js/finanzas.js`, `js/daily.js`, `js/ui.js`, `css/presupuesto.css`, `index.html`

---

## 4. Decisiones Arquitecturales

*(DA-0 al DA-13 — ver arquitectura_v2_3.md)*

**DA-14:** Tab Resumen es solo lectura — sin inputs.
**DA-15:** Login con logo oficial `logo.png`.
**DA-16:** Config solo muestra configuración — no gastos reales del mes.
**DA-17:** Siempre pedir el archivo actual antes de modificarlo — ver `REGLAS_IA.md`.
**DA-18:** Config es una vista de configuración anual — nunca filtrar ítems de fecha fija por el mes actual.
**DA-19:** Ahorro es un indicador de primer nivel en el Resumen — siempre visible en posición fija, no mezclado con el semáforo de categorías.
**DA-20:** `_soloFlags: true` en `_onbData` indica flujo de solo actualización de flags — nunca llama `_aplicarOnbDataAD()` ni `save()`.

---

## 5. Deuda Técnica

### 🟡 Prioridad Media — Post-piloto
- Indicador visual de ítems que varían por mes (cesantías, SOAT, predial) en Config
- Exportar mes a PDF
- Exportar año completo a Excel
- Presupuesto Base se aplica automáticamente al crear mes nuevo
- Feedback in-app conectado a canal Discord
- Orden de categorías e ítems por frecuencia de uso
- Modales inyectados desde JS en lugar de HTML estático (escalabilidad)

### 🟢 Prioridad Baja
- Modo oscuro
- Comparar mes actual vs mismo mes año anterior
- Historial de cambios en presupuesto por ítem
- Bug #23 verificar con cuenta nueva de Google (soltero real)

---

## 6. Aprendizajes Clave

> **Siempre pedir el archivo actual antes de modificarlo.**

> **No rehacer lo que funciona.** Cambios quirúrgicos, no rewrites completos.

> **Mockupear antes de implementar.** Iteraciones en minutos vs horas de commits.

> **Config es configuración, no edición de gastos.**

> **Una mamá mira colores, no números.**

> **El logo en el login comunica identidad. Un emoji no.**

> **Documentar los textos aprobados en la bitácora.**

> **Config es configuración anual, no vista mensual.** — DA-18.

> **Los scripts one-shot de parche son la herramienta correcta para migrar datos puntuales.**

> **El ahorro no es una categoría más — es el primer indicador de disciplina financiera.** — DA-19.

> **Las notas de voz del usuario son auditorías de producto.** Procesarlas sistemáticamente antes de cada piloto.

> **`_soloFlags` es el patrón correcto para flujos parciales del onboarding.** Nunca asumir que un flujo parcial puede llamar funciones de guardado completo — DA-20.

> **Siempre verificar en Firebase antes de asumir pérdida de datos.** Los datos pueden estar intactos aunque la UI no los muestre.

---

## 7. Historial de Commits

| Hash | Descripción |
|------|-------------|
| *(ver commits anteriores)* | Etapas A-D |
| 0bf4024 | feat: Etapa E — Presupuesto Base, onboarding 5 pantallas, DAILY_ITEMS |
| [confirmar] | feat: Resumen mejorado — ahorro arriba, quién pagó, fix Servicio Doméstico Tab Hoy |
| [confirmar] | feat: ingresos adicionales por miembro en Config — modal agregar/editar/eliminar |
| [confirmar] | fix: P3 onboarding oculta segundo ingreso para hogar Soltero |
| [confirmar] | feat: C3 onboarding P1.5 — flags perfil, filtro categorias por hogar, completa tu perfil |
| [confirmar] | fix: abrirCompletarPerfil guarda directo desde P1.5 sin navegar resto del onboarding |
| [confirmar] | fix: toggles P1.5 usan id fijo y getElementById para compatibilidad movil |
| [confirmar] | fix: toggle switch apagado color gris explicito para mayor contraste |
| [confirmar] | fix: renderResumen usa categorias filtradas por perfil del hogar |
| [confirmar] | fix: Tab Hoy filtra items de vehiculo en Transporte segun tieneVehiculo |
| [confirmar] | fix: Transporte sin vehiculo muestra solo Transporte publico y Otros |
| [confirmar] | feat: Mi hogar con tipo + botones actualizar categorias y cambiar tipo de hogar |
| [confirmar] | fix: espaciado cfg-info-row y eliminar boton Reconfigurar de presupuesto base |
| — | docs: marcar pendientes pre-piloto como resueltos — README actualizado a v2.3 |
| — | chore: simplificar título de la app |
| — | ui: reemplazar marca Finanzas por Organiza2 en topbar y manifest |

---

## Fase 25 — Alineación de identidad de marca (Junio 2026)

**Contexto:** Revisión pre-piloto de coherencia entre la visión del producto ("Organiza2 no es una app financiera") y los artefactos visibles al usuario.

**Hallazgos:**
- `<title>` decía "Organiza2 — Finanzas" → desalineado con identidad redefinida
- Topbar mostraba "💰 Finanzas" → primer impacto visual incorrecto
- `manifest.json` tenía `name: "Finanzas — Organiza2"` y `description: "Control de Finanzas Familiares"`
- Documentación (`producto_v2_3.md`, `README_v2_3.md`) desactualizada respecto al estado real

**Cambios aplicados:**
- `index.html`: `<title>` → `Organiza2`; topbar → ícono `icono-181.png` + "Organiza2"
- `manifest.json`: `name` → "Organiza2"; `description` → "Organizamos tu vida en pareja."
- `docs/README_v2_3.md`: versión v2.2 → v2.3; tabla de módulos completada con C3, Config, Análisis
- `docs/producto_v2_3.md`: Sección 11 — pendientes pre-piloto marcados como ✅ resueltos

**Promesas del login validadas:** Las tres promesas ("Saben en qué se va el dinero", "Deciden juntos sin sorpresas", "Paz mental a fin de mes") están alineadas con la visión. No requieren cambio.

**Decisión:** La identidad visible de la app ahora es coherente con la visión de plataforma de organización familiar, no app financiera.

---

## Fase 26 — Bugs pre-piloto resueltos (Junio 2026)

**Contexto:** Revisión exhaustiva antes del lanzamiento del piloto. Detectados y resueltos 6 bugs funcionales y 2 de diseño.

### Commits
| Commit | Descripción |
|--------|-------------|
| — | fix: bugs pre-piloto — onboarding, Config, ingresos, transporte |
| — | docs: Fase 26 — bugs pre-piloto resueltos |

### Bugs resueltos

**Bug #33 — P1 onboarding sin botón Cancelar**
- **Causa:** `_tpl1()` solo tenía botón "Continuar", sin forma de cerrar el modal
- **Fix:** Agregado botón Cancelar en footer de P1
- **Archivo:** `presupuesto.js`

**Bug #34 — `defD()` Transporte incompleto**
- **Causa:** Solo tenía Gasolina y Transporte público — faltaban Peajes, Parqueadero, Mantenimiento, Cuota crédito
- **Fix:** Agregados los 4 ítems faltantes en `defD()`
- **Archivo:** `finanzas.js`

**Bug #35 — Restaurantes en Alimentación**
- **Causa:** `defD()` heredado de v1 tenía Restaurantes en Alimentación
- **Fix:** Eliminado de Alimentación — pertenece a Entretenimiento
- **Archivo:** `finanzas.js`
- **Nota SNBDPA:** requiere limpieza manual en Firebase

**Bug #36 — Modal Config no muestra ítems de fecha fija**
- **Causa:** `abrirModalCategoria` usaba solo `D` (mes actual) — ítems con `months[]` de otros meses no aparecían
- **Fix:** Modal cruza `defD()` + `D`; ítems de otro mes se muestran deshabilitados con badge del mes
- **Archivo:** `presupuesto.js`

**Bug #37 — Onboarding no precarga valores al reconfigurar**
- **Causa:** `_leerDActual()` tenía 3 labels incorrectos: `Arriendo / Hipoteca`, `Combustible`, `Ahorro programado`
- **Fix:** Corregidos a `Hipoteca / Arriendo`, `Gasolina`, `Ahorro mensual`
- **Archivo:** `presupuesto.js`

**Bug #38 — Ingresos adicionales aparecen antes del ingreso base**
- **Causa:** `r.quien === mbr.nombre` fallaba por diferencias de capitalización (ANNY vs Anny)
- **Fix:** Comparación normalizada con `.toLowerCase().includes(primerNombre)`
- **Archivo:** `ui.js`

**Bug #39 — Sección "Configuración del hogar" mezclada con Mi hogar**
- **Causa:** Botones vivían dentro de `renderConfigHogar()` sin separación visual
- **Fix:** Nueva sección colapsable "🔄 Configuración del hogar" al final de Config con diseño de filas tipo texto
- **Archivos:** `ui.js`, `index.html`, `presupuesto.css`

---

## Fase 27 — Sincronización de catálogos DAILY_ITEMS / defD() / onboarding (Junio 2026)

**Contexto:** Durante la preparación del piloto se detectó que `defD()`, `DAILY_ITEMS` y `_aplicarOnbDataAD()` nunca estuvieron sincronizados. La causa raíz fue que crecieron de forma independiente desde v1 sin una revisión cruzada. El problema estaba oculto porque `migrateCategories()` parcheaba los datos de SNBDPA en tiempo real. Al limpiar `pl/` y arrancar desde cero, el problema quedó completamente expuesto.

**Decisiones de producto tomadas:**
- Catálogo único y definitivo — `DAILY_ITEMS` y `defD()` son idénticos en categorías e ítems
- Regla de nomenclatura: primera letra de cada palabra principal en mayúscula (ej. `Frutas y Verduras`)
- `Entretenimiento` renombrado a `Entretenimiento y Salidas`
- `Servicio doméstico` eliminado de Vivienda — tiene su propia categoría
- `Salario empleada` + `Salario niñera` → `Salario` (agrupador único)
- Alimentación: `Mercado` reemplazado por `Frutas y Verduras` · `Aseo y Víveres` · `Loncheras`
- Onboarding P5 "Mercado y loncheras" → divide el valor en 3 partes iguales entre los tres ítems
- Transporte: `Gasolina` → `Combustible` (más genérico)
- Ahorro: `Ahorro mensual` → `Ahorro Programado` + `Fondo Emergencia`
- `Otros` solo en `DAILY_ITEMS` — no en `defD()`
- Educación y Servicio Doméstico agregadas como categorías completas en `defD()`
- Seguros e Impuestos: labels separados (`Seguro de Vida`, `Seguro de Hogar`, `Seguro Vehículo`)

**Archivos modificados:**

| Archivo | Cambio |
|---------|--------|
| `js/finanzas.js` | `defD()` reescrito completo — 11 categorías, 60+ ítems sincronizados |
| `js/utils.js` | `DAILY_ITEMS` sincronizado · `ITEM_RENAMES` expandido · `migrateCategories` actualizada · `ICONS` actualizado |
| `js/presupuesto.js` | `_aplicarOnbDataAD()` labels corregidos · mercado÷3 · `_leerDActual()` actualizado · Bug #36 Opción B (`_getOrCreateItem`) · Botón Cancelar P1 · `tieneBudget` detección |
| `js/daily.js` | `ITEMS_VEHICULO` labels actualizados |

**Limpieza Firebase SNBDPA:**
- `pl/2025` eliminado — sin datos reales, legacy de v1
- `pl/2026` eliminado — datos legacy con labels incorrectos de v1
- `hogares/SNBDPA/pl/2026` · Restaurantes eliminado de Alimentación (12 meses)
- Hogar reconfigurado desde cero con catálogo v2 limpio

**Commits:**
| Commit | Descripción |
|--------|-------------|
| 9fe42ff | fix: bugs pre-piloto — onboarding, Config, ingresos, transporte |
| 705d2ff | fix: modal Config crea ítems nuevos en D al editar — Bug #36 Opción B |
| — | fix: quitar Restaurantes de Alimentación en defD |
| — | fix: detectar presupuesto no configurado por budget=0 |
| — | fix: label Combustible → Gasolina en _aplicarOnbDataAD |
| — | fix: quitar Restaurantes de migrateCategories |
| 5b77a5e | fix: sincronizar defD(), DAILY_ITEMS y onboarding — catálogos unificados v2 |

**Lección aprendida:** `defD()`, `DAILY_ITEMS` y `migrateCategories` son tres artefactos del mismo catálogo — deben modificarse siempre juntos. Cualquier cambio en uno requiere revisión de los otros dos. Documentar esta regla en `REGLAS_IA.md`.

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

## Fase 31 — Fixes pre-piloto: auditoria v2.3 (Junio 2026)

**Contexto:** Auditoria técnica completa `auditoria_v2_3_junio2026.md`. Se resuelven los tres hallazgos críticos pre-piloto (A1, A2, A3) y dos items de limpieza (C2 y C5).

### Commits
| Commit | Descripción |
|--------|-------------|
| — | fix: A2 eduFlag + A3 filtro Config y Semáforo + C2 _soloHogar + C5 textos |
| — | docs: Fase 31 + reglas Firebase + arquitectura §8 |

### Hallazgos resueltos

**A1 — Reglas de seguridad Firebase** (consola Firebase)
- **Problema:** Las reglas desplegadas tenían `.read: "auth !== null"` en `$codigoHogar` — cualquier usuario autenticado podía leer y escribir en hogares ajenos. La condición de write usaba `|| !data.child('miembros').child(auth.uid).exists()` que siempre evalúa `true`, dejando escritura completamente abierta.
- **Fix:** Reglas nuevas con cuatro niveles de acceso:
  - `$codigoHogar .read` — solo miembros (cubre `loadHogar`)
  - `meta .read` — cualquier auth (cubre validación de código en `unirseHogar`)
  - `meta .write` — hogar nuevo (`!data.exists()`) o miembro
  - `miembros/$uid .read/.write` — solo propio uid (cubre join antes de ser miembro)
  - `perfil .write` — hogar nuevo (`!meta.exists()`) o miembro (cubre `crearHogar` atómico)
  - `pl/daily/hist .write` — solo miembros
  - Nodos raíz v1 (`pl/daily/viaje/hist`) — bloqueados completamente (`false`)
- **Verificación:** `permission_denied` confirmado desde consola del navegador en hogar ajeno.
- **Archivo histórico:** `docs/firebase-rules.json`

**A2 — Bug: hogares Pareja/Soltero guardaban tieneEducacion: true** (`presupuesto.js`)
- **Causa:** El toggle de Educación no se renderiza cuando `tipoHogar !== 'familia'`, por lo que `_onbData.tieneEducacion` queda `undefined`. La expresión `undefined !== false` evalúa a `true`, guardando el flag como activo para todos los hogares no-familia.
- **Fix:** `const eduFlag = (_onbData.tipoHogar === 'familia') ? (_onbData.tieneEducacion !== false) : false;` — aplicado en `updates` y en `window.HOGAR.perfil` dentro de `guardarPresupuestoBase()`.
- **Archivos:** `presupuesto.js` (~línea 517)

**A3 — Filtro C3 no aplicado en Config ni en Semáforo** (`presupuesto.js`, `analisis.js`)
- **Decisión de producto:** Opción A — aplicar el filtro en Config y Análisis para consistencia total.
- **Fix renderConfigPresupuesto:** `catsVisibles = filtrarCategoriasPorPerfil(D.categories || [])` para display y totalGlobal. El `ci` pasado a `abrirModalCategoria` se deriva con `D.categories.findIndex(c => c.name === cat.name)` para mantener el índice original de D — no el índice filtrado.
- **Fix _renderSemaforoConData:** `_catsF = filtrarCategoriasPorPerfil(data.categories)` para tExp, tBud y el listado de categorías. Comportamiento ahora idéntico a `renderResumen`.
- **Archivos:** `presupuesto.js` (~línea 668), `analisis.js` (~línea 53)

**C2 parcial — `_soloHogar` huérfano en `_tpl15()`** (`presupuesto.js`)
- **Causa:** Fase 29 reemplazó el flag `_soloHogar` por `_soloTipo`, pero la condición en `_tpl15` aún lo referenciaba. Nada lo seteaba.
- **Fix:** `const esSolo = d._soloFlags;` (eliminado `|| d._soloHogar`).
- **Archivos:** `presupuesto.js` (~línea 169)

**C5 — Errores de texto en `presupuesto.js`**
- `'Regístren'` → `'Registren'` en `_tplResumen` (tilde incorrecta en imperativo).
- `'desglosás'` → `'desglosas'` en `_tpl4` (voseo; la app usa tuteo en todo el flujo).
- **Archivos:** `presupuesto.js` (~líneas 293, 386)

### Estado auditoria post-Fase 31
| Hallazgo | Estado |
|----------|--------|
| A1 — Reglas Firebase | ✅ Resuelto — publicado en consola Firebase |
| A2 — Flag Educación | ✅ Resuelto |
| A3 — Filtro Config + Semáforo | ✅ Resuelto |
| B1–B5 | 🔲 Post-piloto |
| C1 — ~150 líneas muertas finanzas.js | 🔲 Post-piloto |
| C2 — vKey(), raw(), _soloHogar | ✅ _soloHogar resuelto · vKey() y raw() post-piloto |
| C3 — cleanDuplicates/applyFixedYear | 🔲 Post-piloto |
| C4 — 'Otros' en defD() Servicio Doméstico | ✅ Resuelto — Fase 32 |
| C5 — Textos | ✅ Resuelto |
| C6 — Manifest / viewport | 🔲 Post-piloto |
| D1–D4 — Docs | 🔲 Post-piloto |

**🚀 Todos los críticos resueltos — piloto puede arrancar.**

---

## Fase 32 — Servicio Doméstico: estructura final pre-piloto (Junio 2026)

**Contexto:** Pre-piloto. Se definen los ítems definitivos de Servicio Doméstico con tres iteraciones en la misma sesión. Se aclara la distinción DA-10 (Otros en daily sí, en presupuesto no).

### Commits
| Commit | Descripción |
|--------|-------------|
| — | feat: Servicio Domestico — Intereses Cesantias, Cesantias, Prima + fix Prestaciones fixed:true + C4 Otros |
| — | fix: Servicio Domestico — Prima separada en Junio/Diciembre + devolver Otros |
| — | fix: Servicio Domestico — quitar Otros de defD y ensure, DA-10 correcta |
| — | docs: Fase 32 |

### Decisiones de producto

**Prestaciones (EPS + ARL):** se mantiene como ítem separado de las obligaciones anuales. No es redundante — cubre las cotizaciones mensuales al sistema de seguridad social. Corregido de `fixed:false` → `fixed:true`.

**Prima separada en dos ítems:** en Colombia se pagan dos primas semestrales independientes. Tenerlas como un solo ítem `months:[5,11]` impedía presupuestarlas por separado. Se separaron en `Prima Junio` y `Prima Diciembre`.

**Otros — distinción DA-10 confirmada:** `Otros` existe en `DAILY_ITEMS` para registrar gastos imprevistos (horas extras, uniformes, transporte nocturno). No existe en `defD()` porque si no se sabe cuánto va a ser ni si ocurrirá, no tiene sentido presupuestarlo — contaminaría el total del mes con un número inventado.

### Cambios finales — tres artefactos simultáneos (DA-10)

**`defD()` en `finanzas.js`**
- `Prestaciones` — `fixed:false` → `fixed:true`
- Agregados: `Intereses Cesantías` (months:[0]), `Cesantías` (months:[1]), `Prima Junio` (months:[5]), `Prima Diciembre` (months:[11])
- Eliminados: `Prima` (combinada), `Otros`

**`DAILY_ITEMS` en `utils.js`**
- Agregados: `'Intereses Cesantías'`, `'Cesantías'`, `'Prima Junio'`, `'Prima Diciembre'`
- `'Otros'` se conserva (DA-10)

**`migrateCategories()` en `utils.js`**
- `remove`: nombres v1 (Empleada/Niñera), `'Prima'` (combinada), `'Otros'`
- `ensure`: 6 ítems con estructura final

### Incidente SNBDPA — limpieza manual Firebase
Durante el desarrollo se desplegó una versión intermedia con `Prima` (months:[5,11]) que quedó escrita en Firebase antes de ser removida. Al desplegar el fix, `migrateCategories` no ejecutó el `remove` porque todos los `ensure` ya estaban satisfechos. Se limpió manualmente vía consola del navegador.

**No afecta familias del piloto** — sus hogares son nuevos y nunca tuvieron `Prima` combinada.

**Lección registrada:** cuando un ítem cambia de nombre o se divide en commits consecutivos sobre un hogar activo, limpiar Firebase manualmente si ya se había desplegado la versión intermedia.

### Estructura final Servicio Doméstico
| Ítem | Tipo | Mes | Artefacto |
|------|------|-----|-----------|
| Salario | fixed mensual | — | defD + DAILY |
| Prestaciones (EPS/ARL) | fixed mensual | — | defD + DAILY |
| Intereses Cesantías | fixed anual | Enero | defD + DAILY |
| Cesantías | fixed anual | Febrero | defD + DAILY |
| Prima Junio | fixed semestral | Junio | defD + DAILY |
| Prima Diciembre | fixed semestral | Diciembre | defD + DAILY |
| Otros | — | — | solo DAILY |

---

## Fase 33 — Refactor: inline styles → CSS (Junio 2026)

**Contexto:** Pre-piloto. Se mueven los estilos inline de `index.html` a los archivos CSS correspondientes. De 51 atributos `style=` quedan solo 19, todos únicamente `display:none` controlados por JS — no se pueden mover sin cambiar los archivos JS.

### Commit
```
refactor: mover inline styles a CSS — solo display:none queda inline
```

### Archivos modificados
| Archivo | Cambio |
|---------|--------|
| `index.html` | 51 → 19 atributos `style=` (solo `display:none`) |
| `css/login.css` | Clases onboarding hogar: `#hogarScreen`, `.hogar-title`, `.hogar-sub`, `.hogar-btns`, `.hogar-radio-group`, `.hogar-step-title`, `.btn-hogar-primary`, `.paso-conf*` |
| `css/base.css` | `.topbar-logo-img`, `#pwab` |
| `css/finanzas.css` | `.modal-overlay`, `#presupuestoModal` (z-index:300), `#bannerPerfilCompleto`, `.banner-perfil-*`, `#rDisp`, `.r-sec-header`, `.r-disp-label`, `#rProgreso`, `#rAhorro`, `#resumenCats` |
| `css/presupuesto.css` | `.modal-text-input`, `.cfg-modal-row-mt`, `.modal-hint` |

### Decisiones
- `display:none` se mantiene inline — es el estado inicial que JS controla con `element.style.display = 'flex'/'none'`. Moverlo a CSS requeriría cambiar la lógica de toggle en todos los JS.
- `.modal-overlay` unifica el estilo de los 4 modales que tenían el mismo bloque de 7 propiedades repetido. `#presupuestoModal` sobreescribe `z-index` a 300 (vs 310 de los otros).
- Probado localmente con Live Server en `localhost:5500` antes de subir a `main`.

---

## 9. Próxima Sesión

**El piloto v2.3 está listo para lanzar.** No hay bloqueantes técnicos pendientes.

**Antes de lanzar:**
- Verificar onboarding completo end-to-end en SNBDPA (post limpieza de pl/)
- Confirmar que Tab Hoy, Resumen y Análisis muestran datos correctos con catálogo v2

**Al arrancar el piloto:**
- Mensaje de invitación redactado y aprobado (bit.ly/Organiza2)
- Grupo WhatsApp "Organiza2 · Piloto Familias" creado
- Canal de feedback activo durante 4 semanas
- Criterios de éxito: 3 semanas de uso continuo, al menos 3 familias registrando gastos diariamente

**Post-piloto según feedback:**
- Indicador visual de ítems que varían por mes
- Orden de categorías por frecuencia de uso
- Feedback in-app con Discord
- Personalización: agregar ítems propios al presupuesto (v1 feature, deferred)
- Documentar regla en REGLAS_IA.md: defD() + DAILY_ITEMS + migrateCategories siempre se modifican juntos

## Fase 28 — Bugs pre-piloto: Hormiga, onboarding _soloHogar, botones Config (Junio 2026)

**Contexto:** Revisión de la app antes del lanzamiento del piloto. Detectados 3 bugs funcionales/UX.

### Commits
| Commit | Descripción |
|--------|-------------|
| — | fix: bugs #40 #41 #42 — hormiga categorías, onboarding soloHogar, botones Config |
| — | docs: Fase 28 |

### Bugs resueltos

**Bug #40 — renderHormiga mostraba categorías con emoji duplicado o nombre v1**
- **Causa:** `v.category` en Firebase incluye emoji de prefijo (ej. `"🍿 Entretenimiento y Salidas"`). Al usarlo como clave de agrupación, ICONS no encontraba la entrada y el emoji se duplicaba. Registros anteriores a Fase 27 tenían nombres v1 (`"Entretenimiento"`) sin mapeo.
- **Fix:** Normalizar `v.category` al leer: quitar emoji con `.replace(/^\S+\s/, '')` y aplicar `CAT_RENAMES` para mapear v1 → v2.
- **Archivos:** `utils.js` (nuevo `CAT_RENAMES`), `analisis.js` (línea 260)

**Bug #41 — P1.5 mostraba "1 de 5" y "Continuar →" al venir de _soloFlags/_soloHogar**
- **Causa:** `_tpl15()` siempre renderizaba `_prog(1)` y el botón "Continuar →" sin importar el contexto, generando confusión — el usuario esperaba 4 pasos más.
- **Fix:** En `_tpl15()`, detectar `_soloFlags || _soloHogar` → reemplazar barra de progreso por header simple "Actualizar mi hogar" y cambiar botón a "Guardar cambios".
- **Archivos:** `presupuesto.js`, `presupuesto.css` (nueva clase `.onb-solo-header`)

**Bug #42 — Botones "Configuración del hogar" con nombres confusos**
- **Causa:** "Actualizar categorías" no es lenguaje de usuario final; "Cambiar tipo de hogar" sugería una acción limitada cuando en realidad lanzaba todo el onboarding.
- **Fix:**
  - "Actualizar categorías" → **"Actualizar mi hogar"**: nuevo flujo `_soloHogar:true` — lanza P1 + P1.5, guarda `tipoHogar` en meta + flags de perfil, sin tocar ingresos ni presupuesto.
  - "Cambiar tipo de hogar" → **"Reconfigurar presupuesto 🧹"**: onboarding completo P1→P5, sin cambios de comportamiento.
- **Archivos:** `ui.js`, `presupuesto.js`

### DA-21 — Flujos de actualización del hogar

| Flag | Punto de entrada | Flujo | Qué guarda |
|------|-----------------|-------|------------|
| `_soloFlags: true` | Banner "Completa tu perfil" | Solo P1.5 | flags de perfil |
| `_soloHogar: true` | "Actualizar mi hogar" | P1 → P1.5 | tipoHogar + flags de perfil |
| *(ninguno)* | "Reconfigurar presupuesto 🧹" | P1 → P5 | todo |

## Fase 29 — Rediseño progreso onboarding + 3 flujos de configuración (Junio 2026)

**Contexto:** Durante las pruebas pre-piloto se detectó que la numeración "1 de 5" aparecía dos veces (P1 y P1.5), y que los flujos de configuración desde Config no estaban bien definidos.

### Commits
| Commit | Descripción |
|--------|-------------|
| — | fix: bug #43 — barra de progreso 1-4, sin barra en P1/P1.5, 3 flujos Config |
| — | docs: Fase 29 |

### Bug #43 — Doble "1 de 5" y flujos de configuración mal definidos

**Causa:** P1 y P1.5 ambas mostraban `_prog(1)` — el usuario veía "1 de 5" en dos pantallas consecutivas. Además los botones de Config no tenían flujos bien separados.

**Fix — Progreso:**
- P1 y P1.5: sin barra de progreso (son pantallas de configuración del hogar, previas al presupuesto)
- P2→P5: barra de progreso verde + contador "1 de 4" a "4 de 4"
- `_prog()` reescrita con barra en lugar de puntos

**Fix — Flujos Config:**

| Botón | Flujo | Flag | Qué guarda |
|-------|-------|------|------------|
| Actualizar mi hogar | Solo P1 → guardar | `_soloTipo` | `meta/tipoHogar` |
| Cambiar mi meta | Solo P2 → guardar | `_soloMeta` | `meta/reto` |
| Reconfigurar presupuesto 🧹 | P1.5 → P2 → P3 → P4 → P5 | *(ninguno)* | flags + presupuesto completo |

**DA-21 actualizado:**

| Flag | Punto de entrada | Flujo | Qué guarda |
|------|-----------------|-------|------------|
| `_soloFlags: true` | Banner "Completa tu perfil" | Solo P1.5 | flags de perfil |
| `_soloTipo: true` | "Actualizar mi hogar" | Solo P1 | tipoHogar en meta |
| `_soloMeta: true` | "Cambiar mi meta" | Solo P2 | reto en meta |
| *(ninguno)* | "Reconfigurar presupuesto 🧹" | P1.5 → P2→P5 | flags + presupuesto completo |

**Archivos:** `presupuesto.js`, `presupuesto.css`, `ui.js`

---

## Fase 30 — Rediseño "Cómo vamos" + sub-tab "¿Quién pagó?" (Junio 2026)

**Contexto:** Revisión estratégica de los tabs Resumen y Análisis. El tab Resumen tenía demasiada información para una ama de casa — mini cards frías, estado de texto redundante, categorías verdes innecesarias, y "¿Quién ha pagado?" sin contexto de balance. Se rediseñó completo con enfoque en simplicidad y claridad para el usuario no técnico.

### Decisiones de producto

| Decisión | Resultado |
|----------|-----------|
| Nombre del tab | "Resumen" → **"Cómo vamos"** (sin signos de interrogación en UI) |
| Mini cards "Ingresan / Gastado" | Eliminadas → reemplazadas por **barra de progreso** gastado/presupuesto |
| Estado "Van bien 🟢 / Ojo con el gasto" | Eliminado — redundante con el color del número grande |
| Semáforo de categorías | Solo rojos/amarillos visibles → verdes ocultos con "El resto van bien ✅" |
| "¿Quién ha pagado?" | Movido a **sub-tab propio en Análisis** con balance proporcional |
| Campo `who` en gastos diarios | Corregido: usa `HOGAR.miembros[uid].nombre` en lugar de `displayName` de Google |

### Sub-tab "¿Quién pagó?" — diseño

- Balance global por miembro con barras de porcentaje
- Proporción esperada calculada desde `HOGAR.miembros[uid].ingreso`
- Veredicto automático: *nivelados* / *X pagó $Y más de lo esperado*
- Desglose por categoría con barras dobles (color por miembro)
- Umbral de tolerancia: 5% del total del mes

### Commits

| Commit | Descripción |
|--------|-------------|
| `cfd3bc8` | fix: who usa nombre del hogar en lugar de displayName de Google |
| — | feat: tab Cómo vamos simplificado + sub-tab ¿Quién pagó? en Análisis |

### Archivos modificados

| Archivo | Cambio |
|---------|--------|
| `finanzas.js` | `user` se deriva de `HOGAR.miembros[uid].nombre`; `renderResumen` simplificado; `renderQuienPago` eliminado; variables muertas `rEstado/rInc/rExp` limpiadas |
| `analisis.js` | `renderQuienPago` nueva con balance proporcional + veredicto + por categoría |
| `ui.js` | `goAn()` actualizado para manejar sub-tab `who` |
| `index.html` | Tab "Cómo vamos", HTML simplificado (`rProgreso`, `rTodoBien`), sub-tab `👥 ¿Quién pagó?` |

---

*Organiza2 — Bitácora v2.5 | Junio 2026*

---

## Fase 34 — Telemetría de Piloto v2.3 (Junio 2026)

**Contexto:** Antes de arrancar el piloto, se implementa una capa mínima de telemetría para responder preguntas de producto sin crear una plataforma de analítica ni depender de herramientas de terceros (no Google Analytics, Mixpanel, Amplitude, Firebase Analytics).

### Commits
| Commit | Descripción |
|--------|-------------|
| — | feat: telemetría piloto — trackEvent + metricasPiloto (Fase 34) |
| — | docs: Fase 34 + DA-19 + reglas Firebase metricas/eventos |

### Diseño

Módulo aislado `js/telemetria.js`, independiente del resto del sistema:

- `trackEvent(tipo)` — función pública única. Escribe en `metricas/eventos/{pushId}` solo `{ tipo, timestamp, hogar, uid }`. Maneja errores silenciosamente (`.catch`/`try-catch`) — si Firebase falla, la app sigue funcionando normal.
- `window.metricasPiloto()` — función administrativa, solo consola. Lee `metricas/eventos` y devuelve `{ hogaresCreados, miembrosUnidos, onboardingCompletado, gastosRegistrados, usuariosActivos7d, hogaresCon2MiembrosActivos }`.

**Sin dashboard separado** — todo dentro de Organiza2, mismo repo, mismo deploy. Consulta semanal vía consola del navegador.

### Las 6 métricas oficiales

| Evento | Pregunta |
|--------|----------|
| `hogar_creado` | ¿La gente acepta probar Organiza2? |
| `hogar_unido` | ¿Existe colaboración real dentro del hogar? |
| `onboarding_completado` | ¿El onboarding tiene fricción aceptable? |
| `gasto_registrado` | ¿La app entra en la rutina diaria? |
| `usuario_activo` | ¿Los usuarios vuelven? (máx. 1×día×uid, via localStorage) |
| (calculada) `hogaresCon2MiembrosActivos` | ¿Ambos miembros usan la app? — derivada de `usuario_activo` + `hogar` + `uid`, no es un evento propio |

### Puntos de integración

| Archivo | Cambio |
|---------|--------|
| `telemetria.js` | **Nuevo.** `trackEvent()`, `window.metricasPiloto()` |
| `hogar.js` | `trackEvent('hogar_creado')` al final de `crearHogar()`; `trackEvent('hogar_unido')` al final de `unirseHogar()` (solo en unión nueva, no si `yaEraMiembro`) |
| `presupuesto.js` | `trackEvent('onboarding_completado')` en `guardarPresupuestoBase()`, solo si `!esFlujoParcial` (excluye `_soloFlags`, `_soloTipo`, `_soloMeta`) |
| `daily.js` | `trackEvent('gasto_registrado')` tras `db.ref(dayKey...).push(entry)` exitoso |
| `app.js` | `trackEvent('usuario_activo')` en `onHogarReady()`, gateado por `localStorage['usuario_activo_YYYYMMDD']` |
| `index.html` | `<script src="js/telemetria.js">` cargado después de `auth.js`, antes de `hogar.js` |
| `firebase-rules.json` | Nuevo nodo `metricas/eventos` — `.read`/`.write: auth != null`, `.validate` exige `tipo` (string) y `timestamp` (number) |

### Decisión: `onboarding_completado` — 1 vez por hogar, no por uid

Según el modelo de colaboración (producto_v2_3.md §7), solo el miembro 1 (creador del hogar) ejecuta el onboarding completo y llama `guardarPresupuestoBase()` con `!esFlujoParcial`. El miembro 2 ve el banner de confirmación y, si ajusta algo, pasa por Config — que usa los flujos `_soloFlags`/`_soloTipo`/`_soloMeta`, ya excluidos del evento. Por lo tanto:

> `onboarding_completado` ≈ hogares que completaron el setup inicial — no se duplica por pareja.

### Privacidad

`metricas/eventos/{pushId}` solo contiene `tipo`, `timestamp`, `hogar` (código), `uid`. Nunca montos, categorías, ítems, notas, ingresos, presupuestos, emails ni nombres.

### Bug #44 — `metricasPiloto()` solo contaba 1 evento (Junio 2026)

**Causa:** `snap.forEach(ch => eventos.push(ch.val()))` — `Array.push()` retorna la nueva longitud (número truthy). El `forEach` de Firebase Realtime Database detiene la iteración si el callback retorna un valor truthy. Resultado: solo se procesaba el primer evento del nodo.

**Fix:** `snap.forEach(ch => { eventos.push(ch.val()); });` — callback sin retorno.

**Validado en producción:** smoke test con hogar SNBDPA — `gastosRegistrados: 4`, `usuariosActivos7d: 1` tras el fix.

**Archivos:** `telemetria.js`

### Próxima sesión

- Ejecutar `await window.metricasPiloto()` cada lunes durante el piloto.
- Si se necesita ver evolución temporal o compartir métricas con Anny, considerar `admin.html` simple (mismo repo, mismo Firebase, sin nuevo deploy) — `metricasPiloto()` ya tiene la lógica de lectura lista para reusar.

---

*Organiza2 — Bitácora v2.5 | Junio 2026*

---

## Fase 35 — Editar registros del día (Junio 2026)

### Contexto

Las familias piloto pueden registrar un gasto con categoría o ítem equivocados (selección rápida en móvil). Antes solo existía borrar y volver a registrar desde cero. Se diseñó un mockup interactivo (aprobado por Jaime y Anny) y se implementó edición in-place.

### Diseño aprobado

- **Acceso:** tocar la fila completa del gasto en Tab Hoy abre el modal de edición. El botón ✕ existente sigue borrando directo, sin abrir el modal (`stopPropagation`).
- **Campos editables:** valor, categoría, ítem, nota.
- **No editables:** fecha/hora, "quién pagó" (`who`) — se mantiene el registro original.

### Implementación

`js/daily.js`:
- `dailyItemsCache` — array en memoria con los gastos del día actual, poblado en `renderDailyData()`, usado para resolver `id → item` al abrir el modal.
- `renderDailyList()` — cada `.ditem` ahora tiene `onclick="editDaily(id)"`; el botón de borrar usa `event.stopPropagation()`.
- `editDaily(id)` — abre `#dailyEditModal`, prellena valor/categoría/ítem/nota desde `dailyItemsCache`.
- `populateEditCatSel()` / `populateEditItemSel()` — mismas reglas de filtrado por flags (`tieneEmpleada`, `tieneEducacion`, `tieneSeguros`, `tieneVehiculo`) que el formulario de registro (DA-10). Si la categoría/ítem guardado ya no está en el catálogo activo (registro antiguo o flags cambiados), se inserta igual al inicio de la lista para no perder el dato.
- `onEditCatChange()` / `onEditItemChange()` / `updateEditNoteRequired()` — recarga de ítems al cambiar categoría y nota obligatoria si ítem = "Otros" (misma regla que registro nuevo).
- `guardarModalEditDaily()` — `db.ref(dayKey + '/' + id).update({amount, category, item, note})`. Si está offline, encola con `oqAdd({type:'update', ...})`.

`js/offline.js`:
- `syncOfflineQueue()` — agregado soporte para operaciones `type:'update'` (`db.ref(path).update(data)`), antes solo existían `push` y `set`.

`index.html`:
- Nuevo modal `#dailyEditModal` — mismo patrón visual que `#cfgIngExtraModal` (`cfg-modal-inner`, `cfg-modal-row`, `modal-text-input`, `onb-iw`).

`css/finanzas.css`:
- `.ditem { cursor: pointer; }` — indica que la fila es interactiva.
- `.ditem.pending { cursor: default; }` — los registros en estado optimista (sin id real) no son clicables.

### Archivos modificados

`js/daily.js`, `js/offline.js`, `index.html`, `css/finanzas.css`

### Commit sugerido

`feat: editar registros diarios (categoría, ítem, valor, nota) — Fase 35`

### Pendiente / notas

- No se tocó `syncDailyMonth()` — al editar, `refreshDaily()` + `syncDailyMonth()` recalculan totales correctamente porque leen de Firebase tras el `update`.
- Si en el futuro se permite editar "quién pagó", revisar impacto en "¿Quién pagó?" (Fase 30, lógica de balance proporcional a ingresos).

---

## Fase 36 — Cierre de hallazgos críticos de auditoría (Junio 2026)

Sesión de verificación y documentación. Los tres hallazgos críticos de `auditoria_v2_3_junio2026.md` estaban resueltos en código pero sin marcar en la auditoría ni registrar en bitácora.

### Hallazgos cerrados

| Hallazgo | Resolución |
|----------|-----------|
| A1 — Reglas Firebase | `firebase-rules.json` rediseñado y desplegado. `meta` abierta a lectura para autenticados (flujo de unirse); resto del hogar restringido a miembros. Nodos raíz v1 bloqueados. Nodo `metricas/eventos` con validación de estructura. |
| A2 — Educación en Pareja/Soltero | `eduFlag` forzado a `false` si `tipoHogar !== 'familia'` en `presupuesto.js`. |
| A3 — Filtro C3 en Config y Análisis | Opción A implementada: `filtrarCategoriasPorPerfil()` aplicado en `renderConfigPresupuesto`, `abrirModalCategoria` y Semáforo de Análisis. |
| B4 — Archivos en Fuentes | `finanzas.css` y `REGLAS_IA.md` confirmados en proyecto Claude. |
| C5 — Textos | "Regístren" → "Registren" y "desglosás" → "desglosas" corregidos en `presupuesto.js`. |
| D5 — Pendientes pre-piloto | Restauración de ingresos SNBDPA: decisión tomada de borrar presupuesto y conservar solo `daily/`; hogar reconfigurado desde la app. Verificación E2E de C3: hecha en producción. |

### Archivos modificados

| Archivo | Cambio |
|---------|--------|
| `auditoria_v2_3_junio2026.md` | A1, A2, A3 marcados ✅; tabla de orden de ejecución actualizada con estados reales |
| `bitacora_v2_3.md` | Este registro (Fase 36) |

### Commit

```
docs: cierre hallazgos críticos auditoría A1 A2 A3 — Fase 36
```

---

## Fase 37 — Eliminación de logH / hKey / nodo hist (Junio 2026)

**Contexto:** El nodo `hist/` acumulaba un log de cada gasto registrado pero ningún módulo lo leía. La Tendencia y el Semáforo histórico leen de `pl/` y `daily/` directamente. Decisión: eliminar.

### Cambios

| Archivo | Cambio |
|---------|--------|
| `finanzas.js` | Eliminada función `logH()` y su llamada en `updExp` |
| `daily.js` | Eliminada llamada a `logH` tras push exitoso; actualizado comentario de encabezado |
| `firebase-paths.js` | Eliminada función `hKey()`; actualizado header con nota histórica |

### Pendiente operativo

Purgar manualmente el nodo `hogares/SNBDPA/hist` desde la consola Firebase (datos huérfanos, no afecta la app).

### Commit

```
fix: eliminar logH hKey y nodo hist huérfano — Fase 37
```

---

## Fase 38 — Fix B1: Semáforo histórico incluye gastos diarios (Junio 2026)

**Contexto:** `renderSemaforo()` en `analisis.js` pasaba `{}` como totals al ver meses históricos, subestimando el gasto real. `renderTendencia` ya cargaba `daily/` correctamente — el Semáforo no.

### Cambio

Bloque `else` de `renderSemaforo()` reemplazado. Antes:
```javascript
db.ref(dKey(curYx, curMx)).once('value').then(snap => {
  const d = snap.val() || { income:[], categories:[] };
  _renderSemaforoConData(sem, d, {});  // totals vacío
});
```

Ahora: carga `pl/` y `daily/` en paralelo con `Promise.all`, acumula gastos daily por categoría normalizando sin emoji (`.replace(/^\S+\s/, '')` + `CAT_RENAMES`) y los pasa como `totals`.

### Archivos modificados

| Archivo | Cambio |
|---------|--------|
| `analisis.js` | Bloque `else` de `renderSemaforo()` — carga daily histórico |

### Commit

```
fix: semáforo histórico incluye gastos daily — Fase 38
```
