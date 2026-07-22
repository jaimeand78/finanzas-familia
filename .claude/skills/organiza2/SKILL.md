---
name: "organiza2"
description: "Contexto del proyecto Organiza2: PWA para organizar la vida en pareja y familia en Latinoamerica (NO es una app financiera). Usalo cuando se trabaje en diseno, codigo, arquitectura o producto de Organiza2 - identidad visual, interfaz, onboarding, piloto de familias, bugs, decisiones de arquitectura (DA)."
---

# Organiza2 - Contexto del proyecto

## Que es
PWA en espanol para organizar la vida en pareja y familia. El hogar (no el individuo) es la entidad responsable. Finanzas es solo uno de los modulos del ecosistema; Planeador y Alimentacion vienen despues.

**Pregunta rectora de producto (aplicar a toda decision):**
Esto reduce la carga mental del hogar o agrega complejidad? Si la respuesta no es claramente "reduce carga mental" -> no implementar.

## Vision central
Slogan: "Organizamos tu vida en pareja."

No es una app financiera - es una plataforma de organizacion compartida. Evitar cualquier cosa que se sienta a software corporativo o ERP: sin tablas densas, sin jerga contable, sin configuracion excesiva.

Frase guia real del proyecto: "Una mama mira colores, no numeros" - priorizar semaforos y color sobre cifras crudas cuando sea posible.

Arquitectura del ecosistema:
```
Hogar (entidad principal)
   -> Finanzas . Planeador . Alimentacion
```
Todo dato vive bajo `hogares/{codigoHogar}/`.

**Regla de roadmap dura:** Planeador (v3.0) y Alimentacion (v4.0) no se disenan ni se codifican todavia - hasta validar Finanzas v2.0 con 5-10 familias reales durante al menos 4 semanas, cumpliendo criterios de salida explicitos. Si se pide avanzar en Planeador/Alimentacion, recordar esta regla y confirmar con el usuario antes de continuar.

## Sistema de diseno
- color-primario: #1D9E75 (verde tranquilidad)
- color-fondo: #F5F5F5
- color-superficie: #FFFFFF
- color-texto: #1A1A1A
- color-muted: #6B6B68
- color-error: #D85A30
- color-positivo: #0F6E56 (sobre fondo #E1F5EE / #E8F5EF)
- color-negativo: #993C1D (sobre fondo #FAECE7)
- color-info: #185FA5 (sobre fondo #E6F1FB)
- Tipografias: DM Sans (texto general), DM Mono (numeros, montos, codigos de hogar - nunca para texto normal)
- Logo: `logo.png` - estilo 3D suave, tono crema, fondo redondeado. Comunica identidad en login/onboarding; nunca reemplazar por un emoji.
- Radio de bordes estandar: 12px

## Stack tecnico
HTML/CSS/JS vanilla - sin frameworks, sin npm, sin build step. Firebase Realtime Database + Auth (Google), SDK compat v9.23.0. GitHub Pages. PWA con Service Worker (cache-first para el shell, network-only para Firebase).

## Regla de Oro (critica - aplicar siempre)
La documentacion en Fuentes/docs es fotografia estatica. El arbitro real es el codigo en GitHub. Antes de editar o afirmar el estado de cualquier archivo, traer la version viva desde `raw.githubusercontent.com/organiza2/hogar/main/[path]` (usar `?cb=$(date +%s)` para evitar cache de CDN). Verificacion canario: comparar `CACHE_NAME` de `sw.js` entre el repo y la copia local - si coinciden, la copia local probablemente esta al dia. Ante cualquier "ya quedo hecho", verificar contra el codigo, no contra el resumen.

## Donde vive el estado dinamico (no lo asumas, ve a buscarlo)
Antes de responder sobre el estado actual del proyecto (DAs vigentes, bugs abiertos, en que fase va el piloto, que se decidio en la ultima sesion), consulta:
- `docs/arquitectura_v2_3.md` - Decisiones Arquitecturales (DA-0 en adelante)
- `docs/producto_v2_3.md` - vision de producto, roadmap, modelo de negocio
- `docs/bitacora_v2_3.md` - historial de sesiones y aprendizajes
- `docs/decisiones_junio2026.md` - decisiones de diseno recientes (incl. Planeador)
- `docs/CONTEXTO_MAESTRO_ORGANIZA2.md` - resumen maestro
- `REGLAS_IA.md` (raiz del repo) - reglas de trabajo vigentes

Estos documentos cambian cada sesion. Este Skill NO los duplica - solo indica que existen y donde estan.

## Convenciones de sesion (fijas, no cambian)
- Mockup interactivo antes de implementar cualquier cambio de UI/UX - iterar hasta aprobacion del usuario, recien entonces codigo
- Cambios quirurgicos - solo lo necesario, nunca reescribir un archivo desde cero si ya existe
- Leer el archivo actual antes de modificarlo, siempre
- Service Worker: todo deploy con cambios en HTML/CSS/JS incrementa `CACHE_NAME` en `sw.js` (ej: v2-14 -> v2-15). El bump va SIEMPRE en el ultimo commit, despues de que los archivos corregidos ya esten commiteados - nunca antes (bumpear antes deja la version con bugs en cache)
- Commits en PowerShell: comandos separados (`git add`, `git commit`, `git push` - nunca encadenados con `&&`). Commits de codigo y de documentacion siempre separados. Tipos: feat . fix . docs . refactor
- Coordinacion del piloto via WhatsApp ("Organiza2 - Piloto Familias"); las familias deben cerrar la PWA completa desde el multitask view y reabrirla para recibir actualizaciones - Pull-to-Refresh no fuerza el update del Service Worker

## Sistema de tickets
- DA-###: decisiones de arquitectura (en `arquitectura_v2_3.md`)
- Deuda tecnica y bugs conocidos: en `bitacora_v2_3.md`

## Lecciones aprendidas (aplicar, no repetir el error)
- El logo en el login comunica identidad - un emoji no
- Config es configuracion anual, no vista mensual ni edicion de gastos reales del mes (DA-18, DA-16)
- El ahorro no es una categoria mas - es el primer indicador de disciplina financiera, siempre visible en posicion fija (DA-19)
- `_soloFlags` es el patron correcto para flujos parciales del onboarding - nunca asumir que un flujo parcial puede llamar funciones de guardado completo (DA-20)
- Siempre verificar en Firebase antes de asumir perdida de datos - los datos pueden estar intactos aunque la UI no los muestre
- Documentar los textos aprobados de onboarding en la bitacora inmediatamente - reconstruirlos desde el codigo despues es costoso
- Despues de eliminar cualquier modulo de codigo: barrer JS, CSS, variables globales y el objeto `PAGES` en busca de referencias huerfanas

## Al trabajar visualmente (Claude Design)
- Respetar la paleta y tipografia del sistema de diseno - no improvisar colores nuevos
- El logo oficial (`logo.png`) es el simbolo de marca central - no rediseñar desde una captura, no crear variantes sin validar el activo oficial
- Cualquier propuesta de interfaz debe evaluarse contra la pregunta rectora antes de darse por buena
- No asumir estados de UI sin confirmarlos contra `docs/arquitectura_v2_3.md` o `docs/producto_v2_3.md`

## Al trabajar en codigo (Claude Code)
- Aplicar la Regla de Oro: fetch del archivo real desde GitHub antes de editar
- Respetar funciones unicas ya existentes por archivo - no duplicar `planItems()`, `calcPresupuestoBase()`, `canonicalLabel()`, `buildIncomeFromPerfil()` (ver `arquitectura_v2_3.md` para el listado completo de DAs)
- Bump de `CACHE_NAME` en `sw.js` en el mismo commit final cuando aplique
- No escribir codigo durante sesiones marcadas como "diseno/definicion" o antes de que el mockup este aprobado
