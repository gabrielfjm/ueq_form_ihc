import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { IDIOMAS } from "@/idiomas";
import { chaveDoTexto, criarTradutor, type Dicionario } from "@/traducao/nucleo";

vi.mock("server-only", () => ({}));

const enviados: Record<string, unknown>[] = [];
let falharPara = "";
vi.mock("nodemailer", () => ({
  createTransport: () => ({
    sendMail: async (mensagem: Record<string, unknown>) => {
      if (mensagem.to === falharPara) {
        throw Object.assign(new Error("Invalid login"), { code: "EAUTH", responseCode: 535, response: "535-5.7.8 Username and Password not accepted" });
      }
      enviados.push(mensagem);
    },
    close: () => {},
  }),
}));

// O módulo lê as variáveis ao carregar: cada teste carrega de novo, com as variáveis dele
async function carregar(variaveis: Record<string, string>) {
  vi.resetModules();
  for (const [nome, valor] of Object.entries(variaveis)) vi.stubEnv(nome, valor);
  return import("../email");
}

const GMAIL = { SMTP_HOST: "smtp.gmail.com", SMTP_PORTA: "465", SMTP_USUARIO: "conta@gmail.com", SMTP_SENHA: "abcd efgh ijkl mnop" };

// As traduções que as migrações gravam, por idioma: o e-mail de cada conta sai no idioma dela
function dicionarioDasMigracoes(idioma: string): Dicionario {
  const pasta = join(process.cwd(), "prisma", "migrations");
  const dicionario: Dicionario = {};
  for (const migracao of readdirSync(pasta)) {
    let sql: string;
    try {
      sql = readFileSync(join(pasta, migracao, "migration.sql"), "utf8");
    } catch {
      continue;
    }
    for (const [, lingua, hash, texto] of sql.matchAll(/\(gen_random_uuid\(\)::text, '([a-z]+)', '([0-9a-f]+)', '((?:[^']|'')*)'\)/g)) {
      if (lingua === idioma) dicionario[hash!] = texto!.replaceAll("''", "'");
    }
  }
  return dicionario;
}

beforeEach(() => {
  enviados.length = 0;
  falharPara = "";
});
afterEach(() => {
  vi.unstubAllEnvs();
});

describe("envio de e-mail", () => {
  it("sem as variáveis, não envia e diz o que falta", async () => {
    const email = await carregar({ SMTP_HOST: "", SMTP_USUARIO: "", SMTP_SENHA: "" });
    expect(email.emailConfigurado()).toBe(false);
    const resultado = await email.enviarEmailComDetalhe({ para: "a@b.com", assunto: "x", texto: "x", html: "x" });
    expect(resultado).toEqual({ enviado: false, erro: "SMTP_HOST, SMTP_USUARIO ou SMTP_SENHA vazio" });
    expect(enviados).toHaveLength(0);
  });

  it("põe o nome da ferramenta no remetente só quando ele vem sem nome", async () => {
    const soEndereco = await carregar({ ...GMAIL, EMAIL_REMETENTE: "conta@gmail.com" });
    expect(soEndereco.configuracaoDoEmail().remetente).toBe('"Ferramenta UEQ" <conta@gmail.com>');
    const comNome = await carregar({ ...GMAIL, EMAIL_REMETENTE: "Equipe UEQ <conta@gmail.com>" });
    expect(comNome.configuracaoDoEmail().remetente).toBe("Equipe UEQ <conta@gmail.com>");
    const semRemetente = await carregar({ ...GMAIL, EMAIL_REMETENTE: "" });
    expect(semRemetente.configuracaoDoEmail().remetente).toBe('"Ferramenta UEQ" <conta@gmail.com>');
  });

  it("aceita a porta com espaços e volta para 465 quando ela não é número", async () => {
    expect((await carregar({ ...GMAIL, SMTP_PORTA: " 587 " })).configuracaoDoEmail().porta).toBe(587);
    expect((await carregar({ ...GMAIL, SMTP_PORTA: "abc" })).configuracaoDoEmail().porta).toBe(465);
  });

  it("aceita os valores colados com as aspas do .env e o servidor em maiúsculas", async () => {
    const email = await carregar({ SMTP_HOST: '"SMTP.Gmail.com"', SMTP_PORTA: '"465"', SMTP_USUARIO: "'conta@gmail.com'", SMTP_SENHA: '"abcd efgh ijkl mnop"', EMAIL_REMETENTE: "" });
    expect(email.configuracaoDoEmail()).toEqual({
      configurado: true,
      host: "smtp.gmail.com",
      porta: 465,
      usuario: "conta@gmail.com",
      remetente: '"Ferramenta UEQ" <conta@gmail.com>',
    });
  });

  it("envia vários pela mesma conexão e devolve a resposta do servidor de quem falhou", async () => {
    const email = await carregar({ ...GMAIL, EMAIL_REMETENTE: "conta@gmail.com" });
    falharPara = "b@exemplo.com";
    const erro = vi.spyOn(console, "error").mockImplementation(() => {});
    const resultado = await email.enviarVarios(
      ["a@exemplo.com", "b@exemplo.com", "c@exemplo.com"].map((para) => ({ para, assunto: "Aviso", texto: "t", html: "<p>t</p>" })),
    );
    expect(resultado).toEqual({ enviados: 2, falhas: 1, erro: "EAUTH · 535 · 535-5.7.8 Username and Password not accepted" });
    expect(enviados.map((mensagem) => mensagem.to)).toEqual(["a@exemplo.com", "c@exemplo.com"]);
    expect(enviados[0]?.from).toBe('"Ferramenta UEQ" <conta@gmail.com>');
    expect(erro).toHaveBeenCalledOnce();
    expect(String(erro.mock.calls[0]?.[0])).not.toContain("abcdefghijklmnop");
  });
});

describe("e-mails da ferramenta", () => {
  it("o convite leva a Notificações e cita Aceitar e Recusar, como a interface", async () => {
    const email = await carregar(GMAIL);
    const convite = email.emailDeConvite(criarTradutor("pt", {}), {
      quemConvidou: { nome: "Luiza", email: "luiza@exemplo.com" },
      para: "jean@exemplo.com",
      estudo: "Portal do aluno",
      papel: "EDITOR",
      link: "https://ferramenta-ueq.vercel.app/notificacoes",
    });
    expect(convite.texto).toContain("Para aceitar ou recusar, abra Notificações na ferramenta: https://ferramenta-ueq.vercel.app/notificacoes");
    expect(convite.html).toContain("Abrir as notificações");
    expect(convite.html).toContain("com Aceitar e Recusar");
    expect(convite.texto).not.toContain("Convites");
    expect(convite.responderPara).toBe("luiza@exemplo.com");
  });

  it("o aviso de nova versão sai no idioma da conta, com o nome da ferramenta e os rótulos daquele idioma", async () => {
    const email = await carregar(GMAIL);
    const ingles = email.emailDeNovaVersao(criarTradutor("en", dicionarioDasMigracoes("en")), "ana@exemplo.com", "https://ferramenta-ueq.vercel.app");
    expect(ingles.assunto).toBe("The UEQ Tool has a new version live");
    expect(ingles.html).toContain('<html lang="en" dir="ltr">');
    expect(ingles.texto).toContain("uncheck “Also receive notices by email” in My account");
    expect(ingles.texto).toContain("Open the tool: https://ferramenta-ueq.vercel.app");
    const arabe = email.emailDeNovaVersao(criarTradutor("ar", dicionarioDasMigracoes("ar")), "ana@exemplo.com", "https://ferramenta-ueq.vercel.app");
    expect(arabe.html).toContain('dir="rtl"');
    expect(arabe.assunto).toContain("أداة UEQ");
  });

  it("os textos novos do convite, do teste e do aviso de nova versão estão traduzidos nos 36 idiomas", async () => {
    const email = await carregar(GMAIL);
    const usados = new Set<string>();
    const anotar = Object.assign((texto: string) => (usados.add(texto), texto), { idioma: "pt", lang: "pt-BR" });
    email.emailDeNovaVersao(anotar, "a@b.com", "https://x");
    email.emailDeTeste(anotar, "a@b.com", "https://x");
    // Do convite, só o que mudou para acompanhar a interface; o resto (e o link reserva) já estava em produção
    const novos = [...usados].filter((texto) => texto !== "Ferramenta UEQ" && !texto.startsWith("Se o botão não funcionar"));
    novos.push(
      "Abrir as notificações",
      "O convite também aparece no sino de notificações, no alto da ferramenta, com Aceitar e Recusar.",
      "Para aceitar ou recusar, abra Notificações na ferramenta: {link}",
      // rodapé dos avisos do sino (notificacoes.ts) e a ajuda do Compartilhar
      "Você recebe estes avisos porque participa deste estudo. Para parar de receber por e-mail, desmarque “Receber os avisos também por e-mail” em Minha conta.",
      "A pessoa precisa ter conta na ferramenta. Ela aceita o convite pelo sino de notificações.",
    );
    expect(novos).toHaveLength(17);
    for (const { codigo } of IDIOMAS.filter(({ codigo }) => codigo !== "pt")) {
      const dicionario = dicionarioDasMigracoes(codigo);
      const faltando = novos.filter((texto) => !dicionario[chaveDoTexto(texto)]);
      expect(faltando, codigo).toEqual([]);
    }
  });
});
