import { banco } from "@/lib/banco";
import { pesquisadorDaSessao } from "@/lib/sessao";

// LGPD, art. 18, II e V: acesso e portabilidade. Tudo o que a ferramenta guarda sobre a conta, num JSON.
// As respostas dos participantes não entram: são dados da pesquisa, exportados pela aba Resultados
export async function GET() {
  const pesquisador = await pesquisadorDaSessao();
  if (!pesquisador) return new Response("Entre na sua conta para baixar os seus dados.", { status: 401 });

  const conta = await banco.pesquisador.findUniqueOrThrow({
    where: { id: pesquisador.id },
    select: {
      nome: true,
      email: true,
      criadoEm: true,
      administrador: true,
      tutorialVistoEm: true,
      notificacoesPorEmail: true,
      sessoes: { select: { criadaEm: true, expiraEm: true } },
      estudos: {
        select: {
          titulo: true,
          produtoAvaliado: true,
          objetivo: true,
          status: true,
          dataInicio: true,
          dataFim: true,
          coletarDemografia: true,
          criadoEm: true,
          atualizadoEm: true,
          versoes: { select: { nome: true, _count: { select: { participacoes: true } } } },
          colaboracoes: { select: { papel: true, status: true, pesquisador: { select: { nome: true, email: true } } } },
        },
      },
      colaboracoes: {
        select: { papel: true, status: true, criadoEm: true, respondidoEm: true, estudo: { select: { titulo: true } } },
      },
      notificacoes: { select: { tipo: true, texto: true, criadaEm: true, lidaEm: true } },
    },
  });

  const arquivo = {
    geradoEm: new Date().toISOString(),
    explicacao:
      "Dados da sua conta na Ferramenta UEQ (LGPD, art. 18). A senha não aparece porque só existe como hash. As respostas dos participantes são exportadas pela aba Resultados de cada estudo.",
    conta,
  };
  const dia = new Date().toISOString().slice(0, 10);
  return new Response(JSON.stringify(arquivo, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="meus-dados-ferramenta-ueq-${dia}.json"`,
      "Cache-Control": "no-store",
    },
  });
}
