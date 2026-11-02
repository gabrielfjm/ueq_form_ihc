import type { Metadata } from "next";
import Link from "next/link";
import { criptografiaAtiva } from "@/lib/cripto";
import { JANELA_MINUTOS, MAXIMO_TENTATIVAS } from "@/lib/tentativas";
import estilos from "./privacidade.module.css";
import { tradutor } from "@/traducao/servidor";
import { m } from "@/traducao/nucleo";

export async function generateMetadata(): Promise<Metadata> {
  const t = await tradutor();
  return { title: t("Política de privacidade · Ferramenta UEQ") };
}

const ATUALIZADA_EM = m("1º de novembro de 2026");

// LGPD (Lei 13.709/2018), art. 9º: informação clara sobre quais dados, para quê, por quanto tempo e quais
// direitos a pessoa tem. Escrita para ser lida por pesquisadores e participantes, sem juridiquês
export default async function PaginaPrivacidade() {
  const t = await tradutor();
  return (
    <>
      <div className={estilos.faixa}>
        <div className={estilos.faixaInterna}>
          <p className={estilos.area}>{t("Proteção de dados · LGPD")}</p>
          <h1 className={estilos.titulo}>{t("Política de privacidade")}</h1>
          <p className={estilos.descricao}>
            {t("O que a Ferramenta UEQ guarda, para quê, por quanto tempo e como você controla os seus dados. Atualizada em {ATUALIZADA_EM}.", { ATUALIZADA_EM: ATUALIZADA_EM })}
          </p>
        </div>
      </div>
      <article className={estilos.conteudo}>
        <section aria-labelledby="quem">
          <h2 id="quem">{t("Quem cuida dos dados")}</h2>
          <p>
            {t("A ferramenta é um projeto acadêmico da disciplina Fundamentos da IHC do PPGIa da PUCPR, feito por Gabriel Meira, Jean Weiss e Luiza Pedralli. Para os dados das contas, a equipe é a controladora. Para as respostas de um estudo, controlador é o pesquisador responsável por ele; a ferramenta só opera os dados em nome dele.")}
          </p>
        </section>

        <section aria-labelledby="participantes">
          <h2 id="participantes">{t("Se você respondeu um questionário")}</h2>
          <ul>
            <li>
              <strong>{t("Não guardamos nada que identifique você:")}</strong>{" "}{t("nem nome, nem e-mail, nem endereço IP, nem localização. A ferramenta não usa cookies de rastreamento ou de publicidade.")}
            </li>
            <li>
              <strong>{t("O que fica gravado:")}</strong>{" "}{t("as 26 respostas do questionário, a versão do produto que você avaliou, o idioma, a data e, só se o pesquisador ligou essa etapa e você quis responder, a faixa etária, o gênero, a escolaridade e se você já usava o produto. Todas essas perguntas têm “Prefiro não responder” e podem ser puladas.")}
            </li>
            <li>
              <strong>{t("Base legal:")}</strong>{" "}{t("o seu consentimento, dado na primeira tela (art. 7º, I), para pesquisa acadêmica (art. 7º, IV).")}
            </li>
            <li>
              <strong>{t("Desistir:")}</strong>{" "}{t("até enviar, é só fechar a página ou usar “Sair sem enviar”: nada do que você marcou é gravado. Participações começadas e não enviadas são apagadas em até 2 dias.")}
            </li>
            <li>
              <strong>{t("Depois de enviar:")}</strong>{" "}{t("como nada liga as respostas a você, não temos como encontrá-las para mostrar ou apagar. Fale com o pesquisador que enviou o link.")}
            </li>
          </ul>
        </section>

        <section aria-labelledby="pesquisadores">
          <h2 id="pesquisadores">{t("Se você tem conta de pesquisador")}</h2>
          <ul>
            <li>
              <strong>{t("O que fica gravado:")}</strong>{" "}{t("nome, e-mail, a senha (só como hash, nunca a senha), os estudos, os convites e as notificações. A sessão usa um único cookie necessário para manter você conectado.")}
            </li>
            <li>
              <strong>{t("Para quê:")}</strong>{" "}{t("entrar na ferramenta, organizar os estudos e trabalhar em equipe. Seu nome e e-mail aparecem só para as pessoas com quem você compartilha um estudo; os participantes nunca os veem.")}
            </li>
            <li>
              <strong>{t("Por quanto tempo:")}</strong>{" "}{t("enquanto a conta existir. Ao excluir a conta, apagamos na hora a conta, os estudos de que você é dono e todas as respostas deles.")}
            </li>
          </ul>
        </section>

        <section aria-labelledby="direitos">
          <h2 id="direitos">{t("Seus direitos (LGPD, art. 18)")}</h2>
          <ul>
            <li>
              <strong>{t("Ver e levar seus dados:")}</strong>{" "}{t("em Minha conta, “Baixar meus dados” gera um arquivo com tudo o que a ferramenta guarda sobre a sua conta.")}
            </li>
            <li>
              <strong>{t("Corrigir:")}</strong>{" "}{t("nome e e-mail se mudam em Minha conta.")}
            </li>
            <li>
              <strong>{t("Apagar:")}</strong>{" "}{t("“Excluir conta”, em Minha conta, apaga tudo, sem período de espera.")}
            </li>
            <li>
              <strong>{t("Revogar o envio de e-mails:")}</strong>{" "}{t("desligue “Receber os avisos também por e-mail” em Minha conta.")}
            </li>
          </ul>
        </section>

        <section aria-labelledby="seguranca">
          <h2 id="seguranca">{t("Como os dados são protegidos (LGPD, art. 46)")}</h2>
          <ul>
            <li>{t("Toda a conexão usa HTTPS (TLS), inclusive entre a ferramenta e o banco de dados.")}</li>
            {criptografiaAtiva() && (
              <li>
                {t("Os dados demográficos dos participantes são gravados cifrados com AES-256-GCM, com a chave guardada fora do banco: quem tivesse uma cópia do banco não conseguiria lê-los.")}
              </li>
            )}
            <li>{t("O banco de dados fica cifrado em disco no provedor (Neon, região de São Paulo).")}</li>
            <li>
              {t("Senhas são guardadas só como hash bcrypt (custo 12). Depois de {MAXIMO_TENTATIVAS} senhas erradas para o mesmo e-mail, o login espera {JANELA_MINUTOS} minutos.", { MAXIMO_TENTATIVAS: MAXIMO_TENTATIVAS, JANELA_MINUTOS: JANELA_MINUTOS })}
            </li>
            <li>
              {t("A sessão fica num cookie que o JavaScript da página não lê e que só vai por HTTPS; no banco fica apenas o hash dele. Trocar a senha encerra as outras sessões.")}
            </li>
            <li>
              {t("Cada pessoa só vê os estudos que são dela ou que foram compartilhados com ela. Nem os administradores da ferramenta veem os estudos ou as respostas de outras pessoas.")}
            </li>
            <li>
              {t("Para mostrar a ferramenta e o questionário em outros idiomas, os textos da interface e o título, o produto e o objetivo de cada estudo vão para a API do Claude (Anthropic), que devolve a tradução. Nenhuma resposta, nome, e-mail ou dado demográfico vai junto.")}
            </li>
          </ul>
        </section>

        <section aria-labelledby="contato">
          <h2 id="contato">{t("Dúvidas e pedidos")}</h2>
          <p>
            {t("Pesquisadores fazem tudo direto em")}{" "}<Link href="/conta">{t("Minha conta")}</Link>{t(". Participantes falam com o pesquisador que enviou o link do estudo, que é quem responde pela pesquisa.")}
          </p>
        </section>
      </article>
    </>
  );
}
