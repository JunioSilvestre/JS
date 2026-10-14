"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Server, Plus, Clock, Target, CheckSquare, Layers, ShieldCheck } from "lucide-react";
import { useToast } from "@/app/components/ui/ToastProvider";

export default function CreateInfraProjectPage() {
  const router = useRouter();
  const { showToast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{id: string, label: string}[]>([]);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    level: "",
    priority: "",
    time: "",
    status: "todo",
    objective: "",
    scenario: "",
    ext: "",
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
        const cats = data.data || [];
        setCategories(cats);
        if (cats.length > 0 && !formData.category_id) {
          setFormData(prev => ({ ...prev, category_id: cats[0].id }));
        }
      }
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
    fetchCategories();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        checklist: formData.checklist.split('\n').map(s => s.trim()).filter(Boolean),
      };

      const res = await fetch("/api/infra-projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        showToast("Infrastructure Project created successfully!", "success");
        router.push("/projetos");
      } else {
        showToast("Error creating project", "error");
      }
    } catch (error: any) {
      showToast(error.message || "Network error", "error");
    } finally {
      setLoading(false);
    }
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
              <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Create Architecture Project</h1>
            </div>
          </div>
          <button
            type="submit"
            form="create-infra-form"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-blue-200 transition-all transform hover:scale-105 disabled:opacity-70 disabled:scale-100"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save size={18} />}
            Save & Finalize
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-8 px-6">
        <form id="create-infra-form" onSubmit={handleSubmit} className="space-y-8">
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-2">
              <Target className="text-blue-600" /> Project Overview
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Architecture / Solution Name</label>
                <input 
                  required
                  type="text"
                  className="w-full border-gray-300 rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 bg-slate-50 border transition-all"
                  placeholder="e.g., AWS Enterprise Landing Zone with Terraform"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex justify-between">
                  <span>Infrastructure Category</span>
                  {!isCreatingCategory ? (
                    <button type="button" onClick={() => setIsCreatingCategory(true)} className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1">
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
                      className="flex-1 border-gray-300 rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 bg-slate-50 border"
                      value={newCategoryName}
                      onChange={e => setNewCategoryName(e.target.value)}
                    />
                    <button type="button" onClick={handleCreateCategory} className="px-4 bg-blue-100 text-blue-700 font-bold rounded-xl hover:bg-blue-200">Save</button>
                  </div>
                ) : (
                  <select 
                    required
                    className="w-full border-gray-300 rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 bg-slate-50 border transition-all"
                    value={formData.category_id}
                    onChange={e => setFormData({...formData, category_id: e.target.value})}
                  >
                    <option value="" disabled>Select...</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><Clock size={16} className="text-gray-400"/> Estimated Duration</label>
                <select 
                  className="w-full border-gray-300 rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 bg-slate-50 border transition-all"
                  value={formData.time}
                  onChange={e => setFormData({...formData, time: e.target.value})}
                >
                  <option value="" disabled>Select...</option>
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
                  className="w-full border-gray-300 rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 bg-slate-50 border transition-all"
                  value={formData.level}
                  onChange={e => setFormData({...formData, level: e.target.value})}
                >
                  <option value="" disabled>Select...</option>
                  <option value="Junior">Junior (Basic Setup)</option>
                  <option value="Mid-level">Mid-level (Guided Implementation)</option>
                  <option value="Senior">Senior (Design & Architecture)</option>
                  <option value="Expert">Expert (Multi-cloud / Enterprise)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Priority</label>
                <select 
                  className="w-full border-gray-300 rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 bg-slate-50 border transition-all"
                  value={formData.priority}
                  onChange={e => setFormData({...formData, priority: e.target.value})}
                >
                  <option value="" disabled>Select...</option>
                  <option value="low">Low (Study/Backlog)</option>
                  <option value="medium">Medium (Continuous Improvement)</option>
                  <option value="high">High (Critical / Production)</option>
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
                  placeholder="Why is this project important? What problem does it solve?"
                  value={formData.objective}
                  onChange={e => setFormData({...formData, objective: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Proposed Architecture & Scenario (Markdown supported)</label>
                <textarea 
                  rows={5}
                  className="w-full border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 bg-slate-50 border transition-all font-mono text-sm"
                  placeholder="Describe topology, components, and data flow..."
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
                    placeholder="e.g., Landing Zone setup, VPN Network..."
                    value={formData.prereqs}
                    onChange={e => setFormData({...formData, prereqs: e.target.value})}
                  />
                  <p className="text-xs text-gray-400 mt-1">Comma-separated</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Tech Stack / Requirements</label>
                  <input 
                    type="text"
                    className="w-full border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 bg-slate-50 border"
                    placeholder="e.g., AWS EKS, Terraform, ArgoCD"
                    value={formData.reqs}
                    onChange={e => setFormData({...formData, reqs: e.target.value})}
                  />
                  <p className="text-xs text-gray-400 mt-1">Comma-separated</p>
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
                  placeholder="1. Create IaC repo&#10;2. Setup Terraform backend&#10;3. Deploy to Sandbox"
                  value={formData.checklist}
                  onChange={e => setFormData({...formData, checklist: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Related Certifications</label>
                <input 
                  type="text"
                  className="w-full border-gray-300 rounded-xl shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-3 bg-slate-50 border"
                  placeholder="e.g., AWS Solutions Architect, CKA..."
                  value={formData.certs}
                  onChange={e => setFormData({...formData, certs: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Key Concepts</label>
                <input 
                  type="text"
                  className="w-full border-gray-300 rounded-xl shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-3 bg-slate-50 border"
                  placeholder="e.g., High Availability, DR, Zero Trust"
                  value={formData.concepts}
                  onChange={e => setFormData({...formData, concepts: e.target.value})}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><ShieldCheck size={16}/> Architecture Defense (Potential Interview Questions)</label>
                <textarea 
                  rows={3}
                  className="w-full border-gray-300 rounded-xl shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-3 bg-slate-50 border transition-all"
                  placeholder="e.g., Why Terraform instead of CloudFormation? How to secure state files?"
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
