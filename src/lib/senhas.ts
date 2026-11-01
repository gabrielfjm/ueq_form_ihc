import "server-only";
import bcrypt from "bcryptjs";

// Senhas só como hash bcrypt (LGPD, art. 46). Custo 12: cerca de 250 ms por tentativa, o que torna
// ataque de força bruta caro mesmo com o banco copiado. Hashes antigos (custo 10) sobem para 12 no próximo login
export const CUSTO_BCRYPT = 12;

// Hash de uma senha que ninguém tem: quando o e-mail não existe, o login compara contra ele e leva o
// mesmo tempo de quando existe. Assim o tempo de resposta não revela quais e-mails têm conta
const HASH_FICTICIO = bcrypt.hashSync("senha-que-ninguem-tem", CUSTO_BCRYPT);

export function gerarHash(senha: string): Promise<string> {
  return bcrypt.hash(senha, CUSTO_BCRYPT);
}

export async function conferirSenha(senha: string, hash: string | null | undefined): Promise<boolean> {
  const confere = await bcrypt.compare(senha, hash ?? HASH_FICTICIO);
  return Boolean(hash) && confere;
}

export function precisaNovoHash(hash: string): boolean {
  return bcrypt.getRounds(hash) < CUSTO_BCRYPT;
}
