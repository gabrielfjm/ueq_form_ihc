# Fixtures de validação do UEQ-S contra a planilha oficial dele

O mesmo que [`data/fixtures/`](../fixtures/LEIA-ME.md), para a versão curta. Cada pasta tem um `respostas.csv` e o `esperado.json` com os números que a **UEQ-S Data Analysis Tool V15** (`Short_UEQ_Data_Analysis_Tool_V15.xlsx`, de `Data_Analysis_Tools.zip` em ueq-online.org) calculou com aquelas respostas. Três testes usam esses números:

- `src/ueq/__tests__/fixtures-ueq-s.test.ts` roda `analisarUeqS` em cada cenário e compara tudo com o `esperado.json`, com tolerância de 1e-6.
- `tests/e2e/ueq-s.spec.ts` importa cinco dos cenários num estudo do UEQ-S pela tela de importação, confere a tabela da aba UEQ-S com o `esperado.json` e baixa a planilha oficial do UEQ-S preenchida pela ferramenta. Também confere a aba UEQ-S de um estudo do UEQ completo com o cenário `do-ueq-basico`.
- `src/lib/__tests__/planilha-oficial-ueq-s.test.ts` confere que a exportação escreve as respostas em `Data!A4` do modelo oficial sem mexer no resto do arquivo.

| Pasta | Participantes | O que testa |
|---|---|---|
| `oficial-exemplo/` | 13 | Os dados de exemplo que vêm na aba Data da própria planilha oficial do UEQ-S |
| `do-ueq-basico/` | 20 | Os 8 pares do UEQ-S tirados de `data/fixtures/basico` (UEQ completo), como a aba UEQ-S faz num estudo do UEQ |
| `do-ueq-oficial-exemplo/` | 255 | O mesmo com os 255 participantes de exemplo da planilha oficial do UEQ completo |
| `grande/` | 1000 | O máximo que a planilha aceita, com 4% de respostas ao acaso e 1% com o meio nos 8 itens |
| `bordas/` | 12 | Os limites das regras de suspeita (ver abaixo) |
| `variancia-zero/` | 12 | O item 3 com a mesma resposta para todos: sem IC do item e sem alfa da pragmática (`#DIV/0!` na planilha) |
| `negativo/` | 18 | Produto mal avaliado (benchmark Ruim nas três escalas) e itens hedônicos que se contradizem (alfa de -1,40) |
| `n1/` | 1 | Uma pessoa só: sem dp, IC nem alfa |
| `n2/` | 2 | Menor amostra com dp e IC |

`respostas.csv` está no formato da aba Data da planilha do UEQ-S: uma linha por participante, 8 valores de 1 a 7 na ordem do UEQ-S (o termo negativo sempre à esquerda), separados por `;`, sem cabeçalho, com quebra de linha CRLF. As pastas saem de `scripts/gerar-fixtures-ueq-s.py`, que é determinístico. `oficial-exemplo` é copiada da aba Data de `data/planilha-oficial/Short_UEQ_Data_Analysis_Tool_V15.xlsx`.

## Do UEQ completo para o UEQ-S

Os 8 itens do UEQ-S são os itens 11, 13, 20, 21, 6, 7, 10 e 15 do UEQ, nessa ordem ([`data/ueq-s-itens-ptbr.json`](../ueq-s-itens-ptbr.json)). No UEQ-S o termo negativo fica sempre à esquerda, então dois pares aparecem com os lados trocados em relação ao UEQ: o item 4 (UEQ 21, Evidente/Confuso) e o item 7 (UEQ 10, Original/Convencional). Para esses dois, a resposta x no UEQ vira 8 − x no UEQ-S. É o que `do-ueq-basico` e `do-ueq-oficial-exemplo` fazem, e o que a ferramenta faz na aba UEQ-S de um estudo do UEQ completo.

Num estudo do UEQ-S, as respostas são gravadas nos itens equivalentes do UEQ com a mesma conversão no sentido contrário. Por isso as duas abas leem o mesmo banco.

## Linhas do cenário bordas

A aba Inconsistencies da planilha do UEQ-S marca uma escala como inconsistente quando a distância entre o melhor e o pior item passa de 3, e só sugere remover a resposta quando as 2 escalas são inconsistentes. A segunda regra é diferente da do UEQ completo: com 8 itens, repetir a mesma posição é comum, então a planilha só recomenda remover quem marcou a posição do meio (4) nos 8 itens (coluna "Middle Category").

| Linha | O que tem | Suspeita? |
|---|---|---|
| 1 | Amplitude exatamente 3 nas duas escalas | Não: a regra é amplitude maior que 3 |
| 2 | Amplitude 4 só na pragmática | Não: precisa das 2 escalas |
| 3 | Amplitude 4 nas duas escalas | Sim |
| 4 | 8 vezes o 4, o meio da escala | Sim, "Remove" na planilha |
| 5 | 8 vezes o 7 | Não: são 8 respostas iguais, mas não no meio |
| 6 | 7 vezes o 4 e um 5 | Não |
| 7 | Amplitude 6 nas duas escalas | Sim |
| 8 a 12 | Respostas comuns | Não |

## Como o esperado.json foi gerado

Em 17/11/2026, com `scripts/planilha-oficial-ueq-s.ps1`, que automatiza o Microsoft Excel 16 no Windows como o script do UEQ completo: abre uma cópia sem alteração da planilha, apaga os 13 participantes de exemplo (`Data!A4:H1004`), cola o `respostas.csv` em `Data!A4`, manda recalcular tudo, lê as células da tabela abaixo com o valor completo e fecha sem salvar. Célula com erro da planilha (`#DIV/0!`, `#NUM!`) vira `null`.

Antes de usar os números, o script rodou na planilha sem mudar nada e com os dados de exemplo colados de novo: os resultados bateram com os que vêm gravados no arquivo oficial. Para refazer um cenário:

```powershell
.\scripts\planilha-oficial-ueq-s.ps1 -Planilha data\planilha-oficial\Short_UEQ_Data_Analysis_Tool_V15.xlsx `
  -Csv data\fixtures-ueq-s\bordas\respostas.csv -Saida data\fixtures-ueq-s\bordas\esperado.json `
  -Fonte "Short_UEQ_Data_Analysis_Tool_V15.xlsx ..., recalculada no Microsoft Excel 16 em DD/MM/AAAA"
```

As escalas vão sempre na ordem da planilha: qualidade pragmática, qualidade hedônica e geral.

| Campo do JSON | Onde está na planilha |
|---|---|
| `escalas.media`, `escalas.dp` | Confidence_Intervals!J5:J7 e K5:K7 |
| `escalas.n` | Confidence_Intervals!L5 |
| `escalas.icInferior`, `escalas.icSuperior` | Confidence_Intervals!N5:N7 e O5:O7 |
| `escalas.alfa` | Scale_Consistency!E12 e H12 (a planilha não calcula o da geral, que fica `null`) |
| `escalas.correlacaoMedia` | Scale_Consistency!E11 e H11 |
| `escalas.benchmark` | Benchmark!C4:C6 |
| `escalas.variancia` | Results!M4:M6 |
| `itens.media`, `itens.variancia`, `itens.dp`, `itens.n` | Results!B4:B11, C4:C11, D4:D11 e E4:E11 |
| `itens.icInferior`, `itens.icSuperior` | Confidence_Intervals!F5:F12 e G5:G12 |
| `participantes.escores` | DT!K, L e M de cada participante (pragmática, hedônica e geral) |
| `participantes.escalasInconsistentes` | Inconsistencies!M de cada participante |
| `participantes.respostasIguais` | Inconsistencies!O de cada participante |
| `participantes.todasNoMeio` | Inconsistencies!P de cada participante ("Remove") |
| `idioma`, `rotulos` | Read_First!B4, Results!K4 e F4 (para conferir que a planilha exportada abre no idioma certo) |
