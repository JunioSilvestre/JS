const Database = require("better-sqlite3");
const path = require("path");
const dbPath = path.join(process.cwd(), "cert-hub.db");
const db = new Database(dbPath);
db.exec(`
    CREATE TABLE IF NOT EXISTS infra_categories (
      id TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'projects',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS infra_projects (
      id TEXT PRIMARY KEY,
      category_id TEXT NOT NULL,
      name TEXT NOT NULL,
      reqs TEXT,
      ext TEXT,
      level TEXT,
      time TEXT,
      priority TEXT,
      objective TEXT,
      scenario TEXT,
      prereqs TEXT,
      certs TEXT,
      interview TEXT,
      certTip TEXT,
      status TEXT DEFAULT 'todo',
      concepts TEXT,
      checklist TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES infra_categories(id) ON DELETE CASCADE
    );
`);
console.log("Migration complete");
