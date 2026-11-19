# Traduções da documentação

O original da documentação é o português, em `docs/`. Cada pasta daqui é a mesma árvore traduzida para um
idioma: `docs/documentacao/requisitos.md` vira `docs/traducoes/en/documentacao/requisitos.md`, e `docs/ihc.md`
vira `docs/traducoes/en/ihc.md`. A aba Documentação da ferramenta mostra a versão do idioma da interface.

| Pasta | Idioma |
|---|---|
| `en/` | Inglês, completo, com os arquivos para baixar (CSV e planilha) |
| `es/` | Espanhol |
| `fr/` | Francês |
| `de/` | Alemão |
| `it/` | Italiano |
| `zh/` | Chinês (simplificado) |
| `ja/` | Japonês |

As traduções além do inglês estão sendo feitas documento por documento; `pnpm docs:conferir` lista o que falta.
Enquanto um documento não tem tradução no idioma da interface, a ferramenta mostra a versão em inglês, com um
aviso no alto da página. Os outros 29 idiomas da interface leem sempre a versão em inglês. A lista fica em
`src/lib/documentacao/idiomas.ts` (`IDIOMAS_TRADUZIDOS`).

As traduções foram escritas pelo Claude a partir do original em português, sem API de tradução, a pedido do
Gabriel em 18/11/2026. Ainda precisam da revisão de um falante nativo.

## Regras

A ferramenta tira os endereços das páginas e as âncoras do original, pela posição de cada título. Por isso a
tradução tem o mesmo esqueleto do português, e `pnpm docs:conferir` confere isso (um teste também):

1. **Títulos:** os mesmos, na mesma ordem e com o mesmo nível de `#`. Nenhum título a mais, a menos ou juntado.
2. **Links:** o destino entre parênteses fica igual, inclusive a âncora (`requisitos.md#rf19`). Só o texto do link é traduzido.
3. **Âncoras HTML:** `<a id="…"></a>` fica igual.
4. **Tabelas:** o mesmo número de colunas e de linhas.
5. **Código:** blocos de código e trechos em `código` ficam iguais: nomes de arquivo, de função, de campo e de tabela.
6. **Diagramas:** os blocos `mermaid` são em inglês em todos os idiomas, inclusive no original em português. A
   tradução copia cada bloco do original sem mudar nada; só o texto e as explicações em volta são traduzidos. Os
   nomes que vêm do código (classes, campos, tabelas, valores como `RASCUNHO`) ficam como estão no código.
7. **Identificadores:** RF01, RNF11, US01, UC01, PE01, CT-E01, CT-U01, CT-M01, CN01 e afins ficam iguais, assim como
   nomes de pessoas, URLs, datas de commit e números.
8. **Rótulos da interface:** quando o texto cita um botão, uma aba ou uma mensagem da tela, usa o rótulo que a
   interface mostra naquele idioma.
9. **Nome da ferramenta:** o mesmo de `NOME_DA_FERRAMENTA` em `src/traducao/nucleo.ts` (UEQ Tool, Herramienta UEQ…).
10. **Texto que fica em português:** o que a ferramenta de fato mostra em português (os termos do questionário em
    português, uma mensagem citada do código) fica como está, com a tradução entre parênteses quando ajuda.
11. **Datas e números:** no formato do idioma. Separador decimal: ponto em inglês, chinês e japonês; vírgula em
    espanhol, francês, alemão e italiano. Os dígitos não mudam.
12. **Tratamento:** formal, como a interface (usted, vous, Sie, Lei, 您, です・ます).

Mudou um documento em português? Mude as sete traduções no mesmo commit e rode `pnpm docs:conferir`. Mudou um
diagrama? Escreva-o em inglês no original, copie o bloco para as sete traduções e rode `pnpm docs:diagramas`.

## Glossário

| Português | en | es | fr | de | it | zh | ja |
|---|---|---|---|---|---|---|---|
| Ferramenta UEQ | UEQ Tool | Herramienta UEQ | Outil UEQ | UEQ-Tool | Strumento UEQ | UEQ 工具 | UEQ ツール |
| estudo | study | estudio | étude | Studie | studio | 研究 | スタディ |
| pesquisador | researcher | investigador | chercheur | Forschende(r) | ricercatore | 研究人员 | 研究者 |
| mantenedor | maintainer | mantenedor | mainteneur | Maintainer | manutentore | 维护者 | メンテナー |
| participante | participant | participante | participant | Teilnehmende(r) | partecipante | 参与者 | 参加者 |
| link do participante | participant link | enlace del participante | lien du participant | Teilnahmelink | link per i partecipanti | 参与者链接 | 参加者用リンク |
| coleta | data collection | recogida | collecte | Erhebung | raccolta | 收集 | 収集 |
| resposta suspeita | suspicious response | respuesta sospechosa | réponse suspecte | verdächtige Antwort | risposta sospetta | 可疑回复 | 要確認の回答 |
| equipe | team | equipo | équipe | Team | team | 团队 | チーム |
| termo de consentimento | consent form | formulario de consentimiento | formulaire de consentement | Einwilligungserklärung | modulo di consenso | 知情同意书 | 同意書 |
| painel (de resultados) | dashboard | panel | tableau de bord | Dashboard | pannello | 面板 | ダッシュボード |
| versão (de um estudo) | version | versión | version | Version | versione | 版本 | バージョン |
| requisito funcional | functional requirement | requisito funcional | exigence fonctionnelle | funktionale Anforderung | requisito funzionale | 功能需求 | 機能要件 |
| requisito não funcional | non-functional requirement | requisito no funcional | exigence non fonctionnelle | nicht-funktionale Anforderung | requisito non funzionale | 非功能需求 | 非機能要件 |
| história de usuário | user story | historia de usuario | récit utilisateur | User Story | user story | 用户故事 | ユーザーストーリー |
| caso de uso | use case | caso de uso | cas d'utilisation | Anwendungsfall | caso d'uso | 用例 | ユースケース |
| ator | actor | actor | acteur | Akteur | attore | 参与者（角色） | アクター |
| fluxo principal / alternativo / de exceção | main / alternative / exception flow | flujo principal / alternativo / de excepción | flux principal / alternatif / d'exception | Hauptablauf / alternativer Ablauf / Ausnahmeablauf | flusso principale / alternativo / di eccezione | 主流程 / 备选流程 / 异常流程 | 基本フロー / 代替フロー / 例外フロー |
| pré-condição / pós-condição | precondition / postcondition | precondición / poscondición | précondition / postcondition | Vorbedingung / Nachbedingung | precondizione / postcondizione | 前置条件 / 后置条件 | 事前条件 / 事後条件 |
| critério de aceitação | acceptance criterion | criterio de aceptación | critère d'acceptation | Akzeptanzkriterium | criterio di accettazione | 验收标准 | 受け入れ基準 |
| caso de teste | test case | caso de prueba | cas de test | Testfall | caso di test | 测试用例 | テストケース |
| cenário | scenario | escenario | scénario | Szenario | scenario | 场景 | シナリオ |
| resultado esperado | expected result | resultado esperado | résultat attendu | erwartetes Ergebnis | risultato atteso | 预期结果 | 期待結果 |
| passou / falhou | passed / failed | aprobado / fallido | réussi / échoué | bestanden / fehlgeschlagen | superato / non superato | 通过 / 失败 | 合格 / 不合格 |
| matriz de rastreabilidade | traceability matrix | matriz de trazabilidad | matrice de traçabilité | Rückverfolgbarkeitsmatrix | matrice di tracciabilità | 可追溯性矩阵 | トレーサビリティマトリクス |
| prioridade alta / média / baixa | high / medium / low priority | prioridad alta / media / baja | priorité haute / moyenne / basse | hohe / mittlere / niedrige Priorität | priorità alta / media / bassa | 高 / 中 / 低优先级 | 優先度 高 / 中 / 低 |
| entregue | delivered | entregado | livré | geliefert | consegnato | 已交付 | 納品済み |
| diagrama de sequência | sequence diagram | diagrama de secuencia | diagramme de séquence | Sequenzdiagramm | diagramma di sequenza | 时序图 | シーケンス図 |
| diagrama de classes | class diagram | diagrama de clases | diagramme de classes | Klassendiagramm | diagramma delle classi | 类图 | クラス図 |
| modelo lógico | logical data model | modelo lógico | modèle logique | logisches Datenmodell | modello logico | 逻辑模型 | 論理モデル |
| item / escala | item / scale | ítem / escala | item / échelle | Item / Skala | item / scala | 项目 / 量表 | 項目 / 尺度 |
| média / desvio padrão | mean / standard deviation | media / desviación estándar | moyenne / écart type | Mittelwert / Standardabweichung | media / deviazione standard | 均值 / 标准差 | 平均 / 標準偏差 |
| intervalo de confiança | confidence interval | intervalo de confianza | intervalle de confiance | Konfidenzintervall | intervallo di confidenza | 置信区间 | 信頼区間 |
| alfa de Cronbach | Cronbach's alpha | alfa de Cronbach | alpha de Cronbach | Cronbachs Alpha | alfa di Cronbach | 克隆巴赫 α 系数 | クロンバックのα |
| planilha oficial | official spreadsheet | hoja oficial | tableur officiel | offizielle Tabelle | foglio ufficiale | 官方电子表格 | 公式スプレッドシート |
| Atratividade | Attractiveness | Atractivo | Attractivité | Attraktivität | Attrattiva | 吸引力 | 魅力性 |
| Perspicuidade | Perspicuity | Perspicuidad | Clarté | Durchschaubarkeit | Perspicuità | 清晰度 | 明瞭性 |
| Eficiência | Efficiency | Eficiencia | Efficacité | Effizienz | Efficienza | 效率 | 効率性 |
| Confiabilidade | Dependability | Confiabilidad | Fiabilité | Vertrauenswürdigkeit | Affidabilità | 可靠性 | 信頼性 |
| Estimulação | Stimulation | Estimulación | Stimulation | Stimulation | Stimolazione | 刺激性 | 刺激性 |
| Novidade | Novelty | Novedad | Nouveauté | Originalität | Originalità | 新颖性 | 新奇性 |
| Qualidade pragmática / hedônica | Pragmatic / Hedonic Quality | Calidad pragmática / hedónica | Qualité pragmatique / hédonique | Pragmatische / Hedonische Qualität | Qualità pragmatica / edonica | 实用质量 / 享乐质量 | プラグマティック品質 / ヘドニック品質 |
