"use client";

import { Pencil, Trash2 } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Campo } from "@/componentes/formulario/Campo";
import formulario from "@/componentes/formulario/formulario.module.css";
import { useEnvioFormulario } from "@/componentes/formulario/useEnvioFormulario";
import { Confirmacao } from "@/componentes/janela/Confirmacao";
import janela from "@/componentes/janela/janela.module.css";
import { excluirEstudo } from "../acoes";
import estilos from "./pagina-estudo.module.css";

type Propriedades = {
  estudoId: string;
  avisoExclusao: { destaque: string; complemento: string };
  // botão de coleta que vem antes de Editar (Encerrar ou Reabrir); no rascunho ele fica no painel de cima
  coleta?: ReactNode;
};

// docs/ihc.md 4.2: excluir abre uma janela que pede o título digitado e diz quantas respostas vão junto
// (Nielsen 5, WCAG 3.3.4). Protótipo r21
export function AcoesEstudo({ estudoId, avisoExclusao, coleta }: Propriedades) {
  const [aberta, setAberta] = useState(false);
  const { estado, aoEnviar, limpar } = useEnvioFormulario(excluirEstudo.bind(null, estudoId));
  const campo = useRef<HTMLInputElement>(null);

  // Com o título errado, o foco volta para o campo, junto da mensagem de erro
  useEffect(() => {
    if (estado.erros?.confirmacao) campo.current?.focus();
  }, [estado]);

  function fechar() {
    setAberta(false);
    limpar();
  }

  return (
    <div className={estilos.acoes}>
      {coleta}
      <Link href={`/estudos/${estudoId}/editar` as Route} className={formulario.linkAcao}>
        <Pencil size={18} strokeWidth={1.5} aria-hidden="true" />
        <span>Editar estudo</span>
      </Link>
      <button type="button" className={formulario.destrutivo} aria-haspopup="dialog" onClick={() => setAberta(true)}>
        <Trash2 size={18} strokeWidth={1.5} aria-hidden="true" />
        <span>Excluir estudo</span>
      </button>
      <Confirmacao
        aberta={aberta}
        aoFechar={fechar}
        titulo="Excluir este estudo?"
        textoConfirmar="Excluir definitivamente"
        Icone={Trash2}
        perigo
        onSubmit={aoEnviar}
      >
        <p className={janela.aviso}>
          <strong>{avisoExclusao.destaque}</strong> {avisoExclusao.complemento}
        </p>
        <Campo
          ref={campo}
          id="confirmar-titulo"
          name="confirmacao"
          rotulo="Digite o título do estudo para confirmar"
          autoComplete="off"
          erro={estado.erros?.confirmacao}
          data-foco-inicial=""
        />
      </Confirmacao>
    </div>
  );
}
