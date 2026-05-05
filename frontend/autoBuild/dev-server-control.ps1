param(
    [Parameter(Mandatory = $true)]
    [ValidateSet('start', 'stop', 'restart', 'status', 'force-kill')]
    [string]$Action
)

chcp 65001 | Out-Null
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::InputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

$ErrorActionPreference = 'Stop'

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$frontendRoot = Split-Path -Parent $scriptRoot
$projectRoot = Split-Path -Parent $frontendRoot
$stateDir = Join-Path $scriptRoot '.runtime'
$stateFile = Join-Path $stateDir 'dev-server-state.json'

$backendDir = $projectRoot
$frontendDir = $frontendRoot

$backendPort = 8080
$frontendPort = 5173

if (-not (Test-Path $stateDir)) {
    New-Item -Path $stateDir -ItemType Directory -Force | Out-Null
}

function Write-Info([string]$Message) {
    Write-Host "[INFO] $Message" -ForegroundColor Cyan
}

function Write-Warn([string]$Message) {
    Write-Host "[WARN] $Message" -ForegroundColor Yellow
}

function Write-Ok([string]$Message) {
    Write-Host "[OK]   $Message" -ForegroundColor Green
}

function Get-State {
    if (-not (Test-Path $stateFile)) {
        return $null
    }

    try {
        return Get-Content -Path $stateFile -Raw | ConvertFrom-Json
    }
    catch {
        Write-Warn "상태 파일 파싱에 실패했습니다. 상태 파일을 초기화합니다."
        Remove-Item -Path $stateFile -Force -ErrorAction SilentlyContinue
        return $null
    }
}

function Save-State([hashtable]$State) {
    $State | ConvertTo-Json -Depth 5 | Set-Content -Path $stateFile -Encoding UTF8
}

function Remove-State {
    if (Test-Path $stateFile) {
        Remove-Item -Path $stateFile -Force -ErrorAction SilentlyContinue
    }
}

function Get-ProcessSafe([Nullable[int]]$ProcessId) {
    if (-not $ProcessId) {
        return $null
    }

    try {
        return Get-Process -Id $ProcessId -ErrorAction Stop
    }
    catch {
        return $null
    }
}

function Get-ListenerByPort([int]$Port) {
    try {
        return Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction Stop | Select-Object -First 1
    }
    catch {
        return $null
    }
}

function Get-OwnerPidByPort([int]$Port) {
    $listener = Get-ListenerByPort -Port $Port
    if ($null -eq $listener) {
        return $null
    }

    return [int]$listener.OwningProcess
}

function Show-Status {
    $state = Get-State

    $backendPid = $null
    $frontendPid = $null

    if ($state) {
        $backendPid = if ($state.backendPid) { [int]$state.backendPid } else { $null }
        $frontendPid = if ($state.frontendPid) { [int]$state.frontendPid } else { $null }
    }

    $backendProcess = Get-ProcessSafe -ProcessId $backendPid
    $frontendProcess = Get-ProcessSafe -ProcessId $frontendPid

    $backendPortPid = Get-OwnerPidByPort -Port $backendPort
    $frontendPortPid = Get-OwnerPidByPort -Port $frontendPort

    Write-Host '=== Dev Server Status ===' -ForegroundColor Magenta
    Write-Host "Backend PID (state):  $backendPid"
    Write-Host "Backend PID (port $backendPort):  $backendPortPid"
    Write-Host "Frontend PID (state): $frontendPid"
    Write-Host "Frontend PID (port $frontendPort): $frontendPortPid"

    if ($backendProcess) {
        Write-Ok "백엔드 콘솔 프로세스 실행 중 (PID: $($backendProcess.Id))"
    }
    else {
        Write-Warn '백엔드 콘솔 프로세스는 실행 중이 아닙니다.'
    }

    if ($frontendProcess) {
        Write-Ok "프론트 콘솔 프로세스 실행 중 (PID: $($frontendProcess.Id))"
    }
    else {
        Write-Warn '프론트 콘솔 프로세스는 실행 중이 아닙니다.'
    }

    if (-not $backendProcess -and -not $frontendProcess -and -not $backendPortPid -and -not $frontendPortPid) {
        Write-Info '현재 실행 중인 개발 서버가 감지되지 않았습니다.'
    }
}

function Close-ProcessWindow([Nullable[int]]$ProcessId, [string]$Name) {
    $process = Get-ProcessSafe -ProcessId $ProcessId
    if (-not $process) {
        Write-Info "$Name 프로세스가 이미 종료되어 있습니다."
        return
    }

    if ($process.MainWindowHandle -ne 0) {
        Write-Info "$Name 콘솔 창 정상 종료를 시도합니다. (PID: $ProcessId)"
        $null = $process.CloseMainWindow()
        Start-Sleep -Seconds 2
    }

    $process = Get-ProcessSafe -ProcessId $ProcessId
    if ($process) {
        Write-Warn "$Name 프로세스가 남아 있습니다. 강제 종료합니다. (PID: $ProcessId)"
        Stop-Process -Id $ProcessId -Force -ErrorAction SilentlyContinue
    }
    else {
        Write-Ok "$Name 프로세스가 정상 종료되었습니다."
    }
}

function Stop-Servers {
    $state = Get-State

    $backendPid = $null
    $frontendPid = $null

    if ($state) {
        $backendPid = if ($state.backendPid) { [int]$state.backendPid } else { $null }
        $frontendPid = if ($state.frontendPid) { [int]$state.frontendPid } else { $null }
    }

    Close-ProcessWindow -ProcessId $backendPid -Name '백엔드'
    Close-ProcessWindow -ProcessId $frontendPid -Name '프론트'

    Remove-State
    Write-Ok '서버 상태를 정리했습니다.'
}

function Start-Servers {
    $backendPortOwner = Get-OwnerPidByPort -Port $backendPort
    $frontendPortOwner = Get-OwnerPidByPort -Port $frontendPort

    if ($backendPortOwner -or $frontendPortOwner) {
        Write-Warn '이미 점유된 개발 포트가 있어 start를 중단합니다. status 또는 force-kill을 먼저 실행하세요.'
        Show-Status
        return
    }

    $encInit = "chcp 65001 | Out-Null; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; [Console]::InputEncoding = [System.Text.Encoding]::UTF8; `$OutputEncoding = [System.Text.Encoding]::UTF8; "
    $backendCommand = $encInit + "Set-Location -LiteralPath '$backendDir'; .\\gradlew.bat bootRun"
    $frontendCommand = $encInit + "Set-Location -LiteralPath '$frontendDir'; npm run dev"

    Write-Info '백엔드 서버 창을 시작합니다.'
    $backendProc = Start-Process -FilePath 'powershell.exe' -ArgumentList @('-NoExit', '-NoLogo', '-Command', $backendCommand) -PassThru

    Write-Info '프론트 서버 창을 시작합니다.'
    $frontendProc = Start-Process -FilePath 'powershell.exe' -ArgumentList @('-NoExit', '-NoLogo', '-Command', $frontendCommand) -PassThru

    $newState = @{
        backendPid   = $backendProc.Id
        frontendPid  = $frontendProc.Id
        backendPort  = $backendPort
        frontendPort = $frontendPort
        startedAt    = (Get-Date).ToString('s')
        projectRoot  = $projectRoot
    }

    Save-State -State $newState

    Write-Ok "백엔드 시작됨 (콘솔 PID: $($backendProc.Id))"
    Write-Ok "프론트 시작됨 (콘솔 PID: $($frontendProc.Id))"
    Write-Info '초기 기동에는 시간이 필요합니다. status로 포트 리스닝 상태를 확인하세요.'
}

function Force-Kill {
    $state = Get-State

    if ($state) {
        foreach ($pidValue in @($state.backendPid, $state.frontendPid)) {
            if ($pidValue) {
                try {
                    Stop-Process -Id ([int]$pidValue) -Force -ErrorAction SilentlyContinue
                }
                catch {
                }
            }
        }
    }

    foreach ($port in @($backendPort, $frontendPort)) {
        $ownerPid = Get-OwnerPidByPort -Port $port
        if ($ownerPid) {
            Write-Warn "포트 $port 점유 프로세스 강제 종료 (PID: $ownerPid)"
            try {
                Stop-Process -Id $ownerPid -Force -ErrorAction Stop
                Write-Ok "포트 $port 해제 완료"
            }
            catch {
                Write-Warn "포트 $port 프로세스 종료 실패: $($_.Exception.Message)"
            }
        }
        else {
            Write-Info "포트 $port 는 점유 중이 아닙니다."
        }
    }

    Remove-State
    Write-Ok '강제 종료 및 상태 정리를 완료했습니다.'
}

switch ($Action) {
    'status' {
        Show-Status
    }
    'stop' {
        Stop-Servers
    }
    'start' {
        Start-Servers
    }
    'restart' {
        Stop-Servers
        Start-Sleep -Milliseconds 600
        Start-Servers
    }
    'force-kill' {
        Force-Kill
    }
}
