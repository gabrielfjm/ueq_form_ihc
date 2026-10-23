"use client";

import { useEffect, useRef, useState, useTransition, type FormEvent } from "react";
import { MensagemStatus } from "@/componentes/formulario/MensagemStatus";
import formulario from "@/componentes/formulario/formulario.module.css";
import { ItemDiferencial } from "@/componentes/ItemDiferencial";
import { desistir, enviarRespostas } from "../acoes";
import estilos from "./questionario.module.css";
import { RodapeProgresso } from "./RodapeProgresso";
import { useRascunho } from "./useRascunho";

type Item = { numero: number; termoEsquerdo: string; termoDireito: string };

type Propriedades = {
  slug: string;
  participacaoId: string;
  tituloDocumento: string;
  itens: Item[];
  children: React.ReactNode;
};

// Anuncia o progresso só a cada 5 itens e ao completar, para não poluir o leitor de tela (docs/ihc.md §4.1)
function anuncioDeProgresso(respondidos: number, total: number): string | null {
  if (respondidos === total) return `Todos os ${total} itens respondidos. Você já pode enviar.`;
  return respondidos > 0 && respondidos % 5 === 0 ? `${respondidos} de ${total} respondidos.` : null;
}

// "Falta 1 item" / "Faltam 2 itens" (protótipo p3)
function quantosFaltam(quantidade: number): string {
  return quantidade === 1 ? "Falta 1 item" : `Faltam ${quantidade} itens`;
}

export function FormularioQuestionario({ slug, participacaoId, tituloDocumento, itens, children }: Propriedades) {
  const { respostas, setRespostas, recuperadas, limparRascunho } = useRascunho(`ueq:${slug}:${participacaoId}`);
  const [faltando, setFaltando] = useState<number[]>([]);
  const [erroEnvio, setErroEnvio] = useState("");
  const [envio, setEnvio] = useState(0);
  const [anuncio, setAnuncio] = useState("");
  const [enviando, iniciarEnvio] = useTransition();
  const resumo = useRef<HTMLDivElement>(null);
  const total = itens.length;
  const respondidos = itens.filter((item) => respostas[item.numero] !== undefined).length;

  useEffect(() => {
    if (envio === 0) return;
    document.title = faltando.length > 0 ? `${quantosFaltam(faltando.length)} · ${tituloDocumento}` : tituloDocumento;
    if (faltando.length > 0 || erroEnvio) resumo.current?.focus();
    // só a cada envio: marcar um item depois não deve puxar o foco de volta para o resumo
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [envio]);

  function marcar(numero: number, valor: number) {
    const proximas = { ...respostas, [numero]: valor };
    setRespostas(proximas);
    setFaltando((atual) => atual.filter((n) => n !== numero));
    const contagem = itens.filter((item) => proximas[item.numero] !== undefined).length;
    if (contagem !== respondidos) setAnuncio(anuncioDeProgresso(contagem, total) ?? anuncio);
  }

  function aoEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (enviando) return;
    // Validação só no envio, nunca a cada item (docs/ihc.md §4.1)
    const semResposta = itens.filter((item) => respostas[item.numero] === undefined).map((item) => item.numero);
    setErroEnvio("");
    if (semResposta.length > 0) {
      setFaltando(semResposta);
      setEnvio((atual) => atual + 1);
      return;
    }
    iniciarEnvio(async () => {
      limparRascunho();
      const resultado = await enviarRespostas(slug, respostas);
      setRespostas(respostas);
      setFaltando(resultado.faltando ?? []);
      setErroEnvio(resultado.erro ?? "");
      setEnvio((atual) => atual + 1);
    });
  }

  function irParaItem(numero: number) {
    document.querySelector<HTMLInputElement>(`input[name="item-${numero}"]`)?.focus();
  }

  function sair() {
    limparRascunho();
    void desistir(slug);
  }

  const lista = faltando.join(", ").replace(/, (\d+)$/, " e $1");

  return (
    <>
      <main id="conteudo" tabIndex={-1} className={estilos.principal}>
        <p className={estilos.etapa}>Etapa 2 de 3 · Questionário</p>
        {recuperadas && <MensagemStatus mensagem="Recuperamos as respostas que você já tinha marcado." />}
        {(faltando.length > 0 || erroEnvio) && (
          <div ref={resumo} tabIndex={-1} role="alert" aria-labelledby="resumo-erros" className={estilos.resumo}>
            <h2 id="resumo-erros" className={estilos.resumoTitulo}>
              {erroEnvio ? "Não deu para enviar" : `${quantosFaltam(faltando.length)}: ${lista}`}
            </h2>
            <p>{erroEnvio || "Marque uma opção em cada um para enviar. Suas outras respostas continuam marcadas."}</p>
            {faltando.length > 0 && (
              <ul>
                {faltando.map((numero) => (
                  <li key={numero}>
                    <a
                      href={`#item-${numero}`}
                      onClick={(evento) => {
                        evento.preventDefault();
                        irParaItem(numero);
                      }}
                    >
                      Ir para o item {numero}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        {children}
        <form className={estilos.formulario} noValidate onSubmit={aoEnviar}>
          <div className={estilos.itens}>
            {itens.map((item) => (
              <ItemDiferencial
                key={item.numero}
                numero={item.numero}
                total={total}
                termoEsquerdo={item.termoEsquerdo}
                termoDireito={item.termoDireito}
                valor={respostas[item.numero]}
                faltando={faltando.includes(item.numero)}
                aoMarcar={(valor) => marcar(item.numero, valor)}
              />
            ))}
          </div>
          <button type="submit" className={`${formulario.botao} ${formulario.primario} ${estilos.enviar}`}>
            Enviar respostas
          </button>
        </form>
        <p aria-live="polite" className="visualmente-oculto">
          {anuncio}
        </p>
      </main>
      <RodapeProgresso respondidos={respondidos} total={total} aoSair={sair} />
    </>
  );
}
