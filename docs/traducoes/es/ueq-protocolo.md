# Protocolo UEQ · especificación del cálculo

Fuente: Schrepp, M. *User Experience Questionnaire Handbook* y la hoja oficial *UEQ Data Analysis Tool* (ueq-online.org). Versiones revisadas el 23/10/2026: Handbook versión 11 (12/09/2023) y `UEQ_Data_Analysis_Tool_V15.xlsx` (22/10/2026). Cuando el handbook y la hoja difieren, prevalece la hoja, porque es con ella con la que se comparan las pruebas. Cada regla indica entre paréntesis la fuente con la que se verificó: la página del handbook o la pestaña de la hoja.

## 1. Ítems, escalas y polaridad

26 ítems de diferencial semántico, 7 posiciones, registradas de 1 (polo izquierdo) a 7 (polo derecho). El participante nunca ve números.

Polaridad:
- `+` = término positivo a la **derecha** → `x' = x - 4`
- `-` = término positivo a la **izquierda** → `x' = 4 - x`

| N.º | Polo izquierdo (EN) | Polo derecho (EN) | Escala | Polaridad |
|---|---|---|---|---|
| 1 | annoying | enjoyable | Atractivo | + |
| 2 | not understandable | understandable | Perspicuidad | + |
| 3 | creative | dull | Novedad | - |
| 4 | easy to learn | difficult to learn | Perspicuidad | - |
| 5 | valuable | inferior | Estimulación | - |
| 6 | boring | exciting | Estimulación | + |
| 7 | not interesting | interesting | Estimulación | + |
| 8 | unpredictable | predictable | Confiabilidad | + |
| 9 | fast | slow | Eficiencia | - |
| 10 | inventive | conventional | Novedad | - |
| 11 | obstructive | supportive | Confiabilidad | + |
| 12 | good | bad | Atractivo | - |
| 13 | complicated | easy | Perspicuidad | + |
| 14 | unlikable | pleasing | Atractivo | + |
| 15 | usual | leading edge | Novedad | + |
| 16 | unpleasant | pleasant | Atractivo | + |
| 17 | secure | not secure | Confiabilidad | - |
| 18 | motivating | demotivating | Estimulación | - |
| 19 | meets expectations | does not meet expectations | Confiabilidad | - |
| 20 | inefficient | efficient | Eficiencia | + |
| 21 | clear | confusing | Perspicuidad | - |
| 22 | impractical | practical | Eficiencia | + |
| 23 | organized | cluttered | Eficiencia | - |
| 24 | attractive | unattractive | Atractivo | - |
| 25 | friendly | unfriendly | Atractivo | - |
| 26 | conservative | innovative | Novedad | + |

Comprobación rápida: Atractivo 1, 12, 14, 16, 24, 25 · Perspicuidad 2, 4, 13, 21 · Eficiencia 9, 20, 22, 23 · Confiabilidad 8, 11, 17, 19 · Estimulación 5, 6, 7, 18 · Novedad 3, 10, 15, 26. Son 13 ítems con polaridad `-`.

Los términos en portugués **no** están aquí a propósito. Provienen del paquete oficial de idiomas y se encuentran en `data/ueq-itens-ptbr.json` (véase `data/LEIA-ME.md`). (Fuente: hoja, pestaña DT.) Las fórmulas de recodificación de la fila 4 y las medias por escala (columnas AC a AH) coinciden con la tabla anterior.

Agrupación:
- Calidad pragmática = media de Perspicuidad, Eficiencia, Confiabilidad
- Calidad hedónica = media de Estimulación, Novedad
- Atractivo queda aparte (impresión general)

## 2. Recodificación

`recodificar(valor: 1..7, polaridade: '+' | '-'): -3..3`. Un valor fuera de 1..7 lanza un error.

## 3. Puntuación por participante y escala

Media de los valores recodificados de los ítems de esa escala, para ese participante.

(Fuente: hoja, pestaña DT.) Una celda vacía se ignora. La puntuación de la escala es la media solo de los ítems respondidos (`AVERAGE`) y queda vacía si no se respondió ningún ítem de la escala. Nuestra herramienta exige los 26 ítems (validación en el formulario), por lo que no existen valores ausentes procedentes de la recogida. La importación por CSV sigue la misma regla: cada fila necesita los 26 valores de 1 a 7, y un archivo con cualquier fila no válida se rechaza por completo (`src/lib/importacao.ts`).

## 4. Estadísticas por escala (entre los participantes incluidos en el análisis)

- `n` = participantes incluidos
- `media` = media de las puntuaciones por participante
- `dp` = desviación estándar muestral (divisor `n - 1`) (fuente: hoja, pestaña Confidence_Intervals: STDEV)
- `ic95` = `media ± z · dp / √n`, con `z = 1,959963984540054`, el cuantil 0,975 exacto de la normal. La hoja usa `CONFIDENCE(0.05; dp; n)`, que no redondea a 1,96, y con 1,96 las pruebas fallan ya en el sexto decimal. (fuente: hoja, pestaña Confidence_Intervals)
- también por ítem: media, dp, n y distribución de las respuestas 1 a 7 (para el gráfico por ítem)

Con `n < 2` no existe dp ni IC. Con `dp = 0` (todos obtuvieron la misma puntuación) la hoja tampoco calcula el IC, porque `CONFIDENCE` exige un dp mayor que cero (`#NUM!`), y seguimos la hoja. La función devuelve `null` en esos campos y la interfaz muestra "muestra insuficiente".

## 5. Franjas de interpretación

| Media de la escala | Lectura |
|---|---|
| > +0,8 | positivo |
| entre -0,8 y +0,8 | neutro |
| < -0,8 | negativo |

(Fuente: handbook p. 5.) "values between -0.8 and 0.8 represent a neutral evaluation, values > 0,8 positive, values < -0,8 negative". Por lo tanto, -0,8 y 0,8 quedan en la franja neutra. La hoja solo repite ese texto en la pestaña Results y no calcula la franja.

## 6. Alfa de Cronbach por escala

La hoja no usa la fórmula de varianzas, sino el alfa estandarizado, calculado a partir de la media de las correlaciones entre los ítems:

```
r̄    = média das correlações de Pearson entre todos os pares de itens da escala
alfa = k · r̄ / (1 + (k - 1) · r̄)
```
`k` = número de ítems de la escala (6 en Atractivo, 4 en las demás), lo que da 15 pares en Atractivo y 6 en las demás. El cálculo usa los valores recodificados. (fuente: handbook p. 10 y hoja, pestaña Scale_Consistency: CORREL y (4*r̄)/(1+(3*r̄)))

Si algún ítem de la escala no varía entre los participantes, la correlación no existe (la hoja muestra `#DIV/0!`), y con `n < 2` tampoco. En esos casos el alfa es `null`. Un valor inferior a **0,7** se señala en el panel con un texto que explica que la escala puede estar siendo mal interpretada por ese grupo. El handbook trata 0,6 o 0,7 como regla práctica y pide cautela con muestras pequeñas (menos de 50).

La hoja también muestra el intervalo de confianza del alfa (Bonett, 2002) y el Lambda2 de Guttman. Ambos quedan fuera del alcance.

## 7. Respuestas inconsistentes

Para cada participante y cada escala: `amplitude = max(itens recodificados) - min(itens recodificados)`.
- `amplitude > 3` → escala inconsistente para ese participante (fuente: handbook p. 7-8 y hoja, pestaña Inconsistencies)
- participante con inconsistencia en **3 o más escalas** → marcado como sospechoso. El handbook deja al investigador la elección entre 2 y 3 escalas. La hoja sugiere eliminar a quien tiene 3 o más en la columna "Critical?", y seguimos la hoja. (fuente: handbook p. 8 y hoja, pestaña Inconsistencies)

Segunda regla, del handbook y de la hoja: el participante con **más de 15 respuestas iguales** en los 26 ítems (contadas en la escala original de 1 a 7, por ejemplo todo en el 4) también se marca como sospechoso. (fuente: handbook p. 8 (Schrepp, 2023) y hoja, pestaña Inconsistencies, columna "Critical length")

El participante es sospechoso si cae en cualquiera de las dos reglas, y la interfaz muestra cuál fue. Los tres umbrales (`amplitudeMaxima`, `escalasParaSuspeita`, `respostasIguaisMaximas`) están en `data/protocolo.json`, no en el código.

El investigador ve la lista de sospechosos y decide quién sale del análisis. Excluir no borra la respuesta: solo cambia `incluidaNaAnalise = false`. Todos los números del panel y de la exportación de resultados consideran únicamente las participaciones incluidas. La exportación de respuestas en bruto incluye todas, con una columna que indica la inclusión.

## 8. Benchmark

Cada media de escala se clasifica en una de cinco franjas: Excelente, Bueno, Por encima de la media, Por debajo de la media, Malo. Los límites por escala están en `data/benchmark.json` con el campo `fonte` completado (versión del benchmark, año, página o pestaña). (Fuente: hoja V15, pestaña Benchmark, tabla "Benchmark borders".) Los límites son los cuantiles 0,25 (`abaixoDaMedia`), 0,5 (`acimaDaMedia`), 0,75 (`bom`) y 0,9 (`excelente`), a partir de 21175 personas de 468 estudios. El benchmark se actualiza una vez al año (handbook p. 5), así que revise la versión de la hoja antes de la presentación. No usar valores sacados de blogs, artículos de terceros o de la memoria de un modelo.

Formato esperado:
```json
{
  "fonte": "UEQ Data Analysis Tool vX, aba Benchmark, acessado em DD/MM/2026",
  "escalas": {
    "atratividade": { "excelente": 0, "bom": 0, "acimaDaMedia": 0, "abaixoDaMedia": 0 }
  }
}
```
Lectura, con mayor estricto como en la fórmula de la hoja: `media > excelente` → Excelente, `> bom` → Bueno, `> acimaDaMedia` → Por encima de la media, `> abaixoDaMedia` → Por debajo de la media, si no, Malo. Una media exactamente igual al límite queda en la franja inferior.

## 9. Exportaciones

1. **Respuestas en bruto** (CSV): una fila por participación. Columnas: id de la participación, versión, fecha, incluida (sí/no), sospechosa (sí/no), origen, idioma, traducción aprobada, menor de edad (declaró tener menos de 18 años con la autorización del responsable), datos demográficos, `item01` a `item26` con valores de 1 a 7.
2. **Respuestas recodificadas** (CSV): mismo formato, valores de -3 a 3.
3. **Resultados por escala** (CSV): versión, escala, n, media, dp, ic95 inferior, ic95 superior, alfa, franja de interpretación, franja del benchmark.
4. **Hoja oficial completada** (XLSX): la propia *UEQ Data Analysis Tool V15* (`data/planilha-oficial/UEQ_Data_Analysis_Tool_V15.xlsx`, copiada sin cambios de `Data_Analysis_Tools.zip`), con los 26 valores de 1 a 7 de cada participación incluida en el análisis a partir de `Data!A4`, una columna por ítem de la A a la Z, en el orden en que se completaron las participaciones. (Fuente: hoja V15, pestaña Data.) La exportación solo escribe la entrada, como quien pega las respuestas a mano:
   - borra los 255 participantes de ejemplo que vienen en la pestaña Data y escribe las respuestas en su lugar;
   - pone en `Read_First!B5` el idioma de la interfaz, entre los 37 que la hoja traduce, para que las etiquetas y los ítems salgan en ese idioma;
   - quita de las demás pestañas los resultados guardados de los datos de ejemplo y marca el archivo para recalcular al abrirlo (`fullCalcOnLoad`). En Excel, la hoja se recalcula al hacer clic en **Habilitar edición**.

   Las fórmulas, los gráficos, los estilos y las demás pestañas quedan idénticos a los del archivo oficial, y una prueba lo verifica byte a byte. En la pantalla de una versión sale solo esa versión; en "Todas las versiones" sale el estudio entero. La hoja calcula hasta 1000 participantes (el aviso de la pestaña Data); por encima de eso, el panel lo explica y ofrece las respuestas en bruto.

CSV en UTF-8 con BOM y separador `;` (se abre directamente en Excel en pt-BR). Números con coma decimal en el CSV de resultados.

## 10. Validación con la hoja oficial

En `data/fixtures/` hay 11 escenarios, cada uno con `respostas.csv` (formato de la hoja) y `esperado.json` con los números de la hoja oficial recalculada en Excel después de pegar las respuestas en `Data!A4`. La lista de escenarios, las celdas leídas y el script que automatiza Excel están en [data/fixtures/LEIA-ME.md](../data/fixtures/LEIA-ME.md):

- `basico`: 20 participantes con respuestas variadas;
- `inconsistente`: 15, con 4 sospechosos por amplitud y 2 casos límite;
- `extremos`: todo 1, todo 7, n = 1, n = 2;
- `oficial-exemplo`: los 255 participantes de ejemplo de la propia hoja;
- `grande`: 1000 participantes, el máximo de la hoja;
- `bordas`: amplitud exactamente 3, 15 y 16 respuestas iguales, 26 veces el 4;
- `variancia-zero`: un ítem con la misma respuesta para todos (error de la hoja en el alfa y en el IC);
- `negativo`: medias negativas, benchmark Malo y alfa negativo.

Las pruebas del módulo `src/ueq/` comparan media, dp, n e IC95 de escalas e ítems, alfa, benchmark, calidad pragmática y hedónica, escalas inconsistentes y respuestas iguales por participante y la distribución de las respuestas, con una tolerancia de `1e-6`. Un error de la hoja tiene que ser `null` en la herramienta.

**Situación el 17/11/2026:** los 11 escenarios coinciden con la hoja oficial. Son 6.543 valores comparados, y la mayor diferencia es de 9,3 × 10⁻¹⁵, que es redondeo de coma flotante. Las 245 celdas en las que la hoja da error son `null` en la herramienta ([RNF11](documentacao/requisitos.md#rnf11), [verificación del cálculo](documentacao/verificacao-do-calculo.md#comparação-com-a-planilha-oficial)).

## 11. UEQ-S, la versión corta

(Fuente: Handbook UEQ versión 11, "Short version for special application scenarios", p. 11-13, y la *UEQ-S Data Analysis Tool V15*, `data/planilha-oficial/Short_UEQ_Data_Analysis_Tool_V15.xlsx`.)

El estudio elige el cuestionario al crearse: el UEQ completo o el UEQ-S. La elección se bloquea con la primera respuesta, para que el estudio no mezcle los dos. El handbook recomienda el UEQ-S solo cuando el completo no es viable (poco tiempo, el UEQ dentro de un cuestionario más amplio, la misma persona evaluando varios productos seguidos), porque no mide las 6 escalas.

**Ítems.** Son 8 ítems del propio UEQ, en este orden ([`data/ueq-s-itens-ptbr.json`](../data/ueq-s-itens-ptbr.json)):

| UEQ-S | Ítem del UEQ | Izquierda | Derecha | Escala |
|---|---|---|---|---|
| 1 | 11 | Obstrutivo | Condutor | Calidad pragmática |
| 2 | 13 | Complicado | Fácil | Calidad pragmática |
| 3 | 20 | Ineficiente | Eficiente | Calidad pragmática |
| 4 | 21 | Confuso | Evidente | Calidad pragmática |
| 5 | 6 | Aborrecido | Excitante | Calidad hedónica |
| 6 | 7 | Desinteressante | Interessante | Calidad hedónica |
| 7 | 10 | Convencional | Original | Calidad hedónica |
| 8 | 15 | Comum | Vanguardista | Calidad hedónica |

En el UEQ-S el término negativo queda siempre a la izquierda, por lo que todos los ítems tienen polaridad `+` y la recodificación es x − 4. Los ítems 4 y 7 aparecen con los lados invertidos respecto al UEQ: una respuesta x en el UEQ-S es 8 − x en el ítem equivalente del UEQ. El UEQ-S existe en los mismos 37 idiomas. Los términos de cada idioma provienen de la lista oficial de ítems del UEQ-S (`docs/UEQ-ORG/ueq-s/UEQS_Items.pdf`), guardada en [`data/ueq-s-idiomas.json`](../data/ueq-s-idiomas.json). En 31 idiomas repite los pares del UEQ completo, con la inversión de lados. En 6 (italiano, croata, griego, turco, persa y chino) usa otra palabra en algunos pares, por ejemplo *konvencionalna/inventivna* en el ítem 7 en croata, y la herramienta sigue la lista del UEQ-S. En 4 idiomas (español, danés, tamil y canarés) el PDF tiene erratas o un par repetido; en esos casos se mantiene el par del UEQ completo, y el archivo registra cada corrección.

**Dónde se guardan las respuestas.** En un estudio del UEQ-S, las 8 respuestas se registran en los ítems equivalentes del UEQ, ya convertidas a la orientación de cada uno. El análisis del UEQ-S lee esos 8 ítems y deshace la conversión. Por eso el mismo análisis sirve para los dos tipos de estudio: en un estudio del UEQ completo, la pestaña UEQ-S de los resultados usa los 8 pares que el participante también respondió, del mismo modo en que los autores construyeron el UEQ-S y su benchmark.

**Escalas.** Para cada participante (pestaña DT): calidad pragmática = media de los ítems 1 a 4; calidad hedónica = media de los ítems 5 a 8; general = media de los 8. La media, el dp, el IC95, la franja de interpretación y el benchmark siguen las secciones 4, 5 y 8, con la misma franja neutra y el mismo z. El handbook pide cautela con la escala general: no es un indicador único de la experiencia, porque el peso de la pragmática y de la hedónica cambia de un producto a otro.

**Alfa.** Solo de la pragmática y de la hedónica, con la fórmula de la sección 6 para k = 4 (pestaña Scale_Consistency, `4·r̄ / (1 + 3·r̄)`). La hoja no calcula el alfa de la general.

**Benchmark.** Los límites de la pestaña Benchmark de la hoja del UEQ-S ([`data/benchmark-ueq-s.json`](../data/benchmark-ueq-s.json)):

| Escala | Por debajo de la media | Por encima de la media | Bueno | Excelente |
|---|---|---|---|---|
| Calidad pragmática | 0,72 | 1,17 | 1,55 | 1,74 |
| Calidad hedónica | 0,35 | 0,85 | 1,20 | 1,59 |
| General | 0,59 | 0,98 | 1,31 | 1,58 |

La propia hoja advierte que, por falta de datos del UEQ-S, esos límites provienen de los mismos 8 ítems dentro del benchmark del UEQ completo y son una aproximación. El panel repite el aviso.

**Respuestas sospechosas.** Las reglas de la pestaña Inconsistencies de la hoja del UEQ-S ([`data/protocolo-ueq-s.json`](../data/protocolo-ueq-s.json)), distintas de las del UEQ completo:

- una escala es inconsistente cuando la distancia entre su mejor y su peor ítem supera 3;
- la respuesta es sospechosa cuando las 2 escalas son inconsistentes;
- la segunda regla solo se aplica a quien marcó la posición central (4) en los 8 ítems. Con tan pocos ítems, repetir la misma posición es habitual, y la hoja solo recomienda eliminar ese caso.

**Exportaciones.** En un estudio del UEQ-S, las respuestas en bruto y recodificadas tienen 8 columnas (`item01` a `item08`, en el orden del UEQ-S), los resultados por escala tienen pragmática, hedónica y general, y la hoja oficial exportada es la del UEQ-S, completada como en la sección 9.4: las 8 respuestas en `Data!A4:H` y el idioma en `Read_First!B4`. En un estudio del UEQ completo, la pestaña UEQ-S exporta los resultados del UEQ-S y la hoja del UEQ-S con los 8 ítems equivalentes.

**Validación.** En `data/fixtures-ueq-s/` hay 9 escenarios con el `esperado.json` de la hoja del UEQ-S recalculada en Excel ([data/fixtures-ueq-s/LEIA-ME.md](../data/fixtures-ueq-s/LEIA-ME.md)), dos de ellos tomados de escenarios del UEQ completo. **Situación el 17/11/2026:** los 9 coinciden con la hoja. Son 8.520 valores comparados, y la mayor diferencia es de 6,0 × 10⁻¹⁵. Las 38 celdas en las que la hoja da error son `null` en la herramienta ([RF62](documentacao/requisitos.md#rf62)).
