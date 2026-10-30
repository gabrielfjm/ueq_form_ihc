# Arquitetura

A arquitetura é descrita com o [modelo C4](https://c4model.com), em três níveis de zoom:

1. **Contexto:** quem usa a ferramenta e com que sistemas ela se relaciona;
2. **Containers:** as partes que rodam separadas (aplicação, banco, gerador de PDF, scripts) e como se falam;
3. **Componentes:** como a aplicação Next.js se organiza por dentro.

Os diagramas usam Mermaid, que o GitHub desenha direto na página. Cada caixa traz o nome, o tipo entre colchetes e a tecnologia. As setas dizem o que passa e por qual protocolo.

## Visão geral

A Ferramenta UEQ é uma aplicação web única em **Next.js 16 (App Router)** com **React 19** e **TypeScript strict**, que guarda os dados num **PostgreSQL 16** pelo **Prisma 7**.

- Não existe uma API REST separada. As páginas são Server Components que leem o banco no servidor. As escritas são Server Actions chamadas pelos formulários.
- Só os downloads (CSV e PDF) são rotas de API, porque devolvem arquivo.
- O cálculo do UEQ fica isolado em `src/ueq/`, em funções puras, para ser testado contra a planilha oficial sem banco nem interface.
- Os parâmetros do protocolo, o benchmark e os textos oficiais dos 37 idiomas são arquivos JSON versionados em `data/`, com a fonte de cada valor.

## Nível 1 · Contexto

```mermaid
flowchart TB
    pesquisador["<b>Pesquisador</b><br/>[Pessoa]<br/>Cria estudos, acompanha a coleta,<br/>interpreta e exporta os resultados"]
    participante["<b>Participante</b><br/>[Pessoa]<br/>Responde o questionário pelo link,<br/>sem conta e de forma anônima"]
    mantenedor["<b>Mantenedor</b><br/>[Pessoa]<br/>Instala, carrega os itens oficiais<br/>e ajusta os parâmetros"]

    ferramenta["<b>Ferramenta UEQ</b><br/>[Sistema de software]<br/>Conduz estudos com o User Experience<br/>Questionnaire, do cadastro à exportação"]

    planilha["<b>UEQ Data Analysis Tool</b><br/>[Sistema externo · planilha Excel V15]<br/>Ferramenta oficial de análise do UEQ"]
    ueqonline["<b>ueq-online.org</b><br/>[Sistema externo]<br/>Handbook, pacote de idiomas<br/>e benchmark oficiais"]
    whatsapp["<b>Canais de mensagem</b><br/>[Sistema externo]<br/>WhatsApp, e-mail"]

    pesquisador -- "usa pelo navegador<br/>[HTTPS]" --> ferramenta
    participante -- "responde pelo link /r/slug<br/>[HTTPS]" --> ferramenta
    mantenedor -- "roda migrations, seed<br/>e recálculo [CLI]" --> ferramenta
    pesquisador -- "envia o link do estudo" --> whatsapp
    whatsapp -- "entrega o link" --> participante
    pesquisador -- "cola o CSV exportado<br/>para conferir os números" --> planilha
    mantenedor -- "copia itens, instruções,<br/>limiares e benchmark para data/" --> ueqonline

    classDef pessoa fill:#0F1720,stroke:#0F1720,color:#FFFFFF
    classDef sistema fill:#0B6A78,stroke:#0F1720,color:#FFFFFF
    classDef externo fill:#F3F5F7,stroke:#7A8691,color:#0F1720
    class pesquisador,participante,mantenedor pessoa
    class ferramenta sistema
    class planilha,ueqonline,whatsapp externo
```

A ferramenta não chama nenhum sistema externo em tempo de execução. A planilha oficial e o site do UEQ entram por pessoas: a equipe copia os dados oficiais para `data/` (com a fonte em cada arquivo) e o pesquisador cola a exportação na planilha para conferir.

## Nível 2 · Containers

```mermaid
flowchart TB
    pesquisador["<b>Pesquisador</b><br/>[Pessoa]"]
    participante["<b>Participante</b><br/>[Pessoa]"]
    mantenedor["<b>Mantenedor</b><br/>[Pessoa]"]

    subgraph fronteira["Ferramenta UEQ"]
        direction TB
        navegador["<b>Interface no navegador</b><br/>[Container · React 19, CSS Modules]<br/>HTML renderizado no servidor e Client Components<br/>só onde há interação: questionário, filtros,<br/>formulários, confirmações em linha"]
        app["<b>Aplicação web</b><br/>[Container · Next.js 16 App Router, Node.js 24]<br/>Server Components, Server Actions,<br/>Route Handlers e proxy de sessão.<br/>Contém o módulo de cálculo src/ueq"]
        pdf["<b>Gerador de PDF</b><br/>[Container · Chromium sem tela via Playwright]<br/>Aberto sob demanda pela aplicação<br/>para imprimir o painel em A4"]
        banco[("<b>Banco de dados</b><br/>[Container · PostgreSQL 16]<br/>Pesquisadores, sessões, estudos, versões,<br/>itens, participações e respostas")]
        dados[/"<b>Dados oficiais</b><br/>[Container · arquivos JSON em data/]<br/>Itens, instruções e textos dos 37 idiomas,<br/>protocolo e benchmark, com a fonte"/]
        scripts["<b>Scripts de manutenção</b><br/>[Container · Prisma CLI e tsx]<br/>migrate, seed dos itens,<br/>recálculo de suspeitas"]
    end

    pesquisador -- "usa [HTTPS]" --> navegador
    participante -- "usa [HTTPS]" --> navegador
    mantenedor -- "roda [pnpm]" --> scripts

    navegador -- "pede páginas e chama Server Actions<br/>[HTTPS, RSC]; baixa CSV e PDF [HTTPS GET]" --> app
    app -- "lê e grava<br/>[SQL via Prisma Client e adapter pg]" --> banco
    app -- "importa na compilação<br/>[import JSON]" --> dados
    app -- "abre a página de impressão<br/>com a sessão de quem pediu [HTTP interno]" --> pdf
    pdf -- "GET /estudos/id/resultados/impressao<br/>[HTTP, origem interna]" --> app
    scripts -- "aplica migrations, grava itens,<br/>atualiza suspeitas [SQL]" --> banco
    scripts -- "lê e valida com Zod" --> dados

    classDef pessoa fill:#0F1720,stroke:#0F1720,color:#FFFFFF
    classDef container fill:#0B6A78,stroke:#0F1720,color:#FFFFFF
    classDef armazenamento fill:#E6F2F4,stroke:#0B6A78,color:#0F1720
    class pesquisador,participante,mantenedor pessoa
    class navegador,app,pdf,scripts container
    class banco,dados armazenamento
```

| Container | Tecnologia | Responsabilidade | Onde está |
|---|---|---|---|
| Interface no navegador | React 19, CSS Modules, variáveis CSS, SVG feito à mão | Mostrar as telas e tratar a interação. Sem biblioteca de componentes nem de gráficos | `src/app/**/*.tsx` com `"use client"`, `src/componentes/`, `src/graficos/`, `src/styles/` |
| Aplicação web | Next.js 16, Node.js 24, Zod 4, bcryptjs | Renderizar as páginas, validar e gravar dados, proteger a área do pesquisador, gerar exportações | `src/app/`, `src/lib/`, `src/ueq/`, `src/idiomas/`, `src/proxy.ts` |
| Gerador de PDF | Playwright 1.64 (Chromium) | Imprimir o painel em PDF com gráficos em vetor | `src/app/api/estudos/[id]/painel-pdf/route.ts` |
| Banco de dados | PostgreSQL 16 (Docker no desenvolvimento) | Persistir o modelo de domínio, com cascata e `CHECK` | `prisma/schema.prisma`, `prisma/migrations/`, `docker-compose.yml` |
| Dados oficiais | JSON versionado | Fonte única dos itens, instruções, protocolo e benchmark, cada um com o campo `fonte` | `data/` |
| Documentação | Markdown e SVG versionados | Os documentos que a aba Documentação mostra, e os diagramas já desenhados | `docs/`, `docs/documentacao/diagramas/` |
| Scripts de manutenção | Prisma CLI, tsx | Criar o banco, carregar os itens, recalcular suspeitas | `prisma/seed.ts`, `prisma/recalcular-suspeitas.ts`, `package.json` |

## Nível 3 · Componentes da aplicação web

```mermaid
flowchart TB
    navegador["<b>Interface no navegador</b><br/>[Container]"]
    pdf["<b>Gerador de PDF</b><br/>[Container]"]
    banco[("<b>PostgreSQL</b><br/>[Container]")]
    dados[/"<b>data/*.json</b><br/>[Container]"/]
    docsMd[/"<b>docs/*.md</b><br/>[arquivos do repositório]"/]

    subgraph app["Aplicação web · Next.js"]
        direction TB
        proxy["<b>Proxy de sessão</b><br/>[src/proxy.ts]<br/>Manda para Entrar quem não tem cookie,<br/>guardando a página pedida"]

        subgraph rotas["Rotas"]
            direction LR
            acesso["<b>Acesso</b><br/>[app/(ferramenta)/(acesso)]<br/>Entrar, Criar conta"]
            areaPesq["<b>Área do pesquisador</b><br/>[app/(ferramenta)/(pesquisador)]<br/>Estudos, Resultados, Respostas,<br/>Importar, Minha conta"]
            areaPart["<b>Link do participante</b><br/>[app/r/[slug]]<br/>Layout raiz próprio com lang e dir;<br/>consentimento, questionário,<br/>dados opcionais, fim"]
            api["<b>Rotas de download</b><br/>[app/api/estudos/[id]]<br/>exportar/[tipo], painel-pdf"]
            areaDoc["<b>Documentação, pública</b><br/>[app/(ferramenta)/(publico)/documentacao<br/>e app/api/documentacao]<br/>Seções, sub-abas, diagramas e downloads"]
        end

        subgraph servicos["Serviços · src/lib"]
            direction LR
            sessao["<b>Sessão</b><br/>sessao.ts, cookie-sessao.ts<br/>token, hash, exigirPesquisador"]
            estudos["<b>Estudos</b><br/>estudos.ts, validacao-estudo.ts,<br/>status-estudo.ts, periodo.ts<br/>dono, slug, regras"]
            participacao["<b>Participação</b><br/>participacao.ts, balanceamento.ts,<br/>demografia.ts, itens-ueq.ts<br/>estudo público, cookies, versão"]
            resultados["<b>Resultados</b><br/>resultados.ts, participacoes.ts,<br/>leitura-rapida.ts"]
            arquivos["<b>Arquivos</b><br/>exportacoes.ts, exportar-estudo.ts,<br/>csv.ts, importacao.ts"]
            banco_lib["<b>Acesso ao banco</b><br/>banco.ts + Prisma Client<br/>gerado em src/generated/prisma"]
        end

        ueq["<b>Módulo de cálculo</b><br/>[src/ueq · funções puras]<br/>recodificação, estatística, escalas,<br/>alfa, benchmark, inconsistência"]
        idiomas["<b>Idiomas</b><br/>[src/idiomas]<br/>37 idiomas, negociação pelo navegador,<br/>textos tipados, plural e listas"]
        ui["<b>Componentes e gráficos</b><br/>[src/componentes, src/graficos]<br/>ItemDiferencial, formulários,<br/>EscalasComBenchmark, MediasPorItem"]
        docsLib["<b>Leitor de documentos</b><br/>[src/lib/documentacao]<br/>catálogo, Markdown com marked,<br/>links e âncoras como no GitHub"]
    end

    navegador --> proxy
    proxy --> acesso
    proxy --> areaPesq
    proxy --> api
    navegador --> areaDoc
    navegador --> areaPart

    acesso --> sessao
    areaPesq --> sessao
    areaPesq --> estudos
    areaPesq --> resultados
    areaPesq --> arquivos
    areaPesq --> ui
    areaPart --> participacao
    areaPart --> idiomas
    areaPart --> ui
    areaPart --> ueq
    api --> sessao
    api --> arquivos
    api -- "abre a impressão" --> pdf
    areaDoc -- "escolhe a barra" --> sessao
    areaDoc --> docsLib
    docsLib -. ".md e SVG dos diagramas" .-> docsMd

    resultados --> ueq
    arquivos --> ueq
    arquivos --> resultados
    sessao --> banco_lib
    estudos --> banco_lib
    participacao --> banco_lib
    resultados --> banco_lib
    arquivos --> banco_lib
    banco_lib -- "SQL" --> banco

    resultados -. "protocolo e benchmark" .-> dados
    idiomas -. "termos e instruções" .-> dados
    areaPart -. "protocolo" .-> dados
```

O link do participante e a documentação não passam pelo proxy: o `matcher` de `src/proxy.ts` exclui `/r/`, `/entrar`, `/cadastrar`, `/documentacao` e `/api/documentacao`. Toda rota nova do pesquisador já nasce protegida. O link do participante tem layout raiz próprio, sem barra e sem link para o resto da ferramenta: quem responde só vê o formulário e o seletor de idioma.

### Regras de dependência

- **`src/ueq/` não depende de nada do projeto.** Não importa Prisma, React, Next nem `src/lib`. Recebe números e devolve objetos. É o que permite testá-lo contra a planilha oficial.
- **Componentes e gráficos não sabem de Prisma.** Recebem dados prontos por props.
- **Toda página, Server Action e rota do pesquisador confere a sessão no banco e o dono do estudo**, não só o proxy.
- **As rotas do participante só leem o que o participante pode ver:** título, produto, objetivo e status do estudo. Nada do pesquisador e nada da análise.
- **Parâmetros do protocolo nunca ficam no código.** Vêm de `data/protocolo.json` e `data/benchmark.json`.

## Decisões de arquitetura

| Decisão | Por quê | Consequência |
|---|---|---|
| Server Components e Server Actions em vez de API REST | Menos código entre a tela e o banco; validação com Zod no servidor em cada ação; formulários funcionam com o comportamento nativo do navegador | A ferramenta não oferece API pública. Integrações usam as exportações em CSV |
| Cálculo em funções puras em `src/ueq/` | O número tem que bater com a planilha oficial; funções puras são testáveis com fixtures e bordas | Quem busca os dados (`src/lib/resultados.ts`) só monta a entrada e repassa |
| Sessão guardada no banco, com o hash do token | Trocar a senha encerra as outras sessões; quem lê o banco não consegue montar um cookie | Cada página do pesquisador faz uma consulta de sessão (com `cache` do React por requisição) |
| Dois layouts raiz: ferramenta em pt-BR e link do participante | O `<html lang>` e o `dir` do participante seguem o idioma escolhido (WCAG 3.1.1), incluindo árabe, hebraico e persa | `experimental.globalNotFound` em `next.config.ts` para a página 404 |
| Gráficos em SVG feitos à mão | Controle total de `title`, `desc`, contraste, formas por versão e reorganização em tela estreita | Sem biblioteca de gráficos para atualizar |
| PDF gerado por Chromium no servidor | O PDF sai igual ao painel, com gráficos em vetor e as mesmas fontes | O servidor precisa do navegador do Playwright instalado |
| Documentação lida dos mesmos `.md` do repositório, com os diagramas desenhados antes, em SVG (`pnpm docs:diagramas`) | Um arquivo só para o GitHub e para a ferramenta; a ferramenta não carrega a biblioteca Mermaid e cada diagrama vira imagem com texto alternativo | Mudar um diagrama exige gerar o SVG de novo; um teste de unidade avisa |
| Dados oficiais em JSON versionado | Cada número tem fonte rastreável e muda por pull request, não no código | Mudar um limiar exige `pnpm suspeitas:recalcular` para atualizar as participações já gravadas |
| Cookies do participante restritos a `/r/<slug>` | Anonimato: só o id aleatório da participação, a marca de já respondido e o idioma | A proteção contra envio duplicado vale por navegador, não por pessoa |

## Implantação

Hoje a ferramenta roda localmente. O passo a passo está no [README](../../README.md#como-rodar).

```mermaid
flowchart LR
    subgraph maquina["Máquina do desenvolvedor"]
        direction TB
        node["<b>Node.js 24 + pnpm 10</b><br/>pnpm dev · next dev na porta 3000"]
        chromium["<b>Chromium do Playwright</b><br/>pdf e testes e2e"]
        subgraph docker["Docker"]
            pg[("<b>postgres:16</b><br/>porta 5432<br/>volume ueq-postgres")]
        end
    end
    navegador["Navegador<br/>http://localhost:3000"] --> node
    node -- "DATABASE_URL" --> pg
    node --> chromium
```

Para publicar num servidor, o mesmo desenho vale com:

| Item | O que configurar |
|---|---|
| `DATABASE_URL` | Conexão com o PostgreSQL de produção |
| `NODE_ENV=production` | Liga o atributo `secure` dos cookies de sessão e do participante |
| `PORT` e `URL_INTERNA` | Endereço pelo qual a rota do PDF alcança a própria aplicação. Sem `URL_INTERNA`, vale `http://localhost:$PORT` |
| HTTPS | Obrigatório: os cookies `secure` só trafegam por HTTPS |
| Navegador do Playwright | `pnpm exec playwright install chromium` no servidor, para o PDF |
| Banco | `pnpm prisma migrate deploy` e `pnpm db:seed` na primeira vez |

`PESQUISADOR_TESTE_EMAIL` e `PESQUISADOR_TESTE_SENHA` servem só ao seed de desenvolvimento e não devem existir em produção.

## Estrutura de pastas

```
src/
  app/
    (ferramenta)/         layout raiz em pt-BR
      (acesso)/           Entrar e Criar conta
      (pesquisador)/      Estudos, Resultados, Respostas, Importar, Minha conta
    r/[slug]/             link do participante, com layout raiz próprio (lang e dir do idioma)
    api/estudos/[id]/     downloads: exportar/[tipo] e painel-pdf
  ueq/                    cálculo do UEQ em funções puras
  lib/                    sessão, estudos, participação, resultados, CSV, importação
  idiomas/                37 idiomas: textos tipados, negociação, plural
  componentes/            ItemDiferencial, formulários, avisos
  graficos/               EscalasComBenchmark e MediasPorItem em SVG
  styles/                 tokens de cor, tipografia e espaçamento
  proxy.ts                checagem otimista de sessão
scripts/                  geração dos SVG dos diagramas da documentação
prisma/                   schema, migrations, seed e recálculo de suspeitas
data/                     itens, instruções, idiomas, protocolo, benchmark e fixtures
tests/e2e/                Playwright com axe-core
docs/                     especificação, requisitos de IHC, protótipos e esta documentação
```
