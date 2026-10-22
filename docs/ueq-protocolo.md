# Protocolo UEQ · especificação de cálculo

Fonte: Schrepp, M. *User Experience Questionnaire Handbook* e planilha oficial *UEQ Data Analysis Tool* (ueq-online.org). Todo valor marcado com **[CONFIRMAR]** precisa ser conferido pela equipe no handbook ou na planilha antes de ser implementado. Quando confirmar, troque a marca por `[OK · handbook p. X]` ou `[OK · planilha, aba Y]`.

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

Os termos em português **não** estão aqui de propósito. Eles vêm do pacote oficial de idiomas e ficam em `data/ueq-itens-ptbr.json` (ver `data/LEIA-ME.md`). **[CONFIRMAR]** a tabela acima contra a aba de itens da planilha oficial.

Agrupamento:
- Qualidade pragmática = média de Perspicuidade, Eficiência, Confiabilidade
- Qualidade hedônica = média de Estimulação, Novidade
- Atratividade fica sozinha (impressão geral)

## 2. Recodificação

`recodificar(valor: 1..7, polaridade: '+' | '-'): -3..3`. Valor fora de 1..7 lança erro.

## 3. Escore por participante e escala

Média dos valores recodificados dos itens daquela escala, para aquele participante.

**[CONFIRMAR]** como a planilha trata item sem resposta. Nossa ferramenta exige os 26 itens (validação no formulário), então não deve existir valor ausente vindo da coleta. Se houver importação por CSV no futuro, decidir a regra aqui.

## 4. Estatísticas por escala (entre participantes incluídos na análise)

- `n` = participantes incluídos
- `media` = média dos escores por participante
- `dp` = desvio-padrão amostral (divisor `n - 1`) **[CONFIRMAR]**
- `ic95` = `media ± z · dp / √n`, com `z = 1,96` (função `CONFIDENCE` da planilha, distribuição normal) **[CONFIRMAR]**
- também por item: média, dp, n e distribuição das respostas 1 a 7 (para o gráfico por item)

Com `n < 2` não existe dp nem IC. A função devolve `null` nesses campos e a UI mostra "amostra insuficiente".

## 5. Faixas de interpretação

| Média da escala | Leitura |
|---|---|
| > +0,8 | positiva |
| entre -0,8 e +0,8 | neutra |
| < -0,8 | negativa |

**[CONFIRMAR]** se os limites são inclusivos (≥ 0,8 ou > 0,8) conforme a planilha.

## 6. Alfa de Cronbach por escala

```
alfa = (k / (k - 1)) · (1 - Σ var(item_i) / var(soma dos itens))
```
`k` = número de itens da escala, variâncias amostrais, calculado sobre os valores recodificados. Valor abaixo de **0,7** é sinalizado no painel com texto explicando que a escala pode estar sendo mal interpretada por esse grupo. **[CONFIRMAR]** se a planilha usa variância amostral ou populacional (o alfa resultante é o mesmo se o critério for consistente, mas os testes precisam bater com a planilha).

## 7. Respostas inconsistentes

Para cada participante e cada escala: `amplitude = max(itens recodificados) - min(itens recodificados)`.
- `amplitude > 3` → escala inconsistente para esse participante **[CONFIRMAR limiar exato]**
- participante com inconsistência em **3 ou mais escalas** → marcado como suspeito **[CONFIRMAR número de escalas]**

O limiar e o número mínimo de escalas ficam em `data/protocolo.json`, não no código.

O pesquisador vê a lista de suspeitos e decide quem sai da análise. Excluir não apaga a resposta: só muda `incluidaNaAnalise = false`. Todo número do painel e da exportação de resultados considera apenas participações incluídas. A exportação de respostas brutas traz todas, com uma coluna indicando inclusão.

## 8. Benchmark

Cada média de escala é classificada em uma de cinco faixas: Excelente, Bom, Acima da média, Abaixo da média, Ruim. Os limites por escala ficam em `data/benchmark.json` com o campo `fonte` preenchido (versão do benchmark, ano, página ou aba). **[CONFIRMAR todos os limites na planilha oficial atual]** Não usar valores tirados de blog, artigo de terceiros ou memória de modelo.

Formato esperado:
```json
{
  "fonte": "UEQ Data Analysis Tool vX, aba Benchmark, acessado em DD/MM/2026",
  "escalas": {
    "atratividade": { "excelente": 0, "bom": 0, "acimaDaMedia": 0, "abaixoDaMedia": 0 }
  }
}
```
Leitura: `media >= excelente` → Excelente, `>= bom` → Bom, `>= acimaDaMedia` → Acima da média, `>= abaixoDaMedia` → Abaixo da média, senão Ruim.

## 9. Exportações

1. **Respostas brutas** (CSV): uma linha por participação. Colunas: id da participação, versão, data, incluída (sim/não), suspeita (sim/não), demográficos, `item01` a `item26` com valores 1 a 7.
2. **Respostas recodificadas** (CSV): mesmo formato, valores -3 a 3.
3. **Resultados por escala** (CSV): versão, escala, n, média, dp, ic95 inferior, ic95 superior, alfa, faixa de interpretação, faixa do benchmark.
4. **Compatível com a planilha oficial**: só os 26 valores 1 a 7 por linha, na ordem oficial, sem cabeçalho e sem colunas extras, prontos para colar na aba de dados da planilha. **[CONFIRMAR]** separador e formato que a planilha aceita colar.

CSV em UTF-8 com BOM e separador `;` (abre direto no Excel em pt-BR). Números com vírgula decimal no CSV de resultados. A exportação compatível com a planilha segue o que a planilha exigir.

## 10. Validação contra a planilha oficial

Em `data/fixtures/` ficam pelo menos três conjuntos:
- `basico`: ~20 participantes com respostas variadas
- `inconsistente`: inclui participantes que devem ser marcados como suspeitos
- `extremos`: todos 1, todos 7, n = 1, n = 2

Cada conjunto tem `respostas.csv` (formato da planilha) e `esperado.json` com os números copiados da planilha oficial depois de colar as respostas lá. Os testes do módulo `src/ueq/` comparam com tolerância de `1e-6`.
