/**
 * Script completo:
 * 1. Adiciona coluna `color` na tabela modules (migration segura)
 * 2. Cria categorias temáticas em cada módulo existente
 * 3. Atribui cores discretas a cada módulo
 *
 * Execução: npx tsx scripts/seed-categories-colors.ts
 */

import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, "..", "cert-hub.db");
const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// ─── 1. Migration: adicionar coluna color ────────────────────────────────────
console.log("\n📦 Step 1: Adding 'color' column to modules...");
try {
  db.exec(`ALTER TABLE modules ADD COLUMN color TEXT DEFAULT ''`);
  console.log("  ✅ Column 'color' added.");
} catch {
  console.log("  ℹ️  Column 'color' already exists, skipping.");
}

// ─── 2. Definição de cores por módulo ────────────────────────────────────────
// Paleta de cores discretas: tons suaves que aparecem como borda/accent no card
// Formato: valor Tailwind para uso inline como CSS custom property
// Usaremos hex puro para facilitar inline styles no React
const MODULE_COLORS: Record<string, string> = {
  "linux-study-guide": "#6366f1", // indigo — guia geral
  "lpi-linux-essentials": "#10b981", // emerald — entrada/beginner
  "lpi-security-essentials": "#f59e0b", // amber — segurança
  "lpic1-101-500": "#3b82f6", // blue — LPIC-1 primeiro exame
  "lpic1-102-500": "#60a5fa", // blue-400 — LPIC-1 segundo exame
  "lpic2-201-202": "#8b5cf6", // violet — LPIC-2 avançado
  "lfca-linux-foundation": "#34d399", // emerald-400 — LFCA entry
  "lfcs-linux-foundation": "#06b6d4", // cyan — LFCS prática
  "rhcsa-ex200": "#ef4444", // red — Red Hat
  "rhce-ex294": "#dc2626", // red-600 — Red Hat avançado
  "centos-alma-rocky": "#f97316", // orange — enterprise RHEL compat
  "linux-junior-track": "#a3e635", // lime — junior/beginner track
  "linux-mid-track": "#eab308", // yellow — mid/sysadmin
  "linux-senior-track": "#ec4899", // pink — senior/SRE
  "fhs-filesystem-hierarchy": "#64748b", // slate — referência/docs
  "shell-scripting-automation": "#14b8a6", // teal — scripting/automação
  "lpi-devops-701": "#a855f7", // purple — DevOps/K8s
  "material-2026": "#f43f5e", // rose — novo/2026
};

// ─── 3. Aplicar cores ────────────────────────────────────────────────────────
console.log("\n🎨 Step 2: Applying colors to modules...");
const updateColor = db.prepare("UPDATE modules SET color = ? WHERE id = ?");
const applyColors = db.transaction(() => {
  let updated = 0;
  for (const [id, color] of Object.entries(MODULE_COLORS)) {
    const result = updateColor.run(color, id);
    if (result.changes > 0) {
      console.log(`  ✅ ${id} → ${color}`);
      updated++;
    } else {
      console.log(`  ⚠️  ${id} not found in DB, skipped`);
    }
  }
  return updated;
});
const colorsUpdated = applyColors();
console.log(`  → ${colorsUpdated} modules colored.`);

// ─── 4. Definição de categorias por módulo ───────────────────────────────────
// Categorias = tópicos/seções principais de cada certificação
// São usadas para organizar as questões por tema dentro do módulo
const MODULE_CATEGORIES: Record<string, string[]> = {
  "linux-study-guide": [
    "Referência de Comandos",
    "Estrutura do Sistema de Arquivos",
    "Gerenciamento de Processos",
    "Redes e Conectividade",
    "Segurança e Permissões",
    "Shell e Scripting",
    "Administração de Usuários",
    "Gerenciamento de Pacotes",
    "Armazenamento e Filesystems",
    "Monitoramento e Logs",
  ],

  "lpi-linux-essentials": [
    "Topic 1 — Linux Community & Open Source",
    "Topic 2 — Finding Your Way on Linux",
    "Topic 3 — The Power of the Command Line",
    "Topic 4 — The Linux Operating System",
    "Topic 5 — Security and File Permissions",
  ],

  "lpi-security-essentials": [
    "Topic 1 — Security Concepts",
    "Topic 2 — Encryption",
    "Topic 3 — Device and Storage Security",
    "Topic 4 — Network and Service Security",
    "Topic 5 — Identity and Privacy",
  ],

  "lpic1-101-500": [
    "101 — System Architecture (BIOS/UEFI, Boot, Runlevels)",
    "102 — Linux Installation & Package Management",
    "103.1 — Working on the Command Line",
    "103.2 — Processing Text Streams",
    "103.3 — File Management",
    "103.4 — Pipes, Redirection and Regex",
    "103.5 — Process Management",
    "103.6 — Modify Process Execution (nice, renice)",
    "103.7 — Search Text Files (grep, regular expressions)",
    "103.8 — Basic File Editing (vi)",
    "104 — Devices, Filesystems & FHS",
  ],

  "lpic1-102-500": [
    "105 — Shells and Shell Scripting",
    "106 — User Interfaces and Desktops",
    "107.1 — Manage User and Group Accounts",
    "107.2 — Automate System Administration (cron, at)",
    "107.3 — Localisation and Internationalisation",
    "108 — Essential System Services (NTP, Logging, MTA)",
    "109 — Networking Fundamentals",
    "110 — Security (sudo, SSH, GPG)",
  ],

  "lpic2-201-202": [
    "201 — Capacity Planning",
    "202 — Linux Kernel (Compilation, Modules, sysctl)",
    "203 — System Startup (SysVinit, systemd, GRUB)",
    "204 — Filesystems & Devices (RAID, LVM, iSCSI)",
    "205 — Advanced Networking (bonding, VLANs, bridges)",
    "206 — System Maintenance",
    "207 — DNS (BIND, named.conf, DNSSEC)",
    "208 — HTTP Services (Apache, Nginx, SSL/TLS)",
    "209 — File Sharing (Samba, NFS)",
    "210 — Network Client Management (DHCP, PAM, LDAP)",
    "211 — E-Mail Services (Postfix, Dovecot)",
    "212 — System Security",
  ],

  "lfca-linux-foundation": [
    "System Administration Fundamentals (30%)",
    "Cloud Computing Fundamentals (18%)",
    "Linux Fundamentals (16%)",
    "Security Best Practices (14%)",
    "Hardware & Drivers (12%)",
    "Basic Programming (10%)",
  ],

  "lfcs-linux-foundation": [
    "Essential Commands",
    "Operations & Deployment",
    "Storage Management",
    "Networking",
    "Security & User Management",
    "Service Management (systemd)",
  ],

  "rhcsa-ex200": [
    "Essential Tools (bash, vim, man, find)",
    "System Configuration & Management",
    "User and Group Management",
    "Storage (Partitions, LVM, XFS/ext4)",
    "Software Management (DNF, AppStream, Flatpak)",
    "Networking (nmcli, firewall-cmd)",
    "Security (SELinux, SSH, Sudo)",
    "Systemd Services & Timers",
    "System Boot & Recovery",
  ],

  "rhce-ex294": [
    "RHCSA Skills Review",
    "Ansible Fundamentals (inventory, ansible.cfg)",
    "Ad-hoc Commands & Modules",
    "Playbooks (YAML, tasks, handlers, tags)",
    "Variables, Facts & Registers",
    "Flow Control (when, loop, block/rescue)",
    "Roles & Galaxy",
    "Collections & requirements.yml",
    "Jinja2 Templates",
    "Ansible Vault",
  ],

  "centos-alma-rocky": [
    "Introdução e História (CentOS → AlmaLinux/Rocky)",
    "Instalação e Configuração Inicial",
    "Gerenciamento de Pacotes (DNF/YUM)",
    "Systemd e Serviços",
    "Redes (NetworkManager, nmcli)",
    "Armazenamento (LVM, XFS, Stratis)",
    "Segurança (SELinux, firewalld)",
    "Containers (Podman, Buildah, Skopeo)",
    "Cockpit Web UI",
    "Migração (CentOS → AlmaLinux/Rocky)",
  ],

  "linux-junior-track": [
    "Introdução ao Linux e Distribuições",
    "Terminal e Shell Basics",
    "Sistema de Arquivos e FHS",
    "Permissões de Arquivos (chmod, chown)",
    "Gerenciamento de Usuários e Grupos",
    "Gerenciamento de Pacotes",
    "Processos e Monitoramento Básico",
    "Redes Básicas (ip, ping, ss)",
    "Editor vim Básico",
    "Redirecionamentos e Pipes",
  ],

  "linux-mid-track": [
    "Systemd Avançado",
    "Armazenamento Avançado (RAID, LVM, Quotas)",
    "Redes Avançadas (bonding, VLANs, nftables)",
    "Segurança (SELinux/AppArmor, auditd, fail2ban)",
    "Backup e Recuperação (rsync, tar)",
    "Performance e Profiling",
    "Containers (Docker, Podman, cgroups)",
    "Shell Scripting Avançado",
    "Agendamento de Tarefas (cron, at, anacron)",
    "SSH e Acesso Remoto",
  ],

  "linux-senior-track": [
    "Kernel Internals (eBPF, cgroups v2, namespaces)",
    "Alta Disponibilidade (Pacemaker, HAProxy)",
    "Infrastructure as Code (Ansible avançado, Terraform)",
    "Observabilidade SRE (Prometheus, Grafana, SLO/SLA)",
    "Kubernetes (arquitetura, operações, Helm)",
    "Segurança Avançada (CIS Benchmark, FIPS, Vault)",
    "Performance Engineering (NUMA, huge pages, DPDK)",
    "CI/CD e GitOps (GitHub Actions, ArgoCD, Flux)",
    "Distributed Systems & Troubleshooting",
    "Incident Management & Postmortems",
  ],

  "fhs-filesystem-hierarchy": [
    "/ — Raiz e Hierarquia Geral",
    "/bin e /sbin — Binários Essenciais",
    "/boot — Kernel e Boot Loader",
    "/dev — Dispositivos",
    "/etc — Configurações do Sistema",
    "/home e /root — Diretórios de Usuário",
    "/lib e /lib64 — Bibliotecas Compartilhadas",
    "/proc — Filesystem Virtual do Kernel",
    "/sys — sysfs (Dispositivos e Drivers)",
    "/usr — Hierarquia Secundária",
    "/var — Dados Variáveis (logs, spool, cache)",
    "/tmp, /run, /opt, /mnt, /media",
  ],

  "shell-scripting-automation": [
    "Fundamentos Bash (variáveis, quoting, expansão)",
    "Controle de Fluxo (if, case, for, while, until)",
    "Funções e Escopo",
    "Arrays Indexados e Associativos",
    "Text Processing (grep, sed, awk)",
    "Redirecionamentos e I/O Avançado",
    "Debugging (set -x/-e/-u, shellcheck)",
    "Regex (ERE, PCRE)",
    "Automação (cron, systemd timers, inotifywait)",
    "Scripting Best Practices",
  ],

  "lpi-devops-701": [
    "701.1 — Modern Software Development (Agile, CI/CD)",
    "701.2 — Standard Components & Platforms",
    "701.3 — Source Code Management (Git)",
    "701.4 — CI/CD Pipelines",
    "701.5 — Open Source Licensing",
    "702.1 — Application Container Management (Docker)",
    "702.2 — Container Orchestration",
    "702.3 — Container Image Building",
    "703.1 — Kubernetes Architecture",
    "703.2 — Basic Kubernetes Operations (kubectl)",
    "703.3 — Kubernetes Package Management (Helm)",
    "704.1 — Cloud-Native Security",
    "704.2 — Prometheus Monitoring",
    "704.3 — Log Management",
    "704.4 — Distributed Tracing",
  ],

  "material-2026": [
    "RHEL 10 — Novidades e Mudanças",
    "Kernel Linux 6.x",
    "Containers 2026 (Podman 5, Quadlets)",
    "Kubernetes 1.32+ (Gateway API, Sidecar)",
    "OpenTelemetry e Observabilidade",
    "AI/MLOps em Linux (GPU, CUDA, ROCm)",
    "Segurança 2026 (FIDO2, Confidential Computing)",
    "Debian 13 / Ubuntu 26.04 / Fedora 42",
  ],
};

// ─── 5. Inserir categorias ────────────────────────────────────────────────────
console.log("\n📂 Step 3: Creating categories for each module...");

const insertCategory = db.prepare(
  "INSERT OR IGNORE INTO categories (module_id, name) VALUES (?, ?)",
);

const seedCategories = db.transaction(() => {
  let total = 0;
  let skipped = 0;
  for (const [moduleId, categories] of Object.entries(MODULE_CATEGORIES)) {
    const mod = db.prepare("SELECT id FROM modules WHERE id = ?").get(moduleId);
    if (!mod) {
      console.log(`  ⚠️  Module not found: ${moduleId}`);
      continue;
    }
    for (const name of categories) {
      const result = insertCategory.run(moduleId, name);
      if (result.changes > 0) {
        total++;
      } else {
        skipped++;
      }
    }
    console.log(`  ✅ ${moduleId} — ${categories.length} categories`);
  }
  return { total, skipped };
});

const catResult = seedCategories();
console.log(
  `\n  → ${catResult.total} categories created, ${catResult.skipped} already existed.`,
);

// ─── Relatório final ──────────────────────────────────────────────────────────
console.log("\n" + "=".repeat(55));
console.log("✅ Done!");
console.log(`   Colors applied  : ${colorsUpdated} modules`);
console.log(`   Categories added: ${catResult.total}`);
console.log("=".repeat(55) + "\n");

db.close();
