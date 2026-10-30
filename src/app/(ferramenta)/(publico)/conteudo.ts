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
