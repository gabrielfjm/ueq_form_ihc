import { FileText, FlaskConical, Layers, LayoutDashboard, ListChecks, Shapes, Users, type LucideIcon } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { SECOES, VISAO_GERAL, enderecoDoDocumento, secaoDoDocumento, type Documento } from "@/lib/documentacao/catalogo";
import { enderecoDaPagina, mapaDeAncoras, type AberturaDocumento } from "@/lib/documentacao/paginas";
import estilos from "./documentacao.module.css";
import { ArtigoDocumento } from "./ArtigoDocumento";
import { EmProducao } from "./EmProducao";
import { FichaDocumento } from "./FichaDocumento";
import { ListaPaginas } from "./ListaPaginas";
import { RegistroDeVisita } from "./NavegacaoDocumento";
import texto from "./texto.module.css";
import { tradutor } from "@/traducao/servidor";

const ICONES: Record<string, LucideIcon> = {
  "visao-geral": LayoutDashboard,
  requisitos: ListChecks,
  usuarios: Users,
  modelagem: Shapes,
  arquitetura: Layers,
  testes: FlaskConical,
  especificacao: FileText,
};

// Acima disso, a introdução ocuparia a tela toda e empurraria o índice para baixo
const INTRODUCAO_CURTA = 400;

const endereco = (documento: Documento) => enderecoDoDocumento(documento) as Route;

// Protótipo r10 a r12: abas das seções na faixa (como as do estudo) e sub-abas dos documentos logo abaixo,
// as duas com aria-current, para a pessoa sempre saber onde está (Nielsen 1, WCAG 2.4.8)
// abertura é null quando o documento ainda está em produção (catalogo.ts, PRONTOS). Documento longo mostra só
// a abertura e a lista das seções, cada uma em página própria; documento curto é lido inteiro aqui
export async function PaginaDocumento({ documento, abertura }: { documento: Documento; abertura: AberturaDocumento | null }) {
  const t = await tradutor();
  const atual = secaoDoDocumento(documento);
  const visaoGeral = documento === VISAO_GERAL;
  const renderizado = abertura?.renderizado ?? null;
  const dividido = abertura !== null && !abertura.estrutura.inteiro;
  return (
    <>
      <RegistroDeVisita ancoras={mapaDeAncoras(documento)} />
      <div className={estilos.faixa}>
        <div className={estilos.faixaInterna}>
          {visaoGeral ? (
            <p className={estilos.area}>{t("Código aberto · licença MIT")}</p>
          ) : (
            <p className={estilos.migalha}>
              <Link href="/documentacao">{t("Documentação")}</Link> <span aria-hidden="true">›</span> {t(atual.titulo)}
            </p>
          )}
          <h1 className={estilos.titulo}>{visaoGeral ? t("Documentação") : (renderizado?.titulo ?? documento.rotulo)}</h1>
          <p className={estilos.descricao}>{t(documento.descricao)}</p>
          <nav aria-label={t("Seções da documentação")} className={estilos.abas}>
            {SECOES.map((secao) => {
              const Icone = ICONES[secao.slug] ?? FileText;
              const primeiro = secao.documentos[0];
              if (!primeiro) return null;
              return (
                <Link
                  key={secao.slug}
                  href={endereco(primeiro)}
                  className={estilos.aba}
                  aria-current={secao === atual ? "page" : undefined}
                >
                  <Icone size={18} strokeWidth={1.5} aria-hidden="true" />
                  <span>{t(secao.titulo)}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
      {atual.documentos.length > 1 && (
        <div className={estilos.faixaSubabas}>
          <nav aria-label={t("Documentos de {titulo}", { titulo: atual.titulo })} className={estilos.subabas}>
            {atual.documentos.map((item) => (
              <Link
                key={item.slug}
                href={endereco(item)}
                className={estilos.subaba}
                aria-current={item === documento ? "page" : undefined}
              >
                {t(item.rotulo)}
              </Link>
            ))}
          </nav>
        </div>
      )}
      <div className={estilos.conteudo}>
        {dividido ? (
          <div className={estilos.abertura}>
            {renderizado?.html.trim() &&
              (abertura.estrutura.abertura.length > INTRODUCAO_CURTA ? (
                <details className={estilos.introducao}>
                  <summary>{t("Ler a introdução")}</summary>
                  <ArtigoDocumento className={texto.texto} html={renderizado.html} />
                </details>
              ) : (
                <ArtigoDocumento className={texto.texto} html={renderizado.html} />
              ))}
            <ListaPaginas
              t={t}
              titulo={t("Neste documento")}
              paginas={abertura.estrutura.secoes}
              endereco={(pagina) => enderecoDaPagina(documento, pagina.slug)}
            />
          </div>
        ) : renderizado ? (
          <ArtigoDocumento className={texto.texto} html={renderizado.html} />
        ) : (
          <EmProducao documento={documento} visaoGeral={visaoGeral} />
        )}
        <FichaDocumento documento={documento} secoes={dividido ? [] : (renderizado?.secoes ?? [])} pronto={renderizado !== null} />
      </div>
    </>
  );
}
