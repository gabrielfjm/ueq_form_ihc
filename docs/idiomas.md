# Idiomas do questionário

O link do participante funciona nos 37 idiomas do pacote oficial do UEQ. A ferramenta do pesquisador continua em português.

## Como o idioma é escolhido

- Ao abrir o link, vale o primeiro dos 37 idiomas que o navegador pede (`Accept-Language`). Se nenhum dos 37 aparece, vale o português.
- No consentimento há um seletor "Idioma" com o nome de cada idioma escrito nele mesmo. Escolher no seletor não muda nada sozinho: só o botão "Aplicar" muda (WCAG 3.2.2).
- A escolha fica num cookie (`ueq_idioma`, só em `/r/<slug>`) e vale para todas as etapas. Ao consentir, o código do idioma é gravado em `Participacao.idioma`.
- O `<html lang>` e o `dir` seguem o idioma (WCAG 3.1.1). Por isso o link do participante tem um layout raiz próprio (`src/app/r/[slug]/layout.tsx`), separado do da ferramenta (`src/app/(ferramenta)/layout.tsx`).
- Em árabe, hebraico e persa o texto vai da direita para a esquerda. A linha de círculos continua da esquerda para a direita, de 1 a 7, com o termo da esquerda à esquerda, como nos PDFs oficiais desses idiomas.

## O que vem de onde

| Conteúdo | Arquivo | Fonte |
|---|---|---|
| 26 pares de termos | `data/ueq-idiomas.json` | PDF oficial de cada idioma, conferido contra a imagem da página |
| Instrução antes dos itens | `data/ueq-instrucoes.json` | PDF oficial de cada idioma, sem o exemplo com círculo marcado (como em português) |
| Textos das telas (consentimento, botões, nomes acessíveis, erros, dados opcionais, fim) | `src/idiomas/textos/*.ts` | Tradução da equipe |

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

1. os textos de tela em `src/idiomas/textos/<código>.ts`, que são todos tradução da equipe;
2. as correções da tabela acima, quando o idioma tem alguma;
3. as instruções marcadas "Transcrito da imagem… Conferir com falante nativo" em `data/ueq-instrucoes.json`: árabe, híndi, marati, bengali, tâmil e canarês. Em bengali, os espaços entre as palavras foram postos pela equipe, porque o PDF não os tem.

As respostas de dados opcionais são gravadas sempre com a categoria em português (por exemplo, "25 a 34 anos"), em qualquer idioma. A análise e as exportações não mudam.

## Fora do escopo

O painel de resultados não separa por idioma. Para comparar idiomas, use a coluna `idioma` das exportações.
