"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Server, Target, Layers, CheckSquare, Plus, ShieldCheck } from "lucide-react";
import { useToast } from "@/app/components/ui/ToastProvider";

export default function EditInfraProjectPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [categories, setCategories] = useState<{id: string, label: string}[]>([]);
  
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    level: "Mid-level",
    priority: "medium",
    time: "1 week",
    status: "todo",
    objective: "",
    scenario: "",
    reqs: "",
    prereqs: "",
    concepts: "",
    certs: "",
    interview: "",
    certTip: "",
    checklist: "",
  });

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/infra-categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data.data || []);
      }
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  useEffect(() => {
    const fetchProjectAndCategories = async () => {
      await fetchCategories();
      try {
        const id = Array.isArray(params.id) ? params.id[0] : params.id;
        const res = await fetch(`/api/infra-projects/${id}`);
        if (res.ok) {
          const data = await res.json();
          const p = data.data;

          const parseArr = (str: string) => {
            if (!str) return "";
            try { return JSON.parse(str).join(", "); } catch { return ""; }
          };
          const parseList = (str: string) => {
            if (!str) return "";
            try { return JSON.parse(str).join("\\n"); } catch { return ""; }
          };

          setFormData({
            name: p.name || "",
            category_id: p.category_id || "",
            level: p.level || "Mid-level",
            priority: p.priority || "medium",
            time: p.time || "1 week",
            status: p.status || "todo",
            objective: p.objective || "",
            scenario: p.scenario || "",
            reqs: parseArr(p.reqs),
            prereqs: parseArr(p.prereqs),
            concepts: parseArr(p.concepts),
            certs: parseArr(p.certs),
            checklist: parseList(p.checklist),
            interview: p.interview || "",
            certTip: p.certTip || ""
          });
        } else {
          showToast("Project not found", "error");
          router.push("/projetos");
        }
      } catch (err) {
        showToast("Error loading project", "error");
      } finally {
        setInitialLoading(false);
      }
    };
    if (params.id) {
      fetchProjectAndCategories();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id, router]);

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const res = await fetch("/api/infra-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: newCategoryName.toLowerCase().replace(/\s+/g, '-'),
          label: newCategoryName,
          type: "projects"
        })
      });
      if (res.ok) {
        const data = await res.json();
        const created = data.data;
        await fetchCategories();
        setFormData(prev => ({ ...prev, category_id: created.id }));
        setNewCategoryName("");
        setIsCreatingCategory(false);
        showToast("Category created successfully!", "success");
      }
    } catch (err) {
      showToast("Error creating category", "error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    
    try {
      const payload = {
        ...formData,
        reqs: formData.reqs.split(',').map(s => s.trim()).filter(Boolean),
        prereqs: formData.prereqs.split(',').map(s => s.trim()).filter(Boolean),
        concepts: formData.concepts.split(',').map(s => s.trim()).filter(Boolean),
        certs: formData.certs.split(',').map(s => s.trim()).filter(Boolean),
        checklist: formData.checklist.split('\\n').map(s => s.trim()).filter(Boolean),
      };

      const id = Array.isArray(params.id) ? params.id[0] : params.id;
      const res = await fetch(`/api/infra-projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        showToast("Project updated successfully!", "success");
        router.push(`/infra/${id}`);
      } else {
        showToast("Error updating project", "error");
      }
    } catch (error: any) {
      showToast(error.message || "Network error", "error");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={`/infra/${params.id}`}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <ArrowLeft size={18} />
            </Link>
            <div className="flex items-center gap-2">
              <div className="bg-amber-100 p-1.5 rounded-md">
                <Server size={20} className="text-amber-700" />
              </div>
              <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Edit Architecture Project</h1>
            </div>
          </div>
          <button
            type="submit"
            form="edit-infra-form"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl font-bold shadow-lg shadow-amber-200 transition-all transform hover:scale-105 disabled:opacity-70 disabled:scale-100"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save size={18} />}
            Save Changes
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-8 px-6">
        <form id="edit-infra-form" onSubmit={handleSubmit} className="space-y-8">
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-2">
              <Target className="text-amber-600" /> Project Overview
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Architecture / Solution Name</label>
                <input 
                  required
                  type="text"
                  className="w-full border-gray-300 rounded-xl shadow-sm focus:border-amber-500 focus:ring-amber-500 p-3 bg-slate-50 border transition-all"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex justify-between">
                  <span>Infrastructure Category</span>
                  {!isCreatingCategory ? (
                    <button type="button" onClick={() => setIsCreatingCategory(true)} className="text-amber-600 hover:text-amber-800 text-xs flex items-center gap-1">
                      <Plus size={14}/> New Category
                    </button>
                  ) : (
                    <button type="button" onClick={() => setIsCreatingCategory(false)} className="text-gray-500 hover:text-gray-700 text-xs">Cancel</button>
                  )}
                </label>
                
                {isCreatingCategory ? (
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      placeholder="Category Name..."
                      className="flex-1 border-gray-300 rounded-xl shadow-sm focus:border-amber-500 focus:ring-amber-500 p-3 bg-slate-50 border"
                      value={newCategoryName}
                      onChange={e => setNewCategoryName(e.target.value)}
                    />
                    <button type="button" onClick={handleCreateCategory} className="px-4 bg-amber-100 text-amber-700 font-bold rounded-xl hover:bg-amber-200">Save</button>
                  </div>
                ) : (
                  <select 
                    required
                    className="w-full border-gray-300 rounded-xl shadow-sm focus:border-amber-500 focus:ring-amber-500 p-3 bg-slate-50 border transition-all"
                    value={formData.category_id}
                    onChange={e => setFormData({...formData, category_id: e.target.value})}
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Estimated Duration</label>
                <select 
                  className="w-full border-gray-300 rounded-xl shadow-sm focus:border-amber-500 focus:ring-amber-500 p-3 bg-slate-50 border transition-all"
                  value={formData.time}
                  onChange={e => setFormData({...formData, time: e.target.value})}
                >
                  <option value="Few Hours">Few Hours (POC)</option>
                  <option value="1-3 Days">1-3 Days (Senior Task)</option>
                  <option value="1 Week">1 Week (Sub-system)</option>
                  <option value="2-4 Weeks">2-4 Weeks (Full Project)</option>
                  <option value="Months">Months (Digital Transformation)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Complexity Level</label>
                <select 
                  className="w-full border-gray-300 rounded-xl shadow-sm focus:border-amber-500 focus:ring-amber-500 p-3 bg-slate-50 border transition-all"
                  value={formData.level}
                  onChange={e => setFormData({...formData, level: e.target.value})}
                >
                  <option value="Junior">Junior (Basic Setup)</option>
                  <option value="Mid-level">Mid-level (Guided Implementation)</option>
                  <option value="Senior">Senior (Design & Architecture)</option>
                  <option value="Expert">Expert (Multi-cloud / Enterprise)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Initial Status</label>
                <select 
                  className="w-full border-gray-300 rounded-xl shadow-sm focus:border-amber-500 focus:ring-amber-500 p-3 bg-slate-50 border transition-all"
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-2">
              <Layers className="text-indigo-600" /> Scenario Details
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Business Objective</label>
                <textarea 
                  rows={2}
                  className="w-full border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 bg-slate-50 border transition-all"
                  value={formData.objective}
                  onChange={e => setFormData({...formData, objective: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Proposed Architecture & Scenario (Markdown supported)</label>
                <textarea 
                  rows={5}
                  className="w-full border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 bg-slate-50 border transition-all font-mono text-sm"
                  value={formData.scenario}
                  onChange={e => setFormData({...formData, scenario: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Dependencies (Prior projects)</label>
                  <input 
                    type="text"
                    className="w-full border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 bg-slate-50 border"
                    value={formData.prereqs}
                    onChange={e => setFormData({...formData, prereqs: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Tech Stack / Requirements</label>
                  <input 
                    type="text"
                    className="w-full border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 bg-slate-50 border"
                    value={formData.reqs}
                    onChange={e => setFormData({...formData, reqs: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-2">
              <CheckSquare className="text-emerald-600" /> Execution & Certification
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Deliverables Checklist (One per line)</label>
                <textarea 
                  rows={4}
                  className="w-full border-gray-300 rounded-xl shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-3 bg-slate-50 border transition-all font-mono text-sm"
                  value={formData.checklist}
                  onChange={e => setFormData({...formData, checklist: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Related Certifications</label>
                <input 
                  type="text"
                  className="w-full border-gray-300 rounded-xl shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-3 bg-slate-50 border"
                  value={formData.certs}
                  onChange={e => setFormData({...formData, certs: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Key Concepts</label>
                <input 
                  type="text"
                  className="w-full border-gray-300 rounded-xl shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-3 bg-slate-50 border"
                  value={formData.concepts}
                  onChange={e => setFormData({...formData, concepts: e.target.value})}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><ShieldCheck size={16}/> Architecture Defense (Potential Interview Questions)</label>
                <textarea 
                  rows={3}
                  className="w-full border-gray-300 rounded-xl shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-3 bg-slate-50 border transition-all"
                  value={formData.interview}
                  onChange={e => setFormData({...formData, interview: e.target.value})}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
