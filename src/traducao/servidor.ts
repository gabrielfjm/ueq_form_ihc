import "server-only";
import { cookies } from "next/headers";
import { after } from "next/server";
import { cache } from "react";
import { ehIdioma, IDIOMA_PADRAO, infoIdioma, type CodigoIdioma } from "@/idiomas";
import { banco } from "@/lib/banco";
import { pesquisadorDaSessao } from "@/lib/sessao";
import catalogo from "./catalogo.json";
import { traducaoAutomaticaLigada, traduzirLote, type Tipo } from "./claude";
import { COOKIE_IDIOMA } from "./cookie";
import { chaveDoTexto, criarTradutor, interpolar, type Dicionario, type Traduzir } from "./nucleo";
import { chaveDoGlossario, ehRotulo, rotulosCitados, TERMOS_DO_GLOSSARIO } from "./rodadas";

type Entrada = { texto: string; cliente: boolean; origem: string };
const TEXTOS = catalogo.textos as Entrada[];
const CHAVES = TEXTOS.map((entrada) => chaveDoTexto(entrada.texto));
const CHAVES_DO_CLIENTE = new Set(TEXTOS.filter((entrada) => entrada.cliente).map((entrada) => chaveDoTexto(entrada.texto)));

// O dicionário de cada idioma fica na memória da instância; incompleto, é relido logo, porque a
// tradução do catálogo pode estar andando em segundo plano
type Carregado = { dicionario: Dicionario; faltam: number; lidoEm: number };
const memoria = new Map<string, Carregado>();

async function dicionarioDoIdioma(idioma: string): Promise<Carregado> {
  const guardado = memoria.get(idioma);
  const validade = guardado?.faltam === 0 ? 10 * 60_000 : 15_000;
  if (guardado && Date.now() - guardado.lidoEm < validade) return guardado;
  const linhas = await banco.traducao.findMany({
    where: { idioma, hashOrigem: { in: CHAVES } },
    select: { hashOrigem: true, texto: true },
  });
  const dicionario: Dicionario = {};
  for (const linha of linhas) dicionario[linha.hashOrigem] = linha.texto;
  const carregado = { dicionario, faltam: CHAVES.length - linhas.length, lidoEm: Date.now() };
  memoria.set(idioma, carregado);
  return carregado;
}

// Quem entrou usa o idioma da conta; antes de entrar, o último escolhido neste navegador
export const idiomaDaInterface = cache(async (): Promise<CodigoIdioma> => {
  const pesquisador = await pesquisadorDaSessao();
  const valor = pesquisador?.idioma ?? (await cookies()).get(COOKIE_IDIOMA)?.value;
  return ehIdioma(valor) ? valor : IDIOMA_PADRAO;
});

// TRADUCAO_PSEUDO=1 (só para conferir a cobertura): fora do português, todo texto que passa por t() sai
// entre ⟦ ⟧, então o que aparecer na tela sem as marcas não está no catálogo
const PSEUDO = process.env.TRADUCAO_PSEUDO === "1";
const marcar = (texto: string) => (texto.startsWith("⟦") ? texto : `⟦${texto}⟧`);

export async function tradutorDoIdioma(idioma: string): Promise<Traduzir> {
  if (idioma === IDIOMA_PADRAO || !ehIdioma(idioma)) return criarTradutor(IDIOMA_PADRAO, {});
  if (PSEUDO) {
    const doCatalogo = new Set(CHAVES);
    const pseudo = (texto: string, valores?: Record<string, string | number>) =>
      doCatalogo.has(chaveDoTexto(texto)) ? marcar(interpolar(texto, valores)) : interpolar(texto, valores);
    return Object.assign(pseudo, { idioma, lang: infoIdioma(idioma).lang });
  }
  const { dicionario, faltam } = await dicionarioDoIdioma(idioma);
  if (faltam > 0) agendar(() => completarCatalogo(idioma));
  // Listas e datas seguem o idioma em que o texto de fato sai (ver idiomaExibido)
  return criarTradutor(idioma, dicionario, faltam > CHAVES.length / 2 ? "pt-BR" : infoIdioma(idioma).lang);
}

// O idioma fica também neste navegador: depois de sair, Entrar e a página inicial continuam nele
export async function lembrarIdioma(idioma: string) {
  (await cookies()).set(COOKIE_IDIOMA, ehIdioma(idioma) ? idioma : IDIOMA_PADRAO, {
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
}

// t() das páginas, layouts e ações do pesquisador
export const tradutor = cache(async (): Promise<Traduzir> => tradutorDoIdioma(await idiomaDaInterface()));

// O idioma em que a tela de fato aparece, para o <html lang> e a direção (WCAG 3.1.1): enquanto a maior
// parte da interface ainda não foi traduzida (API desligada ou primeira visita), a tela está em português
export async function idiomaExibido(): Promise<CodigoIdioma> {
  const idioma = await idiomaDaInterface();
  if (idioma === IDIOMA_PADRAO || PSEUDO) return idioma;
  const { faltam } = await dicionarioDoIdioma(idioma);
  return faltam > CHAVES.length / 2 ? IDIOMA_PADRAO : idioma;
}

// Para o ProvedorTraducao: só os textos que aparecem em componentes de cliente
export async function dicionarioDoCliente(): Promise<{ idioma: CodigoIdioma; dicionario: Dicionario }> {
  const idioma = await idiomaDaInterface();
  if (idioma === IDIOMA_PADRAO) return { idioma, dicionario: {} };
  if (PSEUDO) {
    return { idioma, dicionario: Object.fromEntries(TEXTOS.filter((e) => e.cliente).map((e) => [chaveDoTexto(e.texto), marcar(e.texto)])) };
  }
  await tradutor();
  const { dicionario } = await dicionarioDoIdioma(idioma);
  const doCliente: Dicionario = {};
  for (const [chave, texto] of Object.entries(dicionario)) if (CHAVES_DO_CLIENTE.has(chave)) doCliente[chave] = texto;
  return { idioma, dicionario: doCliente };
}

function agendar(tarefa: () => Promise<unknown>) {
  if (!traducaoAutomaticaLigada()) return;
  try {
    after(tarefa);
  } catch {
    // Fora de uma requisição (scripts), roda direto
    void tarefa();
  }
}

async function guardar(idioma: string, pares: { hashOrigem: string; texto: string }[]) {
  if (pares.length === 0) return;
  await banco.traducao.createMany({ data: pares.map((par) => ({ idioma, ...par })), skipDuplicates: true });
}

async function emParalelo<T>(tarefas: (() => Promise<T>)[], limite: number): Promise<void> {
  const fila = [...tarefas];
  await Promise.all(
    Array.from({ length: Math.min(limite, fila.length) }, async () => {
      for (let tarefa = fila.shift(); tarefa; tarefa = fila.shift()) await tarefa();
    }),
  );
}

const TAMANHO_DO_LOTE = 60;
const emAndamento = new Set<string>();

async function traducoesGuardadas(idioma: string, chaves: string[]): Promise<Map<string, string>> {
  const linhas = await banco.traducao.findMany({ where: { idioma, hashOrigem: { in: chaves } }, select: { hashOrigem: true, texto: true } });
  return new Map(linhas.map((linha) => [linha.hashOrigem, linha.texto]));
}

// Os termos do idioma ficam guardados, para uma execução que recomeça usar as mesmas palavras. A leitura final
// vem do banco porque, se duas instâncias traduzirem ao mesmo tempo, vale a que gravou primeiro
async function glossarioDoIdioma(idioma: string): Promise<Record<string, string>> {
  const chave = (termo: string) => chaveDoTexto(chaveDoGlossario(termo));
  const chaves = TERMOS_DO_GLOSSARIO.map(chave);
  const existentes = await traducoesGuardadas(idioma, chaves);
  const faltando = TERMOS_DO_GLOSSARIO.filter((termo) => !existentes.has(chave(termo)));
  if (faltando.length > 0) {
    const traducoes = await traduzirLote(faltando, IDIOMA_PADRAO, idioma, "interface");
    await guardar(
      idioma,
      faltando.flatMap((termo, indice) => {
        const traducao = traducoes[indice];
        return traducao ? [{ hashOrigem: chave(termo), texto: traducao }] : [];
      }),
    );
  }
  const guardadas = await traducoesGuardadas(idioma, chaves);
  return Object.fromEntries(TERMOS_DO_GLOSSARIO.flatMap((termo) => (guardadas.has(chave(termo)) ? [[termo, guardadas.get(chave(termo))!]] : [])));
}

// Traduz o que falta do catálogo de um idioma: primeiro o glossário, depois os rótulos e por fim os textos
// longos (ver rodadas.ts). Cada lote é guardado assim que volta, então uma execução interrompida (fim do tempo
// da função) continua de onde parou na próxima
export async function completarCatalogo(idioma: string, limiteMs = 240_000): Promise<{ traduzidos: number; faltam: number }> {
  if (!traducaoAutomaticaLigada() || !ehIdioma(idioma) || idioma === IDIOMA_PADRAO || emAndamento.has(idioma)) {
    return { traduzidos: 0, faltam: (await dicionarioDoIdioma(idioma)).faltam };
  }
  emAndamento.add(idioma);
  const inicio = Date.now();
  let traduzidos = 0;

  const traduzirEmLotes = async (entradas: Entrada[], termos: Record<string, string>, rotulos?: Map<string, string>) => {
    const lotes: Entrada[][] = [];
    for (let i = 0; i < entradas.length; i += TAMANHO_DO_LOTE) lotes.push(entradas.slice(i, i + TAMANHO_DO_LOTE));
    await emParalelo(
      lotes.map((lote) => async () => {
        if (Date.now() - inicio > limiteMs) return;
        try {
          const traducoes = await traduzirLote(
            lote.map((entrada) => entrada.texto),
            IDIOMA_PADRAO,
            idioma,
            "interface",
            {
              termos,
              telas: lote.map((entrada) => entrada.origem),
              rotulos: rotulos && lote.map((entrada) => rotulosCitados(entrada.texto, rotulos)),
            },
          );
          const pares = lote.flatMap((entrada, indice) => {
            const traducao = traducoes[indice];
            return traducao ? [{ hashOrigem: chaveDoTexto(entrada.texto), texto: traducao }] : [];
          });
          await guardar(idioma, pares);
          traduzidos += pares.length;
        } catch (erro) {
          // eslint-disable-next-line no-console -- vai para o log da Vercel; a tela segue no original
          console.error(`Tradução do catálogo (${idioma}) falhou num lote:`, erro);
        }
      }),
      6,
    );
  };

  try {
    const existentes = new Set(
      (await banco.traducao.findMany({ where: { idioma, hashOrigem: { in: CHAVES } }, select: { hashOrigem: true } })).map(
        (linha) => linha.hashOrigem,
      ),
    );
    // Textos da mesma tela vão juntos: um ajuda a entender o outro
    const faltando = TEXTOS.filter((_, indice) => !existentes.has(CHAVES[indice]!)).sort((a, b) => (a.origem < b.origem ? -1 : a.origem > b.origem ? 1 : 0));
    if (faltando.length > 0) {
      const termos = await glossarioDoIdioma(idioma);
      await traduzirEmLotes(faltando.filter((entrada) => ehRotulo(entrada.texto)), termos);

      // Os textos longos só andam com todos os rótulos prontos, para citarem os botões pelo nome certo
      const todosOsRotulos = TEXTOS.filter((entrada) => ehRotulo(entrada.texto)).map((entrada) => entrada.texto);
      const guardados = await traducoesGuardadas(idioma, todosOsRotulos.map((texto) => chaveDoTexto(texto)));
      const rotulos = new Map(
        todosOsRotulos.flatMap((texto) => {
          const traducao = guardados.get(chaveDoTexto(texto));
          return traducao ? [[texto, traducao] as const] : [];
        }),
      );
      if (rotulos.size === todosOsRotulos.length) {
        await traduzirEmLotes(faltando.filter((entrada) => !ehRotulo(entrada.texto)), termos, rotulos);
      }
    }
  } catch (erro) {
    // eslint-disable-next-line no-console -- vai para o log da Vercel; a tela segue no original
    console.error(`Tradução do catálogo (${idioma}) falhou:`, erro);
  } finally {
    emAndamento.delete(idioma);
    memoria.delete(idioma);
  }
  return { traduzidos, faltam: (await dicionarioDoIdioma(idioma)).faltam };
}

// Quanto do catálogo cada idioma já tem (página Proteção de dados da administração)
export async function coberturaDoCatalogo(): Promise<{ total: number; porIdioma: Map<string, number> }> {
  const grupos = await banco.traducao.groupBy({ by: ["idioma"], where: { hashOrigem: { in: CHAVES } }, _count: true });
  return { total: CHAVES.length, porIdioma: new Map(grupos.map((grupo) => [grupo.idioma, grupo._count])) };
}

// Textos escritos pelo pesquisador (título, produto, objetivo, versões), traduzidos para o idioma do
// participante. Espera a API até esperarMs; o que não chegar a tempo sai no original e fica para a próxima
export async function traduzirTextosLivres(
  textos: string[],
  origem: string,
  destino: string,
  { esperarMs = 8000, tipo = "estudo" as Tipo } = {},
): Promise<string[]> {
  if (origem === destino) return textos;
  const unicos = [...new Set(textos.filter((texto) => texto.trim()))];
  const chave = (texto: string) => chaveDoTexto(texto, origem);
  const linhas = await banco.traducao.findMany({
    where: { idioma: destino, hashOrigem: { in: unicos.map(chave) } },
    select: { hashOrigem: true, texto: true },
  });
  const prontas = new Map(linhas.map((linha) => [linha.hashOrigem, linha.texto]));
  const faltando = unicos.filter((texto) => !prontas.has(chave(texto)));

  if (faltando.length > 0 && traducaoAutomaticaLigada()) {
    const trabalho = traduzirLote(faltando, origem, destino, tipo)
      .then(async (traducoes) => {
        const pares = faltando.flatMap((texto, indice) => {
          const traducao = traducoes[indice];
          return traducao ? [{ hashOrigem: chave(texto), texto: traducao }] : [];
        });
        await guardar(destino, pares);
        for (const par of pares) prontas.set(par.hashOrigem, par.texto);
      })
      // eslint-disable-next-line no-console -- vai para o log da Vercel; a tela segue no original
      .catch((erro) => console.error(`Tradução de textos do estudo (${origem}→${destino}) falhou:`, erro));
    const terminou = await Promise.race([trabalho.then(() => true), new Promise<false>((r) => setTimeout(() => r(false), esperarMs))]);
    if (!terminou) agendar(() => trabalho);
  }
  return textos.map((texto) => prontas.get(chave(texto)) ?? texto);
}
