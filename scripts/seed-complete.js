const Database = require('better-sqlite3');
const path = require('path');
const crypto = require('crypto');

// Target the production/dev database used by port 3000
const dbPath = process.env.DB_PATH || path.join(process.cwd(), 'cert-hub.db');
const db = new Database(dbPath);

console.log(`Seeding complete card into database: ${dbPath}`);

// 1. Seed a Module
const moduleId = 'mod-full-' + Date.now();
db.prepare(`
  INSERT INTO modules (id, title, description, provider, certification, difficulty, color) 
  VALUES (?, ?, ?, ?, ?, ?, ?)
`).run(
  moduleId, 
  'Advanced Kubernetes Management', 
  'A complete module covering cluster administration, networking, and scaling.', 
  'Cloud Native Computing Foundation', 
  'CKA', 
  'Advanced', 
  '#326ce5'
);
console.log(`Created Module: ${moduleId}`);

// 2. Seed an Infra Category (if it doesn't exist)
let catId = 'kubernetes-projects';
try {
  db.prepare(`INSERT INTO infra_categories (id, label, type) VALUES (?, ?, ?)`).run(
    catId, 'Kubernetes Projects', 'projects'
  );
  console.log(`Created Infra Category: ${catId}`);
} catch (e) {
  // Category probably already exists, just continue
  console.log(`Infra Category already exists: ${catId}`);
}

// 3. Seed an Infra Project with all fields
const projId = 'proj-full-' + Date.now();
const projPayload = {
  id: projId,
  category_id: catId,
  name: 'Multi-node K8s Deployment with Cilium',
  reqs: JSON.stringify(['3 VMs (2 cores, 4GB RAM)', 'Ubuntu 24.04', 'Internet access']),
  ext: 'https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/',
  level: 'expert',
  time: '3h',
  priority: 'alta',
  objective: 'Deploy a highly available cluster with advanced networking and policies.',
  scenario: '```bash\n# Initialize cluster\nkubeadm init --pod-network-cidr=10.244.0.0/16\n# Install Cilium\nhelm install cilium cilium/cilium --version 1.14.0 --namespace kube-system\n```',
  prereqs: JSON.stringify(['Networking fundamentals', 'Linux shell scripting', 'Docker basics']),
  certs: JSON.stringify(['CKA', 'CKS']),
  interview: 'Explain how kube-proxy routes traffic compared to eBPF with Cilium.',
  certTip: 'Memorize kubeadm init flags for the CKA exam!',
  status: 'todo',
  concepts: JSON.stringify({
    'Control Plane': 'Master nodes running API, Controller, Scheduler.',
    'CNI': 'Container Network Interface for pod-to-pod communication.',
    'eBPF': 'Kernel technology for high-performance networking.'
  }),
  checklist: JSON.stringify({
    'Provision 3 VMs': true,
    'Install container runtime': true,
    'Initialize master node': false,
    'Join worker nodes': false,
    'Verify pod network': false
  })
};

db.prepare(`
  INSERT INTO infra_projects (
    id, category_id, name, reqs, ext, level, time, priority, objective, scenario, prereqs, certs, interview, certTip, status, concepts, checklist
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  projPayload.id,
  projPayload.category_id,
  projPayload.name,
  projPayload.reqs,
  projPayload.ext,
  projPayload.level,
  projPayload.time,
  projPayload.priority,
  projPayload.objective,
  projPayload.scenario,
  projPayload.prereqs,
  projPayload.certs,
  projPayload.interview,
  projPayload.certTip,
  projPayload.status,
  projPayload.concepts,
  projPayload.checklist
);

console.log(`Created Infra Project: ${projId}`);
console.log('Done!');
