import Link from "next/link";
import type { ReactNode } from "react";
import { criptografiaAtiva } from "@/lib/cripto";
import { JANELA_MINUTOS, MAXIMO_TENTATIVAS } from "@/lib/tentativas";
import { m, type Traduzir } from "@/traducao/nucleo";
import estilos from "./privacidade.module.css";

const ATUALIZADA_EM = m("1º de novembro de 2026");
const MARCACOES = [17, 64.6, 112.2, 159.8, 207.4, 255, 302.6];

type Linha = readonly [rotulo: string, texto: ReactNode];
type Secao = { id: string; titulo: string; linhas: readonly Linha[] };

type Propriedades = {
  t: Traduzir;
  voltar: ReactNode;
  // O link do participante não leva a nenhum outro lugar da ferramenta (docs/design.md, Layout)
  comLinkDaConta: boolean;
  aviso?: ReactNode;
  // Ações que aparecem na ficha, abaixo do índice
  ficha?: ReactNode;
};

// LGPD (Lei 13.709/2018), art. 9º: informação clara sobre quais dados, para quê, por quanto tempo e quais
// direitos a pessoa tem. Escrita para ser lida por pesquisadores e participantes, sem juridiquês.
// Cada seção é uma lista de rótulo e explicação com régua entre as linhas, como as condições do consentimento
export function Politica({ t, voltar, comLinkDaConta, aviso, ficha }: Propriedades) {
  const secoes: readonly Secao[] = [
    {
      id: "quem",
      titulo: t("Quem cuida dos dados"),
      linhas: [
        [t("A ferramenta"), t("Um projeto acadêmico da disciplina Fundamentos da IHC do PPGIa da PUCPR, feito por Gabriel Meira, Jean Weiss e Luiza Pedralli.")],
        [t("Dados das contas"), t("A equipe é a controladora desses dados.")],
        [t("Respostas de um estudo"), t("O controlador dos dados é o pesquisador responsável pelo estudo; a ferramenta só trata os dados em nome dele.")],
      ],
    },
    {
      id: "participantes",
      titulo: t("Se você respondeu um questionário"),
      linhas: [
        [t("O que não guardamos"), t("Nada que identifique você: nem nome, nem e-mail, nem endereço IP, nem localização. A ferramenta não usa cookies de rastreamento ou de publicidade.")],
        [t("O que fica gravado"), t("As 26 respostas do questionário, a versão do produto que você avaliou, o idioma, a data e, só se o pesquisador ligou essa etapa e você quis responder, a faixa etária, o gênero, a escolaridade e se você já usava o produto. Todas essas perguntas têm “Prefiro não responder” e podem ser puladas.")],
        [t("Base legal"), t("O seu consentimento, dado na primeira tela (art. 7º, I), para pesquisa acadêmica (art. 7º, IV).")],
        [t("Desistir"), t("Até enviar, é só fechar a página ou usar “Sair sem enviar”: nada do que você marcou é gravado. Participações começadas e não enviadas são apagadas em até 2 dias.")],
        [t("Depois de enviar"), t("Como nada liga as respostas a você, não temos como encontrá-las para mostrar ou apagar. Fale com o pesquisador que enviou o link.")],
      ],
    },
    {
      id: "pesquisadores",
      titulo: t("Se você tem conta de pesquisador"),
      linhas: [
        [t("O que fica gravado"), t("Nome, e-mail, a senha (só como hash, nunca a senha), os estudos, os convites e as notificações. A sessão usa um único cookie necessário para manter você conectado.")],
        [t("Para quê"), t("Entrar na ferramenta, organizar os estudos e trabalhar em equipe. Seu nome e e-mail aparecem só para as pessoas com quem você compartilha um estudo; os participantes nunca os veem.")],
        [t("Por quanto tempo"), t("Enquanto a conta existir. Ao excluir a conta, apagamos na hora a conta, os estudos de que você é dono e todas as respostas deles.")],
      ],
    },
    {
      id: "direitos",
      titulo: t("Seus direitos (LGPD, art. 18)"),
      linhas: [
        [t("Ver e levar seus dados"), t("Em Minha conta, “Baixar meus dados” gera um arquivo com tudo o que a ferramenta guarda sobre a sua conta.")],
        [t("Corrigir"), t("Você altera o nome e o e-mail em Minha conta.")],
        [t("Apagar"), t("“Excluir conta”, em Minha conta, apaga tudo, sem período de espera.")],
        [t("Parar os e-mails"), t("Desligue “Receber os avisos também por e-mail” em Minha conta.")],
      ],
    },
    {
      id: "seguranca",
      titulo: t("Como os dados são protegidos (LGPD, art. 46)"),
      linhas: [
        [t("Conexão"), t("Toda a conexão usa HTTPS (TLS), inclusive entre a ferramenta e o banco de dados.")],
        ...(criptografiaAtiva()
          ? ([[t("Dados demográficos"), t("Os dados demográficos são gravados cifrados com AES-256-GCM, com a chave guardada fora do banco: quem tivesse uma cópia do banco não conseguiria lê-los.")]] as const)
          : []),
        [t("Banco de dados"), t("O banco de dados fica cifrado em disco no provedor (Neon, região de São Paulo).")],
        [t("Senhas"), t("As senhas são guardadas só como hash bcrypt (custo 12). Depois de {MAXIMO_TENTATIVAS} senhas erradas para o mesmo e-mail, o login espera {JANELA_MINUTOS} minutos.", { MAXIMO_TENTATIVAS, JANELA_MINUTOS })],
        [t("Sessão"), t("A sessão fica num cookie que o JavaScript da página não lê e que só vai por HTTPS; no banco fica apenas o hash dele. Trocar a senha encerra as outras sessões.")],
        [t("Quem vê o quê"), t("Cada pessoa só vê os estudos que são dela ou que foram compartilhados com ela. Nem os administradores da ferramenta veem os estudos ou as respostas de outras pessoas.")],
        [t("Traduções"), t("Para mostrar a ferramenta e o questionário em outros idiomas, os textos da interface e o título, o produto e o objetivo de cada estudo vão para a API do Claude (Anthropic), que devolve a tradução. Nenhuma resposta, nome, e-mail ou dado demográfico vai junto.")],
      ],
    },
    {
      id: "contato",
      titulo: t("Dúvidas e pedidos"),
      linhas: [
        [t("Pesquisadores"), <>{t("Os pesquisadores fazem tudo direto na página Minha conta.")}{comLinkDaConta && <>{" "}<Link href="/conta">{t("Abrir Minha conta")}</Link></>}</>],
        [t("Participantes"), t("Os participantes devem falar com o pesquisador que enviou o link do estudo, que é quem responde pela pesquisa.")],
      ],
    },
  ];

  return (
    <>
      <div className={estilos.faixa}>
        <div className={estilos.faixaInterna}>
          <div className={estilos.apresentacao}>
            {voltar}
            {aviso}
            <p className={estilos.area}>{t("Proteção de dados · LGPD")}</p>
            <h1 className={estilos.titulo}>{t("Política de privacidade")}</h1>
            <p className={estilos.descricao}>
              {t("O que a Ferramenta UEQ guarda, para quê, por quanto tempo e como você controla os seus dados.")}
            </p>
            <p className={estilos.atualizada}>{t("Atualizada em {ATUALIZADA_EM}.", { ATUALIZADA_EM: t(ATUALIZADA_EM) })}</p>
          </div>
          <section aria-labelledby="privacidade-resumo" className={estilos.resumo}>
            <svg viewBox="0 0 320 34" className={estilos.marcacoes} aria-hidden="true">
              <line x1="17" y1="17" x2="303" y2="17" />
              {MARCACOES.map((centro, indice) => (
                <circle key={centro} cx={centro} cy="17" r="15" className={indice === 4 ? estilos.marcada : estilos.vazia} />
              ))}
            </svg>
            <h2 id="privacidade-resumo" className={estilos.resumoTitulo}>
              {t("Em resumo")}
            </h2>
            <dl className={estilos.resumoLista}>
              <div>
                <dt>{t("Quem responde")}</dt>
                <dd>{t("Permanece anônimo: nada liga as respostas à pessoa.")}</dd>
              </div>
              <div>
                <dt>{t("Quem tem conta")}</dt>
                <dd>{t("Pode fazer o download dos próprios dados ou apagá-los quando quiser.")}</dd>
              </div>
              <div>
                <dt>{t("Rastreamento")}</dt>
                <dd>{t("A ferramenta não rastreia ninguém: não usa cookies de rastreamento nem de publicidade.")}</dd>
              </div>
            </dl>
          </section>
        </div>
      </div>

      <div className={estilos.colunas}>
        <aside className={estilos.ficha}>
          <nav aria-labelledby="privacidade-indice">
            <h2 id="privacidade-indice" className={estilos.fichaTitulo}>
              {t("Nesta página")}
            </h2>
            <ol className={estilos.indice}>
              {secoes.map(({ id, titulo }, posicao) => (
                <li key={id}>
                  <span className={estilos.numero} aria-hidden="true">
                    {String(posicao + 1).padStart(2, "0")}
                  </span>
                  <a href={`#${id}`}>{titulo}</a>
                </li>
              ))}
            </ol>
          </nav>
          {ficha}
        </aside>

        <article className={estilos.conteudo}>
          {secoes.map(({ id, titulo, linhas }, posicao) => (
            <section key={id} aria-labelledby={id} className={estilos.secao}>
              <div className={estilos.secaoTitulo}>
                <span className={estilos.numero} aria-hidden="true">
                  {String(posicao + 1).padStart(2, "0")}
                </span>
                <h2 id={id}>{titulo}</h2>
              </div>
              <dl className={estilos.linhas}>
                {linhas.map(([rotulo, texto]) => (
                  <div key={rotulo}>
                    <dt>{rotulo}</dt>
                    <dd>{texto}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
          <div className={estilos.fim}>{voltar}</div>
        </article>
      </div>
    </>
  );
}
