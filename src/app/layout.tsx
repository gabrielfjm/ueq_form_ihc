import type { Metadata } from "next";
import { Atkinson_Hyperlegible_Next, Source_Sans_3 } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Ferramenta UEQ",
  description: "Estudos de avaliação de experiência do usuário com o User Experience Questionnaire",
};

export default function LayoutRaiz({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${atkinson.variable} ${sourceSans.variable}`}>
      <body>
        <a href="#conteudo" className="pular-conteudo">
          Pular para o conteúdo
        </a>
        {children}
      </body>
    </html>
  );
}
