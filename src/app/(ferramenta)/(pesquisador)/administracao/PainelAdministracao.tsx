"use client";

import { DatabaseZap, ShieldCheck, ShieldOff, UserPlus } from "lucide-react";
import { useState, useTransition } from "react";
import { Campo, CampoSenha } from "@/componentes/formulario/Campo";
import formulario from "@/componentes/formulario/formulario.module.css";
import { MensagemStatus } from "@/componentes/formulario/MensagemStatus";
import { ResumoErros } from "@/componentes/formulario/ResumoErros";
import { useEnvioFormulario } from "@/componentes/formulario/useEnvioFormulario";
import tabela from "../estudos/estudos.module.css";
import { alternarAdministrador, criarCenarios, criarConta } from "./acoes";
import estilos from "./administracao.module.css";

type Conta = {
  id: string;
  nome: string;
  email: string;
  criadaEm: string;
  administrador: boolean;
  estudos: number;
  compartilhados: number;
  jaEntrou: boolean;
};

const CAMPOS_CONTA = [
  { nome: "nome", rotulo: "Nome", id: "nova-conta-nome" },
  { nome: "email", rotulo: "E-mail", id: "nova-conta-email" },
  { nome: "senha", rotulo: "Senha", id: "nova-conta-senha" },
] as const;

export function PainelAdministracao({ idAtual, contas }: { idAtual: string; contas: Conta[] }) {
  const [status, setStatus] = useState({ mensagem: "", vez: 0 });
  const [ocupado, iniciar] = useTransition();
  const anunciar = (mensagem: string) => setStatus((atual) => ({ mensagem, vez: atual.vez + 1 }));

  const novaConta = useEnvioFormulario(criarConta, (mensagem, formularioConta) => {
    anunciar(mensagem);
    formularioConta.reset();
  });
  const cenarios = useEnvioFormulario(criarCenarios, (mensagem) => anunciar(mensagem));

  return (
    <>
      <MensagemStatus mensagem={status.mensagem} vez={status.vez} className={estilos.regiaoStatus} />

      <section aria-labelledby="contas" className={`${estilos.secao} ${estilos.primeira}`}>
        <div className={estilos.secaoTitulo}>
          <span className={estilos.secaoNumero}>01</span>
          <h2 id="contas" className={estilos.secaoNome}>
            Contas
          </h2>
        </div>
        <div className={tabela.rolagemTabela}>
          <table className={tabela.tabela}>
            <caption>Da conta mais antiga para a mais nova</caption>
            <thead>
              <tr>
                <th scope="col">Pessoa</th>
                <th scope="col">Criada em</th>
                <th scope="col" className={tabela.direita}>Estudos próprios</th>
                <th scope="col" className={tabela.direita}>Compartilhados com ela</th>
                <th scope="col">Acesso</th>
              </tr>
            </thead>
            <tbody>
              {contas.map((conta) => (
                <tr key={conta.id}>
                  <th scope="row">
                    <strong>{conta.nome}</strong>
                    <span className={tabela.produto}>{conta.email}</span>
                    {!conta.jaEntrou && <span className={tabela.produto}>ainda não fez o tour do primeiro acesso</span>}
                  </th>
                  <td className={tabela.numero}>{conta.criadaEm}</td>
                  <td className={`${tabela.numero} ${tabela.direita}`}>{conta.estudos}</td>
                  <td className={`${tabela.numero} ${tabela.direita}`}>{conta.compartilhados}</td>
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
                              anunciar(resultado.sucesso ?? resultado.erro ?? "");
                            })
                          }
                        >
                          {conta.administrador ? (
                            <ShieldOff size={16} strokeWidth={1.5} aria-hidden="true" />
                          ) : (
                            <ShieldCheck size={16} strokeWidth={1.5} aria-hidden="true" />
                          )}
                          <span>
                            {conta.administrador ? "Tirar administrador" : "Tornar administrador"}
                            <span className="visualmente-oculto"> ({conta.nome})</span>
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
      </section>

      <form
        className={estilos.secao}
        aria-labelledby="criar-conta"
        noValidate
        onSubmit={novaConta.aoEnviar}
      >
        <div className={estilos.secaoTitulo}>
          <span className={estilos.secaoNumero}>02</span>
          <h2 id="criar-conta" className={estilos.secaoNome}>
            Criar conta para alguém
          </h2>
        </div>
        <p className={estilos.texto}>
          Para quem vai testar ou avaliar a ferramenta. Passe o e-mail e a senha para a pessoa; ela pode trocar a senha em
          Minha conta.
        </p>
        <ResumoErros envio={novaConta.estado.envio} erros={novaConta.estado.erros} campos={CAMPOS_CONTA} />
        <div className={estilos.grade}>
          <Campo id="nova-conta-nome" name="nome" rotulo="Nome" autoComplete="off" erro={novaConta.estado.erros?.nome} />
          <Campo
            id="nova-conta-email"
            name="email"
            type="email"
            rotulo="E-mail"
            autoComplete="off"
            erro={novaConta.estado.erros?.email}
          />
          <CampoSenha
            id="nova-conta-senha"
            name="senha"
            rotulo="Senha"
            ajuda="Pelo menos 8 caracteres."
            autoComplete="new-password"
            textoMostrar="Mostrar"
            erro={novaConta.estado.erros?.senha}
          />
        </div>
        <button type="submit" className={`${formulario.botao} ${formulario.primario} ${estilos.alinharInicio}`}>
          <UserPlus size={18} strokeWidth={1.5} aria-hidden="true" className={formulario.icone} />
          <span>Criar conta</span>
        </button>
      </form>

      <form className={estilos.secao} aria-labelledby="cenarios" noValidate onSubmit={cenarios.aoEnviar}>
        <div className={estilos.secaoTitulo}>
          <span className={estilos.secaoNumero}>03</span>
          <h2 id="cenarios" className={estilos.secaoNome}>
            Cenários de demonstração
          </h2>
        </div>
        <p className={estilos.texto}>
          Cria três estudos com dados inventados: “Agendamento de consultas” (A/B, coleta aberta, 52 respostas, 5
          suspeitas), “Portal do aluno” (encerrado, 33 respostas, 8 importadas de CSV, 3 suspeitas) e “Totem do
          restaurante universitário” (rascunho com 3 versões).
        </p>
        {cenarios.estado.erroGeral && <p className={formulario.erro}>{cenarios.estado.erroGeral}</p>}
        <div className={estilos.grade}>
          <div className={formulario.grupo}>
            <label htmlFor="cenario-dono" className={formulario.rotulo}>
              Dono dos estudos
            </label>
            <select id="cenario-dono" name="dono" className={formulario.campo} defaultValue={idAtual}>
              {contas.map((conta) => (
                <option key={conta.id} value={conta.id}>
                  {conta.nome} ({conta.email})
                </option>
              ))}
            </select>
            {cenarios.estado.erros?.dono && <p className={formulario.erro}>{cenarios.estado.erros.dono.mensagem}</p>}
          </div>
          <div className={formulario.grupo}>
            <label htmlFor="cenario-papel" className={formulario.rotulo}>
              Papel de quem recebe
            </label>
            <select id="cenario-papel" name="papel" className={formulario.campo} defaultValue="EDITOR">
              <option value="EDITOR">Editor</option>
              <option value="LEITOR">Leitor</option>
            </select>
          </div>
          <div className={formulario.grupo}>
            <label htmlFor="cenario-convites" className={formulario.rotulo}>
              Convites
            </label>
            <select id="cenario-convites" name="convites" className={formulario.campo} defaultValue="ACEITO">
              <option value="ACEITO">Já aceitos: os estudos aparecem direto</option>
              <option value="PENDENTE">Pendentes: a pessoa aceita pelo sino</option>
            </select>
          </div>
        </div>
        <fieldset className={formulario.grupoOpcoes}>
          <legend>Compartilhar com</legend>
          {contas
            .filter((conta) => conta.id !== idAtual)
            .map((conta) => (
              <label key={conta.id} className={formulario.opcao}>
                <input type="checkbox" name="colaboradores" value={conta.id} />
                <span>
                  {conta.nome} <span className={formulario.opcaoDetalhe}>{conta.email}</span>
                </span>
              </label>
            ))}
          {contas.length < 2 && <p className={estilos.texto}>Crie outra conta acima para poder compartilhar.</p>}
        </fieldset>
        <button
          type="submit"
          className={`${formulario.botao} ${formulario.primario} ${estilos.alinharInicio}`}
          disabled={cenarios.enviando}
        >
          <DatabaseZap size={18} strokeWidth={1.5} aria-hidden="true" className={formulario.icone} />
          <span>{cenarios.enviando ? "Criando os estudos…" : "Criar os três estudos"}</span>
        </button>
      </form>
    </>
  );
}
