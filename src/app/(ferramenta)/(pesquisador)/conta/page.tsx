import { Bell, IdCard, KeyRound, Languages, Trash2 } from "lucide-react";
import type { Metadata } from "next";
import { Avisos } from "@/componentes/Avisos";
import { PainelOpcoes } from "@/componentes/painel/PainelOpcoes";
import { ehIdioma, IDIOMA_PADRAO, infoIdioma } from "@/idiomas";
import { banco } from "@/lib/banco";
import { exigirPesquisador } from "@/lib/sessao";
import { formatarData, plural } from "@/lib/texto";
import { FaixaCabecalho } from "../FaixaCabecalho";
import estilos from "../pesquisador.module.css";
import { ExcluirConta } from "./ExcluirConta";
import conta from "./conta.module.css";
import { PreferenciaEmail } from "./PreferenciaEmail";
import { FichaConta } from "./FichaConta";
import { tradutor } from "@/traducao/servidor";
import { m, type Traduzir } from "@/traducao/nucleo";


export async function generateMetadata(): Promise<Metadata> {
  const t = await tradutor();
  return { title: t("Minha conta · Ferramenta UEQ") };
}

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
function avisoDeExclusao(t: Traduzir, estudos: number, respostas: number): { destaque: string; complemento: string } {
  const doEstudo = estudos === 1 ? t("o estudo") : t("os {n} estudos", { n: estudos });
  const dasRespostas = respostas === 1 ? t("a resposta coletada") : t("as {n} respostas coletadas", { n: respostas });
  const destaque =
    estudos > 0 && respostas > 0
      ? t("Excluir apaga sua conta, {estudos} e {respostas}.", { estudos: doEstudo, respostas: dasRespostas })
      : estudos > 0
        ? t("Excluir apaga sua conta e {estudos}.", { estudos: doEstudo })
        : t("Excluir apaga sua conta.");
  return {
    destaque,
    complemento: estudos > 0 ? t("Os links públicos param de funcionar. Não dá para desfazer.") : t("Não dá para desfazer."),
  };
}

type Propriedades = { searchParams: Promise<Record<string, string | string[] | undefined>> };

// Painel de Minha conta: cada cartão abre a página da opção (dados, senha, idioma) ou age ali mesmo
// (notificações por e-mail, excluir a conta, que abre a janela de confirmação)
export default async function PaginaConta({ searchParams }: Propriedades) {
  const t = await tradutor();
  const pesquisador = await exigirPesquisador();
  const { aviso } = await searchParams;
  const resumo = await resumoDaConta(pesquisador.id);
  const estudos = resumo.abertos + resumo.rascunhos + resumo.encerrados;
  const porStatus = [
    resumo.abertos > 0 ? plural(resumo.abertos, t("aberto"), t("abertos")) : null,
    resumo.rascunhos > 0 ? t("{rascunhos} em rascunho", { rascunhos: resumo.rascunhos }) : null,
    resumo.encerrados > 0 ? plural(resumo.encerrados, t("encerrado"), t("encerrados")) : null,
  ].filter((parte) => parte !== null);
  const idioma = infoIdioma(ehIdioma(pesquisador.idioma) ? pesquisador.idioma : IDIOMA_PADRAO);

  return (
    <>
      <FaixaCabecalho
        titulo={t("Minha conta")}
        ajuda="conta"
        descricao={t("Seus dados de acesso e preferências. Os participantes nunca veem seu nome nem seu e-mail.")}
      />
      <div className={estilos.conteudo}>
        <Avisos inicial={aviso === "idioma" ? t("Idioma da ferramenta trocado.") : null} className={conta.regiaoStatus}>
          <div className={conta.colunas}>
            <div className={conta.secoes}>
              <PainelOpcoes
                rotulo={t("Opções da conta")}
                opcoes={[
                  {
                    titulo: t("Dados cadastrais"),
                    descricao: t("Nome e e-mail que você usa para entrar."),
                    situacao: pesquisador.email,
                    Icone: IdCard,
                    href: "/conta/dados",
                  },
                  {
                    titulo: m("Senha"),
                    descricao: t("Troque a senha; as outras sessões abertas são encerradas."),
                    Icone: KeyRound,
                    href: "/conta/senha",
                  },
                  {
                    titulo: m("Idioma"),
                    descricao: t("Idioma da ferramenta e o padrão dos estudos que você cria."),
                    situacao: idioma.nome,
                    Icone: Languages,
                    href: "/conta/idioma",
                  },
                  {
                    titulo: t("Notificações"),
                    descricao: t("O sino avisa sobre convites, respostas novas e mudanças da equipe."),
                    Icone: Bell,
                    conteudo: <PreferenciaEmail receber={pesquisador.notificacoesPorEmail} />,
                  },
                  {
                    titulo: t("Excluir conta"),
                    descricao: t("Apaga a conta, os seus estudos e as respostas deles. Não dá para desfazer."),
                    Icone: Trash2,
                    conteudo: <ExcluirConta aviso={avisoDeExclusao(t, estudos, resumo.respostas)} />,
                  },
                ]}
              />
            </div>
            <FichaConta
              estudos={estudos}
              detalheEstudos={porStatus.length > 0 ? porStatus.join(" · ") : t("nenhum estudo criado ainda")}
              respostas={resumo.respostas}
              criadaEm={formatarData(pesquisador.criadoEm)}
            />
          </div>
        </Avisos>
      </div>
    </>
  );
}
