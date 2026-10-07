import { NextResponse } from "next/server";
import getDb from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = getDb();
    const project = db.prepare("SELECT * FROM senior_projects WHERE id = ?").get(id);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
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
      UPDATE senior_projects 
      SET 
        title = ?, scenario = ?, requirements = ?, duration = ?, dependencies = ?, 
        detailed_description = ?, technologies = ?, code_examples = ?, references_links = ?,
        mock_test_logs = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    const result = stmt.run(
      title, scenario, requirements, duration, dependencies || "", 
      detailed_description || "", technologies || "", code_examples || "", references_links || "", 
      mock_test_logs || "",
      id
    );

    if (result.changes === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      id, title, scenario, requirements, duration, dependencies,
      detailed_description, technologies, code_examples, references_links, mock_test_logs 
    });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const db = getDb();
    const result = db.prepare("DELETE FROM senior_projects WHERE id = ?").run(id);

    if (result.changes === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
