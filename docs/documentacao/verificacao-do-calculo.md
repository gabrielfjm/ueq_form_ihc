# Verificação do cálculo

Este documento confere, número por número, se a Ferramenta UEQ calcula o que o [Protocolo UEQ](../ueq-protocolo.md) manda calcular. A conferência usa o **Estudo de exemplo**, que o seed cria em toda instalação local, na conta de teste e com o link `/r/exemplo`, e refaz cada conta sem usar o código da ferramenta.

**Resultado:** todas as 336 comparações numéricas batem com a ferramenta. A maior diferença foi de 3,3 × 10⁻¹⁶, que é o erro de arredondamento do próprio computador. A interpretação, a faixa do benchmark, as escalas inconsistentes, as respostas iguais e a marca de suspeita de cada participante também são idênticas, e as exportações trazem os mesmos números.

Depois, a ferramenta foi comparada com a própria planilha oficial do UEQ em 11 cenários, do participante único aos 1000 participantes: os 6.543 valores batem, e a planilha oficial que a ferramenta exporta recalcula no Excel com os mesmos resultados ([Comparação com a planilha oficial](#comparação-com-a-planilha-oficial)).

Versão verificada: Ferramenta UEQ de 17/11/2026, com o módulo de cálculo de [`src/ueq/`](../../src/ueq/) e os parâmetros de [`data/protocolo.json`](../../data/protocolo.json) e [`data/benchmark.json`](../../data/benchmark.json).

## Como a verificação foi feita

1. **Os dados.** O Estudo de exemplo tem duas versões. "Checkout atual" recebe as 20 respostas de [`data/fixtures/basico/respostas.csv`](../../data/fixtures/basico/respostas.csv) e "Checkout em uma página" recebe as 15 de [`data/fixtures/inconsistente/respostas.csv`](../../data/fixtures/inconsistente/respostas.csv) (ver [`prisma/estudo-exemplo.ts`](../../prisma/estudo-exemplo.ts)). Cada linha tem os 26 valores de 1 a 7 na ordem oficial.
2. **A conta independente.** Cada fórmula foi escrita de novo a partir do Protocolo UEQ (recodificação, escore por escala, média, desvio-padrão amostral, IC95, correlação de Pearson, alfa padronizado, faixas, benchmark, grupos e regras de suspeita), sem reaproveitar nenhuma função da ferramenta. A Perspicuidade da versão "Checkout atual" foi feita inteira à mão e está passo a passo abaixo; as outras escalas seguem as mesmas contas.
3. **O que a ferramenta devolve.** As mesmas respostas foram passadas para `analisarEstudo`, a função que alimenta o painel, o PDF e as exportações, e para as quatro funções de exportação de [`src/lib/exportacoes.ts`](../../src/lib/exportacoes.ts).
4. **A comparação.** Cada número da conta independente foi comparado com o da ferramenta, em quatro recortes: cada versão, a versão 2 sem as respostas suspeitas e as duas versões juntas.

As seções até Exportações conferem que a ferramenta segue o protocolo. A [comparação com a planilha oficial](#comparação-com-a-planilha-oficial), que é o [RNF11](requisitos.md#rnf11), confere que o protocolo e a ferramenta dão os mesmos números que a própria UEQ Data Analysis Tool.

## Passo a passo: Perspicuidade do Checkout atual

A Perspicuidade tem 4 itens. A polaridade diz de que lado está o termo positivo: `+` à direita, `-` à esquerda.

| Item | Termo esquerdo | Termo direito | Polaridade |
|---|---|---|---|
| 2 | Incompreensível | Compreensível | + |
| 4 | De fácil aprendizagem | De difícil aprendizagem | - |
| 13 | Complicado | Fácil | + |
| 21 | Evidente | Confuso | - |

### 1. Recodificação

A resposta de 1 a 7 vira -3 a +3: nos itens `+`, valor - 4; nos itens `-`, 4 - valor ([Protocolo §2](../ueq-protocolo.md#2-recodificação)). O participante 1 respondeu 5, 4, 4 e 3:

| Item | Resposta | Conta | Recodificado |
|---|---|---|---|
| 2 (+) | 5 | 5 - 4 | +1 |
| 4 (-) | 4 | 4 - 4 | 0 |
| 13 (+) | 4 | 4 - 4 | 0 |
| 21 (-) | 3 | 4 - 3 | +1 |

### 2. Escore do participante na escala

É a média dos itens recodificados da escala ([Protocolo §3](../ueq-protocolo.md#3-escore-por-participante-e-escala)): (1 + 0 + 0 + 1) / 4 = **0,50**.

Os 20 participantes, na ordem do arquivo:

| 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|
| 0,50 | 1,50 | 0,25 | 0,50 | 0,25 | 1,25 | 2,00 | 1,00 | 2,00 | 0,50 |

| 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 |
|---|---|---|---|---|---|---|---|---|---|
| 0,75 | 0,00 | -0,25 | 0,25 | 2,25 | 1,00 | 1,00 | -0,75 | 0,50 | 2,50 |

### 3. Média e desvio-padrão

- **Média:** a soma dos 20 escores é 17,00, e 17,00 / 20 = **0,8500**.
- **Desvio-padrão amostral** (divisor n - 1, como o `STDEV` da planilha): a soma dos quadrados dos desvios em relação à média é 14,05. Então 14,05 / 19 = 0,7395 e √0,7395 = **0,8599**.

### 4. Intervalo de confiança de 95%

Margem = z × dp / √n, com z = 1,959964 ([Protocolo §4](../ueq-protocolo.md#4-estatísticas-por-escala-entre-participantes-incluídos-na-análise)): 1,959964 × 0,8599 / √20 = 1,6854 / 4,4721 = 0,3769.

IC95 = 0,8500 ± 0,3769 = **[0,4731; 1,2269]**.

### 5. Alfa de Cronbach

O alfa padronizado usa a média das correlações entre os itens recodificados da escala ([Protocolo §6](../ueq-protocolo.md#6-alfa-de-cronbach-por-escala)). Com 4 itens, são 6 pares:

| Par | 2 e 4 | 2 e 13 | 2 e 21 | 4 e 13 | 4 e 21 | 13 e 21 |
|---|---|---|---|---|---|---|
| r de Pearson | 0,6473 | 0,5326 | 0,3361 | 0,5261 | 0,6668 | 0,4304 |

- r̄ = (0,6473 + 0,5326 + 0,3361 + 0,5261 + 0,6668 + 0,4304) / 6 = 3,1393 / 6 = 0,5232.
- α = k × r̄ / (1 + (k - 1) × r̄) = 4 × 0,5232 / (1 + 3 × 0,5232) = 2,0929 / 2,5697 = **0,8144**.

Como 0,8144 é maior que 0,7, o painel não mostra aviso de consistência para esta escala.

### 6. Interpretação e benchmark

- **Interpretação:** 0,85 é maior que 0,8, então a média é **positiva** ([Protocolo §5](../ueq-protocolo.md#5-faixas-de-interpretação)).
- **Benchmark:** os limites da Perspicuidade são 2,00 (excelente), 1,73 (bom), 1,20 (acima da média) e 0,72 (abaixo da média). Como 0,72 < 0,85 ≤ 1,20, a faixa é **abaixo da média** ([Protocolo §8](../ueq-protocolo.md#8-benchmark)).

### 7. Qualidade pragmática e hedônica

São médias simples das médias das escalas ([RF39](requisitos.md#rf39)):

- **Pragmática** = (Perspicuidade + Eficiência + Confiabilidade) / 3 = (0,8500 + 1,0250 + 0,9125) / 3 = **0,9292**.
- **Hedônica** = (Estimulação + Novidade) / 2 = (0,6375 + 1,0125) / 2 = **0,8250**.

A ferramenta devolve os mesmos sete números: 0,50 para o participante 1, média 0,8500, dp 0,8599, IC95 de 0,4731 a 1,2269, alfa 0,8144, positiva, abaixo da média, e pragmática e hedônica de 0,9292 e 0,8250.

## Resultados conferidos

Os números estão com 4 casas, como na exportação de resultados por escala. O painel mostra 2.

### Checkout atual

20 participantes, nenhum suspeito. Pragmática 0,9292; hedônica 0,8250.

| Escala | Média | DP | IC95 | Alfa | Interpretação | Benchmark |
|---|---|---|---|---|---|---|
| Atratividade | 0,7333 | 0,9167 | 0,3316 a 1,1351 | 0,9173 | neutra | abaixo da média |
| Perspicuidade | 0,8500 | 0,8599 | 0,4731 a 1,2269 | 0,8144 | positiva | abaixo da média |
| Eficiência | 1,0250 | 0,7818 | 0,6824 a 1,3676 | 0,7452 | positiva | abaixo da média |
| Confiabilidade | 0,9125 | 0,9572 | 0,4930 a 1,3320 | 0,8188 | positiva | abaixo da média |
| Estimulação | 0,6375 | 0,7321 | 0,3166 a 0,9584 | 0,7401 | neutra | abaixo da média |
| Novidade | 1,0125 | 0,7139 | 0,6996 a 1,3254 | 0,7494 | positiva | acima da média |

### Checkout em uma página

15 participantes, 4 deles suspeitos e ainda na análise, como o seed grava. Pragmática 0,7944; hedônica 0,8500.

| Escala | Média | DP | IC95 | Alfa | Interpretação | Benchmark |
|---|---|---|---|---|---|---|
| Atratividade | 0,6000 | 0,9916 | 0,0982 a 1,1018 | 0,7366 | neutra | ruim |
| Perspicuidade | 0,8167 | 0,8263 | 0,3985 a 1,2348 | 0,5943 | positiva | abaixo da média |
| Eficiência | 0,8000 | 0,7270 | 0,4321 a 1,1679 | 0,3343 | neutra | abaixo da média |
| Confiabilidade | 0,7667 | 0,9135 | 0,3044 a 1,2290 | 0,5095 | neutra | ruim |
| Estimulação | 0,8667 | 0,6605 | 0,5324 a 1,2009 | 0,0932 | positiva | abaixo da média |
| Novidade | 0,8333 | 0,7657 | 0,4458 a 1,2208 | 0,4067 | positiva | acima da média |

Eficiência tem média exatamente 0,8000 e fica **neutra**: o limite da faixa neutra pertence a ela (de -0,8 a +0,8). Cinco escalas têm alfa abaixo de 0,7, e o painel avisa em cada uma ([RF45](requisitos.md#rf45)). É o efeito das respostas suspeitas, como mostra a próxima tabela.

### Checkout em uma página, sem as suspeitas

Depois de "Tirar suspeitas da análise" na aba Respostas, ficam 11 participantes. Pragmática 0,8636; hedônica 0,9545.

| Escala | Média | DP | IC95 | Alfa | Interpretação | Benchmark |
|---|---|---|---|---|---|---|
| Atratividade | 0,6364 | 1,1348 | -0,0343 a 1,3070 | 0,9265 | neutra | ruim |
| Perspicuidade | 0,7500 | 0,9354 | 0,1972 a 1,3028 | 0,8775 | neutra | abaixo da média |
| Eficiência | 0,8636 | 0,5519 | 0,5375 a 1,1898 | 0,2564 | positiva | abaixo da média |
| Confiabilidade | 0,9773 | 0,9517 | 0,4149 a 1,5397 | 0,8541 | positiva | abaixo da média |
| Estimulação | 0,9545 | 0,6876 | 0,5482 a 1,3609 | 0,7060 | positiva | abaixo da média |
| Novidade | 0,9545 | 0,8353 | 0,4609 a 1,4482 | 0,7011 | positiva | acima da média |

O alfa sobe acima de 0,7 em quatro das cinco escalas que estavam baixas. A Eficiência continua com alfa baixo: o problema dela não vem das suspeitas.

### As duas versões juntas

35 participantes. Pragmática 0,8714; hedônica 0,8357.

| Escala | Média | DP | IC95 | Alfa | Interpretação | Benchmark |
|---|---|---|---|---|---|---|
| Atratividade | 0,6762 | 0,9375 | 0,3656 a 0,9868 | 0,8331 | neutra | ruim |
| Perspicuidade | 0,8357 | 0,8335 | 0,5596 a 1,1118 | 0,7230 | positiva | abaixo da média |
| Eficiência | 0,9286 | 0,7563 | 0,6780 a 1,1791 | 0,5698 | positiva | abaixo da média |
| Confiabilidade | 0,8500 | 0,9279 | 0,5426 a 1,1574 | 0,6880 | positiva | abaixo da média |
| Estimulação | 0,7357 | 0,7017 | 0,5032 a 0,9682 | 0,4962 | neutra | abaixo da média |
| Novidade | 0,9357 | 0,7310 | 0,6935 a 1,1779 | 0,5705 | positiva | acima da média |

### Médias por item

As 26 médias e os 26 desvios-padrão de cada item, nos quatro recortes, também foram conferidos: 208 números, todos iguais aos da ferramenta.

## Respostas suspeitas

Uma participação é suspeita quando tem 3 ou mais escalas com amplitude maior que 3, ou mais de 15 respostas iguais ([Protocolo §7](../ueq-protocolo.md#7-respostas-inconsistentes)). A amplitude é a diferença entre o maior e o menor valor recodificado dos itens da escala.

No Checkout atual, nenhum participante passa de 3 em nenhuma regra: a maior quantidade de respostas iguais é 14. No Checkout em uma página:

| Linha | Atratividade | Perspicuidade | Eficiência | Confiabilidade | Estimulação | Novidade | Escalas acima de 3 | Respostas iguais | Suspeita |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 6 | 4 | 4 | 6 | 4 | 5 | 6 | 5 | sim |
| 2 | 1 | 1 | 1 | 2 | 2 | 5 | 1 | 8 | não |
| 3 | 1 | 1 | 2 | 2 | 1 | 1 | 0 | 7 | não |
| 4 | 2 | 0 | 3 | 1 | 2 | 2 | 0 | 7 | não |
| 5 | 4 | 0 | 6 | 2 | 0 | 2 | 2 | 8 | não |
| 6 | 4 | 4 | 6 | 5 | 6 | 6 | 6 | 7 | sim |
| 7 | 2 | 2 | 2 | 0 | 2 | 2 | 0 | 12 | não |
| 8 | 1 | 0 | 1 | 1 | 2 | 0 | 0 | 9 | não |
| 9 | 4 | 4 | 1 | 6 | 4 | 0 | 4 | 7 | sim |
| 10 | 2 | 1 | 2 | 1 | 1 | 2 | 0 | 12 | não |
| 11 | 3 | 2 | 2 | 2 | 1 | 2 | 0 | 11 | não |
| 12 | 1 | 2 | 2 | 1 | 1 | 2 | 0 | 7 | não |
| 13 | 4 | 1 | 1 | 2 | 6 | 4 | 3 | 6 | sim |
| 14 | 1 | 2 | 1 | 3 | 2 | 1 | 0 | 11 | não |
| 15 | 2 | 1 | 1 | 1 | 1 | 1 | 0 | 8 | não |

- As linhas 1, 6, 9 e 13 são suspeitas, as mesmas que a aba Respostas marca e que o [LEIA-ME da fixture](../../data/fixtures/inconsistente/LEIA-ME.md) prevê.
- As linhas 2 e 5 ficam abaixo do limite: uma e duas escalas inconsistentes.
- A amplitude exatamente 3 não conta (linhas 4, 11 e 14): a regra é maior que 3.

## Exportações

As exportações foram geradas pela ferramenta com as 35 participações e conferidas contra a conta independente:

| Exportação | O que foi conferido | Resultado |
|---|---|---|
| Respostas brutas | BOM, 39 colunas (13 de dados da participação e 26 itens) e os valores de 1 a 7 de cada participante | Iguais às 35 linhas das fixtures |
| Respostas recodificadas | Os 26 valores de -3 a +3 de cada participante | Iguais à recodificação feita à mão |
| Resultados por escala | 18 linhas (6 escalas × as duas versões e o estudo inteiro), com n, média, dp, IC95, alfa e interpretação em 4 casas com vírgula decimal | Iguais às tabelas acima |
| Planilha oficial do UEQ (XLSX) | As 35 linhas de 26 valores em Data!A4 da UEQ Data Analysis Tool V15, sem os dados de exemplo, e o resto do arquivo igual ao oficial | Iguais às fixtures, na ordem; recalculada no Excel, ver a seção seguinte |

## Comparação com a planilha oficial

Feita em 17/11/2026 com a *UEQ Data Analysis Tool V15* de `Data_Analysis_Tools.zip` (ueq-online.org), no Microsoft Excel 16. Para cada cenário de [data/fixtures/](../../data/fixtures/LEIA-ME.md), o script `scripts/planilha-oficial.ps1` colou o `respostas.csv` em `Data!A4` de uma cópia da planilha, mandou recalcular e leu as células de resultado com todas as casas. Antes, o mesmo script rodou nos dados de exemplo que vêm na planilha e reproduziu exatamente os resultados gravados no arquivo oficial.

Foram comparados média, dp, n e IC95 das 6 escalas e dos 26 itens, alfa de Cronbach, faixa do benchmark, qualidade pragmática e hedônica, a distribuição das respostas de cada item e, para cada participante, quantas escalas são inconsistentes e quantas respostas iguais ele deu.

| Cenário | Participantes | Suspeitas | Valores comparados | Erros da planilha (null na ferramenta) | Maior diferença |
|---|---|---|---|---|---|
| basico | 20 | 0 | 391 | 0 | 3,3 × 10⁻¹⁶ |
| inconsistente | 15 | 4 | 381 | 0 | 4,4 × 10⁻¹⁶ |
| extremos/n1 | 1 | 0 | 353 | 102 | 0 |
| extremos/n2 | 2 | 0 | 355 | 0 | 8,9 × 10⁻¹⁶ |
| extremos/todos-1 | 3 | 3 | 357 | 70 | 0 |
| extremos/todos-7 | 3 | 3 | 357 | 70 | 0 |
| oficial-exemplo | 255 | 18 | 861 | 0 | 2,9 × 10⁻¹⁵ |
| grande | 1000 | 63 | 2.351 | 0 | 9,3 × 10⁻¹⁵ |
| bordas | 12 | 3 | 375 | 0 | 5,6 × 10⁻¹⁶ |
| variancia-zero | 12 | 0 | 375 | 3 | 4,4 × 10⁻¹⁶ |
| negativo | 18 | 1 | 387 | 0 | 2,2 × 10⁻¹⁶ |
| **Total** | | | **6.543** | **245** | **9,3 × 10⁻¹⁵** |

Os textos (faixa do benchmark) e as contagens (n, distribuição, escalas inconsistentes, respostas iguais) são idênticos. Os números decimais diferem no máximo na 15ª casa, por causa da ordem das somas em ponto flutuante; o teste aceita até 1e-6. Os casos que pedem atenção também batem:

- **Uma pessoa só ou todos iguais.** A planilha dá `#DIV/0!` no desvio-padrão, no IC e no alfa; a ferramenta devolve `null` e o painel mostra "—".
- **Um item sem variação** (`variancia-zero`). A planilha não calcula a correlação desse item, e o alfa de Perspicuidade e o IC do item viram erro. A ferramenta faz o mesmo e calcula o alfa das outras cinco escalas normalmente.
- **Itens que se contradizem** (`negativo`). A correlação média da Novidade fica perto de -1/3, e a fórmula do alfa padronizado, k × r̄ / (1 + (k - 1) × r̄), dá -42,78 nas duas.
- **Os limites das regras de suspeita** (`bordas`). Amplitude exatamente 3 não conta e 4 conta; 15 respostas iguais não marcam e 16 marcam. A ferramenta e a planilha dão o mesmo para cada participante.

### A planilha que a ferramenta exporta

A exportação "Planilha oficial do UEQ (XLSX)" foi conferida de três jeitos:

1. **Arquivo por arquivo.** Um teste de unidade abre o `.xlsx` gerado e confere que a aba Data tem as respostas a partir da linha 4, que os 255 participantes de exemplo saíram, que o idioma está em `Read_First!B5` e que gráficos, estilos, imagens e as outras partes do arquivo são byte a byte iguais aos do arquivo oficial.
2. **No Excel.** A planilha dos 11 cenários, gerada pela ferramenta, foi aberta no Excel sem colar nada e sem mandar recalcular. O Excel recalculou sozinho ao abrir, e os 6.543 valores ficaram idênticos aos da colagem à mão, com os rótulos em português ("Atractividade", "Desagradável").
3. **Pela tela.** Um teste de ponta a ponta importa 7 cenários (`oficial-exemplo`, `grande`, `inconsistente`, `bordas`, `variancia-zero`, `negativo` e `extremos/n2`) pela tela Importar respostas, confere n, média, DP, IC95, alfa e benchmark de cada escala na tabela do painel com os números da planilha oficial e baixa a planilha da versão. Cinco desses arquivos, baixados da ferramenta rodando, foram abertos no Excel: zero diferenças.

## Como refazer

Qualquer pessoa pode refazer esta conferência sem programar:

1. Numa instalação local, rode `pnpm db:seed` e entre com a conta de teste (`pesquisador@exemplo.com`, senha `senha-de-teste`): o Estudo de exemplo já está na lista.
2. Em Resultados › Exportar, baixe as respostas recodificadas e os resultados por escala.
3. Numa planilha, calcule a média dos itens de cada escala por participante, e depois a média, o `DESVPAD` e a margem `1,959964 × DESVPAD / RAIZ(n)` de cada escala. Para o alfa, calcule `CORREL` de cada par de itens da escala, tire a média e aplique k × r̄ / (1 + (k - 1) × r̄).
4. Compare com o arquivo de resultados por escala e com o painel.
5. Para comparar com a planilha oficial, baixe "Planilha oficial do UEQ (XLSX)", abra no Excel e clique em Habilitar edição. As abas Results, Confidence_Intervals, Scale_Consistency, Benchmark e Inconsistencies mostram os números da própria planilha, calculados com as respostas do estudo.
