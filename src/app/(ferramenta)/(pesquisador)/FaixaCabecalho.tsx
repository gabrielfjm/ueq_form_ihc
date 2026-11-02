import type { ReactNode } from "react";
import { BotaoAjuda } from "@/componentes/ajuda/BotaoAjuda";
import type { ChaveAjuda } from "@/lib/ajuda";
import estilos from "./pesquisador.module.css";
import { tradutor } from "@/traducao/servidor";

type Propriedades = {
  titulo: string;
  descricao?: string;
  // linha de números logo abaixo do título ("3 estudos · 1 com coleta aberta")
  resumo?: string;
  // link de volta ("Estudos") no lugar de "Área do pesquisador", como em Criar estudo
  migalha?: ReactNode;
  acao?: ReactNode;
  // conteúdo do botão (?) ao lado do título: toda página da área do pesquisador explica a si mesma
  ajuda: ChaveAjuda;
};

// docs/design.md, Layout: faixa em --fundo-faixa no topo das páginas, com título e resumo
export async function FaixaCabecalho({ titulo, descricao, resumo, migalha, acao, ajuda }: Propriedades) {
  const t = await tradutor();
  return (
    <div className={estilos.faixa}>
      <div className={migalha ? `${estilos.faixaInterna} ${estilos.faixaCompacta}` : estilos.faixaInterna}>
        <div className={estilos.faixaTextos}>
          {migalha ? <div className={estilos.migalha}>{migalha}</div> : <p className={estilos.area}>{t("Área do pesquisador")}</p>}
          <div className={estilos.linhaTitulo}>
            <h1 className={estilos.titulo}>{t(titulo)}</h1>
            <BotaoAjuda pagina={ajuda} />
          </div>
          {descricao && <p className={estilos.descricao}>{t(descricao)}</p>}
          {resumo && <p className={estilos.resumo}>{t(resumo)}</p>}
        </div>
        {acao}
      </div>
    </div>
  );
}
