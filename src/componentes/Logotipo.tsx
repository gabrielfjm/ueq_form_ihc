import estilos from "./Logotipo.module.css";

const CENTROS = [5, 13.5, 22, 30.5, 39, 47.5, 56];

// A fileira de 7 marcações do diferencial semântico é o único motivo visual (docs/design.md, A ideia)
export function Logotipo() {
  return (
    <span className={estilos.logotipo}>
      <svg width="62" height="10" viewBox="0 0 62 10" aria-hidden="true" className={estilos.marcacoes}>
        {CENTROS.map((cx, posicao) =>
          posicao === 4 ? (
            <circle key={cx} cx={cx} cy="5" r="3.5" className={estilos.marcada} />
          ) : (
            <circle key={cx} cx={cx} cy="5" r="3.5" className={estilos.vazia} />
          ),
        )}
      </svg>
      <span className={estilos.nome}>Ferramenta UEQ</span>
    </span>
  );
}
