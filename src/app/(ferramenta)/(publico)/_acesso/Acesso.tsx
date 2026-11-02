"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";
import { Janela } from "@/componentes/janela/Janela";
import { Logotipo } from "@/componentes/Logotipo";
import { FormularioCadastro } from "./FormularioCadastro";
import { FormularioEntrar } from "./FormularioEntrar";
import { PainelInstrumento, PainelPercurso } from "./Paineis";
import estilos from "./acesso.module.css";

export type ModoAcesso = "entrar" | "cadastrar";

type Abrir = (modo: ModoAcesso, voltar?: string) => void;

const ContextoAcesso = createContext<Abrir>(() => {});

// Entrar e Criar conta abrem numa janela por cima da página em que a pessoa está (protótipos r17 a r19),
// sem perder o lugar. /entrar e /cadastrar continuam existindo: mostram a página inicial com a janela
// aberta, e é para lá que a checagem de sessão manda quem chega numa rota protegida
export function ProvedorAcesso({ children }: { children: ReactNode }) {
  const [modo, setModo] = useState<ModoAcesso | null>(null);
  const [voltar, setVoltar] = useState("/");
  const caminho = usePathname();
  const router = useRouter();
  const idTitulo = useId();
  const conteudo = useRef<HTMLDivElement>(null);

  // Ao trocar de Entrar para Criar conta (ou o contrário), o foco vai para o primeiro campo do formulário novo
  useEffect(() => {
    if (modo) conteudo.current?.querySelector<HTMLElement>("[data-foco-inicial]")?.focus();
  }, [modo]);

  // Estável entre renderizações: AbrirAcesso depende dele e não pode reabrir a janela a cada render
  const abrir = useCallback<Abrir>((novo, destino = "/") => {
    setVoltar(destino);
    setModo(novo);
  }, []);

  function aoFechar() {
    setModo(null);
    // Fechar em /entrar ou /cadastrar volta para a página inicial, que é o que está atrás da janela
    if (caminho === "/entrar" || caminho === "/cadastrar") router.replace("/", { scroll: false });
  }

  // "Criar conta" e "Entrar" dentro da janela (no rodapé do formulário e no erro "Esse e-mail já tem conta")
  // são links normais; na fase de captura a janela troca o formulário antes de o Link navegar
  function aoClicar(evento: MouseEvent<HTMLDivElement>) {
    if (evento.button !== 0 || evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey) return;
    const href = (evento.target as HTMLElement).closest("a")?.getAttribute("href");
    if (href !== "/entrar" && href !== "/cadastrar") return;
    evento.preventDefault();
    setModo(href === "/entrar" ? "entrar" : "cadastrar");
  }

  return (
    <ContextoAcesso.Provider value={abrir}>
      {children}
      <Janela aberta={modo !== null} aoFechar={aoFechar} idTitulo={idTitulo} tipo="acesso">
        <div
          ref={conteudo}
          className={modo === "cadastrar" ? `${estilos.janela} ${estilos.janelaCadastro}` : estilos.janela}
          onClickCapture={aoClicar}
        >
          <div className={estilos.principal}>
            {/* Em Criar conta o logotipo vai para o painel ao lado: sem ele aqui, os 3 campos e as mensagens
                de erro cabem na janela sem rolar */}
            {modo !== "cadastrar" && <Logotipo />}
            {modo === "cadastrar" ? (
              <FormularioCadastro key="cadastrar" idTitulo={idTitulo} />
            ) : (
              <FormularioEntrar key="entrar" idTitulo={idTitulo} voltar={voltar} />
            )}
          </div>
          {modo === "cadastrar" ? <PainelPercurso /> : <PainelInstrumento />}
        </div>
      </Janela>
    </ContextoAcesso.Provider>
  );
}

export function useAbrirAcesso() {
  return useContext(ContextoAcesso);
}

type PropriedadesBotao = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "onClick"> & { modo: ModoAcesso };

// Botão que abre a janela (na barra pública e na página inicial)
export function BotaoAcesso({ modo, children, ...botao }: PropriedadesBotao) {
  const abrir = useAbrirAcesso();
  return (
    <button type="button" aria-haspopup="dialog" onClick={() => abrir(modo)} {...botao}>
      {children}
    </button>
  );
}

// Em /entrar e /cadastrar a janela já começa aberta, com o destino de volta da rota protegida
export function AbrirAcesso({ modo, voltar }: { modo: ModoAcesso; voltar?: string }) {
  const abrir = useAbrirAcesso();
  useEffect(() => {
    abrir(modo, voltar);
  }, [abrir, modo, voltar]);
  return null;
}
