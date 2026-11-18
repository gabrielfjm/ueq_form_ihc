# Gera os cenários de data/fixtures-ueq-s/ (respostas.csv, 8 valores de 1 a 7 por linha, na ordem e nos lados
# do UEQ-S). Determinístico: rodar de novo dá os mesmos arquivos. O esperado.json de cada pasta vem depois, da
# planilha oficial do UEQ-S, por scripts/planilha-oficial-ueq-s.ps1 (passo a passo em data/fixtures-ueq-s/LEIA-ME.md).
#
#   python scripts/gerar-fixtures-ueq-s.py data/planilha-oficial/Short_UEQ_Data_Analysis_Tool_V15.xlsx
import json
import random
import sys
from pathlib import Path

import openpyxl

RAIZ = Path(__file__).resolve().parent.parent
DESTINO = RAIZ / "data" / "fixtures-ueq-s"
ITENS = json.loads((RAIZ / "data" / "ueq-s-itens-ptbr.json").read_text(encoding="utf-8"))["itens"]
POLARIDADE_UEQ = {
    item["numero"]: item["polaridade"]
    for item in json.loads((RAIZ / "data" / "ueq-itens-ptbr.json").read_text(encoding="utf-8"))["itens"]
}


def gravar(pasta, linhas):
    destino = DESTINO / pasta
    destino.mkdir(parents=True, exist_ok=True)
    for linha in linhas:
        assert len(linha) == 8 and all(isinstance(v, int) and 1 <= v <= 7 for v in linha), linha
    texto = "".join(";".join(map(str, linha)) + "\r\n" for linha in linhas)
    (destino / "respostas.csv").write_bytes(texto.encode("ascii"))
    print(f"{pasta}: {len(linhas)} participantes")


def limitar(valor):
    return max(1, min(7, round(valor)))


# Do UEQ completo para o UEQ-S: o item k do UEQ-S é o par numeroNoUeq do UEQ, com a régua espelhada (8 - x)
# quando o UEQ-S mostra os lados trocados. É o mesmo que src/ueq/ueq-s.ts faz com um estudo do UEQ completo
def do_ueq(pasta_ueq):
    linhas = []
    for bruta in (RAIZ / "data" / "fixtures" / pasta_ueq / "respostas.csv").read_text().splitlines():
        if not bruta.strip():
            continue
        valores = [int(v) for v in bruta.split(";")]
        linha = []
        for item in ITENS:
            valor = valores[item["numeroNoUeq"] - 1]
            linha.append(8 - valor if POLARIDADE_UEQ[item["numeroNoUeq"]] != item["polaridade"] else valor)
        linhas.append(linha)
    return linhas


def oficial(modelo):
    aba = openpyxl.load_workbook(modelo, data_only=True)["Data"]
    linhas = []
    for linha in aba.iter_rows(min_row=4, max_col=8, values_only=True):
        if linha[0] is None:
            break
        linhas.append([int(v) for v in linha])
    return linhas


def pessoa(sorteio, pragmatica, hedonica, ruido=0.9):
    return [limitar(4 + (pragmatica if i < 4 else hedonica) + sorteio.gauss(0, ruido)) for i in range(8)]


def grande(sorteio):
    linhas = []
    for _ in range(1000):
        tipo = sorteio.random()
        if tipo < 0.04:
            linhas.append([sorteio.randint(1, 7) for _ in range(8)])
        elif tipo < 0.05:
            linhas.append([4] * 8)
        else:
            linhas.append(pessoa(sorteio, sorteio.gauss(1.0, 0.8), sorteio.gauss(0.6, 0.9)))
    return linhas


# Os limites das regras da aba Inconsistencies (data/fixtures-ueq-s/LEIA-ME.md, "Linhas do cenário bordas")
def bordas(sorteio):
    linhas = [
        [2, 5, 3, 4, 3, 6, 4, 5],  # amplitude exatamente 3 nas duas escalas: não é suspeita
        [1, 5, 3, 4, 4, 5, 4, 5],  # amplitude 4 só na pragmática: não é suspeita
        [1, 5, 3, 4, 2, 6, 4, 5],  # amplitude 4 nas duas: suspeita
        [4, 4, 4, 4, 4, 4, 4, 4],  # a categoria do meio nos 8: suspeita ("Remove")
        [7, 7, 7, 7, 7, 7, 7, 7],  # 8 respostas iguais, mas não no meio: não é suspeita
        [4, 4, 4, 4, 4, 4, 4, 5],  # 7 vezes o meio: não é suspeita
        [1, 7, 1, 7, 7, 1, 7, 1],  # amplitude 6 nas duas: suspeita
    ]
    linhas += [pessoa(sorteio, 0.8, 0.5) for _ in range(5)]
    return linhas


# O item 3 com a mesma resposta para todos: sem IC do item e sem alfa da pragmática (#DIV/0! na planilha)
def variancia_zero(sorteio):
    linhas = [pessoa(sorteio, 1.0, 0.4) for _ in range(12)]
    for linha in linhas:
        linha[2] = 6
    return linhas


# Produto mal avaliado, e itens hedônicos que se contradizem (alfa negativo)
def negativo(sorteio):
    linhas = []
    for _ in range(18):
        linha = pessoa(sorteio, -1.6, -1.2, ruido=0.7)
        if sorteio.random() < 0.5:
            linha[4], linha[7] = limitar(linha[4] + 3), limitar(linha[7] - 1)
        else:
            linha[5], linha[6] = limitar(linha[5] + 3), limitar(linha[6] - 1)
        linhas.append(linha)
    return linhas


def main():
    modelo = sys.argv[1]
    sorteio = random.Random(20261118)
    gravar("oficial-exemplo", oficial(modelo))
    gravar("do-ueq-basico", do_ueq("basico"))
    gravar("do-ueq-oficial-exemplo", do_ueq("oficial-exemplo"))
    gravar("grande", grande(sorteio))
    gravar("bordas", bordas(sorteio))
    gravar("variancia-zero", variancia_zero(sorteio))
    gravar("negativo", negativo(sorteio))
    gravar("n1", [[5, 6, 5, 6, 4, 5, 3, 4]])
    gravar("n2", [[5, 6, 5, 6, 4, 5, 3, 4], [3, 4, 6, 5, 5, 6, 4, 2]])


main()
