"use client";

import React, { useState } from "react";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  isDeleting?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmModal({
  isOpen,
  title,
  description = "This action cannot be undone.",
  confirmLabel = "Delete",
  isDeleting = false,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
      style={{ animation: "fadeIn 0.15s ease-out" }}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-sm p-6 z-10"
        style={{ animation: "scaleIn 0.15s ease-out" }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
      >
        {/* Icon */}
        <div className="w-12 h-12 rounded-full bg-red-100 border border-red-200 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={22} className="text-red-500" />
        </div>

        {/* Content */}
        <h2
          id="delete-modal-title"
          className="text-base font-bold text-gray-900 text-center mb-2"
        >
          {title}
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">{description}</p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 py-2.5 px-4 rounded-xl border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-2.5 px-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm flex items-center justify-center gap-2 transition disabled:opacity-50 shadow-lg shadow-red-500/20"
          >
            {isDeleting ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Trash2 size={15} />
            )}
            {isDeleting ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useDeleteConfirm() {
  const [state, setState] = useState<{
    isOpen: boolean;
    title: string;
    description?: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    onConfirm: () => {},
  });

  const confirm = (opts: {
    title: string;
    description?: string;
    onConfirm: () => void;
  }) => {
    setState({ isOpen: true, ...opts });
  };

  const cancel = () => {
    setState((prev) => ({ ...prev, isOpen: false }));
  };

  return { state, confirm, cancel };
}
