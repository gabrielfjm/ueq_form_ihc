import estilos from "./acesso.module.css";

// docs/ueq-protocolo.md, seção 1: 6 itens em Atratividade, 4 nas outras escalas
const ESCALAS_DO_UEQ = [
  ["Atratividade", 6],
  ["Perspicuidade", 4],
  ["Eficiência", 4],
  ["Confiabilidade", 4],
  ["Estimulação", 4],
  ["Novidade", 4],
] as const;

const CENTROS_GRANDES = [24, 73, 122, 172, 221, 270, 320];

const PASSOS = [
  ["Crie o estudo", "Título, objetivo, período e as versões do produto que serão comparadas."],
  ["Envie o link", "Os participantes respondem sem conta, pelo celular ou computador."],
  ["Acompanhe a coleta", "Médias, intervalos de confiança, alfa e benchmark por escala, e as respostas suspeitas."],
  ["Exporte os dados", "CSV no formato da UEQ Data Analysis Tool, para conferir os cálculos."],
] as const;

export function PainelInstrumento() {
  return (
    <aside aria-label="Sobre o instrumento" className={estilos.painel}>
      <svg viewBox="0 0 344 48" className={estilos.marcacoesGrandes} aria-hidden="true">
        <line x1="0" y1="24" x2="344" y2="24" />
        {CENTROS_GRANDES.map((cx, posicao) => (
          <circle key={cx} cx={cx} cy="24" r="17" className={posicao === 4 ? estilos.marcada : estilos.vazia} />
        ))}
      </svg>
      <p className={estilos.painelTitulo}>26 pares de palavras, 6 escalas e um link para os participantes.</p>
      <div className={estilos.escalas}>
        <p className={estilos.escalasTitulo}>Escalas do UEQ</p>
        {ESCALAS_DO_UEQ.map(([nome, itens]) => (
          <div key={nome} className={estilos.escala}>
            <span>{nome}</span>
            <span className={estilos.itens}>{itens} itens</span>
          </div>
        ))}
      </div>
    </aside>
  );
}

export function PainelPercurso() {
  return (
    <aside aria-labelledby="titulo-percurso" className={`${estilos.painel} ${estilos.painelPercurso}`}>
      <h2 id="titulo-percurso" className={`${estilos.painelTitulo} ${estilos.tituloPercurso}`}>
        Do cadastro do estudo à planilha oficial.
      </h2>
      <ol className={estilos.passos}>
        {PASSOS.map(([titulo, texto], posicao) => (
          <li key={titulo} className={estilos.passo}>
            <span className={estilos.passoNumero}>{String(posicao + 1).padStart(2, "0")}</span>
            <span>
              <strong>{titulo}</strong>
              <br />
              <span className={estilos.passoTexto}>{texto}</span>
            </span>
          </li>
        ))}
      </ol>
    </aside>
  );
}
