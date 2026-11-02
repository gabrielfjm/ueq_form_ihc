// pnpm i18n:catalogo — refaz src/traducao/catalogo.json a partir dos t("…") e m("…") do código.
// O teste src/traducao/__tests__/catalogo.test.ts falha quando o arquivo está desatualizado
import fs from "node:fs";
import path from "node:path";
import { extrairCatalogo } from "../src/traducao/extrair";

const textos = extrairCatalogo(path.resolve("src"));
fs.writeFileSync(path.resolve("src/traducao/catalogo.json"), `${JSON.stringify({ textos }, null, 1)}\n`);
console.log(`${textos.length} textos no catálogo (${textos.filter((texto) => texto.cliente).length} de cliente)`);
