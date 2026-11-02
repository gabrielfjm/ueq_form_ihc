import type { Metadata } from "next";
import { infoIdioma } from "@/idiomas";
import { ProvedorTraducao } from "@/traducao/cliente";
import { dicionarioDoCliente, idiomaExibido, tradutor } from "@/traducao/servidor";
import { classesDasFontes } from "../fontes";
import "../globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const t = await tradutor();
  return {
    title: t("Ferramenta UEQ"),
    description: t("Estudos de avaliação de experiência do usuário com o User Experience Questionnaire"),
  };
}

// Layout raiz da ferramenta do pesquisador, no idioma da conta (Minha conta › Idioma); antes de entrar,
// no último escolhido neste navegador. O link do participante (/r/...) tem o seu próprio layout raiz,
// porque o idioma dele é o escolhido por quem responde. O <html lang> e a direção acompanham (WCAG 3.1.1)
export default async function LayoutFerramenta({ children }: Readonly<{ children: React.ReactNode }>) {
  const [t, { idioma, dicionario }, exibido] = await Promise.all([tradutor(), dicionarioDoCliente(), idiomaExibido()]);
  const info = infoIdioma(exibido);
  return (
    <html lang={info.lang} dir={info.direcao} className={classesDasFontes}>
      <body>
        <a href="#conteudo" className="pular-conteudo">
          {t("Pular para o conteúdo")}
        </a>
        <ProvedorTraducao idioma={idioma} lang={info.lang} dicionario={dicionario}>
          {children}
        </ProvedorTraducao>
      </body>
    </html>
  );
}
