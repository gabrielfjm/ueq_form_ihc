"use client";

import { LoaderCircle } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { createContext, Suspense, useCallback, useContext, useEffect, useId, useRef, useState, type ReactNode } from "react";
import formulario from "../formulario/formulario.module.css";
import janela from "../janela/janela.module.css";
import estilos from "./espera.module.css";
import { useT } from "@/traducao/cliente";
import { m } from "@/traducao/nucleo";

// Textos já traduzidos por quem pede o aviso
type Aviso = { titulo: string; texto?: string };
type Espera = Aviso & { id: number; visivel: boolean };

// O aviso só aparece se a espera passar disso: o que é rápido não pisca na tela (docs/design.md)
const ATRASO = 300;
// Se a navegação nunca terminar (o clique foi cancelado por outro código), o aviso sai sozinho
const LIMITE_NAVEGACAO = 15_000;

const NAVEGANDO: Aviso = { titulo: m("Carregando a página…") };
const BAIXANDO: Aviso = { titulo: m("Preparando o arquivo…"), texto: m("O download começa sozinho assim que o arquivo ficar pronto.") };
// Texto do aviso de um formulário enviado, abaixo do que o botão diz ("Criando o estudo…")
export const TEXTO_ENVIANDO = m("Aguarde um instante. Não feche nem atualize a página.");
const ERRO_DOWNLOAD: Aviso = { titulo: m("Não foi possível baixar o arquivo."), texto: m("Verifique a conexão e tente de novo.") };

// Fora da ferramenta (no link do participante) não há provedor e o aviso não aparece: lá a espera é só o
// texto "Aguarde…" no botão, no idioma de quem responde
const ContextoEspera = createContext<(aviso: Aviso) => () => void>(() => () => {});

// Mostra o aviso enquanto a ação roda; a função devolvida o tira
export function useEspera() {
  return useContext(ContextoEspera);
}

// Aviso de espera da ferramenta: um quadro estreito, sem botões, sobre a página escurecida, que diz o que está
// acontecendo enquanto uma página carrega, um arquivo é gerado para download ou um formulário é enviado
// (BotaoEnvio). Navegação e download são percebidos aqui, por delegação de clique, sem nada nos links
export function ProvedorEspera({ children }: { children: ReactNode }) {
  const t = useT();
  const idTitulo = useId();
  const idTexto = useId();
  const painel = useRef<HTMLDivElement>(null);
  const dialogo = useRef<HTMLDialogElement>(null);
  const [esperas, setEsperas] = useState<Espera[]>([]);
  const [erro, setErro] = useState<Aviso | null>(null);
  const proximo = useRef(0);
  const fimDaNavegacao = useRef<(() => void) | null>(null);

  const iniciar = useCallback((aviso: Aviso) => {
    const id = ++proximo.current;
    setEsperas((atuais) => [...atuais, { ...aviso, id, visivel: false }]);
    const relogio = window.setTimeout(
      () => setEsperas((atuais) => atuais.map((espera) => (espera.id === id ? { ...espera, visivel: true } : espera))),
      ATRASO,
    );
    let terminou = false;
    return () => {
      if (terminou) return;
      terminou = true;
      window.clearTimeout(relogio);
      setEsperas((atuais) => atuais.filter((espera) => espera.id !== id));
    };
  }, []);

  const terminarNavegacao = useCallback(() => {
    fimDaNavegacao.current?.();
    fimDaNavegacao.current = null;
  }, []);

  useEffect(() => {
    function navegar() {
      terminarNavegacao();
      const fim = iniciar({ titulo: t(NAVEGANDO.titulo) });
      const limite = window.setTimeout(fim, LIMITE_NAVEGACAO);
      fimDaNavegacao.current = () => {
        window.clearTimeout(limite);
        fim();
      };
    }

    async function baixar(link: HTMLAnchorElement, destino: URL) {
      const fim = iniciar({ titulo: t(BAIXANDO.titulo), texto: t(BAIXANDO.texto!) });
      try {
        const resposta = await fetch(destino, { credentials: "same-origin" });
        if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
        const nome =
          link.getAttribute("download") ||
          nomeDoCabecalho(resposta.headers.get("Content-Disposition")) ||
          decodeURIComponent(destino.pathname.split("/").pop() ?? "arquivo");
        const endereco = URL.createObjectURL(await resposta.blob());
        const temporario = document.createElement("a");
        temporario.href = endereco;
        temporario.download = nome;
        document.body.append(temporario);
        temporario.click();
        temporario.remove();
        window.setTimeout(() => URL.revokeObjectURL(endereco), 60_000);
      } catch {
        setErro({ titulo: t(ERRO_DOWNLOAD.titulo), texto: t(ERRO_DOWNLOAD.texto!) });
      } finally {
        fim();
      }
    }

    // Na fase de bolha da janela: o React (que escuta no document) já rodou, e o Link do Next já cancelou o
    // clique para navegar ele mesmo. Por isso a navegação não olha defaultPrevented, e o download olha
    function aoClicar(evento: MouseEvent) {
      if (evento.button !== 0 || evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey) return;
      const link = (evento.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement)) return;
      if (link.closest("[data-sem-espera]")) return;
      if (link.target && link.target !== "_self") return;
      const destino = new URL(link.href, window.location.href);
      if (destino.origin !== window.location.origin || !destino.protocol.startsWith("http")) return;
      if (link.hasAttribute("download")) {
        if (evento.defaultPrevented) return;
        evento.preventDefault();
        void baixar(link, destino);
        return;
      }
      // Âncora na mesma página ou a própria página: nada carrega
      if (destino.pathname === window.location.pathname && destino.search === window.location.search) return;
      if (destino.pathname.startsWith("/api/")) return;
      navegar();
    }

    window.addEventListener("click", aoClicar);
    window.addEventListener("popstate", terminarNavegacao);
    window.addEventListener("pagehide", terminarNavegacao);
    return () => {
      window.removeEventListener("click", aoClicar);
      window.removeEventListener("popstate", terminarNavegacao);
      window.removeEventListener("pagehide", terminarNavegacao);
    };
  }, [iniciar, terminarNavegacao, t]);

  // A espera mais recente que já passou do atraso
  const atual = esperas.findLast((espera) => espera.visivel) ?? null;

  // A espera é um popover manual, e não um <dialog> modal: fica por cima de tudo (até de uma janela aberta) e o
  // fundo escurecido segura o clique, mas a página não fica inerte nem perde o foco. Assim o formulário ainda põe
  // o foco no resumo de erros quando a ação volta (WCAG 2.4.3), e nada que estava aberto é fechado
  useEffect(() => {
    const elemento = painel.current;
    if (!elemento) return;
    const aberto = elemento.matches(":popover-open");
    if (atual && !aberto) elemento.showPopover();
    else if (!atual && aberto) elemento.hidePopover();
  }, [atual]);

  // O erro do download, este sim numa janela modal, porque pede que a pessoa leia e feche
  useEffect(() => {
    const elemento = dialogo.current;
    if (!elemento) return;
    const mostrar = erro !== null && esperas.length === 0;
    if (mostrar && !elemento.open) elemento.showModal();
    else if (!mostrar && elemento.open) elemento.close();
  }, [erro, esperas.length]);

  return (
    <ContextoEspera.Provider value={iniciar}>
      {children}
      <Suspense fallback={null}>
        <FimDaNavegacao aoMudar={terminarNavegacao} />
      </Suspense>
      <div ref={painel} popover="manual" aria-live="polite" aria-atomic="true" className={estilos.espera} data-aviso-espera>
        {atual && (
          <div className={estilos.conteudo}>
            <div className={estilos.linha}>
              <LoaderCircle size={24} strokeWidth={1.5} aria-hidden="true" className={formulario.girando} />
              <p className={estilos.titulo}>{atual.titulo}</p>
            </div>
            {atual.texto && <p className={janela.texto}>{atual.texto}</p>}
          </div>
        )}
      </div>
      <dialog
        ref={dialogo}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
        aria-describedby={idTexto}
        className={`${janela.janela} ${janela.confirmacao}`}
        onClose={() => setErro(null)}
      >
        {erro && (
          <div className={janela.formulario}>
            <h2 id={idTitulo} className={janela.titulo}>
              {erro.titulo}
            </h2>
            <p id={idTexto} className={janela.texto}>
              {erro.texto}
            </p>
            <div className={janela.acoes}>
              <button type="button" className={`${formulario.botao} ${formulario.primario}`} onClick={() => dialogo.current?.close()}>
                {t("Fechar")}
              </button>
            </div>
          </div>
        )}
      </dialog>
    </ContextoEspera.Provider>
  );
}

// Separado e dentro de Suspense porque useSearchParams no layout tiraria as páginas da geração estática
function FimDaNavegacao({ aoMudar }: { aoMudar: () => void }) {
  const caminho = usePathname();
  const consulta = useSearchParams().toString();
  useEffect(() => {
    aoMudar();
  }, [caminho, consulta, aoMudar]);
  return null;
}

function nomeDoCabecalho(cabecalho: string | null): string | null {
  if (!cabecalho) return null;
  const codificado = /filename\*=UTF-8''([^;]+)/i.exec(cabecalho);
  if (codificado?.[1]) return decodeURIComponent(codificado[1]);
  return /filename="?([^";]+)"?/i.exec(cabecalho)?.[1] ?? null;
}
