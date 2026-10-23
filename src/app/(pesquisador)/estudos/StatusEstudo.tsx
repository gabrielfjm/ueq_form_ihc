import type { StatusEstudo as Status } from "@/generated/prisma/enums";
import { STATUS } from "@/lib/status-estudo";
import estilos from "./estudos.module.css";

const PONTO = { RASCUNHO: estilos.pontoRascunho, ABERTO: estilos.pontoAberto, ENCERRADO: estilos.pontoEncerrado };

// docs/design.md, Cores: status é texto em negrito com um ponto antes, não badge colorido.
// O texto sempre diz o estado; o ponto só reforça
export function StatusEstudo({ status, comConsequencia = false }: { status: Status; comConsequencia?: boolean }) {
  const { nome, consequencia } = STATUS[status];
  return (
    <span className={estilos.status}>
      <span aria-hidden="true" className={`${estilos.ponto} ${PONTO[status]}`} />
      {comConsequencia ? `${nome} · ${consequencia}` : nome}
    </span>
  );
}
