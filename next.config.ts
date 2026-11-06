import type { NextConfig } from "next";

const desenvolvimento = process.env.NODE_ENV !== "production";

// Política de conteúdo: só o próprio site carrega script, estilo, fonte, imagem e conexão. Ninguém pode
// pôr a ferramenta dentro de um iframe (clickjacking), e formulários só enviam para o próprio site.
// 'unsafe-inline' em script é o que o Next precisa para hidratar sem nonce; 'unsafe-eval' só no dev
const POLITICA_DE_CONTEUDO = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${desenvolvimento ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src 'self'${desenvolvimento ? " ws: wss:" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(desenvolvimento ? [] : ["upgrade-insecure-requests"]),
].join("; ");

// LGPD, art. 46: medidas técnicas de segurança também no transporte e no navegador
const CABECALHOS_DE_SEGURANCA = [
  { key: "Content-Security-Policy", value: POLITICA_DE_CONTEUDO },
  // Só HTTPS por 2 anos, inclusive no primeiro acesso depois deste
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  // O endereço do estudo (com o link do participante) não vaza para outros sites
  { key: "Referrer-Policy", value: "same-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  typedRoutes: true,
  poweredByHeader: false,
  // Há dois layouts raiz (a ferramenta em pt-BR e o link do participante no idioma escolhido)
  experimental: { globalNotFound: true },
  // O painel em PDF roda um navegador no servidor: os pacotes dele ficam fora do bundle da função
  serverExternalPackages: ["@sparticuz/chromium-min", "playwright", "playwright-core"],
  // A aba Documentação e os downloads dela leem docs/ em tempo de execução
  outputFileTracingIncludes: {
    "/documentacao{,/**}": ["./docs/**/*"],
    "/api/documentacao/**": ["./docs/**/*"],
  },
  async headers() {
    return [{ source: "/:path*", headers: CABECALHOS_DE_SEGURANCA }];
  },
};

export default nextConfig;
