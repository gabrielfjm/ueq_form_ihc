# Ferramenta UEQ

Ferramenta web para conduzir estudos de avaliação de experiência do usuário com o UEQ (User Experience Questionnaire), do cadastro do estudo à exportação dos dados.

O pesquisador cria um estudo, define uma ou mais versões do produto e compartilha um link público. O participante entra pelo link, dá o consentimento e responde os 26 itens do diferencial semântico. A ferramenta calcula média, desvio-padrão, intervalo de confiança de 95% e alfa de Cronbach por escala, compara o resultado com o benchmark oficial, aponta respostas inconsistentes e exporta os dados em CSV, inclusive no formato da planilha oficial *UEQ Data Analysis Tool*.

Projeto da disciplina Fundamentos da Interação Humano-Computador, PPGIa · PUCPR · 2026.

Equipe: Gabriel Meira, Jean Weiss e Luiza Pedralli.

## Documentação

| Arquivo | Conteúdo |
|---|---|
| [docs/ueq-protocolo.md](docs/ueq-protocolo.md) | Itens, escalas, polaridade e todas as fórmulas do cálculo |
| [docs/ihc.md](docs/ihc.md) | Requisitos de usabilidade e acessibilidade, cada um ligado ao princípio da literatura que o justifica |
| [docs/design.md](docs/design.md) | Identidade visual |
| [docs/codigo.md](docs/codigo.md) | Convenções de código, testes e commits |
| [docs/checklist-manual.md](docs/checklist-manual.md) | Verificações que a equipe faz à mão: leitor de tela, zoom, celular real, daltonismo |
| [data/LEIA-ME.md](data/LEIA-ME.md) | Dados oficiais do UEQ que a equipe precisa preencher a partir das fontes originais |

A meta de acessibilidade é WCAG 2.2 nível AA, base da ABNT NBR 17225:2025.

## Stack

- Next.js (App Router), React e TypeScript em modo `strict`
- PostgreSQL com Prisma
- CSS Modules e variáveis CSS, sem framework de componentes
- Gráficos em SVG feitos à mão
- Zod para validação
- Vitest para testes de unidade, Playwright com axe-core para testes de ponta a ponta e acessibilidade

## Como rodar

Requisitos: Node.js 24, pnpm 10 e Docker.

```
pnpm install
docker compose up -d
cp .env.example .env
pnpm db:migrate
pnpm db:seed
pnpm dev
```

A aplicação abre em http://localhost:3000.

O seed carrega os 26 itens do UEQ a partir de `data/ueq-itens-ptbr.json`. Enquanto os termos em português não forem preenchidos com o pacote oficial de idiomas, o seed para e indica qual item está faltando.

## Comandos

| Comando | O que faz |
|---|---|
| `pnpm dev` | Servidor local |
| `pnpm db:migrate` | Aplica as migrations do Prisma |
| `pnpm db:seed` | Carrega os itens do UEQ |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | Checagem de tipos |
| `pnpm test` | Testes de unidade (inclui o contraste das cores do tema) |
| `pnpm test:e2e` | Testes de ponta a ponta, com verificação WCAG 2.2 A/AA |

Antes de abrir um pull request, `pnpm lint && pnpm typecheck && pnpm test` precisa passar.

## Estrutura

```
src/
  app/            páginas e rotas (pesquisador, participante e API)
  ueq/            cálculo do UEQ em funções puras, testado contra a planilha oficial
  componentes/    componentes de interface
  graficos/       gráficos em SVG
  styles/         tokens de cor, tipografia e espaçamento
  lib/            banco, sessão e validação
prisma/           schema e seed
data/             itens, benchmark, parâmetros do protocolo e fixtures de teste
docs/             especificação, requisitos e protótipos
tests/e2e/        testes Playwright
```

## Protótipos de baixa fidelidade

Esboços das telas antes da implementação, em [docs/prototipos/](docs/prototipos/). Os termos dos itens e os valores do gráfico são marcadores: os termos reais vêm do pacote oficial de idiomas do UEQ e os limites do benchmark, da planilha oficial.

### Participante

Fluxo: consentimento, questionário, dados opcionais e fim. A validação acontece só no envio: um resumo no topo leva a cada item que faltou.

<p>
<img src="docs/prototipos/p1-consentimento.png" alt="Consentimento: título do estudo, termo com participação voluntária e anônima, botão Concordo e quero participar" width="200">
<img src="docs/prototipos/p2-questionario-celular.png" alt="Questionário no celular: cada item com os dois termos acima de sete círculos, rodapé com progresso e Sair sem enviar" width="200">
<img src="docs/prototipos/p3-questionario-item-faltando.png" alt="Envio com item faltando: resumo Faltam 2 itens com links, item 7 marcado como não respondido" width="200">
<img src="docs/prototipos/p4-dados-opcionais.png" alt="Dados opcionais: quatro perguntas com Prefiro não responder, botões Continuar e Pular esta etapa" width="200">
<img src="docs/prototipos/p5-fim.png" alt="Fim: Respostas registradas, você já pode fechar esta página" width="200">
<img src="docs/prototipos/p6-link-fechado.png" alt="Link fechado: estudo ainda não aberto ou coleta encerrada" width="200">
</p>

<img src="docs/prototipos/p7-questionario-desktop.png" alt="Questionário no desktop: termo esquerdo, sete círculos e termo direito na mesma linha; rodapé com confirmação de saída em linha" width="800">

### Pesquisador

Entrar e criar conta (com o resumo de erros):

<img src="docs/prototipos/r1-entrar.png" alt="Entrar: e-mail, senha com botão Mostrar, botão Entrar" width="400"> <img src="docs/prototipos/r2-cadastrar-com-erro.png" alt="Criar conta com erro: resumo Corrija 1 campo, e-mail marcado com Esse e-mail já tem conta" width="400">

Lista de estudos e criação de estudo com versões:

<img src="docs/prototipos/r3-estudos.png" alt="Estudos: tabela com título, produto, status, versões, respostas e última resposta" width="400"> <img src="docs/prototipos/r4-criar-estudo.png" alt="Criar estudo: título, produto, objetivo, datas e lista de versões" width="400">

Página do estudo, com link público, versões e exclusão confirmada em linha:

<img src="docs/prototipos/r5-pagina-do-estudo.png" alt="Página do estudo: status, resumo, link para participantes, versões e ações com confirmação de exclusão" width="800">

Resultados por escala com benchmark, tabela, médias por item e exportação:

<img src="docs/prototipos/r6-resultados.png" alt="Resultados: gráfico das seis escalas com faixas do benchmark e intervalo de confiança, tabela, médias por item e links de exportação" width="800">

Comparação entre versões e controle de respostas suspeitas:

<img src="docs/prototipos/r7-comparar-versoes.png" alt="Comparar versões: um marcador cheio e um vazado por escala" width="400"> <img src="docs/prototipos/r8-respostas-e-suspeitas.png" alt="Respostas: tabela de participações com escalas inconsistentes, suspeita e caixa Na análise" width="400">
