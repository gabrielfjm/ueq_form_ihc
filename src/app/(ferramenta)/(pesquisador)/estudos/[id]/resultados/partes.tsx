import graficos from "@/graficos/graficos.module.css";
import { NOME_CONSTRUTO, type Construto } from "@/lib/nomes-ueq";
import estilos from "./resultados.module.css";
import { tradutor } from "@/traducao/servidor";

export async function TituloSecao({ id, numero, children }: { id: string; numero: number; children: string }) {
  const t = await tradutor();
  return (
    <div className={estilos.secaoTitulo}>
      <span className={estilos.secaoNumero}>{t(String(numero).padStart(2, "0"))}</span>
      <h2 id={id} className={estilos.secaoNome}>
        {t(children)}
      </h2>
    </div>
  );
}

// Crédito do método no fim de cada painel (e do PDF): os autores e o site oficial dos materiais
export async function FonteDoMetodo({ instrumento }: { instrumento: "UEQ" | "UEQ_S" }) {
  const t = await tradutor();
  return (
    <p className={estilos.fonteMetodo}>
      {instrumento === "UEQ_S"
        ? t("Método: UEQ-S, a versão curta do User Experience Questionnaire (Schrepp, Hinderks e Thomaschewski, 2017). Benchmark e cálculo da planilha oficial de análise do UEQ-S, em")
        : t("Método: User Experience Questionnaire (Laugwitz, Held e Schrepp, 2008). Benchmark de Schrepp, Hinderks e Thomaschewski (2017) e cálculo da planilha oficial de análise, em")}{" "}
      <a href="https://www.ueq-online.org/" rel="noopener" lang="en">
        ueq-online.org
      </a>
      .
    </p>
  );
}

const CONSTRUTOS: Construto[] = ["atratividade", "pragmatica", "hedonica"];
// UEQ-S: as duas qualidades e a escala geral
export const CONSTRUTOS_UEQ_S: Construto[] = ["pragmatica", "hedonica", "geral"];

// Legenda do gráfico de escalas (protótipo r6): cor de cada construto e o que cada traço significa
export async function LegendaConstrutos({ comIntervalo = true, construtos = CONSTRUTOS }: { comIntervalo?: boolean; construtos?: Construto[] }) {
  const t = await tradutor();
  return (
    <>
      {construtos.map((construto) => (
        <span key={construto} className={graficos[construto]}>
          <span className={graficos.amostra} />
          {t(NOME_CONSTRUTO[construto])}
        </span>
      ))}
      <span>
        {t("{v}tracejado: faixa neutra de -0,8 a +0,8", { v: comIntervalo ? "Ponto: média · traço: IC95 · " : "Traço: distância entre as versões · " })}
      </span>
    </>
  );
}
