"use client";

import { CircleHelp, Compass, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId, useState } from "react";
import { enderecoDaPrivacidade } from "@/app/(ferramenta)/(publico)/privacidade/origem";
import formulario from "@/componentes/formulario/formulario.module.css";
import { Janela } from "@/componentes/janela/Janela";
import janela from "@/componentes/janela/janela.module.css";
import { iniciarTour } from "@/componentes/tutorial/eventos";
import { AJUDA, type ChaveAjuda } from "@/lib/ajuda";
import estilos from "./ajuda.module.css";
import { useT } from "@/traducao/cliente";

// O (?) do cabeçalho de cada página: explica para que serve a página e o que dá para fazer nela
// (Nielsen 10). Daqui também dá para rever o tour guiado a qualquer momento
export function BotaoAjuda({ pagina }: { pagina: ChaveAjuda }) {
  const t = useT();
  const caminho = usePathname();
  const [aberta, setAberta] = useState(false);
  const idTitulo = useId();
  const ajuda = AJUDA[pagina];

  return (
    <>
      <button
        type="button"
        className={estilos.botao}
        aria-haspopup="dialog"
        aria-label={t("Ajuda desta página")}
        data-tutorial="ajuda"
        onClick={() => setAberta(true)}
      >
        <CircleHelp size={22} strokeWidth={1.5} aria-hidden="true" />
      </button>
      <Janela aberta={aberta} aoFechar={() => setAberta(false)} idTitulo={idTitulo} tipo="conteudo">
        <div className={janela.formulario}>
          <div>
            <p className={estilos.chapeu}>{t("Ajuda desta página")}</p>
            <h2 id={idTitulo} className={janela.titulo}>
              {t(ajuda.titulo)}
            </h2>
          </div>
          <div className={janela.corpo}>
            <p className={janela.texto}>{t(ajuda.resumo)}</p>
            <dl className={estilos.secoes}>
              {ajuda.secoes.map((secao) => (
                <div key={secao.titulo}>
                  <dt>{t(secao.titulo)}</dt>
                  <dd>{t(secao.texto)}</dd>
                </div>
              ))}
            </dl>
            <p className={estilos.privacidade}>
              <Link href={enderecoDaPrivacidade(caminho)} className={formulario.linkAcao} onClick={() => setAberta(false)}>
                <ShieldCheck size={18} strokeWidth={1.5} aria-hidden="true" />
                <span>{t("Política de privacidade")}</span>
              </Link>
            </p>
          </div>
          <div className={janela.acoes}>
            <button
              type="button"
              className={`${formulario.botao} ${formulario.secundario}`}
              onClick={() => {
                setAberta(false);
                iniciarTour();
              }}
            >
              <Compass size={18} strokeWidth={1.5} aria-hidden="true" className={formulario.icone} />
              <span>{t("Rever o tour guiado")}</span>
            </button>
            <button
              type="button"
              className={`${formulario.botao} ${formulario.primario}`}
              data-foco-inicial=""
              onClick={() => setAberta(false)}
            >
              {t("Entendi")}
            </button>
          </div>
        </div>
      </Janela>
    </>
  );
}
