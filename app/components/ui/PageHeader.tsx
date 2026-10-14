import React from 'react';
import Link from 'next/link';
import { PlusCircle, LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor?: string;
  actionHref?: string;
  actionLabel?: string;
}

export default function PageHeader({
  title,
  description,
  icon: Icon,
  iconColor = "text-indigo-600",
  actionHref,
  actionLabel = "New Item"
}: PageHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center gap-3">
          <Icon size={32} className={iconColor} />
          {title}
        </h1>
        <p className="text-slate-500 mt-2">{description}</p>
      </div>
      {actionHref && (
        <Link 
          href={actionHref} 
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all font-medium whitespace-nowrap"
        >
          <PlusCircle size={20} />
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
