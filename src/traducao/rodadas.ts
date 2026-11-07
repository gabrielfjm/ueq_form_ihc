// A tradução roda em ordem, para os lotes não escolherem palavras diferentes para a mesma coisa: primeiro o
// glossário do idioma, depois os rótulos curtos e por fim os textos longos, que citam esses rótulos

// Termos que precisam sair iguais em todo o catálogo. O sentido de cada um está nas instruções de claude.ts
export const TERMOS_DO_GLOSSARIO = [
  // A frase-modelo fixa o tratamento: sem ela, um lote trata por "tú" e o outro por "usted"
  "você",
  "Clique no seu estudo, confira os seus dados e salve.",
  "do UEQ",
  "ferramenta",
  "média",
  "entrar",
  "sair",
  "linha",
  "informe",
  "remover",
  "estudo",
  "coleta",
  "participação",
  "resposta",
  "versão",
  "suspeita",
  "tirar da análise",
  "devolver à análise",
  "sino de notificações",
  "tour",
  "pular",
  "dono",
  "editor",
  "leitor",
  "painel",
  "ficha",
  "planilha",
  "computador",
  "celular",
  "faixa etária",
  "faixa do benchmark",
  "escolaridade",
  "escala",
  "item",
  "termo de consentimento",
  "prévia",
  "Atratividade",
  "Perspicuidade",
  "Eficiência",
  "Confiabilidade",
  "Estimulação",
  "Novidade",
  "Qualidade pragmática",
  "Qualidade hedônica",
];

export const chaveDoGlossario = (termo: string) => `glossario:${termo}`;

const TAMANHO_DO_ROTULO = 40;

// Rótulo: botão, título ou pedaço curto, sem pontuação de frase no fim
export function ehRotulo(texto: string): boolean {
  const limpo = texto.trim();
  return limpo.length <= TAMANHO_DO_ROTULO && !/[.?!:;…]$/.test(limpo);
}

const escapar = (texto: string) => texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Os rótulos que um texto longo cita, com a tradução já escolhida. Só rótulo com inicial maiúscula e sem
// marcador, que é como o nome de um botão aparece no meio de uma frase. Os mais longos têm prioridade
export function rotulosCitados(texto: string, rotulos: Map<string, string>, limite = 12): Record<string, string> {
  const citados: Record<string, string> = {};
  const candidatos = [...rotulos.keys()]
    .filter((rotulo) => /^\p{Lu}/u.test(rotulo) && !rotulo.includes("{") && rotulo !== texto && texto.includes(rotulo))
    .sort((a, b) => b.length - a.length);
  for (const rotulo of candidatos) {
    if (Object.keys(citados).length === limite) break;
    if (Object.keys(citados).some((maior) => maior.includes(rotulo))) continue;
    if (new RegExp(`(?<![\\p{L}\\p{N}])${escapar(rotulo)}(?![\\p{L}\\p{N}])`, "u").test(texto)) citados[rotulo] = rotulos.get(rotulo)!;
  }
  return citados;
}
