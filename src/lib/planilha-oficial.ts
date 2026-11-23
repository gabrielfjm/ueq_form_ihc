import { deflateRawSync } from "node:zlib";
import { strFromU8, strToU8, unzipSync } from "fflate";
import type { CodigoIdioma } from "@/idiomas";
import { Calculo, chave, colunaParaNumero, ehErro, formatarNumero, lerFormula, type Aba, type Formula, type Valor } from "./planilha-calculo";

// docs/ueq-protocolo.md, seção 9.4: a exportação é a própria planilha oficial de análise (data/planilha-oficial/),
// com as respostas em Data!A4 e o idioma na aba Read_First. As fórmulas continuam as da planilha. A ferramenta
// também as calcula (planilha-calculo.ts) e grava os resultados, como o Excel faz ao salvar: assim o arquivo
// baixado já mostra tudo no Modo de Exibição Protegido, no LibreOffice e nas pré-visualizações, que não recalculam

export type ModeloPlanilha = {
  arquivo: string;
  // quantos valores por participante (colunas A em diante da aba Data)
  colunas: number;
  // onde a aba Read_First guarda o idioma
  celulaIdioma: string;
  // entradas de exemplo que a ferramenta não coleta e que, mantidas, misturariam dados fictícios aos do estudo
  entradasSemDados?: readonly { aba: string; colunas: string; aPartirDaLinha: number }[];
};

// UEQ Data Analysis Tool V15: os 26 itens em Data!A4:Z, o idioma em Read_First!B5. A aba KPI_Calculation pede
// a importância de cada escala (extensão KPI do UEQ), que a ferramenta não pergunta: as notas do exemplo saem
export const PLANILHA_UEQ: ModeloPlanilha = {
  arquivo: "data/planilha-oficial/UEQ_Data_Analysis_Tool_V15.xlsx",
  colunas: 26,
  celulaIdioma: "B5",
  entradasSemDados: [{ aba: "KPI_Calculation", colunas: "A:F", aPartirDaLinha: 4 }],
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

function desescaparXml(texto: string): string {
  return texto.replace(/&(lt|gt|quot|apos|amp|#x[0-9a-f]+|#\d+);/gi, (_, e: string) => {
    if (e === "lt") return "<";
    if (e === "gt") return ">";
    if (e === "quot") return '"';
    if (e === "apos") return "'";
    if (e === "amp") return "&";
    return String.fromCodePoint(e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : Number(e.slice(1)));
  });
}

// ---------- leitura do modelo ----------

const RE_CELULA = /<c r="([A-Z]+)(\d+)"([^>]*?)(?:\/>|>(.*?)<\/c>)/gs;

// Texto de um <si> dos textos compartilhados: junta os trechos <t> (texto com formatação vem em vários)
function textoDoSi(si: string): string {
  return desescaparXml([...si.replace(/<rPh\b.*?<\/rPh>/gs, "").matchAll(/<t(?:\s[^>]*)?>(.*?)<\/t>/gs)].map((t) => t[1]).join(""));
}

function constanteDaCelula(atributos: string, corpo: string, textos: readonly string[]): Valor {
  const tipo = /\st="([^"]*)"/.exec(atributos)?.[1];
  if (tipo === "inlineStr") return textoDoSi(/<is>(.*?)<\/is>/s.exec(corpo)?.[1] ?? "");
  const v = /<v>([^<]*)<\/v>/.exec(corpo)?.[1];
  if (v === undefined) return null;
  if (tipo === "s") return textos[Number(v)] ?? "";
  if (tipo === "str") return desescaparXml(v);
  if (tipo === "b") return v === "1";
  if (tipo === "e") return { erro: v as "#N/A" };
  return Number(v);
}

// Constantes e fórmulas de uma aba. Nas fórmulas compartilhadas, só a primeira célula traz o texto; as outras
// usam a mesma árvore deslocada (dl, dc), como o Excel
function lerAba(nome: string, xml: string, textos: readonly string[]): Aba {
  const constantes = new Map<number, Valor>();
  const formulas = new Map<number, Formula>();
  const mestras = new Map<string, { linha: number; coluna: number; no: Formula["no"] }>();
  const filhas: { k: number; linha: number; coluna: number; si: string }[] = [];
  for (const [, letras, numero, atributos, corpo] of xml.matchAll(RE_CELULA)) {
    const linha = Number(numero), coluna = colunaParaNumero(letras!);
    const k = chave(linha, coluna);
    const f = corpo ? /<f([^>]*?)(?:\/>|>([^<]*)<\/f>)/.exec(corpo) : null;
    if (!f) {
      const valor = corpo ? constanteDaCelula(atributos!, corpo, textos) : null;
      if (valor !== null) constantes.set(k, valor);
      continue;
    }
    const si = /\ssi="(\d+)"/.exec(f[1]!)?.[1];
    if (f[2] !== undefined && f[2] !== "") {
      const no = lerFormula(desescaparXml(f[2]), nome);
      formulas.set(k, { no, dl: 0, dc: 0 });
      if (si !== undefined) mestras.set(si, { linha, coluna, no });
    } else if (si !== undefined) {
      filhas.push({ k, linha, coluna, si });
    }
  }
  for (const filha of filhas) {
    const mestra = mestras.get(filha.si);
    if (!mestra) throw new Error(`Fórmula compartilhada ${filha.si} sem a célula principal na aba ${nome}`);
    formulas.set(filha.k, { no: mestra.no, dl: filha.linha - mestra.linha, dc: filha.coluna - mestra.coluna });
  }
  return { constantes, formulas };
}

// Tira o valor de exemplo das células de entrada que a ferramenta não preenche, mantendo o estilo
function esvaziarEntradas(xml: string, colunas: string, aPartirDaLinha: number): string {
  const [de, ate] = colunas.split(":").map(colunaParaNumero) as [number, number];
  return xml.replace(RE_CELULA, (celula, letras: string, numero: string, atributos: string, corpo?: string) => {
    const coluna = colunaParaNumero(letras);
    if (Number(numero) < aPartirDaLinha || coluna < de || coluna > ate || !corpo || corpo.includes("<f")) return celula;
    return `<c r="${letras}${numero}"${atributos.replace(/\s+t="[^"]*"/, "")}/>`;
  });
}

// ---------- resultados gravados ----------

type CelulaCalculada = { aba: string; linha: number; coluna: number; endereco: string; atributos: string; formula: string };
// O XML de uma aba com fórmulas, cortado em volta de cada célula calculada: a exportação só intercala os valores
type AbaCalculada = { caminho: string; pedacos: string[]; celulas: CelulaCalculada[] };

function cortarAba(nome: string, caminho: string, xml: string): AbaCalculada {
  const pedacos: string[] = [];
  const celulas: CelulaCalculada[] = [];
  let ultimo = 0;
  for (const m of xml.matchAll(RE_CELULA)) {
    const corpo = m[4];
    const f = corpo ? /<f[^>]*?(?:\/>|>[^<]*<\/f>)/.exec(corpo) : null;
    if (!f) continue;
    pedacos.push(xml.slice(ultimo, m.index));
    celulas.push({
      aba: nome,
      linha: Number(m[2]),
      coluna: colunaParaNumero(m[1]!),
      endereco: `${m[1]}${m[2]}`,
      atributos: m[3]!.replace(/\s+t="[^"]*"/, ""),
      formula: f[0],
    });
    ultimo = m.index + m[0].length;
  }
  pedacos.push(xml.slice(ultimo));
  return { caminho, pedacos, celulas };
}

function valorEmXml(valor: Valor): { tipo: string; v: string } {
  if (ehErro(valor)) return { tipo: ' t="e"', v: `<v>${valor.erro}</v>` };
  if (typeof valor === "boolean") return { tipo: ' t="b"', v: `<v>${valor ? 1 : 0}</v>` };
  // Sem xml:space, o Excel corta o espaço das pontas ao ler (há rótulos da aba Items que terminam em espaço)
  if (typeof valor === "string") {
    const espaco = /^\s|\s$/.test(valor) ? ' xml:space="preserve"' : "";
    return { tipo: ' t="str"', v: `<v${espaco}>${escaparXml(valor)}</v>` };
  }
  const n = valor ?? 0;
  return { tipo: "", v: `<v>${Object.is(n, -0) ? 0 : n}</v>` };
}

function montarAba(aba: AbaCalculada, calculo: Calculo): string {
  const partes: string[] = [aba.pedacos[0]!];
  aba.celulas.forEach((celula, i) => {
    const { tipo, v } = valorEmXml(calculo.valor(celula.aba, celula.linha, celula.coluna));
    partes.push(`<c r="${celula.endereco}"${celula.atributos}${tipo}>${celula.formula}${v}</c>`, aba.pedacos[i + 1]!);
  });
  return partes.join("");
}

// Os gráficos guardam uma cópia dos números que mostram (numCache/strCache); sem atualizar, exibiriam o exemplo
function montarGrafico(xml: string, calculo: Calculo): string {
  return xml.replace(
    /<c:(numRef|strRef)><c:f>([^<]*)<\/c:f><c:(numCache|strCache)>(.*?)<\/c:\3><\/c:\1>/gs,
    (original, tipoRef: string, formula: string, tipoCache: string, cache: string) => {
      const no = lerFormula(desescaparXml(formula), "");
      if (no.tipo !== "ref") return original;
      const { aba, l1, c1, l2, c2 } = no.ref;
      const valores: Valor[] = [];
      for (let l = l1; l <= l2; l++) for (let c = c1; c <= c2; c++) valores.push(calculo.valor(aba, l, c));
      const pontos = valores
        .map((valor, idx) => {
          if (tipoCache === "numCache") return typeof valor === "number" ? `<c:pt idx="${idx}"><c:v>${valor}</c:v></c:pt>` : "";
          if (valor === null || ehErro(valor)) return "";
          const texto = typeof valor === "number" ? formatarNumero(valor) : String(valor);
          return `<c:pt idx="${idx}"><c:v>${escaparXml(texto)}</c:v></c:pt>`;
        })
        .join("");
      const formato = /<c:formatCode>.*?<\/c:formatCode>/s.exec(cache)?.[0] ?? "";
      return `<c:${tipoRef}><c:f>${formula}</c:f><c:${tipoCache}>${formato}<c:ptCount val="${valores.length}"/>${pontos}</c:${tipoCache}></c:${tipoRef}>`;
    },
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
    // zlib nativo do Node: as abas calculadas (uns 6 MB de XML) são comprimidas a cada exportação
    comprimido: guardar ? conteudo : deflateRawSync(conteudo, { level: 6 }),
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
  // abas lidas para o cálculo, pelo nome
  abas: Map<string, Aba>;
  // cabeçalho da aba Data (linhas 1 a 3), que as fórmulas também leem
  cabecalhoDados: Map<number, Valor>;
  calculadas: AbaCalculada[];
  graficos: Map<string, string>;
};

const preparados = new WeakMap<Uint8Array, Map<ModeloPlanilha, ModeloPreparado>>();

function abasDoLivro(arquivos: Record<string, Uint8Array>): { nome: string; caminho: string }[] {
  return [...ler(arquivos, "xl/workbook.xml").matchAll(/<sheet [^>]*name="([^"]+)"/g)].map(([, nome]) => ({
    nome: desescaparXml(nome!),
    caminho: arquivoDaAba(arquivos, nome!),
  }));
}

function preparar(modelo: Uint8Array, formato: ModeloPlanilha): ModeloPreparado {
  let porFormato = preparados.get(modelo);
  const pronto = porFormato?.get(formato);
  if (pronto) return pronto;

  const arquivos = unzipSync(modelo);
  const abaDados = arquivoDaAba(arquivos, "Data");
  const abaLeitura = arquivoDaAba(arquivos, "Read_First");
  for (const entrada of formato.entradasSemDados ?? []) {
    const caminho = arquivoDaAba(arquivos, entrada.aba);
    arquivos[caminho] = strToU8(esvaziarEntradas(ler(arquivos, caminho), entrada.colunas, entrada.aPartirDaLinha));
  }
  // Os valores gravados são calculados de novo a cada exportação; fullCalcOnLoad faz o Excel conferir ao abrir
  const livro = ler(arquivos, "xl/workbook.xml").replace(/<calcPr([^>]*?)\s*\/>/, (_, atributos: string) =>
    `<calcPr${atributos.replace(/\s+fullCalcOnLoad="[^"]*"/, "")} fullCalcOnLoad="1"/>`,
  );
  arquivos["xl/workbook.xml"] = strToU8(livro);

  const xmlTextos = ler(arquivos, TEXTOS_COMPARTILHADOS);
  const sis = [...xmlTextos.matchAll(/<si>(.*?)<\/si>/gs)];
  const indiceDoTexto = new Map(sis.map((si, indice) => [si[1]!, indice]));
  const textos = sis.map((si) => textoDoSi(si[1]!));

  const abas = new Map<string, Aba>();
  const calculadas: AbaCalculada[] = [];
  for (const { nome, caminho } of abasDoLivro(arquivos)) {
    const xml = ler(arquivos, caminho);
    const aba = lerAba(nome, xml, textos);
    abas.set(nome, aba);
    if (aba.formulas.size > 0) calculadas.push(cortarAba(nome, caminho, xml));
  }
  const dados = abas.get("Data")!;
  const cabecalhoDados = new Map([...dados.constantes].filter(([k]) => Math.floor(k / 16384) < PRIMEIRA_LINHA_DE_DADOS));
  const graficos = new Map(
    Object.keys(arquivos)
      .filter((caminho) => /^xl\/charts\/chart\d+\.xml$/.test(caminho))
      .map((caminho) => [caminho, ler(arquivos, caminho)]),
  );

  const mudam = new Set([abaDados, abaLeitura, ...calculadas.map((aba) => aba.caminho), ...graficos.keys()]);
  const prontas = new Map<string, Entrada>();
  for (const [caminho, conteudo] of Object.entries(arquivos)) {
    if (!mudam.has(caminho)) prontas.set(caminho, comprimir(caminho, conteudo));
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
    abas,
    cabecalhoDados,
    calculadas,
    graficos,
  };
  if (!porFormato) preparados.set(modelo, (porFormato = new Map()));
  porFormato.set(formato, preparado);
  return preparado;
}

// As abas do modelo com as respostas do estudo na Data e o idioma na Read_First, para o cálculo
function abasComOsDados(preparado: ModeloPreparado, linhas: readonly (readonly number[])[], idioma: string, celulaIdioma: string) {
  const abas = new Map(preparado.abas);
  const dados = new Map(preparado.cabecalhoDados);
  linhas.forEach((valores, posicao) => {
    valores.forEach((valor, coluna) => dados.set(chave(PRIMEIRA_LINHA_DE_DADOS + posicao, coluna + 1), valor));
  });
  abas.set("Data", { constantes: dados, formulas: new Map() });
  const leitura = preparado.abas.get("Read_First")!;
  const [, letras, numero] = /^([A-Z]+)(\d+)$/.exec(celulaIdioma)!;
  const constantes = new Map(leitura.constantes);
  constantes.set(chave(Number(numero), colunaParaNumero(letras!)), idioma);
  abas.set("Read_First", { constantes, formulas: leitura.formulas });
  return abas;
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

  const modeloPreparado = preparar(modelo, formato);
  const nomeDoIdioma = IDIOMA_NA_PLANILHA[idioma];
  const nome = escaparXml(nomeDoIdioma);
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

  const calculo = new Calculo(abasComOsDados(modeloPreparado, linhas, nomeDoIdioma, formato.celulaIdioma));
  const calculadas = new Map(
    modeloPreparado.calculadas.map((aba) => [aba.caminho, comprimir(aba.caminho, strToU8(montarAba(aba, calculo)))]),
  );
  const graficos = new Map(
    [...modeloPreparado.graficos].map(([caminho, xml]) => [caminho, comprimir(caminho, strToU8(montarGrafico(xml, calculo)))]),
  );

  return montarZip(
    modeloPreparado.ordem.map((caminho) => {
      if (caminho === modeloPreparado.abaDados) return dados;
      if (caminho === modeloPreparado.abaLeitura) return leitura;
      if (caminho === TEXTOS_COMPARTILHADOS && textos) return textos;
      return calculadas.get(caminho) ?? graficos.get(caminho) ?? modeloPreparado.prontas.get(caminho)!;
    }),
  );
}
