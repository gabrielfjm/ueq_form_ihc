import { banco } from "@/lib/banco";
import { filtroDeAcesso } from "@/lib/estudos";
import { gerarExportacao, nomeDoArquivo, TIPO_DE_CONTEUDO, TIPOS_EXPORTACAO, type TipoExportacao } from "@/lib/exportar-estudo";
import { MAXIMO_PARTICIPANTES } from "@/lib/planilha-oficial";
import { idiomaDaInterface } from "@/traducao/servidor";
import { pesquisadorDaSessao } from "@/lib/sessao";

const ehTipo = (tipo: string): tipo is TipoExportacao => (TIPOS_EXPORTACAO as readonly string[]).includes(tipo);

// prompts/08-exportacao.md: protegida por sessão e pela checagem de acesso (dono, convidado ou administrador), como as páginas do estudo
export async function GET(request: Request, { params }: { params: Promise<{ id: string; tipo: string }> }) {
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

  // ?versao=… vem do painel: a planilha oficial sai só com a versão que a pessoa está vendo. A planilha
  // tem as próprias traduções dos rótulos; vai no idioma da interface
  const versaoPedida = new URL(request.url).searchParams.get("versao");
  const versao = tipo === "planilha-oficial" ? estudo.versoes.find((v) => v.id === versaoPedida) : undefined;

  let conteudo: string | Uint8Array;
  try {
    conteudo = await gerarExportacao(estudo, tipo, { versaoId: versao?.id, idioma: await idiomaDaInterface() });
  } catch (erro) {
    if (tipo === "planilha-oficial" && erro instanceof Error && erro.message.startsWith("A planilha oficial calcula")) {
      return new Response(
        `A planilha oficial calcula até ${MAXIMO_PARTICIPANTES} participantes. Exporte uma versão de cada vez ou use as respostas brutas.`,
        { status: 422, headers: { "Content-Type": "text/plain; charset=utf-8" } },
      );
    }
    throw erro;
  }
  return new Response(typeof conteudo === "string" ? conteudo : new Uint8Array(conteudo), {
    headers: {
      "Content-Type": TIPO_DE_CONTEUDO[tipo],
      // attachment: o navegador baixa o arquivo em vez de abrir em outra aba (docs/ihc.md §4.4)
      "Content-Disposition": `attachment; filename="${nomeDoArquivo(estudo.titulo, tipo, versao?.nome)}"`,
      "Cache-Control": "no-store",
    },
  });
}
