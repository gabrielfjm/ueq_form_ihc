import type { Metadata, Route } from "next";
import Link from "next/link";
import { exigirAdministrador } from "@/lib/administracao";
import { banco } from "@/lib/banco";
import { formatarData, plural } from "@/lib/texto";
import tabela from "../estudos/estudos.module.css";
import { StatusEstudo } from "../estudos/StatusEstudo";
import { FaixaCabecalho } from "../FaixaCabecalho";
import estilos from "./administracao.module.css";
import { PainelAdministracao } from "./PainelAdministracao";

export const metadata: Metadata = { title: "Administração · Ferramenta UEQ" };

export default async function PaginaAdministracao() {
  const administrador = await exigirAdministrador();
  const [contas, estudos, respostasPorEstudo] = await Promise.all([
    banco.pesquisador.findMany({
      orderBy: { criadoEm: "asc" },
      select: {
        id: true,
        nome: true,
        email: true,
        criadoEm: true,
        administrador: true,
        tutorialVistoEm: true,
        _count: { select: { estudos: true, colaboracoes: { where: { status: "ACEITO" } } } },
      },
    }),
    banco.estudo.findMany({
      orderBy: { atualizadoEm: "desc" },
      select: {
        id: true,
        titulo: true,
        status: true,
        atualizadoEm: true,
        pesquisador: { select: { nome: true } },
        _count: { select: { colaboracoes: { where: { status: "ACEITO" } } } },
      },
    }),
    banco.participacao.groupBy({
      by: ["versaoId"],
      where: { concluidaEm: { not: null } },
      _count: { _all: true },
    }),
  ]);
  const versoes = await banco.versao.findMany({ select: { id: true, estudoId: true } });
  const estudoDaVersao = new Map(versoes.map((versao) => [versao.id, versao.estudoId]));
  const respostas = new Map<string, number>();
  for (const grupo of respostasPorEstudo) {
    const estudoId = estudoDaVersao.get(grupo.versaoId);
    if (estudoId) respostas.set(estudoId, (respostas.get(estudoId) ?? 0) + grupo._count._all);
  }

  return (
    <>
      <FaixaCabecalho
        titulo="Administração"
        ajuda="administracao"
        descricao="Acesso de superusuário: contas, estudos de demonstração e todos os estudos da ferramenta."
        resumo={`${plural(contas.length, "conta", "contas")} · ${plural(estudos.length, "estudo", "estudos")}`}
      />
      <div className={estilos.conteudo}>
        <PainelAdministracao
          idAtual={administrador.id}
          contas={contas.map((conta) => ({
            id: conta.id,
            nome: conta.nome,
            email: conta.email,
            criadaEm: formatarData(conta.criadoEm),
            administrador: conta.administrador,
            estudos: conta._count.estudos,
            compartilhados: conta._count.colaboracoes,
            jaEntrou: conta.tutorialVistoEm !== null,
          }))}
        />

        <section aria-labelledby="todos-estudos" className={estilos.secao}>
          <div className={estilos.secaoTitulo}>
            <span className={estilos.secaoNumero}>04</span>
            <h2 id="todos-estudos" className={estilos.secaoNome}>
              Todos os estudos
            </h2>
          </div>
          {estudos.length === 0 ? (
            <p className={estilos.texto}>Nenhum estudo na ferramenta ainda.</p>
          ) : (
            <div className={tabela.rolagemTabela}>
              <table className={tabela.tabela}>
                <caption>Do atualizado mais recentemente ao mais antigo. O administrador abre qualquer um deles.</caption>
                <thead>
                  <tr>
                    <th scope="col">Estudo</th>
                    <th scope="col">Dono</th>
                    <th scope="col">Status</th>
                    <th scope="col" className={tabela.direita}>Respostas</th>
                    <th scope="col" className={tabela.direita}>Pessoas convidadas</th>
                    <th scope="col" className={tabela.direita}>Atualizado em</th>
                  </tr>
                </thead>
                <tbody>
                  {estudos.map((estudo) => (
                    <tr key={estudo.id}>
                      <th scope="row">
                        <Link href={`/estudos/${estudo.id}` as Route} className={tabela.tituloEstudo}>
                          {estudo.titulo}
                        </Link>
                      </th>
                      <td>{estudo.pesquisador.nome}</td>
                      <td>
                        <StatusEstudo status={estudo.status} />
                      </td>
                      <td className={`${tabela.numero} ${tabela.direita}`}>{respostas.get(estudo.id) ?? 0}</td>
                      <td className={`${tabela.numero} ${tabela.direita}`}>{estudo._count.colaboracoes}</td>
                      <td className={`${tabela.numero} ${tabela.direita}`}>{formatarData(estudo.atualizadoEm)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
