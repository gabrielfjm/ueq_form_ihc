# Gera as fixtures oficial-exemplo, grande, bordas, variancia-zero e negativo em data/fixtures (ver o
# LEIA-ME de lá). Determinístico: random.Random com semente fixa. Rodar da raiz do repositório:
#   python scripts/gerar-fixtures.py data/planilha-oficial/UEQ_Data_Analysis_Tool_V15.xlsx
import json
import random
import sys
import zipfile
import re
from pathlib import Path

raiz = Path(".")
itens = json.loads((raiz / "data/ueq-itens-ptbr.json").read_text(encoding="utf-8"))["itens"]
POL = {i["numero"]: i["polaridade"] for i in itens}
ESC = {i["numero"]: i["escala"] for i in itens}
ESCALAS = ["atratividade", "perspicuidade", "eficiencia", "confiabilidade", "estimulacao", "novidade"]
POR_ESCALA = {e: [n for n in range(1, 27) if ESC[n] == e] for e in ESCALAS}


def bruto(numero, recodificado):
    # valor de -3 a 3 já na direção positiva -> valor de 1 a 7 como a pessoa marcou
    return recodificado + 4 if POL[numero] == "+" else 4 - recodificado


def linha_de(recod):
    return [bruto(n, recod[n]) for n in range(1, 27)]


def gravar(pasta, linhas):
    destino = raiz / "data/fixtures" / pasta
    destino.mkdir(parents=True, exist_ok=True)
    texto = "".join(";".join(str(v) for v in l) + "\r\n" for l in linhas)
    (destino / "respostas.csv").write_bytes(texto.encode("utf-8"))
    print(pasta, len(linhas))


def limitar(x):
    return max(-3, min(3, x))


# 1. oficial-exemplo: os 255 participantes de exemplo que vêm na aba Data da planilha oficial
modelo = Path(sys.argv[1])
with zipfile.ZipFile(modelo) as z:
    xml = z.read("xl/worksheets/sheet2.xml").decode("utf-8")
linhas = []
for numero, corpo in re.findall(r'<row r="(\d+)"[^>]*>(.*?)</row>', xml, re.S):
    if int(numero) < 4:
        continue
    celulas = dict(re.findall(r'<c r="([A-Z]+)\d+"[^>]*><v>(\d+)</v></c>', corpo))
    colunas = [chr(ord("A") + k) for k in range(26)]
    if not all(c in celulas for c in colunas):
        raise SystemExit(f"linha {numero} da planilha tem célula vazia")
    linhas.append([int(celulas[c]) for c in colunas])
gravar("oficial-exemplo", linhas)

# 2. grande: 1000 participantes, o máximo que a planilha aceita sem mexer nas fórmulas
aleatorio = random.Random(20261117)
linhas = []
for p in range(1000):
    tipo = aleatorio.random()
    if tipo < 0.04:
        # responde ao acaso
        linhas.append([aleatorio.randint(1, 7) for _ in range(26)])
        continue
    if tipo < 0.06:
        # marca sempre a mesma coluna
        v = aleatorio.randint(1, 7)
        linhas.append([v] * 26)
        continue
    geral = aleatorio.gauss(1.0, 0.9)
    recod = {}
    for e in ESCALAS:
        nivel = geral + aleatorio.gauss({"novidade": -0.4, "eficiencia": 0.2}.get(e, 0), 0.6)
        for n in POR_ESCALA[e]:
            recod[n] = limitar(round(nivel + aleatorio.gauss(0, 0.8)))
    linhas.append(linha_de(recod))
gravar("grande", linhas)

# 3. bordas: os limites das duas regras de suspeita (amplitude > 3 e mais de 15 respostas iguais)
base = {e: v for e, v in zip(ESCALAS, [2, 1, 2, 1, 1, 0])}


def consistente(deslocamento=0):
    return {n: limitar(base[ESC[n]] + deslocamento) for n in range(1, 27)}


def com_amplitude(escalas, amplitude):
    recod = consistente()
    for e in escalas:
        primeiro, segundo = POR_ESCALA[e][0], POR_ESCALA[e][1]
        recod[primeiro], recod[segundo] = 3, 3 - amplitude
    return recod


linhas = []
# linha 1: amplitude 3 nas seis escalas (no limite, não conta)
linhas.append(linha_de(com_amplitude(ESCALAS, 3)))
# linha 2: amplitude 4 em duas escalas (não é suspeita)
linhas.append(linha_de(com_amplitude(["atratividade", "novidade"], 4)))
# linha 3: amplitude 4 em três escalas (suspeita)
linhas.append(linha_de(com_amplitude(["perspicuidade", "eficiencia", "estimulacao"], 4)))
# linha 4: exatamente 15 respostas iguais, todas no meio da escala, sem amplitude alta (não é suspeita)
quinze = [4] * 15 + [5, 3, 5, 3, 5, 3, 5, 3, 5, 3, 5]
linhas.append(quinze)
# linha 5: exatamente 16 respostas iguais (suspeita)
dezesseis = [4] * 16 + [5, 3, 5, 3, 5, 3, 5, 3, 5, 3]
linhas.append(dezesseis)
# linha 6: 26 vezes o 4, o meio da escala
linhas.append([4] * 26)
# linhas 7 a 12: respostas comuns, para as estatísticas terem variação
for deslocamento in (0, 1, -1, 1, 0, -1):
    recod = consistente(deslocamento)
    for n in range(1, 27):
        recod[n] = limitar(recod[n] + aleatorio.choice((-1, 0, 0, 1)))
    linhas.append(linha_de(recod))
gravar("bordas", linhas)

# 4. variancia-zero: um item com a mesma resposta para todos. A correlação dele com os outros não existe,
# então a planilha dá #DIV/0! no alfa da escala dele (perspicuidade) e calcula as outras normalmente
linhas = []
for p in range(12):
    nivel = aleatorio.gauss(1, 1)
    recod = {n: limitar(round(nivel + aleatorio.gauss(0, 0.7))) for n in range(1, 27)}
    recod[2] = 2
    linhas.append(linha_de(recod))
gravar("variancia-zero", linhas)

# 5. negativo: produto mal avaliado (médias negativas, benchmark Bad) e novidade com itens que se
# contradizem, o que leva o alfa para baixo de zero
linhas = []
for p in range(18):
    nivel = aleatorio.gauss(-1.5, 0.7)
    recod = {n: limitar(round(nivel + aleatorio.gauss(0, 0.6))) for n in range(1, 27)}
    oposto = aleatorio.choice((-2, -1, 1, 2))
    recod[3], recod[10] = limitar(oposto), limitar(-oposto)
    recod[15], recod[26] = limitar(-oposto + aleatorio.choice((-1, 0, 1))), limitar(oposto)
    linhas.append(linha_de(recod))
gravar("negativo", linhas)
