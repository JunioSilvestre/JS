import React from 'react';
import Link from 'next/link';
import { Trash2, Loader2, ChevronRight, Edit3, LucideIcon, BookOpen } from 'lucide-react';

export interface ResourceCardProps {
  id: string | number;
  title: string;
  description: string;
  category: string;
  type: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  cardBg?: string;
  borderColor?: string;
  viewHref: string;
  editHref?: string;
  manageHref?: string;
  badges?: { label: string; className: string }[];
  updatedAt?: string;
  isDeleting?: boolean;
  onDeleteRequest: () => void;
  footerExtra?: React.ReactNode;
}

export default function ResourceCard({
  id,
  title,
  description,
  category,
  type,
  icon: Icon,
  iconColor = "text-indigo-600",
  iconBg = "bg-indigo-50",
  cardBg = "bg-white",
  borderColor = "#6366f1",
  viewHref,
  editHref,
  manageHref,
  badges = [],
  updatedAt,
  isDeleting = false,
  onDeleteRequest,
  footerExtra
}: ResourceCardProps) {
  return (
    <div
      className={`group ${cardBg} border border-gray-300 rounded-2xl p-6 transition-all shadow-sm hover:shadow-xl relative overflow-hidden flex flex-col h-full`}
      style={{ borderTop: `4px solid ${borderColor}` }}
    >
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
        {manageHref && (
          <Link
            href={manageHref}
            className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-slate-700 transition"
            title="Manage"
          >
            <BookOpen size={14} />
          </Link>
        )}
        {editHref && (
          <Link
            href={editHref}
            className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition"
            title="Edit"
          >
            <Edit3 size={14} />
          </Link>
        )}
        <button
          onClick={onDeleteRequest}
          disabled={isDeleting}
          className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition disabled:opacity-50"
          title="Delete"
        >
          {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span className={`text-xs font-bold px-2 py-0.5 rounded-md border text-slate-600 bg-slate-100 border-slate-200 capitalize`}>
          {category}
        </span>
        {badges.map((badge, index) => (
          <span key={index} className={`text-xs font-bold px-2 py-0.5 rounded-md border capitalize ${badge.className}`}>
            {badge.label}
          </span>
        ))}
      </div>

      <h3 className="text-base font-bold text-gray-900 mb-1.5 line-clamp-1 capitalize">{title}</h3>
      <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-1 first-letter:capitalize">{description || "No description provided."}</p>

      <div className="flex items-center justify-between border-t border-gray-300 pt-4 mt-auto">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span className={`flex items-center gap-1.5 font-medium ${iconColor}`}>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${iconBg}`}>
              <Icon size={14} />
            </div>
            <span className="capitalize">{type}</span>
          </span>
          {footerExtra && (
            <>
              <span className="text-slate-300">•</span>
              {footerExtra}
            </>
          )}
        </div>
        <Link href={viewHref} className={`flex items-center gap-1 text-xs font-medium ${iconColor} hover:opacity-80 transition`}>
          Open <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
}
