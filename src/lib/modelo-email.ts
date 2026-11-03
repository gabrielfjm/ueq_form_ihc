// Modelo dos e-mails da ferramenta (convite e avisos do sino), com a identidade de docs/design.md: fundo branco,
// faixa cinza, tinta escura, azul-petróleo só no que é clicável e a fileira de 7 marcações do logotipo.
// Programas de e-mail ignoram CSS externo e boa parte do moderno: tudo vai em tabelas com estilo inline,
// e o texto puro vai junto para quem lê sem HTML. Sem imagens: nada a bloquear, nada a baixar

const COR = {
  fundo: "#FFFFFF",
  faixa: "#F3F5F7",
  painel: "#F8FAFB",
  tinta: "#0F1720",
  tintaSuave: "#46525E",
  tintaFraca: "#5B6672",
  linha: "#D5DBE1",
  destaque: "#0B6A78",
};

const FONTE = "'Atkinson Hyperlegible Next', 'Atkinson Hyperlegible', Verdana, Arial, sans-serif";

export type ConteudoEmail = {
  // <html lang>: o idioma da conta de quem recebe
  lang: string;
  // texto que alguns programas mostram ao lado do assunto, antes de abrir
  previa: string;
  titulo: string;
  paragrafos: string[];
  // trecho em destaque (o nome do estudo, por exemplo), num quadro com a barra azul-petróleo
  destaque?: string;
  botao: { texto: string; href: string };
  // "Se o botão não funcionar, copie…": o endereço vai escrito logo abaixo
  linkReserva: string;
  rodape: string[];
  assinatura: string;
};

export const escaparHtml = (texto: string) => texto.replace(/[&<>"']/g, (caractere) => `&#${caractere.charCodeAt(0)};`);

const DIREITA_PARA_ESQUERDA = new Set(["ar", "he", "fa"]);

// As 7 marcações do diferencial semântico, a quinta cheia, como no logotipo (src/componentes/Logotipo.tsx)
function marcacoes(): string {
  return Array.from({ length: 7 }, (_, posicao) => {
    const cheia = posicao === 4;
    return `<td style="padding:0 2px"><div style="width:9px;height:9px;border-radius:50%;border:1.5px solid ${cheia ? COR.destaque : COR.tinta};background:${cheia ? COR.destaque : COR.fundo};font-size:0;line-height:0">&nbsp;</div></td>`;
  }).join("");
}

export function htmlDoEmail(conteudo: ConteudoEmail): string {
  const e = escaparHtml;
  const dir = DIREITA_PARA_ESQUERDA.has(conteudo.lang.split("-")[0] ?? "") ? "rtl" : "ltr";
  const lado = dir === "rtl" ? "right" : "left";
  const paragrafos = conteudo.paragrafos
    .map((texto) => `<p style="margin:0 0 14px;font-size:16px;line-height:1.55;color:${COR.tintaSuave}">${e(texto)}</p>`)
    .join("");
  const destaque = conteudo.destaque
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:4px 0 22px"><tr><td style="padding:12px 16px;background:${COR.painel};border:1px solid ${COR.linha};border-${lado}:3px solid ${COR.destaque};border-radius:2px;font-size:16px;font-weight:700;color:${COR.tinta}">${e(conteudo.destaque)}</td></tr></table>`
    : "";
  const rodape = conteudo.rodape
    .map((texto) => `<p style="margin:0 0 8px;font-size:13px;line-height:1.5;color:${COR.tintaFraca}">${e(texto)}</p>`)
    .join("");

  return `<!doctype html>
<html lang="${e(conteudo.lang)}" dir="${dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>${e(conteudo.titulo)}</title>
</head>
<body style="margin:0;padding:0;background:${COR.faixa}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${e(conteudo.previa)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COR.faixa}">
<tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${COR.fundo};border:1px solid ${COR.linha};border-radius:4px;font-family:${FONTE};text-align:${lado}">
<tr><td style="padding:20px 28px;border-bottom:1px solid ${COR.linha}">
<table role="presentation" cellpadding="0" cellspacing="0" dir="ltr"><tr>${marcacoes()}<td style="padding-left:10px;font-size:17px;font-weight:700;color:${COR.tinta};white-space:nowrap">${e(conteudo.assinatura)}</td></tr></table>
</td></tr>
<tr><td style="padding:28px 28px 8px">
<h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;font-weight:700;color:${COR.tinta}">${e(conteudo.titulo)}</h1>
${paragrafos}${destaque}
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 22px"><tr><td style="background:${COR.tinta};border-radius:2px">
<a href="${e(conteudo.botao.href)}" style="display:inline-block;padding:13px 24px;font-family:${FONTE};font-size:16px;font-weight:700;color:${COR.fundo};text-decoration:none">${e(conteudo.botao.texto)}</a>
</td></tr></table>
<p style="margin:0 0 4px;font-size:13px;line-height:1.5;color:${COR.tintaFraca}">${e(conteudo.linkReserva)}</p>
<p style="margin:0 0 24px;font-size:13px;line-height:1.5;word-break:break-all"><a href="${e(conteudo.botao.href)}" style="color:${COR.destaque}">${e(conteudo.botao.href)}</a></p>
</td></tr>
<tr><td style="padding:18px 28px 14px;background:${COR.painel};border-top:1px solid ${COR.linha};border-radius:0 0 4px 4px">${rodape}</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

// A mesma mensagem em texto puro, para quem lê sem HTML (e para o filtro de spam, que desconfia de e-mail só HTML)
export function textoDoEmail(conteudo: ConteudoEmail): string {
  return [
    conteudo.titulo,
    "",
    ...conteudo.paragrafos.flatMap((paragrafo) => [paragrafo, ""]),
    ...(conteudo.destaque ? [conteudo.destaque, ""] : []),
    `${conteudo.botao.texto}: ${conteudo.botao.href}`,
    "",
    ...conteudo.rodape,
    "",
    conteudo.assinatura,
  ].join("\n");
}
