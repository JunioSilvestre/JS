import { NextResponse } from "next/server";
import getDb from "@/lib/db";

export async function GET(request: Request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    let query = `SELECT * FROM bash_scripts`;
    const params: unknown[] = [];

    if (search) {
      query += ` WHERE title LIKE ? OR problem LIKE ?`;
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY created_at DESC`;

    const stmt = db.prepare(query);
    const data = stmt.all(...params);

    return NextResponse.json({ data, total: data.length });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const db = getDb();
    const data = await request.json();

    if (!data.title || !data.problem || !data.script_content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const stmt = db.prepare(`
      INSERT INTO bash_scripts (
        title, problem, script_content, anatomy
      ) VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(data.title, data.problem, data.script_content, data.anatomy || null);
    
    return NextResponse.json({
      data: { id: result.lastInsertRowid, ...data }
    }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
