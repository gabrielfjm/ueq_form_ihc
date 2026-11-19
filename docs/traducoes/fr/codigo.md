# Comment écrire le code

L'objectif est un code qui ait l'air écrit par une équipe qui connaît le domaine, et non un code générique. En pratique :

## Noms
- Domaine en portugais et cohérent avec la base : `Estudo` (étude), `Versao` (version), `Participacao` (participation), `Resposta` (réponse), `Item`, `Escala` (échelle), `Polaridade` (polarité)
- Pas de `data`, `info`, `item2`, `handleStuff`, `processData`, `utils.ts`, `helpers.ts`
- Les fonctions disent ce qu'elles calculent : `mediaPorEscala` (moyenne par échelle), `intervaloConfianca95` (intervalle de confiance à 95 %), `alfaCronbach` (alpha de Cronbach), `marcarSuspeitos` (marquer les suspects)

## Commentaires
- Ils ne commentent que le **pourquoi**, jamais le **quoi**. Interdits : `// Importa o React`, `// Função para calcular a média`, `// Handle error`
- Toute règle du protocole UEQ dans le code cite la source : `// Handbook UEQ, seção 5: amplitude > 3 indica inconsistência` (« section 5 : une amplitude > 3 indique une incohérence »)
- Pas de commentaire en anglais mélangé au portugais
- Pas de JSDoc sur une fonction évidente

## Structure
- Un fichier de plus d'environ 200 lignes est le signe qu'il faut le découper
- Un composant fait une seule chose. La logique de données reste dans un Server Component ou dans une route, pas dans un `useEffect` avec `fetch`
- Privilégier les Server Components et les Server Actions de Next. Un Client Component seulement là où il y a de l'interaction (questionnaire, fenêtres, visite guidée, filtres du tableau de bord)
- Tout accès à une étude passe par `estudoDoPesquisador` ou `filtroDeAcesso`. Ne jamais chercher une étude par son seul identifiant
- Un bouton qui appelle le serveur est un `BotaoEnvio`, avec `textoEnviando`. Toute action terminée est confirmée à l'écran : `MensagemStatus`, `useAnunciar` ou `?aviso=` sur la page de destination
- Pas de couches d'abstraction « pour le futur » (repository générique, factory, service d'une seule fonction)
- Pas de `try/catch` qui enveloppe tout. Traiter l'erreur là où l'on peut en faire quelque chose d'utile
- Pas de `any`. Pas de `as unknown as`. Les types de Prisma et de Zod sont réutilisés, pas redéclarés

## Textes de l'interface
- Le texte d'écran du chercheur est écrit en portugais dans `t("…")` ou, hors d'un composant, dans `m("…")`. Les valeurs entrent sous forme de marqueurs : `t("{nome} convidou você", { nome })` (« {nome} vous a invité »)
- Après avoir modifié un texte, `pnpm i18n:catalogo` génère `src/traducao/catalogo.json`. Un test échoue si le catalogue est périmé
- Le texte du participant ne passe pas par la traduction automatique : il entre dans `src/idiomas/textos/`, dans les 37 fichiers, avec le type `TextosParticipante` qui vérifie les marqueurs
- Pour trouver un texte sans `t()`, lancez avec `TRADUCAO_PSEUDO=1` : ce qui apparaît sans ⟦ ⟧ a été oublié

## Documents
- Le `.md` est la source unique, lue par GitHub et par l'onglet Documentation. Un nouveau document entre dans `src/lib/documentacao/catalogo.ts`, et n'apparaît sur le site qu'après être passé dans la liste `PRONTOS`
- Tout diagramme indique, juste en dessous, l'outil utilisé et sa version, le fichier source à télécharger dans `docs/documentacao/fontes/` et la version de l'Outil UEQ qu'il représente (commit ou date)
- Après avoir modifié un diagramme Mermaid, `pnpm docs:diagramas` génère de nouveau le SVG et le fichier source. Un test échoue si l'un des deux est périmé

## Ce qui ne doit pas apparaître
- Un `console.log` oublié
- Du code commenté
- Un `TODO` sans nom ni date (`// TODO(luiza, 12/11): ...` est acceptable)
- Des données factices (lorem ipsum, « John Doe », « Acme ») en dehors de `data/fixtures` et du seed de développement
- Des messages d'erreur génériques (« Something went wrong », « Ocorreu um erro », c'est-à-dire « Une erreur s'est produite »). Dites ce qui s'est passé et ce qu'il faut faire
- Un README avec des emoji, des badges et une section « ✨ Features »

## Commits
- Petits et fréquents, en portugais, à l'impératif, sans emoji : `calcula alfa de Cronbach por escala` (« calcule l'alpha de Cronbach par échelle »), `valida itens faltando no questionário` (« valide les items manquants dans le questionnaire »)
- Un commit par changement logique. Pas de « update », « fix », « wip » seuls
- Chaque membre commite ce qu'il a mené, avec son propre compte

## Tests
- Le module `src/ueq/` a une couverture complète et des tests contre `data/fixtures` (chiffres du tableur officiel)
- Les noms de test sont en portugais et décrivent le comportement : `it('marca como suspeito quem é inconsistente em 3 escalas')` (« marque comme suspect celui qui est incohérent sur 3 échelles »)
- Un nouvel écran a un test e2e avec `verificarAcessibilidade` (axe-core), y compris dans les états d'erreur. Chaque test s'exécute sur ordinateur et sur téléphone
- Chaque cas de test est consigné dans `docs/documentacao/casos-de-teste.md` et dans son `.csv`
