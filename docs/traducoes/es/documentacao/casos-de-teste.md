# Casos y escenarios de prueba

Las pruebas que ya existen en la Herramienta UEQ, organizadas en **25 escenarios** y **206 casos de prueba**: 102 de extremo a extremo, 78 unitarios y 26 manuales. Cada caso indica el archivo de la prueba, los requisitos que verifica y el resultado de la última ejecución.

La misma lista está en [casos-de-teste.csv](casos-de-teste.csv). Cada escenario y cada caso citan los [requisitos](requisitos.md) que verifican; el camino inverso, de cada requisito a los casos que lo demuestran, está en la [matriz de trazabilidad](matriz-rastreabilidade.md).

## Ejecución del 18/11/2026

| Nivel | Herramienta | Casos | Ejecuciones | Aprobadas | Omitidas | Fallidas |
|---|---|---|---|---|---|---|
| De extremo a extremo | Playwright 1.64 + axe-core 4.14 | 102 | 224 | 221 | 3 | 0 |
| Unitario | Vitest 5 | 78 | 538 | 538 | 0 | 0 |
| Manual | Personas y Excel | 26 | 2 | 2 | — | — |

- **De extremo a extremo:** cada caso se ejecuta dos veces, en Chrome de escritorio y en Chrome de móvil (Pixel 7); el [CT-E96](#ct-e96) y el [CT-E98](#ct-e98) se ejecutan una vez por escenario en cada uno. La suite completa se aprobó a la primera (217 ejecuciones, ningún fallo); el [CT-E101](#ct-e101), escrito después para los criterios AA en las pantallas del UEQ-S, se aprobó en los dos proyectos junto con los demás casos del UEQ-S. Tras los términos oficiales del UEQ-S por idioma, la suite completa se ejecutó de nuevo con el [CT-E102](#ct-e102): 221 ejecuciones aprobadas, ninguna fallida. Las ejecuciones omitidas lo son a propósito: [CT-E62](casos-de-teste.md#ct-e62) solo se ejecuta cuando hay un documento en producción, y hoy todos están publicados; [CT-E67](casos-de-teste.md#ct-e67) se ejecuta solo en escritorio.
- **Unitario:** algunos casos están parametrizados (uno por idioma, uno por par de colores, uno por escenario de la hoja oficial), por eso hay más ejecuciones que casos. Ningún caso queda omitido: los del UEQ-S ([CT-U53](#ct-u53)) pasaron a ejecutarse con los ítems y el benchmark oficiales en `data/`.
- **Manual:** de los casos manuales, solo el [CT-M15](#ct-m15) y el [CT-M26](#ct-m26) se ejecutaron, con Excel automatizado por `scripts/planilha-oficial.ps1` y `scripts/planilha-oficial-ueq-s.ps1`; los otros 24 no se ejecutaron en esta ronda ([Limitaciones](#limitações)).
- **Entorno:** servidor de desarrollo y PostgreSQL local. La ejecución no prueba la producción en Vercel, la API de Claude ni el envío de correo electrónico.

## Estrategia

### Niveles

| Nivel | Qué verifica | Dónde está | Cómo se ejecuta |
|---|---|---|---|
| Unitario | Funciones puras: cálculo del UEQ, reglas de sospecha, CSV, importación, lectura rápida, idiomas, contraste de los colores, cifrado, plantilla de correo electrónico, catálogo de textos, revisión de la traducción automática (con la API simulada) y documentación | `src/**/__tests__/*.test.ts` | `pnpm test` (Vitest, entorno Node, sin base de datos) |
| De extremo a extremo | La herramienta completa en el navegador, tal como la usa la persona: pantallas, base de datos, cookies, descargas y accesibilidad | `tests/e2e/*.spec.ts` | `pnpm test:e2e` (Playwright, con base de datos y servidor) |
| Accesibilidad automática | Infracciones WCAG 2.2 A y AA en cada pantalla y en cada estado de error | `tests/e2e/acessibilidade.ts` (`verificarAcessibilidade`) | Dentro de las pruebas de extremo a extremo |
| Manual | Lo que la automatización no ve: lector de pantalla real, móvil real, zoom, espaciado de texto, comprensión y opinión de los usuarios | [docs/checklist-manual.md](../checklist-manual.md), [docs/roteiro-revisao.md](../roteiro-revisao.md) | Por el equipo, antes de la entrega |

### Entorno y datos

- **Proyectos de Playwright:** `desktop` (Desktop Chrome) y `celular` (Pixel 7). Todo caso de extremo a extremo se ejecuta en los dos.
- **Servidor:** Playwright levanta `pnpm dev` en http://localhost:3000 o reutiliza el que ya esté en ejecución. La base de datos es el PostgreSQL de `docker compose`.
- **Aislamiento:** cada caso crea su propio investigador, con correo electrónico en `@e2e.exemplo.com`, y su propio estudio. Por eso los casos se ejecutan en paralelo (4 workers) sin depender unos de otros. Al final, `tests/e2e/limpeza.ts` borra solo las cuentas de ese dominio, nunca la cuenta de desarrollo.
- **Datos de prueba:** los 11 escenarios de [data/fixtures/](../../data/fixtures/LEIA-ME.md), en el formato de la hoja oficial y con los resultados de la hoja oficial en `esperado.json`: `basico` (20 participantes, ninguno sospechoso), `inconsistente` (15, con las filas 1, 6, 9 y 13 sospechosas), `extremos` (todos 1, todos 7, n = 1 y n = 2), `oficial-exemplo` (los 255 de la propia hoja), `grande` (1000), `bordas` (los límites de las reglas de sospecha), `variancia-zero` y `negativo`. Las pruebas del panel graban las fixtures directamente en la base de datos (`inserirRespostas` en `tests/e2e/preparacao.ts`), porque el flujo del participante ya tiene sus propios casos. Para el UEQ-S, los 9 escenarios de [data/fixtures-ueq-s/](../../data/fixtures-ueq-s/LEIA-ME.md), con los resultados de la hoja oficial del UEQ-S, dos de ellos tomados de escenarios del UEQ completo.
- **Tiempo:** 15 s de espera por verificación y 60 s por prueba (120 s en las que crean estudio y respuestas), porque el servidor de desarrollo compila cada ruta en la primera visita.

### Criterios

- Ningún pull request se integra sin que `pnpm lint && pnpm typecheck && pnpm test` se aprueben.
- Una pantalla solo está lista cuando axe-core no encuentra infracciones WCAG 2.2 A o AA, incluso en los estados de error.
- Los números del cálculo tienen que coincidir con la hoja oficial con una tolerancia de 1e-6.
- El nombre de una prueba es la frase del comportamiento esperado, en portugués ([docs/codigo.md](../codigo.md)). Por eso el título en el código es también el resultado esperado de cada caso unitario.

### Cómo ejecutar

```
docker compose up -d        # banco
pnpm test                   # unidade
pnpm test:e2e               # ponta a ponta, desktop e celular
pnpm exec playwright test tests/e2e/questionario.spec.ts --project=celular   # um arquivo, um projeto
pnpm exec playwright show-report   # relatório com as capturas de daltonismo do CT-E32
```

## Escenarios

| ID | Escenario | Objetivo | Requisitos | Casos de prueba | Situación |
|---|---|---|---|---|---|
| <a id="cn01"></a>CN01 | **Acceso y autenticación** | Registrarse, iniciar sesión, cerrar sesión y proteger el área del investigador, solo con teclado y sin infracciones de accesibilidad | [RF01](requisitos.md#rf01), [RF02](requisitos.md#rf02), [RF03](requisitos.md#rf03), [RF11](requisitos.md#rf11), [RNF01](requisitos.md#rnf01), [RNF03](requisitos.md#rnf03), [RNF20](requisitos.md#rnf20) | [CT-E01](casos-de-teste.md#ct-e01), [CT-E02](casos-de-teste.md#ct-e02), [CT-E03](casos-de-teste.md#ct-e03), [CT-E04](casos-de-teste.md#ct-e04), [CT-E06](casos-de-teste.md#ct-e06), [CT-E07](casos-de-teste.md#ct-e07), [CT-E08](casos-de-teste.md#ct-e08), [CT-E90](casos-de-teste.md#ct-e90) | Aprobado |
| <a id="cn02"></a>CN02 | **Mi cuenta** | Editar los datos, cambiar la contraseña cerrando las demás sesiones y eliminar la cuenta con confirmación | [RF04](requisitos.md#rf04), [RF05](requisitos.md#rf05), [RF06](requisitos.md#rf06), [RNF15](requisitos.md#rnf15), [RNF20](requisitos.md#rnf20), [RNF21](requisitos.md#rnf21) | [CT-E09](casos-de-teste.md#ct-e09), [CT-E10](casos-de-teste.md#ct-e10), [CT-E11](casos-de-teste.md#ct-e11) | Aprobado |
| <a id="cn03"></a>CN03 | **Gestión de estudios** | Crear, listar, editar, abrir, cerrar, reabrir, copiar el enlace y eliminar estudios | [RF12](requisitos.md#rf12), [RF13](requisitos.md#rf13), [RF14](requisitos.md#rf14), [RF15](requisitos.md#rf15), [RF16](requisitos.md#rf16), [RF17](requisitos.md#rf17), [RNF01](requisitos.md#rnf01), [RNF20](requisitos.md#rnf20), [RNF21](requisitos.md#rnf21) | [CT-E12](casos-de-teste.md#ct-e12), [CT-E13](casos-de-teste.md#ct-e13), [CT-E14](casos-de-teste.md#ct-e14), [CT-E15](casos-de-teste.md#ct-e15), [CT-E16](casos-de-teste.md#ct-e16), [CT-E17](casos-de-teste.md#ct-e17), [CT-E18](casos-de-teste.md#ct-e18), [CT-E19](casos-de-teste.md#ct-e19), [CT-E88](casos-de-teste.md#ct-e88), [CT-E89](casos-de-teste.md#ct-e89), [CT-E93](casos-de-teste.md#ct-e93) | Aprobado |
| <a id="cn04"></a>CN04 | **Aislamiento y protección de datos** | Garantizar que un investigador no vea ni exporte el estudio de otro y que el participante nunca necesite sesión | [RF24](requisitos.md#rf24), [RF60](requisitos.md#rf60), [RNF17](requisitos.md#rnf17) | [CT-E05](casos-de-teste.md#ct-e05), [CT-E20](casos-de-teste.md#ct-e20), [CT-E38](casos-de-teste.md#ct-e38), [CT-E41](casos-de-teste.md#ct-e41) | Aprobado |
| <a id="cn05"></a>CN05 | **Participación en el estudio** | Recorrer el enlace del participante desde el consentimiento hasta el final, incluso rechazar, desistir, recargar e intentar responder de nuevo | [RF18](requisitos.md#rf18), [RF24](requisitos.md#rf24), [RF25](requisitos.md#rf25), [RF26](requisitos.md#rf26), [RF27](requisitos.md#rf27), [RF29](requisitos.md#rf29), [RF30](requisitos.md#rf30), [RF31](requisitos.md#rf31), [RF32](requisitos.md#rf32), [RF33](requisitos.md#rf33), [RF34](requisitos.md#rf34), [RNF01](requisitos.md#rnf01), [RNF12](requisitos.md#rnf12), [RNF19](requisitos.md#rnf19), [RNF21](requisitos.md#rnf21) | [CT-U30](casos-de-teste.md#ct-u30), [CT-E21](casos-de-teste.md#ct-e21), [CT-E23](casos-de-teste.md#ct-e23), [CT-E26](casos-de-teste.md#ct-e26), [CT-E27](casos-de-teste.md#ct-e27), [CT-E28](casos-de-teste.md#ct-e28), [CT-E52](casos-de-teste.md#ct-e52), [CT-E71](casos-de-teste.md#ct-e71), [CT-E82](casos-de-teste.md#ct-e82), [CT-E83](casos-de-teste.md#ct-e83), [CT-E91](casos-de-teste.md#ct-e91) | Aprobado |
| <a id="cn06"></a>CN06 | **Accesibilidad del cuestionario** | Responder solo con teclado y lector de pantalla, en 320 px, con el foco siempre visible y el instrumento intacto | [RF27](requisitos.md#rf27), [RF28](requisitos.md#rf28), [RNF02](requisitos.md#rnf02), [RNF03](requisitos.md#rnf03), [RNF04](requisitos.md#rnf04), [RNF09](requisitos.md#rnf09) | [CT-E22](casos-de-teste.md#ct-e22), [CT-E24](casos-de-teste.md#ct-e24), [CT-E25](casos-de-teste.md#ct-e25) | Aprobado |
| <a id="cn07"></a>CN07 | **Idiomas** | Responder en otro idioma, por el navegador o por el selector, incluso de derecha a izquierda, y que el investigador vea el idioma | [RF19](requisitos.md#rf19), [RF30](requisitos.md#rf30), [RF34](requisitos.md#rf34), [RF52](requisitos.md#rf52), [RF61](requisitos.md#rf61), [RNF04](requisitos.md#rnf04), [RNF10](requisitos.md#rnf10) | [CT-U36](casos-de-teste.md#ct-u36), [CT-U45](casos-de-teste.md#ct-u45), [CT-U46](casos-de-teste.md#ct-u46), [CT-U47](casos-de-teste.md#ct-u47), [CT-U48](casos-de-teste.md#ct-u48), [CT-U49](casos-de-teste.md#ct-u49), [CT-U50](casos-de-teste.md#ct-u50), [CT-E45](casos-de-teste.md#ct-e45), [CT-E46](casos-de-teste.md#ct-e46), [CT-E68](casos-de-teste.md#ct-e68) | Aprobado |
| <a id="cn08"></a>CN08 | **Cálculo UEQ** | Comprobar la recodificación, la estadística, las escalas, el alfa, el benchmark y los grupos en funciones puras, con los casos límite | [RF27](requisitos.md#rf27), [RF36](requisitos.md#rf36), [RF37](requisitos.md#rf37), [RF38](requisitos.md#rf38), [RF39](requisitos.md#rf39), [RF40](requisitos.md#rf40), [RF41](requisitos.md#rf41), [RF42](requisitos.md#rf42), [RF45](requisitos.md#rf45), [RNF10](requisitos.md#rnf10), [RNF25](requisitos.md#rnf25) | [CT-U01](casos-de-teste.md#ct-u01), [CT-U02](casos-de-teste.md#ct-u02), [CT-U03](casos-de-teste.md#ct-u03), [CT-U04](casos-de-teste.md#ct-u04), [CT-U05](casos-de-teste.md#ct-u05), [CT-U06](casos-de-teste.md#ct-u06), [CT-U07](casos-de-teste.md#ct-u07), [CT-U08](casos-de-teste.md#ct-u08), [CT-U09](casos-de-teste.md#ct-u09), [CT-U10](casos-de-teste.md#ct-u10), [CT-U11](casos-de-teste.md#ct-u11), [CT-U12](casos-de-teste.md#ct-u12), [CT-U13](casos-de-teste.md#ct-u13), [CT-U14](casos-de-teste.md#ct-u14), [CT-U15](casos-de-teste.md#ct-u15), [CT-U16](casos-de-teste.md#ct-u16), [CT-U17](casos-de-teste.md#ct-u17), [CT-U18](casos-de-teste.md#ct-u18), [CT-U20](casos-de-teste.md#ct-u20), [CT-U21](casos-de-teste.md#ct-u21), [CT-U22](casos-de-teste.md#ct-u22), [CT-M17](casos-de-teste.md#ct-m17) | Aprobado, con elementos pendientes |
| <a id="cn09"></a>CN09 | **Respuestas sospechosas** | Detectar sospechas por las dos reglas, revisarlas y quitarlas del análisis sin borrarlas | [RF42](requisitos.md#rf42), [RF51](requisitos.md#rf51), [RF52](requisitos.md#rf52), [RF53](requisitos.md#rf53), [RF54](requisitos.md#rf54), [RF55](requisitos.md#rf55), [RNF02](requisitos.md#rnf02) | [CT-U19](casos-de-teste.md#ct-u19), [CT-U23](casos-de-teste.md#ct-u23), [CT-U24](casos-de-teste.md#ct-u24), [CT-U25](casos-de-teste.md#ct-u25), [CT-U26](casos-de-teste.md#ct-u26), [CT-U27](casos-de-teste.md#ct-u27), [CT-U28](casos-de-teste.md#ct-u28), [CT-E33](casos-de-teste.md#ct-e33), [CT-E34](casos-de-teste.md#ct-e34), [CT-E35](casos-de-teste.md#ct-e35), [CT-E36](casos-de-teste.md#ct-e36), [CT-M16](casos-de-teste.md#ct-m16) | Aprobado, con elementos pendientes |
| <a id="cn10"></a>CN10 | **Panel de resultados** | Mostrar los números del módulo UEQ, comparar versiones, guardar la vista en la URL y funcionar con daltonismo, alto contraste y 320 px | [RF43](requisitos.md#rf43), [RF44](requisitos.md#rf44), [RF45](requisitos.md#rf45), [RF46](requisitos.md#rf46), [RF47](requisitos.md#rf47), [RF48](requisitos.md#rf48), [RF50](requisitos.md#rf50), [RNF02](requisitos.md#rnf02), [RNF07](requisitos.md#rnf07), [RNF08](requisitos.md#rnf08), [RNF22](requisitos.md#rnf22) | [CT-U42](casos-de-teste.md#ct-u42), [CT-U43](casos-de-teste.md#ct-u43), [CT-U44](casos-de-teste.md#ct-u44), [CT-E29](casos-de-teste.md#ct-e29), [CT-E30](casos-de-teste.md#ct-e30), [CT-E31](casos-de-teste.md#ct-e31), [CT-E32](casos-de-teste.md#ct-e32), [CT-E72](casos-de-teste.md#ct-e72), [CT-U60](casos-de-teste.md#ct-u60) | Aprobado |
| <a id="cn11"></a>CN11 | **Exportación en CSV** | Descargar los tres CSV con nombre fechado, BOM y el formato de cada uno, y la hoja oficial en XLSX | [RF56](requisitos.md#rf56), [RF57](requisitos.md#rf57), [RF58](requisitos.md#rf58), [RF59](requisitos.md#rf59), [RNF22](requisitos.md#rnf22) | [CT-U31](casos-de-teste.md#ct-u31), [CT-U32](casos-de-teste.md#ct-u32), [CT-U33](casos-de-teste.md#ct-u33), [CT-U34](casos-de-teste.md#ct-u34), [CT-U35](casos-de-teste.md#ct-u35), [CT-U37](casos-de-teste.md#ct-u37), [CT-U38](casos-de-teste.md#ct-u38), [CT-E37](casos-de-teste.md#ct-e37) | Aprobado |
| <a id="cn12"></a>CN12 | **Panel en PDF** | Descargar el panel en PDF y comprobar la página de impresión | [RF60](requisitos.md#rf60) | [CT-E39](casos-de-teste.md#ct-e39), [CT-E40](casos-de-teste.md#ct-e40) | Aprobado |
| <a id="cn13"></a>CN13 | **Importación por CSV** | Importar respuestas con vista previa, rechazar un archivo con errores y marcar las importadas | [RF61](requisitos.md#rf61), [RNF02](requisitos.md#rnf02) | [CT-U39](casos-de-teste.md#ct-u39), [CT-U40](casos-de-teste.md#ct-u40), [CT-U41](casos-de-teste.md#ct-u41), [CT-E42](casos-de-teste.md#ct-e42), [CT-E43](casos-de-teste.md#ct-e43), [CT-E44](casos-de-teste.md#ct-e44) | Aprobado |
| <a id="cn14"></a>CN14 | **Colores y contraste** | Garantizar el contraste de todos los pares de colores del tema | [RNF06](requisitos.md#rnf06), [RNF07](requisitos.md#rnf07) | [CT-U51](casos-de-teste.md#ct-u51), [CT-U52](casos-de-teste.md#ct-u52) | Aprobado |
| <a id="cn15"></a>CN15 | **Validación con la hoja oficial** | Comparar cada número de la herramienta con la UEQ Data Analysis Tool, con una tolerancia de 1e-6, y comprobar que la hoja exportada por la herramienta es la oficial rellenada | [RF59](requisitos.md#rf59), [RNF11](requisitos.md#rnf11) | [CT-U29](casos-de-teste.md#ct-u29), [CT-U70](casos-de-teste.md#ct-u70), [CT-E96](casos-de-teste.md#ct-e96), [CT-M15](casos-de-teste.md#ct-m15) | Aprobado |
| <a id="cn16"></a>CN16 | **UEQ-S** | Elegir el UEQ-S al crear el estudio sabiendo qué cambia, responder los 8 pares, ver la evaluación en la pestaña UEQ-S, exportar la hoja oficial del UEQ-S y comparar cada número con ella, también a partir de un estudio del UEQ completo | [RF62](requisitos.md#rf62), [RNF01](requisitos.md#rnf01), [RNF02](requisitos.md#rnf02), [RNF03](requisitos.md#rnf03), [RNF11](requisitos.md#rnf11) | [CT-U53](casos-de-teste.md#ct-u53), [CT-U71](casos-de-teste.md#ct-u71), [CT-U72](casos-de-teste.md#ct-u72), [CT-U73](casos-de-teste.md#ct-u73), [CT-U74](casos-de-teste.md#ct-u74), [CT-U75](casos-de-teste.md#ct-u75), [CT-U76](casos-de-teste.md#ct-u76), [CT-U77](casos-de-teste.md#ct-u77), [CT-E97](casos-de-teste.md#ct-e97), [CT-E98](casos-de-teste.md#ct-e98), [CT-E99](casos-de-teste.md#ct-e99), [CT-E100](casos-de-teste.md#ct-e100), [CT-E101](casos-de-teste.md#ct-e101), [CT-E102](casos-de-teste.md#ct-e102), [CT-M26](casos-de-teste.md#ct-m26) | Aprobado |
| <a id="cn18"></a>CN18 | **Documentación en la herramienta** | Navegar por las secciones y los documentos con y sin cuenta, seguir enlaces y anclas, ver los diagramas y descargar los archivos, sin infracciones de accesibilidad | [RF63](requisitos.md#rf63), [RF64](requisitos.md#rf64), [RF65](requisitos.md#rf65), [RNF01](requisitos.md#rnf01), [RNF02](requisitos.md#rnf02) | [CT-U54](casos-de-teste.md#ct-u54), [CT-U55](casos-de-teste.md#ct-u55), [CT-U56](casos-de-teste.md#ct-u56), [CT-U57](casos-de-teste.md#ct-u57), [CT-E47](casos-de-teste.md#ct-e47), [CT-E48](casos-de-teste.md#ct-e48), [CT-E49](casos-de-teste.md#ct-e49), [CT-E50](casos-de-teste.md#ct-e50), [CT-E51](casos-de-teste.md#ct-e51), [CT-E57](casos-de-teste.md#ct-e57), [CT-E62](casos-de-teste.md#ct-e62), [CT-E84](casos-de-teste.md#ct-e84), [CT-E85](casos-de-teste.md#ct-e85), [CT-E86](casos-de-teste.md#ct-e86), [CT-E87](casos-de-teste.md#ct-e87), [CT-U64](casos-de-teste.md#ct-u64), [CT-U65](casos-de-teste.md#ct-u65) | Aprobado |
| <a id="cn19"></a>CN19 | **Navegación y barra fija** | Mantener la barra superior a la vista durante el desplazamiento, sin ocultar el foco ni las anclas, con menú en el móvil | [RNF03](requisitos.md#rnf03), [RNF23](requisitos.md#rnf23) | [CT-E53](casos-de-teste.md#ct-e53), [CT-E54](casos-de-teste.md#ct-e54), [CT-E55](casos-de-teste.md#ct-e55), [CT-E56](casos-de-teste.md#ct-e56) | Aprobado |
| <a id="cn20"></a>CN20 | **Página de inicio y ventanas** | Presentar la herramienta a quien no tiene cuenta, abrir Entrar y Crear cuenta en una ventana sin desplazamiento, cerrar devolviendo el foco y entregar el icono del sitio | [RF02](requisitos.md#rf02), [RF11](requisitos.md#rf11) | [CT-E58](casos-de-teste.md#ct-e58), [CT-E59](casos-de-teste.md#ct-e59), [CT-E60](casos-de-teste.md#ct-e60), [CT-E61](casos-de-teste.md#ct-e61), [CT-E69](casos-de-teste.md#ct-e69), [CT-E70](casos-de-teste.md#ct-e70) | Aprobado |
| <a id="cn21"></a>CN21 | **Equipo y notificaciones** | Invitar por correo electrónico, aceptar en la campana, limitar lo que hace el lector y avisar al equipo | [RF20](requisitos.md#rf20), [RF21](requisitos.md#rf21), [RF22](requisitos.md#rf22), [RF23](requisitos.md#rf23), [RNF03](requisitos.md#rnf03) | [CT-U59](casos-de-teste.md#ct-u59), [CT-E63](casos-de-teste.md#ct-e63), [CT-E64](casos-de-teste.md#ct-e64) | Aprobado |
| <a id="cn22"></a>CN22 | **Aprender a usar** | Explicar cada página en la ayuda (?) y guiar el primer acceso con un recorrido que se puede omitir | [RF09](requisitos.md#rf09), [RF10](requisitos.md#rf10) | [CT-E65](casos-de-teste.md#ct-e65), [CT-E66](casos-de-teste.md#ct-e66) | Aprobado |
| <a id="cn23"></a>CN23 | **Protección de datos** | Cumplir la LGPD en la interfaz y en el servidor: política pública, cabeceras, cifrado, límite de intentos y descarga de los datos | [RF07](requisitos.md#rf07), [RF25](requisitos.md#rf25), [RNF01](requisitos.md#rnf01), [RNF02](requisitos.md#rnf02), [RNF14](requisitos.md#rnf14), [RNF16](requisitos.md#rnf16), [RNF18](requisitos.md#rnf18), [RNF19](requisitos.md#rnf19) | [CT-U58](casos-de-teste.md#ct-u58), [CT-E73](casos-de-teste.md#ct-e73), [CT-E74](casos-de-teste.md#ct-e74), [CT-E75](casos-de-teste.md#ct-e75), [CT-E76](casos-de-teste.md#ct-e76), [CT-E77](casos-de-teste.md#ct-e77), [CT-E78](casos-de-teste.md#ct-e78), [CT-E79](casos-de-teste.md#ct-e79), [CT-E80](casos-de-teste.md#ct-e80), [CT-E81](casos-de-teste.md#ct-e81), [CT-E92](casos-de-teste.md#ct-e92), [CT-U69](casos-de-teste.md#ct-u69) | Aprobado |
| <a id="cn24"></a>CN24 | **Idioma de la herramienta** | Elegir el idioma al crear la cuenta, cambiarlo en Mi cuenta y mantener el catálogo de textos al día | [RF08](requisitos.md#rf08), [RF35](requisitos.md#rf35) | [CT-U62](casos-de-teste.md#ct-u62), [CT-U63](casos-de-teste.md#ct-u63), [CT-U66](casos-de-teste.md#ct-u66), [CT-U67](casos-de-teste.md#ct-u67), [CT-U68](casos-de-teste.md#ct-u68), [CT-U78](casos-de-teste.md#ct-u78), [CT-E67](casos-de-teste.md#ct-e67), [CT-E94](casos-de-teste.md#ct-e94), [CT-E95](casos-de-teste.md#ct-e95) | Aprobado |
| <a id="cn25"></a>CN25 | **Escenarios de demostración** | Generar respuestas sintéticas coherentes con el perfil de cada escenario | [RF67](requisitos.md#rf67) | [CT-U61](casos-de-teste.md#ct-u61) | Aprobado |
| <a id="cn17"></a>CN17 | **Verificación manual con personas** | Lo que la automatización no ve: lector de pantalla real, móvil real, zoom, espaciado de texto, evaluación heurística y prueba con usuarios | [RF09](requisitos.md#rf09), [RF13](requisitos.md#rf13), [RF22](requisitos.md#rf22), [RF24](requisitos.md#rf24), [RF25](requisitos.md#rf25), [RF27](requisitos.md#rf27), [RF28](requisitos.md#rf28), [RF29](requisitos.md#rf29), [RF34](requisitos.md#rf34), [RF43](requisitos.md#rf43), [RNF01](requisitos.md#rnf01), [RNF02](requisitos.md#rnf02), [RNF03](requisitos.md#rnf03), [RNF04](requisitos.md#rnf04), [RNF05](requisitos.md#rnf05), [RNF06](requisitos.md#rnf06), [RNF07](requisitos.md#rnf07), [RNF08](requisitos.md#rnf08), [RNF19](requisitos.md#rnf19), [RNF20](requisitos.md#rnf20), [RNF21](requisitos.md#rnf21), [RNF23](requisitos.md#rnf23), [RNF24](requisitos.md#rnf24) | [CT-M01](casos-de-teste.md#ct-m01), [CT-M02](casos-de-teste.md#ct-m02), [CT-M03](casos-de-teste.md#ct-m03), [CT-M04](casos-de-teste.md#ct-m04), [CT-M05](casos-de-teste.md#ct-m05), [CT-M06](casos-de-teste.md#ct-m06), [CT-M07](casos-de-teste.md#ct-m07), [CT-M08](casos-de-teste.md#ct-m08), [CT-M09](casos-de-teste.md#ct-m09), [CT-M10](casos-de-teste.md#ct-m10), [CT-M11](casos-de-teste.md#ct-m11), [CT-M12](casos-de-teste.md#ct-m12), [CT-M13](casos-de-teste.md#ct-m13), [CT-M14](casos-de-teste.md#ct-m14), [CT-M18](casos-de-teste.md#ct-m18), [CT-M19](casos-de-teste.md#ct-m19), [CT-M20](casos-de-teste.md#ct-m20), [CT-M21](casos-de-teste.md#ct-m21), [CT-M22](casos-de-teste.md#ct-m22), [CT-M23](casos-de-teste.md#ct-m23), [CT-M24](casos-de-teste.md#ct-m24), [CT-M25](casos-de-teste.md#ct-m25) | Manual, no ejecutado |

## Casos de extremo a extremo

Cada caso es un `test(...)` de Playwright. El título en el código es el que aparece en el informe.

### CT-E01

**Quien abre la herramienta sin cuenta ve la página de inicio, que explica lo que hace.**

| Campo | Valor |
|---|---|
| Escenario | [CN01 · Acceso y autenticación](#cn01) |
| Prueba | `tests/e2e/inicial.spec.ts` › "a raiz apresenta a ferramenta para quem não tem sessão e passa no axe" (la raíz presenta la herramienta a quien no tiene sesión y pasa axe) |
| Precondiciones | Navegador sin cookie de sesión. |
| Requisitos | [RF11](requisitos.md#rf11), [RNF01](requisitos.md#rnf01) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Abrir /.
2. Abrir el menú, si la pantalla es estrecha.
3. Ejecutar axe.

Resultado esperado: La URL sigue en /. El h1 es "Estudios de experiencia del usuario con el UEQ" y aparecen las secciones Qué es el UEQ, Cómo leer los resultados, Cómo funciona, Estudios sobre el método y Créditos, con los grupos Atractivo, Calidad pragmática y Calidad hedónica. La barra tiene Documentación (sin aria-current) y el botón Entrar, y nada de Estudios. Cero infracciones.

### CT-E02

**El enlace para saltar bloques es el primer elemento enfocable.**

| Campo | Valor |
|---|---|
| Escenario | [CN01 · Acceso y autenticación](#cn01) |
| Prueba | `tests/e2e/inicial.spec.ts` › "o primeiro Tab leva ao link de pular para o conteúdo" (el primer Tab lleva al enlace para saltar al contenido) |
| Precondiciones | Página de inicio (/) abierta. |
| Requisitos | [RNF03](requisitos.md#rnf03) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Pulsar Tab.
2. Pulsar Enter.

Resultado esperado: El primer Tab enfoca "Saltar al contenido"; el Enter lleva el foco a main#conteudo.

### CT-E03

**Registrarse, cerrar sesión e iniciar sesión de nuevo funciona solo con el teclado.**

| Campo | Valor |
|---|---|
| Escenario | [CN01 · Acceso y autenticación](#cn01) |
| Prueba | `tests/e2e/autenticacao.spec.ts` › "cadastra, sai e entra de novo usando só o teclado" (se registra, cierra sesión e inicia sesión de nuevo usando solo el teclado) |
| Precondiciones | Correo electrónico de prueba nuevo. |
| Requisitos | [RF01](requisitos.md#rf01), [RF02](requisitos.md#rf02), [RNF03](requisitos.md#rnf03) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. En /cadastrar, llegar a cada campo de la ventana con Tab y escribir nombre, correo electrónico y contraseña.
2. Pulsar Enter.
3. Llegar con Tab al botón Salir y pulsar Enter.
4. En la ventana de confirmación, pulsar Enter.
5. En la página de inicio, llegar con Tab al botón Entrar de la barra, pulsar Enter e iniciar sesión solo con el teclado.

Resultado esperado: Después del registro aparece "Sus estudios". Salir abre la ventana "¿Cerrar sesión?" con el foco en el botón Salir; confirmar lleva a /?aviso=saiu con "Ha cerrado sesión en su cuenta." en role=status. Entrar abre la ventana con el foco en Correo electrónico, y el nuevo inicio de sesión termina en la página de inicio.

### CT-E04

**La página solicitada sin sesión se retoma después del inicio de sesión.**

| Campo | Valor |
|---|---|
| Escenario | [CN01 · Acceso y autenticación](#cn01) |
| Prueba | `tests/e2e/autenticacao.spec.ts` › "rota protegida sem sessão vai para Entrar e volta para ela depois do login" (una ruta protegida sin sesión va a Entrar y vuelve a ella después del inicio de sesión) |
| Precondiciones | Cuenta creada; cookies borradas. |
| Requisitos | [RF03](requisitos.md#rf03) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Abrir /conta.
2. Iniciar sesión con la cuenta.

Resultado esperado: Primero la URL pasa a /entrar?voltar=%2Fconta; después del inicio de sesión la persona está en /conta, con el título "Mi cuenta".

### CT-E05

**Las rutas del participante no pasan por la protección de sesión.**

| Campo | Valor |
|---|---|
| Escenario | [CN04 · Aislamiento y protección de datos](#cn04) |
| Prueba | `tests/e2e/autenticacao.spec.ts` › "participante nunca precisa de sessão" (el participante nunca necesita sesión) |
| Precondiciones | Navegador sin cookie. |
| Requisitos | [RF24](requisitos.md#rf24) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Abrir /r/qualquer-estudo.

Resultado esperado: La URL sigue en /r/qualquer-estudo y la respuesta no es la redirección 307 a Entrar.

### CT-E06

**Las ventanas de acceso no tienen infracciones WCAG 2.2 A/AA, ni siquiera en el estado de error.**

| Campo | Valor |
|---|---|
| Escenario | [CN01 · Acceso y autenticación](#cn01) |
| Prueba | `tests/e2e/autenticacao.spec.ts` › "Entrar e Criar conta passam no axe, inclusive com erro" (Entrar y Crear cuenta pasan axe, incluso con error) |
| Precondiciones | Ninguna. |
| Requisitos | [RF01](requisitos.md#rf01), [RF02](requisitos.md#rf02), [RNF01](requisitos.md#rnf01) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Abrir /entrar y ejecutar axe con la ventana abierta.
2. Iniciar sesión con credenciales inexistentes y ejecutar axe.
3. Abrir /cadastrar y ejecutar axe.
4. Enviar el registro vacío y ejecutar axe.

Resultado esperado: Cero infracciones en los cuatro estados. El error de inicio de sesión muestra "No fue posible iniciar sesión". El registro vacío muestra el resumen "Corrija 3 campos para continuar" con el foco, el Nombre con aria-invalid e "Indique su nombre."

### CT-E07

**Cada enlace del resumen de errores lleva al campo con problemas.**

| Campo | Valor |
|---|---|
| Escenario | [CN01 · Acceso y autenticación](#cn01) |
| Prueba | `tests/e2e/autenticacao.spec.ts` › "o link do resumo de erros leva ao campo" (el enlace del resumen de errores lleva al campo) |
| Precondiciones | Ninguna. |
| Requisitos | [RF01](requisitos.md#rf01) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Registrarse con la contraseña "curta".
2. Hacer clic en el enlace "Contraseña: la contraseña debe tener al menos 8 caracteres".

Resultado esperado: El foco va al campo Contraseña, que conserva lo que la persona escribió.

### CT-E08

**El botón Mostrar contraseña funciona e informa del estado.**

| Campo | Valor |
|---|---|
| Escenario | [CN01 · Acceso y autenticación](#cn01) |
| Prueba | `tests/e2e/autenticacao.spec.ts` › "Mostrar senha alterna a visibilidade e anuncia o estado" (Mostrar contraseña alterna la visibilidad y anuncia el estado) |
| Precondiciones | Página /entrar abierta. |
| Requisitos | [RF01](requisitos.md#rf01), [RF02](requisitos.md#rf02) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Hacer clic en "Mostrar contraseña".

Resultado esperado: El campo pasa a type=text y el botón, de aria-pressed=false a true.

### CT-E09

**Editar los datos personales confirma el resultado y valida.**

| Campo | Valor |
|---|---|
| Escenario | [CN02 · Mi cuenta](#cn02) |
| Prueba | `tests/e2e/conta.spec.ts` › "Minha conta salva os dados, anuncia o resultado e passa no axe" (Mi cuenta guarda los datos, anuncia el resultado y pasa axe) |
| Precondiciones | Investigador con sesión iniciada. |
| Requisitos | [RF04](requisitos.md#rf04), [RNF20](requisitos.md#rnf20) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Abrir Mi cuenta, ejecutar axe y seguir a Datos personales.
2. Cambiar el nombre y guardar.
3. Borrar el nombre y guardar.
4. Ejecutar axe.

Resultado esperado: El enlace Mi cuenta queda con aria-current=page, y el panel lleva a /conta/dados. Guardar muestra "Datos guardados.". El nombre vacío lleva el foco al resumen "Corrija 1 campo". Cero infracciones.

### CT-E10

**Cambiar la contraseña exige la contraseña actual y cierra las demás sesiones.**

| Campo | Valor |
|---|---|
| Escenario | [CN02 · Mi cuenta](#cn02) |
| Prueba | `tests/e2e/conta.spec.ts` › "trocar a senha encerra a sessão aberta em outro navegador" (cambiar la contraseña cierra la sesión abierta en otro navegador) |
| Precondiciones | La misma cuenta con sesión iniciada en dos navegadores. |
| Requisitos | [RF05](requisitos.md#rf05), [RNF15](requisitos.md#rnf15) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. En /conta/senha, cambiar la contraseña indicando una contraseña actual incorrecta.
2. Repetir con la contraseña actual correcta.
3. En el otro navegador, abrir /conta.
4. Iniciar sesión con la contraseña nueva.

Resultado esperado: Una contraseña actual incorrecta muestra "La contraseña actual no coincide…". Con la correcta: "Contraseña cambiada. Las demás sesiones abiertas se cerraron." y el campo se vacía. El otro navegador va a Entrar y solo inicia sesión con la contraseña nueva.

### CT-E11

**Eliminar la cuenta pide confirmación en una ventana, con el correo electrónico escrito, y borra el acceso.**

| Campo | Valor |
|---|---|
| Escenario | [CN02 · Mi cuenta](#cn02) |
| Prueba | `tests/e2e/conta.spec.ts` › "excluir a conta exige digitar o e-mail e apaga o acesso" (eliminar la cuenta exige escribir el correo electrónico y borra el acceso) |
| Precondiciones | Investigador con sesión iniciada. |
| Requisitos | [RF06](requisitos.md#rf06), [RNF21](requisitos.md#rnf21) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Hacer clic en "Eliminar mi cuenta".
2. Cancelar; abrir de nuevo y pulsar Esc.
3. Abrir de nuevo y escribir otro correo electrónico.
4. Escribir el correo electrónico correcto y confirmar.
5. Intentar iniciar sesión.

Resultado esperado: Se abre la ventana "¿Eliminar su cuenta?" con el aviso de lo que se elimina con ella y el foco en el campo; cero infracciones. Cancelar y Esc cierran y devuelven el foco al botón. Correo electrónico incorrecto: "Ese no es el correo electrónico de su cuenta. No se eliminó nada.". Correo electrónico correcto: /?aviso=excluida con "Cuenta eliminada…". El siguiente inicio de sesión falla.

### CT-E12

**Un investigador nuevo ve el estado vacío accesible.**

| Campo | Valor |
|---|---|
| Escenario | [CN03 · Gestión de estudios](#cn03) |
| Prueba | `tests/e2e/estudos.spec.ts` › "lista vazia mostra o estado vazio e passa no axe" (la lista vacía muestra el estado vacío y pasa axe) |
| Precondiciones | Investigador recién registrado. |
| Requisitos | [RF12](requisitos.md#rf12), [RNF01](requisitos.md#rnf01) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Abrir /estudos.

Resultado esperado: Aparece "Todavía no tiene estudios." y axe no encuentra infracciones.

### CT-E13

**El producto se convierte en la sugerencia de nombre de la primera versión y el foco acompaña al agregar y quitar.**

| Campo | Valor |
|---|---|
| Escenario | [CN03 · Gestión de estudios](#cn03) |
| Prueba | `tests/e2e/estudos.spec.ts` › "o produto sugere o nome da primeira versão e o foco acompanha adicionar e remover" (el producto sugiere el nombre de la primera versión y el foco acompaña al agregar y quitar) |
| Precondiciones | Investigador con sesión iniciada. |
| Requisitos | [RF13](requisitos.md#rf13) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. En /estudos/novo, escribir el producto "Portal do aluno".
2. Hacer clic en Agregar versión.
3. Hacer clic en Quitar versión 2 y cancelar en la ventana.
4. Hacer clic de nuevo en Quitar versión 2 y confirmar con Enter.

Resultado esperado: La Versión 1 recibe "Portal do aluno" con la nota "Sugerido a partir del producto evaluado. Puede cambiarlo.". Agregar enfoca la Versión 2. Quitar abre la ventana "¿Quitar la versión 2?": Cancelar mantiene la versión; confirmar (el foco ya está en el botón) la quita y devuelve el foco a Agregar versión.

### CT-E14

**El formulario vacío se rechaza con un resumen accesible.**

| Campo | Valor |
|---|---|
| Escenario | [CN03 · Gestión de estudios](#cn03) |
| Prueba | `tests/e2e/estudos.spec.ts` › "criar estudo com campos faltando mostra o resumo e passa no axe" (crear un estudio con campos faltantes muestra el resumen y pasa axe) |
| Precondiciones | Investigador con sesión iniciada. |
| Requisitos | [RF13](requisitos.md#rf13), [RNF01](requisitos.md#rnf01) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Ejecutar axe en /estudos/novo.
2. Hacer clic en Crear estudio sin rellenar nada.
3. Ejecutar axe.

Resultado esperado: El resumen "Corrija 4 campos para continuar" recibe el foco, aparece "Dé un título al estudio." y la Versión 1 queda con aria-invalid. Cero infracciones.

### CT-E15

**Las transiciones de estado cambian el comportamiento del enlace.**

| Campo | Valor |
|---|---|
| Escenario | [CN03 · Gestión de estudios](#cn03) |
| Prueba | `tests/e2e/estudos.spec.ts` › "abre, encerra e reabre a coleta, e o link público acompanha" (abre, cierra y reabre la recogida, y el enlace público acompaña) |
| Precondiciones | Estudio creado en borrador; una pestaña de participante. |
| Requisitos | [RF15](requisitos.md#rf15), [RNF20](requisitos.md#rnf20) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Abrir el enlace como participante.
2. Abrir la recogida.
3. Cerrar la recogida y recargar el enlace.
4. Reabrir la recogida.

Resultado esperado: Borrador: "Este estudio todavía no está abierto". Abierto: "Recogida abierta. El enlace ya acepta respuestas." y "Abierto · aceptando respuestas". Cerrado: "La recogida de este estudio se cerró". Reabierto: "Recogida reabierta…". Axe sin infracciones.

### CT-E16

**Copiar el enlace funciona con el teclado y se anuncia.**

| Campo | Valor |
|---|---|
| Escenario | [CN03 · Gestión de estudios](#cn03) |
| Prueba | `tests/e2e/estudos.spec.ts` › "Copiar link anuncia o resultado e funciona pelo teclado" (Copiar enlace anuncia el resultado y funciona con el teclado) |
| Precondiciones | Estudio abierto. Solo en Chromium (permiso del portapapeles). |
| Requisitos | [RF16](requisitos.md#rf16), [RNF20](requisitos.md#rnf20) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Enfocar "Copiar enlace" y pulsar Enter.
2. Leer el portapapeles.

Resultado esperado: Aparece "Enlace copiado." y el portapapeles contiene una dirección /r/ con un slug de 6 caracteres.

### CT-E17

**La lista es una tabla accesible.**

| Campo | Valor |
|---|---|
| Escenario | [CN03 · Gestión de estudios](#cn03) |
| Prueba | `tests/e2e/estudos.spec.ts` › "a lista mostra o estudo numa tabela com o título como link" (la lista muestra el estudio en una tabla con el título como enlace) |
| Precondiciones | Un estudio creado. |
| Requisitos | [RF12](requisitos.md#rf12) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Abrir /estudos.

Resultado esperado: La tabla tiene caption, la cabecera Respuestas, el título como enlace dentro de la cabecera de la fila y el estado Borrador. Cero infracciones.

### CT-E18

**Editar el estudio guarda y confirma.**

| Campo | Valor |
|---|---|
| Escenario | [CN03 · Gestión de estudios](#cn03) |
| Prueba | `tests/e2e/estudos.spec.ts` › "editar salva as mudanças e avisa" (editar guarda los cambios y avisa) |
| Precondiciones | Un estudio creado. |
| Requisitos | [RF14](requisitos.md#rf14) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Hacer clic en Editar estudio.
2. Cambiar el título y guardar.

Resultado esperado: Aparece "Cambios guardados." y el título nuevo es el h1 de la página del estudio.

### CT-E19

**Eliminar el estudio exige escribir el título.**

| Campo | Valor |
|---|---|
| Escenario | [CN03 · Gestión de estudios](#cn03) |
| Prueba | `tests/e2e/estudos.spec.ts` › "excluir pede o título e apaga o estudo" (eliminar pide el título y borra el estudio) |
| Precondiciones | Un estudio con 2 versiones. |
| Requisitos | [RF17](requisitos.md#rf17), [RNF21](requisitos.md#rnf21) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Hacer clic en Eliminar estudio.
2. Escribir otro título y confirmar.
3. Escribir el título correcto y confirmar.

Resultado esperado: El campo recibe el foco y la pantalla dice "Eliminar borra el estudio y las 2 versiones.". Texto incorrecto: "…No se eliminó nada.". Título correcto: /estudos?aviso=excluido, "Estudio eliminado." y la lista vacía.

### CT-E20

**La dirección del estudio no sirve para otra cuenta.**

| Campo | Valor |
|---|---|
| Escenario | [CN04 · Aislamiento y protección de datos](#cn04) |
| Prueba | `tests/e2e/estudos.spec.ts` › "outro pesquisador não vê o estudo pelo endereço" (otro investigador no ve el estudio por la dirección) |
| Precondiciones | Estudio creado por la cuenta A; cuenta B con sesión iniciada en otro navegador. |
| Requisitos | [RNF17](requisitos.md#rnf17) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Con la cuenta B, abrir la dirección del estudio de la cuenta A.

Resultado esperado: La respuesta es 404, igual que la de un estudio inexistente.

### CT-E21

**El participante va del consentimiento al final y el investigador ve la respuesta.**

| Campo | Valor |
|---|---|
| Escenario | [CN05 · Participación en el estudio](#cn05) |
| Prueba | `tests/e2e/questionario.spec.ts` › "fluxo completo do participante, com axe em todas as etapas" (flujo completo del participante, con axe en todos los pasos) |
| Precondiciones | Estudio abierto. En el proyecto celular, ventana de 390 px. |
| Requisitos | [RF24](requisitos.md#rf24), [RF25](requisitos.md#rf25), [RF27](requisitos.md#rf27), [RF32](requisitos.md#rf32), [RF33](requisitos.md#rf33), [RNF01](requisitos.md#rnf01), [RNF12](requisitos.md#rnf12) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Abrir el enlace.
2. Aceptar el consentimiento.
3. Marcar los 26 ítems y enviar.
4. Marcar "25 a 34 años" y continuar.
5. Recargar la página del investigador.

Resultado esperado: Cada paso tiene su propio título (Consentimiento, Cuestionario, Datos opcionales, Respuestas registradas) y el paso actual tiene aria-current=step. Ningún botón de opción viene marcado. El contador llega a "26 de 26 respondidos". Cero infracciones en todos los pasos. El investigador ve "1 respuesta · 1 sospechosa · 1 en el análisis".

### CT-E22

**El cuestionario completo funciona solo con el teclado y el foco nunca queda oculto.**

| Campo | Valor |
|---|---|
| Escenario | [CN06 · Accesibilidad del cuestionario](#cn06) |
| Prueba | `tests/e2e/questionario.spec.ts` › "fluxo completo só com teclado, com o foco sempre visível" (flujo completo solo con teclado, con el foco siempre visible) |
| Precondiciones | Estudio abierto. |
| Requisitos | [RF28](requisitos.md#rf28), [RNF03](requisitos.md#rnf03) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Llegar a Estoy de acuerdo con Tab y pulsar Enter.
2. En cada uno de los 26 ítems: Tab hasta el grupo, Espacio, flecha a la derecha.
3. Tab hasta Enviar y Enter.
4. Tab hasta Omitir este paso y Enter.

Resultado esperado: En cada ítem el elemento enfocado está en la pantalla y por encima del pie fijo, y la segunda posición queda marcada. La persona llega a /fim.

### CT-E23

**Enviar con ítems pendientes muestra cuáles faltan y lleva hasta ellos.**

| Campo | Valor |
|---|---|
| Escenario | [CN05 · Participación en el estudio](#cn05) |
| Prueba | `tests/e2e/questionario.spec.ts` › "envio incompleto leva o foco ao resumo e os links levam aos itens" (un envío incompleto lleva el foco al resumen y los enlaces llevan a los ítems) |
| Precondiciones | Participación iniciada. |
| Requisitos | [RF29](requisitos.md#rf29) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Marcar todos menos los ítems 7 y 19 y enviar.
2. Hacer clic en "Ir al ítem 19".

Resultado esperado: El resumen "Faltan 2 ítems: 7 y 19" recibe el foco, el título de la pestaña empieza por "Faltan 2 ítems" y el ítem 7 tiene la descripción "Este ítem no fue respondido". El enlace enfoca el primer botón de opción del ítem 19, visible por encima del pie. Cero infracciones.

### CT-E24

**El árbol de accesibilidad del ítem es el especificado.**

| Campo | Valor |
|---|---|
| Escenario | [CN06 · Accesibilidad del cuestionario](#cn06) |
| Prueba | `tests/e2e/questionario.spec.ts` › "cada item é um grupo com legenda e 7 rádios com posição e polo" (cada ítem es un grupo con leyenda y 7 botones de opción con posición y polo) |
| Precondiciones | Participación iniciada. |
| Requisitos | [RF27](requisitos.md#rf27), [RNF04](requisitos.md#rnf04), [RNF09](requisitos.md#rnf09) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Leer el árbol de accesibilidad del ítem 4.

Resultado esperado: Grupo "Item 4 de 26: De Fácil aprendizagem ou De difícil aprendizagem" con 7 botones de opción: "1 de 7, mais perto de De Fácil aprendizagem" … "4 de 7, centro" … "7 de 7, mais perto de De difícil aprendizagem" (el cuestionario en portugués: ítem 4 de 26, de fácil aprendizaje o de difícil aprendizaje; 1 de 7, más cerca del polo izquierdo; 4 de 7, centro; 7 de 7, más cerca del polo derecho).

### CT-E25

**El enlace del participante no se desplaza en horizontal en 320 px.**

| Campo | Valor |
|---|---|
| Escenario | [CN06 · Accesibilidad del cuestionario](#cn06) |
| Prueba | `tests/e2e/questionario.spec.ts` › "em 320 px (zoom de 400%) nenhuma etapa rola na horizontal" (en 320 px, zoom del 400%, ningún paso se desplaza en horizontal) |
| Precondiciones | Estudio abierto; ventana de 320 × 640. |
| Requisitos | [RNF02](requisitos.md#rnf02) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Comprobar el consentimiento.
2. Aceptar y comprobar el cuestionario.
3. Abrir Salir sin enviar y comprobar.
4. Continuar, responder, enviar y comprobar los datos opcionales.

Resultado esperado: En todos los pasos el ancho del documento no supera la ventana.

### CT-E26

**Recargar no pierde lo que se marcó.**

| Campo | Valor |
|---|---|
| Escenario | [CN05 · Participación en el estudio](#cn05) |
| Prueba | `tests/e2e/questionario.spec.ts` › "recarregar a página recupera as respostas marcadas" (recargar la página recupera las respuestas marcadas) |
| Precondiciones | Participación iniciada. |
| Requisitos | [RF30](requisitos.md#rf30) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Marcar los ítems 1 y 2.
2. Recargar.

Resultado esperado: Aparece "Recuperamos las respuestas que ya había marcado.", el ítem 1 sigue marcado y el contador muestra "2 de 26 respondidos".

### CT-E27

**Desistir pide confirmación en una ventana y no guarda nada.**

| Campo | Valor |
|---|---|
| Escenario | [CN05 · Participación en el estudio](#cn05) |
| Prueba | `tests/e2e/questionario.spec.ts` › "sair sem enviar confirma numa janela e não grava nada" (salir sin enviar confirma en una ventana y no guarda nada) |
| Precondiciones | Participación iniciada con un ítem marcado. |
| Requisitos | [RF31](requisitos.md#rf31), [RNF21](requisitos.md#rnf21) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Hacer clic en Salir sin enviar en el pie y ejecutar axe.
2. Pulsar Esc.
3. Hacer clic de nuevo en Salir sin enviar y confirmar en la ventana.
4. Abrir el enlace de nuevo.
5. Recargar la página del investigador.

Resultado esperado: Se abre la ventana "¿Salir sin enviar? No se guardará nada de lo que marcó." con el foco en Seguir respondiendo; cero infracciones. Esc cierra, la respuesta sigue marcada y el foco vuelve a Salir sin enviar. Confirmar lleva a /saiu ("Ha salido del estudio", sin infracciones). El enlace vuelve al consentimiento, y el investigador ve "0 respuestas · 0 en el análisis".

### CT-E28

**Rechazar no guarda nada, y el mismo navegador no responde dos veces.**

| Campo | Valor |
|---|---|
| Escenario | [CN05 · Participación en el estudio](#cn05) |
| Prueba | `tests/e2e/questionario.spec.ts` › "não quero participar sai sem gravar e o link respondido não aceita outro envio" (no quiero participar sale sin guardar y el enlace respondido no acepta otro envío) |
| Precondiciones | Estudio abierto. |
| Requisitos | [RF25](requisitos.md#rf25), [RF33](requisitos.md#rf33) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Hacer clic en No quiero participar.
2. Abrir el enlace, aceptar, responder, enviar y omitir los datos opcionales.
3. Abrir el enlace de nuevo.

Resultado esperado: El rechazo muestra "Ha salido del estudio". Después de responder, el enlace muestra "Ya respondió este estudio".

### CT-E29

**El panel muestra los números de analisarEstudo y la vista queda en la URL.**

| Campo | Valor |
|---|---|
| Escenario | [CN10 · Panel de resultados](#cn10) |
| Prueba | `tests/e2e/resultados.spec.ts` › "mostra os números do módulo UEQ e guarda versão e modo na URL" (muestra los números del módulo UEQ y guarda la versión y el modo en la URL) |
| Precondiciones | Estudio con la fixture basico en la versión 1 (20) e inconsistente en la versión 2 (15). |
| Requisitos | [RF43](requisitos.md#rf43), [RF46](requisitos.md#rf46), [RF47](requisitos.md#rf47), [RF48](requisitos.md#rf48), [RNF08](requisitos.md#rnf08) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Abrir Resultados y ejecutar axe.
2. Elegir la versión 1 en el selector.
3. Recargar.
4. Hacer clic en Agrupado por escala.
5. Hacer clic en Comparar versiones y ejecutar axe.
6. Volver atrás en el navegador.

Resultado esperado: Atractivo de la versión 1: 0,73, IC de 0,33 a 1,14, alfa 0,92, y el gráfico anuncia "Atractivo: media 0,73, IC de 0,33 a 1,14, neutro". El selector mantiene el foco y la URL gana versao=, itens=escala y modo=comparar. Recargar mantiene la versión. La leyenda dice "círculo vacío · n = 15". Volver atrás sale del modo comparar. Cero infracciones.

### CT-E30

**Una muestra de 1 genera el aviso y el gráfico sin IC.**

| Campo | Valor |
|---|---|
| Escenario | [CN10 · Panel de resultados](#cn10) |
| Prueba | `tests/e2e/resultados.spec.ts` › "com uma resposta só avisa que não há intervalo de confiança" (con una sola respuesta avisa de que no hay intervalo de confianza) |
| Precondiciones | Estudio con 1 respuesta. |
| Requisitos | [RF45](requisitos.md#rf45) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Abrir Resultados.

Resultado esperado: Aparece "Muestra insuficiente para el intervalo de confianza." y el gráfico anuncia "…sin intervalo de confianza".

### CT-E31

**El panel no se desplaza en horizontal en 320 px.**

| Campo | Valor |
|---|---|
| Escenario | [CN10 · Panel de resultados](#cn10) |
| Prueba | `tests/e2e/resultados.spec.ts` › "em 320 px o painel não rola na horizontal, nos dois modos" (en 320 px el panel no se desplaza en horizontal, en los dos modos) |
| Precondiciones | Estudio con 5 respuestas en cada versión; ventana de 320 × 640. |
| Requisitos | [RNF02](requisitos.md#rnf02) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Abrir Resultados.
2. Abrir Comparar versiones.

Resultado esperado: En los dos modos el ancho del documento no supera la ventana.

### CT-E32

**El gráfico de comparación sigue siendo legible con deficiencias de color y alto contraste.**

| Campo | Valor |
|---|---|
| Escenario | [CN10 · Panel de resultados](#cn10) |
| Prueba | `tests/e2e/resultados.spec.ts` › "gráficos com daltonismo simulado e alto contraste" (gráficos con daltonismo simulado y alto contraste) |
| Precondiciones | Estudio con 8 respuestas en cada versión. |
| Requisitos | [RNF07](requisitos.md#rnf07) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Abrir Comparar versiones.
2. Emular protanopía, deuteranopía y acromatopsia y capturar el gráfico.
3. Emular forced-colors y capturar.
4. Ejecutar axe.

Resultado esperado: Las cuatro capturas quedan adjuntas al informe para la revisión visual; la leyenda indica la forma de cada versión ("círculo lleno"); cero infracciones.

### CT-E33

**Las sospechas de la fixture se detectan y salen del análisis en lote.**

| Campo | Valor |
|---|---|
| Escenario | [CN09 · Respuestas sospechosas](#cn09) |
| Prueba | `tests/e2e/respostas.spec.ts` › "a fixture inconsistente sai com as 4 suspeitas da equipe e dá para tirá-las da análise" (la fixture inconsistente sale con las 4 sospechas del equipo y se pueden quitar del análisis) |
| Precondiciones | Estudio con la fixture inconsistente (15). |
| Requisitos | [RF51](requisitos.md#rf51), [RF52](requisitos.md#rf52), [RF54](requisitos.md#rf54) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Abrir Respuestas y ejecutar axe.
2. Marcar Mostrar solo sospechosas.
3. Hacer clic en Quitar sospechosas del análisis.
4. Abrir Resultados y hacer clic en Ver respuestas.

Resultado esperado: La URL gana suspeitas=1 y aparece "Mostrando 4 de 15.", con 4 sospechas por amplitud. El lote anuncia "4 participaciones sospechosas salieron del análisis. No se borró nada…". El resumen general dice "11 en el análisis y 4 fuera". El panel muestra "4 participaciones fuera del análisis." y el enlace vuelve a Respuestas.

### CT-E34

**Quitar y devolver una participación se anuncia y es reversible.**

| Campo | Valor |
|---|---|
| Escenario | [CN09 · Respuestas sospechosas](#cn09) |
| Prueba | `tests/e2e/respostas.spec.ts` › "incluir e excluir uma participação avisa e nunca apaga" (incluir y excluir una participación avisa y nunca borra) |
| Precondiciones | Estudio con 3 respuestas. |
| Requisitos | [RF54](requisitos.md#rf54) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Desmarcar "en el análisis" de la primera participación.
2. Marcarla de nuevo.

Resultado esperado: Al desmarcar: "…salió del análisis. No se borró nada" y "3 respuestas · 2 en el análisis". Al marcar: "…volvió al análisis." y "3 respuestas · 3 en el análisis".

### CT-E35

**El detalle de la participación muestra la amplitud de las 6 escalas.**

| Campo | Valor |
|---|---|
| Escenario | [CN09 · Respuestas sospechosas](#cn09) |
| Prueba | `tests/e2e/respostas.spec.ts` › "ver escalas mostra a amplitude de cada escala e destaca as inconsistentes" (ver escalas muestra la amplitud de cada escala y destaca las inconsistentes) |
| Precondiciones | Estudio con la fila 1 de la fixture inconsistente. |
| Requisitos | [RF53](requisitos.md#rf53) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Hacer clic en Ver escalas de la participación.

Resultado esperado: El botón pasa de aria-expanded=false a true y se convierte en Ocultar; la lista tiene 6 escalas, las 6 marcadas como inconsistentes. Cero infracciones.

### CT-E36

**Respuestas no se desplaza en horizontal en 320 px.**

| Campo | Valor |
|---|---|
| Escenario | [CN09 · Respuestas sospechosas](#cn09) |
| Prueba | `tests/e2e/respostas.spec.ts` › "em 320 px a página de respostas não rola na horizontal" (en 320 px la página de respuestas no se desplaza en horizontal) |
| Precondiciones | Estudio con 3 respuestas; ventana de 320 × 640. |
| Requisitos | [RF52](requisitos.md#rf52), [RNF02](requisitos.md#rnf02) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Abrir Respuestas.

Resultado esperado: El ancho del documento no supera la ventana.

### CT-E37

**Los tres CSV y la hoja oficial salen con el nombre, la codificación y el contenido correctos.**

| Campo | Valor |
|---|---|
| Escenario | [CN11 · Exportación en CSV](#cn11) |
| Prueba | `tests/e2e/exportacao.spec.ts` › "baixa as 4 exportações com nome datado, BOM e o formato de cada uma, e a planilha oficial em .xlsx" (descarga las 4 exportaciones con nombre fechado, BOM y el formato de cada una, y la hoja oficial en .xlsx) |
| Precondiciones | Estudio con basico (20) e inconsistente (15). |
| Requisitos | [RF56](requisitos.md#rf56), [RF57](requisitos.md#rf57), [RF58](requisitos.md#rf58), [RF59](requisitos.md#rf59) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. En Resultados, descargar Respuestas en bruto, Respuestas recodificadas, Resultados por escala y Hoja oficial del UEQ (XLSX), con "Todas las versiones" seleccionado.

Resultado esperado: Nombres ueq_avaliacao-do-checkout-da-loja-virtual_<tipo>_<aaaa-mm-dd>.csv. En bruto: BOM, cabecera id_participacao;versao;… y 35 filas. Recodificadas con BOM. Resultados: 18 filas (todas + 2 versiones × 6 escalas) con "Checkout da loja virtual;Atratividade;20;0,7333;". Hoja oficial: ueq_avaliacao-do-checkout-da-loja-virtual_planilha-oficial_<aaaa-mm-dd>.xlsx, con las 35 participaciones en Data!A4 y las 20 primeras iguales al respostas.csv de la fixture basico, en el mismo orden.

### CT-E38

**La exportación respeta la sesión y el propietario.**

| Campo | Valor |
|---|---|
| Escenario | [CN04 · Aislamiento y protección de datos](#cn04) |
| Prueba | `tests/e2e/exportacao.spec.ts` › "sem sessão ou de outro pesquisador, a exportação não sai" (sin sesión o desde otro investigador, la exportación no sale) |
| Precondiciones | Estudio con 2 respuestas; una segunda cuenta. |
| Requisitos | [RNF17](requisitos.md#rnf17) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Solicitar /api/estudos/<id>/exportar/brutas sin cookie.
2. Solicitarlo con la otra cuenta.
3. Solicitar el tipo inexistente xlsx con el propietario.

Resultado esperado: Sin cookie: 307 a /entrar. Otra cuenta: 404. Tipo inexistente: 404.

### CT-E39

**El PDF del panel se genera y se descarga.**

| Campo | Valor |
|---|---|
| Escenario | [CN12 · Panel en PDF](#cn12) |
| Prueba | `tests/e2e/painel-pdf.spec.ts` › "baixa o painel em PDF com nome datado, da versão escolhida" (descarga el panel en PDF con nombre fechado, de la versión elegida) |
| Precondiciones | Estudio con basico e inconsistente. |
| Requisitos | [RF60](requisitos.md#rf60) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. En Resultados, hacer clic en Panel en PDF.

Resultado esperado: El archivo se llama ueq_avaliacao-do-checkout-da-loja-virtual_painel_<aaaa-mm-dd>.pdf, empieza por %PDF- y tiene más de 20 KB.

### CT-E40

**La página que se convierte en PDF tiene la cabecera y oculta la navegación al imprimir.**

| Campo | Valor |
|---|---|
| Escenario | [CN12 · Panel en PDF](#cn12) |
| Prueba | `tests/e2e/painel-pdf.spec.ts` › "a página de impressão tem cabeçalho com título, n e data, e no papel some a navegação" (la página de impresión tiene una cabecera con título, n y fecha, y en papel desaparece la navegación) |
| Precondiciones | Estudio con la fixture basico. |
| Requisitos | [RF60](requisitos.md#rf60) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Abrir /estudos/<id>/resultados/impressao y ejecutar axe.
2. Emular el medio print.

Resultado esperado: El h1 es el título del estudio, "n en el análisis" es "20 participaciones" y "Generado el" sigue el formato dd/mm/aaaa a las hh:mm. Al imprimir desaparecen la navegación principal, el enlace para volver y el orden de los ítems. Cero infracciones.

### CT-E41

**El PDF exige sesión.**

| Campo | Valor |
|---|---|
| Escenario | [CN04 · Aislamiento y protección de datos](#cn04) |
| Prueba | `tests/e2e/painel-pdf.spec.ts` › "sem sessão o PDF não sai" (sin sesión el PDF no sale) |
| Precondiciones | Estudio creado. |
| Requisitos | [RF60](requisitos.md#rf60), [RNF17](requisitos.md#rnf17) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Solicitar /api/estudos/<id>/painel-pdf sin cookie.

Resultado esperado: 307 a /entrar.

### CT-E42

**Importar un CSV válido pasa por la vista previa y guarda las filas.**

| Campo | Valor |
|---|---|
| Escenario | [CN13 · Importación por CSV](#cn13) |
| Prueba | `tests/e2e/importacao.spec.ts` › "importa a fixture basico numa versão, com prévia, e as respostas aparecem como importadas" (importa la fixture basico en una versión, con vista previa, y las respuestas aparecen como importadas) |
| Precondiciones | Estudio abierto con 2 versiones. |
| Requisitos | [RF61](requisitos.md#rf61) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Abrir Respuestas › Importar y ejecutar axe.
2. Elegir la versión 2 y el archivo de la fixture basico.
3. Hacer clic en Ver vista previa y ejecutar axe.
4. Hacer clic en Importar 20 respuestas.

Resultado esperado: La pestaña Respuestas sigue con aria-current. El título "20 respuestas listas para importar" recibe el foco y la tabla tiene la cabecera y 5 filas. Después: /respostas?importadas=20, "20 respuestas importadas." y 20 filas "importada desde CSV" en la versión elegida. Cero infracciones.

### CT-E43

**Un archivo con errores se explica fila por fila y no se guarda nada.**

| Campo | Valor |
|---|---|
| Escenario | [CN13 · Importación por CSV](#cn13) |
| Prueba | `tests/e2e/importacao.spec.ts` › "arquivo com erro mostra o problema de cada linha e não importa nada" (un archivo con errores muestra el problema de cada fila y no importa nada) |
| Precondiciones | Estudio abierto. |
| Requisitos | [RF61](requisitos.md#rf61) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Hacer clic en Ver vista previa sin versión ni archivo.
2. Enviar un CSV con una fila correcta, una con 25 valores y una con el valor 9.
3. Hacer clic en Elegir otro archivo.
4. Volver a Respuestas.

Resultado esperado: Primero el resumen "Corrija 1 campo" recibe el foco con un enlace a Versión. Después el título "2 filas con problema en com-erros.csv" recibe el foco, la fila 2 dice "Tiene 25 valores" y la fila 3 "Valores fuera de 1 a 7: ítem 26 ("9")", sin botón Importar. Respuestas sigue vacío. Cero infracciones.

### CT-E44

**La vista previa de la importación no se desplaza en horizontal en 320 px.**

| Campo | Valor |
|---|---|
| Escenario | [CN13 · Importación por CSV](#cn13) |
| Prueba | `tests/e2e/importacao.spec.ts` › "em 320 px a prévia da importação não rola na horizontal" (en 320 px la vista previa de la importación no se desplaza en horizontal) |
| Precondiciones | Estudio abierto; ventana de 320 × 800. |
| Requisitos | [RF61](requisitos.md#rf61), [RNF02](requisitos.md#rnf02) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Ver la vista previa de la fixture basico.

Resultado esperado: El ancho del documento no supera la ventana.

### CT-E45

**El idioma del estudio define el enlace completo, incluso con el navegador en otro idioma, y llega al investigador y a la exportación.**

| Campo | Valor |
|---|---|
| Escenario | [CN07 · Idiomas](#cn07) |
| Prueba | `tests/e2e/idiomas.spec.ts` › "estudo em espanhol: o link abre no idioma do estudo, mesmo com o navegador em português" (estudio en español: el enlace se abre en el idioma del estudio, incluso con el navegador en portugués) |
| Precondiciones | Estudio abierto, escrito en español; navegador del participante en pt-BR. |
| Requisitos | [RF19](requisitos.md#rf19), [RF34](requisitos.md#rf34) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Abrir el enlace.
2. Aceptar.
3. Enviar vacío.
4. Responder todo, enviar y elegir "De 25 a 34 años".
5. Como investigador, abrir Respuestas y descargar las respuestas en bruto.

Resultado esperado: lang=es, títulos y botones en español, instrucción y términos oficiales en español, botones de opción "1 de 7, más cerca de desagradable", resumen "Faltan 26 ítems…". El investigador ve una fila Español sin "traducción no aprobada". El CSV tiene las columnas origem;idioma;traducao_aprovada y la fila ;link;es;sim;25 a 34 anos;. Cero infracciones.

### CT-E46

**El árabe elegido en el selector deja la página en RTL sin invertir la escala.**

| Campo | Valor |
|---|---|
| Escenario | [CN07 · Idiomas](#cn07) |
| Prueba | `tests/e2e/idiomas.spec.ts` › "em árabe pelo seletor: página da direita para a esquerda, escala na ordem oficial" (en árabe por el selector: página de derecha a izquierda, escala en el orden oficial) |
| Precondiciones | Estudio abierto; navegador en pt-BR. |
| Requisitos | [RF34](requisitos.md#rf34) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Elegir árabe en el selector sin aplicar.
2. Hacer clic en Aplicar.
3. Aceptar.
4. Medir la posición de los términos y de los botones de opción 1 y 7 en el ítem 1.
5. Responder, enviar y omitir.
6. Como investigador, abrir Respuestas.

Resultado esperado: Elegir no cambia la página (lang sigue en pt-BR); Aplicar cambia a lang=ar y dir=rtl y muestra el aviso de traducción no aprobada. En el ítem 1, el término izquierdo y el botón de opción 1 quedan a la izquierda del 7 y del término derecho, con el término izquierdo pegado a la izquierda. El investigador ve la fila Árabe con "traducción no aprobada". Cero infracciones.

### CT-E47

**Quien no tiene cuenta navega por la documentación por secciones y subpestañas y ve los diagramas.**

| Campo | Valor |
|---|---|
| Escenario | [CN18 · Documentación en la herramienta](#cn18) |
| Prueba | `tests/e2e/documentacao.spec.ts` › "sem conta, a documentação abre com a barra pública, as seções e as sub-abas, e passa no axe" (sin cuenta, la documentación se abre con la barra pública, las secciones y las subpestañas, y pasa axe) |
| Precondiciones | Navegador sin cookie de sesión. |
| Requisitos | [RF63](requisitos.md#rf63), [RNF01](requisitos.md#rnf01) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Abrir /documentacao y ejecutar axe.
2. Hacer clic en la pestaña Modelado.
3. En el índice de Casos de uso, abrir Diagrama 1 y ejecutar axe.
4. Volver a la portada de Casos de uso y hacer clic en la subpestaña Diagrama de clases.

Resultado esperado: La barra muestra Documentación (con aria-current) y Entrar, y nada de Estudios ni Salir. El h1 es "Documentación", la pestaña Vista general queda marcada y la ficha dice "El índice de la documentación". Modelado abre /documentacao/casos-de-uso con el título "Casos de uso · Documentación", con la pestaña y la subpestaña marcadas. La página del Diagrama 1 carga el diagrama como imagen con texto alternativo. La subpestaña lleva al h1 "Diagrama de clases". Cero infracciones.

### CT-E48

**Quien inició sesión llega a la documentación por su propia barra y no pierde el camino de vuelta.**

| Campo | Valor |
|---|---|
| Escenario | [CN18 · Documentación en la herramienta](#cn18) |
| Prueba | `tests/e2e/documentacao.spec.ts` › "quem entrou chega à documentação pela barra do pesquisador e continua com ela" (quien inició sesión llega a la documentación por la barra del investigador y sigue con ella) |
| Precondiciones | Investigador con sesión iniciada. |
| Requisitos | [RF63](requisitos.md#rf63) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Hacer clic en Documentación en la barra superior y ejecutar axe.

Resultado esperado: La URL pasa a /documentacao, el enlace Documentación queda con aria-current, Estudios y Salir siguen en la barra y Entrar no aparece. Cero infracciones.

### CT-E49

**Los enlaces entre documentos y las descargas funcionan dentro de la herramienta, sin cuenta.**

| Campo | Valor |
|---|---|
| Escenario | [CN18 · Documentación en la herramienta](#cn18) |
| Prueba | `tests/e2e/documentacao.spec.ts` › "os links entre documentos levam à âncora dentro da ferramenta e a planilha baixa sem conta" (los enlaces entre documentos llevan al ancla dentro de la herramienta y la hoja se descarga sin cuenta) |
| Precondiciones | Navegador sin cookie de sesión. |
| Requisitos | [RF65](requisitos.md#rf65) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. En la matriz de trazabilidad, abrir Requisitos funcionales › Acceso y cuenta y hacer clic en RF01.
2. En la portada de Requisitos, comprobar el enlace Ver en GitHub de la ficha.
3. Descargar la hoja de requisitos desde la ficha.

Resultado esperado: La URL lleva a la página de Requisitos en la que está el RF01 (/documentacao/requisitos/requisitos-funcionais/acesso-e-conta#rf01), y la fila del RF01 queda en la pantalla. El enlace de GitHub apunta a docs/documentacao/requisitos.md. La descarga sale como planilha-requisitos.xlsx.

### CT-E50

**La documentación no se desplaza en horizontal en 320 px.**

| Campo | Valor |
|---|---|
| Escenario | [CN18 · Documentación en la herramienta](#cn18) |
| Prueba | `tests/e2e/documentacao.spec.ts` › "em 320 px a documentação não rola na horizontal" (en 320 px la documentación no se desplaza en horizontal) |
| Precondiciones | Ventana de 320 × 640. |
| Requisitos | [RF63](requisitos.md#rf63), [RNF02](requisitos.md#rnf02) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Abrir la vista general, Requisitos y Arquitectura.

Resultado esperado: En las tres páginas el ancho del documento no supera la ventana: las tablas y los diagramas se desplazan dentro de su propia región.

### CT-E51

**Ni la página ni la ruta de archivos entregan lo que no está en el catálogo, y el área del investigador sigue cerrada.**

| Campo | Valor |
|---|---|
| Escenario | [CN18 · Documentación en la herramienta](#cn18) |
| Prueba | `tests/e2e/documentacao.spec.ts` › "endereço fora do catálogo dá 404 e os arquivos só saem da lista" (una dirección fuera del catálogo da 404 y los archivos solo salen de la lista) |
| Precondiciones | Navegador sin cookie de sesión. |
| Requisitos | [RF65](requisitos.md#rf65) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Abrir /documentacao/nao-existe.
2. Solicitar /api/documentacao/package.json, ..%2F..%2F.env y un diagrama con nombre no válido.
3. Solicitar requisitos.csv y /estudos sin cookie.

Resultado esperado: La página da 404; las tres solicitudes de archivo dan 404; requisitos.csv sale (200) solo si Requisitos está publicado, si no, da 404; /estudos sigue enviando a /entrar (307).

### CT-E52

**Quien responde solo ve el formulario y el selector de idioma.**

| Campo | Valor |
|---|---|
| Escenario | [CN05 · Participación en el estudio](#cn05) |
| Prueba | `tests/e2e/questionario.spec.ts` › "o link do participante só mostra o formulário e o seletor de idioma, sem caminho para a ferramenta" (el enlace del participante solo muestra el formulario y el selector de idioma, sin camino hacia la herramienta) |
| Precondiciones | Estudio abierto. |
| Requisitos | [RF24](requisitos.md#rf24) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Abrir el enlace y comprobar el selector de idioma.
2. Aceptar.
3. Responder y enviar.
4. Omitir los datos opcionales.

Resultado esperado: En cada paso (consentimiento, cuestionario, datos opcionales y final) no hay barra Principal y todo enlace apunta al propio formulario (/r/…) o a un ancla de la página. Ningún camino lleva a la documentación, a los estudios ni a Entrar.

### CT-E53

**La barra superior se queda arriba durante el desplazamiento, con y sin cuenta.**

| Campo | Valor |
|---|---|
| Escenario | [CN19 · Navegación y barra fija](#cn19) |
| Prueba | `tests/e2e/barra.spec.ts` › "a barra fica fixa no topo ao rolar, com e sem conta" (la barra queda fija arriba al desplazarse, con y sin cuenta) |
| Precondiciones | Una página larga (la página de inicio). |
| Requisitos | [RNF03](requisitos.md#rnf03), [RNF23](requisitos.md#rnf23) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Sin cuenta, abrir la página de inicio y desplazarse hasta el final.
2. Crear una cuenta, abrir la página de inicio y desplazarse hasta la mitad.

Resultado esperado: En los dos casos la página se desplazó más de 1000 px y la barra está en la pantalla con la parte superior en 0.

### CT-E54

**Ni el destino de un ancla ni el elemento con el foco quedan ocultos por la barra.**

| Campo | Valor |
|---|---|
| Escenario | [CN19 · Navegación y barra fija](#cn19) |
| Prueba | `tests/e2e/barra.spec.ts` › "o foco e as âncoras nunca ficam embaixo da barra fixa" (el foco y las anclas nunca quedan debajo de la barra fija) |
| Precondiciones | Ninguna. |
| Requisitos | [RNF03](requisitos.md#rnf03) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Abrir la página de inicio en #inicio-leitura.
2. Enfocar el enlace Política de privacidad y subir 40 veces con Shift+Tab.

Resultado esperado: El ancla empieza por debajo de la barra, y lo mismo cada elemento que recibe el foco fuera de la barra (WCAG 2.4.11).

### CT-E55

**En el móvil la barra fija ocupa una sola línea y el menú se comporta como un control para abrir y cerrar.**

| Campo | Valor |
|---|---|
| Escenario | [CN19 · Navegación y barra fija](#cn19) |
| Prueba | `tests/e2e/barra.spec.ts` › "no celular os links ficam no menu, que fecha com Esc e devolve o foco" (en el móvil los enlaces quedan en el menú, que se cierra con Esc y devuelve el foco) |
| Precondiciones | Ventana de 390 × 844. |
| Requisitos | [RNF03](requisitos.md#rnf03), [RNF23](requisitos.md#rnf23) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Comprobar el botón Menú cerrado.
2. Abrir el menú y ejecutar axe.
3. Pulsar Esc con el foco en el botón Entrar.
4. Abrir el menú, hacer clic en el logotipo (va a /) y volver.

Resultado esperado: Cerrado: aria-expanded=false, botón Entrar oculto y barra de menos de 80 px. Abierto: aria-expanded=true, Entrar visible y cero infracciones. Esc cierra y devuelve el foco al botón. Al cambiar de página el menú se cierra, y al volver sigue cerrado.

### CT-E56

**En el ordenador los enlaces están siempre a la vista en la barra.**

| Campo | Valor |
|---|---|
| Escenario | [CN19 · Navegación y barra fija](#cn19) |
| Prueba | `tests/e2e/barra.spec.ts` › "no computador o botão Menu não aparece e os links ficam na barra" (en el ordenador el botón Menú no aparece y los enlaces quedan en la barra) |
| Precondiciones | Ventana de 1280 × 800. |
| Requisitos | [RNF23](requisitos.md#rnf23) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Abrir la documentación.

Resultado esperado: El botón Menú no aparece y el botón Entrar está visible en la barra.

### CT-E57

**El diagrama se abre a pantalla completa, con zoom y arrastre, y se cierra devolviendo el foco.**

| Campo | Valor |
|---|---|
| Escenario | [CN18 · Documentación en la herramienta](#cn18) |
| Prueba | `tests/e2e/documentacao.spec.ts` › "clicar no diagrama abre em tela cheia, com zoom, arrasto, Voltar e Esc" (hacer clic en el diagrama lo abre a pantalla completa, con zoom, arrastre, Volver y Esc) |
| Precondiciones | Navegador sin cookie de sesión. |
| Requisitos | [RF64](requisitos.md#rf64) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. En un documento publicado, hacer clic en el primer diagrama y ejecutar axe.
2. Hacer clic dos veces en Aumentar.
3. Arrastrar el diagrama con el ratón.
4. Pulsar - y después 0.
5. Hacer clic en Volver.
6. Con el foco en el diagrama, pulsar Enter y después Esc.

Resultado esperado: La ventana con el título del diagrama ocupa todo el ancho, Volver recibe el foco y la imagen se carga; cero infracciones. El zoom llega al 150% y el área pasa a desplazarse; arrastrar cambia la posición y Volver sigue arriba. - lleva al 125% y 0 vuelve al 100%. Volver y Esc cierran, y el foco vuelve al diagrama.

### CT-E58

**Entrar y Crear cuenta se abren en una ventana sobre la página, caben sin desplazamiento y se cierran devolviendo el foco.**

| Campo | Valor |
|---|---|
| Escenario | [CN20 · Página de inicio y ventanas](#cn20) |
| Prueba | `tests/e2e/inicial.spec.ts` › "Entrar abre a janela por cima da página, sem rolar, e Esc fecha devolvendo o foco" (Entrar abre la ventana sobre la página, sin desplazamiento, y Esc la cierra devolviendo el foco) |
| Precondiciones | Página de inicio (/) sin sesión. |
| Requisitos | [RF02](requisitos.md#rf02), [RF11](requisitos.md#rf11) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Hacer clic en Entrar en la barra.
2. Medir la caja de la ventana y ejecutar axe.
3. Hacer clic en Crear cuenta dentro de la ventana.
4. Pulsar Esc.

Resultado esperado: Se abre la ventana "Entrar" con el foco en Correo electrónico, y la URL sigue en /. El contenido cabe sin barra de desplazamiento; cero infracciones. Crear cuenta cambia el formulario en la misma ventana, con el foco en Nombre. Esc cierra y devuelve el foco al botón Entrar.

### CT-E59

**Cerrar la ventana abierta desde la dirección /entrar lleva a la página de inicio.**

| Campo | Valor |
|---|---|
| Escenario | [CN20 · Página de inicio y ventanas](#cn20) |
| Prueba | `tests/e2e/inicial.spec.ts` › "fechar a janela em /entrar volta para a página inicial" |
| Precondiciones | Navegador sin cookie de sesión. |
| Requisitos | [RF11](requisitos.md#rf11) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Abrir /entrar.
2. Hacer clic en Cerrar (x).

Resultado esperado: La ventana desaparece y la URL pasa a ser /.

### CT-E60

**Quien ya ha iniciado sesión ve la página de inicio con la barra del investigador.**

| Campo | Valor |
|---|---|
| Escenario | [CN20 · Página de inicio y ventanas](#cn20) |
| Prueba | `tests/e2e/inicial.spec.ts` › "quem entrou vê a página inicial com a barra do pesquisador e o caminho para os estudos" |
| Precondiciones | Investigador con sesión iniciada. |
| Requisitos | [RF11](requisitos.md#rf11) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Abrir /.
2. Hacer clic en "Ver sus estudios".

Resultado esperado: La barra tiene el botón Salir. "Ver sus estudios" lleva a /estudos.

### CT-E61

**El navegador recibe el icono del sitio, también sin sesión.**

| Campo | Valor |
|---|---|
| Escenario | [CN20 · Página de inicio y ventanas](#cn20) |
| Prueba | `tests/e2e/inicial.spec.ts` › "o navegador recebe o ícone do site" |
| Precondiciones | Navegador sin cookie de sesión. |
| Requisitos | [RF11](requisitos.md#rf11) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Abrir / y leer el enlace rel=icon.
2. Solicitar el icono SVG y el apple-touch-icon.

Resultado esperado: El enlace apunta a /icon.svg; el SVG se devuelve con 200 e image/svg+xml, y el apple-touch-icon se devuelve como image/png.

### CT-E62

**Un documento en elaboración muestra solo el aviso y la ficha, y la ruta no sirve sus archivos.**

| Campo | Valor |
|---|---|
| Escenario | [CN18 · Documentación en la herramienta](#cn18) |
| Prueba | `tests/e2e/documentacao.spec.ts` › "documento em produção mostra o aviso e a ficha, sem texto, arquivo nem downloads" |
| Precondiciones | Navegador sin cookie de sesión; Requisitos todavía en elaboración. |
| Requisitos | [RF63](requisitos.md#rf63) |
| Resultado el 18/11/2026 | Omitido (móvil y escritorio): todos los documentos del catálogo están publicados, así que no hay ningún documento en elaboración que abrir |

Pasos:

1. Abrir /documentacao y ejecutar axe.
2. En la tabla Situación de los documentos, hacer clic en Requisitos y ejecutar axe.
3. Solicitar requisitos.csv y planilha-requisitos.xlsx.

Resultado esperado: La visión general muestra "El equipo está escribiendo la documentación." y la tabla con Requisitos "En elaboración". Requisitos muestra el h1, el aviso "Requisitos: en elaboración." y la ficha con "En elaboración", sin Ver en GitHub, sin descargas y sin article. Los dos archivos devuelven 404. Cero violaciones.

### CT-E63

**El propietario invita por correo electrónico, el invitado acepta en la campana y, como lector, solo puede ver.**

| Campo | Valor |
|---|---|
| Escenario | [CN21 · Equipo y notificaciones](#cn21) |
| Prueba | `tests/e2e/equipe.spec.ts` › "convite por e-mail chega no sino, o leitor só vê e o dono é avisado" |
| Precondiciones | Dos cuentas, cada una en su navegador; el propietario tiene un estudio. |
| Requisitos | [RF20](requisitos.md#rf20), [RF21](requisitos.md#rf21), [RF22](requisitos.md#rf22) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. En Compartir, invitar a un correo electrónico sin cuenta.
2. Invitar a la segunda cuenta como Lector y ejecutar axe.
3. En la segunda cuenta, abrir Estudios y la campana, y aceptar.
4. En la cuenta del propietario, abrir Notificaciones y ejecutar axe.

Resultado esperado: Un correo electrónico sin cuenta muestra "No hay ninguna cuenta con ese correo electrónico". La invitación aparece como "Invitación pendiente" y el estado dice "Invitación enviada". La segunda cuenta ve "Tiene 1 invitación pendiente" y "lo invitó… como lector". Después de aceptar, ve "usted es lector", sin Editar estudio ni Abrir recogida. El propietario recibe "aceptó la invitación al estudio". Cero violaciones.

### CT-E64

**La campana se abre y se cierra solo con el teclado, y devuelve el foco.**

| Campo | Valor |
|---|---|
| Escenario | [CN21 · Equipo y notificaciones](#cn21) |
| Prueba | `tests/e2e/equipe.spec.ts` › "o sino também funciona pelo teclado" |
| Precondiciones | Investigador con sesión iniciada, sin avisos. |
| Requisitos | [RF22](requisitos.md#rf22), [RNF03](requisitos.md#rnf03) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Llegar a la campana con Tab y pulsar Enter.
2. Pulsar Esc.

Resultado esperado: Enter deja aria-expanded=true y muestra "Nada nuevo". Esc deja aria-expanded=false y el foco vuelve a la campana.

### CT-E65

**Cada página del investigador se explica a sí misma en una ventana.**

| Campo | Valor |
|---|---|
| Escenario | [CN22 · Aprender a usar](#cn22) |
| Prueba | `tests/e2e/equipe.spec.ts` › "toda página do pesquisador tem o (?) com a ajuda dela" |
| Precondiciones | Investigador con sesión iniciada. |
| Requisitos | [RF10](requisitos.md#rf10) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. En /estudos, /estudos/novo, /conta y /notificacoes, abrir Ayuda de esta página.
2. Ejecutar axe.
3. Pulsar Esc.

Resultado esperado: La ventana se abre con el título de la página, sin violaciones, y Esc la cierra.

### CT-E66

**El recorrido empieza en el primer acceso, avanza con la acción de la persona y no vuelve después de omitirlo.**

| Campo | Valor |
|---|---|
| Escenario | [CN22 · Aprender a usar](#cn22) |
| Prueba | `tests/e2e/equipe.spec.ts` › "o tour abre só no primeiro acesso, avança pelo clique na ação e pode ser pulado" |
| Precondiciones | Correo electrónico de prueba nuevo. |
| Requisitos | [RF09](requisitos.md#rf09) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Crear la cuenta y ejecutar axe en la bienvenida.
2. Hacer clic en Comenzar el recorrido.
3. Hacer clic en el estudio de ejemplo destacado.
4. Hacer clic en Omitir tutorial y recargar.

Resultado esperado: Aparece "Bienvenido a Herramienta UEQ". El recorrido crea "Ejemplo del recorrido: app de reparto a domicilio", muestra "Paso 1 de 10" y, con el clic, "Paso 2 de 10". Una vez omitido, la tarjeta desaparece y la bienvenida no vuelve al recargar. Cero violaciones.

### CT-E67

**El idioma elegido en el registro se aplica a la herramienta y se puede cambiar después.**

| Campo | Valor |
|---|---|
| Escenario | [CN24 · Idioma de la herramienta](#cn24) |
| Prueba | `tests/e2e/idioma-interface.spec.ts` › "o idioma escolhido ao criar a conta vale para a ferramenta e pode ser trocado em Minha conta" |
| Precondiciones | Una traducción de "Minha conta" al alemán grabada directamente en la base de datos, como la grabaría la API. Solo se ejecuta en escritorio. |
| Requisitos | [RF08](requisitos.md#rf08) |
| Resultado el 18/11/2026 | Aprobado en escritorio; omitido en móvil, donde la barra queda contraída |

Pasos:

1. En Crear cuenta, rellenar los campos y ejecutar axe.
2. Elegir "Deutsch" en Idioma de la herramienta.
3. Crear la cuenta y omitir el recorrido.
4. En /conta/idioma, elegir Português y guardar.

Resultado esperado: Lo que se escribió se mantiene después del cambio. La barra muestra "Mein Konto", y el lang queda en pt-BR, porque casi nada está traducido. Guardar muestra "Idioma da ferramenta trocado." (Idioma de la herramienta cambiado.) y la barra vuelve a "Minha conta" (Mi cuenta). Cero violaciones.

### CT-E68

**Cambiar el idioma en el cuestionario no pierde las marcas.**

| Campo | Valor |
|---|---|
| Escenario | [CN07 · Idiomas](#cn07) |
| Prueba | `tests/e2e/idiomas.spec.ts` › "o idioma também troca no meio do questionário, sem perder o que já foi marcado" |
| Precondiciones | Estudio abierto. |
| Requisitos | [RF30](requisitos.md#rf30), [RF34](requisitos.md#rf34) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Aceptar y marcar el ítem 1.
2. Elegir inglés en el selector y hacer clic en Aplicar.
3. Ejecutar axe.

Resultado esperado: Sigue en /questionario, con lang=en. El ítem 1 ahora es "annoying or enjoyable", sigue marcado, y el progreso dice "1 of 26 answered". Cero violaciones.

### CT-E69

**La página de inicio cita los estudios y da los créditos.**

| Campo | Valor |
|---|---|
| Escenario | [CN20 · Página de inicio y ventanas](#cn20) |
| Prueba | `tests/e2e/inicial.spec.ts` › "a página inicial explica o UEQ, lista os estudos do método e dá os créditos" |
| Precondiciones | Navegador sin cookie de sesión. |
| Requisitos | [RF11](requisitos.md#rf11) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. En /, hacer clic en Estudios sobre el método en el índice.
2. Comprobar los enlaces de las referencias.
3. Comprobar los créditos y ejecutar axe.

Resultado esperado: La URL termina en #inicio-estudos. Cada estudio lleva al DOI, y el manual, al PDF oficial. Los créditos citan a los autores del UEQ, la asignatura y los tres miembros del equipo. Cero violaciones.

### CT-E70

**El logotipo lleva a la página de inicio, y quien ha iniciado sesión ve el camino a los estudios.**

| Campo | Valor |
|---|---|
| Escenario | [CN20 · Página de inicio y ventanas](#cn20) |
| Prueba | `tests/e2e/inicial.spec.ts` › "quem entrou volta à página inicial pelo logotipo" |
| Precondiciones | Investigador con sesión iniciada, en /conta. |
| Requisitos | [RF11](requisitos.md#rf11) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Hacer clic en el logotipo de la barra.

Resultado esperado: La URL es / y aparece el enlace "Ver sus estudios".

### CT-E71

**Sin la recogida activada, la etapa de datos opcionales no existe.**

| Campo | Valor |
|---|---|
| Escenario | [CN05 · Participación en el estudio](#cn05) |
| Prueba | `tests/e2e/questionario.spec.ts` › "sem coleta de dados demográficos, o envio leva direto ao agradecimento" |
| Precondiciones | Estudio abierto con la recogida demográfica desactivada. |
| Requisitos | [RF18](requisitos.md#rf18), [RF32](requisitos.md#rf32) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Abrir el enlace y aceptar.
2. Responder todo y enviar.
3. Abrir /sobre-voce desde la dirección.

Resultado esperado: La lista de etapas tiene 2 elementos y aparece "Paso 2 de 2 · Cuestionario". El envío lleva a "Respuestas registradas", y la etapa no se abre ni siquiera desde la dirección.

### CT-E72

**El perfil de los participantes aparece en una subpestaña de Resultados, con la tabla de números.**

| Campo | Valor |
|---|---|
| Escenario | [CN10 · Panel de resultados](#cn10) |
| Prueba | `tests/e2e/privacidade.spec.ts` › "os dados demográficos aparecem em Resultados, numa sub-aba própria" |
| Precondiciones | Estudio abierto con la recogida activada y una respuesta. |
| Requisitos | [RF50](requisitos.md#rf50) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Responder eligiendo 25 a 34 años.
2. Como investigador, abrir Resultados y Datos demográficos.
3. Abrir "Ver los números" y ejecutar axe.

Resultado esperado: El gráfico de Grupo de edad tiene el aria-label "25 a 34 años, 1 (100%)", y la tabla muestra 100%. Cero violaciones.

### CT-E73

**Toda respuesta trae las cabeceras de seguridad.**

| Campo | Valor |
|---|---|
| Escenario | [CN23 · Protección de datos](#cn23) |
| Prueba | `tests/e2e/privacidade.spec.ts` › "toda resposta sai com os cabeçalhos de segurança" |
| Precondiciones | Ninguna. |
| Requisitos | [RNF18](requisitos.md#rnf18) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Solicitar / y leer las cabeceras.

Resultado esperado: CSP con frame-ancestors 'none', HSTS de 2 años, nosniff, X-Frame-Options DENY, Referrer-Policy same-origin y sin X-Powered-By.

### CT-E74

**La política se abre sin cuenta y pasa axe.**

| Campo | Valor |
|---|---|
| Escenario | [CN23 · Protección de datos](#cn23) |
| Prueba | `tests/e2e/privacidade.spec.ts` › "a política de privacidade é pública e acessível" |
| Precondiciones | Navegador sin cookie de sesión. |
| Requisitos | [RNF01](requisitos.md#rnf01), [RNF19](requisitos.md#rnf19) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Abrir /privacidade y ejecutar axe.

Resultado esperado: El h1 es "Política de privacidad" y aparece "Sus derechos (LGPD, art. 18)". Cero violaciones.

### CT-E75

**El índice lleva a cada sección, y la página cabe en 320 px.**

| Campo | Valor |
|---|---|
| Escenario | [CN23 · Protección de datos](#cn23) |
| Prueba | `tests/e2e/privacidade.spec.ts` › "a política leva cada seção pelo índice e não rola na horizontal em 320 px" |
| Precondiciones | Navegador sin cookie de sesión. |
| Requisitos | [RNF02](requisitos.md#rnf02), [RNF19](requisitos.md#rnf19) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. En /privacidade, hacer clic en Dudas y solicitudes en el índice.
2. Reducir el ancho a 320 px y ejecutar axe.

Resultado esperado: La URL termina en #contato, con la sección a la vista. En 320 px no hay desplazamiento horizontal. Cero violaciones.

### CT-E76

**Volver lleva al pie de la página de inicio, desde donde salió la persona.**

| Campo | Valor |
|---|---|
| Escenario | [CN23 · Protección de datos](#cn23) |
| Prueba | `tests/e2e/privacidade.spec.ts` › "da página inicial, a política volta ao rodapé de onde a pessoa saiu" |
| Precondiciones | Navegador sin cookie de sesión. |
| Requisitos | [RNF19](requisitos.md#rnf19) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. En /, hacer clic en Política de privacidad en el pie de página.
2. Hacer clic en Volver a la página de inicio.

Resultado esperado: La URL termina en /#rodape, con el pie de página a la vista.

### CT-E77

**Desde Mi cuenta y desde la ayuda, Volver lleva a la pantalla de origen.**

| Campo | Valor |
|---|---|
| Escenario | [CN23 · Protección de datos](#cn23) |
| Prueba | `tests/e2e/privacidade.spec.ts` › "de Minha conta e da ajuda, a política volta para a mesma tela" |
| Precondiciones | Investigador con sesión iniciada. |
| Requisitos | [RNF19](requisitos.md#rnf19) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. En /conta, abrir la política.
2. Hacer clic en Volver a Mi cuenta.
3. En /estudos, abrir la ayuda y, desde ella, la política.
4. Hacer clic en Volver a la página anterior.

Resultado esperado: Con sesión iniciada, la ficha muestra "Descargar mis datos". Los dos Volver llevan a /conta y a /estudos.

### CT-E78

**La política se abre en otra pestaña desde las ventanas, sin perder lo que se escribió.**

| Campo | Valor |
|---|---|
| Escenario | [CN23 · Protección de datos](#cn23) |
| Prueba | `tests/e2e/privacidade.spec.ts` › "das janelas de acesso, a política abre em outra aba, sem perder o que foi digitado, e voltar tenta fechar a aba" |
| Precondiciones | Navegador sin cookie de sesión. |
| Requisitos | [RNF19](requisitos.md#rnf19) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Abrir /entrar y comprobar el enlace.
2. En /cadastrar, escribir el nombre.
3. Hacer clic en Política de privacidad.
4. En la pestaña nueva, hacer clic en Cerrar esta pestaña y volver.

Resultado esperado: La ventana de Entrar también tiene el enlace. La pestaña nueva muestra la política, y el campo Nombre sigue rellenado en la pestaña de origen. Volver pide cerrar la pestaña; si el navegador lo rechaza, continúa a la página de inicio. La prueba sustituye window.close por un registro, porque el cierre real bloquea la finalización de Playwright en Chromium headless. El cierre real se comprobó aparte, en un script con Playwright, el 06/11/2026, y el caso manual CT-M23 repite la comprobación.

### CT-E79

**El destino de Volver nunca sale de la herramienta.**

| Campo | Valor |
|---|---|
| Escenario | [CN23 · Protección de datos](#cn23) |
| Prueba | `tests/e2e/privacidade.spec.ts` › "a política não aceita voltar para outro site" |
| Precondiciones | Ninguna. |
| Requisitos | [RNF19](requisitos.md#rnf19) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Abrir /privacidade?de= con https://exemplo.com, //exemplo.com, /\exemplo.com y /[tab]/exemplo.com.

Resultado esperado: En los cuatro casos, el enlace es "Volver a la página de inicio" y apunta a /.

### CT-E80

**Después de 5 contraseñas incorrectas, el inicio de sesión bloquea el correo electrónico.**

| Campo | Valor |
|---|---|
| Escenario | [CN23 · Protección de datos](#cn23) |
| Prueba | `tests/e2e/privacidade.spec.ts` › "depois de 5 senhas erradas o e-mail espera" |
| Precondiciones | Un correo electrónico de prueba. |
| Requisitos | [RNF16](requisitos.md#rnf16) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Introducir mal la contraseña 5 veces en Entrar.
2. Intentarlo de nuevo.

Resultado esperado: Cada error muestra "contraseña no coinciden", y el foco va al resumen. El sexto intento muestra "Demasiados intentos con este correo electrónico".

### CT-E81

**Descargar mis datos entrega la cuenta en JSON, sin la contraseña.**

| Campo | Valor |
|---|---|
| Escenario | [CN23 · Protección de datos](#cn23) |
| Prueba | `tests/e2e/privacidade.spec.ts` › "Baixar meus dados entrega um JSON com a conta e sem a senha" |
| Precondiciones | Investigador con sesión iniciada. |
| Requisitos | [RF07](requisitos.md#rf07) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. En /conta, hacer clic en Descargar mis datos.

Resultado esperado: El archivo se llama meus-dados-ferramenta-ueq-AAAA-MM-DD.json, trae el correo electrónico de la cuenta y no tiene senhaHash.

### CT-E82

**El participante lee la política desde el formulario, sin salir del enlace del estudio.**

| Campo | Valor |
|---|---|
| Escenario | [CN05 · Participación en el estudio](#cn05) |
| Prueba | `tests/e2e/questionario.spec.ts` › "a política de privacidade abre pelo termo, dentro do link do participante, e volta para ele" |
| Precondiciones | Estudio abierto. |
| Requisitos | [RF25](requisitos.md#rf25), [RNF19](requisitos.md#rnf19) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Abrir el enlace.
2. Hacer clic en Política de privacidad.
3. Comprobar los enlaces de la página y ejecutar axe.
4. Hacer clic en Volver.

Resultado esperado: La URL termina en /privacidade, con el h1 "Política de privacidad" y la sección "Si usted respondió un cuestionario". No hay barra de la herramienta y todo enlace queda en /r/ o es un ancla. Volver lleva al formulario. Cero violaciones.

### CT-E83

**Sin traducción, la política avisa en el idioma de la persona y marca el texto como portugués.**

| Campo | Valor |
|---|---|
| Escenario | [CN05 · Participación en el estudio](#cn05) |
| Prueba | `tests/e2e/questionario.spec.ts` › "sem tradução automática, a política avisa no idioma da pessoa e sai marcada como português" |
| Precondiciones | Estudio abierto, escrito en inglés; sin traducción de la política en la base de datos. |
| Requisitos | [RF34](requisitos.md#rf34), [RNF19](requisitos.md#rnf19) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Abrir el enlace.
2. Hacer clic en Privacy policy.
3. Ejecutar axe.

Resultado esperado: Aparece "This policy has not been translated into your language yet". El main tiene lang=pt-BR, y el enlace es "Back". Cero violaciones.

### CT-E84

**Un documento largo se abre como índice, y cada sección se abre en una página propia, con el diagrama a la vista.**

| Campo | Valor |
|---|---|
| Escenario | [CN18 · Documentación en la herramienta](#cn18) |
| Prueba | `tests/e2e/documentacao.spec.ts` › "documento longo abre como índice, e cada seção em página própria com o diagrama à vista" |
| Precondiciones | Navegador sin cookie de sesión. |
| Requisitos | [RF63](requisitos.md#rf63) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Abrir /documentacao/diagramas-de-sequencia y ejecutar axe.
2. Hacer clic en 7. Invitar a alguien al estudio y ejecutar axe.
3. Hacer clic en Siguiente.
4. Hacer clic en Anterior.

Resultado esperado: El índice "En este documento" tiene 8 elementos, sin ningún diagrama en la apertura. La sección tiene dirección propia, título de página con el documento, h1, "7 de 8" y el diagrama cargado y a la vista sin desplazarse. En la última sección no hay Siguiente. Cero violaciones.

### CT-E85

**Volver lleva a la página de la que vino la persona y, sin historial, a la página superior.**

| Campo | Valor |
|---|---|
| Escenario | [CN18 · Documentación en la herramienta](#cn18) |
| Prueba | `tests/e2e/documentacao.spec.ts` › "Voltar leva à página de onde a pessoa veio e, sem histórico, à página de cima" |
| Precondiciones | Navegador sin cookie de sesión. |
| Requisitos | [RF63](requisitos.md#rf63) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. En una sección de Diagramas de secuencia, seguir el enlace a Arquitectura.
2. Hacer clic en Volver.
3. En otra pestaña, abrir directamente el diagrama del modelo lógico.
4. Hacer clic en Volver.

Resultado esperado: El enlace lleva a /documentacao/arquitetura/implantacao. El primer Volver regresa a la sección de origen, en otro documento. Sin historial, Volver lleva a la apertura del documento.

### CT-E86

**Una sección con muchas subsecciones se convierte en índice, y los enlaces de tabla y las direcciones antiguas encuentran la página correcta.**

| Campo | Valor |
|---|---|
| Escenario | [CN18 · Documentación en la herramienta](#cn18) |
| Prueba | `tests/e2e/documentacao.spec.ts` › "seção com muitas subseções vira índice, e o link de uma tabela leva à página da linha" |
| Precondiciones | Navegador sin cookie de sesión. |
| Requisitos | [RF65](requisitos.md#rf65) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Abrir Casos de extremo a extremo y hacer clic en CT-E02.
2. En Escenarios, hacer clic en CT-E01.
3. Abrir /documentacao/casos-de-teste#ct-e03 y #ct-u01.
4. Abrir una sección que no existe y una de un documento no publicado.

Resultado esperado: Cada caso tiene página propia, sin violaciones. El fragmento antiguo redirige a la página nueva, y #ct-u01 queda a la vista en la tabla del escenario. Una sección inexistente y un documento no publicado devuelven 404.

### CT-E87

**Un documento corto sigue entero, sin clics de más.**

| Campo | Valor |
|---|---|
| Escenario | [CN18 · Documentación en la herramienta](#cn18) |
| Prueba | `tests/e2e/documentacao.spec.ts` › "documento curto continua inteiro, com o índice da página na ficha" |
| Precondiciones | Navegador sin cookie de sesión. |
| Requisitos | [RF63](requisitos.md#rf63) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Abrir /documentacao/checklist-manual.

Resultado esperado: Las secciones aparecen en la misma página, sin el índice "En este documento", y la ficha enumera las anclas.

### CT-E88

**Mientras la acción se ejecuta, el botón muestra que está procesando y nada se envía dos veces.**

| Campo | Valor |
|---|---|
| Escenario | [CN03 · Gestión de estudios](#cn03) |
| Prueba | `tests/e2e/estudos.spec.ts` › "enquanto cria o estudo o botão mostra que está processando, ignora novos cliques e no fim confirma" |
| Precondiciones | Investigador con sesión iniciada; la prueba retrasa los envíos 1,2 s. |
| Requisitos | [RNF20](requisitos.md#rnf20) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Rellenar Crear estudio y hacer clic en Crear estudio.
2. Hacer clic de nuevo en el botón ocupado, dos veces, y pulsar Enter.
3. Esperar la página del estudio y ejecutar axe.
4. Abrir la lista de estudios.

Resultado esperado: El botón dice "Creando el estudio…", con aria-busy y aria-disabled. La página del estudio muestra "Estudio creado con éxito." y la lista tiene un solo estudio con ese título. Cero violaciones.

### CT-E89

**La confirmación acompaña el desplazamiento, se puede cerrar y no vuelve al recargar.**

| Campo | Valor |
|---|---|
| Escenario | [CN03 · Gestión de estudios](#cn03) |
| Prueba | `tests/e2e/estudos.spec.ts` › "a confirmação pode ser fechada e continua à vista depois de rolar a página" |
| Precondiciones | Investigador con sesión iniciada; ventana de 800 × 400 px. |
| Requisitos | [RNF20](requisitos.md#rnf20) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Crear un estudio.
2. Desplazarse hasta el final de la página.
3. Hacer clic en Cerrar en la confirmación.
4. Recargar.

Resultado esperado: La confirmación sigue a la vista después de desplazarse y desaparece al cerrarla. El aviso sale de la dirección, y recargar no vuelve a confirmar.

### CT-E90

**Crear la cuenta, salir y entrar se confirman en pantalla.**

| Campo | Valor |
|---|---|
| Escenario | [CN01 · Acceso y autenticación](#cn01) |
| Prueba | `tests/e2e/autenticacao.spec.ts` › "criar a conta e entrar confirmam na tela" |
| Precondiciones | Correo electrónico de prueba nuevo. |
| Requisitos | [RF01](requisitos.md#rf01), [RF02](requisitos.md#rf02), [RNF20](requisitos.md#rnf20) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Crear la cuenta y omitir el recorrido.
2. Salir y confirmar.
3. Entrar de nuevo.

Resultado esperado: "Cuenta creada con éxito.", "Ha cerrado sesión en su cuenta." y "Ha iniciado sesión en su cuenta." aparecen en role=status, y la dirección queda limpia.

### CT-E91

**El formulario informa todo lo que piden la LGPD y la Resolución CNS 510/2016, y la persona puede guardar una copia.**

| Campo | Valor |
|---|---|
| Escenario | [CN05 · Participación en el estudio](#cn05) |
| Prueba | `tests/e2e/questionario.spec.ts` › "o termo diz o tempo, como desistir, o que acontece depois de enviar, riscos, benefícios e quem responde, e tem uma via para guardar" |
| Precondiciones | Estudio abierto con datos opcionales, creado por un investigador de prueba. |
| Requisitos | [RF25](requisitos.md#rf25) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Abrir el enlace del participante.
2. Leer el formulario y ejecutar axe.
3. Abrir “Guardar una copia de este formulario” y ejecutar axe.
4. Volver, elegir la edad y aceptar.

Resultado esperado: El subtítulo trae la institución. El formulario dice "De 4 a 6 minutos, sin límite de tiempo", habla de los datos opcionales, de “Salir sin enviar”, de que no hay forma de retirar las respuestas después de enviarlas, de la conservación mientras dure la investigación, de los riesgos, de los beneficios y del contacto del responsable. La copia tiene "Imprimir o guardar en PDF" y ningún enlace fuera del estudio. El cuestionario muestra el tiempo. Cero violaciones.

### CT-E92

**Sin la edad, o con menos de 18 años sin la autorización del responsable, no se graba nada.**

| Campo | Valor |
|---|---|
| Escenario | [CN23 · Protección de datos](#cn23) |
| Prueba | `tests/e2e/questionario.spec.ts` › "quem tem menos de 18 anos só participa com a autorização do responsável, e sem idade nada é gravado" |
| Precondiciones | Estudio abierto con datos opcionales. |
| Requisitos | [RF25](requisitos.md#rf25) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Aceptar sin elegir la edad.
2. Elegir "Menos de 18 años" y aceptar sin la autorización.
3. Confirmar la autorización y aceptar.
4. Responder, enviar y omitir los datos opcionales.

Resultado esperado: Cada error aparece en role=alert, con el foco en el campo correcto, y la autorización solo aparece para "Menos de 18 años". Con ella, el cuestionario se abre, los datos opcionales tienen "Menos de 18 años" y la participación queda grabada como de menor de edad. Cero violaciones.

### CT-E93

**El formulario exige quién responde por la investigación y sugiere el resto.**

| Campo | Valor |
|---|---|
| Escenario | [CN03 · Gestión de estudios](#cn03) |
| Prueba | `tests/e2e/estudos.spec.ts` › "o estudo nasce com o responsável da conta e exige nome, contato e instituição, que vão para o termo" |
| Precondiciones | Investigador con sesión iniciada. |
| Requisitos | [RF13](requisitos.md#rf13) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Abrir Crear estudio.
2. Borrar el nombre del responsable, escribir un correo electrónico no válido y dejar la institución vacía.
3. Intentar crear.
4. Rellenar los tres campos y crear.

Resultado esperado: El formulario ya viene con el nombre y el correo electrónico de la cuenta y con sugerencias de riesgos y beneficios. Los tres errores aparecen en el resumen y en los campos. La vista previa muestra "Ana Souza · PPGIa · PUCPR", y la ficha del estudio muestra el responsable y el contacto.

### CT-E94

**El selector de la barra es un atajo a Mi cuenta › Idioma, sin salir de la página.**

| Campo | Valor |
|---|---|
| Escenario | [CN24 · Idioma de la herramienta](#cn24) |
| Prueba | `tests/e2e/idioma-interface.spec.ts` › "o seletor de idioma da barra troca a ferramenta e a conta sem sair da página" |
| Precondiciones | Cuenta nueva, creada solo con el teclado. |
| Requisitos | [RF08](requisitos.md#rf08) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Abrir el selector "Idioma: Português" en la barra (en el móvil, dentro del Menú).
2. Ejecutar axe con la lista abierta.
3. Cerrar con Esc.
4. Abrir de nuevo y elegir "Deutsch".
5. Abrir Mi cuenta › Idioma.

Resultado esperado: La lista "Idioma de la herramienta" muestra los 37 idiomas, con Português marcado. Esc la cierra y devuelve el foco al selector. Después de elegir el alemán, la página sigue en /estudos, la barra muestra "Mein Konto", el foco vuelve al selector, ahora "Sprache: Deutsch", y Mi cuenta › Idioma está en Deutsch. Cero violaciones.

### CT-E95

**Sin iniciar sesión, el selector de la barra también cambia el idioma, y la elección se guarda en este navegador.**

| Campo | Valor |
|---|---|
| Escenario | [CN24 · Idioma de la herramienta](#cn24) |
| Prueba | `tests/e2e/idioma-interface.spec.ts` › "sem login, o seletor de idioma da barra fica guardado neste navegador" |
| Precondiciones | Sin iniciar sesión. |
| Requisitos | [RF08](requisitos.md#rf08) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Abrir la Documentación.
2. Elegir "English" en el selector de la barra.
3. Recargar la página.

Resultado esperado: El foco vuelve al selector, ahora "Language: English", y sigue en inglés después de recargar.

### CT-E96

**En cada escenario de validación, el panel y la hoja exportada coinciden con la hoja oficial.**

| Campo | Valor |
|---|---|
| Escenario | [CN15 · Validación con la hoja oficial](#cn15) |
| Prueba | `tests/e2e/planilha-oficial.spec.ts` › "cenário …: o painel e a planilha exportada batem com a planilha oficial", uno por escenario: oficial-exemplo, grande, inconsistente, bordas, variancia-zero, negativo y extremos/n2 |
| Precondiciones | Estudio sin respuestas. El esperado.json de cada escenario salió de la UEQ Data Analysis Tool V15 recalculada en Excel ([data/fixtures/LEIA-ME.md](../../data/fixtures/LEIA-ME.md)). |
| Requisitos | [RF59](requisitos.md#rf59), [RF61](requisitos.md#rf61), [RNF11](requisitos.md#rnf11) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio, 7 escenarios en cada uno) |

Pasos:

1. En Respuestas › Importar respuestas de un CSV, importar el respostas.csv del escenario en la versión "Checkout de la tienda en línea".
2. En Resultados, elegir esa versión.
3. Comparar la tabla Resultados por escala con el esperado.json.
4. Descargar Hoja oficial del UEQ (XLSX).

Resultado esperado: En cada una de las 6 escalas, n, media, DE, IC95, alfa y benchmark iguales a los de la hoja oficial, redondeados como los muestra el panel ("—" donde la hoja da error). El archivo se llama ueq_avaliacao-do-checkout-da-loja-virtual_planilha-oficial_checkout-da-loja-virtual_<aaaa-mm-dd>.xlsx, tiene las respuestas del archivo importado en Data!A4, en el mismo orden, y pide a Excel que recalcule al abrirlo.

### CT-E97

**El formulario explica la diferencia y el participante responde los 8 pares del UEQ-S.**

| Campo | Valor |
|---|---|
| Escenario | [CN16 · UEQ-S](#cn16) |
| Prueba | `tests/e2e/ueq-s.spec.ts` › "o formulário explica a diferença e o participante responde os 8 pares do UEQ-S" |
| Precondiciones | Investigador con un estudio del UEQ-S abierto, sin datos opcionales. |
| Requisitos | [RF62](requisitos.md#rf62), [RF25](requisitos.md#rf25) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Abrir el enlace: el formulario dice 8 pares y De 1 a 2 minutos.
2. Aceptar y comprobar los 8 grupos, con "Item 4 de 8: Confuso ou Evidente" y "Item 7 de 8: Convencional ou Original".
3. Marcar la sexta posición en los 8 y enviar.
4. Abrir Resultados como investigador.
5. Abrir Editar estudio.

Resultado esperado: La visión general dice UEQ-S, versión corta · 8 ítems · 37 idiomas. Resultados lleva a /resultados/ueq-s, con n = 1, pragmática 2,00, la general sin alfa y sin la hoja del UEQ completo; axe sin violaciones. En la edición, la elección aparece bloqueada con el motivo.

### CT-E98

**En cada escenario del UEQ-S, la pestaña UEQ-S y la hoja exportada coinciden con la hoja oficial del UEQ-S.**

| Campo | Valor |
|---|---|
| Escenario | [CN16 · UEQ-S](#cn16) |
| Prueba | `tests/e2e/ueq-s.spec.ts` › "UEQ-S, cenário …: o painel e a planilha exportada batem com a planilha oficial do UEQ-S", uno por escenario: oficial-exemplo, bordas, variancia-zero, negativo y n2 |
| Precondiciones | Estudio del UEQ-S sin respuestas. El esperado.json de cada escenario salió de la hoja oficial del UEQ-S recalculada en Excel ([data/fixtures-ueq-s/LEIA-ME.md](../../data/fixtures-ueq-s/LEIA-ME.md)). |
| Requisitos | [RF61](requisitos.md#rf61), [RF62](requisitos.md#rf62), [RNF11](requisitos.md#rnf11) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio, 5 escenarios en cada uno) |

Pasos:

1. En Respuestas › Importar respuestas de un CSV, comprobar que el formato pide 8 valores e importar el respostas.csv del escenario.
2. En Resultados (pestaña UEQ-S), elegir la versión.
3. Comparar la tabla Resultados por escala con el esperado.json.
4. Descargar Hoja oficial del UEQ-S (XLSX).

Resultado esperado: En la pragmática, la hedónica y la general, n, media, DE, IC95, alfa y benchmark iguales a los de la hoja del UEQ-S, redondeados como los muestra el panel. El archivo termina en _planilha-oficial-ueq-s_checkout-da-loja-virtual_<aaaa-mm-dd>.xlsx, tiene las respuestas importadas en Data!A4, en el mismo orden, y pide recálculo al abrirlo.

### CT-E99

**En un estudio del UEQ completo, la pestaña UEQ-S usa los 8 pares equivalentes y coincide con la hoja del UEQ-S.**

| Campo | Valor |
|---|---|
| Escenario | [CN16 · UEQ-S](#cn16) |
| Prueba | `tests/e2e/ueq-s.spec.ts` › "num estudo do UEQ completo, a aba UEQ-S usa os 8 pares equivalentes e bate com a planilha do UEQ-S" |
| Precondiciones | Estudio del UEQ completo con las 20 respuestas del escenario basico. |
| Requisitos | [RF62](requisitos.md#rf62), [RNF11](requisitos.md#rnf11) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. En Resultados, abrir la subpestaña UEQ-S.
2. Elegir la versión.
3. Comparar la tabla con data/fixtures-ueq-s/do-ueq-basico/esperado.json.
4. Descargar Hoja oficial del UEQ-S (XLSX).

Resultado esperado: La pestaña explica de dónde vienen los números; la tabla coincide con la hoja del UEQ-S; la hoja descargada tiene los 8 ítems de cada participante en el orden y con los lados del UEQ-S; la pestaña no repite las respuestas en bruto y ofrece los resultados del UEQ-S en CSV; axe sin violaciones.

### CT-E100

**La página de inicio compara el UEQ y el UEQ-S.**

| Campo | Valor |
|---|---|
| Escenario | [CN16 · UEQ-S](#cn16) |
| Prueba | `tests/e2e/ueq-s.spec.ts` › "a página inicial compara o UEQ e o UEQ-S" |
| Precondiciones | Sin iniciar sesión. |
| Requisitos | [RF62](requisitos.md#rf62) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Abrir /#ueq-e-ueq-s.

Resultado esperado: La sección UEQ o UEQ-S tiene la tabla de las diferencias (8 pares tomados de los 26, de 1 a 2 minutos) y los 8 pares, cada uno leído como Ítem n: de … a …; axe sin violaciones.

### CT-E101

**AA en las pantallas del UEQ-S: reflow en 320 px, teclado, alto contraste y el estado bloqueado.**

| Campo | Valor |
|---|---|
| Escenario | [CN16 · UEQ-S](#cn16) |
| Prueba | `tests/e2e/ueq-s.spec.ts` › "AA: em 320 px nada rola na horizontal, e a escolha do questionário funciona só com o teclado" |
| Precondiciones | Investigador con un estudio del UEQ-S. |
| Requisitos | [RF62](requisitos.md#rf62), [RNF01](requisitos.md#rnf01), [RNF02](requisitos.md#rnf02), [RNF03](requisitos.md#rnf03) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. En Crear estudio, enfocar UEQ completo y pulsar la flecha hacia abajo.
2. Reducir la pantalla a 320 px y activar el alto contraste.
3. Grabar respuestas y abrir la pestaña UEQ-S, en los modos Una versión y Comparar versiones.
4. Abrir Editar estudio.
5. Abrir la página de inicio en #ueq-e-ueq-s.

Resultado esperado: La flecha marca UEQ-S, versión corta con el foco visible en la tarjeta. En 320 px ninguna de estas pantallas se desplaza en horizontal (WCAG 1.4.10), y axe no encuentra ninguna violación de WCAG 2.2 A y AA en ninguna, incluso con alto contraste. En la edición, los dos botones de opción quedan desactivados.

### CT-E102

**En croata, el cuestionario del UEQ-S usa los pares de la lista oficial del UEQ-S, no los del UEQ completo.**

| Campo | Valor |
|---|---|
| Escenario | [CN16 · UEQ-S](#cn16) |
| Prueba | `tests/e2e/ueq-s.spec.ts` › "em croata, o questionário do UEQ-S mostra os pares da lista oficial do UEQ-S" |
| Precondiciones | Estudio del UEQ-S abierto, con el idioma croata (hr). |
| Requisitos | [RF62](requisitos.md#rf62), [RF34](requisitos.md#rf34), [RNF01](requisitos.md#rnf01) |
| Resultado el 18/11/2026 | Aprobado (móvil y escritorio) |

Pasos:

1. Abrir el enlace del participante.
2. Indicar que tiene 18 años o más y aceptar el formulario.
3. Leer los ítems 7 y 8 del cuestionario.

Resultado esperado: El ítem 7 dice konvencionalna y inventivna y el ítem 8 termina en predvodnička, como en la lista oficial de los ítems del UEQ-S (en los mismos pares, el UEQ completo dice neoriginalan/originalan y uobičajen/nov); axe no encuentra ninguna violación de WCAG 2.2 A y AA.

## Casos de unidad

Cada caso reúne las pruebas de unidad de una misma regla. La columna Ejecuciones cuenta las pruebas reales: un caso parametrizado se ejecuta una vez por idioma o por par de colores.

### CN08 · Cálculo UEQ

| ID | Archivo | Función o grupo | Resultado esperado | Ejecuciones | Requisitos | Resultado el 18/11/2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u01"></a>CT-U01 | `recodificar.test.ts` | `recodificar` | Con el positivo a la derecha, 1 pasa a -3, 4 pasa a 0 y 7 pasa a 3 | 1 | [RF36](requisitos.md#rf36), [RNF25](requisitos.md#rnf25) | Aprobado |
| <a id="ct-u02"></a>CT-U02 | `recodificar.test.ts` | `recodificar` | Con el positivo a la izquierda, 1 pasa a 3, 4 pasa a 0 y 7 pasa a -3 | 1 | [RF36](requisitos.md#rf36), [RNF25](requisitos.md#rnf25) | Aprobado |
| <a id="ct-u03"></a>CT-U03 | `recodificar.test.ts` | `recodificar` | Rechaza 0, 8, 3,5 y NaN, que no existen en la escala de 1 a 7 | 6 | [RF36](requisitos.md#rf36) | Aprobado (6 de 6) |
| <a id="ct-u04"></a>CT-U04 | `recodificar.test.ts` | `recodificarParticipante` | Transforma el punto medio en 0 en los 26 ítems | 1 | [RF36](requisitos.md#rf36) | Aprobado |
| <a id="ct-u05"></a>CT-U05 | `recodificar.test.ts` | `recodificarParticipante` | Aplica la polaridad de cada ítem: 7 en todo da +3 en los ítems '+' y -3 en los ítems '-' | 1 | [RF36](requisitos.md#rf36) | Aprobado |
| <a id="ct-u06"></a>CT-U06 | `recodificar.test.ts` | `recodificarParticipante` | Rechaza un participante sin las 26 respuestas | 1 | [RF36](requisitos.md#rf36) | Aprobado |
| <a id="ct-u07"></a>CT-U07 | `estatistica.test.ts` | `media` | Devuelve null sin valores y calcula la media simple | 2 | [RF37](requisitos.md#rf37), [RNF25](requisitos.md#rnf25) | Aprobado (2 de 2) |
| <a id="ct-u08"></a>CT-U08 | `estatistica.test.ts` | `desvioPadraoAmostral` | Null con n = 0 y n = 1, divisor n - 1 y cero cuando todos son iguales | 3 | [RF37](requisitos.md#rf37) | Aprobado (3 de 3) |
| <a id="ct-u09"></a>CT-U09 | `estatistica.test.ts` | `intervaloConfianca95` | Media ± z · de / √n; null sin de (n = 1) y con de = 0, como el #NUM! de la hoja | 3 | [RF37](requisitos.md#rf37) | Aprobado (3 de 3) |
| <a id="ct-u10"></a>CT-U10 | `estatistica.test.ts` | `correlacao` | Correlación de Pearson; null sin variación o con menos de 2 pares; rechaza series de tamaños diferentes | 4 | [RF37](requisitos.md#rf37) | Aprobado (4 de 4) |
| <a id="ct-u11"></a>CT-U11 | `estatistica.test.ts` | `alfaCronbach` | Alfa estandarizado k · r̄ / (1 + (k - 1) · r̄); 1 cuando los ítems van juntos; null con menos de 2 ítems, ítem sin variación (#DIV/0!), denominador cero o un participante | 6 | [RF37](requisitos.md#rf37) | Aprobado (6 de 6) |
| <a id="ct-u12"></a>CT-U12 | `escalas.test.ts` | `escoresPorParticipante` | +3 en todas las escalas para quien marca siempre el polo positivo; media solo de los ítems de la escala | 2 | [RF37](requisitos.md#rf37), [RNF25](requisitos.md#rnf25) | Aprobado (2 de 2) |
| <a id="ct-u13"></a>CT-U13 | `escalas.test.ts` | `faixaInterpretacao` | -0,8 y 0,8 son neutros; por encima de 0,8 positiva, por debajo de -0,8 negativa | 2 | [RF38](requisitos.md#rf38) | Aprobado (2 de 2) |
| <a id="ct-u14"></a>CT-U14 | `escalas.test.ts` | `resultadoPorEscala` | Bordes n = 0, n = 1 y todos iguales, y media, de, IC y alfa con dos participantes | 4 | [RF37](requisitos.md#rf37), [RNF25](requisitos.md#rnf25) | Aprobado (4 de 4) |
| <a id="ct-u15"></a>CT-U15 | `escalas.test.ts` | `resultadoPorItem` | Los 26 ítems en orden con media recodificada y distribución de 1 a 7 | 1 | [RF41](requisitos.md#rf41) | Aprobado |
| <a id="ct-u16"></a>CT-U16 | `benchmark.test.ts` | `classificarBenchmark` | Una media en cada una de las 5 franjas: excelente, bueno, por encima de la media, por debajo de la media y malo | 8 | [RF40](requisitos.md#rf40) | Aprobado (8 de 8) |
| <a id="ct-u17"></a>CT-U17 | `benchmark.test.ts` | `classificarBenchmark` | Una media igual al límite queda en la franja inferior; usa los límites de la escala solicitada; null sin media | 8 | [RF40](requisitos.md#rf40) | Aprobado (8 de 8) |
| <a id="ct-u18"></a>CT-U18 | `analisar-estudo.test.ts` | `analisarEstudo` | Estadísticas solo con las participaciones incluidas en el análisis | 1 | [RF42](requisitos.md#rf42) | Aprobado |
| <a id="ct-u20"></a>CT-U20 | `analisar-estudo.test.ts` | `analisarEstudo` | Clasifica en el benchmark y calcula la pragmática y la hedónica por la media de las escalas | 1 | [RF39](requisitos.md#rf39), [RF40](requisitos.md#rf40) | Aprobado |
| <a id="ct-u21"></a>CT-U21 | `analisar-estudo.test.ts` | `analisarEstudo` | Señala un alfa por debajo del mínimo del protocolo | 1 | [RF37](requisitos.md#rf37), [RF45](requisitos.md#rf45) | Aprobado |
| <a id="ct-u22"></a>CT-U22 | `analisar-estudo.test.ts` | `analisarEstudo` | Sin nadie en el análisis devuelve números null, sin fallar | 1 | [RF42](requisitos.md#rf42), [RNF25](requisitos.md#rnf25) | Aprobado |

### CN09 · Respuestas sospechosas

| ID | Archivo | Función o grupo | Resultado esperado | Ejecuciones | Requisitos | Resultado el 18/11/2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u19"></a>CT-U19 | `analisar-estudo.test.ts` | `analisarEstudo` | Evalúa la sospecha de todas las participaciones, incluidas las excluidas | 1 | [RF42](requisitos.md#rf42), [RF51](requisitos.md#rf51) | Aprobado |
| <a id="ct-u23"></a>CT-U23 | `inconsistencia.test.ts` | `amplitudePorEscala` | Cero para respuestas consistentes; reproduce el ejemplo de perspicuidad del handbook (distancia 5) | 2 | [RF51](requisitos.md#rf51) | Aprobado (2 de 2) |
| <a id="ct-u24"></a>CT-U24 | `inconsistencia.test.ts` | `respostasIguais` | Cuenta la posición más repetida | 1 | [RF51](requisitos.md#rf51) | Aprobado |
| <a id="ct-u25"></a>CT-U25 | `inconsistencia.test.ts` | `marcarSuspeitos` | Sospechoso con 3 escalas inconsistentes, no con 2; una amplitud igual a 3 no es inconsistencia | 7 | [RF51](requisitos.md#rf51) | Aprobado (7 de 7) |
| <a id="ct-u26"></a>CT-U26 | `inconsistencia.test.ts` | `marcarSuspeitos` | Sospechoso con más de 15 respuestas iguales, no con exactamente 15 | 7 | [RF51](requisitos.md#rf51) | Aprobado (7 de 7) |
| <a id="ct-u27"></a>CT-U27 | `inconsistencia.test.ts` | `marcarSuspeitos` | Indica los dos motivos cuando se cumplen las dos reglas; lee los umbrales de la configuración | 7 | [RF51](requisitos.md#rf51) | Aprobado (7 de 7) |
| <a id="ct-u28"></a>CT-U28 | `fixtures.test.ts` | `fixtures conforme os LEIA-ME` | basico sin sospechosos; inconsistente marca exactamente las filas 1, 6, 9 y 13; todos-1 y todos-7 caen en la regla de las respuestas iguales | 3 | [RF51](requisitos.md#rf51) | Aprobado (3 de 3) |

### CN15 · Validación con la hoja oficial

| ID | Archivo | Función o grupo | Resultado esperado | Ejecuciones | Requisitos | Resultado el 18/11/2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u29"></a>CT-U29 | `fixtures.test.ts` | `fixture … contra a planilha oficial` | Para cada uno de los 11 escenarios de data/fixtures: media, de, n e IC95 de escalas e ítems, alfa, benchmark, pragmática, hedónica, distribución de las respuestas, escalas inconsistentes y respuestas iguales por participante iguales a los de la hoja, con una tolerancia de 1e-6; un error de la hoja es null | 77 | [RNF11](requisitos.md#rnf11) | Aprobado (77 de 77) |
| <a id="ct-u70"></a>CT-U70 | `planilha-oficial.test.ts` | `preencherPlanilhaOficial` | Pone las respuestas en Data!A4 y quita los 255 participantes de ejemplo; mantiene las filas 1 a 3; pone el idioma en Read_First!B5, con un nombre de la pestaña Items para cada uno de los 37 idiomas; borra los resultados grabados y pide recálculo al abrir; no toca gráficos, estilos ni las demás partes; sin participantes sale vacía; rechaza más de 1000 participantes y valores fuera de 1 a 7 | 8 | [RF59](requisitos.md#rf59) | Aprobado (8 de 8) |

### CN05 · Participación en el estudio

| ID | Archivo | Función o grupo | Resultado esperado | Ejecuciones | Requisitos | Resultado el 18/11/2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u30"></a>CT-U30 | `balanceamento.test.ts` | `versaoComMenosRespostas` | Elige la versión con menos respuestas completadas; en caso de empate, la de menor orden; con una versión, esa; sin versiones, null | 4 | [RF26](requisitos.md#rf26) | Aprobado (4 de 4) |

### CN11 · Exportación en CSV

| ID | Archivo | Función o grupo | Resultado esperado | Ejecuciones | Requisitos | Resultado el 18/11/2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u31"></a>CT-U31 | `csv.test.ts` | `campoCsv` | El texto simple queda como está; el punto y coma y el salto de línea van entre comillas; las comillas internas se duplican; lo ausente queda vacío | 5 | [RF56](requisitos.md#rf56) | Aprobado (5 de 5) |
| <a id="ct-u32"></a>CT-U32 | `csv.test.ts` | `documentoCsv` | Empieza con BOM, usa ; y termina cada fila con CRLF; sale sin BOM cuando se pide | 2 | [RF56](requisitos.md#rf56), [RF57](requisitos.md#rf57), [RF58](requisitos.md#rf58) | Aprobado (2 de 2) |
| <a id="ct-u33"></a>CT-U33 | `csv.test.ts` | `decimalCsv e slugDoTitulo` | Coma decimal y vacío para lo ausente; nombre de archivo sin tildes, espacios ni símbolos, y nunca vacío | 3 | [RF58](requisitos.md#rf58), [RNF22](requisitos.md#rnf22) | Aprobado (3 de 3) |
| <a id="ct-u34"></a>CT-U34 | `exportacoes.test.ts` | `linhasDaPlanilhaOficial` | De la fixture basico salen las mismas filas del respostas.csv original; deja fuera a quien está fuera del análisis | 2 | [RF59](requisitos.md#rf59) | Aprobado (2 de 2) |
| <a id="ct-u35"></a>CT-U35 | `exportacoes.test.ts` | `exportarBrutas` | BOM, cabecera y 26 columnas de ítems; versión y datos demográficos protegidos contra ;, comillas y saltos de línea | 2 | [RF56](requisitos.md#rf56) | Aprobado (2 de 2) |
| <a id="ct-u37"></a>CT-U37 | `exportacoes.test.ts` | `exportarRecodificadas` | Cambia 1 a 7 por -3 a +3 con la polaridad corregida | 1 | [RF57](requisitos.md#rf57) | Aprobado |
| <a id="ct-u38"></a>CT-U38 | `exportacoes.test.ts` | `exportarResultados` | Una fila por escala, con coma decimal | 1 | [RF58](requisitos.md#rf58) | Aprobado |

### CN07 · Idiomas

| ID | Archivo | Función o grupo | Resultado esperado | Ejecuciones | Requisitos | Resultado el 18/11/2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u36"></a>CT-U36 | `exportacoes.test.ts` | `idioma nas exportações` | Indica en qué idioma respondió la persona y si la traducción está aprobada; una respuesta importada sale con el origen y sin idioma | 2 | [RF52](requisitos.md#rf52), [RF61](requisitos.md#rf61) | Aprobado (2 de 2) |
| <a id="ct-u45"></a>CT-U45 | `idiomas.test.ts` | `os 37 idiomas do pacote oficial` | Los 37 idiomas están completos y cada uno tiene los 26 pares en orden, rellenados y con términos diferentes | 41 | [RF34](requisitos.md#rf34), [RNF10](requisitos.md#rnf10) | Aprobado (41 de 41) |
| <a id="ct-u46"></a>CT-U46 | `idiomas.test.ts` | `os 37 idiomas do pacote oficial` | El portugués es exactamente el de data/ueq-itens-ptbr.json, que alimenta la base de datos | 1 | [RNF10](requisitos.md#rnf10) | Aprobado |
| <a id="ct-u47"></a>CT-U47 | `idiomas.test.ts` | `os 37 idiomas do pacote oficial` | Marca los 9 idiomas sin traducción aprobada y los 3 de derecha a izquierda; toda corrección guarda el par original y el motivo | 41 | [RF34](requisitos.md#rf34), [RNF10](requisitos.md#rnf10) | Aprobado (41 de 41) |
| <a id="ct-u48"></a>CT-U48 | `idiomas.test.ts` | `textos das telas` | En cada idioma, ningún texto vacío, los mismos {marcadores} que el portugués y el nombre accesible de cada círculo con posición y polo | 38 | [RF34](requisitos.md#rf34), [RNF04](requisitos.md#rnf04) | Aprobado (38 de 38) |
| <a id="ct-u49"></a>CT-U49 | `idiomas.test.ts` | `plural e lista` | Plural en la forma del idioma (con recurso a other) y listas unidas como las une el idioma | 2 | [RF34](requisitos.md#rf34) | Aprobado (2 de 2) |
| <a id="ct-u50"></a>CT-U50 | `idiomas.test.ts` | `negociarIdioma` | Elige el primero de los 37 según la preferencia del navegador, acepta códigos antiguos, recurre al portugués y da el lang de cada idioma | 3 | [RF34](requisitos.md#rf34) | Aprobado (3 de 3) |

### CN13 · Importación por CSV

| ID | Archivo | Función o grupo | Resultado esperado | Ejecuciones | Requisitos | Resultado el 18/11/2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u39"></a>CT-U39 | `importacao.test.ts` | `lerCsvDeRespostas` | Lee la fixture basico como el módulo UEQ | 5 | [RF61](requisitos.md#rf61) | Aprobado (5 de 5) |
| <a id="ct-u40"></a>CT-U40 | `importacao.test.ts` | `lerCsvDeRespostas` | Acepta coma, tabulación, BOM, comillas y separador sobrante; ignora las filas en blanco manteniendo el número real de cada fila | 6 | [RF61](requisitos.md#rf61) | Aprobado (6 de 6) |
| <a id="ct-u41"></a>CT-U41 | `importacao.test.ts` | `lerCsvDeRespostas` | Indica por fila el número incorrecto de valores y los valores fuera de la escala; rechaza un archivo con demasiadas filas | 6 | [RF61](requisitos.md#rf61) | Aprobado (6 de 6) |

### CN10 · Panel de resultados

| ID | Archivo | Función o grupo | Resultado esperado | Ejecuciones | Requisitos | Resultado el 18/11/2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u42"></a>CT-U42 | `leitura-rapida.test.ts` | `leituraDeUmaVersao` | Reproduce la frase del prototipo r6; une escalas de la misma franja y cita las negativas; null sin media | 3 | [RF44](requisitos.md#rf44) | Aprobado (3 de 3) |
| <a id="ct-u43"></a>CT-U43 | `leitura-rapida.test.ts` | `leituraDaComparacao` | Indica las dos mayores diferencias y a quién favorecen; dice cuándo las versiones quedan próximas; con tres versiones cuenta las escalas en las que lidera cada una | 3 | [RF47](requisitos.md#rf47) | Aprobado (3 de 3) |
| <a id="ct-u44"></a>CT-U44 | `leitura-rapida.test.ts` | `formatarDecimal` | Coma, dos decimales y guion para lo ausente | 1 | [RNF22](requisitos.md#rnf22) | Aprobado |

### CN14 · Colores y contraste

| ID | Archivo | Función o grupo | Resultado esperado | Ejecuciones | Requisitos | Resultado el 18/11/2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u51"></a>CT-U51 | `contraste.test.ts` | `contraste dos tokens de cor` | Cada par de texto del tema alcanza 4,5:1 | 57 | [RNF06](requisitos.md#rnf06) | Aprobado (57 de 57) |
| <a id="ct-u52"></a>CT-U52 | `contraste.test.ts` | `contraste dos tokens de cor` | Cada borde de campo, foco y marcador de gráfico alcanza 3:1 frente a los fondos y las franjas del benchmark | 57 | [RNF06](requisitos.md#rnf06), [RNF07](requisitos.md#rnf07) | Aprobado (57 de 57) |

### CN16 · UEQ-S

| ID | Archivo | Función o grupo | Resultado esperado | Ejecuciones | Requisitos | Resultado el 18/11/2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u53"></a>CT-U53 | `ueq-s.test.ts` | `UEQ-S` | Los 8 ítems del UEQ-S apuntan a pares del UEQ con la escala y la polaridad correctas, en orden; los límites del benchmark están en orden | 3 | [RF62](requisitos.md#rf62) | Aprobado (3 de 3) |
| <a id="ct-u71"></a>CT-U71 | `fixtures-ueq-s.test.ts` | `UEQ-S: fixture … contra a planilha oficial do UEQ-S` | Para cada uno de los 9 escenarios de data/fixtures-ueq-s: media, de, n e IC95 de la pragmática, la hedónica, la general y los 8 ítems, alfa, benchmark, las tres puntuaciones de cada participante, escalas inconsistentes, respuestas iguales y la categoría del medio iguales a los de la hoja del UEQ-S, con una tolerancia de 1e-6; un error de la hoja es null | 54 | [RF62](requisitos.md#rf62), [RNF11](requisitos.md#rnf11) | Aprobado (54 de 54) |
| <a id="ct-u72"></a>CT-U72 | `fixtures-ueq-s.test.ts` | `UEQ-S: itens montados` e `fixture bordas` | Los 8 ítems son los pares 11, 13, 20, 21, 6, 7, 10 y 15 del UEQ, con los lados invertidos solo en los ítems 4 y 7; la ida y vuelta entre el UEQ-S y los ítems del UEQ no cambia ninguna respuesta; en el escenario bordas solo las filas 3, 4 y 7 son sospechosas | 3 | [RF62](requisitos.md#rf62) | Aprobado (3 de 3) |
| <a id="ct-u73"></a>CT-U73 | `planilha-oficial-ueq-s.test.ts` | `preencherPlanilhaOficial com o modelo do UEQ-S` | Pone las 8 respuestas en Data!A4 y quita los 13 de ejemplo; idioma en Read_First!B4, con un nombre de la pestaña Items para cada uno de los 37 idiomas; borra los resultados grabados y pide recálculo al abrir; rechaza un participante sin los 8 valores | 6 | [RF62](requisitos.md#rf62) | Aprobado (6 de 6) |
| <a id="ct-u74"></a>CT-U74 | `exportacoes.test.ts` | `exportações do UEQ-S` | Respuestas en bruto con item01 a item08; recodificadas con x − 4; resultados con pragmática, hedónica y general (sin alfa en la general), iguales a la hoja; desde un estudio del UEQ completo, la hoja del UEQ-S recibe los 8 ítems equivalentes | 4 | [RF62](requisitos.md#rf62) | Aprobado (4 de 4) |
| <a id="ct-u75"></a>CT-U75 | `importacao.test.ts` | `lerCsvDeRespostas` | En un estudio del UEQ-S, lee 8 valores por fila y rechaza las filas con 26 | 1 | [RF61](requisitos.md#rf61), [RF62](requisitos.md#rf62) | Aprobado (1 de 1) |
| <a id="ct-u76"></a>CT-U76 | `termo.test.ts` | `condicoesDoTermo` | En el UEQ-S, el formulario dice 1 a 2 minutos (2 a 3 con datos opcionales) y, en los 37 idiomas, 8 pares donde el del UEQ dice 26 | 38 | [RF25](requisitos.md#rf25), [RF62](requisitos.md#rf62) | Aprobado (38 de 38) |
| <a id="ct-u77"></a>CT-U77 | `termos-ueq-s.test.ts` | `termos do UEQ-S em cada idioma` | Los 37 idiomas tienen los 8 pares, todos diferentes; el portugués es el de data/ueq-s-itens-ptbr.json y el inglés es el del handbook; los que no están marcados como diferentes repiten el par del UEQ completo, con los lados invertidos en los ítems 4 y 7; los diferentes son exactamente italiano, croata, griego, turco, persa y chino, con el ítem 7 en croata konvencionalna/inventivna | 4 | [RF62](requisitos.md#rf62), [RF34](requisitos.md#rf34) | Aprobado (4 de 4) |

### CN18 · Documentación en la herramienta

| ID | Archivo | Función o grupo | Resultado esperado | Ejecuciones | Requisitos | Resultado el 18/11/2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u54"></a>CT-U54 | `documentacao.test.ts` | `catálogo da documentação` | Todo documento y descarga del catálogo existe; cada documento tiene una sola dirección; todo .md de docs/documentacao está en el catálogo; una dirección fuera del catálogo no se convierte en documento | 3 | [RF63](requisitos.md#rf63), [RF65](requisitos.md#rf65) | Aprobado (3 de 3) |
| <a id="ct-u55"></a>CT-U55 | `documentacao.test.ts` | `diagramas` | Cada diagrama Mermaid de los documentos tiene el SVG generado y el archivo fuente igual al del documento, y no sobra ningún SVG sin uso | 3 | [RF63](requisitos.md#rf63), [RF64](requisitos.md#rf64) | Aprobado (3 de 3) |
| <a id="ct-u56"></a>CT-U56 | `documentacao.test.ts` | `destinoDoLink` | Un enlace a otro documento se abre en la pestaña Documentación con el ancla; un archivo para descargar sale por la ruta de descarga; el resto del repositorio se abre en GitHub; ningún enlace relativo de los documentos apunta a un archivo que no existe | 4 | [RF65](requisitos.md#rf65) | Aprobado (4 de 4) |
| <a id="ct-u57"></a>CT-U57 | `documentacao.test.ts` | `renderizarMarkdown` | Título separado, anclas iguales a las de GitHub (incluso repetidas), tabla en una región desplazable con nombre, enlaces reescritos y diagrama como botón de ampliar con imagen con texto alternativo y el código a la vista | 3 | [RF63](requisitos.md#rf63) | Aprobado (3 de 3) |
| <a id="ct-u64"></a>CT-U64 | `documentacao.test.ts` | `dividirDocumento` | Separa la apertura de las secciones sin confundir código con título; usa direcciones sin tildes; divide solo la sección con 3 subsecciones o más; encuentra la página de cada ancla, incluso de una fila de tabla; resume por el primer párrafo; un documento corto queda entero | 5 | [RF63](requisitos.md#rf63) | Aprobado (5 de 5) |
| <a id="ct-u65"></a>CT-U65 | `documentacao.test.ts` | `rota das âncoras em documentos divididos` | Lleva a la página del ancla, con fragmento solo en medio de la página; reescribe los enlaces de la sección; toda página de todo documento publicado tiene título y no repite el h1 | 3 | [RF65](requisitos.md#rf65) | Aprobado (3 de 3) |

### CN10 · Panel de resultados: perfil de los participantes

| ID | Archivo | Función o grupo | Resultado esperado | Ejecuciones | Requisitos | Resultado el 18/11/2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u60"></a>CT-U60 | `perfil-demografico.test.ts` | `perfilDemografico` | Cuenta cada opción, a quien prefirió no responder y a quien omitió; una escala ordenada queda en el orden de la escala; el género va de mayor a menor; sin participaciones, las proporciones quedan en cero | 4 | [RF50](requisitos.md#rf50) | Aprobado (4 de 4) |

### CN21 · Equipo y notificaciones

| ID | Archivo | Función o grupo | Resultado esperado | Ejecuciones | Requisitos | Resultado el 18/11/2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u59"></a>CT-U59 | `modelo-email.test.ts` | `modelo dos e-mails` | Monta el HTML con el idioma, el botón, el enlace de reserva y el pie; escapa lo que viene del investigador; se invierte de derecha a izquierda en árabe, hebreo y persa; tiene el mismo mensaje en texto plano | 4 | [RF23](requisitos.md#rf23) | Aprobado (4 de 4) |

### CN23 · Protección de datos

| ID | Archivo | Función o grupo | Resultado esperado | Ejecuciones | Requisitos | Resultado el 18/11/2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u58"></a>CT-U58 | `cripto.test.ts` | `criptografia de campo` | Cifra y descifra con un IV nuevo cada vez; un texto alterado u otra clave no descifran; un Json cifrado vuelve igual y el formato antiguo sigue siendo legible; una clave de tamaño incorrecto se rechaza; sin clave, guarda el valor tal como llegó | 6 | [RNF14](requisitos.md#rnf14) | Aprobado (6 de 6) |
| <a id="ct-u69"></a>CT-U69 | `termo.test.ts` | `condicoesDoTermo` e `lerIdade` | Enumera las líneas del formulario en el orden de la pantalla; con datos opcionales, avisa y aumenta el tiempo; con comité de ética, muestra el comité; en todos los idiomas, cita el botón de salir con el nombre que tiene; la edad solo avanza para mayores de edad o para menores con la autorización | 40 | [RF25](requisitos.md#rf25) | Aprobado (40 de 40) |

### CN24 · Idioma de la herramienta

| ID | Archivo | Función o grupo | Resultado esperado | Ejecuciones | Requisitos | Resultado el 18/11/2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u62"></a>CT-U62 | `catalogo.test.ts` | `catálogo da interface` | El catálogo está al día con los t() y m() del código, solo tiene texto de pantalla, cada texto sabe de qué archivo viene, y ninguno está vacío | 4 | [RF08](requisitos.md#rf08) | Aprobado (4 de 4) |
| <a id="ct-u63"></a>CT-U63 | `catalogo.test.ts` | `tradutor` | Devuelve el original sin traducción e interpola los marcadores; la clave cambia con el idioma de origen, salvo en portugués; los marcadores desconocidos quedan como están | 3 | [RF08](requisitos.md#rf08), [RF35](requisitos.md#rf35) | Aprobado (3 de 3) |
| <a id="ct-u66"></a>CT-U66 | `catalogo.test.ts` | `mesmosMarcadores` | Acepta los marcadores en otro orden y rechaza un marcador traducido, desaparecido o de más | 1 | [RF08](requisitos.md#rf08) | Aprobado (1 de 1) |
| <a id="ct-u67"></a>CT-U67 | `claude.test.ts` | `traduzirLote` | Se queda con la corrección de la revisión y envía la pantalla de cada texto; si la revisión falla, se queda la primera traducción; una traducción con marcadores diferentes se rechaza; los fragmentos de frase mantienen los espacios de los extremos; sin respuesta de la API, el lote queda sin traducción; el nombre de la herramienta viaja como marcador y sale igual; los términos del idioma y los rótulos citados van a la traducción y a la revisión; un fragmento de frase no recibe punto final | 9 | [RF08](requisitos.md#rf08) | Aprobado (9 de 9) |
| <a id="ct-u68"></a>CT-U68 | `rodadas.test.ts` | `rodadas da tradução` | Un rótulo es un texto corto sin puntuación de frase; encuentra los botones citados en un texto, con la traducción ya elegida; prefiere el rótulo más largo y no confunde un fragmento de palabra, una minúscula ni un marcador; los botones citados en la ayuda existen como rótulos | 4 | [RF08](requisitos.md#rf08) | Aprobado (4 de 4) |
| <a id="ct-u78"></a>CT-U78 | `nome-da-ferramenta.test.ts` | `nome da ferramenta em cada idioma` | Tiene un nombre para cada uno de los 37 idiomas, todos con la sigla UEQ; cambia el nombre en las frases traducidas y en el propio nombre, y deja el portugués como está; una frase sin traducción sigue entera en portugués, sin mezclar el nombre de otro idioma | 3 | [RF08](requisitos.md#rf08) | Aprobado (3 de 3) |

### CN25 · Escenarios de demostración

| ID | Archivo | Función o grupo | Resultado esperado | Ejecuciones | Requisitos | Resultado el 18/11/2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u61"></a>CT-U61 | `respostas-sinteticas.test.ts` | `respostas sintéticas dos cenários de demonstração` | Da 26 valores de 1 a 7; quien respondió con atención nunca sale sospechoso, y las respuestas aleatorias e iguales siempre salen; la media de cada escala queda cerca del perfil; la misma semilla genera las mismas respuestas | 4 | [RF67](requisitos.md#rf67) | Aprobado (4 de 4) |

## Casos manuales

Realizados por personas, sin automatización. Los de CN17 siguen la [lista de verificación manual](../checklist-manual.md) y el [guion de la revisión](../roteiro-revisao.md).

| ID | Escenario | Grupo | Verificación | Requisitos | Situación |
|---|---|---|---|---|---|
| <a id="ct-m01"></a>CT-M01 | CN17 | Lector de pantalla | Cuestionario completo de principio a fin solo escuchando (NVDA + Firefox; VoiceOver + Safari o TalkBack + Chrome) | [RNF04](requisitos.md#rnf04) | No ejecutado |
| <a id="ct-m02"></a>CT-M02 | CN17 | Lector de pantalla | Al entrar en un ítem, el lector anuncia el número, los dos términos y la posición | [RF27](requisitos.md#rf27), [RNF04](requisitos.md#rnf04) | No ejecutado |
| <a id="ct-m03"></a>CT-M03 | CN17 | Lector de pantalla | El progreso se anuncia sin interrumpir en cada clic | [RF28](requisitos.md#rf28), [RNF04](requisitos.md#rnf04) | No ejecutado |
| <a id="ct-m04"></a>CT-M04 | CN17 | Lector de pantalla | Al enviar incompleto, el lector anuncia el resumen y se puede ir al ítem que falta | [RF29](requisitos.md#rf29), [RNF04](requisitos.md#rnf04) | No ejecutado |
| <a id="ct-m05"></a>CT-M05 | CN17 | Lector de pantalla | En el panel, el gráfico se anuncia con la descripción y la tabla se puede recorrer por celda con la cabecera leída | [RNF04](requisitos.md#rnf04), [RNF08](requisitos.md#rnf08) | No ejecutado |
| <a id="ct-m06"></a>CT-M06 | CN17 | Lector de pantalla | Los mensajes de éxito ("Recogida abierta") se anuncian | [RNF04](requisitos.md#rnf04), [RNF20](requisitos.md#rnf20) | No ejecutado |
| <a id="ct-m07"></a>CT-M07 | CN17 | Teclado | Crear un estudio, abrir la recogida, responder, ver resultados y exportar sin ratón; foco siempre visible y en orden lógico | [RNF03](requisitos.md#rnf03) | No ejecutado |
| <a id="ct-m08"></a>CT-M08 | CN17 | Visión | Zoom del 200% y del 400%: nada se corta, nada se superpone | [RNF02](requisitos.md#rnf02) | No ejecutado |
| <a id="ct-m09"></a>CT-M09 | CN17 | Visión | Daltonismo simulado en DevTools (protanopía, deuteranopía, tritanopía, acromatopsia): el gráfico sigue siendo legible | [RNF07](requisitos.md#rnf07) | No ejecutado |
| <a id="ct-m10"></a>CT-M10 | CN17 | Visión | Alto contraste de Windows: círculos del cuestionario y foco visibles | [RNF06](requisitos.md#rnf06), [RNF07](requisitos.md#rnf07) | No ejecutado |
| <a id="ct-m11"></a>CT-M11 | CN17 | Visión | El espaciado de texto aumentado (WCAG 1.4.12) no rompe el diseño | [RNF01](requisitos.md#rnf01) | No ejecutado |
| <a id="ct-m12"></a>CT-M12 | CN17 | Móvil real | Abrir el enlace por WhatsApp y responder con el pulgar, sin toques accidentales en el círculo vecino; el teclado virtual no cubre el campo en los datos opcionales | [RNF05](requisitos.md#rnf05), [RNF23](requisitos.md#rnf23) | No ejecutado |
| <a id="ct-m13"></a>CT-M13 | CN17 | Evaluación heurística | Cada miembro evalúa por separado con las 10 heurísticas de Nielsen (pantalla, heurística, gravedad 0 a 4, sugerencia) y después el equipo consolida | [RNF01](requisitos.md#rnf01), [RNF20](requisitos.md#rnf20), [RNF21](requisitos.md#rnf21) | No ejecutado |
| <a id="ct-m14"></a>CT-M14 | CN17 | Prueba con usuarios | 5 participantes responden un estudio real; 2 a 3 investigadores crean un estudio con 2 versiones, abren la recogida, interpretan el panel, retiran una sospecha y exportan; registrar éxito, tiempo, errores y el UEQ de la propia herramienta | [RF13](requisitos.md#rf13), [RF24](requisitos.md#rf24), [RF43](requisitos.md#rf43) | No ejecutado |
| <a id="ct-m15"></a>CT-M15 | CN15 | Hoja oficial | Pegar cada data/fixtures/**/respostas.csv en la UEQ Data Analysis Tool V15, recalcular y copiar los resultados a esperado.json; abrir en Excel la hoja exportada por la herramienta y comprobar que recalcula con los mismos números (data/fixtures/LEIA-ME.md) | [RNF11](requisitos.md#rnf11) | Ejecutado el 17/11/2026 con scripts/planilha-oficial.ps1 en Excel 16: 11 escenarios, 6.543 valores iguales |
| <a id="ct-m16"></a>CT-M16 | CN09 | Script | Cambiar un umbral en data/protocolo.json, ejecutar pnpm suspeitas:recalcular y comprobar la columna suspeita | [RF55](requisitos.md#rf55) | No ejecutado |
| <a id="ct-m17"></a>CT-M17 | CN08 | Seed | Ejecutar pnpm db:seed con un ítem no válido en data/ueq-itens-ptbr.json y comprobar que el seed se detiene indicando qué ítem | [RF27](requisitos.md#rf27), [RNF10](requisitos.md#rnf10) | No ejecutado |
| <a id="ct-m18"></a>CT-M18 | CN17 | Revisión visual | Comparar cada pantalla con el PNG correspondiente en docs/prototipos/alta-fidelidade/, siguiendo docs/roteiro-revisao.md | [RNF01](requisitos.md#rnf01) | No ejecutado |
| <a id="ct-m19"></a>CT-M19 | CN17 | Instalación | En un clon limpio, seguir la sección Como rodar del README y llegar a la pantalla Entrar en http://localhost:3000 | [RNF24](requisitos.md#rnf24) | No ejecutado |
| <a id="ct-m20"></a>CT-M20 | CN17 | Lector de pantalla | Las ventanas (Entrar, Crear cuenta, Salir, eliminar, Compartir, ayuda) anuncian el título al abrirse, atrapan el foco y devuelven el foco a quien las abrió | [RNF04](requisitos.md#rnf04), [RNF21](requisitos.md#rnf21) | No ejecutado |
| <a id="ct-m21"></a>CT-M21 | CN17 | Lector de pantalla | El número de avisos de la campana se anuncia, y se puede aceptar una invitación solo escuchando | [RF22](requisitos.md#rf22), [RNF04](requisitos.md#rnf04) | No ejecutado |
| <a id="ct-m22"></a>CT-M22 | CN17 | Lector de pantalla | El recorrido guiado se entiende solo escuchando, y se puede omitir | [RF09](requisitos.md#rf09), [RNF04](requisitos.md#rnf04) | No ejecutado |
| <a id="ct-m23"></a>CT-M23 | CN17 | Lector de pantalla | En la política de privacidad, el "Volver" dice adónde va, y el enlace de las ventanas de acceso avisa de que se abre en una nueva pestaña. En Chrome, Firefox y Safari reales, "Cerrar esta pestaña y volver" cierra la pestaña y devuelve la ventana de registro con lo que se escribió | [RNF04](requisitos.md#rnf04), [RNF19](requisitos.md#rnf19) | No ejecutado |
| <a id="ct-m24"></a>CT-M24 | CN17 | Móvil real | Enlace del participante abierto en un estudio en otro idioma, y en un idioma de derecha a izquierda (árabe, hebreo o persa) | [RF34](requisitos.md#rf34) | No ejecutado |
| <a id="ct-m25"></a>CT-M25 | CN17 | Móvil real | Política de privacidad abierta desde el formulario de consentimiento, en el móvil, y el "Volver" lleva de vuelta al formulario | [RF25](requisitos.md#rf25), [RNF19](requisitos.md#rnf19) | No ejecutado |
| <a id="ct-m26"></a>CT-M26 | CN16 | Hoja oficial del UEQ-S | Pegar cada data/fixtures-ueq-s/*/respostas.csv en la UEQ-S Data Analysis Tool V15, recalcular y copiar los resultados a esperado.json; abrir en Excel la hoja del UEQ-S exportada por la herramienta y comprobar que recalcula con los mismos números (data/fixtures-ueq-s/LEIA-ME.md) | [RF62](requisitos.md#rf62), [RNF11](requisitos.md#rnf11) | Ejecutado el 17/11/2026 con scripts/planilha-oficial-ueq-s.ps1 en Excel 16: 9 escenarios, 8.520 valores iguales; los 9 archivos exportados se recalcularon solos con diferencia cero |

## Limitaciones

- **Benchmark del UEQ-S.** Los límites son los de la hoja oficial del UEQ-S, que todavía proceden del UEQ completo. Las pruebas demuestran que la herramienta usa los mismos números que la hoja, no que el benchmark represente bien la versión corta; el panel avisa de ello.
- **Casos manuales.** De los 26 casos manuales, 24 no se ejecutaron, incluida la prueba con usuarios prevista en [Fundamentos de IHC §6](../ihc.md#6-como-verificar-automação-não-basta).
- **Administración.** Las páginas de Administración (cuentas, idiomas, protección de datos y escenarios) todavía no tienen caso de extremo a extremo. Solo la generación de respuestas de los escenarios tiene prueba ([CT-U61](#ct-u61)).
- **Servicios externos.** La llamada a la API de Claude y el envío de correo electrónico no se ejercitan en las pruebas: [CT-E67](#ct-e67) graba la traducción directamente en la base de datos, y [CT-U59](#ct-u59) comprueba solo el contenido del correo electrónico.
- **Panel en PDF en producción.** Los casos [CT-E39](#ct-e39) y [CT-E40](#ct-e40) se ejecutan en el entorno local, con el Chromium de Playwright. El paquete usado en Vercel solo se ejercita en producción.
- **Hoja oficial fuera de Excel.** Las hojas exportadas (UEQ y UEQ-S) se comprobaron en Microsoft Excel 16 para Windows. LibreOffice, Hojas de cálculo de Google y Numbers no se probaron: la hoja pide recálculo al abrirse, pero cada programa decide si obedece.
- **Requisitos sin caso de prueba:** 5 de los 94 requisitos no tienen caso de prueba y se comprueban mediante el paso Cómo verificar de cada uno. La lista, con el motivo, está en la [matriz de trazabilidad](matriz-rastreabilidade.md#cobertura).
