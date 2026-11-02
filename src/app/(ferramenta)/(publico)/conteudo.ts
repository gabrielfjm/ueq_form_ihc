// Textos da apresentação da ferramenta, usados na página inicial e nos painéis de Entrar e Criar conta

// docs/ueq-protocolo.md, seção 1: 6 itens em Atratividade, 4 nas outras escalas. As explicações são as
// mesmas do "O que é Perspicuidade?" dos resultados (Handbook UEQ, versão 11)
export const ESCALAS_DO_UEQ = [
  { nome: "Atratividade", grupo: "Atratividade", itens: 6, mede: "A impressão geral sobre o produto." },
  { nome: "Perspicuidade", grupo: "Qualidade pragmática", itens: 4, mede: "Se é fácil de entender e de aprender a usar." },
  { nome: "Eficiência", grupo: "Qualidade pragmática", itens: 4, mede: "Se dá para fazer as tarefas sem esforço desnecessário." },
  { nome: "Confiabilidade", grupo: "Qualidade pragmática", itens: 4, mede: "Se a pessoa se sente no controle." },
  { nome: "Estimulação", grupo: "Qualidade hedônica", itens: 4, mede: "Se é interessante e motivador usar." },
  { nome: "Novidade", grupo: "Qualidade hedônica", itens: 4, mede: "Se o produto é criativo e inovador." },
] as const;

export const PASSOS = [
  ["Crie o estudo", "Título, objetivo, período e as versões do produto que serão comparadas."],
  ["Envie o link", "Os participantes respondem sem conta, pelo celular ou computador."],
  ["Acompanhe a coleta", "Médias, intervalos de confiança, alfa e benchmark por escala, e as respostas suspeitas."],
  ["Exporte os dados", "CSV no formato da UEQ Data Analysis Tool, para conferir os cálculos."],
] as const;

// Créditos do método: quem criou o UEQ e quem construiu as peças que a ferramenta usa (benchmark, versão
// curta, tradução para o português). Fontes: os próprios artigos, listados em ESTUDOS_DO_UEQ
export const AUTORES_DO_UEQ = [
  ["Bettina Laugwitz, Theo Held e Martin Schrepp", "Criaram o UEQ em 2005 e publicaram a construção e a validação do questionário em 2008."],
  ["Martin Schrepp, Andreas Hinderks e Jörg Thomaschewski", "Construíram o benchmark, a versão curta (UEQ-S) e o guia de uso em diferentes cenários de avaliação."],
  ["Manuel Pérez Cota e Ramiro Gonçalves", "Traduziram o UEQ para o português, com Thomaschewski e Schrepp. É a versão que o participante vê aqui."],
] as const;

// Referências na forma da ABNT. Só artigos e documentos que a equipe consultou (docs/ueq-protocolo.md)
export const ESTUDOS_DO_UEQ = [
  {
    referencia:
      "LAUGWITZ, B.; HELD, T.; SCHREPP, M. Construction and evaluation of a user experience questionnaire. In: HOLZINGER, A. (ed.). HCI and Usability for Education and Work: USAB 2008. Berlin: Springer, 2008. (Lecture Notes in Computer Science, v. 5298). p. 63-76.",
    sobre: "O artigo que apresenta o UEQ: como os 26 itens e as 6 escalas foram escolhidos e validados.",
  },
  {
    referencia:
      "SCHREPP, M.; HINDERKS, A.; THOMASCHEWSKI, J. Applying the User Experience Questionnaire (UEQ) in different evaluation scenarios. In: MARCUS, A. (ed.). Design, User Experience, and Usability: DUXU 2014. Cham: Springer, 2014. (Lecture Notes in Computer Science, v. 8517). p. 383-392.",
    sobre: "Como usar o UEQ para comparar versões, acompanhar um produto ao longo do tempo e decidir onde melhorar.",
  },
  {
    referencia:
      "SCHREPP, M.; HINDERKS, A.; THOMASCHEWSKI, J. Construction of a benchmark for the User Experience Questionnaire (UEQ). International Journal of Interactive Multimedia and Artificial Intelligence, v. 4, n. 4, p. 40-44, 2017.",
    sobre: "A base de comparação que diz se um resultado é excelente, bom, acima ou abaixo da média, ou ruim.",
  },
  {
    referencia:
      "SCHREPP, M.; HINDERKS, A.; THOMASCHEWSKI, J. Design and evaluation of a short version of the User Experience Questionnaire (UEQ-S). International Journal of Interactive Multimedia and Artificial Intelligence, v. 4, n. 6, p. 103-108, 2017.",
    sobre: "A versão curta, com 8 itens, para quando o tempo do participante é pouco.",
  },
  {
    referencia:
      "COTA, M. P.; THOMASCHEWSKI, J.; SCHREPP, M.; GONÇALVES, R. Efficient measurement of the user experience: a Portuguese version. Procedia Computer Science, v. 27, p. 491-498, 2014.",
    sobre: "A tradução e a validação do UEQ em português, usada no link do participante.",
  },
  {
    referencia: "SCHREPP, M. User Experience Questionnaire Handbook. Versão 11. 2023. Disponível em: https://www.ueq-online.org.",
    sobre: "O manual oficial: aplicação, cálculo das escalas, interpretação e respostas suspeitas. A ferramenta segue este manual.",
  },
] as const;

// Handbook UEQ (versão 11), "Benchmark", e planilha oficial V15, aba Benchmark (data/benchmark.json)
export const FAIXAS_DO_BENCHMARK = [
  ["Excelente", "Entre os 10% melhores resultados da base."],
  ["Bom", "10% dos resultados da base são melhores e 75% são piores."],
  ["Acima da média", "25% dos resultados da base são melhores e 50% são piores."],
  ["Abaixo da média", "50% dos resultados da base são melhores e 25% são piores."],
  ["Ruim", "Entre os 25% piores resultados da base."],
] as const;
