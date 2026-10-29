"use client";

import { LogIn } from "lucide-react";
import Link from "next/link";
import { startTransition, useActionState, type FormEvent } from "react";
import { Campo, CampoSenha } from "@/componentes/formulario/Campo";
import formulario from "@/componentes/formulario/formulario.module.css";
import { MensagemStatus } from "@/componentes/formulario/MensagemStatus";
import { ResumoErros } from "@/componentes/formulario/ResumoErros";
import { estadoInicial } from "@/lib/formulario";
import { entrar, type CampoEntrar } from "../acoes";
import estilos from "../acesso.module.css";

const CAMPOS = [
  { nome: "email", rotulo: "E-mail", id: "entrar-email" },
  { nome: "senha", rotulo: "Senha", id: "entrar-senha" },
] as const;

export function FormularioEntrar({ voltar, status }: { voltar: string; status: string | null }) {
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
        <p className={estilos.area}>Área do pesquisador</p>
        <h1 className={estilos.titulo}>Entrar</h1>
      </div>
      {status && <MensagemStatus mensagem={status} />}
      <ResumoErros
        envio={estado.envio}
        erros={estado.erros}
        erroGeral={estado.erroGeral}
        campos={CAMPOS}
        tituloErroGeral="Não foi possível entrar"
      />
      <input type="hidden" name="voltar" value={voltar} />
      <Campo id="entrar-email" name="email" type="email" rotulo="E-mail" autoComplete="email" erro={estado.erros?.email} />
      <CampoSenha id="entrar-senha" name="senha" rotulo="Senha" autoComplete="current-password" erro={estado.erros?.senha} />
      <button type="submit" className={`${formulario.botao} ${formulario.primario} ${estilos.enviar}`}>
        <LogIn size={18} strokeWidth={1.5} aria-hidden="true" className={formulario.icone} />
        <span>Entrar</span>
      </button>
      <p className={estilos.alternativa}>
        Ainda não tem conta? <Link href="/cadastrar">Criar conta</Link>
      </p>
    </form>
  );
}
