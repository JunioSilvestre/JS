"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Terminal,
  ArrowLeft,
  Save,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { apiCreateBashScript } from "@/lib/api";
import BashAnatomyBuilder, {
  AnatomySection,
} from "@/app/components/BashAnatomyBuilder";

export default function CreateBashScriptPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [formData, setFormData] = useState<{
    title: string;
    problem: string;
    script_content: string;
    anatomy: AnatomySection[];
  }>({
    title: "",
    problem: "",
    script_content: "#!/bin/bash\n\n# Your script here...\n",
    anatomy: [],
  });

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    if (
      !formData.title.trim() ||
      !formData.problem.trim() ||
      !formData.script_content.trim()
    ) {
      showToast("Please fill in all fields", "error");
      return;
    }

    try {
      setSaving(true);
      await apiCreateBashScript({
        title: formData.title,
        problem: formData.problem,
        script_content: formData.script_content,
        anatomy: JSON.stringify(formData.anatomy),
      });

      showToast("Script saved successfully!", "success");
      setTimeout(() => {
        router.push("/bash");
      }, 1000);
    } catch (error: unknown) {
      showToast((error as Error).message || "Failed to save script", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/bash"
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <ArrowLeft size={18} />
            </Link>
            <div className="h-6 w-px bg-gray-200"></div>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
              <Terminal size={16} className="text-gray-400" />
              New Bash Script
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-gray-900 hover:bg-black text-white rounded-lg text-sm font-medium transition shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <Save size={16} />
            {saving ? "Saving..." : "Save Script"}
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT COLUMN - Form */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
                1
              </span>
              Problem Definition
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Find and delete old logs"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  The Problem (Question)
                </label>
                <textarea
                  placeholder="Describe the problem to solve..."
                  value={formData.problem}
                  onChange={(e) =>
                    setFormData({ ...formData, problem: e.target.value })
                  }
                  rows={5}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all placeholder:text-gray-400 resize-y min-h-[120px]"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
                2
              </span>
              Script Solution
            </h2>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Bash Code (.sh)
              </label>
              <div className="rounded-xl overflow-hidden shadow-sm border border-[#333] bg-[#1e1e1e] focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all">
                {/* Mac Window Header */}
                <div className="flex items-center px-4 py-3 bg-[#2d2d2d] border-b border-[#111]">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                  </div>
                  <div className="flex-1 text-center text-xs text-gray-400 font-medium font-mono">
                    {formData.title
                      ? formData.title.toLowerCase().replace(/\s+/g, "-") +
                        ".sh"
                      : "untitled.sh"}
                  </div>
                </div>
                <textarea
                  value={formData.script_content}
                  onChange={(e) =>
                    setFormData({ ...formData, script_content: e.target.value })
                  }
                  rows={12}
                  className="w-full bg-transparent text-[#d4d4d4] font-mono text-sm px-4 py-4 focus:outline-none resize-y min-h-[250px]"
                  spellCheck={false}
                />
              </div>
            </div>

            <BashAnatomyBuilder
              anatomy={formData.anatomy}
              onChange={(newAnatomy) =>
                setFormData({ ...formData, anatomy: newAnatomy })
              }
            />
          </div>
        </div>

        {/* RIGHT COLUMN - Live Preview */}
        <div className="hidden lg:block relative">
          <div className="sticky top-24">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              Live Preview
            </h3>

            {formData.title || formData.problem || formData.script_content ? (
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="p-5 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {formData.title || "Untitled Script"}
                    </h3>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-gray-100 bg-gray-50/50">
                  <div className="mt-4 mb-6">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                      The Problem
                    </h4>
                    <p className="text-gray-800 text-[15px] leading-relaxed bg-white p-4 rounded-lg border border-gray-200 shadow-sm whitespace-pre-wrap">
                      {formData.problem || "No problem description yet..."}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
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
                          {(formData.title || "untitled")
                            .toLowerCase()
                            .replace(/\s+/g, "-")}
                          .sh
                        </div>
                      </div>
                      {/* Code Content */}
                      <div className="p-4 overflow-x-auto">
                        <pre className="text-[13px] md:text-sm font-mono text-[#d4d4d4] leading-relaxed">
                          <code>{formData.script_content}</code>
                        </pre>
                      </div>
                    </div>
                    {/* Bash Anatomy Visualization */}
                    {formData.anatomy &&
                      formData.anatomy.length > 0 &&
                      formData.anatomy.some((sec) => sec.items.length > 0) && (
                        <div className="mt-6">
                          <BashAnatomyBuilder
                            anatomy={formData.anatomy}
                            readonly={true}
                          />
                        </div>
                      )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">
                <Terminal size={40} className="mx-auto mb-3 opacity-20" />
                <p className="text-sm">Start typing to see the preview</p>
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
