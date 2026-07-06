# 🤖 REGLAS_IA.md
# Reglas de trabajo para asistentes IA en Organiza2

> Este archivo debe leerse ANTES de tocar cualquier línea de código.
> Aplica para Claude, ChatGPT, Gemini o cualquier IA que trabaje en este proyecto.

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

## Regla de Oro — Archivos

**Antes de modificar cualquier archivo, SIEMPRE:**

1. Preguntar al usuario: *"¿El archivo [nombre] del proyecto está actualizado?"*
2. Si no está actualizado → pedirlo antes de tocar nada
3. Leer el archivo actual del proyecto o el que el usuario suba
4. Hacer SOLO el cambio necesario — nunca reescribir desde cero
5. Entregar SOLO el archivo modificado, no todos los archivos

**¿Por qué?** En sesiones anteriores se perdieron cambios porque se generaron archivos nuevos basados en versiones desactualizadas del proyecto, pisando el trabajo correcto. Esta regla evita ese problema.

---

## Regla de Cambios

- **Cambios pequeños y localizados** → el usuario los aplica directamente en VS Code con Ctrl+H
- **Cambios grandes o que afectan múltiples funciones** → la IA genera el archivo completo
- **Nunca reescribir un archivo completo si solo cambia una función**
- **Nunca generar un archivo desde cero si ya existe en el proyecto**

---

## Regla de Arquitectura

Antes de proponer cualquier cambio técnico, verificar alineación con:

- `docs/producto_v2_3.md` — visión, módulos, onboarding
- `docs/arquitectura_v2_3.md` — decisiones arquitecturales DA-0 a DA-25
- `docs/bitacora_v2_3.md` — historial por fases, bugs resueltos, deuda técnica
- `docs/decisiones_junio2026.md` — registros de decisión
- `docs/CONTEXTO_MAESTRO_ORGANIZA2.md` — contexto maestro para IAs

Preguntarse siempre: **¿esto reduce la carga mental del hogar o agrega complejidad?**

---

## Regla de Producto

- **No construir Planeador ni Alimentación** hasta validar Finanzas v2 con familias reales
- **El Hogar es la entidad principal** — todo dato vive en `hogares/[codigoHogar]/`
- **El tab Resumen es solo lectura** — sin inputs, sin edición
- **El tab Config es configuración** — no muestra gastos reales del mes

---

## Reglas Técnicas Críticas

| Regla | Descripción |
|-------|-------------|
| `planItems(cat)` | SIEMPRE usar esta función, nunca `cat.items` directamente (DA-2) |
| `canonicalLabel()` | Aplicar al leer de Firebase, nunca modificar (DA-3) |
| `calcPresupuestoBase(item, mes)` | Única función para calcular provisión mensual (DA-8) |
| `DAILY_ITEMS` | Catálogo del tab Hoy — NUNCA mezclar con `defD()` (DA-10) |
| Ingresos | Siempre desde `buildIncomeFromPerfil()`, nunca hardcodeados (DA-11) |
| iOS inputs | `type="text" inputmode="decimal"` en todos los campos de monto |
| Firebase daily | Los gastos diarios NUNCA se escriben en el nodo mensual (DA-1) |

---

## Regla de Mockup

**Antes de implementar cualquier cambio visual:**
1. Hacer un mockup interactivo
2. Iterar con el usuario hasta aprobación
3. Solo entonces implementar

Esto aplica para: nuevas pantallas, rediseños de tabs, cambios en formularios, onboarding.

---

## Regla de Commits

Un commit por cambio específico. Formato:

```
feat: descripción corta de la nueva funcionalidad
fix: descripción corta del bug corregido
docs: descripción de documentación actualizada
refactor: descripción del cambio técnico sin nueva funcionalidad
```

---

## Regla de Service Worker (cache)

- Todo deploy con cambios en HTML, CSS o JS requiere incrementar `CACHE_NAME` en `sw.js` (ej: `organiza2-v2-14` → `organiza2-v2-15`).
- Si solo cambian docs o el propio `sw.js`, no se requiere bump.
- El bump va SIEMPRE en el último commit — después de que los archivos corregidos estén commiteados. Bumpear antes deja la versión con bugs en cache (aprendizaje Fase 44).
- Verificar tras el bump: `grep "CACHE_NAME" sw.js`.

---

## Stack — No cambiar sin consultar

- HTML + CSS + JS Vanilla — **sin frameworks**
- Firebase Realtime Database + Auth (Google)
- GitHub Pages hosting
- PWA con Service Worker (cache-first para shell, network-only para Firebase)

**No usar:** React, Vue, Angular, npm, webpack, ni ningún build tool.

---

## Contexto del Proyecto

- **App:** [organiza2.github.io/hogar](https://organiza2.github.io/hogar)
- **Repo:** `github.com/organiza2/hogar`
- **Firebase:** proyecto `organiza2-a09ef`
- **Hogar activo:** SNBDPA ("Ibarra Masso") — 2 miembros
- **Estado:** v2.3 — piloto activo con familias (desde junio 2026)

---

*Organiza2 — REGLAS_IA.md | Julio 2026*
