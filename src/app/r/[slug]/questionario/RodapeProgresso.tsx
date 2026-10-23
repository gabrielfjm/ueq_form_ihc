"use client";

import { useEffect, useRef, useState } from "react";
import formulario from "@/componentes/formulario/formulario.module.css";
import estilos from "./questionario.module.css";

const CENTROS = [5, 13.5, 22, 30.5, 39, 47.5, 56];

type Propriedades = {
  respondidos: number;
  total: number;
  aoSair: () => void;
};

// Rodapé fixo de progresso (docs/ihc.md §4.1): Nielsen 1, e "Sair sem enviar" sempre à mão (§3.7)
export function RodapeProgresso({ respondidos, total, aoSair }: Propriedades) {
  const rodape = useRef<HTMLElement>(null);
  const [confirmando, setConfirmando] = useState(false);
  const continuar = useRef<HTMLButtonElement>(null);
  const botaoSair = useRef<HTMLButtonElement>(null);
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

  function abrirConfirmacao() {
    setConfirmando(true);
    requestAnimationFrame(() => continuar.current?.focus());
  }

  function fecharConfirmacao() {
    setConfirmando(false);
    requestAnimationFrame(() => botaoSair.current?.focus());
  }

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
            {respondidos} de {total} respondidos
          </span>
        </p>
        {confirmando ? (
          <div role="group" aria-labelledby="pergunta-sair" className={estilos.confirmarSaida}>
            <span id="pergunta-sair">Sair sem enviar? Nada do que você marcou será gravado.</span>
            <button type="button" className={`${formulario.botao} ${formulario.secundario} ${estilos.botaoRodape}`} onClick={aoSair}>
              Sair sem enviar
            </button>
            <button
              ref={continuar}
              type="button"
              className={`${formulario.botao} ${formulario.primario} ${estilos.botaoRodape}`}
              onClick={fecharConfirmacao}
            >
              Continuar respondendo
            </button>
          </div>
        ) : (
          <button ref={botaoSair} type="button" className={estilos.sair} onClick={abrirConfirmacao}>
            Sair sem enviar
          </button>
        )}
      </div>
    </footer>
  );
}
