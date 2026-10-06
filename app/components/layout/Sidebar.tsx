"use client";

import Link from "next/link";
import { LayoutGrid, FilePlus2, Layers, Settings, Terminal, PlusCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const openInfraModal = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname !== "/infra") {
      router.push("/infra?register=true");
    } else {
      const modal = document.getElementById("registerModal");
      if (modal) {
        modal.classList.remove("hidden");
        modal.classList.add("flex");
      }
    }
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-200 hidden md:flex flex-col">
      <div className="p-6 flex items-center gap-3 border-b border-gray-200">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/25">
          C
        </div>
        <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 text-lg">
          Cert-Hub
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-3 mb-2 mt-4">Modules</div>
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-slate-800/50 transition font-medium text-sm"
        >
          <LayoutGrid size={18} /> All Modules
        </Link>
        <Link
          href="/modules/create"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-slate-800/50 transition font-medium text-sm"
        >
          <PlusCircle size={18} /> Create Module
        </Link>

        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-3 mb-2 mt-6">Infra</div>
        <Link
          href="/infra"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-slate-800/50 transition font-medium text-sm"
        >
          <Layers size={18} /> Hybrid Infra
        </Link>
        <a
          href="#"
          onClick={openInfraModal}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-slate-800/50 transition font-medium text-sm cursor-pointer"
        >
          <PlusCircle size={18} /> Create Infra
        </a>

        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-3 mb-2 mt-6">Other</div>
        <Link
          href="/questions/create"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-slate-800/50 transition font-medium text-sm"
        >
          <FilePlus2 size={18} /> Questions
        </Link>
        <Link
          href="/bash"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-slate-800/50 transition font-medium text-sm"
        >
          <Terminal size={18} /> Bash
        </Link>
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-slate-800/50 transition font-medium w-full text-left text-sm mt-2">
          <Settings size={18} /> Settings
        </button>
      </nav>
    </aside>
  );
}
