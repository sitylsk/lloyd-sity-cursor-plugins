# Install Build Origin into Cursor local plugins
$ErrorActionPreference = "Stop"
$src = Resolve-Path (Join-Path $PSScriptRoot "..")
$localRoot = Join-Path $env:USERPROFILE ".cursor\plugins\local"
$dst = Join-Path $localRoot "build-origin"
New-Item -ItemType Directory -Force -Path $localRoot | Out-Null
if (Test-Path $dst) { Remove-Item -Recurse -Force $dst }
try {
  cmd /c mklink /J "$dst" "$src" | Out-Null
  if (-not (Test-Path $dst)) { throw "junction failed" }
  Write-Host "Linked: $dst -> $src"
} catch {
  Copy-Item -Recurse -Force $src $dst
  Write-Host "Copied: $dst"
}
Write-Host "Reload Cursor window, then run /build-origin-on"
