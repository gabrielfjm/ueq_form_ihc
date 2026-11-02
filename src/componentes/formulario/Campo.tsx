"use client";

import { Eye } from "lucide-react";
import Link from "next/link";
import { useState, type InputHTMLAttributes, type Ref, type TextareaHTMLAttributes } from "react";
import type { ErroCampo } from "@/lib/formulario";
import estilos from "./formulario.module.css";
import { useT } from "@/traducao/cliente";

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

// As mensagens vêm do servidor já traduzidas ou marcadas com m(); t() de um texto já traduzido não muda nada
function MensagemErro({ id, erro }: { id: string; erro: ErroCampo }) {
  const t = useT();
  return (
    <p id={id} className={estilos.erro}>
      {t(erro.mensagem)}
      {erro.link && (
        <>
          {" "}
          <Link href={erro.link.href}>{t(erro.link.texto)}</Link>
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
  const t = useT();
  return (
    <div className={estilos.grupo}>
      <label htmlFor={id} className={estilos.rotulo}>
        {t(rotulo)}
      </label>
      {ajuda && (
        <p id={`${id}-ajuda`} className={estilos.ajuda}>
          {t(ajuda)}
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
  const t = useT();
  return (
    <div className={estilos.grupo}>
      <label htmlFor={id} className={estilos.rotulo}>
        {t(rotulo)}
      </label>
      {ajuda && (
        <p id={`${id}-ajuda`} className={estilos.ajuda}>
          {t(ajuda)}
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
export function CampoSenha({ id, rotulo, ajuda, erro, textoMostrar, ...entrada }: PropriedadesCampoSenha) {
  const t = useT();
  const mostrar = textoMostrar ?? t("Mostrar senha");
  const [visivel, setVisivel] = useState(false);
  return (
    <div className={estilos.grupo}>
      <label htmlFor={id} className={estilos.rotulo}>
        {t(rotulo)}
      </label>
      {ajuda && (
        <p id={`${id}-ajuda`} className={estilos.ajuda}>
          {t(ajuda)}
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
          <span>{t(mostrar)}</span>
        </button>
      </div>
      {erro && <MensagemErro id={`${id}-erro`} erro={erro} />}
    </div>
  );
}
