# Fixtures de validação contra a planilha oficial

Cada pasta com `respostas.csv` é um cenário de teste ([docs/ueq-protocolo.md](../../docs/ueq-protocolo.md), seção 10). O `esperado.json` da mesma pasta tem os números que a **UEQ Data Analysis Tool V15** calculou com aquelas respostas. Três testes usam esses números:

- `src/ueq/__tests__/fixtures.test.ts` roda `analisarEstudo` em cada cenário e compara tudo com o `esperado.json`, com tolerância de 1e-6.
- `tests/e2e/planilha-oficial.spec.ts` importa sete dos cenários pela tela de importação, confere a tabela do painel com o `esperado.json` e baixa a planilha oficial preenchida pela ferramenta.
- `src/lib/__tests__/planilha-oficial.test.ts` confere que a exportação escreve as respostas em `Data!A4` do modelo oficial sem mexer no resto do arquivo.

| Pasta | Participantes | O que testa |
|---|---|---|
| `basico/` | 20 | Respostas variadas com leve tendência positiva, nenhum suspeito |
| `inconsistente/` | 15 | 4 suspeitos por amplitude e 2 casos de borda (ver o LEIA-ME da pasta) |
| `extremos/todos-1/` | 3 | Todos marcam 1: dp zero, sem IC nem alfa, suspeitos por respostas iguais |
| `extremos/todos-7/` | 3 | Todos marcam 7: o mesmo que o anterior, no outro polo |
| `extremos/n1/` | 1 | Uma pessoa só: sem dp, IC nem alfa |
| `extremos/n2/` | 2 | Menor amostra com dp, IC e alfa |
| `oficial-exemplo/` | 255 | Os dados de exemplo que vêm na aba Data da própria planilha oficial |
| `grande/` | 1000 | O máximo que a planilha aceita, com 4% de respostas ao acaso e 2% de respostas todas iguais |
| `bordas/` | 12 | Os limites das regras de suspeita (ver abaixo) e uma pessoa que marcou 4 em tudo |
| `variancia-zero/` | 12 | O item 2 com a mesma resposta para todos: a planilha dá `#DIV/0!` no alfa de Perspicuidade e no IC do item |
| `negativo/` | 18 | Produto mal avaliado (médias negativas, benchmark Ruim em tudo) e Novidade com itens que se contradizem (alfa de -42,8) |

`respostas.csv` está no formato da planilha: uma linha por participante, 26 valores de 1 a 7 na ordem oficial, separados por `;`, sem cabeçalho, com quebra de linha CRLF. As cinco últimas pastas saem de `scripts/gerar-fixtures.py`, que é determinístico; `oficial-exemplo` é copiada da aba Data de `data/planilha-oficial/UEQ_Data_Analysis_Tool_V15.xlsx`.

## Linhas do cenário bordas

| Linha | O que tem | Suspeita? |
|---|---|---|
| 1 | Amplitude exatamente 3 nas seis escalas | Não: a regra é amplitude maior que 3 |
| 2 | Amplitude 4 em duas escalas | Não: precisa de 3 escalas |
| 3 | Amplitude 4 em três escalas | Sim |
| 4 | Exatamente 15 respostas iguais | Não: a regra é mais de 15 |
| 5 | Exatamente 16 respostas iguais | Sim |
| 6 | 26 vezes o 4, o meio da escala | Sim, por respostas iguais |
| 7 a 12 | Respostas comuns | Não |

## Como o esperado.json foi gerado

Em 17/11/2026, com `scripts/planilha-oficial.ps1`, que automatiza o Microsoft Excel 16 no Windows. Para cada pasta, o script:

1. abre uma cópia de `data/planilha-oficial/UEQ_Data_Analysis_Tool_V15.xlsx`, o arquivo de `Data_Analysis_Tools.zip` de ueq-online.org sem nenhuma alteração;
2. apaga os dados de exemplo da aba Data (`A4:AA1004`) e cola o `respostas.csv` em `Data!A4`;
3. manda o Excel recalcular tudo (`CalculateFull`);
4. lê as células da tabela abaixo com o valor completo (não o arredondado que aparece na tela) e grava o JSON. Célula com erro da planilha (`#DIV/0!`, `#NUM!`) vira `null`;
5. fecha sem salvar.

Antes de usar os números, o script rodou nos dados de exemplo sem mudar nada, e os resultados bateram com os que vêm gravados no arquivo oficial (diferença zero). Para refazer um cenário:

```powershell
.\scripts\planilha-oficial.ps1 -Planilha data\planilha-oficial\UEQ_Data_Analysis_Tool_V15.xlsx `
  -Csv data\fixtures\basico\respostas.csv -Saida data\fixtures\basico\esperado.json `
  -Fonte "UEQ Data Analysis Tool V15 ..., recalculada no Microsoft Excel 16 em DD/MM/AAAA"
```

Sem Excel, dá para fazer à mão: colar o `respostas.csv` em `Data!A4` de uma cópia nova da planilha e copiar as células abaixo, com pelo menos 10 casas decimais. Decimal com ponto no JSON.

As escalas vão sempre na ordem da planilha: atratividade, perspicuidade, eficiência, confiabilidade, estimulação, novidade.

| Campo do JSON | Onde está na planilha |
|---|---|
| `escalas.media` | Confidence_Intervals!J5:J10 |
| `escalas.dp` | Confidence_Intervals!K5:K10 |
| `escalas.n` | Confidence_Intervals!L5 |
| `escalas.icInferior` | Confidence_Intervals!N5:N10 |
| `escalas.icSuperior` | Confidence_Intervals!O5:O10 |
| `escalas.alfa` | Scale_Consistency!B23, E14, H14, K14, N14, Q14 |
| `escalas.benchmark` | Benchmark!C3:C8, com o texto em inglês como aparece ("Good", "Above average"...) |
| `escalas.variancia` | Results!M3:M8 (informativo, não testado: é o dp ao quadrado) |
| `grupos.pragmatica` | Results!L41 |
| `grupos.hedonica` | Results!L42 |
| `itens.media` | Results!B3:B28 |
| `itens.dp` | Results!D3:D28 |
| `itens.n` | Results!E3:E28 |
| `itens.icInferior` | Confidence_Intervals!F5:F30 |
| `itens.icSuperior` | Confidence_Intervals!G5:G30 |
| `participantes.escalasInconsistentes` | Inconsistencies!AI4 para baixo, uma por participante |
| `participantes.respostasIguais` | Inconsistencies!AK4 para baixo, uma por participante |
| `distribuicao` | Answer_Distributions!C3:I28: quantas pessoas deram -3 a 3 (já recodificado) em cada item |
| `idiomaDaPlanilha` | Read_First!B5 |
