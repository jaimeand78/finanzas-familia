# Parte II — ORGANIZA2

> **Este archivo es el original versionado de la Parte II de las instrucciones de proyecto de Organiza2.**
> La copia que vive en claude.ai se pega desde aquí, entera y sin editar. Si el criterio cambia, se cambia
> aquí, se commitea y se vuelve a pegar completo. Una sola edición hecha directamente en la interfaz
> reinstala la divergencia que esta reorganización eliminó — y nada la delata.
>
> Encima de este bloque va la **Parte I — Andamiaje**, que es transversal y no vive en este repo.
> Lo que la Parte I ya manda **no se repite aquí**: Regla de Oro y sus tres corolarios, regla de conflicto,
> mantenimiento del conjunto, taxonomía de hallazgos, A/B/C antes de código, una variable a la vez,
> cierre de sesión y PowerShell.

---

## Pregunta rectora

Antes de proponer cualquier cambio:

**¿Esto reduce la carga mental del hogar o agrega complejidad?**

Si la respuesta no es claramente "reduce carga mental" → no implementar.

---

## Identidad

Organiza2 **no** es una aplicación financiera. Es una plataforma para organizar la vida en pareja y familia en Latinoamérica. Lema: *"Organizamos tu vida en pareja."*

Las finanzas son **uno** de los módulos del ecosistema, no el producto.

El desarrollo completo — propósito, qué NO es, ADN — vive en `docs/contexto_maestro.md`.

---

## Invariantes

- **El Hogar es la entidad principal.** Todo dato vive bajo `hogares/[codigoHogar]/`. Nunca en un nodo personal de usuario.
- **No construir Planeador ni Alimentación** hasta cumplir los criterios de salida definidos en `docs/producto.md` §9. Ese documento manda sobre el número y la condición; aquí no se repiten para que no puedan quedar viejos.
- **Tab Resumen es solo lectura.** Tab Config es solo configuración — no muestra gastos reales del mes.
- **Stack cerrado:** HTML + CSS + JS vanilla, Firebase Realtime Database + Auth (Google), GitHub Pages, PWA. **No usar** React, Vue, Angular, npm, webpack ni ningún build tool.

Las decisiones ratificadas y su razonamiento viven en `docs/arquitectura.md` (DA-0 en adelante). **Ese documento manda sobre esta lista** — si algo de aquí lo contradice, gana la DA.

---

## Protocolo de arranque

No preguntar si la documentación está actualizada: **comprobarlo.**

1. **Canario.** Comparar `CACHE_NAME` de `sw.js` entre el repo y la copia de trabajo. Si coinciden, el código de la copia muy probablemente está al día; si no, la copia quedó atrás.
2. **Alcance.** Verificar los archivos que se van a modificar. El canario cubre el estado general sin descargar todo.

Índice de documentos: `README.md` (puerta de entrada) y `.claude/skills/organiza2/SKILL.md` (dónde ir a mirar). Repo: `github.com/organiza2/hogar` · App: `organiza2.github.io/hogar` · Firebase: `organiza2-a09ef`.

---

## Convenciones propias

**Regla de Archivos.** Leer el archivo actual antes de modificarlo. Hacer solo el cambio necesario — nunca reescribir desde cero si ya existe una versión oficial. Entregar solo el archivo modificado.

**Regla de Cambios.** Cambios pequeños y localizados → el usuario los aplica en VS Code con `Ctrl+H`. Cambios grandes o que afectan varias funciones → la IA genera el archivo completo.

**Regla de Mockup.** Antes de implementar cualquier cambio de UX o UI: mockup interactivo → iterar con el usuario → aprobación → recién entonces código. Aplica a pantallas nuevas, rediseños de tabs, formularios y onboarding.

**Regla de Service Worker.** Todo deploy con cambios en HTML, CSS o JS requiere incrementar `CACHE_NAME` en `sw.js`. Si solo cambian docs o el propio `sw.js`, no se requiere bump. **El bump va siempre en el último commit**, después de que los archivos corregidos ya estén commiteados — bumpear antes deja la versión con bugs en cache (aprendizaje Fase 44). Verificar tras el bump: `grep "CACHE_NAME" sw.js`.

**Commits.** Tipos: `feat` · `fix` · `docs` · `refactor`. **Código y documentación nunca en el mismo commit.**

---

## Lecciones

Solo las que no tienen dueño en una DA. Lo demás vive en `docs/arquitectura.md`.

- **Verificar en Firebase antes de asumir pérdida de datos.** Los datos pueden estar intactos aunque la UI no los muestre.
- **Documentar los textos aprobados de onboarding en la bitácora en el momento.** Reconstruirlos después desde el código es caro.
- **Después de eliminar cualquier módulo de código, barrer referencias huérfanas:** JS, CSS, variables globales y el objeto `PAGES`.
