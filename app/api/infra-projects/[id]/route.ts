import { NextResponse } from "next/server";
import getDb from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;
    const data = await req.json();
    const db = getDb();

    // Build dynamic UPDATE query
    const fields: string[] = [];
    const values: any[] = [];

    const updatable = [
      "name",
      "category_id",
      "ext",
      "level",
      "time",
      "priority",
      "objective",
      "scenario",
      "interview",
      "certTip",
      "status",
    ];
    const jsonFields = ["reqs", "prereqs", "certs", "concepts", "checklist"];

    for (const key of updatable) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(data[key]);
      }
    }

    for (const key of jsonFields) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(data[key] === null ? null : JSON.stringify(data[key]));
      }
    }

    if (fields.length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 },
      );
    }

    fields.push("updated_at = CURRENT_TIMESTAMP");

    const query = `UPDATE infra_projects SET ${fields.join(", ")} WHERE id = ?`;
    values.push(id);

    const stmt = db.prepare(query);
    stmt.run(...values);

    const updated = db
      .prepare(`SELECT * FROM infra_projects WHERE id = ?`)
      .get(id);
    return NextResponse.json({ data: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;
    const db = getDb();
    const stmt = db.prepare(`DELETE FROM infra_projects WHERE id = ?`);
    const info = stmt.run(id);

    if (info.changes === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
