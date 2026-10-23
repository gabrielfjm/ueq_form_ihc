# Fixtures de validação contra a planilha oficial

Cada pasta com `respostas.csv` é um conjunto de teste (ver `docs/ueq-protocolo.md`, seção 10). O teste `src/ueq/__tests__/fixtures.test.ts` roda `analisarEstudo` em cada uma e compara com o `esperado.json` da mesma pasta, com tolerância de 1e-6. Enquanto a pasta não tiver `esperado.json`, o teste dela aparece como pulado.

| Pasta | Participantes | O que testa |
|---|---|---|
| `basico/` | 20 | Respostas variadas com leve tendência positiva, nenhum suspeito |
| `inconsistente/` | 15 | 4 suspeitos por amplitude, 2 casos de borda (ver o LEIA-ME da pasta) |
| `extremos/todos-1/` | 3 | Todos marcam 1: dp zero, sem IC nem alfa, suspeitos por respostas iguais |
| `extremos/todos-7/` | 3 | Todos marcam 7: o mesmo que o anterior, no outro polo |
| `extremos/n1/` | 1 | Uma pessoa só: sem dp, IC nem alfa |
| `extremos/n2/` | 2 | Menor amostra com dp, IC e alfa |

`respostas.csv` está no formato da planilha: uma linha por participante, 26 valores de 1 a 7 na ordem oficial, separados por `;`, sem cabeçalho.

## Como gerar o esperado.json

1. Abra uma cópia nova de `UEQ_Data_Analysis_Tool_V15.xlsx` (Data_Analysis_Tools.zip em ueq-online.org). Na aba **Data**, apague os dados de exemplo que vêm com a planilha (da linha 4 para baixo).
2. Abra o `respostas.csv` no Excel. Em pt-BR ele já abre separado em colunas, porque o separador do Excel é `;`. Copie as linhas e cole em **Data!A4**.
3. Copie os números das células da tabela abaixo para o `esperado.json`. Antes de copiar, aumente as casas decimais das células (pelo menos 10): o teste compara até a sexta casa, e o Excel mostra o valor arredondado.
4. No JSON, o decimal é com ponto (`1.4375`, não `1,4375`). Erro da planilha (`#DIV/0!`, `#NUM!`) vira `null`.

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
| `grupos.pragmatica` | Results!L41 |
| `grupos.hedonica` | Results!L42 |
| `itens.media` | Results!B3:B28 |
| `itens.dp` | Results!D3:D28 |
| `participantes.escalasInconsistentes` | Inconsistencies!AI4 para baixo, uma por participante |
| `participantes.respostasIguais` | Inconsistencies!AK4 para baixo, uma por participante |

```json
{
  "fonte": "UEQ Data Analysis Tool V15, colado em DD/MM/2026 por NOME",
  "escalas": {
    "media": [0, 0, 0, 0, 0, 0],
    "dp": [0, 0, 0, 0, 0, 0],
    "n": 0,
    "icInferior": [0, 0, 0, 0, 0, 0],
    "icSuperior": [0, 0, 0, 0, 0, 0],
    "alfa": [0, 0, 0, 0, 0, 0],
    "benchmark": ["", "", "", "", "", ""]
  },
  "grupos": { "pragmatica": 0, "hedonica": 0 },
  "itens": {
    "media": [26 valores],
    "dp": [26 valores]
  },
  "participantes": {
    "escalasInconsistentes": [um por linha do CSV],
    "respostasIguais": [um por linha do CSV]
  }
}
```
