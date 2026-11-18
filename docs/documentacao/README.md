# Documentação da Ferramenta UEQ

A Ferramenta UEQ é uma aplicação web de código aberto para conduzir estudos de experiência do usuário com o *User Experience Questionnaire* (UEQ), do cadastro do estudo à exportação dos dados. Esta documentação diz o que a ferramenta faz, para quem, como foi construída e como se sabe que ela funciona.

Tudo está em formatos abertos e aparece direto no GitHub: Markdown, CSV e diagramas em Mermaid, com o arquivo-fonte de cada diagrama em [`fontes/`](fontes/). A planilha de requisitos também está em `.xlsx`, para abrir no Excel ou no LibreOffice. Os mesmos arquivos aparecem dentro da ferramenta, na aba **Documentação**, aberta a qualquer pessoa, sem login.

O código e esta documentação estão sob a [licença MIT](../../LICENSE). O material oficial do UEQ em `data/` pertence aos autores do questionário (ver a seção Licença do [README](../../README.md#licença)).

Projeto da disciplina Fundamentos da Interação Humano-Computador, PPGIa · PUCPR · 2026. Equipe: Gabriel Meira, Jean Weiss e Luiza Pedralli.

## Conteúdo

| Seção | Documento | O que tem |
|---|---|---|
| Requisitos | [Requisitos](requisitos.md) | Os 68 requisitos funcionais e os 26 não funcionais, com prioridade, sprint de entrega, status e como verificar. Também em [requisitos.csv](requisitos.csv) |
| Requisitos | [Matriz de rastreabilidade](matriz-rastreabilidade.md) | Cada requisito ligado a histórias, casos de uso, personas, casos de teste, sprint e código. Também em [matriz-rastreabilidade.csv](matriz-rastreabilidade.csv) |
| Requisitos | [Planilha de requisitos](planilha-requisitos.xlsx) | Requisitos, sprints, histórias, casos de uso, matriz, cenários e casos de teste, uma aba para cada, com filtros |
| Usuários | [Personas](personas.md) | Oito personas: três de pesquisador, quatro de participante e uma de quem mantém a instalação |
| Usuários | [Histórias de usuário](historias-de-usuario.md) | 44 histórias com critérios de aceitação. Também em [historias-de-usuario.csv](historias-de-usuario.csv) |
| Modelagem | [Casos de uso](casos-de-uso.md) | Quatro diagramas UML, a lista dos 33 casos de uso e a especificação dos principais |
| Modelagem | [Diagrama de classes](diagrama-de-classes.md) | O modelo de domínio e o módulo de cálculo do UEQ |
| Modelagem | [Modelo lógico do banco](modelo-logico.md) | As 11 tabelas do PostgreSQL, com colunas, chaves e o que cada exclusão leva junto |
| Modelagem | [Diagramas de sequência](diagramas-de-sequencia.md) | Oito fluxos do clique até o banco: entrar, responder, ver resultados, tirar da análise, PDF, importar, convidar e traduzir |
| Arquitetura | [Arquitetura](arquitetura.md) | Modelo C4 (contexto, containers e componentes), segurança, decisões e implantação |
| Testes | [Casos e cenários de teste](casos-de-teste.md) | Estratégia, 25 cenários e 206 casos (de ponta a ponta, de unidade e manuais), com os requisitos que cada um verifica e o resultado da última execução. Também em [casos-de-teste.csv](casos-de-teste.csv) |
| Testes | [Verificação do cálculo](verificacao-do-calculo.md) | O cálculo da ferramenta refeito à mão com o estudo de exemplo e comparado com a planilha oficial do UEQ em 11 cenários e com a do UEQ-S em 9: médias, desvio-padrão, IC95, alfa, benchmark, suspeitas e exportações |
| Testes | [Checklist manual](../checklist-manual.md) | O que a equipe confere com as próprias mãos: leitor de tela, zoom, celular real, daltonismo |
| Testes | [Roteiro da revisão](../roteiro-revisao.md) | O que abrir, o que fazer em cada tela e como anotar os problemas |
| Especificação | [Protocolo UEQ](../ueq-protocolo.md) | Itens, escalas, polaridade e todas as fórmulas do cálculo, conferidas no handbook e na planilha oficial |
| Especificação | [Fundamentos de IHC](../ihc.md) | Requisitos de usabilidade e acessibilidade, cada um ligado ao princípio da literatura que o justifica |
| Especificação | [Decisões de interface](../rastreabilidade-ihc.md) | Cada decisão de interface, o princípio, o código e o teste que prova |
| Especificação | [Idiomas](../idiomas.md) | Os 37 idiomas do questionário, de onde vem cada texto e as correções nos termos oficiais |
| Especificação | [Identidade visual](../design.md) | Cores, tipografia, layout, ícones e tom de voz |
| Especificação | [Convenções de código](../codigo.md) | Nomes, comentários, estrutura, testes e commits |

## Por onde começar

- **Vai usar a ferramenta num estudo?** Leia as [personas](personas.md) de pesquisador, o caso de uso [Responder o questionário](casos-de-uso.md#uc14) para ver o que o participante vai passar e o [Protocolo UEQ](../ueq-protocolo.md) para saber como cada número é calculado.
- **Vai avaliar o projeto?** Comece pelos [requisitos](requisitos.md), pela [matriz de rastreabilidade](matriz-rastreabilidade.md) e pelos [casos de teste](casos-de-teste.md). A [verificação do cálculo](verificacao-do-calculo.md) mostra o cálculo refeito à mão, e as [decisões de interface](../rastreabilidade-ihc.md) ligam cada tela a um princípio de IHC.
- **Vai contribuir com código?** Leia a [arquitetura](arquitetura.md), o [diagrama de classes](diagrama-de-classes.md), o [modelo lógico](modelo-logico.md), a [estratégia de teste](casos-de-teste.md#estratégia) e as [convenções de código](../codigo.md). Antes de mudar um comportamento, procure o arquivo na [matriz](matriz-rastreabilidade.md) para ver que requisito e que teste dependem dele.

## Identificadores

| Prefixo | O que identifica | Exemplo |
|---|---|---|
| RF | Requisito funcional | [RF27](requisitos.md#rf27) Responder os 26 itens |
| RNF | Requisito não funcional | [RNF01](requisitos.md#rnf01) WCAG 2.2 AA |
| PE | Persona | [PE04](personas.md#pe04) Célia |
| HU | História de usuário | [HU35](historias-de-usuario.md#hu35) Responder com leitor de tela |
| UC | Caso de uso | [UC14](casos-de-uso.md#uc14) Responder o questionário |
| CN | Cenário de teste | [CN06](casos-de-teste.md#cn06) Acessibilidade do questionário |
| CT-E, CT-U, CT-M | Caso de teste de ponta a ponta, de unidade ou manual | [CT-E22](casos-de-teste.md#ct-e22) Fluxo completo só com teclado |

Os identificadores são fixos: um item que sai continua com o número reservado, porque os outros documentos citam pelo número.

## Situação em 17/11/2026

- **Requisitos:** os 94 estão entregues. O último foi o [RF62](requisitos.md#rf62), Aplicar o UEQ-S, em 18/11/2026.
- **Testes automáticos:** os resultados da última execução estão em [casos de teste](casos-de-teste.md#execução-de-17112026).
- **Cálculo:** a [verificação do cálculo](verificacao-do-calculo.md) refez à mão todas as estatísticas do estudo de exemplo, e os 336 números bateram com a ferramenta. Na comparação com a própria planilha oficial, os 11 cenários de teste batem nos 6.543 valores, e os 9 do UEQ-S nos 8.520 valores da planilha oficial dele. As planilhas que a ferramenta exporta recalculam no Excel com os mesmos números.
- **Em produção:** https://ferramenta-ueq.vercel.app.

## Como manter

Quando um pull request mudar o comportamento da ferramenta:

1. Atualize o requisito em [requisitos.md](requisitos.md), em [requisitos.csv](requisitos.csv) e na [planilha](planilha-requisitos.xlsx). Requisito novo ganha o próximo número livre; requisito retirado fica com o status Removido.
2. Ligue o requisito a pelo menos uma história e um caso de uso, e atualize a [matriz](matriz-rastreabilidade.md) com o arquivo e o teste.
3. Teste novo vira um caso em [casos-de-teste.md](casos-de-teste.md) e no CSV: o título do `test(...)` ou do `it(...)` é o resultado esperado, e o caso cita os requisitos que verifica.
4. Se mudar um diagrama Mermaid, rode `pnpm docs:diagramas` para gerar o SVG que a aba Documentação mostra e o arquivo-fonte em `fontes/`. Um teste de unidade falha se esquecer. Abaixo de cada diagrama, atualize a versão da ferramenta que ele representa.
5. Um documento novo entra no catálogo de `src/lib/documentacao/catalogo.ts`, na seção dele e na lista `PRONTOS`.

Os formatos de um mesmo conteúdo (Markdown, CSV e XLSX) mudam juntos.
