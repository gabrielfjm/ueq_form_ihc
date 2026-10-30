// Leitura de respostas no formato da planilha oficial (UEQ Data Analysis Tool, aba Data): uma pessoa
// por linha, os 26 valores de 1 a 7 na ordem oficial, sem cabeçalho. É o mesmo formato que a exportação
// "Formato da planilha oficial" gera, então um arquivo exportado volta igual. Função pura, sem banco

export const TOTAL_ITENS = 26;
export const LIMITE_LINHAS = 5000;
// 5000 linhas de 26 valores dão uns 260 KB; 500 KB cabe com folga no limite de 1 MB das Server Actions
export const LIMITE_BYTES = 500_000;

export type LinhaImportada = { linha: number; valores: number[] };
export type ErroImportacao = { linha: number; mensagem: string };
export type LeituraCsv = { linhas: LinhaImportada[]; erros: ErroImportacao[] };

const BOM = "﻿";

// O Excel em português salva com ";"; o inglês com ","; colar da planilha dá tabulação
function separadorDa(linha: string): string {
  if (linha.includes(";")) return ";";
  if (linha.includes("\t")) return "\t";
  return ",";
}

function campos(linha: string): string[] {
  const partes = linha.split(separadorDa(linha)).map((parte) => parte.trim().replace(/^"(.*)"$/, "$1").trim());
  // Uma separação sobrando no fim da linha (comum ao salvar do Excel) não é um 27º valor
  while (partes.length > TOTAL_ITENS && partes.at(-1) === "") partes.pop();
  return partes;
}

function descrever(valor: string): string {
  return valor === "" ? "vazio" : `"${valor}"`;
}

export function lerCsvDeRespostas(texto: string): LeituraCsv {
  const linhas: LinhaImportada[] = [];
  const erros: ErroImportacao[] = [];
  const brutas = texto.replace(BOM, "").split(/\r\n|\n|\r/);

  brutas.forEach((bruta, posicao) => {
    const numero = posicao + 1;
    // Linha em branco, ou só com separadores, não é resposta: é sobra do fim do arquivo
    if (bruta.replace(/[;,\t\s"]/g, "") === "") return;
    const valores = campos(bruta);
    if (valores.length !== TOTAL_ITENS) {
      erros.push({ linha: numero, mensagem: `Tem ${valores.length} valores; são ${TOTAL_ITENS}, um por item.` });
      return;
    }
    const foraDaEscala = valores
      .map((valor, item) => ({ valor, item: item + 1 }))
      .filter(({ valor }) => !/^[1-7]$/.test(valor));
    if (foraDaEscala.length > 0) {
      const lista = foraDaEscala
        .slice(0, 5)
        .map(({ valor, item }) => `item ${item} (${descrever(valor)})`)
        .join(", ");
      const resto = foraDaEscala.length > 5 ? ` e mais ${foraDaEscala.length - 5}` : "";
      erros.push({ linha: numero, mensagem: `Valores fora de 1 a 7: ${lista}${resto}.` });
      return;
    }
    linhas.push({ linha: numero, valores: valores.map(Number) });
  });

  if (linhas.length + erros.length > LIMITE_LINHAS) {
    return {
      linhas: [],
      erros: [{ linha: 0, mensagem: `O arquivo tem mais de ${LIMITE_LINHAS} linhas. Divida em arquivos menores.` }],
    };
  }
  return { linhas, erros };
}
