import type { FaixaInterpretacao } from "@/ueq";
import { m, type Traduzir } from "@/traducao/nucleo";
import { formatarDecimal, juntarComE } from "./texto";

// Textos da "Leitura rápida" (protótipos r6 e r7): descrevem as faixas que o módulo src/ueq já calculou,
// para o pesquisador não precisar lembrar os limiares (Nielsen 6). Nenhuma conta estatística aqui
type EscalaLida = { nome: string; media: number | null; faixaInterpretacao: FaixaInterpretacao | null };

const POR_EXTENSO = [m("nenhuma"), m("uma"), m("duas"), m("três"), m("quatro"), m("cinco"), m("seis")];

const extenso = (t: Traduzir, quantidade: number) => {
  const palavra = POR_EXTENSO[quantidade];
  return palavra ? t(palavra) : String(quantidade);
};

function ficam(t: Traduzir, nomes: string[], faixa: "neutra" | "negativa"): string {
  const lista = juntarComE(nomes, t.lang);
  if (faixa === "neutra") {
    return nomes.length === 1 ? t("{nomes} fica na faixa neutra", { nomes: lista }) : t("{nomes} ficam na faixa neutra", { nomes: lista });
  }
  return nomes.length === 1 ? t("{nomes} fica na faixa negativa", { nomes: lista }) : t("{nomes} ficam na faixa negativa", { nomes: lista });
}

export function leituraDeUmaVersao(t: Traduzir, escalas: readonly EscalaLida[]): string | null {
  const comMedia = escalas.filter((escala): escala is EscalaLida & { media: number } => escala.media !== null);
  if (comMedia.length === 0) return null;

  const positivas = comMedia.filter((escala) => escala.faixaInterpretacao === "positiva");
  const neutras = comMedia.filter((escala) => escala.faixaInterpretacao === "neutra").map((escala) => escala.nome);
  const negativas = comMedia.filter((escala) => escala.faixaInterpretacao === "negativa").map((escala) => escala.nome);
  const maisForte = comMedia.reduce((melhor, escala) => (escala.media > melhor.media ? escala : melhor));

  const abertura =
    positivas.length === comMedia.length
      ? t("A experiência foi avaliada como positiva nas {total} escalas.", { total: extenso(t, comMedia.length) })
      : positivas.length === 0
        ? t("Nenhuma escala ficou na faixa positiva.")
        : t("A experiência foi avaliada como positiva em {positivas} das {total} escalas.", {
            positivas: extenso(t, positivas.length),
            total: extenso(t, comMedia.length),
          });

  const detalhes = [
    positivas.length > 0 ? t("{nome} é o ponto mais forte", { nome: maisForte.nome }) : null,
    neutras.length > 0 ? ficam(t, neutras, "neutra") : null,
    negativas.length > 0 ? ficam(t, negativas, "negativa") : null,
  ].filter((parte) => parte !== null);

  if (detalhes.length === 0) return abertura;
  const frase = detalhes.join("; ");
  return `${abertura} ${frase.charAt(0).toUpperCase()}${frase.slice(1)}.`;
}

type VersaoComparada = { nome: string; medias: readonly (number | null)[] };

// Abaixo disso a diferença entre médias é pequena demais para chamar atenção na leitura rápida;
// não é um teste estatístico, que a ferramenta não faz (prompts/06-painel-resultados.md, item 7)
const DIFERENCA_DE_DESTAQUE = 0.3;

export function leituraDaComparacao(t: Traduzir, nomesEscalas: readonly string[], versoes: readonly VersaoComparada[]): string | null {
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
      return t("As versões ficam próximas em todas as escalas: nenhuma diferença chega a {limite}.", {
        limite: formatarDecimal(DIFERENCA_DE_DESTAQUE),
      });
    }
    const partes = juntarComE(
      destaques.map((linha) =>
        t("{escala} ({diferenca} a favor de {versao})", {
          escala: linha.nome,
          diferenca: formatarDecimal(Math.abs(linha.diferenca)),
          versao: linha.diferenca > 0 ? a.nome : b.nome,
        }),
      ),
      t.lang,
    );
    const restantes = diferencas.length - destaques.length;
    const frase =
      destaques.length === 1 ? t("A maior diferença está em {partes}.", { partes }) : t("As maiores diferenças estão em {partes}.", { partes });
    return restantes > 0 ? `${frase} ${t("Nas outras escalas as versões ficam próximas.")}` : frase;
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
    .map((parte) => t("{versao} em {quantas}", { versao: parte.nome, quantas: extenso(t, parte.quantas) }));
  return t("A maior média por escala fica com {partes}.", { partes: juntarComE(partes, t.lang) });
}
