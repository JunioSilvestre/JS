"use server";

import getDb from "./db";
import { revalidatePath } from "next/cache";

// Módulos
export async function getModules() {
  const db = getDb();
  return db.prepare("SELECT * FROM modules ORDER BY created_at DESC").all();
}

export async function createModule(data: {
  id: string;
  title: string;
  description?: string;
  provider?: string;
  certification?: string;
  difficulty?: string;
}) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO modules (id, title, description, provider, certification, difficulty)
    VALUES (@id, @title, @description, @provider, @certification, @difficulty)
  `);
  stmt.run(data);
  revalidatePath("/");
  revalidatePath("/questions/create");
  return data.id;
}

// Categorias
export async function getCategories(moduleId: string) {
  if (!moduleId) return [];
  const db = getDb();
  return db
    .prepare("SELECT * FROM categories WHERE module_id = ? ORDER BY name ASC")
    .all(moduleId);
}

export async function createCategory(moduleId: string, name: string) {
  const db = getDb();
  const stmt = db.prepare(
    "INSERT OR IGNORE INTO categories (module_id, name) VALUES (?, ?)",
  );
  const result = stmt.run(moduleId, name);
  revalidatePath("/questions/create");
  return result.lastInsertRowid;
}

// Questões
export async function getQuestions(moduleId: string) {
  if (!moduleId) return [];
  const db = getDb();
  return db
    .prepare("SELECT * FROM questions WHERE module_id = ? ORDER BY id ASC")
    .all(moduleId);
}

export async function getNextQuestionNumber(moduleId: string) {
  const db = getDb();
  const row = db
    .prepare("SELECT COUNT(*) as count FROM questions WHERE module_id = ?")
    .get(moduleId) as { count: number };
  return (row.count || 0) + 1;
}

export async function saveQuestion(data: {
  id?: number | null;
  module_id: string;
  category: string;
  question_text: string;
  correct_answer: string;
  explanation?: string;
  command_name?: string;
  command_description?: string;
  command_flags?: unknown[];
  command_examples?: unknown[];
}) {
  const db = getDb();
  if (data.id) {
    db.prepare(
      `
      UPDATE questions 
      SET category = @category, question_text = @question_text, correct_answer = @correct_answer, explanation = @explanation,
          command_name = @command_name, command_description = @command_description, command_flags = @command_flags, command_examples = @command_examples
      WHERE id = @id
    `,
    ).run({
      ...data,
      command_flags: JSON.stringify(data.command_flags),
      command_examples: JSON.stringify(data.command_examples),
    });
  } else {
    db.prepare(
      `
      INSERT INTO questions (module_id, category, question_text, correct_answer, explanation, command_name, command_description, command_flags, command_examples)
      VALUES (@module_id, @category, @question_text, @correct_answer, @explanation, @command_name, @command_description, @command_flags, @command_examples)
    `,
    ).run({
      ...data,
      command_flags: JSON.stringify(data.command_flags),
      command_examples: JSON.stringify(data.command_examples),
    });
  }
  revalidatePath("/questions/create");
}

export async function deleteQuestion(id: number) {
  const db = getDb();
  db.prepare("DELETE FROM questions WHERE id = ?").run(id);
  revalidatePath("/questions/create");
}
