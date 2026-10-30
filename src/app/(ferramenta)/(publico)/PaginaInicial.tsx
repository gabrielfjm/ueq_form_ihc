import { BookOpen, Folder, LogIn, Plus, UserPlus } from "lucide-react";
import Link from "next/link";
import formulario from "@/componentes/formulario/formulario.module.css";
import { MensagemStatus } from "@/componentes/formulario/MensagemStatus";
import { MAXIMO_VERSOES } from "@/lib/validacao-estudo";
import { BotaoAcesso } from "./_acesso/Acesso";
import { ESCALAS_DO_UEQ, PASSOS } from "./conteudo";
import estilos from "./inicio.module.css";

const CENTROS = [20, 62, 104, 146, 188, 230, 272];

const PARTICIPANTE = [
  [
    "Sem conta e sem instalar nada",
    "O link abre no celular ou no computador: primeiro o termo de consentimento, depois os 26 itens e, no fim, dados opcionais sobre a pessoa.",
  ],
  [
    "Nos 37 idiomas oficiais do UEQ",
    "O participante escolhe o idioma. Itens e instruções vêm do pacote oficial de traduções, sem nenhuma alteração.",
  ],
  [
    "Acessível do começo ao fim",
    "Funciona só com teclado, com leitor de tela e com zoom de 400%. A meta é a WCAG 2.2 nível AA, base da ABNT NBR 17225:2025.",
  ],
] as const;

const RESULTADOS = [
  [
    "Painel por escala",
    "Média, desvio-padrão, intervalo de confiança de 95% e alfa de Cronbach, com a interpretação escrita ao lado de cada número.",
  ],
  ["Benchmark oficial", "Cada média comparada com a base do UEQ, de Excelente a Ruim, com o nome da faixa em texto."],
  [
    "Comparação entre versões",
    `Até ${MAXIMO_VERSOES} versões do mesmo produto no mesmo gráfico, cada uma com um marcador de forma diferente.`,
  ],
  [
    "Respostas suspeitas",
    "Respostas inconsistentes ficam marcadas e podem sair da análise. Nada é apagado: dá para trazer de volta.",
  ],
  [
    "Exportar e importar",
    "CSV no formato da UEQ Data Analysis Tool, painel em PDF e importação, em CSV, de respostas coletadas fora da ferramenta.",
  ],
] as const;

// Retorno de ações que terminam aqui, depois que a sessão já acabou
const AVISOS = {
  saiu: "Você saiu da sua conta.",
  excluida: "Conta excluída. Os estudos e as respostas foram apagados.",
} as const;

export function avisoDaPaginaInicial(valor: string | string[] | undefined): string | null {
  return valor === "saiu" || valor === "excluida" ? AVISOS[valor] : null;
}

type Propriedades = {
  logado: boolean;
  aviso?: string | null;
};

// Protótipo r16: a página inicial explica o que é a ferramenta para quem ainda não tem conta.
// Cara de instrumento, não de SaaS (docs/design.md): texto à esquerda, o próprio item do questionário
// como figura, seções numeradas e uma tabela, sem cards nem hero centralizado
export function PaginaInicial({ logado, aviso }: Propriedades) {
  return (
    <>
      <div className={estilos.faixa}>
        <div className={estilos.faixaInterna}>
          <div className={estilos.apresentacao}>
            <MensagemStatus mensagem={aviso} className={estilos.regiaoStatus} />
            <p className={estilos.area}>Fundamentos da IHC · PPGIa · PUCPR · 2026</p>
            <h1 className={estilos.titulo}>Estudos de experiência do usuário com o UEQ</h1>
            <p className={estilos.descricao}>
              Cadastre o estudo, envie um link aos participantes e acompanhe as seis escalas do User Experience
              Questionnaire: média, intervalo de confiança, alfa de Cronbach e benchmark oficial. Os dados saem no
              formato da planilha oficial, para conferir cada cálculo.
            </p>
            <div className={estilos.acoes}>
              {logado ? (
                <>
                  <Link href="/estudos" className={`${formulario.botao} ${formulario.primario}`}>
                    <Folder size={18} strokeWidth={1.5} aria-hidden="true" className={formulario.icone} />
                    <span>Ver seus estudos</span>
                  </Link>
                  <Link href="/estudos/novo" className={`${formulario.botao} ${formulario.secundario}`}>
                    <Plus size={18} strokeWidth={1.5} aria-hidden="true" className={formulario.icone} />
                    <span>Criar estudo</span>
                  </Link>
                </>
              ) : (
                <>
                  <BotaoAcesso modo="cadastrar" className={`${formulario.botao} ${formulario.primario}`}>
                    <UserPlus size={18} strokeWidth={1.5} aria-hidden="true" className={formulario.icone} />
                    <span>Criar conta</span>
                  </BotaoAcesso>
                  <BotaoAcesso modo="entrar" className={`${formulario.botao} ${formulario.secundario}`}>
                    <LogIn size={18} strokeWidth={1.5} aria-hidden="true" className={formulario.icone} />
                    <span>Já tenho conta</span>
                  </BotaoAcesso>
                </>
              )}
            </div>
          </div>

          <figure className={estilos.figura}>
            <figcaption className={estilos.legenda}>Item 1 de 26, como o participante vê</figcaption>
            <div className={estilos.item}>
              <span className={estilos.termoEsquerdo}>Desagradável</span>
              <svg
                viewBox="0 0 292 40"
                className={estilos.circulos}
                role="img"
                aria-label="Sete círculos entre Desagradável e Agradável, com o quinto marcado"
              >
                <line x1="20" y1="20" x2="272" y2="20" />
                {CENTROS.map((cx, posicao) => (
                  <circle key={cx} cx={cx} cy="20" r="15" className={posicao === 4 ? estilos.marcada : estilos.vazia} />
                ))}
              </svg>
              <span className={estilos.termoDireito}>Agradável</span>
            </div>
            <dl className={estilos.numeros}>
              <div>
                <dt>itens</dt>
                <dd>26</dd>
              </div>
              <div>
                <dt>escalas</dt>
                <dd>6</dd>
              </div>
              <div>
                <dt>pontos por item</dt>
                <dd>7</dd>
              </div>
              <div>
                <dt>idiomas</dt>
                <dd>37</dd>
              </div>
            </dl>
          </figure>
        </div>
      </div>

      <div className={estilos.conteudo}>
        <section className={estilos.secao} aria-labelledby="inicio-como-funciona">
          <div className={estilos.secaoTitulo}>
            <span className={estilos.secaoNumero}>01</span>
            <h2 id="inicio-como-funciona" className={estilos.secaoNome}>
              Como funciona
            </h2>
          </div>
          <ol className={estilos.passos}>
            {PASSOS.map(([titulo, texto], posicao) => (
              <li key={titulo} className={estilos.passo}>
                <span className={estilos.passoNumero}>{String(posicao + 1).padStart(2, "0")}</span>
                <strong className={estilos.passoTitulo}>{titulo}</strong>
                <span className={estilos.textoSuave}>{texto}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className={estilos.secao} aria-labelledby="inicio-questionario">
          <div className={estilos.secaoTitulo}>
            <span className={estilos.secaoNumero}>02</span>
            <h2 id="inicio-questionario" className={estilos.secaoNome}>
              O questionário
            </h2>
          </div>
          <p className={estilos.paragrafo}>
            O UEQ tem 26 pares de palavras opostas, cada um numa escala de 7 pontos (diferencial semântico). A
            ferramenta usa a ordem, a polaridade e as traduções oficiais, e calcula as escalas do jeito que o handbook
            do UEQ descreve.
          </p>
          <div className={estilos.rolagemTabela} role="region" aria-labelledby="inicio-tabela-escalas" tabIndex={0}>
            <table className={estilos.tabela}>
              <caption id="inicio-tabela-escalas" className="visualmente-oculto">
                As seis escalas do UEQ
              </caption>
              <thead>
                <tr>
                  <th scope="col">Escala</th>
                  <th scope="col">Grupo</th>
                  <th scope="col" className={estilos.colunaNumero}>
                    Itens
                  </th>
                  <th scope="col">O que mede</th>
                </tr>
              </thead>
              <tbody>
                {ESCALAS_DO_UEQ.map(({ nome, grupo, itens, mede }) => (
                  <tr key={nome}>
                    <th scope="row">{nome}</th>
                    <td className={estilos.textoSuave}>{grupo}</td>
                    <td className={estilos.colunaNumero}>{itens}</td>
                    <td>{mede}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className={estilos.secao} aria-labelledby="inicio-participante">
          <div className={estilos.secaoTitulo}>
            <span className={estilos.secaoNumero}>03</span>
            <h2 id="inicio-participante" className={estilos.secaoNome}>
              Para o participante
            </h2>
          </div>
          <dl className={estilos.lista}>
            {PARTICIPANTE.map(([termo, descricao]) => (
              <div key={termo} className={estilos.itemLista}>
                <dt>{termo}</dt>
                <dd className={estilos.textoSuave}>{descricao}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className={estilos.secao} aria-labelledby="inicio-resultados">
          <div className={estilos.secaoTitulo}>
            <span className={estilos.secaoNumero}>04</span>
            <h2 id="inicio-resultados" className={estilos.secaoNome}>
              Resultados e dados
            </h2>
          </div>
          <dl className={estilos.lista}>
            {RESULTADOS.map(([termo, descricao]) => (
              <div key={termo} className={estilos.itemLista}>
                <dt>{termo}</dt>
                <dd className={estilos.textoSuave}>{descricao}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className={estilos.secao} aria-labelledby="inicio-documentacao">
          <div className={estilos.secaoTitulo}>
            <span className={estilos.secaoNumero}>05</span>
            <h2 id="inicio-documentacao" className={estilos.secaoNome}>
              Documentação
            </h2>
          </div>
          <p className={estilos.paragrafo}>
            Requisitos, personas, histórias de usuário, casos de uso, diagramas UML, arquitetura no modelo C4 e casos de
            teste, abertos a qualquer pessoa, sem precisar de conta. A equipe está escrevendo os documentos: cada um
            aparece na aba assim que fica pronto.
          </p>
          <Link href="/documentacao" className={`${formulario.linkAcao} ${estilos.linkDocumentacao}`}>
            <BookOpen size={18} strokeWidth={1.5} aria-hidden="true" />
            <span>Abrir a documentação</span>
          </Link>
        </section>
      </div>

      <footer className={estilos.rodape}>
        <div className={estilos.rodapeInterno}>
          <p>Fundamentos da IHC · PPGIa · PUCPR · 2026</p>
          <p>Gabriel Meira, Jean Weiss e Luiza Pedralli · Código aberto sob a licença MIT</p>
        </div>
      </footer>
    </>
  );
}
