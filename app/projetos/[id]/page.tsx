"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Terminal, CheckCircle2, PlayCircle, Activity } from "lucide-react";

export default function ProjetoViewPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [unwrappedParams, setUnwrappedParams] = useState<{ id: string } | null>(null);
  const [testingStatus, setTestingStatus] = useState<'idle'|'running'|'success'>('idle');
  const [testLogs, setTestLogs] = useState<string[]>([]);

  const runTest = () => {
    setTestingStatus('running');
    setTestLogs([]);
    
    // Fallback genérico caso o banco não tenha logs específicos cadastrados
    const fallbackLogs = [
      "root@production-server:~# ./deploy.sh --dry-run",
      "> [INFO] Autenticando com provedor...",
      "> [OK] Conectado.",
      "> [INFO] Executando rotinas...",
      "[SUCCESS] Pipeline finalizada."
    ];

    const rawLogs = project?.mock_test_logs || "";
    const logLines = rawLogs.trim() ? rawLogs.split('\n') : fallbackLogs;

    // Adiciona as linhas progressivamente a cada 800ms
    logLines.forEach((line: string, index: number) => {
      setTimeout(() => {
        setTestLogs(prev => [...prev, line]);
      }, (index + 1) * 800);
    });

    const totalTime = (logLines.length + 1) * 800;

    setTimeout(() => {
      setTestingStatus('success');
      setTimeout(() => setTestingStatus('idle'), 5000);
    }, totalTime);
  };

  useEffect(() => {
    params.then(p => setUnwrappedParams(p));
  }, [params]);

  useEffect(() => {
    if (!unwrappedParams) return;
    
    fetch(`/api/projetos/${unwrappedParams.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          router.push("/projetos");
        } else {
          setProject(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load project:", err);
        setLoading(false);
      });
  }, [unwrappedParams, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 flex flex-wrap items-center gap-3">
              {project.title}
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2"></span> Produção
              </span>
            </h1>
            <p className="text-gray-500 mt-2 flex items-center gap-2">
              <span className="font-mono text-sm bg-gray-100 px-2 py-0.5 rounded">ID: {project.id}</span>
              &bull;
              <span>Implantado em: {new Date(project.created_at).toLocaleDateString()}</span>
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={runTest}
              disabled={testingStatus !== 'idle'}
              className="inline-flex items-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 transition-colors"
            >
              {testingStatus === 'idle' && <><PlayCircle size={18} /> Rodar Teste de Integração</>}
              {testingStatus === 'running' && <><Activity size={18} className="animate-spin" /> Validando Ambiente...</>}
              {testingStatus === 'success' && <><CheckCircle2 size={18} /> Ambiente Validado (200 OK)</>}
            </button>
            <Link 
              href={`/projetos/${project.id}/edit`} 
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Editar 
            </Link>
            <Link 
              href="/projetos" 
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Voltar
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-4 mb-6">Desafio de Negócio</h2>
                <div className="prose prose-indigo max-w-none text-gray-700 whitespace-pre-wrap">
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                    <h3 className="text-red-800 text-lg font-bold mt-0 mb-2">O Problema</h3>
                    <p className="text-red-900 m-0">{project.scenario}</p>
                  </div>
                </div>
              </div>
            </div>

            {project.detailed_description && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 sm:p-8">
                  <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-4 mb-6">Detalhes e Arquitetura</h2>
                  <div className="prose prose-indigo prose-lg max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {project.detailed_description}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            )}

            {project.code_examples && (
              <div className="bg-gray-900 rounded-xl shadow-xl overflow-hidden border border-gray-700">
                <div className="bg-gray-800 px-4 py-2 flex items-center gap-2 border-b border-gray-700">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-gray-400 text-xs font-mono ml-2 flex items-center gap-1">
                    <Terminal size={12} /> root@production-server:~#
                  </div>
                </div>
                <div className="p-6 overflow-x-auto text-gray-300 font-mono text-sm leading-relaxed">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {project.code_examples}
                  </ReactMarkdown>
                </div>
              </div>
            )}

            {testLogs.length > 0 && (
              <div className="bg-black rounded-xl shadow-2xl overflow-hidden border border-gray-800 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-gray-900 px-4 py-2 flex items-center justify-between border-b border-gray-800">
                  <div className="flex items-center gap-2">
                    <Activity size={14} className="text-emerald-500" />
                    <span className="text-gray-400 text-xs font-mono font-bold">Runner / Test Logs</span>
                  </div>
                  {testingStatus === 'running' && (
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  )}
                </div>
                <div className="p-4 sm:p-6 font-mono text-sm space-y-2 h-64 overflow-y-auto flex flex-col">
                  {testLogs.map((log, idx) => (
                    <div 
                      key={idx} 
                      className={`animate-in fade-in slide-in-from-left-2 duration-300 ${
                        log.includes('[SUCCESS]') || log.includes('[OK]') ? 'text-emerald-400' :
                        log.includes('[WARN]') ? 'text-yellow-400' :
                        log.includes('[ERROR]') ? 'text-red-400' :
                        log.startsWith('>') ? 'text-gray-400' :
                        'text-indigo-300'
                      }`}
                    >
                      {log}
                    </div>
                  ))}
                  {testingStatus === 'running' && (
                    <div className="text-gray-500 mt-2 animate-pulse">_</div>
                  )}
                </div>
              </div>
            )}
            
          </div>

          {/* Sidebar Info Area */}
          <div className="space-y-6">
            
            <div className="bg-gray-50 rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-3 mb-4">Requisitos</h3>
                <div className="prose prose-sm prose-indigo max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {project.requirements}
                  </ReactMarkdown>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-3 mb-4">Tecnologias Usadas</h3>
                {project.technologies ? (
                  <div className="prose prose-sm prose-indigo max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {project.technologies}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">Nenhuma tecnologia detalhada.</p>
                )}
              </div>
            </div>

            {project.dependencies && (
              <div className="bg-gray-50 rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-3 mb-4">Dependências e Pré-requisitos</h3>
                  <div className="prose prose-sm prose-indigo max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {project.dependencies}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            )}

            {project.references_links && (
              <div className="bg-gray-50 rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-3 mb-4">Links e Referências</h3>
                  <div className="prose prose-sm prose-indigo max-w-none prose-a:text-indigo-600 hover:prose-a:text-indigo-500">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {project.references_links}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
