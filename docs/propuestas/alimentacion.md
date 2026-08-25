# Alimentación Organiza2 v1.0 — Diseño de sesión (agosto 2026)

**Ubicación sugerida:** `docs/propuestas/alimentacion.md` — misma carpeta que `planeador.md`, para diseños ya mockeados y ratificados que aún no pasaron a DA formales ni a código.

**Este documento es autónomo.** No requiere pegarse dentro de otro archivo ni fragmentarse — se agrega tal cual al repo.

**Compañero de este documento:** el mockup interactivo `mockup_alimentacion.html` construido en la misma sesión, que incluye la comparación en vivo entre las dos ubicaciones de interfaz evaluadas (Opción A / Opción B, ver §4). Este documento explica el razonamiento; el mockup es la referencia visual y de comportamiento real.

---

## 0. Ratificación: ruptura consciente de la Regla de Validación

La Regla de Validación (`docs/producto.md` §9) establece que Planeador y Alimentación no se construyen hasta cumplir los criterios de salida del piloto de Finanzas v2.3. Ese criterio sigue sin cumplirse a la fecha de esta sesión — igual que cuando se ratificó la excepción para Planeador.

La ratificación de Planeador nombró explícitamente que **la excepción no se extendía a Alimentación**. Esta sesión revierte esa distinción: Jaime decidió, como product owner, aplicar el mismo criterio de excepción consciente a Alimentación, con motivo nombrado — no una presión competitiva nueva y distinta, sino la continuación del mismo razonamiento ya evaluado para Planeador (diferenciales estructurales de Organiza2 frente a FamilyWall y al panorama de apps de listas de mercado y planificación de menú), aplicado ahora a un segundo módulo.

El riesgo se nombra igual de explícito que en Planeador: **se diseñó una especificación funcional casi completa sin que ninguna familia real haya usado un solo día el módulo de Alimentación.** El único dato de campo real detrás de este diseño es el flujo doméstico del propio Jaime (empleada anota faltantes → él valida contra despensa → compra → registra gasto por categoría) — **confirmado en campo, pero n=1**, no validado con ninguna otra familia del piloto. Esto no exime de la Regla de Mockup: antes de escribir código de producción, este diseño debe pasar por el mismo filtro que Planeador — mostrarse a Anny sin el contexto acumulado de la sesión.

---

## 1. Lo que este módulo NO es — descartado explícitamente en esta sesión

Antes del modelo, lo que se evaluó y se dejó fuera a propósito, porque son las rutas más fáciles de retomar por error más adelante:

- **No es un planificador de menú ni un motor de recomendaciones ("qué cocinar").** Es dominio culinario, no financiero — violaría la Regla de Posicionamiento (`producto.md`: Planeador y Alimentación deben nacer atados a la lógica financiera del hogar, nunca como features genéricas).
- **No es un registro de precio por producto.** Poner precio a la papa, la carne o el detergente no tiene sentido en el flujo real del hogar — el gasto sigue siendo un total por categoría, igual que hoy.
- **No interpreta el patrón de consumo como consejo de salud o nutrición.** Muestra frecuencia ("papas fritas: 8 de las últimas 10 compras"), nunca una recomendación ("deberían comprar más fruta"). Cruzar esa línea convierte a Organiza2 en una app de nutrición, que nunca ha sido su ambición.
- **Loncheras/menús automáticos para hogares con niños en edad escolar** quedan identificados como backlog futuro, con el criterio de activación ya resuelto (mismo flag `tieneEducacion` que ya usa DA-26 para Finanzas) — pero fuera de este alcance v1.

---

## 2. Modelo de datos

```
hogares/{codigoHogar}/
  alimentacion/
    listado/
      {productoId}/
        producto: string          // nombre normalizado, minúscula, sin acentos-inconsistentes
        categoria: "Aseo y Víveres" | "Frutas y Verduras" | "Loncheras"
        comprado: boolean
        marcadoPor: uid
        marcadoEn: timestamp

    catalogoHogar/
      {productoId}: string        // productos que el hogar escribió y no estaban en el catálogo global

    historial/
      {compraId}/
        fecha: timestamp
        productos: [string]       // snapshot de lo marcado como comprado en esa compra
        categoriasTocadas: [string]
```

**Decisiones de modelo ratificadas en esta sesión:**

- El catálogo global (~140 productos, ver Anexo) vive hardcodeado en JS, igual que `DAILY_ITEMS` — se actualiza con deploy, no con escritura a Firebase. No necesita panel de administración.
- `catalogoHogar` es la única escritura dinámica de catálogo, y es por hogar — nunca se comparte entre hogares, nunca alimenta el catálogo global sin deploy explícito.
- Ningún nodo de `alimentacion/` lleva precio ni monto. El puente hacia el gasto real es por categoría, no por producto (ver §3).
- `historial/` no se descarta al cerrar cada compra — es la base del patrón de consumo (§5). Con pocas semanas de datos no hay patrón, solo ruido; se necesita volumen acumulado antes de mostrar algo confiable, igual que Hormiga necesita varios meses.
- **Colisión de vocabulario evitada a propósito:** "ítem" ya significa, en Finanzas, una línea de presupuesto dentro de una categoría (DA-10). Un producto del listado de mercado es otra cosa — se nombra "producto", nunca "ítem", en código y en documentación.

---

## 3. Integración con Finanzas

**Principio:** Alimentación genera la necesidad de un gasto, nunca el número exacto. Cero cambios al catálogo de categorías — DA-10 queda intacto, y el gasto se sigue registrando con la función ya existente, nunca una nueva.

Al cerrar una compra (marcar productos como comprados y confirmar), el sistema identifica qué categorías tuvieron al menos un producto marcado, y deja un aviso pasivo señalando cuáles — reutilizando el formulario de gasto diario que ya existe (DA-1: el gasto sigue viviendo en `daily/`, nunca en un nodo de mes), con la categoría preseleccionada. La persona escribe el único número que ya escribe hoy: el total de esa categoría.

**Límite declarado, no resuelto:** el listado y el gasto quedan desacoplados a propósito — una compra impulsiva no listada no rompe nada, porque el total sigue siendo independiente de la lista. Esto significa que el sistema nunca puede verificar que el total registrado corresponda exactamente a lo marcado en el listado — es una relación de sugerencia, no de validación.

---

## 4. Decisión de interfaz — comparación en vivo en el mockup

Se evaluaron dos ubicaciones, ambas probadas en `mockup_alimentacion.html` con un selector para alternar entre ellas:

| | Opción A — sub-tab propio | Opción B — dentro de Pendientes |
|---|---|---|
| Mecanismo | Mercado como cuarto sub-tab en Hoy y en Cómo vamos, junto a Gastos/Pendientes/Metas (los de Planeador) | Botón fijo dentro de Pendientes que abre el listado (Hoy) o el patrón (Cómo vamos) en pantalla propia, reutilizando el patrón real de `modal-overlay` |
| Apriete de la fila de sub-tabs | Sí — 4 sub-tabs en ~360px de ancho, cada uno reducido a ícono + una palabra | Ninguno — la fila se queda en 3 |
| Visibilidad | Siempre a la vista, un toque | Un toque adicional (entrar a Pendientes primero) |
| Escala a futuro | El apriete empeora con cualquier módulo nuevo que se sume a la misma fila | No empeora — cualquier módulo futuro puede sumarse como botón, sin pelear por espacio |

**Decisión: Opción B.** Motivo explícito de Jaime: *"no compite con nadie, es una feature adicional"* — prioriza no perturbar la navegación principal por encima de la visibilidad inmediata de una acción de uso semanal.

**Costo aceptado, nombrado para que no se pierda:** Mercado se usa con la misma frecuencia que Gastos (cada compra), y con esta decisión queda un paso más lejos, detrás de una tab (Pendientes) que conceptualmente pertenece a Planeador, no a Alimentación. Es un trade-off consciente de Jaime como product owner, no un defecto no visto.

**Nota de proceso:** esta comparación se construyó reactivamente durante la sesión — la primera versión del mockup ubicó Mercado en Análisis, contradiciendo sin querer la arquitectura Hoy-actúa/Cómo-vamos-observa (DA-14) que Planeador ya había fijado, y usó por error la clase CSS `.an-tab` (propia de Análisis) en vez de la genérica `.sub-tab` que Planeador ya había definido para este mecanismo cruzado entre tabs. Ambos errores se corrigieron en la misma sesión, verificando el mockup real de Planeador en lugar de trabajar desde el resumen en memoria (Corolario 1: un solo documento no es toda la búsqueda).

---

## 5. Patrón de consumo (Cómo vamos → Pendientes → "Ver patrón de mercado")

Vista de solo lectura, mismo lenguaje visual que Hormiga (barras + fracción en DM Mono): frecuencia de cada producto sobre las últimas N compras registradas en `historial/`.

**Valor confirmado por razonamiento, no por campo:** permite ver hábitos como "papas fritas apareció en 8 de las últimas 10 compras, fruta en 3 de 10" sin necesitar precio por producto — llenando un hueco que ni FamilyWall ni las apps de listas de mercado especializadas resuelven, porque todas atan ese tipo de análisis a precio por ítem. Sigue siendo **hipótesis de valor**, razonada por paralelo directo con Hormiga, pero sin ninguna familia del piloto habiéndola usado todavía.

**Posicionamiento honesto:** esto es una feature de retención, no de adquisición. Como lista de mercado pura (sin foto, sin voz, sin sincronización pulida), Organiza2 pierde frente a apps especializadas en eso único. El valor solo existe para un hogar que ya usa Organiza2 para Finanzas y prefiere no salir de la app.

---

## 6. Huecos reales que este documento NO resuelve — nombrados a propósito

**6.1 — Normalización de nombres de producto.** Un conteo de frecuencia por texto libre solo funciona si el mismo producto se escribe igual cada vez. El catálogo global + `catalogoHogar` con autocompletar reduce el problema hacia adelante (evita reescribir "quinoa" distinto la segunda vez), pero no lo elimina: la primera vez que alguien escribe algo nuevo, esa grafía queda fija para ese hogar. No hay mecanismo de fusión retroactiva si dos grafías del mismo producto ya quedaron separadas en `catalogoHogar`.

**6.2 — Foto/OCR del listado manuscrito (v1.1, fuera de este alcance).** Técnicamente posible, pero exige una API de visión externa — reconocimiento de letra manuscrita informal, no impresa, que las librerías client-side (Tesseract y similares) no resuelven bien. Es una decisión de arquitectura propia (proveedor, costo por uso, privacidad de subir la foto de un tercero — la empleada, no el usuario de la cuenta), de la misma naturaleza que la decisión ya nombrada y pospuesta sobre notificaciones push en Planeador. No se diseñó en esta sesión.

**6.3 — Catálogo global sin validar con Anny ni con el piloto.** Las ~140 entradas del Anexo se construyeron con conocimiento general de mercado colombiano y las correcciones puntuales de Jaime durante la sesión, no con una revisión sistemática de las tres categorías. Es razonable como semilla porque crece solo por uso real vía `catalogoHogar`, pero no se debe presentar como catálogo "completo" en ningún lado.

**6.4 — El mockup es la referencia visual real, este documento no la reemplaza.** Cualquier detalle de espaciado, color, o comportamiento vive en `mockup_alimentacion.html`, no en prosa aquí.

---

## 7. Antes de escribir código de producción

1. Mostrar el mockup (incluida la comparación A/B) a Anny sin el contexto acumulado de la sesión — su reacción cruda pesa más que seguir puliendo entre Jaime y Claude.
2. Confirmar que el costo aceptado en §4 (Mercado un paso más lejos que Gastos) se sostiene después de uso real, no solo en la comparación en pantalla.
3. Resolver 6.1 (normalización) al menos con una regla mínima explícita (¿minúsculas + trim? ¿algo más?) antes de que el patrón de consumo se muestre como si fuera confiable.
4. Diseñar las reglas de seguridad de Firebase para `alimentacion/` — no se diseñaron en esta sesión, mismo hueco que Planeador dejó para `items/`/`metas/`.
5. Agregar a `docs/arquitectura.md` la ubicación final (Opción B) como una DA nueva y numerada, no como nota suelta en un documento de sesión.
6. Decidir si 6.2 (foto/OCR) se retoma como v1.1 inmediato o se deja en backlog indefinido — es una decisión de arquitectura propia, no una continuación automática de v1.

---

## Anexo — Catálogo global semilla

**Aseo y Víveres**

*Personal:* jabón de cuerpo, jabón de manos, shampoo, acondicionador
*Ropa:* jabón líquido para ropa, suavizante para ropa, quitamanchas
*Hogar:* limpiador multiusos, limpiador de piso, cloro, clorogel, cera, esponja para platos, sacabrillo, fumigante antiinsectos, escoba, trapero, cepillo de baño, bolsas de basura
*Bebé y dental:* pañales, toallas húmedas, cepillo de dientes, seda dental, crema dental, enjuague bucal
*Granos y básicos:* arroz, pasta, fríjol, fríjol blanco, lentejas, garbanzos, aceite, panela, azúcar, café, pan, atún enlatado, chocolate, huevos, pollo, carne de res, carne de cerdo
*Condimentos y salsas:* sal, pimienta, cúrcuma, paprika, sazonatodo, salsa de tomate, mayonesa, salsa de soya, BBQ, pasta de tomate
*Lácteos:* leche, queso, crema de leche

**Frutas y Verduras**

*Verduras:* papa, papa criolla, plátano verde, plátano maduro, yuca, arracacha, tomate, tomate cherry, cebolla cabezona, cebolla larga, cebolla morada, zanahoria, zanahoria baby, cilantro, lechuga, habichuela, acelga, espinaca, arveja, fríjol verde, brócoli, coliflor, champiñones, pepino, pimentón, zucchini, ajo, mazorca, maíz dulce, zapallo, berenjena, apio
*Hierbas y aromáticas:* perejil, albahaca, romero, tomillo, orégano, laurel, menta, hierbabuena
*Frutas:* banano, mango, kiwi, mandarina, ciruela, granadilla, piña, papaya, uchuva, pitaya, manzana verde, manzana roja, pera, sandía, melón, lulo, tomate de árbol, fresa, uvas verdes, uvas rojas, arándanos, naranja, limón, mora, aguacate, coco

**Loncheras**

*Snacks:* papas fritas, galletas, jugo de caja, yogurt, compota, ponqué, barra de cereal, gelatina
