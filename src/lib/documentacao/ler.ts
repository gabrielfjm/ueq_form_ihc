import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { cache } from "react";
import type { Documento } from "./catalogo";
import { renderizarMarkdown } from "./markdown";

// generateMetadata e a página leem o mesmo documento na mesma requisição: o cache evita ler duas vezes
export const lerDocumento = cache(async (documento: Documento) =>
  renderizarMarkdown(await readFile(join(process.cwd(), documento.arquivo), "utf8"), documento.arquivo),
);
