# Install Clarity Gate into Cursor local plugins
$ErrorActionPreference = "Stop"

$src = Split-Path -Parent $PSScriptRoot
if (-not (Test-Path (Join-Path $src ".cursor-plugin\plugin.json"))) {
  # scripts/ is one level down from plugin root
  $src = Resolve-Path (Join-Path $PSScriptRoot "..")
}

$localRoot = Join-Path $env:USERPROFILE ".cursor\plugins\local"
$dst = Join-Path $localRoot "clarity-gate"

New-Item -ItemType Directory -Force -Path $localRoot | Out-Null

if (Test-Path $dst) {
  Remove-Item -Recurse -Force $dst
}

try {
  cmd /c mklink /J "$dst" "$src" | Out-Null
  if (-not (Test-Path $dst)) { throw "junction failed" }
  Write-Host "Linked: $dst -> $src"
} catch {
  Write-Host "Junction failed; copying instead..."
  Copy-Item -Recurse -Force $src $dst
  Write-Host "Copied: $dst"
}

Write-Host ""
Write-Host "Next: In Cursor, run Developer: Reload Window"
Write-Host "Then try Agent prompt: fix it"
Write-Host "You should see a Clarity Gate Resolve Board."
