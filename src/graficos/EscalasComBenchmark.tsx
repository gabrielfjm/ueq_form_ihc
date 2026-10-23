import { Fragment, type ReactNode } from "react";
import type { Construto } from "@/lib/nomes-ueq";
import type { Intervalo, LimitesBenchmark } from "@/ueq";
import estilos from "./graficos.module.css";

// docs/ihc.md §4.3: na comparação cada versão tem uma forma, não só uma cor (WCAG 1.4.1).
// Até 6 versões por estudo: círculo, quadrado e losango, cheios e vazados
export type FormaMarcador = { figura: "circulo" | "quadrado" | "losango"; vazado: boolean };

export const FORMAS: readonly (FormaMarcador & { nome: string })[] = [
  { figura: "circulo", vazado: false, nome: "círculo cheio" },
  { figura: "circulo", vazado: true, nome: "círculo vazado" },
  { figura: "quadrado", vazado: false, nome: "quadrado cheio" },
  { figura: "quadrado", vazado: true, nome: "quadrado vazado" },
  { figura: "losango", vazado: false, nome: "losango cheio" },
  { figura: "losango", vazado: true, nome: "losango vazado" },
];

export const FORMA_UNICA: FormaMarcador = { figura: "circulo", vazado: false };

export type MarcadorEscala = {
  media: number | null;
  ic: Intervalo | null;
  forma: FormaMarcador;
};

export type LinhaEscala = {
  chave: string;
  nome: string;
  construto: Construto;
  limites: LimitesBenchmark;
  faixaNeutra: { inferior: number; superior: number };
  marcadores: MarcadorEscala[];
  // média e leitura já escritas, à direita do trilho (docs/ihc.md §4.3: o valor está ao lado, sem tooltip)
  valor: ReactNode;
};

type Propriedades = {
  linhas: LinhaEscala[];
  // leitura completa em texto, para quem não vê o gráfico (WCAG 1.1.1)
  descricao: string;
  nomesGrupos: Record<Construto, string>;
  legenda: ReactNode;
};

// Eixo do UEQ: de -3 a +3 (docs/ueq-protocolo.md, seção 2)
export function posicao(valor: number): number {
  return ((Math.min(3, Math.max(-3, valor)) + 3) / 6) * 100;
}

const MARCAS = [-3, -2, -1, 0, 1, 2, 3];

function Faixa({ de, ate, classe, rotulo }: { de: number; ate: number; classe: string | undefined; rotulo: string }) {
  const x = posicao(de);
  const largura = posicao(ate) - x;
  if (largura <= 0) return null;
  // svg aninhado corta o rótulo na largura da faixa, como no protótipo
  return (
    <svg x={`${x}%`} y="0" width={`${largura}%`} height="48">
      <rect width="100%" height="100%" className={classe} />
      <text x="5" y="15" className={estilos.rotuloFaixa}>
        {rotulo}
      </text>
    </svg>
  );
}

function Marcador({ marcador }: { marcador: MarcadorEscala }) {
  if (marcador.media === null) return null;
  const x = `${posicao(marcador.media)}%`;
  return (
    <>
      {marcador.ic && (
        <g className={estilos.intervalo}>
          <line x1={`${posicao(marcador.ic.inferior)}%`} x2={`${posicao(marcador.ic.superior)}%`} y1="31" y2="31" />
          <line x1={`${posicao(marcador.ic.inferior)}%`} x2={`${posicao(marcador.ic.inferior)}%`} y1="25" y2="37" />
          <line x1={`${posicao(marcador.ic.superior)}%`} x2={`${posicao(marcador.ic.superior)}%`} y1="25" y2="37" />
        </g>
      )}
      <FiguraMarcador x={x} y={31} forma={marcador.forma} />
    </>
  );
}

// Também usada na legenda, para a forma desenhada ser a mesma do gráfico
// O svg aninhado põe a origem no ponto da média, então a forma é desenhada centrada em (0, 0)
// e o losango gira em torno do próprio centro mesmo com x em porcentagem
export function FiguraMarcador({ x, y, forma }: { x: string | number; y: number; forma: FormaMarcador }) {
  const classe = forma.vazado ? estilos.vazado : estilos.ponto;
  return (
    <svg x={x} y={y} overflow="visible">
      {forma.figura === "circulo" && <circle r="7" className={classe} />}
      {forma.figura === "quadrado" && <rect x="-6" y="-6" width="12" height="12" className={classe} />}
      {/* 10 de lado girado 45° dá uns 14 de ponta a ponta, o mesmo tamanho do círculo */}
      {forma.figura === "losango" && <rect x="-5" y="-5" width="10" height="10" transform="rotate(45)" className={classe} />}
    </svg>
  );
}

// docs/design.md, Painel do estudo: uma linha por escala com as 5 faixas do benchmark atrás,
// a faixa neutra tracejada, o ponto da média e o traço do IC95. SVG feito à mão, sem biblioteca
export function EscalasComBenchmark({ linhas, descricao, nomesGrupos, legenda }: Propriedades) {
  return (
    <figure role="img" aria-label={descricao} className={estilos.figura}>
      <div aria-hidden="true" className={estilos.grade}>
        <div className={estilos.eixo}>
          <span className={estilos.neutro} style={{ left: "50%" }}>
            neutro
          </span>
          {MARCAS.map((marca, indice) => (
            <span
              key={marca}
              style={
                indice === 0
                  ? { left: 0, transform: "none" }
                  : indice === MARCAS.length - 1
                    ? { right: 0, transform: "none" }
                    : { left: `${posicao(marca)}%` }
              }
            >
              {marca > 0 ? `+${marca}` : marca}
            </span>
          ))}
        </div>
        {linhas.map((linha, indice) => {
          const novoGrupo = indice === 0 || linhas[indice - 1]?.construto !== linha.construto;
          const medias = linha.marcadores.map((m) => m.media).filter((m) => m !== null);
          const { limites } = linha;
          return (
            <Fragment key={linha.chave}>
              {novoGrupo && <span className={estilos.grupo}>{nomesGrupos[linha.construto]}</span>}
              <span className={estilos.nome}>{linha.nome}</span>
              <svg className={`${estilos.trilho} ${estilos[linha.construto]}`} height="48" width="100%">
                <Faixa de={-3} ate={limites.abaixoDaMedia} classe={estilos.faixaRuim} rotulo="ruim" />
                <Faixa de={limites.abaixoDaMedia} ate={limites.acimaDaMedia} classe={estilos.faixaAbaixo} rotulo="abaixo" />
                <Faixa de={limites.acimaDaMedia} ate={limites.bom} classe={estilos.faixaAcima} rotulo="acima" />
                <Faixa de={limites.bom} ate={limites.excelente} classe={estilos.faixaBom} rotulo="bom" />
                <Faixa de={limites.excelente} ate={3} classe={estilos.faixaExcelente} rotulo="excelente" />
                {[linha.faixaNeutra.inferior, linha.faixaNeutra.superior].map((limite) => (
                  <line key={limite} x1={`${posicao(limite)}%`} x2={`${posicao(limite)}%`} y1="0" y2="48" className={estilos.linhaNeutra} />
                ))}
                {medias.length > 1 && (
                  <line
                    x1={`${posicao(Math.min(...medias))}%`}
                    x2={`${posicao(Math.max(...medias))}%`}
                    y1="31"
                    y2="31"
                    className={estilos.ligacao}
                  />
                )}
                {linha.marcadores.map((marcador, posicaoMarcador) => (
                  <Marcador key={posicaoMarcador} marcador={marcador} />
                ))}
              </svg>
              <span className={`${estilos.valor} ${estilos[linha.construto]}`}>{linha.valor}</span>
            </Fragment>
          );
        })}
      </div>
      <figcaption aria-hidden="true" className={estilos.legenda}>
        {legenda}
      </figcaption>
    </figure>
  );
}
