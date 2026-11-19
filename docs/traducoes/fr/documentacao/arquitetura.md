# Architecture

L'architecture est décrite avec le [modèle C4](https://c4model.com), à trois niveaux de zoom :

1. **Contexte :** qui utilise l'outil et avec quels systèmes il est en relation ;
2. **Conteneurs :** les parties qui s'exécutent séparément (application, base de données, générateur de PDF, scripts) et comment elles communiquent ;
3. **Composants :** comment l'application Next.js est organisée à l'intérieur.

Un quatrième diagramme montre le déploiement, en production et en développement.

Les diagrammes utilisent Mermaid, que GitHub dessine directement dans la page. Chaque boîte porte le nom, le type entre crochets et la technologie. Les flèches indiquent ce qui passe et par quel protocole. Juste sous chaque diagramme figurent l'outil utilisé, le fichier source à télécharger et la version de l'outil qu'il représente.

## Vue d'ensemble

L'Outil UEQ est une application web unique en **Next.js 16 (App Router)** avec **React 19** et **TypeScript strict**, qui stocke les données dans un **PostgreSQL 16** via **Prisma 7**. Il est en ligne sur [ferramenta-ueq.vercel.app](https://ferramenta-ueq.vercel.app), sur Vercel, avec la base de données chez Neon, région de São Paulo.

- Il n'y a pas d'API REST séparée. Les pages sont des Server Components qui lisent la base de données sur le serveur. Les écritures sont des Server Actions appelées par les formulaires.
- Seul ce qui renvoie un fichier est une route d'API : les exportations en CSV, le tableau de bord en PDF, les données du compte et les téléchargements de la documentation.
- Le calcul de l'UEQ est isolé dans `src/ueq/`, en fonctions pures, pour être testé par rapport au tableur officiel sans base de données ni interface.
- Les paramètres du protocole, le benchmark et les textes officiels des 37 langues sont des fichiers JSON versionnés dans `data/`, avec la source de chaque valeur.
- L'interface du chercheur et les textes des études sont traduits à la demande par l'API de Claude, avec le résultat stocké dans la base de données. Le questionnaire n'utilise que les traductions officielles de l'UEQ.

## Niveau 1 · Contexte

```mermaid
flowchart TB
    pesquisador["<b>Researcher</b><br/>[Person]<br/>Creates studies, monitors data collection,<br/>interprets and exports the results.<br/>Can work in a team"]
    participante["<b>Participant</b><br/>[Person]<br/>Answers the questionnaire through the link,<br/>without an account and anonymously"]
    administrador["<b>Administrator</b><br/>[Person]<br/>A researcher who creates accounts,<br/>monitors languages and data protection"]
    mantenedor["<b>Maintainer</b><br/>[Person]<br/>Installs, loads the official items<br/>and adjusts the parameters"]

    ferramenta["<b>UEQ Tool</b><br/>[Software system]<br/>Runs studies with the User Experience<br/>Questionnaire, from setup to export"]

    claude["<b>Claude API</b><br/>[External system · Anthropic]<br/>Translates the interface and the study texts"]
    smtp["<b>Email server</b><br/>[External system · SMTP]<br/>Delivers invitations and notices"]
    planilha["<b>UEQ Data Analysis Tool</b><br/>[External system · Excel spreadsheet V15]<br/>Official UEQ analysis tool"]
    ueqonline["<b>ueq-online.org</b><br/>[External system]<br/>Official Handbook, language pack<br/>and benchmark"]
    canais["<b>Messaging channels</b><br/>[External system]<br/>WhatsApp, email"]

    pesquisador -- "uses through the browser<br/>[HTTPS]" --> ferramenta
    participante -- "answers through the link /r/slug<br/>[HTTPS]" --> ferramenta
    administrador -- "uses through the browser<br/>[HTTPS]" --> ferramenta
    mantenedor -- "runs migrations, seed<br/>and recalculation [CLI]" --> ferramenta
    ferramenta -- "requests translations, without responses<br/>or personal data [HTTPS]" --> claude
    ferramenta -- "sends invitations and notices<br/>[SMTP]" --> smtp
    smtp -- "delivers the notice" --> pesquisador
    pesquisador -- "sends the study link" --> canais
    canais -- "delivers the link" --> participante
    pesquisador -- "pastes the exported CSV<br/>to check the numbers" --> planilha
    mantenedor -- "copies items, instructions,<br/>thresholds and benchmark to data/" --> ueqonline

    classDef pessoa fill:#0F1720,stroke:#0F1720,color:#FFFFFF
    classDef sistema fill:#0B6A78,stroke:#0F1720,color:#FFFFFF
    classDef externo fill:#F3F5F7,stroke:#7A8691,color:#0F1720
    class pesquisador,participante,administrador,mantenedor pessoa
    class ferramenta sistema
    class claude,smtp,planilha,ueqonline,canais externo
```

**Outil du diagramme :** Mermaid 12.2.0 (`flowchart`), généré par `pnpm docs:diagramas`. **Fichier source :** [arquitetura-1.mmd](fontes/arquitetura-1.mmd). **Version représentée :** Outil UEQ du 06/11/2026.

À l'exécution, l'outil n'appelle que deux systèmes externes, et tous deux sont facultatifs :

- **API de Claude :** sans `ANTHROPIC_API_KEY`, l'interface reste en portugais et les textes des études restent dans leur langue d'origine. Ce qui part vers l'API, ce sont les textes de l'interface et le titre, le produit, l'objectif et les noms de version de chaque étude. Aucune réponse, aucun nom, aucune adresse e-mail ni aucune donnée démographique n'y part.
- **Serveur de messagerie :** sans les variables `SMTP_*`, les avis restent seulement dans la cloche, et la personne qui invite reçoit un lien e-mail prêt à envoyer elle-même.

Le tableur officiel et le site de l'UEQ entrent par des personnes : l'équipe copie les données officielles dans `data/` (avec la source dans chaque fichier). L'exportation du tableur officiel part d'une copie sans modification de l'UEQ Data Analysis Tool V15 dans `data/planilha-oficial/`, et le chercheur l'ouvre dans Excel pour vérifier les nombres.

## Niveau 2 · Conteneurs

```mermaid
flowchart TB
    pesquisador["<b>Researcher</b><br/>[Person]"]
    participante["<b>Participant</b><br/>[Person]"]
    mantenedor["<b>Maintainer</b><br/>[Person]"]
    claude["<b>Claude API</b><br/>[External system]"]
    smtp["<b>Email server</b><br/>[External system]"]

    subgraph fronteira["UEQ Tool"]
        direction TB
        navegador["<b>Browser interface</b><br/>[Container · React 19, CSS Modules]<br/>HTML rendered on the server and Client Components<br/>only where there is interaction: questionnaire, dialogs,<br/>tour, filters and forms"]
        app["<b>Web application</b><br/>[Container · Next.js 16 App Router, Node.js 24]<br/>Server Components, Server Actions,<br/>Route Handlers and session proxy.<br/>Contains the calculation module src/ueq"]
        pdf["<b>PDF generator</b><br/>[Container · headless Chromium via Playwright]<br/>Opened on demand by the application<br/>to print the dashboard on A4"]
        banco[("<b>Database</b><br/>[Container · PostgreSQL 16]<br/>Accounts, sessions, studies, versions, items,<br/>participations, responses, notifications<br/>and translations")]
        dados[/"<b>Official data</b><br/>[Container · JSON files in data/]<br/>Items, instructions and texts of the 37 languages,<br/>protocol and benchmark, with the source"/]
        scripts["<b>Maintenance scripts</b><br/>[Container · Prisma CLI and tsx]<br/>migrate, item seed, recalculation of<br/>suspicious responses, encryption, catalog and diagrams"]
    end

    pesquisador -- "uses [HTTPS]" --> navegador
    participante -- "uses [HTTPS]" --> navegador
    mantenedor -- "runs [pnpm]" --> scripts

    navegador -- "requests pages and calls Server Actions<br/>[HTTPS, RSC]; downloads CSV, JSON and PDF [HTTPS GET]" --> app
    app -- "reads and writes<br/>[SQL via Prisma Client and pg adapter]" --> banco
    app -- "imports at build time<br/>[JSON import]" --> dados
    app -- "opens the print page<br/>with the requester's session [internal HTTP]" --> pdf
    pdf -- "GET /estudos/id/resultados/impressao<br/>[HTTP, internal origin]" --> app
    app -- "translates in batches<br/>[HTTPS, Anthropic SDK]" --> claude
    app -- "sends after responding<br/>[SMTP, Nodemailer]" --> smtp
    scripts -- "applies migrations, writes items,<br/>updates suspicious flags, encrypts demographics [SQL]" --> banco
    scripts -- "reads and validates with Zod" --> dados

    classDef pessoa fill:#0F1720,stroke:#0F1720,color:#FFFFFF
    classDef container fill:#0B6A78,stroke:#0F1720,color:#FFFFFF
    classDef armazenamento fill:#E6F2F4,stroke:#0B6A78,color:#0F1720
    classDef externo fill:#F3F5F7,stroke:#7A8691,color:#0F1720
    class pesquisador,participante,mantenedor pessoa
    class navegador,app,pdf,scripts container
    class banco,dados armazenamento
    class claude,smtp externo
```

**Outil du diagramme :** Mermaid 12.2.0 (`flowchart`), généré par `pnpm docs:diagramas`. **Fichier source :** [arquitetura-2.mmd](fontes/arquitetura-2.mmd). **Version représentée :** Outil UEQ du 06/11/2026.

| Conteneur | Technologie | Responsabilité | Où il se trouve |
|---|---|---|---|
| Interface dans le navigateur | React 19.3, CSS Modules, variables CSS, SVG fait à la main | Afficher les écrans et gérer l'interaction. Sans bibliothèque de composants ni de graphiques | `src/app/**/*.tsx` avec `"use client"`, `src/componentes/`, `src/graficos/`, `src/styles/` |
| Application web | Next.js 16.4, Node.js 24, Zod 4, bcryptjs, Nodemailer, SDK d'Anthropic | Rendre les pages, valider et enregistrer les données, protéger l'espace du chercheur, générer les exportations, traduire et avertir | `src/app/`, `src/lib/`, `src/ueq/`, `src/idiomas/`, `src/traducao/`, `src/proxy.ts` |
| Générateur de PDF | Playwright 1.64 avec son Chromium en développement et `@sparticuz/chromium-min` 153 sur Vercel | Imprimer le tableau de bord en PDF avec des graphiques vectoriels | `src/app/api/estudos/[id]/painel-pdf/route.ts` |
| Base de données | PostgreSQL 16 (Docker en développement, Neon en production) | Persister le modèle de domaine, avec cascade et `CHECK`. Détails dans le [modèle logique](modelo-logico.md) | `prisma/schema.prisma`, `prisma/migrations/`, `docker-compose.yml` |
| Données officielles | JSON versionné | Source unique des items, instructions, protocole et benchmark, chacun avec le champ `fonte` | `data/` |
| Documentation | Markdown et SVG versionnés | Les documents affichés par l'onglet Documentation, les diagrammes déjà dessinés et le fichier source de chacun | `docs/`, `docs/documentacao/diagramas/`, `docs/documentacao/fontes/` |
| Scripts de maintenance | Prisma CLI, tsx | Créer la base de données, charger les items, recalculer les suspicions, chiffrer les anciennes données, générer le catalogue de textes et les diagrammes | `prisma/seed.ts`, `prisma/recalcular-suspeitas.ts`, `prisma/cifrar-dados.ts`, `scripts/` |

## Niveau 3 · Composants de l'application web

```mermaid
flowchart TB
    navegador["<b>Browser interface</b><br/>[Container]"]
    pdf["<b>PDF generator</b><br/>[Container]"]
    banco[("<b>PostgreSQL</b><br/>[Container]")]
    dados[/"<b>data/*.json</b><br/>[Container]"/]
    docsMd[/"<b>docs/*.md</b><br/>[repository files]"/]
    claude["<b>Claude API</b><br/>[External system]"]
    smtp["<b>Email server</b><br/>[External system]"]

    subgraph app["Web application · Next.js"]
        direction TB
        proxy["<b>Session proxy</b><br/>[src/proxy.ts]<br/>Sends anyone without a cookie to Log in,<br/>keeping the requested page"]

        subgraph rotas["Routes"]
            direction LR
            publico["<b>Public pages</b><br/>[app/(ferramenta)/(publico)]<br/>Home page, Log in and Create account dialogs,<br/>Documentation and Privacy policy"]
            areaPesq["<b>Researcher area</b><br/>[app/(ferramenta)/(pesquisador)]<br/>Studies, Results, Responses, Import,<br/>Notifications, My account and Administration"]
            areaPart["<b>Participant link</b><br/>[app/r/[slug]]<br/>Own root layout with lang and dir;<br/>consent, policy, questionnaire,<br/>optional data, end"]
            api["<b>Download routes</b><br/>[app/api]<br/>exportar/[tipo], painel-pdf,<br/>conta/dados and documentacao"]
        end

        subgraph servicos["Services · src/lib"]
            direction LR
            sessao["<b>Session and account</b><br/>sessao.ts, senhas.ts, tentativas.ts,<br/>validacao-conta.ts, administracao.ts"]
            estudos["<b>Studies</b><br/>estudos.ts, validacao-estudo.ts,<br/>status-estudo.ts, periodo.ts<br/>access (owner, editor, viewer), slug"]
            participacao["<b>Participation</b><br/>participacao.ts, balanceamento.ts,<br/>demografia.ts, cripto.ts, itens-ueq.ts"]
            resultados["<b>Results</b><br/>resultados.ts, participacoes.ts,<br/>leitura-rapida.ts, perfil-demografico.ts"]
            arquivos["<b>Files</b><br/>exportacoes.ts, exportar-estudo.ts,<br/>csv.ts, importacao.ts"]
            avisos["<b>Notices</b><br/>notificacoes.ts, email.ts,<br/>modelo-email.ts"]
            banco_lib["<b>Database access</b><br/>banco.ts + Prisma Client<br/>generated in src/generated/prisma"]
        end

        ueq["<b>Calculation module</b><br/>[src/ueq · pure functions]<br/>recoding, statistics, scales,<br/>alpha, benchmark, inconsistency"]
        idiomas["<b>Participant languages</b><br/>[src/idiomas]<br/>37 languages, negotiation via the browser,<br/>typed texts, plurals and lists"]
        traducao["<b>Interface translation</b><br/>[src/traducao]<br/>t() and m(), text catalog,<br/>database cache and Claude API"]
        ui["<b>Components and charts</b><br/>[src/componentes, src/graficos]<br/>ItemDiferencial, forms, dialogs, tour,<br/>EscalasComBenchmark, MediasPorItem, Demografia"]
        docsLib["<b>Document reader</b><br/>[src/lib/documentacao]<br/>catalog, Markdown with marked,<br/>links and anchors as on GitHub"]
    end

    navegador --> proxy
    proxy --> areaPesq
    proxy --> api
    navegador --> publico
    navegador --> areaPart

    publico --> sessao
    publico --> traducao
    publico --> docsLib
    areaPesq --> sessao
    areaPesq --> estudos
    areaPesq --> resultados
    areaPesq --> arquivos
    areaPesq --> avisos
    areaPesq --> traducao
    areaPesq --> ui
    areaPart --> participacao
    areaPart --> idiomas
    areaPart --> traducao
    areaPart --> avisos
    areaPart --> ui
    areaPart --> ueq
    api --> sessao
    api --> arquivos
    api --> docsLib
    api -- "opens the print page" --> pdf
    docsLib -. ".md and SVG of the diagrams" .-> docsMd

    resultados --> ueq
    arquivos --> ueq
    arquivos --> resultados
    sessao --> banco_lib
    estudos --> banco_lib
    participacao --> banco_lib
    resultados --> banco_lib
    arquivos --> banco_lib
    avisos --> banco_lib
    traducao --> banco_lib
    banco_lib -- "SQL" --> banco
    traducao -- "translates in batches" --> claude
    avisos -- "sends" --> smtp

    resultados -. "protocol and benchmark" .-> dados
    idiomas -. "terms and instructions" .-> dados
    areaPart -. "protocol" .-> dados
```

**Outil du diagramme :** Mermaid 12.2.0 (`flowchart`), généré par `pnpm docs:diagramas`. **Fichier source :** [arquitetura-3.mmd](fontes/arquitetura-3.mmd). **Version représentée :** Outil UEQ du 06/11/2026.

Le `matcher` de [`src/proxy.ts`](../../src/proxy.ts) exclut ce qui n'exige jamais de session : `/entrar`, `/cadastrar`, `/privacidade`, `/r/`, `/documentacao`, `/api/documentacao` et les icônes du site. La racine `/` passe par le proxy et continue sans cookie. Toute nouvelle route du chercheur naît déjà protégée. Le lien du participant a sa propre mise en page racine, sans barre et sans lien vers le reste de l'outil : la personne qui répond ne voit que le formulaire, le sélecteur de langue et la politique de confidentialité, qui a une version sur `/r/<slug>/privacidade`.

### Règles de dépendance

- **`src/ueq/` ne dépend de rien dans le projet.** Il n'importe ni Prisma, ni React, ni Next, ni `src/lib`. Il reçoit des nombres et renvoie des objets. C'est ce qui permet de le tester par rapport au tableur officiel.
- **Les composants et les graphiques ne connaissent pas Prisma.** Ils reçoivent des données prêtes par props.
- **Chaque page, Server Action et route du chercheur vérifie la session dans la base de données et l'accès à l'étude**, pas seulement le proxy. L'accès passe toujours par `estudoDoPesquisador(id, pessoa, "ver" | "editar" | "gerenciar")` ou par `filtroDeAcesso`. Sans accès, la réponse est identique à celle d'une étude qui n'existe pas.
- **L'administrateur ne voit pas les études d'autres personnes.** Les réponses sont des données de recherche de la personne qui mène l'étude. Les pages d'Administration répondent 404 à qui n'est pas administrateur.
- **Les routes du participant ne lisent que ce que le participant peut voir :** titre, produit, objectif et statut de l'étude. Rien du chercheur et rien de l'analyse.
- **Les paramètres du protocole ne sont jamais dans le code.** Ils viennent de `data/protocolo.json` et `data/benchmark.json`.
- **Le texte d'écran du chercheur passe par `t()` ou `m()`,** et `pnpm i18n:catalogo` génère le catalogue. Le texte du participant se trouve dans `src/idiomas/textos/`, un fichier par langue.

## Sécurité et LGPD

| Mesure | Où elle se trouve |
|---|---|
| En-têtes de sécurité dans chaque réponse : CSP, HSTS, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` et `Permissions-Policy` | `next.config.ts` |
| Mot de passe en bcrypt coût 12, avec un hachage refait à la connexion quand le coût augmente | `src/lib/senhas.ts` |
| 5 mots de passe erronés en 15 minutes bloquent l'adresse e-mail, comptée par son hachage | `src/lib/tentativas.ts` |
| Session dans la base de données par le hachage du jeton, avec un cookie `httpOnly` et `secure` en production | `src/lib/sessao.ts` |
| Données démographiques chiffrées avec AES-256-GCM, avec la clé hors de la base de données | `src/lib/cripto.ts`, `prisma/cifrar-dados.ts` |
| Collecte démographique désactivée par défaut dans chaque étude | `Estudo.coletarDemografia` |
| Une participation abandonnée depuis plus de 2 jours est supprimée | `src/app/r/[slug]/acoes.ts` |
| Télécharger ses propres données et supprimer le compte, sans rien demander à personne | `src/app/api/conta/dados/route.ts`, `conta/` |
| La destination de `?voltar=` et `?de=` n'accepte qu'un chemin interne | `destinoInterno` dans `src/lib/validacao-conta.ts` |
| Politique publique, sans exiger de compte, aussi à l'intérieur du lien du participant | `src/app/(ferramenta)/(publico)/privacidade/`, `src/app/r/[slug]/privacidade/` |

## Décisions d'architecture

| Décision | Pourquoi | Conséquence |
|---|---|---|
| Server Components et Server Actions au lieu d'une API REST | Moins de code entre l'écran et la base de données ; validation avec Zod sur le serveur à chaque action ; les formulaires fonctionnent avec le comportement natif du navigateur | L'outil n'offre pas d'API publique. Les intégrations utilisent les exportations en CSV |
| Calcul en fonctions pures dans `src/ueq/` | Le nombre doit correspondre au tableur officiel ; les fonctions pures se testent avec des fixtures et des cas limites | Celui qui récupère les données (`src/lib/resultados.ts`) ne fait que construire l'entrée et la transmettre |
| Session stockée dans la base de données, avec le hachage du jeton | Changer le mot de passe ferme les autres sessions ; quiconque lit la base de données ne peut pas fabriquer un cookie | Chaque page du chercheur fait une requête de session (avec le `cache` de React par requête) |
| Deux mises en page racines : l'outil et le lien du participant | Le `<html lang>` et le `dir` du participant suivent la langue choisie par la personne qui répond, et ceux de l'outil suivent la langue du compte (WCAG 3.1.1), y compris l'arabe, l'hébreu et le persan | `experimental.globalNotFound` dans `next.config.ts` pour la page 404 |
| Deux systèmes de texte : `src/idiomas` et `src/traducao` | Le questionnaire est un instrument de mesure : il exige les termes officiels et des textes révisables, sans traduction automatique. Le reste de l'outil peut être traduit à la demande | Un nouveau texte du participant exige les 37 fichiers ; un nouveau texte du chercheur n'exige que `pnpm i18n:catalogo` |
| Traduction à la demande, stockée dans la base de données | Traduire chaque texte une seule fois, sans coût lors des lectures suivantes et sans maintenir 37 fichiers à la main | La première visite dans une langue peut s'afficher en portugais pendant que les lots s'exécutent en arrière-plan |
| E-mail envoyé après la réponse (`after`) | La personne qui a cliqué n'attend pas le serveur de messagerie, et un échec d'envoi n'annule pas l'action | La cloche est l'enregistrement qui existe toujours ; l'e-mail est un plus |
| Graphiques en SVG faits à la main | Contrôle total de `title`, `desc`, du contraste, des formes par version et de la réorganisation sur écran étroit | Pas de bibliothèque de graphiques à mettre à jour |
| PDF généré par Chromium sur le serveur | Le PDF sort identique au tableau de bord, avec des graphiques vectoriels et les mêmes polices | Sur Vercel, le navigateur est téléchargé au premier appel (voir [Déploiement](#implantação)) |
| Documentation lue depuis les mêmes `.md` du dépôt, avec les diagrammes dessinés à l'avance, en SVG (`pnpm docs:diagramas`) | Un seul fichier pour GitHub et pour l'outil ; l'outil ne charge pas la bibliothèque Mermaid et chaque diagramme devient une image avec un texte alternatif | Modifier un diagramme exige de régénérer le SVG et la source ; un test unitaire le signale |
| Document long divisé en pages à l'affichage, sans modifier le `.md` | Le fichier reste unique et lisible sur GitHub, et l'outil n'oblige pas à faire défiler un document entier | Les liens et les ancres passent par `rotaDaAncora`, qui trouve la page de chacune, et les anciennes adresses avec seulement le fragment sont redirigées |
| Données officielles en JSON versionné | Chaque nombre a une source traçable et change par pull request, pas dans le code | Modifier un seuil exige `pnpm suspeitas:recalcular` pour mettre à jour les participations déjà enregistrées |
| Cookies du participant limités à `/r/<slug>` | Anonymat : seulement l'identifiant aléatoire de la participation, la marque « déjà répondu » et la langue | La protection contre l'envoi en double vaut par navigateur, pas par personne |

## Déploiement

```mermaid
flowchart LR
    navegador["Browser<br/>[researcher or participant]"]

    subgraph vercel["Vercel · project ferramenta-ueq"]
        direction TB
        funcoes["<b>Next.js 16</b><br/>[Node.js functions]<br/>ferramenta-ueq.vercel.app"]
        build["<b>vercel-build</b><br/>generate, migrate deploy, seed,<br/>cifrar-dados and next build"]
    end

    subgraph neon["Neon · aws-sa-east-1 (São Paulo)"]
        pgprod[("<b>PostgreSQL</b><br/>DATABASE_URL and<br/>DATABASE_URL_UNPOOLED")]
    end

    github["<b>GitHub</b><br/>branch main"]
    claudeapi["<b>Claude API</b>"]
    smtpserv["<b>SMTP server</b>"]

    subgraph maquina["Developer machine"]
        direction TB
        node["<b>Node.js 24 + pnpm 10</b><br/>pnpm dev · next dev on port 3000"]
        chromium["<b>Playwright Chromium</b><br/>PDF and e2e tests"]
        subgraph docker["Docker"]
            pg[("<b>postgres:16</b><br/>port 5432")]
        end
    end

    navegador -- "HTTPS" --> funcoes
    github -- "each merge deploys" --> build
    build -- "migrations and seed" --> pgprod
    build --> funcoes
    funcoes -- "SQL with TLS" --> pgprod
    funcoes -. "if configured" .-> claudeapi
    funcoes -. "if configured" .-> smtpserv
    node -- "DATABASE_URL" --> pg
    node --> chromium
```

**Outil du diagramme :** Mermaid 12.2.0 (`flowchart`), généré par `pnpm docs:diagramas`. **Fichier source :** [arquitetura-4.mmd](fontes/arquitetura-4.mmd). **Version représentée :** Outil UEQ du 06/11/2026.

**Production.** Chaque merge dans `main` publie une nouvelle version. Le script `vercel-build` exécute `prisma generate`, `prisma migrate deploy`, le seed, `prisma/cifrar-dados.ts` et `next build`. En production, le seed n'enregistre que les 26 items, sans compte de test. Les migrations utilisent `DATABASE_URL_UNPOOLED` quand elle existe.

**Développement.** La marche à suivre se trouve dans le [README](../../README.md#como-rodar).

| Variable | Obligatoire | À quoi elle sert |
|---|---|---|
| `DATABASE_URL` | Oui | Connexion à PostgreSQL |
| `DATABASE_URL_UNPOOLED` | Chez Neon | Connexion directe, utilisée par les migrations |
| `CHAVE_CRIPTOGRAFIA` | En production | Clé AES-256-GCM des données démographiques. Sans elle, la donnée reste en texte clair et Administration le signale. Gardez-en une copie : sans la clé, la donnée chiffrée ne peut plus être lue |
| `ANTHROPIC_API_KEY` | Non | Active la traduction automatique |
| `SMTP_HOST`, `SMTP_PORTA`, `SMTP_USUARIO`, `SMTP_SENHA`, `EMAIL_REMETENTE` | Non | Activent l'envoi d'e-mails |
| `URL_INTERNA` et `PORT` | Non | Adresse par laquelle la route du PDF atteint l'application elle-même. Sans `URL_INTERNA`, c'est `http://localhost:$PORT` |
| `PESQUISADOR_TESTE_EMAIL` et `PESQUISADOR_TESTE_SENHA` | Seulement en développement | Compte créé par le seed. Ne doivent pas exister en production |
| `TRADUCAO_PSEUDO` | Seulement pour vérification | Avec `1`, marque les textes du catalogue avec ⟦ ⟧ pour trouver ce qui ne passe pas par `t()` |

**Tableau de bord en PDF en production.** La fonction Vercel n'a pas de navigateur installé. Au premier appel, la route télécharge un Chromium propre au serveur (`@sparticuz/chromium-min` 153), qui reste dans `/tmp` tant que la fonction est active, et ouvre la page d'impression par l'adresse publique de production. C'est pourquoi la première génération après une période d'inactivité prend plus de temps, et la limite de la fonction est de 60 s. En développement, c'est le Chromium de Playwright qui est utilisé. Les exportations en CSV ne dépendent pas d'un navigateur.

## Structure des dossiers

```
src/
  app/
    (ferramenta)/         layout raiz no idioma da conta
      (publico)/          página inicial, Entrar, Criar conta, Documentação, Privacidade
      (pesquisador)/      Estudos, Resultados, Respostas, Notificações, Minha conta, Administração
    r/[slug]/             link do participante, com layout raiz próprio (lang e dir do idioma)
    api/                  downloads: exportar/[tipo], painel-pdf, conta/dados, documentacao
  ueq/                    cálculo do UEQ em funções puras
  lib/                    sessão, estudos, participação, resultados, CSV, avisos, criptografia
  idiomas/                37 idiomas do participante: textos tipados, negociação, plural
  traducao/               t() e m(), catálogo e tradução da interface pela API do Claude
  componentes/            ItemDiferencial, formulários, janelas, tour, ajuda e painéis
  graficos/               EscalasComBenchmark, MediasPorItem e Demografia em SVG
  styles/                 tokens de cor, tipografia e espaçamento
  proxy.ts                checagem otimista de sessão
scripts/                  SVG e fontes dos diagramas; catálogo de textos
prisma/                   schema, migrations, seed, recálculo de suspeitas e cifragem
data/                     itens, instruções, idiomas, protocolo, benchmark e fixtures
tests/e2e/                Playwright com axe-core
docs/                     especificação, requisitos de IHC, protótipos e esta documentação
```
