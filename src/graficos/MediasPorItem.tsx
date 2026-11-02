import { formatarDecimal } from "@/lib/texto";
import { posicao } from "./EscalasComBenchmark";
import estilos from "./itens.module.css";
import { tradutor } from "@/traducao/servidor";

export type ItemComMedia = {
  numero: number;
  termoEsquerdo: string;
  termoDireito: string;
  media: number | null;
};

type Propriedades = {
  // um grupo só na ordem oficial; um por escala quando agrupado
  grupos: { titulo?: string; itens: ItemComMedia[] }[];
};

async function Linha({ item }: { item: ItemComMedia }) {
  const t = await tradutor();
  return (
    <li className={estilos.linha}>
      <span className={estilos.numero} aria-hidden="true">
        {item.numero}
      </span>
      {/* A frase lida pelo leitor de tela; o trilho com o ponto é só a mesma informação desenhada */}
      <span className="visualmente-oculto">
        {t("Item {numero}, de {termoEsquerdo} a {termoDireito}: média {decimal}", { numero: item.numero, termoEsquerdo: item.termoEsquerdo, termoDireito: item.termoDireito, decimal: formatarDecimal(item.media) })}
      </span>
      <span className={estilos.esquerdo} aria-hidden="true">
        {t(item.termoEsquerdo)}
      </span>
      <svg className={estilos.trilho} height="20" width="100%" aria-hidden="true">
        <line x1="0" x2="100%" y1="10" y2="10" className={estilos.eixo} />
        <line x1="50%" x2="50%" y1="3" y2="17" className={estilos.centro} />
        {item.media !== null && <circle cx={`${posicao(item.media)}%`} cy="10" r="5" className={estilos.ponto} />}
      </svg>
      <span className={estilos.direito} aria-hidden="true">
        {t(item.termoDireito)}
      </span>
      <span className={estilos.media} aria-hidden="true">
        {t(formatarDecimal(item.media))}
      </span>
    </li>
  );
}

// docs/design.md, Painel do estudo: os 26 itens com os dois termos e um ponto na posição da média,
// nos lados em que apareceram no questionário (a polaridade não é "arrumada")
export async function MediasPorItem({ grupos }: Propriedades) {
  const t = await tradutor();
  return (
    <div className={estilos.lista}>
      {grupos.map((grupo, indice) => (
        <section key={grupo.titulo ?? indice} aria-label={grupo.titulo && t(grupo.titulo)}>
          {grupo.titulo && <h3 className={estilos.grupo}>{t(grupo.titulo)}</h3>}
          <ol className={estilos.itens}>
            {grupo.itens.map((item) => (
              <Linha key={item.numero} item={item} />
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
