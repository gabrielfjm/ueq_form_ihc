// Monta o catálogo de textos da interface: todo t("…") e m("…") com texto fixo no código de src/.
// Só para scripts e testes (lê arquivos e usa o compilador do TypeScript); a aplicação lê catalogo.json
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

// origem: o arquivo que usa o texto, para a tradução saber em que tela ele aparece
export type EntradaCatalogo = { texto: string; cliente: boolean; origem: string };

const IGNORAR = /[\\/](__tests__|generated|idiomas)[\\/]|[\\/]traducao[\\/]extrair\.ts$/;

function arquivos(pasta: string): string[] {
  return fs.readdirSync(pasta, { withFileTypes: true }).flatMap((item) => {
    const caminho = path.join(pasta, item.name);
    if (item.isDirectory()) return arquivos(caminho);
    return /\.tsx?$/.test(item.name) && !IGNORAR.test(caminho) ? [caminho] : [];
  });
}

export function extrairCatalogo(raiz: string): EntradaCatalogo[] {
  const textos = new Map<string, { cliente: boolean; origem: string }>();
  for (const arquivo of arquivos(raiz).sort()) {
    const codigo = fs.readFileSync(arquivo, "utf8");
    if (!/\b[tm]\(/.test(codigo)) continue;
    const cliente = /^\s*["']use client["']/.test(codigo);
    const fonte = ts.createSourceFile(arquivo, codigo, ts.ScriptTarget.Latest, true, arquivo.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
    const visitar = (no: ts.Node) => {
      if (ts.isCallExpression(no) && ts.isIdentifier(no.expression) && (no.expression.text === "t" || no.expression.text === "m")) {
        const [primeiro] = no.arguments;
        if (primeiro && (ts.isStringLiteral(primeiro) || ts.isNoSubstitutionTemplateLiteral(primeiro)) && /\p{L}/u.test(primeiro.text)) {
          // Constantes marcadas com m() podem ser mostradas por qualquer componente, inclusive de cliente
          const doCliente = cliente || no.expression.text === "m";
          const anterior = textos.get(primeiro.text);
          textos.set(primeiro.text, {
            cliente: (anterior?.cliente ?? false) || doCliente,
            origem: anterior?.origem ?? path.relative(raiz, arquivo).split(path.sep).join("/"),
          });
        }
      }
      ts.forEachChild(no, visitar);
    };
    visitar(fonte);
  }
  return [...textos]
    .map(([texto, dados]) => ({ texto, ...dados }))
    .sort((a, b) => (a.texto < b.texto ? -1 : a.texto > b.texto ? 1 : 0));
}
