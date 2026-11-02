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
import { useT } from "@/traducao/cliente";
import { m, type OpcaoIdioma } from "@/traducao/nucleo";

export type ValoresEstudo = {
  titulo: string;
  produtoAvaliado: string;
  objetivo: string;
  dataInicio: string;
  dataFim: string;
  coletarDemografia: boolean;
  idioma: string;
  versoes: Omit<VersaoEditavel, "chave">[];
};

type Propriedades = { valores: ValoresEstudo; idiomas: OpcaoIdioma[] } & ({ modo: "criar" } | { modo: "editar"; estudoId: string });

const CAMPOS_FIXOS = [
  { nome: "titulo", rotulo: m("Título do estudo"), id: "estudo-titulo" },
  { nome: "produtoAvaliado", rotulo: m("Produto avaliado"), id: "estudo-produto" },
  { nome: "objetivo", rotulo: m("Objetivo"), id: "estudo-objetivo" },
  { nome: "dataInicio", rotulo: m("Data de início"), id: "estudo-inicio" },
  { nome: "dataFim", rotulo: m("Data de fim"), id: "estudo-fim" },
];

export function FormularioEstudo(propriedades: Propriedades) {
  const t = useT();
  const { valores, modo } = propriedades;
  const acao = propriedades.modo === "criar" ? criarEstudo : salvarEstudo.bind(null, propriedades.estudoId);
  const { estado, aoEnviar } = useEnvioFormulario(acao);

  const proximaChave = useRef(valores.versoes.length);
  const [titulo, setTitulo] = useState(valores.titulo);
  const [objetivo, setObjetivo] = useState(valores.objetivo);
  const [demografia, setDemografia] = useState(valores.coletarDemografia);
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
      rotulo: t("Versão {v}", { v: posicao + 1 }),
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
          tituloErroGeral={t("Não deu para salvar")}
        />
        <section aria-labelledby="secao-sobre" className={`${estilos.secao} ${estilos.secaoPrimeira}`}>
          <div className={estilos.secaoTitulo}>
            <span className={estilos.secaoNumero}>01</span>
            <h2 id="secao-sobre" className={estilos.secaoNome}>{t("Sobre o estudo")}</h2>
          </div>
          <Campo
            id="estudo-titulo"
            name="titulo"
            rotulo={t("Título do estudo")}
            value={titulo}
            onChange={(evento) => setTitulo(evento.target.value)}
            erro={estado.erros?.titulo}
          />
          <Campo
            id="estudo-produto"
            name="produtoAvaliado"
            rotulo={t("Produto avaliado")}
            ajuda={t("Aparece para o participante no topo do questionário.")}
            defaultValue={valores.produtoAvaliado}
            onChange={(evento) => mudarProduto(evento.target.value)}
            erro={estado.erros?.produtoAvaliado}
          />
          <AreaTexto
            id="estudo-objetivo"
            name="objetivo"
            rotulo={t("Objetivo")}
            ajuda={t("Aparece no termo de consentimento. Escreva para o participante, em linguagem simples.")}
            rows={4}
            value={objetivo}
            onChange={(evento) => setObjetivo(evento.target.value)}
            erro={estado.erros?.objetivo}
          />
          <div className={formulario.grupo}>
            <label htmlFor="estudo-idioma" className={formulario.rotulo}>
              {t("Idioma do questionário")}
            </label>
            <p id="estudo-idioma-ajuda" className={formulario.ajuda}>
              {t("O link abre neste idioma e o participante pode trocar a qualquer momento. Título, produto e objetivo são traduzidos automaticamente para o idioma que ele escolher.")}
            </p>
            <select
              id="estudo-idioma"
              name="idioma"
              className={formulario.campo}
              defaultValue={valores.idioma}
              aria-describedby="estudo-idioma-ajuda"
            >
              {propriedades.idiomas.map((idioma) => (
                <option key={idioma.codigo} value={idioma.codigo} lang={idioma.lang}>
                  {idioma.nome}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section aria-labelledby="secao-periodo" className={estilos.secao}>
          <div className={estilos.secaoTitulo}>
            <span className={estilos.secaoNumero}>02</span>
            <h2 id="secao-periodo" className={estilos.secaoNome}>{t("Período da coleta")}</h2>
          </div>
          <div className={estilos.datas}>
            <Campo id="estudo-inicio" name="dataInicio" type="date" rotulo={t("Data de início")} defaultValue={valores.dataInicio} erro={estado.erros?.dataInicio} />
            <Campo id="estudo-fim" name="dataFim" type="date" rotulo={t("Data de fim")} defaultValue={valores.dataFim} erro={estado.erros?.dataFim} />
          </div>
          <p className={formulario.ajuda}>
            {t("A coleta só começa quando você clicar em “Abrir coleta”. As datas servem de referência no painel.")}
          </p>
        </section>

        <section aria-labelledby="secao-versoes" className={estilos.secao}>
          <div className={estilos.secaoTitulo}>
            <span className={estilos.secaoNumero}>03</span>
            <h2 id="secao-versoes" className={estilos.secaoNome}>{t("Versões")}</h2>
          </div>
          <p className={formulario.ajuda}>
            {t("Cada participante responde sobre uma versão, e a ferramenta distribui as pessoas para equilibrar as respostas. Com uma versão só, o painel não mostra comparação.")}
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

        {/* LGPD (Lei 13.709/2018), art. 6º, III: só coletar o que a pesquisa precisa. Por isso nasce desligado */}
        <section aria-labelledby="secao-demografia" className={estilos.secao}>
          <div className={estilos.secaoTitulo}>
            <span className={estilos.secaoNumero}>04</span>
            <h2 id="secao-demografia" className={estilos.secaoNome}>{t("Dados do participante")}</h2>
          </div>
          <label className={formulario.opcao}>
            <input
              type="checkbox"
              name="coletarDemografia"
              value="sim"
              checked={demografia}
              onChange={(evento) => setDemografia(evento.target.checked)}
              aria-describedby="demografia-lgpd"
            />
            <span>{t("Coletar dados demográficos no fim do questionário")}</span>
          </label>
          <div id="demografia-lgpd" className={estilos.lgpd}>
            <p>
              {t("Ligado, o participante vê no fim a etapa opcional “Dados opcionais”, com faixa etária, gênero, escolaridade e familiaridade com o produto. Ele pode responder ou pular a etapa e ir direto para o agradecimento.")}
            </p>
            <p>
              <strong>{t("LGPD:")}</strong>{" "}{t("ligue só se o objetivo do estudo precisar desses dados (princípio da necessidade). As perguntas usam faixas fechadas, todas têm “Prefiro não responder”, e nada identifica a pessoa: sem nome, e-mail ou IP. Os dados ficam só com a equipe do estudo, saem nas exportações e são apagados junto com o estudo.")}
            </p>
            <p>{t("Desligado, a participação termina no envio do questionário.")}</p>
          </div>
        </section>

        <div className={estilos.rodape}>
          <button type="submit" className={`${formulario.botao} ${formulario.primario} ${estilos.enviar}`}>
            {modo === "criar" ? <Plus size={18} strokeWidth={1.5} aria-hidden="true" /> : <Save size={18} strokeWidth={1.5} aria-hidden="true" />}
            <span>{modo === "criar" ? t("Criar estudo") : t("Salvar alterações")}</span>
          </button>
          <Link href={cancelar}>{t("Cancelar")}</Link>
        </div>
      </form>
      <PreviaParticipante titulo={titulo} objetivo={objetivo} etapas={demografia ? 3 : 2} />
    </div>
  );
}
