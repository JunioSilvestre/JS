"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutGrid, FilePlus2, Layers, Settings, Terminal, PlusCircle, Server, Folder, ChevronRight, ChevronLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(true);

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
    <aside 
      className={`flex-shrink-0 bg-white border-r border-gray-200 hidden md:flex flex-col transition-all duration-300 relative ${isCollapsed ? "w-20" : "w-64"}`}
    >
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 bg-white border border-gray-200 rounded-full p-1 text-gray-500 hover:text-indigo-600 hover:border-indigo-300 shadow-sm transition z-50"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div 
        className={`p-6 flex items-center border-b border-gray-200 cursor-pointer ${isCollapsed ? "justify-center px-0 gap-0" : "gap-3"}`}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/25">
          C
        </div>
        <span className={`font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 text-lg whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100"}`}>
          Cert-Hub
        </span>
      </div>

      <nav className="flex-1 py-4 space-y-1 overflow-y-auto overflow-x-hidden flex flex-col items-center">
        {!isCollapsed ? (
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-6 mb-2 mt-4 w-full text-left transition-opacity duration-300">Main</div>
        ) : (
          <div className="w-full border-b border-gray-100 my-2"></div>
        )}
        
        <Link
          href="/"
          className={`flex items-center py-2.5 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-slate-800/50 transition font-medium text-sm ${isCollapsed ? "justify-center w-12 px-0 gap-0" : "w-[calc(100%-1.5rem)] px-3 mx-3 gap-3"}`}
          title="All Modules"
        >
          <LayoutGrid size={18} className="flex-shrink-0" /> 
          <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${isCollapsed ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100"}`}>All Modules</span>
        </Link>
        <Link
          href="/linux"
          className={`flex items-center py-2.5 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-slate-800/50 transition font-medium text-sm ${isCollapsed ? "justify-center w-12 px-0 gap-0" : "w-[calc(100%-1.5rem)] px-3 mx-3 gap-3"}`}
          title="Linux"
        >
          <Server size={18} className="flex-shrink-0" /> 
          <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${isCollapsed ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100"}`}>Linux</span>
        </Link>
        <Link
          href="/bash"
          className={`flex items-center py-2.5 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-slate-800/50 transition font-medium text-sm ${isCollapsed ? "justify-center w-12 px-0 gap-0" : "w-[calc(100%-1.5rem)] px-3 mx-3 gap-3"}`}
          title="Bash"
        >
          <Terminal size={18} className="flex-shrink-0" /> 
          <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${isCollapsed ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100"}`}>Bash</span>
        </Link>
        <Link
          href="/questions/create"
          className={`flex items-center py-2.5 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-slate-800/50 transition font-medium text-sm ${isCollapsed ? "justify-center w-12 px-0 gap-0" : "w-[calc(100%-1.5rem)] px-3 mx-3 gap-3"}`}
          title="Questions"
        >
          <FilePlus2 size={18} className="flex-shrink-0" /> 
          <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${isCollapsed ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100"}`}>Questions</span>
        </Link>
        <Link
          href="/projetos"
          className={`flex items-center py-2.5 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-slate-800/50 transition font-medium text-sm ${isCollapsed ? "justify-center w-12 px-0 gap-0" : "w-[calc(100%-1.5rem)] px-3 mx-3 gap-3"}`}
          title="Projetos"
        >
          <Folder size={18} className="flex-shrink-0" /> 
          <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${isCollapsed ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100"}`}>Projetos</span>
        </Link>

        {!isCollapsed ? (
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-6 mb-2 mt-6 w-full text-left transition-opacity duration-300">Other</div>
        ) : (
          <div className="w-full border-b border-gray-100 my-4"></div>
        )}
        
        <Link
          href="/modules/create"
          className={`flex items-center py-2.5 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-slate-800/50 transition font-medium text-sm ${isCollapsed ? "justify-center w-12 px-0 gap-0" : "w-[calc(100%-1.5rem)] px-3 mx-3 gap-3"}`}
          title="Create Module"
        >
          <PlusCircle size={18} className="flex-shrink-0" /> 
          <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${isCollapsed ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100"}`}>Create Module</span>
        </Link>
        <Link
          href="/infra"
          className={`flex items-center py-2.5 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-slate-800/50 transition font-medium text-sm ${isCollapsed ? "justify-center w-12 px-0 gap-0" : "w-[calc(100%-1.5rem)] px-3 mx-3 gap-3"}`}
          title="Hybrid Infra"
        >
          <Layers size={18} className="flex-shrink-0" /> 
          <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${isCollapsed ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100"}`}>Hybrid Infra</span>
        </Link>
        <a
          href="#"
          onClick={openInfraModal}
          className={`flex items-center py-2.5 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-slate-800/50 transition font-medium text-sm cursor-pointer ${isCollapsed ? "justify-center w-12 px-0 gap-0" : "w-[calc(100%-1.5rem)] px-3 mx-3 gap-3"}`}
          title="Create Infra"
        >
          <PlusCircle size={18} className="flex-shrink-0" /> 
          <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${isCollapsed ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100"}`}>Create Infra</span>
        </a>
        <button 
          className={`flex items-center py-2.5 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-slate-800/50 transition font-medium text-sm mt-2 ${isCollapsed ? "justify-center w-12 px-0 gap-0" : "w-[calc(100%-1.5rem)] px-3 mx-3 gap-3"}`}
          title="Settings"
        >
          <Settings size={18} className="flex-shrink-0" /> 
          <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${isCollapsed ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100"}`}>Settings</span>
        </button>
      </nav>
    </aside>
  );
}


