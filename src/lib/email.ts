import "server-only";
import { createTransport } from "nodemailer";
import { m, type Traduzir } from "@/traducao/nucleo";
import { htmlDoEmail, textoDoEmail, type ConteudoEmail } from "./modelo-email";

// Envio por SMTP (ex.: Gmail com senha de app). Sem as variáveis, a ferramenta não envia e-mail: o convite
// continua aparecendo para a pessoa no sino de notificações, e quem convidou recebe um link de e-mail pronto para
// mandar do próprio programa de e-mail
// Valor colado na Vercel com as aspas do .env ("smtp.gmail.com") ou com espaço sobrando também vale
function variavel(nome: string): string | undefined {
  const valor = process.env[nome]?.trim().replace(/^(["'])(.*)\1$/s, "$2").trim();
  return valor || undefined;
}

const host = variavel("SMTP_HOST")?.toLowerCase();
const usuario = variavel("SMTP_USUARIO");

// A senha de app do Gmail é mostrada em quatro grupos ("abcd efgh ijkl mnop"), mas não tem espaço:
// quem copia com os espaços não deve ficar sem e-mail por isso
function senhaSmtp(): string | undefined {
  const senha = variavel("SMTP_SENHA");
  if (!senha) return undefined;
  return host === "smtp.gmail.com" ? senha.replace(/\s+/g, "") : senha;
}

// A porta vem como texto da Vercel ("465", " 587 "): qualquer coisa que não seja número volta para 465
function portaSmtp(): number {
  const porta = Number.parseInt(variavel("SMTP_PORTA") ?? "", 10);
  return Number.isFinite(porta) && porta > 0 ? porta : 465;
}

// EMAIL_REMETENTE pode ser só o endereço ("contato@exemplo.com") ou já vir com o nome
// ("Ferramenta UEQ <contato@exemplo.com>"). Antes, o nome era posto em volta dos dois jeitos, e o segundo virava
// um remetente inválido que o servidor recusava. No Gmail, o remetente precisa ser a própria conta ou um alias dela
function remetenteSmtp(): string {
  const valor = variavel("EMAIL_REMETENTE") ?? usuario ?? "";
  return valor.includes("<") ? valor : `"Ferramenta UEQ" <${valor}>`;
}

const SMTP = {
  host,
  porta: portaSmtp(),
  usuario,
  senha: senhaSmtp(),
  remetente: remetenteSmtp(),
};

export function emailConfigurado(): boolean {
  return Boolean(SMTP.host && SMTP.usuario && SMTP.senha);
}

// O que a página Proteção de dados mostra ao administrador, sem a senha
export function configuracaoDoEmail() {
  return { configurado: emailConfigurado(), host: SMTP.host ?? "", porta: SMTP.porta, usuario: SMTP.usuario ?? "", remetente: SMTP.remetente };
}

export type Email = { para: string; assunto: string; texto: string; html: string; responderPara?: string };

export type ResultadoEnvio = { enviado: true } | { enviado: false; erro: string };

type ErroSmtp = Error & { code?: string; responseCode?: number; response?: string };

// A resposta do servidor ("535-5.7.8 Username and Password not accepted…") diz o que corrigir. Ela vai para o
// log da Vercel e para o teste do administrador; nunca leva a senha
function descreverErro(erro: unknown): string {
  if (!(erro instanceof Error)) return String(erro);
  const { code, responseCode, response, message } = erro as ErroSmtp;
  return [code, responseCode, response ?? message].filter(Boolean).join(" · ");
}

function transporte() {
  return createTransport({
    host: SMTP.host,
    port: SMTP.porta,
    secure: SMTP.porta === 465,
    auth: { user: SMTP.usuario, pass: SMTP.senha },
    // Servidor que não responde não segura a função da Vercel até o limite dela
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });
}

const SEM_CONFIGURACAO = "SMTP_HOST, SMTP_USUARIO ou SMTP_SENHA vazio";

// Vários e-mails pela mesma conexão (o comunicado a todas as contas), um de cada vez: o Gmail recusa rajadas
export async function enviarVarios(emails: Email[]): Promise<{ enviados: number; falhas: number; erro?: string }> {
  if (!emailConfigurado()) return { enviados: 0, falhas: emails.length, erro: SEM_CONFIGURACAO };
  const conexao = transporte();
  let enviados = 0;
  let erro: string | undefined;
  for (const email of emails) {
    try {
      await conexao.sendMail({
        from: SMTP.remetente,
        to: email.para,
        replyTo: email.responderPara,
        subject: email.assunto,
        text: email.texto,
        html: email.html,
      });
      enviados += 1;
    } catch (falha) {
      erro ??= descreverErro(falha);
      // eslint-disable-next-line no-console -- vai para o log da Vercel; a ação segue sem o e-mail
      console.error(`[e-mail] não foi possível enviar "${email.assunto}" por ${SMTP.host}:${SMTP.porta}: ${descreverErro(falha)}`);
    }
  }
  conexao.close();
  return { enviados, falhas: emails.length - enviados, erro };
}

export async function enviarEmailComDetalhe(email: Email): Promise<ResultadoEnvio> {
  const { enviados, erro } = await enviarVarios([email]);
  return enviados === 1 ? { enviado: true } : { enviado: false, erro: erro ?? SEM_CONFIGURACAO };
}

// Devolve false quando não deu para enviar; quem chama decide o que mostrar. Nunca derruba a ação:
// o convite já foi gravado, e o e-mail é só um aviso a mais (o motivo da falha fica no log da Vercel)
export async function enviarEmail(email: Email): Promise<boolean> {
  return (await enviarEmailComDetalhe(email)).enviado;
}

type DadosConvite = {
  quemConvidou: { nome: string; email: string };
  para: string;
  estudo: string;
  papel: "EDITOR" | "LEITOR";
  link: string;
};

// No idioma da conta de quem recebe (ou de quem convida, no mailto: que sai do e-mail dele)
export function emailDeConvite(t: Traduzir, { quemConvidou, para, estudo, papel, link }: DadosConvite): Email {
  const assunto = t("{nome} convidou você para o estudo “{titulo}”", { nome: quemConvidou.nome, titulo: estudo });
  const convite = (nome: string, titulo: string) =>
    papel === "EDITOR"
      ? t("{nome} ({email}) convidou você para trabalhar no estudo “{titulo}” na Ferramenta UEQ, como editor.", {
          nome,
          email: quemConvidou.email,
          titulo,
        })
      : t("{nome} ({email}) convidou você para trabalhar no estudo “{titulo}” na Ferramenta UEQ, como leitor.", {
          nome,
          email: quemConvidou.email,
          titulo,
        });
  const papelTexto =
    papel === "EDITOR"
      ? t("Como editor, você pode editar o estudo, abrir e encerrar a coleta e revisar as respostas.")
      : t("Como leitor, você pode ver o painel de resultados e as respostas, e exportar os dados.");
  const ola = t("Olá!");
  const assinatura = t("Ferramenta UEQ");
  const texto = [
    ola,
    "",
    convite(quemConvidou.nome, estudo),
    papelTexto,
    "",
    t("Para aceitar ou recusar, abra Notificações na ferramenta: {link}", { link }),
    "",
    assinatura,
  ].join("\n");
  const html = htmlDoEmail({
    lang: t.lang,
    previa: convite(quemConvidou.nome, estudo),
    titulo: t("Você foi convidado para um estudo"),
    paragrafos: [ola, convite(quemConvidou.nome, estudo), papelTexto],
    destaque: estudo,
    botao: { texto: t("Abrir as notificações"), href: link },
    linkReserva: t("Se o botão não funcionar, copie e cole este endereço no navegador:"),
    rodape: [t("O convite também aparece no sino de notificações, no alto da ferramenta, com Aceitar e Recusar.")],
    assinatura,
  });
  return { para, assunto, texto, html, responderPara: quemConvidou.email };
}

const LINK_RESERVA = m("Se o botão não funcionar, copie e cole este endereço no navegador:");

function montar(t: Traduzir, para: string, assunto: string, conteudo: Omit<ConteudoEmail, "lang" | "linkReserva" | "assinatura">): Email {
  const completo = { ...conteudo, lang: t.lang, linkReserva: t(LINK_RESERVA), assinatura: t("Ferramenta UEQ") };
  return { para, assunto, texto: textoDoEmail(completo), html: htmlDoEmail(completo) };
}

// O teste que o administrador manda para o próprio e-mail em Proteção de dados
export function emailDeTeste(t: Traduzir, para: string, origem: string): Email {
  const titulo = t("O envio de e-mails está funcionando");
  return montar(t, para, t("Teste de envio da Ferramenta UEQ"), {
    previa: titulo,
    titulo,
    paragrafos: [
      t("Este é o teste pedido na página Proteção de dados, na Administração. Os convites e os avisos do sino saem do mesmo jeito para quem tem conta na ferramenta."),
    ],
    botao: { texto: t("Abrir a ferramenta"), href: origem },
    rodape: [t("Você recebeu este e-mail porque pediu um teste do envio.")],
  });
}

// Aviso de nova versão a todas as contas, no idioma de cada uma (Minha conta › Idioma). Os textos são fixos para
// estarem traduzidos nos 37 idiomas; quando a próxima versão trouxer outras mudanças, troque a lista daqui
export function emailDeNovaVersao(t: Traduzir, para: string, origem: string): Email {
  const titulo = t("A Ferramenta UEQ tem uma nova versão no ar");
  return montar(t, para, titulo, {
    previa: t("A planilha oficial já sai com os resultados, a ferramenta avisa quando algo está carregando e os e-mails voltaram."),
    titulo,
    paragrafos: [
      t("Olá! Publicamos uma nova versão da ferramenta, com estas correções:"),
      t("A planilha oficial do UEQ e do UEQ-S exportada já sai com todos os resultados calculados e os gráficos preenchidos, mesmo no Modo de Exibição Protegido do Excel."),
      t("Quando uma página carrega, um arquivo está sendo gerado ou um formulário está sendo enviado, um aviso na tela diz o que está acontecendo."),
      t("Os convites e os avisos do sino voltaram a chegar por e-mail, no idioma da sua conta."),
    ],
    botao: { texto: t("Abrir a ferramenta"), href: origem },
    rodape: [
      t("Você recebe este aviso porque tem conta na Ferramenta UEQ. Para não receber mais e-mails, desmarque “Receber os avisos também por e-mail” em Minha conta."),
    ],
  });
}

// Quando a ferramenta não envia e-mail: o mesmo texto num link mailto:, para quem convidou mandar
export function linkMailto(email: Email): string {
  return `mailto:${encodeURIComponent(email.para)}?subject=${encodeURIComponent(email.assunto)}&body=${encodeURIComponent(email.texto)}`;
}
