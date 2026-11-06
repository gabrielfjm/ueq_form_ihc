// Textos das telas do participante. Os 26 pares e a instrução vêm do pacote oficial (data/ueq-idiomas.json
// e data/ueq-instrucoes.json); o resto foi traduzido pela equipe e precisa de revisão de falante nativo.
// São strings puras, com {marcadores}, para poderem ir como propriedade a componentes de cliente

// Formas de plural de Intl.PluralRules; "other" é obrigatória e as demais, só onde o idioma usa
export type Plural = Partial<Record<Exclude<Intl.LDMLPluralRule, "other">, string>> & { other: string };

type Aviso = { etapa: string; titulo: string; texto: string };
type Pergunta<Opcoes extends string[]> = { titulo: string; opcoes: Opcoes };
type T3 = [string, string, string];

export type TextosParticipante = {
  pularConteudo: string;
  // O que o botão diz enquanto o envio roda
  aguarde: string;
  idioma: {
    rotulo: string;
    aplicar: string;
    // Mostrado quando o PDF oficial do idioma avisa que a tradução ainda não foi aprovada
    naoAprovada: string;
  };
  etapas: {
    nomes: T3;
    rotulo: string;
    rotuloConcluidas: string;
    // {n}, {total}, {nome}
    etapaDeTotal: string;
  };
  titulos: {
    consentimento: string;
    indisponivel: string;
    jaRespondeu: string;
    questionario: string;
    dadosOpcionais: string;
    registradas: string;
    encerrada: string;
  };
  consentimento: {
    subtitulo: string;
    termoTitulo: string;
    // Vem depois do objetivo escrito pelo pesquisador
    termoTexto: string;
    condicoes: [[string, string], [string, string], [string, string], [string, string]];
    concordo: string;
    naoQuero: string;
    // O link para a política de privacidade, no fim do termo
    privacidade: string;
  };
  politica: {
    voltar: string;
    // O texto da política vem da tradução automática; sem ela, aparece em português e a tela avisa
    semTraducao: string;
  };
  fechado: { rascunho: Aviso; encerrado: Aviso };
  jaRespondeu: { titulo: string; texto: string };
  questionario: {
    recuperadas: string;
    naoDeuEnviar: string;
    // {n}
    faltam: Plural;
    marqueCadaUm: string;
    // {n}
    irParaItem: string;
    enviar: string;
    // {total}
    todosRespondidos: string;
    // {n}, {total}
    parcial: string;
    erroEncerrada: string;
    erroSemParticipacao: string;
    // {n}, {total}, {esquerdo}, {direito}
    legenda: string;
    naoRespondido: string;
    // {p}, {termo}
    posicao: string;
    centro: string;
    // {n}, {total}
    contagem: string;
    sair: string;
    perguntaSair: string;
    continuar: string;
  };
  sobreVoce: {
    titulo: string;
    descricao: string;
    // Na mesma ordem de PERGUNTAS_DEMOGRAFIA (src/lib/demografia.ts)
    faixaEtaria: Pergunta<[string, string, string, string, string]>;
    genero: Pergunta<T3>;
    escolaridade: Pergunta<[string, string, string, string]>;
    familiaridadeComProduto: Pergunta<T3>;
    prefiroNao: string;
    continuar: string;
    pular: string;
  };
  fim: { titulo: string; texto: string; nota: string };
  saiu: { titulo: string; texto: string };
};
