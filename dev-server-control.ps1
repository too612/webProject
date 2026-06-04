param(
    [Parameter(Mandatory = $true)]
    [ValidateSet('start', 'stop', 'restart', 'status', 'force-kill')]
    [string]$Action
)

Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$targetScript = Join-Path $scriptRoot 'scripts\dev-server-control.ps1'

if (-not (Test-Path -LiteralPath $targetScript)) {
    throw "대상 스크립트를 찾을 수 없습니다: $targetScript"
}

& $targetScript -Action $Action
