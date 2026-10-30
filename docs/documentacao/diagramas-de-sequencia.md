# Diagramas de sequência

Seis diagramas mostram como as partes da ferramenta conversam nos fluxos mais importantes. Os participantes de cada diagrama são os blocos da [arquitetura](arquitetura.md):

- **Navegador:** a página React no navegador da pessoa (Client Components e formulários);
- **proxy:** [`src/proxy.ts`](../../src/proxy.ts), que roda antes de cada requisição;
- **Página:** um Server Component do App Router;
- **Ação:** uma Server Action (`"use server"`);
- **Rota de API:** um Route Handler em `src/app/api/`;
- **lib:** os serviços de `src/lib/` (sessão, estudos, participação, resultados…);
- **ueq:** o módulo de cálculo [`src/ueq/`](../../src/ueq/), funções puras;
- **PostgreSQL:** o banco, acessado pelo Prisma.

Seta cheia é chamada; seta tracejada é resposta.

| Diagrama | Caso de uso | Requisitos principais |
|---|---|---|
| [1. Entrar e voltar à página pedida](#1-entrar-e-voltar-à-página-pedida) | a definir | a definir |
| [2. Responder o questionário](#2-responder-o-questionário) | a definir | a definir |
| [3. Ver resultados](#3-ver-resultados) | a definir | a definir |
| [4. Tirar uma participação da análise](#4-tirar-uma-participação-da-análise) | a definir | a definir |
| [5. Exportar o painel em PDF](#5-exportar-o-painel-em-pdf) | a definir | a definir |
| [6. Importar respostas por CSV](#6-importar-respostas-por-csv) | a definir | a definir |

## 1. Entrar e voltar à página pedida

O proxy só confere se existe o cookie. Quem garante que a sessão vale é a consulta ao banco, feita em toda página e ação do pesquisador.

```mermaid
sequenceDiagram
    autonumber
    actor Pesq as Pesquisador
    participant Nav as Navegador
    participant Proxy as proxy
    participant Acao as Ação entrar
    participant Sessao as lib/sessao
    participant BD as PostgreSQL

    Pesq->>Nav: abre /estudos/abc/resultados
    Nav->>Proxy: GET /estudos/abc/resultados (sem cookie)
    Proxy-->>Nav: redireciona para /entrar?voltar=/estudos/abc/resultados
    Pesq->>Nav: digita e-mail e senha e clica em Entrar
    Nav->>Acao: entrar(FormData)
    Acao->>Acao: valida os campos com Zod
    Acao->>BD: busca o pesquisador pelo e-mail
    BD-->>Acao: pesquisador com senhaHash
    Acao->>Acao: bcrypt.compare(senha, senhaHash)
    alt e-mail ou senha não conferem
        Acao-->>Nav: erro "E-mail ou senha não conferem…"
        Nav-->>Pesq: resumo de erros com o foco
    else conferem
        Acao->>Sessao: criarSessao(pesquisadorId)
        Sessao->>Sessao: gera token aleatório de 32 bytes
        Sessao->>BD: apaga sessões vencidas e cria Sessao com id = SHA-256(token)
        Sessao-->>Nav: cookie "sessao" httpOnly, sameSite lax, 7 dias
        Acao-->>Nav: redireciona para destinoInterno(voltar)
        Nav->>Proxy: GET /estudos/abc/resultados (com cookie)
        Proxy-->>Nav: segue
        Note over Nav,BD: a página chama exigirPesquisador, que procura a sessão pelo hash do token e confere a validade
        Nav-->>Pesq: painel de resultados
    end
```

## 2. Responder o questionário

Nada sobre a pessoa é gravado antes do consentimento, e nenhuma resposta é gravada antes do envio completo.

```mermaid
sequenceDiagram
    autonumber
    actor Part as Participante
    participant Nav as Navegador
    participant Pag as Páginas /r/[slug]
    participant Acao as Ações /r/[slug]
    participant Lib as lib/participacao e lib/balanceamento
    participant Ueq as ueq
    participant BD as PostgreSQL

    Part->>Nav: abre /r/<slug>
    Nav->>Pag: GET (Accept-Language do navegador)
    Pag->>Lib: estudoPublico(slug) e idiomaDoParticipante()
    Lib->>BD: estudo pelo slug, com versões e respostas concluídas por versão
    alt estudo em rascunho, encerrado ou link já respondido
        Pag-->>Nav: aviso da situação, sem consentimento
    else estudo aberto
        Pag-->>Nav: termo de consentimento no idioma negociado
    end

    Part->>Nav: Concordo e quero participar
    Nav->>Acao: consentir(slug)
    Acao->>Lib: versaoComMenosRespostas(versões)
    Lib-->>Acao: versão com menos respostas concluídas
    Acao->>BD: cria Participacao (versão, consentiuEm, idioma)
    Acao-->>Nav: cookie ueq_participacao no caminho /r/<slug> e redireciona ao questionário

    Nav->>Pag: GET /r/<slug>/questionario
    Pag->>BD: 26 itens (ordem e polaridade oficiais)
    Pag-->>Nav: instrução oficial e 26 itens, nenhum marcado
    loop a cada marcação
        Part->>Nav: marca uma posição
        Nav->>Nav: atualiza o progresso e guarda o rascunho no sessionStorage
    end

    Part->>Nav: Enviar respostas
    Nav->>Nav: confere no navegador se os 26 estão marcados
    Nav->>Acao: enviarRespostas(slug, valores)
    Acao->>Acao: confere os 26 valores de 1 a 7 de novo no servidor
    alt falta algum item
        Acao-->>Nav: { faltando: [7, 19] }
        Nav-->>Part: resumo "Faltam 2 itens" com o foco e links para os itens
    else completo
        Acao->>Ueq: avaliarSuspeita(valores, itens, protocolo)
        Ueq-->>Acao: { suspeita, motivos, amplitudes }
        Acao->>BD: transação: cria 26 Respostas e marca concluidaEm e suspeita
        Acao-->>Nav: cookie ueq_respondido (30 dias) e redireciona a /sobre-voce
    end

    Part->>Nav: responde os dados opcionais ou pula a etapa
    Nav->>Acao: salvarDemografia(slug, FormData)
    opt clicou em Continuar e respondeu algo
        Acao->>BD: grava demografia (só opções da lista)
    end
    Acao-->>Nav: apaga o cookie ueq_participacao e redireciona a /fim
    Nav-->>Part: Respostas registradas
```

## 3. Ver resultados

Todo cálculo estatístico acontece em `src/ueq`. A página só busca, organiza por versão e desenha.

```mermaid
sequenceDiagram
    autonumber
    actor Pesq as Pesquisador
    participant Nav as Navegador
    participant Pag as Página resultados
    participant Sessao as lib/sessao
    participant Estudos as lib/estudos
    participant Res as lib/resultados
    participant Ueq as ueq
    participant BD as PostgreSQL

    Pesq->>Nav: abre /estudos/abc/resultados?versao=v2
    Nav->>Pag: GET com searchParams
    Pag->>Sessao: exigirPesquisador()
    Sessao->>BD: sessão pelo hash do token, ainda válida
    BD-->>Sessao: pesquisador
    Pag->>Estudos: estudoDoPesquisador(id, pesquisadorId)
    Estudos->>BD: estudo com esse id e esse dono
    alt estudo não existe ou é de outra pessoa
        Estudos-->>Nav: 404, igual nos dois casos
    else estudo do pesquisador
        Pag->>Res: analisarResultados(estudoId, versões)
        Res->>BD: itens e participações concluídas, com respostas
        Res->>Res: monta 26 valores por participação e separa por versão
        Res->>Ueq: analisarEstudo(todas, itens, protocolo e benchmark)
        loop para cada versão
            Res->>Ueq: analisarEstudo(da versão, itens, config)
        end
        Ueq-->>Res: AnaliseEstudo (escalas, grupos, itens, participantes)
        Res-->>Pag: análise de todas e por versão
        Pag->>Pag: leitura rápida, gráfico SVG com title e desc, tabelas
        Pag-->>Nav: HTML do painel
        Nav-->>Pesq: painel da versão v2
    end
    Pesq->>Nav: escolhe "Comparar versões"
    Nav->>Pag: GET ?modo=comparar (a URL guarda a visão)
```

## 4. Tirar uma participação da análise

Excluir da análise só muda um campo. Nada é apagado, e a mudança aparece no painel e nas exportações.

```mermaid
sequenceDiagram
    autonumber
    actor Pesq as Pesquisador
    participant Nav as Navegador
    participant Acao as Ação alterarInclusao
    participant Sessao as lib/sessao
    participant Estudos as lib/estudos
    participant BD as PostgreSQL

    Pesq->>Nav: desmarca "Na análise" numa linha de Respostas
    Nav->>Acao: alterarInclusao(estudoId, participacaoId, false)
    Acao->>Sessao: exigirPesquisador()
    Acao->>Estudos: estudoDoPesquisador(estudoId, pesquisadorId)
    Acao->>BD: participação com esse id, deste estudo e concluída
    alt não encontrada
        Acao-->>Nav: erro "Essa participação não está neste estudo…"
    else encontrada
        Acao->>BD: incluidaNaAnalise = false
        Acao->>Acao: revalidatePath do estudo (painel, respostas, exportações)
        Acao-->>Nav: "Participação de … saiu da análise. Nada foi apagado…"
        Nav-->>Pesq: aviso em role="status"
    end
```

## 5. Exportar o painel em PDF

O servidor abre a página de impressão num Chromium sem tela, com a sessão de quem pediu, e devolve o PDF.

```mermaid
sequenceDiagram
    autonumber
    actor Pesq as Pesquisador
    participant Nav as Navegador
    participant Rota as Rota de API painel-pdf
    participant Sessao as lib/sessao
    participant Chrome as Chromium (Playwright)
    participant Imp as Página impressao
    participant BD as PostgreSQL

    Pesq->>Nav: Exportar painel em PDF
    Nav->>Rota: GET /api/estudos/abc/painel-pdf?versao=v2
    Rota->>Sessao: pesquisadorDaSessao()
    alt sem sessão
        Rota-->>Nav: 401 "Entre na sua conta…"
    else com sessão
        Rota->>BD: estudo com esse id e esse dono
        alt estudo não encontrado ou de outra pessoa
            Rota-->>Nav: 404 "Estudo não encontrado."
        else estudo do pesquisador
            Rota->>Chrome: launch() e cookie de sessão para a origem interna
            Chrome->>Imp: GET /estudos/abc/resultados/impressao?versao=v2
            Note over Imp,BD: mesma consulta e mesmo cálculo do diagrama 3
            Imp-->>Chrome: HTML com CSS de impressão (A4, 18 mm)
            Chrome->>Chrome: espera as fontes, emula mídia print
            Chrome-->>Rota: PDF com gráficos em vetor
            Rota->>Chrome: close()
            Rota-->>Nav: application/pdf, attachment, ueq_<titulo>_painel_<data>.pdf
        end
    end
```

A rota usa sempre a origem interna do servidor, nunca o cabeçalho `Host` da requisição, para o cookie de sessão não ir para outro domínio.

## 6. Importar respostas por CSV

Dois passos: a prévia lê sem gravar; a confirmação grava tudo numa transação.

```mermaid
sequenceDiagram
    autonumber
    actor Pesq as Pesquisador
    participant Nav as Navegador
    participant Acao as Ações importar
    participant Imp as lib/importacao
    participant Ueq as ueq
    participant BD as PostgreSQL

    Pesq->>Nav: escolhe a versão e o arquivo e clica em "Ver prévia"
    Nav->>Acao: previsualizarImportacao(estudoId, FormData)
    Acao->>Acao: confere sessão, dono, versão, extensão e tamanho (até 500 KB)
    Acao->>Imp: lerCsvDeRespostas(texto)
    Imp-->>Acao: linhas válidas e erros por linha
    Acao-->>Nav: prévia das 5 primeiras linhas, total e erros
    alt alguma linha com erro
        Nav-->>Pesq: problema de cada linha, sem botão de confirmar
    else arquivo inteiro válido
        Pesq->>Nav: confirma
        Nav->>Acao: confirmarImportacao(estudoId, versaoId, texto)
        Acao->>Imp: lerCsvDeRespostas(texto) de novo
        loop para cada linha
            Acao->>Ueq: avaliarSuspeita(valores, itens, protocolo)
        end
        Acao->>BD: transação: uma Participacao IMPORTADA, concluída e sem idioma, com 26 Respostas, por linha
        Acao-->>Nav: redireciona a Respostas com "N importadas"
        Nav-->>Pesq: as linhas aparecem marcadas "importada de CSV"
    end
```

O servidor lê o arquivo de novo na confirmação: a prévia não é confiável só porque veio do navegador.
