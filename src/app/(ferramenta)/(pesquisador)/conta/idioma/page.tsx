import { Check } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import formulario from "@/componentes/formulario/formulario.module.css";
import { ehIdioma, IDIOMA_PADRAO, IDIOMAS, infoIdioma, type InfoIdioma } from "@/idiomas";
import { exigirPesquisador } from "@/lib/sessao";
import { FaixaCabecalho } from "../../FaixaCabecalho";
import estilos from "../../pesquisador.module.css";
import { salvarIdioma } from "../acoes";
import conta from "../conta.module.css";
import { nomeDoIdiomaEm } from "@/traducao/nucleo";
import { tradutor } from "@/traducao/servidor";
import { BotaoEnvio } from "@/componentes/formulario/BotaoEnvio";

export async function generateMetadata(): Promise<Metadata> {
  const t = await tradutor();
  return { title: t("Idioma · Minha conta · Ferramenta UEQ") };
}

// Os 37 idiomas oficiais do UEQ, cada um pelo próprio nome (endônimo) e pelo nome em português.
// O português é o padrão; trocar aqui muda a ferramenta inteira e o idioma dos estudos novos
export default async function PaginaIdioma() {
  const t = await tradutor();
  const pesquisador = await exigirPesquisador();
  const atual = ehIdioma(pesquisador.idioma) ? pesquisador.idioma : IDIOMA_PADRAO;
  // Cada idioma pelo próprio nome e, ao lado, pelo nome no idioma em que a ferramenta está
  const { lang: interfaceLang, direcao: interfaceDir } = infoIdioma(atual);
  const nomeNaInterface = (idioma: InfoIdioma) =>
    atual === IDIOMA_PADRAO ? idioma.nomeEmPortugues : (nomeDoIdiomaEm(idioma.lang, interfaceLang) ?? idioma.nomeEmPortugues);
  return (
    <>
      <FaixaCabecalho
        titulo={t("Idioma")}
        ajuda="conta"
        migalha={<Link href="/conta">{t("Minha conta")}</Link>}
        descricao={t("O idioma da ferramenta e o idioma padrão dos estudos que você cria. Quem responde pode trocar o idioma do questionário a qualquer momento.")}
      />
      <div className={estilos.conteudo}>
        <form action={salvarIdioma} className={conta.formularioIdioma}>
          <fieldset className={formulario.grupoOpcoes}>
            <legend>{t("Escolha o idioma")}</legend>
            <div className={conta.listaIdiomas}>
              {IDIOMAS.map((idioma) => (
                <label key={idioma.codigo} className={formulario.opcao} lang={idioma.lang} dir={idioma.direcao}>
                  <input type="radio" name="idioma" value={idioma.codigo} defaultChecked={idioma.codigo === atual} />
                  <span>
                    {idioma.nome}
                    {idioma.nome !== nomeNaInterface(idioma) && (
                      <span className={formulario.opcaoDetalhe} lang={interfaceLang} dir={interfaceDir}>
                        {" "}
                        · {nomeNaInterface(idioma)}
                      </span>
                    )}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <BotaoEnvio
            textoEnviando={t("Salvando…")}
            icone={<Check size={18} strokeWidth={1.5} aria-hidden="true" className={formulario.icone} />}
            className={`${formulario.botao} ${formulario.primario} ${conta.alinharInicio}`}
          >
            {t("Salvar idioma")}
          </BotaoEnvio>
        </form>
      </div>
    </>
  );
}
