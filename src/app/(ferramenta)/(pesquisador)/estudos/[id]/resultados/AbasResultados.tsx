import { ChartColumn, ChartNoAxesColumn, Users } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import type { Instrumento } from "@/lib/instrumento";
import estilos from "./resultados.module.css";
import { tradutor } from "@/traducao/servidor";
import { m } from "@/traducao/nucleo";

export type AbaResultados = "ueq" | "ueq-s" | "demografia";

// Resultados tem até três partes: as escalas do UEQ; o UEQ-S, numa aba própria porque as escalas são outras
// (num estudo do UEQ completo, calculado com os 8 itens dele); e os dados demográficos, quando o estudo coleta.
// Sub-abas com aria-current, como as abas do estudo (Nielsen 4). Com uma parte só, não há abas
export async function AbasResultados({
  estudoId,
  atual,
  instrumento,
  demografia,
}: {
  estudoId: string;
  atual: AbaResultados;
  instrumento: Instrumento;
  demografia: boolean;
}) {
  const t = await tradutor();
  const abas = [
    ...(instrumento === "UEQ"
      ? [
          { chave: "ueq", texto: m("Escalas do UEQ"), Icone: ChartColumn, href: `/estudos/${estudoId}/resultados` },
          { chave: "ueq-s", texto: m("UEQ-S"), Icone: ChartNoAxesColumn, href: `/estudos/${estudoId}/resultados/ueq-s` },
        ]
      : [{ chave: "ueq-s", texto: m("Escalas do UEQ-S"), Icone: ChartColumn, href: `/estudos/${estudoId}/resultados/ueq-s` }]),
    ...(demografia
      ? [{ chave: "demografia", texto: m("Dados demográficos"), Icone: Users, href: `/estudos/${estudoId}/resultados/demograficos` }]
      : []),
  ];
  if (abas.length < 2) return null;
  return (
    <nav aria-label={t("Partes dos resultados")} className={estilos.subAbas}>
      {abas.map(({ chave, texto, Icone, href }) => (
        <Link key={chave} href={href as Route} className={estilos.subAba} aria-current={chave === atual ? "page" : undefined}>
          <Icone size={18} strokeWidth={1.5} aria-hidden="true" />
          <span>{t(texto)}</span>
        </Link>
      ))}
    </nav>
  );
}
