/**
 * Seed script — insere todos os módulos de certificação Linux no banco SQLite.
 * Execução: npx tsx scripts/seed-modules.ts
 */

import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, "..", "cert-hub.db");
const db = new Database(dbPath);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

interface ModuleData {
  id: string;
  title: string;
  description: string;
  provider: string;
  certification: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

const modules: ModuleData[] = [
  // ─── GUIA ───────────────────────────────────────────────────────────────────
  {
    id: "linux-study-guide",
    title: "Linux Study Material & Guides",
    description:
      "Guia central de estudos Linux abrangendo fundamentos, administração de sistemas, segurança e certificações. Inclui referências rápidas de comandos, man pages essenciais, estrutura FHS, gerenciamento de pacotes (APT/DNF/YUM), systemd, redes TCP/IP e shell scripting. Ponto de partida recomendado para todos os tracks de Linux.",
    provider: "LPI",
    certification: "GUIA",
    difficulty: "Beginner",
  },

  // ─── LPI Linux Essentials ────────────────────────────────────────────────────
  {
    id: "lpi-linux-essentials",
    title: "Linux Essentials (010-160)",
    description:
      "Certificação de entrada da LPI que valida conhecimentos básicos em Linux e Open Source. Tópicos: (1) A comunidade Linux e carreira em Open Source — evolução do Linux, distribuições, licenças FOSS; (2) Navegação no sistema Linux — linha de comando, diretórios, variáveis de ambiente; (3) O poder da linha de comando — pipes, redirecionamentos, filtros de texto (grep, awk, sed); (4) O sistema operacional Linux — hardware, processos, systemd, pacotes; (5) Segurança e permissões de arquivos — usuários, grupos, chmod, sudo. Prova: 40 questões em 60 minutos. Validade: Vitalícia.",
    provider: "LPI",
    certification: "Linux Essentials 010-160",
    difficulty: "Beginner",
  },

  // ─── LPI Security Essentials ─────────────────────────────────────────────────
  {
    id: "lpi-security-essentials",
    title: "Security Essentials (020-100)",
    description:
      "Certificação LPI focada em defesa digital e segurança da informação. Tópicos: (1) Conceitos de Segurança — metas, riscos, ética; (2) Criptografia — PKI, certificados TLS, criptografia de e-mail (GPG), criptografia de armazenamento (LUKS, VeraCrypt); (3) Segurança de Dispositivos — hardware, aplicações, malware, disponibilidade de dados, backups; (4) Segurança de Rede — firewalls, VPN, TLS, Tor, proxies, análise de tráfego; (5) Identidade e Privacidade — autenticação multifator (MFA), senhas, anonimato online, privacidade de dados. Prova: 40 questões em 60 minutos.",
    provider: "LPI",
    certification: "Security Essentials 020-100",
    difficulty: "Beginner",
  },

  // ─── LPIC-1 Exam 101-500 ────────────────────────────────────────────────────
  {
    id: "lpic1-101-500",
    title: "LPIC-1 Exam 101-500",
    description:
      "Primeiro exame da certificação LPIC-1 (versão 5.0). Cobre administração básica de sistemas Linux. Tópico 101 (peso 8): Arquitetura do sistema — BIOS/UEFI, boot loaders GRUB, runlevels e targets systemd. Tópico 102 (peso 12): Instalação e gerenciamento de pacotes — particionamento, LVM, bibliotecas compartilhadas, apt/dpkg, rpm/yum/dnf. Tópico 103 (peso 27): Comandos GNU/Unix — navegação, texto (grep/awk/sed/sort), gerenciamento de arquivos, pipes, redirecionamentos, compressão, processos, signals, vi. Tópico 104 (peso 13): Dispositivos, Filesystems e FHS — fdisk/parted, mkfs, fsck, montagem, permissões, links simbólicos, find. Prova: 60 questões em 90 minutos. Validade: 5 anos.",
    provider: "LPI",
    certification: "LPIC-1 Exam 101-500",
    difficulty: "Intermediate",
  },

  // ─── LPIC-1 Exam 102-500 ────────────────────────────────────────────────────
  {
    id: "lpic1-102-500",
    title: "LPIC-1 Exam 102-500",
    description:
      "Segundo exame da certificação LPIC-1 (versão 5.0). Tópico 105 (peso 8): Shells e Scripts — ambiente de shell, scripts bash, aliases, variáveis. Tópico 106 (peso 6): Interfaces de usuário e desktops — X11, Wayland, acessibilidade, localização e internacionalização. Tópico 107 (peso 8): Tarefas administrativas — gerenciamento de usuários/grupos (/etc/passwd, /etc/shadow), agendamento de tarefas (cron, at, systemd timers), fuso horário e idioma, impressão (CUPS). Tópico 108 (peso 6): Serviços essenciais — hora do sistema (NTP, chrony), logs (rsyslog, journald), MTA básico. Tópico 109 (peso 6): Fundamentos de rede — TCP/IP, ifconfig/ip, roteamento, DNS, SSH, wget, netstat/ss. Tópico 110 (peso 6): Segurança — hosts.allow/deny, sudo, criptografia de dados, GPG. Prova: 60 questões em 90 minutos. Validade: 5 anos.",
    provider: "LPI",
    certification: "LPIC-1 Exam 102-500",
    difficulty: "Intermediate",
  },

  // ─── LPIC-2 Exams 201/202 ───────────────────────────────────────────────────
  {
    id: "lpic2-201-202",
    title: "LPIC-2 Exams 201/202 (103 Questions)",
    description:
      "Certificação avançada de sysadmin Linux. Exame 201-450: Planejamento de capacidade (sar, iostat), Kernel Linux (compilação, módulos, sysctl), inicialização do sistema, filesystems avançados (RAID, LVM, quotas, iSCSI), configuração de rede avançada (bonding, VLANs, bridges), manutenção do sistema (backups, make). Exame 202-450: Servidores de nome DNS (BIND, named.conf, DNSSEC), serviços HTTP (Apache/Nginx, SSL/TLS, proxies reversos), compartilhamento de arquivos (Samba/CIFS, NFS), gerenciamento de clientes de rede (DHCP, PAM, SSSD, LDAP), serviços de e-mail (Postfix, Dovecot, SMTP/IMAP). Pré-requisito: LPIC-1 ativo. Prova: 60 questões por exame em 90 minutos. Validade: 5 anos.",
    provider: "LPI",
    certification: "LPIC-2 201-450 / 202-450",
    difficulty: "Advanced",
  },

  // ─── LFCA ───────────────────────────────────────────────────────────────────
  {
    id: "lfca-linux-foundation",
    title: "LFCA — Linux Foundation Associate",
    description:
      "Certificação de entrada da Linux Foundation (múltipla escolha). Domínios: System Administration Fundamentals (30%) — instalação Linux, gerenciamento de arquivos, shell, networking, troubleshooting; Cloud Computing Fundamentals (18%) — conceitos cloud (IaaS/PaaS/SaaS), contêineres, serverless, HA; Linux Fundamentals (16%) — estrutura do SO, sistema de arquivos, processos; Security Basics (10%) — permissões, firewalls, atualizações; Hardware/Drivers (14%) — dispositivos, módulos, storage; Programação Básica (12%) — scripts shell e Python básico. Prova: questões de múltipla escolha. Validade: 3 anos.",
    provider: "LPI",
    certification: "LFCA",
    difficulty: "Beginner",
  },

  // ─── LFCS ───────────────────────────────────────────────────────────────────
  {
    id: "lfcs-linux-foundation",
    title: "LFCS Prep (Linux Foundation)",
    description:
      "Certificação prática da Linux Foundation (performance-based, 17–20 tarefas em terminal real em 2 horas). Domínios: Essential Commands — manipulação de arquivos, text processing, shell; Operations & Deployment — kernel, processes, cron, systemd timers, packages, system recovery; Storage Management — particionamento, filesystems ext4/xfs, LVM, quotas; Networking — IPv4/IPv6, rotas, firewall (nftables/iptables), SSH, DNS; Security & User Management — usuários, grupos, ACLs, resource limits, sudo, PAM; Service Management — systemd units, targets, journald, sockets. Ambiente: sistema Linux real sem internet. Requer RHEL/Ubuntu/Debian.",
    provider: "LPI",
    certification: "LFCS",
    difficulty: "Intermediate",
  },

  // ─── RHCSA ──────────────────────────────────────────────────────────────────
  {
    id: "rhcsa-ex200",
    title: "RHCSA Prep (Red Hat EX200)",
    description:
      "Certificação prática da Red Hat baseada em RHEL 10 (performance-based, 3 horas, 70% para aprovação). Domínios: Essential Tools — bash, vim, man pages, localização de arquivos; System Configuration — boot, systemd services, systemd timers, NTP/chrony, Cockpit; Users & Groups — useradd, groupadd, /etc/passwd, /etc/shadow, sudo; Storage — partições MBR/GPT, mkfs ext4/xfs, LVM (pvcreate/vgcreate/lvcreate), Stratis, VDO; Software — DNF, AppStream modules, Flatpak; Networking — nmcli, nmtui, hostname, firewall-cmd; Security — SELinux contexts e booleans, SSH key-based auth, cron, at. Todos os configs devem persistir após reboot.",
    provider: "Red Hat",
    certification: "RHCSA EX200",
    difficulty: "Intermediate",
  },

  // ─── RHCE ───────────────────────────────────────────────────────────────────
  {
    id: "rhce-ex294",
    title: "RHCE Prep (Red Hat EX294)",
    description:
      "Certificação avançada da Red Hat focada em automação com Ansible (performance-based, 4 horas). Pré-requisito: RHCSA ativa. Domínios: RHCSA Skills — administração completa do sistema; Ansible Fundamentals — inventários estáticos/dinâmicos, ansible.cfg, ad-hoc commands; Playbooks — YAML syntax, tasks, handlers, tags, estratégias de execução; Variáveis e Facts — group_vars, host_vars, ansible_facts, register; Controle de Fluxo — when, loop, block/rescue/always, failed_when; Roles — criação com ansible-galaxy, dependências; Collections — instalação via requirements.yml; Templates Jinja2 — template module, filtros; Vault — ansible-vault, variáveis encriptadas. Ambiente: RHEL real com nós gerenciados.",
    provider: "Red Hat",
    certification: "RHCE EX294",
    difficulty: "Advanced",
  },

  // ─── CentOS / AlmaLinux / Rocky ─────────────────────────────────────────────
  {
    id: "centos-alma-rocky",
    title: "CentOS / AlmaLinux / Rocky Linux",
    description:
      "Material de referência para distribuições RHEL-compatíveis enterprise-grade. Cobre: História — CentOS (EOL 2021), AlmaLinux OS (CloudLinux, binário compatível com RHEL), Rocky Linux (Gregory Kurtzer). Diferenças entre versões RHEL 7/8/9/10. Gerenciamento de pacotes DNF/YUM, módulos AppStream. Firewalld e SELinux aplicados. NetworkManager (nmcli). Systemd — units, targets, journald. Gestão de usuários e grupos. Storage — LVM, XFS/ext4, Stratis. Containers — Podman, Buildah, Skopeo (alternativa enterprise ao Docker). Cockpit web UI. Migração CentOS → AlmaLinux/Rocky via elevate.",
    provider: "Red Hat",
    certification: "CENTOS",
    difficulty: "Intermediate",
  },

  // ─── Linux Junior Track ──────────────────────────────────────────────────────
  {
    id: "linux-junior-track",
    title: "Linux Junior Track (Fundamentals)",
    description:
      "Track de aprendizado para iniciantes em Linux. Módulos: Introdução ao Linux — história, kernel, distros (Ubuntu, Debian, Fedora, Arch). Terminal e Shell — bash, comandos básicos (ls, cd, pwd, cp, mv, rm, cat, less, head, tail). Sistema de Arquivos — estrutura FHS, inodes, permissões (rwx), chmod, chown. Usuários e Grupos — adduser, passwd, su, sudo, /etc/passwd. Gerenciamento de Pacotes — apt/apt-get (Debian), dnf (RHEL), pacman (Arch). Processos — ps, top, htop, kill, signals, jobs. Rede Básica — ip addr, ping, ss, traceroute, curl, wget. Editor de texto — vim básico (i, Esc, :wq, :q!). Redirecionar e Pipes — >, >>, |, 2>&1.",
    provider: "LPI",
    certification: "JÚNIOR",
    difficulty: "Beginner",
  },

  // ─── Linux Mid Track ─────────────────────────────────────────────────────────
  {
    id: "linux-mid-track",
    title: "Linux Mid Track (SysAdmin)",
    description:
      "Track intermediário para administradores Linux. Módulos: Systemd — units (service, timer, socket, path), targets, journalctl -u/-f/-p, systemctl mask/unmask. Storage Avançado — RAID sw (mdadm), LVM (snapshots, thin provisioning), quotas, iSCSI. Rede Avançada — bonding, bridge, VLANs, ip route, iptables/nftables. Segurança — SELinux/AppArmor, auditd, fail2ban, SSH hardening (AllowUsers, MaxAuthTries, PubkeyAuthentication). Backup e Recovery — rsync, tar, Amanda, Bacula, restore de sistema. Performance — vmstat, iostat, sar, perf, strace, lsof, tcpdump. Containers — Docker, Podman, namespaces Linux, cgroups. Automatização — bash scripting avançado, cron, at, anacron.",
    provider: "LPI",
    certification: "PLENO",
    difficulty: "Intermediate",
  },

  // ─── Linux Senior Track ──────────────────────────────────────────────────────
  {
    id: "linux-senior-track",
    title: "Linux Senior Track & SRE Architecture",
    description:
      "Track avançado para engenheiros sênior e SRE. Módulos: Kernel Internals — módulos, sysctl, cgroups v2, eBPF, namespaces. Arquitetura de Alta Disponibilidade — clustering (Pacemaker/Corosync), DRBD, HAProxy, keepalived. Infrastructure as Code — Ansible avançado (roles, collections, AWX), Terraform. Observabilidade SRE — Prometheus, Grafana, Alertmanager, SLI/SLO/SLA, error budgets, postmortems. Kubernetes — arquitetura, pods, deployments, services, ingress, PV/PVC, Helm, kubectl. Segurança Avançada — AppArmor profiles, audit rules, FIPS 140-2, hardening CIS Benchmark, Vault HashiCorp. Performance Engineering — CPU affinity, NUMA, huge pages, kernel bypass (DPDK). CI/CD — GitHub Actions, GitLab CI, Jenkins pipelines, ArgoCD/Flux (GitOps).",
    provider: "LPI",
    certification: "SÊNIOR",
    difficulty: "Advanced",
  },

  // ─── FHS ────────────────────────────────────────────────────────────────────
  {
    id: "fhs-filesystem-hierarchy",
    title: "FHS — Annotated Filesystem Hierarchy",
    description:
      "Referência completa e anotada do Filesystem Hierarchy Standard (FHS 3.0) utilizado em todas as distribuições Linux. Diretórios cobertos: / (raiz), /bin (binários essenciais), /boot (kernel, grub, initramfs), /dev (dispositivos — char, block, pseudo), /etc (configs do sistema — /etc/fstab, /etc/hosts, /etc/ssh, /etc/systemd), /home (home dos usuários), /lib e /lib64 (bibliotecas compartilhadas), /media e /mnt (montagens), /opt (software de terceiros), /proc (filesystem virtual do kernel), /root (home do root), /run (dados de runtime PID files), /sbin (binários de admin), /srv (dados de serviços), /sys (sysfs — devices, drivers), /tmp e /var/tmp, /usr (hierarquia secundária — /usr/bin, /usr/lib, /usr/share), /var (dados variáveis — /var/log, /var/spool, /var/cache). Inclui diferenças entre FHS e distros (Debian, RHEL, Arch).",
    provider: "LPI",
    certification: "FHS",
    difficulty: "Beginner",
  },

  // ─── Shell Scripting ─────────────────────────────────────────────────────────
  {
    id: "shell-scripting-automation",
    title: "Shell Scripting & Terminal Automation",
    description:
      "Domínio completo de shell scripting Bash e automação de terminal. Módulos: Fundamentos Bash — shebang, variáveis, expansão de parâmetros (${var:-default}, ${var#prefix}), quoting (single/double/backslash). Controle de Fluxo — if/elif/else, case, for, while, until, break, continue. Funções — declaração, escopo local, retorno de valores, recursão. Arrays — indexados e associativos, slicing, mapfile. Substituição de Processo — <(), $(), pipes entre processos. Regex e Text Processing — grep -E/-P, sed (substituição, deleção, ranges), awk (campos, BEGIN/END, arrays, printf), sort, uniq, cut, tr, column. I/O Avançado — here-doc, here-string, /dev/stdin/stdout/stderr, tee, xargs. Debugging — set -x/-e/-u/-o pipefail, trap EXIT ERR, shellcheck. Automação — cron, at, systemd timers, inotifywait, expect.",
    provider: "LPI",
    certification: "SHELL",
    difficulty: "Intermediate",
  },

  // ─── DevOps Tools / LPI 701 ─────────────────────────────────────────────────
  {
    id: "lpi-devops-701",
    title: "DevOps Tools Engineer (LPI 701)",
    description:
      "Certificação LPI DevOps Tools Engineer (701-100, 60 questões, 90 min). Domínio 701 — Software Engineering: desenvolvimento moderno (Agile, Scrum, Kanban), plataformas (cloud, PaaS), Git avançado (branching strategies, merge vs rebase, hooks), CI/CD (Jenkins, GitLab CI, GitHub Actions, pipelines), licenças Open Source (GPL, MIT, Apache, LGPL). Domínio 702 — Application Container: Docker (build, run, compose, networking, volumes), imagens OCI (Dockerfile best practices, multi-stage builds, BuildKit), orquestração de contêineres. Domínio 703 — Kubernetes: arquitetura (control plane, worker nodes, etcd), objetos (pods, deployments, services, configmaps, secrets, PV/PVC), operações (kubectl, namespaces, RBAC), Helm package manager. Domínio 704 — Security e Observability: cloud-native security (RBAC, network policies, secrets management), Prometheus (PromQL, alertas, exporters), log management (ELK/Loki), distributed tracing (Jaeger/Zipkin).",
    provider: "LPI",
    certification: "DevOps Tools 701-100",
    difficulty: "Advanced",
  },

  // ─── Material 2026 ───────────────────────────────────────────────────────────
  {
    id: "material-2026",
    title: "Material 2026",
    description:
      "Conteúdo atualizado para 2026 cobrindo as novidades do ecossistema Linux e certificações. Inclui: RHEL 10 — novidades (Flatpak nativo, systemd 255+, nftables como padrão, Python 3.12+); Kernel 6.x — io_uring, eBPF avanços, Rust no kernel; Containers — Podman 5.x, Buildah, Skopeo, Quadlets (systemd units para containers); Kubernetes 1.32+ — Gateway API GA, sidecar containers, in-place pod resizing; Observabilidade — OpenTelemetry como padrão da indústria; AI/MLOps em Linux — GPU drivers, CUDA, ROCm, KServe; Segurança — Linux Kernel 6.x security features, FIDO2/passkeys em sistemas Linux, confidential computing (TDX/SEV). Atualizado mensalmente com novidades das distribuições Debian 13 (Trixie), Ubuntu 26.04, Fedora 42.",
    provider: "LPI",
    certification: "NOVO",
    difficulty: "Intermediate",
  },
];

const insertStmt = db.prepare(`
  INSERT OR IGNORE INTO modules (id, title, description, provider, certification, difficulty)
  VALUES (@id, @title, @description, @provider, @certification, @difficulty)
`);

const insertMany = db.transaction((mods: ModuleData[]) => {
  let inserted = 0;
  let skipped = 0;
  for (const mod of mods) {
    const existing = db
      .prepare("SELECT id FROM modules WHERE id = ?")
      .get(mod.id);
    if (existing) {
      console.log(`  ⚠️  Skipped (already exists): ${mod.id}`);
      skipped++;
    } else {
      insertStmt.run(mod);
      console.log(`  ✅ Inserted: ${mod.id} — ${mod.title}`);
      inserted++;
    }
  }
  return { inserted, skipped };
});

console.log("\n🚀 Cert-Hub Module Seeder");
console.log("=".repeat(50));
const result = insertMany(modules);
console.log("=".repeat(50));
console.log(
  `\n✅ Done! Inserted: ${result.inserted} | Skipped: ${result.skipped} | Total: ${modules.length}\n`,
);

db.close();
