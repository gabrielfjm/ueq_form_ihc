# Guion de la revisión

Para quien va a revisar la herramienta antes de la entrega. Indica qué abrir, qué hacer en cada pantalla, qué evaluar y cómo anotarlo.

## Qué es la herramienta

La herramienta aplica el User Experience Questionnaire (UEQ) y analiza las respuestas. Hay dos públicos:

- **Investigador:** crea un estudio con una o más versiones de un producto, comparte un enlace y sigue el panel de resultados.
- **Participante:** abre el enlace, sin cuenta, y responde los 26 pares de palabras en 3 a 5 minutos, en uno de los 37 idiomas del UEQ.

Los investigadores también trabajan en equipo, reciben avisos en una campana y pueden usar la herramienta en cualquiera de los 37 idiomas.

## Cómo abrirla

**En producción:** https://ferramenta-ueq.vercel.app. Cree su cuenta en "Crear cuenta". Sin el estudio de ejemplo, cree un estudio propio o use los escenarios de demostración de Administración, si su cuenta es de administrador.

**En su propio equipo:** en un ordenador con Docker, Node y pnpm, en la carpeta del repositorio:

```
docker compose up -d
pnpm install
cp .env.example .env
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Después, abra http://localhost:3000.

- **Cuenta de investigador lista:** `pesquisador@exemplo.com`, contraseña `senha-de-teste`. Ya tiene el "Estudo de exemplo" (Estudio de ejemplo), con 35 respuestas en 2 versiones, 4 de ellas sospechosas.
- **Enlace del participante de ese estudio:** http://localhost:3000/r/exemplo. Cada navegador responde una vez. Para responder de nuevo, use una ventana de incógnito.
- **Para ver otro idioma en el cuestionario:** cámbielo en el selector "Idioma" del consentimiento.
- **Para ver la herramienta en otro idioma:** el selector de idioma de la barra ("PT"), o Mi cuenta › Idioma. Sin `ANTHROPIC_API_KEY`, la interfaz sigue en portugués.

## Las pantallas, en el orden de uso

En cada pantalla, realice la tarea y compárela con el prototipo en `docs/prototipos/alta-fidelidade/`.

| # | Pantalla | Cómo llegar | Prototipo | Tarea |
|---|---|---|---|---|
| 1 | Página de inicio | http://localhost:3000 | r16, r16b con sesión iniciada | Explique, solo leyendo, qué es el UEQ y qué hace la herramienta |
| 2 | Entrar | botón "Entrar" en la barra, abre una ventana | r17, r18 en el móvil | Entre con la cuenta lista, primero equivocándose de contraseña |
| 3 | Crear cuenta | "Crear cuenta" en la ventana de Entrar | r19, r2 con error | Cree una cuenta dejando un campo vacío y luego corríjalo |
| 3a | Política de privacidad | enlace en las ventanas de acceso, en el pie de la página de inicio, en Mi cuenta y en la ayuda | r33 | Ábrala por dos caminos distintos y use "Volver". Diga qué pasa con sus respuestas |
| 3b | Recorrido guiado | primer acceso de una cuenta nueva | r28, r29 | Siga parte del recorrido y luego omítalo |
| 3c | Lista de estudios | menú "Estudios" | r3 | Encuentre el Estudo de exemplo |
| 4 | Crear estudio | "Crear estudio" | r4, r39 durante el envío, r40 en la confirmación | Cree un estudio con 2 versiones y haga clic dos veces en Crear estudio |
| 5 | Estudio en borrador | después de crearlo | r4b | Abra la recogida y copie el enlace |
| 6 | Página del estudio | título del estudio en la lista | r5 | Cierre y reabra la recogida |
| 7 | Consentimiento | el enlace del estudio | p1 | Lea el formulario y cambie el idioma |
| 7a | Política, en el enlace del participante | "Política de privacidad", al final del formulario | p9 | Diga qué pasa con sus respuestas y vuelva al formulario |
| 8 | Cuestionario | "Estoy de acuerdo y quiero participar" | p7 (escritorio), p2 (móvil), p8 (salir sin enviar) | Responda todo, dejando 2 ítems en blanco en el primer intento |
| 9 | Ítem faltante | enviar incompleto | p3 | Use el resumen para llegar a los ítems que faltan |
| 10 | Datos opcionales | después de enviar, solo si el estudio los recoge | p4 | Responda una pregunta y omita las demás |
| 11 | Final | "Continuar" | p5 | — |
| 12 | Enlace cerrado | el enlace de un estudio cerrado o en borrador | p6 | — |
| 13 | Resultados, una versión | pestaña "Resultados" | r6 | Diga, solo mirando, qué escala salió mejor y si quedó por encima del benchmark |
| 14 | Resultados, comparación | "Comparar versiones" | r7 | Diga qué versión salió mejor en Estimulación |
| 15 | Respuestas y sospechosas | pestaña "Respuestas" | r8 | Muestre solo las sospechosas, quite una del análisis y vuelva a incluirla |
| 15a | Datos demográficos | subpestaña en "Resultados", en un estudio con la recogida activada | r31, r32 para activar la recogida | Diga cuál fue el grupo de edad más frecuente |
| 15b | Compartir | "Compartir" en la página del estudio | r25 | Invite a otra cuenta como Lector y, en esa cuenta, acepte |
| 15c | Campana y notificaciones | campana en la barra, después "Ver todas las notificaciones" | r26, r27 | Encuentre la invitación y el aviso de respuestas nuevas |
| 15d | Ayuda de la página | botón (?) en el encabezado de cada página | r30 | Ábrala en dos páginas y diga si la explicación ayuda |
| 16 | Mi cuenta | menú "Mi cuenta" | r9, r35 para el idioma | Cambie el nombre y descargue sus datos |
| 16d | Idioma desde la barra | selector "PT" en la barra, con y sin sesión iniciada | r41 | Cambie a otro idioma y vuelva al portugués sin salir de la página |
| 16a | Administración | menú "Administración", solo para cuentas de administrador | r24, r24b, r24c, r34 | Cree una cuenta y vea la cobertura de los idiomas |
| 16b | Documentación | menú "Documentación", con y sin sesión iniciada | r10 a r15, r23, r36 a r38 | Abra un documento, entre en una sección, amplíe un diagrama, siga un enlace a otro documento y use Volver |
| 16c | Salir y eliminaciones | "Salir"; eliminar estudio; eliminar cuenta | r20, r21, r22 | Cancele y confirme, usando también Esc |
| 17 | Exportar | final de la pestaña "Resultados" | r6, sección 04 | Descargue la hoja oficial del UEQ (XLSX), ábrala en Excel y compárela con el panel; descargue el panel en PDF |
| 18 | Importar respuestas | pestaña "Respuestas", "Importar respuestas desde un CSV" | sin prototipo | Importe `data/fixtures/basico/respostas.csv` en una versión |
| 19 | Panel en PDF | "Panel en PDF" | sin prototipo | Abra el PDF y compruebe si sirve para el informe |
| 20 | Selector de idioma | parte superior del consentimiento | sin prototipo | Elija árabe o japonés y responda el cuestionario |

Las pantallas 18 a 20 no tienen prototipo. Evalúe si siguen el mismo patrón que las demás: botones, campos, tablas, mensajes y tono.

## Qué evaluar

Realice los tres frentes. Los dos primeros los hace cada persona por su cuenta; la consolidación es en grupo.

1. **Evaluación heurística.** En cada pantalla, busque problemas según las 10 heurísticas de Nielsen. Asigne una severidad de 0 a 4 (tabla a continuación).
2. **Lista de verificación manual de accesibilidad.** Use `docs/checklist-manual.md`: lector de pantalla, solo teclado, zoom, daltonismo y móvil real. Las pruebas automáticas no sustituyen ninguno de estos puntos.
3. **Verificación de las decisiones.** En `docs/rastreabilidade-ihc.md`, cada fila indica una decisión y dónde aparece. Compruebe en la pantalla si es cierto. La sección "O que nenhum teste automático cobre" (Lo que ninguna prueba automática cubre) enumera lo que más necesita de la mirada humana.

**Escala de severidad (Nielsen):**

| Nota | Significado |
|---|---|
| 0 | No es un problema de usabilidad |
| 1 | Cosmético: corregir si sobra tiempo |
| 2 | Menor: prioridad baja |
| 3 | Mayor: importante corregirlo |
| 4 | Catástrofe: corregir antes de entregar |

## Cómo anotar

Una fila por problema, en una hoja de cálculo compartida del equipo:

| Pantalla (#) | Heurística o criterio WCAG | Qué ocurrió | Severidad | Sugerencia | Quién lo encontró |
|---|---|---|---|---|---|
| 8 | Nielsen 9 | Ejemplo: al enviar incompleto, no quedó claro cuántos ítems faltaban | 3 | Mostrar el número en la parte superior | Nombre |

Anote lo que ocurrió, no la solución. Si no está seguro de que sea un problema, anótelo de todos modos, con severidad 1.

## Lo que ya se probó automáticamente

No hace falta dedicar tiempo a:

- comprobar si cada pantalla pasa axe-core;
- comprobar que ninguna pantalla se desplaza en horizontal a 320 px;
- comprobar que todo el flujo funciona solo con el teclado.

Las pruebas de extremo a extremo ya lo hacen en todas las pantallas, en escritorio y en móvil. Los cálculos del UEQ también están probados. La verificación con la hoja oficial también es automática: 11 escenarios en `data/fixtures/` con los números de la UEQ Data Analysis Tool (`data/fixtures/LEIA-ME.md`).

Lo que les queda a ustedes es lo que solo una persona puede evaluar:

- si la pantalla se entiende;
- si el texto es claro;
- si el lector de pantalla suena bien;
- si el pulgar acierta el círculo;
- si el panel lleva a la conclusión correcta.

## Puntos que requieren atención

- **Panel (pantallas 13 y 14):** ¿alguien que no conoce el UEQ consigue sacar la conclusión correcta?
- **Cuestionario en el móvil (pantallas 8 y 9):** responda de pie, con una mano.
- **Idiomas (pantalla 20):** si alguien del equipo habla otro idioma además del portugués, revise sus textos. Las traducciones de las pantallas del participante las hizo el equipo, y las de la herramienta, la API de Claude (`docs/idiomas.md`).
- **Recorrido guiado (pantalla 3b):** ¿alguien que nunca ha visto la herramienta consigue seguirlo?
- **Política de privacidad (pantalla 3a):** ¿un participante entiende qué pasa con sus respuestas?
- **Pantallas sin prototipo (18 a 20):** son las menos revisadas hasta ahora.
