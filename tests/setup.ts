import path from 'path';
import { beforeEach, afterAll } from 'vitest';
import getDb from '../lib/db';
import { config } from 'dotenv';

config({ path: path.resolve(__dirname, '../.env.test') });

// Setup env to ensure tests run against cert-hub-test.db
if (!process.env.DB_PATH) {
  process.env.DB_PATH = 'cert-hub-test.db';
}

const db = getDb();

const tables = [
  'modules',
  'categories',
  'questions',
  'bash_scripts',
  'infra_categories',
  'infra_projects'
];

beforeEach(() => {
  // Truncate tables before each test
  const truncateTransaction = db.transaction(() => {
    // Disable foreign keys temporarily for truncation if necessary,
    // though DELETE should cascade if set up, or just delete in order.
    // In sqlite, we can just delete from all tables.
    for (const table of tables) {
      db.prepare(`DELETE FROM ${table}`).run();
    }
  });
  truncateTransaction();
});

afterAll(() => {
  // db.close(); // Not strictly needed, better-sqlite3 handles it.
});
