"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ehIdioma } from "@/idiomas";
import { banco } from "@/lib/banco";
import { encerrarSessao, pesquisadorDaSessao } from "@/lib/sessao";
import { lembrarIdioma } from "@/traducao/servidor";

export async function sair(): Promise<void> {
  await encerrarSessao();
  redirect("/?aviso=saiu");
}

// Seletor de idioma da barra (com e sem login). Com login, faz o mesmo que Minha conta › Idioma: muda o
// idioma da conta, que é também o idioma padrão dos estudos novos. Sem login, fica só neste navegador
export async function trocarIdioma(dados: FormData): Promise<void> {
  const idioma = dados.get("idioma");
  if (!ehIdioma(idioma)) return;
  const pesquisador = await pesquisadorDaSessao();
  if (pesquisador) await banco.pesquisador.update({ where: { id: pesquisador.id }, data: { idioma } });
  await lembrarIdioma(idioma);
  // A página continua a mesma, já no idioma novo: a barra e as páginas são do layout
  revalidatePath("/", "layout");
}
