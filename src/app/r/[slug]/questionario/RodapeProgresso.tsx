"use client";

import { useEffect, useId, useRef, useState } from "react";
import formulario from "@/componentes/formulario/formulario.module.css";
import { Janela } from "@/componentes/janela/Janela";
import janela from "@/componentes/janela/janela.module.css";
import { formatar } from "@/idiomas/formatar";
import type { TextosParticipante } from "@/idiomas/tipos";
import estilos from "./questionario.module.css";

const CENTROS = [5, 13.5, 22, 30.5, 39, 47.5, 56];

type Propriedades = {
  respondidos: number;
  total: number;
  aoSair: () => void;
  textos: Pick<TextosParticipante["questionario"], "contagem" | "sair" | "perguntaSair" | "continuar">;
};

// Rodapé fixo de progresso (docs/ihc.md §4.1): Nielsen 1, e "Sair sem enviar" sempre à mão (§3.7).
// Sair pede confirmação numa janela, como toda ação que descarta algo (protótipo p8): o foco começa em
// Continuar respondendo, Esc também continua, e o foco volta para "Sair sem enviar" (WCAG 2.4.3)
export function RodapeProgresso({ respondidos, total, aoSair, textos }: Propriedades) {
  const rodape = useRef<HTMLElement>(null);
  const [confirmando, setConfirmando] = useState(false);
  const idPergunta = useId();
  const cheias = Math.round((respondidos / total) * CENTROS.length);

  // WCAG 2.4.11: a página rola deixando livre a altura do rodapé, então o item em foco nunca fica embaixo dele
  useEffect(() => {
    const elemento = rodape.current;
    if (!elemento) return;
    const raiz = document.documentElement;
    const ajustar = () => {
      raiz.style.scrollPaddingBottom = `${elemento.offsetHeight + 16}px`;
    };
    ajustar();
    const observador = new ResizeObserver(ajustar);
    observador.observe(elemento);
    return () => {
      observador.disconnect();
      raiz.style.scrollPaddingBottom = "";
    };
  }, []);

  return (
    <footer ref={rodape} className={estilos.rodape}>
      <div className={estilos.rodapeInterno}>
        <p className={estilos.progresso}>
          <svg width="62" height="10" viewBox="0 0 62 10" aria-hidden="true">
            {CENTROS.map((cx, posicao) => (
              <circle key={cx} cx={cx} cy="5" r="3.75" className={posicao < cheias ? estilos.cheia : undefined} />
            ))}
          </svg>
          <span className={estilos.contagem}>
            {formatar(textos.contagem, { n: respondidos, total })}
          </span>
        </p>
        <button type="button" className={estilos.sair} aria-haspopup="dialog" onClick={() => setConfirmando(true)}>
          {textos.sair}
        </button>
      </div>
      {/* Sem ícone e sem o x: as telas do participante não têm ícones (docs/design.md, Ícones) */}
      <Janela
        aberta={confirmando}
        aoFechar={() => setConfirmando(false)}
        idTitulo={idPergunta}
        tipo="confirmacao"
        papel="alertdialog"
        rotuloFechar={null}
      >
        <div className={janela.formulario}>
          <h2 id={idPergunta} className={`${janela.titulo} ${estilos.perguntaSair}`}>
            {textos.perguntaSair}
          </h2>
          <div className={janela.acoes}>
            <button
              type="button"
              className={`${formulario.botao} ${formulario.secundario} ${estilos.botaoJanela}`}
              onClick={aoSair}
            >
              {textos.sair}
            </button>
            <button
              type="button"
              className={`${formulario.botao} ${formulario.primario} ${estilos.botaoJanela}`}
              data-foco-inicial=""
              onClick={() => setConfirmando(false)}
            >
              {textos.continuar}
            </button>
          </div>
        </div>
      </Janela>
    </footer>
  );
}
