import { Languages } from "lucide-react";
import { infoIdioma, ehIdioma } from "@/idiomas";
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
// inglês quando o idioma da interface ainda não tem tradução da documentação (Nielsen 1, visibilidade do estado)
export async function AvisoDeIdioma({ versao }: { versao: Versao }) {
  if (versao.idioma === IDIOMA_ORIGINAL) return null;
  const t = await tradutor();
  return (
    <p className={estilos.avisoIdioma} role="note">
      <Languages size={18} strokeWidth={1.5} aria-hidden="true" />
      <span>
        {versao.substituta
          ? t("Este documento ainda não foi traduzido para o seu idioma. Você está lendo a versão em inglês.")
          : t("Traduzido do original em português. Ainda falta a revisão de um falante nativo.")}
      </span>
    </p>
  );
}
