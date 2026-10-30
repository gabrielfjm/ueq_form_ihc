# O que a equipe precisa preencher antes de rodar os prompts

Esses arquivos ficam com campos vazios de propósito. Nada aqui deve ser preenchido pelo Claude "de memória".

1. **`ueq-itens-ptbr.json`**: baixar o pacote oficial de idiomas em ueq-online.org, abrir a versão em português e copiar os 26 pares de termos para `termoEsquerdo` e `termoDireito`, na ordem. Escala e polaridade já estão preenchidas com base na versão em inglês. Confira se a ordem dos polos do arquivo em português bate com a coluna `referenciaEN` (se o termo positivo estiver do outro lado, a polaridade muda). Preencha `fonte`. **Feito em 23/10/2026.**
2. **`benchmark.json`**: abrir a planilha oficial *UEQ Data Analysis Tool*, aba Benchmark, e copiar os 4 limites de cada escala. Preencha `fonte` com versão e data. **Feito em 23/10/2026, planilha V15.**
3. **`protocolo.json`**: conferir no handbook o limiar de amplitude, o número de escalas para marcar suspeito e o z do IC. Trocar `fonte` e apagar `_confirmar`. **Feito em 23/10/2026, handbook versão 11 e planilha V15. Entrou também a regra de mais de 15 respostas iguais (`respostasIguaisMaximas`).**
4. **`fixtures/`**: criar os 3 conjuntos descritos em `docs/ueq-protocolo.md`, seção 10. Gere as respostas (pode pedir ao Claude no prompt 02), cole na planilha oficial e copie os resultados que ela calcula para `esperado.json`. Esse é o passo que prova a fidelidade ao instrumento na apresentação.
5. **UEQ-S, `ueq-s-itens-ptbr.json` e `benchmark-ueq-s.json`** (prompts/10-extensoes.md): os dois arquivos já têm a estrutura e o campo `comoPreencher`.
   - Nos itens, uma entrada para cada um dos 8 itens do UEQ-S oficial, na ordem dele, apontando o par equivalente do UEQ (`numeroNoUeq`).
   - No benchmark, os 4 limites de cada escala (pragmática, hedônica e geral), tirados da ferramenta oficial de análise do UEQ-S.
   - Preencha `fonte` nos dois.
   - O teste `src/ueq/__tests__/ueq-s.test.ts` fica pulado enquanto os arquivos estão vazios. Depois de preenchidos, ele confere os 8 itens, as escalas, a polaridade e a ordem dos limites.
   - Só depois disso o suporte ao UEQ-S como tipo de instrumento do estudo é implementado.
