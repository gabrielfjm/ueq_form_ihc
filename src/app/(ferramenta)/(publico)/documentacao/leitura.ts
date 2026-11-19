import "server-only";
import type { Leitura } from "@/lib/documentacao/paginas";
import { idiomaDaInterface, tradutor } from "@/traducao/servidor";

// A documentação sai no idioma da interface (src/lib/documentacao/idiomas.ts), com os rótulos do HTML traduzidos
export async function leituraAtual(): Promise<Leitura> {
  return { idioma: await idiomaDaInterface(), t: await tradutor() };
}
