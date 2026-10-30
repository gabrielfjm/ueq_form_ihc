import type { Route } from "next";
import Link from "next/link";
import { SECOES, VISAO_GERAL, documentoPronto, enderecoDoDocumento, type Documento } from "@/lib/documentacao/catalogo";
import estilos from "./documentacao.module.css";

const CENTROS = [10, 37, 64, 91, 118, 145, 172];

// Protótipo r23: o lugar do documento enquanto a equipe escreve. Estado vazio com a fileira de marcações,
// sem nenhuma marcada (docs/design.md, Estados vazios), uma frase direta e, na visão geral, a situação de
// cada documento, para a pessoa saber o que já dá para ler (Nielsen 1)
export function EmProducao({ documento, visaoGeral }: { documento: Documento; visaoGeral: boolean }) {
  const documentos = SECOES.flatMap((secao) =>
    secao.documentos.filter((item) => item !== VISAO_GERAL).map((item) => ({ secao: secao.titulo, item })),
  );
  return (
    <section aria-labelledby="titulo-em-producao" className={estilos.emProducao}>
      <svg viewBox="0 0 182 20" className={estilos.marcacoesVazias} aria-hidden="true">
        <line x1="10" y1="10" x2="172" y2="10" />
        {CENTROS.map((cx) => (
          <circle key={cx} cx={cx} cy="10" r="7" />
        ))}
      </svg>
      <p className={estilos.situacao}>
        <span className={estilos.pontoProducao} aria-hidden="true" />
        Em produção
      </p>
      <h2 id="titulo-em-producao" className={estilos.emProducaoTitulo}>
        {visaoGeral ? "A documentação está sendo escrita pela equipe." : `${documento.rotulo}: em produção.`}
      </h2>
      <p className={estilos.emProducaoTexto}>
        {visaoGeral
          ? "Cada documento aparece aqui assim que fica pronto. Enquanto isso, a ficha ao lado de cada um diz o que ele vai trazer."
          : "A equipe está escrevendo este documento. Ele aparece aqui assim que ficar pronto; a ficha ao lado diz o que ele vai trazer."}
      </p>
      {visaoGeral && (
        <div className={estilos.rolagemSituacao} role="region" aria-labelledby="titulo-situacao" tabIndex={0}>
          <table className={estilos.tabelaSituacao}>
            <caption id="titulo-situacao">Situação dos documentos</caption>
            <thead>
              <tr>
                <th scope="col">Documento</th>
                <th scope="col">Seção</th>
                <th scope="col">Situação</th>
              </tr>
            </thead>
            <tbody>
              {documentos.map(({ secao, item }) => (
                <tr key={item.slug}>
                  <th scope="row">
                    <Link href={enderecoDoDocumento(item) as Route}>{item.rotulo}</Link>
                  </th>
                  <td>{secao}</td>
                  <td>{documentoPronto(item) ? "Publicado" : "Em produção"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
