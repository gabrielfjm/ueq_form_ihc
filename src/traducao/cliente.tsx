"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { criarTradutor, type Dicionario, type Traduzir } from "./nucleo";

const PORTUGUES = criarTradutor("pt", {});
const Contexto = createContext<Traduzir>(PORTUGUES);

// Vem do layout raiz com as traduções do idioma da interface (vazio em português)
export function ProvedorTraducao({
  idioma,
  lang,
  dicionario,
  children,
}: {
  idioma: string;
  lang: string;
  dicionario: Dicionario;
  children: ReactNode;
}) {
  const t = useMemo(() => criarTradutor(idioma, dicionario, lang), [idioma, dicionario, lang]);
  return <Contexto.Provider value={t}>{children}</Contexto.Provider>;
}

export function useT(): Traduzir {
  return useContext(Contexto);
}
