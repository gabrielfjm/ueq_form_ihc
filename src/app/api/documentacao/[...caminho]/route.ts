import { readFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { DOCUMENTOS, DOWNLOADS_PUBLICADOS, documentoPronto } from "@/lib/documentacao/catalogo";
import { NOME_DIAGRAMA, PASTA_DIAGRAMAS, blocosMermaid, nomeDoDiagrama } from "@/lib/documentacao/diagramas";

const TIPOS: Record<string, string> = {
  csv: "text/csv; charset=utf-8",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

// Diagramas dos documentos já publicados; os dos documentos em produção não saem
async function diagramasPublicados(): Promise<Set<string>> {
  const prontos = DOCUMENTOS.filter(documentoPronto);
  const textos = await Promise.all(prontos.map((documento) => readFile(join(process.cwd(), documento.arquivo), "utf8")));
  return new Set(textos.flatMap((texto) => blocosMermaid(texto).map(nomeDoDiagrama)));
}

// Serve os diagramas da documentação e os arquivos para baixar, sem sessão, como a documentação. O caminho
// do pedido só escolhe entre nomes conhecidos: nenhum arquivo fora da lista sai daqui
export async function GET(_request: Request, { params }: { params: Promise<{ caminho: string[] }> }) {
  const { caminho } = await params;

  if (
    caminho.length === 2 &&
    caminho[0] === "diagramas" &&
    NOME_DIAGRAMA.test(caminho[1] ?? "") &&
    (await diagramasPublicados()).has(caminho[1] ?? "")
  ) {
    const svg = await readFile(join(process.cwd(), PASTA_DIAGRAMAS, caminho[1] ?? "")).catch(() => null);
    if (!svg) return new Response("Diagrama não encontrado. Rode pnpm docs:diagramas.", { status: 404 });
    return new Response(new Uint8Array(svg), {
      headers: {
        "Content-Type": "image/svg+xml",
        // o nome é o hash do diagrama: o mesmo nome é sempre o mesmo desenho
        "Cache-Control": "public, max-age=31536000, immutable",
        // img-src data: só para imagens que o Mermaid embute no próprio SVG (ícones de forma img)
        "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; img-src data:",
        "X-Content-Type-Options": "nosniff",
      },
    });
  }

  const download = caminho.length === 1 ? DOWNLOADS_PUBLICADOS.find((candidato) => basename(candidato.arquivo) === caminho[0]) : undefined;
  if (!download) return new Response("Arquivo da documentação não encontrado.", { status: 404 });
  const conteudo = await readFile(join(process.cwd(), download.arquivo));
  const extensao = download.arquivo.split(".").pop() ?? "";
  return new Response(new Uint8Array(conteudo), {
    headers: {
      "Content-Type": TIPOS[extensao] ?? "application/octet-stream",
      // attachment: o navegador baixa em vez de abrir outra aba (docs/ihc.md §4.4)
      "Content-Disposition": `attachment; filename="${basename(download.arquivo)}"`,
      "Cache-Control": "no-store",
    },
  });
}
