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
import type { Instrumento } from "@/lib/instrumento";
import { useT } from "@/traducao/cliente";
import { m, type OpcaoIdioma } from "@/traducao/nucleo";
import { BotaoEnvio } from "@/componentes/formulario/BotaoEnvio";

export type ValoresEstudo = {
  titulo: string;
  produtoAvaliado: string;
  objetivo: string;
  responsavelNome: string;
  responsavelEmail: string;
  instituicao: string;
  riscos: string;
  beneficios: string;
  comiteEtica: string;
  dataInicio: string;
  dataFim: string;
  coletarDemografia: boolean;
  instrumento: Instrumento;
  idioma: string;
  versoes: Omit<VersaoEditavel, "chave">[];
};

// instrumentoTravado: o estudo já tem respostas, e o questionário não pode mais mudar
type Propriedades = { valores: ValoresEstudo; idiomas: OpcaoIdioma[]; instrumentoTravado?: boolean } & ({ modo: "criar" } | { modo: "editar"; estudoId: string });

const CAMPOS_FIXOS = [
  { nome: "titulo", rotulo: m("Título do estudo"), id: "estudo-titulo" },
  { nome: "produtoAvaliado", rotulo: m("Produto avaliado"), id: "estudo-produto" },
  { nome: "objetivo", rotulo: m("Objetivo"), id: "estudo-objetivo" },
  { nome: "instrumento", rotulo: m("Questionário"), id: "estudo-instrumento-UEQ" },
  { nome: "responsavelNome", rotulo: m("Nome do responsável"), id: "estudo-responsavel" },
  { nome: "responsavelEmail", rotulo: m("E-mail de contato"), id: "estudo-contato" },
  { nome: "instituicao", rotulo: m("Instituição"), id: "estudo-instituicao" },
  { nome: "riscos", rotulo: m("Riscos para o participante"), id: "estudo-riscos" },
  { nome: "beneficios", rotulo: m("Benefícios"), id: "estudo-beneficios" },
  { nome: "comiteEtica", rotulo: m("Comitê de ética (opcional)"), id: "estudo-comite" },
  { nome: "dataInicio", rotulo: m("Data de início"), id: "estudo-inicio" },
  { nome: "dataFim", rotulo: m("Data de fim"), id: "estudo-fim" },
];

// O que cada forma do UEQ mede e quanto tempo leva (Handbook UEQ, p. 11-13)
const OPCOES_INSTRUMENTO: readonly { valor: Instrumento; nome: string; resumo: string; texto: string }[] = [
  {
    valor: "UEQ",
    nome: m("UEQ completo"),
    resumo: m("26 pares de palavras · de 3 a 5 minutos"),
    texto: m("Mede as 6 escalas (Atratividade, Perspicuidade, Eficiência, Confiabilidade, Estimulação e Novidade) e, a partir delas, as qualidades pragmática e hedônica. É o recomendado para a maioria dos estudos, como depois de um teste de usabilidade."),
  },
  {
    valor: "UEQ_S",
    nome: m("UEQ-S, versão curta"),
    resumo: m("8 pares de palavras · de 1 a 2 minutos"),
    texto: m("Mede só a qualidade pragmática, a qualidade hedônica e uma nota geral, sem as 6 escalas. Serve para quando o completo não cabe: pouco tempo, o UEQ dentro de um questionário maior ou a mesma pessoa avaliando vários produtos seguidos."),
  },
];

export function FormularioEstudo(propriedades: Propriedades) {
  const t = useT();
  const { valores, modo } = propriedades;
  const acao = propriedades.modo === "criar" ? criarEstudo : salvarEstudo.bind(null, propriedades.estudoId);
  const { estado, enviando, aoEnviar } = useEnvioFormulario(acao);

  const proximaChave = useRef(valores.versoes.length);
  const [titulo, setTitulo] = useState(valores.titulo);
  const [objetivo, setObjetivo] = useState(valores.objetivo);
  const [responsavel, setResponsavel] = useState(valores.responsavelNome);
  const [instituicao, setInstituicao] = useState(valores.instituicao);
  const [demografia, setDemografia] = useState(valores.coletarDemografia);
  const [instrumento, setInstrumento] = useState<Instrumento>(valores.instrumento);
  const travado = propriedades.instrumentoTravado ?? false;
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

        {/* UEQ-S (RF62). Handbook UEQ, p. 12-13: a versão curta é para quando o completo não cabe; a escolha
            explica o que cada um mede e o que muda no estudo (Nielsen 10), antes de o pesquisador decidir */}
        <section aria-labelledby="secao-questionario" className={estilos.secao}>
          <div className={estilos.secaoTitulo}>
            <span className={estilos.secaoNumero}>02</span>
            <h2 id="secao-questionario" className={estilos.secaoNome}>{t("Questionário")}</h2>
          </div>
          <p className={formulario.ajuda}>
            {t("O UEQ tem duas formas. As duas usam os mesmos pares de palavras opostas e a mesma escala de 7 posições; a versão curta usa só 8 dos 26 pares.")}
          </p>
          <fieldset
            className={estilos.instrumentos}
            aria-describedby={estado.erros?.instrumento ? "estudo-instrumento-erro instrumento-impacto" : "instrumento-impacto"}
            disabled={travado}
          >
            <legend className="visualmente-oculto">{t("Questionário do estudo")}</legend>
            {OPCOES_INSTRUMENTO.map((opcao) => (
              <label key={opcao.valor} className={estilos.instrumento}>
                <input
                  type="radio"
                  id={`estudo-instrumento-${opcao.valor}`}
                  name="instrumento"
                  value={opcao.valor}
                  checked={instrumento === opcao.valor}
                  onChange={() => setInstrumento(opcao.valor)}
                />
                <span className={estilos.instrumentoCorpo}>
                  <span className={estilos.instrumentoNome}>{t(opcao.nome)}</span>
                  <span className={estilos.instrumentoResumo}>{t(opcao.resumo)}</span>
                  <span className={estilos.instrumentoTexto}>{t(opcao.texto)}</span>
                </span>
              </label>
            ))}
          </fieldset>
          {/* fieldset desligado não manda o valor: o atual vai escondido */}
          {travado && <input type="hidden" name="instrumento" value={instrumento} />}
          {estado.erros?.instrumento && (
            <p id="estudo-instrumento-erro" className={formulario.erro}>
              {t(estado.erros.instrumento.mensagem)}
            </p>
          )}
          <div id="instrumento-impacto" className={estilos.lgpd}>
            <p>
              <strong>{t("O que muda com a escolha:")}</strong>{" "}{t("o questionário que o participante responde, o tempo informado no termo, o painel de resultados e a planilha oficial que você exporta. O UEQ-S não tem as 6 escalas: só qualidade pragmática, qualidade hedônica e uma nota geral.")}
            </p>
            <p>
              {t("Num estudo do UEQ completo, os resultados também mostram o UEQ-S, numa aba própria, calculado com os 8 pares dele.")}
            </p>
            <p>
              {travado
                ? t("O estudo já tem respostas, então o questionário não pode mais mudar. Para usar o outro, crie um estudo novo.")
                : t("Depois da primeira resposta a escolha trava, para o estudo não misturar os dois questionários.")}{" "}
              <Link href={"/#ueq-e-ueq-s" as Route}>{t("Ver a diferença entre o UEQ e o UEQ-S")}</Link>
            </p>
          </div>
        </section>

        {/* LGPD, art. 9º: o participante precisa saber quem responde pela pesquisa e como falar com essa pessoa */}
        <section aria-labelledby="secao-responsavel" className={estilos.secao}>
          <div className={estilos.secaoTitulo}>
            <span className={estilos.secaoNumero}>03</span>
            <h2 id="secao-responsavel" className={estilos.secaoNome}>{t("Responsável pela pesquisa")}</h2>
          </div>
          <p className={formulario.ajuda}>
            {t("Aparece no termo de consentimento: o participante precisa saber quem responde pela pesquisa e como falar com essa pessoa (LGPD, art. 9º).")}
          </p>
          <Campo
            id="estudo-responsavel"
            name="responsavelNome"
            rotulo={t("Nome do responsável")}
            autoComplete="name"
            value={responsavel}
            onChange={(evento) => setResponsavel(evento.target.value)}
            erro={estado.erros?.responsavelNome}
          />
          <Campo
            id="estudo-contato"
            name="responsavelEmail"
            type="email"
            rotulo={t("E-mail de contato")}
            autoComplete="email"
            defaultValue={valores.responsavelEmail}
            erro={estado.erros?.responsavelEmail}
          />
          <Campo
            id="estudo-instituicao"
            name="instituicao"
            rotulo={t("Instituição")}
            ajuda={t("Por exemplo: PPGIa · PUCPR.")}
            autoComplete="organization"
            value={instituicao}
            onChange={(evento) => setInstituicao(evento.target.value)}
            erro={estado.erros?.instituicao}
          />
        </section>

        {/* Resolução CNS 510/2016: o termo informa riscos, benefícios e, quando houver, o comitê de ética */}
        <section aria-labelledby="secao-etica" className={estilos.secao}>
          <div className={estilos.secaoTitulo}>
            <span className={estilos.secaoNumero}>04</span>
            <h2 id="secao-etica" className={estilos.secaoNome}>{t("Riscos e benefícios")}</h2>
          </div>
          <p className={formulario.ajuda}>
            {t("Aparecem no termo de consentimento. A ferramenta sugere um texto: ajuste ao que o seu estudo pede.")}
          </p>
          <AreaTexto
            id="estudo-riscos"
            name="riscos"
            rotulo={t("Riscos para o participante")}
            rows={3}
            defaultValue={valores.riscos}
            erro={estado.erros?.riscos}
          />
          <AreaTexto
            id="estudo-beneficios"
            name="beneficios"
            rotulo={t("Benefícios")}
            rows={3}
            defaultValue={valores.beneficios}
            erro={estado.erros?.beneficios}
          />
          <AreaTexto
            id="estudo-comite"
            name="comiteEtica"
            rotulo={t("Comitê de ética (opcional)")}
            ajuda={t("Se o estudo foi aprovado por um comitê de ética, informe o nome do comitê, o número do parecer ou CAAE e o contato.")}
            rows={2}
            defaultValue={valores.comiteEtica}
            erro={estado.erros?.comiteEtica}
          />
        </section>

        <section aria-labelledby="secao-periodo" className={estilos.secao}>
          <div className={estilos.secaoTitulo}>
            <span className={estilos.secaoNumero}>05</span>
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
            <span className={estilos.secaoNumero}>06</span>
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
            <span className={estilos.secaoNumero}>07</span>
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
          <BotaoEnvio
            enviando={enviando}
            textoEnviando={modo === "criar" ? t("Criando o estudo…") : t("Salvando…")}
            icone={modo === "criar" ? <Plus size={18} strokeWidth={1.5} aria-hidden="true" /> : <Save size={18} strokeWidth={1.5} aria-hidden="true" />}
            className={`${formulario.botao} ${formulario.primario} ${estilos.enviar}`}
          >
            {modo === "criar" ? t("Criar estudo") : t("Salvar alterações")}
          </BotaoEnvio>
          <Link href={cancelar}>{t("Cancelar")}</Link>
        </div>
      </form>
      <PreviaParticipante
        titulo={titulo}
        objetivo={objetivo}
        etapas={demografia ? 3 : 2}
        curto={instrumento === "UEQ_S"}
        responsavel={responsavel}
        instituicao={instituicao}
      />
    </div>
  );
}
