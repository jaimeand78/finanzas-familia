# 🔍 Auditoría Organiza2 — Migración hacia v2.0

> Junio 2026 — Auditoría documental, funcional y técnica previa a la reconstrucción.  
> Base: README.md · producto.md · arquitectura.md · bitacora.md · index.html (2.227 líneas)

---

## TAREA 1 — Auditoría del README.md

### Estado actual
El README.md está desactualizado respecto a la nueva visión estratégica.

### Problemas detectados

| # | Problema | Ubicación |
|---|----------|-----------|
| 1 | El título dice `💰 Organiza2 — Finanzas` — posiciona el producto como app financiera | Línea 1 |
| 2 | La visión dice `"paz y tranquilidad"` — lema de v1 reemplazado por `"Organizamos tu vida en pareja"` | Línea 16 |
| 3 | Tabla de estado incluye `Agenda Escolar` como módulo independiente — ya fue absorbido por Planeador | Línea 28 |
| 4 | El roadmap muestra 10 fases del sistema anterior (con Fase 7 Agenda Escolar, Fase 8 Lonchera) | Líneas 46-59 |
| 5 | No menciona el Modelo de Hogar como entidad principal | Todo el doc |
| 6 | No menciona onboarding progresivo ni pantallas dinámicas | Todo el doc |
| 7 | La sección de decisiones clave para IA no incluye DA-0 (Hogar como entidad principal) | Líneas 66-73 |
| 8 | La estructura Firebase mostrada usa `pl/[uid]/...` — ya obsoleta (debe ser `hogares/[codigoHogar]/...`) | Líneas 79-86 |

### Cambios requeridos
- Actualizar título, lema y visión
- Reemplazar tabla de módulos: Finanzas → Planeador → Alimentación
- Actualizar roadmap a versiones v2.1, v2.2, v3.0, v4.0, v5.0
- Agregar sección Modelo de Hogar como entidad principal
- Agregar DA-0 a decisiones clave para IA
- Actualizar estructura Firebase a nuevo modelo

---

## TAREA 2 — Auditoría del producto.md

### Estado post-actualización
`producto.md` fue actualizado a v2.0 en la sesión anterior. Está alineado con la nueva visión.

### Verificación de consistencia

| Elemento | Estado |
|----------|--------|
| Lema "Organizamos tu vida en pareja" | ✅ Incluido |
| Hallazgo: no es app financiera | ✅ Incluido |
| Módulos: Finanzas · Planeador · Alimentación | ✅ Incluido |
| Modelo de Hogar como entidad central | ✅ Incluido |
| Onboarding progresivo | ✅ Incluido |
| Pantallas dinámicas por perfil | ✅ Incluido |
| Presupuesto Base con frecuencia | ✅ Incluido |
| Separación tipo de hogar ≠ límites comerciales | ✅ Incluido |
| Roadmap v2.1 → v5.0 | ✅ Incluido |
| DA-0 Hogar como entidad principal | ✅ Incluido (en arquitectura) |

### Pendiente menor
- Actualizar el número de versión del módulo Finanzas en producción — dice "En producción desde abril 2026" pero debería indicar que es v1 a migrar hacia v2.

---

## TAREA 3 — Auditoría del arquitectura.md

### Estado post-actualización
`arquitectura.md` fue actualizado a v2.0 en la sesión anterior. Incluye DA-0 como principio fundacional.

### Gaps identificados que requieren documentar antes de construir

| Gap | Descripción | Impacto |
|-----|-------------|---------|
| **Flujo de Login** | No está documentado el flujo exacto de Firebase Auth: cómo se inicializa, cómo se obtiene el uid, cómo se persiste la sesión | Alto — primer paso de v2.1 |
| **Onboarding progresivo** | El flujo de `sugerirCompletarPerfil()` no está especificado: ¿qué eventos disparan la sugerencia? ¿qué se muestra? | Alto — afecta toda la UX |
| **Migración de datos** | El plan de migración Anny1130 está descrito pero no tiene el script de migración ni el orden exacto de pasos | Alto — dato crítico real |
| **Conflictos de escritura** | Cuando dos usuarios del hogar editan simultáneamente el mismo nodo, Firebase hace last-write-wins. No hay manejo de conflictos documentado | Medio |
| **Caché local del perfil** | ¿Se guarda el perfil del hogar en localStorage para arranque rápido offline? | Medio |

### Lo que sí está bien cubierto
- DA-0 a DA-8 completos
- Estructura Firebase v2 completa
- `getCapabilidades(perfil)` con ejemplo de código
- Reglas de seguridad v1 y v2
- Plan de migración de alto nivel

---

## TAREA 4 — Clasificación del index.html actual

> 2.227 líneas. Analizado por sección.

### CSS (líneas 16–299)

| Bloque CSS | Líneas | Decisión | Razón |
|------------|--------|----------|-------|
| Reset + body base | 17–19 | ✅ Mantener | Universal, no cambia |
| `#userScreen` + `.u-card` (selector usuario) | 22–34 | ❌ Eliminar | Reemplazado por Login Google |
| `.chip` Jaime/Anny hardcodeado | 32–34 | 🔄 Modificar | Chips deben ser dinámicos por miembro del hogar |
| `.topbar` | 36–45 | ✅ Mantener | Sigue siendo necesario |
| `.tabs` + `.tab` | 49–51 | 🔄 Modificar | Tabs serán dinámicos según perfil del hogar |
| `.pg` contenedor de página | 54–55 | ✅ Mantener | Sistema de páginas se conserva |
| `.mnav` navegación de mes | 57–61 | ✅ Mantener | Sigue siendo necesario |
| `.alert` | 63–66 | ✅ Mantener | Sistema de alertas útil |
| `.cards` + `.card` | 69–76 | ✅ Mantener | Componente de dashboard reutilizable |
| `.pw` barra de progreso | 79–83 | ✅ Mantener | Reutilizable |
| `.sec` sección genérica | 84–93 | ✅ Mantener | Componente base |
| `.inp` inputs | 110–116 | 🔄 Modificar | Agregar `type="text" inputmode="decimal"` para iOS |
| CSS Nómina (`.np`, `.nh`, `.nn`, etc.) | 150–170 | 🔄 Modificar | Nómina pasa a ser dinámica por cantidad de miembros |
| CSS Daily (`.dcard`, `.dform`, etc.) | 173–205 | ✅ Mantener | Base del nuevo tab "Hoy" |
| CSS Análisis (`.an-tab`, etc.) | 213–244 | ✅ Mantener | Se conserva el módulo Análisis |
| CSS Viaje (`.vcard`, `.vform`, etc.) | 246–296 | 📦 Mover | Mover a sección congelada / futura base de Planeador |

**Resumen CSS:** ~60% mantener · ~25% modificar · ~10% mover · ~5% eliminar

---

### HTML — Estructura y Pantallas

| Bloque HTML | Líneas | Decisión | Razón |
|-------------|--------|----------|-------|
| `<head>` + meta tags PWA | 1–15 | 🔄 Modificar | Cambiar título, apple-mobile-web-app-title |
| `#userScreen` (selector Jaime/Anny) | 302–312 | ❌ Eliminar | Reemplazado por pantalla de Login Google |
| `#pwab` banner instalación iOS | 314 | ✅ Mantener | Sigue siendo útil |
| `.topbar` | 316–325 | 🔄 Modificar | Cambiar título "💰 Finanzas" → "Organiza2"; chip dinámico |
| `#offlineBanner` | 326 | ✅ Mantener | Cola offline sigue siendo necesaria |
| `.tabs` (7 tabs hardcodeados) | 328–336 | ❌ Eliminar / reconstruir | Tabs deben generarse dinámicamente desde `getCapabilidades()` |
| Tab Mensual `#pm` | 339–377 | 🔄 Modificar | Se convierte en "Resumen". Eliminar "Cambiar usuario" y "Limpiar duplicados" del footer |
| Tab Presupuesto `#pb` | 380–399 | 🔄 Modificar | Integrar concepto de Presupuesto Base con frecuencia por ítem |
| Tab Nómina `#pn` | 402–476 | 🔄 Modificar | Hacerla dinámica: múltiples miembros del hogar. Actualmente hardcodeada para Jaime y Anny |
| Tab Empleadas `#pe` | 479–530 | 🔄 Modificar | Hacerla dinámica: múltiples empleados. Actualmente hardcodeada para Empleada y Niñera |
| Tab Hoy `#pd` | 532–557 | ✅ Mantener (base) | Es la base del nuevo flujo unificado de gastos |
| Tab Análisis `#px` | 559–609 | ✅ Mantener | Se conserva completo en v2.0 |
| Tab Viaje `#pv` | 611–718 | 📦 Congelar/Mover | Congelado. Motor del futuro Planeador. No tocar. |

**Resumen HTML:** ~30% mantener · ~45% modificar · ~15% mover/congelar · ~10% eliminar

---

### JavaScript — Funciones

| Función / Bloque | Líneas | Decisión | Razón |
|-----------------|--------|----------|-------|
| Variables globales (`db`, `curY`, `curM`, `D`, etc.) | 705–713 | 🔄 Modificar | Agregar `hogar`, `perfil`, `capabilidades`. Eliminar `user` hardcodeado |
| `const FBK = 'Anny1130'` | No visible — referenciado en `dKey()` | ❌ Eliminar | Reemplazado por `codigoHogar` dinámico |
| Firebase init | 716–725 | ✅ Mantener | Misma config, agregar `firebase.auth()` |
| `DOMContentLoaded` | 727–735 | 🔄 Modificar | Reemplazar lógica de usuario por `initLogin()` + `loadPerfil()` |
| `setUser()` / `updateChip()` | 738–739 | ❌ Eliminar | Reemplazado por Firebase Auth |
| `setSS()` / sync status | 742–750 | ✅ Mantener | Sistema de estado funciona bien |
| `save()` con debounce | 751–768 | 🔄 Modificar | Cambiar `dKey()` para usar `codigoHogar` |
| Cola offline (oqLoad/oqSave/oqAdd/oqSize) | 771–800 | ✅ Mantener | Implementación sólida, no cambiar |
| `syncOfflineQueue()` | 802–832 | ✅ Mantener | Funciona bien, solo actualizar paths |
| `dKey()` / `hKey()` / `dayKey()` | 840–842 | 🔄 Modificar | Cambiar `pl/${FBK}/` → `hogares/${codigoHogar}/pl/` |
| `defD()` datos por defecto | 845–916 | 🔄 Modificar | Las categorías por defecto deben derivarse del perfil del hogar, no ser hardcodeadas |
| `migrateCategories()` | 919–1005 | 📦 Mover | Lógica de migración de datos históricos — necesaria solo durante transición |
| `canonicalLabel()` | 1008–1089 | ✅ Mantener | Crítico. No tocar nunca. |
| `subMonth()` + `loadFixed()` | 1092–1145 | 🔄 Modificar | Actualizar paths de Firebase. `loadFixed()` debe usar Presupuesto Base |
| `renderMLabel()` | 1147–1150 | ✅ Mantener | Trivial, funciona |
| `go()` sistema de tabs | 1155–1173 | 🔄 Modificar | Tabs deben ser dinámicos; agregar casos para nuevos tabs |
| `chM()` navegación de mes | 1177 | ✅ Mantener | |
| `fmt()` / `raw()` / `planItems()` / `stripAutoItems()` | 1180–1186 | ✅ Mantener | Utilidades críticas |
| `ITEM_RENAMES` / `mergeItem()` / `normalizeCategoryItems()` | 1188–1210 | ✅ Mantener | Lógica de limpieza sólida |
| `logH()` historial | 1213 | ✅ Mantener | Actualizar path |
| `addInc/delInc/updInc/togFxInc` | 1216–1219 | ✅ Mantener | Funciona bien |
| `addCat/addItem/delItem/delCat/updExp/updBud/togFx` | 1222–1243 | ✅ Mantener | Core del presupuesto mensual |
| `copyBudPrev()` / `applyBudgetYear()` / `applyFixedYear()` | 1246–1309 | 🔄 Modificar | Actualizar paths; `applyFixedYear` debe integrarse con Presupuesto Base |
| `recalc()` | 1312–1360 | ✅ Mantener | Lógica sólida. Solo actualizar referencias |
| `renderAll()` | 1363–1414 | 🔄 Modificar | Agregar filtro por `getCapabilidades()` para categorías visibles |
| `renderBudget()` | 1417–1436 | 🔄 Modificar | Agregar campo `frecuencia` en display |
| `calcNom()` / `loadNomFields()` / `syncNom()` | 1439–1515 | 🔄 Modificar | Hacer dinámica para N miembros del hogar |
| `calcEmp()` / `loadEmpFields()` / `applyEmpToMonth()` / `syncEmp()` | 1518–1648 | 🔄 Modificar | Hacer dinámica para N empleados del hogar |
| `subDaily()` / `renderDailyData()` / `loadDailyPath()` | 1653–1686 | 🔄 Modificar | Actualizar paths Firebase |
| `submitDaily()` | 1706–1751 | ✅ Mantener (base) | Flujo sólido. Agregar soporte para "ingreso" además de "gasto" |
| `renderDailyList()` / `syncDailyMonth()` | 1755–1795 | 🔄 Modificar | Actualizar paths y filtros |
| `renderAnalisis()` / `renderSemaforo()` / `renderTendencia()` / `renderHormiga()` | 1806–2100+ | ✅ Mantener | Módulo Análisis se conserva en v2.0 |
| Todo el módulo Viaje (`subViaje`, `renderViaje`, etc.) | ~1900–2150 | 📦 Congelar | No tocar. Motor futuro del Planeador. |
| `cleanDuplicates()` / `toast()` | ~2150–2227 | ✅ Mantener | `cleanDuplicates` es herramienta de mantenimiento; `toast` es UI utility |

**Resumen JS:** ~40% mantener · ~40% modificar · ~10% mover/congelar · ~10% eliminar

---

## TAREA 5 — Análisis de la estructura Firebase actual vs necesidades v2.0

### Estructura actual
```
pl/[uid]/[año]/[mes]/
daily/[uid]/[año]/[mes]/[día]/[pushId]/
viaje/[uid]/[año]/[mes]/[día]/[pushId]/
hist/[uid]/[pushId]/
```

### Evaluación de capacidad para soportar v2.0

| Necesidad | ¿Lo soporta la estructura actual? | Problema | Solución |
|-----------|-----------------------------------|---------|---------|
| **Hogares** | ❌ No | No existe nodo `hogares/`. El uid es personal, no del hogar. | Crear `hogares/[codigoHogar]/` como nodo raíz |
| **Parejas (2 usuarios mismo hogar)** | ⚠️ Parcial | Ambos usan `Anny1130` hardcodeado — funciona por accidente, no por diseño. Sin Login no hay separación de identidades. | Login Google + código de hogar compartido |
| **Múltiples hijos** | ❌ No | No existe nodo para hijos. La categoría Educación tiene ítems hardcodeados (Colegio, Jardín) que no se asocian a un hijo específico. | `hogares/[codigoHogar]/perfil/hijos/[id]/` |
| **Múltiples vehículos** | ❌ No | Los ítems SOAT, Seguro vehículo, Impuestos están hardcodeados en categorías — no se asocian a un vehículo específico. | `hogares/[codigoHogar]/perfil/vehiculos/[id]/` |
| **Múltiples empleados domésticos** | ⚠️ Parcial | El código actual soporta Empleada + Niñera pero están hardcodeados con IDs fijos (`empleada`, `ninera`). No es extensible a 3+ empleados. | `hogares/[codigoHogar]/perfil/personalApoyo/[id]/` |
| **Presupuesto Base con frecuencia** | ⚠️ Parcial | Los ítems ya tienen el campo `months[]` para restricciones de mes. Falta el campo `frecuencia` para calcular automáticamente. | Agregar campo `frecuencia` al esquema de ítems |
| **Pantallas dinámicas** | ❌ No | No existe nodo de perfil del hogar. La app no puede leer qué tiene el hogar para decidir qué mostrar. | `hogares/[codigoHogar]/perfil/` como fuente de verdad |
| **Futuros módulos (Planeador, Alimentación)** | ❌ No | No hay nodos para eventos ni alimentación. La estructura actual solo contempla finanzas. | `hogares/[codigoHogar]/eventos/` y `hogares/[codigoHogar]/alimentacion/` |

### Veredicto
La estructura actual de Firebase **no soporta v2.0**. No es un problema de datos existentes — es un problema de modelo. La migración no es opcional; es la base de todo lo que sigue.

### Datos críticos reales a preservar
El nodo `pl/Anny1130/` contiene datos financieros reales de la familia desde abril 2026. Esta información **debe migrarse** antes de activar las nuevas reglas de seguridad.

---

## TAREA 6 — Roadmap técnico de migración hacia Organiza2 v2.0

### Principios del roadmap

1. **No romper producción.** Mientras se construye v2.0, el `index.html` actual sigue funcionando.
2. **Login antes que todo.** Sin autenticación real no tiene sentido construir el modelo de hogar.
3. **Migrar datos antes de cambiar reglas.** Los datos de `Anny1130` deben estar en el nuevo nodo antes de activar reglas por uid.
4. **El perfil del hogar habilita todo lo demás.** Sin perfil no hay pantallas dinámicas, sin pantallas dinámicas no hay v2.0.

---

### ETAPA A — Login Google + Identidad real
**Objetivo:** Reemplazar `const FBK = 'Anny1130'` por autenticación real.

| Paso | Tarea | Notas |
|------|-------|-------|
| A1 | Activar Firebase Authentication en consola (proveedor Google) | Ya existe el proyecto — solo activar |
| A2 | Agregar SDK `firebase-auth-compat.js` al `<head>` | Después de los SDKs actuales |
| A3 | Construir pantalla de login con botón "Entrar con Google" | Reemplaza `#userScreen` actual |
| A4 | Implementar `initLogin()`: `firebase.auth().signInWithPopup()` | Al cargar la app si no hay sesión activa |
| A5 | Guardar `uid` real en variable global (reemplaza `FBK = 'Anny1130'`) | Todo lo demás lo usa |
| A6 | Construir lógica: si ya tiene `codigoHogar` → continuar; si no → ir a onboarding | `usuarios/[uid]/codigoHogar` |

**Resultado:** El usuario autentica con Google. El uid real es la identidad del sistema.

---

### ETAPA B — Modelo de Hogar y Onboarding mínimo
**Objetivo:** Crear la entidad Hogar con su código compartido y perfil mínimo.

| Paso | Tarea | Notas |
|------|-------|-------|
| B1 | Implementar creación de hogar: genera `codigoHogar` aleatorio (6 chars alfanumérico) | Al primer login sin hogar |
| B2 | Guardar `usuarios/[uid]/codigoHogar = [codigoHogar]` en Firebase | Un usuario = un hogar |
| B3 | Crear nodo `hogares/[codigoHogar]/meta`: `{ nombre, tipo, creadoPor, creadoEn }` | Onboarding mínimo: solo pedir tipo (Soltero/Pareja/Familia) |
| B4 | Implementar flujo de invitación: ingresar código de hogar existente → `usuarios/[uid]/codigoHogar = [codigoHogar]` | Pareja puede unirse al hogar del otro |
| B5 | Inicializar `hogares/[codigoHogar]/perfil` con estructura vacía pero presente | Nodo existe aunque esté vacío |
| B6 | Implementar `loadPerfil()`: leer perfil del hogar al iniciar la app | Antes de renderizar cualquier cosa |
| B7 | Implementar `getCapabilidades(perfil)` | Lógica de flags según perfil |

**Resultado:** El Hogar existe en Firebase. El perfil mínimo está creado. La app sabe qué tipo de hogar es.

---

### ETAPA C — Migración de datos Anny1130
**Objetivo:** Mover los datos reales al nuevo modelo sin pérdida.

| Paso | Tarea | Notas |
|------|-------|-------|
| C1 | Hacer backup manual de `pl/Anny1130/` desde Firebase Console antes de cualquier cambio | Descarga JSON completo |
| C2 | Crear script de migración (ejecutar una sola vez desde consola del navegador) | Lee `pl/Anny1130/` → escribe en `hogares/[codigoHogar]/pl/` |
| C3 | Migrar `daily/Anny1130/` → `hogares/[codigoHogar]/daily/` | Misma estructura, diferente path |
| C4 | Migrar `viaje/Anny1130/` → `hogares/[codigoHogar]/viaje/` | Congelado pero los datos deben estar accesibles |
| C5 | Validar manualmente que los datos migrados son correctos en Firebase Console | Antes de cambiar reglas |
| C6 | Actualizar `dKey()`, `dayKey()`, `hKey()` para usar `codigoHogar` en lugar de `FBK` | Un cambio de string, ~3 funciones |
| C7 | Activar reglas de seguridad v2 (autenticación por uid + hogar compartido) | Solo después de validar datos |

**Resultado:** Los datos reales están en el nuevo modelo. Las rutas del código apuntan al nuevo nodo. La seguridad está activa.

---

### ETAPA D — Finanzas v2: pantallas dinámicas y Presupuesto Base
**Objetivo:** Reconstruir la experiencia de Finanzas sobre el modelo de hogar.

| Paso | Tarea | Notas |
|------|-------|-------|
| D1 | Implementar `renderDynamic()`: renderizar tabs y secciones según `getCapabilidades()` | Reemplaza tabs hardcodeados |
| D2 | Agregar campo `frecuencia` al esquema de ítems del presupuesto | `"mensual"` \| `"semestral"` \| `"anual"` |
| D3 | Implementar `calcPresupuestoBase()`: calcular valor mensual según frecuencia | SOAT anual ÷ 12 = provisión mensual |
| D4 | Hacer dinámica la sección Nómina: múltiples miembros en lugar de Jaime/Anny hardcodeados | Lee `perfil.miembros` |
| D5 | Hacer dinámica la sección Empleadas: múltiples empleados en lugar de Empleada/Niñera hardcodeados | Lee `perfil.personalApoyo` |
| D6 | Filtrar categorías visibles según `getCapabilidades()`: sin hijos → ocultar Educación | En `renderAll()` y `defD()` |
| D7 | Unificar tab "Hoy" para registrar gastos e ingresos (no solo gastos) | Nueva necesidad v2.0 |
| D8 | Fix iOS decimal: cambiar todos los `type="number" inputmode="numeric"` a `type="text" inputmode="decimal"` | Bug conocido sin resolver |
| D9 | Corregir `manifest.json` — `name` y `description` | Pendiente desde v1 |

**Resultado:** Finanzas v2.0 funciona sobre el modelo de hogar. Las pantallas se adaptan al perfil.

---

### ETAPA E — Onboarding progresivo
**Objetivo:** Que la app sugiera completar el perfil según el uso real.

| Paso | Tarea | Notas |
|------|-------|-------|
| E1 | Detectar: ¿el perfil tiene vehículos? Si no → al registrar SOAT, sugerir registrar vehículo | Gatillo por categoría usada |
| E2 | Detectar: ¿el perfil tiene hijos? Si no → al registrar Colegio, sugerir registrar hijo | Gatillo por categoría usada |
| E3 | Detectar: ¿el perfil tiene personal de apoyo? Si no → al registrar Servicio Doméstico, sugerir registrar empleado | Gatillo por categoría usada |
| E4 | Implementar banners de sugerencia no intrusivos (dismissibles) | No bloquear el flujo del usuario |
| E5 | Construir pantalla de Configuración del Hogar accesible desde menú | Editar perfil en cualquier momento |

**Resultado:** La app se siente personalizada desde el primer uso. El perfil se completa gradualmente sin formularios largos.

---

### ETAPA F — Validación con familias (v2.3) ⛔ REGLA DE PRODUCTO

> **Esta etapa no es opcional ni acortable. Es la condición de salida para construir el Planeador.**

**Regla formal:** No se desarrollará el Planeador ni el módulo de Alimentación hasta completar esta etapa satisfactoriamente.

**Objetivo:** Confirmar con uso real que los cimientos de Organiza2 v2.0 funcionan antes de construir nuevos módulos.

| Paso | Tarea | Notas |
|------|-------|-------|
| F1 | Compartir la app con 5-10 familias conocidas | Login Google ya disponible — fácil de compartir |
| F2 | Observar si completan el onboarding sin ayuda | Valida el flujo progresivo |
| F3 | Observar si configuran el Presupuesto Base | Valida el concepto central de Finanzas v2.0 |
| F4 | Observar si ambos miembros de la pareja usan la app | Valida la transparencia financiera compartida |
| F5 | Observar qué categorías usan y cuáles ignoran | Valida las categorías oficiales |
| F6 | Recoger feedback explícito sobre pantallas dinámicas | ¿La app se siente personalizada? |
| F7 | Identificar problemas críticos no resueltos | Cualquier problema crítico bloquea el avance a v3.0 |

**Condición de salida — los tres requisitos para poder iniciar el Planeador:**
1. Al menos 5 hogares han usado Finanzas v2.0 activamente durante 4 semanas.
2. El Presupuesto Base ha sido configurado por al menos 3 hogares.
3. No existen problemas críticos sin resolver en el modelo de hogar o en el onboarding.

---

### Resumen del roadmap técnico

```
ETAPA A — Login Google          (1–2 semanas)
    │
    ▼
ETAPA B — Modelo de Hogar       (1–2 semanas)
    │
    ▼
ETAPA C — Migración Anny1130    (2–3 días — cuidado máximo)
    │
    ▼
ETAPA D — Finanzas v2           (2–3 semanas)
    │
    ▼
ETAPA E — Onboarding progresivo (1 semana)
    │
    ▼
ETAPA F — Validación familias   (3–4 semanas — sin construir)
    │
    ▼
v3.0 — Planeador
```

**Estimación total hasta v2.3 (listo para piloto):** 8–12 semanas de desarrollo iterativo.

---

## Resumen ejecutivo de la auditoría

### Lo que está bien y se conserva
- Sistema de cola offline — implementación sólida, no tocar
- `canonicalLabel()` — crítico, no tocar nunca
- `planItems()` como función canónica — mantener regla
- `recalc()` — lógica financiera correcta
- Módulo Análisis (Semáforo, Tendencia, Hormiga) — se conserva completo
- Módulo Viaje — congelado, será base del Planeador
- Sistema de tabs + páginas — mecánica se conserva, contenido cambia
- Firebase Realtime Database — sigue siendo la elección correcta
- GitHub Pages + deploy con git push — no cambia

### Lo que debe cambiar
- `const FBK = 'Anny1130'` → Firebase Auth real
- `userScreen` selector Jaime/Anny → Login Google
- Tabs hardcodeados → tabs dinámicos por `getCapabilidades(perfil)`
- Nómina hardcodeada (Jaime/Anny) → dinámica por miembros del hogar
- Empleadas hardcodeadas (Empleada/Niñera) → dinámica por personal del hogar
- Categorías hardcodeadas en `defD()` → derivadas del perfil del hogar
- Estructura Firebase `pl/[uid]/` → `hogares/[codigoHogar]/pl/`
- `type="number"` en todos los inputs de monto → `type="text" inputmode="decimal"`

### Lo que se elimina
- Pantalla "¿Quién eres?" (selector de usuario)
- Botón "Cambiar usuario" en footer del tab Mensual
- `const FBK` y toda su lógica asociada

### La decisión más crítica del proceso
**La migración de datos (Etapa C)** es el momento de mayor riesgo. Los datos reales de la familia desde abril 2026 deben moverse al nuevo modelo sin pérdida. Requiere backup previo, script validado, verificación manual y solo entonces cambio de reglas de seguridad. No hay prisa en este paso.

---

*Organiza2 — Auditoría v2.0 | Junio 2026*
