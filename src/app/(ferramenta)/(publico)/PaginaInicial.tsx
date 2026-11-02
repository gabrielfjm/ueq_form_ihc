import {
  ChartColumn,
  Download,
  Folder,
  Languages,
  Accessibility,
  LogIn,
  Plus,
  Send,
  ShieldCheck,
  SquarePen,
  UserPlus,
  Users,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import formulario from "@/componentes/formulario/formulario.module.css";
import { MensagemStatus } from "@/componentes/formulario/MensagemStatus";
import { REPOSITORIO } from "@/lib/documentacao/catalogo";
import { BotaoAcesso } from "./_acesso/Acesso";
import { AUTORES_DO_UEQ, ESCALAS_DO_UEQ, ESTUDOS_DO_UEQ, FAIXAS_DO_BENCHMARK, PASSOS } from "./conteudo";
import estilos from "./inicio.module.css";
import { tradutor } from "@/traducao/servidor";
import { m } from "@/traducao/nucleo";

const CENTROS = [20, 62, 104, 146, 188, 230, 272];

// Prévia ilustrativa do painel: médias de exemplo, uma por escala, na cor do grupo
const PREVIA = [
  { nome: m("Atratividade"), media: 1.6, grupo: "atratividade" },
  { nome: m("Perspicuidade"), media: 1.9, grupo: "pragmatica" },
  { nome: m("Eficiência"), media: 1.4, grupo: "pragmatica" },
  { nome: m("Confiabilidade"), media: 1.2, grupo: "pragmatica" },
  { nome: m("Estimulação"), media: 1.1, grupo: "hedonica" },
  { nome: m("Novidade"), media: 0.6, grupo: "hedonica" },
] as const;

const GRUPOS = [
  { nome: m("Atratividade"), classe: "atratividade", texto: m("Uma escala só, com 6 itens.") },
  { nome: m("Qualidade pragmática"), classe: "pragmatica", texto: m("Fazer a tarefa com facilidade.") },
  { nome: m("Qualidade hedônica"), classe: "hedonica", texto: m("Gostar de usar.") },
] as const;

const ICONES_PASSOS: LucideIcon[] = [SquarePen, Send, ChartColumn, Download];

const DESTAQUES: readonly [LucideIcon, string, string][] = [
  [Languages, "37 idiomas", m("O participante responde no idioma dele, com as traduções oficiais.")],
  [Accessibility, m("Acessível"), m("Teclado, leitor de tela e zoom de 400% (WCAG 2.2 AA).")],
  [Users, m("Em equipe"), m("Estudos compartilhados com editores e leitores.")],
  [ShieldCheck, m("Dados protegidos"), m("Nada identifica o participante; dados sensíveis cifrados (LGPD).")],
];

const EQUIPE = [
  [m("Gabriel Meira"), m("Desenvolvimento, protótipos, arquitetura, protocolo do UEQ e casos de teste")],
  [m("Jean Weiss"), m("Casos de uso, diagrama de classes e verificação do cálculo")],
  [m("Luiza Pedralli"), m("Requisitos, rastreabilidade, personas e histórias de usuário")],
] as const;

const SECOES = [
  ["inicio-ueq", m("O que é o UEQ")],
  ["inicio-leitura", m("Como ler os resultados")],
  ["inicio-como-funciona", m("Como funciona")],
  ["inicio-estudos", m("Estudos sobre o método")],
  ["inicio-creditos", m("Créditos")],
] as const;

// Retorno de ações que terminam aqui, depois que a sessão já acabou
const AVISOS = {
  saiu: m("Você saiu da sua conta."),
  excluida: m("Conta excluída. Os estudos e as respostas foram apagados."),
} as const;

export function avisoDaPaginaInicial(valor: string | string[] | undefined): string | null {
  return valor === "saiu" || valor === "excluida" ? AVISOS[valor] : null;
}

async function Titulo({ id, numero, children }: { id: string; numero: number; children: string }) {
  const t = await tradutor();
  return (
    <div className={estilos.secaoTitulo}>
      <span className={estilos.secaoNumero}>{t(String(numero).padStart(2, "0"))}</span>
      <h2 id={id} className={estilos.secaoNome}>
        {t(children)}
      </h2>
    </div>
  );
}

// Posição de uma média de −3 a +3 numa régua de 0 a 100%
const posicao = (valor: number) => ((valor + 3) / 6) * 100;

type Propriedades = {
  logado: boolean;
  aviso?: string | null;
};

// Página inicial: o que é o UEQ, como ler, como a ferramenta funciona, os estudos do método e os créditos.
// Pouco texto e mais figura, mas toda figura tem o equivalente em texto (leitor de tela) e nada depende
// de cor sozinha. A animação do item respeita "reduzir movimento" (globals.css)
export async function PaginaInicial({ logado, aviso }: Propriedades) {
  const t = await tradutor();
  return (
    <>
      <div className={estilos.faixa}>
        <div className={estilos.faixaInterna}>
          <div className={estilos.apresentacao}>
            <MensagemStatus mensagem={aviso} className={estilos.regiaoStatus} />
            <p className={estilos.area}>{t("User Experience Questionnaire")}</p>
            <h1 className={estilos.titulo}>{t("Estudos de experiência do usuário com o UEQ")}</h1>
            <p className={estilos.descricao}>
              {t("Crie o estudo, mande um link e veja as seis escalas do UEQ calculadas e comparadas com o benchmark oficial.")}
            </p>
            <div className={estilos.acoes}>
              {logado ? (
                <>
                  <Link href="/estudos" className={`${formulario.botao} ${formulario.primario}`}>
                    <Folder size={18} strokeWidth={1.5} aria-hidden="true" className={formulario.icone} />
                    <span>{t("Ver seus estudos")}</span>
                  </Link>
                  <Link href="/estudos/novo" className={`${formulario.botao} ${formulario.secundario}`}>
                    <Plus size={18} strokeWidth={1.5} aria-hidden="true" className={formulario.icone} />
                    <span>{t("Criar estudo")}</span>
                  </Link>
                </>
              ) : (
                <>
                  <BotaoAcesso modo="cadastrar" className={`${formulario.botao} ${formulario.primario}`}>
                    <UserPlus size={18} strokeWidth={1.5} aria-hidden="true" className={formulario.icone} />
                    <span>{t("Criar conta")}</span>
                  </BotaoAcesso>
                  <BotaoAcesso modo="entrar" className={`${formulario.botao} ${formulario.secundario}`}>
                    <LogIn size={18} strokeWidth={1.5} aria-hidden="true" className={formulario.icone} />
                    <span>{t("Já tenho conta")}</span>
                  </BotaoAcesso>
                </>
              )}
            </div>
            <dl className={estilos.numeros}>
              {[
                ["26", t("itens")],
                ["6", t("escalas")],
                ["7", t("pontos por item")],
                ["37", t("idiomas")],
              ].map(([valor, rotulo]) => (
                <div key={rotulo}>
                  <dt>{rotulo}</dt>
                  <dd>{valor}</dd>
                </div>
              ))}
            </dl>
          </div>

          <figure className={estilos.figura}>
            <figcaption className={estilos.legenda}>{t("O participante marca, a ferramenta calcula")}</figcaption>
            <div className={estilos.item}>
              <span className={estilos.termoEsquerdo}>{t("Desagradável")}</span>
              <svg
                viewBox="0 0 292 40"
                className={estilos.circulos}
                role="img"
                aria-label={t("Item do questionário: sete círculos entre Desagradável e Agradável, com o quinto marcado")}
              >
                <line x1="20" y1="20" x2="272" y2="20" />
                {CENTROS.map((cx, indice) => (
                  <circle key={cx} cx={cx} cy="20" r="15" className={indice === 4 ? estilos.marcada : estilos.vazia} />
                ))}
              </svg>
              <span className={estilos.termoDireito}>{t("Agradável")}</span>
            </div>
            <ul className={estilos.previa} aria-label={t("Exemplo de resultado: média de cada escala, de −3 a +3")}>
              {PREVIA.map(({ nome, media, grupo }) => (
                <li key={nome}>
                  <span className={estilos.previaNome}>{t(nome)}</span>
                  <span className={estilos.previaTrilho} aria-hidden="true">
                    <span className={estilos.previaZero} />
                    <span
                      className={`${estilos.previaBarra} ${estilos[grupo]}`}
                      style={{ left: "50%", width: `${posicao(media) - 50}%` }}
                    />
                  </span>
                  <span className={estilos.previaValor}>{t(media.toLocaleString("pt-BR", { minimumFractionDigits: 1 }))}</span>
                </li>
              ))}
            </ul>
          </figure>
        </div>
      </div>

      <nav aria-label={t("Nesta página")} className={estilos.indice}>
        <div className={estilos.indiceInterno}>
          <span className={estilos.indiceRotulo}>{t("Nesta página")}</span>
          {SECOES.map(([id, nome]) => (
            <a key={id} href={`#${id}`}>
              {t(nome)}
            </a>
          ))}
        </div>
      </nav>

      <div className={estilos.conteudo}>
        <section className={estilos.secao} aria-labelledby="inicio-ueq">
          <Titulo id="inicio-ueq" numero={1}>
            {t("O que é o UEQ")}
          </Titulo>
          <p className={estilos.paragrafo}>
            {t("Um questionário padronizado e gratuito: em poucos minutos, quem usou um produto marca 26 pares de palavras opostas, e o resultado vira seis notas comparáveis entre produtos e versões.")}
          </p>
          <div className={estilos.grupos}>
            {GRUPOS.map(({ nome, classe, texto }) => (
              <section key={nome} className={`${estilos.grupo} ${estilos[classe]}`} aria-labelledby={`grupo-${classe}`}>
                <h3 id={`grupo-${classe}`} className={estilos.grupoNome}>
                  {t(nome)}
                </h3>
                <p className={estilos.grupoTexto}>{t(texto)}</p>
                <ul className={estilos.escalas}>
                  {ESCALAS_DO_UEQ.filter((escala) => escala.grupo === nome).map((escala) => (
                    <li key={escala.nome}>
                      <strong>{t(escala.nome)}</strong>
                      <span>{t(escala.mede)}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </section>

        <section className={estilos.secao} aria-labelledby="inicio-leitura">
          <Titulo id="inicio-leitura" numero={2}>
            {t("Como ler os resultados")}
          </Titulo>
          <div className={estilos.leitura}>
            <figure className={estilos.regua}>
              <figcaption className={estilos.subtitulo}>{t("Cada escala vai de −3 a +3")}</figcaption>
              <div className={estilos.reguaFaixas}>
                <span className={estilos.negativa}>{t("Negativa")}</span>
                <span className={estilos.neutra}>{t("Neutra")}</span>
                <span className={estilos.positiva}>{t("Positiva")}</span>
              </div>
              <div className={estilos.reguaMarcas} aria-hidden="true">
                <span>−3</span>
                <span>−0,8</span>
                <span>+0,8</span>
                <span>+3</span>
              </div>
              <p className="visualmente-oculto">
                {t("Abaixo de −0,8 a avaliação é negativa; entre −0,8 e +0,8, neutra; acima de +0,8, positiva.")}
              </p>
              <p className={estilos.nota}>{t("Com 20 a 30 pessoas, o resultado costuma ficar estável.")}</p>
            </figure>
            <div>
              <h3 className={estilos.subtitulo}>{t("O benchmark")}</h3>
              <p className={estilos.nota}>{t("Comparação com 21.175 pessoas de 468 estudos (planilha oficial, versão 15).")}</p>
              <ol className={estilos.escada}>
                {FAIXAS_DO_BENCHMARK.map(([faixa, significado], indice) => (
                  <li key={faixa} className={estilos[`degrau${indice}`]}>
                    <strong>{t(faixa)}</strong>
                    <span>{t(significado)}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className={estilos.secao} aria-labelledby="inicio-como-funciona">
          <Titulo id="inicio-como-funciona" numero={3}>
            {t("Como funciona")}
          </Titulo>
          <ol className={estilos.passos}>
            {PASSOS.map(([titulo, texto], indice) => {
              const Icone = ICONES_PASSOS[indice] ?? SquarePen;
              return (
                <li key={titulo} className={estilos.passo}>
                  <span className={estilos.passoIcone} aria-hidden="true">
                    <Icone size={24} strokeWidth={1.5} />
                  </span>
                  <strong className={estilos.passoTitulo}>{t(titulo)}</strong>
                  <span className={estilos.textoSuave}>{t(texto)}</span>
                </li>
              );
            })}
          </ol>
          <ul className={estilos.destaques}>
            {DESTAQUES.map(([Icone, titulo, texto]) => (
              <li key={titulo}>
                <Icone size={22} strokeWidth={1.5} aria-hidden="true" className={estilos.destaqueIcone} />
                <strong>{t(titulo)}</strong>
                <span className={estilos.textoSuave}>{t(texto)}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className={estilos.secao} aria-labelledby="inicio-estudos">
          <Titulo id="inicio-estudos" numero={4}>
            {t("Estudos sobre o método")}
          </Titulo>
          <ol className={estilos.referencias}>
            {ESTUDOS_DO_UEQ.map(({ referencia, link }) => (
              <li key={referencia}>
                {t(referencia)}{" "}
                <a href={link} rel="noopener" className={estilos.linkEstudo}>
                  {link.startsWith("https://doi.org/") ? `DOI ${link.slice("https://doi.org/".length)}` : t("Abrir o PDF")}
                </a>
              </li>
            ))}
          </ol>
          <p className={estilos.nota}>
            {t("Mais publicações em")}{" "}
            <a href="https://www.ueq-online.org" rel="noopener">
              {t("ueq-online.org")}
            </a>
            {t(". Esta ferramenta não é oficial nem ligada aos autores do método.")}
          </p>
        </section>

        <section className={estilos.secao} aria-labelledby="inicio-creditos">
          <Titulo id="inicio-creditos" numero={5}>
            {t("Créditos")}
          </Titulo>
          <div className={estilos.creditos}>
            <div>
              <h3 className={estilos.subtitulo}>{t("O método UEQ")}</h3>
              <ul className={estilos.pessoas}>
                {AUTORES_DO_UEQ.map(([nome, papel]) => (
                  <li key={nome}>
                    <strong>{t(nome)}</strong>
                    <span className={estilos.textoSuave}>{t(papel)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className={estilos.subtitulo}>{t("Esta ferramenta")}</h3>
              <p className={estilos.textoSuave}>
                {t("Projeto da disciplina")}{" "}<strong>{t("Fundamentos da Interação Humano-Computador")}</strong>{" "}{t("do PPGIa da PUCPR, 2026.")}
              </p>
              <ul className={estilos.pessoas}>
                {EQUIPE.map(([nome, papel]) => (
                  <li key={nome}>
                    <strong>{t(nome)}</strong>
                    <span className={estilos.textoSuave}>{t(papel)}</span>
                  </li>
                ))}
              </ul>
              <p className={estilos.textoSuave}>
                {t("Código aberto (MIT) em")}{" "}<a href={REPOSITORIO} rel="noopener">{t("github.com/gabrielfjm/ueq_form_ihc")}</a> ·{" "}
                <Link href="/documentacao">{t("Documentação")}</Link>
              </p>
            </div>
          </div>
        </section>
      </div>

      <footer className={estilos.rodape}>
        <div className={estilos.rodapeInterno}>
          <p>{t("Fundamentos da IHC · PPGIa · PUCPR · 2026")}</p>
          <p>
            {t("UEQ © Laugwitz, Held e Schrepp ·")}{" "}<Link href="/privacidade">{t("Política de privacidade")}</Link>
          </p>
        </div>
      </footer>
    </>
  );
}
