import { describe, expect, it } from "vitest";
import protocolo from "../../../data/protocolo.json";
import { carregarItens } from "../../ueq/__tests__/carregar";
import { escoresPorParticipante, ESCALAS, media } from "../../ueq";
import { gerarValores, sorteador, type PerfilVersao } from "../cenarios/respostas-sinteticas";

const itens = carregarItens();
const parametros = protocolo.inconsistencia;
const perfil: PerfilVersao = {
  atratividade: 1.5,
  perspicuidade: 1.8,
  eficiencia: 1.2,
  confiabilidade: 0.6,
  estimulacao: -0.4,
  novidade: -1.2,
};

describe("respostas sintéticas dos cenários de demonstração", () => {
  it("dá 26 valores de 1 a 7", () => {
    const { valores } = gerarValores(sorteador(1), perfil, itens, "normal", parametros);
    expect(valores).toHaveLength(26);
    expect(valores.every((valor) => Number.isInteger(valor) && valor >= 1 && valor <= 7)).toBe(true);
  });

  it("quem respondeu com atenção nunca sai suspeito; aleatória e iguais sempre saem", () => {
    const sorteio = sorteador(7);
    for (let i = 0; i < 40; i++) {
      expect(gerarValores(sorteio, perfil, itens, "normal", parametros).suspeita).toBe(false);
      expect(gerarValores(sorteio, perfil, itens, "aleatoria", parametros).suspeita).toBe(true);
      expect(gerarValores(sorteio, perfil, itens, "iguais", parametros).suspeita).toBe(true);
    }
  });

  it("a média de cada escala fica perto do perfil, respeitando a polaridade dos itens", () => {
    const sorteio = sorteador(42);
    const escores = Array.from({ length: 200 }, () =>
      escoresPorParticipante(gerarValores(sorteio, perfil, itens, "normal", parametros).valores, itens),
    );
    for (const escala of ESCALAS) {
      const observada = media(escores.map((escore) => escore[escala])) ?? 0;
      expect(Math.abs(observada - perfil[escala])).toBeLessThan(0.45);
    }
  });

  it("a mesma semente gera as mesmas respostas", () => {
    const a = gerarValores(sorteador(2026), perfil, itens, "normal", parametros);
    const b = gerarValores(sorteador(2026), perfil, itens, "normal", parametros);
    expect(a).toEqual(b);
  });
});
