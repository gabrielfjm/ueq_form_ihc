# 10 · Extensões opcionais (só depois de 04/12)

Na ordem da proposta. Rodar uma de cada vez.

## UEQ-S

```
Adicione suporte ao UEQ-S (8 itens, escalas pragmática e hedônica) como tipo de instrumento do estudo, escolhido na criação e travado depois da primeira resposta.

Os itens do UEQ-S são um subconjunto dos itens do UEQ. A equipe vai preencher em data/ueq-s-itens-ptbr.json quais são e o benchmark do UEQ-S em data/benchmark-ueq-s.json. Não preencha esses arquivos. Se estiverem vazios, crie só a estrutura e pare.

Reaproveite src/ueq generalizando o que for preciso (escalas e itens passam a vir de uma definição de instrumento). Os testes atuais do UEQ completo não podem quebrar.
```

## Painel em PDF

```
Adicione "Exportar painel em PDF" na página de resultados. Gere com Playwright no servidor imprimindo uma rota /estudos/[id]/resultados/impressao com CSS de impressão (A4, margens de 18mm, sem navegação, gráficos em vetor). O PDF tem cabeçalho com título do estudo, data de geração e n.
```

## Importar respostas por CSV

```
Adicione importação de respostas por CSV no formato da planilha oficial (26 valores por linha). Tela com upload, pré-visualização das 5 primeiras linhas, relatório de erros por linha (valor fora de 1 a 7, número errado de colunas) e confirmação. Participações importadas ficam marcadas com origem "importada" e aparecem assim na tabela de respostas.
```
