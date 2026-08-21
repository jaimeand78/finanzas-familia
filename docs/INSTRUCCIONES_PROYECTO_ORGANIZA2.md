# Organiza2 — Instrucciones del Proyecto
Versión: Julio 2026

---

## Pregunta Inicial Obligatoria

Antes de continuar cualquier conversación relacionada con Organiza2, preguntar:

**¿La documentación y los archivos en Fuentes siguen actualizados?**

- Sí → continuar usando exclusivamente los archivos de Fuentes.
- No → actualizar primero los archivos de Fuentes antes de continuar.

Si existe cualquier duda sobre la vigencia: **detener y solicitar confirmación.**

---

## Identidad del Proyecto

Organiza2 NO es una aplicación financiera.

Es una plataforma para organizar la vida en pareja y familia en Latinoamérica.

**Lema:** Organizamos tu vida en pareja.

**Propósito:**
- Reducir la carga mental del hogar
- Mejorar la organización compartida
- Facilitar la planificación familiar
- Crear transparencia entre los miembros del hogar
- Disminuir discusiones causadas por falta de información

Las finanzas son solamente uno de los módulos del ecosistema.

---

## Arquitectura del Ecosistema

```
🏠 Hogar (entidad principal)
   ↓
💰 Finanzas · 📋 Planeador · 🍽️ Alimentación
```

Todo dato vive bajo `hogares/[codigoHogar]/`.

**Módulos futuros — NO construir todavía:**
- Planeador (v3.0) — hasta cumplir los criterios de salida del piloto
- Alimentación (v4.0) — hasta después del Planeador

---

## Estado Actual

**Fase:** v2.3 — Piloto activo con familias (desde junio 2026). Seguimiento en `admin.html`.

**App:** `organiza2.github.io/hogar`
**Repo:** `github.com/organiza2/hogar`
**Firebase:** `organiza2-a09ef`
**Hogar activo:** SNBDPA (Ibarra Masso) — 2 miembros

**Implementado en producción:**
- Login Google + Firebase Auth
- Modelo de Hogar con código de invitación
- Onboarding conversacional (P1 → P1.5 → P2 → P3 → P4 → P5)
- Flags de perfil: tieneVehiculo, tieneEmpleada, tieneEducacion, tieneSeguros
- Tab Hoy — registro diario filtrado por perfil + edición de registros (tap en fila → modal)
- Tab Resumen — solo lectura (disponible · Ingresan/Gastado · Ahorro · semáforo · ¿Quién pagó?)
- Tab Análisis — Semáforo histórico · Tendencia · Hormiga
- Tab Config — Mi hogar · Ingresos · Presupuesto base (footer Total mes / Total año) · Cerrar sesión
- Service Worker — cache-first para shell, network-only para Firebase
- Telemetría del piloto — `telemetria.js` · `trackEvent(tipo)` · 6 métricas en `metricas/eventos`
- `admin.html` — dashboard del piloto (métricas por semana ISO + criterios de salida)

---

## Stack Tecnológico

- HTML + CSS + JS Vanilla — **sin frameworks**
- Firebase Realtime Database + Auth (Google)
- GitHub Pages
- PWA con Service Worker (cache-first shell · network-only Firebase)

**No usar:** React, Vue, Angular, npm, webpack, ni ningún build tool.

---

## Fuente Única de Verdad

La única fuente oficial son los archivos en Fuentes. Jerarquía:

1. Archivos de Fuentes
2. Instrucciones del usuario en la conversación actual
3. Conversaciones anteriores

**Si hay contradicción: siempre prevalecen los archivos de Fuentes.**

**Árbitro:** ante duda sobre la vigencia de Fuentes, el repo GitHub `main` es el árbitro — ver Regla de Arbitraje.

Documentos de referencia obligatoria:
- `CONTEXTO_MAESTRO_ORGANIZA2.md`
- `REGLAS_IA.md`
- `arquitectura_v2_3.md`
- `producto_v2_3.md`
- `bitacora_v2_3.md`
- `decisiones_junio2026.md`

---

## Regla de Arbitraje — GitHub

El repositorio `github.com/organiza2/hogar` (rama `main`) es el **árbitro final** del estado real del proyecto: es lo que está desplegado en producción.

- Ante cualquier duda sobre si Fuentes está actualizado, la IA verifica directamente contra el repo:
  `curl -s https://raw.githubusercontent.com/organiza2/hogar/main/[ruta]` y compara con la copia en Fuentes. Documentación en `docs/` · `README.md` y `REGLAS_IA.md` en la raíz.
- **Verificación canario:** comparar `CACHE_NAME` de `sw.js` (repo vs Fuentes). Si coinciden, el código en Fuentes muy probablemente está al día.
- Si Fuentes difiere del repo → **detener el trabajo**, informar la diferencia y pedir actualización de Fuentes antes de continuar.
- Antes de modificar cualquier archivo de código, esta verificación complementa la Pregunta Inicial Obligatoria: no solo preguntar — comprobar.

**Jerarquía de verdad:** GitHub `main` (estado real) → Fuentes (espejo de trabajo) → instrucciones y memoria.

---

## Reglas de Trabajo con Archivos

**Antes de modificar cualquier archivo:**
1. Confirmar que la versión en Fuentes es la más reciente
2. Leer el archivo actual
3. Hacer SOLO el cambio necesario — nunca reescribir desde cero
4. Entregar solo el archivo modificado

**Cambios pequeños y localizados** → el usuario los aplica en VS Code con Ctrl+H
**Cambios grandes o multifunción** → la IA genera el archivo completo

---

## Regla de Mockups

Antes de implementar cualquier cambio de UX o UI:
1. Crear mockup interactivo
2. Iterar con el usuario hasta aprobación
3. Solo entonces implementar

---

## Decisiones Arquitecturales Vigentes (DA)

| DA | Decisión |
|----|----------|
| DA-0 | Hogar es la entidad principal — datos en `hogares/[codigoHogar]/` |
| DA-1 | Gastos diarios solo en `daily/` — nunca escribir en nodo mensual |
| DA-2 | `planItems(cat)` es la única forma de obtener ítems de una categoría |
| DA-3 | `canonicalLabel()` corrige encodings corruptos — nunca modificar |
| DA-4 | Firebase SDK compat v9.23.0 |
| DA-5 | Google Login antes de separar JS en módulos |
| DA-6 | Código de hogar = 6 caracteres alfanuméricos uppercase |
| DA-7 | Perfil controla toda la UX — `filtrarCategoriasPorPerfil()` + `filtrarItemsPorPerfil()` |
| DA-8 | `calcPresupuestoBase(item, mes)` es la única función de provisión mensual |
| DA-9 | Perfil progresivo — flags configurados en P1.5 del onboarding |
| DA-10 | Catálogo único: `defD()` y `DAILY_ITEMS` son idénticos — modificar siempre juntos con `migrateCategories()` |
| DA-11 | Ingresos desde `buildIncomeFromPerfil()` — nunca hardcodear nombres |
| DA-12 | Cuota crédito vehículo en Transporte, no en Vivienda |
| DA-13 | Restaurantes en Entretenimiento y Salidas — eliminado de Alimentación |
| DA-14 | Tab Resumen es solo lectura — sin inputs |
| DA-15 | Login con logo oficial `logo.png` |
| DA-16 | Config solo muestra configuración — no gastos reales del mes |
| DA-17 | Siempre leer el archivo actual antes de modificarlo |
| DA-18 | Config muestra budget anual — nunca filtrar ítems de fecha fija (`months[]`) por mes actual |
| DA-19 | Ahorro es indicador de primer nivel — posición fija en Resumen, antes del semáforo |
| DA-20 | `_soloFlags: true` indica flujo parcial — nunca llama `_aplicarOnbDataAD()` ni `save()` |
| DA-21 | Flujos de actualización del hogar: `_soloFlags` · `_soloTipo` · `_soloMeta` — cada flag controla qué pantallas renderizan y qué botón de guardado aparece |
| DA-22 | `admin.html` — dashboard del piloto: standalone, solo lectura, guard de UID hardcodeado |
| DA-23 | `calcPresupuestoBase()` chequea `months[]` antes que `frecuencia` — fecha fija tiene prioridad |
| DA-24 | `loadFixed()` busca hacia atrás hasta 12 meses el nodo con budgets — el presupuesto no se propaga a los 12 meses en Firebase |
| DA-25 | Telemetría del piloto: `telemetria.js` aislado · `trackEvent(tipo)` · nodo `metricas/eventos` · 6 métricas oficiales · sin datos sensibles |

---

## Reglas Técnicas Críticas

| Función | Regla |
|---------|-------|
| `planItems(cat)` | SIEMPRE usar esta, nunca `cat.items` directamente (DA-2) |
| `canonicalLabel()` | Aplicar al leer de Firebase, nunca modificar (DA-3) |
| `calcPresupuestoBase(item, mes)` | Única función para provisión mensual — nunca acceder a `r.budget` directo (DA-8) |
| `months[]` | Tiene prioridad sobre `frecuencia` en `calcPresupuestoBase()` (DA-23) |
| `loadFixed()` | Busca hacia atrás hasta 12 meses el nodo con budgets configurados (DA-24) |
| `defD()` + `DAILY_ITEMS` + `migrateCategories()` | Catálogo único — los tres se modifican siempre juntos (DA-10) |
| `buildIncomeFromPerfil()` | Única fuente de ingresos — nunca hardcodear (DA-11) |
| Campo `who` | Poblar desde `HOGAR.miembros[uid].nombre` — nunca desde `displayName` de Google |
| iOS inputs | `type="text" inputmode="decimal"` en todos los campos de monto |
| `dailyTotals` | Claves SIN emoji — normalizar con `.replace(/^\S+\s/, '')` |

---

## Regla de Service Worker (cache)

- Todo deploy con cambios en HTML, CSS o JS requiere incrementar `CACHE_NAME` en `sw.js` (ej: `organiza2-v2-14` → `organiza2-v2-15`).
- Si solo cambian docs o el propio `sw.js`, no se requiere bump.
- El bump va SIEMPRE en el último commit — después de que los archivos corregidos estén commiteados. Bumpear antes deja la versión con bugs en cache (aprendizaje Fase 44).
- Verificar tras el bump: `grep "CACHE_NAME" sw.js`.

---

## Regla de Commits (PowerShell — comandos separados)

```
git add [archivo]
git commit -m "tipo: descripción corta"
git push
```

Tipos: `feat` · `fix` · `docs` · `refactor`

Commits de código y de documentación siempre separados — nunca mezclados.

---

## Principio Permanente

Antes de proponer cualquier cambio, preguntarse:

**¿Esto reduce la carga mental del hogar o agrega complejidad?**

Si la respuesta no es claramente "reduce carga mental" → no implementar.
