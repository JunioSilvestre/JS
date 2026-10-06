import re

with open('app/infra/page.tsx', 'r') as f:
    content = f.read()

def add_parse(content, var_name):
    parse_func = f"(Array.isArray({var_name}) ? {var_name} : (typeof {var_name} === 'string' ? (() => {{ try {{ return JSON.parse({var_name}); }} catch {{ return []; }} }})() : []))"
    
    # Replace (p.reqs||[]) with the parse_func
    # But carefully since there are different variables
    content = content.replace(f"({var_name}||[])", parse_func)
    return content

content = add_parse(content, 'p.reqs')
content = add_parse(content, 'p.certs')
content = add_parse(content, 'p.prereqs')

# Also fix `(p.reqs || [])` spacing variation
content = content.replace("(p.reqs || [])", "(Array.isArray(p.reqs) ? p.reqs : (typeof p.reqs === 'string' ? (() => { try { return JSON.parse(p.reqs); } catch { return []; } })() : []))")

with open('app/infra/page.tsx', 'w') as f:
    f.write(content)
