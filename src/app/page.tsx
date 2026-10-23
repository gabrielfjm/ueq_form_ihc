import { redirect } from "next/navigation";
import { pesquisadorDaSessao } from "@/lib/sessao";

// A ferramenta não tem página de apresentação: quem chega pela raiz vai direto para onde trabalha
export default async function PaginaInicial() {
  redirect((await pesquisadorDaSessao()) ? "/estudos" : "/entrar");
}
