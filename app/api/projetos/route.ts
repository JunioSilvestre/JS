import { NextResponse } from "next/server";
import getDb from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = getDb();
    const projects = db.prepare("SELECT * FROM senior_projects ORDER BY id DESC").all();
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      title, scenario, requirements, duration, dependencies,
      detailed_description, technologies, code_examples, references_links,
      mock_test_logs
    } = body;

    if (!title || !scenario || !requirements || !duration) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = getDb();
    const stmt = db.prepare(`
      INSERT INTO senior_projects (
        title, scenario, requirements, duration, dependencies,
        detailed_description, technologies, code_examples, references_links, mock_test_logs
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      title, scenario, requirements, duration, dependencies || "",
      detailed_description || "", technologies || "", code_examples || "", references_links || "",
      mock_test_logs || ""
    );

    return NextResponse.json(
      { 
        id: result.lastInsertRowid, title, scenario, requirements, duration, dependencies,
        detailed_description, technologies, code_examples, references_links, mock_test_logs
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
