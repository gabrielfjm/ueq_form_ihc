"use client";

import { ArrowLeft } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type MouseEvent } from "react";
import { useT } from "@/traducao/cliente";
import estilos from "./documentacao.module.css";

const CHAVE_ATUAL = "documentacao-pagina-atual";
const CHAVE_NAVEGOU = "documentacao-navegou";

function lerSessao(chave: string): string | null {
  try {
    return sessionStorage.getItem(chave);
  } catch {
    return null;
  }
}

function gravarSessao(chave: string, valor: string) {
  try {
    sessionStorage.setItem(chave, valor);
  } catch {
    // Sem sessionStorage, o Voltar só perde o histórico e leva à página de cima
  }
}

// Marca que a pessoa já passou por outra página da documentação nesta aba: é o que permite ao Voltar
// usar o histórico. E leva os endereços antigos, só com o fragmento, à página em que a âncora está agora
export function RegistroDeVisita({ ancoras = {} }: { ancoras?: Record<string, string> }) {
  const caminho = usePathname();
  const router = useRouter();

  useEffect(() => {
    const anterior = lerSessao(CHAVE_ATUAL);
    if (anterior && anterior !== caminho) gravarSessao(CHAVE_NAVEGOU, "sim");
    gravarSessao(CHAVE_ATUAL, caminho);

    const destino = ancoras[decodeURIComponent(window.location.hash.slice(1))];
    if (destino) router.replace(destino as Route);
  }, [ancoras, caminho, router]);

  return null;
}

// Volta para onde a pessoa estava, que pode ser outro documento, com a rolagem de lá (Nielsen 3). Quem
// chegou por um link direto, sem histórico, vai para a página de cima. Sem JavaScript, é um link comum
export function VoltarDocumento({ pai }: { pai: string }) {
  const t = useT();
  const router = useRouter();

  function aoClicar(evento: MouseEvent<HTMLAnchorElement>) {
    if (evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey) return;
    if (lerSessao(CHAVE_NAVEGOU) !== "sim") return;
    evento.preventDefault();
    router.back();
  }

  return (
    <Link href={pai as Route} className={estilos.voltar} onClick={aoClicar}>
      <ArrowLeft size={18} strokeWidth={1.5} aria-hidden="true" />
      <span>{t("Voltar")}</span>
    </Link>
  );
}
