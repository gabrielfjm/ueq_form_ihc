# Trazabilidad de las decisiones de interfaz

Cada fila es una decisión de interfaz de la herramienta. La tabla indica:

- el principio que justifica la decisión;
- dónde está en el código;
- lo que demuestra que funciona.

La tabla sirve para tres cosas:

- el informe y la presentación;
- la revisión de la herramienta, en la que quien revisa comprueba cada fila en la pantalla ([guion de la revisión](roteiro-revisao.md));
- quien modifique el código, para no deshacer una decisión sin saber por qué.

**Principios citados:**

- Nielsen (1994), heurísticas 1 a 10;
- Shneiderman, reglas de oro 1 a 8;
- Norman (2013);
- ISO 9241-110;
- WCAG 2.2 AA, criterios por su número;
- Fitts y Hick;
- las secciones de `docs/ihc.md`, citadas como §.

**Evidencias:**

- **e2e:** el título de la prueba en `tests/e2e/<arquivo>.spec.ts`. Todas las pruebas se ejecutan en ordenador y en móvil, y casi todas pasan por el axe-core.
- **unit:** una prueba en `src/**/__tests__`.
- **manual:** un ítem de `docs/checklist-manual.md`, que el equipo realiza a mano.

## Participante: el cuestionario como instrumento de medida

| Decisión | Principio | Dónde está | Evidencia |
|---|---|---|---|
| Ningún círculo viene marcado. Las 7 posiciones son idénticas: sin número, sin color graduado y sin centro destacado | §3.1 y §3.2 (validez del diferencial semántico, Laugwitz et al. 2008) | `src/componentes/ItemDiferencial.tsx` | e2e questionario: "fluxo completo do participante, com axe em todas as etapas" ("flujo completo del participante, con axe en todas las etapas") (cero botones de opción marcados) |
| Los 26 ítems siguen el orden y la polaridad oficiales. La interfaz nunca "ordena" los polos | §3.3, UEQ Handbook | `src/app/r/[slug]/questionario/page.tsx` | unit `src/ueq/__tests__`, e2e questionario |
| En árabe, hebreo y persa el texto va de derecha a izquierda, pero la escala sigue de 1 a 7 con el término de la izquierda a la izquierda, como en los PDF oficiales | §3.3, Norman (mapeo natural), WCAG 1.3.2 | `ItemDiferencial.tsx` (`dir="ltr"` en la fila), `ItemDiferencial.module.css` | e2e idiomas: "em árabe pelo seletor: página da direita para a esquerda, escala na ordem oficial" ("en árabe desde el selector: página de derecha a izquierda, escala en el orden oficial") |
| Instrucción oficial del UEQ arriba, en el idioma elegido, sin el ejemplo con un círculo marcado | §3.4, Nielsen 2 | `data/ueq-instrucoes.json`, `questionario/page.tsx` | e2e idiomas (español) |
| Mismo diseño en los 26 ítems | §3.5 | `ItemDiferencial.tsx`, un componente para todos | e2e questionario: "cada item é um grupo com legenda e 7 rádios com posição e polo" ("cada ítem es un grupo con leyenda y 7 botones de opción con posición y polo") |
| El participante nunca ve resultados | §3.6 | las rutas `/r/...` no leen el análisis | e2e autenticacao: "participante nunca precisa de sessão" ("el participante nunca necesita sesión") |

## Participante: el camino hasta el final

| Decisión | Principio | Dónde está | Evidencia |
|---|---|---|---|
| El formulario indica el tiempo (sin límite), cómo desistir hasta el envío, que después de enviar no hay forma de retirar las respuestas, cuánto tiempo se guardan, los riesgos, los beneficios, quién responde por la investigación con su institución y contacto y, cuando lo haya, el comité de ética. Tiene una copia para imprimir o guardar | LGPD art. 9º, Resolución CNS 510/2016, Nielsen 1 y 10 | `src/lib/termo.ts`, `src/app/r/[slug]/Termo.tsx`, `src/app/r/[slug]/termo/page.tsx` | e2e questionario: "o termo diz o tempo, como desistir, o que acontece depois de enviar, riscos, benefícios e quem responde, e tem uma via para guardar" ("el formulario indica el tiempo, cómo desistir, qué ocurre después de enviar, riesgos, beneficios y quién responde, y tiene una copia para guardar"); prueba unitaria: `termo.test.ts` |
| El formulario pregunta la edad. Quien tiene menos de 18 años solo continúa si confirma la autorización de su responsable legal, y el error aparece en el propio formulario, con el foco en el campo | LGPD art. 14, Nielsen 9, WCAG 3.3.1 | `src/lib/termo.ts`, `src/app/r/[slug]/acoes.ts` | e2e questionario: "quem tem menos de 18 anos só participa com a autorização do responsável, e sem idade nada é gravado" ("quien tiene menos de 18 años solo participa con la autorización del responsable, y sin edad no se graba nada") |
| El formulario del estudio exige responsable, contacto, institución, riesgos y beneficios, con sugerencias ya rellenadas | LGPD art. 9º, WCAG 3.3.7 | `estudos/formulario/FormularioEstudo.tsx`, `src/lib/validacao-estudo.ts` | e2e estudos: "o estudo nasce com o responsável da conta e exige nome, contato e instituição, que vão para o termo" ("el estudio nace con el responsable de la cuenta y exige nombre, contacto e institución, que pasan al formulario") |
| Consentimiento con una acción principal. Rechazar es un enlace igual de visible | Hick, Nielsen 8, §3.7 | `src/app/r/[slug]/page.tsx` | e2e questionario: "não quero participar sai sem gravar…" ("no quiero participar sale sin grabar…") |
| El formulario tiene un enlace a la política, en una página sin barra y sin camino hacia la herramienta, que vuelve al formulario | LGPD art. 9º, Nielsen 3 | `src/app/r/[slug]/page.tsx`, `src/app/r/[slug]/privacidade/page.tsx` | e2e questionario: "a política de privacidade abre pelo termo, dentro do link do participante, e volta para ele" ("la política de privacidad se abre desde el formulario, dentro del enlace del participante, y vuelve a él") |
| La traducción automática recibe la pantalla de cada texto, usa un solo término por concepto en cada idioma, cita los botones por el nombre que tienen en la pantalla y pasa por una segunda lectura. Si los `{marcadores}` difieren del original, se descarta y el texto queda en portugués | Nielsen 2 y 4, WCAG 3.1.2 | `src/traducao/claude.ts`, `src/traducao/rodadas.ts`, `src/traducao/extrair.ts` | prueba unitaria: `claude.test.ts`, `rodadas.test.ts`, `catalogo.test.ts` |
| Sin traducción, la política avisa en el idioma de la persona de que aparece en portugués, y el texto sale marcado con el `lang` del portugués | Nielsen 1, WCAG 3.1.2 | `src/app/r/[slug]/privacidade/page.tsx` | e2e questionario: "sem tradução automática, a política avisa no idioma da pessoa e sai marcada como português" ("sin traducción automática, la política avisa en el idioma de la persona y sale marcada como portugués") |
| No se graba nada sobre la persona antes de "Estoy de acuerdo" | §3.7 (ética en la investigación) | `src/app/r/[slug]/acoes.ts` (`consentir`) | e2e questionario |
| Etapas numeradas (1 Consentimiento · 2 Cuestionario · 3 Datos opcionales) | Shneiderman 4, Nielsen 1 | `src/app/r/[slug]/Etapas.tsx` | e2e questionario (aria-current en la etapa) |
| Cada ítem es un fieldset con leyenda. Cada círculo indica la posición y el polo ("2 de 7, más cerca de agradable") | WCAG 1.3.1, 4.1.2, 2.5.3 | `ItemDiferencial.tsx` | e2e questionario: "cada item é um grupo…" ("cada ítem es un grupo…"); manual: lector de pantalla |
| Objetivo táctil de 44×44 px, que se reduce a la par hasta caber en 320 px | WCAG 2.5.8 y 1.4.10, Fitts | `ItemDiferencial.module.css` | e2e questionario: "em 320 px (zoom de 400%) nenhuma etapa rola na horizontal" ("en 320 px (zoom del 400 %) ninguna etapa se desplaza en horizontal") |
| Validación solo en el envío, nunca en cada ítem. El resumen recibe el foco, dice "Faltan N ítems" y tiene un enlace a cada ítem | WCAG 3.3.1 y 2.4.3, Nielsen 9, §4.1 | `src/app/r/[slug]/questionario/FormularioQuestionario.tsx` | e2e questionario: "envio incompleto leva o foco ao resumo e os links levam aos itens" ("el envío incompleto lleva el foco al resumen y los enlaces llevan a los ítems") |
| Pie fijo con el progreso y "Salir sin enviar". El ítem con el foco nunca queda debajo del pie | Nielsen 1, Shneiderman 7, WCAG 2.4.11 | `questionario/RodapeProgresso.tsx` | e2e questionario: "fluxo completo só com teclado, com o foco sempre visível" ("flujo completo solo con teclado, con el foco siempre visible") |
| El progreso se anuncia solo cada 5 ítems y al completar | WCAG 4.1.3, §4.1 (no saturar el lector de pantalla) | `FormularioQuestionario.tsx` | manual: lector de pantalla |
| Recargar o volver no borra lo marcado (borrador solo en la pestaña) | ISO 9241-110 (robustez frente a los errores), Nielsen 3 | `questionario/useRascunho.ts` | e2e questionario: "recarregar a página recupera as respostas marcadas" ("recargar la página recupera las respuestas marcadas") |
| Salir sin enviar se confirma en una ventana (foco en Seguir respondiendo, Esc continúa) y borra la participación incompleta | Shneiderman 6, Nielsen 5, §3.7, WCAG 2.4.3 | `RodapeProgresso.tsx`, `src/componentes/janela/Janela.tsx`, `acoes.ts` (`desistir`) | e2e questionario: "sair sem enviar confirma numa janela e não grava nada" ("salir sin enviar se confirma en una ventana y no graba nada") |
| Datos opcionales con "Prefiero no responder" en cada pregunta, y "Saltar esta etapa" con el mismo peso que "Continuar" | §3.8, Nielsen 3 | `src/app/r/[slug]/sobre-voce/page.tsx`, `src/lib/demografia.ts` | e2e questionario |
| El enlace ya respondido en el mismo navegador no acepta otro envío | Nielsen 5 | `src/app/r/[slug]/page.tsx`, `src/lib/participacao.ts` | e2e questionario |
| Un enlace en borrador o cerrado explica la situación en lugar de dar un error | Nielsen 9 | `src/app/r/[slug]/page.tsx` (prototipo p6) | e2e estudos: "abre, encerra e reabre a coleta, e o link público acompanha" ("abre, cierra y reabre la recogida, y el enlace público la acompaña") |

## Participante: idiomas

| Decisión | Principio | Dónde está | Evidencia |
|---|---|---|---|
| El enlace se abre en el idioma del estudio, entre los 37 del paquete oficial, aunque el navegador esté en otro idioma, y el `<html lang>` y el `dir` lo acompañan | WCAG 3.1.1 | `src/app/r/[slug]/layout.tsx`, `src/lib/participacao.ts` (`idiomaDoParticipante`) | e2e idiomas: "estudo em espanhol: o link abre no idioma do estudo, mesmo com o navegador em português" ("estudio en español: el enlace se abre en el idioma del estudio, incluso con el navegador en portugués") |
| En el selector de idioma, elegir no cambia nada: solo el botón "Aplicar" | WCAG 3.2.2 | `src/app/r/[slug]/SeletorIdioma.tsx` | e2e idiomas (árabe) |
| Cada idioma aparece en el selector con su propio nombre y con `lang` | WCAG 3.1.2 | `SeletorIdioma.tsx` | manual: lector de pantalla |
| En los 9 idiomas con traducción no aprobada, aviso en el consentimiento y marca para el investigador | Nielsen 1, transparencia metodológica | `SeletorIdioma.tsx`, `respostas/TabelaParticipacoes.tsx`, exportaciones | e2e idiomas (árabe) |
| Todos los textos de pantalla tienen traducción, con los mismos marcadores que la versión en portugués | Shneiderman 2 (usabilidad universal) | `src/idiomas/textos/*.ts`, con el tipo `TextosParticipante` | unit `src/idiomas/__tests__/idiomas.test.ts` |
| El cuestionario usa solo las traducciones oficiales; el título, el producto y el objetivo del estudio salen traducidos, y sin traducción quedan en el original, marcados con su `lang` | Validez del instrumento (§3), WCAG 3.1.2 | `src/lib/participacao.ts` (`textosDoEstudo`), `src/traducao/servidor.ts` | manual: revisión por un hablante nativo (`docs/idiomas.md`) |

## Investigador: cuenta y estudios

| Decisión | Principio | Dónde está | Evidencia |
|---|---|---|---|
| Entrar acepta pegar la contraseña y el gestor de contraseñas. Botón "Mostrar contraseña" anunciado | WCAG 3.3.8 y 1.3.5 | `src/componentes/formulario/Campo.tsx` | e2e autenticacao: "Mostrar senha alterna a visibilidade e anuncia o estado" ("Mostrar contraseña alterna la visibilidad y anuncia el estado") |
| Resumen de errores arriba, con foco y un enlace a cada campo | WCAG 3.3.1 y 3.3.3, Nielsen 9 | `src/componentes/formulario/ResumoErros.tsx` | e2e autenticacao: "o link do resumo de erros leva ao campo" ("el enlace del resumen de errores lleva al campo") |
| Una ruta protegida vuelve a donde estaba la persona después del inicio de sesión | Nielsen 3 | `src/proxy.ts` | e2e autenticacao: "rota protegida sem sessão vai para Entrar e volta para ela depois do login" ("una ruta protegida sin sesión va a Entrar y vuelve a ella después del inicio de sesión") |
| El producto evaluado se convierte en la sugerencia de nombre de la primera versión | WCAG 3.3.7 | `estudos/formulario/FormularioEstudo.tsx` | e2e estudos: "o produto sugere o nome da primeira versão…" ("el producto sugiere el nombre de la primera versión…") |
| Eliminar un estudio o una cuenta abre una ventana que pide escribir el título o el correo electrónico y dice lo que se borra con ellos | Nielsen 5, WCAG 3.3.4 | `estudos/[id]/AcoesEstudo.tsx`, `conta/ExcluirConta.tsx`, `src/componentes/janela/Confirmacao.tsx` | e2e estudos: "excluir pede o título e apaga o estudo" ("eliminar pide el título y borra el estudio"); e2e conta: "excluir a conta exige digitar o e-mail e apaga o acesso" ("eliminar la cuenta exige escribir el correo electrónico y borra el acceso") |
| Salir y Quitar versión también se confirman en una ventana, con el foco ya en el botón de la acción | Nielsen 3 y 5, Shneiderman 6 | `(pesquisador)/BarraSuperior.tsx`, `estudos/formulario/ListaVersoes.tsx` | e2e autenticacao: "cadastra, sai e entra de novo usando só o teclado" ("se registra, sale y vuelve a entrar usando solo el teclado"); e2e estudos: "o produto sugere o nome da primeira versão…" ("el producto sugiere el nombre de la primera versión…") |
| La página de inicio explica el UEQ y la herramienta: qué es el método, cómo leer los resultados, cómo funciona, los estudios y los créditos. Es también la pantalla después del inicio de sesión | Nielsen 2 y 10 | `(publico)/PaginaInicial.tsx` | e2e inicial: "a raiz apresenta a ferramenta para quem não tem sessão e passa no axe" ("la raíz presenta la herramienta a quien no tiene sesión y pasa el axe") |
| Entrar y Crear cuenta se abren en una ventana sobre la página actual, se intercambian sin cerrarse y caben en la pantalla sin desplazarse | Nielsen 3, Shneiderman 8, WCAG 1.4.10 | `(publico)/_acesso/Acesso.tsx`, `acesso.module.css` | e2e inicial: "Entrar abre a janela por cima da página, sem rolar, e Esc fecha devolvendo o foco" ("Entrar abre la ventana sobre la página, sin desplazarse, y Esc la cierra devolviendo el foco") |
| Cerrar la recogida es reversible ("Reabrir"), por eso no pide confirmación | Shneiderman 6 | `estudos/[id]/BotaoColeta.tsx` | e2e estudos: "abre, encerra e reabre a coleta…" ("abre, cierra y reabre la recogida…") |
| Estado escrito con la consecuencia ("Abierto · aceptando respuestas"), siempre en el mismo lugar | Nielsen 1 | `src/lib/status-estudo.ts`, `estudos/[id]/FaixaEstudo.tsx` | e2e estudos |
| Toda acción confirma el resultado en una región `role="status"`, que acompaña el desplazamiento y permanece hasta que la persona la cierra. El error tiene otro color y otro icono | Norman (retroalimentación), Shneiderman 3, WCAG 4.1.3 y 2.2.1 | `src/componentes/Avisos.tsx`, `formulario/MensagemStatus.tsx` | e2e estudos: "a confirmação pode ser fechada e continua à vista depois de rolar a página" ("la confirmación se puede cerrar y sigue a la vista después de desplazar la página"); e2e autenticacao: "criar a conta e entrar confirmam na tela" ("crear la cuenta y entrar se confirman en la pantalla") |
| Mientras la acción se ejecuta, el botón dice lo que está ocurriendo e ignora nuevos clics, y el formulario deja de responder: nada se envía dos veces | Nielsen 1 y 5, WCAG 4.1.3 y 2.4.3 | `formulario/BotaoEnvio.tsx`, `src/app/globals.css` | e2e estudos: "enquanto cria o estudo o botão mostra que está processando, ignora novos cliques e no fim confirma" ("mientras crea el estudio, el botón muestra que está procesando, ignora nuevos clics y al final confirma") |
| Otro investigador no ve el estudio desde la dirección: la respuesta es igual a la de un estudio inexistente | privacidad de los datos de la investigación | `src/lib/estudos.ts` (`estudoDoPesquisador`) | e2e estudos: "outro pesquisador não vê o estudo pelo endereço" ("otro investigador no ve el estudio desde la dirección"); e2e exportacao |

## Investigador: equipo, avisos y ayuda

| Decisión | Principio | Dónde está | Evidencia |
|---|---|---|---|
| El propietario invita por correo electrónico como Editor o Lector; el estudio solo aparece después de aceptar, y el lector solo ve y exporta | Nielsen 5, control del usuario, privacidad de los datos de la investigación | `estudos/[id]/Compartilhar.tsx`, `acoes-compartilhar.ts`, `src/lib/estudos.ts` (`PERMISSOES`) | e2e equipe: "convite por e-mail chega no sino, o leitor só vê e o dono é avisado" ("la invitación por correo llega a la campana, el lector solo ve y se avisa al propietario") |
| Campana con el número de no leídas, que también funciona con el teclado, e invitaciones con Aceptar y Rechazar allí mismo | Nielsen 1, Shneiderman 7, WCAG 2.1.1 | `(pesquisador)/sino.module.css`, `notificacoes/page.tsx`, `src/lib/notificacoes.ts` | e2e equipe: "o sino também funciona pelo teclado" ("la campana también funciona con el teclado") |
| Las respuestas nuevas se agrupan en un solo aviso mientras no se lee: 30 respuestas en una mañana no son 30 avisos | Nielsen 8, carga de memoria (Shneiderman 8) | `src/lib/notificacoes.ts` (`notificarResposta`) | manual |
| Quien realizó la acción no recibe aviso de su propia acción, y el correo electrónico se puede desactivar en Mi cuenta | Nielsen 8, Shneiderman 7 | `src/lib/notificacoes.ts` (`notificar`) | e2e equipe: "convite por e-mail chega no sino…" ("la invitación por correo llega a la campana…") |
| Recorrido solo en el primer acceso, en las pantallas reales, que avanza con la acción de la persona y que se puede saltar y repasar | ISO 9241-110 (facilidad de aprendizaje), Nielsen 3 y 10 | `src/componentes/tutorial/` | e2e equipe: "o tour abre só no primeiro acesso, avança pelo clique na ação e pode ser pulado" ("el recorrido se abre solo en el primer acceso, avanza con el clic en la acción y se puede saltar") |
| El (?) en cada página del investigador dice para qué sirve y qué se puede hacer en ella | Nielsen 10 | `src/componentes/ajuda/BotaoAjuda.tsx`, `src/lib/ajuda.ts` | e2e equipe: "toda página do pesquisador tem o (?) com a ajuda dela" ("cada página del investigador tiene el (?) con su ayuda") |
| Administración y Mi cuenta son paneles: cada opción muestra la situación actual y abre una página propia | Nielsen 6, Hick, revelación progresiva | `src/componentes/painel/PainelOpcoes.tsx` | e2e conta; manual |
| La interfaz sale en el idioma de la cuenta, y el idioma se cambia en Mi cuenta. Mientras la mayor parte no esté traducida, el `lang` de la página queda en portugués, para que el lector de pantalla pronuncie bien | Shneiderman 2, WCAG 3.1.1 | `src/traducao/servidor.ts` (`idiomaExibido`), `conta/idioma/` | e2e idioma-interface: "o idioma escolhido ao criar a conta vale para a ferramenta e pode ser trocado em Minha conta" ("el idioma elegido al crear la cuenta se aplica a la herramienta y se puede cambiar en Mi cuenta") |

## Protección de datos

| Decisión | Principio | Dónde está | Evidencia |
|---|---|---|---|
| La política es pública y está escrita sin jerga jurídica, en filas de etiqueta y explicación, con un resumen y un índice | LGPD art. 9º, Nielsen 2, WCAG 2.4.5 | `(publico)/privacidade/page.tsx` | e2e privacidade: "a política de privacidade é pública e acessível" ("la política de privacidad es pública y accesible"); "a política leva cada seção pelo índice e não rola na horizontal em 320 px" ("la política lleva a cada sección desde el índice y no se desplaza en horizontal en 320 px") |
| El "Volver" de la política dice adónde va, funciona sin historial y devuelve a la persona al punto del que salió | Nielsen 3, Shneiderman 7 | `privacidade/Voltar.tsx`, `privacidade/origem.ts` | e2e privacidade: "da página inicial, a política volta ao rodapé de onde a pessoa saiu" ("desde la página de inicio, la política vuelve al pie del que salió la persona"); "de Minha conta e da ajuda, a política volta para a mesma tela" ("desde Mi cuenta y desde la ayuda, la política vuelve a la misma pantalla") |
| Desde las ventanas de Entrar y Crear cuenta, la política se abre en otra pestaña, lo avisa en el nombre del enlace, y volver cierra la pestaña, sin perder lo escrito | Nielsen 3, WCAG 3.2.5 | `_acesso/LinkPrivacidade.tsx`, `privacidade/Voltar.tsx` | e2e privacidade: "das janelas de acesso, a política abre em outra aba, sem perder o que foi digitado, e voltar tenta fechar a aba" ("desde las ventanas de acceso, la política se abre en otra pestaña, sin perder lo escrito, y volver intenta cerrar la pestaña"); manual: lista de verificación, lector de pantalla |
| El destino del "Volver" solo acepta una ruta interna | Seguridad (redirección abierta) | `src/lib/validacao-conta.ts` (`destinoInterno`) | e2e privacidade: "a política não aceita voltar para outro site" ("la política no acepta volver a otro sitio") |
| La recogida demográfica viene desactivada en cada estudio, y la casilla explica por qué | LGPD art. 6º (necesidad), §3.8 | `estudos/formulario/`, `Estudo.coletarDemografia` | manual: `docs/roteiro-revisao.md` |
| "Descargar mis datos" entrega un archivo con todo, sin pedírselo a nadie | LGPD art. 18, Shneiderman 7 | `src/app/api/conta/dados/route.ts`, `conta/FichaConta.tsx` | e2e privacidade: "Baixar meus dados entrega um JSON com a conta e sem a senha" ("Descargar mis datos entrega un JSON con la cuenta y sin la contraseña") |
| Después de 5 contraseñas incorrectas, el mensaje dice cuánto esperar | Nielsen 9, LGPD art. 46 | `src/lib/tentativas.ts` | e2e privacidade: "depois de 5 senhas erradas o e-mail espera" ("después de 5 contraseñas incorrectas el correo electrónico espera") |

## Investigador: panel de resultados

| Decisión | Principio | Dónde está | Evidencia |
|---|---|---|---|
| Lectura rápida escrita arriba, y la interpretación junto a cada número ("neutro · Por debajo de la media") | Nielsen 6, Shneiderman 8 | `src/lib/leitura-rapida.ts`, `resultados/VisaoUmaVersao.tsx` | e2e resultados: "mostra os números do módulo UEQ…" ("muestra los números del módulo UEQ…") |
| Gráfico con descripción en texto y tabla equivalente justo debajo | WCAG 1.1.1 y 1.3.1 | `src/graficos/EscalasComBenchmark.tsx`, `VisaoUmaVersao.tsx` | e2e resultados (axe); manual: lector de pantalla |
| Versiones distinguidas por forma (círculo lleno, hueco…), no solo por color | WCAG 1.4.1 | `EscalasComBenchmark.tsx` | e2e resultados: "gráficos com daltonismo simulado e alto contraste" ("gráficos con daltonismo simulado y alto contraste") |
| Escalas agrupadas en Atractivo, Pragmática y Hedónica | Gestalt (proximidad, región común), modelo conceptual del UEQ | `EscalasComBenchmark.tsx` | e2e resultados |
| Cada término técnico (benchmark, IC95, alfa) explicado cerca, en `<details>` | Nielsen 10, revelación progresiva | `resultados/Explicacoes.tsx` | manual |
| Los avisos de alfa bajo y de muestra pequeña dicen qué significan y qué hacer | Nielsen 9 | `VisaoUmaVersao.tsx` | e2e resultados: "com uma resposta só avisa que não há intervalo de confiança" ("con una sola respuesta avisa de que no hay intervalo de confianza") |
| Versión, modo y orden de los ítems quedan en la URL: volver, recargar y compartir funcionan | Nielsen 3 | `resultados/ControlesResultados.tsx` | e2e resultados: "…guarda versão e modo na URL" ("…guarda versión y modo en la URL") |
| Cambiar la versión no quita el foco del selector | WCAG 3.2.2 | `ControlesResultados.tsx` | manual: teclado |
| En pantalla estrecha la tabla se desplaza dentro de una región enfocable, y la página no se desplaza | WCAG 1.4.10 y 2.1.1 | `VisaoUmaVersao.tsx`, `VisaoComparacao.tsx` | e2e resultados: "em 320 px o painel não rola na horizontal, nos dois modos" ("en 320 px el panel no se desplaza en horizontal, en los dos modos") |
| Datos demográficos en una subpestaña propia, cada pregunta en el gráfico que le corresponde, con "Ver los números" | Gestalt, WCAG 1.1.1, revelación progresiva | `src/graficos/Demografia.tsx`, `resultados/demograficos/` | e2e privacidade: "os dados demográficos aparecem em Resultados, numa sub-aba própria" ("los datos demográficos aparecen en Resultados, en una subpestaña propia") |
| Panel en PDF con la misma selección que la pantalla, encabezado con título, n y fecha de generación, gráficos vectoriales, A4 con márgenes de 18 mm | Nielsen 4, §4.4 | `resultados/impressao/`, `src/app/api/estudos/[id]/painel-pdf/route.ts` | e2e painel-pdf |

## Investigador: respuestas, exportación e importación

| Decisión | Principio | Dónde está | Evidencia |
|---|---|---|---|
| Panorama de cuántas participaciones están dentro y fuera del análisis | Nielsen 1 | `estudos/[id]/respostas/page.tsx` | e2e respostas |
| Excluir del análisis solo lo saca del cálculo, nunca borra, y se puede deshacer | Shneiderman 6, docs/ueq-protocolo.md §7 | `respostas/acoes.ts` | e2e respostas: "incluir e excluir uma participação avisa e nunca apaga" ("incluir y excluir una participación avisa y nunca borra") |
| La regla de sospecha y los umbrales quedan visibles junto a la lista | Nielsen 6 y 10 | `respostas/page.tsx` | e2e respostas: "a fixture inconsistente sai com as 4 suspeitas da equipe…" ("la fixture incoherente sale con las 4 sospechosas del equipo…") |
| El filtro "Mostrar solo sospechosas" queda en la URL | Nielsen 3 | `respostas/TabelaParticipacoes.tsx` | e2e respostas |
| Cada exportación indica el formato, el contenido y el uso, con un nombre legible y con fecha, y se descarga sin abrir una pestaña nueva | §4.4, Nielsen 2 | `resultados/SecaoExportar.tsx`, `src/app/api/estudos/[id]/exportar/[tipo]/route.ts` | e2e exportacao: "baixa as 4 exportações com nome datado, BOM e o formato de cada uma" ("descarga las 4 exportaciones con nombre con fecha, BOM y el formato de cada una") |
| Importar CSV en dos pasos: vista previa de las 5 primeras filas o el problema de cada fila, y después la confirmación. Solo graba si el archivo entero es válido | Nielsen 5 y 9, Shneiderman 4 y 5 | `respostas/importar/`, `src/lib/importacao.ts` | e2e importacao; unit `src/lib/__tests__/importacao.test.ts` |
| Las respuestas importadas quedan marcadas y sin idioma, porque el CSV no indica el idioma (no se inventa nada) | Nielsen 1, integridad del dato | `TabelaParticipacoes.tsx`, `src/lib/exportacoes.ts` | e2e importacao; unit `exportacoes.test.ts` |
| La subpágina (Respuestas › Importar) mantiene marcada la pestaña de origen | Nielsen 1, WCAG 2.4.8 (ubicación) | `estudos/[id]/AbasEstudo.tsx` | e2e importacao |

## En toda la herramienta

| Decisión | Principio | Dónde está | Evidencia |
|---|---|---|---|
| Barra superior fija arriba durante el desplazamiento, en el ordenador y en el móvil: la navegación está siempre a mano | Nielsen 3 y 6, Shneiderman 7 | `src/app/(ferramenta)/(pesquisador)/BarraFixa.tsx`, `pesquisador.module.css` | e2e barra: "a barra fica fixa no topo ao rolar, com e sem conta" ("la barra queda fija arriba al desplazarse, con y sin cuenta") |
| Con la barra fija, el foco y el destino de las anclas se detienen debajo de ella: `scroll-padding-top` con la altura medida de la barra | WCAG 2.4.11 | `src/app/globals.css`, `BarraFixa.tsx` (`--altura-barra`) | e2e barra: "o foco e as âncoras nunca ficam embaixo da barra fixa" ("el foco y las anclas nunca quedan debajo de la barra fija") |
| Selector de idioma en la barra, con y sin inicio de sesión: cada idioma es un botón con su propio nombre, solo el clic lo cambia, y la página sigue siendo la misma con el foco de vuelta en el selector | WCAG 3.1.1, 3.2.2 y 2.5.3, Nielsen 7 (atajo a Mi cuenta › Idioma) | `(pesquisador)/SeletorIdioma.tsx`, `seletor-idioma.module.css`, `(pesquisador)/acoes.ts` (`trocarIdioma`) | e2e idioma-interface: "o seletor de idioma da barra troca a ferramenta e a conta sem sair da página" ("el selector de idioma de la barra cambia la herramienta y la cuenta sin salir de la página") |
| En el móvil los enlaces quedan detrás del botón Menú (`aria-expanded`), que se cierra con Esc devolviendo el foco y al cambiar de página | WCAG 2.1.2 y 4.1.2, Nielsen 8 (barra fija de una sola línea) | `BarraFixa.tsx` | e2e barra: "no celular os links ficam no menu, que fecha com Esc e devolve o foco" ("en el móvil los enlaces quedan en el menú, que se cierra con Esc y devuelve el foco") |
| Un documento largo se abre como índice, y cada sección en una página propia, con el diagrama a la vista, Volver y Anterior/Siguiente | Nielsen 3 y 8, revelación progresiva, WCAG 2.4.5 y 2.4.8 | `documentacao/PaginaSecao.tsx`, `src/lib/documentacao/estrutura.ts`, `paginas.ts` | e2e documentacao: "documento longo abre como índice, e cada seção em página própria com o diagrama à vista" ("un documento largo se abre como índice, y cada sección en una página propia con el diagrama a la vista") |
| Volver lleva a la página de la que vino la persona, incluso en otro documento, y sin historial a la página superior | Nielsen 3, Shneiderman 7 | `documentacao/NavegacaoDocumento.tsx` | e2e documentacao: "Voltar leva à página de onde a pessoa veio e, sem histórico, à página de cima" ("Volver lleva a la página de la que vino la persona y, sin historial, a la página superior") |
| El enlace de una tabla lleva a la página de la fila y marca el destino | Nielsen 6, WCAG 2.4.4 | `paginas.ts` (`rotaDaAncora`), `texto.module.css` (`:target`) | e2e documentacao: "seção com muitas subseções vira índice, e o link de uma tabela leva à página da linha" ("una sección con muchas subsecciones se convierte en índice, y el enlace de una tabla lleva a la página de la fila") |
| Hacer clic en un diagrama de la documentación lo abre a pantalla completa en un `<dialog>` nativo: Volver fijo arriba, Esc cierra y el foco vuelve al diagrama | WCAG 2.1.2 y 2.4.3, Nielsen 3, Shneiderman 6 | `documentacao/ArtigoDocumento.tsx` | e2e documentacao: "clicar no diagrama abre em tela cheia, com zoom, arrasto, Voltar e Esc" ("hacer clic en el diagrama lo abre a pantalla completa, con zoom, arrastre, Volver y Esc") |
| Zoom del 50 % al 400 % (botones, Ctrl + rueda, + y - solo con la pantalla completa abierta), centrado en el punto que miraba la persona, y arrastre para mover | WCAG 1.4.4 y 2.1.4, Shneiderman 7 | `ArtigoDocumento.tsx`, `ampliado.module.css` | e2e documentacao: "clicar no diagrama abre em tela cheia…" ("hacer clic en el diagrama lo abre a pantalla completa…") |
| Enlace "Saltar al contenido" como primer Tab | WCAG 2.4.1 | `src/app/(ferramenta)/layout.tsx`, `src/app/r/[slug]/layout.tsx` | e2e inicial: "o primeiro Tab leva ao link de pular para o conteúdo" ("el primer Tab lleva al enlace para saltar al contenido") |
| Título de página único y descriptivo ("Cuestionario · <estudio>") | WCAG 2.4.2 | `generateMetadata` de cada página | e2e (toHaveTitle en varias pruebas) |
| Colores en tokens, con el contraste comprobado por una prueba | WCAG 1.4.3 y 1.4.11 | `src/styles/tokens.css` | unit `src/styles/__tests__/contraste.test.ts` |
| Mismo patrón de botón, campo, tabla y mensaje en todas las pantallas | Nielsen 4, Shneiderman 1 | `src/componentes/formulario/`, `src/styles/` | manual: `docs/roteiro-revisao.md` |
| Pantallas iguales al prototipo de alta fidelidad | coherencia con el proyecto evaluado | `docs/prototipos/alta-fidelidade/` | manual: `docs/roteiro-revisao.md` |

## Lo que ninguna prueba automática cubre

Estos puntos se comprueban a mano, en los casos de prueba manuales ([lista de verificación manual](checklist-manual.md) y [guion de la revisión](roteiro-revisao.md)):

- uso real con lector de pantalla (NVDA, VoiceOver, TalkBack) de principio a fin;
- zoom del 200 % y del 400 % en un móvil real, y el pulgar sobre los círculos;
- espaciado de texto aumentado (WCAG 1.4.12) y `prefers-reduced-motion`;
- la calidad de las traducciones de las pantallas del participante y de la interfaz traducida por la API (`docs/idiomas.md`);
- el recorrido guiado y la campana con lector de pantalla;
- la comprensión del panel por parte de quien no conoce el UEQ.

Las pantallas sin prototipo de alta fidelidad (el selector de idioma, Importar respuestas y el panel en PDF) usan los mismos componentes que las demás y se comprueban con el mismo guion.
