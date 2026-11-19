import { existsSync, readFileSync } from "node:fs";
import { DOCUMENTOS } from "../src/lib/documentacao/catalogo";
import { problemasDaTraducao } from "../src/lib/documentacao/conferencia";
import { IDIOMAS_TRADUZIDOS, arquivoTraduzido } from "../src/lib/documentacao/idiomas";

// pnpm docs:conferir [idioma] [arquivo]: confere se cada tradução tem o mesmo esqueleto do original
// (títulos, âncoras, links, tabelas, códigos e os diagramas, iguais aos do original). Sem argumentos, confere todos os idiomas.
// pnpm docs:conferir --arquivos <original> <tradução>: confere dois arquivos quaisquer (um trecho, por exemplo)
const argumentos = process.argv.slice(2);
if (argumentos[0] === "--arquivos") {
  const [original = "", traducao = ""] = argumentos.slice(1);
  const problemas = problemasDaTraducao(readFileSync(original, "utf8"), readFileSync(traducao, "utf8"));
  for (const problema of problemas) console.log(`✗ ${problema}`);
  console.log(problemas.length === 0 ? "Tudo certo." : `${problemas.length} problema(s).`);
  process.exit(problemas.length === 0 ? 0 : 1);
}
const [idiomaPedido, arquivoPedido] = argumentos;
const idiomas = idiomaPedido ? [idiomaPedido] : [...IDIOMAS_TRADUZIDOS];
const documentos = DOCUMENTOS.filter((documento) => !arquivoPedido || documento.arquivo.endsWith(arquivoPedido));

let erros = 0;
for (const idioma of idiomas) {
  for (const { arquivo } of documentos) {
    const traduzido = arquivoTraduzido(arquivo, idioma);
    if (!existsSync(traduzido)) {
      console.log(`✗ ${traduzido}: não existe`);
      erros++;
      continue;
    }
    const problemas = problemasDaTraducao(readFileSync(arquivo, "utf8"), readFileSync(traduzido, "utf8"));
    if (problemas.length === 0) console.log(`✓ ${traduzido}`);
    for (const problema of problemas) console.log(`✗ ${traduzido}: ${problema}`);
    erros += problemas.length;
  }
}
console.log(erros === 0 ? "Tudo certo." : `${erros} problema(s).`);
process.exitCode = erros === 0 ? 0 : 1;
