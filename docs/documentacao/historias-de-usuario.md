# Histórias de usuário

38 histórias, escritas a partir das [personas](personas.md). Cada uma segue o formato *Como … quero … para …*, tem critérios de aceitação no formato *Dado que … então …* e aponta os [requisitos](requisitos.md) que a atendem.

A mesma lista está na aba Histórias de [planilha-requisitos.xlsx](planilha-requisitos.xlsx) e em [historias-de-usuario.csv](historias-de-usuario.csv).

## Visão geral

| ID | Épico | Persona | História | Prioridade | Sprint | Status |
|---|---|---|---|---|---|---|
| [HU01](#hu01) | Conta | Marina | Quero criar minha conta só com nome, e-mail e senha, sabendo as regras da senha antes de digitar | Alta | S03 | Entregue |
| [HU02](#hu02) | Conta | Marina | Quero entrar e voltar para a página que eu tinha aberto | Alta | S03 | Entregue |
| [HU03](#hu03) | Conta | Ricardo | Quero trocar minha senha e derrubar as sessões abertas em outros computadores | Média | S03 | Entregue |
| [HU04](#hu04) | Conta | Marina | Quero atualizar meus dados e, ao fim do mestrado, excluir a conta sabendo o que vai junto | Média | S03 | Entregue |
| [HU05](#hu05) | Estudos | Marina | Quero criar um estudo com uma ou mais versões do produto, vendo o termo que o participante vai ler | Alta | S04 | Entregue |
| [HU06](#hu06) | Estudos | Marina | Quero ver todos os meus estudos numa tabela com status, versões e respostas | Alta | S04 | Entregue |
| [HU07](#hu07) | Estudos | Marina | Quero editar o estudo depois de criado sem correr o risco de perder respostas | Alta | S04 | Entregue |
| [HU08](#hu08) | Estudos | Marina | Quero abrir, encerrar e reabrir a coleta, vendo sempre em que estado o estudo está | Alta | S04 | Entregue |
| [HU09](#hu09) | Estudos | Marina | Quero copiar o link do estudo com um clique | Alta | S04 | Entregue |
| [HU10](#hu10) | Estudos | Ricardo | Quero excluir um estudo de teste sem risco de apagar o estudo errado | Alta | S04 | Entregue |
| [HU11](#hu11) | Participação | Célia | Quero entender do que se trata, quanto tempo leva e que posso desistir, antes de concordar | Alta | S05 | Entregue |
| [HU12](#hu12) | Participação | Célia | Quero marcar cada item com o polegar sem errar o círculo | Alta | S05 | Entregue |
| [HU13](#hu13) | Participação | Célia | Quero saber em que etapa estou e quantos itens faltam | Média | S05 | Entregue |
| [HU14](#hu14) | Participação | Célia | Quero ser avisada de que esqueci um item e chegar direto nele | Alta | S05 | Entregue |
| [HU15](#hu15) | Participação | Célia | Quero não perder o que já marquei se a página recarregar | Média | S05 | Entregue |
| [HU16](#hu16) | Participação | Célia | Quero desistir no meio sem deixar nada gravado | Alta | S05 | Entregue |
| [HU17](#hu17) | Participação | Célia | Quero responder os dados sobre mim só se quiser | Média | S05 | Entregue |
| [HU18](#hu18) | Participação | Tiago | Quero ouvir o item e, em cada círculo, a posição e o polo mais próximo | Alta | S05 | Entregue |
| [HU19](#hu19) | Idiomas | Amira | Quero responder o questionário no meu idioma, da direita para a esquerda | Média | SID | Entregue |
| [HU20](#hu20) | Participação | Marina | Quero que cada versão receba um número parecido de participantes | Alta | S05 | Entregue |
| [HU21](#hu21) | Participação | Marina | Quero que a mesma pessoa não envie duas vezes sem querer e que não fiquem respostas pela metade | Média | S05 | Entregue |
| [HU22](#hu22) | Resultados | Marina | Quero ler o resultado em frases e ver a interpretação ao lado de cada número | Alta | S02, S06 | Entregue |
| [HU23](#hu23) | Resultados | Ricardo | Quero comparar as versões do produto no mesmo gráfico | Média | S06 | Entregue |
| [HU24](#hu24) | Resultados | Marina | Quero ver a média de cada um dos 26 itens | Média | S02, S06 | Entregue |
| [HU25](#hu25) | Resultados | Ricardo | Quero abrir o mesmo recorte do painel que minha orientanda está vendo | Baixa | S06 | Entregue |
| [HU26](#hu26) | Respostas | Marina | Quero ver quais respostas parecem descuidadas e tirá-las da análise sem apagá-las | Alta | S02, S07 | Entregue |
| [HU27](#hu27) | Exportação | Ricardo | Quero exportar as respostas no formato da planilha oficial | Alta | S08 | Parcial |
| [HU28](#hu28) | Exportação | Marina | Quero baixar as respostas e os resultados em CSV | Alta | S08, SID | Entregue |
| [HU29](#hu29) | Exportação | Marina | Quero baixar o painel em PDF | Baixa | S10 | Entregue |
| [HU30](#hu30) | Importação | Ricardo | Quero trazer respostas coletadas em papel ou em outra ferramenta | Baixa | S10 | Entregue |
| [HU31](#hu31) | Respostas | Marina | Quero saber em que idioma cada pessoa respondeu | Média | SID | Entregue |
| [HU32](#hu32) | Projeto aberto | Lucas | Quero rodar a ferramenta no meu computador com poucos comandos | Alta | S00 | Entregue |
| [HU33](#hu33) | Projeto aberto | Lucas | Quero ajustar os limiares de suspeita sem mexer no código e recalcular as participações | Baixa | S07 | Entregue |
| [HU34](#hu34) | Projeto aberto | Lucas | Quero provar que o cálculo bate com a planilha oficial | Alta | S01, S02 | Parcial |
| [HU35](#hu35) | Instrumento | Ricardo | Quero aplicar o UEQ-S, de 8 itens | Baixa | S10 | Parcial |
| [HU36](#hu36) | Participação | Célia | Quero enxergar bem os termos, os círculos e o foco, inclusive com o alto contraste do celular ou do Windows ligado | Alta | S05 | Entregue |
| [HU37](#hu37) | Documentação | Marina | Quero consultar a documentação sem sair da ferramenta, com uma explicação curta de cada documento | Média | SDOC | Entregue |
| [HU38](#hu38) | Projeto aberto | Lucas | Quero ver a arquitetura e os diagramas na própria ferramenta que estou rodando | Baixa | SDOC | Entregue |

## Conta

### HU01

> Como **pesquisadora**, quero **criar minha conta só com nome, e-mail e senha, sabendo as regras da senha antes de digitar**, para **começar a montar meus estudos sem depender de ninguém**.

Persona: [Marina (pesquisadora, mestranda em IHC)](personas.md#pe01) · Prioridade: Alta · Sprint: S03 · Status: Entregue

Critérios de aceitação:

- Dado que preencho nome, e-mail e uma senha de 8 caracteres, quando envio, então entro direto em Seus estudos.
- Dado que o e-mail já tem conta, quando envio, então vejo "Esse e-mail já tem conta. Entre por aqui." no resumo e abaixo do campo.
- Consigo fazer tudo só com teclado e colar a senha do gerenciador.

Requisitos: [RF01](requisitos.md#rf01), [RNF14](requisitos.md#rnf14), [RNF13](requisitos.md#rnf13)

### HU02

> Como **pesquisadora**, quero **entrar e voltar para a página que eu tinha aberto**, para **não perder o caminho quando a sessão expira**.

Persona: [Marina (pesquisadora, mestranda em IHC)](personas.md#pe01) · Prioridade: Alta · Sprint: S03 · Status: Entregue

Critérios de aceitação:

- Dado que abro um link do painel sem sessão, quando entro, então volto para o mesmo painel.
- Dado que clico em Sair, quando tento abrir um estudo, então sou levada para Entrar.

Requisitos: [RF02](requisitos.md#rf02), [RF03](requisitos.md#rf03), [RF04](requisitos.md#rf04), [RNF10](requisitos.md#rnf10)

### HU03

> Como **pesquisador que usa computadores do laboratório**, quero **trocar minha senha e derrubar as sessões abertas em outros computadores**, para **manter os dados da pesquisa protegidos**.

Persona: [Ricardo (pesquisador experiente, orientador)](personas.md#pe02) · Prioridade: Média · Sprint: S03 · Status: Entregue

Critérios de aceitação:

- Dado que troco a senha informando a atual, então vejo "Senha trocada." e os outros navegadores perdem a sessão.

Requisitos: [RF06](requisitos.md#rf06), [RNF10](requisitos.md#rnf10)

### HU04

> Como **pesquisadora**, quero **atualizar meus dados e, ao fim do mestrado, excluir a conta sabendo o que vai junto**, para **ter controle sobre os dados que deixo na ferramenta**.

Persona: [Marina (pesquisadora, mestranda em IHC)](personas.md#pe01) · Prioridade: Média · Sprint: S03 · Status: Entregue

Critérios de aceitação:

- Dado que mudo meu e-mail para um que já é de outra conta, então vejo "Esse e-mail já é de outra conta."
- Dado que peço para excluir a conta, então vejo quantos estudos e respostas serão apagados e preciso digitar meu e-mail.
- A ficha lateral mostra quantos estudos e respostas tenho.

Requisitos: [RF05](requisitos.md#rf05), [RF07](requisitos.md#rf07), [RF08](requisitos.md#rf08)

## Estudos

### HU05

> Como **pesquisadora**, quero **criar um estudo com uma ou mais versões do produto, vendo o termo que o participante vai ler**, para **montar o estudo certo na primeira vez**.

Persona: [Marina (pesquisadora, mestranda em IHC)](personas.md#pe01) · Prioridade: Alta · Sprint: S04 · Status: Entregue

Critérios de aceitação:

- Dado que digito o produto, então ele aparece como nome da primeira versão.
- Dado que deixo campos em branco ou a data de fim antes da de início, quando salvo, então o resumo de erros leva a cada campo.
- A prévia ao lado mostra o termo de consentimento com o título e o objetivo que escrevi.
- Botões, campos e mensagens têm o mesmo jeito em todas as telas.

Requisitos: [RF10](requisitos.md#rf10), [RF11](requisitos.md#rf11), [RNF13](requisitos.md#rnf13), [RNF19](requisitos.md#rnf19)

### HU06

> Como **pesquisadora**, quero **ver todos os meus estudos numa tabela com status, versões e respostas**, para **saber de relance como anda cada coleta**.

Persona: [Marina (pesquisadora, mestranda em IHC)](personas.md#pe01) · Prioridade: Alta · Sprint: S04 · Status: Entregue

Critérios de aceitação:

- A tabela mostra título, produto, status, versões, respostas e última resposta, do mais recente para o mais antigo.
- Sem estudos, vejo o estado vazio com o caminho para criar o primeiro.
- Só vejo os meus estudos: o endereço de um estudo de outra pessoa responde como se ele não existisse.
- A barra superior continua à vista enquanto rolo a página, no computador e no celular.

Requisitos: [RF09](requisitos.md#rf09), [RNF11](requisitos.md#rnf11), [RNF24](requisitos.md#rnf24)

### HU07

> Como **pesquisadora**, quero **editar o estudo depois de criado sem correr o risco de perder respostas**, para **corrigir um texto ou acrescentar uma versão no meio da coleta**.

Persona: [Marina (pesquisadora, mestranda em IHC)](personas.md#pe01) · Prioridade: Alta · Sprint: S04 · Status: Entregue

Critérios de aceitação:

- Dado que uma versão já tem respostas, então não aparece o botão de removê-la e o servidor recusa a remoção.

Requisitos: [RF12](requisitos.md#rf12)

### HU08

> Como **pesquisadora**, quero **abrir, encerrar e reabrir a coleta, vendo sempre em que estado o estudo está**, para **controlar quando o link aceita respostas**.

Persona: [Marina (pesquisadora, mestranda em IHC)](personas.md#pe01) · Prioridade: Alta · Sprint: S04 · Status: Entregue

Critérios de aceitação:

- Dado que abro a coleta, então vejo "Coleta aberta. O link já aceita respostas."
- Dado que encerro a coleta, então o link mostra que a coleta foi encerrada, e posso reabrir sem confirmação porque é reversível.

Requisitos: [RF14](requisitos.md#rf14), [RF16](requisitos.md#rf16)

### HU09

> Como **pesquisadora**, quero **copiar o link do estudo com um clique**, para **mandar pelo WhatsApp ou por e-mail aos participantes**.

Persona: [Marina (pesquisadora, mestranda em IHC)](personas.md#pe01) · Prioridade: Alta · Sprint: S04 · Status: Entregue

Critérios de aceitação:

- Dado que clico em "Copiar link", então o link vai para a área de transferência e ouço "Link copiado".

Requisitos: [RF13](requisitos.md#rf13)

### HU10

> Como **pesquisador**, quero **excluir um estudo de teste sem risco de apagar o estudo errado**, para **manter a lista limpa sem perder dados de verdade**.

Persona: [Ricardo (pesquisador experiente, orientador)](personas.md#pe02) · Prioridade: Alta · Sprint: S04 · Status: Entregue

Critérios de aceitação:

- Dado que peço para excluir, então vejo quantas respostas vão junto e preciso digitar o título.
- Dado que digito outro texto, então nada é apagado e a tela diz isso.

Requisitos: [RF15](requisitos.md#rf15), [RNF13](requisitos.md#rnf13)

## Participação

### HU11

> Como **participante**, quero **entender do que se trata, quanto tempo leva e que posso desistir, antes de concordar**, para **decidir participar com segurança**.

Persona: [Célia (participante pelo celular)](personas.md#pe03) · Prioridade: Alta · Sprint: S05 · Status: Entregue

Critérios de aceitação:

- O termo mostra título, objetivo, 3 a 5 minutos, participação voluntária e anônima e que nenhum dado de identificação é coletado.
- Dado que clico em "Não quero participar", então saio sem nada gravado.

Requisitos: [RF17](requisitos.md#rf17), [RNF09](requisitos.md#rnf09)

### HU12

> Como **participante pelo celular**, quero **marcar cada item com o polegar sem errar o círculo**, para **responder rápido no ônibus**.

Persona: [Célia (participante pelo celular)](personas.md#pe03) · Prioridade: Alta · Sprint: S05 · Status: Entregue

Critérios de aceitação:

- Cada círculo tem área de toque de 44×44 px e os termos ficam acima dos círculos.
- Em 320 px nada rola na horizontal.
- Nenhum círculo vem marcado e todos têm a mesma aparência.

Requisitos: [RF19](requisitos.md#rf19), [RNF03](requisitos.md#rnf03), [RNF06](requisitos.md#rnf06)

### HU13

> Como **participante**, quero **saber em que etapa estou e quantos itens faltam**, para **não desistir por achar que não acaba**.

Persona: [Célia (participante pelo celular)](personas.md#pe03) · Prioridade: Média · Sprint: S05 · Status: Entregue

Critérios de aceitação:

- As etapas aparecem em texto no topo.
- O rodapé mostra "N de 26 respondidos" e nunca cobre o item em que estou.

Requisitos: [RF20](requisitos.md#rf20)

### HU14

> Como **participante**, quero **ser avisada de que esqueci um item e chegar direto nele**, para **terminar sem precisar procurar**.

Persona: [Célia (participante pelo celular)](personas.md#pe03) · Prioridade: Alta · Sprint: S05 · Status: Entregue

Critérios de aceitação:

- Dado que envio com itens em branco, então o resumo diz quantos faltam, recebe o foco e cada link leva ao item.
- O item faltando tem borda e o texto "Este item não foi respondido".

Requisitos: [RF21](requisitos.md#rf21), [RNF13](requisitos.md#rnf13)

### HU15

> Como **participante**, quero **não perder o que já marquei se a página recarregar**, para **não ter que começar de novo**.

Persona: [Célia (participante pelo celular)](personas.md#pe03) · Prioridade: Média · Sprint: S05 · Status: Entregue

Critérios de aceitação:

- Dado que recarrego a página, então os itens marcados continuam marcados e vejo um aviso de que foram recuperados.

Requisitos: [RF23](requisitos.md#rf23)

### HU16

> Como **participante**, quero **desistir no meio sem deixar nada gravado**, para **participar sem me sentir presa**.

Persona: [Célia (participante pelo celular)](personas.md#pe03) · Prioridade: Alta · Sprint: S05 · Status: Entregue

Critérios de aceitação:

- Dado que clico em "Sair sem enviar" e confirmo, então nenhuma resposta minha fica guardada.

Requisitos: [RF24](requisitos.md#rf24), [RNF09](requisitos.md#rnf09)

### HU17

> Como **participante**, quero **responder os dados sobre mim só se quiser**, para **não expor o que não quero**.

Persona: [Célia (participante pelo celular)](personas.md#pe03) · Prioridade: Média · Sprint: S05 · Status: Entregue

Critérios de aceitação:

- Toda pergunta tem "Prefiro não responder".
- "Pular esta etapa" tem o mesmo peso de "Continuar".
- No fim vejo que minhas respostas foram registradas e que posso fechar a página.

Requisitos: [RF25](requisitos.md#rf25), [RF27](requisitos.md#rf27), [RNF09](requisitos.md#rnf09)

### HU18

> Como **participante cego que usa NVDA**, quero **ouvir o item e, em cada círculo, a posição e o polo mais próximo**, para **responder com a mesma precisão de quem enxerga**.

Persona: [Tiago (participante com leitor de tela)](personas.md#pe04) · Prioridade: Alta · Sprint: S05 · Status: Entregue

Critérios de aceitação:

- Cada item é anunciado como grupo "Item N de 26" com os dois termos.
- Cada círculo é anunciado como "3 de 7, mais perto de ..." e o centro como "4 de 7, centro".
- O progresso é anunciado só a cada 5 itens e ao completar.

Requisitos: [RF19](requisitos.md#rf19), [RF20](requisitos.md#rf20), [RNF01](requisitos.md#rnf01), [RNF02](requisitos.md#rnf02)

### HU20

> Como **pesquisadora que compara duas versões**, quero **que cada versão receba um número parecido de participantes**, para **comparar as versões com amostras equilibradas**.

Persona: [Marina (pesquisadora, mestranda em IHC)](personas.md#pe01) · Prioridade: Alta · Sprint: S05 · Status: Entregue

Critérios de aceitação:

- Dado que a versão A tem mais respostas concluídas que a B, então o próximo participante vai para a B.

Requisitos: [RF18](requisitos.md#rf18)

### HU21

> Como **pesquisadora**, quero **que a mesma pessoa não envie duas vezes sem querer e que não fiquem respostas pela metade**, para **não distorcer a amostra**.

Persona: [Marina (pesquisadora, mestranda em IHC)](personas.md#pe01) · Prioridade: Média · Sprint: S05 · Status: Entregue

Critérios de aceitação:

- Dado que alguém já respondeu nesse navegador, então o link não aceita outro envio.
- As 26 respostas são gravadas juntas ou nenhuma é gravada.

Requisitos: [RF22](requisitos.md#rf22), [RF26](requisitos.md#rf26), [RNF12](requisitos.md#rnf12)

### HU36

> Como **participante com a visão cansada**, quero **enxergar bem os termos, os círculos e o foco, inclusive com o alto contraste do celular ou do Windows ligado**, para **não marcar o círculo errado**.

Persona: [Célia (participante pelo celular)](personas.md#pe03) · Prioridade: Alta · Sprint: S05 · Status: Entregue

Critérios de aceitação:

- O texto tem contraste de pelo menos 4,5:1 e a borda dos círculos e o foco, de pelo menos 3:1.
- Com o alto contraste do sistema ligado, os círculos e o foco continuam visíveis.
- Item faltando é marcado com borda e texto, não só com cor.

Requisitos: [RF19](requisitos.md#rf19), [RNF04](requisitos.md#rnf04), [RNF05](requisitos.md#rnf05), [RNF20](requisitos.md#rnf20)

## Idiomas

### HU19

> Como **participante que lê em árabe**, quero **responder o questionário no meu idioma, da direita para a esquerda**, para **entender cada termo como ele foi validado**.

Persona: [Amira (participante que lê em árabe)](personas.md#pe05) · Prioridade: Média · Sprint: SID · Status: Entregue

Critérios de aceitação:

- Dado que meu navegador pede árabe, então o link já abre em árabe com a página da direita para a esquerda.
- A escala continua de 1 a 7 com o termo da esquerda à esquerda, como no PDF oficial.
- Vejo o aviso de que essa tradução ainda não foi aprovada pelos autores.

Requisitos: [RF28](requisitos.md#rf28), [RF29](requisitos.md#rf29), [RF30](requisitos.md#rf30), [RNF15](requisitos.md#rnf15)

## Resultados

### HU22

> Como **pesquisadora que não domina estatística**, quero **ler o resultado em frases e ver a interpretação ao lado de cada número**, para **entender o que o UEQ diz sem decorar limiares**.

Persona: [Marina (pesquisadora, mestranda em IHC)](personas.md#pe01) · Prioridade: Alta · Sprint: S02, S06 · Status: Entregue

Critérios de aceitação:

- A leitura rápida resume as escalas em texto.
- Cada escala mostra média, IC95, alfa, faixa (positiva, neutra, negativa) e faixa do benchmark.
- Benchmark, IC95 e alfa têm uma explicação curta que abro quando preciso.
- Com alfa abaixo de 0,7 ou amostra pequena, o aviso diz o que significa e o que fazer.

Requisitos: [RF33](requisitos.md#rf33), [RF34](requisitos.md#rf34), [RF37](requisitos.md#rf37), [RF40](requisitos.md#rf40)

### HU23

> Como **pesquisador**, quero **comparar as versões do produto no mesmo gráfico**, para **dizer qual versão foi melhor em cada escala**.

Persona: [Ricardo (pesquisador experiente, orientador)](personas.md#pe02) · Prioridade: Média · Sprint: S06 · Status: Entregue

Critérios de aceitação:

- No modo Comparar versões cada versão tem um marcador de forma diferente e legenda em texto.
- A leitura rápida aponta as maiores diferenças e a quem favorecem.

Requisitos: [RF39](requisitos.md#rf39), [RNF05](requisitos.md#rnf05)

### HU24

> Como **pesquisadora**, quero **ver a média de cada um dos 26 itens**, para **achar qual aspecto puxou a escala para baixo**.

Persona: [Marina (pesquisadora, mestranda em IHC)](personas.md#pe01) · Prioridade: Média · Sprint: S02, S06 · Status: Entregue

Critérios de aceitação:

- Posso ver os itens na ordem oficial ou agrupados por escala.
- Vejo também as médias de qualidade pragmática e hedônica.

Requisitos: [RF35](requisitos.md#rf35), [RF38](requisitos.md#rf38)

### HU25

> Como **orientador**, quero **abrir o mesmo recorte do painel que minha orientanda está vendo**, para **discutir o resultado sem refazer filtros**.

Persona: [Ricardo (pesquisador experiente, orientador)](personas.md#pe02) · Prioridade: Baixa · Sprint: S06 · Status: Entregue

Critérios de aceitação:

- Versão, modo e ordem dos itens estão na URL; abrir o endereço mostra a mesma visão.

Requisitos: [RF41](requisitos.md#rf41)

## Respostas

### HU26

> Como **pesquisadora**, quero **ver quais respostas parecem descuidadas e tirá-las da análise sem apagá-las**, para **ter um resultado limpo e poder voltar atrás**.

Persona: [Marina (pesquisadora, mestranda em IHC)](personas.md#pe01) · Prioridade: Alta · Sprint: S02, S07 · Status: Entregue

Critérios de aceitação:

- Vejo o motivo de cada suspeita e a amplitude por escala.
- Posso tirar todas as suspeitas de uma vez ou uma a uma, e devolver depois.
- O painel mostra quantas participações estão fora da análise.

Requisitos: [RF36](requisitos.md#rf36), [RF42](requisitos.md#rf42), [RF43](requisitos.md#rf43)

### HU31

> Como **pesquisadora com participantes de vários países**, quero **saber em que idioma cada pessoa respondeu**, para **separar os idiomas na análise quando precisar**.

Persona: [Marina (pesquisadora, mestranda em IHC)](personas.md#pe01) · Prioridade: Média · Sprint: SID · Status: Entregue

Critérios de aceitação:

- A tabela de respostas e as exportações trazem o idioma e se a tradução é aprovada.

Requisitos: [RF30](requisitos.md#rf30), [RF31](requisitos.md#rf31)

## Exportação

### HU27

> Como **pesquisador**, quero **exportar as respostas no formato da planilha oficial**, para **conferir na UEQ Data Analysis Tool que os números da ferramenta estão certos**.

Persona: [Ricardo (pesquisador experiente, orientador)](personas.md#pe02) · Prioridade: Alta · Sprint: S08 · Status: Parcial

Critérios de aceitação:

- O arquivo cola direto em Data!A4 da planilha oficial.
- Só saem as participações que estão na análise.

Requisitos: [RF48](requisitos.md#rf48), [RNF07](requisitos.md#rnf07)

### HU28

> Como **pesquisadora**, quero **baixar as respostas e os resultados em CSV**, para **analisar no Excel ou no R e montar as tabelas da dissertação**.

Persona: [Marina (pesquisadora, mestranda em IHC)](personas.md#pe01) · Prioridade: Alta · Sprint: S08, SID · Status: Entregue

Critérios de aceitação:

- Os quatro arquivos dizem para que servem, têm nome datado e abrem já separados no Excel em português.
- As respostas brutas trazem idioma, origem e se a participação está na análise.

Requisitos: [RF45](requisitos.md#rf45), [RF46](requisitos.md#rf46), [RF47](requisitos.md#rf47), [RF31](requisitos.md#rf31), [RNF21](requisitos.md#rnf21)

### HU29

> Como **pesquisadora**, quero **baixar o painel em PDF**, para **anexar ao relatório e mostrar na reunião**.

Persona: [Marina (pesquisadora, mestranda em IHC)](personas.md#pe01) · Prioridade: Baixa · Sprint: S10 · Status: Entregue

Critérios de aceitação:

- O PDF é A4, tem título, n e data de geração, e traz a mesma versão que estou vendo.

Requisitos: [RF49](requisitos.md#rf49)

## Importação

### HU30

> Como **pesquisador**, quero **trazer respostas coletadas em papel ou em outra ferramenta**, para **analisar tudo no mesmo painel**.

Persona: [Ricardo (pesquisador experiente, orientador)](personas.md#pe02) · Prioridade: Baixa · Sprint: S10 · Status: Entregue

Critérios de aceitação:

- Vejo a prévia das 5 primeiras linhas antes de confirmar.
- Se alguma linha tem erro, vejo o problema de cada uma e nada é importado.
- As respostas importadas aparecem marcadas como importadas.

Requisitos: [RF50](requisitos.md#rf50), [RNF22](requisitos.md#rnf22)

## Projeto aberto

### HU32

> Como **desenvolvedor**, quero **rodar a ferramenta no meu computador com poucos comandos**, para **testar uma mudança antes de propor**.

Persona: [Lucas (desenvolvedor que contribui com o projeto)](personas.md#pe06) · Prioridade: Alta · Sprint: S00 · Status: Entregue

Critérios de aceitação:

- Com Node 24, pnpm 10 e Docker, seis comandos sobem a ferramenta em http://localhost:3000.
- lint, typecheck e test dizem se minha mudança quebrou algo.

Requisitos: [RNF17](requisitos.md#rnf17), [RNF18](requisitos.md#rnf18), [RNF23](requisitos.md#rnf23)

### HU33

> Como **mantenedor**, quero **ajustar os limiares de suspeita sem mexer no código e recalcular as participações**, para **seguir uma nova versão do handbook**.

Persona: [Lucas (desenvolvedor que contribui com o projeto)](personas.md#pe06) · Prioridade: Baixa · Sprint: S07 · Status: Entregue

Critérios de aceitação:

- Os limiares ficam em data/protocolo.json com a fonte.
- pnpm suspeitas:recalcular reavalia todas as participações concluídas.

Requisitos: [RF44](requisitos.md#rf44), [RNF08](requisitos.md#rnf08)

### HU34

> Como **contribuidor**, quero **provar que o cálculo bate com a planilha oficial**, para **confiar no resultado e não introduzir erro numérico**.

Persona: [Lucas (desenvolvedor que contribui com o projeto)](personas.md#pe06) · Prioridade: Alta · Sprint: S01, S02 · Status: Parcial

Critérios de aceitação:

- O módulo src/ueq tem testes de unidade para cada função e as bordas.
- Com os esperado.json preenchidos, cada fixture confere com tolerância de 1e-6.

Requisitos: [RF32](requisitos.md#rf32), [RF33](requisitos.md#rf33), [RNF07](requisitos.md#rnf07), [RNF16](requisitos.md#rnf16)

### HU38

> Como **contribuidor**, quero **ver a arquitetura e os diagramas na própria ferramenta que estou rodando**, para **entender onde mexer sem procurar no repositório**.

Persona: [Lucas (desenvolvedor que contribui com o projeto)](personas.md#pe06) · Prioridade: Baixa · Sprint: SDOC · Status: Entregue

Critérios de aceitação:

- Os diagramas aparecem desenhados, com legenda, link para tamanho real e o código Mermaid ao lado.
- Se mudo um diagrama e esqueço de gerar o SVG, um teste falha e diz para rodar pnpm docs:diagramas.

Requisitos: [RF52](requisitos.md#rf52), [RNF23](requisitos.md#rnf23)

## Instrumento

### HU35

> Como **pesquisador com pouco tempo de coleta**, quero **aplicar o UEQ-S, de 8 itens**, para **reduzir o tempo de resposta em estudos longos**.

Persona: [Ricardo (pesquisador experiente, orientador)](personas.md#pe02) · Prioridade: Baixa · Sprint: S10 · Status: Parcial

Critérios de aceitação:

- Escolho UEQ ou UEQ-S ao criar o estudo, e a escolha trava depois da primeira resposta.
- Situação atual: aguardando a equipe preencher os itens e o benchmark oficiais do UEQ-S.

Requisitos: [RF51](requisitos.md#rf51)

## Documentação

### HU37

> Como **pesquisadora**, quero **consultar a documentação sem sair da ferramenta, com uma explicação curta de cada documento**, para **entender como o cálculo e o painel funcionam antes de defender meus resultados**.

Persona: [Marina (pesquisadora, mestranda em IHC)](personas.md#pe01) · Prioridade: Média · Sprint: SDOC · Status: Entregue

Critérios de aceitação:

- Dado que abro /documentacao, com ou sem conta, então vejo a visão geral e as seções em abas; pela barra superior também chego lá.
- Cada documento tem uma ficha que diz o que é, para que serve e quem deve ler.
- Um link para outro documento ou para um requisito abre dentro da ferramenta, no lugar certo da página.
- Posso baixar a planilha de requisitos e os CSV pela ficha.
- Clicando num diagrama, ele abre em tela cheia com zoom e posso arrastar para ver um detalhe; Voltar ou Esc fecham.

Requisitos: [RF52](requisitos.md#rf52), [RNF01](requisitos.md#rnf01), [RNF03](requisitos.md#rnf03)
