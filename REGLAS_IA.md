# 🤖 REGLAS_IA.md
# Reglas de trabajo para asistentes IA en Organiza2

> Este archivo debe leerse ANTES de tocar cualquier línea de código.
> Aplica para Claude, ChatGPT, Gemini o cualquier IA que trabaje en este proyecto.

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
- `docs/arquitectura_v2_3.md` — decisiones arquitecturales DA-0 a DA-17
- `docs/bitacora_v2_5.md` — historial, bugs resueltos, deuda técnica

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
| `calcPresupuestoBase(item, mes)` | Única función para calcular provisión mensual (DA-8). **Nunca usar `r.budget` directamente** — siempre pasar por esta función. Antes de cualquier cambio que toque presupuestos, auditar todos los archivos con `grep -rn "r\.budget"` y corregir los que no la usen. `months[]` tiene prioridad sobre `frecuencia` (DA-23) |
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

## Regla de sw.js — Orden de commits obligatorio

El service worker cachea el shell en el momento del install. Si `sw.js` se sube antes que los archivos corregidos, el cache queda con la versión bugueada.

**Orden obligatorio:**

1. `git add [archivos modificados]` → `git commit` → `git push`
2. Esperar 1-2 minutos para que GitHub Pages propague
3. Recién entonces: `git add sw.js` → `git commit -m "fix: bump cache vX-Y"` → `git push`

**El bump de `sw.js` es siempre el último commit de cualquier deploy.**

Incrementar `CACHE_NAME` en `sw.js` en cada deploy que modifique archivos del SHELL (HTML, CSS, JS). No es necesario para cambios solo en `docs/`.

---

## Stack — No cambiar sin consultar

- HTML + CSS + JS Vanilla — **sin frameworks**
- Firebase Realtime Database + Auth (Google)
- GitHub Pages hosting
- PWA (sin service worker complejo)

**No usar:** React, Vue, Angular, npm, webpack, ni ningún build tool.

---

## Contexto del Proyecto

- **App:** [organiza2.github.io/hogar](https://organiza2.github.io/hogar)
- **Repo:** `github.com/organiza2/hogar`
- **Firebase:** proyecto `organiza2-a09ef`
- **Hogar activo:** SNBDPA ("Ibarra Masso") — 2 miembros
- **Estado:** v2.3 — piloto activo con familias

---

*Organiza2 — REGLAS_IA.md | Junio 2026*
