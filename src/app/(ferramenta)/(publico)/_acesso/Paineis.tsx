"use client";

import { ESCALAS_DO_UEQ, PASSOS } from "../conteudo";
import estilos from "./acesso.module.css";
import { useT } from "@/traducao/cliente";

const CENTROS_GRANDES = [24, 73, 122, 172, 221, 270, 320];

function Marcacoes() {
  return (
    <svg viewBox="0 0 344 48" className={estilos.marcacoes} aria-hidden="true">
      <line x1="0" y1="24" x2="344" y2="24" />
      {CENTROS_GRANDES.map((cx, posicao) => (
        <circle key={cx} cx={cx} cy="24" r="17" className={posicao === 4 ? estilos.marcada : estilos.vazia} />
      ))}
    </svg>
  );
}

// Protótipos r1 e r17: o painel ao lado de Entrar resume o instrumento
export function PainelInstrumento() {
  const t = useT();
  return (
    <aside aria-label={t("Sobre o instrumento")} className={estilos.painel}>
      <Marcacoes />
      <p className={estilos.painelTitulo}>{t("26 pares de palavras, 6 escalas e um link para os participantes.")}</p>
      <div className={estilos.lista}>
        <p className={estilos.listaTitulo}>{t("Escalas do UEQ")}</p>
        {ESCALAS_DO_UEQ.map(({ nome, itens }) => (
          <div key={nome} className={estilos.escala}>
            <span>{t(nome)}</span>
            <span className={estilos.itens}>{t("{itens} itens", { itens: itens })}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}

// Protótipos r2 e r19: ao lado de Criar conta, o caminho do estudo até a planilha
export function PainelPercurso() {
  const t = useT();
  return (
    <aside aria-label={t("Como funciona")} className={estilos.painel}>
      <Marcacoes />
      <p className={estilos.painelTitulo}>{t("Do cadastro do estudo à planilha oficial.")}</p>
      <ol className={estilos.lista}>
        {PASSOS.map(([titulo, texto], posicao) => (
          <li key={titulo} className={estilos.passo}>
            <span className={estilos.passoNumero}>{t(String(posicao + 1).padStart(2, "0"))}</span>
            <span>
              <strong>{t(titulo)}</strong>
              <span className={estilos.passoTexto}> {t(texto)}</span>
            </span>
          </li>
        ))}
      </ol>
    </aside>
  );
}
