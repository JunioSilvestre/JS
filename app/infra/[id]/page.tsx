"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Server, CheckSquare, Layers, Clock, Activity, Flag, Calendar, ShieldCheck, Target, Terminal } from "lucide-react";
import { useToast } from "@/app/components/ui/ToastProvider";

export default function ViewInfraProjectPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const id = Array.isArray(params.id) ? params.id[0] : params.id;
        const res = await fetch(`/api/infra-projects/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProject(data.data);
        } else {
          showToast("Project not found", "error");
          router.push("/projetos");
        }
      } catch (err) {
        showToast("Network error", "error");
      } finally {
        setLoading(false);
      }
    };
    if (params.id) {
      fetchProject();
    }
  }, [params.id, router, showToast]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!project) return null;

  const parseJsonSafe = (str: string) => {
    if (!str) return [];
    try {
      return JSON.parse(str);
    } catch {
      return [];
    }
  };

  const reqs = parseJsonSafe(project.reqs);
  const prereqs = parseJsonSafe(project.prereqs);
  const concepts = parseJsonSafe(project.concepts);
  const certs = parseJsonSafe(project.certs);
  const checklist = parseJsonSafe(project.checklist);

  const priorityColors: Record<string, string> = {
    low: "bg-gray-100 text-gray-700 border-gray-200",
    medium: "bg-amber-100 text-amber-700 border-amber-200",
    high: "bg-rose-100 text-rose-700 border-rose-200",
    // Fallbacks just in case old data exists
    baixa: "bg-gray-100 text-gray-700 border-gray-200",
    media: "bg-amber-100 text-amber-700 border-amber-200",
    alta: "bg-rose-100 text-rose-700 border-rose-200"
  };

  const statusColors: Record<string, string> = {
    todo: "bg-slate-100 text-slate-700 border-slate-200",
    in_progress: "bg-blue-100 text-blue-700 border-blue-200",
    done: "bg-emerald-100 text-emerald-700 border-emerald-200"
  };

  const statusLabels: Record<string, string> = {
    todo: "To Do",
    in_progress: "In Progress",
    done: "Done"
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/projetos"
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <ArrowLeft size={18} />
            </Link>
            <div className="flex items-center gap-2">
              <div className="bg-blue-100 p-1.5 rounded-md">
                <Server size={20} className="text-blue-700" />
              </div>
              <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Infrastructure Architecture</h1>
            </div>
          </div>
          <Link
            href={`/infra/${project.id}/edit`}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors"
          >
            <Edit size={16} /> Edit
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-8 px-6 space-y-6">
        
        {/* Header Section */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Server size={120} />
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-xs font-bold px-2 py-1 rounded-md border bg-slate-100 text-slate-700 border-slate-200 capitalize">
              Level: {project.level || 'Not defined'}
            </span>
            <span className={`text-xs font-bold px-2 py-1 rounded-md border capitalize ${statusColors[project.status] || statusColors.todo}`}>
              <Activity size={12} className="inline mr-1" /> {statusLabels[project.status] || project.status}
            </span>
            <span className={`text-xs font-bold px-2 py-1 rounded-md border capitalize ${priorityColors[project.priority] || priorityColors.low}`}>
              <Flag size={12} className="inline mr-1" /> Priority: {project.priority || 'Low'}
            </span>
            {project.time && (
              <span className="text-xs font-bold px-2 py-1 rounded-md border bg-blue-50 text-blue-700 border-blue-200 capitalize">
                <Clock size={12} className="inline mr-1" /> {project.time}
              </span>
            )}
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 mb-4 pr-20 capitalize">{project.name}</h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl first-letter:capitalize">
            {project.objective || "Main objective not defined."}
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                <Layers className="text-indigo-600" /> Scenario & Architecture
              </h2>
              <div className="prose prose-sm max-w-none text-gray-600 font-mono bg-slate-50 p-4 rounded-xl border border-slate-100 whitespace-pre-wrap">
                {project.scenario || "No scenario registered."}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                <ShieldCheck className="text-emerald-600" /> Architecture Defense (Interview)
              </h2>
              <p className="text-gray-600 italic">
                {project.interview || "No architecture defense questions registered."}
              </p>
            </div>

            {checklist.length > 0 && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                  <CheckSquare className="text-blue-600" /> Deliverables & Phases
                </h2>
                <ul className="space-y-3">
                  {checklist.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <div className="mt-0.5"><div className="w-5 h-5 rounded border border-gray-300 flex items-center justify-center bg-white"><div className="w-3 h-3 rounded-sm bg-blue-500 opacity-20"></div></div></div>
                      <span className="text-gray-700 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Target size={16} className="text-blue-600"/> Stack & Requirements</h3>
              {reqs.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {reqs.map((req: string, idx: number) => (
                    <span key={idx} className="bg-slate-100 text-slate-700 text-xs font-bold px-2 py-1 rounded-md border border-slate-200">
                      {req}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">No requirements listed.</p>
              )}
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Calendar size={16} className="text-amber-600"/> Prerequisites (Dependencies)</h3>
              {prereqs.length > 0 ? (
                <ul className="space-y-2">
                  {prereqs.map((pr: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div> {pr}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400">No dependencies.</p>
              )}
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Terminal size={16} className="text-purple-600"/> Technical Concepts</h3>
              {concepts.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {concepts.map((c: string, idx: number) => (
                    <span key={idx} className="bg-purple-50 text-purple-700 text-xs font-bold px-2 py-1 rounded-md border border-purple-200">
                      {c}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">No concepts mapped.</p>
              )}
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><ShieldCheck size={16} className="text-emerald-600"/> Certifications</h3>
              {certs.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {certs.map((c: string, idx: number) => (
                    <div key={idx} className="bg-emerald-50 text-emerald-800 text-sm font-semibold px-3 py-2 rounded-lg border border-emerald-100 flex items-center justify-center text-center">
                      {c}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">No certifications linked.</p>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
