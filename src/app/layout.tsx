import type { Metadata } from "next";
import { Atkinson_Hyperlegible_Next, IBM_Plex_Mono, Newsreader } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin", "latin-ext"],
  weight: "variable",
  axes: ["opsz"],
  variable: "--fonte-newsreader-carregada",
});

const atkinson = Atkinson_Hyperlegible_Next({
  subsets: ["latin", "latin-ext"],
  weight: "variable",
  // next/font não tem métricas da Atkinson Next para ajustar o fallback; o Verdana de tokens.css cobre
  adjustFontFallback: false,
  variable: "--fonte-atkinson-carregada",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  variable: "--fonte-plex-mono-carregada",
});

export const metadata: Metadata = {
  title: "Ferramenta UEQ",
  description: "Estudos de avaliação de experiência do usuário com o User Experience Questionnaire",
};

export default function LayoutRaiz({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${newsreader.variable} ${atkinson.variable} ${plexMono.variable}`}
    >
      <body>
        <a href="#conteudo" className="pular-conteudo">
          Pular para o conteúdo
        </a>
        {children}
      </body>
    </html>
  );
}
