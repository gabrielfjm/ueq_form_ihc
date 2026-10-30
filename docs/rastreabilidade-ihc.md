# Rastreabilidade das decisões de interface

Cada linha é uma decisão de interface da ferramenta. A tabela diz:

- o princípio que justifica a decisão;
- onde ela está no código;
- o que comprova que funciona.

A tabela serve para três coisas:

- o relatório e a apresentação;
- a revisão final, onde o revisor confere cada linha na tela;
- quem mexer no código, para não desfazer uma decisão sem saber por quê.

**Princípios citados:**

- Nielsen (1994), heurísticas 1 a 10;
- Shneiderman, regras de ouro 1 a 8;
- Norman (2013);
- ISO 9241-110;
- WCAG 2.2 AA, critérios pelo número;
- Fitts e Hick;
- as seções de `docs/ihc.md`, citadas como §.

**Evidências:**

- **e2e:** o título do teste em `tests/e2e/<arquivo>.spec.ts`. Todos os testes rodam no desktop e no celular, e quase todos passam pelo axe-core.
- **unit:** um teste em `src/**/__tests__`.
- **manual:** um item de `docs/checklist-manual.md`, que a equipe faz à mão.

## Participante: o questionário como instrumento de medida

| Decisão | Princípio | Onde está | Evidência |
|---|---|---|---|
| Nenhum círculo vem marcado. As 7 posições são idênticas: sem número, sem cor graduada e sem centro destacado | §3.1 e §3.2 (validade do diferencial semântico, Laugwitz et al. 2008) | `src/componentes/ItemDiferencial.tsx` | e2e questionario: "fluxo completo do participante, com axe em todas as etapas" (zero rádios marcados) |
| Os 26 itens seguem a ordem e a polaridade oficiais. A interface nunca "arruma" os polos | §3.3, UEQ Handbook | `src/app/r/[slug]/questionario/page.tsx` | unit `src/ueq/__tests__`, e2e questionario |
| Em árabe, hebraico e persa o texto vai da direita para a esquerda, mas a escala continua de 1 a 7 com o termo da esquerda à esquerda, como nos PDFs oficiais | §3.3, Norman (mapeamento natural), WCAG 1.3.2 | `ItemDiferencial.tsx` (`dir="ltr"` na linha), `ItemDiferencial.module.css` | e2e idiomas: "em árabe pelo seletor: página da direita para a esquerda, escala na ordem oficial" |
| Instrução oficial do UEQ no topo, no idioma escolhido, sem o exemplo com círculo marcado | §3.4, Nielsen 2 | `data/ueq-instrucoes.json`, `questionario/page.tsx` | e2e idiomas (espanhol) |
| Mesmo layout nos 26 itens | §3.5 | `ItemDiferencial.tsx`, um componente para todos | e2e questionario: "cada item é um grupo com legenda e 7 rádios com posição e polo" |
| O participante nunca vê resultados | §3.6 | as rotas `/r/...` não leem a análise | e2e autenticacao: "participante nunca precisa de sessão" |

## Participante: o caminho até o fim

| Decisão | Princípio | Onde está | Evidência |
|---|---|---|---|
| Consentimento com uma ação principal. Recusar é um link igualmente visível | Hick, Nielsen 8, §3.7 | `src/app/r/[slug]/page.tsx` | e2e questionario: "não quero participar sai sem gravar…" |
| Nada sobre a pessoa é gravado antes de "Concordo" | §3.7 (ética em pesquisa) | `src/app/r/[slug]/acoes.ts` (`consentir`) | e2e questionario |
| Etapas numeradas (1 Consentimento · 2 Questionário · 3 Dados opcionais) | Shneiderman 4, Nielsen 1 | `src/app/r/[slug]/Etapas.tsx` | e2e questionario (aria-current na etapa) |
| Cada item é um fieldset com legenda. Cada círculo diz a posição e o polo ("2 de 7, mais perto de Agradável") | WCAG 1.3.1, 4.1.2, 2.5.3 | `ItemDiferencial.tsx` | e2e questionario: "cada item é um grupo…"; manual: leitor de tela |
| Alvo de toque de 44×44 px, que encolhe junto até caber em 320 px | WCAG 2.5.8 e 1.4.10, Fitts | `ItemDiferencial.module.css` | e2e questionario: "em 320 px (zoom de 400%) nenhuma etapa rola na horizontal" |
| Validação só no envio, nunca a cada item. O resumo recebe o foco, diz "Faltam N itens" e tem um link para cada item | WCAG 3.3.1 e 2.4.3, Nielsen 9, §4.1 | `src/app/r/[slug]/questionario/FormularioQuestionario.tsx` | e2e questionario: "envio incompleto leva o foco ao resumo e os links levam aos itens" |
| Rodapé fixo com o progresso e "Sair sem enviar". O item em foco nunca fica embaixo do rodapé | Nielsen 1, Shneiderman 7, WCAG 2.4.11 | `questionario/RodapeProgresso.tsx` | e2e questionario: "fluxo completo só com teclado, com o foco sempre visível" |
| O progresso é anunciado só a cada 5 itens e ao completar | WCAG 4.1.3, §4.1 (não poluir o leitor de tela) | `FormularioQuestionario.tsx` | manual: leitor de tela |
| Recarregar ou voltar não apaga o que foi marcado (rascunho só na aba) | ISO 9241-110 (robustez ao erro), Nielsen 3 | `questionario/useRascunho.ts` | e2e questionario: "recarregar a página recupera as respostas marcadas" |
| Sair sem enviar confirma em linha e apaga a participação incompleta | Shneiderman 6, §3.7 | `RodapeProgresso.tsx`, `acoes.ts` (`desistir`) | e2e questionario: "sair sem enviar confirma em linha e não grava nada" |
| Dados opcionais com "Prefiro não responder" em toda pergunta, e "Pular esta etapa" com o mesmo peso de "Continuar" | §3.8, Nielsen 3 | `src/app/r/[slug]/sobre-voce/page.tsx`, `src/lib/demografia.ts` | e2e questionario |
| O link já respondido no mesmo navegador não aceita outro envio | Nielsen 5 | `src/app/r/[slug]/page.tsx`, `src/lib/participacao.ts` | e2e questionario |
| Link em rascunho ou encerrado explica a situação em vez de dar erro | Nielsen 9 | `src/app/r/[slug]/page.tsx` (protótipo p6) | e2e estudos: "abre, encerra e reabre a coleta, e o link público acompanha" |

## Participante: idiomas

| Decisão | Princípio | Onde está | Evidência |
|---|---|---|---|
| O idioma vem do navegador, entre os 37 do pacote oficial, e o `<html lang>` e o `dir` acompanham | WCAG 3.1.1 | `src/app/r/[slug]/layout.tsx`, `src/idiomas/index.ts` (`negociarIdioma`) | e2e idiomas: "em espanhol pelo navegador…"; unit `src/idiomas/__tests__` |
| No seletor de idioma, escolher não muda nada: só o botão "Aplicar" | WCAG 3.2.2 | `src/app/r/[slug]/SeletorIdioma.tsx` | e2e idiomas (árabe) |
| Cada idioma aparece no seletor com o próprio nome e com `lang` | WCAG 3.1.2 | `SeletorIdioma.tsx` | manual: leitor de tela |
| Nos 9 idiomas de tradução não aprovada, aviso no consentimento e marca para o pesquisador | Nielsen 1, transparência metodológica | `SeletorIdioma.tsx`, `respostas/TabelaParticipacoes.tsx`, exportações | e2e idiomas (árabe) |
| Todos os textos de tela têm tradução, com os mesmos marcadores da versão em português | Shneiderman 2 (usabilidade universal) | `src/idiomas/textos/*.ts`, com o tipo `TextosParticipante` | unit `src/idiomas/__tests__/idiomas.test.ts` |

## Pesquisador: conta e estudos

| Decisão | Princípio | Onde está | Evidência |
|---|---|---|---|
| Entrar aceita colar a senha e o gerenciador de senhas. Botão "Mostrar senha" anunciado | WCAG 3.3.8 e 1.3.5 | `src/componentes/formulario/Campo.tsx` | e2e autenticacao: "Mostrar senha alterna a visibilidade e anuncia o estado" |
| Resumo de erros no topo, com foco e um link para cada campo | WCAG 3.3.1 e 3.3.3, Nielsen 9 | `src/componentes/formulario/ResumoErros.tsx` | e2e autenticacao: "o link do resumo de erros leva ao campo" |
| Rota protegida volta para onde a pessoa estava depois do login | Nielsen 3 | `src/proxy.ts` | e2e autenticacao: "rota protegida sem sessão vai para Entrar e volta para ela depois do login" |
| O produto avaliado vira sugestão de nome da primeira versão | WCAG 3.3.7 | `estudos/formulario/FormularioEstudo.tsx` | e2e estudos: "o produto sugere o nome da primeira versão…" |
| Excluir estudo ou conta pede o título ou o e-mail digitado e diz o que vai junto | Nielsen 5, WCAG 3.3.4 | `estudos/[id]/AcoesEstudo.tsx`, `conta/ExcluirConta.tsx` | e2e estudos: "excluir pede o título e apaga o estudo"; e2e conta |
| Encerrar a coleta é reversível ("Reabrir"), por isso não pede confirmação | Shneiderman 6 | `estudos/[id]/BotaoColeta.tsx` | e2e estudos: "abre, encerra e reabre a coleta…" |
| Status escrito com a consequência ("Aberto · aceitando respostas"), sempre no mesmo lugar | Nielsen 1 | `src/lib/status-estudo.ts`, `estudos/[id]/FaixaEstudo.tsx` | e2e estudos |
| Toda ação confirma o resultado numa região `role="status"` | Norman (feedback), Shneiderman 3, WCAG 4.1.3 | `src/componentes/Avisos.tsx`, `formulario/MensagemStatus.tsx` | e2e estudos: "Copiar link anuncia o resultado…"; e2e conta |
| Outro pesquisador não vê o estudo pelo endereço: a resposta é igual à de um estudo inexistente | privacidade dos dados da pesquisa | `src/lib/estudos.ts` (`estudoDoPesquisador`) | e2e estudos: "outro pesquisador não vê o estudo pelo endereço"; e2e exportacao |

## Pesquisador: painel de resultados

| Decisão | Princípio | Onde está | Evidência |
|---|---|---|---|
| Leitura rápida escrita no topo, e a interpretação ao lado de cada número ("neutra · Abaixo da média") | Nielsen 6, Shneiderman 8 | `src/lib/leitura-rapida.ts`, `resultados/VisaoUmaVersao.tsx` | e2e resultados: "mostra os números do módulo UEQ…" |
| Gráfico com descrição em texto e tabela equivalente logo abaixo | WCAG 1.1.1 e 1.3.1 | `src/graficos/EscalasComBenchmark.tsx`, `VisaoUmaVersao.tsx` | e2e resultados (axe); manual: leitor de tela |
| Versões distinguidas por forma (círculo cheio, vazado…), não só por cor | WCAG 1.4.1 | `EscalasComBenchmark.tsx` | e2e resultados: "gráficos com daltonismo simulado e alto contraste" |
| Escalas agrupadas em Atratividade, Pragmática e Hedônica | Gestalt (proximidade, região comum), modelo conceitual do UEQ | `EscalasComBenchmark.tsx` | e2e resultados |
| Cada termo técnico (benchmark, IC95, alfa) explicado perto, em `<details>` | Nielsen 10, revelação progressiva | `resultados/Explicacoes.tsx` | manual |
| Os avisos de alfa baixo e de amostra pequena dizem o que significam e o que fazer | Nielsen 9 | `VisaoUmaVersao.tsx` | e2e resultados: "com uma resposta só avisa que não há intervalo de confiança" |
| Versão, modo e ordem dos itens ficam na URL: voltar, recarregar e compartilhar funcionam | Nielsen 3 | `resultados/ControlesResultados.tsx` | e2e resultados: "…guarda versão e modo na URL" |
| Trocar a versão não tira o foco do seletor | WCAG 3.2.2 | `ControlesResultados.tsx` | manual: teclado |
| Em tela estreita a tabela rola dentro de uma região focável, e a página não rola | WCAG 1.4.10 e 2.1.1 | `VisaoUmaVersao.tsx`, `VisaoComparacao.tsx` | e2e resultados: "em 320 px o painel não rola na horizontal, nos dois modos" |
| Painel em PDF com a mesma seleção da tela, cabeçalho com título, n e data de geração, gráficos em vetor, A4 com margens de 18 mm | Nielsen 4, §4.4 | `resultados/impressao/`, `src/app/api/estudos/[id]/painel-pdf/route.ts` | e2e painel-pdf |

## Pesquisador: respostas, exportação e importação

| Decisão | Princípio | Onde está | Evidência |
|---|---|---|---|
| Panorama de quantas participações estão dentro e fora da análise | Nielsen 1 | `estudos/[id]/respostas/page.tsx` | e2e respostas |
| Excluir da análise só tira do cálculo, nunca apaga, e dá para desfazer | Shneiderman 6, docs/ueq-protocolo.md §7 | `respostas/acoes.ts` | e2e respostas: "incluir e excluir uma participação avisa e nunca apaga" |
| A regra de suspeita e os limiares ficam visíveis ao lado da lista | Nielsen 6 e 10 | `respostas/page.tsx` | e2e respostas: "a fixture inconsistente sai com as 4 suspeitas da equipe…" |
| O filtro "Mostrar só suspeitas" fica na URL | Nielsen 3 | `respostas/TabelaParticipacoes.tsx` | e2e respostas |
| Cada exportação diz o formato, o conteúdo e o uso, com nome legível e datado, e baixa sem abrir aba nova | §4.4, Nielsen 2 | `resultados/SecaoExportar.tsx`, `src/app/api/estudos/[id]/exportar/[tipo]/route.ts` | e2e exportacao: "baixa as 4 exportações com nome datado, BOM e o formato de cada uma" |
| Importar CSV em dois passos: prévia das 5 primeiras linhas ou o problema de cada linha, depois a confirmação. Só grava com o arquivo inteiro válido | Nielsen 5 e 9, Shneiderman 4 e 5 | `respostas/importar/`, `src/lib/importacao.ts` | e2e importacao; unit `src/lib/__tests__/importacao.test.ts` |
| As respostas importadas ficam marcadas e sem idioma, porque o CSV não diz o idioma (nada é inventado) | Nielsen 1, integridade do dado | `TabelaParticipacoes.tsx`, `src/lib/exportacoes.ts` | e2e importacao; unit `exportacoes.test.ts` |
| A subpágina (Respostas › Importar) mantém a aba de origem marcada | Nielsen 1, WCAG 2.4.8 (localização) | `estudos/[id]/AbasEstudo.tsx` | e2e importacao |

## Em toda a ferramenta

| Decisão | Princípio | Onde está | Evidência |
|---|---|---|---|
| Link "Pular para o conteúdo" como primeiro Tab | WCAG 2.4.1 | `src/app/(ferramenta)/layout.tsx`, `src/app/r/[slug]/layout.tsx` | e2e inicial: "o primeiro Tab leva ao link de pular para o conteúdo" |
| Título de página único e descritivo ("Questionário · <estudo>") | WCAG 2.4.2 | `generateMetadata` de cada página | e2e (toHaveTitle em vários testes) |
| Cores em tokens, com contraste conferido por teste | WCAG 1.4.3 e 1.4.11 | `src/styles/tokens.css` | unit `src/styles/__tests__/contraste.test.ts` |
| Mesmo padrão de botão, campo, tabela e mensagem em todas as telas | Nielsen 4, Shneiderman 1 | `src/componentes/formulario/`, `src/styles/` | revisão visual (prompt 09) |
| Telas iguais ao protótipo de alta fidelidade | consistência com o projeto avaliado | `docs/prototipos/alta-fidelidade/` | revisão visual (prompt 09) |

## O que nenhum teste automático cobre

Estes pontos ficam para a revisão manual (`docs/checklist-manual.md` e `docs/roteiro-revisao.md`):

- uso real com leitor de tela (NVDA, VoiceOver, TalkBack) do começo ao fim;
- zoom de 200% e 400% num celular real, e o polegar nos círculos;
- espaçamento de texto aumentado (WCAG 1.4.12) e `prefers-reduced-motion`;
- a qualidade das traduções das telas do participante (`docs/idiomas.md`);
- a compreensão do painel por quem não conhece o UEQ.

As telas sem protótipo também ficam para essa revisão: o seletor de idioma, Importar respostas e o painel em PDF.
