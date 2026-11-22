import { Languages } from "lucide-react";
import { infoIdioma, ehIdioma } from "@/idiomas";
import { REPOSITORIO } from "@/lib/documentacao/catalogo";
import { IDIOMA_ORIGINAL } from "@/lib/documentacao/idiomas";
import type { Versao } from "@/lib/documentacao/versoes";
import { tradutor } from "@/traducao/servidor";
import estilos from "./documentacao.module.css";

// O idioma em que o texto do documento está, para o atributo lang (WCAG 3.1.2): na versão substituta ele é o
// inglês, mesmo com a interface em outro idioma
export function langDaVersao(versao: Versao): string {
  return ehIdioma(versao.idioma) ? infoIdioma(versao.idioma).lang : versao.idioma;
}

// Diz em que idioma a pessoa está lendo, antes do texto: tradução sem revisão de falante nativo, ou a versão em
// inglês quando o idioma da interface não tem tradução da documentação (Nielsen 1, visibilidade do estado). Neste
// caso convida a traduzir: o projeto é de código aberto e a tradução entra por fork e pull request
export async function AvisoDeIdioma({ versao }: { versao: Versao }) {
  if (versao.idioma === IDIOMA_ORIGINAL) return null;
  const t = await tradutor();
  return (
    <p className={estilos.avisoIdioma} role="note">
      <Languages size={18} strokeWidth={1.5} aria-hidden="true" />
      <span>
        {versao.substituta ? (
          <>
            {t(
              "A documentação não está disponível no seu idioma, então você está lendo a versão em inglês. A ferramenta é de código aberto: se quiser traduzi-la do inglês para o seu idioma, faça um fork no GitHub e abra um pull request quando terminar, para a equipe revisar e publicar.",
            )}{" "}
            <a href={REPOSITORIO} rel="noopener">
              {t("github.com/gabrielfjm/ueq_form_ihc")}
            </a>
          </>
        ) : (
          t("Traduzido do original em português. Ainda falta a revisão de um falante nativo.")
        )}
      </span>
    </p>
  );
}
