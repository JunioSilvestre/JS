import re

with open('app/page.tsx', 'r') as f:
    content = f.read()

# Add imports
content = content.replace(
    'import { apiGetModules, apiDeleteModule, Module } from "@/lib/api";',
    'import { apiGetModules, apiDeleteModule, Module, apiGetInfraProjects, apiDeleteInfraProject, InfraProject } from "@/lib/api";'
)

# Add state
content = content.replace(
    '  const [modules, setModules] = useState<Module[]>([]);',
    '  const [modules, setModules] = useState<Module[]>([]);\n  const [infraProjects, setInfraProjects] = useState<InfraProject[]>([]);'
)

# Load data
content = content.replace(
    '      const res = await apiGetModules({ search, difficulty });\n      setModules(res.data);',
    '      const res = await apiGetModules({ search, difficulty });\n      setModules(res.data);\n      const infraRes = await apiGetInfraProjects();\n      setInfraProjects(infraRes.data || []);'
)

# Delete handler logic (we don't strictly need to delete infra from here, but let's just make it possible if they click delete? Wait, the user just wants the infra cards here). Let's let them delete.
content = content.replace(
    '  const executeDelete = useCallback(async (id: string, title: string) => {',
    '  const executeDelete = useCallback(async (id: string, title: string, type: "module" | "infra" = "module") => {'
)

content = content.replace(
    '      await apiDeleteModule(id);',
    '      if (type === "infra") {\n        await apiDeleteInfraProject(id);\n      } else {\n        await apiDeleteModule(id);\n      }'
)

content = content.replace(
    '      onConfirm: () => executeDelete(id, title),',
    '      onConfirm: () => executeDelete(id, title, "module"),'
)

# Sort infra client-side
content = content.replace(
    '  const sortedModules = [...modules].sort((a, b) => {',
    '  const sortedInfra = [...infraProjects].filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase())).sort((a, b) => {\n    if (sortBy === "az") return a.name.localeCompare(b.name);\n    if (sortBy === "za") return b.name.localeCompare(a.name);\n    return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();\n  });\n\n  const sortedModules = [...modules].sort((a, b) => {'
)

# Dynamic render
render_infra = """
                    {/* Dynamic Infra */}
                    {sortedInfra.map((proj) => (
                      <div
                        key={proj.id}
                        className="group bg-white border border-gray-300 rounded-2xl p-6 transition-all shadow-sm hover:shadow-xl relative overflow-hidden flex flex-col"
                        style={{ borderTop: `4px solid #8b5cf6` }}
                      >
                        {/* Action Buttons */}
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                          <button
                            onClick={() => {
                              setPendingDelete({ id: proj.id, title: proj.name });
                              confirmDelete({
                                title: `Delete "${proj.name}"?`,
                                description: "This will permanently delete the infra project. This cannot be undone.",
                                onConfirm: () => executeDelete(proj.id, proj.name, "infra"),
                              });
                            }}
                            disabled={deleting === proj.id}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition disabled:opacity-50"
                            title="Delete Project"
                          >
                            {deleting === proj.id ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Trash2 size={14} />
                            )}
                          </button>
                        </div>

                        {/* Icon */}
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4 group-hover:scale-105 transition-transform flex-shrink-0"
                          style={{ backgroundColor: `#8b5cf615`, color: "#8b5cf6" }}
                        >
                          <Layers size={24} />
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                            Infra Híbrida
                          </span>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-md border ${
                            proj.level === 'basico' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            proj.level === 'intermediario' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                            'bg-red-500/10 text-red-400 border-red-500/20'
                          }`}>
                            {proj.level === 'basico' ? 'Básico' : proj.level === 'intermediario' ? 'Intermediário' : 'Avançado'}
                          </span>
                        </div>

                        {/* Title & Description */}
                        <h3 className="text-base font-bold text-gray-900 mb-1.5">
                          {proj.name}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                          {(proj.reqs || []).join(', ')}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between border-t border-gray-300 pt-4 mt-auto">
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span className="flex items-center gap-1.5">
                              <Layers size={14} />
                              Projeto
                            </span>
                          </div>
                          <Link
                            href="/infra"
                            className="flex items-center gap-1 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition"
                          >
                            Open <ChevronRight size={14} />
                          </Link>
                        </div>
                      </div>
                    ))}
"""
content = content.replace(
    '{/* Dynamic Modules */}',
    render_infra + '\n                    {/* Dynamic Modules */}'
)

with open('app/page.tsx', 'w') as f:
    f.write(content)
