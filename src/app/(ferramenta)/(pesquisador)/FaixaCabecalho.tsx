import type { ReactNode } from "react";
import estilos from "./pesquisador.module.css";

type Propriedades = {
  titulo: string;
  descricao?: string;
  // linha de números logo abaixo do título ("3 estudos · 1 com coleta aberta")
  resumo?: string;
  // link de volta ("Estudos") no lugar de "Área do pesquisador", como em Criar estudo
  migalha?: ReactNode;
  acao?: ReactNode;
};

// docs/design.md, Layout: faixa em --fundo-faixa no topo das páginas, com título e resumo
export function FaixaCabecalho({ titulo, descricao, resumo, migalha, acao }: Propriedades) {
  return (
    <div className={estilos.faixa}>
      <div className={migalha ? `${estilos.faixaInterna} ${estilos.faixaCompacta}` : estilos.faixaInterna}>
        <div className={estilos.faixaTextos}>
          {migalha ? <div className={estilos.migalha}>{migalha}</div> : <p className={estilos.area}>Área do pesquisador</p>}
          <h1 className={estilos.titulo}>{titulo}</h1>
          {descricao && <p className={estilos.descricao}>{descricao}</p>}
          {resumo && <p className={estilos.resumo}>{resumo}</p>}
        </div>
        {acao}
      </div>
    </div>
  );
}
