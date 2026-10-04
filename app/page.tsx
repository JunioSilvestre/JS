"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { apiGetModules, apiDeleteModule, Module } from "@/lib/api";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadModules = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiGetModules({ search, difficulty });
      setModules(res.data);
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

  const handleDelete = async (id: string, title: string) => {
    if (
      !confirm(
        `Delete module "${title}" and all its questions? This cannot be undone.`,
      )
    )
      return;
    setDeleting(id);
    try {
      await apiDeleteModule(id);
      showToast(`Module "${title}" deleted`);
      loadModules();
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to delete",
        "error",
      );
    } finally {
      setDeleting(null);
    }
  };

  const stats = {
    total: modules.length,
    questions: modules.reduce((s, m) => s + (m.question_count || 0), 0),
    providers: new Set(modules.map((m) => m.provider).filter(Boolean)).size,
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f5f5]">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-gray-200">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/25">
            C
          </div>
          <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 text-lg">
            Cert-Hub
          </span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 font-medium border border-indigo-500/20 text-sm"
          >
            <LayoutGrid size={18} /> Modules
          </Link>
          <Link
            href="/questions/create"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-slate-800/50 transition font-medium text-sm"
          >
            <FilePlus2 size={18} /> Questions
          </Link>
          <Link
            href="/bash"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-slate-800/50 transition font-medium text-sm"
          >
            <Terminal size={18} /> Bash
          </Link>
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-slate-800/50 transition font-medium w-full text-left text-sm">
            <Settings size={18} /> Settings
          </button>
        </nav>

        {/* Stats */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Overview
          </p>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Modules</span>
            <span className="text-gray-900 font-bold">{stats.total}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Questions</span>
            <span className="text-gray-900 font-bold">{stats.questions}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Providers</span>
            <span className="text-gray-900 font-bold">{stats.providers}</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#f5f5f5] relative">
        {/* Header */}
        <header className="h-20 flex-shrink-0 flex items-center justify-between px-8 border-b border-gray-200 bg-[#f5f5f5]/80 backdrop-blur-md z-10">
          <div>
            <h1 className="text-xl font-bold text-slate-100">
              Modules Management
            </h1>
            <p className="text-sm text-gray-500">
              Create, edit, and organize certification modules
            </p>
          </div>
          <Link
            href="/modules/create"
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition shadow-lg shadow-indigo-500/25 border border-indigo-500 text-sm"
          >
            <FilePlus2 size={18} /> Create Module
          </Link>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Search and Filters */}
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type="text"
                  placeholder="Search modules by title, description or certification..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white border border-gray-300 text-gray-900 placeholder-slate-500 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition text-sm"
                />
              </div>
              <div className="relative">
                <Filter
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                />
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="bg-white border border-gray-300 hover:border-slate-500 text-gray-700 pl-9 pr-8 py-3 rounded-xl transition appearance-none focus:outline-none focus:border-indigo-500 text-sm cursor-pointer"
                >
                  <option value="">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

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
                {modules.length === 0 ? (
                  <div className="text-center py-24">
                    <div className="w-20 h-20 rounded-2xl bg-white border border-gray-300 flex items-center justify-center text-4xl mx-auto mb-6">
                      📚
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {search || difficulty
                        ? "No modules match your filters"
                        : "No modules yet"}
                    </h3>
                    <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                      {search || difficulty
                        ? "Try adjusting your search or filter criteria."
                        : "Create your first certification module to get started."}
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
                    {modules.map((module) => (
                      <div
                        key={module.id}
                        className="group bg-white border border-gray-300 hover:border-indigo-500/50 rounded-2xl p-6 transition-all shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 relative overflow-hidden flex flex-col"
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
                              handleDelete(module.id, module.title)
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
                        <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-xl mb-4 group-hover:scale-105 group-hover:border-indigo-500/30 transition-transform flex-shrink-0">
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
                        <h3 className="text-base font-bold text-slate-100 mb-1.5">
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
          </div>
        </div>
      </main>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border text-sm font-medium transition-all animate-in slide-in-from-bottom-2 ${
            toast.type === "success"
              ? "bg-emerald-950 border-emerald-500/30 text-emerald-300"
              : "bg-red-950 border-red-500/30 text-red-300"
          }`}
        >
          {toast.type === "success" ? "✓" : "✗"} {toast.message}
        </div>
      )}
    </div>
  );
}
