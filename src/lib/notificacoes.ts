import "server-only";
import { after } from "next/server";
import type { TipoNotificacao } from "@/generated/prisma/enums";
import { banco } from "./banco";
import { enviarEmail, type Email } from "./email";
import { origemDoSite } from "./endereco";
import type { Traduzir } from "@/traducao/nucleo";
import { tradutorDoIdioma } from "@/traducao/servidor";
import { plural } from "./texto";

// O sino do cabeçalho e os e-mails que o acompanham. Quem fez a ação nunca é notificado da própria ação.
// O e-mail sai depois da resposta (after): quem clicou não espera o servidor de e-mail.
// Cada pessoa recebe o aviso no idioma da própria conta: o texto é uma função do tradutor dela

export type TextoNoIdioma = (t: Traduzir) => string;

type NovaNotificacao = {
  tipo: TipoNotificacao;
  texto: TextoNoIdioma;
  // caminho dentro da ferramenta ("/estudos/abc/resultados")
  link: string;
  estudoId?: string | null;
  colaboracaoId?: string | null;
  // e-mail próprio (o do convite); sem ele vai o modelo padrão com o texto e o link
  email?: (destinatario: { email: string }, origem: string, t: Traduzir) => Email;
};

type Destinatario = { id: string; email: string; idioma: string; notificacoesPorEmail: boolean };

async function destinatarios(ids: readonly string[]): Promise<{ pessoa: Destinatario; t: Traduzir }[]> {
  const pessoas = await banco.pesquisador.findMany({
    where: { id: { in: [...ids] } },
    select: { id: true, email: true, idioma: true, notificacoesPorEmail: true },
  });
  return Promise.all(pessoas.map(async (pessoa) => ({ pessoa, t: await tradutorDoIdioma(pessoa.idioma) })));
}

const escapar = (texto: string) => texto.replace(/[&<>"']/g, (caractere) => `&#${caractere.charCodeAt(0)};`);

function emailPadrao(t: Traduzir, para: string, texto: string, endereco: string): Email {
  const rodape = t("Você recebe estes avisos porque participa deste estudo. Para parar de receber por e-mail, desligue em Minha conta.");
  const abrir = t("Abrir na ferramenta");
  return {
    para,
    assunto: texto.length > 110 ? `${texto.slice(0, 107)}…` : texto,
    texto: `${texto}\n\n${abrir}: ${endereco}\n\n${rodape}\n\n${t("Ferramenta UEQ")}`,
    html: `<p>${escapar(texto)}</p><p><a href="${escapar(endereco)}">${escapar(abrir)}</a></p><p style="color:#46525E;font-size:13px">${escapar(rodape)}</p>`,
  };
}

async function enviarDepois(
  pessoas: { pessoa: Destinatario; t: Traduzir }[],
  montar: (destinatario: { email: string }, origem: string, t: Traduzir) => Email,
) {
  const comEmail = pessoas.filter(({ pessoa }) => pessoa.notificacoesPorEmail);
  if (comEmail.length === 0) return;
  const origem = await origemDoSite();
  after(async () => {
    for (const { pessoa, t } of comEmail) await enviarEmail(montar(pessoa, origem, t));
  });
}

export async function notificar(ids: readonly string[], autorId: string | null, nova: NovaNotificacao) {
  const para = await destinatarios([...new Set(ids)].filter((id) => id !== autorId));
  if (para.length === 0) return;
  await banco.notificacao.createMany({
    data: para.map(({ pessoa, t }) => ({
      pesquisadorId: pessoa.id,
      autorId,
      estudoId: nova.estudoId ?? null,
      colaboracaoId: nova.colaboracaoId ?? null,
      tipo: nova.tipo,
      texto: nova.texto(t),
      link: nova.link,
    })),
  });
  await enviarDepois(
    para,
    nova.email ?? ((pessoa, origem, t) => emailPadrao(t, pessoa.email, nova.texto(t), `${origem}${nova.link}`)),
  );
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
  acao: (titulo: string, t: Traduzir) => string,
  link = `/estudos/${estudoId}`,
) {
  const equipe = await equipeDoEstudo(estudoId);
  if (!equipe) return;
  await notificar(equipe.ids, autor.id, {
    tipo: "ALTERACAO",
    texto: (t) => `${autor.nome} ${acao(equipe.titulo, t)}`,
    link,
    estudoId,
  });
}

// Cada resposta concluída pelo link. Enquanto a notificação não é lida, as novas respostas somam nela
// em vez de criar outra (e o e-mail só sai na primeira): 30 respostas numa manhã viram um aviso, não 30
export async function notificarResposta(estudoId: string) {
  const equipe = await equipeDoEstudo(estudoId);
  if (!equipe) return;
  const link = `/estudos/${estudoId}/respostas`;
  const novos: string[] = [];
  const pessoas = await destinatarios(equipe.ids);
  for (const { pessoa, t } of pessoas) {
    const pesquisadorId = pessoa.id;
    const aberta = await banco.notificacao.findFirst({
      where: { pesquisadorId, estudoId, tipo: "RESPOSTA", lidaEm: null },
      select: { id: true, quantidade: true },
    });
    if (aberta) {
      const quantidade = aberta.quantidade + 1;
      await banco.notificacao.update({
        where: { id: aberta.id },
        data: {
          quantidade,
          criadaEm: new Date(),
          texto: t("{respostas} em “{titulo}”.", {
            respostas: plural(quantidade, t("nova resposta"), t("novas respostas")),
            titulo: equipe.titulo,
          }),
        },
      });
    } else {
      novos.push(pesquisadorId);
    }
  }
  if (novos.length === 0) return;
  const paraNovos = pessoas.filter(({ pessoa }) => novos.includes(pessoa.id));
  const texto = (t: Traduzir) => t("Nova resposta em “{titulo}”.", { titulo: equipe.titulo });
  await banco.notificacao.createMany({
    data: paraNovos.map(({ pessoa, t }) => ({ pesquisadorId: pessoa.id, estudoId, tipo: "RESPOSTA" as const, texto: texto(t), link })),
  });
  await enviarDepois(paraNovos, (pessoa, origem, t) => emailPadrao(t, pessoa.email, texto(t), `${origem}${link}`));
}
