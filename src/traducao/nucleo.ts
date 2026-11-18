// Tradução da interface do pesquisador. Os textos ficam escritos em português no código, dentro de
// t("…") (na hora de mostrar) ou m("…") (em constantes, traduzidas depois com t(valor)); o catálogo
// (catalogo.json) junta todos e a API do Claude traduz para os outros 36 idiomas do UEQ, guardando
// cada tradução na tabela traducao pela chave do texto de origem. Sem tradução, o texto sai em português

export type Valores = Record<string, string | number>;
// idioma: código do UEQ ("de"); lang: a etiqueta BCP 47 para Intl e <html lang> ("de", "pt-BR")
export type Traduzir = ((texto: string, valores?: Valores) => string) & { idioma: string; lang: string };
export type Dicionario = Record<string, string>;

// O que um seletor de idioma precisa, sem carregar os textos do participante no navegador
export type OpcaoIdioma = { codigo: string; nome: string; lang: string; direcao: "ltr" | "rtl" };

// cyrb53: hash curto e síncrono, o mesmo no servidor e no navegador (o dicionário do cliente usa a chave)
function cyrb53(texto: string): string {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < texto.length; i++) {
    const c = texto.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 2654435761);
    h2 = Math.imul(h2 ^ c, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (h2 >>> 0).toString(16).padStart(8, "0") + (h1 >>> 0).toString(16).padStart(8, "0");
}

// A chave inclui o idioma de origem quando não é o português (títulos de estudos escritos em outra língua)
export function chaveDoTexto(texto: string, origem = "pt"): string {
  return cyrb53(origem === "pt" ? texto : `${origem}\u0000${texto}`);
}

// Marca um texto de constante para o catálogo, sem traduzir: quem mostra usa t(valor)
export function m<T extends string>(texto: T): T {
  return texto;
}

// A tradução tem de ter exatamente os mesmos {marcadores} do original: senão, a tela mostraria a chave crua
export function mesmosMarcadores(original: string, traducao: string): boolean {
  const marcadores = (texto: string) => [...texto.matchAll(/\{\w+\}/g)].map(([nome]) => nome).sort().join();
  return marcadores(original) === marcadores(traducao);
}

export function interpolar(texto: string, valores?: Valores): string {
  if (!valores) return texto;
  return texto.replace(/\{(\w+)\}/g, (inteiro, nome: string) => (nome in valores ? String(valores[nome]) : inteiro));
}

// O nome da ferramenta em cada idioma. As traduções guardam "Ferramenta UEQ" como está (a API recebe o nome
// protegido por um marcador, src/traducao/claude.ts); a troca é feita aqui, na saída de t()
const NOME_ORIGINAL = "Ferramenta UEQ";
export const NOME_DA_FERRAMENTA: Record<string, string> = {
  pt: NOME_ORIGINAL, en: "UEQ Tool", es: "Herramienta UEQ", de: "UEQ-Tool", fr: "Outil UEQ", it: "Strumento UEQ",
  nl: "UEQ-tool", da: "UEQ-værktøj", sv: "UEQ-verktyg", nb: "UEQ-verktøy", fi: "UEQ-työkalu", et: "UEQ tööriist",
  pl: "Narzędzie UEQ", cs: "Nástroj UEQ", sk: "Nástroj UEQ", sl: "Orodje UEQ", hr: "Alat UEQ", bs: "Alat UEQ",
  hu: "UEQ-eszköz", bg: "Инструмент UEQ", ru: "Инструмент UEQ", el: "Εργαλείο UEQ", tr: "UEQ Aracı", ar: "أداة UEQ",
  he: "כלי UEQ", fa: "ابزار UEQ", hi: "UEQ टूल", mr: "UEQ साधन", bn: "UEQ টুল", ta: "UEQ கருவி", kn: "UEQ ಸಾಧನ",
  th: "เครื่องมือ UEQ", ms: "Alat UEQ", id: "Alat UEQ", zh: "UEQ 工具", ja: "UEQ ツール", ko: "UEQ 도구",
};

export const nomeDaFerramenta = (idioma: string) => NOME_DA_FERRAMENTA[idioma] ?? NOME_ORIGINAL;

export function criarTradutor(idioma: string, dicionario: Dicionario, lang = idioma === "pt" ? "pt-BR" : idioma): Traduzir {
  const nome = nomeDaFerramenta(idioma);
  const traduzir = (texto: string, valores?: Valores) => {
    const traducao = dicionario[chaveDoTexto(texto)];
    const saida = interpolar(traducao ?? texto, valores);
    // Só troca o nome em texto que saiu traduzido (ou no próprio nome): frase que ainda está em português fica inteira
    return nome !== NOME_ORIGINAL && (traducao !== undefined || texto === NOME_ORIGINAL) ? saida.replaceAll(NOME_ORIGINAL, nome) : saida;
  };
  return Object.assign(traduzir, { idioma, lang });
}


// Nome de um idioma no idioma da interface ("alemão", "German", "Deutsch"), pelo Intl do navegador/servidor
export function nomeDoIdiomaEm(lang: string, interfaceLang: string): string | undefined {
  try {
    return new Intl.DisplayNames([interfaceLang], { type: "language" }).of(lang);
  } catch {
    return undefined;
  }
}
