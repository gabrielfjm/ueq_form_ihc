import { Download, ExternalLink } from "lucide-react";
import { posix } from "node:path";
import { REPOSITORIO, type Documento } from "@/lib/documentacao/catalogo";
import type { Titulo } from "@/lib/documentacao/markdown";
import estilos from "./documentacao.module.css";
import { tradutor } from "@/traducao/servidor";

// Protótipo r10 a r12: a ficha explica o documento antes de a pessoa ler (Nielsen 10) e "Nesta página"
// lista as seções para reconhecer em vez de lembrar (Nielsen 6)
type Propriedades = {
  documento: Documento;
  secoes: readonly Titulo[];
  // em produção, a ficha diz o que o documento vai ser, sem arquivo, downloads nem índice
  pronto: boolean;
};

export async function FichaDocumento({ documento, secoes, pronto }: Propriedades) {
  const t = await tradutor();
  return (
    <aside aria-labelledby="titulo-sobre" className={estilos.ficha}>
      <h2 id="titulo-sobre" className={estilos.fichaTitulo}>
        {t("Sobre este documento")}
      </h2>
      <dl className={estilos.fichaLista}>
        <div>
          <dt>{t("O que é")}</dt>
          <dd>{t(documento.oQueE)}</dd>
        </div>
        <div>
          <dt>{t("Para que serve")}</dt>
          <dd>{t(documento.paraQueServe)}</dd>
        </div>
        <div>
          <dt>{t("Quem deve ler")}</dt>
          <dd>{t(documento.quemDeveLer)}</dd>
        </div>
        {!pronto && (
          <div>
            <dt>{t("Situação")}</dt>
            <dd className={estilos.situacao}>
              <span className={estilos.pontoProducao} aria-hidden="true" />
              {t("Em produção")}
            </dd>
          </div>
        )}
        {pronto && (
          <div>
            <dt>{t("Arquivo")}</dt>
            <dd className={estilos.arquivo}>{t(documento.arquivo)}</dd>
            <dd>
              <a className={estilos.acao} href={`${REPOSITORIO}/blob/main/${documento.arquivo}`} rel="noreferrer">
                <ExternalLink size={18} strokeWidth={1.5} aria-hidden="true" />
                <span>{t("Ver no GitHub")}</span>
              </a>
            </dd>
          </div>
        )}
        {pronto && documento.downloads && (
          <div>
            <dt>{t("Baixar")}</dt>
            {documento.downloads.map((download) => (
              <dd key={download.arquivo}>
                <a className={estilos.acao} href={`/api/documentacao/${posix.basename(download.arquivo)}`} download>
                  <Download size={18} strokeWidth={1.5} aria-hidden="true" />
                  <span>{t(download.rotulo)}</span>
                </a>
              </dd>
            ))}
          </div>
        )}
        {secoes.length > 0 && (
          <div>
            <dt>{t("Nesta página")}</dt>
            <dd>
              <ul className={estilos.indice}>
                {secoes.map((secao) => (
                  <li key={secao.id}>
                    <a href={`#${secao.id}`}>{t(secao.texto)}</a>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        )}
      </dl>
    </aside>
  );
}
