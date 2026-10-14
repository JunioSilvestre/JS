"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save, ArrowLeft, Terminal } from "lucide-react";
import { useToast } from "@/app/components/ui/ToastProvider";

export default function TerminalCreatePage() {
  const router = useRouter();
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({
    type: "",
    title: "",
    category: "",
    description: "",
    examples: "",
    options: "",
    script_content: ""
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);

    try {
      const res = await fetch("/api/terminal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save item");

      showToast("Saved successfully!", "success");
      // Limpar o formulário para permitir novo cadastro em vez de voltar à lista
      setFormData({
        type: "",
        title: "",
        category: "",
        description: "",
        examples: "",
        options: "",
        script_content: ""
      });
      setSaving(false);
    } catch (error: unknown) {
      showToast((error as Error).message || "Failed to save", "error");
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/terminal"
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <ArrowLeft size={18} />
            </Link>
            <div className="flex items-center gap-2">
              <Terminal size={20} className="text-emerald-600" />
              <h1 className="text-lg font-bold text-gray-900">New Record (Terminal)</h1>
            </div>
          </div>
          <button
            type="submit"
            form="create-terminal-form"
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto mt-8 px-6">
        <form id="create-terminal-form" onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-slate-200">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Record Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
              required
            >
              <option value="" disabled>Select...</option>
              <option value="comando">Linux Command</option>
              <option value="bash">Bash Script</option>
              <option value="vi">VI Editor</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Title / Command</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
              placeholder={formData.type === 'comando' ? 'e.g., ls, grep, chmod' : 'Script/Command Title'}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
              placeholder="e.g., File System, Networking, Loop..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Description / Problem</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
              placeholder="What is this command or script for?"
              required
            />
          </div>

          {formData.type === 'bash' && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Script Content</label>
              <textarea
                name="script_content"
                value={formData.script_content}
                onChange={handleChange}
                rows={6}
                className="w-full p-3 rounded-lg border border-slate-200 bg-slate-900 text-emerald-400 font-mono focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                placeholder="#!/bin/bash..."
              />
            </div>
          )}

          {(formData.type === 'comando' || formData.type === 'vi') && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Practical Examples</label>
              <textarea
                name="examples"
                value={formData.examples}
                onChange={handleChange}
                rows={4}
                className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                placeholder="Markdown examples..."
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              {formData.type === 'bash' ? 'Anatomy / Explanation' : 'Options / Flags'}
            </label>
            <textarea
              name="options"
              value={formData.options}
              onChange={handleChange}
              rows={4}
              className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
              placeholder="Additional details in Markdown..."
            />
          </div>
        </form>
      </div>
    </div>
  );
}
