# 📓 Organiza2 — Bitácora Técnica v2.3

> Historial completo de desarrollo, decisiones y aprendizajes
> Abril — Junio 2026

---

## 1. Resumen Ejecutivo

| ✅ Logros | 🔲 Pendientes post-piloto |
|-----------|--------------------------|
| App PWA en producción | Exportar mes a PDF |
| Login Google + Firebase Auth (Etapa A) | Exportar año a Excel |
| Modelo de Hogar + código invitación (Etapa B) | Feedback in-app con Discord |
| Migración datos a hogares/ (Etapa C) | Indicador ítems variables por mes |
| **Piloto activo — Junio 2026 ✅** | Orden categorías por frecuencia |
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

## 9. Pre-Piloto — Checklist de Lanzamiento *(histórico — piloto activo desde Junio 2026)*

> ✅ El piloto v2.3 fue lanzado. Esta sección es histórica.

**El piloto v2.3 estaba listo para lanzar.** No había bloqueantes técnicos pendientes.

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

## Fase 34 — Telemetría de Piloto v2.3 (Junio 2026)

**Contexto:** Antes de arrancar el piloto, se implementa una capa mínima de telemetría para responder preguntas de producto sin crear una plataforma de analítica ni depender de herramientas de terceros (no Google Analytics, Mixpanel, Amplitude, Firebase Analytics).

### Commits
| Commit | Descripción |
|--------|-------------|
| — | feat: telemetría piloto — trackEvent + metricasPiloto (Fase 34) |
| — | docs: Fase 34 + DA-19 + reglas Firebase metricas/eventos |

> **Nota (Julio 2026):** La DA de telemetría se registró originalmente como DA-19, colisionando con la DA-19 de Ahorro. Renumerada a **DA-25** en `arquitectura_v2_3.md`. El registro del commit se conserva tal como ocurrió.

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

---

## Fase 39 — Service Worker PWA (Junio 2026)

**Contexto:** La app tenía manifest pero no SW. Instalada como PWA no abría sin conexión. La cola offline de `offline.js` solo funcionaba si la página ya estaba cargada.

### Diseño

- **Cache-first:** shell completo — `index.html`, 4 CSS, 13 JS propios, `logo.png`, `manifest.json`
- **Network-only:** Firebase CDN y Realtime Database (`gstatic.com`, `googleapis.com`, `firebasedatabase.app`, etc.) — nunca cachear
- **Fallback sin red:** devuelve `index.html` desde cache para cualquier ruta no cacheada
- **Versión de cache:** `organiza2-v2-3` — al cambiar, el activate limpia versiones anteriores

El SW complementa `offline.js` — no lo reemplaza. `offline.js` maneja la cola de gastos; el SW permite que la app abra aunque no haya red.

### Archivos modificados

| Archivo | Cambio |
|---------|--------|
| `sw.js` | **Nuevo.** Service worker con cache-first + network-only para Firebase |
| `index.html` | Registro del SW al evento `load` |

### Nota para el futuro

Al actualizar archivos del shell (CSS, JS), incrementar `CACHE_NAME` en `sw.js` (ej. `organiza2-v2-4`) para que los usuarios reciban la versión nueva.

### Commit

```
feat: service worker PWA — cache-first shell, network-only Firebase — Fase 39
```

---

## Fase 40 — Limpieza general C1 C2 C3 C6 (Junio 2026)

Sesión de limpieza de código huérfano identificado en auditoría. Un solo commit agrupa todos los cambios.

### Cambios por hallazgo

| Hallazgo | Cambio |
|----------|--------|
| C1 — Funciones muertas `finanzas.js` | Eliminadas `renderExpSecs`, `addInc`, `delInc`, `updInc`, `togFxInc`, `addCat`, `addItem`, `delItem`, `delCat`, `updExp`, `togFx` y sus llamadas en `recalc()`/`renderAll()` |
| C2 — Huérfanos | Eliminadas `vKey()` en `firebase-paths.js` y `raw()` en `utils.js` |
| C3 — Herramientas de migración | Eliminadas `applyFixedYear` y `cleanDuplicates` de `finanzas.js` |
| C4 — `Otros` en `defD()` | Ya resuelto en sesión anterior — verificado |
| C6 — Manifest y viewport | `manifest.json`: sizes corregido a `181x181`; `index.html`: eliminado `maximum-scale=1.0` |

### Archivos modificados

| Archivo | Cambio |
|---------|--------|
| `finanzas.js` | C1 + C3 — ~150 líneas eliminadas |
| `firebase-paths.js` | C2 — `vKey()` eliminada, header actualizado |
| `utils.js` | C2 — `raw()` eliminada |
| `manifest.json` | C6 — sizes corregido |
| `index.html` | C6 — viewport sin maximum-scale |

### ⚠️ CACHE_NAME debe incrementarse

Este commit modifica `finanzas.js`, `firebase-paths.js`, `utils.js` e `index.html` — todos en el SHELL del SW. Incrementar `CACHE_NAME` en `sw.js` a `organiza2-v2-4`.

### Commit

```
refactor: limpieza C1 C2 C3 C6 — funciones huérfanas y manifest — Fase 40
```

---

## Fase 41 — Bug #45: Restauración Auth Offline iOS PWA (Junio 2026)

### Problema

En iPhone con PWA instalada: cerrar completamente la app → activar modo avión → abrir Organiza2 → aparecía pantalla de Login aunque hubiera sesión válida persistida. Al presionar "Entrar con Google" no ocurría nada. Al reintentar: error `auth/cancelled-popup-request`.

Comportamiento secundario: incluso estando online, al abrir la PWA se veía un parpadeo del Login antes de entrar al hogar.

### Diagnóstico — Causa raíz confirmada

Combinación de tres factores documentados:

| Factor | Descripción |
|--------|-------------|
| **A — HTML** | `#loginScreen` era visible por defecto en el HTML. Firebase tarda 300–800ms en restaurar la sesión de `IndexedDB`. Durante ese tiempo el login ya era visible, aunque hubiera sesión. |
| **B — Firebase SDK v9** | `onAuthStateChanged` siempre emite `null` primero al arrancar — comportamiento esperado y documentado, no un bug. En iOS PWA (Safari standalone), la latencia de `IndexedDB` es mayor que en Chrome/Android. |
| **C — iOS PWA offline** | `signInWithPopup` no puede completarse offline. Al reintentar, Firebase lanza `auth/cancelled-popup-request` por popup doble pendiente. |

Hipótesis evaluadas:
- ❌ A — Race condition `setPersistence` / `onAuthStateChanged`: descartada. `setPersistence` en v9 compat es sincrónico.
- ✅ B — Safari PWA tarda más en restaurar sesión local: confirmada.
- ✅ C — `onAuthStateChanged` devuelve `null` antes de resolver usuario persistido: confirmada, comportamiento esperado.
- ✅ D — Limitación `signInWithPopup` en iOS offline: confirmada.

### Solución aplicada — cambios mínimos

**`index.html`:**
- `#loginScreen` pasa a `display:none` por defecto.
- Nuevo `#checkingScreen` visible por defecto: muestra el logo con opacidad mientras Firebase resuelve. Se oculta cuando `onAuthStateChanged` dispara (con o sin sesión).

**`js/auth.js`:**
- Nueva función `_hideChecking()`: oculta `#checkingScreen`.
- `initLogin()`: llama `_hideChecking()` antes de decidir entre `onLoginSuccess` o `showLoginScreen`. La lógica de `onAuthStateChanged` no cambia.
- `loginWithGoogle()`: bloquea el intento si `!navigator.onLine` con mensaje claro. Ignora silenciosamente `auth/cancelled-popup-request` (doble tap iOS).

**`css/login.css`:**
- Nueva clase `.checking-screen`: `position:fixed; inset:0; display:flex; align-items:center; justify-content:center; background: var(--color-bg); z-index:9999`.

### Validación esperada por caso

| Caso | Resultado esperado |
|------|--------------------|
| A — Online, cerrar y abrir | Sin parpadeo de login. `#checkingScreen` visible ~300ms, luego entra al hogar. |
| B — Offline, cerrar con sesión activa | Entra al hogar sin mostrar login. Firebase restaura sesión de `IndexedDB`. |
| C — Usuario nuevo | `#checkingScreen` breve → Login normal. |
| D — Logout, cerrar, abrir | `#checkingScreen` breve → Login normal. |
| E — Android Chrome PWA | Sin regresiones. `#checkingScreen` imperceptible (~100ms). |
| F — Chrome Desktop | Sin regresiones. |

### Archivos modificados

| Archivo | Cambio |
|---------|--------|
| `index.html` | `#loginScreen` oculto por defecto + nuevo `#checkingScreen` |
| `js/auth.js` | `_hideChecking()` nueva + `initLogin()` + `loginWithGoogle()` |
| `css/login.css` | Clase `.checking-screen` nueva al final |

### ⚠️ CACHE_NAME debe incrementarse

Este commit modifica `index.html`, `js/auth.js` y `css/login.css` — todos en el SHELL del SW. Incrementar `CACHE_NAME` en `sw.js` de `organiza2-v2-4` → `organiza2-v2-5`.

### Commit

```
fix: restauración auth offline iOS PWA — checkingScreen y popup guard — Fase 41
```

---

## Revert Fase 41 — Restauración al estado Fase 40 (Junio 2026)

### Motivo

Los cambios de Fase 41 (Fase 41 → 41f) introdujeron bugs progresivos en la autenticación:

- **Fase 41b:** fallback de `localStorage` pasaba objeto plano a `onLoginSuccess` → loop de login.
- **Fase 41c:** guard `resolved = true` bloqueaba `onAuthStateChanged` permanentemente → login y logout dejaban de funcionar tras el primer disparo.
- **Fase 41d–41e:** parches sobre los bugs anteriores sin resolver la causa raíz.
- **Fase 41f:** `signInWithRedirect` en iOS PWA mostraba "Connecting to the app" y no completaba el flujo.

La autenticación (login, logout, sesión persistida) funcionaba perfectamente antes de Fase 41. El Bug #45 era un parpadeo cosmético de ~500ms que no justificaba el riesgo de romper la autenticación.

### Decisión

Revertir `js/auth.js`, `index.html`, `css/login.css` y `sw.js` al estado del commit `0494b89` (Fase 40).

### Aprendizaje

El Bug #45 (parpadeo de login en iOS PWA offline) es una **limitación real de Firebase Auth en Safari standalone**: `onAuthStateChanged` requiere red para validar el token JWT. No tiene solución limpia sin cambiar la arquitectura de autenticación. Queda documentado como limitación conocida — no como bug a corregir.

### Archivos revertidos

| Archivo | Estado |
|---------|--------|
| `js/auth.js` | Restaurado al estado Fase 40 |
| `index.html` | Restaurado al estado Fase 40 |
| `css/login.css` | Restaurado al estado Fase 40 |
| `sw.js` | Restaurado a `organiza2-v2-4` |

### Commit

```
revert: restaurar auth al estado Fase40 — revertir Fase41
```

---

## Fase 42 — Dashboard admin piloto (Junio 2026)

**Contexto:** Con el piloto activo se necesitaba una forma de revisar las métricas semanalmente sin interpretar números en consola. Se implementó `admin.html` en la raíz del repo — mismo Firebase, sin nuevo deploy, sin dependencias adicionales.

### Diseño

- Página standalone con login Google propio (Firebase Auth compat)
- Guard por UID: solo el administrador del piloto puede acceder — cualquier otro uid ve "Sin acceso" y se desloguea automáticamente
- Lee `metricas/eventos` en tiempo real al abrir y al presionar "Actualizar"
- **Sin escritura a Firebase** — todo es derivado de los eventos existentes, calculado en cliente

### Contenido del dashboard

| Sección | Descripción |
|---------|-------------|
| 5 tarjetas métricas | Hogares creados · Onboarding completo · Hogares con 2 activos · Gastos acumulados · Usuarios activos 7d — con colores semáforo |
| Barras de progreso | Avance hacia cada exit criterion en tiempo real |
| Tabla semanal | S1–S4 calculadas automáticamente agrupando eventos por semana ISO (lunes–domingo) — sin entrada manual |
| Exit criteria | Estado de cada criterio con veredicto ok/pendiente/falla. Banner verde si todos se cumplen. |

### Lógica de semanas

`lunesDe(date)` → lunes de la semana de cualquier fecha. `semanaDelPiloto(date)` → número de semana 1-based desde `PILOTO_START` (2026-06-15). Cada semana agrupa eventos por `timestamp >= tsInicio && timestamp < tsFin`. Los datos de cada columna (hogares, con 2 activos, gastos, usuarios) se calculan sobre el slice de eventos de esa semana.

### Archivos

| Archivo | Cambio |
|---------|--------|
| `admin.html` | **Nuevo.** Dashboard completo en un solo archivo — HTML + CSS + JS inline |

### Commit

```
feat: dashboard admin piloto — admin.html (Fase 42)
docs: Fase 42 + DA-22
```

---

*Organiza2 — Bitácora v2.3 | Junio 2026*

## Fase 43 — Fix footer presupuesto base: total mes y total año (Junio 2026)

**Problema:** El footer de "Presupuesto base" en Config mostraba un único total que sumaba el valor máximo anual de cada ítem sin respetar frecuencias ni meses. Ítems de fecha fija (cesantías, SOAT, predial, primas) se sumaban como si ocurrieran todos los meses, inflando el número.

**Solución:** Dos totales en el footer, calculados correctamente con `calcPresupuestoBase` (DA-8):

- **Total mes (ej: jun)** — solo los ítems que aplican en el mes actual
- **Total año** — suma real de los 12 meses

**Decisión UX:** Se descartó agregar flechas de navegación de mes a Config — Config es configuración, no consulta histórica (DA-16). El mes se indica en la etiqueta del total.

### Archivos

| Archivo | Cambio |
|---------|--------|
| `presupuesto.js` | `totalGlobal` reemplazado por `totalMes` (vía `calcPresupuestoBase(item, curM)`) y `totalAnio` (suma de los 12 meses). Footer HTML actualizado. |
| `presupuesto.css` | `.cfg-bud-footer` en columna con dos filas. Nuevas clases: `.cfg-bud-footer-row`, `.cfg-bud-mes` (verde). |
| `sw.js` | Bump `CACHE_NAME` `organiza2-v2-4` → `organiza2-v2-5` para forzar recarga del shell. |

### Commits

```
fix: footer presupuesto base muestra total mes y total año correctos
fix: estilos footer presupuesto base para dos filas
docs: decisión §12 footer presupuesto base total mes y año
fix: bump cache v2-5 para cargar cambios presupuesto base
```

---

## Fase 44 — Fix cálculo de presupuesto en todos los tabs (Junio 2026)

**Contexto:** Al implementar la Fase 43 (footer con total mes y total año), se descubrió que el bug de cálculo de presupuesto era más profundo — afectaba "Cómo vamos", Análisis y Config. La raíz: `calcPresupuestoBase` chequeaba `frecuencia` antes que `months`, y ningún ítem tenía `frecuencia` guardada en Firebase (todos `undefined`), por lo que todos se trataban como mensuales.

**Bug raíz:** En `calcPresupuestoBase`, el orden de chequeo era incorrecto:
```js
// Antes (bug): frecuencia primero → months nunca se evaluaba
if (frec === 'mensual') return b;
if (item.months && item.months.length) { ... }

// Después (fix): months primero → fecha fija tiene prioridad
if (item.months && item.months.length) { ... }
const frec = item.frecuencia || 'mensual';
if (frec === 'mensual') return b;
```

**Bug secundario:** El presupuesto base solo existe en el nodo de junio en Firebase — no se propaga a otros meses. `loadFixed()` solo buscaba el mes inmediatamente anterior, que también estaba vacío.

**Fixes aplicados:**

| Archivo | Cambio |
|---------|--------|
| `finanzas.js` | `calcPresupuestoBase`: `months` tiene prioridad sobre `frecuencia` |
| `finanzas.js` | `recalc()`: `tBud` usa `calcPresupuestoBase(r, curM)` |
| `finanzas.js` | `renderResumen()`: `tBud` y `bud` por categoría usan `calcPresupuestoBase(r, curM)` |
| `finanzas.js` | `loadFixed()`: busca hacia atrás hasta 12 meses para encontrar mes con budgets |
| `presupuesto.js` | `tieneBudget` movido post-snapshots, usa `Object.keys(budgetAnual).length > 0` |
| `presupuesto.js` | `totalMes` y `totalAnio` calculados desde `catsVisibles` con `calcPresupuestoBase` |
| `analisis.js` | `_renderSemaforoConData` recibe `mes` como parámetro explícito |
| `analisis.js` | Fallback para meses sin datos en Firebase usa `D` con ingresos fijos respetados (`r.fixed ? r.value : 0`) |
| `analisis.js` | `tBud` y `bud` por categoría usan `calcPresupuestoBase(r, mes)` |
| `sw.js` | Bumpeado de v2-9 → v2-13 (múltiples iteraciones por orden incorrecto de commits) |

**Aprendizaje de proceso:** El bump de `sw.js` debe ser siempre el último commit, después de que todos los archivos modificados estén propagados en GitHub Pages. Subir el SW antes congela una versión bugueada en el cache.

**Resultado:** Los tres tabs muestran presupuesto correcto por mes, respetando ítems de fecha fija y proyectando ingresos fijos en meses futuros sin datos.

---

## Fase 45 — Fix visual: tamaño de fuente en totales del presupuesto base (Junio 2026)

**Contexto:** Al revisar el tab Config, se detectó que los valores de "Total mes" y "Total año" en el footer del presupuesto base aparecían con un tamaño de fuente notablemente mayor al resto del tab. El texto de la etiqueta (`.cfg-bud-total`) tenía `font-size: .78rem` correcto, pero el valor numérico (`.cfg-mono`) heredaba el tamaño base del documento por no tener `font-size` propio.

**Fix aplicado:** Se agregó `font-size: .78rem` directamente en `.cfg-bud-footer-row`, para que tanto la etiqueta como el valor hereden el mismo tamaño sin afectar otros usos de `.cfg-mono` en el resto de la app.

| Archivo | Cambio |
|---------|--------|
| `presupuesto.css` | `.cfg-bud-footer-row`: agregado `font-size: .78rem` |
| `sw.js` | Cache bumpeado de v2-13 → v2-14 |

**Aprendizaje de SW:** Esta fase sirvió como prueba intencional del ciclo de actualización de la PWA: hacer push → cerrar la app del multitarea → volver a abrir → verificar que el nuevo SW tome control y el cambio visual se refleje.

---

## Fase 46 — Alineación de documentación (Julio 2026)

**Contexto:** Auditoría de consistencia entre las instrucciones del proyecto Claude y la documentación en Fuentes. Se detectaron desactualizaciones acumuladas durante las Fases 34–45.

**Hallazgos resueltos:**
1. **Colisión DA-19:** la DA de telemetría (Fase 34) reutilizó el número DA-19, ya asignado a "Ahorro es indicador de primer nivel". Decisión: Ahorro conserva DA-19; telemetría renumerada a **DA-25**.
2. **Nombre del repo:** `REGLAS_IA.md` referenciaba `organiza2/finanzas-familia`. Corregido a `organiza2/hogar` (URL app: `organiza2.github.io/hogar`).
3. **Regla de Service Worker documentada:** bump de `CACHE_NAME` en cada deploy con cambios HTML/CSS/JS, siempre en el último commit (aprendizaje Fase 44). Agregada a `REGLAS_IA.md`, instrucciones y contexto maestro.
4. **CONTEXTO_MAESTRO actualizado:** estado "Piloto listo para lanzar" → "Piloto activo"; implementado extendido con Fases 34–45 (telemetría, SW, admin.html, edición de registros); tabla de DAs completa DA-0 a DA-25 con DA-10 en su redacción vigente (catálogo único, tres artefactos).
5. **Instrucciones del proyecto Claude actualizadas** con los mismos cambios.
6. **Regla de Arbitraje — GitHub:** el repo `main` es el árbitro final del estado real del proyecto. Ante duda, la IA verifica Fuentes contra `raw.githubusercontent.com/organiza2/hogar/main/` (verificación canario: `CACHE_NAME` de `sw.js`). Jerarquía de verdad: GitHub `main` → Fuentes → instrucciones/memoria. Agregada a `REGLAS_IA.md`, instrucciones del proyecto y contexto maestro.
7. **README alineado:** DA-10 corregida a su redacción vigente (catálogo único), piloto marcado 🔄 En curso en estado y roadmap, agregados SW/telemetría/admin/edición de registros, y precisada la ubicación de la documentación (proyecto en `docs/` · `README.md` y `REGLAS_IA.md` en la raíz). En `REGLAS_IA.md` se corrigió además la lista de docs de referencia (decía DA-0 a DA-17 y `bitacora_v2_5.md`, archivo inexistente).

| Archivo | Cambio |
|---------|--------|
| `arquitectura_v2_3.md` | DA-19 → Ahorro · DA-25 telemetría · versión 2.6 |
| `bitacora_v2_3.md` | Nota de renumeración en Fase 34 · esta entrada |
| `REGLAS_IA.md` | Repo/URL corregidos · estado piloto · Regla de Service Worker · Regla de Arbitraje |
| `CONTEXTO_MAESTRO_ORGANIZA2.md` | Estado actual + tabla DAs completa + Regla de Arbitraje |
| `README_v2_3.md` | Piloto en curso · DA-10 vigente · SW/telemetría/admin · ubicación docs |

Sin cambios de código — no requiere bump de `sw.js`.

---

## Fase 47 — Fix telemetría offline + hallazgos del piloto (Agosto 2026)

**Contexto:** Revisión de los datos reales del piloto en `admin.html` tras 9 semanas. Los números expusieron un bug de telemetría y una falla de diseño en el onboarding que ningún criterio de salida estaba capturando.

### 1. Bug corregido — gastos offline no contabilizados

`submitDaily()` en `daily.js` llamaba a `trackEvent('gasto_registrado')` únicamente en la ruta de escritura exitosa online. Las dos rutas alternas — `!navigator.onLine` (return temprano) y el `catch` de error de escritura — encolaban el gasto con `oqAdd()` pero salían sin registrar el evento.

**Efecto:** el gasto se guardaba y sincronizaba correctamente, pero la telemetría lo perdía de forma permanente. En una PWA orientada a gama media con conectividad irregular, el uso real es **mayor** que el reportado por el dashboard.

**Fix:** `trackEvent('gasto_registrado')` agregado en ambas rutas. Cambio quirúrgico, dos líneas.

| Archivo | Cambio |
|---------|--------|
| `daily.js` | `trackEvent` en rama offline y en `catch` de `submitDaily()` |
| `sw.js` | Bump `organiza2-v2-14` → `organiza2-v2-15` |

Formalizado como **DA-27**: la telemetría cubre todas las rutas de éxito funcional, no solo la online.

### 2. Hallazgo de datos — discrepancia 152 vs 74

El contador global de `admin.html` reportaba 152 gastos acumulados, mientras la tabla semanal sumaba 74 (S1–S4). La diferencia son ~78 registros en las semanas 5–10, que el dashboard **no renderiza** porque la tabla itera solo hasta `PILOTO_WEEKS = 4`.

Confirma que la telemetría siguió escribiendo — no hubo caída del sistema, sino ceguera del tablero.

### 3. Hallazgo — SNBDPA no aparece en el conteo de hogares

`trackEvent('hogar_creado')` solo se dispara en `hogar.js:36`, al crear un hogar nuevo. SNBDPA existe desde la v2.1, anterior a la Fase 34 (telemetría). El evento nunca ocurrió.

**Consecuencia:** "Hogares creados: 2" subcuenta. Los hogares reales del piloto son **3**. Esto explica la aparente inconsistencia de S2 (3 uids activos · 2 hogares · 0 hogares con 2 activos): son tres hogares con un miembro activo cada uno.

### 4. Hallazgo crítico de producto — P1 colapsa dos preguntas distintas

La pantalla P1 del onboarding (`presupuesto.js:130-138`) ofrece tres opciones cuyo subtexto mezcla dos dimensiones independientes:

| Opción | Etiqueta | Subtexto | Dimensión que describe |
|--------|----------|----------|------------------------|
| `soltero` | Solo | "Manejo mis finanzas" | **Quién opera la app** |
| `pareja` | En pareja | "Sin hijos por ahora" | Composición del hogar |
| `familia` | Familia | "Con hijos" | Composición del hogar |

Un padre casado que lleva el control financiero él solo lee *"Solo · Manejo mis finanzas"* y lo elige con honestidad — está respondiendo a la pregunta que el texto le hace.

**Consecuencia grave:** `presupuesto.js:517` fuerza `tieneEducacion = false` cuando `tipoHogar !== 'familia'`. Por DA-7 el perfil filtra toda la UX, de modo que la categoría 📚 Educación desaparece de P4, P5 y del tab Hoy. Ese usuario **no puede registrar el colegio de su hija** — probablemente su mayor gasto del año.

**Vacío adicional:** no existe casilla para padre o madre soltera con hijos. "En pareja · sin hijos" y "Familia · con hijos" no cubren ese caso.

**Fix aplicado — pregunta explícita en P1.5 (DA-26).** Se evaluaron tres opciones con mockup; ver `decisiones_junio2026.md` §15. La aprobada **no toca P1**: añade la pregunta *"¿Tienes hijos?"* en P1.5, visible únicamente cuando `tipoHogar === 'soltero'` — el único tipo cuyo subtexto habla de operación y no de composición. Es obligatoria: bloquea el botón *Continuar* hasta responderse.

| Caso | `tieneEducacion` | ¿Cambia? |
|------|------------------|----------|
| Familia | `true` | — igual que antes |
| Familia apagando el toggle | `false` | — igual que antes |
| Pareja | `false` | — igual que antes |
| **Soltero con hijos** | **`true`** | ✅ **caso corregido** |
| Soltero con hijos, apaga el toggle | `false` | nuevo, coherente |
| Soltero sin hijos | `false` | — igual que antes |

La respuesta **no se persiste** en Firebase: al reabrir `_soloFlags` se infiere de `perfil.tieneEducacion === true`. Evita un campo de esquema nuevo. La pregunta también aparece en `_soloFlags`, de modo que el hogar ya afectado **se autocorrige** desde *Actualizar mi hogar*, sin los dos pasos manuales que hacían falta.

### 5. Contexto cualitativo del piloto (más valioso que las métricas)

Razones reales por las que ningún hogar tuvo dos miembros activos:

| Hogar | Razón | Naturaleza |
|-------|-------|------------|
| SNBDPA | Celular dañado — no pudo instalar | Barrera técnica |
| Hogar 2 | *"Él llevaba el control del gasto"* | **Señal de producto** |
| Hogar 3 | Fuera del país | Circunstancia |

Dos de tres no constituyen evidencia contra la tesis del producto. La tercera sí es información: sugiere que en el hogar latino puede existir **un administrador financiero, no dos co-registradores**. Si se confirma, el criterio de salida *"≥3 hogares con ambos miembros activos"* estaría midiendo un comportamiento que quizá no deba ocurrir — y el valor para el segundo miembro sería **ver** (tab Resumen, ¿Quién pagó?), no registrar.

> ⚠️ **Salvedad:** una sola respuesta, de un solo hogar. Hipótesis a validar, no hallazgo. No se rediseñan criterios de salida con n=1.

### Defectos detectados en `admin.html`

| # | Problema | Ubicación |
|---|----------|-----------|
| 1 | Tabla semanal congelada en 4 semanas — semanas 5+ invisibles | línea 546 |
| 2 | Header muestra "Semana 4 de 4 · hasta 13 jul" desde julio | línea 392 |
| 3 | Criterio S4 anclado a la semana calendario 4, no a la última completa | línea 434 |
| 4 | `hogaresCon2` acumula histórico, no mide actividad concurrente | líneas 381-388 |
| 5 | `fmt(n)` devuelve `—` para `0` — no distingue "cero" de "sin datos" | línea 338 |
| 6 | Lectura sin límite de `metricas/eventos` | línea 352 |
| 7 | Guard de `ADMIN_UID` es solo client-side; reglas dan `.read` a todo auth | `firebase-rules.json:54` |

**Aprendizaje:** un dashboard con ventana fija se vuelve silenciosamente obsoleto. No falla, no avisa — sigue mostrando datos correctos de un período equivocado.

### Reparación de `admin.html` (misma fase)

| # | Corrección |
|---|-----------|
| 1 | La tabla semanal recorre las semanas **realmente transcurridas** (tope `MAX_FILAS = 16`), no cuatro fijas |
| 2 | Cabecera sin recorte: muestra la semana real del piloto y la fecha de inicio |
| 3 | Criterio de registro anclado a la **última semana completa**, no a la semana calendario 4 |
| 4 | Criterio de sostenimiento: *"≥ 3 hogares con 4+ semanas de registro propio"*, contadas **desde la entrada de cada hogar** — alinea el código con `producto_v2_3.md` §9 |
| 5 | `hogaresCon2` exige concurrencia en alguna semana; antes acumulaba histórico e incluía hogares abandonados |
| 6 | `fmt()` distingue `0` (dato real) de `undefined` (ausencia de dato) |
| 7 | **Sección nueva** — *"Hogares · cada uno desde su entrada"*, con columna de patrón de uso: `2 registran` / `admin + observador` / `1 solo` |

El punto 7 permite medir la hipótesis del administrador único **sin telemetría nueva**: `usuario_activo` sin `gasto_registrado` para un mismo `uid` identifica a un observador.

Pendientes de `admin.html` no abordados: lectura sin límite de `metricas/eventos` y guard de `ADMIN_UID` solo client-side (las reglas dan `.read` a cualquier `auth != null`).

### Archivos entregados en la fase

| Archivo | Cambio |
|---------|--------|
| `daily.js` | Telemetría en rutas offline — refuerza DA-25, sin DA propia |
| `presupuesto.js` | Pregunta *¿Tienes hijos?* en P1.5 + `eduFlag` desacoplado de `tipoHogar` (DA-26) |
| `presupuesto.css` | Estilos `.onb-q`, `.onb-q-t`, `.onb-q-btns` |
| `admin.html` | Ventana real de semanas, anclaje por hogar, patrón de uso |
| `producto_v2_3.md` | Panorama competitivo agosto 2026 (§3) |
| `arquitectura_v2_3.md` | DA-26 y DA-27 |
| `decisiones_junio2026.md` | §15 (opciones evaluadas y decisión adoptada) · §16 (Mascotas aplazada) |
| `REGLAS_IA.md` | Acceso al repo: límites de cuota y frescura por SHA |
| `sw.js` | Bump `v2-14` → `v2-15` → `v2-16` |

### Backlog abierto tras la fase

- **Mascotas como categoría** — propuesta y pospuesta deliberadamente. Gasto real e invisible (veterinario, alimento, vacunas, guardería), ortogonal al tipo de hogar, por lo que encajaría como flag `tieneMascotas` en P1.5. Requiere DA-10 (tres artefactos) y definir la frecuencia de cada ítem. Ventana relevante: conviene **antes** de reclutar la fase 2, para que los hogares nuevos la reciban sin migración
- `_tx()` sigue atado a `tipoHogar === 'soltero'` — lenguaje singular para quien administra solo aunque viva en pareja
- Sin casilla propia para madre o padre soltero con hijos en P1

---

## Fase 48 — Versión visible y aviso de actualización (Agosto 2026)

**Contexto:** durante el piloto no había forma de saber qué versión tenía una familia sin pedirle que abriera las herramientas de desarrollo. Se añade la versión al login y un aviso accionable cuando hay código nuevo.

### El error que se evitó

La primera propuesta era hardcodear el build esperado en `index.html` y compararlo. **No funciona:** `./index.html` está en el `SHELL` del Service Worker con estrategia cache-first. Un usuario desactualizado carga el `index.html` viejo, con el número viejo, que coincide con su cache viejo — y la comparación reporta "al día". El mecanismo sería ciego exactamente en el único caso que debe detectar.

**Solución (DA-28):** la etiqueta se deriva de `caches.keys()` en runtime. Refleja el código que **realmente** está corriendo, no el que debería. Sin segunda fuente de verdad y sin mantenimiento: bumpear `CACHE_NAME` ya actualiza la etiqueta.

### Detalle técnico

| Aspecto | Decisión |
|---------|----------|
| Origen del número | `caches.keys()`, prefijo `organiza2-v` |
| Orden | **Numérico descendente** — `sort()` de strings pone `v2-9` después de `v2-17` |
| Formato | `v2.3 · build 17` — "build" comunica que es técnico y desechable; `v2.3` es la versión de producto |
| Primera visita | Sin cache aún: muestra solo `v2.3`. Comportamiento correcto, no es error |
| Ubicación | Bajo el botón de Google, dentro de `.login-body` |

### Aviso de actualización

`sw.js` ya tenía `skipWaiting()` + `clients.claim()`, de modo que **el Service Worker nuevo se instala y activa solo**. Lo único pendiente es recargar la página para que corra el código nuevo.

Por eso el aviso **no explica cómo instalar nada** — ya está instalado. Ofrece un botón *Actualizar* que hace `location.reload()`. Un toque en lugar de instruir a cada familia sobre cómo cerrar la app por completo, y elimina el problema de iOS que exigía abrirla dos veces.

Detección vía `registration.addEventListener('updatefound')` → `statechange` → `state === 'activated'`, con guarda `navigator.serviceWorker.controller` para no mostrar el aviso en la primera instalación.

**Texto elegido:** *"Hay una versión nueva lista"*, no *"Tu versión está desactualizada"*. Si alguien no abre la app en semanas, verá el aviso apenas entre sin haber hecho nada — informar sin culpar evita que se lea como reproche.

### Archivos

| Archivo | Cambio |
|---------|--------|
| `index.html` | `#appVersion` y `#updBanner` en el login · `_pintarVersion()` y `_avisarActualizacion()` en el registro del SW |
| `css/login.css` | `.login-version`, `.upd`, `.upd-txt`, `.upd button` |
| `sw.js` | Bump `v2-16` → `v2-17` |

### Portabilidad

El patrón es independiente de Organiza2 y se reutilizará en **Follower**. Para trasladarlo solo hay que cambiar el prefijo del filtro (`organiza2-v` → el `CACHE_NAME` correspondiente) y la versión de producto mostrada. Requisitos: que el SW use `skipWaiting()` y que `CACHE_NAME` termine en un entero incremental.

---

## Sesión — Diseño del Planeador v3.0 (Agosto 2026)

**Regla de Validación rota conscientemente.** `docs/producto.md` §9 exige cumplir los criterios de salida del piloto de Finanzas antes de construir Planeador o Alimentación — criterio no cumplido a la fecha (ningún hogar del piloto ha tenido dos miembros simultáneamente activos). Jaime decidió avanzar de todos modos, como product owner, motivado por presión competitiva observada (FamilyWall invirtiendo en publicidad en español). Esa presión fue evaluada en sesión y no se consideró, por sí sola, motivo suficiente — el diferencial de Organiza2 frente a FamilyWall se mantiene intacto (frecuencia latina, servicio doméstico, modelo de pareja no-Todoist). La decisión de romper la regla quedó tomada y nombrada explícitamente, con el riesgo declarado: se diseñó una especificación funcional casi completa sin validación real de ninguna familia.

**Trabajo de la sesión:** diseño completo del Planeador — modelo de datos (`items/` con tipos Recordatorio/Compromiso, `metas/` con sub-pasos), ciclo de responsabilidad compartida sin asignación tipo Todoist (`creadoPor` / `tomadoPor` reversible / `resueltoPor`), integración de solo lectura con Finanzas vía `calcPresupuestoBase` para proyectar avance de metas, y extensión del principio de DA-14 ("solo lectura") de Finanzas hacia Pendientes y Metas — **Hoy actúa, Cómo vamos observa**. Mockup interactivo construido y validado en dispositivo real, con varias iteraciones de corrección en vivo (Meta removida del selector de Pendientes tras confirmarse que ya tenía su propia sub-tab; estado vacío vs. con-metas diferenciado).

**Huecos declarados, no resueltos en esta sesión:**
- Copy final de Recordatorio/Compromiso/Meta — quedó pendiente una ronda de opciones comparadas, nunca se ejecutó.
- Reglas de seguridad de Firebase para `items/` y `metas/` — verificado en `firebase-rules.json`: no existen hoy. Deben diseñarse en la sesión de desarrollo, no se improvisaron aquí.
- Reparto de proyección de ahorro entre múltiples metas activas simultáneas — hipótesis, no confirmado como necesidad real.

**Documento completo:** `docs/propuestas/planeador.md`. **Mockup:** `docs/mockups/planeador.html`.

---

## Sesión — Diseño de Alimentación v1.0 (Agosto 2026)

**Regla de Validación rota conscientemente, extendiendo la excepción de Planeador.** La ratificación de la sesión de Planeador había nombrado explícitamente que "la regla sigue vigente para Alimentación" (`docs/producto.md` §9). Esta sesión revierte esa distinción: Jaime decidió, como product owner, aplicar el mismo criterio de excepción consciente a Alimentación — mismo razonamiento ya evaluado para Planeador (diferenciales estructurales frente a FamilyWall y al panorama de apps de listas/menú), no un motivo nuevo. El criterio de salida del piloto sigue sin cumplirse.

**Origen del diseño: flujo doméstico real de Jaime, no una hipótesis de producto.** Empleada anota faltantes → Jaime valida contra nevera/despensa → compra separando por categoría → registra gasto total por categoría al final, sin precio por producto. Confirmado en campo, pero **n=1** — ningún otro hogar del piloto lo ha mencionado, porque el módulo no existe. Se descartó explícitamente un planificador de menú/loncheras automático como primer enfoque (dominio culinario, no financiero — violaría la Regla de Posicionamiento), dejándolo nombrado como backlog futuro condicionado al mismo flag `tieneEducacion` que ya usa DA-26, activable solo para hogares con hijos en edad escolar.

**Hallazgo de mercado que sostiene el diferencial:** ningún competidor revisado (FamilyWall, apps de menú tipo Mealime, apps de lista tipo AnyList/Bring!, escáneres de recibos tipo GroceryTracker Pro) conecta frecuencia de compra con presupuesto sin depender de precio por producto — todos los análisis de patrón de consumo existentes en el mercado están atados a precio por ítem, justo lo que el flujo real de Jaime rechaza por no tener sentido con productos como la papa o la carne.

**Trabajo de la sesión:** modelo de datos (`alimentacion/listado`, `catalogoHogar`, `historial`), vínculo con Finanzas por categoría — nunca por producto, sin precio individual —, reutilizando el formulario de gasto diario ya existente (DA-1 intacto). Cierre de compra resuelto como recordatorio pasivo, no formulario forzado. Catálogo global semilla construido en conjunto con Jaime (~140 productos en tres categorías, con corrección de duplicados, ortografía y una distinción culinaria real: fríjol seco vs. fríjol verde fresco, tratados como productos distintos a propósito). Convención de normalización fijada explícitamente (minúsculas, sin mayúscula inicial, singular/plural según uso real hablado) para proteger el patrón de consumo de contarse mal.

**Corrección en vivo durante la sesión, documentada porque casi se pierde:** la primera versión del mockup ubicó el patrón de consumo en la tab Análisis, usando la clase CSS `.an-tab` (propia de esa tab en `finanzas.css`) — contradiciendo sin querer que el mockup real de Planeador ya había resuelto este mismo problema con Hoy-actúa/Cómo-vamos-observa (DA-14) y una clase genérica propia, `.sub-tab`, para no acoplar el mecanismo a Análisis. El error se detectó por señalamiento directo de Jaime, no por revisión propia, y se corrigió trayendo el mockup real de Planeador en vez de confiar en el resumen en memoria — Corolario 1 de la Regla de Oro (un solo documento no es toda la búsqueda) aplicado sobre el propio trabajo de la sesión, no solo sobre el código del repo.

**Decisión de ubicación de interfaz, comparada en vivo:** construir Mercado como sub-tab propio (Opción A) apretaba la fila de sub-tabs a 4 elementos en ~360px de ancho — problema real, visible en captura de pantalla del propio Jaime en el mockup (que además destapó un bug de layout no relacionado: `body` sin `flex-direction:column` estiraba el selector de comparación a la altura completa del teléfono). Se construyó una segunda opción (B) dentro del mockup: botón fijo en Pendientes que abre listado o patrón en pantalla propia, reutilizando el patrón real de `modal-overlay`. Jaime eligió B con motivo explícito: *"no compite con nadie, es una feature adicional"* — priorizando no perturbar la navegación principal sobre la visibilidad inmediata de una acción de uso semanal. Costo aceptado y nombrado: Mercado queda un paso más lejos que Gastos, detrás de una tab (Pendientes) que conceptualmente pertenece a Planeador.

**Huecos declarados, no resueltos en esta sesión:**
- Normalización de nombres de producto — el catálogo + autocompletar reduce el problema hacia adelante, no lo elimina; sin mecanismo de fusión retroactiva entre grafías ya separadas en `catalogoHogar`.
- Foto/OCR del listado manuscrito — técnicamente posible, pero exige API de visión externa (reconocimiento de letra manuscrita informal), con las mismas preguntas de costo, proveedor y privacidad que la decisión pospuesta de notificaciones push en Planeador. Queda nombrado como v1.1, no diseñado.
- Catálogo global sin validar con Anny ni con el piloto — construido con conocimiento general de mercado colombiano, no con revisión sistemática.
- Reglas de seguridad de Firebase para `alimentacion/` — mismo hueco que Planeador dejó para `items/`/`metas/`, no diseñadas en esta sesión.

**Documento completo:** `docs/propuestas/alimentacion.md`. **Mockup:** `docs/mockups/alimentacion.html`.

---

## Sesión — Feedback de piloto: presupuesto por tipo, ahorro sugerido, responsable por ítem y agenda .ics (Septiembre 2026)

**Origen:** cuatro notas de voz de una familia del piloto, transcritas por WhatsApp con partes ilegibles, más una foto del Excel personal del mismo hablante. Procesadas con la taxonomía obligatoria (hipótesis / confirmado en código / confirmado en campo) y contrastadas contra `arquitectura.md` y el código vivo antes de aceptar cualquier premisa — **n=1**, un solo hogar, con perfil más sofisticado que el promedio del piloto (Excel propio, portafolio de inversión, usuario previo de Splitwise).

**Hallazgo #1 — Esencial/No esencial como checkbox por ítem.** Propuesta inicial (macro-categoría separada, ahorro forzado primero) se descartó tal cual: el propio Excel del hablante la contradice (Ahorro vive dentro de "Esencial", no aparte). Refinada en conjunto a un flag booleano **por ítem, a decisión de la familia**, agrupado en Cómo Vamos. Confirmado en código que el respaldo semántico ya existe y no se usa: el onboarding P4/P5 (`docs/producto.md` §7, "Presupuesto Base — Onboarding") pregunta exactamente esta distinción (lo que sí o sí hay que pagar / lo que varía) y hoy no queda conectada a nada después de responderse. Candidato fuerte, condicionado a segunda familia que lo pida sin sugerírselo.

**Hallazgo #2 — % de ahorro sugerido (no impuesto), derivado del ingreso.** Mismo patrón: usar P3 (¿con cuánto cuentan?) para proponer una meta editable por la familia. Riesgo de diseño nombrado y no resuelto: si el badge de Ahorro (DA-19) marca "no cumplido" en rojo cuando la familia no llega a la meta sugerida, el tono de reproche que el proyecto evita a propósito (ver Fase 48, aviso de versión) se cuela por la puerta de atrás aunque la meta sea nominalmente opcional. Pendiente de decidir explícito en mockup si se construye.

**Hallazgo #3 — Ingreso variable por rentabilidad de portafolio.** Descartado. Perfil atípico del piloto, sin segunda fuente. Queda solo como registro de que se evaluó y por qué se dejó fuera.

**Hallazgo #4 — Subcategoría dentro de categoría (auto 1/auto 2, mensual/eventual).** Descartado como necesidad de producto. La parte de frecuencia mensual/eventual ya está resuelta por DA-8 (`calcPresupuestoBase`, campo `frecuencia` + `months[]`) a nivel de ítem — el hablante no lo vio en su propio Excel porque su Excel es más plano que el producto real. La parte de "dos instancias de la misma categoría" no requiere cambio de modelo: se resuelve nombrando dos categorías distintas en el catálogo plano actual.

**Hallazgo #5 — Ingresos adicionales/bonificaciones.** El hablante asumió que esto no existía; **confirmado en código que sí existe** (`presupuesto.js`: `abrirModalIngresoExtra`, `guardarModalIngresoExtra`, fila "Otros ingresos" en `income[]`). No es diseño nuevo — queda como tarea de verificar cobertura real, no de construir.

**Hallazgo #6 — Deuda por transacción estilo Splitwise → reformulado a responsable por ítem del presupuesto.** La propuesta literal (saldo cruzado entre personas por gasto puntual, con porcentajes) se descartó explícitamente: `docs/producto.md` §3 tiene a Splitwise catalogado en "Bloque B — Finanzas compartidas", con la debilidad textual *"organizan dinero, no organizan el hogar"* — construirla tal cual habría sido replicar la debilidad ya identificada en la competencia, no una fortaleza propia. El fondo real del comentario, aclarado por Jaime, es distinto: **qué miembro se compromete a pagar qué ítem o categoría, definido al planear el mes** — no una deuda que se salda después. Confirmado en código que no existe ningún campo de responsable/asignado por ítem hoy; lo más cercano es `daily/` (quién registró el gasto real) y `¿Quién pagó?` (comparación agregada de fin de mes), ninguno de los dos captura el compromiso previo. Coherente con el diferencial de "responsabilidad compartida" ya documentado frente a la ola 2025-26 de calendarios familiares. Candidato fuerte junto con #7, con la misma pregunta de granularidad que el Hallazgo #1 (por categoría completa o por ítem).

**Hallazgo #7 — Calendario del hogar → enlace `.ics` estándar, opcional.** Reemplaza una idea previa de sincronización bidireccional vía OAuth con proveedores externos (Google Calendar API), descartada en esta misma sesión por requerir backend y romper el stack cerrado. La versión final, propuesta por Jaime: cada evento de Planeador ya tiene fecha y hora, suficiente para generar un archivo `.ics` client-side, sin backend ni autenticación de terceros — Google Calendar, Outlook y Apple Calendar lo importan o se suscriben nativamente. Viable dentro del stack actual (vanilla JS, sin build tools). Sigue bloqueado por depender de Planeador, que a su vez sigue bloqueado por la Regla de Validación (`docs/producto.md` §9) — pero queda anotado en el backlog de Planeador como opción mucho más barata que la sync bidireccional que se había descartado antes de esta sesión.

**Lección de la sesión, no de ningún hallazgo puntual:** procesar el feedback hallazgo por hallazgo, verificando cada uno contra el código vivo antes de opinar, encontró dos cosas que ya existían y estaban desconectadas (P4/P5, ingreso adicional) y una reformulación (Splitwise → responsable por ítem) que la lectura literal de la transcripción no habría dado. El riesgo que la sesión no resuelve, porque no le corresponde resolverlo: las siete ideas vienen de un solo hogar más sofisticado que el objetivo del piloto — evidencia de una fuente, no señal de que el piloto lo necesite.

---
## Sesión — Revisión de `admin.html` y patrón de adopción por miembro (Septiembre 2026)

**Origen:** revisión conjunta de las capturas del dashboard del piloto (Semana 12, 31 ago) contra el código vivo de `admin.html`, seguida de una pregunta abierta sobre por qué "Hogares con 2 activos" lleva 0 de 3 desde el inicio.

**Hallazgo #1 — El dashboard mide "hogar" con dos criterios distintos, confirmado en código.** La tarjeta "Hogares creados" cuenta eventos de tipo `hogar_creado` (= 2). La tabla de detalle (`porHogarDetalle`) arma la lista desde cualquier evento con campo `hogar`, sin exigir `hogar_creado` (= 3: SNBDPA, PCW9BB, GXNSCB). Los criterios de salida usan la base de 3; "Onboarding completo" usa la base de 2 — dos varas distintas en la misma pantalla. GXNSCB tiene actividad real (3 gastos, 2 semanas) pero nunca disparó (o perdió) el evento `hogar_creado`, y por eso no cuenta en la métrica principal. Pendiente: decidir si se corrige el conteo o se documenta la diferencia de criterio explícitamente en el propio dashboard.

**Hallazgo #2 — Patrón de adopción por miembro, confirmado en campo, 3 de 3 hogares.** Ningún hogar del piloto tiene ambos miembros activos simultáneamente (coincide con "Hogares con 2 activos: 0/3" del dashboard). Detalle por hogar:
- SNBDPA — Anny no instaló la app; la instala Jaime.
- PCW9BB (Xiomy) — instaló, no usa.
- GXNSCB (Carolina) — instaló, no usa.

En los tres casos la persona que no adoptó es la mujer del hogar, y las tres están en iOS. Correlación real pero con una confusión sin resolver: no se sabe todavía si los tres hombres del hogar están en Android, lo que separaría si la variable que pesa es plataforma o rol/género — **con n=3 no se puede distinguir**, y no se debe escribir una conclusión de una sobre la otra sin ese dato.

**Hallazgo #3 — Se descartó la hipótesis técnica de instalación, confirmado en código.** `checkPWA()` (`ui.js`) se ejecuta en `DOMContentLoaded`, antes del login, y muestra banner de instalación ("Agregar a pantalla de inicio") a cualquier iPhone/iPad fuera de modo standalone. El mecanismo existe — la ausencia de instrucción no explica el caso de Anny. Hipótesis abierta sin confirmar: si el link se abrió dentro del navegador embebido de WhatsApp en vez de Safari real, el flujo de instalación no está disponible del todo, independientemente del banner.

**Hallazgo #4 — Se descartó la hipótesis de push/notificaciones, confirmado en código.** No existe ningún mecanismo de notificaciones push implementado hoy, en ninguna plataforma (`grep` de "push"/"Notification" en todo el repo solo devuelve usos de `Array.push` y `Firebase.push`). No puede ser la causa de que Xiomy y Carolina no vuelvan, porque nadie recibe notificación alguna todavía.

**Estado real del piloto, sin filtro de dashboard, a Semana 12 de 12+:** 2-3 hogares con actividad real contra meta de 5-10. De los 4 criterios de salida sustantivos, solo "onboarding completo" muestra progreso (2 de 3, sobre una base cuestionada por el Hallazgo #1); el resto está en 0 o 1 de 3. El hallazgo #2 es la explicación directa y de campo de por qué "hogares con 2 activos" no avanza — no es ruido de telemetría.

**Pendiente antes de cerrar este hallazgo:** confirmar sistema operativo de los tres hombres del piloto, y preguntar directamente a Anny, Xiomy y Carolina (no a través de sus parejas) qué pasó en el momento de instalar/al dejar de usar la app.

---
