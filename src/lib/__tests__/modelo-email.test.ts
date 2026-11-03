import { describe, expect, it } from "vitest";
import { htmlDoEmail, textoDoEmail, type ConteudoEmail } from "../modelo-email";

const base: ConteudoEmail = {
  lang: "pt-BR",
  previa: "Luiza convidou você",
  titulo: "Luiza convidou você para o estudo “Portal do aluno”",
  paragrafos: ["Olá!", "Como editor, você pode editar o estudo."],
  destaque: "Portal do aluno",
  botao: { texto: "Abrir os convites na ferramenta", href: "https://ferramenta-ueq.vercel.app/notificacoes" },
  linkReserva: "Se o botão não funcionar, copie e cole este endereço no navegador:",
  rodape: ["Para aceitar ou recusar, entre na ferramenta e abra Convites."],
  assinatura: "Ferramenta UEQ",
};

describe("modelo dos e-mails", () => {
  it("monta o HTML com o idioma, o botão, o link reserva e o rodapé", () => {
    const html = htmlDoEmail(base);
    expect(html).toContain('<html lang="pt-BR" dir="ltr">');
    expect(html.match(/href="https:\/\/ferramenta-ueq\.vercel\.app\/notificacoes"/g)).toHaveLength(2);
    expect(html).toContain("Abrir os convites na ferramenta");
    expect(html).toContain("Para aceitar ou recusar");
    // Sem imagens nem CSS externo: nada para o programa de e-mail bloquear
    expect(html).not.toMatch(/<img|<link|<style/);
  });

  it("escapa o que vem do pesquisador (nome, título do estudo)", () => {
    const html = htmlDoEmail({ ...base, titulo: '<script>alert("x")</script>', destaque: "A & B" });
    expect(html).not.toContain("<script>");
    expect(html).toContain("&#60;script&#62;");
    expect(html).toContain("A &#38; B");
  });

  it("vira da direita para a esquerda em árabe, hebraico e persa", () => {
    expect(htmlDoEmail({ ...base, lang: "ar" })).toContain('<html lang="ar" dir="rtl">');
    expect(htmlDoEmail({ ...base, lang: "he" })).toContain("border-right:3px solid");
  });

  it("tem a mesma mensagem em texto puro", () => {
    const texto = textoDoEmail(base);
    expect(texto.startsWith(base.titulo)).toBe(true);
    expect(texto).toContain("Abrir os convites na ferramenta: https://ferramenta-ueq.vercel.app/notificacoes");
    expect(texto.trim().endsWith("Ferramenta UEQ")).toBe(true);
  });
});
