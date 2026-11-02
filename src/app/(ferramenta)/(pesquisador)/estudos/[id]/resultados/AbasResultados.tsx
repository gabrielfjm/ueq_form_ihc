import { ChartColumn, Users } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import estilos from "./resultados.module.css";
import { tradutor } from "@/traducao/servidor";

// Resultados tem duas partes: as escalas do UEQ e, quando o estudo coleta, os dados demográficos.
// Sub-abas com aria-current, como as abas do estudo (Nielsen 4)
export async function AbasResultados({ estudoId, atual }: { estudoId: string; atual: "ueq" | "demografia" }) {
  const t = await tradutor();
  const abas = [
    { chave: "ueq", texto: t("Escalas do UEQ"), Icone: ChartColumn, href: `/estudos/${estudoId}/resultados` },
    { chave: "demografia", texto: t("Dados demográficos"), Icone: Users, href: `/estudos/${estudoId}/resultados/demograficos` },
  ] as const;
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
