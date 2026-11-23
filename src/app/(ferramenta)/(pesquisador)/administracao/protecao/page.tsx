import type { Metadata } from "next";
import Link from "next/link";
import { exigirAdministrador } from "@/lib/administracao";
import { criptografiaAtiva } from "@/lib/cripto";
import { banco } from "@/lib/banco";
import { configuracaoDoEmail } from "@/lib/email";
import { EnvioDeEmail } from "./EnvioDeEmail";
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
  const email = configuracaoDoEmail();
  const contasComEmail = await banco.pesquisador.count({ where: { notificacoesPorEmail: true } });
  const situacoes = [
    {
      titulo: t("Criptografia dos dados demográficos (AES-256-GCM)"),
      ativo: criptografiaAtiva(),
      sim: t("Ativa. Os dados novos já entram cifrados e os antigos são cifrados a cada deploy."),
      nao: t("Desligada. Configure CHAVE_CRIPTOGRAFIA na Vercel (openssl rand -base64 32) e faça um novo deploy."),
    },
    {
      titulo: t("Envio de e-mails (convites e notificações)"),
      ativo: email.configurado,
      sim: t("Configurado. Confira com o e-mail de teste: se o servidor recusar, a resposta dele aparece aqui."),
      nao: t("Desligado. Os avisos ficam só no sino. Configure SMTP_HOST, SMTP_PORTA, SMTP_USUARIO, SMTP_SENHA e EMAIL_REMETENTE na Vercel e faça um novo deploy."),
      extra: email.configurado && (
        <>
          <p className={estilos.configuracaoEmail}>
            {t("Servidor {servidor}, conta {usuario}, remetente {remetente}.", {
              servidor: `${email.host}:${email.porta}`,
              usuario: email.usuario,
              remetente: email.remetente,
            })}
          </p>
          <EnvioDeEmail contasComEmail={contasComEmail} />
        </>
      ),
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
          {situacoes.map(({ titulo, ativo, sim, nao, extra }) => (
            <div key={titulo}>
              <dt>{titulo}</dt>
              <dd className={ativo ? estilos.ativo : estilos.inativo}>{ativo ? sim : nao}</dd>
              {extra && <dd>{extra}</dd>}
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
