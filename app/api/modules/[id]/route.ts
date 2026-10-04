import { NextRequest, NextResponse } from "next/server";
import getDb from "@/lib/db";

// GET /api/modules/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const db = getDb();
    const { id } = await params;
    const mod = db
      .prepare(
        `
      SELECT m.*, 
        COUNT(DISTINCT q.id) as question_count,
        COUNT(DISTINCT c.id) as category_count
      FROM modules m
      LEFT JOIN questions q ON q.module_id = m.id
      LEFT JOIN categories c ON c.module_id = m.id
      WHERE m.id = ?
      GROUP BY m.id
    `,
      )
      .get(id);

    if (!mod)
      return NextResponse.json({ error: "Module not found" }, { status: 404 });
    return NextResponse.json({ data: mod });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT /api/modules/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const db = getDb();
    const { id } = await params;
    const body = await req.json();
    const { title, description, provider, certification, difficulty } = body;

    if (!title)
      return NextResponse.json({ error: "title is required" }, { status: 400 });

    const existing = db.prepare("SELECT id FROM modules WHERE id = ?").get(id);
    if (!existing)
      return NextResponse.json({ error: "Module not found" }, { status: 404 });

    db.prepare(
      `
      UPDATE modules 
      SET title = @title, description = @description, provider = @provider,
          certification = @certification, difficulty = @difficulty, updated_at = CURRENT_TIMESTAMP
      WHERE id = @id
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
    return NextResponse.json({ data: mod });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/modules/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const db = getDb();
    const { id } = await params;

    const existing = db.prepare("SELECT id FROM modules WHERE id = ?").get(id);
    if (!existing)
      return NextResponse.json({ error: "Module not found" }, { status: 404 });

    db.prepare("DELETE FROM modules WHERE id = ?").run(id);
    return NextResponse.json({ message: "Module deleted successfully" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
