import { banco } from "@/lib/banco";
import { filtroDeAcesso } from "@/lib/estudos";
import { gerarExportacao, nomeDoArquivo, TIPOS_EXPORTACAO, type TipoExportacao } from "@/lib/exportar-estudo";
import { pesquisadorDaSessao } from "@/lib/sessao";

const ehTipo = (tipo: string): tipo is TipoExportacao => (TIPOS_EXPORTACAO as readonly string[]).includes(tipo);

// prompts/08-exportacao.md: protegida por sessão e pela checagem de acesso (dono, convidado ou administrador), como as páginas do estudo
export async function GET(_request: Request, { params }: { params: Promise<{ id: string; tipo: string }> }) {
  const { id, tipo } = await params;
  const pesquisador = await pesquisadorDaSessao();
  if (!pesquisador) return new Response("Entre na sua conta para exportar os dados do estudo.", { status: 401 });
  if (!ehTipo(tipo)) {
    return new Response(`Exportação "${tipo}" não existe. Use: ${TIPOS_EXPORTACAO.join(", ")}.`, { status: 404 });
  }

  const estudo = await banco.estudo.findFirst({
    where: { id, ...filtroDeAcesso(pesquisador) },
    select: { id: true, titulo: true, versoes: { orderBy: { ordem: "asc" }, select: { id: true, nome: true } } },
  });
  // Estudo sem acesso responde igual a estudo inexistente: não revela que o id existe
  if (!estudo) return new Response("Estudo não encontrado.", { status: 404 });

  const conteudo = await gerarExportacao(estudo, tipo);
  return new Response(conteudo, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      // attachment: o navegador baixa o arquivo em vez de abrir em outra aba (docs/ihc.md §4.4)
      "Content-Disposition": `attachment; filename="${nomeDoArquivo(estudo.titulo, tipo)}"`,
      "Cache-Control": "no-store",
    },
  });
}
