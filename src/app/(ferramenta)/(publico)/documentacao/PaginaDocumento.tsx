import { FileText, FlaskConical, Layers, LayoutDashboard, ListChecks, Shapes, Users, type LucideIcon } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { SECOES, VISAO_GERAL, enderecoDoDocumento, secaoDoDocumento, type Documento } from "@/lib/documentacao/catalogo";
import type { DocumentoRenderizado } from "@/lib/documentacao/markdown";
import estilos from "./documentacao.module.css";
import { FichaDocumento } from "./FichaDocumento";
import texto from "./texto.module.css";

const ICONES: Record<string, LucideIcon> = {
  "visao-geral": LayoutDashboard,
  requisitos: ListChecks,
  usuarios: Users,
  modelagem: Shapes,
  arquitetura: Layers,
  testes: FlaskConical,
  especificacao: FileText,
};

const endereco = (documento: Documento) => enderecoDoDocumento(documento) as Route;

// Protótipo r10 a r12: abas das seções na faixa (como as do estudo) e sub-abas dos documentos logo abaixo,
// as duas com aria-current, para a pessoa sempre saber onde está (Nielsen 1, WCAG 2.4.8)
export function PaginaDocumento({ documento, renderizado }: { documento: Documento; renderizado: DocumentoRenderizado }) {
  const atual = secaoDoDocumento(documento);
  const visaoGeral = documento === VISAO_GERAL;
  return (
    <>
      <div className={estilos.faixa}>
        <div className={estilos.faixaInterna}>
          {visaoGeral ? (
            <p className={estilos.area}>Código aberto · licença MIT</p>
          ) : (
            <p className={estilos.migalha}>
              <Link href="/documentacao">Documentação</Link> <span aria-hidden="true">›</span> {atual.titulo}
            </p>
          )}
          <h1 className={estilos.titulo}>{visaoGeral ? "Documentação" : renderizado.titulo}</h1>
          <p className={estilos.descricao}>{documento.descricao}</p>
          <nav aria-label="Seções da documentação" className={estilos.abas}>
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
                  <span>{secao.titulo}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
      {atual.documentos.length > 1 && (
        <div className={estilos.faixaSubabas}>
          <nav aria-label={`Documentos de ${atual.titulo}`} className={estilos.subabas}>
            {atual.documentos.map((item) => (
              <Link
                key={item.slug}
                href={endereco(item)}
                className={estilos.subaba}
                aria-current={item === documento ? "page" : undefined}
              >
                {item.rotulo}
              </Link>
            ))}
          </nav>
        </div>
      )}
      <div className={estilos.conteudo}>
        {/* HTML gerado dos .md do próprio repositório (src/lib/documentacao/markdown.ts) */}
        <article className={texto.texto} dangerouslySetInnerHTML={{ __html: renderizado.html }} />
        <FichaDocumento documento={documento} secoes={renderizado.secoes} />
      </div>
    </>
  );
}
