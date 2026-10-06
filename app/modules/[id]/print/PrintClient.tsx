"use client";

import { useState } from "react";
import { Printer, ChevronDown, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Flag {
  flag: string;
  description: string;
}
interface Example {
  code: string;
}

function parseJSON<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

interface Question {
  id: number;
  category: string;
  question_text: string;
  correct_answer: string;
  explanation: string;
  command_name: string;
  command_description: string;
  command_flags: string;
  command_examples: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
  provider: string;
  certification: string;
  difficulty: string;
  question_count: number;
}

interface Props {
  module: Module;
  questions: Question[];
  categories: { category: string }[];
  selectedCategory: string;
}

export default function PrintClient({
  module,
  questions,
  categories,
  selectedCategory,
}: Props) {
  const [filterCat, setFilterCat] = useState(selectedCategory);
  const [showAnswers, setShowAnswers] = useState(true);
  const [showExplanations, setShowExplanations] = useState(true);
  const [showCommands, setShowCommands] = useState(true);
  const [compactMode, setCompactMode] = useState(false);

  const filteredQ = filterCat
    ? questions.filter((q) => q.category === filterCat)
    : questions;

  // Group by category
  const grouped = filteredQ.reduce<Record<string, Question[]>>((acc, q) => {
    if (!acc[q.category]) acc[q.category] = [];
    acc[q.category].push(q);
    return acc;
  }, {});

  const difficultyColor: Record<string, string> = {
    Beginner: "#10b981",
    Intermediate: "#f59e0b",
    Advanced: "#ef4444",
  };

  return (
    <>
      {/* Print Controls — hidden when printing */}
      <div className="print:hidden sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Link
              href={`/modules/${module.id}/questions`}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition"
            >
              <ArrowLeft size={15} /> Back
            </Link>
            <span className="text-gray-300">|</span>
            <h1 className="font-bold text-gray-800 text-sm">{module.title}</h1>
            <span className="text-xs text-gray-400">
              ({filteredQ.length} questions)
            </span>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Category filter */}
            <div className="relative">
              <select
                value={filterCat}
                onChange={(e) => setFilterCat(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm pr-8 appearance-none bg-white text-gray-700 cursor-pointer focus:outline-none focus:border-blue-400"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.category} value={c.category}>
                    {c.category}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={12}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>

            {/* Toggles */}
            <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showAnswers}
                onChange={(e) => setShowAnswers(e.target.checked)}
                className="rounded accent-indigo-600"
              />
              Answers
            </label>
            <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showExplanations}
                onChange={(e) => setShowExplanations(e.target.checked)}
                className="rounded accent-indigo-600"
              />
              Explanations
            </label>
            <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showCommands}
                onChange={(e) => setShowCommands(e.target.checked)}
                className="rounded accent-indigo-600"
              />
              Commands
            </label>
            <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={compactMode}
                onChange={(e) => setCompactMode(e.target.checked)}
                className="rounded accent-indigo-600"
              />
              Compact
            </label>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition shadow-sm"
            >
              <Printer size={15} /> Print / Save PDF
            </button>
          </div>
        </div>
      </div>

      {/* A4 Print Body */}
      <div className="bg-gray-100 print:bg-white min-h-screen py-8 print:py-0">
        <div
          id="print-content"
          className="mx-auto bg-white shadow-xl print:mx-0 print:shadow-none"
          style={{
            width: "210mm",
            minHeight: "297mm",
            padding: "15mm 18mm",
            boxSizing: "border-box",
            fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
            fontSize: "10pt",
            lineHeight: "1.5",
            color: "#1a1a2e",
          }}
        >
          {/* Document Header */}
          <div
            style={{
              borderBottom: "2.5px solid #4f46e5",
              paddingBottom: "10pt",
              marginBottom: "14pt",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: "7pt",
                    color: "#6366f1",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    marginBottom: "3pt",
                  }}
                >
                  Cert-Hub Practice Module
                </div>
                <h1
                  style={{
                    fontSize: "18pt",
                    fontWeight: "800",
                    margin: 0,
                    color: "#0f0e1a",
                    lineHeight: "1.2",
                  }}
                >
                  {module.title}
                </h1>
                <div
                  style={{
                    display: "flex",
                    gap: "10pt",
                    marginTop: "5pt",
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  {module.certification && (
                    <span
                      style={{
                        fontSize: "8pt",
                        color: "#4f46e5",
                        fontWeight: "600",
                        background: "#ede9fe",
                        padding: "1.5pt 7pt",
                        borderRadius: "4pt",
                        border: "1px solid #c4b5fd",
                      }}
                    >
                      {module.certification}
                    </span>
                  )}
                  {module.provider && (
                    <span style={{ fontSize: "8pt", color: "#64748b" }}>
                      {module.provider}
                    </span>
                  )}
                  {module.difficulty && (
                    <span
                      style={{
                        fontSize: "8pt",
                        fontWeight: "700",
                        color: difficultyColor[module.difficulty] || "#64748b",
                      }}
                    >
                      {module.difficulty}
                    </span>
                  )}
                </div>
              </div>
              <div
                style={{
                  textAlign: "right",
                  fontSize: "7.5pt",
                  color: "#94a3b8",
                  flexShrink: 0,
                  marginLeft: "12pt",
                }}
              >
                <div
                  style={{
                    fontWeight: "800",
                    fontSize: "10pt",
                    color: "#0f0e1a",
                  }}
                >
                  {filteredQ.length} Questions
                </div>
                <div style={{ marginTop: "2pt" }}>
                  {filterCat || "All Categories"}
                </div>
                <div style={{ marginTop: "3pt" }}>
                  {new Date().toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>

            {module.description && (
              <p
                style={{
                  fontSize: "8.5pt",
                  color: "#475569",
                  marginTop: "7pt",
                  marginBottom: 0,
                  lineHeight: "1.4",
                }}
              >
                {module.description}
              </p>
            )}
          </div>

          {/* Questions grouped by category */}
          {Object.keys(grouped).length === 0 ? (
            <p
              style={{
                color: "#94a3b8",
                textAlign: "center",
                padding: "20pt 0",
              }}
            >
              No questions to display.
            </p>
          ) : (
            Object.entries(grouped).map(([category, qs]) => (
              <div
                key={category}
                style={{ marginBottom: compactMode ? "8pt" : "16pt" }}
              >
                {/* Category Header */}
                <div
                  style={{
                    background:
                      "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                    color: "white",
                    padding: "5pt 10pt",
                    borderRadius: "5pt",
                    marginBottom: "8pt",
                    pageBreakInside: "avoid",
                  }}
                >
                  <span
                    style={{
                      fontSize: "9pt",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      letterSpacing: "0.5pt",
                    }}
                  >
                    {category}
                  </span>
                  <span
                    style={{
                      fontSize: "7.5pt",
                      marginLeft: "8pt",
                      opacity: 0.75,
                    }}
                  >
                    {qs.length} question{qs.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {qs.map((q, idx) => {
                  const flags = parseJSON<Flag[]>(q.command_flags, []).filter(
                    (f) => f.flag,
                  );
                  const examples = parseJSON<Example[]>(
                    q.command_examples,
                    [],
                  ).filter((e) => e.code);
                  const hasCommand =
                    showCommands &&
                    (q.command_name || flags.length > 0 || examples.length > 0);
                  const hasExplanation = showExplanations && q.explanation;

                  return (
                    <div
                      key={q.id}
                      style={{
                        pageBreakInside: "avoid",
                        marginBottom: compactMode ? "5pt" : "10pt",
                        border: "1px solid #e2e8f0",
                        borderRadius: "6pt",
                        overflow: "hidden",
                      }}
                    >
                      {/* Question text */}
                      <div
                        style={{
                          background: "#f8fafc",
                          padding: compactMode ? "4pt 8pt" : "7pt 10pt",
                          borderBottom: "1px solid #e2e8f0",
                          display: "flex",
                          gap: "6pt",
                          alignItems: "flex-start",
                        }}
                      >
                        <span
                          style={{
                            background: "#4f46e5",
                            color: "white",
                            fontSize: "7pt",
                            fontWeight: "700",
                            padding: "1.5pt 5pt",
                            borderRadius: "3pt",
                            flexShrink: 0,
                          }}
                        >
                          Q{idx + 1}
                        </span>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "9.5pt",
                            fontWeight: "600",
                            color: "#0f172a",
                            lineHeight: "1.4",
                          }}
                        >
                          {q.question_text}
                        </p>
                      </div>

                      {/* Answer */}
                      {showAnswers && (
                        <div
                          style={{
                            padding: compactMode ? "3pt 10pt" : "5pt 10pt",
                            borderBottom:
                              hasExplanation || hasCommand
                                ? "1px solid #e2e8f0"
                                : "none",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "7pt",
                              color: "#4f46e5",
                              fontWeight: "700",
                              textTransform: "uppercase",
                              letterSpacing: "0.3pt",
                              marginBottom: "2pt",
                            }}
                          >
                            ✓ Correct Answer
                          </div>
                          <div
                            style={{
                              fontFamily: "'Courier New', monospace",
                              fontSize: "9pt",
                              color: "#312e81",
                              background: "#ede9fe",
                              padding: "3pt 8pt",
                              borderRadius: "4pt",
                              border: "1px solid #c4b5fd",
                              wordBreak: "break-all",
                            }}
                          >
                            {q.correct_answer}
                          </div>
                        </div>
                      )}

                      {/* Explanation */}
                      {hasExplanation && (
                        <div
                          style={{
                            padding: compactMode ? "3pt 10pt" : "5pt 10pt",
                            background: "#fafafa",
                            borderBottom: hasCommand
                              ? "1px solid #e2e8f0"
                              : "none",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "7pt",
                              color: "#64748b",
                              fontWeight: "700",
                              textTransform: "uppercase",
                              letterSpacing: "0.3pt",
                              marginBottom: "2pt",
                            }}
                          >
                            Explanation
                          </div>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "8.5pt",
                              color: "#475569",
                              lineHeight: "1.4",
                            }}
                          >
                            {q.explanation}
                          </p>
                        </div>
                      )}

                      {/* Command breakdown */}
                      {hasCommand && (
                        <div
                          style={{
                            padding: compactMode ? "4pt 10pt" : "6pt 10pt",
                            background: "#0f172a",
                            borderTop: "2px solid #4f46e5",
                          }}
                        >
                          {q.command_name && (
                            <div
                              style={{
                                marginBottom:
                                  flags.length > 0 || examples.length > 0
                                    ? "5pt"
                                    : 0,
                              }}
                            >
                              <span
                                style={{
                                  fontFamily: "'Courier New', monospace",
                                  fontSize: "10pt",
                                  fontWeight: "700",
                                  color: "#a78bfa",
                                }}
                              >
                                $ {q.command_name}
                              </span>
                              {q.command_description && (
                                <span
                                  style={{
                                    fontSize: "8pt",
                                    color: "#64748b",
                                    marginLeft: "8pt",
                                  }}
                                >
                                  — {q.command_description}
                                </span>
                              )}
                            </div>
                          )}

                          {flags.length > 0 && (
                            <table
                              style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                marginBottom: examples.length > 0 ? "4pt" : 0,
                              }}
                            >
                              <tbody>
                                {flags.map((f, fi) => (
                                  <tr
                                    key={fi}
                                    style={{
                                      borderBottom:
                                        fi < flags.length - 1
                                          ? "1px solid #1e293b"
                                          : "none",
                                    }}
                                  >
                                    <td
                                      style={{
                                        padding: "2pt 8pt 2pt 0",
                                        fontFamily: "'Courier New', monospace",
                                        fontSize: "8pt",
                                        color: "#7dd3fc",
                                        whiteSpace: "nowrap",
                                        verticalAlign: "top",
                                        width: "28%",
                                      }}
                                    >
                                      {f.flag}
                                    </td>
                                    <td
                                      style={{
                                        padding: "2pt 0",
                                        fontSize: "8pt",
                                        color: "#94a3b8",
                                      }}
                                    >
                                      {f.description}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}

                          {examples.map((ex, ei) => (
                            <div
                              key={ei}
                              style={{
                                fontFamily: "'Courier New', monospace",
                                fontSize: "8pt",
                                color: "#7dcfff",
                                background: "#020617",
                                padding: "2pt 6pt",
                                borderRadius: "3pt",
                                marginTop: "2pt",
                              }}
                            >
                              $ {ex.code}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))
          )}

          {/* Footer */}
          <div
            style={{
              borderTop: "1px solid #e2e8f0",
              marginTop: "14pt",
              paddingTop: "6pt",
              display: "flex",
              justifyContent: "space-between",
              fontSize: "7pt",
              color: "#94a3b8",
            }}
          >
            <span>Cert-Hub • {module.title}</span>
            <span>
              {filterCat || "All Categories"} • {filteredQ.length} questions
            </span>
            <span>Generated {new Date().toLocaleDateString("en-US")}</span>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');

        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print\\:hidden { display: none !important; }
          .print\\:bg-white { background: white !important; }
          .print\\:py-0 { padding-top: 0 !important; padding-bottom: 0 !important; }
          .print\\:mx-0 { margin-left: 0 !important; margin-right: 0 !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          #print-content {
            width: 210mm !important;
            min-height: 297mm !important;
            margin: 0 !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </>
  );
}
