"use client";

import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import estilos from "./pesquisador.module.css";

type Propriedades = {
  // o logotipo com o link de início
  inicio: ReactNode;
  // os links da navegação principal
  children: ReactNode;
};

// A barra superior fica fixa no topo ao rolar, no computador e no celular. No celular os links ficam
// atrás de um botão Menu, para a barra fixa não ocupar um quarto da tela. A altura real é publicada em
// --altura-barra, que o scroll-padding-top do globals.css usa para o foco e as âncoras nunca ficarem
// embaixo da barra (WCAG 2.4.11)
export function BarraFixa({ inicio, children }: Propriedades) {
  const barra = useRef<HTMLElement>(null);
  const botao = useRef<HTMLButtonElement>(null);
  const caminho = usePathname();
  // Guarda em que página o menu foi aberto: ao navegar, ele fecha sozinho
  const [abertoEm, setAbertoEm] = useState<string | null>(null);
  const aberto = abertoEm === caminho;

  useEffect(() => {
    const elemento = barra.current;
    if (!elemento) return;
    const raiz = document.documentElement;
    const publicar = () => raiz.style.setProperty("--altura-barra", `${Math.ceil(elemento.getBoundingClientRect().height)}px`);
    publicar();
    const observador = new ResizeObserver(publicar);
    observador.observe(elemento);
    return () => {
      observador.disconnect();
      raiz.style.removeProperty("--altura-barra");
    };
  }, []);

  // Esc fecha o menu e devolve o foco ao botão, sem prender o teclado (WCAG 2.1.2)
  function aoTeclar(evento: KeyboardEvent<HTMLElement>) {
    if (evento.key !== "Escape" || !aberto) return;
    setAbertoEm(null);
    botao.current?.focus();
  }

  return (
    <header ref={barra} className={estilos.barra} data-barra-fixa="" onKeyDown={aoTeclar}>
      <div className={estilos.barraInterna}>
        {inicio}
        <button
          ref={botao}
          type="button"
          className={estilos.botaoMenu}
          aria-expanded={aberto}
          aria-controls="navegacao-principal"
          onClick={() => setAbertoEm(aberto ? null : caminho)}
        >
          {aberto ? <X size={18} strokeWidth={1.5} aria-hidden="true" /> : <Menu size={18} strokeWidth={1.5} aria-hidden="true" />}
          <span>Menu</span>
        </button>
        <nav id="navegacao-principal" aria-label="Principal" className={estilos.navegacao} data-aberto={aberto ? "" : undefined}>
          {children}
        </nav>
      </div>
    </header>
  );
}
