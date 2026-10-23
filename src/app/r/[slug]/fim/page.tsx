import type { Metadata } from "next";
import { estudoPublico } from "@/lib/participacao";
import { Etapas, Marcacoes } from "../Etapas";
import estilos from "../participante.module.css";

type Propriedades = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Propriedades): Promise<Metadata> {
  const estudo = await estudoPublico((await params).slug);
  return { title: `Respostas registradas · ${estudo.titulo}` };
}

// Protótipo p5: fechamento curto e sem animação (docs/design.md, Fim)
export default async function PaginaFim({ params }: Propriedades) {
  await estudoPublico((await params).slug);
  return (
    <>
      <header className={estilos.faixa}>
        <div className={`${estilos.faixaInterna} ${estilos.faixaFim}`}>
          <Etapas atual="concluidas" />
          <Marcacoes cheias />
        </div>
      </header>
      <main id="conteudo" tabIndex={-1} className={estilos.corpo}>
        <h1 className={estilos.fimTitulo}>Respostas registradas</h1>
        <p className={estilos.fimTexto}>Obrigado por participar. Suas respostas foram gravadas de forma anônima.</p>
        <p className={estilos.fimNota}>Você já pode fechar esta página. Nada mais será pedido.</p>
      </main>
    </>
  );
}
