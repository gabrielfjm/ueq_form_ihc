import "server-only";
import { after } from "next/server";
import type { TipoNotificacao } from "@/generated/prisma/enums";
import { banco } from "./banco";
import { enviarEmail, type Email } from "./email";
import { origemDoSite } from "./endereco";
import { plural } from "./texto";

// O sino do cabeçalho e os e-mails que o acompanham. Quem fez a ação nunca é notificado da própria ação.
// O e-mail sai depois da resposta (after): quem clicou não espera o servidor de e-mail

type NovaNotificacao = {
  tipo: TipoNotificacao;
  texto: string;
  // caminho dentro da ferramenta ("/estudos/abc/resultados")
  link: string;
  estudoId?: string | null;
  colaboracaoId?: string | null;
  // e-mail próprio (o do convite); sem ele vai o modelo padrão com o texto e o link
  email?: (destinatario: { email: string }, origem: string) => Email;
};

const escapar = (texto: string) => texto.replace(/[&<>"']/g, (caractere) => `&#${caractere.charCodeAt(0)};`);

function emailPadrao(para: string, texto: string, endereco: string): Email {
  const rodape = "Você recebe estes avisos porque participa deste estudo. Para parar de receber por e-mail, desligue em Minha conta.";
  return {
    para,
    assunto: texto.length > 110 ? `${texto.slice(0, 107)}…` : texto,
    texto: `${texto}\n\nAbrir na ferramenta: ${endereco}\n\n${rodape}\n\nFerramenta UEQ`,
    html: `<p>${escapar(texto)}</p><p><a href="${escapar(endereco)}">Abrir na ferramenta</a></p><p style="color:#46525E;font-size:13px">${escapar(rodape)}</p>`,
  };
}

async function enviarDepois(destinatarios: string[], montar: (destinatario: { email: string }, origem: string) => Email) {
  if (destinatarios.length === 0) return;
  const origem = await origemDoSite();
  after(async () => {
    const pessoas = await banco.pesquisador.findMany({
      where: { id: { in: destinatarios }, notificacoesPorEmail: true },
      select: { email: true },
    });
    for (const pessoa of pessoas) await enviarEmail(montar(pessoa, origem));
  });
}

export async function notificar(destinatarios: readonly string[], autorId: string | null, nova: NovaNotificacao) {
  const para = [...new Set(destinatarios)].filter((id) => id !== autorId);
  if (para.length === 0) return;
  await banco.notificacao.createMany({
    data: para.map((pesquisadorId) => ({
      pesquisadorId,
      autorId,
      estudoId: nova.estudoId ?? null,
      colaboracaoId: nova.colaboracaoId ?? null,
      tipo: nova.tipo,
      texto: nova.texto,
      link: nova.link,
    })),
  });
  await enviarDepois(para, nova.email ?? ((pessoa, origem) => emailPadrao(pessoa.email, nova.texto, `${origem}${nova.link}`)));
}

// Dono e quem aceitou o convite: as pessoas que acompanham o estudo
export async function equipeDoEstudo(estudoId: string): Promise<{ titulo: string; ids: string[] } | null> {
  const estudo = await banco.estudo.findUnique({
    where: { id: estudoId },
    select: { titulo: true, pesquisadorId: true, colaboracoes: { where: { status: "ACEITO" }, select: { pesquisadorId: true } } },
  });
  if (!estudo) return null;
  return { titulo: estudo.titulo, ids: [estudo.pesquisadorId, ...estudo.colaboracoes.map((c) => c.pesquisadorId)] };
}

// "Luiza encerrou a coleta de “Portal do aluno”." para o resto da equipe
export async function notificarAlteracao(
  estudoId: string,
  autor: { id: string; nome: string },
  acao: (titulo: string) => string,
  link = `/estudos/${estudoId}`,
) {
  const equipe = await equipeDoEstudo(estudoId);
  if (!equipe) return;
  await notificar(equipe.ids, autor.id, { tipo: "ALTERACAO", texto: `${autor.nome} ${acao(equipe.titulo)}`, link, estudoId });
}

// Cada resposta concluída pelo link. Enquanto a notificação não é lida, as novas respostas somam nela
// em vez de criar outra (e o e-mail só sai na primeira): 30 respostas numa manhã viram um aviso, não 30
export async function notificarResposta(estudoId: string) {
  const equipe = await equipeDoEstudo(estudoId);
  if (!equipe) return;
  const link = `/estudos/${estudoId}/respostas`;
  const novos: string[] = [];
  for (const pesquisadorId of equipe.ids) {
    const aberta = await banco.notificacao.findFirst({
      where: { pesquisadorId, estudoId, tipo: "RESPOSTA", lidaEm: null },
      select: { id: true, quantidade: true },
    });
    if (aberta) {
      const quantidade = aberta.quantidade + 1;
      await banco.notificacao.update({
        where: { id: aberta.id },
        data: { quantidade, criadaEm: new Date(), texto: `${plural(quantidade, "nova resposta", "novas respostas")} em “${equipe.titulo}”.` },
      });
    } else {
      novos.push(pesquisadorId);
    }
  }
  if (novos.length === 0) return;
  const texto = `Nova resposta em “${equipe.titulo}”.`;
  await banco.notificacao.createMany({
    data: novos.map((pesquisadorId) => ({ pesquisadorId, estudoId, tipo: "RESPOSTA" as const, texto, link })),
  });
  await enviarDepois(novos, (pessoa, origem) => emailPadrao(pessoa.email, texto, `${origem}${link}`));
}
