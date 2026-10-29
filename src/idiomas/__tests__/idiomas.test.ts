import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import dados from "../../../data/ueq-idiomas.json";
import { formatar, listaDeNumeros, plural } from "../formatar";
import { IDIOMAS, infoIdioma, instrucaoDoIdioma, negociarIdioma, termosDoIdioma, textosDoIdioma } from "..";

const itensPt = JSON.parse(readFileSync(new URL("../../../data/ueq-itens-ptbr.json", import.meta.url), "utf8")) as {
  itens: { numero: number; termoEsquerdo: string; termoDireito: string }[];
};

// Os 9 PDFs que avisam "This translation is not yet finally approved"
const NAO_APROVADOS = ["ar", "bn", "bs", "he", "hu", "kn", "mr", "nb", "ta"];

describe("os 37 idiomas do pacote oficial", () => {
  it("estão todos, cada um com textos de tela, termos e instrução", () => {
    expect(IDIOMAS).toHaveLength(37);
    expect(new Set(IDIOMAS.map((idioma) => idioma.codigo)).size).toBe(37);
    for (const { codigo } of IDIOMAS) {
      expect(textosDoIdioma(codigo)).toBeDefined();
      const instrucao = instrucaoDoIdioma(codigo);
      expect(instrucao.titulo.trim()).not.toBe("");
      expect(instrucao.paragrafos.length).toBeGreaterThan(0);
    }
  });

  it.each(IDIOMAS.map((idioma) => idioma.codigo))("%s tem os 26 pares em ordem, preenchidos e com termos diferentes", (codigo) => {
    const termos = termosDoIdioma(codigo);
    expect(termos.map((par) => par.numero)).toEqual(Array.from({ length: 26 }, (_, posicao) => posicao + 1));
    for (const par of termos) {
      expect(par.termoEsquerdo.trim()).not.toBe("");
      expect(par.termoDireito.trim()).not.toBe("");
      expect(par.termoEsquerdo).not.toBe(par.termoDireito);
      // Nada de glifo de uso privado (os círculos do PDF) nem caractere de controle colado no termo
      expect(`${par.termoEsquerdo}${par.termoDireito}`).not.toMatch(/[\p{Co}\p{Cc}]/u);
    }
  });

  it("o português é exatamente o de data/ueq-itens-ptbr.json, que alimenta o banco", () => {
    expect(termosDoIdioma("pt")).toEqual(
      itensPt.itens.map(({ numero, termoEsquerdo, termoDireito }) => ({ numero, termoEsquerdo, termoDireito })),
    );
  });

  it("marca os 9 idiomas sem tradução aprovada e os 3 escritos da direita para a esquerda", () => {
    expect(IDIOMAS.filter((idioma) => !idioma.traducaoAprovada).map((idioma) => idioma.codigo).sort()).toEqual(NAO_APROVADOS);
    expect(IDIOMAS.filter((idioma) => idioma.direcao === "rtl").map((idioma) => idioma.codigo).sort()).toEqual(["ar", "fa", "he"]);
  });

  it("toda correção feita pela equipe guarda o par original e o motivo", () => {
    for (const idioma of dados.idiomas) {
      for (const correcao of idioma.correcoes) {
        expect(correcao.motivo.trim()).not.toBe("");
        const atual = idioma.itens[correcao.numero - 1]!;
        expect([atual.termoEsquerdo, atual.termoDireito]).not.toEqual([
          correcao.original.termoEsquerdo,
          correcao.original.termoDireito,
        ]);
      }
    }
  });
});

// Junta todas as strings de um objeto de textos com o caminho de cada uma ("questionario.legenda")
function folhas(valor: unknown, caminho = ""): [string, string][] {
  if (typeof valor === "string") return [[caminho, valor]];
  if (Array.isArray(valor)) return valor.flatMap((item, posicao) => folhas(item, `${caminho}[${posicao}]`));
  if (typeof valor === "object" && valor !== null) {
    return Object.entries(valor).flatMap(([chave, item]) => folhas(item, caminho ? `${caminho}.${chave}` : chave));
  }
  return [];
}

const marcadores = (texto: string) => [...texto.matchAll(/\{(\w+)\}/g)].map((encontro) => encontro[1]).sort();

describe("textos das telas", () => {
  const referencia = new Map(folhas(textosDoIdioma("pt")));

  it.each(IDIOMAS.map((idioma) => idioma.codigo))("%s não tem texto vazio e usa os mesmos {marcadores} do português", (codigo) => {
    for (const [caminho, texto] of folhas(textosDoIdioma(codigo))) {
      expect(texto.trim(), caminho).not.toBe("");
      // As formas de plural (one, few…) variam por idioma; comparam-se com a forma "other" do português
      const base = referencia.get(caminho) ?? referencia.get(caminho.replace(/\.\w+$/, ".other"));
      expect(base, caminho).toBeDefined();
      expect(marcadores(texto), caminho).toEqual(marcadores(base!));
    }
  });

  it("o nome acessível de cada círculo diz a posição e o polo, em cada idioma", () => {
    const { questionario } = textosDoIdioma("es");
    expect(formatar(questionario.posicao, { p: 2, termo: "agradable" })).toBe("2 de 7, más cerca de agradable");
    expect(formatar(textosDoIdioma("pt").questionario.posicao, { p: 6, termo: "Agradável" })).toBe("6 de 7, mais perto de Agradável");
  });
});

describe("plural e lista", () => {
  it("usa a forma do idioma e cai em other quando o idioma não tem a forma", () => {
    const { faltam } = textosDoIdioma("pt").questionario;
    expect(plural(faltam, 1, "pt-BR")).toBe("Falta 1 item");
    expect(plural(faltam, 3, "pt-BR")).toBe("Faltam 3 itens");
    expect(plural(textosDoIdioma("ru").questionario.faltam, 2, "ru")).toBe("Без ответа: 2");
  });

  it("junta os números como o idioma junta uma lista", () => {
    expect(listaDeNumeros([3, 7, 12], "pt-BR")).toBe("3, 7 e 12");
    expect(listaDeNumeros([3, 7, 12], "en")).toBe("3, 7, and 12");
  });
});

describe("negociarIdioma", () => {
  it("escolhe o primeiro dos 37 pela ordem de preferência do navegador", () => {
    expect(negociarIdioma("es-MX,es;q=0.9,en;q=0.8")).toBe("es");
    expect(negociarIdioma("xx,de;q=0.5,fr;q=0.9")).toBe("fr");
    expect(negociarIdioma("pt-PT")).toBe("pt");
    expect(negociarIdioma("zh-TW,zh;q=0.9")).toBe("zh");
  });

  it("aceita códigos antigos e cai no português quando não há nenhum dos 37", () => {
    expect(negociarIdioma("no")).toBe("nb");
    expect(negociarIdioma("iw-IL")).toBe("he");
    expect(negociarIdioma("sw,xh")).toBe("pt");
    expect(negociarIdioma("")).toBe("pt");
    expect(negociarIdioma(null)).toBe("pt");
    expect(negociarIdioma("en;q=0")).toBe("pt");
  });

  it("dá o lang do <html> de cada idioma", () => {
    expect(infoIdioma("pt").lang).toBe("pt-BR");
    expect(infoIdioma("zh").lang).toBe("zh-Hans");
    expect(infoIdioma("ar")).toMatchObject({ lang: "ar", direcao: "rtl", nome: "العربية" });
  });
});
