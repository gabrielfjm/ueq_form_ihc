# Roteiro da revisão

Para quem vai revisar a ferramenta antes da entrega. Diz o que abrir, o que fazer em cada tela, o que avaliar e como anotar.

## O que é a ferramenta

A ferramenta aplica o User Experience Questionnaire (UEQ) e analisa as respostas. Há dois públicos:

- **Pesquisador:** cria um estudo com uma ou mais versões de um produto, compartilha um link e acompanha o painel de resultados.
- **Participante:** abre o link, sem conta, e responde os 26 pares de palavras em 3 a 5 minutos, em um dos 37 idiomas do UEQ.

## Como abrir

Num computador com Docker, Node e pnpm, na pasta do repositório:

```
docker compose up -d
pnpm install
cp .env.example .env
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Depois, abra http://localhost:3000.

- **Conta de pesquisador pronta:** `pesquisador@exemplo.com`, senha `senha-de-teste`. Ela já tem o "Estudo de exemplo", com 31 respostas em 2 versões.
- **Link do participante desse estudo:** http://localhost:3000/r/exemplo. Cada navegador responde uma vez. Para responder de novo, use uma janela anônima.
- **Para ver outro idioma:** troque no seletor "Idioma" do consentimento, ou mude o idioma preferido do navegador.

## As telas, na ordem de uso

Para cada tela, faça a tarefa e compare com o protótipo em `docs/prototipos/alta-fidelidade/`.

| # | Tela | Como chegar | Protótipo | Tarefa |
|---|---|---|---|---|
| 1 | Entrar | http://localhost:3000 | r1 | Entre com a conta pronta, primeiro errando a senha |
| 2 | Criar conta | link "Criar conta" em Entrar | r2 | Crie uma conta deixando um campo vazio, depois corrija |
| 3 | Lista de estudos | menu "Estudos" | r3 | Encontre o Estudo de exemplo |
| 4 | Criar estudo | "Criar estudo" | r4 | Crie um estudo com 2 versões |
| 5 | Estudo em rascunho | depois de criar | r4b | Abra a coleta e copie o link |
| 6 | Página do estudo | título do estudo na lista | r5 | Encerre e reabra a coleta |
| 7 | Consentimento | o link do estudo | p1 | Leia o termo e troque o idioma |
| 8 | Questionário | "Concordo e quero participar" | p7 (desktop), p2 (celular) | Responda tudo, deixando 2 itens em branco na primeira tentativa |
| 9 | Item faltando | enviar incompleto | p3 | Use o resumo para chegar aos itens que faltam |
| 10 | Dados opcionais | depois de enviar | p4 | Responda uma pergunta e pule as outras |
| 11 | Fim | "Continuar" | p5 | — |
| 12 | Link fechado | o link de um estudo encerrado ou em rascunho | p6 | — |
| 13 | Resultados, uma versão | aba "Resultados" | r6 | Diga, só olhando, qual escala foi melhor e se ficou acima do benchmark |
| 14 | Resultados, comparação | "Comparar versões" | r7 | Diga qual versão foi melhor em Estimulação |
| 15 | Respostas e suspeitas | aba "Respostas" | r8 | Mostre só as suspeitas, tire uma da análise e coloque de volta |
| 16 | Minha conta | menu "Minha conta" | r9 | Mude o nome |
| 17 | Exportar | fim da aba "Resultados" | r6, seção 04 | Baixe o CSV da planilha oficial e o painel em PDF |
| 18 | Importar respostas | aba "Respostas", "Importar respostas de um CSV" | sem protótipo | Importe `data/fixtures/basico/respostas.csv` numa versão |
| 19 | Painel em PDF | "Painel em PDF" | sem protótipo | Abra o PDF e confira se dá para usar no relatório |
| 20 | Seletor de idioma | topo do consentimento | sem protótipo | Escolha árabe ou japonês e responda o questionário |

As telas 18 a 20 foram criadas depois do protótipo. Avalie se seguem o mesmo padrão das outras: botões, campos, tabelas, mensagens e tom de voz.

## O que avaliar

Faça as três frentes. As duas primeiras cada pessoa faz sozinha; a consolidação é em grupo.

1. **Avaliação heurística.** Em cada tela, procure problemas pelas 10 heurísticas de Nielsen. Dê a severidade de 0 a 4 (tabela abaixo).
2. **Checklist manual de acessibilidade.** Use `docs/checklist-manual.md`: leitor de tela, só teclado, zoom, daltonismo e celular real. Os testes automáticos não substituem nenhum desses itens.
3. **Conferência das decisões.** Em `docs/rastreabilidade-ihc.md`, cada linha diz uma decisão e onde ela aparece. Confira na tela se é verdade. A seção "O que nenhum teste automático cobre" lista o que mais precisa de olho humano.

**Escala de severidade (Nielsen):**

| Nota | Significado |
|---|---|
| 0 | Não é problema de usabilidade |
| 1 | Cosmético: corrigir se sobrar tempo |
| 2 | Menor: baixa prioridade |
| 3 | Maior: importante corrigir |
| 4 | Catástrofe: corrigir antes de entregar |

## Como anotar

Uma linha por problema, numa planilha compartilhada da equipe:

| Tela (#) | Heurística ou critério WCAG | O que aconteceu | Severidade | Sugestão | Quem achou |
|---|---|---|---|---|---|
| 8 | Nielsen 9 | Exemplo: ao enviar incompleto, não ficou claro quantos itens faltavam | 3 | Mostrar o número no topo | Nome |

Anote o que aconteceu, não a solução. Se não tiver certeza se é problema, anote mesmo assim, com severidade 1.

## O que já foi testado automaticamente

Não precisa gastar tempo com:

- conferir se cada tela passa no axe-core;
- conferir se nenhuma tela rola na horizontal em 320 px;
- conferir se o fluxo inteiro funciona só com o teclado.

Os testes de ponta a ponta já fazem isso em todas as telas, no desktop e no celular. Os cálculos do UEQ também são testados. A conferência final contra a planilha oficial é um passo separado: `data/fixtures/LEIA-ME.md`.

O que sobra para vocês é o que só uma pessoa avalia:

- se a tela se entende;
- se o texto está claro;
- se o leitor de tela soa bem;
- se o polegar acerta o círculo;
- se o painel leva à conclusão certa.

## Pedidos de atenção

- **Painel (telas 13 e 14):** alguém que não conhece o UEQ consegue tirar a conclusão certa?
- **Questionário no celular (telas 8 e 9):** responda em pé, com uma mão.
- **Idiomas (tela 20):** se alguém da equipe fala outro idioma além do português, revise os textos dele. As traduções das telas foram feitas pela equipe (`docs/idiomas.md`).
- **Telas sem protótipo (18 a 20):** são as menos vistas até agora.
