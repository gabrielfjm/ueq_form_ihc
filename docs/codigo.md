# Como escrever o código

O objetivo é código que pareça escrito por uma equipe que conhece o domínio, não código genérico. Na prática:

## Nomes
- Domínio em português e consistente com o banco: `Estudo`, `Versao`, `Participacao`, `Resposta`, `Item`, `Escala`, `Polaridade`
- Nada de `data`, `info`, `item2`, `handleStuff`, `processData`, `utils.ts`, `helpers.ts`
- Funções dizem o que calculam: `mediaPorEscala`, `intervaloConfianca95`, `alfaCronbach`, `marcarSuspeitos`

## Comentários
- Só comentam **por quê**, nunca **o quê**. Proibido: `// Importa o React`, `// Função para calcular a média`, `// Handle error`
- Toda regra do protocolo UEQ no código cita a fonte: `// Handbook UEQ, seção 5: amplitude > 3 indica inconsistência`
- Nada de comentário em inglês misturado com português
- Sem JSDoc em função óbvia

## Estrutura
- Arquivo com mais de ~200 linhas é sinal de que precisa ser quebrado
- Componente faz uma coisa. Lógica de dados fica em Server Component ou rota, não em `useEffect` com `fetch`
- Preferir Server Components e Server Actions do Next. Client Component só onde há interação (questionário, filtros do painel)
- Sem camadas de abstração "para o futuro" (repository genérico, factory, service de uma função só)
- Sem `try/catch` envolvendo tudo. Tratar erro onde dá para fazer algo útil com ele
- Sem `any`. Sem `as unknown as`. Tipos do Prisma e do Zod reaproveitados, não redeclarados

## O que não pode aparecer
- `console.log` esquecido
- Código comentado
- `TODO` sem nome e data (`// TODO(luiza, 12/11): ...` é aceitável)
- Dados falsos (lorem ipsum, "John Doe", "Acme") fora de `data/fixtures` e do seed de desenvolvimento
- Mensagens de erro genéricas ("Something went wrong", "Ocorreu um erro"). Diga o que aconteceu e o que fazer
- README com emoji, badges e seção "✨ Features"

## Commits
- Pequenos e frequentes, em português, imperativo, sem emoji: `calcula alfa de Cronbach por escala`, `valida itens faltando no questionário`
- Um commit por mudança lógica. Nada de "update", "fix", "wip" sozinhos
- Cada membro commita o que conduziu, com a própria conta

## Testes
- O módulo `src/ueq/` tem cobertura completa e testes contra `data/fixtures` (números da planilha oficial)
- Nomes de teste em português descrevendo o comportamento: `it('marca como suspeito quem é inconsistente em 3 escalas')`
- Um teste e2e do fluxo do participante: abrir link, consentir, tentar enviar incompleto, completar, enviar
