"use client";

import { Upload } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { useEffect, useRef, useState, useTransition, type FormEvent } from "react";
import formulario from "@/componentes/formulario/formulario.module.css";
import { ResumoErros } from "@/componentes/formulario/ResumoErros";
import { plural } from "@/lib/texto";
import { confirmarImportacao, previsualizarImportacao, type Previa, type ResultadoPrevia } from "./acoes";
import estilos from "./importar.module.css";
import { useT } from "@/traducao/cliente";
import { m } from "@/traducao/nucleo";

type Propriedades = { estudoId: string; versoes: { id: string; nome: string }[] };

const CAMPOS = [
  { nome: "versao", rotulo: m("Versão"), id: "importar-versao" },
  { nome: "arquivo", rotulo: m("Arquivo CSV"), id: "importar-arquivo" },
] as const;

const COLUNAS = Array.from({ length: 26 }, (_, posicao) => posicao + 1);

// Dois passos, como pede uma ação que grava muitas linhas de uma vez: ver antes, confirmar depois
// (Nielsen 5, prevenção de erros; Shneiderman 4, diálogo com fechamento)
export function FormularioImportacao({ estudoId, versoes }: Propriedades) {
  const t = useT();
  const [previa, setPrevia] = useState<Previa | null>(null);
  const [erro, setErro] = useState<ResultadoPrevia["erro"]>();
  const [erroGravar, setErroGravar] = useState("");
  const [envio, setEnvio] = useState(0);
  const [ocupado, iniciar] = useTransition();
  const tituloPrevia = useRef<HTMLHeadingElement>(null);

  // Ao abrir a prévia, o foco vai para o título dela: quem usa leitor de tela ouve o resultado da leitura
  useEffect(() => {
    if (previa) tituloPrevia.current?.focus();
  }, [previa]);

  function aoVerPrevia(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (ocupado) return;
    const dados = new FormData(evento.currentTarget);
    iniciar(async () => {
      const resultado = await previsualizarImportacao(estudoId, dados);
      setErro(resultado.erro);
      setPrevia(resultado.previa ?? null);
      setEnvio((atual) => atual + 1);
    });
  }

  function aoConfirmar() {
    if (!previa || ocupado) return;
    iniciar(async () => {
      const resultado = await confirmarImportacao(estudoId, previa.versaoId, previa.texto);
      if (resultado?.erro) setErroGravar(resultado.erro);
    });
  }

  function escolherOutro() {
    setPrevia(null);
    setErroGravar("");
  }

  if (!previa) {
    return (
      <form className={estilos.formulario} noValidate onSubmit={aoVerPrevia}>
        <ResumoErros
          envio={envio}
          campos={CAMPOS}
          erros={erro ? { [erro.campo]: { mensagem: erro.mensagem } } : undefined}
        />
        {versoes.length > 1 ? (
          <div className={formulario.grupo}>
            <label htmlFor="importar-versao" className={formulario.rotulo}>
              {t("Versão")}
            </label>
            <p id="importar-versao-ajuda" className={formulario.ajuda}>
              {t("Todas as linhas do arquivo entram nesta versão.")}
            </p>
            <select
              id="importar-versao"
              name="versao"
              defaultValue=""
              className={formulario.campo}
              aria-describedby="importar-versao-ajuda"
              aria-invalid={erro?.campo === "versao" || undefined}
            >
              <option value="" disabled>
                {t("Escolha a versão")}
              </option>
              {versoes.map((versao) => (
                <option key={versao.id} value={versao.id}>
                  {t(versao.nome)}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <p className={estilos.versaoUnica}>
            {t("As respostas entram na versão")}{" "}<strong>{versoes[0]?.nome}</strong>.
          </p>
        )}
        <div className={formulario.grupo}>
          <label htmlFor="importar-arquivo" className={formulario.rotulo}>
            {t("Arquivo CSV")}
          </label>
          <p id="importar-arquivo-ajuda" className={formulario.ajuda}>
            {t("Uma pessoa por linha, com os 26 valores de 1 a 7 na ordem oficial e sem cabeçalho. Separados por ponto e vírgula, vírgula ou tabulação. Até 5000 linhas.")}
          </p>
          {erro?.campo === "arquivo" && (
            <p id="importar-arquivo-erro" className={formulario.erro}>
              {t(erro.mensagem)}
            </p>
          )}
          <input
            id="importar-arquivo"
            name="arquivo"
            type="file"
            accept=".csv,.txt,text/csv,text/plain"
            className={estilos.arquivo}
            aria-describedby={erro?.campo === "arquivo" ? "importar-arquivo-ajuda importar-arquivo-erro" : "importar-arquivo-ajuda"}
            aria-invalid={erro?.campo === "arquivo" || undefined}
          />
        </div>
        <div className={estilos.botoes}>
          <button type="submit" className={`${formulario.botao} ${formulario.primario}`} disabled={ocupado}>
            <Upload size={18} strokeWidth={1.5} aria-hidden="true" />
            <span>{ocupado ? "Lendo o arquivo…" : t("Ver prévia")}</span>
          </button>
          <Link href={`/estudos/${estudoId}/respostas` as Route} className={formulario.linkAcao}>
            {t("Voltar para Respostas")}
          </Link>
        </div>
      </form>
    );
  }

  const comErros = previa.erros.length > 0;
  return (
    <section aria-labelledby="titulo-previa" className={estilos.previa}>
      <h3 id="titulo-previa" ref={tituloPrevia} tabIndex={-1} className={estilos.tituloPrevia}>
        {comErros
          ? t("{quantidade} com problema em {arquivo}", { quantidade: plural(previa.erros.length, t("linha"), t("linhas")), arquivo: previa.arquivo })
          : t("{quantidade} para importar", { quantidade: plural(previa.total, t("resposta pronta"), t("respostas prontas")) })}
      </h3>

      {comErros ? (
        <>
          <p>{t("Nada foi importado. Corrija estas linhas no arquivo e envie de novo; as outras estão certas.")}</p>
          <div className={estilos.rolagem} tabIndex={0} role="region" aria-labelledby="titulo-previa">
            <table className={estilos.tabela}>
              <thead>
                <tr>
                  <th scope="col">{t("Linha")}</th>
                  <th scope="col">{t("Problema")}</th>
                </tr>
              </thead>
              <tbody>
                {previa.erros.map((problema) => (
                  <tr key={problema.linha}>
                    <th scope="row" className={estilos.numero}>
                      {problema.linha}
                    </th>
                    <td>{t(problema.mensagem)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          <p>
            {t("Do arquivo {arquivo}, na versão", { arquivo: previa.arquivo })}{" "}<strong>{t(previa.versaoNome)}</strong>{t(". Confira as {v}: cada coluna é um item, de 1 a 7. As respostas entram marcadas como importadas, na análise e com a mesma regra de suspeita das respostas pelo link.", { v: previa.primeiras.length === 1 ? "primeira linha" : `${previa.primeiras.length} primeiras linhas` })}
          </p>
          <div className={estilos.rolagem} tabIndex={0} role="region" aria-labelledby="legenda-previa">
            <table className={`${estilos.tabela} ${estilos.tabelaValores}`}>
              <caption id="legenda-previa">{t("Primeiras linhas do arquivo")}</caption>
              <thead>
                <tr>
                  <th scope="col">{t("Linha")}</th>
                  {COLUNAS.map((numero) => (
                    <th key={numero} scope="col" className={estilos.numero}>
                      <span className="visualmente-oculto">{t("Item")}{" "}</span>
                      {numero}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previa.primeiras.map((linha) => (
                  <tr key={linha.linha}>
                    <th scope="row" className={estilos.numero}>
                      {linha.linha}
                    </th>
                    {linha.valores.map((valor, posicao) => (
                      <td key={posicao} className={estilos.numero}>
                        {valor}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {erroGravar && (
            <p role="alert" className={formulario.erro}>
              {t(erroGravar)}
            </p>
          )}
        </>
      )}

      <div className={estilos.botoes}>
        {!comErros && (
          <button type="button" className={`${formulario.botao} ${formulario.primario}`} onClick={aoConfirmar} disabled={ocupado}>
            {ocupado ? t("Importando…") : `Importar ${plural(previa.total, t("resposta"), t("respostas"))}`}
          </button>
        )}
        <button type="button" className={`${formulario.botao} ${formulario.secundario}`} onClick={escolherOutro}>
          {t("Escolher outro arquivo")}
        </button>
      </div>
    </section>
  );
}
