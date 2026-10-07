"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlusCircle, Clock, Server, Edit, Trash2, Shield, FolderOpen } from "lucide-react";

type Project = {
  id: number;
  title: string;
  scenario: string;
  requirements: string;
  duration: string;
  dependencies: string;
};

export default function ProjetosPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projetos");
        if (res.ok) {
          const data = await res.json();
          setProjects(data);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const deleteProject = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este projeto?")) return;
    
    try {
      const res = await fetch(`/api/projetos/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects(projects.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center gap-3">
            <FolderOpen className="text-indigo-500" size={32} />
            Estudos de Caso & Engenharia
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Soluções reais de infraestrutura, cloud e alta disponibilidade para desafios corporativos.</p>
        </div>
        <Link 
          href="/projetos/create"
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-semibold shadow-lg shadow-indigo-200 transition-all transform hover:scale-105"
        >
          <PlusCircle size={20} />
          Novo Projeto
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center bg-white p-16 rounded-2xl shadow-sm border border-gray-200 border-dashed">
          <Shield size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-700">Nenhum projeto encontrado</h3>
          <p className="text-gray-500 mt-2 mb-6">Adicione seu primeiro projeto baseado no treinamento Sênior.</p>
          <Link href="/projetos/create" className="text-indigo-600 font-semibold hover:underline">
            Adicionar Projeto &rarr;
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map(project => (
            <div key={project.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-200 overflow-hidden transition-all flex flex-col group">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                    <Clock size={12} /> {project.duration}
                  </span>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href={`/projetos/${project.id}/edit`} className="text-gray-400 hover:text-blue-500 p-1 bg-gray-50 rounded-lg">
                      <Edit size={16} />
                    </Link>
                    <button onClick={() => deleteProject(project.id)} className="text-gray-400 hover:text-red-500 p-1 bg-gray-50 rounded-lg">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">{project.title}</h3>
                <div className="mb-4">
                  <h4 className="text-xs font-bold uppercase text-gray-400 mb-1">O Desafio (Business Problem)</h4>
                  <div className="text-sm text-gray-700 line-clamp-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {project.scenario}
                  </div>
                </div>
                
                <div className="space-y-3 mt-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase text-gray-400 flex items-center gap-1.5 mb-1.5">
                      <Server size={14} /> Tecnologias
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {project.requirements.split(',').map((req, i) => (
                        <span key={i} className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-md font-medium border border-gray-200">
                          {req.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {project.dependencies && (
                    <div>
                      <h4 className="text-xs font-bold uppercase text-gray-400 mb-1.5">Dependências</h4>
                      <p className="text-sm text-gray-700 font-medium">{project.dependencies}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xs font-medium text-emerald-600 bg-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Em Produção
                </span>
                <Link href={`/projetos/${project.id}`} className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1">
                  Ver Arquitetura &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
