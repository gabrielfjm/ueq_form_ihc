import estilos from "./resultados.module.css";
import { m } from "@/traducao/nucleo";
import { tradutor } from "@/traducao/servidor";

// docs/ihc.md §4.2 e §4.3 (Nielsen 10, revelação progressiva): cada termo técnico explicado perto
// de onde aparece. Textos a partir do Handbook UEQ versão 11 e da planilha V15
const EXPLICACOES = [
  {
    pergunta: m("O que é o benchmark?"),
    resposta:
      m("Uma comparação com a base oficial do UEQ, com 21.175 pessoas de 468 estudos de produtos variados. A faixa diz em que parte dessa base a média caiu: Excelente fica entre os 10% melhores; Bom tem 10% de resultados melhores e 75% piores; Acima da média, 25% melhores e 50% piores; Abaixo da média, 50% melhores e 25% piores; Ruim fica entre os 25% piores."),
  },
  {
    pergunta: m("O que é o IC95?"),
    resposta:
      m("O intervalo de confiança de 95% é a faixa em que a média provavelmente ficaria se o estudo fosse repetido com outras pessoas do mesmo público. Quanto menos respostas, mais largo o traço. Se os traços de duas versões não se sobrepõem, a diferença tende a ser real; se se sobrepõem, não dá para concluir sem um teste estatístico."),
  },
  {
    pergunta: m("O que é Perspicuidade?"),
    resposta:
      m("É o nome oficial da escala que mede se o produto é fácil de entender e de aprender a usar. As outras: Atratividade é a impressão geral; Eficiência, se dá para fazer as tarefas sem esforço desnecessário; Confiabilidade, se a pessoa se sente no controle; Estimulação, se é interessante e motivador usar; Novidade, se o produto é criativo e inovador."),
  },
  {
    pergunta: m("Por que a faixa neutra vai de -0,8 a +0,8?"),
    resposta:
      m("É a leitura padrão do handbook do UEQ: médias entre -0,8 e +0,8 indicam avaliação neutra, acima de +0,8 positiva e abaixo de -0,8 negativa. Médias acima de +2 ou abaixo de -2 são raras, porque as pessoas tendem a evitar os extremos da escala."),
  },
  {
    pergunta: m("O que é o alfa de Cronbach?"),
    resposta:
      m("Mede se os itens de uma escala andaram juntos neste grupo de participantes. Abaixo de 0,7 é sinal de que a escala pode ter sido entendida de jeitos diferentes. Com menos de 50 respostas o alfa oscila bastante, então trate um valor baixo como indício, não como conclusão."),
  },
] as const;

// UEQ-S: o mesmo, com o que muda na versão curta (Handbook UEQ, p. 12-13, e a aba Benchmark da planilha dela)
const EXPLICACOES_UEQ_S = [
  {
    pergunta: m("O que é o benchmark do UEQ-S?"),
    resposta:
      m("A mesma comparação com a base oficial, em cinco faixas, de Excelente (entre os 10% melhores) a Ruim (entre os 25% piores). A planilha oficial do UEQ-S avisa que ainda não há dados suficientes da versão curta: os limites vêm dos mesmos 8 itens dentro do UEQ completo e são uma aproximação, para ler com cuidado."),
  },
  EXPLICACOES[1],
  {
    pergunta: m("O que são qualidade pragmática e hedônica?"),
    resposta:
      m("Pragmática é se o produto ajuda a fazer o que a pessoa precisa: os itens 1 a 4 (apoio, facilidade, eficiência e clareza). Hedônica é se usar é agradável e interessante: os itens 5 a 8 (empolgante, interessante, original e inovador). O UEQ-S não separa as 6 escalas do UEQ completo."),
  },
  {
    pergunta: m("Como ler a escala geral?"),
    resposta:
      m("É a média dos 8 itens. O handbook pede cuidado: ela não é um indicador único de experiência, porque o peso da qualidade pragmática e da hedônica muda de um produto para outro. Leia sempre junto com as duas."),
  },
  EXPLICACOES[3],
  EXPLICACOES[4],
] as const;

export async function Explicacoes({ instrumento = "UEQ" }: { instrumento?: "UEQ" | "UEQ_S" }) {
  const t = await tradutor();
  return (
    <div className={estilos.explicacoes}>
      {(instrumento === "UEQ_S" ? EXPLICACOES_UEQ_S : EXPLICACOES).map(({ pergunta, resposta }) => (
        <details key={pergunta}>
          <summary>{t(pergunta)}</summary>
          <p>{t(resposta)}</p>
        </details>
      ))}
    </div>
  );
}
