# Fundamentos de IHC aplicados à ferramenta

Este arquivo transforma a literatura de IHC em requisitos verificáveis. Toda decisão de interface tem que ser rastreável até um princípio daqui. Quem implementa uma tela confere a seção "Requisitos por tela" e a "Checklist WCAG" antes de dar a tarefa como pronta. A ligação de cada decisão com o código e com os testes está em [decisões de interface](rastreabilidade-ihc.md).

Meta de conformidade: **WCAG 2.2 nível AA** (W3C, 2023), que é também a base da **ABNT NBR 17225:2025** (acessibilidade em conteúdo e aplicações web). A Lei Brasileira de Inclusão (Lei 13.146/2015, art. 63) torna acessibilidade de sites obrigatória no Brasil.

## 1. Base teórica usada

| Referência | O que tiramos dela |
|---|---|
| ISO 9241-11:2018 | Definição de usabilidade: eficácia, eficiência e satisfação para usuários específicos, com objetivos específicos, em um contexto de uso específico. Por isso a seção 2 define usuários e contextos antes de qualquer tela |
| ISO 9241-110:2020 | 7 princípios de interação: adequação à tarefa, autodescrição, conformidade com as expectativas, facilidade de aprendizado, controlabilidade, robustez ao erro de uso, engajamento |
| Nielsen (1994), 10 heurísticas | Checklist da avaliação heurística feita pela equipe |
| Shneiderman et al., 8 regras de ouro | Consistência, usabilidade universal, feedback informativo, diálogos com fechamento, prevenção de erros, reversão fácil, controle do usuário, redução da carga de memória |
| Norman (2013) | Affordances e significantes, mapeamento natural, feedback, restrições, modelo conceitual |
| Lei de Fitts | Alvos importantes grandes e perto de onde o olhar e o cursor já estão |
| Lei de Hick-Hyman | Poucas opções por decisão. Uma ação principal por tela |
| Gestalt (proximidade, similaridade, região comum) | Agrupamento visual das escalas UEQ por construto, rótulo perto do campo |
| WCAG 2.2 / NBR 17225 / eMAG | Requisitos de acessibilidade testáveis (seção 5) |
| Laugwitz, Held e Schrepp (2008) e UEQ Handbook | Formato do diferencial semântico, instrução oficial, ordem fixa dos itens |

## 2. Usuários e contexto de uso (ISO 9241-11)

**Participante**
- Qualquer pessoa adulta. Pode ter baixa familiaridade digital, baixa visão, daltonismo, usar leitor de tela (NVDA, VoiceOver, TalkBack), navegar só por teclado, usar zoom de 200% ou mais
- Acessa pelo celular com frequência (link recebido por WhatsApp ou e-mail)
- Não tem conta e não tem motivação intrínseca: qualquer atrito vira abandono
- Objetivo: responder rápido (3 a 5 minutos) e sair
- Medida de sucesso: taxa de conclusão alta, nenhum item esquecido, tempo próximo ao previsto pelo handbook

**Pesquisador**
- Aluno de pós ou pesquisador, conhece UX mas não necessariamente estatística a fundo. Pode trabalhar em equipe e ler a ferramenta em qualquer um dos 37 idiomas
- Usa desktop, em sessões curtas e repetidas (abre o painel várias vezes durante a coleta)
- Objetivo: montar o estudo sem erro, acompanhar a coleta, entender o resultado e exportar para o relatório
- Medida de sucesso: cria um estudo completo sem ajuda, interpreta corretamente o painel, confere os números com a planilha oficial

## 3. O questionário como instrumento de medida

Aqui IHC encontra metodologia de pesquisa. Qualquer viés de interface contamina o dado.

1. **Nenhuma opção pré-selecionada.** Valor padrão gera ancoragem e respostas não intencionais
2. **As 7 posições têm peso visual idêntico.** Mesmo tamanho, mesma cor, mesmo espaçamento. Sem cor graduada (vermelho → verde), sem número, sem rótulo intermediário, sem a posição central destacada. Isso preserva o formato do diferencial semântico validado
3. **Ordem e polaridade oficiais, sempre.** Alternância de polos é proposital no UEQ para reduzir aquiescência. A interface nunca "arruma" os polos
4. **Instrução oficial do UEQ** no topo, em linguagem do pacote de idiomas
5. **Layout idêntico para os 26 itens.** Mudança de layout entre itens muda a resposta
6. **O participante nunca vê resultados** nem a média de outros participantes
7. **Desistir é fácil e explícito** (ética em pesquisa com humanos). Link "Sair sem enviar" sempre disponível, com confirmação numa janela, e nada é gravado em Resposta antes do envio
8. **Anonimato real.** Não coletar IP, nome ou e-mail. Demografia só em faixas, sempre com "Prefiro não responder", e a etapa inteira só existe se o pesquisador ligar a coleta no estudo

## 4. Requisitos por tela, com o princípio que justifica

Formato: requisito → princípio (fonte).

### 4.1 Questionário do participante

| Requisito | Princípio |
|---|---|
| Cada item é um `<fieldset>` com `<legend>` contendo os dois termos ("Item 4 de 26: de fácil aprendizagem ou de difícil aprendizagem"). As 7 opções são `<input type="radio">` nativos estilizados, não `div` com onClick | Nome, função e valor (WCAG 4.1.2), informação e relações (1.3.1), significantes (Norman) |
| Cada rádio tem nome acessível com a posição e o polo mais próximo ("3 de 7, mais perto de fácil aprendizagem"). Posição 4: "4 de 7, centro" | Rótulos ou instruções (3.3.2), autodescrição (ISO 9241-110) |
| Área clicável de cada círculo ≥ 44×44 px, mesmo que o círculo desenhado seja menor. Distância entre alvos que evite toque no vizinho | Tamanho do alvo (WCAG 2.5.8 pede 24 px, usamos 44 px da Apple HIG/WCAG AAA 2.5.5), Lei de Fitts |
| Termos clicáveis também: clicar no termo esquerdo não marca nada (evita resposta acidental), mas os termos ficam perto dos extremos | Mapeamento natural (Norman), prevenção de erros (Nielsen 5) |
| Marcar uma opção não muda o foco nem rola a página sozinha | Em entrada (WCAG 3.2.2), controle do usuário (Shneiderman 7) |
| Teclado: Tab entra no grupo, setas mudam a opção (comportamento nativo do radio), Tab sai para o próximo item. Sem atalhos de tecla única que conflitem com leitor de tela | Teclado (2.1.1), sem armadilha (2.1.2), conformidade com expectativas (ISO 9241-110) |
| Progresso "14 de 26 respondidos" atualizado a cada marcação e anunciado com `aria-live="polite"` só a cada 5 itens e ao completar (para não poluir o leitor de tela) | Visibilidade do status (Nielsen 1), mensagens de status (4.1.3) |
| Rodapé fixo de progresso nunca cobre o item em foco: `scroll-padding-bottom` igual à altura do rodapé | Foco não obscurecido (WCAG 2.4.11) |
| Validação só no envio, não a cada item. Erro: resumo no topo com link para cada item faltando ("Faltam 2 itens: 7 e 19"), foco vai para o resumo, cada item faltando ganha borda e texto "Este item não foi respondido" (não só cor) | Identificação de erro (3.3.1), sugestão (3.3.3), uso de cor (1.4.1), Nielsen 9 |
| Respostas salvas no sessionStorage enquanto responde | Robustez ao erro de uso (ISO 9241-110), Shneiderman 6 |
| Sem tempo limite | Tempo ajustável (2.2.1) |
| Em 320 px de largura e com zoom de 400% nada corta nem exige rolagem horizontal. No celular os termos vão para cima dos círculos | Refluxo (1.4.10), redimensionar texto (1.4.4) |
| Página com o `lang` e o `dir` do idioma escolhido, `<title>` por etapa ("Consentimento · Estudo X", "Questionário · Estudo X") | Idioma (3.1.1), página com título (2.4.2) |
| Uma única ação principal por página (Concordo / Enviar respostas) | Lei de Hick, design minimalista (Nielsen 8) |
| O termo de consentimento tem link para a política de privacidade, numa página dentro do link do participante, sem caminho para o resto da ferramenta. O questionário em si não tem esse link, para não acrescentar nada ao instrumento | Transparência (LGPD, art. 9º), ética em pesquisa, §3 |
| Etapas claras: Consentimento → Questionário → Dados opcionais → Fim, com indicação textual da etapa atual | Diálogos com fechamento (Shneiderman 4) |
| O termo diz o tempo e que não há limite, como desistir, o que acontece depois de enviar, quanto tempo os dados ficam guardados, riscos, benefícios e quem responde pela pesquisa. O questionário repete o tempo acima da instrução | Visibilidade do status (Nielsen 1), LGPD art. 9º |
| Menores de 18 anos só participam confirmando a autorização do responsável | LGPD art. 14 |

### 4.2 Telas do pesquisador

| Requisito | Princípio |
|---|---|
| Link "Pular para o conteúdo" como primeiro elemento focável | Ignorar blocos (2.4.1) |
| Uma hierarquia de títulos real (um `h1` por página, `h2` por seção) | Cabeçalhos e rótulos (2.4.6), 1.3.1 |
| Formulários: rótulo visível acima do campo, ligado por `for`/`id`, `autocomplete` correto (`email`, `current-password`, `new-password`, `name`) | 1.3.5, 3.3.2 |
| Login aceita colar senha e gerenciador de senhas. Botão "Mostrar senha" | Autenticação acessível (3.3.8) |
| Ao criar estudo, não pedir de novo o que já foi dito (nome do produto vira sugestão do nome da primeira versão) | Entrada redundante (3.3.7) |
| Excluir estudo: confirmação digitando o título, mostrando quantas respostas serão perdidas. Encerrar coleta é reversível (Reabrir) | Prevenção de erros (Nielsen 5, WCAG 3.3.4), reversão fácil (Shneiderman 6) |
| Sair e toda exclusão confirmam numa janela (`<dialog>` nativo) que diz o que vai acontecer, com Cancelar ao lado. Foco preso dentro, Esc fecha sem fazer nada e o foco volta para quem abriu | Prevenção de erros (Nielsen 5), controle do usuário (Nielsen 3), 2.1.2, 2.4.3, 3.3.4 |
| Entrar e Criar conta abrem numa janela sobre a página atual, sem perder o lugar, e cabem na tela sem rolar | Controle do usuário (Nielsen 3), carga de memória (Shneiderman 8), 1.4.10 |
| Toda ação dá retorno visível e anunciado: "Coleta aberta. O link já aceita respostas." em região `role="status"`, que acompanha a rolagem e fica até a pessoa fechar | Feedback (Norman, Shneiderman 3), 4.1.3, 2.2.1 |
| Enquanto a ação roda, o botão diz o que está acontecendo e bloqueia novos cliques, para nada ser enviado duas vezes | Visibilidade do status (Nielsen 1), prevenção de erros (Nielsen 5), 4.1.3 |
| Status do estudo escrito, sempre no mesmo lugar, com a consequência ("Aberto · aceitando respostas") | Visibilidade do status (Nielsen 1) |
| Termos do UEQ com nome oficial e uma explicação curta acessível por `<details>` ("O que é Perspicuidade?") | Correspondência com o mundo real (Nielsen 2), ajuda e documentação (Nielsen 10), revelação progressiva |
| Mesmo padrão de botão, tabela e mensagem em todas as telas | Consistência (Nielsen 4, Shneiderman 1) |
| Nenhuma informação depende de hover. Se houver tooltip, ele abre também no foco, pode ser fechado com Esc e não some ao mover o mouse para cima dele | Conteúdo em hover ou foco (1.4.13), reconhecer em vez de lembrar (Nielsen 6) |

| Ajuda (?) em toda página do pesquisador: para que serve a página e o que dá para fazer nela | Ajuda e documentação (Nielsen 10), autodescrição (ISO 9241-110) |
| Tour no primeiro acesso, feito nas telas reais, que pode ser pulado, fechado e revisto | Facilidade de aprendizado (ISO 9241-110), controle do usuário (Nielsen 3), Nielsen 10 |
| Sino com as não lidas em número e texto, agrupando respostas enquanto o aviso não é lido. O aviso também pode ir por e-mail, e isso se desliga em Minha conta | Visibilidade do status (Nielsen 1), carga de memória (Shneiderman 8), controle do usuário (Shneiderman 7) |
| Compartilhar diz o que cada papel pode fazer (Editor, Leitor) antes do convite. Quem não pode fazer uma ação não vê o botão dela | Prevenção de erros (Nielsen 5), design minimalista (Nielsen 8) |
| Administração e Minha conta como painéis: cada opção diz a situação atual e leva a uma página própria | Reconhecer em vez de lembrar (Nielsen 6), Lei de Hick, revelação progressiva |
| Política de privacidade a um clique: nas janelas de acesso, na página inicial, em Minha conta e na ajuda. O "Voltar" diz para onde vai e a política abre em outra aba quando há formulário preenchido | Controle do usuário (Nielsen 3), Shneiderman 7, transparência (LGPD, art. 9º) |
| Interface no idioma da conta, escolhido ao criar a conta e trocado em Minha conta. `lang` e `dir` acompanham o idioma em que a tela de fato sai | Usabilidade universal (Shneiderman 2), 3.1.1 |

A documentação segue o mesmo princípio de carga: documento longo abre como índice, cada seção em página própria com Voltar e Anterior/Próxima, e o diagrama cabendo na tela (revelação progressiva, Nielsen 3 e 8, WCAG 2.4.5 e 2.4.8).

### 4.3 Painel de resultados e gráficos

| Requisito | Princípio |
|---|---|
| Todo gráfico tem `role="img"`, `<title>` e `<desc>` com a leitura em texto ("Atratividade: média 1,42, IC de 1,10 a 1,74, faixa Bom") e uma tabela equivalente visível logo abaixo | Conteúdo não textual (1.1.1), 1.3.1 |
| Escalas distinguidas por forma e posição, não só por cor. Versões na comparação: círculo cheio, círculo vazado, quadrado, além da cor | Uso de cor (1.4.1), testado com simulação de daltonismo |
| Marcadores e linhas do gráfico com contraste ≥ 3:1 contra o fundo e contra as faixas do benchmark | Contraste não textual (1.4.11) |
| Faixas do benchmark com rótulo em texto, não só tom de fundo | 1.4.1 |
| Escalas agrupadas em Atratividade / Pragmática / Hedônica com espaço e rótulo de grupo | Gestalt (proximidade, região comum), modelo conceitual do UEQ |
| A interpretação vem escrita ao lado do número ("positiva", "Bom no benchmark"). O pesquisador não precisa lembrar os limiares | Reconhecer em vez de lembrar (Nielsen 6), Shneiderman 8 |
| Alerta de alfa baixo e de amostra pequena explicam o que significa e o que fazer | Nielsen 9 e 10 |
| Filtros e modo de comparação refletidos na URL (dá para voltar, recarregar e compartilhar) | Controle e liberdade (Nielsen 3) |
| Excluir respostas da análise é desfazível e o painel mostra quantas estão fora | Shneiderman 6, Nielsen 1 |
| Dados demográficos em sub-aba própria de Resultados, cada pergunta com o gráfico que combina com ela, e a tabela de números em "Ver os números" | Gestalt, 1.1.1, revelação progressiva |

### 4.4 Exportação
- Cada link de exportação diz o formato, o conteúdo e para que serve. Download não abre em nova aba sem avisar
- Nome de arquivo legível e datado

## 5. Checklist WCAG 2.2 AA (critérios mais relevantes aqui)

A tabela diz como a ferramenta atende a cada critério e o que comprova. O axe-core roda em toda tela e em cada estado de erro dos testes de ponta a ponta; o que ele não alcança está nos casos manuais ([checklist manual](checklist-manual.md)).

### Perceptível

| Critério | Como a ferramenta atende | Evidência |
|---|---|---|
| 1.1.1 Gráficos e ícones com alternativa em texto | Todo gráfico tem descrição e uma tabela visível com os mesmos números; ícones decorativos ficam fora da árvore de acessibilidade | [CT-E29](documentacao/casos-de-teste.md#ct-e29), [CT-M05](documentacao/casos-de-teste.md#ct-m05) |
| 1.3.1 Estrutura semântica | Cada item do questionário é um `fieldset` com `legend`; tabelas com `th` e `scope`; títulos em ordem | [CT-E24](documentacao/casos-de-teste.md#ct-e24), [CT-E21](documentacao/casos-de-teste.md#ct-e21) e o axe-core em toda tela |
| 1.3.2 Ordem de leitura igual à ordem visual | O DOM segue a ordem da tela, também da direita para a esquerda | [CT-E22](documentacao/casos-de-teste.md#ct-e22), [CT-E46](documentacao/casos-de-teste.md#ct-e46), [CT-M07](documentacao/casos-de-teste.md#ct-m07) |
| 1.3.5 `autocomplete` nos dados pessoais | Nome, e-mail e senha têm `autocomplete` em Criar conta, Entrar, Minha conta e no formulário do estudo | axe-core em [CT-E06](documentacao/casos-de-teste.md#ct-e06), [CT-E09](documentacao/casos-de-teste.md#ct-e09) |
| 1.4.1 Nada comunicado só por cor | Status, faixas e versões têm texto, forma ou padrão além da cor | [CT-E32](documentacao/casos-de-teste.md#ct-e32), [CT-M09](documentacao/casos-de-teste.md#ct-m09) |
| 1.4.3 Contraste de texto ≥ 4,5:1 | Cada par de cor de texto do tema é medido | [CT-U51](documentacao/casos-de-teste.md#ct-u51) |
| 1.4.4 Zoom de 200% sem perda | As telas usam unidades relativas e reflowam | [CT-M08](documentacao/casos-de-teste.md#ct-m08) |
| 1.4.10 Refluxo em 320 px | Nenhuma tela rola na horizontal em 320 px | [CT-E25](documentacao/casos-de-teste.md#ct-e25), [CT-E31](documentacao/casos-de-teste.md#ct-e31), [CT-E36](documentacao/casos-de-teste.md#ct-e36), [CT-E44](documentacao/casos-de-teste.md#ct-e44), [CT-E50](documentacao/casos-de-teste.md#ct-e50), [CT-E75](documentacao/casos-de-teste.md#ct-e75) |
| 1.4.11 Contraste de elementos ≥ 3:1 | Bordas de campo, círculos, foco e marcadores de gráfico são medidos contra os fundos | [CT-U52](documentacao/casos-de-teste.md#ct-u52) |
| 1.4.12 Espaçamento de texto | O layout aguenta line-height 1,5 e letter-spacing 0,12em | [CT-M11](documentacao/casos-de-teste.md#ct-m11) |
| 1.4.13 Conteúdo em hover ou foco | As explicações dos termos abrem por clique (`details`), não por hover | [CT-M07](documentacao/casos-de-teste.md#ct-m07) |

### Operável

| Critério | Como a ferramenta atende | Evidência |
|---|---|---|
| 2.1.1 e 2.1.2 Teclado, sem armadilha | Todo fluxo funciona só com teclado; janelas prendem o foco e devolvem ao fechar | [CT-E03](documentacao/casos-de-teste.md#ct-e03), [CT-E22](documentacao/casos-de-teste.md#ct-e22), [CT-E55](documentacao/casos-de-teste.md#ct-e55), [CT-E58](documentacao/casos-de-teste.md#ct-e58), [CT-E64](documentacao/casos-de-teste.md#ct-e64), [CT-M07](documentacao/casos-de-teste.md#ct-m07) |
| 2.2.1 Sem limite de tempo | Nenhuma tela tem tempo; o questionário guarda o que foi marcado se a página recarregar | [CT-E26](documentacao/casos-de-teste.md#ct-e26) |
| 2.4.1 Pular conteúdo | "Pular para o conteúdo" é o primeiro elemento focável | [CT-E02](documentacao/casos-de-teste.md#ct-e02) |
| 2.4.2 Título de página | Cada página tem título próprio, do específico para o geral | [CT-E47](documentacao/casos-de-teste.md#ct-e47), [CT-E84](documentacao/casos-de-teste.md#ct-e84) |
| 2.4.3 Ordem de foco | Depois de um erro, o foco vai ao resumo, e cada link do resumo leva ao campo | [CT-E07](documentacao/casos-de-teste.md#ct-e07), [CT-E23](documentacao/casos-de-teste.md#ct-e23) |
| 2.4.6 Títulos e rótulos descritivos | Rótulos dizem o que pedem; títulos dizem o que a seção contém | axe-core em toda tela e [CT-M13](documentacao/casos-de-teste.md#ct-m13) |
| 2.4.7 Foco visível | Anel de foco com contraste de 3:1 em todo elemento | [CT-E22](documentacao/casos-de-teste.md#ct-e22), [CT-U52](documentacao/casos-de-teste.md#ct-u52) |
| 2.4.11 Foco não coberto | Barra superior e rodapé fixos nunca escondem o foco nem as âncoras | [CT-E54](documentacao/casos-de-teste.md#ct-e54) |
| 2.5.3 Nome contém o texto visível | O nome acessível de cada botão começa pelo texto que aparece nele | axe-core em toda tela |
| 2.5.8 Alvos ≥ 24 × 24 px | Cada círculo do questionário tem 44 × 44 px | [CT-M12](documentacao/casos-de-teste.md#ct-m12) |

### Compreensível

| Critério | Como a ferramenta atende | Evidência |
|---|---|---|
| 3.1.1 Idioma da página | `lang` e `dir` acompanham o idioma escolhido, também nos textos do estudo sem tradução | [CT-E45](documentacao/casos-de-teste.md#ct-e45), [CT-E46](documentacao/casos-de-teste.md#ct-e46), [CT-U48](documentacao/casos-de-teste.md#ct-u48) |
| 3.2.1 e 3.2.2 Sem mudança de contexto sozinha | Trocar o idioma só vale depois de "Aplicar"; nenhum campo envia ao mudar | [CT-E46](documentacao/casos-de-teste.md#ct-e46), [CT-E68](documentacao/casos-de-teste.md#ct-e68) |
| 3.2.3 e 3.2.4 Navegação consistente | A mesma barra e os mesmos componentes em todas as telas | [CT-E53](documentacao/casos-de-teste.md#ct-e53), [CT-M18](documentacao/casos-de-teste.md#ct-m18) |
| 3.3.1 e 3.3.3 Erro em texto, com sugestão | Cada erro diz o que aconteceu e o que fazer, no resumo e no campo | [CT-E06](documentacao/casos-de-teste.md#ct-e06), [CT-E14](documentacao/casos-de-teste.md#ct-e14), [CT-E23](documentacao/casos-de-teste.md#ct-e23), [CT-E43](documentacao/casos-de-teste.md#ct-e43) |
| 3.3.2 Rótulos visíveis | Todo campo tem rótulo visível acima dele | axe-core em toda tela |
| 3.3.4 Ações destrutivas confirmadas ou reversíveis | Sair e excluir pedem confirmação; tirar da análise é reversível | [CT-E11](documentacao/casos-de-teste.md#ct-e11), [CT-E19](documentacao/casos-de-teste.md#ct-e19), [CT-E27](documentacao/casos-de-teste.md#ct-e27), [CT-E34](documentacao/casos-de-teste.md#ct-e34) |
| 3.3.7 Não pedir a mesma informação duas vezes | O estudo novo vem com o responsável da conta e do último estudo | [CT-E93](documentacao/casos-de-teste.md#ct-e93) |
| 3.3.8 Login sem teste cognitivo | Sem captcha; colar a senha funciona e Mostrar senha alterna a visibilidade | [CT-E08](documentacao/casos-de-teste.md#ct-e08) |

### Robusto

| Critério | Como a ferramenta atende | Evidência |
|---|---|---|
| 4.1.2 Componentes nativos | Rádios, botões, `details` e `dialog` nativos; ARIA só onde o HTML não resolve | [CT-E24](documentacao/casos-de-teste.md#ct-e24), [CT-E57](documentacao/casos-de-teste.md#ct-e57) |
| 4.1.3 Mensagens de status | Confirmações em `role="status"`, anunciadas sem mover o foco | [CT-E09](documentacao/casos-de-teste.md#ct-e09), [CT-E16](documentacao/casos-de-teste.md#ct-e16), [CT-M06](documentacao/casos-de-teste.md#ct-m06) |

### Além do AA

| Critério | Como a ferramenta atende | Evidência |
|---|---|---|
| `prefers-reduced-motion` | As transições somem quando o sistema pede menos movimento | `src/app/globals.css` |
| `forced-colors` (alto contraste do Windows) | Círculos, foco e gráficos continuam visíveis | [CT-E32](documentacao/casos-de-teste.md#ct-e32), [CT-M10](documentacao/casos-de-teste.md#ct-m10) |
| Tema escuro | Não tem: a identidade visual é de instrumento de laboratório, em fundo claro ([Identidade visual](design.md)) | — |
| Linguagem simples no questionário | Frases curtas, voz ativa, sem jargão | [CT-M13](documentacao/casos-de-teste.md#ct-m13), [CT-M14](documentacao/casos-de-teste.md#ct-m14) |

## 6. Como verificar (automação não basta)

Ferramentas automáticas pegam só uma parte dos problemas de acessibilidade. Por isso:

1. **Automático:** axe-core no Playwright em todas as telas e estados de erro, teste de contraste dos tokens, testes e2e só de teclado, em 320 px, com daltonismo simulado e com alto contraste
2. **Manual (equipe):** `docs/checklist-manual.md`, com leitor de tela, zoom, celular real e simulação de daltonismo
3. **Avaliação heurística (equipe):** os três avaliam separados com as 10 heurísticas de Nielsen, depois consolidam com severidade de 0 a 4
4. **Teste com usuários:** 5 participantes externos ao trio respondem um estudo real na ferramenta (tarefa do participante) e 2 a 3 colegas fazem o papel de pesquisador (criar estudo, interpretar o painel, exportar). Pensamento em voz alta, taxa de sucesso, tempo e erros. Ao final, os pesquisadores avaliam a própria ferramenta **com o UEQ, aplicado pela ferramenta**. Isso fecha o ciclo e vira o melhor slide da apresentação

## 7. Referências

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
