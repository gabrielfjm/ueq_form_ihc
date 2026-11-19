# Identidad visual

## La idea

La herramienta tiene aspecto de **instrumento de laboratorio**, no de SaaS. Piense en un formulario técnico, un informe bien maquetado, una regla de medición. Fondo blanco, tinta oscura, líneas finas, tablas, números alineados. La única "decoración" es el propio instrumento: la fila de 7 marcas del diferencial semántico aparece como motivo visual (en el logotipo, en el indicador de progreso, en los estados vacíos).

Prueba para cualquier pantalla: **si una captura de ella pudiera ser de cualquier plantilla de dashboard, rehágala.**

## Prohibido

Esto es lo que delata al instante que algo está "hecho por IA". No usar en ninguna pantalla:

- Fuente Inter, Geist, Poppins, Montserrat, Roboto o la fuente predeterminada del sistema como fuente principal
- Degradados de cualquier tipo, sobre todo morado/azul/rosa
- Glassmorphism, `backdrop-filter: blur`, brillo, neón, sombra de color
- Sombras en tarjetas (`box-shadow` grande y difusa). La separación se hace con una línea de 1px o un cambio de fondo
- `border-radius` superior a 4px. Nada de píldoras, nada de `rounded-2xl`
- Cuadrícula de tarjetas con icono + título + número ("KPI cards") como apertura del panel
- Icono decorativo: junto al título de una sección, en elementos de lista, en un estado vacío. El icono solo aparece en las acciones (ver "Iconos")
- Fondo crema, títulos con serifa y acento terracota: se ha convertido en la cara de la interfaz generada por IA (decisión del equipo del 22/10/2026)
- Fuente monoespaciada en números y fechas, y etiquetas en versalitas o en mayúsculas espaciadas: por la misma razón. La única excepción es el bloque de código dentro de un documento en la pestaña Documentación (comandos, árbol de carpetas), que es contenido y necesita las columnas alineadas
- Emoji en la interfaz, en mensajes, en toasts, en commits
- Hero centrado con título enorme, subtítulo gris y dos botones
- Texto con degradado, texto "brillante", animación de entrada en todo (fade-up en listas)
- Skeleton con shimmer. La carga es texto simple ("Cargando respuestas…") o nada si es rápida
- Modo oscuro como predeterminado
- Paleta semáforo (verde/amarillo/rojo) para las franjas del benchmark
- Microcopy de startup: "¡Ups!", "¡Todo listo! 🎉", "¿Empezamos?", "Desbloquee insights", "de forma simple e intuitiva", "potencie"

## Colores

Definidos en `src/styles/tokens.css`. Ningún color hexadecimal suelto en un componente.

```css
:root {
  --fundo:          #FFFFFF;  /* fundo geral, campos de formulário */
  --fundo-faixa:    #F3F5F7;  /* faixa de cabeçalho, áreas recuadas */
  --fundo-painel:   #F8FAFB;  /* ficha lateral, painel do gráfico */
  --tinta:          #0F1720;  /* texto principal, botões primários */
  --tinta-suave:    #46525E;  /* texto secundário */
  --tinta-fraca:    #5B6672;  /* legendas, rótulos de eixo. 5.4:1 na faixa */
  --linha:          #D5DBE1;  /* réguas e divisórias de tabela. NUNCA borda de campo */
  --borda-campo:    #7A8691;  /* borda de input, select, textarea. 3.4:1 na faixa (WCAG 1.4.11) */
  --linha-forte:    #0F1720;

  --destaque:       #0B6A78;  /* azul-petróleo. Foco, link, item ativo, numeração de seção. Usar pouco */
  --destaque-fundo: #E6F2F4;  /* hover de controles, mensagem de status */

  --alerta:         #B42318;  /* erro, ação destrutiva, alfa baixo, resposta suspeita. Sempre com texto */
  --alerta-fundo:   #FEF3F2;

  /* escalas UEQ, agrupadas pelo construto */
  --atratividade:   #0F1720;  /* impressão geral, na cor da tinta */
  --pragmatica:     #1D4E89;  /* perspicuidade, eficiência, confiabilidade */
  --hedonica:       #9A5B00;  /* estimulação, novidade. ≥ 3:1 inclusive sobre a faixa mais escura do benchmark */

  /* faixas de benchmark: cinza-azulado, do mais escuro (excelente) ao mais claro (ruim) */
  --bench-excelente: #C7D0D9;
  --bench-bom:       #D5DCE3;
  --bench-acima:     #E1E6EB;
  --bench-abaixo:    #EBEFF2;
  --bench-ruim:      #F4F6F8;
}
```

Contrastes comprobados (WCAG 2.2): tinta 18:1, tinta-suave 8:1, tinta-fraca 5,9:1, destaque 6,3:1 y alerta 6,6:1 sobre el fondo blanco. Sobre las franjas del benchmark, el texto usa solo `--tinta` o `--tinta-suave` (≥ 5,1:1). Una prueba automatizada (`src/styles/__tests__/contraste.test.ts`) recalcula estos pares a partir de tokens.css y falla si alguno baja del mínimo.

Destaque y alerta tienen funciones separadas: el azul petróleo indica dónde está el usuario y qué es clicable; el rojo indica un problema o una acción que borra datos. Nunca cambiar uno por el otro.

Soporte también para `@media (forced-colors: active)`: los círculos, el foco y los marcadores del gráfico usan `CanvasText`/`Highlight` para no desaparecer con el alto contraste de Windows.

Todo lo de este archivo está subordinado a `docs/ihc.md`. Si una elección estética entra en conflicto con la accesibilidad o la usabilidad, gana la de IHC.

El estado del estudio es texto en negrita con un punto de 10px delante, no una insignia de color: punto lleno en `--destaque` para abierto, hueco en `--tinta-fraca` para borrador, lleno en `--tinta` para cerrado. El texto siempre dice el estado; el punto solo lo refuerza.

## Tipografía

Google Fonts mediante `next/font`:

- **Atkinson Hyperlegible Next** en todo: títulos (peso 700), texto de interfaz y cuestionario (peso 400). Fue diseñada por el Braille Institute para la legibilidad, lo que ya es por sí solo un argumento de IHC (vale la pena citarlo en la presentación). Una sola familia también refuerza la consistencia (Nielsen 4)
- **Source Sans 3** para los números (tablas, medias, IC, alfa, n, fechas, recuentos), mediante `var(--fonte-numero)`, con `font-variant-numeric: tabular-nums` y alineados a la derecha en las tablas. La Atkinson tiene el cero tachado y cifras tabulares anchas, que dan aspecto de código; la Source Sans tiene cifras comunes y compactas. Para que los números sueltos en medio del texto ("60 años o más") también salgan en Source Sans, declarar un `@font-face` con `unicode-range: U+0030-0039` que apunte a ella antes de la Atkinson en la pila de fuentes. Sin fuente monoespaciada en la interfaz

Escala (rem): 0.8125 · 0.9375 · 1.0625 · 1.25 · 1.625 · 2.25. Cuerpo en 1.0625rem, interlineado 1.5. Títulos con `letter-spacing: -0.015em`. Etiquetas de sección y de grupo en negrita, en un tamaño menor y `--tinta-suave`, con caja normal (nada de versalitas ni de mayúsculas espaciadas).

## Diseño

- Contenido alineado a la izquierda, ancho máximo de lectura ~72ch, paneles de datos hasta 1120px
- Cuadrícula de 8px. Espacio vertical generoso entre secciones (de 48 a 64px), ajustado dentro de las tablas
- Navegación del investigador: barra superior fina con el nombre de la herramienta a la izquierda y enlaces con icono y texto: Estudios, Crear estudio, Documentación, Administración (solo para quien es administrador), Mi cuenta, la campana de notificaciones, el selector de idioma y Salir. Sin barra lateral. Quien no ha entrado (página de inicio y documentación) ve la misma barra solo con Documentación, el selector de idioma y Entrar (`log-in`); Crear cuenta (`user-plus`) está en la página de inicio y dentro de la ventana de Entrar. El enlace del participante no tiene ninguna barra
- La barra queda fija arriba durante todo el desplazamiento, en el ordenador y en el móvil. Hasta 56rem de ancho los enlaces quedan detrás de un botón Menú (`menu`, y `x` cuando está abierto, siempre con el texto "Menú"), para que la barra fija ocupe una sola línea; el menú abre los enlaces en columna justo debajo y se cierra con Esc o al cambiar de página. En 320 px la fila de marcas del logotipo sale de la barra para que quepan el nombre y el Menú
- Las tablas son ciudadanas de primera clase: encabezado en negrita, filas separadas por una regla de 1px, números alineados a la derecha
- Botón primario: fondo `--tinta`, texto `--fundo`, radio de 2px, altura de 40px. Secundario: borde de 1px `--tinta`, fondo transparente. Acción destructiva: texto `--alerta` subrayado, que abre una ventana de confirmación (ver "Ventanas")
- Foco siempre visible: `outline: 2px solid var(--destaque); outline-offset: 2px`
- Franja de encabezado en `--fundo-faixa` en la parte superior de las páginas del estudio, con título, estado, resumen y pestañas
- Las pantallas anchas del investigador usan dos columnas (contenido + ficha lateral) en lugar de una columna estrecha con la derecha vacía
- Página de inicio (`/`): presenta la herramienta y es la pantalla después del inicio de sesión. Texto alineado a la izquierda con el ítem del cuestionario y una vista previa del resultado como figura, índice "En esta página" y secciones numeradas: Qué es el UEQ, Cómo leer los resultados, Cómo funciona, Estudios sobre el método y Créditos. Sin hero centrado
- Paneles de opciones (Administración y Mi cuenta, prototipos r24 y r9): una cuadrícula en la que cada opción lleva a una página propia o abre una ventana, con título, descripción y situación en una línea, en lugar de apilarlo todo en una sola pantalla. Toda la tarjeta responde al clic, pero sigue siendo una lista con títulos para el lector de pantalla
- Documentación en páginas (prototipos r36 a r38): un documento largo se abre como índice, "En este documento", con el título y la primera frase de cada sección, y la introducción larga queda plegada. Cada sección se abre en una página propia: franja corta con Volver, la ruta de navegación, el título y "7 de 8", una sola columna, el diagrama destacado cabiendo en la pantalla, y Anterior y Siguiente al final. Una sección con 3 subsecciones o más se convierte en índice, en dos columnas cuando pasa de 12 elementos. Un documento de hasta 4.000 caracteres sigue entero
- Política de privacidad (`/privacidade`, prototipo r33): franja con "Volver" arriba y el cuadro "En resumen" al lado; debajo, secciones numeradas en filas de etiqueta y explicación con una regla entre ellas, como las condiciones del consentimiento, y la ficha lateral fija "En esta página". El "Volver" dice adónde va y aparece también al final de la página. Cuando la política se abrió en otra pestaña, desde las ventanas de Entrar y Crear cuenta, se convierte en "Cerrar esta pestaña y volver", para no perder lo que la persona escribió
- Política en el enlace del participante (`/r/<slug>/privacidade`, prototipo p9): el mismo contenido, abierto mediante un enlace al final del formulario de consentimiento, sin barra, sin iconos y sin enlace al resto de la herramienta. El "Volver" lleva al formulario. Mientras el texto no tenga traducción al idioma de la persona, un cuadro avisa, en su idioma, de que la política aparece en portugués

## Ventanas

- Entrar y Crear cuenta se abren en una ventana sobre la página en la que está la persona, con el formulario a la izquierda y el panel del instrumento a la derecha (las pantallas r1 y r2 dentro de la ventana). Crear cuenta y Entrar intercambian el formulario dentro de la misma ventana. `/entrar` y `/cadastrar` muestran la página de inicio con la ventana abierta
- La ventana de acceso cabe entera en la pantalla, sin desplazarse: las medidas se reducen con la altura (portátil de 768 px) y, hasta 40rem de ancho, ocupa toda la pantalla, sin el panel (que vuelve, solo con el título, cuando la pantalla es alta)
- Salir y toda eliminación (estudio, cuenta, versión del estudio) piden confirmación en una ventana estrecha: título en forma de pregunta ("¿Eliminar este estudio?"), lo que va a ocurrir, Cancelar y el botón de la acción. En las eliminaciones, el aviso va en `--alerta-fundo` con borde `--alerta`, el campo de confirmación (título o correo electrónico escrito) se mantiene y el botón es `--alerta`. Salir usa el botón primario, porque no borra nada. En el móvil, los botones van en columna, con la acción arriba
- `<dialog>` nativo con `showModal()`: foco retenido dentro, página de detrás inerte y sin desplazamiento, Esc y la `x` (Cerrar) cierran, y el foco vuelve a quien la abrió. Fondo de la página oscurecido con `--tinta` al 62 %, borde de 1px `--linha-forte`, radio de 2px. Sin sombra ni desenfoque
- Foco inicial: en el primer campo (Entrar, Crear cuenta, eliminaciones) o en el botón de la acción cuando no hay campo (Salir, Quitar versión)
- "Salir sin enviar", en el cuestionario del participante, también se confirma en una ventana (prototipo p8): la pregunta es el título, "Seguir respondiendo" es el botón primario y empieza con el foco, y Esc también continúa. Sin icono y sin la `x`, como todas las pantallas del participante; los textos vienen del idioma elegido
- Documento en producción (prototipo r23): mientras el archivo no entre en la lista `PRONTOS` de `src/lib/documentacao/catalogo.ts`, la pestaña Documentación muestra las mismas pestañas y subpestañas, la fila de marcas vacía, "En producción" con el punto hueco del borrador y la ficha con lo que traerá el documento, sin archivo, descargas ni índice. La vista general muestra la situación de cada documento
- Icono del sitio (`src/app/icon.svg` y `apple-icon.tsx`): tres marcas del diferencial semántico, la última rellena, en blanco sobre `--destaque`
- Ayuda de la página (prototipo r30): botón redondo (?) en el encabezado de cada página del investigador, con `aria-label`, que abre la ventana mediana. Esta dice para qué sirve la página y qué se puede hacer en ella, lleva a la Política de privacidad y ofrece repasar el recorrido
- Compartir (prototipo r25): ventana mediana con quién tiene acceso y la invitación por correo electrónico, eligiendo Editor o Lector

## Acciones en curso y confirmaciones

- Toda acción que va al servidor usa `BotaoEnvio` (prototipo r39). Mientras se ejecuta, el botón dice lo que está ocurriendo ("Creando el estudio…"), con el indicador girando, queda con `aria-busy` y `aria-disabled` e ignora nuevos clics, y el resto del formulario deja de responder al clic. Nada se envía dos veces
- El indicador es la única animación continua de la herramienta y se detiene con `prefers-reduced-motion`. En las pantallas del participante no hay indicador ni icono: solo el texto "Espere…", en el idioma de la persona
- Toda acción completada se confirma en la pantalla (prototipo r40): cuadro en `--destaque-fundo` con borde `--destaque`, en `role="status"`, preferiblemente diciendo el resultado ("Estudio creado correctamente."). Acompaña el desplazamiento, justo debajo de la barra, y permanece hasta que la persona lo cierra. El error de una acción usa `--alerta-fundo`, borde `--alerta` y otro icono, para no parecer una confirmación
- El aviso que llegó por la dirección (`?aviso=`) sale de ella después de mostrarse: recargar no vuelve a confirmar

## Campana, idioma y recorrido

- Campana (prototipo r26): está entre Mi cuenta y el selector de idioma. Las no leídas aparecen en un contador `--alerta` con el número en texto. Abre los avisos más recientes y lleva a la página Notificaciones (r27), donde las invitaciones tienen Aceptar y Rechazar allí mismo
- Selector de idioma (prototipo r41): atajo a Mi cuenta › Idioma, entre la campana y Salir (sin inicio de sesión, entre Documentación y Entrar). En el ordenador muestra el icono `languages` y la sigla del idioma actual ("PT"), y el nombre completo queda para el lector de pantalla; en el menú del móvil aparece "Idioma: Portugués". Se abre hacia abajo como la campana, sin ser modal, con los 37 idiomas por su propio nombre en tres columnas y el actual marcado con `check`. Solo el clic lo cambia (WCAG 3.2.2), y la página sigue siendo la misma, ya en el idioma nuevo
- Recorrido guiado (prototipos r28 y r29): comienza con una ventana de bienvenida en el primer acceso. Cada paso destaca un elemento real de la pantalla y una tarjeta al lado lo explica. En parte de los pasos, la persona realiza la propia acción para seguir. Se puede saltar o cerrar en cualquier momento, y repasar desde la ayuda

## Correos electrónicos

La invitación y los avisos salen con la misma identidad: fondo blanco, franja `--fundo-faixa`, tinta oscura, la fila de 7 marcas y azul petróleo solo en lo que es clicable. Están hechos con tablas con estilo en línea, sin imágenes, e incluyen la versión en texto plano. Salen en el idioma de quien los recibe (`src/lib/modelo-email.ts`).

## Iconos

Lucide (`lucide-react`), contorno de 1,5 px, 18 px, del color del texto de al lado.

- El icono solo acompaña al texto en **acciones**: botones, enlaces de acción, navegación principal y pestañas. El texto sigue siempre visible; el icono tiene `aria-hidden="true"`
- Icono solo, sin texto, únicamente en cerrar y menú, con `aria-label`. Excepción: en el móvil, los botones de zoom del diagrama a pantalla completa (`zoom-out`, `zoom-in`, `maximize`) muestran solo el icono para que Volver y el zoom quepan en una línea; el texto (Reducir, Aumentar, Ajustar a la pantalla) sigue como nombre accesible y aparece en el ordenador
- La acción destructiva usa el icono en el color `--alerta`, junto con el texto
- **Ningún icono en las pantallas del participante dentro del cuestionario** (ihc.md, sección 3: cualquier elemento de más puede influir en la respuesta)
- Mapa usado en las pantallas: Estudios `folder`, Crear estudio `plus`, Mi cuenta `user`, Guardar cambios `save`, Cambiar contraseña `lock`, Salir `log-out`, Entrar `log-in`, Crear cuenta `user-plus`, Vista general `layout-dashboard`, Resultados `bar-chart-3`, Respuestas `list`, Copiar enlace `copy`, Abrir recogida `play`, Cerrar recogida `square`, Reabrir `rotate-ccw`, Editar `pencil`, Eliminar `trash-2`, Exportar `download`, Mostrar contraseña `eye`, Agregar versión `plus`, Quitar `x`, Sacar del análisis `minus-circle`, mensaje de estado `check-circle`, Documentación `book-open`, Ver en GitHub y Abrir a tamaño real `external-link`, Descargar `download`, Volver `arrow-left`, Administración y Política de privacidad `shield-check`, Notificaciones `bell`, Ayuda `circle-help`, Repasar el recorrido `compass`, Idioma `languages`. Pestañas de la documentación: Vista general `layout-dashboard`, Requisitos `list-checks`, Usuarios `users`, Modelado `shapes`, Arquitectura `layers`, Pruebas `flask-conical`, Especificación `file-text`
- Movimiento: solo una transición de 120ms en color/borde y el indicador de acción en curso. Respetar `prefers-reduced-motion`

## Pantallas clave

### Cuestionario del participante (`/r/[slug]`)
La pantalla más importante. Es donde el equipo demuestra que entiende de IHC.

- Encabezado mínimo: nombre del producto evaluado y una frase de instrucción al estilo del UEQ oficial
- Formulario de consentimiento antes, en una página propia, con el texto completo, un enlace a la política de privacidad y el botón "Estoy de acuerdo y quiero participar". Sin casilla oculta
- El formulario (prototipo p1) enumera, numerados: tiempo, datos opcionales (cuando los haya), participación, después de enviar, anonimato, uso de los datos, riesgos, beneficios, responsable y comité de ética (cuando lo haya). El subtítulo lleva la institución del estudio. Debajo, "Política de privacidad" y "Guardar una copia de este formulario" (prototipo p10), la pregunta "¿Qué edad tiene?" y, para "Menos de 18 años", la confirmación de la autorización del responsable legal
- Ítems en filas, una por ítem, con una regla fina entre ellas. Término de la izquierda alineado a la derecha, 7 círculos en el centro, término de la derecha alineado a la izquierda. Nada de números visibles
- Círculos con área táctil de 44×44px, contorno de 1.5px `--tinta`, rellenos de `--tinta` cuando están marcados
- Teclado: comportamiento nativo del botón de opción (Tab entre ítems, flechas dentro del ítem). Sin atajos de una sola tecla, que entran en conflicto con el lector de pantalla (WCAG 2.1.4). Cada ítem es un `<fieldset>` con `<legend>`, detalles en la sección 4.1 de `docs/ihc.md`
- Enlace discreto "Salir sin enviar" en el pie, que pide confirmación en una ventana (ver "Ventanas")
- Móvil (< 640px): los dos términos quedan en una línea encima de los 7 círculos, uno en cada extremo
- Progreso: texto "14 de 26" fijo en el pie + la fila de 7 marcas como icono. Sin barra de progreso de color
- Al enviar con un ítem pendiente: resumen de errores arriba con un enlace a cada ítem ("Faltan 2 ítems: 7 y 19"), el foco va al resumen y cada ítem que falta recibe un borde izquierdo `--alerta` + el texto "Este ítem no se ha respondido"
- `scroll-padding-bottom` igual a la altura del pie fijo, para que el foco nunca quede oculto
- Fin: página sencilla de agradecimiento, en un cuadro con fondo `--fundo-painel` y una barra de 3px `--destaque` a la izquierda. Nada de confeti. Los avisos de una sola pantalla (enlace cerrado, ya respondió, salió) usan el mismo cuadro
- Todas las etapas se abren con la misma franja `--fundo-faixa` del consentimiento: etapa ("Paso 2 de 3 · Cuestionario") y título. En el consentimiento y en el cuestionario la franja tiene el selector de idioma; cambiarlo en el cuestionario vuelve a él, con las marcas guardadas en el borrador
- Instrucción oficial del UEQ en un cuadro (`--fundo-painel`, borde de 1px `--linha`) encima de los ítems, con el texto completo y en el orden del paquete de idiomas
- Cada ítem muestra el número en `--tinta-fraca` a la izquierda, para encontrar el ítem que señala el resumen de errores; el número también está en la leyenda. El ítem respondido recibe una barra de 3px `--destaque` a la izquierda, igual en cualquier posición marcada; el ítem que falta, la misma barra en `--alerta` con fondo `--alerta-fundo`. En el ordenador la fila se aclara (`--fundo-painel`) con el ratón encima, para que el ojo no se pierda entre término y círculos
- Círculos de 30px; el marcado es un anillo con el centro en `--tinta`, como los botones de opción de los datos opcionales
- Datos opcionales: cada opción es una fila entera clicable, con borde `--borda-campo`; la elegida queda con borde `--tinta` y fondo `--destaque-fundo`. Continuar y Saltar esta etapa mantienen el mismo peso

### Panel del estudio
Se abre con una **línea de resumen en texto**, no con tarjetas: "34 respuestas · 3 sospechosas · 31 en el análisis · recogida abierta desde el 04/11".

Gráfico principal (SVG propio, `src/graficos/EscalasComBenchmark.tsx`):
- Una línea horizontal por escala, eje de -3 a +3
- Detrás de cada línea, las 5 franjas del benchmark de esa escala en tonos gris azulado, con la etiqueta de la franja
- Franja neutra (de -0,8 a +0,8) marcada con dos líneas verticales discontinuas y la etiqueta "neutro" arriba
- La media es un punto (círculo de 8px en el color del constructo), el IC95 es un trazo horizontal con terminaciones
- A la derecha del gráfico, la media en números tabulares y la franja del benchmark en texto
- Escalas agrupadas con etiqueta en negrita: Atractivo / Calidad pragmática / Calidad hedónica

Debajo, la tabla completa (n, media, de, IC95, alfa, franja). Un alfa < 0,7 aparece con el valor en `--alerta` y una nota al pie.

Gráfico por ítem: lista de los 26 ítems con los dos términos y un punto en la posición de la media (de -3 a +3), en el orden oficial o agrupados por escala (alternable).

Comparación entre versiones: el mismo gráfico de escalas, con un marcador por versión (círculo lleno y círculo hueco, o cuadrado), leyenda en texto encima.

### Estados vacíos
Sin ilustración. Una frase directa y la acción. Ej.: "Todavía no hay respuestas. Comparta el enlace del estudio para comenzar la recogida." + enlace copiable en un campo con fondo `--fundo-painel` y el botón "Copiar enlace".

## Excepciones

La página de inicio se aparta de dos reglas de la sección "Prohibido": la franja superior tiene un degradado radial suave, y las figuras y tarjetas tienen un radio de 6 a 8 px (`inicio.module.css`). La excepción es intencionada y se limita a ella: la página de inicio presenta el UEQ a quien todavía no conoce la herramienta, y las pantallas de trabajo siguen la regla. El contador de la campana tiene un radio de 10 px, que es la forma del número.

## Tono de voz

Portugués de Brasil, frase corta, verbo al inicio de los botones ("Criar estudo", "Encerrar coleta", "Exportar respostas"; en español, "Crear estudio", "Cerrar recogida", "Exportar respuestas"). Habla como un investigador que se dirige a otro investigador. Términos del UEQ con el nombre oficial (Perspicuidade, no "Clareza"; en español, Perspicuidad, no "Claridad"). Fechas en dd/mm/aaaa, números con coma decimal.
