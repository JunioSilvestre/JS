import Database from "better-sqlite3";
import path from "path";

let db: Database.Database;

function getDb(): Database.Database {
  const dbPath = process.env.DB_PATH || path.join(process.cwd(), "cert-hub.db");

  if (process.env.NODE_ENV === "test" && (!dbPath.includes("test") || dbPath.endsWith("cert-hub.db"))) {
    throw new Error(`ABORT: Cannot run tests against production/dev database (${dbPath}). DB_PATH must include 'test'.`);
  }

  if (!db) {
    db = new Database(dbPath);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    initSchema(db);
  }
  return db;
}

function initSchema(database: Database.Database): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS modules (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      provider TEXT,
      certification TEXT,
      difficulty TEXT CHECK(difficulty IN ('Beginner','Intermediate','Advanced')),
      color TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      module_id TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE,
      UNIQUE(module_id, name)
    );

    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      module_id TEXT NOT NULL,
      category TEXT NOT NULL,
      question_text TEXT NOT NULL,
      correct_answer TEXT NOT NULL,
      explanation TEXT,
      command_name TEXT,
      command_description TEXT,
      command_flags TEXT,
      command_examples TEXT,
      command_reference TEXT,
      command_syntax TEXT,
      command_options TEXT,
      command_arguments TEXT,
      command_how_it_works TEXT,
      command_system_impact TEXT,
      command_troubleshooting TEXT,
      command_security TEXT,
      command_related TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS bash_scripts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      problem TEXT NOT NULL,
      script_content TEXT NOT NULL,
      anatomy TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_questions_module ON questions(module_id);
    CREATE INDEX IF NOT EXISTS idx_categories_module ON categories(module_id);

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
}

export default getDb;
