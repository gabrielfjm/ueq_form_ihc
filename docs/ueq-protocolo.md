# Protocolo UEQ · especificação de cálculo

Fonte: Schrepp, M. *User Experience Questionnaire Handbook* e planilha oficial *UEQ Data Analysis Tool* (ueq-online.org). Versões conferidas em 23/10/2026: Handbook versão 11 (12/09/2023) e `UEQ_Data_Analysis_Tool_V15.xlsx` (22/10/2026). Quando o handbook e a planilha divergem, vale a planilha, porque é contra ela que os testes comparam. Cada regra traz entre parênteses a fonte em que foi conferida: a página do handbook ou a aba da planilha.

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

Os termos em português **não** estão aqui de propósito. Eles vêm do pacote oficial de idiomas e ficam em `data/ueq-itens-ptbr.json` (ver `data/LEIA-ME.md`). (Fonte: planilha, aba DT.) As fórmulas de recodificação da linha 4 e as médias por escala (colunas AC a AH) batem com a tabela acima.

Agrupamento:
- Qualidade pragmática = média de Perspicuidade, Eficiência, Confiabilidade
- Qualidade hedônica = média de Estimulação, Novidade
- Atratividade fica sozinha (impressão geral)

## 2. Recodificação

`recodificar(valor: 1..7, polaridade: '+' | '-'): -3..3`. Valor fora de 1..7 lança erro.

## 3. Escore por participante e escala

Média dos valores recodificados dos itens daquela escala, para aquele participante.

(Fonte: planilha, aba DT.) Célula vazia é ignorada. O escore da escala é a média só dos itens respondidos (`AVERAGE`), e fica vazio se nenhum item da escala foi respondido. Nossa ferramenta exige os 26 itens (validação no formulário), então não existe valor ausente vindo da coleta. A importação por CSV segue a mesma regra: cada linha precisa dos 26 valores de 1 a 7, e o arquivo com qualquer linha inválida é recusado inteiro (`src/lib/importacao.ts`).

## 4. Estatísticas por escala (entre participantes incluídos na análise)

- `n` = participantes incluídos
- `media` = média dos escores por participante
- `dp` = desvio-padrão amostral (divisor `n - 1`) (fonte: planilha, aba Confidence_Intervals: STDEV)
- `ic95` = `media ± z · dp / √n`, com `z = 1,959963984540054`, o quantil 0,975 exato da normal. A planilha usa `CONFIDENCE(0.05; dp; n)`, que não arredonda para 1,96, e com 1,96 os testes erram já na sexta casa. (fonte: planilha, aba Confidence_Intervals)
- também por item: média, dp, n e distribuição das respostas 1 a 7 (para o gráfico por item)

Com `n < 2` não existe dp nem IC. Com `dp = 0` (todos deram o mesmo escore) a planilha também não calcula o IC, porque `CONFIDENCE` exige dp maior que zero (`#NUM!`), e seguimos a planilha. A função devolve `null` nesses campos e a UI mostra "amostra insuficiente".

## 5. Faixas de interpretação

| Média da escala | Leitura |
|---|---|
| > +0,8 | positiva |
| entre -0,8 e +0,8 | neutra |
| < -0,8 | negativa |

(Fonte: handbook p. 5.) "values between -0.8 and 0.8 represent a neutral evaluation, values > 0,8 positive, values < -0,8 negative". Então -0,8 e 0,8 caem em neutra. A planilha só repete esse texto na aba Results e não calcula a faixa.

## 6. Alfa de Cronbach por escala

A planilha não usa a fórmula de variâncias, e sim o alfa padronizado, calculado pela média das correlações entre os itens:

```
r̄    = média das correlações de Pearson entre todos os pares de itens da escala
alfa = k · r̄ / (1 + (k - 1) · r̄)
```
`k` = número de itens da escala (6 em Atratividade, 4 nas outras), que dá 15 pares em Atratividade e 6 nas outras. O cálculo usa os valores recodificados. (fonte: handbook p. 10 e planilha, aba Scale_Consistency: CORREL e (4*r̄)/(1+(3*r̄)))

Se algum item da escala não variar entre os participantes, a correlação não existe (a planilha mostra `#DIV/0!`), e com `n < 2` também não. Nesses casos o alfa é `null`. Valor abaixo de **0,7** é sinalizado no painel com texto explicando que a escala pode estar sendo mal interpretada por esse grupo. O handbook trata 0,6 ou 0,7 como regra prática e pede cautela com amostras pequenas (menos de 50).

A planilha também mostra o intervalo de confiança do alfa (Bonett, 2002) e o Lambda2 de Guttman. Os dois ficam fora do escopo.

## 7. Respostas inconsistentes

Para cada participante e cada escala: `amplitude = max(itens recodificados) - min(itens recodificados)`.
- `amplitude > 3` → escala inconsistente para esse participante (fonte: handbook p. 7-8 e planilha, aba Inconsistencies)
- participante com inconsistência em **3 ou mais escalas** → marcado como suspeito. O handbook deixa a escolha entre 2 e 3 escalas para o pesquisador. A planilha sugere remover quem tem 3 ou mais na coluna "Critical?", e seguimos a planilha. (fonte: handbook p. 8 e planilha, aba Inconsistencies)

Segunda regra, do handbook e da planilha: participante com **mais de 15 respostas iguais** nos 26 itens (contadas na escala original de 1 a 7, por exemplo tudo no 4) também é marcado como suspeito. (fonte: handbook p. 8 (Schrepp, 2023) e planilha, aba Inconsistencies, coluna "Critical length")

O participante é suspeito se cair em qualquer uma das duas regras, e a interface mostra qual delas foi. Os três limiares (`amplitudeMaxima`, `escalasParaSuspeita`, `respostasIguaisMaximas`) ficam em `data/protocolo.json`, não no código.

O pesquisador vê a lista de suspeitos e decide quem sai da análise. Excluir não apaga a resposta: só muda `incluidaNaAnalise = false`. Todo número do painel e da exportação de resultados considera apenas participações incluídas. A exportação de respostas brutas traz todas, com uma coluna indicando inclusão.

## 8. Benchmark

Cada média de escala é classificada em uma de cinco faixas: Excelente, Bom, Acima da média, Abaixo da média, Ruim. Os limites por escala ficam em `data/benchmark.json` com o campo `fonte` preenchido (versão do benchmark, ano, página ou aba). (Fonte: planilha V15, aba Benchmark, tabela "Benchmark borders".) Os limites são os quantis 0,25 (`abaixoDaMedia`), 0,5 (`acimaDaMedia`), 0,75 (`bom`) e 0,9 (`excelente`), com base em 21175 pessoas de 468 estudos. O benchmark é atualizado uma vez por ano (handbook p. 5), então confira a versão da planilha antes da apresentação. Não usar valores tirados de blog, artigo de terceiros ou memória de modelo.

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

1. **Respostas brutas** (CSV): uma linha por participação. Colunas: id da participação, versão, data, incluída (sim/não), suspeita (sim/não), origem, idioma, tradução aprovada, menor de idade (declarou menos de 18 anos com a autorização do responsável), demográficos, `item01` a `item26` com valores 1 a 7.
2. **Respostas recodificadas** (CSV): mesmo formato, valores -3 a 3.
3. **Resultados por escala** (CSV): versão, escala, n, média, dp, ic95 inferior, ic95 superior, alfa, faixa de interpretação, faixa do benchmark.
4. **Planilha oficial preenchida** (XLSX): a própria *UEQ Data Analysis Tool V15* (`data/planilha-oficial/UEQ_Data_Analysis_Tool_V15.xlsx`, copiada sem alteração de `Data_Analysis_Tools.zip`), com os 26 valores de 1 a 7 de cada participação na análise a partir de `Data!A4`, uma coluna por item de A a Z, na ordem em que as participações foram concluídas. (Fonte: planilha V15, aba Data.) A exportação escreve a entrada, como quem cola as respostas à mão, e grava os resultados, como o Excel faz ao salvar:
   - apaga os 255 participantes de exemplo que vêm na aba Data e escreve as respostas no lugar;
   - põe em `Read_First!B5` o idioma da interface, entre os 37 que a planilha traduz, para os rótulos e os itens saírem nesse idioma;
   - apaga as notas de importância de exemplo da aba KPI_Calculation (`A4:F1004`). Elas são da extensão KPI do UEQ, que a ferramenta não pergunta, e misturariam dados fictícios ao KPI do estudo;
   - calcula todas as fórmulas das outras abas com as respostas do estudo (`src/lib/planilha-calculo.ts`, que segue as regras do Excel para as 19 funções que a planilha usa) e grava os resultados nas células e nos números que os gráficos guardam. Assim o arquivo já mostra tudo no Modo de Exibição Protegido do Excel (o padrão para arquivos baixados da internet), no LibreOffice e nas pré-visualizações, que não recalculam. O arquivo continua marcado para recalcular ao abrir (`fullCalcOnLoad`), e o Excel confere tudo ao **Habilitar edição**.

   Fórmulas, estilos e as outras partes do arquivo ficam idênticos aos do oficial, e um teste confere isso byte a byte. Os resultados gravados foram comparados célula a célula com os do Excel em todas as abas (`scripts/planilha-oficial-celulas.ps1`). Na tela de uma versão sai só aquela versão; em "Todas as versões" sai o estudo inteiro. A planilha calcula até 1000 participantes (o aviso da aba Data); acima disso o painel explica e oferece as respostas brutas.

CSV em UTF-8 com BOM e separador `;` (abre direto no Excel em pt-BR). Números com vírgula decimal no CSV de resultados.

## 10. Validação contra a planilha oficial

Em `data/fixtures/` ficam 11 cenários, cada um com `respostas.csv` (formato da planilha) e `esperado.json` com os números da planilha oficial recalculada no Excel depois de colar as respostas em `Data!A4`. A lista dos cenários, as células lidas e o script que automatiza o Excel estão em [data/fixtures/LEIA-ME.md](../data/fixtures/LEIA-ME.md):

- `basico`: 20 participantes com respostas variadas;
- `inconsistente`: 15, com 4 suspeitos por amplitude e 2 casos de borda;
- `extremos`: todos 1, todos 7, n = 1, n = 2;
- `oficial-exemplo`: os 255 participantes de exemplo da própria planilha;
- `grande`: 1000 participantes, o máximo da planilha;
- `bordas`: amplitude exatamente 3, 15 e 16 respostas iguais, 26 vezes o 4;
- `variancia-zero`: um item com a mesma resposta para todos (erro da planilha no alfa e no IC);
- `negativo`: médias negativas, benchmark Ruim e alfa negativo.

Os testes do módulo `src/ueq/` comparam média, dp, n e IC95 de escalas e itens, alfa, benchmark, qualidade pragmática e hedônica, escalas inconsistentes e respostas iguais por participante e a distribuição das respostas, com tolerância de `1e-6`. Erro da planilha tem de ser `null` na ferramenta.

**Situação em 17/11/2026:** os 11 cenários batem com a planilha oficial. São 6.543 valores comparados, e a maior diferença é de 9,3 × 10⁻¹⁵, que é arredondamento de ponto flutuante. As 245 células em que a planilha dá erro são `null` na ferramenta ([RNF11](documentacao/requisitos.md#rnf11), [verificação do cálculo](documentacao/verificacao-do-calculo.md#comparação-com-a-planilha-oficial)).

## 11. UEQ-S, a versão curta

(Fonte: Handbook UEQ versão 11, "Short version for special application scenarios", p. 11-13, e a *UEQ-S Data Analysis Tool V15*, `data/planilha-oficial/Short_UEQ_Data_Analysis_Tool_V15.xlsx`.)

O estudo escolhe o questionário na criação: o UEQ completo ou o UEQ-S. A escolha trava na primeira resposta, para o estudo não misturar os dois. O handbook recomenda o UEQ-S só quando o completo não cabe (pouco tempo, o UEQ dentro de um questionário maior, a mesma pessoa avaliando vários produtos seguidos), porque ele não mede as 6 escalas.

**Itens.** São 8 itens do próprio UEQ, nesta ordem ([`data/ueq-s-itens-ptbr.json`](../data/ueq-s-itens-ptbr.json)):

| UEQ-S | Item do UEQ | Esquerda | Direita | Escala |
|---|---|---|---|---|
| 1 | 11 | Obstrutivo | Condutor | Qualidade pragmática |
| 2 | 13 | Complicado | Fácil | Qualidade pragmática |
| 3 | 20 | Ineficiente | Eficiente | Qualidade pragmática |
| 4 | 21 | Confuso | Evidente | Qualidade pragmática |
| 5 | 6 | Aborrecido | Excitante | Qualidade hedônica |
| 6 | 7 | Desinteressante | Interessante | Qualidade hedônica |
| 7 | 10 | Convencional | Original | Qualidade hedônica |
| 8 | 15 | Comum | Vanguardista | Qualidade hedônica |

No UEQ-S o termo negativo fica sempre à esquerda, então todos os itens têm polaridade `+` e a recodificação é x − 4. Os itens 4 e 7 aparecem com os lados trocados em relação ao UEQ: uma resposta x no UEQ-S é 8 − x no item equivalente do UEQ. O UEQ-S existe nos mesmos 37 idiomas. Os termos de cada idioma vêm da lista oficial dos itens do UEQ-S (`docs/UEQ-ORG/ueq-s/UEQS_Items.pdf`), guardada em [`data/ueq-s-idiomas.json`](../data/ueq-s-idiomas.json). Em 31 idiomas ela repete os pares do UEQ completo, com a troca de lados. Em 6 (italiano, croata, grego, turco, persa e chinês) ela usa outra palavra em alguns pares, por exemplo *konvencionalna/inventivna* no item 7 em croata, e a ferramenta segue a lista do UEQ-S. Em 4 idiomas (espanhol, dinamarquês, tâmil e canarês) o PDF tem erros de digitação ou um par repetido; nesses casos fica o par do UEQ completo, e o arquivo registra cada correção.

**Onde ficam as respostas.** Num estudo do UEQ-S, as 8 respostas são gravadas nos itens equivalentes do UEQ, já convertidas para a orientação de cada um. A análise do UEQ-S lê esses 8 itens e desfaz a conversão. Por isso a mesma análise serve aos dois tipos de estudo: num estudo do UEQ completo, a aba UEQ-S dos resultados usa os 8 pares que o participante também respondeu, do mesmo jeito que os autores montaram o UEQ-S e o benchmark dele.

**Escalas.** Para cada participante (aba DT): qualidade pragmática = média dos itens 1 a 4; qualidade hedônica = média dos itens 5 a 8; geral = média dos 8. Média, dp, IC95, faixa de interpretação e benchmark seguem as seções 4, 5 e 8, com a mesma faixa neutra e o mesmo z. O handbook pede cuidado com a escala geral: ela não é um indicador único de experiência, porque o peso da pragmática e da hedônica muda de produto para produto.

**Alfa.** Só da pragmática e da hedônica, com a fórmula da seção 6 para k = 4 (aba Scale_Consistency, `4·r̄ / (1 + 3·r̄)`). A planilha não calcula alfa da geral.

**Benchmark.** Os limites da aba Benchmark da planilha do UEQ-S ([`data/benchmark-ueq-s.json`](../data/benchmark-ueq-s.json)):

| Escala | Abaixo da média | Acima da média | Bom | Excelente |
|---|---|---|---|---|
| Qualidade pragmática | 0,72 | 1,17 | 1,55 | 1,74 |
| Qualidade hedônica | 0,35 | 0,85 | 1,20 | 1,59 |
| Geral | 0,59 | 0,98 | 1,31 | 1,58 |

A própria planilha avisa que, por falta de dados do UEQ-S, esses limites vêm dos mesmos 8 itens dentro do benchmark do UEQ completo e são uma aproximação. O painel repete o aviso.

**Respostas suspeitas.** As regras da aba Inconsistencies da planilha do UEQ-S ([`data/protocolo-ueq-s.json`](../data/protocolo-ueq-s.json)), diferentes das do UEQ completo:

- uma escala é inconsistente quando a distância entre o melhor e o pior item dela passa de 3;
- a resposta é suspeita quando as 2 escalas são inconsistentes;
- a segunda regra só vale para quem marcou a posição do meio (4) nos 8 itens. Com tão poucos itens, repetir a mesma posição é comum, e a planilha só recomenda remover esse caso.

**Exportações.** Num estudo do UEQ-S, as respostas brutas e recodificadas têm 8 colunas (`item01` a `item08`, na ordem do UEQ-S), os resultados por escala têm pragmática, hedônica e geral, e a planilha oficial exportada é a do UEQ-S, preenchida como na seção 9.4: as 8 respostas em `Data!A4:H` e o idioma em `Read_First!B4`. Num estudo do UEQ completo, a aba UEQ-S exporta os resultados do UEQ-S e a planilha do UEQ-S com os 8 itens equivalentes.

**Validação.** Em `data/fixtures-ueq-s/` ficam 9 cenários com o `esperado.json` da planilha do UEQ-S recalculada no Excel ([data/fixtures-ueq-s/LEIA-ME.md](../data/fixtures-ueq-s/LEIA-ME.md)), dois deles tirados de cenários do UEQ completo. **Situação em 17/11/2026:** os 9 batem com a planilha. São 8.520 valores comparados, e a maior diferença é de 6,0 × 10⁻¹⁵. As 38 células em que a planilha dá erro são `null` na ferramenta ([RF62](documentacao/requisitos.md#rf62)).
