import re

with open('app/infra/page.tsx', 'r') as f:
    content = f.read()

# Replace Imports
content = re.sub(
    r'(import \{ ArrowLeft \} from "lucide-react";)',
    r'\1\nimport { apiGetInfraCategories, apiCreateInfraCategory, apiGetInfraProjects, apiCreateInfraProject, apiUpdateInfraProject, apiDeleteInfraProject } from "@/lib/api";',
    content
)

# Replace data loading
content = content.replace(
    'const defaultCategories = [',
    'let apiCats: any[] = [];\n    let apiProjs: any[] = [];\n\n    const loadData = async () => {\n      try {\n        const catsRes = await apiGetInfraCategories();\n        const projsRes = await apiGetInfraProjects();\n        apiCats = catsRes.data || [];\n        apiProjs = projsRes.data || [];\n        renderAll();\n      } catch (e) { console.error(e); }\n    };\n    loadData();\n\n    /*const defaultCategories = ['
)

content = content.replace(
    "let customStore = JSON.parse(localStorage.getItem('projetosInfraCustom') || '{\"categories\":[],\"projects\":{}}');",
    "*/\n"
)

content = content.replace(
    "if (!customStore.categories) customStore.categories = [];\n    if (!customStore.projects) customStore.projects = {};",
    ""
)

content = content.replace(
    "function saveCustomStore() {\n      localStorage.setItem('projetosInfraCustom', JSON.stringify(customStore));\n    }",
    ""
)

content = content.replace(
    "function getCategories() {\n      const map = new Map();\n      defaultCategories.forEach(c => map.set(c.id, { ...c }));\n      customStore.categories.forEach((c: any) => map.set(c.id, { ...c, custom: true }));\n      return Array.from(map.values());\n    }",
    "function getCategories() { return apiCats; }"
)

content = content.replace(
    "function getProjects(catId: string) {\n      const seed = seedProjects[catId] || [];\n      const extra = customStore.projects[catId] || [];\n      return [...seed, ...extra];\n    }",
    "function getProjects(catId: string) { return apiProjs.filter((p: any) => p.category_id === catId); }"
)

content = content.replace(
    "let state = JSON.parse(localStorage.getItem('projetosInfraState') || '{}');",
    ""
)

content = content.replace(
    "function getProjectData(id: string) {\n      if (!state[id]) state[id] = { status:'todo', notes:'', code:'', concepts:{}, checklist:{} };\n      if (!state[id].checklist) state[id].checklist = {};\n      return state[id];\n    }",
    "function getProjectData(id: string) {\n      const p = apiProjs.find((x: any) => x.id === id);\n      if (!p) return { status:'todo', notes:'', code:'', concepts:{}, checklist:{} };\n      return { status: p.status || 'todo', notes: p.interview || '', code: p.scenario || '', concepts: p.concepts || {}, checklist: p.checklist || {} };\n    }"
)

content = content.replace(
    "function saveState() { localStorage.setItem('projetosInfraState', JSON.stringify(state)); }",
    ""
)

content = content.replace(
    "      saveState();",
    ""
)

content = content.replace(
    "(window as any).ProjetosSenior = {\n      registerCategory(cat: any) {\n        if (!cat?.id || !cat?.label) throw new Error('Informe id e label da categoria');\n        const id = String(cat.id).toLowerCase().replace(/[^a-z0-9_-]/g, '');\n        const entry = { id, label: cat.label, type: cat.type || 'projects', color: cat.color || 'emerald', custom: true };\n        customStore.categories = customStore.categories.filter((c: any) => c.id !== id);\n        customStore.categories.push(entry);\n        if (!customStore.projects[id]) customStore.projects[id] = [];\n        saveCustomStore();\n        renderAll();\n        return entry;\n      },",
    "// ProjetosSenior APIs replaced with async handlers"
)

content = re.sub(r'registerProject\(.*?\},', '', content, flags=re.DOTALL)
content = re.sub(r'listCategories: \(\) => getCategories\(\),.*?removeProject\(catId: string, projectId: string\) \{.*?\}\n    \};', '', content, flags=re.DOTALL)

# Let's fix saveCurrentProject to use apiUpdateInfraProject
content = content.replace(
    "function saveCurrentProject() {",
    "async function saveCurrentProject() {"
)

content = content.replace(
    "document.querySelectorAll('[data-check]').forEach(cb => { data.checklist[(cb as HTMLElement).dataset.check!] = (cb as HTMLInputElement).checked; });",
    "document.querySelectorAll('[data-check]').forEach(cb => { data.checklist[(cb as HTMLElement).dataset.check!] = (cb as HTMLInputElement).checked; });\n      \n      try {\n        await apiUpdateInfraProject(currentProject.id, {\n          status: data.status,\n          interview: data.notes,\n          scenario: data.code,\n          concepts: data.concepts,\n          checklist: data.checklist\n        });\n        await loadData();\n      } catch (e) { console.error(e); }"
)

# Fix closeDetail to be async
content = content.replace(
    "function closeDetail() {\n      saveCurrentProject();",
    "async function closeDetail() {\n      await saveCurrentProject();"
)

# Fix UI bindings
content = content.replace(
    "if (btnBack) btnBack.onclick = closeDetail;",
    "if (btnBack) btnBack.onclick = async () => await closeDetail();"
)

content = content.replace(
    "if (btnSaveAll) btnSaveAll.onclick = () => {\n      saveCurrentProject();\n      btnSaveAll.textContent = 'Salvo!';\n      setTimeout(() => btnSaveAll.textContent = 'Salvar', 1000);\n    };",
    "if (btnSaveAll) btnSaveAll.onclick = async () => {\n      await saveCurrentProject();\n      btnSaveAll.textContent = 'Salvo!';\n      setTimeout(() => btnSaveAll.textContent = 'Salvar', 1000);\n    };"
)

content = content.replace(
    "const entry = (window as any).ProjetosSenior.registerCategory({\n          id: catIdEl?.value.trim(),\n          label: catLabelEl?.value.trim()\n        });",
    "const catId = catIdEl?.value.trim();\n        if (!catId) throw new Error('Invalid ID');\n        const entry = { id: catId, label: catLabelEl?.value.trim(), type: 'projects' };\n        apiCreateInfraCategory(entry).then(() => loadData());"
)

content = content.replace(
    "(window as any).ProjetosSenior.registerProject(\n          catId,\n          {\n            name: (document.getElementById('regProjName') as HTMLInputElement)?.value.trim(),\n            reqs: (document.getElementById('regProjReqs') as HTMLInputElement)?.value.split(',').map(s => s.trim()).filter(Boolean),\n            ext: (document.getElementById('regProjExt') as HTMLInputElement)?.value.trim() || 'txt',\n            priority: 'media'\n          }\n        );",
    "const name = (document.getElementById('regProjName') as HTMLInputElement)?.value.trim();\n        if (!name) throw new Error('Invalid name');\n        apiCreateInfraProject({\n            category_id: catId,\n            name,\n            reqs: (document.getElementById('regProjReqs') as HTMLInputElement)?.value.split(',').map(s => s.trim()).filter(Boolean),\n            ext: (document.getElementById('regProjExt') as HTMLInputElement)?.value.trim() || 'txt',\n            priority: 'media'\n        }).then(() => loadData());"
)

# Add Delete Button logic to DetailView
content = content.replace(
    '<button id="btnSaveAll" className="px-3 py-1.5 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">Salvar</button>',
    '<button id="btnDeleteProject" className="px-3 py-1.5 text-sm font-medium rounded-lg border border-red-600 text-red-600 hover:bg-red-50">Excluir</button>\n              <button id="btnSaveAll" className="px-3 py-1.5 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">Salvar</button>'
)

content = content.replace(
    "const btnSaveAll = document.getElementById('btnSaveAll');",
    "const btnDeleteProject = document.getElementById('btnDeleteProject');\n    if (btnDeleteProject) btnDeleteProject.onclick = async () => {\n      if (confirm('Excluir projeto?')) {\n        await apiDeleteInfraProject(currentProject.id);\n        await loadData();\n        document.getElementById('detailView')?.classList.add('hidden');\n        document.getElementById('listView')?.classList.remove('hidden');\n      }\n    };\n\n    const btnSaveAll = document.getElementById('btnSaveAll');"
)

with open('app/infra/page.tsx', 'w') as f:
    f.write(content)
