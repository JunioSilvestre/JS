"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────
const ToastContext = createContext<ToastContextValue | null>(null);

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

// ─── Icon map ─────────────────────────────────────────────────────────────────
const ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />,
  error: <XCircle size={16} className="text-red-400 flex-shrink-0" />,
  warning: <AlertTriangle size={16} className="text-amber-400 flex-shrink-0" />,
  info: <Info size={16} className="text-blue-400 flex-shrink-0" />,
};

const STYLES: Record<ToastType, string> = {
  success: "bg-emerald-950/95 border-emerald-500/30 text-emerald-200",
  error: "bg-red-950/95 border-red-500/30 text-red-200",
  warning: "bg-amber-950/95 border-amber-500/30 text-amber-200",
  info: "bg-blue-950/95 border-blue-500/30 text-blue-200",
};

// ─── Provider ─────────────────────────────────────────────────────────────────
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast stack */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 pl-4 pr-3 py-3 rounded-xl shadow-2xl border text-sm font-medium backdrop-blur-md pointer-events-auto animate-in slide-in-from-right ${STYLES[toast.type]}`}
            style={{ animation: "slideInRight 0.25s ease-out" }}
          >
            {ICONS[toast.type]}
            <span className="flex-1 max-w-xs">{toast.message}</span>
            <button
              onClick={() => dismiss(toast.id)}
              className="ml-1 p-1 rounded-lg opacity-60 hover:opacity-100 transition-opacity"
              aria-label="Dismiss notification"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
