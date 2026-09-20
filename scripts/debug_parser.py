import re
from pathlib import Path

seed_path = Path(r'c:\privWork\workspace\webProject\docs\table\hrm_department_seed.sql')
text = seed_path.read_text(encoding='utf-8')

def split_top_level(text: str, delim: str = ','):
    parts = []
    buf = []
    depth = 0
    in_single = False
    for i, ch in enumerate(text):
        if ch == "'" and (i == 0 or text[i-1] != "\\"):
            in_single = not in_single
        elif not in_single:
            if ch == '(':
                depth += 1
            elif ch == ')':
                depth -= 1
            elif ch == delim and depth == 0:
                part = ''.join(buf).strip()
                if part:
                    parts.append(part)
                buf = []
                continue
        buf.append(ch)
    tail = ''.join(buf).strip()
    if tail:
        parts.append(tail)
    return parts

m = list(re.finditer(r'INSERT\s+INTO\s+hrm_org_dept\b', text, re.I))[-1]
seg = text[m.start():]
print('SEG START:')
print(seg[:500])
print('---')
values_positions = [p.start() for p in re.finditer(r'VALUES', seg, re.I)]
print('values_positions', values_positions)
for p in values_positions[:5]:
    open_paren = seg.find('(', p)
    if open_paren < 0:
        continue
    depth = 0; in_single = False; end = None
    for i in range(open_paren, len(seg)):
        ch = seg[i]
        if ch == "'" and (i == 0 or seg[i-1] != "\\"):
            in_single = not in_single
        elif not in_single:
            if ch == '(':
                depth += 1
            elif ch == ')':
                depth -= 1
                if depth == 0:
                    end = i
                    break
    block = seg[open_paren+1:end]
    tuple_items = split_top_level(block, ',')
    print('--- values block sample ---')
    print('tuple_items count', len(tuple_items))
    print(tuple_items[:2])
    break
