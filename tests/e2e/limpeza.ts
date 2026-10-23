import { apagarContasDeTeste } from "./contas";

// Roda uma vez, depois de todos os workers: apagar no afterAll de cada arquivo derrubaria
// contas que outro worker ainda está usando
export default apagarContasDeTeste;
