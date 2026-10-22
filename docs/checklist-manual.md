# Checklist manual de usabilidade e acessibilidade

Para a equipe rodar com as próprias mãos antes da entrega. Marque, anote o problema e quem corrige.

## Leitor de tela
NVDA + Firefox no Windows, VoiceOver + Safari no iPhone (ou TalkBack + Chrome no Android).

- [ ] Questionário completo do começo ao fim só ouvindo, sem olhar a tela
- [ ] Ao entrar em um item, o leitor anuncia número do item, os dois termos e a posição
- [ ] O progresso é anunciado sem interromper a cada clique
- [ ] Ao enviar incompleto, o leitor anuncia o resumo de erros e dá para ir até o item faltando
- [ ] No painel, o gráfico é anunciado com a descrição e a tabela é navegável por célula com cabeçalho lido
- [ ] Mensagens de sucesso ("Coleta aberta") são anunciadas

## Teclado
- [ ] Criar estudo, abrir coleta, responder o questionário, ver resultados e exportar sem tocar no mouse
- [ ] Foco sempre visível e nunca escondido atrás do rodapé fixo
- [ ] Ordem de foco faz sentido em todas as telas

## Visão
- [ ] Zoom de 200% e 400% no navegador: nada corta, nada sobrepõe
- [ ] Largura de 320 px: sem rolagem horizontal
- [ ] Simulação de daltonismo (Chrome DevTools > Rendering > Emulate vision deficiencies): protanopia, deuteranopia, tritanopia, acromatopsia. Gráfico continua legível
- [ ] Alto contraste do Windows: círculos do questionário e foco visíveis
- [ ] Bookmarklet de espaçamento de texto (WCAG 1.4.12) não quebra layout

## Celular real
- [ ] Abrir o link pelo WhatsApp e responder tudo com o polegar, em pé
- [ ] Nenhum toque acidental no círculo vizinho
- [ ] Teclado virtual não cobre o campo em foco nos dados demográficos

## Avaliação heurística (cada um sozinho, depois consolidar)
Para cada problema: tela, heurística violada (Nielsen 1 a 10), severidade (0 a 4), sugestão.

## Teste com usuários
- [ ] 5 participantes respondendo um estudo real, com pensamento em voz alta
- [ ] 2 a 3 pesquisadores fazendo: criar estudo com 2 versões, abrir coleta, interpretar o painel, excluir uma resposta suspeita, exportar para a planilha oficial
- [ ] Registrar sucesso, tempo, erros e comentários
- [ ] Pesquisadores respondem o UEQ sobre a ferramenta, pela própria ferramenta
