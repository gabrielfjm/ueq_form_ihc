import { cookies } from "next/headers";
import { chromium } from "playwright";
import { banco } from "@/lib/banco";
import { filtroDeAcesso } from "@/lib/estudos";
import { COOKIE_SESSAO } from "@/lib/cookie-sessao";
import { nomeDoArquivo } from "@/lib/exportar-estudo";
import { pesquisadorDaSessao } from "@/lib/sessao";

// O navegador do servidor abre a página de impressão com a sessão de quem pediu. O endereço é sempre o do
// próprio servidor, nunca o do cabeçalho Host da requisição: senão um Host forjado levaria o cookie de
// sessão para outro domínio
const ORIGEM_INTERNA = process.env.URL_INTERNA ?? `http://localhost:${process.env.PORT ?? 3000}`;

// Só o que muda o painel passa adiante: versão, modo e ordem dos itens
const PARAMETROS = ["versao", "modo", "itens"] as const;

// prompts/10-extensoes.md: o painel em PDF, A4 com margens de 18 mm e gráficos em vetor
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pesquisador = await pesquisadorDaSessao();
  if (!pesquisador) return new Response("Entre na sua conta para exportar o painel do estudo.", { status: 401 });

  const estudo = await banco.estudo.findFirst({ where: { id, ...filtroDeAcesso(pesquisador) }, select: { titulo: true } });
  // Estudo sem acesso responde igual a estudo inexistente: não revela que o id existe
  if (!estudo) return new Response("Estudo não encontrado.", { status: 404 });

  const pedido = new URL(request.url);
  const destino = new URL(`/estudos/${encodeURIComponent(id)}/resultados/impressao`, ORIGEM_INTERNA);
  for (const chave of PARAMETROS) {
    const valor = pedido.searchParams.get(chave);
    if (valor) destino.searchParams.set(chave, valor);
  }
  const sessao = (await cookies()).get(COOKIE_SESSAO)?.value ?? "";

  const navegador = await chromium.launch();
  try {
    const contexto = await navegador.newContext();
    await contexto.addCookies([{ name: COOKIE_SESSAO, value: sessao, url: ORIGEM_INTERNA, httpOnly: true, sameSite: "Lax" }]);
    const pagina = await contexto.newPage();
    const resposta = await pagina.goto(destino.toString(), { waitUntil: "load" });
    if (!resposta?.ok()) return new Response("Não deu para montar o painel. Tente de novo.", { status: 502 });
    // Espera as fontes, senão o PDF sai com a fonte reserva
    await pagina.evaluate(() => document.fonts.ready.then(() => undefined));
    await pagina.emulateMedia({ media: "print" });
    // Em 80% o gráfico das escalas cabe na mesma página que o cabeçalho, e o texto fica perto de 10 pt
    const pdf = await pagina.pdf({ format: "A4", preferCSSPageSize: true, printBackground: true, scale: 0.8 });

    return new Response(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        // attachment: o navegador baixa o arquivo em vez de abrir em outra aba (docs/ihc.md §4.4)
        "Content-Disposition": `attachment; filename="${nomeDoArquivo(estudo.titulo, "painel")}"`,
        "Cache-Control": "no-store",
      },
    });
  } finally {
    await navegador.close();
  }
}
