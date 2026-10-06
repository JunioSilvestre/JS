import React from "react";
import { AlignLeft, Code, Settings2 } from "lucide-react";

interface CommandFlag {
  flag: string;
  description: string;
}

interface CommandExample {
  code: string;
}

interface CommandCardProps {
  command: string;
  description?: string;
  flags: CommandFlag[];
  examples: CommandExample[];
  command_reference?: string;
  command_syntax?: string;
  command_options?: string;
  command_arguments?: string;
  command_how_it_works?: string;
  command_system_impact?: string;
  command_troubleshooting?: string;
  command_security?: string;
  command_related?: string;
}

export default function CommandCard({
  command,
  description,
  flags,
  examples,
  command_reference,
  command_syntax,
  command_options,
  command_arguments,
  command_how_it_works,
  command_system_impact,
  command_troubleshooting,
  command_security,
  command_related,
}: CommandCardProps) {
  const hasFlags = flags && flags.some((f) => f.flag || f.description);
  const hasExamples = examples && examples.some((e) => e.code);

  if (!command && !hasFlags && !hasExamples && !command_reference) return null;

  return (
    <div className="w-full bg-[#050505] text-[#d4d4d4] font-mono rounded-none border border-[#222] shadow-2xl overflow-hidden print:border-gray-300 print:text-black print:bg-white">
      {/* Header section */}
      <div className="p-6 border-b border-[#222]">
        <div className="text-xs font-bold text-[#888] uppercase tracking-widest mb-2">
          Command Reference
        </div>
        <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
          {command || "Command"}
        </h1>
        {description && (
          <p className="text-lg text-[#aaa] font-sans">{description}</p>
        )}
      </div>

      <div className="p-6 space-y-8">
        {/* Structured Sections (New implementation) */}
        {command_syntax && (
          <section>
            <h2 className="text-sm font-bold text-[#569cd6] uppercase tracking-widest mb-3 flex items-center gap-2">
              <Code size={16} /> Syntax
            </h2>
            <div className="bg-[#0a0a0a] border border-[#222] p-4 rounded-md">
              <pre className="font-mono text-[13px] leading-tight text-[#ce9178] whitespace-pre-wrap font-semibold">
                {command_syntax}
              </pre>
            </div>
          </section>
        )}

        {command_options && (
          <section>
            <h2 className="text-sm font-bold text-[#569cd6] uppercase tracking-widest mb-3 flex items-center gap-2">
              <Settings2 size={16} /> Options
            </h2>
            <div className="bg-[#0a0a0a] border border-[#222] p-4 rounded-md">
              <pre className="font-mono text-[13px] leading-relaxed text-[#dcdcaa] whitespace-pre-wrap">
                {command_options}
              </pre>
            </div>
          </section>
        )}

        {command_arguments && (
          <section>
            <h2 className="text-sm font-bold text-[#569cd6] uppercase tracking-widest mb-3 flex items-center gap-2">
              <AlignLeft size={16} /> Arguments
            </h2>
            <div className="bg-[#0a0a0a] border border-[#222] p-4 rounded-md">
              <pre className="font-mono text-[13px] leading-relaxed text-[#dcdcaa] whitespace-pre-wrap">
                {command_arguments}
              </pre>
            </div>
          </section>
        )}

        {/* Existing flags/examples fallback for backwards compatibility */}
        {hasFlags && !command_options && (
          <section>
            <h2 className="text-sm font-bold text-[#569cd6] uppercase tracking-widest mb-3 flex items-center gap-2">
              <Settings2 size={16} /> Options & Flags
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-[#222]">
                    <th className="pb-3 text-[#9cdcfe] font-semibold">
                      Option
                    </th>
                    <th className="pb-3 text-[#9cdcfe] font-semibold">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#111]">
                  {flags
                    .filter((f) => f.flag || f.description)
                    .map((item, index) => (
                      <tr key={index} className="hover:bg-[#0a0a0a] transition">
                        <td className="py-3 pr-4 font-mono text-[#dcdcaa] whitespace-nowrap align-top w-1/4">
                          {item.flag || "—"}
                        </td>
                        <td className="py-3 font-sans text-[#ccc] leading-relaxed">
                          {item.description || "No description."}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {hasExamples && (
          <section>
            <h2 className="text-sm font-bold text-[#569cd6] uppercase tracking-widest mb-3 flex items-center gap-2">
              <Code size={16} /> Example
            </h2>
            <div className="space-y-3">
              {examples
                .filter((e) => e.code)
                .map((example, index) => (
                  <div
                    key={index}
                    className="bg-[#0a0a0a] border-l-4 border-[#569cd6] p-4 rounded-r-md text-sm"
                  >
                    <div className="font-mono text-[#4ec9b0] break-all">
                      <span className="text-[#808080] select-none mr-2">$</span>
                      {example.code}
                    </div>
                  </div>
                ))}
            </div>
          </section>
        )}

        {command_how_it_works && (
          <section>
            <h2 className="text-sm font-bold text-[#569cd6] uppercase tracking-widest mb-3 flex items-center gap-2">
              <AlignLeft size={16} /> How It Works
            </h2>
            <div className="bg-[#0a0a0a] border border-[#222] p-4 rounded-md">
              <p className="font-sans text-sm leading-relaxed text-[#ccc] whitespace-pre-wrap">
                {command_how_it_works}
              </p>
            </div>
          </section>
        )}

        {command_system_impact && (
          <section>
            <h2 className="text-sm font-bold text-[#569cd6] uppercase tracking-widest mb-3 flex items-center gap-2">
              <AlignLeft size={16} /> System Impact
            </h2>
            <div className="bg-[#0a0a0a] border border-[#222] p-4 rounded-md">
              <p className="font-sans text-sm leading-relaxed text-[#ccc] whitespace-pre-wrap">
                {command_system_impact}
              </p>
            </div>
          </section>
        )}

        {command_troubleshooting && (
          <section>
            <h2 className="text-sm font-bold text-[#569cd6] uppercase tracking-widest mb-3 flex items-center gap-2">
              <AlignLeft size={16} /> Troubleshooting
            </h2>
            <div className="bg-[#0a0a0a] border border-[#222] p-4 rounded-md">
              <p className="font-sans text-sm leading-relaxed text-[#ccc] whitespace-pre-wrap">
                {command_troubleshooting}
              </p>
            </div>
          </section>
        )}

        {command_security && (
          <section>
            <h2 className="text-sm font-bold text-[#569cd6] uppercase tracking-widest mb-3 flex items-center gap-2">
              <AlignLeft size={16} /> Security Considerations
            </h2>
            <div className="bg-[#0a0a0a] border border-[#222] p-4 rounded-md">
              <p className="font-sans text-sm leading-relaxed text-[#ccc] whitespace-pre-wrap">
                {command_security}
              </p>
            </div>
          </section>
        )}

        {command_related && (
          <section>
            <h2 className="text-sm font-bold text-[#569cd6] uppercase tracking-widest mb-3 flex items-center gap-2">
              <AlignLeft size={16} /> Related Commands
            </h2>
            <div className="bg-[#0a0a0a] border border-[#222] p-4 rounded-md">
              <pre className="font-mono text-[13px] leading-relaxed text-[#9cdcfe] whitespace-pre-wrap font-bold">
                {command_related}
              </pre>
            </div>
          </section>
        )}

        {/* If we have the full ASCII reference sheet, render it beautifully as fallback */}
        {command_reference && (
          <section>
            <h2 className="text-sm font-bold text-[#569cd6] uppercase tracking-widest mb-3 flex items-center gap-2">
              <Code size={16} /> Full Reference (Raw)
            </h2>
            <div className="overflow-x-auto bg-[#0a0a0a] border border-[#222] p-6 rounded-md shadow-inner">
              <pre className="font-mono text-[13px] leading-tight text-[#dcdcaa] whitespace-pre">
                {command_reference}
              </pre>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
