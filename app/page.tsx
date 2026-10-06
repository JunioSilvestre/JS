"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  apiGetModules,
  apiDeleteModule,
  Module,
  apiGetInfraProjects,
  apiDeleteInfraProject,
  InfraProject,
} from "@/lib/api";
import { useToast } from "@/app/components/ui/ToastProvider";
import DeleteConfirmModal, {
  useDeleteConfirm,
} from "@/app/components/ui/DeleteConfirmModal";
import {
  LayoutGrid,
  FilePlus2,
  Settings,
  Search,
  Filter,
  Trash2,
  Edit3,
  BookOpen,
  ChevronRight,
  Layers,
  AlertCircle,
  Loader2,
  Terminal,
  ArrowUpDown,
} from "lucide-react";

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Intermediate: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Advanced: "bg-red-500/10 text-red-400 border-red-500/20",
};

const PROVIDER_ICONS: Record<string, string> = {
  LPI: "🐧",
  AWS: "☁️",
  GCP: "🌐",
  Azure: "💙",
  CompTIA: "🛡️",
  Cisco: "🔵",
  default: "📚",
};

function getIcon(provider: string): string {
  return PROVIDER_ICONS[provider] || PROVIDER_ICONS.default;
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function Home() {
  const [modules, setModules] = useState<Module[]>([]);
  const [infraProjects, setInfraProjects] = useState<InfraProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const { showToast } = useToast();
  const {
    state: deleteModal,
    confirm: confirmDelete,
    cancel: cancelDelete,
  } = useDeleteConfirm();

  const loadModules = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiGetModules({ search, difficulty });
      setModules(res.data);
      const infraRes = await apiGetInfraProjects();
      setInfraProjects(infraRes.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load modules");
    } finally {
      setLoading(false);
    }
  }, [search, difficulty]);

  useEffect(() => {
    const timer = setTimeout(loadModules, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [loadModules, search]);

  const handleDeleteRequest = (id: string, title: string) => {
    setPendingDelete({ id, title });
    confirmDelete({
      title: `Delete "${title}"?`,
      description:
        "This will permanently delete the module and all its questions. This cannot be undone.",
      onConfirm: () => executeDelete(id, title, "module"),
    });
  };

  const executeDelete = useCallback(
    async (id: string, title: string, type: "module" | "infra" = "module") => {
      setDeleting(id);
      try {
        if (type === "infra") {
          await apiDeleteInfraProject(id);
        } else {
          await apiDeleteModule(id);
        }
        showToast(`Module "${title}" deleted`, "success");
        loadModules();
      } catch (err) {
        showToast(
          err instanceof Error ? err.message : "Failed to delete",
          "error",
        );
      } finally {
        setDeleting(null);
        setPendingDelete(null);
      }
    },
    [showToast, loadModules],
  );

  // Sort modules client-side
  const sortedInfra = [...infraProjects]
    .filter(
      (p) => !search || p.name.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "az") return a.name.localeCompare(b.name);
      if (sortBy === "za") return b.name.localeCompare(a.name);
      return (
        new Date(b.created_at || 0).getTime() -
        new Date(a.created_at || 0).getTime()
      );
    });

  const sortedModules = [...modules].sort((a, b) => {
    if (sortBy === "az") return a.title.localeCompare(b.title);
    if (sortBy === "za") return b.title.localeCompare(a.title);
    if (sortBy === "questions")
      return (b.question_count || 0) - (a.question_count || 0);
    if (sortBy === "oldest")
      return (
        new Date(a.created_at || 0).getTime() -
        new Date(b.created_at || 0).getTime()
      );
    // newest (default)
    return (
      new Date(b.created_at || 0).getTime() -
      new Date(a.created_at || 0).getTime()
    );
  });

  const stats = {
    total: modules.length,
    questions: modules.reduce((s, m) => s + (m.question_count || 0), 0),
    providers: new Set(modules.map((m) => m.provider).filter(Boolean)).size,
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
            {/* Loading */}
            {loading && (
              <div className="flex items-center justify-center py-24 text-gray-500">
                <Loader2 size={24} className="animate-spin mr-3" />
                <span>Loading modules...</span>
              </div>
            )}

            {/* Error */}
            {error && !loading && (
              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
                <AlertCircle size={20} />
                <span>{error}</span>
                <button
                  onClick={loadModules}
                  className="ml-auto text-sm underline hover:no-underline"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Modules Grid */}
            {!loading && !error && (
              <>
                {modules.length === 0 &&
                sortedInfra.length === 0 &&
                (!search ||
                  !"infra híbrida linux windows cloud".includes(
                    search.toLowerCase(),
                  )) ? (
                  <div className="text-center py-24">
                    <div className="w-20 h-20 rounded-2xl bg-white border border-gray-300 flex items-center justify-center text-4xl mx-auto mb-6">
                      📚
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {search || difficulty
                        ? "No results found"
                        : "No modules or projects yet"}
                    </h3>
                    <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                      {search || difficulty
                        ? "Try adjusting your search filters."
                        : "Create your first module or infrastructure project."}
                    </p>
                    {!search && !difficulty && (
                      <Link
                        href="/modules/create"
                        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-semibold transition text-sm"
                      >
                        <FilePlus2 size={18} /> Create First Module
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
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
                              setPendingDelete({
                                id: proj.id,
                                title: proj.name,
                              });
                              confirmDelete({
                                title: `Delete "${proj.name}"?`,
                                description:
                                  "This will permanently delete the infra project. This cannot be undone.",
                                onConfirm: () =>
                                  executeDelete(proj.id, proj.name, "infra"),
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
                          style={{
                            backgroundColor: `#8b5cf615`,
                            color: "#8b5cf6",
                          }}
                        >
                          <Layers size={24} />
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                            Hybrid Infra
                          </span>
                          <span
                            className={`text-xs font-medium px-2 py-0.5 rounded-md border ${
                              proj.level === "basico"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : proj.level === "intermediario"
                                  ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                  : "bg-red-500/10 text-red-400 border-red-500/20"
                            }`}
                          >
                            {proj.level === "basico"
                              ? "Beginner"
                              : proj.level === "intermediario"
                                ? "Intermediate"
                                : "Advanced"}
                          </span>
                        </div>

                        {/* Title & Description */}
                        <h3 className="text-base font-bold text-gray-900 mb-1.5">
                          {proj.name}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                          {Array.isArray(proj.reqs)
                            ? proj.reqs.join(", ")
                            : typeof proj.reqs === "string"
                              ? (() => {
                                  try {
                                    return JSON.parse(proj.reqs).join(", ");
                                  } catch {
                                    return proj.reqs;
                                  }
                                })()
                              : ""}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between border-t border-gray-300 pt-4 mt-auto">
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span className="flex items-center gap-1.5">
                              <Layers size={14} />
                              Project
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

                    {/* Dynamic Modules */}
                    {sortedModules.map((module) => (
                      <div
                        key={module.id}
                        className="group bg-white border border-gray-300 rounded-2xl p-6 transition-all shadow-sm hover:shadow-xl relative overflow-hidden flex flex-col"
                        style={{
                          borderTop: `4px solid ${module.color || "#6366f1"}`,
                        }}
                      >
                        {/* Action Buttons */}
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                          <Link
                            href={`/modules/${module.id}/questions`}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-slate-700 transition"
                            title="Manage Questions"
                          >
                            <BookOpen size={14} />
                          </Link>
                          <Link
                            href={`/modules/create?edit=${module.id}`}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition"
                            title="Edit Module"
                          >
                            <Edit3 size={14} />
                          </Link>
                          <button
                            onClick={() =>
                              handleDeleteRequest(module.id, module.title)
                            }
                            disabled={deleting === module.id}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition disabled:opacity-50"
                            title="Delete Module"
                          >
                            {deleting === module.id ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Trash2 size={14} />
                            )}
                          </button>
                        </div>

                        {/* Icon */}
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4 group-hover:scale-105 transition-transform flex-shrink-0"
                          style={{
                            backgroundColor: `${module.color || "#6366f1"}15`,
                            color: module.color || "#6366f1",
                          }}
                        >
                          {getIcon(module.provider)}
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          {module.certification && (
                            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                              {module.certification}
                            </span>
                          )}
                          {module.difficulty && (
                            <span
                              className={`text-xs font-medium px-2 py-0.5 rounded-md border ${DIFFICULTY_COLORS[module.difficulty] || DIFFICULTY_COLORS.Beginner}`}
                            >
                              {module.difficulty}
                            </span>
                          )}
                        </div>

                        {/* Title & Description */}
                        <h3 className="text-base font-bold text-gray-900 mb-1.5">
                          {module.title}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                          {module.description || "No description provided."}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between border-t border-gray-300 pt-4 mt-auto">
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span className="flex items-center gap-1.5">
                              <Layers size={14} />
                              {module.question_count || 0} Q
                            </span>
                            {module.provider && (
                              <span className="text-slate-600">•</span>
                            )}
                            {module.provider && (
                              <span className="text-xs">{module.provider}</span>
                            )}
                          </div>
                          <Link
                            href={`/modules/${module.id}/questions`}
                            className="flex items-center gap-1 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition"
                          >
                            Open <ChevronRight size={14} />
                          </Link>
                        </div>

                        {/* Last updated */}
                        {module.updated_at && (
                          <p className="text-xs text-slate-600 mt-2">
                            Updated {timeAgo(module.updated_at)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          

      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        title={deleteModal.title}
        description={deleteModal.description}
        isDeleting={deleting === pendingDelete?.id}
        onConfirm={deleteModal.onConfirm}
        onCancel={cancelDelete}
      />
    </div>
  );
}
