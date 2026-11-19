# Historias de usuario

**44 historias** dicen lo que cada [persona](personas.md) quiere hacer con la Herramienta UEQ y cómo saber que ha salido bien. Las 44 están entregadas. La misma lista está en [historias-de-usuario.csv](historias-de-usuario.csv) y en la [hoja de requisitos](planilha-requisitos.xlsx).

## Cómo leer

Cada historia sigue el formato **Como** (quién), **quiero** (qué), **para** (por qué), escrito desde el punto de vista de la persona. Los **criterios de aceptación** dicen lo que tiene que ocurrir en la herramienta para dar la historia por terminada: cada criterio puede verificarse en la pantalla o en un caso de prueba.

La historia está **entregada** cuando todos los requisitos que cita están entregados. La relación de cada requisito con las historias, los casos de uso y las pruebas está en la [matriz de trazabilidad](matriz-rastreabilidade.md).

| ID | Persona | Historia | Requisitos | Estado |
|---|---|---|---|---|
| [HU01](#hu01) | [PE01](personas.md#pe01) Marina | Crear una cuenta y entrar | [RF01](requisitos.md#rf01), [RF02](requisitos.md#rf02), [RF11](requisitos.md#rf11) | Entregado |
| [HU02](#hu02) | [PE01](personas.md#pe01) Marina | Aprender a usarla en el primer acceso | [RF09](requisitos.md#rf09), [RF10](requisitos.md#rf10) | Entregado |
| [HU03](#hu03) | [PE01](personas.md#pe01) Marina | Crear un estudio con dos versiones | [RF13](requisitos.md#rf13), [RF19](requisitos.md#rf19) | Entregado |
| [HU04](#hu04) | [PE01](personas.md#pe01) Marina | Indicar quién responde por la investigación | [RF13](requisitos.md#rf13), [RF25](requisitos.md#rf25) | Entregado |
| [HU05](#hu05) | [PE01](personas.md#pe01) Marina | Decidir si recojo datos demográficos | [RF18](requisitos.md#rf18), [RNF13](requisitos.md#rnf13), [RNF14](requisitos.md#rnf14) | Entregado |
| [HU06](#hu06) | [PE01](personas.md#pe01) Marina | Abrir la recogida y enviar el enlace | [RF15](requisitos.md#rf15), [RF16](requisitos.md#rf16), [RNF20](requisitos.md#rnf20) | Entregado |
| [HU07](#hu07) | [PE01](personas.md#pe01) Marina | Seguir la recogida | [RF12](requisitos.md#rf12), [RF22](requisitos.md#rf22) | Entregado |
| [HU08](#hu08) | [PE01](personas.md#pe01) Marina | Entender el resultado sin ser estadística | [RF38](requisitos.md#rf38), [RF43](requisitos.md#rf43), [RF44](requisitos.md#rf44), [RF45](requisitos.md#rf45), [RF49](requisitos.md#rf49), [RNF07](requisitos.md#rnf07), [RNF08](requisitos.md#rnf08) | Entregado |
| [HU09](#hu09) | [PE01](personas.md#pe01) Marina | Ver qué ítems arrastraron la escala | [RF41](requisitos.md#rf41), [RF46](requisitos.md#rf46) | Entregado |
| [HU10](#hu10) | [PE01](personas.md#pe01) Marina | Comparar las dos versiones | [RF26](requisitos.md#rf26), [RF47](requisitos.md#rf47), [RF48](requisitos.md#rf48) | Entregado |
| [HU11](#hu11) | [PE01](personas.md#pe01) Marina | Llevar los resultados a la tesis de máster | [RF58](requisitos.md#rf58), [RF60](requisitos.md#rf60), [RNF22](requisitos.md#rnf22) | Entregado |
| [HU12](#hu12) | [PE01](personas.md#pe01) Marina | Quitar del análisis las respuestas descuidadas | [RF42](requisitos.md#rf42), [RF51](requisitos.md#rf51), [RF52](requisitos.md#rf52), [RF53](requisitos.md#rf53), [RF54](requisitos.md#rf54) | Entregado |
| [HU13](#hu13) | [PE01](personas.md#pe01) Marina | Ver el perfil de quienes respondieron | [RF50](requisitos.md#rf50) | Entregado |
| [HU14](#hu14) | [PE01](personas.md#pe01) Marina | Cerrar y reabrir la recogida | [RF15](requisitos.md#rf15) | Entregado |
| [HU15](#hu15) | [PE01](personas.md#pe01) Marina | Corregir el estudio después de crearlo | [RF14](requisitos.md#rf14) | Entregado |
| [HU16](#hu16) | [PE01](personas.md#pe01) Marina | Eliminar un estudio de prueba | [RF17](requisitos.md#rf17), [RNF21](requisitos.md#rnf21) | Entregado |
| [HU17](#hu17) | [PE01](personas.md#pe01) Marina | Gestionar los datos de mi cuenta | [RF04](requisitos.md#rf04), [RF06](requisitos.md#rf06), [RF07](requisitos.md#rf07), [RNF19](requisitos.md#rnf19) | Entregado |
| [HU18](#hu18) | [PE02](personas.md#pe02) Ricardo | Verificar los números en la hoja oficial | [RF36](requisitos.md#rf36), [RF37](requisitos.md#rf37), [RF59](requisitos.md#rf59), [RNF09](requisitos.md#rnf09), [RNF11](requisitos.md#rnf11) | Entregado |
| [HU19](#hu19) | [PE02](personas.md#pe02) Ricardo | Unir respuestas recogidas en papel | [RF61](requisitos.md#rf61) | Entregado |
| [HU20](#hu20) | [PE02](personas.md#pe02) Ricardo | Seguir el estudio de su tesista | [RF20](requisitos.md#rf20), [RF21](requisitos.md#rf21), [RNF17](requisitos.md#rnf17) | Entregado |
| [HU21](#hu21) | [PE02](personas.md#pe02) Ricardo | Saber qué ha cambiado en los estudios | [RF22](requisitos.md#rf22), [RF23](requisitos.md#rf23) | Entregado |
| [HU22](#hu22) | [PE02](personas.md#pe02) Ricardo | Proteger la cuenta en un ordenador compartido | [RF03](requisitos.md#rf03), [RF05](requisitos.md#rf05), [RNF15](requisitos.md#rnf15), [RNF16](requisitos.md#rnf16), [RNF18](requisitos.md#rnf18) | Entregado |
| [HU23](#hu23) | [PE02](personas.md#pe02) Ricardo | Exportar las respuestas para otro análisis | [RF56](requisitos.md#rf56), [RF57](requisitos.md#rf57), [RNF22](requisitos.md#rnf22) | Entregado |
| [HU24](#hu24) | [PE02](personas.md#pe02) Ricardo | Conocer la regla de cada número | [RF37](requisitos.md#rf37), [RF38](requisitos.md#rf38), [RF39](requisitos.md#rf39), [RF40](requisitos.md#rf40) | Entregado |
| [HU25](#hu25) | [PE02](personas.md#pe02) Ricardo | Aplicar la versión corta en eventos | [RF62](requisitos.md#rf62) | Entregado |
| [HU26](#hu26) | [PE03](personas.md#pe03) Kenji | Usar la herramienta en japonés | [RF08](requisitos.md#rf08) | Entregado |
| [HU27](#hu27) | [PE03](personas.md#pe03) Kenji | Aplicar el estudio en japonés | [RF19](requisitos.md#rf19), [RF34](requisitos.md#rf34), [RF35](requisitos.md#rf35) | Entregado |
| [HU28](#hu28) | [PE04](personas.md#pe04) Célia | Entender la invitación antes de aceptar | [RF25](requisitos.md#rf25), [RNF19](requisitos.md#rnf19) | Entregado |
| [HU29](#hu29) | [PE04](personas.md#pe04) Célia | Responder rápido desde el móvil | [RF24](requisitos.md#rf24), [RF27](requisitos.md#rf27), [RF28](requisitos.md#rf28), [RNF02](requisitos.md#rnf02), [RNF05](requisitos.md#rnf05), [RNF06](requisitos.md#rnf06), [RNF23](requisitos.md#rnf23) | Entregado |
| [HU30](#hu30) | [PE04](personas.md#pe04) Célia | Saber qué he olvidado | [RF29](requisitos.md#rf29) | Entregado |
| [HU31](#hu31) | [PE04](personas.md#pe04) Célia | No perder lo que marqué | [RF30](requisitos.md#rf30) | Entregado |
| [HU32](#hu32) | [PE04](personas.md#pe04) Célia | Desistir sin dejar rastro | [RF31](requisitos.md#rf31), [RNF21](requisitos.md#rnf21) | Entregado |
| [HU33](#hu33) | [PE04](personas.md#pe04) Célia | Saltarme las preguntas sobre mí | [RF32](requisitos.md#rf32), [RNF12](requisitos.md#rnf12) | Entregado |
| [HU34](#hu34) | [PE04](personas.md#pe04) Célia | Saber que he terminado | [RF33](requisitos.md#rf33) | Entregado |
| [HU35](#hu35) | [PE05](personas.md#pe05) Tiago | Responder con lector de pantalla | [RF27](requisitos.md#rf27), [RNF01](requisitos.md#rnf01), [RNF03](requisitos.md#rnf03), [RNF04](requisitos.md#rnf04) | Entregado |
| [HU36](#hu36) | [PE06](personas.md#pe06) Amira | Responder en árabe | [RF34](requisitos.md#rf34), [RNF10](requisitos.md#rnf10) | Entregado |
| [HU37](#hu37) | [PE07](personas.md#pe07) Bruna | Participar con autorización del responsable legal | [RF25](requisitos.md#rf25) | Entregado |
| [HU38](#hu38) | [PE08](personas.md#pe08) Lucas | Ejecutar la herramienta en local | [RNF24](requisitos.md#rnf24) | Entregado |
| [HU39](#hu39) | [PE08](personas.md#pe08) Lucas | Cambiar un umbral y recalcular | [RF55](requisitos.md#rf55) | Entregado |
| [HU40](#hu40) | [PE08](personas.md#pe08) Lucas | Demostrar que el cálculo no se ha roto | [RNF25](requisitos.md#rnf25), [RNF26](requisitos.md#rnf26) | Entregado |
| [HU41](#hu41) | [PE08](personas.md#pe08) Lucas | Administrar las cuentas del laboratorio | [RF66](requisitos.md#rf66), [RNF17](requisitos.md#rnf17) | Entregado |
| [HU42](#hu42) | [PE08](personas.md#pe08) Lucas | Demostrar la herramienta sin datos reales | [RF67](requisitos.md#rf67) | Entregado |
| [HU43](#hu43) | [PE08](personas.md#pe08) Lucas | Verificar la protección y las traducciones | [RF68](requisitos.md#rf68), [RNF14](requisitos.md#rnf14) | Entregado |
| [HU44](#hu44) | [PE08](personas.md#pe08) Lucas | Leer la documentación sin cuenta | [RF63](requisitos.md#rf63), [RF64](requisitos.md#rf64), [RF65](requisitos.md#rf65) | Entregado |

## Investigadores

### HU01

**Crear una cuenta y entrar**

Como **Marina**, investigadora ([PE01](personas.md#pe01)), **quiero** crear una cuenta y entrar sin leer un manual, **para** empezar a montar mi estudio el mismo día.

Criterios de aceptación:

1. Las reglas de la contraseña aparecen antes de que yo escriba.
2. Si un campo es incorrecto, un resumen en la parte superior dice cuál es y lleva hasta él.
3. Entrar y Crear cuenta se abren en una ventana sobre la página de inicio, y Esc la cierra devolviendo el foco.
4. Después de entrar, vuelvo a la página que había pedido.

Requisitos: [RF01](requisitos.md#rf01), [RF02](requisitos.md#rf02), [RF11](requisitos.md#rf11). Estado: Entregado.

### HU02

**Aprender a usarla en el primer acceso**

Como **Marina**, investigadora ([PE01](personas.md#pe01)), **quiero** que me guíen por las pantallas la primera vez y tener ayuda en cada página, **para** no quedarme atascada en una pantalla que no entiendo.

Criterios de aceptación:

1. En el primer acceso, un recorrido muestra las acciones en las pantallas reales, y avanzo realizando la acción.
2. Puedo omitir o cerrar el recorrido y repasarlo después desde la ayuda.
3. Cada página del investigador tiene un (?) que explica la propia página.

Requisitos: [RF09](requisitos.md#rf09), [RF10](requisitos.md#rf10). Estado: Entregado.

### HU03

**Crear un estudio con dos versiones**

Como **Marina**, investigadora ([PE01](personas.md#pe01)), **quiero** registrar el estudio con las dos versiones de la aplicación, **para** comparar la versión actual con la nueva en el mismo estudio.

Criterios de aceptación:

1. Indico título, producto, objetivo, periodo y las versiones.
2. El nombre del producto sugiere el nombre de la primera versión.
3. Los errores aparecen en un resumen con un enlace a cada campo, y no se pierde nada.
4. El estudio nace como borrador, sin aceptar respuestas.

Requisitos: [RF13](requisitos.md#rf13), [RF19](requisitos.md#rf19). Estado: Entregado.

### HU04

**Indicar quién responde por la investigación**

Como **Marina**, investigadora ([PE01](personas.md#pe01)), **quiero** decir en el formulario de consentimiento quién soy, cómo contactarme, los riesgos y los beneficios, **para** cumplir con la ética de la investigación y transmitir confianza a quien responde.

Criterios de aceptación:

1. El nombre, el correo electrónico de contacto y la institución vienen rellenados desde mi cuenta y son obligatorios.
2. Los riesgos y beneficios vienen con un texto sugerido que puedo cambiar.
3. El comité de ética es opcional y aparece en el formulario de consentimiento cuando se indica.
4. Veo la vista previa del formulario de consentimiento del participante junto al formulario.

Requisitos: [RF13](requisitos.md#rf13), [RF25](requisitos.md#rf25). Estado: Entregado.

### HU05

**Decidir si recojo datos demográficos**

Como **Marina**, investigadora ([PE01](personas.md#pe01)), **quiero** elegir, en cada estudio, si el enlace pregunta grupo de edad, género, nivel educativo y familiaridad, **para** recoger solo lo que mi investigación necesita.

Criterios de aceptación:

1. La recogida demográfica viene desactivada.
2. Cuando la activo, el formulario de consentimiento lo avisa y el tiempo estimado aumenta.
3. Los datos demográficos se guardan cifrados en la base de datos.

Requisitos: [RF18](requisitos.md#rf18), [RNF13](requisitos.md#rnf13), [RNF14](requisitos.md#rnf14). Estado: Entregado.

### HU06

**Abrir la recogida y enviar el enlace**

Como **Marina**, investigadora ([PE01](personas.md#pe01)), **quiero** abrir la recogida y copiar el enlace con un clic, **para** enviarlo al grupo de WhatsApp de los pacientes.

Criterios de aceptación:

1. Abrir recogida confirma en un mensaje lo que ha cambiado: "Recogida abierta. El enlace ya acepta respuestas."
2. Copiar enlace copia y anuncia que ha copiado, también con el teclado.
3. El enlace es corto y no permite adivinar el de otro estudio.

Requisitos: [RF15](requisitos.md#rf15), [RF16](requisitos.md#rf16), [RNF20](requisitos.md#rnf20). Estado: Entregado.

### HU07

**Seguir la recogida**

Como **Marina**, investigadora ([PE01](personas.md#pe01)), **quiero** ver cuántas personas han respondido ya y cuándo llegó la última respuesta, **para** saber si necesito difundir más el enlace.

Criterios de aceptación:

1. La lista de estudios muestra las respuestas y la última respuesta de cada estudio.
2. La campana avisa de las respuestas nuevas, agrupadas mientras no las leo.

Requisitos: [RF12](requisitos.md#rf12), [RF22](requisitos.md#rf22). Estado: Entregado.

### HU08

**Entender el resultado sin ser estadística**

Como **Marina**, investigadora ([PE01](personas.md#pe01)), **quiero** leer el resultado con la interpretación escrita junto a cada número, **para** saber si la versión nueva es mejor sin convertirme en experta.

Criterios de aceptación:

1. Una frase en la parte superior resume el resultado.
2. Cada escala muestra media, IC95, alfa, interpretación y franja del benchmark, en el gráfico y en una tabla.
3. Los términos técnicos tienen una explicación breve que se abre allí mismo.
4. Con un alfa bajo o una muestra pequeña, un aviso dice qué significa y qué hacer.
5. El gráfico sigue siendo legible sin depender del color.

Requisitos: [RF38](requisitos.md#rf38), [RF43](requisitos.md#rf43), [RF44](requisitos.md#rf44), [RF45](requisitos.md#rf45), [RF49](requisitos.md#rf49), [RNF07](requisitos.md#rnf07), [RNF08](requisitos.md#rnf08). Estado: Entregado.

### HU09

**Ver qué ítems arrastraron la escala**

Como **Marina**, investigadora ([PE01](personas.md#pe01)), **quiero** ver la media de cada uno de los 26 ítems, **para** explicar en la tesis de máster por qué una escala quedó baja.

Criterios de aceptación:

1. El gráfico muestra cada ítem entre sus dos términos.
2. Puedo verlo en el orden oficial o agrupado por escala.

Requisitos: [RF41](requisitos.md#rf41), [RF46](requisitos.md#rf46). Estado: Entregado.

### HU10

**Comparar las dos versiones**

Como **Marina**, investigadora ([PE01](personas.md#pe01)), **quiero** ver las versiones una al lado de la otra en el mismo gráfico, **para** decir en qué escalas ganó la versión nueva.

Criterios de aceptación:

1. Cada participante se asigna a la versión con menos respuestas, así que los grupos quedan parecidos.
2. Cada versión tiene un marcador de forma distinta, y una frase señala las mayores diferencias.
3. La versión y el modo quedan en la dirección: recargar o enviar el enlace mantiene la misma vista.

Requisitos: [RF26](requisitos.md#rf26), [RF47](requisitos.md#rf47), [RF48](requisitos.md#rf48). Estado: Entregado.

### HU11

**Llevar los resultados a la tesis de máster**

Como **Marina**, investigadora ([PE01](personas.md#pe01)), **quiero** descargar la tabla por escala y el panel en PDF, **para** incluirlos en el texto sin rehacer gráficos.

Criterios de aceptación:

1. El CSV por escala se abre en Excel en portugués, con coma decimal.
2. El PDF lleva el título del estudio, el n y la fecha en el encabezado.

Requisitos: [RF58](requisitos.md#rf58), [RF60](requisitos.md#rf60), [RNF22](requisitos.md#rnf22). Estado: Entregado.

### HU12

**Quitar del análisis las respuestas descuidadas**

Como **Marina**, investigadora ([PE01](personas.md#pe01)), **quiero** ver qué respuestas parecen descuidadas y quitarlas del cálculo, **para** no dejar que quien respondió al azar distorsione el resultado.

Criterios de aceptación:

1. La herramienta marca como sospechosa a quien tiene 3 o más escalas incoherentes o más de 15 respuestas iguales.
2. Veo el motivo y la amplitud de cada escala del participante.
3. Quito y devuelvo una a una, o todas las sospechosas a la vez, sin borrar nada.
4. Los números del panel pasan a usar solo a quienes están en el análisis.

Requisitos: [RF42](requisitos.md#rf42), [RF51](requisitos.md#rf51), [RF52](requisitos.md#rf52), [RF53](requisitos.md#rf53), [RF54](requisitos.md#rf54). Estado: Entregado.

### HU13

**Ver el perfil de quienes respondieron**

Como **Marina**, investigadora ([PE01](personas.md#pe01)), **quiero** ver la distribución de las respuestas demográficas, **para** describir la muestra en la tesis de máster.

Criterios de aceptación:

1. Cada pregunta aparece en un gráfico con la tabla de los números.
2. Puedo filtrar por versión.
3. Prefiero no responder y quienes se la saltaron aparecen por separado.

Requisitos: [RF50](requisitos.md#rf50). Estado: Entregado.

### HU14

**Cerrar y reabrir la recogida**

Como **Marina**, investigadora ([PE01](personas.md#pe01)), **quiero** cerrar la recogida al final del periodo y reabrirla si lo necesito, **para** dejar de recibir respuestas sin perder las que ya tengo.

Criterios de aceptación:

1. Una vez cerrada, el enlace explica que la recogida ha terminado.
2. Reabrir vuelve a aceptar respuestas.

Requisitos: [RF15](requisitos.md#rf15). Estado: Entregado.

### HU15

**Corregir el estudio después de crearlo**

Como **Marina**, investigadora ([PE01](personas.md#pe01)), **quiero** editar los datos y las versiones, **para** corregir un error de escritura o añadir una versión.

Criterios de aceptación:

1. Los cambios se guardan y un mensaje lo confirma.
2. Con la recogida abierta, no puedo eliminar una versión que ya tiene respuestas.

Requisitos: [RF14](requisitos.md#rf14). Estado: Entregado.

### HU16

**Eliminar un estudio de prueba**

Como **Marina**, investigadora ([PE01](personas.md#pe01)), **quiero** borrar el estudio que creé para probar, **para** dejar mi lista limpia.

Criterios de aceptación:

1. La ventana dice cuántas respuestas se eliminan con él.
2. Solo se elimina después de que escribo el título del estudio.

Requisitos: [RF17](requisitos.md#rf17), [RNF21](requisitos.md#rnf21). Estado: Entregado.

### HU17

**Gestionar los datos de mi cuenta**

Como **Marina**, investigadora ([PE01](personas.md#pe01)), **quiero** cambiar mis datos, descargar lo que la herramienta guarda sobre mí y eliminar la cuenta, **para** ejercer mis derechos de la LGPD sin pedírselo a nadie.

Criterios de aceptación:

1. Cambio el nombre y el correo electrónico en Mi cuenta; un correo electrónico de otra cuenta se rechaza.
2. Descargar mis datos entrega un JSON con la cuenta, sin la contraseña.
3. Eliminar la cuenta pide mi correo electrónico y borra también mis estudios.
4. La política de privacidad explica qué se guarda y por qué.

Requisitos: [RF04](requisitos.md#rf04), [RF06](requisitos.md#rf06), [RF07](requisitos.md#rf07), [RNF19](requisitos.md#rnf19). Estado: Entregado.

### HU18

**Verificar los números en la hoja oficial**

Como **Ricardo**, director de tesis ([PE02](personas.md#pe02)), **quiero** exportar las respuestas en la propia UEQ Data Analysis Tool, **para** comprobar que la herramienta calcula como la hoja oficial antes de firmar un artículo.

Criterios de aceptación:

1. La hoja oficial sale rellenada con los 26 valores de cada participante en el análisis, a partir de Data!A4, y se recalcula al abrirla en Excel.
2. La recodificación y las estadísticas siguen las fórmulas del handbook y de la hoja.
3. El cuestionario no induce la respuesta: las 7 posiciones tienen el mismo peso visual.
4. Los números coinciden con la hoja con una tolerancia de 1e-6.

Requisitos: [RF36](requisitos.md#rf36), [RF37](requisitos.md#rf37), [RF59](requisitos.md#rf59), [RNF09](requisitos.md#rnf09), [RNF11](requisitos.md#rnf11). Estado: Entregado.

### HU19

**Unir respuestas recogidas en papel**

Como **Ricardo**, director de tesis ([PE02](personas.md#pe02)), **quiero** importar las respuestas de un evento a partir de un CSV, **para** analizarlo todo en el mismo panel.

Criterios de aceptación:

1. Veo una vista previa antes de importar.
2. Las líneas con errores se señalan por su número, y no se importa nada mientras haya errores.
3. Las importadas aparecen marcadas como importadas.

Requisitos: [RF61](requisitos.md#rf61). Estado: Entregado.

### HU20

**Seguir el estudio de su tesista**

Como **Ricardo**, director de tesis ([PE02](personas.md#pe02)), **quiero** que me inviten al estudio de Marina como lector, **para** ver el mismo panel que ella sin poder cambiar nada.

Criterios de aceptación:

1. La invitación llega a la campana y la acepto o la rechazo.
2. Como lector, veo y exporto, pero no edito ni elimino.
3. Solo veo los estudios que son míos o que se han compartido conmigo.

Requisitos: [RF20](requisitos.md#rf20), [RF21](requisitos.md#rf21), [RNF17](requisitos.md#rnf17). Estado: Entregado.

### HU21

**Saber qué ha cambiado en los estudios**

Como **Ricardo**, director de tesis ([PE02](personas.md#pe02)), **quiero** recibir un aviso cuando el equipo cambia un estudio o llegan respuestas, **para** no tener que abrir cada estudio para saberlo.

Criterios de aceptación:

1. La campana muestra invitaciones, respuestas nuevas y cambios hechos por los colaboradores.
2. Los avisos también llegan por correo electrónico, en mi idioma, y puedo desactivarlos en Mi cuenta.

Requisitos: [RF22](requisitos.md#rf22), [RF23](requisitos.md#rf23). Estado: Entregado.

### HU22

**Proteger la cuenta en un ordenador compartido**

Como **Ricardo**, director de tesis ([PE02](personas.md#pe02)), **quiero** cambiar la contraseña y saber que las demás sesiones se cierran, **para** no dejar la cuenta abierta en el laboratorio.

Criterios de aceptación:

1. Cambiar la contraseña cierra las sesiones de otros navegadores.
2. Quien abre una página del investigador sin sesión va a Entrar.
3. Después de 5 contraseñas incorrectas, el correo electrónico espera antes de volver a intentarlo.
4. La herramienta solo funciona por HTTPS, con las cabeceras de seguridad.

Requisitos: [RF03](requisitos.md#rf03), [RF05](requisitos.md#rf05), [RNF15](requisitos.md#rnf15), [RNF16](requisitos.md#rnf16), [RNF18](requisitos.md#rnf18). Estado: Entregado.

### HU23

**Exportar las respuestas para otro análisis**

Como **Ricardo**, director de tesis ([PE02](personas.md#pe02)), **quiero** descargar las respuestas en bruto y las recodificadas, **para** realizar análisis que la herramienta no hace.

Criterios de aceptación:

1. El CSV en bruto tiene los valores de 1 a 7, la versión y los datos demográficos.
2. El CSV recodificado tiene los valores de -3 a +3 con la polaridad corregida.
3. Los archivos se abren directamente en Excel en portugués.

Requisitos: [RF56](requisitos.md#rf56), [RF57](requisitos.md#rf57), [RNF22](requisitos.md#rnf22). Estado: Entregado.

### HU24

**Conocer la regla de cada número**

Como **Ricardo**, director de tesis ([PE02](personas.md#pe02)), **quiero** ver cómo se calcula y se clasifica cada estadística, **para** explicar el método ante un tribunal.

Criterios de aceptación:

1. La pragmática es la media de Perspicuidad, Eficiencia y Confiabilidad; la hedónica, de Estimulación y Novedad.
2. Cada media se clasifica en las 5 franjas del benchmark, y una media igual al límite cae en la franja inferior.
3. La interpretación usa la franja neutra de -0,8 a +0,8.

Requisitos: [RF37](requisitos.md#rf37), [RF38](requisitos.md#rf38), [RF39](requisitos.md#rf39), [RF40](requisitos.md#rf40). Estado: Entregado.

### HU25

**Aplicar la versión corta en eventos**

Como **Ricardo**, director de tesis ([PE02](personas.md#pe02)), **quiero** aplicar el UEQ-S, con 8 ítems, **para** recoger datos en eventos en los que las personas tienen poco tiempo.

Criterios de aceptación:

1. Elijo entre UEQ y UEQ-S al crear el estudio.
2. El formulario explica qué cambia entre los dos antes de que yo elija, y la elección se bloquea con la primera respuesta.
3. El participante responde los 8 pares del UEQ-S, con el tiempo de la versión corta en el formulario de consentimiento.
4. Los resultados muestran, en una pestaña propia, la calidad pragmática, la hedónica y la general, con el benchmark del UEQ-S, y exportan la hoja oficial del UEQ-S rellenada.

Requisitos: [RF62](requisitos.md#rf62). Estado: Entregado.

### HU26

**Usar la herramienta en japonés**

Como **Kenji**, investigador visitante ([PE03](personas.md#pe03)), **quiero** cambiar el idioma de la herramienta a japonés, **para** trabajar en el idioma que mejor leo.

Criterios de aceptación:

1. Elijo el idioma al crear la cuenta, en Mi cuenta o en el selector de la barra.
2. El cambio se aplica al instante, sin salir de la página.
3. Sin cuenta, el selector de la barra también cambia el idioma y queda guardado en el navegador.

Requisitos: [RF08](requisitos.md#rf08). Estado: Entregado.

### HU27

**Aplicar el estudio en japonés**

Como **Kenji**, investigador visitante ([PE03](personas.md#pe03)), **quiero** escribir el estudio en japonés y que el enlace se abra en japonés, **para** aplicar el cuestionario a participantes en Japón.

Criterios de aceptación:

1. Elijo el idioma del estudio en el formulario; el predeterminado es el idioma de la cuenta.
2. El enlace se abre en el idioma del estudio, y el participante puede cambiarlo.
3. El título, el producto y el objetivo aparecen traducidos para quien cambia de idioma.

Requisitos: [RF19](requisitos.md#rf19), [RF34](requisitos.md#rf34), [RF35](requisitos.md#rf35). Estado: Entregado.

## Participantes

### HU28

**Entender la invitación antes de aceptar**

Como **Célia**, participante desde el móvil ([PE04](personas.md#pe04)), **quiero** leer en un minuto de qué se trata y qué va a ocurrir, **para** decidir si quiero participar.

Criterios de aceptación:

1. El formulario de consentimiento indica el objetivo, el tiempo estimado, los riesgos, los beneficios, la custodia de los datos y quién responde por la investigación.
2. Solo participo después de indicar la edad y hacer clic en Estoy de acuerdo y quiero participar.
3. No quiero participar sale sin guardar nada.
4. Puedo imprimir o guardar una copia del formulario de consentimiento y abrir la política de privacidad sin perder el formulario.

Requisitos: [RF25](requisitos.md#rf25), [RNF19](requisitos.md#rnf19). Estado: Entregado.

### HU29

**Responder rápido desde el móvil**

Como **Célia**, participante desde el móvil ([PE04](personas.md#pe04)), **quiero** responder en el móvil, con la fuente ampliada, sin cuenta, **para** terminar en pocos minutos.

Criterios de aceptación:

1. Abro el enlace sin iniciar sesión y no veo ningún camino hacia el área del investigador.
2. Cada círculo tiene una zona táctil de al menos 44 × 44 px.
3. Nada se desplaza en horizontal a 320 px ni con zoom del 400%.
4. Un pie fijo muestra cuántos ítems he respondido ya, de 26.

Requisitos: [RF24](requisitos.md#rf24), [RF27](requisitos.md#rf27), [RF28](requisitos.md#rf28), [RNF02](requisitos.md#rnf02), [RNF05](requisitos.md#rnf05), [RNF06](requisitos.md#rnf06), [RNF23](requisitos.md#rnf23). Estado: Entregado.

### HU30

**Saber qué he olvidado**

Como **Célia**, participante desde el móvil ([PE04](personas.md#pe04)), **quiero** que me avisen de los ítems en blanco cuando envío, **para** corregirlos sin buscar ítem por ítem.

Criterios de aceptación:

1. Un resumen en la parte superior dice cuántos faltan, con un enlace a cada uno.
2. No se guarda nada mientras falte algún ítem.

Requisitos: [RF29](requisitos.md#rf29). Estado: Entregado.

### HU31

**No perder lo que marqué**

Como **Célia**, participante desde el móvil ([PE04](personas.md#pe04)), **quiero** recuperar las respuestas si la página se recarga, **para** no tener que empezar de nuevo.

Criterios de aceptación:

1. Recargar la página recupera lo que había marcado, con un aviso.
2. Cambiar de idioma a mitad tampoco borra lo que marqué.

Requisitos: [RF30](requisitos.md#rf30). Estado: Entregado.

### HU32

**Desistir sin dejar rastro**

Como **Célia**, participante desde el móvil ([PE04](personas.md#pe04)), **quiero** salir a mitad del cuestionario, **para** no quedarme atada a algo que ya no quiero hacer.

Criterios de aceptación:

1. Salir sin enviar pide confirmación en una ventana.
2. Al salir, no se guarda nada de lo que marqué.

Requisitos: [RF31](requisitos.md#rf31), [RNF21](requisitos.md#rnf21). Estado: Entregado.

### HU33

**Saltarme las preguntas sobre mí**

Como **Célia**, participante desde el móvil ([PE04](personas.md#pe04)), **quiero** no responder las preguntas demográficas, **para** no dar información que no quiero dar.

Criterios de aceptación:

1. Cada pregunta tiene Prefiero no responder.
2. Puedo saltarme la etapa entera.
3. La herramienta no pide nombre, correo electrónico ni nada que me identifique.

Requisitos: [RF32](requisitos.md#rf32), [RNF12](requisitos.md#rnf12). Estado: Entregado.

### HU34

**Saber que he terminado**

Como **Célia**, participante desde el móvil ([PE04](personas.md#pe04)), **quiero** ver que mis respuestas se han registrado, **para** cerrar la página tranquila.

Criterios de aceptación:

1. Después de enviar, veo el agradecimiento.
2. Si vuelvo a abrir el enlace en el mismo navegador, veo que ya he respondido.

Requisitos: [RF33](requisitos.md#rf33). Estado: Entregado.

### HU35

**Responder con lector de pantalla**

Como **Tiago**, participante con lector de pantalla ([PE05](personas.md#pe05)), **quiero** responder solo con el teclado y NVDA, **para** responder con la misma precisión que quien ve.

Criterios de aceptación:

1. Cada ítem se anuncia con su número, sus dos términos y la posición de cada círculo.
2. Tab pasa de un ítem a otro y las flechas cambian la posición, con el foco siempre visible.
3. El resumen de ítems pendientes recibe el foco y se anuncia.
4. Ninguna pantalla tiene infracciones de WCAG 2.2 AA señaladas por axe-core.

Requisitos: [RF27](requisitos.md#rf27), [RNF01](requisitos.md#rnf01), [RNF03](requisitos.md#rnf03), [RNF04](requisitos.md#rnf04). Estado: Entregado.

### HU36

**Responder en árabe**

Como **Amira**, participante que lee en árabe ([PE06](personas.md#pe06)), **quiero** responder en mi idioma, con los términos validados en árabe, **para** responder mejor que en portugués.

Criterios de aceptación:

1. El enlace se abre en el idioma del navegador cuando está entre los 37 del UEQ.
2. La página pasa a leerse de derecha a izquierda, con la escala en el orden oficial.
3. Los términos son los del paquete oficial, nunca una traducción automática.
4. Si la traducción no ha sido aprobada por los autores del UEQ, un aviso lo indica.

Requisitos: [RF34](requisitos.md#rf34), [RNF10](requisitos.md#rnf10). Estado: Entregado.

### HU37

**Participar con autorización del responsable legal**

Como **Bruna**, participante menor de edad ([PE07](personas.md#pe07)), **quiero** participar en un estudio de la escuela con la autorización de mis padres, **para** participar como mis compañeros mayores de edad.

Criterios de aceptación:

1. El formulario de consentimiento pide la edad antes de Estoy de acuerdo y quiero participar.
2. Con menos de 18 años, solo participo después de confirmar la autorización del responsable legal.
3. Sin edad, no se guarda nada.

Requisitos: [RF25](requisitos.md#rf25). Estado: Entregado.

## Quién mantiene la herramienta

### HU38

**Ejecutar la herramienta en local**

Como **Lucas**, responsable de mantener la instalación ([PE08](personas.md#pe08)), **quiero** poner en marcha la herramienta en mi máquina en minutos, **para** adaptarla a mi laboratorio.

Criterios de aceptación:

1. El README tiene el paso a paso, desde el clone hasta la pantalla de inicio.
2. El código es abierto, bajo la licencia MIT.

Requisitos: [RNF24](requisitos.md#rnf24). Estado: Entregado.

### HU39

**Cambiar un umbral y recalcular**

Como **Lucas**, responsable de mantener la instalación ([PE08](personas.md#pe08)), **quiero** cambiar un umbral de sospecha sin buscar números por el código, **para** seguir el protocolo de mi grupo.

Criterios de aceptación:

1. Los umbrales están en data/protocolo.json, con su fuente.
2. Un comando recalcula la sospecha de las participaciones ya guardadas.

Requisitos: [RF55](requisitos.md#rf55). Estado: Entregado.

### HU40

**Demostrar que el cálculo no se ha roto**

Como **Lucas**, responsable de mantener la instalación ([PE08](personas.md#pe08)), **quiero** ejecutar las pruebas del cálculo después de cambiar el código, **para** tener la certeza de que los números siguen siendo correctos.

Criterios de aceptación:

1. El cálculo está en un módulo de funciones puras, sin base de datos ni interfaz.
2. Lint, tipos y pruebas unitarias se ejecutan con un comando cada uno.
3. Las pruebas cubren los casos límite: n = 0, n = 1, todos iguales.

Requisitos: [RNF25](requisitos.md#rnf25), [RNF26](requisitos.md#rnf26). Estado: Entregado.

### HU41

**Administrar las cuentas del laboratorio**

Como **Lucas**, responsable de mantener la instalación ([PE08](personas.md#pe08)), **quiero** ver las cuentas y crear una cuenta para un estudiante nuevo, **para** cuidar de la instalación del laboratorio.

Criterios de aceptación:

1. Solo quien es administrador abre la página Administración.
2. El administrador no ve los estudios de nadie, solo la cantidad por cuenta.

Requisitos: [RF66](requisitos.md#rf66), [RNF17](requisitos.md#rnf17). Estado: Entregado.

### HU42

**Demostrar la herramienta sin datos reales**

Como **Lucas**, responsable de mantener la instalación ([PE08](personas.md#pe08)), **quiero** crear estudios de demostración con respuestas inventadas, **para** presentar la herramienta en una clase.

Criterios de aceptación:

1. Cada escenario genera respuestas coherentes con su perfil.
2. Los estudios de demostración quedan en mi cuenta.

Requisitos: [RF67](requisitos.md#rf67). Estado: Entregado.

### HU43

**Verificar la protección y las traducciones**

Como **Lucas**, responsable de mantener la instalación ([PE08](personas.md#pe08)), **quiero** ver si el cifrado está activado y cuánto de cada idioma está traducido, **para** saber si la instalación está lista para un estudio real.

Criterios de aceptación:

1. Administración muestra si la clave de cifrado y el envío de correo electrónico están configurados.
2. Administración › Idiomas muestra cuánto de cada idioma se ha traducido ya.

Requisitos: [RF68](requisitos.md#rf68), [RNF14](requisitos.md#rnf14). Estado: Entregado.

### HU44

**Leer la documentación sin cuenta**

Como **Lucas**, responsable de mantener la instalación ([PE08](personas.md#pe08)), **quiero** leer la documentación dentro de la herramienta, sin crear una cuenta, **para** entender la arquitectura antes de tocar nada.

Criterios de aceptación:

1. La pestaña Documentación se abre para cualquier persona.
2. Los enlaces entre documentos llevan al punto correcto, y los archivos de la ficha se descargan sin cuenta.
3. Cada diagrama se abre a pantalla completa, con zoom.

Requisitos: [RF63](requisitos.md#rf63), [RF64](requisitos.md#rf64), [RF65](requisitos.md#rf65). Estado: Entregado.
