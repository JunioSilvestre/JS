"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  ArrowLeft,
  TerminalSquare,
  Search,
  Trash2,
  Save,
  Edit3,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Eye,
  X,
  ChevronDown,
  FolderPlus,
  Terminal,
  AlignLeft,
  Code,
} from "lucide-react";
import CommandCard from "../../components/CommandCard";
import SpellCheckedTextarea from "@/app/components/SpellCheckedTextarea";
import {
  apiGetModules,
  apiGetCategories,
  apiGetQuestions,
  apiCreateQuestion,
  apiUpdateQuestion,
  apiDeleteQuestion,
  apiCreateCategory,
  Module,
  Category,
  Question,
  CommandFlag,
  CommandExample,
  parseFlags,
  parseExamples,
} from "@/lib/api";

interface FormState {
  module_id: string;
  category: string;
  question: string;
  correct_answer: string;
  explanation: string;
  commandBreakdown: {
    command: string;
    description: string;
    flags: CommandFlag[];
    examples: CommandExample[];
    command_reference: string;
    command_syntax: string;
    command_options: string;
    command_arguments: string;
    command_how_it_works: string;
    command_system_impact: string;
    command_troubleshooting: string;
    command_security: string;
    command_related: string;
  };
}

const EMPTY_FORM: Omit<FormState, "module_id" | "category"> = {
  question: "",
  correct_answer: "",
  explanation: "",
  commandBreakdown: {
    command: "",
    description: "",
    flags: [{ flag: "", description: "" }],
    examples: [{ code: "" }],
    command_reference: "",
    command_syntax: "",
    command_options: "",
    command_arguments: "",
    command_how_it_works: "",
    command_system_impact: "",
    command_troubleshooting: "",
    command_security: "",
    command_related: "",
  },
};

export default function CreateQuestionPage() {
  const router = useRouter();
  const [modules, setModules] = useState<Module[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [loadingModules, setLoadingModules] = useState(true);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchQ, setSearchQ] = useState("");
  const [page, setPage] = useState(1);
  const [newCategoryInput, setNewCategoryInput] = useState("");
  const [showCategoryInput, setShowCategoryInput] = useState(false);

  const [formData, setFormData] = useState<FormState>({
    module_id: "",
    category: "",
    ...EMPTY_FORM,
  });

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Load modules on mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoadingModules(true);
    apiGetModules()
      .then((res) => {
        setModules(res.data);
        if (res.data.length > 0) {
          setFormData((prev) => ({ ...prev, module_id: res.data[0].id }));
        }
      })
      .catch((err) => showToast(err.message, "error"))
      .finally(() => setLoadingModules(false));
  }, []);

  const refreshQuestions = useCallback(
    async (moduleId: string) => {
      if (!moduleId) return;
      setLoadingQuestions(true);
      try {
        const res = await apiGetQuestions(moduleId, {
          search: searchQ,
          limit: 50,
          page,
        });
        setQuestions(res.data);
      } catch (err) {
        showToast((err as Error).message, "error");
      } finally {
        setLoadingQuestions(false);
      }
    },
    [searchQ, page],
  );

  // Load categories & questions when module changes
  useEffect(() => {
    if (!formData.module_id) return;
    apiGetCategories(formData.module_id)
      .then((res) => {
        setCategories(res.data);
        if (res.data.length > 0) {
          setFormData((prev) => ({ ...prev, category: res.data[0].name }));
        } else {
          setFormData((prev) => ({ ...prev, category: "" }));
        }
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshQuestions(formData.module_id);
  }, [formData.module_id, refreshQuestions]);

  // Re-search when searchQ changes
  useEffect(() => {
    if (formData.module_id) {
      const timer = setTimeout(() => refreshQuestions(formData.module_id), 300);
      return () => clearTimeout(timer);
    }
  }, [searchQ, formData.module_id, refreshQuestions]);

  const updateField = (field: keyof FormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field])
      setErrors((prev) => {
        const e = { ...prev };
        delete e[field];
        return e;
      });
  };

  const updateCmd = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      commandBreakdown: { ...prev.commandBreakdown, [field]: value },
    }));
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.module_id) errs.module_id = "Select a module";
    if (!formData.category && !newCategoryInput.trim())
      errs.category = "Select or create a category";
    if (!formData.question.trim()) errs.question = "Question text is required";
    if (!formData.correct_answer.trim())
      errs.correct_answer = "Correct answer is required";
    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      showToast("Please fill in all required fields.", "error");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      // If user typed a new category but forgot to click Add
      let currentCategory = formData.category;
      if (!currentCategory && newCategoryInput.trim()) {
        try {
          await apiCreateCategory(formData.module_id, newCategoryInput.trim());
          currentCategory = newCategoryInput.trim();
          setNewCategoryInput("");
          setShowCategoryInput(false);
          // Refresh categories in the background
          apiGetCategories(formData.module_id).then((res) =>
            setCategories(res.data),
          );
        } catch {
          showToast("Failed to auto-create category", "error");
          setSaving(false);
          return;
        }
      }

      const payload = {
        module_id: formData.module_id,
        category: currentCategory,
        question_text: formData.question,
        correct_answer: formData.correct_answer,
        explanation: formData.explanation,
        command_name: formData.commandBreakdown.command,
        command_description: formData.commandBreakdown.description,
        command_flags: formData.commandBreakdown.flags.filter(
          (f) => f.flag || f.description,
        ),
        command_examples: formData.commandBreakdown.examples.filter(
          (e) => e.code,
        ),
        command_reference: formData.commandBreakdown.command_reference,
        command_syntax: formData.commandBreakdown.command_syntax,
        command_options: formData.commandBreakdown.command_options,
        command_arguments: formData.commandBreakdown.command_arguments,
        command_how_it_works: formData.commandBreakdown.command_how_it_works,
        command_system_impact: formData.commandBreakdown.command_system_impact,
        command_troubleshooting:
          formData.commandBreakdown.command_troubleshooting,
        command_security: formData.commandBreakdown.command_security,
        command_related: formData.commandBreakdown.command_related,
      };

      if (editingId) {
        await apiUpdateQuestion(editingId, payload);
        showToast("Question updated!");
      } else {
        await apiCreateQuestion(payload);
        showToast("Question saved!");
      }

      resetForm();
      // preserve the selected module and category after reset
      setFormData((prev) => ({
        ...prev,
        module_id: payload.module_id,
        category: payload.category,
      }));
      refreshQuestions(payload.module_id);
    } catch (err) {
      showToast((err as Error).message, "error");
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setErrors({});
    setFormData((prev) => ({
      ...prev,
      ...EMPTY_FORM,
    }));
  };

  const loadForEdit = (q: Question) => {
    setEditingId(q.id);
    setErrors({});
    setFormData({
      module_id: q.module_id,
      category: q.category,
      question: q.question_text,
      correct_answer: q.correct_answer,
      explanation: q.explanation || "",
      commandBreakdown: {
        command: q.command_name || "",
        description: q.command_description || "",
        flags: parseFlags(q.command_flags),
        examples: parseExamples(q.command_examples),
        command_reference: q.command_reference || "",
        command_syntax: q.command_syntax || "",
        command_options: q.command_options || "",
        command_arguments: q.command_arguments || "",
        command_how_it_works: q.command_how_it_works || "",
        command_system_impact: q.command_system_impact || "",
        command_troubleshooting: q.command_troubleshooting || "",
        command_security: q.command_security || "",
        command_related: q.command_related || "",
      },
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this question? This cannot be undone.")) return;
    try {
      await apiDeleteQuestion(id);
      if (editingId === id) resetForm();
      refreshQuestions(formData.module_id);
      showToast("Question deleted");
    } catch (err) {
      showToast((err as Error).message, "error");
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryInput.trim()) return;
    try {
      await apiCreateCategory(formData.module_id, newCategoryInput.trim());
      const res = await apiGetCategories(formData.module_id);
      setCategories(res.data);
      setFormData((prev) => ({ ...prev, category: newCategoryInput.trim() }));
      setNewCategoryInput("");
      setShowCategoryInput(false);
      showToast(`Category "${newCategoryInput}" created`);
    } catch (err) {
      showToast((err as Error).message, "error");
    }
  };

  // Filtered questions for sidebar
  const filteredQs = questions;

  // Preview data
  const previewFlags = formData.commandBreakdown.flags.filter(
    (f) => f.flag || f.description,
  );
  const previewExamples = formData.commandBreakdown.examples.filter(
    (e) => e.code,
  );

  const selectedModule = modules.find((m) => m.id === formData.module_id);

  return (
    <div className="flex h-screen bg-gray-50 text-[#e6e9ef] font-sans overflow-hidden">
      {/* Sidebar - Questions List */}
      <aside className="w-72 bg-gray-100 border-r border-gray-200 flex flex-col flex-shrink-0">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-gray-900 font-bold text-xs">
            C
          </div>
          <h1 className="text-base font-bold text-gray-900">Cert-Hub</h1>
        </div>

        {/* Back & Module Selector */}
        <div className="p-3 border-b border-gray-200 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition text-sm font-medium"
          >
            <ArrowLeft size={14} /> Back to Modules
          </Link>

          <div className="relative">
            <select
              value={formData.module_id}
              onChange={(e) => {
                if (e.target.value === "new") {
                  router.push("/modules/create");
                  return;
                }
                setFormData((prev) => ({ ...prev, module_id: e.target.value }));
              }}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 text-sm focus:outline-none focus:border-blue-500 transition appearance-none cursor-pointer"
            >
              {loadingModules ? (
                <option>Loading...</option>
              ) : (
                <>
                  {modules.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title}
                    </option>
                  ))}
                  <option value="new">+ Create New Module</option>
                </>
              )}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
          </div>

          {/* Module info */}
          {selectedModule && (
            <div className="px-1 flex items-center gap-2 text-xs text-gray-400">
              <span>{filteredQs.length} questions</span>
              {selectedModule.certification && (
                <>
                  <span>•</span>
                  <span>{selectedModule.certification}</span>
                </>
              )}
            </div>
          )}
          <div className="flex justify-between items-center mt-4 px-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="text-xs text-blue-600 disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-xs text-gray-500">Page {page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              className="text-xs text-blue-600"
            >
              Next
            </button>
          </div>
        </div>

        {/* Search Questions */}
        <div className="p-3 border-b border-gray-200">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-gray-900 text-xs focus:outline-none focus:border-blue-500 transition placeholder-slate-500"
            />
          </div>
        </div>

        {/* Questions List */}
        <div className="flex-1 overflow-y-auto p-2">
          {loadingQuestions ? (
            <div className="flex items-center justify-center py-8 text-gray-400 gap-2 text-sm">
              <Loader2 size={16} className="animate-spin" /> Loading...
            </div>
          ) : filteredQs.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-xs px-4">
              {searchQ
                ? "No questions match your search"
                : "No questions yet. Create one!"}
            </div>
          ) : (
            <div className="space-y-1">
              {filteredQs.map((q, index) => {
                // Parse command flags/examples if available
                let cmdPreview = "";
                if (q.command_name) {
                  cmdPreview = q.command_name;
                }

                return (
                  <div
                    key={q.id}
                    className={`w-full text-left p-3.5 rounded-xl transition border flex flex-col gap-2.5 group cursor-pointer shadow-sm ${
                      editingId === q.id
                        ? "bg-blue-50 border-blue-300 text-gray-900 shadow-md"
                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:shadow-md hover:border-gray-300"
                    }`}
                    onClick={() => loadForEdit(q)}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-black px-2.5 py-1 rounded shadow-sm border ${editingId === q.id ? "bg-blue-600 text-white border-blue-700" : "bg-white text-blue-600 border-blue-200"}`}
                        >
                          #{index + 1}
                        </span>
                        {q.category && (
                          <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                            {q.category}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            loadForEdit(q);
                          }}
                          className="p-1.5 rounded-md text-blue-600 hover:text-white hover:bg-blue-600 transition"
                          title="Edit Question"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(q.id);
                          }}
                          className="p-1.5 rounded-md text-red-500 hover:text-white hover:bg-red-500 transition"
                          title="Delete Question"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-3 pt-1">
                      {/* Question */}
                      <div className="flex items-start gap-2">
                        <AlertCircle
                          size={15}
                          className="mt-0.5 text-gray-500 flex-shrink-0"
                        />
                        <p className="text-sm font-medium text-gray-800 leading-relaxed whitespace-pre-wrap break-words">
                          {q.question_text}
                        </p>
                      </div>

                      {/* Answer */}
                      {q.correct_answer && (
                        <div className="flex items-start gap-2">
                          <CheckCircle2
                            size={15}
                            className="mt-0.5 text-emerald-500 flex-shrink-0"
                          />
                          <div className="text-xs bg-emerald-50 text-emerald-700 font-mono p-1.5 rounded border border-emerald-100 whitespace-pre-wrap break-words w-full">
                            {q.correct_answer}
                          </div>
                        </div>
                      )}

                      {/* Command */}
                      {cmdPreview && (
                        <div className="flex items-start gap-2">
                          <TerminalSquare
                            size={15}
                            className="mt-0.5 text-blue-500 flex-shrink-0"
                          />
                          <div className="text-xs bg-gray-900 text-[#7dcfff] font-mono p-1.5 rounded border border-gray-700 whitespace-pre-wrap break-words w-full">
                            {cmdPreview}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* New Question Button */}
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={resetForm}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-300 text-blue-600 text-sm font-medium transition"
          >
            <Plus size={16} /> New Question
          </button>
        </div>
      </aside>

      {/* Main: 2-column Split */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left: Form */}
        <div className="flex-1 overflow-y-auto border-r border-gray-200">
          <div className="p-6 max-w-2xl mx-auto">
            {/* Form Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {editingId
                    ? `Editing Question #${questions.findIndex((q) => q.id === editingId) + 1}`
                    : "New Question"}
                </h2>
                <p className="text-gray-500 text-sm">
                  Fill the form — preview updates in real time →
                </p>
              </div>
              {editingId && (
                <button
                  onClick={resetForm}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-200 hover:bg-slate-700 text-gray-900 rounded-lg text-xs transition"
                >
                  <X size={14} /> Cancel Edit
                </button>
              )}
            </div>

            <div className="space-y-6">
              {/* Metadata */}
              <div className="bg-white border border-gray-300 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Metadata
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  {/* Module */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500">
                      Module
                    </label>
                    <div className="relative">
                      <select
                        value={formData.module_id}
                        onChange={(e) => {
                          if (e.target.value === "new") {
                            router.push("/modules/create");
                            return;
                          }
                          setFormData((prev) => ({
                            ...prev,
                            module_id: e.target.value,
                          }));
                        }}
                        className={`w-full bg-gray-50 border rounded-lg px-3 py-2.5 text-gray-900 text-sm focus:outline-none transition appearance-none ${errors.module_id ? "border-red-500" : "border-gray-300 focus:border-blue-500"}`}
                      >
                        {modules.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.title}
                          </option>
                        ))}
                        <option value="new">+ New Module</option>
                      </select>
                      <ChevronDown
                        size={14}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                      />
                    </div>
                    {errors.module_id && (
                      <p className="text-xs text-red-400">{errors.module_id}</p>
                    )}
                  </div>

                  {/* Category */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500">
                      Category
                    </label>
                    {showCategoryInput ? (
                      <div className="flex gap-2">
                        <input
                          autoFocus
                          type="text"
                          placeholder="New category..."
                          value={newCategoryInput}
                          onChange={(e) => setNewCategoryInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleAddCategory();
                            if (e.key === "Escape") {
                              setShowCategoryInput(false);
                              setNewCategoryInput("");
                            }
                          }}
                          className="flex-1 bg-gray-50 border border-blue-400 rounded-lg px-3 py-2 text-gray-900 text-sm focus:outline-none"
                        />
                        <button
                          onClick={handleAddCategory}
                          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-gray-900 text-xs font-medium transition"
                        >
                          Add
                        </button>
                        <button
                          onClick={() => {
                            setShowCategoryInput(false);
                            setNewCategoryInput("");
                          }}
                          className="p-2 text-gray-500 hover:text-gray-900"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <select
                            value={formData.category}
                            onChange={(e) =>
                              updateField("category", e.target.value)
                            }
                            className={`w-full bg-gray-50 border rounded-lg px-3 py-2.5 text-gray-900 text-sm focus:outline-none transition appearance-none ${errors.category ? "border-red-500" : "border-gray-300 focus:border-blue-500"}`}
                          >
                            <option value="">Select category...</option>
                            {categories.map((c) => (
                              <option key={c.id} value={c.name}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            size={14}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                          />
                        </div>
                        <button
                          onClick={() => setShowCategoryInput(true)}
                          title="Add new category"
                          className="p-2 bg-gray-50 border border-gray-300 hover:border-blue-500 rounded-lg text-gray-500 hover:text-blue-600 transition"
                        >
                          <FolderPlus size={16} />
                        </button>
                      </div>
                    )}
                    {errors.category && (
                      <p className="text-xs text-red-400">{errors.category}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Question Content */}
              <div className="bg-white border border-gray-300 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Question
                </h3>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                    Question Text <span className="text-red-400">*</span>
                  </label>
                  <SpellCheckedTextarea
                    rows={3}
                    value={formData.question}
                    onChange={(e) => updateField("question", e.target.value)}
                    placeholder="Write the question here..."
                    className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none transition resize-none ${errors.question ? "border-red-500" : "border-gray-300 focus:border-blue-500"}`}
                  />
                  {errors.question && (
                    <p className="text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.question}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                    Correct Answer <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.correct_answer}
                    onChange={(e) =>
                      updateField("correct_answer", e.target.value)
                    }
                    placeholder="e.g. lspci -v -s 02:00.0"
                    className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-blue-600 font-mono text-sm focus:outline-none transition ${errors.correct_answer ? "border-red-500" : "border-blue-300 focus:border-blue-500"}`}
                  />
                  {errors.correct_answer && (
                    <p className="text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.correct_answer}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500">
                    Explanation
                  </label>
                  <SpellCheckedTextarea
                    rows={3}
                    value={formData.explanation}
                    onChange={(e) => updateField("explanation", e.target.value)}
                    placeholder="Explain why this answer is correct..."
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:border-blue-500 transition resize-none"
                  />
                </div>
              </div>

              {/* Command Breakdown */}
              <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 mt-6">
                <div className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-6 border-b border-gray-100 pb-2">
                  Command Reference Builder
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-blue-600 uppercase tracking-widest flex items-center gap-2">
                        <Terminal size={14} /> Command Name
                      </label>
                      <input
                        type="text"
                        value={formData.commandBreakdown.command}
                        onChange={(e) => updateCmd("command", e.target.value)}
                        placeholder="e.g. lspci"
                        className="w-full bg-gray-50 border border-gray-200 p-3 text-gray-900 font-mono text-sm rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-blue-600 uppercase tracking-widest flex items-center gap-2">
                        <AlignLeft size={14} /> Short Description
                      </label>
                      <SpellCheckedTextarea
                        asInput
                        type="text"
                        value={formData.commandBreakdown.description}
                        onChange={(e) =>
                          updateCmd("description", e.target.value)
                        }
                        placeholder="What does this command do?"
                        className="w-full bg-gray-50 border border-gray-200 p-3 text-gray-900 text-sm rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                      />
                    </div>
                  </div>

                  {/* Command Reference Sections */}
                  <div className="space-y-4 pt-6 border-t border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      Command Reference Sections
                    </h3>

                    {[
                      { key: "command_syntax", label: "Syntax" },
                      { key: "command_options", label: "Options" },
                      { key: "command_arguments", label: "Arguments" },
                      {
                        key: "command_examples",
                        label: "Examples (Text)",
                        realKey: "command_examples",
                      }, // Not to be confused with structured examples
                      { key: "command_how_it_works", label: "How It Works" },
                      { key: "command_system_impact", label: "System Impact" },
                      {
                        key: "command_troubleshooting",
                        label: "Troubleshooting",
                      },
                      {
                        key: "command_security",
                        label: "Security Considerations",
                      },
                      { key: "command_related", label: "Related Commands" },
                    ].map((section) => (
                      <div key={section.key} className="space-y-1.5">
                        <label className="text-sm font-bold text-blue-600 uppercase tracking-widest flex items-center gap-2">
                          <AlignLeft size={14} /> {section.label}
                        </label>
                        {["command_how_it_works", "command_system_impact", "command_troubleshooting", "command_security", "command_examples"].includes(section.key) ? (
                          <SpellCheckedTextarea
                            rows={3}
                            value={
                              (formData.commandBreakdown[
                                section.key as keyof FormState["commandBreakdown"]
                              ] as string) || ""
                            }
                            onChange={(e) =>
                              updateCmd(section.key, e.target.value)
                            }
                            placeholder={`Enter ${section.label.toLowerCase()}...`}
                            className="w-full bg-gray-50 border border-gray-200 p-3 text-gray-900 font-mono text-sm rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition resize-y"
                          />
                        ) : (
                          <textarea
                            rows={3}
                            value={
                              (formData.commandBreakdown[
                                section.key as keyof FormState["commandBreakdown"]
                              ] as string) || ""
                            }
                            onChange={(e) =>
                              updateCmd(section.key, e.target.value)
                            }
                            placeholder={`Enter ${section.label.toLowerCase()}...`}
                            className="w-full bg-gray-50 border border-gray-200 p-3 text-gray-900 font-mono text-sm rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition resize-y"
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Command Reference (ASCII Sheet - Fallback) */}
                  <div className="space-y-1.5 pt-6 border-t border-gray-100">
                    <label className="text-sm font-bold text-blue-600 uppercase tracking-widest flex items-center gap-2">
                      <Code size={14} /> Full ASCII Reference Sheet (Fallback)
                    </label>
                    <textarea
                      rows={8}
                      value={formData.commandBreakdown.command_reference}
                      onChange={(e) =>
                        updateCmd("command_reference", e.target.value)
                      }
                      placeholder="Paste the full ASCII reference sheet here if not using the individual sections above..."
                      className="w-full bg-gray-50 border border-gray-200 p-4 text-gray-900 font-mono text-xs rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition resize-y whitespace-pre overflow-x-auto"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-between items-center pb-8">
                {editingId && (
                  <Link
                    href={`/modules/${formData.module_id}/print`}
                    target="_blank"
                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 hover:border-slate-500 text-gray-700 rounded-xl text-sm font-medium transition"
                  >
                    <Eye size={16} /> Preview Print
                  </Link>
                )}
                <div className="flex gap-3 ml-auto">
                  {editingId && (
                    <button
                      onClick={resetForm}
                      className="px-4 py-2.5 text-gray-500 hover:text-gray-900 transition text-sm"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-gray-900 px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition shadow-lg shadow-indigo-500/25 border border-blue-500 text-sm"
                  >
                    {saving ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Save size={16} />
                    )}
                    {saving
                      ? "Saving..."
                      : editingId
                        ? "Update Question"
                        : "Save Question"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Preview */}
        <div className="w-[45%] bg-[#0c0e14] overflow-y-auto flex-shrink-0 hidden xl:flex flex-col">
          <div className="sticky top-0 z-10 px-6 py-4 border-b border-gray-200 bg-[#0c0e14]/95 backdrop-blur-sm flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <Eye size={16} className="text-blue-600" /> Live Preview
            </h2>
            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-bold border border-emerald-500/20 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>
          </div>

          <div className="p-6 space-y-5 pb-20">
            {/* Question Card Preview */}
            <div className="bg-white border border-gray-300 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="bg-gray-200 text-gray-700 px-2.5 py-0.5 rounded-lg text-xs font-bold border border-gray-300">
                  {formData.module_id || "No Module"}
                </span>
                {formData.category && (
                  <span className="text-blue-600 text-xs font-semibold">
                    {formData.category}
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-900 mb-4 leading-relaxed whitespace-pre-wrap min-h-[2rem]">
                {formData.question || (
                  <span className="text-gray-600 italic">
                    Question text will appear here...
                  </span>
                )}
              </p>

              <div className="mb-4">
                <div className="inline-block px-2 py-0.5 bg-indigo-500/20 text-blue-600 rounded text-xs font-bold mb-2 uppercase tracking-wider">
                  Correct Answer
                </div>
                <div className="w-full bg-gray-50 border border-blue-300 rounded-xl p-3 text-indigo-200 font-mono text-sm shadow-inner whitespace-pre-wrap break-all min-h-[2rem]">
                  {formData.correct_answer || (
                    <span className="text-gray-600 italic">Answer...</span>
                  )}
                </div>
              </div>

              {formData.explanation && (
                <div className="bg-[#1a1d29] border-l-4 border-slate-600 rounded-r-xl p-3 text-gray-500 text-xs leading-relaxed whitespace-pre-wrap">
                  <strong className="text-gray-700 block mb-1">
                    Explanation:
                  </strong>
                  {formData.explanation}
                </div>
              )}
            </div>

            {/* Command Card Preview — real-time */}
            {(formData.commandBreakdown.command ||
              formData.commandBreakdown.command_reference) && (
              <CommandCard
                command={formData.commandBreakdown.command}
                description={formData.commandBreakdown.description}
                flags={
                  previewFlags.length > 0
                    ? previewFlags
                    : formData.commandBreakdown.flags
                }
                examples={
                  previewExamples.length > 0
                    ? previewExamples
                    : formData.commandBreakdown.examples
                }
                command_reference={formData.commandBreakdown.command_reference}
                command_syntax={formData.commandBreakdown.command_syntax}
                command_options={formData.commandBreakdown.command_options}
                command_arguments={formData.commandBreakdown.command_arguments}
                command_how_it_works={
                  formData.commandBreakdown.command_how_it_works
                }
                command_system_impact={
                  formData.commandBreakdown.command_system_impact
                }
                command_troubleshooting={
                  formData.commandBreakdown.command_troubleshooting
                }
                command_security={formData.commandBreakdown.command_security}
                command_related={formData.commandBreakdown.command_related}
              />
            )}

            {!formData.question && !formData.commandBreakdown.command && (
              <div className="text-center py-12 text-gray-600">
                <TerminalSquare size={40} className="mx-auto mb-3 opacity-20" />
                <p className="text-sm">
                  Start typing to see the preview update in real time
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl border text-sm font-medium ${
            toast.type === "success"
              ? "bg-emerald-950 border-emerald-500/30 text-emerald-300"
              : "bg-red-950 border-red-500/30 text-red-300"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 size={16} />
          ) : (
            <AlertCircle size={16} />
          )}
          {toast.message}
        </div>
      )}
    </div>
  );
}
