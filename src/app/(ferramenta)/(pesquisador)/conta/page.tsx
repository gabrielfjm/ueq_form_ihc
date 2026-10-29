import type { Metadata } from "next";
import { banco } from "@/lib/banco";
import { exigirPesquisador } from "@/lib/sessao";
import { formatarData, juntarComE, plural } from "@/lib/texto";
import { FaixaCabecalho } from "../FaixaCabecalho";
import estilos from "../pesquisador.module.css";
import { ConteudoConta } from "./ConteudoConta";
import { FichaConta } from "./FichaConta";

export const metadata: Metadata = { title: "Minha conta · Ferramenta UEQ" };

async function resumoDaConta(pesquisadorId: string) {
  const [porStatus, respostas] = await Promise.all([
    banco.estudo.groupBy({ by: ["status"], where: { pesquisadorId }, _count: { _all: true } }),
    banco.participacao.count({ where: { concluidaEm: { not: null }, versao: { estudo: { pesquisadorId } } } }),
  ]);
  const contar = (status: string) => porStatus.find((grupo) => grupo.status === status)?._count._all ?? 0;
  return {
    abertos: contar("ABERTO"),
    rascunhos: contar("RASCUNHO"),
    encerrados: contar("ENCERRADO"),
    respostas,
  };
}

// "Excluir apaga sua conta, os 3 estudos e as 86 respostas coletadas." (protótipo r9)
function avisoDeExclusao(estudos: number, respostas: number): { destaque: string; complemento: string } {
  const junto = [
    estudos === 1 ? "o estudo" : estudos > 1 ? `os ${estudos} estudos` : null,
    respostas === 1 ? "a resposta coletada" : respostas > 1 ? `as ${respostas} respostas coletadas` : null,
  ].filter((parte) => parte !== null);
  return {
    destaque: `Excluir apaga ${juntarComE(["sua conta", ...junto])}.`,
    complemento: estudos > 0 ? "Os links públicos param de funcionar. Não dá para desfazer." : "Não dá para desfazer.",
  };
}

export default async function PaginaConta() {
  const pesquisador = await exigirPesquisador();
  const resumo = await resumoDaConta(pesquisador.id);
  const estudos = resumo.abertos + resumo.rascunhos + resumo.encerrados;
  const porStatus = [
    resumo.abertos > 0 ? plural(resumo.abertos, "aberto", "abertos") : null,
    resumo.rascunhos > 0 ? `${resumo.rascunhos} em rascunho` : null,
    resumo.encerrados > 0 ? plural(resumo.encerrados, "encerrado", "encerrados") : null,
  ].filter((parte) => parte !== null);

  return (
    <>
      <FaixaCabecalho
        titulo="Minha conta"
        descricao="Seus dados de acesso. Ninguém além de você vê esta página, e os participantes nunca veem seu nome nem seu e-mail."
      />
      <div className={estilos.conteudo}>
        <ConteudoConta
          nome={pesquisador.nome}
          email={pesquisador.email}
          avisoExclusao={avisoDeExclusao(estudos, resumo.respostas)}
          ficha={
            <FichaConta
              estudos={estudos}
              detalheEstudos={porStatus.length > 0 ? porStatus.join(" · ") : "nenhum estudo criado ainda"}
              respostas={resumo.respostas}
              criadaEm={formatarData(pesquisador.criadoEm)}
            />
          }
        />
      </div>
    </>
  );
}
