// Gera docs/manual/manual-da-ferramenta-ueq.pdf a partir de docs/manual/manual.html e dos prints de
// docs/manual/prints (pnpm manual:prints). Uso: pnpm manual:pdf
import { existsSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { chromium } from "@playwright/test";

const PDF = resolve("docs/manual/manual-da-ferramenta-ueq.pdf");

async function main() {
  if (!existsSync(resolve("docs/manual/prints/01-inicio.jpg"))) {
    throw new Error("Faltam os prints. Rode pnpm manual:prints com a ferramenta no ar (pnpm start).");
  }
  const navegador = await chromium.launch();
  const page = await navegador.newPage();
  // Servido por um endereço interno, não por file://: o navegador só deixa redimensionar no canvas imagens
  // da mesma origem
  await page.route("http://manual.local/**", (rota) => {
    const arquivo = join(resolve("docs/manual"), decodeURIComponent(new URL(rota.request().url()).pathname));
    const tipo = arquivo.endsWith(".html") ? "text/html; charset=utf-8" : "image/jpeg";
    return existsSync(arquivo) ? rota.fulfill({ body: readFileSync(arquivo), contentType: tipo }) : rota.fulfill({ status: 404 });
  });
  await page.goto("http://manual.local/manual.html", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  // Os prints saem em 2x (2880 px). No A4 bastam 1800 px: o PDF fica leve para mandar por e-mail
  await page.evaluate(async () => {
    for (const imagem of Array.from(document.images)) {
      await imagem.decode();
      const largura = Math.min(1800, imagem.naturalWidth);
      const tela = document.createElement("canvas");
      tela.width = largura;
      tela.height = Math.round((imagem.naturalHeight * largura) / imagem.naturalWidth);
      tela.getContext("2d")?.drawImage(imagem, 0, 0, tela.width, tela.height);
      imagem.src = tela.toDataURL("image/jpeg", 0.8);
      await imagem.decode();
    }
  });
  const rodape = `<div style="width:100%;font-size:8px;color:#46525E;padding:0 18mm;display:flex;justify-content:space-between;font-family:Verdana,sans-serif">
    <span>Ferramenta UEQ · Manual de uso</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`;
  await page.pdf({
    path: PDF,
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: true,
    headerTemplate: "<span></span>",
    footerTemplate: rodape,
  });
  await navegador.close();
  console.log(`${PDF} (${(statSync(PDF).size / 1024 / 1024).toFixed(1)} MB)`);
}

void main();
