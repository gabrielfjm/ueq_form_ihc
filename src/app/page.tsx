import estilos from "./page.module.css";

export default function PaginaInicial() {
  return (
    <main id="conteudo" tabIndex={-1} className={estilos.pagina}>
      <h1 className={estilos.titulo}>Ferramenta UEQ</h1>
      <p className={estilos.descricao}>
        Conduza estudos de avaliação de experiência do usuário com o User Experience Questionnaire,
        do cadastro do estudo à exportação dos dados.
      </p>
    </main>
  );
}
