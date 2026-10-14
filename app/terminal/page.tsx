"use client";

import React, { useState, useEffect } from 'react';
import PageHeader from '../components/ui/PageHeader';
import SearchFilterBar from '../components/ui/SearchFilterBar';
import ResourceCard from '../components/ui/ResourceCard';
import EmptyState from '../components/ui/EmptyState';
import { Terminal, Search, FileCode2, Edit3 } from 'lucide-react';
import { useToast } from '../components/ui/ToastProvider';

export default function TerminalPage() {
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/terminal');
        if (res.ok) {
          const data = await res.json();
          setItems(Array.isArray(data) ? data : (data.data || []));
        } else {
          showToast(`Error loading commands`, 'error');
        }
      } catch (err) {
        showToast('Network error', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [showToast]);

  const filteredItems = items.filter(item => 
    item.title?.toLowerCase().includes(search.toLowerCase()) || 
    item.description?.toLowerCase().includes(search.toLowerCase()) ||
    item.category?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string | number) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;
    try {
      const res = await fetch(`/api/terminal/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setItems(prev => prev.filter(i => i.id !== id));
        showToast('Deleted successfully', 'success');
      }
    } catch (e) {
      showToast('Error deleting item', 'error');
    }
  };

  const getBadgeForType = (type: string) => {
    if (type === 'bash') return { label: 'Bash Script', className: 'bg-indigo-100 text-indigo-700 border-indigo-200' };
    if (type === 'vi') return { label: 'VI Editor', className: 'bg-amber-100 text-amber-700 border-amber-200' };
    return { label: 'Linux Command', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
  };

  const getTypeProps = (type: string) => {
    if (type === 'bash') {
      return {
        icon: FileCode2,
        iconColor: 'text-indigo-600',
        iconBg: 'bg-indigo-100',
        cardBg: 'bg-indigo-50',
        borderColor: '#6366f1',
        label: 'Bash Script'
      };
    }
    if (type === 'vi') {
      return {
        icon: Edit3,
        iconColor: 'text-amber-600',
        iconBg: 'bg-amber-100',
        cardBg: 'bg-amber-50',
        borderColor: '#f59e0b',
        label: 'VI Editor'
      };
    }
    return {
      icon: Terminal,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-100',
      cardBg: 'bg-emerald-50',
      borderColor: '#10b981',
      label: 'Linux Command'
    };
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <PageHeader
        title="Terminal & Shell"
        description="Unified knowledge base for Linux Commands, Bash Scripts, and VI Editor."
        icon={Terminal}
        iconColor="text-emerald-600"
        actionHref="/terminal/create"
        actionLabel="Add New"
      />

      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search commands and scripts..."
      />

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
          {filteredItems.map(item => {
            const typeProps = getTypeProps(item.type);
            return (
              <ResourceCard
                key={item.id}
                id={item.id}
                title={item.title || 'Untitled'}
                description={item.description}
                category={item.category || 'General'}
                type={typeProps.label}
                badges={[getBadgeForType(item.type)]}
                icon={typeProps.icon}
                iconColor={typeProps.iconColor}
                iconBg={typeProps.iconBg}
                cardBg={typeProps.cardBg}
                borderColor={typeProps.borderColor}
                viewHref={`/terminal/${item.id}`}
                editHref={`/terminal/${item.id}/edit`}
                onDeleteRequest={() => handleDelete(item.id)}
              />
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Search}
          title="No items found"
          description="We couldn't find any items matching your search."
          actionHref="/terminal/create"
        />
      )}
    </div>
  );
}
