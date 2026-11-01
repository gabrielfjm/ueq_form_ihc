"use client";

import { Compass, MousePointerClick, X } from "lucide-react";
import type { Route } from "next";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import formulario from "@/componentes/formulario/formulario.module.css";
import { Janela } from "@/componentes/janela/Janela";
import janela from "@/componentes/janela/janela.module.css";
import { marcarTutorialVisto, prepararTour } from "./acoes";
import { EVENTO_INICIAR_TOUR } from "./eventos";
import { PASSOS } from "./passos";
import estilos from "./tutorial.module.css";

// O passo atual fica no navegador: o tour atravessa várias páginas e continua depois de um recarregamento
const CHAVE = "ueq-tour";
// Marca local de que o tour foi dispensado: se a pessoa navega antes de o servidor gravar, ele não reabre
const CHAVE_VISTO = "ueq-tour-visto";
const FOLGA = 8;
const ESPERA_ALVO_MS = 3000;
const LARGURA_CARTAO = 380;

type Estado = { passo: number; estudoId: string };
type Retangulo = { top: number; left: number; width: number; height: number };

function lerEstado(): Estado | null {
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE) ?? "null") as Estado | null;
    return salvo && typeof salvo.passo === "number" && typeof salvo.estudoId === "string" ? salvo : null;
  } catch {
    return null;
  }
}

function medir(elemento: Element): Retangulo | null {
  const caixa = elemento.getBoundingClientRect();
  // Elemento escondido (o sino atrás do Menu no celular, por exemplo): o passo segue sem destaque
  if (caixa.width === 0 && caixa.height === 0) return null;
  return { top: caixa.top - FOLGA, left: caixa.left - FOLGA, width: caixa.width + FOLGA * 2, height: caixa.height + FOLGA * 2 };
}

const iguais = (a: Retangulo | null, b: Retangulo | null) =>
  a === b || (!!a && !!b && a.top === b.top && a.left === b.left && a.width === b.width && a.height === b.height);

// Tour guiado do primeiro acesso, como o tutorial de um jogo: escurece a página, destaca uma parte dela
// e pede que a pessoa clique na ação para seguir. Pode ser pulado ou fechado a qualquer momento (botão,
// x ou Esc) e não volta sozinho depois disso; dá para rever pela ajuda (?) de qualquer página
export function Tutorial({ primeiroAcesso, pesquisadorId }: { primeiroAcesso: boolean; pesquisadorId: string }) {
  const chaveVisto = `${CHAVE_VISTO}:${pesquisadorId}`;
  const caminho = usePathname();
  const router = useRouter();
  const [estado, setEstado] = useState<Estado | null>(null);
  const [boasVindas, setBoasVindas] = useState(false);
  const [preparando, setPreparando] = useState(false);
  const [retangulo, setRetangulo] = useState<Retangulo | null>(null);
  const [semAlvo, setSemAlvo] = useState(false);
  const [foraDaPagina, setForaDaPagina] = useState(false);
  const [alturaCartao, setAlturaCartao] = useState(240);
  const comecando = useRef(false);
  const cartao = useRef<HTMLDivElement>(null);
  const titulo = useRef<HTMLHeadingElement>(null);
  const idTitulo = useId();
  const idBoasVindas = useId();

  const passo = estado ? PASSOS[estado.passo] : undefined;
  const pagina = passo && estado ? passo.pagina(estado.estudoId) : null;
  const naPagina = pagina === caminho;
  const seletor = passo && estado ? passo.alvo(estado.estudoId) : null;

  // Retoma um tour em andamento ou abre as boas-vindas no primeiro acesso
  useEffect(() => {
    const salvo = lerEstado();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage só existe no navegador
    if (salvo) setEstado(salvo);
    else if (primeiroAcesso && !localStorage.getItem(chaveVisto)) setBoasVindas(true);
    const reabrir = () => setBoasVindas(true);
    window.addEventListener(EVENTO_INICIAR_TOUR, reabrir);
    return () => window.removeEventListener(EVENTO_INICIAR_TOUR, reabrir);
  }, [primeiroAcesso, chaveVisto]);

  const guardar = useCallback((novo: Estado | null) => {
    setEstado(novo);
    setRetangulo(null);
    setSemAlvo(false);
    if (novo) localStorage.setItem(CHAVE, JSON.stringify(novo));
    else localStorage.removeItem(CHAVE);
  }, []);

  const encerrar = useCallback(() => {
    localStorage.setItem(chaveVisto, "1");
    guardar(null);
    setBoasVindas(false);
    void marcarTutorialVisto();
  }, [guardar, chaveVisto]);

  // O clique que avança vem de um ouvinte do documento: lê o passo atual pela ref, não pelo fechamento
  const estadoAtual = useRef(estado);
  useEffect(() => {
    estadoAtual.current = estado;
  }, [estado]);

  const avancar = useCallback(() => {
    const atual = estadoAtual.current;
    if (!atual) return;
    if (atual.passo + 1 >= PASSOS.length) {
      encerrar();
      return;
    }
    const novo = { ...atual, passo: atual.passo + 1 };
    estadoAtual.current = novo;
    guardar(novo);
  }, [encerrar, guardar]);

  async function comecar() {
    setPreparando(true);
    try {
      const estudoId = await prepararTour();
      comecando.current = true;
      setBoasVindas(false);
      guardar({ passo: 0, estudoId });
      if (caminho !== "/estudos") router.push("/estudos");
      else router.refresh();
    } finally {
      setPreparando(false);
    }
  }

  // Procura o alvo na página do passo; se não aparecer em 3 s, o cartão segue no meio da tela com Próximo
  useEffect(() => {
    if (!seletor || !naPagina) return;
    const inicio = Date.now();
    let rolou = false;
    const intervalo = window.setInterval(() => {
      const elemento = document.querySelector(seletor);
      const medida = elemento ? medir(elemento) : null;
      if (elemento && medida) {
        if (!rolou) {
          rolou = true;
          elemento.scrollIntoView({ block: "center", behavior: "smooth" });
        }
        setSemAlvo(false);
        setRetangulo((atual) => (iguais(atual, medida) ? atual : medida));
      } else if (Date.now() - inicio > ESPERA_ALVO_MS) {
        setSemAlvo(true);
        setRetangulo(null);
      }
    }, 120);
    return () => window.clearInterval(intervalo);
  }, [seletor, naPagina]);

  // Nos passos de clique, a ação da própria pessoa avança o tour (sem impedir o que o clique faz)
  useEffect(() => {
    if (!seletor || !naPagina || passo?.modo !== "clique") return;
    function aoClicar(evento: MouseEvent) {
      const alvo = document.querySelector(seletor ?? "");
      if (alvo && evento.target instanceof Node && alvo.contains(evento.target)) avancar();
    }
    document.addEventListener("click", aoClicar, true);
    return () => document.removeEventListener("click", aoClicar, true);
  }, [seletor, naPagina, passo?.modo, avancar]);

  // Logo depois de um clique que navega, a página ainda é a antiga: só oferece "Ir para lá" se demorar
  useEffect(() => {
    if (!estado || naPagina) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- volta ao normal ao chegar na página
      setForaDaPagina(false);
      return;
    }
    const espera = window.setTimeout(() => setForaDaPagina(true), 4000);
    return () => window.clearTimeout(espera);
  }, [estado, naPagina]);

  // Esc fecha o tour, menos quando há uma janela aberta (aí o Esc é dela)
  useEffect(() => {
    if (!estado) return;
    function aoTeclar(evento: KeyboardEvent) {
      if (evento.key === "Escape" && !document.querySelector("dialog[open]")) encerrar();
    }
    document.addEventListener("keydown", aoTeclar);
    return () => document.removeEventListener("keydown", aoTeclar);
  }, [estado, encerrar]);

  const visivel = Boolean(estado && passo && ((naPagina && (retangulo || semAlvo)) || foraDaPagina));

  // A cada passo o foco vai para o título do cartão: o leitor de tela anuncia o passo novo
  useEffect(() => {
    if (visivel) titulo.current?.focus({ preventScroll: true });
  }, [visivel, estado?.passo]);

  useLayoutEffect(() => {
    if (cartao.current) setAlturaCartao(cartao.current.offsetHeight);
  }, [visivel, estado?.passo, retangulo, semAlvo]);

  function posicaoDoCartao(): CSSProperties {
    if (!retangulo || !naPagina) return {};
    const largura = Math.min(LARGURA_CARTAO, window.innerWidth - 32);
    const left = Math.min(Math.max(16, retangulo.left), window.innerWidth - largura - 16);
    const abaixo = retangulo.top + retangulo.height + 12;
    if (abaixo + alturaCartao < window.innerHeight - 16) return { top: abaixo, left, bottom: "auto", transform: "none" };
    const acima = retangulo.top - 12 - alturaCartao;
    if (acima > 16) return { top: acima, left, bottom: "auto", transform: "none" };
    return {};
  }

  function fazerPorMim() {
    const elemento = seletor ? document.querySelector<HTMLElement>(seletor) : null;
    if (elemento && retangulo) {
      elemento.click();
      return;
    }
    // Sem o alvo na tela: segue para o próximo passo e vai até a página dele
    const proximo = estado ? PASSOS[estado.passo + 1] : undefined;
    avancar();
    if (proximo && estado) router.push(proximo.pagina(estado.estudoId) as Route);
  }

  const bloquearAlvo = passo?.modo === "proximo" || !retangulo;

  return (
    <>
      <Janela
        aberta={boasVindas}
        aoFechar={() => {
          if (comecando.current) {
            comecando.current = false;
            return;
          }
          encerrar();
        }}
        idTitulo={idBoasVindas}
        tipo="conteudo"
        rotuloFechar="Fechar o tutorial"
      >
        <div className={janela.formulario}>
          <div>
            <p className={estilos.chapeu}>Primeiro acesso</p>
            <h2 id={idBoasVindas} className={janela.titulo}>
              Boas-vindas à Ferramenta UEQ
            </h2>
          </div>
          <div className={janela.corpo}>
            <p>
              Em pouco mais de um minuto, o tour mostra o caminho de um estudo: o link da coleta, o trabalho em equipe, o
              painel de resultados, as respostas suspeitas, as notificações e a ajuda de cada página.
            </p>
            <p className={janela.texto}>
              Você mesmo clica nas ações que o tour destacar. Dá para pular ou fechar quando quiser, e rever depois pelo
              botão (?) de qualquer página.
            </p>
          </div>
          <div className={janela.acoes}>
            <button type="button" className={`${formulario.botao} ${formulario.secundario}`} onClick={encerrar}>
              Pular tutorial
            </button>
            <button
              type="button"
              className={`${formulario.botao} ${formulario.primario}`}
              data-foco-inicial=""
              disabled={preparando}
              onClick={comecar}
            >
              <Compass size={18} strokeWidth={1.5} aria-hidden="true" className={formulario.icone} />
              <span>{preparando ? "Preparando…" : "Começar o tour"}</span>
            </button>
          </div>
        </div>
      </Janela>

      {visivel && estado && passo && (
        <div className={estilos.camada}>
          {naPagina && retangulo ? (
            <>
              <div className={estilos.sombra} style={{ top: 0, left: 0, right: 0, height: Math.max(0, retangulo.top) }} />
              <div
                className={estilos.sombra}
                style={{ top: retangulo.top + retangulo.height, left: 0, right: 0, bottom: 0 }}
              />
              <div
                className={estilos.sombra}
                style={{ top: retangulo.top, left: 0, width: Math.max(0, retangulo.left), height: retangulo.height }}
              />
              <div
                className={estilos.sombra}
                style={{ top: retangulo.top, left: retangulo.left + retangulo.width, right: 0, height: retangulo.height }}
              />
              <div
                className={`${estilos.anel} ${bloquearAlvo ? estilos.bloqueado : ""}`}
                style={{ top: retangulo.top, left: retangulo.left, width: retangulo.width, height: retangulo.height }}
              />
            </>
          ) : (
            <div className={estilos.sombra} style={{ inset: 0 }} />
          )}

          <div
            ref={cartao}
            className={estilos.cartao}
            role="dialog"
            aria-modal="false"
            aria-labelledby={idTitulo}
            style={posicaoDoCartao()}
          >
            <div className={estilos.topo}>
              <p className={estilos.progresso}>
                Passo {estado.passo + 1} de {PASSOS.length}
              </p>
              <button type="button" className={estilos.fechar} aria-label="Fechar o tutorial" onClick={encerrar}>
                <X size={18} strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>
            <div className={estilos.barraProgresso} aria-hidden="true">
              <span style={{ width: `${((estado.passo + 1) / PASSOS.length) * 100}%` }} />
            </div>
            <h2 ref={titulo} id={idTitulo} className={estilos.titulo} tabIndex={-1}>
              {naPagina ? passo.titulo : "O tour continua em outra página"}
            </h2>
            <p className={estilos.texto}>
              {naPagina
                ? passo.texto
                : "Você saiu do caminho do tour. Volte para onde ele parou ou pule o tutorial."}
            </p>
            {naPagina && passo.modo === "clique" && retangulo && (
              <p className={estilos.dica}>
                <MousePointerClick size={18} strokeWidth={1.5} aria-hidden="true" />
                <span>Clique no destaque para continuar</span>
              </p>
            )}
            <div className={estilos.acoes}>
              <button type="button" className={estilos.pular} onClick={encerrar}>
                Pular tutorial
              </button>
              {!naPagina ? (
                <button
                  type="button"
                  className={`${formulario.botao} ${formulario.primario}`}
                  onClick={() => pagina && router.push(pagina as Route)}
                >
                  Ir para lá
                </button>
              ) : passo.modo === "proximo" || !retangulo ? (
                <button
                  type="button"
                  className={`${formulario.botao} ${formulario.primario}`}
                  onClick={passo.modo === "proximo" ? avancar : fazerPorMim}
                >
                  {estado.passo + 1 === PASSOS.length ? "Concluir" : "Próximo"}
                </button>
              ) : (
                <button type="button" className={`${formulario.botao} ${formulario.secundario}`} onClick={fazerPorMim}>
                  Fazer por mim
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
