// Calcula as fórmulas da planilha oficial do UEQ como o Excel, para a exportação já sair com os resultados
// gravados. Sem eles, quem abre o arquivo baixado no Modo de Exibição Protegido do Excel (o padrão para
// arquivos da internet), no LibreOffice ou numa pré-visualização vê as abas vazias e os gráficos com os
// números do exemplo dos autores. Cobre só o que as duas planilhas V15 usam: 19 funções, referências entre
// abas e fórmulas compartilhadas. Validado célula a célula contra o Excel (scripts/planilha-oficial-cache.ps1)

export type Erro = { erro: "#DIV/0!" | "#VALUE!" | "#N/A" | "#NUM!" | "#REF!" | "#NAME?" };
// null é a célula vazia, que não é o mesmo que o texto "" devolvido por uma fórmula
export type Valor = number | string | boolean | Erro | null;

type Referencia = { aba: string; l1: number; c1: number; l2: number; c2: number; fixas: [boolean, boolean, boolean, boolean] };
type No =
  | { tipo: "numero"; valor: number }
  | { tipo: "texto"; valor: string }
  | { tipo: "logico"; valor: boolean }
  | { tipo: "ref"; ref: Referencia }
  | { tipo: "unario"; op: "-" | "+"; arg: No }
  | { tipo: "binario"; op: string; a: No; b: No }
  | { tipo: "funcao"; nome: string; args: No[] };

export type Formula = { no: No; dl: number; dc: number };

const erro = (e: Erro["erro"]): Erro => ({ erro: e });
export const ehErro = (v: unknown): v is Erro => typeof v === "object" && v !== null && "erro" in v;

// ---------- endereços ----------

export function colunaParaNumero(letras: string): number {
  let n = 0;
  for (const letra of letras) n = n * 26 + (letra.charCodeAt(0) - 64);
  return n;
}

export function numeroParaColuna(n: number): string {
  let letras = "";
  for (let resto = n; resto > 0; resto = Math.floor((resto - 1) / 26)) letras = String.fromCharCode(65 + ((resto - 1) % 26)) + letras;
  return letras;
}

export const chave = (linha: number, coluna: number) => linha * 16384 + coluna;

// ---------- leitura da fórmula ----------

const RE_REF = /^(?:(?:'((?:[^']|'')+)'|([A-Za-z_][\w.]*))!)?(\$?)([A-Z]{1,3})(\$?)(\d+)(?::(\$?)([A-Z]{1,3})(\$?)(\d+))?/;

type Token = { t: "num" | "txt" | "ref" | "fn" | "op" | "(" | ")" | "," | "bool"; v: string; ref?: Referencia };

function tokens(formula: string, abaAtual: string): Token[] {
  const saida: Token[] = [];
  let i = 0;
  while (i < formula.length) {
    const resto = formula.slice(i);
    const ch = formula[i]!;
    if (ch === " ") { i++; continue; }
    if (ch === '"') {
      let j = i + 1;
      let texto = "";
      while (j < formula.length) {
        if (formula[j] === '"') {
          if (formula[j + 1] === '"') { texto += '"'; j += 2; continue; }
          break;
        }
        texto += formula[j++];
      }
      saida.push({ t: "txt", v: texto });
      i = j + 1;
      continue;
    }
    const funcao = /^(?:_xlfn\.)?([A-Z][A-Z0-9.]*)\(/.exec(resto);
    if (funcao) { saida.push({ t: "fn", v: funcao[1]! }); i += funcao[0].length - 1; continue; }
    const logico = /^(TRUE|FALSE)(?![\w(])/.exec(resto);
    if (logico) { saida.push({ t: "bool", v: logico[1]! }); i += logico[0].length; continue; }
    const ref = RE_REF.exec(resto);
    if (ref && !/^[A-Za-z_]/.test(resto.slice(ref[0].length))) {
      const aba = ref[1]?.replace(/''/g, "'") ?? ref[2] ?? abaAtual;
      const l1 = Number(ref[6]); const c1 = colunaParaNumero(ref[4]!);
      const l2 = ref[10] ? Number(ref[10]) : l1; const c2 = ref[8] ? colunaParaNumero(ref[8]) : c1;
      saida.push({ t: "ref", v: ref[0], ref: { aba, l1, c1, l2, c2, fixas: [ref[3] === "$", ref[5] === "$", (ref[7] ?? ref[3]) === "$", (ref[9] ?? ref[5]) === "$"] } });
      i += ref[0].length;
      continue;
    }
    const numero = /^\d+(?:\.\d+)?(?:E[+-]?\d+)?/i.exec(resto);
    if (numero) { saida.push({ t: "num", v: numero[0] }); i += numero[0].length; continue; }
    const op = /^(<>|<=|>=|[-+*/^&=<>%])/.exec(resto);
    if (op) { saida.push({ t: "op", v: op[1]! }); i += op[1]!.length; continue; }
    if (ch === "(" || ch === ")" || ch === ",") { saida.push({ t: ch, v: ch }); i++; continue; }
    throw new Error(`Fórmula com trecho desconhecido: ${resto.slice(0, 20)}`);
  }
  return saida;
}

const PRECEDENCIA: Record<string, number> = { "=": 1, "<>": 1, "<": 1, ">": 1, "<=": 1, ">=": 1, "&": 2, "+": 3, "-": 3, "*": 4, "/": 4, "^": 5 };

export function lerFormula(formula: string, abaAtual: string): No {
  const lista = tokens(formula, abaAtual);
  let pos = 0;
  const olhar = () => lista[pos];
  function primario(): No {
    const tk = lista[pos++];
    if (!tk) throw new Error(`Fórmula incompleta: ${formula}`);
    if (tk.t === "op" && (tk.v === "-" || tk.v === "+")) return { tipo: "unario", op: tk.v, arg: expressao(5) };
    if (tk.t === "num") return { tipo: "numero", valor: Number(tk.v) };
    if (tk.t === "txt") return { tipo: "texto", valor: tk.v };
    if (tk.t === "bool") return { tipo: "logico", valor: tk.v === "TRUE" };
    if (tk.t === "ref") return { tipo: "ref", ref: tk.ref! };
    if (tk.t === "(") {
      const dentro = expressao(0);
      if (lista[pos++]?.t !== ")") throw new Error(`Parêntese sem fechar: ${formula}`);
      return dentro;
    }
    if (tk.t === "fn") {
      pos++; // (
      const args: No[] = [];
      if (olhar()?.t !== ")") {
        for (;;) {
          args.push(expressao(0));
          if (olhar()?.t === ",") { pos++; continue; }
          break;
        }
      }
      if (lista[pos++]?.t !== ")") throw new Error(`Função sem fechar: ${formula}`);
      return { tipo: "funcao", nome: tk.v, args };
    }
    throw new Error(`Fórmula inesperada em ${tk.v}: ${formula}`);
  }
  function expressao(minimo: number): No {
    let esquerda = primario();
    for (;;) {
      const tk = olhar();
      if (!tk || tk.t !== "op" || tk.v === "%") break;
      const p = PRECEDENCIA[tk.v]!;
      // Mesma precedência para aqui: todos os operadores do Excel, ^ inclusive, associam à esquerda
      if (p <= minimo) break;
      pos++;
      const direita = expressao(p);
      esquerda = { tipo: "binario", op: tk.v, a: esquerda, b: direita };
    }
    return esquerda;
  }
  const raiz = expressao(0);
  if (pos !== lista.length) throw new Error(`Fórmula com sobra: ${formula}`);
  return raiz;
}

// ---------- estatística ----------

// erf por série de termos positivos (sem cancelamento), precisa até uns 1e-16 na faixa usada
function erf(x: number): number {
  if (x < 0) return -erf(-x);
  if (x > 6) return 1;
  let termo = x;
  let soma = x;
  for (let n = 1; n < 200; n++) {
    termo *= (2 * x * x) / (2 * n + 1);
    soma += termo;
    if (termo < soma * 1e-17) break;
  }
  return (2 / Math.sqrt(Math.PI)) * Math.exp(-x * x) * soma;
}

const normal = (x: number) => 0.5 * (1 + erf(x / Math.SQRT2));

// NORM.S.INV: aproximação de Acklam refinada por Halley
export function normalInversa(p: number): number {
  const a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716, 2.506628277459239];
  const b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572];
  const c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
  let x: number;
  if (p < 0.02425) {
    const q = Math.sqrt(-2 * Math.log(p));
    x = (((((c[0]! * q + c[1]!) * q + c[2]!) * q + c[3]!) * q + c[4]!) * q + c[5]!) / ((((d[0]! * q + d[1]!) * q + d[2]!) * q + d[3]!) * q + 1);
  } else if (p > 1 - 0.02425) {
    const q = Math.sqrt(-2 * Math.log(1 - p));
    x = -(((((c[0]! * q + c[1]!) * q + c[2]!) * q + c[3]!) * q + c[4]!) * q + c[5]!) / ((((d[0]! * q + d[1]!) * q + d[2]!) * q + d[3]!) * q + 1);
  } else {
    const q = p - 0.5;
    const r = q * q;
    x = ((((((a[0]! * r + a[1]!) * r + a[2]!) * r + a[3]!) * r + a[4]!) * r + a[5]!) * q) / (((((b[0]! * r + b[1]!) * r + b[2]!) * r + b[3]!) * r + b[4]!) * r + 1);
  }
  for (let i = 0; i < 2; i++) {
    const e = normal(x) - p;
    const u = e * Math.sqrt(2 * Math.PI) * Math.exp((x * x) / 2);
    x -= u / (1 + (x * u) / 2);
  }
  return x;
}

function mediaDe(v: readonly number[]) {
  let s = 0;
  for (const x of v) s += x;
  return s / v.length;
}

function variancia(v: readonly number[]): number | Erro {
  if (v.length < 2) return erro("#DIV/0!");
  const m = mediaDe(v);
  let s = 0;
  for (const x of v) s += (x - m) ** 2;
  return s / (v.length - 1);
}

// ---------- avaliação ----------

export type Aba = { constantes: Map<number, Valor>; formulas: Map<number, Formula> };

// Marca da célula que está sendo calculada, para uma referência circular não virar laço infinito
const EM_CURSO = Symbol("em curso");

export class Calculo {
  private memoria = new Map<Aba, Map<number, Valor | typeof EM_CURSO>>();

  constructor(private readonly abas: ReadonlyMap<string, Aba>) {}

  valor(aba: string, linha: number, coluna: number): Valor {
    const folha = this.abas.get(aba);
    return folha ? this.valorNaAba(folha, chave(linha, coluna)) : erro("#REF!");
  }

  private valorNaAba(folha: Aba, k: number): Valor {
    const formula = folha.formulas.get(k);
    if (!formula) return folha.constantes.get(k) ?? null;
    let memo = this.memoria.get(folha);
    if (!memo) this.memoria.set(folha, (memo = new Map()));
    const guardado = memo.get(k);
    if (guardado === EM_CURSO) return erro("#REF!");
    if (guardado !== undefined) return guardado;
    memo.set(k, EM_CURSO);
    let resultado = this.escalar(this.avaliar(formula.no, formula));
    // =A1 com A1 vazia mostra 0
    if (resultado === null) resultado = 0;
    memo.set(k, resultado);
    return resultado;
  }

  private celulas(ref: Referencia, f: Formula): Valor[] {
    const folha = this.abas.get(ref.aba);
    if (!folha) return [erro("#REF!")];
    const l1 = ref.l1 + (ref.fixas[1] ? 0 : f.dl), c1 = ref.c1 + (ref.fixas[0] ? 0 : f.dc);
    const l2 = ref.l2 + (ref.fixas[3] ? 0 : f.dl), c2 = ref.c2 + (ref.fixas[2] ? 0 : f.dc);
    const saida: Valor[] = [];
    for (let l = l1; l <= l2; l++) for (let c = c1; c <= c2; c++) saida.push(this.valorNaAba(folha, chave(l, c)));
    return saida;
  }

  private dimensoes(ref: Referencia) {
    return { linhas: ref.l2 - ref.l1 + 1, colunas: ref.c2 - ref.c1 + 1 };
  }

  // Um valor só: referência a uma célula vira o valor dela; a várias, #VALUE! (as planilhas não usam interseção)
  private escalar(v: Valor | Valor[]): Valor {
    if (Array.isArray(v)) return v.length === 1 ? v[0]! : erro("#VALUE!");
    return v;
  }

  private avaliar(no: No, f: Formula): Valor | Valor[] {
    switch (no.tipo) {
      case "numero":
      case "texto":
      case "logico":
        return no.valor;
      case "ref":
        return this.celulas(no.ref, f);
      case "unario": {
        const v = this.numero(this.escalar(this.avaliar(no.arg, f)));
        return ehErro(v) ? v : no.op === "-" ? -v : v;
      }
      case "binario":
        return this.binario(no.op, this.escalar(this.avaliar(no.a, f)), this.escalar(this.avaliar(no.b, f)));
      case "funcao":
        return this.funcao(no.nome, no.args, f);
    }
  }

  private numero(v: Valor): number | Erro {
    if (ehErro(v)) return v;
    if (v === null) return 0;
    if (typeof v === "number") return v;
    if (typeof v === "boolean") return v ? 1 : 0;
    const n = v.trim() === "" ? NaN : Number(v);
    return Number.isFinite(n) ? n : erro("#VALUE!");
  }

  private texto(v: Valor): string | Erro {
    if (ehErro(v)) return v;
    if (v === null) return "";
    if (typeof v === "boolean") return v ? "TRUE" : "FALSE";
    if (typeof v === "number") return formatarNumero(v);
    return v;
  }

  private comparar(a: Valor, b: Valor): number {
    // vazio vira 0 diante de número e "" diante de texto
    if (a === null) a = typeof b === "string" ? "" : typeof b === "boolean" ? false : 0;
    if (b === null) b = typeof a === "string" ? "" : typeof a === "boolean" ? false : 0;
    const ordem = (v: Valor) => (typeof v === "number" ? 0 : typeof v === "string" ? 1 : 2);
    if (ordem(a) !== ordem(b)) return ordem(a) - ordem(b);
    if (typeof a === "string" && typeof b === "string") {
      const x = a.toLowerCase(), y = b.toLowerCase();
      return x < y ? -1 : x > y ? 1 : 0;
    }
    const x = Number(a), y = Number(b);
    return x < y ? -1 : x > y ? 1 : 0;
  }

  private binario(op: string, a: Valor, b: Valor): Valor {
    if (ehErro(a)) return a;
    if (ehErro(b)) return b;
    if (op === "&") return (this.texto(a) as string) + (this.texto(b) as string);
    if (["=", "<>", "<", ">", "<=", ">="].includes(op)) {
      const r = this.comparar(a, b);
      return op === "=" ? r === 0 : op === "<>" ? r !== 0 : op === "<" ? r < 0 : op === ">" ? r > 0 : op === "<=" ? r <= 0 : r >= 0;
    }
    const x = this.numero(a), y = this.numero(b);
    if (ehErro(x)) return x;
    if (ehErro(y)) return y;
    let r: number;
    if (op === "+") r = x + y;
    else if (op === "-") r = x - y;
    else if (op === "*") r = x * y;
    else if (op === "/") { if (y === 0) return erro("#DIV/0!"); r = x / y; }
    else if (op === "^") r = Math.pow(x, y);
    else return erro("#NAME?");
    return Number.isFinite(r) ? r : erro("#NUM!");
  }

  // Números dos argumentos, como AVERAGE e afins: de referências entram só os números (texto e vazio ficam
  // de fora, erro propaga); valores diretos entram convertidos
  private numeros(args: No[], f: Formula): number[] | Erro {
    const saida: number[] = [];
    for (const arg of args) {
      const v = this.avaliar(arg, f);
      if (Array.isArray(v)) {
        for (const x of v) {
          if (ehErro(x)) return x;
          if (typeof x === "number") saida.push(x);
        }
      } else {
        const n = this.numero(v);
        if (ehErro(n)) return n;
        saida.push(n);
      }
    }
    return saida;
  }

  private pares(args: No[], f: Formula): [number[], number[]] | Erro {
    const x = this.avaliar(args[0]!, f), y = this.avaliar(args[1]!, f);
    const lx = Array.isArray(x) ? x : [x], ly = Array.isArray(y) ? y : [y];
    if (lx.length !== ly.length) return erro("#N/A");
    const a: number[] = [], b: number[] = [];
    for (let i = 0; i < lx.length; i++) {
      const p = lx[i]!, q = ly[i]!;
      if (ehErro(p)) return p;
      if (ehErro(q)) return q;
      if (typeof p === "number" && typeof q === "number") { a.push(p); b.push(q); }
    }
    return [a, b];
  }

  private funcao(nome: string, args: No[], f: Formula): Valor {
    const arg = (i: number) => this.escalar(this.avaliar(args[i]!, f));
    const num = (i: number) => this.numero(arg(i));
    switch (nome) {
      case "IF": {
        const cond = arg(0);
        if (ehErro(cond)) return cond;
        if (typeof cond === "string") return erro("#VALUE!");
        const verdade = cond === null ? false : typeof cond === "boolean" ? cond : cond !== 0;
        if (verdade) return args.length > 1 ? arg(1) : true;
        return args.length > 2 ? arg(2) : false;
      }
      case "SUM": case "AVERAGE": case "MAX": case "MIN": case "COUNT": case "VAR": case "STDEV": {
        if (nome === "COUNT") {
          let n = 0;
          for (const a of args) {
            const v = this.avaliar(a, f);
            for (const x of Array.isArray(v) ? v : [v]) if (typeof x === "number") n++;
          }
          return n;
        }
        const v = this.numeros(args, f);
        if (ehErro(v)) return v;
        if (nome === "SUM") return v.reduce((s, x) => s + x, 0);
        if (nome === "MAX") return v.length ? Math.max(...v) : 0;
        if (nome === "MIN") return v.length ? Math.min(...v) : 0;
        if (nome === "AVERAGE") return v.length ? mediaDe(v) : erro("#DIV/0!");
        const s2 = variancia(v);
        if (ehErro(s2)) return s2;
        return nome === "VAR" ? s2 : Math.sqrt(s2);
      }
      case "COUNTA": {
        let n = 0;
        for (const a of args) {
          const v = this.avaliar(a, f);
          for (const x of Array.isArray(v) ? v : [v]) if (x !== null) n++;
        }
        return n;
      }
      case "COUNTIF": {
        const faixa = this.avaliar(args[0]!, f);
        const criterio = arg(1);
        if (ehErro(criterio)) return criterio;
        const alvo = typeof criterio === "number" ? criterio : Number(criterio);
        if (typeof criterio !== "number" && (typeof criterio !== "string" || !/^-?\d+(\.\d+)?$/.test(criterio))) {
          throw new Error(`COUNTIF com critério não suportado: ${String(criterio)}`);
        }
        let n = 0;
        for (const x of Array.isArray(faixa) ? faixa : [faixa]) if (typeof x === "number" ? x === alvo : typeof x === "string" && x.trim() !== "" && Number(x) === alvo) n++;
        return n;
      }
      case "CORREL": case "COVARIANCE.S": {
        const p = this.pares(args, f);
        if (ehErro(p)) return p;
        const [x, y] = p;
        if (x.length < 2) return erro("#DIV/0!");
        const mx = mediaDe(x), my = mediaDe(y);
        let sxy = 0, sxx = 0, syy = 0;
        for (let i = 0; i < x.length; i++) {
          sxy += (x[i]! - mx) * (y[i]! - my);
          sxx += (x[i]! - mx) ** 2;
          syy += (y[i]! - my) ** 2;
        }
        if (nome === "COVARIANCE.S") return sxy / (x.length - 1);
        if (sxx === 0 || syy === 0) return erro("#DIV/0!");
        return sxy / Math.sqrt(sxx * syy);
      }
      case "CONCAT": {
        let s = "";
        for (const a of args) {
          const v = this.avaliar(a, f);
          for (const x of Array.isArray(v) ? v : [v]) {
            const t = this.texto(x);
            if (ehErro(t)) return t;
            s += t;
          }
        }
        return s;
      }
      case "VLOOKUP": {
        const procurado = arg(0);
        if (ehErro(procurado)) return procurado;
        const tabela = args[1]!;
        if (tabela.tipo !== "ref") return erro("#VALUE!");
        const coluna = num(2);
        if (ehErro(coluna)) return coluna;
        const { linhas, colunas } = this.dimensoes(tabela.ref);
        if (coluna < 1) return erro("#VALUE!");
        if (coluna > colunas) return erro("#REF!");
        const r = tabela.ref;
        const l0 = r.l1 + (r.fixas[1] ? 0 : f.dl), c0 = r.c1 + (r.fixas[0] ? 0 : f.dc);
        for (let i = 0; i < linhas; i++) {
          const v = this.valor(r.aba, l0 + i, c0);
          if (ehErro(v) || v === null || procurado === null) continue;
          if (typeof v === typeof procurado && this.comparar(v, procurado) === 0) {
            const achado = this.valor(r.aba, l0 + i, c0 + Math.trunc(coluna) - 1);
            return achado === null ? 0 : achado;
          }
        }
        return erro("#N/A");
      }
      case "POWER": case "SQRT": case "EXP": case "LN": {
        const x = num(0);
        if (ehErro(x)) return x;
        if (nome === "SQRT") return x < 0 ? erro("#NUM!") : Math.sqrt(x);
        if (nome === "EXP") { const r = Math.exp(x); return Number.isFinite(r) ? r : erro("#NUM!"); }
        if (nome === "LN") return x <= 0 ? erro("#NUM!") : Math.log(x);
        const y = num(1);
        if (ehErro(y)) return y;
        if (x === 0 && y < 0) return erro("#DIV/0!");
        const r = Math.pow(x, y);
        return Number.isFinite(r) ? r : erro("#NUM!");
      }
      case "CONFIDENCE": {
        const alfa = num(0), dp = num(1), n = num(2);
        if (ehErro(alfa)) return alfa;
        if (ehErro(dp)) return dp;
        if (ehErro(n)) return n;
        const inteiro = Math.trunc(n);
        if (alfa <= 0 || alfa >= 1 || dp <= 0 || inteiro < 1) return erro("#NUM!");
        return (normalInversa(1 - alfa / 2) * dp) / Math.sqrt(inteiro);
      }
      default:
        throw new Error(`Função da planilha não suportada: ${nome}`);
    }
  }
}

// Número em texto como o formato Geral do Excel faz ao concatenar (até 15 algarismos significativos)
export function formatarNumero(n: number): string {
  if (Number.isInteger(n) && Math.abs(n) < 1e15) return String(n);
  return String(Number(n.toPrecision(15)));
}
