import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { enderecoDoDocumento, secaoDoDocumento, type Documento } from "@/lib/documentacao/catalogo";
import { enderecoDaPagina, type PaginaLida } from "@/lib/documentacao/paginas";
import { tradutor } from "@/traducao/servidor";
import { ArtigoDocumento } from "./ArtigoDocumento";
import { ListaPaginas } from "./ListaPaginas";
import estilos from "./documentacao.module.css";
import { RegistroDeVisita, VoltarDocumento } from "./NavegacaoDocumento";
import texto from "./texto.module.css";

// Uma seção por página: faixa curta com Voltar e onde a pessoa está, o conteúdo logo abaixo, com o diagrama
// em destaque, e Anterior e Próxima no fim. Menos rolagem e o caminho de volta sempre à mão (Nielsen 3 e 7)
export async function PaginaSecao({ documento, lida }: { documento: Documento; lida: PaginaLida }) {
  const t = await tradutor();
  const area = secaoDoDocumento(documento);
  const { pagina, secao, parte, partes, html, posicao, total, anterior, proxima, pai, tituloDocumento } = lida;
  return (
    <>
      <RegistroDeVisita />
      <div className={estilos.faixaPagina}>
        <div className={estilos.faixaPaginaInterna}>
          <div className={estilos.faixaPaginaLinha}>
            <VoltarDocumento pai={pai.endereco} />
            <p className={estilos.migalha}>
              <Link href="/documentacao">{t("Documentação")}</Link> <span aria-hidden="true">›</span> {t(area.titulo)}{" "}
              <span aria-hidden="true">›</span> <Link href={enderecoDoDocumento(documento) as Route}>{tituloDocumento}</Link>
              {parte && (
                <>
                  {" "}
                  <span aria-hidden="true">›</span> <Link href={enderecoDaPagina(documento, secao.slug) as Route}>{secao.titulo}</Link>
                </>
              )}
            </p>
          </div>
          <div className={estilos.faixaPaginaTitulo}>
            <h1 className={estilos.tituloPagina}>{pagina.titulo}</h1>
            <p className={estilos.posicao}>{t("{posicao} de {total}", { posicao, total })}</p>
          </div>
        </div>
      </div>
      <div className={estilos.corpoPagina}>
        {html.trim() && <ArtigoDocumento className={`${texto.texto} ${texto.destaque}`} html={html} />}
        {partes.length > 0 && (
          <ListaPaginas
            t={t}
            titulo={t("Nesta seção")}
            paginas={partes}
            endereco={(alvo) => enderecoDaPagina(documento, secao.slug, alvo.slug)}
          />
        )}
        <nav aria-label={t("Páginas vizinhas")} className={estilos.vizinhas}>
          {anterior && (
            <Link href={anterior.endereco as Route} className={estilos.vizinha}>
              <span className={estilos.vizinhaRotulo}>
                <ArrowLeft size={18} strokeWidth={1.5} aria-hidden="true" />
                {t("Anterior")}
              </span>
              <span>{anterior.titulo}</span>
            </Link>
          )}
          {proxima && (
            <Link href={proxima.endereco as Route} className={`${estilos.vizinha} ${estilos.vizinhaProxima}`}>
              <span className={estilos.vizinhaRotulo}>
                {t("Próxima")}
                <ArrowRight size={18} strokeWidth={1.5} aria-hidden="true" />
              </span>
              <span>{proxima.titulo}</span>
            </Link>
          )}
        </nav>
      </div>
    </>
  );
}
