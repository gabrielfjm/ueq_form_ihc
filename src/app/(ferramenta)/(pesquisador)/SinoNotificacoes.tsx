"use client";

import { Bell, Check, X } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition, type KeyboardEvent } from "react";
import {
  contarNaoLidas,
  listarNotificacoes,
  marcarLida,
  marcarTodasLidas,
  responderConvite,
  type NotificacaoDoSino,
} from "./notificacoes/acoes";
import estilos from "./sino.module.css";
import { useT } from "@/traducao/cliente";
import type { Traduzir } from "@/traducao/nucleo";
import { BotaoEnvio } from "@/componentes/formulario/BotaoEnvio";

const MINUTO = 60 * 1000;

function haQuanto(t: Traduzir, iso: string): string {
  const minutos = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / MINUTO));
  if (minutos < 1) return t("agora");
  if (minutos < 60) return t("há {n} min", { n: minutos });
  const horas = Math.round(minutos / 60);
  if (horas < 24) return t("há {n} h", { n: horas });
  const dias = Math.round(horas / 24);
  return dias === 1 ? t("ontem") : t("há {n} dias", { n: dias });
}

// O sino fica na barra, entre Minha conta e Sair. O número se atualiza a cada navegação e a cada minuto;
// a lista abre por baixo, sem cobrir a página inteira (não é modal), e fecha com Esc ou clicando fora
export function SinoNotificacoes({ naoLidasIniciais }: { naoLidasIniciais: number }) {
  const t = useT();
  const caminho = usePathname();
  const [naoLidas, setNaoLidas] = useState(naoLidasIniciais);
  const [aberto, setAberto] = useState(false);
  const [lista, setLista] = useState<NotificacaoDoSino[] | null>(null);
  const [, iniciar] = useTransition();
  const caixa = useRef<HTMLSpanElement>(null);
  const botao = useRef<HTMLButtonElement>(null);

  const atualizarContagem = useCallback(() => {
    contarNaoLidas().then(setNaoLidas, () => {});
  }, []);

  useEffect(() => {
    atualizarContagem();
    const intervalo = window.setInterval(atualizarContagem, MINUTO);
    return () => window.clearInterval(intervalo);
  }, [caminho, atualizarContagem]);

  // Ao navegar, a lista fecha (ajuste na renderização, como o menu da BarraFixa)
  const [caminhoDaLista, setCaminhoDaLista] = useState(caminho);
  if (caminhoDaLista !== caminho) {
    setCaminhoDaLista(caminho);
    setAberto(false);
  }

  useEffect(() => {
    if (!aberto) return;
    listarNotificacoes().then(setLista, () => setLista([]));
    function fora(evento: MouseEvent) {
      if (caixa.current && !caixa.current.contains(evento.target as Node)) setAberto(false);
    }
    document.addEventListener("mousedown", fora);
    return () => document.removeEventListener("mousedown", fora);
  }, [aberto]);

  function aoTeclar(evento: KeyboardEvent<HTMLSpanElement>) {
    if (evento.key !== "Escape" || !aberto) return;
    evento.stopPropagation();
    setAberto(false);
    botao.current?.focus();
  }

  function todasLidas() {
    iniciar(async () => {
      await marcarTodasLidas();
      setLista((atual) => atual?.map((item) => ({ ...item, lida: true })) ?? null);
      setNaoLidas(0);
    });
  }

  function abrirItem(item: NotificacaoDoSino) {
    if (item.lida) return;
    setNaoLidas((atual) => Math.max(0, atual - 1));
    void marcarLida(item.id);
  }

  const rotulo = naoLidas > 0 ? t("Notificações: {naoLidas} {v}", { naoLidas: naoLidas, v: naoLidas === 1 ? "nova" : "novas" }) : t("Notificações");

  return (
    <span ref={caixa} className={estilos.caixa} onKeyDown={aoTeclar}>
      <button
        ref={botao}
        type="button"
        className={estilos.botao}
        aria-expanded={aberto}
        aria-controls="lista-notificacoes"
        aria-label={t(rotulo)}
        title={t("Notificações")}
        data-tutorial="notificacoes"
        onClick={() => setAberto(!aberto)}
      >
        <Bell size={18} strokeWidth={1.5} aria-hidden="true" />
        <span className={estilos.textoMenu} aria-hidden="true">
          {t("Notificações")}
        </span>
        {naoLidas > 0 && (
          <span className={estilos.contador} aria-hidden="true">
            {naoLidas > 99 ? "99+" : naoLidas}
          </span>
        )}
      </button>
      <div id="lista-notificacoes" className={estilos.painel} hidden={!aberto} role="region" aria-label={t("Notificações")}>
        <div className={estilos.cabecalho}>
          <h2 className={estilos.titulo}>{t("Notificações")}</h2>
          {lista?.some((item) => !item.lida) && (
            <button type="button" className={estilos.textoBotao} onClick={todasLidas}>
              {t("Marcar todas como lidas")}
            </button>
          )}
        </div>
        {!lista ? (
          <p className={estilos.vazio}>{t("Carregando…")}</p>
        ) : lista.length === 0 ? (
          <p className={estilos.vazio}>
            {t("Nada novo. Convites, respostas e mudanças da equipe nos seus estudos aparecem aqui.")}
          </p>
        ) : (
          <ul className={estilos.lista}>
            {lista.map((item) => (
              <li key={item.id} className={item.lida ? undefined : estilos.nova}>
                {!item.lida && <span className="visualmente-oculto">{t("Nova:")}{" "}</span>}
                <Link href={item.link as Route} className={estilos.link} onClick={() => abrirItem(item)}>
                  {t(item.texto)}
                </Link>
                <span className={estilos.quando}>{t(haQuanto(t, item.criadaEm))}</span>
                {item.convitePendente && (
                  <span className={estilos.acoes}>
                    <form action={responderConvite.bind(null, item.convitePendente, true)}>
                      <BotaoEnvio
                        textoEnviando={t("Aguarde…")}
                        icone={<Check size={16} strokeWidth={2} aria-hidden="true" />}
                        className={estilos.aceitar}
                      >
                        {t("Aceitar")}
                      </BotaoEnvio>
                    </form>
                    <form action={responderConvite.bind(null, item.convitePendente, false)}>
                      <BotaoEnvio
                        textoEnviando={t("Aguarde…")}
                        icone={<X size={16} strokeWidth={2} aria-hidden="true" />}
                        className={estilos.recusar}
                      >
                        {t("Recusar")}
                      </BotaoEnvio>
                    </form>
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
        <Link href="/notificacoes" className={estilos.verTodas}>
          {t("Ver todas as notificações")}
        </Link>
      </div>
    </span>
  );
}
