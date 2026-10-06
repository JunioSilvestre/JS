"use client";

import React, { useState, useEffect, useRef } from "react";
import { AlertCircle, Check } from "lucide-react";

interface SpellError {
  message: string;
  shortMessage: string;
  offset: number;
  length: number;
  replacements: { value: string }[];
  rule: { id: string; description: string };
}

interface SpellCheckedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  asInput?: boolean;
  type?: string;
}

export default function SpellCheckedTextarea({
  value,
  onChange,
  asInput,
  className = "",
  ...props
}: SpellCheckedTextareaProps): React.JSX.Element {
  const [errors, setErrors] = useState<SpellError[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!value) {
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const timer = setTimeout(async () => {
      try {
        const res = await fetch("/api/spell", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: value }),
          signal: abortControllerRef.current?.signal,
        });

        if (res.ok) {
          const data = await res.json();
          if (data.matches) {
            setErrors(data.matches);
          }
        }
      } catch (err: unknown) {
        const error = err as Error;
        if (error.name !== "AbortError") {
          console.error("Spellcheck failed", error);
        }
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [value]);

  const applyFix = (error: SpellError, replacement: string) => {
    const newValue =
      value.substring(0, error.offset) +
      replacement +
      value.substring(error.offset + error.length);
    
    const fakeEvent = {
      target: { value: newValue }
    } as React.ChangeEvent<HTMLTextAreaElement>;
    onChange(fakeEvent);
  };

  return (
    <div className="relative w-full">
      {asInput ? (
        <input
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          value={value}
          onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
          className={className}
          spellCheck={true}
          lang="en"
        />
      ) : (
        <textarea
          {...props}
          value={value}
          onChange={onChange}
          className={className}
          spellCheck={true}
          lang="en"
        />
      )}
      
      {errors.length > 0 && (
        <div className="mt-2 space-y-2">
          {errors.map((err, idx) => (
            <div key={idx} className="bg-orange-50 border border-orange-200 p-2 rounded text-xs text-orange-800 flex flex-col gap-1 shadow-sm">
              <div className="flex items-start gap-1.5 font-medium">
                <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                <span>{err.message} <span className="text-orange-600/70 font-mono bg-orange-100 px-1 rounded block mt-1 w-fit">&quot;{value.substring(err.offset, err.offset + err.length)}&quot;</span></span>
              </div>
              {err.replacements.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pl-5 pt-1">
                  {err.replacements.slice(0, 3).map((rep, rIdx) => (
                    <button
                      key={rIdx}
                      type="button"
                      onClick={() => applyFix(err, rep.value)}
                      className="bg-white border border-orange-300 hover:bg-orange-100 text-orange-700 px-2 py-0.5 rounded flex items-center gap-1 transition"
                    >
                      {rep.value} <Check size={12} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
