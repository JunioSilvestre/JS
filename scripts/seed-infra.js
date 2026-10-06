const Database = require("better-sqlite3");
const path = require("path");
const dbPath = path.join(process.cwd(), "cert-hub.db");
const db = new Database(dbPath);
const crypto = require("crypto");

const defaultCategories = [
  { id: "linux", label: "1. Linux Server", type: "projects" },
  { id: "windows", label: "2. Windows & AD", type: "projects" },
  { id: "virt", label: "3. Virtualização", type: "projects" },
  { id: "identity", label: "4. Identidade Híbrida", type: "projects" },
  { id: "cloud", label: "5. Azure / AWS", type: "projects" },
  { id: "auto", label: "6. Automação", type: "projects" },
  { id: "sec", label: "7. Segurança & Patch", type: "projects" },
  { id: "ops", label: "8. Backup / DR / Observability", type: "projects" },
  { id: "trilha", label: "Trilha 90 dias", type: "trilha" },
  { id: "certs", label: "Certificações ROI", type: "certs" },
];

const seedProjects = {
  linux: [
    {
      id: "lx1",
      name: "Inventário de host Linux (fatos + CSV/JSON)",
      reqs: ["Bash", "/etc/os-release", "lscpu"],
      ext: "sh",
      level: "intermediario",
      time: "3-4h",
      priority: "alta",
      objective:
        "Coletar hostname, OS, CPU, memória, disco e uptime de forma padronizada para CMDB/inventário.",
      scenario:
        "Empresa híbrida precisa inventário sem agent. Script via SSH ou local gera CSV para consolidação.",
      prereqs: ["Bash intermediário", "Leitura de /proc e comandos de sistema"],
      certs: ["RHCSA", "LPIC-1"],
      interview:
        "Explique quais fontes de verdade usou (os-release vs uname) e como tratou hosts sem um comando.",
      certTip:
        "Vagas MA/NY Linux pedem troubleshooting de SO e automação Bash; inventário é porta de entrada para Ansible.",
    },
    {
      id: "lx2",
      name: "Health-check de serviços systemd + restart controlado",
      reqs: ["systemctl", "Bash"],
      ext: "sh",
      level: "intermediario",
      time: "3-5h",
      priority: "alta",
      objective:
        "Detectar serviço down, reiniciar com política e registrar evidência.",
      scenario:
        "App crítico caiu à noite; on-call precisa script idempotente com log.",
      prereqs: ["systemd básico", "journalctl"],
      certs: ["RHCSA"],
      interview:
        "Diferença entre restart e try-restart; quando não reiniciar cegamente.",
      certTip: "RHCSA e operações CT/MA cobram systemd no dia a dia.",
    },
    {
      id: "lx3",
      name: "Hardening SSH + auditoria de sshd_config",
      reqs: ["sshd", "Bash"],
      ext: "sh",
      level: "avancado",
      time: "4-6h",
      priority: "alta",
      objective:
        "Validar baseline: sem root login, só key, PermitEmptyPasswords no.",
      scenario: "Compliance pede evidência de SSH endurecido em frota RHEL.",
      prereqs: ["sshd_config", "chaves SSH"],
      certs: ["RHCSA", "Security+"],
      interview: "Cite 5 parâmetros que você muda e o risco de cada um errado.",
      certTip:
        "Security+ e vagas com clearance em MA/CT valorizam hardening mensurável.",
    },
    {
      id: "lx4",
      name: "Monitoramento disco/inode + alerta",
      reqs: ["df", "du", "Bash"],
      ext: "sh",
      level: "basico",
      time: "2-3h",
      priority: "alta",
      objective: "Alertar filesystem e inodes antes de outage.",
      scenario: "/var enche por logs; precisa alerta e top diretórios.",
      prereqs: ["df -h", "df -i"],
      certs: ["LPIC-1", "RHCSA"],
      interview:
        "Por que inode cheio derruba app mesmo com espaço em disco livre?",
      certTip:
        "Operação básica que separa júnior de alguém que já apagou incêndio.",
    },
  ],
  windows: [
    {
      id: "wn1",
      name: "Inventário AD (users/computers) + export",
      reqs: ["PowerShell", "ActiveDirectory"],
      ext: "ps1",
      level: "intermediario",
      time: "4-6h",
      priority: "alta",
      objective:
        "Relatório de objetos AD com LastLogonDate, OU e enabled/disabled.",
      scenario:
        "Auditoria mensal e limpeza de contas — quase toda vaga Windows CT/MA/NY.",
      prereqs: ["Módulo ActiveDirectory", "RSAT"],
      certs: ["AZ-104"],
      interview: "LastLogon vs LastLogonTimestamp; impacto da replicação.",
      certTip:
        "AD + PowerShell é o combo mais repetido em vagas Windows da região.",
    },
    {
      id: "wn2",
      name: "Auditoria de Domain Admins e grupos privilegiados",
      reqs: ["PowerShell", "AD"],
      ext: "ps1",
      level: "intermediario",
      time: "3-5h",
      priority: "alta",
      objective:
        "Listar membership de grupos privilegiados e detectar mudança.",
      scenario: "Security pede evidência de quem é Domain Admin esta semana.",
      prereqs: ["Get-ADGroupMember"],
      certs: ["AZ-104", "Security+"],
      interview: "Princípio do menor privilégio e tiering de admin.",
      certTip:
        "Tema de entrevista e de compliance em fintech NY e healthcare CT.",
    },
    {
      id: "wn3",
      name: "Backup e inventário de GPO",
      reqs: ["PowerShell", "GroupPolicy"],
      ext: "ps1",
      level: "avancado",
      time: "4-6h",
      priority: "media",
      objective: "Backup versionado de GPOs antes de mudança.",
      scenario:
        "Antes de alterar baseline de segurança, backup + lista de links.",
      prereqs: ["GPMC", "Backup-GPO"],
      certs: ["AZ-104"],
      interview: "Ordem de precedência de GPO e herança.",
      certTip: "Mid/senior Windows em CT/MA costuma tocar GPO.",
    },
    {
      id: "wn4",
      name: "Health-check Domain Controller (dcdiag/repadmin wrap)",
      reqs: ["PowerShell", "repadmin"],
      ext: "ps1",
      level: "avancado",
      time: "4-6h",
      priority: "alta",
      objective: "Automatizar checagem de DC e resumir falhas.",
      scenario: "Logon lento; investigar replicação e serviços de DC.",
      prereqs: ["dcdiag", "repadmin"],
      certs: ["AZ-104"],
      interview: "O que você olha primeiro: DNS, time sync ou replication?",
      certTip: "Quem mexe em AD em produção precisa disso na ponta da língua.",
    },
  ],
  virt: [
    {
      id: "vt1",
      name: "Inventário VMware/lab: VMs, hosts, datastores (conceito + script)",
      reqs: ["PowerCLI ou docs vSphere", "inventário"],
      ext: "ps1",
      level: "intermediario",
      time: "5-8h",
      priority: "alta",
      objective:
        "Mapear capacidade e VMs órfãs; mesmo em lab nested ou documentação hands-on.",
      scenario: "Quase toda vaga on-prem CT/MA/NY cita VMware vSphere/ESXi.",
      prereqs: ["Conceitos ESXi/vCenter", "snapshots vs backup"],
      certs: ["VCP-DCV"],
      interview: "Snapshot não é backup — explique e diga quando usar cada um.",
      certTip:
        "Se não tiver lab VMware, use docs oficiais + nested ESXi ou Proxmox como analogia, mas nomeie a limitação.",
    },
    {
      id: "vt2",
      name: "Checklist de VM production-ready",
      reqs: ["VMware ou Hyper-V", "docs"],
      ext: "md",
      level: "intermediario",
      time: "3-4h",
      priority: "media",
      objective:
        "Definir critérios: tools, time sync, backup, recursos, anti-affinity.",
      scenario: "Antes de colocar VM em produção no cluster.",
      prereqs: ["Virtualização básica"],
      certs: ["VCP-DCV"],
      interview: "O que você valida em uma VM antes do go-live?",
      certTip: "Arquiteto pensa em padrão, não só em “subir a VM”.",
    },
  ],
  identity: [
    {
      id: "id1",
      name: "Mapa AD ↔ Entra ID (hybrid identity mental model)",
      reqs: ["AD", "Entra ID", "docs Microsoft"],
      ext: "md",
      level: "intermediario",
      time: "4-6h",
      priority: "alta",
      objective: "Documentar PHS vs PTA vs Federation e quando usar cada um.",
      scenario: "Vagas Azure híbrido em CT/NY pedem Entra ID + AD on-prem.",
      prereqs: ["AD básico", "conceito de IdP"],
      certs: ["AZ-104", "SC-300"],
      interview: "Diferença entre password hash sync e pass-through auth.",
      certTip:
        "AZ-104 + experiência hybrid identity abre muitas vagas da região.",
    },
    {
      id: "id2",
      name: "Joiner-Mover-Leaver: checklist automatizável",
      reqs: ["AD", "PowerShell", "M365 conceitos"],
      ext: "ps1",
      level: "avancado",
      time: "6-8h",
      priority: "alta",
      objective:
        "Fluxo de criação/desativação de conta com grupos e evidência.",
      scenario: "RH pede offboarding no mesmo dia — risco de conta viva.",
      prereqs: ["New/Disable-ADUser"],
      certs: ["AZ-104", "Security+"],
      interview:
        "Ordem segura de desprovisionamento (sessões, grupos, disable, delete).",
      certTip: "IAM bem feito é o que senior demonstra em entrevista.",
    },
  ],
  cloud: [
    {
      id: "cl1",
      name: "Lab Azure: VNet + VM + NSG + baseline tags",
      reqs: ["Azure", "Portal ou CLI", "tags"],
      ext: "sh",
      level: "intermediario",
      time: "6-10h",
      priority: "alta",
      objective: "Subir VM em VNet com NSG mínimo e tags CostCenter/Owner.",
      scenario:
        "Azure é a cloud mais citada em CT/MA/NY para hybrid Microsoft.",
      prereqs: ["Conta Azure free/student", "rede básica"],
      certs: ["AZ-104"],
      interview:
        "Como você segmenta rede e por que tag é obrigatória em governança.",
      certTip: "AZ-104 é o cert cloud com melhor ROI na sua região.",
    },
    {
      id: "cl2",
      name: "Inventário cloud (Azure ou AWS CLI) recursos sem tag",
      reqs: ["Azure CLI ou AWS CLI"],
      ext: "sh",
      level: "intermediario",
      time: "4-6h",
      priority: "media",
      objective: "Listar recursos sem tag Owner/CostCenter.",
      scenario: "FinOps e governança — tema de senior/arquiteto.",
      prereqs: ["CLI configurada"],
      certs: ["AZ-104", "AWS SAA"],
      interview: "Como você impediria recurso sem tag (policy vs detectivo)?",
      certTip: "Mostre mentalidade de governança, não só de “subir recurso”.",
    },
    {
      id: "cl3",
      name: "Backup/restore de VM cloud (conceito + lab)",
      reqs: ["Azure Backup ou snapshot AWS"],
      ext: "md",
      level: "intermediario",
      time: "4-6h",
      priority: "alta",
      objective: "Configurar backup e executar restore de teste.",
      scenario: "DR e backup aparecem em quase toda descrição sênior.",
      prereqs: ["VM cloud no lab"],
      certs: ["AZ-104"],
      interview: "RPO/RTO do seu lab e o que o restore provou.",
      certTip: "Backup sem teste de restore não conta em entrevista séria.",
    },
  ],
  auto: [
    {
      id: "au1",
      name: "PowerShell: módulo reutilizável de inventário Windows",
      reqs: ["PowerShell", "funções", "PSCredential"],
      ext: "ps1",
      level: "intermediario",
      time: "5-8h",
      priority: "alta",
      objective: "Transformar script solto em funções com parâmetros e log.",
      scenario:
        "Vagas NY/CT Windows exigem PowerShell de verdade, não só one-liners.",
      prereqs: ["Funções PowerShell", "error handling"],
      certs: ["AZ-104"],
      interview: "Mostre como você versiona e reutiliza automação no time.",
      certTip: "Automação é o filtro entre admin e engineer.",
    },
    {
      id: "au2",
      name: "Bash: set -euo pipefail + logging + exit codes",
      reqs: ["Bash"],
      ext: "sh",
      level: "intermediario",
      time: "3-4h",
      priority: "alta",
      objective: "Padrão mínimo de script production-grade.",
      scenario:
        "Linux engineer em MA/NY — scripts que não mentem no exit code.",
      prereqs: ["Bash básico"],
      certs: ["RHCSA"],
      interview: "O que cada flag de set -euo pipefail evita.",
      certTip: "Detalhe pequeno que mostra maturidade em code review.",
    },
    {
      id: "au3",
      name: "Ansible: playbook mínimo 2 hosts (ping + fato + pacote)",
      reqs: ["Ansible", "inventário"],
      ext: "yml",
      level: "intermediario",
      time: "6-10h",
      priority: "alta",
      objective:
        "Inventário + playbook idempotente aplicando um pacote/config.",
      scenario:
        "Ansible aparece em Linux NY e em Windows avançado (HRT-style).",
      prereqs: ["SSH keys", "YAML"],
      certs: ["RHCSA path", "automação"],
      interview: "Diferença entre task executada e task alterada (changed=1).",
      certTip: "Se souber Ansible + Linux bem, tem lugar em Boston/NY.",
    },
  ],
  sec: [
    {
      id: "sc1",
      name: "Script de patch management OS (update + log)",
      reqs: ["Bash/PowerShell"],
      ext: "sh",
      level: "intermediario",
      time: "4-6h",
      priority: "alta",
      objective:
        "Rodar yum/apt ou Install-WindowsUpdate, checar erro, fazer log.",
      scenario: "Rotina mensal de patching de infraestrutura legacy.",
      prereqs: ["Gerenciamento de pacotes"],
      certs: ["Security+", "RHCSA"],
      interview:
        "Como você lida com patching de sistema em produção que não pode parar (rolling update)?",
      certTip: "Segurança operacional é muito cobrada na entrevista técnica.",
    },
    {
      id: "sc2",
      name: "Auditoria de permissão de pasta/share SMB + ACLs Linux",
      reqs: ["ACL", "chmod/icacls"],
      ext: "ps1",
      level: "basico",
      time: "3-5h",
      priority: "alta",
      objective:
        "Detectar permissão global (777 ou Everyone Full Control) em shares vitais.",
      scenario: "Prevenção de ransomware — lateral movement.",
      prereqs: ["NTFS permissions", "POSIX ACLs"],
      certs: ["Security+", "AZ-104"],
      interview:
        'Por que "Everyone: Read" não basta para compliance se houver dados sensíveis?',
      certTip:
        "Ponto clássico de auditoria que cai sempre em SOC/Infra security.",
    },
  ],
  ops: [
    {
      id: "op1",
      name: "Plano de DR: matriz BIA simplificada",
      reqs: ["docs"],
      ext: "md",
      level: "expert",
      time: "4-6h",
      priority: "alta",
      objective: "Planilha/Doc de RPO/RTO e tiering de aplicação.",
      scenario: "Infra precisa justificar custo de backup multi-region.",
      prereqs: ["Conceitos de DR"],
      certs: ["Security+"],
      interview: "Mostre evidência de restore — não só de backup.",
      certTip: "Frase de ouro: backup não testado não existe.",
    },
    {
      id: "op2",
      name: "Coleta de métricas locais + threshold (CPU/mem/disk)",
      reqs: ["Bash", "psutil ou nativos"],
      ext: "sh",
      level: "intermediario",
      time: "4-6h",
      priority: "alta",
      objective: "Script de sampling com alerta por threshold.",
      scenario: "Monitoramento básico antes de Prometheus/Zabbix enterprise.",
      prereqs: ["vmstat/free/df"],
      certs: ["LPIC-1"],
      interview: "Como evita alerta falso positivo?",
      certTip: "Observability começa simples e evolui.",
    },
    {
      id: "op3",
      name: "Runbook de incidente: host inacessível (template)",
      reqs: ["metodologia", "docs"],
      ext: "md",
      level: "intermediario",
      time: "3-4h",
      priority: "media",
      objective: "Checklist de diagnóstico rede → OS → disco → app.",
      scenario: "On-call em CT/MA/NY; comunicação clara importa.",
      prereqs: ["Experiência básica de troubleshooting"],
      certs: ["Security+", "ITIL light"],
      interview: "Conte um incidente e sua ordem de investigação.",
      certTip: "Arquiteto também escreve runbook, não só desenha caixa.",
    },
  ],
};

try {
  db.prepare("DELETE FROM infra_projects").run();
  db.prepare("DELETE FROM infra_categories").run();

  const insertCat = db.prepare(
    "INSERT INTO infra_categories (id, label, type) VALUES (?, ?, ?)",
  );
  for (const c of defaultCategories) {
    insertCat.run(c.id, c.label, c.type);
  }

  const insertProj = db.prepare(`
    INSERT INTO infra_projects (id, category_id, name, reqs, ext, level, time, priority, objective, scenario, prereqs, certs, interview, certTip, status, concepts, checklist)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const catId of Object.keys(seedProjects)) {
    for (const p of seedProjects[catId]) {
      insertProj.run(
        p.id,
        catId,
        p.name,
        JSON.stringify(p.reqs || []),
        p.ext,
        p.level,
        p.time,
        p.priority,
        p.objective,
        p.scenario,
        JSON.stringify(p.prereqs || []),
        JSON.stringify(p.certs || []),
        p.interview,
        p.certTip,
        "todo",
        null,
        null,
      );
    }
  }
  console.log("Seed complete");
} catch (e) {
  console.error("Seed error:", e);
}
