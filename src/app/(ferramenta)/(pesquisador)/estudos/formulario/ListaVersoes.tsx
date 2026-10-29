"use client";

import { Plus, X } from "lucide-react";
import { useEffect, useRef } from "react";
import formulario from "@/componentes/formulario/formulario.module.css";
import type { ErroCampo } from "@/lib/formulario";
import { MAXIMO_VERSOES } from "@/lib/validacao-estudo";
import estilos from "./formulario-estudo.module.css";

export type VersaoEditavel = {
  // chave local da linha; id vazio = versão nova, ainda não gravada
  chave: string;
  id: string;
  nome: string;
  respostas: number;
};

type Propriedades = {
  versoes: VersaoEditavel[];
  sugerida: boolean;
  erros?: Partial<Record<string, ErroCampo>>;
  aoMudarNome: (chave: string, nome: string) => void;
  aoAdicionar: () => string;
  aoRemover: (chave: string) => void;
};

export function idDoCampoVersao(chave: string): string {
  return `versao-${chave}`;
}

export function ListaVersoes({ versoes, sugerida, erros, aoMudarNome, aoAdicionar, aoRemover }: Propriedades) {
  const botaoAdicionar = useRef<HTMLButtonElement>(null);
  // Para onde o foco vai depois que a lista renderizar: o campo novo ou o botão de adicionar
  const focarDepois = useRef<string | "adicionar" | null>(null);

  useEffect(() => {
    if (!focarDepois.current) return;
    if (focarDepois.current === "adicionar") botaoAdicionar.current?.focus();
    else document.getElementById(idDoCampoVersao(focarDepois.current))?.focus();
    focarDepois.current = null;
  }, [versoes.length]);

  return (
    <>
      {versoes.map((versao, posicao) => {
        const id = idDoCampoVersao(versao.chave);
        const erro = erros?.[`versao-${posicao + 1}`];
        const ajuda =
          versao.respostas > 0
            ? `Já tem ${versao.respostas} ${versao.respostas === 1 ? "resposta" : "respostas"} e não pode ser removida.`
            : posicao === 0 && sugerida
              ? "Sugerido a partir do produto avaliado. Pode trocar."
              : null;
        const descricao = [ajuda ? `${id}-ajuda` : null, erro ? `${id}-erro` : null].filter(Boolean).join(" ");
        return (
          <div key={versao.chave} className={formulario.grupo}>
            <input type="hidden" name="versaoId" value={versao.id} />
            <label htmlFor={id} className={formulario.rotulo}>
              Versão {posicao + 1}
            </label>
            {ajuda && (
              <p id={`${id}-ajuda`} className={formulario.ajuda}>
                {ajuda}
              </p>
            )}
            <div className={estilos.linhaVersao}>
              <input
                id={id}
                name="versaoNome"
                type="text"
                className={formulario.campo}
                value={versao.nome}
                onChange={(evento) => aoMudarNome(versao.chave, evento.target.value)}
                aria-invalid={erro ? true : undefined}
                aria-describedby={descricao || undefined}
              />
              {/* Protótipo r4: a primeira versão fica sempre; só as seguintes têm "Remover" */}
              {posicao > 0 && versao.respostas === 0 && (
                <button
                  type="button"
                  className={formulario.botaoTexto}
                  onClick={() => {
                    focarDepois.current = "adicionar";
                    aoRemover(versao.chave);
                  }}
                >
                  <X size={18} strokeWidth={1.5} aria-hidden="true" />
                  <span>Remover versão {posicao + 1}</span>
                </button>
              )}
            </div>
            {erro && (
              <p id={`${id}-erro`} className={formulario.erro}>
                {erro.mensagem}
              </p>
            )}
          </div>
        );
      })}
      {versoes.length < MAXIMO_VERSOES ? (
        <button
          ref={botaoAdicionar}
          type="button"
          className={`${formulario.botao} ${formulario.secundario} ${estilos.adicionar}`}
          onClick={() => {
            focarDepois.current = aoAdicionar();
          }}
        >
          <Plus size={18} strokeWidth={1.5} aria-hidden="true" />
          <span>Adicionar versão</span>
        </button>
      ) : (
        <p className={formulario.ajuda}>Chegou ao limite de {MAXIMO_VERSOES} versões por estudo.</p>
      )}
    </>
  );
}
