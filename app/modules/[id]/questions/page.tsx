"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Edit3,
  Trash2,
  Printer,
  Search,
  Filter,
  Loader2,
  AlertCircle,
  Plus,
  Layers,
  BookOpen,
  CheckCircle2,
  MessageSquare,
  Download,
} from "lucide-react";
import {
  apiGetModule,
  apiGetQuestions,
  apiDeleteQuestion,
  Module,
  Question,
  Category,
  parseFlags,
  parseExamples,
  apiGetCategories,
} from "@/lib/api";
import CommandCard from "../../../components/CommandCard";

export default function ModuleQuestionsPage() {
  const params = useParams();
  const moduleId = params.id as string;

  const [module, setModule] = useState<Module | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<string | number>(10);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [filterCategory, setFilterCategory] = useState("");
  const [moduleCategories, setModuleCategories] = useState<string[]>([]);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [modRes, qRes, catRes] = await Promise.all([
        apiGetModule(moduleId),
        apiGetQuestions(moduleId, {
          search,
          page,
          limit,
          category: filterCategory,
        }),
        apiGetCategories(moduleId),
      ]);
      setModule(modRes.data);
      setQuestions(qRes.data);
      setTotalQuestions(qRes.total || 0);
      setModuleCategories(catRes.data.map((c: Category) => c.name));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [moduleId, search, page, limit, filterCategory]);

  useEffect(() => {
    const timer = setTimeout(loadData, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [loadData, search, page, limit, filterCategory]);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this question? This cannot be undone.")) return;
    setDeleting(id);
    try {
      await apiDeleteQuestion(id);
      showToast("Question deleted");
      loadData();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setDeleting(null);
    }
  };

  const totalPages =
    limit === "all" ? 1 : Math.ceil(totalQuestions / Number(limit));

  const handleDownloadTXT = async () => {
    try {
      showToast("Generating TXT file...");
      const res = await apiGetQuestions(moduleId, { limit: "all" });
      const allQs = res.data;

      let text = `Module: ${module?.title || moduleId}\n`;
      text += `Total Questions: ${allQs.length}\n\n`;
      text += `=================================================\n\n`;

      allQs.forEach((q: Question, idx: number) => {
        text += `Question #${idx + 1} [${q.category || "General"}]\n`;
        text += `${q.question_text}\n\n`;
        text += `Answer:\n${q.correct_answer}\n\n`;
        if (q.explanation) {
          text += `Explanation:\n${q.explanation}\n\n`;
        }

        if (q.command_syntax) text += `Syntax:\n${q.command_syntax}\n\n`;
        if (q.command_options) text += `Options:\n${q.command_options}\n\n`;
        if (q.command_arguments)
          text += `Arguments:\n${q.command_arguments}\n\n`;
        if (q.command_how_it_works)
          text += `How It Works:\n${q.command_how_it_works}\n\n`;
        if (q.command_system_impact)
          text += `System Impact:\n${q.command_system_impact}\n\n`;
        if (q.command_troubleshooting)
          text += `Troubleshooting:\n${q.command_troubleshooting}\n\n`;
        if (q.command_security)
          text += `Security Considerations:\n${q.command_security}\n\n`;
        if (q.command_related)
          text += `Related Commands:\n${q.command_related}\n\n`;

        if (q.command_reference) {
          text += `Raw Command Reference:\n${q.command_reference}\n\n`;
        } else if (q.command_name || q.command_description) {
          text += `Command: ${q.command_name || ""}\n`;
          if (q.command_description)
            text += `Description: ${q.command_description}\n`;

          const flags = parseFlags(q.command_flags);
          if (flags.some((f) => f.flag)) {
            text += `Flags:\n`;
            flags
              .filter((f) => f.flag)
              .forEach((f) => {
                text += `  ${f.flag}  -  ${f.description || ""}\n`;
              });
          }
          const examples = parseExamples(q.command_examples);
          if (examples.some((e) => e.code)) {
            text += `Examples:\n`;
            examples
              .filter((e) => e.code)
              .forEach((e) => {
                text += `  $ ${e.code}\n`;
              });
          }
          text += `\n`;
        }
        text += `-------------------------------------------------\n\n`;
      });

      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(module?.title || "module").replace(/\s+/g, "_")}_questions.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showToast("TXT file downloaded!");
    } catch {
      showToast("Failed to generate TXT");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-red-400 gap-3">
        <AlertCircle size={24} />
        <span>{error}</span>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-gray-50/90 backdrop-blur-md border-b border-gray-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-gray-500 hover:text-gray-900 transition flex items-center gap-1.5 text-sm group"
            >
              <ArrowLeft
                size={16}
                className="group-hover:-translate-x-1 transition-transform"
              />
              Modules
            </Link>
            <span className="text-gray-500">/</span>
            <div>
              <h1 className="font-bold text-gray-900 text-lg leading-tight">
                {module?.title}
              </h1>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                {module?.certification && <span>{module.certification}</span>}
                {module?.provider && <span>• {module.provider}</span>}
                <span>• {totalQuestions} questions</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadTXT}
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 hover:border-slate-500 text-gray-700 rounded-lg text-sm font-medium transition"
            >
              <Download size={15} /> TXT
            </button>
            <Link
              href={`/modules/${moduleId}/print`}
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 hover:border-slate-500 text-gray-700 rounded-lg text-sm font-medium transition"
            >
              <Printer size={15} /> Print / PDF
            </Link>
            <Link
              href={`/questions/create`}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-gray-900 rounded-lg text-sm font-semibold transition shadow-lg shadow-blue-500/20"
            >
              <Plus size={15} /> Add Question
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-6">
        {/* Filters */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              placeholder="Search questions..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full bg-white border border-gray-200 text-gray-800 placeholder-slate-500 rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-blue-500 transition text-sm"
            />
          </div>
          <div className="relative">
            <Filter
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
            <select
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value);
                setPage(1);
              }}
              className="bg-white border border-gray-200 text-gray-700 pl-9 pr-8 py-2.5 rounded-xl appearance-none focus:outline-none focus:border-blue-500 transition text-sm cursor-pointer"
            >
              <option value="">All Categories</option>
              {moduleCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            {
              label: "Total Questions",
              value: questions.length,
              icon: <BookOpen size={18} className="text-blue-600" />,
            },
            {
              label: "Categories",
              value: moduleCategories.length,
              icon: <Layers size={18} className="text-purple-400" />,
            },
            {
              label: "Showing",
              value: totalQuestions,
              icon: <Filter size={18} className="text-emerald-400" />,
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3"
            >
              {s.icon}
              <div>
                <div className="text-xl font-bold text-gray-900">{s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Questions */}
        {questions.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <BookOpen size={40} className="mx-auto mb-3 opacity-20" />
            <p>
              {search || filterCategory
                ? "No questions match your filters"
                : "No questions yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {questions.map((q, index) => {
              const flags = parseFlags(q.command_flags);
              const examples = parseExamples(q.command_examples);
              return (
                <div
                  key={q.id}
                  className="bg-white border border-gray-200 hover:border-blue-300 rounded-2xl p-5 transition group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-indigo-600 bg-indigo-50 border border-indigo-200 shadow-sm px-2.5 py-1 rounded-md">
                        #
                        {(page - 1) *
                          (limit === "all" ? totalQuestions : Number(limit)) +
                          index +
                          1}
                      </span>
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                        {q.category}
                      </span>
                      {q.command_name && (
                        <span className="text-xs font-mono text-gray-700 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-200">
                          $ {q.command_name}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                      <Link
                        href={`/questions/create?edit=${q.id}`}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-700/10 transition"
                      >
                        <Edit3 size={14} />
                      </Link>
                      <button
                        onClick={() => handleDelete(q.id)}
                        disabled={deleting === q.id}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition disabled:opacity-50"
                      >
                        {deleting === q.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Question */}
                  <div className="flex items-start gap-3 mb-4 mt-2">
                    <AlertCircle
                      size={18}
                      className="mt-0.5 text-gray-500 flex-shrink-0"
                    />
                    <p className="text-[15px] text-gray-800 leading-relaxed font-medium whitespace-pre-wrap break-words">
                      {q.question_text}
                    </p>
                  </div>

                  {/* Correct Answer */}
                  <div className="flex items-start gap-3 mb-4">
                    <CheckCircle2
                      size={18}
                      className="mt-0.5 text-emerald-500 flex-shrink-0"
                    />
                    <div className="bg-emerald-50/50 border border-emerald-200/60 rounded-xl px-4 py-3 font-mono text-sm text-emerald-700 shadow-sm w-full whitespace-pre-wrap break-words">
                      {q.correct_answer}
                    </div>
                  </div>

                  {/* Explanation */}
                  {q.explanation && (
                    <div className="flex items-start gap-3 mb-4">
                      <MessageSquare
                        size={18}
                        className="mt-0.5 text-blue-400 flex-shrink-0"
                      />
                      <div className="bg-blue-50/40 border border-blue-100 rounded-xl px-4 py-3 text-sm text-gray-600 leading-relaxed shadow-sm w-full whitespace-pre-wrap break-words">
                        <strong className="text-gray-700 font-semibold block mb-1">
                          Explanation:
                        </strong>
                        {q.explanation}
                      </div>
                    </div>
                  )}

                  {(q.command_name ||
                    q.command_description ||
                    flags.some((f) => f.flag) ||
                    examples.some((e) => e.code) ||
                    q.command_reference ||
                    q.command_syntax ||
                    q.command_options) && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <CommandCard
                        command={q.command_name || ""}
                        description={q.command_description || ""}
                        flags={flags}
                        examples={examples}
                        command_reference={q.command_reference}
                        command_syntax={q.command_syntax}
                        command_options={q.command_options}
                        command_arguments={q.command_arguments}
                        command_how_it_works={q.command_how_it_works}
                        command_system_impact={q.command_system_impact}
                        command_troubleshooting={q.command_troubleshooting}
                        command_security={q.command_security}
                        command_related={q.command_related}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-6 bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">Items per page:</span>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(
                e.target.value === "all" ? "all" : Number(e.target.value),
              );
              setPage(1);
            }}
            className="bg-gray-50 border border-gray-200 text-gray-700 py-1 px-2 rounded-lg text-sm focus:outline-none focus:border-blue-500"
          >
            <option value={1}>1</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value="all">All</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-100 text-gray-700"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-100 text-gray-700"
          >
            Next
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl border bg-white border-gray-200 text-gray-800 text-sm">
          {toast}
        </div>
      )}
    </div>
  );
}
