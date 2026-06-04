# 📓 Organiza2 — Bitácora Técnica v2.3

> Historial completo de desarrollo, decisiones y aprendizajes
> Abril — Junio 2026

---

## 1. Resumen Ejecutivo

| ✅ Logros | 🔲 Pendientes (Etapa E+) |
|-----------|--------------------------|
| App PWA en producción | Onboarding 5 pantallas |
| Sincronización tiempo real multiusuario | Presupuesto Base v2 con frecuencias |
| Módulo Nómina y Empleadas | Registro diario con catálogo detallado |
| Cola offline validada (viaje Europa) | Fix iOS decimal `type="text"` |
| Análisis: Semáforo, Tendencia, Hormiga | Piloto 5-10 familias |
| Login Google + Firebase Auth (Etapa A) | Fix iOS decimal `type="text"` |
| Modelo de Hogar + código invitación (Etapa B) | Exportar PDF / Excel |
| Migración datos a hogares/ (Etapa C) | |
| Finanzas v2 arquitectura modular (Etapa D) | |
| Migración Anny1130 → hogares/SNBDPA/ ✅ | |
| Visión v2.0 definida y documentada | |
| Diseño onboarding aprobado | |
| Reglas Firebase por uid autenticado ✅ | |

---

## 2. Cronología de Desarrollo

### 📅 Fase 1-6 — v1.x (Abril — Mayo 2026)
*(ver secciones anteriores de la bitácora)*

### 📅 Fase 7 — Auditoría estratégica y redefinición v2.0 (Junio 2026)

> La app funcionaba pero había una pregunta de fondo: ¿estamos construyendo la app correcta?

**Decisión:** Organiza2 no es una app financiera. Es una plataforma de decisiones familiares. Lema redefinido: *"Organizamos tu vida en pareja."*

**Cambios de visión:**
- El Hogar pasa a ser la entidad principal (DA-0)
- Módulos redefinidos: Finanzas · Planeador · Alimentación
- Roadmap reordenado: Login → Hogar → Finanzas v2 → Piloto → Planeador → Alimentación
- Regla de validación: no construir Planeador ni Alimentación hasta validar Finanzas v2 con familias reales

**Documentos generados:** `producto_v2_2.md`, `arquitectura_v2_2.md`, `auditoria_v2.md`, `README_v2_2.md`

---

### 📅 Fase 8 — v2.1 / Etapas A-D implementadas (Junio 2026)

> **Nota de nomenclatura:** Las Etapas A-D son la nomenclatura interna de desarrollo de v2.1. Etapa E corresponde a v2.2. Las versiones describen el producto; las etapas describen el proceso de construcción.

- **Etapa A:** Login Google con Firebase Auth
- **Etapa B:** Modelo de Hogar — crear/unirse por código de invitación
- **Etapa C:** Migración de datos a `hogares/[codigoHogar]/`
- **Etapa D:** Finanzas v2 reconstruida con arquitectura modular (14 archivos JS)

**Estado:** App en producción en `organiza2.github.io/finanzas-familia`
**Hogar activo:** SNBDPA ("Hogar Ibarra") — 2 miembros (Jaime + Anny)

---

### 📅 Fase 9 — Diseño del Presupuesto Base y Onboarding (Junio 2026)

> Sesión de diseño completa antes de implementar la Etapa E. Las decisiones tomadas redefinieron la arquitectura de categorías, el onboarding y el modelo de colaboración en pareja.

**Decisiones principales:**

#### Dos niveles de detalle (DA-10)
El insight más importante de la sesión: no hay tensión entre simplicidad y análisis. Se resuelve con dos niveles:
- **Presupuesto Base:** ítems agrupados (planear)
- **Registro diario:** ítems detallados (entender)

Una mamá con poco tiempo configura 3 campos. Al final del mes puede responder *"¿en qué se fue Salud?"* con detalle real.

#### Categorías v2.0 — 10 categorías oficiales
Las categorías aumentaron de 8 a 10. Se agregaron Vestuario y Regalos y Celebraciones. La categoría Servicio Doméstico se absorbió como ítem dentro de Vivienda.

#### Catálogo de ítems del registro diario
56 ítems en 10 categorías. Decisiones específicas:
- Restaurantes → Entretenimiento (era Alimentación en v1) — es una decisión de ocio, no de mercado
- Servicios estéticos → agrupa manicure, pedicure, depilación, barbería — universal para hombres y mujeres
- Cuota crédito vehículo → Transporte (no Vivienda) — gasto reversible
- Medicina prepagada → ítem fijo mensual en Salud y Belleza
- Matrículas → frecuencia configurable (anual/semestral/mensual)

#### Onboarding — lenguaje conversacional
El primer prototipo se veía como cualquier app financiera. Rediseño completo con:
- Pantalla inicial de contexto: *"¿Cómo es su hogar?"* antes de cualquier número
- Pantalla de dolor: *"¿Cuál es su mayor reto?"* — personaliza el tono de toda la app
- Lenguaje conversacional: *"Lo que sí o sí hay que pagar"* en lugar de *"Gastos fijos"*

#### Regla sobre "Otros"
En v1, "Otros" era un campo libre. En v2:
- En registro diario: nota **obligatoria** cuando se elige "Otros"
- En Config: botón "+ Agregar ítem" que crea un ítem personalizado persistente en el hogar

#### Trabajo en equipo — modelo de colaboración
Problema identificado: si ambos miembros hacen el onboarding por separado, se necesita merge de presupuestos — demasiado complejo.

Solución simple: onboarding lo llena quien crea el hogar. El miembro 2 ve el presupuesto con banner *"¿Estás de acuerdo?"* y puede dejar un comentario por ítem. Historial, notificaciones y votación para después del piloto.

#### Ingresos dinámicos (DA-11)
Los labels de ingresos salen del perfil del hogar, no del código. Eliminado el antipatrón `label: 'Salario Jaime'` hardcodeado.

**Documentos actualizados:** `producto_v2_3.md`, `arquitectura_v2_3.md`

---

## 3. Registro de Bugs y Soluciones

*(bugs #1 al #13 — ver versión anterior de la bitácora)*

---

## 4. Decisiones Arquitecturales

*(DA-0 al DA-9 — ver arquitectura_v2_3.md)*

*(DA-10 al DA-13 son nuevas — ver arquitectura_v2_3.md)*

---

## 5. Deuda Técnica Consolidada

### 🔴 Prioridad Alta — Etapa E
- Presupuesto Base: onboarding 5 pantallas
- `defD()` v2.0 con 10 categorías oficiales
- `calcPresupuestoBase()` y actualizar `recalc()`
- `DAILY_ITEMS` catálogo para registro diario
- `buildIncomeFromPerfil()` — ingresos dinámicos
- Script `migracion-anny1130.html` — ✅ ejecutado. Datos en hogares/SNBDPA/pl/2026/. Ítems v2 se verán correctamente al implementar defD() v2.0 en Etapa E.
- Banner *"¿Estás de acuerdo?"* para miembro 2
- Nota obligatoria al elegir "Otros" en registro diario

### 🟡 Prioridad Media
- Fix iOS decimal: `type="text"` `inputmode="decimal"`
- Exportar mes a PDF
- Exportar año completo a Excel
- "+ Agregar ítem" en Config (reemplaza "Otros" fijo)
- Sugerencias contextuales DA-9

### 🟢 Prioridad Baja
- Modo oscuro
- Proyección fin de año
- Comparar mes actual vs mismo mes año anterior

---

## 6. Aprendizajes Clave

*(aprendizajes anteriores — ver versión anterior de la bitácora)*

> **El onboarding define si el usuario clasifica la app como "otra app financiera" o como "algo diferente".**
> El primer prototipo del onboarding pedía *"Ingreso del hogar"* — lenguaje de contador. Cuando la primera pantalla dice *"¿Cómo es su hogar?"*, el usuario siente que la app lo entiende antes de pedir un solo número. El lenguaje no es cosmético — es la diferenciación.

> **La tensión simplicidad vs análisis se resuelve con dos niveles, no con un término medio.**
> Intentar que el presupuesto sea simple Y detallado produce un formulario mediocre — ni suficientemente simple para una mamá con poco tiempo, ni suficientemente detallado para un papá que quiere tomar decisiones. La solución es separar los dos momentos: presupuesto agrupado al planear, ítems detallados al registrar.

> **Antes de escribir código, definir los datos.**
> La sesión de diseño del Presupuesto Base tomó varias horas pero evitará semanas de refactorización. Tener claros los 56 ítems, el mapa v1→v2, las reglas de "Otros" y el modelo de colaboración antes de escribir una línea de código es la inversión más rentable del proyecto.

---

## 7. Historial de Commits

| Hash | Fecha | Descripción |
|------|-------|-------------|
| *(ver commits anteriores)* | | |
| [confirmar hash] | Jun 2026 | feat: Etapa A — Login Google Firebase Auth ✅ |
| [confirmar hash] | Jun 2026 | feat: Etapa B — Modelo de Hogar, crear/unirse ✅ |
| [confirmar hash] | Jun 2026 | feat: Etapa C — Migración datos a hogares/ ✅ |
| [confirmar hash] | Jun 2026 | feat: Etapa D — Finanzas v2 arquitectura modular ✅ |
| [pendiente] | Jun 2026 | docs: producto v2.3, arquitectura v2.3, bitácora actualizada |

---

## 8. Roadmap

| Versión | Hitos | Estado |
|---------|-------|--------|
| v2.0 | Auditoría · Visión · Documentación | ✅ |
| v2.1 | Login + Hogar + Finanzas modular (Etapas A-D) | ✅ |
| v2.2 | Finanzas v2 · Onboarding · Presupuesto Base (Etapa E) | 🔄 Siguiente |
| v2.3 | Piloto 5-10 familias | 🔲 |
| v3.0 | Planeador MVP | 🔲 |
| v4.0 | Alimentación | 🔲 |
| v5.0 | Monetización | 🔲 |

---

*Organiza2 — Bitácora v2.3 | Junio 2026*
