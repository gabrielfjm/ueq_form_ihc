import type { StatusEstudo as Status } from "@/generated/prisma/enums";
import { STATUS } from "@/lib/status-estudo";
import { tradutor } from "@/traducao/servidor";
import estilos from "./estudos.module.css";

const PONTO = { RASCUNHO: estilos.pontoRascunho, ABERTO: estilos.pontoAberto, ENCERRADO: estilos.pontoEncerrado };

// docs/design.md, Cores: status é texto em negrito com um ponto antes, não badge colorido.
// O texto sempre diz o estado; o ponto só reforça
export async function StatusEstudo({ status, comConsequencia = false }: { status: Status; comConsequencia?: boolean }) {
  const t = await tradutor();
  const nome = t(STATUS[status].nome);
  const consequencia = t(STATUS[status].consequencia);
  return (
    <span className={estilos.status}>
      <span aria-hidden="true" className={`${estilos.ponto} ${PONTO[status]}`} />
      {comConsequencia ? `${nome} · ${consequencia}` : nome}
    </span>
  );
}
