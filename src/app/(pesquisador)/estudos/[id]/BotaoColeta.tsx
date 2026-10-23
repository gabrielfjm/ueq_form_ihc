"use client";

import { Play, RotateCcw, Square } from "lucide-react";
import { useTransition } from "react";
import { useAnunciar } from "@/componentes/Avisos";
import formulario from "@/componentes/formulario/formulario.module.css";
import { alterarColeta } from "../acoes";

const BOTOES = {
  abrir: { texto: "Abrir coleta", Icone: Play },
  encerrar: { texto: "Encerrar coleta", Icone: Square },
  reabrir: { texto: "Reabrir coleta", Icone: RotateCcw },
} as const;

type Propriedades = {
  estudoId: string;
  acao: keyof typeof BOTOES;
  className?: string;
};

// Encerrar é reversível (Reabrir), por isso não pede confirmação (docs/ihc.md 4.2, Shneiderman 6)
export function BotaoColeta({ estudoId, acao, className = `${formulario.botao} ${formulario.secundario}` }: Propriedades) {
  const anunciar = useAnunciar();
  const [enviando, iniciar] = useTransition();
  const { texto, Icone } = BOTOES[acao];

  function alterar() {
    if (enviando) return;
    iniciar(async () => {
      const resultado = await alterarColeta(estudoId, acao);
      anunciar(resultado.sucesso ?? resultado.erro ?? "");
    });
  }

  return (
    <button type="button" className={className} onClick={alterar} aria-disabled={enviando || undefined}>
      <Icone size={18} strokeWidth={1.5} aria-hidden="true" />
      <span>{texto}</span>
    </button>
  );
}
