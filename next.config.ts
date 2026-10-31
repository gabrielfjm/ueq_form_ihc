import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  // Há dois layouts raiz (a ferramenta em pt-BR e o link do participante no idioma escolhido)
  experimental: { globalNotFound: true },
  // O painel em PDF roda um navegador no servidor: os dois pacotes ficam fora do bundle da função
  serverExternalPackages: ["@sparticuz/chromium-min", "playwright", "playwright-core"],
  // A aba Documentação e os downloads dela leem docs/ em tempo de execução
  outputFileTracingIncludes: {
    "/documentacao{,/**}": ["./docs/**/*"],
    "/api/documentacao/**": ["./docs/**/*"],
  },
};

export default nextConfig;
