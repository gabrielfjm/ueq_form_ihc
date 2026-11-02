import { z } from "zod";
import { m } from "@/traducao/nucleo";
import { textoDoCampo } from "./formulario";

const DIA = /^\d{4}-\d{2}-\d{2}$/;

export const MAXIMO_VERSOES = 6;

export type CampoEstudo = "titulo" | "produtoAvaliado" | "objetivo" | "dataInicio" | "dataFim" | `versao-${number}`;

const texto = (vazio: string, maximo: number, longo: string) => z.string().trim().min(1, vazio).max(maximo, longo);

const dadosEstudo = z
  .object({
    titulo: texto(m("Dê um título ao estudo."), 160, m("Use no máximo 160 caracteres no título.")),
    produtoAvaliado: texto(m("Diga qual produto será avaliado."), 120, m("Use no máximo 120 caracteres no produto.")),
    objetivo: texto(m("Escreva o objetivo. É o que o participante lê no termo."), 2000, m("Use no máximo 2000 caracteres no objetivo.")),
    dataInicio: z.string().regex(DIA, m("Informe a data de início.")),
    dataFim: z.string().regex(DIA, m("Informe a data de fim.")),
    coletarDemografia: z.boolean(),
    // Conferido contra os 37 idiomas na ação (o módulo de idiomas não vai para o navegador)
    idioma: z.string(),
    versoes: z
      .array(z.object({ id: z.string(), nome: z.string().trim() }))
      .min(1)
      .max(MAXIMO_VERSOES),
  })
  .superRefine((estudo, ctx) => {
    if (DIA.test(estudo.dataInicio) && DIA.test(estudo.dataFim) && estudo.dataFim < estudo.dataInicio) {
      ctx.addIssue({ code: "custom", path: ["dataFim"], message: m("A data de fim vem antes da de início. Confira as duas.") });
    }
    const vistos = new Set<string>();
    estudo.versoes.forEach((versao, posicao) => {
      const campo = `versao-${posicao + 1}`;
      if (!versao.nome) {
        ctx.addIssue({ code: "custom", path: [campo], message: m("Dê um nome à versão ou remova.") });
      } else if (versao.nome.length > 80) {
        ctx.addIssue({ code: "custom", path: [campo], message: m("Use no máximo 80 caracteres no nome da versão.") });
      } else if (vistos.has(versao.nome.toLowerCase())) {
        ctx.addIssue({ code: "custom", path: [campo], message: m("Já existe outra versão com esse nome. Use nomes diferentes.") });
      }
      vistos.add(versao.nome.toLowerCase());
    });
  });

export type DadosEstudo = z.infer<typeof dadosEstudo>;

// Cada versão chega como um par versaoId / versaoNome, na ordem em que aparece no formulário
export function lerFormularioEstudo(dados: FormData) {
  const ids = dados.getAll("versaoId").map(String);
  const nomes = dados.getAll("versaoNome").map(String);
  return dadosEstudo.safeParse({
    titulo: textoDoCampo(dados, "titulo"),
    produtoAvaliado: textoDoCampo(dados, "produtoAvaliado"),
    objetivo: textoDoCampo(dados, "objetivo"),
    dataInicio: textoDoCampo(dados, "dataInicio"),
    dataFim: textoDoCampo(dados, "dataFim"),
    coletarDemografia: dados.get("coletarDemografia") === "sim",
    idioma: textoDoCampo(dados, "idioma"),
    versoes: nomes.map((nome, posicao) => ({ id: ids[posicao] ?? "", nome })),
  });
}
