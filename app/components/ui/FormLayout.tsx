import React from 'react';
import Link from 'next/link';
import { LucideIcon, Save, ArrowLeft } from 'lucide-react';

interface FormLayoutProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor?: string;
  backHref: string;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  children: React.ReactNode;
}

export default function FormLayout({
  title,
  description,
  icon: Icon,
  iconColor = "text-indigo-600",
  backHref,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Save",
  children
}: FormLayoutProps) {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href={backHref} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft size={24} className="text-slate-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            <Icon size={32} className={iconColor} />
            {title}
          </h1>
          <p className="text-slate-500 mt-2">{description}</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8 space-y-8">
          {children}
        </div>
        
        <div className="bg-slate-50 border-t border-slate-200 p-6 flex justify-end gap-4">
          <Link
            href={backHref}
            className="px-6 py-2.5 text-slate-600 hover:bg-slate-200 font-medium rounded-xl transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium rounded-xl transition-colors flex items-center gap-2 shadow-sm"
          >
            {isSubmitting ? (
              <>Saving...</>
            ) : (
              <>
                <Save size={18} />
                {submitLabel}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
