import { NextRequest, NextResponse } from "next/server";
import getDb from "@/lib/db";

// GET /api/categories?module_id=xxx
export async function GET(req: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(req.url);
    const module_id = searchParams.get("module_id");

    if (!module_id) {
      return NextResponse.json(
        { error: "module_id is required" },
        { status: 400 },
      );
    }

    const categories = db
      .prepare("SELECT * FROM categories WHERE module_id = ? ORDER BY name ASC")
      .all(module_id);

    return NextResponse.json({ data: categories });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/categories
export async function POST(req: NextRequest) {
  try {
    const db = getDb();
    const body = await req.json();
    const { module_id, name } = body;

    if (!module_id || !name) {
      return NextResponse.json(
        { error: "module_id and name are required" },
        { status: 400 },
      );
    }
    if (name.trim().length < 2) {
      return NextResponse.json(
        { error: "Category name must be at least 2 characters" },
        { status: 400 },
      );
    }

    const moduleExists = db
      .prepare("SELECT id FROM modules WHERE id = ?")
      .get(module_id);
    if (!moduleExists) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 });
    }

    const result = db
      .prepare(
        "INSERT OR IGNORE INTO categories (module_id, name) VALUES (?, ?)",
      )
      .run(module_id, name.trim());

    const category = db
      .prepare("SELECT * FROM categories WHERE module_id = ? AND name = ?")
      .get(module_id, name.trim());

    return NextResponse.json(
      { data: category },
      { status: result.changes > 0 ? 201 : 200 },
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
