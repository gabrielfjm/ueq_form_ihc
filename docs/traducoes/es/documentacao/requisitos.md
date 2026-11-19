# Requisitos

La Herramienta UEQ tiene **68 requisitos funcionales** (RF), lo que hace, y **26 requisitos no funcionales** (RNF), cómo tiene que ser. Los 94 están entregados. La misma lista está en [requisitos.csv](requisitos.csv) y en la [hoja de requisitos](planilha-requisitos.xlsx).

Actualizado el 17/11/2026.

## Cómo leer

Cada requisito tiene un ID fijo. Una vez creado, el ID no cambia: si un requisito se retira, queda con el estado Retirado, porque los casos de uso y los casos de prueba citan los requisitos por el número.

**Prioridad**

- **Esencial:** sin él la herramienta no cumple los cinco requisitos de la asignatura (crear y gestionar estudios, aplicar el instrumento, calcular según el protocolo, analizar y visualizar, exportar) o no es accesible.
- **Importante:** mejora la calidad de uso, la seguridad o la confianza en los resultados, pero la herramienta funciona sin él.
- **Deseable:** extensión más allá del alcance obligatorio de la propuesta.

**Estado**

- **Entregado:** está en `main` y se puede comprobar en la herramienta.
- **Pendiente:** todavía falta alguna parte.
- **Retirado:** salió del alcance. El ID sigue reservado.

**Sprint** es el sprint en que se entregó el requisito (tabla de abajo). Cada sprint es uno o más pull requests integrados en `main`.

**Cómo verificar** cita los [casos de prueba](casos-de-teste.md) que demuestran el requisito, cuando existen, e indica qué hacer en la herramienta para comprobarlo. Para ejecutar la herramienta, use la cuenta de prueba `pesquisador@exemplo.com` (contraseña `senha-de-teste`) y el Estudio de ejemplo.

### Sprints

| Sprint | PR | Fecha | Qué entregó |
|---|---|---|---|
| Sprint 00 · Configuración | #1 | 22/10/2026 | Esqueleto del proyecto con Next, Prisma y pruebas |
| Sprint 01 · Base de datos y seed | #5 | 23/10/2026 | Modelo de la base de datos y los 26 ítems del UEQ en el seed |
| Sprint 02 · Cálculo | #6 | 23/10/2026 | Módulo de cálculo del UEQ |
| Sprint 03 · Autenticación | #7 | 23/10/2026 | Registro, inicio de sesión y Mi cuenta |
| Sprint 04 · Estudios | #8 | 23/10/2026 | Lista, registro y página del estudio |
| Sprint 05 · Cuestionario | #9 | 23/10/2026 | Cuestionario del participante |
| Sprint 06 · Resultados | #10 | 23/10/2026 | Panel de resultados y comparación entre versiones |
| Sprint 07 · Sospechas | #11 | 29/10/2026 | Página de respuestas y control de las sospechas |
| Sprint 08 · Exportación | #12 | 29/10/2026 | Exportaciones en CSV |
| Sprint de idiomas | #13 | 29/10/2026 | Cuestionario en los 37 idiomas del UEQ |
| Sprint 10 · Extensiones | #14 | 30/10/2026 | Importación por CSV, panel en PDF, estructura del UEQ-S |
| Sprint de documentación | #15, #16 | 30/10/2026 | Pestaña Documentación, licencia MIT, barra fija, diagramas a pantalla completa |
| Página de inicio y ventanas | #17 | 30/10/2026 | Página de inicio, Entrar en ventana, confirmación de salir y de eliminar, icono |
| Implantación | #18, #19, #20 | 30/10 y 31/10/2026 | Casos de prueba actualizados y publicación en Vercel, con migrations y seed en el build |
| Equipo y ayuda | #21 | 01/11/2026 | Estudios en equipo, notificaciones, recorrido guiado, ayuda en cada página, recogida demográfica opcional y Administración |
| LGPD | #22, #23 | 01/11/2026 | Cifrado, política de privacidad, Descargar mis datos, límite de intentos, cabeceras de seguridad y perfil de los participantes |
| Idiomas de la herramienta | #24 a #27 | 02/11/2026 | Herramienta en los 37 idiomas, idioma del estudio, traducción de los textos del estudio y nueva página de inicio |
| Participante y correos electrónicos | #28, #29 | 03/11/2026 | Pantallas del participante más acogedoras y correos electrónicos con la identidad visual |
| Privacidad y documentación en páginas | #30 a #34 | 06/11/2026 | Política con el estilo de la herramienta, documentos de arquitectura y pruebas, documentación en páginas y confirmación de toda acción |
| Calidad de la traducción | #35 a #39 | 06/11 y 07/11/2026 | Traducción de la interfaz con glosario, contexto de la pantalla y revisión automática |
| Formulario de consentimiento | #40, #41 | 17/11/2026 | Formulario completo, menores de 18 años, selector de idioma en la barra y Next.js 16.4.6 |
| Documentación final | #42, #43 | 17/11/2026 | Requisitos, matriz de trazabilidad, personas, historias, casos de uso, diagrama de clases y verificación del cálculo |
| Sprint 09 · Revisión final | #44 | 17/11/2026 | Comprobación con la hoja oficial en 11 escenarios y exportación en la propia UEQ Data Analysis Tool |
| UEQ-S | #45 | 18/11/2026 | El UEQ-S como cuestionario del estudio, la pestaña UEQ-S en los resultados, la comparación UEQ o UEQ-S en la página de inicio y la comprobación con la hoja oficial del UEQ-S en 9 escenarios |

## Requisitos funcionales

### Acceso y cuenta

| ID | Requisito | Descripción | Prioridad | Sprint | Estado | Cómo verificar |
|---|---|---|---|---|---|---|
| <a id="rf01"></a>RF01 | **Crear cuenta** | El investigador crea una cuenta con nombre, correo electrónico y contraseña, y ve las reglas de la contraseña antes de escribirla. | Esencial | Sprint 03 · Autenticación | Entregado | [CT-E03](casos-de-teste.md#ct-e03), [CT-E06](casos-de-teste.md#ct-e06), [CT-E07](casos-de-teste.md#ct-e07). En la página de inicio, haga clic en Crear cuenta y regístrese dejando un campo vacío en el primer intento. |
| <a id="rf02"></a>RF02 | **Entrar y salir** | El investigador entra con correo electrónico y contraseña y sale de la sesión, que pide confirmación en una ventana. | Esencial | Sprint 03 · Autenticación | Entregado | [CT-E03](casos-de-teste.md#ct-e03), [CT-E08](casos-de-teste.md#ct-e08), [CT-E58](casos-de-teste.md#ct-e58). Entre con la cuenta de prueba, primero equivocándose en la contraseña; después haga clic en Salir. |
| <a id="rf03"></a>RF03 | **Proteger el área del investigador** | Quien abre una página del investigador sin sesión va a Entrar y, después del inicio de sesión, vuelve a la página que pidió. | Esencial | Sprint 03 · Autenticación | Entregado | [CT-E04](casos-de-teste.md#ct-e04). Sin haber iniciado sesión, abra http://localhost:3000/estudos. |
| <a id="rf04"></a>RF04 | **Editar los datos de la cuenta** | El investigador cambia el nombre y el correo electrónico en Mi cuenta; un correo que ya pertenece a otra cuenta se rechaza. | Importante | Sprint 03 · Autenticación | Entregado | [CT-E09](casos-de-teste.md#ct-e09). Mi cuenta › Datos personales: cambie el nombre y guarde. |
| <a id="rf05"></a>RF05 | **Cambiar la contraseña** | El investigador cambia la contraseña indicando la actual, y el cambio cierra las sesiones abiertas en otros navegadores. | Importante | Sprint 03 · Autenticación | Entregado | [CT-E10](casos-de-teste.md#ct-e10). Mi cuenta › Contraseña. |
| <a id="rf06"></a>RF06 | **Eliminar la cuenta** | El investigador elimina la cuenta escribiendo el correo electrónico, y la eliminación borra también sus estudios y sus respuestas. | Importante | Sprint 03 · Autenticación | Entregado | [CT-E11](casos-de-teste.md#ct-e11). Mi cuenta › Eliminar cuenta, con una cuenta creada solo para la prueba. |
| <a id="rf07"></a>RF07 | **Descargar mis datos** | El investigador descarga, en Mi cuenta, un archivo JSON con todo lo que la herramienta guarda sobre su cuenta. | Importante | LGPD | Entregado | [CT-E81](casos-de-teste.md#ct-e81). Mi cuenta › Descargar mis datos: el archivo .json se descarga y contiene los datos de la cuenta. |
| <a id="rf08"></a>RF08 | **Elegir el idioma de la herramienta** | El investigador elige el idioma de la interfaz al crear la cuenta y lo cambia en Mi cuenta › Idioma o con el selector de idioma de la barra, entre los 37 idiomas del UEQ; sin cuenta, el selector de la barra también cambia el idioma. | Deseable | Idiomas de la herramienta | Entregado | [CT-E94](casos-de-teste.md#ct-e94), [CT-E95](casos-de-teste.md#ct-e95). Haga clic en PT en la barra, elija otro idioma y compruebe el menú traducido; lo mismo vale en Mi cuenta › Idioma. |
| <a id="rf09"></a>RF09 | **Recorrido guiado en el primer acceso** | Quien entra por primera vez hace un recorrido por sus propias acciones, y puede omitirlo, cerrarlo o volver a verlo después desde la ayuda. | Deseable | Equipo y ayuda | Entregado | [CT-E66](casos-de-teste.md#ct-e66), [CT-M22](casos-de-teste.md#ct-m22). Cree una cuenta nueva y entre: el recorrido empieza solo. |
| <a id="rf10"></a>RF10 | **Ayuda en cada página** | Cada página del investigador tiene un botón de ayuda (?) en el encabezado, que explica la propia página. | Deseable | Equipo y ayuda | Entregado | [CT-E65](casos-de-teste.md#ct-e65). En cualquier página del investigador, haga clic en (?). |
| <a id="rf11"></a>RF11 | **Página de inicio** | La página de inicio explica el UEQ (escalas, lectura de los resultados y benchmark) y da los créditos; Entrar y Crear cuenta se abren en una ventana sobre ella. | Importante | Página de inicio y ventanas | Entregado | [CT-E01](casos-de-teste.md#ct-e01), [CT-E58](casos-de-teste.md#ct-e58), [CT-E59](casos-de-teste.md#ct-e59), [CT-E60](casos-de-teste.md#ct-e60). Abra http://localhost:3000 sin haber iniciado sesión y haga clic en Entrar. |

### Estudios

| ID | Requisito | Descripción | Prioridad | Sprint | Estado | Cómo verificar |
|---|---|---|---|---|---|---|
| <a id="rf12"></a>RF12 | **Listar los estudios** | El investigador ve sus estudios en una tabla con título, producto, estado, versiones, respuestas y última respuesta, ordenada por la actualización. | Esencial | Sprint 04 · Estudios | Entregado | [CT-E12](casos-de-teste.md#ct-e12), [CT-E17](casos-de-teste.md#ct-e17). Menú Estudios. |
| <a id="rf13"></a>RF13 | **Crear estudio** | El investigador crea un estudio con título, producto evaluado, objetivo, período de recogida y una o más versiones del producto, e indica quién responde por la investigación (nombre, correo electrónico de contacto e institución), los riesgos y los beneficios para el participante y, si lo hay, el comité de ética; el nombre del producto sugiere el nombre de la primera versión. | Esencial | Sprint 04 · Estudios | Entregado | [CT-E13](casos-de-teste.md#ct-e13), [CT-E14](casos-de-teste.md#ct-e14), [CT-E93](casos-de-teste.md#ct-e93). Crear estudio: cree un estudio con 2 versiones. |
| <a id="rf14"></a>RF14 | **Editar estudio** | El investigador edita los datos y las versiones del estudio; con la recogida abierta, una versión que ya tiene respuestas no se puede quitar. | Esencial | Sprint 04 · Estudios | Entregado | [CT-E18](casos-de-teste.md#ct-e18). Página del estudio › Editar. |
| <a id="rf15"></a>RF15 | **Abrir, cerrar y reabrir la recogida** | El investigador abre, cierra y reabre la recogida; el enlace solo acepta respuestas con la recogida abierta y, en los demás casos, muestra un aviso. | Esencial | Sprint 04 · Estudios | Entregado | [CT-E15](casos-de-teste.md#ct-e15). Página del estudio: Abrir recogida, Cerrar recogida y Reabrir, abriendo el enlace en cada paso. |
| <a id="rf16"></a>RF16 | **Copiar el enlace público** | Cada estudio tiene un enlace público corto y no secuencial, que el investigador copia con un botón. | Esencial | Sprint 04 · Estudios | Entregado | [CT-E16](casos-de-teste.md#ct-e16). Página del estudio › Copiar enlace. |
| <a id="rf17"></a>RF17 | **Eliminar estudio** | El investigador elimina un estudio escribiendo el título; el aviso indica cuántas respuestas se eliminan con él, y se borran versiones, participaciones y respuestas. | Esencial | Sprint 04 · Estudios | Entregado | [CT-E19](casos-de-teste.md#ct-e19). Página del estudio › Eliminar estudio. |
| <a id="rf18"></a>RF18 | **Activar la recogida de datos demográficos** | El investigador decide, en cada estudio, si el enlace muestra la etapa de datos demográficos; viene desactivada. | Importante | Equipo y ayuda | Entregado | [CT-E71](casos-de-teste.md#ct-e71). Crear estudio: active los datos demográficos y abra el enlace: aparece la etapa Datos opcionales. |
| <a id="rf19"></a>RF19 | **Elegir el idioma del estudio** | El investigador elige el idioma en que se escribe el estudio y en que se abre el enlace; los estudios nuevos nacen en el idioma de la cuenta. | Deseable | Idiomas de la herramienta | Entregado | [CT-E45](casos-de-teste.md#ct-e45). Crear estudio: cambie el idioma y abra el enlace. |

### Equipo y notificaciones

| ID | Requisito | Descripción | Prioridad | Sprint | Estado | Cómo verificar |
|---|---|---|---|---|---|---|
| <a id="rf20"></a>RF20 | **Compartir estudio** | El propietario invita a una cuenta registrada, por el correo electrónico, como Editor (modifica el estudio) o Lector (ve y exporta); solo el propietario invita y elimina el estudio. | Deseable | Equipo y ayuda | Entregado | [CT-E63](casos-de-teste.md#ct-e63). Página del estudio › Compartir: invite a la cuenta de otra persona del equipo como Lector. |
| <a id="rf21"></a>RF21 | **Aceptar o rechazar la invitación** | Quien recibe la invitación la acepta o la rechaza, y el estudio solo aparece en su lista después de aceptarla. | Deseable | Equipo y ayuda | Entregado | [CT-E63](casos-de-teste.md#ct-e63). Con la cuenta invitada, abra la campana y acepte la invitación. |
| <a id="rf22"></a>RF22 | **Campana de notificaciones** | La campana avisa de invitaciones, respuestas nuevas (agrupadas mientras no se lean) y cambios hechos por los compañeros. | Deseable | Equipo y ayuda | Entregado | [CT-E63](casos-de-teste.md#ct-e63), [CT-E64](casos-de-teste.md#ct-e64), [CT-M21](casos-de-teste.md#ct-m21). Responda el enlace de un estudio suyo y abra la campana. |
| <a id="rf23"></a>RF23 | **Notificaciones por correo electrónico** | Cada notificación también se envía por correo electrónico, en el idioma de quien la recibe, cuando el envío está configurado; el investigador las desactiva en Mi cuenta. | Deseable | Equipo y ayuda | Entregado | [CT-U59](casos-de-teste.md#ct-u59). Mi cuenta › Notificaciones por correo electrónico (el envío depende de las variables SMTP del .env). |

### Cuestionario del participante

| ID | Requisito | Descripción | Prioridad | Sprint | Estado | Cómo verificar |
|---|---|---|---|---|---|---|
| <a id="rf24"></a>RF24 | **Responder sin cuenta** | El participante responde por el enlace público, sin cuenta ni inicio de sesión, y no encuentra ningún camino hacia el área del investigador. | Esencial | Sprint 05 · Cuestionario | Entregado | [CT-E05](casos-de-teste.md#ct-e05), [CT-E52](casos-de-teste.md#ct-e52). Abra http://localhost:3000/r/exemplo en una ventana de incógnito. |
| <a id="rf25"></a>RF25 | **Consentimiento** | El participante lee el formulario (objetivo, tiempo estimado, qué ocurre después de enviar, riesgos, beneficios, conservación de los datos y quién responde por la investigación), indica la edad y solo participa después de hacer clic en Estoy de acuerdo; quien tiene menos de 18 años confirma la autorización del responsable, No quiero participar sale sin guardar nada, y una copia del formulario se puede imprimir o guardar en PDF. | Esencial | Sprint 05 · Cuestionario | Entregado | [CT-E21](casos-de-teste.md#ct-e21), [CT-E28](casos-de-teste.md#ct-e28), [CT-E91](casos-de-teste.md#ct-e91), [CT-E92](casos-de-teste.md#ct-e92). Abra el enlace del estudio de ejemplo. |
| <a id="rf26"></a>RF26 | **Distribuir a los participantes entre las versiones** | Con más de una versión, cada participante va a la versión con menos respuestas completadas; en caso de empate, a la de menor orden. | Esencial | Sprint 05 · Cuestionario | Entregado | [CT-U30](casos-de-teste.md#ct-u30). Responda el enlace dos veces (en ventanas de incógnito) en un estudio con 2 versiones y compruebe la pestaña Respuestas. |
| <a id="rf27"></a>RF27 | **Responder los 26 ítems** | El participante responde los 26 ítems en el orden y la polaridad oficiales, con la instrucción oficial y 7 posiciones por ítem, ninguna marcada al principio. | Esencial | Sprint 05 · Cuestionario | Entregado | [CT-E21](casos-de-teste.md#ct-e21), [CT-E24](casos-de-teste.md#ct-e24). Estoy de acuerdo y quiero participar: compruebe los 26 ítems. |
| <a id="rf28"></a>RF28 | **Seguir el progreso** | Un pie fijo muestra cuántos ítems se han respondido ya, de 26. | Importante | Sprint 05 · Cuestionario | Entregado | [CT-E22](casos-de-teste.md#ct-e22), [CT-M03](casos-de-teste.md#ct-m03). Marque algunos ítems y mire el pie. |
| <a id="rf29"></a>RF29 | **Avisar de los ítems que faltan** | Al enviar con ítems en blanco, un resumen en la parte superior indica cuáles faltan, con un enlace a cada uno, y no se guarda nada. | Esencial | Sprint 05 · Cuestionario | Entregado | [CT-E23](casos-de-teste.md#ct-e23). Envíe dejando 2 ítems en blanco y use los enlaces del resumen. |
| <a id="rf30"></a>RF30 | **Recuperar las respuestas marcadas** | Si la página se recarga, las respuestas ya marcadas vuelven y un aviso lo indica. | Importante | Sprint 05 · Cuestionario | Entregado | [CT-E26](casos-de-teste.md#ct-e26). Marque algunos ítems y recargue la página. |
| <a id="rf31"></a>RF31 | **Salir sin enviar** | El participante sale en cualquier momento con Salir sin enviar, que pide confirmación en una ventana y no guarda nada. | Esencial | Sprint 05 · Cuestionario | Entregado | [CT-E27](casos-de-teste.md#ct-e27). En el cuestionario, haga clic en Salir sin enviar. |
| <a id="rf32"></a>RF32 | **Datos demográficos opcionales** | Cuando el estudio los recoge, el participante responde franja de edad, género, nivel de estudios y familiaridad en franjas cerradas, todas con Prefiero no responder, y puede omitir la etapa entera. | Importante | Sprint 05 · Cuestionario | Entregado | [CT-E21](casos-de-teste.md#ct-e21). En un estudio con los datos demográficos activados, responda una pregunta y omita las demás. |
| <a id="rf33"></a>RF33 | **Completar y no volver a responder** | Después del envío, el participante ve el agradecimiento, y el mismo navegador no envía otra respuesta al estudio. | Esencial | Sprint 05 · Cuestionario | Entregado | [CT-E21](casos-de-teste.md#ct-e21), [CT-E28](casos-de-teste.md#ct-e28). Termine el cuestionario y abra el enlace de nuevo en el mismo navegador. |
| <a id="rf34"></a>RF34 | **Responder en 37 idiomas** | El enlace se abre en el idioma del estudio o del navegador, el participante lo cambia en el selector entre los 37 idiomas oficiales del UEQ, y los idiomas de derecha a izquierda invierten la página. | Importante | Sprint de idiomas | Entregado | [CT-E45](casos-de-teste.md#ct-e45), [CT-E46](casos-de-teste.md#ct-e46), [CT-U45](casos-de-teste.md#ct-u45), [CT-U50](casos-de-teste.md#ct-u50). En el consentimiento, cambie el idioma a árabe o japonés y responda. |
| <a id="rf35"></a>RF35 | **Traducir los textos del estudio** | El título, el producto y el objetivo escritos por el investigador aparecen traducidos al idioma del participante. | Deseable | Idiomas de la herramienta | Entregado | [CT-U63](casos-de-teste.md#ct-u63). Abra el enlace en otro idioma y compruebe el título y el objetivo (depende de la ANTHROPIC_API_KEY en el .env). |

### Cálculo del UEQ

| ID | Requisito | Descripción | Prioridad | Sprint | Estado | Cómo verificar |
|---|---|---|---|---|---|---|
| <a id="rf36"></a>RF36 | **Recodificar las respuestas** | La herramienta convierte cada respuesta de 1 a 7 a -3 a +3, según la polaridad del ítem. | Esencial | Sprint 02 · Cálculo | Entregado | [CT-U01](casos-de-teste.md#ct-u01), [CT-U02](casos-de-teste.md#ct-u02), [CT-U03](casos-de-teste.md#ct-u03), [CT-U04](casos-de-teste.md#ct-u04), [CT-U05](casos-de-teste.md#ct-u05). Resultados › Exportar › respuestas recodificadas. |
| <a id="rf37"></a>RF37 | **Estadísticas por escala** | Para cada escala y versión, la herramienta calcula n, media, desviación estándar muestral, intervalo de confianza del 95% y alfa de Cronbach estandarizado. | Esencial | Sprint 02 · Cálculo | Entregado | [CT-U07](casos-de-teste.md#ct-u07), [CT-U08](casos-de-teste.md#ct-u08), [CT-U09](casos-de-teste.md#ct-u09), [CT-U10](casos-de-teste.md#ct-u10), [CT-U11](casos-de-teste.md#ct-u11), [CT-U14](casos-de-teste.md#ct-u14). Pestaña Resultados, tabla de escalas. |
| <a id="rf38"></a>RF38 | **Interpretar las medias** | Cada media se lee como positiva (por encima de +0,8), neutra (de -0,8 a +0,8) o negativa (por debajo de -0,8). | Esencial | Sprint 02 · Cálculo | Entregado | [CT-U13](casos-de-teste.md#ct-u13). Pestaña Resultados, columna Interpretación. |
| <a id="rf39"></a>RF39 | **Calidad pragmática y hedónica** | La herramienta calcula la calidad pragmática (media de Perspicuidad, Eficiencia y Confiabilidad) y la hedónica (media de Estimulación y Novedad). | Esencial | Sprint 02 · Cálculo | Entregado | [CT-U20](casos-de-teste.md#ct-u20). Pestaña Resultados, línea debajo de la tabla de escalas. |
| <a id="rf40"></a>RF40 | **Clasificar en el benchmark** | Cada media se clasifica en las 5 franjas del benchmark oficial (excelente, bueno, por encima de la media, por debajo de la media, malo); una media igual al límite cae en la franja inferior. | Esencial | Sprint 02 · Cálculo | Entregado | [CT-U16](casos-de-teste.md#ct-u16), [CT-U17](casos-de-teste.md#ct-u17). Pestaña Resultados, columna Benchmark. |
| <a id="rf41"></a>RF41 | **Media por ítem** | La herramienta calcula la media recodificada y la distribución de 1 a 7 de cada uno de los 26 ítems. | Importante | Sprint 02 · Cálculo | Entregado | [CT-U15](casos-de-teste.md#ct-u15). Pestaña Resultados, gráfico Medias por ítem. |
| <a id="rf42"></a>RF42 | **Calcular solo con quien está en el análisis** | Las estadísticas usan solo las participaciones incluidas en el análisis. | Esencial | Sprint 02 · Cálculo | Entregado | [CT-U18](casos-de-teste.md#ct-u18), [CT-U22](casos-de-teste.md#ct-u22). Quite una respuesta del análisis en la pestaña Respuestas y vea cómo cambia el n en Resultados. |

### Resultados

| ID | Requisito | Descripción | Prioridad | Sprint | Estado | Cómo verificar |
|---|---|---|---|---|---|---|
| <a id="rf43"></a>RF43 | **Panel de resultados** | El investigador ve un resumen de la recogida, el gráfico de las 6 escalas con IC95 y franjas del benchmark, y la tabla con los mismos números. | Esencial | Sprint 06 · Resultados | Entregado | [CT-E29](casos-de-teste.md#ct-e29). Estudio de ejemplo › pestaña Resultados. |
| <a id="rf44"></a>RF44 | **Lectura rápida** | Una frase en la parte superior del panel resume el resultado: las escalas por franja del benchmark y las negativas. | Importante | Sprint 06 · Resultados | Entregado | [CT-U42](casos-de-teste.md#ct-u42). Pestaña Resultados, frase de la parte superior. |
| <a id="rf45"></a>RF45 | **Avisos de alfa bajo y muestra pequeña** | El panel avisa cuando el alfa queda por debajo de 0,7 y cuando la muestra no permite un intervalo de confianza, explicando qué significa y qué hacer. | Importante | Sprint 06 · Resultados | Entregado | [CT-U21](casos-de-teste.md#ct-u21), [CT-E30](casos-de-teste.md#ct-e30). Cree un estudio con una sola respuesta y abra Resultados. |
| <a id="rf46"></a>RF46 | **Gráfico por ítem** | El investigador ve la media de cada ítem entre los dos términos, en el orden oficial o agrupada por escala. | Importante | Sprint 06 · Resultados | Entregado | [CT-E29](casos-de-teste.md#ct-e29). Pestaña Resultados › Medias por ítem: alterne el orden. |
| <a id="rf47"></a>RF47 | **Comparar versiones** | Con más de una versión, el investigador compara las versiones una al lado de la otra en el mismo gráfico, con marcadores de formas diferentes y una lectura de las mayores diferencias. | Esencial | Sprint 06 · Resultados | Entregado | [CT-E29](casos-de-teste.md#ct-e29), [CT-U43](casos-de-teste.md#ct-u43). Pestaña Resultados › Comparar versiones. |
| <a id="rf48"></a>RF48 | **Guardar la vista en la dirección** | La versión elegida y el modo (una versión o comparación) quedan en la dirección de la página, para volver, recargar y compartir. | Importante | Sprint 06 · Resultados | Entregado | [CT-E29](casos-de-teste.md#ct-e29). Elija Comparar versiones y recargue la página. |
| <a id="rf49"></a>RF49 | **Explicar los términos** | Cada término técnico (escalas, IC95, alfa de Cronbach, benchmark) tiene una explicación breve que se abre cerca de donde aparece. | Importante | Sprint 06 · Resultados | Entregado | Pestaña Resultados: abra ¿Qué es la Perspicuidad? |
| <a id="rf50"></a>RF50 | **Ver los datos demográficos** | Cuando el estudio los recoge, una pestaña muestra cada pregunta demográfica en un gráfico con la tabla de los números, con filtro por versión. | Deseable | LGPD | Entregado | [CT-E72](casos-de-teste.md#ct-e72), [CT-U60](casos-de-teste.md#ct-u60). En un estudio con datos demográficos, pestaña Resultados › Datos demográficos. |

### Respuestas y sospechas

| ID | Requisito | Descripción | Prioridad | Sprint | Estado | Cómo verificar |
|---|---|---|---|---|---|---|
| <a id="rf51"></a>RF51 | **Marcar respuestas sospechosas** | Cada participación se marca como sospechosa al completarse cuando tiene 3 o más escalas con amplitud mayor que 3 o más de 15 respuestas iguales. | Esencial | Sprint 07 · Sospechas | Entregado | [CT-U23](casos-de-teste.md#ct-u23), [CT-U25](casos-de-teste.md#ct-u25), [CT-U26](casos-de-teste.md#ct-u26), [CT-U27](casos-de-teste.md#ct-u27), [CT-U28](casos-de-teste.md#ct-u28), [CT-E33](casos-de-teste.md#ct-e33). Estudio de ejemplo › pestaña Respuestas › Mostrar solo sospechosas. |
| <a id="rf52"></a>RF52 | **Tabla de participaciones** | El investigador ve todas las participaciones con fecha, versión, idioma, origen, escalas inconsistentes, mayor número de respuestas iguales, motivo de la sospecha y si está en el análisis, y filtra solo las sospechosas. | Esencial | Sprint 07 · Sospechas | Entregado | [CT-E33](casos-de-teste.md#ct-e33), [CT-E36](casos-de-teste.md#ct-e36). Pestaña Respuestas. |
| <a id="rf53"></a>RF53 | **Ver las escalas de un participante** | Al abrir una participación, el investigador ve la amplitud de cada escala, con las que superaron el umbral destacadas. | Importante | Sprint 07 · Sospechas | Entregado | [CT-E35](casos-de-teste.md#ct-e35). Pestaña Respuestas: abra Ver escalas de una sospechosa. |
| <a id="rf54"></a>RF54 | **Quitar y devolver respuestas al análisis** | El investigador quita del análisis o devuelve a él cada participación, o todas las sospechosas de una vez, sin borrar ningún dato, y el panel muestra cuántas están fuera. | Esencial | Sprint 07 · Sospechas | Entregado | [CT-E33](casos-de-teste.md#ct-e33), [CT-E34](casos-de-teste.md#ct-e34). Pestaña Respuestas: quite una sospechosa del análisis y vuelva a incluirla. |
| <a id="rf55"></a>RF55 | **Recalcular las sospechas** | Un comando recalcula la marca de sospecha de todas las participaciones después de que el equipo ajusta los umbrales del protocolo. | Deseable | Sprint 07 · Sospechas | Entregado | [CT-M16](casos-de-teste.md#ct-m16). Terminal: pnpm suspeitas:recalcular. |

### Exportación e importación

| ID | Requisito | Descripción | Prioridad | Sprint | Estado | Cómo verificar |
|---|---|---|---|---|---|---|
| <a id="rf56"></a>RF56 | **Exportar respuestas en bruto** | El investigador descarga un CSV con las respuestas de 1 a 7 de cada participación, con versión y datos demográficos. | Esencial | Sprint 08 · Exportación | Entregado | [CT-U35](casos-de-teste.md#ct-u35), [CT-E37](casos-de-teste.md#ct-e37). Pestaña Resultados › Exportar › respuestas en bruto. |
| <a id="rf57"></a>RF57 | **Exportar respuestas recodificadas** | El investigador descarga un CSV con las respuestas ya convertidas a -3 a +3. | Esencial | Sprint 08 · Exportación | Entregado | [CT-U37](casos-de-teste.md#ct-u37), [CT-E37](casos-de-teste.md#ct-e37). Pestaña Resultados › Exportar › respuestas recodificadas. |
| <a id="rf58"></a>RF58 | **Exportar resultados por escala** | El investigador descarga un CSV con una línea por escala y versión, con las estadísticas del panel. | Esencial | Sprint 08 · Exportación | Entregado | [CT-U38](casos-de-teste.md#ct-u38), [CT-E37](casos-de-teste.md#ct-e37). Pestaña Resultados › Exportar › resultados por escala. |
| <a id="rf59"></a>RF59 | **Exportar en la hoja oficial del UEQ** | El investigador descarga la propia UEQ Data Analysis Tool V15 rellenada con las participaciones en el análisis (de la versión elegida en el panel o del estudio entero), que se recalcula al abrirla en Excel. | Esencial | Sprint 09 · Revisión final | Entregado | [CT-U34](casos-de-teste.md#ct-u34), [CT-U70](casos-de-teste.md#ct-u70), [CT-E37](casos-de-teste.md#ct-e37), [CT-E96](casos-de-teste.md#ct-e96). Pestaña Resultados › Exportar › Hoja oficial del UEQ (XLSX); abrirla en Excel y hacer clic en Habilitar edición. |
| <a id="rf60"></a>RF60 | **Exportar el panel en PDF** | El investigador descarga el panel de la versión elegida en PDF, con el título del estudio, n y fecha en el encabezado. | Deseable | Sprint 10 · Extensiones | Entregado | [CT-E39](casos-de-teste.md#ct-e39), [CT-E40](casos-de-teste.md#ct-e40). Pestaña Resultados › Panel en PDF. |
| <a id="rf61"></a>RF61 | **Importar respuestas por CSV** | El investigador importa respuestas en el formato de la hoja oficial para una versión, con vista previa y errores señalados por línea, y las respuestas importadas quedan marcadas como tales. | Deseable | Sprint 10 · Extensiones | Entregado | [CT-U39](casos-de-teste.md#ct-u39), [CT-U40](casos-de-teste.md#ct-u40), [CT-U41](casos-de-teste.md#ct-u41), [CT-E42](casos-de-teste.md#ct-e42), [CT-E43](casos-de-teste.md#ct-e43). Pestaña Respuestas › Importar respuestas de un CSV, con data/fixtures/basico/respostas.csv. |
| <a id="rf62"></a>RF62 | **Aplicar el UEQ-S** | El investigador elige, al crear el estudio, entre el UEQ completo y el UEQ-S (versión corta, 8 ítems, calidad pragmática, hedónica y global). La elección se bloquea con la primera respuesta, y la evaluación del UEQ-S queda en una pestaña propia de los resultados, con su benchmark y su hoja oficial. | Deseable | UEQ-S | Entregado | [CT-U53](casos-de-teste.md#ct-u53), [CT-U71](casos-de-teste.md#ct-u71), [CT-U72](casos-de-teste.md#ct-u72), [CT-U73](casos-de-teste.md#ct-u73), [CT-U74](casos-de-teste.md#ct-u74), [CT-U75](casos-de-teste.md#ct-u75), [CT-U76](casos-de-teste.md#ct-u76), [CT-E97](casos-de-teste.md#ct-e97), [CT-E98](casos-de-teste.md#ct-e98), [CT-E99](casos-de-teste.md#ct-e99), [CT-E100](casos-de-teste.md#ct-e100), [CT-E101](casos-de-teste.md#ct-e101), [CT-M26](casos-de-teste.md#ct-m26). Cree un estudio y elija UEQ-S, versión corta en Cuestionario; responda por el enlace y abra Resultados › UEQ-S. El Estudio de ejemplo del UEQ-S (/r/exemplo-curto) ya tiene respuestas. Los 9 escenarios de data/fixtures-ueq-s coinciden con la hoja oficial del UEQ-S recalculada en Excel. |

### Documentación

| ID | Requisito | Descripción | Prioridad | Sprint | Estado | Cómo verificar |
|---|---|---|---|---|---|---|
| <a id="rf63"></a>RF63 | **Pestaña Documentación** | Cualquier persona, con o sin cuenta, lee la documentación del proyecto en una pestaña pública, en 7 secciones; un documento todavía no publicado aparece como En producción. | Importante | Sprint de documentación | Entregado | [CT-E47](casos-de-teste.md#ct-e47), [CT-E48](casos-de-teste.md#ct-e48), [CT-E62](casos-de-teste.md#ct-e62), [CT-U54](casos-de-teste.md#ct-u54). Abra http://localhost:3000/documentacao sin haber iniciado sesión. |
| <a id="rf64"></a>RF64 | **Diagramas a pantalla completa** | Cada diagrama se abre a pantalla completa, con zoom del 50% al 400% y arrastre, y se cierra con Volver o Esc. | Importante | Sprint de documentación | Entregado | [CT-E57](casos-de-teste.md#ct-e57), [CT-U55](casos-de-teste.md#ct-u55). Abra un documento con diagrama y haga clic en él. |
| <a id="rf65"></a>RF65 | **Enlaces y descargas de la documentación** | Los enlaces entre documentos llevan al ancla correcta dentro de la herramienta, y los archivos de la ficha (CSV, hoja de cálculo, fuentes) se descargan sin cuenta. | Importante | Sprint de documentación | Entregado | [CT-E49](casos-de-teste.md#ct-e49), [CT-E51](casos-de-teste.md#ct-e51), [CT-U56](casos-de-teste.md#ct-u56). En la pestaña Documentación, haga clic en un enlace a otro documento y en una descarga. |

### Administración

| ID | Requisito | Descripción | Prioridad | Sprint | Estado | Cómo verificar |
|---|---|---|---|---|---|---|
| <a id="rf66"></a>RF66 | **Gestionar cuentas** | El superusuario abre la página Administración, ve las cuentas y crea una cuenta para otra persona; quien no es superusuario no tiene acceso. | Deseable | Equipo y ayuda | Entregado | Con una cuenta de administrador, menú Administración › Cuentas. |
| <a id="rf67"></a>RF67 | **Escenarios de demostración** | El superusuario crea estudios de demostración con respuestas inventadas, para presentar la herramienta. | Deseable | Equipo y ayuda | Entregado | [CT-U61](casos-de-teste.md#ct-u61). Administración › Escenarios. |
| <a id="rf68"></a>RF68 | **Estado de la protección de datos y de las traducciones** | El superusuario ve si el cifrado de campo está activado y cuánto de cada idioma está ya traducido. | Deseable | Idiomas de la herramienta | Entregado | Administración › Protección de datos y Administración › Idiomas. |

## Requisitos no funcionales

### Accesibilidad

| ID | Requisito | Descripción | Prioridad | Sprint | Estado | Cómo verificar |
|---|---|---|---|---|---|---|
| <a id="rnf01"></a>RNF01 | **WCAG 2.2 AA** | Cada pantalla, también en los estados de error, cumple la WCAG 2.2 nivel AA, base de la ABNT NBR 17225:2025, sin ninguna infracción señalada por axe-core. | Esencial | Sprint 00 · Configuración | Entregado | [CT-E06](casos-de-teste.md#ct-e06), [CT-E14](casos-de-teste.md#ct-e14), [CT-E21](casos-de-teste.md#ct-e21), [CT-E47](casos-de-teste.md#ct-e47). Las pruebas de extremo a extremo ejecutan axe-core en cada pantalla; la checklist manual completa lo que la automatización no ve. |
| <a id="rnf02"></a>RNF02 | **320 px y zoom del 400%** | Ninguna pantalla se desplaza en horizontal con 320 px de ancho o con zoom del 400%, y nada queda cortado. | Esencial | Sprint 05 · Cuestionario | Entregado | [CT-E25](casos-de-teste.md#ct-e25), [CT-E31](casos-de-teste.md#ct-e31), [CT-E36](casos-de-teste.md#ct-e36), [CT-E44](casos-de-teste.md#ct-e44), [CT-E50](casos-de-teste.md#ct-e50), [CT-M08](casos-de-teste.md#ct-m08). En el navegador, zoom del 400% en cada pantalla. |
| <a id="rnf03"></a>RNF03 | **Uso solo con teclado** | Todo flujo funciona solo con teclado, con el foco siempre visible, en orden lógico y nunca tapado por la barra o el pie fijos. | Esencial | Sprint 05 · Cuestionario | Entregado | [CT-E03](casos-de-teste.md#ct-e03), [CT-E22](casos-de-teste.md#ct-e22), [CT-E54](casos-de-teste.md#ct-e54), [CT-M07](casos-de-teste.md#ct-m07). Recorra crear estudio, responder y exportar solo con Tab, flechas, Espacio y Enter. |
| <a id="rnf04"></a>RNF04 | **Lector de pantalla** | Cada ítem del cuestionario se anuncia con número, términos y posición, y todo mensaje de resultado ("Recogida abierta") lo anuncia el lector de pantalla. | Esencial | Sprint 05 · Cuestionario | Entregado | [CT-E24](casos-de-teste.md#ct-e24), [CT-M01](casos-de-teste.md#ct-m01), [CT-M02](casos-de-teste.md#ct-m02), [CT-M04](casos-de-teste.md#ct-m04), [CT-M06](casos-de-teste.md#ct-m06). Responda el cuestionario con NVDA, VoiceOver o TalkBack. |
| <a id="rnf05"></a>RNF05 | **Área táctil** | Cada círculo del cuestionario tiene un área táctil de al menos 44 × 44 px. | Importante | Sprint 05 · Cuestionario | Entregado | [CT-M12](casos-de-teste.md#ct-m12). Responda en el móvil, con el pulgar. |
| <a id="rnf06"></a>RNF06 | **Contraste** | Todo texto tiene un contraste de al menos 4,5:1, y los bordes de campo, el foco y los marcadores de gráfico, de al menos 3:1. | Esencial | Sprint 00 · Configuración | Entregado | [CT-U51](casos-de-teste.md#ct-u51), [CT-U52](casos-de-teste.md#ct-u52). Prueba automática de contraste de los tokens de color. |
| <a id="rnf07"></a>RNF07 | **Información más allá del color** | Ninguna información depende solo del color: los gráficos siguen siendo legibles con daltonismo simulado y en alto contraste. | Esencial | Sprint 06 · Resultados | Entregado | [CT-E32](casos-de-teste.md#ct-e32), [CT-M09](casos-de-teste.md#ct-m09), [CT-M10](casos-de-teste.md#ct-m10). DevTools › Rendering › Emulate vision deficiencies, en la pestaña Resultados. |
| <a id="rnf08"></a>RNF08 | **Gráficos con texto equivalente** | Todo gráfico tiene una descripción en texto y una tabla visible con los mismos números. | Esencial | Sprint 06 · Resultados | Entregado | [CT-E29](casos-de-teste.md#ct-e29), [CT-M05](casos-de-teste.md#ct-m05). Pestaña Resultados: compruebe la tabla debajo de cada gráfico. |

### Fidelidad al instrumento

| ID | Requisito | Descripción | Prioridad | Sprint | Estado | Cómo verificar |
|---|---|---|---|---|---|---|
| <a id="rnf09"></a>RNF09 | **Cuestionario sin sesgo de interfaz** | Las 7 posiciones tienen el mismo peso visual, sin número ni color graduado, ninguna viene marcada, y todos los ítems tienen el mismo diseño. | Esencial | Sprint 05 · Cuestionario | Entregado | [CT-E24](casos-de-teste.md#ct-e24). Compruebe los ítems en el ordenador y en el móvil. |
| <a id="rnf10"></a>RNF10 | **Términos oficiales** | Los 26 pares de términos usan siempre la traducción oficial del paquete de idiomas del UEQ, nunca una traducción automática. | Esencial | Sprint de idiomas | Entregado | [CT-U45](casos-de-teste.md#ct-u45), [CT-U46](casos-de-teste.md#ct-u46), [CT-U47](casos-de-teste.md#ct-u47). Compare los términos del cuestionario con el paquete oficial de idiomas del UEQ. |
| <a id="rnf11"></a>RNF11 | **Cálculo igual al de la hoja oficial** | Todos los números de la herramienta coinciden con la UEQ Data Analysis Tool, con una tolerancia de 1e-6. | Esencial | Sprint 09 · Revisión final | Entregado | [CT-U29](casos-de-teste.md#ct-u29), [CT-E96](casos-de-teste.md#ct-e96), [CT-M15](casos-de-teste.md#ct-m15). Los 11 escenarios de data/fixtures coinciden con la hoja oficial recalculada en Excel ([verificación del cálculo](verificacao-do-calculo.md#comparação-com-a-planilha-oficial)). |

### Seguridad y privacidad

| ID | Requisito | Descripción | Prioridad | Sprint | Estado | Cómo verificar |
|---|---|---|---|---|---|---|
| <a id="rnf12"></a>RNF12 | **Anonimato del participante** | La herramienta no recoge nada que identifique al participante: nombre, correo electrónico, IP, navegador detallado o cookie de rastreo. | Esencial | Sprint 05 · Cuestionario | Entregado | [CT-E21](casos-de-teste.md#ct-e21). Compruebe en el modelo de la base de datos que la participación no tiene esos campos. |
| <a id="rnf13"></a>RNF13 | **Recogida mínima** | Los datos demográficos vienen desactivados en cada estudio, y las participaciones empezadas y no enviadas se borran en un plazo de 2 días. | Importante | LGPD | Entregado | Cree un estudio y compruebe que los datos demográficos empiezan desactivados. |
| <a id="rnf14"></a>RNF14 | **Cifrado de los datos demográficos** | Los datos demográficos se guardan cifrados con AES-256-GCM, con la clave fuera de la base de datos. | Importante | LGPD | Entregado | [CT-U58](casos-de-teste.md#ct-u58). Administración › Protección de datos muestra si el cifrado está activado. |
| <a id="rnf15"></a>RNF15 | **Contraseña y sesión protegidas** | Las contraseñas se guardan con bcrypt, la sesión usa una cookie httpOnly, Secure y SameSite=Lax, y la base de datos guarda solo el hash de la sesión. | Esencial | Sprint 03 · Autenticación | Entregado | [CT-E10](casos-de-teste.md#ct-e10). En DevTools › Application › Cookies, compruebe los atributos de la cookie de sesión. |
| <a id="rnf16"></a>RNF16 | **Límite de intentos de inicio de sesión** | Después de 5 contraseñas erróneas para el mismo correo electrónico en 15 minutos, la herramienta bloquea nuevos intentos durante un tiempo. | Importante | LGPD | Entregado | [CT-E80](casos-de-teste.md#ct-e80). Equivóquese en la contraseña 6 veces seguidas con la misma cuenta. |
| <a id="rnf17"></a>RNF17 | **Acceso solo a los estudios propios** | Cada investigador solo ve, modifica y exporta sus propios estudios y los compartidos con él; ni el administrador ve los estudios de los demás. | Esencial | Sprint 04 · Estudios | Entregado | [CT-E20](casos-de-teste.md#ct-e20), [CT-E38](casos-de-teste.md#ct-e38), [CT-E41](casos-de-teste.md#ct-e41). Con otra cuenta, abra la dirección de un estudio que no es suyo. |
| <a id="rnf18"></a>RNF18 | **Protecciones del navegador** | La herramienta usa HTTPS con HSTS y envía Content Security Policy y las demás cabeceras de seguridad. | Importante | LGPD | Entregado | [CT-E73](casos-de-teste.md#ct-e73). En la versión publicada, DevTools › Network › cabeceras de la respuesta. |
| <a id="rnf19"></a>RNF19 | **Política de privacidad** | Una política de privacidad pública explica qué se guarda, para qué y cómo se protege, conforme a la LGPD. | Importante | LGPD | Entregado | [CT-E74](casos-de-teste.md#ct-e74), [CT-E75](casos-de-teste.md#ct-e75), [CT-E76](casos-de-teste.md#ct-e76), [CT-E77](casos-de-teste.md#ct-e77), [CT-E78](casos-de-teste.md#ct-e78), [CT-E79](casos-de-teste.md#ct-e79), [CT-E82](casos-de-teste.md#ct-e82), [CT-E83](casos-de-teste.md#ct-e83), [CT-M23](casos-de-teste.md#ct-m23), [CT-M25](casos-de-teste.md#ct-m25). Abra http://localhost:3000/privacidade. |

### Usabilidad

| ID | Requisito | Descripción | Prioridad | Sprint | Estado | Cómo verificar |
|---|---|---|---|---|---|---|
| <a id="rnf20"></a>RNF20 | **Respuesta a cada acción** | Cada acción del investigador confirma el resultado y la consecuencia en un mensaje anunciado ("Recogida abierta. El enlace ya acepta respuestas."). | Importante | Sprint 04 · Estudios | Entregado | [CT-E09](casos-de-teste.md#ct-e09), [CT-E15](casos-de-teste.md#ct-e15), [CT-E16](casos-de-teste.md#ct-e16), [CT-M06](casos-de-teste.md#ct-m06). Abra la recogida de un estudio y lea el mensaje. |
| <a id="rnf21"></a>RNF21 | **Confirmación antes de perder datos** | Salir y toda eliminación piden confirmación explicando lo que va a ocurrir, y eliminar una cuenta o un estudio exige escribir el correo electrónico o el título. | Importante | Sprint 04 · Estudios | Entregado | [CT-E11](casos-de-teste.md#ct-e11), [CT-E19](casos-de-teste.md#ct-e19), [CT-E27](casos-de-teste.md#ct-e27). Intente eliminar un estudio. |
| <a id="rnf22"></a>RNF22 | **Formato brasileño de números y fechas** | En portugués, los números usan coma decimal y las fechas usan dd/mm/aaaa, en pantalla y en las exportaciones. | Importante | Sprint 06 · Resultados | Entregado | [CT-U33](casos-de-teste.md#ct-u33), [CT-U44](casos-de-teste.md#ct-u44). Pestaña Resultados y el CSV de resultados. |

### Plataforma y mantenimiento

| ID | Requisito | Descripción | Prioridad | Sprint | Estado | Cómo verificar |
|---|---|---|---|---|---|---|
| <a id="rnf23"></a>RNF23 | **Ordenador y móvil** | La herramienta funciona en el navegador del ordenador y del móvil; cada prueba de extremo a extremo se ejecuta en los dos. | Esencial | Sprint 00 · Configuración | Entregado | [CT-M12](casos-de-teste.md#ct-m12). Abra el enlace del participante en el móvil. |
| <a id="rnf24"></a>RNF24 | **Aplicación web de código abierto** | La herramienta es una aplicación web (Next.js y PostgreSQL), con el código en GitHub bajo la licencia MIT. | Esencial | Sprint 00 · Configuración | Entregado | [CT-M19](casos-de-teste.md#ct-m19). En un clon limpio, siga el apartado Como rodar del README. |
| <a id="rnf25"></a>RNF25 | **Cálculo aislado y probado** | El cálculo del UEQ está en un módulo de funciones puras (src/ueq), sin base de datos ni interfaz, cubierto por pruebas unitarias. | Importante | Sprint 02 · Cálculo | Entregado | [CT-U01](casos-de-teste.md#ct-u01), [CT-U12](casos-de-teste.md#ct-u12), [CT-U14](casos-de-teste.md#ct-u14), [CT-U22](casos-de-teste.md#ct-u22). Terminal: pnpm test. |
| <a id="rnf26"></a>RNF26 | **Verificaciones antes de integrar** | Ningún pull request entra en main sin que pasen el lint, la comprobación de tipos y las pruebas unitarias. | Importante | Sprint 00 · Configuración | Entregado | Terminal: pnpm lint && pnpm typecheck && pnpm test. |

## Resumen

| Tipo | Esencial | Importante | Deseable | Entregado | Pendiente | Retirado | Total |
|---|---|---|---|---|---|---|---|
| Funcional | 31 | 20 | 17 | 68 | 0 | 0 | 68 |
| No funcional | 15 | 11 | 0 | 26 | 0 | 0 | 26 |
| Total | 46 | 31 | 17 | 94 | 0 | 0 | 94 |
