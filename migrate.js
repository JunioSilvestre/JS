/* eslint-disable @typescript-eslint/no-require-imports */
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), "cert-hub.db");
const db = new Database(dbPath);

try {
  db.exec(`
    ALTER TABLE senior_projects ADD COLUMN detailed_description TEXT;
    ALTER TABLE senior_projects ADD COLUMN technologies TEXT;
    ALTER TABLE senior_projects ADD COLUMN code_examples TEXT;
    ALTER TABLE senior_projects ADD COLUMN references_links TEXT;
  `);
  console.log("Migration successful!");
} catch (e) {
  console.log("Columns may already exist or error occurred:", e.message);
}
