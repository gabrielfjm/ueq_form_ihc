import { DatabaseZap, Languages, ShieldCheck, UserPlus, Users } from "lucide-react";
import type { Metadata } from "next";
import { PainelOpcoes } from "@/componentes/painel/PainelOpcoes";
import { exigirAdministrador } from "@/lib/administracao";
import { banco } from "@/lib/banco";
import { criptografiaAtiva } from "@/lib/cripto";
import { emailConfigurado } from "@/lib/email";
import { plural } from "@/lib/texto";
import { FaixaCabecalho } from "../FaixaCabecalho";
import estilos from "./administracao.module.css";
import { traducaoAutomaticaLigada } from "@/traducao/claude";
import { m } from "@/traducao/nucleo";
import { tradutor } from "@/traducao/servidor";

export async function generateMetadata(): Promise<Metadata> {
  const t = await tradutor();
  return { title: t("Administração · Ferramenta UEQ") };
}

// Painel do superusuário: cada cartão abre a página da ação. O administrador cuida das contas e da
// configuração, mas não vê os estudos nem as respostas de ninguém
export default async function PaginaAdministracao() {
  const t = await tradutor();
  await exigirAdministrador();
  const [contas, administradores] = await Promise.all([
    banco.pesquisador.count(),
    banco.pesquisador.count({ where: { administrador: true } }),
  ]);
  const protecaoCompleta = criptografiaAtiva() && emailConfigurado();

  return (
    <>
      <FaixaCabecalho
        titulo={t("Administração")}
        ajuda="administracao"
        descricao={t("Contas, estudos de demonstração e a proteção de dados da ferramenta.")}
      />
      <div className={estilos.conteudo}>
        <PainelOpcoes
          rotulo={t("Opções de administração")}
          opcoes={[
            {
              titulo: m("Contas"),
              descricao: t("Quem tem conta na ferramenta e quem é administrador."),
              situacao: `${plural(contas, t("conta"), t("contas"))} · ${plural(administradores, t("administrador"), t("administradores"))}`,
              Icone: Users,
              href: "/administracao/contas",
            },
            {
              titulo: t("Criar conta para alguém"),
              descricao: t("Para quem vai testar ou avaliar a ferramenta."),
              Icone: UserPlus,
              href: "/administracao/contas/nova",
            },
            {
              titulo: t("Cenários de demonstração"),
              descricao: t("Três estudos com dados inventados, para mostrar a ferramenta funcionando."),
              Icone: DatabaseZap,
              href: "/administracao/cenarios",
            },
            {
              titulo: t("Proteção de dados"),
              descricao: t("Criptografia, envio de e-mails e as proteções que estão sempre ativas."),
              situacao: protecaoCompleta ? t("Tudo configurado") : t("Falta configurar algo"),
              alerta: !protecaoCompleta,
              Icone: ShieldCheck,
              href: "/administracao/protecao",
            },
            {
              titulo: t("Idiomas"),
              descricao: t("A tradução da ferramenta para os 37 idiomas do UEQ, pela API do Claude."),
              situacao: traducaoAutomaticaLigada() ? t("Tradução automática ligada") : t("Tradução automática desligada"),
              alerta: !traducaoAutomaticaLigada(),
              Icone: Languages,
              href: "/administracao/idiomas",
            },
          ]}
        />
      </div>
    </>
  );
}
