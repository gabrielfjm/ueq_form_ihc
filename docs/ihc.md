# Fundamentos de IHC aplicados à ferramenta

Este arquivo transforma a literatura de IHC em requisitos verificáveis. Toda decisão de interface tem que ser rastreável até um princípio daqui. Quando o Claude Code implementar uma tela, ele confere a seção "Requisitos por tela" e a "Checklist WCAG" antes de dar a tarefa como pronta.

Meta de conformidade: **WCAG 2.2 nível AA** (W3C, 2023), que é também a base da **ABNT NBR 17225:2025** (acessibilidade em conteúdo e aplicações web). A Lei Brasileira de Inclusão (Lei 13.146/2015, art. 63) torna acessibilidade de sites obrigatória no Brasil.

## 1. Base teórica usada

| Referência | O que tiramos dela |
|---|---|
| ISO 9241-11:2018 | Definição de usabilidade: eficácia, eficiência e satisfação para usuários específicos, com objetivos específicos, em um contexto de uso específico. Por isso a seção 2 define usuários e contextos antes de qualquer tela |
| ISO 9241-110:2020 | 7 princípios de interação: adequação à tarefa, autodescrição, conformidade com as expectativas, facilidade de aprendizado, controlabilidade, robustez ao erro de uso, engajamento |
| Nielsen (1994), 10 heurísticas | Checklist de avaliação heurística usada no comando /revisar-ihc |
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
- Aluno de pós ou pesquisador, conhece UX mas não necessariamente estatística a fundo
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
7. **Desistir é fácil e explícito** (ética em pesquisa com humanos). Link "Sair sem enviar" sempre disponível, com confirmação em linha, e nada é gravado em Resposta antes do envio
8. **Anonimato real.** Não coletar IP, nome ou e-mail. Demografia só em faixas e sempre com "Prefiro não responder"

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
| Página com `lang="pt-BR"`, `<title>` por etapa ("Consentimento · Estudo X", "Questionário · Estudo X") | Idioma (3.1.1), página com título (2.4.2) |
| Uma única ação principal por página (Concordo / Enviar respostas) | Lei de Hick, design minimalista (Nielsen 8) |
| Etapas claras: Consentimento → Questionário → Dados opcionais → Fim, com indicação textual da etapa atual | Diálogos com fechamento (Shneiderman 4) |

### 4.2 Telas do pesquisador

| Requisito | Princípio |
|---|---|
| Link "Pular para o conteúdo" como primeiro elemento focável | Ignorar blocos (2.4.1) |
| Uma hierarquia de títulos real (um `h1` por página, `h2` por seção) | Cabeçalhos e rótulos (2.4.6), 1.3.1 |
| Formulários: rótulo visível acima do campo, ligado por `for`/`id`, `autocomplete` correto (`email`, `current-password`, `new-password`, `name`) | 1.3.5, 3.3.2 |
| Login aceita colar senha e gerenciador de senhas. Botão "Mostrar senha" | Autenticação acessível (3.3.8) |
| Ao criar estudo, não pedir de novo o que já foi dito (nome do produto vira sugestão do nome da primeira versão) | Entrada redundante (3.3.7) |
| Excluir estudo: confirmação digitando o título, mostrando quantas respostas serão perdidas. Encerrar coleta é reversível (Reabrir) | Prevenção de erros (Nielsen 5, WCAG 3.3.4), reversão fácil (Shneiderman 6) |
| Toda ação dá retorno visível e anunciado: "Coleta aberta. O link já aceita respostas." em região `role="status"` | Feedback (Norman, Shneiderman 3), 4.1.3 |
| Status do estudo escrito, sempre no mesmo lugar, com a consequência ("Aberto · aceitando respostas") | Visibilidade do status (Nielsen 1) |
| Termos do UEQ com nome oficial e uma explicação curta acessível por `<details>` ("O que é Perspicuidade?") | Correspondência com o mundo real (Nielsen 2), ajuda e documentação (Nielsen 10), revelação progressiva |
| Mesmo padrão de botão, tabela e mensagem em todas as telas | Consistência (Nielsen 4, Shneiderman 1) |
| Nenhuma informação depende de hover. Se houver tooltip, ele abre também no foco, pode ser fechado com Esc e não some ao mover o mouse para cima dele | Conteúdo em hover ou foco (1.4.13), reconhecer em vez de lembrar (Nielsen 6) |

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

### 4.4 Exportação
- Cada link de exportação diz o formato, o conteúdo e para que serve. Download não abre em nova aba sem avisar
- Nome de arquivo legível e datado

## 5. Checklist WCAG 2.2 AA (critérios mais relevantes aqui)

Perceptível
- [ ] 1.1.1 Gráficos e ícones com alternativa em texto
- [ ] 1.3.1 Estrutura semântica: fieldset/legend, th com scope, listas, títulos
- [ ] 1.3.2 Ordem de leitura do DOM igual à ordem visual
- [ ] 1.3.5 `autocomplete` nos campos de dados pessoais
- [ ] 1.4.1 Nada comunicado só por cor
- [ ] 1.4.3 Texto ≥ 4.5:1 (≥ 3:1 se ≥ 24 px ou 18.66 px bold)
- [ ] 1.4.4 Zoom de 200% sem perda
- [ ] 1.4.10 Refluxo em 320 px
- [ ] 1.4.11 Bordas de campo, círculos do questionário, foco e marcadores de gráfico ≥ 3:1
- [ ] 1.4.12 Layout aguenta espaçamento de texto aumentado (line-height 1.5, letter-spacing 0.12em)
- [ ] 1.4.13 Conteúdo em hover/foco dispensável, persistente e hoverable

Operável
- [ ] 2.1.1 / 2.1.2 Tudo por teclado, sem armadilha
- [ ] 2.2.1 Sem limite de tempo
- [ ] 2.4.1 Link de pular conteúdo
- [ ] 2.4.2 Título de página único e descritivo
- [ ] 2.4.3 Ordem de foco lógica (após erro, foco no resumo de erros)
- [ ] 2.4.6 Títulos e rótulos descritivos
- [ ] 2.4.7 Foco visível
- [ ] 2.4.11 Foco nunca coberto pelo rodapé fixo ou por cabeçalho fixo
- [ ] 2.5.3 Nome acessível contém o texto visível do botão
- [ ] 2.5.8 Alvos ≥ 24×24 px (nosso padrão é 44 px no questionário)

Compreensível
- [ ] 3.1.1 `lang="pt-BR"`
- [ ] 3.2.1 / 3.2.2 Foco e entrada não mudam contexto sozinhos
- [ ] 3.2.3 / 3.2.4 Navegação e componentes consistentes
- [ ] 3.3.1 / 3.3.3 Erro identificado em texto, com sugestão
- [ ] 3.3.2 Rótulos visíveis
- [ ] 3.3.4 Ações destrutivas confirmadas ou reversíveis
- [ ] 3.3.7 Não pedir a mesma informação duas vezes
- [ ] 3.3.8 Login sem teste cognitivo, colar senha permitido

Robusto
- [ ] 4.1.2 Componentes nativos sempre que existirem. ARIA só onde o HTML não resolve
- [ ] 4.1.3 Mensagens de status em `role="status"` ou `aria-live`

Extra (além do AA, baratos e coerentes com IHC)
- [ ] `prefers-reduced-motion` respeitado
- [ ] `forced-colors: active` (alto contraste do Windows) testado: círculos, foco e gráficos continuam visíveis
- [ ] `prefers-color-scheme: dark` com tema escuro equivalente (opcional, não padrão)
- [ ] Linguagem simples no questionário (frases curtas, voz ativa, sem jargão)

## 6. Como verificar (automação não basta)

Ferramentas automáticas pegam só uma parte dos problemas de acessibilidade. Por isso:

1. **Automático (Claude Code):** axe-core no Playwright, Lighthouse, teste de contraste dos tokens, teste e2e só de teclado
2. **Manual (equipe):** `docs/checklist-manual.md`, com leitor de tela, zoom, celular real e simulação de daltonismo
3. **Avaliação heurística (equipe):** os três avaliam separados com as 10 heurísticas de Nielsen, depois consolidam com severidade de 0 a 4. O comando /revisar-ihc faz uma primeira passada, mas não substitui os avaliadores humanos
4. **Teste com usuários:** 5 participantes externos ao trio respondem um estudo real na ferramenta (tarefa do participante) e 2 a 3 colegas fazem o papel de pesquisador (criar estudo, interpretar o painel, exportar). Pensamento em voz alta, taxa de sucesso, tempo e erros. Ao final, os pesquisadores avaliam a própria ferramenta **com o UEQ, aplicado pela ferramenta**. Isso fecha o ciclo e vira o melhor slide da apresentação

## 7. Referências

- ABNT. NBR 17225:2025. Acessibilidade em conteúdo e aplicações web: requisitos. 2025.
- BRASIL. Lei nº 13.146, de 6 de julho de 2015 (Lei Brasileira de Inclusão). Art. 63.
- BRASIL. eMAG: Modelo de Acessibilidade em Governo Eletrônico, versão 3.1.
- ISO 9241-11:2018. Ergonomics of human-system interaction: Usability: Definitions and concepts.
- ISO 9241-110:2020. Ergonomics of human-system interaction: Interaction principles.
- NIELSEN, J. Enhancing the explanatory power of usability heuristics. CHI 1994.
- NORMAN, D. The Design of Everyday Things. Revised and expanded edition. Basic Books, 2013.
- SHNEIDERMAN, B. et al. Designing the User Interface. 6th ed. Pearson, 2016.
- W3C. Web Content Accessibility Guidelines (WCAG) 2.2. 2023.
- LAUGWITZ, B.; HELD, T.; SCHREPP, M. Construction and evaluation of a user experience questionnaire. USAB 2008.
- SCHREPP, M. User Experience Questionnaire Handbook. ueq-online.org.
