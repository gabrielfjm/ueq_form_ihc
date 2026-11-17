# Histórias de usuário

**44 histórias** dizem o que cada [persona](personas.md) quer fazer com a Ferramenta UEQ e como saber que deu certo. 42 estão entregues e 2 estão pendentes. A mesma lista está em [historias-de-usuario.csv](historias-de-usuario.csv) e na [planilha de requisitos](planilha-requisitos.xlsx).

## Como ler

Cada história segue o formato **Como** (quem), **quero** (o quê), **para** (por quê), escrito do ponto de vista da persona. Os **critérios de aceitação** dizem o que tem de acontecer na ferramenta para a história ser dada como pronta: cada critério pode ser conferido na tela ou num caso de teste.

A história está **entregue** quando todos os requisitos que ela cita estão entregues. A ligação de cada requisito com as histórias, os casos de uso e os testes está na [matriz de rastreabilidade](matriz-rastreabilidade.md).

| ID | Persona | História | Requisitos | Status |
|---|---|---|---|---|
| [HU01](#hu01) | [PE01](personas.md#pe01) Marina | Criar conta e entrar | [RF01](requisitos.md#rf01), [RF02](requisitos.md#rf02), [RF11](requisitos.md#rf11) | Entregue |
| [HU02](#hu02) | [PE01](personas.md#pe01) Marina | Aprender a usar no primeiro acesso | [RF09](requisitos.md#rf09), [RF10](requisitos.md#rf10) | Entregue |
| [HU03](#hu03) | [PE01](personas.md#pe01) Marina | Criar um estudo com duas versões | [RF13](requisitos.md#rf13), [RF19](requisitos.md#rf19) | Entregue |
| [HU04](#hu04) | [PE01](personas.md#pe01) Marina | Informar quem responde pela pesquisa | [RF13](requisitos.md#rf13), [RF25](requisitos.md#rf25) | Entregue |
| [HU05](#hu05) | [PE01](personas.md#pe01) Marina | Decidir se coleto dados demográficos | [RF18](requisitos.md#rf18), [RNF13](requisitos.md#rnf13), [RNF14](requisitos.md#rnf14) | Entregue |
| [HU06](#hu06) | [PE01](personas.md#pe01) Marina | Abrir a coleta e mandar o link | [RF15](requisitos.md#rf15), [RF16](requisitos.md#rf16), [RNF20](requisitos.md#rnf20) | Entregue |
| [HU07](#hu07) | [PE01](personas.md#pe01) Marina | Acompanhar a coleta | [RF12](requisitos.md#rf12), [RF22](requisitos.md#rf22) | Entregue |
| [HU08](#hu08) | [PE01](personas.md#pe01) Marina | Entender o resultado sem ser estatística | [RF38](requisitos.md#rf38), [RF43](requisitos.md#rf43), [RF44](requisitos.md#rf44), [RF45](requisitos.md#rf45), [RF49](requisitos.md#rf49), [RNF07](requisitos.md#rnf07), [RNF08](requisitos.md#rnf08) | Entregue |
| [HU09](#hu09) | [PE01](personas.md#pe01) Marina | Ver que itens puxaram a escala | [RF41](requisitos.md#rf41), [RF46](requisitos.md#rf46) | Entregue |
| [HU10](#hu10) | [PE01](personas.md#pe01) Marina | Comparar as duas versões | [RF26](requisitos.md#rf26), [RF47](requisitos.md#rf47), [RF48](requisitos.md#rf48) | Entregue |
| [HU11](#hu11) | [PE01](personas.md#pe01) Marina | Levar os resultados para a dissertação | [RF58](requisitos.md#rf58), [RF60](requisitos.md#rf60), [RNF22](requisitos.md#rnf22) | Entregue |
| [HU12](#hu12) | [PE01](personas.md#pe01) Marina | Tirar respostas descuidadas da análise | [RF42](requisitos.md#rf42), [RF51](requisitos.md#rf51), [RF52](requisitos.md#rf52), [RF53](requisitos.md#rf53), [RF54](requisitos.md#rf54) | Entregue |
| [HU13](#hu13) | [PE01](personas.md#pe01) Marina | Ver o perfil de quem respondeu | [RF50](requisitos.md#rf50) | Entregue |
| [HU14](#hu14) | [PE01](personas.md#pe01) Marina | Encerrar e reabrir a coleta | [RF15](requisitos.md#rf15) | Entregue |
| [HU15](#hu15) | [PE01](personas.md#pe01) Marina | Corrigir o estudo depois de criado | [RF14](requisitos.md#rf14) | Entregue |
| [HU16](#hu16) | [PE01](personas.md#pe01) Marina | Excluir um estudo de teste | [RF17](requisitos.md#rf17), [RNF21](requisitos.md#rnf21) | Entregue |
| [HU17](#hu17) | [PE01](personas.md#pe01) Marina | Cuidar dos meus dados de conta | [RF04](requisitos.md#rf04), [RF06](requisitos.md#rf06), [RF07](requisitos.md#rf07), [RNF19](requisitos.md#rnf19) | Entregue |
| [HU18](#hu18) | [PE02](personas.md#pe02) Ricardo | Conferir os números na planilha oficial | [RF36](requisitos.md#rf36), [RF37](requisitos.md#rf37), [RF59](requisitos.md#rf59), [RNF09](requisitos.md#rnf09), [RNF11](requisitos.md#rnf11) | Pendente |
| [HU19](#hu19) | [PE02](personas.md#pe02) Ricardo | Juntar respostas coletadas em papel | [RF61](requisitos.md#rf61) | Entregue |
| [HU20](#hu20) | [PE02](personas.md#pe02) Ricardo | Acompanhar o estudo da orientanda | [RF20](requisitos.md#rf20), [RF21](requisitos.md#rf21), [RNF17](requisitos.md#rnf17) | Entregue |
| [HU21](#hu21) | [PE02](personas.md#pe02) Ricardo | Saber o que mudou nos estudos | [RF22](requisitos.md#rf22), [RF23](requisitos.md#rf23) | Entregue |
| [HU22](#hu22) | [PE02](personas.md#pe02) Ricardo | Proteger a conta num computador compartilhado | [RF03](requisitos.md#rf03), [RF05](requisitos.md#rf05), [RNF15](requisitos.md#rnf15), [RNF16](requisitos.md#rnf16), [RNF18](requisitos.md#rnf18) | Entregue |
| [HU23](#hu23) | [PE02](personas.md#pe02) Ricardo | Exportar as respostas para outra análise | [RF56](requisitos.md#rf56), [RF57](requisitos.md#rf57), [RNF22](requisitos.md#rnf22) | Entregue |
| [HU24](#hu24) | [PE02](personas.md#pe02) Ricardo | Saber a regra de cada número | [RF37](requisitos.md#rf37), [RF38](requisitos.md#rf38), [RF39](requisitos.md#rf39), [RF40](requisitos.md#rf40) | Entregue |
| [HU25](#hu25) | [PE02](personas.md#pe02) Ricardo | Aplicar a versão curta em eventos | [RF62](requisitos.md#rf62) | Pendente |
| [HU26](#hu26) | [PE03](personas.md#pe03) Kenji | Usar a ferramenta em japonês | [RF08](requisitos.md#rf08) | Entregue |
| [HU27](#hu27) | [PE03](personas.md#pe03) Kenji | Aplicar o estudo em japonês | [RF19](requisitos.md#rf19), [RF34](requisitos.md#rf34), [RF35](requisitos.md#rf35) | Entregue |
| [HU28](#hu28) | [PE04](personas.md#pe04) Célia | Entender o convite antes de aceitar | [RF25](requisitos.md#rf25), [RNF19](requisitos.md#rnf19) | Entregue |
| [HU29](#hu29) | [PE04](personas.md#pe04) Célia | Responder rápido pelo celular | [RF24](requisitos.md#rf24), [RF27](requisitos.md#rf27), [RF28](requisitos.md#rf28), [RNF02](requisitos.md#rnf02), [RNF05](requisitos.md#rnf05), [RNF06](requisitos.md#rnf06), [RNF23](requisitos.md#rnf23) | Entregue |
| [HU30](#hu30) | [PE04](personas.md#pe04) Célia | Saber o que esqueci | [RF29](requisitos.md#rf29) | Entregue |
| [HU31](#hu31) | [PE04](personas.md#pe04) Célia | Não perder o que marquei | [RF30](requisitos.md#rf30) | Entregue |
| [HU32](#hu32) | [PE04](personas.md#pe04) Célia | Desistir sem deixar rastro | [RF31](requisitos.md#rf31), [RNF21](requisitos.md#rnf21) | Entregue |
| [HU33](#hu33) | [PE04](personas.md#pe04) Célia | Pular as perguntas sobre mim | [RF32](requisitos.md#rf32), [RNF12](requisitos.md#rnf12) | Entregue |
| [HU34](#hu34) | [PE04](personas.md#pe04) Célia | Saber que acabou | [RF33](requisitos.md#rf33) | Entregue |
| [HU35](#hu35) | [PE05](personas.md#pe05) Tiago | Responder com leitor de tela | [RF27](requisitos.md#rf27), [RNF01](requisitos.md#rnf01), [RNF03](requisitos.md#rnf03), [RNF04](requisitos.md#rnf04) | Entregue |
| [HU36](#hu36) | [PE06](personas.md#pe06) Amira | Responder em árabe | [RF34](requisitos.md#rf34), [RNF10](requisitos.md#rnf10) | Entregue |
| [HU37](#hu37) | [PE07](personas.md#pe07) Bruna | Participar com autorização do responsável | [RF25](requisitos.md#rf25) | Entregue |
| [HU38](#hu38) | [PE08](personas.md#pe08) Lucas | Rodar a ferramenta localmente | [RNF24](requisitos.md#rnf24) | Entregue |
| [HU39](#hu39) | [PE08](personas.md#pe08) Lucas | Mudar um limiar e recalcular | [RF55](requisitos.md#rf55) | Entregue |
| [HU40](#hu40) | [PE08](personas.md#pe08) Lucas | Provar que o cálculo não quebrou | [RNF25](requisitos.md#rnf25), [RNF26](requisitos.md#rnf26) | Entregue |
| [HU41](#hu41) | [PE08](personas.md#pe08) Lucas | Administrar as contas do laboratório | [RF66](requisitos.md#rf66), [RNF17](requisitos.md#rnf17) | Entregue |
| [HU42](#hu42) | [PE08](personas.md#pe08) Lucas | Demonstrar a ferramenta sem dados reais | [RF67](requisitos.md#rf67) | Entregue |
| [HU43](#hu43) | [PE08](personas.md#pe08) Lucas | Conferir a proteção e as traduções | [RF68](requisitos.md#rf68), [RNF14](requisitos.md#rnf14) | Entregue |
| [HU44](#hu44) | [PE08](personas.md#pe08) Lucas | Ler a documentação sem conta | [RF63](requisitos.md#rf63), [RF64](requisitos.md#rf64), [RF65](requisitos.md#rf65) | Entregue |

## Pesquisadores

### HU01

**Criar conta e entrar**

Como **Marina**, pesquisadora ([PE01](personas.md#pe01)), **quero** criar uma conta e entrar sem ler manual, **para** começar a montar meu estudo no mesmo dia.

Critérios de aceitação:

1. As regras da senha aparecem antes de eu digitar.
2. Se um campo estiver errado, um resumo no topo diz qual é e leva até ele.
3. Entrar e Criar conta abrem numa janela sobre a página inicial, e Esc fecha devolvendo o foco.
4. Depois de entrar, volto para a página que eu tinha pedido.

Requisitos: [RF01](requisitos.md#rf01), [RF02](requisitos.md#rf02), [RF11](requisitos.md#rf11). Status: Entregue.

### HU02

**Aprender a usar no primeiro acesso**

Como **Marina**, pesquisadora ([PE01](personas.md#pe01)), **quero** ser guiada pelas telas na primeira vez e ter ajuda em cada página, **para** não travar numa tela que eu não entendo.

Critérios de aceitação:

1. No primeiro acesso, um tour mostra as ações nas telas de verdade, e eu avanço fazendo a ação.
2. Posso pular ou fechar o tour e rever depois pela ajuda.
3. Toda página do pesquisador tem um (?) que explica a própria página.

Requisitos: [RF09](requisitos.md#rf09), [RF10](requisitos.md#rf10). Status: Entregue.

### HU03

**Criar um estudo com duas versões**

Como **Marina**, pesquisadora ([PE01](personas.md#pe01)), **quero** cadastrar o estudo com as duas versões do aplicativo, **para** comparar a versão atual com a nova no mesmo estudo.

Critérios de aceitação:

1. Informo título, produto, objetivo, período e as versões.
2. O nome do produto sugere o nome da primeira versão.
3. Erros aparecem num resumo com link para cada campo, e nada é perdido.
4. O estudo nasce em rascunho, sem aceitar respostas.

Requisitos: [RF13](requisitos.md#rf13), [RF19](requisitos.md#rf19). Status: Entregue.

### HU04

**Informar quem responde pela pesquisa**

Como **Marina**, pesquisadora ([PE01](personas.md#pe01)), **quero** dizer no termo quem sou, como falar comigo, os riscos e os benefícios, **para** cumprir a ética da pesquisa e passar confiança a quem responde.

Critérios de aceitação:

1. Nome, e-mail de contato e instituição vêm preenchidos da minha conta e são obrigatórios.
2. Riscos e benefícios vêm com um texto sugerido que posso mudar.
3. O comitê de ética é opcional e aparece no termo quando informado.
4. Vejo a prévia do termo do participante ao lado do formulário.

Requisitos: [RF13](requisitos.md#rf13), [RF25](requisitos.md#rf25). Status: Entregue.

### HU05

**Decidir se coleto dados demográficos**

Como **Marina**, pesquisadora ([PE01](personas.md#pe01)), **quero** escolher, em cada estudo, se o link pergunta faixa etária, gênero, escolaridade e familiaridade, **para** coletar só o que a minha pesquisa precisa.

Critérios de aceitação:

1. A coleta demográfica vem desligada.
2. Quando ligo, o termo avisa e o tempo estimado aumenta.
3. Os dados demográficos ficam cifrados no banco.

Requisitos: [RF18](requisitos.md#rf18), [RNF13](requisitos.md#rnf13), [RNF14](requisitos.md#rnf14). Status: Entregue.

### HU06

**Abrir a coleta e mandar o link**

Como **Marina**, pesquisadora ([PE01](personas.md#pe01)), **quero** abrir a coleta e copiar o link com um clique, **para** mandar no grupo de WhatsApp dos pacientes.

Critérios de aceitação:

1. Abrir coleta confirma numa mensagem o que mudou: "Coleta aberta. O link já aceita respostas."
2. Copiar link copia e anuncia que copiou, também pelo teclado.
3. O link é curto e não dá para adivinhar o de outro estudo.

Requisitos: [RF15](requisitos.md#rf15), [RF16](requisitos.md#rf16), [RNF20](requisitos.md#rnf20). Status: Entregue.

### HU07

**Acompanhar a coleta**

Como **Marina**, pesquisadora ([PE01](personas.md#pe01)), **quero** ver quantas pessoas já responderam e quando chegou a última resposta, **para** saber se preciso divulgar mais o link.

Critérios de aceitação:

1. A lista de estudos mostra respostas e última resposta de cada estudo.
2. O sino avisa das respostas novas, agrupadas enquanto não leio.

Requisitos: [RF12](requisitos.md#rf12), [RF22](requisitos.md#rf22). Status: Entregue.

### HU08

**Entender o resultado sem ser estatística**

Como **Marina**, pesquisadora ([PE01](personas.md#pe01)), **quero** ler o resultado com a interpretação escrita ao lado de cada número, **para** saber se a versão nova é melhor sem virar especialista.

Critérios de aceitação:

1. Uma frase no topo resume o resultado.
2. Cada escala mostra média, IC95, alfa, interpretação e faixa do benchmark, no gráfico e numa tabela.
3. Os termos técnicos têm uma explicação curta que abre ali mesmo.
4. Com alfa baixo ou amostra pequena, um aviso diz o que significa e o que fazer.
5. O gráfico continua legível sem depender de cor.

Requisitos: [RF38](requisitos.md#rf38), [RF43](requisitos.md#rf43), [RF44](requisitos.md#rf44), [RF45](requisitos.md#rf45), [RF49](requisitos.md#rf49), [RNF07](requisitos.md#rnf07), [RNF08](requisitos.md#rnf08). Status: Entregue.

### HU09

**Ver que itens puxaram a escala**

Como **Marina**, pesquisadora ([PE01](personas.md#pe01)), **quero** ver a média de cada um dos 26 itens, **para** explicar na dissertação por que uma escala ficou baixa.

Critérios de aceitação:

1. O gráfico mostra cada item entre os seus dois termos.
2. Posso ver na ordem oficial ou agrupado por escala.

Requisitos: [RF41](requisitos.md#rf41), [RF46](requisitos.md#rf46). Status: Entregue.

### HU10

**Comparar as duas versões**

Como **Marina**, pesquisadora ([PE01](personas.md#pe01)), **quero** ver as versões lado a lado no mesmo gráfico, **para** dizer em que escalas a versão nova ganhou.

Critérios de aceitação:

1. Cada participante cai na versão com menos respostas, então os grupos ficam parecidos.
2. Cada versão tem um marcador de forma diferente, e uma frase aponta as maiores diferenças.
3. A versão e o modo ficam no endereço: recarregar ou mandar o link mantém a mesma visão.

Requisitos: [RF26](requisitos.md#rf26), [RF47](requisitos.md#rf47), [RF48](requisitos.md#rf48). Status: Entregue.

### HU11

**Levar os resultados para a dissertação**

Como **Marina**, pesquisadora ([PE01](personas.md#pe01)), **quero** baixar a tabela por escala e o painel em PDF, **para** colocar no texto sem refazer gráfico.

Critérios de aceitação:

1. O CSV por escala abre no Excel em português, com vírgula decimal.
2. O PDF traz o título do estudo, o n e a data no cabeçalho.

Requisitos: [RF58](requisitos.md#rf58), [RF60](requisitos.md#rf60), [RNF22](requisitos.md#rnf22). Status: Entregue.

### HU12

**Tirar respostas descuidadas da análise**

Como **Marina**, pesquisadora ([PE01](personas.md#pe01)), **quero** ver quais respostas parecem descuidadas e tirá-las do cálculo, **para** não deixar quem respondeu ao acaso distorcer o resultado.

Critérios de aceitação:

1. A ferramenta marca como suspeita quem tem 3 ou mais escalas incoerentes ou mais de 15 respostas iguais.
2. Vejo o motivo e a amplitude de cada escala do participante.
3. Tiro e devolvo uma a uma, ou todas as suspeitas de uma vez, sem apagar nada.
4. Os números do painel passam a usar só quem está na análise.

Requisitos: [RF42](requisitos.md#rf42), [RF51](requisitos.md#rf51), [RF52](requisitos.md#rf52), [RF53](requisitos.md#rf53), [RF54](requisitos.md#rf54). Status: Entregue.

### HU13

**Ver o perfil de quem respondeu**

Como **Marina**, pesquisadora ([PE01](personas.md#pe01)), **quero** ver a distribuição das respostas demográficas, **para** descrever a amostra na dissertação.

Critérios de aceitação:

1. Cada pergunta aparece num gráfico com a tabela dos números.
2. Posso filtrar por versão.
3. Prefiro não responder e quem pulou aparecem separados.

Requisitos: [RF50](requisitos.md#rf50). Status: Entregue.

### HU14

**Encerrar e reabrir a coleta**

Como **Marina**, pesquisadora ([PE01](personas.md#pe01)), **quero** encerrar a coleta no fim do período e reabrir se precisar, **para** parar de receber respostas sem perder as que já tenho.

Critérios de aceitação:

1. Encerrada, o link explica que a coleta terminou.
2. Reabrir volta a aceitar respostas.

Requisitos: [RF15](requisitos.md#rf15). Status: Entregue.

### HU15

**Corrigir o estudo depois de criado**

Como **Marina**, pesquisadora ([PE01](personas.md#pe01)), **quero** editar os dados e as versões, **para** consertar um erro de digitação ou acrescentar uma versão.

Critérios de aceitação:

1. As mudanças salvam e uma mensagem confirma.
2. Com a coleta aberta, não consigo remover uma versão que já tem respostas.

Requisitos: [RF14](requisitos.md#rf14). Status: Entregue.

### HU16

**Excluir um estudo de teste**

Como **Marina**, pesquisadora ([PE01](personas.md#pe01)), **quero** apagar o estudo que criei para testar, **para** deixar minha lista limpa.

Critérios de aceitação:

1. A janela diz quantas respostas vão junto.
2. Só exclui depois que eu digito o título do estudo.

Requisitos: [RF17](requisitos.md#rf17), [RNF21](requisitos.md#rnf21). Status: Entregue.

### HU17

**Cuidar dos meus dados de conta**

Como **Marina**, pesquisadora ([PE01](personas.md#pe01)), **quero** mudar meus dados, baixar o que a ferramenta guarda sobre mim e excluir a conta, **para** exercer meus direitos da LGPD sem pedir a ninguém.

Critérios de aceitação:

1. Mudo nome e e-mail em Minha conta; um e-mail de outra conta é recusado.
2. Baixar meus dados entrega um JSON com a conta, sem a senha.
3. Excluir a conta pede o meu e-mail e apaga junto os meus estudos.
4. A política de privacidade explica o que é guardado e por quê.

Requisitos: [RF04](requisitos.md#rf04), [RF06](requisitos.md#rf06), [RF07](requisitos.md#rf07), [RNF19](requisitos.md#rnf19). Status: Entregue.

### HU18

**Conferir os números na planilha oficial**

Como **Ricardo**, orientador ([PE02](personas.md#pe02)), **quero** exportar as respostas no formato da UEQ Data Analysis Tool, **para** conferir que a ferramenta calcula como a planilha antes de assinar um artigo.

Critérios de aceitação:

1. O CSV tem os 26 valores de cada participante na análise, prontos para colar na aba Data.
2. A recodificação e as estatísticas seguem as fórmulas do handbook e da planilha.
3. O questionário não induz resposta: as 7 posições têm o mesmo peso visual.
4. Os números batem com a planilha com tolerância de 1e-6.

Requisitos: [RF36](requisitos.md#rf36), [RF37](requisitos.md#rf37), [RF59](requisitos.md#rf59), [RNF09](requisitos.md#rnf09), [RNF11](requisitos.md#rnf11). Status: Pendente.

### HU19

**Juntar respostas coletadas em papel**

Como **Ricardo**, orientador ([PE02](personas.md#pe02)), **quero** importar as respostas de um evento a partir de um CSV, **para** analisar tudo no mesmo painel.

Critérios de aceitação:

1. Vejo uma prévia antes de importar.
2. Linhas com erro são apontadas pelo número, e nada é importado enquanto houver erro.
3. As importadas aparecem marcadas como importadas.

Requisitos: [RF61](requisitos.md#rf61). Status: Entregue.

### HU20

**Acompanhar o estudo da orientanda**

Como **Ricardo**, orientador ([PE02](personas.md#pe02)), **quero** ser convidado para o estudo da Marina como leitor, **para** ver o mesmo painel que ela sem poder mudar nada.

Critérios de aceitação:

1. O convite chega no sino e eu aceito ou recuso.
2. Como leitor, vejo e exporto, mas não edito nem excluo.
3. Só vejo os estudos que são meus ou que foram compartilhados comigo.

Requisitos: [RF20](requisitos.md#rf20), [RF21](requisitos.md#rf21), [RNF17](requisitos.md#rnf17). Status: Entregue.

### HU21

**Saber o que mudou nos estudos**

Como **Ricardo**, orientador ([PE02](personas.md#pe02)), **quero** ser avisado quando a equipe muda um estudo ou chegam respostas, **para** não precisar abrir cada estudo para saber.

Critérios de aceitação:

1. O sino mostra convites, respostas novas e mudanças feitas pelos parceiros.
2. Os avisos também vão por e-mail, no meu idioma, e posso desligar em Minha conta.

Requisitos: [RF22](requisitos.md#rf22), [RF23](requisitos.md#rf23). Status: Entregue.

### HU22

**Proteger a conta num computador compartilhado**

Como **Ricardo**, orientador ([PE02](personas.md#pe02)), **quero** trocar a senha e saber que as outras sessões caem, **para** não deixar a conta aberta no laboratório.

Critérios de aceitação:

1. Trocar a senha encerra as sessões de outros navegadores.
2. Quem abre uma página do pesquisador sem sessão vai para Entrar.
3. Depois de 5 senhas erradas, o e-mail espera antes de tentar de novo.
4. A ferramenta só funciona por HTTPS, com os cabeçalhos de segurança.

Requisitos: [RF03](requisitos.md#rf03), [RF05](requisitos.md#rf05), [RNF15](requisitos.md#rnf15), [RNF16](requisitos.md#rnf16), [RNF18](requisitos.md#rnf18). Status: Entregue.

### HU23

**Exportar as respostas para outra análise**

Como **Ricardo**, orientador ([PE02](personas.md#pe02)), **quero** baixar as respostas brutas e as recodificadas, **para** rodar análises que a ferramenta não faz.

Critérios de aceitação:

1. O CSV bruto tem os valores de 1 a 7, a versão e os dados demográficos.
2. O CSV recodificado tem os valores de -3 a +3 com a polaridade corrigida.
3. Os arquivos abrem direto no Excel em português.

Requisitos: [RF56](requisitos.md#rf56), [RF57](requisitos.md#rf57), [RNF22](requisitos.md#rnf22). Status: Entregue.

### HU24

**Saber a regra de cada número**

Como **Ricardo**, orientador ([PE02](personas.md#pe02)), **quero** ver como cada estatística é calculada e classificada, **para** explicar o método numa banca.

Critérios de aceitação:

1. Pragmática é a média de Perspicuidade, Eficiência e Confiabilidade; hedônica, de Estimulação e Novidade.
2. Cada média é classificada nas 5 faixas do benchmark, e média igual ao limite cai na faixa de baixo.
3. A interpretação usa a faixa neutra de -0,8 a +0,8.

Requisitos: [RF37](requisitos.md#rf37), [RF38](requisitos.md#rf38), [RF39](requisitos.md#rf39), [RF40](requisitos.md#rf40). Status: Entregue.

### HU25

**Aplicar a versão curta em eventos**

Como **Ricardo**, orientador ([PE02](personas.md#pe02)), **quero** aplicar o UEQ-S, com 8 itens, **para** coletar em eventos em que as pessoas têm pouco tempo.

Critérios de aceitação:

1. Escolho entre UEQ e UEQ-S ao criar o estudo.
2. O painel mostra as escalas pragmática e hedônica com o benchmark do UEQ-S.

Requisitos: [RF62](requisitos.md#rf62). Status: Pendente.

### HU26

**Usar a ferramenta em japonês**

Como **Kenji**, pesquisador visitante ([PE03](personas.md#pe03)), **quero** trocar o idioma da ferramenta para japonês, **para** trabalhar no idioma em que leio melhor.

Critérios de aceitação:

1. Escolho o idioma ao criar a conta, em Minha conta ou no seletor da barra.
2. A troca vale na hora, sem sair da página.
3. Sem conta, o seletor da barra também troca e fica guardado no navegador.

Requisitos: [RF08](requisitos.md#rf08). Status: Entregue.

### HU27

**Aplicar o estudo em japonês**

Como **Kenji**, pesquisador visitante ([PE03](personas.md#pe03)), **quero** escrever o estudo em japonês e que o link abra em japonês, **para** aplicar o questionário a participantes no Japão.

Critérios de aceitação:

1. Escolho o idioma do estudo no formulário; o padrão é o idioma da conta.
2. O link abre no idioma do estudo, e o participante pode trocar.
3. Título, produto e objetivo aparecem traduzidos para quem troca de idioma.

Requisitos: [RF19](requisitos.md#rf19), [RF34](requisitos.md#rf34), [RF35](requisitos.md#rf35). Status: Entregue.

## Participantes

### HU28

**Entender o convite antes de aceitar**

Como **Célia**, participante pelo celular ([PE04](personas.md#pe04)), **quero** ler em um minuto do que se trata e o que vai acontecer, **para** decidir se quero participar.

Critérios de aceitação:

1. O termo diz objetivo, tempo estimado, riscos, benefícios, guarda dos dados e quem responde pela pesquisa.
2. Só participo depois de informar a idade e clicar em Concordo.
3. Não quero participar sai sem gravar nada.
4. Posso imprimir ou salvar uma via do termo e abrir a política de privacidade sem perder o termo.

Requisitos: [RF25](requisitos.md#rf25), [RNF19](requisitos.md#rnf19). Status: Entregue.

### HU29

**Responder rápido pelo celular**

Como **Célia**, participante pelo celular ([PE04](personas.md#pe04)), **quero** responder no celular, com a fonte aumentada, sem conta, **para** terminar em poucos minutos.

Critérios de aceitação:

1. Abro o link sem login e não vejo caminho para a área do pesquisador.
2. Cada círculo tem área de toque de pelo menos 44 × 44 px.
3. Nada rola na horizontal em 320 px nem com zoom de 400%.
4. Um rodapé fixo mostra quantos itens já respondi, de 26.

Requisitos: [RF24](requisitos.md#rf24), [RF27](requisitos.md#rf27), [RF28](requisitos.md#rf28), [RNF02](requisitos.md#rnf02), [RNF05](requisitos.md#rnf05), [RNF06](requisitos.md#rnf06), [RNF23](requisitos.md#rnf23). Status: Entregue.

### HU30

**Saber o que esqueci**

Como **Célia**, participante pelo celular ([PE04](personas.md#pe04)), **quero** ser avisada dos itens em branco quando envio, **para** corrigir sem procurar item por item.

Critérios de aceitação:

1. Um resumo no topo diz quantos faltam, com um link para cada.
2. Nada é gravado enquanto faltar item.

Requisitos: [RF29](requisitos.md#rf29). Status: Entregue.

### HU31

**Não perder o que marquei**

Como **Célia**, participante pelo celular ([PE04](personas.md#pe04)), **quero** recuperar as respostas se a página recarregar, **para** não ter de começar de novo.

Critérios de aceitação:

1. Recarregar a página traz de volta o que eu tinha marcado, com um aviso.
2. Trocar de idioma no meio também não apaga o que marquei.

Requisitos: [RF30](requisitos.md#rf30). Status: Entregue.

### HU32

**Desistir sem deixar rastro**

Como **Célia**, participante pelo celular ([PE04](personas.md#pe04)), **quero** sair no meio do questionário, **para** não ficar presa a algo que não quero mais fazer.

Critérios de aceitação:

1. Sair sem enviar pede confirmação numa janela.
2. Ao sair, nada do que marquei é gravado.

Requisitos: [RF31](requisitos.md#rf31), [RNF21](requisitos.md#rnf21). Status: Entregue.

### HU33

**Pular as perguntas sobre mim**

Como **Célia**, participante pelo celular ([PE04](personas.md#pe04)), **quero** não responder as perguntas demográficas, **para** não informar o que não quero.

Critérios de aceitação:

1. Toda pergunta tem Prefiro não responder.
2. Posso pular a etapa inteira.
3. A ferramenta não pede nome, e-mail nem nada que me identifique.

Requisitos: [RF32](requisitos.md#rf32), [RNF12](requisitos.md#rnf12). Status: Entregue.

### HU34

**Saber que acabou**

Como **Célia**, participante pelo celular ([PE04](personas.md#pe04)), **quero** ver que minhas respostas foram registradas, **para** fechar a página tranquila.

Critérios de aceitação:

1. Depois de enviar, vejo o agradecimento.
2. Se abrir o link de novo no mesmo navegador, vejo que já respondi.

Requisitos: [RF33](requisitos.md#rf33). Status: Entregue.

### HU35

**Responder com leitor de tela**

Como **Tiago**, participante com leitor de tela ([PE05](personas.md#pe05)), **quero** responder só com teclado e NVDA, **para** responder com a mesma precisão de quem enxerga.

Critérios de aceitação:

1. Cada item é anunciado com número, os dois termos e a posição de cada círculo.
2. Tab passa de item em item e as setas mudam a posição, com o foco sempre visível.
3. O resumo de itens faltando recebe o foco e é anunciado.
4. Nenhuma tela tem violação WCAG 2.2 AA apontada pelo axe-core.

Requisitos: [RF27](requisitos.md#rf27), [RNF01](requisitos.md#rnf01), [RNF03](requisitos.md#rnf03), [RNF04](requisitos.md#rnf04). Status: Entregue.

### HU36

**Responder em árabe**

Como **Amira**, participante que lê em árabe ([PE06](personas.md#pe06)), **quero** responder no meu idioma, com os termos validados em árabe, **para** responder melhor do que em português.

Critérios de aceitação:

1. O link abre no idioma do navegador quando ele está entre os 37 do UEQ.
2. A página vira da direita para a esquerda, com a escala na ordem oficial.
3. Os termos são os do pacote oficial, nunca tradução automática.
4. Se a tradução não for aprovada pelos autores do UEQ, um aviso diz isso.

Requisitos: [RF34](requisitos.md#rf34), [RNF10](requisitos.md#rnf10). Status: Entregue.

### HU37

**Participar com autorização do responsável**

Como **Bruna**, participante menor de idade ([PE07](personas.md#pe07)), **quero** participar de um estudo da escola com a autorização dos meus pais, **para** participar como os colegas maiores de idade.

Critérios de aceitação:

1. O termo pede a idade antes do Concordo.
2. Com menos de 18 anos, só participo depois de confirmar a autorização do responsável.
3. Sem idade, nada é gravado.

Requisitos: [RF25](requisitos.md#rf25). Status: Entregue.

## Quem mantém a ferramenta

### HU38

**Rodar a ferramenta localmente**

Como **Lucas**, mantenedor da instalação ([PE08](personas.md#pe08)), **quero** subir a ferramenta na minha máquina em minutos, **para** adaptar ao meu laboratório.

Critérios de aceitação:

1. O README tem o passo a passo, do clone à tela inicial.
2. O código é aberto, sob a licença MIT.

Requisitos: [RNF24](requisitos.md#rnf24). Status: Entregue.

### HU39

**Mudar um limiar e recalcular**

Como **Lucas**, mantenedor da instalação ([PE08](personas.md#pe08)), **quero** mudar um limiar de suspeita sem caçar número no código, **para** seguir o protocolo do meu grupo.

Critérios de aceitação:

1. Os limiares ficam em data/protocolo.json, com a fonte.
2. Um comando recalcula a suspeita das participações já gravadas.

Requisitos: [RF55](requisitos.md#rf55). Status: Entregue.

### HU40

**Provar que o cálculo não quebrou**

Como **Lucas**, mantenedor da instalação ([PE08](personas.md#pe08)), **quero** rodar os testes do cálculo depois de mudar o código, **para** ter certeza de que os números continuam certos.

Critérios de aceitação:

1. O cálculo fica num módulo de funções puras, sem banco nem interface.
2. Lint, tipos e testes de unidade rodam com um comando cada.
3. Os testes cobrem as bordas: n = 0, n = 1, todos iguais.

Requisitos: [RNF25](requisitos.md#rnf25), [RNF26](requisitos.md#rnf26). Status: Entregue.

### HU41

**Administrar as contas do laboratório**

Como **Lucas**, mantenedor da instalação ([PE08](personas.md#pe08)), **quero** ver as contas e criar conta para um aluno novo, **para** cuidar da instalação do laboratório.

Critérios de aceitação:

1. Só quem é administrador abre a página Administração.
2. O administrador não vê os estudos de ninguém, só a quantidade por conta.

Requisitos: [RF66](requisitos.md#rf66), [RNF17](requisitos.md#rnf17). Status: Entregue.

### HU42

**Demonstrar a ferramenta sem dados reais**

Como **Lucas**, mantenedor da instalação ([PE08](personas.md#pe08)), **quero** criar estudos de demonstração com respostas inventadas, **para** apresentar a ferramenta numa aula.

Critérios de aceitação:

1. Cada cenário gera respostas coerentes com o perfil dele.
2. Os estudos de demonstração ficam na minha conta.

Requisitos: [RF67](requisitos.md#rf67). Status: Entregue.

### HU43

**Conferir a proteção e as traduções**

Como **Lucas**, mantenedor da instalação ([PE08](personas.md#pe08)), **quero** ver se a criptografia está ligada e quanto de cada idioma está traduzido, **para** saber se a instalação está pronta para um estudo real.

Critérios de aceitação:

1. Administração mostra se a chave de criptografia e o envio de e-mail estão configurados.
2. Administração › Idiomas mostra o quanto de cada idioma já foi traduzido.

Requisitos: [RF68](requisitos.md#rf68), [RNF14](requisitos.md#rnf14). Status: Entregue.

### HU44

**Ler a documentação sem conta**

Como **Lucas**, mantenedor da instalação ([PE08](personas.md#pe08)), **quero** ler a documentação dentro da ferramenta, sem criar conta, **para** entender a arquitetura antes de mexer.

Critérios de aceitação:

1. A aba Documentação abre para qualquer pessoa.
2. Os links entre documentos levam ao ponto certo, e os arquivos da ficha baixam sem conta.
3. Cada diagrama abre em tela cheia, com zoom.

Requisitos: [RF63](requisitos.md#rf63), [RF64](requisitos.md#rf64), [RF65](requisitos.md#rf65). Status: Entregue.
