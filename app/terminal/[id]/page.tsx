"use client";

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Terminal, Loader2, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import DeleteConfirmModal, { useDeleteConfirm } from '@/app/components/ui/DeleteConfirmModal';
import { useToast } from '@/app/components/ui/ToastProvider';

export default function TerminalViewPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [command, setCommand] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const { state: deleteModal, confirm: confirmDelete, cancel: cancelDelete } = useDeleteConfirm();
  const { id } = use(params);

  useEffect(() => {
    const fetchCommand = async () => {
      try {
        const res = await fetch(`/api/terminal/${id}`);
        if (res.ok) {
          const data = await res.json();
          setCommand(data);
        } else {
          showToast('Registro não encontrado', 'error');
          router.push('/terminal');
        }
      } catch (err) {
        showToast('Error loading', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchCommand();
  }, [id, router, showToast]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/terminal/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Deleted successfully', 'success');
        router.push('/terminal');
      } else {
        throw new Error('Falha ao deletar');
      }
    } catch (err) {
      showToast('Error deleting', 'error');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-emerald-500 w-12 h-12" />
      </div>
    );
  }

  if (!command) return null;

  const getTypeLabel = (type: string) => {
    if (type === 'bash') return 'Bash Script';
    if (type === 'vi') return 'VI Editor';
    return 'Linux Command';
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/terminal" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft size={24} className="text-slate-600" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <Terminal className="text-emerald-600" size={28} />
            <h1 className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
              {command.title}
            </h1>
          </div>
          <p className="text-slate-500 mt-1">{getTypeLabel(command.type)}</p>
        </div>
        <button
          onClick={() => confirmDelete({
            title: `Delete "${command.title}"?`,
            description: "Esta ação não pode ser desfeita.",
            onConfirm: handleDelete
          })}
          className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg font-medium transition-colors"
        >
          <Trash2 size={18} />
          Delete
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-wrap gap-4 items-start justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Category</h2>
            <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-bold tracking-wide">
              {command.category}
            </span>
          </div>
          <div className="text-right">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Criado em</h2>
            <span className="text-sm text-slate-600">{new Date(command.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            Descrição
          </h2>
          <p className="text-slate-700 text-lg leading-relaxed mb-8">
            {command.description}
          </p>

          {command.type === 'bash' && command.script_content && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                Script Content
              </h2>
              <pre className="bg-slate-900 text-emerald-400 p-4 rounded-lg overflow-x-auto font-mono text-sm">
                {command.script_content}
              </pre>
            </div>
          )}

          {(command.type === 'comando' || command.type === 'vi') && command.examples && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                Exemplos
              </h2>
              <div className="prose prose-emerald max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {command.examples}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {command.options && (
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                {command.type === 'bash' ? 'Anatomia' : 'Opções'}
              </h2>
              <div className="prose prose-emerald max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {command.options}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>

      <DeleteConfirmModal 
        isOpen={deleteModal.isOpen} 
        title={deleteModal.title}
        description={deleteModal.description}
        onConfirm={deleteModal.onConfirm}
        onCancel={cancelDelete}
        isDeleting={deleting}
      />
    </div>
  );
}
