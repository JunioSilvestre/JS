"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  TerminalSquare,
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import SpellCheckedTextarea from "@/app/components/SpellCheckedTextarea";
import {
  apiCreateModule,
  apiGetModule,
  apiUpdateModule,
  Module,
} from "@/lib/api";

const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"] as const;
const PROVIDERS = [
  "Linux Professional Institute (LPI)",
  "Linux Foundation",
  "Microsoft",
  "AWS",
  "GCP",
  "CompTIA",
  "Cisco",
  "HashiCorp",
  "Red Hat",
  "Other",
];

function CreateModuleForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isEdit = Boolean(editId);

  const [formData, setFormData] = useState<
    Omit<
      Module,
      "created_at" | "updated_at" | "question_count" | "category_count"
    >
  >({
    id: "",
    title: "",
    description: "",
    provider: "",
    certification: "",
    difficulty: "Beginner",
  });

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (editId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(true);
      apiGetModule(editId)
        .then((res) =>
          setFormData({
            id: res.data.id,
            title: res.data.title,
            description: res.data.description || "",
            provider: res.data.provider || "",
            certification: res.data.certification || "",
            difficulty: res.data.difficulty || "Beginner",
          }),
        )
        .catch((err) => setErrors({ submit: err.message }))
        .finally(() => setLoading(false));
    }
  }, [editId]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.id.trim()) errs.id = "ID is required";
    else if (!/^[a-z0-9-]+$/.test(formData.id))
      errs.id = "Only lowercase letters, numbers and hyphens allowed";
    else if (formData.id.length < 3)
      errs.id = "ID must be at least 3 characters";

    if (!formData.title.trim()) errs.title = "Title is required";
    else if (formData.title.length < 3)
      errs.title = "Title must be at least 3 characters";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field])
      setErrors((prev) => {
        const e = { ...prev };
        delete e[field];
        return e;
      });
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    setErrors({});
    try {
      if (isEdit && editId) {
        await apiUpdateModule(editId, formData);
      } else {
        await apiCreateModule(formData);
      }
      setSuccess(true);
      setTimeout(() => router.push("/"), 800);
    } catch (err) {
      setErrors({
        submit: err instanceof Error ? err.message : "Failed to save module",
      });
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f5f5f5]">
        <Loader2 className="animate-spin text-indigo-400" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#e6e9ef] font-sans p-6 md:p-8 flex justify-center items-start">
      <div className="w-full max-w-2xl mt-8">
        <Link
          href="/"
          className="text-gray-500 hover:text-white flex items-center gap-2 mb-8 transition text-sm group"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Modules
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <TerminalSquare size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEdit ? "Edit Module" : "Create New Module"}
              </h1>
              <p className="text-gray-500 text-sm">
                {isEdit
                  ? "Update the module details below"
                  : "Initialize a new certification practice set"}
              </p>
            </div>
          </div>
        </div>

        {errors.submit && (
          <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 mb-6 text-sm">
            <AlertCircle size={18} />
            {errors.submit}
          </div>
        )}

        {success && (
          <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 mb-6 text-sm">
            <CheckCircle2 size={18} />
            Module {isEdit ? "updated" : "created"} successfully! Redirecting...
          </div>
        )}

        <div className="bg-white border border-gray-300 rounded-2xl p-8 shadow-xl space-y-6">
          {/* Module ID */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
              Module ID <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. lpic1-101-500"
              value={formData.id}
              onChange={(e) => handleChange("id", e.target.value.toLowerCase().trim())}
              disabled={isEdit}
              className={`w-full bg-[#f5f5f5] border rounded-xl px-4 py-3 text-gray-900 font-mono text-sm focus:outline-none transition ${
                errors.id
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-indigo-500"
              } ${isEdit ? "opacity-50 cursor-not-allowed" : ""}`}
            />
            {errors.id && (
              <p className="text-xs text-red-400 flex items-center gap-1">
                <AlertCircle size={12} />
                {errors.id}
              </p>
            )}
            {!errors.id && (
              <p className="text-xs text-slate-500">
                Lowercase, numbers and hyphens only. Cannot be changed after
                creation.
              </p>
            )}
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
              Module Title <span className="text-red-400">*</span>
            </label>
            <SpellCheckedTextarea
              asInput
              type="text"
              placeholder="e.g. System Architecture"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className={`w-full bg-[#f5f5f5] border rounded-xl px-4 py-3 text-gray-900 focus:outline-none transition ${
                errors.title
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-indigo-500"
              }`}
            />
            {errors.title && (
              <p className="text-xs text-red-400 flex items-center gap-1">
                <AlertCircle size={12} />
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Description
            </label>
            <SpellCheckedTextarea
              rows={3}
              placeholder="Provide a brief description of the module contents..."
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full bg-[#f5f5f5] border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-indigo-500 focus:outline-none transition resize-none text-sm"
            />
            <p className="text-xs text-slate-500 text-right">
              {formData.description.length} chars
            </p>
          </div>

          {/* Provider & Certification */}
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Provider
              </label>
              <select
                value={formData.provider}
                onChange={(e) => handleChange("provider", e.target.value)}
                className="w-full bg-[#f5f5f5] border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-indigo-500 focus:outline-none transition appearance-none cursor-pointer text-sm"
              >
                <option value="">Select provider...</option>
                {PROVIDERS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Certification
              </label>
              <input
                type="text"
                placeholder="e.g. LPIC-1 Exam 101"
                value={formData.certification}
                onChange={(e) => handleChange("certification", e.target.value)}
                className="w-full bg-[#f5f5f5] border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-indigo-500 focus:outline-none transition text-sm"
              />
            </div>
          </div>

          {/* Difficulty */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Difficulty
            </label>
            <div className="flex gap-3">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => handleChange("difficulty", d)}
                  className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition ${
                    formData.difficulty === d
                      ? d === "Beginner"
                        ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"
                        : d === "Intermediate"
                          ? "bg-amber-500/10 border-amber-500/50 text-amber-400"
                          : "bg-red-500/10 border-red-500/50 text-red-400"
                      : "bg-[#f5f5f5] border-gray-300 text-gray-500 hover:border-slate-500"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-gray-300 flex justify-end gap-3">
            <Link
              href="/"
              className="px-5 py-2.5 rounded-xl font-semibold text-gray-500 hover:text-white transition text-sm"
            >
              Cancel
            </Link>
            <button
              onClick={handleSave}
              disabled={saving || success}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition shadow-lg shadow-indigo-500/25 border border-indigo-500 text-sm"
            >
              {saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {saving
                ? "Saving..."
                : isEdit
                  ? "Update Module"
                  : "Create Module"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CreateModulePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-[#f5f5f5]">
          <Loader2 className="animate-spin text-indigo-400" size={32} />
        </div>
      }
    >
      <CreateModuleForm />
    </Suspense>
  );
}
