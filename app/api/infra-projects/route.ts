import { NextResponse } from "next/server";
import getDb from "@/lib/db";
import crypto from "crypto";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category_id = searchParams.get("category_id");
    const db = getDb();

    let query = `SELECT * FROM infra_projects`;
    const params: any[] = [];

    if (category_id) {
      query += ` WHERE category_id = ?`;
      params.push(category_id);
    }
    query += ` ORDER BY created_at ASC`;

    const rows = db.prepare(query).all(...params);
    return NextResponse.json({ data: rows });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const {
      category_id,
      name,
      reqs,
      ext,
      level,
      time,
      priority,
      objective,
      scenario,
      prereqs,
      certs,
      interview,
      certTip,
      status,
      concepts,
      checklist,
    } = data;

    if (!category_id || !name) {
      return NextResponse.json(
        { error: "category_id and name are required" },
        { status: 400 },
      );
    }

    const db = getDb();
    const newId = crypto.randomUUID();

    const stmt = db.prepare(`
      INSERT INTO infra_projects (id, category_id, name, reqs, ext, level, time, priority, objective, scenario, prereqs, certs, interview, certTip, status, concepts, checklist)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      newId,
      category_id,
      name,
      reqs ? JSON.stringify(reqs) : null,
      ext || null,
      level || null,
      time || null,
      priority || "media",
      objective || null,
      scenario || null,
      prereqs ? JSON.stringify(prereqs) : null,
      certs ? JSON.stringify(certs) : null,
      interview || null,
      certTip || null,
      status || "todo",
      concepts ? JSON.stringify(concepts) : null,
      checklist ? JSON.stringify(checklist) : null,
    );

    const created = db
      .prepare(`SELECT * FROM infra_projects WHERE id = ?`)
      .get(newId);
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
