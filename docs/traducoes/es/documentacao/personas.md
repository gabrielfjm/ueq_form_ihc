# Personas

Ocho personas representan a quienes usan la Herramienta UEQ: tres del lado del investigador, cuatro del lado del participante y una de quien mantiene la instalación.

Son ficticias. Se construyeron a partir del perfil de usuarios y del contexto de uso de [Fundamentos de IHC §2](../ihc.md#2-usuários-e-contexto-de-uso-iso-9241-11), que sigue la ISO 9241-11, y cubren los extremos que más cambian el diseño de una pantalla: quien nunca ha calculado estadística, quien solo confía en la hoja oficial, quien no lee portugués, quien responde desde el móvil con la fuente ampliada, quien usa lector de pantalla, quien lee de derecha a izquierda, quien tiene menos de 18 años y quien necesita tocar el código.

Cada persona señala las [historias de usuario](historias-de-usuario.md) escritas a partir de ella. La [matriz de trazabilidad](matriz-rastreabilidade.md) vincula cada requisito con las personas que lo piden.

| ID | Persona | Rol | Uso principal |
|---|---|---|---|
| [PE01](#pe01) | Marina | Investigadora, estudiante de máster en IHC | Monta el estudio, sigue la recogida e interpreta el panel |
| [PE02](#pe02) | Ricardo | Profesor y director de tesis | Sigue el estudio de sus tesistas, compara versiones y verifica los números en la hoja oficial |
| [PE03](#pe03) | Kenji | Investigador visitante, lee en japonés | Usa la herramienta y aplica el estudio en su propio idioma |
| [PE04](#pe04) | Célia | Participante desde el móvil | Responde mediante el enlace recibido por WhatsApp |
| [PE05](#pe05) | Tiago | Participante con lector de pantalla | Responde solo con teclado y NVDA |
| [PE06](#pe06) | Amira | Participante que lee en árabe | Responde en su propio idioma, de derecha a izquierda |
| [PE07](#pe07) | Bruna | Participante menor de edad | Participa en un estudio en la escuela, con autorización de sus padres |
| [PE08](#pe08) | Lucas | Desarrollador y administrador de la instalación | Instala, ajusta el protocolo, administra las cuentas y demuestra que nada se ha roto |

## Investigadores

### PE01

**Marina, 26 años, estudiante de máster en IHC.** Persona principal.

- **Contexto.** Está en el primer año del máster y va a evaluar con el UEQ dos versiones de la aplicación de citas de la clínica universitaria. Conoce UX y ya ha respondido cuestionarios, pero nunca ha calculado un alfa de Cronbach. Usa el portátil, en sesiones cortas entre clases, y abre el panel varias veces al día durante la recogida.
- **Objetivos.** Crear el estudio sin equivocarse, enviar el enlace al grupo de WhatsApp de los pacientes, saber cuántas personas han respondido ya, entender el resultado y llevar tablas y gráficos a la tesis de máster.
- **Frustraciones.** Hojas de cálculo en las que un copiar y pegar erróneo lo estropea todo. Formularios genéricos que no respetan el orden y la polaridad del UEQ. Estadística presentada sin explicación. Tener que redactar desde cero el formulario de consentimiento.
- **Lo que necesita de la herramienta.** Interpretación escrita junto a cada número, una explicación breve de los términos técnicos, avisos que dicen qué hacer, un formulario de consentimiento que ya pide lo que exige la ética y exportaciones que se abren directamente en Excel.

> "Quiero saber si la versión nueva es mejor, no convertirme en experta en estadística."

Historias: [HU01](historias-de-usuario.md#hu01), [HU02](historias-de-usuario.md#hu02), [HU03](historias-de-usuario.md#hu03), [HU04](historias-de-usuario.md#hu04), [HU05](historias-de-usuario.md#hu05), [HU06](historias-de-usuario.md#hu06), [HU07](historias-de-usuario.md#hu07), [HU08](historias-de-usuario.md#hu08), [HU09](historias-de-usuario.md#hu09), [HU10](historias-de-usuario.md#hu10), [HU11](historias-de-usuario.md#hu11), [HU12](historias-de-usuario.md#hu12), [HU13](historias-de-usuario.md#hu13), [HU14](historias-de-usuario.md#hu14), [HU15](historias-de-usuario.md#hu15), [HU16](historias-de-usuario.md#hu16), [HU17](historias-de-usuario.md#hu17).

### PE02

**Ricardo, 48 años, profesor y director de tesis.**

- **Contexto.** Dirige a cuatro estudiantes que usan el UEQ, entre ellos Marina. Conoce el handbook y la UEQ Data Analysis Tool y confía en ellos. Trabaja en los ordenadores del laboratorio, que son compartidos. A veces tiene respuestas recogidas en papel, en eventos con poco tiempo para cada persona.
- **Objetivos.** Seguir el estudio de cada tesista sin pedir capturas de pantalla, comparar versiones de un producto, comprobar que los números coinciden con la hoja oficial antes de firmar un artículo y unir las respuestas en papel a las del enlace.
- **Frustraciones.** Herramientas que calculan "a su manera" sin decir la regla. Tener que rehacer filtros para discutir un resultado. Dejar la sesión abierta en un ordenador compartido.
- **Lo que necesita de la herramienta.** Acceso de lectura al estudio del estudiante, exportación en el formato exacto de la hoja oficial, reglas de sospecha y de cálculo visibles, una dirección que conserva la vista del panel, importación con vista previa y un cambio de contraseña que cierra las demás sesiones.

> "Si no coincide con la hoja oficial, no va al artículo."

Historias: [HU18](historias-de-usuario.md#hu18), [HU19](historias-de-usuario.md#hu19), [HU20](historias-de-usuario.md#hu20), [HU21](historias-de-usuario.md#hu21), [HU22](historias-de-usuario.md#hu22), [HU23](historias-de-usuario.md#hu23), [HU24](historias-de-usuario.md#hu24), [HU25](historias-de-usuario.md#hu25).

### PE03

**Kenji, 35 años, investigador visitante de una universidad japonesa.**

- **Contexto.** Pasa un semestre en el laboratorio de Ricardo. Lee portugués despacio y trabaja mejor en japonés. Va a aplicar el UEQ en un estudio con participantes en Japón, sobre una aplicación de transporte.
- **Objetivos.** Usar la herramienta en su propio idioma y montar un estudio cuyo enlace se abra en japonés, con los términos oficiales del UEQ.
- **Frustraciones.** Una interfaz que solo existe en inglés o en portugués. Una traducción que cambia el nombre de los botones de una pantalla a otra.
- **Lo que necesita de la herramienta.** Un selector de idioma siempre a la vista, una traducción coherente de la interfaz, un estudio escrito en su idioma y el título traducido para quien responde en otro idioma.

> "Yo entiendo la estadística. Solo necesito leer la pantalla."

Historias: [HU26](historias-de-usuario.md#hu26), [HU27](historias-de-usuario.md#hu27).

## Participantes

### PE04

**Célia, 63 años, jubilada, paciente de la clínica universitaria.**

- **Contexto.** Recibe el enlace por WhatsApp y lo abre en el móvil, con la fuente del sistema ampliada. Usa el móvil para mensajes y para el banco, pero desconfía de los formularios. No tiene cuenta en la herramienta ni ninguna obligación de responder.
- **Objetivos.** Entender rápido de qué se trata y quién lo pide, responder en pocos minutos y volver a lo que estaba haciendo.
- **Frustraciones.** Botones pequeños, preguntas que desaparecen cuando la página se recarga, un formulario que no dice qué faltó, peticiones de datos personales.
- **Lo que necesita de la herramienta.** Un formulario de consentimiento breve y claro, que diga quién responde por la investigación; zonas táctiles grandes; progreso visible; aviso de ítem olvidado con enlace directo; poder desistir y saltarse los datos sobre ella.

> "Si no lo entiendo en un minuto, lo cierro."

Historias: [HU28](historias-de-usuario.md#hu28), [HU29](historias-de-usuario.md#hu29), [HU30](historias-de-usuario.md#hu30), [HU31](historias-de-usuario.md#hu31), [HU32](historias-de-usuario.md#hu32), [HU33](historias-de-usuario.md#hu33), [HU34](historias-de-usuario.md#hu34).

### PE05

**Tiago, 29 años, analista de sistemas, ciego.**

- **Contexto.** Usa Windows con NVDA y navega solo con el teclado. Responde encuestas de UX con frecuencia y ya ha abandonado muchas porque los botones eran `div` sin nombre.
- **Objetivos.** Responder con la misma precisión que quien ve, sabiendo en cada círculo la posición y a qué polo está más cerca.
- **Frustraciones.** Una escala sin etiquetas ("botón, botón, botón"), un anuncio de progreso en cada clic, un foco que salta solo, un error que solo aparece en rojo.
- **Lo que necesita de la herramienta.** Cada ítem como grupo con leyenda, botones de opción nativos con nombre accesible ("3 de 7, más cerca de fácil"), un progreso anunciado sin interrumpir y un resumen de errores que recibe el foco.

> "Si el lector de pantalla solo dice 'botón de opción, 3 de 7', no sé qué estoy respondiendo."

Historias: [HU35](historias-de-usuario.md#hu35).

### PE06

**Amira, 34 años, estudiante de intercambio, lee en árabe.**

- **Contexto.** Pasa un semestre en Brasil y habla poco portugués. El navegador de su móvil está en árabe. Participa en el estudio de un compañero de laboratorio.
- **Objetivos.** Responder en su propio idioma, con los términos que el UEQ validó en árabe.
- **Frustraciones.** Una traducción automática que cambia el sentido del término. Una página en árabe con la escala invertida.
- **Lo que necesita de la herramienta.** El idioma elegido según el navegador, el texto de derecha a izquierda con la escala en el orden oficial y un aviso honesto de que la traducción árabe no ha sido aprobada por los autores del UEQ.

> "Respondo mejor cuando leo en mi lengua."

Historias: [HU36](historias-de-usuario.md#hu36).

### PE07

**Bruna, 16 años, estudiante de educación media.**

- **Contexto.** Su escuela participa en un estudio sobre la plataforma de tareas que usan los alumnos. Responde desde el móvil, en el recreo, con el enlace que envió la profesora.
- **Objetivos.** Participar como sus compañeros, sin complicaciones.
- **Frustraciones.** Un formulario que se bloquea sin explicar por qué.
- **Lo que necesita de la herramienta.** Un formulario de consentimiento que pregunte la edad antes de empezar y diga con claridad que quien tiene menos de 18 años necesita la autorización de su responsable legal, sin guardar nada antes de eso.

> "Mis padres ya firmaron la autorización de la escuela. ¿Dónde lo confirmo?"

Historias: [HU37](historias-de-usuario.md#hu37).

## Quién mantiene la herramienta

### PE08

**Lucas, 31 años, desarrollador e investigador en ingeniería de software.**

- **Contexto.** Encontró el repositorio porque su grupo también usa el UEQ. Conoce TypeScript y Next.js. Instaló la herramienta para el laboratorio y es el administrador de la instalación: crea las cuentas de los estudiantes y presenta la herramienta en las clases.
- **Objetivos.** Poner en marcha la herramienta en local en minutos, entender la arquitectura, cambiar un umbral sin buscar números por el código, demostrar que no ha roto el cálculo y saber si la instalación está lista para un estudio real.
- **Frustraciones.** Un proyecto académico sin instrucciones de instalación, reglas de negocio dispersas por la interfaz, pruebas que no existen, documentación que no dice qué código implementa qué.
- **Lo que necesita de la herramienta.** Un README con el paso a paso, los parámetros del protocolo en JSON con su fuente, el cálculo aislado en funciones puras con pruebas, una página de administración que muestre el estado de la instalación sin dar acceso a los estudios de los demás, y documentación que vincule cada requisito con el código.

> "Antes de tocar nada, necesito saber qué garantiza esta línea."

Historias: [HU38](historias-de-usuario.md#hu38), [HU39](historias-de-usuario.md#hu39), [HU40](historias-de-usuario.md#hu40), [HU41](historias-de-usuario.md#hu41), [HU42](historias-de-usuario.md#hu42), [HU43](historias-de-usuario.md#hu43), [HU44](historias-de-usuario.md#hu44).
