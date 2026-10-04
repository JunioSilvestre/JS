import { NextResponse } from "next/server";
import getDb from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDb();
    const id = (await params).id;
    const stmt = db.prepare(`SELECT * FROM bash_scripts WHERE id = ?`);
    const data = stmt.get(id);

    if (!data) {
      return NextResponse.json({ error: "Script not found" }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDb();
    const id = (await params).id;
    const data = await request.json();

    const stmt = db.prepare(`
      UPDATE bash_scripts 
      SET title = ?, problem = ?, script_content = ?, anatomy = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    const result = stmt.run(data.title, data.problem, data.script_content, data.anatomy || null, id);
    
    if (result.changes === 0) {
      return NextResponse.json({ error: "Script not found" }, { status: 404 });
    }

    return NextResponse.json({ data: { id, ...data } });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDb();
    const id = (await params).id;
    const stmt = db.prepare(`DELETE FROM bash_scripts WHERE id = ?`);
    const result = stmt.run(id);

    if (result.changes === 0) {
      return NextResponse.json({ error: "Script not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
