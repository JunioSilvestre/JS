const Database = require('better-sqlite3');
const path = require('path');
const dbPath = process.env.DB_PATH || path.join(process.cwd(), 'cert-hub.db');
const db = new Database(dbPath);

console.log(`Clearing all data from database: ${dbPath}`);

const tables = [
  'infra_projects',
  'infra_categories',
  'bash_scripts',
  'questions',
  'categories',
  'modules'
];

db.pragma('foreign_keys = OFF'); // to allow dropping without cascade issues, though order handles it

tables.forEach(table => {
  console.log(`Clearing table: ${table}`);
  db.prepare(`DELETE FROM ${table}`).run();
});

db.pragma('foreign_keys = ON');

console.log('Database cleared successfully.');
