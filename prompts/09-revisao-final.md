# 09 · Revisão final antes da entrega

> Rodar depois que tudo funciona. Pode rodar mais de uma vez.

## Avaliação de IHC completa

```
Rode /revisar-ihc em todas as telas: entrar, cadastrar, lista de estudos, novo estudo, página do estudo, consentimento, questionário, dados demográficos, agradecimento, resultados (uma versão e comparação), respostas, exportação.

Depois percorra a checklist da seção 5 de docs/ihc.md critério por critério e me devolva uma tabela: critério · atende / não atende / não se aplica · evidência (teste, print ou trecho de código). Corrija o que não atende.

Por fim, gere docs/rastreabilidade-ihc.md: uma tabela com cada decisão de interface relevante da ferramenta, o princípio que a justifica (Nielsen, Shneiderman, Norman, ISO 9241-110, WCAG) e onde está no código. Essa tabela vai para o relatório e para a apresentação.
```

## Validação dos cálculos contra a planilha oficial

> Antes: a equipe colou cada `data/fixtures/**/respostas.csv` na UEQ Data Analysis Tool e preencheu os `esperado.json` (passo a passo em data/fixtures/LEIA-ME.md). Sem isso os testes das fixtures continuam pulados.

```
Rode pnpm test e me mostre os testes de src/ueq/__tests__/fixtures.test.ts. Nenhum pode estar pulado. Se algum número não bater, descubra se a diferença está no cálculo ou na cópia da planilha antes de mudar código, e me diga qual foi.
```

## Revisão visual

```
Rode /revisar-ui em todas as telas. Me devolva só o que precisa mudar e corrija.
```

## Revisão de código

```
Rode /revisar-codigo no projeto inteiro. Corrija tudo que achar, um commit por tipo de correção.
```

## README

```
Escreva o README.md do repositório, em português, sem emoji e sem badges. Seções: o que é (2 frases), como rodar localmente (passo a passo real, testado), como validamos os cálculos contra a planilha oficial, acessibilidade (meta WCAG 2.2 AA, como testamos), estrutura de pastas em 6 linhas, equipe. Nada mais.
```

## Fora do Claude Code (a equipe faz)

- `docs/checklist-manual.md` inteiro: leitor de tela, teclado, zoom, daltonismo, celular real
- Avaliação heurística individual e consolidação
- Teste com usuários e UEQ da própria ferramenta aplicado pela ferramenta
