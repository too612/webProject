import re
from pathlib import Path

text = Path(r'c:\privWork\workspace\webProject\docs\table\hrm_department_seed.sql').read_text(encoding='utf-8')

def split_top_level(text, delim=','):
    parts=[]; buf=[]; depth=0; in_single=False
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
                buf=[]
                continue
        buf.append(ch)
    tail=''.join(buf).strip()
    if tail: parts.append(tail)
    return parts

rows=[]
for values_match in re.finditer(r'VALUES\s*\(', text, re.I):
    start = values_match.end()-1
    depth = 0; in_single = False; in_double = False; end = None
    for i in range(start, len(text)):
        ch = text[i]
        if ch == "'" and not in_double:
            if in_single and (i == 0 or text[i-1] != "\\"):
                in_single = False
            elif not in_single:
                in_single = True
        elif ch == '"' and not in_single:
            if in_double and (i == 0 or text[i-1] != "\\"):
                in_double = False
            elif not in_double:
                in_double = True
        elif not in_single and not in_double:
            if ch == '(':
                depth += 1
            elif ch == ')':
                depth -= 1
                if depth == 0:
                    end = i
                    break
    if end is None:
        continue
    block = text[start+1:end]
    tuples = split_top_level(block)
    print('TUPLES', len(tuples))
    for idx, tuple_text in enumerate(tuples[:3]):
        clean = tuple_text.strip()
        if clean.startswith('(') and clean.endswith(')'):
            clean = clean[1:-1]
        cells = [c.strip() for c in split_top_level(clean)]
        print('ROW', idx, 'LEN', len(cells), cells[:6])
    break
