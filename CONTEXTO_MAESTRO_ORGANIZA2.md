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

Situación actual:

* Finanzas es el único módulo activo.
* Planeador no se construye todavía.
* Alimentación no se construye todavía.
* Primero se valida Finanzas con usuarios reales.

---

# Reglas Técnicas Críticas

Respetar siempre:

* planItems(cat)
* canonicalLabel()
* calcPresupuestoBase()
* DAILY_ITEMS
* buildIncomeFromPerfil()

Nunca reemplazar estas funciones sin revisar documentación y decisiones arquitectónicas.

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
