# Personas

Oito personas representam quem usa a Ferramenta UEQ: três do lado do pesquisador, quatro do lado do participante e uma de quem mantém a instalação.

Elas são ficcionais. Foram construídas a partir do perfil de usuários e do contexto de uso de [Fundamentos de IHC §2](../ihc.md#2-usuários-e-contexto-de-uso-iso-9241-11), que segue a ISO 9241-11, e cobrem os extremos que mais mudam o desenho de uma tela: quem nunca calculou estatística, quem só confia na planilha oficial, quem não lê português, quem responde pelo celular com a fonte aumentada, quem usa leitor de tela, quem lê da direita para a esquerda, quem tem menos de 18 anos e quem precisa mexer no código.

Cada persona aponta as [histórias de usuário](historias-de-usuario.md) escritas a partir dela. A [matriz de rastreabilidade](matriz-rastreabilidade.md) liga cada requisito às personas que o pedem.

| ID | Persona | Papel | Uso principal |
|---|---|---|---|
| [PE01](#pe01) | Marina | Pesquisadora, mestranda em IHC | Monta o estudo, acompanha a coleta e interpreta o painel |
| [PE02](#pe02) | Ricardo | Professor e orientador | Acompanha o estudo dos orientandos, compara versões e confere os números na planilha oficial |
| [PE03](#pe03) | Kenji | Pesquisador visitante, lê em japonês | Usa a ferramenta e aplica o estudo no próprio idioma |
| [PE04](#pe04) | Célia | Participante pelo celular | Responde pelo link recebido no WhatsApp |
| [PE05](#pe05) | Tiago | Participante com leitor de tela | Responde só com teclado e NVDA |
| [PE06](#pe06) | Amira | Participante que lê em árabe | Responde no próprio idioma, da direita para a esquerda |
| [PE07](#pe07) | Bruna | Participante menor de idade | Participa de um estudo na escola, com autorização dos pais |
| [PE08](#pe08) | Lucas | Desenvolvedor e administrador da instalação | Instala, ajusta o protocolo, administra as contas e prova que nada quebrou |

## Pesquisadores

### PE01

**Marina, 26 anos, mestranda em IHC.** Persona principal.

- **Contexto.** Está no primeiro ano do mestrado e vai avaliar com o UEQ duas versões do aplicativo de agendamento da clínica-escola da universidade. Conhece UX e já respondeu questionários, mas nunca calculou alfa de Cronbach. Usa o notebook, em sessões curtas entre aulas, e abre o painel várias vezes por dia durante a coleta.
- **Objetivos.** Criar o estudo sem errar, mandar o link no grupo de WhatsApp dos pacientes, saber quantas pessoas já responderam, entender o resultado e levar tabelas e gráficos para a dissertação.
- **Frustrações.** Planilhas em que um copiar e colar errado estraga tudo. Formulários genéricos que não preservam a ordem e a polaridade do UEQ. Estatística apresentada sem explicação. Ter de escrever do zero o termo de consentimento.
- **O que precisa da ferramenta.** Interpretação escrita ao lado de cada número, explicação curta dos termos técnicos, avisos que dizem o que fazer, um termo que já pede o que a ética exige e exportações que abrem direto no Excel.

> "Eu quero saber se a versão nova é melhor, não virar especialista em estatística."

Histórias: [HU01](historias-de-usuario.md#hu01), [HU02](historias-de-usuario.md#hu02), [HU03](historias-de-usuario.md#hu03), [HU04](historias-de-usuario.md#hu04), [HU05](historias-de-usuario.md#hu05), [HU06](historias-de-usuario.md#hu06), [HU07](historias-de-usuario.md#hu07), [HU08](historias-de-usuario.md#hu08), [HU09](historias-de-usuario.md#hu09), [HU10](historias-de-usuario.md#hu10), [HU11](historias-de-usuario.md#hu11), [HU12](historias-de-usuario.md#hu12), [HU13](historias-de-usuario.md#hu13), [HU14](historias-de-usuario.md#hu14), [HU15](historias-de-usuario.md#hu15), [HU16](historias-de-usuario.md#hu16), [HU17](historias-de-usuario.md#hu17).

### PE02

**Ricardo, 48 anos, professor e orientador.**

- **Contexto.** Orienta quatro alunos que usam o UEQ, entre eles a Marina. Conhece o handbook e a UEQ Data Analysis Tool e confia neles. Trabalha nos computadores do laboratório, compartilhados. Às vezes tem respostas coletadas em papel, em eventos com pouco tempo para cada pessoa.
- **Objetivos.** Acompanhar o estudo de cada orientando sem pedir prints, comparar versões de um produto, conferir que os números batem com a planilha oficial antes de assinar um artigo e juntar respostas de papel às do link.
- **Frustrações.** Ferramentas que calculam "do seu jeito" sem dizer a regra. Ter de refazer filtros para discutir um resultado. Deixar a sessão aberta num computador compartilhado.
- **O que precisa da ferramenta.** Acesso de leitura ao estudo do aluno, exportação no formato exato da planilha oficial, regras de suspeita e de cálculo visíveis, endereço que guarda a visão do painel, importação com prévia e troca de senha que derruba as outras sessões.

> "Se não bate com a planilha oficial, não vai para o artigo."

Histórias: [HU18](historias-de-usuario.md#hu18), [HU19](historias-de-usuario.md#hu19), [HU20](historias-de-usuario.md#hu20), [HU21](historias-de-usuario.md#hu21), [HU22](historias-de-usuario.md#hu22), [HU23](historias-de-usuario.md#hu23), [HU24](historias-de-usuario.md#hu24), [HU25](historias-de-usuario.md#hu25).

### PE03

**Kenji, 35 anos, pesquisador visitante de uma universidade japonesa.**

- **Contexto.** Passa um semestre no laboratório do Ricardo. Lê português devagar e trabalha melhor em japonês. Vai aplicar o UEQ num estudo com participantes no Japão, sobre um aplicativo de transporte.
- **Objetivos.** Usar a ferramenta no próprio idioma e montar um estudo cujo link abra em japonês, com os termos oficiais do UEQ.
- **Frustrações.** Interface que só existe em inglês ou português. Tradução que muda o nome dos botões de uma tela para outra.
- **O que precisa da ferramenta.** Seletor de idioma sempre à vista, tradução consistente da interface, estudo escrito no idioma dele e o título traduzido para quem responde em outro idioma.

> "Eu entendo a estatística. Eu só preciso ler a tela."

Histórias: [HU26](historias-de-usuario.md#hu26), [HU27](historias-de-usuario.md#hu27).

## Participantes

### PE04

**Célia, 63 anos, aposentada, paciente da clínica-escola.**

- **Contexto.** Recebe o link pelo WhatsApp e abre no celular, com a fonte do sistema aumentada. Usa o celular para mensagens e banco, mas desconfia de formulários. Não tem conta na ferramenta e nenhuma obrigação de responder.
- **Objetivos.** Entender rápido do que se trata e quem está pedindo, responder em poucos minutos e voltar ao que estava fazendo.
- **Frustrações.** Botões pequenos, perguntas que somem quando a página recarrega, formulário que não diz o que faltou, pedido de dados pessoais.
- **O que precisa da ferramenta.** Termo curto e claro, com quem responde pela pesquisa; alvo de toque grande; progresso visível; aviso de item esquecido com link direto; poder desistir e pular os dados sobre ela.

> "Se eu não entender em um minuto, eu fecho."

Histórias: [HU28](historias-de-usuario.md#hu28), [HU29](historias-de-usuario.md#hu29), [HU30](historias-de-usuario.md#hu30), [HU31](historias-de-usuario.md#hu31), [HU32](historias-de-usuario.md#hu32), [HU33](historias-de-usuario.md#hu33), [HU34](historias-de-usuario.md#hu34).

### PE05

**Tiago, 29 anos, analista de sistemas, cego.**

- **Contexto.** Usa Windows com NVDA e navega só pelo teclado. Responde pesquisas de UX com frequência e já desistiu de muitas porque os botões eram `div` sem nome.
- **Objetivos.** Responder com a mesma precisão de quem enxerga, sabendo em cada círculo a posição e de qual polo está perto.
- **Frustrações.** Escala sem rótulo ("botão, botão, botão"), anúncio de progresso a cada clique, foco que pula sozinho, erro que só aparece em vermelho.
- **O que precisa da ferramenta.** Item como grupo com legenda, rádios nativos com nome acessível ("3 de 7, mais perto de fácil"), progresso anunciado sem interromper, resumo de erros que recebe o foco.

> "Se o leitor de tela diz só 'botão de opção, 3 de 7', eu não sei o que estou respondendo."

Histórias: [HU35](historias-de-usuario.md#hu35).

### PE06

**Amira, 34 anos, intercambista, lê em árabe.**

- **Contexto.** Faz um semestre no Brasil e fala pouco português. O navegador do celular está em árabe. Participa do estudo de um colega de laboratório.
- **Objetivos.** Responder no próprio idioma, com os termos que o UEQ validou em árabe.
- **Frustrações.** Tradução automática que muda o sentido do termo. Página em árabe com a escala invertida.
- **O que precisa da ferramenta.** Idioma escolhido pelo navegador, texto da direita para a esquerda com a escala na ordem oficial, aviso honesto de que a tradução árabe não foi aprovada pelos autores do UEQ.

> "Eu respondo melhor quando leio na minha língua."

Histórias: [HU36](historias-de-usuario.md#hu36).

### PE07

**Bruna, 16 anos, estudante do ensino médio.**

- **Contexto.** A escola dela participa de um estudo sobre a plataforma de tarefas que os alunos usam. Responde pelo celular, no intervalo, com o link que a professora mandou.
- **Objetivos.** Participar como os colegas, sem complicação.
- **Frustrações.** Formulário que trava sem explicar por quê.
- **O que precisa da ferramenta.** Um termo que pergunte a idade antes de começar e diga com clareza que quem tem menos de 18 anos precisa da autorização do responsável, sem gravar nada antes disso.

> "Meus pais já assinaram a autorização da escola. Onde eu confirmo isso?"

Histórias: [HU37](historias-de-usuario.md#hu37).

## Quem mantém a ferramenta

### PE08

**Lucas, 31 anos, desenvolvedor e pesquisador em engenharia de software.**

- **Contexto.** Achou o repositório porque o grupo dele também usa o UEQ. Conhece TypeScript e Next.js. Instalou a ferramenta para o laboratório e é o administrador da instalação: cria as contas dos alunos e apresenta a ferramenta nas aulas.
- **Objetivos.** Subir a ferramenta localmente em minutos, entender a arquitetura, mudar um limiar sem caçar número no código, provar que não quebrou o cálculo e saber se a instalação está pronta para um estudo real.
- **Frustrações.** Projeto acadêmico sem instrução de instalação, regra de negócio espalhada pela interface, teste que não existe, documentação que não diz que código implementa o quê.
- **O que precisa da ferramenta.** README com o passo a passo, parâmetros do protocolo em JSON com a fonte, cálculo isolado em funções puras com testes, uma página de administração que mostre a situação da instalação sem dar acesso aos estudos dos outros, e documentação que liga requisito a código.

> "Antes de mexer, eu preciso saber o que essa linha garante."

Histórias: [HU38](historias-de-usuario.md#hu38), [HU39](historias-de-usuario.md#hu39), [HU40](historias-de-usuario.md#hu40), [HU41](historias-de-usuario.md#hu41), [HU42](historias-de-usuario.md#hu42), [HU43](historias-de-usuario.md#hu43), [HU44](historias-de-usuario.md#hu44).
