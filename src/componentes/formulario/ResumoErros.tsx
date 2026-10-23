"use client";

import { useEffect, useId, useRef } from "react";
import type { ErroCampo } from "@/lib/formulario";
import estilos from "./formulario.module.css";

type Propriedades = {
  // muda a cada envio; é o que faz o foco voltar ao resumo mesmo quando o erro se repete
  envio: number;
  erros?: Partial<Record<string, ErroCampo>>;
  erroGeral?: string;
  // rótulo de cada campo, na ordem em que aparecem no formulário, e o id do input
  campos: readonly { nome: string; rotulo: string; id: string }[];
  tituloErroGeral?: string;
};

// "Esse e-mail já tem conta." vira "esse e-mail já tem conta" depois de "E-mail:"
function paraOResumo(mensagem: string): string {
  const semPonto = mensagem.replace(/\.$/, "");
  return semPonto.charAt(0).toLowerCase() + semPonto.slice(1);
}

// WCAG 3.3.1 e Nielsen 9: o resumo recebe o foco e cada item leva ao campo com problema
export function ResumoErros({ envio, erros, erroGeral, campos, tituloErroGeral }: Propriedades) {
  const ref = useRef<HTMLDivElement>(null);
  const idTitulo = useId();
  const comErro = campos.filter((campo) => erros?.[campo.nome]);
  const temProblema = comErro.length > 0 || Boolean(erroGeral);

  useEffect(() => {
    if (envio > 0 && temProblema) ref.current?.focus();
  }, [envio, temProblema]);

  if (!temProblema) return null;

  const titulo =
    comErro.length > 0
      ? `Corrija ${comErro.length} ${comErro.length === 1 ? "campo" : "campos"} para continuar`
      : (tituloErroGeral ?? "Não deu para concluir");

  return (
    <div ref={ref} tabIndex={-1} role="alert" aria-labelledby={idTitulo} className={estilos.resumoErros}>
      <h2 id={idTitulo} className={estilos.resumoTitulo}>
        {titulo}
      </h2>
      {comErro.length > 0 ? (
        <ul>
          {comErro.map((campo) => (
            <li key={campo.nome}>
              <a href={`#${campo.id}`}>
                {campo.rotulo}: {paraOResumo(erros?.[campo.nome]?.mensagem ?? "")}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>{erroGeral}</p>
      )}
    </div>
  );
}
