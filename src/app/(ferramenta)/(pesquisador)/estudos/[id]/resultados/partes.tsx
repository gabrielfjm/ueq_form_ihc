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

const CONSTRUTOS: Construto[] = ["atratividade", "pragmatica", "hedonica"];

// Legenda do gráfico de escalas (protótipo r6): cor de cada construto e o que cada traço significa
export async function LegendaConstrutos({ comIntervalo = true }: { comIntervalo?: boolean }) {
  const t = await tradutor();
  return (
    <>
      {CONSTRUTOS.map((construto) => (
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
