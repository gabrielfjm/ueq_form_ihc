import type { Metadata } from "next";
import Link from "next/link";
import { classesDasFontes } from "./fontes";
import "./globals.css";

export const metadata: Metadata = { title: "Página não encontrada · Ferramenta UEQ" };

// Com dois layouts raiz (ferramenta e participante), o 404 de endereço inexistente precisa ser um documento
// próprio (node_modules/next/dist/docs, global-not-found)
export default function NaoEncontrada() {
  return (
    <html lang="pt-BR" className={classesDasFontes}>
      <body>
        <main id="conteudo" style={{ maxWidth: "40rem", margin: "0 auto", padding: "48px 16px" }}>
          <h1>Página não encontrada</h1>
          <p>O endereço não existe ou mudou.</p>
          <p>
            <Link href="/">Ir para o início</Link>
          </p>
        </main>
      </body>
    </html>
  );
}
