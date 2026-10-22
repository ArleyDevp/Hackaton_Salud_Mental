# Instala la skill `impeccable` de pbakaus/impeccable descargando archivo a
# archivo desde raw.githubusercontent.com (el zip está bloqueado en esta red).
# Uso: powershell -File scripts\instalar-impeccable.ps1
$ErrorActionPreference = 'Stop'

$REPO = 'pbakaus/impeccable'
$BASE = '.agents/skills/impeccable'
$DEST = Join-Path $env:USERPROFILE '.agents\skills\impeccable'

function Log($m) { Write-Host $m }

# 1. Árbol completo del repositorio
$headers = @{ 'User-Agent' = 'impeccable-installer' }
$tree = Invoke-RestMethod -Uri "https://api.github.com/repos/$REPO/git/trees/main?recursive=1" -Headers $headers -TimeoutSec 60
if ($tree.truncated) { Log 'AVISO: el árbol vino truncado' }

$files = @($tree.tree | Where-Object { $_.type -eq 'blob' -and $_.path -like "$BASE/*" })
Log ("Archivos a descargar: " + $files.Count)

if ($files.Count -eq 0) { throw "No se encontraron archivos en $BASE" }

# 2. Limpia cualquier instalación hueca previa
if (Test-Path $DEST) {
  $previos = (Get-ChildItem $DEST -Recurse -File -ErrorAction SilentlyContinue | Measure-Object).Count
  if ($previos -eq 0) { Remove-Item $DEST -Recurse -Force; Log 'Instalación previa vacía eliminada' }
}

# 3. Descarga uno a uno
$ok = 0; $fallo = @(); $i = 0
foreach ($f in $files) {
  $i++
  $rel = $f.path.Substring($BASE.Length + 1)
  $ruta = Join-Path $DEST $rel
  $dir = Split-Path $ruta -Parent
  if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }

  $url = "https://raw.githubusercontent.com/$REPO/main/" + ($f.path -replace ' ', '%20')
  try {
    Invoke-WebRequest -Uri $url -OutFile $ruta -UseBasicParsing -TimeoutSec 60
    $ok++
  } catch {
    $fallo += $rel
    Log ("  FALLA: " + $rel + " -> " + $_.Exception.Message.Substring(0, [Math]::Min(60, $_.Exception.Message.Length)))
  }

  if ($i % 15 -eq 0) { Log ("  ... " + $i + "/" + $files.Count) }
}

# 4. Verificación: SKILL.md debe existir y pesar algo
$skillMd = Join-Path $DEST 'SKILL.md'
$skillOk = (Test-Path $skillMd) -and ((Get-Item $skillMd).Length -gt 200)

Log ''
Log ('DESCARGADOS : ' + $ok + '/' + $files.Count)
Log ('FALLARON    : ' + $fallo.Count + $(if ($fallo.Count) { ' -> ' + ($fallo -join ', ') } else { '' }))
Log ('SKILL.md    : ' + $(if ($skillOk) { 'OK (' + (Get-Item $skillMd).Length + ' bytes)' } else { 'AUSENTE O VACIO' }))
Log ('DESTINO     : ' + $DEST)

if (-not $skillOk) { exit 1 }
exit 0
