import type { Metadata } from "next";
import Link from "next/link";
import { exigirAdministrador } from "@/lib/administracao";
import { criptografiaAtiva } from "@/lib/cripto";
import { emailConfigurado } from "@/lib/email";
import { FaixaCabecalho } from "../../FaixaCabecalho";
import estilos from "../administracao.module.css";
import { tradutor } from "@/traducao/servidor";

export async function generateMetadata(): Promise<Metadata> {
  const t = await tradutor();
  return { title: t("Proteção de dados · Administração · Ferramenta UEQ") };
}

export default async function PaginaProtecao() {
  const t = await tradutor();
  await exigirAdministrador();
  const situacoes = [
    {
      titulo: t("Criptografia dos dados demográficos (AES-256-GCM)"),
      ativo: criptografiaAtiva(),
      sim: t("Ativa. Os dados novos já entram cifrados e os antigos são cifrados a cada deploy."),
      nao: t("Desligada. Configure CHAVE_CRIPTOGRAFIA na Vercel (openssl rand -base64 32) e faça um novo deploy."),
    },
    {
      titulo: t("Envio de e-mails (convites e notificações)"),
      ativo: emailConfigurado(),
      sim: "Configurado.",
      nao: t("Desligado. Os avisos ficam só no sino. Configure SMTP_HOST, SMTP_USUARIO e SMTP_SENHA na Vercel."),
    },
  ];
  return (
    <>
      <FaixaCabecalho
        titulo={t("Proteção de dados")}
        ajuda="administracao"
        migalha={<Link href="/administracao">{t("Administração")}</Link>}
        descricao={t("O que está configurado em produção e o que está sempre ativo.")}
      />
      <div className={estilos.conteudo}>
        <dl className={estilos.situacao}>
          {situacoes.map(({ titulo, ativo, sim, nao }) => (
            <div key={titulo}>
              <dt>{t(titulo)}</dt>
              <dd className={ativo ? estilos.ativo : estilos.inativo}>{ativo ? sim : nao}</dd>
            </div>
          ))}
          <div>
            <dt>{t("Sempre ativos")}</dt>
            <dd>
              {t("HTTPS com HSTS, política de conteúdo (CSP), senhas em bcrypt custo 12, limite de tentativas de login, cookie de sessão httpOnly e Secure, limpeza das participações abandonadas em 2 dias e nenhum acesso do administrador aos estudos de outras pessoas.")}
            </dd>
          </div>
        </dl>
      </div>
    </>
  );
}
