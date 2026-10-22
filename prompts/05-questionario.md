# 05 · Questionário do participante

> A tela que mais vai ser avaliada numa disciplina de IHC. Rodar em plan mode e ler o plano com atenção.

```
Leia docs/ihc.md seções 2, 3 e 4.1 (são a especificação desta etapa), docs/design.md seção "Questionário do participante" e docs/ueq-protocolo.md seção 1.

No plano, para cada decisão de interface, cite o princípio de docs/ihc.md que a justifica.

Implemente o fluxo público em /r/[slug]:

1. Atribuição de versão: se houver mais de uma, vai para a que tem menos respostas concluídas (balanceamento). Função isolada, comentário de uma linha explicando
2. Etapas com indicação textual ("Etapa 1 de 3 · Consentimento") e <title> próprio por etapa
3. Consentimento: título do estudo, objetivo, participação voluntária e anônima, tempo estimado de 3 a 5 minutos, pode desistir a qualquer momento, nenhum dado de identificação coletado. Botão "Concordo e quero participar" e link "Não quero participar". Só depois de concordar cria a Participacao com consentiuEm
4. Itens: instrução oficial do UEQ em português (de data/, ou provisória marcada TODO(equipe)). Os 26 itens na ordem oficial, termos e polaridade lidos do banco
5. Componente src/componentes/ItemDiferencial.tsx, seguindo exatamente docs/ihc.md 4.1:
   - <fieldset> + <legend> com "Item N de 26" e os dois termos
   - 7 <input type="radio"> nativos, nenhum pré-selecionado, visualmente idênticos entre si (docs/ihc.md seção 3), nome acessível com posição e polo mais próximo
   - área de toque de 44×44 px, foco visível em cada círculo, estados de hover/foco/marcado com contraste ≥ 3:1
   - sem atalho de tecla única, sem mudar foco ou rolar ao marcar
   - celular: termos acima dos círculos, um em cada ponta
   - forced-colors testado
6. Rodapé fixo com "N de 26 respondidos" e link "Sair sem enviar" (confirmação em linha). Anúncio aria-live polite só a cada 5 itens e ao completar. scroll-padding-bottom para o rodapé nunca cobrir o foco
7. Dados demográficos opcionais em etapa própria, faixas fechadas, "Prefiro não responder" em todos, e um botão "Pular esta etapa" com o mesmo peso de "Continuar"
8. Envio: valida no cliente e no servidor. Se faltar item: resumo de erros no topo com link para cada item, foco no resumo, item faltando com borda + texto. No servidor, grava Participacao + 26 Respostas em transação. Nada é gravado em Resposta antes do envio final
9. Respostas em andamento no sessionStorage (try/catch). Ao voltar, avisa "Recuperamos as respostas que você já tinha marcado"
10. Página final curta, sem animação, dizendo que as respostas foram registradas e que pode fechar a página
11. Cookie simples para evitar envio duplicado sem querer
12. Sem coleta de IP, user-agent detalhado ou qualquer identificador

Testes Playwright:
- fluxo completo em 1280 px e em 390 px
- fluxo completo só com teclado (Tab, setas, Espaço, Enter), conferindo a cada passo que o elemento focado está visível e não coberto pelo rodapé
- envio incompleto: foco vai para o resumo, links levam aos itens certos
- verificarAcessibilidade em todas as etapas, incluindo o estado de erro
- snapshot da árvore de acessibilidade de um item, conferindo legend e nomes dos 7 rádios
- 320 px e zoom equivalente a 400% sem rolagem horizontal

Depois rode /revisar-ui e /revisar-ihc e me mande prints em 1280, 390 e 320 px.
```
