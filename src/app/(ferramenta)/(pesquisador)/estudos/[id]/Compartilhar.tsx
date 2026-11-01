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

const STATUS = { PENDENTE: "Convite pendente", RECUSADO: "Recusou o convite", ACEITO: null } as const;

// Compartilhar como no Google Docs: convidar pelo e-mail de uma conta já cadastrada, escolher o papel e
// ver quem tem acesso. O convite chega na ferramenta (Convites) e, com SMTP configurado, por e-mail
export function Compartilhar({ estudoId, titulo }: { estudoId: string; titulo: string }) {
  const [aberta, setAberta] = useState(false);
  const [acessos, setAcessos] = useState<AcessosDoEstudo | null>(null);
  const [convite, setConvite] = useState<ResultadoConvite>({ envio: 0 });
  const [aviso, setAviso] = useState({ mensagem: "", vez: 0 });
  const [ocupado, iniciar] = useTransition();
  const idTitulo = useId();

  const anunciar = (mensagem: string) => setAviso((atual) => ({ mensagem, vez: atual.vez + 1 }));
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
      anunciar(resultado.sucesso ?? resultado.erro ?? "");
      await recarregar();
    });
  }

  function fechar() {
    setAberta(false);
    setConvite((atual) => ({ envio: atual.envio }));
    setAviso({ mensagem: "", vez: 0 });
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
        <span>Compartilhar</span>
      </button>
      <Janela aberta={aberta} aoFechar={fechar} idTitulo={idTitulo} tipo="conteudo">
        <div className={janela.formulario}>
          <h2 id={idTitulo} className={janela.titulo}>
            Compartilhar “{titulo}”
          </h2>
          <MensagemStatus mensagem={aviso.mensagem} vez={aviso.vez} />

          {acessos?.podeGerenciar && (
            <form className={estilos.convite} noValidate onSubmit={aoConvidar} aria-label="Convidar pessoa">
              <Campo
                id="convite-email"
                name="email"
                type="email"
                rotulo="E-mail de quem vai participar"
                ajuda="A pessoa precisa ter conta na ferramenta. Ela aceita o convite em Convites."
                autoComplete="off"
                erro={convite.erros?.email}
                data-foco-inicial=""
              />
              <div className={estilos.linhaConvite}>
                <div className={formulario.grupo}>
                  <label htmlFor="convite-papel" className={formulario.rotulo}>
                    Papel
                  </label>
                  <select id="convite-papel" name="papel" className={formulario.campo} defaultValue="EDITOR">
                    <option value="EDITOR">Editor: edita o estudo e as respostas</option>
                    <option value="LEITOR">Leitor: só vê e exporta</option>
                  </select>
                </div>
                <button type="submit" className={`${formulario.botao} ${formulario.primario}`} disabled={ocupado}>
                  <UserPlus size={18} strokeWidth={1.5} aria-hidden="true" className={formulario.icone} />
                  <span>Convidar</span>
                </button>
              </div>
              {convite.mailto && (
                <p className={estilos.mailto}>
                  <span>A ferramenta ainda não está configurada para enviar e-mails. Quer avisar a pessoa?</span>
                  <a href={convite.mailto} className={formulario.linkAcao}>
                    <Mail size={18} strokeWidth={1.5} aria-hidden="true" />
                    <span>Avisar por e-mail</span>
                  </a>
                </p>
              )}
            </form>
          )}

          <section aria-labelledby={`${idTitulo}-pessoas`} className={estilos.pessoas}>
            <h3 id={`${idTitulo}-pessoas`} className={estilos.subtitulo}>
              Pessoas com acesso
            </h3>
            {!acessos ? (
              <p className={janela.texto}>Carregando…</p>
            ) : (
              <ul className={estilos.lista}>
                <li>
                  <span className={estilos.pessoa}>
                    <strong>
                      {acessos.dono.nome}
                      {acessos.dono.voce && " (você)"}
                    </strong>
                    <span className={estilos.email}>{acessos.dono.email}</span>
                  </span>
                  <span className={estilos.papel}>Dono</span>
                </li>
                {acessos.pessoas.map((pessoa) => (
                  <li key={pessoa.id}>
                    <span className={estilos.pessoa}>
                      <strong>
                        {pessoa.nome}
                        {pessoa.voce && " (você)"}
                      </strong>
                      <span className={estilos.email}>{pessoa.email}</span>
                      {STATUS[pessoa.status] && <span className={estilos.status}>{STATUS[pessoa.status]}</span>}
                    </span>
                    {acessos.podeGerenciar ? (
                      <span className={estilos.controles}>
                        <select
                          aria-label={`Papel de ${pessoa.nome}`}
                          className={`${formulario.campo} ${estilos.selecaoPapel}`}
                          value={pessoa.papel}
                          disabled={ocupado}
                          onChange={(evento) => executar(() => mudarPapel(pessoa.id, evento.target.value))}
                        >
                          <option value="EDITOR">Editor</option>
                          <option value="LEITOR">Leitor</option>
                        </select>
                        <button
                          type="button"
                          className={formulario.botaoTexto}
                          disabled={ocupado}
                          onClick={() => executar(() => removerAcesso(pessoa.id))}
                        >
                          <UserMinus size={18} strokeWidth={1.5} aria-hidden="true" />
                          <span>{pessoa.status === "ACEITO" ? `Remover ${pessoa.nome}` : "Cancelar convite"}</span>
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
              <p className={janela.texto}>Ninguém além do dono tem acesso a este estudo ainda.</p>
            )}
          </section>

          <div className={janela.acoes}>
            {acessos?.pessoas.some((pessoa) => pessoa.voce && pessoa.status === "ACEITO") && (
              <form action={sairDoEstudo.bind(null, estudoId)} className={estilos.sair}>
                <button type="submit" className={formulario.destrutivo}>
                  <LogOut size={18} strokeWidth={1.5} aria-hidden="true" />
                  <span>Sair deste estudo</span>
                </button>
              </form>
            )}
            <button type="button" className={`${formulario.botao} ${formulario.primario}`} onClick={fechar}>
              <Check size={18} strokeWidth={1.5} aria-hidden="true" className={formulario.icone} />
              <span>Concluído</span>
            </button>
          </div>
        </div>
      </Janela>
    </>
  );
}
