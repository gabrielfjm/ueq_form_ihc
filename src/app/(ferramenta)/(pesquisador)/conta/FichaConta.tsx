import estilos from "./conta.module.css";

type Propriedades = {
  estudos: number;
  detalheEstudos: string;
  respostas: number;
  criadaEm: string;
};

// docs/design.md, Layout: tela larga em duas colunas, conteúdo e ficha lateral
export function FichaConta({ estudos, detalheEstudos, respostas, criadaEm }: Propriedades) {
  return (
    <aside aria-labelledby="titulo-resumo" className={estilos.ficha}>
      <h2 id="titulo-resumo" className={estilos.fichaTitulo}>
        Resumo da conta
      </h2>
      <dl className={estilos.fichaLista}>
        <div>
          <dt>Estudos</dt>
          <dd>
            <span className={estilos.numeroGrande}>{estudos}</span>
            <span className={estilos.detalhe}>{detalheEstudos}</span>
          </dd>
        </div>
        <div>
          <dt>Respostas coletadas</dt>
          <dd>
            <span className={estilos.numeroGrande}>{respostas}</span>
            <span className={estilos.detalhe}>somando todos os estudos</span>
          </dd>
        </div>
        <div>
          <dt>Conta criada em</dt>
          <dd className={estilos.numero}>{criadaEm}</dd>
        </div>
        <div className={estilos.fichaUltimo}>
          <dt>Seus dados</dt>
          <dd className={estilos.detalhe}>
            Guardamos só nome, e-mail e a senha criptografada. As respostas dos participantes são anônimas.
          </dd>
        </div>
      </dl>
    </aside>
  );
}
