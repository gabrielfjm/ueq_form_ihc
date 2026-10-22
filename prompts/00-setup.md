# 00 · Setup do projeto

> Rodar com o repositório vazio contendo só CLAUDE.md, docs/ e data/.

```
Leia CLAUDE.md, docs/ihc.md, docs/design.md e docs/codigo.md inteiros antes de começar.

Crie o esqueleto do projeto conforme a stack e a estrutura de pastas do CLAUDE.md:
- Next.js com App Router, TypeScript strict, pnpm, ESLint
- Prisma configurado para PostgreSQL, lendo DATABASE_URL do .env (crie .env.example, não .env)
- docker-compose.yml só com o Postgres 16 para desenvolvimento
- Vitest e Playwright configurados, com um teste vazio de cada só para provar que rodam
- scripts do package.json exatamente com os nomes listados em "Comandos" no CLAUDE.md
- src/styles/tokens.css com as variáveis de docs/design.md, e um globals.css que aplica papel, tinta, as três fontes via next/font e o estilo de foco
- `<html lang="pt-BR">`, link "Pular para o conteúdo" no layout raiz, estilos de `prefers-reduced-motion` e `forced-colors` no globals.css
- @axe-core/playwright instalado e um helper `verificarAcessibilidade(page)` em tests/e2e/ que falha em qualquer violação WCAG 2.2 A ou AA
- src/styles/__tests__/contraste.test.ts que lê tokens.css, calcula a razão de contraste WCAG dos pares listados em docs/design.md e falha abaixo de 4.5:1 (texto) ou 3:1 (bordas de campo, marcadores, foco)
- Uma página inicial provisória com só o nome "Ferramenta UEQ" em Newsreader e uma frase em Atkinson, para eu conferir fontes e cores

Não instale Tailwind, shadcn, biblioteca de componentes nem de gráficos. Não crie páginas além da inicial. Não escreva README ainda.

Quando terminar, rode lint, typecheck e test e me diga em até 5 linhas o que foi criado e qualquer decisão que você tomou sozinho.
```
