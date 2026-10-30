import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { chromium } from "playwright";
import { DOCUMENTOS } from "../src/lib/documentacao/catalogo";
import { NOME_DIAGRAMA, PASTA_DIAGRAMAS, blocosMermaid, nomeDoDiagrama } from "../src/lib/documentacao/diagramas";

// pnpm docs:diagramas: gera um SVG por diagrama Mermaid dos documentos do catálogo e apaga os que
// nenhum documento usa mais. Rode depois de mudar um diagrama num .md
const require = createRequire(import.meta.url);
const mermaid = readFileSync(require.resolve("mermaid/dist/mermaid.min.js"), "utf8");

const diagramas = new Map<string, string>();
for (const documento of DOCUMENTOS) {
  for (const codigo of blocosMermaid(readFileSync(documento.arquivo, "utf8"))) diagramas.set(nomeDoDiagrama(codigo), codigo);
}

mkdirSync(PASTA_DIAGRAMAS, { recursive: true });
const navegador = await chromium.launch();
const pagina = await navegador.newPage();
await pagina.setContent("<!doctype html><html><body></body></html>");
await pagina.addScriptTag({ content: mermaid });
// securityLevel strict: o SVG não leva script nem link clicável
await pagina.evaluate(() => window.mermaid.initialize({ startOnLoad: false, securityLevel: "strict", theme: "default" }));

let gerados = 0;
for (const [nome, codigo] of diagramas) {
  // Dentro de <img> o SVG precisa ser XML válido e ter tamanho próprio: o Mermaid devolve HTML (<br> sem
  // fechar nos rótulos) e width="100%". O XMLSerializer fecha as tags, e o tamanho vem do viewBox
  const svg = await pagina.evaluate(
    async ({ id, texto }) => {
      const recipiente = document.createElement("div");
      recipiente.innerHTML = (await window.mermaid.render(id, texto)).svg;
      const elemento = recipiente.querySelector("svg");
      if (!elemento) throw new Error(`O Mermaid não gerou SVG para ${id}`);
      const [, , largura = 0, altura = 0] = (elemento.getAttribute("viewBox") ?? "").split(/\s+/).map(Number);
      elemento.setAttribute("width", String(Math.ceil(largura)));
      elemento.setAttribute("height", String(Math.ceil(altura)));
      elemento.style.removeProperty("max-width");
      return new XMLSerializer().serializeToString(elemento);
    },
    { id: `d${nome.slice(0, 12)}`, texto: codigo },
  );
  writeFileSync(join(PASTA_DIAGRAMAS, nome), svg);
  gerados++;
}
await navegador.close();

const usados = new Set(diagramas.keys());
const apagados = readdirSync(PASTA_DIAGRAMAS).filter((arquivo) => NOME_DIAGRAMA.test(arquivo) && !usados.has(arquivo));
for (const arquivo of apagados) rmSync(join(PASTA_DIAGRAMAS, arquivo));
console.log(`${gerados} diagramas gerados em ${PASTA_DIAGRAMAS}; ${apagados.length} sem uso apagados`);

declare global {
  interface Window {
    mermaid: {
      initialize(opcoes: Record<string, unknown>): void;
      render(id: string, texto: string): Promise<{ svg: string }>;
    };
  }
}
