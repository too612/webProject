from pathlib import Path
import re
from openpyxl import Workbook

BASE = Path(r"C:\privWork\workspace\webProject")
TABLE_DIR = BASE / "docs" / "table"
OUT_PATH = BASE / "docs" / "sample.xlsx"


COLUMN_LABELS = {
    "dept_cd": "부서코드",
    "dept_nm": "부서명",
    "dept_key": "부서내부키",
    "reorg_key": "조직개편키",
    "reorg_dt": "조직개편일자",
    "conf_yn": "확정여부",
    "use_yn": "사용여부",
    "eng_dept_nm": "부서영문명",
    "parent_dept_key": "상위부서키",
    "dept_level": "부서레벨",
    "change_type_cd": "변경구분코드",
    "chef_emp_no": "부서장사번",
    "dept_sys_cd": "원시스템코드",
    "remark": "비고",
    "reg_user": "등록자",
    "reg_dtm": "등록일시",
    "reg_ip": "등록IP",
    "upd_user": "수정자",
    "upd_dtm": "수정일시",
    "upd_ip": "수정IP",
    "ai_profile": "AI프로필",
    "extra_attributes": "추가속성",
    "employee_no": "사번",
    "name_ko": "이름",
    "name_en": "영문이름",
    "name_hanja": "한자이름",
    "gender_code": "성별코드",
    "birth_date": "생년월일",
    "hire_date": "입사일자",
    "retire_date": "퇴사일자",
    "promotion_date": "승진일자",
    "grade_code": "직급코드",
    "position_code": "직위코드",
    "employment_type_code": "고용형태코드",
    "service_status_code": "재직구분코드",
    "photo_url": "사진URL",
    "profile_photo_url": "프로필사진URL",
    "person_key": "사원내부키",
    "assignment_key": "발령내부키",
    "assignment_date": "발령일자",
    "assignment_type_code": "발령유형코드",
    "assignment_content": "발령내용",
    "assignment_end_date": "발령종료일",
    "concurrent_assignment_yn": "겸직여부",
    "dispatch_country_code": "파견국가코드",
    "history_id": "연혁ID",
    "year_label": "연도표시",
    "year_no": "연도",
    "event_id": "이벤트ID",
    "event_date": "이벤트일",
    "description": "설명",
    "images": "이미지",
    "header_key": "헤더키",
    "headline": "제목",
    "summary": "요약",
    "sort_order": "정렬순서",
    "category": "분류",
    "title": "제목",
    "time": "시간",
    "location": "장소",
    "order_no": "순서",
    "role_id": "역할ID",
    "role_name": "역할명",
    "is_active": "활성여부",
    "description": "설명",
    "user_id": "사용자ID",
    "is_primary": "대표여부",
    "program_id": "프로그램ID",
    "program_name": "프로그램명",
    "parent_program_id": "상위프로그램ID",
    "country_code": "국가코드",
    "country_name": "국가명",
    "country_name_ko": "국가명(한글)",
    "country_name_en": "국가명(영문)",
    "phone_no": "전화번호",
    "email": "이메일",
    "address": "주소",
    "zipcode": "우편번호",
    "created_at": "생성일시",
    "updated_at": "수정일시",
    "deleted_yn": "삭제여부",
}


def to_label(column_name: str) -> str:
    if column_name in COLUMN_LABELS:
        return COLUMN_LABELS[column_name]

    name = column_name.strip()
    if name.endswith("_key"):
        return name[:-4].replace("_", " ") + " 내부키"
    if name.endswith("_cd"):
        return name[:-3].replace("_", " ") + " 코드"
    if name.endswith("_nm"):
        return name[:-3].replace("_", " ") + " 명"
    if name.endswith("_yn"):
        return name[:-3].replace("_", " ") + " 여부"
    if name.endswith("_date"):
        return name[:-5].replace("_", " ") + " 일자"
    if name.endswith("_no"):
        return name[:-3].replace("_", " ") + " 번호"
    if name.endswith("_id"):
        return name[:-3].replace("_", " ") + " ID"
    if name.endswith("_url"):
        return name[:-4].replace("_", " ") + " URL"
    if name.endswith("_ip"):
        return name[:-3].replace("_", " ") + " IP"
    if name.endswith("_type"):
        return name[:-5].replace("_", " ") + " 유형"
    if name.endswith("_name"):
        return name[:-5].replace("_", " ") + " 이름"
    return name.replace("_", " ")


def split_top_level(raw: str, delimiter: str = ","):
    out = []
    buffer = []
    depth = 0
    in_single = False
    for idx, ch in enumerate(raw):
        if ch == "'" and (idx == 0 or raw[idx - 1] != "\\"):
            in_single = not in_single
        elif not in_single:
            if ch == "(":
                depth += 1
            elif ch == ")":
                depth -= 1
            elif ch == delimiter and depth == 0:
                part = ''.join(buffer).strip()
                if part:
                    out.append(part)
                buffer = []
                continue
        buffer.append(ch)
    tail = ''.join(buffer).strip()
    if tail:
        out.append(tail)
    return out


def parse_literal(token: str):
    token = token.strip()
    if token in ("", "NULL"):
        return ""
    token = re.sub(r"::[A-Za-z0-9_]+$", "", token)
    token = token.replace("DATE ", "").replace("TIMESTAMPTZ ", "").replace("INET ", "").replace("::date", "").replace("::text", "")
    if token.startswith("'") and token.endswith("'"):
        return token[1:-1].replace("''", "'")
    if token.startswith("\"") and token.endswith("\""):
        return token[1:-1]
    if re.fullmatch(r"-?\d+", token):
        return int(token)
    if re.fullmatch(r"-?\d+\.\d+", token):
        return float(token)
    return token


def parse_rows_from_values(seed_text: str):
    rows = []
    idx = 0
    while idx < len(seed_text):
        match = re.search(r"VALUES", seed_text[idx:], re.I)
        if not match:
            break
        start = idx + match.start() + len(match.group(0))
        while start < len(seed_text) and seed_text[start].isspace():
            start += 1
        if start >= len(seed_text) or seed_text[start] != '(':
            idx = idx + match.start() + 1
            continue
        depth = 0
        in_single = False
        j = start
        capture_begin = start
        while j < len(seed_text):
            ch = seed_text[j]
            if ch == "'" and (j == 0 or seed_text[j - 1] != "\\"):
                in_single = not in_single
            elif not in_single:
                if ch == "(":
                    depth += 1
                elif ch == ")":
                    depth -= 1
                    if depth == 0:
                        block = seed_text[capture_begin:j+1]
                        inner = block[1:-1]
                        # split groups of row tuples at top level comma between tuples
                        tuple_groups = split_top_level(inner, ",")
                        for group in tuple_groups:
                            group = group.strip()
                            if group.startswith("(") and group.endswith(")"):
                                group = group[1:-1]
                            cells = [parse_literal(v) for v in split_top_level(group, ",")]
                            if cells and any(str(c) != "" for c in cells):
                                rows.append(cells)
                        idx = j + 1
                        break
            j += 1
        else:
            break
    return rows


def parse_ddl_columns(ddl_text: str):
    m = re.search(r"CREATE\s+TABLE\s+IF\s+NOT\s+EXISTS\s+([A-Za-z0-9_]+)\s*\((.*?)\)\s*;", ddl_text, re.S | re.I)
    if not m:
        return None, []
    table_name = m.group(1)
    body = m.group(2)
    cols = []
    for part in split_top_level(body, ","):
        part = part.strip()
        if not part:
            continue
        if re.match(r"^(CONSTRAINT|PRIMARY|UNIQUE|FOREIGN|CHECK|INDEX|COMMENT|CREATE|ALTER|ON|USING|WITH|WITHOUT)\b", part, re.I):
            continue
        match = re.match(r"([A-Za-z0-9_]+)\b", part)
        if match:
            cols.append(match.group(1))
    return table_name, cols


def worksheet_name(table_name: str, used_names):
    base = table_name[:31]
    candidate = base
    index = 1
    while candidate in used_names:
        candidate = f"{table_name[:27]}_{index}"
        index += 1
    used_names.add(candidate)
    return candidate


pairs = {}
for path in sorted(TABLE_DIR.glob("*.sql")):
    name = path.name
    if name.endswith("_seed.sql"):
        key = name[:-10]
        pairs.setdefault(key, {})["seed"] = path
    else:
        key = name[:-4]
        pairs.setdefault(key, {})["ddl"] = path

wb = Workbook()
used_names = set()
created = []
for table_key in sorted(pairs):
    info = pairs[table_key]
    ddl_path = info.get("ddl")
    seed_path = info.get("seed")
    if ddl_path is None or seed_path is None:
        continue

    ddl_text = ddl_path.read_text(encoding="utf-8")
    seed_text = seed_path.read_text(encoding="utf-8")
    table_name, ddl_cols = parse_ddl_columns(ddl_text)
    if not table_name:
        continue

    rows = parse_rows_from_values(seed_text)
    if not rows:
        continue

    ws = wb.active
    ws.title = worksheet_name(table_name, used_names)
    created.append(table_name)

    # Row 1 = logical names, Row 2 = physical names, data rows start at row 3.
    col_count = max(len(ddl_cols), max(len(r) for r in rows))
    logical = [to_label(c) for c in ddl_cols[:col_count]] + ["" for _ in range(col_count - len(ddl_cols[:col_count]))]
    physical = [c for c in ddl_cols[:col_count]] + ["" for _ in range(col_count - len(ddl_cols[:col_count]))]
    ws.append(logical)
    ws.append(physical)
    for row in rows:
        norm = list(row[:col_count]) + [""] * max(0, col_count - len(row[:col_count]))
        ws.append(norm)

    for col in ws.columns:
        max_len = 0
        for cell in col:
            if cell.value is not None:
                max_len = max(max_len, len(str(cell.value)))
        ws.column_dimensions[col[0].column_letter].width = min(max_len + 2, 30)

    # Add next sheet if more tables exist
    if len(created) < len(pairs):
        wb.create_sheet()

# Remove the leftover default blank sheet if present.
if wb.sheetnames and wb.sheetnames[0] == "Sheet":
    if len(wb.sheetnames) > 1:
        del wb["Sheet"]

wb.save(OUT_PATH)
print(f"saved={OUT_PATH.exists()} created_sheets={len(wb.sheetnames)}")
for name in wb.sheetnames[:3]:
    ws = wb[name]
    print("---", name, "rows=", ws.max_row, "cols=", ws.max_column)
    for row in ws.iter_rows(min_row=1, max_row=min(5, ws.max_row), values_only=True):
        print(row)
