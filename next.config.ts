import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  // Há dois layouts raiz (a ferramenta em pt-BR e o link do participante no idioma escolhido)
  experimental: { globalNotFound: true },
};

export default nextConfig;
