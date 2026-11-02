"use client";

import type { LucideIcon } from "lucide-react";
import { useId, type FormEvent, type ReactNode } from "react";
import formulario from "@/componentes/formulario/formulario.module.css";
import { Janela } from "./Janela";
import estilos from "./janela.module.css";
import { useT } from "@/traducao/cliente";

type Propriedades = {
  aberta: boolean;
  aoFechar: () => void;
  titulo: string;
  // o que acontece, o que vai junto e, se for o caso, o campo de confirmação
  children: ReactNode;
  textoConfirmar: string;
  Icone: LucideIcon;
  // exclusões: ícone, borda e botão em --alerta. Sair não apaga nada e usa o botão primário
  perigo?: boolean;
  // ação de servidor chamada direto (Sair) ou o envio do useEnvioFormulario (exclusões com campo)
  action?: (dados: FormData) => void | Promise<void>;
  onSubmit?: (evento: FormEvent<HTMLFormElement>) => void;
  // sem ida ao servidor (Remover versão): a janela fica dentro do formulário do estudo e não pode ter
  // um <form> próprio, que dispararia o envio do formulário de fora
  aoConfirmar?: () => void;
  // sem campo para digitar, o foco começa no botão de confirmar, e Enter confirma
  focarConfirmar?: boolean;
};

// Confirmação de toda ação que encerra algo ou apaga dados: diz o que vai acontecer, com Cancelar
// sempre ao lado e Esc fechando sem fazer nada (Nielsen 5, WCAG 3.3.4, Shneiderman 6)
export function Confirmacao({
  aberta,
  aoFechar,
  titulo,
  children,
  textoConfirmar,
  Icone,
  perigo = false,
  action,
  onSubmit,
  aoConfirmar,
  focarConfirmar = false,
}: Propriedades) {
  const t = useT();
  const idTitulo = useId();
  const conteudo = (
    <>
      <h2 id={idTitulo} className={estilos.titulo}>
        {t(titulo)}
      </h2>
      <div className={estilos.corpo}>{children}</div>
      <div className={estilos.acoes}>
        <button type="button" className={`${formulario.botao} ${formulario.secundario}`} onClick={aoFechar}>
          {t("Cancelar")}
        </button>
        <button
          type={aoConfirmar ? "button" : "submit"}
          className={`${formulario.botao} ${perigo ? formulario.perigo : formulario.primario}`}
          data-foco-inicial={focarConfirmar ? "" : undefined}
          onClick={aoConfirmar}
        >
          <Icone size={18} strokeWidth={1.5} aria-hidden="true" className={formulario.icone} />
          <span>{t(textoConfirmar)}</span>
        </button>
      </div>
    </>
  );

  return (
    <Janela aberta={aberta} aoFechar={aoFechar} idTitulo={idTitulo} tipo="confirmacao" papel="alertdialog">
      {aoConfirmar ? (
        <div className={estilos.formulario}>{conteudo}</div>
      ) : (
        <form className={estilos.formulario} noValidate action={action} onSubmit={onSubmit}>
          {conteudo}
        </form>
      )}
    </Janela>
  );
}
