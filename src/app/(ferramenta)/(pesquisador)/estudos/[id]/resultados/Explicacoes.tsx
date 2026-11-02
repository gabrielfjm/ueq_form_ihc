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

export async function Explicacoes() {
  const t = await tradutor();
  return (
    <div className={estilos.explicacoes}>
      {EXPLICACOES.map(({ pergunta, resposta }) => (
        <details key={pergunta}>
          <summary>{t(pergunta)}</summary>
          <p>{t(resposta)}</p>
        </details>
      ))}
    </div>
  );
}
