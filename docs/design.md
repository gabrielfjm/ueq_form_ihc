# Identidade visual

## A ideia

A ferramenta tem cara de **instrumento de pesquisa impresso**, não de SaaS. Pense em formulário de laboratório, relatório técnico bem diagramado, régua de medição. Papel claro, tinta escura, linhas finas, tabelas, números alinhados. A única "decoração" é o próprio instrumento: a fileira de 7 marcações do diferencial semântico aparece como motivo visual (no logotipo, no indicador de progresso, nos estados vazios).

Teste de qualquer tela: **se um print dela pudesse ser de qualquer template de dashboard, refaça.**

## Proibido

Isso é o que entrega "feito por IA" na hora. Não usar em nenhuma tela:

- Fonte Inter, Geist, Poppins, Montserrat, Roboto ou a fonte padrão do sistema como fonte principal
- Gradientes de qualquer tipo, principalmente roxo/azul/rosa
- Glassmorphism, `backdrop-filter: blur`, brilho, neon, sombra colorida
- Sombras em card (`box-shadow` grande e difusa). Separação é feita com linha de 1px ou mudança de fundo
- `border-radius` acima de 4px. Nada de pílula, nada de `rounded-2xl`
- Grade de cards com ícone + título + número ("KPI cards") como abertura do painel
- Ícone em todo lugar. Lucide/Heroicons só quando o ícone substitui texto que não cabe (fechar, menu). Nada de ícone decorativo ao lado de título
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
  --papel:        #F4F1EA;  /* fundo geral */
  --papel-fundo:  #EAE5DA;  /* faixas alternadas, áreas recuadas */
  --papel-claro:  #FBFAF6;  /* campos de formulário, área de resposta */
  --tinta:        #1B1F27;  /* texto principal, botões primários */
  --tinta-suave:  #4A4F59;  /* texto secundário */
  --tinta-fraca:  #5E6470;  /* legendas, rótulos de eixo. 5.3:1 no papel */
  --linha:        #CFC8B8;  /* réguas decorativas e divisórias de tabela. NUNCA borda de campo */
  --borda-campo:  #7D818A;  /* borda de input, select, textarea. 3.5:1 no papel (WCAG 1.4.11) */
  --linha-forte:  #1B1F27;

  --acento:       #9A3B26;  /* tijolo. Seleção, foco, link, item ativo. Usar pouco */
  --acento-fundo: #F1E2DC;

  /* escalas UEQ, agrupadas pelo construto */
  --atratividade: #1B1F27;  /* impressão geral, na cor da tinta */
  --pragmatica:   #2F4A6B;  /* perspicuidade, eficiência, confiabilidade */
  --hedonica:     #8C6014;  /* estimulação, novidade. ≥ 3:1 inclusive sobre a faixa mais escura do benchmark */

  /* faixas de benchmark: tons do próprio papel, do mais escuro (excelente) ao mais claro (ruim) */
  --bench-excelente: #CFC6B2;
  --bench-bom:       #DAD2C1;
  --bench-acima:     #E3DCCD;
  --bench-abaixo:    #EBE6DA;
  --bench-ruim:      #F2EEE5;

  --alerta:       #9A3B26;  /* mesmo tom do acento, sempre acompanhado de texto */
}
```

Contrastes conferidos (WCAG 2.2): tinta 14.6:1, tinta-suave 7.3:1, tinta-fraca 5.3:1, acento 6.2:1 no papel. Sobre as faixas do benchmark, texto usa só `--tinta` ou `--tinta-suave` (≥ 4.8:1). Um teste automatizado (`src/styles/__tests__/contraste.test.ts`) recalcula esses pares a partir de tokens.css e falha se algum cair abaixo do mínimo.

Suporte também a `@media (forced-colors: active)`: círculos, foco e marcadores do gráfico usam `CanvasText`/`Highlight` para não sumirem no alto contraste do Windows.

Tudo neste arquivo está subordinado a `docs/ihc.md`. Se uma escolha estética conflitar com acessibilidade ou usabilidade, a de IHC vence.

Status de estudo (rascunho, aberto, encerrado) é texto em versalete com um traço antes, não badge colorido.

## Tipografia

Google Fonts via `next/font`:

- **Newsreader** (serifa, eixo óptico) para títulos de página e nome do estudo. Peso 500, nunca bold pesado
- **Atkinson Hyperlegible Next** para todo o texto de interface e o questionário. Foi desenhada pelo Braille Institute para legibilidade, o que é argumento de IHC por si só (vale citar na apresentação)
- **IBM Plex Mono** para números em tabelas, médias, IC, alfa, n. Sempre com `font-variant-numeric: tabular-nums`

Escala (rem): 0.8125 · 0.9375 · 1.0625 · 1.25 · 1.625 · 2.25. Corpo em 1.0625rem, entrelinha 1.5. Títulos com `letter-spacing: -0.01em`. Rótulos de seção em versalete (`font-variant-caps: all-small-caps; letter-spacing: 0.06em`).

## Layout

- Conteúdo alinhado à esquerda, largura máxima de leitura ~72ch, painéis de dados até 1120px
- Grid de 8px. Espaço vertical generoso entre seções (48 a 64px), apertado dentro de tabelas
- Navegação do pesquisador: barra superior fina com nome da ferramenta à esquerda e 3 links em texto. Sem sidebar com ícones
- Tabelas são cidadãs de primeira classe: cabeçalho em versalete, linhas separadas por régua de 1px, números alinhados à direita
- Botão primário: fundo `--tinta`, texto `--papel`, raio 2px, altura 40px. Secundário: borda 1px `--tinta`, fundo transparente. Ação destrutiva: texto `--acento` sublinhado, com confirmação em linha (não modal)
- Foco visível sempre: `outline: 2px solid var(--acento); outline-offset: 2px`
- Movimento: só transição de 120ms em cor/borda. Respeitar `prefers-reduced-motion`

## Telas-chave

### Questionário do participante (`/r/[slug]`)
A tela mais importante. É onde a equipe mostra que entende de IHC.

- Cabeçalho mínimo: nome do produto avaliado e uma frase de instrução no estilo do UEQ oficial
- Termo de consentimento antes, em página própria, com texto completo e botão "Concordo e quero participar". Sem checkbox escondido
- Itens em linhas, uma por item, com régua fina entre elas. Termo da esquerda alinhado à direita, 7 círculos no centro, termo da direita alinhado à esquerda. Nada de números visíveis
- Círculos com área de toque de 44×44px, contorno 1.5px `--tinta`, preenchido em `--tinta` quando marcado
- Teclado: comportamento nativo de rádio (Tab entre itens, setas dentro do item). Sem atalho de tecla única, que conflita com leitor de tela (WCAG 2.1.4). Cada item é um `<fieldset>` com `<legend>`, detalhes em `docs/ihc.md` seção 4.1
- Link discreto "Sair sem enviar" no rodapé, com confirmação em linha
- Celular (< 640px): os dois termos ficam numa linha acima dos 7 círculos, um em cada ponta
- Progresso: texto "14 de 26" fixo no rodapé + a fileira de 7 marcações como ícone. Sem barra de progresso colorida
- Ao enviar com item faltando: resumo de erros no topo com link para cada item ("Faltam 2 itens: 7 e 19"), foco vai para o resumo, e cada item faltando ganha borda esquerda `--acento` + o texto "Este item não foi respondido"
- `scroll-padding-bottom` igual à altura do rodapé fixo, para o foco nunca ficar escondido
- Fim: página simples agradecendo. Nada de confete

### Painel do estudo
Abre com uma **linha de resumo em texto**, não com cards: "34 respostas · 3 suspeitas · 31 na análise · coleta aberta desde 04/11".

Gráfico principal (SVG próprio, `src/graficos/EscalasComBenchmark.tsx`):
- Uma linha horizontal por escala, eixo de -3 a +3
- Atrás de cada linha, as 5 faixas do benchmark daquela escala em tons de papel, com rótulo da faixa
- Faixa neutra (-0,8 a +0,8) marcada com duas linhas verticais tracejadas e o rótulo "neutro" no topo
- A média é um ponto (círculo de 8px na cor do construto), o IC95 é um traço horizontal com terminações
- À direita do gráfico, a média em Plex Mono e a faixa do benchmark em texto
- Escalas agrupadas com rótulo em versalete: Atratividade / Qualidade pragmática / Qualidade hedônica

Abaixo, tabela completa (n, média, dp, IC95, alfa, faixa). Alfa < 0,7 aparece com o valor em `--acento` e uma nota de rodapé.

Gráfico por item: lista dos 26 itens com os dois termos e um ponto na posição da média (-3 a +3), na ordem oficial ou agrupados por escala (alternável).

Comparação entre versões: mesmo gráfico de escalas, com um marcador por versão (círculo cheio e círculo vazado, ou quadrado), legenda em texto acima.

### Estados vazios
Sem ilustração. Uma frase direta e a ação. Ex.: "Nenhuma resposta ainda. Compartilhe o link do estudo para começar a coleta." + link copiável em fonte mono.

## Tom de voz

Português do Brasil, frase curta, verbo no início dos botões ("Criar estudo", "Encerrar coleta", "Exportar respostas"). Fala como pesquisador falando com pesquisador. Termos do UEQ com o nome oficial (Perspicuidade, não "Clareza"). Datas em dd/mm/aaaa, números com vírgula decimal.
