# Abre a UEQ Data Analysis Tool V15 no Microsoft Excel (Windows), recalcula e grava num JSON as células de
# resultado listadas em data/fixtures/LEIA-ME.md. Nunca salva a planilha: trabalha numa cópia temporária.
#
# Gerar o esperado.json de uma fixture (apaga o exemplo e cola o respostas.csv em Data!A4 de uma cópia):
#   .\scripts\planilha-oficial.ps1 -Planilha data\planilha-oficial\UEQ_Data_Analysis_Tool_V15.xlsx `
#     -Csv data\fixtures\basico\respostas.csv -Saida data\fixtures\basico\esperado.json -Fonte "..."
#
# Conferir uma planilha exportada pela ferramenta (sem colar nada e sem forçar o recálculo, para provar
# que ela recalcula sozinha ao abrir):
#   .\scripts\planilha-oficial.ps1 -Planilha ueq_..._planilha-oficial_....xlsx -Saida lida.json -SemRecalcular
param(
  [Parameter(Mandatory = $true)][string]$Planilha,
  [string]$Csv,
  [Parameter(Mandatory = $true)][string]$Saida,
  [string]$Fonte = "",
  [switch]$SemRecalcular
)
$ErrorActionPreference = "Stop"

$copia = Join-Path ([System.IO.Path]::GetTempPath()) ("ueq-" + [guid]::NewGuid().ToString() + ".xlsx")
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
    $dados.Range("A4:AA1004").ClearContents() | Out-Null
    if ($n -gt 0) {
      $matriz = New-Object 'object[,]' $n, 26
      for ($i = 0; $i -lt $n; $i++) {
        $valores = $linhas[$i].Split(";")
        for ($j = 0; $j -lt 26; $j++) { $matriz[$i, $j] = [double]$valores[$j] }
      }
      $dados.Range("A4").Resize($n, 26).Value2 = $matriz
    }
  } else {
    $n = [int]$excel.WorksheetFunction.CountA($dados.Range("A4:A1004"))
  }
  if (-not $SemRecalcular) { $excel.CalculateFull() }

  function Celula($aba, $endereco) {
    $c = $livro.Worksheets.Item($aba).Range($endereco)
    $texto = [string]$c.Text
    $valor = $c.Value2
    if ($texto.StartsWith("#") -or $valor -is [int]) { return $null }
    if ($null -eq $valor -or ($valor -is [string] -and $valor -eq "")) { return $null }
    return $valor
  }
  function Coluna($aba, $coluna, $de, $ate) { @(for ($r = $de; $r -le $ate; $r++) { Celula $aba "$coluna$r" }) }

  $resultado = [ordered]@{
    fonte = $Fonte
    escalas = [ordered]@{
      media = Coluna "Confidence_Intervals" "J" 5 10
      dp = Coluna "Confidence_Intervals" "K" 5 10
      n = [int](Celula "Confidence_Intervals" "L5")
      icInferior = Coluna "Confidence_Intervals" "N" 5 10
      icSuperior = Coluna "Confidence_Intervals" "O" 5 10
      alfa = @((Celula "Scale_Consistency" "B23"), (Celula "Scale_Consistency" "E14"), (Celula "Scale_Consistency" "H14"), (Celula "Scale_Consistency" "K14"), (Celula "Scale_Consistency" "N14"), (Celula "Scale_Consistency" "Q14"))
      benchmark = Coluna "Benchmark" "C" 3 8
      variancia = Coluna "Results" "M" 3 8
    }
    grupos = [ordered]@{ pragmatica = Celula "Results" "L41"; hedonica = Celula "Results" "L42" }
    itens = [ordered]@{
      media = Coluna "Results" "B" 3 28
      dp = Coluna "Results" "D" 3 28
      n = Coluna "Results" "E" 3 28
      icInferior = Coluna "Confidence_Intervals" "F" 5 30
      icSuperior = Coluna "Confidence_Intervals" "G" 5 30
    }
    participantes = [ordered]@{
      escalasInconsistentes = @(if ($n -gt 0) { Coluna "Inconsistencies" "AI" 4 ($n + 3) })
      respostasIguais = @(if ($n -gt 0) { Coluna "Inconsistencies" "AK" 4 ($n + 3) })
    }
    distribuicao = @(for ($r = 3; $r -le 28; $r++) { , @(for ($k = 3; $k -le 9; $k++) { Celula "Answer_Distributions" ($livro.Worksheets.Item("Answer_Distributions").Cells.Item($r, $k).Address($false, $false)) }) })
    idioma = [string]$livro.Worksheets.Item("Read_First").Range("B5").Value2
    rotulos = [ordered]@{ escala1 = [string](Celula "Results" "K3"); item1Esquerda = [string](Celula "Results" "F3") }
  }
  $json = $resultado | ConvertTo-Json -Depth 6
  [System.IO.File]::WriteAllText($Saida, $json, (New-Object System.Text.UTF8Encoding $false))
  $livro.Close($false)
} finally {
  $excel.Quit()
  [System.Runtime.InteropServices.Marshal]::ReleaseComObject($excel) | Out-Null
  Remove-Item -LiteralPath $copia -ErrorAction SilentlyContinue
}
