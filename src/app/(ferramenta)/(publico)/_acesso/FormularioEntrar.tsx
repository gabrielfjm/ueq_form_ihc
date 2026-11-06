"use client";

import { LogIn } from "lucide-react";
import Link from "next/link";
import { startTransition, useActionState, type FormEvent } from "react";
import { Campo, CampoSenha } from "@/componentes/formulario/Campo";
import formulario from "@/componentes/formulario/formulario.module.css";
import { ResumoErros } from "@/componentes/formulario/ResumoErros";
import { estadoInicial } from "@/lib/formulario";
import { entrar, type CampoEntrar } from "./acoes";
import estilos from "./acesso.module.css";
import { LinkPrivacidade } from "./LinkPrivacidade";
import { useT } from "@/traducao/cliente";
import { m } from "@/traducao/nucleo";


const CAMPOS = [
  { nome: "email", rotulo: m("E-mail"), id: "entrar-email" },
  { nome: "senha", rotulo: m("Senha"), id: "entrar-senha" },
] as const;

export function FormularioEntrar({ idTitulo, voltar }: { idTitulo: string; voltar: string }) {
  const t = useT();
  const [estado, enviar, enviando] = useActionState(entrar, estadoInicial<CampoEntrar>());

  // Envio pelo onSubmit em vez de action={...}: o React limpa o formulário depois da ação,
  // e quem errou a senha perderia também o e-mail digitado
  function aoEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (enviando) return;
    const dados = new FormData(evento.currentTarget);
    startTransition(() => enviar(dados));
  }

  return (
    <form className={estilos.formulario} noValidate onSubmit={aoEnviar}>
      <div className={estilos.cabecalho}>
        <p className={estilos.area}>{t("Área do pesquisador")}</p>
        <h2 id={idTitulo} className={estilos.titulo}>
          {t("Entrar")}
        </h2>
      </div>
      <ResumoErros
        envio={estado.envio}
        erros={estado.erros}
        erroGeral={estado.erroGeral}
        campos={CAMPOS}
        tituloErroGeral={t("Não foi possível entrar")}
      />
      <input type="hidden" name="voltar" value={voltar} />
      <Campo
        id="entrar-email"
        name="email"
        type="email"
        rotulo={t("E-mail")}
        autoComplete="email"
        erro={estado.erros?.email}
        data-foco-inicial=""
      />
      <CampoSenha id="entrar-senha" name="senha" rotulo={t("Senha")} autoComplete="current-password" erro={estado.erros?.senha} />
      <button type="submit" className={`${formulario.botao} ${formulario.primario} ${estilos.enviar}`}>
        <LogIn size={18} strokeWidth={1.5} aria-hidden="true" className={formulario.icone} />
        <span>{t("Entrar")}</span>
      </button>
      {/* A janela troca para Criar conta sem fechar (JanelaAcesso); aberto em outra aba, o link abre a janela lá */}
      <p className={`${estilos.alternativa} ${estilos.alternativaCadastro}`}>
        <span>
          {t("Ainda não tem conta?")}{" "}<Link href="/cadastrar">{t("Criar conta")}</Link>
        </span>
        <LinkPrivacidade />
      </p>
    </form>
  );
}
