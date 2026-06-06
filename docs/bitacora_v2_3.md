# 📓 Organiza2 — Bitácora Técnica v2.5

> Historial completo de desarrollo, decisiones y aprendizajes
> Abril — Junio 2026

---

## 1. Resumen Ejecutivo

| ✅ Logros | 🔲 Pendientes |
|-----------|--------------|
| App PWA en producción | Rediseño tab Config (mockup pendiente) |
| Login Google + Firebase Auth (Etapa A) | Pantallas dinámicas según perfil (getCapabilidades) |
| Modelo de Hogar + código invitación (Etapa B) | Fix iOS decimal `type="text"` |
| Migración datos a hogares/ (Etapa C) | Exportar mes a PDF |
| Finanzas v2 arquitectura modular (Etapa D) | Exportar año a Excel |
| Migración Anny1130 → hogares/SNBDPA/ ✅ | Piloto 5-10 familias |
| Etapa E completa ✅ | Tab Análisis — afinar pendiente |
| Tab Resumen rediseñado — solo lectura ✅ | |
| Semáforo por categoría ✅ | |
| Pantalla login con logo ✅ | |
| Config limpio — sin residuos v1 ✅ | |
| REGLAS_IA.md creado ✅ | |
| Proyecto Claude con todos los archivos ✅ | |

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

**Textos del onboarding ajustados:**
- P2: *"Así podemos mostrarte lo que más importa para ustedes."*
- P4: `Servicios (agua, energía, gas, internet)`
- P4: `Transporte (gasolina, peajes, taxis)`
- P5: `Mercado y loncheras`
- Resumen: botón "Cancelar" agregado para salir sin guardar

**Proceso de integración — aprendizaje importante:**
La Etapa E se intentó integrar en dos sesiones. En la primera se generaron 4 archivos JS + 1 CSS + instrucciones. En la segunda se intentó hacer "archivos completos" lo que generó confusión y mezcla de versiones. **Aprendizaje: cuando algo funciona, no rehacerlo completo. Solo modificar lo que cambia.**

### 📅 Fase 11 — Tab Resumen rediseñado (Junio 2026)

**Problema:** El tab Resumen era una copia del editor de presupuesto de v1 — inputs, filas editables, hoja de cálculo. No respondía *"¿cómo vamos?"* de forma rápida.

**Solución — diseño con mockup:**
- Solo lectura — sin inputs
- Número grande de disponible como protagonista (verde/rojo)
- Semáforo por categoría: rojo (pasó límite) / amarillo (>85%) / verde (bien)
- Rojo y amarillo expandidos por defecto
- Ahorro siempre expandido con "✓ cumplido" en fondo verde
- Categorías verdes colapsadas — se abren al tocar
- Cada tarjeta: gastado X de Y + lo que queda
- Orden: rojo → amarillo → ahorro cumplido → verde → sin presupuesto

**Aprendizaje:** *Una mamá mira colores, no números. Si todo está verde, respira. Si hay rojo, se enfoca ahí.*

**Archivos modificados:** `js/finanzas.js` (nueva `renderResumen()`, `renderExpSecs()` separado), `js/ui.js`, `index.html`

### 📅 Fase 12 — Pantalla de login rediseñada (Junio 2026)

- Logo oficial `logo.png` subido a la raíz del repo
- Diseño Opción C: logo en fondo crema + 3 beneficios + botón Google con SVG inline
- Beneficios alineados con propuesta de valor:
  - ✅ Saben en qué se va el dinero
  - ✅ Deciden juntos, sin sorpresas
  - ✅ Paz mental a fin de mes

**Archivos modificados:** `css/login.css`, `index.html`

### 📅 Fase 13 — Bugs post-integración y limpieza Config (Junio 2026)

Ver sección 3 — Registro de Bugs.

**Decisión de Config (DA-16):** El tab Config solo muestra configuración del hogar y presupuesto base. Los gastos reales del mes solo se ven en el Resumen. `renderExpSecs()` eliminado de Config.

### 📅 Fase 15 — Sesión de diseño y refactoring íconos (Junio 2026)

**Sesión de diseño completa antes de implementar:**
- Mockup tab Config aprobado — secciones colapsables, modal por categoría, Reconfigurar 🧹
- Mockup Hormiga real aprobado — filtro por umbral, insight dinámico, categorías con conteo
- Revisión completa de íconos — 7 cambios globales aprobados + 10 cambios onboarding pendientes
- Revisión completa de textos onboarding — corrección singular/plural, función `_tx()`
- Eliminación opción Mixto P1, opción P2 dinámica según tipoHogar

**Implementado:**
- `utils.js` — 5 íconos ICONS + 5 claves DAILY_ITEMS
- `index.html` — tab Hoy 💰→✏️, sub-tab Tendencia 📈→📉
- `analisis.js` — `renderHormiga()` reescrita con lógica real (umbral $20.000)

**Pendiente próxima sesión:**
- Bloque 2: onboarding `presupuesto.js` — 16 cambios textos + íconos + `_tx()`
- Bloque 3: rediseño tab Config — `presupuesto.js`, `ui.js`, `index.html`

---

### 📅 Fase 14 — Regla de Oro y proyecto Claude (Junio 2026)

- Creado `REGLAS_IA.md` en la raíz del repo
- Todos los archivos del proyecto subidos al proyecto Claude
- Regla de Oro establecida: siempre preguntar si el archivo está actualizado antes de modificarlo

---

## 3. Registro de Bugs y Soluciones

*(bugs #1 al #13 — ver versiones anteriores)*

**Bug #14 — Tarjetas verdes del Resumen sin contraste**
- **Síntoma:** Categorías en estado verde tenían fondo igual al fondo de la página
- **Causa:** `var(--color-bg)` en lugar de `var(--color-surface)`
- **Fix:** Cambiar en `renderResumen()` los dos casos de `var(--color-bg)` a `var(--color-surface)`
- **Archivo:** `js/finanzas.js`

**Bug #15 — `calcPresupuestoBase` not defined**
- **Síntoma:** `Uncaught ReferenceError: calcPresupuestoBase is not defined` en `presupuesto.js`
- **Causa:** Al rediseñar el Resumen se generó un `finanzas.js` nuevo basado en el archivo original del proyecto de Claude (v1), que no tenía `calcPresupuestoBase`, pisando el archivo correcto
- **Fix:** Reconstruir `finanzas.js` combinando ambas versiones
- **Aprendizaje:** Siempre pedir el archivo actual antes de modificarlo → DA-17

**Bug #16 — Config con contenido duplicado (v1 + v2)**
- **Síntoma:** Config mostraba categorías dos veces — HTML hardcodeado (v1) + `renderExpSecs()` (v2)
- **Causa:** El `index.html` tenía bloques de v1 (`incRows`, `expSecs`, `ncLbl`, botón "Aplicar fijos") que nunca se eliminaron
- **Fix:** Eliminar bloques v1 del `index.html` + quitar `renderExpSecs()` de `go('c')` en `ui.js`

**Bug #17 — Nombres de categorías cortados en Resumen**
- **Síntoma:** `ivienda`, `e Impuestos`, `Doméstico` en lugar de los nombres completos
- **Causa:** `c.name.replace(/^\S+\s/, '')` cortaba la primera *palabra* en lugar de solo el emoji inicial. Para `🏠 Vivienda` funciona, pero para `Vivienda` (sin emoji) cortaba la `V`
- **Fix:** Función `displayName(name)` que usa regex Unicode para quitar solo emojis al inicio
- **Archivo:** `js/finanzas.js`

**Bug #18 — Orden del semáforo incorrecto**
- **Síntoma:** Las categorías rojas y amarillas no aparecían primero; el ahorro no aparecía destacado
- **Causa:** Las tarjetas se renderizaban en el orden original de `D.categories` sin ordenar por estado
- **Fix:** Ordenar antes de renderizar: `[...rojos, ...amarillos, ...ahorroCumplido, ...verdes, ...sinBud, ...ahorroSinCumplir]`
- **Archivo:** `js/finanzas.js`

---

## 4. Decisiones Arquitecturales

*(DA-0 al DA-13 — ver arquitectura_v2_3.md)*

**DA-14: Tab Resumen es solo lectura**
El tab Resumen no tiene inputs. Solo muestra el estado del mes. La edición vive en Config.

**DA-15: Login con logo oficial**
La pantalla de login muestra `logo.png`. El emoji 🏠 era un placeholder temporal.

**DA-16: Config solo muestra configuración, no gastos reales**
El tab Config muestra: info del hogar + presupuesto base. No muestra los gastos reales del mes. `renderExpSecs()` eliminado de Config. Los gastos reales solo se ven en el Resumen.

**DA-17: Siempre pedir el archivo actual antes de modificarlo**
Antes de modificar cualquier archivo, preguntar al usuario si está actualizado. Nunca generar desde cero si existe. Nunca asumir que el archivo en el proyecto de Claude es igual al que está en el repo. Ver `REGLAS_IA.md`.

---

## 5. Deuda Técnica

### 🔴 Prioridad Alta — Antes del piloto
- Rediseño tab Config con mockup — mockup aprobado, implementación pendiente
- Tab Análisis — Hormiga reescrita ✅, Semáforo y Tendencia pendientes de afinar
- Fix iOS decimal: `type="text"` `inputmode="decimal"` en todos los inputs de monto
- Pantallas dinámicas según `getCapabilidades(perfil)` — hijos activan Educación, vehículo activa Seguros

### 🟡 Prioridad Media
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
> En esta sesión se pisó el `finanzas.js` bueno porque se generó uno nuevo basado en el archivo del proyecto de Claude, que era la versión original. A partir de ahora: si hay que modificar un archivo existente, pedirlo primero.

> **No rehacer lo que funciona.**
> Cuando el usuario pidió "archivos completos", se reescribieron todos desde cero en lugar de hacer cambios necesarios. Eso introdujo regresiones. La regla: cambios quirúrgicos, no rewrites completos.

> **Mockupear antes de implementar.**
> El Resumen, el login y el onboarding se diseñaron con mockups interactivos antes de escribir código. Iteraciones en minutos vs horas de commits y redeploys.

> **Config es configuración, no edición de gastos.**
> El tab Config debe ser el panel de administración del hogar. Los gastos reales del mes van en el Resumen. Mezclar los dos crea confusión.

> **Una mamá mira colores, no números.**
> Los porcentajes y cifras exactas son para el análisis. Para la vista rápida, el color comunica más rápido. Rojo = problema. Verde = tranquilidad.

> **El logo en el login comunica identidad. Un emoji no.**
> El logo oficial con los beneficios específicos convierte el login en el primer momento de comunicación de la propuesta de valor.

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
| [confirmar] | refactor: íconos globales — utils.js (ICONS + DAILY_ITEMS) + index.html (tab Hoy + Tendencia) |
| [confirmar] | feat: renderHormiga() reescrita — lógica real gastos hormiga, umbral $20k, insight dinámico |

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
1. Rediseño de Config — mockup primero
2. Tab Análisis — afinar lo pendiente
3. Fix iOS decimal

**Cuando esos tres estén listos → Piloto v2.3 con 5-10 familias**

---

*Organiza2 — Bitácora v2.5 | Junio 2026*
