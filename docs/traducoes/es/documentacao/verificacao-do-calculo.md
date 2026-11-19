# Verificación del cálculo

Este documento comprueba, número por número, si la Herramienta UEQ calcula lo que el [Protocolo UEQ](../ueq-protocolo.md) indica calcular. La comprobación usa el **Estudo de exemplo** (estudio de ejemplo), que el seed crea en toda instalación local, en la cuenta de prueba y con el enlace `/r/exemplo`, y rehace cada cuenta sin usar el código de la herramienta.

**Resultado:** las 336 comparaciones numéricas coinciden con la herramienta. La mayor diferencia fue de 3,3 × 10⁻¹⁶, que es el error de redondeo del propio ordenador. La interpretación, el rango del benchmark, las escalas inconsistentes, las respuestas iguales y la marca de sospecha de cada participante también son idénticas, y las exportaciones traen los mismos números.

Después, la herramienta se comparó con la propia hoja oficial del UEQ en 11 escenarios, desde un único participante hasta 1000 participantes: los 6.543 valores coinciden, y la hoja oficial que exporta la herramienta se recalcula en Excel con los mismos resultados ([Comparación con la hoja oficial](#comparação-com-a-planilha-oficial)). La versión corta, el UEQ-S, se comparó de la misma forma con su hoja oficial, en 9 escenarios: los 8.520 valores coinciden ([UEQ-S](#ueq-s)).

Versión verificada: Herramienta UEQ del 17/11/2026, con el módulo de cálculo de [`src/ueq/`](../../src/ueq/) y los parámetros de [`data/protocolo.json`](../../data/protocolo.json) y [`data/benchmark.json`](../../data/benchmark.json).

## Cómo se hizo la verificación

1. **Los datos.** El estudio de ejemplo tiene dos versiones. "Checkout atual" (checkout actual) recibe las 20 respuestas de [`data/fixtures/basico/respostas.csv`](../../data/fixtures/basico/respostas.csv) y "Checkout em uma página" (checkout en una página) recibe las 15 de [`data/fixtures/inconsistente/respostas.csv`](../../data/fixtures/inconsistente/respostas.csv) (véase [`prisma/estudo-exemplo.ts`](../../prisma/estudo-exemplo.ts)). Cada fila tiene los 26 valores de 1 a 7 en el orden oficial.
2. **La cuenta independiente.** Cada fórmula se escribió de nuevo a partir del Protocolo UEQ (recodificación, puntuación por escala, media, desviación estándar muestral, IC95, correlación de Pearson, alfa estandarizado, rangos, benchmark, grupos y reglas de sospecha), sin reutilizar ninguna función de la herramienta. La Perspicuidad de la versión "Checkout atual" se hizo entera a mano y está paso a paso abajo; las demás escalas siguen las mismas cuentas.
3. **Lo que devuelve la herramienta.** Las mismas respuestas se pasaron a `analisarEstudo`, la función que alimenta el panel, el PDF y las exportaciones, y a las cuatro funciones de exportación de [`src/lib/exportacoes.ts`](../../src/lib/exportacoes.ts).
4. **La comparación.** Cada número de la cuenta independiente se comparó con el de la herramienta, en cuatro cortes: cada versión, la versión 2 sin las respuestas sospechosas y las dos versiones juntas.

Las secciones hasta Exportaciones comprueban que la herramienta sigue el protocolo. La [comparación con la hoja oficial](#comparação-com-a-planilha-oficial), que es el [RNF11](requisitos.md#rnf11), comprueba que el protocolo y la herramienta dan los mismos números que la propia UEQ Data Analysis Tool.

## Paso a paso: Perspicuidad del Checkout atual

La Perspicuidad tiene 4 ítems. La polaridad indica de qué lado está el término positivo: `+` a la derecha, `-` a la izquierda.

| Ítem | Término izquierdo | Término derecho | Polaridad |
|---|---|---|---|
| 2 | Incompreensível (incomprensible) | Compreensível (comprensible) | + |
| 4 | De fácil aprendizagem (fácil de aprender) | De difícil aprendizagem (difícil de aprender) | - |
| 13 | Complicado (complicado) | Fácil (fácil) | + |
| 21 | Evidente (evidente) | Confuso (confuso) | - |

### 1. Recodificación

La respuesta de 1 a 7 pasa a -3…+3: en los ítems `+`, valor - 4; en los ítems `-`, 4 - valor ([Protocolo §2](../ueq-protocolo.md#2-recodificação)). El participante 1 respondió 5, 4, 4 y 3:

| Ítem | Respuesta | Cuenta | Recodificado |
|---|---|---|---|
| 2 (+) | 5 | 5 - 4 | +1 |
| 4 (-) | 4 | 4 - 4 | 0 |
| 13 (+) | 4 | 4 - 4 | 0 |
| 21 (-) | 3 | 4 - 3 | +1 |

### 2. Puntuación del participante en la escala

Es la media de los ítems recodificados de la escala ([Protocolo §3](../ueq-protocolo.md#3-escore-por-participante-e-escala)): (1 + 0 + 0 + 1) / 4 = **0,50**.

Los 20 participantes, en el orden del archivo:

| 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|
| 0,50 | 1,50 | 0,25 | 0,50 | 0,25 | 1,25 | 2,00 | 1,00 | 2,00 | 0,50 |

| 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 |
|---|---|---|---|---|---|---|---|---|---|
| 0,75 | 0,00 | -0,25 | 0,25 | 2,25 | 1,00 | 1,00 | -0,75 | 0,50 | 2,50 |

### 3. Media y desviación estándar

- **Media:** la suma de las 20 puntuaciones es 17,00, y 17,00 / 20 = **0,8500**.
- **Desviación estándar muestral** (divisor n - 1, como el `STDEV` de la hoja): la suma de los cuadrados de las desviaciones respecto de la media es 14,05. Entonces 14,05 / 19 = 0,7395 y √0,7395 = **0,8599**.

### 4. Intervalo de confianza del 95 %

Margen = z × de / √n, con z = 1,959964 ([Protocolo §4](../ueq-protocolo.md#4-estatísticas-por-escala-entre-participantes-incluídos-na-análise)): 1,959964 × 0,8599 / √20 = 1,6854 / 4,4721 = 0,3769.

IC95 = 0,8500 ± 0,3769 = **[0,4731; 1,2269]**.

### 5. Alfa de Cronbach

El alfa estandarizado usa la media de las correlaciones entre los ítems recodificados de la escala ([Protocolo §6](../ueq-protocolo.md#6-alfa-de-cronbach-por-escala)). Con 4 ítems, son 6 pares:

| Par | 2 y 4 | 2 y 13 | 2 y 21 | 4 y 13 | 4 y 21 | 13 y 21 |
|---|---|---|---|---|---|---|
| r de Pearson | 0,6473 | 0,5326 | 0,3361 | 0,5261 | 0,6668 | 0,4304 |

- r̄ = (0,6473 + 0,5326 + 0,3361 + 0,5261 + 0,6668 + 0,4304) / 6 = 3,1393 / 6 = 0,5232.
- α = k × r̄ / (1 + (k - 1) × r̄) = 4 × 0,5232 / (1 + 3 × 0,5232) = 2,0929 / 2,5697 = **0,8144**.

Como 0,8144 es mayor que 0,7, el panel no muestra aviso de consistencia para esta escala.

### 6. Interpretación y benchmark

- **Interpretación:** 0,85 es mayor que 0,8, así que la media es **positiva** ([Protocolo §5](../ueq-protocolo.md#5-faixas-de-interpretação)).
- **Benchmark:** los límites de la Perspicuidad son 2,00 (excelente), 1,73 (bueno), 1,20 (por encima de la media) y 0,72 (por debajo de la media). Como 0,72 < 0,85 ≤ 1,20, el rango es **por debajo de la media** ([Protocolo §8](../ueq-protocolo.md#8-benchmark)).

### 7. Calidad pragmática y hedónica

Son medias simples de las medias de las escalas ([RF39](requisitos.md#rf39)):

- **Pragmática** = (Perspicuidad + Eficiencia + Confiabilidad) / 3 = (0,8500 + 1,0250 + 0,9125) / 3 = **0,9292**.
- **Hedónica** = (Estimulación + Novedad) / 2 = (0,6375 + 1,0125) / 2 = **0,8250**.

La herramienta devuelve los mismos siete números: 0,50 para el participante 1, media 0,8500, de 0,8599, IC95 de 0,4731 a 1,2269, alfa 0,8144, positiva, por debajo de la media, y pragmática y hedónica de 0,9292 y 0,8250.

## Resultados comprobados

Los números tienen 4 decimales, como en la exportación de resultados por escala. El panel muestra 2.

### Checkout atual

20 participantes, ninguno sospechoso. Pragmática 0,9292; hedónica 0,8250.

| Escala | Media | DE | IC95 | Alfa | Interpretación | Benchmark |
|---|---|---|---|---|---|---|
| Atractivo | 0,7333 | 0,9167 | 0,3316 a 1,1351 | 0,9173 | neutro | por debajo de la media |
| Perspicuidad | 0,8500 | 0,8599 | 0,4731 a 1,2269 | 0,8144 | positivo | por debajo de la media |
| Eficiencia | 1,0250 | 0,7818 | 0,6824 a 1,3676 | 0,7452 | positivo | por debajo de la media |
| Confiabilidad | 0,9125 | 0,9572 | 0,4930 a 1,3320 | 0,8188 | positivo | por debajo de la media |
| Estimulación | 0,6375 | 0,7321 | 0,3166 a 0,9584 | 0,7401 | neutro | por debajo de la media |
| Novedad | 1,0125 | 0,7139 | 0,6996 a 1,3254 | 0,7494 | positivo | por encima de la media |

### Checkout em uma página

15 participantes, 4 de ellos sospechosos y todavía en el análisis, como los graba el seed. Pragmática 0,7944; hedónica 0,8500.

| Escala | Media | DE | IC95 | Alfa | Interpretación | Benchmark |
|---|---|---|---|---|---|---|
| Atractivo | 0,6000 | 0,9916 | 0,0982 a 1,1018 | 0,7366 | neutro | malo |
| Perspicuidad | 0,8167 | 0,8263 | 0,3985 a 1,2348 | 0,5943 | positivo | por debajo de la media |
| Eficiencia | 0,8000 | 0,7270 | 0,4321 a 1,1679 | 0,3343 | neutro | por debajo de la media |
| Confiabilidad | 0,7667 | 0,9135 | 0,3044 a 1,2290 | 0,5095 | neutro | malo |
| Estimulación | 0,8667 | 0,6605 | 0,5324 a 1,2009 | 0,0932 | positivo | por debajo de la media |
| Novedad | 0,8333 | 0,7657 | 0,4458 a 1,2208 | 0,4067 | positivo | por encima de la media |

Eficiencia tiene una media de exactamente 0,8000 y queda **neutra**: el límite del rango neutro le pertenece (de -0,8 a +0,8). Cinco escalas tienen el alfa por debajo de 0,7, y el panel avisa en cada una ([RF45](requisitos.md#rf45)). Es el efecto de las respuestas sospechosas, como muestra la tabla siguiente.

### Checkout em uma página, sin las sospechosas

Después de "Quitar sospechosas del análisis" en la pestaña Respuestas, quedan 11 participantes. Pragmática 0,8636; hedónica 0,9545.

| Escala | Media | DE | IC95 | Alfa | Interpretación | Benchmark |
|---|---|---|---|---|---|---|
| Atractivo | 0,6364 | 1,1348 | -0,0343 a 1,3070 | 0,9265 | neutro | malo |
| Perspicuidad | 0,7500 | 0,9354 | 0,1972 a 1,3028 | 0,8775 | neutro | por debajo de la media |
| Eficiencia | 0,8636 | 0,5519 | 0,5375 a 1,1898 | 0,2564 | positivo | por debajo de la media |
| Confiabilidad | 0,9773 | 0,9517 | 0,4149 a 1,5397 | 0,8541 | positivo | por debajo de la media |
| Estimulación | 0,9545 | 0,6876 | 0,5482 a 1,3609 | 0,7060 | positivo | por debajo de la media |
| Novedad | 0,9545 | 0,8353 | 0,4609 a 1,4482 | 0,7011 | positivo | por encima de la media |

El alfa sube por encima de 0,7 en cuatro de las cinco escalas que estaban bajas. La Eficiencia sigue con el alfa bajo: su problema no viene de las sospechosas.

### Las dos versiones juntas

35 participantes. Pragmática 0,8714; hedónica 0,8357.

| Escala | Media | DE | IC95 | Alfa | Interpretación | Benchmark |
|---|---|---|---|---|---|---|
| Atractivo | 0,6762 | 0,9375 | 0,3656 a 0,9868 | 0,8331 | neutro | malo |
| Perspicuidad | 0,8357 | 0,8335 | 0,5596 a 1,1118 | 0,7230 | positivo | por debajo de la media |
| Eficiencia | 0,9286 | 0,7563 | 0,6780 a 1,1791 | 0,5698 | positivo | por debajo de la media |
| Confiabilidad | 0,8500 | 0,9279 | 0,5426 a 1,1574 | 0,6880 | positivo | por debajo de la media |
| Estimulación | 0,7357 | 0,7017 | 0,5032 a 0,9682 | 0,4962 | neutro | por debajo de la media |
| Novedad | 0,9357 | 0,7310 | 0,6935 a 1,1779 | 0,5705 | positivo | por encima de la media |

### Medias por ítem

Las 26 medias y las 26 desviaciones estándar de cada ítem, en los cuatro cortes, también se comprobaron: 208 números, todos iguales a los de la herramienta.

## Respuestas sospechosas

Una participación es sospechosa cuando tiene 3 o más escalas con una amplitud mayor que 3, o más de 15 respuestas iguales ([Protocolo §7](../ueq-protocolo.md#7-respostas-inconsistentes)). La amplitud es la diferencia entre el mayor y el menor valor recodificado de los ítems de la escala.

En el Checkout atual, ningún participante supera el límite en ninguna regla: la mayor cantidad de respuestas iguales es 14. En el Checkout em uma página:

| Fila | Atractivo | Perspicuidad | Eficiencia | Confiabilidad | Estimulación | Novedad | Escalas por encima de 3 | Respuestas iguales | Sospechosa |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 6 | 4 | 4 | 6 | 4 | 5 | 6 | 5 | sí |
| 2 | 1 | 1 | 1 | 2 | 2 | 5 | 1 | 8 | no |
| 3 | 1 | 1 | 2 | 2 | 1 | 1 | 0 | 7 | no |
| 4 | 2 | 0 | 3 | 1 | 2 | 2 | 0 | 7 | no |
| 5 | 4 | 0 | 6 | 2 | 0 | 2 | 2 | 8 | no |
| 6 | 4 | 4 | 6 | 5 | 6 | 6 | 6 | 7 | sí |
| 7 | 2 | 2 | 2 | 0 | 2 | 2 | 0 | 12 | no |
| 8 | 1 | 0 | 1 | 1 | 2 | 0 | 0 | 9 | no |
| 9 | 4 | 4 | 1 | 6 | 4 | 0 | 4 | 7 | sí |
| 10 | 2 | 1 | 2 | 1 | 1 | 2 | 0 | 12 | no |
| 11 | 3 | 2 | 2 | 2 | 1 | 2 | 0 | 11 | no |
| 12 | 1 | 2 | 2 | 1 | 1 | 2 | 0 | 7 | no |
| 13 | 4 | 1 | 1 | 2 | 6 | 4 | 3 | 6 | sí |
| 14 | 1 | 2 | 1 | 3 | 2 | 1 | 0 | 11 | no |
| 15 | 2 | 1 | 1 | 1 | 1 | 1 | 0 | 8 | no |

- Las filas 1, 6, 9 y 13 son sospechosas, las mismas que marca la pestaña Respuestas y que prevé el [LEIA-ME de la fixture](../../data/fixtures/inconsistente/LEIA-ME.md).
- Las filas 2 y 5 quedan por debajo del límite: una y dos escalas inconsistentes.
- La amplitud exactamente 3 no cuenta (filas 4, 11 y 14): la regla es mayor que 3.

## Exportaciones

Las exportaciones las generó la herramienta con las 35 participaciones y se comprobaron contra la cuenta independiente:

| Exportación | Qué se comprobó | Resultado |
|---|---|---|
| Respuestas brutas | BOM, 39 columnas (13 de datos de la participación y 26 ítems) y los valores de 1 a 7 de cada participante | Iguales a las 35 filas de las fixtures |
| Respuestas recodificadas | Los 26 valores de -3 a +3 de cada participante | Iguales a la recodificación hecha a mano |
| Resultados por escala | 18 filas (6 escalas × las dos versiones y el estudio entero), con n, media, de, IC95, alfa e interpretación con 4 decimales y coma decimal | Iguales a las tablas de arriba |
| Hoja oficial del UEQ (XLSX) | Las 35 filas de 26 valores en Data!A4 de la UEQ Data Analysis Tool V15, sin los datos de ejemplo, y el resto del archivo igual al oficial | Iguales a las fixtures, en orden; recalculada en Excel, véase la sección siguiente |

## Comparación con la hoja oficial

Hecha el 17/11/2026 con la *UEQ Data Analysis Tool V15* de `Data_Analysis_Tools.zip` (ueq-online.org), en Microsoft Excel 16. Para cada escenario de [data/fixtures/](../../data/fixtures/LEIA-ME.md), el script `scripts/planilha-oficial.ps1` pegó el `respostas.csv` en `Data!A4` de una copia de la hoja, mandó recalcular y leyó las celdas de resultado con todos los decimales. Antes, el mismo script se ejecutó con los datos de ejemplo que trae la hoja y reprodujo exactamente los resultados grabados en el archivo oficial.

Se compararon media, de, n e IC95 de las 6 escalas y de los 26 ítems, alfa de Cronbach, rango del benchmark, calidad pragmática y hedónica, la distribución de las respuestas de cada ítem y, para cada participante, cuántas escalas son inconsistentes y cuántas respuestas iguales dio.

| Escenario | Participantes | Sospechosas | Valores comparados | Errores de la hoja (null en la herramienta) | Mayor diferencia |
|---|---|---|---|---|---|
| basico | 20 | 0 | 391 | 0 | 3,3 × 10⁻¹⁶ |
| inconsistente | 15 | 4 | 381 | 0 | 4,4 × 10⁻¹⁶ |
| extremos/n1 | 1 | 0 | 353 | 102 | 0 |
| extremos/n2 | 2 | 0 | 355 | 0 | 8,9 × 10⁻¹⁶ |
| extremos/todos-1 | 3 | 3 | 357 | 70 | 0 |
| extremos/todos-7 | 3 | 3 | 357 | 70 | 0 |
| oficial-exemplo | 255 | 18 | 861 | 0 | 2,9 × 10⁻¹⁵ |
| grande | 1000 | 63 | 2.351 | 0 | 9,3 × 10⁻¹⁵ |
| bordas | 12 | 3 | 375 | 0 | 5,6 × 10⁻¹⁶ |
| variancia-zero | 12 | 0 | 375 | 3 | 4,4 × 10⁻¹⁶ |
| negativo | 18 | 1 | 387 | 0 | 2,2 × 10⁻¹⁶ |
| **Total** | | | **6.543** | **245** | **9,3 × 10⁻¹⁵** |

Los textos (rango del benchmark) y los conteos (n, distribución, escalas inconsistentes, respuestas iguales) son idénticos. Los números decimales difieren como máximo en el 15.º decimal, por el orden de las sumas en coma flotante; la prueba acepta hasta 1e-6. Los casos que requieren atención también coinciden:

- **Una sola persona o todas iguales.** La hoja da `#DIV/0!` en la desviación estándar, en el IC y en el alfa; la herramienta devuelve `null` y el panel muestra "—".
- **Un ítem sin variación** (`variancia-zero`). La hoja no calcula la correlación de ese ítem, y el alfa de Perspicuidad y el IC del ítem pasan a ser error. La herramienta hace lo mismo y calcula el alfa de las otras cinco escalas normalmente.
- **Ítems que se contradicen** (`negativo`). La correlación media de la Novedad queda cerca de -1/3, y la fórmula del alfa estandarizado, k × r̄ / (1 + (k - 1) × r̄), da -42,78 en las dos.
- **Los límites de las reglas de sospecha** (`bordas`). La amplitud exactamente 3 no cuenta y 4 sí; 15 respuestas iguales no marcan y 16 sí. La herramienta y la hoja dan lo mismo para cada participante.

### La hoja que exporta la herramienta

La exportación "Hoja oficial del UEQ (XLSX)" se comprobó de tres formas:

1. **Archivo por archivo.** Una prueba unitaria abre el `.xlsx` generado y comprueba que la pestaña Data tiene las respuestas a partir de la fila 4, que salieron los 255 participantes de ejemplo, que el idioma está en `Read_First!B5` y que los gráficos, estilos, imágenes y las demás partes del archivo son byte a byte iguales a los del archivo oficial.
2. **En Excel.** La hoja de los 11 escenarios, generada por la herramienta, se abrió en Excel sin pegar nada y sin mandar recalcular. Excel recalculó solo al abrir, y los 6.543 valores quedaron idénticos a los del pegado a mano, con las etiquetas en portugués ("Atractividade", "Desagradável").
3. **Por la pantalla.** Una prueba de extremo a extremo importa 7 escenarios (`oficial-exemplo`, `grande`, `inconsistente`, `bordas`, `variancia-zero`, `negativo` y `extremos/n2`) por la pantalla Importar respuestas, comprueba n, media, DE, IC95, alfa y benchmark de cada escala en la tabla del panel con los números de la hoja oficial y descarga la hoja de la versión. Cinco de esos archivos, descargados de la herramienta en funcionamiento, se abrieron en Excel: cero diferencias.

### UEQ-S

La versión corta se comparó de la misma forma con la *UEQ-S Data Analysis Tool V15* (`Short_UEQ_Data_Analysis_Tool_V15.xlsx`, del mismo `Data_Analysis_Tools.zip`), con el script `scripts/planilha-oficial-ueq-s.ps1`, en 9 escenarios de [data/fixtures-ueq-s/](../../data/fixtures-ueq-s/LEIA-ME.md). Antes, el script se ejecutó con los 13 participantes de ejemplo de la hoja y reprodujo los resultados grabados en el archivo oficial.

Se compararon media, de, n e IC95 de la calidad pragmática, la hedónica y la general y de los 8 ítems, el alfa de las dos escalas, el rango del benchmark y, para cada participante, las tres puntuaciones (pestaña DT), cuántas escalas son inconsistentes, cuántas respuestas iguales dio y si marcó el centro en los 8 ítems.

| Escenario | Participantes | Sospechosas | Valores comparados | Errores de la hoja (null en la herramienta) | Mayor diferencia |
|---|---|---|---|---|---|
| oficial-exemplo | 13 | 2 | 136 | 0 | 4,4 × 10⁻¹⁶ |
| do-ueq-basico | 20 | 0 | 178 | 0 | 2,2 × 10⁻¹⁶ |
| do-ueq-oficial-exemplo | 255 | 5 | 1.588 | 0 | 8,9 × 10⁻¹⁶ |
| grande | 1000 | 30 | 6.058 | 0 | 6,0 × 10⁻¹⁵ |
| bordas | 12 | 3 | 130 | 0 | 4,4 × 10⁻¹⁶ |
| variancia-zero | 12 | 0 | 130 | 3 | 2,2 × 10⁻¹⁶ |
| negativo | 18 | 0 | 166 | 0 | 4,4 × 10⁻¹⁶ |
| n1 | 1 | 0 | 64 | 35 | 0 |
| n2 | 2 | 0 | 70 | 0 | 4,4 × 10⁻¹⁶ |
| **Total** | | | **8.520** | **38** | **6,0 × 10⁻¹⁵** |

Los escenarios `do-ueq-basico` y `do-ueq-oficial-exemplo` salen de escenarios del UEQ completo: los 8 pares del UEQ-S de cada participante, con los lados de los ítems 4 y 7 intercambiados. Prueban la pestaña UEQ-S de un estudio del UEQ completo, que hace la misma conversión. Los casos límite también coinciden:

- **Las reglas de sospecha del UEQ-S** (`bordas`). Una amplitud de 4 en una sola escala no marca; en las dos, marca. Ocho veces el 4 marca ("Remove" en la hoja); ocho veces el 7 no, porque la hoja solo recomienda quitar a quien marcó el centro.
- **Ítems que se contradicen** (`negativo`). El alfa de la calidad hedónica da -1,40 en las dos.
- **Un ítem sin variación** (`variancia-zero`). Sin IC del ítem y sin alfa de la pragmática, en las dos.

La "Hoja oficial del UEQ-S (XLSX)" que exporta la herramienta se comprobó como la del UEQ completo: una prueba unitaria abre el archivo y comprueba la pestaña Data y el idioma en `Read_First!B4`; los 9 archivos generados por la herramienta se abrieron en Excel sin pegar nada ni mandar recalcular, y los valores quedaron idénticos a los de `esperado.json`, con las etiquetas en portugués ("Qualidade Pragmática", "Obstrutivo"); y una prueba de extremo a extremo importa 5 escenarios en un estudio del UEQ-S, comprueba la tabla de la pestaña UEQ-S y descarga la hoja.

## Cómo rehacerla

Cualquier persona puede rehacer esta comprobación sin programar:

1. En una instalación local, ejecute `pnpm db:seed` e inicie sesión con la cuenta de prueba (`pesquisador@exemplo.com`, contraseña `senha-de-teste`): el estudio de ejemplo ya está en la lista.
2. En Resultados › Exportar, descargue las respuestas recodificadas y los resultados por escala.
3. En una hoja de cálculo, calcule la media de los ítems de cada escala por participante, y después la media, la `DESVPAD` y el margen `1,959964 × DESVPAD / RAIZ(n)` de cada escala. Para el alfa, calcule `CORREL` de cada par de ítems de la escala, saque la media y aplique k × r̄ / (1 + (k - 1) × r̄). En Excel en español, las funciones son `DESVEST` y `RAIZ`.
4. Compare con el archivo de resultados por escala y con el panel.
5. Para comparar con la hoja oficial, descargue "Hoja oficial del UEQ (XLSX)", ábrala en Excel y haga clic en Habilitar edición. Las pestañas Results, Confidence_Intervals, Scale_Consistency, Benchmark e Inconsistencies muestran los números de la propia hoja, calculados con las respuestas del estudio.
