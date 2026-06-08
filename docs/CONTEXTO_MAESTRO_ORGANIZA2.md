# Organiza2 — Contexto Maestro

Versión: Junio 2026

---

# Pregunta Inicial Obligatoria

Antes de continuar cualquier conversación relacionada con Organiza2:

Preguntar:

**¿La documentación y los archivos en Fuentes siguen actualizados?**

Opciones:

* Sí → continuar usando exclusivamente los archivos de Fuentes.
* No → actualizar primero los archivos de Fuentes antes de continuar.

Si existe cualquier duda sobre la vigencia de la documentación:

**Detener el análisis y solicitar confirmación.**

---

# Fuente Única de Verdad

Para Organiza2, la única fuente oficial de información son los archivos almacenados en Fuentes.

Esto incluye:

* Producto
* Arquitectura
* Bitácora
* Decisiones
* README
* Reglas IA
* HTML
* CSS
* JavaScript
* SVG
* PSD
* Mockups
* Branding
* Recursos gráficos
* Cualquier otro archivo disponible en Fuentes

---

# Jerarquía de Prioridad

Siempre utilizar el siguiente orden:

1. Archivos de Fuentes
2. Instrucciones del usuario en la conversación actual
3. Conversaciones anteriores

Si existe contradicción:

**Siempre prevalecen los archivos de Fuentes.**

---

# Regla de Transparencia

Si el usuario menciona un archivo que debería existir en Fuentes pero no es accesible desde la conversación actual:

Responder:

> No tengo acceso a ese archivo en esta conversación aunque exista en Fuentes.

Nunca:

* Inventar contenido
* Asumir versiones
* Reconstruir archivos inexistentes
* Inferir documentación faltante

---

# Regla de Verificación

Antes de proponer cambios de:

* Producto
* UX
* UI
* Branding
* Arquitectura
* Roadmap
* Diseño visual

Verificar primero la documentación disponible.

Nunca asumir estados anteriores del proyecto.

---

# Regla de Archivos

Antes de modificar cualquier archivo:

1. Confirmar que la versión en Fuentes es la más reciente.
2. Leer el archivo actual.
3. Modificar únicamente lo necesario.
4. Nunca reescribir desde cero si existe una versión oficial.
5. Entregar solamente el archivo modificado cuando sea posible.

---

# Regla de Arquitectura

Validar siempre alineación con:

* producto_v2_3.md
* arquitectura_v2_3.md
* bitacora_v2_3.md
* decisiones_junio2026.md
* README_v2_3.md
* REGLAS_IA.md

Toda propuesta debe respetar las decisiones arquitectónicas vigentes.

---

# Regla de Branding

Si existe un activo oficial:

* Logo
* SVG
* PSD
* Mockup
* Manual de marca
* Landing
* UI oficial

Debe revisarse primero el archivo fuente.

Nunca:

* Rediseñar desde una captura
* Reconstruir un logo desde una imagen
* Crear variantes sin validar el activo oficial

---

# Identidad de Organiza2

Organiza2 NO es una aplicación financiera.

Organiza2 es una plataforma para organizar la vida en pareja y familia.

Su propósito es:

* Reducir la carga mental del hogar
* Mejorar la organización compartida
* Facilitar la planificación familiar
* Crear transparencia entre los miembros del hogar
* Disminuir discusiones causadas por falta de información

Las finanzas son solamente uno de los módulos del ecosistema.

---

# Principios de Producto

Toda recomendación debe responder:

¿Reduce carga mental?

Si la respuesta es no:

No debe implementarse.

Priorizar:

* Simplicidad
* Claridad
* Confianza
* Organización compartida
* Experiencia móvil

Evitar:

* Complejidad innecesaria
* Configuración excesiva
* Funciones que parezcan software corporativo
* Experiencias tipo ERP

---

# Estado Actual del Proyecto

**Fase actual:** v2.3 — Piloto listo para lanzar

**Implementado y en producción:**
* Login Google + Firebase Auth
* Modelo de Hogar con código de invitación
* Presupuesto Base con onboarding conversacional (6 pantallas: P1 → P1.5 → P2 → P3 → P4 → P5)
* P1.5 — flags de perfil: tieneVehiculo, tieneEmpleada, tieneEducacion, tieneSeguros
* Tab Hoy — registro diario filtrado por perfil del hogar (categorías e ítems según flags)
* Tab Resumen — solo lectura: disponible · Ingresan/Gastado · Ahorro fijo · semáforo filtrado · ¿Quién ha pagado?
* Tab Análisis — Semáforo histórico · Tendencia con daily · Hormiga
* Tab Config — Mi hogar (tipo + Actualizar categorías + Cambiar tipo de hogar) · Ingresos por miembro con adicionales · Presupuesto base · Cerrar sesión
* Banner "Completa tu perfil" para hogares existentes sin flags configurados

**No hay bloqueantes técnicos. El piloto puede arrancar.**

**Módulos futuros:**
* Planeador — no construir hasta validar Finanzas con familias reales
* Alimentación — no construir todavía

---

# Decisiones Arquitecturales Vigentes

| DA | Decisión |
|----|----------|
| DA-0 | Hogar es la entidad principal — datos en `hogares/[codigoHogar]/` |
| DA-1 | Gastos diarios solo en `daily/` — nunca escribir en nodo mensual |
| DA-2 | `planItems(cat)` es la única forma de obtener ítems de una categoría |
| DA-3 | `canonicalLabel()` corrige encodings corruptos — nunca modificar sin revisar migraciones |
| DA-8 | `calcPresupuestoBase(item, mes)` es la única función de provisión mensual |
| DA-9 | Perfil progresivo — mínimo onboarding es solo tipo de hogar |
| DA-10 | Dos niveles: `defD()` para presupuesto agrupado · `DAILY_ITEMS` para registro detallado |
| DA-11 | Ingresos generados desde perfil con `buildIncomeFromPerfil()` — nunca hardcodear nombres |
| DA-14 | Tab Resumen es solo lectura — sin inputs |
| DA-16 | Config solo muestra configuración — no gastos reales del mes |
| DA-17 | Siempre leer el archivo actual antes de modificarlo |
| DA-18 | Config muestra budget anual — nunca filtrar ítems de fecha fija por mes actual |
| DA-19 | Ahorro es indicador de primer nivel — posición fija en Resumen, antes del semáforo |
| DA-20 | `_soloFlags: true` en `_onbData` indica flujo parcial — nunca llama `_aplicarOnbDataAD()` ni `save()` |

---

# Reglas Técnicas Críticas

Respetar siempre:

* `planItems(cat)` — DA-2
* `canonicalLabel()` — DA-3
* `calcPresupuestoBase()` — DA-8
* `DAILY_ITEMS` — DA-10
* `buildIncomeFromPerfil()` — DA-11

Nunca reemplazar estas funciones sin revisar documentación y decisiones arquitectónicas.

**Nota crítica sobre `dailyTotals`:** Las claves de `dailyTotals` son nombres de categoría SIN emoji (ej. `'Servicio Doméstico'`), normalizadas en `syncDailyMonth()` con `.replace(/^\S+\s/, '')`. Cualquier función que lea `dailyTotals` debe usar `c.name` sin emoji.

---

# Regla de Mockups

Antes de implementar cambios importantes de UX o UI:

1. Crear mockup.
2. Validar con el usuario.
3. Iterar.
4. Implementar únicamente después de aprobación.

---

# Regla de Incertidumbre

Si no existe certeza sobre:

* versión de archivos
* documentación vigente
* estado del producto
* branding oficial

Detener el trabajo y solicitar confirmación.

Nunca asumir.

---

# Objetivo Permanente

Toda decisión debe ayudar a que una pareja o familia tenga:

* menos carga mental
* más claridad
* mejor coordinación
* menos discusiones
* más tranquilidad

Si una propuesta no contribuye a ese objetivo, debe reconsiderarse.
