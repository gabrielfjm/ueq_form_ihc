import type { TextosParticipante } from "@/idiomas";
import type { CondicaoDoTermo } from "@/lib/termo";
import estilos from "./participante.module.css";

type Propriedades = {
  textos: TextosParticipante["consentimento"];
  objetivo: string;
  // lang dos textos escritos pelo pesquisador (o do estudo, ou o do participante se já traduzidos)
  langDoEstudo: string;
  condicoes: CondicaoDoTermo[];
  instrumento: "UEQ" | "UEQ_S";
  children?: React.ReactNode;
};

// O termo de consentimento inteiro. Aparece no consentimento e na página de guardar uma via (protótipo p1)
export function Termo({ textos, objetivo, langDoEstudo, condicoes, instrumento, children }: Propriedades) {
  return (
    <section aria-labelledby="titulo-termo" className={estilos.termo}>
      <h2 id="titulo-termo" className={estilos.termoTitulo}>
        {textos.termoTitulo}
      </h2>
      <p className={estilos.texto}>
        <span lang={langDoEstudo}>{objetivo}</span> {instrumento === "UEQ_S" ? textos.termoTextoCurto : textos.termoTexto}
      </p>
      <dl className={estilos.condicoes}>
        {condicoes.map(({ rotulo, linhas, doEstudo }, posicao) => (
          <div key={rotulo}>
            <span className={estilos.condicaoNumero} aria-hidden="true">
              {String(posicao + 1).padStart(2, "0")}
            </span>
            <dt>{rotulo}</dt>
            <dd lang={doEstudo ? langDoEstudo : undefined}>
              {linhas.map((linha) => (
                <span key={linha} className={estilos.linhaCondicao}>
                  {linha}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
      {children}
    </section>
  );
}
