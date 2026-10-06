"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import SpellCheckedTextarea from "./SpellCheckedTextarea";

export interface AnatomySection {
  id: string;
  title: string;
  type: "single" | "multiple";
  items: AnatomyItem[];
}

export interface AnatomyItem {
  id: string;
  code?: string;
  explanation?: string;
  purpose?: string;
  notes?: string;
  components?: string;
  // Specific fields mapped loosely
  interpreter?: string;
  option?: string;
  meaning?: string;
  example?: string;
  variableName?: string;
  declaration?: string;
  value?: string;
  variableType?: string;
  functionName?: string;
  parameters?: string;
  returnValue?: string;
  command?: string;
  argument?: string;
  subcommand?: string;
  description?: string;
  condition?: string;
  expectedResult?: string;
  loopType?: string;
  iterationSource?: string;
  exitCondition?: string;
  input?: string;
  output?: string;
  operator?: string;
  source?: string;
  destination?: string;
  errorCondition?: string;
  detection?: string;
  handling?: string;
  recovery?: string;
  usage?: string;
}

const defaultSections: AnatomySection[] = [
  { id: "01", title: "SHEBANG", type: "single", items: [] },
  { id: "02", title: "SCRIPT OPTIONS", type: "multiple", items: [] },
  { id: "03", title: "VARIABLES / CONSTANTS", type: "multiple", items: [] },
  { id: "04", title: "FUNCTIONS", type: "multiple", items: [] },
  { id: "05", title: "COMMANDS", type: "multiple", items: [] },
  { id: "06", title: "CONDITIONS", type: "multiple", items: [] },
  { id: "07", title: "LOOPS", type: "multiple", items: [] },
  { id: "08", title: "INPUT / OUTPUT", type: "multiple", items: [] },
  { id: "09", title: "PIPELINES", type: "multiple", items: [] },
  { id: "10", title: "REDIRECTION", type: "multiple", items: [] },
  { id: "11", title: "ERROR HANDLING", type: "multiple", items: [] },
  { id: "12", title: "ARGUMENTS", type: "multiple", items: [] },
  { id: "13", title: "MAIN / ORCHESTRATION", type: "single", items: [] },
  { id: "14", title: "ENTRY POINT", type: "single", items: [] },
];

interface BashAnatomyBuilderProps {
  anatomy: AnatomySection[];
  onChange?: (anatomy: AnatomySection[]) => void;
  readonly?: boolean;
}

export default function BashAnatomyBuilder({
  anatomy,
  onChange,
  readonly = false,
}: BashAnatomyBuilderProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const currentAnatomy =
    anatomy && anatomy.length > 0 ? anatomy : defaultSections;

  const handleToggle = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  const addItem = (sectionId: string) => {
    if (readonly || !onChange) return;
    const newAnatomy = currentAnatomy.map((sec) => {
      if (sec.id === sectionId) {
        return {
          ...sec,
          items: [
            ...sec.items,
            { id: Math.random().toString(36).substring(2, 9) },
          ],
        };
      }
      return sec;
    });
    onChange(newAnatomy);
    setExpandedSection(sectionId);
  };

  const removeItem = (sectionId: string, itemId: string) => {
    if (readonly || !onChange) return;
    const newAnatomy = currentAnatomy.map((sec) => {
      if (sec.id === sectionId) {
        return {
          ...sec,
          items: sec.items.filter((item) => item.id !== itemId),
        };
      }
      return sec;
    });
    onChange(newAnatomy);
  };

  const updateItem = (
    sectionId: string,
    itemId: string,
    field: keyof AnatomyItem,
    value: string,
  ) => {
    if (readonly || !onChange) return;
    const newAnatomy = currentAnatomy.map((sec) => {
      if (sec.id === sectionId) {
        return {
          ...sec,
          items: sec.items.map((item) =>
            item.id === itemId ? { ...item, [field]: value } : item,
          ),
        };
      }
      return sec;
    });
    onChange(newAnatomy);
  };

  const renderField = (
    sectionId: string,
    itemId: string,
    label: string,
    field: keyof AnatomyItem,
    item: AnatomyItem,
    isTextArea = false,
  ) => {
    if (readonly) {
      if (!item[field]) return null;
      return (
        <div className="mb-3">
          <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            {label}
          </span>
          <div className="text-sm text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-200 whitespace-pre-wrap font-mono">
            {item[field]}
          </div>
        </div>
      );
    }

    const needsSpellCheck = ["explanation", "purpose", "notes", "description", "meaning"].includes(field);

    if (needsSpellCheck) {
      return (
        <div className="mb-4">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
            {label}
          </label>
          <SpellCheckedTextarea
            asInput={!isTextArea}
            type={!isTextArea ? "text" : undefined}
            value={item[field] || ""}
            onChange={(e) =>
              updateItem(sectionId, itemId, field, e.target.value)
            }
            className={`w-full bg-white border border-gray-200 text-gray-900 font-mono text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition-all ${isTextArea ? "resize-y min-h-[80px]" : ""}`}
          />
        </div>
      );
    }

    return (
      <div className="mb-4">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
          {label}
        </label>
        {isTextArea ? (
          <textarea
            value={item[field] || ""}
            onChange={(e) =>
              updateItem(sectionId, itemId, field, e.target.value)
            }
            className="w-full bg-white border border-gray-200 text-gray-900 font-mono text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition-all resize-y min-h-[80px]"
          />
        ) : (
          <input
            type="text"
            value={item[field] || ""}
            onChange={(e) =>
              updateItem(sectionId, itemId, field, e.target.value)
            }
            className="w-full bg-white border border-gray-200 text-gray-900 font-mono text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition-all"
          />
        )}
      </div>
    );
  };

  const renderItemFields = (section: AnatomySection, item: AnatomyItem) => {
    return (
      <div
        key={item.id}
        className="mb-4 bg-gray-50 border border-gray-200 rounded-xl p-4 relative"
      >
        {!readonly && (
          <button
            onClick={() => removeItem(section.id, item.id)}
            className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors p-1"
            title="Remove item"
          >
            <Trash2 size={16} />
          </button>
        )}
        <div className="pr-8">
          {renderField(section.id, item.id, "Code Snippet", "code", item, true)}

          {section.title === "SHEBANG" && (
            <>
              {renderField(
                section.id,
                item.id,
                "Interpreter",
                "interpreter",
                item,
              )}
              {renderField(
                section.id,
                item.id,
                "Explanation",
                "explanation",
                item,
                true,
              )}
            </>
          )}

          {section.title === "SCRIPT OPTIONS" && (
            <>
              {renderField(section.id, item.id, "Option", "option", item)}
              {renderField(section.id, item.id, "Meaning", "meaning", item)}
              {renderField(section.id, item.id, "Purpose", "purpose", item)}
            </>
          )}

          {section.title === "VARIABLES / CONSTANTS" && (
            <>
              {renderField(
                section.id,
                item.id,
                "Variable Name",
                "variableName",
                item,
              )}
              {renderField(
                section.id,
                item.id,
                "Value / Expression",
                "value",
                item,
              )}
              {renderField(section.id, item.id, "Purpose", "purpose", item)}
            </>
          )}

          {section.title === "FUNCTIONS" && (
            <>
              {renderField(
                section.id,
                item.id,
                "Function Name",
                "functionName",
                item,
              )}
              {renderField(
                section.id,
                item.id,
                "Purpose",
                "purpose",
                item,
                true,
              )}
              {renderField(
                section.id,
                item.id,
                "Parameters",
                "parameters",
                item,
              )}
              {renderField(
                section.id,
                item.id,
                "Explanation",
                "explanation",
                item,
                true,
              )}
            </>
          )}

          {section.title === "COMMANDS" && (
            <>
              {renderField(section.id, item.id, "Command", "command", item)}
              {renderField(
                section.id,
                item.id,
                "Options/Arguments",
                "argument",
                item,
              )}
              {renderField(
                section.id,
                item.id,
                "Description",
                "description",
                item,
                true,
              )}
            </>
          )}

          {/* Generic fallback for others */}
          {[
            "CONDITIONS",
            "LOOPS",
            "INPUT / OUTPUT",
            "PIPELINES",
            "REDIRECTION",
            "ERROR HANDLING",
            "ARGUMENTS",
            "MAIN / ORCHESTRATION",
            "ENTRY POINT",
          ].includes(section.title) && (
            <>
              {renderField(
                section.id,
                item.id,
                "Explanation",
                "explanation",
                item,
                true,
              )}
              {renderField(
                section.id,
                item.id,
                "Notes / Details",
                "notes",
                item,
                true,
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-3 mt-8">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          Bash Script Anatomy
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {readonly
            ? "Interactive documentation for this script."
            : "Document your script block by block."}
        </p>
      </div>

      {currentAnatomy.map((section) => {
        const isExpanded = expandedSection === section.id;
        const hasItems = section.items && section.items.length > 0;

        return (
          <div
            key={section.id}
            className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition-all"
          >
            {/* Header */}
            <button
              onClick={() => handleToggle(section.id)}
              className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-gray-400 font-mono text-sm font-bold">
                  {section.id}
                </span>
                <span className="font-bold text-gray-900 tracking-wide text-sm">
                  {section.title}
                </span>
                {hasItems && (
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-bold ml-2">
                    {section.items.length}{" "}
                    {section.items.length === 1 ? "item" : "items"}
                  </span>
                )}
              </div>
              <div className="text-gray-400">
                {isExpanded ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </div>
            </button>

            {/* Content */}
            {isExpanded && (
              <div className="px-5 pb-5 border-t border-gray-100 bg-gray-50/30 pt-5">
                {hasItems ? (
                  <div className="space-y-4">
                    {section.items.map((item) =>
                      renderItemFields(section, item),
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 italic mb-4">
                    No items added yet.
                  </div>
                )}

                {!readonly && (section.type === "multiple" || !hasItems) && (
                  <button
                    onClick={() => addItem(section.id)}
                    className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors"
                  >
                    <Plus size={16} />
                    Add {section.title.toLowerCase().replace(/ \/ .*/, "")}
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
