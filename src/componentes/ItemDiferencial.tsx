import { formatar } from "@/idiomas/formatar";
import type { TextosParticipante } from "@/idiomas/tipos";
import estilos from "./ItemDiferencial.module.css";

const POSICOES = [1, 2, 3, 4, 5, 6, 7] as const;

type Propriedades = {
  numero: number;
  total: number;
  termoEsquerdo: string;
  termoDireito: string;
  valor: number | undefined;
  faltando: boolean;
  aoMarcar: (valor: number) => void;
  textos: Pick<TextosParticipante["questionario"], "legenda" | "naoRespondido" | "posicao" | "centro">;
  direcao: "ltr" | "rtl";
};

// docs/ihc.md §4.1: o nome acessível diz a posição e o polo mais próximo
function nomeDaPosicao(posicao: number, termoEsquerdo: string, termoDireito: string, textos: Propriedades["textos"]) {
  if (posicao === 4) return textos.centro;
  return formatar(textos.posicao, { p: posicao, termo: posicao < 4 ? termoEsquerdo : termoDireito });
}

// Um item do diferencial semântico. As 7 posições são idênticas entre si e nenhuma vem marcada
// (docs/ihc.md §3.1 e §3.2): qualquer diferença visual entre elas contaminaria a medida
export function ItemDiferencial({
  numero,
  total,
  termoEsquerdo,
  termoDireito,
  valor,
  faltando,
  aoMarcar,
  textos,
  direcao,
}: Propriedades) {
  const idErro = `item-${numero}-erro`;
  return (
    <fieldset
      id={`item-${numero}`}
      className={faltando ? `${estilos.item} ${estilos.faltando}` : estilos.item}
      aria-describedby={faltando ? idErro : undefined}
    >
      <legend className={estilos.legenda}>
        {formatar(textos.legenda, { n: numero, total, esquerdo: termoEsquerdo, direito: termoDireito })}
      </legend>
      {faltando && (
        <p id={idErro} className={estilos.erro}>
          {textos.naoRespondido}
        </p>
      )}
      {/* A linha fica sempre da esquerda para a direita, de 1 a 7, como nos PDFs oficiais em árabe, hebraico
          e persa: o termo da esquerda continua à esquerda. Só o texto de cada termo segue a direção do idioma */}
      <div className={estilos.linha} dir="ltr">
        {/* Os termos já estão na legenda; aqui ficam só para quem vê, sem repetir no leitor de tela */}
        <span aria-hidden="true" dir={direcao} className={estilos.termoEsquerdo}>
          {termoEsquerdo}
        </span>
        <span className={estilos.circulos}>
          {POSICOES.map((posicao) => (
            <label key={posicao} className={estilos.alvo}>
              <input
                type="radio"
                name={`item-${numero}`}
                value={posicao}
                className={estilos.circulo}
                checked={valor === posicao}
                onChange={() => aoMarcar(posicao)}
                aria-label={nomeDaPosicao(posicao, termoEsquerdo, termoDireito, textos)}
              />
            </label>
          ))}
        </span>
        <span aria-hidden="true" dir={direcao} className={estilos.termoDireito}>
          {termoDireito}
        </span>
      </div>
    </fieldset>
  );
}
