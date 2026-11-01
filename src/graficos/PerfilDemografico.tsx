import type { BarraPerfil, PerguntaPerfil } from "@/lib/perfil-demografico";
import { plural } from "@/lib/texto";
import estilos from "./perfil.module.css";

const porcentagem = (parcela: number) => `${Math.round(parcela * 100)}%`;

// A escala das barras é a mesma em todos os cartões, até a maior parcela entre eles: 25% tem o mesmo
// comprimento em idade e em gênero, e dá para comparar de um gráfico para o outro
function Linha({ barra, escala, cinza = false }: { barra: BarraPerfil; escala: number; cinza?: boolean }) {
  const descricao = `${barra.rotulo}: ${plural(barra.quantidade, "pessoa", "pessoas")} (${porcentagem(barra.parcela)})`;
  return (
    <tr className={cinza ? estilos.linhaCinza : undefined} title={descricao}>
      <th scope="row" className={estilos.rotulo}>
        {barra.rotulo}
      </th>
      <td className={estilos.trilho} aria-hidden="true">
        {barra.quantidade > 0 && <span className={estilos.barra} style={{ width: `${(barra.parcela / escala) * 100}%` }} />}
      </td>
      <td className={estilos.valor}>
        <span className={estilos.numero}>{barra.quantidade}</span>
        <span className={estilos.parcela}>{porcentagem(barra.parcela)}</span>
      </td>
    </tr>
  );
}

// Uma tabela por pergunta, com a barra dentro da linha: o leitor de tela lê a tabela (rótulo, quantidade e
// porcentagem), e quem enxerga lê as barras. Opções em um tom só; "Prefiro não responder" e quem pulou a
// etapa em cinza, separados por uma linha, para não parecerem uma categoria a mais
function Pergunta({ pergunta, escala }: { pergunta: PerguntaPerfil; escala: number }) {
  const idTitulo = `perfil-${pergunta.campo}`;
  return (
    <section className={estilos.cartao} aria-labelledby={idTitulo}>
      <h3 id={idTitulo} className={estilos.titulo}>
        {pergunta.titulo}
      </h3>
      <p className={estilos.resumo}>
        {plural(pergunta.responderam, "pessoa escolheu uma opção", "pessoas escolheram uma opção")} de {pergunta.total}
      </p>
      <table className={estilos.tabela}>
        <caption className="visualmente-oculto">
          {pergunta.titulo}: quantas pessoas marcaram cada opção
          {pergunta.ordenada ? ", na ordem da escala" : ", da mais marcada para a menos marcada"}
        </caption>
        <thead className="visualmente-oculto">
          <tr>
            <th scope="col">Opção</th>
            <th scope="col">Barra</th>
            <th scope="col">Pessoas e porcentagem</th>
          </tr>
        </thead>
        <tbody>
          {pergunta.opcoes.map((opcao) => (
            <Linha key={opcao.rotulo} barra={opcao} escala={escala} />
          ))}
        </tbody>
        <tbody className={estilos.semOpcao}>
          <Linha barra={pergunta.prefiroNao} escala={escala} cinza />
          <Linha barra={pergunta.semResposta} escala={escala} cinza />
        </tbody>
      </table>
    </section>
  );
}

export function PerfilDemografico({ perguntas }: { perguntas: PerguntaPerfil[] }) {
  const escala = Math.max(
    0.01,
    ...perguntas.flatMap((pergunta) => [...pergunta.opcoes, pergunta.prefiroNao, pergunta.semResposta].map((b) => b.parcela)),
  );
  return (
    <div className={estilos.grade}>
      {perguntas.map((pergunta) => (
        <Pergunta key={pergunta.campo} pergunta={pergunta} escala={escala} />
      ))}
    </div>
  );
}
