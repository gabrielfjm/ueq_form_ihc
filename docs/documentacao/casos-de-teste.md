# Casos e cenários de teste

Os testes que já existem na Ferramenta UEQ, organizados em **18 cenários** e **128 casos de teste**: 52 de ponta a ponta, 57 de unidade e 19 manuais. Cada caso aponta o arquivo do teste, os requisitos que verifica e o resultado da última execução.

A mesma lista está nas abas Cenários de teste e Casos de teste de [planilha-requisitos.xlsx](planilha-requisitos.xlsx) e em [casos-de-teste.csv](casos-de-teste.csv). A coluna Casos de teste da [matriz de rastreabilidade](matriz-rastreabilidade.md) liga cada requisito aos casos que o verificam.

## Execução de 30/10/2026

| Nível | Ferramenta | Casos | Execuções | Passaram | Pulados | Falharam |
|---|---|---|---|---|---|---|
| Ponta a ponta | Playwright 1.64 + axe-core 4.14 | 52 | 104 | 104 | 0 | 0 |
| Unidade | Vitest 5 | 57 | 258 | 250 | 8 | 0 |
| Manual | Pessoas da equipe | 19 | — | — | — | — |

- **Ponta a ponta:** cada um dos 52 casos rodou duas vezes, no Chrome de desktop e no Chrome de celular (Pixel 7). As 104 execuções passaram.
- **Unidade:** 258 execuções, porque alguns casos são parametrizados (um por idioma, um por par de cores). 8 ficaram puladas de propósito: esperam dados que só a equipe pode copiar das fontes oficiais ([CT-U29](#ct-u29) e [CT-U53](#ct-u53)).
- **Manual:** a checklist de [docs/checklist-manual.md](../checklist-manual.md) e as conferências que dependem de pessoas ainda estão por fazer.

## Estratégia

### Níveis

| Nível | O que verifica | Onde fica | Como roda |
|---|---|---|---|
| Unidade | Funções puras: cálculo do UEQ, regras de suspeita, CSV, importação, leitura rápida, idiomas e contraste das cores | `src/**/__tests__/*.test.ts` | `pnpm test` (Vitest, ambiente Node, sem banco) |
| Ponta a ponta | A ferramenta inteira no navegador, do jeito que a pessoa usa: telas, banco, cookies, downloads e acessibilidade | `tests/e2e/*.spec.ts` | `pnpm test:e2e` (Playwright, com banco e servidor) |
| Acessibilidade automática | Violações WCAG 2.2 A e AA em cada tela e em cada estado de erro | `tests/e2e/acessibilidade.ts` (`verificarAcessibilidade`) | Dentro dos testes de ponta a ponta |
| Manual | O que a automação não vê: leitor de tela real, celular real, zoom, espaçamento de texto, compreensão e opinião de usuários | [docs/checklist-manual.md](../checklist-manual.md), [docs/roteiro-revisao.md](../roteiro-revisao.md) | Pela equipe, antes da entrega |

### Ambiente e dados

- **Projetos do Playwright:** `desktop` (Desktop Chrome) e `celular` (Pixel 7). Todo caso de ponta a ponta roda nos dois.
- **Servidor:** o Playwright sobe `pnpm dev` em http://localhost:3000 ou reaproveita o que já estiver rodando. O banco é o PostgreSQL do `docker compose`.
- **Isolamento:** cada caso cria o próprio pesquisador, com e-mail em `@e2e.exemplo.com`, e o próprio estudo. Por isso os casos rodam em paralelo (4 workers) sem depender um do outro. No fim, `tests/e2e/limpeza.ts` apaga só as contas desse domínio, nunca a conta de desenvolvimento.
- **Massa de dados:** as fixtures de [data/fixtures/](../../data/fixtures/), no formato da planilha oficial: `basico` (20 participantes, nenhum suspeito), `inconsistente` (15, com as linhas 1, 6, 9 e 13 suspeitas) e `extremos` (todos 1, todos 7, n = 1 e n = 2). Os testes do painel gravam as fixtures direto no banco (`inserirRespostas` em `tests/e2e/preparacao.ts`), porque o fluxo do participante já tem os próprios casos.
- **Tempo:** 15 s de espera por verificação e 60 s por teste (120 s nos que criam estudo e respostas), porque o servidor de desenvolvimento compila cada rota na primeira visita.

### Critérios

- Nenhum pull request é integrado sem `pnpm lint && pnpm typecheck && pnpm test` passando.
- Uma tela só está pronta quando o axe-core não acha violação WCAG 2.2 A ou AA, inclusive nos estados de erro.
- Os números do cálculo têm de bater com a planilha oficial com tolerância de 1e-6 ([RNF07](requisitos.md#rnf07)).
- Nome de teste é a frase do comportamento esperado, em português ([docs/codigo.md](../codigo.md)). Por isso o título no código é também o resultado esperado de cada caso de unidade.

### Como rodar

```
docker compose up -d        # banco
pnpm test                   # unidade
pnpm test:e2e               # ponta a ponta, desktop e celular
pnpm exec playwright test tests/e2e/questionario.spec.ts --project=celular   # um arquivo, um projeto
pnpm exec playwright show-report   # relatório com as capturas de daltonismo do CT-E32
```

## Cenários

| ID | Cenário | Objetivo | Requisitos | Casos de teste | Situação |
|---|---|---|---|---|---|
| <a id="cn01"></a>CN01 | **Acesso e autenticação** | Cadastrar, entrar, sair e proteger a área do pesquisador, só com teclado e sem violações de acessibilidade | [RF01](requisitos.md#rf01), [RF02](requisitos.md#rf02), [RF03](requisitos.md#rf03), [RF04](requisitos.md#rf04), [RNF02](requisitos.md#rnf02), [RNF13](requisitos.md#rnf13), [RNF14](requisitos.md#rnf14) | [CT-E01](casos-de-teste.md#ct-e01), [CT-E02](casos-de-teste.md#ct-e02), [CT-E03](casos-de-teste.md#ct-e03), [CT-E04](casos-de-teste.md#ct-e04), [CT-E06](casos-de-teste.md#ct-e06), [CT-E07](casos-de-teste.md#ct-e07), [CT-E08](casos-de-teste.md#ct-e08) | Passou |
| <a id="cn02"></a>CN02 | **Minha conta** | Editar dados, trocar a senha derrubando outras sessões e excluir a conta com confirmação | [RF05](requisitos.md#rf05), [RF06](requisitos.md#rf06), [RF07](requisitos.md#rf07), [RF08](requisitos.md#rf08), [RNF10](requisitos.md#rnf10) | [CT-E09](casos-de-teste.md#ct-e09), [CT-E10](casos-de-teste.md#ct-e10), [CT-E11](casos-de-teste.md#ct-e11) | Passou |
| <a id="cn03"></a>CN03 | **Gestão de estudos** | Criar, listar, editar, abrir, encerrar, reabrir, copiar o link e excluir estudos | [RF09](requisitos.md#rf09), [RF10](requisitos.md#rf10), [RF11](requisitos.md#rf11), [RF12](requisitos.md#rf12), [RF13](requisitos.md#rf13), [RF14](requisitos.md#rf14), [RF15](requisitos.md#rf15), [RF16](requisitos.md#rf16) | [CT-E12](casos-de-teste.md#ct-e12), [CT-E13](casos-de-teste.md#ct-e13), [CT-E14](casos-de-teste.md#ct-e14), [CT-E15](casos-de-teste.md#ct-e15), [CT-E16](casos-de-teste.md#ct-e16), [CT-E17](casos-de-teste.md#ct-e17), [CT-E18](casos-de-teste.md#ct-e18), [CT-E19](casos-de-teste.md#ct-e19) | Passou |
| <a id="cn04"></a>CN04 | **Isolamento e proteção de dados** | Garantir que um pesquisador não veja nem exporte o estudo de outro e que o participante nunca precise de sessão | [RNF09](requisitos.md#rnf09), [RNF11](requisitos.md#rnf11) | [CT-E05](casos-de-teste.md#ct-e05), [CT-E20](casos-de-teste.md#ct-e20), [CT-E38](casos-de-teste.md#ct-e38), [CT-E41](casos-de-teste.md#ct-e41) | Passou |
| <a id="cn05"></a>CN05 | **Participação no estudo** | Percorrer o link do participante do consentimento ao fim, inclusive recusar, desistir, recarregar e tentar responder de novo | [RF16](requisitos.md#rf16), [RF17](requisitos.md#rf17), [RF18](requisitos.md#rf18), [RF20](requisitos.md#rf20), [RF21](requisitos.md#rf21), [RF22](requisitos.md#rf22), [RF23](requisitos.md#rf23), [RF24](requisitos.md#rf24), [RF25](requisitos.md#rf25), [RF26](requisitos.md#rf26), [RF27](requisitos.md#rf27) | [CT-U30](casos-de-teste.md#ct-u30), [CT-E21](casos-de-teste.md#ct-e21), [CT-E23](casos-de-teste.md#ct-e23), [CT-E26](casos-de-teste.md#ct-e26), [CT-E27](casos-de-teste.md#ct-e27), [CT-E28](casos-de-teste.md#ct-e28), [CT-E52](casos-de-teste.md#ct-e52) | Passou |
| <a id="cn06"></a>CN06 | **Acessibilidade do questionário** | Responder só com teclado e leitor de tela, em 320 px, com foco sempre visível e o instrumento intacto | [RF19](requisitos.md#rf19), [RF20](requisitos.md#rf20), [RNF01](requisitos.md#rnf01), [RNF02](requisitos.md#rnf02), [RNF03](requisitos.md#rnf03), [RNF06](requisitos.md#rnf06) | [CT-E22](casos-de-teste.md#ct-e22), [CT-E24](casos-de-teste.md#ct-e24), [CT-E25](casos-de-teste.md#ct-e25) | Passou |
| <a id="cn07"></a>CN07 | **Idiomas** | Responder em outro idioma, pelo navegador ou pelo seletor, inclusive da direita para a esquerda, e o pesquisador ver o idioma | [RF28](requisitos.md#rf28), [RF29](requisitos.md#rf29), [RF30](requisitos.md#rf30), [RF31](requisitos.md#rf31), [RNF15](requisitos.md#rnf15) | [CT-U36](casos-de-teste.md#ct-u36), [CT-U45](casos-de-teste.md#ct-u45), [CT-U46](casos-de-teste.md#ct-u46), [CT-U47](casos-de-teste.md#ct-u47), [CT-U48](casos-de-teste.md#ct-u48), [CT-U49](casos-de-teste.md#ct-u49), [CT-U50](casos-de-teste.md#ct-u50), [CT-E45](casos-de-teste.md#ct-e45), [CT-E46](casos-de-teste.md#ct-e46) | Passou |
| <a id="cn08"></a>CN08 | **Cálculo UEQ** | Conferir recodificação, estatística, escalas, alfa, benchmark e grupos em funções puras, com as bordas | [RF33](requisitos.md#rf33), [RF34](requisitos.md#rf34), [RF35](requisitos.md#rf35), [RNF08](requisitos.md#rnf08), [RNF16](requisitos.md#rnf16) | [CT-U01](casos-de-teste.md#ct-u01), [CT-U02](casos-de-teste.md#ct-u02), [CT-U03](casos-de-teste.md#ct-u03), [CT-U04](casos-de-teste.md#ct-u04), [CT-U05](casos-de-teste.md#ct-u05), [CT-U06](casos-de-teste.md#ct-u06), [CT-U07](casos-de-teste.md#ct-u07), [CT-U08](casos-de-teste.md#ct-u08), [CT-U09](casos-de-teste.md#ct-u09), [CT-U10](casos-de-teste.md#ct-u10), [CT-U11](casos-de-teste.md#ct-u11), [CT-U12](casos-de-teste.md#ct-u12), [CT-U13](casos-de-teste.md#ct-u13), [CT-U14](casos-de-teste.md#ct-u14), [CT-U15](casos-de-teste.md#ct-u15), [CT-U16](casos-de-teste.md#ct-u16), [CT-U17](casos-de-teste.md#ct-u17), [CT-U18](casos-de-teste.md#ct-u18), [CT-U20](casos-de-teste.md#ct-u20), [CT-U21](casos-de-teste.md#ct-u21), [CT-U22](casos-de-teste.md#ct-u22), [CT-M17](casos-de-teste.md#ct-m17) | Passou, com itens pendentes |
| <a id="cn09"></a>CN09 | **Respostas suspeitas** | Detectar suspeitas pelas duas regras, revisá-las e tirá-las da análise sem apagar | [RF36](requisitos.md#rf36), [RF42](requisitos.md#rf42), [RF43](requisitos.md#rf43) | [CT-U19](casos-de-teste.md#ct-u19), [CT-U23](casos-de-teste.md#ct-u23), [CT-U24](casos-de-teste.md#ct-u24), [CT-U25](casos-de-teste.md#ct-u25), [CT-U26](casos-de-teste.md#ct-u26), [CT-U27](casos-de-teste.md#ct-u27), [CT-U28](casos-de-teste.md#ct-u28), [CT-E33](casos-de-teste.md#ct-e33), [CT-E34](casos-de-teste.md#ct-e34), [CT-E35](casos-de-teste.md#ct-e35), [CT-E36](casos-de-teste.md#ct-e36), [CT-M16](casos-de-teste.md#ct-m16) | Passou, com itens pendentes |
| <a id="cn10"></a>CN10 | **Painel de resultados** | Mostrar os números do módulo UEQ, comparar versões, guardar a visão na URL e funcionar com daltonismo, alto contraste e 320 px | [RF37](requisitos.md#rf37), [RF38](requisitos.md#rf38), [RF39](requisitos.md#rf39), [RF40](requisitos.md#rf40), [RF41](requisitos.md#rf41), [RNF05](requisitos.md#rnf05) | [CT-U42](casos-de-teste.md#ct-u42), [CT-U43](casos-de-teste.md#ct-u43), [CT-U44](casos-de-teste.md#ct-u44), [CT-E29](casos-de-teste.md#ct-e29), [CT-E30](casos-de-teste.md#ct-e30), [CT-E31](casos-de-teste.md#ct-e31), [CT-E32](casos-de-teste.md#ct-e32) | Passou |
| <a id="cn11"></a>CN11 | **Exportação em CSV** | Baixar os quatro arquivos com nome datado, BOM e o formato de cada um | [RF45](requisitos.md#rf45), [RF46](requisitos.md#rf46), [RF47](requisitos.md#rf47), [RF48](requisitos.md#rf48), [RNF21](requisitos.md#rnf21) | [CT-U31](casos-de-teste.md#ct-u31), [CT-U32](casos-de-teste.md#ct-u32), [CT-U33](casos-de-teste.md#ct-u33), [CT-U34](casos-de-teste.md#ct-u34), [CT-U35](casos-de-teste.md#ct-u35), [CT-U37](casos-de-teste.md#ct-u37), [CT-U38](casos-de-teste.md#ct-u38), [CT-E37](casos-de-teste.md#ct-e37) | Passou |
| <a id="cn12"></a>CN12 | **Painel em PDF** | Baixar o painel em PDF e conferir a página de impressão | [RF49](requisitos.md#rf49) | [CT-E39](casos-de-teste.md#ct-e39), [CT-E40](casos-de-teste.md#ct-e40) | Passou |
| <a id="cn13"></a>CN13 | **Importação por CSV** | Importar respostas com prévia, recusar arquivo com erro e marcar as importadas | [RF50](requisitos.md#rf50), [RNF12](requisitos.md#rnf12), [RNF22](requisitos.md#rnf22) | [CT-U39](casos-de-teste.md#ct-u39), [CT-U40](casos-de-teste.md#ct-u40), [CT-U41](casos-de-teste.md#ct-u41), [CT-E42](casos-de-teste.md#ct-e42), [CT-E43](casos-de-teste.md#ct-e43), [CT-E44](casos-de-teste.md#ct-e44) | Passou |
| <a id="cn14"></a>CN14 | **Cores e contraste** | Garantir o contraste de todos os pares de cor do tema | [RNF04](requisitos.md#rnf04) | [CT-U51](casos-de-teste.md#ct-u51), [CT-U52](casos-de-teste.md#ct-u52) | Passou |
| <a id="cn15"></a>CN15 | **Validação contra a planilha oficial** | Comparar cada número da ferramenta com a UEQ Data Analysis Tool, com tolerância de 1e-6 | [RNF07](requisitos.md#rnf07) | [CT-U29](casos-de-teste.md#ct-u29), [CT-M15](casos-de-teste.md#ct-m15) | Pendente |
| <a id="cn16"></a>CN16 | **UEQ-S** | Conferir os 8 itens e o benchmark do UEQ-S quando a equipe preencher os dados | [RF51](requisitos.md#rf51) | [CT-U53](casos-de-teste.md#ct-u53) | Pendente |
| <a id="cn18"></a>CN18 | **Documentação na ferramenta** | Navegar pelas seções e documentos com e sem conta, seguir links e âncoras, ver os diagramas e baixar os arquivos, sem violações de acessibilidade | [RF52](requisitos.md#rf52), [RNF01](requisitos.md#rnf01), [RNF03](requisitos.md#rnf03), [RNF11](requisitos.md#rnf11), [RNF23](requisitos.md#rnf23) | [CT-U54](casos-de-teste.md#ct-u54), [CT-U55](casos-de-teste.md#ct-u55), [CT-U56](casos-de-teste.md#ct-u56), [CT-U57](casos-de-teste.md#ct-u57), [CT-E47](casos-de-teste.md#ct-e47), [CT-E48](casos-de-teste.md#ct-e48), [CT-E49](casos-de-teste.md#ct-e49), [CT-E50](casos-de-teste.md#ct-e50), [CT-E51](casos-de-teste.md#ct-e51) | Passou |
| <a id="cn17"></a>CN17 | **Verificação manual com pessoas** | O que a automação não vê: leitor de tela real, celular real, zoom, espaçamento de texto, avaliação heurística e teste com usuários | [RNF01](requisitos.md#rnf01), [RNF02](requisitos.md#rnf02), [RNF03](requisitos.md#rnf03), [RNF05](requisitos.md#rnf05), [RNF20](requisitos.md#rnf20) | [CT-M01](casos-de-teste.md#ct-m01), [CT-M02](casos-de-teste.md#ct-m02), [CT-M03](casos-de-teste.md#ct-m03), [CT-M04](casos-de-teste.md#ct-m04), [CT-M05](casos-de-teste.md#ct-m05), [CT-M06](casos-de-teste.md#ct-m06), [CT-M07](casos-de-teste.md#ct-m07), [CT-M08](casos-de-teste.md#ct-m08), [CT-M09](casos-de-teste.md#ct-m09), [CT-M10](casos-de-teste.md#ct-m10), [CT-M11](casos-de-teste.md#ct-m11), [CT-M12](casos-de-teste.md#ct-m12), [CT-M13](casos-de-teste.md#ct-m13), [CT-M14](casos-de-teste.md#ct-m14), [CT-M18](casos-de-teste.md#ct-m18), [CT-M19](casos-de-teste.md#ct-m19) | Manual, a fazer |

## Casos de ponta a ponta

Cada caso é um `test(...)` do Playwright. O título no código é o que aparece no relatório.

### CT-E01

**Quem abre a ferramenta sem conta cai na tela de entrada.**

| Campo | Valor |
|---|---|
| Cenário | [CN01 · Acesso e autenticação](#cn01) |
| Teste | `tests/e2e/inicial.spec.ts` › "a raiz leva quem não tem sessão para Entrar" |
| Pré-condições | Navegador sem cookie de sessão. |
| Requisitos | [RF04](requisitos.md#rf04) |
| Resultado em 30/10/2026 | Passou (celular e desktop) |

Passos:

1. Abrir /.

Resultado esperado: A URL termina em /entrar e o título de nível 1 é "Entrar".

### CT-E02

**O link de pular blocos é o primeiro elemento focável.**

| Campo | Valor |
|---|---|
| Cenário | [CN01 · Acesso e autenticação](#cn01) |
| Teste | `tests/e2e/inicial.spec.ts` › "o primeiro Tab leva ao link de pular para o conteúdo" |
| Pré-condições | Página /entrar aberta. |
| Requisitos | [RNF02](requisitos.md#rnf02) |
| Resultado em 30/10/2026 | Passou (celular e desktop) |

Passos:

1. Apertar Tab.
2. Apertar Enter.

Resultado esperado: O primeiro Tab foca "Pular para o conteúdo"; o Enter leva o foco para main#conteudo.

### CT-E03

**Cadastro, saída e entrada funcionam sem mouse.**

| Campo | Valor |
|---|---|
| Cenário | [CN01 · Acesso e autenticação](#cn01) |
| Teste | `tests/e2e/autenticacao.spec.ts` › "cadastra, sai e entra de novo usando só o teclado" |
| Pré-condições | E-mail de teste novo. |
| Requisitos | [RF01](requisitos.md#rf01), [RF02](requisitos.md#rf02), [RF03](requisitos.md#rf03), [RNF02](requisitos.md#rnf02) |
| Resultado em 30/10/2026 | Passou (celular e desktop) |

Passos:

1. Em /cadastrar, chegar a cada campo com Tab e digitar nome, e-mail e senha.
2. Apertar Enter.
3. Chegar com Tab ao botão Sair e apertar Enter.
4. Entrar de novo só com teclado.

Resultado esperado: Depois do cadastro aparece "Seus estudos". Sair leva a /entrar?aviso=saiu com "Você saiu da sua conta." em role=status. A nova entrada volta a /estudos.

### CT-E04

**A página pedida sem sessão é retomada depois do login.**

| Campo | Valor |
|---|---|
| Cenário | [CN01 · Acesso e autenticação](#cn01) |
| Teste | `tests/e2e/autenticacao.spec.ts` › "rota protegida sem sessão vai para Entrar e volta para ela depois do login" |
| Pré-condições | Conta criada; cookies apagados. |
| Requisitos | [RF04](requisitos.md#rf04) |
| Resultado em 30/10/2026 | Passou (celular e desktop) |

Passos:

1. Abrir /conta.
2. Entrar com a conta.

Resultado esperado: Primeiro a URL vira /entrar?voltar=%2Fconta; depois do login a pessoa está em /conta, com o título "Minha conta".

### CT-E05

**As rotas do participante não passam pela proteção de sessão.**

| Campo | Valor |
|---|---|
| Cenário | [CN04 · Isolamento e proteção de dados](#cn04) |
| Teste | `tests/e2e/autenticacao.spec.ts` › "participante nunca precisa de sessão" |
| Pré-condições | Navegador sem cookie. |
| Requisitos | [RNF09](requisitos.md#rnf09) |
| Resultado em 30/10/2026 | Passou (celular e desktop) |

Passos:

1. Abrir /r/qualquer-estudo.

Resultado esperado: A URL continua em /r/qualquer-estudo e a resposta não é o redirecionamento 307 para Entrar.

### CT-E06

**As telas de acesso não têm violação WCAG 2.2 A/AA, nem no estado de erro.**

| Campo | Valor |
|---|---|
| Cenário | [CN01 · Acesso e autenticação](#cn01) |
| Teste | `tests/e2e/autenticacao.spec.ts` › "Entrar e Criar conta passam no axe, inclusive com erro" |
| Pré-condições | Nenhuma. |
| Requisitos | [RF01](requisitos.md#rf01), [RF02](requisitos.md#rf02), [RNF01](requisitos.md#rnf01), [RNF13](requisitos.md#rnf13) |
| Resultado em 30/10/2026 | Passou (celular e desktop) |

Passos:

1. Rodar o axe em /entrar.
2. Entrar com credenciais inexistentes e rodar o axe.
3. Rodar o axe em /cadastrar.
4. Enviar o cadastro vazio e rodar o axe.

Resultado esperado: Zero violações nos quatro estados. O erro de login mostra "Não foi possível entrar". O cadastro vazio mostra o resumo "Corrija 3 campos para continuar" com o foco, o Nome com aria-invalid e "Informe seu nome."

### CT-E07

**Cada link do resumo de erros leva ao campo com problema.**

| Campo | Valor |
|---|---|
| Cenário | [CN01 · Acesso e autenticação](#cn01) |
| Teste | `tests/e2e/autenticacao.spec.ts` › "o link do resumo de erros leva ao campo" |
| Pré-condições | Nenhuma. |
| Requisitos | [RNF13](requisitos.md#rnf13) |
| Resultado em 30/10/2026 | Passou (celular e desktop) |

Passos:

1. Cadastrar com senha "curta".
2. Clicar no link "Senha: a senha precisa ter pelo menos 8 caracteres".

Resultado esperado: O foco vai para o campo Senha, que mantém o que a pessoa digitou.

### CT-E08

**O botão Mostrar senha funciona e informa o estado.**

| Campo | Valor |
|---|---|
| Cenário | [CN01 · Acesso e autenticação](#cn01) |
| Teste | `tests/e2e/autenticacao.spec.ts` › "Mostrar senha alterna a visibilidade e anuncia o estado" |
| Pré-condições | Página /entrar aberta. |
| Requisitos | [RNF14](requisitos.md#rnf14) |
| Resultado em 30/10/2026 | Passou (celular e desktop) |

Passos:

1. Clicar em "Mostrar senha".

Resultado esperado: O campo passa a type=text e o botão de aria-pressed=false para true.

### CT-E09

**Editar dados cadastrais confirma o resultado e valida.**

| Campo | Valor |
|---|---|
| Cenário | [CN02 · Minha conta](#cn02) |
| Teste | `tests/e2e/conta.spec.ts` › "Minha conta salva os dados, anuncia o resultado e passa no axe" |
| Pré-condições | Pesquisador logado. |
| Requisitos | [RF05](requisitos.md#rf05), [RF08](requisitos.md#rf08), [RNF01](requisitos.md#rnf01), [RNF13](requisitos.md#rnf13) |
| Resultado em 30/10/2026 | Passou (celular e desktop) |

Passos:

1. Abrir Minha conta e rodar o axe.
2. Trocar o nome e salvar.
3. Apagar o nome e salvar.
4. Rodar o axe.

Resultado esperado: O link Minha conta fica com aria-current=page. Salvar mostra "Dados salvos.". Nome vazio leva o foco ao resumo "Corrija 1 campo". Zero violações.

### CT-E10

**Trocar a senha exige a senha atual e derruba as outras sessões.**

| Campo | Valor |
|---|---|
| Cenário | [CN02 · Minha conta](#cn02) |
| Teste | `tests/e2e/conta.spec.ts` › "trocar a senha encerra a sessão aberta em outro navegador" |
| Pré-condições | A mesma conta logada em dois navegadores. |
| Requisitos | [RF06](requisitos.md#rf06), [RNF10](requisitos.md#rnf10) |
| Resultado em 30/10/2026 | Passou (celular e desktop) |

Passos:

1. Trocar a senha informando a senha atual errada.
2. Repetir com a senha atual certa.
3. No outro navegador, abrir /conta.
4. Entrar com a senha nova.

Resultado esperado: Senha atual errada mostra "A senha atual não confere…". Com a certa: "Senha trocada. As outras sessões abertas foram encerradas." e o campo é limpo. O outro navegador vai para Entrar e só entra com a senha nova.

### CT-E11

**Excluir a conta pede confirmação digitada e apaga tudo.**

| Campo | Valor |
|---|---|
| Cenário | [CN02 · Minha conta](#cn02) |
| Teste | `tests/e2e/conta.spec.ts` › "excluir a conta exige digitar o e-mail e apaga o acesso" |
| Pré-condições | Pesquisador logado. |
| Requisitos | [RF07](requisitos.md#rf07), [RNF13](requisitos.md#rnf13) |
| Resultado em 30/10/2026 | Passou (celular e desktop) |

Passos:

1. Abrir "Excluir minha conta".
2. Cancelar.
3. Abrir de novo e digitar outro e-mail.
4. Digitar o e-mail certo e confirmar.
5. Tentar entrar.

Resultado esperado: O painel abre com aria-expanded e foco no campo; Cancelar devolve o foco ao botão. E-mail errado: "Esse não é o e-mail da sua conta. Nada foi excluído.". E-mail certo: /entrar?aviso=excluida com "Conta excluída…". O login seguinte falha.

### CT-E12

**Pesquisador novo vê o estado vazio acessível.**

| Campo | Valor |
|---|---|
| Cenário | [CN03 · Gestão de estudos](#cn03) |
| Teste | `tests/e2e/estudos.spec.ts` › "lista vazia mostra o estado vazio e passa no axe" |
| Pré-condições | Pesquisador recém-cadastrado. |
| Requisitos | [RF09](requisitos.md#rf09), [RNF01](requisitos.md#rnf01) |
| Resultado em 30/10/2026 | Passou (celular e desktop) |

Passos:

1. Abrir /estudos.

Resultado esperado: Aparece "Você ainda não tem estudos." e o axe não acha violação.

### CT-E13

**O produto vira sugestão da primeira versão e o foco não se perde.**

| Campo | Valor |
|---|---|
| Cenário | [CN03 · Gestão de estudos](#cn03) |
| Teste | `tests/e2e/estudos.spec.ts` › "o produto sugere o nome da primeira versão e o foco acompanha adicionar e remover" |
| Pré-condições | Pesquisador logado. |
| Requisitos | [RF11](requisitos.md#rf11) |
| Resultado em 30/10/2026 | Passou (celular e desktop) |

Passos:

1. Em /estudos/novo, digitar o produto "Portal do aluno".
2. Clicar em Adicionar versão.
3. Clicar em Remover versão 2.

Resultado esperado: A Versão 1 recebe "Portal do aluno" com a nota "Sugerido a partir do produto avaliado. Pode trocar.". Adicionar foca a Versão 2; remover devolve o foco a Adicionar versão.

### CT-E14

**O formulário vazio é recusado com resumo acessível.**

| Campo | Valor |
|---|---|
| Cenário | [CN03 · Gestão de estudos](#cn03) |
| Teste | `tests/e2e/estudos.spec.ts` › "criar estudo com campos faltando mostra o resumo e passa no axe" |
| Pré-condições | Pesquisador logado. |
| Requisitos | [RF10](requisitos.md#rf10), [RNF01](requisitos.md#rnf01), [RNF13](requisitos.md#rnf13) |
| Resultado em 30/10/2026 | Passou (celular e desktop) |

Passos:

1. Rodar o axe em /estudos/novo.
2. Clicar em Criar estudo sem preencher.
3. Rodar o axe.

Resultado esperado: O resumo "Corrija 4 campos para continuar" recebe o foco, aparece "Dê um título ao estudo." e a Versão 1 fica com aria-invalid. Zero violações.

### CT-E15

**As transições de status mudam o comportamento do link.**

| Campo | Valor |
|---|---|
| Cenário | [CN03 · Gestão de estudos](#cn03) |
| Teste | `tests/e2e/estudos.spec.ts` › "abre, encerra e reabre a coleta, e o link público acompanha" |
| Pré-condições | Estudo criado em rascunho; uma aba de participante. |
| Requisitos | [RF14](requisitos.md#rf14), [RF16](requisitos.md#rf16) |
| Resultado em 30/10/2026 | Passou (celular e desktop) |

Passos:

1. Abrir o link como participante.
2. Abrir a coleta.
3. Encerrar a coleta e recarregar o link.
4. Reabrir a coleta.

Resultado esperado: Rascunho: "Este estudo ainda não está aberto". Aberto: "Coleta aberta. O link já aceita respostas." e "Aberto · aceitando respostas". Encerrado: "A coleta deste estudo foi encerrada". Reaberto: "Coleta reaberta…". Axe sem violações.

### CT-E16

**Copiar o link funciona pelo teclado e anuncia.**

| Campo | Valor |
|---|---|
| Cenário | [CN03 · Gestão de estudos](#cn03) |
| Teste | `tests/e2e/estudos.spec.ts` › "Copiar link anuncia o resultado e funciona pelo teclado" |
| Pré-condições | Estudo aberto. Só no Chromium (permissão de área de transferência). |
| Requisitos | [RF13](requisitos.md#rf13), [RNF13](requisitos.md#rnf13) |
| Resultado em 30/10/2026 | Passou (celular e desktop) |

Passos:

1. Focar "Copiar link" e apertar Enter.
2. Ler a área de transferência.

Resultado esperado: Aparece "Link copiado." e a área de transferência tem um endereço /r/ com slug de 6 caracteres.

### CT-E17

**A lista é uma tabela acessível.**

| Campo | Valor |
|---|---|
| Cenário | [CN03 · Gestão de estudos](#cn03) |
| Teste | `tests/e2e/estudos.spec.ts` › "a lista mostra o estudo numa tabela com o título como link" |
| Pré-condições | Um estudo criado. |
| Requisitos | [RF09](requisitos.md#rf09) |
| Resultado em 30/10/2026 | Passou (celular e desktop) |

Passos:

1. Abrir /estudos.

Resultado esperado: A tabela tem caption, cabeçalho Respostas, o título como link dentro do cabeçalho da linha e o status Rascunho. Zero violações.

### CT-E18

**Editar o estudo grava e confirma.**

| Campo | Valor |
|---|---|
| Cenário | [CN03 · Gestão de estudos](#cn03) |
| Teste | `tests/e2e/estudos.spec.ts` › "editar salva as mudanças e avisa" |
| Pré-condições | Um estudo criado. |
| Requisitos | [RF12](requisitos.md#rf12) |
| Resultado em 30/10/2026 | Passou (celular e desktop) |

Passos:

1. Clicar em Editar estudo.
2. Trocar o título e salvar.

Resultado esperado: Aparece "Alterações salvas." e o título novo é o h1 da página do estudo.

### CT-E19

**Excluir o estudo exige digitar o título.**

| Campo | Valor |
|---|---|
| Cenário | [CN03 · Gestão de estudos](#cn03) |
| Teste | `tests/e2e/estudos.spec.ts` › "excluir pede o título e apaga o estudo" |
| Pré-condições | Um estudo com 2 versões. |
| Requisitos | [RF15](requisitos.md#rf15) |
| Resultado em 30/10/2026 | Passou (celular e desktop) |

Passos:

1. Clicar em Excluir estudo.
2. Digitar outro título e confirmar.
3. Digitar o título certo e confirmar.

Resultado esperado: O campo recebe o foco e a tela diz "Excluir apaga o estudo e as 2 versões.". Texto errado: "…Nada foi excluído.". Título certo: /estudos?aviso=excluido, "Estudo excluído." e a lista vazia.

### CT-E20

**O endereço do estudo não serve para outra conta.**

| Campo | Valor |
|---|---|
| Cenário | [CN04 · Isolamento e proteção de dados](#cn04) |
| Teste | `tests/e2e/estudos.spec.ts` › "outro pesquisador não vê o estudo pelo endereço" |
| Pré-condições | Estudo criado pela conta A; conta B logada em outro navegador. |
| Requisitos | [RNF11](requisitos.md#rnf11) |
| Resultado em 30/10/2026 | Passou (celular e desktop) |

Passos:

1. Com a conta B, abrir o endereço do estudo da conta A.

Resultado esperado: A resposta é 404, igual à de um estudo inexistente.

### CT-E21

**O participante vai do consentimento ao fim e o pesquisador vê a resposta.**

| Campo | Valor |
|---|---|
| Cenário | [CN05 · Participação no estudo](#cn05) |
| Teste | `tests/e2e/questionario.spec.ts` › "fluxo completo do participante, com axe em todas as etapas" |
| Pré-condições | Estudo aberto. No projeto celular, janela de 390 px. |
| Requisitos | [RF17](requisitos.md#rf17), [RF19](requisitos.md#rf19), [RF20](requisitos.md#rf20), [RF22](requisitos.md#rf22), [RF25](requisitos.md#rf25), [RF27](requisitos.md#rf27), [RF36](requisitos.md#rf36), [RNF01](requisitos.md#rnf01), [RNF06](requisitos.md#rnf06) |
| Resultado em 30/10/2026 | Passou (celular e desktop) |

Passos:

1. Abrir o link.
2. Concordar.
3. Marcar os 26 itens e enviar.
4. Marcar "25 a 34 anos" e continuar.
5. Recarregar a página do pesquisador.

Resultado esperado: Cada etapa tem título próprio (Consentimento, Questionário, Dados opcionais, Respostas registradas) e a etapa atual tem aria-current=step. Nenhum rádio vem marcado. O contador chega a "26 de 26 respondidos". Zero violações em todas as etapas. O pesquisador vê "1 resposta · 1 suspeita · 1 na análise".

### CT-E22

**O questionário inteiro funciona só com teclado e o foco nunca fica escondido.**

| Campo | Valor |
|---|---|
| Cenário | [CN06 · Acessibilidade do questionário](#cn06) |
| Teste | `tests/e2e/questionario.spec.ts` › "fluxo completo só com teclado, com o foco sempre visível" |
| Pré-condições | Estudo aberto. |
| Requisitos | [RF19](requisitos.md#rf19), [RF20](requisitos.md#rf20), [RNF02](requisitos.md#rnf02), [RNF06](requisitos.md#rnf06) |
| Resultado em 30/10/2026 | Passou (celular e desktop) |

Passos:

1. Chegar a Concordo com Tab e apertar Enter.
2. Em cada um dos 26 itens: Tab até o grupo, Espaço, seta para a direita.
3. Tab até Enviar e Enter.
4. Tab até Pular esta etapa e Enter.

Resultado esperado: Em cada item o elemento focado está na tela e acima do rodapé fixo, e a segunda posição fica marcada. A pessoa chega a /fim.

### CT-E23

**Enviar faltando itens mostra quais faltam e leva até eles.**

| Campo | Valor |
|---|---|
| Cenário | [CN05 · Participação no estudo](#cn05) |
| Teste | `tests/e2e/questionario.spec.ts` › "envio incompleto leva o foco ao resumo e os links levam aos itens" |
| Pré-condições | Participação iniciada. |
| Requisitos | [RF21](requisitos.md#rf21), [RNF13](requisitos.md#rnf13) |
| Resultado em 30/10/2026 | Passou (celular e desktop) |

Passos:

1. Marcar todos menos os itens 7 e 19 e enviar.
2. Clicar em "Ir para o item 19".

Resultado esperado: O resumo "Faltam 2 itens: 7 e 19" recebe o foco, o título da aba começa com "Faltam 2 itens" e o item 7 tem a descrição "Este item não foi respondido". O link foca o primeiro rádio do item 19, visível acima do rodapé. Zero violações.

### CT-E24

**A árvore de acessibilidade do item é a especificada.**

| Campo | Valor |
|---|---|
| Cenário | [CN06 · Acessibilidade do questionário](#cn06) |
| Teste | `tests/e2e/questionario.spec.ts` › "cada item é um grupo com legenda e 7 rádios com posição e polo" |
| Pré-condições | Participação iniciada. |
| Requisitos | [RF19](requisitos.md#rf19), [RNF06](requisitos.md#rnf06) |
| Resultado em 30/10/2026 | Passou (celular e desktop) |

Passos:

1. Ler a árvore de acessibilidade do item 4.

Resultado esperado: Grupo "Item 4 de 26: De Fácil aprendizagem ou De difícil aprendizagem" com 7 rádios: "1 de 7, mais perto de De Fácil aprendizagem" … "4 de 7, centro" … "7 de 7, mais perto de De difícil aprendizagem".

### CT-E25

**O link do participante não rola na horizontal em 320 px.**

| Campo | Valor |
|---|---|
| Cenário | [CN06 · Acessibilidade do questionário](#cn06) |
| Teste | `tests/e2e/questionario.spec.ts` › "em 320 px (zoom de 400%) nenhuma etapa rola na horizontal" |
| Pré-condições | Estudo aberto; janela de 320 × 640. |
| Requisitos | [RNF03](requisitos.md#rnf03) |
| Resultado em 30/10/2026 | Passou (celular e desktop) |

Passos:

1. Conferir o consentimento.
2. Concordar e conferir o questionário.
3. Abrir Sair sem enviar e conferir.
4. Continuar, responder, enviar e conferir os dados opcionais.

Resultado esperado: Em todas as etapas a largura do documento não passa da janela.

### CT-E26

**Recarregar não perde o que foi marcado.**

| Campo | Valor |
|---|---|
| Cenário | [CN05 · Participação no estudo](#cn05) |
| Teste | `tests/e2e/questionario.spec.ts` › "recarregar a página recupera as respostas marcadas" |
| Pré-condições | Participação iniciada. |
| Requisitos | [RF23](requisitos.md#rf23) |
| Resultado em 30/10/2026 | Passou (celular e desktop) |

Passos:

1. Marcar os itens 1 e 2.
2. Recarregar.

Resultado esperado: Aparece "Recuperamos as respostas que você já tinha marcado.", o item 1 continua marcado e o contador mostra "2 de 26 respondidos".

### CT-E27

**Desistir pede confirmação e não deixa dados.**

| Campo | Valor |
|---|---|
| Cenário | [CN05 · Participação no estudo](#cn05) |
| Teste | `tests/e2e/questionario.spec.ts` › "sair sem enviar confirma em linha e não grava nada" |
| Pré-condições | Participação iniciada com um item marcado. |
| Requisitos | [RF24](requisitos.md#rf24), [RNF09](requisitos.md#rnf09) |
| Resultado em 30/10/2026 | Passou (celular e desktop) |

Passos:

1. Clicar em Sair sem enviar.
2. Confirmar Sair sem enviar.
3. Abrir o link de novo.
4. Recarregar a página do pesquisador.

Resultado esperado: Abre o grupo "Sair sem enviar? Nada do que você marcou será gravado." com o foco em Continuar respondendo. Confirmar leva a /saiu ("Você saiu do estudo", sem violações). O link volta ao termo, e o pesquisador vê "0 respostas · 0 na análise".

### CT-E28

**Recusar não grava, e o mesmo navegador não responde duas vezes.**

| Campo | Valor |
|---|---|
| Cenário | [CN05 · Participação no estudo](#cn05) |
| Teste | `tests/e2e/questionario.spec.ts` › "não quero participar sai sem gravar e o link respondido não aceita outro envio" |
| Pré-condições | Estudo aberto. |
| Requisitos | [RF17](requisitos.md#rf17), [RF26](requisitos.md#rf26) |
| Resultado em 30/10/2026 | Passou (celular e desktop) |

Passos:

1. Clicar em Não quero participar.
2. Abrir o link, concordar, responder, enviar e pular os dados opcionais.
3. Abrir o link de novo.

Resultado esperado: A recusa mostra "Você saiu do estudo". Depois de responder, o link mostra "Você já respondeu este estudo".

### CT-E29

**O painel mostra os números de analisarEstudo e a visão fica na URL.**

| Campo | Valor |
|---|---|
| Cenário | [CN10 · Painel de resultados](#cn10) |
| Teste | `tests/e2e/resultados.spec.ts` › "mostra os números do módulo UEQ e guarda versão e modo na URL" |
| Pré-condições | Estudo com a fixture basico na versão 1 (20) e inconsistente na versão 2 (15). |
| Requisitos | [RF33](requisitos.md#rf33), [RF37](requisitos.md#rf37), [RF38](requisitos.md#rf38), [RF39](requisitos.md#rf39), [RF41](requisitos.md#rf41) |
| Resultado em 30/10/2026 | Passou (celular e desktop) |

Passos:

1. Abrir Resultados e rodar o axe.
2. Escolher a versão 1 no seletor.
3. Recarregar.
4. Clicar em Agrupado por escala.
5. Clicar em Comparar versões e rodar o axe.
6. Voltar no navegador.

Resultado esperado: Atratividade da versão 1: 0,73, IC de 0,33 a 1,14, alfa 0,92, e o gráfico anuncia "Atratividade: média 0,73, IC de 0,33 a 1,14, neutra". O seletor mantém o foco e a URL ganha versao=, itens=escala e modo=comparar. Recarregar mantém a versão. A legenda diz "círculo vazado · n = 15". Voltar sai do modo comparar. Zero violações.

### CT-E30

**Amostra de 1 gera o aviso e o gráfico sem IC.**

| Campo | Valor |
|---|---|
| Cenário | [CN10 · Painel de resultados](#cn10) |
| Teste | `tests/e2e/resultados.spec.ts` › "com uma resposta só avisa que não há intervalo de confiança" |
| Pré-condições | Estudo com 1 resposta. |
| Requisitos | [RF40](requisitos.md#rf40) |
| Resultado em 30/10/2026 | Passou (celular e desktop) |

Passos:

1. Abrir Resultados.

Resultado esperado: Aparece "Amostra insuficiente para intervalo de confiança." e o gráfico anuncia "…sem intervalo de confiança".

### CT-E31

**O painel não rola na horizontal em 320 px.**

| Campo | Valor |
|---|---|
| Cenário | [CN10 · Painel de resultados](#cn10) |
| Teste | `tests/e2e/resultados.spec.ts` › "em 320 px o painel não rola na horizontal, nos dois modos" |
| Pré-condições | Estudo com 5 respostas em cada versão; janela de 320 × 640. |
| Requisitos | [RF39](requisitos.md#rf39), [RNF03](requisitos.md#rnf03) |
| Resultado em 30/10/2026 | Passou (celular e desktop) |

Passos:

1. Abrir Resultados.
2. Abrir Comparar versões.

Resultado esperado: Nos dois modos a largura do documento não passa da janela.

### CT-E32

**O gráfico de comparação continua legível com deficiências de cor e alto contraste.**

| Campo | Valor |
|---|---|
| Cenário | [CN10 · Painel de resultados](#cn10) |
| Teste | `tests/e2e/resultados.spec.ts` › "gráficos com daltonismo simulado e alto contraste" |
| Pré-condições | Estudo com 8 respostas em cada versão. |
| Requisitos | [RNF05](requisitos.md#rnf05), [RNF20](requisitos.md#rnf20) |
| Resultado em 30/10/2026 | Passou (celular e desktop) |

Passos:

1. Abrir Comparar versões.
2. Emular protanopia, deuteranopia e acromatopsia e capturar o gráfico.
3. Emular forced-colors e capturar.
4. Rodar o axe.

Resultado esperado: As quatro capturas ficam anexadas ao relatório para conferência visual; a legenda diz a forma de cada versão ("círculo cheio"); zero violações.

### CT-E33

**As suspeitas da fixture são detectadas e saem da análise em lote.**

| Campo | Valor |
|---|---|
| Cenário | [CN09 · Respostas suspeitas](#cn09) |
| Teste | `tests/e2e/respostas.spec.ts` › "a fixture inconsistente sai com as 4 suspeitas da equipe e dá para tirá-las da análise" |
| Pré-condições | Estudo com a fixture inconsistente (15). |
| Requisitos | [RF36](requisitos.md#rf36), [RF42](requisitos.md#rf42), [RF43](requisitos.md#rf43) |
| Resultado em 30/10/2026 | Passou (celular e desktop) |

Passos:

1. Abrir Respostas e rodar o axe.
2. Marcar Mostrar só suspeitas.
3. Clicar em Tirar suspeitas da análise.
4. Abrir Resultados e clicar em Ver respostas.

Resultado esperado: A URL ganha suspeitas=1 e aparece "Mostrando 4 de 15.", com 4 suspeitas por amplitude. O lote anuncia "4 participações suspeitas saíram da análise. Nada foi apagado…". O panorama diz "11 na análise e 4 fora". O painel mostra "4 participações fora da análise." e o link volta a Respostas.

### CT-E34

**Tirar e devolver uma participação é anunciado e reversível.**

| Campo | Valor |
|---|---|
| Cenário | [CN09 · Respostas suspeitas](#cn09) |
| Teste | `tests/e2e/respostas.spec.ts` › "incluir e excluir uma participação avisa e nunca apaga" |
| Pré-condições | Estudo com 3 respostas. |
| Requisitos | [RF43](requisitos.md#rf43) |
| Resultado em 30/10/2026 | Passou (celular e desktop) |

Passos:

1. Desmarcar "na análise" da primeira participação.
2. Marcar de novo.

Resultado esperado: Ao desmarcar: "…saiu da análise. Nada foi apagado" e "3 respostas · 2 na análise". Ao marcar: "…voltou para a análise." e "3 respostas · 3 na análise".

### CT-E35

**O detalhe da participação mostra a amplitude das 6 escalas.**

| Campo | Valor |
|---|---|
| Cenário | [CN09 · Respostas suspeitas](#cn09) |
| Teste | `tests/e2e/respostas.spec.ts` › "ver escalas mostra a amplitude de cada escala e destaca as inconsistentes" |
| Pré-condições | Estudo com a linha 1 da fixture inconsistente. |
| Requisitos | [RF42](requisitos.md#rf42) |
| Resultado em 30/10/2026 | Passou (celular e desktop) |

Passos:

1. Clicar em Ver escalas da participação.

Resultado esperado: O botão passa de aria-expanded=false para true e vira Ocultar; a lista tem 6 escalas, as 6 marcadas como inconsistentes. Zero violações.

### CT-E36

**Respostas não rola na horizontal em 320 px.**

| Campo | Valor |
|---|---|
| Cenário | [CN09 · Respostas suspeitas](#cn09) |
| Teste | `tests/e2e/respostas.spec.ts` › "em 320 px a página de respostas não rola na horizontal" |
| Pré-condições | Estudo com 3 respostas; janela de 320 × 640. |
| Requisitos | [RNF03](requisitos.md#rnf03) |
| Resultado em 30/10/2026 | Passou (celular e desktop) |

Passos:

1. Abrir Respostas.

Resultado esperado: A largura do documento não passa da janela.

### CT-E37

**Os quatro CSV saem com nome, codificação e conteúdo certos.**

| Campo | Valor |
|---|---|
| Cenário | [CN11 · Exportação em CSV](#cn11) |
| Teste | `tests/e2e/exportacao.spec.ts` › "baixa as 4 exportações com nome datado, BOM e o formato de cada uma" |
| Pré-condições | Estudo com basico (20) e inconsistente (15). |
| Requisitos | [RF45](requisitos.md#rf45), [RF46](requisitos.md#rf46), [RF47](requisitos.md#rf47), [RF48](requisitos.md#rf48), [RNF21](requisitos.md#rnf21) |
| Resultado em 30/10/2026 | Passou (celular e desktop) |

Passos:

1. Em Resultados, baixar Respostas brutas, Respostas recodificadas, Resultados por escala e Formato da planilha oficial.

Resultado esperado: Nomes ueq_avaliacao-do-checkout-da-loja-virtual_<tipo>_<aaaa-mm-dd>.csv. Brutas: BOM, cabeçalho id_participacao;versao;… e 35 linhas. Recodificadas com BOM. Resultados: 18 linhas (todas + 2 versões × 6 escalas) com "Checkout da loja virtual;Atratividade;20;0,7333;". Planilha oficial sem BOM e começando exatamente com o respostas.csv da fixture basico.

### CT-E38

**A exportação respeita sessão e dono.**

| Campo | Valor |
|---|---|
| Cenário | [CN04 · Isolamento e proteção de dados](#cn04) |
| Teste | `tests/e2e/exportacao.spec.ts` › "sem sessão ou de outro pesquisador, a exportação não sai" |
| Pré-condições | Estudo com 2 respostas; uma segunda conta. |
| Requisitos | [RNF11](requisitos.md#rnf11) |
| Resultado em 30/10/2026 | Passou (celular e desktop) |

Passos:

1. Pedir /api/estudos/<id>/exportar/brutas sem cookie.
2. Pedir com a outra conta.
3. Pedir o tipo inexistente xlsx com o dono.

Resultado esperado: Sem cookie: 307 para /entrar. Outra conta: 404. Tipo inexistente: 404.

### CT-E39

**O PDF do painel é gerado e baixado.**

| Campo | Valor |
|---|---|
| Cenário | [CN12 · Painel em PDF](#cn12) |
| Teste | `tests/e2e/painel-pdf.spec.ts` › "baixa o painel em PDF com nome datado, da versão escolhida" |
| Pré-condições | Estudo com basico e inconsistente. |
| Requisitos | [RF49](requisitos.md#rf49) |
| Resultado em 30/10/2026 | Passou (celular e desktop) |

Passos:

1. Em Resultados, clicar em Painel em PDF.

Resultado esperado: O arquivo se chama ueq_avaliacao-do-checkout-da-loja-virtual_painel_<aaaa-mm-dd>.pdf, começa com %PDF- e tem mais de 20 KB.

### CT-E40

**A página que vira PDF tem o cabeçalho e esconde a navegação na impressão.**

| Campo | Valor |
|---|---|
| Cenário | [CN12 · Painel em PDF](#cn12) |
| Teste | `tests/e2e/painel-pdf.spec.ts` › "a página de impressão tem cabeçalho com título, n e data, e no papel some a navegação" |
| Pré-condições | Estudo com a fixture basico. |
| Requisitos | [RF49](requisitos.md#rf49) |
| Resultado em 30/10/2026 | Passou (celular e desktop) |

Passos:

1. Abrir /estudos/<id>/resultados/impressao e rodar o axe.
2. Emular mídia print.

Resultado esperado: O h1 é o título do estudo, "n na análise" é "20 participações" e "Gerado em" segue dd/mm/aaaa às hh:mm. Na impressão somem a navegação principal, o link de voltar e a ordem dos itens. Zero violações.

### CT-E41

**O PDF exige sessão.**

| Campo | Valor |
|---|---|
| Cenário | [CN04 · Isolamento e proteção de dados](#cn04) |
| Teste | `tests/e2e/painel-pdf.spec.ts` › "sem sessão o PDF não sai" |
| Pré-condições | Estudo criado. |
| Requisitos | [RNF11](requisitos.md#rnf11) |
| Resultado em 30/10/2026 | Passou (celular e desktop) |

Passos:

1. Pedir /api/estudos/<id>/painel-pdf sem cookie.

Resultado esperado: 307 para /entrar.

### CT-E42

**Importar um CSV válido passa pela prévia e grava as linhas.**

| Campo | Valor |
|---|---|
| Cenário | [CN13 · Importação por CSV](#cn13) |
| Teste | `tests/e2e/importacao.spec.ts` › "importa a fixture basico numa versão, com prévia, e as respostas aparecem como importadas" |
| Pré-condições | Estudo aberto com 2 versões. |
| Requisitos | [RF50](requisitos.md#rf50) |
| Resultado em 30/10/2026 | Passou (celular e desktop) |

Passos:

1. Abrir Respostas › Importar e rodar o axe.
2. Escolher a versão 2 e o arquivo da fixture basico.
3. Clicar em Ver prévia e rodar o axe.
4. Clicar em Importar 20 respostas.

Resultado esperado: A aba Respostas continua com aria-current. O título "20 respostas prontas para importar" recebe o foco e a tabela tem o cabeçalho e 5 linhas. Depois: /respostas?importadas=20, "20 respostas importadas." e 20 linhas "importada de CSV" na versão escolhida. Zero violações.

### CT-E43

**Arquivo com erro é explicado linha a linha e nada é gravado.**

| Campo | Valor |
|---|---|
| Cenário | [CN13 · Importação por CSV](#cn13) |
| Teste | `tests/e2e/importacao.spec.ts` › "arquivo com erro mostra o problema de cada linha e não importa nada" |
| Pré-condições | Estudo aberto. |
| Requisitos | [RF50](requisitos.md#rf50), [RNF12](requisitos.md#rnf12), [RNF13](requisitos.md#rnf13) |
| Resultado em 30/10/2026 | Passou (celular e desktop) |

Passos:

1. Clicar em Ver prévia sem versão nem arquivo.
2. Enviar um CSV com uma linha certa, uma com 25 valores e uma com o valor 9.
3. Clicar em Escolher outro arquivo.
4. Voltar para Respostas.

Resultado esperado: Primeiro o resumo "Corrija 1 campo" recebe o foco com link para Versão. Depois o título "2 linhas com problema em com-erros.csv" recebe o foco, a linha 2 diz "Tem 25 valores" e a linha 3 "Valores fora de 1 a 7: item 26 ("9")", sem botão Importar. Respostas continua vazio. Zero violações.

### CT-E44

**A prévia da importação não rola na horizontal em 320 px.**

| Campo | Valor |
|---|---|
| Cenário | [CN13 · Importação por CSV](#cn13) |
| Teste | `tests/e2e/importacao.spec.ts` › "em 320 px a prévia da importação não rola na horizontal" |
| Pré-condições | Estudo aberto; janela de 320 × 800. |
| Requisitos | [RNF03](requisitos.md#rnf03) |
| Resultado em 30/10/2026 | Passou (celular e desktop) |

Passos:

1. Ver a prévia da fixture basico.

Resultado esperado: A largura do documento não passa da janela.

### CT-E45

**O idioma do navegador define o link inteiro e chega ao pesquisador e à exportação.**

| Campo | Valor |
|---|---|
| Cenário | [CN07 · Idiomas](#cn07) |
| Teste | `tests/e2e/idiomas.spec.ts` › "em espanhol pelo navegador: o link inteiro sai no idioma e o pesquisador vê o idioma" |
| Pré-condições | Estudo aberto; navegador do participante em es-ES. |
| Requisitos | [RF28](requisitos.md#rf28), [RF29](requisitos.md#rf29), [RF31](requisitos.md#rf31) |
| Resultado em 30/10/2026 | Passou (celular e desktop) |

Passos:

1. Abrir o link.
2. Aceitar.
3. Enviar vazio.
4. Responder tudo, enviar e escolher "De 25 a 34 años".
5. Como pesquisador, abrir Respostas e baixar as respostas brutas.

Resultado esperado: lang=es, títulos e botões em espanhol, instrução e termos oficiais em espanhol, rádios "1 de 7, más cerca de desagradable", resumo "Faltan 26 ítems…". O pesquisador vê uma linha Espanhol sem "tradução não aprovada". O CSV tem as colunas origem;idioma;traducao_aprovada e a linha ;link;es;sim;25 a 34 anos;. Zero violações.

### CT-E46

**Árabe pelo seletor deixa a página RTL sem inverter a escala.**

| Campo | Valor |
|---|---|
| Cenário | [CN07 · Idiomas](#cn07) |
| Teste | `tests/e2e/idiomas.spec.ts` › "em árabe pelo seletor: página da direita para a esquerda, escala na ordem oficial" |
| Pré-condições | Estudo aberto; navegador em pt-BR. |
| Requisitos | [RF29](requisitos.md#rf29), [RF30](requisitos.md#rf30), [RNF06](requisitos.md#rnf06) |
| Resultado em 30/10/2026 | Passou (celular e desktop) |

Passos:

1. Escolher árabe no seletor sem aplicar.
2. Clicar em Aplicar.
3. Concordar.
4. Medir a posição dos termos e dos rádios 1 e 7 no item 1.
5. Responder, enviar e pular.
6. Como pesquisador, abrir Respostas.

Resultado esperado: Escolher não muda a página (lang continua pt-BR); Aplicar muda para lang=ar e dir=rtl e mostra o aviso de tradução não aprovada. No item 1, o termo esquerdo e o rádio 1 ficam à esquerda do 7 e do termo direito, com o termo esquerdo colado à esquerda. O pesquisador vê a linha Árabe com "tradução não aprovada". Zero violações.

### CT-E47

**Quem não tem conta navega pela documentação por seções e sub-abas e vê os diagramas.**

| Campo | Valor |
|---|---|
| Cenário | [CN18 · Documentação na ferramenta](#cn18) |
| Teste | `tests/e2e/documentacao.spec.ts` › "sem conta, a documentação abre com a barra pública, as seções e as sub-abas, e passa no axe" |
| Pré-condições | Navegador sem cookie de sessão. |
| Requisitos | [RF52](requisitos.md#rf52), [RNF01](requisitos.md#rnf01) |
| Resultado em 30/10/2026 | Passou (celular e desktop) |

Passos:

1. Abrir /documentacao e rodar o axe.
2. Clicar na aba Modelagem.
3. Rolar até o Diagrama 1 e rodar o axe.
4. Clicar na sub-aba Diagrama de classes.

Resultado esperado: A barra mostra Documentação (com aria-current), Entrar e Criar conta, e nada de Estudos nem Sair. O h1 é "Documentação", a aba Visão geral fica marcada e a ficha diz "O índice da documentação". Modelagem abre /documentacao/casos-de-uso com o título "Casos de uso · Documentação", a aba e a sub-aba marcadas. A imagem "Diagrama: Diagrama 1 · Área do pesquisador" carrega. A sub-aba leva ao h1 "Diagrama de classes". Zero violações.

### CT-E48

**Quem entrou chega à documentação pela própria barra e não perde o caminho de volta.**

| Campo | Valor |
|---|---|
| Cenário | [CN18 · Documentação na ferramenta](#cn18) |
| Teste | `tests/e2e/documentacao.spec.ts` › "quem entrou chega à documentação pela barra do pesquisador e continua com ela" |
| Pré-condições | Pesquisador logado. |
| Requisitos | [RF52](requisitos.md#rf52) |
| Resultado em 30/10/2026 | Passou (celular e desktop) |

Passos:

1. Clicar em Documentação na barra superior e rodar o axe.

Resultado esperado: A URL vira /documentacao, o link Documentação fica com aria-current, Estudos e Sair continuam na barra e Entrar não aparece. Zero violações.

### CT-E49

**Links entre documentos e downloads funcionam dentro da ferramenta, sem conta.**

| Campo | Valor |
|---|---|
| Cenário | [CN18 · Documentação na ferramenta](#cn18) |
| Teste | `tests/e2e/documentacao.spec.ts` › "os links entre documentos levam à âncora dentro da ferramenta e a planilha baixa sem conta" |
| Pré-condições | Navegador sem cookie de sessão. |
| Requisitos | [RF52](requisitos.md#rf52) |
| Resultado em 30/10/2026 | Passou (celular e desktop) |

Passos:

1. Abrir a matriz de rastreabilidade e clicar no link RF01.
2. Conferir o link Ver no GitHub da ficha.
3. Clicar em Planilha de requisitos (XLSX).

Resultado esperado: A URL vira /documentacao/requisitos#rf01 e a linha do RF01 fica na tela. O link do GitHub aponta para docs/documentacao/requisitos.md. O download se chama planilha-requisitos.xlsx.

### CT-E50

**A documentação não rola na horizontal em 320 px.**

| Campo | Valor |
|---|---|
| Cenário | [CN18 · Documentação na ferramenta](#cn18) |
| Teste | `tests/e2e/documentacao.spec.ts` › "em 320 px a documentação não rola na horizontal" |
| Pré-condições | Janela de 320 × 640. |
| Requisitos | [RNF03](requisitos.md#rnf03) |
| Resultado em 30/10/2026 | Passou (celular e desktop) |

Passos:

1. Abrir a visão geral, Requisitos e Arquitetura.

Resultado esperado: Nas três páginas a largura do documento não passa da janela: tabelas e diagramas rolam dentro da própria região.

### CT-E51

**Nem a página nem a rota de arquivos entregam o que não está no catálogo, e a área do pesquisador continua fechada.**

| Campo | Valor |
|---|---|
| Cenário | [CN18 · Documentação na ferramenta](#cn18) |
| Teste | `tests/e2e/documentacao.spec.ts` › "endereço fora do catálogo dá 404 e os arquivos só saem da lista" |
| Pré-condições | Navegador sem cookie de sessão. |
| Requisitos | [RF52](requisitos.md#rf52), [RNF11](requisitos.md#rnf11) |
| Resultado em 30/10/2026 | Passou (celular e desktop) |

Passos:

1. Abrir /documentacao/nao-existe.
2. Pedir /api/documentacao/package.json, ..%2F..%2F.env e um diagrama com nome inválido.
3. Pedir requisitos.csv e /estudos sem cookie.

Resultado esperado: A página dá 404; os três pedidos de arquivo dão 404; requisitos.csv sai (200); /estudos continua mandando para /entrar (307).

### CT-E52

**Quem responde só vê o formulário e o seletor de idioma.**

| Campo | Valor |
|---|---|
| Cenário | [CN05 · Participação no estudo](#cn05) |
| Teste | `tests/e2e/questionario.spec.ts` › "o link do participante só mostra o formulário e o seletor de idioma, sem caminho para a ferramenta" |
| Pré-condições | Estudo aberto. |
| Requisitos | [RF52](requisitos.md#rf52), [RNF09](requisitos.md#rnf09) |
| Resultado em 30/10/2026 | Passou (celular e desktop) |

Passos:

1. Abrir o link e conferir o seletor de idioma.
2. Concordar.
3. Responder e enviar.
4. Pular os dados opcionais.

Resultado esperado: Em cada etapa (consentimento, questionário, dados opcionais e fim) não há barra Principal e todo link aponta para o próprio formulário (/r/…) ou para uma âncora da página. Nenhum caminho leva à documentação, aos estudos ou a Entrar.

## Casos de unidade

Cada caso reúne os testes de unidade de uma mesma regra. A coluna Execuções conta os testes reais: um caso parametrizado roda uma vez por idioma ou por par de cores.

### CN08 · Cálculo UEQ

| ID | Arquivo | Função ou grupo | Resultado esperado | Execuções | Requisitos | Resultado em 30/10/2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u01"></a>CT-U01 | `recodificar.test.ts` | `recodificar` | Com positivo à direita, 1 vira -3, 4 vira 0 e 7 vira 3 | 1 | [RF33](requisitos.md#rf33) | Passou |
| <a id="ct-u02"></a>CT-U02 | `recodificar.test.ts` | `recodificar` | Com positivo à esquerda, 1 vira 3, 4 vira 0 e 7 vira -3 | 1 | [RF33](requisitos.md#rf33) | Passou |
| <a id="ct-u03"></a>CT-U03 | `recodificar.test.ts` | `recodificar` | Recusa 0, 8, 3,5 e NaN, que não existem na escala de 1 a 7 | 4 | [RF33](requisitos.md#rf33), [RNF12](requisitos.md#rnf12) | Passou (4 de 4) |
| <a id="ct-u04"></a>CT-U04 | `recodificar.test.ts` | `recodificarParticipante` | Transforma o ponto do meio em 0 nos 26 itens | 1 | [RF33](requisitos.md#rf33) | Passou |
| <a id="ct-u05"></a>CT-U05 | `recodificar.test.ts` | `recodificarParticipante` | Aplica a polaridade de cada item: 7 em tudo dá +3 nos itens '+' e -3 nos itens '-' | 1 | [RF33](requisitos.md#rf33) | Passou |
| <a id="ct-u06"></a>CT-U06 | `recodificar.test.ts` | `recodificarParticipante` | Recusa participante sem as 26 respostas | 1 | [RF33](requisitos.md#rf33) | Passou |
| <a id="ct-u07"></a>CT-U07 | `estatistica.test.ts` | `media` | Devolve null sem valores e calcula a média simples | 2 | [RF33](requisitos.md#rf33) | Passou (2 de 2) |
| <a id="ct-u08"></a>CT-U08 | `estatistica.test.ts` | `desvioPadraoAmostral` | Null com n = 0 e n = 1, divisor n - 1 e zero quando todos são iguais | 3 | [RF33](requisitos.md#rf33) | Passou (3 de 3) |
| <a id="ct-u09"></a>CT-U09 | `estatistica.test.ts` | `intervaloConfianca95` | Média ± z · dp / √n; null sem dp (n = 1) e com dp = 0, como o #NUM! da planilha | 3 | [RF33](requisitos.md#rf33) | Passou (3 de 3) |
| <a id="ct-u10"></a>CT-U10 | `estatistica.test.ts` | `correlacao` | Correlação de Pearson; null sem variação ou com menos de 2 pares; recusa séries de tamanhos diferentes | 4 | [RF33](requisitos.md#rf33) | Passou (4 de 4) |
| <a id="ct-u11"></a>CT-U11 | `estatistica.test.ts` | `alfaCronbach` | Alfa padronizado k · r̄ / (1 + (k - 1) · r̄); 1 quando os itens andam juntos; null com menos de 2 itens, item sem variação (#DIV/0!), denominador zero ou um participante | 6 | [RF33](requisitos.md#rf33), [RNF16](requisitos.md#rnf16) | Passou (6 de 6) |
| <a id="ct-u12"></a>CT-U12 | `escalas.test.ts` | `escoresPorParticipante` | +3 em todas as escalas para quem marca sempre o polo positivo; média só dos itens da escala | 2 | [RF33](requisitos.md#rf33) | Passou (2 de 2) |
| <a id="ct-u13"></a>CT-U13 | `escalas.test.ts` | `faixaInterpretacao` | -0,8 e 0,8 são neutros; acima de 0,8 positiva, abaixo de -0,8 negativa | 2 | [RF33](requisitos.md#rf33) | Passou (2 de 2) |
| <a id="ct-u14"></a>CT-U14 | `escalas.test.ts` | `resultadoPorEscala` | Bordas n = 0, n = 1 e todos iguais, e média, dp, IC e alfa com dois participantes | 4 | [RF33](requisitos.md#rf33), [RNF16](requisitos.md#rnf16) | Passou (4 de 4) |
| <a id="ct-u15"></a>CT-U15 | `escalas.test.ts` | `resultadoPorItem` | Os 26 itens em ordem com média recodificada e distribuição de 1 a 7 | 1 | [RF35](requisitos.md#rf35) | Passou |
| <a id="ct-u16"></a>CT-U16 | `benchmark.test.ts` | `classificarBenchmark` | Uma média em cada uma das 5 faixas: excelente, bom, acima da média, abaixo da média e ruim | 5 | [RF34](requisitos.md#rf34) | Passou (5 de 5) |
| <a id="ct-u17"></a>CT-U17 | `benchmark.test.ts` | `classificarBenchmark` | Média igual ao limite fica na faixa de baixo; usa os limites da escala pedida; null sem média | 3 | [RF34](requisitos.md#rf34) | Passou (3 de 3) |
| <a id="ct-u18"></a>CT-U18 | `analisar-estudo.test.ts` | `analisarEstudo` | Estatísticas só com as participações incluídas na análise | 1 | [RF33](requisitos.md#rf33), [RF43](requisitos.md#rf43), [RNF16](requisitos.md#rnf16) | Passou |
| <a id="ct-u20"></a>CT-U20 | `analisar-estudo.test.ts` | `analisarEstudo` | Classifica no benchmark e calcula pragmática e hedônica pela média das escalas | 1 | [RF34](requisitos.md#rf34), [RF35](requisitos.md#rf35) | Passou |
| <a id="ct-u21"></a>CT-U21 | `analisar-estudo.test.ts` | `analisarEstudo` | Sinaliza alfa abaixo do mínimo do protocolo | 1 | [RF40](requisitos.md#rf40), [RNF08](requisitos.md#rnf08) | Passou |
| <a id="ct-u22"></a>CT-U22 | `analisar-estudo.test.ts` | `analisarEstudo` | Sem ninguém na análise devolve números null, sem quebrar | 1 | [RF33](requisitos.md#rf33) | Passou |

### CN09 · Respostas suspeitas

| ID | Arquivo | Função ou grupo | Resultado esperado | Execuções | Requisitos | Resultado em 30/10/2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u19"></a>CT-U19 | `analisar-estudo.test.ts` | `analisarEstudo` | Avalia a suspeita de todas as participações, inclusive as excluídas | 1 | [RF36](requisitos.md#rf36) | Passou |
| <a id="ct-u23"></a>CT-U23 | `inconsistencia.test.ts` | `amplitudePorEscala` | Zero para respostas consistentes; reproduz o exemplo de perspicuidade do handbook (distância 5) | 2 | [RF36](requisitos.md#rf36) | Passou (2 de 2) |
| <a id="ct-u24"></a>CT-U24 | `inconsistencia.test.ts` | `respostasIguais` | Conta a posição mais repetida | 1 | [RF36](requisitos.md#rf36) | Passou |
| <a id="ct-u25"></a>CT-U25 | `inconsistencia.test.ts` | `marcarSuspeitos` | Suspeito com 3 escalas inconsistentes, não com 2; amplitude igual a 3 não é inconsistência | 3 | [RF36](requisitos.md#rf36) | Passou (3 de 3) |
| <a id="ct-u26"></a>CT-U26 | `inconsistencia.test.ts` | `marcarSuspeitos` | Suspeito com mais de 15 respostas iguais, não com exatamente 15 | 2 | [RF36](requisitos.md#rf36) | Passou (2 de 2) |
| <a id="ct-u27"></a>CT-U27 | `inconsistencia.test.ts` | `marcarSuspeitos` | Aponta os dois motivos quando as duas regras valem; lê os limiares da configuração | 2 | [RF36](requisitos.md#rf36), [RNF08](requisitos.md#rnf08) | Passou (2 de 2) |
| <a id="ct-u28"></a>CT-U28 | `fixtures.test.ts` | `fixtures conforme os LEIA-ME` | basico sem suspeitos; inconsistente marca exatamente as linhas 1, 6, 9 e 13; todos-1 e todos-7 caem na regra das respostas iguais | 3 | [RF36](requisitos.md#rf36) | Passou (3 de 3) |

### CN15 · Validação contra a planilha oficial

| ID | Arquivo | Função ou grupo | Resultado esperado | Execuções | Requisitos | Resultado em 30/10/2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u29"></a>CT-U29 | `fixtures.test.ts` | `fixture … contra a planilha oficial` | Para cada fixture (basico, inconsistente, extremos/n1, n2, todos-1, todos-7): média, dp, n, IC95, alfa, benchmark, pragmática, hedônica, itens e suspeitas iguais aos da planilha, com tolerância de 1e-6 | 6 | [RNF07](requisitos.md#rnf07) | Pulado: aguarda dados da equipe |

### CN05 · Participação no estudo

| ID | Arquivo | Função ou grupo | Resultado esperado | Execuções | Requisitos | Resultado em 30/10/2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u30"></a>CT-U30 | `balanceamento.test.ts` | `versaoComMenosRespostas` | Escolhe a versão com menos respostas concluídas; no empate, a de menor ordem; com uma versão, ela; sem versões, null | 4 | [RF18](requisitos.md#rf18) | Passou (4 de 4) |

### CN11 · Exportação em CSV

| ID | Arquivo | Função ou grupo | Resultado esperado | Execuções | Requisitos | Resultado em 30/10/2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u31"></a>CT-U31 | `csv.test.ts` | `campoCsv` | Texto simples fica como está; ponto e vírgula e quebra de linha vão entre aspas; aspas internas são dobradas; ausente fica vazio | 5 | [RNF21](requisitos.md#rnf21) | Passou (5 de 5) |
| <a id="ct-u32"></a>CT-U32 | `csv.test.ts` | `documentoCsv` | Começa com BOM, usa ; e termina cada linha com CRLF; sai sem BOM quando pedido | 2 | [RNF21](requisitos.md#rnf21) | Passou (2 de 2) |
| <a id="ct-u33"></a>CT-U33 | `csv.test.ts` | `decimalCsv e slugDoTitulo` | Vírgula decimal e vazio para ausente; nome de arquivo sem acentos, espaços nem símbolos, e nunca vazio | 3 | [RNF21](requisitos.md#rnf21) | Passou (3 de 3) |
| <a id="ct-u34"></a>CT-U34 | `exportacoes.test.ts` | `exportarPlanilhaOficial` | Da fixture basico sai idêntica ao respostas.csv original; deixa de fora quem está fora da análise | 2 | [RF48](requisitos.md#rf48) | Passou (2 de 2) |
| <a id="ct-u35"></a>CT-U35 | `exportacoes.test.ts` | `exportarBrutas` | BOM, cabeçalho e 26 colunas de itens; versão e demografia protegidas contra ;, aspas e quebra de linha | 2 | [RF45](requisitos.md#rf45) | Passou (2 de 2) |
| <a id="ct-u37"></a>CT-U37 | `exportacoes.test.ts` | `exportarRecodificadas` | Troca 1 a 7 por -3 a +3 com a polaridade corrigida | 1 | [RF46](requisitos.md#rf46) | Passou |
| <a id="ct-u38"></a>CT-U38 | `exportacoes.test.ts` | `exportarResultados` | Uma linha por escala, com vírgula decimal | 1 | [RF47](requisitos.md#rf47) | Passou |

### CN07 · Idiomas

| ID | Arquivo | Função ou grupo | Resultado esperado | Execuções | Requisitos | Resultado em 30/10/2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u36"></a>CT-U36 | `exportacoes.test.ts` | `idioma nas exportações` | Diz em que idioma a pessoa respondeu e se a tradução é aprovada; importada sai com a origem e sem idioma | 2 | [RF31](requisitos.md#rf31), [RF50](requisitos.md#rf50) | Passou (2 de 2) |
| <a id="ct-u45"></a>CT-U45 | `idiomas.test.ts` | `os 37 idiomas do pacote oficial` | Os 37 idiomas estão completos e cada um tem os 26 pares em ordem, preenchidos e com termos diferentes | 38 | [RF28](requisitos.md#rf28) | Passou (38 de 38) |
| <a id="ct-u46"></a>CT-U46 | `idiomas.test.ts` | `os 37 idiomas do pacote oficial` | O português é exatamente o de data/ueq-itens-ptbr.json, que alimenta o banco | 1 | [RF28](requisitos.md#rf28), [RF32](requisitos.md#rf32) | Passou |
| <a id="ct-u47"></a>CT-U47 | `idiomas.test.ts` | `os 37 idiomas do pacote oficial` | Marca os 9 idiomas sem tradução aprovada e os 3 da direita para a esquerda; toda correção guarda o par original e o motivo | 2 | [RF29](requisitos.md#rf29), [RF30](requisitos.md#rf30) | Passou (2 de 2) |
| <a id="ct-u48"></a>CT-U48 | `idiomas.test.ts` | `textos das telas` | Em cada idioma, nenhum texto vazio, os mesmos {marcadores} do português e o nome acessível de cada círculo com posição e polo | 38 | [RF28](requisitos.md#rf28), [RF19](requisitos.md#rf19), [RNF15](requisitos.md#rnf15) | Passou (38 de 38) |
| <a id="ct-u49"></a>CT-U49 | `idiomas.test.ts` | `plural e lista` | Plural na forma do idioma (com queda em other) e listas juntadas como o idioma junta | 2 | [RNF15](requisitos.md#rnf15) | Passou (2 de 2) |
| <a id="ct-u50"></a>CT-U50 | `idiomas.test.ts` | `negociarIdioma` | Escolhe o primeiro dos 37 pela preferência do navegador, aceita códigos antigos, cai no português e dá o lang de cada idioma | 3 | [RF29](requisitos.md#rf29) | Passou (3 de 3) |

### CN13 · Importação por CSV

| ID | Arquivo | Função ou grupo | Resultado esperado | Execuções | Requisitos | Resultado em 30/10/2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u39"></a>CT-U39 | `importacao.test.ts` | `lerCsvDeRespostas` | Lê a fixture basico como o módulo UEQ e aceita de volta a exportação da planilha oficial | 2 | [RF50](requisitos.md#rf50) | Passou (2 de 2) |
| <a id="ct-u40"></a>CT-U40 | `importacao.test.ts` | `lerCsvDeRespostas` | Aceita vírgula, tabulação, BOM, aspas e separador sobrando; ignora linhas em branco mantendo o número real de cada linha | 2 | [RF50](requisitos.md#rf50), [RNF22](requisitos.md#rnf22) | Passou (2 de 2) |
| <a id="ct-u41"></a>CT-U41 | `importacao.test.ts` | `lerCsvDeRespostas` | Aponta por linha o número errado de valores e os valores fora da escala; recusa arquivo com linhas demais | 2 | [RF50](requisitos.md#rf50), [RNF22](requisitos.md#rnf22) | Passou (2 de 2) |

### CN10 · Painel de resultados

| ID | Arquivo | Função ou grupo | Resultado esperado | Execuções | Requisitos | Resultado em 30/10/2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u42"></a>CT-U42 | `leitura-rapida.test.ts` | `leituraDeUmaVersao` | Reproduz a frase do protótipo r6; junta escalas da mesma faixa e cita as negativas; null sem média | 3 | [RF37](requisitos.md#rf37) | Passou (3 de 3) |
| <a id="ct-u43"></a>CT-U43 | `leitura-rapida.test.ts` | `leituraDaComparacao` | Aponta as duas maiores diferenças e a quem favorecem; diz quando as versões ficam próximas; com três versões conta as escalas em que cada uma lidera | 3 | [RF39](requisitos.md#rf39) | Passou (3 de 3) |
| <a id="ct-u44"></a>CT-U44 | `leitura-rapida.test.ts` | `formatarDecimal` | Vírgula, duas casas e traço para ausente | 1 | [RF37](requisitos.md#rf37) | Passou |

### CN14 · Cores e contraste

| ID | Arquivo | Função ou grupo | Resultado esperado | Execuções | Requisitos | Resultado em 30/10/2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u51"></a>CT-U51 | `contraste.test.ts` | `contraste dos tokens de cor` | Cada par de texto do tema atinge 4,5:1 | 30 | [RNF04](requisitos.md#rnf04) | Passou (30 de 30) |
| <a id="ct-u52"></a>CT-U52 | `contraste.test.ts` | `contraste dos tokens de cor` | Cada borda de campo, foco e marcador de gráfico atinge 3:1 contra os fundos e as faixas do benchmark | 27 | [RNF04](requisitos.md#rnf04), [RNF05](requisitos.md#rnf05) | Passou (27 de 27) |

### CN16 · UEQ-S

| ID | Arquivo | Função ou grupo | Resultado esperado | Execuções | Requisitos | Resultado em 30/10/2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u53"></a>CT-U53 | `ueq-s.test.ts` | `UEQ-S` | Os 8 itens do UEQ-S apontam pares do UEQ com escala e polaridade certas, na ordem; os limites do benchmark estão em ordem | 2 | [RF51](requisitos.md#rf51) | Pulado: aguarda dados da equipe |

### CN18 · Documentação na ferramenta

| ID | Arquivo | Função ou grupo | Resultado esperado | Execuções | Requisitos | Resultado em 30/10/2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u54"></a>CT-U54 | `documentacao.test.ts` | `catálogo da documentação` | Todo documento e download do catálogo existe; cada documento tem um endereço só; todo .md de docs/documentacao está no catálogo; endereço fora do catálogo não vira documento | 3 | [RF52](requisitos.md#rf52), [RNF23](requisitos.md#rnf23) | Passou (3 de 3) |
| <a id="ct-u55"></a>CT-U55 | `documentacao.test.ts` | `diagramas` | Cada diagrama Mermaid dos documentos tem o SVG gerado e não sobra SVG sem uso | 2 | [RF52](requisitos.md#rf52), [RNF23](requisitos.md#rnf23) | Passou (2 de 2) |
| <a id="ct-u56"></a>CT-U56 | `documentacao.test.ts` | `destinoDoLink` | Link para outro documento abre na aba Documentação com a âncora; arquivo para baixar sai pela rota de download; o resto do repositório abre no GitHub; nenhum link relativo dos documentos aponta para arquivo que não existe | 4 | [RF52](requisitos.md#rf52), [RNF23](requisitos.md#rnf23) | Passou (4 de 4) |
| <a id="ct-u57"></a>CT-U57 | `documentacao.test.ts` | `renderizarMarkdown` | Título separado, âncoras iguais às do GitHub (inclusive repetidas), tabela numa região rolável com nome, links reescritos e diagrama como imagem com texto alternativo e o código à vista | 3 | [RF52](requisitos.md#rf52), [RNF01](requisitos.md#rnf01) | Passou (3 de 3) |

## Casos manuais

Feitos por pessoas da equipe. Os de CN17 vêm de [docs/checklist-manual.md](../checklist-manual.md); marque lá e anote o problema e quem corrige.

| ID | Cenário | Grupo | Verificação | Requisitos | Situação |
|---|---|---|---|---|---|
| <a id="ct-m01"></a>CT-M01 | CN17 | Leitor de tela | Questionário completo do começo ao fim só ouvindo (NVDA + Firefox; VoiceOver + Safari ou TalkBack + Chrome) | [RNF01](requisitos.md#rnf01), [RF19](requisitos.md#rf19) | A fazer pela equipe |
| <a id="ct-m02"></a>CT-M02 | CN17 | Leitor de tela | Ao entrar num item, o leitor anuncia o número, os dois termos e a posição | [RF19](requisitos.md#rf19), [RNF06](requisitos.md#rnf06) | A fazer pela equipe |
| <a id="ct-m03"></a>CT-M03 | CN17 | Leitor de tela | O progresso é anunciado sem interromper a cada clique | [RF20](requisitos.md#rf20) | A fazer pela equipe |
| <a id="ct-m04"></a>CT-M04 | CN17 | Leitor de tela | Ao enviar incompleto, o leitor anuncia o resumo e dá para ir ao item faltando | [RF21](requisitos.md#rf21) | A fazer pela equipe |
| <a id="ct-m05"></a>CT-M05 | CN17 | Leitor de tela | No painel, o gráfico é anunciado com a descrição e a tabela é navegável por célula com o cabeçalho lido | [RF37](requisitos.md#rf37), [RNF01](requisitos.md#rnf01) | A fazer pela equipe |
| <a id="ct-m06"></a>CT-M06 | CN17 | Leitor de tela | Mensagens de sucesso ("Coleta aberta") são anunciadas | [RNF13](requisitos.md#rnf13) | A fazer pela equipe |
| <a id="ct-m07"></a>CT-M07 | CN17 | Teclado | Criar estudo, abrir coleta, responder, ver resultados e exportar sem mouse; foco sempre visível e em ordem lógica | [RNF02](requisitos.md#rnf02) | A fazer pela equipe |
| <a id="ct-m08"></a>CT-M08 | CN17 | Visão | Zoom de 200% e 400%: nada corta, nada sobrepõe | [RNF03](requisitos.md#rnf03) | A fazer pela equipe |
| <a id="ct-m09"></a>CT-M09 | CN17 | Visão | Daltonismo simulado no DevTools (protanopia, deuteranopia, tritanopia, acromatopsia): o gráfico continua legível | [RNF05](requisitos.md#rnf05) | A fazer pela equipe |
| <a id="ct-m10"></a>CT-M10 | CN17 | Visão | Alto contraste do Windows: círculos do questionário e foco visíveis | [RNF20](requisitos.md#rnf20) | A fazer pela equipe |
| <a id="ct-m11"></a>CT-M11 | CN17 | Visão | Espaçamento de texto aumentado (WCAG 1.4.12) não quebra o layout | [RNF01](requisitos.md#rnf01) | A fazer pela equipe |
| <a id="ct-m12"></a>CT-M12 | CN17 | Celular real | Abrir o link pelo WhatsApp e responder com o polegar, sem toque acidental no círculo vizinho; o teclado virtual não cobre o campo nos dados opcionais | [RNF03](requisitos.md#rnf03), [RF19](requisitos.md#rf19) | A fazer pela equipe |
| <a id="ct-m13"></a>CT-M13 | CN17 | Avaliação heurística | Cada membro avalia sozinho com as 10 heurísticas de Nielsen (tela, heurística, severidade 0 a 4, sugestão) e depois a equipe consolida | [RNF01](requisitos.md#rnf01), [RNF13](requisitos.md#rnf13) | A fazer pela equipe |
| <a id="ct-m14"></a>CT-M14 | CN17 | Teste com usuários | 5 participantes respondem um estudo real; 2 a 3 pesquisadores criam estudo com 2 versões, abrem a coleta, interpretam o painel, tiram uma suspeita e exportam; registrar sucesso, tempo, erros e o UEQ da própria ferramenta | [RF10](requisitos.md#rf10), [RF14](requisitos.md#rf14), [RF37](requisitos.md#rf37), [RF43](requisitos.md#rf43), [RF48](requisitos.md#rf48) | A fazer pela equipe |
| <a id="ct-m15"></a>CT-M15 | CN15 | Planilha oficial | Colar cada data/fixtures/**/respostas.csv na UEQ Data Analysis Tool V15 e copiar os resultados para esperado.json (data/fixtures/LEIA-ME.md) | [RNF07](requisitos.md#rnf07) | A fazer pela equipe |
| <a id="ct-m16"></a>CT-M16 | CN09 | Script | Mudar um limiar em data/protocolo.json, rodar pnpm suspeitas:recalcular e conferir a coluna suspeita | [RF44](requisitos.md#rf44) | A fazer pela equipe |
| <a id="ct-m17"></a>CT-M17 | CN08 | Seed | Rodar pnpm db:seed com um item inválido em data/ueq-itens-ptbr.json e conferir que o seed para dizendo qual item | [RF32](requisitos.md#rf32) | A fazer pela equipe |
| <a id="ct-m18"></a>CT-M18 | CN17 | Revisão visual | Comparar cada tela com o PNG correspondente em docs/prototipos/alta-fidelidade/, seguindo docs/roteiro-revisao.md | [RNF19](requisitos.md#rnf19) | A fazer pela equipe |
| <a id="ct-m19"></a>CT-M19 | CN17 | Instalação | Num clone limpo, seguir o Como rodar do README e chegar à tela Entrar em http://localhost:3000 | [RNF17](requisitos.md#rnf17) | A fazer pela equipe |

## Pendências

- **[CT-U29](#ct-u29) · validação contra a planilha oficial.** Seis testes pulados até a equipe colar cada fixture na UEQ Data Analysis Tool e preencher os `esperado.json` ([CT-M15](#ct-m15), passo a passo em [data/fixtures/LEIA-ME.md](../../data/fixtures/LEIA-ME.md)). É a prova principal de fidelidade ao instrumento.
- **[CT-U53](#ct-u53) · UEQ-S.** Dois testes pulados até a equipe preencher os itens e o benchmark do UEQ-S (passo 5 de [data/LEIA-ME.md](../../data/LEIA-ME.md)).
- **Casos manuais.** Os 19 estão por fazer, inclusive o teste com usuários previsto em [docs/ihc.md §6](../ihc.md#6-como-verificar-automação-não-basta).
- **Sem caso de teste automatizado:** [RF44](requisitos.md#rf44), [RNF17](requisitos.md#rnf17), [RNF18](requisitos.md#rnf18), [RNF19](requisitos.md#rnf19). A matriz de rastreabilidade diz como cada um é verificado.
