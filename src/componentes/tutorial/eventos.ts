// O tour guiado mora no layout da área do pesquisador; qualquer botão (o "Rever o tour guiado" da ajuda,
// por exemplo) pede para ele começar por este evento, sem precisar de contexto compartilhado
export const EVENTO_INICIAR_TOUR = "ueq:iniciar-tour";

export function iniciarTour() {
  window.dispatchEvent(new Event(EVENTO_INICIAR_TOUR));
}
