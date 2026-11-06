import { Languages } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import formulario from "@/componentes/formulario/formulario.module.css";
import { IDIOMA_PADRAO, IDIOMAS } from "@/idiomas";
import { exigirAdministrador } from "@/lib/administracao";
import { banco } from "@/lib/banco";
import { MODELO_TRADUCAO, traducaoAutomaticaLigada } from "@/traducao/claude";
import { coberturaDoCatalogo, tradutor } from "@/traducao/servidor";
import { FaixaCabecalho } from "../../FaixaCabecalho";
import { traduzirInterface } from "../acoes";
import estilos from "../administracao.module.css";
import { BotaoEnvio } from "@/componentes/formulario/BotaoEnvio";

// A tradução de um idioma inteiro roda dentro da ação do botão; dá tempo para os lotes da API
export const maxDuration = 300;

export async function generateMetadata(): Promise<Metadata> {
  const t = await tradutor();
  return { title: t("Idiomas · Administração · Ferramenta UEQ") };
}

// Quanto da interface cada um dos 37 idiomas já tem. A tradução acontece sozinha na primeira visita de
// quem usa o idioma; o botão adianta isso, para a primeira pessoa já ver a ferramenta traduzida
export default async function PaginaIdiomas({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const t = await tradutor();
  await exigirAdministrador();
  const { traduzido } = await searchParams;
  const [{ total, porIdioma }, emUso] = await Promise.all([
    coberturaDoCatalogo(),
    banco.pesquisador.groupBy({ by: ["idioma"], _count: true }),
  ]);
  const contas = new Map(emUso.map((grupo) => [grupo.idioma, grupo._count]));
  const ligada = traducaoAutomaticaLigada();
  const idiomas = IDIOMAS.filter((idioma) => idioma.codigo !== IDIOMA_PADRAO);

  return (
    <>
      <FaixaCabecalho
        titulo={t("Idiomas")}
        ajuda="administracao"
        migalha={<Link href="/administracao">{t("Administração")}</Link>}
        descricao={t("A ferramenta é escrita em português e traduzida para os outros 36 idiomas do UEQ pela API do Claude.")}
      />
      <div className={estilos.conteudo}>
        <dl className={estilos.situacao}>
          <div>
            <dt>{t("Tradução automática (API do Claude)")}</dt>
            <dd className={ligada ? estilos.ativo : estilos.inativo}>
              {ligada
                ? t("Ligada, com o modelo {modelo}. Cada texto é traduzido uma vez e fica guardado no banco.", { modelo: MODELO_TRADUCAO })
                : t("Desligada. Configure ANTHROPIC_API_KEY na Vercel e faça um novo deploy. Até lá, a ferramenta aparece em português para todos.")}
            </dd>
          </div>
          <div>
            <dt>{t("Textos da interface")}</dt>
            <dd>{t("{total} textos, contando páginas, ajuda, avisos e e-mails.", { total })}</dd>
          </div>
        </dl>
        {typeof traduzido === "string" && (
          <p role="status" className={estilos.avisoIdioma}>
            {t("Tradução concluída: {idioma}.", { idioma: IDIOMAS.find((idioma) => idioma.codigo === traduzido)?.nome ?? traduzido })}
          </p>
        )}
        <table className={estilos.tabelaIdiomas}>
          <caption className="visualmente-oculto">{t("Tradução da interface por idioma")}</caption>
          <thead>
            <tr>
              <th scope="col">{t("Idioma")}</th>
              <th scope="col">{t("Contas")}</th>
              <th scope="col">{t("Traduzido")}</th>
              <th scope="col">
                <span className="visualmente-oculto">{t("Ações")}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {idiomas.map((idioma) => {
              const prontos = porIdioma.get(idioma.codigo) ?? 0;
              const parcela = total === 0 ? 1 : prontos / total;
              return (
                <tr key={idioma.codigo}>
                  <th scope="row">
                    <span lang={idioma.lang} dir={idioma.direcao}>
                      {idioma.nome}
                    </span>
                  </th>
                  <td>{contas.get(idioma.codigo) ?? 0}</td>
                  <td>{`${Math.floor(parcela * 100)}%`}</td>
                  <td>
                    {ligada && parcela < 1 && (
                      <form action={traduzirInterface.bind(null, idioma.codigo)}>
                        <BotaoEnvio
                          textoEnviando={t("Traduzindo…")}
                          icone={<Languages size={18} strokeWidth={1.5} aria-hidden="true" className={formulario.icone} />}
                          className={`${formulario.botao} ${formulario.secundario}`}
                        >
                          {t("Traduzir agora")}
                          <span className="visualmente-oculto"> {idioma.nome}</span>
                        </BotaoEnvio>
                      </form>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
