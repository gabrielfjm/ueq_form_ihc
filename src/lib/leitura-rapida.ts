import type { FaixaInterpretacao } from "@/ueq";
import { formatarDecimal, juntarComE } from "./texto";

// Textos da "Leitura rápida" (protótipos r6 e r7): descrevem as faixas que o módulo src/ueq já calculou,
// para o pesquisador não precisar lembrar os limiares (Nielsen 6). Nenhuma conta estatística aqui
type EscalaLida = { nome: string; media: number | null; faixaInterpretacao: FaixaInterpretacao | null };

const POR_EXTENSO = ["nenhuma", "uma", "duas", "três", "quatro", "cinco", "seis"];

function ficam(nomes: string[], faixa: string): string {
  return `${juntarComE(nomes)} ${nomes.length === 1 ? "fica" : "ficam"} na faixa ${faixa}`;
}

export function leituraDeUmaVersao(escalas: readonly EscalaLida[]): string | null {
  const comMedia = escalas.filter((escala): escala is EscalaLida & { media: number } => escala.media !== null);
  if (comMedia.length === 0) return null;

  const positivas = comMedia.filter((escala) => escala.faixaInterpretacao === "positiva");
  const neutras = comMedia.filter((escala) => escala.faixaInterpretacao === "neutra").map((escala) => escala.nome);
  const negativas = comMedia.filter((escala) => escala.faixaInterpretacao === "negativa").map((escala) => escala.nome);
  const maisForte = comMedia.reduce((melhor, escala) => (escala.media > melhor.media ? escala : melhor));

  const abertura =
    positivas.length === comMedia.length
      ? `A experiência foi avaliada como positiva nas ${POR_EXTENSO[comMedia.length]} escalas.`
      : positivas.length === 0
        ? "Nenhuma escala ficou na faixa positiva."
        : `A experiência foi avaliada como positiva em ${POR_EXTENSO[positivas.length]} das ${POR_EXTENSO[comMedia.length]} escalas.`;

  const detalhes = [
    positivas.length > 0 ? `${maisForte.nome} é o ponto mais forte` : null,
    neutras.length > 0 ? ficam(neutras, "neutra") : null,
    negativas.length > 0 ? ficam(negativas, "negativa") : null,
  ].filter((parte) => parte !== null);

  if (detalhes.length === 0) return abertura;
  const frase = detalhes.join("; ");
  return `${abertura} ${frase.charAt(0).toUpperCase()}${frase.slice(1)}.`;
}

type VersaoComparada = { nome: string; medias: readonly (number | null)[] };

// Abaixo disso a diferença entre médias é pequena demais para chamar atenção na leitura rápida;
// não é um teste estatístico, que a ferramenta não faz (prompts/06-painel-resultados.md, item 7)
const DIFERENCA_DE_DESTAQUE = 0.3;

export function leituraDaComparacao(nomesEscalas: readonly string[], versoes: readonly VersaoComparada[]): string | null {
  if (versoes.length < 2) return null;

  if (versoes.length === 2) {
    const [a, b] = versoes as [VersaoComparada, VersaoComparada];
    const diferencas = nomesEscalas
      .map((nome, posicao) => {
        const mediaA = a.medias[posicao];
        const mediaB = b.medias[posicao];
        return mediaA === null || mediaA === undefined || mediaB === null || mediaB === undefined
          ? null
          : { nome, diferenca: mediaA - mediaB };
      })
      .filter((linha) => linha !== null)
      .sort((x, y) => Math.abs(y.diferenca) - Math.abs(x.diferenca));
    const destaques = diferencas.filter((linha) => Math.abs(linha.diferenca) >= DIFERENCA_DE_DESTAQUE).slice(0, 2);
    if (destaques.length === 0) {
      return `As versões ficam próximas em todas as escalas: nenhuma diferença chega a ${formatarDecimal(DIFERENCA_DE_DESTAQUE)}.`;
    }
    const partes = destaques.map(
      (linha) => `${linha.nome} (${formatarDecimal(Math.abs(linha.diferenca))} a favor de ${linha.diferenca > 0 ? a.nome : b.nome})`,
    );
    const restantes = diferencas.length - destaques.length;
    return `${destaques.length === 1 ? "A maior diferença está em" : "As maiores diferenças estão em"} ${juntarComE(partes)}.${
      restantes > 0 ? " Nas outras escalas as versões ficam próximas." : ""
    }`;
  }

  // Com três ou mais versões, diz quem tem a maior média em quantas escalas
  const vitorias = versoes.map(() => 0);
  nomesEscalas.forEach((_, posicao) => {
    let melhor = -1;
    versoes.forEach((versao, indice) => {
      const media = versao.medias[posicao];
      const atual = melhor >= 0 ? versoes[melhor]?.medias[posicao] : null;
      if (media !== null && media !== undefined && (atual === null || atual === undefined || media > atual)) melhor = indice;
    });
    if (melhor >= 0) vitorias[melhor] = (vitorias[melhor] ?? 0) + 1;
  });
  const partes = versoes
    .map((versao, indice) => ({ nome: versao.nome, quantas: vitorias[indice] ?? 0 }))
    .filter((parte) => parte.quantas > 0)
    .sort((x, y) => y.quantas - x.quantas)
    .map((parte) => `${parte.nome} em ${POR_EXTENSO[parte.quantas] ?? parte.quantas}`);
  return `A maior média por escala fica com ${juntarComE(partes)}.`;
}
