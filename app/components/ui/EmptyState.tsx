import React from 'react';
import Link from 'next/link';
import { LucideIcon, PlusCircle } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}

export default function EmptyState({ icon: Icon, title, description, actionHref, actionLabel = "Create New" }: EmptyStateProps) {
  return (
    <div className="text-center py-24 bg-white border border-gray-200 rounded-2xl shadow-sm">
      <div className="w-20 h-20 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-4xl mx-auto mb-6 text-indigo-500">
        <Icon size={36} />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">{description}</p>
      {actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-semibold transition text-sm"
        >
          <PlusCircle size={18} /> {actionLabel}
        </Link>
      )}
    </div>
  );
}
