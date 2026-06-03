# 🏗️ Decisión Arquitectónica — Organiza2 v2.0
## Refactorizar vs Reconstruir

> Análisis técnico basado en inspección directa del código (`index.html` · 2.229 líneas)  
> Junio 2026 — Previo a la implementación de v2.1

---

## 1. Recomendación Final

### **Opción B — Reconstruir en `index-v2.html`**

Con reutilización quirúrgica de componentes probados.

**Justificación en una frase:**  
El `index.html` actual está acoplado en sus cimientos a una arquitectura de usuario único y datos hardcodeados. Refactorizarlo para soportar hogares, múltiples usuarios y pantallas dinámicas equivale a reconstruirlo de todas formas — pero cargando el peso del código viejo durante todo el proceso.

---

## 2. Porcentaje estimado de reutilización

| Capa | Reutilizable | Reconstruir |
|------|-------------|------------|
| CSS (284 líneas) | 75% | 25% |
| HTML estructura | 20% | 80% |
| JavaScript — utilidades puras | 100% | 0% |
| JavaScript — lógica de negocio | 45% | 55% |
| JavaScript — UI/render | 15% | 85% |
| Firebase paths y estructura | 0% | 100% |

**Resumen global:** ~35% reutilizable · ~65% reconstrucción

---

## 3. Lista exacta por función/componente

### ✅ MANTENER — copiar sin cambios

Estas funciones están limpias, probadas y no tienen dependencias del modelo viejo:

| Función | Líneas | Por qué mantener |
|---------|--------|-----------------|
| `canonicalLabel()` | 1008–1089 | Corrige encodings históricos. Crítica. Intocable. |
| `planItems(cat)` | 1185 | Función canónica. Sin dependencias externas. |
| `isAutoItem(item)` | 1184 | Auxiliar de planItems. Depende solo del ítem. |
| `stripAutoItems(data)` | 1186–1189 | Limpieza de datos. Sin dependencias. |
| `fmt(n)` | 1182 | Formateador de moneda COP. Trivial y correcto. |
| `ITEM_RENAMES` | 1190–1195 | Mapa de renombres históricos. Necesario para migración. |
| `mergeItem()` | 1196–1202 | Lógica de merge de ítems duplicados. |
| `normalizeCategoryItems()` | 1203–1212 | Limpieza de duplicados. |
| `migrateCategories()` | 919–1005 | Necesaria durante la migración de datos históricos. |
| `oqLoad()` | 773 | Cola offline — solo usa localStorage. |
| `oqSave()` | 774 | Cola offline — solo usa localStorage. |
| `oqAdd()` | 775 | Cola offline — solo usa localStorage. |
| `oqSize()` | 776 | Cola offline — solo usa localStorage. |
| `syncOfflineQueue()` | 802–832 | Cola offline — solo necesita actualizar los paths Firebase. |
| `toast()` | ~2180 | UI utility. Cero dependencias. |
| `updateOfflineUI()` | 778–800 | Banner offline. Fácil de portar. |
| `MONTHS`, `MSHORT`, `COLORS`, `ICONS` | 700–703 | Constantes puras. |

---

### 🔄 ADAPTAR — reutilizar la lógica, actualizar referencias

Estas funciones tienen la lógica correcta pero referencian `FBK`, `user` o IDs de DOM hardcodeados:

| Función | Cambio requerido |
|---------|-----------------|
| `recalc()` | Quitar referencias a IDs DOM hardcodeados (`cInc`, `cExp`, etc.) → sistema de IDs dinámicos |
| `renderAll()` | Agregar filtro `getCapabilidades(perfil)` antes de renderizar categorías |
| `renderBudget()` | Agregar campo `frecuencia` en display. Quitar `type="number"` → `type="text" inputmode="decimal"` |
| `save()` | Cambiar `dKey()` para usar `codigoHogar` en lugar de `FBK` |
| `subMonth()` / `loadFixed()` | Actualizar paths Firebase a `hogares/[codigoHogar]/pl/` |
| `syncDailyMonth()` | Actualizar path `daily/${FBK}/` → `daily/${codigoHogar}/` |
| `submitDaily()` | Cambiar validación de `user` por `auth.currentUser`. Actualizar path. |
| `renderDailyList()` | Chips de usuario dinámicos (no hardcodeados a `jaime`/`anny`) |
| `logH()` | Actualizar `hKey()` con `codigoHogar` |
| `renderSemaforo()` | Mantener lógica. Actualizar IDs DOM. |
| `renderTendencia()` | Mantener lógica. Actualizar paths Firebase. |
| `renderHormiga()` | Mantener lógica casi intacta. |
| `addInc/delInc/updInc/togFxInc` | Quitar `by:user` hardcodeado → `by: auth.currentUser.uid` |
| `addCat/addItem/delItem/updExp/updBud/togFx` | Misma actualización de `user` |
| `copyBudPrev/applyBudgetYear/applyFixedYear` | Actualizar paths Firebase |
| `go()` sistema de tabs | Hacerlo dinámico — los tabs se generan desde `getCapabilidades()` |
| `dKey()` / `hKey()` / `dayKey()` | Cambiar `FBK` → `codigoHogar` (3 líneas de cambio) |

---

### ❌ REESCRIBIR — no rescatables

Estos componentes están fundamentalmente acoplados a la arquitectura v1:

| Componente | Por qué reescribir |
|-----------|-------------------|
| `#userScreen` + `setUser()` + `updateChip()` | Reemplazado completamente por Firebase Auth Google |
| `user=localStorage.getItem('fp_user')` | Reemplazado por `auth.currentUser` |
| `const FBK='Anny1130'` | Eliminado. Reemplazado por `codigoHogar` dinámico |
| `defD()` — datos por defecto hardcodeados | Reescribir para derivar categorías del `perfil` del hogar |
| Tab Nómina (HTML 402–476 + calcNom/loadNomFields/syncNom) | Hardcodeada para Jaime y Anny. Reescribir para N miembros dinámicos del hogar |
| Tab Empleadas (HTML 479–530 + calcEmp/loadEmpFields) | Hardcodeada para Empleada y Niñera. Reescribir para N empleados dinámicos |
| `window.addEventListener('DOMContentLoaded')` en v1 | Reescribir el flujo de arranque: Login → loadPerfil → getCapabilidades → renderDynamic |
| Todos los `type="number" inputmode="numeric"` | Fix iOS: cambiar a `type="text" inputmode="decimal"` |
| Tabs hardcodeados en HTML | Generar dinámicamente desde `getCapabilidades(perfil)` |
| Footer "Cambiar usuario" + "Limpiar duplicados" | Eliminar del flujo principal. `cleanDuplicates` pasa a herramienta de admin. |

---

## 4. Riesgos por estrategia

### Riesgos de Opción A (Refactorizar)

| Riesgo | Severidad | Descripción |
|--------|-----------|-------------|
| **Deuda acumulada** | Alta | Cada cambio en un monolito de 2.229 líneas tiene efectos secundarios no predecibles |
| **Testing imposible** | Alta | Sin separación de responsabilidades, probar Login sin afectar renderAll() es muy difícil |
| **Acoplamiento oculto** | Alta | `calcNom()` referencia `jb`, `jr`, `jss`... IDs hardcodeados de Jaime. Hacerlos dinámicos requiere reescritura completa de todos modos |
| **Regresiones** | Media | Cambiar `FBK` en ~30 funciones con el código activo es una fuente de bugs silenciosos |
| **El monolito crece** | Alta | Al agregar Login, Hogar, Presupuesto Base y pantallas dinámicas, el archivo llega a 3.500+ líneas |
| **Pérdida de tiempo** | Media | Refactorizar es más lento que reconstruir sobre base limpia cuando el cambio arquitectural es tan profundo |

### Riesgos de Opción B (Reconstruir)

| Riesgo | Severidad | Descripción |
|--------|-----------|-------------|
| **Tiempo inicial** | Media | Configurar la estructura nueva y portar las funciones válidas toma 1-2 días antes de ver resultados |
| **Regresión de features** | Baja | Alguna función menor podría quedar fuera si no se hace un inventario completo (este documento lo cubre) |
| **Pérdida de datos** | Baja | No aplica — los datos viven en Firebase, no en el código. La migración es independiente de la opción elegida |
| **App.html durante transición** | Baja | Mientras se construye v2, la v1 sigue funcionando en producción. No hay downtime |

**Conclusión de riesgos:** La Opción B tiene riesgos menores y controlables. La Opción A tiene riesgos mayores y sistémicos.

---

## 5. Decisión sobre el nodo Firebase: `pl/` vs `finanzas/`

### Recomendación: **Mantener `pl/` como nombre del nodo**

**Razón técnica:** El nombre del nodo en Firebase es un detalle de implementación interno. Lo que importa es el path raíz: `hogares/[codigoHogar]/pl/`.

Renombrar `pl/` a `finanzas/` no aporta valor funcional y agrega un paso de migración de datos innecesario con el riesgo asociado.

**Contra-argumento evaluado:** "Finanzas es más semántico para el futuro."  
**Respuesta:** En una arquitectura modular, los módulos futuros (Planeador, Alimentación) tienen sus propios nodos: `hogares/[codigoHogar]/eventos/` y `hogares/[codigoHogar]/alimentacion/`. El nodo `pl/` dentro del hogar siempre será inequívocamente financiero por su contexto. La claridad viene del path completo, no del nombre del nodo.

**Estructura definitiva Firebase v2:**

```
hogares/[codigoHogar]/
├── meta/
├── perfil/
├── pl/[año]/[mes]/          ← mantener 'pl'
├── daily/[año]/[mes]/[día]/
├── eventos/                 ← Planeador v3.0
├── alimentacion/            ← Alimentación v4.0
└── hist/
```

---

## 6. Arquitectura de carpetas recomendada

### Propuesta ajustada (sin build process, GitHub Pages compatible)

```
organiza2/finanzas-familia/
│
├── index.html               ← Solo HTML + imports. Sin CSS inline, sin JS inline.
├── index-v1.html            ← Backup del monolito actual. NO eliminar hasta piloto validado.
├── manifest.json
├── icono-181.png
│
├── css/
│   ├── base.css             ← Reset, body, tipografía, colores, variables CSS
│   ├── components.css       ← Cards, inputs, rows, badges, toast, progress
│   ├── tabs.css             ← Topbar, tabs, navegación
│   ├── modules/
│   │   ├── daily.css        ← Estilos específicos del tab Hoy
│   │   ├── nomina.css       ← Estilos específicos de Nómina/Empleados
│   │   └── analisis.css     ← Estilos específicos de Análisis
│   └── login.css            ← Pantalla de login y onboarding
│
├── js/
│   ├── config.js            ← Firebase config + initializeApp. Solo esto.
│   ├── auth.js              ← initLogin(), onAuthChanged(), signOut()
│   ├── hogar.js             ← loadPerfil(), getCapabilidades(), crearHogar(), unirseHogar()
│   ├── onboarding.js        ← flujo onboarding mínimo + sugerirCompletarPerfil()
│   ├── utils.js             ← fmt(), MONTHS, COLORS, ICONS, canonicalLabel(), planItems(), etc.
│   ├── offline.js           ← Cola offline: oqLoad/oqSave/oqAdd/syncOfflineQueue
│   ├── firebase-paths.js    ← dKey(), dayKey(), hKey() — paths centralizados
│   ├── presupuesto.js       ← subMonth(), loadFixed(), save(), defD(), recalc()
│   ├── finanzas.js          ← renderAll(), renderBudget(), addInc/addCat/etc.
│   ├── daily.js             ← subDaily(), submitDaily(), renderDailyList(), syncDailyMonth()
│   ├── nomina.js            ← calcNom(), loadNomFields(), syncNom() — dinámico por miembros
│   ├── empleados.js         ← calcEmp(), loadEmpFields() — dinámico por personalApoyo
│   ├── analisis.js          ← renderAnalisis(), renderSemaforo(), renderTendencia(), renderHormiga()
│   ├── ui.js                ← go(), renderDynamic(), toast(), updateOfflineUI(), renderMLabel()
│   └── app.js               ← DOMContentLoaded: punto de entrada, orquesta el arranque
│
├── docs/
│   ├── producto.md
│   ├── arquitectura.md
│   ├── README.md
│   └── bitacora.md
│
└── assets/
    └── (futuros íconos, ilustraciones)
```

### Reglas de la arquitectura modular

**Regla 1:** `app.js` es el único punto de entrada. Solo orquesta — no tiene lógica de negocio.

**Regla 2:** `utils.js` no importa nada de los otros módulos. Es el módulo base del que todos dependen.

**Regla 3:** `config.js` no importa nada. Solo exporta `db` y `auth`.

**Regla 4:** El orden de carga en `index.html` es la única forma de "importar". Usar `<script src="...">` en orden correcto: config → utils → offline → firebase-paths → auth → hogar → presupuesto → finanzas → daily → nomina → empleados → analisis → ui → app.

**Regla 5:** Ningún módulo supera 300 líneas. Si crece más, se divide.

**Por qué no ES modules (`type="module"`):**  
Los ES modules requieren servidor HTTP para funcionar (no funcionan con `file://`). GitHub Pages los soporta, pero complican el debugging local. Con el orden de `<script>` correcto se logra el mismo resultado sin complicaciones.

---

## 7. Roadmap técnico de implementación

### Etapa 1 — Login Google y arranque limpio
**Objetivo:** Reemplazar `const FBK='Anny1130'` y `#userScreen` por Firebase Auth real.  
**Archivos nuevos:** `index-v2.html`, `css/base.css`, `css/login.css`, `js/config.js`, `js/auth.js`, `js/app.js`  
**Resultado visible:** Pantalla de login con botón "Entrar con Google". Al autenticar, la app arranca (con datos aún en paths v1 para prueba).

**Criterio de éxito:** El usuario puede hacer login con Google. El uid real reemplaza `Anny1130` en la sesión.

---

### Etapa 2 — Modelo de Hogar mínimo
**Objetivo:** Crear o unirse a un hogar. Leer el perfil.  
**Archivos nuevos:** `js/hogar.js`, `js/firebase-paths.js`, `js/onboarding.js`  
**Resultado visible:** Primer login → pantalla "¿Eres nuevo? Crea tu hogar" / "¿Ya tienes código? Únete". Segundo login → carga directa del hogar existente.

**Criterio de éxito:** Dos dispositivos distintos comparten el mismo `codigoHogar` y ven los mismos datos.

---

### Etapa 3 — Migración de datos Anny1130
**Objetivo:** Mover `pl/Anny1130/` y `daily/Anny1130/` al nuevo nodo del hogar.  
**Método:** Script de migración ejecutado una vez desde la consola del navegador.  
**Prerequisito obligatorio:** Backup manual de `pl/Anny1130/` desde Firebase Console antes de ejecutar.

**Criterio de éxito:** Los datos históricos aparecen correctamente en `hogares/[codigoHogar]/pl/`. Las reglas de seguridad v2 se activan.

---

### Etapa 4 — Finanzas base funcional en v2
**Objetivo:** El módulo Finanzas funciona sobre el nuevo modelo.  
**Archivos nuevos:** `js/utils.js` (portar funciones validadas), `js/offline.js`, `js/presupuesto.js`, `js/finanzas.js`, `js/daily.js`, `css/components.css`  
**Lo que se porta sin cambios:** `canonicalLabel`, `planItems`, `fmt`, `oq*`, `recalc` (adaptado), `renderAll` (adaptado), `submitDaily` (adaptado), todo Análisis.  
**Lo que se reescribe:** `defD()`, Nómina dinámica, Empleados dinámicos, `go()` tabs dinámicos.

**Criterio de éxito:** El tab Mensual, Presupuesto, Hoy y Análisis funcionan con datos reales del hogar nuevo.

---

### Etapa 5 — Pantallas dinámicas y Presupuesto Base
**Objetivo:** La app se adapta al perfil del hogar.  
**Archivos nuevos/modificados:** `js/hogar.js` (completar `getCapabilidades()`), `js/ui.js` (`renderDynamic()`), `js/presupuesto.js` (`calcPresupuestoBase()`)  
**Resultado visible:** Un hogar sin hijos no ve Educación. Un hogar sin vehículo no ve SOAT. El Presupuesto Base calcula provisiones automáticas.

**Criterio de éxito:** Dos hogares con perfiles distintos ven experiencias diferentes sin configuración manual.

---

### Etapa 6 — Piloto con familias
**Objetivo:** Validar con 5-10 familias reales antes de construir el Planeador.  
**Sin código nuevo.** Solo observación, feedback y correcciones de bugs.

**Criterio de éxito (condición de salida para v3.0):**
1. ≥5 hogares activos durante 4 semanas
2. ≥3 hogares configuraron el Presupuesto Base
3. No hay problemas críticos sin resolver en onboarding o modelo de hogar

---

## 8. Decisión sobre el archivo v1

`index.html` actual **no se elimina hasta completar la Etapa 6**.

- Se renombra a `index-v1.html`
- Sigue accesible para consulta durante el desarrollo de v2
- Se elimina definitivamente después del piloto validado

---

## Resumen ejecutivo

| Pregunta | Respuesta |
|----------|-----------|
| ¿Refactorizar o reconstruir? | **Reconstruir en `index-v2.html`** |
| ¿Cuánto es reutilizable? | **35% (funciones JS puras y utilidades)** |
| ¿`pl` o `finanzas` en Firebase? | **Mantener `pl/` — sin valor en renombrar** |
| ¿Arquitectura modular? | **Sí — 14 archivos JS, máx. 300 líneas cada uno** |
| ¿Función más crítica a preservar? | **`canonicalLabel()` — intocable** |
| ¿Mayor riesgo del proceso? | **Migración de datos Anny1130 — backup primero** |
| ¿Cuándo empieza el Planeador? | **Después de validar Finanzas v2 con familias reales** |

---

*Organiza2 — Decisión Arquitectónica v2.0 | Junio 2026*
