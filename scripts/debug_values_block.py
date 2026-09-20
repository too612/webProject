import re
from pathlib import Path

text = Path(r'c:\privWork\workspace\webProject\docs\table\hrm_department_seed.sql').read_text(encoding='utf-8')
segment = text[text.rfind('INSERT INTO hrm_org_dept'):]
print('--- SEGMENT SAMPLE ---')
print(segment[:1500])
print('--- END SEGMENT SAMPLE ---')
match = re.search(r'VALUES\s*\(', segment, re.I)
print('MATCH FOUND', bool(match), 'index', match.start() if match else None)
if match:
    start = match.end() - 1
    depth = 0
    in_single = False
    in_double = False
    end = None
    for i in range(start, len(segment)):
        ch = segment[i]
        if in_single:
            if ch == "'" and (i == 0 or segment[i-1] != '\\'):
                in_single = False
        elif in_double:
            if ch == '"' and (i == 0 or segment[i-1] != '\\'):
                in_double = False
        else:
            if ch == "'":
                in_single = True
            elif ch == '"':
                in_double = True
            elif ch == '(':
                depth += 1
            elif ch == ')':
                depth -= 1
                if depth == 0:
                    end = i
                    break
    print('END', end)
    if end is not None:
        block = segment[start+1:end]
        print('BLOCK START', block[:250])
        print('BLOCK END', block[-250:])
