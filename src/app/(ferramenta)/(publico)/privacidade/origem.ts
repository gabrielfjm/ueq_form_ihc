import type { Route } from "next";
import { destinoInterno } from "@/lib/validacao-conta";
import { m } from "@/traducao/nucleo";

// As janelas de Entrar e Criar conta abrem a política em outra aba, para não perder o que a pessoa digitou:
// voltar, nesse caso, é fechar a aba
export const ORIGEM_OUTRA_ABA = "outra-aba";

// Quem abre a política diz de onde veio, e o Voltar funciona mesmo sem histórico (link colado, aba nova)
export function enderecoDaPrivacidade(origem: string): Route {
  return `/privacidade?de=${encodeURIComponent(origem)}` as Route;
}

const ROTULOS: Readonly<Record<string, string>> = {
  "/": m("Voltar para a página inicial"),
  "/conta": m("Voltar para Minha conta"),
};

export type Volta = { destino: string; rotulo: string; fechaAba: boolean };

export function voltaDaPrivacidade(de: string | string[] | undefined): Volta {
  if (de === ORIGEM_OUTRA_ABA) return { destino: "/", rotulo: m("Fechar esta aba e voltar"), fechaAba: true };
  const destino = destinoInterno(typeof de === "string" ? de : "");
  const pagina = destino.split(/[?#]/)[0] ?? "/";
  return { destino, rotulo: ROTULOS[pagina] ?? m("Voltar para a página anterior"), fechaAba: false };
}
