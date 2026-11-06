"use client";

import { Play, RotateCcw, Square } from "lucide-react";
import { useTransition } from "react";
import { useAnunciar } from "@/componentes/Avisos";
import formulario from "@/componentes/formulario/formulario.module.css";
import { alterarColeta } from "../acoes";
import { m } from "@/traducao/nucleo";
import { useT } from "@/traducao/cliente";
import { BotaoEnvio } from "@/componentes/formulario/BotaoEnvio";


const BOTOES = {
  abrir: { texto: m("Abrir coleta"), enviando: m("Abrindo a coleta…"), Icone: Play },
  encerrar: { texto: m("Encerrar coleta"), enviando: m("Encerrando a coleta…"), Icone: Square },
  reabrir: { texto: m("Reabrir coleta"), enviando: m("Reabrindo a coleta…"), Icone: RotateCcw },
} as const;

type Propriedades = {
  estudoId: string;
  acao: keyof typeof BOTOES;
  className?: string;
};

// Encerrar é reversível (Reabrir), por isso não pede confirmação (docs/ihc.md 4.2, Shneiderman 6)
export function BotaoColeta({ estudoId, acao, className = `${formulario.botao} ${formulario.secundario}` }: Propriedades) {
  const t = useT();
  const anunciar = useAnunciar();
  const [enviando, iniciar] = useTransition();
  const { texto, enviando: textoEnviando, Icone } = BOTOES[acao];

  function alterar() {
    if (enviando) return;
    iniciar(async () => {
      const resultado = await alterarColeta(estudoId, acao);
      anunciar(resultado.erro ?? resultado.sucesso ?? "", Boolean(resultado.erro));
    });
  }

  return (
    <BotaoEnvio
      type="button"
      enviando={enviando}
      textoEnviando={t(textoEnviando)}
      icone={<Icone size={18} strokeWidth={1.5} aria-hidden="true" />}
      className={className}
      onClick={alterar}
    >
      {t(texto)}
    </BotaoEnvio>
  );
}
