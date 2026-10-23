import { describe, expect, it } from "vitest";
import { versaoComMenosRespostas } from "../balanceamento";

describe("versaoComMenosRespostas", () => {
  it("escolhe a versão com menos respostas concluídas", () => {
    const escolhida = versaoComMenosRespostas([
      { id: "a", ordem: 1, respostas: 18 },
      { id: "b", ordem: 2, respostas: 16 },
    ]);
    expect(escolhida?.id).toBe("b");
  });

  it("no empate fica com a de menor ordem", () => {
    const escolhida = versaoComMenosRespostas([
      { id: "c", ordem: 3, respostas: 5 },
      { id: "a", ordem: 1, respostas: 5 },
      { id: "b", ordem: 2, respostas: 7 },
    ]);
    expect(escolhida?.id).toBe("a");
  });

  it("com uma versão só, sempre ela", () => {
    expect(versaoComMenosRespostas([{ id: "unica", ordem: 1, respostas: 40 }])?.id).toBe("unica");
  });

  it("sem versões devolve null", () => {
    expect(versaoComMenosRespostas([])).toBeNull();
  });
});
