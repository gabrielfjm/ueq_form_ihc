"use client";

import { UserPlus } from "lucide-react";
import Link from "next/link";
import { startTransition, useActionState, type FormEvent } from "react";
import { Campo, CampoSenha } from "@/componentes/formulario/Campo";
import formulario from "@/componentes/formulario/formulario.module.css";
import { ResumoErros } from "@/componentes/formulario/ResumoErros";
import { estadoInicial } from "@/lib/formulario";
import { MINIMO_SENHA } from "@/lib/validacao-conta";
import { cadastrar, type CampoCadastro } from "./acoes";
import estilos from "./acesso.module.css";

const CAMPOS = [
  { nome: "nome", rotulo: "Nome", id: "cadastro-nome" },
  { nome: "email", rotulo: "E-mail", id: "cadastro-email" },
  { nome: "senha", rotulo: "Senha", id: "cadastro-senha" },
] as const;

export function FormularioCadastro({ idTitulo }: { idTitulo: string }) {
  const [estado, enviar, enviando] = useActionState(cadastrar, estadoInicial<CampoCadastro>());

  // Mesmo motivo do FormularioEntrar: sem o reset automático, os campos certos continuam preenchidos
  function aoEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (enviando) return;
    const dados = new FormData(evento.currentTarget);
    startTransition(() => enviar(dados));
  }

  return (
    <form className={`${estilos.formulario} ${estilos.formularioCadastro}`} noValidate onSubmit={aoEnviar}>
      <div className={estilos.cabecalho}>
        <p className={estilos.area}>Área do pesquisador</p>
        <h2 id={idTitulo} className={estilos.titulo}>
          Criar conta
        </h2>
      </div>
      <ResumoErros envio={estado.envio} erros={estado.erros} campos={CAMPOS} />
      {/* Nome e e-mail lado a lado no computador: a janela inteira cabe na tela, mesmo com os erros */}
      <div className={estilos.linhaCampos}>
        <Campo
          id="cadastro-nome"
          name="nome"
          type="text"
          rotulo="Nome"
          autoComplete="name"
          erro={estado.erros?.nome}
          data-foco-inicial=""
        />
        <Campo
          id="cadastro-email"
          name="email"
          type="email"
          rotulo="E-mail"
          autoComplete="email"
          erro={estado.erros?.email}
        />
      </div>
      <CampoSenha
        id="cadastro-senha"
        name="senha"
        rotulo="Senha"
        ajuda={`Mínimo de ${MINIMO_SENHA} caracteres. Pode colar.`}
        autoComplete="new-password"
        erro={estado.erros?.senha}
      />
      <div className={estilos.rodapeFormulario}>
        <button type="submit" className={`${formulario.botao} ${formulario.primario}`}>
          <UserPlus size={18} strokeWidth={1.5} aria-hidden="true" className={formulario.icone} />
          <span>Criar conta</span>
        </button>
        <div className={estilos.ladoBotao}>
          <p className={estilos.alternativaLado}>
            Já tem conta? <Link href="/entrar">Entrar</Link>
          </p>
          {/* Em outra aba: a janela de cadastro fica como está, com o que a pessoa já digitou */}
          <p className={estilos.privacidade}>
            <a href="/privacidade" target="_blank" rel="noopener">
              Política de privacidade<span className="visualmente-oculto"> (abre em nova aba)</span>
            </a>
          </p>
        </div>
      </div>
    </form>
  );
}
