import { ArrowRight } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import type { contagemDeRespostas, estudoDoPesquisador } from "@/lib/estudos";
import { plural } from "@/lib/texto";
import { AcoesEstudo } from "./AcoesEstudo";
import { BotaoColeta } from "./BotaoColeta";
import estilos from "./estudo.module.css";
import { LinkPublico } from "./LinkPublico";
import pagina from "./pagina-estudo.module.css";
import { tradutor } from "@/traducao/servidor";

type Propriedades = {
  estudo: Awaited<ReturnType<typeof estudoDoPesquisador>>;
  endereco: string;
  respostas: Awaited<ReturnType<typeof contagemDeRespostas>>;
  avisoExclusao: { destaque: string; complemento: string };
};

async function TituloSecao({ id, numero, children }: { id: string; numero: number; children: string }) {
  const t = await tradutor();
  return (
    <div className={estilos.secaoTitulo}>
      <span className={estilos.secaoNumero}>{t(String(numero).padStart(2, "0"))}</span>
      <h2 id={id} className={estilos.secaoNome}>
        {t(children)}
      </h2>
    </div>
  );
}

// Protótipo r5: coleta aberta ou encerrada
export async function VisaoColeta({ estudo, endereco, respostas, avisoExclusao }: Propriedades) {
  const t = await tradutor();
  // prompts/04-estudos.md: com uma versão só, nada de comparação na interface
  const variasVersoes = estudo.versoes.length > 1;
  const maiorContagem = Math.max(1, ...estudo.versoes.map((versao) => versao._count.participacoes));
  let numero = 0;

  const passos = [
    {
      href: `/estudos/${estudo.id}/resultados`,
      titulo: t("Ver resultados"),
      texto:
        respostas.naAnalise > 0
          ? t("Médias, intervalo de confiança, alfa e benchmark das 6 escalas, com {quantidade}.", { quantidade: plural(respostas.naAnalise, t("resposta"), t("respostas")) })
          : t("As médias das 6 escalas aparecem assim que chegar a primeira resposta."),
    },
    respostas.suspeitas > 0 && {
      href: `/estudos/${estudo.id}/respostas`,
      titulo: t("Revisar respostas suspeitas"),
      texto: t("{quantidade} de forma contraditória. Decida se ficam na análise.", { quantidade: plural(respostas.suspeitas, t("participação respondeu"), t("participações responderam")) }),
    },
  ].filter((passo) => passo !== false);

  return (
    <>
      <section aria-labelledby="secao-link" className={`${estilos.secao} ${estilos.secaoPrimeira}`} data-tutorial="link-coleta">
        <TituloSecao id="secao-link" numero={++numero}>{t("Link para participantes")}</TituloSecao>
        <p className={estilos.texto}>
          {estudo.status === "ABERTO"
            ? t("Envie por e-mail ou mensagem. Quem abrir verá o termo de consentimento antes do questionário.")
            : t("Com a coleta encerrada, quem abrir o link verá “A coleta deste estudo foi encerrada”.")}
        </p>
        <LinkPublico endereco={endereco} />
      </section>

      {variasVersoes && (
        <section aria-labelledby="secao-versoes" className={estilos.secao}>
          <TituloSecao id="secao-versoes" numero={++numero}>{t("Coleta por versão")}</TituloSecao>
          <p className={estilos.texto}>
            {t("Cada pessoa que entra pelo link vai para a versão com menos respostas, para manter o equilíbrio.")}
          </p>
          <table className={pagina.coleta}>
            <caption className="visualmente-oculto">{t("Respostas concluídas por versão")}</caption>
            <thead>
              <tr>
                <th scope="col">{t("Versão")}</th>
                <th scope="col">{t("Respostas")}</th>
              </tr>
            </thead>
            <tbody>
              {estudo.versoes.map((versao) => (
                <tr key={versao.id}>
                  <th scope="row">{t(versao.nome)}</th>
                  <td>
                    <span className={pagina.barra}>
                      <span aria-hidden="true" style={{ width: `${(versao._count.participacoes / maiorContagem) * 75}%` }} />
                      <span className={estilos.numero}>{versao._count.participacoes}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <section aria-labelledby="secao-passos" className={estilos.secao}>
        <TituloSecao id="secao-passos" numero={++numero}>{t("Próximos passos")}</TituloSecao>
        <nav aria-labelledby="secao-passos" className={pagina.passos}>
          {passos.map((passo) => (
            <Link key={passo.href} href={passo.href as Route} className={pagina.passo}>
              <span>
                <span className={pagina.passoTitulo}>{t(passo.titulo)}</span>
                <span className={pagina.passoTexto}>{t(passo.texto)}</span>
              </span>
              <ArrowRight size={24} strokeWidth={1.5} aria-hidden="true" />
            </Link>
          ))}
        </nav>
      </section>

      {estudo.permissoes.editar && (
        <section aria-labelledby="secao-acoes" className={estilos.secao}>
          <TituloSecao id="secao-acoes" numero={++numero}>{t("Ações")}</TituloSecao>
          <AcoesEstudo
            estudoId={estudo.id}
            avisoExclusao={avisoExclusao}
            podeEditar={estudo.permissoes.editar}
            podeExcluir={estudo.permissoes.gerenciar}
            coleta={<BotaoColeta estudoId={estudo.id} acao={estudo.status === "ABERTO" ? "encerrar" : "reabrir"} />}
          />
        </section>
      )}
    </>
  );
}
