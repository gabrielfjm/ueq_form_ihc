"use client";

import { UserPlus } from "lucide-react";
import Link from "next/link";
import { startTransition, useActionState, type FormEvent } from "react";
import { Campo, CampoSenha } from "@/componentes/formulario/Campo";
import formulario from "@/componentes/formulario/formulario.module.css";
import { ResumoErros } from "@/componentes/formulario/ResumoErros";
import { estadoInicial } from "@/lib/formulario";
import { MINIMO_SENHA } from "@/lib/validacao-conta";
import { useRouter } from "next/navigation";
import { useT } from "@/traducao/cliente";
import { m, type OpcaoIdioma } from "@/traducao/nucleo";
import { cadastrar, trocarIdiomaDaInterface, type CampoCadastro } from "./acoes";
import estilos from "./acesso.module.css";
import { LinkPrivacidade } from "./LinkPrivacidade";

const CAMPOS = [
  { nome: "nome", rotulo: m("Nome"), id: "cadastro-nome" },
  { nome: "email", rotulo: m("E-mail"), id: "cadastro-email" },
  { nome: "senha", rotulo: m("Senha"), id: "cadastro-senha" },
] as const;

export function FormularioCadastro({
  idTitulo,
  idiomas,
  idiomaAtual,
}: {
  idTitulo: string;
  idiomas: OpcaoIdioma[];
  idiomaAtual: string;
}) {
  const t = useT();
  const router = useRouter();

  // Escolher o idioma já troca a janela e a página para ele; o que foi digitado continua nos campos
  function aoTrocarIdioma(idioma: string) {
    startTransition(async () => {
      await trocarIdiomaDaInterface(idioma);
      router.refresh();
    });
  }
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
        <p className={estilos.area}>{t("Área do pesquisador")}</p>
        <h2 id={idTitulo} className={estilos.titulo}>
          {t("Criar conta")}
        </h2>
      </div>
      <ResumoErros envio={estado.envio} erros={estado.erros} campos={CAMPOS} />
      {/* Nome e e-mail lado a lado no computador: a janela inteira cabe na tela, mesmo com os erros */}
      <div className={estilos.linhaCampos}>
        <Campo
          id="cadastro-nome"
          name="nome"
          type="text"
          rotulo={t("Nome")}
          autoComplete="name"
          erro={estado.erros?.nome}
          data-foco-inicial=""
        />
        <Campo
          id="cadastro-email"
          name="email"
          type="email"
          rotulo={t("E-mail")}
          autoComplete="email"
          erro={estado.erros?.email}
        />
      </div>
      <CampoSenha
        id="cadastro-senha"
        name="senha"
        rotulo={t("Senha")}
        ajuda={t("Mínimo de {MINIMO_SENHA} caracteres. Pode colar.", { MINIMO_SENHA: MINIMO_SENHA })}
        autoComplete="new-password"
        erro={estado.erros?.senha}
      />
      <div className={formulario.grupo}>
        <label htmlFor="cadastro-idioma" className={formulario.rotulo}>
          {t("Idioma da ferramenta")}
        </label>
        <p id="cadastro-idioma-ajuda" className={formulario.ajuda}>
          {t("A janela muda na hora. Dá para trocar depois, em Minha conta.")}
        </p>
        <select
          id="cadastro-idioma"
          name="idioma"
          className={formulario.campo}
          defaultValue={idiomaAtual}
          aria-describedby="cadastro-idioma-ajuda"
          onChange={(evento) => aoTrocarIdioma(evento.currentTarget.value)}
        >
          {idiomas.map((idioma) => (
            <option key={idioma.codigo} value={idioma.codigo} lang={idioma.lang}>
              {idioma.nome}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className={`${formulario.botao} ${formulario.primario} ${estilos.enviar}`}>
          <UserPlus size={18} strokeWidth={1.5} aria-hidden="true" className={formulario.icone} />
          <span>{t("Criar conta")}</span>
      </button>
      <p className={`${estilos.alternativa} ${estilos.alternativaCadastro}`}>
        <span>
          {t("Já tem conta?")}{" "}<Link href="/entrar">{t("Entrar")}</Link>
        </span>
        <LinkPrivacidade />
      </p>
    </form>
  );
}
