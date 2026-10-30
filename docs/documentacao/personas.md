# Personas

Seis personas representam quem usa a Ferramenta UEQ: duas do lado do pesquisador, três do lado do participante e uma de quem mantém o código.

Elas são ficcionais. Foram construídas a partir do perfil de usuários e do contexto de uso de [docs/ihc.md §2](../ihc.md#2-usuários-e-contexto-de-uso-iso-9241-11), que segue a ISO 9241-11. Não vieram de entrevistas. Depois do teste com usuários previsto em [docs/ihc.md §6](../ihc.md#6-como-verificar-automação-não-basta), a equipe deve revisá-las com o que observar.

Cada persona aponta as [histórias de usuário](historias-de-usuario.md) escritas a partir dela.

| ID | Persona | Papel | Uso principal |
|---|---|---|---|
| [PE01](#pe01) | Marina | Pesquisadora, mestranda em IHC | Monta o estudo, acompanha a coleta e interpreta o painel |
| [PE02](#pe02) | Ricardo | Pesquisador experiente, orientador | Compara versões, confere os números na planilha oficial e importa dados |
| [PE03](#pe03) | Célia | Participante pelo celular | Responde pelo link recebido no WhatsApp |
| [PE04](#pe04) | Tiago | Participante com leitor de tela | Responde só com teclado e NVDA |
| [PE05](#pe05) | Amira | Participante que lê em árabe | Responde no próprio idioma, da direita para a esquerda |
| [PE06](#pe06) | Lucas | Desenvolvedor que contribui com o projeto | Roda localmente, ajusta parâmetros e propõe mudanças |

## Pesquisadores

### PE01

**Marina, 26 anos, mestranda em IHC.** Persona principal.

- **Contexto.** Está no primeiro ano do mestrado e vai avaliar com o UEQ duas versões do aplicativo de agendamento da clínica-escola da universidade. Conhece UX e já respondeu questionários, mas nunca calculou alfa de Cronbach. Usa o notebook, em sessões curtas entre aulas, e abre o painel várias vezes por dia durante a coleta.
- **Objetivos.** Criar o estudo sem errar, mandar o link no grupo de WhatsApp dos pacientes, saber quantas pessoas já responderam, entender o resultado e levar tabelas e gráficos para a dissertação.
- **Frustrações.** Planilhas em que um copiar e colar errado estraga tudo. Formulários genéricos que não preservam a ordem e a polaridade do UEQ. Estatística apresentada sem explicação.
- **O que precisa da ferramenta.** Interpretação escrita ao lado de cada número, explicação curta dos termos técnicos, avisos que dizem o que fazer, exportações que abrem direto no Excel.

> "Eu quero saber se a versão nova é melhor, não virar especialista em estatística."

Histórias: [HU01](historias-de-usuario.md#hu01), [HU02](historias-de-usuario.md#hu02), [HU04](historias-de-usuario.md#hu04), [HU05](historias-de-usuario.md#hu05), [HU06](historias-de-usuario.md#hu06), [HU07](historias-de-usuario.md#hu07), [HU08](historias-de-usuario.md#hu08), [HU09](historias-de-usuario.md#hu09), [HU20](historias-de-usuario.md#hu20), [HU21](historias-de-usuario.md#hu21), [HU22](historias-de-usuario.md#hu22), [HU24](historias-de-usuario.md#hu24), [HU26](historias-de-usuario.md#hu26), [HU28](historias-de-usuario.md#hu28), [HU29](historias-de-usuario.md#hu29), [HU31](historias-de-usuario.md#hu31).

### PE02

**Ricardo, 48 anos, professor e orientador.**

- **Contexto.** Orienta quatro alunos que usam o UEQ. Conhece o handbook e a UEQ Data Analysis Tool e confia neles. Trabalha nos computadores do laboratório, compartilhados. Às vezes tem respostas coletadas em papel, em eventos.
- **Objetivos.** Comparar versões de um produto, conferir que os números batem com a planilha oficial antes de assinar um artigo, ver o mesmo recorte do painel que o aluno está vendo, juntar respostas de papel às do link.
- **Frustrações.** Ferramentas que calculam "do seu jeito" sem dizer a regra. Ter que refazer filtros para discutir um resultado. Deixar a sessão aberta num computador compartilhado.
- **O que precisa da ferramenta.** Exportação no formato exato da planilha oficial, regras de suspeita visíveis, URL que guarda a visão, importação com prévia e troca de senha que derruba as outras sessões.

> "Se não bate com a planilha oficial, não vai para o artigo."

Histórias: [HU03](historias-de-usuario.md#hu03), [HU10](historias-de-usuario.md#hu10), [HU23](historias-de-usuario.md#hu23), [HU25](historias-de-usuario.md#hu25), [HU27](historias-de-usuario.md#hu27), [HU30](historias-de-usuario.md#hu30), [HU35](historias-de-usuario.md#hu35).

## Participantes

### PE03

**Célia, 63 anos, aposentada, paciente da clínica-escola.**

- **Contexto.** Recebe o link pelo WhatsApp e abre no celular, com a fonte do sistema aumentada. Usa o celular para mensagens e banco, mas desconfia de formulários. Não tem conta na ferramenta e nenhuma obrigação de responder.
- **Objetivos.** Entender rápido do que se trata, responder em poucos minutos e voltar ao que estava fazendo.
- **Frustrações.** Botões pequenos, perguntas que somem quando a página recarrega, formulário que não diz o que faltou, pedido de dados pessoais.
- **O que precisa da ferramenta.** Termo curto e claro, alvo de toque grande, progresso visível, aviso de item esquecido com link direto, poder desistir e pular os dados sobre ela.

> "Se eu não entender em um minuto, eu fecho."

Histórias: [HU11](historias-de-usuario.md#hu11), [HU12](historias-de-usuario.md#hu12), [HU13](historias-de-usuario.md#hu13), [HU14](historias-de-usuario.md#hu14), [HU15](historias-de-usuario.md#hu15), [HU16](historias-de-usuario.md#hu16), [HU17](historias-de-usuario.md#hu17), [HU36](historias-de-usuario.md#hu36).

### PE04

**Tiago, 29 anos, analista de sistemas, cego.**

- **Contexto.** Usa Windows com NVDA e navega só pelo teclado. Responde pesquisas de UX com frequência e já desistiu de muitas porque os botões eram `div` sem nome.
- **Objetivos.** Responder com a mesma precisão de quem enxerga, sabendo em cada círculo a posição e de qual polo está perto.
- **Frustrações.** Escala sem rótulo ("botão, botão, botão"), anúncio de progresso a cada clique, foco que pula sozinho, erro que só aparece em vermelho.
- **O que precisa da ferramenta.** Item como grupo com legenda, rádios nativos com nome acessível ("3 de 7, mais perto de fácil"), progresso anunciado só a cada 5 itens, resumo de erros que recebe o foco.

> "Se o leitor de tela diz só 'botão de opção, 3 de 7', eu não sei o que estou respondendo."

Histórias: [HU18](historias-de-usuario.md#hu18).

### PE05

**Amira, 34 anos, intercambista, lê em árabe.**

- **Contexto.** Faz um semestre no Brasil e fala pouco português. O navegador do celular está em árabe. Participa do estudo de um colega de laboratório.
- **Objetivos.** Responder no próprio idioma, com os termos que o UEQ validou em árabe.
- **Frustrações.** Tradução automática que muda o sentido do termo. Página em árabe com a escala invertida.
- **O que precisa da ferramenta.** Idioma escolhido pelo navegador, texto da direita para a esquerda com a escala na ordem oficial, aviso honesto de que a tradução árabe ainda não foi aprovada pelos autores.

> "Eu respondo melhor quando leio na minha língua."

Histórias: [HU19](historias-de-usuario.md#hu19).

## Quem mantém o código

### PE06

**Lucas, 31 anos, desenvolvedor e pesquisador em engenharia de software.**

- **Contexto.** Achou o repositório porque o grupo dele também usa o UEQ. Conhece TypeScript e Next.js. Quer adaptar a ferramenta ao laboratório e devolver melhorias.
- **Objetivos.** Subir a ferramenta localmente em minutos, entender a arquitetura, mudar um limiar sem caçar número no código e provar que não quebrou o cálculo.
- **Frustrações.** Projeto acadêmico sem instrução de instalação, regra de negócio espalhada pela interface, teste que não existe.
- **O que precisa da ferramenta.** README com o passo a passo, parâmetros do protocolo em JSON com a fonte, cálculo isolado em funções puras com testes, documentação que liga requisito a código.

> "Antes de mexer, eu preciso saber o que essa linha garante."

Histórias: [HU32](historias-de-usuario.md#hu32), [HU33](historias-de-usuario.md#hu33), [HU34](historias-de-usuario.md#hu34).
