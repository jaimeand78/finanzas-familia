# Planeador Organiza2 v3.0 — Diseño de sesión (agosto 2026)

**Ubicación sugerida:** `docs/propuestas/planeador.md` — carpeta nueva para diseños ya mockeados y ratificados que aún no pasaron a DA formales ni a código. Sin número de versión en el nombre: si el diseño cambia, este archivo se actualiza en vez de crear una copia nueva.

**Este documento es autónomo.** No requiere pegarse dentro de otro archivo ni fragmentarse — se agrega tal cual al repo.

**Compañero de este documento:** el mockup interactivo `mockup_planeador.html` construido en la misma sesión. Este documento explica el razonamiento y la lógica; el mockup es la referencia visual y de comportamiento real — ninguno de los dos reemplaza al otro.

---

## 0. Ratificación: ruptura consciente de la Regla de Validación

La Regla de Validación (`docs/producto.md` §9) establece que Planeador y Alimentación no se construyen hasta cumplir los criterios de salida del piloto de Finanzas v2.3. A la fecha de esta sesión, **ese criterio no se ha cumplido** — ningún hogar del piloto ha tenido dos miembros simultáneamente activos.

Jaime decidió romper la regla conscientemente, como product owner, con el motivo nombrado explícitamente: presión competitiva observada (FamilyWall invirtiendo en publicidad en español dirigida al mismo mercado). Esa presión fue evaluada en la sesión y **no se consideró, por sí sola, motivo suficiente** — Organiza2 mantiene diferenciales estructurales que FamilyWall no resuelve (frecuencia latina, servicio doméstico, modelo de pareja no-Todoist), respaldados con evidencia de reseñas reales de usuarios de FamilyWall pidiendo justamente lo que este diseño ya resuelve.

La decisión de avanzar de todos modos es legítima y quedó tomada. El riesgo se nombra explícito, no se esconde: **se diseñó una especificación funcional casi completa sin que ninguna familia real haya usado un solo día el Planeador.** Esto no exime de la Regla de Mockup — antes de escribir código de producción, este diseño debe mostrarse a Anny sin el contexto acumulado de la sesión, y su reacción cruda debe pesar más que cualquier razonamiento adicional entre Jaime y Claude.

---

## 1. Modelo de datos completo

```
hogares/{codigoHogar}/
  items/
    {itemId}/
      tipo: "recordatorio" | "compromiso"
      titulo: string
      fecha: timestamp
      metaId: string | null

      gastoAsociado: { categoria: string, monto: number } | null   // solo Compromiso

      creadoPor: uid
      creadoEn: timestamp

      tomadoPor: uid | null        // reversible — "Me hago cargo"
      tomadoEn: timestamp | null

      resueltoPor: uid | null      // cierra el ciclo — "Ya está hecho"
      resueltoEn: timestamp | null

  metas/
    {metaId}/
      nombre: string
      ahorroObjetivo: number
      fechaObjetivo: string
      creadoPor: uid
      creadoEn: timestamp

      subpasos/
        {subpasoId}/
          titulo: string
          monto: number | null
          tomadoPor: uid | null
          resueltoPor: uid | null
          resueltoEn: timestamp | null
```

**Decisiones de modelo ratificadas en esta sesión:**

- Un ítem pertenece a una sola meta o a ninguna — `metaId` es singular, no arreglo. Ninguna familia real necesitó dos metas simultáneas sobre un mismo ítem; se generaliza solo si el piloto real lo pide.
- El progreso de una Meta es la suma automática de `subpaso.monto` donde `resueltoPor != null`. No existe un campo de "ahorro acumulado" editable a mano — evita que alguien tenga que actualizar un número aparte.
- El monto de cada sub-paso es libre — no se fuerza a cuadrar con `ahorroObjetivo`. Es un desglose informativo, no un presupuesto rígido.
- Los sub-pasos no están limitados a llevar gasto asociado — pueden ser recordatorios puros ("revisar fechas de vuelo").
- "Recordatorio" y "Compromiso" son los únicos dos tipos de `items/`. Meta es una entidad separada, con su propia colección — no un tercer valor de `tipo`.

---

## 2. Integración con Finanzas

**Principio:** Planeador lee de Finanzas, nunca escribe. Cero cambios al catálogo de categorías — DA-10 (regla de las tres piezas: `defD()`, `DAILY_ITEMS`, `migrateCategories()`) queda intacto.

```js
// Lee el aporte mensual ya configurado en Finanzas — no crea nada nuevo
function getAporteMensualAhorro(D, mesActual) {
  const catAhorro = D.categories.find(c => c.name === 'Ahorro');
  const item = catAhorro?.items.find(i => i.label === 'Ahorro Programado');
  return item ? calcPresupuestoBase(item, mesActual) : 0;
}

// Proyección informativa — no es un reparto financiero preciso
function proyeccionMeta(meta, aporteMensual) {
  const acumulado = sumSubpasosResueltos(meta);
  const falta = meta.ahorroObjetivo - acumulado;
  if (falta <= 0) return { completada: true };
  if (aporteMensual <= 0) return { proyeccion: null };
  const meses = Math.ceil(falta / aporteMensual);
  return { meses, texto: `Si todo el ahorro del mes fuera a esta meta: ${meses} meses` };
}
```

**Límite declarado, no resuelto:** con ≥2 metas activas compitiendo por el mismo `Ahorro Programado`, la proyección de arriba es una simplificación ("si todo fuera a esta meta"), no un reparto real entre metas. Repartir con precisión es una función que no se construye hasta que una familia real la pida — queda etiquetada como hipótesis, no como requisito de v3.0.

---

## 3. Decisiones sobre las preguntas abiertas de esta sesión

| Pregunta | Decisión | Razonamiento |
|---|---|---|
| ¿Metas en Análisis? | No. | Análisis es 100% histórico de Finanzas (Semáforo/Tendencia/Hormiga). Metas es forward-looking, ya tiene hogar en Cómo vamos → Metas. Duplicarlo repite el error ya documentado de la tabla de DA vieja en el contexto maestro. |
| ¿Notificaciones push? | No en v3.0. Badge pasivo al abrir la app (ya construido: conteo de Vencidos). | Cero infraestructura de notificaciones existe hoy — confirmado en código, sin Cloud Functions ni FCM. Requiere expandir el stack cerrado. iOS Safari PWA ya es frágil con Auth básico (Bug #45); push ahí sería más frágil todavía. Se revisita como decisión de arquitectura propia si el piloto real lo pide. |
| ¿Plan financiero según respuestas de Config? | Fuera de alcance del Planeador. | Pertenece al backlog ya existente de "Onboarding dinámico — post-piloto", dominio de Finanzas/Config. Mezclarlo aquí es scope creep. |
| Meta ↔ Presupuesto | Lectura, no escritura. Ver sección 2. | Evita categorías dinámicas — capacidad que no existe hoy — y respeta DA-10. |

---

## 4. Flujo de interfaz validado en mockup interactivo

- **Principio transversal: Hoy actúa, Cómo vamos observa** — extiende DA-14 (hoy limitada a Finanzas) a Pendientes y Metas por igual.
- **Hoy → Pendientes:** formulario de creación (Recordatorio / Compromiso — Meta ya no es una opción aquí) con el test de decisión visible en cada botón ("Se cumple, y ya" / "Queda ahí hasta que lo cierren"), más la lista accionable de Vencidos/Próximos con "Me hago cargo" / "Ya está hecho" / "deshacer".
- **Hoy → Metas:** botón "+ Nueva meta" — colapsado si ya hay metas creadas, mostrado directo como formulario si el hogar no tiene ninguna todavía (estado vacío). Cards con sub-pasos, "+ Agregar paso", ciclo completo de resolución con recálculo de progreso y "faltan $X" en vivo.
- **Cómo vamos → Pendientes / Metas:** mismo contenido exacto, sin ningún botón — solo estado ("Sin tomar", "✓ Lo tomó Anny"), con una etiqueta visible de "Solo lectura — para actuar, ir a Hoy".
- Ítems etiquetados con una meta aparecen en ambos lugares: en la lista general de Pendientes (con una etiqueta visual de a qué meta pertenecen) y dentro del detalle de esa Meta — nada se oculta.

---

## 5. Huecos reales que este documento NO resuelve — nombrados a propósito

Estos tres puntos no están completos. Etiquetarlos aquí es mejor que descubrirlos a mitad de una sesión de código:

**5.1 — Copy final de Recordatorio / Compromiso / Meta.** Durante la sesión se acordó explícitamente dejarlo pendiente (*"los mensajes... los dejamos pendientes, luego sacamos una lista de varias opciones"*) y nunca se cerró con una lista formal — solo se ajustaron algunas frases sobre la marcha (los subtítulos de test, algunos títulos de sección). Falta la ronda de opciones prometida antes de dar el copy por definitivo.

**5.2 — Reglas de seguridad de Firebase para `items/` y `metas/`.** Verificado en `firebase-rules.json`: **no existen hoy.** Ningún nodo de Planeador tiene `.read`/`.write` definidos. Hay que diseñarlas siguiendo el mismo patrón que ya usa el resto del árbol (`auth != null && miembro del hogar`), pero no se diseñaron en esta sesión — es trabajo de implementación, no de mockup.

**5.3 — El mockup es la referencia visual real, este documento no la reemplaza.** Cualquier detalle de espaciado, color exacto, o comportamiento de animación vive en `mockup_planeador.html`, no en prosa aquí. Antes de implementar, hay que volver a ese archivo, no reconstruir desde la memoria de esta conversación.

---

## 6. Antes de escribir código de producción

1. Mostrar el mockup a Anny sin el contexto acumulado de la sesión — su reacción cruda pesa más que seguir puliendo entre Jaime y Claude.
2. Cerrar 5.1 (copy) con la ronda de opciones ya prometida.
3. Diseñar 5.2 (reglas de Firebase) como su propia tarea, no de pasada.
4. Decidir si el reparto de proyección entre múltiples metas activas hace falta — hoy es hipótesis, no confirmado.
5. Agregar a `docs/arquitectura.md` la extensión de DA-14 a Pendientes/Metas como una DA nueva y numerada, no como nota suelta en un documento de sesión.
