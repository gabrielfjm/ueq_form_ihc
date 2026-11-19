# Fundamentos de IHC aplicados a la herramienta

Este archivo convierte la literatura de IHC en requisitos verificables. Toda decisión de interfaz debe poder rastrearse hasta un principio de aquí. Quien implementa una pantalla revisa la sección "Requisitos por pantalla" y la "Lista de verificación WCAG" antes de dar la tarea por terminada. La relación de cada decisión con el código y con las pruebas está en [decisiones de interfaz](rastreabilidade-ihc.md).

Meta de conformidad: **WCAG 2.2 nivel AA** (W3C, 2023), que es también la base de la **ABNT NBR 17225:2025** (accesibilidad en contenido y aplicaciones web). La Ley Brasileña de Inclusión (Ley 13.146/2015, art. 63) hace obligatoria la accesibilidad de los sitios web en Brasil.

## 1. Base teórica utilizada

| Referencia | Lo que tomamos de ella |
|---|---|
| ISO 9241-11:2018 | Definición de usabilidad: eficacia, eficiencia y satisfacción para usuarios específicos, con objetivos específicos, en un contexto de uso específico. Por eso la sección 2 define usuarios y contextos antes de cualquier pantalla |
| ISO 9241-110:2020 | 7 principios de interacción: adecuación a la tarea, autodescriptividad, conformidad con las expectativas del usuario, facilidad de aprendizaje, controlabilidad, robustez frente a los errores de uso, implicación del usuario |
| Nielsen (1994), 10 heurísticas | Lista de verificación de la evaluación heurística realizada por el equipo |
| Shneiderman et al., 8 reglas de oro | Consistencia, usabilidad universal, retroalimentación informativa, diálogos con cierre, prevención de errores, reversión fácil de las acciones, control del usuario, reducción de la carga de memoria |
| Norman (2013) | Affordances y significantes, mapeo natural, retroalimentación, restricciones, modelo conceptual |
| Ley de Fitts | Objetivos importantes grandes y cerca de donde ya están la mirada y el cursor |
| Ley de Hick-Hyman | Pocas opciones por decisión. Una acción principal por pantalla |
| Gestalt (proximidad, semejanza, región común) | Agrupación visual de las escalas UEQ por constructo, etiqueta cerca del campo |
| WCAG 2.2 / NBR 17225 / eMAG | Requisitos de accesibilidad comprobables (sección 5) |
| Laugwitz, Held y Schrepp (2008) y UEQ Handbook | Formato del diferencial semántico, instrucción oficial, orden fijo de los ítems |

## 2. Usuarios y contexto de uso (ISO 9241-11)

**Participante**
- Cualquier persona adulta. Puede tener poca familiaridad digital, baja visión o daltonismo, usar lector de pantalla (NVDA, VoiceOver, TalkBack), navegar solo con el teclado o usar zoom del 200 % o más
- Accede con frecuencia desde el móvil (enlace recibido por WhatsApp o correo electrónico)
- No tiene cuenta ni motivación intrínseca: cualquier fricción se convierte en abandono
- Objetivo: responder rápido (de 3 a 5 minutos) y salir
- Medida de éxito: tasa de finalización alta, ningún ítem olvidado, tiempo cercano al previsto por el handbook

**Investigador**
- Estudiante de posgrado o investigador, conoce UX pero no necesariamente estadística a fondo. Puede trabajar en equipo y leer la herramienta en cualquiera de los 37 idiomas
- Usa el ordenador, en sesiones cortas y repetidas (abre el panel varias veces durante la recogida)
- Objetivo: montar el estudio sin errores, seguir la recogida, entender el resultado y exportarlo para el informe
- Medida de éxito: crea un estudio completo sin ayuda, interpreta correctamente el panel, comprueba los números con la hoja oficial

## 3. El cuestionario como instrumento de medida

Aquí la IHC se encuentra con la metodología de investigación. Cualquier sesgo de la interfaz contamina el dato.

1. **Ninguna opción preseleccionada.** Un valor predeterminado genera anclaje y respuestas no intencionadas
2. **Las 7 posiciones tienen un peso visual idéntico.** Mismo tamaño, mismo color, mismo espaciado. Sin color graduado (rojo → verde), sin número, sin etiqueta intermedia, sin la posición central destacada. Esto preserva el formato del diferencial semántico validado
3. **Orden y polaridad oficiales, siempre.** La alternancia de polos es intencionada en el UEQ para reducir la aquiescencia. La interfaz nunca "ordena" los polos
4. **Instrucción oficial del UEQ** arriba, en el lenguaje del paquete de idiomas
5. **Diseño idéntico para los 26 ítems.** Un cambio de diseño entre ítems cambia la respuesta
6. **El participante nunca ve resultados** ni la media de otros participantes
7. **Desistir es fácil y explícito** (ética en la investigación con seres humanos). El enlace "Salir sin enviar" está siempre disponible, con confirmación en una ventana, y no se graba nada en Respuesta antes del envío
8. **Anonimato real.** No recoger IP, nombre ni correo electrónico. Datos demográficos solo en rangos, siempre con "Prefiero no responder", y la etapa entera solo existe si el investigador activa la recogida en el estudio

## 4. Requisitos por pantalla, con el principio que los justifica

Formato: requisito → principio (fuente).

### 4.1 Cuestionario del participante

| Requisito | Principio |
|---|---|
| Cada ítem es un `<fieldset>` con un `<legend>` que contiene los dos términos ("Ítem 4 de 26: fácil de aprender o difícil de aprender"). Las 7 opciones son `<input type="radio">` nativos con estilo, no `div` con onClick | Nombre, función, valor (WCAG 4.1.2), información y relaciones (1.3.1), significantes (Norman) |
| Cada botón de opción tiene un nombre accesible con la posición y el polo más cercano ("3 de 7, más cerca de fácil de aprender"). Posición 4: "4 de 7, centro" | Etiquetas o instrucciones (3.3.2), autodescriptividad (ISO 9241-110) |
| Área clicable de cada círculo ≥ 44×44 px, aunque el círculo dibujado sea menor. Distancia entre objetivos que evite tocar el vecino | Tamaño del objetivo (WCAG 2.5.8 pide 24 px; usamos los 44 px de la Apple HIG/WCAG AAA 2.5.5), Ley de Fitts |
| Los términos también son clicables: hacer clic en el término izquierdo no marca nada (evita respuestas accidentales), pero los términos quedan cerca de los extremos | Mapeo natural (Norman), prevención de errores (Nielsen 5) |
| Marcar una opción no cambia el foco ni desplaza la página por sí sola | Al recibir entradas (WCAG 3.2.2), control del usuario (Shneiderman 7) |
| Teclado: Tab entra en el grupo, las flechas cambian la opción (comportamiento nativo del radio), Tab sale al siguiente ítem. Sin atajos de una sola tecla que entren en conflicto con el lector de pantalla | Teclado (2.1.1), sin trampas para el foco del teclado (2.1.2), conformidad con las expectativas del usuario (ISO 9241-110) |
| Progreso "14 de 26 respondidos" actualizado con cada marca y anunciado con `aria-live="polite"` solo cada 5 ítems y al completar (para no saturar el lector de pantalla) | Visibilidad del estado del sistema (Nielsen 1), mensajes de estado (4.1.3) |
| El pie fijo de progreso nunca cubre el ítem con el foco: `scroll-padding-bottom` igual a la altura del pie | Foco no oculto (WCAG 2.4.11) |
| Validación solo en el envío, no en cada ítem. Error: resumen arriba con un enlace a cada ítem que falta ("Faltan 2 ítems: 7 y 19"), el foco va al resumen y cada ítem que falta recibe un borde y el texto "Este ítem no se ha respondido" (no solo color) | Identificación de errores (3.3.1), sugerencias ante errores (3.3.3), uso del color (1.4.1), Nielsen 9 |
| Respuestas guardadas en el sessionStorage mientras se responde | Robustez frente a los errores de uso (ISO 9241-110), Shneiderman 6 |
| Sin límite de tiempo | Tiempo ajustable (2.2.1) |
| Con 320 px de ancho y con zoom del 400 % nada se corta ni exige desplazamiento horizontal. En el móvil los términos pasan encima de los círculos | Reajuste del contenido (1.4.10), cambio de tamaño del texto (1.4.4) |
| Página con el `lang` y el `dir` del idioma elegido, `<title>` por etapa ("Consentimiento · Estudio X", "Cuestionario · Estudio X") | Idioma de la página (3.1.1), titulado de páginas (2.4.2) |
| Una única acción principal por página (Estoy de acuerdo / Enviar respuestas) | Ley de Hick, diseño estético y minimalista (Nielsen 8) |
| El formulario de consentimiento tiene un enlace a la política de privacidad, en una página dentro del enlace del participante, sin camino hacia el resto de la herramienta. El cuestionario en sí no tiene ese enlace, para no añadir nada al instrumento | Transparencia (LGPD, art. 9º), ética en la investigación, §3 |
| Etapas claras: Consentimiento → Cuestionario → Datos opcionales → Fin, con indicación textual de la etapa actual | Diálogos con cierre (Shneiderman 4) |
| El formulario indica el tiempo y que no hay límite, cómo desistir, qué ocurre después de enviar, cuánto tiempo se guardan los datos, los riesgos, los beneficios y quién responde por la investigación. El cuestionario repite el tiempo encima de la instrucción | Visibilidad del estado del sistema (Nielsen 1), LGPD art. 9º |
| Los menores de 18 años solo participan si confirman la autorización de su responsable legal | LGPD art. 14 |

### 4.2 Pantallas del investigador

| Requisito | Principio |
|---|---|
| Enlace "Saltar al contenido" como primer elemento enfocable | Evitar bloques (2.4.1) |
| Una jerarquía de encabezados real (un `h1` por página, `h2` por sección) | Encabezados y etiquetas (2.4.6), 1.3.1 |
| Formularios: etiqueta visible encima del campo, vinculada por `for`/`id`, `autocomplete` correcto (`email`, `current-password`, `new-password`, `name`) | 1.3.5, 3.3.2 |
| El inicio de sesión acepta pegar la contraseña y el gestor de contraseñas. Botón "Mostrar contraseña" | Autenticación accesible (3.3.8) |
| Al crear un estudio, no volver a pedir lo que ya se ha dicho (el nombre del producto se convierte en la sugerencia del nombre de la primera versión) | Entrada redundante (3.3.7) |
| Eliminar un estudio: confirmación escribiendo el título y mostrando cuántas respuestas se perderán. Cerrar la recogida es reversible (Reabrir) | Prevención de errores (Nielsen 5, WCAG 3.3.4), reversión fácil de las acciones (Shneiderman 6) |
| Salir y toda eliminación se confirman en una ventana (`<dialog>` nativo) que dice lo que va a ocurrir, con Cancelar al lado. Foco retenido dentro, Esc cierra sin hacer nada y el foco vuelve a quien la abrió | Prevención de errores (Nielsen 5), control y libertad del usuario (Nielsen 3), 2.1.2, 2.4.3, 3.3.4 |
| Entrar y Crear cuenta se abren en una ventana sobre la página actual, sin perder el lugar, y caben en la pantalla sin desplazarse | Control y libertad del usuario (Nielsen 3), carga de memoria (Shneiderman 8), 1.4.10 |
| Toda acción da una respuesta visible y anunciada: "Recogida abierta. El enlace ya acepta respuestas." en una región `role="status"`, que acompaña el desplazamiento y permanece hasta que la persona la cierra | Retroalimentación (Norman, Shneiderman 3), 4.1.3, 2.2.1 |
| Mientras la acción se ejecuta, el botón dice lo que está ocurriendo y bloquea nuevos clics, para que nada se envíe dos veces | Visibilidad del estado del sistema (Nielsen 1), prevención de errores (Nielsen 5), 4.1.3 |
| Estado del estudio escrito, siempre en el mismo lugar, con la consecuencia ("Abierto · aceptando respuestas") | Visibilidad del estado del sistema (Nielsen 1) |
| Términos del UEQ con el nombre oficial y una explicación breve accesible mediante `<details>` ("¿Qué es la Perspicuidad?") | Correspondencia entre el sistema y el mundo real (Nielsen 2), ayuda y documentación (Nielsen 10), revelación progresiva |
| Mismo patrón de botón, tabla y mensaje en todas las pantallas | Consistencia y estándares (Nielsen 4, Shneiderman 1) |
| Ninguna información depende del hover. Si hay tooltip, también se abre con el foco, puede cerrarse con Esc y no desaparece al mover el ratón sobre él | Contenido con hover o foco (1.4.13), reconocer antes que recordar (Nielsen 6) |

| Ayuda (?) en cada página del investigador: para qué sirve la página y qué se puede hacer en ella | Ayuda y documentación (Nielsen 10), autodescriptividad (ISO 9241-110) |
| Recorrido en el primer acceso, hecho sobre las pantallas reales, que se puede saltar, cerrar y repasar | Facilidad de aprendizaje (ISO 9241-110), control y libertad del usuario (Nielsen 3), Nielsen 10 |
| Campana con las no leídas en número y en texto, que agrupa las respuestas mientras el aviso no se lee. El aviso también puede llegar por correo electrónico, y eso se desactiva en Mi cuenta | Visibilidad del estado del sistema (Nielsen 1), carga de memoria (Shneiderman 8), control del usuario (Shneiderman 7) |
| Compartir dice lo que puede hacer cada rol (Editor, Lector) antes de la invitación. Quien no puede realizar una acción no ve su botón | Prevención de errores (Nielsen 5), diseño estético y minimalista (Nielsen 8) |
| Administración y Mi cuenta como paneles: cada opción muestra la situación actual y lleva a una página propia | Reconocer antes que recordar (Nielsen 6), Ley de Hick, revelación progresiva |
| Política de privacidad a un clic: en las ventanas de acceso, en la página de inicio, en Mi cuenta y en la ayuda. El "Volver" dice adónde va y la política se abre en otra pestaña cuando hay un formulario rellenado | Control y libertad del usuario (Nielsen 3), Shneiderman 7, transparencia (LGPD, art. 9º) |
| Interfaz en el idioma de la cuenta, elegido al crear la cuenta y cambiado en Mi cuenta. `lang` y `dir` siguen el idioma en que la pantalla se muestra realmente | Usabilidad universal (Shneiderman 2), 3.1.1 |

La documentación sigue el mismo principio de carga: un documento largo se abre como índice, cada sección en una página propia con Volver y Anterior/Siguiente, y el diagrama cabe en la pantalla (revelación progresiva, Nielsen 3 y 8, WCAG 2.4.5 y 2.4.8).

### 4.3 Panel de resultados y gráficos

| Requisito | Principio |
|---|---|
| Todo gráfico tiene `role="img"`, `<title>` y `<desc>` con la lectura en texto ("Atractivo: media 1,42, IC de 1,10 a 1,74, franja Bueno") y una tabla equivalente visible justo debajo | Contenido no textual (1.1.1), 1.3.1 |
| Escalas distinguidas por forma y posición, no solo por color. Versiones en la comparación: círculo lleno, círculo hueco, cuadrado, además del color | Uso del color (1.4.1), probado con simulación de daltonismo |
| Marcadores y líneas del gráfico con contraste ≥ 3:1 contra el fondo y contra las franjas del benchmark | Contraste no textual (1.4.11) |
| Franjas del benchmark con etiqueta de texto, no solo un tono de fondo | 1.4.1 |
| Escalas agrupadas en Atractivo / Pragmática / Hedónica con espacio y etiqueta de grupo | Gestalt (proximidad, región común), modelo conceptual del UEQ |
| La interpretación aparece escrita junto al número ("positivo", "Bueno en el benchmark"). El investigador no necesita recordar los umbrales | Reconocer antes que recordar (Nielsen 6), Shneiderman 8 |
| Las alertas de alfa bajo y de muestra pequeña explican qué significan y qué hacer | Nielsen 9 y 10 |
| Filtros y modo de comparación reflejados en la URL (se puede volver, recargar y compartir) | Control y libertad del usuario (Nielsen 3) |
| Excluir respuestas del análisis se puede deshacer y el panel muestra cuántas están fuera | Shneiderman 6, Nielsen 1 |
| Datos demográficos en una subpestaña propia de Resultados, cada pregunta con el gráfico que le corresponde, y la tabla de números en "Ver los números" | Gestalt, 1.1.1, revelación progresiva |

### 4.4 Exportación
- Cada enlace de exportación indica el formato, el contenido y para qué sirve. La descarga no se abre en una pestaña nueva sin avisar
- Nombre de archivo legible y con fecha

## 5. Lista de verificación WCAG 2.2 AA (criterios más relevantes aquí)

La tabla indica cómo cumple la herramienta cada criterio y qué lo demuestra. El axe-core se ejecuta en cada pantalla y en cada estado de error de las pruebas de extremo a extremo; lo que no alcanza está en los casos manuales ([lista de verificación manual](checklist-manual.md)).

### Perceptible

| Criterio | Cómo lo cumple la herramienta | Evidencia |
|---|---|---|
| 1.1.1 Gráficos e iconos con alternativa textual | Todo gráfico tiene descripción y una tabla visible con los mismos números; los iconos decorativos quedan fuera del árbol de accesibilidad | [CT-E29](documentacao/casos-de-teste.md#ct-e29), [CT-M05](documentacao/casos-de-teste.md#ct-m05) |
| 1.3.1 Estructura semántica | Cada ítem del cuestionario es un `fieldset` con `legend`; tablas con `th` y `scope`; encabezados en orden | [CT-E24](documentacao/casos-de-teste.md#ct-e24), [CT-E21](documentacao/casos-de-teste.md#ct-e21) y el axe-core en cada pantalla |
| 1.3.2 Orden de lectura igual al orden visual | El DOM sigue el orden de la pantalla, también de derecha a izquierda | [CT-E22](documentacao/casos-de-teste.md#ct-e22), [CT-E46](documentacao/casos-de-teste.md#ct-e46), [CT-M07](documentacao/casos-de-teste.md#ct-m07) |
| 1.3.5 `autocomplete` en los datos personales | Nombre, correo electrónico y contraseña tienen `autocomplete` en Crear cuenta, Entrar, Mi cuenta y en el formulario del estudio | axe-core en [CT-E06](documentacao/casos-de-teste.md#ct-e06), [CT-E09](documentacao/casos-de-teste.md#ct-e09) |
| 1.4.1 Nada se comunica solo con el color | Estado, franjas y versiones tienen texto, forma o patrón además del color | [CT-E32](documentacao/casos-de-teste.md#ct-e32), [CT-M09](documentacao/casos-de-teste.md#ct-m09) |
| 1.4.3 Contraste de texto ≥ 4,5:1 | Se mide cada par de colores de texto del tema | [CT-U51](documentacao/casos-de-teste.md#ct-u51) |
| 1.4.4 Zoom del 200 % sin pérdida | Las pantallas usan unidades relativas y se reajustan | [CT-M08](documentacao/casos-de-teste.md#ct-m08) |
| 1.4.10 Reajuste del contenido en 320 px | Ninguna pantalla se desplaza en horizontal en 320 px | [CT-E25](documentacao/casos-de-teste.md#ct-e25), [CT-E31](documentacao/casos-de-teste.md#ct-e31), [CT-E36](documentacao/casos-de-teste.md#ct-e36), [CT-E44](documentacao/casos-de-teste.md#ct-e44), [CT-E50](documentacao/casos-de-teste.md#ct-e50), [CT-E75](documentacao/casos-de-teste.md#ct-e75) |
| 1.4.11 Contraste de elementos ≥ 3:1 | Los bordes de los campos, los círculos, el foco y los marcadores del gráfico se miden contra los fondos | [CT-U52](documentacao/casos-de-teste.md#ct-u52) |
| 1.4.12 Espaciado del texto | El diseño soporta line-height 1,5 y letter-spacing 0,12em | [CT-M11](documentacao/casos-de-teste.md#ct-m11) |
| 1.4.13 Contenido con hover o foco | Las explicaciones de los términos se abren con un clic (`details`), no con hover | [CT-M07](documentacao/casos-de-teste.md#ct-m07) |

### Operable

| Criterio | Cómo lo cumple la herramienta | Evidencia |
|---|---|---|
| 2.1.1 y 2.1.2 Teclado, sin trampas para el foco | Todo flujo funciona solo con el teclado; las ventanas retienen el foco y lo devuelven al cerrarse | [CT-E03](documentacao/casos-de-teste.md#ct-e03), [CT-E22](documentacao/casos-de-teste.md#ct-e22), [CT-E55](documentacao/casos-de-teste.md#ct-e55), [CT-E58](documentacao/casos-de-teste.md#ct-e58), [CT-E64](documentacao/casos-de-teste.md#ct-e64), [CT-M07](documentacao/casos-de-teste.md#ct-m07) |
| 2.2.1 Sin límite de tiempo | Ninguna pantalla tiene tiempo; el cuestionario guarda lo marcado si la página se recarga | [CT-E26](documentacao/casos-de-teste.md#ct-e26) |
| 2.4.1 Evitar bloques | "Saltar al contenido" es el primer elemento enfocable | [CT-E02](documentacao/casos-de-teste.md#ct-e02) |
| 2.4.2 Titulado de páginas | Cada página tiene un título propio, de lo específico a lo general | [CT-E47](documentacao/casos-de-teste.md#ct-e47), [CT-E84](documentacao/casos-de-teste.md#ct-e84) |
| 2.4.3 Orden del foco | Después de un error, el foco va al resumen y cada enlace del resumen lleva al campo | [CT-E07](documentacao/casos-de-teste.md#ct-e07), [CT-E23](documentacao/casos-de-teste.md#ct-e23) |
| 2.4.6 Encabezados y etiquetas descriptivos | Las etiquetas dicen lo que piden; los encabezados dicen lo que contiene la sección | axe-core en cada pantalla y [CT-M13](documentacao/casos-de-teste.md#ct-m13) |
| 2.4.7 Foco visible | Anillo de foco con contraste de 3:1 en todos los elementos | [CT-E22](documentacao/casos-de-teste.md#ct-e22), [CT-U52](documentacao/casos-de-teste.md#ct-u52) |
| 2.4.11 Foco no oculto | La barra superior y el pie fijos nunca ocultan el foco ni las anclas | [CT-E54](documentacao/casos-de-teste.md#ct-e54) |
| 2.5.3 Etiqueta en el nombre | El nombre accesible de cada botón empieza por el texto que aparece en él | axe-core en cada pantalla |
| 2.5.8 Objetivos ≥ 24 × 24 px | Cada círculo del cuestionario mide 44 × 44 px | [CT-M12](documentacao/casos-de-teste.md#ct-m12) |

### Comprensible

| Criterio | Cómo lo cumple la herramienta | Evidencia |
|---|---|---|
| 3.1.1 Idioma de la página | `lang` y `dir` siguen el idioma elegido, también en los textos del estudio sin traducción | [CT-E45](documentacao/casos-de-teste.md#ct-e45), [CT-E46](documentacao/casos-de-teste.md#ct-e46), [CT-U48](documentacao/casos-de-teste.md#ct-u48) |
| 3.2.1 y 3.2.2 Sin cambios de contexto por sí solos | Cambiar el idioma solo surte efecto después de "Aplicar"; ningún campo envía al cambiar | [CT-E46](documentacao/casos-de-teste.md#ct-e46), [CT-E68](documentacao/casos-de-teste.md#ct-e68) |
| 3.2.3 y 3.2.4 Navegación coherente | La misma barra y los mismos componentes en todas las pantallas | [CT-E53](documentacao/casos-de-teste.md#ct-e53), [CT-M18](documentacao/casos-de-teste.md#ct-m18) |
| 3.3.1 y 3.3.3 Error en texto, con sugerencia | Cada error dice qué ocurrió y qué hacer, en el resumen y en el campo | [CT-E06](documentacao/casos-de-teste.md#ct-e06), [CT-E14](documentacao/casos-de-teste.md#ct-e14), [CT-E23](documentacao/casos-de-teste.md#ct-e23), [CT-E43](documentacao/casos-de-teste.md#ct-e43) |
| 3.3.2 Etiquetas visibles | Todo campo tiene una etiqueta visible encima | axe-core en cada pantalla |
| 3.3.4 Acciones destructivas confirmadas o reversibles | Salir y eliminar piden confirmación; sacar del análisis es reversible | [CT-E11](documentacao/casos-de-teste.md#ct-e11), [CT-E19](documentacao/casos-de-teste.md#ct-e19), [CT-E27](documentacao/casos-de-teste.md#ct-e27), [CT-E34](documentacao/casos-de-teste.md#ct-e34) |
| 3.3.7 No pedir la misma información dos veces | El estudio nuevo viene con el responsable de la cuenta y del último estudio | [CT-E93](documentacao/casos-de-teste.md#ct-e93) |
| 3.3.8 Inicio de sesión sin prueba cognitiva | Sin captcha; pegar la contraseña funciona y Mostrar contraseña alterna la visibilidad | [CT-E08](documentacao/casos-de-teste.md#ct-e08) |

### Robusto

| Criterio | Cómo lo cumple la herramienta | Evidencia |
|---|---|---|
| 4.1.2 Componentes nativos | Botones de opción, botones, `details` y `dialog` nativos; ARIA solo donde el HTML no lo resuelve | [CT-E24](documentacao/casos-de-teste.md#ct-e24), [CT-E57](documentacao/casos-de-teste.md#ct-e57) |
| 4.1.3 Mensajes de estado | Confirmaciones en `role="status"`, anunciadas sin mover el foco | [CT-E09](documentacao/casos-de-teste.md#ct-e09), [CT-E16](documentacao/casos-de-teste.md#ct-e16), [CT-M06](documentacao/casos-de-teste.md#ct-m06) |

### Más allá del AA

| Criterio | Cómo lo cumple la herramienta | Evidencia |
|---|---|---|
| `prefers-reduced-motion` | Las transiciones desaparecen cuando el sistema pide menos movimiento | `src/app/globals.css` |
| `forced-colors` (alto contraste de Windows) | Los círculos, el foco y los gráficos siguen visibles | [CT-E32](documentacao/casos-de-teste.md#ct-e32), [CT-M10](documentacao/casos-de-teste.md#ct-m10) |
| Tema oscuro | No lo hay: la identidad visual es la de un instrumento de laboratorio, sobre fondo claro ([Identidad visual](design.md)) | — |
| Lenguaje sencillo en el cuestionario | Frases cortas, voz activa, sin jerga | [CT-M13](documentacao/casos-de-teste.md#ct-m13), [CT-M14](documentacao/casos-de-teste.md#ct-m14) |

## 6. Cómo verificar (la automatización no basta)

Las herramientas automáticas solo detectan una parte de los problemas de accesibilidad. Por eso:

1. **Automático:** axe-core en Playwright en todas las pantallas y estados de error, prueba de contraste de los tokens, pruebas e2e solo con teclado, en 320 px, con daltonismo simulado y con alto contraste
2. **Manual (equipo):** `docs/checklist-manual.md`, con lector de pantalla, zoom, móvil real y simulación de daltonismo
3. **Evaluación heurística (equipo):** los tres evalúan por separado con las 10 heurísticas de Nielsen y después consolidan con una severidad de 0 a 4
4. **Prueba con usuarios:** 5 participantes externos al trío responden un estudio real en la herramienta (tarea del participante) y 2 o 3 compañeros hacen el papel de investigador (crear un estudio, interpretar el panel, exportar). Pensamiento en voz alta, tasa de éxito, tiempo y errores. Al final, los investigadores evalúan la propia herramienta **con el UEQ, aplicado por la herramienta**. Esto cierra el ciclo y se convierte en la mejor diapositiva de la presentación

## 7. Referencias

- ABNT. NBR 17225:2025. Acessibilidade em conteúdo e aplicações web: requisitos. 2025.
- BRASIL. Lei nº 13.146, de 6 de julho de 2015 (Lei Brasileira de Inclusão). Art. 63.
- BRASIL. eMAG: Modelo de Acessibilidade em Governo Eletrônico, versão 3.1.
- BRASIL. Lei nº 13.709, de 14 de agosto de 2018 (Lei Geral de Proteção de Dados Pessoais).
- ISO 9241-11:2018. Ergonomics of human-system interaction: Usability: Definitions and concepts.
- ISO 9241-110:2020. Ergonomics of human-system interaction: Interaction principles.
- NIELSEN, J. Enhancing the explanatory power of usability heuristics. CHI 1994.
- NORMAN, D. The Design of Everyday Things. Revised and expanded edition. Basic Books, 2013.
- SHNEIDERMAN, B. et al. Designing the User Interface. 6th ed. Pearson, 2016.
- W3C. Web Content Accessibility Guidelines (WCAG) 2.2. 2023.
- LAUGWITZ, B.; HELD, T.; SCHREPP, M. Construction and evaluation of a user experience questionnaire. USAB 2008.
- SCHREPP, M. User Experience Questionnaire Handbook. ueq-online.org.
