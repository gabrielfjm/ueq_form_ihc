# Traçabilité des décisions d'interface

Chaque ligne est une décision d'interface de l'outil. Le tableau indique :

- le principe qui justifie la décision ;
- où elle se trouve dans le code ;
- ce qui prouve qu'elle fonctionne.

Le tableau sert à trois choses :

- le rapport et la présentation ;
- la revue de l'outil, dans laquelle le relecteur vérifie chaque ligne à l'écran ([script de revue](roteiro-revisao.md)) ;
- la personne qui modifie le code, pour ne pas défaire une décision sans savoir pourquoi.

**Principes cités :**

- Nielsen (1994), heuristiques 1 à 10 ;
- Shneiderman, règles d'or 1 à 8 ;
- Norman (2013) ;
- ISO 9241-110 ;
- WCAG 2.2 AA, critères par numéro ;
- Fitts et Hick ;
- les sections de `docs/ihc.md`, citées avec §.

**Preuves :**

- **e2e :** le titre du test dans `tests/e2e/<arquivo>.spec.ts`. Tous les tests s'exécutent sur ordinateur et sur mobile, et presque tous passent par axe-core.
- **unit :** un test dans `src/**/__tests__`.
- **manuel :** un point de `docs/checklist-manual.md`, que l'équipe réalise à la main.

## Participant : le questionnaire comme instrument de mesure

| Décision | Principe | Où se trouve-t-elle | Preuve |
|---|---|---|---|
| Aucun cercle n'est coché au départ. Les 7 positions sont identiques : pas de numéro, pas de couleur dégradée et pas de centre mis en évidence | §3.1 et §3.2 (validité du différentiel sémantique, Laugwitz et al. 2008) | `src/componentes/ItemDiferencial.tsx` | e2e questionario : "fluxo completo do participante, com axe em todas as etapas" (parcours complet du participant, avec axe à toutes les étapes) (zéro bouton radio coché) |
| Les 26 items suivent l'ordre et la polarité officiels. L'interface ne « range » jamais les pôles | §3.3, UEQ Handbook | `src/app/r/[slug]/questionario/page.tsx` | unit `src/ueq/__tests__`, e2e questionario |
| En arabe, en hébreu et en persan, le texte va de droite à gauche, mais l'échelle reste de 1 à 7 avec le terme de gauche à gauche, comme dans les PDF officiels | §3.3, Norman (correspondance naturelle), WCAG 1.3.2 | `ItemDiferencial.tsx` (`dir="ltr"` sur la ligne), `ItemDiferencial.module.css` | e2e idiomas : "em árabe pelo seletor: página da direita para a esquerda, escala na ordem oficial" (en arabe via le sélecteur : page de droite à gauche, échelle dans l'ordre officiel) |
| Consigne officielle de l'UEQ en haut, dans la langue choisie, sans l'exemple avec un cercle coché | §3.4, Nielsen 2 | `data/ueq-instrucoes.json`, `questionario/page.tsx` | e2e idiomas (espagnol) |
| Même mise en page pour les 26 items | §3.5 | `ItemDiferencial.tsx`, un seul composant pour tous | e2e questionario : "cada item é um grupo com legenda e 7 rádios com posição e polo" (chaque item est un groupe avec une légende et 7 boutons radio avec position et pôle) |
| Le participant ne voit jamais les résultats | §3.6 | les routes `/r/...` ne lisent pas l'analyse | e2e autenticacao : "participante nunca precisa de sessão" (le participant n'a jamais besoin de session) |

## Participant : le chemin jusqu'à la fin

| Décision | Principe | Où se trouve-t-elle | Preuve |
|---|---|---|---|
| Le formulaire indique la durée (sans limite), comment renoncer jusqu'à l'envoi, qu'après l'envoi il n'est plus possible de retirer les réponses, combien de temps elles sont conservées, les risques, les bénéfices, qui est responsable de la recherche avec l'institution et le contact et, s'il y en a un, le comité d'éthique. Il propose un exemplaire à imprimer ou à enregistrer | LGPD art. 9, résolution CNS 510/2016, Nielsen 1 et 10 | `src/lib/termo.ts`, `src/app/r/[slug]/Termo.tsx`, `src/app/r/[slug]/termo/page.tsx` | e2e questionario : "o termo diz o tempo, como desistir, o que acontece depois de enviar, riscos, benefícios e quem responde, e tem uma via para guardar" (le formulaire indique la durée, comment renoncer, ce qui se passe après l'envoi, les risques, les bénéfices et qui est responsable, et propose un exemplaire à conserver) ; unit : `termo.test.ts` |
| Le formulaire demande l'âge. Les personnes de moins de 18 ans ne continuent qu'en confirmant l'autorisation de leur représentant légal, et l'erreur apparaît dans le formulaire lui-même, avec le focus sur le champ | LGPD art. 14, Nielsen 9, WCAG 3.3.1 | `src/lib/termo.ts`, `src/app/r/[slug]/acoes.ts` | e2e questionario : "quem tem menos de 18 anos só participa com a autorização do responsável, e sem idade nada é gravado" (les personnes de moins de 18 ans ne participent qu'avec l'autorisation de leur représentant légal, et sans âge rien n'est enregistré) |
| Le formulaire de l'étude exige le responsable, le contact, l'institution, les risques et les bénéfices, avec des suggestions préremplies | LGPD art. 9, WCAG 3.3.7 | `estudos/formulario/FormularioEstudo.tsx`, `src/lib/validacao-estudo.ts` | e2e estudos : "o estudo nasce com o responsável da conta e exige nome, contato e instituição, que vão para o termo" (l'étude naît avec le responsable du compte et exige nom, contact et institution, qui vont dans le formulaire de consentement) |
| Consentement avec une seule action principale. Refuser est un lien tout aussi visible | Hick, Nielsen 8, §3.7 | `src/app/r/[slug]/page.tsx` | e2e questionario : "não quero participar sai sem gravar…" (je ne veux pas participer sort sans rien enregistrer…) |
| Le formulaire contient un lien vers la politique, sur une page sans barre et sans chemin vers l'outil, qui revient au formulaire | LGPD art. 9, Nielsen 3 | `src/app/r/[slug]/page.tsx`, `src/app/r/[slug]/privacidade/page.tsx` | e2e questionario : "a política de privacidade abre pelo termo, dentro do link do participante, e volta para ele" (la politique de confidentialité s'ouvre depuis le formulaire, dans le lien du participant, et y revient) |
| La traduction automatique reçoit l'écran de chaque texte, emploie un seul terme par concept dans chaque langue, cite les boutons par le nom qu'ils ont à l'écran et passe par une seconde relecture. Si ses `{marcadores}` diffèrent de l'original, elle est écartée et le texte reste en portugais | Nielsen 2 et 4, WCAG 3.1.2 | `src/traducao/claude.ts`, `src/traducao/rodadas.ts`, `src/traducao/extrair.ts` | unit : `claude.test.ts`, `rodadas.test.ts`, `catalogo.test.ts` |
| Sans traduction, la politique avertit dans la langue de la personne qu'elle apparaît en portugais, et le texte est marqué avec le `lang` du portugais | Nielsen 1, WCAG 3.1.2 | `src/app/r/[slug]/privacidade/page.tsx` | e2e questionario : "sem tradução automática, a política avisa no idioma da pessoa e sai marcada como português" (sans traduction automatique, la politique avertit dans la langue de la personne et est marquée comme portugais) |
| Rien sur la personne n'est enregistré avant « J'accepte » | §3.7 (éthique de la recherche) | `src/app/r/[slug]/acoes.ts` (`consentir`) | e2e questionario |
| Étapes numérotées (1 Consentement · 2 Questionnaire · 3 Données facultatives) | Shneiderman 4, Nielsen 1 | `src/app/r/[slug]/Etapas.tsx` | e2e questionario (aria-current sur l'étape) |
| Chaque item est un fieldset avec une légende. Chaque cercle indique la position et le pôle (« 2 sur 7, plus près de Agradável ») | WCAG 1.3.1, 4.1.2, 2.5.3 | `ItemDiferencial.tsx` | e2e questionario : "cada item é um grupo…" (chaque item est un groupe…) ; manuel : lecteur d'écran |
| Cible tactile de 44×44 px, qui rétrécit proportionnellement jusqu'à tenir dans 320 px | WCAG 2.5.8 et 1.4.10, Fitts | `ItemDiferencial.module.css` | e2e questionario : "em 320 px (zoom de 400%) nenhuma etapa rola na horizontal" (à 320 px (zoom de 400 %), aucune étape ne défile horizontalement) |
| Validation seulement à l'envoi, jamais à chaque item. Le résumé reçoit le focus, indique « Il reste N éléments » et contient un lien vers chaque item | WCAG 3.3.1 et 2.4.3, Nielsen 9, §4.1 | `src/app/r/[slug]/questionario/FormularioQuestionario.tsx` | e2e questionario : "envio incompleto leva o foco ao resumo e os links levam aos itens" (un envoi incomplet amène le focus sur le résumé et les liens mènent aux items) |
| Pied de page fixe avec la progression et « Quitter sans envoyer ». L'item ayant le focus ne se retrouve jamais sous le pied de page | Nielsen 1, Shneiderman 7, WCAG 2.4.11 | `questionario/RodapeProgresso.tsx` | e2e questionario : "fluxo completo só com teclado, com o foco sempre visível" (parcours complet au clavier seul, avec le focus toujours visible) |
| La progression n'est annoncée que tous les 5 items et à la fin | WCAG 4.1.3, §4.1 (ne pas encombrer le lecteur d'écran) | `FormularioQuestionario.tsx` | manuel : lecteur d'écran |
| Recharger ou revenir en arrière n'efface pas ce qui a été coché (brouillon seulement dans l'onglet) | ISO 9241-110 (robustesse face aux erreurs), Nielsen 3 | `questionario/useRascunho.ts` | e2e questionario : "recarregar a página recupera as respostas marcadas" (recharger la page récupère les réponses cochées) |
| Quitter sans envoyer se confirme dans une fenêtre (focus sur Continuer à répondre, Échap continue) et supprime la participation incomplète | Shneiderman 6, Nielsen 5, §3.7, WCAG 2.4.3 | `RodapeProgresso.tsx`, `src/componentes/janela/Janela.tsx`, `acoes.ts` (`desistir`) | e2e questionario : "sair sem enviar confirma numa janela e não grava nada" (quitter sans envoyer se confirme dans une fenêtre et n'enregistre rien) |
| Données facultatives avec « Je préfère ne pas répondre » à chaque question, et « Passer cette étape » avec le même poids que « Continuer » | §3.8, Nielsen 3 | `src/app/r/[slug]/sobre-voce/page.tsx`, `src/lib/demografia.ts` | e2e questionario |
| Un lien déjà utilisé pour répondre dans le même navigateur n'accepte pas un autre envoi | Nielsen 5 | `src/app/r/[slug]/page.tsx`, `src/lib/participacao.ts` | e2e questionario |
| Un lien en brouillon ou clôturé explique la situation au lieu d'afficher une erreur | Nielsen 9 | `src/app/r/[slug]/page.tsx` (prototype p6) | e2e estudos : "abre, encerra e reabre a coleta, e o link público acompanha" (ouvre, clôture et rouvre la collecte, et le lien public suit) |

## Participant : langues

| Décision | Principe | Où se trouve-t-elle | Preuve |
|---|---|---|---|
| Le lien s'ouvre dans la langue de l'étude, parmi les 37 du pack officiel, même avec le navigateur dans une autre langue, et `<html lang>` et `dir` la suivent | WCAG 3.1.1 | `src/app/r/[slug]/layout.tsx`, `src/lib/participacao.ts` (`idiomaDoParticipante`) | e2e idiomas : "estudo em espanhol: o link abre no idioma do estudo, mesmo com o navegador em português" (étude en espagnol : le lien s'ouvre dans la langue de l'étude, même avec le navigateur en portugais) |
| Dans le sélecteur de langue, choisir ne change rien : seul le bouton « Appliquer » le fait | WCAG 3.2.2 | `src/app/r/[slug]/SeletorIdioma.tsx` | e2e idiomas (arabe) |
| Chaque langue apparaît dans le sélecteur avec son propre nom et avec `lang` | WCAG 3.1.2 | `SeletorIdioma.tsx` | manuel : lecteur d'écran |
| Pour les 9 langues dont la traduction n'est pas approuvée, un avertissement sur la page de consentement et une marque pour le chercheur | Nielsen 1, transparence méthodologique | `SeletorIdioma.tsx`, `respostas/TabelaParticipacoes.tsx`, exportations | e2e idiomas (arabe) |
| Tous les textes d'écran ont une traduction, avec les mêmes marqueurs que la version portugaise | Shneiderman 2 (utilisabilité universelle) | `src/idiomas/textos/*.ts`, avec le type `TextosParticipante` | unit `src/idiomas/__tests__/idiomas.test.ts` |
| Le questionnaire n'utilise que les traductions officielles ; le titre, le produit et l'objectif de l'étude sont traduits, et sans traduction ils restent dans l'original, marqués avec son `lang` | Validité de l'instrument (§3), WCAG 3.1.2 | `src/lib/participacao.ts` (`textosDoEstudo`), `src/traducao/servidor.ts` | manuel : relecture par un locuteur natif (`docs/idiomas.md`) |

## Chercheur : compte et études

| Décision | Principe | Où se trouve-t-elle | Preuve |
|---|---|---|---|
| Se connecter accepte le collage du mot de passe et les gestionnaires de mots de passe. Bouton « Afficher le mot de passe » annoncé | WCAG 3.3.8 et 1.3.5 | `src/componentes/formulario/Campo.tsx` | e2e autenticacao : "Mostrar senha alterna a visibilidade e anuncia o estado" (Afficher le mot de passe bascule la visibilité et annonce l'état) |
| Résumé des erreurs en haut, avec le focus et un lien vers chaque champ | WCAG 3.3.1 et 3.3.3, Nielsen 9 | `src/componentes/formulario/ResumoErros.tsx` | e2e autenticacao : "o link do resumo de erros leva ao campo" (le lien du résumé des erreurs mène au champ) |
| Une route protégée revient à l'endroit où se trouvait la personne après la connexion | Nielsen 3 | `src/proxy.ts` | e2e autenticacao : "rota protegida sem sessão vai para Entrar e volta para ela depois do login" (une route protégée sans session mène à Se connecter et y revient après la connexion) |
| Le produit évalué devient la suggestion de nom de la première version | WCAG 3.3.7 | `estudos/formulario/FormularioEstudo.tsx` | e2e estudos : "o produto sugere o nome da primeira versão…" (le produit suggère le nom de la première version…) |
| Supprimer une étude ou un compte ouvre une fenêtre qui demande de saisir le titre ou l'e-mail et dit ce qui est supprimé avec | Nielsen 5, WCAG 3.3.4 | `estudos/[id]/AcoesEstudo.tsx`, `conta/ExcluirConta.tsx`, `src/componentes/janela/Confirmacao.tsx` | e2e estudos : "excluir pede o título e apaga o estudo" (supprimer demande le titre et efface l'étude) ; e2e conta : "excluir a conta exige digitar o e-mail e apaga o acesso" (supprimer le compte exige de saisir l'e-mail et supprime l'accès) |
| Se déconnecter et Supprimer la version se confirment aussi dans une fenêtre, avec le focus déjà sur le bouton de l'action | Nielsen 3 et 5, Shneiderman 6 | `(pesquisador)/BarraSuperior.tsx`, `estudos/formulario/ListaVersoes.tsx` | e2e autenticacao : "cadastra, sai e entra de novo usando só o teclado" (s'inscrit, se déconnecte et se reconnecte en n'utilisant que le clavier) ; e2e estudos : "o produto sugere o nome da primeira versão…" (le produit suggère le nom de la première version…) |
| La page d'accueil explique l'UEQ et l'outil : ce qu'est la méthode, comment lire les résultats, comment cela fonctionne, les études et les crédits. C'est aussi l'écran après la connexion | Nielsen 2 et 10 | `(publico)/PaginaInicial.tsx` | e2e inicial : "a raiz apresenta a ferramenta para quem não tem sessão e passa no axe" (la racine présente l'outil à qui n'a pas de session et passe axe) |
| Se connecter et Créer un compte s'ouvrent dans une fenêtre au-dessus de la page actuelle, passent de l'un à l'autre sans fermer et tiennent à l'écran sans défilement | Nielsen 3, Shneiderman 8, WCAG 1.4.10 | `(publico)/_acesso/Acesso.tsx`, `acesso.module.css` | e2e inicial : "Entrar abre a janela por cima da página, sem rolar, e Esc fecha devolvendo o foco" (Se connecter ouvre la fenêtre au-dessus de la page, sans défilement, et Échap la ferme en rendant le focus) |
| Clôturer la collecte est réversible (« Rouvrir la collecte »), c'est pourquoi aucune confirmation n'est demandée | Shneiderman 6 | `estudos/[id]/BotaoColeta.tsx` | e2e estudos : "abre, encerra e reabre a coleta…" (ouvre, clôture et rouvre la collecte…) |
| Statut écrit avec la conséquence (« Ouvert · accepte les réponses »), toujours au même endroit | Nielsen 1 | `src/lib/status-estudo.ts`, `estudos/[id]/FaixaEstudo.tsx` | e2e estudos |
| Toute action confirme son résultat dans une région `role="status"`, qui suit le défilement et reste jusqu'à ce que la personne la ferme. L'erreur a une autre couleur et une autre icône | Norman (retour d'information), Shneiderman 3, WCAG 4.1.3 et 2.2.1 | `src/componentes/Avisos.tsx`, `formulario/MensagemStatus.tsx` | e2e estudos : "a confirmação pode ser fechada e continua à vista depois de rolar a página" (la confirmation peut être fermée et reste visible après le défilement de la page) ; e2e autenticacao : "criar a conta e entrar confirmam na tela" (créer le compte et se connecter se confirment à l'écran) |
| Pendant que l'action s'exécute, le bouton dit ce qui se passe et ignore les nouveaux clics, et le formulaire cesse de répondre : rien n'est envoyé deux fois | Nielsen 1 et 5, WCAG 4.1.3 et 2.4.3 | `formulario/BotaoEnvio.tsx`, `src/app/globals.css` | e2e estudos : "enquanto cria o estudo o botão mostra que está processando, ignora novos cliques e no fim confirma" (pendant la création de l'étude, le bouton montre qu'il traite, ignore les nouveaux clics et confirme à la fin) |
| Un autre chercheur ne voit pas l'étude par son adresse : la réponse est identique à celle d'une étude inexistante | confidentialité des données de la recherche | `src/lib/estudos.ts` (`estudoDoPesquisador`) | e2e estudos : "outro pesquisador não vê o estudo pelo endereço" (un autre chercheur ne voit pas l'étude par l'adresse) ; e2e exportacao |

## Chercheur : équipe, avis et aide

| Décision | Principe | Où se trouve-t-elle | Preuve |
|---|---|---|---|
| Le propriétaire invite par e-mail comme Éditeur ou Lecteur ; l'étude n'apparaît qu'après acceptation, et le lecteur ne fait que consulter et exporter | Nielsen 5, contrôle de l'utilisateur, confidentialité des données de la recherche | `estudos/[id]/Compartilhar.tsx`, `acoes-compartilhar.ts`, `src/lib/estudos.ts` (`PERMISSOES`) | e2e equipe : "convite por e-mail chega no sino, o leitor só vê e o dono é avisado" (l'invitation par e-mail arrive dans la cloche, le lecteur ne fait que consulter et le propriétaire est averti) |
| Cloche avec le nombre de notifications non lues, qui fonctionne aussi au clavier, et invitations avec Accepter et Refuser sur place | Nielsen 1, Shneiderman 7, WCAG 2.1.1 | `(pesquisador)/sino.module.css`, `notificacoes/page.tsx`, `src/lib/notificacoes.ts` | e2e equipe : "o sino também funciona pelo teclado" (la cloche fonctionne aussi au clavier) |
| Les nouvelles réponses forment un seul avis tant qu'il n'est pas lu : 30 réponses en une matinée ne font pas 30 avis | Nielsen 8, charge de la mémoire (Shneiderman 8) | `src/lib/notificacoes.ts` (`notificarResposta`) | manuel |
| Qui a réalisé l'action n'est pas averti de sa propre action, et l'e-mail peut être désactivé dans Mon compte | Nielsen 8, Shneiderman 7 | `src/lib/notificacoes.ts` (`notificar`) | e2e equipe : "convite por e-mail chega no sino…" (l'invitation par e-mail arrive dans la cloche…) |
| Visite seulement à la première connexion, sur les écrans réels, avançant par l'action de la personne, et qui peut être ignorée et revue | ISO 9241-110 (apprentissabilité), Nielsen 3 et 10 | `src/componentes/tutorial/` | e2e equipe : "o tour abre só no primeiro acesso, avança pelo clique na ação e pode ser pulado" (la visite ne s'ouvre qu'à la première connexion, avance par le clic sur l'action et peut être ignorée) |
| Le (?) sur chaque page du chercheur dit à quoi sert la page et ce qu'il est possible d'y faire | Nielsen 10 | `src/componentes/ajuda/BotaoAjuda.tsx`, `src/lib/ajuda.ts` | e2e equipe : "toda página do pesquisador tem o (?) com a ajuda dela" (chaque page du chercheur a le (?) avec son aide) |
| Administration et Mon compte sont des panneaux : chaque option indique la situation actuelle et ouvre une page dédiée | Nielsen 6, Hick, divulgation progressive | `src/componentes/painel/PainelOpcoes.tsx` | e2e conta ; manuel |
| L'interface s'affiche dans la langue du compte, et la langue se change dans Mon compte. Tant que la plus grande partie n'a pas été traduite, le `lang` de la page reste en portugais, pour que le lecteur d'écran prononce correctement | Shneiderman 2, WCAG 3.1.1 | `src/traducao/servidor.ts` (`idiomaExibido`), `conta/idioma/` | e2e idioma-interface : "o idioma escolhido ao criar a conta vale para a ferramenta e pode ser trocado em Minha conta" (la langue choisie à la création du compte vaut pour l'outil et peut être changée dans Mon compte) |

## Protection des données

| Décision | Principe | Où se trouve-t-elle | Preuve |
|---|---|---|---|
| La politique est publique et écrite sans jargon juridique, en lignes d'étiquette et d'explication, avec un résumé et un sommaire | LGPD art. 9, Nielsen 2, WCAG 2.4.5 | `(publico)/privacidade/page.tsx` | e2e privacidade : "a política de privacidade é pública e acessível" (la politique de confidentialité est publique et accessible) ; "a política leva cada seção pelo índice e não rola na horizontal em 320 px" (la politique mène à chaque section par le sommaire et ne défile pas horizontalement à 320 px) |
| Le « Retour » de la politique dit où il mène, fonctionne sans historique et ramène la personne à l'endroit d'où elle est partie | Nielsen 3, Shneiderman 7 | `privacidade/Voltar.tsx`, `privacidade/origem.ts` | e2e privacidade : "da página inicial, a política volta ao rodapé de onde a pessoa saiu" (depuis la page d'accueil, la politique revient au pied de page d'où la personne est partie) ; "de Minha conta e da ajuda, a política volta para a mesma tela" (depuis Mon compte et l'aide, la politique revient au même écran) |
| Depuis les fenêtres Se connecter et Créer un compte, la politique s'ouvre dans un autre onglet, l'indique dans le nom du lien, et revenir ferme l'onglet, sans perdre ce qui a été saisi | Nielsen 3, WCAG 3.2.5 | `_acesso/LinkPrivacidade.tsx`, `privacidade/Voltar.tsx` | e2e privacidade : "das janelas de acesso, a política abre em outra aba, sem perder o que foi digitado, e voltar tenta fechar a aba" (depuis les fenêtres d'accès, la politique s'ouvre dans un autre onglet, sans perdre ce qui a été saisi, et revenir tente de fermer l'onglet) ; manuel : liste de contrôle, lecteur d'écran |
| La destination du « Retour » n'accepte qu'un chemin interne | Sécurité (redirection ouverte) | `src/lib/validacao-conta.ts` (`destinoInterno`) | e2e privacidade : "a política não aceita voltar para outro site" (la politique n'accepte pas de revenir vers un autre site) |
| La collecte démographique est désactivée par défaut dans chaque étude, et la case explique pourquoi | LGPD art. 6 (nécessité), §3.8 | `estudos/formulario/`, `Estudo.coletarDemografia` | manuel : `docs/roteiro-revisao.md` |
| « Télécharger mes données » fournit un fichier avec tout, sans rien demander à personne | LGPD art. 18, Shneiderman 7 | `src/app/api/conta/dados/route.ts`, `conta/FichaConta.tsx` | e2e privacidade : "Baixar meus dados entrega um JSON com a conta e sem a senha" (Télécharger mes données fournit un JSON avec le compte et sans le mot de passe) |
| Après 5 mots de passe erronés, le message dit combien de temps attendre | Nielsen 9, LGPD art. 46 | `src/lib/tentativas.ts` | e2e privacidade : "depois de 5 senhas erradas o e-mail espera" (après 5 mots de passe erronés, l'e-mail attend) |

## Chercheur : tableau de bord des résultats

| Décision | Principe | Où se trouve-t-elle | Preuve |
|---|---|---|---|
| Lecture rapide écrite en haut, et l'interprétation à côté de chaque chiffre (« neutre · Inférieur à la moyenne ») | Nielsen 6, Shneiderman 8 | `src/lib/leitura-rapida.ts`, `resultados/VisaoUmaVersao.tsx` | e2e resultados : "mostra os números do módulo UEQ…" (montre les chiffres du module UEQ…) |
| Graphique avec une description en texte et un tableau équivalent juste en dessous | WCAG 1.1.1 et 1.3.1 | `src/graficos/EscalasComBenchmark.tsx`, `VisaoUmaVersao.tsx` | e2e resultados (axe) ; manuel : lecteur d'écran |
| Versions distinguées par la forme (cercle plein, évidé…), pas seulement par la couleur | WCAG 1.4.1 | `EscalasComBenchmark.tsx` | e2e resultados : "gráficos com daltonismo simulado e alto contraste" (graphiques avec daltonisme simulé et contraste élevé) |
| Échelles regroupées en Attractivité, Pragmatique et Hédonique | Gestalt (proximité, région commune), modèle conceptuel de l'UEQ | `EscalasComBenchmark.tsx` | e2e resultados |
| Chaque terme technique (référence, IC95, alpha) expliqué à proximité, dans `<details>` | Nielsen 10, divulgation progressive | `resultados/Explicacoes.tsx` | manuel |
| Les avertissements d'alpha faible et de petit échantillon disent ce qu'ils signifient et ce qu'il faut faire | Nielsen 9 | `VisaoUmaVersao.tsx` | e2e resultados : "com uma resposta só avisa que não há intervalo de confiança" (avec une seule réponse, avertit qu'il n'y a pas d'intervalle de confiance) |
| La version, le mode et l'ordre des items restent dans l'URL : revenir en arrière, recharger et partager fonctionnent | Nielsen 3 | `resultados/ControlesResultados.tsx` | e2e resultados : "…guarda versão e modo na URL" (…conserve la version et le mode dans l'URL) |
| Changer de version ne retire pas le focus du sélecteur | WCAG 3.2.2 | `ControlesResultados.tsx` | manuel : clavier |
| Sur un écran étroit, le tableau défile dans une région pouvant recevoir le focus, et la page ne défile pas | WCAG 1.4.10 et 2.1.1 | `VisaoUmaVersao.tsx`, `VisaoComparacao.tsx` | e2e resultados : "em 320 px o painel não rola na horizontal, nos dois modos" (à 320 px, le tableau de bord ne défile pas horizontalement, dans les deux modes) |
| Données démographiques dans un sous-onglet propre, chaque question dans le graphique qui lui convient, avec « Voir les chiffres » | Gestalt, WCAG 1.1.1, divulgation progressive | `src/graficos/Demografia.tsx`, `resultados/demograficos/` | e2e privacidade : "os dados demográficos aparecem em Resultados, numa sub-aba própria" (les données démographiques apparaissent dans Résultats, dans un sous-onglet propre) |
| Tableau de bord en PDF avec la même sélection que l'écran, en-tête avec titre, n et date de génération, graphiques vectoriels, A4 avec des marges de 18 mm | Nielsen 4, §4.4 | `resultados/impressao/`, `src/app/api/estudos/[id]/painel-pdf/route.ts` | e2e painel-pdf |

## Chercheur : réponses, exportation et importation

| Décision | Principe | Où se trouve-t-elle | Preuve |
|---|---|---|---|
| Aperçu du nombre de participations incluses dans l'analyse et exclues de celle-ci | Nielsen 1 | `estudos/[id]/respostas/page.tsx` | e2e respostas |
| Exclure de l'analyse ne fait que retirer du calcul, ne supprime jamais, et peut être annulé | Shneiderman 6, docs/ueq-protocolo.md §7 | `respostas/acoes.ts` | e2e respostas : "incluir e excluir uma participação avisa e nunca apaga" (inclure et exclure une participation avertit et ne supprime jamais) |
| La règle de suspicion et les seuils restent visibles à côté de la liste | Nielsen 6 et 10 | `respostas/page.tsx` | e2e respostas : "a fixture inconsistente sai com as 4 suspeitas da equipe…" (le jeu de données incohérent ressort avec les 4 suspectes de l'équipe…) |
| Le filtre « Afficher seulement les suspectes » reste dans l'URL | Nielsen 3 | `respostas/TabelaParticipacoes.tsx` | e2e respostas |
| Chaque exportation indique le format, le contenu et l'usage, avec un nom lisible et daté, et se télécharge sans ouvrir de nouvel onglet | §4.4, Nielsen 2 | `resultados/SecaoExportar.tsx`, `src/app/api/estudos/[id]/exportar/[tipo]/route.ts` | e2e exportacao : "baixa as 4 exportações com nome datado, BOM e o formato de cada uma" (télécharge les 4 exportations avec un nom daté, BOM et le format de chacune) |
| Importer un CSV en deux étapes : aperçu des 5 premières lignes ou problème de chaque ligne, puis confirmation. N'enregistre que si le fichier entier est valide | Nielsen 5 et 9, Shneiderman 4 et 5 | `respostas/importar/`, `src/lib/importacao.ts` | e2e importacao ; unit `src/lib/__tests__/importacao.test.ts` |
| Les réponses importées sont marquées et sans langue, parce que le CSV n'indique pas la langue (rien n'est inventé) | Nielsen 1, intégrité de la donnée | `TabelaParticipacoes.tsx`, `src/lib/exportacoes.ts` | e2e importacao ; unit `exportacoes.test.ts` |
| La sous-page (Réponses › Importer) garde marqué l'onglet d'origine | Nielsen 1, WCAG 2.4.8 (localisation) | `estudos/[id]/AbasEstudo.tsx` | e2e importacao |

## Dans tout l'outil

| Décision | Principe | Où se trouve-t-elle | Preuve |
|---|---|---|---|
| Barre supérieure fixée en haut pendant le défilement, sur ordinateur et sur mobile : la navigation est toujours à portée de main | Nielsen 3 et 6, Shneiderman 7 | `src/app/(ferramenta)/(pesquisador)/BarraFixa.tsx`, `pesquisador.module.css` | e2e barra : "a barra fica fixa no topo ao rolar, com e sem conta" (la barre reste fixée en haut pendant le défilement, avec et sans compte) |
| Avec la barre fixe, le focus et la destination des ancres s'arrêtent en dessous : `scroll-padding-top` avec la hauteur mesurée de la barre | WCAG 2.4.11 | `src/app/globals.css`, `BarraFixa.tsx` (`--altura-barra`) | e2e barra : "o foco e as âncoras nunca ficam embaixo da barra fixa" (le focus et les ancres ne se retrouvent jamais sous la barre fixe) |
| Sélecteur de langue dans la barre, avec et sans connexion : chaque langue est un bouton avec son propre nom, seul le clic change, et la page reste la même avec le focus de retour sur le sélecteur | WCAG 3.1.1, 3.2.2 et 2.5.3, Nielsen 7 (raccourci vers Mon compte › Langue) | `(pesquisador)/SeletorIdioma.tsx`, `seletor-idioma.module.css`, `(pesquisador)/acoes.ts` (`trocarIdioma`) | e2e idioma-interface : "o seletor de idioma da barra troca a ferramenta e a conta sem sair da página" (le sélecteur de langue de la barre change l'outil et le compte sans quitter la page) |
| Sur mobile, les liens se trouvent derrière le bouton Menu (`aria-expanded`), qui se ferme avec Échap en rendant le focus et au changement de page | WCAG 2.1.2 et 4.1.2, Nielsen 8 (barre fixe sur une seule ligne) | `BarraFixa.tsx` | e2e barra : "no celular os links ficam no menu, que fecha com Esc e devolve o foco" (sur mobile, les liens sont dans le menu, qui se ferme avec Échap et rend le focus) |
| Un long document s'ouvre comme un sommaire, et chaque section dans sa propre page, avec le diagramme à l'écran, Retour et Précédent/Suivant | Nielsen 3 et 8, divulgation progressive, WCAG 2.4.5 et 2.4.8 | `documentacao/PaginaSecao.tsx`, `src/lib/documentacao/estrutura.ts`, `paginas.ts` | e2e documentacao : "documento longo abre como índice, e cada seção em página própria com o diagrama à vista" (un long document s'ouvre comme un sommaire, et chaque section dans sa propre page avec le diagramme à l'écran) |
| Retour mène à la page d'où la personne vient, y compris dans un autre document, et sans historique à la page du dessus | Nielsen 3, Shneiderman 7 | `documentacao/NavegacaoDocumento.tsx` | e2e documentacao : "Voltar leva à página de onde a pessoa veio e, sem histórico, à página de cima" (Retour mène à la page d'où la personne vient et, sans historique, à la page du dessus) |
| Le lien d'un tableau mène à la page de la ligne et marque la destination | Nielsen 6, WCAG 2.4.4 | `paginas.ts` (`rotaDaAncora`), `texto.module.css` (`:target`) | e2e documentacao : "seção com muitas subseções vira índice, e o link de uma tabela leva à página da linha" (une section avec beaucoup de sous-sections devient un sommaire, et le lien d'un tableau mène à la page de la ligne) |
| Cliquer sur un diagramme de la documentation l'ouvre en plein écran dans un `<dialog>` natif : Retour fixe en haut, Échap ferme et le focus revient au diagramme | WCAG 2.1.2 et 2.4.3, Nielsen 3, Shneiderman 6 | `documentacao/ArtigoDocumento.tsx` | e2e documentacao : "clicar no diagrama abre em tela cheia, com zoom, arrasto, Voltar e Esc" (cliquer sur le diagramme l'ouvre en plein écran, avec zoom, glissement, Retour et Échap) |
| Zoom de 50 % à 400 % (boutons, Ctrl + molette, + et - seulement avec le plein écran ouvert), centré sur le point que la personne regardait, et glissement pour déplacer | WCAG 1.4.4 et 2.1.4, Shneiderman 7 | `ArtigoDocumento.tsx`, `ampliado.module.css` | e2e documentacao : "clicar no diagrama abre em tela cheia…" (cliquer sur le diagramme l'ouvre en plein écran…) |
| Lien « Aller au contenu » comme premier arrêt de Tab | WCAG 2.4.1 | `src/app/(ferramenta)/layout.tsx`, `src/app/r/[slug]/layout.tsx` | e2e inicial : "o primeiro Tab leva ao link de pular para o conteúdo" (le premier Tab mène au lien pour aller au contenu) |
| Titre de page unique et descriptif (« Questionnaire · <estudo> ») | WCAG 2.4.2 | `generateMetadata` de chaque page | e2e (toHaveTitle dans plusieurs tests) |
| Couleurs en jetons, avec un contraste vérifié par un test | WCAG 1.4.3 et 1.4.11 | `src/styles/tokens.css` | unit `src/styles/__tests__/contraste.test.ts` |
| Le même modèle de bouton, de champ, de tableau et de message sur tous les écrans | Nielsen 4, Shneiderman 1 | `src/componentes/formulario/`, `src/styles/` | manuel : `docs/roteiro-revisao.md` |
| Écrans identiques au prototype haute fidélité | cohérence avec le projet évalué | `docs/prototipos/alta-fidelidade/` | manuel : `docs/roteiro-revisao.md` |

## Ce qu'aucun test automatique ne couvre

Ces points sont vérifiés à la main, dans les cas de test manuels ([liste de contrôle manuelle](checklist-manual.md) et [script de revue](roteiro-revisao.md)) :

- usage réel avec un lecteur d'écran (NVDA, VoiceOver, TalkBack) du début à la fin ;
- zoom de 200 % et 400 % sur un téléphone réel, et le pouce sur les cercles ;
- espacement du texte augmenté (WCAG 1.4.12) et `prefers-reduced-motion` ;
- la qualité des traductions des écrans du participant et de l'interface traduite par l'API (`docs/idiomas.md`) ;
- la visite guidée et la cloche avec un lecteur d'écran ;
- la compréhension du tableau de bord par des personnes qui ne connaissent pas l'UEQ.

Les écrans sans prototype haute fidélité (le sélecteur de langue, Importer les réponses et le tableau de bord en PDF) utilisent les mêmes composants que les autres et sont vérifiés par le même script.
