"use client";

import type { Route } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import estilos from "./resultados.module.css";

type Propriedades = {
  estudoId: string;
  versoes: { id: string; nome: string; naAnalise: number }[];
  naAnaliseTotal: number;
  foraDaAnalise: number;
  comparando: boolean;
  // legenda das versões no modo comparar, na mesma barra (protótipo r7)
  children?: ReactNode;
};

// docs/ihc.md §4.3 (Nielsen 3): versão e modo ficam na URL, então voltar, recarregar e compartilhar funcionam
export function ControlesResultados({ estudoId, versoes, naAnaliseTotal, foraDaAnalise, comparando, children }: Propriedades) {
  const router = useRouter();
  const caminho = usePathname();
  const parametros = useSearchParams();

  function endereco(mudancas: Record<string, string | null>): Route {
    const proximos = new URLSearchParams(parametros.toString());
    for (const [chave, valor] of Object.entries(mudancas)) {
      if (valor === null) proximos.delete(chave);
      else proximos.set(chave, valor);
    }
    const busca = proximos.toString();
    return `${caminho}${busca ? `?${busca}` : ""}` as Route;
  }

  return (
    <div className={estilos.controles}>
      {versoes.length > 1 && !comparando && (
        <div className={estilos.seletor}>
          <label htmlFor="versao">Versão</label>
          {/* Trocar a versão só atualiza os números desta página; o foco continua no seletor (WCAG 3.2.2) */}
          <select
            id="versao"
            value={parametros.get("versao") ?? ""}
            onChange={(evento) => router.replace(endereco({ versao: evento.target.value || null }), { scroll: false })}
          >
            <option value="">Todas as versões ({naAnaliseTotal} na análise)</option>
            {versoes.map((versao) => (
              <option key={versao.id} value={versao.id}>
                {versao.nome} ({versao.naAnalise})
              </option>
            ))}
          </select>
        </div>
      )}
      {versoes.length > 1 && (
        <nav aria-label="Modo de visualização" className={estilos.alternar}>
          <Link href={endereco({ modo: null })} aria-current={comparando ? undefined : "page"} scroll={false}>
            Uma versão
          </Link>
          <Link href={endereco({ modo: "comparar", versao: null })} aria-current={comparando ? "page" : undefined} scroll={false}>
            Comparar versões
          </Link>
        </nav>
      )}
      {children}
      {foraDaAnalise > 0 && (
        <p className={estilos.fora}>
          {foraDaAnalise === 1 ? "1 participação fora da análise." : `${foraDaAnalise} participações fora da análise.`}{" "}
          <Link href={`/estudos/${estudoId}/respostas` as Route}>Ver respostas</Link>
        </p>
      )}
    </div>
  );
}
