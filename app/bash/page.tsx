"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Terminal,
  ArrowLeft,
  Plus,
  ChevronDown,
  ChevronUp,
  Copy,
  CheckCircle2,
  Edit,
  Trash2,
  Search,
  AlertCircle,
} from "lucide-react";
import { apiGetBashScripts, apiDeleteBashScript, BashScript } from "@/lib/api";
import BashAnatomyBuilder, {
  AnatomySection,
} from "@/app/components/BashAnatomyBuilder";

export default function BashPage() {
  const [scripts, setScripts] = useState<BashScript[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchScripts = React.useCallback(async () => {
    try {
      const res = await apiGetBashScripts();
      setScripts(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchScripts();
  }, [fetchScripts]);

  const filteredScripts = scripts.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.problem.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this script?")) return;
    try {
      await apiDeleteBashScript(id);
      fetchScripts();
    } catch (error) {
      console.error(error);
    }
  };

  const copyToClipboard = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans p-6 md:p-8 flex flex-col">
      <div className="max-w-5xl mx-auto w-full">
        {/* Navigation */}
        <Link
          href="/"
          className="text-gray-500 hover:text-gray-900 flex items-center gap-2 mb-8 transition text-sm group w-max"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-800 to-black flex items-center justify-center shadow-lg">
              <Terminal size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Bash Scripts
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Your collection of bash problems and solutions.
              </p>
            </div>
          </div>
          <Link
            href="/bash/create"
            className="flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 w-full sm:w-auto justify-center"
          >
            <Plus size={18} />
            New Script
          </Link>
        </div>

        {/* Search Bar */}
        {!loading && scripts.length > 0 && (
          <div className="mb-6 relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search scripts by title or problem..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all shadow-sm"
            />
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : filteredScripts.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <Terminal size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              No scripts found
            </h3>
            <p className="text-gray-500 max-w-sm mb-6">
              {searchQuery
                ? "Try adjusting your search criteria."
                : "Create your first bash problem and script solution to start building your library."}
            </p>
            {!searchQuery && (
              <Link
                href="/bash/create"
                className="px-6 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-black transition-colors shadow-sm"
              >
                Create Script
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredScripts.map((script) => (
              <div
                key={script.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm transition hover:shadow-md"
              >
                {/* Card Header / Summary */}
                <div
                  className="p-5 cursor-pointer flex items-center justify-between"
                  onClick={() =>
                    setExpandedId(expandedId === script.id ? null : script.id)
                  }
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">
                      {script.title}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-1">
                      {script.problem}
                    </p>
                  </div>
                  <div className="ml-4 flex items-center gap-3">
                    <Link
                      href={`/bash/${script.id}/edit`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit script"
                    >
                      <Edit size={18} />
                    </Link>
                    <button
                      onClick={(e) => handleDelete(e, script.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete script"
                    >
                      <Trash2 size={18} />
                    </button>
                    <div className="w-px h-4 bg-gray-200 mx-2"></div>
                    <div className="text-gray-400 hover:text-gray-700 transition-colors">
                      {expandedId === script.id ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Expanded Content */}
                {expandedId === script.id && (
                  <div className="p-5 pt-0 border-t border-gray-100 bg-gray-50/50">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-5">
                      {/* Left Side: Problem & Script */}
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-2">
                            <span className="w-5 h-5 rounded bg-gray-200 text-gray-600 flex items-center justify-center">
                              1
                            </span>
                            The Problem
                          </h4>
                          <p className="text-gray-800 text-sm leading-relaxed bg-white p-4 rounded-xl border border-gray-200 shadow-sm whitespace-pre-wrap">
                            {script.problem}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-2">
                            <span className="w-5 h-5 rounded bg-gray-200 text-gray-600 flex items-center justify-center">
                              2
                            </span>
                            Solution Script (.sh)
                          </h4>
                          {/* VS Code Mac Style Code Block */}
                          <div className="rounded-xl overflow-hidden shadow-lg border border-[#333] bg-[#1e1e1e]">
                            {/* Mac Window Header */}
                            <div className="flex items-center px-4 py-3 bg-[#2d2d2d] border-b border-[#111]">
                              <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                                <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                              </div>
                              <div className="flex-1 text-center text-xs text-gray-400 font-medium font-mono">
                                {script.title
                                  .toLowerCase()
                                  .replace(/\s+/g, "-")}
                                .sh
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyToClipboard(
                                    script.id,
                                    script.script_content,
                                  );
                                }}
                                className="text-gray-400 hover:text-white transition-colors p-1 rounded"
                                title="Copy code"
                              >
                                {copiedId === script.id ? (
                                  <CheckCircle2
                                    size={16}
                                    className="text-emerald-500"
                                  />
                                ) : (
                                  <Copy size={16} />
                                )}
                              </button>
                            </div>
                            {/* Code Content */}
                            <div className="p-4 overflow-x-auto max-h-[400px]">
                              <pre className="text-sm font-mono text-[#d4d4d4] leading-relaxed">
                                <code>{script.script_content}</code>
                              </pre>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Side: Anatomy */}
                      <div>
                        {script.anatomy &&
                        JSON.parse(script.anatomy).length > 0 ? (
                          <>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-2">
                              <span className="w-5 h-5 rounded bg-gray-200 text-gray-600 flex items-center justify-center">
                                3
                              </span>
                              Anatomy Analysis
                            </h4>
                            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm max-h-[600px] overflow-y-auto">
                              <BashAnatomyBuilder
                                anatomy={
                                  JSON.parse(script.anatomy) as AnatomySection[]
                                }
                                readonly={true}
                              />
                            </div>
                          </>
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-white border border-gray-200 rounded-xl border-dashed">
                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                              <AlertCircle
                                size={20}
                                className="text-gray-400"
                              />
                            </div>
                            <h4 className="text-sm font-bold text-gray-700">
                              No Anatomy Analysis
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
                              This script doesn&apos;t have a detailed breakdown
                              yet.
                            </p>
                            <Link
                              href={`/bash/${script.id}/edit`}
                              className="mt-4 text-xs font-medium text-blue-600 hover:underline"
                            >
                              Add Analysis
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
