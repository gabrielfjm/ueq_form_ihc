# Casos e cenários de teste

Os testes que já existem na Ferramenta UEQ, organizados em **25 cenários** e **177 casos de teste**: 87 de ponta a ponta, 65 de unidade e 25 manuais. Cada caso aponta o arquivo do teste, os requisitos que verifica e o resultado da última execução.

A mesma lista está em [casos-de-teste.csv](casos-de-teste.csv). A ligação de cada cenário e de cada caso com os requisitos entra quando a lista de requisitos estiver pronta.

## Execução de 06/11/2026

| Nível | Ferramenta | Casos | Execuções | Passaram | Pulados | Falharam |
|---|---|---|---|---|---|---|
| Ponta a ponta | Playwright 1.64 + axe-core 4.14 | 87 | 174 | 170 | 3 | 1 |
| Unidade | Vitest 5 | 65 | 290 | 282 | 8 | 0 |
| Manual | Pessoas da equipe | 25 | — | — | — | — |

- **Ponta a ponta:** cada caso roda duas vezes, no Chrome de desktop e no Chrome de celular (Pixel 7). As execuções puladas são de propósito: [CT-E49](casos-de-teste.md#ct-e49) só roda quando os documentos que ele usa forem publicados, e [CT-E67](casos-de-teste.md#ct-e67) roda só no desktop.
- **Unidade:** alguns casos são parametrizados (um por idioma, um por par de cores), por isso há mais execuções que casos. As 8 puladas esperam dados que só a equipe pode copiar das fontes oficiais ([CT-U29](#ct-u29) e [CT-U53](#ct-u53)).
- **Rodadas:** os arquivos `documentacao.spec.ts` e `barra.spec.ts` foram repetidos depois da divisão da documentação em páginas; os outros resultados são da rodada completa anterior, no mesmo dia.
- **Falha da rodada:** [CT-E63](casos-de-teste.md#ct-e63), no celular, estourou os 60 s com a suíte inteira em paralelo. Repetido sozinho, passou 4 de 4, em cerca de 12 s cada. É instabilidade sob carga, não regressão, mas conta como falha na tabela.
- **Manual:** a checklist de [docs/checklist-manual.md](../checklist-manual.md) e as conferências que dependem de pessoas ainda estão por fazer.
- **Ambiente:** servidor de desenvolvimento e PostgreSQL local. A execução não exercita a produção na Vercel, a API do Claude nem o envio de e-mail.

## Estratégia

### Níveis

| Nível | O que verifica | Onde fica | Como roda |
|---|---|---|---|
| Unidade | Funções puras: cálculo do UEQ, regras de suspeita, CSV, importação, leitura rápida, idiomas, contraste das cores, criptografia, modelo de e-mail, catálogo de textos e documentação | `src/**/__tests__/*.test.ts` | `pnpm test` (Vitest, ambiente Node, sem banco) |
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
- Os números do cálculo têm de bater com a planilha oficial com tolerância de 1e-6.
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
| <a id="cn01"></a>CN01 | **Acesso e autenticação** | Cadastrar, entrar, sair e proteger a área do pesquisador, só com teclado e sem violações de acessibilidade | a definir | [CT-E01](casos-de-teste.md#ct-e01), [CT-E02](casos-de-teste.md#ct-e02), [CT-E03](casos-de-teste.md#ct-e03), [CT-E04](casos-de-teste.md#ct-e04), [CT-E06](casos-de-teste.md#ct-e06), [CT-E07](casos-de-teste.md#ct-e07), [CT-E08](casos-de-teste.md#ct-e08) | Passou |
| <a id="cn02"></a>CN02 | **Minha conta** | Editar dados, trocar a senha derrubando outras sessões e excluir a conta com confirmação | a definir | [CT-E09](casos-de-teste.md#ct-e09), [CT-E10](casos-de-teste.md#ct-e10), [CT-E11](casos-de-teste.md#ct-e11) | Passou |
| <a id="cn03"></a>CN03 | **Gestão de estudos** | Criar, listar, editar, abrir, encerrar, reabrir, copiar o link e excluir estudos | a definir | [CT-E12](casos-de-teste.md#ct-e12), [CT-E13](casos-de-teste.md#ct-e13), [CT-E14](casos-de-teste.md#ct-e14), [CT-E15](casos-de-teste.md#ct-e15), [CT-E16](casos-de-teste.md#ct-e16), [CT-E17](casos-de-teste.md#ct-e17), [CT-E18](casos-de-teste.md#ct-e18), [CT-E19](casos-de-teste.md#ct-e19) | Passou |
| <a id="cn04"></a>CN04 | **Isolamento e proteção de dados** | Garantir que um pesquisador não veja nem exporte o estudo de outro e que o participante nunca precise de sessão | a definir | [CT-E05](casos-de-teste.md#ct-e05), [CT-E20](casos-de-teste.md#ct-e20), [CT-E38](casos-de-teste.md#ct-e38), [CT-E41](casos-de-teste.md#ct-e41) | Passou |
| <a id="cn05"></a>CN05 | **Participação no estudo** | Percorrer o link do participante do consentimento ao fim, inclusive recusar, desistir, recarregar e tentar responder de novo | a definir | [CT-U30](casos-de-teste.md#ct-u30), [CT-E21](casos-de-teste.md#ct-e21), [CT-E23](casos-de-teste.md#ct-e23), [CT-E26](casos-de-teste.md#ct-e26), [CT-E27](casos-de-teste.md#ct-e27), [CT-E28](casos-de-teste.md#ct-e28), [CT-E52](casos-de-teste.md#ct-e52), [CT-E71](casos-de-teste.md#ct-e71), [CT-E82](casos-de-teste.md#ct-e82), [CT-E83](casos-de-teste.md#ct-e83) | Passou |
| <a id="cn06"></a>CN06 | **Acessibilidade do questionário** | Responder só com teclado e leitor de tela, em 320 px, com foco sempre visível e o instrumento intacto | a definir | [CT-E22](casos-de-teste.md#ct-e22), [CT-E24](casos-de-teste.md#ct-e24), [CT-E25](casos-de-teste.md#ct-e25) | Passou |
| <a id="cn07"></a>CN07 | **Idiomas** | Responder em outro idioma, pelo navegador ou pelo seletor, inclusive da direita para a esquerda, e o pesquisador ver o idioma | a definir | [CT-U36](casos-de-teste.md#ct-u36), [CT-U45](casos-de-teste.md#ct-u45), [CT-U46](casos-de-teste.md#ct-u46), [CT-U47](casos-de-teste.md#ct-u47), [CT-U48](casos-de-teste.md#ct-u48), [CT-U49](casos-de-teste.md#ct-u49), [CT-U50](casos-de-teste.md#ct-u50), [CT-E45](casos-de-teste.md#ct-e45), [CT-E46](casos-de-teste.md#ct-e46), [CT-E68](casos-de-teste.md#ct-e68) | Passou |
| <a id="cn08"></a>CN08 | **Cálculo UEQ** | Conferir recodificação, estatística, escalas, alfa, benchmark e grupos em funções puras, com as bordas | a definir | [CT-U01](casos-de-teste.md#ct-u01), [CT-U02](casos-de-teste.md#ct-u02), [CT-U03](casos-de-teste.md#ct-u03), [CT-U04](casos-de-teste.md#ct-u04), [CT-U05](casos-de-teste.md#ct-u05), [CT-U06](casos-de-teste.md#ct-u06), [CT-U07](casos-de-teste.md#ct-u07), [CT-U08](casos-de-teste.md#ct-u08), [CT-U09](casos-de-teste.md#ct-u09), [CT-U10](casos-de-teste.md#ct-u10), [CT-U11](casos-de-teste.md#ct-u11), [CT-U12](casos-de-teste.md#ct-u12), [CT-U13](casos-de-teste.md#ct-u13), [CT-U14](casos-de-teste.md#ct-u14), [CT-U15](casos-de-teste.md#ct-u15), [CT-U16](casos-de-teste.md#ct-u16), [CT-U17](casos-de-teste.md#ct-u17), [CT-U18](casos-de-teste.md#ct-u18), [CT-U20](casos-de-teste.md#ct-u20), [CT-U21](casos-de-teste.md#ct-u21), [CT-U22](casos-de-teste.md#ct-u22), [CT-M17](casos-de-teste.md#ct-m17) | Passou, com itens pendentes |
| <a id="cn09"></a>CN09 | **Respostas suspeitas** | Detectar suspeitas pelas duas regras, revisá-las e tirá-las da análise sem apagar | a definir | [CT-U19](casos-de-teste.md#ct-u19), [CT-U23](casos-de-teste.md#ct-u23), [CT-U24](casos-de-teste.md#ct-u24), [CT-U25](casos-de-teste.md#ct-u25), [CT-U26](casos-de-teste.md#ct-u26), [CT-U27](casos-de-teste.md#ct-u27), [CT-U28](casos-de-teste.md#ct-u28), [CT-E33](casos-de-teste.md#ct-e33), [CT-E34](casos-de-teste.md#ct-e34), [CT-E35](casos-de-teste.md#ct-e35), [CT-E36](casos-de-teste.md#ct-e36), [CT-M16](casos-de-teste.md#ct-m16) | Passou, com itens pendentes |
| <a id="cn10"></a>CN10 | **Painel de resultados** | Mostrar os números do módulo UEQ, comparar versões, guardar a visão na URL e funcionar com daltonismo, alto contraste e 320 px | a definir | [CT-U42](casos-de-teste.md#ct-u42), [CT-U43](casos-de-teste.md#ct-u43), [CT-U44](casos-de-teste.md#ct-u44), [CT-E29](casos-de-teste.md#ct-e29), [CT-E30](casos-de-teste.md#ct-e30), [CT-E31](casos-de-teste.md#ct-e31), [CT-E32](casos-de-teste.md#ct-e32), [CT-E72](casos-de-teste.md#ct-e72), [CT-U60](casos-de-teste.md#ct-u60) | Passou |
| <a id="cn11"></a>CN11 | **Exportação em CSV** | Baixar os quatro arquivos com nome datado, BOM e o formato de cada um | a definir | [CT-U31](casos-de-teste.md#ct-u31), [CT-U32](casos-de-teste.md#ct-u32), [CT-U33](casos-de-teste.md#ct-u33), [CT-U34](casos-de-teste.md#ct-u34), [CT-U35](casos-de-teste.md#ct-u35), [CT-U37](casos-de-teste.md#ct-u37), [CT-U38](casos-de-teste.md#ct-u38), [CT-E37](casos-de-teste.md#ct-e37) | Passou |
| <a id="cn12"></a>CN12 | **Painel em PDF** | Baixar o painel em PDF e conferir a página de impressão | a definir | [CT-E39](casos-de-teste.md#ct-e39), [CT-E40](casos-de-teste.md#ct-e40) | Passou |
| <a id="cn13"></a>CN13 | **Importação por CSV** | Importar respostas com prévia, recusar arquivo com erro e marcar as importadas | a definir | [CT-U39](casos-de-teste.md#ct-u39), [CT-U40](casos-de-teste.md#ct-u40), [CT-U41](casos-de-teste.md#ct-u41), [CT-E42](casos-de-teste.md#ct-e42), [CT-E43](casos-de-teste.md#ct-e43), [CT-E44](casos-de-teste.md#ct-e44) | Passou |
| <a id="cn14"></a>CN14 | **Cores e contraste** | Garantir o contraste de todos os pares de cor do tema | a definir | [CT-U51](casos-de-teste.md#ct-u51), [CT-U52](casos-de-teste.md#ct-u52) | Passou |
| <a id="cn15"></a>CN15 | **Validação contra a planilha oficial** | Comparar cada número da ferramenta com a UEQ Data Analysis Tool, com tolerância de 1e-6 | a definir | [CT-U29](casos-de-teste.md#ct-u29), [CT-M15](casos-de-teste.md#ct-m15) | Pendente |
| <a id="cn16"></a>CN16 | **UEQ-S** | Conferir os 8 itens e o benchmark do UEQ-S quando a equipe preencher os dados | a definir | [CT-U53](casos-de-teste.md#ct-u53) | Pendente |
| <a id="cn18"></a>CN18 | **Documentação na ferramenta** | Navegar pelas seções e documentos com e sem conta, seguir links e âncoras, ver os diagramas e baixar os arquivos, sem violações de acessibilidade | a definir | [CT-U54](casos-de-teste.md#ct-u54), [CT-U55](casos-de-teste.md#ct-u55), [CT-U56](casos-de-teste.md#ct-u56), [CT-U57](casos-de-teste.md#ct-u57), [CT-E47](casos-de-teste.md#ct-e47), [CT-E48](casos-de-teste.md#ct-e48), [CT-E49](casos-de-teste.md#ct-e49), [CT-E50](casos-de-teste.md#ct-e50), [CT-E51](casos-de-teste.md#ct-e51), [CT-E57](casos-de-teste.md#ct-e57), [CT-E62](casos-de-teste.md#ct-e62), [CT-E84](casos-de-teste.md#ct-e84), [CT-E85](casos-de-teste.md#ct-e85), [CT-E86](casos-de-teste.md#ct-e86), [CT-E87](casos-de-teste.md#ct-e87), [CT-U64](casos-de-teste.md#ct-u64), [CT-U65](casos-de-teste.md#ct-u65) | Passou, com casos pulados até os documentos serem publicados |
| <a id="cn19"></a>CN19 | **Navegação e barra fixa** | Manter a barra superior à vista durante a rolagem, sem esconder o foco nem as âncoras, com menu no celular | a definir | [CT-E53](casos-de-teste.md#ct-e53), [CT-E54](casos-de-teste.md#ct-e54), [CT-E55](casos-de-teste.md#ct-e55), [CT-E56](casos-de-teste.md#ct-e56) | Passou |
| <a id="cn20"></a>CN20 | **Página inicial e janelas** | Apresentar a ferramenta a quem não tem conta, abrir Entrar e Criar conta numa janela sem rolar, fechar devolvendo o foco e entregar o ícone do site | a definir | [CT-E58](casos-de-teste.md#ct-e58), [CT-E59](casos-de-teste.md#ct-e59), [CT-E60](casos-de-teste.md#ct-e60), [CT-E61](casos-de-teste.md#ct-e61), [CT-E69](casos-de-teste.md#ct-e69), [CT-E70](casos-de-teste.md#ct-e70) | Passou |
| <a id="cn21"></a>CN21 | **Equipe e notificações** | Convidar por e-mail, aceitar no sino, limitar o que o leitor faz e avisar a equipe | a definir | [CT-U59](casos-de-teste.md#ct-u59), [CT-E63](casos-de-teste.md#ct-e63), [CT-E64](casos-de-teste.md#ct-e64) | Passou |
| <a id="cn22"></a>CN22 | **Aprender a usar** | Explicar cada página na ajuda (?) e guiar o primeiro acesso com um tour que pode ser pulado | a definir | [CT-E65](casos-de-teste.md#ct-e65), [CT-E66](casos-de-teste.md#ct-e66) | Passou |
| <a id="cn23"></a>CN23 | **Proteção de dados** | Cumprir a LGPD na interface e no servidor: política pública, cabeçalhos, criptografia, limite de tentativas e download dos dados | a definir | [CT-U58](casos-de-teste.md#ct-u58), [CT-E73](casos-de-teste.md#ct-e73), [CT-E74](casos-de-teste.md#ct-e74), [CT-E75](casos-de-teste.md#ct-e75), [CT-E76](casos-de-teste.md#ct-e76), [CT-E77](casos-de-teste.md#ct-e77), [CT-E78](casos-de-teste.md#ct-e78), [CT-E79](casos-de-teste.md#ct-e79), [CT-E80](casos-de-teste.md#ct-e80), [CT-E81](casos-de-teste.md#ct-e81) | Passou |
| <a id="cn24"></a>CN24 | **Idioma da ferramenta** | Escolher o idioma ao criar a conta, trocar em Minha conta e manter o catálogo de textos em dia | a definir | [CT-U62](casos-de-teste.md#ct-u62), [CT-U63](casos-de-teste.md#ct-u63), [CT-E67](casos-de-teste.md#ct-e67) | Passou |
| <a id="cn25"></a>CN25 | **Cenários de demonstração** | Gerar respostas sintéticas coerentes com o perfil de cada cenário | a definir | [CT-U61](casos-de-teste.md#ct-u61) | Passou |
| <a id="cn17"></a>CN17 | **Verificação manual com pessoas** | O que a automação não vê: leitor de tela real, celular real, zoom, espaçamento de texto, avaliação heurística e teste com usuários | a definir | [CT-M01](casos-de-teste.md#ct-m01), [CT-M02](casos-de-teste.md#ct-m02), [CT-M03](casos-de-teste.md#ct-m03), [CT-M04](casos-de-teste.md#ct-m04), [CT-M05](casos-de-teste.md#ct-m05), [CT-M06](casos-de-teste.md#ct-m06), [CT-M07](casos-de-teste.md#ct-m07), [CT-M08](casos-de-teste.md#ct-m08), [CT-M09](casos-de-teste.md#ct-m09), [CT-M10](casos-de-teste.md#ct-m10), [CT-M11](casos-de-teste.md#ct-m11), [CT-M12](casos-de-teste.md#ct-m12), [CT-M13](casos-de-teste.md#ct-m13), [CT-M14](casos-de-teste.md#ct-m14), [CT-M18](casos-de-teste.md#ct-m18), [CT-M19](casos-de-teste.md#ct-m19), [CT-M20](casos-de-teste.md#ct-m20), [CT-M21](casos-de-teste.md#ct-m21), [CT-M22](casos-de-teste.md#ct-m22), [CT-M23](casos-de-teste.md#ct-m23), [CT-M24](casos-de-teste.md#ct-m24), [CT-M25](casos-de-teste.md#ct-m25) | Manual, a fazer |

## Casos de ponta a ponta

Cada caso é um `test(...)` do Playwright. O título no código é o que aparece no relatório.

### CT-E01

**Quem abre a ferramenta sem conta vê a página inicial, que explica o que ela faz.**

| Campo | Valor |
|---|---|
| Cenário | [CN01 · Acesso e autenticação](#cn01) |
| Teste | `tests/e2e/inicial.spec.ts` › "a raiz apresenta a ferramenta para quem não tem sessão e passa no axe" |
| Pré-condições | Navegador sem cookie de sessão. |
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

Passos:

1. Abrir /.
2. Abrir o menu, se a tela for estreita.
3. Rodar o axe.

Resultado esperado: A URL continua em /. O h1 é "Estudos de experiência do usuário com o UEQ" e aparecem as seções O que é o UEQ, Como ler os resultados, Como funciona, Estudos sobre o método e Créditos, com os grupos Atratividade, Qualidade pragmática e Qualidade hedônica. A barra tem Documentação (sem aria-current) e o botão Entrar, e nada de Estudos. Zero violações.

### CT-E02

**O link de pular blocos é o primeiro elemento focável.**

| Campo | Valor |
|---|---|
| Cenário | [CN01 · Acesso e autenticação](#cn01) |
| Teste | `tests/e2e/inicial.spec.ts` › "o primeiro Tab leva ao link de pular para o conteúdo" |
| Pré-condições | Página inicial (/) aberta. |
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

Passos:

1. Apertar Tab.
2. Apertar Enter.

Resultado esperado: O primeiro Tab foca "Pular para o conteúdo"; o Enter leva o foco para main#conteudo.

### CT-E03

**Cadastrar, sair e entrar de novo funciona só com o teclado.**

| Campo | Valor |
|---|---|
| Cenário | [CN01 · Acesso e autenticação](#cn01) |
| Teste | `tests/e2e/autenticacao.spec.ts` › "cadastra, sai e entra de novo usando só o teclado" |
| Pré-condições | E-mail de teste novo. |
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

Passos:

1. Em /cadastrar, chegar a cada campo da janela com Tab e digitar nome, e-mail e senha.
2. Apertar Enter.
3. Chegar com Tab ao botão Sair e apertar Enter.
4. Na janela de confirmação, apertar Enter.
5. Na página inicial, chegar com Tab ao botão Entrar da barra, apertar Enter e entrar só com teclado.

Resultado esperado: Depois do cadastro aparece "Seus estudos". Sair abre a janela "Sair da conta?" com o foco no botão Sair; confirmar leva a /?aviso=saiu com "Você saiu da sua conta." em role=status. Entrar abre a janela com o foco no E-mail, e a nova entrada termina na página inicial.

### CT-E04

**A página pedida sem sessão é retomada depois do login.**

| Campo | Valor |
|---|---|
| Cenário | [CN01 · Acesso e autenticação](#cn01) |
| Teste | `tests/e2e/autenticacao.spec.ts` › "rota protegida sem sessão vai para Entrar e volta para ela depois do login" |
| Pré-condições | Conta criada; cookies apagados. |
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

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
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

Passos:

1. Abrir /r/qualquer-estudo.

Resultado esperado: A URL continua em /r/qualquer-estudo e a resposta não é o redirecionamento 307 para Entrar.

### CT-E06

**As janelas de acesso não têm violação WCAG 2.2 A/AA, nem no estado de erro.**

| Campo | Valor |
|---|---|
| Cenário | [CN01 · Acesso e autenticação](#cn01) |
| Teste | `tests/e2e/autenticacao.spec.ts` › "Entrar e Criar conta passam no axe, inclusive com erro" |
| Pré-condições | Nenhuma. |
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

Passos:

1. Abrir /entrar e rodar o axe com a janela aberta.
2. Entrar com credenciais inexistentes e rodar o axe.
3. Abrir /cadastrar e rodar o axe.
4. Enviar o cadastro vazio e rodar o axe.

Resultado esperado: Zero violações nos quatro estados. O erro de login mostra "Não foi possível entrar". O cadastro vazio mostra o resumo "Corrija 3 campos para continuar" com o foco, o Nome com aria-invalid e "Informe seu nome."

### CT-E07

**Cada link do resumo de erros leva ao campo com problema.**

| Campo | Valor |
|---|---|
| Cenário | [CN01 · Acesso e autenticação](#cn01) |
| Teste | `tests/e2e/autenticacao.spec.ts` › "o link do resumo de erros leva ao campo" |
| Pré-condições | Nenhuma. |
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

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
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

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
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

Passos:

1. Abrir Minha conta, rodar o axe e seguir para Dados cadastrais.
2. Trocar o nome e salvar.
3. Apagar o nome e salvar.
4. Rodar o axe.

Resultado esperado: O link Minha conta fica com aria-current=page, e o painel leva a /conta/dados. Salvar mostra "Dados salvos.". Nome vazio leva o foco ao resumo "Corrija 1 campo". Zero violações.

### CT-E10

**Trocar a senha exige a senha atual e derruba as outras sessões.**

| Campo | Valor |
|---|---|
| Cenário | [CN02 · Minha conta](#cn02) |
| Teste | `tests/e2e/conta.spec.ts` › "trocar a senha encerra a sessão aberta em outro navegador" |
| Pré-condições | A mesma conta logada em dois navegadores. |
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

Passos:

1. Em /conta/senha, trocar a senha informando a senha atual errada.
2. Repetir com a senha atual certa.
3. No outro navegador, abrir /conta.
4. Entrar com a senha nova.

Resultado esperado: Senha atual errada mostra "A senha atual não confere…". Com a certa: "Senha trocada. As outras sessões abertas foram encerradas." e o campo é limpo. O outro navegador vai para Entrar e só entra com a senha nova.

### CT-E11

**Excluir a conta pede confirmação numa janela, com o e-mail digitado, e apaga o acesso.**

| Campo | Valor |
|---|---|
| Cenário | [CN02 · Minha conta](#cn02) |
| Teste | `tests/e2e/conta.spec.ts` › "excluir a conta exige digitar o e-mail e apaga o acesso" |
| Pré-condições | Pesquisador logado. |
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

Passos:

1. Clicar em "Excluir minha conta".
2. Cancelar; abrir de novo e apertar Esc.
3. Abrir de novo e digitar outro e-mail.
4. Digitar o e-mail certo e confirmar.
5. Tentar entrar.

Resultado esperado: Abre a janela "Excluir sua conta?" com o aviso do que vai junto e o foco no campo; zero violações. Cancelar e Esc fecham e devolvem o foco ao botão. E-mail errado: "Esse não é o e-mail da sua conta. Nada foi excluído.". E-mail certo: /?aviso=excluida com "Conta excluída…". O login seguinte falha.

### CT-E12

**Pesquisador novo vê o estado vazio acessível.**

| Campo | Valor |
|---|---|
| Cenário | [CN03 · Gestão de estudos](#cn03) |
| Teste | `tests/e2e/estudos.spec.ts` › "lista vazia mostra o estado vazio e passa no axe" |
| Pré-condições | Pesquisador recém-cadastrado. |
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

Passos:

1. Abrir /estudos.

Resultado esperado: Aparece "Você ainda não tem estudos." e o axe não acha violação.

### CT-E13

**O produto vira sugestão de nome da primeira versão e o foco acompanha adicionar e remover.**

| Campo | Valor |
|---|---|
| Cenário | [CN03 · Gestão de estudos](#cn03) |
| Teste | `tests/e2e/estudos.spec.ts` › "o produto sugere o nome da primeira versão e o foco acompanha adicionar e remover" |
| Pré-condições | Pesquisador logado. |
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

Passos:

1. Em /estudos/novo, digitar o produto "Portal do aluno".
2. Clicar em Adicionar versão.
3. Clicar em Remover versão 2 e cancelar na janela.
4. Clicar de novo em Remover versão 2 e confirmar com Enter.

Resultado esperado: A Versão 1 recebe "Portal do aluno" com a nota "Sugerido a partir do produto avaliado. Pode trocar.". Adicionar foca a Versão 2. Remover abre a janela "Remover a versão 2?": Cancelar mantém a versão; confirmar (o foco já está no botão) remove e devolve o foco a Adicionar versão.

### CT-E14

**O formulário vazio é recusado com resumo acessível.**

| Campo | Valor |
|---|---|
| Cenário | [CN03 · Gestão de estudos](#cn03) |
| Teste | `tests/e2e/estudos.spec.ts` › "criar estudo com campos faltando mostra o resumo e passa no axe" |
| Pré-condições | Pesquisador logado. |
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

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
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

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
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

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
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

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
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

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
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

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
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

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
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

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
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

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
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

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
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

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
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

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
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

Passos:

1. Marcar os itens 1 e 2.
2. Recarregar.

Resultado esperado: Aparece "Recuperamos as respostas que você já tinha marcado.", o item 1 continua marcado e o contador mostra "2 de 26 respondidos".

### CT-E27

**Desistir pede confirmação numa janela e não grava nada.**

| Campo | Valor |
|---|---|
| Cenário | [CN05 · Participação no estudo](#cn05) |
| Teste | `tests/e2e/questionario.spec.ts` › "sair sem enviar confirma numa janela e não grava nada" |
| Pré-condições | Participação iniciada com um item marcado. |
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

Passos:

1. Clicar em Sair sem enviar no rodapé e rodar o axe.
2. Apertar Esc.
3. Clicar de novo em Sair sem enviar e confirmar na janela.
4. Abrir o link de novo.
5. Recarregar a página do pesquisador.

Resultado esperado: Abre a janela "Sair sem enviar? Nada do que você marcou será gravado." com o foco em Continuar respondendo; zero violações. Esc fecha, a resposta continua marcada e o foco volta para Sair sem enviar. Confirmar leva a /saiu ("Você saiu do estudo", sem violações). O link volta ao termo, e o pesquisador vê "0 respostas · 0 na análise".

### CT-E28

**Recusar não grava, e o mesmo navegador não responde duas vezes.**

| Campo | Valor |
|---|---|
| Cenário | [CN05 · Participação no estudo](#cn05) |
| Teste | `tests/e2e/questionario.spec.ts` › "não quero participar sai sem gravar e o link respondido não aceita outro envio" |
| Pré-condições | Estudo aberto. |
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

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
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

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
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

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
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

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
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

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
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

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
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

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
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

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
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

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
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

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
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

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
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

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
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

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
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

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
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

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
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

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
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

Passos:

1. Ver a prévia da fixture basico.

Resultado esperado: A largura do documento não passa da janela.

### CT-E45

**O idioma do estudo define o link inteiro, mesmo com o navegador em outro idioma, e chega ao pesquisador e à exportação.**

| Campo | Valor |
|---|---|
| Cenário | [CN07 · Idiomas](#cn07) |
| Teste | `tests/e2e/idiomas.spec.ts` › "estudo em espanhol: o link abre no idioma do estudo, mesmo com o navegador em português" |
| Pré-condições | Estudo aberto, escrito em espanhol; navegador do participante em pt-BR. |
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

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
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

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
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

Passos:

1. Abrir /documentacao e rodar o axe.
2. Clicar na aba Modelagem.
3. Rodar o axe no primeiro documento da seção.
4. Clicar na sub-aba Diagrama de classes.

Resultado esperado: A barra mostra Documentação (com aria-current) e Entrar, e nada de Estudos nem Sair. O h1 é "Documentação", a aba Visão geral fica marcada e a ficha diz "O índice da documentação". Modelagem abre /documentacao/casos-de-uso com o título "Casos de uso · Documentação", a aba e a sub-aba marcadas. Enquanto o documento está em produção, aparece o aviso "Casos de uso: em produção."; depois de publicado, o primeiro diagrama carrega como imagem com texto alternativo. A sub-aba leva ao h1 "Diagrama de classes". Zero violações.

### CT-E48

**Quem entrou chega à documentação pela própria barra e não perde o caminho de volta.**

| Campo | Valor |
|---|---|
| Cenário | [CN18 · Documentação na ferramenta](#cn18) |
| Teste | `tests/e2e/documentacao.spec.ts` › "quem entrou chega à documentação pela barra do pesquisador e continua com ela" |
| Pré-condições | Pesquisador logado. |
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

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
| Requisitos | a definir |
| Resultado em 06/11/2026 | Pulado (celular e desktop), até o documento ser publicado |

Passos:

1. Num documento publicado, clicar num link para outro documento.
2. Conferir o link Ver no GitHub da ficha.
3. Baixar um arquivo da ficha.

Resultado esperado: A URL leva à âncora do outro documento dentro da ferramenta, e a linha citada fica na tela. O link do GitHub aponta para o arquivo do documento. O download sai com o nome do arquivo. O teste fica pulado enquanto os documentos estão em produção.

### CT-E50

**A documentação não rola na horizontal em 320 px.**

| Campo | Valor |
|---|---|
| Cenário | [CN18 · Documentação na ferramenta](#cn18) |
| Teste | `tests/e2e/documentacao.spec.ts` › "em 320 px a documentação não rola na horizontal" |
| Pré-condições | Janela de 320 × 640. |
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

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
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

Passos:

1. Abrir /documentacao/nao-existe.
2. Pedir /api/documentacao/package.json, ..%2F..%2F.env e um diagrama com nome inválido.
3. Pedir requisitos.csv e /estudos sem cookie.

Resultado esperado: A página dá 404; os três pedidos de arquivo dão 404; requisitos.csv sai (200) só se Requisitos estiver publicado, senão dá 404; /estudos continua mandando para /entrar (307).

### CT-E52

**Quem responde só vê o formulário e o seletor de idioma.**

| Campo | Valor |
|---|---|
| Cenário | [CN05 · Participação no estudo](#cn05) |
| Teste | `tests/e2e/questionario.spec.ts` › "o link do participante só mostra o formulário e o seletor de idioma, sem caminho para a ferramenta" |
| Pré-condições | Estudo aberto. |
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

Passos:

1. Abrir o link e conferir o seletor de idioma.
2. Concordar.
3. Responder e enviar.
4. Pular os dados opcionais.

Resultado esperado: Em cada etapa (consentimento, questionário, dados opcionais e fim) não há barra Principal e todo link aponta para o próprio formulário (/r/…) ou para uma âncora da página. Nenhum caminho leva à documentação, aos estudos ou a Entrar.

### CT-E53

**A barra superior fica no topo durante a rolagem, com e sem conta.**

| Campo | Valor |
|---|---|
| Cenário | [CN19 · Navegação e barra fixa](#cn19) |
| Teste | `tests/e2e/barra.spec.ts` › "a barra fica fixa no topo ao rolar, com e sem conta" |
| Pré-condições | Uma página longa (a página inicial). |
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

Passos:

1. Sem conta, abrir a página inicial e rolar até o fim.
2. Criar conta, abrir a página inicial e rolar até o meio.

Resultado esperado: Nos dois casos a página rolou mais de 1000 px e a barra está na tela com o topo em 0.

### CT-E54

**Nem o destino de uma âncora nem o elemento com foco ficam escondidos pela barra.**

| Campo | Valor |
|---|---|
| Cenário | [CN19 · Navegação e barra fixa](#cn19) |
| Teste | `tests/e2e/barra.spec.ts` › "o foco e as âncoras nunca ficam embaixo da barra fixa" |
| Pré-condições | Nenhuma. |
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

Passos:

1. Abrir a página inicial em #inicio-leitura.
2. Focar o link Política de privacidade e subir 40 vezes com Shift+Tab.

Resultado esperado: A âncora começa abaixo da barra, e cada elemento que recebe o foco fora da barra também (WCAG 2.4.11).

### CT-E55

**No celular a barra fixa fica numa linha só e o menu se comporta como um controle de abrir e fechar.**

| Campo | Valor |
|---|---|
| Cenário | [CN19 · Navegação e barra fixa](#cn19) |
| Teste | `tests/e2e/barra.spec.ts` › "no celular os links ficam no menu, que fecha com Esc e devolve o foco" |
| Pré-condições | Janela de 390 × 844. |
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

Passos:

1. Conferir o botão Menu fechado.
2. Abrir o menu e rodar o axe.
3. Apertar Esc com o foco no botão Entrar.
4. Abrir o menu, clicar no logotipo (vai para /) e voltar.

Resultado esperado: Fechado: aria-expanded=false, botão Entrar escondido e barra com menos de 80 px. Aberto: aria-expanded=true, Entrar visível e zero violações. Esc fecha e devolve o foco ao botão. Ao trocar de página o menu fecha, e ao voltar continua fechado.

### CT-E56

**No computador os links ficam sempre à vista na barra.**

| Campo | Valor |
|---|---|
| Cenário | [CN19 · Navegação e barra fixa](#cn19) |
| Teste | `tests/e2e/barra.spec.ts` › "no computador o botão Menu não aparece e os links ficam na barra" |
| Pré-condições | Janela de 1280 × 800. |
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

Passos:

1. Abrir a documentação.

Resultado esperado: O botão Menu não aparece e o botão Entrar está visível na barra.

### CT-E57

**O diagrama abre em tela cheia, com zoom e arrasto, e fecha devolvendo o foco.**

| Campo | Valor |
|---|---|
| Cenário | [CN18 · Documentação na ferramenta](#cn18) |
| Teste | `tests/e2e/documentacao.spec.ts` › "clicar no diagrama abre em tela cheia, com zoom, arrasto, Voltar e Esc" |
| Pré-condições | Navegador sem cookie de sessão. |
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

Passos:

1. Num documento publicado, clicar no primeiro diagrama e rodar o axe.
2. Clicar duas vezes em Aumentar.
3. Arrastar o diagrama com o mouse.
4. Apertar - e depois 0.
5. Clicar em Voltar.
6. Com o foco no diagrama, apertar Enter e depois Esc.

Resultado esperado: A janela com o título do diagrama ocupa toda a largura, Voltar recebe o foco e a imagem carrega; zero violações. O zoom vai a 150% e a área passa a rolar; arrastar muda a posição e Voltar continua no topo. - leva a 125% e 0 volta a 100%. Voltar e Esc fecham, e o foco volta ao diagrama.

### CT-E58

**Entrar e Criar conta abrem numa janela por cima da página, cabem sem rolar e fecham devolvendo o foco.**

| Campo | Valor |
|---|---|
| Cenário | [CN20 · Página inicial e janelas](#cn20) |
| Teste | `tests/e2e/inicial.spec.ts` › "Entrar abre a janela por cima da página, sem rolar, e Esc fecha devolvendo o foco" |
| Pré-condições | Página inicial (/) sem sessão. |
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

Passos:

1. Clicar em Entrar na barra.
2. Medir a caixa da janela e rodar o axe.
3. Clicar em Criar conta dentro da janela.
4. Apertar Esc.

Resultado esperado: Abre a janela "Entrar" com o foco no E-mail, e a URL continua em /. O conteúdo cabe sem barra de rolagem; zero violações. Criar conta troca o formulário na mesma janela, com o foco no Nome. Esc fecha e devolve o foco ao botão Entrar.

### CT-E59

**Fechar a janela aberta pelo endereço /entrar leva à página inicial.**

| Campo | Valor |
|---|---|
| Cenário | [CN20 · Página inicial e janelas](#cn20) |
| Teste | `tests/e2e/inicial.spec.ts` › "fechar a janela em /entrar volta para a página inicial" |
| Pré-condições | Navegador sem cookie de sessão. |
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

Passos:

1. Abrir /entrar.
2. Clicar em Fechar (x).

Resultado esperado: A janela some e a URL vira /.

### CT-E60

**Quem já entrou vê a página inicial com a barra do pesquisador.**

| Campo | Valor |
|---|---|
| Cenário | [CN20 · Página inicial e janelas](#cn20) |
| Teste | `tests/e2e/inicial.spec.ts` › "quem entrou vê a página inicial com a barra do pesquisador e o caminho para os estudos" |
| Pré-condições | Pesquisador logado. |
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

Passos:

1. Abrir /.
2. Clicar em "Ver seus estudos".

Resultado esperado: A barra tem o botão Sair. "Ver seus estudos" leva a /estudos.

### CT-E61

**O navegador recebe o ícone do site, também sem sessão.**

| Campo | Valor |
|---|---|
| Cenário | [CN20 · Página inicial e janelas](#cn20) |
| Teste | `tests/e2e/inicial.spec.ts` › "o navegador recebe o ícone do site" |
| Pré-condições | Navegador sem cookie de sessão. |
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

Passos:

1. Abrir / e ler o link rel=icon.
2. Pedir o ícone SVG e o apple-touch-icon.

Resultado esperado: O link aponta para /icon.svg; o SVG sai com 200 e image/svg+xml, e o apple-touch-icon sai como image/png.

### CT-E62

**Documento em produção mostra só o aviso e a ficha, e a rota não serve os arquivos dele.**

| Campo | Valor |
|---|---|
| Cenário | [CN18 · Documentação na ferramenta](#cn18) |
| Teste | `tests/e2e/documentacao.spec.ts` › "documento em produção mostra o aviso e a ficha, sem texto, arquivo nem downloads" |
| Pré-condições | Navegador sem cookie de sessão; Requisitos ainda em produção. |
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

Passos:

1. Abrir /documentacao e rodar o axe.
2. Na tabela Situação dos documentos, clicar em Requisitos e rodar o axe.
3. Pedir requisitos.csv e planilha-requisitos.xlsx.

Resultado esperado: A visão geral mostra "A documentação está sendo escrita pela equipe." e a tabela com Requisitos "Em produção". Requisitos mostra o h1, o aviso "Requisitos: em produção." e a ficha com "Em produção", sem Ver no GitHub, sem downloads e sem article. Os dois arquivos dão 404. Zero violações.

### CT-E63

**O dono convida por e-mail, o convidado aceita no sino e, como leitor, só vê.**

| Campo | Valor |
|---|---|
| Cenário | [CN21 · Equipe e notificações](#cn21) |
| Teste | `tests/e2e/equipe.spec.ts` › "convite por e-mail chega no sino, o leitor só vê e o dono é avisado" |
| Pré-condições | Duas contas, cada uma no seu navegador; o dono tem um estudo. |
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou no desktop; no celular, estourou o tempo na rodada completa e passou 4 de 4 ao repetir sozinho |

Passos:

1. Em Compartilhar, convidar um e-mail sem conta.
2. Convidar a segunda conta como Leitor e rodar o axe.
3. Na segunda conta, abrir Estudos e o sino, e aceitar.
4. Na conta do dono, abrir Notificações e rodar o axe.

Resultado esperado: E-mail sem conta mostra "Não há conta com esse e-mail". O convite aparece como "Convite pendente" e o status diz "Convite enviado". A segunda conta vê "Você tem 1 convite pendente" e "convidou você… como leitor". Depois de aceitar, vê "você é leitor", sem Editar estudo nem Abrir coleta. O dono recebe "aceitou o convite para o estudo". Zero violações.

### CT-E64

**O sino abre e fecha só com o teclado, devolvendo o foco.**

| Campo | Valor |
|---|---|
| Cenário | [CN21 · Equipe e notificações](#cn21) |
| Teste | `tests/e2e/equipe.spec.ts` › "o sino também funciona pelo teclado" |
| Pré-condições | Pesquisador logado, sem avisos. |
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

Passos:

1. Chegar ao sino com Tab e apertar Enter.
2. Apertar Esc.

Resultado esperado: Enter deixa aria-expanded=true e mostra "Nada novo". Esc deixa aria-expanded=false e o foco volta ao sino.

### CT-E65

**Cada página do pesquisador explica a si mesma numa janela.**

| Campo | Valor |
|---|---|
| Cenário | [CN22 · Aprender a usar](#cn22) |
| Teste | `tests/e2e/equipe.spec.ts` › "toda página do pesquisador tem o (?) com a ajuda dela" |
| Pré-condições | Pesquisador logado. |
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

Passos:

1. Em /estudos, /estudos/novo, /conta e /notificacoes, abrir Ajuda desta página.
2. Rodar o axe.
3. Apertar Esc.

Resultado esperado: A janela abre com o título da página, sem violações, e Esc fecha.

### CT-E66

**O tour começa no primeiro acesso, avança pela ação da pessoa e não volta depois de pulado.**

| Campo | Valor |
|---|---|
| Cenário | [CN22 · Aprender a usar](#cn22) |
| Teste | `tests/e2e/equipe.spec.ts` › "o tour abre só no primeiro acesso, avança pelo clique na ação e pode ser pulado" |
| Pré-condições | E-mail de teste novo. |
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

Passos:

1. Criar a conta e rodar o axe nas boas-vindas.
2. Clicar em Começar o tour.
3. Clicar no estudo de exemplo destacado.
4. Clicar em Pular tutorial e recarregar.

Resultado esperado: Aparece "Boas-vindas à Ferramenta UEQ". O tour cria "Exemplo do tour: app de delivery", mostra "Passo 1 de 10" e, com o clique, "Passo 2 de 10". Pulado, o cartão some, e as boas-vindas não voltam ao recarregar. Zero violações.

### CT-E67

**O idioma escolhido no cadastro vale para a ferramenta e pode ser trocado depois.**

| Campo | Valor |
|---|---|
| Cenário | [CN24 · Idioma da ferramenta](#cn24) |
| Teste | `tests/e2e/idioma-interface.spec.ts` › "o idioma escolhido ao criar a conta vale para a ferramenta e pode ser trocado em Minha conta" |
| Pré-condições | Uma tradução de "Minha conta" para alemão gravada direto no banco, como a API gravaria. Roda só no desktop. |
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou no desktop; pulado no celular, onde a barra fica recolhida |

Passos:

1. Em Criar conta, preencher e rodar o axe.
2. Escolher "Deutsch" em Idioma da ferramenta.
3. Criar a conta e pular o tour.
4. Em /conta/idioma, escolher Português e salvar.

Resultado esperado: O que foi digitado continua depois da troca. A barra mostra "Mein Konto", e o lang fica pt-BR, porque quase nada está traduzido. Salvar mostra "Idioma da ferramenta trocado." e a barra volta a "Minha conta". Zero violações.

### CT-E68

**Trocar o idioma no questionário não perde as marcações.**

| Campo | Valor |
|---|---|
| Cenário | [CN07 · Idiomas](#cn07) |
| Teste | `tests/e2e/idiomas.spec.ts` › "o idioma também troca no meio do questionário, sem perder o que já foi marcado" |
| Pré-condições | Estudo aberto. |
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

Passos:

1. Concordar e marcar o item 1.
2. Escolher inglês no seletor e clicar em Aplicar.
3. Rodar o axe.

Resultado esperado: Continua em /questionario, com lang=en. O item 1 agora é "annoying or enjoyable", segue marcado, e o progresso diz "1 of 26 answered". Zero violações.

### CT-E69

**A página inicial cita os estudos e dá os créditos.**

| Campo | Valor |
|---|---|
| Cenário | [CN20 · Página inicial e janelas](#cn20) |
| Teste | `tests/e2e/inicial.spec.ts` › "a página inicial explica o UEQ, lista os estudos do método e dá os créditos" |
| Pré-condições | Navegador sem cookie de sessão. |
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

Passos:

1. Em /, clicar em Estudos sobre o método no índice.
2. Conferir os links das referências.
3. Conferir os créditos e rodar o axe.

Resultado esperado: A URL termina em #inicio-estudos. Cada estudo leva ao DOI, e o manual, ao PDF oficial. Os créditos citam os autores do UEQ, a disciplina e os três membros da equipe. Zero violações.

### CT-E70

**O logotipo leva à página inicial, e quem entrou vê o caminho para os estudos.**

| Campo | Valor |
|---|---|
| Cenário | [CN20 · Página inicial e janelas](#cn20) |
| Teste | `tests/e2e/inicial.spec.ts` › "quem entrou volta à página inicial pelo logotipo" |
| Pré-condições | Pesquisador logado, em /conta. |
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

Passos:

1. Clicar no logotipo na barra.

Resultado esperado: A URL é / e aparece o link "Ver seus estudos".

### CT-E71

**Sem a coleta ligada, a etapa de dados opcionais não existe.**

| Campo | Valor |
|---|---|
| Cenário | [CN05 · Participação no estudo](#cn05) |
| Teste | `tests/e2e/questionario.spec.ts` › "sem coleta de dados demográficos, o envio leva direto ao agradecimento" |
| Pré-condições | Estudo aberto com a coleta demográfica desligada. |
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

Passos:

1. Abrir o link e concordar.
2. Responder tudo e enviar.
3. Abrir /sobre-voce pelo endereço.

Resultado esperado: A lista de etapas tem 2 itens e aparece "Etapa 2 de 2 · Questionário". O envio leva a "Respostas registradas", e a etapa não abre nem pelo endereço.

### CT-E72

**O perfil dos participantes aparece numa sub-aba de Resultados, com a tabela de números.**

| Campo | Valor |
|---|---|
| Cenário | [CN10 · Painel de resultados](#cn10) |
| Teste | `tests/e2e/privacidade.spec.ts` › "os dados demográficos aparecem em Resultados, numa sub-aba própria" |
| Pré-condições | Estudo aberto com a coleta ligada e uma resposta. |
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

Passos:

1. Responder escolhendo 25 a 34 anos.
2. Como pesquisador, abrir Resultados e Dados demográficos.
3. Abrir "Ver os números" e rodar o axe.

Resultado esperado: O gráfico de Faixa etária tem o aria-label "25 a 34 anos, 1 (100%)", e a tabela mostra 100%. Zero violações.

### CT-E73

**Toda resposta traz os cabeçalhos de segurança.**

| Campo | Valor |
|---|---|
| Cenário | [CN23 · Proteção de dados](#cn23) |
| Teste | `tests/e2e/privacidade.spec.ts` › "toda resposta sai com os cabeçalhos de segurança" |
| Pré-condições | Nenhuma. |
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

Passos:

1. Pedir / e ler os cabeçalhos.

Resultado esperado: CSP com frame-ancestors 'none', HSTS de 2 anos, nosniff, X-Frame-Options DENY, Referrer-Policy same-origin e sem X-Powered-By.

### CT-E74

**A política abre sem conta e passa no axe.**

| Campo | Valor |
|---|---|
| Cenário | [CN23 · Proteção de dados](#cn23) |
| Teste | `tests/e2e/privacidade.spec.ts` › "a política de privacidade é pública e acessível" |
| Pré-condições | Navegador sem cookie de sessão. |
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

Passos:

1. Abrir /privacidade e rodar o axe.

Resultado esperado: O h1 é "Política de privacidade" e aparece "Seus direitos (LGPD, art. 18)". Zero violações.

### CT-E75

**O índice leva a cada seção, e a página cabe em 320 px.**

| Campo | Valor |
|---|---|
| Cenário | [CN23 · Proteção de dados](#cn23) |
| Teste | `tests/e2e/privacidade.spec.ts` › "a política leva cada seção pelo índice e não rola na horizontal em 320 px" |
| Pré-condições | Navegador sem cookie de sessão. |
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

Passos:

1. Em /privacidade, clicar em Dúvidas e pedidos no índice.
2. Reduzir a largura para 320 px e rodar o axe.

Resultado esperado: A URL termina em #contato, com a seção à vista. Em 320 px não há rolagem horizontal. Zero violações.

### CT-E76

**Voltar leva ao rodapé da página inicial, de onde a pessoa saiu.**

| Campo | Valor |
|---|---|
| Cenário | [CN23 · Proteção de dados](#cn23) |
| Teste | `tests/e2e/privacidade.spec.ts` › "da página inicial, a política volta ao rodapé de onde a pessoa saiu" |
| Pré-condições | Navegador sem cookie de sessão. |
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

Passos:

1. Em /, clicar em Política de privacidade no rodapé.
2. Clicar em Voltar para a página inicial.

Resultado esperado: A URL termina em /#rodape, com o rodapé à vista.

### CT-E77

**De Minha conta e da ajuda, Voltar leva à tela de origem.**

| Campo | Valor |
|---|---|
| Cenário | [CN23 · Proteção de dados](#cn23) |
| Teste | `tests/e2e/privacidade.spec.ts` › "de Minha conta e da ajuda, a política volta para a mesma tela" |
| Pré-condições | Pesquisador logado. |
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

Passos:

1. Em /conta, abrir a política.
2. Clicar em Voltar para Minha conta.
3. Em /estudos, abrir a ajuda e, nela, a política.
4. Clicar em Voltar para a página anterior.

Resultado esperado: Logado, a ficha mostra "Baixar meus dados". Os dois Voltar levam a /conta e a /estudos.

### CT-E78

**A política abre em outra aba a partir das janelas, sem perder o que foi digitado.**

| Campo | Valor |
|---|---|
| Cenário | [CN23 · Proteção de dados](#cn23) |
| Teste | `tests/e2e/privacidade.spec.ts` › "das janelas de acesso, a política abre em outra aba, sem perder o que foi digitado, e voltar tenta fechar a aba" |
| Pré-condições | Navegador sem cookie de sessão. |
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

Passos:

1. Abrir /entrar e conferir o link.
2. Em /cadastrar, digitar o nome.
3. Clicar em Política de privacidade.
4. Na aba nova, clicar em Fechar esta aba e voltar.

Resultado esperado: A janela de Entrar também tem o link. A aba nova mostra a política, e o campo Nome continua preenchido na aba de origem. Voltar pede para fechar a aba; se o navegador recusar, segue para a página inicial. O teste troca window.close por um registro, porque o fechamento real trava o encerramento do Playwright no Chromium headless. O fechamento real foi conferido à parte, num script com Playwright, em 06/11/2026, e o caso manual CT-M23 repete a conferência.

### CT-E79

**O destino do Voltar nunca sai da ferramenta.**

| Campo | Valor |
|---|---|
| Cenário | [CN23 · Proteção de dados](#cn23) |
| Teste | `tests/e2e/privacidade.spec.ts` › "a política não aceita voltar para outro site" |
| Pré-condições | Nenhuma. |
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

Passos:

1. Abrir /privacidade?de= com https://exemplo.com, //exemplo.com, /\exemplo.com e /[tab]/exemplo.com.

Resultado esperado: Nos quatro casos, o link é "Voltar para a página inicial" e aponta para /.

### CT-E80

**Depois de 5 senhas erradas, o login bloqueia o e-mail.**

| Campo | Valor |
|---|---|
| Cenário | [CN23 · Proteção de dados](#cn23) |
| Teste | `tests/e2e/privacidade.spec.ts` › "depois de 5 senhas erradas o e-mail espera" |
| Pré-condições | Um e-mail de teste. |
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

Passos:

1. Errar a senha 5 vezes em Entrar.
2. Tentar de novo.

Resultado esperado: Cada erro mostra "senha não conferem", e o foco vai ao resumo. A sexta tentativa mostra "Muitas tentativas com este e-mail".

### CT-E81

**Baixar meus dados entrega a conta em JSON, sem a senha.**

| Campo | Valor |
|---|---|
| Cenário | [CN23 · Proteção de dados](#cn23) |
| Teste | `tests/e2e/privacidade.spec.ts` › "Baixar meus dados entrega um JSON com a conta e sem a senha" |
| Pré-condições | Pesquisador logado. |
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

Passos:

1. Em /conta, clicar em Baixar meus dados.

Resultado esperado: O arquivo se chama meus-dados-ferramenta-ueq-AAAA-MM-DD.json, traz o e-mail da conta e não tem senhaHash.

### CT-E82

**O participante lê a política a partir do termo, sem sair do link do estudo.**

| Campo | Valor |
|---|---|
| Cenário | [CN05 · Participação no estudo](#cn05) |
| Teste | `tests/e2e/questionario.spec.ts` › "a política de privacidade abre pelo termo, dentro do link do participante, e volta para ele" |
| Pré-condições | Estudo aberto. |
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

Passos:

1. Abrir o link.
2. Clicar em Política de privacidade.
3. Conferir os links da página e rodar o axe.
4. Clicar em Voltar.

Resultado esperado: A URL termina em /privacidade, com o h1 "Política de privacidade" e a seção "Se você respondeu um questionário". Não há barra da ferramenta e todo link fica em /r/ ou é âncora. Voltar leva ao termo. Zero violações.

### CT-E83

**Sem tradução, a política avisa no idioma da pessoa e marca o texto como português.**

| Campo | Valor |
|---|---|
| Cenário | [CN05 · Participação no estudo](#cn05) |
| Teste | `tests/e2e/questionario.spec.ts` › "sem tradução automática, a política avisa no idioma da pessoa e sai marcada como português" |
| Pré-condições | Estudo aberto, escrito em inglês; sem tradução da política no banco. |
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

Passos:

1. Abrir o link.
2. Clicar em Privacy policy.
3. Rodar o axe.

Resultado esperado: Aparece "This policy has not been translated into your language yet". O main tem lang=pt-BR, e o link é "Back". Zero violações.

### CT-E84

**Documento longo abre como índice, e cada seção abre em página própria, com o diagrama à vista.**

| Campo | Valor |
|---|---|
| Cenário | [CN18 · Documentação na ferramenta](#cn18) |
| Teste | `tests/e2e/documentacao.spec.ts` › "documento longo abre como índice, e cada seção em página própria com o diagrama à vista" |
| Pré-condições | Navegador sem cookie de sessão. |
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

Passos:

1. Abrir /documentacao/diagramas-de-sequencia e rodar o axe.
2. Clicar em 7. Convidar alguém para o estudo e rodar o axe.
3. Clicar em Próxima.
4. Clicar em Anterior.

Resultado esperado: O índice "Neste documento" tem 8 itens, sem nenhum diagrama na abertura. A seção tem endereço próprio, título de página com o documento, h1, "7 de 8" e o diagrama carregado e à vista sem rolar. Na última seção não há Próxima. Zero violações.

### CT-E85

**Voltar leva à página de onde a pessoa veio e, sem histórico, à página de cima.**

| Campo | Valor |
|---|---|
| Cenário | [CN18 · Documentação na ferramenta](#cn18) |
| Teste | `tests/e2e/documentacao.spec.ts` › "Voltar leva à página de onde a pessoa veio e, sem histórico, à página de cima" |
| Pré-condições | Navegador sem cookie de sessão. |
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

Passos:

1. Numa seção de Diagramas de sequência, seguir o link para Arquitetura.
2. Clicar em Voltar.
3. Em outra aba, abrir direto o diagrama do modelo lógico.
4. Clicar em Voltar.

Resultado esperado: O link leva a /documentacao/arquitetura/implantacao. O primeiro Voltar retorna à seção de origem, em outro documento. Sem histórico, Voltar leva à abertura do documento.

### CT-E86

**Seção com muitas subseções vira índice, e os links de tabela e os endereços antigos acham a página certa.**

| Campo | Valor |
|---|---|
| Cenário | [CN18 · Documentação na ferramenta](#cn18) |
| Teste | `tests/e2e/documentacao.spec.ts` › "seção com muitas subseções vira índice, e o link de uma tabela leva à página da linha" |
| Pré-condições | Navegador sem cookie de sessão. |
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

Passos:

1. Abrir Casos de ponta a ponta e clicar em CT-E02.
2. Em Cenários, clicar em CT-E01.
3. Abrir /documentacao/casos-de-teste#ct-e03 e #ct-u01.
4. Abrir uma seção que não existe e uma de documento não publicado.

Resultado esperado: Cada caso tem página própria, sem violações. O fragmento antigo redireciona para a página nova, e #ct-u01 fica à vista na tabela do cenário. Seção inexistente e documento não publicado dão 404.

### CT-E87

**Documento curto continua inteiro, sem cliques a mais.**

| Campo | Valor |
|---|---|
| Cenário | [CN18 · Documentação na ferramenta](#cn18) |
| Teste | `tests/e2e/documentacao.spec.ts` › "documento curto continua inteiro, com o índice da página na ficha" |
| Pré-condições | Navegador sem cookie de sessão. |
| Requisitos | a definir |
| Resultado em 06/11/2026 | Passou (celular e desktop) |

Passos:

1. Abrir /documentacao/checklist-manual.

Resultado esperado: As seções aparecem na mesma página, sem o índice "Neste documento", e a ficha lista as âncoras.

## Casos de unidade

Cada caso reúne os testes de unidade de uma mesma regra. A coluna Execuções conta os testes reais: um caso parametrizado roda uma vez por idioma ou por par de cores.

### CN08 · Cálculo UEQ

| ID | Arquivo | Função ou grupo | Resultado esperado | Execuções | Requisitos | Resultado em 06/11/2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u01"></a>CT-U01 | `recodificar.test.ts` | `recodificar` | Com positivo à direita, 1 vira -3, 4 vira 0 e 7 vira 3 | 1 | a definir | Passou |
| <a id="ct-u02"></a>CT-U02 | `recodificar.test.ts` | `recodificar` | Com positivo à esquerda, 1 vira 3, 4 vira 0 e 7 vira -3 | 1 | a definir | Passou |
| <a id="ct-u03"></a>CT-U03 | `recodificar.test.ts` | `recodificar` | Recusa 0, 8, 3,5 e NaN, que não existem na escala de 1 a 7 | 4 | a definir | Passou (4 de 4) |
| <a id="ct-u04"></a>CT-U04 | `recodificar.test.ts` | `recodificarParticipante` | Transforma o ponto do meio em 0 nos 26 itens | 1 | a definir | Passou |
| <a id="ct-u05"></a>CT-U05 | `recodificar.test.ts` | `recodificarParticipante` | Aplica a polaridade de cada item: 7 em tudo dá +3 nos itens '+' e -3 nos itens '-' | 1 | a definir | Passou |
| <a id="ct-u06"></a>CT-U06 | `recodificar.test.ts` | `recodificarParticipante` | Recusa participante sem as 26 respostas | 1 | a definir | Passou |
| <a id="ct-u07"></a>CT-U07 | `estatistica.test.ts` | `media` | Devolve null sem valores e calcula a média simples | 2 | a definir | Passou (2 de 2) |
| <a id="ct-u08"></a>CT-U08 | `estatistica.test.ts` | `desvioPadraoAmostral` | Null com n = 0 e n = 1, divisor n - 1 e zero quando todos são iguais | 3 | a definir | Passou (3 de 3) |
| <a id="ct-u09"></a>CT-U09 | `estatistica.test.ts` | `intervaloConfianca95` | Média ± z · dp / √n; null sem dp (n = 1) e com dp = 0, como o #NUM! da planilha | 3 | a definir | Passou (3 de 3) |
| <a id="ct-u10"></a>CT-U10 | `estatistica.test.ts` | `correlacao` | Correlação de Pearson; null sem variação ou com menos de 2 pares; recusa séries de tamanhos diferentes | 4 | a definir | Passou (4 de 4) |
| <a id="ct-u11"></a>CT-U11 | `estatistica.test.ts` | `alfaCronbach` | Alfa padronizado k · r̄ / (1 + (k - 1) · r̄); 1 quando os itens andam juntos; null com menos de 2 itens, item sem variação (#DIV/0!), denominador zero ou um participante | 6 | a definir | Passou (6 de 6) |
| <a id="ct-u12"></a>CT-U12 | `escalas.test.ts` | `escoresPorParticipante` | +3 em todas as escalas para quem marca sempre o polo positivo; média só dos itens da escala | 2 | a definir | Passou (2 de 2) |
| <a id="ct-u13"></a>CT-U13 | `escalas.test.ts` | `faixaInterpretacao` | -0,8 e 0,8 são neutros; acima de 0,8 positiva, abaixo de -0,8 negativa | 2 | a definir | Passou (2 de 2) |
| <a id="ct-u14"></a>CT-U14 | `escalas.test.ts` | `resultadoPorEscala` | Bordas n = 0, n = 1 e todos iguais, e média, dp, IC e alfa com dois participantes | 4 | a definir | Passou (4 de 4) |
| <a id="ct-u15"></a>CT-U15 | `escalas.test.ts` | `resultadoPorItem` | Os 26 itens em ordem com média recodificada e distribuição de 1 a 7 | 1 | a definir | Passou |
| <a id="ct-u16"></a>CT-U16 | `benchmark.test.ts` | `classificarBenchmark` | Uma média em cada uma das 5 faixas: excelente, bom, acima da média, abaixo da média e ruim | 5 | a definir | Passou (5 de 5) |
| <a id="ct-u17"></a>CT-U17 | `benchmark.test.ts` | `classificarBenchmark` | Média igual ao limite fica na faixa de baixo; usa os limites da escala pedida; null sem média | 3 | a definir | Passou (3 de 3) |
| <a id="ct-u18"></a>CT-U18 | `analisar-estudo.test.ts` | `analisarEstudo` | Estatísticas só com as participações incluídas na análise | 1 | a definir | Passou |
| <a id="ct-u20"></a>CT-U20 | `analisar-estudo.test.ts` | `analisarEstudo` | Classifica no benchmark e calcula pragmática e hedônica pela média das escalas | 1 | a definir | Passou |
| <a id="ct-u21"></a>CT-U21 | `analisar-estudo.test.ts` | `analisarEstudo` | Sinaliza alfa abaixo do mínimo do protocolo | 1 | a definir | Passou |
| <a id="ct-u22"></a>CT-U22 | `analisar-estudo.test.ts` | `analisarEstudo` | Sem ninguém na análise devolve números null, sem quebrar | 1 | a definir | Passou |

### CN09 · Respostas suspeitas

| ID | Arquivo | Função ou grupo | Resultado esperado | Execuções | Requisitos | Resultado em 06/11/2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u19"></a>CT-U19 | `analisar-estudo.test.ts` | `analisarEstudo` | Avalia a suspeita de todas as participações, inclusive as excluídas | 1 | a definir | Passou |
| <a id="ct-u23"></a>CT-U23 | `inconsistencia.test.ts` | `amplitudePorEscala` | Zero para respostas consistentes; reproduz o exemplo de perspicuidade do handbook (distância 5) | 2 | a definir | Passou (2 de 2) |
| <a id="ct-u24"></a>CT-U24 | `inconsistencia.test.ts` | `respostasIguais` | Conta a posição mais repetida | 1 | a definir | Passou |
| <a id="ct-u25"></a>CT-U25 | `inconsistencia.test.ts` | `marcarSuspeitos` | Suspeito com 3 escalas inconsistentes, não com 2; amplitude igual a 3 não é inconsistência | 3 | a definir | Passou (3 de 3) |
| <a id="ct-u26"></a>CT-U26 | `inconsistencia.test.ts` | `marcarSuspeitos` | Suspeito com mais de 15 respostas iguais, não com exatamente 15 | 2 | a definir | Passou (2 de 2) |
| <a id="ct-u27"></a>CT-U27 | `inconsistencia.test.ts` | `marcarSuspeitos` | Aponta os dois motivos quando as duas regras valem; lê os limiares da configuração | 2 | a definir | Passou (2 de 2) |
| <a id="ct-u28"></a>CT-U28 | `fixtures.test.ts` | `fixtures conforme os LEIA-ME` | basico sem suspeitos; inconsistente marca exatamente as linhas 1, 6, 9 e 13; todos-1 e todos-7 caem na regra das respostas iguais | 3 | a definir | Passou (3 de 3) |

### CN15 · Validação contra a planilha oficial

| ID | Arquivo | Função ou grupo | Resultado esperado | Execuções | Requisitos | Resultado em 06/11/2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u29"></a>CT-U29 | `fixtures.test.ts` | `fixture … contra a planilha oficial` | Para cada fixture (basico, inconsistente, extremos/n1, n2, todos-1, todos-7): média, dp, n, IC95, alfa, benchmark, pragmática, hedônica, itens e suspeitas iguais aos da planilha, com tolerância de 1e-6 | 6 | a definir | Pulado: aguarda dados da equipe |

### CN05 · Participação no estudo

| ID | Arquivo | Função ou grupo | Resultado esperado | Execuções | Requisitos | Resultado em 06/11/2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u30"></a>CT-U30 | `balanceamento.test.ts` | `versaoComMenosRespostas` | Escolhe a versão com menos respostas concluídas; no empate, a de menor ordem; com uma versão, ela; sem versões, null | 4 | a definir | Passou (4 de 4) |

### CN11 · Exportação em CSV

| ID | Arquivo | Função ou grupo | Resultado esperado | Execuções | Requisitos | Resultado em 06/11/2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u31"></a>CT-U31 | `csv.test.ts` | `campoCsv` | Texto simples fica como está; ponto e vírgula e quebra de linha vão entre aspas; aspas internas são dobradas; ausente fica vazio | 5 | a definir | Passou (5 de 5) |
| <a id="ct-u32"></a>CT-U32 | `csv.test.ts` | `documentoCsv` | Começa com BOM, usa ; e termina cada linha com CRLF; sai sem BOM quando pedido | 2 | a definir | Passou (2 de 2) |
| <a id="ct-u33"></a>CT-U33 | `csv.test.ts` | `decimalCsv e slugDoTitulo` | Vírgula decimal e vazio para ausente; nome de arquivo sem acentos, espaços nem símbolos, e nunca vazio | 3 | a definir | Passou (3 de 3) |
| <a id="ct-u34"></a>CT-U34 | `exportacoes.test.ts` | `exportarPlanilhaOficial` | Da fixture basico sai idêntica ao respostas.csv original; deixa de fora quem está fora da análise | 2 | a definir | Passou (2 de 2) |
| <a id="ct-u35"></a>CT-U35 | `exportacoes.test.ts` | `exportarBrutas` | BOM, cabeçalho e 26 colunas de itens; versão e demografia protegidas contra ;, aspas e quebra de linha | 2 | a definir | Passou (2 de 2) |
| <a id="ct-u37"></a>CT-U37 | `exportacoes.test.ts` | `exportarRecodificadas` | Troca 1 a 7 por -3 a +3 com a polaridade corrigida | 1 | a definir | Passou |
| <a id="ct-u38"></a>CT-U38 | `exportacoes.test.ts` | `exportarResultados` | Uma linha por escala, com vírgula decimal | 1 | a definir | Passou |

### CN07 · Idiomas

| ID | Arquivo | Função ou grupo | Resultado esperado | Execuções | Requisitos | Resultado em 06/11/2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u36"></a>CT-U36 | `exportacoes.test.ts` | `idioma nas exportações` | Diz em que idioma a pessoa respondeu e se a tradução é aprovada; importada sai com a origem e sem idioma | 2 | a definir | Passou (2 de 2) |
| <a id="ct-u45"></a>CT-U45 | `idiomas.test.ts` | `os 37 idiomas do pacote oficial` | Os 37 idiomas estão completos e cada um tem os 26 pares em ordem, preenchidos e com termos diferentes | 38 | a definir | Passou (38 de 38) |
| <a id="ct-u46"></a>CT-U46 | `idiomas.test.ts` | `os 37 idiomas do pacote oficial` | O português é exatamente o de data/ueq-itens-ptbr.json, que alimenta o banco | 1 | a definir | Passou |
| <a id="ct-u47"></a>CT-U47 | `idiomas.test.ts` | `os 37 idiomas do pacote oficial` | Marca os 9 idiomas sem tradução aprovada e os 3 da direita para a esquerda; toda correção guarda o par original e o motivo | 2 | a definir | Passou (2 de 2) |
| <a id="ct-u48"></a>CT-U48 | `idiomas.test.ts` | `textos das telas` | Em cada idioma, nenhum texto vazio, os mesmos {marcadores} do português e o nome acessível de cada círculo com posição e polo | 38 | a definir | Passou (38 de 38) |
| <a id="ct-u49"></a>CT-U49 | `idiomas.test.ts` | `plural e lista` | Plural na forma do idioma (com queda em other) e listas juntadas como o idioma junta | 2 | a definir | Passou (2 de 2) |
| <a id="ct-u50"></a>CT-U50 | `idiomas.test.ts` | `negociarIdioma` | Escolhe o primeiro dos 37 pela preferência do navegador, aceita códigos antigos, cai no português e dá o lang de cada idioma | 3 | a definir | Passou (3 de 3) |

### CN13 · Importação por CSV

| ID | Arquivo | Função ou grupo | Resultado esperado | Execuções | Requisitos | Resultado em 06/11/2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u39"></a>CT-U39 | `importacao.test.ts` | `lerCsvDeRespostas` | Lê a fixture basico como o módulo UEQ e aceita de volta a exportação da planilha oficial | 2 | a definir | Passou (2 de 2) |
| <a id="ct-u40"></a>CT-U40 | `importacao.test.ts` | `lerCsvDeRespostas` | Aceita vírgula, tabulação, BOM, aspas e separador sobrando; ignora linhas em branco mantendo o número real de cada linha | 2 | a definir | Passou (2 de 2) |
| <a id="ct-u41"></a>CT-U41 | `importacao.test.ts` | `lerCsvDeRespostas` | Aponta por linha o número errado de valores e os valores fora da escala; recusa arquivo com linhas demais | 2 | a definir | Passou (2 de 2) |

### CN10 · Painel de resultados

| ID | Arquivo | Função ou grupo | Resultado esperado | Execuções | Requisitos | Resultado em 06/11/2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u42"></a>CT-U42 | `leitura-rapida.test.ts` | `leituraDeUmaVersao` | Reproduz a frase do protótipo r6; junta escalas da mesma faixa e cita as negativas; null sem média | 3 | a definir | Passou (3 de 3) |
| <a id="ct-u43"></a>CT-U43 | `leitura-rapida.test.ts` | `leituraDaComparacao` | Aponta as duas maiores diferenças e a quem favorecem; diz quando as versões ficam próximas; com três versões conta as escalas em que cada uma lidera | 3 | a definir | Passou (3 de 3) |
| <a id="ct-u44"></a>CT-U44 | `leitura-rapida.test.ts` | `formatarDecimal` | Vírgula, duas casas e traço para ausente | 1 | a definir | Passou |

### CN14 · Cores e contraste

| ID | Arquivo | Função ou grupo | Resultado esperado | Execuções | Requisitos | Resultado em 06/11/2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u51"></a>CT-U51 | `contraste.test.ts` | `contraste dos tokens de cor` | Cada par de texto do tema atinge 4,5:1 | 30 | a definir | Passou (30 de 30) |
| <a id="ct-u52"></a>CT-U52 | `contraste.test.ts` | `contraste dos tokens de cor` | Cada borda de campo, foco e marcador de gráfico atinge 3:1 contra os fundos e as faixas do benchmark | 27 | a definir | Passou (27 de 27) |

### CN16 · UEQ-S

| ID | Arquivo | Função ou grupo | Resultado esperado | Execuções | Requisitos | Resultado em 06/11/2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u53"></a>CT-U53 | `ueq-s.test.ts` | `UEQ-S` | Os 8 itens do UEQ-S apontam pares do UEQ com escala e polaridade certas, na ordem; os limites do benchmark estão em ordem | 2 | a definir | Pulado: aguarda dados da equipe |

### CN18 · Documentação na ferramenta

| ID | Arquivo | Função ou grupo | Resultado esperado | Execuções | Requisitos | Resultado em 06/11/2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u54"></a>CT-U54 | `documentacao.test.ts` | `catálogo da documentação` | Todo documento e download do catálogo existe; cada documento tem um endereço só; todo .md de docs/documentacao está no catálogo; endereço fora do catálogo não vira documento | 3 | a definir | Passou (3 de 3) |
| <a id="ct-u55"></a>CT-U55 | `documentacao.test.ts` | `diagramas` | Cada diagrama Mermaid dos documentos tem o SVG gerado e o arquivo-fonte igual ao do documento, e não sobra SVG sem uso | 3 | a definir | Passou (3 de 3) |
| <a id="ct-u56"></a>CT-U56 | `documentacao.test.ts` | `destinoDoLink` | Link para outro documento abre na aba Documentação com a âncora; arquivo para baixar sai pela rota de download; o resto do repositório abre no GitHub; nenhum link relativo dos documentos aponta para arquivo que não existe | 4 | a definir | Passou (4 de 4) |
| <a id="ct-u57"></a>CT-U57 | `documentacao.test.ts` | `renderizarMarkdown` | Título separado, âncoras iguais às do GitHub (inclusive repetidas), tabela numa região rolável com nome, links reescritos e diagrama como botão de ampliar com imagem de texto alternativo e o código à vista | 3 | a definir | Passou (3 de 3) |
| <a id="ct-u64"></a>CT-U64 | `documentacao.test.ts` | `dividirDocumento` | Separa a abertura das seções sem confundir código com título; usa endereço sem acento; divide só a seção com 3 subseções ou mais; acha a página de cada âncora, inclusive de uma linha de tabela; resume pelo primeiro parágrafo; documento curto fica inteiro | 5 | a definir | Passou (5 de 5) |
| <a id="ct-u65"></a>CT-U65 | `documentacao.test.ts` | `rota das âncoras em documentos divididos` | Leva à página da âncora, com fragmento só no meio da página; reescreve os links da seção; toda página de todo documento publicado tem título e não repete o h1 | 3 | a definir | Passou (3 de 3) |

### CN10 · Painel de resultados: perfil dos participantes

| ID | Arquivo | Função ou grupo | Resultado esperado | Execuções | Requisitos | Resultado em 06/11/2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u60"></a>CT-U60 | `perfil-demografico.test.ts` | `perfilDemografico` | Conta cada opção, quem preferiu não responder e quem pulou; escala ordenada fica na ordem da escala; gênero vai da maior para a menor; sem participações, as parcelas ficam em zero | 4 | a definir | Passou (4 de 4) |

### CN21 · Equipe e notificações

| ID | Arquivo | Função ou grupo | Resultado esperado | Execuções | Requisitos | Resultado em 06/11/2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u59"></a>CT-U59 | `modelo-email.test.ts` | `modelo dos e-mails` | Monta o HTML com o idioma, o botão, o link reserva e o rodapé; escapa o que vem do pesquisador; vira da direita para a esquerda em árabe, hebraico e persa; tem a mesma mensagem em texto puro | 4 | a definir | Passou (4 de 4) |

### CN23 · Proteção de dados

| ID | Arquivo | Função ou grupo | Resultado esperado | Execuções | Requisitos | Resultado em 06/11/2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u58"></a>CT-U58 | `cripto.test.ts` | `criptografia de campo` | Cifra e decifra com IV novo a cada vez; texto alterado ou outra chave não decifram; Json cifrado volta igual e o formato antigo continua legível; chave de tamanho errado é recusada; sem chave, guarda como veio | 6 | a definir | Passou (6 de 6) |

### CN24 · Idioma da ferramenta

| ID | Arquivo | Função ou grupo | Resultado esperado | Execuções | Requisitos | Resultado em 06/11/2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u62"></a>CT-U62 | `catalogo.test.ts` | `catálogo da interface` | O catálogo está em dia com os t() e m() do código, e nenhum texto dele é vazio | 2 | a definir | Passou (2 de 2) |
| <a id="ct-u63"></a>CT-U63 | `catalogo.test.ts` | `tradutor` | Devolve o original sem tradução e interpola os marcadores; a chave muda com o idioma de origem, menos no português; marcadores desconhecidos ficam como estão | 3 | a definir | Passou (3 de 3) |

### CN25 · Cenários de demonstração

| ID | Arquivo | Função ou grupo | Resultado esperado | Execuções | Requisitos | Resultado em 06/11/2026 |
|---|---|---|---|---|---|---|
| <a id="ct-u61"></a>CT-U61 | `respostas-sinteticas.test.ts` | `respostas sintéticas dos cenários de demonstração` | Dá 26 valores de 1 a 7; quem respondeu com atenção nunca sai suspeito, e aleatória e iguais sempre saem; a média de cada escala fica perto do perfil; a mesma semente gera as mesmas respostas | 4 | a definir | Passou (4 de 4) |

## Casos manuais

Feitos por pessoas da equipe. Os de CN17 vêm de [docs/checklist-manual.md](../checklist-manual.md); marque lá e anote o problema e quem corrige.

| ID | Cenário | Grupo | Verificação | Requisitos | Situação |
|---|---|---|---|---|---|
| <a id="ct-m01"></a>CT-M01 | CN17 | Leitor de tela | Questionário completo do começo ao fim só ouvindo (NVDA + Firefox; VoiceOver + Safari ou TalkBack + Chrome) | a definir | A fazer pela equipe |
| <a id="ct-m02"></a>CT-M02 | CN17 | Leitor de tela | Ao entrar num item, o leitor anuncia o número, os dois termos e a posição | a definir | A fazer pela equipe |
| <a id="ct-m03"></a>CT-M03 | CN17 | Leitor de tela | O progresso é anunciado sem interromper a cada clique | a definir | A fazer pela equipe |
| <a id="ct-m04"></a>CT-M04 | CN17 | Leitor de tela | Ao enviar incompleto, o leitor anuncia o resumo e dá para ir ao item faltando | a definir | A fazer pela equipe |
| <a id="ct-m05"></a>CT-M05 | CN17 | Leitor de tela | No painel, o gráfico é anunciado com a descrição e a tabela é navegável por célula com o cabeçalho lido | a definir | A fazer pela equipe |
| <a id="ct-m06"></a>CT-M06 | CN17 | Leitor de tela | Mensagens de sucesso ("Coleta aberta") são anunciadas | a definir | A fazer pela equipe |
| <a id="ct-m07"></a>CT-M07 | CN17 | Teclado | Criar estudo, abrir coleta, responder, ver resultados e exportar sem mouse; foco sempre visível e em ordem lógica | a definir | A fazer pela equipe |
| <a id="ct-m08"></a>CT-M08 | CN17 | Visão | Zoom de 200% e 400%: nada corta, nada sobrepõe | a definir | A fazer pela equipe |
| <a id="ct-m09"></a>CT-M09 | CN17 | Visão | Daltonismo simulado no DevTools (protanopia, deuteranopia, tritanopia, acromatopsia): o gráfico continua legível | a definir | A fazer pela equipe |
| <a id="ct-m10"></a>CT-M10 | CN17 | Visão | Alto contraste do Windows: círculos do questionário e foco visíveis | a definir | A fazer pela equipe |
| <a id="ct-m11"></a>CT-M11 | CN17 | Visão | Espaçamento de texto aumentado (WCAG 1.4.12) não quebra o layout | a definir | A fazer pela equipe |
| <a id="ct-m12"></a>CT-M12 | CN17 | Celular real | Abrir o link pelo WhatsApp e responder com o polegar, sem toque acidental no círculo vizinho; o teclado virtual não cobre o campo nos dados opcionais | a definir | A fazer pela equipe |
| <a id="ct-m13"></a>CT-M13 | CN17 | Avaliação heurística | Cada membro avalia sozinho com as 10 heurísticas de Nielsen (tela, heurística, severidade 0 a 4, sugestão) e depois a equipe consolida | a definir | A fazer pela equipe |
| <a id="ct-m14"></a>CT-M14 | CN17 | Teste com usuários | 5 participantes respondem um estudo real; 2 a 3 pesquisadores criam estudo com 2 versões, abrem a coleta, interpretam o painel, tiram uma suspeita e exportam; registrar sucesso, tempo, erros e o UEQ da própria ferramenta | a definir | A fazer pela equipe |
| <a id="ct-m15"></a>CT-M15 | CN15 | Planilha oficial | Colar cada data/fixtures/**/respostas.csv na UEQ Data Analysis Tool V15 e copiar os resultados para esperado.json (data/fixtures/LEIA-ME.md) | a definir | A fazer pela equipe |
| <a id="ct-m16"></a>CT-M16 | CN09 | Script | Mudar um limiar em data/protocolo.json, rodar pnpm suspeitas:recalcular e conferir a coluna suspeita | a definir | A fazer pela equipe |
| <a id="ct-m17"></a>CT-M17 | CN08 | Seed | Rodar pnpm db:seed com um item inválido em data/ueq-itens-ptbr.json e conferir que o seed para dizendo qual item | a definir | A fazer pela equipe |
| <a id="ct-m18"></a>CT-M18 | CN17 | Revisão visual | Comparar cada tela com o PNG correspondente em docs/prototipos/alta-fidelidade/, seguindo docs/roteiro-revisao.md | a definir | A fazer pela equipe |
| <a id="ct-m19"></a>CT-M19 | CN17 | Instalação | Num clone limpo, seguir o Como rodar do README e chegar à tela Entrar em http://localhost:3000 | a definir | A fazer pela equipe |
| <a id="ct-m20"></a>CT-M20 | CN17 | Leitor de tela | As janelas (Entrar, Criar conta, Sair, excluir, Compartilhar, ajuda) anunciam o título ao abrir, prendem o foco e devolvem o foco a quem abriu | a definir | A fazer pela equipe |
| <a id="ct-m21"></a>CT-M21 | CN17 | Leitor de tela | O número de avisos do sino é anunciado, e dá para aceitar um convite só ouvindo | a definir | A fazer pela equipe |
| <a id="ct-m22"></a>CT-M22 | CN17 | Leitor de tela | O tour guiado se entende só ouvindo, e dá para pular | a definir | A fazer pela equipe |
| <a id="ct-m23"></a>CT-M23 | CN17 | Leitor de tela | Na política de privacidade, o "Voltar" diz para onde vai, e o link das janelas de acesso avisa que abre em nova aba. Em Chrome, Firefox e Safari reais, "Fechar esta aba e voltar" fecha a aba e devolve a janela de cadastro com o que foi digitado | a definir | A fazer pela equipe |
| <a id="ct-m24"></a>CT-M24 | CN17 | Celular real | Link do participante aberto num estudo em outro idioma, e num idioma da direita para a esquerda (árabe, hebraico ou persa) | a definir | A fazer pela equipe |
| <a id="ct-m25"></a>CT-M25 | CN17 | Celular real | Política de privacidade aberta pelo termo de consentimento, no celular, e o "Voltar" leva de volta ao termo | a definir | A fazer pela equipe |

## Pendências

- **[CT-U29](#ct-u29) · validação contra a planilha oficial.** Seis testes pulados até a equipe colar cada fixture na UEQ Data Analysis Tool e preencher os `esperado.json` ([CT-M15](#ct-m15), passo a passo em [data/fixtures/LEIA-ME.md](../../data/fixtures/LEIA-ME.md)). É a prova principal de fidelidade ao instrumento.
- **[CT-U53](#ct-u53) · UEQ-S.** Dois testes pulados até a equipe preencher os itens e o benchmark do UEQ-S (passo 5 de [data/LEIA-ME.md](../../data/LEIA-ME.md)).
- **Casos manuais.** Os 25 estão por fazer, inclusive o teste com usuários previsto em [docs/ihc.md §6](../ihc.md#6-como-verificar-automação-não-basta).
- **Administração.** As páginas de Administração (contas, idiomas, proteção de dados e cenários) ainda não têm caso de ponta a ponta. Só a geração de respostas dos cenários tem teste ([CT-U61](#ct-u61)).
- **Serviços externos.** A chamada à API do Claude e o envio de e-mail não são exercitados nos testes: [CT-E67](#ct-e67) grava a tradução direto no banco, e [CT-U59](#ct-u59) confere só o conteúdo do e-mail.
- **Painel em PDF em produção.** Os casos [CT-E39](#ct-e39) e [CT-E40](#ct-e40) rodam no ambiente local, com o Chromium do Playwright. O pacote usado na Vercel só é exercitado em produção.
- **Requisitos sem caso de teste automatizado:** a lista entra quando os requisitos estiverem definidos.
