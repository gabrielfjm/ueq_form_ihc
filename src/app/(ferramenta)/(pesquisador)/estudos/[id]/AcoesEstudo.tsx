"use client";

import { Pencil, Trash2 } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Campo } from "@/componentes/formulario/Campo";
import formulario from "@/componentes/formulario/formulario.module.css";
import { useEnvioFormulario } from "@/componentes/formulario/useEnvioFormulario";
import { excluirEstudo } from "../acoes";
import estilos from "./pagina-estudo.module.css";

type Propriedades = {
  estudoId: string;
  avisoExclusao: { destaque: string; complemento: string };
  // botão de coleta que vem antes de Editar (Encerrar ou Reabrir); no rascunho ele fica no painel de cima
  coleta?: ReactNode;
};

// docs/ihc.md 4.2: excluir pede o título digitado e diz quantas respostas vão junto (Nielsen 5, WCAG 3.3.4)
export function AcoesEstudo({ estudoId, avisoExclusao, coleta }: Propriedades) {
  const [aberta, setAberta] = useState(false);
  const { estado, aoEnviar, limpar } = useEnvioFormulario(excluirEstudo.bind(null, estudoId));
  const botaoAbrir = useRef<HTMLButtonElement>(null);
  const campo = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (aberta || estado.erros?.confirmacao) campo.current?.focus();
  }, [aberta, estado]);

  function cancelar() {
    setAberta(false);
    limpar();
    botaoAbrir.current?.focus();
  }

  return (
    <>
      <div className={estilos.acoes}>
        {coleta}
        <Link href={`/estudos/${estudoId}/editar` as Route} className={formulario.linkAcao}>
          <Pencil size={18} strokeWidth={1.5} aria-hidden="true" />
          <span>Editar estudo</span>
        </Link>
        <button
          ref={botaoAbrir}
          type="button"
          className={formulario.destrutivo}
          aria-expanded={aberta}
          aria-controls="confirmar-exclusao"
          onClick={() => setAberta(true)}
        >
          <Trash2 size={18} strokeWidth={1.5} aria-hidden="true" />
          <span>Excluir estudo</span>
        </button>
      </div>
      <form id="confirmar-exclusao" className={estilos.confirmacao} hidden={!aberta} noValidate onSubmit={aoEnviar}>
        <p>
          <strong>{avisoExclusao.destaque}</strong> {avisoExclusao.complemento}
        </p>
        <Campo
          ref={campo}
          id="confirmar-titulo"
          name="confirmacao"
          rotulo="Digite o título do estudo para confirmar"
          autoComplete="off"
          erro={estado.erros?.confirmacao}
        />
        <div className={estilos.acoesConfirmacao}>
          <button type="submit" className={`${formulario.botao} ${formulario.perigo}`}>
            <Trash2 size={18} strokeWidth={1.5} aria-hidden="true" />
            <span>Excluir definitivamente</span>
          </button>
          <button type="button" className={`${formulario.botao} ${formulario.secundario}`} onClick={cancelar}>
            Cancelar
          </button>
        </div>
      </form>
    </>
  );
}
