// Lista os textos do catálogo que não existiam numa versão anterior dele, com a chave de cada um, para escrever as
// traduções numa migração (prisma/migrations/*_traducoes_*). Uso:
//   git show main:src/traducao/catalogo.json > anterior.json
//   pnpm tsx scripts/textos-novos.mts anterior.json > novos.json
import { readFileSync } from "node:fs";
import { chaveDoTexto } from "../src/traducao/nucleo";

type Catalogo = { textos: { texto: string }[] };
// Aceita o arquivo com BOM, como sai do Out-File do PowerShell
const ler = (caminho: string) => JSON.parse(readFileSync(caminho, "utf8").replace(/^﻿/, "")) as Catalogo;

const anterior = new Set(ler(process.argv[2]!).textos.map((item) => item.texto));
const atual = ler(new URL("../src/traducao/catalogo.json", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1"));
const novos = atual.textos.filter((item) => !anterior.has(item.texto)).map((item) => ({ chave: chaveDoTexto(item.texto), texto: item.texto }));
console.log(JSON.stringify(novos, null, 2));
