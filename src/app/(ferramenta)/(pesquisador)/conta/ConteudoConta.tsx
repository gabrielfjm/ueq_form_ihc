"use client";

import { useState, type ReactNode } from "react";
import { MensagemStatus } from "@/componentes/formulario/MensagemStatus";
import estilos from "./conta.module.css";
import { ExcluirConta } from "./ExcluirConta";
import { FormularioDados } from "./FormularioDados";
import { FormularioSenha } from "./FormularioSenha";

type Propriedades = {
  nome: string;
  email: string;
  avisoExclusao: { destaque: string; complemento: string };
  ficha: ReactNode;
};

export function ConteudoConta({ nome, email, avisoExclusao, ficha }: Propriedades) {
  const [status, setStatus] = useState({ mensagem: "", vez: 0 });

  // docs/ihc.md, 4.2: toda ação dá retorno visível e anunciado
  function anunciar(mensagem: string) {
    setStatus((atual) => ({ mensagem, vez: atual.vez + 1 }));
  }

  return (
    <>
      <MensagemStatus mensagem={status.mensagem} vez={status.vez} className={estilos.regiaoStatus} />
      <div className={estilos.colunas}>
        <div className={estilos.secoes}>
          <FormularioDados nome={nome} email={email} aoSalvar={anunciar} />
          <FormularioSenha email={email} aoTrocar={anunciar} />
          <ExcluirConta aviso={avisoExclusao} />
        </div>
        {ficha}
      </div>
    </>
  );
}
