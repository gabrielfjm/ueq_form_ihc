# Documentação da Ferramenta UEQ

A Ferramenta UEQ é uma aplicação web de código aberto para conduzir estudos de experiência do usuário com o *User Experience Questionnaire* (UEQ), do cadastro do estudo à exportação dos dados. Esta pasta documenta o que a ferramenta faz, para quem e como foi construída.

Tudo aqui está em formatos abertos e aparece direto no GitHub: Markdown, CSV e diagramas em Mermaid. A planilha de requisitos também está em `.xlsx`, para abrir no Excel ou no LibreOffice.

Os mesmos arquivos aparecem dentro da ferramenta, na aba **Documentação**, aberta a qualquer pessoa, sem login, organizados em seções (Visão geral, Requisitos, Usuários, Modelagem, Arquitetura, Testes e Especificação), com uma ficha que explica cada documento. As telas dessa aba estão nos protótipos de baixa e alta fidelidade (R10 a R15) do [protótipo navegável](https://claude.ai/artifact/GTXgzTaWbf5STw3z9r76U1).

O código e esta documentação estão sob a [licença MIT](../../LICENSE). O material oficial do UEQ em `data/` pertence aos autores do questionário (veja a seção Licença do [README](../../README.md#licença)).

## Conteúdo

| Documento | O que tem |
|---|---|
| [Requisitos](requisitos.md) | Os 52 requisitos funcionais e os 24 não funcionais, com prioridade, sprint de entrega, status e critério de aceitação |
| [Planilha de requisitos](planilha-requisitos.xlsx) | A mesma lista em planilha, com filtros, e abas de sprints, histórias, casos de uso, matrizes, cenários e casos de teste. Também em [requisitos.csv](requisitos.csv) |
| [Matriz de rastreabilidade](matriz-rastreabilidade.md) | Cada requisito ligado a histórias, casos de uso, personas, casos de teste, sprint e código. Também em [matriz-rastreabilidade.csv](matriz-rastreabilidade.csv) |
| [Casos e cenários de teste](casos-de-teste.md) | Estratégia de teste, 19 cenários e 133 casos (de ponta a ponta, de unidade e manuais), com passos, resultado esperado e o resultado da execução de 30/10/2026. Também em [casos-de-teste.csv](casos-de-teste.csv) |
| [Personas](personas.md) | Seis personas: duas de pesquisador, três de participante e uma de quem mantém o código |
| [Histórias de usuário](historias-de-usuario.md) | 38 histórias com critérios de aceitação. Também em [historias-de-usuario.csv](historias-de-usuario.csv) |
| [Casos de uso](casos-de-uso.md) | Diagramas de casos de uso, lista dos 25 casos e especificação dos principais |
| [Diagrama de classes](diagrama-de-classes.md) | Modelo de domínio (banco) e módulo de cálculo |
| [Diagramas de sequência](diagramas-de-sequencia.md) | Entrar, responder o questionário, ver resultados, tirar da análise, exportar PDF e importar CSV |
| [Arquitetura](arquitetura.md) | Modelo C4: contexto, containers e componentes; decisões de arquitetura e implantação |

## Por onde começar

- **Quer usar a ferramenta num estudo?** Leia as [personas](personas.md) de pesquisador, o caso de uso [Responder o questionário](casos-de-uso.md#uc10) para ver o que o participante vai passar, e a seção [Exportação](requisitos.md#exportação) dos requisitos.
- **Vai avaliar o projeto?** Comece pelos [requisitos](requisitos.md), pela [matriz de rastreabilidade](matriz-rastreabilidade.md) e pelos [casos de teste](casos-de-teste.md). As decisões de interface, com o princípio de IHC de cada uma, estão em [docs/rastreabilidade-ihc.md](../rastreabilidade-ihc.md).
- **Vai contribuir com código?** Leia a [arquitetura](arquitetura.md), o [diagrama de classes](diagrama-de-classes.md), a [estratégia de teste](casos-de-teste.md#estratégia) e as convenções em [docs/codigo.md](../codigo.md). Antes de mudar um comportamento, procure o arquivo na matriz para ver qual requisito e qual teste dependem dele.

## Identificadores

| Prefixo | O que identifica | Exemplo |
|---|---|---|
| RF | Requisito funcional | RF19 Responder os 26 itens |
| RNF | Requisito não funcional | RNF01 Conformidade WCAG 2.2 AA |
| HU | História de usuário | HU18 Responder com leitor de tela |
| UC | Caso de uso | UC10 Responder o questionário |
| PE | Persona | PE03 Célia |
| CN | Cenário de teste | CN06 Acessibilidade do questionário |
| CT-E, CT-U, CT-M | Caso de teste de ponta a ponta, de unidade ou manual | CT-E22 Fluxo completo só com teclado |
| S00 a S10, SP, SID, SDOC | Sprint: branch integrada por pull request | S05 Sprint 05 · Questionário (PR #9) |

As sprints seguem os prompts de [`prompts/`](../../prompts/): S00 a S08 e S10 têm o número do prompt. SP é a sprint de protótipos, SID a de idiomas e SDOC esta, de documentação. A revisão final (prompt 09) ainda não foi feita.

## Situação em 30/10/2026

- 74 requisitos entregues e 2 parciais.
- Testes: as 114 execuções de ponta a ponta passaram (57 casos, no desktop e no celular). Dos 258 testes de unidade, 250 passaram e 8 estão pulados à espera dos dados da equipe. Os 19 casos manuais estão por fazer.
- **RNF07, cálculo igual ao da planilha oficial:** os testes de comparação com a planilha esperam a equipe preencher os `esperado.json` das fixtures (passo a passo em [data/fixtures/LEIA-ME.md](../../data/fixtures/LEIA-ME.md)). As bordas e as regras das fixtures já passam.
- **RF51, UEQ-S:** existem só a estrutura de dados e o teste. Falta a equipe preencher os itens e o benchmark oficiais do UEQ-S (passo 5 de [data/LEIA-ME.md](../../data/LEIA-ME.md)).

## Outros documentos do projeto

Esta pasta se apoia nos documentos que guiaram a construção. Eles continuam valendo como especificação:

| Arquivo | Conteúdo |
|---|---|
| [docs/ueq-protocolo.md](../ueq-protocolo.md) | Itens, escalas, polaridade e todas as fórmulas do cálculo, conferidas no handbook e na planilha |
| [docs/ihc.md](../ihc.md) | Requisitos de usabilidade e acessibilidade, cada um ligado ao princípio da literatura |
| [docs/rastreabilidade-ihc.md](../rastreabilidade-ihc.md) | Cada decisão de interface, o princípio, o código e a evidência |
| [docs/idiomas.md](../idiomas.md) | Os 37 idiomas, de onde vem cada texto e as correções nos termos oficiais |
| [docs/design.md](../design.md) | Identidade visual |
| [docs/codigo.md](../codigo.md) | Convenções de código, testes e commits |
| [docs/checklist-manual.md](../checklist-manual.md) | Verificações manuais: leitor de tela, zoom, celular real, daltonismo |
| [docs/roteiro-revisao.md](../roteiro-revisao.md) | Roteiro para quem revisa a ferramenta |

## Como manter

Quando um pull request mudar o comportamento da ferramenta:

1. Atualize o requisito em [requisitos.md](requisitos.md), na [planilha](planilha-requisitos.xlsx) e em [requisitos.csv](requisitos.csv). Requisito novo ganha o próximo número livre; requisito retirado não tem o número reaproveitado.
2. Ligue o requisito a pelo menos uma história e um caso de uso, e atualize a [matriz](matriz-rastreabilidade.md) com o arquivo e o teste.
3. Teste novo vira um caso em [casos-de-teste.md](casos-de-teste.md): o título do `test(...)` ou do `it(...)` é o resultado esperado, e o caso aponta os requisitos que verifica.
4. Se mudar um diagrama Mermaid, rode `pnpm docs:diagramas` para gerar o SVG que a aba Documentação mostra. Um teste de unidade falha se esquecer.
5. Se a mudança alterar o banco, os fluxos ou as dependências entre partes, atualize o diagrama correspondente. Os diagramas são texto Mermaid dentro do Markdown: edite como código e confira a visualização no GitHub ou em [mermaid.live](https://mermaid.live).

Os três formatos (Markdown, CSV e XLSX) têm o mesmo conteúdo e devem mudar juntos.
