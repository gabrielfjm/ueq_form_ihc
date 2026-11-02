import type { Route } from "next";
import Link from "next/link";
import formulario from "@/componentes/formulario/formulario.module.css";
import type { estudoDoPesquisador } from "@/lib/estudos";
import { intervalo } from "@/lib/periodo";
import { juntarComE, plural } from "@/lib/texto";
import { AcoesEstudo } from "./AcoesEstudo";
import { BotaoColeta } from "./BotaoColeta";
import estilos from "./estudo.module.css";
import pagina from "./pagina-estudo.module.css";
import { tradutor } from "@/traducao/servidor";
import { m } from "@/traducao/nucleo";


type Propriedades = {
  estudo: Awaited<ReturnType<typeof estudoDoPesquisador>>;
  endereco: string;
  avisoExclusao: { destaque: string; complemento: string };
};

const CENTROS = [24, 73, 122, 172, 221, 270, 320];

// Protótipo r4b: antes de abrir a coleta, a página abre com o estado vazio e o que conferir
export async function VisaoRascunho({ estudo, endereco, avisoExclusao }: Propriedades) {
  const t = await tradutor();
  const editar = `/estudos/${estudo.id}/editar` as Route;
  const nomesVersoes = juntarComE(estudo.versoes.map((versao) => versao.nome));
  const conferir = [
    { titulo: m("Objetivo"), detalhe: t("É o que o participante lê no termo de consentimento.") },
    {
      titulo: plural(estudo.versoes.length, t("versão"), t("versões")),
      detalhe: t("{nomesVersoes}. Depois da primeira resposta, versões com respostas não podem ser removidas.", { nomesVersoes: nomesVersoes }),
    },
    { titulo: t("Período"), detalhe: t("De {intervalo}.", { intervalo: intervalo(estudo.dataInicio, estudo.dataFim) }) },
  ];

  return (
    <>
      <section aria-labelledby="titulo-vazio" className={pagina.vazio}>
        <svg viewBox="0 0 344 48" aria-hidden="true">
          <line x1="0" y1="24" x2="344" y2="24" />
          {CENTROS.map((cx) => (
            <circle key={cx} cx={cx} cy="24" r="16" />
          ))}
        </svg>
        <h2 id="titulo-vazio" className={pagina.vazioTitulo}>
          {t("Nenhuma resposta ainda.")}
        </h2>
        <p className={pagina.vazioTexto}>
          {t("Abra a coleta e compartilhe o link para começar. Enquanto o estudo estiver em rascunho, quem abrir o link verá “Este estudo ainda não está aberto”.")}
        </p>
        <div className={pagina.vazioAcoes}>
          {estudo.permissoes.editar && (
            <BotaoColeta
              estudoId={estudo.id}
              acao="abrir"
              className={`${formulario.botao} ${formulario.primario} ${pagina.abrir}`}
            />
          )}
          <code className={pagina.enderecoSolto}>{t(endereco)}</code>
        </div>
      </section>

      <section aria-labelledby="secao-conferir" className={`${estilos.secao} ${estilos.secaoPrimeira}`}>
        <div className={estilos.secaoTitulo}>
          <span className={estilos.secaoNumero}>01</span>
          <h2 id="secao-conferir" className={estilos.secaoNome}>
            {t("Antes de abrir, confira")}
          </h2>
        </div>
        <ul className={pagina.conferir}>
          {conferir.map((item, posicao) => (
            <li key={item.titulo}>
              <span className={pagina.letra} aria-hidden="true">
                {"abc"[posicao]}
              </span>
              <span>
                <strong>{t(item.titulo)}</strong>
                <span className={pagina.detalhe}>{t(item.detalhe)}</span>
              </span>
              {estudo.permissoes.editar && (
                <Link href={editar} aria-label={t("Revisar {v}", { v: item.titulo.toLowerCase() })}>
                  {t("Revisar")}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </section>

      {estudo.permissoes.editar && (
        <section aria-labelledby="secao-acoes" className={estilos.secao}>
          <div className={estilos.secaoTitulo}>
            <span className={estilos.secaoNumero}>02</span>
            <h2 id="secao-acoes" className={estilos.secaoNome}>
              {t("Ações")}
            </h2>
          </div>
          <AcoesEstudo
            estudoId={estudo.id}
            avisoExclusao={avisoExclusao}
            podeEditar={estudo.permissoes.editar}
            podeExcluir={estudo.permissoes.gerenciar}
          />
        </section>
      )}
    </>
  );
}
