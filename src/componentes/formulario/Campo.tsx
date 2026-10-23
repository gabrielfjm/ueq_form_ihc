"use client";

import { Eye } from "lucide-react";
import Link from "next/link";
import { useState, type InputHTMLAttributes, type Ref, type TextareaHTMLAttributes } from "react";
import type { ErroCampo } from "@/lib/formulario";
import estilos from "./formulario.module.css";

type PropriedadesCampo = Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "className"> & {
  id: string;
  rotulo: string;
  ajuda?: string;
  erro?: ErroCampo;
  ref?: Ref<HTMLInputElement>;
};

type PropriedadesCampoSenha = Omit<PropriedadesCampo, "type"> & {
  // "Mostrar senha" no acesso, "Mostrar" na página Minha conta, como no protótipo
  textoMostrar?: string;
};

function MensagemErro({ id, erro }: { id: string; erro: ErroCampo }) {
  return (
    <p id={id} className={estilos.erro}>
      {erro.mensagem}
      {erro.link && (
        <>
          {" "}
          <Link href={erro.link.href}>{erro.link.texto}</Link>
        </>
      )}
    </p>
  );
}

function descricoes(id: string, ajuda?: string, erro?: ErroCampo): string | undefined {
  const ids = [ajuda ? `${id}-ajuda` : null, erro ? `${id}-erro` : null].filter(Boolean);
  return ids.length > 0 ? ids.join(" ") : undefined;
}

export function Campo({ id, rotulo, ajuda, erro, ...entrada }: PropriedadesCampo) {
  return (
    <div className={estilos.grupo}>
      <label htmlFor={id} className={estilos.rotulo}>
        {rotulo}
      </label>
      {ajuda && (
        <p id={`${id}-ajuda`} className={estilos.ajuda}>
          {ajuda}
        </p>
      )}
      <input
        id={id}
        className={estilos.campo}
        aria-invalid={erro ? true : undefined}
        aria-describedby={descricoes(id, ajuda, erro)}
        {...entrada}
      />
      {erro && <MensagemErro id={`${id}-erro`} erro={erro} />}
    </div>
  );
}

type PropriedadesAreaTexto = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id" | "className"> & {
  id: string;
  rotulo: string;
  ajuda?: string;
  erro?: ErroCampo;
};

export function AreaTexto({ id, rotulo, ajuda, erro, ...entrada }: PropriedadesAreaTexto) {
  return (
    <div className={estilos.grupo}>
      <label htmlFor={id} className={estilos.rotulo}>
        {rotulo}
      </label>
      {ajuda && (
        <p id={`${id}-ajuda`} className={estilos.ajuda}>
          {ajuda}
        </p>
      )}
      <textarea
        id={id}
        className={`${estilos.campo} ${estilos.areaTexto}`}
        aria-invalid={erro ? true : undefined}
        aria-describedby={descricoes(id, ajuda, erro)}
        {...entrada}
      />
      {erro && <MensagemErro id={`${id}-erro`} erro={erro} />}
    </div>
  );
}

// WCAG 3.3.8: colar e gerenciador de senhas funcionam; o botão mostra o que foi digitado
export function CampoSenha({ id, rotulo, ajuda, erro, textoMostrar = "Mostrar senha", ...entrada }: PropriedadesCampoSenha) {
  const [visivel, setVisivel] = useState(false);
  return (
    <div className={estilos.grupo}>
      <label htmlFor={id} className={estilos.rotulo}>
        {rotulo}
      </label>
      {ajuda && (
        <p id={`${id}-ajuda`} className={estilos.ajuda}>
          {ajuda}
        </p>
      )}
      <div className={estilos.linhaSenha}>
        <input
          id={id}
          type={visivel ? "text" : "password"}
          className={estilos.campo}
          aria-invalid={erro ? true : undefined}
          aria-describedby={descricoes(id, ajuda, erro)}
          autoCapitalize="none"
          spellCheck={false}
          {...entrada}
        />
        <button
          type="button"
          className={`${estilos.botao} ${estilos.secundario}`}
          aria-pressed={visivel}
          aria-controls={id}
          onClick={() => setVisivel((atual) => !atual)}
        >
          <Eye size={18} strokeWidth={1.5} aria-hidden="true" className={estilos.icone} />
          <span>{textoMostrar}</span>
        </button>
      </div>
      {erro && <MensagemErro id={`${id}-erro`} erro={erro} />}
    </div>
  );
}
