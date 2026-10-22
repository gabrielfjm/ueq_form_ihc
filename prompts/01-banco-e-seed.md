# 01 · Modelo de dados e seed dos itens

> Antes: data/ueq-itens-ptbr.json precisa estar preenchido (ver data/LEIA-ME.md).

```
Leia docs/ueq-protocolo.md seções 1 e 7, e a tabela de entidades abaixo.

Entidades (da nossa proposta):
- Pesquisador: nome, email (único), senhaHash, criadoEm
- Estudo: pesquisador, titulo, produtoAvaliado, objetivo, status (RASCUNHO | ABERTO | ENCERRADO), dataInicio, dataFim, slugPublico (único, curto, não sequencial), criadoEm, atualizadoEm
- Versao: estudo, nome, ordem
- Item: numero (1 a 26, único), termoEsquerdo, termoDireito, escala (enum das 6 escalas), polaridade (POSITIVA_DIREITA | POSITIVA_ESQUERDA)
- Participacao: versao, consentiuEm, criadaEm, concluidaEm, demografia (json opcional: faixaEtaria, genero, escolaridade, familiaridadeComProduto), suspeita (bool), incluidaNaAnalise (bool, padrão true)
- Resposta: participacao, item, valor (1 a 7). Única por (participacao, item)

Tarefas:
1. Escreva prisma/schema.prisma com isso. Nomes de model em português sem acento, @@map para tabelas em snake_case. Exclusão de estudo apaga em cascata versões, participações e respostas.
2. Adicione uma CHECK constraint de valor entre 1 e 7 via migration SQL.
3. Escreva prisma/seed.ts que lê data/ueq-itens-ptbr.json, valida com Zod (26 itens, números 1..26 sem repetição, 6 itens de atratividade e 4 de cada outra escala, nenhum termo vazio) e faz upsert por numero. Se a validação falhar, o seed para com mensagem dizendo exatamente qual item está errado.
4. Mapeie '+' para POSITIVA_DIREITA e '-' para POSITIVA_ESQUERDA.

Se algum termo em português estiver vazio no JSON, NÃO preencha. Pare e me avise.

Rode a migration e o seed, e me mostre a contagem de itens por escala e por polaridade direto do banco.
```
