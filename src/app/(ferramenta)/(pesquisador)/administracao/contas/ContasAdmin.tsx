"use client";

import { ShieldCheck, ShieldOff } from "lucide-react";
import { useState, useTransition } from "react";
import formulario from "@/componentes/formulario/formulario.module.css";
import { MensagemStatus } from "@/componentes/formulario/MensagemStatus";
import tabela from "../../estudos/estudos.module.css";
import { alternarAdministrador } from "../acoes";
import estilos from "../administracao.module.css";
import { useT } from "@/traducao/cliente";

export type ContaAdmin = {
  id: string;
  nome: string;
  email: string;
  criadaEm: string;
  administrador: boolean;
  estudos: number;
  jaEntrou: boolean;
};

// Só nome, e-mail e a quantidade de estudos de cada conta: o administrador não vê os estudos de ninguém
export function ContasAdmin({ idAtual, contas }: { idAtual: string; contas: ContaAdmin[] }) {
  const t = useT();
  const [status, setStatus] = useState({ mensagem: "", erro: false, vez: 0 });
  const [ocupado, iniciar] = useTransition();

  return (
    <>
      <MensagemStatus mensagem={status.mensagem} erro={status.erro} vez={status.vez} className={estilos.regiaoStatus} />
      <div className={tabela.rolagemTabela}>
        <table className={tabela.tabela}>
          <caption>{t("Da conta mais antiga para a mais nova")}</caption>
          <thead>
            <tr>
              <th scope="col">{t("Pessoa")}</th>
              <th scope="col">{t("Criada em")}</th>
              <th scope="col" className={tabela.direita}>
                {t("Estudos")}
              </th>
              <th scope="col">{t("Acesso")}</th>
            </tr>
          </thead>
          <tbody>
            {contas.map((conta) => (
              <tr key={conta.id}>
                <th scope="row">
                  <strong>{t(conta.nome)}</strong>
                  <span className={tabela.produto}>{t(conta.email)}</span>
                  {!conta.jaEntrou && <span className={tabela.produto}>{t("ainda não fez o tour do primeiro acesso")}</span>}
                </th>
                <td className={tabela.numero}>{t(conta.criadaEm)}</td>
                <td className={`${tabela.numero} ${tabela.direita}`}>{conta.estudos}</td>
                <td>
                  <span className={estilos.acesso}>
                    {conta.administrador ? "Administrador" : "Pesquisador"}
                    {conta.id !== idAtual && (
                      <button
                        type="button"
                        className={formulario.botaoTexto}
                        disabled={ocupado}
                        onClick={() =>
                          iniciar(async () => {
                            const resultado = await alternarAdministrador(conta.id);
                            setStatus((atual) => ({ mensagem: resultado.erro ?? resultado.sucesso ?? "", erro: Boolean(resultado.erro), vez: atual.vez + 1 }));
                          })
                        }
                      >
                        {conta.administrador ? (
                          <ShieldOff size={16} strokeWidth={1.5} aria-hidden="true" />
                        ) : (
                          <ShieldCheck size={16} strokeWidth={1.5} aria-hidden="true" />
                        )}
                        <span>
                          {conta.administrador ? t("Tirar administrador") : t("Tornar administrador")}
                          <span className="visualmente-oculto"> ({t(conta.nome)})</span>
                        </span>
                      </button>
                    )}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
