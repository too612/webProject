#Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

param(
    [Parameter(Mandatory = $true)]
    [ValidateSet('start', 'stop', 'restart', 'status', 'force-kill')]
    [string]$Action
)

chcp 65001 | Out-Null
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::InputEncoding  = [System.Text.Encoding]::UTF8
$OutputEncoding            = [System.Text.Encoding]::UTF8

$ErrorActionPreference = 'Stop'

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptRoot
$targetScript = Join-Path $projectRoot 'frontend\autoBuild\dev-server-control.ps1'

if (-not (Test-Path -LiteralPath $targetScript)) {
    throw "대상 스크립트를 찾을 수 없습니다: $targetScript"
}

& $targetScript -Action $Action
