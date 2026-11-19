# Diagrama de classes

Dois diagramas descrevem a estrutura estática da Ferramenta UEQ:

1. **Modelo de domínio:** as 11 entidades guardadas no PostgreSQL e os 7 tipos enumerados, como estão em [`prisma/schema.prisma`](../../prisma/schema.prisma).
2. **Módulo de cálculo:** os tipos e as funções de [`src/ueq/`](../../src/ueq/), que transformam respostas em resultados sem tocar no banco.

Os nomes são os do código, sem acento, como em `Versao` e `Participacao`. Os tipos seguem o TypeScript: `?` marca campo que pode ser vazio e `[]` marca lista. As tabelas, colunas, chaves e regras de exclusão do banco, campo a campo, estão no [modelo lógico](modelo-logico.md); este documento mostra as mesmas entidades como classes, com as associações e a multiplicidade de cada uma.

Logo abaixo de cada diagrama estão a ferramenta usada, o arquivo-fonte para baixar e a versão da ferramenta que ele representa.

## 1. Modelo de domínio

```mermaid
classDiagram
    direction LR

    class Pesquisador {
        +String id
        +String nome
        +String email «unique»
        +String senhaHash «bcrypt»
        +DateTime criadoEm
        +Boolean administrador
        +DateTime? tutorialVistoEm
        +Boolean notificacoesPorEmail
        +String idioma
    }

    class Sessao {
        +String id «SHA-256 of the token»
        +DateTime criadaEm
        +DateTime expiraEm
    }

    class Estudo {
        +String id
        +String titulo
        +String produtoAvaliado
        +String objetivo
        +StatusEstudo status
        +Date dataInicio
        +Date dataFim
        +String slugPublico «unique»
        +Boolean coletarDemografia
        +String idioma
        +String responsavelNome
        +String responsavelEmail
        +String instituicao
        +String riscos
        +String beneficios
        +String? comiteEtica
        +DateTime criadoEm
        +DateTime atualizadoEm
    }

    class Colaboracao {
        +String id
        +PapelColaborador papel
        +StatusConvite status
        +DateTime criadoEm
        +DateTime? respondidoEm
    }

    class Versao {
        +String id
        +String nome
        +Int ordem «unique within the study»
    }

    class Participacao {
        +String id
        +DateTime consentiuEm
        +DateTime criadaEm
        +DateTime? concluidaEm
        +Json? demografia «encrypted»
        +Boolean suspeita
        +Boolean incluidaNaAnalise
        +String? idioma
        +OrigemParticipacao origem
        +Boolean menorDeIdade
    }

    class Resposta {
        +String id
        +Int valor «1 to 7»
    }

    class Item {
        +Int id
        +Int numero «1 to 26, unique»
        +String termoEsquerdo
        +String termoDireito
        +Escala escala
        +Polaridade polaridade
    }

    class Notificacao {
        +String id
        +TipoNotificacao tipo
        +String texto
        +String link
        +Int quantidade
        +DateTime criadaEm
        +DateTime? lidaEm
    }

    class TentativaAcesso {
        +String id
        +String chave «email hash»
        +DateTime criadaEm
    }

    class Traducao {
        +String id
        +String idioma
        +String hashOrigem
        +String texto
        +DateTime criadaEm
    }

    class StatusEstudo {
        <<enumeration>>
        RASCUNHO
        ABERTO
        ENCERRADO
    }
    class Escala {
        <<enumeration>>
        ATRATIVIDADE
        PERSPICUIDADE
        EFICIENCIA
        CONFIABILIDADE
        ESTIMULACAO
        NOVIDADE
    }
    class Polaridade {
        <<enumeration>>
        POSITIVA_DIREITA
        POSITIVA_ESQUERDA
    }
    class OrigemParticipacao {
        <<enumeration>>
        LINK
        IMPORTADA
    }
    class PapelColaborador {
        <<enumeration>>
        EDITOR
        LEITOR
    }
    class StatusConvite {
        <<enumeration>>
        PENDENTE
        ACEITO
        RECUSADO
    }
    class TipoNotificacao {
        <<enumeration>>
        CONVITE
        RESPOSTA
        ALTERACAO
    }

    Pesquisador "1" *-- "0..*" Sessao : opens
    Pesquisador "1" *-- "0..*" Estudo : owns
    Estudo "1" *-- "1..6" Versao : compares
    Versao "1" *-- "0..*" Participacao : receives
    Participacao "1" *-- "0..26" Resposta : contains
    Item "1" <-- "0..*" Resposta : answers
    Estudo "1" *-- "0..*" Colaboracao : is shared in
    Pesquisador "1" *-- "0..*" Colaboracao : takes part as
    Pesquisador "0..1" o-- "0..*" Colaboracao : invited
    Pesquisador "1" *-- "0..*" Notificacao : receives
    Pesquisador "0..1" o-- "0..*" Notificacao : caused
    Estudo "0..1" o-- "0..*" Notificacao : originates

    Estudo ..> StatusEstudo
    Item ..> Escala
    Item ..> Polaridade
    Participacao ..> OrigemParticipacao
    Colaboracao ..> PapelColaborador
    Colaboracao ..> StatusConvite
    Notificacao ..> TipoNotificacao
```

**Ferramenta do diagrama:** Mermaid 12.2.0 (`classDiagram`), gerado por `pnpm docs:diagramas`. **Arquivo-fonte:** [diagrama-de-classes-1.mmd](fontes/diagrama-de-classes-1.mmd). **Versão representada:** Ferramenta UEQ de 17/11/2026.

### Leitura

- **Composição (losango cheio)** é exclusão em cascata no banco. Apagar o pesquisador apaga as sessões, os estudos dele, as colaborações em que ele entrou e as notificações que ele recebeu ([RF06](requisitos.md#rf06)). Apagar o estudo apaga versões, participações, respostas e colaborações ([RF17](requisitos.md#rf17)).
- **Agregação (losango vazio)** é uma referência que fica vazia quando o outro lado é apagado: se quem convidou exclui a conta, a colaboração continua, sem o nome de quem convidou; se o estudo ou o autor de uma notificação some, a notificação continua no sino de quem a recebeu.
- **Item** não pertence a ninguém: os 26 itens são carregados pelo seed a partir do pacote oficial ([RNF10](requisitos.md#rnf10)) e compartilhados por todos os estudos. Uma resposta aponta para o item; apagar a resposta não apaga o item.
- **Versao** tem de 1 a 6 por estudo. A ordem é única no estudo e define a ordem na tela e o desempate da distribuição dos participantes ([RF26](requisitos.md#rf26)).
- **Participacao** nasce no consentimento, sem respostas, e só ganha as 26 respostas e `concluidaEm` no envio ([RF25](requisitos.md#rf25), [RF33](requisitos.md#rf33)). Por isso a multiplicidade é 0..26: zero enquanto está em andamento, 26 depois de concluída. A que não é concluída em 2 dias é apagada ([RNF13](requisitos.md#rnf13)).
- **Resposta** guarda o valor bruto de 1 (polo esquerdo) a 7 (polo direito), com `CHECK` no banco e unicidade por participação e item. A recodificação para -3 a +3 acontece no cálculo, nunca no banco.
- **Participacao.idioma** é o código do idioma (`pt`, `es`, `ar`…); fica vazio nas importadas, porque o CSV não diz o idioma ([RF61](requisitos.md#rf61)). **Participacao.demografia** guarda as quatro faixas opcionais, cifradas com AES-256-GCM quando a chave está configurada ([RNF14](requisitos.md#rnf14)). **Participacao.menorDeIdade** registra que a pessoa confirmou a autorização do responsável ([RF25](requisitos.md#rf25)).
- **Colaboracao** liga um estudo a outra conta, como Editor ou Leitor. Há no máximo uma por estudo e pessoa, e o estudo só aparece para a pessoa convidada depois de ACEITO ([RF20](requisitos.md#rf20), [RF21](requisitos.md#rf21)).
- **Notificacao** é o que o sino mostra. As de tipo RESPOSTA somam em `quantidade` enquanto não são lidas ([RF22](requisitos.md#rf22)).
- **TentativaAcesso** e **Traducao** não se ligam a nenhuma outra entidade. A primeira guarda só o hash do e-mail de cada login que falhou ([RNF16](requisitos.md#rnf16)); a segunda guarda cada texto já traduzido pela API, pelo hash do original e pelo idioma ([RF08](requisitos.md#rf08), [RF35](requisitos.md#rf35)).
- **Sessao.id** é o hash SHA-256 do token do cookie: quem lê o banco não consegue montar um cookie válido ([RNF15](requisitos.md#rnf15)).
- Nada no modelo identifica o participante: não há nome, e-mail, IP nem user-agent ([RNF12](requisitos.md#rnf12)).

## 2. Módulo de cálculo

O módulo [`src/ueq/`](../../src/ueq/) é feito de funções puras: não importa Prisma, React nem Next ([RNF25](requisitos.md#rnf25)). No diagrama, cada arquivo aparece como uma classe com o estereótipo «módulo» e as funções que exporta. Os tipos de entrada e saída aparecem como classes comuns.

```mermaid
classDiagram
    direction TB

    class index {
        <<module>>
        +analisarEstudo(participacoes, itens, config) AnaliseEstudo
    }
    class recodificar {
        <<module>>
        +recodificar(valor, polaridade) number
        +recodificarParticipante(valores, itens) number[]
    }
    class estatistica {
        <<module>>
        +media(valores) number?
        +desvioPadraoAmostral(valores) number?
        +intervaloConfianca95(media, dp, n, z) Intervalo?
        +correlacao(x, y) number?
        +alfaCronbach(colunas) number?
    }
    class escalas {
        <<module>>
        +escoresPorParticipante(valores, itens) Record~Escala, number~
        +faixaInterpretacao(media, faixaNeutra) FaixaInterpretacao
        +resultadoPorEscala(respostas, itens, parametros) ResultadoEscala[]
        +resultadoPorItem(respostas, itens, z) ResultadoItem[]
    }
    class inconsistencia {
        <<module>>
        +amplitudePorEscala(valores, itens) Record~Escala, number~
        +respostasIguais(valores) number
        +avaliarSuspeita(valores, itens, parametros) AvaliacaoSuspeita
        +marcarSuspeitos(respostas, itens, parametros) AvaliacaoSuspeita[]
    }
    class benchmark {
        <<module>>
        +classificarBenchmark(escala, media, tabela) FaixaBenchmark?
    }
    class itens {
        <<module>>
        +ESCALAS
        +GRUPOS
        +numerosPorEscala(itens) Record~Escala, number[]~
    }

    class ItemUEQ {
        +number numero
        +Escala escala
        +Polaridade polaridade
    }
    class ParticipacaoParaAnalise {
        +number[] valores
        +boolean incluidaNaAnalise
    }
    class ConfigAnalise {
        +protocolo
        +TabelaBenchmark benchmark
    }
    class ParametrosInconsistencia {
        +number amplitudeMaxima
        +number escalasParaSuspeita
        +number respostasIguaisMaximas
    }
    class AnaliseEstudo {
        +number n
        +number nExcluidas
        +ResultadoEscalaAnalisada[] escalas
        +grupos pragmatica and hedonica
        +ResultadoItem[] itens
        +AvaliacaoSuspeita[] participantes
    }
    class ResultadoEscala {
        +Escala escala
        +number n
        +number? media
        +number? dp
        +Intervalo? ic
        +number? alfa
        +FaixaInterpretacao? faixaInterpretacao
    }
    class ResultadoEscalaAnalisada {
        +FaixaBenchmark? benchmark
        +boolean alfaAbaixoDoMinimo
    }
    class ResultadoItem {
        +number numero
        +Escala escala
        +number n
        +number? media
        +number? dp
        +Intervalo? ic
        +number[] distribuicao
    }
    class AvaliacaoSuspeita {
        +Record~Escala, number~ amplitudes
        +Escala[] escalasInconsistentes
        +number respostasIguais
        +MotivoSuspeita[] motivos
        +boolean suspeita
    }
    class Intervalo {
        +number inferior
        +number superior
    }
    class LimitesBenchmark {
        +number excelente
        +number bom
        +number acimaDaMedia
        +number abaixoDaMedia
    }

    ResultadoEscala <|-- ResultadoEscalaAnalisada
    ConfigAnalise *-- ParametrosInconsistencia
    ConfigAnalise *-- "6" LimitesBenchmark
    AnaliseEstudo *-- "6" ResultadoEscalaAnalisada
    AnaliseEstudo *-- "26" ResultadoItem
    AnaliseEstudo *-- "0..*" AvaliacaoSuspeita
    ResultadoEscala o-- Intervalo
    ResultadoItem o-- Intervalo

    index ..> ParticipacaoParaAnalise : receives
    index ..> ItemUEQ : receives
    index ..> ConfigAnalise : receives
    index ..> AnaliseEstudo : returns
    index ..> escalas : uses
    index ..> inconsistencia : uses
    index ..> benchmark : uses
    index ..> itens : uses
    escalas ..> recodificar : uses
    escalas ..> estatistica : uses
    escalas ..> itens : uses
    inconsistencia ..> recodificar : uses
    inconsistencia ..> itens : uses
```

**Ferramenta do diagrama:** Mermaid 12.2.0 (`classDiagram`), gerado por `pnpm docs:diagramas`. **Arquivo-fonte:** [diagrama-de-classes-2.mmd](fontes/diagrama-de-classes-2.mmd). **Versão representada:** Ferramenta UEQ de 17/11/2026.

### Leitura

- **`analisarEstudo`** é a porta de entrada. Recebe as participações (26 valores de 1 a 7 e se estão na análise), os 26 itens e a configuração. Calcula as estatísticas só com as que estão na análise e avalia a suspeita de todas ([RF36](requisitos.md#rf36) a [RF42](requisitos.md#rf42), [RF51](requisitos.md#rf51)).
- **`ConfigAnalise`** tem o mesmo formato de [`data/protocolo.json`](../../data/protocolo.json) e de [`data/benchmark.json`](../../data/benchmark.json). Os limiares e as faixas não ficam no código: mudam por pull request, com a fonte de cada número.
- **Valores vazios** seguem a planilha oficial: sem n suficiente, com desvio-padrão zero ou com item que não varia, a função devolve `null` onde a planilha mostra `#NUM!` ou `#DIV/0!`.
- **`ResultadoEscalaAnalisada`** acrescenta ao resultado da escala a faixa do benchmark e a marca de alfa abaixo de 0,7.
- **`GRUPOS`** define a qualidade pragmática (Perspicuidade, Eficiência e Confiabilidade) e a hedônica (Estimulação e Novidade). Atratividade fica fora dos dois grupos ([RF39](requisitos.md#rf39)).
- **`avaliarSuspeita`** também é usada fora do painel: no envio do questionário, na importação, na página Respostas, no estudo de exemplo e no recálculo ([UC24](casos-de-uso.md#uc24)). `marcarSuspeitos` aplica a mesma avaliação a uma lista.

Cada fórmula foi refeita à mão, com os dados do estudo de exemplo, na [verificação do cálculo](verificacao-do-calculo.md).

### Quem usa o módulo

O módulo não sabe de onde vêm os dados. Quem busca no banco e chama o módulo:

| Arquivo | O que faz |
|---|---|
| `src/lib/resultados.ts` | Busca as participações concluídas, monta a entrada por versão e chama `analisarEstudo` para o painel, o PDF e a exportação de resultados |
| `src/lib/participacoes.ts` | Chama `avaliarSuspeita` para cada participação da página Respostas |
| `src/lib/exportacoes.ts` | Usa `recodificarParticipante` na exportação recodificada |
| `src/app/r/[slug]/acoes.ts` | Chama `avaliarSuspeita` no envio do questionário |
| `src/app/(ferramenta)/(pesquisador)/estudos/[id]/respostas/importar/acoes.ts` | Chama `avaliarSuspeita` em cada linha importada |
| `src/lib/cenarios/respostas-sinteticas.ts` | Chama `avaliarSuspeita` para conferir que as respostas de demonstração ficam coerentes com cada cenário |
| `prisma/recalcular-suspeitas.ts` | Chama `avaliarSuspeita` em todas as participações concluídas |
| `prisma/estudo-exemplo.ts` | Chama `avaliarSuspeita` ao gravar as respostas do estudo de exemplo |

O caminho completo, do banco à tela, está no [diagrama de sequência de resultados](diagramas-de-sequencia.md#3-ver-resultados).
