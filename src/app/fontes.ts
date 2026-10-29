import { Atkinson_Hyperlegible_Next, Source_Sans_3 } from "next/font/google";

// Compartilhadas pelos dois layouts raiz: a ferramenta (pt-BR) e o link do participante (idioma escolhido).
// Escritas sem latim (cirílico, árabe, devanágari, CJK…) caem nas fontes do sistema, via tokens.css
const atkinson = Atkinson_Hyperlegible_Next({
  subsets: ["latin", "latin-ext"],
  weight: "variable",
  // next/font não tem métricas da Atkinson Next para ajustar o fallback; o Verdana de tokens.css cobre
  adjustFontFallback: false,
  variable: "--fonte-atkinson-carregada",
});

// Só para números: a Atkinson tem zero cortado e algarismos tabulares largos (docs/design.md, Tipografia)
const sourceSans = Source_Sans_3({
  subsets: ["latin", "latin-ext"],
  weight: "variable",
  variable: "--fonte-source-sans-carregada",
});

export const classesDasFontes = `${atkinson.variable} ${sourceSans.variable}`;
