# 07 · Respostas suspeitas e controle da análise

```
Leia docs/ueq-protocolo.md seção 7.

1. Quando uma participação é concluída, calcule com marcarSuspeitos (src/ueq) se ela é suspeita e grave em Participacao.suspeita. Inclua também um script/ação "Recalcular suspeitas" para quando a equipe ajustar data/protocolo.json
2. Página /estudos/[id]/respostas: tabela de todas as participações com data, versão, número de escalas inconsistentes, marca de suspeita, e a caixa "Na análise". Filtro "só suspeitas". Ao abrir uma linha, mostra as 6 escalas daquele participante com a amplitude de cada uma, destacando as que passaram do limiar
3. Ação em lote "Tirar suspeitas da análise" e ação individual de incluir/excluir. Excluir da análise nunca apaga dados
4. O painel de resultados mostra no resumo quantas foram excluídas e tem link para essa página
5. Toda mudança de inclusão reflete no painel e nas exportações de resultado

Teste com a fixture inconsistente: as 4 linhas marcadas pela equipe devem sair como suspeitas.
```
