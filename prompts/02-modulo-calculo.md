# 02 · Módulo de cálculo UEQ

> O coração do projeto. Rodar em plan mode (Shift+Tab duas vezes) e aprovar o plano antes.
> Antes: data/protocolo.json e data/benchmark.json conferidos.

## Parte A · gerar as fixtures

```
Crie data/fixtures/basico/respostas.csv, data/fixtures/inconsistente/respostas.csv e data/fixtures/extremos/ conforme docs/ueq-protocolo.md seção 10.

Formato: 26 valores de 1 a 7 por linha, na ordem oficial, separados por ponto e vírgula, sem cabeçalho (o formato de colar na planilha oficial).
- basico: 20 participantes com respostas plausíveis, leve tendência positiva, variação real entre pessoas
- inconsistente: 15 participantes, dos quais exatamente 4 respondem de forma contraditória em 3 ou mais escalas (marque quais linhas são em um comentário no LEIA-ME da pasta, não no CSV)
- extremos: um arquivo com todos 1, um com todos 7, um com 1 participante, um com 2

Não crie esperado.json. Esse arquivo a equipe vai preencher copiando da planilha oficial.
```

## Parte B · o módulo

```
Leia docs/ueq-protocolo.md inteiro e data/protocolo.json.

Implemente src/ueq/ como funções puras em TypeScript, sem nenhum import de Prisma, React ou Next. Entrada é sempre número e arrays, saída é objeto tipado.

Arquivos e responsabilidades:
- itens.ts: tipo ItemUEQ, tipo Escala, mapa escala → números dos itens, agrupamento pragmática/hedônica
- recodificar.ts: recodificar(valor, polaridade) e recodificarParticipante(26 valores) → 26 valores recodificados
- estatistica.ts: media, desvioPadraoAmostral, intervaloConfianca95, alfaCronbach. Retornam null quando n não permite o cálculo
- escalas.ts: escoresPorParticipante (participante × escala) e resultadoPorEscala (n, media, dp, ic, alfa, faixaInterpretacao) e resultadoPorItem
- inconsistencia.ts: amplitudePorEscala e marcarSuspeitos, lendo limiares de um objeto de configuração passado como parâmetro
- benchmark.ts: classificarBenchmark(escala, media, tabela)
- index.ts: analisarEstudo(respostas, itens, config) que junta tudo e devolve o objeto que o painel e a exportação vão consumir

Cada regra do protocolo ganha um comentário curto citando a seção do handbook (deixe a referência genérica "Handbook UEQ" + nome da seção, a equipe completa a página).

Testes em src/ueq/__tests__/:
- unidade para cada função, incluindo bordas (n=0, n=1, todos iguais, variância zero no alfa)
- um teste parametrizado que, para cada pasta em data/fixtures que tiver esperado.json, roda analisarEstudo e compara cada número com tolerância 1e-6. Se esperado.json não existir, o teste é marcado como skip com mensagem "preencha esperado.json a partir da planilha oficial"

Ao final, rode os testes e me mostre a saída de analisarEstudo para a fixture basico (médias e IC por escala), para eu colar a mesma fixture na planilha e comparar.
```
