import { contagemDeRespostas, estudoDoPesquisador } from "@/lib/estudos";
import { exigirPesquisador } from "@/lib/sessao";
import estilos from "./estudo.module.css";
import { FaixaEstudo, resumoDoEstudo } from "./FaixaEstudo";
import pagina from "./pagina-estudo.module.css";

const CENTROS = [24, 73, 122, 172, 221, 270, 320];

// Abas Resultados e Respostas enquanto o estudo não tem nenhuma resposta concluída.
// O painel com dados entra em prompts/06-painel-resultados.md e prompts/07-suspeitos.md
export async function SemRespostas({ id, texto }: { id: string; texto: string }) {
  const pesquisador = await exigirPesquisador();
  const estudo = await estudoDoPesquisador(id, pesquisador.id);
  const respostas = await contagemDeRespostas(estudo.id);

  return (
    <>
      <FaixaEstudo
        estudoId={estudo.id}
        titulo={estudo.titulo}
        status={estudo.status}
        resumo={resumoDoEstudo(estudo.status, estudo.versoes.length, respostas)}
      />
      <div className={estilos.conteudo}>
        <section aria-labelledby="titulo-vazio" className={pagina.vazio}>
          <svg viewBox="0 0 344 48" aria-hidden="true">
            <line x1="0" y1="24" x2="344" y2="24" />
            {CENTROS.map((cx) => (
              <circle key={cx} cx={cx} cy="24" r="16" />
            ))}
          </svg>
          <h2 id="titulo-vazio" className={pagina.vazioTitulo}>
            Nenhuma resposta ainda.
          </h2>
          <p className={pagina.vazioTexto}>{texto}</p>
        </section>
      </div>
    </>
  );
}
