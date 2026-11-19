# Arquitetura

A arquitetura é descrita com o [modelo C4](https://c4model.com), em três níveis de zoom:

1. **Contexto:** quem usa a ferramenta e com que sistemas ela se relaciona;
2. **Containers:** as partes que rodam separadas (aplicação, banco, gerador de PDF, scripts) e como se falam;
3. **Componentes:** como a aplicação Next.js se organiza por dentro.

Um quarto diagrama mostra a implantação, em produção e no desenvolvimento.

Os diagramas usam Mermaid, que o GitHub desenha direto na página. Cada caixa traz o nome, o tipo entre colchetes e a tecnologia. As setas dizem o que passa e por qual protocolo. Logo abaixo de cada diagrama estão a ferramenta usada, o arquivo-fonte para baixar e a versão da ferramenta que ele representa.

## Visão geral

A Ferramenta UEQ é uma aplicação web única em **Next.js 16 (App Router)** com **React 19** e **TypeScript strict**, que guarda os dados num **PostgreSQL 16** pelo **Prisma 7**. Está no ar em [ferramenta-ueq.vercel.app](https://ferramenta-ueq.vercel.app), na Vercel, com o banco na Neon, região de São Paulo.

- Não existe uma API REST separada. As páginas são Server Components que leem o banco no servidor. As escritas são Server Actions chamadas pelos formulários.
- Só o que devolve arquivo é rota de API: as exportações em CSV, o painel em PDF, os dados da conta e os downloads da documentação.
- O cálculo do UEQ fica isolado em `src/ueq/`, em funções puras, para ser testado contra a planilha oficial sem banco nem interface.
- Os parâmetros do protocolo, o benchmark e os textos oficiais dos 37 idiomas são arquivos JSON versionados em `data/`, com a fonte de cada valor.
- A interface do pesquisador e os textos dos estudos são traduzidos sob demanda pela API do Claude, com o resultado guardado no banco. O questionário usa só as traduções oficiais do UEQ.

## Nível 1 · Contexto

```mermaid
flowchart TB
    pesquisador["<b>Researcher</b><br/>[Person]<br/>Creates studies, monitors data collection,<br/>interprets and exports the results.<br/>Can work in a team"]
    participante["<b>Participant</b><br/>[Person]<br/>Answers the questionnaire through the link,<br/>without an account and anonymously"]
    administrador["<b>Administrator</b><br/>[Person]<br/>A researcher who creates accounts,<br/>monitors languages and data protection"]
    mantenedor["<b>Maintainer</b><br/>[Person]<br/>Installs, loads the official items<br/>and adjusts the parameters"]

    ferramenta["<b>UEQ Tool</b><br/>[Software system]<br/>Runs studies with the User Experience<br/>Questionnaire, from setup to export"]

    claude["<b>Claude API</b><br/>[External system · Anthropic]<br/>Translates the interface and the study texts"]
    smtp["<b>Email server</b><br/>[External system · SMTP]<br/>Delivers invitations and notices"]
    planilha["<b>UEQ Data Analysis Tool</b><br/>[External system · Excel spreadsheet V15]<br/>Official UEQ analysis tool"]
    ueqonline["<b>ueq-online.org</b><br/>[External system]<br/>Official Handbook, language pack<br/>and benchmark"]
    canais["<b>Messaging channels</b><br/>[External system]<br/>WhatsApp, email"]

    pesquisador -- "uses through the browser<br/>[HTTPS]" --> ferramenta
    participante -- "answers through the link /r/slug<br/>[HTTPS]" --> ferramenta
    administrador -- "uses through the browser<br/>[HTTPS]" --> ferramenta
    mantenedor -- "runs migrations, seed<br/>and recalculation [CLI]" --> ferramenta
    ferramenta -- "requests translations, without responses<br/>or personal data [HTTPS]" --> claude
    ferramenta -- "sends invitations and notices<br/>[SMTP]" --> smtp
    smtp -- "delivers the notice" --> pesquisador
    pesquisador -- "sends the study link" --> canais
    canais -- "delivers the link" --> participante
    pesquisador -- "pastes the exported CSV<br/>to check the numbers" --> planilha
    mantenedor -- "copies items, instructions,<br/>thresholds and benchmark to data/" --> ueqonline

    classDef pessoa fill:#0F1720,stroke:#0F1720,color:#FFFFFF
    classDef sistema fill:#0B6A78,stroke:#0F1720,color:#FFFFFF
    classDef externo fill:#F3F5F7,stroke:#7A8691,color:#0F1720
    class pesquisador,participante,administrador,mantenedor pessoa
    class ferramenta sistema
    class claude,smtp,planilha,ueqonline,canais externo
```

**Ferramenta do diagrama:** Mermaid 12.2.0 (`flowchart`), gerado por `pnpm docs:diagramas`. **Arquivo-fonte:** [arquitetura-1.mmd](fontes/arquitetura-1.mmd). **Versão representada:** Ferramenta UEQ de 06/11/2026.

Em tempo de execução, a ferramenta chama só dois sistemas externos, e os dois são opcionais:

- **API do Claude:** sem `ANTHROPIC_API_KEY`, a interface fica em português e os textos dos estudos ficam no idioma original. Vão para a API os textos da interface e o título, o produto, o objetivo e os nomes de versão de cada estudo. Nenhuma resposta, nome, e-mail ou dado demográfico vai junto.
- **Servidor de e-mail:** sem as variáveis `SMTP_*`, os avisos ficam só no sino, e quem convida recebe um link de e-mail pronto para enviar por conta própria.

A planilha oficial e o site do UEQ entram por pessoas: a equipe copia os dados oficiais para `data/` (com a fonte em cada arquivo). A exportação da planilha oficial parte de uma cópia sem alteração da UEQ Data Analysis Tool V15 em `data/planilha-oficial/`, e o pesquisador a abre no Excel para conferir os números.

## Nível 2 · Containers

```mermaid
flowchart TB
    pesquisador["<b>Researcher</b><br/>[Person]"]
    participante["<b>Participant</b><br/>[Person]"]
    mantenedor["<b>Maintainer</b><br/>[Person]"]
    claude["<b>Claude API</b><br/>[External system]"]
    smtp["<b>Email server</b><br/>[External system]"]

    subgraph fronteira["UEQ Tool"]
        direction TB
        navegador["<b>Browser interface</b><br/>[Container · React 19, CSS Modules]<br/>HTML rendered on the server and Client Components<br/>only where there is interaction: questionnaire, dialogs,<br/>tour, filters and forms"]
        app["<b>Web application</b><br/>[Container · Next.js 16 App Router, Node.js 24]<br/>Server Components, Server Actions,<br/>Route Handlers and session proxy.<br/>Contains the calculation module src/ueq"]
        pdf["<b>PDF generator</b><br/>[Container · headless Chromium via Playwright]<br/>Opened on demand by the application<br/>to print the dashboard on A4"]
        banco[("<b>Database</b><br/>[Container · PostgreSQL 16]<br/>Accounts, sessions, studies, versions, items,<br/>participations, responses, notifications<br/>and translations")]
        dados[/"<b>Official data</b><br/>[Container · JSON files in data/]<br/>Items, instructions and texts of the 37 languages,<br/>protocol and benchmark, with the source"/]
        scripts["<b>Maintenance scripts</b><br/>[Container · Prisma CLI and tsx]<br/>migrate, item seed, recalculation of<br/>suspicious responses, encryption, catalog and diagrams"]
    end

    pesquisador -- "uses [HTTPS]" --> navegador
    participante -- "uses [HTTPS]" --> navegador
    mantenedor -- "runs [pnpm]" --> scripts

    navegador -- "requests pages and calls Server Actions<br/>[HTTPS, RSC]; downloads CSV, JSON and PDF [HTTPS GET]" --> app
    app -- "reads and writes<br/>[SQL via Prisma Client and pg adapter]" --> banco
    app -- "imports at build time<br/>[JSON import]" --> dados
    app -- "opens the print page<br/>with the requester's session [internal HTTP]" --> pdf
    pdf -- "GET /estudos/id/resultados/impressao<br/>[HTTP, internal origin]" --> app
    app -- "translates in batches<br/>[HTTPS, Anthropic SDK]" --> claude
    app -- "sends after responding<br/>[SMTP, Nodemailer]" --> smtp
    scripts -- "applies migrations, writes items,<br/>updates suspicious flags, encrypts demographics [SQL]" --> banco
    scripts -- "reads and validates with Zod" --> dados

    classDef pessoa fill:#0F1720,stroke:#0F1720,color:#FFFFFF
    classDef container fill:#0B6A78,stroke:#0F1720,color:#FFFFFF
    classDef armazenamento fill:#E6F2F4,stroke:#0B6A78,color:#0F1720
    classDef externo fill:#F3F5F7,stroke:#7A8691,color:#0F1720
    class pesquisador,participante,mantenedor pessoa
    class navegador,app,pdf,scripts container
    class banco,dados armazenamento
    class claude,smtp externo
```

**Ferramenta do diagrama:** Mermaid 12.2.0 (`flowchart`), gerado por `pnpm docs:diagramas`. **Arquivo-fonte:** [arquitetura-2.mmd](fontes/arquitetura-2.mmd). **Versão representada:** Ferramenta UEQ de 06/11/2026.

| Container | Tecnologia | Responsabilidade | Onde está |
|---|---|---|---|
| Interface no navegador | React 19.3, CSS Modules, variáveis CSS, SVG feito à mão | Mostrar as telas e tratar a interação. Sem biblioteca de componentes nem de gráficos | `src/app/**/*.tsx` com `"use client"`, `src/componentes/`, `src/graficos/`, `src/styles/` |
| Aplicação web | Next.js 16.4, Node.js 24, Zod 4, bcryptjs, Nodemailer, SDK da Anthropic | Renderizar as páginas, validar e gravar dados, proteger a área do pesquisador, gerar exportações, traduzir e avisar | `src/app/`, `src/lib/`, `src/ueq/`, `src/idiomas/`, `src/traducao/`, `src/proxy.ts` |
| Gerador de PDF | Playwright 1.64 com o Chromium dele no desenvolvimento e `@sparticuz/chromium-min` 153 na Vercel | Imprimir o painel em PDF com gráficos em vetor | `src/app/api/estudos/[id]/painel-pdf/route.ts` |
| Banco de dados | PostgreSQL 16 (Docker no desenvolvimento, Neon em produção) | Persistir o modelo de domínio, com cascata e `CHECK`. Detalhes no [modelo lógico](modelo-logico.md) | `prisma/schema.prisma`, `prisma/migrations/`, `docker-compose.yml` |
| Dados oficiais | JSON versionado | Fonte única dos itens, instruções, protocolo e benchmark, cada um com o campo `fonte` | `data/` |
| Documentação | Markdown e SVG versionados | Os documentos que a aba Documentação mostra, os diagramas já desenhados e o arquivo-fonte de cada um | `docs/`, `docs/documentacao/diagramas/`, `docs/documentacao/fontes/` |
| Scripts de manutenção | Prisma CLI, tsx | Criar o banco, carregar os itens, recalcular suspeitas, cifrar dados antigos, gerar o catálogo de textos e os diagramas | `prisma/seed.ts`, `prisma/recalcular-suspeitas.ts`, `prisma/cifrar-dados.ts`, `scripts/` |

## Nível 3 · Componentes da aplicação web

```mermaid
flowchart TB
    navegador["<b>Browser interface</b><br/>[Container]"]
    pdf["<b>PDF generator</b><br/>[Container]"]
    banco[("<b>PostgreSQL</b><br/>[Container]")]
    dados[/"<b>data/*.json</b><br/>[Container]"/]
    docsMd[/"<b>docs/*.md</b><br/>[repository files]"/]
    claude["<b>Claude API</b><br/>[External system]"]
    smtp["<b>Email server</b><br/>[External system]"]

    subgraph app["Web application · Next.js"]
        direction TB
        proxy["<b>Session proxy</b><br/>[src/proxy.ts]<br/>Sends anyone without a cookie to Log in,<br/>keeping the requested page"]

        subgraph rotas["Routes"]
            direction LR
            publico["<b>Public pages</b><br/>[app/(ferramenta)/(publico)]<br/>Home page, Log in and Create account dialogs,<br/>Documentation and Privacy policy"]
            areaPesq["<b>Researcher area</b><br/>[app/(ferramenta)/(pesquisador)]<br/>Studies, Results, Responses, Import,<br/>Notifications, My account and Administration"]
            areaPart["<b>Participant link</b><br/>[app/r/[slug]]<br/>Own root layout with lang and dir;<br/>consent, policy, questionnaire,<br/>optional data, end"]
            api["<b>Download routes</b><br/>[app/api]<br/>exportar/[tipo], painel-pdf,<br/>conta/dados and documentacao"]
        end

        subgraph servicos["Services · src/lib"]
            direction LR
            sessao["<b>Session and account</b><br/>sessao.ts, senhas.ts, tentativas.ts,<br/>validacao-conta.ts, administracao.ts"]
            estudos["<b>Studies</b><br/>estudos.ts, validacao-estudo.ts,<br/>status-estudo.ts, periodo.ts<br/>access (owner, editor, viewer), slug"]
            participacao["<b>Participation</b><br/>participacao.ts, balanceamento.ts,<br/>demografia.ts, cripto.ts, itens-ueq.ts"]
            resultados["<b>Results</b><br/>resultados.ts, participacoes.ts,<br/>leitura-rapida.ts, perfil-demografico.ts"]
            arquivos["<b>Files</b><br/>exportacoes.ts, exportar-estudo.ts,<br/>csv.ts, importacao.ts"]
            avisos["<b>Notices</b><br/>notificacoes.ts, email.ts,<br/>modelo-email.ts"]
            banco_lib["<b>Database access</b><br/>banco.ts + Prisma Client<br/>generated in src/generated/prisma"]
        end

        ueq["<b>Calculation module</b><br/>[src/ueq · pure functions]<br/>recoding, statistics, scales,<br/>alpha, benchmark, inconsistency"]
        idiomas["<b>Participant languages</b><br/>[src/idiomas]<br/>37 languages, negotiation via the browser,<br/>typed texts, plurals and lists"]
        traducao["<b>Interface translation</b><br/>[src/traducao]<br/>t() and m(), text catalog,<br/>database cache and Claude API"]
        ui["<b>Components and charts</b><br/>[src/componentes, src/graficos]<br/>ItemDiferencial, forms, dialogs, tour,<br/>EscalasComBenchmark, MediasPorItem, Demografia"]
        docsLib["<b>Document reader</b><br/>[src/lib/documentacao]<br/>catalog, Markdown with marked,<br/>links and anchors as on GitHub"]
    end

    navegador --> proxy
    proxy --> areaPesq
    proxy --> api
    navegador --> publico
    navegador --> areaPart

    publico --> sessao
    publico --> traducao
    publico --> docsLib
    areaPesq --> sessao
    areaPesq --> estudos
    areaPesq --> resultados
    areaPesq --> arquivos
    areaPesq --> avisos
    areaPesq --> traducao
    areaPesq --> ui
    areaPart --> participacao
    areaPart --> idiomas
    areaPart --> traducao
    areaPart --> avisos
    areaPart --> ui
    areaPart --> ueq
    api --> sessao
    api --> arquivos
    api --> docsLib
    api -- "opens the print page" --> pdf
    docsLib -. ".md and SVG of the diagrams" .-> docsMd

    resultados --> ueq
    arquivos --> ueq
    arquivos --> resultados
    sessao --> banco_lib
    estudos --> banco_lib
    participacao --> banco_lib
    resultados --> banco_lib
    arquivos --> banco_lib
    avisos --> banco_lib
    traducao --> banco_lib
    banco_lib -- "SQL" --> banco
    traducao -- "translates in batches" --> claude
    avisos -- "sends" --> smtp

    resultados -. "protocol and benchmark" .-> dados
    idiomas -. "terms and instructions" .-> dados
    areaPart -. "protocol" .-> dados
```

**Ferramenta do diagrama:** Mermaid 12.2.0 (`flowchart`), gerado por `pnpm docs:diagramas`. **Arquivo-fonte:** [arquitetura-3.mmd](fontes/arquitetura-3.mmd). **Versão representada:** Ferramenta UEQ de 06/11/2026.

O `matcher` de [`src/proxy.ts`](../../src/proxy.ts) exclui o que nunca exige sessão: `/entrar`, `/cadastrar`, `/privacidade`, `/r/`, `/documentacao`, `/api/documentacao` e os ícones do site. A raiz `/` passa pelo proxy e segue sem cookie. Toda rota nova do pesquisador já nasce protegida. O link do participante tem layout raiz próprio, sem barra e sem link para o resto da ferramenta: quem responde só vê o formulário, o seletor de idioma e a política de privacidade, que tem uma versão em `/r/<slug>/privacidade`.

### Regras de dependência

- **`src/ueq/` não depende de nada do projeto.** Não importa Prisma, React, Next nem `src/lib`. Recebe números e devolve objetos. É o que permite testá-lo contra a planilha oficial.
- **Componentes e gráficos não sabem de Prisma.** Recebem dados prontos por props.
- **Toda página, Server Action e rota do pesquisador confere a sessão no banco e o acesso ao estudo**, não só o proxy. O acesso passa sempre por `estudoDoPesquisador(id, pessoa, "ver" | "editar" | "gerenciar")` ou por `filtroDeAcesso`. Sem acesso, a resposta é igual à de um estudo que não existe.
- **O administrador não vê estudos de outras pessoas.** As respostas são dados de pesquisa de quem conduz o estudo. As páginas de Administração respondem 404 para quem não é administrador.
- **As rotas do participante só leem o que o participante pode ver:** título, produto, objetivo e status do estudo. Nada do pesquisador e nada da análise.
- **Parâmetros do protocolo nunca ficam no código.** Vêm de `data/protocolo.json` e `data/benchmark.json`.
- **Texto de tela do pesquisador passa por `t()` ou `m()`,** e `pnpm i18n:catalogo` gera o catálogo. Texto do participante fica em `src/idiomas/textos/`, um arquivo por idioma.

## Segurança e LGPD

| Medida | Onde está |
|---|---|
| Cabeçalhos de segurança em toda resposta: CSP, HSTS, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` e `Permissions-Policy` | `next.config.ts` |
| Senha em bcrypt custo 12, com hash refeito no login quando o custo sobe | `src/lib/senhas.ts` |
| 5 senhas erradas em 15 minutos bloqueiam o e-mail, contando pelo hash dele | `src/lib/tentativas.ts` |
| Sessão no banco pelo hash do token, com cookie `httpOnly` e `secure` em produção | `src/lib/sessao.ts` |
| Dados demográficos cifrados com AES-256-GCM, com a chave fora do banco | `src/lib/cripto.ts`, `prisma/cifrar-dados.ts` |
| Coleta demográfica desligada por padrão em cada estudo | `Estudo.coletarDemografia` |
| Participação abandonada há mais de 2 dias é apagada | `src/app/r/[slug]/acoes.ts` |
| Baixar os próprios dados e excluir a conta, sem pedir a ninguém | `src/app/api/conta/dados/route.ts`, `conta/` |
| Destino de `?voltar=` e `?de=` só aceita caminho interno | `destinoInterno` em `src/lib/validacao-conta.ts` |
| Política pública, sem exigir conta, também dentro do link do participante | `src/app/(ferramenta)/(publico)/privacidade/`, `src/app/r/[slug]/privacidade/` |

## Decisões de arquitetura

| Decisão | Por quê | Consequência |
|---|---|---|
| Server Components e Server Actions em vez de API REST | Menos código entre a tela e o banco; validação com Zod no servidor em cada ação; formulários funcionam com o comportamento nativo do navegador | A ferramenta não oferece API pública. Integrações usam as exportações em CSV |
| Cálculo em funções puras em `src/ueq/` | O número tem que bater com a planilha oficial; funções puras são testáveis com fixtures e bordas | Quem busca os dados (`src/lib/resultados.ts`) só monta a entrada e repassa |
| Sessão guardada no banco, com o hash do token | Trocar a senha encerra as outras sessões; quem lê o banco não consegue montar um cookie | Cada página do pesquisador faz uma consulta de sessão (com `cache` do React por requisição) |
| Dois layouts raiz: ferramenta e link do participante | O `<html lang>` e o `dir` do participante seguem o idioma escolhido por quem responde, e os da ferramenta seguem o idioma da conta (WCAG 3.1.1), incluindo árabe, hebraico e persa | `experimental.globalNotFound` em `next.config.ts` para a página 404 |
| Dois sistemas de texto: `src/idiomas` e `src/traducao` | O questionário é instrumento de medida: precisa dos termos oficiais e de textos revisáveis, sem tradução automática. O resto da ferramenta pode ser traduzido sob demanda | Texto novo do participante exige os 37 arquivos; texto novo do pesquisador só exige `pnpm i18n:catalogo` |
| Tradução sob demanda, guardada no banco | Traduzir cada texto uma vez só, sem custo em leituras seguintes e sem manter 37 arquivos à mão | A primeira visita a um idioma pode sair em português enquanto os lotes rodam em segundo plano |
| E-mail enviado depois da resposta (`after`) | Quem clicou não espera o servidor de e-mail, e uma falha de envio não desfaz a ação | O sino é o registro que sempre existe; o e-mail é um extra |
| Gráficos em SVG feitos à mão | Controle total de `title`, `desc`, contraste, formas por versão e reorganização em tela estreita | Sem biblioteca de gráficos para atualizar |
| PDF gerado por Chromium no servidor | O PDF sai igual ao painel, com gráficos em vetor e as mesmas fontes | Na Vercel, o navegador é baixado na primeira chamada (ver [Implantação](#implantação)) |
| Documentação lida dos mesmos `.md` do repositório, com os diagramas desenhados antes, em SVG (`pnpm docs:diagramas`) | Um arquivo só para o GitHub e para a ferramenta; a ferramenta não carrega a biblioteca Mermaid e cada diagrama vira imagem com texto alternativo | Mudar um diagrama exige gerar o SVG e a fonte de novo; um teste de unidade avisa |
| Documento longo dividido em páginas na hora de mostrar, sem mudar o `.md` | O arquivo continua único e legível no GitHub, e a ferramenta não obriga a rolar um documento inteiro | Links e âncoras passam por `rotaDaAncora`, que acha a página de cada uma, e endereços antigos só com o fragmento são redirecionados |
| Dados oficiais em JSON versionado | Cada número tem fonte rastreável e muda por pull request, não no código | Mudar um limiar exige `pnpm suspeitas:recalcular` para atualizar as participações já gravadas |
| Cookies do participante restritos a `/r/<slug>` | Anonimato: só o id aleatório da participação, a marca de já respondido e o idioma | A proteção contra envio duplicado vale por navegador, não por pessoa |

## Implantação

```mermaid
flowchart LR
    navegador["Browser<br/>[researcher or participant]"]

    subgraph vercel["Vercel · project ferramenta-ueq"]
        direction TB
        funcoes["<b>Next.js 16</b><br/>[Node.js functions]<br/>ferramenta-ueq.vercel.app"]
        build["<b>vercel-build</b><br/>generate, migrate deploy, seed,<br/>cifrar-dados and next build"]
    end

    subgraph neon["Neon · aws-sa-east-1 (São Paulo)"]
        pgprod[("<b>PostgreSQL</b><br/>DATABASE_URL and<br/>DATABASE_URL_UNPOOLED")]
    end

    github["<b>GitHub</b><br/>branch main"]
    claudeapi["<b>Claude API</b>"]
    smtpserv["<b>SMTP server</b>"]

    subgraph maquina["Developer machine"]
        direction TB
        node["<b>Node.js 24 + pnpm 10</b><br/>pnpm dev · next dev on port 3000"]
        chromium["<b>Playwright Chromium</b><br/>PDF and e2e tests"]
        subgraph docker["Docker"]
            pg[("<b>postgres:16</b><br/>port 5432")]
        end
    end

    navegador -- "HTTPS" --> funcoes
    github -- "each merge deploys" --> build
    build -- "migrations and seed" --> pgprod
    build --> funcoes
    funcoes -- "SQL with TLS" --> pgprod
    funcoes -. "if configured" .-> claudeapi
    funcoes -. "if configured" .-> smtpserv
    node -- "DATABASE_URL" --> pg
    node --> chromium
```

**Ferramenta do diagrama:** Mermaid 12.2.0 (`flowchart`), gerado por `pnpm docs:diagramas`. **Arquivo-fonte:** [arquitetura-4.mmd](fontes/arquitetura-4.mmd). **Versão representada:** Ferramenta UEQ de 06/11/2026.

**Produção.** Cada merge na `main` publica uma versão nova. O script `vercel-build` roda `prisma generate`, `prisma migrate deploy`, o seed, `prisma/cifrar-dados.ts` e `next build`. Em produção o seed grava só os 26 itens, sem conta de teste. As migrations usam `DATABASE_URL_UNPOOLED` quando ela existe.

**Desenvolvimento.** O passo a passo está no [README](../../README.md#como-rodar).

| Variável | Obrigatória | Para que serve |
|---|---|---|
| `DATABASE_URL` | Sim | Conexão com o PostgreSQL |
| `DATABASE_URL_UNPOOLED` | Na Neon | Conexão direta, usada pelas migrations |
| `CHAVE_CRIPTOGRAFIA` | Em produção | Chave AES-256-GCM da demografia. Sem ela, o dado fica em texto puro e Administração avisa. Guarde uma cópia: sem a chave, o dado cifrado não pode mais ser lido |
| `ANTHROPIC_API_KEY` | Não | Liga a tradução automática |
| `SMTP_HOST`, `SMTP_PORTA`, `SMTP_USUARIO`, `SMTP_SENHA`, `EMAIL_REMETENTE` | Não | Ligam o envio de e-mail |
| `URL_INTERNA` e `PORT` | Não | Endereço pelo qual a rota do PDF alcança a própria aplicação. Sem `URL_INTERNA`, vale `http://localhost:$PORT` |
| `PESQUISADOR_TESTE_EMAIL` e `PESQUISADOR_TESTE_SENHA` | Só no desenvolvimento | Conta criada pelo seed. Não devem existir em produção |
| `TRADUCAO_PSEUDO` | Só para conferência | Com `1`, marca os textos do catálogo com ⟦ ⟧ para achar o que não passa por `t()` |

**Painel em PDF em produção.** A função da Vercel não tem navegador instalado. Na primeira chamada, a rota baixa um Chromium próprio para servidor (`@sparticuz/chromium-min` 153), que fica em `/tmp` enquanto a função estiver de pé, e abre a página de impressão pelo endereço público de produção. Por isso a primeira geração depois de um tempo parado demora mais, e o limite da função é de 60 s. No desenvolvimento, vale o Chromium do Playwright. As exportações em CSV não dependem de navegador.

## Estrutura de pastas

```
src/
  app/
    (ferramenta)/         layout raiz no idioma da conta
      (publico)/          página inicial, Entrar, Criar conta, Documentação, Privacidade
      (pesquisador)/      Estudos, Resultados, Respostas, Notificações, Minha conta, Administração
    r/[slug]/             link do participante, com layout raiz próprio (lang e dir do idioma)
    api/                  downloads: exportar/[tipo], painel-pdf, conta/dados, documentacao
  ueq/                    cálculo do UEQ em funções puras
  lib/                    sessão, estudos, participação, resultados, CSV, avisos, criptografia
  idiomas/                37 idiomas do participante: textos tipados, negociação, plural
  traducao/               t() e m(), catálogo e tradução da interface pela API do Claude
  componentes/            ItemDiferencial, formulários, janelas, tour, ajuda e painéis
  graficos/               EscalasComBenchmark, MediasPorItem e Demografia em SVG
  styles/                 tokens de cor, tipografia e espaçamento
  proxy.ts                checagem otimista de sessão
scripts/                  SVG e fontes dos diagramas; catálogo de textos
prisma/                   schema, migrations, seed, recálculo de suspeitas e cifragem
data/                     itens, instruções, idiomas, protocolo, benchmark e fixtures
tests/e2e/                Playwright com axe-core
docs/                     especificação, requisitos de IHC, protótipos e esta documentação
```
