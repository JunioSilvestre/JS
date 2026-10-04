import { Metadata } from "next";
import getDb from "@/lib/db";
import PrintClient from "./PrintClient";

interface DBModule {
  id: string;
  title: string;
  description: string;
  provider: string;
  certification: string;
  difficulty: string;
  question_count: number;
  created_at: string;
}

interface DBQuestion {
  id: number;
  module_id: string;
  category: string;
  question_text: string;
  correct_answer: string;
  explanation: string;
  command_name: string;
  command_description: string;
  command_flags: string;
  command_examples: string;
}

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ category?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const db = getDb();
  const mod = db
    .prepare("SELECT title, certification FROM modules WHERE id = ?")
    .get(id) as DBModule | undefined;
  return {
    title: mod ? `${mod.title} — Print` : "Print",
  };
}

export default async function PrintPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { category } = await searchParams;
  const db = getDb();

  const mod = db
    .prepare(
      `
    SELECT m.*, COUNT(q.id) as question_count
    FROM modules m LEFT JOIN questions q ON q.module_id = m.id
    WHERE m.id = ? GROUP BY m.id
  `,
    )
    .get(id) as DBModule | undefined;

  if (!mod) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white text-gray-500">
        Module not found.
      </div>
    );
  }

  let questions: DBQuestion[];
  if (category) {
    questions = db
      .prepare(
        "SELECT * FROM questions WHERE module_id = ? AND category = ? ORDER BY id ASC",
      )
      .all(id, category) as DBQuestion[];
  } else {
    questions = db
      .prepare(
        "SELECT * FROM questions WHERE module_id = ? ORDER BY category, id ASC",
      )
      .all(id) as DBQuestion[];
  }

  const categories = db
    .prepare(
      "SELECT DISTINCT category FROM questions WHERE module_id = ? ORDER BY category",
    )
    .all(id) as { category: string }[];

  return (
    <PrintClient
      module={mod}
      questions={questions}
      categories={categories}
      selectedCategory={category || ""}
    />
  );
}
