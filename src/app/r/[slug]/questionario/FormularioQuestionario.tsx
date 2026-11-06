"use client";

import { useEffect, useRef, useState, useTransition, type FormEvent } from "react";
import { MensagemStatus } from "@/componentes/formulario/MensagemStatus";
import formulario from "@/componentes/formulario/formulario.module.css";
import { ItemDiferencial } from "@/componentes/ItemDiferencial";
import { formatar, listaDeNumeros, plural } from "@/idiomas/formatar";
import type { TextosParticipante } from "@/idiomas/tipos";
import { desistir, enviarRespostas, type ResultadoEnvio } from "../acoes";
import estilos from "./questionario.module.css";
import { RodapeProgresso } from "./RodapeProgresso";
import { useRascunho } from "./useRascunho";
import { BotaoEnvio } from "@/componentes/formulario/BotaoEnvio";

type Item = { numero: number; termoEsquerdo: string; termoDireito: string };

type Propriedades = {
  slug: string;
  participacaoId: string;
  tituloDocumento: string;
  itens: Item[];
  textos: TextosParticipante["questionario"];
  aguarde: string;
  lang: string;
  direcao: "ltr" | "rtl";
  children: React.ReactNode;
};

export function FormularioQuestionario({
  slug,
  participacaoId,
  tituloDocumento,
  itens,
  textos,
  aguarde,
  lang,
  direcao,
  children,
}: Propriedades) {
  const { respostas, setRespostas, recuperadas, limparRascunho } = useRascunho(`ueq:${slug}:${participacaoId}`);
  const [faltando, setFaltando] = useState<number[]>([]);
  const [erroEnvio, setErroEnvio] = useState<ResultadoEnvio["erro"]>();
  const [envio, setEnvio] = useState(0);
  const [anuncio, setAnuncio] = useState("");
  const [enviando, iniciarEnvio] = useTransition();
  const resumo = useRef<HTMLDivElement>(null);
  const total = itens.length;
  const respondidos = itens.filter((item) => respostas[item.numero] !== undefined).length;
  // "Falta 1 item" / "Faltam 2 itens" (protótipo p3), com o plural de cada idioma
  const quantosFaltam = (quantidade: number) => plural(textos.faltam, quantidade, lang);

  // Anuncia o progresso só a cada 5 itens e ao completar, para não poluir o leitor de tela (docs/ihc.md §4.1)
  function anuncioDeProgresso(contagem: number): string | null {
    if (contagem === total) return formatar(textos.todosRespondidos, { total });
    return contagem > 0 && contagem % 5 === 0 ? formatar(textos.parcial, { n: contagem, total }) : null;
  }

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
    if (contagem !== respondidos) setAnuncio(anuncioDeProgresso(contagem) ?? anuncio);
  }

  function aoEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (enviando) return;
    // Validação só no envio, nunca a cada item (docs/ihc.md §4.1)
    const semResposta = itens.filter((item) => respostas[item.numero] === undefined).map((item) => item.numero);
    setErroEnvio(undefined);
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
      setErroEnvio(resultado.erro);
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

  const mensagemErro =
    erroEnvio === "encerrada" ? textos.erroEncerrada : erroEnvio === "sem-participacao" ? textos.erroSemParticipacao : "";

  return (
    <>
      <main id="conteudo" tabIndex={-1} className={estilos.principal}>
        {recuperadas && <MensagemStatus mensagem={textos.recuperadas} />}
        {(faltando.length > 0 || erroEnvio) && (
          <div ref={resumo} tabIndex={-1} role="alert" aria-labelledby="resumo-erros" className={estilos.resumo}>
            <h2 id="resumo-erros" className={estilos.resumoTitulo}>
              {erroEnvio ? textos.naoDeuEnviar : `${quantosFaltam(faltando.length)}: ${listaDeNumeros(faltando, lang)}`}
            </h2>
            <p>{mensagemErro || textos.marqueCadaUm}</p>
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
                      {formatar(textos.irParaItem, { n: numero })}
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
                textos={textos}
                direcao={direcao}
              />
            ))}
          </div>
          <BotaoEnvio
            semIndicador
            enviando={enviando}
            textoEnviando={aguarde}
            className={`${formulario.botao} ${formulario.primario} ${estilos.enviar}`}
          >
            {textos.enviar}
          </BotaoEnvio>
        </form>
        <p aria-live="polite" className="visualmente-oculto">
          {anuncio}
        </p>
      </main>
      <RodapeProgresso respondidos={respondidos} total={total} aoSair={sair} textos={textos} />
    </>
  );
}
