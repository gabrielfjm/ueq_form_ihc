# O mesmo que scripts/planilha-oficial.ps1, para a planilha oficial do UEQ-S (Short_UEQ_Data_Analysis_Tool_V15.xlsx):
# abre no Microsoft Excel (Windows), recalcula e grava num JSON as células de resultado listadas em
# data/fixtures-ueq-s/LEIA-ME.md. Nunca salva a planilha: trabalha numa cópia temporária.
#
# Gerar o esperado.json de uma fixture (apaga o exemplo e cola o respostas.csv em Data!A4 de uma cópia):
#   .\scripts\planilha-oficial-ueq-s.ps1 -Planilha data\planilha-oficial\Short_UEQ_Data_Analysis_Tool_V15.xlsx `
#     -Csv data\fixtures-ueq-s\bordas\respostas.csv -Saida data\fixtures-ueq-s\bordas\esperado.json -Fonte "..."
#
# Conferir uma planilha exportada pela ferramenta (sem colar nada e sem forçar o recálculo):
#   .\scripts\planilha-oficial-ueq-s.ps1 -Planilha ueq_..._planilha-oficial-ueq-s.xlsx -Saida lida.json -SemRecalcular
param(
  [Parameter(Mandatory = $true)][string]$Planilha,
  [string]$Csv,
  [Parameter(Mandatory = $true)][string]$Saida,
  [string]$Fonte = "",
  [switch]$SemRecalcular
)
$ErrorActionPreference = "Stop"

$copia = Join-Path ([System.IO.Path]::GetTempPath()) ("ueq-s-" + [guid]::NewGuid().ToString() + ".xlsx")
Copy-Item -LiteralPath $Planilha -Destination $copia

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false
$excel.ScreenUpdating = $false
try {
  $livro = $excel.Workbooks.Open($copia, 0, $false)
  $dados = $livro.Worksheets.Item("Data")
  $n = 0
  if ($Csv) {
    $linhas = @(Get-Content -LiteralPath $Csv | Where-Object { $_.Trim() -ne "" })
    $n = $linhas.Count
    $dados.Range("A4:H1004").ClearContents() | Out-Null
    if ($n -gt 0) {
      $matriz = New-Object 'object[,]' $n, 8
      for ($i = 0; $i -lt $n; $i++) {
        $valores = $linhas[$i].Split(";")
        for ($j = 0; $j -lt 8; $j++) { $matriz[$i, $j] = [double]$valores[$j] }
      }
      $dados.Range("A4").Resize($n, 8).Value2 = $matriz
    }
  } else {
    $n = [int]$excel.WorksheetFunction.CountA($dados.Range("A4:A1004"))
  }
  if (-not $SemRecalcular) { $excel.CalculateFull() }

  # Erro da planilha (#DIV/0!, #NUM!) e célula vazia viram null
  function Celula($aba, $endereco) {
    $c = $livro.Worksheets.Item($aba).Range($endereco)
    $texto = [string]$c.Text
    $valor = $c.Value2
    if ($texto.StartsWith("#") -or $valor -is [int]) { return $null }
    if ($null -eq $valor -or ($valor -is [string] -and $valor -eq "")) { return $null }
    return $valor
  }
  function Coluna($aba, $coluna, $de, $ate) { @(for ($r = $de; $r -le $ate; $r++) { Celula $aba "$coluna$r" }) }
  $ultima = $n + 3

  $resultado = [ordered]@{
    fonte = $Fonte
    escalas = [ordered]@{
      media = Coluna "Confidence_Intervals" "J" 5 7
      dp = Coluna "Confidence_Intervals" "K" 5 7
      n = [int](Celula "Confidence_Intervals" "L5")
      icInferior = Coluna "Confidence_Intervals" "N" 5 7
      icSuperior = Coluna "Confidence_Intervals" "O" 5 7
      alfa = @((Celula "Scale_Consistency" "E12"), (Celula "Scale_Consistency" "H12"), $null)
      correlacaoMedia = @((Celula "Scale_Consistency" "E11"), (Celula "Scale_Consistency" "H11"))
      benchmark = Coluna "Benchmark" "C" 4 6
      variancia = Coluna "Results" "M" 4 6
    }
    itens = [ordered]@{
      media = Coluna "Results" "B" 4 11
      variancia = Coluna "Results" "C" 4 11
      dp = Coluna "Results" "D" 4 11
      n = Coluna "Results" "E" 4 11
      icInferior = Coluna "Confidence_Intervals" "F" 5 12
      icSuperior = Coluna "Confidence_Intervals" "G" 5 12
    }
    participantes = [ordered]@{
      escores = @(if ($n -gt 0) { for ($r = 4; $r -le $ultima; $r++) { , @((Celula "DT" "K$r"), (Celula "DT" "L$r"), (Celula "DT" "M$r")) } })
      escalasInconsistentes = @(if ($n -gt 0) { Coluna "Inconsistencies" "M" 4 $ultima })
      respostasIguais = @(if ($n -gt 0) { Coluna "Inconsistencies" "O" 4 $ultima })
      todasNoMeio = @(if ($n -gt 0) { for ($r = 4; $r -le $ultima; $r++) { (Celula "Inconsistencies" "P$r") -eq "Remove" } })
    }
    idioma = [string]$livro.Worksheets.Item("Read_First").Range("B4").Value2
    rotulos = [ordered]@{ escala1 = [string](Celula "Results" "K4"); item1Esquerda = [string](Celula "Results" "F4") }
  }
  $json = $resultado | ConvertTo-Json -Depth 6
  [System.IO.File]::WriteAllText($Saida, $json, (New-Object System.Text.UTF8Encoding $false))
  $livro.Close($false)
} finally {
  $excel.Quit()
  [System.Runtime.InteropServices.Marshal]::ReleaseComObject($excel) | Out-Null
  Remove-Item -LiteralPath $copia -ErrorAction SilentlyContinue
}
