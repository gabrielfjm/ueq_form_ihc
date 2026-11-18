"use client";

import formulario from "@/componentes/formulario/formulario.module.css";
import estilos from "./formulario-estudo.module.css";
import { useT } from "@/traducao/cliente";

// Mostra o começo do termo de consentimento como o participante vai ver (protótipo r4)
// curto: o estudo usa o UEQ-S, que leva menos tempo
type Propriedades = { titulo: string; objetivo: string; etapas: number; curto: boolean; responsavel: string; instituicao: string };

export function PreviaParticipante({ titulo, objetivo, etapas, curto, responsavel, instituicao }: Propriedades) {
  const t = useT();
  return (
    <aside aria-labelledby="titulo-previa" className={estilos.previa}>
      <h2 id="titulo-previa" className={estilos.previaRotulo}>
        {t("Prévia para o participante")}
      </h2>
      <div className={estilos.cartao}>
        <div className={estilos.cartaoTopo}>
          <p className={estilos.cartaoEtapa}>{t("Etapa 1 de {etapas} · Consentimento", { etapas: etapas })}</p>
          <p className={estilos.cartaoTitulo}>
            {titulo.trim() || <span className={estilos.marcador}>{t("Título do estudo")}</span>}
          </p>
        </div>
        <div className={estilos.cartaoCorpo}>
          <p className={estilos.cartaoObjetivo}>
            {objetivo.trim() || <span className={estilos.marcador}>{t("O objetivo aparece aqui.")}</span>}
          </p>
          <p className={estilos.cartaoDuracao}>
            {curto
              ? etapas === 3
                ? t("De 2 a 3 minutos · voluntária e anônima")
                : t("De 1 a 2 minutos · voluntária e anônima")
              : etapas === 3
                ? t("De 4 a 6 minutos · voluntária e anônima")
                : t("De 3 a 5 minutos · voluntária e anônima")}
          </p>
          <p className={estilos.cartaoDuracao}>
            {t("Responsável:")}{" "}
            {[responsavel.trim(), instituicao.trim()].filter(Boolean).join(" · ") || (
              <span className={estilos.marcador}>{t("Nome do responsável")}</span>
            )}
          </p>
          <span className={estilos.cartaoBotao} aria-hidden="true">
            {t("Concordo e quero participar")}
          </span>
        </div>
      </div>
      <p className={formulario.ajuda}>{t("A prévia acompanha o que você digita. O texto fixo do termo vem da própria ferramenta.")}</p>
    </aside>
  );
}
