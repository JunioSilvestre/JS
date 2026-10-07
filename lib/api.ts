// Client-side API helpers — chamam as API routes REST
// Use estes em componentes 'use client'

const BASE = "/api";

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || `API error ${res.status}`);
  }
  return json;
}

// ── Modules ────────────────────────────────────────────────
export async function apiGetModules(params?: {
  search?: string;
  difficulty?: string;
}) {
  const qs = new URLSearchParams();
  if (params?.search) qs.set("search", params.search);
  if (params?.difficulty) qs.set("difficulty", params.difficulty);
  const query = qs.toString() ? `?${qs}` : "";
  return apiFetch<{ data: Module[]; total: number }>(`${BASE}/modules${query}`);
}

export async function apiGetModule(id: string) {
  return apiFetch<{ data: Module }>(`${BASE}/modules/${id}`);
}

export async function apiCreateModule(
  data: Omit<
    Module,
    "created_at" | "updated_at" | "question_count" | "category_count"
  >,
) {
  return apiFetch<{ data: Module }>(`${BASE}/modules`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function apiUpdateModule(id: string, data: Partial<Module>) {
  return apiFetch<{ data: Module }>(`${BASE}/modules/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function apiDeleteModule(id: string) {
  return apiFetch<{ message: string }>(`${BASE}/modules/${id}`, {
    method: "DELETE",
  });
}

// ── Categories ─────────────────────────────────────────────
export async function apiGetCategories(module_id: string) {
  return apiFetch<{ data: Category[] }>(
    `${BASE}/categories?module_id=${module_id}`,
  );
}

export async function apiCreateCategory(module_id: string, name: string) {
  return apiFetch<{ data: Category }>(`${BASE}/categories`, {
    method: "POST",
    body: JSON.stringify({ module_id, name }),
  });
}

export async function apiDeleteCategory(id: number) {
  return apiFetch<{ message: string }>(`${BASE}/categories/${id}`, {
    method: "DELETE",
  });
}

// ── Questions ──────────────────────────────────────────────
export async function apiGetQuestions(
  module_id: string,
  params?: {
    category?: string;
    search?: string;
    page?: number;
    limit?: string | number;
  },
) {
  const qs = new URLSearchParams({ module_id });
  if (params?.category) qs.set("category", params.category);
  if (params?.search) qs.set("search", params.search);
  if (params?.page) qs.set("page", params.page.toString());
  if (params?.limit) qs.set("limit", params.limit.toString());
  return apiFetch<{
    data: Question[];
    total: number;
    page?: number;
    limit?: number | "all";
  }>(`${BASE}/questions?${qs}`);
}

export async function apiCreateQuestion(
  data: Omit<Question, "id" | "created_at" | "updated_at">,
) {
  return apiFetch<{ data: Question }>(`${BASE}/questions`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function apiUpdateQuestion(id: number, data: Partial<Question>) {
  return apiFetch<{ data: Question }>(`${BASE}/questions/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function apiDeleteQuestion(id: number) {
  return apiFetch<{ message: string }>(`${BASE}/questions/${id}`, {
    method: "DELETE",
  });
}

// ── Bash Scripts ───────────────────────────────────────────
export async function apiGetBashScripts() {
  return apiFetch<{ data: BashScript[] }>(`${BASE}/bash`);
}

export async function apiGetBashScript(id: number) {
  return apiFetch<{ data: BashScript }>(`${BASE}/bash/${id}`);
}

export async function apiCreateBashScript(
  data: Omit<BashScript, "id" | "created_at" | "updated_at">,
) {
  return apiFetch<{ data: BashScript }>(`${BASE}/bash`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function apiUpdateBashScript(
  id: number,
  data: Partial<BashScript>,
) {
  return apiFetch<{ data: BashScript }>(`${BASE}/bash/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function apiDeleteBashScript(id: number) {
  return apiFetch<{ message: string }>(`${BASE}/bash/${id}`, {
    method: "DELETE",
  });
}

// ── Types ──────────────────────────────────────────────────
export interface Module {
  id: string;
  title: string;
  description: string;
  provider: string;
  certification: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  color?: string;
  created_at?: string;
  updated_at?: string;
  question_count?: number;
  category_count?: number;
}

export interface Category {
  id: number;
  module_id: string;
  name: string;
  created_at?: string;
}

export interface CommandFlag {
  flag: string;
  description: string;
}

export interface CommandExample {
  code: string;
}

export interface Question {
  id: number;
  module_id: string;
  category: string;
  question_text: string;
  correct_answer: string;
  explanation: string;
  command_name: string;
  command_description: string;
  command_flags: string | CommandFlag[];
  command_examples: string | CommandExample[];
  command_reference?: string;
  command_syntax?: string;
  command_options?: string;
  command_arguments?: string;
  command_how_it_works?: string;
  command_system_impact?: string;
  command_troubleshooting?: string;
  command_security?: string;
  command_related?: string;
  created_at?: string;
  updated_at?: string;
}

export function parseFlags(raw: string | CommandFlag[]): CommandFlag[] {
  if (Array.isArray(raw)) return raw;
  try {
    return JSON.parse(raw) || [];
  } catch {
    return [];
  }
}

export function parseExamples(
  raw: string | CommandExample[],
): CommandExample[] {
  if (Array.isArray(raw)) return raw;
  try {
    return JSON.parse(raw) || [];
  } catch {
    return [];
  }
}

export interface BashScript {
  id: number;
  title: string;
  problem: string;
  script_content: string;
  anatomy?: string;
  created_at?: string;
  updated_at?: string;
}

export interface InfraCategory {
  id: string;
  label: string;
  type: string;
  created_at?: string;
}

export interface InfraProject {
  id: string;
  category_id: string;
  name: string;
  reqs?: string[];
  ext?: string;
  level?: string;
  time?: string;
  priority?: string;
  objective?: string;
  scenario?: string;
  prereqs?: string[];
  certs?: string[];
  interview?: string;
  certTip?: string;
  status?: string;
  concepts?: Record<string, string>;
  checklist?: Record<string, boolean>;
  created_at?: string;
  updated_at?: string;
}

export async function apiGetInfraCategories() {
  return apiFetch<{ data: InfraCategory[] }>(`${BASE}/infra-categories`);
}

export async function apiCreateInfraCategory(data: Partial<InfraCategory>) {
  return apiFetch<{ data: InfraCategory }>(`${BASE}/infra-categories`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function apiGetInfraProjects(category_id?: string) {
  const qs = category_id ? `?category_id=${category_id}` : "";
  return apiFetch<{ data: InfraProject[] }>(`${BASE}/infra-projects${qs}`);
}

export async function apiCreateInfraProject(data: Partial<InfraProject>) {
  return apiFetch<{ data: InfraProject }>(`${BASE}/infra-projects`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function apiUpdateInfraProject(
  id: string,
  data: Partial<InfraProject>,
) {
  return apiFetch<{ data: InfraProject }>(`${BASE}/infra-projects/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function apiDeleteInfraProject(id: string) {
  return apiFetch<{ message: string }>(`${BASE}/infra-projects/${id}`, {
    method: "DELETE",
  });
}

// ── Projetos Senior ─────────────────────────────────────────
export interface ProjetoSenior {
  id: number;
  title: string;
  scenario: string;
  requirements: string;
  duration: string;
  dependencies: string;
  detailed_description: string;
  technologies: string;
  code_examples: string;
  references_links: string;
  mock_test_logs?: string;
  created_at?: string;
  updated_at?: string;
}

export async function apiGetProjetos() {
  return apiFetch<ProjetoSenior[]>(`${BASE}/projetos`);
}

export async function apiDeleteProjeto(id: number) {
  return apiFetch<{ message: string }>(`${BASE}/projetos/${id}`, {
    method: "DELETE",
  });
}
