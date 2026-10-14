"use client";

import React, { useState, useEffect, useMemo } from 'react';
import PageHeader from '../components/ui/PageHeader';
import SearchFilterBar from '../components/ui/SearchFilterBar';
import ResourceCard from '../components/ui/ResourceCard';
import EmptyState from '../components/ui/EmptyState';
import { Database, Search } from 'lucide-react';
import { useToast } from '../components/ui/ToastProvider';

export default function ModulesPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/modules');
        if (res.ok) {
          const data = await res.json();
          setItems(data.data || []);
        } else {
          showToast('Error loading modules', 'error');
        }
      } catch (err) {
        showToast('Network error', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [showToast]);

  const categories = useMemo(() => {
    const cats = new Set(items.map(m => m.category || 'Uncategorized'));
    return ['All', ...Array.from(cats)];
  }, [items]);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name?.toLowerCase().includes(search.toLowerCase()) || item.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCat = category === 'All' || item.category === category;
    return matchesSearch && matchesCat;
  });

  const handleDelete = async (id: string | number) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;
    try {
      const res = await fetch(`/api/modules/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setItems(prev => prev.filter(i => i.id !== id));
        showToast('Deleted successfully', 'success');
      }
    } catch (e) {
      showToast('Error deleting', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <PageHeader
        title="Certification Modules"
        description="Manage your modules and exam questions."
        icon={Database}
        iconColor="text-purple-600"
        actionHref={`/modules/create`}
        actionLabel="New Module"
      />

      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search modules..."
        categories={categories}
        selectedCategory={category}
        onCategoryChange={setCategory}
      />

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div></div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <ResourceCard
              key={item.id}
              id={item.id}
              title={item.name}
              description={item.description}
              category={item.category || 'Uncategorized'}
              type="Module"
              icon={Database}
              iconColor="text-purple-600"
              iconBg="bg-purple-50"
              borderColor="#a855f7"
              viewHref={`/modules/${item.id}`}
              manageHref={`/modules/${item.id}/questions`}
              onDeleteRequest={() => handleDelete(item.id)}
              badges={[{ label: `${item.questionCount || 0} Qs`, className: 'text-purple-600 border-purple-200 bg-purple-50' }]}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Search}
          title="No modules found"
          description="We couldn't find any modules matching your search."
          actionHref="/modules/create"
        />
      )}
    </div>
  );
}
