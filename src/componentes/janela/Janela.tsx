"use client";

import { X } from "lucide-react";
import { useEffect, useRef, type MouseEvent, type ReactNode } from "react";
import estilos from "./janela.module.css";
import { useT } from "@/traducao/cliente";
import { m } from "@/traducao/nucleo";


type Propriedades = {
  aberta: boolean;
  aoFechar: () => void;
  // id do título que dá nome à janela (aria-labelledby)
  idTitulo: string;
  // "acesso" é a janela larga de Entrar e Criar conta; "confirmacao", a estreita de Sair e das exclusões;
  // "conteudo", a média da ajuda (?), do Compartilhar e das boas-vindas do tour
  tipo: "acesso" | "confirmacao" | "conteudo";
  // alertdialog nas confirmações: o leitor de tela anuncia que a janela pede uma decisão
  papel?: "dialog" | "alertdialog";
  className?: string;
  // nome do botão x; null tira o botão (no link do participante, que tem 37 idiomas, Esc e o botão de
  // continuar já fecham a janela)
  rotuloFechar?: string | null;
  children: ReactNode;
};

// Janela modal sobre <dialog> nativo: Esc fecha, o foco fica preso dentro dela enquanto está aberta,
// o resto da página fica inerte e, ao fechar, o foco volta para quem abriu (WCAG 2.1.2, 2.4.3).
// Clicar fora também fecha. O foco inicial vai para o elemento marcado com data-foco-inicial
// (o campo de e-mail no acesso, o campo de confirmação na exclusão); sem marcação, para o primeiro focável
export function Janela({
  aberta,
  aoFechar,
  idTitulo,
  tipo,
  papel = "dialog",
  className,
  rotuloFechar = m("Fechar"),
  children,
}: Propriedades) {
  const t = useT();
  const janela = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const elemento = janela.current;
    if (!elemento) return;
    if (aberta && !elemento.open) {
      elemento.showModal();
      elemento.querySelector<HTMLElement>("[data-foco-inicial]")?.focus();
    } else if (!aberta && elemento.open) {
      elemento.close();
    }
  }, [aberta]);

  // O clique no fundo escurecido cai no próprio <dialog>, fora da caixa de conteúdo
  function aoClicar(evento: MouseEvent<HTMLDialogElement>) {
    if (evento.target === evento.currentTarget) evento.currentTarget.close();
  }

  return (
    <dialog
      ref={janela}
      role={papel === "alertdialog" ? "alertdialog" : undefined}
      aria-modal="true"
      aria-labelledby={idTitulo}
      className={`${estilos.janela} ${estilos[tipo]} ${className ?? ""}`}
      onClose={aoFechar}
      onClick={aoClicar}
    >
      <div className={estilos.caixa}>
        {rotuloFechar && (
          <button type="button" className={estilos.fechar} aria-label={t(rotuloFechar)} onClick={() => janela.current?.close()}>
            <X size={20} strokeWidth={1.5} aria-hidden="true" />
          </button>
        )}
        {children}
      </div>
    </dialog>
  );
}
