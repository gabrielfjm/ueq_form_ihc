import type { Metadata } from "next";
import { classesDasFontes } from "../fontes";
import "../globals.css";

export const metadata: Metadata = {
  title: "Ferramenta UEQ",
  description: "Estudos de avaliação de experiência do usuário com o User Experience Questionnaire",
};

// Layout raiz da ferramenta do pesquisador, sempre em português. O link do participante (/r/...)
// tem o seu próprio, porque o <html lang> acompanha o idioma escolhido (WCAG 3.1.1)
export default function LayoutFerramenta({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={classesDasFontes}>
      <body>
        <a href="#conteudo" className="pular-conteudo">
          Pular para o conteúdo
        </a>
        {children}
      </body>
    </html>
  );
}
