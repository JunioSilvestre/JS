/* eslint-disable */
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'cert-hub.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS terminal_commands (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL DEFAULT 'comando',
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    examples TEXT,
    options TEXT,
    script_content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Migrate linux_commands
const linuxCmds = db.prepare('SELECT * FROM linux_commands').all();
const insertTerminal = db.prepare(`
  INSERT INTO terminal_commands (type, title, category, description, examples, options, created_at, updated_at)
  VALUES ('comando', @command, @category, @description, @examples, @options, @created_at, @updated_at)
`);

linuxCmds.forEach(cmd => {
  insertTerminal.run(cmd);
});

// Migrate bash_scripts
// bash_scripts has: title, problem, script_content, anatomy
const bashScripts = db.prepare('SELECT * FROM bash_scripts').all();
const insertBash = db.prepare(`
  INSERT INTO terminal_commands (type, title, category, description, script_content, options, created_at, updated_at)
  VALUES ('bash', @title, 'Bash Script', @problem, @script_content, @anatomy, @created_at, @updated_at)
`);

bashScripts.forEach(script => {
  insertBash.run(script);
});

console.log("Migration complete!");
