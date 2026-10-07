const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "..", "cert-hub.db");
const db = new Database(dbPath);

const modules = [
  {
    id: "lpic1-101-500",
    title: "LPIC-1 Exam 101",
    description: "System Architecture, Linux Installation, GNU and Unix Commands, Filesystem Hierarchy",
    provider: "Linux Professional Institute",
    certification: "LPIC-1",
    difficulty: "Beginner",
    color: "blue"
  },
  {
    id: "lpic1-102-500",
    title: "LPIC-1 Exam 102",
    description: "Shells, Scripting, Data Management, Interfaces, Administrative Tasks, Services, Networking, Security",
    provider: "Linux Professional Institute",
    certification: "LPIC-1",
    difficulty: "Beginner",
    color: "blue"
  },
  {
    id: "az-900",
    title: "Azure Fundamentals",
    description: "Cloud Concepts, Azure Architecture and Services, Azure Management and Governance",
    provider: "Microsoft",
    certification: "AZ-900",
    difficulty: "Beginner",
    color: "blue"
  },
  {
    id: "az-104",
    title: "Azure Administrator",
    description: "Manage Azure Identities, Storage, Compute Resources, Virtual Networking, Monitor Resources",
    provider: "Microsoft",
    certification: "AZ-104",
    difficulty: "Intermediate",
    color: "blue"
  },
  {
    id: "lfcs",
    title: "LFCS",
    description: "Linux Foundation Certified IT System Administrator",
    provider: "Linux Foundation",
    certification: "LFCS",
    difficulty: "Intermediate",
    color: "green"
  }
];

const categories = {
  "lpic1-101-500": [
    "System Architecture",
    "Linux Installation and Package Management",
    "GNU and Unix Commands",
    "Devices, Linux Filesystems, Filesystem Hierarchy Standard"
  ],
  "lpic1-102-500": [
    "Shells and Shell Scripting",
    "Interfaces and Desktops",
    "Administrative Tasks",
    "Essential System Services",
    "Networking Fundamentals",
    "Security"
  ],
  "az-900": [
    "Cloud Concepts",
    "Azure Architecture and Services",
    "Azure Management and Governance"
  ],
  "az-104": [
    "Manage Azure Identities and Governance",
    "Implement and Manage Storage",
    "Deploy and Manage Azure Compute Resources",
    "Configure and Manage Virtual Networking",
    "Monitor and Maintain Azure Resources"
  ],
  "lfcs": [
    "Essential Commands",
    "Operation of Running Systems",
    "User and Group Management",
    "Networking",
    "Service Configuration",
    "Storage Management"
  ]
};

try {
  db.exec("BEGIN TRANSACTION;");

  const insertModule = db.prepare(`
    INSERT OR IGNORE INTO modules (id, title, description, provider, certification, difficulty, color)
    VALUES (@id, @title, @description, @provider, @certification, @difficulty, @color)
  `);

  for (const mod of modules) {
    insertModule.run(mod);
  }

  const insertCategory = db.prepare(`
    INSERT OR IGNORE INTO categories (module_id, name)
    VALUES (@module_id, @name)
  `);

  for (const [moduleId, cats] of Object.entries(categories)) {
    for (const cat of cats) {
      insertCategory.run({ module_id: moduleId, name: cat });
    }
  }

  db.exec("COMMIT;");
  console.log("Successfully seeded modules and professional categories.");
} catch (error) {
  db.exec("ROLLBACK;");
  console.error("Error seeding DB:", error);
} finally {
  db.close();
}
