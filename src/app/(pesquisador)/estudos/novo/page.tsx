import type { Metadata } from "next";
import Link from "next/link";
import { exigirPesquisador } from "@/lib/sessao";
import { FaixaCabecalho } from "../../FaixaCabecalho";
import estilos from "../estudos.module.css";

export const metadata: Metadata = { title: "Criar estudo · Ferramenta UEQ" };

// O formulário entra em prompts/04-estudos.md; a rota já existe porque a barra superior aponta para ela
export default async function PaginaCriarEstudo() {
  await exigirPesquisador();

  return (
    <>
      <FaixaCabecalho
        migalha={<Link href="/estudos">Estudos</Link>}
        titulo="Criar estudo"
        descricao="O estudo começa em rascunho. Nada vai para os participantes até você abrir a coleta."
      />
      <div className={estilos.conteudo} />
    </>
  );
}
