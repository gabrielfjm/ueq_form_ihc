"use client";

import { useEffect, useState } from "react";

type Respostas = Record<number, number>;

function lerRascunho(chave: string): Respostas {
  try {
    const salvo = JSON.parse(window.sessionStorage.getItem(chave) ?? "{}") as unknown;
    if (typeof salvo !== "object" || salvo === null) return {};
    // Só valores que poderiam ter sido marcados; qualquer outra coisa no storage é ignorada
    return Object.fromEntries(
      Object.entries(salvo).filter(([numero, valor]) => /^\d+$/.test(numero) && Number.isInteger(valor) && valor >= 1 && valor <= 7),
    );
  } catch {
    // sessionStorage bloqueado (modo privado, política do navegador): o questionário segue sem rascunho
    return {};
  }
}

function gravarRascunho(chave: string, respostas: Respostas) {
  try {
    window.sessionStorage.setItem(chave, JSON.stringify(respostas));
  } catch {
    // idem: sem storage, só não há recuperação se a página recarregar
  }
}

// docs/ihc.md §4.1 (ISO 9241-110, robustez a erro): recarregar ou voltar não apaga o que já foi marcado.
// sessionStorage morre com a aba, então nada fica no aparelho depois que a pessoa fecha o questionário
export function useRascunho(chave: string) {
  const [respostas, setEstado] = useState<Respostas>({});
  const [recuperadas, setRecuperadas] = useState(false);

  useEffect(() => {
    const salvas = lerRascunho(chave);
    if (Object.keys(salvas).length === 0) return;
    // Lido depois da hidratação: no servidor não existe sessionStorage, e ler antes faria o HTML divergir
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEstado(salvas);
    setRecuperadas(true);
  }, [chave]);

  function setRespostas(proximas: Respostas) {
    setEstado(proximas);
    gravarRascunho(chave, proximas);
  }

  function limparRascunho() {
    try {
      window.sessionStorage.removeItem(chave);
    } catch {
      // nada a limpar se o storage está bloqueado
    }
  }

  return { respostas, setRespostas, recuperadas, limparRascunho };
}
