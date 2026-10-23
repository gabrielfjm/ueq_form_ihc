# 06 · Painel de resultados e gráficos

> Rodar em plan mode. Antes: módulo src/ueq/ com testes passando.

```
Leia docs/design.md, seção "Painel do estudo", e docs/ueq-protocolo.md seções 4 a 8.

Implemente /estudos/[id]/resultados.

Dados: um Server Component busca as participações incluídas e as respostas, monta a entrada e chama analisarEstudo de src/ueq. Nenhum cálculo estatístico fora de src/ueq.

Estrutura da página, nesta ordem:
1. Linha de resumo em texto (respostas, suspeitas, na análise, status e período da coleta)
2. Seletor de versão (se houver mais de uma) e alternância "Uma versão / Comparar versões". Estado na URL (searchParams), não em useState
3. Gráfico principal src/graficos/EscalasComBenchmark.tsx, SVG feito à mão, conforme a descrição no design.md: uma linha por escala, eixo -3 a +3, faixas do benchmark atrás, faixa neutra tracejada, ponto da média, traço do IC95, valor e faixa à direita, agrupamento em Atratividade / Qualidade pragmática / Qualidade hedônica
4. Tabela de escalas: n, média, dp, IC95 (inferior; superior), alfa, interpretação, benchmark. Números em Source Sans 3 (var(--fonte-numero)) com tabular-nums, alinhados à direita, vírgula decimal. Alfa < 0,7 em --alerta com nota de rodapé
5. Linha com as médias de Qualidade pragmática e Qualidade hedônica
6. Gráfico por item src/graficos/MediasPorItem.tsx: cada item com termo esquerdo, ponto da média no eixo -3 a +3, termo direito. Alternar ordem oficial / agrupado por escala
7. Em modo comparação: mesmo gráfico de escalas com um marcador por versão, legenda em texto. Sem teste estatístico (fora do escopo)

Requisitos do SVG (docs/ihc.md seção 4.3):
- viewBox e responsivo pela largura, sem biblioteca. Em telas estreitas o gráfico reorganiza (rótulos acima das linhas), sem rolagem horizontal
- role="img", <title> e <desc> gerados dos dados ("Atratividade: média 1,42, IC de 1,10 a 1,74, positiva, Bom no benchmark") e a tabela equivalente visível logo abaixo
- Nada só por cor: versões diferenciadas também por forma do marcador (círculo cheio, vazado, quadrado), faixas do benchmark com rótulo em texto
- Marcadores e traços com contraste ≥ 3:1 contra o fundo e contra a faixa mais escura do benchmark
- Testar com emulação de protanopia, deuteranopia e acromatopsia no Playwright (page.emulateVisionDeficiency via CDP) e com forced-colors
- Cada termo técnico (Perspicuidade, IC95, alfa de Cronbach, benchmark) tem explicação curta em <details> perto de onde aparece
- Avisos (alfa < 0,7, n pequeno) dizem o que significa e o que o pesquisador pode fazer
- Texto em Atkinson, números em Source Sans 3 (var(--fonte-numero)), cores só de tokens.css
- Sem tooltip animado. Se precisar de detalhe, o valor já está escrito ao lado
- Componentes recebem dados prontos por props e não sabem nada de Prisma

Amostra com n < 2 mostra o gráfico sem IC e a frase "Amostra insuficiente para intervalo de confiança".

Ao final, rode o seed de desenvolvimento com a fixture basico importada em um estudo de exemplo, rode /revisar-ihc na página e me mande print da página em 1280 px e 390 px.
```
