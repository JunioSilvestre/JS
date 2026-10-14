import React from 'react';
import { Search } from 'lucide-react';

interface SearchFilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  searchPlaceholder?: string;
  categories?: string[];
  selectedCategory?: string;
  onCategoryChange?: (val: string) => void;
  extraFilters?: React.ReactNode;
}

export default function SearchFilterBar({
  search,
  onSearchChange,
  searchPlaceholder = "Buscar...",
  categories,
  selectedCategory,
  onCategoryChange,
  extraFilters
}: SearchFilterBarProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8 flex flex-col md:flex-row gap-4 items-center">
      <div className="flex-1 w-full relative">
        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input 
          type="text"
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
        />
      </div>
      
      {categories && onCategoryChange && (
        <div className="w-full md:w-64">
          <select 
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none cursor-pointer text-slate-700"
          >
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      )}

      {extraFilters && (
        <div className="w-full md:w-auto flex gap-4">
          {extraFilters}
        </div>
      )}
    </div>
  );
}
