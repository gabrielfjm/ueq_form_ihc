import dados from "../../data/ueq-idiomas.json";
import instrucoes from "../../data/ueq-instrucoes.json";
import type { TextosParticipante } from "./tipos";
import { ar } from "./textos/ar";
import { bg } from "./textos/bg";
import { bn } from "./textos/bn";
import { bs } from "./textos/bs";
import { cs } from "./textos/cs";
import { da } from "./textos/da";
import { de } from "./textos/de";
import { el } from "./textos/el";
import { en } from "./textos/en";
import { es } from "./textos/es";
import { et } from "./textos/et";
import { fa } from "./textos/fa";
import { fi } from "./textos/fi";
import { fr } from "./textos/fr";
import { he } from "./textos/he";
import { hi } from "./textos/hi";
import { hr } from "./textos/hr";
import { hu } from "./textos/hu";
import { id } from "./textos/id";
import { it } from "./textos/it";
import { ja } from "./textos/ja";
import { kn } from "./textos/kn";
import { ko } from "./textos/ko";
import { mr } from "./textos/mr";
import { ms } from "./textos/ms";
import { nb } from "./textos/nb";
import { nl } from "./textos/nl";
import { pl } from "./textos/pl";
import { pt } from "./textos/pt";
import { ru } from "./textos/ru";
import { sk } from "./textos/sk";
import { sl } from "./textos/sl";
import { sv } from "./textos/sv";
import { ta } from "./textos/ta";
import { th } from "./textos/th";
import { tr } from "./textos/tr";
import { zh } from "./textos/zh";

export type { Plural, TextosParticipante } from "./tipos";

// Os 37 idiomas do pacote oficial do UEQ. O tipo obriga cada um a ter todos os textos das telas
const TEXTOS = {
  pt, en, es, de, fr, it, nl, da, sv, nb, fi, et, pl, cs, sk, sl, hr, bs, hu,
  bg, ru, el, tr, ar, he, fa, hi, mr, bn, ta, kn, th, ms, id, zh, ja, ko,
} satisfies Record<string, TextosParticipante>;

export type CodigoIdioma = keyof typeof TEXTOS;

export const IDIOMA_PADRAO: CodigoIdioma = "pt";

export type Termos = { numero: number; termoEsquerdo: string; termoDireito: string };

export type InfoIdioma = {
  codigo: CodigoIdioma;
  // Endônimo, como aparece no seletor: "Deutsch", "العربية"
  nome: string;
  nomeEmPortugues: string;
  // Valor de <html lang>. A interface em português é pt-BR; os termos do UEQ são de Portugal
  lang: string;
  direcao: "ltr" | "rtl";
  traducaoAprovada: boolean;
};

const LANG: Partial<Record<CodigoIdioma, string>> = { pt: "pt-BR", zh: "zh-Hans" };

export function ehIdioma(codigo: unknown): codigo is CodigoIdioma {
  return typeof codigo === "string" && Object.hasOwn(TEXTOS, codigo);
}

const porCodigo = new Map(
  dados.idiomas.map((idioma) => {
    if (!ehIdioma(idioma.codigo)) throw new Error(`data/ueq-idiomas.json: idioma sem textos (${idioma.codigo})`);
    const info: InfoIdioma = {
      codigo: idioma.codigo,
      nome: idioma.nome,
      nomeEmPortugues: idioma.nomeEmPortugues,
      lang: LANG[idioma.codigo] ?? idioma.codigo,
      direcao: idioma.direcao === "rtl" ? "rtl" : "ltr",
      traducaoAprovada: idioma.traducaoAprovada,
    };
    return [idioma.codigo, { info, termos: idioma.itens as Termos[] }] as const;
  }),
);

// Em ordem alfabética do endônimo, para o seletor; o português vem do dado, como os outros
export const IDIOMAS: InfoIdioma[] = [...porCodigo.values()]
  .map(({ info }) => info)
  .sort((a, b) => a.nome.localeCompare(b.nome, "en"));

export function infoIdioma(codigo: CodigoIdioma): InfoIdioma {
  return porCodigo.get(codigo)!.info;
}

export function textosDoIdioma(codigo: CodigoIdioma): TextosParticipante {
  return TEXTOS[codigo];
}

// Os 26 pares na ordem oficial, com a polaridade do original (data/ueq-idiomas.json)
export function termosDoIdioma(codigo: CodigoIdioma): Termos[] {
  return porCodigo.get(codigo)!.termos;
}

export function instrucaoDoIdioma(codigo: CodigoIdioma): { titulo: string; paragrafos: string[] } {
  return instrucoes.idiomas[codigo];
}

// Códigos antigos ou de outra variante que o navegador ainda manda
const SINONIMOS: Record<string, CodigoIdioma> = { no: "nb", nn: "nb", iw: "he", in: "id" };

// Accept-Language "es-MX,es;q=0.9,en;q=0.8" → "es". Sem nenhum dos 37, fica o português
export function negociarIdioma(acceptLanguage: string | null | undefined): CodigoIdioma {
  const pedidos = (acceptLanguage ?? "")
    .split(",")
    .map((parte, posicao) => {
      const [tag = "", ...parametros] = parte.trim().split(";");
      const q = parametros.map((p) => p.trim()).find((p) => p.startsWith("q="));
      return { tag: tag.trim().toLowerCase(), q: q ? Number(q.slice(2)) : 1, posicao };
    })
    .filter((pedido) => pedido.tag && pedido.tag !== "*" && pedido.q > 0)
    .sort((a, b) => b.q - a.q || a.posicao - b.posicao);
  for (const { tag } of pedidos) {
    const principal = tag.split("-")[0] ?? "";
    const codigo = SINONIMOS[principal] ?? principal;
    if (ehIdioma(codigo)) return codigo;
  }
  return IDIOMA_PADRAO;
}
