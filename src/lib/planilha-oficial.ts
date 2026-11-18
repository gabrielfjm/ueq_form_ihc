import { deflateSync, strFromU8, strToU8, unzipSync } from "fflate";
import type { CodigoIdioma } from "@/idiomas";

// docs/ueq-protocolo.md, seção 9.4: a exportação é a própria planilha oficial de análise (data/planilha-oficial/),
// com as respostas em Data!A4 e o idioma na aba Read_First. Tudo o que a planilha calcula continua nas fórmulas
// dela: aqui só se escrevem os dados de entrada, como quem cola as respostas à mão

export type ModeloPlanilha = {
  arquivo: string;
  // quantos valores por participante (colunas A em diante da aba Data)
  colunas: number;
  // onde a aba Read_First guarda o idioma
  celulaIdioma: string;
};

// UEQ Data Analysis Tool V15: os 26 itens em Data!A4:Z, o idioma em Read_First!B5
export const PLANILHA_UEQ: ModeloPlanilha = {
  arquivo: "data/planilha-oficial/UEQ_Data_Analysis_Tool_V15.xlsx",
  colunas: 26,
  celulaIdioma: "B5",
};

// UEQ-S Data Analysis Tool V15: os 8 itens do UEQ-S em Data!A4:H, o idioma em Read_First!B4
export const PLANILHA_UEQ_S: ModeloPlanilha = {
  arquivo: "data/planilha-oficial/Short_UEQ_Data_Analysis_Tool_V15.xlsx",
  colunas: 8,
  celulaIdioma: "B4",
};

export const ARQUIVO_MODELO = PLANILHA_UEQ.arquivo;

// O aviso da aba Data diz até 1000 participantes; mais que isso pede ajustar as fórmulas da planilha
export const MAXIMO_PARTICIPANTES = 1000;

// Nome do idioma na lista da aba Items (a mesma nas duas planilhas), que é o que a aba Read_First aceita
export const IDIOMA_NA_PLANILHA: Record<CodigoIdioma, string> = {
  pt: "Portuguese", en: "English", es: "Spanish", de: "German", fr: "French", it: "Italian", nl: "Dutch",
  da: "Danish", sv: "Swedish", nb: "Norwegian", fi: "Finnish", et: "Estonian", pl: "Polish", cs: "Czech",
  sk: "Slovak", sl: "Slovene", hr: "Croatian", bs: "Bosnian", hu: "Hungarian", bg: "Bulgarian", ru: "Russian",
  el: "Greek", tr: "Turkish", ar: "Arabic", he: "Hebrew", fa: "Persian", hi: "Hindi", mr: "Marathi",
  bn: "Bengali", ta: "Tamil", kn: "Kannada", th: "Thai", ms: "Malay", id: "Indonesian", zh: "Chinese",
  ja: "Japanese", ko: "Korean",
};

const PRIMEIRA_LINHA_DE_DADOS = 4;
const COLUNAS = Array.from({ length: 26 }, (_, posicao) => String.fromCharCode(65 + posicao));
const TEXTOS_COMPARTILHADOS = "xl/sharedStrings.xml";

function escaparXml(texto: string): string {
  return texto.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function ler(arquivos: Record<string, Uint8Array>, caminho: string): string {
  const conteudo = arquivos[caminho];
  if (!conteudo) throw new Error(`Modelo da planilha oficial sem ${caminho}`);
  return strFromU8(conteudo);
}

// workbook.xml dá o r:id de cada aba; o .rels diz em que arquivo ela está
function arquivoDaAba(arquivos: Record<string, Uint8Array>, nome: string): string {
  const livro = ler(arquivos, "xl/workbook.xml");
  const aba = new RegExp(`<sheet [^>]*name="${nome}"[^>]*r:id="([^"]+)"`).exec(livro);
  if (!aba) throw new Error(`Modelo da planilha oficial sem a aba ${nome}`);
  const relacoes = ler(arquivos, "xl/_rels/workbook.xml.rels");
  const alvo = new RegExp(`<Relationship [^>]*Id="${aba[1]}"[^>]*Target="([^"]+)"`).exec(relacoes)
    ?? new RegExp(`<Relationship [^>]*Target="([^"]+)"[^>]*Id="${aba[1]}"`).exec(relacoes);
  if (!alvo) throw new Error(`Modelo da planilha oficial sem o arquivo da aba ${nome}`);
  return `xl/${alvo[1]!.replace(/^\/?xl\//, "")}`;
}

// Troca as linhas de exemplo (da 4 para baixo) pelas respostas; as linhas 1 a 3 (aviso e números dos itens) ficam
function escreverDados(xml: string, linhas: readonly (readonly number[])[], colunas: number): string {
  const estilo = /<c r="A5" s="(\d+)"/.exec(xml)?.[1];
  const atributoEstilo = estilo ? ` s="${estilo}"` : "";
  const cabecalho = [...xml.matchAll(/<row r="(\d+)"[^>]*>.*?<\/row>/gs)]
    .filter((linha) => Number(linha[1]) < PRIMEIRA_LINHA_DE_DADOS)
    .map((linha) => linha[0])
    .join("");
  const dados = linhas
    .map((valores, posicao) => {
      const numero = PRIMEIRA_LINHA_DE_DADOS + posicao;
      const celulas = valores.map((valor, coluna) => `<c r="${COLUNAS[coluna]}${numero}"${atributoEstilo}><v>${valor}</v></c>`);
      return `<row r="${numero}" spans="1:${colunas}">${celulas.join("")}</row>`;
    })
    .join("");
  const ultima = linhas.length > 0 ? PRIMEIRA_LINHA_DE_DADOS + linhas.length - 1 : PRIMEIRA_LINHA_DE_DADOS - 1;
  return xml
    .replace(/<sheetData>.*<\/sheetData>/s, `<sheetData>${cabecalho}${dados}</sheetData>`)
    .replace(/<dimension ref="[^"]*"\/>/, `<dimension ref="A1:${COLUNAS[colunas - 1]}${ultima}"/>`)
    // A seleção do modelo aponta para uma célula de exemplo; volta para o início dos dados
    .replace(/<selection [^>]*\/>/, `<selection activeCell="A${PRIMEIRA_LINHA_DE_DADOS}" sqref="A${PRIMEIRA_LINHA_DE_DADOS}"/>`);
}

// A aba Read_First guarda o idioma como índice de um texto compartilhado
function escreverIdioma(xml: string, indice: number, endereco: string): string {
  const celula = new RegExp(`<c r="${endereco}"([^>]*?)(\/>|>.*?<\/c>)`, "s").exec(xml);
  if (!celula) throw new Error(`Modelo da planilha oficial sem a célula Read_First!${endereco}`);
  const atributos = celula[1]!.replace(/\s+t="[^"]*"/, "");
  return xml.replace(celula[0], `<c r="${endereco}"${atributos} t="s"><v>${indice}</v></c>`);
}

// Os resultados que vêm gravados no modelo são os dos dados de exemplo. Sem eles, quem abre a planilha não vê
// número errado antes do recálculo; com fullCalcOnLoad, o Excel recalcula tudo ao abrir
function apagarResultadosGravados(xml: string): string {
  return xml.replace(
    /<c ([^>]*?)>(<f[^>]*\/>|<f[^>]*>[^<]*<\/f>)<v>[^<]*<\/v><\/c>/g,
    (_, atributos: string, formula: string) => `<c ${atributos.replace(/\s+t="[^"]*"/, "")}>${formula}</c>`,
  );
}

// ---------- ZIP ----------
// O .xlsx é um ZIP. Só a aba Data e a Read_First mudam de uma exportação para outra; o resto (uns 10 MB de XML)
// é comprimido uma vez por servidor e reaproveitado, porque comprimir tudo a cada download levava quase 2 s

type Entrada = { nome: Uint8Array; comprimido: Uint8Array; crc: number; tamanho: number; metodo: 0 | 8 };

const TABELA_CRC = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(dados: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < dados.length; i++) crc = TABELA_CRC[(crc ^ dados[i]!) & 0xff]! ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function comprimir(nome: string, conteudo: Uint8Array): Entrada {
  // Imagens já vêm comprimidas: vão guardadas como estão
  const guardar = /\.(png|jpe?g|gif)$/i.test(nome);
  return {
    nome: strToU8(nome),
    comprimido: guardar ? conteudo : deflateSync(conteudo, { level: 6 }),
    crc: crc32(conteudo),
    tamanho: conteudo.length,
    metodo: guardar ? 0 : 8,
  };
}

// 01/01/1980 00:00 no formato de data do DOS, o menor válido
const DATA_DOS = (1 << 5) | 1;

function montarZip(entradas: readonly Entrada[]): Uint8Array {
  const partes: Uint8Array[] = [];
  const central: Uint8Array[] = [];
  let deslocamento = 0;
  for (const entrada of entradas) {
    const local = new Uint8Array(30 + entrada.nome.length);
    const l = new DataView(local.buffer);
    l.setUint32(0, 0x04034b50, true);
    l.setUint16(4, 20, true);
    l.setUint16(8, entrada.metodo, true);
    l.setUint16(12, DATA_DOS, true);
    l.setUint32(14, entrada.crc, true);
    l.setUint32(18, entrada.comprimido.length, true);
    l.setUint32(22, entrada.tamanho, true);
    l.setUint16(26, entrada.nome.length, true);
    local.set(entrada.nome, 30);

    const registro = new Uint8Array(46 + entrada.nome.length);
    const c = new DataView(registro.buffer);
    c.setUint32(0, 0x02014b50, true);
    c.setUint16(4, 20, true);
    c.setUint16(6, 20, true);
    c.setUint16(10, entrada.metodo, true);
    c.setUint16(14, DATA_DOS, true);
    c.setUint32(16, entrada.crc, true);
    c.setUint32(20, entrada.comprimido.length, true);
    c.setUint32(24, entrada.tamanho, true);
    c.setUint16(28, entrada.nome.length, true);
    c.setUint32(42, deslocamento, true);
    registro.set(entrada.nome, 46);

    partes.push(local, entrada.comprimido);
    central.push(registro);
    deslocamento += local.length + entrada.comprimido.length;
  }
  const tamanhoCentral = central.reduce((soma, registro) => soma + registro.length, 0);
  const fim = new Uint8Array(22);
  const f = new DataView(fim.buffer);
  f.setUint32(0, 0x06054b50, true);
  f.setUint16(8, entradas.length, true);
  f.setUint16(10, entradas.length, true);
  f.setUint32(12, tamanhoCentral, true);
  f.setUint32(16, deslocamento, true);

  const saida = new Uint8Array(deslocamento + tamanhoCentral + fim.length);
  let posicao = 0;
  for (const parte of [...partes, ...central, fim]) {
    saida.set(parte, posicao);
    posicao += parte.length;
  }
  return saida;
}

// ---------- modelo preparado ----------

type ModeloPreparado = {
  ordem: string[];
  prontas: Map<string, Entrada>;
  abaDados: string;
  xmlDados: string;
  abaLeitura: string;
  xmlLeitura: string;
  xmlTextos: string;
  // "<t>Portuguese</t>" → índice do texto compartilhado
  indiceDoTexto: Map<string, number>;
};

const preparados = new WeakMap<Uint8Array, ModeloPreparado>();

function preparar(modelo: Uint8Array): ModeloPreparado {
  const pronto = preparados.get(modelo);
  if (pronto) return pronto;

  const arquivos = unzipSync(modelo);
  const abaDados = arquivoDaAba(arquivos, "Data");
  const abaLeitura = arquivoDaAba(arquivos, "Read_First");
  for (const caminho of Object.keys(arquivos)) {
    if (/^xl\/worksheets\/sheet\d+\.xml$/.test(caminho) && caminho !== abaDados) {
      arquivos[caminho] = strToU8(apagarResultadosGravados(ler(arquivos, caminho)));
    }
  }
  const livro = ler(arquivos, "xl/workbook.xml").replace(/<calcPr([^>]*?)\s*\/>/, (_, atributos: string) =>
    `<calcPr${atributos.replace(/\s+fullCalcOnLoad="[^"]*"/, "")} fullCalcOnLoad="1"/>`,
  );
  arquivos["xl/workbook.xml"] = strToU8(livro);

  const xmlTextos = ler(arquivos, TEXTOS_COMPARTILHADOS);
  const indiceDoTexto = new Map([...xmlTextos.matchAll(/<si>(.*?)<\/si>/gs)].map((si, indice) => [si[1]!, indice]));
  const prontas = new Map<string, Entrada>();
  for (const [caminho, conteudo] of Object.entries(arquivos)) {
    if (caminho !== abaDados && caminho !== abaLeitura) prontas.set(caminho, comprimir(caminho, conteudo));
  }
  const preparado: ModeloPreparado = {
    ordem: Object.keys(arquivos),
    prontas,
    abaDados,
    xmlDados: ler(arquivos, abaDados),
    abaLeitura,
    xmlLeitura: ler(arquivos, abaLeitura),
    xmlTextos,
    indiceDoTexto,
  };
  preparados.set(modelo, preparado);
  return preparado;
}

export function preencherPlanilhaOficial(
  modelo: Uint8Array,
  linhas: readonly (readonly number[])[],
  idioma: CodigoIdioma,
  formato: ModeloPlanilha = PLANILHA_UEQ,
): Uint8Array {
  if (linhas.length > MAXIMO_PARTICIPANTES) {
    throw new Error(`A planilha oficial calcula até ${MAXIMO_PARTICIPANTES} participantes; o estudo tem ${linhas.length}.`);
  }
  for (const valores of linhas) {
    if (valores.length !== formato.colunas || valores.some((valor) => !Number.isInteger(valor) || valor < 1 || valor > 7)) {
      throw new Error(`Cada participante precisa de ${formato.colunas} valores inteiros de 1 a 7.`);
    }
  }

  const modeloPreparado = preparar(modelo);
  const nome = escaparXml(IDIOMA_NA_PLANILHA[idioma]);
  let indice = modeloPreparado.indiceDoTexto.get(`<t>${nome}</t>`);
  let textos: Entrada | undefined;
  if (indice === undefined) {
    // Idioma que a lista da planilha não tem: entra como texto novo no fim
    indice = modeloPreparado.indiceDoTexto.size;
    const xml = modeloPreparado.xmlTextos
      .replace("</sst>", `<si><t>${nome}</t></si></sst>`)
      .replace(/uniqueCount="(\d+)"/, (_, n: string) => `uniqueCount="${Number(n) + 1}"`);
    textos = comprimir(TEXTOS_COMPARTILHADOS, strToU8(xml));
  }
  const dados = comprimir(modeloPreparado.abaDados, strToU8(escreverDados(modeloPreparado.xmlDados, linhas, formato.colunas)));
  const leitura = comprimir(modeloPreparado.abaLeitura, strToU8(escreverIdioma(modeloPreparado.xmlLeitura, indice, formato.celulaIdioma)));

  return montarZip(
    modeloPreparado.ordem.map((caminho) => {
      if (caminho === modeloPreparado.abaDados) return dados;
      if (caminho === modeloPreparado.abaLeitura) return leitura;
      if (caminho === TEXTOS_COMPARTILHADOS && textos) return textos;
      return modeloPreparado.prontas.get(caminho)!;
    }),
  );
}
