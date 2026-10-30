# Requisitos

Todos os requisitos da Ferramenta UEQ implementados até a sprint de documentação: **52 funcionais (RF)** e **24 não funcionais (RNF)**. 74 estão entregues e 2 estão parciais.

A mesma lista, com todas as colunas, está em [planilha-requisitos.xlsx](planilha-requisitos.xlsx) e em [requisitos.csv](requisitos.csv). A ligação de cada requisito com histórias, casos de uso, código e testes está na [matriz de rastreabilidade](matriz-rastreabilidade.md).

## Como ler

**Tipo.** Funcional diz o que a ferramenta faz. Não funcional diz como ela tem que ser (acessível, segura, exata). Os não funcionais estão agrupados pelas características da ISO/IEC 25010.

**Prioridade.**

- **Alta:** sem ele não dá para conduzir um estudo UEQ válido e acessível. É o escopo obrigatório da disciplina.
- **Média:** amplia o alcance ou o conforto de uso, mas o estudo funciona sem ele.
- **Baixa:** extensão opcional (`prompts/10-extensoes.md`) ou ferramenta de manutenção.

**Status.**

- **Entregue:** implementado, integrado à `main` e com evidência, de teste automático ou de verificação manual descrita.
- **Parcial:** há estrutura ou parte do comportamento. O critério de aceitação diz o que falta.

**Sprint.** Cada sprint é uma branch integrada por pull request. A coluna Sprint mostra onde o requisito foi entregue; quando mais de uma sprint aparece, a primeira entregou e as outras ampliaram.

| Sprint | Nome | Branch | PR | Integrada em | Escopo |
|---|---|---|---|---|---|
| S00 | Sprint 00 · Setup | `feat/00-setup` | #1 | 22/10/2026 | Esqueleto Next.js, Prisma, Vitest, Playwright com axe, tokens de cor com teste de contraste |
| SP | Sprint de protótipos | `docs/prototipos-e-readme` | #2, #3, #4 | 22/10/2026 | Protótipos de baixa e alta fidelidade, protótipo navegável, identidade visual e README |
| S01 | Sprint 01 · Banco e seed | `feat/01-banco-e-seed` | #5 | 23/10/2026 | Modelo de dados Prisma e carga validada dos 26 itens em português |
| S02 | Sprint 02 · Módulo de cálculo | `feat/02-modulo-calculo` | #6 | 23/10/2026 | Cálculo do UEQ em funções puras, fixtures e conferência do protocolo na planilha V15 |
| S03 | Sprint 03 · Autenticação | `feat/03-autenticacao` | #7 | 23/10/2026 | Cadastro, login, logout, sessões no banco e Minha conta |
| S04 | Sprint 04 · Estudos | `feat/04-estudos` | #8 | 23/10/2026 | Criar, listar, editar, abrir, encerrar e excluir estudos com versões |
| S05 | Sprint 05 · Questionário | `feat/05-questionario` | #9 | 23/10/2026 | Fluxo do participante: consentimento, 26 itens, dados opcionais e fim |
| S06 | Sprint 06 · Painel de resultados | `feat/06-painel-resultados` | #10 | 23/10/2026 | Painel com gráficos SVG, benchmark, IC95, alfa e comparação de versões |
| S07 | Sprint 07 · Suspeitos | `feat/07-suspeitos` | #11 | 29/10/2026 | Respostas suspeitas e controle de inclusão na análise |
| S08 | Sprint 08 · Exportação | `feat/08-exportacao` | #12 | 29/10/2026 | Quatro exportações em CSV, inclusive no formato da planilha oficial |
| SID | Sprint de idiomas | `feat/idiomas` | #13 | 29/10/2026 | Questionário nos 37 idiomas oficiais do UEQ |
| S10 | Sprint 10 · Extensões | `feat/10-extensoes` | #14 | 29/10/2026 | Importação por CSV, painel em PDF e estrutura do UEQ-S |
| SDOC | Sprint de documentação | `docs/documentacao` | a abrir | 30/10/2026 | Requisitos, rastreabilidade, personas, histórias, casos de uso e de teste, diagramas UML, arquitetura C4, licença MIT e aba Documentação na ferramenta |

## Resumo

| Sprint | RF | RNF | Requisitos entregues |
|---|---|---|---|
| Sprint 00 · Setup | 0 | 6 | RNF01, RNF02, RNF04, RNF17, RNF18, RNF20 |
| Sprint de protótipos | 0 | 1 | RNF19 |
| Sprint 01 · Banco e seed | 1 | 1 | RF32, RNF12 |
| Sprint 02 · Módulo de cálculo | 4 | 3 | RF33, RF34, RF35, RF36, RNF07, RNF08, RNF16 |
| Sprint 03 · Autenticação | 8 | 3 | RF01, RF02, RF03, RF04, RF05, RF06, RF07, RF08, RNF10, RNF13, RNF14 |
| Sprint 04 · Estudos | 8 | 1 | RF09, RF10, RF11, RF12, RF13, RF14, RF15, RF16, RNF11 |
| Sprint 05 · Questionário | 11 | 4 | RF17, RF18, RF19, RF20, RF21, RF22, RF23, RF24, RF25, RF26, RF27, RNF03, RNF05, RNF06, RNF09 |
| Sprint 06 · Painel de resultados | 5 | 0 | RF37, RF38, RF39, RF40, RF41 |
| Sprint 07 · Suspeitos | 3 | 0 | RF42, RF43, RF44 |
| Sprint 08 · Exportação | 4 | 1 | RF45, RF46, RF47, RF48, RNF21 |
| Sprint de idiomas | 4 | 1 | RF28, RF29, RF30, RF31, RNF15 |
| Sprint 10 · Extensões | 3 | 1 | RF49, RF50, RF51, RNF22 |
| Sprint de documentação | 1 | 2 | RF52, RNF24, RNF23 |

Por prioridade: 44 alta, 25 média e 7 baixa.

Pendências abertas:

- **RF51 · Aplicar o UEQ-S.** Pendente: a equipe preenche data/ueq-s-itens-ptbr.json e data/benchmark-ueq-s.json a partir das fontes oficiais; depois o instrumento é implementado sem quebrar os testes do UEQ completo.
- **RNF07 · Cálculo igual ao da planilha oficial.** Pendente: a equipe cola cada fixture na planilha oficial e preenche os esperado.json. Até lá os testes de comparação ficam pulados; as bordas e as regras das fixtures já passam.

## Requisitos funcionais

### Conta e acesso

| ID | Requisito | Descrição | Critério de aceitação | Prioridade | Sprint | Status |
|---|---|---|---|---|---|---|
| <a id="rf01"></a>RF01 | **Cadastrar conta** | O pesquisador cria a conta com nome, e-mail e senha. O e-mail é único e a senha tem no mínimo 8 caracteres. As regras de senha aparecem antes de digitar. | Com dados válidos a conta é criada e a pessoa entra. Com e-mail já usado aparece "Esse e-mail já tem conta. Entre por aqui." abaixo do campo e no resumo de erros. | Alta | S03 | Entregue |
| <a id="rf02"></a>RF02 | **Entrar** | O pesquisador entra com e-mail e senha. A sessão dura 7 dias. | Com credenciais corretas a pessoa vai para Seus estudos. Com credenciais erradas a mensagem não revela qual dos dois campos está errado. | Alta | S03 | Entregue |
| <a id="rf03"></a>RF03 | **Sair** | O pesquisador encerra a sessão pela barra superior. A sessão é apagada do banco. | Depois de sair, qualquer página do pesquisador leva para Entrar. | Alta | S03 | Entregue |
| <a id="rf04"></a>RF04 | **Proteger a área do pesquisador** | Toda rota fora de /entrar, /cadastrar e /r/... exige sessão. Quem chega sem sessão vai para Entrar e, depois do login, volta para a página que pediu. | Abrir /estudos sem sessão leva a /entrar?voltar=/estudos. Depois do login a pessoa está em /estudos. O destino só aceita caminhos internos. | Alta | S03 | Entregue |
| <a id="rf05"></a>RF05 | **Editar dados cadastrais** | Em Minha conta o pesquisador altera nome e e-mail. O e-mail novo não pode pertencer a outra conta. | Salvar mostra "Dados salvos." em role="status". E-mail de outra conta mostra "Esse e-mail já é de outra conta." | Média | S03 | Entregue |
| <a id="rf06"></a>RF06 | **Trocar a senha** | O pesquisador troca a senha informando a atual. A troca encerra as sessões abertas em outros aparelhos. | Depois da troca, o outro navegador perde a sessão e o atual continua dentro. Aparece "Senha trocada." | Média | S03 | Entregue |
| <a id="rf07"></a>RF07 | **Excluir a conta** | O pesquisador exclui a conta digitando o próprio e-mail. A tela diz quantos estudos e respostas vão junto. A exclusão apaga tudo em cascata. | Sem o e-mail certo nada é apagado. Com o e-mail certo a conta, os estudos, as versões, as participações e as respostas somem e o login deixa de funcionar. | Média | S03 | Entregue |
| <a id="rf08"></a>RF08 | **Resumo da conta** | Minha conta mostra numa ficha lateral o número de estudos, de respostas coletadas e a data de criação da conta. | Os números da ficha batem com os estudos e respostas do pesquisador. | Baixa | S03 | Entregue |

### Estudos

| ID | Requisito | Descrição | Critério de aceitação | Prioridade | Sprint | Status |
|---|---|---|---|---|---|---|
| <a id="rf09"></a>RF09 | **Listar estudos** | Seus estudos mostra uma tabela com título, produto, status, versões, respostas e última resposta, ordenada pela atualização mais recente. Sem estudos, mostra o estado vazio com o caminho para criar o primeiro. | A tabela tem caption e th com scope. O título é um link para a página do estudo; a linha inteira não é clicável. | Alta | S04 | Entregue |
| <a id="rf10"></a>RF10 | **Criar estudo** | O pesquisador informa título, produto avaliado, objetivo, datas de início e fim e de 1 a 6 versões. Ao lado, uma prévia mostra o termo que o participante vai ler. O estudo nasce em RASCUNHO. | Campos faltando, data de fim antes da de início ou versões com o mesmo nome geram o resumo de erros com link para cada campo. | Alta | S04 | Entregue |
| <a id="rf11"></a>RF11 | **Sugerir o nome da primeira versão** | O nome do produto avaliado vira a sugestão de nome da primeira versão, para não pedir a mesma informação duas vezes. Adicionar e remover versão move o foco para o lugar certo. | Digitar o produto preenche a primeira versão enquanto ela não foi editada. Depois de adicionar, o foco vai para o campo novo; depois de remover, para o botão de adicionar. | Média | S04 | Entregue |
| <a id="rf12"></a>RF12 | **Editar estudo e versões** | O pesquisador edita os dados e as versões. Versão que já tem respostas não pode ser removida. | Salvar mostra o aviso de sucesso na página do estudo. O botão de remover some nas versões com respostas, e o servidor recusa a remoção mesmo assim. | Alta | S04 | Entregue |
| <a id="rf13"></a>RF13 | **Compartilhar o link público** | Cada estudo tem um link /r/<slug> curto, aleatório e não sequencial. A página do estudo mostra o link num campo com o botão "Copiar link". | Copiar coloca o link na área de transferência e anuncia "Link copiado" em role="status". Funciona pelo teclado. | Alta | S04 | Entregue |
| <a id="rf14"></a>RF14 | **Controlar a coleta** | O pesquisador abre a coleta (RASCUNHO → ABERTO), encerra (ABERTO → ENCERRADO) e reabre (ENCERRADO → ABERTO). O status aparece sempre no mesmo lugar, escrito com a consequência. | Cada transição mostra a consequência ("Coleta aberta. O link já aceita respostas."). Uma transição feita em outra aba é recusada com aviso para recarregar. | Alta | S04 | Entregue |
| <a id="rf15"></a>RF15 | **Excluir estudo** | O pesquisador exclui o estudo digitando o título, com confirmação em linha (sem modal) que diz quantas respostas vão junto. Versões, participações e respostas são apagadas em cascata. | Texto diferente do título não apaga nada e diz isso. Com o título certo o estudo some da lista e aparece o aviso de exclusão. | Alta | S04 | Entregue |

### Questionário do participante

| ID | Requisito | Descrição | Critério de aceitação | Prioridade | Sprint | Status |
|---|---|---|---|---|---|---|
| <a id="rf16"></a>RF16 | **Informar a situação do link** | O link público explica a situação em vez de dar erro: estudo em rascunho ("ainda não está aberto"), coleta encerrada ou endereço inexistente. | Com o estudo em RASCUNHO ou ENCERRADO o link mostra o aviso correspondente e não deixa consentir. | Alta | S04, S05 | Entregue |
| <a id="rf17"></a>RF17 | **Dar o consentimento** | O participante lê título, objetivo, tempo estimado (3 a 5 minutos), participação voluntária e anônima e o direito de desistir. A participação só é criada depois de "Concordo e quero participar". "Não quero participar" sai sem gravar nada. | Antes de concordar não existe nenhuma linha em Participacao. Recusar leva à página de saída sem gravar. | Alta | S05 | Entregue |
| <a id="rf18"></a>RF18 | **Balancear as versões** | Quando o estudo tem mais de uma versão, cada participante vai para a versão com menos respostas concluídas. No empate, vale a de menor ordem. | Com versões A (3 respostas) e B (1 resposta), o próximo participante vai para B. | Alta | S05 | Entregue |
| <a id="rf19"></a>RF19 | **Responder os 26 itens** | O questionário mostra a instrução oficial e os 26 itens na ordem e polaridade oficiais. Cada item é um diferencial semântico de 7 posições, com rádios nativos, nenhum pré-selecionado e todos com o mesmo peso visual. | Cada item é um fieldset com legenda "Item N de 26" e os dois termos. Cada rádio tem nome acessível com posição e polo ("3 de 7, mais perto de ..."). Nenhum rádio vem marcado. | Alta | S05 | Entregue |
| <a id="rf20"></a>RF20 | **Mostrar etapas e progresso** | As etapas aparecem em texto (1 Consentimento · 2 Questionário · 3 Dados opcionais). Um rodapé fixo mostra "N de 26 respondidos", anunciado ao leitor de tela só a cada 5 itens e ao completar. | A etapa atual tem aria-current. O contador muda a cada marcação. O rodapé nunca cobre o item em foco. | Média | S05 | Entregue |
| <a id="rf21"></a>RF21 | **Validar o envio** | O envio é validado no navegador e no servidor. Se faltar item, um resumo no topo diz "Faltam N itens", recebe o foco e tem um link para cada item. Cada item faltando ganha borda e texto. | Enviar com itens em branco não grava nada, leva o foco ao resumo, e cada link leva ao item certo. | Alta | S05 | Entregue |
| <a id="rf22"></a>RF22 | **Gravar as respostas** | Com os 26 itens respondidos, as 26 respostas e a conclusão da participação são gravadas numa única transação. Nada vai para Resposta antes do envio final. A suspeita é calculada nesse momento. | Depois do envio existem exatamente 26 respostas da participação, concluidaEm preenchido e suspeita calculada. Se a gravação falha, nada fica pela metade. | Alta | S05, S07 | Entregue |
| <a id="rf23"></a>RF23 | **Recuperar respostas em andamento** | As marcações ficam no sessionStorage da aba. Ao recarregar ou voltar, o questionário recupera o que já tinha sido marcado e avisa. | Recarregar a página mantém os rádios marcados e mostra "Recuperamos as respostas que você já tinha marcado". | Média | S05 | Entregue |
| <a id="rf24"></a>RF24 | **Sair sem enviar** | O link "Sair sem enviar" fica sempre disponível no rodapé e pede confirmação em linha. Confirmar apaga a participação incompleta. | Depois de confirmar não sobra nenhuma participação nem resposta, e a pessoa vê a página de saída. | Alta | S05 | Entregue |
| <a id="rf25"></a>RF25 | **Informar dados opcionais** | Depois do questionário, uma etapa própria pergunta faixa etária, gênero, escolaridade e familiaridade com o produto, em faixas fechadas e sempre com "Prefiro não responder". "Pular esta etapa" tem o mesmo peso de "Continuar". | Pular não grava demografia. Só valores das opções oferecidas são aceitos. | Média | S05 | Entregue |
| <a id="rf26"></a>RF26 | **Evitar envio duplicado** | Um cookie restrito ao caminho do link marca, por 30 dias, que aquele navegador já respondeu. O link respondido não aceita outro envio. | Abrir o link de novo no mesmo navegador depois de responder mostra que a resposta já foi registrada. | Média | S05 | Entregue |
| <a id="rf27"></a>RF27 | **Encerrar a participação** | A página final, curta e sem animação, diz que as respostas foram registradas e que a pessoa pode fechar a página. | Depois dos dados opcionais (ou de pular), a pessoa chega ao fim e o cookie da participação em andamento é apagado. | Média | S05 | Entregue |

### Idiomas

| ID | Requisito | Descrição | Critério de aceitação | Prioridade | Sprint | Status |
|---|---|---|---|---|---|---|
| <a id="rf28"></a>RF28 | **Questionário em 37 idiomas** | O link do participante funciona nos 37 idiomas do pacote oficial do UEQ: termos e instrução oficiais de cada idioma e telas traduzidas pela equipe. Correções nos PDFs oficiais ficam registradas com o par original e o motivo. | Cada idioma tem textos de tela, 26 pares de termos e instrução. O português é idêntico a data/ueq-itens-ptbr.json. | Média | SID | Entregue |
| <a id="rf29"></a>RF29 | **Escolher o idioma** | O idioma inicial é o primeiro dos 37 pedido pelo navegador (Accept-Language), ou português. No consentimento, um seletor com o nome de cada idioma escrito nele mesmo só muda com o botão "Aplicar". O <html lang> e o dir acompanham; em árabe, hebraico e persa o texto vai da direita para a esquerda, mas a escala continua de 1 a 7. | Escolher no seletor não muda a página. Aplicar árabe deixa a página RTL com a escala na ordem oficial. | Média | SID | Entregue |
| <a id="rf30"></a>RF30 | **Avisar tradução não aprovada** | Nos 9 idiomas cuja tradução ainda não foi aprovada pelos autores do UEQ, o consentimento mostra um aviso no próprio idioma e o pesquisador vê a marca "tradução não aprovada". | Escolher árabe mostra o aviso no consentimento. Em Respostas, a coluna Idioma diz "tradução não aprovada". | Média | SID | Entregue |
| <a id="rf31"></a>RF31 | **Registrar o idioma da participação** | Ao consentir, o código do idioma é gravado em Participacao.idioma. O pesquisador vê o idioma em Respostas e nas exportações (colunas idioma e traducao_aprovada). | Uma participação feita em espanhol aparece como espanhol na tabela de respostas e no CSV de respostas brutas. | Média | SID | Entregue |

### Cálculo UEQ

| ID | Requisito | Descrição | Critério de aceitação | Prioridade | Sprint | Status |
|---|---|---|---|---|---|---|
| <a id="rf32"></a>RF32 | **Carregar os itens oficiais** | O seed carrega os 26 itens do UEQ em português a partir de data/ueq-itens-ptbr.json, validando com Zod: 26 itens numerados de 1 a 26, 6 de Atratividade e 4 de cada outra escala, nenhum termo vazio. '+' vira POSITIVA_DIREITA e '-' vira POSITIVA_ESQUERDA. | Arquivo inválido faz o seed parar dizendo qual item está errado. Arquivo válido grava os 26 itens por upsert. | Alta | S01 | Entregue |
| <a id="rf33"></a>RF33 | **Calcular as estatísticas por escala** | Para cada uma das 6 escalas, com as participações incluídas na análise: n, média, desvio-padrão amostral, IC95 com z exato (1,959963984540054), alfa de Cronbach padronizado e faixa de interpretação (positiva > 0,8; negativa < -0,8; neutra entre os dois, limites inclusive). | Com n < 2 ou dp = 0 não há IC; com item sem variação não há alfa (null, como na planilha). As bordas n = 0, n = 1 e todos iguais estão testadas. | Alta | S02 | Entregue |
| <a id="rf34"></a>RF34 | **Classificar no benchmark** | Cada média de escala é classificada nas 5 faixas do benchmark oficial (Excelente, Bom, Acima da média, Abaixo da média, Ruim) com os limites de data/benchmark.json. Média igual ao limite fica na faixa de baixo. | Média exatamente no limite cai na faixa inferior. Sem média, a faixa é null. | Alta | S02 | Entregue |
| <a id="rf35"></a>RF35 | **Calcular grupos e itens** | Qualidade pragmática (média de Perspicuidade, Eficiência e Confiabilidade) e hedônica (média de Estimulação e Novidade), e por item: média, dp, IC95 e distribuição das respostas de 1 a 7. | Pragmática e hedônica são a média simples das médias das escalas, como na aba Results da planilha. | Alta | S02 | Entregue |
| <a id="rf36"></a>RF36 | **Detectar respostas suspeitas** | Uma participação é suspeita se tiver amplitude maior que 3 em 3 ou mais escalas, ou mais de 15 respostas iguais nos 26 itens. Os limiares ficam em data/protocolo.json. A suspeita é gravada quando a participação é concluída ou importada. | A fixture inconsistente marca exatamente as linhas 1, 6, 9 e 13. Todos-1 e todos-7 caem na regra das respostas iguais. | Alta | S02, S07 | Entregue |

### Painel de resultados

| ID | Requisito | Descrição | Critério de aceitação | Prioridade | Sprint | Status |
|---|---|---|---|---|---|---|
| <a id="rf37"></a>RF37 | **Ver o painel de resultados** | O painel mostra, nesta ordem: resumo em texto (respostas, suspeitas, na análise, status, período), leitura rápida escrita, gráfico das 6 escalas com faixas do benchmark e IC95 agrupado em Atratividade, Pragmática e Hedônica, tabela equivalente e as médias de pragmática e hedônica. Nenhum cálculo fica fora de src/ueq. | Os números da tela são os de analisarEstudo. O gráfico tem role="img", title e desc gerados dos dados e a tabela logo abaixo. | Alta | S06 | Entregue |
| <a id="rf38"></a>RF38 | **Ver as médias por item** | Um gráfico mostra cada item com termo esquerdo, ponto da média no eixo de -3 a +3 e termo direito, na ordem oficial ou agrupado por escala. | Alternar a ordem reorganiza os 26 itens sem recarregar a análise. | Média | S06 | Entregue |
| <a id="rf39"></a>RF39 | **Comparar versões** | Com mais de uma versão, o modo Comparar versões mostra o gráfico de escalas com um marcador por versão (círculo cheio, vazado, quadrado), legenda em texto, leitura rápida das diferenças e tabela. Não há teste estatístico. Estudo com uma versão não mostra nada de comparação. | As versões se distinguem pela forma, não só pela cor. Em 320 px o modo de comparação não rola na horizontal. | Média | S06 | Entregue |
| <a id="rf40"></a>RF40 | **Explicar termos e avisos** | Cada termo técnico (escala, benchmark, IC95, alfa de Cronbach) tem explicação curta em <details> perto de onde aparece. Alfa abaixo de 0,7 e amostra pequena geram aviso que diz o que significa e o que fazer. | Com uma resposta só, o painel diz "Amostra insuficiente para intervalo de confiança". Alfa < 0,7 aparece em cor de alerta com nota em texto. | Média | S06 | Entregue |
| <a id="rf41"></a>RF41 | **Guardar a visão na URL** | Versão, modo (uma versão ou comparação) e ordem dos itens ficam nos parâmetros da URL. Voltar, recarregar e compartilhar o endereço mantêm a mesma visão. | Trocar a versão muda a URL e não tira o foco do seletor. Recarregar a URL mostra a mesma versão. | Baixa | S06 | Entregue |

### Respostas suspeitas

| ID | Requisito | Descrição | Critério de aceitação | Prioridade | Sprint | Status |
|---|---|---|---|---|---|---|
| <a id="rf42"></a>RF42 | **Revisar as participações** | A página Respostas lista as participações com data, versão, idioma, origem, escalas inconsistentes, maior número de respostas iguais, motivo da suspeita e a caixa "Na análise". Há filtro "só suspeitas" na URL. Abrir uma linha mostra a amplitude das 6 escalas, destacando as que passaram do limiar. A regra de suspeita fica visível ao lado. | A fixture inconsistente aparece com as 4 suspeitas. "Ver escalas" destaca as escalas com amplitude acima de 3. | Alta | S07 | Entregue |
| <a id="rf43"></a>RF43 | **Incluir e excluir da análise** | O pesquisador tira ou devolve uma participação da análise, uma a uma ou em lote ("Tirar suspeitas da análise"). Excluir só muda incluidaNaAnalise; nada é apagado. O painel e as exportações de resultado passam a considerar só as incluídas e mostram quantas estão fora. | Excluir e incluir de novo devolve a participação com as mesmas respostas. Cada mudança é anunciada em role="status". | Alta | S07 | Entregue |
| <a id="rf44"></a>RF44 | **Recalcular as suspeitas** | O comando pnpm suspeitas:recalcular reavalia todas as participações concluídas depois que a equipe ajusta os limiares em data/protocolo.json. | Depois de mudar um limiar e rodar o comando, a coluna suspeita reflete a regra nova. | Baixa | S07 | Entregue |

### Exportação

| ID | Requisito | Descrição | Critério de aceitação | Prioridade | Sprint | Status |
|---|---|---|---|---|---|---|
| <a id="rf45"></a>RF45 | **Exportar respostas brutas** | CSV com uma linha por participação: id, versão, data, incluída, suspeita, idioma, tradução aprovada, origem, dados opcionais e item01 a item26 com valores de 1 a 7. | O arquivo tem BOM, separador ;, cabeçalho e as 26 colunas. Texto com ;, aspas ou quebra de linha vem protegido. | Alta | S08 | Entregue |
| <a id="rf46"></a>RF46 | **Exportar respostas recodificadas** | Mesmo formato das brutas, com os valores já recodificados de -3 a +3 conforme a polaridade de cada item. | Um item de polaridade '-' marcado em 1 sai como +3. | Média | S08 | Entregue |
| <a id="rf47"></a>RF47 | **Exportar resultados por escala** | CSV com versão, escala, n, média, dp, IC95 inferior e superior, alfa, faixa de interpretação e faixa do benchmark, com vírgula decimal, só das participações na análise. | Uma linha por escala e versão, números com vírgula decimal. | Alta | S08 | Entregue |
| <a id="rf48"></a>RF48 | **Exportar no formato da planilha oficial** | Só os 26 valores de 1 a 7 por linha, na ordem oficial, sem cabeçalho, separador ;, CRLF e sem BOM, só das participações na análise. É o que se cola em Data!A4 da UEQ Data Analysis Tool para conferir os cálculos. | A exportação da fixture basico é idêntica ao respostas.csv original. Quem está fora da análise não sai. | Alta | S08 | Entregue |
| <a id="rf49"></a>RF49 | **Exportar o painel em PDF** | "Exportar painel em PDF" gera no servidor, com Chromium (Playwright), um PDF A4 com margens de 18 mm, gráficos em vetor e cabeçalho com título, n e data de geração, a partir da rota de impressão com a mesma versão e modo da tela. | O arquivo baixado tem nome datado e a versão escolhida. Na impressão a navegação some. | Baixa | S10 | Entregue |

### Importação

| ID | Requisito | Descrição | Critério de aceitação | Prioridade | Sprint | Status |
|---|---|---|---|---|---|---|
| <a id="rf50"></a>RF50 | **Importar respostas por CSV** | Em Respostas › Importar, o pesquisador envia um CSV no formato da planilha oficial (26 valores por linha) para uma versão. A ferramenta mostra a prévia das 5 primeiras linhas ou o erro de cada linha (número de valores, valor fora de 1 a 7) e só grava depois da confirmação. As participações entram com origem IMPORTADA e sem idioma. | Arquivo com erro mostra o problema de cada linha e não importa nada. A fixture basico entra inteira e aparece como importada. | Baixa | S10 | Entregue |

### Instrumento

| ID | Requisito | Descrição | Critério de aceitação | Prioridade | Sprint | Status |
|---|---|---|---|---|---|---|
| <a id="rf51"></a>RF51 | **Aplicar o UEQ-S** | O estudo poderá usar o UEQ-S (8 itens, escalas pragmática e hedônica), escolhido na criação e travado após a primeira resposta. Por enquanto existem só a estrutura de dados e o teste que confere os arquivos. | Pendente: a equipe preenche data/ueq-s-itens-ptbr.json e data/benchmark-ueq-s.json a partir das fontes oficiais; depois o instrumento é implementado sem quebrar os testes do UEQ completo. | Baixa | S10 | Parcial |

### Documentação

| ID | Requisito | Descrição | Critério de aceitação | Prioridade | Sprint | Status |
|---|---|---|---|---|---|---|
| <a id="rf52"></a>RF52 | **Consultar a documentação na ferramenta** | A aba Documentação, pública (sem login) e também na barra superior do pesquisador, mostra os documentos do repositório (docs/) em seções (Visão geral, Requisitos, Usuários, Modelagem, Arquitetura, Testes, Especificação) e sub-abas por documento. Cada documento tem uma ficha que diz o que é, para que serve e quem deve ler, com o arquivo no GitHub, os downloads e o índice da página. Os links entre documentos e as âncoras funcionam dentro da ferramenta, e os diagramas aparecem como imagem com texto alternativo. Clicar num diagrama abre em tela cheia, com a barra de Voltar parada no topo, zoom de 50% a 400% (botões, Ctrl + roda do mouse ou + e -) e arrasto para mover; Voltar ou Esc fecham e devolvem o foco ao diagrama. Nos casos de uso, os atores aparecem como boneco, com os secundários à direita. Quem não entrou vê uma barra só com Documentação, Entrar e Criar conta. O link do participante não leva à documentação nem a nenhuma outra parte da ferramenta: só o formulário e o seletor de idioma. | Sem login, /documentacao abre com a barra pública e a área do pesquisador continua fechada. Em cada etapa do link do participante, todo link aponta para o próprio formulário. A aba marca a seção e o documento atuais com aria-current. Um link para requisitos.md#rf01 abre /documentacao/requisitos#rf01. Os diagramas carregam e têm texto alternativo. Endereço fora do catálogo dá 404 e a rota de arquivos só entrega o que está na lista. Sem violação do axe e sem rolagem horizontal em 320 px. | Média | SDOC | Entregue |

## Requisitos não funcionais

### Usabilidade

| ID | Requisito | Descrição | Critério de aceitação | Prioridade | Sprint | Status |
|---|---|---|---|---|---|---|
| <a id="rnf01"></a>RNF01 | **Conformidade WCAG 2.2 AA**<br>Acessibilidade | Todas as telas atendem WCAG 2.2 nível AA, base da ABNT NBR 17225:2025 e exigência da Lei 13.146/2015, art. 63. | Nenhuma violação WCAG 2.2 A ou AA apontada pelo axe-core em qualquer etapa, inclusive nos estados de erro. A checklist manual complementa o que a automação não vê. | Alta | S00 a S10 | Entregue |
| <a id="rnf02"></a>RNF02 | **Operação por teclado**<br>Acessibilidade | Tudo funciona só com teclado, sem armadilha, com foco sempre visível e nunca coberto pelo rodapé fixo. Primeiro Tab leva a "Pular para o conteúdo". | Os fluxos de cadastro e do participante passam só com teclado, conferindo a cada passo que o elemento focado está visível. | Alta | S00, S03, S05 | Entregue |
| <a id="rnf03"></a>RNF03 | **Refluxo e celular**<br>Acessibilidade | Em 320 px de largura (zoom de 400%) nenhuma tela rola na horizontal. No celular os termos do item ficam acima dos círculos e o alvo de toque é de 44×44 px. | Os testes em 320 px conferem que a largura do documento não passa da janela. Tabelas largas rolam dentro de uma região focável. | Alta | S05, S06, S07, S10 | Entregue |
| <a id="rnf04"></a>RNF04 | **Contraste verificado**<br>Acessibilidade | Texto com contraste de no mínimo 4,5:1; bordas de campo, círculos, foco e marcadores de gráfico com no mínimo 3:1. As cores vêm só de tokens.css. | O teste lê tokens.css, calcula a razão de contraste dos pares listados e falha abaixo do mínimo. | Alta | S00 | Entregue |
| <a id="rnf05"></a>RNF05 | **Nada só por cor**<br>Acessibilidade | Nenhuma informação depende só de cor: versões têm formas diferentes, faixas do benchmark têm rótulo em texto e erros têm texto. Os gráficos funcionam com daltonismo e com alto contraste do Windows. | Os gráficos continuam legíveis com protanopia, deuteranopia e acromatopsia simuladas e com forced-colors. | Alta | S05, S06 | Entregue |
| <a id="rnf13"></a>RNF13 | **Feedback e mensagens de erro específicas**<br>Proteção contra erro | Toda ação confirma o resultado numa região role="status" com a consequência. Erros dizem o que aconteceu e o que fazer, aparecem num resumo que recebe o foco com link para cada campo, e abaixo do campo com aria-describedby e aria-invalid. Ações destrutivas pedem confirmação digitada; ações reversíveis não. | Nenhuma mensagem genérica ("Ocorreu um erro"). O link do resumo leva ao campo. | Alta | S03, S04, S05, S07 | Entregue |
| <a id="rnf14"></a>RNF14 | **Autenticação acessível**<br>Acessibilidade | Login sem teste cognitivo: aceita colar senha e gerenciador de senhas, tem botão "Mostrar senha" com aria-pressed e autocomplete correto (name, email, current-password, new-password). | O botão alterna a visibilidade e anuncia o estado. | Alta | S03 | Entregue |
| <a id="rnf19"></a>RNF19 | **Identidade visual consistente**<br>Estética | As telas seguem o protótipo de alta fidelidade e docs/design.md: fundo branco, azul-petróleo para destaque, vermelho só para alerta, Atkinson Hyperlegible no texto, Source Sans 3 nos números com tabular-nums. Ícones só nas ações do pesquisador e sempre com texto; nenhum ícone nas telas do participante. | Cada tela com protótipo confere com o PNG correspondente. | Média | SP, S03 a S10 | Entregue |
| <a id="rnf20"></a>RNF20 | **Preferências do sistema**<br>Acessibilidade | A interface respeita prefers-reduced-motion e forced-colors (alto contraste do Windows): círculos, foco e gráficos continuam visíveis. | Com forced-colors ativo os círculos do questionário e os marcadores do gráfico continuam visíveis. | Média | S00, S05, S06 | Entregue |
| <a id="rnf24"></a>RNF24 | **Barra de navegação sempre à vista**<br>Operabilidade | A barra superior fica fixa no topo durante toda a rolagem, no computador e no celular. No celular (até 56rem) os links ficam atrás de um botão Menu, para a barra fixa ocupar uma linha só (cerca de 60 px); o menu fecha com Esc, devolvendo o foco ao botão, e ao trocar de página. O foco e o destino das âncoras param sempre abaixo da barra. | Depois de rolar, o topo da barra continua em 0. No celular, fechada, ela tem menos de 80 px. Subindo com Shift+Tab, nenhum elemento com foco fica embaixo da barra. Esc fecha o menu e devolve o foco ao botão. | Média | SDOC | Entregue |

### Adequação funcional

| ID | Requisito | Descrição | Critério de aceitação | Prioridade | Sprint | Status |
|---|---|---|---|---|---|---|
| <a id="rnf06"></a>RNF06 | **Fidelidade ao diferencial semântico**<br>Validade do instrumento | O questionário preserva o instrumento validado: nenhuma opção pré-selecionada, 7 posições visualmente idênticas (sem número, sem cor graduada, sem centro destacado), ordem e polaridade oficiais, layout idêntico nos 26 itens, sem tempo limite e o participante nunca vê resultados. | Nenhum rádio vem marcado. Todos os itens usam o mesmo componente. As rotas /r/... não leem a análise. | Alta | S05, SID | Entregue |
| <a id="rnf07"></a>RNF07 | **Cálculo igual ao da planilha oficial**<br>Exatidão | Os números da ferramenta batem com a UEQ Data Analysis Tool V15 com tolerância de 1e-6. Onde handbook e planilha divergem, vale a planilha. | Pendente: a equipe cola cada fixture na planilha oficial e preenche os esperado.json. Até lá os testes de comparação ficam pulados; as bordas e as regras das fixtures já passam. | Alta | S02 | Parcial |

### Manutenibilidade

| ID | Requisito | Descrição | Critério de aceitação | Prioridade | Sprint | Status |
|---|---|---|---|---|---|---|
| <a id="rnf08"></a>RNF08 | **Parâmetros do protocolo fora do código**<br>Modificabilidade | Limiares de suspeita, faixa neutra, alfa mínimo, z do IC e limites do benchmark ficam em data/protocolo.json e data/benchmark.json, cada um com a fonte (versão do handbook ou da planilha e data de acesso). | Mudar um limiar no JSON muda o resultado sem alterar código. | Alta | S02 | Entregue |
| <a id="rnf16"></a>RNF16 | **Cálculo isolado e testado**<br>Testabilidade | O cálculo do UEQ vive em src/ueq como funções puras, sem import de Prisma, React ou Next. Entrada são números e arrays; saída é objeto tipado. Cada regra cita a seção do handbook. | Os testes de unidade cobrem cada função com as bordas n = 0, n = 1, todos iguais e variância zero. | Alta | S02 | Entregue |
| <a id="rnf18"></a>RNF18 | **Qualidade de código**<br>Analisabilidade | pnpm lint, pnpm typecheck e pnpm test passam antes de cada pull request. Código segue docs/codigo.md: domínio em português, comentários só de porquê, sem any, sem console.log, commits pequenos em português. | A branch só é integrada com os três comandos passando. | Média | S00 a S10 | Entregue |
| <a id="rnf23"></a>RNF23 | **Código aberto e documentação rastreável**<br>Documentação | O código está sob a licença MIT. O repositório traz requisitos, rastreabilidade, personas, histórias de usuário, casos de uso, casos de teste, diagramas UML e arquitetura em formatos abertos (Markdown, CSV, XLSX e Mermaid), legíveis direto no GitHub. | O GitHub reconhece a licença MIT. Todo requisito tem pelo menos uma história, um caso de uso, um lugar no código e uma evidência. | Média | SDOC | Entregue |

### Segurança

| ID | Requisito | Descrição | Critério de aceitação | Prioridade | Sprint | Status |
|---|---|---|---|---|---|---|
| <a id="rnf09"></a>RNF09 | **Anonimato do participante**<br>Privacidade | Não se coleta IP, user-agent detalhado, nome, e-mail ou qualquer identificador. Os cookies do participante valem só no caminho /r/<slug> e guardam apenas o id aleatório da participação, a marca de já respondido e o idioma. Dados opcionais só em faixas. | O schema não tem campo de identificação do participante. O link funciona sem sessão. | Alta | S05 | Entregue |
| <a id="rnf10"></a>RNF10 | **Senha e sessão seguras**<br>Autenticidade | Senha guardada com bcrypt. A sessão usa um token aleatório de 32 bytes; o banco guarda só o hash SHA-256 do token. Cookie httpOnly, sameSite lax e secure em produção, com validade de 7 dias. | Quem lê o banco não consegue montar um cookie válido. Trocar a senha invalida as outras sessões. | Alta | S03 | Entregue |
| <a id="rnf11"></a>RNF11 | **Cada pesquisador só vê os próprios estudos**<br>Confidencialidade | Toda página, Server Action e rota de API confere a sessão no banco e o dono do estudo. Estudo de outro pesquisador responde igual a estudo inexistente. | Abrir, exportar ou gerar o PDF de um estudo alheio dá 404, igual a um estudo inexistente. Sem sessão, o proxy redireciona para Entrar antes de chegar à rota; com um cookie inválido, a rota responde 401. | Alta | S04, S08, S10 | Entregue |

### Confiabilidade

| ID | Requisito | Descrição | Critério de aceitação | Prioridade | Sprint | Status |
|---|---|---|---|---|---|---|
| <a id="rnf12"></a>RNF12 | **Integridade dos dados**<br>Integridade | Resposta só aceita valores de 1 a 7 (CHECK no banco) e é única por participação e item. Gravações compostas (envio, importação, edição de versões) acontecem em transação. Excluir estudo ou conta apaga em cascata. | Uma importação com qualquer linha inválida não grava nenhuma linha. | Alta | S01, S05, S10 | Entregue |
| <a id="rnf22"></a>RNF22 | **Limites da importação**<br>Tolerância a falha | A importação aceita arquivo de até 500 KB e 5000 linhas, tolera vírgula, tabulação, BOM, aspas e separador sobrando, e grava tudo ou nada. | Arquivo grande demais é recusado com a orientação de dividir. | Baixa | S10 | Entregue |

### Portabilidade

| ID | Requisito | Descrição | Critério de aceitação | Prioridade | Sprint | Status |
|---|---|---|---|---|---|---|
| <a id="rnf15"></a>RNF15 | **Internacionalização tipada**<br>Adaptabilidade | Nenhum texto de tela do participante fica fixo no componente. Cada idioma implementa o tipo TextosParticipante, então faltar uma chave é erro de compilação; plurais e listas seguem as regras do idioma (Intl). | Os 37 idiomas têm todos os textos, com os mesmos marcadores do português. | Média | SID | Entregue |
| <a id="rnf17"></a>RNF17 | **Execução local reproduzível**<br>Instalabilidade | Roda com Node.js 24, pnpm 10 e Docker (PostgreSQL 16) em seis comandos. Stack: Next.js 16 (App Router), React 19, TypeScript strict, Prisma 7, Zod 4. Sem framework de componentes e sem biblioteca de gráficos. | Um clone limpo sobe com pnpm install, docker compose up -d, cp .env.example .env, pnpm db:migrate, pnpm db:seed e pnpm dev. | Alta | S00 | Entregue |

### Compatibilidade

| ID | Requisito | Descrição | Critério de aceitação | Prioridade | Sprint | Status |
|---|---|---|---|---|---|---|
| <a id="rnf21"></a>RNF21 | **Arquivos prontos para Excel e para a planilha oficial**<br>Interoperabilidade | CSV em UTF-8 com BOM e separador ;, vírgula decimal no CSV de resultados e nome legível e datado (ueq_<slug-do-titulo>_<tipo>_<aaaa-mm-dd>.csv). O download não abre outra aba. O formato da planilha oficial segue o que ela exige (sem BOM, CRLF). | O CSV abre já separado em colunas no Excel em pt-BR. | Média | S08 | Entregue |

## Origem dos requisitos

Os requisitos vieram de quatro fontes, citadas na coluna Origem da planilha:

- a proposta da disciplina e os prompts de cada sprint, em [`prompts/`](../../prompts/);
- os requisitos de usabilidade e acessibilidade, ligados à literatura, em [`docs/ihc.md`](../ihc.md);
- a especificação do cálculo, conferida no handbook e na planilha oficial, em [`docs/ueq-protocolo.md`](../ueq-protocolo.md);
- as decisões sobre idiomas, em [`docs/idiomas.md`](../idiomas.md).
