
"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  apiGetInfraCategories,
  apiCreateInfraCategory,
  apiGetInfraProjects,
  apiCreateInfraProject,
  apiUpdateInfraProject,
  apiDeleteInfraProject,
} from "@/lib/api";

export default function InfraPage() {
  useEffect(() => {
    // ========== SEED: categorias alinhadas ao mercado CT/MA/NY ==========
    let apiCats: any[] = [];
    let apiProjs: any[] = [];

    const loadData = async () => {
      try {
        const catsRes = await apiGetInfraCategories();
        const projsRes = await apiGetInfraProjects();
        apiCats = catsRes.data || [];
        apiProjs = projsRes.data || [];
        renderAll();
      } catch (e) {
        console.error(e);
      }
    };
    loadData();

    const trilha90 = [
      {
        m: 1,
        title: "Mês 1 — Fundação dual-OS",
        items: [
          "Linux inventário + systemd + SSH hardening",
          "Windows AD inventário + Domain Admins + DC health",
          "PowerShell e Bash com padrão de produção",
          "4 projetos prioridade alta concluídos com lab",
        ],
      },
      {
        m: 2,
        title: "Mês 2 — Virtualização + Identity + Patch",
        items: [
          "VMware mental model + checklist VM",
          "AD ↔ Entra hybrid map",
          "Joiner-Mover-Leaver",
          "Patch Linux com pré/pós check",
        ],
      },
      {
        m: 3,
        title: "Mês 3 — Cloud + Automação + DR",
        items: [
          "Azure VNet+VM+NSG (AZ-104 path)",
          "Ansible playbook mínimo",
          "Terraform resource mínimo",
          "Backup com restore testado + runbook",
        ],
      },
    ];

    const certsROI = [
      {
        cert: "Security+",
        roi: "Alto",
        why: "Baseline em muitas vagas; clearance paths em MA; linguagem comum de risco.",
      },
      {
        cert: "AZ-104",
        roi: "Alto",
        why: "Azure híbrido domina CT/MA/NY Microsoft shops.",
      },
      {
        cert: "RHCSA",
        roi: "Alto",
        why: "Linux enterprise (RHEL) em MA/NY e ops sérias.",
      },
      {
        cert: "VCP-DCV / lab VMware forte",
        roi: "Alto",
        why: "Virtualização on-prem ainda é o centro da infra regional.",
      },
      {
        cert: "AWS SAA",
        roi: "Médio",
        why: "Complemento multi-cloud e papéis Linux+AWS em CT.",
      },
      {
        cert: "SC-300 / MD-102",
        roi: "Médio",
        why: "Se for forte em identity/endpoint (Entra/Intune).",
      },
    ];

    const defaultChecklist = [
      { id: "c1", text: "Rodei no lab (não só li a teoria)" },
      { id: "c2", text: "Idempotente / reexecutar não quebra" },
      { id: "c3", text: "Validei falha (permissão, rede ou disco)" },
      { id: "c4", text: "Tenho evidência (log, screenshot, output)" },
      { id: "c5", text: "Sei explicar em 60s para entrevista" },
      { id: "c6", text: "Sem segredo hardcoded" },
      { id: "c7", text: "Critério de sucesso escrito e testado" },
      { id: "c8", text: "Anotei erros e o que faria diferente" },
    ];

    const conceptTemplate = [
      {
        cat: "estrutura",
        label: "1. ESTRUTURA",
        items: [
          {
            id: "script",
            num: "01",
            name: "Script",
            desc: "Arquivo executável completo",
          },
          {
            id: "entrypoint",
            num: "02",
            name: "Entry Point",
            desc: "Ponto de entrada",
          },
          { id: "main", num: "03", name: "Main", desc: "Orquestração" },
          { id: "function", num: "04", name: "Function", desc: "Reutilização" },
          {
            id: "module",
            num: "05",
            name: "Module",
            desc: "Biblioteca / papel Ansible / módulo TF",
          },
        ],
      },
      {
        cat: "dados",
        label: "2. DADOS",
        items: [
          {
            id: "variable",
            num: "06",
            name: "Variable",
            desc: "Valor mutável",
          },
          { id: "constant", num: "07", name: "Constant", desc: "Valor fixo" },
          {
            id: "parameter",
            num: "08",
            name: "Parameter",
            desc: "Entrada da função",
          },
          {
            id: "argument",
            num: "09",
            name: "Argument",
            desc: "Valor passado",
          },
          { id: "array", num: "10", name: "Array", desc: "Coleção" },
          { id: "env", num: "11", name: "Env var", desc: "Config externa" },
        ],
      },
      {
        cat: "controle",
        label: "3. CONTROLE",
        items: [
          { id: "condition", num: "12", name: "Condição", desc: "Decisão" },
          { id: "loop", num: "13", name: "Loop", desc: "Repetição" },
          { id: "pipeline", num: "14", name: "Pipeline", desc: "Encadeamento" },
          { id: "error", num: "15", name: "Error handling", desc: "Falhas" },
        ],
      },
      {
        cat: "io",
        label: "4. I/O",
        items: [
          { id: "input", num: "16", name: "Input", desc: "Entrada" },
          { id: "output", num: "17", name: "Output", desc: "Saída" },
          { id: "exitcode", num: "18", name: "Exit code", desc: "Status" },
          { id: "filedir", num: "19", name: "Arquivos", desc: "Filesystem" },
        ],
      },
      {
        cat: "qualidade",
        label: "5. QUALIDADE",
        items: [
          { id: "validation", num: "20", name: "Validação", desc: "Checagem" },
          { id: "logging", num: "21", name: "Logging", desc: "Registro" },
          {
            id: "idempotency",
            num: "22",
            name: "Idempotência",
            desc: "Reexecução segura",
          },
          {
            id: "security",
            num: "23",
            name: "Segurança",
            desc: "Least privilege",
          },
          {
            id: "testing",
            num: "24",
            name: "Teste",
            desc: "Prova de funcionamento",
          },
        ],
      },
    ];

    function getCategories() {
      return apiCats;
    }

    function getProjects(catId: string) {
      return apiProjs.filter((p: any) => p.category_id === catId);
    }

    function allProjectItems() {
      return getCategories()
        .filter((c) => c.type === "projects")
        .flatMap((c) =>
          getProjects(c.id).map((p) => ({
            ...p,
            _categoryId: c.id,
            _categoryLabel: c.label,
          })),
        );
    }

    // ProjetosSenior APIs replaced with async handlers

    let currentFilter = "all";
    let currentPriority = "all";
    let currentProject: any = null;
    let currentCatFilter = "all";
    let activeTabId: string | null = null;

    function getProjectData(id: string) {
      const p = apiProjs.find((x: any) => x.id === id);
      if (!p)
        return {
          status: "todo",
          notes: "",
          code: "",
          concepts: {},
          checklist: {},
        };

      const parseJSON = (val: any) => {
        if (!val) return {};
        if (typeof val === "object") return val;
        try {
          return JSON.parse(val);
        } catch {
          return {};
        }
      };

      return {
        status: p.status || "todo",
        notes: p.interview || "",
        code: p.scenario || "",
        concepts: parseJSON(p.concepts),
        checklist: parseJSON(p.checklist),
      };
    }

    function statusBadge(s: string) {
      const m: Record<string, string> = {
        todo: '<span class="text-xs font-bold px-2 py-0.5 rounded-md border bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400">A fazer</span>',
        doing:
          '<span class="text-xs font-bold px-2 py-0.5 rounded-md border bg-amber-500/10 text-amber-600 border-amber-500/20">Em andamento</span>',
        done: '<span class="text-xs font-bold px-2 py-0.5 rounded-md border bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Concluído</span>',
      };
      return m[s] || m.todo;
    }

    function levelBadge(l: string) {
      const labels: Record<string, string> = {
        basico: "Básico",
        intermediario: "Intermediário",
        avancado: "Avançado",
        expert: "Expert",
      };
      const cls =
        l === "basico"
          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
          : l === "avancado"
            ? "bg-red-500/10 text-red-500 border-red-500/20"
            : l === "expert"
              ? "bg-purple-500/10 text-purple-500 border-purple-500/20"
              : "bg-amber-500/10 text-amber-500 border-amber-500/20";
      return `<span class="text-xs font-medium px-2 py-0.5 rounded-md border ${cls}">${labels[l] || l || "Intermediário"}</span>`;
    }

    function priorityBadge(p: string) {
      if (p === "alta")
        return '<span class="text-xs font-medium px-2 py-0.5 rounded-md border bg-red-500/10 text-red-400 border-red-500/20">Prioridade alta</span>';
      if (p === "media")
        return '<span class="text-xs font-medium px-2 py-0.5 rounded-md border bg-amber-500/10 text-amber-500 border-amber-500/20">Média</span>';
      return '<span class="text-xs font-medium px-2 py-0.5 rounded-md border bg-slate-500/10 text-slate-400 border-slate-500/20">Baixa</span>';
    }

    function createCard(p: any, category: string, index: number) {
      const data = getProjectData(p.id);
      if (currentFilter !== "all" && data.status !== currentFilter) return "";
      if (
        currentPriority !== "all" &&
        (p.priority || "media") !== currentPriority
      )
        return "";
      const searchInput = document.getElementById(
        "searchInput",
      ) as HTMLInputElement;
      const search = (searchInput?.value || "").toLowerCase();
      if (search) {
        const hay = [
          p.name,
          ...(Array.isArray(p.reqs)
            ? p.reqs
            : typeof p.reqs === "string"
              ? (() => {
                  try {
                    return JSON.parse(p.reqs);
                  } catch {
                    return [];
                  }
                })()
              : []),
          ...(Array.isArray(p.certs)
            ? p.certs
            : typeof p.certs === "string"
              ? (() => {
                  try {
                    return JSON.parse(p.certs);
                  } catch {
                    return [];
                  }
                })()
              : []),
          p.objective || "",
        ]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(search)) return "";
      }

      const num = String(index + 1).padStart(2, "0");

      const prioColor =
        p.priority === "alta"
          ? "#ef4444"
          : p.priority === "media"
            ? "#f59e0b"
            : "#94a3b8";

      const reqsHTML = (
        Array.isArray(p.reqs)
          ? p.reqs
          : typeof p.reqs === "string"
            ? (() => {
                try {
                  return JSON.parse(p.reqs);
                } catch {
                  return [];
                }
              })()
            : []
      )
        .slice(0, 3)
        .map(
          (r: string) =>
            `<span class="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">${r}</span>`,
        )
        .join("");

      return `
        <div class="group bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-2xl p-6 transition-all shadow-sm hover:shadow-xl relative overflow-hidden flex flex-col cursor-pointer" style="border-top: 4px solid ${prioColor}" data-id="${p.id}" data-category="${category}">
          
          <div class="flex items-start justify-between mb-4">
             <div class="w-12 h-12 rounded-xl flex items-center justify-center text-xl group-hover:scale-105 transition-transform flex-shrink-0" style="background-color: ${prioColor}15; color: ${prioColor}">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
             </div>
             ${statusBadge(data.status)}
          </div>

          <div class="flex flex-wrap items-center gap-2 mb-3">
             ${levelBadge(p.level)}
             ${priorityBadge(p.priority)}
             ${p.time ? `<span class="text-xs font-medium px-2 py-0.5 rounded-md border bg-slate-500/10 text-slate-500 border-slate-500/20">${p.time}</span>` : ""}
          </div>

          <h3 class="text-base font-bold text-gray-900 dark:text-white mb-2 leading-snug line-clamp-2">
            <span class="text-slate-400 font-mono text-sm mr-1">${num}.</span>${p.name}
          </h3>
          
          <div class="flex flex-wrap gap-1.5 mb-4 flex-1 content-start">
             ${reqsHTML}
          </div>

          <div class="flex items-center justify-between border-t border-gray-200 dark:border-slate-700 pt-4 mt-auto">
             <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="inline"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                ${p.ext ? p.ext.toUpperCase() : "BASH"}
             </div>
             <span class="flex items-center gap-1 text-xs font-medium text-indigo-500 hover:text-indigo-400 transition">
                Abrir <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
             </span>
          </div>
        </div>`;
    }

    function renderTrilha() {
      return `<div class="space-y-4">${trilha90
        .map(
          (t) => `
        <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
          <h3 class="font-bold text-indigo-600 dark:text-indigo-400">Mês ${t.m} — ${t.title.replace(/^Mês \d+ — /, "")}</h3>
          <ul class="mt-3 space-y-1.5 text-sm list-disc list-inside text-slate-700 dark:text-slate-300">
            ${t.items.map((i) => `<li>${i}</li>`).join("")}
          </ul>
        </div>`,
        )
        .join("")}</div>`;
    }

    function renderCerts() {
      return `<div class="space-y-3">${certsROI
        .map(
          (c) => `
        <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
          <div class="flex items-center justify-between gap-2">
            <span class="font-semibold">${c.cert}</span>
            <span class="badge ${c.roi === "Alto" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"}">ROI ${c.roi}</span>
          </div>
          <p class="text-sm text-slate-500 mt-1">${c.why}</p>
        </div>`,
        )
        .join("")}</div>`;
    }

    function renderTabsAndPanels() {
      const cats = getCategories();
      if (!activeTabId || !cats.find((c) => c.id === activeTabId))
        activeTabId = cats[0]?.id;

      const tabsBar = document.getElementById("tabsBar");
      if (tabsBar) {
        tabsBar.innerHTML = cats
          .map((c) => {
            const active = c.id === activeTabId;
            return `<button data-tab="${c.id}" class="tab-btn ${active ? "tab-active" : "text-slate-500"} px-4 py-2.5 text-sm whitespace-nowrap">${c.label}</button>`;
          })
          .join("");
      }

      const panelsContainer = document.getElementById("panelsContainer");
      if (panelsContainer) {
        panelsContainer.innerHTML = cats
          .map((c) => {
            const hidden = c.id === activeTabId ? "" : "hidden";
            if (c.type === "trilha")
              return `<div id="panel-${c.id}" class="tab-panel fade-in ${hidden}">${renderTrilha()}</div>`;
            if (c.type === "certs")
              return `<div id="panel-${c.id}" class="tab-panel fade-in ${hidden}">${renderCerts()}</div>`;
            const list = getProjects(c.id);
            const cards =
              list.map((p, i) => createCard(p, c.label, i)).join("") ||
              '<p class="text-slate-500 text-sm py-8 text-center col-span-full">Nenhum projeto neste filtro.</p>';
            return `<div id="panel-${c.id}" class="tab-panel fade-in ${hidden}"><div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">${cards}</div></div>`;
          })
          .join("");
      }

      document.querySelectorAll("#tabsBar .tab-btn").forEach((btn) => {
        (btn as HTMLElement).onclick = () => {
          activeTabId = (btn as HTMLElement).dataset.tab || null;
          renderTabsAndPanels();
          attachCardListeners();
        };
      });
    }

    function updateProgress() {
      const all = allProjectItems();
      const done = all.filter(
        (p) => getProjectData(p.id).status === "done",
      ).length;
      const alta = all.filter((p) => p.priority === "alta").length;
      const pct = all.length ? Math.round((done / all.length) * 100) : 0;

      const statTotal = document.getElementById("statTotal");
      if (statTotal) statTotal.textContent = String(all.length);
      const statDone = document.getElementById("statDone");
      if (statDone) statDone.textContent = String(done);
      const statAlta = document.getElementById("statAlta");
      if (statAlta) statAlta.textContent = String(alta);
      const statPct = document.getElementById("statPct");
      if (statPct) statPct.textContent = pct + "%";
      const progressBar = document.getElementById("progressBar");
      if (progressBar) progressBar.style.width = pct + "%";
      const progressText = document.getElementById("progressText");
      if (progressText)
        progressText.textContent = `${done} / ${all.length} concluídos`;
    }

    function attachCardListeners() {
      document.querySelectorAll("[data-id]").forEach((el) => {
        (el as HTMLElement).onclick = () =>
          openDetail(
            (el as HTMLElement).dataset.id!,
            (el as HTMLElement).dataset.category!,
          );
      });
    }

    function renderAll() {
      renderTabsAndPanels();
      updateProgress();
      attachCardListeners();
      refreshRegCatSelect();
    }

    function openDetail(id: string, category: string) {
      currentProject = allProjectItems().find((x) => x.id === id);
      if (!currentProject) return;
      const p = currentProject;
      const data = getProjectData(id);

      const tTitle = document.getElementById("detailTitle");
      if (tTitle) tTitle.textContent = p.name;
      const tCategory = document.getElementById("detailCategory");
      if (tCategory) tCategory.textContent = category;

      const tLevel = document.getElementById("detailLevel");
      if (tLevel) {
        tLevel.className = "badge level-" + (p.level || "intermediario");
        tLevel.textContent =
          (
            {
              basico: "Básico",
              intermediario: "Intermediário",
              avancado: "Avançado",
              expert: "Expert",
            } as any
          )[p.level] || "";
      }

      const tPriority = document.getElementById("detailPriority");
      if (tPriority) {
        tPriority.innerHTML = priorityBadge(p.priority).replace(
          /<\/?span[^>]*>/g,
          (match) => match,
        );
        tPriority.className = "badge";
        tPriority.textContent =
          p.priority === "alta"
            ? "Prioridade alta"
            : p.priority === "media"
              ? "Média"
              : "Baixa";
        if (p.priority === "alta")
          tPriority.className =
            "badge bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";
      }

      const tTime = document.getElementById("detailTime");
      if (tTime) tTime.textContent = p.time ? "⏱ " + p.time : "";
      const tStatus = document.getElementById(
        "detailStatus",
      ) as HTMLSelectElement;
      if (tStatus) tStatus.value = data.status;
      const tNotes = document.getElementById(
        "detailNotes",
      ) as HTMLTextAreaElement;
      if (tNotes) tNotes.value = data.notes || "";
      const tCode = document.getElementById(
        "codeEditor",
      ) as HTMLTextAreaElement;
      if (tCode) tCode.value = data.code || "";
      const tFilename = document.getElementById("codeFilename");
      if (tFilename)
        tFilename.textContent =
          p.name
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "") +
          "." +
          (p.ext || "txt");
      const tReqs = document.getElementById("detailReqs");
      if (tReqs)
        tReqs.innerHTML = (
          Array.isArray(p.reqs)
            ? p.reqs
            : typeof p.reqs === "string"
              ? (() => {
                  try {
                    return JSON.parse(p.reqs);
                  } catch {
                    return [];
                  }
                })()
              : []
        )
          .map(
            (r: string) =>
              `<span class="badge bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">${r}</span>`,
          )
          .join("");

      const setEl = (id: string, text: string) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
      };
      setEl("detailObjective", p.objective || "—");
      setEl("detailScenario", p.scenario || "—");
      setEl("detailInterview", p.interview || "—");
      setEl("detailCertTip", p.certTip || "—");

      const tPrereqs = document.getElementById("detailPrereqs");
      if (tPrereqs) {
        const prereqsArray = Array.isArray(p.prereqs)
          ? p.prereqs
          : typeof p.prereqs === "string"
            ? (() => {
                try {
                  return JSON.parse(p.prereqs);
                } catch {
                  return [p.prereqs];
                }
              })()
            : ["—"];
        tPrereqs.innerHTML = (prereqsArray.length ? prereqsArray : ["—"])
          .map((x: string) => `<li>${x}</li>`)
          .join("");
      }
      const tCerts = document.getElementById("detailCerts");
      if (tCerts)
        tCerts.innerHTML =
          (Array.isArray(p.certs)
            ? p.certs
            : typeof p.certs === "string"
              ? (() => {
                  try {
                    return JSON.parse(p.certs);
                  } catch {
                    return [];
                  }
                })()
              : []
          )
            .map(
              (c: string) =>
                `<span class="badge bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">${c}</span>`,
            )
            .join("") || "—";

      renderConcepts();
      renderChecklist();

      document.getElementById("listView")?.classList.add("hidden");
      document.getElementById("detailView")?.classList.remove("hidden");
      window.scrollTo(0, 0);
      document.querySelectorAll(".dtab-btn").forEach((b) => {
        b.classList.remove("tab-active");
        b.classList.add("text-slate-500");
      });
      document
        .querySelector('[data-dtab="academico"]')
        ?.classList.add("tab-active");
      document
        .querySelector('[data-dtab="academico"]')
        ?.classList.remove("text-slate-500");
      document
        .querySelectorAll(".dtab-panel")
        .forEach((p) => p.classList.add("hidden"));
      document.getElementById("dtab-academico")?.classList.remove("hidden");
    }

    function renderConcepts() {
      const data = getProjectData(currentProject.id);
      let html = "";
      conceptTemplate.forEach((group) => {
        if (currentCatFilter !== "all" && group.cat !== currentCatFilter)
          return;
        html += `<div class="mb-4"><h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">${group.label}</h3><div class="space-y-1.5">`;
        group.items.forEach((item) => {
          const val = data.concepts?.[item.id] || "";
          html += `<details class="concept-item bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <summary class="flex items-center justify-between px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer">
              <div class="flex items-center gap-2 min-w-0">
                <span class="text-[11px] font-mono text-slate-400 w-6">${item.num}</span>
                <span class="text-xs font-semibold text-indigo-600 dark:text-indigo-400">${item.name}</span>
                <span class="text-[11px] text-slate-400 truncate hidden sm:inline">— ${item.desc}</span>
              </div>
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
            </summary>
            <div class="px-3 pb-3"><textarea data-concept="${item.id}" rows="2" class="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 p-2.5 font-mono" placeholder="Como aparece neste lab...">${val}</textarea></div>
          </details>`;
        });
        html += `</div></div>`;
      });
      const cCont = document.getElementById("conceptsContainer");
      if (cCont) cCont.innerHTML = html;
    }

    function renderChecklist() {
      const data = getProjectData(currentProject.id);
      const chkCont = document.getElementById("checklistContainer");
      if (chkCont)
        chkCont.innerHTML = defaultChecklist
          .map((item) => {
            const checked = data.checklist?.[item.id] ? "checked" : "";
            return `<label class="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/40 cursor-pointer">
          <input type="checkbox" data-check="${item.id}" ${checked} class="mt-0.5 rounded border-slate-300 text-indigo-600">
          <span class="text-sm">${item.text}</span>
        </label>`;
          })
          .join("");
    }

    async function saveCurrentProject() {
      if (!currentProject) return;
      const data = getProjectData(currentProject.id);
      const tStatus = document.getElementById(
        "detailStatus",
      ) as HTMLSelectElement;
      if (tStatus) data.status = tStatus.value;
      const tNotes = document.getElementById(
        "detailNotes",
      ) as HTMLTextAreaElement;
      if (tNotes) data.notes = tNotes.value;
      const tCode = document.getElementById(
        "codeEditor",
      ) as HTMLTextAreaElement;
      if (tCode) data.code = tCode.value;

      data.concepts = data.concepts || {};
      document.querySelectorAll("[data-concept]").forEach((ta) => {
        data.concepts[(ta as HTMLElement).dataset.concept!] = (
          ta as HTMLTextAreaElement
        ).value;
      });
      data.checklist = data.checklist || {};
      document.querySelectorAll("[data-check]").forEach((cb) => {
        data.checklist[(cb as HTMLElement).dataset.check!] = (
          cb as HTMLInputElement
        ).checked;
      });

      try {
        await apiUpdateInfraProject(currentProject.id, {
          status: data.status,
          interview: data.notes,
          scenario: data.code,
          concepts: data.concepts,
          checklist: data.checklist,
        });
        await loadData();
      } catch (e) {
        console.error(e);
      }

      updateProgress();
    }

    async function closeDetail() {
      await saveCurrentProject();
      document.getElementById("detailView")?.classList.add("hidden");
      document.getElementById("listView")?.classList.remove("hidden");
      currentProject = null;
      renderAll();
    }

    // Attach static events
    const btnBack = document.getElementById("btnBack");
    if (btnBack) btnBack.onclick = async () => await closeDetail();

    const btnDeleteProject = document.getElementById("btnDeleteProject");
    if (btnDeleteProject)
      btnDeleteProject.onclick = async () => {
        if (confirm("Excluir projeto?")) {
          await apiDeleteInfraProject(currentProject.id);
          await loadData();
          document.getElementById("detailView")?.classList.add("hidden");
          document.getElementById("listView")?.classList.remove("hidden");
        }
      };

    const btnSaveAll = document.getElementById("btnSaveAll");
    if (btnSaveAll)
      btnSaveAll.onclick = async () => {
        await saveCurrentProject();
        btnSaveAll.textContent = "Salvo!";
        setTimeout(() => (btnSaveAll.textContent = "Salvar"), 1000);
      };

    const btnCopyCode = document.getElementById("btnCopyCode");
    if (btnCopyCode)
      btnCopyCode.onclick = () => {
        const ed = document.getElementById("codeEditor") as HTMLTextAreaElement;
        if (ed) navigator.clipboard.writeText(ed.value);
      };

    const btnClearCode = document.getElementById("btnClearCode");
    if (btnClearCode)
      btnClearCode.onclick = () => {
        if (confirm("Limpar código?")) {
          const ed = document.getElementById(
            "codeEditor",
          ) as HTMLTextAreaElement;
          if (ed) ed.value = "";
        }
      };

    document.querySelectorAll(".dtab-btn").forEach((btn) => {
      (btn as HTMLElement).onclick = () => {
        document.querySelectorAll(".dtab-btn").forEach((b) => {
          b.classList.remove("tab-active");
          b.classList.add("text-slate-500");
        });
        btn.classList.add("tab-active");
        btn.classList.remove("text-slate-500");
        document
          .querySelectorAll(".dtab-panel")
          .forEach((p) => p.classList.add("hidden"));
        document
          .getElementById("dtab-" + (btn as HTMLElement).dataset.dtab)
          ?.classList.remove("hidden");
      };
    });

    document.querySelectorAll(".cat-filter").forEach((btn) => {
      (btn as HTMLElement).onclick = () => {
        document.querySelectorAll(".cat-filter").forEach((b) => {
          b.classList.remove(
            "active",
            "bg-indigo-100",
            "text-indigo-700",
            "dark:bg-indigo-900/40",
            "dark:text-indigo-300",
          );
          b.classList.add(
            "bg-slate-100",
            "dark:bg-slate-700",
            "text-slate-600",
            "dark:text-slate-300",
          );
        });
        btn.classList.add(
          "active",
          "bg-indigo-100",
          "text-indigo-700",
          "dark:bg-indigo-900/40",
          "dark:text-indigo-300",
        );
        currentCatFilter = (btn as HTMLElement).dataset.cat!;
        renderConcepts();
      };
    });

    document.querySelectorAll(".filter-btn").forEach((btn) => {
      (btn as HTMLElement).onclick = () => {
        document.querySelectorAll(".filter-btn").forEach((b) => {
          b.classList.remove(
            "active",
            "bg-indigo-100",
            "text-indigo-700",
            "dark:bg-indigo-900/40",
            "dark:text-indigo-300",
          );
          b.classList.add(
            "bg-slate-100",
            "dark:bg-slate-700",
            "text-slate-600",
            "dark:text-slate-300",
          );
        });
        btn.classList.add(
          "active",
          "bg-indigo-100",
          "text-indigo-700",
          "dark:bg-indigo-900/40",
          "dark:text-indigo-300",
        );
        currentFilter = (btn as HTMLElement).dataset.filter!;
        renderAll();
      };
    });

    document.querySelectorAll(".prio-btn").forEach((btn) => {
      (btn as HTMLElement).onclick = () => {
        document.querySelectorAll(".prio-btn").forEach((b) => {
          b.classList.remove(
            "active",
            "bg-indigo-100",
            "text-indigo-700",
            "dark:bg-indigo-900/40",
            "dark:text-indigo-300",
          );
          b.classList.add(
            "bg-slate-100",
            "dark:bg-slate-700",
            "text-slate-600",
            "dark:text-slate-300",
          );
        });
        btn.classList.add(
          "active",
          "bg-indigo-100",
          "text-indigo-700",
          "dark:bg-indigo-900/40",
          "dark:text-indigo-300",
        );
        currentPriority = (btn as HTMLElement).dataset.priority!;
        renderAll();
      };
    });

    document
      .getElementById("searchInput")
      ?.addEventListener("input", () => renderAll());

    function refreshRegCatSelect() {
      const sel = document.getElementById("regProjCat");
      if (!sel) return;
      sel.innerHTML = getCategories()
        .filter((c) => c.type === "projects")
        .map((c) => `<option value="${c.id}">${c.label}</option>`)
        .join("");
    }

    const btnOpenReg = document.getElementById("btnOpenRegister");
    if (btnOpenReg)
      btnOpenReg.onclick = () => {
        document.getElementById("registerModal")?.classList.remove("hidden");
        document.getElementById("registerModal")?.classList.add("flex");
        const regMsg = document.getElementById("regMsg");
        if (regMsg) regMsg.textContent = "";
        refreshRegCatSelect();
      };

    const btnCloseReg = document.getElementById("btnCloseRegister");
    if (btnCloseReg)
      btnCloseReg.onclick = () => {
        document.getElementById("registerModal")?.classList.add("hidden");
        document.getElementById("registerModal")?.classList.remove("flex");
      };

    document.querySelectorAll(".reg-tab").forEach((btn) => {
      (btn as HTMLElement).onclick = () => {
        document.querySelectorAll(".reg-tab").forEach((b) => {
          b.classList.remove(
            "active",
            "bg-indigo-100",
            "text-indigo-700",
            "dark:bg-indigo-900/40",
            "dark:text-indigo-300",
          );
          b.classList.add(
            "bg-slate-100",
            "dark:bg-slate-700",
            "text-slate-600",
            "dark:text-slate-300",
          );
        });
        btn.classList.add(
          "active",
          "bg-indigo-100",
          "text-indigo-700",
          "dark:bg-indigo-900/40",
          "dark:text-indigo-300",
        );
        const isCat = (btn as HTMLElement).dataset.regtab === "categoria";
        document
          .getElementById("regFormCat")
          ?.classList.toggle("hidden", !isCat);
        document
          .getElementById("regFormProj")
          ?.classList.toggle("hidden", isCat);
      };
    });

    const btnSaveCat = document.getElementById("btnSaveCat");
    if (btnSaveCat)
      btnSaveCat.onclick = () => {
        try {
          const catIdEl = document.getElementById(
            "regCatId",
          ) as HTMLInputElement;
          const catLabelEl = document.getElementById(
            "regCatLabel",
          ) as HTMLInputElement;
          const catId = catIdEl?.value.trim();
          if (!catId) throw new Error("Invalid ID");
          const entry = {
            id: catId,
            label: catLabelEl?.value.trim(),
            type: "projects",
          };
          apiCreateInfraCategory(entry).then(() => loadData());
          const regMsg = document.getElementById("regMsg");
          if (regMsg)
            regMsg.textContent =
              "Categoria criada. Agora adicione projetos (aba 2).";
          if (catIdEl) catIdEl.value = "";
          if (catLabelEl) catLabelEl.value = "";
          activeTabId = entry.id;
          (
            document.querySelector('[data-regtab="projeto"]') as HTMLElement
          )?.click();
          refreshRegCatSelect();
          const rpCat = document.getElementById(
            "regProjCat",
          ) as HTMLSelectElement;
          if (rpCat) rpCat.value = entry.id;
        } catch (e: any) {
          const regMsg = document.getElementById("regMsg");
          if (regMsg) regMsg.textContent = e.message;
        }
      };

    const btnSaveProj = document.getElementById("btnSaveProj");
    if (btnSaveProj)
      btnSaveProj.onclick = () => {
        try {
          const catId = (
            document.getElementById("regProjCat") as HTMLSelectElement
          )?.value;
          const name = (
            document.getElementById("regProjName") as HTMLInputElement
          )?.value.trim();
          if (!name) throw new Error("Invalid name");
          apiCreateInfraProject({
            category_id: catId,
            name,
            reqs: (
              document.getElementById("regProjReqs") as HTMLInputElement
            )?.value
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
            ext:
              (
                document.getElementById("regProjExt") as HTMLInputElement
              )?.value.trim() || "txt",
            priority: "media",
          }).then(() => loadData());
          const regMsg = document.getElementById("regMsg");
          if (regMsg) regMsg.textContent = "Projeto adicionado.";
          const rpName = document.getElementById(
            "regProjName",
          ) as HTMLInputElement;
          if (rpName) rpName.value = "";
          const rpReqs = document.getElementById(
            "regProjReqs",
          ) as HTMLInputElement;
          if (rpReqs) rpReqs.value = "";
          activeTabId = catId;
          renderAll();
        } catch (e: any) {
          const regMsg = document.getElementById("regMsg");
          if (regMsg) regMsg.textContent = e.message;
        }
      };

    // Initial render
    loadData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .card-hover { transition: all .2s ease; }
        .card-hover:hover { transform: translateY(-3px); box-shadow: 0 12px 24px -8px rgba(0,0,0,.12); }
        .tab-active { border-bottom: 3px solid #4f46e5; color: #4338ca; font-weight: 600; }
        .badge { font-size: .68rem; padding: .12rem .45rem; border-radius: 9999px; }
        .fade-in { animation: fadeIn .22s ease; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(5px); } to { opacity:1; transform:translateY(0); } }
        .code-editor { font-family: 'JetBrains Mono', Consolas, monospace; font-size: 13px; line-height: 1.55; tab-size: 2; }
        .code-editor:focus { outline: none; }
        .concept-item summary { cursor: pointer; list-style: none; }
        .concept-item summary::-webkit-details-marker { display: none; }
        .level-basico { background:#dcfce7; color:#166534; }
        .level-intermediario { background:#fef9c3; color:#854d0e; }
        .level-avancado { background:#ffedd5; color:#9a3412; }
        .level-expert { background:#fee2e2; color:#991b1b; }
        .dark .level-basico { background:#14532d40; color:#86efac; }
        .dark .level-intermediario { background:#713f1240; color:#fde047; }
        .dark .level-avancado { background:#7c2d1240; color:#fdba74; }
        .dark .level-expert { background:#7f1d1d40; color:#fca5a5; }
        .priority-alta { border-left: 3px solid #ef4444; }
        .priority-media { border-left: 3px solid #f59e0b; }
        .priority-baixa { border-left: 3px solid #94a3b8; }
      `,
        }}
      />

        <div id="listView">
          {/* Tabs dinâmicas */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 mb-4">
            <div
              id="tabsBar"
              className="flex overflow-x-auto gap-1 flex-1"
            ></div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 mb-4">
            <span className="text-[10px] font-medium text-slate-500 uppercase mr-1">
              Status:
            </span>
            <button
              data-filter="all"
              className="filter-btn active px-2.5 py-1 text-xs rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 font-medium"
            >
              Todos
            </button>
            <button
              data-filter="todo"
              className="filter-btn px-2.5 py-1 text-xs rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
            >
              A fazer
            </button>
            <button
              data-filter="doing"
              className="filter-btn px-2.5 py-1 text-xs rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
            >
              Em andamento
            </button>
            <button
              data-filter="done"
              className="filter-btn px-2.5 py-1 text-xs rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
            >
              Concluído
            </button>
            <span className="text-[10px] font-medium text-slate-500 uppercase ml-2 mr-1">
              Prioridade:
            </span>
            <button
              data-priority="all"
              className="prio-btn active px-2.5 py-1 text-xs rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 font-medium"
            >
              Todas
            </button>
            <button
              data-priority="alta"
              className="prio-btn px-2.5 py-1 text-xs rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
            >
              Alta
            </button>
            <button
              data-priority="media"
              className="prio-btn px-2.5 py-1 text-xs rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
            >
              Média
            </button>
          </div>

          <div id="panelsContainer"></div>
        </div>

        {/* DETAIL VIEW */}
        <div id="detailView" className="hidden">
          <div className="flex flex-wrap items-start gap-3 mb-5">
            <button
              id="btnBack"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Voltar
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span
                  id="detailCategory"
                  className="badge bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
                ></span>
                <span id="detailLevel" className="badge"></span>
                <span id="detailPriority" className="badge"></span>
                <span
                  id="detailTime"
                  className="badge bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                ></span>
              </div>
              <h2 id="detailTitle" className="text-xl font-bold"></h2>
              <div
                id="detailReqs"
                className="flex flex-wrap gap-1 mt-1.5"
              ></div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <select
                id="detailStatus"
                className="text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-2.5 py-1.5"
              >
                <option value="todo">A fazer</option>
                <option value="doing">Em andamento</option>
                <option value="done">Concluído</option>
              </select>
              <button
                id="btnDeleteProject"
                className="px-3 py-1.5 text-sm font-medium rounded-lg border border-red-600 text-red-600 hover:bg-red-50"
              >
                Excluir
              </button>
              <button
                id="btnSaveAll"
                className="px-3 py-1.5 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Salvar
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 border-b border-slate-200 dark:border-slate-700 mb-5">
            <button
              data-dtab="academico"
              className="dtab-btn tab-active px-4 py-2.5 text-sm"
            >
              Visão de Mercado
            </button>
            <button
              data-dtab="codigo"
              className="dtab-btn px-4 py-2.5 text-sm text-slate-500"
            >
              Código / Lab
            </button>
            <button
              data-dtab="conceitos"
              className="dtab-btn px-4 py-2.5 text-sm text-slate-500"
            >
              Conceitos
            </button>
            <button
              data-dtab="checklist"
              className="dtab-btn px-4 py-2.5 text-sm text-slate-500"
            >
              Checklist
            </button>
            <button
              data-dtab="notas"
              className="dtab-btn px-4 py-2.5 text-sm text-slate-500"
            >
              Notas / Entrevista
            </button>
          </div>

          <div id="dtab-academico" className="dtab-panel fade-in space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Objetivo de aprendizado
                </h3>
                <p id="detailObjective" className="text-sm leading-relaxed"></p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Cenário real (o que a vaga espera)
                </h3>
                <p id="detailScenario" className="text-sm leading-relaxed"></p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Pré-requisitos
                </h3>
                <ul
                  id="detailPrereqs"
                  className="text-sm space-y-1 list-disc list-inside"
                ></ul>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Certificações / ROI
                </h3>
                <div id="detailCerts" className="flex flex-wrap gap-1.5"></div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Como provar na entrevista
                </h3>
                <p id="detailInterview" className="text-sm leading-relaxed"></p>
              </div>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
              <h3 className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-1">
                Dica CT/MA/NY
              </h3>
              <p
                id="detailCertTip"
                className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed"
              ></p>
            </div>
          </div>

          <div id="dtab-codigo" className="dtab-panel hidden fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
                <span
                  className="text-xs text-slate-500 font-mono"
                  id="codeFilename"
                >
                  lab.sh
                </span>
                <div className="flex gap-2">
                  <button
                    id="btnCopyCode"
                    className="text-xs px-2 py-1 rounded border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    Copiar
                  </button>
                  <button
                    id="btnClearCode"
                    className="text-xs px-2 py-1 rounded border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    Limpar
                  </button>
                </div>
              </div>
              <textarea
                id="codeEditor"
                className="code-editor w-full h-[420px] p-4 bg-slate-900 text-slate-100 resize-y"
                spellCheck="false"
                placeholder="# Lab + automação deste projeto&#10;# 1) Ambiente mínimo  2) Script/playbook  3) Como validar sucesso  4) Como testar falha"
              ></textarea>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Inclua sempre: validação de entrada, tratamento de erro, log e
              critério de sucesso mensurável (health-check / restore / report).
            </p>
          </div>

          <div id="dtab-conceitos" className="dtab-panel hidden fade-in">
            <div className="mb-4 flex flex-wrap gap-2">
              <button
                data-cat="all"
                className="cat-filter active px-3 py-1 text-xs rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 font-medium"
              >
                Todos
              </button>
              <button
                data-cat="estrutura"
                className="cat-filter px-3 py-1 text-xs rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
              >
                Estrutura
              </button>
              <button
                data-cat="dados"
                className="cat-filter px-3 py-1 text-xs rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
              >
                Dados
              </button>
              <button
                data-cat="controle"
                className="cat-filter px-3 py-1 text-xs rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
              >
                Controle
              </button>
              <button
                data-cat="io"
                className="cat-filter px-3 py-1 text-xs rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
              >
                I/O
              </button>
              <button
                data-cat="qualidade"
                className="cat-filter px-3 py-1 text-xs rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
              >
                Qualidade
              </button>
            </div>
            <div id="conceptsContainer" className="space-y-2"></div>
          </div>

          <div id="dtab-checklist" className="dtab-panel hidden fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
              <h3 className="font-bold mb-1">
                Checklist de produção & entrevista
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                Marque só o que você realmente validou no lab.
              </p>
              <div id="checklistContainer" className="space-y-1"></div>
            </div>
          </div>

          <div id="dtab-notas" className="dtab-panel hidden fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
              <label className="text-xs font-semibold text-slate-500 uppercase">
                Notas de estudo + frase para entrevista
              </label>
              <textarea
                id="detailNotes"
                rows={12}
                className="mt-2 w-full text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
                placeholder="Erros do lab, comandos úteis, e 3–5 linhas: como eu explicaria este projeto numa entrevista em CT/MA/NY..."
              ></textarea>
            </div>
          </div>
        </div>

      {/* MODAL CADASTRO */}
      <div
        id="registerModal"
        className="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-black/40"
        style={{ backdropFilter: "blur(4px)" }}
      >
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-700">
          <div className="p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold">Cadastro</h3>
              <button
                id="btnCloseRegister"
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              <strong>1) Categoria</strong> (aba) → <strong>2) Projeto</strong>{" "}
              (card). Sem categoria não há vínculo.
            </p>
            <div className="flex gap-2 mb-4">
              <button
                data-regtab="categoria"
                className="reg-tab active px-3 py-1.5 text-sm rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 font-medium"
              >
                1. Categoria
              </button>
              <button
                data-regtab="projeto"
                className="reg-tab px-3 py-1.5 text-sm rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
              >
                2. Projeto
              </button>
            </div>
            <div id="regFormCat" className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">
                  ID (slug)
                </label>
                <input
                  id="regCatId"
                  type="text"
                  placeholder="ex: kubernetes"
                  className="mt-1 w-full text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 px-3 py-2"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">
                  Nome na aba
                </label>
                <input
                  id="regCatLabel"
                  type="text"
                  placeholder="ex: Terraform / IaC"
                  className="mt-1 w-full text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 px-3 py-2"
                />
              </div>
              <button
                id="btnSaveCat"
                className="w-full py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Criar categoria
              </button>
            </div>
            <div id="regFormProj" className="space-y-3 hidden">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">
                  Categoria
                </label>
                <select
                  id="regProjCat"
                  className="mt-1 w-full text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 px-3 py-2"
                ></select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">
                  Nome do projeto
                </label>
                <input
                  id="regProjName"
                  type="text"
                  placeholder="ex: Inventário AD com export CSV"
                  className="mt-1 w-full text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 px-3 py-2"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">
                  Requisitos (vírgula)
                </label>
                <input
                  id="regProjReqs"
                  type="text"
                  placeholder="ex: PowerShell, AD"
                  className="mt-1 w-full text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 px-3 py-2"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">
                  Extensão
                </label>
                <input
                  id="regProjExt"
                  type="text"
                  placeholder="ps1 / sh / py / tf"
                  className="mt-1 w-full text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 px-3 py-2"
                />
              </div>
              <button
                id="btnSaveProj"
                className="w-full py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Adicionar projeto
              </button>
            </div>
            <p id="regMsg" className="text-xs text-slate-500 mt-3"></p>
          </div>
        </div>
      </div>
    </div>
  );
}
