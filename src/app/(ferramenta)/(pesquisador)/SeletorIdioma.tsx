"use client";

import { Check, Languages } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { BotaoEnvio } from "@/componentes/formulario/BotaoEnvio";
import { useT } from "@/traducao/cliente";
import type { OpcaoIdioma } from "@/traducao/nucleo";
import { trocarIdioma } from "./acoes";
import sino from "./sino.module.css";
import estilos from "./seletor-idioma.module.css";

// Atalho na barra para trocar o idioma da ferramenta sem ir até Minha conta › Idioma (protótipo r41).
// Abre por baixo, como o sino: não é modal, fecha com Esc ou clicando fora. Cada idioma é um botão, pelo
// próprio nome: só o clique troca, nada muda ao passar pela lista (WCAG 3.2.2)
export function SeletorIdioma({ idiomas, comConta }: { idiomas: OpcaoIdioma[]; comConta: boolean }) {
  const t = useT();
  const caminho = usePathname();
  const [aberto, setAberto] = useState(false);
  const caixa = useRef<HTMLSpanElement>(null);
  const botao = useRef<HTMLButtonElement>(null);
  const atual = idiomas.find((idioma) => idioma.codigo === t.idioma) ?? idiomas[0]!;
  const sigla = atual.codigo.toUpperCase();

  // Ao navegar ou depois de trocar o idioma, a lista fecha (ajuste na renderização, como o sino)
  const [estado, setEstado] = useState({ caminho, idioma: atual.codigo });
  if (estado.caminho !== caminho || estado.idioma !== atual.codigo) {
    setEstado({ caminho, idioma: atual.codigo });
    setAberto(false);
  }
  // Com a lista fechada, o botão apertado some: o foco volta para o seletor, já no idioma novo.
  // Só quando a troca saiu daqui (Minha conta › Idioma também muda o idioma)
  const enviou = useRef(false);
  useEffect(() => {
    if (!enviou.current) return;
    enviou.current = false;
    botao.current?.focus();
  }, [atual.codigo]);

  useEffect(() => {
    if (!aberto) return;
    function fora(evento: MouseEvent) {
      if (caixa.current && !caixa.current.contains(evento.target as Node)) setAberto(false);
    }
    document.addEventListener("mousedown", fora);
    return () => document.removeEventListener("mousedown", fora);
  }, [aberto]);

  function aoTeclar(evento: KeyboardEvent<HTMLSpanElement>) {
    if (evento.key !== "Escape" || !aberto) return;
    evento.stopPropagation();
    setAberto(false);
    botao.current?.focus();
  }

  const rotulo = t("Idioma: {idioma}", { idioma: atual.nome });

  return (
    <span ref={caixa} className={`${sino.caixa} ${estilos.caixa}`} onKeyDown={aoTeclar}>
      <button
        ref={botao}
        type="button"
        className={sino.botao}
        aria-expanded={aberto}
        aria-controls="lista-idiomas"
        title={t("Idioma")}
        data-tutorial="idioma"
        onClick={() => setAberto(!aberto)}
      >
        <Languages size={18} strokeWidth={1.5} aria-hidden="true" />
        {/* No computador aparece só a sigla, e o nome completo fica para o leitor de tela, depois dela (WCAG 2.5.3);
            no menu do celular aparece o nome completo */}
        <span className={estilos.sigla}>{sigla}</span>
        <span className={estilos.rotulo}>{rotulo}</span>
      </button>
      <div id="lista-idiomas" className={`${sino.painel} ${estilos.painel}`} hidden={!aberto} role="region" aria-label={t("Idioma da ferramenta")}>
        <div className={sino.cabecalho}>
          <h2 className={sino.titulo}>{t("Idioma da ferramenta")}</h2>
        </div>
        {comConta && (
          <p className={estilos.explicacao}>
            {t("O idioma da ferramenta e o idioma padrão dos estudos que você cria. Quem responde pode trocar o idioma do questionário a qualquer momento.")}
          </p>
        )}
        <form
          action={trocarIdioma}
          onSubmit={() => {
            enviou.current = true;
          }}
        >
          <ul className={estilos.lista}>
            {idiomas.map((idioma) => {
              const eAtual = idioma.codigo === atual.codigo;
              return (
                <li key={idioma.codigo}>
                  <BotaoEnvio
                    name="idioma"
                    value={idioma.codigo}
                    className={estilos.opcao}
                    aria-current={eAtual ? "true" : undefined}
                    textoEnviando={t("Aguarde…")}
                    icone={eAtual ? <Check size={16} strokeWidth={2} aria-hidden="true" /> : undefined}
                  >
                    <span lang={idioma.lang} dir={idioma.direcao}>
                      {idioma.nome}
                    </span>
                  </BotaoEnvio>
                </li>
              );
            })}
          </ul>
        </form>
      </div>
    </span>
  );
}
