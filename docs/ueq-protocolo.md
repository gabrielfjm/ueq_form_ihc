# Protocolo UEQ · especificação de cálculo

Fonte: Schrepp, M. *User Experience Questionnaire Handbook* e planilha oficial *UEQ Data Analysis Tool* (ueq-online.org). Versões conferidas em 23/10/2026: Handbook versão 11 (12/09/2023) e `UEQ_Data_Analysis_Tool_V15.xlsx` (22/10/2026). Quando o handbook e a planilha divergem, vale a planilha, porque é contra ela que os testes comparam. Todo valor marcado com **[CONFIRMAR]** precisa ser conferido pela equipe no handbook ou na planilha antes de ser implementado. Quando confirmar, troque a marca por `[OK · handbook p. X]` ou `[OK · planilha, aba Y]`.

## 1. Itens, escalas e polaridade

26 itens de diferencial semântico, 7 posições, gravadas de 1 (polo esquerdo) a 7 (polo direito). O participante nunca vê números.

Polaridade:
- `+` = termo positivo à **direita** → `x' = x - 4`
- `-` = termo positivo à **esquerda** → `x' = 4 - x`

| Nº | Polo esquerdo (EN) | Polo direito (EN) | Escala | Polaridade |
|---|---|---|---|---|
| 1 | annoying | enjoyable | Atratividade | + |
| 2 | not understandable | understandable | Perspicuidade | + |
| 3 | creative | dull | Novidade | - |
| 4 | easy to learn | difficult to learn | Perspicuidade | - |
| 5 | valuable | inferior | Estimulação | - |
| 6 | boring | exciting | Estimulação | + |
| 7 | not interesting | interesting | Estimulação | + |
| 8 | unpredictable | predictable | Confiabilidade | + |
| 9 | fast | slow | Eficiência | - |
| 10 | inventive | conventional | Novidade | - |
| 11 | obstructive | supportive | Confiabilidade | + |
| 12 | good | bad | Atratividade | - |
| 13 | complicated | easy | Perspicuidade | + |
| 14 | unlikable | pleasing | Atratividade | + |
| 15 | usual | leading edge | Novidade | + |
| 16 | unpleasant | pleasant | Atratividade | + |
| 17 | secure | not secure | Confiabilidade | - |
| 18 | motivating | demotivating | Estimulação | - |
| 19 | meets expectations | does not meet expectations | Confiabilidade | - |
| 20 | inefficient | efficient | Eficiência | + |
| 21 | clear | confusing | Perspicuidade | - |
| 22 | impractical | practical | Eficiência | + |
| 23 | organized | cluttered | Eficiência | - |
| 24 | attractive | unattractive | Atratividade | - |
| 25 | friendly | unfriendly | Atratividade | - |
| 26 | conservative | innovative | Novidade | + |

Conferência rápida: Atratividade 1, 12, 14, 16, 24, 25 · Perspicuidade 2, 4, 13, 21 · Eficiência 9, 20, 22, 23 · Confiabilidade 8, 11, 17, 19 · Estimulação 5, 6, 7, 18 · Novidade 3, 10, 15, 26. São 13 itens com polaridade `-`.

Os termos em português **não** estão aqui de propósito. Eles vêm do pacote oficial de idiomas e ficam em `data/ueq-itens-ptbr.json` (ver `data/LEIA-ME.md`). `[OK · planilha, aba DT]`: as fórmulas de recodificação da linha 4 e as médias por escala (colunas AC a AH) batem com a tabela acima.

Agrupamento:
- Qualidade pragmática = média de Perspicuidade, Eficiência, Confiabilidade
- Qualidade hedônica = média de Estimulação, Novidade
- Atratividade fica sozinha (impressão geral)

## 2. Recodificação

`recodificar(valor: 1..7, polaridade: '+' | '-'): -3..3`. Valor fora de 1..7 lança erro.

## 3. Escore por participante e escala

Média dos valores recodificados dos itens daquela escala, para aquele participante.

`[OK · planilha, aba DT]`: célula vazia é ignorada. O escore da escala é a média só dos itens respondidos (`AVERAGE`), e fica vazio se nenhum item da escala foi respondido. Nossa ferramenta exige os 26 itens (validação no formulário), então não deve existir valor ausente vindo da coleta. Se houver importação por CSV no futuro, decidir a regra aqui.

## 4. Estatísticas por escala (entre participantes incluídos na análise)

- `n` = participantes incluídos
- `media` = média dos escores por participante
- `dp` = desvio-padrão amostral (divisor `n - 1`) `[OK · planilha, aba Confidence_Intervals: STDEV]`
- `ic95` = `media ± z · dp / √n`, com `z = 1,959963984540054`, o quantil 0,975 exato da normal. A planilha usa `CONFIDENCE(0.05; dp; n)`, que não arredonda para 1,96, e com 1,96 os testes erram já na sexta casa. `[OK · planilha, aba Confidence_Intervals]`
- também por item: média, dp, n e distribuição das respostas 1 a 7 (para o gráfico por item)

Com `n < 2` não existe dp nem IC. Com `dp = 0` (todos deram o mesmo escore) a planilha também não calcula o IC, porque `CONFIDENCE` exige dp maior que zero (`#NUM!`), e seguimos a planilha. A função devolve `null` nesses campos e a UI mostra "amostra insuficiente".

## 5. Faixas de interpretação

| Média da escala | Leitura |
|---|---|
| > +0,8 | positiva |
| entre -0,8 e +0,8 | neutra |
| < -0,8 | negativa |

`[OK · handbook p. 5]`: "values between -0.8 and 0.8 represent a neutral evaluation, values > 0,8 positive, values < -0,8 negative". Então -0,8 e 0,8 caem em neutra. A planilha só repete esse texto na aba Results e não calcula a faixa.

## 6. Alfa de Cronbach por escala

A planilha não usa a fórmula de variâncias, e sim o alfa padronizado, calculado pela média das correlações entre os itens:

```
r̄    = média das correlações de Pearson entre todos os pares de itens da escala
alfa = k · r̄ / (1 + (k - 1) · r̄)
```
`k` = número de itens da escala (6 em Atratividade, 4 nas outras), que dá 15 pares em Atratividade e 6 nas outras. O cálculo usa os valores recodificados. `[OK · handbook p. 10 e planilha, aba Scale_Consistency: CORREL e (4*r̄)/(1+(3*r̄))]`

Se algum item da escala não variar entre os participantes, a correlação não existe (a planilha mostra `#DIV/0!`), e com `n < 2` também não. Nesses casos o alfa é `null`. Valor abaixo de **0,7** é sinalizado no painel com texto explicando que a escala pode estar sendo mal interpretada por esse grupo. O handbook trata 0,6 ou 0,7 como regra prática e pede cautela com amostras pequenas (menos de 50).

A planilha também mostra o intervalo de confiança do alfa (Bonett, 2002) e o Lambda2 de Guttman. Os dois ficam fora do escopo.

## 7. Respostas inconsistentes

Para cada participante e cada escala: `amplitude = max(itens recodificados) - min(itens recodificados)`.
- `amplitude > 3` → escala inconsistente para esse participante `[OK · handbook p. 7-8 e planilha, aba Inconsistencies]`
- participante com inconsistência em **3 ou mais escalas** → marcado como suspeito. O handbook deixa a escolha entre 2 e 3 escalas para o pesquisador. A planilha sugere remover quem tem 3 ou mais na coluna "Critical?", e seguimos a planilha. `[OK · handbook p. 8 e planilha, aba Inconsistencies]`

Segunda regra, do handbook e da planilha: participante com **mais de 15 respostas iguais** nos 26 itens (contadas na escala original de 1 a 7, por exemplo tudo no 4) também é marcado como suspeito. `[OK · handbook p. 8 (Schrepp, 2023) e planilha, aba Inconsistencies, coluna "Critical length"]`

O participante é suspeito se cair em qualquer uma das duas regras, e a interface mostra qual delas foi. Os três limiares (`amplitudeMaxima`, `escalasParaSuspeita`, `respostasIguaisMaximas`) ficam em `data/protocolo.json`, não no código.

O pesquisador vê a lista de suspeitos e decide quem sai da análise. Excluir não apaga a resposta: só muda `incluidaNaAnalise = false`. Todo número do painel e da exportação de resultados considera apenas participações incluídas. A exportação de respostas brutas traz todas, com uma coluna indicando inclusão.

## 8. Benchmark

Cada média de escala é classificada em uma de cinco faixas: Excelente, Bom, Acima da média, Abaixo da média, Ruim. Os limites por escala ficam em `data/benchmark.json` com o campo `fonte` preenchido (versão do benchmark, ano, página ou aba). `[OK · planilha V15, aba Benchmark, tabela "Benchmark borders"]`: os limites são os quantis 0,25 (`abaixoDaMedia`), 0,5 (`acimaDaMedia`), 0,75 (`bom`) e 0,9 (`excelente`), com base em 21175 pessoas de 468 estudos. O benchmark é atualizado uma vez por ano (handbook p. 5), então confira a versão da planilha antes da apresentação. Não usar valores tirados de blog, artigo de terceiros ou memória de modelo.

Formato esperado:
```json
{
  "fonte": "UEQ Data Analysis Tool vX, aba Benchmark, acessado em DD/MM/2026",
  "escalas": {
    "atratividade": { "excelente": 0, "bom": 0, "acimaDaMedia": 0, "abaixoDaMedia": 0 }
  }
}
```
Leitura, com maior estrito como na fórmula da planilha: `media > excelente` → Excelente, `> bom` → Bom, `> acimaDaMedia` → Acima da média, `> abaixoDaMedia` → Abaixo da média, senão Ruim. Uma média exatamente igual ao limite fica na faixa de baixo.

## 9. Exportações

1. **Respostas brutas** (CSV): uma linha por participação. Colunas: id da participação, versão, data, incluída (sim/não), suspeita (sim/não), demográficos, `item01` a `item26` com valores 1 a 7.
2. **Respostas recodificadas** (CSV): mesmo formato, valores -3 a 3.
3. **Resultados por escala** (CSV): versão, escala, n, média, dp, ic95 inferior, ic95 superior, alfa, faixa de interpretação, faixa do benchmark.
4. **Compatível com a planilha oficial**: só os 26 valores 1 a 7 por linha, na ordem oficial, sem cabeçalho e sem colunas extras, só das participações na análise. Mesmo formato das fixtures: separador `;`, quebra de linha CRLF e **sem BOM**. `[OK · planilha V15, aba Data]`: os dados começam em `Data!A4`, uma coluna por item de A a Z. O Excel em pt-BR abre o arquivo `;` já separado em colunas; daí é copiar as linhas e colar em `Data!A4` (passo a passo em `data/fixtures/LEIA-ME.md`). Um teste confere que a exportação da fixture `basico` sai idêntica ao `respostas.csv` original.

CSV em UTF-8 com BOM e separador `;` (abre direto no Excel em pt-BR). Números com vírgula decimal no CSV de resultados. A exportação compatível com a planilha segue o que a planilha exigir.

## 10. Validação contra a planilha oficial

Em `data/fixtures/` ficam pelo menos três conjuntos:
- `basico`: ~20 participantes com respostas variadas
- `inconsistente`: inclui participantes que devem ser marcados como suspeitos
- `extremos`: todos 1, todos 7, n = 1, n = 2

Cada conjunto tem `respostas.csv` (formato da planilha) e `esperado.json` com os números copiados da planilha oficial depois de colar as respostas lá. Os testes do módulo `src/ueq/` comparam com tolerância de `1e-6`.
