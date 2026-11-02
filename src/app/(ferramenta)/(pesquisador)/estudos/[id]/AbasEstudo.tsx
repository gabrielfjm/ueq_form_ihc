"use client";

import { ChartColumn, LayoutDashboard, List, type LucideIcon } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import estilos from "./estudo.module.css";
import { useT } from "@/traducao/cliente";
import { m } from "@/traducao/nucleo";

const ABAS: readonly { sufixo: string; texto: string; Icone: LucideIcon }[] = [
  { sufixo: "", texto: m("Visão geral"), Icone: LayoutDashboard },
  { sufixo: "/resultados", texto: m("Resultados"), Icone: ChartColumn },
  { sufixo: "/respostas", texto: m("Respostas"), Icone: List },
];

export function AbasEstudo({ estudoId }: { estudoId: string }) {
  const t = useT();
  const caminho = usePathname();
  return (
    <nav aria-label={t("Seções do estudo")} className={estilos.abas}>
      {ABAS.map(({ sufixo, texto, Icone }) => {
        const href = `/estudos/${estudoId}${sufixo}`;
        // A subpágina (Respostas › Importar) mantém a aba de origem marcada
        const atual = caminho === href || (sufixo !== "" && caminho.startsWith(`${href}/`));
        return (
          <Link
            key={texto}
            href={href as Route}
            className={estilos.aba}
            aria-current={atual ? "page" : undefined}
            data-tutorial={`aba${sufixo.replace("/", "-") || "-visao-geral"}`}
          >
            <Icone size={18} strokeWidth={1.5} aria-hidden="true" />
            <span>{t(texto)}</span>
          </Link>
        );
      })}
    </nav>
  );
}
