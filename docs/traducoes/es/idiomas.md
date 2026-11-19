# Idiomas

La Herramienta UEQ funciona en los 37 idiomas del paquete oficial del UEQ, con dos vías separadas:

- **El enlace del participante** usa los términos y las instrucciones oficiales y textos de pantalla revisables, en archivos. Como es un instrumento de medida, nada del cuestionario pasa por traducción automática.
- **La herramienta del investigador** está escrita en portugués y se traduce bajo demanda mediante la API de Claude ([sección propia](#a-ferramenta-do-pesquisador)). Los textos que el investigador escribe en un estudio (título, producto y objetivo) usan la misma API.

## Cómo se elige el idioma

- Al crear el estudio, el investigador elige su idioma (`Estudo.idioma`, con el idioma de la cuenta como valor predeterminado). El enlace se abre en ese idioma, aunque el navegador esté en otro.
- En el consentimiento y en el cuestionario hay un selector "Idioma" con el nombre de cada idioma escrito en ese mismo idioma. Elegir en el selector no cambia nada por sí solo: solo el botón "Aplicar" lo cambia (WCAG 3.2.2). Cambiarlo en el cuestionario vuelve a él, con las marcas guardadas.
- La elección se guarda en una cookie (`ueq_idioma`, solo en `/r/<slug>`) y vale para todas las etapas. Al dar el consentimiento, el código del idioma se registra en `Participacao.idioma`.
- El `<html lang>` y el `dir` siguen el idioma (WCAG 3.1.1). Por eso el enlace del participante tiene un layout raíz propio (`src/app/r/[slug]/layout.tsx`), separado del de la herramienta (`src/app/(ferramenta)/layout.tsx`).
- En árabe, hebreo y persa el texto va de derecha a izquierda. La fila de círculos sigue yendo de izquierda a derecha, de 1 a 7, con el término de la izquierda a la izquierda, como en los PDF oficiales de esos idiomas.

## Qué viene de dónde

| Contenido | Archivo | Fuente |
|---|---|---|
| 26 pares de términos | `data/ueq-idiomas.json` | PDF oficial de cada idioma, cotejado con la imagen de la página |
| Instrucción antes de los ítems | `data/ueq-instrucoes.json` | PDF oficial de cada idioma, sin el ejemplo con un círculo marcado (como en portugués) |
| Textos de las pantallas (consentimiento, botones, nombres accesibles, errores, datos opcionales, final) | `src/idiomas/textos/*.ts` | Traducción del equipo; los textos del formulario completo (13/11/2026) los tradujo Claude (Opus) y necesitan revisión nativa |
| Política de privacidad, vista desde el enlace del participante | Tabla `traducao` de la base de datos | API de Claude, con los mismos textos de la herramienta. Sin traducción, aparece en portugués, con un aviso en el idioma de la persona |
| Título, producto y objetivo del estudio | Tabla `traducao` de la base de datos | API de Claude, a partir del idioma del estudio. La página espera hasta 8 segundos; lo que no llegue a tiempo sale en el original, marcado con su `lang`, y queda para la próxima visita |

El PDF es la referencia porque es el cuestionario que vería el participante. La pestaña `Items` de la UEQ Data Analysis Tool V15 contiene otra versión en varios idiomas:

- en español, los términos están sin tilde;
- en italiano, danés, turco, chino, búlgaro y árabe, la redacción es otra.

Donde la capa de texto del PDF usa una fuente heredada (hindi, maratí, bengalí, tamil, canarés), el texto se tomó de la hoja y se cotejó ítem por ítem con la imagen. También se tomaron de la hoja el hebreo, el persa y el tailandés. Cada idioma registra el origen en `origemDoTexto`.

## Correcciones en los términos oficiales

En 16 pares el propio PDF oficial tiene un defecto que impide responder o que invierte la puntuación. Todos los idiomas afectados son de traducción aún no aprobada, excepto el persa y el hindi. La corrección es la mínima posible. Cada una queda en `correcoes`, en el JSON, con el par original y el motivo.

| Idioma | Ítem | En el PDF oficial | Usado aquí |
|---|---|---|---|
| Bosnio, hebreo, maratí, bengalí, tamil, árabe, canarés | 19 | el mismo término negativo en ambos lados ("não atende às expectativas", «no cumple las expectativas») | el término positivo a la izquierda, como en el original inglés |
| Húngaro | 16 | `kellemetlen / kellemetlen` | `kellemetlen / kellemes` |
| Húngaro | 19 | `… / elvárásoknak` (cortado) | `… / nem felelnek meg az elvárásoknak` |
| Hebreo | 14 | `לא מושכת / ושך` (cortado) | `לא מושכת / מושכת` |
| Hebreo | 24 | `אטקרטיבי` (errata) | `אטרקטיבי` |
| Canarés | 8 | `ಊಹಿಸಲು ಸಾಧ್ಯವಾದಾಗ` ("cuando es posible predecir") | `ಊಹಿಸಲು ಸಾಧ್ಯವಾಗದ` ("no es posible predecir") |
| Noruego | 26 | `ledende / innovativ` (dos términos positivos) | `konservativ / innovativ` |
| Hindi | 2 y 4 | término positivo en el lado opuesto al del original | términos cambiados de lado |
| Persa | 16 | `مطلوب / نامطلوب`, positivo a la izquierda | `نامطلوب / مطلوب` |

En los ítems con los términos cambiados de lado, la puntuación sigue siendo la del original: quien marca cerca del término positivo puntúa positivo. Ese es el motivo para cambiar los términos, y no la polaridad del ítem en la base de datos.

Dos frases de la instrucción se dejaron fuera:

- en hebreo, las frases sobre "pares agrupados por aspecto" e "importancia de cada aspecto", que describen otro formulario;
- en persa, la frase que pide tachar el ítem que no se pueda evaluar, porque aquí todos los ítems son obligatorios.

## Traducción no aprobada

Nueve PDF advierten "This translation is not yet finally approved": árabe, bengalí, bosnio, hebreo, húngaro, canarés, maratí, noruego y tamil.

- Al elegir uno de ellos, el consentimiento muestra el aviso en el propio idioma.
- En Respuestas, la columna Idioma indica "traducción no aprobada".
- Las exportaciones de respuestas incluyen las columnas `idioma` y `traducao_aprovada`.

## Revisión por un hablante nativo

Antes de usar un idioma en un estudio real, alguien con dominio del idioma debe revisar:

1. los textos de pantalla en `src/idiomas/textos/<código>.ts`, que son todos traducción del equipo (la API de Claude traduce solo la herramienta del investigador y los textos del estudio);
2. las correcciones de la tabla anterior, cuando el idioma tiene alguna;
3. las instrucciones marcadas "Transcrito da imagem… Conferir com falante nativo" («Transcrito de la imagen… Revisar con un hablante nativo») en `data/ueq-instrucoes.json`: árabe, hindi, maratí, bengalí, tamil y canarés. En bengalí, los espacios entre las palabras los puso el equipo, porque el PDF no los tiene.

Las respuestas de los datos opcionales se registran siempre con la categoría en portugués (por ejemplo, "25 a 34 anos", «25 a 34 años»), en cualquier idioma. El análisis y las exportaciones no cambian.

## La herramienta del investigador

El idioma se elige al crear la cuenta y se cambia en Mi cuenta › Idioma o, más rápido, con el selector de idioma de la barra (prototipo r41), que hace lo mismo sin salir de la página. Antes de iniciar sesión, vale el último elegido en el navegador (cookie `idioma_interface`), y el selector de la barra también aparece para quien no ha iniciado sesión. Los avisos de la campana y los correos salen en el idioma de quien los recibe.

Cómo funciona:

1. Todo texto de pantalla se escribe en portugués dentro de `t("…")` o `m("…")`. El comando `pnpm i18n:catalogo` extrae esos textos a `src/traducao/catalogo.json`.
2. Al abrir una pantalla en otro idioma, el servidor lee las traducciones de la tabla `traducao`. Lo que falta sale en portugués, y los lotes de 60 textos, agrupados por pantalla, se ejecutan después de la respuesta, con hasta 6 a la vez, mediante el modelo definido en `src/traducao/claude.ts` (Claude Haiku 5.5, el más barato).
   - La traducción avanza en tres etapas, para que los lotes no elijan palabras distintas para lo mismo: primero el glosario del idioma (`src/traducao/rodadas.ts`), guardado en la tabla; después las etiquetas cortas; por último los textos largos, que reciben la traducción de los botones que citan.
   - Cada texto va con el archivo que lo usa y con las instrucciones sobre el sentido de los términos, para que "baixar" (descargar) no se convierta en "dar baixa" (dar de baja).
   - El glosario incluye una frase modelo que fija el tratamiento formal del idioma, y la revisión trata cualquier otro tratamiento como un error.
   - El nombre "Ferramenta UEQ" viaja como marcador y la traducción guarda el nombre en portugués. En el momento de mostrarla, el traductor sustituye el nombre por el del idioma de la interfaz (UEQ Tool, Herramienta UEQ, UEQ-Tool, Outil UEQ, UEQ ツール...), que está en `NOME_DA_FERRAMENTA`, en `src/traducao/nucleo.ts`. Una frase todavía sin traducción sigue entera en portugués, con el nombre en portugués.
   - Una segunda lectura compara el original y la traducción y corrige lo que cambió de sentido.
   - Una traducción con `{marcadores}` distintos de los del original se descarta: el texto queda en portugués.
   - Esto reduce los errores, pero no sustituye la revisión por un hablante nativo.
3. Cada traducción se guarda por idioma y por el hash del texto, así que nunca se pide dos veces. Cambiar un texto en portugués genera una traducción nueva.
4. Administración › Idiomas muestra la cobertura de cada idioma y tiene el botón "Traducir ahora".

Al escribir un texto nuevo, piense en quien va a traducirlo sin ver la pantalla:

- Escriba la frase completa, con sujeto. "Fica num cookie" («Se guarda en una cookie») no dice qué se guarda.
- Evite palabras con dos sentidos. "Baixa os dados" («Descarga los datos») puede convertirse en "dá baixa" («da de baja»); prefiera "faz o download" («hace la descarga»).
- No arme frases con fragmentos de texto y enlaces: el orden de las palabras cambia de un idioma a otro.
- Pase por `t()` o `m()` solo lo que aparece en la pantalla. Un selector o un nombre de evento traducidos rompen la pantalla.

Los textos nuevos también pueden entrar ya traducidos, mediante una migration que escribe en la tabla `traducao` (como `20261113120100_traducoes_do_termo`, escrita por Claude sin la API). Así no se llama a la API para ellos.

Sin `ANTHROPIC_API_KEY` en el entorno, no se traduce nada y la herramienta aparece en portugués. Mientras más de la mitad del catálogo de un idioma no esté traducida, el `<html lang>` y la dirección quedan en portugués, para que el lector de pantalla pronuncie correctamente.

A la API van solo los textos de la interfaz y los textos del estudio. Ninguna respuesta, nombre, correo electrónico o dato demográfico va con ellos, como indica la política de privacidad.

## Fuera del alcance

- El panel de resultados no separa por idioma. Para comparar idiomas, use la columna `idioma` de las exportaciones.
- Los documentos de la pestaña Documentación están en portugués.
