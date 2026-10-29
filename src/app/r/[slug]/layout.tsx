import { infoIdioma, textosDoIdioma } from "@/idiomas";
import { idiomaDoParticipante } from "@/lib/participacao";
import { classesDasFontes } from "../../fontes";
import "../../globals.css";

// Layout raiz do link do participante: <html lang> e dir seguem o idioma escolhido (WCAG 3.1.1).
// Trocar de idioma grava um cookie numa Server Action, e isso já faz o Next renderizar de novo o layout
export default async function LayoutParticipante({ children }: Readonly<{ children: React.ReactNode }>) {
  const idioma = infoIdioma(await idiomaDoParticipante());
  return (
    <html lang={idioma.lang} dir={idioma.direcao} className={classesDasFontes}>
      <body>
        <a href="#conteudo" className="pular-conteudo">
          {textosDoIdioma(idioma.codigo).pularConteudo}
        </a>
        {children}
      </body>
    </html>
  );
}
