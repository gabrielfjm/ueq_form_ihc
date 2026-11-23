# Confere, célula a célula e em todas as abas, a planilha oficial exportada pela ferramenta contra a do Excel.
# Referência: uma cópia do modelo oficial com o respostas.csv colado em Data!A4, o mesmo idioma em Read_First, a
# aba KPI_Calculation sem as importâncias de exemplo e recalculada (CalculateFull). Exportada: aberta no Modo de
# Exibição Protegido, que não recalcula, como um arquivo baixado da internet. Assim só passa se os resultados que
# a ferramenta grava no arquivo forem os mesmos que o Excel calcula. Nunca salva nenhuma das duas.
#
# UEQ:   .\scripts\planilha-oficial-celulas.ps1 -Modelo data\planilha-oficial\UEQ_Data_Analysis_Tool_V15.xlsx `
#          -Csv data\fixtures\basico\respostas.csv -Exportada exportada.xlsx -Idioma Portuguese -SemKpi
# UEQ-S: .\scripts\planilha-oficial-celulas.ps1 -Modelo data\planilha-oficial\Short_UEQ_Data_Analysis_Tool_V15.xlsx `
#          -Csv data\fixtures-ueq-s\bordas\respostas.csv -Exportada exportada.xlsx -Colunas 8 -CelulaIdioma B4
param(
  [Parameter(Mandatory = $true)][string]$Modelo,
  [Parameter(Mandatory = $true)][string]$Csv,
  [Parameter(Mandatory = $true)][string]$Exportada,
  [int]$Colunas = 26,
  [string]$CelulaIdioma = "B5",
  [string]$Idioma = "Portuguese",
  [switch]$SemKpi
)
$ErrorActionPreference = "Stop"
$copiaReferencia = Join-Path ([System.IO.Path]::GetTempPath()) ("ueq-ref-" + [guid]::NewGuid() + ".xlsx")
$copiaExportada = Join-Path ([System.IO.Path]::GetTempPath()) ("ueq-exp-" + [guid]::NewGuid() + ".xlsx")
Copy-Item -LiteralPath $Modelo -Destination $copiaReferencia
Copy-Item -LiteralPath $Exportada -Destination $copiaExportada

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false
$excel.ScreenUpdating = $false
$total = 0
$totalDiferencas = 0
try {
  $ref = $excel.Workbooks.Open($copiaReferencia, 0, $false)
  $dados = $ref.Worksheets.Item("Data")
  $linhas = @(Get-Content -LiteralPath $Csv | Where-Object { $_.Trim() -ne "" })
  $n = $linhas.Count
  $dados.Range("A4:AA1004").ClearContents() | Out-Null
  if ($n -gt 0) {
    $matriz = New-Object 'object[,]' $n, $Colunas
    for ($i = 0; $i -lt $n; $i++) {
      $valores = $linhas[$i].Split(";")
      for ($j = 0; $j -lt $Colunas; $j++) { $matriz[$i, $j] = [double]$valores[$j] }
    }
    $dados.Range("A4").Resize($n, $Colunas).Value2 = $matriz
  }
  $ref.Worksheets.Item("Read_First").Range($CelulaIdioma).Value2 = $Idioma
  if ($SemKpi) { $ref.Worksheets.Item("KPI_Calculation").Range("A4:F1004").ClearContents() | Out-Null }
  $excel.CalculateFull()

  $janela = $excel.ProtectedViewWindows.Open($copiaExportada)
  $exp = $janela.Workbook
  foreach ($aba in $ref.Worksheets) {
    $area = $aba.UsedRange
    $a = $area.Value2
    $b = $exp.Worksheets.Item($aba.Name).Range($area.Address()).Value2
    $diferencas = 0
    $exemplos = @()
    if ($a -is [array]) {
      for ($r = 1; $r -le $a.GetLength(0); $r++) {
        for ($c = 1; $c -le $a.GetLength(1); $c++) {
          $x = $a[$r, $c]
          $y = $b[$r, $c]
          $total++
          # Erros do Excel chegam como números inteiros (o código do erro) e são comparados como tal
          $igual = ($x -eq $y) -or (($x -is [double]) -and ($y -is [double]) -and [math]::Abs($x - $y) -le 1e-12 * [math]::Max(1, [math]::Abs($x)))
          if (("$x" -eq "") -and ("$y" -eq "")) { $igual = $true }
          if (-not $igual) {
            $diferencas++
            if ($exemplos.Count -lt 5) { $exemplos += ($area.Cells.Item($r, $c).Address($false, $false) + " excel=[" + $x + "] exportada=[" + $y + "]") }
          }
        }
      }
    }
    $totalDiferencas += $diferencas
    "{0,-22} {1,-14} diferencas={2}" -f $aba.Name, $area.Address($false, $false), $diferencas
    foreach ($e in $exemplos) { "    $e" }
  }
  "celulas comparadas: $total  diferencas: $totalDiferencas"
  $janela.Close() | Out-Null
  $ref.Close($false)
} finally {
  $excel.Quit()
  [System.Runtime.InteropServices.Marshal]::ReleaseComObject($excel) | Out-Null
  Remove-Item -LiteralPath $copiaReferencia, $copiaExportada -ErrorAction SilentlyContinue
}
