import re
with open('app/infra/page.tsx', 'r') as f:
    content = f.read()

# Replace the start of the block comment
content = content.replace("/*const defaultCategories = [", "const defaultCategories = [")
# The end of the block comment was "*/\n" before `if (!customStore.categories)` which I had deleted.
content = content.replace("    */\n", "    ")

with open('app/infra/page.tsx', 'w') as f:
    f.write(content)
