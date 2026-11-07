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

export function criarTradutor(idioma: string, dicionario: Dicionario, lang = idioma === "pt" ? "pt-BR" : idioma): Traduzir {
  const traduzir = (texto: string, valores?: Valores) => interpolar(dicionario[chaveDoTexto(texto)] ?? texto, valores);
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
