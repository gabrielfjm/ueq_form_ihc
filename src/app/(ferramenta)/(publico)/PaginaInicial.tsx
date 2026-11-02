import { BookOpen, Folder, LogIn, Plus, UserPlus } from "lucide-react";
import Link from "next/link";
import formulario from "@/componentes/formulario/formulario.module.css";
import { MensagemStatus } from "@/componentes/formulario/MensagemStatus";
import { MAXIMO_VERSOES } from "@/lib/validacao-estudo";
import { BotaoAcesso } from "./_acesso/Acesso";
import { REPOSITORIO } from "@/lib/documentacao/catalogo";
import { AUTORES_DO_UEQ, ESCALAS_DO_UEQ, ESTUDOS_DO_UEQ, FAIXAS_DO_BENCHMARK, PASSOS } from "./conteudo";
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

const EQUIPE = [
  ["Gabriel Meira", "Desenvolvimento, protótipos, arquitetura, protocolo do UEQ e casos de teste"],
  ["Jean Weiss", "Casos de uso, diagrama de classes e verificação do cálculo"],
  ["Luiza Pedralli", "Requisitos, rastreabilidade, personas e histórias de usuário"],
] as const;

const SECOES = [
  ["inicio-ueq", "O que é o UEQ"],
  ["inicio-questionario", "O questionário"],
  ["inicio-leitura", "Como ler os resultados"],
  ["inicio-como-funciona", "Como a ferramenta funciona"],
  ["inicio-estudos", "Estudos sobre o método"],
  ["inicio-creditos", "Créditos"],
] as const;

function Titulo({ id, numero, children }: { id: string; numero: number; children: string }) {
  return (
    <div className={estilos.secaoTitulo}>
      <span className={estilos.secaoNumero}>{String(numero).padStart(2, "0")}</span>
      <h2 id={id} className={estilos.secaoNome}>
        {children}
      </h2>
    </div>
  );
}

function Lista({ itens }: { itens: readonly (readonly [string, string])[] }) {
  return (
    <dl className={estilos.lista}>
      {itens.map(([termo, descricao]) => (
        <div key={termo} className={estilos.itemLista}>
          <dt>{termo}</dt>
          <dd className={estilos.textoSuave}>{descricao}</dd>
        </div>
      ))}
    </dl>
  );
}

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

      <nav aria-label="Nesta página" className={estilos.indice}>
        <div className={estilos.indiceInterno}>
          <span className={estilos.indiceRotulo}>Nesta página</span>
          {SECOES.map(([id, nome]) => (
            <a key={id} href={`#${id}`}>
              {nome}
            </a>
          ))}
        </div>
      </nav>

      <div className={estilos.conteudo}>
        <section className={estilos.secao} aria-labelledby="inicio-ueq">
          <Titulo id="inicio-ueq" numero={1}>
            O que é o UEQ
          </Titulo>
          <p className={estilos.paragrafo}>
            O <strong>User Experience Questionnaire (UEQ)</strong> é um questionário padronizado para medir como as
            pessoas percebem a experiência de usar um produto: um site, um aplicativo, um sistema, um totem. Em poucos
            minutos, quem usou o produto marca sua impressão em 26 pares de palavras opostas, e o resultado vira seis
            notas comparáveis entre estudos e entre versões do mesmo produto.
          </p>
          <p className={estilos.paragrafo}>
            Ele mede dois lados da experiência. A <strong>qualidade pragmática</strong> é a parte orientada à tarefa: se
            o produto é fácil de entender, rápido e previsível. A <strong>qualidade hedônica</strong> é o que não depende
            da tarefa: se usar é interessante e se o produto parece novo. A <strong>atratividade</strong> resume a
            impressão geral.
          </p>
          <p className={estilos.paragrafo}>
            O UEQ é gratuito. O questionário, as traduções, o manual e a planilha de análise estão no site oficial,{" "}
            <a href="https://www.ueq-online.org" rel="noopener">
              ueq-online.org
            </a>
            . Esta ferramenta automatiza a aplicação e o cálculo seguindo esse material; ela não é oficial nem ligada aos
            autores do método.
          </p>
        </section>

        <section className={estilos.secao} aria-labelledby="inicio-questionario">
          <Titulo id="inicio-questionario" numero={2}>
            O questionário
          </Titulo>
          <p className={estilos.paragrafo}>
            Cada um dos 26 itens é um par de palavras opostas numa escala de 7 pontos (diferencial semântico), como na
            figura acima. A ordem dos itens e o lado de cada palavra são fixos; metade dos itens começa pela palavra
            positiva, para a pessoa ler cada par em vez de marcar tudo do mesmo lado. A ferramenta usa a ordem, a
            polaridade e as traduções oficiais, e calcula as escalas do jeito que o manual do UEQ descreve.
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
                    <td>{grupo}</td>
                    <td className={estilos.colunaNumero}>{itens}</td>
                    <td>{mede}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className={estilos.secao} aria-labelledby="inicio-leitura">
          <Titulo id="inicio-leitura" numero={3}>
            Como ler os resultados
          </Titulo>
          <dl className={estilos.lista}>
            <div className={estilos.itemLista}>
              <dt>De −3 a +3</dt>
              <dd className={estilos.textoSuave}>
                Cada escala é a média das respostas, transformadas para ir de −3 (a pior impressão) a +3 (a melhor).
                Médias acima de +2 ou abaixo de −2 são raras, porque as pessoas tendem a evitar os extremos.
              </dd>
            </div>
            <div className={estilos.itemLista}>
              <dt>Positiva, neutra ou negativa</dt>
              <dd className={estilos.textoSuave}>
                Acima de +0,8 a avaliação é positiva; abaixo de −0,8, negativa; entre os dois, neutra.
              </dd>
            </div>
            <div className={estilos.itemLista}>
              <dt>Quantas pessoas</dt>
              <dd className={estilos.textoSuave}>
                Com 20 a 30 pessoas o resultado costuma ficar estável. O intervalo de confiança mostra quanto a média ainda
                pode mudar: quanto mais estreito, mais seguro.
              </dd>
            </div>
            <div className={estilos.itemLista}>
              <dt>Respostas suspeitas</dt>
              <dd className={estilos.textoSuave}>
                Quem responde ao acaso costuma se contradizer dentro da mesma escala. O manual sugere tirar da análise quem
                faz isso em 3 ou mais escalas ou marca mais de 15 itens na mesma posição.
              </dd>
            </div>
          </dl>
          <h3 className={estilos.subtitulo}>O benchmark</h3>
          <p className={estilos.paragrafo}>
            Para saber se uma média é boa, o UEQ a compara com uma base de 21.175 pessoas de 468 estudos com produtos
            de todo tipo (planilha oficial, versão 15). Cada escala cai numa das cinco faixas:
          </p>
          <div className={estilos.rolagemTabela} role="region" aria-labelledby="inicio-tabela-benchmark" tabIndex={0}>
            <table className={estilos.tabela}>
              <caption id="inicio-tabela-benchmark" className="visualmente-oculto">
                As cinco faixas do benchmark do UEQ
              </caption>
              <thead>
                <tr>
                  <th scope="col">Faixa</th>
                  <th scope="col">O que quer dizer</th>
                </tr>
              </thead>
              <tbody>
                {FAIXAS_DO_BENCHMARK.map(([faixa, significado]) => (
                  <tr key={faixa}>
                    <th scope="row">{faixa}</th>
                    <td>{significado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className={estilos.secao} aria-labelledby="inicio-como-funciona">
          <Titulo id="inicio-como-funciona" numero={4}>
            Como a ferramenta funciona
          </Titulo>
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

        <section className={estilos.secao} aria-labelledby="inicio-participante">
          <Titulo id="inicio-participante" numero={5}>
            Para o participante
          </Titulo>
          <Lista itens={PARTICIPANTE} />
        </section>

        <section className={estilos.secao} aria-labelledby="inicio-resultados">
          <Titulo id="inicio-resultados" numero={6}>
            Para o pesquisador
          </Titulo>
          <Lista itens={RESULTADOS} />
        </section>

        <section className={estilos.secao} aria-labelledby="inicio-estudos">
          <Titulo id="inicio-estudos" numero={7}>
            Estudos sobre o método
          </Titulo>
          <p className={estilos.paragrafo}>
            Os trabalhos em que o UEQ foi construído e validado, e os que a ferramenta segue no cálculo, no benchmark e
            na tradução. A lista completa de publicações está em{" "}
            <a href="https://www.ueq-online.org" rel="noopener">
              ueq-online.org
            </a>
            .
          </p>
          <ol className={estilos.referencias}>
            {ESTUDOS_DO_UEQ.map(({ referencia, sobre }) => (
              <li key={referencia}>
                <p className={estilos.referencia}>{referencia}</p>
                <p className={estilos.textoSuave}>{sobre}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className={estilos.secao} aria-labelledby="inicio-documentacao">
          <Titulo id="inicio-documentacao" numero={8}>
            Documentação
          </Titulo>
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

        <section className={estilos.secao} aria-labelledby="inicio-creditos">
          <Titulo id="inicio-creditos" numero={9}>
            Créditos
          </Titulo>
          <div className={estilos.creditos}>
            <div>
              <h3 className={estilos.subtitulo}>O método UEQ</h3>
              <p className={estilos.textoSuave}>
                Todo o mérito do instrumento é dos autores do UEQ. Os itens, as traduções, a instrução ao participante e os
                limites do benchmark são deles, distribuídos em ueq-online.org, e aparecem aqui sem alteração.
              </p>
              <Lista itens={AUTORES_DO_UEQ} />
            </div>
            <div>
              <h3 className={estilos.subtitulo}>Esta ferramenta</h3>
              <p className={estilos.textoSuave}>
                Feita como projeto da disciplina <strong>Fundamentos da Interação Humano-Computador</strong> do Programa de
                Pós-Graduação em Informática (PPGIa) da Pontifícia Universidade Católica do Paraná (PUCPR), em 2026.
              </p>
              <ul className={estilos.equipe}>
                {EQUIPE.map(([nome, papel]) => (
                  <li key={nome}>
                    <strong>{nome}</strong>
                    <span className={estilos.textoSuave}>{papel}</span>
                  </li>
                ))}
              </ul>
              <p className={estilos.textoSuave}>
                Código aberto sob a licença MIT, em{" "}
                <a href={REPOSITORIO} rel="noopener">
                  github.com/gabrielfjm/ueq_form_ihc
                </a>
                . A licença não cobre o material oficial do UEQ.
              </p>
            </div>
          </div>
        </section>
      </div>

      <footer className={estilos.rodape}>
        <div className={estilos.rodapeInterno}>
          <p>Fundamentos da IHC · PPGIa · PUCPR · 2026</p>
          <p>
            Gabriel Meira, Jean Weiss e Luiza Pedralli · UEQ © Laugwitz, Held e Schrepp ·{" "}
            <Link href="/privacidade">Política de privacidade</Link>
          </p>
        </div>
      </footer>
    </>
  );
}
