import { NextResponse } from "next/server";
import getDb from "@/lib/db";
import crypto from "crypto";

export async function GET() {
  try {
    const db = getDb();
    const rows = db
      .prepare(`SELECT * FROM infra_categories ORDER BY created_at ASC`)
      .all();
    return NextResponse.json({ data: rows });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { id, label, type } = data;

    if (!label) {
      return NextResponse.json({ error: "label is required" }, { status: 400 });
    }

    const db = getDb();
    const newId = id || crypto.randomUUID();
    const t = type || "projects";

    const stmt = db.prepare(`
      INSERT INTO infra_categories (id, label, type)
      VALUES (?, ?, ?)
    `);
    stmt.run(newId, label, t);

    const created = db
      .prepare(`SELECT * FROM infra_categories WHERE id = ?`)
      .get(newId);
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
