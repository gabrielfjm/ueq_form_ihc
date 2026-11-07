"use client";

import { ArrowLeft, Maximize, ZoomIn, ZoomOut } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent } from "react";
import estilos from "./ampliado.module.css";
import { useT } from "@/traducao/cliente";

type Ampliado = { endereco: string; legenda: string };
type Arrasto = { x: number; y: number; esquerda: number; topo: number };

const ZOOM_MINIMO = 50;
const ZOOM_MAXIMO = 400;
const PASSO = 25;

// O artigo vem do Markdown do repositório. Clicar num diagrama (ou em "Abrir em tamanho real") abre o
// diagrama em tela cheia num <dialog> nativo: Esc fecha, o foco fica dentro dele enquanto está aberto
// e volta ao diagrama ao fechar (WCAG 2.1.2 e 2.4.3). A barra com Voltar e o zoom fica parada; só a área
// do diagrama rola. O zoom vai de 50% a 400% (botões, Ctrl + roda do mouse, ou + - 0, que só valem com
// a tela cheia aberta: WCAG 2.1.4). Com zoom, dá para arrastar o diagrama com o mouse, deslizar o dedo
// ou usar as setas na área
export function ArtigoDocumento({ html, className }: { html: string; className?: string }) {
  const t = useT();
  const janela = useRef<HTMLDialogElement>(null);
  const area = useRef<HTMLDivElement>(null);
  const origem = useRef<HTMLElement | null>(null);
  const arrasto = useRef<Arrasto | null>(null);
  // ponto do diagrama no centro da área antes de mudar o zoom, em fração da largura e da altura
  const centro = useRef<{ x: number; y: number } | null>(null);
  const [ampliado, setAmpliado] = useState<Ampliado | null>(null);
  const [zoom, setZoom] = useState(100);
  const [arrastando, setArrastando] = useState(false);

  function mudarZoom(novo: number) {
    const elemento = area.current;
    if (elemento && elemento.scrollWidth > 0) {
      centro.current = {
        x: (elemento.scrollLeft + elemento.clientWidth / 2) / elemento.scrollWidth,
        y: (elemento.scrollTop + elemento.clientHeight / 2) / elemento.scrollHeight,
      };
    }
    setZoom(Math.min(ZOOM_MAXIMO, Math.max(ZOOM_MINIMO, novo)));
  }

  // Depois do zoom, o mesmo ponto volta para o centro da área: quem está olhando um detalhe não perde o lugar
  useLayoutEffect(() => {
    const elemento = area.current;
    const ponto = centro.current;
    if (!elemento || !ponto) return;
    elemento.scrollLeft = ponto.x * elemento.scrollWidth - elemento.clientWidth / 2;
    elemento.scrollTop = ponto.y * elemento.scrollHeight - elemento.clientHeight / 2;
    centro.current = null;
  }, [zoom]);

  // Ctrl + roda do mouse muda o zoom do diagrama, não o da página. Precisa de passive: false para impedir o zoom do navegador
  useEffect(() => {
    const elemento = area.current;
    if (!elemento) return;
    const aoRolar = (evento: WheelEvent) => {
      if (!evento.ctrlKey) return;
      evento.preventDefault();
      setZoom((atual) => Math.min(ZOOM_MAXIMO, Math.max(ZOOM_MINIMO, atual + (evento.deltaY < 0 ? PASSO : -PASSO))));
    };
    elemento.addEventListener("wheel", aoRolar, { passive: false });
    return () => elemento.removeEventListener("wheel", aoRolar);
  }, []);

  function aoClicar(evento: MouseEvent<HTMLElement>) {
    const gatilho = (evento.target as HTMLElement).closest<HTMLElement>("[data-ampliar]");
    if (!gatilho) return;
    evento.preventDefault();
    origem.current = gatilho;
    centro.current = null;
    setZoom(100);
    setAmpliado({ endereco: gatilho.dataset.ampliar ?? "", legenda: gatilho.dataset.legenda ?? "Diagrama" });
    janela.current?.showModal();
  }

  function aoFechar() {
    setAmpliado(null);
    origem.current?.focus();
  }

  function aoTeclar(evento: KeyboardEvent<HTMLDialogElement>) {
    if (evento.ctrlKey || evento.metaKey || evento.altKey) return;
    if (evento.key === "+" || evento.key === "=") mudarZoom(zoom + PASSO);
    else if (evento.key === "-") mudarZoom(zoom - PASSO);
    else if (evento.key === "0") mudarZoom(100);
    else return;
    evento.preventDefault();
  }

  // Arrastar com o mouse move o diagrama; no toque, a própria rolagem da área já faz isso
  function aoApertar(evento: PointerEvent<HTMLDivElement>) {
    const elemento = area.current;
    if (evento.pointerType !== "mouse" || evento.button !== 0 || !elemento) return;
    arrasto.current = { x: evento.clientX, y: evento.clientY, esquerda: elemento.scrollLeft, topo: elemento.scrollTop };
    elemento.setPointerCapture(evento.pointerId);
    setArrastando(true);
  }

  function aoMover(evento: PointerEvent<HTMLDivElement>) {
    const elemento = area.current;
    const inicio = arrasto.current;
    if (!elemento || !inicio) return;
    elemento.scrollLeft = inicio.esquerda - (evento.clientX - inicio.x);
    elemento.scrollTop = inicio.topo - (evento.clientY - inicio.y);
  }

  function aoSoltar() {
    arrasto.current = null;
    setArrastando(false);
  }

  return (
    <>
      {/* HTML gerado dos .md do próprio repositório (src/lib/documentacao/markdown.ts) */}
      <article className={className} onClick={aoClicar} dangerouslySetInnerHTML={{ __html: html }} />
      <dialog ref={janela} className={estilos.janela} aria-labelledby="titulo-ampliado" onClose={aoFechar} onKeyDown={aoTeclar}>
        <div className={estilos.barra}>
          <button type="button" className={estilos.botao} onClick={() => janela.current?.close()} autoFocus>
            <ArrowLeft size={18} strokeWidth={1.5} aria-hidden="true" />
            <span>{t("Voltar")}</span>
          </button>
          <h2 id="titulo-ampliado" className={estilos.titulo}>
            {ampliado?.legenda}
          </h2>
          <div role="group" aria-label={t("Zoom")} className={estilos.zoom}>
            <button type="button" className={estilos.botao} onClick={() => mudarZoom(zoom - PASSO)} disabled={zoom <= ZOOM_MINIMO}>
              <ZoomOut size={18} strokeWidth={1.5} aria-hidden="true" />
              <span className={estilos.rotuloZoom}>{t("Diminuir")}</span>
            </button>
            <p role="status" className={estilos.nivel}>
              {zoom}%
            </p>
            <button type="button" className={estilos.botao} onClick={() => mudarZoom(zoom + PASSO)} disabled={zoom >= ZOOM_MAXIMO}>
              <ZoomIn size={18} strokeWidth={1.5} aria-hidden="true" />
              <span className={estilos.rotuloZoom}>{t("Aumentar")}</span>
            </button>
            <button type="button" className={estilos.botao} onClick={() => mudarZoom(100)} disabled={zoom === 100}>
              <Maximize size={18} strokeWidth={1.5} aria-hidden="true" />
              <span className={estilos.rotuloZoom}>{t("Ajustar à tela")}</span>
            </button>
          </div>
          <p className={estilos.dica}>{t("Esc fecha · + e - mudam o zoom · arraste para mover")}</p>
        </div>
        <div
          ref={area}
          className={arrastando ? `${estilos.area} ${estilos.arrastando}` : estilos.area}
          tabIndex={0}
          role="region"
          aria-label={t("Diagrama ampliado. Use as setas para mover")}
          onPointerDown={aoApertar}
          onPointerMove={aoMover}
          onPointerUp={aoSoltar}
          onPointerCancel={aoSoltar}
        >
          {ampliado && (
            // eslint-disable-next-line @next/next/no-img-element -- SVG do próprio servidor, sem otimização a fazer
            <img
              src={ampliado.endereco}
              alt={t("Diagrama: {legenda}. A descrição está no texto da seção.", { legenda: ampliado.legenda })}
              className={estilos.imagem}
              style={{ width: `${zoom}%` }}
              draggable={false}
            />
          )}
        </div>
      </dialog>
    </>
  );
}
