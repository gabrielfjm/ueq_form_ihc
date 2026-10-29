"use client";

import { CircleMinus } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Fragment, useOptimistic, useState, useTransition } from "react";
import { useAnunciar } from "@/componentes/Avisos";
import formulario from "@/componentes/formulario/formulario.module.css";
import { alterarInclusao, tirarSuspeitasDaAnalise } from "./acoes";
import estilos from "./respostas.module.css";

export type LinhaParticipacao = {
  id: string;
  quando: string;
  versao: string;
  inconsistentes: number;
  iguais: number;
  suspeita: boolean;
  motivo: string | null;
  incluidaNaAnalise: boolean;
  escalas: { nome: string; amplitude: number; inconsistente: boolean }[];
};

type Propriedades = {
  estudoId: string;
  linhas: LinhaParticipacao[];
  total: number;
  soSuspeitas: boolean;
  limiteIguais: number;
};

export function TabelaParticipacoes({ estudoId, linhas, total, soSuspeitas, limiteIguais }: Propriedades) {
  const anunciar = useAnunciar();
  const router = useRouter();
  const caminho = usePathname();
  const [aberta, setAberta] = useState<string | null>(null);
  const [, iniciar] = useTransition();
  const [filtrando, filtrarOtimista] = useOptimistic(soSuspeitas);
  // A caixa muda na hora; o servidor confirma e a página recarrega com o valor gravado
  const [linhasVisiveis, marcarOtimista] = useOptimistic(linhas, (atuais, mudanca: { id: string; incluida: boolean }) =>
    atuais.map((linha) => (linha.id === mudanca.id ? { ...linha, incluidaNaAnalise: mudanca.incluida } : linha)),
  );

  function mudarInclusao(linha: LinhaParticipacao, incluida: boolean) {
    iniciar(async () => {
      marcarOtimista({ id: linha.id, incluida });
      const resultado = await alterarInclusao(estudoId, linha.id, incluida);
      anunciar(resultado.sucesso ?? resultado.erro ?? "");
    });
  }

  function tirarSuspeitas() {
    iniciar(async () => {
      const resultado = await tirarSuspeitasDaAnalise(estudoId);
      anunciar(resultado.sucesso ?? resultado.erro ?? "");
    });
  }

  return (
    <>
      <div className={estilos.cabecalhoLista}>
        <h2 id="titulo-lista" className={estilos.titulo}>
          Participações
        </h2>
        <div className={estilos.filtros}>
          {/* O filtro fica na URL, como os do painel (docs/ihc.md §4.3, Nielsen 3) */}
          <label className={estilos.filtro}>
            <input
              type="checkbox"
              className={estilos.caixa}
              checked={filtrando}
              onChange={(evento) => {
                const marcado = evento.target.checked;
                iniciar(() => {
                  filtrarOtimista(marcado);
                  router.replace(`${caminho}${marcado ? "?suspeitas=1" : ""}` as Route, { scroll: false });
                });
              }}
            />
            Mostrar só suspeitas
          </label>
          <button type="button" className={`${formulario.botao} ${formulario.secundario}`} onClick={tirarSuspeitas}>
            <CircleMinus size={18} strokeWidth={1.5} aria-hidden="true" />
            <span>Tirar suspeitas da análise</span>
          </button>
        </div>
      </div>
      {/* Em tela estreita a tabela rola dentro da caixa; tabIndex deixa rolar pelo teclado (WCAG 2.1.1) */}
      <div className={estilos.rolagem} tabIndex={0} role="region" aria-labelledby="titulo-lista">
        <table className={estilos.tabela}>
          <caption>Da mais recente para a mais antiga</caption>
          <thead>
            <tr>
              <th scope="col">Concluída em</th>
              <th scope="col">Versão</th>
              <th scope="col" className={estilos.direita}>Inconsistentes</th>
              <th scope="col" className={estilos.direita}>Iguais</th>
              <th scope="col">Situação</th>
              <th scope="col">Na análise</th>
              <th scope="col">
                <span className="visualmente-oculto">Detalhes</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {linhasVisiveis.map((linha) => {
              const estaAberta = aberta === linha.id;
              const idDetalhe = `escalas-${linha.id}`;
              return (
                <Fragment key={linha.id}>
                  <tr className={estaAberta ? estilos.aberta : undefined}>
                    <th scope="row" className={estilos.dataHora}>
                      {linha.quando}
                    </th>
                    <td>{linha.versao}</td>
                    <td className={`${estilos.numero} ${estilos.direita}`}>{linha.inconsistentes}</td>
                    <td className={`${estilos.numero} ${estilos.direita}`}>{linha.iguais}</td>
                    <td className={linha.suspeita ? estilos.suspeita : undefined}>
                      {linha.suspeita ? "Suspeita" : "—"}
                      {linha.suspeita && linha.motivo && <span className={estilos.motivo}>{linha.motivo}</span>}
                    </td>
                    <td>
                      {/* Desmarcar não apaga nada: só tira a resposta do cálculo (docs/ueq-protocolo.md, seção 7) */}
                      <input
                        type="checkbox"
                        className={estilos.caixa}
                        checked={linha.incluidaNaAnalise}
                        onChange={(evento) => mudarInclusao(linha, evento.target.checked)}
                        aria-label={`Participação de ${linha.quando} na análise`}
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        className={estilos.botaoTexto}
                        aria-expanded={estaAberta}
                        aria-controls={idDetalhe}
                        aria-label={`${estaAberta ? "Ocultar" : "Ver"} escalas da participação de ${linha.quando}`}
                        onClick={() => setAberta(estaAberta ? null : linha.id)}
                      >
                        {estaAberta ? "Ocultar" : "Ver escalas"}
                      </button>
                    </td>
                  </tr>
                  <tr id={idDetalhe} hidden={!estaAberta} className={`${estilos.detalhe} ${estilos.aberta}`}>
                    <td colSpan={7}>
                      <ul className={estilos.escalas} aria-label={`Amplitude por escala na participação de ${linha.quando}`}>
                        {linha.escalas.map((escala) => (
                          <li
                            key={escala.nome}
                            className={escala.inconsistente ? `${estilos.escala} ${estilos.escalaInconsistente}` : estilos.escala}
                          >
                            <span className={estilos.escalaNome}>{escala.nome}</span>
                            <span className={estilos.escalaValor}>
                              <span className={estilos.amplitude}>{escala.amplitude}</span>
                              <span className={estilos.situacaoEscala}>{escala.inconsistente ? "inconsistente" : "ok"}</span>
                            </span>
                          </li>
                        ))}
                      </ul>
                      <p className={estilos.iguais}>
                        A mesma posição foi marcada em {linha.iguais} dos 26 itens
                        {linha.iguais > limiteIguais ? `, acima do limite de ${limiteIguais}.` : "."}
                      </p>
                    </td>
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      {soSuspeitas && (
        <p className={estilos.rodapeLista}>
          Mostrando {linhas.length} de {total}. <Link href={caminho as Route}>Mostrar todas</Link>
        </p>
      )}
    </>
  );
}
