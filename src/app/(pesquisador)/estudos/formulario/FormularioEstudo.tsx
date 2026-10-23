"use client";

import { Plus, Save } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { useRef, useState } from "react";
import { AreaTexto, Campo } from "@/componentes/formulario/Campo";
import formulario from "@/componentes/formulario/formulario.module.css";
import { ResumoErros } from "@/componentes/formulario/ResumoErros";
import { useEnvioFormulario } from "@/componentes/formulario/useEnvioFormulario";
import { criarEstudo, salvarEstudo } from "../acoes";
import estilos from "./formulario-estudo.module.css";
import { idDoCampoVersao, ListaVersoes, type VersaoEditavel } from "./ListaVersoes";
import { PreviaParticipante } from "./PreviaParticipante";

export type ValoresEstudo = {
  titulo: string;
  produtoAvaliado: string;
  objetivo: string;
  dataInicio: string;
  dataFim: string;
  versoes: Omit<VersaoEditavel, "chave">[];
};

type Propriedades = { valores: ValoresEstudo } & ({ modo: "criar" } | { modo: "editar"; estudoId: string });

const CAMPOS_FIXOS = [
  { nome: "titulo", rotulo: "Título do estudo", id: "estudo-titulo" },
  { nome: "produtoAvaliado", rotulo: "Produto avaliado", id: "estudo-produto" },
  { nome: "objetivo", rotulo: "Objetivo", id: "estudo-objetivo" },
  { nome: "dataInicio", rotulo: "Data de início", id: "estudo-inicio" },
  { nome: "dataFim", rotulo: "Data de fim", id: "estudo-fim" },
];

export function FormularioEstudo(propriedades: Propriedades) {
  const { valores, modo } = propriedades;
  const acao = propriedades.modo === "criar" ? criarEstudo : salvarEstudo.bind(null, propriedades.estudoId);
  const { estado, aoEnviar } = useEnvioFormulario(acao);

  const proximaChave = useRef(valores.versoes.length);
  const [titulo, setTitulo] = useState(valores.titulo);
  const [objetivo, setObjetivo] = useState(valores.objetivo);
  const [versoes, setVersoes] = useState<VersaoEditavel[]>(() =>
    (valores.versoes.length > 0 ? valores.versoes : [{ id: "", nome: "", respostas: 0 }]).map((versao, posicao) => ({
      ...versao,
      chave: String(posicao),
    })),
  );
  // WCAG 3.3.7: o produto avaliado vira o nome da primeira versão até a pessoa trocar
  const [sugerindo, setSugerindo] = useState(modo === "criar");

  function mudarProduto(produto: string) {
    if (sugerindo) setVersoes((atuais) => atuais.map((versao, posicao) => (posicao === 0 ? { ...versao, nome: produto } : versao)));
  }

  function mudarNomeVersao(chave: string, nome: string) {
    if (chave === versoes[0]?.chave) setSugerindo(false);
    setVersoes((atuais) => atuais.map((versao) => (versao.chave === chave ? { ...versao, nome } : versao)));
  }

  function adicionarVersao(): string {
    const chave = `nova-${proximaChave.current++}`;
    setVersoes((atuais) => [...atuais, { chave, id: "", nome: "", respostas: 0 }]);
    return chave;
  }

  const campos = [
    ...CAMPOS_FIXOS,
    ...versoes.map((versao, posicao) => ({
      nome: `versao-${posicao + 1}`,
      rotulo: `Versão ${posicao + 1}`,
      id: idDoCampoVersao(versao.chave),
    })),
  ];
  const cancelar = (propriedades.modo === "criar" ? "/estudos" : `/estudos/${propriedades.estudoId}`) as Route;

  return (
    <div className={estilos.pagina}>
      <form className={estilos.formulario} noValidate onSubmit={aoEnviar}>
        <ResumoErros
          envio={estado.envio}
          erros={estado.erros}
          erroGeral={estado.erroGeral}
          campos={campos}
          tituloErroGeral="Não deu para salvar"
        />
        <section aria-labelledby="secao-sobre" className={`${estilos.secao} ${estilos.secaoPrimeira}`}>
          <div className={estilos.secaoTitulo}>
            <span className={estilos.secaoNumero}>01</span>
            <h2 id="secao-sobre" className={estilos.secaoNome}>Sobre o estudo</h2>
          </div>
          <Campo
            id="estudo-titulo"
            name="titulo"
            rotulo="Título do estudo"
            value={titulo}
            onChange={(evento) => setTitulo(evento.target.value)}
            erro={estado.erros?.titulo}
          />
          <Campo
            id="estudo-produto"
            name="produtoAvaliado"
            rotulo="Produto avaliado"
            ajuda="Aparece para o participante no topo do questionário."
            defaultValue={valores.produtoAvaliado}
            onChange={(evento) => mudarProduto(evento.target.value)}
            erro={estado.erros?.produtoAvaliado}
          />
          <AreaTexto
            id="estudo-objetivo"
            name="objetivo"
            rotulo="Objetivo"
            ajuda="Aparece no termo de consentimento. Escreva para o participante, em linguagem simples."
            rows={4}
            value={objetivo}
            onChange={(evento) => setObjetivo(evento.target.value)}
            erro={estado.erros?.objetivo}
          />
        </section>

        <section aria-labelledby="secao-periodo" className={estilos.secao}>
          <div className={estilos.secaoTitulo}>
            <span className={estilos.secaoNumero}>02</span>
            <h2 id="secao-periodo" className={estilos.secaoNome}>Período da coleta</h2>
          </div>
          <div className={estilos.datas}>
            <Campo id="estudo-inicio" name="dataInicio" type="date" rotulo="Data de início" defaultValue={valores.dataInicio} erro={estado.erros?.dataInicio} />
            <Campo id="estudo-fim" name="dataFim" type="date" rotulo="Data de fim" defaultValue={valores.dataFim} erro={estado.erros?.dataFim} />
          </div>
          <p className={formulario.ajuda}>
            A coleta só começa quando você clicar em “Abrir coleta”. As datas servem de referência no painel.
          </p>
        </section>

        <section aria-labelledby="secao-versoes" className={estilos.secao}>
          <div className={estilos.secaoTitulo}>
            <span className={estilos.secaoNumero}>03</span>
            <h2 id="secao-versoes" className={estilos.secaoNome}>Versões</h2>
          </div>
          <p className={formulario.ajuda}>
            Cada participante responde sobre uma versão, e a ferramenta distribui as pessoas para equilibrar as respostas.
            Com uma versão só, o painel não mostra comparação.
          </p>
          <ListaVersoes
            versoes={versoes}
            sugerida={sugerindo && Boolean(versoes[0]?.nome)}
            erros={estado.erros}
            aoMudarNome={mudarNomeVersao}
            aoAdicionar={adicionarVersao}
            aoRemover={(chave) => setVersoes((atuais) => atuais.filter((versao) => versao.chave !== chave))}
          />
        </section>

        <div className={estilos.rodape}>
          <button type="submit" className={`${formulario.botao} ${formulario.primario} ${estilos.enviar}`}>
            {modo === "criar" ? <Plus size={18} strokeWidth={1.5} aria-hidden="true" /> : <Save size={18} strokeWidth={1.5} aria-hidden="true" />}
            <span>{modo === "criar" ? "Criar estudo" : "Salvar alterações"}</span>
          </button>
          <Link href={cancelar}>Cancelar</Link>
        </div>
      </form>
      <PreviaParticipante titulo={titulo} objetivo={objetivo} />
    </div>
  );
}
