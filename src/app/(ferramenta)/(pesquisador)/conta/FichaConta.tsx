import { Download, ShieldCheck } from "lucide-react";
import Link from "next/link";
import formulario from "@/componentes/formulario/formulario.module.css";
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
            Guardamos só nome, e-mail e a senha como hash, que não dá para desfazer. As respostas dos participantes são
            anônimas.
          </dd>
          {/* LGPD, art. 18: ver, levar e entender os próprios dados sem pedir a ninguém */}
          <dd className={estilos.linksDados}>
            <a href="/api/conta/dados" download className={formulario.linkAcao}>
              <Download size={18} strokeWidth={1.5} aria-hidden="true" />
              <span>Baixar meus dados</span>
            </a>
            <Link href="/privacidade" className={formulario.linkAcao}>
              <ShieldCheck size={18} strokeWidth={1.5} aria-hidden="true" />
              <span>Política de privacidade</span>
            </Link>
          </dd>
        </div>
      </dl>
    </aside>
  );
}
