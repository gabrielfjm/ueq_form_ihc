import type { Route } from "next";
import Link from "next/link";
import type { Pagina } from "@/lib/documentacao/estrutura";
import { plural } from "@/lib/texto";
import type { Traduzir } from "@/traducao/nucleo";
import estilos from "./documentacao.module.css";

type Propriedades = {
  t: Traduzir;
  titulo: string;
  paginas: readonly (Pagina & { partes?: readonly Pagina[] })[];
  endereco: (pagina: Pagina) => string;
};

const MUITOS_ITENS = 12;

// O índice de um documento ou de uma seção: dá para escolher pelo título e pela primeira frase, sem abrir
export function ListaPaginas({ t, titulo, paginas, endereco }: Propriedades) {
  return (
    <section aria-label={titulo}>
      <h2 className={estilos.listaTitulo}>{titulo}</h2>
      <ol className={paginas.length > MUITOS_ITENS ? `${estilos.listaPaginas} ${estilos.listaLonga}` : estilos.listaPaginas}>
        {paginas.map((pagina, posicao) => {
          const itens = pagina.partes?.length ?? 0;
          const meta = [
            pagina.diagramas > 0 ? plural(pagina.diagramas, t("diagrama"), t("diagramas")) : null,
            itens > 0 ? plural(itens, t("item"), t("itens")) : null,
          ].filter(Boolean);
          return (
            <li key={pagina.slug} className={estilos.linhaPagina}>
              <span className={estilos.linhaNumero} aria-hidden="true">
                {String(posicao + 1).padStart(2, "0")}
              </span>
              <Link href={endereco(pagina) as Route} className={estilos.linhaTitulo}>
                {pagina.titulo}
              </Link>
              {meta.length > 0 && <span className={estilos.linhaMeta}>{meta.join(" · ")}</span>}
              {pagina.resumo && <p className={estilos.linhaResumo}>{pagina.resumo}</p>}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
