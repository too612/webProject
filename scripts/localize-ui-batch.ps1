$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

function Apply-Replacements {
    param(
        [string[]]$Files,
        [hashtable]$Map
    )

    foreach ($file in $Files) {
        if (-not (Test-Path $file)) { continue }

        $content = [System.IO.File]::ReadAllText($file)
        $updated = $content

        foreach ($key in $Map.Keys) {
            $updated = $updated.Replace($key, $Map[$key])
        }

        if ($updated -ne $content) {
            [System.IO.File]::WriteAllText($file, $updated, $utf8NoBom)
            Write-Output "UPDATED: $file"
        }
    }
}

$root = 'c:\privWork\workspace\webProject\frontend\src'

# 1) system + community
$systemCommunityFiles = @()
$systemCommunityFiles += (Get-ChildItem "$root\system" -Recurse -Filter *.tsx | Select-Object -ExpandProperty FullName)
$systemCommunityFiles += (Get-ChildItem "$root\community" -Recurse -Filter *.tsx | Select-Object -ExpandProperty FullName)

$systemCommunityMap = @{
    'No.</th>'   = '번호</th>'
    'Loading...' = '불러오는 중...'
}

Apply-Replacements -Files $systemCommunityFiles -Map $systemCommunityMap

# 2) erp common + entity labels
$erpFiles = (Get-ChildItem "$root\erp" -Recurse -Filter *.tsx | Select-Object -ExpandProperty FullName)

$erpMap = @{
    'Search keyword'           = '검색어를 입력하세요'
    '>Search<'                 = '>검색<'
    'Loading...'               = '불러오는 중...'
    'No records found.'        = '조회된 내역이 없습니다.'
    'Total {totalElements}'    = '총 {totalElements}건'
    '>Prev<'                   = '>이전<'
    '>Next<'                   = '>다음<'
    'No.</th>'                 = '번호</th>'

    'Student List'             = '수강생 목록'
    'Manage student data.'     = '수강생 데이터를 조회하고 관리합니다.'
    'Course List'              = '과정 목록'
    'Manage course data.'      = '과정 데이터를 조회하고 관리합니다.'
    'Complete List'            = '수료 목록'
    'Manage complete data.'    = '수료 데이터를 조회하고 관리합니다.'
    'Newcomer List'            = '새가족 목록'
    'Manage newcomer data.'    = '새가족 데이터를 조회하고 관리합니다.'
    'Attendance List'          = '출결 목록'
    'Manage attendance data.'  = '출결 데이터를 조회하고 관리합니다.'
    'Manager List'             = '관리 목록'
    'Manage manager data.'     = '관리 데이터를 조회하고 관리합니다.'
    'District List'            = '교구 목록'
    'Manage district data.'    = '교구 데이터를 조회하고 관리합니다.'
    'Change List'              = '변동 목록'
    'Manage change data.'      = '변동 데이터를 조회하고 관리합니다.'
    'Prayer List'              = '기도요청 목록'
    'Manage prayer data.'      = '기도요청 데이터를 조회하고 관리합니다.'
    'Notice List'              = '공지 목록'
    'Manage notice data.'      = '공지 데이터를 조회하고 관리합니다.'
    'Vehicle List'             = '차량 목록'
    'Manage vehicle data.'     = '차량 데이터를 조회하고 관리합니다.'
    'Newsletter List'          = '뉴스레터 목록'
    'Manage newsletter data.'  = '뉴스레터 데이터를 조회하고 관리합니다.'
    'Reservation List'         = '예약 목록'
    'Manage reservation data.' = '예약 데이터를 조회하고 관리합니다.'
    'Message List'             = '메시지 목록'
    'Manage message data.'     = '메시지 데이터를 조회하고 관리합니다.'
    'Maintenance List'         = '유지보수 목록'
    'Manage maintenance data.' = '유지보수 데이터를 조회하고 관리합니다.'
    'Inventory List'           = '비품 목록'
    'Manage inventory data.'   = '비품 데이터를 조회하고 관리합니다.'
    'Minutes List'             = '회의록 목록'
    'Manage minutes data.'     = '회의록 데이터를 조회하고 관리합니다.'
    'Result List'              = '결과 목록'
    'Manage result data.'      = '결과 데이터를 조회하고 관리합니다.'
    'Certificate List'         = '증명서 목록'
    'Manage certificate data.' = '증명서 데이터를 조회하고 관리합니다.'
    'Participant List'         = '참가자 목록'
    'Manage participant data.' = '참가자 데이터를 조회하고 관리합니다.'
}

Apply-Replacements -Files $erpFiles -Map $erpMap

# 3) official board-like pages
$officialFiles = @(
    "$root\official\news\registration\registrationPage.tsx",
    "$root\official\ministries\youth\youthPage.tsx",
    "$root\official\ministries\mission\missionPage.tsx"
)

$officialMap = @{
    'Failed to load board list.'                         = '게시글 목록을 불러오지 못했습니다.'
    'This is a secret comment. Only admins can view it.' = '비밀 댓글입니다. 관리자만 확인할 수 있습니다.'
    "'Cancel'"                                           = "'취소'"
    "'Reply'"                                            = "'답글'"
    'Saving...'                                          = '저장 중...'
    "'Save'"                                             = "'저장'"
    'Post deleted.'                                      = '게시글이 삭제되었습니다.'
    'Delete failed.'                                     = '삭제에 실패했습니다.'
    'Failed to save comment.'                            = '댓글 저장에 실패했습니다.'
    'Loading...'                                         = '불러오는 중...'
    'Attachments ('                                      = '첨부파일 ('
    'Comments '                                          = '댓글 '
    'No comments yet.'                                   = '등록된 댓글이 없습니다.'
    'Save Comment'                                       = '댓글 저장'
    '>List<'                                             = '>목록<'
    '>Edit<'                                             = '>수정<'
    '>Delete<'                                           = '>삭제<'
    '>Cancel<'                                           = '>취소<'
}

Apply-Replacements -Files $officialFiles -Map $officialMap

Write-Output 'BATCH_LOCALIZATION_DONE'
