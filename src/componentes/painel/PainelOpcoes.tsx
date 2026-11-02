import { ChevronRight, type LucideIcon } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import estilos from "./painel.module.css";
import { tradutor } from "@/traducao/servidor";

export type OpcaoPainel = {
  titulo: string;
  descricao: string;
  Icone: LucideIcon;
  // situação atual em uma linha ("3 contas · 1 administrador", "Ativa")
  situacao?: string;
  alerta?: boolean;
  // abre uma página; sem href, o cartão mostra o conteudo (botões que abrem janelas, links diretos)
  href?: Route;
  conteudo?: ReactNode;
};

// Painel de opções (Administração, Minha conta): cada cartão leva a uma página ou abre uma janela, em vez
// de tudo empilhado numa página só. O título é o link, e a área inteira do cartão responde ao clique
// (o link se estica sobre o cartão), sem perder a semântica de lista com títulos para o leitor de tela
export async function PainelOpcoes({ opcoes, rotulo }: { opcoes: OpcaoPainel[]; rotulo: string }) {
  const t = await tradutor();
  return (
    <ul className={estilos.grade} aria-label={t(rotulo)}>
      {opcoes.map(({ titulo, descricao, Icone, situacao, alerta, href, conteudo }) => (
        <li key={titulo} className={href ? `${estilos.cartao} ${estilos.cartaoLink}` : estilos.cartao}>
          <span className={estilos.icone} aria-hidden="true">
            <Icone size={22} strokeWidth={1.5} />
          </span>
          <div className={estilos.textos}>
            <h2 className={estilos.titulo}>
              {href ? (
                <Link href={href} className={estilos.link}>
                  {t(titulo)}
                </Link>
              ) : (
                titulo
              )}
            </h2>
            <p className={estilos.descricao}>{t(descricao)}</p>
            {situacao && <p className={alerta ? `${estilos.situacao} ${estilos.alerta}` : estilos.situacao}>{t(situacao)}</p>}
            {conteudo && <div className={estilos.conteudo}>{conteudo}</div>}
          </div>
          {href && <ChevronRight size={20} strokeWidth={1.5} aria-hidden="true" className={estilos.seta} />}
        </li>
      ))}
    </ul>
  );
}
