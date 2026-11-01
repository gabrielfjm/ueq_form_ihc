import type { Metadata } from "next";
import Link from "next/link";
import { criptografiaAtiva } from "@/lib/cripto";
import { JANELA_MINUTOS, MAXIMO_TENTATIVAS } from "@/lib/tentativas";
import estilos from "./privacidade.module.css";

export const metadata: Metadata = { title: "Política de privacidade · Ferramenta UEQ" };

const ATUALIZADA_EM = "1º de novembro de 2026";

// LGPD (Lei 13.709/2018), art. 9º: informação clara sobre quais dados, para quê, por quanto tempo e quais
// direitos a pessoa tem. Escrita para ser lida por pesquisadores e participantes, sem juridiquês
export default function PaginaPrivacidade() {
  return (
    <>
      <div className={estilos.faixa}>
        <div className={estilos.faixaInterna}>
          <p className={estilos.area}>Proteção de dados · LGPD</p>
          <h1 className={estilos.titulo}>Política de privacidade</h1>
          <p className={estilos.descricao}>
            O que a Ferramenta UEQ guarda, para quê, por quanto tempo e como você controla os seus dados. Atualizada em{" "}
            {ATUALIZADA_EM}.
          </p>
        </div>
      </div>
      <article className={estilos.conteudo}>
        <section aria-labelledby="quem">
          <h2 id="quem">Quem cuida dos dados</h2>
          <p>
            A ferramenta é um projeto acadêmico da disciplina Fundamentos da IHC do PPGIa da PUCPR, feito por Gabriel Meira,
            Jean Weiss e Luiza Pedralli. Para os dados das contas, a equipe é a controladora. Para as respostas de um estudo,
            controlador é o pesquisador responsável por ele; a ferramenta só opera os dados em nome dele.
          </p>
        </section>

        <section aria-labelledby="participantes">
          <h2 id="participantes">Se você respondeu um questionário</h2>
          <ul>
            <li>
              <strong>Não guardamos nada que identifique você:</strong> nem nome, nem e-mail, nem endereço IP, nem
              localização. A ferramenta não usa cookies de rastreamento ou de publicidade.
            </li>
            <li>
              <strong>O que fica gravado:</strong> as 26 respostas do questionário, a versão do produto que você avaliou, o
              idioma, a data e, só se o pesquisador ligou essa etapa e você quis responder, a faixa etária, o gênero, a
              escolaridade e se você já usava o produto. Todas essas perguntas têm “Prefiro não responder” e podem ser
              puladas.
            </li>
            <li>
              <strong>Base legal:</strong> o seu consentimento, dado na primeira tela (art. 7º, I), para pesquisa acadêmica
              (art. 7º, IV).
            </li>
            <li>
              <strong>Desistir:</strong> até enviar, é só fechar a página ou usar “Sair sem enviar”: nada do que você marcou
              é gravado. Participações começadas e não enviadas são apagadas em até 2 dias.
            </li>
            <li>
              <strong>Depois de enviar:</strong> como nada liga as respostas a você, não temos como encontrá-las para
              mostrar ou apagar. Fale com o pesquisador que enviou o link.
            </li>
          </ul>
        </section>

        <section aria-labelledby="pesquisadores">
          <h2 id="pesquisadores">Se você tem conta de pesquisador</h2>
          <ul>
            <li>
              <strong>O que fica gravado:</strong> nome, e-mail, a senha (só como hash, nunca a senha), os estudos, os
              convites e as notificações. A sessão usa um único cookie necessário para manter você conectado.
            </li>
            <li>
              <strong>Para quê:</strong> entrar na ferramenta, organizar os estudos e trabalhar em equipe. Seu nome e e-mail
              aparecem só para as pessoas com quem você compartilha um estudo; os participantes nunca os veem.
            </li>
            <li>
              <strong>Por quanto tempo:</strong> enquanto a conta existir. Ao excluir a conta, apagamos na hora a conta, os
              estudos de que você é dono e todas as respostas deles.
            </li>
          </ul>
        </section>

        <section aria-labelledby="direitos">
          <h2 id="direitos">Seus direitos (LGPD, art. 18)</h2>
          <ul>
            <li>
              <strong>Ver e levar seus dados:</strong> em Minha conta, “Baixar meus dados” gera um arquivo com tudo o que a
              ferramenta guarda sobre a sua conta.
            </li>
            <li>
              <strong>Corrigir:</strong> nome e e-mail se mudam em Minha conta.
            </li>
            <li>
              <strong>Apagar:</strong> “Excluir conta”, em Minha conta, apaga tudo, sem período de espera.
            </li>
            <li>
              <strong>Revogar o envio de e-mails:</strong> desligue “Receber os avisos também por e-mail” em Minha conta.
            </li>
          </ul>
        </section>

        <section aria-labelledby="seguranca">
          <h2 id="seguranca">Como os dados são protegidos (LGPD, art. 46)</h2>
          <ul>
            <li>Toda a conexão usa HTTPS (TLS), inclusive entre a ferramenta e o banco de dados.</li>
            {criptografiaAtiva() && (
              <li>
                Os dados demográficos dos participantes são gravados cifrados com AES-256-GCM, com a chave guardada fora
                do banco: quem tivesse uma cópia do banco não conseguiria lê-los.
              </li>
            )}
            <li>O banco de dados fica cifrado em disco no provedor (Neon, região de São Paulo).</li>
            <li>
              Senhas são guardadas só como hash bcrypt (custo 12). Depois de {MAXIMO_TENTATIVAS} senhas erradas para o
              mesmo e-mail, o login espera {JANELA_MINUTOS} minutos.
            </li>
            <li>
              A sessão fica num cookie que o JavaScript da página não lê e que só vai por HTTPS; no banco fica apenas o
              hash dele. Trocar a senha encerra as outras sessões.
            </li>
            <li>
              Cada pessoa só vê os estudos que são dela ou que foram compartilhados com ela; os administradores da
              ferramenta veem todos, para suporte.
            </li>
          </ul>
        </section>

        <section aria-labelledby="contato">
          <h2 id="contato">Dúvidas e pedidos</h2>
          <p>
            Pesquisadores fazem tudo direto em <Link href="/conta">Minha conta</Link>. Participantes falam com o pesquisador
            que enviou o link do estudo, que é quem responde pela pesquisa.
          </p>
        </section>
      </article>
    </>
  );
}
