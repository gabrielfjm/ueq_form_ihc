# Material oficial do UEQ

Cópias, sem nenhuma alteração, do material que os autores do UEQ publicam em https://www.ueq-online.org/. A Ferramenta UEQ se baseia nele e o guarda aqui como referência; não é um produto oficial do UEQ nem tem vínculo com os autores.

| Arquivo | O que é |
|---|---|
| `Handbook.pdf` | *User Experience Questionnaire Handbook*, de Martin Schrepp, versão 11: aplicação, cálculo, interpretação, benchmark, respostas suspeitas e o UEQ-S |
| `UEQ_All_Languages.zip` e `UEQ_All_Languages/` | O questionário completo, com a instrução, nos 37 idiomas, mais as perguntas da extensão KPI |
| `Data_Analysis_Tools.zip` e `Data_Analysis_Tools/` | As planilhas oficiais de análise (V15), de Martin Schrepp: UEQ, UEQ-S, comparação de produtos e estimativa de amostra |
| `ueq-s/UEQS_Items.pdf` | Os 8 itens do UEQ-S, na ordem, nos 37 idiomas |
| `ueq-s/Data_Analysis_Tools-s/` | As mesmas planilhas, do pacote do UEQ-S (idênticas às de `Data_Analysis_Tools/`) |

## Créditos

- **UEQ:** Bettina Laugwitz, Theo Held e Martin Schrepp (2008).
- **Benchmark, UEQ-S e guia de aplicação:** Martin Schrepp, Andreas Hinderks e Jörg Thomaschewski (2014, 2017).
- **Tradução para o português:** Manuel Pérez Cota, Ramiro Gonçalves, Jörg Thomaschewski e Martin Schrepp (2014).

As referências completas estão na página inicial da ferramenta e em [docs/ueq-protocolo.md](../ueq-protocolo.md).

## Onde a ferramenta usa cada arquivo

- `data/ueq-idiomas.json` e `data/ueq-instrucoes.json`: os 26 pares e a instrução de cada idioma, de `UEQ_All_Languages`.
- `data/ueq-s-idiomas.json`: os 8 pares do UEQ-S de cada idioma, de `ueq-s/UEQS_Items.pdf`, com as correções dos erros do PDF registradas no próprio arquivo.
- `data/planilha-oficial/`: as duas planilhas de análise que a exportação preenche, copiadas de `Data_Analysis_Tools`.
- `data/benchmark.json`, `data/benchmark-ueq-s.json`, `data/protocolo.json` e `data/protocolo-ueq-s.json`: limites do benchmark e regras de suspeita, do handbook e das planilhas.
