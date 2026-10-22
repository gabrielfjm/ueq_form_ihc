# 08 · Exportação

```
Leia docs/ueq-protocolo.md seção 9.

Implemente as 4 exportações como rotas GET em /api/estudos/[id]/exportar/[tipo], protegidas por sessão e checagem de dono:
- brutas
- recodificadas
- resultados
- planilha-oficial

Nome do arquivo: ueq_[slug-do-titulo]_[tipo]_[aaaa-mm-dd].csv

Na página de resultados, uma seção "Exportar" no fim, com os 4 links em lista de texto, cada um com uma frase dizendo para que serve. Ex.: "Formato da planilha oficial. Cole na aba de dados da UEQ Data Analysis Tool para conferir os cálculos."

A geração do CSV fica em funções puras testáveis (src/lib/csv.ts para escape e formatação, e uma função por tipo de exportação). Teste:
- escape de ; " e quebra de linha em campos de texto (demografia, nome da versão)
- BOM presente nos CSV pt-BR
- exportação planilha-oficial da fixture basico é idêntica ao respostas.csv original
```
