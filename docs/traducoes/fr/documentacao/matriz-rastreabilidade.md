# Matrice de traçabilité

Chacune des 94 exigences est reliée à qui l'a demandée ([personas](personas.md) et [récits utilisateur](historias-de-usuario.md)), à ce que fait l'outil ([cas d'utilisation](casos-de-uso.md)), à ce qui prouve qu'elle fonctionne ([cas de test](casos-de-teste.md)), au sprint au cours duquel elle a été livrée et au code. La même matrice se trouve dans [matriz-rastreabilidade.csv](matriz-rastreabilidade.csv) et dans le [tableur des exigences](planilha-requisitos.xlsx).

## Comment la lire

- Lisez une ligne de gauche à droite pour aller de la demande à la preuve : qui la souhaite, ce que fait l'outil, quel test la vérifie et où se trouve le code.
- Lisez-la en sens inverse avant de modifier un fichier : cherchez le chemin dans la colonne Code et voyez quelles exigences et quels tests en dépendent.
- **Code** indique les fichiers principaux à partir de la racine du dépôt. `(pesquisador)/` abrège `src/app/(ferramenta)/(pesquisador)/` et `(publico)/` abrège `src/app/(ferramenta)/(publico)/`. Un chemin qui se termine par `/` désigne le dossier entier.
- Les exigences non fonctionnelles n'ont pas de cas d'utilisation : elles s'appliquent à tous les écrans.

## Exigences fonctionnelles

### Accès et compte

| Exigence | Récits | Cas d'utilisation | Personas | Cas de test | Sprint | Code |
|---|---|---|---|---|---|---|
| [RF01](requisitos.md#rf01) Créer un compte | [HU01](historias-de-usuario.md#hu01) | [UC01](casos-de-uso.md#uc01) | [PE01](personas.md#pe01) | [CT-E03](casos-de-teste.md#ct-e03), [CT-E06](casos-de-teste.md#ct-e06), [CT-E07](casos-de-teste.md#ct-e07), [CT-E08](casos-de-teste.md#ct-e08), [CT-E90](casos-de-teste.md#ct-e90) | Sprint 03 · Authentification | `(publico)/_acesso/FormularioCadastro.tsx`, `(publico)/_acesso/acoes.ts`, `src/lib/validacao-conta.ts` |
| [RF02](requisitos.md#rf02) Se connecter et se déconnecter | [HU01](historias-de-usuario.md#hu01) | [UC02](casos-de-uso.md#uc02) | [PE01](personas.md#pe01) | [CT-E03](casos-de-teste.md#ct-e03), [CT-E06](casos-de-teste.md#ct-e06), [CT-E08](casos-de-teste.md#ct-e08), [CT-E58](casos-de-teste.md#ct-e58), [CT-E90](casos-de-teste.md#ct-e90) | Sprint 03 · Authentification | `(publico)/_acesso/FormularioEntrar.tsx`, `(publico)/_acesso/acoes.ts`, `src/lib/sessao.ts` |
| [RF03](requisitos.md#rf03) Protéger l'espace du chercheur | [HU22](historias-de-usuario.md#hu22) | [UC02](casos-de-uso.md#uc02) | [PE02](personas.md#pe02) | [CT-E04](casos-de-teste.md#ct-e04) | Sprint 03 · Authentification | `src/proxy.ts`, `src/lib/sessao.ts` |
| [RF04](requisitos.md#rf04) Modifier les données du compte | [HU17](historias-de-usuario.md#hu17) | [UC03](casos-de-uso.md#uc03) | [PE01](personas.md#pe01) | [CT-E09](casos-de-teste.md#ct-e09) | Sprint 03 · Authentification | `(pesquisador)/conta/FormularioDados.tsx`, `(pesquisador)/conta/acoes.ts` |
| [RF05](requisitos.md#rf05) Changer le mot de passe | [HU22](historias-de-usuario.md#hu22) | [UC03](casos-de-uso.md#uc03) | [PE02](personas.md#pe02) | [CT-E10](casos-de-teste.md#ct-e10) | Sprint 03 · Authentification | `(pesquisador)/conta/FormularioSenha.tsx`, `(pesquisador)/conta/acoes.ts` |
| [RF06](requisitos.md#rf06) Supprimer le compte | [HU17](historias-de-usuario.md#hu17) | [UC03](casos-de-uso.md#uc03) | [PE01](personas.md#pe01) | [CT-E11](casos-de-teste.md#ct-e11) | Sprint 03 · Authentification | `(pesquisador)/conta/ExcluirConta.tsx`, `(pesquisador)/conta/acoes.ts` |
| [RF07](requisitos.md#rf07) Télécharger mes données | [HU17](historias-de-usuario.md#hu17) | [UC03](casos-de-uso.md#uc03) | [PE01](personas.md#pe01) | [CT-E81](casos-de-teste.md#ct-e81) | LGPD | `src/app/api/conta/dados/route.ts` |
| [RF08](requisitos.md#rf08) Choisir la langue de l'outil | [HU26](historias-de-usuario.md#hu26) | [UC01](casos-de-uso.md#uc01), [UC03](casos-de-uso.md#uc03) | [PE03](personas.md#pe03) | [CT-E67](casos-de-teste.md#ct-e67), [CT-E94](casos-de-teste.md#ct-e94), [CT-E95](casos-de-teste.md#ct-e95), [CT-U62](casos-de-teste.md#ct-u62), [CT-U63](casos-de-teste.md#ct-u63), [CT-U66](casos-de-teste.md#ct-u66), [CT-U67](casos-de-teste.md#ct-u67), [CT-U68](casos-de-teste.md#ct-u68), [CT-U78](casos-de-teste.md#ct-u78) | Langues de l'outil | `(pesquisador)/SeletorIdioma.tsx`, `(pesquisador)/conta/idioma/`, `src/traducao/` |
| [RF09](requisitos.md#rf09) Visite guidée lors de la première connexion | [HU02](historias-de-usuario.md#hu02) | [UC04](casos-de-uso.md#uc04) | [PE01](personas.md#pe01) | [CT-E66](casos-de-teste.md#ct-e66), [CT-M22](casos-de-teste.md#ct-m22) | Équipe et aide | `src/componentes/tutorial/` |
| [RF10](requisitos.md#rf10) Aide sur chaque page | [HU02](historias-de-usuario.md#hu02) | [UC04](casos-de-uso.md#uc04) | [PE01](personas.md#pe01) | [CT-E65](casos-de-teste.md#ct-e65) | Équipe et aide | `src/componentes/ajuda/BotaoAjuda.tsx`, `src/lib/ajuda.ts` |
| [RF11](requisitos.md#rf11) Page d'accueil | [HU01](historias-de-usuario.md#hu01) | [UC02](casos-de-uso.md#uc02) | [PE01](personas.md#pe01) | [CT-E01](casos-de-teste.md#ct-e01), [CT-E58](casos-de-teste.md#ct-e58), [CT-E59](casos-de-teste.md#ct-e59), [CT-E60](casos-de-teste.md#ct-e60), [CT-E61](casos-de-teste.md#ct-e61), [CT-E69](casos-de-teste.md#ct-e69), [CT-E70](casos-de-teste.md#ct-e70) | Page d'accueil et fenêtres | `(publico)/PaginaInicial.tsx`, `(publico)/conteudo.ts`, `(publico)/_acesso/Acesso.tsx` |

### Études

| Exigence | Récits | Cas d'utilisation | Personas | Cas de test | Sprint | Code |
|---|---|---|---|---|---|---|
| [RF12](requisitos.md#rf12) Lister les études | [HU07](historias-de-usuario.md#hu07) | [UC05](casos-de-uso.md#uc05) | [PE01](personas.md#pe01) | [CT-E12](casos-de-teste.md#ct-e12), [CT-E17](casos-de-teste.md#ct-e17) | Sprint 04 · Études | `(pesquisador)/estudos/page.tsx`, `src/lib/estudos.ts` |
| [RF13](requisitos.md#rf13) Créer une étude | [HU03](historias-de-usuario.md#hu03), [HU04](historias-de-usuario.md#hu04) | [UC06](casos-de-uso.md#uc06) | [PE01](personas.md#pe01) | [CT-E13](casos-de-teste.md#ct-e13), [CT-E14](casos-de-teste.md#ct-e14), [CT-E93](casos-de-teste.md#ct-e93), [CT-M14](casos-de-teste.md#ct-m14) | Sprint 04 · Études | `(pesquisador)/estudos/formulario/`, `(pesquisador)/estudos/acoes.ts`, `src/lib/validacao-estudo.ts` |
| [RF14](requisitos.md#rf14) Modifier une étude | [HU15](historias-de-usuario.md#hu15) | [UC07](casos-de-uso.md#uc07) | [PE01](personas.md#pe01) | [CT-E18](casos-de-teste.md#ct-e18) | Sprint 04 · Études | `(pesquisador)/estudos/[id]/editar/`, `(pesquisador)/estudos/acoes.ts` |
| [RF15](requisitos.md#rf15) Ouvrir, clôturer et rouvrir la collecte | [HU06](historias-de-usuario.md#hu06), [HU14](historias-de-usuario.md#hu14) | [UC08](casos-de-uso.md#uc08) | [PE01](personas.md#pe01) | [CT-E15](casos-de-teste.md#ct-e15) | Sprint 04 · Études | `(pesquisador)/estudos/[id]/BotaoColeta.tsx`, `src/lib/status-estudo.ts`, `src/app/r/[slug]/page.tsx` |
| [RF16](requisitos.md#rf16) Copier le lien public | [HU06](historias-de-usuario.md#hu06) | [UC09](casos-de-uso.md#uc09) | [PE01](personas.md#pe01) | [CT-E16](casos-de-teste.md#ct-e16) | Sprint 04 · Études | `(pesquisador)/estudos/[id]/LinkPublico.tsx`, `src/lib/estudos.ts` |
| [RF17](requisitos.md#rf17) Supprimer une étude | [HU16](historias-de-usuario.md#hu16) | [UC10](casos-de-uso.md#uc10) | [PE01](personas.md#pe01) | [CT-E19](casos-de-teste.md#ct-e19) | Sprint 04 · Études | `(pesquisador)/estudos/[id]/AcoesEstudo.tsx`, `(pesquisador)/estudos/acoes.ts` |
| [RF18](requisitos.md#rf18) Activer la collecte des données démographiques | [HU05](historias-de-usuario.md#hu05) | [UC06](casos-de-uso.md#uc06) | [PE01](personas.md#pe01) | [CT-E71](casos-de-teste.md#ct-e71) | Équipe et aide | `(pesquisador)/estudos/formulario/FormularioEstudo.tsx`, `src/app/r/[slug]/sobre-voce/` |
| [RF19](requisitos.md#rf19) Choisir la langue de l'étude | [HU03](historias-de-usuario.md#hu03), [HU27](historias-de-usuario.md#hu27) | [UC06](casos-de-uso.md#uc06) | [PE01](personas.md#pe01), [PE03](personas.md#pe03) | [CT-E45](casos-de-teste.md#ct-e45) | Langues de l'outil | `(pesquisador)/estudos/formulario/FormularioEstudo.tsx`, `src/idiomas/index.ts` |

### Équipe et notifications

| Exigence | Récits | Cas d'utilisation | Personas | Cas de test | Sprint | Code |
|---|---|---|---|---|---|---|
| [RF20](requisitos.md#rf20) Partager une étude | [HU20](historias-de-usuario.md#hu20) | [UC11](casos-de-uso.md#uc11) | [PE02](personas.md#pe02) | [CT-E63](casos-de-teste.md#ct-e63) | Équipe et aide | `(pesquisador)/estudos/[id]/Compartilhar.tsx`, `(pesquisador)/estudos/[id]/acoes-compartilhar.ts` |
| [RF21](requisitos.md#rf21) Accepter ou refuser une invitation | [HU20](historias-de-usuario.md#hu20) | [UC12](casos-de-uso.md#uc12) | [PE02](personas.md#pe02) | [CT-E63](casos-de-teste.md#ct-e63) | Équipe et aide | `(pesquisador)/SinoNotificacoes.tsx`, `(pesquisador)/notificacoes/acoes.ts` |
| [RF22](requisitos.md#rf22) Cloche de notifications | [HU07](historias-de-usuario.md#hu07), [HU21](historias-de-usuario.md#hu21) | [UC13](casos-de-uso.md#uc13) | [PE01](personas.md#pe01), [PE02](personas.md#pe02) | [CT-E63](casos-de-teste.md#ct-e63), [CT-E64](casos-de-teste.md#ct-e64), [CT-M21](casos-de-teste.md#ct-m21) | Équipe et aide | `(pesquisador)/SinoNotificacoes.tsx`, `src/lib/notificacoes.ts` |
| [RF23](requisitos.md#rf23) Notifications par e-mail | [HU21](historias-de-usuario.md#hu21) | [UC03](casos-de-uso.md#uc03), [UC13](casos-de-uso.md#uc13) | [PE02](personas.md#pe02) | [CT-U59](casos-de-teste.md#ct-u59) | Équipe et aide | `src/lib/email.ts`, `src/lib/modelo-email.ts`, `(pesquisador)/conta/PreferenciaEmail.tsx` |

### Questionnaire du participant

| Exigence | Récits | Cas d'utilisation | Personas | Cas de test | Sprint | Code |
|---|---|---|---|---|---|---|
| [RF24](requisitos.md#rf24) Répondre sans compte | [HU29](historias-de-usuario.md#hu29) | [UC14](casos-de-uso.md#uc14) | [PE04](personas.md#pe04) | [CT-E05](casos-de-teste.md#ct-e05), [CT-E21](casos-de-teste.md#ct-e21), [CT-E52](casos-de-teste.md#ct-e52), [CT-M14](casos-de-teste.md#ct-m14) | Sprint 05 · Questionnaire | `src/app/r/[slug]/`, `src/proxy.ts` |
| [RF25](requisitos.md#rf25) Consentement | [HU04](historias-de-usuario.md#hu04), [HU28](historias-de-usuario.md#hu28), [HU37](historias-de-usuario.md#hu37) | [UC14](casos-de-uso.md#uc14) | [PE01](personas.md#pe01), [PE04](personas.md#pe04), [PE07](personas.md#pe07) | [CT-E21](casos-de-teste.md#ct-e21), [CT-E28](casos-de-teste.md#ct-e28), [CT-E82](casos-de-teste.md#ct-e82), [CT-E91](casos-de-teste.md#ct-e91), [CT-E92](casos-de-teste.md#ct-e92), [CT-U69](casos-de-teste.md#ct-u69), [CT-M25](casos-de-teste.md#ct-m25) | Sprint 05 · Questionnaire | `src/app/r/[slug]/Termo.tsx`, `src/app/r/[slug]/termo/`, `src/lib/termo.ts` |
| [RF26](requisitos.md#rf26) Répartir les participants entre les versions | [HU10](historias-de-usuario.md#hu10) | [UC14](casos-de-uso.md#uc14) | [PE01](personas.md#pe01) | [CT-U30](casos-de-teste.md#ct-u30) | Sprint 05 · Questionnaire | `src/lib/balanceamento.ts` |
| [RF27](requisitos.md#rf27) Répondre aux 26 items | [HU29](historias-de-usuario.md#hu29), [HU35](historias-de-usuario.md#hu35) | [UC14](casos-de-uso.md#uc14) | [PE04](personas.md#pe04), [PE05](personas.md#pe05) | [CT-E21](casos-de-teste.md#ct-e21), [CT-E24](casos-de-teste.md#ct-e24), [CT-M02](casos-de-teste.md#ct-m02), [CT-M17](casos-de-teste.md#ct-m17) | Sprint 05 · Questionnaire | `src/componentes/ItemDiferencial.tsx`, `src/app/r/[slug]/questionario/FormularioQuestionario.tsx` |
| [RF28](requisitos.md#rf28) Suivre la progression | [HU29](historias-de-usuario.md#hu29) | [UC14](casos-de-uso.md#uc14) | [PE04](personas.md#pe04) | [CT-E22](casos-de-teste.md#ct-e22), [CT-M03](casos-de-teste.md#ct-m03) | Sprint 05 · Questionnaire | `src/app/r/[slug]/questionario/RodapeProgresso.tsx` |
| [RF29](requisitos.md#rf29) Signaler les items manquants | [HU30](historias-de-usuario.md#hu30) | [UC14](casos-de-uso.md#uc14) | [PE04](personas.md#pe04) | [CT-E23](casos-de-teste.md#ct-e23), [CT-M04](casos-de-teste.md#ct-m04) | Sprint 05 · Questionnaire | `src/app/r/[slug]/questionario/FormularioQuestionario.tsx`, `src/componentes/formulario/ResumoErros.tsx` |
| [RF30](requisitos.md#rf30) Récupérer les réponses cochées | [HU31](historias-de-usuario.md#hu31) | [UC14](casos-de-uso.md#uc14) | [PE04](personas.md#pe04) | [CT-E26](casos-de-teste.md#ct-e26), [CT-E68](casos-de-teste.md#ct-e68) | Sprint 05 · Questionnaire | `src/app/r/[slug]/questionario/useRascunho.ts` |
| [RF31](requisitos.md#rf31) Quitter sans envoyer | [HU32](historias-de-usuario.md#hu32) | [UC17](casos-de-uso.md#uc17) | [PE04](personas.md#pe04) | [CT-E27](casos-de-teste.md#ct-e27) | Sprint 05 · Questionnaire | `src/app/r/[slug]/questionario/FormularioQuestionario.tsx`, `src/app/r/[slug]/saiu/` |
| [RF32](requisitos.md#rf32) Données démographiques facultatives | [HU33](historias-de-usuario.md#hu33) | [UC16](casos-de-uso.md#uc16) | [PE04](personas.md#pe04) | [CT-E21](casos-de-teste.md#ct-e21), [CT-E71](casos-de-teste.md#ct-e71) | Sprint 05 · Questionnaire | `src/app/r/[slug]/sobre-voce/`, `src/lib/demografia.ts` |
| [RF33](requisitos.md#rf33) Terminer et ne pas répondre à nouveau | [HU34](historias-de-usuario.md#hu34) | [UC14](casos-de-uso.md#uc14) | [PE04](personas.md#pe04) | [CT-E21](casos-de-teste.md#ct-e21), [CT-E28](casos-de-teste.md#ct-e28) | Sprint 05 · Questionnaire | `src/app/r/[slug]/acoes.ts`, `src/app/r/[slug]/fim/`, `src/lib/participacao.ts` |
| [RF34](requisitos.md#rf34) Répondre en 37 langues | [HU27](historias-de-usuario.md#hu27), [HU36](historias-de-usuario.md#hu36) | [UC15](casos-de-uso.md#uc15) | [PE03](personas.md#pe03), [PE06](personas.md#pe06) | [CT-E45](casos-de-teste.md#ct-e45), [CT-E46](casos-de-teste.md#ct-e46), [CT-E68](casos-de-teste.md#ct-e68), [CT-E83](casos-de-teste.md#ct-e83), [CT-U45](casos-de-teste.md#ct-u45), [CT-U47](casos-de-teste.md#ct-u47), [CT-U48](casos-de-teste.md#ct-u48), [CT-U49](casos-de-teste.md#ct-u49), [CT-U50](casos-de-teste.md#ct-u50), [CT-M24](casos-de-teste.md#ct-m24) | Sprint des langues | `src/idiomas/`, `src/app/r/[slug]/SeletorIdioma.tsx` |
| [RF35](requisitos.md#rf35) Traduire les textes de l'étude | [HU27](historias-de-usuario.md#hu27) | [UC15](casos-de-uso.md#uc15) | [PE03](personas.md#pe03) | [CT-U63](casos-de-teste.md#ct-u63) | Langues de l'outil | `src/traducao/servidor.ts`, `src/traducao/claude.ts` |

### Calcul de l'UEQ

| Exigence | Récits | Cas d'utilisation | Personas | Cas de test | Sprint | Code |
|---|---|---|---|---|---|---|
| [RF36](requisitos.md#rf36) Recoder les réponses | [HU18](historias-de-usuario.md#hu18) | [UC19](casos-de-uso.md#uc19) | [PE02](personas.md#pe02) | [CT-U01](casos-de-teste.md#ct-u01), [CT-U02](casos-de-teste.md#ct-u02), [CT-U03](casos-de-teste.md#ct-u03), [CT-U04](casos-de-teste.md#ct-u04), [CT-U05](casos-de-teste.md#ct-u05), [CT-U06](casos-de-teste.md#ct-u06) | Sprint 02 · Calcul | `src/ueq/recodificar.ts` |
| [RF37](requisitos.md#rf37) Statistiques par échelle | [HU18](historias-de-usuario.md#hu18), [HU24](historias-de-usuario.md#hu24) | [UC19](casos-de-uso.md#uc19) | [PE02](personas.md#pe02) | [CT-U07](casos-de-teste.md#ct-u07), [CT-U08](casos-de-teste.md#ct-u08), [CT-U09](casos-de-teste.md#ct-u09), [CT-U10](casos-de-teste.md#ct-u10), [CT-U11](casos-de-teste.md#ct-u11), [CT-U12](casos-de-teste.md#ct-u12), [CT-U14](casos-de-teste.md#ct-u14), [CT-U21](casos-de-teste.md#ct-u21) | Sprint 02 · Calcul | `src/ueq/estatistica.ts`, `src/ueq/escalas.ts` |
| [RF38](requisitos.md#rf38) Interpréter les moyennes | [HU08](historias-de-usuario.md#hu08), [HU24](historias-de-usuario.md#hu24) | [UC19](casos-de-uso.md#uc19) | [PE01](personas.md#pe01), [PE02](personas.md#pe02) | [CT-U13](casos-de-teste.md#ct-u13) | Sprint 02 · Calcul | `src/ueq/escalas.ts` |
| [RF39](requisitos.md#rf39) Qualité pragmatique et hédonique | [HU24](historias-de-usuario.md#hu24) | [UC19](casos-de-uso.md#uc19) | [PE02](personas.md#pe02) | [CT-U20](casos-de-teste.md#ct-u20) | Sprint 02 · Calcul | `src/ueq/index.ts`, `src/ueq/itens.ts` |
| [RF40](requisitos.md#rf40) Classer dans le benchmark | [HU24](historias-de-usuario.md#hu24) | [UC19](casos-de-uso.md#uc19) | [PE02](personas.md#pe02) | [CT-U16](casos-de-teste.md#ct-u16), [CT-U17](casos-de-teste.md#ct-u17), [CT-U20](casos-de-teste.md#ct-u20) | Sprint 02 · Calcul | `src/ueq/benchmark.ts`, `data/benchmark.json` |
| [RF41](requisitos.md#rf41) Moyenne par item | [HU09](historias-de-usuario.md#hu09) | [UC19](casos-de-uso.md#uc19) | [PE01](personas.md#pe01) | [CT-U15](casos-de-teste.md#ct-u15) | Sprint 02 · Calcul | `src/ueq/escalas.ts` |
| [RF42](requisitos.md#rf42) Calculer uniquement avec les participants inclus dans l'analyse | [HU12](historias-de-usuario.md#hu12) | [UC19](casos-de-uso.md#uc19) | [PE01](personas.md#pe01) | [CT-U18](casos-de-teste.md#ct-u18), [CT-U19](casos-de-teste.md#ct-u19), [CT-U22](casos-de-teste.md#ct-u22) | Sprint 02 · Calcul | `src/ueq/index.ts`, `src/lib/resultados.ts` |

### Résultats

| Exigence | Récits | Cas d'utilisation | Personas | Cas de test | Sprint | Code |
|---|---|---|---|---|---|---|
| [RF43](requisitos.md#rf43) Tableau de bord des résultats | [HU08](historias-de-usuario.md#hu08) | [UC18](casos-de-uso.md#uc18) | [PE01](personas.md#pe01) | [CT-E29](casos-de-teste.md#ct-e29), [CT-M14](casos-de-teste.md#ct-m14) | Sprint 06 · Résultats | `(pesquisador)/estudos/[id]/resultados/`, `src/graficos/EscalasComBenchmark.tsx` |
| [RF44](requisitos.md#rf44) Lecture rapide | [HU08](historias-de-usuario.md#hu08) | [UC18](casos-de-uso.md#uc18) | [PE01](personas.md#pe01) | [CT-U42](casos-de-teste.md#ct-u42) | Sprint 06 · Résultats | `src/lib/leitura-rapida.ts` |
| [RF45](requisitos.md#rf45) Avertissements d'alpha faible et de petit échantillon | [HU08](historias-de-usuario.md#hu08) | [UC18](casos-de-uso.md#uc18) | [PE01](personas.md#pe01) | [CT-E30](casos-de-teste.md#ct-e30), [CT-U21](casos-de-teste.md#ct-u21) | Sprint 06 · Résultats | `(pesquisador)/estudos/[id]/resultados/VisaoUmaVersao.tsx`, `src/componentes/Avisos.tsx` |
| [RF46](requisitos.md#rf46) Graphique par item | [HU09](historias-de-usuario.md#hu09) | [UC18](casos-de-uso.md#uc18) | [PE01](personas.md#pe01) | [CT-E29](casos-de-teste.md#ct-e29) | Sprint 06 · Résultats | `src/graficos/MediasPorItem.tsx` |
| [RF47](requisitos.md#rf47) Comparer les versions | [HU10](historias-de-usuario.md#hu10) | [UC20](casos-de-uso.md#uc20) | [PE01](personas.md#pe01) | [CT-E29](casos-de-teste.md#ct-e29), [CT-U43](casos-de-teste.md#ct-u43) | Sprint 06 · Résultats | `(pesquisador)/estudos/[id]/resultados/VisaoComparacao.tsx`, `src/lib/leitura-rapida.ts` |
| [RF48](requisitos.md#rf48) Conserver la vue dans l'adresse | [HU10](historias-de-usuario.md#hu10) | [UC18](casos-de-uso.md#uc18) | [PE01](personas.md#pe01) | [CT-E29](casos-de-teste.md#ct-e29) | Sprint 06 · Résultats | `(pesquisador)/estudos/[id]/resultados/ControlesResultados.tsx` |
| [RF49](requisitos.md#rf49) Expliquer les termes | [HU08](historias-de-usuario.md#hu08) | [UC18](casos-de-uso.md#uc18) | [PE01](personas.md#pe01) | — | Sprint 06 · Résultats | `(pesquisador)/estudos/[id]/resultados/Explicacoes.tsx` |
| [RF50](requisitos.md#rf50) Voir les données démographiques | [HU13](historias-de-usuario.md#hu13) | [UC21](casos-de-uso.md#uc21) | [PE01](personas.md#pe01) | [CT-E72](casos-de-teste.md#ct-e72), [CT-U60](casos-de-teste.md#ct-u60) | LGPD | `(pesquisador)/estudos/[id]/resultados/demograficos/`, `src/graficos/Demografia.tsx`, `src/lib/perfil-demografico.ts` |

### Réponses et suspicions

| Exigence | Récits | Cas d'utilisation | Personas | Cas de test | Sprint | Code |
|---|---|---|---|---|---|---|
| [RF51](requisitos.md#rf51) Signaler les réponses suspectes | [HU12](historias-de-usuario.md#hu12) | [UC24](casos-de-uso.md#uc24) | [PE01](personas.md#pe01) | [CT-E33](casos-de-teste.md#ct-e33), [CT-U19](casos-de-teste.md#ct-u19), [CT-U23](casos-de-teste.md#ct-u23), [CT-U24](casos-de-teste.md#ct-u24), [CT-U25](casos-de-teste.md#ct-u25), [CT-U26](casos-de-teste.md#ct-u26), [CT-U27](casos-de-teste.md#ct-u27), [CT-U28](casos-de-teste.md#ct-u28) | Sprint 07 · Réponses suspectes | `src/ueq/inconsistencia.ts`, `data/protocolo.json` |
| [RF52](requisitos.md#rf52) Tableau des participations | [HU12](historias-de-usuario.md#hu12) | [UC23](casos-de-uso.md#uc23) | [PE01](personas.md#pe01) | [CT-E33](casos-de-teste.md#ct-e33), [CT-E36](casos-de-teste.md#ct-e36), [CT-U36](casos-de-teste.md#ct-u36) | Sprint 07 · Réponses suspectes | `(pesquisador)/estudos/[id]/respostas/TabelaParticipacoes.tsx`, `src/lib/participacoes.ts` |
| [RF53](requisitos.md#rf53) Voir les échelles d'un participant | [HU12](historias-de-usuario.md#hu12) | [UC23](casos-de-uso.md#uc23) | [PE01](personas.md#pe01) | [CT-E35](casos-de-teste.md#ct-e35) | Sprint 07 · Réponses suspectes | `(pesquisador)/estudos/[id]/respostas/TabelaParticipacoes.tsx` |
| [RF54](requisitos.md#rf54) Retirer des réponses de l'analyse et les y réintégrer | [HU12](historias-de-usuario.md#hu12) | [UC23](casos-de-uso.md#uc23) | [PE01](personas.md#pe01) | [CT-E33](casos-de-teste.md#ct-e33), [CT-E34](casos-de-teste.md#ct-e34) | Sprint 07 · Réponses suspectes | `(pesquisador)/estudos/[id]/respostas/acoes.ts` |
| [RF55](requisitos.md#rf55) Recalculer les suspicions | [HU39](historias-de-usuario.md#hu39) | [UC32](casos-de-uso.md#uc32) | [PE08](personas.md#pe08) | [CT-M16](casos-de-teste.md#ct-m16) | Sprint 07 · Réponses suspectes | `prisma/recalcular-suspeitas.ts` |

### Exportation et importation

| Exigence | Récits | Cas d'utilisation | Personas | Cas de test | Sprint | Code |
|---|---|---|---|---|---|---|
| [RF56](requisitos.md#rf56) Exporter les réponses brutes | [HU23](historias-de-usuario.md#hu23) | [UC25](casos-de-uso.md#uc25) | [PE02](personas.md#pe02) | [CT-E37](casos-de-teste.md#ct-e37), [CT-U31](casos-de-teste.md#ct-u31), [CT-U32](casos-de-teste.md#ct-u32), [CT-U35](casos-de-teste.md#ct-u35) | Sprint 08 · Exportation | `src/lib/exportacoes.ts`, `src/app/api/estudos/[id]/exportar/[tipo]/route.ts` |
| [RF57](requisitos.md#rf57) Exporter les réponses recodées | [HU23](historias-de-usuario.md#hu23) | [UC25](casos-de-uso.md#uc25) | [PE02](personas.md#pe02) | [CT-E37](casos-de-teste.md#ct-e37), [CT-U32](casos-de-teste.md#ct-u32), [CT-U37](casos-de-teste.md#ct-u37) | Sprint 08 · Exportation | `src/lib/exportacoes.ts`, `src/app/api/estudos/[id]/exportar/[tipo]/route.ts` |
| [RF58](requisitos.md#rf58) Exporter les résultats par échelle | [HU11](historias-de-usuario.md#hu11) | [UC25](casos-de-uso.md#uc25) | [PE01](personas.md#pe01) | [CT-E37](casos-de-teste.md#ct-e37), [CT-U32](casos-de-teste.md#ct-u32), [CT-U33](casos-de-teste.md#ct-u33), [CT-U38](casos-de-teste.md#ct-u38) | Sprint 08 · Exportation | `src/lib/exportacoes.ts`, `src/app/api/estudos/[id]/exportar/[tipo]/route.ts` |
| [RF59](requisitos.md#rf59) Exporter dans le tableur officiel de l'UEQ | [HU18](historias-de-usuario.md#hu18) | [UC25](casos-de-uso.md#uc25) | [PE02](personas.md#pe02) | [CT-E37](casos-de-teste.md#ct-e37), [CT-E96](casos-de-teste.md#ct-e96), [CT-U34](casos-de-teste.md#ct-u34), [CT-U70](casos-de-teste.md#ct-u70) | Sprint 09 · Révision finale | `src/lib/planilha-oficial.ts`, `src/lib/exportacoes.ts`, `src/app/api/estudos/[id]/exportar/[tipo]/route.ts`, `data/planilha-oficial/` |
| [RF60](requisitos.md#rf60) Exporter le tableau de bord en PDF | [HU11](historias-de-usuario.md#hu11) | [UC22](casos-de-uso.md#uc22) | [PE01](personas.md#pe01) | [CT-E39](casos-de-teste.md#ct-e39), [CT-E40](casos-de-teste.md#ct-e40), [CT-E41](casos-de-teste.md#ct-e41) | Sprint 10 · Extensions | `src/app/api/estudos/[id]/painel-pdf/route.ts`, `(pesquisador)/estudos/[id]/resultados/impressao/` |
| [RF61](requisitos.md#rf61) Importer des réponses par CSV | [HU19](historias-de-usuario.md#hu19) | [UC26](casos-de-uso.md#uc26) | [PE02](personas.md#pe02) | [CT-E42](casos-de-teste.md#ct-e42), [CT-E43](casos-de-teste.md#ct-e43), [CT-E44](casos-de-teste.md#ct-e44), [CT-U36](casos-de-teste.md#ct-u36), [CT-U39](casos-de-teste.md#ct-u39), [CT-U40](casos-de-teste.md#ct-u40), [CT-U41](casos-de-teste.md#ct-u41) | Sprint 10 · Extensions | `(pesquisador)/estudos/[id]/respostas/importar/`, `src/lib/importacao.ts` |
| [RF62](requisitos.md#rf62) Appliquer l'UEQ-S | [HU25](historias-de-usuario.md#hu25) | [UC27](casos-de-uso.md#uc27) | [PE02](personas.md#pe02) | [CT-U53](casos-de-teste.md#ct-u53), [CT-U71](casos-de-teste.md#ct-u71), [CT-U72](casos-de-teste.md#ct-u72), [CT-U73](casos-de-teste.md#ct-u73), [CT-U74](casos-de-teste.md#ct-u74), [CT-U75](casos-de-teste.md#ct-u75), [CT-U76](casos-de-teste.md#ct-u76), [CT-U77](casos-de-teste.md#ct-u77), [CT-E97](casos-de-teste.md#ct-e97), [CT-E98](casos-de-teste.md#ct-e98), [CT-E99](casos-de-teste.md#ct-e99), [CT-E100](casos-de-teste.md#ct-e100), [CT-E101](casos-de-teste.md#ct-e101), [CT-E102](casos-de-teste.md#ct-e102), [CT-M26](casos-de-teste.md#ct-m26) | UEQ-S | `src/ueq/ueq-s.ts`, `data/ueq-s-itens-ptbr.json`, `data/ueq-s-idiomas.json`, `data/benchmark-ueq-s.json`, `data/protocolo-ueq-s.json`, `data/fixtures-ueq-s/` |

### Documentation

| Exigence | Récits | Cas d'utilisation | Personas | Cas de test | Sprint | Code |
|---|---|---|---|---|---|---|
| [RF63](requisitos.md#rf63) Onglet Documentation | [HU44](historias-de-usuario.md#hu44) | [UC28](casos-de-uso.md#uc28) | [PE08](personas.md#pe08) | [CT-E47](casos-de-teste.md#ct-e47), [CT-E48](casos-de-teste.md#ct-e48), [CT-E50](casos-de-teste.md#ct-e50), [CT-E62](casos-de-teste.md#ct-e62), [CT-E84](casos-de-teste.md#ct-e84), [CT-E85](casos-de-teste.md#ct-e85), [CT-E87](casos-de-teste.md#ct-e87), [CT-U54](casos-de-teste.md#ct-u54), [CT-U55](casos-de-teste.md#ct-u55), [CT-U57](casos-de-teste.md#ct-u57), [CT-U64](casos-de-teste.md#ct-u64) | Sprint de documentation | `(publico)/documentacao/`, `src/lib/documentacao/` |
| [RF64](requisitos.md#rf64) Diagrammes en plein écran | [HU44](historias-de-usuario.md#hu44) | [UC28](casos-de-uso.md#uc28) | [PE08](personas.md#pe08) | [CT-E57](casos-de-teste.md#ct-e57), [CT-U55](casos-de-teste.md#ct-u55) | Sprint de documentation | `(publico)/documentacao/ArtigoDocumento.tsx` |
| [RF65](requisitos.md#rf65) Liens et téléchargements de la documentation | [HU44](historias-de-usuario.md#hu44) | [UC28](casos-de-uso.md#uc28) | [PE08](personas.md#pe08) | [CT-E49](casos-de-teste.md#ct-e49), [CT-E51](casos-de-teste.md#ct-e51), [CT-E86](casos-de-teste.md#ct-e86), [CT-U54](casos-de-teste.md#ct-u54), [CT-U56](casos-de-teste.md#ct-u56), [CT-U65](casos-de-teste.md#ct-u65) | Sprint de documentation | `src/lib/documentacao/markdown.ts`, `src/app/api/documentacao/[...caminho]/route.ts` |

### Administration

| Exigence | Récits | Cas d'utilisation | Personas | Cas de test | Sprint | Code |
|---|---|---|---|---|---|---|
| [RF66](requisitos.md#rf66) Gérer les comptes | [HU41](historias-de-usuario.md#hu41) | [UC29](casos-de-uso.md#uc29) | [PE08](personas.md#pe08) | — | Équipe et aide | `(pesquisador)/administracao/contas/`, `src/lib/administracao.ts` |
| [RF67](requisitos.md#rf67) Scénarios de démonstration | [HU42](historias-de-usuario.md#hu42) | [UC30](casos-de-uso.md#uc30) | [PE08](personas.md#pe08) | [CT-U61](casos-de-teste.md#ct-u61) | Équipe et aide | `(pesquisador)/administracao/cenarios/`, `src/lib/cenarios/` |
| [RF68](requisitos.md#rf68) État de la protection des données et des traductions | [HU43](historias-de-usuario.md#hu43) | [UC31](casos-de-uso.md#uc31) | [PE08](personas.md#pe08) | — | Langues de l'outil | `(pesquisador)/administracao/protecao/`, `(pesquisador)/administracao/idiomas/` |

## Exigences non fonctionnelles

### Accessibilité

| Exigence | Récits | Personas | Cas de test | Sprint | Code |
|---|---|---|---|---|---|
| [RNF01](requisitos.md#rnf01) WCAG 2.2 AA | [HU35](historias-de-usuario.md#hu35) | [PE05](personas.md#pe05) | [CT-E01](casos-de-teste.md#ct-e01), [CT-E06](casos-de-teste.md#ct-e06), [CT-E12](casos-de-teste.md#ct-e12), [CT-E14](casos-de-teste.md#ct-e14), [CT-E21](casos-de-teste.md#ct-e21), [CT-E47](casos-de-teste.md#ct-e47), [CT-E74](casos-de-teste.md#ct-e74), [CT-M11](casos-de-teste.md#ct-m11), [CT-M13](casos-de-teste.md#ct-m13), [CT-M18](casos-de-teste.md#ct-m18) | Sprint 00 · Mise en place | `tests/e2e/acessibilidade.ts` |
| [RNF02](requisitos.md#rnf02) 320 px et zoom de 400 % | [HU29](historias-de-usuario.md#hu29) | [PE04](personas.md#pe04) | [CT-E25](casos-de-teste.md#ct-e25), [CT-E31](casos-de-teste.md#ct-e31), [CT-E36](casos-de-teste.md#ct-e36), [CT-E44](casos-de-teste.md#ct-e44), [CT-E50](casos-de-teste.md#ct-e50), [CT-E75](casos-de-teste.md#ct-e75), [CT-M08](casos-de-teste.md#ct-m08) | Sprint 05 · Questionnaire | `src/styles/tokens.css`, `src/app/globals.css` |
| [RNF03](requisitos.md#rnf03) Utilisation au clavier seul | [HU35](historias-de-usuario.md#hu35) | [PE05](personas.md#pe05) | [CT-E02](casos-de-teste.md#ct-e02), [CT-E03](casos-de-teste.md#ct-e03), [CT-E22](casos-de-teste.md#ct-e22), [CT-E53](casos-de-teste.md#ct-e53), [CT-E54](casos-de-teste.md#ct-e54), [CT-E55](casos-de-teste.md#ct-e55), [CT-E64](casos-de-teste.md#ct-e64), [CT-M07](casos-de-teste.md#ct-m07) | Sprint 05 · Questionnaire | `(pesquisador)/BarraFixa.tsx`, `src/app/globals.css` |
| [RNF04](requisitos.md#rnf04) Lecteur d'écran | [HU35](historias-de-usuario.md#hu35) | [PE05](personas.md#pe05) | [CT-E24](casos-de-teste.md#ct-e24), [CT-U48](casos-de-teste.md#ct-u48), [CT-M01](casos-de-teste.md#ct-m01), [CT-M02](casos-de-teste.md#ct-m02), [CT-M03](casos-de-teste.md#ct-m03), [CT-M04](casos-de-teste.md#ct-m04), [CT-M05](casos-de-teste.md#ct-m05), [CT-M06](casos-de-teste.md#ct-m06), [CT-M20](casos-de-teste.md#ct-m20), [CT-M21](casos-de-teste.md#ct-m21), [CT-M22](casos-de-teste.md#ct-m22), [CT-M23](casos-de-teste.md#ct-m23) | Sprint 05 · Questionnaire | `src/componentes/ItemDiferencial.tsx`, `src/componentes/formulario/MensagemStatus.tsx` |
| [RNF05](requisitos.md#rnf05) Zone tactile | [HU29](historias-de-usuario.md#hu29) | [PE04](personas.md#pe04) | [CT-M12](casos-de-teste.md#ct-m12) | Sprint 05 · Questionnaire | `src/componentes/ItemDiferencial.tsx` |
| [RNF06](requisitos.md#rnf06) Contraste | [HU29](historias-de-usuario.md#hu29) | [PE04](personas.md#pe04) | [CT-U51](casos-de-teste.md#ct-u51), [CT-U52](casos-de-teste.md#ct-u52), [CT-M10](casos-de-teste.md#ct-m10) | Sprint 00 · Mise en place | `src/styles/tokens.css` |
| [RNF07](requisitos.md#rnf07) Information non portée uniquement par la couleur | [HU08](historias-de-usuario.md#hu08) | [PE01](personas.md#pe01) | [CT-E32](casos-de-teste.md#ct-e32), [CT-U52](casos-de-teste.md#ct-u52), [CT-M09](casos-de-teste.md#ct-m09), [CT-M10](casos-de-teste.md#ct-m10) | Sprint 06 · Résultats | `src/graficos/` |
| [RNF08](requisitos.md#rnf08) Graphiques avec équivalent textuel | [HU08](historias-de-usuario.md#hu08) | [PE01](personas.md#pe01) | [CT-E29](casos-de-teste.md#ct-e29), [CT-M05](casos-de-teste.md#ct-m05) | Sprint 06 · Résultats | `src/graficos/` |

### Fidélité à l'instrument

| Exigence | Récits | Personas | Cas de test | Sprint | Code |
|---|---|---|---|---|---|
| [RNF09](requisitos.md#rnf09) Questionnaire sans biais d'interface | [HU18](historias-de-usuario.md#hu18) | [PE02](personas.md#pe02) | [CT-E24](casos-de-teste.md#ct-e24) | Sprint 05 · Questionnaire | `src/componentes/ItemDiferencial.tsx` |
| [RNF10](requisitos.md#rnf10) Termes officiels | [HU36](historias-de-usuario.md#hu36) | [PE06](personas.md#pe06) | [CT-U45](casos-de-teste.md#ct-u45), [CT-U46](casos-de-teste.md#ct-u46), [CT-U47](casos-de-teste.md#ct-u47), [CT-M17](casos-de-teste.md#ct-m17) | Sprint des langues | `data/ueq-itens-ptbr.json`, `data/ueq-idiomas.json`, `prisma/seed.ts` |
| [RNF11](requisitos.md#rnf11) Calcul identique à celui du tableur officiel | [HU18](historias-de-usuario.md#hu18) | [PE02](personas.md#pe02) | [CT-E96](casos-de-teste.md#ct-e96), [CT-M15](casos-de-teste.md#ct-m15), [CT-U29](casos-de-teste.md#ct-u29) | Sprint 09 · Révision finale | `src/ueq/__tests__/fixtures.test.ts`, `data/fixtures/`, `scripts/planilha-oficial.ps1` |

### Sécurité et confidentialité

| Exigence | Récits | Personas | Cas de test | Sprint | Code |
|---|---|---|---|---|---|
| [RNF12](requisitos.md#rnf12) Anonymat du participant | [HU33](historias-de-usuario.md#hu33) | [PE04](personas.md#pe04) | [CT-E21](casos-de-teste.md#ct-e21) | Sprint 05 · Questionnaire | `prisma/schema.prisma`, `src/lib/participacao.ts` |
| [RNF13](requisitos.md#rnf13) Collecte minimale | [HU05](historias-de-usuario.md#hu05) | [PE01](personas.md#pe01) | — | LGPD | `prisma/schema.prisma`, `src/app/r/[slug]/acoes.ts` |
| [RNF14](requisitos.md#rnf14) Chiffrement des données démographiques | [HU05](historias-de-usuario.md#hu05), [HU43](historias-de-usuario.md#hu43) | [PE01](personas.md#pe01), [PE08](personas.md#pe08) | [CT-U58](casos-de-teste.md#ct-u58) | LGPD | `src/lib/cripto.ts`, `prisma/cifrar-dados.ts` |
| [RNF15](requisitos.md#rnf15) Mot de passe et session protégés | [HU22](historias-de-usuario.md#hu22) | [PE02](personas.md#pe02) | [CT-E10](casos-de-teste.md#ct-e10) | Sprint 03 · Authentification | `src/lib/senhas.ts`, `src/lib/sessao.ts`, `src/lib/cookie-sessao.ts` |
| [RNF16](requisitos.md#rnf16) Limite de tentatives de connexion | [HU22](historias-de-usuario.md#hu22) | [PE02](personas.md#pe02) | [CT-E80](casos-de-teste.md#ct-e80) | LGPD | `src/lib/tentativas.ts` |
| [RNF17](requisitos.md#rnf17) Accès uniquement à ses propres études | [HU20](historias-de-usuario.md#hu20), [HU41](historias-de-usuario.md#hu41) | [PE02](personas.md#pe02), [PE08](personas.md#pe08) | [CT-E20](casos-de-teste.md#ct-e20), [CT-E38](casos-de-teste.md#ct-e38), [CT-E41](casos-de-teste.md#ct-e41) | Sprint 04 · Études | `src/lib/estudos.ts` |
| [RNF18](requisitos.md#rnf18) Protections du navigateur | [HU22](historias-de-usuario.md#hu22) | [PE02](personas.md#pe02) | [CT-E73](casos-de-teste.md#ct-e73) | LGPD | `next.config.ts` |
| [RNF19](requisitos.md#rnf19) Politique de confidentialité | [HU17](historias-de-usuario.md#hu17), [HU28](historias-de-usuario.md#hu28) | [PE01](personas.md#pe01), [PE04](personas.md#pe04) | [CT-E74](casos-de-teste.md#ct-e74), [CT-E75](casos-de-teste.md#ct-e75), [CT-E76](casos-de-teste.md#ct-e76), [CT-E77](casos-de-teste.md#ct-e77), [CT-E78](casos-de-teste.md#ct-e78), [CT-E79](casos-de-teste.md#ct-e79), [CT-E82](casos-de-teste.md#ct-e82), [CT-E83](casos-de-teste.md#ct-e83), [CT-M23](casos-de-teste.md#ct-m23), [CT-M25](casos-de-teste.md#ct-m25) | LGPD | `(publico)/privacidade/`, `src/app/r/[slug]/privacidade/` |

### Utilisabilité

| Exigence | Récits | Personas | Cas de test | Sprint | Code |
|---|---|---|---|---|---|
| [RNF20](requisitos.md#rnf20) Retour pour chaque action | [HU06](historias-de-usuario.md#hu06) | [PE01](personas.md#pe01) | [CT-E09](casos-de-teste.md#ct-e09), [CT-E15](casos-de-teste.md#ct-e15), [CT-E16](casos-de-teste.md#ct-e16), [CT-E88](casos-de-teste.md#ct-e88), [CT-E89](casos-de-teste.md#ct-e89), [CT-E90](casos-de-teste.md#ct-e90), [CT-M06](casos-de-teste.md#ct-m06), [CT-M13](casos-de-teste.md#ct-m13) | Sprint 04 · Études | `src/componentes/formulario/MensagemStatus.tsx`, `src/componentes/formulario/BotaoEnvio.tsx` |
| [RNF21](requisitos.md#rnf21) Confirmation avant toute perte de données | [HU16](historias-de-usuario.md#hu16), [HU32](historias-de-usuario.md#hu32) | [PE01](personas.md#pe01), [PE04](personas.md#pe04) | [CT-E11](casos-de-teste.md#ct-e11), [CT-E19](casos-de-teste.md#ct-e19), [CT-E27](casos-de-teste.md#ct-e27), [CT-M13](casos-de-teste.md#ct-m13), [CT-M20](casos-de-teste.md#ct-m20) | Sprint 04 · Études | `src/componentes/janela/Confirmacao.tsx` |
| [RNF22](requisitos.md#rnf22) Format brésilien des nombres et des dates | [HU11](historias-de-usuario.md#hu11), [HU23](historias-de-usuario.md#hu23) | [PE01](personas.md#pe01), [PE02](personas.md#pe02) | [CT-U33](casos-de-teste.md#ct-u33), [CT-U44](casos-de-teste.md#ct-u44) | Sprint 06 · Résultats | `src/idiomas/formatar.ts`, `src/lib/csv.ts` |

### Plateforme et maintenance

| Exigence | Récits | Personas | Cas de test | Sprint | Code |
|---|---|---|---|---|---|
| [RNF23](requisitos.md#rnf23) Ordinateur et téléphone mobile | [HU29](historias-de-usuario.md#hu29) | [PE04](personas.md#pe04) | [CT-E53](casos-de-teste.md#ct-e53), [CT-E55](casos-de-teste.md#ct-e55), [CT-E56](casos-de-teste.md#ct-e56), [CT-M12](casos-de-teste.md#ct-m12) | Sprint 00 · Mise en place | `playwright.config.ts` |
| [RNF24](requisitos.md#rnf24) Application web à code source ouvert | [HU38](historias-de-usuario.md#hu38) | [PE08](personas.md#pe08) | [CT-M19](casos-de-teste.md#ct-m19) | Sprint 00 · Mise en place | `LICENSE`, `README.md` |
| [RNF25](requisitos.md#rnf25) Calcul isolé et testé | [HU40](historias-de-usuario.md#hu40) | [PE08](personas.md#pe08) | [CT-U01](casos-de-teste.md#ct-u01), [CT-U02](casos-de-teste.md#ct-u02), [CT-U07](casos-de-teste.md#ct-u07), [CT-U12](casos-de-teste.md#ct-u12), [CT-U14](casos-de-teste.md#ct-u14), [CT-U22](casos-de-teste.md#ct-u22) | Sprint 02 · Calcul | `src/ueq/` |
| [RNF26](requisitos.md#rnf26) Vérifications avant l'intégration | [HU40](historias-de-usuario.md#hu40) | [PE08](personas.md#pe08) | — | Sprint 00 · Mise en place | `package.json` |

## Couverture

- **Récits et cas d'utilisation :** chaque exigence a au moins un récit ; chaque exigence fonctionnelle a au moins un cas d'utilisation.
- **Cas de test :** 89 des 94 exigences ont au moins un cas de test automatisé ou manuel. Les 5 restantes sont vérifiées par l'étape Comment vérifier de l'exigence elle-même :

| Exigence | Pourquoi elle n'a pas de cas de test | Comment vérifier |
|---|---|---|
| [RF49](requisitos.md#rf49) Expliquer les termes | Les explications sont un texte statique placé à côté de chaque terme ; aucun test ne les ouvre toutes | Onglet Résultats : ouvrez Qu'est-ce que la Clarté ? |
| [RF66](requisitos.md#rf66) Gérer les comptes | L'administration exige un compte de superutilisateur, que les tests de bout en bout ne créent pas | Avec un compte d'administrateur, menu Administration › Comptes. |
| [RF68](requisitos.md#rf68) État de la protection des données et des traductions | Même raison que pour RF66 | Administration › Protection des données et Administration › Langues. |
| [RNF13](requisitos.md#rnf13) Collecte minimale | La collecte démographique désactivée est couverte par [CT-E71](casos-de-teste.md#ct-e71), mais le nettoyage des participations abandonnées nécessite d'attendre 2 jours | Créez une étude et vérifiez que les données démographiques sont désactivées au départ. |
| [RNF26](requisitos.md#rnf26) Vérifications avant l'intégration | Il s'agit d'une règle du processus d'intégration, et non d'un comportement de l'outil | Terminal : pnpm lint && pnpm typecheck && pnpm test. |

- **En attente :** aucune. La dernière, [RF62](requisitos.md#rf62) (UEQ-S), a été livrée le 18/11/2026.

## Cas d'utilisation

Les exigences que chaque cas d'utilisation met en œuvre. Les diagrammes et les spécifications se trouvent dans [cas d'utilisation](casos-de-uso.md).

| Cas d'utilisation | Acteur | Exigences |
|---|---|---|
| [UC01](casos-de-uso.md#uc01) Créer un compte | Visiteur | [RF01](requisitos.md#rf01), [RF08](requisitos.md#rf08) |
| [UC02](casos-de-uso.md#uc02) Se connecter et se déconnecter | Chercheur | [RF02](requisitos.md#rf02), [RF03](requisitos.md#rf03), [RF11](requisitos.md#rf11) |
| [UC03](casos-de-uso.md#uc03) Gérer le compte | Chercheur | [RF04](requisitos.md#rf04), [RF05](requisitos.md#rf05), [RF06](requisitos.md#rf06), [RF07](requisitos.md#rf07), [RF08](requisitos.md#rf08), [RF23](requisitos.md#rf23) |
| [UC04](casos-de-uso.md#uc04) Apprendre à utiliser l'outil | Chercheur | [RF09](requisitos.md#rf09), [RF10](requisitos.md#rf10) |
| [UC05](casos-de-uso.md#uc05) Lister les études | Chercheur | [RF12](requisitos.md#rf12) |
| [UC06](casos-de-uso.md#uc06) Créer une étude | Chercheur | [RF13](requisitos.md#rf13), [RF18](requisitos.md#rf18), [RF19](requisitos.md#rf19) |
| [UC07](casos-de-uso.md#uc07) Modifier une étude | Chercheur | [RF14](requisitos.md#rf14) |
| [UC08](casos-de-uso.md#uc08) Contrôler la collecte | Chercheur | [RF15](requisitos.md#rf15) |
| [UC09](casos-de-uso.md#uc09) Copier le lien | Chercheur | [RF16](requisitos.md#rf16) |
| [UC10](casos-de-uso.md#uc10) Supprimer une étude | Chercheur | [RF17](requisitos.md#rf17) |
| [UC11](casos-de-uso.md#uc11) Partager une étude | Chercheur | [RF20](requisitos.md#rf20) |
| [UC12](casos-de-uso.md#uc12) Répondre à une invitation | Chercheur | [RF21](requisitos.md#rf21) |
| [UC13](casos-de-uso.md#uc13) Suivre les notifications | Chercheur | [RF22](requisitos.md#rf22), [RF23](requisitos.md#rf23) |
| [UC14](casos-de-uso.md#uc14) Répondre au questionnaire | Participant | [RF24](requisitos.md#rf24), [RF25](requisitos.md#rf25), [RF26](requisitos.md#rf26), [RF27](requisitos.md#rf27), [RF28](requisitos.md#rf28), [RF29](requisitos.md#rf29), [RF30](requisitos.md#rf30), [RF33](requisitos.md#rf33) |
| [UC15](casos-de-uso.md#uc15) Choisir la langue | Participant | [RF34](requisitos.md#rf34), [RF35](requisitos.md#rf35) |
| [UC16](casos-de-uso.md#uc16) Fournir des données facultatives | Participant | [RF32](requisitos.md#rf32) |
| [UC17](casos-de-uso.md#uc17) Quitter sans envoyer | Participant | [RF31](requisitos.md#rf31) |
| [UC18](casos-de-uso.md#uc18) Voir les résultats | Chercheur | [RF43](requisitos.md#rf43), [RF44](requisitos.md#rf44), [RF45](requisitos.md#rf45), [RF46](requisitos.md#rf46), [RF48](requisitos.md#rf48), [RF49](requisitos.md#rf49) |
| [UC19](casos-de-uso.md#uc19) Calculer l'analyse UEQ | (inclus) | [RF36](requisitos.md#rf36), [RF37](requisitos.md#rf37), [RF38](requisitos.md#rf38), [RF39](requisitos.md#rf39), [RF40](requisitos.md#rf40), [RF41](requisitos.md#rf41), [RF42](requisitos.md#rf42) |
| [UC20](casos-de-uso.md#uc20) Comparer les versions | Chercheur | [RF47](requisitos.md#rf47) |
| [UC21](casos-de-uso.md#uc21) Voir les données démographiques | Chercheur | [RF50](requisitos.md#rf50) |
| [UC22](casos-de-uso.md#uc22) Exporter le tableau de bord en PDF | Chercheur | [RF60](requisitos.md#rf60) |
| [UC23](casos-de-uso.md#uc23) Examiner les réponses suspectes | Chercheur | [RF52](requisitos.md#rf52), [RF53](requisitos.md#rf53), [RF54](requisitos.md#rf54) |
| [UC24](casos-de-uso.md#uc24) Évaluer la suspicion de la participation | (inclus) | [RF51](requisitos.md#rf51) |
| [UC25](casos-de-uso.md#uc25) Exporter les données | Chercheur | [RF56](requisitos.md#rf56), [RF57](requisitos.md#rf57), [RF58](requisitos.md#rf58), [RF59](requisitos.md#rf59) |
| [UC26](casos-de-uso.md#uc26) Importer des réponses | Chercheur | [RF61](requisitos.md#rf61) |
| [UC27](casos-de-uso.md#uc27) Appliquer l'UEQ-S | Chercheur | [RF62](requisitos.md#rf62) |
| [UC28](casos-de-uso.md#uc28) Consulter la documentation | Visiteur, Chercheur | [RF63](requisitos.md#rf63), [RF64](requisitos.md#rf64), [RF65](requisitos.md#rf65) |
| [UC29](casos-de-uso.md#uc29) Gérer les comptes | Administrateur | [RF66](requisitos.md#rf66) |
| [UC30](casos-de-uso.md#uc30) Créer des scénarios de démonstration | Administrateur | [RF67](requisitos.md#rf67) |
| [UC31](casos-de-uso.md#uc31) Voir la protection des données et les traductions | Administrateur | [RF68](requisitos.md#rf68) |
| [UC32](casos-de-uso.md#uc32) Recalculer les suspicions | Mainteneur | [RF55](requisitos.md#rf55) |
| [UC33](casos-de-uso.md#uc33) Charger les items officiels | Mainteneur | [RNF10](requisitos.md#rnf10) |
