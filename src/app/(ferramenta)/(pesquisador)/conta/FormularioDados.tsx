"use client";

import { Save } from "lucide-react";
import { Campo } from "@/componentes/formulario/Campo";
import formulario from "@/componentes/formulario/formulario.module.css";
import { ResumoErros } from "@/componentes/formulario/ResumoErros";
import { useEnvioFormulario } from "@/componentes/formulario/useEnvioFormulario";
import { salvarDados } from "./acoes";
import estilos from "./conta.module.css";

const CAMPOS = [
  { nome: "nome", rotulo: "Nome", id: "conta-nome" },
  { nome: "email", rotulo: "E-mail", id: "conta-email" },
] as const;

type Propriedades = {
  nome: string;
  email: string;
  aoSalvar: (mensagem: string) => void;
};

export function FormularioDados({ nome, email, aoSalvar }: Propriedades) {
  const { estado, aoEnviar, limpar } = useEnvioFormulario(salvarDados, aoSalvar);

  return (
    <form className={estilos.secao} aria-labelledby="secao-dados" noValidate onSubmit={aoEnviar} onReset={limpar}>
      <div className={estilos.secaoTitulo}>
        <span className={estilos.secaoNumero}>01</span>
        <h2 id="secao-dados" className={estilos.secaoNome}>
          Dados cadastrais
        </h2>
      </div>
      <ResumoErros envio={estado.envio} erros={estado.erros} campos={CAMPOS} />
      <Campo
        id="conta-nome"
        name="nome"
        type="text"
        rotulo="Nome"
        ajuda="Aparece só para você, no topo do painel."
        autoComplete="name"
        defaultValue={nome}
        erro={estado.erros?.nome}
      />
      <Campo
        id="conta-email"
        name="email"
        type="email"
        rotulo="E-mail"
        ajuda="É o que você usa para entrar."
        autoComplete="email"
        defaultValue={email}
        erro={estado.erros?.email}
      />
      <div className={estilos.botoes}>
        <button type="submit" className={`${formulario.botao} ${formulario.primario}`}>
          <Save size={18} strokeWidth={1.5} aria-hidden="true" className={formulario.icone} />
          <span>Salvar alterações</span>
        </button>
        <button type="reset" className={`${formulario.botao} ${formulario.secundario}`}>
          <span>Descartar alterações</span>
        </button>
      </div>
    </form>
  );
}
