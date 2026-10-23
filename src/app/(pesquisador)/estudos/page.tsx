import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import formulario from "@/componentes/formulario/formulario.module.css";
import { exigirPesquisador } from "@/lib/sessao";
import { FaixaCabecalho } from "../FaixaCabecalho";
import estilos from "./estudos.module.css";

export const metadata: Metadata = { title: "Estudos · Ferramenta UEQ" };

const CENTROS = [24, 73, 122, 172, 221, 270, 320];

// A tabela de estudos entra com o cadastro de estudos (prompts/04-estudos.md); até lá só existe o estado vazio
export default async function PaginaEstudos() {
  await exigirPesquisador();

  return (
    <>
      <FaixaCabecalho
        titulo="Seus estudos"
        acao={
          <Link href="/estudos/novo" className={`${formulario.botao} ${formulario.primario}`}>
            <Plus size={18} strokeWidth={1.5} aria-hidden="true" />
            <span>Criar estudo</span>
          </Link>
        }
      />
      <div className={estilos.conteudo}>
        <section aria-labelledby="sem-estudos" className={estilos.vazio}>
          <div className={estilos.vazioTextos}>
            <h2 id="sem-estudos" className={estilos.vazioTitulo}>
              Você ainda não tem estudos.
            </h2>
            <p className={estilos.vazioTexto}>
              Crie o primeiro para gerar o link de coleta: título, objetivo, período e versões.
            </p>
            <Link href="/estudos/novo" className={`${formulario.botao} ${formulario.primario} ${estilos.vazioAcao}`}>
              <Plus size={18} strokeWidth={1.5} aria-hidden="true" />
              <span>Criar estudo</span>
            </Link>
          </div>
          <svg viewBox="0 0 344 48" className={estilos.marcacoes} aria-hidden="true">
            <line x1="0" y1="24" x2="344" y2="24" />
            {CENTROS.map((cx) => (
              <circle key={cx} cx={cx} cy="24" r="17" />
            ))}
          </svg>
        </section>
      </div>
    </>
  );
}
