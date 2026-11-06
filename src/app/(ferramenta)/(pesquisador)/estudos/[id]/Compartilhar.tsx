"use client";

import { Check, LogOut, Mail, UserMinus, UserPlus, Users } from "lucide-react";
import { useCallback, useEffect, useId, useState, useTransition } from "react";
import { Campo } from "@/componentes/formulario/Campo";
import formulario from "@/componentes/formulario/formulario.module.css";
import { MensagemStatus } from "@/componentes/formulario/MensagemStatus";
import { Janela } from "@/componentes/janela/Janela";
import janela from "@/componentes/janela/janela.module.css";
import {
  convidar,
  listarAcessos,
  mudarPapel,
  removerAcesso,
  sairDoEstudo,
  type AcessosDoEstudo,
  type ResultadoConvite,
} from "./acoes-compartilhar";
import estilos from "./compartilhar.module.css";
import { useT } from "@/traducao/cliente";
import { m } from "@/traducao/nucleo";
import { BotaoEnvio } from "@/componentes/formulario/BotaoEnvio";

const STATUS = { PENDENTE: m("Convite pendente"), RECUSADO: "Recusou o convite", ACEITO: null } as const;

// Compartilhar como no Google Docs: convidar pelo e-mail de uma conta já cadastrada, escolher o papel e
// ver quem tem acesso. O convite chega na ferramenta (Convites) e, com SMTP configurado, por e-mail
export function Compartilhar({ estudoId, titulo }: { estudoId: string; titulo: string }) {
  const t = useT();
  const [aberta, setAberta] = useState(false);
  const [acessos, setAcessos] = useState<AcessosDoEstudo | null>(null);
  const [convite, setConvite] = useState<ResultadoConvite>({ envio: 0 });
  const [aviso, setAviso] = useState({ mensagem: "", erro: false, vez: 0 });
  const [ocupado, iniciar] = useTransition();
  const idTitulo = useId();

  const anunciar = (mensagem: string, erro = false) => setAviso((atual) => ({ mensagem, erro, vez: atual.vez + 1 }));
  const recarregar = useCallback(() => listarAcessos(estudoId).then(setAcessos), [estudoId]);

  useEffect(() => {
    if (aberta) void recarregar();
  }, [aberta, recarregar]);

  function aoConvidar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const formularioConvite = evento.currentTarget;
    const dados = new FormData(formularioConvite);
    iniciar(async () => {
      const resultado = await convidar(estudoId, convite, dados);
      setConvite(resultado);
      if (resultado.sucesso) {
        anunciar(resultado.sucesso);
        formularioConvite.reset();
        await recarregar();
      }
    });
  }

  function executar(acao: () => Promise<{ sucesso?: string; erro?: string }>) {
    iniciar(async () => {
      const resultado = await acao();
      anunciar(resultado.erro ?? resultado.sucesso ?? "", Boolean(resultado.erro));
      await recarregar();
    });
  }

  function fechar() {
    setAberta(false);
    setConvite((atual) => ({ envio: atual.envio }));
    setAviso({ mensagem: "", erro: false, vez: 0 });
  }

  return (
    <>
      <button
        type="button"
        className={`${formulario.botao} ${formulario.secundario}`}
        aria-haspopup="dialog"
        data-tutorial="compartilhar"
        onClick={() => setAberta(true)}
      >
        <Users size={18} strokeWidth={1.5} aria-hidden="true" className={formulario.icone} />
        <span>{t("Compartilhar")}</span>
      </button>
      <Janela aberta={aberta} aoFechar={fechar} idTitulo={idTitulo} tipo="conteudo">
        <div className={janela.formulario}>
          <h2 id={idTitulo} className={janela.titulo}>
            {t("Compartilhar “{titulo}”", { titulo: titulo })}
          </h2>
          <MensagemStatus mensagem={aviso.mensagem} erro={aviso.erro} vez={aviso.vez} />

          {acessos?.podeGerenciar && (
            <form className={estilos.convite} noValidate onSubmit={aoConvidar} aria-label={t("Convidar pessoa")}>
              <Campo
                id="convite-email"
                name="email"
                type="email"
                rotulo={t("E-mail de quem vai participar")}
                ajuda={t("A pessoa precisa ter conta na ferramenta. Ela aceita o convite em Convites.")}
                autoComplete="off"
                erro={convite.erros?.email}
                data-foco-inicial=""
              />
              <div className={estilos.linhaConvite}>
                <div className={formulario.grupo}>
                  <label htmlFor="convite-papel" className={formulario.rotulo}>
                    {t("Papel")}
                  </label>
                  <select id="convite-papel" name="papel" className={formulario.campo} defaultValue="EDITOR">
                    <option value="EDITOR">{t("Editor: edita o estudo e as respostas")}</option>
                    <option value="LEITOR">{t("Leitor: só vê e exporta")}</option>
                  </select>
                </div>
                <BotaoEnvio
                  enviando={ocupado}
                  textoEnviando={t("Convidando…")}
                  icone={<UserPlus size={18} strokeWidth={1.5} aria-hidden="true" className={formulario.icone} />}
                  className={`${formulario.botao} ${formulario.primario}`}
                >
                  {t("Convidar")}
                </BotaoEnvio>
              </div>
              {convite.mailto && (
                <p className={estilos.mailto}>
                  <span>{t("A ferramenta ainda não está configurada para enviar e-mails. Quer avisar a pessoa?")}</span>
                  <a href={convite.mailto} className={formulario.linkAcao}>
                    <Mail size={18} strokeWidth={1.5} aria-hidden="true" />
                    <span>{t("Avisar por e-mail")}</span>
                  </a>
                </p>
              )}
            </form>
          )}

          <section aria-labelledby={`${idTitulo}-pessoas`} className={estilos.pessoas}>
            <h3 id={`${idTitulo}-pessoas`} className={estilos.subtitulo}>
              {t("Pessoas com acesso")}
            </h3>
            {!acessos ? (
              <p className={janela.texto}>{t("Carregando…")}</p>
            ) : (
              <ul className={estilos.lista}>
                <li>
                  <span className={estilos.pessoa}>
                    <strong>
                      {t(acessos.dono.nome)}
                      {acessos.dono.voce && t(" (você)")}
                    </strong>
                    <span className={estilos.email}>{t(acessos.dono.email)}</span>
                  </span>
                  <span className={estilos.papel}>{t("Dono")}</span>
                </li>
                {acessos.pessoas.map((pessoa) => (
                  <li key={pessoa.id}>
                    <span className={estilos.pessoa}>
                      <strong>
                        {t(pessoa.nome)}
                        {pessoa.voce && t(" (você)")}
                      </strong>
                      <span className={estilos.email}>{t(pessoa.email)}</span>
                      {STATUS[pessoa.status] && <span className={estilos.status}>{STATUS[pessoa.status]}</span>}
                    </span>
                    {acessos.podeGerenciar ? (
                      <span className={estilos.controles}>
                        <select
                          aria-label={t("Papel de {nome}", { nome: pessoa.nome })}
                          className={`${formulario.campo} ${estilos.selecaoPapel}`}
                          value={pessoa.papel}
                          disabled={ocupado}
                          onChange={(evento) => executar(() => mudarPapel(pessoa.id, evento.target.value))}
                        >
                          <option value="EDITOR">{t("Editor")}</option>
                          <option value="LEITOR">{t("Leitor")}</option>
                        </select>
                        <button
                          type="button"
                          className={formulario.botaoTexto}
                          disabled={ocupado}
                          onClick={() => executar(() => removerAcesso(pessoa.id))}
                        >
                          <UserMinus size={18} strokeWidth={1.5} aria-hidden="true" />
                          <span>{pessoa.status === "ACEITO" ? `Remover ${pessoa.nome}` : t("Cancelar convite")}</span>
                        </button>
                      </span>
                    ) : (
                      <span className={estilos.papel}>{pessoa.papel === "EDITOR" ? "Editor" : "Leitor"}</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
            {acessos && acessos.pessoas.length === 0 && (
              <p className={janela.texto}>{t("Ninguém além do dono tem acesso a este estudo ainda.")}</p>
            )}
          </section>

          <div className={janela.acoes}>
            {acessos?.pessoas.some((pessoa) => pessoa.voce && pessoa.status === "ACEITO") && (
              <form action={sairDoEstudo.bind(null, estudoId)} className={estilos.sair}>
                <BotaoEnvio
                  textoEnviando={t("Saindo do estudo…")}
                  icone={<LogOut size={18} strokeWidth={1.5} aria-hidden="true" />}
                  className={formulario.destrutivo}
                >
                  {t("Sair deste estudo")}
                </BotaoEnvio>
              </form>
            )}
            <button type="button" className={`${formulario.botao} ${formulario.primario}`} onClick={fechar}>
              <Check size={18} strokeWidth={1.5} aria-hidden="true" className={formulario.icone} />
              <span>{t("Concluído")}</span>
            </button>
          </div>
        </div>
      </Janela>
    </>
  );
}
