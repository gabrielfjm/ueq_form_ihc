# Identidade visual

## A ideia

A ferramenta tem cara de **instrumento de laboratório**, não de SaaS. Pense em formulário técnico, relatório bem diagramado, régua de medição. Fundo branco, tinta escura, linhas finas, tabelas, números alinhados. A única "decoração" é o próprio instrumento: a fileira de 7 marcações do diferencial semântico aparece como motivo visual (no logotipo, no indicador de progresso, nos estados vazios).

Teste de qualquer tela: **se um print dela pudesse ser de qualquer template de dashboard, refaça.**

## Proibido

Isso é o que entrega "feito por IA" na hora. Não usar em nenhuma tela:

- Fonte Inter, Geist, Poppins, Montserrat, Roboto ou a fonte padrão do sistema como fonte principal
- Gradientes de qualquer tipo, principalmente roxo/azul/rosa
- Glassmorphism, `backdrop-filter: blur`, brilho, neon, sombra colorida
- Sombras em card (`box-shadow` grande e difusa). Separação é feita com linha de 1px ou mudança de fundo
- `border-radius` acima de 4px. Nada de pílula, nada de `rounded-2xl`
- Grade de cards com ícone + título + número ("KPI cards") como abertura do painel
- Ícone decorativo: ao lado de título de seção, em itens de lista, em estado vazio. Ícone só aparece nas ações (ver "Ícones")
- Fundo creme, títulos em serifa e destaque terracota: virou a cara de interface gerada por IA (decisão da equipe em 22/10/2026)
- Fonte monoespaçada em números e datas e rótulos em versalete ou caixa-alta espaçada: mesma razão. A única exceção é o bloco de código dentro de um documento na aba Documentação (comandos, árvore de pastas), que é conteúdo e precisa das colunas alinhadas
- Emoji na interface, em mensagens, em toasts, em commits
- Hero centralizado com título enorme, subtítulo cinza e dois botões
- Texto com gradiente, texto "brilhando", animação de entrada em tudo (fade-up em lista)
- Skeleton com shimmer. Carregamento é texto simples ("Carregando respostas…") ou nada se for rápido
- Modo escuro como padrão
- Paleta semáforo (verde/amarelo/vermelho) para faixas de benchmark
- Microcopy de startup: "Oops!", "Tudo pronto! 🎉", "Vamos começar?", "Desbloqueie insights", "de forma simples e intuitiva", "potencialize"

## Cores

Definidas em `src/styles/tokens.css`. Nenhuma cor hexadecimal solta em componente.

```css
:root {
  --fundo:          #FFFFFF;  /* fundo geral, campos de formulário */
  --fundo-faixa:    #F3F5F7;  /* faixa de cabeçalho, áreas recuadas */
  --fundo-painel:   #F8FAFB;  /* ficha lateral, painel do gráfico */
  --tinta:          #0F1720;  /* texto principal, botões primários */
  --tinta-suave:    #46525E;  /* texto secundário */
  --tinta-fraca:    #5B6672;  /* legendas, rótulos de eixo. 5.4:1 na faixa */
  --linha:          #D5DBE1;  /* réguas e divisórias de tabela. NUNCA borda de campo */
  --borda-campo:    #7A8691;  /* borda de input, select, textarea. 3.4:1 na faixa (WCAG 1.4.11) */
  --linha-forte:    #0F1720;

  --destaque:       #0B6A78;  /* azul-petróleo. Foco, link, item ativo, numeração de seção. Usar pouco */
  --destaque-fundo: #E6F2F4;  /* hover de controles, mensagem de status */

  --alerta:         #B42318;  /* erro, ação destrutiva, alfa baixo, resposta suspeita. Sempre com texto */
  --alerta-fundo:   #FEF3F2;

  /* escalas UEQ, agrupadas pelo construto */
  --atratividade:   #0F1720;  /* impressão geral, na cor da tinta */
  --pragmatica:     #1D4E89;  /* perspicuidade, eficiência, confiabilidade */
  --hedonica:       #9A5B00;  /* estimulação, novidade. ≥ 3:1 inclusive sobre a faixa mais escura do benchmark */

  /* faixas de benchmark: cinza-azulado, do mais escuro (excelente) ao mais claro (ruim) */
  --bench-excelente: #C7D0D9;
  --bench-bom:       #D5DCE3;
  --bench-acima:     #E1E6EB;
  --bench-abaixo:    #EBEFF2;
  --bench-ruim:      #F4F6F8;
}
```

Contrastes conferidos (WCAG 2.2): tinta 18:1, tinta-suave 8:1, tinta-fraca 5,9:1, destaque 6,3:1 e alerta 6,6:1 no fundo branco. Sobre as faixas do benchmark, texto usa só `--tinta` ou `--tinta-suave` (≥ 5,1:1). Um teste automatizado (`src/styles/__tests__/contraste.test.ts`) recalcula esses pares a partir de tokens.css e falha se algum cair abaixo do mínimo.

Destaque e alerta têm papéis separados: o azul-petróleo indica onde o usuário está e o que é clicável; o vermelho indica problema ou ação que apaga dados. Nunca trocar um pelo outro.

Suporte também a `@media (forced-colors: active)`: círculos, foco e marcadores do gráfico usam `CanvasText`/`Highlight` para não sumirem no alto contraste do Windows.

Tudo neste arquivo está subordinado a `docs/ihc.md`. Se uma escolha estética conflitar com acessibilidade ou usabilidade, a de IHC vence.

Status de estudo é texto em negrito com um ponto de 10px antes, não badge colorido: ponto cheio em `--destaque` para aberto, vazado em `--tinta-fraca` para rascunho, cheio em `--tinta` para encerrado. O texto sempre diz o estado; o ponto só reforça.

## Tipografia

Google Fonts via `next/font`:

- **Atkinson Hyperlegible Next** em tudo: títulos (peso 700), texto de interface e questionário (peso 400). Foi desenhada pelo Braille Institute para legibilidade, o que é argumento de IHC por si só (vale citar na apresentação). Uma família só também reforça a consistência (Nielsen 4)
- **Source Sans 3** para números (tabelas, médias, IC, alfa, n, datas, contagens), via `var(--fonte-numero)`, com `font-variant-numeric: tabular-nums` e alinhados à direita nas tabelas. A Atkinson tem zero cortado e algarismos tabulares largos, que dão cara de código; a Source Sans tem algarismos comuns e compactos. Para números soltos no meio do texto ("60 anos ou mais") também saírem na Source Sans, declarar um `@font-face` com `unicode-range: U+0030-0039` apontando para ela antes da Atkinson na pilha de fontes. Sem fonte monoespaçada na interface

Escala (rem): 0.8125 · 0.9375 · 1.0625 · 1.25 · 1.625 · 2.25. Corpo em 1.0625rem, entrelinha 1.5. Títulos com `letter-spacing: -0.015em`. Rótulos de seção e de grupo em negrito, em tamanho menor e `--tinta-suave`, com caixa normal (nada de versalete nem caixa-alta espaçada).

## Layout

- Conteúdo alinhado à esquerda, largura máxima de leitura ~72ch, painéis de dados até 1120px
- Grid de 8px. Espaço vertical generoso entre seções (48 a 64px), apertado dentro de tabelas
- Navegação do pesquisador: barra superior fina com nome da ferramenta à esquerda e links com ícone e texto: Estudos, Criar estudo, Documentação, Administração (só para quem é administrador), Minha conta, o sino de notificações e Sair. Sem sidebar. Quem não entrou (página inicial e documentação) vê a mesma barra só com Documentação e Entrar (`log-in`); Criar conta (`user-plus`) fica na página inicial e dentro da janela de Entrar. O link do participante não tem barra nenhuma
- A barra fica fixa no topo durante toda a rolagem, no computador e no celular. Até 56rem de largura os links ficam atrás de um botão Menu (`menu`, e `x` quando aberto, sempre com o texto "Menu"), para a barra fixa ocupar uma linha só; o menu abre os links em coluna logo abaixo e fecha com Esc ou ao trocar de página. Em 320 px a fileira de marcações do logotipo sai da barra para o nome e o Menu caberem
- Tabelas são cidadãs de primeira classe: cabeçalho em negrito, linhas separadas por régua de 1px, números alinhados à direita
- Botão primário: fundo `--tinta`, texto `--fundo`, raio 2px, altura 40px. Secundário: borda 1px `--tinta`, fundo transparente. Ação destrutiva: texto `--alerta` sublinhado, que abre uma janela de confirmação (ver "Janelas")
- Foco visível sempre: `outline: 2px solid var(--destaque); outline-offset: 2px`
- Faixa de cabeçalho em `--fundo-faixa` no topo das páginas do estudo, com título, status, resumo e abas
- Telas largas do pesquisador usam duas colunas (conteúdo + ficha lateral) em vez de uma coluna estreita com a direita vazia
- Página inicial (`/`): apresenta a ferramenta e é a tela depois do login. Texto alinhado à esquerda com o item do questionário e uma prévia do resultado como figura, índice "Nesta página" e seções numeradas: O que é o UEQ, Como ler os resultados, Como funciona, Estudos sobre o método e Créditos. Sem hero centralizado
- Painéis de opções (Administração e Minha conta, protótipos r24 e r9): uma grade em que cada opção leva a uma página própria ou abre uma janela, com título, descrição e situação em uma linha, em vez de empilhar tudo numa tela só. O cartão inteiro responde ao clique, mas continua sendo uma lista com títulos para o leitor de tela
- Documentação em páginas (protótipos r36 a r38): documento longo abre como índice, "Neste documento", com o título e a primeira frase de cada seção, e a introdução longa fica recolhida. Cada seção abre em página própria: faixa curta com Voltar, a migalha, o título e "7 de 8", uma coluna só, o diagrama em destaque cabendo na tela, e Anterior e Próxima no fim. Seção com 3 subseções ou mais vira índice, em duas colunas quando passa de 12 itens. Documento de até 4.000 caracteres continua inteiro
- Política de privacidade (`/privacidade`, protótipo r33): faixa com "Voltar" no topo e o quadro "Em resumo" ao lado; abaixo, seções numeradas em linhas de rótulo e explicação com régua entre elas, como as condições do consentimento, e a ficha lateral fixa "Nesta página". O "Voltar" diz para onde vai e aparece também no fim da página. Quando a política abriu em outra aba, a partir das janelas de Entrar e Criar conta, ele vira "Fechar esta aba e voltar", para não perder o que a pessoa digitou
- Política no link do participante (`/r/<slug>/privacidade`, protótipo p9): o mesmo conteúdo, aberto por um link no fim do termo de consentimento, sem barra, sem ícones e sem link para o resto da ferramenta. O "Voltar" leva ao termo. Enquanto o texto não tem tradução para o idioma da pessoa, um quadro avisa, no idioma dela, que a política aparece em português

## Janelas

- Entrar e Criar conta abrem numa janela por cima da página em que a pessoa está, com o formulário à esquerda e o painel do instrumento à direita (as telas r1 e r2 dentro da janela). Criar conta e Entrar trocam o formulário dentro da mesma janela. `/entrar` e `/cadastrar` mostram a página inicial com a janela aberta
- A janela de acesso cabe inteira na tela, sem rolar: as medidas encolhem com a altura (notebook de 768 px) e, até 40rem de largura, ela ocupa a tela toda, sem o painel (que volta, só com o título, quando a tela é alta)
- Sair e toda exclusão (estudo, conta, versão do estudo) pedem confirmação numa janela estreita: título em pergunta ("Excluir este estudo?"), o que vai acontecer, Cancelar e o botão da ação. Nas exclusões, o aviso fica em `--alerta-fundo` com borda `--alerta`, o campo de confirmação (título ou e-mail digitado) continua e o botão é `--alerta`. Sair usa o botão primário, porque não apaga nada. No celular, os botões ficam em coluna, com a ação em cima
- `<dialog>` nativo com `showModal()`: foco preso dentro, página atrás inerte e sem rolar, Esc e o `x` (Fechar) fecham, e o foco volta para quem abriu. Fundo da página escurecido com `--tinta` a 62%, borda de 1px `--linha-forte`, raio 2px. Sem sombra nem desfoque
- Foco inicial: no primeiro campo (Entrar, Criar conta, exclusões) ou no botão da ação quando não há campo (Sair, Remover versão)
- "Sair sem enviar", no questionário do participante, também confirma numa janela (protótipo p8): a pergunta é o título, "Continuar respondendo" é o botão primário e começa com o foco, e Esc também continua. Sem ícone e sem o `x`, como todas as telas do participante; os textos vêm do idioma escolhido
- Documento em produção (protótipo r23): enquanto o arquivo não entra na lista `PRONTOS` de `src/lib/documentacao/catalogo.ts`, a aba Documentação mostra as mesmas abas e sub-abas, a fileira de marcações vazia, "Em produção" com o ponto vazado do rascunho e a ficha com o que o documento vai trazer, sem arquivo, downloads nem índice. A visão geral lista a situação de cada documento
- Ícone do site (`src/app/icon.svg` e `apple-icon.tsx`): três marcações do diferencial semântico, a última preenchida, em branco sobre `--destaque`
- Ajuda da página (protótipo r30): botão redondo (?) no cabeçalho de cada página do pesquisador, com `aria-label`, que abre a janela média. Ela diz para que serve a página e o que dá para fazer nela, leva à Política de privacidade e oferece rever o tour
- Compartilhar (protótipo r25): janela média com quem tem acesso e o convite por e-mail, escolhendo Editor ou Leitor

## Sino e tour

- Sino (protótipo r26): fica entre Minha conta e Sair. As não lidas aparecem num contador `--alerta` com o número em texto. Abre os avisos mais recentes e leva à página Notificações (r27), onde os convites têm Aceitar e Recusar ali mesmo
- Tour guiado (protótipos r28 e r29): começa com uma janela de boas-vindas no primeiro acesso. Cada passo destaca um elemento real da tela e um cartão ao lado explica. Em parte dos passos, a pessoa faz a própria ação para seguir. Dá para pular ou fechar a qualquer momento, e rever pela ajuda

## E-mails

Convite e avisos saem com a mesma identidade: fundo branco, faixa `--fundo-faixa`, tinta escura, a fileira de 7 marcações e azul-petróleo só no que é clicável. São feitos em tabelas com estilo inline, sem imagens, e levam a versão em texto puro. Saem no idioma de quem recebe (`src/lib/modelo-email.ts`).

## Ícones

Lucide (`lucide-react`), contorno de 1,5 px, 18 px, na cor do texto ao lado.

- Ícone só acompanha texto em **ações**: botões, links de ação, navegação principal e abas. O texto continua sempre visível; o ícone tem `aria-hidden="true"`
- Ícone sozinho só em fechar e menu, com `aria-label`. Exceção: no celular, os botões de zoom do diagrama em tela cheia (`zoom-out`, `zoom-in`, `maximize`) mostram só o ícone para Voltar e o zoom caberem numa linha; o texto (Diminuir, Aumentar, Ajustar à tela) continua como nome acessível e aparece no computador
- Ação destrutiva usa o ícone na cor `--alerta`, junto com o texto
- **Nenhum ícone nas telas do participante dentro do questionário** (ihc.md, seção 3: qualquer elemento a mais pode influenciar a resposta)
- Mapa usado nas telas: Estudos `folder`, Criar estudo `plus`, Minha conta `user`, Salvar alterações `save`, Trocar senha `lock`, Sair `log-out`, Entrar `log-in`, Criar conta `user-plus`, Visão geral `layout-dashboard`, Resultados `bar-chart-3`, Respostas `list`, Copiar link `copy`, Abrir coleta `play`, Encerrar coleta `square`, Reabrir `rotate-ccw`, Editar `pencil`, Excluir `trash-2`, Exportar `download`, Mostrar senha `eye`, Adicionar versão `plus`, Remover `x`, Tirar da análise `minus-circle`, mensagem de status `check-circle`, Documentação `book-open`, Ver no GitHub e Abrir em tamanho real `external-link`, Baixar `download`, Voltar `arrow-left`, Administração e Política de privacidade `shield-check`, Notificações `bell`, Ajuda `circle-help`, Rever o tour `compass`, Idioma `languages`. Abas da documentação: Visão geral `layout-dashboard`, Requisitos `list-checks`, Usuários `users`, Modelagem `shapes`, Arquitetura `layers`, Testes `flask-conical`, Especificação `file-text`
- Movimento: só transição de 120ms em cor/borda. Respeitar `prefers-reduced-motion`

## Telas-chave

### Questionário do participante (`/r/[slug]`)
A tela mais importante. É onde a equipe mostra que entende de IHC.

- Cabeçalho mínimo: nome do produto avaliado e uma frase de instrução no estilo do UEQ oficial
- Termo de consentimento antes, em página própria, com texto completo, link para a política de privacidade e botão "Concordo e quero participar". Sem checkbox escondido
- Itens em linhas, uma por item, com régua fina entre elas. Termo da esquerda alinhado à direita, 7 círculos no centro, termo da direita alinhado à esquerda. Nada de números visíveis
- Círculos com área de toque de 44×44px, contorno 1.5px `--tinta`, preenchido em `--tinta` quando marcado
- Teclado: comportamento nativo de rádio (Tab entre itens, setas dentro do item). Sem atalho de tecla única, que conflita com leitor de tela (WCAG 2.1.4). Cada item é um `<fieldset>` com `<legend>`, detalhes em `docs/ihc.md` seção 4.1
- Link discreto "Sair sem enviar" no rodapé, que pede confirmação numa janela (ver "Janelas")
- Celular (< 640px): os dois termos ficam numa linha acima dos 7 círculos, um em cada ponta
- Progresso: texto "14 de 26" fixo no rodapé + a fileira de 7 marcações como ícone. Sem barra de progresso colorida
- Ao enviar com item faltando: resumo de erros no topo com link para cada item ("Faltam 2 itens: 7 e 19"), foco vai para o resumo, e cada item faltando ganha borda esquerda `--alerta` + o texto "Este item não foi respondido"
- `scroll-padding-bottom` igual à altura do rodapé fixo, para o foco nunca ficar escondido
- Fim: página simples agradecendo, num quadro com fundo `--fundo-painel` e barra de 3px `--destaque` à esquerda. Nada de confete. Os avisos de uma tela só (link fechado, já respondeu, saiu) usam o mesmo quadro
- Todas as etapas abrem com a mesma faixa `--fundo-faixa` do consentimento: etapa ("Etapa 2 de 3 · Questionário") e título. No consentimento e no questionário a faixa tem o seletor de idioma; trocar no questionário volta para ele, com as marcações guardadas no rascunho
- Instrução oficial do UEQ num quadro (`--fundo-painel`, borda de 1px `--linha`) acima dos itens, com o texto inteiro e na ordem do pacote de idiomas
- Cada item mostra o número em `--tinta-fraca` à esquerda, para achar o item que o resumo de erros aponta; o número também está na legenda. Item respondido ganha uma barra de 3px `--destaque` à esquerda, igual em qualquer posição marcada; item faltando, a mesma barra em `--alerta` com fundo `--alerta-fundo`. No computador a linha clareia (`--fundo-painel`) com o mouse em cima, para o olho não se perder entre termo e círculos
- Círculos de 30px; marcado é anel com o miolo em `--tinta`, como os botões de opção dos dados opcionais
- Dados opcionais: cada opção é uma linha inteira clicável, com borda `--borda-campo`; a escolhida fica com borda `--tinta` e fundo `--destaque-fundo`. Continuar e Pular esta etapa continuam com o mesmo peso

### Painel do estudo
Abre com uma **linha de resumo em texto**, não com cards: "34 respostas · 3 suspeitas · 31 na análise · coleta aberta desde 04/11".

Gráfico principal (SVG próprio, `src/graficos/EscalasComBenchmark.tsx`):
- Uma linha horizontal por escala, eixo de -3 a +3
- Atrás de cada linha, as 5 faixas do benchmark daquela escala em tons de cinza-azulado, com rótulo da faixa
- Faixa neutra (-0,8 a +0,8) marcada com duas linhas verticais tracejadas e o rótulo "neutro" no topo
- A média é um ponto (círculo de 8px na cor do construto), o IC95 é um traço horizontal com terminações
- À direita do gráfico, a média em números tabulares e a faixa do benchmark em texto
- Escalas agrupadas com rótulo em negrito: Atratividade / Qualidade pragmática / Qualidade hedônica

Abaixo, tabela completa (n, média, dp, IC95, alfa, faixa). Alfa < 0,7 aparece com o valor em `--alerta` e uma nota de rodapé.

Gráfico por item: lista dos 26 itens com os dois termos e um ponto na posição da média (-3 a +3), na ordem oficial ou agrupados por escala (alternável).

Comparação entre versões: mesmo gráfico de escalas, com um marcador por versão (círculo cheio e círculo vazado, ou quadrado), legenda em texto acima.

### Estados vazios
Sem ilustração. Uma frase direta e a ação. Ex.: "Nenhuma resposta ainda. Compartilhe o link do estudo para começar a coleta." + link copiável num campo com fundo `--fundo-painel` e botão "Copiar link".

## Exceções em aberto

A página inicial foge de duas regras da seção "Proibido": a faixa do topo tem um gradiente radial suave, e figuras e cartões têm raio de 6 a 8 px (`inicio.module.css`). O contador do sino tem raio de 10 px, que é o formato do número. A equipe ainda precisa decidir se a regra muda ou se a página volta à regra.

## Tom de voz

Português do Brasil, frase curta, verbo no início dos botões ("Criar estudo", "Encerrar coleta", "Exportar respostas"). Fala como pesquisador falando com pesquisador. Termos do UEQ com o nome oficial (Perspicuidade, não "Clareza"). Datas em dd/mm/aaaa, números com vírgula decimal.
