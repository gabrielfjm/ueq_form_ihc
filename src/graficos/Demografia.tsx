import type { BarraPerfil, PerguntaPerfil } from "@/lib/perfil-demografico";
import { plural } from "@/lib/texto";
import estilos from "./demografia.module.css";
import type { Traduzir } from "@/traducao/nucleo";
import { tradutor } from "@/traducao/servidor";


const porcentagem = (parcela: number) => `${Math.round(parcela * 100)}%`;

// Tons de um só azul-petróleo, do mais claro ao mais escuro: a familiaridade é uma escala ordenada
const TONS_ORDENADOS = ["#9CC9D0", "#4F98A3", "#0B6A78"] as const;

// A mesma informação em tabela, para leitor de tela e para quem prefere ler os números (sempre no DOM;
// visível ao abrir "Ver os números")
async function Tabela({ pergunta }: { pergunta: PerguntaPerfil }) {
  const t = await tradutor();
  const linhas = [...pergunta.opcoes, pergunta.prefiroNao, pergunta.semResposta];
  return (
    <details className={estilos.numeros}>
      <summary>{t("Ver os números")}</summary>
      <table className={estilos.tabela}>
        <caption className="visualmente-oculto">{t("{titulo}: pessoas por opção", { titulo: t(pergunta.titulo) })}</caption>
        <thead>
          <tr>
            <th scope="col">{t("Opção")}</th>
            <th scope="col" className={estilos.direita}>
              {t("Pessoas")}
            </th>
            <th scope="col" className={estilos.direita}>
              %
            </th>
          </tr>
        </thead>
        <tbody>
          {linhas.map((linha) => (
            <tr key={linha.rotulo}>
              <th scope="row">{t(linha.rotulo)}</th>
              <td className={estilos.direita}>{linha.quantidade}</td>
              <td className={estilos.direita}>{t(porcentagem(linha.parcela))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  );
}

async function Rodape({ pergunta }: { pergunta: PerguntaPerfil }) {
  const t = await tradutor();
  return (
    <p className={estilos.rodape}>
      {t("{quantidade} não responder · {quantidade2}", { quantidade: plural(pergunta.prefiroNao.quantidade, t("pessoa preferiu"), t("pessoas preferiram")), quantidade2: plural(pergunta.semResposta.quantidade, t("não respondeu"), t("não responderam")) })}
    </p>
  );
}

function descricao(t: Traduzir, pergunta: PerguntaPerfil, opcoes: BarraPerfil[]) {
  return `${t(pergunta.titulo)}: ${opcoes.map((o) => `${t(o.rotulo)}, ${o.quantidade} (${porcentagem(o.parcela)})`).join("; ")}.`;
}

// Faixa etária: escala ordenada de 5 faixas, em colunas como um histograma
export async function Colunas({ pergunta }: { pergunta: PerguntaPerfil }) {
  const t = await tradutor();
  const maior = Math.max(0.01, ...pergunta.opcoes.map((o) => o.parcela));
  return (
    <>
      <div className={estilos.colunas} role="img" aria-label={descricao(t, pergunta, pergunta.opcoes)}>
        {pergunta.opcoes.map((opcao) => (
          <div key={opcao.rotulo} className={estilos.coluna} title={`${t(opcao.rotulo)}: ${opcao.quantidade}`}>
            <span className={estilos.valorColuna}>
              {opcao.quantidade}
              <span className={estilos.parcela}>{t(porcentagem(opcao.parcela))}</span>
            </span>
            <span className={estilos.trilhoColuna}>
              <span className={estilos.barraColuna} style={{ height: `${(opcao.parcela / maior) * 100}%` }} />
            </span>
            <span className={estilos.rotuloColuna}>{t(opcao.rotulo)}</span>
          </div>
        ))}
      </div>
      <Rodape pergunta={pergunta} />
      <Tabela pergunta={pergunta} />
    </>
  );
}

// Gênero (sem ordem) e escolaridade (com ordem): barras horizontais. A ordem vem de perfilDemografico
export async function Barras({ pergunta }: { pergunta: PerguntaPerfil }) {
  const t = await tradutor();
  const maior = Math.max(0.01, ...pergunta.opcoes.map((o) => o.parcela));
  return (
    <>
      <div className={estilos.barras} role="img" aria-label={descricao(t, pergunta, pergunta.opcoes)}>
        {pergunta.opcoes.map((opcao) => (
          <div key={opcao.rotulo} className={estilos.linhaBarra} title={`${t(opcao.rotulo)}: ${opcao.quantidade}`}>
            <span className={estilos.rotuloBarra}>{t(opcao.rotulo)}</span>
            <span className={estilos.trilhoBarra}>
              {opcao.quantidade > 0 && <span className={estilos.barra} style={{ width: `${(opcao.parcela / maior) * 100}%` }} />}
            </span>
            <span className={estilos.valorBarra}>
              {opcao.quantidade}
              <span className={estilos.parcela}>{t(porcentagem(opcao.parcela))}</span>
            </span>
          </div>
        ))}
      </div>
      <Rodape pergunta={pergunta} />
      <Tabela pergunta={pergunta} />
    </>
  );
}

// Familiaridade: 3 partes de um todo, numa barra só, em tons crescentes do mesmo azul. A legenda dá nome
// e número de cada parte, então a cor nunca é a única pista
export async function Segmentada({ pergunta }: { pergunta: PerguntaPerfil }) {
  const t = await tradutor();
  const responderam = Math.max(1, pergunta.responderam);
  return (
    <>
      <div className={estilos.segmentada} role="img" aria-label={descricao(t, pergunta, pergunta.opcoes)}>
        {pergunta.opcoes.map((opcao, posicao) =>
          opcao.quantidade > 0 ? (
            <span
              key={opcao.rotulo}
              className={estilos.segmento}
              style={{ flexGrow: opcao.quantidade, background: TONS_ORDENADOS[posicao] ?? TONS_ORDENADOS[2] }}
              title={`${t(opcao.rotulo)}: ${opcao.quantidade}`}
            >
              {opcao.quantidade / responderam >= 0.12 && (
                <span className={posicao === 0 ? estilos.textoSegmentoEscuro : estilos.textoSegmento}>
                  {Math.round((opcao.quantidade / responderam) * 100)}%
                </span>
              )}
            </span>
          ) : null,
        )}
      </div>
      <ul className={estilos.legenda} aria-hidden="true">
        {pergunta.opcoes.map((opcao, posicao) => (
          <li key={opcao.rotulo}>
            <span className={estilos.amostra} style={{ background: TONS_ORDENADOS[posicao] ?? TONS_ORDENADOS[2] }} />
            {t(opcao.rotulo)} <strong>{opcao.quantidade}</strong>
          </li>
        ))}
      </ul>
      <p className={estilos.notaSegmentada}>{t("Proporção entre as {responderam} pessoas que escolheram uma opção.", { responderam: responderam })}</p>
      <Rodape pergunta={pergunta} />
      <Tabela pergunta={pergunta} />
    </>
  );
}

const GRAFICO: Record<PerguntaPerfil["campo"], (props: { pergunta: PerguntaPerfil }) => React.ReactNode> = {
  faixaEtaria: Colunas,
  genero: Barras,
  escolaridade: Barras,
  familiaridadeComProduto: Segmentada,
};

export async function Demografia({ perguntas }: { perguntas: PerguntaPerfil[] }) {
  const t = await tradutor();
  return (
    <div className={estilos.grade}>
      {perguntas.map((pergunta) => {
        const Grafico = GRAFICO[pergunta.campo];
        return (
          <section key={pergunta.campo} className={estilos.cartao} aria-labelledby={`demografia-${pergunta.campo}`}>
            <h3 id={`demografia-${pergunta.campo}`} className={estilos.titulo}>
              {t(pergunta.titulo)}
            </h3>
            <p className={estilos.resumo}>
              {t("{quantidade} de {total}", { quantidade: plural(pergunta.responderam, t("pessoa escolheu uma opção"), t("pessoas escolheram uma opção")), total: pergunta.total })}
            </p>
            <Grafico pergunta={pergunta} />
          </section>
        );
      })}
    </div>
  );
}
