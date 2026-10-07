"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, FolderOpen } from "lucide-react";

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const [formData, setFormData] = useState({
    title: "",
    scenario: "",
    requirements: "",
    duration: "1h",
    dependencies: "",
    detailed_description: "",
    technologies: "",
    code_examples: "",
    references_links: ""
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projetos/${id}`);
        if (res.ok) {
          const data = await res.json();
          setFormData({
            title: data.title,
            scenario: data.scenario,
            requirements: data.requirements,
            duration: data.duration,
            dependencies: data.dependencies || "",
            detailed_description: data.detailed_description || "",
            technologies: data.technologies || "",
            code_examples: data.code_examples || "",
            references_links: data.references_links || ""
          });
        } else {
          alert("Projeto não encontrado");
          router.push("/projetos");
        }
      } catch (error) {
        console.error("Erro ao carregar projeto:", error);
      } finally {
        setFetching(false);
      }
    };
    fetchProject();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/projetos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        router.push(`/projetos/${id}`);
        router.refresh();
      } else {
        alert("Erro ao atualizar projeto");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center p-24">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <Link href={`/projetos/${id}`} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={24} className="text-gray-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <FolderOpen className="text-indigo-600" />
            Editar Projeto
          </h1>
          <p className="text-gray-500 text-sm">Atualize os detalhes do cenário Sênior</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">Título do Projeto</label>
            <input 
              required
              type="text"
              className="w-full border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 bg-gray-50 border"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">Cenário (Enunciado)</label>
            <textarea 
              required
              rows={4}
              className="w-full border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 bg-gray-50 border"
              value={formData.scenario}
              onChange={e => setFormData({...formData, scenario: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Tecnologias / Requisitos Rápidos</label>
            <input 
              required
              type="text"
              className="w-full border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 bg-gray-50 border"
              value={formData.requirements}
              onChange={e => setFormData({...formData, requirements: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Duração Estimada</label>
            <select 
              className="w-full border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 bg-gray-50 border"
              value={formData.duration}
              onChange={e => setFormData({...formData, duration: e.target.value})}
            >
              <option value="1h">1 Hora (Troubleshoot)</option>
              <option value="4h">4 Horas (Intermediário)</option>
              <option value="8h">8 Horas (Arquitetura Menor)</option>
              <option value="16h">16 Horas (Mini-Arquitetura)</option>
              <option value="1w">1 Semana (Sub-sistema)</option>
              <option value="1m">1 Mês (Transformação)</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">Dependências Prévias (Opcional)</label>
            <input 
              type="text"
              className="w-full border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 bg-gray-50 border"
              value={formData.dependencies}
              onChange={e => setFormData({...formData, dependencies: e.target.value})}
            />
          </div>

          <div className="md:col-span-2 mt-4 pt-4 border-t border-gray-200">
            <h3 className="text-lg font-bold text-indigo-700 mb-4">Detalhamento Técnico (Suporta Markdown)</h3>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">Detalhes e Arquitetura</label>
            <textarea 
              rows={6}
              className="w-full border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 bg-gray-50 border font-mono text-sm"
              placeholder="Descreva a arquitetura, diagramas em mermaid, etc."
              value={formData.detailed_description}
              onChange={e => setFormData({...formData, detailed_description: e.target.value})}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">Exemplos de Código (Arquivos, Configurações, Scripts)</label>
            <textarea 
              rows={6}
              className="w-full border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 bg-gray-50 border font-mono text-sm"
              placeholder="```bash\n# Script de automação\n```"
              value={formData.code_examples}
              onChange={e => setFormData({...formData, code_examples: e.target.value})}
            />
          </div>

          <div className="md:col-span-1">
            <label className="block text-sm font-bold text-gray-700 mb-2">Tecnologias (Detalhado)</label>
            <textarea 
              rows={4}
              className="w-full border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 bg-gray-50 border font-mono text-sm"
              placeholder="- Terraform (v1.5)\n- AWS EC2"
              value={formData.technologies}
              onChange={e => setFormData({...formData, technologies: e.target.value})}
            />
          </div>

          <div className="md:col-span-1">
            <label className="block text-sm font-bold text-gray-700 mb-2">Links e Referências</label>
            <textarea 
              rows={4}
              className="w-full border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 bg-gray-50 border font-mono text-sm"
              placeholder="[Doc Oficial](https://...)"
              value={formData.references_links}
              onChange={e => setFormData({...formData, references_links: e.target.value})}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
          <Link 
            href="/projetos"
            className="px-5 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </Link>
          <button 
            disabled={loading}
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-blue-200 transition-all transform hover:scale-105 disabled:opacity-70 disabled:scale-100"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Save size={20} />
            )}
            Atualizar Projeto
          </button>
        </div>
      </form>
    </div>
  );
}
