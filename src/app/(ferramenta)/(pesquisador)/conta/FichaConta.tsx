import { Download, ShieldCheck } from "lucide-react";
import Link from "next/link";
import formulario from "@/componentes/formulario/formulario.module.css";
import { enderecoDaPrivacidade } from "../../(publico)/privacidade/origem";
import estilos from "./conta.module.css";
import { tradutor } from "@/traducao/servidor";

type Propriedades = {
  estudos: number;
  detalheEstudos: string;
  respostas: number;
  criadaEm: string;
};

// docs/design.md, Layout: tela larga em duas colunas, conteúdo e ficha lateral
export async function FichaConta({ estudos, detalheEstudos, respostas, criadaEm }: Propriedades) {
  const t = await tradutor();
  return (
    <aside aria-labelledby="titulo-resumo" className={estilos.ficha}>
      <h2 id="titulo-resumo" className={estilos.fichaTitulo}>
        {t("Resumo da conta")}
      </h2>
      <dl className={estilos.fichaLista}>
        <div>
          <dt>{t("Estudos")}</dt>
          <dd>
            <span className={estilos.numeroGrande}>{estudos}</span>
            <span className={estilos.detalhe}>{t(detalheEstudos)}</span>
          </dd>
        </div>
        <div>
          <dt>{t("Respostas coletadas")}</dt>
          <dd>
            <span className={estilos.numeroGrande}>{respostas}</span>
            <span className={estilos.detalhe}>{t("somando todos os estudos")}</span>
          </dd>
        </div>
        <div>
          <dt>{t("Conta criada em")}</dt>
          <dd className={estilos.numero}>{t(criadaEm)}</dd>
        </div>
        <div className={estilos.fichaUltimo}>
          <dt>{t("Seus dados")}</dt>
          <dd className={estilos.detalhe}>
            {t("Guardamos só nome, e-mail e a senha como hash, que não dá para desfazer. As respostas dos participantes são anônimas.")}
          </dd>
          {/* LGPD, art. 18: ver, levar e entender os próprios dados sem pedir a ninguém */}
          <dd className={estilos.linksDados}>
            <a href="/api/conta/dados" download className={formulario.linkAcao}>
              <Download size={18} strokeWidth={1.5} aria-hidden="true" />
              <span>{t("Baixar meus dados")}</span>
            </a>
            <Link href={enderecoDaPrivacidade("/conta")} className={formulario.linkAcao}>
              <ShieldCheck size={18} strokeWidth={1.5} aria-hidden="true" />
              <span>{t("Política de privacidade")}</span>
            </Link>
          </dd>
        </div>
      </dl>
    </aside>
  );
}
