# Idiomas

A Ferramenta UEQ funciona nos 37 idiomas do pacote oficial do UEQ, com dois caminhos separados:

- **O link do participante** usa os termos e as instruções oficiais e textos de tela revisáveis, em arquivos. Como é instrumento de medida, nada do questionário passa por tradução automática.
- **A ferramenta do pesquisador** é escrita em português e traduzida sob demanda pela API do Claude ([seção própria](#a-ferramenta-do-pesquisador)). Os textos escritos pelo pesquisador num estudo (título, produto e objetivo) usam a mesma API.

## Como o idioma é escolhido

- Ao criar o estudo, o pesquisador escolhe o idioma dele (`Estudo.idioma`, com o idioma da conta como padrão). O link abre nesse idioma, mesmo com o navegador em outro.
- No consentimento e no questionário há um seletor "Idioma" com o nome de cada idioma escrito nele mesmo. Escolher no seletor não muda nada sozinho: só o botão "Aplicar" muda (WCAG 3.2.2). Trocar no questionário volta para ele, com as marcações guardadas.
- A escolha fica num cookie (`ueq_idioma`, só em `/r/<slug>`) e vale para todas as etapas. Ao consentir, o código do idioma é gravado em `Participacao.idioma`.
- O `<html lang>` e o `dir` seguem o idioma (WCAG 3.1.1). Por isso o link do participante tem um layout raiz próprio (`src/app/r/[slug]/layout.tsx`), separado do da ferramenta (`src/app/(ferramenta)/layout.tsx`).
- Em árabe, hebraico e persa o texto vai da direita para a esquerda. A linha de círculos continua da esquerda para a direita, de 1 a 7, com o termo da esquerda à esquerda, como nos PDFs oficiais desses idiomas.

## O que vem de onde

| Conteúdo | Arquivo | Fonte |
|---|---|---|
| 26 pares de termos | `data/ueq-idiomas.json` | PDF oficial de cada idioma, conferido contra a imagem da página |
| Instrução antes dos itens | `data/ueq-instrucoes.json` | PDF oficial de cada idioma, sem o exemplo com círculo marcado (como em português) |
| Textos das telas (consentimento, botões, nomes acessíveis, erros, dados opcionais, fim) | `src/idiomas/textos/*.ts` | Tradução da equipe |
| Política de privacidade, vista pelo link do participante | Tabela `traducao` do banco | API do Claude, com os mesmos textos da ferramenta. Sem tradução, aparece em português, com um aviso no idioma da pessoa |
| Título, produto e objetivo do estudo | Tabela `traducao` do banco | API do Claude, a partir do idioma do estudo. A página espera até 8 segundos; o que não chegar a tempo sai no original, marcado com o `lang` dele, e fica para a próxima visita |

O PDF é a referência porque é o questionário que o participante veria. A aba `Items` da UEQ Data Analysis Tool V15 traz outra versão em vários idiomas:

- em espanhol, os termos estão sem acento;
- em italiano, dinamarquês, turco, chinês, búlgaro e árabe, a redação é outra.

Onde a camada de texto do PDF usa fonte legada (híndi, marati, bengali, tâmil, canarês), o texto veio da planilha e foi conferido item a item contra a imagem. Também vieram da planilha o hebraico, o persa e o tailandês. Cada idioma registra a origem em `origemDoTexto`.

## Correções nos termos oficiais

Em 16 pares o próprio PDF oficial tem um defeito que impede responder ou que inverte a pontuação. Todos os idiomas afetados são de tradução ainda não aprovada, exceto persa e híndi. A correção é a menor possível. Cada uma fica em `correcoes`, no JSON, com o par original e o motivo.

| Idioma | Item | No PDF oficial | Usado aqui |
|---|---|---|---|
| Bósnio, hebraico, marati, bengali, tâmil, árabe, canarês | 19 | o mesmo termo negativo dos dois lados ("não atende às expectativas") | o termo positivo à esquerda, como no original inglês |
| Húngaro | 16 | `kellemetlen / kellemetlen` | `kellemetlen / kellemes` |
| Húngaro | 19 | `… / elvárásoknak` (cortado) | `… / nem felelnek meg az elvárásoknak` |
| Hebraico | 14 | `לא מושכת / ושך` (cortado) | `לא מושכת / מושכת` |
| Hebraico | 24 | `אטקרטיבי` (erro de digitação) | `אטרקטיבי` |
| Canarês | 8 | `ಊಹಿಸಲು ಸಾಧ್ಯವಾದಾಗ` ("quando é possível prever") | `ಊಹಿಸಲು ಸಾಧ್ಯವಾಗದ` ("não é possível prever") |
| Norueguês | 26 | `ledende / innovativ` (dois termos positivos) | `konservativ / innovativ` |
| Híndi | 2 e 4 | termo positivo do lado oposto ao do original | termos trocados de lado |
| Persa | 16 | `مطلوب / نامطلوب`, positivo à esquerda | `نامطلوب / مطلوب` |

Nos itens com termos trocados de lado, a pontuação continua a do original: quem marca perto do termo positivo pontua positivo. É o motivo para trocar os termos, e não a polaridade do item no banco.

Duas frases de instrução ficaram de fora:

- em hebraico, as frases sobre "pares agrupados por aspecto" e "importância de cada aspecto", que descrevem outro formulário;
- em persa, a frase que pede para riscar o item que não der para avaliar, porque aqui todos os itens são obrigatórios.

## Tradução não aprovada

Nove PDFs avisam "This translation is not yet finally approved": árabe, bengali, bósnio, hebraico, húngaro, canarês, marati, norueguês e tâmil.

- Ao escolher um deles, o consentimento mostra o aviso no próprio idioma.
- Em Respostas, a coluna Idioma diz "tradução não aprovada".
- As exportações de respostas trazem as colunas `idioma` e `traducao_aprovada`.

## Revisão por falante nativo

Antes de usar um idioma num estudo real, alguém fluente deve conferir:

1. os textos de tela em `src/idiomas/textos/<código>.ts`, que são todos tradução da equipe (a API do Claude traduz só a ferramenta do pesquisador e os textos do estudo);
2. as correções da tabela acima, quando o idioma tem alguma;
3. as instruções marcadas "Transcrito da imagem… Conferir com falante nativo" em `data/ueq-instrucoes.json`: árabe, híndi, marati, bengali, tâmil e canarês. Em bengali, os espaços entre as palavras foram postos pela equipe, porque o PDF não os tem.

As respostas de dados opcionais são gravadas sempre com a categoria em português (por exemplo, "25 a 34 anos"), em qualquer idioma. A análise e as exportações não mudam.

## A ferramenta do pesquisador

O idioma é escolhido ao criar a conta e trocado em Minha conta › Idioma. Antes de entrar, vale o último escolhido no navegador (cookie `idioma_interface`). Avisos do sino e e-mails saem no idioma de quem recebe.

Como funciona:

1. Todo texto de tela é escrito em português dentro de `t("…")` ou `m("…")`. O comando `pnpm i18n:catalogo` extrai esses textos para `src/traducao/catalogo.json`.
2. Ao abrir uma tela em outro idioma, o servidor lê as traduções da tabela `traducao`. O que falta sai em português, e os lotes de 60 textos, agrupados por tela, rodam depois da resposta, com até 6 ao mesmo tempo, pelo modelo definido em `src/traducao/claude.ts` (Claude Haiku 5.5, o mais barato).
   - A tradução anda em três etapas, para os lotes não escolherem palavras diferentes para a mesma coisa: primeiro o glossário do idioma (`src/traducao/rodadas.ts`), guardado na tabela; depois os rótulos curtos; por fim os textos longos, que recebem a tradução dos botões que citam.
   - Cada texto vai com o arquivo que o usa e com as instruções sobre o sentido dos termos, para "baixar" não virar "dar baixa".
   - O glossário traz uma frase-modelo que fixa o tratamento formal do idioma, e a revisão trata qualquer outro tratamento como erro.
   - O nome "Ferramenta UEQ" viaja como marcador e sai igual em todos os idiomas.
   - Uma segunda leitura compara original e tradução e corrige o que mudou de sentido.
   - Tradução com `{marcadores}` diferentes do original é descartada: o texto fica em português.
   - Isso reduz os erros, mas não substitui a revisão por falante nativo.
3. Cada tradução é guardada por idioma e pelo hash do texto, então nunca é pedida duas vezes. Mudar um texto em português gera uma tradução nova.
4. Administração › Idiomas mostra a cobertura de cada idioma e tem o botão "Traduzir agora".

Ao escrever um texto novo, pense em quem vai traduzi-lo sem ver a tela:

- Escreva a frase completa, com sujeito. "Fica num cookie" não diz o que fica.
- Evite palavra com dois sentidos. "Baixa os dados" pode virar "dá baixa"; prefira "faz o download".
- Não monte frase com pedaços de texto e link: a ordem das palavras muda de idioma para idioma.
- Só passe por `t()` ou `m()` o que aparece na tela. Seletor e nome de evento traduzidos quebram a tela.

Sem `ANTHROPIC_API_KEY` no ambiente, nada é traduzido e a ferramenta aparece em português. Enquanto mais da metade do catálogo de um idioma não estiver traduzida, o `<html lang>` e a direção ficam em português, para o leitor de tela pronunciar certo.

Vão para a API só os textos da interface e os textos do estudo. Nenhuma resposta, nome, e-mail ou dado demográfico vai junto, como diz a política de privacidade.

## Fora do escopo

- O painel de resultados não separa por idioma. Para comparar idiomas, use a coluna `idioma` das exportações.
- Os documentos da aba Documentação ficam em português.
