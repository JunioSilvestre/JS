import { NextRequest, NextResponse } from "next/server";
import getDb from "@/lib/db";

// GET /api/modules - list all modules with question count
export async function GET(req: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const difficulty = searchParams.get("difficulty") || "";

    let query = `
      SELECT m.*, 
        COUNT(DISTINCT q.id) as question_count,
        COUNT(DISTINCT c.id) as category_count
      FROM modules m
      LEFT JOIN questions q ON q.module_id = m.id
      LEFT JOIN categories c ON c.module_id = m.id
      WHERE 1=1
    `;
    const params: string[] = [];

    if (search) {
      query += ` AND (m.title LIKE ? OR m.description LIKE ? OR m.certification LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (difficulty) {
      query += ` AND m.difficulty = ?`;
      params.push(difficulty);
    }

    query += ` GROUP BY m.id ORDER BY m.created_at DESC`;

    const modules = db.prepare(query).all(...params);
    return NextResponse.json({ data: modules, total: modules.length });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/modules - create module
export async function POST(req: NextRequest) {
  try {
    const db = getDb();
    const body = await req.json();
    const { id, title, description, provider, certification, difficulty } =
      body;

    if (!id || !title) {
      return NextResponse.json(
        { error: "id and title are required" },
        { status: 400 },
      );
    }
    if (!/^[a-z0-9-]+$/.test(id)) {
      return NextResponse.json(
        { error: "id must be lowercase alphanumeric with hyphens only" },
        { status: 400 },
      );
    }

    // Check duplicate
    const existing = db.prepare("SELECT id FROM modules WHERE id = ?").get(id);
    if (existing) {
      return NextResponse.json(
        { error: `Module with id "${id}" already exists` },
        { status: 409 },
      );
    }

    db.prepare(
      `
      INSERT INTO modules (id, title, description, provider, certification, difficulty)
      VALUES (@id, @title, @description, @provider, @certification, @difficulty)
    `,
    ).run({
      id,
      title,
      description: description || "",
      provider: provider || "",
      certification: certification || "",
      difficulty: difficulty || "Beginner",
    });

    const mod = db.prepare("SELECT * FROM modules WHERE id = ?").get(id);
    return NextResponse.json({ data: mod }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
