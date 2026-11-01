import "server-only";
import { createTransport } from "nodemailer";

// Envio por SMTP (ex.: Gmail com senha de app). Sem as variáveis, a ferramenta não envia e-mail: o convite
// continua aparecendo para a pessoa em Convites, e quem convidou recebe um link de e-mail pronto para
// mandar do próprio programa de e-mail
const SMTP = {
  host: process.env.SMTP_HOST,
  porta: Number(process.env.SMTP_PORTA ?? 465),
  usuario: process.env.SMTP_USUARIO,
  senha: process.env.SMTP_SENHA,
  remetente: process.env.EMAIL_REMETENTE ?? process.env.SMTP_USUARIO,
};

export function emailConfigurado(): boolean {
  return Boolean(SMTP.host && SMTP.usuario && SMTP.senha);
}

export type Email = { para: string; assunto: string; texto: string; html: string; responderPara?: string };

// Devolve false quando não deu para enviar; quem chama decide o que mostrar. Nunca derruba a ação:
// o convite já foi gravado, e o e-mail é só um aviso a mais
export async function enviarEmail(email: Email): Promise<boolean> {
  if (!emailConfigurado()) return false;
  try {
    const transporte = createTransport({
      host: SMTP.host,
      port: SMTP.porta,
      secure: SMTP.porta === 465,
      auth: { user: SMTP.usuario, pass: SMTP.senha },
    });
    await transporte.sendMail({
      from: `Ferramenta UEQ <${SMTP.remetente}>`,
      to: email.para,
      replyTo: email.responderPara,
      subject: email.assunto,
      text: email.texto,
      html: email.html,
    });
    return true;
  } catch {
    // Falha do servidor de e-mail não desfaz nada: o aviso continua no sino
    return false;
  }
}

const escapar = (texto: string) =>
  texto.replace(/[&<>"']/g, (caractere) => `&#${caractere.charCodeAt(0)};`);

type DadosConvite = {
  quemConvidou: { nome: string; email: string };
  para: string;
  estudo: string;
  papel: "EDITOR" | "LEITOR";
  link: string;
};

const NOME_PAPEL = { EDITOR: "editor", LEITOR: "leitor" } as const;

export function emailDeConvite({ quemConvidou, para, estudo, papel, link }: DadosConvite): Email {
  const assunto = `${quemConvidou.nome} convidou você para o estudo “${estudo}”`;
  const papelTexto =
    papel === "EDITOR"
      ? "Como editor, você pode editar o estudo, abrir e encerrar a coleta e revisar as respostas."
      : "Como leitor, você pode ver o painel de resultados e as respostas, e exportar os dados.";
  const texto = [
    "Olá!",
    "",
    `${quemConvidou.nome} (${quemConvidou.email}) convidou você para trabalhar no estudo “${estudo}” na Ferramenta UEQ, como ${NOME_PAPEL[papel]}.`,
    papelTexto,
    "",
    `Para aceitar ou recusar, entre na ferramenta e abra Convites: ${link}`,
    "",
    "Ferramenta UEQ",
  ].join("\n");
  const html = `<p>Olá!</p>
<p><strong>${escapar(quemConvidou.nome)}</strong> (${escapar(quemConvidou.email)}) convidou você para trabalhar no estudo <strong>“${escapar(estudo)}”</strong> na Ferramenta UEQ, como ${NOME_PAPEL[papel]}.</p>
<p>${escapar(papelTexto)}</p>
<p><a href="${escapar(link)}">Abrir os convites na ferramenta</a></p>
<p style="color:#46525E">Ferramenta UEQ</p>`;
  return { para, assunto, texto, html, responderPara: quemConvidou.email };
}

// Quando a ferramenta não envia e-mail: o mesmo texto num link mailto:, para quem convidou mandar
export function linkMailto(email: Email): string {
  return `mailto:${encodeURIComponent(email.para)}?subject=${encodeURIComponent(email.assunto)}&body=${encodeURIComponent(email.texto)}`;
}
