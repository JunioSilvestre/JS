import re

with open('app/infra/page.tsx', 'r') as f:
    content = f.read()

# Delete defaultCategories
content = re.sub(r'const defaultCategories = \[.*?\];', '', content, flags=re.DOTALL)

# Delete seedProjects
content = re.sub(r'const seedProjects: Record<string, any\[\]> = \{.*?\n    \};', '', content, flags=re.DOTALL)

with open('app/infra/page.tsx', 'w') as f:
    f.write(content)
