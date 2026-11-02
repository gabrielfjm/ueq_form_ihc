# Ferramenta UEQ

Ferramenta web para conduzir estudos de avaliação de experiência do usuário com o UEQ (User Experience Questionnaire), do cadastro do estudo à exportação dos dados.

O pesquisador cria um estudo, define uma ou mais versões do produto e compartilha um link público. O participante entra pelo link, dá o consentimento e responde os 26 itens do diferencial semântico. A ferramenta calcula média, desvio-padrão, intervalo de confiança de 95% e alfa de Cronbach por escala, compara o resultado com o benchmark oficial, aponta respostas inconsistentes e exporta os dados em CSV, inclusive no formato da planilha oficial *UEQ Data Analysis Tool*.

Os pesquisadores trabalham em equipe: o dono de um estudo convida colegas como editores ou leitores, e um sino de notificações avisa sobre convites, respostas novas e mudanças feitas pelos parceiros. Quem entra pela primeira vez faz um tour guiado, e toda página tem a própria ajuda no botão (?).

A página inicial explica o UEQ (escalas, como ler os resultados e o benchmark), lista os estudos que fundamentam o método e dá os créditos aos autores do UEQ e à equipe. É também a tela padrão depois do login.

**Em produção:** https://ferramenta-ueq.vercel.app (Vercel + Neon, região de São Paulo). Cada merge na `main` publica uma versão nova, com as migrations aplicadas no build.

Projeto da disciplina Fundamentos da Interação Humano-Computador, PPGIa · PUCPR · 2026.

Equipe: Gabriel Meira, Jean Weiss e Luiza Pedralli.

Código aberto sob a [licença MIT](LICENSE).

## Documentação

A documentação da ferramenta está sendo escrita pela equipe, em [docs/documentacao/](docs/documentacao/) e em [docs/](docs/); os arquivos aparecem lá à medida que cada um fica pronto. Dentro da própria ferramenta, na aba **Documentação**, pública (http://localhost:3000/documentacao), cada documento aparece como "Em produção" até ser publicado (lista `PRONTOS` em `src/lib/documentacao/catalogo.ts`). O conjunto: requisitos com a sprint em que cada um foi entregue, planilha de requisitos, matriz de rastreabilidade, personas, histórias de usuário, casos de uso, casos e cenários de teste, diagramas de classes e de sequência e a arquitetura no modelo C4.

| Arquivo | Conteúdo |
|---|---|
| [docs/documentacao/](docs/documentacao/) | Arquitetura C4, diagramas de sequência e casos de teste; requisitos, rastreabilidade, personas, histórias, casos de uso, diagrama de classes, modelo lógico e verificação do cálculo em produção |
| [docs/ueq-protocolo.md](docs/ueq-protocolo.md) | Itens, escalas, polaridade e todas as fórmulas do cálculo |
| [docs/ihc.md](docs/ihc.md) | Requisitos de usabilidade e acessibilidade, cada um ligado ao princípio da literatura que o justifica |
| [docs/design.md](docs/design.md) | Identidade visual |
| [docs/codigo.md](docs/codigo.md) | Convenções de código, testes e commits |
| [docs/checklist-manual.md](docs/checklist-manual.md) | Verificações que a equipe faz à mão: leitor de tela, zoom, celular real, daltonismo |
| [data/LEIA-ME.md](data/LEIA-ME.md) | Dados oficiais do UEQ que a equipe precisa preencher a partir das fontes originais |

A meta de acessibilidade é WCAG 2.2 nível AA, base da ABNT NBR 17225:2025.

## Funcionalidades

**Participante**
- Link público em 37 idiomas oficiais do UEQ, com termo de consentimento e os 26 itens na ordem e polaridade oficiais.
- Etapa opcional de dados demográficos, só quando o pesquisador liga. Ela pode ser pulada inteira, e todas as perguntas têm “Prefiro não responder”.

**Pesquisador**
- Estudos com uma ou mais versões (teste A/B), coleta aberta, encerrada e reaberta, e importação de respostas por CSV.
- Painel com média, desvio-padrão, IC 95%, alfa de Cronbach e benchmark oficial por escala, comparação entre versões e exportação em CSV (inclusive no formato da *UEQ Data Analysis Tool*) e em PDF.
- Respostas suspeitas pelas regras do Handbook do UEQ, com inclusão e exclusão da análise sem apagar nada.
- Perfil dos participantes em gráficos: faixa etária, gênero, escolaridade e familiaridade com o produto, por versão.
- **Estudos em equipe**: “Compartilhar” convida uma conta cadastrada pelo e-mail, como Editor (mexe no estudo) ou Leitor (vê e exporta). Excluir o estudo e convidar pessoas fica só com o dono.
- **Sino de notificações**, entre Minha conta e Sair: convites (aceitar e recusar ali mesmo), respostas novas (agrupadas enquanto não lidas) e mudanças feitas pelos parceiros. Os avisos também vão por e-mail quando o envio está configurado.
- **Tour guiado** no primeiro acesso: a pessoa clica nas próprias ações destacadas, pode pular ou fechar quando quiser, e pode rever depois pela ajuda.
- **Ajuda (?)** no cabeçalho de toda página do pesquisador.
- **Administração**, só para superusuários: contas, criar conta para alguém, cenários de demonstração com dados inventados, situação da proteção de dados e todos os estudos.

## Segurança e LGPD

O que a ferramenta faz para cumprir a Lei Geral de Proteção de Dados (Lei 13.709/2018, art. 6º, 18 e 46):

- **Coletar o mínimo:** nada que identifique o participante (sem nome, e-mail, IP ou cookie de rastreamento). Os dados demográficos vêm desligados por padrão em cada estudo, e participações começadas e não enviadas são apagadas em até 2 dias.
- **Criptografia de campo:** os dados demográficos são gravados cifrados com AES-256-GCM (`src/lib/cripto.ts`), com a chave fora do banco. O deploy cifra também os dados gravados antes (`prisma/cifrar-dados.ts`).
- **Em trânsito e em repouso:** HTTPS com HSTS, TLS até o banco e banco cifrado em disco no provedor.
- **Senhas e sessão:** bcrypt com custo 12 (hashes antigos sobem de custo no login), mesmo tempo de resposta com ou sem conta, 5 tentativas erradas por e-mail a cada 15 minutos, cookie de sessão `httpOnly`, `Secure` e `SameSite=Lax`, e só o hash da sessão no banco.
- **Navegador:** Content Security Policy, `frame-ancestors 'none'` contra clickjacking, `Referrer-Policy: same-origin`, `X-Content-Type-Options` e `Permissions-Policy`.
- **Acesso:** cada pessoa só abre os estudos dela ou os compartilhados com ela; toda leitura e alteração passa por `estudoDoPesquisador` (ver, editar, gerenciar).
- **Direitos do titular:** [política de privacidade](https://ferramenta-ueq.vercel.app/privacidade) pública; em Minha conta, “Baixar meus dados” (JSON), correção dos dados, exclusão imediata da conta e desligar os e-mails.

### Variáveis de ambiente

| Variável | Para quê |
|---|---|
| `DATABASE_URL` | Banco PostgreSQL (na Vercel, a integração da Neon preenche) |
| `CHAVE_CRIPTOGRAFIA` | Chave AES-256 dos dados demográficos: 32 bytes em base64, gerada com `openssl rand -base64 32`. **Guarde uma cópia em local seguro: sem ela, os dados cifrados não podem ser lidos.** Sem a variável, os dados ficam sem criptografia de campo, e a página Administração avisa |
| `SMTP_HOST`, `SMTP_PORTA`, `SMTP_USUARIO`, `SMTP_SENHA`, `EMAIL_REMETENTE` | Envio dos convites e notificações por e-mail (Gmail: `smtp.gmail.com`, porta 465 e uma senha de app). Opcional: sem elas, os avisos ficam só no sino |

## Stack

- Next.js (App Router), React e TypeScript em modo `strict`
- PostgreSQL com Prisma
- CSS Modules e variáveis CSS, sem framework de componentes
- Gráficos em SVG feitos à mão
- Zod para validação
- Nodemailer para os e-mails (SMTP) e `node:crypto` para a criptografia de campo
- Vitest para testes de unidade, Playwright com axe-core para testes de ponta a ponta e acessibilidade

## Como rodar

Requisitos: Node.js 24, pnpm 10 e Docker.

```
pnpm install
docker compose up -d
cp .env.example .env
pnpm db:migrate
pnpm db:seed
pnpm dev
```

A aplicação abre em http://localhost:3000.

O seed carrega os 26 itens do UEQ a partir de `data/ueq-itens-ptbr.json`. Enquanto os termos em português não forem preenchidos com o pacote oficial de idiomas, o seed para e indica qual item está faltando.

## Comandos

| Comando | O que faz |
|---|---|
| `pnpm dev` | Servidor local |
| `pnpm db:migrate` | Aplica as migrations do Prisma |
| `pnpm db:seed` | Carrega os itens do UEQ |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | Checagem de tipos |
| `pnpm test` | Testes de unidade (inclui o contraste das cores do tema) |
| `pnpm test:e2e` | Testes de ponta a ponta, com verificação WCAG 2.2 A/AA |
| `pnpm docs:diagramas` | Gera os SVG dos diagramas da documentação, depois de mudar um diagrama Mermaid num `.md` |
| `pnpm suspeitas:recalcular` | Recalcula a marca de suspeita de todas as participações |
| `pnpm dados:cifrar` | Cifra os dados demográficos ainda em texto aberto (roda sozinho em cada deploy) |

Antes de abrir um pull request, `pnpm lint && pnpm typecheck && pnpm test` precisa passar.

## Estrutura

```
src/
  app/            páginas e rotas (pesquisador, participante e API)
  ueq/            cálculo do UEQ em funções puras, testado contra a planilha oficial
  componentes/    componentes de interface
  graficos/       gráficos em SVG
  styles/         tokens de cor, tipografia e espaçamento
  lib/            banco, sessão, permissões, criptografia, notificações, e-mail e validação
  lib/cenarios/   cenários de demonstração com respostas sintéticas
prisma/           schema e seed
scripts/          geração dos diagramas da documentação
data/             itens, benchmark, parâmetros do protocolo e fixtures de teste
docs/             especificação, requisitos e protótipos
tests/e2e/        testes Playwright
```

## Protótipos

**Protótipo navegável:** https://claude.ai/artifact/GTXgzTaWbf5STw3z9r76U1

Todas as telas, de baixa e alta fidelidade, num canvas único. No modo Play, os botões e links levam de uma tela para a outra, como no sistema. As notas ao lado de cada fileira explicam as decisões de interface e o princípio de IHC de cada uma.

Nos dois níveis, os termos dos itens e os valores do gráfico são marcadores: os termos reais vêm do pacote oficial de idiomas do UEQ e os limites do benchmark, da planilha oficial.

## Protótipos de alta fidelidade

Como as telas vão ficar em produção, em [docs/prototipos/alta-fidelidade/](docs/prototipos/alta-fidelidade/). Seguem [docs/design.md](docs/design.md): fundo branco, azul-petróleo para destaque, vermelho só para alerta, Atkinson Hyperlegible no texto e Source Sans 3 nos números. Ícones aparecem só nas ações do pesquisador, sempre com texto; as telas do participante não têm ícones, para não interferir na resposta.

### Participante

<p>
<img src="docs/prototipos/alta-fidelidade/p1-consentimento.png" alt="Consentimento: etapas no topo, fileira de sete marcações, termo com tempo, participação, anonimato e uso dos dados, botão Concordo e quero participar" width="200">
<img src="docs/prototipos/alta-fidelidade/p2-questionario-celular.png" alt="Questionário no celular: cada item com os dois termos acima de sete círculos, rodapé com 8 de 26 respondidos e Sair sem enviar" width="200">
<img src="docs/prototipos/alta-fidelidade/p3-questionario-item-faltando.png" alt="Envio com item faltando: resumo Faltam 2 itens em vermelho com links, item 7 com borda e texto Este item não foi respondido" width="200">
<img src="docs/prototipos/alta-fidelidade/p4-dados-opcionais.png" alt="Dados opcionais: faixa etária, gênero, escolaridade e familiaridade, todas com Prefiro não responder, botões Continuar e Pular esta etapa" width="200">
<img src="docs/prototipos/alta-fidelidade/p5-fim.png" alt="Fim: etapas concluídas, sete marcações preenchidas e Respostas registradas" width="200">
<img src="docs/prototipos/alta-fidelidade/p6-link-fechado.png" alt="Link fechado: estudo em rascunho ou coleta encerrada" width="200">
</p>

<img src="docs/prototipos/alta-fidelidade/p7-questionario-desktop.png" alt="Questionário no desktop com os 26 itens e rodapé fixo com o progresso e o link Sair sem enviar" width="800">

"Sair sem enviar" confirma numa janela, com o foco em Continuar respondendo:

<img src="docs/prototipos/alta-fidelidade/p8-sair-sem-enviar.png" alt="Janela Sair sem enviar? Nada do que você marcou será gravado, com os botões Sair sem enviar e Continuar respondendo sobre o questionário escurecido" width="800">

### Pesquisador

Entrar e criar conta, com o painel lateral sobre o instrumento:

<img src="docs/prototipos/alta-fidelidade/r1-entrar.png" alt="Entrar: formulário à esquerda e painel com a fileira de sete marcações e as seis escalas do UEQ" width="400"> <img src="docs/prototipos/alta-fidelidade/r2-cadastrar-com-erro.png" alt="Criar conta com erro no e-mail e painel com o percurso da ferramenta em quatro passos" width="400">

Lista de estudos, criação com prévia do termo e estudo em rascunho:

<img src="docs/prototipos/alta-fidelidade/r3-estudos.png" alt="Seus estudos: tabela com status em ponto colorido e régua do período de coleta" width="400"> <img src="docs/prototipos/alta-fidelidade/r4-criar-estudo.png" alt="Criar estudo: seções numeradas e prévia do termo para o participante ao lado" width="400">

<img src="docs/prototipos/alta-fidelidade/r4b-estudo-em-rascunho.png" alt="Estudo em rascunho: estado vazio com Abrir coleta, lista Antes de abrir confira e ficha do estudo" width="400">

Página do estudo e resultados:

<img src="docs/prototipos/alta-fidelidade/r5-pagina-do-estudo.png" alt="Página do estudo: link para participantes, coleta por versão, próximos passos, ações e ficha lateral" width="400"> <img src="docs/prototipos/alta-fidelidade/r6-resultados.png" alt="Resultados: leitura rápida, gráfico das seis escalas com benchmark e IC95, tabela, médias por item e exportação" width="400">

Comparação entre versões, respostas suspeitas e minha conta:

<img src="docs/prototipos/alta-fidelidade/r7-comparar-versoes.png" alt="Comparar versões: marcador cheio e vazado por escala, leitura rápida das diferenças e tabela" width="400"> <img src="docs/prototipos/alta-fidelidade/r8-respostas-e-suspeitas.png" alt="Respostas: faixa com as 34 participações, tabela com suspeitas e regra de suspeita ao lado" width="400">

<img src="docs/prototipos/alta-fidelidade/r9-minha-conta.png" alt="Minha conta: dados cadastrais, troca de senha, exclusão da conta e resumo da conta" width="400">

Documentação dentro da ferramenta: visão geral, documento com diagrama e documento com downloads:

<img src="docs/prototipos/alta-fidelidade/r10-documentacao.png" alt="Documentação: abas das sete seções, índice dos documentos e ficha Sobre este documento" width="400"> <img src="docs/prototipos/alta-fidelidade/r11-documento-casos-de-uso.png" alt="Modelagem, Casos de uso: sub-abas dos documentos, diagrama com legenda e Abrir em tamanho real, ficha com Nesta página" width="400">

<img src="docs/prototipos/alta-fidelidade/r12-documento-requisitos.png" alt="Requisitos: tabela dos requisitos e ficha com os downloads da planilha e do CSV" width="400"> <img src="docs/prototipos/alta-fidelidade/r13-documentacao-sem-login.png" alt="Documentação sem login: barra só com Documentação e Entrar" width="400">

Diagrama em tela cheia, com zoom, e barra fixa no celular com o menu aberto:

<img src="docs/prototipos/alta-fidelidade/r14-diagrama-tela-cheia.png" alt="Diagrama em tela cheia: Voltar, título e zoom em 150% parados no topo, com o diagrama ampliado embaixo" width="400"> <img src="docs/prototipos/alta-fidelidade/r15-barra-celular.png" alt="Barra fixa no celular com o menu aberto: Estudos, Criar estudo, Documentação, Minha conta e Sair" width="200">

Página inicial, para quem ainda não tem conta, e Entrar e Criar conta numa janela por cima da página:

<img src="docs/prototipos/alta-fidelidade/r16-pagina-inicial.png" alt="Página inicial: apresentação com o item 1 do questionário como figura, Nesta página, o que é o UEQ, as seis escalas, como ler os resultados e o benchmark, como a ferramenta funciona, estudos sobre o método e créditos" width="400"> <img src="docs/prototipos/alta-fidelidade/r17-entrar-janela.png" alt="Janela de Entrar sobre a página inicial escurecida: formulário à esquerda e painel com as escalas do UEQ à direita" width="400">

<img src="docs/prototipos/alta-fidelidade/r19-criar-conta-janela.png" alt="Janela de Criar conta: nome e e-mail lado a lado, senha, Criar conta junto de Entrar e da política de privacidade, e os quatro passos do estudo à direita" width="400"> <img src="docs/prototipos/alta-fidelidade/r18-entrar-celular.png" alt="Entrar no celular: a janela ocupa a tela inteira, com o formulário em cima e o resumo do instrumento embaixo" width="200">

Confirmações em janela, para sair e para toda exclusão:

<img src="docs/prototipos/alta-fidelidade/r20-sair-confirmacao.png" alt="Sair da conta? Janela com o aviso de que os estudos continuam salvos, Cancelar e Sair" width="400"> <img src="docs/prototipos/alta-fidelidade/r21-excluir-estudo.png" alt="Excluir este estudo? Janela com o aviso em vermelho do que vai junto, o campo para digitar o título, Cancelar e Excluir definitivamente" width="400">

<img src="docs/prototipos/alta-fidelidade/r22-excluir-conta.png" alt="Excluir sua conta? Janela com o aviso dos estudos e respostas que vão junto e o campo para digitar o e-mail" width="400">

Enquanto a equipe escreve a documentação, cada documento aparece como em produção:

<img src="docs/prototipos/alta-fidelidade/r23-documento-em-producao.png" alt="Casos de uso em produção: abas e sub-abas da documentação, fileira de marcações vazia, aviso Em produção e ficha com o que o documento vai trazer" width="400">

A página inicial com login, que é a tela padrão depois de entrar e aonde o logotipo leva:

<img src="docs/prototipos/alta-fidelidade/r16b-pagina-inicial-com-login.png" alt="Página inicial com login: barra do pesquisador, Ver seus estudos e Criar estudo, e as mesmas seções sobre o UEQ, os estudos do método e os créditos" width="400">

Equipe, notificações, ajuda e LGPD:

<img src="docs/prototipos/alta-fidelidade/r24-administracao.png" alt="Administração: contas, criar conta para alguém, cenários de demonstração, situação da proteção de dados e todos os estudos" width="400"> <img src="docs/prototipos/alta-fidelidade/r25-compartilhar.png" alt="Janela Compartilhar: convite por e-mail com papel Editor ou Leitor e a lista de pessoas com acesso" width="400">

<img src="docs/prototipos/alta-fidelidade/r26-sino-de-notificacoes.png" alt="Sino de notificações aberto entre Minha conta e Sair: convite com Aceitar e Recusar, respostas novas e mudanças da equipe" width="400"> <img src="docs/prototipos/alta-fidelidade/r27-notificacoes.png" alt="Notificações: convites esperando resposta e o histórico de avisos" width="400">

<img src="docs/prototipos/alta-fidelidade/r28-tour-boas-vindas.png" alt="Boas-vindas do primeiro acesso: Pular tutorial e Começar o tour" width="400"> <img src="docs/prototipos/alta-fidelidade/r29-tour-passo.png" alt="Passo do tour: a página escurecida em volta do estudo destacado e o cartão Passo 1 de 10" width="400">

<img src="docs/prototipos/alta-fidelidade/r30-ajuda-da-pagina.png" alt="Janela de ajuda da página Respostas, aberta pelo botão (?), com Rever o tour guiado" width="400"> <img src="docs/prototipos/alta-fidelidade/r31-perfil-dos-participantes.png" alt="Perfil dos participantes: quatro gráficos de barras horizontais, um por pergunta demográfica, com filtro de versão" width="400">

<img src="docs/prototipos/alta-fidelidade/r32-dados-do-participante.png" alt="Criar estudo, seção Dados do participante: caixa para coletar dados demográficos com o aviso de LGPD e a prévia com as etapas" width="400"> <img src="docs/prototipos/alta-fidelidade/r33-politica-de-privacidade.png" alt="Política de privacidade pública: quem cuida dos dados, participantes, pesquisadores, direitos e proteção" width="400">

## Protótipos de baixa fidelidade

Esboços desenhados à mão antes da alta fidelidade, em [docs/prototipos/](docs/prototipos/).

### Participante

Fluxo: consentimento, questionário, dados opcionais e fim. A validação acontece só no envio: um resumo no topo leva a cada item que faltou.

<p>
<img src="docs/prototipos/p1-consentimento.png" alt="Consentimento: título do estudo, termo com participação voluntária e anônima, botão Concordo e quero participar" width="200">
<img src="docs/prototipos/p2-questionario-celular.png" alt="Questionário no celular: cada item com os dois termos acima de sete círculos, rodapé com progresso e Sair sem enviar" width="200">
<img src="docs/prototipos/p3-questionario-item-faltando.png" alt="Envio com item faltando: resumo Faltam 2 itens com links, item 7 marcado como não respondido" width="200">
<img src="docs/prototipos/p4-dados-opcionais.png" alt="Dados opcionais: quatro perguntas com Prefiro não responder, botões Continuar e Pular esta etapa" width="200">
<img src="docs/prototipos/p5-fim.png" alt="Fim: Respostas registradas, você já pode fechar esta página" width="200">
<img src="docs/prototipos/p6-link-fechado.png" alt="Link fechado: estudo ainda não aberto ou coleta encerrada" width="200">
</p>

<img src="docs/prototipos/p7-questionario-desktop.png" alt="Questionário no desktop: termo esquerdo, sete círculos e termo direito na mesma linha; rodapé com confirmação de saída em linha" width="800">

### Pesquisador

Entrar e criar conta (com o resumo de erros):

<img src="docs/prototipos/r1-entrar.png" alt="Entrar: e-mail, senha com botão Mostrar, botão Entrar" width="400"> <img src="docs/prototipos/r2-cadastrar-com-erro.png" alt="Criar conta com erro: resumo Corrija 1 campo, e-mail marcado com Esse e-mail já tem conta" width="400">

Lista de estudos e criação de estudo com versões:

<img src="docs/prototipos/r3-estudos.png" alt="Estudos: tabela com título, produto, status, versões, respostas e última resposta" width="400"> <img src="docs/prototipos/r4-criar-estudo.png" alt="Criar estudo: título, produto, objetivo, datas e lista de versões" width="400">

Página do estudo, com link público, versões e exclusão confirmada em linha:

<img src="docs/prototipos/r5-pagina-do-estudo.png" alt="Página do estudo: status, resumo, link para participantes, versões e ações com confirmação de exclusão" width="800">

Resultados por escala com benchmark, tabela, médias por item e exportação:

<img src="docs/prototipos/r6-resultados.png" alt="Resultados: gráfico das seis escalas com faixas do benchmark e intervalo de confiança, tabela, médias por item e links de exportação" width="800">

Comparação entre versões e controle de respostas suspeitas:

<img src="docs/prototipos/r7-comparar-versoes.png" alt="Comparar versões: um marcador cheio e um vazado por escala" width="400"> <img src="docs/prototipos/r8-respostas-e-suspeitas.png" alt="Respostas: tabela de participações com escalas inconsistentes, suspeita e caixa Na análise" width="400">

Minha conta:

<img src="docs/prototipos/r9-minha-conta.png" alt="Minha conta: dados cadastrais, senha e exclusão da conta" width="400">

Documentação: visão geral e documento com sub-abas:

<img src="docs/prototipos/r10-documentacao.png" alt="Documentação: abas das seções, tabela de documentos e ficha lateral" width="400"> <img src="docs/prototipos/r11-documento.png" alt="Documento: seção Modelagem, sub-abas, diagrama e ficha Sobre este documento" width="400">

## Créditos

O UEQ foi criado por Bettina Laugwitz, Theo Held e Martin Schrepp (Laugwitz, Held e Schrepp, 2008). O benchmark, a versão curta (UEQ-S) e o guia de aplicação são de Martin Schrepp, Andreas Hinderks e Jörg Thomaschewski (2014, 2017). A versão em português é de Manuel Pérez Cota, Jörg Thomaschewski, Martin Schrepp e Ramiro Gonçalves (2014). Todo o material oficial está em [ueq-online.org](https://www.ueq-online.org). Esta ferramenta não é oficial nem ligada aos autores do método.

A ferramenta foi feita por Gabriel Meira, Jean Weiss e Luiza Pedralli como projeto da disciplina Fundamentos da Interação Humano-Computador do Programa de Pós-Graduação em Informática (PPGIa) da PUCPR, em 2026.

## Licença

O código, a documentação e os protótipos da equipe estão sob a [licença MIT](LICENSE): qualquer pessoa pode usar, copiar, modificar e distribuir, inclusive para fins comerciais, desde que mantenha o aviso de copyright e o texto da licença. O software é oferecido sem garantia.

A licença MIT não cobre o material oficial do UEQ copiado para `data/`: os termos dos itens nos 37 idiomas, as instruções e os limites do benchmark. Esse material pertence aos autores do UEQ (Laugwitz, Held, Schrepp e colaboradores) e é distribuído em [ueq-online.org](https://www.ueq-online.org). Antes de usar esses dados fora desta ferramenta, confira as condições de uso no site oficial.

As fontes Atkinson Hyperlegible Next e Source Sans 3 são carregadas pelo `next/font` e seguem a SIL Open Font License.
