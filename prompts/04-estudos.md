# 04 · Criar e gerenciar estudos

```
Implemente o requisito "criar e gerenciar estudos" da disciplina.

Telas:
1. /estudos: lista dos estudos do pesquisador como TABELA (título, produto, status, versões, respostas, última resposta), não como grade de cards. Ordenada por atualização. Botão "Criar estudo" no topo à direita do título
2. /estudos/novo e /estudos/[id]/editar: título, produto avaliado, objetivo (textarea), data de início e fim, e a lista de versões (mínimo 1, adicionar e remover em linha). Um estudo com uma versão só não mostra nada de "comparação" na interface
3. /estudos/[id]: página do estudo. Faixa de cabeçalho com título, status em negrito com ponto antes, linha de resumo em texto. Abaixo, o link público num campo com botão "Copiar link", uma seção por versão com contagem de respostas, e as ações

Regras de status:
- RASCUNHO: edita tudo, link público mostra "Este estudo ainda não está aberto"
- ABERTO: aceita respostas. Não dá para remover versão que já tem respostas
- ENCERRADO: não aceita respostas, link mostra "A coleta deste estudo foi encerrada". Pode reabrir

Ações "Abrir coleta", "Encerrar coleta", "Excluir estudo". Excluir pede confirmação em linha digitando o título do estudo (não modal), e avisa quantas respostas vão junto.

Use Server Actions. Pesquisador só vê e altera os próprios estudos (checar dono em toda action, não só na página).

Usabilidade e acessibilidade (docs/ihc.md seção 4.2):
- Tabela com <caption>, <th scope>, título do estudo como link (não a linha inteira clicável)
- Toda ação confirma o resultado numa região role="status" com a consequência ("Coleta aberta. O link já aceita respostas.")
- O status do estudo aparece sempre no mesmo lugar e diz o que significa
- Nome do produto sugere o nome da primeira versão (WCAG 3.3.7)
- "Copiar link" anuncia "Link copiado" no role="status" e funciona no teclado
- Adicionar/remover versão move o foco para o campo novo ou para o botão de adicionar, nunca deixa o foco perdido
- Um h1 por página, h2 por seção

Siga docs/design.md à risca. Antes de finalizar, rode /revisar-ui e /revisar-ihc nessas telas.
```
