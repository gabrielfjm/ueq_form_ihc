# Documentación de la Herramienta UEQ

La Herramienta UEQ es una aplicación web de código abierto para llevar a cabo estudios de experiencia de usuario con el *User Experience Questionnaire* (UEQ), desde el registro del estudio hasta la exportación de los datos. Esta documentación explica qué hace la herramienta, para quién, cómo se construyó y cómo se sabe que funciona.

Todo está en formatos abiertos y se muestra directamente en GitHub: Markdown, CSV y diagramas en Mermaid, con el archivo fuente de cada diagrama en [`fontes/`](fontes/). La hoja de requisitos también está en `.xlsx`, para abrirla en Excel o en LibreOffice. Los mismos archivos aparecen dentro de la herramienta, en la pestaña **Documentación**, abierta a cualquier persona, sin iniciar sesión.

El código y esta documentación están bajo la [licencia MIT](../../LICENSE). El material oficial del UEQ en `data/` pertenece a los autores del cuestionario (véase la sección Licencia del [README](../../README.md#licença)).

Proyecto de la asignatura Fundamentos de la Interacción Humano-Computadora, PPGIa · PUCPR · 2026. Equipo: Gabriel Meira, Jean Weiss y Luiza Pedralli.

## Contenido

| Sección | Documento | Qué contiene |
|---|---|---|
| Requisitos | [Requisitos](requisitos.md) | Los 68 requisitos funcionales y los 26 no funcionales, con prioridad, sprint de entrega, estado y cómo verificarlos. También en [requisitos.csv](requisitos.csv) |
| Requisitos | [Matriz de trazabilidad](matriz-rastreabilidade.md) | Cada requisito vinculado a historias, casos de uso, personas, casos de prueba, sprint y código. También en [matriz-rastreabilidade.csv](matriz-rastreabilidade.csv) |
| Requisitos | [Hoja de requisitos](planilha-requisitos.xlsx) | Requisitos, sprints, historias, casos de uso, matriz, escenarios y casos de prueba, una pestaña para cada uno, con filtros |
| Usuarios | [Personas](personas.md) | Ocho personas: tres de investigador, cuatro de participante y una de quien mantiene la instalación |
| Usuarios | [Historias de usuario](historias-de-usuario.md) | 44 historias con criterios de aceptación. También en [historias-de-usuario.csv](historias-de-usuario.csv) |
| Modelado | [Casos de uso](casos-de-uso.md) | Cuatro diagramas UML, la lista de los 33 casos de uso y la especificación de los principales |
| Modelado | [Diagrama de clases](diagrama-de-classes.md) | El modelo de dominio y el módulo de cálculo del UEQ |
| Modelado | [Modelo lógico de la base de datos](modelo-logico.md) | Las 11 tablas de PostgreSQL, con columnas, claves y lo que arrastra cada eliminación |
| Modelado | [Diagramas de secuencia](diagramas-de-sequencia.md) | Ocho flujos desde el clic hasta la base de datos: entrar, responder, ver resultados, quitar del análisis, PDF, importar, invitar y traducir |
| Arquitectura | [Arquitectura](arquitetura.md) | Modelo C4 (contexto, contenedores y componentes), seguridad, decisiones e implantación |
| Pruebas | [Casos y escenarios de prueba](casos-de-teste.md) | Estrategia, 25 escenarios y 206 casos (de extremo a extremo, unitarios y manuales), con los requisitos que verifica cada uno y el resultado de la última ejecución. También en [casos-de-teste.csv](casos-de-teste.csv) |
| Pruebas | [Verificación del cálculo](verificacao-do-calculo.md) | El cálculo de la herramienta rehecho a mano con el estudio de ejemplo y comparado con la hoja oficial del UEQ en 11 escenarios y con la del UEQ-S en 9: medias, desviación estándar, IC95, alfa, benchmark, sospechas y exportaciones |
| Pruebas | [Checklist manual](../checklist-manual.md) | Lo que el equipo comprueba con sus propias manos: lector de pantalla, zoom, móvil real, daltonismo |
| Pruebas | [Guion de la revisión](../roteiro-revisao.md) | Qué abrir, qué hacer en cada pantalla y cómo anotar los problemas |
| Especificación | [Protocolo UEQ](../ueq-protocolo.md) | Ítems, escalas, polaridad y todas las fórmulas del cálculo, comprobadas en el handbook y en la hoja oficial |
| Especificación | [Fundamentos de IHC](../ihc.md) | Requisitos de usabilidad y accesibilidad, cada uno vinculado al principio de la literatura que lo justifica |
| Especificación | [Decisiones de interfaz](../rastreabilidade-ihc.md) | Cada decisión de interfaz, el principio, el código y la prueba que lo demuestra |
| Especificación | [Idiomas](../idiomas.md) | Los 37 idiomas del cuestionario, de dónde viene cada texto y las correcciones en los términos oficiales |
| Especificación | [Identidad visual](../design.md) | Colores, tipografía, diseño, iconos y tono de voz |
| Especificación | [Convenciones de código](../codigo.md) | Nombres, comentarios, estructura, pruebas y commits |

## Por dónde empezar

- **¿Va a usar la herramienta en un estudio?** Lea las [personas](personas.md) de investigador, el caso de uso [Responder el cuestionario](casos-de-uso.md#uc14) para ver por lo que pasará el participante y el [Protocolo UEQ](../ueq-protocolo.md) para saber cómo se calcula cada número.
- **¿Va a evaluar el proyecto?** Empiece por los [requisitos](requisitos.md), la [matriz de trazabilidad](matriz-rastreabilidade.md) y los [casos de prueba](casos-de-teste.md). La [verificación del cálculo](verificacao-do-calculo.md) muestra el cálculo rehecho a mano, y las [decisiones de interfaz](../rastreabilidade-ihc.md) vinculan cada pantalla a un principio de IHC.
- **¿Va a contribuir con código?** Lea la [arquitectura](arquitetura.md), el [diagrama de clases](diagrama-de-classes.md), el [modelo lógico](modelo-logico.md), la [estrategia de prueba](casos-de-teste.md#estratégia) y las [convenciones de código](../codigo.md). Antes de cambiar un comportamiento, busque el archivo en la [matriz](matriz-rastreabilidade.md) para ver qué requisito y qué prueba dependen de él.

## Identificadores

| Prefijo | Qué identifica | Ejemplo |
|---|---|---|
| RF | Requisito funcional | [RF27](requisitos.md#rf27) Responder los 26 ítems |
| RNF | Requisito no funcional | [RNF01](requisitos.md#rnf01) WCAG 2.2 AA |
| PE | Persona | [PE04](personas.md#pe04) Célia |
| HU | Historia de usuario | [HU35](historias-de-usuario.md#hu35) Responder con lector de pantalla |
| UC | Caso de uso | [UC14](casos-de-uso.md#uc14) Responder el cuestionario |
| CN | Escenario de prueba | [CN06](casos-de-teste.md#cn06) Accesibilidad del cuestionario |
| CT-E, CT-U, CT-M | Caso de prueba de extremo a extremo, unitario o manual | [CT-E22](casos-de-teste.md#ct-e22) Flujo completo solo con teclado |

Los identificadores son fijos: un elemento que se retira conserva su número reservado, porque los demás documentos lo citan por el número.

## Situación a 17/11/2026

- **Requisitos:** los 94 están entregados. El último fue el [RF62](requisitos.md#rf62), Aplicar el UEQ-S, el 18/11/2026.
- **Pruebas automáticas:** los resultados de la última ejecución están en [casos de prueba](casos-de-teste.md#execução-de-17112026).
- **Cálculo:** la [verificación del cálculo](verificacao-do-calculo.md) rehízo a mano todas las estadísticas del estudio de ejemplo, y los 336 números coincidieron con la herramienta. En la comparación con la propia hoja oficial, los 11 escenarios de prueba coinciden en los 6.543 valores, y los 9 del UEQ-S en los 8.520 valores de su hoja oficial. Las hojas que exporta la herramienta se recalculan en Excel con los mismos números.
- **En producción:** https://ferramenta-ueq.vercel.app.

## Cómo mantenerla

Cuando un pull request cambie el comportamiento de la herramienta:

1. Actualice el requisito en [requisitos.md](requisitos.md), en [requisitos.csv](requisitos.csv) y en la [hoja](planilha-requisitos.xlsx). Un requisito nuevo recibe el siguiente número libre; un requisito retirado queda con el estado Retirado.
2. Vincule el requisito a al menos una historia y un caso de uso, y actualice la [matriz](matriz-rastreabilidade.md) con el archivo y la prueba.
3. Una prueba nueva se convierte en un caso en [casos-de-teste.md](casos-de-teste.md) y en el CSV: el título del `test(...)` o del `it(...)` es el resultado esperado, y el caso cita los requisitos que verifica.
4. Si cambia un diagrama Mermaid, ejecute `pnpm docs:diagramas` para generar el SVG que muestra la pestaña Documentación y el archivo fuente en `fontes/`. Una prueba unitaria falla si se olvida. Debajo de cada diagrama, actualice la versión de la herramienta que representa.
5. Un documento nuevo entra en el catálogo de `src/lib/documentacao/catalogo.ts`, en su sección y en la lista `PRONTOS`.

Los formatos de un mismo contenido (Markdown, CSV y XLSX) cambian juntos.
