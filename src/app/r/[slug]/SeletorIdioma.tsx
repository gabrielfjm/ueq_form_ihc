import formulario from "@/componentes/formulario/formulario.module.css";
import { IDIOMAS, type InfoIdioma, type TextosParticipante } from "@/idiomas";
import { escolherIdioma } from "./acoes";
import estilos from "./participante.module.css";

type Propriedades = { slug: string; idioma: InfoIdioma; textos: TextosParticipante["idioma"] };

// Cada idioma aparece pelo próprio nome (endônimo) e com lang, para o leitor de tela pronunciar certo.
// Mudar a seleção não envia nada: só o botão aplica (WCAG 3.2.2, sem mudança de contexto ao escolher)
export function SeletorIdioma({ slug, idioma, textos }: Propriedades) {
  return (
    <form action={escolherIdioma.bind(null, slug)} className={estilos.idioma}>
      <label htmlFor="idioma" className={estilos.idiomaRotulo}>
        {textos.rotulo}
      </label>
      <select id="idioma" name="idioma" defaultValue={idioma.codigo} className={`${formulario.campo} ${estilos.idiomaCampo}`}>
        {IDIOMAS.map((opcao) => (
          <option key={opcao.codigo} value={opcao.codigo} lang={opcao.lang}>
            {opcao.nome}
          </option>
        ))}
      </select>
      <button type="submit" className={`${formulario.botao} ${formulario.secundario}`}>
        {textos.aplicar}
      </button>
      {!idioma.traducaoAprovada && <p className={estilos.idiomaAviso}>{textos.naoAprovada}</p>}
    </form>
  );
}
