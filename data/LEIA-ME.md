# O que a equipe precisa preencher antes de rodar os prompts

Esses arquivos ficam com campos vazios de propósito. Nada aqui deve ser preenchido pelo Claude "de memória".

1. **`ueq-itens-ptbr.json`**: baixar o pacote oficial de idiomas em ueq-online.org, abrir a versão em português e copiar os 26 pares de termos para `termoEsquerdo` e `termoDireito`, na ordem. Escala e polaridade já estão preenchidas com base na versão em inglês. Confira se a ordem dos polos do arquivo em português bate com a coluna `referenciaEN` (se o termo positivo estiver do outro lado, a polaridade muda). Preencha `fonte`.
2. **`benchmark.json`**: abrir a planilha oficial *UEQ Data Analysis Tool*, aba Benchmark, e copiar os 4 limites de cada escala. Preencha `fonte` com versão e data.
3. **`protocolo.json`**: conferir no handbook o limiar de amplitude, o número de escalas para marcar suspeito e o z do IC. Trocar `fonte` e apagar `_confirmar`.
4. **`fixtures/`**: criar os 3 conjuntos descritos em `docs/ueq-protocolo.md`, seção 10. Gere as respostas (pode pedir ao Claude no prompt 02), cole na planilha oficial e copie os resultados que ela calcula para `esperado.json`. Esse é o passo que prova a fidelidade ao instrumento na apresentação.
